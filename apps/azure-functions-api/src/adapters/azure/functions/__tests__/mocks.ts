import { mock, mockFn } from 'vitest-mock-extended';
import { NonceEnv } from '../../../../domain/nonce';
import { InvocationContext } from '@azure/functions';

export const makeTestEnv = () => ({
  env: {
    nonceRepository: mock<NonceEnv['nonceRepository']>(),
    nextNonce: mockFn<NonceEnv['nextNonce']>(),
  },
  ctx: {
    error: console.error,
    debug: console.debug,
  } as InvocationContext,
});
