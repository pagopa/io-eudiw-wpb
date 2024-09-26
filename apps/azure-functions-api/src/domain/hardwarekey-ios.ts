import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as H from '@pagopa/handler-kit';
import * as jose from 'jose';
import * as cbor from 'cbor-x';
import { CreateWalletInstanceBody as WalletInstanceRequest } from '../generated/definitions/endpoints/CreateWalletInstanceBody';
import { X509Certificate } from 'crypto';
import { JwkPublicKey } from './jwk';

const buffer = new t.Type<Buffer, Buffer, unknown>(
  'buffer',
  (input: unknown): input is Buffer => Buffer.isBuffer(input),
  (input, context) =>
    Buffer.isBuffer(input) ? t.success(input) : t.failure(input, context),
  t.identity,
);

// iOS attestation type
export const iOsAttestation = t.type({
  attStmt: t.type({
    receipt: buffer,
    x5c: t.array(buffer),
  }),
  authData: buffer,
  fmt: t.literal('apple-appattest'),
});

export type iOsAttestation = t.TypeOf<typeof iOsAttestation>;

export const extractHardwareKeyFromIOS = (request: WalletInstanceRequest) =>
  pipe(
    E.tryCatch(
      () => Buffer.from(request.key_attestation, 'base64'),
      () => new Error(`[iOS Hardware Key] Invalid attestation`),
    ),
    E.flatMap((data) =>
      E.tryCatch(
        () => cbor.decode(data),
        () => new Error(`[iOS Hardware Key] Unable to decode data`),
      ),
    ),
    E.flatMap(
      H.parse(iOsAttestation, '[iOS Hardware Key] Invalid Attestation'),
    ),
    TE.fromEither,
    TE.flatMap((attestation) =>
      TE.tryCatch(
        () => {
          const { attStmt } = attestation;
          const certificates = attStmt.x5c.map(
            (data) => new X509Certificate(data),
          );
          const clientCertificate = certificates.find((certificate) =>
            certificate.issuer.includes('Apple App Attestation CA 1'),
          );
          if (clientCertificate === undefined) {
            // eslint-disable-next-line functional/no-throw-statements
            throw new Error(
              '[iOS Hardware Key] No client CA certificate found',
            );
          }
          // extract and return the hardware key
          return jose.exportJWK(clientCertificate.publicKey);
        },
        () => new Error('[iOS Hardware Key] Error extracting publicKey'),
      ),
    ),
    TE.flatMapEither(
      H.parse(JwkPublicKey, '[iOS Hardware Key] Invalid PublicKey'),
    ),
  );
