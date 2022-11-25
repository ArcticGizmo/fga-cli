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
exports.removeTupleOrTuples = exports.addTuples = exports.addTupleOrTuples = void 0;
const configuration_1 = require("./configuration");
const fga_1 = require("./fga");
const helper_1 = require("./helper");
function addTupleOrTuples(flags) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fga_1.FGA.setStoreByName(flags.storeName);
        if (flags.file) {
            yield addTuplesFromFile(flags.file);
        }
        else {
            const { user, relation, object } = flags;
            if (!user || !relation || !object) {
                throw 'User, relation and object required!';
            }
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
        yield addTuples(data);
    });
}
function addTuples(tuples) {
    return __awaiter(this, void 0, void 0, function* () {
        // insert in steps
        const chunks = (0, helper_1.chunkEvery)(tuples, 5);
        for (const chunk of chunks) {
            yield fga_1.FGA.writeTuples(chunk);
            chunk.forEach(c => {
                console.log(`Added - user: ${c.user} | relation: ${c.relation} | object: ${c.object}`);
            });
        }
    });
}
exports.addTuples = addTuples;
function removeTupleOrTuples(flags) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fga_1.FGA.setStoreByName(flags.storeName);
        if (flags.file) {
            yield removeTuplesFromFile(flags.file);
        }
        else {
            const { user, relation, object } = flags;
            if (!user || !relation || !object) {
                throw 'User, relation and object required!';
            }
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
        const chunks = (0, helper_1.chunkEvery)(data, 5);
        for (const chunk of chunks) {
            yield fga_1.FGA.writeTuples(undefined, chunk);
            chunk.forEach(c => {
                console.log(`Removed - user: ${c.user} | relation: ${c.relation} | object: ${c.object}`);
            });
        }
    });
}
