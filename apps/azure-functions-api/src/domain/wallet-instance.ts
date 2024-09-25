import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { validateNonce } from './nonce';
import { validateKeyAttestation } from './key-attestation';
import { JwkPublicKey } from './jwk';
import { CreateWalletInstanceBody as WalletInstanceRequest } from '../generated/definitions/endpoints/CreateWalletInstanceBody';
import { IsoDateFromString } from '@pagopa/ts-commons/lib/dates';
import { NonEmptyString } from '@pagopa/ts-commons/lib/strings';
import { nowDate } from './clock';

export interface WalletInstanceEnv {
  readonly walletInstanceRepository: WalletInstanceRepository;
}

export interface WalletInstanceRepository {
  readonly insert: (data: WalletInstance) => TE.TaskEither<Error, void>;
}

export const WalletInstanceCodec = t.type({
  createdAt: IsoDateFromString,
  hardwareKey: JwkPublicKey,
  id: NonEmptyString,
  signCount: t.number,
  // userId: User.props.id,
});
export type WalletInstance = t.TypeOf<typeof WalletInstanceCodec>;

export const createWalletInstance = (request: WalletInstanceRequest) =>
  pipe(
    // validate nonce; a.k.a. consume the nonce
    validateNonce(request.challenge),
    // validate the wallet key attestation
    RTE.flatMapTaskEither(() => validateKeyAttestation(request)),
    // create the wallet instance
    RTE.flatMap((vka) => makeWalletInstance({ ...vka, ...request })),
    // store the wallet instance
    RTE.flatMap(insertWalletInstance),
  );

interface MakeWalletInstanceParams {
  readonly hardwareKey: WalletInstance['hardwareKey'];
  readonly hardware_key_tag: WalletInstanceRequest['hardware_key_tag'];
}
const makeWalletInstance = ({
  hardwareKey,
  hardware_key_tag,
}: MakeWalletInstanceParams) =>
  pipe(
    nowDate(),
    RTE.map((now) => ({
      createdAt: now,
      hardwareKey: hardwareKey,
      id: hardware_key_tag,
      signCount: 0,
    })),
  );

const insertWalletInstance =
  (walletInstance: WalletInstance) =>
  ({ walletInstanceRepository }: WalletInstanceEnv) =>
    walletInstanceRepository.insert(walletInstance);
