import { array, nonEmptyArray, option } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { mapInterval } from './utils/mapInterval';
import { splitAtFixed } from './utils/splitAtFixed';

// https://www.investopedia.com/terms/m/movingaverage.asp

const nextSimpleMA = (next: number[]) =>
  next.reduce((acc, cur) => acc + cur, 0) / next.length;

export const initSimpleMAAcc = mapInterval(nextSimpleMA);

export const getSimpleMA = (period: number) =>
  flow(
    initSimpleMAAcc(period),
    option.map((acc) => acc.result)
  );

export const initExponentialMA = (init: number[]) =>
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

export const getExponentialMA = (period: number) => (prices: number[]) =>
  pipe(
    splitAtFixed(period)(prices),
    option.map(([init, rest]) =>
      pipe(
        rest,
        array.reduce(initExponentialMA(init), nextExponentialMA(period))
      )
    )
  );
