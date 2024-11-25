import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { validateNonce } from './nonce';
import { validateKeyAttestation } from './key-attestation';
import { JwkPublicKey } from './jwk';
import { CreateWalletInstanceBody as WalletInstanceRequest } from '../generated/definitions/endpoints/CreateWalletInstanceBody';
import { IsoDateFromString } from '@pagopa/ts-commons/lib/dates';
import { NonEmptyString } from '@pagopa/ts-commons/lib/strings';
import { nowDate } from './clock';
import { User } from './user';

export interface WalletInstanceEnv {
  readonly walletInstanceRepository: WalletInstanceRepository;
}

export interface WalletInstanceRepository {
  readonly insert: (data: WalletInstance) => TE.TaskEither<Error, void>;
  readonly get: (
    id: WalletInstance['id'],
  ) => TE.TaskEither<Error, O.Option<WalletInstance>>;
}

export const WalletInstanceCodec = t.type({
  createdAt: IsoDateFromString,
  hardwareKey: JwkPublicKey,
  id: NonEmptyString,
  signCount: t.number,
  userId: User.props.id,
});
export type WalletInstance = t.TypeOf<typeof WalletInstanceCodec>;

export const createWalletInstance = (
  request: WalletInstanceRequest,
  userId: User['id'],
) =>
  pipe(
    // validate nonce; a.k.a. consume the nonce
    validateNonce(request.challenge),
    // validate the wallet key attestation
    RTE.flatMapTaskEither(() => validateKeyAttestation(request)),
    // create the wallet instance
    RTE.flatMap((vka) => makeWalletInstance({ ...vka, ...request, userId })),
    // store the wallet instance
    RTE.flatMap(insertWalletInstance),
  );

interface MakeWalletInstanceParams {
  readonly hardwareKey: WalletInstance['hardwareKey'];
  readonly hardware_key_tag: WalletInstanceRequest['hardware_key_tag'];
  readonly userId: User['id'];
}
const makeWalletInstance = ({
  hardwareKey,
  hardware_key_tag,
  userId,
}: MakeWalletInstanceParams) =>
  pipe(
    nowDate(),
    RTE.map((now) => ({
      createdAt: now,
      hardwareKey: hardwareKey,
      id: hardware_key_tag,
      signCount: 0,
      userId: userId,
    })),
  );

const insertWalletInstance =
  (walletInstance: WalletInstance) =>
  ({ walletInstanceRepository }: WalletInstanceEnv) =>
    walletInstanceRepository.insert(walletInstance);

export const getWalletInstance =
  (id: WalletInstance['id'], userId: WalletInstance['userId']) =>
  ({ walletInstanceRepository }: WalletInstanceEnv) =>
    pipe(
      walletInstanceRepository.get(id),
      // if the user is not the same do not return the wallet
      TE.map(O.filter((wi) => wi.userId === userId)),
      TE.flatMap(
        TE.fromOption(
          () =>
            new Error(
              `Wallet-Instance not found: { id: ${id}, userId: ${userId}`,
            ),
        ),
      ),
    );
