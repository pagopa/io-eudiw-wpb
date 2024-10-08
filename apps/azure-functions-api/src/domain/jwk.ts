import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

export const ECKey = t.intersection([
  t.type({
    crv: t.string,
    kty: t.literal('EC'),
    x: t.string,
    y: t.string,
  }),
  t.partial({
    kid: t.string,
  }),
]);
export type ECKey = t.TypeOf<typeof ECKey>;

export const ECPrivateKey = t.intersection([
  ECKey,
  t.type({
    d: t.string,
  }),
]);
export type ECPrivateKey = t.TypeOf<typeof ECPrivateKey>;

export const RSAKey = t.intersection([
  t.type({
    e: t.string,
    kty: t.literal('RSA'),
    n: t.string,
  }),
  t.partial({
    alg: t.string,
    kid: t.string,
  }),
]);
export type RSAKey = t.TypeOf<typeof RSAKey>;

export const RSAPrivateKey = t.intersection([
  RSAKey,
  t.type({
    d: t.string,
  }),
  t.partial({
    dp: t.string,
    dq: t.string,
    p: t.string,
    q: t.string,
    qi: t.string,
    u: t.string,
  }),
]);
export type RSAPrivateKey = t.TypeOf<typeof RSAPrivateKey>;

/**
 * The Public Key JWK type. It could be either an ECKey or an RSAKey.
 */
export const JwkPublicKey = t.union([RSAKey, ECKey], 'JwkPublicKey');
export type JwkPublicKey = t.TypeOf<typeof JwkPublicKey>;

/**
 * The Private Key JWK type. It could be either an ECPrivateKey or an RSAPrivateKey.
 */
export const JwkPrivateKey = t.union(
  [RSAPrivateKey, ECPrivateKey],
  'JwkPrivateKey',
);
export type JwkPrivateKey = t.TypeOf<typeof JwkPrivateKey>;

/**
 * A generic JWK. It could be either an ECPrivateKey,RSAPrivateKey,ECKey or RSAKey.
 */
export const Jwk = t.union([JwkPublicKey, JwkPrivateKey], 'Jwk');
export type Jwk = t.TypeOf<typeof Jwk>;

export const JwksMetadata = t.type({
  keys: t.array(JwkPublicKey),
});
export type JwksMetadata = t.TypeOf<typeof JwksMetadata>;

const ECPrivateKeyWithKidCodec = t.intersection([
  ECPrivateKey,
  t.type({ kid: t.string }),
]);
export type ECPrivateKeyWithKid = t.TypeOf<typeof ECPrivateKeyWithKidCodec>;

export const JwkECPrivateKeyListFromBase64Codec = new t.Type<
  readonly ECPrivateKeyWithKid[],
  string,
  unknown
>(
  // name: a unique name for this codec
  'JwkECPrivateKeyFromBase64Codec',
  // is: a custom type guard
  t.array(ECPrivateKeyWithKidCodec).is,
  // validate: succeeds if a value of type I can be decoded to a value of type A
  (u, c) =>
    pipe(
      t.string.validate(u, c),
      E.flatMap((str) =>
        E.tryCatch(
          () => JSON.parse(Buffer.from(str, 'base64').toString('binary')),
          () => [
            {
              value: str,
              context: c,
              message: 'cannot decode from base64',
            },
          ],
        ),
      ),
      E.flatMap(t.array(ECPrivateKeyWithKidCodec).decode),
    ),
  // encode: converts a value of type A to a value of type O
  (v) =>
    pipe(JSON.stringify(v), (value) =>
      Buffer.from(value, 'binary').toString('base64'),
    ),
);
