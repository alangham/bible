// The move of travel. docs/DESIGN.md section 4.5: "The current book closes, the linked book comes onto
// the table, and it opens at the linked passage. The move must show that the reader crossed the Bible."
//
// On the linen table: the current book, closed, goes into its place in a row of the 66 books. A light
// moves along the row to the linked book. The linked book comes out of the row onto the table and opens:
// the spread of the linked passage fades in. With reduced motion, the two names show and the pages cross-fade.

import gsap from 'gsap'
import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react'
import { groupOf, spineThickness, type Book } from '../data/books.ts'
import { passageName } from '../data/passage.ts'
import { chapterHref } from '../router.ts'
import { useReducedMotion } from '../useReducedMotion.ts'
import { endTravel, useTravel } from './travel.ts'

export function TravelOverlay({ books }: { books: Book[] }) {
  const travel = useTravel()
  const reducedMotion = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  const fromBook = travel ? books.find((b) => b.id === travel.from.book) : undefined
  const toBook = travel ? books.find((b) => b.id === travel.to.book) : undefined

  useLayoutEffect(() => {
    const el = root.current
    if (!travel || !el || !fromBook || !toBook) return
    const go = () => {
      window.location.hash = chapterHref(travel.to.book, travel.to.c, travel.to.v)
    }
    const tl = gsap.timeline({ onComplete: endTravel })
    timeline.current = tl
    if (reducedMotion) {
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 })
        .add(go, '+=0.5')
        .to(el, { opacity: 0, duration: 0.25 }, '+=0.05')
      return () => {
        tl.kill()
      }
    }
    const q = (s: string) => el.querySelector<HTMLElement>(s)!
    const book = q('.travel-book')
    const target = q('.travel-book-target')
    const light = q('.travel-light')
    const fromSpine = q(`.travel-spine[data-id="${fromBook.id}"]`)
    const toSpine = q(`.travel-spine[data-id="${toBook.id}"]`)
    const centerOf = (n: HTMLElement) => {
      const r = n.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }
    }
    const bookAt = centerOf(book)
    const fromAt = centerOf(fromSpine)
    const toAt = centerOf(toSpine)
    gsap.set(target, { x: toAt.x - bookAt.x, y: toAt.y - bookAt.y, scaleX: toAt.w / bookAt.w, scaleY: toAt.h / bookAt.h, opacity: 0 })
    // The light moves inside the row: its x is measured from the left edge of the row.
    const rowLeft = q('.travel-row').getBoundingClientRect().left
    gsap.set(light, { x: fromAt.x - rowLeft, opacity: 0 })
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25 })
      // The current book closes and goes into its place in the row.
      .fromTo(book, { rotateY: -70 }, { rotateY: 0, duration: 0.3, ease: 'power2.out' }, 0)
      .to(book, { x: fromAt.x - bookAt.x, y: fromAt.y - bookAt.y, scaleX: fromAt.w / bookAt.w, scaleY: fromAt.h / bookAt.h, duration: 0.45, ease: 'power2.in' }, 0.3)
      .to(book, { opacity: 0, duration: 0.1 }, 0.72)
      // A light crosses the row to the linked book.
      .to(light, { opacity: 1, duration: 0.1 }, 0.72)
      .to(light, { x: toAt.x - rowLeft, duration: 0.8, ease: 'power1.inOut' }, 0.75)
      .to(light, { opacity: 0, duration: 0.15 }, 1.55)
      // The linked book comes out onto the table and opens.
      .to(target, { opacity: 1, duration: 0.1 }, 1.5)
      .to(target, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.45, ease: 'power2.out' }, 1.5)
      .to(target, { rotateY: -70, duration: 0.3, ease: 'power2.in' }, 1.95)
      .add(go, 2.2)
      .to(el, { opacity: 0, duration: 0.3 }, 2.25)
    return () => {
      tl.kill()
    }
  }, [travel, fromBook, toBook, reducedMotion])

  // If the page closes during a travel, the travel ends.
  useEffect(
    () => () => {
      timeline.current?.kill()
    },
    [],
  )

  if (!travel || !fromBook || !toBook) return null
  const style = (b: Book) => ({ '--cloth': groupOf(b).cloth, '--cover-ink': groupOf(b).text }) as CSSProperties
  const label = `${passageName(books, travel.from)} to ${passageName(books, travel.to)}`
  return (
    <div className="travel" ref={root} data-reduced={reducedMotion}>
      <p className="travel-label" role="status">
        Travel: {label}
      </p>
      {!reducedMotion && (
        <>
          <div className="travel-stage">
            <div className="travel-book" style={style(fromBook)}>
              <span>{fromBook.name}</span>
            </div>
            <div className="travel-book travel-book-target" style={style(toBook)}>
              <span>{toBook.name}</span>
            </div>
          </div>
          <div className="travel-row" aria-hidden="true">
            {books.map((b) => (
              <span
                key={b.id}
                className="travel-spine"
                data-id={b.id}
                data-end={b.id === fromBook.id || b.id === toBook.id ? 'true' : undefined}
                style={{ background: groupOf(b).cloth, height: `${spineThickness(b.chapters) * 1.6}px` }}
              />
            ))}
            <span className="travel-light" />
          </div>
        </>
      )}
    </div>
  )
}
