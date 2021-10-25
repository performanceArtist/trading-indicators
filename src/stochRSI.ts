import { nonEmptyArray, option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { exponentialMA } from './movingAverage';
import { getRSI } from './RSI';
import { mapInterval, withNextQueue } from './utils/mapInterval';

// https://www.investopedia.com/terms/s/stochrsi.asp

export const calculateStochRSI = (RSIs: NonEmptyArray<number>) =>
  (100 * (nonEmptyArray.last(RSIs) - Math.min(...RSIs))) /
  (Math.max(...RSIs) - Math.min(...RSIs));

export const nextStochRSI = withNextQueue(calculateStochRSI);

export const getStochRSIAcc = (period: number) => (prices: number[]) =>
  pipe(
    getRSI(period)(prices),
    option.chain(mapInterval(calculateStochRSI, nextStochRSI)(period))
  );

export const getStochRSI = (period: number) => (prices: number[]) =>
  pipe(
    getStochRSIAcc(period)(prices),
    option.map((acc) => acc.results)
  );

export const getSmoothStochRSI = (period: number) => (prices: number[]) =>
  pipe(getStochRSI(period)(prices), option.chain(exponentialMA(3)));
