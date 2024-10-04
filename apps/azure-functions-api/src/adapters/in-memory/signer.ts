import * as t from 'io-ts';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as TE from 'fp-ts/lib/TaskEither';
import { JwksRepository } from '../../domain/signer';
import { ECKey, ECPrivateKey, ECPrivateKeyWithKid } from '../../domain/jwk';
import { pipe } from 'fp-ts/lib/function';

export const makeJwksRepository = (
  jwks: readonly ECPrivateKeyWithKid[],
): JwksRepository => ({
  get: () =>
    pipe(
      jwks,
      RA.head,
      TE.fromOption(() => new Error(`No EC available`)),
      TE.map(({ kid, ...rest }) => ({
        private: { ...t.exact(ECPrivateKey).encode(rest), kid },
        public: { ...t.exact(ECKey).encode(rest), kid },
      })),
    ),
});
