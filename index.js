import { Command } from "commander";
import {
  createStore,
  deleteStoreById,
  deleteStoreByName,
  deleteAllStores,
  listAllStores,
} from "./lib/stores.js";
import { loadConfig, loadModel, loadState } from "./lib/configuration.js";
import { startInstance, stopInstance, logInstance } from "./lib/setup.js";
import { initModel } from "./lib/model.js";
import { FGA } from "./lib/fga.js";

const c = loadConfig();

FGA.configure(c);

const m = loadModel();
const s = loadState();

const cli = new Command();

cli
  .name("fga-cli")
  .description("Help manage OpenFGA development instances")
  .version("0.0.1");

cli
  .command("start")
  .description("Start a local OpenFGA docker instance")
  .action(startInstance);

cli
  .command("stop")
  .description("Stop local OpenFGA docker instance")
  .action(stopInstance);

cli
  .command("logs")
  .description("Stream logs from instance")
  .action(logInstance);

const store = cli.command("store");

store
  .command("list")
  .description("List all available stores")
  .action(listAllStores);

store
  .command("create")
  .description("Create a store with the given name")
  .argument("<name>")
  .action(createStore);

store
  .command("delete")
  .description("Delete a store for a given name")
  .argument("<name>")
  .action(deleteStoreByName);

store
  .command("delete-id")
  .description("Delete a store for a given id")
  .argument("<id>")
  .action(deleteStoreById);

store
  .command("delete-all")
  .description("Delete all stores")
  .action(deleteAllStores);

const initer = cli.command("init");

initer
  .command("model")
  .argument("[file]", "(optional) path to model file", "./fga.model.dsl")
  .action(initModel);

cli.parse();
