// Builds public/data/text-kjv/<id>.json, one file for each book, from the King James Version.
// docs/TASKS.md Task 20, docs/DESIGN.md section 8.
//
// The words come from the USFM files of eBible.org in sources/kjv/usfm/: the standardized text of
// 1769 (edition A of docs/reviews/task-19-kjv-report.md). The structure of each chapter comes from the
// Berean data in public/data/text/<id>.json: the headings, the cross-reference lines, the text blocks
// and their styles, and the blank lines. Arthur's rule of 2026-11-15: a translation changes only the
// words. A text block of the King James Version holds the verses that start in its Berean block. The
// words of a verse are never cut. The one change to the words of the source: the 13 split words of
// docs/DESIGN.md section 8.2, joined by Task 20b (SPLIT below).
// Since Task 26, the marks of the words of Jesus (\wj) of the source go with the words, as items { j }, with
// one exception: Mark 12:37 (MARK_EXCEPTIONS below, docs/DESIGN.md section 11.3).
//
// The script stops with an error when a rule does not fit the data. It does not guess.
//
// Usage: node scripts/build-text-kjv.mjs

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const SRC = join(ROOT, 'sources', 'kjv', 'usfm')
const BSB = join(ROOT, 'public', 'data', 'text')
const OUT = join(ROOT, 'public', 'data', 'text-kjv')

const books = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'books.json'), 'utf8'))
if (books.length !== 66) throw new Error('expected 66 books in books.json')

const stats = {
  books: 0,
  chapters: 0,
  verses: 0,
  added: 0,
  versesWithAdded: 0,
  footnotes: 0,
  pilcrowVerses: 0,
  dBlocks: 0,
  headings: {},
  xrefs: 0,
  blocks: {},
  breaks: 0,
  bsbBlocksWithoutKjv: {},
  bsbDWithoutTitle: [],
  songHeadingsLeftOut: 0,
  addedWithSpaceAtEnd: [],
  titles: { footnotes: 0, pilcrowVerses: 0, added: 0, versesWithAdded: 0 },
  marks: 0,
  markedAdded: 0,
}
const add = (o, k, n = 1) => (o[k] = (o[k] ?? 0) + n)

// ---- USFM: the words ----

/** Markers of the book head. The site takes nothing from them. */
const HEAD = new Set(['id', 'h', 'toc1', 'toc2', 'toc3', 'mt1', 'mt2'])
/** Markers of the structure of the source. The site takes its structure from the Berean data. */
const STRUCTURE = new Set(['p', 'q1', 'b'])

/**
 * One USFM book: for each chapter, the raw text of each verse and of the \d line.
 * Returns Map chapter -> { verses: Map verse -> raw, title: raw | null }.
 */
function readUsfm(text, name) {
  const chapters = new Map()
  let ch = null
  let verse = 0
  let inTitle = false
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue
    const m = /^\\([a-z]+\d?)(?:\s+([\s\S]*))?$/.exec(line)
    if (!m) {
      // A line with no marker goes on with the verse or the title before it.
      if (inTitle) ch.title += ' ' + line
      else if (verse) ch.verses.set(verse, ch.verses.get(verse) + ' ' + line)
      else throw new Error(`${name}: text with no verse: ${line}`)
      continue
    }
    const [, marker, rest = ''] = m
    if (HEAD.has(marker)) continue
    if (marker === 'c') {
      const n = Number(rest)
      if (n !== chapters.size + 1) throw new Error(`${name}: chapter ${rest} out of order`)
      ch = { verses: new Map(), title: null }
      chapters.set(n, ch)
      verse = 0
      inTitle = false
      continue
    }
    if (!ch) throw new Error(`${name}: \\${marker} before the first chapter`)
    inTitle = false
    if (marker === 's1') continue // the letter headings of Psalm 119 and the lines at the end of 14 letters
    if (marker === 'd') {
      if (verse || ch.title !== null) throw new Error(`${name} ${chapters.size}: \\d after a verse or a second \\d`)
      ch.title = rest
      inTitle = true
      continue
    }
    if (STRUCTURE.has(marker)) {
      if (rest.trim()) {
        if (!verse) throw new Error(`${name} ${chapters.size}: text before the first verse: ${rest}`)
        ch.verses.set(verse, ch.verses.get(verse) + ' ' + rest)
      }
      continue
    }
    if (marker === 'v') {
      const vm = /^(\d+)\s([\s\S]*)$/.exec(rest)
      if (!vm) throw new Error(`${name} ${chapters.size}: verse marker: ${line}`)
      const n = Number(vm[1])
      if (n !== verse + 1) throw new Error(`${name} ${chapters.size}:${n} out of order`)
      if (/\\v /.test(vm[2])) throw new Error(`${name} ${chapters.size}:${n}: two verses on one line`)
      verse = n
      ch.verses.set(n, vm[2])
      continue
    }
    throw new Error(`${name} ${chapters.size}: unknown marker \\${marker}`)
  }
  return chapters
}

