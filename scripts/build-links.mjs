// Builds public/data/links/<id>.json, one file for each book: the links of the book and the read-with lists.
// docs/DESIGN.md section 4.5, docs/TASKS.md Task 7 steps 2 and 2b.
//
// Links come only from the three approved sources. No person and no agent adds a link by hand.
// 1. Bible Quotation Database (sources/quotations/quotations_range.csv): a quotation link if the fit is
//    "quote", an echo link if the fit is "close" or "weak" (the fit rule, Task 7b).
// 2. Cross-reference lines of the Berean Standard Bible files (public/data/text/*.json, field xrefs):
//    echo links, on their section heading.
// 3. OpenBible.info cross-references (sources/openbible/cross_references.txt): echo links, with the
//    limit that Arthur approved on 2026-11-14, and the read-with lists.
// If two sources give the same pair of passages, the site keeps one link: a link of the Bible Quotation
// Database first, then a cross-reference line of the Berean files, then an OpenBible.info link.
// An echo link that overlaps a quotation link at its two ends is hidden.
// The fit and the reason line of each link of the Bible Quotation Database are in
// content/quotation-reasons.json. Only quotation links take their reason line into public/.
//
// It also builds public/data/quotation-pairs.json: the number of quotation links for each pair of books, for
// the arcs of the timeline (docs/DESIGN.md section 4.6, docs/TASKS.md Task 8 step 6).
//
// Usage: node scripts/build-links.mjs [--report]

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { USFM, readWithLists, readOpenBible } from './links-common.mjs'

const ROOT = join(import.meta.dirname, '..')
const OUT = join(ROOT, 'public', 'data', 'links')
const books = JSON.parse(readFileSync(join(ROOT, 'public/data/books.json'), 'utf8'))

/** The approved limit for OpenBible.info marks. docs/DESIGN.md section 4.5. */
export const LIMIT = { minVotes: 20, versesPerMark: 5, minMarks: 2, linksPerVerse: 2 }

// ---- Verses of the Bible text ----
const verses = new Set()
const chapterVerses = new Map()
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
    verses.add(`${b}:${m[2]}:${m[3]}`)
    chapterVerses.set(`${b}:${m[2]}`, (chapterVerses.get(`${b}:${m[2]}`) ?? 0) + 1)
  }
}
const has = (p) => verses.has(`${p.b}:${p.c}:${p.v}`)
const startKey = (p) => `${p.b}:${p.c}:${p.v}`
const pairKey = (p, q) => {
  const a = startKey(p)
  const b = startKey(q)
  return a < b ? `${a}|${b}` : `${b}|${a}`
}
/** A passage for the JSON files: book id, chapter, verse, and an end if it is a range. */
const out = (p) => {
  const o = { book: books[p.b].id, c: p.c, v: p.v }
  if (p.c2 !== undefined && (p.c2 !== p.c || p.v2 !== p.v)) {
    if (p.c2 !== p.c) o.c2 = p.c2
    o.v2 = p.v2
  }
  if (p.heading) o.heading = p.heading
  return o
}
const label = (p) => `${books[p.b].name} ${p.c}:${p.v}${p.v2 && (p.c2 !== p.c || p.v2 !== p.v) ? '-' + (p.c2 !== p.c ? p.c2 + ':' : '') + p.v2 : ''}`

const notVerified = []
const links = []
const taken = new Set()

