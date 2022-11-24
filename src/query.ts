import { FGA } from './fga';

interface QueryOpts {
  store: string;
  user?: string;
  relation?: string;
  object: string;
  pageSize?: number;
  token?: string;
}

export async function queryTuples(opts: QueryOpts) {
  const { store, user, relation, object, ...rest } = opts;
  await FGA.setStoreByName(store);
  const resp = await FGA.query({ user, relation, object }, rest);
  console.log(JSON.stringify(resp, null, 2));
}
