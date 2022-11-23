"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTupleOrTuples = exports.addTupleOrTuples = void 0;
const configuration_1 = require("./configuration");
const fga_1 = require("./fga");
function addTupleOrTuples(storeName, user, relation, object, flags) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fga_1.FGA.setStoreByName(storeName);
        if (flags.file) {
            yield addTuplesFromFile(flags.file);
        }
        else {
            yield addTuple(user, relation, object);
        }
    });
}
exports.addTupleOrTuples = addTupleOrTuples;
function addTuple(user, relation, object) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fga_1.FGA.addTuple(user, relation, object);
        console.log(`Added - user: ${user} | relation: ${relation} | object: ${object}`);
    });
}
function addTuplesFromFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, configuration_1.readJson)(path);
        if (!data) {
            throw `No tuples found in file '${path}'`;
        }
        // insert in steps
        const chunks = chunkEvery(data, 5);
        for (const chunk of chunks) {
            yield fga_1.FGA.writeTuples(chunk);
            chunk.forEach(c => {
                console.log(`Added - user: ${c.user} | relation: ${c.relation} | object: ${c.object}`);
            });
        }
    });
}
function removeTupleOrTuples(storeName, user, relation, object, flags) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fga_1.FGA.setStoreByName(storeName);
        if (flags.file) {
            yield removeTuplesFromFile(flags.file);
        }
        else {
            yield removeTuple(user, relation, object);
        }
    });
}
exports.removeTupleOrTuples = removeTupleOrTuples;
function removeTuple(user, relation, object) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fga_1.FGA.deleteTuple(user, relation, object);
        console.log(`Removed - user: ${user} | relation: ${relation} | object: ${object}`);
    });
}
function removeTuplesFromFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, configuration_1.readJson)(path);
        if (!data) {
            throw `No tuples found in file '${path}'`;
        }
        // insert in steps
        const chunks = chunkEvery(data, 5);
        for (const chunk of chunks) {
            yield fga_1.FGA.writeTuples(undefined, chunk);
            chunk.forEach(c => {
                console.log(`Removed - user: ${c.user} | relation: ${c.relation} | object: ${c.object}`);
            });
        }
    });
}
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
