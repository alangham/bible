// Builds public/data/text/<id>.json, one file for each book, from the Berean Standard Bible.
// docs/TASKS.md Task 5 step 3, docs/DESIGN.md section 4.3.
//
// The words come from sources/bsb/bsb.txt. The structure comes from the USFM files of the
// same publisher in sources/bsb/usfm/: section headings, paragraphs, poetry lines, the
// manuscript notes, and the cross-reference lines. Arthur decided this on 2026-11-14.
// The USFM files have faults in the words (docs/DATA-SOURCES.md section 2), so the script
// never takes a word from them. It aligns the USFM text with bsb.txt, character by
// character with spaces removed, and cuts the bsb.txt text where the USFM structure changes.
//
// Usage: node scripts/build-text.mjs

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const SRC = join(ROOT, 'sources', 'bsb')
const OUT = join(ROOT, 'public', 'data', 'text')

/** The two notes on passages that early manuscripts do not include. docs/DESIGN.md section 4.3. */
const PASSAGE_NOTES = new Set(['Mark 16:8', 'John 7:52'])

// ---- bsb.txt: the words ----

const bsb = new Map() // "Book c:v" -> text
const bsbOrder = [] // book names in Bible order, as bsb.txt spells them
for (const line of readFileSync(join(SRC, 'bsb.txt'), 'utf8').replace(/^﻿/, '').split(/\r?\n/)) {
  const m = /^(.+) (\d+):(\d+)\t(.*)$/.exec(line)
  if (!m) continue
  if (bsbOrder.at(-1) !== m[1]) bsbOrder.push(m[1])
  bsb.set(`${m[1]} ${m[2]}:${m[3]}`, m[4])
}
const books = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'books.json'), 'utf8'))
if (bsbOrder.length !== 66 || books.length !== 66) throw new Error('expected 66 books')

// ---- USFM: the structure ----

/** Splits a footnote body into runs: plain text, quoted alternative text (q), and verse numbers (v). */
function noteRuns(body) {
  const runs = []
  let style = undefined
  const push = (t) => {
    if (!t) return
    const last = runs.at(-1)
    if (last && last.s === style) last.t += t
    else runs.push(style ? { t, s: style } : { t })
  }
  const re = /\\fr [^\\]*|\\ft ?|\\fqa ?|\\fv ([^\\]*)\\fv\*|\\ref ([^|\\]*)(?:\|[^\\]*)?\\ref\*|([^\\]+)/g
  for (const m of body.matchAll(re)) {
    if (m[0].startsWith('\\fr ')) continue
    if (m[0].startsWith('\\ft')) style = undefined
    else if (m[0].startsWith('\\fqa')) style = 'q'
    else if (m[1] !== undefined) {
      const keep = style
      style = 'v'
      push(m[1].trim())
      style = keep
    } else if (m[2] !== undefined) push(m[2])
    else push(m[3])
  }
  const out = runs.filter((r) => r.t !== '')
  if (out.length) {
    out[0].t = out[0].t.replace(/^\s+/, '')
    out.at(-1).t = out.at(-1).t.replace(/\s+$/, '')
  }
  return out
}

/** The text of a heading line, without markers. Headings have no notes that the site keeps. */
function headingText(s) {
  const t = s
    .replace(/\\f \+[\s\S]*?\\f\*/g, '')
    .replace(/\\ref ([^|\\]*)(?:\|[^\\]*)?\\ref\*/g, '$1')
    .trim()
  if (/\\/.test(t)) throw new Error(`marker left in heading: ${s}`)
  return t
}

const TEXT_BLOCKS = new Set(['p', 'pmo', 'q1', 'q2', 'qr', 'pc', 'li1', 'li2'])
const HEADINGS = new Set(['s1', 's2', 'ms', 'qa'])
const SKIP = new Set(['id', 'usfm', 'h', 'toc1', 'toc2', 'toc3', 'mt1', 'mt2'])

const stats = { blocks: {}, headings: {}, xrefs: 0, passageNotes: 0, omitted: 0, verses: 0, realigned: [], dropped: [] }

const usfmFiles = readdirSync(join(SRC, 'usfm')).filter((f) => f.endsWith('.usfm'))
const usfmByName = new Map()
for (const f of usfmFiles) {
  const t = readFileSync(join(SRC, 'usfm', f), 'utf8')
  usfmByName.set(/^\\h (.+)$/m.exec(t)[1].trim(), t)
}

mkdirSync(OUT, { recursive: true })

