"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.higherHighsHigherLowsThreshold = exports.higherHighsHigherLowsRatio = exports.higherHighsHigherLows = exports.getHighLows = exports.generalizeTrend = exports.getAverageCurveLength = exports.initTrendAcc = exports.nextTrendAcc = void 0;
const fp_ts_1 = require("fp-ts");
const Apply_1 = require("fp-ts/lib/Apply");
const function_1 = require("fp-ts/lib/function");
const utils_1 = require("./utils");
const getInitCurve = (a, b) => a > b ? { type: 'falling', data: [a, b] } : { type: 'rising', data: [a, b] };
exports.nextTrendAcc = (0, utils_1.withNextQueue)((acc, [a, b]) => (0, function_1.pipe)(acc, fp_ts_1.nonEmptyArray.last, (last) => {
    if (a > b) {
        return last.type === 'falling'
            ? [{ type: 'falling', data: (0, function_1.pipe)(last.data, fp_ts_1.array.append(b)) }]
            : [last, { type: 'falling', data: fp_ts_1.nonEmptyArray.of(b) }];
    }
    else {
        return last.type === 'rising'
            ? [{ type: 'rising', data: (0, function_1.pipe)(last.data, fp_ts_1.array.append(b)) }]
            : [last, { type: 'rising', data: fp_ts_1.nonEmptyArray.of(b) }];
    }
}, (update) => (0, function_1.pipe)(acc, fp_ts_1.nonEmptyArray.init, fp_ts_1.nonEmptyArray.concat(update))));
exports.initTrendAcc = (0, utils_1.reduceInterval)(([a, b]) => fp_ts_1.nonEmptyArray.of(getInitCurve(a, b)), exports.nextTrendAcc)(2);
const getAverageCurveLength = (curves) => (0, function_1.pipe)(curves, fp_ts_1.array.reduce(0, (acc, cur) => acc + cur.data.length), (r) => Math.round(r / curves.length));
exports.getAverageCurveLength = getAverageCurveLength;
const generalizeTrend = (curves) => (0, function_1.pipe)(curves, fp_ts_1.array.filter((curve) => curve.data.length > (0, exports.getAverageCurveLength)(curves)), fp_ts_1.nonEmptyArray.fromArray, fp_ts_1.option.map((curves) => (0, function_1.pipe)(fp_ts_1.nonEmptyArray.tail(curves), fp_ts_1.array.reduce(fp_ts_1.nonEmptyArray.of(fp_ts_1.nonEmptyArray.head(curves)), (acc, cur) => (0, function_1.pipe)(fp_ts_1.nonEmptyArray.last(acc), (last) => last.type === cur.type
    ? (0, function_1.pipe)(acc, fp_ts_1.nonEmptyArray.init, fp_ts_1.nonEmptyArray.concat(fp_ts_1.nonEmptyArray.of({
        type: last.type,
        data: (0, function_1.pipe)(last.data, fp_ts_1.nonEmptyArray.concat(cur.data)),
    })))
    : (0, function_1.pipe)(acc, fp_ts_1.array.append(cur)))))));
exports.generalizeTrend = generalizeTrend;
const getHighLows = (curves) => (0, function_1.pipe)(curves, fp_ts_1.nonEmptyArray.map((curve) => curve.type === 'falling'
    ? { type: 'low', value: fp_ts_1.nonEmptyArray.last(curve.data) }
    : { type: 'high', value: fp_ts_1.nonEmptyArray.last(curve.data) }));
exports.getHighLows = getHighLows;
const isGrowing = (data) => (0, function_1.pipe)(data, fp_ts_1.nonEmptyArray.fromArray, fp_ts_1.option.map((lows) => (0, function_1.pipe)(fp_ts_1.nonEmptyArray.tail(lows), fp_ts_1.array.reduce({ last: fp_ts_1.nonEmptyArray.head(lows), result: false }, (acc, cur) => ({
    last: cur,
    result: acc.result && cur > acc.last,
})))));
const higherHighsHigherLows = (highlows) => {
    const lows = (0, function_1.pipe)(highlows, fp_ts_1.array.filter((highlow) => highlow.type === 'low'), fp_ts_1.array.map((low) => low.value));
    const highs = (0, function_1.pipe)(highlows, fp_ts_1.array.filter((highlow) => highlow.type === 'high'), fp_ts_1.array.map((high) => high.value));
    const higherLows = isGrowing(lows);
    const higherHighs = isGrowing(highs);
    return (0, function_1.pipe)((0, Apply_1.sequenceT)(fp_ts_1.option.option)(higherLows, higherHighs), fp_ts_1.option.map(([a, b]) => a.result && b.result));
};
exports.higherHighsHigherLows = higherHighsHigherLows;
const growingRate = (data) => (0, function_1.pipe)(data, fp_ts_1.nonEmptyArray.fromArray, fp_ts_1.option.map((lows) => (0, function_1.pipe)(fp_ts_1.nonEmptyArray.tail(lows), fp_ts_1.array.reduce({ last: fp_ts_1.nonEmptyArray.head(lows), num: 0 }, (acc, cur) => ({
    last: cur,
    num: cur > acc.last ? acc.num + 1 : acc.num,
})), (acc) => acc.num / lows.length)));
const higherHighsHigherLowsRatio = (highlows) => {
    const lows = (0, function_1.pipe)(highlows, fp_ts_1.array.filter((highlow) => highlow.type === 'low'), fp_ts_1.array.map((low) => low.value));
    const highs = (0, function_1.pipe)(highlows, fp_ts_1.array.filter((highlow) => highlow.type === 'high'), fp_ts_1.array.map((high) => high.value));
    const higherLows = growingRate(lows);
    const higherHighs = growingRate(highs);
    return (0, function_1.pipe)((0, Apply_1.sequenceT)(fp_ts_1.option.option)(higherLows, higherHighs), fp_ts_1.option.map(([low, high]) => ({ low, high })));
};
exports.higherHighsHigherLowsRatio = higherHighsHigherLowsRatio;
const higherHighsHigherLowsThreshold = (threshold) => (highlows) => (0, function_1.pipe)((0, exports.higherHighsHigherLowsRatio)(highlows), fp_ts_1.option.map((ratio) => ratio.high > threshold.high && ratio.low > threshold.low));
exports.higherHighsHigherLowsThreshold = higherHighsHigherLowsThreshold;
