// Prints the numbers and the lists of the King James Version report. docs/TASKS.md Task 19, steps 5 to 11.
//
// Usage: node scripts/kjv-report.mjs <folder>
//
// The folder is a temporary folder outside the repository. The script only reads files. It expects:
//   <folder>/a/usfm/*.usfm      edition A, the USFM files of https://eBible.org/Scriptures/eng-kjv2006_usfm.zip
//   <folder>/b/usfm/*.usfm      edition B, the USFM files of https://eBible.org/Scriptures/engkjvcpb_usfm.zip
//   <folder>/c/docx/word/document.xml   edition C, unpacked from https://openbible.com/docx/kjv.docx
// If the file of edition C is not there, the script prints the parts for editions A and B only.
//
// The plain words of a verse: the words that remain when the script removes the USFM markers,
// the Strong's numbers, the footnotes, the published verse numbers (\vp), and the paragraph sign
// "¶" of edition A. Then it changes each run of spaces to one space. For edition C, the plain words
// are the text of the verse without the square brackets of the added words: "[was]" becomes "was".
// The script changes nothing else: not the letter case, not the punctuation, not the spelling.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIR = process.argv[2]
if (!DIR) throw new Error('usage: node scripts/kjv-report.mjs <folder>')
const ROOT = join(import.meta.dirname, '..')

// The 66 USFM book codes in the order of public/data/books.json. The site data uses the same codes in
// the cross-reference lines, for example "JHN 1:1-5".
const CODES = ('GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM ' +
  'EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH ' +
  '1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV').split(' ')
const books = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'books.json'), 'utf8'))
if (books.length !== 66) throw new Error('expected 66 books in books.json')
const idOfCode = new Map(CODES.map((c, i) => [c, books[i].id]))
const nameOf = new Map(books.map((b) => [b.id, b.name]))
const orderOf = new Map(books.map((b, i) => [b.id, i]))

// ---- output ----

function section(title) {
  console.log(`\n==== ${title}`)
}
function line(...parts) {
  console.log(parts.join(' '))
}
const ref = (id, c, v) => `${nameOf.get(id)} ${c}:${v}`
const key = (id, c, v) => `${id} ${c}:${v}`
function parseKey(k) {
  const m = /^(\S+) (\d+):(\d+)$/.exec(k)
  return { id: m[1], c: +m[2], v: +m[3] }
}
const showKey = (k) => {
  const p = parseKey(k)
  return ref(p.id, p.c, p.v)
}
const byBibleOrder = (x, y) => {
  const a = parseKey(x)
  const b = parseKey(y)
  return orderOf.get(a.id) - orderOf.get(b.id) || a.c - b.c || a.v - b.v
}
/** n items from a list, spaced evenly, so that the examples come from the whole Bible. */
function spread(list, n) {
  if (list.length <= n) return list
  return Array.from({ length: n }, (_, i) => list[Math.floor((i * list.length) / n)])
}
function counter() {
  const m = new Map()
  return { add: (k, n = 1) => m.set(k, (m.get(k) ?? 0) + n), map: m }
}
const pct = (a, b) => `${((100 * a) / b).toFixed(1)} %`

// ---- USFM: editions A and B ----

const PARA = new Set(['p', 'm', 'q1', 'q2', 'q3', 'b', 'nb', 'mi', 'pi', 'pc', 'pm', 'pmo', 'li1', 'li2', 'qm1', 'qr', 'qd'])
const HEADING = /^(s\d?|ms\d?|mr|d|qa|qc|sp|r|cl|sr|mt\d?|imt\d?|is\d?)$/

