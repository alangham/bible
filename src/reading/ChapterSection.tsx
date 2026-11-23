// One chapter on the reading page: its heading, its links, and its text. docs/DESIGN.md sections 7.5
// and 7.7, docs/TASKS.md Task 13 steps 5, 6, 7, and 9, and Task 14.
// - The first chapter on the page, and the first chapter of each new book, have the full heading:
//   the band of the group, the book name in capitals, and the chapter number, with "About this book".
// - A later chapter of the same book has a smaller heading with no band.
// - The read-with list is one line below the heading.
// - From 1180 px wide, the links at verses are labels in the right margin, on the line of the verse.
// - From Task 47, a chapter with a Biblica note has the control "About this chapter": on the line of
//   "About this book" in the full heading, and alone on its line in a later chapter. docs/DESIGN.md section 19.6.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { arriveBookName } from '../bookMove.ts'
import { ChapterBody } from '../book/ChapterBody.tsx'
import { endKey, linkColor } from '../book/linkEnds.ts'
import { ReadWith } from '../book/ReadWith.tsx'
import { groupOf, groupVar, type Book } from '../data/books.ts'
import type { Intro } from '../data/intros.ts'
import { loadBookLinks, marksOf, type BookLinks, type ChapterRef, type LinkEnd } from '../data/links.ts'
import { loadBookNotes, notesOfChapter, type BookNotes } from '../data/notes.ts'
import type { LineReference } from '../data/xrefs.ts'
import { passageName } from '../data/passage.ts'
import { loadBookText, type BookText } from '../data/text.ts'
import { useTranslation, type Translation } from '../data/translation.ts'
import { bandLabel } from '../wall/layout.ts'
import { AboutBook } from './AboutBook.tsx'
import { useAboutChapter } from './AboutChapter.tsx'
import { headingWidthEm } from './heading.ts'

/** The height of a margin label and the space between two labels, in px. Values of the prototype. */
const LABEL_PX = 25
const LABEL_GAP_PX = 2

interface ChapterSectionProps {
  books: Book[]
  book: Book
  n: number
  full: boolean
  intro: Intro | null | undefined
  /** The first chapter on the page: the book name arrives here from the wall. */
  first: boolean
  echoOn: boolean
  marginLabels: boolean
  onLoaded: (key: string) => void
  /** The text on the page changed: the first text, or the text of a new translation. */
  onTextShown: () => void
  onLink: (end: LinkEnd, control: HTMLElement, reference?: LineReference) => void
  onReadWith: (from: ChapterRef, to: ChapterRef) => void
}

