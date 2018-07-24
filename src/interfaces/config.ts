
import { ConnectionConfig } from "async-db-adapter"

export interface MigratorConfig {
  migrations: string
  history: HistoryConfig
  connections: {
    [key: string]: ConnectionConfig
  }
}

export type HistoryConfig = DatabaseHistoryConfig

export interface DatabaseHistoryConfig {
  driver: "database"
  connection?: string
  table: string
}
