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
exports.deleteAllStores = exports.deleteStoreById = exports.deleteStoreByName = exports.createStore = exports.listAllStores = void 0;
const fga_1 = require("./fga");
function listAllStores() {
    return __awaiter(this, void 0, void 0, function* () {
        const stores = yield fga_1.FGA.listAllStores();
        console.log(stores);
    });
}
exports.listAllStores = listAllStores;
function createStore(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fga_1.FGA.createStore(name);
        console.log(resp);
    });
}
exports.createStore = createStore;
function deleteStoreByName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fga_1.FGA.deleteStoreByName(name);
        console.log('Store deleted');
    });
}
exports.deleteStoreByName = deleteStoreByName;
function deleteStoreById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fga_1.FGA.deleteStoreById(id);
        console.log('Store deleted');
    });
}
exports.deleteStoreById = deleteStoreById;
function deleteAllStores() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fga_1.FGA.deleteAllStores();
    });
}
exports.deleteAllStores = deleteAllStores;
