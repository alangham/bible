// The trail: always on screen after the first travel. Each stop is a control that goes back to that stop
// in one step. docs/DESIGN.md section 4.5.

import type { Book } from '../data/books.ts'
import { passageName } from '../data/passage.ts'
import { plainClick } from '../book/links.ts'
import { chapterHref, useRoute } from '../router.ts'
import { goToStop, useTrail } from './trail.ts'

export function TrailBar({ books }: { books: Book[] }) {
  const trail = useTrail()
  const route = useRoute()
  if (!trail.stops.length) return null
  // The stop of the page that shows, also after the back button: the last stop with the same chapter.
  const here = route.page === 'chapter' ? trail.stops.findLastIndex((s) => s.book === route.id && s.c === route.chapter) : -1
  return (
    <nav className="trail" aria-label="Trail">
      <span className="trail-title">Trail</span>
      <ol>
        {trail.stops.map((s, i) => (
          <li key={i}>
            <a
              href={chapterHref(s.book, s.c, s.v)}
              aria-current={i === here ? 'location' : undefined}
              onClick={(e) => {
                if (plainClick(e)) goToStop(i)
              }}
            >
              {passageName(books, s)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
