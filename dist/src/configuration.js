"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readModel = exports.readJson = exports.readFile = void 0;
const fs = require("fs");
const syntax_transformer_1 = require("@openfga/syntax-transformer");
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