/** The plain words of USFM verse text. See the head of this file. */
function plainUsfm(raw) {
  return raw
    .replace(/\\f [\s\S]*?\\f\*/g, '')
    .replace(/\\x [\s\S]*?\\x\*/g, '')
    .replace(/\\vp [\s\S]*?\\vp\*/g, '')
    .replace(/\\\+?w ([^|\\]*)(\|[^\\]*)?\\\+?w\*/g, '$1')
    .replace(/\\\+?[a-z0-9]+\*/g, '')
    .replace(/\\\+?[a-z0-9]+ ?/g, '')
    .replace(/¶/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function readUsfm(folder) {
  const ed = {
    verses: new Map(), // key -> raw USFM text of the verse
    order: [], // keys in file order
    headings: [], // { marker, text, id, c, v } where v is the verse that comes next
    footnotes: [], // { key, raw }
    markers: counter(),
    other: [], // books that are not in the 66 books
    chapters: 0,
    books: 0,
    names: [], // \h name against books.json name, where they differ
  }
  for (const f of readdirSync(folder).filter((x) => x.endsWith('.usfm')).sort()) {
    const text = readFileSync(join(folder, f), 'utf8').replace(/^﻿/, '')
    const code = /^\\id (\S+)/.exec(text)[1]
    const h = /^\\h (.+)$/m.exec(text)?.[1].trim()
    const id = idOfCode.get(code)
    if (!id) {
      ed.other.push(`${code} ${h}`)
      continue
    }
    ed.books++
    if (h !== nameOf.get(id)) ed.names.push(`${code}: "${h}" in the file, "${nameOf.get(id)}" in books.json`)
    for (const m of text.matchAll(/\\\+?[a-z0-9]+\*?/g)) ed.markers.add(m[0])
    let c = 0
    let cur = null // key of the current verse
    const pending = [] // headings that wait for the next verse
    for (const rawLine of text.split(/\r?\n/)) {
      const m = /^\\([a-z0-9]+)\s?(.*)$/.exec(rawLine.trim())
      if (!m) {
        if (rawLine.trim() && cur) ed.verses.set(cur, ed.verses.get(cur) + ' ' + rawLine.trim())
        continue
      }
      const [, marker, rest] = m
      if (marker === 'c') {
        c = +rest.trim().split(/\s/)[0]
        ed.chapters++
        cur = null
        continue
      }
      if (HEADING.test(marker)) {
        if (c > 0 && !/^(mt|imt|is)/.test(marker)) {
          const hd = { marker, text: plainUsfm(rest), id, c, v: null, raw: rest }
          ed.headings.push(hd)
          pending.push(hd)
        }
        continue
      }
      // A paragraph marker, a verse marker, or a marker of the book head. The text after it belongs
      // to a verse. A line can hold more than one verse.
      let body = rest
      if (!PARA.has(marker) && marker !== 'v') continue
      if (marker === 'v') body = '\\v ' + rest
      for (const part of body.split(/(?=\\v \d)/)) {
        const vm = /^\\v (\d+)\S*\s?([\s\S]*)$/.exec(part)
        if (vm) {
          cur = key(id, c, +vm[1])
          ed.verses.set(cur, vm[2])
          ed.order.push(cur)
          for (const hd of pending.splice(0)) hd.v = +vm[1]
        } else if (part.trim() && cur) ed.verses.set(cur, ed.verses.get(cur) + ' ' + part)
      }
    }
  }
  for (const [k, raw] of ed.verses) for (const f of raw.matchAll(/\\f [\s\S]*?\\f\*/g)) ed.footnotes.push({ key: k, raw: f[0] })
  return ed
}

function reportUsfm(label, ed) {
  section(`Step 5. Edition ${label}: books, chapters, verses`)
  line('Books of the 66:', ed.books, ' Chapters:', ed.chapters, ' Verses:', ed.verses.size)
  const emptyV = [...ed.verses].filter(([, r]) => !plainUsfm(r))
  line('Verses with no words:', emptyV.length, emptyV.map(([k]) => showKey(k)).join(', '))
  line('Other books, not counted:', ed.other.length ? ed.other.join('; ') : 'none')
  line('Book names that differ from books.json:', ed.names.length ? ed.names.join('; ') : 'none')
  const missing = books.filter((b) => !ed.order.some((k) => k.startsWith(b.id + ' ')))
  line('Books of books.json with no verse:', missing.length ? missing.map((b) => b.id).join(', ') : 'none')
  const chapterCount = new Map()
  for (const k of ed.order) {
    const p = parseKey(k)
    chapterCount.set(p.id, Math.max(chapterCount.get(p.id) ?? 0, p.c))
  }
  const wrong = books.filter((b) => chapterCount.get(b.id) !== b.chapters)
  line('Books whose last chapter differs from books.json:', wrong.length ? wrong.map((b) => `${b.id} ${chapterCount.get(b.id)}`).join(', ') : 'none')

  section(`Step 5. Edition ${label}: USFM markers in the 66 books`)
  line([...ed.markers.map].sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1)).map(([k, n]) => `${k} ${n}`).join(', '))

  section(`Step 5. Edition ${label}: headings`)
  const byMarker = new Map()
  for (const hd of ed.headings) {
    if (!byMarker.has(hd.marker)) byMarker.set(hd.marker, counter())
    byMarker.get(hd.marker).add(hd.text)
  }
  for (const [marker, cnt] of byMarker) {
    const total = [...cnt.map.values()].reduce((a, b) => a + b, 0)
    line(`\\${marker}: ${total} headings, ${cnt.map.size} different texts`)
    const where = new Map()
    for (const hd of ed.headings) if (hd.marker === marker && !where.has(hd.text)) where.set(hd.text, `${nameOf.get(hd.id)} ${hd.c}`)
    for (const [t, n] of [...cnt.map].sort((x, y) => y[1] - x[1])) line(`  ${n} x "${t}" (first: ${where.get(t)})`)
  }

  section(`Step 5. Edition ${label}: footnotes`)
  line('Footnotes:', ed.footnotes.length, ' Verses with a footnote:', new Set(ed.footnotes.map((f) => f.key)).size)
  for (const f of spread(ed.footnotes, 5)) line(`  ${showKey(f.key)}: ${f.raw}`)

  section(`Step 5. Edition ${label}: added words`)
  let groups = 0
  let verses = 0
  for (const raw of ed.verses.values()) {
    // \add and \+add, the second form inside other character markers. Not in footnotes.
    const n = (raw.replace(/\\f [\s\S]*?\\f\*/g, '').match(/\\\+?add /g) ?? []).length
    groups += n
    if (n) verses++
  }
  line(`\\add and \\+add groups in the verse text, not in footnotes or headings: ${groups} in ${verses} verses`)
  const pil = [...ed.verses.values()].filter((r) => r.includes('¶')).length
  line(`Verses with the paragraph sign "¶": ${pil}`)
  const hebrew = counter()
  for (const [k, raw] of ed.verses) if (/^\([א-ת]\)/.test(plainUsfm(raw))) hebrew.add(`${nameOf.get(parseKey(k).id)} ${parseKey(k).c}`)
  line('Verses that start with a Hebrew letter in parentheses, by chapter:', [...hebrew.map].map(([c, n]) => `${c} ${n}`).join(', ') || 'none')

  section(`Step 5. Edition ${label}: five verses, as in the file and as plain words`)
  const last3john = Math.max(...ed.order.filter((k) => k.startsWith('3-john 1:')).map((k) => parseKey(k).v))
  for (const k of [key('genesis', 1, 1), key('genesis', 1, 2), key('psalms', 23, 1), key('matthew', 5, 3), key('3-john', 1, last3john)]) {
    line(`  ${showKey(k)}`)
    line(`    file:  ${ed.verses.get(k)?.trim()}`)
    line(`    plain: ${plainUsfm(ed.verses.get(k) ?? '')}`)
  }
}

