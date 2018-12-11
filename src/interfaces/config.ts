
import { ConnectionConfig } from "@stdjs/database"

export interface MigratorConfig {
  migrations: string
  history: HistoryConfig
  connections: {
    [key: string]: ConnectionConfig
  }
}

export type HistoryConfig = DatabaseHistoryConfig | JsonHistoryConfig

export interface DatabaseHistoryConfig {
  driver: "database"
  connection?: string
  table: string
}

export interface JsonHistoryConfig {
  driver: "json"
  path?: string
}
