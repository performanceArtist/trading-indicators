import { nonEmptyArray, option } from 'fp-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
export declare const calculateStochRSI: (RSIs: NonEmptyArray<number>) => number;
export declare const getStochRSIAcc: (period: number) => (prices: number[]) => option.Option<import("./utils/mapInterval").IntervalAcc<number, nonEmptyArray.NonEmptyArray<number>>>;
export declare const getStochRSI: (period: number) => (prices: number[]) => option.Option<nonEmptyArray.NonEmptyArray<number>>;
