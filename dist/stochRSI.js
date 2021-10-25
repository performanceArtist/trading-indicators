"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmoothStochRSI = exports.getStochRSI = exports.getStochRSIAcc = exports.nextStochRSI = exports.calculateStochRSI = void 0;
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const movingAverage_1 = require("./movingAverage");
const RSI_1 = require("./RSI");
const mapInterval_1 = require("./utils/mapInterval");
// https://www.investopedia.com/terms/s/stochrsi.asp
const calculateStochRSI = (RSIs) => (100 * (fp_ts_1.nonEmptyArray.last(RSIs) - Math.min(...RSIs))) /
    (Math.max(...RSIs) - Math.min(...RSIs));
exports.calculateStochRSI = calculateStochRSI;
exports.nextStochRSI = (0, mapInterval_1.withNextQueue)(exports.calculateStochRSI);
const getStochRSIAcc = (period) => (prices) => (0, function_1.pipe)((0, RSI_1.getRSI)(period)(prices), fp_ts_1.option.chain((0, mapInterval_1.mapInterval)(exports.calculateStochRSI, exports.nextStochRSI)(period)));
exports.getStochRSIAcc = getStochRSIAcc;
const getStochRSI = (period) => (prices) => (0, function_1.pipe)((0, exports.getStochRSIAcc)(period)(prices), fp_ts_1.option.map((acc) => acc.results));
exports.getStochRSI = getStochRSI;
const getSmoothStochRSI = (period) => (prices) => (0, function_1.pipe)((0, exports.getStochRSI)(period)(prices), fp_ts_1.option.chain((0, movingAverage_1.exponentialMA)(3)));
exports.getSmoothStochRSI = getSmoothStochRSI;
