// The marks of the words of Jesus in the site data. docs/TASKS.md Task 26 step 8, docs/DESIGN.md section 11.
//
// The test reads the marks of the source files with code of its own, not with the code of
// scripts/build-text.mjs or scripts/build-text-kjv.mjs.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Book } from './books.ts'
import { isAdded, isMarked, isOmitted, isVerseMark, type BookText } from './text.ts'

const root = join(import.meta.dirname, '..', '..')
const books = JSON.parse(readFileSync(join(root, 'public/data/books.json'), 'utf8')) as Book[]
const load = (dir: string) => books.map((b) => JSON.parse(readFileSync(join(root, 'public/data', dir, `${b.id}.json`), 'utf8')) as BookText)
const DATA = { bsb: load('text'), kjv: load('text-kjv') }
type Key = keyof typeof DATA

// The King James Version files are in Bible order by name, and their names hold the USFM code of the book.
const kjvFiles = readdirSync(join(root, 'sources/kjv/usfm'))
  .filter((f) => f.endsWith('.usfm'))
  .sort()
const codes = kjvFiles.map((f) => /^\d+-(\w{3})eng-/.exec(f)![1])

/** The exception of docs/DESIGN.md section 11.3: the words that the site does not mark. A list of the test's own. */
const KJV_NOT_MARKED: Record<string, string> = { 'mark 12:37': ' And the common people heard him gladly.' }

// ---- the data: for each verse, its words, each with a flag for a mark ----

interface Seg {
  t: string
  m: boolean
}

function dataVerses(texts: BookText[]): Map<string, Seg[]> {
  const out = new Map<string, Seg[]>()
  texts.forEach((book) => {
    for (const ch of book.chapters) {
      let v = 0
      for (const b of ch.blocks) {
        if (b.k !== 'p') continue
        for (const x of b.c) {
          if (isVerseMark(x)) {
            v = x.v
            continue
          }
          if (isOmitted(x)) continue
          const key = `${book.id} ${ch.n}:${v}`
          if (!out.has(key)) out.set(key, [])
          const seg = typeof x === 'string' ? { t: x, m: false } : isAdded(x) ? { t: x.a, m: x.j === 1 } : isMarked(x) ? { t: x.j, m: true } : null
          if (!seg) throw new Error(`${key}: unknown item ${JSON.stringify(x)}`)
          out.get(key)!.push(seg)
        }
      }
    }
  })
  return out
}
const VERSES = { bsb: dataVerses(DATA.bsb), kjv: dataVerses(DATA.kjv) }

/** The runs of marked words of a verse in the data: the marked items next to each other make one run. */
function runs(segs: Seg[]): string[] {
  const out: string[] = []
  let open = false
  for (const s of segs) {
    if (s.m && open) out[out.length - 1] += s.t
    else if (s.m) out.push(s.t)
    open = s.m
  }
  return out
}

const LETTER = /[\p{L}\p{N}]/gu
function classOf(segs: Seg[]): 'all' | 'part' | 'none' {
  let inside = 0
  let outside = 0
  for (const s of segs) {
    const n = (s.t.match(LETTER) ?? []).length
    if (s.m) inside += n
    else outside += n
  }
  return inside === 0 ? 'none' : outside === 0 ? 'all' : 'part'
}

// ---- the sources: the marked words of each verse ----

/** The marked words of each verse of the Berean files: "<book id> <c>:<v>" -> marked words, in order. */
function bsbSource(): Map<string, string[]> {
  const out = new Map<string, string[]>()
  const SKIP = /^\\(id|usfm|h|toc\d|mt\d|s\d|ms|qa|r|b)(\s|$)/
  codes.forEach((code, bi) => {
    const lines = readFileSync(join(root, 'sources/bsb/usfm', `${code}.usfm`), 'utf8').split(/\r?\n/)
    let c = 0
    let v = 0
    for (const raw of lines) {
      const line = raw.trim()
      const cm = /^\\c (\d+)/.exec(line)
      if (cm) {
        c = Number(cm[1])
        v = 0
        continue
      }
      if (!line || SKIP.test(line)) continue
      if (/^\\d /.test(line) && !/\\v /.test(line)) continue
      const rest = line.replace(/^\\[a-z]+\d?\s?/, '').replace(/\\f \+[\s\S]*?\\f\*/g, '')
      let inMark = false
      for (const t of rest.matchAll(/\\v (\d+) |\\wj\*|\\wj |([^\\]+)|(\\)/g)) {
        if (t[1]) v = Number(t[1])
        else if (t[0] === '\\wj ') {
          inMark = true
          const key = `${books[bi].id} ${c}:${v}`
          // A mark can start before the verse number of its words: its words go to the verse they are in.
          out.set(key, out.get(key) ?? [])
        } else if (t[0] === '\\wj*') inMark = false
        else if (t[3]) throw new Error(`${code} ${c}:${v}: a marker that the test does not know: ${rest}`)
        else if (inMark && t[2].trim()) {
          const key = `${books[bi].id} ${c}:${v}`
          out.set(key, [...(out.get(key) ?? []), t[2]])
        }
      }
    }
  })
  for (const [k, list] of out) if (!list.length) out.delete(k)
  return out
}

