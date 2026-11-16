// Builds public/data/text-web/<id>.json, one file for each book, from the World English Bible.
// docs/TASKS.md Task 30, docs/DESIGN.md section 13.
//
// The words come from the USFM files of eBible.org in sources/web/usfm/: the edition engwebp, with
// "LORD" and "GOD" for the name of God (edition A of docs/reviews/task-29-web-report.md). The structure of
// each chapter comes from the Berean data in public/data/text/<id>.json, by the method of
// scripts/build-text-kjv.mjs: a text block holds the verses that start in its Berean block, and the words of
// a verse are never cut. The site changes no word of this translation and no words-of-Jesus mark. It keeps
// the verse numbers of the source (docs/DESIGN.md section 13.3).
//
// The script stops with an error when a rule does not fit the data. It does not guess.
//
// Usage: node scripts/build-text-web.mjs

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const SRC = join(ROOT, 'sources', 'web', 'usfm')
const BSB = join(ROOT, 'public', 'data', 'text')
const OUT = join(ROOT, 'public', 'data', 'text-web')

const books = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'books.json'), 'utf8'))
if (books.length !== 66) throw new Error('expected 66 books in books.json')

const stats = {
  books: 0,
  chapters: 0,
  verses: 0,
  verseNumbersInSource: 0,
  footnotes: 0,
  xnotes: 0,
  titles: { footnotes: 0, xnotes: 0 },
  dBlocks: 0,
  dLinesNotUsed: 0,
  headings: {},
  xrefs: 0,
  blocks: {},
  breaks: 0,
  bsbBlocksWithoutWeb: {},
  bsbDWithoutTitle: [],
  songHeadingsLeftOut: 0,
  headingsWithNoVerseLeftOut: [],
  xrefsLeftOut: [],
  wjStartMarkers: 0,
  versesWithMarks: 0,
  jItems: 0,
  marksOverAVerseNumber: 0,
  marksPlacedWithSpacesIgnored: [],
  markerBeforeRomans14v24: null,
}
const add = (o, k, n = 1) => (o[k] = (o[k] ?? 0) + n)

// ---- the lists of section 13.3 of docs/DESIGN.md ----

/** The verse numbers with no words in the source: a footnote only. The data has no item for them. */
const EMPTY = ['Luke 17:36', 'Acts 8:37', 'Acts 15:34', 'Acts 24:7', 'Romans 16:25']
/** The verses that no Berean block starts. They go in one new text block after the last text block of the chapter. */
const NEW_BLOCK = ['Romans 14:24', 'Romans 14:25', 'Romans 14:26']
/** The verses that a Berean block starts and that the source does not have. The data has nothing for them. */
const NOT_IN_SOURCE = ['Romans 16:26', 'Romans 16:27']
/** The chapter whose \d lines are the names of the Hebrew letters. The site does not use them. */
const LETTER_NAMES_CHAPTER = 'Psalms 119'
/** The one heading with no verse after it in its chapter. It does not show, nor its cross-reference line. */
const HEADING_WITH_NO_VERSE = ['Romans 16', 'Doxology']

const used = { EMPTY: new Set(), NEW_BLOCK: new Set(), NOT_IN_SOURCE: new Set(), letterNames: false, heading: false }

// ---- USFM: the words ----

/** Lines that the site does not use: the book head, \cl, \ms1, and the speaker lines \sp. */
const SKIP = new Set(['id', 'ide', 'h', 'toc1', 'toc2', 'toc3', 'mt1', 'mt2', 'mt3', 'cl', 'ms1', 'sp'])
/** Markers of the structure of the source. The site takes its structure from the Berean data. */
const STRUCTURE = new Set(['p', 'm', 'mi', 'pi1', 'nb', 'q1', 'q2', 'li1', 'b'])

/**
 * One USFM book: for each chapter, the raw text of each verse, the \d line before verse 1, the \d lines after a
 * verse, and the marker of the line of each verse.
 */
