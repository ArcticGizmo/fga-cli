"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repl = require("repl");
const clear = () => {
    process.stdout.write('\u001B[2J\u001B[0;0f');
};
// before starting, check that there is a valid configuration file
const local = repl.start({ prompt: `fga:-no store-> ` });
const setPrompt = (name) => {
    local.setPrompt(`fga:${name || '-no store-> '}`);
};
local.context.setStore = (storeName) => {
    console.dir('--- set store');
    console.dir(storeName);
    setPrompt(storeName);
};
