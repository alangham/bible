// The trail: a thin line below the top bar after the first travel. docs/DESIGN.md section 7.7.
// Each stop is a control in the color of its group. The last stop is the current stop, and it has an
// underline. When the trail has two stops or more, it starts with "Back", which opens the stop before
// the last stop. A selected stop, and "Back", remove the stops after the stop that opens.

import type { MouseEvent } from 'react'
import { plainClick } from '../book/links.ts'
import { groupOf, type Book } from '../data/books.ts'
import { passageName } from '../data/passage.ts'
import { chapterHref } from '../router.ts'
import { goToStop, useTrail, type Stop } from './trail.ts'

interface TrailBarProps {
  books: Book[]
  /** Opens a stop. The reading page shows its chapter at its verse. */
  onGo: (stop: Stop) => void
}

export function TrailBar({ books, onGo }: TrailBarProps) {
  const trail = useTrail()
  if (!trail.stops.length) return null
  const color = (s: Stop) => {
    const book = books.find((b) => b.id === s.book)
    return book ? groupOf(book).color : undefined
  }
  const open = (i: number) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!plainClick(e)) return
    e.preventDefault()
    goToStop(i)
    onGo(trail.stops[i])
  }
  const last = trail.stops.length - 1
  const before = last > 0 ? trail.stops[last - 1] : null
  return (
    <nav className="rd-trail" aria-label="Trail">
      {before ? (
        <>
          <a className="rd-trail-back" href={chapterHref(before.book, before.c, before.v)} onClick={open(last - 1)}>
            <span aria-hidden="true">‹ </span>Back<span className="sr-only"> to {passageName(books, before)}</span>
          </a>
          <span className="rd-trail-rule" aria-hidden="true" />
        </>
      ) : (
        <span className="rd-trail-title">Trail</span>
      )}
      <ol>
        {trail.stops.map((s, i) => (
          <li key={i}>
            {i > 0 && (
              <span className="rd-trail-step" aria-hidden="true">
                ›
              </span>
            )}
            <a
              href={chapterHref(s.book, s.c, s.v)}
              style={{ color: color(s) }}
              aria-current={i === last ? 'location' : undefined}
              onClick={open(i)}
            >
              {passageName(books, s)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
