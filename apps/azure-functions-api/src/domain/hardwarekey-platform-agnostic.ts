import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as H from '@pagopa/handler-kit';
import { CreateWalletInstanceBody as WalletInstanceRequest } from '../generated/definitions/endpoints/CreateWalletInstanceBody';
import { JwkPublicKey } from './jwk';

export const extractHardwareKeyFromPlatformAgnostic = (
  request: WalletInstanceRequest,
) =>
  pipe(
    E.tryCatch(
      () =>
        JSON.parse(
          Buffer.from(request.key_attestation, 'base64').toString('utf-8'),
        ),
      () =>
        new Error(
          `[Platform Agnostic Hardware Key] Invalid attestation: ${request.key_attestation}`,
        ),
    ),
    E.flatMap(
      H.parse(
        JwkPublicKey,
        '[Platform Agnostic Hardware Key] Invalid attestation, invalid JWK format',
      ),
    ),
    TE.fromEither,
  );