// ---- comparison of plain words ----

const caseless = (s) => s.toLowerCase()
const bare = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim()

function compare(label, x, y, plainX, plainY) {
  section(`Step 6. Plain words: ${label}`)
  const onlyX = [...x.keys()].filter((k) => !y.has(k)).sort(byBibleOrder)
  const onlyY = [...y.keys()].filter((k) => !x.has(k)).sort(byBibleOrder)
  const diff = []
  let caseOnly = 0
  let marksOnly = 0
  for (const k of [...x.keys()].sort(byBibleOrder)) {
    if (!y.has(k)) continue
    const a = plainX(x.get(k))
    const b = plainY(y.get(k))
    if (a === b) continue
    diff.push({ k, a, b })
    if (caseless(a) === caseless(b)) caseOnly++
    else if (bare(a) === bare(b)) marksOnly++
  }
  line('Verses in both:', [...x.keys()].filter((k) => y.has(k)).length)
  line('Verses whose plain words differ:', diff.length)
  line('  of these, a difference only in letter case:', caseOnly)
  line('  of these, a difference only in punctuation, or in punctuation and letter case:', marksOnly)
  line('  of these, a difference in the letters of the words:', diff.length - caseOnly - marksOnly)
  line('Verses only in the first:', onlyX.length, onlyX.slice(0, 20).map(showKey).join(', '))
  line('Verses only in the second:', onlyY.length, onlyY.slice(0, 20).map(showKey).join(', '))
  line('Ten examples:')
  for (const d of spread(diff, 10)) {
    line(`  ${showKey(d.k)}`)
    line(`    1: ${d.a}`)
    line(`    2: ${d.b}`)
  }
  const wordsDiffer = diff.filter((d) => bare(d.a) !== bare(d.b))
  line('Ten examples with a difference in the letters of the words:')
  for (const d of spread(wordsDiffer, 10)) {
    line(`  ${showKey(d.k)}`)
    line(`    1: ${d.a}`)
    line(`    2: ${d.b}`)
  }
  return diff
}

// ---- the Berean files of the repository ----

function readBsbTxt() {
  const order = []
  const verses = new Map() // key -> text
  const txt = readFileSync(join(ROOT, 'sources', 'bsb', 'bsb.txt'), 'utf8').replace(/^﻿/, '')
  for (const l of txt.split(/\r?\n/)) {
    const m = /^(.+) (\d+):(\d+)\t(.*)$/.exec(l)
    if (!m) continue
    if (order.at(-1) !== m[1]) order.push(m[1])
    verses.set(key(books[order.length - 1].id, +m[2], +m[3]), m[4].trim())
  }
  if (order.length !== 66) throw new Error('expected 66 books in bsb.txt')
  return verses
}

function readSiteText() {
  return books.map((b) => JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'text', `${b.id}.json`), 'utf8')))
}

function readLinks() {
  const byId = new Map()
  for (const b of books) {
    const d = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'links', `${b.id}.json`), 'utf8'))
    for (const l of d.links) byId.set(l.id, l)
  }
  return [...byId.values()]
}

const POETRY = new Set(['q1', 'q2', 'qr', 'qd'])

/**
 * The structure of the site data: for each heading, its place; for each text block, whether it starts
 * in the middle of a verse; for each verse, the text blocks that hold its words.
 */
function siteStructure(site) {
  const headings = [] // { id, c, style, text, v, mid }
  const blocks = [] // { id, c, style, mid, v }
  const blocksOfVerse = new Map() // key -> Set of block index
  const xrefs = [] // { id, c, v, t }
  for (const book of site) {
    for (const ch of book.chapters) {
      for (const x of ch.xrefs ?? []) xrefs.push({ id: book.id, c: ch.n, v: x.v, t: x.t })
      let verse = 0
      const pending = []
      for (const b of ch.blocks) {
        if (b.k === 'h') {
          const hd = { id: book.id, c: ch.n, style: b.s, text: b.t, v: null, mid: false }
          headings.push(hd)
          pending.push(hd)
          continue
        }
        if (b.k !== 'p') continue
        const first = b.c[0]
        const mid = typeof first === 'string'
        const nextV = mid ? verse : (b.c.find((it) => typeof it === 'object' && 'v' in it)?.v ?? verse)
        for (const hd of pending.splice(0)) {
          hd.mid = mid
          hd.v = nextV
        }
        const index = blocks.length
        blocks.push({ id: book.id, c: ch.n, style: b.s, mid, v: verse })
        for (const it of b.c) {
          if (typeof it === 'object' && 'v' in it) verse = it.v
          else if (typeof it === 'string' && verse > 0 && it.trim()) {
            const k = key(book.id, ch.n, verse)
            if (!blocksOfVerse.has(k)) blocksOfVerse.set(k, new Set())
            blocksOfVerse.get(k).add(index)
          }
        }
      }
    }
  }
  return { headings, blocks, blocksOfVerse, xrefs }
}

// ---- the .docx file: edition C ----
//
// The structure of word/document.xml, as the script checks it:
// - A chapter starts with a paragraph with no style and the text "<book name> <chapter>". The next
//   paragraph starts with "KJV". The script counts a new book when the book name changes.
// - The paragraph styles hdg, subhdg, suphdg, and acrostic are headings. In a heading, the text after
//   the first line break is a cross-reference line when it has a run with the style cross1.
// - Each other paragraph after the first chapter line is a text paragraph. A run with the style
//   reftext1 is a verse number. The run after it, with the style thinv1, is a space.

