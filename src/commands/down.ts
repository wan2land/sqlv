
import { create } from "async-db-adapter"
import chalk from "chalk"
import { Argv, CommandModule } from "yargs"
import { loadConfigFile } from "../helpers/config"
import { Migrator } from "../migrator/migrator"

const command = "down <id>"
const describe = "Rollback the specific migration."

export class DownCommand implements CommandModule {

  public command = command
  public describe = chalk.gray(describe)

  public builder(options: Argv): Argv {
    return options
      .usage(`${chalk.bold("Usage: ")}$0 ${chalk.bold(command)}

${describe}`)
      .positional("id", {
        describe: chalk.gray("specific migration id, like 180101_000000"),
      })
      .example(chalk.cyan("$ sqlv down 180101_000000"), "")
  }

  public async handler(options: any): Promise<void> {
    const migrator = new Migrator(loadConfigFile(options.config))
    try {
      process.stdout.write(`down ${options.id} ... `)
      await migrator.down(options.id)
      process.stdout.write(`\rdown ${options.id} ... ${chalk.green("OK")}\n`)
    } catch (e) {
      process.stdout.write(`\rdown ${options.id} ... ${chalk.red("FAIL")}\n`)
      console.error(e.message)
      migrator.close()
      process.exit(1)
    }
    migrator.close()
  }
}
