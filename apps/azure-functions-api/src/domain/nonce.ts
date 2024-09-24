import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as IOE from 'fp-ts/lib/IOEither';
import crypto from 'crypto';

export interface NonceEnv {
  readonly nonceRepository: NonceRepository;
}

export interface NonceRepository {
  readonly delete: (nonce: string) => TE.TaskEither<Error, void>;
  readonly insert: (nonce: string) => TE.TaskEither<Error, void>;
}

const makeNonce = IOE.tryCatch(
  () => crypto.randomBytes(32).toString('hex'),
  (error) => new Error(`Failed to generate nonce: ${error}`),
);

export const generateNonce = ({ nonceRepository }: NonceEnv) =>
  pipe(TE.fromIOEither(makeNonce), TE.chainFirst(nonceRepository.insert));

export const deleteNonce = ({ nonceRepository }: NonceEnv) =>
  pipe(TE.fromIOEither(makeNonce), TE.flatMap(nonceRepository.delete));
