import { HttpRequest } from '@azure/functions';
import * as jose from 'jose';
import * as crypto from 'crypto';

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

const hardwareKeyPair = crypto.generateKeyPairSync('ec', {
  namedCurve: 'P-256',
});

export const aJwkKeyPair = {
  private: {
    kty: 'RSA',
    alg: 'RS256',
    kid: 'c2ee2909-78c7-4d07-8649-3b098984a825',
    d: 'UXIlO2FexxwLaoDzXu1VMV3rrPLUPWUYEfuGGo8Om6clvU_W6xdnwXDCT_7KiXS0eP0ekTYvlvB7iq5U7psB3VZoI43BDRV8LWF7fwGtCXOjkoBZvcZG5OUqmKAXErSkwqY4KiIV9OBcH4aQFmM-LFtHJQwbopMqnSGDq_xMcgAcrQ2zMQh7U-ESCIeZHObx228stB6ElD8PMbiE2TmcwX2bLl_UzUHATfqm305a0ON8nlYpupRHXV9OoZunTL4GHfAO35MOnPVh0hPCb_I8fwVdona0N1D4ppmSVPrpu8YmyP-__OdEQRIabPe0E7b0tFJwkFOBFDCp9knvAsPJyQ',
    n: 'rhxlsBuboanT4XlKE23Vpv5QRZjQoTVYu4xDbBs7c-1oJHRfuIGOW3mn4CTUeJuRhVhV9l6vJuOA_86P4t-DJZZyIjxpikNU-R_uXi-udXaToyRrGqE4MzScq2hAwY-uj3gT-ixoko2djBFmLQDdYk4sPlJTE3i7hTdHRFknMPQB84oCSMMb33DNw6mv7Sd_ISPoIPss3FNi7pZVHM2SDJWzIsOSyBSkJL6ezIpH7H4L_J3L9WD4lR5pEhEieVwTBWEvVRElgWtrkHAzE9-8YWXY-7It9rj8a26WUwMlzeal2iFYzKxUbWVAJv1-4eEcrir-8zia4lKST2R9YGGNOw',
    e: 'AQAB',
    p: 'wnLkOTNv_aTJDwSxAAqnbeEbQngLl3DCb2EzgIeN__w7iIyE14hu2GQ_S_9hwtHIWgLb8E5vp8MI19h85XjDsXoFUBExOAslLZxRrioqeBH70410jWnOkRmxuD5mpQj0fJY4byGNEEUZtw7XHfjPdCHSpjsT9W8D_CbQ1vP51ec',
    q: '5Tluh0iuxy5RfFAlsM63sRmL1wrEmzvr6MPs4BvYc278JJdn2P4CJ9fSD59P92uKJtVZ4Kf8g56QjYSdKEgSjKZWdm2ehnV_ccoWJdIDH3DXmUsqfZY__JQ_T4IvGyWYWOuKcbNHRZ_P62dYNrZKIQjf0SbNh-raspea9mxhu40',
    dp: 'r_qq8dnLkRKBpEXqqs75mEgSE6XxV62FSqf9pGUJ7pKojnwd_bJMHysa3fzSzS5u1Ieh5WoXQw0QA8i5wDP7Z7O2-y-UC9SKYS0H_0fKB8C-2Ec9JH6NpGRMoyJWYyYnnlmV2X3T3NWs4C9eIJH9rmyt6COvfIBsatf2SZOkmCE',
    dq: 'X1o6ri__9H9CClJUu23iX9tenn-uNV0Bz3vhB4DN04bxgE8zNcLEJsrSaQk-fI_RkkHh92Ap3J6TRytJLL5-aN-wy-bhsNEjyLPl7qmj_uoz5WKtNDzSNUF97Jcc_U_wRd0FZDLNjRrjpOsCeQ_vWjqU0C4yBT4e53fFUIjZRuk',
    qi: 'AeuHMVeVZXlHro2g5bi8g7i-Fd9h36qh3GPJv8DaXX1FcZYU7Pj3OOL3YdXxikGYJdb-fVhI9hIOSpjJAXLng6Xx16xXy97I1SN1MN7W4TrTu-LGD1HanCvnx_4WGy3pb1_1yJPMGwKis3X8vEi1NITooGsUjSgmrheYB3iJkqA',
  },
  public: {
    kty: 'RSA',
    alg: 'RS256',
    kid: 'c2ee2909-78c7-4d07-8649-3b098984a825',
    n: 'rhxlsBuboanT4XlKE23Vpv5QRZjQoTVYu4xDbBs7c-1oJHRfuIGOW3mn4CTUeJuRhVhV9l6vJuOA_86P4t-DJZZyIjxpikNU-R_uXi-udXaToyRrGqE4MzScq2hAwY-uj3gT-ixoko2djBFmLQDdYk4sPlJTE3i7hTdHRFknMPQB84oCSMMb33DNw6mv7Sd_ISPoIPss3FNi7pZVHM2SDJWzIsOSyBSkJL6ezIpH7H4L_J3L9WD4lR5pEhEieVwTBWEvVRElgWtrkHAzE9-8YWXY-7It9rj8a26WUwMlzeal2iFYzKxUbWVAJv1-4eEcrir-8zia4lKST2R9YGGNOw',
    e: 'AQAB',
    p: 'wnLkOTNv_aTJDwSxAAqnbeEbQngLl3DCb2EzgIeN__w7iIyE14hu2GQ_S_9hwtHIWgLb8E5vp8MI19h85XjDsXoFUBExOAslLZxRrioqeBH70410jWnOkRmxuD5mpQj0fJY4byGNEEUZtw7XHfjPdCHSpjsT9W8D_CbQ1vP51ec',
    q: '5Tluh0iuxy5RfFAlsM63sRmL1wrEmzvr6MPs4BvYc278JJdn2P4CJ9fSD59P92uKJtVZ4Kf8g56QjYSdKEgSjKZWdm2ehnV_ccoWJdIDH3DXmUsqfZY__JQ_T4IvGyWYWOuKcbNHRZ_P62dYNrZKIQjf0SbNh-raspea9mxhu40',
    dp: 'r_qq8dnLkRKBpEXqqs75mEgSE6XxV62FSqf9pGUJ7pKojnwd_bJMHysa3fzSzS5u1Ieh5WoXQw0QA8i5wDP7Z7O2-y-UC9SKYS0H_0fKB8C-2Ec9JH6NpGRMoyJWYyYnnlmV2X3T3NWs4C9eIJH9rmyt6COvfIBsatf2SZOkmCE',
    dq: 'X1o6ri__9H9CClJUu23iX9tenn-uNV0Bz3vhB4DN04bxgE8zNcLEJsrSaQk-fI_RkkHh92Ap3J6TRytJLL5-aN-wy-bhsNEjyLPl7qmj_uoz5WKtNDzSNUF97Jcc_U_wRd0FZDLNjRrjpOsCeQ_vWjqU0C4yBT4e53fFUIjZRuk',
    qi: 'AeuHMVeVZXlHro2g5bi8g7i-Fd9h36qh3GPJv8DaXX1FcZYU7Pj3OOL3YdXxikGYJdb-fVhI9hIOSpjJAXLng6Xx16xXy97I1SN1MN7W4TrTu-LGD1HanCvnx_4WGy3pb1_1yJPMGwKis3X8vEi1NITooGsUjSgmrheYB3iJkqA',
  },
};

export const aWalletInstance = async () => ({
  createdAt: new Date(),
  hardwareKey: await jose.exportJWK(hardwareKeyPair.publicKey),
  id: 'anId',
  signCount: 0,
  userId: 'aUserId',
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
