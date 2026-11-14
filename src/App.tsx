import { useEffect, useState, type ReactNode } from 'react'
import { BookPlaceholder } from './book/BookPlaceholder.tsx'
import { loadBooks, type Book } from './data/books.ts'
import { useRoute } from './router.ts'
import { useScreenLayout } from './screenLayout.ts'
import { TablePage } from './table/TablePage.tsx'

function App() {
  const route = useRoute()
  // The one layout decision. CSS selects on data-layout. docs/DESIGN.md section 4.1.
  const layout = useScreenLayout()
  const [books, setBooks] = useState<Book[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBooks().then(setBooks, (e: unknown) => setError(String(e)))
  }, [])

  let page: ReactNode
  if (error) {
    page = (
      <main className="message">
        <h1>Books of the Bible</h1>
        <p role="alert">The book list did not load. {error}</p>
      </main>
    )
  } else if (!books) {
    page = (
      <main className="message">
        <h1>Books of the Bible</h1>
      </main>
    )
  } else if (route.page === 'book') {
    page = <BookPlaceholder book={books.find((b) => b.id === route.id)} />
  } else {
    page = <TablePage books={books} />
  }

  return (
    <div className="app" data-layout={layout}>
      {page}
    </div>
  )
}

export default App