const C_HEADINGS = new Set(['hdg', 'subhdg', 'suphdg', 'acrostic'])
const xmlText = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
/** The plain words of edition C: the text without the square brackets of the added words. */
const plainDocx = (raw) => raw.replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim()

/** The paragraphs of document.xml: style, and a list of items { t, r } (text and run style) or { br }. */
function docxParagraphs(xml) {
  const out = []
  for (const p of xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)) {
    const style = /<w:pStyle w:val="([^"]+)"/.exec(p[0])?.[1] ?? null
    const items = []
    for (const r of p[0].matchAll(/<w:r[ >][\s\S]*?<\/w:r>/g)) {
      const rs = /<w:rStyle w:val="([^"]+)"/.exec(r[0])?.[1] ?? null
      for (const x of r[0].matchAll(/<w:t(?: [^>]*)?>([^<]*)<\/w:t>|<w:br\/>|<w:tab\/>/g)) {
        if (x[0] === '<w:br/>') items.push({ br: true })
        else if (x[0] === '<w:tab/>') items.push({ t: '\t', r: rs })
        else items.push({ t: xmlText(x[1]), r: rs })
      }
    }
    out.push({ style, items, text: items.map((i) => i.t ?? '\n').join('') })
  }
  return out
}

let paragraphsText = []

function readDocx(path) {
  const paras = docxParagraphs(readFileSync(path, 'utf8'))
  paragraphsText = paras.map((p) => p.text)
  const ed = {
    paragraphs: paras.length,
    styles: counter(), // paragraph styles of all paragraphs
    verses: new Map(),
    order: [],
    headings: [], // { style, text, id, c, v, mid }
    xrefs: [], // { id, c, v, t }
    textParas: [], // { style, id, c, first, mid, verses }
    bookNames: [],
    chapters: 0,
    noVerse: [], // text paragraphs with no verse number
    other: [], // paragraphs after the first chapter line that the script does not use
  }
  let bookName = null
  let id = null
  let c = 0
  let cur = null
  const pending = []
  for (let i = 0; i < paras.length; i++) {
    const p = paras[i]
    ed.styles.add(p.style ?? '(none)')
    const plain = p.text.trim()
    const chap = /^(.+) (\d+)$/.exec(plain)
    if (!p.style && chap && paras[i + 1]?.text.trim().startsWith('KJV')) {
      if (chap[1] !== bookName) {
        bookName = chap[1]
        ed.bookNames.push(bookName)
        id = books[ed.bookNames.length - 1]?.id ?? null
      }
      c = +chap[2]
      ed.chapters++
      cur = null
      i++ // the "KJV" line
      continue
    }
    if (!id) continue // the pages before Genesis 1
    if (C_HEADINGS.has(p.style)) {
      const brAt = p.items.findIndex((x) => x.br)
      const before = (brAt < 0 ? p.items : p.items.slice(0, brAt)).map((x) => x.t).join('').trim()
      const after = brAt < 0 ? [] : p.items.slice(brAt + 1)
      const isXref = after.some((x) => x.r === 'cross1')
      const afterText = after.map((x) => x.t ?? ' ').join('').replace(/\s+/g, ' ').trim()
      const hd = { style: p.style, text: isXref ? before : [before, afterText].filter(Boolean).join(' '), id, c, v: null, mid: null }
      ed.headings.push(hd)
      pending.push(hd)
      if (isXref) {
        const x = { id, c, v: null, t: afterText }
        ed.xrefs.push(x)
        pending.push(x)
      }
      continue
    }
    if (!plain) continue
    // A text paragraph.
    const first = p.items.find((x) => x.t && x.t.trim())
    const startsAtVerse = first?.r === 'reftext1'
    const tp = { style: p.style ?? '(none)', id, c, mid: !startsAtVerse, first: null, verses: 0 }
    let skipSpace = false
    for (const x of p.items) {
      if (x.r === 'reftext1') {
        cur = key(id, c, +x.t.trim())
        if (ed.verses.has(cur)) throw new Error(`verse twice: ${cur}`)
        ed.verses.set(cur, '')
        ed.order.push(cur)
        tp.verses++
        tp.first ??= +x.t.trim()
        skipSpace = true
        continue
      }
      if (skipSpace && x.r === 'thinv1') continue
      skipSpace = false
      if (x.br) continue
      if (cur) ed.verses.set(cur, ed.verses.get(cur) + x.t)
      else ed.other.push(`${id} ${c}: ${x.t}`)
    }
    const at = startsAtVerse ? tp.first : cur ? parseKey(cur).v : 0
    for (const h of pending.splice(0)) {
      h.v = at
      if ('mid' in h) h.mid = !startsAtVerse
    }
    if (!tp.verses) ed.noVerse.push(`${ref(id, c, cur ? parseKey(cur).v : 0)} [${tp.style}] ${plain.slice(0, 80)}`)
    ed.textParas.push(tp)
  }
  for (const [k, v] of ed.verses) ed.verses.set(k, v.replace(/\s+/g, ' ').trim())
  return ed
}

