import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as H from '@pagopa/handler-kit';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { httpAzureFunction } from '@pagopa/handler-kit-azure-func';
import { ApplicationInfo } from '../../../generated/definitions/endpoints/ApplicationInfo';
import { CosmosClient } from '@azure/cosmos';

export interface InfoEnv {
  readonly cosmosDB: CosmosClient;
}

const cosmosHealthCheck = ({
  cosmosDB,
}: InfoEnv): TE.TaskEither<readonly string[], true> =>
  pipe(
    TE.tryCatch(
      () => cosmosDB.getDatabaseAccount(),
      () => ['CosmosDB Error'],
    ),
    TE.map(() => true),
  );

const ApplicativeParAccumulateErrors = RTE.getApplicativeReaderTaskValidation(
  T.ApplicativePar,
  RA.getSemigroup<string>(),
);

export const makeInfoHandler: H.Handler<
  H.HttpRequest,
  H.HttpResponse<ApplicationInfo, 200>,
  InfoEnv
> = H.of(() =>
  pipe(
    [cosmosHealthCheck],
    RA.sequence(ApplicativeParAccumulateErrors),
    RTE.map(() => H.successJson({ name: 'eudiw-wpb', version: '0.0.1' })),
    RTE.mapLeft((problems) => new H.HttpError(problems.join('\n\n'))),
  ),
);

export const InfoFn = httpAzureFunction(makeInfoHandler);
