
import { join } from "path"
import { formatDate } from "../helpers/formatter"
import * as fs from "../helpers/fs"

export class Creator {

  constructor(protected migrations: string) {
  }

  public async create(name: string): Promise<{filenames: {up: string, down: string}}> {
    if (!await fs.exists(this.migrations)) {
      await fs.mkdirp(this.migrations)
    }
    const now = new Date()
    const escapedName = name.replace(/[^a-zA-Z0-9_]+/g, "_")
    const upFileName = `${this.migrations}/${formatDate(now)}_${escapedName}.up.sql`
    const downFileName = `${this.migrations}/${formatDate(now)}_${escapedName}.down.sql`
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
