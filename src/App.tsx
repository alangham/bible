import { useEffect, useState, type ReactNode } from 'react'
import { BookNotFound } from './book/BookNotFound.tsx'
import { CoverPage } from './book/CoverPage.tsx'
import { SpreadPage } from './book/SpreadPage.tsx'
import { SourcesPage } from './SourcesPage.tsx'
import { TrailBar } from './travel/TrailBar.tsx'
import { TravelOverlay } from './travel/TravelOverlay.tsx'
import { useTrail } from './travel/trail.ts'
import { useTravel } from './travel/travel.ts'
import { loadBooks, type Book } from './data/books.ts'
import { loadIntros, type Intro } from './data/intros.ts'
import { useRoute } from './router.ts'
import { useScreenLayout } from './screenLayout.ts'
import { TablePage } from './table/TablePage.tsx'

function App() {
  const route = useRoute()
  const trail = useTrail()
  const travel = useTravel()
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
    page = book ? <SpreadPage key={book.id} book={book} chapter={route.chapter} verse={route.verse} layout={layout} books={books} /> : <BookNotFound />
  } else {
    page = <TablePage books={books} />
  }

  return (
    <div className="app" data-layout={layout} data-trail={trail.stops.length > 0}>
      {/* During the move of travel, the page behind it takes no focus and no input. */}
      <div className="app-page" inert={travel !== null}>
        {page}
      </div>
      {/* The trail and the move of travel, on each page. docs/DESIGN.md section 4.5. */}
      {books && <TrailBar books={books} />}
      {books && <TravelOverlay books={books} />}
    </div>
  )
}

export default App
