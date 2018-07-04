# SQLV

[![Downloads](https://img.shields.io/npm/dt/sqlv.svg)](https://npmcharts.com/compare/sqlv?minimal=true)
[![Version](https://img.shields.io/npm/v/sqlv.svg)](https://www.npmjs.com/package/sqlv)
[![License](https://img.shields.io/npm/l/sqlv.svg)](https://www.npmjs.com/package/sqlv)

[![NPM](https://nodei.co/npm/sqlv.png)](https://www.npmjs.com/package/sqlv)

Let SQL do what SQL can.

sqlv is very simple SQL Migrator.

## Installation

```bash
npm install sqlv -g
```

## Usage

initialize.

```bash
sqlv init .
```

then, create `sqlv.config.js` file.

if you want use mysql, install `mysql` or `mysql2`. and, fix `sqlv.config.js` file.

create migration file.

```bash
sqlv create create_init_tables
```

then, create two migration files in `migrations` directory.

write two migration files. (`up` is migrate file, `down` is rollback file.)

```bash
sqlv migrate
```

done!
