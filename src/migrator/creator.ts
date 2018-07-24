
import {join} from "path"
import {MigratorConfig} from "../interfaces/migrator"
import * as fs from "../helpers/fs"
import {formatDate} from "../helpers/formatter"

export class Creator {

  constructor(protected config: MigratorConfig) {
  }

  public async create(name: string): Promise<{filenames: {up: string, down: string}}> {
    if (!await fs.exists(this.config.migrations)) {
      await fs.mkdirp(this.config.migrations)
    }
    const now = new Date()
    const escapedName = name.replace(/[^a-zA-Z0-9_]+/g, "_")
    const upFileName = `${this.config.migrations}/${formatDate(now)}_${escapedName}.up.sql`
    const downFileName = `${this.config.migrations}/${formatDate(now)}_${escapedName}.down.sql`
    await Promise.all([
      fs.writeFile(upFileName, await fs.readFile(join(__dirname, "../../static/migration.up.sql"))),
      fs.writeFile(downFileName, await fs.readFile(join(__dirname, "../../static/migration.down.sql"))),
    ])

    return {
      filenames: {
        up: upFileName,
        down: downFileName,
      },
    }
  }
}
