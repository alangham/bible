import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Book } from './books.ts'
import type { Intro } from './intros.ts'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const books = JSON.parse(read('../../public/data/books.json')) as Book[]
const intros = JSON.parse(read('../../public/data/intros.json')) as Intro[]
const sources = read('../../docs/CONTENT-SOURCES.md')

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

  it('has a section for each book in docs/CONTENT-SOURCES.md', () => {
    for (const book of books) expect(sources, book.id).toContain(`### ${book.name} (\`${book.id}\`)`)
  })
})
