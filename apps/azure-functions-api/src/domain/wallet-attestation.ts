import * as t from 'io-ts';
import * as Apply from 'fp-ts/lib/Apply';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as H from '@pagopa/handler-kit';
import * as crypto from 'crypto';
import * as jose from 'jose';
import { NonEmptyString } from '@pagopa/ts-commons/lib/strings';
import { JwkPublicKey } from './jwk';
import { JWT, SignedJWT, parseSignedJWT, verifySignature } from './jwt';
import { pipe } from 'fp-ts/lib/function';
import { validateNonce } from './nonce';
import { WalletInstance, getWalletInstance } from './wallet-instance';
import { User } from './user';
import { signJwt } from './signer';

export const WalletAttestationRequestHeader = t.type({
  alg: t.string,
  kid: t.string,
  typ: t.literal('war+jwt'),
});

export const WalletAttestationRequestPayload = t.type({
  challenge: NonEmptyString,
  cnf: t.type({
    jwk: JwkPublicKey,
  }),
  exp: t.number,
  hardware_key_tag: NonEmptyString,
  hardware_signature: NonEmptyString,
  iat: t.number,
  integrity_assertion: NonEmptyString,
  iss: t.string,
  sub: t.string,
});

// the wallet attestation request is a JWT
type WalletAttestationRequest = JWT<
  t.TypeOf<typeof WalletAttestationRequestHeader>,
  t.TypeOf<typeof WalletAttestationRequestPayload>
>;

// return a signed JWT
export const createWalletAttestation = (jwt: SignedJWT, userId: User['id']) =>
  pipe(
    // verify wallet attestation request consistency
    RTE.fromTaskEither(verifyAndExtractWalletAttestationRequest(jwt)),
    // verify and consume the nonce
    RTE.chainFirst((jwt) => validateNonce(jwt.payload.challenge)),
    // verify that there is a Wallet Instance registered with that hardware_key_tag and that it is still valid.
    RTE.flatMap((war) =>
      pipe(
        getWalletInstance(war.payload.hardware_key_tag, userId),
        RTE.map((wi) => ({ wi, war })),
      ),
    ),
    // validate hardware_signature
    RTE.flatMapTaskEither(({ wi, war }) => verifyHardwareSignature(wi, war)),
    // skip: validate integrity_assertion
    // check the iss
    // forge a new wallet attestation
    RTE.flatMap(makeWalletAttestation),
    RTE.map(({ jwt }) => jwt),
  );

const verifyAndExtractWalletAttestationRequest = (jwt: SignedJWT) =>
  pipe(
    TE.fromEither(parseSignedJWT(jwt, WalletAttestationRequestPayload)),
    // verify the signature of jwt
    TE.flatMap(({ cnf: { jwk } }) => verifySignature(jwt, jwk)),
    // parse and return the jwt
    TE.flatMapEither((verified) =>
      Apply.sequenceS(E.Apply)({
        header: pipe(
          verified.protectedHeader,
          H.parse(WalletAttestationRequestHeader, 'Invalid jwt header'),
        ),
        payload: pipe(
          verified.payload,
          H.parse(WalletAttestationRequestPayload, 'Invalid jwt payload'),
        ),
      }),
    ),
  );

const verifyHardwareSignature = (
  wi: WalletInstance,
  war: WalletAttestationRequest,
) =>
  TE.tryCatch(async () => {
    const { challenge, hardware_signature, cnf } = war.payload;
    const publicKey = await jose.importJWK(wi.hardwareKey);
    if (!('type' in publicKey))
      // eslint-disable-next-line functional/no-throw-statements, functional/no-promise-reject
      throw new Error('Invalid Hardware Key format');
    const publicKeyPem = await jose.exportSPKI(publicKey);

    const jwk_thumbprint = await jose.calculateJwkThumbprint(cnf.jwk, 'sha256');
    const clientData = { challenge, jwk_thumbprint };

    const clientDataHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(clientData))
      .digest();

    const verifier = crypto.createVerify('sha256');
    // eslint-disable-next-line functional/no-expression-statements
    verifier.update(clientDataHash);
    const isHardwareSignatureValid = verifier.verify(
      publicKeyPem,
      hardware_signature,
      'base64',
    );
    if (isHardwareSignatureValid === true) return war;
    // eslint-disable-next-line functional/no-promise-reject, functional/no-throw-statements
    else throw new Error('hardware_signature is invalid');
  }, E.toError);

const makeWalletAttestation = (war: WalletAttestationRequest) =>
  pipe(
    RTE.of({
      header: {
        typ: 'wallet-attestation+jwt',
      },
      payload: {
        sub: war.header.kid,
        cnf: war.payload.cnf,
      },
    }),
    RTE.flatMap(signJwt),
  );
