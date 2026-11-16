// The marks of the words of Jesus (USFM \wj) in the two source sets. docs/TASKS.md Task 25.
//
// The script only reads files: sources/bsb/usfm/, sources/kjv/usfm/, public/data/books.json,
// public/data/text/, and public/data/text-kjv/. It writes no file. It prints the numbers and the lists of
// steps 3 to 9 of Task 25 as Markdown.
//
// The plain words of a verse: the words that remain when the script removes the markers, the Strong's
// numbers, the footnotes, and the paragraph signs. This is the method of scripts/build-text.mjs and
// scripts/build-text-kjv.mjs. A line end counts as a space. Runs of spaces count as one space.
//
// Usage: node scripts/wj-report.mjs > report.md

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const books = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'books.json'), 'utf8'))
if (books.length !== 66) throw new Error('expected 66 books in books.json')

// The 66 USFM book codes in the order of books.json. The same list as in scripts/build-text-kjv.mjs.
const CODES = ('GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM ' +
  'EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH ' +
  '1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV').split(' ')

// The 13 verses where the site joins a word of the King James Version. docs/DESIGN.md section 8.2, Task 20b.
// The same places as the list SPLIT in scripts/build-text-kjv.mjs.
const SPLIT = new Set(
  ['acts 4:16', 'acts 4:20', 'acts 5:39', 'colossians 3:17', 'colossians 3:23', '1-timothy 2:7', '1-timothy 5:25', '1-timothy 6:12', '2-timothy 1:11', '2-timothy 2:9', '2-timothy 2:13', 'hebrews 6:17', 'hebrews 9:5'],
)

const LETTER = /[\p{L}\p{N}]/u
const letters = (s) => (s.match(/[\p{L}\p{N}]/gu) ?? []).length
const squash = (s) => s.replace(/\s+/g, ' ')
const fmt = (n) => n.toLocaleString('en-US')
const pct = (a, b) => `${((100 * a) / b).toFixed(2)} %`

const out = []
const say = (...lines) => out.push(...lines)

// ---- reading the USFM files ----

/** Line markers whose line has no verse words: book head, headings, cross-reference lines. */
const NO_WORDS = new Set(['id', 'usfm', 'h', 'toc1', 'toc2', 'toc3', 'mt1', 'mt2', 's1', 's2', 'ms', 'qa', 'r'])
/** Line markers that start a paragraph or a poetry line, or a blank line. */
const BLOCK = new Set(['p', 'pmo', 'pc', 'm', 'nb', 'q1', 'q2', 'qr', 'li1', 'li2', 'mr', 'b'])

/**
 * One source set. Returns { verses, marks, problems, byBook }.
 * verses: Map key -> { code, book, c, v, segs: [{ t, m }] }, in the order of the files.
 * marks: [{ code, book, c, v, beforeV, parts: Map v -> text, paras: [], nested: {}, open }]
 */
