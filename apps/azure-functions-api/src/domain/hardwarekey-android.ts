import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as H from '@pagopa/handler-kit';
import { CreateWalletInstanceBody as WalletInstanceRequest } from '../generated/definitions/endpoints/CreateWalletInstanceBody';
import { X509Certificate } from 'crypto';
import * as asn1js from 'asn1js';
import * as pkijs from 'pkijs';
import * as jose from 'jose';
import { JwkPublicKey } from './jwk';

/**
 * Key attestation extension data schema OID
 * https://developer.android.com/privacy-and-security/security-key-attestation#key_attestation_ext_schema
 */
const KEY_OID = '1.3.6.1.4.1.11129.2.1.17';

export const base64ToPem = (b64cert: string) =>
  E.tryCatch(
    () =>
      new X509Certificate(
        `-----BEGIN CERTIFICATE-----\n${b64cert}-----END CERTIFICATE-----`,
      ),
    () => new Error('Unable to decode cert'),
  );

export const extractHardwareKeyFromAndroid = (request: WalletInstanceRequest) =>
  pipe(
    E.tryCatch(
      () => Buffer.from(request.key_attestation, 'base64'),
      () => new Error(`Invalid attestation: ${request.key_attestation}`),
    ),
    E.map((data) => data.toString('utf-8').split(',')),
    E.flatMap(E.traverseArray(base64ToPem)),
    TE.fromEither,
    TE.flatMap((x509Chain) =>
      TE.tryCatch(
        () => {
          const certWithExtension = x509Chain.findLast((certificate) => {
            const asn1 = asn1js.fromBER(certificate.raw);
            const parsedCertificate = new pkijs.Certificate({
              schema: asn1.result,
            });
            const ext = parsedCertificate.extensions?.find(
              (e) => e.extnID === KEY_OID,
            );
            return ext || false;
          });
          if (certWithExtension === undefined)
            // eslint-disable-next-line functional/no-throw-statements
            throw new Error('No key attestation extension found');

          // extract and return the hardware key
          return jose.exportJWK(certWithExtension.publicKey);
        },
        () => new Error('Error extracting publicKey'),
      ),
    ),
    TE.flatMapEither(H.parse(JwkPublicKey, 'Invalid PublicKey')),
  );
