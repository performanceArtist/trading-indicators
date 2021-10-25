import { array, nonEmptyArray, option } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Option } from 'fp-ts/lib/Option';

export const splitAtFixed =
  (period: number) =>
  <A>(arr: A[]): Option<[NonEmptyArray<A>, A[]]> =>
    pipe(
      arr,
      option.fromPredicate((arr) => arr.length >= period),
      option.chain(
        flow(array.splitAt(period), ([init, rest]) =>
          pipe(
            init,
            nonEmptyArray.fromArray,
            option.map((init) => [init, rest])
          )
        )
      )
    );
