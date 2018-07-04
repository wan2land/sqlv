
export type HistoryConfig = DatabaseHistoryConfig
export interface DatabaseHistoryConfig {
  driver: "database"
  connection?: string
  table: string
}

export interface History {
  all(): Promise<string[]>
  has(id: string): Promise<boolean>
  apply(id: string): Promise<boolean>
  cancel(id: string): Promise<boolean>
}
