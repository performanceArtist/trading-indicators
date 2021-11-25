import { array, nonEmptyArray, option } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { mapInterval } from './utils/mapInterval';
import { splitAtFixed } from './utils/splitAtFixed';

// https://www.investopedia.com/terms/m/movingaverage.asp

const nextSimpleMA = (next: number[]) =>
  next.reduce((acc, cur) => acc + cur, 0) / next.length;

export const simpleMAAcc = mapInterval(nextSimpleMA);

export const simpleMA = (period: number) =>
  flow(
    simpleMAAcc(period),
    option.map((acc) => acc.result)
  );

export const initialExponentialMA = (init: number[]) =>
  nonEmptyArray.of(init.reduce((acc, cur) => acc + cur, 0) / init.length);

export const nextExponentialMA =
  (period: number) => (acc: NonEmptyArray<number>, cur: number) =>
    pipe(
      getSmoothFactor(period),
      (smoothFactor) =>
        cur * smoothFactor + nonEmptyArray.last(acc) * (1 - smoothFactor),
      (next) => pipe(acc, array.append(next))
    );

const getSmoothFactor = (period: number) => 2 / (period + 1);

export const exponentialMA = (period: number) => (prices: number[]) =>
  pipe(
    splitAtFixed(period)(prices),
    option.map(([init, rest]) =>
      pipe(
        rest,
        array.reduce(initialExponentialMA(init), nextExponentialMA(period))
      )
    )
  );