/** The words of a piece of USFM of the King James Version: no footnote, no Strong's number, no marker, no "¶". */
function kjvWords(usfm: string): string {
  return usfm
    .replace(/\\f [\s\S]*?\\f\*/g, '')
    .replace(/\|strong="[^"]*"/g, '')
    .replace(/¶/g, '')
    .replace(/\\\+?[a-z]+\d?\*/g, '')
    .replace(/\\\+?[a-z]+\d?(\s|$)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** The words of each mark of each verse of the King James Version files: "<book id> <c>:<v>" -> marks. */
function kjvSource(): Map<string, string[]> {
  const out = new Map<string, string[]>()
  kjvFiles.forEach((f, bi) => {
    const body = readFileSync(join(root, 'sources/kjv/usfm', f), 'utf8')
    const parts = body.split(/\\c (\d+)\s/)
    for (let i = 1; i < parts.length; i += 2) {
      const c = Number(parts[i])
      const chapter = parts[i + 1]
      const verses = chapter.slice(chapter.indexOf('\\v ')).split(/\\v (\d+)\s/)
      for (let k = 1; k < verses.length; k += 2) {
        const marks = [...verses[k + 1].matchAll(/\\wj ([\s\S]*?)\\wj\*/g)].map((m) => kjvWords(m[1]))
        if (marks.length) out.set(`${books[bi].id} ${c}:${verses[k]}`, marks)
      }
    }
  })
  return out
}

const SOURCE = { bsb: bsbSource(), kjv: kjvSource() }

// ---- the tests ----

const noSpace = (s: string) => s.replace(/\s+/g, '')

describe('marks of the words of Jesus', () => {
  it('has the marked words of each verse of the Berean files, with the spaces and [’’] ignored', () => {
    const differ: string[] = []
    const keys = new Set([...SOURCE.bsb.keys(), ...[...VERSES.bsb].filter(([, s]) => s.some((x) => x.m)).map(([k]) => k)])
    for (const key of keys) {
      const source = noSpace((SOURCE.bsb.get(key) ?? []).join('')).replaceAll('[’’]', '')
      const data = noSpace(runs(VERSES.bsb.get(key) ?? []).join(''))
      if (source !== data) differ.push(`${key}: source "${source}", data "${data}"`)
    }
    expect(differ).toEqual([])
    expect(keys.size).toBe(1405 + 642)
  })

  it('has the marked words of each verse of the King James Version files, mark by mark, with the one exception', () => {
    const differ: string[] = []
    const keys = new Set([...SOURCE.kjv.keys(), ...[...VERSES.kjv].filter(([, s]) => s.some((x) => x.m)).map(([k]) => k)])
    for (const key of keys) {
      let source = SOURCE.kjv.get(key) ?? []
      if (KJV_NOT_MARKED[key]) source = source.map((w) => w.replace(KJV_NOT_MARKED[key].trim(), '').trim())
      const data = runs(VERSES.kjv.get(key) ?? []).map((r) => r.replace(/\s+/g, ' ').trim())
      if (JSON.stringify(source) !== JSON.stringify(data)) differ.push(`${key}: source ${JSON.stringify(source)}, data ${JSON.stringify(data)}`)
    }
    expect(differ).toEqual([])
    expect([...SOURCE.kjv.values()].reduce((n, l) => n + l.length, 0)).toBe(2038)
  })

  it('has the numbers of verses "all" and "part" of the report of Task 25, with Mark 12:37 of the King James Version as "part"', () => {
    const count = (k: Key) => {
      const n = { all: 0, part: 0, none: 0 }
      for (const segs of VERSES[k].values()) n[classOf(segs)]++
      return n
    }
    const bsb = count('bsb')
    const kjv = count('kjv')
    expect({ all: bsb.all, part: bsb.part }).toEqual({ all: 1405, part: 642 })
    expect({ all: kjv.all, part: kjv.part }).toEqual({ all: 1401, part: 627 })
  })

  it('has marks only in the books of the report', () => {
    const marked = (k: Key) => DATA[k].filter((t) => t.chapters.some((ch) => ch.blocks.some((b) => b.k === 'p' && b.c.some((x) => isMarked(x) || (isAdded(x) && x.j === 1))))).map((t) => t.id)
    const nine = ['matthew', 'mark', 'luke', 'john', 'acts', '1-corinthians', '2-corinthians', 'hebrews', 'revelation']
    expect(marked('bsb')).toEqual(nine)
    expect(marked('kjv')).toEqual(nine.filter((id) => id !== 'hebrews'))
  })

  it('has John 3:16 as "all" and Matthew 3:17 as "none" in the two translations', () => {
    for (const k of ['bsb', 'kjv'] as Key[]) {
      expect(classOf(VERSES[k].get('john 3:16')!), k).toBe('all')
      expect(classOf(VERSES[k].get('matthew 3:17')!), k).toBe('none')
    }
  })

  it('marks Mark 12:37 of the King James Version up to "his son?", and not the last sentence', () => {
    const segs = VERSES.kjv.get('mark 12:37')!
    const marked = segs.filter((s) => s.m).map((s) => s.t).join('')
    const plain = segs.filter((s) => !s.m).map((s) => s.t).join('')
    expect(marked).toContain('David therefore himself calleth him Lord')
    expect(marked.trim().endsWith('his son?')).toBe(true)
    expect(plain).toContain('And the common people heard him gladly.')
    expect(marked).not.toContain('common people')
  })

  it('has no verse number inside an item j, and no empty item j', () => {
    const bad: string[] = []
    for (const k of ['bsb', 'kjv'] as Key[])
      for (const t of DATA[k])
        for (const ch of t.chapters)
          for (const b of ch.blocks) {
            if (b.k !== 'p') continue
            for (const x of b.c) {
              if (typeof x !== 'object' || !('j' in x)) continue
              const keys = Object.keys(x).sort().join(',')
              const ok = isAdded(x) ? keys === 'a,j' && x.j === 1 && x.a !== '' : keys === 'j' && typeof x.j === 'string' && x.j !== ''
              if (!ok) bad.push(`${k} ${t.id} ${ch.n}: ${JSON.stringify(x)}`)
            }
          }
    expect(bad).toEqual([])
  })
})