function readUsfm(text, name) {
  const chapters = new Map()
  let ch = null
  let verse = 0
  let inTitle = false
  let lastMarker = null
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
    if (SKIP.has(marker)) {
      inTitle = false
      continue
    }
    if (marker === 'c') {
      const n = Number(rest)
      if (n !== chapters.size + 1) throw new Error(`${name}: chapter ${rest} out of order`)
      ch = { verses: new Map(), title: null, laterTitles: [], lineBefore: new Map() }
      chapters.set(n, ch)
      verse = 0
      inTitle = false
      continue
    }
    if (!ch) throw new Error(`${name}: \\${marker} before the first chapter`)
    inTitle = false
    if (marker === 'd') {
      if (verse) ch.laterTitles.push({ after: verse, raw: rest })
      else if (ch.title !== null) throw new Error(`${name} ${chapters.size}: a second \\d before verse 1`)
      else {
        ch.title = rest
        inTitle = true
      }
      continue
    }
    if (STRUCTURE.has(marker)) {
      lastMarker = marker
      if (rest.trim()) {
        if (!verse) throw new Error(`${name} ${chapters.size}: text before the first verse: ${rest}`)
        ch.verses.set(verse, ch.verses.get(verse) + ' ' + rest)
      }
      continue
    }
    if (marker === 'v') {
      const vm = /^(\d+)(?:\s([\s\S]*))?$/.exec(rest)
      if (!vm) throw new Error(`${name} ${chapters.size}: verse marker: ${line}`)
      const n = Number(vm[1])
      if (n !== verse + 1) throw new Error(`${name} ${chapters.size}:${n} out of order`)
      if (/\\v /.test(vm[2] ?? '')) throw new Error(`${name} ${chapters.size}:${n}: two verses on one line`)
      verse = n
      ch.verses.set(n, vm[2] ?? '')
      ch.lineBefore.set(n, lastMarker)
      lastMarker = 'v'
      continue
    }
    throw new Error(`${name} ${chapters.size}: unknown marker \\${marker}`)
  }
  return chapters
}

const FOOTNOTE = /\\f [\s\S]*?\\f\*/g
const XNOTE = /\\x [\s\S]*?\\x\*/g
const WORD = /\\(\+?)w ([^|\\]*)\|strong="[^"]*"\\\1w\*/g
// A run of spaces, tabs, and line breaks becomes one space. The no-break space U+00A0 is a character of the
// text: the source has three, in John 5:11, Acts 20:35, and Acts 22:21. The site keeps them.
const SPACES = /[ \t\r\n]+/g
const EDGES = /^ | $/g

/**
 * The plain text of a part of a verse: removes the footnotes, the cross-reference notes, the Strong's numbers,
 * and the markers of the words of Jesus, of Selah (\qs), and of a book name (\bk). Changes no word.
 * The runs of spaces stay. Stops with an error when a marker is left.
 */
function plain(raw, where) {
  const s = raw
    .replace(FOOTNOTE, '')
    .replace(XNOTE, '')
    .replace(WORD, '$2')
    .replace(/\\\+?(wj|qs|bk)\*/g, '')
    .replace(/\\\+?(wj|qs|bk) /g, '')
  if (/[\\|]/.test(s)) throw new Error(`${where}: a marker that the rules do not name, or a \\w with a different form: ${s}`)
  return s
}

