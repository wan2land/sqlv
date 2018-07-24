
import { join } from "path"
import { MigratorConfig } from "../interfaces/config"

export function loadConfigFile(filename: string): MigratorConfig {
  try {
    const {migrations, history, connections, ...config} = require(join(process.cwd(), filename))

    return {
      migrations: migrations || "migrations",
      history: history || {
        driver: (history && history.driver) || "database",
        table: (history && history.table) || "migrations",
      },
      connections: {
        default: config,
        ...(connections || {}),
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
