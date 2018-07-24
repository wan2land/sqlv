
import { HistoryConfig } from "./history"

export interface MigratorConfig {
  migrations: string
  history: HistoryConfig
  [key: string]: any // for database config
}