bsbOrder.forEach((bsbName, bookIndex) => {
  const book = books[bookIndex]
  const usfm = usfmByName.get(bsbName)
  if (!usfm) throw new Error(`no USFM file for ${bsbName}`)

  const chapters = []
  let ch = null
  let pendingRefs = [] // cross-reference lines that wait for their next verse
  // Pieces of verse text, in order: { verse, block, index, usfm }
  let pieces = []

  const finishChapter = () => {
    if (!ch) return
    for (const r of pendingRefs) throw new Error(`${bsbName} ${ch.n}: cross-reference line with no verse after it: ${r.t}`)
    alignChapter(bsbName, ch, pieces)
    chapters.push(ch)
  }

  for (const raw of usfm.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, '')
    if (!line) continue
    const m = /^\\([a-z]+\d?)(?: (.*))?$/.exec(line)
    if (!m) throw new Error(`${bsbName}: line without a marker: ${line}`)
    const [, marker, rest = ''] = m
    if (SKIP.has(marker)) continue
    if (marker === 'c') {
      finishChapter()
      ch = { n: Number(rest), blocks: [], xrefs: [] }
      pendingRefs = []
      pieces = []
      if (ch.n !== chapters.length + 1) throw new Error(`${bsbName}: chapter ${rest} out of order`)
      continue
    }
    if (!ch) throw new Error(`${bsbName}: ${marker} before the first chapter`)
    if (marker === 'r') {
      // A reference is "\ref <shown text>|<target>\ref*". A few have no target: the shown text is the target.
      const refs = [...rest.matchAll(/\\ref ([^|\\]*)(?:\|([^\\]*))?\\ref\*/g)].map((x) => x[2] ?? x[1])
      const t = rest.replace(/\\ref ([^|\\]*)(?:\|[^\\]*)?\\ref\*/g, '$1').trim()
      if (/\\/.test(t) || refs.length === 0) throw new Error(`${bsbName} ${ch.n}: cross-reference line: ${line}`)
      const xref = { v: 0, t, refs }
      ch.xrefs.push(xref)
      pendingRefs.push(xref)
      stats.xrefs++
      continue
    }
    if (marker === 'b') {
      ch.blocks.push({ k: 'b' })
      stats.blocks.b = (stats.blocks.b ?? 0) + 1
      continue
    }
    if (HEADINGS.has(marker) || (marker === 'd' && !/\\v /.test(rest))) {
      ch.blocks.push({ k: 'h', s: marker, t: headingText(rest) })
      stats.headings[marker] = (stats.headings[marker] ?? 0) + 1
      continue
    }
    // A text block. \d with a verse is the title of a psalm, which is part of verse 1.
    // \mr is used once, for the closing line of Habakkuk 3:19, which is part of the verse.
    if (!TEXT_BLOCKS.has(marker) && marker !== 'd' && marker !== 'mr') throw new Error(`${bsbName}: unknown marker \\${marker}`)
    const style = marker === 'mr' ? 'qd' : marker
    const block = { k: 'p', s: style, c: [] }
    const after = [] // passage notes that follow this block
    // A verse that is not in the main text comes after the end of the verse before it: before the next
    // verse number in this line, or at the end of the line. Its note can stand before a closing
    // quotation mark of that verse, as in Mark 11:25.
    const omittedHere = []
    let verse = pieces.length ? pieces.at(-1).verse : 0
    // Tokens: verse number, footnote, words of Jesus marker (dropped), text.
    const re = /\\v (\d+) |\\f \+ \\fr (\d+):(\d+)([\s\S]*?)\\f\*|\\wj\*?|([^\\]+)/g
    let consumed = 0
    for (const t of rest.matchAll(re)) {
      if (t.index !== consumed) throw new Error(`${bsbName} ${ch.n}: unknown text at ${rest.slice(consumed, consumed + 40)}`)
      consumed = t.index + t[0].length
      if (t[1] !== undefined) {
        block.c.push(...omittedHere.splice(0))
        verse = Number(t[1])
        block.c.push({ v: verse })
        for (const r of pendingRefs) r.v = verse
        pendingRefs = []
      } else if (t[2] !== undefined) {
        const ref = `${bsbName} ${t[2]}:${t[3]}`
        const body = t[4]
        const fv = [...body.matchAll(/\\fv (\d+)\\fv\*/g)].map((x) => Number(x[1]))
        const omitted = fv.find((n) => bsb.get(`${bsbName} ${t[2]}:${n}`) === '')
        if (omitted !== undefined) {
          // A verse that is not in the main text: its number and its note, at the place of the verse.
          omittedHere.push({ o: omitted, note: noteRuns(body) })
          stats.omitted++
        } else if (PASSAGE_NOTES.has(ref)) {
          after.push({ k: 'n', ref: `${t[2]}:${t[3]}`, note: noteRuns(body) })
          stats.passageNotes++
        }
        // Other footnotes are not in version 1.
      } else if (t[0].startsWith('\\wj')) {
        // The words of Jesus are not marked in version 1.
      } else {
        // Spaces between markers carry no words. The alignment ignores spaces.
        if (!t[5].trim()) continue
        if (!verse) throw new Error(`${bsbName} ${ch.n}: text before the first verse: ${t[5]}`)
        const piece = { verse, usfm: t[5] }
        block.c.push(piece)
        pieces.push(piece)
      }
    }
    if (consumed !== rest.length) throw new Error(`${bsbName} ${ch.n}: unparsed text: ${rest.slice(consumed)}`)
    block.c.push(...omittedHere.splice(0))
    // An empty line, for example "\p" before "\pc" in Acts 17:23, makes no block.
    if (block.c.length) {
      ch.blocks.push(block)
      stats.blocks[style] = (stats.blocks[style] ?? 0) + 1
    }
    ch.blocks.push(...after)
  }
  finishChapter()

  if (chapters.length !== book.chapters) throw new Error(`${book.id}: ${chapters.length} chapters, books.json has ${book.chapters}`)
  const out = { id: book.id, name: book.name, translation: 'Berean Standard Bible', chapters }
  writeFileSync(join(OUT, `${book.id}.json`), JSON.stringify(out))
})

