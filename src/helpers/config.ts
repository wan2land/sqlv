
import {join} from "path"
import {MigratorConfig} from "../interfaces/migrator"

export function loadConfigFile(filename: string): MigratorConfig {
  try {
    const config = require(join(process.cwd(), filename))
    return {
      ...config,
      migrations: config.migrations || "migrations",
      history: config.history || {
        driver: "database",
        table: "migrations",
      },
    }
  } catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
      console.error("No config file found")
      process.exit(1)
    }
    throw e
  }
}
