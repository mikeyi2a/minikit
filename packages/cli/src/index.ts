import { Command } from "commander";
import path from "node:path";
import { runAdd } from "./commands/add.js";
import { runInit } from "./commands/init.js";
import { DEFAULT_REGISTRY_URL } from "./lib/registry.js";

const program = new Command();

program
  .name("minikit")
  .description("Add Minikit components to your project")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize Minikit in the current project")
  .option("-r, --registry <url>", "Registry URL", DEFAULT_REGISTRY_URL)
  .action(async (opts: { registry: string }) => {
    await runInit(process.cwd(), opts.registry);
  });

program
  .command("add")
  .description("Add one or more components")
  .argument("<components...>", "Component names (e.g. slider toolbar)")
  .option("-r, --registry <url>", "Registry URL", DEFAULT_REGISTRY_URL)
  .option("--no-install", "Skip npm install for dependencies")
  .action(async (components: string[], opts: { registry: string; install: boolean }) => {
    await runAdd(process.cwd(), components, opts);
  });

program.parse();
