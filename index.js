import { Command } from "commander";
import { list } from "./lib/list.js";
import { loadConfig, loadModel, loadState } from "./lib/configuration.js";

const config = loadConfig();
const m = loadModel();
const s = loadState();
console.dir(s);

const cli = new Command();

cli
  .name("fga-cli")
  .description("Help manage OpenFGA development instances")
  .version("0.0.1");

cli.command("list").description("List all available stores").action(list);

cli.parse();
