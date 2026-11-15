import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Book } from '../data/books.ts'
import { headingWidthEm } from './heading.ts'
import { lastRead, resetLastReadMemory, setLastRead } from './lastRead.ts'
import { nextChapter, previousChapter } from './order.ts'

const books = JSON.parse(readFileSync(new URL('../../public/data/books.json', import.meta.url), 'utf8')) as Book[]
const book = (id: string) => books.find((b) => b.id === id)!
const name = (p: { book: Book; n: number } | null) => (p ? `${p.book.id} ${p.n}` : null)

describe('the order of the chapters', () => {
  it('goes to the next chapter of the book, then to chapter 1 of the next book', () => {
    expect(name(nextChapter(books, { book: book('john'), n: 20 }))).toBe('john 21')
    expect(name(nextChapter(books, { book: book('john'), n: 21 }))).toBe('acts 1')
    expect(name(nextChapter(books, { book: book('malachi'), n: 4 }))).toBe('matthew 1')
  })

  it('ends after Revelation 22', () => {
    expect(nextChapter(books, { book: book('revelation'), n: 22 })).toBeNull()
  })

  it('goes back to the chapter before, or to the last chapter of the book before', () => {
    expect(name(previousChapter(books, { book: book('john'), n: 2 }))).toBe('john 1')
    expect(name(previousChapter(books, { book: book('john'), n: 1 }))).toBe('luke 24')
    expect(name(previousChapter(books, { book: book('exodus'), n: 1 }))).toBe('genesis 50')
  })

  it('has no chapter before Genesis 1', () => {
    expect(previousChapter(books, { book: book('genesis'), n: 1 })).toBeNull()
  })

  it('reaches each of the 1,189 chapters one time from Genesis 1', () => {
    let place: { book: Book; n: number } | null = { book: books[0], n: 1 }
    let count = 0
    while (place) {
      count++
      place = nextChapter(books, place)
    }
    expect(count).toBe(1189)
  })
})

describe('the last-read chapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetLastReadMemory()
  })

  function fakeStorage() {
    const data = new Map<string, string>()
    return {
      data,
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
    }
  }

  it('is null for a book that the reader did not read', () => {
    vi.stubGlobal('localStorage', fakeStorage())
    expect(lastRead('john', 21)).toBeNull()
  })

  it('is kept in the storage of the browser', () => {
    const storage = fakeStorage()
    vi.stubGlobal('localStorage', storage)
    setLastRead('john', 20)
    resetLastReadMemory()
    expect(lastRead('john', 21)).toBe(20)
    expect(JSON.parse(storage.data.get('bible-last-read')!)).toEqual({ john: 20 })
  })

  it('is not used when it is not a chapter of the book', () => {
    const storage = fakeStorage()
    storage.data.set('bible-last-read', JSON.stringify({ john: 40, ruth: 'x' }))
    vi.stubGlobal('localStorage', storage)
    expect(lastRead('john', 21)).toBeNull()
    expect(lastRead('ruth', 4)).toBeNull()
  })

  it('works in memory when the storage is not available', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('No storage')
      },
      setItem: () => {
        throw new Error('No storage')
      },
    })
    expect(lastRead('john', 21)).toBeNull()
    setLastRead('john', 5)
    expect(lastRead('john', 21)).toBe(5)
  })
})

describe('the width of a chapter heading', () => {
  it('is wider for a longer name and a longer number', () => {
    expect(headingWidthEm('1 Thessalonians', 5)).toBeGreaterThan(headingWidthEm('John', 5))
    expect(headingWidthEm('Psalms', 119)).toBeGreaterThan(headingWidthEm('Psalms', 1))
    expect(headingWidthEm('John', 1)).toBeCloseTo(4 * 0.8 + 0.24 + 0.62)
  })
})
