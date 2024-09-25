import { pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as H from '@pagopa/handler-kit';
import { httpAzureFunction } from '@pagopa/handler-kit-azure-func';
import {
  WalletInstanceEnv,
  createWalletInstance,
} from '../../../domain/wallet-instance';
import { errorToProblemJson } from './errors';
import { parseRequestBody } from './middleware';
import { CreateWalletInstanceBody } from '../../../generated/definitions/endpoints/CreateWalletInstanceBody';
import { NonceEnv } from '../../../domain/nonce';

const makeHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<unknown, 204>
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>,
  WalletInstanceEnv & NonceEnv
> = H.of((req: H.HttpRequest) =>
  pipe(
    RTE.Do,
    RTE.apSW(
      'requestBody',
      RTE.fromEither(parseRequestBody(CreateWalletInstanceBody)(req)),
    ),
    // TODO: Find out where to get the authenticated user.
    RTE.apSW('userId', RTE.of('aUserId')),
    RTE.flatMap(({ requestBody }) => createWalletInstance(requestBody)),
    RTE.mapBoth(errorToProblemJson, () => H.empty),
    RTE.orElseW(RTE.of),
  ),
);

export const CreateWalletInstanceFn = httpAzureFunction(makeHandler);