function reportDocx(ed) {
  section('Step 5. Edition C: the structure of word/document.xml')
  line('Paragraphs:', ed.paragraphs, ' Paragraph styles:', [...ed.styles.map].map(([s, n]) => `${s} ${n}`).join(', '))
  line('Text paragraphs after the first chapter line:', ed.textParas.length)
  const tStyles = counter()
  for (const t of ed.textParas) tStyles.add(t.style)
  line('  by style:', [...tStyles.map].map(([s, n]) => `${s} ${n}`).join(', '))
  line('Text paragraphs that start in the middle of a verse:', ed.textParas.filter((t) => t.mid).length)
  line('Text paragraphs with no verse number:', ed.noVerse.length)
  for (const x of ed.noVerse.slice(0, 20)) line(' ', x)
  line('Text that the script did not give to a verse:', ed.other.length, ed.other.slice(0, 5).join(' | '))
  const all = paragraphsText
  const rights = all.filter((t) => /copyright|public domain|licen[cs]|rights|permission|©/i.test(t))
  line('Paragraphs with the words copyright, public domain, licence, rights, permission, or ©:', rights.length)
  for (const t of rights.slice(0, 10)) line('  ', t.slice(0, 200))
  // The other parts of the .docx file: each XML file of the unpacked folder except word/document.xml.
  const parts = []
  const walk = (dir, rel) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(dir, e.name), `${rel}${e.name}/`)
      else parts.push(`${rel}${e.name}`)
    }
  }
  walk(join(DIR, 'c', 'docx'), '')
  const otherParts = parts.filter((p) => p !== 'word/document.xml')
  const hits = otherParts.filter((p) => /copyright|public domain|licen[cs]e|rights reserved|©/i.test(readFileSync(join(DIR, 'c', 'docx', p), 'utf8')))
  line(`The other parts of the file (${otherParts.length}): ${otherParts.join(', ')}`)
  line('Other parts with the words copyright, public domain, licence, rights reserved, or ©:', hits.length ? hits.join(', ') : 'none')
  const core = readFileSync(join(DIR, 'c', 'docx', 'docProps', 'core.xml'), 'utf8')
  line('docProps/core.xml: creator', /<dc:creator>([^<]*)/.exec(core)?.[1], ' created', /<dcterms:created[^>]*>([^<]*)/.exec(core)?.[1])

  section('Step 5. Edition C: books, chapters, verses')
  line('Books:', ed.bookNames.length, ' Chapters:', ed.chapters, ' Verses:', ed.verses.size)
  const names = ed.bookNames.map((n, i) => [n, books[i]?.name]).filter(([n, b]) => n !== b)
  line('Book names in the chapter lines that differ from books.json:', names.map(([n, b]) => `"${n}" for ${b}`).join(', ') || 'none')
  const chapterCount = new Map()
  for (const k of ed.order) {
    const p = parseKey(k)
    chapterCount.set(p.id, Math.max(chapterCount.get(p.id) ?? 0, p.c))
  }
  const wrong = books.filter((b) => chapterCount.get(b.id) !== b.chapters)
  line('Books whose last chapter differs from books.json:', wrong.length ? wrong.map((b) => `${b.id} ${chapterCount.get(b.id)}`).join(', ') : 'none')

  section('Step 5. Edition C: headings and cross-reference lines')
  const hs = counter()
  for (const h of ed.headings) hs.add(h.style)
  line('Headings by style:', [...hs.map].map(([s, n]) => `${s} ${n}`).join(', '))
  line('Section headings (hdg):', hs.map.get('hdg') ?? 0, ' Cross-reference lines:', ed.xrefs.length)
  line('Headings with the style suphdg:', ed.headings.filter((h) => h.style === 'suphdg').map((h) => `"${h.text}" before ${ref(h.id, h.c, h.v)}`).join('; '))
  const acro = counter()
  for (const h of ed.headings.filter((h) => h.style === 'acrostic')) acro.add(nameOf.get(h.id))
  line('Headings with the style acrostic, by book:', [...acro.map].map(([s, n]) => `${s} ${n}`).join(', '))
  line('  examples:', spread(ed.headings.filter((h) => h.style === 'acrostic'), 4).map((h) => `"${h.text}" before ${ref(h.id, h.c, h.v)}`).join('; '))

  section('Step 5. Edition C: footnotes')
  line('The file has no footnote part (word/footnotes.xml):', !existsSync(join(DIR, 'c', 'docx', 'word', 'footnotes.xml')))

  section('Step 5. Edition C: added words')
  let groups = 0
  let verses = 0
  for (const raw of ed.verses.values()) {
    const n = (raw.match(/\[[^\]]*\]/g) ?? []).length
    groups += n
    if (n) verses++
  }
  line(`Groups in square brackets: ${groups} in ${verses} verses`)
  const odd = [...ed.verses].filter(([, r]) => (r.match(/\[/g) ?? []).length !== (r.match(/\]/g) ?? []).length)
  line('Verses where the numbers of "[" and "]" differ:', odd.length, odd.slice(0, 5).map(([k]) => showKey(k)).join(', '))
  line('Verses with the paragraph sign "¶":', [...ed.verses.values()].filter((r) => r.includes('¶')).length)
  const letters = [...ed.verses].filter(([k, r]) => k.startsWith('psalms 119:') && /^[A-Z]{2,}\. /.test(r))
  line('Verses of Psalm 119 whose words start with a word in capital letters and a full stop:', letters.length, letters.map(([k, r]) => `${parseKey(k).v} "${r.split(' ')[0]}"`).join(', '))

  section('Step 5. Edition C: five verses, as in the file and as plain words')
  const last3john = Math.max(...ed.order.filter((k) => k.startsWith('3-john 1:')).map((k) => parseKey(k).v))
  for (const k of [key('genesis', 1, 1), key('genesis', 1, 2), key('psalms', 23, 1), key('matthew', 5, 3), key('3-john', 1, last3john)]) {
    line(`  ${showKey(k)}`)
    line(`    file:  ${ed.verses.get(k)}`)
    line(`    plain: ${plainDocx(ed.verses.get(k) ?? '')}`)
  }
  const p23 = ed.headings.filter((h) => h.id === 'psalms' && h.c === 23)
  line('  Headings before Psalm 23:', p23.map((h) => `${h.style} "${h.text}"`).join('; ') || 'none')
  const p119 = ed.headings.filter((h) => h.id === 'psalms' && h.c === 119 && h.v === 1)
  line('  Headings before Psalm 119:1:', p119.map((h) => `${h.style} "${h.text}"`).join('; ') || 'none')
  const emptyC = [...ed.verses].filter(([, r]) => !plainDocx(r))
  line('Verses with no words:', emptyC.length, emptyC.map(([k]) => showKey(k)).join(', '))
}

