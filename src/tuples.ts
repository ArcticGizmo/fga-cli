import { TupleKey } from '@openfga/sdk';
import { readJson } from './configuration';
import { FGA } from './fga';
import { chunkEvery } from './helper';

interface OptionalFlags {
  storeName: string;
  file?: string;
  user?: string;
  relation?: string;
  object?: string;
}

export async function addTupleOrTuples(flags: OptionalFlags) {
  await FGA.setStoreByName(flags.storeName);

  if (flags.file) {
    await addTuplesFromFile(flags.file);
  } else {
    const { user, relation, object } = flags;

    if (!user || !relation || !object) {
      throw 'User, relation and object required!';
    }

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

  await addTuples(data as TupleKey[]);
}

export async function addTuples(tuples: TupleKey[]) {
  // insert in steps
  const chunks = chunkEvery(tuples, 5);

  for (const chunk of chunks) {
    await FGA.writeTuples(chunk);
    chunk.forEach(c => {
      console.log(`Added - user: ${c.user} | relation: ${c.relation} | object: ${c.object}`);
    });
  }
}

export async function removeTupleOrTuples(flags: OptionalFlags) {
  await FGA.setStoreByName(flags.storeName);

  if (flags.file) {
    await removeTuplesFromFile(flags.file);
  } else {
    const { user, relation, object } = flags;

    if (!user || !relation || !object) {
      throw 'User, relation and object required!';
    }
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
