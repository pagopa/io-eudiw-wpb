import { pipe } from 'fp-ts/lib/function';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as H from '@pagopa/handler-kit';
import { httpAzureFunction } from '@pagopa/handler-kit-azure-func';
import {
  WalletInstanceEnv,
  createWalletInstance,
} from '../../../domain/wallet-instance';
import { errorToProblemJson, logError } from './errors';
import { parseHeaderParameter, parseRequestBody } from './middleware';
import { CreateWalletInstanceBody } from '../../../generated/definitions/endpoints/CreateWalletInstanceBody';
import { NonceEnv } from '../../../domain/nonce';
import { User } from '../../../domain/user';

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
    RTE.apSW(
      'userId',
      RTE.fromEither(parseHeaderParameter(User.props.id, 'x-user-id')(req)),
    ),
    RTE.flatMap(({ requestBody, userId }) =>
      createWalletInstance(requestBody, userId),
    ),
    RTE.tapError(logError),
    RTE.mapBoth(errorToProblemJson, () => H.empty),
    RTE.orElseW(RTE.of),
  ),
);

export const CreateWalletInstanceFn = httpAzureFunction(makeHandler);
