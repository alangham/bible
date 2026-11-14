// Placeholder for the route `#/book/<id>/<chapter>`. Task 5 replaces it with the spread.

import type { Book } from '../data/books.ts'
import { bookHref } from '../router.ts'

export function SpreadPlaceholder({ book, chapter }: { book: Book | undefined; chapter: number }) {
  const valid = book && chapter <= book.chapters
  return (
    <main className="book-placeholder">
      <h1>{valid ? `${book.name} ${chapter}` : 'Chapter not found'}</h1>
      {valid && <p>The spread for this chapter is not built yet.</p>}
      <p>
        {book ? <a href={bookHref(book.id)}>Back to the cover</a> : <a href="#/">Back to the table</a>}
      </p>
    </main>
  )
}