/** Matches the headings of the site and of edition C. */
function compareStructure(ed, st, siteText) {
  section('Step 11. Section headings and cross-reference lines: edition C and the site data')
  const place = (h) => `${ref(h.id, h.c, h.v)}${h.mid ? ' (middle of the verse)' : ''}`
  const CLASS = { s1: 'main', hdg: 'main', s2: 'smaller', subhdg: 'smaller' }
  const siteH = st.headings.map((h) => ({ ...h, cls: CLASS[h.style] ?? h.style }))
  const cH = ed.headings.map((h) => ({ ...h, cls: CLASS[h.style] ?? h.style }))
  const count = (list) => {
    const m = counter()
    for (const h of list) m.add(h.style)
    return [...m.map].map(([s, n]) => `${s} ${n}`).join(', ')
  }
  line('Site data headings:', count(siteH), ' Cross-reference lines:', st.xrefs.length)
  line('Edition C headings:', count(cH), ' Cross-reference lines:', ed.xrefs.length)
  line('The script compares s1 with hdg (main section headings) and s2 with subhdg (smaller headings).')

  for (const cls of ['main', 'smaller']) {
    const a = siteH.filter((h) => h.cls === cls)
    const b = cH.filter((h) => h.cls === cls)
    const used = new Set()
    const sameKey = (x, y) => x.id === y.id && x.c === y.c && x.v === y.v && x.mid === y.mid
    const pairs = { same: [], words: [], verse: [] }
    const left = []
    // 1. The same words at the same place.
    for (const x of a) {
      const y = b.find((y) => !used.has(y) && sameKey(x, y) && x.text === y.text)
      if (y) {
        used.add(y)
        pairs.same.push([x, y])
      } else left.push(x)
    }
    // 2. Different words at the same place.
    const left2 = []
    for (const x of left) {
      const y = b.find((y) => !used.has(y) && sameKey(x, y))
      if (y) {
        used.add(y)
        pairs.words.push([x, y])
      } else left2.push(x)
    }
    // 3. The same words in the same book at a different place.
    const onlySite = []
    for (const x of left2) {
      const y = b.find((y) => !used.has(y) && y.id === x.id && y.text === x.text)
      if (y) {
        used.add(y)
        pairs.verse.push([x, y])
      } else onlySite.push(x)
    }
    const onlyC = b.filter((y) => !used.has(y))
    line(`\n${cls === 'main' ? 'Main section headings' : 'Smaller headings'}: site ${a.length}, edition C ${b.length}`)
    line('  The same words at the same place:', pairs.same.length)
    line('  Different words at the same place:', pairs.words.length)
    for (const [x, y] of pairs.words.slice(0, 50)) line(`    ${place(x)}: site "${x.text}", C "${y.text}"`)
    line('  The same words before a different verse:', pairs.verse.length)
    for (const [x, y] of pairs.verse.slice(0, 50)) line(`    "${x.text}": site ${place(x)}, C ${place(y)}`)
    line('  Only in the site data:', onlySite.length)
    for (const x of onlySite.slice(0, 50)) line(`    ${place(x)}: "${x.text}"`)
    line('  Only in edition C:', onlyC.length)
    for (const y of onlyC.slice(0, 50)) line(`    ${place(y)}: "${y.text}"`)
  }

  line('\nOther headings, not compared one by one:')
  for (const s of ['ms', 'd', 'qa']) line(`  site ${s}:`, siteH.filter((h) => h.style === s).length, spread(siteH.filter((h) => h.style === s), 3).map((h) => `"${h.text}" ${place(h)}`).join('; '))
  for (const s of ['suphdg', 'acrostic']) line(`  C ${s}:`, cH.filter((h) => h.style === s).length, spread(cH.filter((h) => h.style === s), 3).map((h) => `"${h.text}" ${place(h)}`).join('; '))

  // Cross-reference lines, by the verse that comes after them.
  const cx = new Map(ed.xrefs.map((x) => [key(x.id, x.c, x.v), x]))
  const sx = new Map(st.xrefs.map((x) => [key(x.id, x.c, x.v), x]))
  const xWords = [...sx].filter(([k, x]) => cx.has(k) && cx.get(k).t !== x.t)
  line('\nCross-reference lines: site', sx.size, ' edition C', cx.size)
  line('  At the same verse in both:', [...sx.keys()].filter((k) => cx.has(k)).length)
  line('  Only in the site data:', [...sx.keys()].filter((k) => !cx.has(k)).map(showKey).join(', ') || 'none')
  line('  Only in edition C:', [...cx.keys()].filter((k) => !sx.has(k)).map(showKey).join(', ') || 'none')
  line('  At the same verse with different words:', xWords.length)
  for (const [k, x] of xWords.slice(0, 50)) line(`    ${showKey(k)}: site "${x.t}", C "${cx.get(k).t}"`)

  line('\nThe headings of the site data in the middle of a verse, and their place in edition C:')
  for (const h of siteH.filter((h) => h.mid)) {
    const inC = cH.filter((y) => y.id === h.id && y.c === h.c && y.text === h.text)
    line(`  ${h.style} "${h.text}" in ${ref(h.id, h.c, h.v)}: ${inC.length ? inC.map(place).join('; ') : 'no heading with these words in this chapter of edition C'}`)
  }

  // Where edition C starts a paragraph.
  section('Step 11. Where edition C starts a new paragraph')
  const siteStarts = new Set()
  for (const book of siteText)
    for (const ch of book.chapters)
      for (const b of ch.blocks) if (b.k === 'p' && typeof b.c[0] === 'object' && 'v' in b.c[0]) siteStarts.add(key(book.id, ch.n, b.c[0].v))
  const tps = ed.textParas.filter((t) => t.verses > 0 || !t.mid)
  const afterHeading = new Set(ed.headings.map((h) => key(h.id, h.c, h.v)))
  const atVerse = tps.filter((t) => !t.mid)
  line('Text paragraphs:', ed.textParas.length, ' Verses:', ed.verses.size)
  line('Paragraphs that start at a verse:', atVerse.length, ' in the middle of a verse:', ed.textParas.filter((t) => t.mid).length)
  line('Paragraphs with one verse:', ed.textParas.filter((t) => t.verses === 1).length, ' with more than one verse:', ed.textParas.filter((t) => t.verses > 1).length)
  line('Paragraphs that start after a heading:', atVerse.filter((t) => afterHeading.has(key(t.id, t.c, t.first))).length, ' at a verse with no heading before it:', atVerse.filter((t) => !afterHeading.has(key(t.id, t.c, t.first))).length)
  const match = atVerse.filter((t) => siteStarts.has(key(t.id, t.c, t.first)))
  line('Paragraphs that start at a verse where a paragraph or a poetry line of the site data starts:', match.length)
  const firstOfChapter = atVerse.filter((t) => t.first === 1).length
  line('Paragraphs that start at verse 1 of a chapter:', firstOfChapter)
  line('Five paragraphs that start where no site text block starts:', spread(atVerse.filter((t) => !siteStarts.has(key(t.id, t.c, t.first))), 5).map((t) => ref(t.id, t.c, t.first)).join(', '))
}

