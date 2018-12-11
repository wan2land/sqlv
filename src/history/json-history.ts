
import { writeFile } from "fs"
import { History } from "../interfaces/history"

export class JsonHistory implements History {
  constructor(public path: string) {
  }

  public async all(): Promise<string[]> {
    try {
      return require(this.path)
    } catch (e) {
      return []
    }
  }

  public async has(id: string): Promise<boolean> {
    return (await this.all()).indexOf(id) > -1
  }

  public async apply(id: string): Promise<boolean> {
    const migrations = new Set(await this.all())
    migrations.add(id)
    try {
      await new Promise((resolve, reject) => {
        writeFile(this.path, JSON.stringify([...migrations], null, "  "), (err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })
      return true
    } catch (e) {
      return false
    }
  }

  public async cancel(id: string): Promise<boolean> {
    const migrations = new Set(await this.all())
    migrations.delete(id)
    try {
      await new Promise((resolve, reject) => {
        writeFile(this.path, JSON.stringify([...migrations], null, "  "), (err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })
      return true
    } catch (e) {
      return false
    }
  }
}
