import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as TE from 'fp-ts/lib/TaskEither';
import * as jose from 'jose';
import { ECKey, ECPrivateKey, JwkPrivateKey, JwkPublicKey } from './jwk';
import { JWT, SignedJWT } from './jwt';

export interface SignerEnv {
  readonly jwksRepository: JwksRepository;
}

export interface JwksRepository {
  readonly get: () => TE.TaskEither<Error, JwkKeyPair<'EC'>>;
}

interface JwkKeyPair<A> {
  readonly private: JwkPrivateKey &
    Required<Pick<ECPrivateKey, 'kid'>> & { readonly kty: A };
  readonly public: JwkPublicKey &
    Required<Pick<ECKey, 'kid'>> & { readonly kty: A };
}

export const signJwt =
  <A, B extends jose.JWTPayload>(jwt: JWT<A, B>) =>
  (env: SignerEnv) =>
    pipe(
      env.jwksRepository.get(),
      TE.flatMap((jwk) =>
        TE.tryCatch(async () => {
          const header = { ...jwt.header, kid: jwk.public.kid, alg: 'ES256' };
          const joseKey = await jose.importJWK(jwk.private);
          const signedJwt = (await new jose.SignJWT(jwt.payload)
            .setProtectedHeader(header)
            .setIssuedAt()
            .setExpirationTime('1 day')
            .sign(joseKey)) as SignedJWT;
          const { kid, alg } = header;
          return { kid, alg, publicJwk: jwk.public, jwt: signedJwt };
        }, E.toError),
      ),
    );

export const getJwkPublicKeyList = ({ jwksRepository }: SignerEnv) =>
  // TODO: Add list to repository and refactor this function
  pipe(
    jwksRepository.get(),
    TE.map((jwk) => jwk.public),
    TE.map(RA.of),
  );
