import { option } from 'fp-ts';
import { Candle } from './types';
export declare type TrendDirection = 'rising' | 'falling' | 'flat';
export declare type Curve = {
    type: TrendDirection;
    data: number[];
};
export declare type TrendAcc = {
    curSpline: number[];
    curves: Curve[];
};
export declare type TrendOptions = {
    flatTolerancePercent: number;
    emaPeriod: number;
    splinePeriod: number;
};
export declare const buildTrendAcc: ({ flatTolerancePercent, emaPeriod, splinePeriod }: TrendOptions) => (candles: Candle[]) => option.Option<{
    curSpline: number[];
    curves: Curve[];
}>;
export declare const buildTrend: (options: TrendOptions) => (candles: Candle[]) => option.Option<Curve[]>;
