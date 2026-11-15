// The layout of the timeline in the wide layout. docs/TASKS.md Task 17 step 5.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Book } from '../data/books.ts'
import type { BookDate } from '../data/dates.ts'
import { BREAK_PX, MIN_TICK_PX, NAME_PAD_PX, OLD_TESTAMENT_BOOKS, timelineLayout } from './timelineLayout.ts'

const root = join(import.meta.dirname, '..', '..')
const books = JSON.parse(readFileSync(join(root, 'public/data/books.json'), 'utf8')) as Book[]
const dateList = JSON.parse(readFileSync(join(root, 'public/data/dates.json'), 'utf8')) as BookDate[]
const dates = new Map(dateList.map((d) => [d.id, d]))

/** A name width that grows with the number of letters, as a measured name does. */
const nameWidth = (b: Book) => 9.5 * b.name.length

describe('timeline layout', () => {
  for (const width of [900 - 2 * 48, 1200, 1600]) {
    const t = timelineLayout(books, dates, width, nameWidth)

    it(`at ${width} px: the break is ${BREAK_PX} px, and the Old Testament part is 700 / 1130 of the rest`, () => {
      expect(t.breakEnd - t.breakStart).toBe(BREAK_PX)
      expect(Math.abs(t.breakStart - ((width - BREAK_PX) * 700) / 1130)).toBeLessThanOrEqual(0.5)
    })

    it(`at ${width} px: each Old Testament book is left of the break, and each New Testament book is right of it`, () => {
      expect(t.items).toHaveLength(66)
      for (const it of t.items) {
        const old = books.indexOf(it.book) < OLD_TESTAMENT_BOOKS
        if (old) expect(it.x2).toBeLessThanOrEqual(t.breakStart)
        else expect(it.x1).toBeGreaterThanOrEqual(t.breakEnd)
        expect(it.x1).toBeLessThanOrEqual(it.x2)
      }
    })

    it(`at ${width} px: no two names in one row overlap, and each name is on the line`, () => {
      for (let row = 0; row < t.rows; row++) {
        const spans = t.items
          .filter((it) => it.row === row)
          .map((it) => [it.x - (it.width + NAME_PAD_PX) / 2, it.x + (it.width + NAME_PAD_PX) / 2] as const)
          .sort((p, q) => p[0] - q[0])
        for (let i = 1; i < spans.length; i++) expect(spans[i][0]).toBeGreaterThanOrEqual(spans[i - 1][1] - 1e-9)
      }
      for (const it of t.items) {
        expect(it.x - it.width / 2).toBeGreaterThanOrEqual(0)
        expect(it.x + it.width / 2).toBeLessThanOrEqual(width)
      }
    })

    it(`at ${width} px: the ticks go from left to right, no tick is the year 0, and two labels are ${MIN_TICK_PX} px apart or more`, () => {
      const xs = t.ticks.map((k) => k.x)
      expect([...xs].sort((p, q) => p - q)).toEqual(xs)
      expect(t.ticks.some((k) => /^(0 BC|AD 0)$/.test(k.label))).toBe(false)
      expect(t.ticks.map((k) => k.label)).toContain('1000 BC')
      expect(t.ticks.map((k) => k.label)).toContain('AD 60')
      for (const side of [t.ticks.filter((k) => k.x <= t.breakStart), t.ticks.filter((k) => k.x >= t.breakEnd)])
        for (let i = 1; i < side.length; i++) expect(side[i].x - side[i - 1].x).toBeGreaterThanOrEqual(MIN_TICK_PX - 1e-9)
    })
  }

  it('at 1200 px, the line of the 1440 px window, the labels are each 100 years and each 10 years, as in the prototype', () => {
    const labels = timelineLayout(books, dates, 1200, nameWidth).ticks.map((k) => k.label)
    expect(labels).toEqual([
      '1400 BC', '1300 BC', '1200 BC', '1100 BC', '1000 BC', '900 BC', '800 BC', '700 BC', '600 BC', '500 BC', '400 BC',
      'AD 40', 'AD 50', 'AD 60', 'AD 70', 'AD 80', 'AD 90', 'AD 100',
    ])
  })

  it('puts the books in date order, with Bible order on a tie', () => {
    const t = timelineLayout(books, dates, 1200, nameWidth)
    const ids = t.items.map((it) => it.book.id)
    expect(ids[0]).toBe('genesis')
    expect(ids.slice(0, 4)).toEqual(['genesis', 'exodus', 'leviticus', 'numbers'])
    expect(ids.indexOf('james')).toBe(OLD_TESTAMENT_BOOKS)
  })

  it('gives the years with no books: 370', () => {
    expect(timelineLayout(books, dates, 1200, nameWidth).between).toBe(370)
  })
})
