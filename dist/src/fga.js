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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FGA = void 0;
const sdk_1 = require("@openfga/sdk");
class FGAClient {
    get storeId() {
        return this._fga.storeId;
    }
    get storeName() {
        return this._storeName;
    }
    configure(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId, storeName } = options, rest = __rest(options, ["storeId", "storeName"]);
            this._fga = new sdk_1.OpenFgaApi(rest);
            if (storeName) {
                yield this.setStoreByName(storeName);
            }
            if (storeId) {
                yield this.setStoreById(storeId);
            }
        });
    }
    getStoreByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const stores = yield this.listAllStores();
            return stores.find(s => s.name === name);
        });
    }
    getStoreById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const stores = yield this.listAllStores();
            return stores.find(s => s.id === id);
        });
    }
    // stores
    setStoreByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const stores = yield this.listAllStores();
            const store = stores.find(s => s.name === name);
            if (!store) {
                console.error(`No store found for name '${name}'`);
                return;
            }
            this._fga.storeId = store.id || '';
            this._storeName = store.name;
        });
    }
    setStoreById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const stores = yield this.listAllStores();
            const store = stores.find(s => s.id === id);
            if (!store) {
                console.error(`No store found for id '${id}'`);
                return;
            }
            this._fga.storeId = store.id || '';
            this._storeName = store.name;
        });
    }
    createStore(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name || name.length < 3 || name.length > 64) {
                throw new Error('Store name must be between 3-64 characters');
            }
            // check if store exists
            const existingStore = yield this.getStoreByName(name);
            if (existingStore) {
                throw new Error(`Store already exists with the name ${name}`);
            }
            return yield this._fga.createStore({ name });
        });
    }
    storeExistsByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const stores = yield this.listAllStores();
            return stores.find(s => s.name === name);
        });
    }
    deleteStoreByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameResp = yield this.getStoreByName(name);
            if (!nameResp) {
                throw new Error(`No store found for name '${name}'`);
            }
            const id = nameResp.id;
            const oldId = this._fga.storeId;
            this._fga.storeId = id;
            yield this._fga.deleteStore();
            if (oldId !== id) {
                this._fga.storeId = oldId;
            }
        });
    }
    deleteStoreById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const idResp = yield this.getStoreById(id);
            if (!idResp) {
                throw new Error(`No store found for id '${id}'`);
            }
            const oldId = this._fga.storeId;
            this._fga.storeId = id;
            yield this._fga.deleteStore();
            if (oldId !== id) {
                this._fga.storeId = oldId;
            }
        });
    }
    deleteAllStores() {
        return __awaiter(this, void 0, void 0, function* () {
            const stores = yield this.listAllStores();
            for (const s of stores) {
                yield this.deleteStoreById(s.id);
            }
            return stores;
        });
    }
    listAllStores() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAllStores();
        });
    }
    getAllStores(acc = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.getPagedStores();
            acc = acc.concat(resp.stores || []);
            if (resp.continuation_token) {
                yield this.getAllStores(acc);
            }
            return acc;
        });
    }
    getPagedStores(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._fga.listStores(undefined, token);
        });
    }
    createModel(definition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._fga.writeAuthorizationModel(definition);
        });
    }
    listModels() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAllModels();
        });
    }
    getAllModels(acc = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.getPagedModels();
            acc = acc.concat(resp.authorization_models || []);
            if (resp.continuation_token) {
                yield this.getAllModels(acc);
            }
            return acc;
        });
    }
    getPagedModels(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._fga.readAuthorizationModels(undefined, token);
        });
    }
    writeTuples(writes = [], deletes = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {};
            if (writes.length !== 0) {
                body.writes = { tuple_keys: writes };
            }
            if (deletes.length !== 0) {
                body.deletes = { tuple_keys: deletes };
            }
            yield this._fga.write(body);
        });
    }
    addTuple(user, relation, object) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.writeTuples([{ user, relation, object }]);
        });
    }
    deleteTuple(user, relation, object) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.writeTuples(undefined, [{ user, relation, object }]);
        });
    }
    check(user, relation, object, contextTuples) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                tuple_key: {
                    user,
                    relation,
                    object
                }
            };
            if (contextTuples) {
                body.contextual_tuples = { tuple_keys: contextTuples };
            }
            const resp = yield this._fga.check(body);
            return resp.allowed;
        });
    }
    query(tuple, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._fga.read({
                tuple_key: tuple,
                page_size: opts === null || opts === void 0 ? void 0 : opts.pageSize,
                continuation_token: opts === null || opts === void 0 ? void 0 : opts.token
            });
        });
    }
}
exports.FGA = new FGAClient();
