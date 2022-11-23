"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const configuration_1 = require("./configuration");
const fga_1 = require("./fga");
const model_1 = require("./model");
const setup_1 = require("./setup");
const store_1 = require("./store");
const tuples_1 = require("./tuples");
const CONFIG_FILE = './fga.config.json';
const config = (0, configuration_1.readJson)(CONFIG_FILE);
if (!config) {
    console.error(`Missing required config file '${CONFIG_FILE}'. Please create one`);
    process.exit(1);
}
fga_1.FGA.configure(config);
const cli = new commander_1.Command();
cli
    .name('fga-cli')
    .description('Help manage OpenFGA development instances')
    .version('0.0.1')
    .action(() => require('./fgaRepl'));
// setup
cli.command('start').description('Start a local OpenFGA docker instance').action(setup_1.startInstance);
cli.command('stop').description('Stop local OpenFGA docker instance').action(setup_1.stopInstance);
// ==== store ====
const store = cli.command('store');
store.command('create').argument('<store name>').action(store_1.createStore);
store.command('delete').argument('<store name>').action(store_1.deleteStoreByName);
store.command('delete-id').argument('<store id>').action(store_1.deleteStoreById);
store.command('list').action(store_1.listAllStores);
// ==== Model ====
const model = cli.command('model');
model
    .command('create')
    .alias('add')
    .argument('<store>', 'Name of store')
    .argument('<model>', 'Path to model file')
    .action(model_1.setModel);
model.command('list').argument('<store>', 'Name of store').action(model_1.listModels);
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
    .action(tuples_1.addTupleOrTuples);
tuples
    .command('remove')
    .alias('delete')
    .argument('<store>', 'Name of store')
    .argument('[user]')
    .argument('[relation]')
    .argument('[object]')
    .option('-f, --file <file>')
    .action(tuples_1.removeTupleOrTuples);
// ==== Assertions ===
// ==== check ====
// ==== query ====
// ==== All-in-one ====
// tuples.
cli.parse();
