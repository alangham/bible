// One chapter on the reading page: its heading and its text. docs/DESIGN.md section 7.5,
// docs/TASKS.md Task 13 steps 5, 6, 7, and 9.
// - The first chapter on the page, and the first chapter of each new book, have the full heading:
//   the band of the group, the book name in capitals, and the chapter number, with "About this book".
// - A later chapter of the same book has a smaller heading with no band.

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { arriveBookName } from '../bookMove.ts'
import { ChapterBody } from '../book/ChapterBody.tsx'
import { groupOf, type Book } from '../data/books.ts'
import type { Intro } from '../data/intros.ts'
import { loadBookText, type BookText } from '../data/text.ts'
import { bandLabel } from '../wall/layout.ts'
import { AboutBook } from './AboutBook.tsx'
import { headingWidthEm } from './heading.ts'

interface ChapterSectionProps {
  book: Book
  n: number
  full: boolean
  intro: Intro | null | undefined
  /** The first chapter on the page: the book name arrives here from the wall. */
  first: boolean
  onLoaded: (key: string) => void
}

export function ChapterSection({ book, n, full, intro, first, onLoaded }: ChapterSectionProps) {
  const [text, setText] = useState<BookText | null>(null)
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const key = `${book.id}-${n}`

  useEffect(() => {
    let live = true
    loadBookText(book.id).then(
      (t) => live && setText(t),
      (e: unknown) => live && setError(String(e)),
    )
    return () => {
      live = false
    }
  }, [book.id])

  useEffect(() => {
    if (text || error) onLoaded(key)
  }, [text, error, key, onLoaded])

  // The book name that moves from the wall lands in this heading.
  useLayoutEffect(() => {
    if (first) arriveBookName(book.id, nameRef.current)
  }, [first, book.id])

  const chapter = text?.chapters[n - 1]
  const style = { '--c': groupOf(book).color, '--heading-em': headingWidthEm(book.name, n) } as CSSProperties
  const headingId = `chapter-${key}`

  return (
    <section className="rd-chapter" data-book={book.id} data-chapter={n} data-full={full} data-loaded={chapter !== undefined || error !== null} style={style} aria-labelledby={headingId}>
      {full && <p className="rd-band">{bandLabel(book.group)}</p>}
      <h2 className="rd-heading" id={headingId}>
        <span className="rd-name" ref={nameRef}>
          {book.name}
        </span>{' '}
        <span className="rd-number">{n}</span>
      </h2>
      {full && <AboutBook intro={intro} translation={text?.translation} />}
      {error && <p role="alert">The text did not load. {error}</p>}
      {chapter && <ChapterBody chapter={chapter} bookName={book.name} />}
    </section>
  )
}
