#!/usr/bin/env node

import chalk from "chalk"
import * as yargs from "yargs"
import { CreateCommand } from "./commands/create"
import { DownCommand } from "./commands/down"
import { InitCommand } from "./commands/init"
import { MigrateCommand } from "./commands/migrate"
import { RollbackCommand } from "./commands/rollback"
import { StatusCommand } from "./commands/status"
import { UpCommand } from "./commands/up"

const pkg = require("../package.json") // tslint:disable-line

const argv = yargs
  .usage(`
Simple SQL Migrator

${chalk.bold("Usage: $0")} COMMAND [options]`)
  .version(pkg.version)
  .command(new InitCommand())
  .command(new CreateCommand())
  .command(new StatusCommand())
  .command(new MigrateCommand())
  .command(new RollbackCommand())
  .command(new UpCommand())
  .command(new DownCommand())
  .option("config", {
    alias: "c",
    type: "string",
    default: "./sqlv.config.js",
    description: `${chalk.gray("Set config path")}`,
  })
  .strict()
  .help("h")
  .alias("h", "help")
  .updateStrings({
    "Positionals:": chalk.bold("Positionals:"),
    "Examples:": chalk.bold("Examples:"),
    "Commands:": chalk.bold("Commands:"),
    "Options:": chalk.bold("Options:"),

    "boolean": chalk.cyan("boolean"),
    "string": chalk.cyan("string"),
    "default:": chalk.yellow("default:"),

    "required": chalk.cyan.bold("required"),

    "Show help": chalk.gray("Show help"),
    "Show version number": chalk.gray("Show version number"),
  })
  .argv

if (argv._.length === 0) {
  yargs.showHelp()
}
