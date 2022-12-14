"use strict";
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
exports.createAll = exports.createState = exports.createTuples = exports.createModel = exports.createConfig = void 0;
const syntax_transformer_1 = require("@openfga/syntax-transformer");
const fs = require("fs");
const DEFAULT_MODEL = `
type user
type file
  relations
    define can_read as owner or viewer
    define can_edit as owner
    define can_delete as owner
    define owner as self
    define viewer as self`.trimStart();
const DEFAULT_TUPLES = [
    { user: 'user:anne', relation: 'owner', object: 'file:0001' },
    { user: 'user:beth', relation: 'owner', object: 'file:0002' },
    { user: 'user:beth', relation: 'viewer', object: 'file:0001' }
];
function createConfig(opts) {
    const path = './fga.config.json';
    const { presharedKey } = opts, body = __rest(opts, ["presharedKey"]);
    if (presharedKey) {
        body.credentials = {
            method: 'api_token',
            config: {
                token: presharedKey
            }
        };
    }
    fs.writeFileSync(path, JSON.stringify(body, null, 2));
    console.log(`- Config created at '${path}'`);
}
exports.createConfig = createConfig;
function createModel() {
    const path = './fga.model.dsl';
    fs.writeFileSync(path, DEFAULT_MODEL);
    console.log(`- Model created at '${path}'`);
}
exports.createModel = createModel;
function createTuples() {
    const path = './fga.tuples.json';
    fs.writeFileSync(path, JSON.stringify(DEFAULT_TUPLES, null, 2));
    console.log(`- Tuples created at '${path}'`);
}
exports.createTuples = createTuples;
function createState() {
    const path = './fga.state.json';
    const authModel = (0, syntax_transformer_1.friendlySyntaxToApiSyntax)(DEFAULT_MODEL);
    const state = {
        name: 'example-store',
        authorization_model: authModel,
        tuples: DEFAULT_TUPLES,
        assertions: []
    };
    fs.writeFileSync(path, JSON.stringify(state, null, 2));
    console.log(`- State created at '${path}'`);
}
exports.createState = createState;
function createAll(opts) {
    createConfig(opts);
    createModel();
    createTuples();
    createState();
}
exports.createAll = createAll;
