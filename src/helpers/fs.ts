
import * as fs from "fs"
import * as path from "path"

export function mkdirp(p: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mode = parseInt("0777", 8) & (~process.umask()) // tslint:disable-line
    fs.mkdir(p, mode, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          return mkdirp(path.dirname(p))
            .then(() => mkdirp(p))
            .then(resolve)
            .catch(reject)
        }
        return fs.stat(p, (err2, stat) => {
          if (err2 || !stat.isDirectory()) {
            return reject(err)
          }
          resolve()
        })
      }
      resolve()
    })
  })
}

export function readdir(dir: string): Promise<string[]> {
  return new Promise((res, rej) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        rej(err)
        return
      }
      res(files)
    })
  })
}

export function readFile(filename: string): Promise<Buffer> {
  return new Promise((res, rej) => {
    fs.readFile(filename, (err, buffer) => {
      if (err) {
        rej(err)
        return
      }
      res(buffer)
    })
  })
}

export function writeFile(filename: string, data: any): Promise<void> {
  return new Promise((res, rej) => {
    fs.writeFile(filename, data, (err) => {
      if (err) {
        rej(err)
        return
      }
      res()
    })
  })
}

export function exists(filename: string): Promise<boolean> {
  return new Promise((res) => fs.exists(filename, res))
}
