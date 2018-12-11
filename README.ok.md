# SQLV

[![Build](https://travis-ci.org/corgidisco/sqlv.svg?branch=master)](https://travis-ci.org/corgidisco/sqlv)
[![Downloads](https://img.shields.io/npm/dt/sqlv.svg)](https://npmcharts.com/compare/sqlv?minimal=true)
[![Version](https://img.shields.io/npm/v/sqlv.svg)](https://www.npmjs.com/package/sqlv)
[![License](https://img.shields.io/npm/l/sqlv.svg)](https://www.npmjs.com/package/sqlv)

[![dependencies Status](https://img.shields.io/david/corgidisco/sqlv.svg)](https://david-dm.org/corgidisco/sqlv)
[![devDependencies Status](https://img.shields.io/david/dev/corgidisco/sqlv.svg)](https://david-dm.org/corgidisco/sqlv?type=dev)

[![NPM](https://nodei.co/npm/sqlv.png)](https://www.npmjs.com/package/sqlv)

Let SQL do what SQL can.

SQLV is very simple SQL Migrator.

![SQLV Image](./images/sqlv.png)

## Installation

```bash
$ npm i sqlv -D
```

Change the package.json file to the following:

```json
{
  "scripts": {
    "sqlv": "sqlv"
  },
  ...
}
```

Now, Type the following to print the version.

```bash
$ npm run sqlv --version
```

To use it globally, please do the following:

```bash
$ npm i sqlv -g
```

## Usage

### Initialize Project

```bash
$ sqlv init .
$ sqlv init yourprojectpath
```

This will create a configuration file, `sqlv.config.js`.

You need to install additional packages(`mysql`, `mysql2`, `pg`, `sqlite3`) to match your database. SQLV is
based on the [@stdjs/database](https://www.npmjs.com/package/@stdjs/database).

example,

```bash
$ npm i mysql
$ npm i mysql2
$ npm i pg
$ npm i sqlite3
```

Now, edit `sqlv.config.js` file as follows:

```js
module.exports = {
  adapter: "mysql2",
  host: "localhost",
  database: "test",
  user: "root",
  password: "********",
}
```

### Create Migrations

```bash
$ sqlv create create_init_tables
```

Two files(`181201_000000_create_init_tables.up.sql`, `181201_000000_create_init_tables.down.sql`) are created under
the `./migrations` directory.

### Migrate

```bash
$ sqlv migrate
up 181201_000000 ... OK
```

### Show Current Status

![SQLV Image](./images/sqlv-status.png)

```bash
$ sqlv status
```

### Rollback

```bash
$ sqlv rollback
down 181201_000000 ... OK
```

### Migrate Specific Version

```bash
$ sqlv up 181201_000000
up 181201_000000 ... OK
```

### Rollback Specific Version

```bash
$ sqlv down 181201_000000
down 181201_000000 ... OK
```

## How to use

### Multi-Connection

If you have multiple DB connections, you can use:

```js
// sqlv.config.js
module.exports = {
  connections: {
    default: {
      adapter: "mysql",
      host: "localhost",
      database: "test",
      user: "root",
      password: "",
    },
    pg: {
      adapter: "pg",
      user: "root",
      password: "",     
    },
  },
}
```

Migrations files, you can specify a connection with a comment.

```sql
-- @sqlv connection: pg

CREATE /* ...SQL Syntax.... */;
```

You can specify multiple connections for one file.

```sql
-- @sqlv connection: default

CREATE /* ...SQL Syntax.... */;
CREATE /* ...SQL Syntax.... */;
CREATE /* ...SQL Syntax.... */;

-- @sqlv connection: pg

CREATE /* ...SQL Syntax.... */;
CREATE /* ...SQL Syntax.... */;
```


## License

MIT
