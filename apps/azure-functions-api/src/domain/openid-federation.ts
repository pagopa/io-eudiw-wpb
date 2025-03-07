import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { getJwkPublicKeyList, signJwt } from './signer';
import { pipe } from 'fp-ts/lib/function';

// TODO: Move to configuration
export const baseURL = 'https://io-d-itn-eudiw-api-func-01.azurewebsites.net';

export const getFederationMetadata = pipe(
  RTE.Do,
  RTE.apSW('jwks', getJwkPublicKeyList),
  RTE.map(({ jwks }) => ({
    authority_hints: [],
    iss: baseURL,
    jwks: {
      keys: jwks,
    },
    metadata: {
      federation_entity: {
        homepage_uri: 'https://io.italia.it',
        logo_uri: 'https://io.italia.it/assets/img/io-it-logo-blue.svg',
        organization_name: 'PagoPa S.p.A.',
        policy_uri: 'https://io.italia.it/privacy-policy',
        tos_uri: 'https://io.italia.it/privacy-policy',
      },
      wallet_provider: {
        aal_values_supported: [
          `${baseURL}/LoA/basic`,
          `${baseURL}/LoA/medium`,
          `${baseURL}/LoA/hight`,
        ],
        grant_types_supported: [
          'urn:ietf:params:oauth:client-assertion-type:jwt-client-attestation',
        ],
        jwks: {
          keys: jwks,
        },
        token_endpoint: `${baseURL}/token`,
        token_endpoint_auth_methods_supported: ['private_key_jwt'],
        // TODO: Add all supported algorithms
        token_endpoint_auth_signing_alg_values_supported: ['ES256'],
      },
      authorization_endpoint: 'haip://',
      response_types_supported: ['vp_token'],
      vp_formats_supported: {
        'dc+sd-jwt': {
          'sd-jwt_alg_values': ['ES256'],
        },
      },
      client_id_schemes_supported: ['pre-registred', 'x509_san_dns'],
    },
    sub: baseURL,
  })),
  RTE.flatMap((payload) =>
    signJwt({ header: { typ: 'entity-statement+jwt' }, payload }),
  ),
  RTE.map(({ jwt }) => jwt),
);
