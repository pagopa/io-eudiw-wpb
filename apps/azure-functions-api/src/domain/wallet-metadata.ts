import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { getJwkPublicKeyList } from './signer';
import { pipe } from 'fp-ts/lib/function';

// TODO: Move to configuration
export const baseURL = 'https://io-d-itn-eudiw-api-func-01.azurewebsites.net';

export const getWalletMetadata = pipe(
  RTE.Do,
  RTE.apSW('jwks', getJwkPublicKeyList),
  RTE.map(({ jwks }) => ({
    authorization_endpoint: 'haip://',
    response_types_supported: ['vp_token'],
    vp_formats_supported: {
      'dc+sd-jwt': {
        'sd-jwt_alg_values': ['ES256'],
      },
    },
    client_id_schemes_supported: ['pre-registred', 'x509_san_dns'],
    jwks: {
      keys: jwks,
    },
  })),
);