function readSet(name, dir, fileOf) {
  const verses = new Map()
  const marks = []
  const problems = []
  const byBook = new Map()
  CODES.forEach((code, i) => {
    const text = readFileSync(join(dir, fileOf(code)), 'utf8').replace(/^﻿/, '')
    if (/^\\id (\S+)/.exec(text)?.[1] !== code) throw new Error(`${name} ${code}: wrong \\id`)
    const book = books[i]
    const count = { start: 0, end: 0 }
    byBook.set(code, count)
    let c = 0
    let v = 0
    let mark = null
    const verse = () => {
      const key = `${book.id} ${c}:${v}`
      if (!verses.has(key)) verses.set(key, { code, book, c, v, segs: [] })
      return verses.get(key)
    }
    const where = () => `${book.name} ${c}:${v}`
    const addText = (t) => {
      if (!v) {
        if (t.trim()) throw new Error(`${name} ${book.name} ${c}: words before the first verse: ${t}`)
        return
      }
      verse().segs.push({ t, m: !!mark })
      if (mark) {
        if (t.trim()) mark.pending = false
        mark.parts.set(v, (mark.parts.get(v) ?? '') + t)
      }
    }
    const nested = (k) => {
      if (mark) mark.nested[k] = (mark.nested[k] ?? 0) + 1
    }
    const startMark = () => {
      count.start++
      if (mark) {
        problems.push(`${where()}: a start marker inside an open mark. The open mark started at ${mark.book.name} ${mark.c}:${mark.v}.`)
        mark.open = true
      }
      mark = { set: name, code, book, c, v, beforeV: false, pending: true, parts: new Map(), paras: [], nested: {}, open: false }
      marks.push(mark)
    }
    const endMark = () => {
      count.end++
      if (!mark) problems.push(`${where()}: an end marker with no start marker.`)
      mark = null
    }

    const RE = /\\v (\d+)\s?|\\f [\s\S]*?\\f\*|\\(\+?)(wj|add|nd|w)\*|\\(\+?)(wj|add|nd|w) |\|strong="[^"]*"|¶|([^\\|¶]+)|([\s\S])/g
    const inline = (s) => {
      for (const t of s.matchAll(RE)) {
        if (t[1] !== undefined) {
          if (mark) {
            nested('\\v')
            if (mark.pending) mark.beforeV = true
          }
          v = Number(t[1])
          verse()
        } else if (t[0].startsWith('\\f ')) nested('\\f (footnote)')
        else if (t[3] !== undefined) {
          if (t[3] === 'wj') {
            if (t[2]) nested('\\+wj*')
            endMark()
          }
        } else if (t[5] !== undefined) {
          if (t[5] === 'wj') {
            if (t[4]) nested('\\+wj')
            startMark()
          } else nested(`\\${t[4]}${t[5]}`)
        } else if (t[0].startsWith('|strong')) continue
        else if (t[0] === '¶') nested('¶ (paragraph sign)')
        else if (t[6] !== undefined) addText(t[6])
        else throw new Error(`${name} ${where()}: unknown text at "${s.slice(t.index, t.index + 40)}"`)
      }
    }

    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim()
      if (!line) continue
      const m = /^\\([a-z]+\d?)(?:\s+([\s\S]*))?$/.exec(line)
      if (!m) {
        inline(line) // a line with no marker goes on with the verse before it
        addText(' ')
        continue
      }
      const [, marker, rest = ''] = m
      if (marker === 'c') {
        if (mark) problems.push(`${where()}: a mark is open at the end of the chapter.`)
        c = Number(rest)
        v = 0
        continue
      }
      if (marker === 'v') {
        inline(line)
        addText(' ')
        continue
      }
      if (NO_WORDS.has(marker) || (marker === 'd' && !/\\v /.test(rest))) {
        if (/\\\+?wj/.test(rest)) problems.push(`${where()}: a marker \\wj in a line \\${marker}, which has no verse words.`)
        continue
      }
      if (!BLOCK.has(marker) && marker !== 'd') throw new Error(`${name} ${where()}: unknown line marker \\${marker}`)
      if (mark) mark.paras.push(marker)
      inline(rest)
      addText(' ')
    }
    if (mark) problems.push(`${book.name}: a mark is open at the end of the book.`)
  })
  return { name, verses, marks, problems, byBook }
}

const BSB = readSet('Berean', join(ROOT, 'sources', 'bsb', 'usfm'), (code) => `${code}.usfm`)
const kjvFiles = readdirSync(join(ROOT, 'sources', 'kjv', 'usfm'))
const KJV = readSet('King James Version', join(ROOT, 'sources', 'kjv', 'usfm'), (code) => kjvFiles.find((f) => f.includes(`-${code}eng-`)))
const SETS = [BSB, KJV]

// ---- the words of a verse and of a mark ----

/** The plain words of a verse, with the marked words between [[ and ]]. */
function shown(entry) {
  if (!entry) return '(no such verse)'
  let s = ''
  let inside = false
  for (const seg of entry.segs) {
    if (seg.m && !inside) {
      // The opening brackets go before the first character that is not a space.
      const lead = /^\s*/.exec(seg.t)[0]
      s += lead + '[[' + seg.t.slice(lead.length)
      inside = true
    } else if (!seg.m && inside) {
      s = s.replace(/(\s*)$/, ']]$1') + seg.t
      inside = false
    } else s += seg.t
  }
  if (inside) s = s.replace(/(\s*)$/, ']]$1')
  return squash(s).trim().replace(/\[\[\s+/g, '[[').replace(/\s+\]\]/g, ']]').replace(/\[\[\]\]/g, '')
}

