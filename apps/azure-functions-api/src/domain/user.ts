import * as t from 'io-ts';
import { NonEmptyString } from '@pagopa/ts-commons/lib/strings';

export const User = t.type({
  id: NonEmptyString,
});
export type User = t.TypeOf<typeof User>;
