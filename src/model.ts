import { FGA } from './fga';
import { apiSyntaxToFriendlySyntax } from '@openfga/syntax-transformer';
import { readModel } from './configuration';

export async function setModel(opts: { store: string; model: string }) {
  if (!opts.store || !opts.model) {
    console.error('store and model required');
    process.exit(1);
  }

  const model = readModel(opts.model);

  if (!model) {
    console.error(`No model found within '${opts.model}'`);
    process.exit(1);
  }

  await FGA.setStoreByName(opts.store);
  const resp = await FGA.createModel(model);

  console.log(`Model created - '${resp.authorization_model_id}'`);
}

export async function listModels(opts: { store: string }) {
  if (!opts.store) {
    console.error('-s, --store required');
    process.exit(1);
  }

  await FGA.setStoreByName(opts.store);
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