/** The words of a verse or a title as one string: single spaces, no space at the start or the end. */
function words(raw, where, count) {
  const notes = (raw.match(FOOTNOTE) ?? []).length
  const xnotes = (raw.match(XNOTE) ?? []).length
  // The markers of a footnote or a note must be inside it.
  const rest = raw.replace(FOOTNOTE, '').replace(XNOTE, '')
  if (/\\(fr|ft|fq|fqa|xo|xt|\+wh|f|x)\b/.test(rest)) throw new Error(`${where}: a marker of a footnote or a note outside it: ${rest}`)
  const t = plain(raw, where).replace(SPACES, ' ').replace(EDGES, '')
  count.footnotes += notes
  count.xnotes += xnotes
  return t
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

// ---- the words-of-Jesus marks: docs/DESIGN.md sections 11 and 13.5 ----

/**
 * The words of each words-of-Jesus mark of a verse, in order. A mark can go on over a verse number: then it is
 * open at the start of the next verse. Returns the words and whether a mark is open at the end of the verse.
 */
function markWords(raw, where, openAtStart) {
  const out = []
  let open = openAtStart ? 0 : -1
  for (const m of raw.matchAll(/\\\+?wj(\*?)/g)) {
    if (!m[1]) {
      if (open >= 0) throw new Error(`${where}: a start marker \\wj inside an open mark`)
      open = m.index + m[0].length
      stats.wjStartMarkers++
    } else {
      if (open < 0) throw new Error(`${where}: an end marker \\wj* with no start marker`)
      const w = plain(raw.slice(open, m.index), where).replace(SPACES, ' ').replace(EDGES, '')
      if (!w) throw new Error(`${where}: a words-of-Jesus mark with no words`)
      out.push(w)
      open = -1
    }
  }
  const openAtEnd = open >= 0
  if (openAtEnd) {
    const w = plain(raw.slice(open), where).replace(SPACES, ' ').replace(EDGES, '')
    if (!w) throw new Error(`${where}: a words-of-Jesus mark with no words in this verse`)
    out.push(w)
  }
  return { words: out, openAtEnd }
}

/** Each place of `needle` in `hay`: [start, end). With noSpace, the spaces of the two do not count. */
function placesOf(hay, needle, noSpace) {
  const out = []
  if (!noSpace) {
    for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) out.push({ start: i, end: i + needle.length })
    return out
  }
  let s = ''
  const pos = []
  for (let i = 0; i < hay.length; i++) if (!/[ \t\r\n]/.test(hay[i])) {
    s += hay[i]
    pos.push(i)
  }
  const n = needle.replace(SPACES, '')
  for (let i = s.indexOf(n); i >= 0; i = s.indexOf(n, i + 1)) out.push({ start: pos[i], end: pos[i + n.length - 1] + 1 })
  return out
}

/**
 * The places of the marks of one verse in its words, in their order: [start, end). Each mark must be in the
 * words exactly. If it is not, the search of Task 26 that ignores the spaces. Stops with an error when a mark
 * has no place, or when more than one choice of places fits the order of the marks.
 */
