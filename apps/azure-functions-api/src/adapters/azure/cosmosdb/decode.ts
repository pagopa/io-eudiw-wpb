import { pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import * as E from 'fp-ts/lib/Either';
import { FeedResponse } from '@azure/cosmos';

export const decodeFromFeed =
  <A, O>(codec: t.Type<A, O>) =>
  <T extends FeedResponse<unknown>>(list: T) =>
    pipe(
      list.resources,
      t.array(codec).decode,
      E.mapLeft(
        () =>
          new Error(`Unable to parse the resources using codec ${codec.name}`),
      ),
    );
