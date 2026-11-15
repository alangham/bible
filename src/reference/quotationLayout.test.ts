// The geometry of the quotation diagram. docs/TASKS.md Task 15 step 4.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Book } from '../data/books.ts'
import type { QuotationPair } from '../data/dates.ts'
import { diagram, lineStep, NARROW_SIZE, quotationLists, WIDE_SIZE } from './quotationLayout.ts'

const root = join(import.meta.dirname, '..', '..')
const books = JSON.parse(readFileSync(join(root, 'public/data/books.json'), 'utf8')) as Book[]
const pairs = JSON.parse(readFileSync(join(root, 'public/data/quotation-pairs.json'), 'utf8')) as QuotationPair[]

describe('quotation diagram', () => {
  it('puts the 66 books around the circle in Bible order, with one arc for each of the ten groups', () => {
    for (const size of [WIDE_SIZE, NARROW_SIZE]) {
      const d = diagram(books, pairs, size)
      expect(d.books.map((b) => b.book.id)).toEqual(books.map((b) => b.id))
      expect(d.arcs.map((a) => a.group)).toEqual([
        'Law',
        'History',
        'Poetry & Wisdom',
        'Major Prophets',
        'Minor Prophets',
        'Gospels',
        'History (Acts)',
        'Letters of Paul',
        'General Letters',
        'Prophecy',
      ])
      // The angles grow in Bible order, and the circle closes with Revelation before Genesis.
      for (let i = 1; i < d.books.length; i++) expect(d.books[i].angle).toBeGreaterThan(d.books[i - 1].angle)
      expect(d.books[65].angle - d.books[0].angle).toBeLessThan(Math.PI * 2)
    }
  })

  it('draws one line for each pair in quotation-pairs.json, with three steps of thickness', () => {
    const d = diagram(books, pairs, WIDE_SIZE)
    expect(d.lines).toHaveLength(pairs.length)
    expect([1, 2, 3, 9, 10, 25].map(lineStep)).toEqual([0, 0, 1, 1, 2, 2])
    for (const l of d.lines) expect(l.width).toBe(WIDE_SIZE.lineWidths[lineStep(l.pair.n)])
    // The color goes from the book that quotes to the book that it quotes.
    const line = d.lines.find((l) => l.pair.from === 'romans' && l.pair.to === 'psalms')!
    expect([line.from.color, line.to.color]).toEqual(['#1B2A41', '#CD4C26'])
  })

  it('gives the lists of a book from quotation-pairs.json, most links first', () => {
    const lists = quotationLists(books, pairs, 'romans')
    const fromData = pairs.filter((p) => p.from === 'romans')
    expect(lists.quotes.map((x) => [x.book.id, x.n]).sort()).toEqual(fromData.map((p) => [p.to, p.n]).sort())
    for (let i = 1; i < lists.quotes.length; i++) expect(lists.quotes[i].n).toBeLessThanOrEqual(lists.quotes[i - 1].n)
    expect(lists.quotedBy).toEqual([])
    const isaiah = quotationLists(books, pairs, 'isaiah')
    expect(isaiah.quotedBy.map((x) => [x.book.id, x.n]).sort()).toEqual(pairs.filter((p) => p.to === 'isaiah').map((p) => [p.from, p.n]).sort())
  })
})
