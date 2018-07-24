
import chalk from "chalk"
import { Argv, CommandModule } from "yargs"
import { loadConfigFile } from "../helpers/config"
import { Migrator } from "../migrator/migrator"

const command = "rollback"
const describe = "Rollback the last migration."

export class RollbackCommand implements CommandModule {

  public command = command
  public describe = chalk.gray(describe)

  public builder(options: Argv): Argv {
    return options
      .usage(`${chalk.bold("Usage: ")}$0 ${chalk.bold(command)}

${describe}`)
      .example(chalk.cyan("$ sqlv rollback"), "")
  }

  public async handler(options: any): Promise<void> {
    const migrator = new Migrator(loadConfigFile(options.config))
    try {
      await migrator.rollback((migration) => {
        process.stdout.write(`down ${migration.id} ... `)
      }, (migration) => {
        process.stdout.write(`\rdown ${migration.id} ... ${chalk.green("OK")}\n`)
      }, (_, migration) => {
        process.stdout.write(`\rdown ${migration.id} ... ${chalk.red("FAIL")}\n`)
      })
    } catch (e) {
      console.error(e.message)
      migrator.close()
      process.exit(1)
    }
    migrator.close()
  }
}
