import { TupleKey } from '@openfga/sdk';
import { Command } from 'commander';
import { checkTuple } from './check';
import { readJson } from './configuration';
import { FGA } from './fga';
import { createAll, createModel, createState, createTuples, createConfig } from './init';
import { listModels, setModel } from './model';
import { queryTuples } from './query';
import { startInstance, stopInstance } from './setup';
import { setState } from './state';
import { createStore, deleteStoreById, deleteStoreByName, listAllStores } from './store';
import { addTupleOrTuples, removeTupleOrTuples } from './tuples';

const CONFIG_FILE = './fga.config.json';

if (process.argv[2] !== 'init') {
  const config = readJson(CONFIG_FILE);
  FGA.configure(config);
}

const cli = new Command();

cli
  .name('fga-cli')
  .description('Help manage OpenFGA development instances')
  .version('0.0.1')
  .command('repl')
  .description('Start the OpenFGA repl')
  .action(() => require('./fgaRepl'));

// init
const init = cli.command('init');

init
  .command('config')
  .option('--api-schema <scheme>', 'http/https', 'http')
  .option('--api-host <host>', undefined, 'localhost:8080')
  .action(createConfig);

init.command('model').action(createModel);

init.command('tuples').action(createTuples);

init.command('state').action(createState);

init
  .command('all')
  .option('--api-schema <schema>', 'http/https', 'http')
  .option('--api-host <host>', undefined, 'localhost:8080')
  .action(createAll);

// setup
cli
  .command('start')
  .description('Start a local OpenFGA docker instance')
  .option('-h, --http [port]', 'http port', '8080')
  .option('-g, --grpc [port]', 'grpc port', '8081')
  .option('-p, --playground [port]', 'playground port', '3000')
  .option('-d, --detach', 'Run the docker instance in the background')
  .action(startInstance);

cli.command('stop').description('Stop local OpenFGA docker instance').action(stopInstance);

// ==== store ====
const store = cli.command('store');

store.command('create').argument('<store name>').action(createStore);

store.command('delete').argument('<store name>').action(deleteStoreByName);

store.command('delete-id').argument('<store id>').action(deleteStoreById);

store.command('list').action(listAllStores);

// ==== Model ====
const model = cli.command('model');

model
  .command('create')
  .alias('add')
  .requiredOption('-s, --store <store>')
  .requiredOption('-m, --model <model>', 'Path to model file')
  .action(setModel);

model.command('list').requiredOption('-s, --store <store>').action(listModels);

// ==== Tuples ====
const tuples = cli.command('tuples');

tuples
  .command('add')
  .alias('create')
  .requiredOption('-s, --store <store>')
  .option('-u, --user <user>')
  .option('-r, --relation <relation>')
  .option('-o, --object <object>')
  .option('-f, --file <file>')
  .action(addTupleOrTuples);

tuples
  .command('remove')
  .alias('delete')
  .requiredOption('-s, --store <store>')
  .option('-u, --user <user>')
  .option('-r, --relation <relation>')
  .option('-o, --object <object>')
  .option('-f, --file <file>')
  .action(removeTupleOrTuples);

// ==== Assertions ===
// TODO: add assertions

// ==== check ====
const collectTuples = (value: string, acc: TupleKey[] = []) => {
  const [user, relation, object] = value.split(' ');
  if (!user || !relation || !object) {
    throw `Contextual tuple incomplete. Expected '{user} {relation} {object}'. Got '${user} ${relation} ${object}'`;
  }
  acc.push({ user, relation, object });
  return acc;
};

cli
  .command('check')
  .argument('<user>')
  .argument('<relation>')
  .argument('<object>')
  .requiredOption('-s, --store <store>')
  .option(
    '-c, --context <tuple>',
    'Contextual tuples (can be repeated). Please use quotes "user relation object"',
    collectTuples
  )
  .action(checkTuple);

// ==== query ====
cli
  .command('query')
  .requiredOption('-s, --store <store>')
  .requiredOption('-o, --object <object>')
  .option('-u, --user <user>')
  .option('-r, --relation <relation>')
  .option('-p, --page-size <count>', 'Max entries per response', '50')
  .option('-t, --token', 'continuation token')
  .action(queryTuples);

// ==== state ====
cli
  .command('state')
  .command('set')
  .description('Completely override given store based on provided state file')
  .argument('<state>', 'Path to state file')
  .option('--recreate', 'Destroy existing store if required')
  .action(setState);

cli.parse();
