import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as E from 'fp-ts/lib/Either';
import { Database } from '@azure/cosmos';
import {
  WalletInstanceCodec,
  WalletInstanceRepository,
} from '../../../domain/wallet-instance';
import { decodeFromFeed } from './decode';

export const makeWalletInstanceRepository = (
  db: Database,
  containerName = 'wallet-instances',
): WalletInstanceRepository => {
  const container = db.container(containerName);
  return {
    insert: (data) =>
      pipe(
        TE.tryCatch(() => container.items.create(data), E.toError),
        TE.map(() => void 0),
      ),
    get: (id, userId) =>
      pipe(
        TE.tryCatch(
          () =>
            container.items
              .query({
                parameters: [
                  {
                    name: '@partitionKey',
                    value: userId,
                  },
                ],
                query:
                  'SELECT TOP 1 * FROM c WHERE c.userId = @partitionKey ORDER BY c.createdAt DESC',
              })
              .fetchAll(),
          E.toError,
        ),
        TE.flatMapEither(decodeFromFeed(WalletInstanceCodec)),
        TE.map(RA.head),
      ),
  };
};
