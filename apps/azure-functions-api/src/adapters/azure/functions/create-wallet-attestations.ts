import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as H from '@pagopa/handler-kit';
import { httpAzureFunction } from '@pagopa/handler-kit-azure-func';
import { pipe } from 'fp-ts/lib/function';
import { parseHeaderParameter, parseRequestBody } from './middleware';
import { User } from '../../../domain/user';
import { errorToProblemJson, logError } from './errors';
import { createWalletAttestation } from '../../../domain/wallet-attestations';
import { SignedJWT } from '../../../domain/jwt';
import { NonceEnv } from '../../../domain/nonce';
import { WalletInstanceEnv } from '../../../domain/wallet-instance';
import { SignerEnv } from '../../../domain/signer';
import { CreateWalletAttestationV2Body } from '../../../generated/definitions/endpoints/CreateWalletAttestationV2Body';
import { WalletAttestationsView } from '../../../generated/definitions/endpoints/WalletAttestationsView';

const makeHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<WalletAttestationsView, 200>
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>,
  NonceEnv & WalletInstanceEnv & SignerEnv
> = H.of((req: H.HttpRequest) =>
  pipe(
    RTE.Do,
    RTE.apSW(
      'requestBody',
      RTE.fromEither(parseRequestBody(CreateWalletAttestationV2Body)(req)),
    ),
    RTE.apSW(
      'userId',
      RTE.fromEither(parseHeaderParameter(User.props.id, 'x-user-id')(req)),
    ),
    RTE.flatMap(({ requestBody: { assertion }, userId }) =>
      createWalletAttestation(assertion as SignedJWT, userId),
    ),
    RTE.map((wallet_attestation) => ({
      // TODO: [WLEO-463] add attestation in other format sd-jwt and mdoc
      wallet_attestations: [
        {
          format: 'jwt',
          wallet_attestation: wallet_attestation,
        },
      ],
    })),
    RTE.tapError(logError),
    RTE.mapBoth(errorToProblemJson, (res) => H.successJson(res)),
    RTE.orElseW(RTE.of),
  ),
);

export const CreateWalletAttestationFnV2 = httpAzureFunction(makeHandler);
