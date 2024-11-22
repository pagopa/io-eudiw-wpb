import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { CreateWalletInstanceBody as WalletInstanceRequest } from '../generated/definitions/endpoints/CreateWalletInstanceBody';
import { JwkPublicKey } from './jwk';
import { extractHardwareKeyFromIOS } from './hardwarekey-ios';
import { extractHardwareKeyFromAndroid } from './hardwarekey-android';
import { extractHardwareKeyFromPlatformAgnostic } from './hardwarekey-platform-agnostic';

export interface ValidKeyAttestation {
  // JWK public key
  readonly hardwareKey: JwkPublicKey;
}

export const validateKeyAttestation = (request: WalletInstanceRequest) =>
  pipe(
    [
      extractHardwareKeyFromIOS(request),
      extractHardwareKeyFromAndroid(request),
      extractHardwareKeyFromPlatformAgnostic(request),
    ],
    firstRightOrLefts,
    TE.mapError((errors) => new Error(`${errors.map((_) => _.message)}`)),
    TE.map((hardwareKey) => ({ hardwareKey })),
  );

const firstRightOrLefts = <A, B>(
  taList: readonly TE.TaskEither<A, B>[],
): TE.TaskEither<readonly A[], B> =>
  pipe(taList, RA.map(TE.swap), RA.sequence(TE.ApplicativePar), TE.swap);
