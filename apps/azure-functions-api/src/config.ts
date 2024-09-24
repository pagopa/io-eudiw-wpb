import { pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/lib/Either';
import * as PR from 'io-ts/PathReporter';
import { NonEmptyString } from '@pagopa/ts-commons/lib/strings';
import { withDefault } from '@pagopa/ts-commons/lib/types';
import { NumberFromString } from '@pagopa/ts-commons/lib/numbers';

export interface Config {
  readonly cosmosdb: {
    readonly endpoint: string;
    readonly databaseName: string;
  };
}

export const EnvsCodec = t.type({
  COSMOSDB_ENDPOINT: NonEmptyString,
  COSMOSDB_DATABASE_NAME: NonEmptyString,
  // Default is 10 sec timeout
  FETCH_TIMEOUT_MS: withDefault(t.string, '10000').pipe(NumberFromString),
  isProduction: t.boolean,
});

/**
 * Read the application configuration and check for invalid values.
 *
 * @returns either the configuration values or an Error
 */
export const getConfigOrError = (
  envs: Record<string, undefined | string>,
): E.Either<Error, Config> =>
  pipe(
    EnvsCodec.decode({
      ...envs,
      isProduction: envs.NODE_ENV === 'production',
    }),
    E.bimap(
      (errors) => new Error(PR.failure(errors).join('\n')),
      (envs) => ({
        cosmosdb: {
          endpoint: envs.COSMOSDB_ENDPOINT,
          databaseName: envs.COSMOSDB_DATABASE_NAME,
        },
      }),
    ),
  );
