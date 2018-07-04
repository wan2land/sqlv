
import {load} from "js-yaml"

export function parse(contents: string): {meta: {[key: string]: any}, body: string} {
  const meta: {[key: string]: any} = {}
  let body = ""

  while (contents) {
    const beforeContents = contents
    const matches = contents.match(/--[ \t]*@sqlv(?:[ \t]+([^\n]*))?/)
    if (matches && matches.index) {
      body += contents.substr(0, matches.index)
      Object.assign(meta, load(matches[1]))
      contents = contents.substr(matches.index + matches[0].length)
    }
    if (beforeContents === contents) {
      break
    }
  }
  body += contents // remain contents

  return {
    meta,
    body,
  }
}
