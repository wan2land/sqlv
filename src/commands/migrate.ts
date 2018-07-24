
import { create } from "async-db-adapter"
import chalk from "chalk"
import { Argv, CommandModule } from "yargs"
import { loadConfigFile } from "../helpers/config"
import { Migrator } from "../migrator/migrator"

const command = "migrate"
const describe = "Run migrations all."

export class MigrateCommand implements CommandModule {

  public command = command
  public describe = chalk.gray(describe)

  public builder(options: Argv): Argv {
    return options
      .usage(`${chalk.bold("Usage: ")}$0 ${chalk.bold(command)}

${describe}`)
      .example(chalk.cyan("$ sqlv migrate"), "")
  }

  public async handler(options: any): Promise<void> {
    const config = loadConfigFile(options.config)
    const defaultConnection = create(config as any)
    const migrator = new Migrator({
      default: defaultConnection,
    }, config)
    try {
      await migrator.migrate((migration) => {
        process.stdout.write(`up ${migration.id} ... `)
      }, (migration) => {
        process.stdout.write(`\rup ${migration.id} ... ${chalk.green("OK")}\n`)
      }, (_, migration) => {
        process.stdout.write(`\rup ${migration.id} ... ${chalk.red("FAIL")}\n`)
      })
    } catch (e) {
      console.error(e.message)
      defaultConnection.close()
      process.exit(1)
    }
    defaultConnection.close()
  }
}