/**
 * The inline items of a verse or a title: strings, and { a } for the added words.
 * Removes the Strong's numbers, the footnotes, the paragraph signs, and the markers of the words of
 * Jesus and of the name LORD. Changes no word.
 */
function items(raw, where, count = true) {
  let s = raw
  const notes = (s.match(/\\f [\s\S]*?\\f\*/g) ?? []).length
  s = s.replace(/\\f [\s\S]*?\\f\*/g, '')
  const pilcrow = s.includes('¶')
  s = s.replace(/¶ ?/g, '')
  s = s.replace(/\\(\+?)w ([^|\\]*)\|strong="[^"]*"\\\1w\*/g, '$2')
  s = s.replace(/\\\+?(wj|nd)\*/g, '').replace(/\\\+?(wj|nd) /g, '')
  // The added words. \add and \+add, with no other marker inside.
  const out = []
  const re = /\\(\+?)add ([^\\]*)\\\1add\*/g
  let last = 0
  const pushText = (t) => {
    if (!t) return
    if (typeof out.at(-1) === 'string') out[out.length - 1] += t
    else out.push(t)
  }
  for (const m of s.matchAll(re)) {
    pushText(s.slice(last, m.index))
    if (!m[2].trim()) throw new Error(`${where}: added words with no words`)
    // A space at an end of the added words, as in "\add  \+w which…" in Exodus 15:13, is a space
    // between two words. It goes outside the item.
    const lead = /^\s*/.exec(m[2])[0]
    const trail = /\s*$/.exec(m[2])[0]
    if (lead || trail) stats.addedWithSpaceAtEnd.push(where)
    pushText(lead)
    out.push({ a: m[2].trim().replace(/\s+/g, ' ') })
    pushText(trail)
    last = m.index + m[0].length
  }
  pushText(s.slice(last))
  // Spaces: one space between two words. No space at the start or the end of the verse.
  const clean = []
  for (const x of out) {
    if (typeof x === 'string') {
      const t = x.replace(/\s+/g, ' ')
      if (t) clean.push(t)
    } else clean.push(x)
  }
  if (typeof clean[0] === 'string') clean[0] = clean[0].replace(/^ /, '')
  if (typeof clean.at(-1) === 'string') clean[clean.length - 1] = clean.at(-1).replace(/ $/, '')
  const result = clean.filter((x) => x !== '')
  for (const x of result) {
    const t = typeof x === 'string' ? x : x.a
    if (/[\\|¶]/.test(t)) throw new Error(`${where}: marker left: ${t}`)
    if (/ {2}/.test(t)) throw new Error(`${where}: two spaces: ${t}`)
  }
  if (!result.length) throw new Error(`${where}: no words`)
  // The counts of the verses and of the Psalm titles are apart, as in the report of Task 19.
  const t = count ? stats : stats.titles
  t.footnotes += notes
  if (pilcrow) t.pilcrowVerses++
  const a = result.filter((x) => typeof x !== 'string').length
  t.added += a
  if (a) t.versesWithAdded++
  return result
}

