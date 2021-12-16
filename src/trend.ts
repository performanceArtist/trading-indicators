import { array, nonEmptyArray, option } from 'fp-ts';
import { sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { reduceInterval, withNextQueue } from './utils';

export type Curve = {
  type: 'rising' | 'falling';
  data: NonEmptyArray<number>;
};

const getInitCurve = (a: number, b: number): Curve =>
  a > b ? { type: 'falling', data: [a, b] } : { type: 'rising', data: [a, b] };

export const nextTrendAcc = withNextQueue(
  (acc: NonEmptyArray<Curve>, [a, b]: NonEmptyArray<number>) =>
    pipe(
      acc,
      nonEmptyArray.last,
      (last): NonEmptyArray<Curve> => {
        if (a > b) {
          return last.type === 'falling'
            ? [{ type: 'falling', data: pipe(last.data, array.append(b)) }]
            : [last, { type: 'falling', data: nonEmptyArray.of(b) }];
        } else {
          return last.type === 'rising'
            ? [{ type: 'rising', data: pipe(last.data, array.append(b)) }]
            : [last, { type: 'rising', data: nonEmptyArray.of(b) }];
        }
      },
      (update) => pipe(acc, nonEmptyArray.init, nonEmptyArray.concat(update))
    )
);

export const initTrendAcc = reduceInterval(
  ([a, b]: NonEmptyArray<number>) => nonEmptyArray.of(getInitCurve(a, b)),
  nextTrendAcc
)(2);

export const getAverageCurveLength = (curves: Array<Curve>) =>
  pipe(
    curves,
    array.reduce(0, (acc, cur) => acc + cur.data.length),
    (r) => Math.round(r / curves.length)
  );

export const generalizeTrend = (curves: NonEmptyArray<Curve>) =>
  pipe(
    curves,
    array.filter((curve) => curve.data.length > getAverageCurveLength(curves)),
    nonEmptyArray.fromArray,
    option.map((curves) =>
      pipe(
        nonEmptyArray.tail(curves),
        array.reduce(nonEmptyArray.of(nonEmptyArray.head(curves)), (acc, cur) =>
          pipe(nonEmptyArray.last(acc), (last) =>
            last.type === cur.type
              ? pipe(
                  acc,
                  nonEmptyArray.init,
                  nonEmptyArray.concat(
                    nonEmptyArray.of({
                      type: last.type,
                      data: pipe(last.data, nonEmptyArray.concat(cur.data)),
                    })
                  )
                )
              : pipe(acc, array.append(cur))
          )
        )
      )
    )
  );

export type HighLow = {
  type: 'high' | 'low';
  value: number;
};

export const getHighLows = (
  curves: NonEmptyArray<Curve>
): NonEmptyArray<HighLow> =>
  pipe(
    curves,
    nonEmptyArray.map((curve) =>
      curve.type === 'falling'
        ? { type: 'low', value: nonEmptyArray.last(curve.data) }
        : { type: 'high', value: nonEmptyArray.last(curve.data) }
    )
  );

const isGrowing = (data: number[]) =>
  pipe(
    data,
    nonEmptyArray.fromArray,
    option.map((lows) =>
      pipe(
        nonEmptyArray.tail(lows),
        array.reduce(
          { last: nonEmptyArray.head(lows), result: false },
          (acc, cur) => ({
            last: cur,
            result: acc.result && cur > acc.last,
          })
        )
      )
    )
  );

export const higherHighsHigherLows = (highlows: NonEmptyArray<HighLow>) => {
  const lows = pipe(
    highlows,
    array.filter((highlow) => highlow.type === 'low'),
    array.map((low) => low.value)
  );
  const highs = pipe(
    highlows,
    array.filter((highlow) => highlow.type === 'high'),
    array.map((high) => high.value)
  );

  const higherLows = isGrowing(lows);

  const higherHighs = isGrowing(highs);

  return pipe(
    sequenceT(option.option)(higherLows, higherHighs),
    option.map(([a, b]) => a.result && b.result)
  );
};

const growingRate = (data: number[]) =>
  pipe(
    data,
    nonEmptyArray.fromArray,
    option.map((lows) =>
      pipe(
        nonEmptyArray.tail(lows),
        array.reduce(
          { last: nonEmptyArray.head(lows), num: 0 },
          (acc, cur) => ({
            last: cur,
            num: cur > acc.last ? acc.num + 1 : acc.num,
          })
        ),
        (acc) => acc.num / lows.length
      )
    )
  );

export const higherHighsHigherLowsRatio = (
  highlows: NonEmptyArray<HighLow>
) => {
  const lows = pipe(
    highlows,
    array.filter((highlow) => highlow.type === 'low'),
    array.map((low) => low.value)
  );
  const highs = pipe(
    highlows,
    array.filter((highlow) => highlow.type === 'high'),
    array.map((high) => high.value)
  );

  const higherLows = growingRate(lows);

  const higherHighs = growingRate(highs);

  return pipe(
    sequenceT(option.option)(higherLows, higherHighs),
    option.map(([low, high]) => ({ low, high }))
  );
};

export const higherHighsHigherLowsThreshold =
  (threshold: { high: number; low: number }) =>
  (highlows: NonEmptyArray<HighLow>) =>
    pipe(
      higherHighsHigherLowsRatio(highlows),
      option.map(
        (ratio) => ratio.high > threshold.high && ratio.low > threshold.low
      )
    );
