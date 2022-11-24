import { TupleKey } from '@openfga/sdk';
import { FGA } from './fga';

interface CheckOptions {
  store: string;
  context?: TupleKey[];
}

export async function checkTuple(user: string, relation: string, object: string, opts: CheckOptions, a: any) {
  await FGA.setStoreByName(opts.store);
  const bool = await FGA.check(user, relation, object, opts.context);
  console.log(bool);
}
