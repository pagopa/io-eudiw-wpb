import { NonEmptyString } from '@pagopa/ts-commons/lib/strings';
import { WalletInstance } from '../wallet-instance';
import { JwkPublicKey } from '../jwk';
import { User } from '../user';
import * as crypto from 'crypto';
import * as jose from 'jose';

export const aUserId = 'aUserId' as User['id'];

export const hardwareKeyPair = crypto.generateKeyPairSync('ec', {
  namedCurve: 'P-256',
});

export const aJwkKeyPair = {
  private: {
    kty: 'EC',
    x: 'x4ocnFuT_mQ073p2TGzsJSVmcoXsANtsYX3FY8mNVxk',
    y: 'unffnFFmjEherHeE-RjIDdodggbpb-JcbyMkajJXB3c',
    crv: 'P-256',
    d: 'UNm-m7FidjrPWyH-RHzUBQns043vKyTtbj3idQYa244',
  },
  public: {
    kty: 'EC',
    x: 'x4ocnFuT_mQ073p2TGzsJSVmcoXsANtsYX3FY8mNVxk',
    y: 'unffnFFmjEherHeE-RjIDdodggbpb-JcbyMkajJXB3c',
    crv: 'P-256',
  },
};

const mkHardwareKey = async () =>
  ({
    ...(await jose.exportJWK(hardwareKeyPair.publicKey)),
  }) as JwkPublicKey;

export const mkWalletInstance = async () =>
  ({
    id: 'aWalletId' as NonEmptyString,
    createdAt: new Date(),
    hardwareKey: await mkHardwareKey(),
    signCount: 0,
    userId: aUserId,
  }) satisfies WalletInstance;