// ---- run ----

const A = readUsfm(join(DIR, 'a', 'usfm'))
const B = readUsfm(join(DIR, 'b', 'usfm'))
reportUsfm('A', A)
reportUsfm('B', B)

const docxPath = join(DIR, 'c', 'docx', 'word', 'document.xml')
const C = existsSync(docxPath) ? readDocx(docxPath) : null
if (C) reportDocx(C)
else {
  section('Step 5. Edition C')
  line(`No file ${docxPath}. The script skips edition C.`)
}

compare('edition A and edition B', A.verses, B.verses, plainUsfm, plainUsfm)
if (C) {
  const diff = compare('edition A and edition C', A.verses, C.verses, plainUsfm, plainDocx)
  // The causes of the differences in the letters of the words. Edition A has each Psalm title as a
  // \d heading before verse 1; edition C has the title in the words of the verse.
  const titles = new Map(A.headings.filter((h) => h.marker === 'd').map((h) => [key(h.id, h.c, h.v), h.text]))
  const lig = (s) => s.replace(/æ/g, 'ae').replace(/Æ/g, 'Ae').replace(/œ/g, 'oe').replace(/Œ/g, 'Oe')
  const letters = diff.filter((d) => bare(d.a) !== bare(d.b))
  const why = counter()
  const rest = []
  for (const d of letters) {
    const k = d.k
    if (titles.has(k) && bare(titles.get(k) + ' ' + d.a) === bare(d.b)) why.add('edition C has the Psalm title in verse 1')
    else if (titles.has(k) && bare(lig(titles.get(k) + ' ' + d.a)) === bare(lig(d.b))) why.add('the Psalm title, and æ or œ')
    else if (k.startsWith('psalms 119:') && bare(d.b.replace(/^[A-Z]+\. /, '')) === bare(d.a)) why.add('edition C starts the verse with the name of a Hebrew letter')
    else if (bare(lig(d.a)) === bare(lig(d.b))) why.add('only "æ" or "œ" against "ae" or "oe"')
    else rest.push(d)
  }
  line('The verses with a difference in the letters of the words, by cause:')
  for (const [w, n] of why.map) line(`  ${w}: ${n}`)
  line(`  other differences: ${rest.length}`)
  const words = counter()
  const firstAt = new Map()
  for (const d of rest) {
    const wa = bare(lig(d.a)).split(' ')
    const wb = bare(lig(d.b)).split(' ')
    const ca = counter()
    for (const w of wa) ca.add(w)
    for (const w of wb) ca.add(w, -1)
    const gone = [...ca.map].filter(([, n]) => n > 0).map(([w]) => w)
    const added = [...ca.map].filter(([, n]) => n < 0).map(([w]) => w)
    const w = `A "${gone.join(' ')}", C "${added.join(' ')}"`
    words.add(w)
    if (!firstAt.has(w)) firstAt.set(w, showKey(d.k))
  }
  line('  the word changes in the other differences, with the first verse of each:')
  for (const [w, n] of [...words.map].sort((x, y) => y[1] - x[1])) line(`    ${n} x ${w} (first: ${firstAt.get(w)})`)
  line('  ten examples of the other differences:')
  for (const d of spread(rest, 10)) {
    line(`    ${showKey(d.k)}`)
    line(`      A: ${d.a}`)
    line(`      C: ${d.b}`)
  }
}

