// Prints the numbers and the lists of the World English Bible report. docs/TASKS.md Task 29, steps 5 to 12.
//
// Usage: node scripts/web-report.mjs <folder>
//
// The folder is a temporary folder outside the repository. The script only reads files. It expects:
//   <folder>/a/usfm/*.usfm               edition A, the USFM files of https://eBible.org/Scriptures/engwebp_usfm.zip
//   <folder>/b/usfm/*.usfm               edition B, the USFM files of https://eBible.org/Scriptures/eng-web_usfm.zip
//   <folder>/c/docx/word/document.xml    edition C, unpacked from a copy of resources/web.docx
//
// The plain words of a verse, as in scripts/kjv-report.mjs: the words that remain when the script removes
// the USFM markers, the Strong's numbers, the footnotes, the cross-reference notes, and the published verse
// numbers (\vp). Then it changes each run of spaces to one space. For edition C, the plain words are the text
// of the verse without square brackets. The script changes nothing else: not the letter case, not the
// punctuation, not the spelling.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const DIR = process.argv[2]
if (!DIR) throw new Error('usage: node scripts/web-report.mjs <folder>')
const ROOT = join(import.meta.dirname, '..')

// The 66 USFM book codes in the order of public/data/books.json.
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
const fmtCounts = (m) => [...m].map(([k, n]) => `${k} ${n}`).join(', ')

// ---- USFM: editions A and B ----

/** Line markers whose text is words of a verse: paragraphs, poetry lines, list items, and blank lines. */
const PARA = new Set(['p', 'm', 'q', 'q1', 'q2', 'q3', 'q4', 'b', 'nb', 'mi', 'pi', 'pi1', 'pi2', 'pc', 'pm', 'pmo', 'pmc', 'pmr', 'li', 'li1', 'li2', 'li3', 'qm1', 'qm2', 'qr', 'qd', 'lit'])
/** Line markers of headings and titles. */
const HEADING = /^(s\d?|ms\d?|mr|d|qa|qc|sp|r|cl|sr|mt\d?|imt\d?|is\d?)$/
/** Line markers of the book head and of introductions. Their text is not words of a verse. */
const HEAD = /^(id|ide|h|toc\d|mt\d?|imt\d?|is\d?|ip|ipi|im|imi|ipq|imq|ipr|iq\d?|ib|ili\d?|iot|io\d?|ior|iex|ie|rem|cp|ca|va|usfm|sts)$/

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
    headings: [], // { marker, text, id, c, v, raw } where v is the verse that comes next
    footnotes: [], // { key, raw }
    xnotes: [], // { key, raw }
    markers: counter(),
    lineMarkers: counter(),
    unknownLines: [], // line markers that the script does not know, with their text
    dWithVerse: [], // \d lines that hold a verse marker
    other: [], // books that are not in the 66 books
    chapters: 0,
    books: 0,
    names: [],
    files: new Map(), // code -> file text
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
    ed.files.set(code, text)
    if (h !== nameOf.get(id)) ed.names.push(`${code}: "${h}" in the file, "${nameOf.get(id)}" in books.json`)
    for (const m of text.matchAll(/\\\+?[a-z0-9]+\*?/g)) ed.markers.add(m[0])
    let c = 0
    let cur = null
    const pending = []
    for (const rawLine of text.split(/\r?\n/)) {
      const m = /^\\([a-z0-9]+)\s?(.*)$/.exec(rawLine.trim())
      if (!m) {
        if (rawLine.trim() && cur) ed.verses.set(cur, ed.verses.get(cur) + ' ' + rawLine.trim())
        else if (rawLine.trim()) ed.unknownLines.push(`${code} ${c}: text with no marker before the first verse: ${rawLine.trim().slice(0, 80)}`)
        continue
      }
      const [, marker, rest] = m
      ed.lineMarkers.add(`\\${marker}`)
      if (marker === 'c') {
        c = +rest.trim().split(/\s/)[0]
        ed.chapters++
        cur = null
        continue
      }
      if (HEADING.test(marker) && !HEAD.test(marker)) {
        if (/\\v \d/.test(rest)) ed.dWithVerse.push(`${code} ${c}: \\${marker} ${rest.slice(0, 80)}`)
        if (c > 0) {
          const hd = { marker, text: plainUsfm(rest), id, c, v: null, raw: rest }
          ed.headings.push(hd)
          pending.push(hd)
        }
        continue
      }
      if (HEAD.test(marker)) continue
      if (!PARA.has(marker) && marker !== 'v') {
        ed.unknownLines.push(`${code} ${c}: \\${marker} ${rest.slice(0, 80)}`)
        continue
      }
      let body = rest
      if (marker === 'v') body = '\\v ' + rest
      for (const part of body.split(/(?=\\v \d)/)) {
        const vm = /^\\v (\d+)\S*\s?([\s\S]*)$/.exec(part)
        if (vm) {
          cur = key(id, c, +vm[1])
          if (ed.verses.has(cur)) throw new Error(`verse twice: ${cur}`)
          ed.verses.set(cur, vm[2])
          ed.order.push(cur)
          for (const hd of pending.splice(0)) hd.v = +vm[1]
        } else if (part.trim() && cur) ed.verses.set(cur, ed.verses.get(cur) + ' ' + part)
        else if (part.trim()) ed.unknownLines.push(`${code} ${c}: words before the first verse: ${part.slice(0, 80)}`)
      }
    }
  }
  for (const [k, raw] of ed.verses) {
    for (const f of raw.matchAll(/\\f [\s\S]*?\\f\*/g)) ed.footnotes.push({ key: k, raw: f[0] })
    for (const x of raw.matchAll(/\\x [\s\S]*?\\x\*/g)) ed.xnotes.push({ key: k, raw: x[0] })
  }
  return ed
}

