import { array, nonEmptyArray, option } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Option } from 'fp-ts/lib/Option';
import { splitAtFixed } from './splitAtFixed';

export type IntervalAcc<A, B> = {
  prevQueue: NonEmptyArray<A>;
  result: B;
};

export const withNextQueue =
  <A, B>(f: (acc: B, cur: NonEmptyArray<A>) => B) =>
  ({ prevQueue, result }: IntervalAcc<A, B>, cur: A): IntervalAcc<A, B> => {
    const newQueue = [...prevQueue] as NonEmptyArray<A>;
    newQueue.shift();
    newQueue.push(cur);

    return {
      prevQueue: newQueue,
      result: f(result, newQueue),
    };
  };

export const reduceInterval =
  <A, B>(
    f: (init: NonEmptyArray<A>) => B,
    g: (acc: IntervalAcc<A, B>, cur: A) => IntervalAcc<A, B>
  ) =>
  (period: number) =>
  (arr: A[]): Option<IntervalAcc<A, B>> =>
    pipe(
      arr,
      splitAtFixed(period),
      option.map(
        flow(([init, rest]) =>
          pipe(rest, array.reduce({ prevQueue: init, result: f(init) }, g))
        )
      )
    );

export const mapInterval = <A, B>(f: (init: NonEmptyArray<A>) => B) =>
  reduceInterval(
    (init: NonEmptyArray<A>) => nonEmptyArray.of(f(init)),
    withNextQueue((acc, cur) => pipe(acc, array.append(f(cur))))
  );