function placeMarks(where, text, list) {
  const options = list.map((w) => {
    let o = placesOf(text, w, false)
    if (!o.length) {
      o = placesOf(text, w, true)
      if (o.length) stats.marksPlacedWithSpacesIgnored.push(where)
    }
    if (!o.length) throw new Error(`${where}: the words of a words-of-Jesus mark are not in the verse: ${w}`)
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
  if (n === 0) throw new Error(`${where}: the words-of-Jesus marks of the verse do not fit the verse in their order`)
  if (n > 1) throw new Error(`${where}: a words-of-Jesus mark is at more than one place, and the order of the marks does not decide`)
  const chosen = []
  let from = 0
  for (let i = 0; i < list.length; i++) {
    const p = options[i].find((x) => x.start >= from && count(i + 1, x.end) === 1)
    chosen.push([p.start, p.end])
    from = p.end
  }
  return chosen
}

/** The items of a verse in Form A of docs/DESIGN.md section 11: strings, and { j: "words" } for marked words. */
function withMarks(text, list, where) {
  if (!list.length) return [text]
  const ranges = placeMarks(where, text, list)
  stats.jItems += ranges.length
  stats.versesWithMarks++
  const out = []
  let from = 0
  for (const [s, e] of ranges) {
    if (s > from) out.push(text.slice(from, s))
    out.push({ j: text.slice(s, e) })
    from = e
  }
  if (from < text.length) out.push(text.slice(from))
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

/** The items of each verse of a chapter, with the marks that go on over a verse number. */
function chapterVerses(where, src) {
  const out = new Map()
  let open = false
  for (const [n, raw] of src.verses) {
    const at = `${where}:${n}`
    stats.verseNumbersInSource++
    const text = words(raw, at, stats)
    if (!text) {
      if (!EMPTY.includes(at)) throw new Error(`${at}: a verse number with no words that is not in the list EMPTY`)
      if (open || /\\\+?wj/.test(raw.replace(FOOTNOTE, ''))) throw new Error(`${at}: a words-of-Jesus mark in a verse with no words`)
      used.EMPTY.add(at)
      out.set(n, null)
      continue
    }
    if (EMPTY.includes(at)) throw new Error(`${at}: in the list EMPTY, but the verse has words`)
    const { words: list, openAtEnd } = markWords(raw, at, open)
    // A mark that goes on over a verse number counts once: in the verse where it is open at the end the first time.
    if (openAtEnd && (!open || /\\\+?wj\*/.test(raw))) stats.marksOverAVerseNumber++
    open = openAtEnd
    out.set(n, withMarks(text, list, at))
  }
  if (open) throw new Error(`${where}: a words-of-Jesus mark is open at the end of the chapter`)
  return out
}

function buildChapter(where, bsbCh, src, isSong) {
  const blocks = []
  const placed = new Set()
  const bsbBlocks = bsbCh.blocks
  const verses = chapterVerses(where, src)

  // The \d lines after a verse: only the letter names of Psalm 119, which the site does not use.
  if (where === LETTER_NAMES_CHAPTER) {
    if (src.title === null) throw new Error(`${where}: expected the letter name before verse 1`)
    stats.dLinesNotUsed += 1 + src.laterTitles.length
    used.letterNames = true
    src = { ...src, title: null }
  } else if (src.laterTitles.length) throw new Error(`${where}: a \\d line after verse ${src.laterTitles[0].after}`)

  let carryVerse1 = false
  const hasD = bsbBlocks.some((b) => b.k === 'p' && b.s === 'd')
  if (src.title !== null && !hasD) throw new Error(`${where}: the source has a \\d line and the Berean chapter has no d block`)
  if (hasD && src.title === null && where !== LETTER_NAMES_CHAPTER) stats.bsbDWithoutTitle.push(where)

  const verseItems = (n) => {
    const at = `${where}:${n}`
    if (placed.has(n)) throw new Error(`${at}: verse placed twice`)
    if (!src.verses.has(n)) {
      if (!NOT_IN_SOURCE.includes(at)) throw new Error(`${at}: the source has no such verse`)
      used.NOT_IN_SOURCE.add(at)
      return null
    }
    placed.add(n)
    return verses.get(n)
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
    if (b.k === 'n') continue // no notes on the World English Bible pages
    if (b.k === 'b') {
      blocks.push({ k: 'b' })
      continue
    }
    if (b.k !== 'p') throw new Error(`${where}: unknown block ${JSON.stringify(b)}`)
    // The verses that start in this Berean block.
    const starts = b.c.filter((x) => typeof x === 'object' && ('v' in x || 'o' in x)).map((x) => ('v' in x ? x.v : x.o))
    if (b.s === 'd') {
      if (starts.length !== 1 || starts[0] !== 1) throw new Error(`${where}: d block that holds ${starts.join(', ')}`)
      if (src.title === null) {
        // No title in the source: no d block. Verse 1 goes in the next text block, with its number.
        carryVerse1 = 'with-number'
        add(stats.bsbBlocksWithoutWeb, 'd')
        continue
      }
      const title = words(src.title, `${where} title`, stats.titles)
      if (!title) throw new Error(`${where}: a title with no words`)
      // As in the Berean data and the King James Version data, the title ends with a space.
      blocks.push({ k: 'p', s: 'd', c: [{ v: 1 }, title + ' '] })
      stats.dBlocks++
      carryVerse1 = 'without-number'
      continue
    }
    const c = []
    if (carryVerse1) {
      const list = verseItems(1)
      if (!list) throw new Error(`${where}: verse 1 has no words`)
      if (carryVerse1 === 'with-number') c.push({ v: 1 })
      pushItems(c, list)
      carryVerse1 = false
    }
    for (const n of starts) {
      const list = verseItems(n)
      if (list === null) continue // not in the source, or a verse number with no words
      c.push({ v: n })
      pushItems(c, list)
    }
    if (!c.length) {
      add(stats.bsbBlocksWithoutWeb, b.s)
      continue
    }
    blocks.push({ k: 'p', s: b.s, c })
  }
  if (carryVerse1) throw new Error(`${where}: no text block after the d block`)

  // The verses that no Berean block starts: one new text block after the last text block of the chapter.
  const notPlaced = [...src.verses.keys()].filter((n) => !placed.has(n))
  if (notPlaced.length) {
    for (const n of notPlaced) if (!NEW_BLOCK.includes(`${where}:${n}`)) throw new Error(`${where}:${n}: verse of the source with no place in the Berean structure`)
    const c = []
    for (const n of notPlaced) {
      const list = verseItems(n)
      if (!list) throw new Error(`${where}:${n}: a verse of the new block with no words`)
      c.push({ v: n })
      pushItems(c, list)
      used.NEW_BLOCK.add(`${where}:${n}`)
    }
    stats.markerBeforeRomans14v24 = src.lineBefore.get(notPlaced[0])
    const last = blocks.findLastIndex((x) => x.k === 'p')
    blocks.splice(last + 1, 0, { k: 'p', s: 'p', c })
  }

  // A heading with no verse after it in its chapter does not show, nor its cross-reference line.
  let xrefs = bsbCh.xrefs
  const lastText = blocks.findLastIndex((x) => x.k === 'p')
  const lateHeadings = blocks.filter((x, i) => i > lastText && x.k === 'h')
  if (lateHeadings.length) {
    if (where !== HEADING_WITH_NO_VERSE[0] || lateHeadings.length !== 1 || lateHeadings[0].t !== HEADING_WITH_NO_VERSE[1])
      throw new Error(`${where}: heading with no verse after it: ${lateHeadings.map((h) => h.t).join(', ')}`)
    // Its cross-reference line is at the first verse of the Berean block after the heading.
    const bi = bsbBlocks.findIndex((x) => x.k === 'h' && x.t === lateHeadings[0].t)
    const next = bsbBlocks.slice(bi + 1).find((x) => x.k === 'p')
    const first = next.c.find((x) => typeof x === 'object' && ('v' in x || 'o' in x))
    const v = 'v' in first ? first.v : first.o
    const left = xrefs.filter((x) => x.v === v)
    if (left.length !== 1) throw new Error(`${where}: expected one cross-reference line at verse ${v}, found ${left.length}`)
    xrefs = xrefs.filter((x) => x.v !== v)
    stats.xrefsLeftOut.push(`${where}:${v} ${left[0].t}`)
    stats.headingsWithNoVerseLeftOut.push(`${where} ${lateHeadings[0].t}`)
    blocks.splice(blocks.indexOf(lateHeadings[0]), 1)
    used.heading = true
  }

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
  stats.verses += [...placed].filter((n) => verses.get(n) !== null).length
  stats.xrefs += xrefs.length
  return { n: bsbCh.n, blocks: out, xrefs }
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
  writeFileSync(join(OUT, `${book.id}.json`), JSON.stringify({ id: book.id, name: book.name, translation: 'World English Bible', chapters }))
})

// Each place of each list was used.
for (const [name, list] of [['EMPTY', EMPTY], ['NEW_BLOCK', NEW_BLOCK], ['NOT_IN_SOURCE', NOT_IN_SOURCE]])
  for (const at of list) if (!used[name].has(at)) throw new Error(`${at}: in the list ${name}, but not used`)
if (!used.letterNames) throw new Error(`${LETTER_NAMES_CHAPTER}: the letter names were not found`)
if (!used.heading) throw new Error(`${HEADING_WITH_NO_VERSE.join(' ')}: the heading was not found`)

console.log(JSON.stringify(stats, null, 1))
