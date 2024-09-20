import * as t from 'io-ts';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as reporters from '@pagopa/ts-commons/lib/reporters';
import { withDefault } from '@pagopa/ts-commons/lib/types';
import { NumberFromString } from '@pagopa/ts-commons/lib/numbers';

export type Config = t.TypeOf<typeof Config>;
export const Config = t.type({
  // Default is 10 sec timeout
  FETCH_TIMEOUT_MS: withDefault(t.string, '10000').pipe(NumberFromString),
  isProduction: t.boolean,
});

export const envConfig = {
  ...process.env,
  isProduction: process.env.NODE_ENV === 'production',
};

const errorOrConfig: t.Validation<Config> = Config.decode(envConfig);

/**
 * Read the application configuration and check for invalid values.
 *
 * @returns either the configuration values or an Error
 */
export const getConfigOrError = (): E.Either<Error, Config> =>
  pipe(
    errorOrConfig,
    E.mapLeft(
      (errors: readonly t.ValidationError[]) =>
        new Error(
          `Invalid configuration: ${reporters.readableReportSimplified(errors)}`,
        ),
    ),
  );
