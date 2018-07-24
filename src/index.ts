
import { DatabaseHistoryConfig, HistoryConfig } from "./interfaces/history"
import { ConnectionMap, Migration } from "./interfaces/interfaces"
import { MigratorConfig } from "./interfaces/migrator"
import { Migrator } from "./migrator/migrator"

export {
  Migrator,
  ConnectionMap,
  Migration,
  MigratorConfig,
  HistoryConfig,
  DatabaseHistoryConfig,
}
