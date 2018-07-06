#!/usr/bin/env node

import * as program from "commander"
import {mkdirp, writeFile, readFile} from "./helpers/fs"
import {join} from "path"
import {loadConfigFile} from "./helpers/config"
import {Creator} from "./migrator/creator"
import {Migrator} from "./migrator/migrator"
import {create as createConnection} from "async-db-adapter"

const pkg = require("../package.json") // tslint:disable-line

const configFileDefault = "sqlv.config.js"

program
  .version(pkg.version)
  .option("-c, --config <path>", "set config path. defaults to ./sqlv.config.js")

// [] optional, <> must
program
  .command("init <path>")
  .description("initialize sqlv enviroment")
  .action(async (path, options) => {
    const configFile = options.parent.config || configFileDefault
    await mkdirp(path)
    await writeFile(join(path, configFile), await readFile(join(__dirname, "../static/sqlv.config.js")))
  })
  .on("--help", () => {
    console.log()
    console.log("  Examples:")
    console.log()
    console.log("    $ sqlv init .")
    console.log("    $ sqlv init yourproject")
    console.log()
  })

program
  .command("create <name>")
  .description("create sqlv migration file")
  .action(async (name, options) => {
    const config = loadConfigFile(options.parent.config || configFileDefault)
    await new Creator(config).create(name)
  })
  .on("--help", () => {
    console.log()
    console.log("  Examples:")
    console.log()
    console.log("    $ sqlv create migration_name")
    console.log()
  })

program
  .command("status")
  .description("show status")
  .action(async (options) => {
    const config = loadConfigFile(options.parent.config || configFileDefault)
    const defaultConnection = createConnection(config as any)
    const migrator = new Migrator({
      default: defaultConnection,
    }, config)
    const migrations = await migrator.status()
    console.log(migrations)
    defaultConnection.close()
  })

program
  .command("migrate")
  .description("migrate")
  .action(async (options) => {
    const config = loadConfigFile(options.parent.config || configFileDefault)
    const defaultConnection = createConnection(config as any)
    const migrator = new Migrator({
      default: defaultConnection,
    }, config)
    try {
      await migrator.migrate((migration) => {
        process.stdout.write(`up ${migration.id} ... `)
      }, (migration) => {
        process.stdout.write(`\rup ${migration.id} ... OK\n`)
      }, (_, migration) => {
        process.stdout.write(`\rup ${migration.id} ... Fail\n`)
      })
    } catch (e) {
      console.error(e.message)
      defaultConnection.close()
      process.exit(1)
    }
    defaultConnection.close()
  })

program
  .command("rollback")
  .description("rollback")
  .action(async (options) => {
    const config = loadConfigFile(options.parent.config || configFileDefault)
    const defaultConnection = createConnection(config as any)
    const migrator = new Migrator({
      default: defaultConnection,
    }, config)
    try {
      await migrator.rollback((migration) => {
        process.stdout.write(`down ${migration.id} ... `)
      }, (migration) => {
        process.stdout.write(`\rdown ${migration.id} ... OK\n`)
      }, (_, migration) => {
        process.stdout.write(`\rdown ${migration.id} ... Fail\n`)
      })
    } catch (e) {
      console.error(e.message)
      defaultConnection.close()
      process.exit(1)
    }
    defaultConnection.close()
  })

program
  .command("up <migration_id>")
  .description("migrate specific migration")
  .action(async (id, options) => {
    const config = loadConfigFile(options.parent.config || configFileDefault)
    const defaultConnection = createConnection(config as any)
    const migrator = new Migrator({
      default: defaultConnection,
    }, config)
    try {
      process.stdout.write(`up ${id} ... `)
      await migrator.up(id)
      process.stdout.write(`\rup ${id} ... OK\n`)
    } catch (e) {
      process.stdout.write(`\rup ${id} ... Fail\n`)
      console.error(e.message)
      defaultConnection.close()
      process.exit(1)
    }
    defaultConnection.close()
  })
  .on("--help", () => {
    console.log()
    console.log("  Examples:")
    console.log()
    console.log("    $ sqlv up 180101_000000")
    console.log()
  })

program
  .command("down <migration_id>")
  .description("migrate specific migration")
  .action(async (id, options) => {
    const config = loadConfigFile(options.parent.config || configFileDefault)
    const defaultConnection = createConnection(config as any)
    const migrator = new Migrator({
      default: defaultConnection,
    }, config)
    try {
      process.stdout.write(`down ${id} ... `)
      await migrator.down(id)
      process.stdout.write(`\rdown ${id} ... OK\n`)
    } catch (e) {
      process.stdout.write(`\rdown ${id} ... Fail\n`)
      console.error(e.message)
      defaultConnection.close()
      process.exit(1)
    }
    defaultConnection.close()
  })
  .on("--help", () => {
    console.log()
    console.log("  Examples:")
    console.log()
    console.log("    $ sqlv down 180101_000000")
    console.log()
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}
