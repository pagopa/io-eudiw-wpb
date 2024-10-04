import { describe, expect, it } from 'vitest';
import * as t from 'io-ts';
import * as crypto from 'crypto';
import * as jose from 'jose';
import { JwkPrivateKey, JwkECPrivateKeyListFromBase64Codec } from '../jwk';

describe('JwkECPrivateKeyFromBase64Codec', () => {
  it('should decode from a valid string', async () => {
    const { privateKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'P-256',
    });
    const jwk = await jose.exportJWK(privateKey);
    const jwkList = [{ ...jwk, kid: 'aKid' }];
    const value = Buffer.from(JSON.stringify(jwkList), 'binary').toString(
      'base64',
    );

    console.log(value);
    const actual = JwkECPrivateKeyListFromBase64Codec.decode(value);
    const expected = t.array(JwkPrivateKey).decode(jwkList);

    expect(actual).toStrictEqual(expected);
  });
});
