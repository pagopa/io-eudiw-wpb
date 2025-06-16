import { describe, expect, it } from 'vitest';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { makeTestEnv } from './mocks';
import { CreateWalletAttestationFn } from '../create-wallet-attestations';
import { makeAssertionV2, makeHttpRequest } from './data';
import {
  aJwkKeyPair,
  mkWalletInstance,
} from '../../../../domain/__tests__/data';

describe('CreateWalletAttestationFn', () => {
  it('should return 200 HTTP response given a valid wallet attestation request', async () => {
    const { env, ctx } = makeTestEnv();
    const request = makeHttpRequest(
      {
        //grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: await makeAssertionV2(),
      },
      { 'x-user-id': 'aUserId' },
    );

    env.nonceRepository.delete.mockReturnValueOnce(TE.right(void 0));
    env.walletInstanceRepository.get.mockReturnValueOnce(
      TE.right(O.some(await mkWalletInstance())),
    );
    env.jwksRepository.get.mockReturnValueOnce(TE.right(aJwkKeyPair));

    const actual = await CreateWalletAttestationFn(env)(request, ctx);

    expect(actual.status).toStrictEqual(200);
  });
});
