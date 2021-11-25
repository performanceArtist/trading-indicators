import { nonEmptyArray, option } from 'fp-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Option } from 'fp-ts/lib/Option';
export declare type IntervalAcc<A, B> = {
    prevQueue: NonEmptyArray<A>;
    result: B;
};
export declare const withNextQueue: <A, B>(f: (acc: B, cur: nonEmptyArray.NonEmptyArray<A>) => B) => ({ prevQueue, result }: IntervalAcc<A, B>, cur: A) => IntervalAcc<A, B>;
export declare const reduceInterval: <A, B>(f: (init: nonEmptyArray.NonEmptyArray<A>) => B, g: (acc: IntervalAcc<A, B>, cur: A) => IntervalAcc<A, B>) => (period: number) => (arr: A[]) => option.Option<IntervalAcc<A, B>>;
export declare const mapInterval: <A, B>(f: (init: nonEmptyArray.NonEmptyArray<A>) => B) => (period: number) => (arr: A[]) => option.Option<IntervalAcc<A, nonEmptyArray.NonEmptyArray<B>>>;