// ---- Alignment ----

/** The characters that are not spaces, with their positions in the string. */
function visible(s) {
  const chars = []
  const pos = []
  for (let i = 0; i < s.length; i++) {
    if (!/\s/.test(s[i])) {
      chars.push(s[i])
      pos.push(i)
    }
  }
  return { chars, pos }
}

/**
 * For each cut in b (a count of visible characters of b before the cut), the count of visible
 * characters of a before the cut. Exact when the visible characters are the same; otherwise
 * from a longest common subsequence, with the characters that only a has kept with the earlier piece.
 */
function mapCuts(a, b, cuts) {
  if (a.join('') === b.join('')) return cuts
  const n = a.length
  const m = b.length
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1))
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  // aBefore[j]: the count of characters of a that come before character j of b.
  const aBefore = new Array(m + 1).fill(n)
  let i = 0
  let j = 0
  const matchedA = new Array(m).fill(-1)
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      matchedA[j] = i
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++
    else j++
  }
  // A cut before character j of b falls after the last a character matched before j,
  // and after the a characters that are not matched between that one and the next match.
  let nextMatched = n
  for (let k = m; k >= 0; k--) {
    if (k < m && matchedA[k] >= 0) nextMatched = matchedA[k]
    aBefore[k] = nextMatched
  }
  return cuts.map((c) => aBefore[c])
}

function alignChapter(bookName, ch, pieces) {
  const byVerse = new Map()
  for (const p of pieces) {
    if (!byVerse.has(p.verse)) byVerse.set(p.verse, [])
    byVerse.get(p.verse).push(p)
  }
  // Each verse of bsb.txt in this chapter must have pieces, and each verse with pieces must be in bsb.txt.
  for (let v = 1; bsb.has(`${bookName} ${ch.n}:${v}`); v++) {
    const text = bsb.get(`${bookName} ${ch.n}:${v}`)
    if (text === '') {
      if (byVerse.has(v)) throw new Error(`${bookName} ${ch.n}:${v} is empty in bsb.txt but has USFM text`)
      continue
    }
    if (!byVerse.has(v)) throw new Error(`${bookName} ${ch.n}:${v} has no USFM text`)
  }
  for (const [v, list] of byVerse) {
    const key = `${bookName} ${ch.n}:${v}`
    const text = bsb.get(key)
    if (!text) throw new Error(`${key}: USFM verse that bsb.txt does not have`)
    stats.verses++
    const a = visible(text)
    const cuts = []
    let count = 0
    const bChars = []
    for (const p of list) {
      cuts.push(count)
      const vis = visible(p.usfm).chars
      bChars.push(...vis)
      count += vis.length
    }
    const aCuts = mapCuts(a.chars, bChars, cuts)
    if (a.chars.join('') !== bChars.join('')) stats.realigned.push(key)
    // Cut the bsb.txt text at the first visible character of each piece. The spaces before
    // that character stay with the earlier piece. The first piece starts at 0.
    const starts = aCuts.map((c, i) => (i === 0 ? 0 : c >= a.pos.length ? text.length : a.pos[c]))
    list.forEach((p, i) => {
      p.text = text.slice(starts[i], i + 1 < list.length ? starts[i + 1] : text.length)
    })
    if (list.map((p) => p.text).join('') !== text) throw new Error(`${key}: the pieces do not join to the bsb.txt text`)
  }
  // Put the bsb.txt text in place of each piece. Join the text of neighbouring pieces in a block.
  // Remove empty pieces and empty blocks.
  for (const block of ch.blocks) {
    if (block.k !== 'p') continue
    const before = block.c
    const c = []
    for (const item of before) {
      if (!('usfm' in item)) c.push(item)
      else if (item.text === '') continue
      else if (typeof c.at(-1) === 'string') c[c.length - 1] += item.text
      else c.push(item.text)
    }
    block.c = c
    if (c.length === 0) stats.dropped.push(`${bookName} ${ch.n} [${block.s}] ${before.map((x) => x.usfm ?? JSON.stringify(x)).join(' | ')}`)
  }
  ch.blocks = ch.blocks.filter((b) => b.k !== 'p' || b.c.length > 0)
}

console.log(
  JSON.stringify(
    {
      verses: stats.verses,
      omitted: stats.omitted,
      passageNotes: stats.passageNotes,
      xrefs: stats.xrefs,
      headings: stats.headings,
      blocks: stats.blocks,
      realigned: stats.realigned.length,
      dropped: stats.dropped,
    },
    null,
    1,
  ),
)
if (process.argv.includes('--realigned')) console.log(stats.realigned.join('\n'))
