import { loadModel } from "./configuration.js";
import { FGA } from "./fga.js";
import { apiSyntaxToFriendlySyntax } from "@openfga/syntax-transformer";

export async function initModel(storeName, path) {
  const model = loadModel(path);
  await FGA.setStoreFromName(storeName);
  const resp = await FGA.createModel(model);
  console.log(`Model created - '${resp.authorization_model_id}'`);
}

export async function listModels(storeName) {
  await FGA.setStoreFromName(storeName);
  const models = await FGA.listModels();
  models.forEach((m) => {
    console.log(`====== ${m.id} ======`);
    console.log(
      apiSyntaxToFriendlySyntax({ type_definitions: m.type_definitions })
    );
  });
}