/** "all", "part", or "none" for a verse. Counts letters and digits. */
function classOf(entry) {
  let inside = 0
  let outside = 0
  for (const seg of entry.segs) {
    const n = letters(seg.t)
    if (seg.m) inside += n
    else outside += n
  }
  if (inside === 0) return 'none'
  return outside === 0 ? 'all' : 'part'
}

const markText = (mark) => squash([...mark.parts.values()].join(' ')).trim()
const wordParts = (mark) => [...mark.parts].map(([v, t]) => [v, squash(t).trim()]).filter(([, t]) => t !== '')
/** The place of a mark: the verse of its first words. A mark that starts before a marker \v has its words in the next verse. */
const markWhere = (mark) => `${mark.book.name} ${mark.c}:${wordParts(mark)[0]?.[0] ?? mark.v}`

// ---- step 3 ----

say('## Step 3. The marks of each source set', '')
say('A mark is one start marker `\\wj` and the end marker `\\wj*` after it. The numbers count markers and marks in the 66 books.', '')
for (const set of SETS) {
  say(`### ${set.name} files`, '')
  const markedVerses = new Map()
  for (const [, e] of set.verses) if (classOf(e) !== 'none') markedVerses.set(e.code, (markedVerses.get(e.code) ?? 0) + 1)
  say('| Book | Start markers | End markers | Verses with marked words |', '|---|---:|---:|---:|')
  let ts = 0
  let te = 0
  let tv = 0
  CODES.forEach((code, i) => {
    const n = set.byBook.get(code)
    if (!n.start && !n.end) return
    const mv = markedVerses.get(code) ?? 0
    say(`| ${books[i].name} | ${fmt(n.start)} | ${fmt(n.end)} | ${fmt(mv)} |`)
    ts += n.start
    te += n.end
    tv += mv
  })
  say(`| All | ${fmt(ts)} | ${fmt(te)} | ${fmt(tv)} |`, '')
  say(`Start markers and end markers together: ${fmt(ts + te)}. The other books have no marker.`, '')
  say('Places where a start marker has no end marker, or an end marker has no start marker:', '')
  if (set.problems.length) for (const p of set.problems) say(`- ${p}`)
  else say('- None.')
  say('')
  const ms = set.marks
  const before = ms.filter((m) => m.beforeV).length
  const multi = ms.filter((m) => wordParts(m).length > 1).length
  const withPara = ms.filter((m) => m.paras.length > 0)
  const paraKinds = {}
  for (const m of withPara) for (const p of new Set(m.paras)) paraKinds[p] = (paraKinds[p] ?? 0) + 1
  const noLetter = ms.filter((m) => !LETTER.test(markText(m)))
  say(`- Marks: ${fmt(ms.length)}.`)
  say(`- Marks that start before a marker \`\\v\`: ${fmt(before)}.`)
  say(`- Marks that have words of more than one verse: ${fmt(multi)}.`)
  say(`- Marks that have a paragraph marker or a poetry marker inside them: ${fmt(withPara.length)}. By marker, each mark counted once for each marker that it has: ${Object.entries(paraKinds).map(([k, n]) => `\`\\${k}\` ${fmt(n)}`).join(', ') || 'none'}.`)
  say(`- Marks that have no letter inside them: ${fmt(noLetter.length)}.`)
  for (const m of noLetter) say(`  - ${markWhere(m)}: "${markText(m)}"`)
  if (set === BSB) {
    const first = {}
    const last = {}
    for (const m of ms) {
      const t = markText(m)
      if (!t) continue
      first[t[0]] = (first[t[0]] ?? 0) + 1
      last[t.at(-1)] = (last[t.at(-1)] ?? 0) + 1
    }
    const open = (first['“'] ?? 0) + (first['‘'] ?? 0)
    const close = (last['”'] ?? 0) + (last['’'] ?? 0)
    say(`- Marks whose first character is an opening quotation mark: ${fmt(open)}. “ ${fmt(first['“'] ?? 0)}, ‘ ${fmt(first['‘'] ?? 0)}.`)
    say(`- Marks whose last character is a closing quotation mark: ${fmt(close)}. ” ${fmt(last['”'] ?? 0)}, ’ ${fmt(last['’'] ?? 0)}.`)
    say(`- The first character of the other marks: ${Object.entries(first).filter(([k]) => k !== '“' && k !== '‘').sort((a, b) => b[1] - a[1]).map(([k, n]) => `"${k}" ${fmt(n)}`).join(', ')}.`)
    say(`- The last character of the other marks: ${Object.entries(last).filter(([k]) => k !== '”' && k !== '’').sort((a, b) => b[1] - a[1]).map(([k, n]) => `"${k}" ${fmt(n)}`).join(', ')}.`)
  }
  const nest = {}
  for (const m of ms) for (const [k, n] of Object.entries(m.nested)) nest[k] = (nest[k] ?? 0) + n
  say(`- The markers inside the marks, with the number of times that each occurs. An end marker is not counted: ${Object.entries(nest).sort((a, b) => b[1] - a[1]).map(([k, n]) => `\`${k}\` ${fmt(n)}`).join(', ') || 'none'}.`)
  say('')
}

// ---- step 4 ----

const CLASSES = ['all', 'part', 'none']
say('## Step 4. The class of each verse', '')
say('"all": each letter and each digit of the verse is in a mark. "part": some are in a mark. "none": none is in a mark. Punctuation does not count.', '')
for (const set of SETS) {
  say(`### ${set.name} files`, '')
  say('| Book | all | part | none |', '|---|---:|---:|---:|')
  const per = new Map()
  for (const [, e] of set.verses) {
    if (!letters(e.segs.map((s) => s.t).join(''))) continue
    const row = per.get(e.code) ?? { all: 0, part: 0, none: 0 }
    row[classOf(e)]++
    per.set(e.code, row)
  }
  const total = { all: 0, part: 0, none: 0 }
  let restNone = 0
  CODES.forEach((code, i) => {
    const r = per.get(code)
    for (const k of CLASSES) total[k] += r[k]
    if (r.all || r.part) say(`| ${books[i].name} | ${fmt(r.all)} | ${fmt(r.part)} | ${fmt(r.none)} |`)
    else restNone += r.none
  })
  say(`| The other books | 0 | 0 | ${fmt(restNone)} |`)
  say(`| All | ${fmt(total.all)} | ${fmt(total.part)} | ${fmt(total.none)} |`, '')
}

