"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStochRSI = exports.getStochRSIAcc = exports.calculateStochRSI = void 0;
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const RSI_1 = require("./RSI");
const mapInterval_1 = require("./utils/mapInterval");
// https://www.investopedia.com/terms/s/stochrsi.asp
const calculateStochRSI = (RSIs) => (100 * (fp_ts_1.nonEmptyArray.last(RSIs) - Math.min(...RSIs))) /
    (Math.max(...RSIs) - Math.min(...RSIs));
exports.calculateStochRSI = calculateStochRSI;
const getStochRSIAcc = (period) => (prices) => (0, function_1.pipe)((0, RSI_1.getRSI)(period)(prices), fp_ts_1.option.chain((0, mapInterval_1.mapInterval)(exports.calculateStochRSI)(period)));
exports.getStochRSIAcc = getStochRSIAcc;
const getStochRSI = (period) => (prices) => (0, function_1.pipe)((0, exports.getStochRSIAcc)(period)(prices), fp_ts_1.option.map((acc) => acc.result));
exports.getStochRSI = getStochRSI;
