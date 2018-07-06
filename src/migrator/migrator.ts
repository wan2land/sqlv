
import {create as createHistory} from "../history/create"
import {ConnectionMap, Migration, MigrationExecutor} from "../interfaces/interfaces"
import {History} from "../interfaces/history"
import {MigratorConfig} from "../interfaces/migrator"
import * as fs from "../helpers/fs"
import {parse} from "../migration/sql-parser"

async function executeSqlfile(connections: ConnectionMap, filename: string): Promise<void> {
  const resp = parse((await fs.readFile(filename)).toString())
  const connection = connections[resp.meta.connection || "default"]
  for (const sql of resp.body.split(";")) {
    const trimSql = sql.trim()
    if (trimSql) {
      await connection.query(trimSql)
    }
  }
}

export class Migrator {

  protected history: History

  constructor(
    protected connections: ConnectionMap,
    protected config: MigratorConfig) {

    this.history = createHistory(config.history, connections)
  }

  public async up(id: string, forced: boolean = false): Promise<void> {
    const migration = await this.getMigrationExecutor(id)
    const hasId = await this.history.has(id)
    if (forced || !hasId) {
      if (migration.up) {
        const result = migration.up(this.connections)
        if (result instanceof Promise) {
          await result
        }
      }
      await this.history.apply(id)
    }
  }

  public async down(id: string, forced: boolean = false): Promise<void> {
    const migration = await this.getMigrationExecutor(id)
    const hasId = await this.history.has(id)
    if (forced || hasId) {
      if (migration.down) {
        const result = migration.down(this.connections)
        if (result instanceof Promise) {
          await result
        }
      }
      await this.history.cancel(id)
    }
  }

  public async migrate(
    onUp?: (migration: Migration) => void,
    onComplete?: (migration: Migration) => void,
    onError?: (error: any, migration: Migration) => void): Promise<void> {

    const migrations = (await this.status()).filter(migration => !migration.applied)
    for (const migration of migrations) {
      if (onUp) {
        onUp(migration)
      }
      try {
        await this.up(migration.id)
        if (onComplete) {
          onComplete(migration)
        }
      } catch (e) {
        if (onError) {
          onError(e, migration)
        }
        throw e
      }
    }
  }

  public async rollback(
    onDown?: (migration: Migration) => void,
    onComplete?: (migration: Migration) => void,
    onError?: (error: any, migration: Migration) => void): Promise<void> {

    const migrations = (await this.status()).filter(migration => migration.applied)
    const last = migrations.pop()
    if (last) {
      if (onDown) {
        onDown(last)
      }
      try {
        await this.down(last.id)
        if (onComplete) {
          onComplete(last)
        }
      } catch (e) {
        if (onError) {
          onError(e, last)
        }
        throw e
      }
    }
  }

  public async status(): Promise<Migration[]> {
    const migrations: {[id: string]: Migration} = {}
    for (const file of await this.getMigrationFiles()) {
      const matches = file.match(/^([0-9]{6}_[0-9]{6})_(.+)$/)
      if (!matches) {
        continue
      }
      const id = matches[1]
      if (!migrations[id]) {
        migrations[id] = {
          id,
          file: {},
          applied: await this.history.has(id),
        }
      }
      const filename = matches[0]
      if (filename.indexOf(".up.") > -1) {
        migrations[id].file.up = filename
      } else if (filename.indexOf(".down.") > -1) {
        migrations[id].file.down = filename
      }
    }
    return Object.values(migrations).sort((a, b) => {
      if (a.id === b.id) {
        return 0
      }
      return a.id > b.id ? 1 : -1
    })
  }

  protected async getMigrationExecutor(id: string): Promise<MigrationExecutor> {
    if (!/^\d{6}_\d{6}$/.test(id)) {
      throw new Error("invalid migration id. it must be like 000000_000000.")
    }
    const migration = (await this.status()).find(migrate => migrate.id === id)
    if (!migration) {
      throw new Error(`not exists migration(id=${id})`)
    }
    return {
      up: async (connections) => {
        if (!migration.file.up) {
          return
        }
        await executeSqlfile(connections, `${this.config.migrations}/${migration.file.up}`)
      },
      down: async (connections) => {
        if (!migration.file.down) {
          return
        }
        await executeSqlfile(connections, `${this.config.migrations}/${migration.file.down}`)
      },
    }
  }

  protected async getMigrationFiles(): Promise<string[]> {
    const RE_SQL_EXT = /\.(up|down)\.sql$/
    try {
      return (await fs.readdir(this.config.migrations))
        .filter(file => RE_SQL_EXT.test(file))
        .sort((a, b) => {
          if (a === b) {
            return 0
          }
          return a > b ? 1 : -1
        })
    } catch (e) {
      if (e.code === "ENOENT") {
        return []
      }
      throw e
    }
  }
}