// ---- 1. Bible Quotation Database: quotation links ----
const nameIndex = new Map(books.map((b, i) => [b.name.toLowerCase(), i]))
nameIndex.set('psalm', books.findIndex((b) => b.id === 'psalms'))
const parseName = (s) => {
  const m = /^(.+?) (\d+):(\d+)(?:-(?:(\d+):)?(\d+))?$/.exec(s.trim())
  if (!m) return null
  const b = nameIndex.get(m[1].toLowerCase())
  if (b === undefined) return null
  const p = { b, c: +m[2], v: +m[3] }
  if (m[5]) {
    p.c2 = m[4] ? +m[4] : p.c
    p.v2 = +m[5]
  }
  return p
}
const reasons = JSON.parse(readFileSync(join(ROOT, 'content/quotation-reasons.json'), 'utf8'))
const quotes = new Map()
for (const line of readFileSync(join(ROOT, 'sources/quotations/quotations_range.csv'), 'utf8').split(/\r?\n/).slice(1)) {
  if (!line.trim()) continue
  const [nt, ot, upstream] = line.split(',')
  const a = parseName(nt)
  const b = parseName(ot)
  if (!a || !b || !has(a) || !has(b)) throw new Error(`quotation row: ${line}`)
  const k = pairKey(a, b)
  const old = quotes.get(k)
  if (old) {
    old.upstream.add(upstream)
    // Two rows for the same pair: keep the longer passage at each end.
    for (const [x, y] of [['a', a], ['b', b]]) {
      const e = old[x]
      const end = (p) => [p.c2 ?? p.c, p.v2 ?? p.v]
      const [c1, v1] = end(e)
      const [c2, v2] = end(y)
      if (c2 > c1 || (c2 === c1 && v2 > v1)) {
        e.c2 = c2
        e.v2 = v2
      }
    }
  } else quotes.set(k, { a, b, upstream: new Set([upstream]) })
}
/** The key of a quotation link in content/quotation-reasons.json: the quoting verse, then the quoted verse. */
export const reasonKey = (a, b) => `${books[a.b].id}.${a.c}.${a.v}|${books[b.b].id}.${b.c}.${b.v}`
// The fit rule (Arthur, 2026-11-14): a link with the fit "quote" is a quotation link, with a reason line.
// A link with the fit "close" or "weak" is an echo link, with no reason line. No link is removed.
// The reason lines of the echo links stay in content/quotation-reasons.json, outside public/.
let missingReasons = 0
for (const [k, q] of quotes) {
  const key = reasonKey(q.a, q.b)
  const entry = reasons[key]
  if (!entry?.reason || !['quote', 'close', 'weak'].includes(entry.fit)) missingReasons++
  const upstream = [...q.upstream].sort()
  if (entry?.fit === 'quote') links.push({ type: 'quotation', source: 'Bible Quotation Database', upstream, a: q.a, b: q.b, reason: entry.reason, key })
  else links.push({ type: 'echo', source: 'Bible Quotation Database', upstream, a: q.a, b: q.b, key })
  taken.add(k)
}

// An echo link that overlaps a quotation link at its two ends is hidden: the site shows only the quotation link.
// docs/DESIGN.md section 4.5.
const pos = (c, v) => c * 1000 + v
const span = (p) => [p.b, pos(p.c, p.v), pos(p.c2 ?? p.c, p.v2 ?? p.v)]
const meets = (p, q) => {
  const [b1, s1, e1] = span(p)
  const [b2, s2, e2] = span(q)
  return b1 === b2 && s1 <= e2 && s2 <= e1
}
const quotationLinks = links.filter((l) => l.type === 'quotation')
const overlapOf = (l) => quotationLinks.find((q) => (meets(l.a, q.a) && meets(l.b, q.b)) || (meets(l.a, q.b) && meets(l.b, q.a)))
const hidden = []
const hide = (l) => {
  const q = overlapOf(l)
  if (q) hidden.push({ source: l.source, link: `${label(l.a)} - ${label(l.b)}`, quotation: `${label(q.a)} - ${label(q.b)}` })
  return !!q
}
for (let i = links.length - 1; i >= 0; i--) if (links[i].type === 'echo' && hide(links[i])) links.splice(i, 1)

