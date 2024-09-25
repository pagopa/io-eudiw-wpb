import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { CreateWalletInstanceBody as WalletInstanceRequest } from '../generated/definitions/endpoints/CreateWalletInstanceBody';
import { JwkPublicKey } from './jwk';
import { extractHardwareKeyFromIOS } from './hardwarekey-ios';

export interface ValidKeyAttestation {
  // JWK public key
  readonly hardwareKey: JwkPublicKey;
}

export const validateKeyAttestation = (request: WalletInstanceRequest) =>
  pipe(
    extractHardwareKeyFromIOS(request),
    TE.map((hardwareKey) => ({ hardwareKey })),
  );
