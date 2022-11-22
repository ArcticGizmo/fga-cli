import { readConfig, readModel, readState } from "./file.js";

export function loadConfig(optionalPath) {
  if (optionalPath) {
    return readConfig(optionalPath);
  }

  return readConfig("./fga.config.json");
}

export function loadModel(optionalPath) {
  if (optionalPath) {
    return readModel(optionalPath);
  }

  return readModel("./fga.model.dsl");
}

export function loadState(optionalPath) {
  if (optionalPath) {
    return readState(optionalPath);
  }

  return readState("./fga.state.json");
}
