import { useEffect, useState, type ReactNode } from 'react'
import { SourcesPage } from './SourcesPage.tsx'
import { loadBooks, type Book } from './data/books.ts'
import { loadIntros, type Intro } from './data/intros.ts'
import { SITE_NAME, usePageTitle } from './pageTitle.ts'
import { ReadingPage } from './reading/ReadingPage.tsx'
import { QuotationsPage } from './reference/QuotationsPage.tsx'
import { useRoute } from './router.ts'
import { useScreenLayout } from './screenLayout.ts'
import { TimelinePage } from './reference/TimelinePage.tsx'
import { WallPage } from './wall/WallPage.tsx'

function App() {
  const route = useRoute()
  // The one layout decision. CSS selects on data-layout. docs/DESIGN.md sections 4.1 and 7.4.
  const layout = useScreenLayout()
  const [books, setBooks] = useState<Book[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Undefined while loading. Null if the file did not load: the reading page shows a message.
  const [intros, setIntros] = useState<Intro[] | null | undefined>(undefined)

  // The title of the browser tab, docs/DESIGN.md section 12.2. The reading page sets its own title from the
  // chapter of its top bar. Each other page has the name of its Reference page, or no place. While the book
  // list loads, or when it did not load, the page shows a message, and the title is the name only.
  const reading = route.page === 'book' || route.page === 'chapter'
  const refPlace = { sources: 'Sources', timeline: 'Timeline', quotations: 'Quotations' } as Record<string, string | undefined>
  usePageTitle(error || !books ? undefined : reading ? null : refPlace[route.page])

  useEffect(() => {
    loadBooks().then(setBooks, (e: unknown) => setError(String(e)))
    loadIntros().then(setIntros, () => setIntros(null))
  }, [])

  let page: ReactNode
  if (error) {
    page = (
      <main className="message">
        <h1>{SITE_NAME}</h1>
        <p role="alert">The book list did not load. {error}</p>
      </main>
    )
  } else if (!books) {
    page = (
      <main className="message">
        <h1>{SITE_NAME}</h1>
      </main>
    )
  } else if (route.page === 'book' || route.page === 'chapter') {
    // One reading page for both addresses, with no key: a change of the address that the page
    // wrote itself, during a scroll, does not start the page again.
    const chapter = route.page === 'chapter' ? route.chapter : undefined
    const verse = route.page === 'chapter' ? route.verse : undefined
    page = <ReadingPage books={books} intros={intros} id={route.id} chapter={chapter} verse={verse} layout={layout} />
  } else if (route.page === 'sources') {
    page = <SourcesPage />
  } else if (route.page === 'quotations') {
    page = <QuotationsPage books={books} layout={layout} />
  } else if (route.page === 'timeline') {
    page = <TimelinePage books={books} layout={layout} />
  } else {
    page = <WallPage books={books} layout={layout} />
  }

  return (
    <div className="app" data-layout={layout}>
      {page}
    </div>
  )
}

export default App
