import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as H from '@pagopa/handler-kit';
import { WalletAttestationView } from '../../../generated/definitions/endpoints/WalletAttestationView';
import { httpAzureFunction } from '@pagopa/handler-kit-azure-func';
import { pipe } from 'fp-ts/lib/function';
import { parseHeaderParameter, parseRequestBody } from './middleware';
import { CreateWalletAttestationBody } from '../../../generated/definitions/endpoints/CreateWalletAttestationBody';
import { User } from '../../../domain/user';
import { errorToProblemJson, logError } from './errors';
import { createWalletAttestation } from '../../../domain/wallet-attestation';
import { SignedJWT } from '../../../domain/jwt';
import { NonceEnv } from '../../../domain/nonce';
import { WalletInstanceEnv } from '../../../domain/wallet-instance';
import { SignerEnv } from '../../../domain/signer';

const makeHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<WalletAttestationView, 200>
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>,
  NonceEnv & WalletInstanceEnv & SignerEnv
> = H.of((req: H.HttpRequest) =>
  pipe(
    RTE.Do,
    RTE.apSW(
      'requestBody',
      RTE.fromEither(parseRequestBody(CreateWalletAttestationBody)(req)),
    ),
    RTE.apSW(
      'userId',
      RTE.fromEither(parseHeaderParameter(User.props.id, 'x-user-id')(req)),
    ),
    RTE.flatMap(({ requestBody: { assertion }, userId }) =>
      createWalletAttestation(assertion as SignedJWT, userId),
    ),
    RTE.map((wallet_attestation) => ({ wallet_attestation })),
    RTE.tapError(logError),
    RTE.mapBoth(errorToProblemJson, (res) => H.successJson(res)),
    RTE.orElseW(RTE.of),
  ),
);

export const CreateWalletAttestationFn = httpAzureFunction(makeHandler);
