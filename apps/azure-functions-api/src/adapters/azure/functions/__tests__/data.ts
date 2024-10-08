import { HttpRequest } from '@azure/functions';
import * as jose from 'jose';
import * as crypto from 'crypto';
import { hardwareKeyPair } from '../../../../domain/__tests__/data';

export const makeHttpRequest = (
  body?: unknown,
  headers?: Record<string, string>,
): HttpRequest =>
  new HttpRequest({
    url: 'http://localhost/endpoint',
    method: 'POST',
    headers,
    body: body ? { string: JSON.stringify(body) } : {},
  });

export const makeAssertion = async () => {
  const challenge = 'aChallenge';
  const ephemeralKeyPair = crypto.generateKeyPairSync('ec', {
    namedCurve: 'P-256',
  });

  const jwk_thumbprint = await jose.calculateJwkThumbprint(
    await jose.exportJWK(ephemeralKeyPair.publicKey),
  );
  const clientData = { challenge, jwk_thumbprint };
  const clientDataHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(clientData))
    .digest();

  const hardware_signature = crypto
    .createSign('sha256')
    .update(clientDataHash)
    .sign(hardwareKeyPair.privateKey, 'base64');

  const assertion = await new jose.SignJWT({
    challenge,
    cnf: { jwk: await jose.exportJWK(ephemeralKeyPair.publicKey) },
    hardware_key_tag: 'aKeyTag',
    hardware_signature,
    integrity_assertion: 'anIntegrityAssertion',
    iss: 'anIss',
    sub: 'https://wp.example.org/',
  })
    .setProtectedHeader({
      alg: 'ES256',
      kid: 'aKid',
      typ: 'war+jwt',
    })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(
      await jose.importJWK(await jose.exportJWK(ephemeralKeyPair.privateKey)),
    );
  return assertion;
};
