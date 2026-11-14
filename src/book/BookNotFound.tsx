// The page for a book id that is not in books.json.

export function BookNotFound() {
  return (
    <main className="book-placeholder">
      <h1>Book not found</h1>
      <p>
        <a href="#/">Back to the table</a>
      </p>
    </main>
  )
}
