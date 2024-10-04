import { mock, mockFn } from 'vitest-mock-extended';
import { NonceEnv } from '../../../../domain/nonce';
import { InvocationContext } from '@azure/functions';
import { WalletInstanceEnv } from '../../../../domain/wallet-instance';
import { ClockEnv } from '../../../../domain/clock';
import { SignerEnv } from '../../../../domain/signer';

export const makeTestEnv = () => ({
  env: {
    walletInstanceRepository:
      mock<WalletInstanceEnv['walletInstanceRepository']>(),
    nonceRepository: mock<NonceEnv['nonceRepository']>(),
    jwksRepository: mock<SignerEnv['jwksRepository']>(),
    nextNonce: mockFn<NonceEnv['nextNonce']>(),
    clock: mock<ClockEnv['clock']>(),
  },
  ctx: {
    error: console.error,
    debug: console.debug,
  } as InvocationContext,
});
