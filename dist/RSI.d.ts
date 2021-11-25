import { nonEmptyArray, option } from 'fp-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
export declare type RSIData = {
    averageGain: number;
    averageLoss: number;
    rsi: number;
};
export declare const initialRSI: (periods: PricePoint[]) => nonEmptyArray.NonEmptyArray<{
    averageGain: number;
    averageLoss: number;
    rsi: number;
}>;
declare type PricePoint = {
    type: 'gain';
    value: number;
} | {
    type: 'loss';
    value: number;
};
export declare const toPricePoint: ([a, b]: number[]) => PricePoint;
export declare const nextRSI: (period: number) => (acc: NonEmptyArray<RSIData>, cur: PricePoint) => nonEmptyArray.NonEmptyArray<{
    averageGain: number;
    averageLoss: number;
    rsi: number;
}>;
export declare const getRSIAcc: (period: number) => (prices: number[]) => option.Option<{
    rsi: nonEmptyArray.NonEmptyArray<{
        averageGain: number;
        averageLoss: number;
        rsi: number;
    }>;
    acc: import("./utils/mapInterval").IntervalAcc<number, nonEmptyArray.NonEmptyArray<PricePoint>>;
}>;
export declare const getRSI: (period: number) => (prices: number[]) => option.Option<nonEmptyArray.NonEmptyArray<number>>;
export {};
