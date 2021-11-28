import { array } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Candle } from './types';

type CandleRatio = {
  type: 'loss' | 'profit';
  changeRatio: number;
};

const getCandleRatio = array.map<Candle, CandleRatio>(({ open, close }) =>
  open > close
    ? { type: 'loss', changeRatio: open / close - 1 }
    : { type: 'profit', changeRatio: close / open - 1 }
);

/*
0.75 seems to be the threshold for BTC (dominated/not dominated)
*/
export const getDominance = (base: Candle[], derived: Candle[]) => {
  const zipped = pipe(getCandleRatio(base), array.zip(getCandleRatio(derived)));
  const ratio = pipe(
    zipped,
    array.reduce(0, (acc, [base, derived]) =>
      base.type === derived.type ? acc + 1 : acc
    ),
    (dominated) => dominated / zipped.length
  );

  return ratio;
};
