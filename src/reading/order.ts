// The order of the chapters across the whole Bible, for the continuous scroll.
// docs/DESIGN.md section 7.6, docs/TASKS.md Task 13 steps 9 and 11.

import type { Book } from '../data/books.ts'

export interface ChapterPlace {
  book: Book
  n: number
}

/** The chapter after this one: the next chapter of the book, or chapter 1 of the next book. Null after Revelation 22. */
export function nextChapter(books: Book[], place: ChapterPlace): ChapterPlace | null {
  if (place.n < place.book.chapters) return { book: place.book, n: place.n + 1 }
  const i = books.findIndex((b) => b.id === place.book.id)
  const next = i >= 0 ? books[i + 1] : undefined
  return next ? { book: next, n: 1 } : null
}

/** The chapter before this one: the chapter before in the book, or the last chapter of the book before. Null at Genesis 1. */
export function previousChapter(books: Book[], place: ChapterPlace): ChapterPlace | null {
  if (place.n > 1) return { book: place.book, n: place.n - 1 }
  const i = books.findIndex((b) => b.id === place.book.id)
  const previous = i > 0 ? books[i - 1] : undefined
  return previous ? { book: previous, n: previous.chapters } : null
}
