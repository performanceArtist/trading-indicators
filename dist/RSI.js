"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRSI = exports.getRSIAcc = exports.nextRSI = exports.toPricePoint = exports.initialRSI = void 0;
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const mapInterval_1 = require("./utils/mapInterval");
const splitAtFixed_1 = require("./utils/splitAtFixed");
const initialRSI = (periods) => {
    const averageGain = (0, function_1.pipe)(periods, fp_ts_1.array.filter((p) => p.type == 'gain'), (ps) => ps.reduce((acc, cur) => acc + cur.value, 0) / ps.length);
    const averageLoss = (0, function_1.pipe)(periods, fp_ts_1.array.filter((p) => p.type == 'loss'), (ps) => ps.reduce((acc, cur) => acc + cur.value, 0) / ps.length);
    const rsi = 100 - 100 / (1 + averageGain / averageLoss);
    return fp_ts_1.nonEmptyArray.of({ averageGain, averageLoss, rsi });
};
exports.initialRSI = initialRSI;
const toPricePoint = ([a, b]) => a > b ? { type: 'loss', value: a - b } : { type: 'gain', value: b - a };
exports.toPricePoint = toPricePoint;
const fromPrices = (prices) => (0, function_1.pipe)(prices, (0, mapInterval_1.mapInterval)(exports.toPricePoint, (0, mapInterval_1.withNextQueue)(exports.toPricePoint))(2));
const nextRSI = (period) => (acc, cur) => (0, function_1.pipe)(acc, fp_ts_1.nonEmptyArray.last, (prev) => ({
    averageGain: (prev.averageGain * period + getGain(cur)) / (period + 1),
    averageLoss: (prev.averageLoss * period + getLoss(cur)) / (period + 1),
}), ({ averageGain, averageLoss }) => fp_ts_1.nonEmptyArray.snoc(acc, {
    averageGain,
    averageLoss,
    rsi: 100 - 100 / (1 + averageGain / averageLoss),
}));
exports.nextRSI = nextRSI;
const getGain = (c) => (c.type == 'gain' ? c.value : 0);
const getLoss = (c) => (c.type == 'loss' ? c.value : 0);
const getRSIAcc = (period) => (prices) => (0, function_1.pipe)(prices, fromPrices, fp_ts_1.option.chain((acc) => (0, function_1.pipe)(acc.results, (0, splitAtFixed_1.splitAtFixed)(period), fp_ts_1.option.map(([init, rest]) => (0, function_1.pipe)(rest, fp_ts_1.array.reduce((0, exports.initialRSI)(init), (0, exports.nextRSI)(period)))), fp_ts_1.option.map((rsi) => ({ rsi, acc })))));
exports.getRSIAcc = getRSIAcc;
/*
const hmm = pipe(
  getRSIAcc(5)([1, 2, 3]),
  option.map(({ acc, rsi }) => {
    const nextAcc = withNextQueue(toPricePoint)(acc, 5);
    const newPrice = nonEmptyArray.last(nextAcc.results);
    const newRSI = nextRSI(5)(rsi, newPrice);

    return {
      acc: nextAcc,
      rsi: newRSI,
    };
  })
);
*/
const getRSI = (period) => (prices) => (0, function_1.pipe)((0, exports.getRSIAcc)(period)(prices), fp_ts_1.option.map((acc) => (0, function_1.pipe)(acc.rsi, fp_ts_1.nonEmptyArray.map((r) => r.rsi))));
exports.getRSI = getRSI;