const both = [...BSB.verses.keys()].filter((k) => KJV.verses.has(k))
const label = (k) => {
  const e = BSB.verses.get(k) ?? KJV.verses.get(k)
  return `${e.book.name} ${e.c}:${e.v}`
}
say('### Berean class by King James Version class', '')
say(`The verses that the two sets have: ${fmt(both.length)}.`, '')
const pairs = {}
for (const k of both) {
  const p = `${classOf(BSB.verses.get(k))}|${classOf(KJV.verses.get(k))}`
  pairs[p] = (pairs[p] ?? 0) + 1
}
say('| Berean \\ King James Version | all | part | none |', '|---|---:|---:|---:|')
for (const a of CLASSES) say(`| ${a} | ${CLASSES.map((b) => fmt(pairs[`${a}|${b}`] ?? 0)).join(' | ')} |`)
say('')

const verseBlock = (k) => [`- ${label(k)}. Berean: ${classOf(BSB.verses.get(k))}. King James Version: ${classOf(KJV.verses.get(k))}.`, `  - Berean: ${shown(BSB.verses.get(k))}`, `  - King James Version: ${shown(KJV.verses.get(k))}`]
const byBookCount = (keys) => {
  const n = new Map()
  for (const k of keys) {
    const name = (BSB.verses.get(k) ?? KJV.verses.get(k)).book.name
    n.set(name, (n.get(name) ?? 0) + 1)
  }
  return [...n].map(([b, c]) => `${b} ${fmt(c)}`).join(', ')
}

