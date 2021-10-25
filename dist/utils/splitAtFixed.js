"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitAtFixed = void 0;
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const splitAtFixed = (period) => (arr) => (0, function_1.pipe)(arr, fp_ts_1.option.fromPredicate((arr) => arr.length >= period), fp_ts_1.option.chain((0, function_1.flow)(fp_ts_1.array.splitAt(period), ([init, rest]) => (0, function_1.pipe)(init, fp_ts_1.nonEmptyArray.fromArray, fp_ts_1.option.map((init) => [init, rest])))));
exports.splitAtFixed = splitAtFixed;
