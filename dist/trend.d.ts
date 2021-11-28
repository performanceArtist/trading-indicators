import { nonEmptyArray, option } from 'fp-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
export declare type Curve = {
    type: 'rising' | 'falling';
    data: NonEmptyArray<number>;
};
export declare const nextTrend: ({ prevQueue, result }: import("./utils").IntervalAcc<number, nonEmptyArray.NonEmptyArray<Curve>>, cur: number) => import("./utils").IntervalAcc<number, nonEmptyArray.NonEmptyArray<Curve>>;
export declare const getTrendAcc: (arr: number[]) => option.Option<import("./utils").IntervalAcc<number, nonEmptyArray.NonEmptyArray<Curve>>>;
export declare const getAverageCurveLength: (curves: Array<Curve>) => number;
export declare const generalizeTrend: (curves: NonEmptyArray<Curve>) => option.Option<nonEmptyArray.NonEmptyArray<Curve>>;
export declare type HighLow = {
    type: 'high' | 'low';
    value: number;
};
export declare const getHighLows: (curves: NonEmptyArray<Curve>) => NonEmptyArray<HighLow>;
export declare const higherHighsHigherLows: (highlows: NonEmptyArray<HighLow>) => option.Option<boolean>;
export declare const higherHighsHigherLowsRatio: (highlows: NonEmptyArray<HighLow>) => option.Option<{
    low: number;
    high: number;
}>;
export declare const higherHighsHigherLowsThreshold: (threshold: {
    high: number;
    low: number;
}) => (highlows: NonEmptyArray<HighLow>) => option.Option<boolean>;
