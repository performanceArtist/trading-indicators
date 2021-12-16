"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExponentialMA = exports.nextExponentialMA = exports.initExponentialMA = exports.getSimpleMA = exports.initSimpleMAAcc = void 0;
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const mapInterval_1 = require("./utils/mapInterval");
const splitAtFixed_1 = require("./utils/splitAtFixed");
// https://www.investopedia.com/terms/m/movingaverage.asp
const nextSimpleMA = (next) => next.reduce((acc, cur) => acc + cur, 0) / next.length;
exports.initSimpleMAAcc = (0, mapInterval_1.mapInterval)(nextSimpleMA);
const getSimpleMA = (period) => (0, function_1.flow)((0, exports.initSimpleMAAcc)(period), fp_ts_1.option.map((acc) => acc.result));
exports.getSimpleMA = getSimpleMA;
const initExponentialMA = (init) => fp_ts_1.nonEmptyArray.of(init.reduce((acc, cur) => acc + cur, 0) / init.length);
exports.initExponentialMA = initExponentialMA;
const nextExponentialMA = (period) => (acc, cur) => (0, function_1.pipe)(getSmoothFactor(period), (smoothFactor) => cur * smoothFactor + fp_ts_1.nonEmptyArray.last(acc) * (1 - smoothFactor), (next) => (0, function_1.pipe)(acc, fp_ts_1.array.append(next)));
exports.nextExponentialMA = nextExponentialMA;
const getSmoothFactor = (period) => 2 / (period + 1);
const getExponentialMA = (period) => (prices) => (0, function_1.pipe)((0, splitAtFixed_1.splitAtFixed)(period)(prices), fp_ts_1.option.map(([init, rest]) => (0, function_1.pipe)(rest, fp_ts_1.array.reduce((0, exports.initExponentialMA)(init), (0, exports.nextExponentialMA)(period)))));
exports.getExponentialMA = getExponentialMA;
