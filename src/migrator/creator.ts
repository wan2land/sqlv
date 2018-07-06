
import {join} from "path"
import {MigratorConfig} from "../interfaces/migrator"
import * as fs from "../helpers/fs"
import {formatDate} from "../helpers/formatter"

export class Creator {

  constructor(protected config: MigratorConfig) {
  }

  public async create(name: string): Promise<void> {
    if (!await fs.exists(this.config.migrations)) {
      await fs.mkdirp(this.config.migrations)
    }
    const now = new Date()
    const escapedName = name.replace(/[^a-zA-Z0-9_]+/g, "_")
    await Promise.all([
      fs.writeFile(
        `${this.config.migrations}/${formatDate(now)}_${escapedName}.up.sql`,
        await fs.readFile(join(__dirname, "../../static/migration.up.sql")),
      ),
      fs.writeFile(
        `${this.config.migrations}/${formatDate(now)}_${escapedName}.down.sql`,
        await fs.readFile(join(__dirname, "../../static/migration.down.sql")),
      ),
    ])
  }
}
