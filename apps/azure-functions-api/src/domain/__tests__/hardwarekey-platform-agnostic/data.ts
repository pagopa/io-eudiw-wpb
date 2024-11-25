import { NonEmptyString } from '@pagopa/ts-commons/lib/strings';

const challenge = 'randomvalue';

const hardwareKey = {
  crv: 'P-256',
  kty: 'EC',
  x: 'qk9Pf-luK80erkrbyiDQEGQRA4_yTzE_KbUnHXzrlaU',
  y: '4n0ccO3SO8CrlDQdOFLi0guWzTvpLtuKX0k1tjexcpw',
};

const ephemeralKey = {
  crv: 'P-256',
  kty: 'EC',
  x: 'gIX07BFk5_4lUvz18Rv462tUx4No-w_3MMs1zMNo9Pw',
  y: '9xQ_iJISPbTzUziExHDm5Kv60yXc3DS1JfyaiIi9eBw',
  kid: 'n6ItFM_OuMFVCGhWCh5zwkjs3l5sN-1StDWvMKf0WRk',
};

const integrityAssertion = 'anyStringButNonEmpty' as NonEmptyString;

const attestation = Buffer.from(JSON.stringify(hardwareKey), 'binary').toString(
  'base64',
);

export const platformAgnosticMockData = {
  keyId: 'anHardwareKeyTag',
  attestation,
  challenge,
  ephemeralKey,
  hardwareKey,
  integrityAssertion,
};
