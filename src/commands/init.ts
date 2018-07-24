
import chalk from "chalk"
import { CommandModule, Argv } from "yargs"
import { mkdirp, writeFile, readFile } from "../helpers/fs"
import { join } from "path"

const command = "init <path>"
const describe = "Initialize SQLV enviroment."

export class InitCommand implements CommandModule {

  public command = command
  public describe = chalk.gray(describe)

  public builder(options: Argv): Argv {
    return options
      .usage(`${chalk.bold("Usage: ")}$0 ${chalk.bold(command)}

${describe}`)
      .positional("path", {
        describe: chalk.gray("initialize path"),
      })
      .example(chalk.cyan("$ sqlv init ."), "")
      .example(chalk.cyan("$ sqlv init yourproject"), "")
  }

  public async handler(options: any): Promise<void> {
    const configFile = options.config
    await mkdirp(options.path)
    await writeFile(join(options.path, configFile), await readFile(join(__dirname, "../../static/sqlv.config.js")))
    console.log(chalk.green(`${configFile} file generated!`))
  }
}
