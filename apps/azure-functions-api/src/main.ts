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
import { CreateWalletAttestationFn } from './adapters/azure/functions/create-wallet-attestation';
import { makeJwksRepository } from './adapters/in-memory/signer';
import { GetWellKnownOpenidFederationFn } from './adapters/azure/functions/get-well-known-openid-federation';
import { GetWellKnownWalletMetadataFn } from './adapters/azure/functions/get-well-known-wallet-metadata';

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

const jwksRepository = makeJwksRepository(config.signer.jwks);

const env = {
  nonceRepository,
  walletInstanceRepository,
  jwksRepository,
  cosmosDB,
};

app.http('Info', {
  authLevel: 'anonymous',
  handler: InfoFn(env),
  methods: ['GET'],
  route: 'info',
});

app.http('GetNonce', {
  authLevel: 'anonymous',
  handler: GetNonceFn(env),
  methods: ['GET'],
  route: 'nonce',
});

app.http('CreateWalletInstance', {
  authLevel: 'anonymous',
  handler: CreateWalletInstanceFn(env),
  methods: ['POST'],
  route: 'wallet-instances',
});

app.http('CreateWalletAttestation', {
  authLevel: 'anonymous',
  handler: CreateWalletAttestationFn(env),
  methods: ['POST'],
  route: 'token',
});

app.http('GetWellKnownOpenidFederation', {
  authLevel: 'anonymous',
  handler: GetWellKnownOpenidFederationFn(env),
  methods: ['GET'],
  route: '.well-known/openid-federation',
});

app.http('GetWellKnownWalletMetadata', {
  authLevel: 'anonymous',
  handler: GetWellKnownWalletMetadataFn(env),
  methods: ['GET'],
  route: '.well-known/wallet-metadata',
});
