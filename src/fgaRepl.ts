import * as repl from 'repl';
import { FGA } from './fga';
import type { Context } from 'vm';
import { exit } from 'process';

const clear = () => {
  process.stdout.write('\u001B[2J\u001B[0;0f');
};

// before starting, check that there is a valid configuration file

const local = repl.start({ prompt: `fga:-no store-> ` });

const setPrompt = (name?: string) => {
  local.setPrompt(`fga:${name || '-no store-> '}`);
};

local.context.setStore = (storeName: string) => {
  console.dir('--- set store');
  console.dir(storeName);
  setPrompt(storeName);
};