export function ChapterSection({ books, book, n, full, intro, first, echoOn, marginLabels, onLoaded, onTextShown, onLink, onReadWith }: ChapterSectionProps) {
  const translation = useTranslation()
  // The text on the page and its translation. When the reader selects a different translation, the
  // old text stays on the page until the new text loads, so the height of the page does not jump.
  const [shown, setShown] = useState<{ translation: Translation; text: BookText } | null>(null)
  const [error, setError] = useState<{ translation: Translation; message: string } | null>(null)
  const text = shown?.text ?? null
  const [links, setLinks] = useState<BookLinks | null>(null)
  /** True when the links loaded or did not load. Then the height of the chapter is final. */
  const [linksDone, setLinksDone] = useState(false)
  /** The Biblica notes of the book: undefined while the file loads, and null if it did not load. */
  const [bookNotes, setBookNotes] = useState<BookNotes | null | undefined>(undefined)
  const nameRef = useRef<HTMLSpanElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const key = `${book.id}-${n}`

  useEffect(() => {
    let live = true
    loadBookText(book.id, translation).then(
      (t) => {
        if (!live) return
        setShown({ translation, text: t })
        setError(null)
      },
      (e: unknown) => {
        if (!live) return
        setShown(null)
        setError({ translation, message: String(e) })
      },
    )
    return () => {
      live = false
    }
  }, [book.id, translation])

  useLayoutEffect(() => {
    if (shown || error) onTextShown()
  }, [shown, error, onTextShown])

  useEffect(() => {
    let live = true
    // Without the links, the text shows with no link controls.
    loadBookLinks(book.id)
      .then(
        (l) => live && setLinks(l),
        () => undefined,
      )
      .finally(() => live && setLinksDone(true))
    return () => {
      live = false
    }
  }, [book.id])

  useEffect(() => {
    let live = true
    // The notes file of the book. Without it, the control shows, and its panel says that the notes did not load.
    loadBookNotes(book.id).then(
      (notes) => live && setBookNotes(notes),
      () => live && setBookNotes(null),
    )
    return () => {
      live = false
    }
  }, [book.id])
  const notesDone = bookNotes !== undefined

  // The chapter is loaded when its text, its links, and its notes are on the page: the read-with line, the
  // marks, and the control "About this chapter" change the height of the chapter. docs/DESIGN.md section 19.6.
  useEffect(() => {
    if ((text && linksDone && notesDone) || error) onLoaded(key)
  }, [text, linksDone, notesDone, error, key, onLoaded])

  // The Biblica notes of this chapter: section 19.5. Null if the notes file did not load.
  const chapterNotes = useMemo(() => (bookNotes === null ? null : notesOfChapter(bookNotes?.notes ?? [], n)), [bookNotes, n])
  const hasNotes = chapterNotes === null || chapterNotes.length > 0
  const aboutChapter = useAboutChapter({ bookName: book.name, chapter: n, notes: chapterNotes })

  // The book name that moves from the wall lands in this heading.
  useLayoutEffect(() => {
    if (first) arriveBookName(book.id, nameRef.current)
  }, [first, book.id])

  const chapter = text?.chapters[n - 1]
  // The marks go with the text on the page: until the text of a new translation loads, the marks of the old one.
  const shownTranslation = shown?.translation ?? translation
  const marks = useMemo(() => (links ? marksOf(links, book.id, n, shownTranslation) : undefined), [links, book.id, n, shownTranslation])
  const readWith = links?.readWith[n] ?? []
  const style = { '--c': groupVar(groupOf(book)), '--heading-em': headingWidthEm(book.name, n) } as CSSProperties
  const headingId = `chapter-${key}`

  // The ends at verses, in verse order, for the labels in the margin.
  const labelEnds = useMemo(() => {
    if (!marginLabels || !marks) return []
    return [...marks.verses.entries()]
      .sort((x, y) => x[0] - y[0])
      .flatMap(([, ends]) => ends)
      .filter((e) => echoOn || e.link.type === 'quotation')
  }, [marginLabels, marks, echoOn])
  const labelTops = useLabelTops(sectionRef, labelEnds, chapter !== undefined)

  // The labels of one verse. They follow the verse number in the text, so the focus order is the
  // order of the text. CSS puts them in the right margin.
  const renderLabels = useCallback(
    (ends: LinkEnd[]) =>
      ends.map((end) => (
        <button
          key={endKey(end)}
          type="button"
          className="rd-label"
          data-kind={end.link.type}
          data-link={endKey(end)}
          style={{ '--d': linkColor(books, end), top: labelTops?.get(endKey(end)) ?? 0 } as CSSProperties}
          aria-haspopup="dialog"
          onClick={(e) => onLink(end, e.currentTarget)}
        >
          {/* The name is "Verse 20 has a quotation link to Exodus 24:8". It contains the visible text.
              A hidden span loses a space at its end, so the spaces there are no-break spaces. */}
          <span className="rd-label-verse">
            <span className="sr-only">Verse{' '}</span>
            {end.here.v}
          </span>
          <span className="sr-only">has {end.link.type === 'quotation' ? 'a quotation link' : 'an echo link'} to{' '}</span>
          <i aria-hidden="true" />
          <span className="rd-label-ref">{passageName(books, end.there)}</span>
        </button>
      )),
    [books, labelTops, onLink],
  )

  return (
    <section
      ref={sectionRef}
      className="rd-chapter"
      data-book={book.id}
      data-chapter={n}
      data-full={full}
      data-loaded={(chapter !== undefined && linksDone && notesDone) || error !== null}
      data-translation={shown?.translation ?? error?.translation}
      data-labels-ready={labelEnds.length > 0 ? labelTops !== null : undefined}
      style={style}
      aria-labelledby={headingId}
    >
      {full && <p className="rd-band">{bandLabel(book.group)}</p>}
      <h2 className="rd-heading" id={headingId}>
        <span className="rd-name" ref={nameRef}>
          {book.name}
        </span>{' '}
        <span className="rd-number">{n}</span>
      </h2>
      {(full || readWith.length > 0 || hasNotes) && (
        <div className="rd-meta" data-full={full}>
          {full && <AboutBook bookId={book.id} intro={intro} chapter={hasNotes ? aboutChapter : undefined} />}
          {!full && hasNotes && (
            // A later chapter of the book: the control alone on its line, below the heading. docs/DESIGN.md section 19.6.
            <div className="rd-about">
              <div className="rd-about-line">{aboutChapter.control}</div>
              {aboutChapter.panel}
            </div>
          )}
          <ReadWith books={books} list={readWith} onTravel={(to) => onReadWith({ book: book.id, c: n }, to)} />
        </div>
      )}
      {error && <p role="alert">The text did not load. {error.message}</p>}
      {chapter && <ChapterBody chapter={chapter} books={books} marks={marks} echoOn={echoOn} verseLabels={marginLabels ? renderLabels : undefined} onLink={onLink} />}
    </section>
  )
}

/**
 * The top of each margin label, in px from the top of the section: on the line of its verse number.
 * Where two labels meet, the lower label moves down. Measured again when the section changes size.
 */
function useLabelTops(sectionRef: RefObject<HTMLElement | null>, ends: LinkEnd[], ready: boolean): Map<string, number> | null {
  const [tops, setTops] = useState<Map<string, number> | null>(null)
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || !ready || !ends.length) return
    const measure = () => {
      const base = section.getBoundingClientRect().top
      const next = new Map<string, number>()
      let lastBottom = -Infinity
      for (const end of ends) {
        const number = section.querySelector(`.chapter-body .vn[data-verse="${end.here.v}"]`)
        if (!number) continue
        let top = number.getBoundingClientRect().top - base - 2
        if (top < lastBottom + LABEL_GAP_PX) top = lastBottom + LABEL_GAP_PX
        next.set(endKey(end), Math.round(top))
        lastBottom = top + LABEL_PX
      }
      setTops((old) => (old && old.size === next.size && [...next].every(([k, v]) => old.get(k) === v) ? old : next))
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(section)
    return () => observer.disconnect()
  }, [sectionRef, ends, ready])
  return tops
}
