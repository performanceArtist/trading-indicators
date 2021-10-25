import { option } from 'fp-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Option } from 'fp-ts/lib/Option';
export declare type IntervalAcc<A, B> = {
    prevQueue: NonEmptyArray<A>;
    results: NonEmptyArray<B>;
};
export declare const withNextQueue: <A, B>(f: (init: NonEmptyArray<A>) => B) => ({ prevQueue, results }: IntervalAcc<A, B>, cur: A) => {
    prevQueue: NonEmptyArray<A>;
    results: NonEmptyArray<B>;
};
export declare const mapInterval: <A, B>(f: (init: NonEmptyArray<A>) => B, g: ({ prevQueue, results }: IntervalAcc<A, B>, cur: A) => IntervalAcc<A, B>) => (period: number) => (arr: A[]) => option.Option<IntervalAcc<A, B>>;
