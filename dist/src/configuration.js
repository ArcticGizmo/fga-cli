"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readModel = exports.readJson = exports.readFile = exports.createConfig = void 0;
const fs = require("fs");
const syntax_transformer_1 = require("@openfga/syntax-transformer");
const DEFAULT_CONFIG_CONTENT = {
    apiScheme: 'http',
    apiHost: 'localhost:8080'
};
function createConfig() {
    fs.writeFileSync('./fga.config.json', JSON.stringify(DEFAULT_CONFIG_CONTENT, null, 2));
}
exports.createConfig = createConfig;
function readFile(path) {
    try {
        return fs.readFileSync(path).toString();
    }
    catch (_a) {
        return;
    }
}
exports.readFile = readFile;
function readJson(path) {
    const data = readFile(path);
    if (!data) {
        return;
    }
    return JSON.parse(data);
}
exports.readJson = readJson;
function readModel(path) {
    const data = readFile(path);
    if (!data) {
        return;
    }
    return (0, syntax_transformer_1.friendlySyntaxToApiSyntax)(data);
}
exports.readModel = readModel;
