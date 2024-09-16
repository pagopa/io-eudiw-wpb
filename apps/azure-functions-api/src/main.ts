import { app } from '@azure/functions';
import { getConfigOrError } from './config';
import { InfoFn } from './adapters/azure/functions/info';
import { GetNonceFn } from './adapters/azure/functions/get-nonce';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const config = pipe(
  getConfigOrError(),
  E.getOrElseW((error) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  }),
);

app.http('Info', {
  authLevel: 'anonymous',
  handler: InfoFn({}),
  methods: ['GET'],
  route: 'info',
});

app.http('getNonce', {
  authLevel: 'function',
  handler: GetNonceFn,
  methods: ['GET'],
  route: 'nonce',
});