const usfmByCode = new Map()
for (const f of readdirSync(SRC).filter((x) => x.endsWith('.usfm'))) {
  const t = readFileSync(join(SRC, f), 'utf8').replace(/^﻿/, '')
  usfmByCode.set(/^\\id (\S+)/.exec(t)[1], { name: /^\\h (.+)$/m.exec(t)[1].trim(), text: t })
}
if (usfmByCode.size !== 66) throw new Error(`expected 66 USFM files, found ${usfmByCode.size}`)

// The 66 USFM book codes in the order of books.json. The script checks the book name of each file.
const CODES = ('GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM ' +
  'EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH ' +
  '1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV').split(' ')

// ---- the 13 split words: docs/DESIGN.md section 8.2, docs/TASKS.md Task 20b ----

/**
 * The verses where the source has a word in two parts and the site joins it. Arthur's decision of
 * 2026-11-15. Each joined word is the word of edition B, the Cambridge Paragraph Bible of eBible.org
 * (docs/DATA-SOURCES.md section 9). The script removes one space and changes nothing else.
 * [book id, chapter, verse, the two words of the source, the joined word]
 */
const SPLIT = [
  ['acts', 4, 16, 'can not', 'cannot'],
  ['acts', 4, 20, 'can not', 'cannot'],
  ['acts', 5, 39, 'can not', 'cannot'],
  ['colossians', 3, 17, 'what soever', 'whatsoever'],
  ['colossians', 3, 23, 'what soever', 'whatsoever'],
  ['1-timothy', 2, 7, 'Where unto', 'Whereunto'],
  ['1-timothy', 5, 25, 'can not', 'cannot'],
  ['1-timothy', 6, 12, 'where unto', 'whereunto'],
  ['2-timothy', 1, 11, 'Where unto', 'Whereunto'],
  ['2-timothy', 2, 9, 'Where in', 'Wherein'],
  ['2-timothy', 2, 13, 'can not', 'cannot'],
  ['hebrews', 6, 17, 'Where in', 'Wherein'],
  ['hebrews', 9, 5, 'can not', 'cannot'],
]
const splitByPlace = new Map()
for (const [id, c, v, two, one] of SPLIT) {
  const book = books.find((b) => b.id === id)
  if (!book) throw new Error(`split word: no book ${id}`)
  if (two.replace(' ', '') !== one || two.split(' ').length !== 2) throw new Error(`split word: "${two}" and "${one}" differ by more than one space`)
  splitByPlace.set(`${book.name} ${c}:${v}`, { two, one, done: false })
}
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Joins the split word of a verse in the list. The two words must be in the verse exactly once, and in
 * one string, not across added words.
 */
function joinSplit(list, where) {
  const split = splitByPlace.get(where)
  if (!split) return list
  const re = new RegExp(`\\b${escape(split.two)}\\b`, 'g')
  const all = list.map((x) => (typeof x === 'string' ? x : x.a)).join('')
  const inVerse = (all.match(re) ?? []).length
  const inStrings = list.filter((x) => typeof x === 'string').reduce((n, x) => n + (x.match(re) ?? []).length, 0)
  if (inVerse !== 1 || inStrings !== 1) throw new Error(`${where}: "${split.two}" is ${inVerse} times in the verse and ${inStrings} times in one string; expected 1 and 1`)
  split.done = true
  return list.map((x) => (typeof x === 'string' ? x.replace(re, split.one) : x))
}

// ---- the marks of the words of Jesus: docs/DESIGN.md section 11, docs/TASKS.md Task 26 ----

/**
 * The marks where the site marks fewer words than the source. Arthur's decision of 2026-11-16, docs/DESIGN.md
 * section 11.3. The source file does not change.
 * [book id, chapter, verse, the words of the mark in the source, the words that the site marks]
 */
