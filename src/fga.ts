import {
  AuthorizationModel,
  CheckRequest,
  OpenFgaApi,
  TupleKey,
  UserConfigurationParams,
  WriteAuthorizationModelRequest,
  WriteRequest
} from '@openfga/sdk';
import type { Store } from '@openfga/sdk';

interface ConfigurationOptions extends UserConfigurationParams {
  storeName?: string;
}

class FGAClient {
  private _fga!: OpenFgaApi;
  private _storeName?: string;

  get storeId() {
    return this._fga.storeId;
  }

  get storeName() {
    return this._storeName;
  }

  async configure(options: ConfigurationOptions) {
    const { storeId, storeName, ...rest } = options;

    this._fga = new OpenFgaApi(rest);

    if (storeName) {
      await this.setStoreByName(storeName);
    }

    if (storeId) {
      await this.setStoreById(storeId);
    }
  }

  async getStoreByName(name: string) {
    const stores = await this.listAllStores();
    return stores.find(s => s.name === name);
  }

  async getStoreById(id: string) {
    const stores = await this.listAllStores();
    return stores.find(s => s.id === id);
  }

  // stores
  async setStoreByName(name: string) {
    const stores = await this.listAllStores();
    const store = stores.find(s => s.name === name);

    if (!store) {
      console.error(`No store found for name '${name}'`);
      return;
    }

    this._fga.storeId = store.id || '';
    this._storeName = store.name;
  }

  async setStoreById(id: string) {
    const stores = await this.listAllStores();
    const store = stores.find(s => s.id === id);

    if (!store) {
      console.error(`No store found for id '${id}'`);
      return;
    }

    this._fga.storeId = store.id || '';
    this._storeName = store.name;
  }

  async createStore(name: string) {
    if (!name || name.length < 3 || name.length > 64) {
      throw new Error('Store name must be between 3-64 characters');
    }
    // check if store exists
    const existingStore = await this.getStoreByName(name);

    if (existingStore) {
      throw new Error(`Store already exists with the name ${name}`);
    }

    return await this._fga.createStore({ name });
  }

  async storeExistsByName(name: string) {
    const stores = await this.listAllStores();
    return stores.find(s => s.name === name);
  }

  async deleteStoreByName(name: string) {
    const nameResp = await this.getStoreByName(name);

    if (!nameResp) {
      throw new Error(`No store found for name '${name}'`);
    }

    const id = nameResp.id as string;

    const oldId = this._fga.storeId;

    this._fga.storeId = id;

    await this._fga.deleteStore();

    if (oldId !== id) {
      this._fga.storeId = oldId;
    }
  }

  async deleteStoreById(id: string) {
    const idResp = await this.getStoreById(id);

    if (!idResp) {
      throw new Error(`No store found for id '${id}'`);
    }

    const oldId = this._fga.storeId;

    this._fga.storeId = id;

    await this._fga.deleteStore();

    if (oldId !== id) {
      this._fga.storeId = oldId;
    }
  }

  async deleteAllStores() {
    const stores = await this.listAllStores();

    for (const s of stores) {
      await this.deleteStoreById(s.id as string);
    }

    return stores;
  }

  async listAllStores() {
    return await this.getAllStores();
  }

  private async getAllStores(acc: Array<Store> = []): Promise<Array<Store>> {
    const resp = await this.getPagedStores();
    acc = acc.concat(resp.stores || []);
    if (resp.continuation_token) {
      await this.getAllStores(acc);
    }

    return acc;
  }

  async getPagedStores(token?: string) {
    return await this._fga.listStores(undefined, token);
  }

  async createModel(definition: WriteAuthorizationModelRequest) {
    return await this._fga.writeAuthorizationModel(definition);
  }

  async listModels() {
    return await this.getAllModels();
  }

  private async getAllModels(acc: Array<AuthorizationModel> = []) {
    const resp = await this.getPagedModels();
    acc = acc.concat(resp.authorization_models || []);
    if (resp.continuation_token) {
      await this.getAllModels(acc);
    }

    return acc;
  }

  async getPagedModels(token?: string) {
    return await this._fga.readAuthorizationModels(undefined, token);
  }

  async writeTuples(writes: Array<TupleKey> = [], deletes: Array<TupleKey> = []) {
    const body: WriteRequest = {};

    if (writes.length !== 0) {
      body.writes = { tuple_keys: writes };
    }

    if (deletes.length !== 0) {
      body.deletes = { tuple_keys: deletes };
    }

    await this._fga.write(body);
  }

  async addTuple(user: string, relation: string, object: string) {
    return await this.writeTuples([{ user, relation, object }]);
  }

  async deleteTuple(user: string, relation: string, object: string) {
    return await this.writeTuples(undefined, [{ user, relation, object }]);
  }

  async check(user: string, relation: string, object: string, contextTuples?: TupleKey[]) {
    const body: CheckRequest = {
      tuple_key: {
        user,
        relation,
        object
      }
    };

    if (contextTuples) {
      body.contextual_tuples = { tuple_keys: contextTuples };
    }

    const resp = await this._fga.check(body);
    return resp.allowed;
  }
}

export const FGA = new FGAClient();
