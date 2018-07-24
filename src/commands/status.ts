
import { create } from "async-db-adapter"
import chalk from "chalk"
import { Argv, CommandModule } from "yargs"
import { loadConfigFile } from "../helpers/config"
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
    const defaultConnection = create(config as any)
    const migrator = new Migrator({
      default: defaultConnection,
    }, config)
    const migrations = await migrator.status()
    let maxFileLength = migrations.reduce((carry, migration) => {
      carry = migration.file.up && carry < migration.file.up.length ? migration.file.up.length : carry
      carry = migration.file.down && carry < migration.file.down.length ? migration.file.down.length : carry
      return carry
    }, 0)
    maxFileLength = Math.max(maxFileLength, 8)

    console.log("+----+---------------+-" + "-".repeat(maxFileLength) + "-+")
    console.log("| UP | ID            | " + "FILENAME".padEnd(maxFileLength) + " |")
    console.log("+----+---------------+-" + "-".repeat(maxFileLength) + "-+")
    for (const migration of migrations) {
      const status = migration.applied ? chalk.green("O") : chalk.red("X")
      if (migration.file.up && migration.file.down) {
        console.log(`| ${status}  | ${migration.id} | ${migration.file.up.padEnd(maxFileLength)} |`)
        console.log(`|    |               | ${migration.file.down.padEnd(maxFileLength)} |`)
      } else if (migration.file.up) {
        console.log(`| ${status}  | ${migration.id} | ${migration.file.up.padEnd(maxFileLength)} |`)
      } else if (migration.file.down) {
        console.log(`| ${status}  | ${migration.id} | ${migration.file.down.padEnd(maxFileLength)} |`)
      }
    }
    console.log("+----+---------------+-" + "-".repeat(maxFileLength) + "-+")
    defaultConnection.close()
  }
}
