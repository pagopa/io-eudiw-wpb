import { describe, expect, it } from 'vitest';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { HttpRequest } from '@azure/functions';
import { GetNonceFn } from '../get-nonce';
import { makeTestEnv } from './mocks';

describe('GetNonceFn', () => {
  it('should return 200 with nonce', async () => {
    const { env, ctx } = makeTestEnv();
    const request = new HttpRequest({
      url: 'http://localhost/endpoint',
      method: 'GET',
    });

    env.nextNonce.mockReturnValueOnce(E.right('aNonce'));
    env.nonceRepository.insert.mockReturnValueOnce(TE.right(void 0));

    const actual = await GetNonceFn(env)(request, ctx);

    expect(await actual.json()).toMatchObject({
      nonce: 'aNonce',
    });
  });
});
