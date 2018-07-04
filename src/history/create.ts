
import {ConnectionMap} from "../interfaces/interfaces"
import {History, HistoryConfig} from "../interfaces/history"
import {DatabaseHistory} from "./database-history"

export function create(config: HistoryConfig, connections: ConnectionMap): History {
  const historyConnection = config.connection || Object.keys(connections)[0]
  if (!historyConnection) {
    throw new Error("need history manager")
  }
  const conn = connections[historyConnection]
  if (!conn) {
    throw new Error("need history manager")
  }
  return new DatabaseHistory(conn, config.table)
}
