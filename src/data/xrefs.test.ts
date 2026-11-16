// The cross-reference lines below the section headings. docs/DESIGN.md section 7.7, docs/TASKS.md Task 14.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Book } from './books.ts'
import { headingKey, marksOf, type BookLinks } from './links.ts'
import type { BookText } from './text.ts'
import { lineParts, referenceRange, referenceStart } from './xrefs.ts'

const root = join(import.meta.dirname, '..', '..')
const books = JSON.parse(readFileSync(join(root, 'public/data/books.json'), 'utf8')) as Book[]
const read = <T>(path: string) => JSON.parse(readFileSync(join(root, path), 'utf8')) as T

describe('cross-reference lines', () => {
  it('keep the space of the line of Malachi 3 as the publisher gives it', () => {
    const line = read<BookText>('public/data/text/malachi.json').chapters[2].xrefs.find((x) => x.t.startsWith('( '))!
    const parts = lineParts(books, line, [])
    expect(parts.map((p) => [p.before, p.shown])).toEqual([['( ', 'Matthew 11:7–19'], [' ', 'Luke 7:24–35']])
  })

  it('read the passage of a reference', () => {
    expect(referenceRange(books, 'PSA 78:1-72', 'Psalm 78:1–72')).toEqual({ book: 'psalms', c: 78, v: 1, c2: 78, v2: 72 })
    expect(referenceRange(books, 'ACT 7:44-8:3', 'Acts 7:44–8:3')).toEqual({ book: 'acts', c: 7, v: 44, c2: 8, v2: 3 })
    expect(referenceRange(books, 'JUD 24-25', 'Jude 1:24–25')).toEqual({ book: 'jude', c: 1, v: 24, v2: 25 })
    expect(referenceRange(books, 'Genesis 4–9', 'Genesis 4–9')).toEqual({ book: 'genesis', c: 4, v: 1, whole: true })
    expect(referenceRange(books, 'Joshua–Malachi', 'Joshua–Malachi')).toEqual({ book: 'joshua', c: 1, v: 1, whole: true })
  })

  it('read the first verse of a reference', () => {
    expect(referenceStart(books, 'EXO 40:1-33', 'Exodus 40:1–33')).toEqual({ book: 'exodus', c: 40, v: 1 })
    expect(referenceStart(books, 'JUD 24-25', 'Jude 1:24–25')).toEqual({ book: 'jude', c: 1, v: 24 })
    expect(referenceStart(books, 'PSA 23', 'Psalm 23')).toEqual({ book: 'psalms', c: 23, v: 1 })
  })

  it('show the line of Hebrews 9 as the publisher gives it, with a link for each reference', () => {
    const text = read<BookText>('public/data/text/hebrews.json')
    const marks = marksOf(read<BookLinks>('public/data/links/hebrews.json'), 'hebrews', 9, 'bsb')
    const line = text.chapters[8].xrefs[0]
    expect(line.t).toBe('(Exodus 40:1–33; Acts 7:44–47)')
    const parts = lineParts(books, line, marks.headings.get(headingKey('The Earthly Tabernacle', line.v)) ?? [])
    expect(parts.map((p) => p.shown)).toEqual(['Exodus 40:1–33', 'Acts 7:44–47'])
    expect(parts.map((p) => [p.before, p.after])).toEqual([['(', ''], [' ', ')']])
    // The pop-up gets the passage that the line names, not only its first verse.
    expect(parts.map((p) => p.reference)).toEqual([
      { shown: 'Exodus 40:1–33', passage: { book: 'exodus', c: 40, v: 1, c2: 40, v2: 33 }, firstVerse: false },
      { shown: 'Acts 7:44–47', passage: { book: 'acts', c: 7, v: 44, c2: 7, v2: 47 }, firstVerse: false },
    ])
    expect(parts.map((p) => p.end && `${p.end.there.book} ${p.end.there.c}:${p.end.there.v}`)).toEqual(['exodus 40:1', 'acts 7:44'])
  })

  it('name every link end at a heading in the line below that heading: the page loses no link', () => {
    let ends = 0
    let named = 0
    let plain = 0
    let lines = 0
    const firstVerse: string[] = []
    for (const book of books) {
      const text = read<BookText>(`public/data/text/${book.id}.json`)
      const links = read<BookLinks>(`public/data/links/${book.id}.json`)
      for (const chapter of text.chapters) {
        const marks = marksOf(links, book.id, chapter.n, 'bsb')
        for (const [key, list] of marks.headings) {
          ends += list.length
          const v = Number(key.split('|')[0])
          const line = chapter.xrefs.find((x) => x.v === v)
          const parts = line ? lineParts(books, line, list) : []
          named += parts.filter((p) => p.end).length
        }
        for (const line of chapter.xrefs) {
          const list = [...marks.headings.entries()].filter(([k]) => Number(k.split('|')[0]) === line.v).flatMap(([, l]) => l)
          const parts = lineParts(books, line, list)
          plain += parts.filter((p) => !p.end).length
          for (const p of parts) if (p.reference?.firstVerse) firstVerse.push(`${book.name} ${chapter.n}: ${p.shown}`)
          // The page shows the line with no change, also its spaces.
          expect(parts.map((p) => p.before + p.shown + p.after).join(';')).toBe(line.t)
          lines++
        }
      }
    }
    expect(ends).toBeGreaterThan(0)
    expect(named).toBe(ends)
    // 56 references in the lines have no link. The page shows them as plain text.
    expect(plain).toBe(56)
    expect(lines).toBe(1325)
    // The references to whole chapters or books: the pop-up shows the first verse, with the label "First verse".
    expect(firstVerse).toEqual(['Hebrews 11: Genesis 4–9', 'Hebrews 11: Genesis 15–22', 'Hebrews 11: Genesis 27–50', 'Hebrews 11: Exodus 2–15', 'Hebrews 11: Joshua–Malachi'])
  })
})
