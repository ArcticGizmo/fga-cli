"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const process_1 = require("process");
const check_1 = require("./check");
const configuration_1 = require("./configuration");
const fga_1 = require("./fga");
const model_1 = require("./model");
const query_1 = require("./query");
const setup_1 = require("./setup");
const state_1 = require("./state");
const store_1 = require("./store");
const tuples_1 = require("./tuples");
if (process_1.argv[2] === 'init-config') {
    (0, configuration_1.createConfig)();
    process.exit();
}
const CONFIG_FILE = './fga.config.json';
const config = (0, configuration_1.readJson)(CONFIG_FILE);
if (!config) {
    console.error(`Missing required config file '${CONFIG_FILE}'. Run 'fga-cli init-config' to generate one`);
    process.exit(1);
}
fga_1.FGA.configure(config);
const cli = new commander_1.Command();
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
    .action(setup_1.startInstance);
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
    .option('-s, --store <store>')
    .option('-m, --model <model>', 'Path to model file')
    .action(model_1.setModel);
model.command('list').option('-s, --store <store>').action(model_1.listModels);
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
    .action(tuples_1.addTupleOrTuples);
tuples
    .command('remove')
    .alias('delete')
    .argument('<store>', 'Name of store')
    .option('-u, --user <user>')
    .option('-r, --relation <relation>')
    .option('-o, --object <object>')
    .option('-f, --file <file>')
    .action(tuples_1.removeTupleOrTuples);
// ==== Assertions ===
// TODO: add assertions
// ==== check ====
const collectTuples = (value, acc = []) => {
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
    .option('-s, --store <store>')
    .option('-c, --context <tuple>', 'Contextual tuples (can be repeated). Please use quotes "user relation object"', collectTuples)
    .action(check_1.checkTuple);
// ==== query ====
cli
    .command('query')
    .option('-s, --store <store>', '[required]')
    .option('-u, --user <user>')
    .option('-r, --relation <relation>')
    .option('-o, --object <object>', '[required]')
    .option('-p, --page-size <count>', 'Max entries per response', '50')
    .option('-t, --token', 'continuation token')
    .action(query_1.queryTuples);
// ==== state ====
cli
    .command('state')
    .command('set')
    .description('Completely override given store based on provided state file')
    .argument('<state>', 'Path to state file')
    .option('--recreate', 'Destroy existing store if required')
    .action(state_1.setState);
cli.parse();
