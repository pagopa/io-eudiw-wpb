import { pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as H from '@pagopa/handler-kit';
import { NonceDetailView } from './../../../generated/definitions/endpoints/NonceDetailView';
import { NonceEnv, generateNonce } from '../../../domain/nonce';
import { httpAzureFunction } from '@pagopa/handler-kit-azure-func';
import { errorToProblemJson } from './errors';

const makeHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<NonceDetailView>
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>,
  NonceEnv
> = H.of(() =>
  pipe(
    generateNonce,
    RTE.map((nonce) => ({ nonce })),
    RTE.mapBoth(errorToProblemJson, H.successJson),
    RTE.orElseW(RTE.of),
  ),
);

export const GetNonceFn = httpAzureFunction(makeHandler);
