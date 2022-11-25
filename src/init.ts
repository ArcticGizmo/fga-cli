import { friendlySyntaxToApiSyntax } from '@openfga/syntax-transformer';
import * as fs from 'fs';

interface Credential {
  method: 'api_token';
  config: {
    token: string;
  };
}

interface CreateOptions {
  apiScheme: string;
  apiHost: string;
  presharedKey?: string;
  credentials?: Credential;
}

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

export function createConfig(opts: CreateOptions) {
  const path = './fga.config.json';
  const { presharedKey, ...body } = opts;
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

export function createModel() {
  const path = './fga.model.dsl';
  fs.writeFileSync(path, DEFAULT_MODEL);
  console.log(`- Model created at '${path}'`);
}

export function createTuples() {
  const path = './fga.tuples.json';
  fs.writeFileSync(path, JSON.stringify(DEFAULT_TUPLES, null, 2));
  console.log(`- Tuples created at '${path}'`);
}

export function createState() {
  const path = './fga.state.json';
  const authModel = friendlySyntaxToApiSyntax(DEFAULT_MODEL);
  const state = {
    name: 'example-store',
    authorization_model: authModel,
    tuples: DEFAULT_TUPLES,
    assertions: []
  };
  fs.writeFileSync(path, JSON.stringify(state, null, 2));
  console.log(`- State created at '${path}'`);
}

export function createAll(opts: CreateOptions) {
  createConfig(opts);
  createModel();
  createTuples();
  createState();
}
