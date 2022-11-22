import { OpenFgaApi } from "@openfga/sdk";

class FGAClient {
  constructor() {
    this._fga = undefined;
  }

  async configure(options = {}) {
    this._fga = new OpenFgaApi(options);
  }

  setStore(storeId) {
    this._fga.storeId = storeId;
  }

  async getStoreByName(name) {
    const stores = await this.listAllStores();
    return stores.find((s) => s.name === name);
  }

  async getStoreById(id) {
    const stores = await this.listAllStores();
    return stores.find((s) => s.id === id);
  }

  async createStore(name) {
    if (!name || name.length < 3 || name.length > 64) {
      throw new Error("Store name must be between 3-64 characters");
    }
    // check if store exists
    const existingStore = await this.getStoreByName(name);

    if (existingStore) {
      throw new Error(`Store already exists with the name ${name}`);
    }

    return await this._fga.createStore({ name });
  }

  async deleteStoreByName(name) {
    const nameResp = await this.getStoreByName(name);

    if (!nameResp) {
      throw new Error(`No store found for name '${name}'`);
    }

    id = nameResp.id;

    const oldId = this._fga.storeId;

    this._fga.storeId = id;

    await this._fga.deleteStore();

    if (oldId !== id) {
      this._fga.storeId = oldId;
    }
  }

  async deleteStoreById(id) {
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
      await this.deleteStore({ id: s.id });
    }

    return stores;
  }

  async listAllStores() {
    return await this._getAllStores();
  }

  async _getAllStores(acc = []) {
    const resp = await this.getPagedStores();
    acc = acc.concat(resp.stores);
    if (resp.continuation_token) {
      return await this._getAllStores(acc);
    }

    return acc;
  }

  async getPagedStores(token) {
    return await this._fga.listStores(undefined, token);
  }

  async createModel(definition) {}
}

export const FGA = new FGAClient();
