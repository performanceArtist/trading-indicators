import { nonEmptyArray, option } from 'fp-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
export declare const calculateStochRSI: (RSIs: NonEmptyArray<number>) => number;
export declare const nextStochRSI: ({ prevQueue, results }: import("./utils/mapInterval").IntervalAcc<number, number>, cur: number) => {
    prevQueue: nonEmptyArray.NonEmptyArray<number>;
    results: nonEmptyArray.NonEmptyArray<number>;
};
export declare const getStochRSIAcc: (period: number) => (prices: number[]) => option.Option<import("./utils/mapInterval").IntervalAcc<number, number>>;
export declare const getStochRSI: (period: number) => (prices: number[]) => option.Option<nonEmptyArray.NonEmptyArray<number>>;
export declare const getSmoothStochRSI: (period: number) => (prices: number[]) => option.Option<nonEmptyArray.NonEmptyArray<number>>;
