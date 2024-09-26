import { HttpRequest } from '@azure/functions';

export const makeHttpRequest = (body?: unknown): HttpRequest =>
  new HttpRequest({
    url: 'http://localhost/endpoint',
    method: 'POST',
    body: body ? { string: JSON.stringify(body) } : {},
  });
