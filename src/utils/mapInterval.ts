import { array, option } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Option } from 'fp-ts/lib/Option';
import { splitAtFixed } from './splitAtFixed';

export type IntervalAcc<A, B> = {
  prevQueue: NonEmptyArray<A>;
  results: NonEmptyArray<B>;
};

export const withNextQueue =
  <A, B>(f: (init: NonEmptyArray<A>) => B) =>
  ({ prevQueue, results }: IntervalAcc<A, B>, cur: A) => {
    const newQueue = [...prevQueue] as NonEmptyArray<A>;
    newQueue.shift();
    newQueue.push(cur);

    return {
      prevQueue: newQueue,
      results: pipe(results, array.append(f(newQueue))),
    };
  };

export const mapInterval =
  <A, B>(
    f: (init: NonEmptyArray<A>) => B,
    g: ({ prevQueue, results }: IntervalAcc<A, B>, cur: A) => IntervalAcc<A, B>
  ) =>
  (period: number) =>
  (arr: A[]): Option<IntervalAcc<A, B>> =>
    pipe(
      arr,
      splitAtFixed(period),
      option.map(
        flow(([init, rest]) =>
          pipe(rest, array.reduce({ prevQueue: init, results: [f(init)] }, g))
        )
      )
    );
