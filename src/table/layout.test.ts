import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { GROUPS, spineThickness, type Book } from '../data/books.ts'
import { layoutTable, PX, STACK_GAP, STACK_WIDTH } from './layout.ts'

const books = JSON.parse(
  readFileSync(new URL('../../public/data/books.json', import.meta.url), 'utf8'),
) as Book[]

describe('layoutTable', () => {
  const layout = layoutTable(books)

  it('gives one box for each book, in Bible order', () => {
    expect(layout.spines.map((s) => s.book.id)).toEqual(books.map((b) => b.id))
  })

  it('makes each box as thick as the thickness rule', () => {
    for (const s of layout.spines) expect(s.thickness).toBeCloseTo(spineThickness(s.book.chapters) * PX)
  })

  it('puts position 1 at the top of each stack', () => {
    for (let stack = 1; stack <= 5; stack++) {
      const inStack = layout.spines.filter((s) => s.book.stack === stack)
      const top = inStack.reduce((a, b) => (a.y > b.y ? a : b))
      expect(top.book.position).toBe(1)
    }
  })

  it('stacks the boxes without gaps or overlaps from the table up', () => {
    for (let stack = 1; stack <= 5; stack++) {
      const inStack = layout.spines.filter((s) => s.book.stack === stack).sort((a, b) => a.y - b.y)
      let floor = 0
      for (const s of inStack) {
        expect(s.y - s.thickness / 2).toBeCloseTo(floor)
        floor += s.thickness
      }
    }
  })

  it('uses the five-column width of mockup D1', () => {
    expect(layout.width).toBeCloseTo(5 * STACK_WIDTH + 4 * STACK_GAP)
  })
})

describe('group colors', () => {
  // WCAG 2 relative luminance and contrast ratio.
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }

  it.each(GROUPS.map((g) => [g.name, g] as const))('%s spine text has a contrast of 4.5 to 1 or more', (_, g) => {
    expect(contrast(g.cloth, g.text)).toBeGreaterThanOrEqual(4.5)
  })
})
