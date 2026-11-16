// Links and read-with lists. docs/TASKS.md Task 7 steps 8 and 13.

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
// @ts-expect-error: a plain JavaScript module of the build scripts, with no types.
import { readOpenBible, readWithLists } from '../../scripts/links-common.mjs'
import type { Book } from './books.ts'
import { marksOf, type BookLinks } from './links.ts'
import { isOmitted, isVerseMark, type BookText } from './text.ts'

const root = join(import.meta.dirname, '..', '..')
const books = JSON.parse(readFileSync(join(root, 'public/data/books.json'), 'utf8')) as Book[]

describe('links', () => {
  it('pass the link check script: ends, no self link, no duplicate, type, approved source', () => {
    const out = execFileSync(process.execPath, [join(root, 'scripts/check-links.mjs')], { encoding: 'utf8' })
    const summary = JSON.parse(out) as { links: number; problems: number; first: string[] }
    expect(summary.first).toEqual([])
    expect(summary.problems).toBe(0)
    expect(summary.links).toBeGreaterThan(0)
  })

  it('give no link with the fit "close" or "weak" the strong mark or a reason line (Task 7b)', () => {
    const fits = JSON.parse(readFileSync(join(root, 'content/quotation-reasons.json'), 'utf8')) as Record<string, { fit: string }>
    const seen = new Map<string, BookLinks['links'][number]>()
    for (const book of books) {
      const data = JSON.parse(readFileSync(join(root, 'public/data/links', `${book.id}.json`), 'utf8')) as BookLinks
      for (const l of data.links) if (l.source === 'Bible Quotation Database') seen.set(l.id, l)
    }
    let echo = 0
    for (const l of seen.values()) {
      const fit = fits[`${l.a.book}.${l.a.c}.${l.a.v}|${l.b.book}.${l.b.c}.${l.b.v}`]?.fit
      expect(fit, l.id).toBeDefined()
      if (fit === 'close' || fit === 'weak') {
        echo++
        expect(l.type, `${l.id}: fit ${fit}`).toBe('echo')
        expect(l.reason, `${l.id}: fit ${fit}`).toBeUndefined()
        // The mark of a verse is strong only if one of its links is a quotation link.
        const marks = marksOf(JSON.parse(readFileSync(join(root, 'public/data/links', `${l.a.book}.json`), 'utf8')) as BookLinks, l.a.book, l.a.c)
        const end = marks.verses.get(l.a.v)?.find((e) => e.link.id === l.id)
        expect(end?.link.type, l.id).toBe('echo')
      } else expect(l.type, `${l.id}: fit ${fit}`).toBe('quotation')
    }
    expect(echo).toBeGreaterThan(0)
  })

  it('give Hebrews 9 the quotation links to Exodus 24:8 and Isaiah 53:12, and no more (Task 7b)', () => {
    const data = JSON.parse(readFileSync(join(root, 'public/data/links/hebrews.json'), 'utf8')) as BookLinks
    const quoted = data.links
      .filter((l) => l.type === 'quotation' && l.a.book === 'hebrews' && l.a.c === 9)
      .map((l) => `${l.a.v} ${l.b.book} ${l.b.c}:${l.b.v}`)
      .sort()
    expect(quoted).toEqual(['20 exodus 24:8', '28 isaiah 53:12'])
  })
})

describe('read-with lists', () => {
  // The Bible text, as "book index:chapter:verse".
  const verses = new Set<string>()
  let b = -1
  let last = ''
  for (const line of readFileSync(join(root, 'sources/bsb/bsb.txt'), 'utf8').replace(/^﻿/, '').split(/\r?\n/)) {
    const m = /^(.+) (\d+):(\d+)\t/.exec(line)
    if (!m) continue
    if (m[1] !== last) {
      last = m[1]
      b++
    }
    verses.add(`${b}:${m[2]}:${m[3]}`)
  }

  it('are the result of the rule on the OpenBible.info file, for 20 chapters', () => {
    const lists = readWithLists(readOpenBible(root, verses).links) as Map<string, { b: number; c: number }[]>
    // 20 chapters spread over the Bible, and the four chapters of the report.
    const all = books.flatMap((book, i) => Array.from({ length: book.chapters }, (_, k) => ({ i, book, c: k + 1 })))
    const sample = Array.from({ length: 16 }, (_, k) => all[Math.floor((k * all.length) / 16)])
    for (const [id, c] of [['genesis', 1], ['psalms', 23], ['john', 3], ['hebrews', 9]] as const) {
      const i = books.findIndex((x) => x.id === id)
      sample.push({ i, book: books[i], c })
    }
    expect(sample).toHaveLength(20)
    for (const s of sample) {
      const data = JSON.parse(readFileSync(join(root, 'public/data/links', `${s.book.id}.json`), 'utf8')) as BookLinks
      const expected = (lists.get(`${s.i}:${s.c}`) ?? []).map((e) => ({ book: books[e.b].id, c: e.c }))
      expect(data.readWith[s.c] ?? [], `${s.book.name} ${s.c}`).toEqual(expected)
      for (const e of expected) expect(e.book, `${s.book.name} ${s.c}: an entry in the same book`).not.toBe(s.book.id)
    }
  })

  it('give Hebrews 9 the read-with list with Leviticus 16', () => {
    const data = JSON.parse(readFileSync(join(root, 'public/data/links/hebrews.json'), 'utf8')) as BookLinks
    expect(data.readWith['9']).toContainEqual({ book: 'leviticus', c: 16 })
  })
})

// The links whose passage starts at a verse that the data of a translation does not have. docs/TASKS.md Task 30
// step 9, docs/DESIGN.md section 13.4. Task 31 uses this list.
describe('links and the verses of each translation', () => {
  /** "<book id> <c>:<v>" of each verse that a data folder has: an item { v: n } or { o: n }. */
  const versesOf = (folder: string) => {
    const out = new Set<string>()
    for (const book of books) {
      const text = JSON.parse(readFileSync(join(root, 'public/data', folder, `${book.id}.json`), 'utf8')) as BookText
      for (const ch of text.chapters)
        for (const b of ch.blocks) {
          if (b.k !== 'p') continue
          for (const x of b.c) {
            if (isVerseMark(x)) out.add(`${book.id} ${ch.n}:${x.v}`)
            else if (isOmitted(x)) out.add(`${book.id} ${ch.n}:${x.o}`)
          }
        }
    }
    return out
  }
  const links = new Map<string, BookLinks['links'][number]>()
  for (const book of books) {
    const data = JSON.parse(readFileSync(join(root, 'public/data/links', `${book.id}.json`), 'utf8')) as BookLinks
    for (const l of data.links) links.set(l.id, l)
  }
  const missing = (folder: string) => {
    const has = versesOf(folder)
    return [...links.values()]
      .filter((l) => [l.a, l.b].some((p) => !has.has(`${p.book} ${p.c}:${p.v}`)))
      .map((l) => l.id)
      .sort()
  }

  it('finds no such link for the Berean Standard Bible and the King James Version, and three for the World English Bible', () => {
    expect(links.size).toBe(3866)
    expect(missing('text')).toEqual([])
    expect(missing('text-kjv')).toEqual([])
    expect(missing('text-web')).toEqual(['h1733', 'o3385', 'o3515'])
  })
})
