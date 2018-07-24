
import chalk from "chalk"
import { CommandModule, Argv } from "yargs"
import { loadConfigFile } from "../helpers/config"
import { Creator } from "../migrator/creator"

const command = "create <name>"
const describe = "Create SQLV migration files."

export class CreateCommand implements CommandModule {

  public command = command
  public describe = chalk.gray(describe)

  public builder(options: Argv): Argv {
    return options
      .usage(`${chalk.bold("Usage: ")}$0 ${chalk.bold(command)}

${describe}`)
      .positional("name", {
        describe: chalk.gray("migration name"),
      })
      .example(chalk.cyan("$ sqlv create create_users"), "")
      .example(chalk.cyan("$ sqlv create add_age_to_users"), "")
  }

  public async handler(options: any): Promise<void> {
    const config = loadConfigFile(options.config)
    const { filenames } = await new Creator(config).create(options.name)

    console.log(chalk.gray(` up   : ${filenames.up}`))
    console.log(chalk.gray(` down : ${filenames.down}`))
    console.log(chalk.green(`migration files are generated!`))
  }
}
