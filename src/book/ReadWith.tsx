// The read-with list at the top of a chapter: the chapters in other books that share the most
// cross-references with this chapter. Each entry starts travel. docs/DESIGN.md section 4.5.

import type { Book } from '../data/books.ts'
import type { ChapterRef } from '../data/links.ts'
import { passageName } from '../data/passage.ts'
import { chapterHref } from '../router.ts'
import { plainClick } from './links.ts'

interface ReadWithProps {
  books: Book[]
  list: ChapterRef[]
  onTravel: (to: ChapterRef) => void
  /** The id of the heading. The hidden copy of a page for the turn needs a different one. */
  titleId?: string
}

export function ReadWith({ books, list, onTravel, titleId = 'read-with-title' }: ReadWithProps) {
  if (!list.length) return null
  return (
    <nav className="read-with" aria-labelledby={titleId}>
      <h2 id={titleId}>Read with</h2>
      <ul>
        {list.map((r) => (
          <li key={`${r.book}:${r.c}`}>
            <a
              href={chapterHref(r.book, r.c)}
              onClick={(e) => {
                if (!plainClick(e)) return
                e.preventDefault()
                onTravel(r)
              }}
            >
              {passageName(books, r)}
            </a>
          </li>
        ))}
      </ul>
      <p className="read-with-source">From the cross-references of OpenBible.info.</p>
    </nav>
  )
}
