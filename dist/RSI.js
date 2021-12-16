"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRSI = exports.fromRSIAcc = exports.nextRSIAcc = exports.initRSIAcc = void 0;
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const mapInterval_1 = require("./utils/mapInterval");
const splitAtFixed_1 = require("./utils/splitAtFixed");
const utils_1 = require("./utils");
const getPricePoint = ([a, b]) => a > b ? { type: 'loss', value: a - b } : { type: 'gain', value: b - a };
const initPricePoint = (0, mapInterval_1.mapInterval)(getPricePoint)(2);
const nextPricePoint = (0, utils_1.withNextArrayQueue)(getPricePoint);
const initRSI = (periods) => {
    const averageGain = (0, function_1.pipe)(periods, fp_ts_1.array.filter((p) => p.type == 'gain'), (ps) => ps.reduce((acc, cur) => acc + cur.value, 0) / ps.length);
    const averageLoss = (0, function_1.pipe)(periods, fp_ts_1.array.filter((p) => p.type == 'loss'), (ps) => ps.reduce((acc, cur) => acc + cur.value, 0) / ps.length);
    const rsi = 100 - 100 / (1 + averageGain / averageLoss);
    return fp_ts_1.nonEmptyArray.of({ averageGain, averageLoss, rsi });
};
const initRSIAcc = (period) => (input) => (0, function_1.pipe)(initPricePoint(input), fp_ts_1.option.chain((acc) => (0, function_1.pipe)(acc.result, (0, splitAtFixed_1.splitAtFixed)(period), fp_ts_1.option.map(([init, rest]) => (0, function_1.pipe)(rest, fp_ts_1.array.reduce(initRSI(init), nextRSI(period)))), fp_ts_1.option.map((rsi) => [acc, rsi]))));
exports.initRSIAcc = initRSIAcc;
const nextRSIAcc = (period) => (acc, cur) => {
    const [pointAcc, rsi] = acc;
    const nextP = nextPricePoint(pointAcc, cur);
    const lastPoint = fp_ts_1.nonEmptyArray.last(nextP.result);
    return [nextP, nextRSI(period)(rsi, lastPoint)];
};
exports.nextRSIAcc = nextRSIAcc;
const nextRSI = (period) => (acc, cur) => (0, function_1.pipe)(acc, fp_ts_1.nonEmptyArray.last, (prev) => ({
    averageGain: (prev.averageGain * period + getGain(cur)) / (period + 1),
    averageLoss: (prev.averageLoss * period + getLoss(cur)) / (period + 1),
}), ({ averageGain, averageLoss }) => fp_ts_1.nonEmptyArray.snoc(acc, {
    averageGain,
    averageLoss,
    rsi: 100 - 100 / (1 + averageGain / averageLoss),
}));
const getGain = (c) => (c.type == 'gain' ? c.value : 0);
const getLoss = (c) => (c.type == 'loss' ? c.value : 0);
const fromRSIAcc = (acc) => (0, function_1.pipe)(acc[1], fp_ts_1.nonEmptyArray.map((r) => r.rsi));
exports.fromRSIAcc = fromRSIAcc;
const getRSI = (period) => (prices) => (0, function_1.pipe)((0, exports.initRSIAcc)(period)(prices), fp_ts_1.option.map(exports.fromRSIAcc));
exports.getRSI = getRSI;