const MARK_EXCEPTIONS = [
  [
    'mark', 12, 37,
    'David therefore himself calleth him Lord; and whence is he then his son? And the common people heard him gladly.',
    'David therefore himself calleth him Lord; and whence is he then his son?',
  ],
]
const exceptionByPlace = new Map()
for (const [id, c, v, source, site] of MARK_EXCEPTIONS) {
  const book = books.find((b) => b.id === id)
  if (!book) throw new Error(`mark exception: no book ${id}`)
  if (!source.startsWith(site) || site === source) throw new Error(`mark exception ${id} ${c}:${v}: the words of the site are not the start of the words of the source`)
  exceptionByPlace.set(`${book.name} ${c}:${v}`, { source, site, done: false })
}

/** The plain words of a part of a verse: the method of items(), as one string with single spaces. */
function plainWords(raw) {
  return raw
    .replace(/\\f [\s\S]*?\\f\*/g, '')
    .replace(/¶ ?/g, '')
    .replace(/\\(\+?)w ([^|\\]*)\|strong="[^"]*"\\\1w\*/g, '$2')
    .replace(/\\\+?(wj|nd)\*/g, '')
    .replace(/\\\+?(wj|nd) /g, '')
    .replace(/\\(\+?)add ([^\\]*)\\\1add\*/g, '$2')
    .replace(/\s+/g, ' ')
    .trim()
}

/** The words of each mark of a verse, in order. A mark of the King James Version files ends in its verse. */
function markWords(raw, where) {
  const out = []
  let open = -1
  for (const m of raw.matchAll(/\\\+?wj(\*?)/g)) {
    if (!m[1]) {
      if (open >= 0) throw new Error(`${where}: a start marker \\wj inside an open mark`)
      open = m.index + m[0].length
    } else {
      if (open < 0) throw new Error(`${where}: an end marker \\wj* with no start marker`)
      const words = plainWords(raw.slice(open, m.index))
      if (/[\\|]/.test(words)) throw new Error(`${where}: marker left in a mark: ${words}`)
      if (!words) throw new Error(`${where}: a mark with no words`)
      out.push(words)
      open = -1
    }
  }
  if (open >= 0) throw new Error(`${where}: a mark is open at the end of the verse`)
  return out
}

/** The text with each run of spaces as one space, and the position in the text of each character. */
function squashMap(text) {
  let s = ''
  const pos = []
  for (let i = 0; i < text.length; i++) {
    if (/\s/.test(text[i])) {
      if (s.endsWith(' ')) continue
      s += ' '
    } else s += text[i]
    pos.push(i)
  }
  return { s, pos }
}

/**
 * The places of the marks of one verse in its words, in their order: [start, end). Each mark must be in the
 * words exactly. Stops with an error when a mark has no place, or when more than one choice of places fits
 * the order of the marks.
 */
function placeMarks(where, text, list) {
  const sq = squashMap(text)
  const options = list.map((words) => {
    const o = []
    for (let i = sq.s.indexOf(words); i >= 0; i = sq.s.indexOf(words, i + 1)) o.push({ start: sq.pos[i], end: sq.pos[i + words.length - 1] + 1 })
    if (!o.length) throw new Error(`${where}: the words of a mark are not in the verse exactly: ${words}`)
    return o
  })
  const memo = new Map()
  const count = (i, from) => {
    if (i === list.length) return 1
    const k = `${i} ${from}`
    if (memo.has(k)) return memo.get(k)
    let n = 0
    for (const p of options[i]) if (p.start >= from && n < 2) n += count(i + 1, p.end)
    n = Math.min(n, 2)
    memo.set(k, n)
    return n
  }
  const n = count(0, 0)
  if (n === 0) throw new Error(`${where}: the marks of the verse do not fit the verse in their order`)
  if (n > 1) throw new Error(`${where}: a mark is at more than one place, and the order of the marks does not decide`)
  const chosen = []
  let from = 0
  for (let i = 0; i < list.length; i++) {
    const p = options[i].find((x) => x.start >= from && count(i + 1, x.end) === 1)
    chosen.push([p.start, p.end])
    from = p.end
  }
  return chosen
}

