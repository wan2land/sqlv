
import {parse} from "../../dist/migration/sql-parser"
import {readFileSync} from "fs"
import {join} from "path"

require("jest") // tslint:disable-line

describe("sql-parser", () => {
  const sql = readFileSync(join(__dirname, "../../static/migration.up.sql")).toString()
  it("parse", () => {
    expect(parse(sql)).toEqual({
      meta: {connection: "default"},
      body: `
-- sqlv meta using @sqlv prefix :-)
-- if you don't need up, just delete this file



CREATE TABLE \`yourtable\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) NOT NULL DEFAULT '',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`,
    })
  })
})
