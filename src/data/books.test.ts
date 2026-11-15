import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { GROUPS, groupOf, type Book } from './books.ts'
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

  it('starts at Genesis and ends at Revelation', () => {
    expect([books[0].id, books[38].id, books[39].id, books[65].id]).toEqual(['genesis', 'malachi', 'matthew', 'revelation'])
  })

  it('has a unique id for each book', () => {
    expect(new Set(books.map((b) => b.id)).size).toBe(66)
  })

  it('gives each book a known group', () => {
    for (const b of books) expect(() => groupOf(b)).not.toThrow()
    expect(new Set(books.map((b) => b.group)).size).toBe(GROUPS.length)
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
    // A color near white must fail the check.
    expect(contrastRatio('#FBF6EA', '#FFFFFF')).toBeLessThan(4.5)
  })
})
