import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { Database } from '@azure/cosmos';
import { WalletInstanceRepository } from '../../../domain/wallet-instance';

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
  };
};
