import { Command } from "commander";
import { list } from "./lib/list.js";
import { loadConfig, loadModel, loadState } from "./lib/configuration.js";
import { startInstance, stopInstance, logInstance } from "./lib/setup.js";

const c = loadConfig();
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

cli.command("list").description("List all available stores").action(list);

cli.parse();
