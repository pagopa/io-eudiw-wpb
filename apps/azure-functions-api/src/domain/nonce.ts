import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import * as IOE from 'fp-ts/lib/IOEither';
import crypto from 'crypto';

export interface NonceEnv {
  readonly nonceRepository: NonceRepository;
  // nextNonce is optional. If undefined, a default implementation will be used.
  readonly nextNonce?: () => E.Either<Error, string>;
}

export interface NonceRepository {
  readonly delete: (nonce: string) => TE.TaskEither<Error, void>;
  readonly insert: (nonce: string) => TE.TaskEither<Error, void>;
}

const makeNonce = IOE.tryCatch(
  () => crypto.randomBytes(32).toString('hex'),
  (error) => new Error(`Failed to generate nonce: ${error}`),
);

export const generateNonce = ({ nonceRepository, nextNonce }: NonceEnv) =>
  pipe(
    TE.fromIOEither(nextNonce ?? makeNonce),
    TE.chainFirst(nonceRepository.insert),
  );

export const deleteNonce =
  (nonce: string) =>
  ({ nonceRepository }: NonceEnv) =>
    nonceRepository.delete(nonce);
