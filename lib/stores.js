import { FGA } from "./fga.js";

export async function listAllStores() {
  const stores = await FGA.listAllStores();
  console.log(stores);
}

export async function createStore(name) {
  const resp = await FGA.createStore(name);
  console.log(resp);
}

export async function deleteStoreByName(name) {
  await FGA.deleteStoreByName(name);
  console.log("Store deleted");
}

export async function deleteStoreById(id) {
  await FGA.deleteStoreById(id);
  console.log("Store deleted");
}

export async function deleteAllStores() {
  await FGA.deleteAllStores();
}
