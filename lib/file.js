import fs from "fs";
import { friendlySyntaxToApiSyntax } from "@openfga/syntax-transformer";

export function readFile(path) {
  try {
    return fs.readFileSync(path).toString();
  } catch {
    return;
  }
}

export function readConfig(path) {
  const data = readFile(path);
  if (!data) {
    return;
  }

  return JSON.parse(data);
}

export function readModel(path) {
  const data = readFile(path);
  if (!data) {
    return;
  }

  return friendlySyntaxToApiSyntax(data);
}

export function readState(path) {
  const data = readFile(path);
  if (!data) {
    return;
  }

  const state = JSON.parse(data);
  state.tuples = state.tuples || [];
  state.assertions = state.assertions || [];
  return state;
}