// Step 7.
section('Step 7. The verses of edition A and sources/bsb/bsb.txt')
const bsb = readBsbTxt()
const aNotBsb = [...A.verses.keys()].filter((k) => !bsb.has(k)).sort(byBibleOrder)
line('Verses of edition A with no line in bsb.txt:', aNotBsb.length, aNotBsb.map(showKey).join(', '))
const empty = [...bsb.keys()].filter((k) => bsb.get(k) === '').sort(byBibleOrder)
line('Verses with no words in bsb.txt:', empty.length)
for (const k of empty) line(`  ${showKey(k)}: edition A ${A.verses.has(k) ? 'has words: ' + plainUsfm(A.verses.get(k)) : 'has no such verse'}`)
const bsbNotA = [...bsb.keys()].filter((k) => !A.verses.has(k)).sort(byBibleOrder)
line('Verses of bsb.txt that edition A does not have:', bsbNotA.length, bsbNotA.map(showKey).join(', '))
// The site data shows a note at the place of a verse that the main text does not have: an item
// { o: <verse>, note } in a text block.
const site = readSiteText()
const noteAt = new Set()
for (const book of site)
  for (const ch of book.chapters)
    for (const b of ch.blocks) if (b.k === 'p') for (const it of b.c) if (typeof it === 'object' && 'o' in it) noteAt.add(key(book.id, ch.n, it.o))
line('Notes { o } in public/data/text:', noteAt.size, ' Verses with no words in bsb.txt and no note:', empty.filter((k) => !noteAt.has(k)).map(showKey).join(', ') || 'none')
if (C) line('Verses of edition C: the same keys as edition A:', C.verses.size === A.verses.size && [...A.verses.keys()].every((k) => C.verses.has(k)))

// Step 8.
section('Step 8. Link passages whose first verse or last verse is not in edition A')
const links = readLinks()
line('Links:', links.length, ' Passages:', links.length * 2)
const bad = []
for (const l of links) {
  for (const side of ['a', 'b']) {
    const p = l[side]
    const first = key(p.book, p.c, p.v)
    const last = key(p.book, p.c2 ?? p.c, p.v2 ?? p.v)
    const miss = [first, last].filter((k, i) => !A.verses.has(k) && (i === 0 || last !== first))
    if (miss.length) bad.push(`${l.id} (${l.type}) ${side}: ${showKey(first)}${last !== first ? ' to ' + showKey(last) : ''}; not in A: ${miss.map(showKey).join(', ')}`)
  }
}
line('Passages:', bad.length)
for (const b of bad) line(' ', b)

// Step 9.
section('Step 9. Reason lines of the quotation links')
const quotes = links.filter((l) => l.type === 'quotation')
const quoted = quotes.filter((l) => /[“"][^”"]+[”"]/.test(l.reason ?? ''))
line('Quotation links:', quotes.length, ' With words between quotation marks:', quoted.length, ' With no reason line:', quotes.filter((l) => !l.reason).length)
for (const l of spread(quoted, 5)) line(`  ${l.id}: ${l.reason}`)

// Step 10.
section('Step 10. Where the structure of the Berean files cuts a verse')
const st = siteStructure(site)
const hStyles = counter()
const hMid = counter()
for (const h of st.headings) {
  hStyles.add(h.style)
  if (h.mid) hMid.add(h.style)
}
line('Heading blocks by style:', [...hStyles.map].map(([s, n]) => `${s} ${n}`).join(', '))
line('Headings in the middle of a verse, by style:', [...hMid.map].map(([s, n]) => `${s} ${n}`).join(', ') || 'none')
for (const h of st.headings.filter((h) => h.mid)) line(`  ${h.style} "${h.text}" in ${ref(h.id, h.c, h.v)}`)
const bStyles = counter()
const bMid = counter()
for (const b of st.blocks) {
  bStyles.add(b.style)
  if (b.mid) bMid.add(b.style)
}
line('Text blocks by style, and those that start in the middle of a verse:')
for (const [s, n] of [...bStyles.map].sort((x, y) => y[1] - x[1])) line(`  ${s}: ${n} blocks, ${bMid.map.get(s) ?? 0} start in the middle of a verse`)
const allVerses = st.blocksOfVerse.size
let paraOnly = 0
let poetryOnly = 0
let mixed = 0
for (const set of st.blocksOfVerse.values()) {
  if (set.size < 2) continue
  const styles = [...set].map((i) => st.blocks[i].style)
  const p = styles.some((s) => POETRY.has(s))
  const q = styles.some((s) => !POETRY.has(s))
  if (p && q) mixed++
  else if (p) poetryOnly++
  else paraOnly++
}
const split = paraOnly + poetryOnly + mixed
line('Verses with words:', allVerses)
line('Verses with words in more than one text block:', split, `(${pct(split, allVerses)})`)
line(`  only in paragraph styles (${[...bStyles.map.keys()].filter((s) => !POETRY.has(s)).join(', ')}):`, paraOnly, `(${pct(paraOnly, allVerses)})`)
line(`  only in poetry styles (${[...POETRY].join(', ')}):`, poetryOnly, `(${pct(poetryOnly, allVerses)})`)
line('  in a paragraph style and a poetry style:', mixed, `(${pct(mixed, allVerses)})`)

// Step 11.
if (C) compareStructure(C, st, site)
else {
  section('Step 11')
  line('No file of edition C. The script skips step 11.')
}
