// The reading page: the chapter text in one column, with the top bar. It replaces the book pages of
// the first build. docs/DESIGN.md sections 7.5, 7.6, and 7.7, docs/TASKS.md Tasks 13 and 14.
//
// - The page opens at a chapter, or at a verse. #/book/<id> opens the last-read chapter, or chapter 1.
// - The next chapter is added below when the reader comes near the end: a continuous scroll through
//   the books, to the end of Revelation.
// - The top bar and the address follow the chapter in view. The address is replaced: a scroll adds
//   no entry to the browser history.
// - The links: a control opens the pop-up. "Go there" is travel: a direct change to the linked
//   verse, which has a light background for a short time. The trail shows below the top bar.

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { BookNotFound } from '../book/BookNotFound.tsx'
import { LinkPopup } from '../book/LinkPopup.tsx'
import { plainClick } from '../book/links.ts'
import { canMoveBookName, moveBookName } from '../bookMove.ts'
import { groupOf, type Book } from '../data/books.ts'
import type { Intro } from '../data/intros.ts'
import type { ChapterRef, LinkEnd } from '../data/links.ts'
import type { LineReference } from '../data/xrefs.ts'
import { bookHref, chapterHref } from '../router.ts'
import { useMarginLabels, type ScreenLayout } from '../screenLayout.ts'
import { addTravel, useTrail, type Stop } from '../travel/trail.ts'
import { TrailBar } from '../travel/TrailBar.tsx'
import { setEchoLinks, useEchoLinks } from '../travel/travel.ts'
import { useReducedMotion } from '../useReducedMotion.ts'
import { ChapterSection } from './ChapterSection.tsx'
import { lastRead, setLastRead } from './lastRead.ts'
import { nextChapter, previousChapter, type ChapterPlace } from './order.ts'

/** The height of the top bar, in px. A chapter is in view when its top is above this line. */
const BAR_PX = 52
const IN_VIEW_PX = 130
/** The next chapter is added when the end of the text is this near the bottom of the screen, in px. */
const AHEAD_PX = 1600
/** How long the paragraph of the verse that the page opened at has its background, in ms. The value of the prototype. */
const HIT_MS = 3400

interface Start extends ChapterPlace {
  verse?: number
  /** A new number for each new start, so that the scroll starts again. */
  seq: number
}

interface ReadingPageProps {
  books: Book[]
  intros: Intro[] | null | undefined
  id: string
  chapter?: number
  verse?: number
  layout: ScreenLayout
}

/** Replaces the address with no new entry in the browser history. */
function replaceAddress(hash: string) {
  if (window.location.hash === hash) return
  try {
    window.history.replaceState(window.history.state, '', hash)
  } catch {
    // The address stays. The page still shows the chapter.
  }
}

export function ReadingPage({ books, intros, id, chapter, verse, layout }: ReadingPageProps) {
  const book = books.find((b) => b.id === id)
  const valid = !!book && (chapter === undefined || chapter <= book.chapters)
  /** The address that this page wrote last. A route with this address is not a new start. */
  const written = useRef<string | null>(null)
  const [start, setStart] = useState<Start | null>(null)
  const [current, setCurrent] = useState<ChapterPlace | null>(null)
  const [popup, setPopup] = useState<{ end: LinkEnd; anchor: HTMLElement; reference?: LineReference } | null>(null)
  const trail = useTrail()

  useLayoutEffect(() => {
    if (!book || !valid) return
    const here = chapter ? chapterHref(id, chapter, verse) : bookHref(id)
    if (here === written.current) return
    const n = chapter ?? lastRead(id, book.chapters) ?? 1
    const target = chapterHref(id, n, verse)
    if (!chapter) replaceAddress(target)
    written.current = target
    setStart((s) => ({ book, n, verse, seq: (s?.seq ?? 0) + 1 }))
    setCurrent({ book, n })
    setPopup(null)
  }, [book, valid, id, chapter, verse])

  // The chapter in view changed: the top bar, the address, and the last-read chapter follow it.
  const onCurrent = useCallback((place: ChapterPlace, first: boolean) => {
    setCurrent(place)
    setLastRead(place.book.id, place.n)
    if (!first) {
      const hash = chapterHref(place.book.id, place.n)
      written.current = hash
      replaceAddress(hash)
    }
  }, [])

  // Opens a chapter, at a verse if there is one. If the address is already that place, start again there.
  const open = useCallback(
    (to: Stop) => {
      const target = books.find((b) => b.id === to.book)
      if (!target) return
      const hash = chapterHref(to.book, to.c, to.v)
      setPopup(null)
      if (window.location.hash === hash) {
        written.current = hash
        setStart((s) => ({ book: target, n: to.c, verse: to.v, seq: (s?.seq ?? 0) + 1 }))
        setCurrent({ book: target, n: to.c })
      } else {
        window.location.hash = hash
      }
    },
    [books],
  )

  // Travel: the trail gets the two stops, and the linked passage opens with no move between the pages.
  const travel = useCallback(
    (from: Stop, to: Stop) => {
      addTravel(from, to)
      open(to)
    },
    [open],
  )
  const onGo = useCallback((end: LinkEnd) => travel({ book: end.here.book, c: end.here.c, v: end.here.v }, { book: end.there.book, c: end.there.c, v: end.there.v }), [travel])
  const onReadWith = useCallback((from: ChapterRef, to: ChapterRef) => travel({ book: from.book, c: from.c }, { book: to.book, c: to.c }), [travel])
  const onLink = useCallback(
    (end: LinkEnd, anchor: HTMLElement, reference?: LineReference) => setPopup((p) => (p?.anchor === anchor ? null : { end, anchor, reference })),
    [],
  )
  const closePopup = useCallback(() => setPopup(null), [])

  if (!book) return <BookNotFound />
  if (!valid) {
    return (
      <main className="message">
        <h1>Chapter not found</h1>
        <p>
          <a href={bookHref(book.id)}>Open {book.name}</a>
        </p>
      </main>
    )
  }

  const shown = current ?? (start ? { book: start.book, n: start.n } : null)
  return (
    <div className="reading" data-trail={trail.stops.length > 0} style={{ '--c': groupOf(shown?.book ?? book).color } as CSSProperties}>
      {shown && <TopBar books={books} place={shown} onOpenChapter={(p) => open({ book: p.book.id, c: p.n })} />}
      <TrailBar books={books} onGo={open} />
      {start && <ReadingScroll key={start.seq} books={books} intros={intros} start={start} onCurrent={onCurrent} onLink={onLink} onReadWith={onReadWith} />}
      {popup && <LinkPopup key={popup.anchor.dataset.link} books={books} end={popup.end} reference={popup.reference} anchor={popup.anchor} layout={layout} onGo={onGo} onClose={closePopup} />}
    </div>
  )
}

