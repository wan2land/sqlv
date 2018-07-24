
import { create } from "async-db-adapter"
import chalk from "chalk"
import { Argv, CommandModule } from "yargs"
import { loadConfigFile } from "../helpers/config"
import { Migrator } from "../migrator/migrator"

const command = "up <id>"
const describe = "Run the specific migration."

export class UpCommand implements CommandModule {

  public command = command
  public describe = chalk.gray(describe)

  public builder(options: Argv): Argv {
    return options
      .usage(`${chalk.bold("Usage: ")}$0 ${chalk.bold(command)}

${describe}`)
      .positional("id", {
        describe: chalk.gray("specific migration id, like 180101_000000"),
      })
      .example(chalk.cyan("$ sqlv up 180101_000000"), "")
  }

  public async handler(options: any): Promise<void> {
    const config = loadConfigFile(options.config)
    const defaultConnection = create(config as any)
    const migrator = new Migrator({
      default: defaultConnection,
    }, config)
    try {
      process.stdout.write(`up ${options.id} ... `)
      await migrator.up(options.id)
      process.stdout.write(`\rup ${options.id} ... ${chalk.green("OK")}\n`)
    } catch (e) {
      process.stdout.write(`\rup ${options.id} ... ${chalk.red("FAIL")}\n`)
      console.error(e.message)
      defaultConnection.close()
      process.exit(1)
    }
    defaultConnection.close()
  }
}
