import * as path from "path"
import { HistoryConfig } from "../interfaces/config"
import { History } from "../interfaces/history"
import { ConnectionMap } from "../interfaces/interfaces"
import { DatabaseHistory } from "./database-history"
import { JsonHistory } from "./json-history"

export function create(config: HistoryConfig, connections: ConnectionMap): History {
  if (config.driver === "database") {
    const historyConnection = config.connection || Object.keys(connections)[0]
    if (!historyConnection) {
      throw new Error("need history manager")
    }
    const conn = connections[historyConnection]
    if (!conn) {
      throw new Error("need history manager")
    }
    return new DatabaseHistory(conn, config.table)
  } else if (config.driver === "json") {
    return new JsonHistory(path.resolve(process.cwd(), config.path || "sqlv.history.json"))
  }
  throw new Error(`unknown history manager driver(${(config as any).driver})`)
}
