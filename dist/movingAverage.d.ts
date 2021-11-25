import { nonEmptyArray, option } from 'fp-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
export declare const simpleMAAcc: (period: number) => (arr: number[]) => option.Option<import("./utils/mapInterval").IntervalAcc<number, nonEmptyArray.NonEmptyArray<number>>>;
export declare const simpleMA: (period: number) => (arr: number[]) => option.Option<nonEmptyArray.NonEmptyArray<number>>;
export declare const initialExponentialMA: (init: number[]) => nonEmptyArray.NonEmptyArray<number>;
export declare const nextExponentialMA: (period: number) => (acc: NonEmptyArray<number>, cur: number) => nonEmptyArray.NonEmptyArray<number>;
export declare const exponentialMA: (period: number) => (prices: number[]) => option.Option<nonEmptyArray.NonEmptyArray<number>>;
