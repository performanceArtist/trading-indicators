"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTrend = exports.buildTrendAcc = void 0;
const fp_ts_1 = require("fp-ts");
const Apply_1 = require("fp-ts/lib/Apply");
const function_1 = require("fp-ts/lib/function");
const movingAverage_1 = require("./movingAverage");
const buildTrendAcc = ({ flatTolerancePercent, emaPeriod, splinePeriod }) => (candles) => (0, function_1.pipe)(candles, fp_ts_1.array.map((c) => (c.open + c.close + c.low + c.high) / 4), (0, movingAverage_1.exponentialMA)(emaPeriod), fp_ts_1.option.map(trendAcc(flatTolerancePercent, splinePeriod)));
exports.buildTrendAcc = buildTrendAcc;
const buildTrend = (options) => (candles) => (0, function_1.pipe)((0, exports.buildTrendAcc)(options)(candles), fp_ts_1.option.map((acc) => acc.curves));
exports.buildTrend = buildTrend;
const nextTrendAcc = (flatTolerancePercent, period) => (acc, cur) => acc.curSpline.length == period - 1
    ? {
        curves: (0, function_1.pipe)(makeCurve(flatTolerancePercent)(acc.curSpline.concat(cur)), fp_ts_1.option.fold(() => acc.curves, (c) => appendCurve(flatTolerancePercent)(acc.curves)(c))),
        curSpline: [],
    }
    : Object.assign(Object.assign({}, acc), { curSpline: acc.curSpline.concat(cur) });
const trendAcc = (flatTolerancePercent, period) => (values) => (0, function_1.pipe)(values, fp_ts_1.array.reduce({ curSpline: [], curves: [] }, nextTrendAcc(flatTolerancePercent, period)));
const appendCurve = (flatTolerancePercent) => (cs) => (current) => (0, function_1.pipe)((0, Apply_1.sequenceT)(fp_ts_1.option.option)(fp_ts_1.array.init(cs), fp_ts_1.array.last(cs)), fp_ts_1.option.fold(() => cs.concat(current), ([init, last]) => (0, function_1.pipe)(concatCurves(flatTolerancePercent)(last, current), fp_ts_1.option.fold(() => cs.concat(current), (newCurve) => init.concat(newCurve)))));
const concatCurves = (flatTolerancePercent) => (a, b) => a.type !== b.type
    ? fp_ts_1.option.none
    : (0, function_1.pipe)((0, Apply_1.sequenceT)(fp_ts_1.option.option)(fp_ts_1.array.head(a.data), fp_ts_1.array.last(b.data)), fp_ts_1.option.map(([first, last]) => ({
        type: a.type,
        data: a.data.concat(b.data),
    })));
const isFlat = (flatTolerancePercent) => (a, b) => getPercentChange(a, b) < flatTolerancePercent;
const getType = (flatTolerancePercent) => (first, last) => first > last ? 'falling' : 'rising';
/*
  isFlat(flatTolerancePercent)(first, last)
    ? "flat"
    :
    */
const makeCurve = (flatTolerancePercent) => (spline) => (0, function_1.pipe)((0, Apply_1.sequenceT)(fp_ts_1.option.option)(fp_ts_1.array.head(spline), fp_ts_1.array.last(spline)), fp_ts_1.option.map(([first, last]) => ({
    type: getType(flatTolerancePercent)(first, last),
    data: spline,
})));
const getPercentChange = (a, b) => a > b ? 100 * (a / b - 1) : 100 * (b / a - 1);
