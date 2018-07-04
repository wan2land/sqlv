
import {Connection} from "async-db-adapter"

export interface ConnectionMap {
  [name: string]: Connection
}

export interface MigrationExecutor {
  up(connections: ConnectionMap): Promise<void>
  down(connections: ConnectionMap): Promise<void>
}

export interface Migration {
  id: string
  file: {
    up?: string,
    down?: string,
  }
  applied: boolean
}
