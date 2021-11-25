"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInterval = exports.reduceInterval = exports.withNextQueue = void 0;
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const splitAtFixed_1 = require("./splitAtFixed");
const withNextQueue = (f) => ({ prevQueue, result }, cur) => {
    const newQueue = [...prevQueue];
    newQueue.shift();
    newQueue.push(cur);
    return {
        prevQueue: newQueue,
        result: f(result, newQueue),
    };
};
exports.withNextQueue = withNextQueue;
const reduceInterval = (f, g) => (period) => (arr) => (0, function_1.pipe)(arr, (0, splitAtFixed_1.splitAtFixed)(period), fp_ts_1.option.map((0, function_1.flow)(([init, rest]) => (0, function_1.pipe)(rest, fp_ts_1.array.reduce({ prevQueue: init, result: f(init) }, g)))));
exports.reduceInterval = reduceInterval;
const mapInterval = (f) => (0, exports.reduceInterval)((init) => fp_ts_1.nonEmptyArray.of(f(init)), (0, exports.withNextQueue)((acc, cur) => (0, function_1.pipe)(acc, fp_ts_1.array.append(f(cur)))));
exports.mapInterval = mapInterval;
