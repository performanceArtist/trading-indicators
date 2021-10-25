import { array, option } from 'fp-ts';
import { sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';
import { Option } from 'fp-ts/lib/Option';
import { Candle } from './types';
import { exponentialMA } from './movingAverage';

export type TrendDirection = 'rising' | 'falling' | 'flat';

export type Curve = {
  type: TrendDirection;
  data: number[];
};

export type TrendAcc = {
  curSpline: number[];
  curves: Curve[];
};

export type TrendOptions = {
  flatTolerancePercent: number;
  emaPeriod: number;
  splinePeriod: number;
};

export const buildTrendAcc =
  ({ flatTolerancePercent, emaPeriod, splinePeriod }: TrendOptions) =>
  (candles: Candle[]) =>
    pipe(
      candles,
      array.map((c) => (c.open + c.close + c.low + c.high) / 4),
      exponentialMA(emaPeriod),
      option.map(trendAcc(flatTolerancePercent, splinePeriod))
    );

export const buildTrend = (options: TrendOptions) => (candles: Candle[]) =>
  pipe(
    buildTrendAcc(options)(candles),
    option.map((acc) => acc.curves)
  );

const nextTrendAcc =
  (flatTolerancePercent: number, period: number) =>
  (acc: TrendAcc, cur: number) =>
    acc.curSpline.length == period - 1
      ? {
          curves: pipe(
            makeCurve(flatTolerancePercent)(acc.curSpline.concat(cur)),
            option.fold(
              () => acc.curves,
              (c) => appendCurve(flatTolerancePercent)(acc.curves)(c)
            )
          ),
          curSpline: [],
        }
      : { ...acc, curSpline: acc.curSpline.concat(cur) };

const trendAcc =
  (flatTolerancePercent: number, period: number) => (values: number[]) =>
    pipe(
      values,
      array.reduce(
        { curSpline: [], curves: [] } as TrendAcc,
        nextTrendAcc(flatTolerancePercent, period)
      )
    );

const appendCurve =
  (flatTolerancePercent: number) => (cs: Curve[]) => (current: Curve) =>
    pipe(
      sequenceT(option.option)(array.init(cs), array.last(cs)),
      option.fold(
        () => cs.concat(current),
        ([init, last]) =>
          pipe(
            concatCurves(flatTolerancePercent)(last, current),
            option.fold(
              () => cs.concat(current),
              (newCurve) => init.concat(newCurve)
            )
          )
      )
    );

const concatCurves =
  (flatTolerancePercent: number) =>
  (a: Curve, b: Curve): Option<Curve> =>
    a.type !== b.type
      ? option.none
      : pipe(
          sequenceT(option.option)(array.head(a.data), array.last(b.data)),
          option.map(([first, last]) => ({
            type: a.type, // getType(flatTolerancePercent)(first, last),
            data: a.data.concat(b.data),
          }))
        );

const isFlat = (flatTolerancePercent: number) => (a: number, b: number) =>
  getPercentChange(a, b) < flatTolerancePercent;

const getType =
  (flatTolerancePercent: number) =>
  (first: number, last: number): TrendDirection =>
    first > last ? 'falling' : 'rising';
/*
  isFlat(flatTolerancePercent)(first, last)
    ? "flat"
    : 
    */

const makeCurve =
  (flatTolerancePercent: number) =>
  (spline: number[]): Option<Curve> =>
    pipe(
      sequenceT(option.option)(array.head(spline), array.last(spline)),
      option.map(([first, last]) => ({
        type: getType(flatTolerancePercent)(first, last),
        data: spline,
      }))
    );

const getPercentChange = (a: number, b: number) =>
  a > b ? 100 * (a / b - 1) : 100 * (b / a - 1);