function TopBar({ place, onOpenChapter }: { books: Book[]; place: ChapterPlace; onOpenChapter: (p: ChapterPlace) => void }) {
  const [open, setOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const echoOn = useEchoLinks()
  const whereRef = useRef<HTMLButtonElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const { book, n } = place

  // When the grid opens, the focus goes to the current chapter. Escape closes the grid.
  useEffect(() => {
    if (!open) return
    gridRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        whereRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // "Books": the name of the book in view moves back to the wall.
  const onBooks = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!plainClick(e) || !canMoveBookName(reducedMotion)) return
    const name = [...document.querySelectorAll<HTMLElement>(`.rd-chapter[data-book="${book.id}"] .rd-name`)].find((el) => {
      const r = el.getBoundingClientRect()
      return r.bottom > BAR_PX && r.top < window.innerHeight
    })
    if (!name) return
    e.preventDefault()
    moveBookName(name, book.id, () => {
      window.location.hash = '#/'
    })
  }

  const gridId = 'chapter-grid'
  return (
    <>
      <header className="rd-bar">
        <a className="rd-books" href="#/" onClick={onBooks}>
          <span aria-hidden="true">‹ </span>Books
        </a>
        <button type="button" ref={whereRef} className="rd-where" aria-expanded={open} aria-controls={gridId} onClick={() => setOpen((o) => !o)}>
          <b>{book.name}</b> Chapter {n}{' '}
          <svg className="rd-caret" aria-hidden="true" viewBox="0 0 8 5" width="8" height="5">
            <path d="M0 0h8L4 5z" fill="currentColor" />
          </svg>
        </button>
        {/* The echo links switch. Its name is "Echo links"; the state is aria-pressed. */}
        <button type="button" className="rd-echo" aria-pressed={echoOn} onClick={() => setEchoLinks(!echoOn)}>
          Echo<span className="rd-echo-wide">{' '}links</span> <span aria-hidden="true">{echoOn ? 'on' : 'off'}</span>
        </button>
      </header>
      {open && <div className="rd-shade" onClick={() => setOpen(false)} />}
      <div className="rd-grid-panel" id={gridId} ref={gridRef} hidden={!open}>
        <nav aria-label={`Chapters of ${book.name}`}>
          <ol className="rd-grid">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => (
              <li key={c}>
                <a
                  href={chapterHref(book.id, c)}
                  aria-label={`${book.name} chapter ${c}`}
                  aria-current={c === n ? 'page' : undefined}
                  onClick={(e) => {
                    if (!plainClick(e)) return
                    e.preventDefault()
                    setOpen(false)
                    onOpenChapter({ book, n: c })
                  }}
                >
                  {c}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </>
  )
}

interface ReadingScrollProps {
  books: Book[]
  intros: Intro[] | null | undefined
  start: Start
  onCurrent: (place: ChapterPlace, first: boolean) => void
  onLink: (end: LinkEnd, control: HTMLElement, reference?: LineReference) => void
  onReadWith: (from: ChapterRef, to: ChapterRef) => void
}

function ReadingScroll({ books, intros, start, onCurrent, onLink, onReadWith }: ReadingScrollProps) {
  const [chapters, setChapters] = useState<ChapterPlace[]>(() => [{ book: start.book, n: start.n }])
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set())
  const echoOn = useEchoLinks()
  const marginLabels = useMarginLabels()
  const columnRef = useRef<HTMLElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const currentKey = useRef<string | null>(null)

  const onLoaded = useCallback((key: string) => {
    setLoaded((s) => (s.has(key) ? s : new Set(s).add(key)))
  }, [])

  const last = chapters[chapters.length - 1]
  const lastLoaded = loaded.has(`${last.book.id}-${last.n}`)
  const after = nextChapter(books, last)

  // Adds the next chapter when the end of the text comes near the screen.
  const pump = useCallback(() => {
    const end = endRef.current
    if (!end || !lastLoaded || !after) return
    if (end.getBoundingClientRect().top >= window.innerHeight + AHEAD_PX) return
    // The observer and the scroll can both ask in one frame: the chapter is added one time only.
    setChapters((cs) => (cs[cs.length - 1] === last ? [...cs, after] : cs))
  }, [lastLoaded, after, last])

  useEffect(() => {
    pump()
    const end = endRef.current
    if (!end || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) pump()
    }, { rootMargin: `0px 0px ${AHEAD_PX}px 0px` })
    observer.observe(end)
    return () => observer.disconnect()
  }, [pump])

  // The chapter in view: the last chapter whose top is above the line below the top bar.
  const track = useCallback(() => {
    const sections = columnRef.current?.querySelectorAll<HTMLElement>('section.rd-chapter')
    if (!sections?.length) return
    let hit = sections[0]
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= IN_VIEW_PX) hit = s
      else break
    }
    const key = `${hit.dataset.book}-${hit.dataset.chapter}`
    if (key === currentKey.current) return
    const first = currentKey.current === null
    currentKey.current = key
    const place = chapters.find((c) => `${c.book.id}-${c.n}` === key)
    if (place) onCurrent(place, first)
  }, [chapters, onCurrent])

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        track()
        pump()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    track()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [track, pump])

  // A new start shows the top of its chapter, or the paragraph of its verse below the bars, with a
  // light background for a short time. docs/DESIGN.md section 7.7.
  const startKey = `${start.book.id}-${start.n}`
  const startLoaded = loaded.has(startKey)
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  useEffect(() => {
    if (!start.verse || !startLoaded) return
    const section = columnRef.current?.querySelector(`section.rd-chapter[data-book="${start.book.id}"][data-chapter="${start.n}"]`)
    const number = section?.querySelector<HTMLElement>(`.chapter-body .vn[data-verse="${start.verse}"]`)
    if (!number) return
    const paragraph = number.closest<HTMLElement>('p, .omitted')
    let live = true
    const show = () => {
      if (!live) return
      const bars = Math.max(BAR_PX, document.querySelector('.rd-trail')?.getBoundingClientRect().bottom ?? 0)
      const numberTop = number.getBoundingClientRect().top + window.scrollY
      // The top of the paragraph, if the verse is in its first half screen. Otherwise the verse itself.
      let y = numberTop - bars - 90
      if (paragraph) {
        const paragraphTop = paragraph.getBoundingClientRect().top + window.scrollY
        if (numberTop - paragraphTop < window.innerHeight * 0.5) y = paragraphTop - bars - 28
      }
      window.scrollTo(0, Math.max(0, y))
    }
    show()
    // The fonts change the height of the text when they load: the place is measured again.
    document.fonts?.ready.then(show, () => undefined)
    paragraph?.classList.add('rd-hit')
    const t = window.setTimeout(() => paragraph?.classList.remove('rd-hit'), HIT_MS)
    return () => {
      live = false
      window.clearTimeout(t)
      paragraph?.classList.remove('rd-hit')
    }
  }, [start, startLoaded])

  const before = previousChapter(books, start)
  const ended = !after && lastLoaded
  return (
    <main className="rd-column" ref={columnRef}>
      <h1 className="sr-only">Bible text</h1>
      {before && (
        <a className="rd-previous" href={chapterHref(before.book.id, before.n)}>
          <span aria-hidden="true">‹ </span>
          <span className="sr-only">Chapter before: </span>
          {before.book.name} {before.n}
        </a>
      )}
      {chapters.map((c, i) => (
        <ChapterSection
          key={`${c.book.id}-${c.n}`}
          books={books}
          book={c.book}
          n={c.n}
          full={i === 0 || chapters[i - 1].book.id !== c.book.id}
          intro={intros === undefined || intros === null ? intros : (intros.find((x) => x.id === c.book.id) ?? null)}
          first={i === 0}
          echoOn={echoOn}
          marginLabels={marginLabels}
          onLoaded={onLoaded}
          onLink={onLink}
          onReadWith={onReadWith}
        />
      ))}
      {ended && <p className="rd-end">End of {last.book.name}</p>}
      <div ref={endRef} className="rd-sentinel" aria-hidden="true" />
    </main>
  )
}
