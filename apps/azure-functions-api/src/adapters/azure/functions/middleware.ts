import { Decoder } from 'io-ts';
import * as H from '@pagopa/handler-kit';
import { pipe } from 'fp-ts/function';

/**
 * Parses the request body using a specified schema and validates it.
 *
 * This function takes a JSON schema decoder and an HTTP request, then attempts to
 * parse and validate the request body against the schema.
 * If the validation fails, it returns an {@link H.ValidationError}.
 */
export const parseRequestBody =
  <T>(schema: Decoder<unknown, T>) =>
  (req: H.HttpRequest) =>
    pipe(req.body, H.parse(schema, 'Missing or invalid body'));
