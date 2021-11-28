"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDominance = void 0;
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const getCandleRatio = fp_ts_1.array.map(({ open, close }) => open > close
    ? { type: 'loss', changeRatio: open / close - 1 }
    : { type: 'profit', changeRatio: close / open - 1 });
/*
0.75 seems to be the threshold for BTC (dominated/not dominated)
*/
const getDominance = (base, derived) => {
    const zipped = (0, function_1.pipe)(getCandleRatio(base), fp_ts_1.array.zip(getCandleRatio(derived)));
    const ratio = (0, function_1.pipe)(zipped, fp_ts_1.array.reduce(0, (acc, [base, derived]) => base.type === derived.type ? acc + 1 : acc), (dominated) => dominated / zipped.length);
    return ratio;
};
exports.getDominance = getDominance;
