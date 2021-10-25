import { array, record } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import * as N from 'fp-ts/number';
import { contramap } from 'fp-ts/Ord';

export type VolumeCandle = { price: number; volume: number };

const volumeCandleOrd = pipe(
  N.Ord,
  contramap((c: VolumeCandle) => c.price)
);

export const volumeLevels =
  (step: number) =>
  (candles: VolumeCandle[]): VolumeCandle[] =>
    pipe(
      candles,
      array.sort(volumeCandleOrd),
      array.reduce({} as Record<string, number>, (acc, { price, volume }) => ({
        ...acc,
        [roundTo(price, step)]: acc[roundTo(price, step)] || 0 + volume,
      })),
      record.toArray,
      array.map(([price, volume]) => ({ price: parseFloat(price), volume }))
    );

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export type WeightedVolumeCandle = VolumeCandle & { weight: number };

export const volumeToSimpleAverage = (
  candles: VolumeCandle[]
): WeightedVolumeCandle[] =>
  pipe(
    candles.reduce((acc, cur) => acc + cur.volume, 0) / candles.length,
    (averageVolume) =>
      candles.map((c) => ({ ...c, weight: c.volume / averageVolume }))
  );

export const volumeToMax = (candles: VolumeCandle[]): WeightedVolumeCandle[] =>
  pipe(Math.max(...candles.map((c) => c.volume)), (maxVolume) =>
    candles.map((c) => ({ ...c, weight: c.volume / maxVolume }))
  );
