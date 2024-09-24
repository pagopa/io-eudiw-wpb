import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { NonceRepository } from '../../../domain/nonce';
import { Database } from '@azure/cosmos';
import { pipe } from 'fp-ts/lib/function';

export const makeNonceRepository = (
  db: Database,
  containerName = 'nonces',
): NonceRepository => {
  const container = db.container(containerName);
  return {
    insert: (nonce) =>
      pipe(
        TE.tryCatch(() => container.items.create({ id: nonce }), E.toError),
        TE.map(() => void 0),
      ),
    delete: (nonce) =>
      pipe(
        TE.tryCatch(() => container.item(nonce, nonce).delete(), E.toError),
        TE.map(() => void 0),
        TE.mapLeft((error) =>
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          error.code === 404
            ? new Error('Invalid nonce')
            : new Error(`Error deleting nonce: ${error}`),
        ),
      ),
  };
};
