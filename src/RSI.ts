import { array, nonEmptyArray, option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { mapInterval, withNextQueue } from './utils/mapInterval';
import { splitAtFixed } from './utils/splitAtFixed';

// https://school.stockcharts.com/doku.php?id=technical_indicators:relative_strength_index_rsi

export type RSIData = {
  averageGain: number;
  averageLoss: number;
  rsi: number;
};

export const initialRSI = (periods: PricePoint[]) => {
  const averageGain = pipe(
    periods,
    array.filter((p) => p.type == 'gain'),
    (ps) => ps.reduce((acc, cur) => acc + cur.value, 0) / ps.length
  );

  const averageLoss = pipe(
    periods,
    array.filter((p) => p.type == 'loss'),
    (ps) => ps.reduce((acc, cur) => acc + cur.value, 0) / ps.length
  );

  const rsi = 100 - 100 / (1 + averageGain / averageLoss);

  return nonEmptyArray.of({ averageGain, averageLoss, rsi });
};

type PricePoint =
  | {
      type: 'gain';
      value: number;
    }
  | { type: 'loss'; value: number };

export const toPricePoint = ([a, b]: number[]): PricePoint =>
  a > b ? { type: 'loss', value: a - b } : { type: 'gain', value: b - a };

const fromPrices = (prices: number[]) =>
  pipe(prices, mapInterval(toPricePoint, withNextQueue(toPricePoint))(2));

export const nextRSI =
  (period: number) => (acc: NonEmptyArray<RSIData>, cur: PricePoint) =>
    pipe(
      acc,
      nonEmptyArray.last,
      (prev) => ({
        averageGain: (prev.averageGain * period + getGain(cur)) / (period + 1),
        averageLoss: (prev.averageLoss * period + getLoss(cur)) / (period + 1),
      }),
      ({ averageGain, averageLoss }) =>
        nonEmptyArray.snoc(acc, {
          averageGain,
          averageLoss,
          rsi: 100 - 100 / (1 + averageGain / averageLoss),
        })
    );

const getGain = (c: PricePoint) => (c.type == 'gain' ? c.value : 0);

const getLoss = (c: PricePoint) => (c.type == 'loss' ? c.value : 0);

export const getRSIAcc = (period: number) => (prices: number[]) =>
  pipe(
    prices,
    fromPrices,
    option.chain((acc) =>
      pipe(
        acc.results,
        splitAtFixed(period),
        option.map(([init, rest]) =>
          pipe(rest, array.reduce(initialRSI(init), nextRSI(period)))
        ),
        option.map((rsi) => ({ rsi, acc }))
      )
    )
  );

export const getRSI = (period: number) => (prices: number[]) =>
  pipe(
    getRSIAcc(period)(prices),
    option.map((acc) =>
      pipe(
        acc.rsi,
        nonEmptyArray.map((r) => r.rsi)
      )
    )
  );
