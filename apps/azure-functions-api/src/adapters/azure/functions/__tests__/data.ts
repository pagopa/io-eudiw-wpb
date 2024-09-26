import { HttpRequest } from '@azure/functions';

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
