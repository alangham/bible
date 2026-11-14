// Placeholder for the route `#/book/<id>`. Task 4 replaces it with the cover page.

import type { Book } from '../data/books.ts'

export function BookPlaceholder({ book }: { book: Book | undefined }) {
  return (
    <main className="book-placeholder">
      <h1>{book ? book.name : 'Book not found'}</h1>
      {book && <p>The cover page for this book is not built yet.</p>}
      <p>
        <a href="#/">Back to the table</a>
      </p>
    </main>
  )
}
