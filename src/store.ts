import { FGA } from './fga';

export async function listAllStores() {
  const stores = await FGA.listAllStores();
  console.log(stores);
}

export async function createStore(name: string) {
  const resp = await FGA.createStore(name);
  console.log(resp);
}

export async function deleteStoreByName(name: string) {
  await FGA.deleteStoreByName(name);
  console.log('Store deleted');
}

export async function deleteStoreById(id: string) {
  await FGA.deleteStoreById(id);
  console.log('Store deleted');
}

export async function deleteAllStores() {
  await FGA.deleteAllStores();
}
