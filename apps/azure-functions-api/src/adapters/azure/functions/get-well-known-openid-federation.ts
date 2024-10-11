import { flow, pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as H from '@pagopa/handler-kit';
import { httpAzureFunction } from '@pagopa/handler-kit-azure-func';
import { getFederationMetadata } from '../../../domain/openid-federation';
import { errorToProblemJson, logError } from './errors';
import { SignerEnv } from '../../../domain/signer';

const makeHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<object, 200>
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>,
  SignerEnv
> = H.of(() =>
  pipe(
    getFederationMetadata,
    RTE.tapError(logError),
    RTE.mapBoth(
      errorToProblemJson,
      flow(H.success, H.withHeader('Content-Type', 'application/octet-stream')),
    ),
    RTE.orElseW(RTE.of),
  ),
);

export const GetWellKnownOpenidFederationFn = httpAzureFunction(makeHandler);
