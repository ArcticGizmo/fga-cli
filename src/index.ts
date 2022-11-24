import { TupleKey } from '@openfga/sdk';
import { Command } from 'commander';
import { argv } from 'process';
import { checkTuple } from './check';
import { createConfig, readJson } from './configuration';
import { FGA } from './fga';
import { listModels, setModel } from './model';
import { startInstance, stopInstance } from './setup';
import { setState } from './state';
import { createStore, deleteStoreById, deleteStoreByName, listAllStores } from './store';
import { addTupleOrTuples, removeTupleOrTuples } from './tuples';

if (argv[2] === 'init-config') {
  createConfig();
  process.exit();
}

const CONFIG_FILE = './fga.config.json';

const config = readJson(CONFIG_FILE);

if (!config) {
  console.error(`Missing required config file '${CONFIG_FILE}'. Run 'fga-cli init-config' to generate one`);
  process.exit(1);
}

FGA.configure(config);

const cli = new Command();

cli
  .name('fga-cli')
  .description('Help manage OpenFGA development instances')
  .version('0.0.1')
  .command('repl')
  .description('Start the OpenFGA repl')
  .action(() => require('./fgaRepl'));

// setup
cli
  .command('start')
  .description('Start a local OpenFGA docker instance')
  .option('-h, --http [port]', 'http port', '8080')
  .option('-g, --grpc [port]', 'grpc port', '8081')
  .option('-p, --playground [port]', 'playground port', '3000')
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
  .option('-s, --store <store>')
  .option('-m, --model <model>', 'Path to model file')
  .action(setModel);

model.command('list').option('-s, --store <store>').action(listModels);

// ==== Tuples ====
const tuples = cli.command('tuples');

tuples
  .command('add')
  .alias('create')
  .argument('<store>', 'Name of store')
  .option('-u, --user <user>')
  .option('-r, --relation <relation>')
  .option('-o, --object <object>')
  .option('-f, --file <file>')
  .action(addTupleOrTuples);

tuples
  .command('remove')
  .alias('delete')
  .argument('<store>', 'Name of store')
  .option('-u, --user <user>')
  .option('-r, --relation <relation>')
  .option('-o, --object <object>')
  .option('-f, --file <file>')
  .action(removeTupleOrTuples);

// ==== Assertions ===

const collectTuples = (value: string, acc: TupleKey[] = []) => {
  const [user, relation, object] = value.split(' ');
  if (!user || !relation || !object) {
    throw `Contextual tuple incomplete. Expected '{user} {relation} {object}'. Got '${user} ${relation} ${object}'`;
  }
  acc.push({ user, relation, object });
  return acc;
};

// ==== check ====
cli
  .command('check')
  .argument('<user>')
  .argument('<relation>')
  .argument('<object>')
  .option('-s, --store <store>')
  .option(
    '-c, --context <tuple>',
    'Contextual tuples (can be repeated). Please use quotes "user relation object"',
    collectTuples
  )
  .action(checkTuple);

// ==== query ====
const query = cli.command('query');

// ==== state ====
cli
  .command('state')
  .command('set')
  .description('Completely override given store based on provided state file')
  .argument('<state>', 'Path to state file')
  .option('--recreate', 'Destroy existing store if required')
  .action(setState);

cli.parse();