/**
 * The inline items of a verse with the marks of the source in Form A of docs/DESIGN.md section 11.7: a run of
 * marked words is { j: "words" }, and added words in a mark get "j": 1. The words do not change.
 */
function withMarks(list, raw, where) {
  let words = markWords(raw, where)
  const exception = exceptionByPlace.get(where)
  if (exception) {
    const hits = words.filter((w) => w.split(exception.source).length === 2)
    if (hits.length !== 1 || words.join('\n').split(exception.source).length !== 2) throw new Error(`${where}: the words of the mark exception are not in a mark exactly once`)
    words = words.map((w) => (w === hits[0] ? w.replace(exception.source, exception.site) : w))
    exception.done = true
  }
  if (!words.length) return list
  const text = list.map((x) => (typeof x === 'string' ? x : x.a)).join('')
  const ranges = placeMarks(where, text, words)
  stats.marks += words.length
  const out = []
  let at = 0
  for (const x of list) {
    const t = typeof x === 'string' ? x : x.a
    const start = at
    at += t.length
    const rs = ranges.filter(([s, e]) => s < at && e > start)
    if (typeof x !== 'string') {
      if (!rs.length) out.push(x)
      else if (rs[0][0] <= start && rs[0][1] >= at) {
        out.push({ ...x, j: 1 })
        stats.markedAdded++
      } else throw new Error(`${where}: a mark starts or ends inside added words`)
      continue
    }
    let from = 0
    for (const [s, e] of rs) {
      const a = Math.max(0, s - start)
      const b = Math.min(t.length, e - start)
      if (a > from) out.push(x.slice(from, a))
      out.push({ j: x.slice(a, b) })
      from = b
    }
    if (from < t.length) out.push(x.slice(from))
  }
  return out
}

// ---- the structure, from the Berean data ----

/** Appends verse items to a block: { v: n }, then the words. Adjacent strings join. */
function pushItems(c, list) {
  for (const x of list) {
    if (typeof x === 'string' && typeof c.at(-1) === 'string') c[c.length - 1] += x
    else c.push(x)
  }
}

