"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInterval = exports.withNextQueue = void 0;
const fp_ts_1 = require("fp-ts");
const function_1 = require("fp-ts/lib/function");
const splitAtFixed_1 = require("./splitAtFixed");
const withNextQueue = (f) => ({ prevQueue, results }, cur) => {
    const newQueue = [...prevQueue];
    newQueue.shift();
    newQueue.push(cur);
    return {
        prevQueue: newQueue,
        results: (0, function_1.pipe)(results, fp_ts_1.array.append(f(newQueue))),
    };
};
exports.withNextQueue = withNextQueue;
const mapInterval = (f, g) => (period) => (arr) => (0, function_1.pipe)(arr, (0, splitAtFixed_1.splitAtFixed)(period), fp_ts_1.option.map((0, function_1.flow)(([init, rest]) => (0, function_1.pipe)(rest, fp_ts_1.array.reduce({ prevQueue: init, results: [f(init)] }, g)))));
exports.mapInterval = mapInterval;
