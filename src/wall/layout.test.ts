import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Book } from '../data/books.ts'
import { balancedSplit, bandLabel, groupBlocks, narrowSizes, wideColumns, wideSizes, WIDE_COLUMNS } from './layout.ts'

const books = JSON.parse(readFileSync(new URL('../../public/data/books.json', import.meta.url), 'utf8')) as Book[]

describe('the wide layout of the wall', () => {
  it('has five columns with 13, 14, 12, 14, and 13 books in Bible order', () => {
    const columns = wideColumns(books)
    expect(columns.map((c) => c.length)).toEqual([13, 14, 12, 14, 13])
    expect(WIDE_COLUMNS.reduce((a, b) => a + b, 0)).toBe(66)
    expect(columns.map((c) => c[0].name)).toEqual(['Genesis', '2 Chronicles', 'Hosea', 'Matthew', '1 Timothy'])
    expect(columns.flat().map((b) => b.id)).toEqual(books.map((b) => b.id))
  })

  it('takes its sizes from the screen width, as in the prototype', () => {
    expect(wideSizes(1440)).toEqual({ pad: 64, gap: 30, inner: 1192, column: (1192 - 120) / 5 })
    const s = wideSizes(900)
    expect(s.pad).toBeCloseTo(40.5)
    expect(s.gap).toBeCloseTo(18.9)
  })
})

describe('the narrow layout of the wall', () => {
  it('is 520 px wide at most, with two columns in each block', () => {
    expect(narrowSizes(390)).toEqual({ wall: 390, full: 350, column: 168 })
    expect(narrowSizes(834).wall).toBe(520)
  })

  it('has one block for each of the ten groups, in Bible order', () => {
    const blocks = groupBlocks(books)
    expect(blocks.map((b) => b.group)).toEqual([
      'Law', 'History', 'Poetry & Wisdom', 'Major Prophets', 'Minor Prophets',
      'Gospels', 'History (Acts)', 'Letters of Paul', 'General Letters', 'Prophecy',
    ])
    expect(blocks.filter((b) => b.books.length === 1).map((b) => b.books[0].name)).toEqual(['Acts', 'Revelation'])
  })

  it('divides a block so that the two columns have almost the same height', () => {
    expect(balancedSplit([40, 40, 40, 40])).toBe(2)
    expect(balancedSplit([100, 30, 30, 30])).toBe(1)
    expect(balancedSplit([30, 30, 30, 100])).toBe(3)
    expect(balancedSplit([50, 50, 50])).toBe(1)
  })
})

describe('the band of a group', () => {
  it('says "History" for the group "History (Acts)", and the group name for the others', () => {
    expect(bandLabel('History (Acts)')).toBe('History')
    expect(bandLabel('Poetry & Wisdom')).toBe('Poetry & Wisdom')
  })
})
