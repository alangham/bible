import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { GROUPS, groupOf, spineThickness, type Book } from './books.ts'
import { contrastRatio } from './contrast.ts'

const books = JSON.parse(
  readFileSync(new URL('../../public/data/books.json', import.meta.url), 'utf8'),
) as Book[]

describe('books.json', () => {
  it('has 66 books', () => {
    expect(books).toHaveLength(66)
  })

  it('has 1,189 chapters in total', () => {
    expect(books.reduce((sum, b) => sum + b.chapters, 0)).toBe(1189)
  })

  it('has stack sizes 13, 14, 12, 14, 13', () => {
    const sizes = [1, 2, 3, 4, 5].map((s) => books.filter((b) => b.stack === s).length)
    expect(sizes).toEqual([13, 14, 12, 14, 13])
  })

  it('starts each stack at the book in docs/DESIGN.md section 4.1', () => {
    const first = [1, 2, 3, 4, 5].map((s) => books.find((b) => b.stack === s && b.position === 1)?.name)
    expect(first).toEqual(['Genesis', '2 Chronicles', 'Hosea', 'Matthew', '1 Timothy'])
  })

  it('keeps Bible order through the stacks and positions', () => {
    const sorted = [...books].sort((a, b) => a.stack - b.stack || a.position - b.position)
    expect(sorted.map((b) => b.id)).toEqual(books.map((b) => b.id))
  })

  it('has a unique id for each book', () => {
    expect(new Set(books.map((b) => b.id)).size).toBe(66)
  })

  it('gives each book a known group', () => {
    for (const b of books) expect(() => groupOf(b)).not.toThrow()
    expect(new Set(books.map((b) => b.group)).size).toBe(GROUPS.length)
  })
})

describe('spineThickness', () => {
  it('follows 26 + 3.2 * sqrt(chapters), with 40 px at least (POLISH.md items 3 and 13)', () => {
    expect(spineThickness(1)).toBe(40)
    expect(spineThickness(20)).toBeCloseTo(26 + 3.2 * Math.sqrt(20))
    expect(spineThickness(150)).toBeCloseTo(26 + 3.2 * Math.sqrt(150))
  })
})

describe('the group colors of the redesign (docs/DESIGN.md section 7.3)', () => {
  it('give ten groups ten colors, each with a contrast of 4.5 to 1 or more against white', () => {
    expect(GROUPS).toHaveLength(10)
    expect(new Set(GROUPS.map((g) => g.color)).size).toBe(10)
    for (const g of GROUPS) {
      expect(g.color, g.name).toMatch(/^#[0-9A-F]{6}$/)
      expect(contrastRatio(g.color, '#FFFFFF'), g.name).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('fails a color below the limit', () => {
    // The Gospels cloth of the first build is near white. It must fail the check.
    expect(contrastRatio('#FBF6EA', '#FFFFFF')).toBeLessThan(4.5)
  })
})
