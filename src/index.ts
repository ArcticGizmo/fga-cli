import { Command } from 'commander';
import { argv } from 'process';
import { createConfig, readJson } from './configuration';
import { FGA } from './fga';
import { listModels, setModel } from './model';
import { startInstance, stopInstance } from './setup';
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
  .action(() => require('./fgaRepl'));

// setup
cli.command('start').description('Start a local OpenFGA docker instance').action(startInstance);

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
  .argument('<store>', 'Name of store')
  .argument('<model>', 'Path to model file')
  .action(setModel);

model.command('list').argument('<store>', 'Name of store').action(listModels);

// ==== Tuples ====
const tuples = cli.command('tuples');

tuples
  .command('add')
  .alias('create')
  .argument('<store>', 'Name of store')
  .argument('[user]')
  .argument('[relation]')
  .argument('[object]')
  .option('-f, --file <file>')
  .action(addTupleOrTuples);

tuples
  .command('remove')
  .alias('delete')
  .argument('<store>', 'Name of store')
  .argument('[user]')
  .argument('[relation]')
  .argument('[object]')
  .option('-f, --file <file>')
  .action(removeTupleOrTuples);

// ==== Assertions ===

// ==== check ====

// ==== query ====

// ==== All-in-one ====
// tuples.

cli.parse();
