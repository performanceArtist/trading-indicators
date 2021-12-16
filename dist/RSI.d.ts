import { nonEmptyArray, option } from 'fp-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Option } from 'fp-ts/lib/Option';
import { IntervalAcc } from './utils';
export declare type RSIData = {
    averageGain: number;
    averageLoss: number;
    rsi: number;
};
export declare type RSIAcc = [
    IntervalAcc<number, NonEmptyArray<PricePoint>>,
    NonEmptyArray<RSIData>
];
export declare const initRSIAcc: (period: number) => (input: number[]) => Option<RSIAcc>;
export declare const nextRSIAcc: (period: number) => (acc: RSIAcc, cur: number) => RSIAcc;
declare type PricePoint = {
    type: 'gain';
    value: number;
} | {
    type: 'loss';
    value: number;
};
export declare const fromRSIAcc: (acc: RSIAcc) => NonEmptyArray<number>;
export declare const getRSI: (period: number) => (prices: number[]) => option.Option<nonEmptyArray.NonEmptyArray<number>>;
export {};
