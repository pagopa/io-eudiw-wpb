import { describe, expect, it } from 'vitest';
import * as TE from 'fp-ts/lib/TaskEither';
import { makeTestEnv } from './mocks';
import { CreateWalletInstanceFn } from '../create-wallet-instance';
import { makeHttpRequest, iOSMockData } from './data';

describe('CreateWalletInstanceFn', () => {
  it('should return a 204 HTTP response', async () => {
    const { env, ctx } = makeTestEnv();
    const request = makeHttpRequest({
      challenge: iOSMockData.challenge,
      hardware_key_tag: iOSMockData.keyId,
      key_attestation: iOSMockData.attestation,
    });

    env.nonceRepository.delete.mockReturnValueOnce(TE.right(void 0));
    env.walletInstanceRepository.insert.mockReturnValueOnce(TE.right(void 0));

    const actual = await CreateWalletInstanceFn(env)(request, ctx);

    expect(actual.status).toStrictEqual(204);
  });

  it('should return a 422 HTTP response on invalid body', async () => {
    const { env, ctx } = makeTestEnv();
    const request = makeHttpRequest({
      invalid: 'invalid',
    });

    const actual = await CreateWalletInstanceFn(env)(request, ctx);

    expect(actual.status).toStrictEqual(422);
  });

  it('should return a 500 HTTP response on challenge validation error', async () => {
    const { env, ctx } = makeTestEnv();
    const request = makeHttpRequest({
      challenge: 'aChallenge',
      hardware_key_tag: 'aKeyId',
      key_attestation: 'anAttestation',
    });

    env.nonceRepository.delete.mockReturnValueOnce(
      TE.left(new Error('invalid challenge')),
    );

    const actual = await CreateWalletInstanceFn(env)(request, ctx);

    expect(actual.status).toStrictEqual(500);
  });
});