import * as fs from 'fs';
import { friendlySyntaxToApiSyntax } from '@openfga/syntax-transformer';

export function readFile(path: string) {
  try {
    return fs.readFileSync(path).toString();
  } catch {
    return;
  }
}

export function readJson<T = any>(path: string) {
  const data = readFile(path);
  if (!data) {
    return;
  }

  return JSON.parse(data) as T;
}

export function readModel(path: string) {
  const data = readFile(path);
  if (!data) {
    return;
  }

  return friendlySyntaxToApiSyntax(data);
}