const NAMES = ['Yahweh', 'Yah', 'LORD', 'GOD', 'Jehovah']
/** The number of times that a name occurs as a whole word, with this letter case, in a list of plain texts. */
function nameCount(texts, name) {
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${name}(?![\\p{L}\\p{N}])`, 'gu')
  let n = 0
  for (const t of texts) n += (t.match(re) ?? []).length
  return n
}

const SAMPLE = (order) => {
  const last3john = Math.max(...order.filter((k) => k.startsWith('3-john 1:')).map((k) => parseKey(k).v))
  return [key('genesis', 1, 1), key('genesis', 2, 4), key('psalms', 23, 1), key('isaiah', 12, 2), key('matthew', 5, 3), key('john', 3, 16), key('3-john', 1, last3john)]
}

function reportUsfm(label, ed) {
  section(`Step 5. Edition ${label}: books, chapters, verses`)
  line('Books of the 66:', ed.books, ' Chapters:', ed.chapters, ' Verses:', ed.verses.size)
  line('Other books, not counted:', ed.other.length, ed.other.length ? ed.other.join('; ') : 'none')
  line('Book names in \\h that differ from books.json:', ed.names.length ? ed.names.join('; ') : 'none')
  const chapterCount = new Map()
  for (const k of ed.order) {
    const p = parseKey(k)
    chapterCount.set(p.id, Math.max(chapterCount.get(p.id) ?? 0, p.c))
  }
  const wrong = books.filter((b) => chapterCount.get(b.id) !== b.chapters)
  line('Books whose last chapter differs from books.json:', wrong.length ? wrong.map((b) => `${b.id} ${chapterCount.get(b.id)}`).join(', ') : 'none')
  const emptyV = ed.order.filter((k) => !plainUsfm(ed.verses.get(k)))
  line('Verses with a number and no words:', emptyV.length, emptyV.map(showKey).join(', '))
  for (const k of emptyV) line(`  ${showKey(k)}: file: ${ed.verses.get(k).trim()}`)

  section(`Step 5. Edition ${label}: USFM markers in the 66 books`)
  line([...ed.markers.map].sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1)).map(([k, n]) => `${k} ${n}`).join(', '))
  line('Line markers (a marker at the start of a line):', [...ed.lineMarkers.map].sort((x, y) => y[1] - x[1]).map(([k, n]) => `${k} ${n}`).join(', '))
  line('Lines that the script did not read as words or headings:', ed.unknownLines.length)
  for (const x of ed.unknownLines.slice(0, 30)) line(' ', x)
  line('Heading lines with a verse marker in them:', ed.dWithVerse.length, ed.dWithVerse.slice(0, 5).join(' | '))

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
    for (const [t, n] of [...cnt.map].sort((x, y) => y[1] - x[1]).slice(0, 12)) line(`  ${n} x "${t}" (first: ${where.get(t)})`)
  }

  section(`Step 5. Edition ${label}: footnotes and cross-reference notes`)
  line('Footnotes (\\f):', ed.footnotes.length, ' Verses with a footnote:', new Set(ed.footnotes.map((f) => f.key)).size)
  for (const f of spread(ed.footnotes, 5)) line(`  ${showKey(f.key)}: ${f.raw}`)
  // The footnotes that are not in the words of a verse: in a heading line or a title line (\d), or in a
  // chapter before its first verse marker.
  const outside = []
  for (const [code, text] of ed.files) {
    let c = 0
    let v = 0
    for (const l of text.split(/\r?\n/)) {
      const t = l.trim()
      const cm = /^\\c (\d+)/.exec(t)
      if (cm) {
        c = +cm[1]
        v = 0
        continue
      }
      const vm = /\\v (\d+)/.exec(t)
      if (vm) v = +vm[1]
      const marker = /^\\([a-z0-9]+)/.exec(t)?.[1] ?? ''
      if (/\\f /.test(t) && (v === 0 || HEAD.test(marker) || (HEADING.test(marker) && !vm))) outside.push(`${nameOf.get(idOfCode.get(code))} ${c}: ${t}`)
    }
  }
  line('Footnotes in a heading line, a title line, or a chapter before its first verse:', outside.length)
  for (const o of outside) line(`  ${o}`)
  line('Cross-reference notes (\\x):', ed.xnotes.length, ' Verses with a cross-reference note:', new Set(ed.xnotes.map((f) => f.key)).size)
  for (const f of spread(ed.xnotes, 5)) line(`  ${showKey(f.key)}: ${f.raw}`)

  section(`Step 5. Edition ${label}: added words`)
  let groups = 0
  let verses = 0
  for (const raw of ed.verses.values()) {
    const n = (raw.replace(/\\f [\s\S]*?\\f\*/g, '').match(/\\\+?add /g) ?? []).length
    groups += n
    if (n) verses++
  }
  line(`\\add and \\+add groups in the verse text, not in footnotes: ${groups} in ${verses} verses`)
  const brackets = [...ed.verses].filter(([, r]) => /[[\]]/.test(plainUsfm(r)))
  line('Verses whose plain words have "[" or "]":', brackets.length, spread(brackets, 5).map(([k, r]) => `${showKey(k)}: ${plainUsfm(r)}`).join(' | '))

  section(`Step 5. Edition ${label}: the title of a Psalm`)
  for (const c of [3, 23]) {
    const hd = ed.headings.filter((h) => h.id === 'psalms' && h.c === c)
    line(`  Psalm ${c}: headings before a verse: ${hd.map((h) => `\\${h.marker} "${h.text}" before verse ${h.v}`).join('; ') || 'none'}`)
    line(`    verse 1, file:  ${ed.verses.get(key('psalms', c, 1))?.trim()}`)
    line(`    verse 1, plain: ${plainUsfm(ed.verses.get(key('psalms', c, 1)) ?? '')}`)
  }
  const d = ed.headings.filter((h) => h.marker === 'd')
  line('Lines \\d:', d.length, ' in Psalms:', d.filter((h) => h.id === 'psalms').length, ' other books:', d.filter((h) => h.id !== 'psalms').map((h) => `${ref(h.id, h.c, h.v)} "${h.text}"`).join('; ') || 'none')
  // A \d line that is not before verse 1: for example the letter names of an acrostic Psalm.
  const notFirst = d.filter((h) => h.v !== 1)
  const notFirstCh = counter()
  for (const h of notFirst) notFirstCh.add(`${nameOf.get(h.id)} ${h.c}`)
  line('Lines \\d that are not before verse 1:', notFirst.length, ' by chapter:', fmtCounts(notFirstCh.map) || 'none')
  line('  ', notFirst.map((h) => `${ref(h.id, h.c, h.v)} "${h.text}"`).join('; '))
  line('Chapters with a \\d line before verse 1:', new Set(d.filter((h) => h.v === 1).map((h) => `${h.id} ${h.c}`)).size)

  section(`Step 5. Edition ${label}: names of God in the plain words`)
  const plain = [...ed.verses.values()].map(plainUsfm)
  const headingsPlain = ed.headings.map((h) => h.text)
  for (const n of NAMES) line(`  "${n}": ${nameCount(plain, n)} in verses, ${nameCount(headingsPlain, n)} in headings and titles`)

  section(`Step 5. Edition ${label}: seven verses, as in the file and as plain words`)
  for (const k of SAMPLE(ed.order)) {
    line(`  ${showKey(k)}`)
    line(`    file:  ${ed.verses.get(k)?.trim()}`)
    line(`    plain: ${plainUsfm(ed.verses.get(k) ?? '')}`)
  }
}

// ---- the .docx file: edition C, with the method of scripts/kjv-report.mjs ----

const C_HEADINGS = new Set(['hdg', 'subhdg', 'suphdg', 'acrostic'])
const xmlText = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
/** The plain words of edition C: the text without square brackets. */
const plainDocx = (raw) => raw.replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim()

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
    styles: counter(),
    runStyles: counter(),
    verses: new Map(),
    order: [],
    headings: [],
    xrefs: [],
    textParas: [],
    bookNames: [],
    chapters: 0,
    noVerse: [],
    other: [],
    twice: [],
  }
  let bookName = null
  let id = null
  let c = 0
  let cur = null
  const pending = []
  for (let i = 0; i < paras.length; i++) {
    const p = paras[i]
    ed.styles.add(p.style ?? '(none)')
    for (const x of p.items) if (x.r) ed.runStyles.add(x.r)
    const plain = p.text.trim()
    const chap = /^(.+) (\d+)$/.exec(plain)
    if (!p.style && chap && paras[i + 1]?.text.trim().startsWith('WEB')) {
      if (chap[1] !== bookName) {
        bookName = chap[1]
        ed.bookNames.push(bookName)
        id = books[ed.bookNames.length - 1]?.id ?? null
      }
      c = +chap[2]
      ed.chapters++
      cur = null
      i++ // the "WEB" line
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
    const first = p.items.find((x) => x.t && x.t.trim())
    const startsAtVerse = first?.r === 'reftext1'
    const tp = { style: p.style ?? '(none)', id, c, mid: !startsAtVerse, first: null, verses: 0 }
    let skipSpace = false
    for (const x of p.items) {
      if (x.r === 'reftext1') {
        cur = key(id, c, +x.t.trim())
        if (ed.verses.has(cur)) ed.twice.push(cur)
        else {
          ed.verses.set(cur, '')
          ed.order.push(cur)
        }
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
  line('Paragraphs:', ed.paragraphs, ' Paragraph styles:', fmtCounts(ed.styles.map))
  line('Run styles:', fmtCounts(ed.runStyles.map))
  line('Runs with the style reftext1 (verse numbers):', ed.runStyles.map.get('reftext1') ?? 0)
  line('Text paragraphs after the first chapter line:', ed.textParas.length)
  line('Text paragraphs with no verse number:', ed.noVerse.length)
  for (const x of ed.noVerse.slice(0, 20)) line(' ', x)
  line('Text that the script did not give to a verse:', ed.other.length, ed.other.slice(0, 5).join(' | '))
  line('Verse numbers that occur a second time in a chapter:', ed.twice.length, ed.twice.slice(0, 10).map(showKey).join(', '))
  const rights = paragraphsText.filter((t) => /copyright|public domain|licen[cs]|rights|permission|trademark|ebible|©/i.test(t))
  line('Paragraphs with the words copyright, public domain, licence, rights, permission, trademark, eBible, or ©:', rights.length)
  for (const t of rights.slice(0, 10)) line('  ', t.slice(0, 200))
  const parts = []
  const walk = (dir, rel) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(dir, e.name), `${rel}${e.name}/`)
      else parts.push(`${rel}${e.name}`)
    }
  }
  walk(join(DIR, 'c', 'docx'), '')
  const otherParts = parts.filter((p) => p !== 'word/document.xml')
  const hits = otherParts.filter((p) => /copyright|public domain|licen[cs]e|rights reserved|trademark|©/i.test(readFileSync(join(DIR, 'c', 'docx', p), 'utf8')))
  line(`The other parts of the file (${otherParts.length}): ${otherParts.join(', ')}`)
  line('Other parts with the words copyright, public domain, licence, rights reserved, trademark, or ©:', hits.length ? hits.join(', ') : 'none')
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
  const emptyC = ed.order.filter((k) => !plainDocx(ed.verses.get(k)))
  line('Verses with a number and no words:', emptyC.length, emptyC.map(showKey).join(', '))

  section('Step 5. Edition C: headings and cross-reference lines')
  const hs = counter()
  for (const h of ed.headings) hs.add(h.style)
  line('Headings by style:', fmtCounts(hs.map))
  line('Section headings (hdg):', hs.map.get('hdg') ?? 0, ' Cross-reference lines:', ed.xrefs.length)

  section('Step 5. Edition C: footnotes and cross-reference notes')
  line('The file has a footnote part (word/footnotes.xml):', existsSync(join(DIR, 'c', 'docx', 'word', 'footnotes.xml')))
  line('The file has an endnote part (word/endnotes.xml):', existsSync(join(DIR, 'c', 'docx', 'word', 'endnotes.xml')))

  section('Step 5. Edition C: added words')
  let groups = 0
  let verses = 0
  for (const raw of ed.verses.values()) {
    const n = (raw.match(/\[[^\]]*\]/g) ?? []).length
    groups += n
    if (n) verses++
  }
  line(`Groups in square brackets: ${groups} in ${verses} verses`)
  for (const [k, r] of spread([...ed.verses].filter(([, r]) => /\[/.test(r)), 5)) line(`  ${showKey(k)}: ${r}`)

  section('Step 5. Edition C: the title of a Psalm')
  for (const c of [3, 23]) {
    const hd = ed.headings.filter((h) => h.id === 'psalms' && h.c === c)
    line(`  Psalm ${c}: headings: ${hd.map((h) => `${h.style} "${h.text}" before verse ${h.v}`).join('; ') || 'none'}`)
    line(`    verse 1: ${ed.verses.get(key('psalms', c, 1))}`)
  }

  section('Step 5. Edition C: names of God in the plain words')
  const plain = [...ed.verses.values()].map(plainDocx)
  for (const n of NAMES) line(`  "${n}": ${nameCount(plain, n)} in verses, ${nameCount(ed.headings.map((h) => h.text), n)} in headings`)
  line(`  All paragraphs of word/document.xml: ${NAMES.map((n) => `"${n}" ${nameCount(paragraphsText, n)}`).join(', ')}`)

  section('Step 5. Edition C: seven verses, as in the file and as plain words')
  for (const k of SAMPLE(ed.order)) {
    line(`  ${showKey(k)}`)
    line(`    file:  ${ed.verses.get(k)}`)
    line(`    plain: ${plainDocx(ed.verses.get(k) ?? '')}`)
  }
}

// ---- step 6: comparison of plain words ----

const GOD = /(?<![\p{L}\p{N}])(Yahweh|Yah|LORD|GOD)(?![\p{L}\p{N}])/gu
const godSign = (s) => s.replace(GOD, '#')

function compare(label, x, y, plainX, plainY) {
  section(`Step 6. Plain words: ${label}`)
  const both = [...x.keys()].filter((k) => y.has(k)).sort(byBibleOrder)
  const diff = []
  for (const k of both) {
    const a = plainX(x.get(k))
    const b = plainY(y.get(k))
    if (a !== b) diff.push({ k, a, b })
  }
  line('Verses in both:', both.length, ' Verses whose plain words differ:', diff.length)
  const onlyX = [...x.keys()].filter((k) => !y.has(k)).sort(byBibleOrder)
  const onlyY = [...y.keys()].filter((k) => !x.has(k)).sort(byBibleOrder)
  line('Verses only in the first:', onlyX.length, onlyX.map(showKey).join(', '), ' only in the second:', onlyY.length, onlyY.map(showKey).join(', '))
  return diff
}

function examples(list, n, la, lb) {
  for (const d of spread(list, n)) {
    line(`  ${showKey(d.k)}`)
    line(`    ${la}: ${d.a}`)
    line(`    ${lb}: ${d.b}`)
  }
}

// ---- the Berean files and the site data ----

function readBsbTxt() {
  const order = []
  const verses = new Map()
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

const readSite = (dir) => books.map((b) => JSON.parse(readFileSync(join(ROOT, 'public', 'data', dir, `${b.id}.json`), 'utf8')))

function readLinks() {
  const byId = new Map()
  for (const b of books) {
    const d = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'links', `${b.id}.json`), 'utf8'))
    for (const l of d.links) byId.set(l.id, l)
  }
  return [...byId.values()]
}

const letters = (t) => (t.match(/[\p{L}\p{N}]/gu) ?? []).length
const CLASSES = ['all', 'part', 'none']
const classOf = ({ inside, outside }) => (inside === 0 ? 'none' : outside === 0 ? 'all' : 'part')

/** For each verse of the site data: the letters inside and outside a words-of-Jesus mark (an item j). */
function siteMarks(site) {
  const map = new Map()
  for (const book of site) {
    for (const ch of book.chapters) {
      let v = 0
      for (const b of ch.blocks) {
        if (b.k !== 'p') continue
        for (const x of b.c) {
          if (typeof x === 'object' && 'v' in x) {
            v = x.v
            continue
          }
          if (!v) continue
          let t = null
          let inside = false
          if (typeof x === 'string') t = x
          else if ('a' in x) {
            t = x.a
            inside = x.j === 1
          } else if (typeof x.j === 'string') {
            t = x.j
            inside = true
          }
          if (t === null) continue
          const k = key(book.id, ch.n, v)
          if (!map.has(k)) map.set(k, { inside: 0, outside: 0 })
          map.get(k)[inside ? 'inside' : 'outside'] += letters(t)
        }
      }
    }
  }
  return map
}

/**
 * The words-of-Jesus marks of one USFM edition: for each book the start markers and the end markers, and for
 * each verse the letters inside and outside a mark. A mark can go on over a verse marker.
 */
function usfmMarks(ed) {
  const perBook = new Map()
  const verses = new Map()
  const problems = []
  for (const [code, text] of ed.files) {
    const id = idOfCode.get(code)
    const count = { start: 0, end: 0, verses: 0 }
    perBook.set(code, count)
    const body = text.replace(/\\f [\s\S]*?\\f\*/g, '').replace(/\\x [\s\S]*?\\x\*/g, '')
    let c = 0
    let v = 0
    let inside = false
    for (const rawLine of body.split(/\r?\n/)) {
      const t = rawLine.trim()
      const lm = /^\\([a-z0-9]+)\s?(.*)$/.exec(t)
      if (lm && lm[1] === 'c') {
        if (inside) problems.push(`${code} ${c}: a mark is open at the end of the chapter`)
        c = +lm[2].trim().split(/\s/)[0]
        v = 0
        continue
      }
      if (lm && (HEAD.test(lm[1]) || (HEADING.test(lm[1]) && !/\\v \d/.test(lm[2])))) {
        if (/\\\+?wj/.test(lm[2])) problems.push(`${code} ${c}: \\wj in a line \\${lm[1]}`)
        continue
      }
      // A line that starts with \v keeps its \v marker, so that the loop below reads the verse number.
      const rest = lm && lm[1] !== 'v' ? lm[2] : t
      for (const tok of rest.matchAll(/\\v (\d+)\S*\s?|\\(\+?)wj\*|\\(\+?)wj |\\\+?w ([^|\\]*)(?:\|[^\\]*)?\\\+?w\*|\\\+?[a-z0-9]+\*?\s?|([^\\]+)/g)) {
        if (tok[1] !== undefined) v = +tok[1]
        else if (tok[0].startsWith('\\wj*') || tok[0].startsWith('\\+wj*')) {
          count.end++
          if (!inside) problems.push(`${code} ${c}:${v}: an end marker with no start marker`)
          inside = false
        } else if (tok[0].startsWith('\\wj ') || tok[0].startsWith('\\+wj ')) {
          count.start++
          if (inside) problems.push(`${code} ${c}:${v}: a start marker inside an open mark`)
          inside = true
        } else {
          const words = tok[4] ?? tok[5]
          if (words === undefined || !v) continue
          const k = key(id, c, v)
          if (!verses.has(k)) verses.set(k, { inside: 0, outside: 0 })
          verses.get(k)[inside ? 'inside' : 'outside'] += letters(words)
        }
      }
    }
    for (const [k, e] of verses) if (k.startsWith(id + ' ') && e.inside > 0) count.verses++
  }
  return { perBook, verses, problems }
}

/** The structure of the site data: headings, text blocks, cross-reference lines. As scripts/kjv-report.mjs. */
function siteStructure(site) {
  const headings = []
  const xrefs = []
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
        const isWords = (it) => typeof it === 'string' || (typeof it === 'object' && typeof it.j === 'string')
        const mid = isWords(b.c[0])
        const nextV = mid ? verse : (b.c.find((it) => typeof it === 'object' && 'v' in it)?.v ?? verse)
        for (const hd of pending.splice(0)) {
          hd.mid = mid
          hd.v = nextV
        }
        for (const it of b.c) if (typeof it === 'object' && 'v' in it) verse = it.v
      }
    }
  }
  return { headings, xrefs }
}

function compareStructure(ed, st) {
  section('Step 11. Section headings and cross-reference lines: edition C and the site data')
  const place = (h) => `${ref(h.id, h.c, h.v)}${h.mid ? ' (middle of the verse)' : ''}`
  const CLASS = { s1: 'main', hdg: 'main', s2: 'smaller', subhdg: 'smaller' }
  const siteH = st.headings.map((h) => ({ ...h, cls: CLASS[h.style] ?? h.style }))
  const cH = ed.headings.map((h) => ({ ...h, cls: CLASS[h.style] ?? h.style }))
  const count = (list) => {
    const m = counter()
    for (const h of list) m.add(h.style)
    return fmtCounts(m.map)
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
    for (const x of a) {
      const y = b.find((y) => !used.has(y) && sameKey(x, y) && x.text === y.text)
      if (y) {
        used.add(y)
        pairs.same.push([x, y])
      } else left.push(x)
    }
    const left2 = []
    for (const x of left) {
      const y = b.find((y) => !used.has(y) && sameKey(x, y))
      if (y) {
        used.add(y)
        pairs.words.push([x, y])
      } else left2.push(x)
    }
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
  const cx = new Map(ed.xrefs.map((x) => [key(x.id, x.c, x.v), x]))
  const sx = new Map(st.xrefs.map((x) => [key(x.id, x.c, x.v), x]))
  const xWords = [...sx].filter(([k, x]) => cx.has(k) && cx.get(k).t !== x.t)
  line('\nCross-reference lines: site', sx.size, ' edition C', cx.size)
  line('  At the same verse in both:', [...sx.keys()].filter((k) => cx.has(k)).length)
  line('  Only in the site data:', [...sx.keys()].filter((k) => !cx.has(k)).map(showKey).join(', ') || 'none')
  line('  Only in edition C:', [...cx.keys()].filter((k) => !sx.has(k)).map(showKey).join(', ') || 'none')
  line('  At the same verse with different words:', xWords.length)
  for (const [k, x] of xWords.slice(0, 50)) line(`    ${showKey(k)}: site "${x.t}", C "${cx.get(k).t}"`)
}

// ---- run ----

const A = readUsfm(join(DIR, 'a', 'usfm'))
const B = readUsfm(join(DIR, 'b', 'usfm'))
reportUsfm('A', A)
reportUsfm('B', B)
const C = readDocx(join(DIR, 'c', 'docx', 'word', 'document.xml'))
reportDocx(C)

// Step 6.
const ab = compare('edition A and edition B', A.verses, B.verses, plainUsfm, plainUsfm)
const godOnly = ab.filter((d) => godSign(d.a) === godSign(d.b))
const abOther = ab.filter((d) => godSign(d.a) !== godSign(d.b))
line('  class "the name of God only":', godOnly.length)
line('  class "other":', abOther.length)
// A count for the report, not a class of the task: the "other" verses that are the same when the script
// also removes the word "the" or "The" before the sign.
const noThe = (s) => godSign(s).replace(/(?<![\p{L}\p{N}])(the|The) #/gu, '#')
line('  of the class "other", the same when the script also removes "the" or "The" before the sign:', abOther.filter((d) => noThe(d.a) === noThe(d.b)).length)
const abRest = abOther.filter((d) => noThe(d.a) !== noThe(d.b))
line('  of the class "other", different after that also:', abRest.length)
line('15 examples of the class "other":')
examples(abOther, 15, 'A', 'B')
line('15 examples of the class "other" that are different after the removal of "the" also:')
examples(abRest, 15, 'A', 'B')

const titlesA = new Map(A.headings.filter((h) => h.marker === 'd').map((h) => [key(h.id, h.c, h.v), h.text]))
const bare = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim()
for (const [label, x, plainX, ed] of [
  ['A', A.verses, plainUsfm, A],
  ['B', B.verses, plainUsfm, B],
]) {
  const diff = compare(`edition ${label} and edition C`, x, C.verses, plainX, plainDocx)
  const titles = new Map(ed.headings.filter((h) => h.marker === 'd').map((h) => [key(h.id, h.c, h.v), h.text]))
  const why = counter()
  const rest = []
  for (const d of diff) {
    if (titles.has(d.k) && plainDocx(d.b) === `${titles.get(d.k)} ${d.a}`) why.add('edition C has the Psalm title in the words of verse 1, the rest is the same')
    else if (bare(d.a) === bare(d.b)) why.add('only punctuation or letter case')
    else rest.push(d)
  }
  line('  The differences by cause:')
  for (const [w, n] of why.map) line(`    ${w}: ${n}`)
  line(`    other differences: ${rest.length}`)
  line(`15 examples of the other differences, ${label} and C:`)
  examples(rest, 15, label, 'C')
}
line('Psalm titles (\\d) in edition A:', titlesA.size)

// Step 7.
const bsb = readBsbTxt()
for (const [label, ed] of [
  ['A', A],
  ['B', B],
]) {
  section(`Step 7. The verses of edition ${label} and sources/bsb/bsb.txt`)
  const notBsb = [...ed.verses.keys()].filter((k) => !bsb.has(k)).sort(byBibleOrder)
  line('Verses of the edition with no line in bsb.txt:', notBsb.length, notBsb.map(showKey).join(', '))
  const empty = [...bsb.keys()].filter((k) => bsb.get(k) === '').sort(byBibleOrder)
  line('Verses with no words in bsb.txt:', empty.length)
  for (const k of empty) line(`  ${showKey(k)}: edition ${label} ${!ed.verses.has(k) ? 'has no such verse' : plainUsfm(ed.verses.get(k)) ? 'has words: ' + plainUsfm(ed.verses.get(k)) : 'has the number and no words'}`)
  const lack = [...bsb.keys()].filter((k) => bsb.get(k) !== '' && !ed.verses.has(k)).sort(byBibleOrder)
  const noWords = [...bsb.keys()].filter((k) => bsb.get(k) !== '' && ed.verses.has(k) && !plainUsfm(ed.verses.get(k))).sort(byBibleOrder)
  line('Verses with words in bsb.txt that the edition does not have:', lack.length, lack.map(showKey).join(', '))
  line('Verses with words in bsb.txt that the edition has with no words:', noWords.length, noWords.map(showKey).join(', '))
  const perChapter = (keys) => {
    const m = new Map()
    for (const k of keys) {
      const p = parseKey(k)
      const ck = `${p.id} ${p.c}`
      m.set(ck, (m.get(ck) ?? 0) + 1)
    }
    return m
  }
  const pe = perChapter(ed.verses.keys())
  const pb = perChapter(bsb.keys())
  const differ = [...new Set([...pe.keys(), ...pb.keys()])].filter((ck) => pe.get(ck) !== pb.get(ck))
  line('Chapters whose number of verses differs:', differ.length)
  for (const ck of differ) {
    const [id, c] = ck.split(' ')
    line(`  ${nameOf.get(id)} ${c}: edition ${label} ${pe.get(ck) ?? 0}, bsb.txt ${pb.get(ck) ?? 0}`)
  }
}

// Step 8.
section('Step 8. Link passages whose first verse or last verse is not in edition A, or has no words in edition A')
const links = readLinks()
line('Links:', links.length, ' Passages:', links.length * 2)
const hasWords = (k) => A.verses.has(k) && !!plainUsfm(A.verses.get(k))
const bad = []
for (const l of links) {
  for (const side of ['a', 'b']) {
    const p = l[side]
    const first = key(p.book, p.c, p.v)
    const last = key(p.book, p.c2 ?? p.c, p.v2 ?? p.v)
    const miss = [...new Set([first, last])].filter((k) => !hasWords(k))
    if (miss.length) bad.push(`${l.id} (${l.type}) ${side}: ${showKey(first)}${last !== first ? ' to ' + showKey(last) : ''}; ${miss.map((k) => `${showKey(k)} ${A.verses.has(k) ? 'has no words' : 'not in A'}`).join(', ')}`)
  }
}
line('Passages:', bad.length)
for (const b of bad) line(' ', b)

// Step 9.
section('Step 9. The fit of the text blocks: the method of the King James Version data (Task 20)')
const siteBsb = readSite('text')
const noPlace = []
const noSource = []
const titleNoD = []
const dNoTitle = []
const titleAt = new Set(A.headings.filter((h) => h.marker === 'd').map((h) => `${h.id} ${h.c}`))
for (const book of siteBsb) {
  for (const ch of book.chapters) {
    const starts = new Set()
    let hasD = false
    for (const b of ch.blocks) {
      if (b.k !== 'p') continue
      if (b.s === 'd') hasD = true
      for (const x of b.c) if (typeof x === 'object' && ('v' in x || 'o' in x)) starts.add('v' in x ? x.v : x.o)
    }
    const aKeys = A.order.filter((k) => k.startsWith(`${book.id} ${ch.n}:`))
    for (const k of aKeys) if (!starts.has(parseKey(k).v)) noPlace.push(k)
    for (const v of starts) if (!A.verses.has(key(book.id, ch.n, v))) noSource.push(key(book.id, ch.n, v))
    const t = titleAt.has(`${book.id} ${ch.n}`)
    if (t && !hasD) titleNoD.push(`${nameOf.get(book.id)} ${ch.n}`)
    if (hasD && !t) dNoTitle.push(`${nameOf.get(book.id)} ${ch.n}`)
  }
}
line('Verses of edition A that no Berean text block starts, so the method cannot place them:', noPlace.length, noPlace.map(showKey).join(', '))
line('Verses that a Berean text block starts, with { v } or { o }, and that edition A does not have:', noSource.length, noSource.map(showKey).join(', '))
line('Chapters where edition A has a \\d title and the Berean data has no d block:', titleNoD.length, titleNoD.join(', '))
line('Chapters where the Berean data has a d block and edition A has no \\d title:', dNoTitle.length, dNoTitle.join(', '))
const emptyPlaced = A.order.filter((k) => !plainUsfm(A.verses.get(k)) && !noPlace.includes(k))
line('Verses of edition A with no words that a Berean text block starts:', emptyPlaced.length, emptyPlaced.map(showKey).join(', '))

// Step 10.
const siteB = siteMarks(siteBsb)
const siteK = siteMarks(readSite('text-kjv'))
for (const [label, ed] of [
  ['A', A],
  ['B', B],
]) {
  section(`Step 10. Words-of-Jesus marks of edition ${label}`)
  const wj = usfmMarks(ed)
  const total = { start: 0, end: 0, verses: 0 }
  for (const n of wj.perBook.values()) {
    total.start += n.start
    total.end += n.end
    total.verses += n.verses
  }
  line('Start markers:', total.start, ' End markers:', total.end, ' Verses with marked words:', total.verses)
  line('By book (start, end, verses), books with a marker only:')
  for (const [code, n] of wj.perBook) if (n.start || n.end) line(`  ${nameOf.get(idOfCode.get(code))}: ${n.start}, ${n.end}, ${n.verses}`)
  line('Problems:', wj.problems.length, wj.problems.slice(0, 10).join(' | '))
  const cls = counter()
  for (const e of wj.verses.values()) cls.add(classOf(e))
  line('Classes of the verses with words:', CLASSES.map((c) => `${c} ${cls.map.get(c) ?? 0}`).join(', '))
  if (label !== 'A') continue
  for (const [other, map] of [
    ['Berean Standard Bible', siteB],
    ['King James Version', siteK],
  ]) {
    line(`Table: edition A (rows) against the ${other} site data (columns), verses in both:`)
    const t = counter()
    for (const [k, e] of wj.verses) if (map.has(k)) t.add(`${classOf(e)}|${classOf(map.get(k))}`)
    line(`  A \\ ${other}: ${CLASSES.join(', ')}`)
    for (const r of CLASSES) line(`  ${r}: ${CLASSES.map((c) => t.map.get(`${r}|${c}`) ?? 0).join(', ')}`)
  }
  const keys = [...wj.verses.keys()].filter((k) => siteB.has(k)).sort(byBibleOrder)
  const lists = [
    ['Verses where edition A has "none" and the Berean Standard Bible has words-of-Jesus marks', keys.filter((k) => classOf(wj.verses.get(k)) === 'none' && classOf(siteB.get(k)) !== 'none')],
    ['Verses where edition A has words-of-Jesus marks and the Berean Standard Bible has "none"', keys.filter((k) => classOf(wj.verses.get(k)) !== 'none' && classOf(siteB.get(k)) === 'none')],
  ]
  for (const [title, list] of lists) {
    line(`${title}:`, list.length)
    if (list.length > 100) {
      const per = counter()
      for (const k of list) per.add(nameOf.get(parseKey(k).id))
      line('  by book:', fmtCounts(per.map))
      line('  the first 100:', list.slice(0, 100).map(showKey).join(', '))
    } else line(' ', list.map(showKey).join(', ') || 'none')
  }
}

// Step 11.
compareStructure(C, siteStructure(siteBsb))

// Step 12.
section('Step 12. Places in src/, scripts/, and e2e/ that name the two translations')
const PATTERN = /two translations|toHaveLength\(2\)|\b(bsb|kjv)\b|TRANSLATIONS|\bTranslation\b|text-kjv|Berean Standard Bible|King James Version|'text'|"text"/
const hits = []
const walkCode = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walkCode(p)
    else if (/\.(ts|tsx|mjs|js|css|json)$/.test(e.name)) {
      readFileSync(p, 'utf8')
        .split(/\r?\n/)
        .forEach((l, i) => {
          if (PATTERN.test(l)) hits.push(`${relative(ROOT, p).replace(/\\/g, '/')}:${i + 1}: ${l.trim().slice(0, 160)}`)
        })
    }
  }
}
for (const d of ['src', 'scripts', 'e2e']) walkCode(join(ROOT, d))
const perFile = counter()
for (const h of hits) perFile.add(h.split(':')[0])
line('Lines:', hits.length, ' Files:', perFile.map.size)
line('By file:', fmtCounts(perFile.map))
for (const h of hits) line(' ', h)
