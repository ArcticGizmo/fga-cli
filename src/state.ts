import { TupleKey } from '@openfga/sdk';
import { readJson } from './configuration';
import { FGA } from './fga';
import { delay, terminate } from './helper';
import { addTuples } from './tuples';

interface SetStateOptions {
  recreate?: boolean;
}

export async function setState(stateFilePath: string, opts: SetStateOptions) {
  const data = readJson(stateFilePath);
  if (!data) {
    console.error('State file either does not exist, or is empty');
  }

  const storeName = data.name;
  const model = data.authorization_model;
  const tuples: TupleKey[] = data.tuples || [];
  // const asserts = data.assertions || [];

  // check store does not exist, unless --force is provided

  if (!storeName) {
    terminate('Store name required');
  }

  let doesStoreExist = await FGA.storeExistsByName(storeName);

  if (!doesStoreExist) {
    console.log(`- Creating store '${storeName}'`);
    await FGA.createStore(storeName);
  }

  if (opts.recreate) {
    console.log('- deleting old store');
    await FGA.deleteStoreByName(storeName);
    await delay(2500);
  }

  doesStoreExist = await FGA.storeExistsByName(storeName);

  await FGA.setStoreByName(storeName);

  if (model) {
    console.log('- Setting model');
    await FGA.createModel(model);
  }

  if (tuples.length) {
    console.log('- setting tuples');
    await addTuples(tuples);
  }
}