const noneOther = both.filter((k) => {
  const a = classOf(BSB.verses.get(k))
  const b = classOf(KJV.verses.get(k))
  return (a === 'none') !== (b === 'none')
})
const bsbNone = noneOther.filter((k) => classOf(BSB.verses.get(k)) === 'none').length
say('### Verses where one set has "none" and the other set has "part" or "all"', '')
say(`Verses: ${fmt(noneOther.length)}. The Berean files have "none" in ${fmt(bsbNone)}, and the King James Version files have "none" in ${fmt(noneOther.length - bsbNone)}.`, '')
say(`By book: ${byBookCount(noneOther)}.`, '')
if (noneOther.length > 150) say(`The first 150 verses, in Bible order:`, '')
for (const k of noneOther.slice(0, 150)) say(...verseBlock(k))
say('')

const allPart = both.filter((k) => {
  const p = [classOf(BSB.verses.get(k)), classOf(KJV.verses.get(k))].sort().join('|')
  return p === 'all|part'
})
const bsbAll = allPart.filter((k) => classOf(BSB.verses.get(k)) === 'all').length
say('### Verses where one set has "all" and the other set has "part"', '')
say(`Verses: ${fmt(allPart.length)}. The Berean files have "all" in ${fmt(bsbAll)}, and the King James Version files have "all" in ${fmt(allPart.length - bsbAll)}.`, '')
say(`By book: ${byBookCount(allPart)}.`, '')
if (allPart.length <= 30) {
  say(`The list has ${fmt(allPart.length)} verses, so each verse is an example:`, '')
  for (const k of allPart) say(...verseBlock(k))
} else {
  say('30 examples, at an equal step through the list:', '')
  const step = allPart.length / 30
  for (let i = 0; i < 30; i++) say(...verseBlock(allPart[Math.floor(i * step)]))
}
say('')

const kjvOnly = [...KJV.verses.keys()].filter((k) => !BSB.verses.has(k) && classOf(KJV.verses.get(k)) !== 'none')
say('### Verses with marks in the King James Version files that the main text of the Berean Standard Bible does not have', '')
say(`Verses: ${fmt(kjvOnly.length)}.`, '')
for (const k of kjvOnly) say(`- ${label(k)}. King James Version: ${classOf(KJV.verses.get(k))}. ${shown(KJV.verses.get(k))}`)
if (!kjvOnly.length) say('- None.')
say('')

// ---- step 5 ----

const id = (name) => books.find((b) => b.name === name).id
const PASSAGES = [
  ['Matthew', 3, 13, 17],
  ['John', 3, 10, 21],
  ['John', 3, 27, 36],
  ['Acts', 9, 3, 6],
  ['Acts', 20, 35, 35],
  ['Acts', 26, 14, 18],
  ['1 Corinthians', 11, 23, 25],
  ['2 Corinthians', 12, 9, 9],
  ['Hebrews'],
  ['Revelation', 1, 8, 20],
  ['Revelation', 22, 7, 20],
]
say('## Step 5. Passages', '')
say('Each verse from each source set. The marked words are between [[ and ]].', '')
for (const [name, c, from, to] of PASSAGES) {
  let keys
  if (c === undefined) {
    keys = [...BSB.verses.entries()].filter(([, e]) => e.book.name === name && classOf(e) !== 'none').map(([k]) => k)
    say(`### ${name}: each verse that has marks in the Berean files`, '')
  } else {
    keys = []
    for (let v = from; v <= to; v++) keys.push(`${id(name)} ${c}:${v}`)
    say(`### ${name} ${c}:${from}${to !== from ? `-${to}` : ''}`, '')
  }
  for (const k of keys) {
    const e = BSB.verses.get(k) ?? KJV.verses.get(k)
    say(`- ${e.c}:${e.v} Berean: ${shown(BSB.verses.get(k))}`, `- ${e.c}:${e.v} King James Version: ${shown(KJV.verses.get(k))}`)
  }
  say('')
}

// ---- steps 6 and 7: the marks and the words of the site ----

