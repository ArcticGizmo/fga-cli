import { TupleKey } from '@openfga/sdk';
import { readJson } from './configuration';
import { FGA } from './fga';

interface OptionalFlags {
  file?: string;
}

export async function addTupleOrTuples(
  storeName: string,
  user: string,
  relation: string,
  object: string,
  flags: OptionalFlags
) {
  await FGA.setStoreByName(storeName);

  if (flags.file) {
    await addTuplesFromFile(flags.file);
  } else {
    await addTuple(user, relation, object);
  }
}

async function addTuple(user: string, relation: string, object: string) {
  await FGA.addTuple(user, relation, object);
  console.log(`Added - user: ${user} | relation: ${relation} | object: ${object}`);
}

async function addTuplesFromFile(path: string) {
  const data = readJson(path);

  if (!data) {
    throw `No tuples found in file '${path}'`;
  }

  // insert in steps
  const chunks = chunkEvery(data as Array<TupleKey>, 5);

  for (const chunk of chunks) {
    await FGA.writeTuples(chunk);
    chunk.forEach(c => {
      console.log(`Added - user: ${c.user} | relation: ${c.relation} | object: ${c.object}`);
    });
  }
}

export async function removeTupleOrTuples(
  storeName: string,
  user: string,
  relation: string,
  object: string,
  flags: OptionalFlags
) {
  await FGA.setStoreByName(storeName);

  if (flags.file) {
    await removeTuplesFromFile(flags.file);
  } else {
    await removeTuple(user, relation, object);
  }
}

async function removeTuple(user: string, relation: string, object: string) {
  await FGA.deleteTuple(user, relation, object);
  console.log(`Removed - user: ${user} | relation: ${relation} | object: ${object}`);
}

async function removeTuplesFromFile(path: string) {
  const data = readJson(path);

  if (!data) {
    throw `No tuples found in file '${path}'`;
  }

  // insert in steps
  const chunks = chunkEvery(data as Array<TupleKey>, 5);

  for (const chunk of chunks) {
    await FGA.writeTuples(undefined, chunk);
    chunk.forEach(c => {
      console.log(`Removed - user: ${c.user} | relation: ${c.relation} | object: ${c.object}`);
    });
  }
}

function chunkEvery<T = any>(
  arr: T[],
  count: number,
  step?: number | undefined,
  leftover?: T[] | string
): Array<Array<T>> {
  if (!arr.length) {
    return [];
  }

  step = step || count;

  const retArr = [];
  for (let i = 0; i < arr.length; i += step) {
    retArr.push(arr.slice(i, i + count));
  }

  const lastIndex = retArr.length - 1;

  if (leftover === 'discard' && retArr[lastIndex].length < count) {
    return retArr.slice(0, lastIndex);
  }

  if (Array.isArray(leftover) && leftover?.length) {
    retArr[lastIndex] = retArr[lastIndex].concat(leftover).slice(0, count);
  }

  return retArr;
}
