"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.terminate = exports.chunkEvery = void 0;
function chunkEvery(arr, count, step, leftover) {
    if (!arr.length) {
        return [];
    }
    step = step || count;
    const retArr = [];
    for (let i = 0; i < arr.length; i += step) {
        retArr.push(arr.slice(i, i + count));
    }
    const lastIndex = retArr.length - 1;
    if (leftover === 'discard' && retArr[lastIndex].length < count) {
        return retArr.slice(0, lastIndex);
    }
    if (Array.isArray(leftover) && (leftover === null || leftover === void 0 ? void 0 : leftover.length)) {
        retArr[lastIndex] = retArr[lastIndex].concat(leftover).slice(0, count);
    }
    return retArr;
}
exports.chunkEvery = chunkEvery;
function terminate(msg, reason = 1) {
    console.error(msg);
    process.exit(reason);
}
exports.terminate = terminate;
function delay(duration) {
    return new Promise(r => setTimeout(r, duration));
}
exports.delay = delay;
