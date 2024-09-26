import { app } from '@azure/functions';
import { getConfigOrError } from './config';
import { InfoFn } from './adapters/azure/functions/info';
import { GetNonceFn } from './adapters/azure/functions/get-nonce';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';
import { CosmosClient } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';
import { makeNonceRepository } from './adapters/azure/cosmosdb/nonce';
import { CreateWalletInstanceFn } from './adapters/azure/functions/create-wallet-instance';
import { makeWalletInstanceRepository } from './adapters/azure/cosmosdb/wallet-instance';

const config = pipe(
  getConfigOrError(process.env),
  E.getOrElseW((error) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  }),
);

const aadCredentials = new DefaultAzureCredential();

const cosmosDB = new CosmosClient({
  endpoint: config.cosmosdb.endpoint,
  aadCredentials,
});

const nonceRepository = makeNonceRepository(
  cosmosDB.database(config.cosmosdb.databaseName),
);

const walletInstanceRepository = makeWalletInstanceRepository(
  cosmosDB.database(config.cosmosdb.databaseName),
);

const env = {
  nonceRepository,
  walletInstanceRepository,
  cosmosDB,
};

app.http('Info', {
  authLevel: 'anonymous',
  handler: InfoFn(env),
  methods: ['GET'],
  route: 'info',
});

app.http('getNonce', {
  authLevel: 'function',
  handler: GetNonceFn(env),
  methods: ['GET'],
  route: 'nonce',
});

app.http('createWalletInstance', {
  authLevel: 'function',
  handler: CreateWalletInstanceFn(env),
  methods: ['POST'],
  route: 'wallet-instances',
});
