import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Book } from '../data/books.ts'
import type { BookDate } from '../data/dates.ts'
import { layoutBand, rowOffset, SPINE_PX } from './layout.ts'

const read = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const books = read('../../public/data/books.json') as Book[]
const dates = new Map((read('../../public/data/dates.json') as BookDate[]).map((d) => [d.id, d]))
// About the width of the names in the spine font, 14 px capitals.
const nameWidth = (name: string) => name.length * 10.5

for (const [band, list] of [
  ['Old Testament', books.slice(0, 39)],
  ['New Testament', books.slice(39)],
] as const) {
  describe(`the timeline band of the ${band}`, () => {
    for (const width of [800, 1296]) {
      const layout = layoutBand(list, dates, width, nameWidth)

      it(`places each book once at ${width} px`, () => {
        expect(layout.spines.map((s) => s.id).sort()).toEqual(list.map((b) => b.id).sort())
      })

      it(`lets no spine cover a different spine at ${width} px`, () => {
        const s = layout.spines
        for (let i = 0; i < s.length; i++) {
          for (let j = i + 1; j < s.length; j++) {
            const sameRow = s[i].row === s[j].row
            const touch = s[i].left < s[j].left + s[j].width && s[j].left < s[i].left + s[i].width
            expect(sameRow && touch, `${s[i].id} and ${s[j].id}`).toBe(false)
          }
        }
      })

      it(`keeps each spine inside the band at ${width} px`, () => {
        for (const s of layout.spines) {
          expect(s.left, s.id).toBeGreaterThanOrEqual(0)
          expect(s.left + s.width, s.id).toBeLessThanOrEqual(width + 0.001)
        }
      })

      it(`puts the books with no date after the axis at ${width} px`, () => {
        for (const s of layout.spines.filter((x) => x.unknown)) expect(s.left, s.id).toBeGreaterThan(layout.axisWidth)
        for (const s of layout.spines.filter((x) => !x.unknown)) expect(s.left + s.width, s.id).toBeLessThanOrEqual(layout.axisWidth + 0.001)
      })
    }

    it('puts the dated books in date order along the axis', () => {
      const layout = layoutBand(list, dates, 1296, nameWidth)
      const dated = layout.spines.filter((s) => !s.unknown)
      const xs = dated.map((s) => s.x)
      expect(xs).toEqual([...xs].sort((a, b) => a - b))
    })
  })
}

it('gives each row the thickness of a spine', () => {
  expect(rowOffset(1) - rowOffset(0)).toBeGreaterThan(SPINE_PX)
})
