
export interface History {
  all(): Promise<string[]>
  has(id: string): Promise<boolean>
  apply(id: string): Promise<boolean>
  cancel(id: string): Promise<boolean>
}
