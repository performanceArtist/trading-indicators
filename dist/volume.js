"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.volumeToMax = exports.volumeToSimpleAverage = exports.volumeLevels = void 0;
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const N = __importStar(require("fp-ts/number"));
const Ord_1 = require("fp-ts/Ord");
const volumeCandleOrd = (0, function_1.pipe)(N.Ord, (0, Ord_1.contramap)((c) => c.price));
const volumeLevels = (step) => (candles) => (0, function_1.pipe)(candles, fp_ts_1.array.sort(volumeCandleOrd), fp_ts_1.array.reduce({}, (acc, { price, volume }) => (Object.assign(Object.assign({}, acc), { [roundTo(price, step)]: acc[roundTo(price, step)] || 0 + volume }))), fp_ts_1.record.toArray, fp_ts_1.array.map(([price, volume]) => ({ price: parseFloat(price), volume })));
exports.volumeLevels = volumeLevels;
const roundTo = (n, step) => Math.round(n / step) * step;
const volumeToSimpleAverage = (candles) => (0, function_1.pipe)(candles.reduce((acc, cur) => acc + cur.volume, 0) / candles.length, (averageVolume) => candles.map((c) => (Object.assign(Object.assign({}, c), { weight: c.volume / averageVolume }))));
exports.volumeToSimpleAverage = volumeToSimpleAverage;
const volumeToMax = (candles) => (0, function_1.pipe)(Math.max(...candles.map((c) => c.volume)), (maxVolume) => candles.map((c) => (Object.assign(Object.assign({}, c), { weight: c.volume / maxVolume }))));
exports.volumeToMax = volumeToMax;
