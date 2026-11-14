// Makes the data files of the prototype from the files in public/data.
// Run from the project folder: node docs/prototype/make-data.mjs
// The output goes to docs/prototype/data/. That folder is not committed.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const data = join(here, '..', '..', 'public', 'data')
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))

const books = readJson(join(data, 'books.json'))
mkdirSync(join(here, 'data', 'text'), { recursive: true })
mkdirSync(join(here, 'data', 'links'), { recursive: true })

for (const book of books) {
  const id = JSON.stringify(book.id)

  const text = readJson(join(data, 'text', `${book.id}.json`))
  writeFileSync(join(here, 'data', 'text', `${book.id}.js`), `window.__BK&&window.__BK(${id},${JSON.stringify(text.chapters)});`)

  const file = readJson(join(data, 'links', `${book.id}.json`))
  const links = file.links.map(({ upstream, ...link }) => link)
  const body = JSON.stringify({ links, readWith: file.readWith ?? {} })
  writeFileSync(join(here, 'data', 'links', `${book.id}.js`), `window.__LK&&window.__LK(${id},${body});`)
}

console.log(`Wrote the prototype data files for ${books.length} books.`)