function buildChapter(where, bsbCh, src, isSong) {
  const blocks = []
  const placed = new Set()
  const bsbBlocks = bsbCh.blocks
  // Verse 1 goes after the title: the block after the d block holds it, with no { v: 1 }.
  let carryVerse1 = false
  const hasD = bsbBlocks.some((b) => b.k === 'p' && b.s === 'd')
  if (src.title !== null && !hasD) throw new Error(`${where}: the source has a \\d line and the Berean chapter has no d block`)
  if (hasD && src.title === null) stats.bsbDWithoutTitle.push(where)

  const verseItems = (n) => {
    if (!src.verses.has(n)) throw new Error(`${where}:${n}: the source has no such verse`)
    if (placed.has(n)) throw new Error(`${where}:${n}: verse placed twice`)
    placed.add(n)
    const raw = src.verses.get(n)
    return withMarks(joinSplit(items(raw, `${where}:${n}`), `${where}:${n}`), raw, `${where}:${n}`)
  }

  for (const b of bsbBlocks) {
    if (b.k === 'h') {
      if (isSong && b.s === 's2') {
        stats.songHeadingsLeftOut++
        continue
      }
      blocks.push({ ...b })
      continue
    }
    if (b.k === 'n') continue // no notes on the King James Version pages
    if (b.k === 'b') {
      blocks.push({ k: 'b' })
      continue
    }
    if (b.k !== 'p') throw new Error(`${where}: unknown block ${JSON.stringify(b)}`)
    // The verses that start in this Berean block.
    const starts = b.c.filter((x) => typeof x === 'object' && ('v' in x || 'o' in x)).map((x) => ('v' in x ? x.v : x.o))
    if (b.s === 'd') {
      if (src.title === null) {
        // No title in the source: no d block. Verse 1 goes in the next text block.
        if (starts.length !== 1 || starts[0] !== 1) throw new Error(`${where}: d block that holds ${starts.join(', ')}`)
        carryVerse1 = 'with-number'
        stats.bsbBlocksWithoutKjv.d = (stats.bsbBlocksWithoutKjv.d ?? 0) + 1
        continue
      }
      if (starts.length !== 1 || starts[0] !== 1) throw new Error(`${where}: d block that holds ${starts.join(', ')}`)
      const c = [{ v: 1 }]
      pushItems(c, items(src.title, `${where} title`, false))
      // The words of verse 1 go on in the next block. As in the Berean data, the title ends with a space.
      if (typeof c.at(-1) === 'string') c[c.length - 1] += ' '
      else c.push(' ')
      blocks.push({ k: 'p', s: 'd', c })
      stats.dBlocks++
      carryVerse1 = 'without-number'
      continue
    }
    const c = []
    if (carryVerse1) {
      if (carryVerse1 === 'with-number') c.push({ v: 1 })
      pushItems(c, verseItems(1))
      carryVerse1 = false
    }
    for (const n of starts) {
      c.push({ v: n })
      pushItems(c, verseItems(n))
    }
    if (!c.length) {
      add(stats.bsbBlocksWithoutKjv, b.s)
      continue
    }
    blocks.push({ k: 'p', s: b.s, c })
  }
  if (carryVerse1) throw new Error(`${where}: no text block after the d block`)
  for (const n of src.verses.keys()) if (!placed.has(n)) throw new Error(`${where}:${n}: verse of the source with no place in the Berean structure`)

  // Blank lines: one between two text blocks at most, and none after the last text block.
  const out = []
  for (const b of blocks) {
    if (b.k === 'b') {
      const prevText = [...out].reverse().find((x) => x.k === 'p' || x.k === 'b')
      if (prevText?.k === 'b') continue
    }
    out.push(b)
  }
  while (true) {
    const i = out.findLastIndex((x) => x.k === 'b')
    if (i < 0 || out.slice(i + 1).some((x) => x.k === 'p')) break
    out.splice(i, 1)
  }
  for (const b of out) {
    if (b.k === 'h') add(stats.headings, b.s)
    else if (b.k === 'p') add(stats.blocks, b.s)
    else if (b.k === 'b') stats.breaks++
  }
  stats.verses += placed.size
  stats.xrefs += bsbCh.xrefs.length
  return { n: bsbCh.n, blocks: out, xrefs: bsbCh.xrefs }
}

mkdirSync(OUT, { recursive: true })
books.forEach((book, i) => {
  const usfm = usfmByCode.get(CODES[i])
  if (!usfm) throw new Error(`no USFM file for ${CODES[i]}`)
  if (usfm.name !== book.name) throw new Error(`${CODES[i]}: the file names the book "${usfm.name}", books.json "${book.name}"`)
  const src = readUsfm(usfm.text, book.name)
  const bsb = JSON.parse(readFileSync(join(BSB, `${book.id}.json`), 'utf8'))
  if (src.size !== book.chapters || bsb.chapters.length !== book.chapters) throw new Error(`${book.id}: chapters ${src.size}, Berean ${bsb.chapters.length}, books.json ${book.chapters}`)
  const chapters = bsb.chapters.map((ch) => buildChapter(`${book.name} ${ch.n}`, ch, src.get(ch.n), book.id === 'song-of-solomon'))
  stats.books++
  stats.chapters += chapters.length
  writeFileSync(join(OUT, `${book.id}.json`), JSON.stringify({ id: book.id, name: book.name, translation: 'King James Version', chapters }))
})

for (const [where, split] of splitByPlace) if (!split.done) throw new Error(`${where}: split word "${split.two}" not joined`)
stats.splitWordsJoined = [...splitByPlace].map(([where, s]) => `${where}: ${s.two} -> ${s.one}`)
for (const [where, e] of exceptionByPlace) if (!e.done) throw new Error(`${where}: mark exception not used`)

console.log(JSON.stringify(stats, null, 1))
