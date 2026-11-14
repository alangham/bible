// Links and read-with lists. docs/TASKS.md Task 7 steps 8 and 13.

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
// @ts-expect-error: a plain JavaScript module of the build scripts, with no types.
import { readOpenBible, readWithLists } from '../../scripts/links-common.mjs'
import type { Book } from './books.ts'
import type { BookLinks } from './links.ts'

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

  it('give Hebrews 9 the quotation links to Exodus 24:8 and Isaiah 53:12', () => {
    const data = JSON.parse(readFileSync(join(root, 'public/data/links/hebrews.json'), 'utf8')) as BookLinks
    const quoted = data.links
      .filter((l) => l.type === 'quotation' && l.a.book === 'hebrews' && l.a.c === 9)
      .map((l) => `${l.a.v} ${l.b.book} ${l.b.c}:${l.b.v}`)
      .sort()
    expect(quoted).toEqual(['19 exodus 24:8', '20 exodus 24:8', '28 isaiah 53:12'])
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
