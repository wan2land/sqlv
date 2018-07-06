# SQLV

[![Downloads](https://img.shields.io/npm/dt/sqlv.svg)](https://npmcharts.com/compare/sqlv?minimal=true)
[![Version](https://img.shields.io/npm/v/sqlv.svg)](https://www.npmjs.com/package/sqlv)
[![License](https://img.shields.io/npm/l/sqlv.svg)](https://www.npmjs.com/package/sqlv)

[![NPM](https://nodei.co/npm/sqlv.png)](https://www.npmjs.com/package/sqlv)

Let SQL do what SQL can.

SQLV is very simple SQL Migrator.

## Installation

```bash
npm install sqlv -g # or npm install sqlv --dev
```

## Usage

Initialize.

```bash
sqlv init .
```

This will create a configuration file, `sqlv.config.js`.

You need to install additional packages(`mysql`, `mysql2`...) to match your database. SQLV is
based on the [async-db-adapter](https://www.npmjs.com/package/async-db-adapter).

example, 

```bash
npm install mysql2 -g
```

Now, edit `sqlv.config.js` file as follows:

```js
module.exports = {
  type: "mysql2",
  host: "localhost",
  database: "",
  user: "sqlvuser",
  password: "********",
}
```

### Create Migrations

```bash
sqlv create create_init_tables
```

Two files(`create_init_tables.up.sql`, `create_init_tables.down.sql`) are created under
the `./migrations` directory.

Now, Migrate!

```bash
sqlv migrate
```

Done! :-)

## Commands

- `init <path>` : Initialize the project.
- `create <name>` : Create a migration file.
- `status` : Show migration status.
- `migrate` : Migrate.
- `rollback` : Rollback.
- `up <migration_id>` : Only apply the specific migration.
- `down <migration_id>` : Only rollback the specific migration.

Add scripts to `package.json` :

```json
{
  "scripts": {
    "sqlv:init": "sqlv init",
    "sqlv:create": "sqlv create",
    "sqlv:status": "sqlv status",
    "sqlv:migrate": "sqlv migrate",
    "sqlv:rollback": "sqlv rollback",
    "sqlv:up": "sqlv up",
    "sqlv:down": "sqlv down"
  }
}
```
