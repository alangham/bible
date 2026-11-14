import { useEffect, useState, type ReactNode } from 'react'
import { BookNotFound } from './book/BookNotFound.tsx'
import { CoverPage } from './book/CoverPage.tsx'
import { SpreadPage } from './book/SpreadPage.tsx'
import { SourcesPage } from './SourcesPage.tsx'
import { loadBooks, type Book } from './data/books.ts'
import { loadIntros, type Intro } from './data/intros.ts'
import { useRoute } from './router.ts'
import { useScreenLayout } from './screenLayout.ts'
import { TablePage } from './table/TablePage.tsx'

function App() {
  const route = useRoute()
  // The one layout decision. CSS selects on data-layout. docs/DESIGN.md section 4.1.
  const layout = useScreenLayout()
  const [books, setBooks] = useState<Book[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Undefined while loading. Null if the file did not load: the cover shows a message.
  const [intros, setIntros] = useState<Intro[] | null | undefined>(undefined)

  useEffect(() => {
    loadBooks().then(setBooks, (e: unknown) => setError(String(e)))
    loadIntros().then(setIntros, () => setIntros(null))
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
    const book = books.find((b) => b.id === route.id)
    const intro = intros === undefined || intros === null ? intros : (intros.find((i) => i.id === route.id) ?? null)
    // The key gives each book a new cover page, so that the landing runs again.
    page = book ? <CoverPage key={book.id} book={book} intro={intro} /> : <BookNotFound />
  } else if (route.page === 'sources') {
    page = <SourcesPage />
  } else if (route.page === 'spread') {
    const book = books.find((b) => b.id === route.id)
    // The key keeps one spread page while the chapter changes, so that a page can turn.
    page = book ? <SpreadPage key={book.id} book={book} chapter={route.chapter} layout={layout} /> : <BookNotFound />
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
