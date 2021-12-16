import { array, nonEmptyArray, option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { mapInterval } from './utils/mapInterval';
import { splitAtFixed } from './utils/splitAtFixed';
import { withNextArrayQueue } from './utils';
import { Option } from 'fp-ts/lib/Option';
import { IntervalAcc } from './utils';

// https://school.stockcharts.com/doku.php?id=technical_indicators:relative_strength_index_rsi

export type RSIData = {
  averageGain: number;
  averageLoss: number;
  rsi: number;
};

const getPricePoint = ([a, b]: number[]): PricePoint =>
  a > b ? { type: 'loss', value: a - b } : { type: 'gain', value: b - a };

const initPricePoint = mapInterval(getPricePoint)(2);
const nextPricePoint = withNextArrayQueue(getPricePoint);

const initRSI = (periods: PricePoint[]): NonEmptyArray<RSIData> => {
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

export type RSIAcc = [
  IntervalAcc<number, NonEmptyArray<PricePoint>>,
  NonEmptyArray<RSIData>
];

export const initRSIAcc =
  (period: number) =>
  (input: number[]): Option<RSIAcc> =>
    pipe(
      initPricePoint(input),
      option.chain((acc) =>
        pipe(
          acc.result,
          splitAtFixed(period),
          option.map(([init, rest]) =>
            pipe(rest, array.reduce(initRSI(init), nextRSI(period)))
          ),
          option.map((rsi) => [acc, rsi])
        )
      )
    );

export const nextRSIAcc =
  (period: number) =>
  (acc: RSIAcc, cur: number): RSIAcc => {
    const [pointAcc, rsi] = acc;
    const nextP = nextPricePoint(pointAcc, cur);
    const lastPoint = nonEmptyArray.last(nextP.result);

    return [nextP, nextRSI(period)(rsi, lastPoint)];
  };

const nextRSI =
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

type PricePoint =
  | {
      type: 'gain';
      value: number;
    }
  | { type: 'loss'; value: number };

const getGain = (c: PricePoint) => (c.type == 'gain' ? c.value : 0);

const getLoss = (c: PricePoint) => (c.type == 'loss' ? c.value : 0);

export const fromRSIAcc = (acc: RSIAcc): NonEmptyArray<number> =>
  pipe(
    acc[1],
    nonEmptyArray.map((r) => r.rsi)
  );

export const getRSI = (period: number) => (prices: number[]) =>
  pipe(initRSIAcc(period)(prices), option.map(fromRSIAcc));
