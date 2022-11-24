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
exports.setState = void 0;
const configuration_1 = require("./configuration");
const fga_1 = require("./fga");
const helper_1 = require("./helper");
const tuples_1 = require("./tuples");
function setState(stateFilePath, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, configuration_1.readJson)(stateFilePath);
        if (!data) {
            console.error('State file either does not exist, or is empty');
        }
        const storeName = data.name;
        const model = data.authorization_model;
        const tuples = data.tuples || [];
        // const asserts = data.assertions || [];
        // check store does not exist, unless --force is provided
        if (!storeName) {
            (0, helper_1.terminate)('Store name required');
        }
        let doesStoreExist = yield fga_1.FGA.storeExistsByName(storeName);
        if (!doesStoreExist) {
            console.log(`- Creating store '${storeName}'`);
            yield fga_1.FGA.createStore(storeName);
        }
        if (opts.recreate) {
            console.log('- deleting old store');
            yield fga_1.FGA.deleteStoreByName(storeName);
            yield (0, helper_1.delay)(2500);
        }
        doesStoreExist = yield fga_1.FGA.storeExistsByName(storeName);
        yield fga_1.FGA.setStoreByName(storeName);
        if (model) {
            console.log('- Setting model');
            yield fga_1.FGA.createModel(model);
        }
        if (tuples.length) {
            console.log('- setting tuples');
            yield (0, tuples_1.addTuples)(tuples);
        }
    });
}
exports.setState = setState;
