import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Book } from './books.ts'
import type { Intro } from './intros.ts'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const books = JSON.parse(read('../../public/data/books.json')) as Book[]
const intros = JSON.parse(read('../../public/data/intros.json')) as Intro[]
const sources = read('../../docs/CONTENT-SOURCES.md')
const periods = JSON.parse(read('../../public/data/periods.json')) as {
  name: string
  names: string[]
  years: string | null
  from: number | null
  to: number | null
}[]

describe('intros.json', () => {
  it('has one introduction for each book, in Bible order', () => {
    expect(intros.map((i) => i.id)).toEqual(books.map((b) => b.id))
  })

  it('gives each book the three facts of docs/DESIGN.md section 4.2', () => {
    for (const intro of intros) {
      for (const field of ['author', 'written', 'whatItIs'] as const) {
        expect(intro[field].trim(), `${intro.id}.${field}`).not.toBe('')
      }
    }
  })

  it('has a review value of draft or approved', () => {
    for (const intro of intros) expect(['draft', 'approved']).toContain(intro.review)
  })

  it('keeps each fact short: two sentences and 35 words at most', () => {
    for (const intro of intros) {
      for (const field of ['author', 'written', 'whatItIs'] as const) {
        const text = intro[field]
        expect(text.split(/(?<=[.?!])\s+/).length, `${intro.id}.${field}`).toBeLessThanOrEqual(2)
        expect(text.split(/\s+/).length, `${intro.id}.${field}`).toBeLessThanOrEqual(35)
      }
    }
  })

  it('keeps the cover facts to the traditional view: no fact names scholars (docs/DESIGN.md 4.2, layer 1)', () => {
    for (const intro of intros) {
      expect(intro.author, `${intro.id}.author`).not.toMatch(/scholar/i)
      expect(intro.written, `${intro.id}.written`).not.toMatch(/scholar/i)
    }
  })

  it('gives each detail a critical part, and no empty part (layer 2)', () => {
    for (const intro of intros) {
      for (const field of ['authorDetail', 'writtenDetail'] as const) {
        const detail = intro[field]
        if (!detail) continue
        expect(detail.critical.trim(), `${intro.id}.${field}.critical`).not.toBe('')
        if (detail.conservative !== undefined) {
          expect(detail.conservative.trim(), `${intro.id}.${field}.conservative`).not.toBe('')
        }
      }
    }
  })

  it('gives each named period the years of public/data/periods.json (Task 4c rule 1)', () => {
    const texts = intros.flatMap((i) =>
      [i.author, i.written, i.whatItIs, i.authorDetail?.critical, i.authorDetail?.conservative, i.writtenDetail?.critical, i.writtenDetail?.conservative]
        .filter((t): t is string => Boolean(t))
        .map((t) => [i.id, t] as const),
    )
    for (const [id, text] of texts) {
      for (const sentence of text.split(/(?<=[.?!])\s+/)) {
        for (const period of periods) {
          if (!period.years) continue
          if (period.names.some((name) => sentence.includes(name))) {
            expect(sentence, `${id}: ${period.name}`).toContain(period.years)
          }
        }
      }
    }
  })

  it('keeps the from and to years of each period equal to its years text', () => {
    const bc = (n: number) => `${-n}`
    for (const period of periods) {
      if (period.from !== null && period.to !== null) {
        expect(period.years, period.name).toBe(`${bc(period.from)} to ${bc(period.to)} BC`)
      } else if (period.from !== null) {
        expect(period.years, period.name).toBe(`from ${bc(period.from)} BC`)
      } else if (period.to !== null) {
        expect(period.years, period.name).toBe(`before about ${bc(period.to)} BC`)
      }
    }
  })

  it('has a section for each book in docs/CONTENT-SOURCES.md', () => {
    for (const book of books) expect(sources, book.id).toContain(`### ${book.name} (\`${book.id}\`)`)
  })
})
