import { FGA } from './fga';
import { apiSyntaxToFriendlySyntax } from '@openfga/syntax-transformer';
import { readModel } from './configuration';

export async function setModel(storeName: string, path: string) {
  const model = readModel(path);

  if (!model) {
    throw `No model found within '${path}'`;
  }

  await FGA.setStoreByName(storeName);
  const resp = await FGA.createModel(model);

  console.log(`Model created - '${resp.authorization_model_id}'`);
}

export async function listModels(storeName: string) {
  await FGA.setStoreByName(storeName);
  const models = await FGA.listModels();

  if (models.length === 0) {
    console.log('No models found!');
    return;
  }
  models.forEach(m => {
    console.log(`====== ${m.id} ======`);
    console.log(apiSyntaxToFriendlySyntax({ type_definitions: m.type_definitions }));
  });
}