// ---- 2. Cross-reference lines of the Berean Standard Bible files: echo links on the section heading ----
const parseUsfm = (s, display) => {
  let m = /^(\w{3}) (\d+)(?::(\d+))?(?:-(?:(\d+):)?(\d+))?$/.exec(s.trim())
  if (m && USFM.includes(m[1])) {
    const b = USFM.indexOf(m[1])
    // A book with one chapter is cited by verse alone, for example "JUD 24-25".
    if (!m[3] && books[b].chapters === 1) return { b, c: 1, v: +m[2], ...(m[5] ? { c2: 1, v2: +m[5] } : {}) }
    if (!m[3]) return { b, c: +m[2], v: 1, wholeChapter: true }
    const p = { b, c: +m[2], v: +m[3] }
    if (m[5]) {
      p.c2 = m[4] ? +m[4] : p.c
      p.v2 = +m[5]
    }
    return p
  }
  // A line that names whole chapters or books links to the start of the first chapter (Arthur, 2026-11-14).
  m = /^(\d?\s?[A-Za-z ]+?)(?: (\d+))?(?:[–-].*)?$/.exec(display.trim())
  if (m) {
    const b = nameIndex.get(m[1].trim().toLowerCase())
    if (b !== undefined) return { b, c: m[2] ? +m[2] : 1, v: 1, wholeChapter: true }
  }
  return null
}
let bsbLines = 0
let bsbRefs = 0
const bsbLinks = new Map()
books.forEach((bk, b) => {
  const data = JSON.parse(readFileSync(join(ROOT, 'public/data/text', `${bk.id}.json`), 'utf8'))
  for (const ch of data.chapters) {
    // The section heading that stands before each verse.
    const headingOf = new Map()
    let heading = null
    for (const block of ch.blocks) {
      // Each cross-reference line of the USFM files stands under a main section heading (s1), so the mark goes there.
      if (block.k === 'h' && block.s === 's1') heading = block.t
      if (block.k === 'p') for (const it of block.c) if (typeof it === 'object' && 'v' in it && !headingOf.has(it.v)) headingOf.set(it.v, heading)
    }
    for (const x of ch.xrefs) {
      bsbLines++
      // The shown text of each reference, in the order of x.refs.
      const shown = x.t.replace(/^\(|\)$/g, '').split(';').map((s) => s.trim())
      x.refs.forEach((r, i) => {
        bsbRefs++
        const to = parseUsfm(r, shown[i] ?? r)
        const at = { b, c: ch.n, v: x.v, heading: headingOf.get(x.v) ?? undefined }
        if (!to || !has(to)) {
          notVerified.push(`${bk.name} ${ch.n}, the line ${x.t} under "${at.heading}": the target of "${shown[i] ?? r}" in the USFM file is "${r}", with no book code, so it has no link (Arthur, 2026-11-14). The line of Song of Solomon 1 links the same two passages from the other end.`)
          return
        }
        const k = pairKey(at, to)
        if (taken.has(k)) return
        const old = bsbLinks.get(k)
        if (old) {
          // The same two passages from both headings: one link, with a mark on each heading.
          if (startKey(old.b) === startKey(at) && !old.b.heading) old.b.heading = at.heading
          return
        }
        bsbLinks.set(k, { type: 'echo', source: 'Berean Standard Bible', a: at, b: to })
      })
    }
  }
})
for (const [k, l] of bsbLinks) {
  taken.add(k)
  if (!hide(l)) links.push(l)
}

// ---- 3. OpenBible.info: echo links with the approved limit ----
const ob = readOpenBible(ROOT, verses)
const capOf = (ck) => Math.max(LIMIT.minMarks, Math.ceil(chapterVerses.get(ck) / LIMIT.versesPerMark))
const verseLinks = new Map()
const chapterMarks = new Map()
let echoKept = 0
for (const l of [...ob.links.values()].sort((x, y) => y.votes - x.votes || (x.k < y.k ? -1 : 1))) {
  if (l.votes < LIMIT.minVotes) break
  if (taken.has(l.k)) continue
  // A hidden link does not take a place in the limit.
  if (hide({ source: 'OpenBible.info', a: l.a, b: l.b })) {
    taken.add(l.k)
    continue
  }
  const ends = [
    [startKey(l.a), `${l.a.b}:${l.a.c}`],
    [startKey(l.b), `${l.b.b}:${l.b.c}`],
  ]
  const ok =
    ends.every(([vk]) => (verseLinks.get(vk) ?? 0) < LIMIT.linksPerVerse) &&
    ends.every(([, ck]) => {
      const marks = chapterMarks.get(ck) ?? new Set()
      const fresh = new Set(ends.filter(([vk, c]) => c === ck && !marks.has(vk)).map(([vk]) => vk))
      return marks.size + fresh.size <= capOf(ck)
    })
  if (!ok) continue
  for (const [vk, ck] of ends) {
    verseLinks.set(vk, (verseLinks.get(vk) ?? 0) + 1)
    if (!chapterMarks.has(ck)) chapterMarks.set(ck, new Set())
    chapterMarks.get(ck).add(vk)
  }
  links.push({ type: 'echo', source: 'OpenBible.info', votes: l.votes, a: l.a, b: l.b })
  taken.add(l.k)
  echoKept++
}

