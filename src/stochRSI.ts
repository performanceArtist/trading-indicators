import { nonEmptyArray, option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { getRSI } from './RSI';
import { mapInterval } from './utils/mapInterval';

// https://www.investopedia.com/terms/s/stochrsi.asp

export const calculateStochRSI = (RSIs: NonEmptyArray<number>) =>
  (100 * (nonEmptyArray.last(RSIs) - Math.min(...RSIs))) /
  (Math.max(...RSIs) - Math.min(...RSIs));

export const getStochRSIAcc = (period: number) => (prices: number[]) =>
  pipe(
    getRSI(period)(prices),
    option.chain(mapInterval(calculateStochRSI)(period))
  );

export const getStochRSI = (period: number) => (prices: number[]) =>
  pipe(
    getStochRSIAcc(period)(prices),
    option.map((acc) => acc.result)
  );
