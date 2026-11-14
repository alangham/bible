// Checks each link in public/data/links/. docs/TASKS.md Task 7 step 8.
// For each link: the two ends exist, no link to itself, no duplicate, the type is set, the source is one of
// the three approved sources (docs/DESIGN.md section 4.5), a quotation link has a reason line and an echo
// link has none, and the link is in the file of the book at each end.
// Task 7b, the fit rule: a link of the Bible Quotation Database is a quotation link only if its fit is "quote".
// A link with the fit "close" or "weak" is an echo link. No echo link overlaps a quotation link at its two ends.
// Usage: node scripts/check-links.mjs    Exit code 1 if a check fails. Prints a JSON summary.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const books = JSON.parse(readFileSync(join(ROOT, 'public/data/books.json'), 'utf8'))
const SOURCES = { 'Bible Quotation Database': ['quotation', 'echo'], 'OpenBible.info': ['echo'], 'Berean Standard Bible': ['echo'] }
/** The fit of each link of the Bible Quotation Database, by key: the quoting verse, then the quoted verse. */
const fits = JSON.parse(readFileSync(join(ROOT, 'content/quotation-reasons.json'), 'utf8'))

// Verse numbers of the Bible text, with the verses that are not in the main text.
const verses = new Set()
const empty = new Set()
{
  let b = -1
  let last = ''
  for (const line of readFileSync(join(ROOT, 'sources/bsb/bsb.txt'), 'utf8').replace(/^﻿/, '').split(/\r?\n/)) {
    const m = /^(.+) (\d+):(\d+)\t/.exec(line)
    if (!m) continue
    if (m[1] !== last) {
      last = m[1]
      b++
    }
    verses.add(`${books[b].id}:${m[2]}:${m[3]}`)
    if (!line.split('\t')[1]?.trim()) empty.add(`${books[b].id}:${m[2]}:${m[3]}`)
  }
}

const problems = []
/** Ends on a verse that is not in the main text. Not a failure; on the Not verified list. */
const noText = []
const byId = new Map()
const inFile = new Map()
for (const book of books) {
  const data = JSON.parse(readFileSync(join(ROOT, 'public/data/links', `${book.id}.json`), 'utf8'))
  if (data.id !== book.id) problems.push(`${book.id}.json: id ${data.id}`)
  for (const l of data.links) {
    if (!inFile.has(l.id)) inFile.set(l.id, new Set())
    inFile.get(l.id).add(book.id)
    const old = byId.get(l.id)
    if (old && JSON.stringify(old) !== JSON.stringify(l)) problems.push(`${l.id}: differs between files`)
    byId.set(l.id, l)
  }
}

const start = (p) => `${p.book}:${p.c}:${p.v}`
const pairs = new Map()
const counts = {}
for (const l of byId.values()) {
  const name = `${l.id} (${start(l.a)} - ${start(l.b)})`
  counts[`${l.type} from ${l.source}`] = (counts[`${l.type} from ${l.source}`] ?? 0) + 1
  for (const p of [l.a, l.b]) {
    if (!verses.has(start(p))) problems.push(`${name}: the end ${start(p)} is not in the Bible text`)
    if (p.v2 !== undefined && !verses.has(`${p.book}:${p.c2 ?? p.c}:${p.v2}`)) problems.push(`${name}: the end of the range at ${start(p)} is not in the Bible text`)
  }
  for (const p of [l.a, l.b]) if (empty.has(start(p))) noText.push(`${name}: the end ${start(p)} is a verse that is not in the main text`)
  if (start(l.a) === start(l.b)) problems.push(`${name}: a link to itself`)
  const k = [start(l.a), start(l.b)].sort().join('|')
  if (pairs.has(k)) problems.push(`${name}: the same pair as ${pairs.get(k)}`)
  pairs.set(k, l.id)
  if (l.type !== 'quotation' && l.type !== 'echo') problems.push(`${name}: no type`)
  if (!(l.source in SOURCES)) problems.push(`${name}: the source "${l.source}" is not approved`)
  else if (!SOURCES[l.source].includes(l.type)) problems.push(`${name}: a ${l.type} link from ${l.source}`)
  if (l.source === 'Bible Quotation Database') {
    const fit = fits[`${l.a.book}.${l.a.c}.${l.a.v}|${l.b.book}.${l.b.c}.${l.b.v}`]?.fit
    if (!fit) problems.push(`${name}: no fit in content/quotation-reasons.json`)
    else if ((fit === 'quote') !== (l.type === 'quotation')) problems.push(`${name}: the fit "${fit}" with a ${l.type} link`)
  }
  if (l.type === 'quotation' && !l.reason) problems.push(`${name}: a quotation link with no reason line`)
  if (l.type === 'echo' && l.reason) problems.push(`${name}: an echo link with a reason line`)
  for (const p of [l.a, l.b]) if (!inFile.get(l.id).has(p.book)) problems.push(`${name}: not in ${p.book}.json`)
}

// No echo link overlaps a quotation link at its two ends.
const pos = (c, v) => c * 1000 + v
const meets = (p, q) => p.book === q.book && pos(p.c, p.v) <= pos(q.c2 ?? q.c, q.v2 ?? q.v) && pos(q.c, q.v) <= pos(p.c2 ?? p.c, p.v2 ?? p.v)
const quotations = [...byId.values()].filter((l) => l.type === 'quotation')
for (const l of byId.values()) {
  if (l.type !== 'echo') continue
  const q = quotations.find((q) => (meets(l.a, q.a) && meets(l.b, q.b)) || (meets(l.a, q.b) && meets(l.b, q.a)))
  if (q) problems.push(`${l.id}: an echo link that overlaps the quotation link ${q.id} at its two ends`)
}

const summary = { links: byId.size, counts, problems: problems.length, first: problems.slice(0, 20), endsWithNoText: noText }
console.log(JSON.stringify(summary, null, 1))
process.exit(problems.length ? 1 : 0)