// ---- Read-with lists ----
const readWith = readWithLists(ob.links)

// ---- Write one file for each book ----
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
links.forEach((l, i) => {
  // q: quotation link. e: echo link of the Bible Quotation Database. h: Berean heading link. o: OpenBible.info.
  const prefix = { 'Bible Quotation Database': l.type === 'quotation' ? 'q' : 'e', 'Berean Standard Bible': 'h', 'OpenBible.info': 'o' }
  l.id = `${prefix[l.source]}${i + 1}`
})
books.forEach((bk, b) => {
  const mine = links
    .filter((l) => l.a.b === b || l.b.b === b)
    .map((l) => {
      const o = { id: l.id, type: l.type, source: l.source, a: out(l.a), b: out(l.b) }
      if (l.upstream) o.upstream = l.upstream
      if (l.votes !== undefined) o.votes = l.votes
      if (l.reason) o.reason = l.reason
      return o
    })
  const rw = {}
  for (let c = 1; c <= bk.chapters; c++) {
    const list = readWith.get(`${b}:${c}`)
    if (list?.length) rw[c] = list.map((e) => ({ book: books[e.b].id, c: e.c }))
  }
  writeFileSync(join(OUT, `${bk.id}.json`), JSON.stringify({ id: bk.id, links: mine, readWith: rw }))
})

// ---- The quotation links between two books, for the arcs of the timeline ----
// from: the book that quotes. to: the book that is quoted. n: the number of quotation links.
const pairCounts = new Map()
for (const l of links) {
  if (l.type !== 'quotation' || l.a.b === l.b.b) continue
  const k = `${l.a.b}|${l.b.b}`
  pairCounts.set(k, (pairCounts.get(k) ?? 0) + 1)
}
const pairs = [...pairCounts]
  .map(([k, n]) => {
    const [a, b] = k.split('|').map(Number)
    return { a, b, n }
  })
  .sort((x, y) => x.a - y.a || x.b - y.b)
  .map(({ a, b, n }) => ({ from: books[a].id, to: books[b].id, n }))
writeFileSync(join(ROOT, 'public', 'data', 'quotation-pairs.json'), '[\n' + pairs.map((p) => ' ' + JSON.stringify(p)).join(',\n') + '\n]\n')

const count = (f) => links.filter(f).length
const hiddenCount = (s) => hidden.filter((h) => h.source === s).length
const summary = {
  quotation: count((l) => l.type === 'quotation'),
  echoQuotationDatabase: count((l) => l.type === 'echo' && l.source === 'Bible Quotation Database'),
  echoBsb: count((l) => l.source === 'Berean Standard Bible'),
  echoOpenBible: echoKept,
  hiddenOverlaps: {
    'Bible Quotation Database': hiddenCount('Bible Quotation Database'),
    'Berean Standard Bible': hiddenCount('Berean Standard Bible'),
    'OpenBible.info': hiddenCount('OpenBible.info'),
  },
  bsbLines,
  bsbRefs,
  openBibleLinks: ob.links.size,
  openBibleLeftOut: ob.leftOut,
  chaptersWithReadWith: readWith.size,
  chaptersWithoutReadWith: [...chapterVerses.keys()].filter((k) => !readWith.has(k)).length,
  missingReasons,
  notVerified,
  hidden,
}
writeFileSync(join(ROOT, 'content', 'links-summary.json'), JSON.stringify(summary, null, 1) + '\n')
console.log(JSON.stringify({ ...summary, notVerified: notVerified.length, openBibleLeftOut: ob.leftOut.length, hidden: hidden.length }, null, 1))
if (process.argv.includes('--report')) {
  for (const n of notVerified) console.log('not verified:', n)
  for (const r of ob.leftOut) console.log('left out:', r)
}
export { label }
