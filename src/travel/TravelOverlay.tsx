// The move of travel. docs/DESIGN.md section 4.5. Task 13 removed the table and GSAP, so the move is
// now the fade that the built site used with reduced motion: the two names show, the linked passage
// opens behind them, and they fade out. No page starts travel in Task 13. Task 14 builds the move of
// the redesign, in docs/DESIGN.md section 7.6.

import { useEffect, useLayoutEffect, useRef } from 'react'
import type { Book } from '../data/books.ts'
import { passageName } from '../data/passage.ts'
import { chapterHref } from '../router.ts'
import { endTravel, useTravel } from './travel.ts'

/** The times of the fade, in ms: in, the wait before the new passage opens, and out. */
const FADE_IN_MS = 200
const WAIT_MS = 500
const FADE_OUT_MS = 250

export function TravelOverlay({ books }: { books: Book[] }) {
  const travel = useTravel()
  const root = useRef<HTMLDivElement>(null)
  const stop = useRef<(() => void) | null>(null)

  const fromBook = travel ? books.find((b) => b.id === travel.from.book) : undefined
  const toBook = travel ? books.find((b) => b.id === travel.to.book) : undefined

  useLayoutEffect(() => {
    const el = root.current
    if (!travel || !el || !fromBook || !toBook) return
    let live = true
    const fadeIn = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_IN_MS, fill: 'forwards' })
    let fadeOut: Animation | null = null
    const timer = window.setTimeout(() => {
      window.location.hash = chapterHref(travel.to.book, travel.to.c, travel.to.v)
      fadeOut = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE_OUT_MS, delay: 50, fill: 'forwards' })
      fadeOut.finished.then(
        () => live && endTravel(),
        () => undefined,
      )
    }, FADE_IN_MS + WAIT_MS)
    const cancel = () => {
      live = false
      window.clearTimeout(timer)
      fadeIn.cancel()
      fadeOut?.cancel()
    }
    stop.current = cancel
    return cancel
  }, [travel, fromBook, toBook])

  // If the page closes during a travel, the travel ends.
  useEffect(
    () => () => {
      stop.current?.()
    },
    [],
  )

  if (!travel || !fromBook || !toBook) return null
  const label = `${passageName(books, travel.from)} to ${passageName(books, travel.to)}`
  return (
    <div className="travel" ref={root}>
      <p className="travel-label" role="status">
        Travel: {label}
      </p>
    </div>
  )
}
