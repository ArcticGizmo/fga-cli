import { loadModel } from "./configuration.js";

export async function initModel(path) {
  const model = loadModel(path);
  console.dir(model);
}
