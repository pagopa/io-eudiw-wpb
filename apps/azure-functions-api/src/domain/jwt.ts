import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as H from '@pagopa/handler-kit';
import { NonEmptyString } from '@pagopa/ts-commons/lib/strings';
import { JwkPublicKey } from './jwk';
import * as jose from 'jose';

export interface JWT<A, B> {
  readonly header: A;
  readonly payload: B;
}

// a unique brand for SignedJWT
interface SignedJWTBrand {
  // use `unique symbol` here to ensure uniqueness across modules / packages
  readonly SignedJWT: unique symbol;
}
export const SignedJWTCodec = t.brand(
  NonEmptyString,
  (str): str is t.Branded<NonEmptyString, SignedJWTBrand> => str.length > 0,
  'SignedJWT',
);
export type SignedJWT = t.TypeOf<typeof SignedJWTCodec>;

export const parseSignedJWT = <T>(
  jwt: SignedJWT,
  decoder: t.Decoder<unknown, T>,
) =>
  pipe(
    E.tryCatch(() => jose.decodeJwt(jwt), E.toError),
    E.flatMap(H.parse(decoder)),
  );

// verify that the jwt is signed by a private key linked to the given public key
export const verifySignature = (jwt: SignedJWT, publicKey: JwkPublicKey) =>
  pipe(
    TE.tryCatch(() => jose.importJWK(publicKey), E.toError),
    TE.flatMap((publicKey) =>
      TE.tryCatch(() => jose.jwtVerify(jwt, publicKey), E.toError),
    ),
  );

export const calculateJwkThumbprint = (publicKey: JwkPublicKey) =>
  TE.tryCatch(
    () => jose.calculateJwkThumbprint(publicKey, 'sha256'),
    E.toError,
  );
