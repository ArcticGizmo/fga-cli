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
exports.listModels = exports.setModel = void 0;
const fga_1 = require("./fga");
const syntax_transformer_1 = require("@openfga/syntax-transformer");
const configuration_1 = require("./configuration");
function setModel(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!opts.store || !opts.model) {
            console.error('store and model required');
            process.exit(1);
        }
        const model = (0, configuration_1.readModel)(opts.model);
        if (!model) {
            console.error(`No model found within '${opts.model}'`);
            process.exit(1);
        }
        yield fga_1.FGA.setStoreByName(opts.store);
        const resp = yield fga_1.FGA.createModel(model);
        console.log(`Model created - '${resp.authorization_model_id}'`);
    });
}
exports.setModel = setModel;
function listModels(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!opts.store) {
            console.error('-s, --store required');
            process.exit(1);
        }
        yield fga_1.FGA.setStoreByName(opts.store);
        const models = yield fga_1.FGA.listModels();
        if (models.length === 0) {
            console.log('No models found!');
            return;
        }
        models.forEach(m => {
            console.log(`====== ${m.id} ======`);
            console.log((0, syntax_transformer_1.apiSyntaxToFriendlySyntax)({ type_definitions: m.type_definitions }));
        });
    });
}
exports.listModels = listModels;
