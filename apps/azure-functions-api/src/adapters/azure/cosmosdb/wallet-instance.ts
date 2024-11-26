import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { Database } from '@azure/cosmos';
import {
  WalletInstanceCodec,
  WalletInstanceRepository,
} from '../../../domain/wallet-instance';
import { decodeFromItem } from './decode';
import { cosmosErrorToDomainError } from './errors';

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
    get: ({ id, userId }) =>
      pipe(
        TE.tryCatch(() => container.item(id, userId).read(), E.toError),
        TE.flatMapEither(decodeFromItem(WalletInstanceCodec)),
        TE.mapLeft(cosmosErrorToDomainError),
      ),
  };
};
