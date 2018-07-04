
import {Connection} from "async-db-adapter"
import {History} from "../interfaces/history"

export class DatabaseHistory implements History {
  constructor(
    protected connection: Connection,
    protected table: string) {
  }

  public async all(): Promise<string[]> {
    if (!(await this.isReady())) {
      return []
    }
    const migrations = await this.connection.select(`SELECT * FROM \`${this.table}\``)
    return migrations.map(row => row.id)
  }

  public async has(id: string): Promise<boolean> {
    if (!(await this.isReady())) {
      return false
    }
    const migrations = await this.connection.select(`SELECT * FROM \`${this.table}\` WHERE \`id\` = ?`, [id])
    return migrations.length > 0
  }

  public async apply(id: string): Promise<boolean> {
    await this.init()
    if (await this.has(id)) {
      return false
    }
    await this.connection.query(`INSERT INTO \`${this.table}\`(\`id\`) VALUE(?)`, [id])
    return true
  }

  public async cancel(id: string): Promise<boolean> {
    await this.init()
    if (!(await this.has(id))) {
      return false
    }
    await this.connection.query(`DELETE FROM \`${this.table}\` WHERE \`id\` = ?`, [id])
    return true
  }

  protected async init(): Promise<void> {
    if (await this.isReady()) {
      return
    }
    await this.connection.query(`CREATE TABLE \`${this.table}\`(\`id\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`))`)
  }

  protected async isReady(): Promise<boolean> {
    const tables = await this.connection.select(`SHOW TABLES LIKE "${this.table}"`)
    if (tables.length) {
      return true
    }
    return false
  }
}
