
import chalk from "chalk"
import { CommandModule, Argv } from "yargs"
import { loadConfigFile } from "../helpers/config"
import { create as createConnection } from "async-db-adapter"
import { Migrator } from "../migrator/migrator"

const command = "status"
const describe = "Show current migration status."

export class StatusCommand implements CommandModule {

  public command = command
  public describe = chalk.gray(describe)

  public builder(options: Argv): Argv {
    return options
      .usage(`${chalk.bold("Usage: ")}$0 ${chalk.bold(command)}

${describe}`)
      .example(chalk.cyan("$ sqlv status"), "")
  }

  public async handler(options: any): Promise<void> {
    const config = loadConfigFile(options.config)
    const defaultConnection = createConnection(config as any)
    const migrator = new Migrator({
      default: defaultConnection,
    }, config)
    const migrations = await migrator.status()
    console.log(migrations)
    defaultConnection.close()
  }
}