/** The words of each verse in the site data, with the block of each piece. */
function siteVerses(dir) {
  const map = new Map()
  for (const book of books) {
    const data = JSON.parse(readFileSync(join(ROOT, 'public', 'data', dir, `${book.id}.json`), 'utf8'))
    for (const ch of data.chapters) {
      let v = 0
      ch.blocks.forEach((b, bi) => {
        if (b.k !== 'p') return
        for (const x of b.c) {
          if (typeof x === 'object' && 'v' in x) {
            v = x.v
            continue
          }
          const t = typeof x === 'string' ? x : 'a' in x ? x.a : typeof x.j === 'string' ? x.j : null
          if (t === null) continue
          const key = `${book.id} ${ch.n}:${v}`
          if (!map.has(key)) map.set(key, { text: '', pieces: [] })
          const e = map.get(key)
          e.pieces.push({ start: e.text.length, end: e.text.length + t.length, block: bi, style: b.s })
          e.text += t
        }
      })
    }
  }
  return map
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

/** Finds each mark in the site data. Returns the found ranges and the marks that the script does not find. */
function placeMarks(set, site) {
  const squashed = new Map()
  const cursor = new Map()
  const result = { found: [], notFound: [], empty: [], multiBlock: [], multiBlockOneVerse: 0, ranges: new Map() }
  for (const mark of set.marks) {
    const parts = wordParts(mark)
    if (!parts.length) {
      result.empty.push(mark)
      continue
    }
    const placed = []
    const missing = []
    for (const [v, t] of parts) {
      const key = `${mark.book.id} ${mark.c}:${v}`
      const e = site.get(key)
      if (!e) {
        missing.push({ v, t, site: null })
        continue
      }
      if (!squashed.has(key)) squashed.set(key, squashMap(e.text))
      const { s, pos } = squashed.get(key)
      let i = s.indexOf(t, cursor.get(key) ?? 0)
      if (i < 0) i = s.indexOf(t)
      if (i < 0) {
        missing.push({ v, t, site: e.text })
        continue
      }
      cursor.set(key, i + t.length)
      placed.push({ key, start: pos[i], end: pos[i + t.length - 1] + 1 })
    }
    if (missing.length) {
      result.notFound.push({ mark, missing })
      continue
    }
    result.found.push(mark)
    const blocks = new Set()
    for (const p of placed) {
      if (!result.ranges.has(p.key)) result.ranges.set(p.key, [])
      result.ranges.get(p.key).push([p.start, p.end])
      for (const piece of site.get(p.key).pieces) if (piece.start < p.end && piece.end > p.start) blocks.add(piece.block)
    }
    if (blocks.size > 1) {
      result.multiBlock.push(mark)
      if (placed.length === 1) result.multiBlockOneVerse++
    }
  }
  return result
}

const SITE = { bsb: siteVerses('text'), kjv: siteVerses('text-kjv') }
const PLACED = { bsb: placeMarks(BSB, SITE.bsb), kjv: placeMarks(KJV, SITE.kjv) }

function reportPlacing(set, placed, dataDir, kjv) {
  const all = set.marks.length
  say(`- Marks: ${fmt(all)}. Marks with no words to search, because they have no character that is not a space: ${fmt(placed.empty.length)}.`)
  say(`- Marks that the script finds exactly in the words of the site: ${fmt(placed.found.length)}.`)
  say(`- Marks that the script does not find: ${fmt(placed.notFound.length)}.`)
  say(`- Marks whose words are in more than one text block of the site data: ${fmt(placed.multiBlock.length)}. Of these, ${fmt(placed.multiBlockOneVerse)} have the words of one verse only, and ${fmt(placed.multiBlock.length - placed.multiBlockOneVerse)} have the words of more than one verse.`)
  if (kjv) {
    const inSplit = set.marks.filter((m) => [...m.parts.keys()].some((v) => SPLIT.has(`${m.book.id} ${m.c}:${v}`)))
    say(`- Marks in one of the 13 verses where the site joins a word: ${fmt(inSplit.length)}.${inSplit.length ? ' ' + inSplit.map(markWhere).join(', ') + '.' : ''}`)
  }
  say('')
  if (placed.notFound.length) {
    // Two more searches, only to sort the marks that the exact search does not find. They change no count above.
    const noSpace = (s) => s.replace(/\s+/g, '')
    const tiers = { spaces: 0, faults: 0, other: [] }
    for (const { mark, missing } of placed.notFound) {
      const ok1 = missing.every((x) => x.site !== null && noSpace(x.site).includes(noSpace(x.t)))
      const ok2 = missing.every((x) => x.site !== null && noSpace(x.site).includes(noSpace(x.t).replaceAll('[’’]', '')))
      if (ok1) tiers.spaces++
      else if (ok2) tiers.faults++
      else tiers.other.push(markWhere(mark))
    }
    say('The script searches the marks that it does not find two more times, to sort them:', '')
    say(`- Found when the script removes each space from the two texts: ${fmt(tiers.spaces)}.`)
    say(`- Found only when the script also removes the characters \`[’’]\` from the words of the mark: ${fmt(tiers.faults)}.`)
    say(`- Not found by these two searches: ${fmt(tiers.other.length)}.${tiers.other.length ? ' ' + tiers.other.join(', ') + '.' : ''}`, '')
    const n = new Map()
    for (const { mark } of placed.notFound) n.set(mark.book.name, (n.get(mark.book.name) ?? 0) + 1)
    say(`The marks that the script does not find, by book: ${[...n].map(([b, c]) => `${b} ${fmt(c)}`).join(', ')}.`, '')
    if (placed.notFound.length > 50) say('The first 50:', '')
    for (const { mark, missing } of placed.notFound.slice(0, 50)) {
      say(`- ${markWhere(mark)}.${kjv && [...mark.parts.keys()].some((v) => SPLIT.has(`${mark.book.id} ${mark.c}:${v}`)) ? ' In one of the 13 verses where the site joins a word.' : ''}`)
      for (const x of missing) {
        say(`  - Verse ${x.v}, the words of the mark: ${x.t}`)
        say(`  - Verse ${x.v}, the words in \`${dataDir}\`: ${x.site === null ? '(the site data has no such verse)' : squash(x.site).trim()}`)
      }
    }
    say('')
  }
}

say('## Step 6. The Berean marks and the words of the site', '')
say('The script takes the plain words of each mark in each verse, and searches them in the words of that verse in `public/data/text/<id>.json`. The search counts a run of spaces as one space, and changes no other character. A mark is found when each of its verses is found.', '')
reportPlacing(BSB, PLACED.bsb, 'public/data/text/', false)

say('## Step 7. The King James Version marks and the words of the site', '')
say('The same test, in `public/data/text-kjv/<id>.json`. The added words count as words of the verse.', '')
reportPlacing(KJV, PLACED.kjv, 'public/data/text-kjv/', true)

// ---- step 8 ----

const POETRY = new Set(['q1', 'q2', 'qr'])
say('## Step 8. The block styles of the marked words', '')
say('For each verse with marked words that the script finds in the site data, the block styles that hold the marked words. A verse with marked words in two styles counts once in each style. Paragraph style: `p`. Poetry styles: `q1`, `q2`, `qr`. The marks that the script does not find are not counted.', '')
for (const [set, key] of [[BSB, 'bsb'], [KJV, 'kjv']]) {
  const styles = {}
  let verses = 0
  let twoStyles = 0
  for (const [k, ranges] of PLACED[key].ranges) {
    const here = new Set()
    for (const piece of SITE[key].get(k).pieces) if (ranges.some(([s, e]) => piece.start < e && piece.end > s)) here.add(piece.style)
    verses++
    if (here.size > 1) twoStyles++
    for (const s of here) styles[s] = (styles[s] ?? 0) + 1
  }
  const name = (s) => (s === 'p' ? 'paragraph' : POETRY.has(s) ? 'poetry' : 'other')
  say(`### ${set === BSB ? 'Berean Standard Bible' : 'King James Version'}`, '')
  say(`Verses with marked words: ${fmt(verses)}. Verses with marked words in more than one style: ${fmt(twoStyles)}.`, '')
  say('| Block style | Kind | Verses |', '|---|---|---:|')
  for (const [s, n] of Object.entries(styles).sort((a, b) => b[1] - a[1])) say(`| \`${s}\` | ${name(s)} | ${fmt(n)} |`)
  say('')
}

// ---- step 9 ----

/** Form A: each run of marked words in a block becomes the item { "j": "words" }. Added words in a mark get "j": 1. */
function formA(data, ranges) {
  const copy = structuredClone(data)
  for (const ch of copy.chapters) {
    let v = 0
    const offset = new Map()
    for (const b of ch.blocks) {
      if (b.k !== 'p') continue
      const c = []
      for (const x of b.c) {
        if (typeof x === 'object' && 'v' in x) {
          v = x.v
          c.push(x)
          continue
        }
        const t = typeof x === 'string' ? x : 'a' in x ? x.a : null
        if (t === null) {
          c.push(x)
          continue
        }
        const key = `${copy.id} ${ch.n}:${v}`
        const start = offset.get(key) ?? 0
        offset.set(key, start + t.length)
        const rs = (ranges.get(key) ?? []).filter(([s, e]) => s < start + t.length && e > start)
        if (typeof x !== 'string') {
          c.push(rs.length ? { ...x, j: 1 } : x)
          continue
        }
        let at = 0
        for (const [s, e] of rs) {
          const from = Math.max(0, s - start)
          const to = Math.min(t.length, e - start)
          if (from > at) c.push(t.slice(at, from))
          c.push({ j: t.slice(from, to) })
          at = to
        }
        if (at < t.length) c.push(t.slice(at))
      }
      b.c = c
    }
  }
  return copy
}

/** Form B: each chapter gets "j": [[verse, from, to], ...], positions in the words of the verse. */
function formB(data, ranges) {
  const copy = structuredClone(data)
  for (const ch of copy.chapters) {
    const j = []
    for (const [key, rs] of ranges) {
      const m = /^(\S+) (\d+):(\d+)$/.exec(key)
      if (m[1] !== copy.id || Number(m[2]) !== ch.n) continue
      for (const [s, e] of rs) j.push([Number(m[3]), s, e])
    }
    if (j.length) ch.j = j.sort((a, b) => a[0] - b[0] || a[1] - b[1])
  }
  return copy
}

say('## Step 9. Two forms for the marks in the site data', '')
say('The script makes each form in memory for each book, and counts the bytes of `JSON.stringify` in UTF-8. It writes no file. The marks that the script does not find in step 6 or step 7 are not in the counts.', '')
say('- Form A, inline items: each run of marked words in a text block becomes an item `{"j":"words"}` in place of the plain string. Added words in a mark get `"j":1`, for example `{"a":"it","j":1}`. A mark that has words in two blocks gives one item in each block.')
say('- Form B, ranges per chapter: each chapter gets a list `"j":[[verse,from,to],...]`. `from` and `to` are positions in the words of the verse, as the site data has them now. The text blocks do not change.', '')
// Since Task 26 the site data has the marks in Form A. The forms are counted on data without marks only.
const hasMarks = ['text', 'text-kjv'].some((dir) => books.some((book) => readFileSync(join(ROOT, 'public', 'data', dir, `${book.id}.json`), 'utf8').includes('"j":')))
if (hasMarks) say('The site data has marks since Task 26. The script does not count the two forms again. The counts of Task 25 are in `docs/reviews/task-25-words-of-jesus-report.md`.')
else say('| Data | Size now | Form A adds | Form B adds |', '|---|---:|---:|---:|')
for (const [dir, key] of hasMarks ? [] : [['text', 'bsb'], ['text-kjv', 'kjv']]) {
  let size = 0
  let a = 0
  let b = 0
  for (const book of books) {
    const raw = readFileSync(join(ROOT, 'public', 'data', dir, `${book.id}.json`), 'utf8')
    const data = JSON.parse(raw)
    const now = Buffer.byteLength(raw)
    if (Buffer.byteLength(JSON.stringify(data)) !== now) throw new Error(`${dir}/${book.id}.json is not in the form of JSON.stringify`)
    size += now
    a += Buffer.byteLength(JSON.stringify(formA(data, PLACED[key].ranges))) - now
    b += Buffer.byteLength(JSON.stringify(formB(data, PLACED[key].ranges))) - now
  }
  say(`| \`public/data/${dir}/\` | ${fmt(size)} | ${fmt(a)} (${pct(a, size)}) | ${fmt(b)} (${pct(b, size)}) |`)
}
say('')

process.stdout.write(out.join('\n') + '\n')
