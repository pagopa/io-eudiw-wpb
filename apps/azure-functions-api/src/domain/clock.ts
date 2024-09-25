import * as RTE from 'fp-ts/ReaderTaskEither';
import { pipe } from 'fp-ts/lib/function';

export interface ClockEnv {
  readonly clock?: Clock;
}

export interface Clock {
  readonly now: () => Date;
}

const defaultClock = {
  now: () => new Date(),
};

export const nowDate = () =>
  pipe(
    RTE.ask<ClockEnv>(),
    RTE.map(({ clock }) => (clock || defaultClock).now()),
  );
