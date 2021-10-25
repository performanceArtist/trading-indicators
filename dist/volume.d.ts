export declare type VolumeCandle = {
    price: number;
    volume: number;
};
export declare const volumeLevels: (step: number) => (candles: VolumeCandle[]) => VolumeCandle[];
export declare type WeightedVolumeCandle = VolumeCandle & {
    weight: number;
};
export declare const volumeToSimpleAverage: (candles: VolumeCandle[]) => WeightedVolumeCandle[];
export declare const volumeToMax: (candles: VolumeCandle[]) => WeightedVolumeCandle[];
