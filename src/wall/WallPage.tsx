// The wall: the first page. The 66 book names in the colors of their groups. A book name is the
// only control for a book. docs/DESIGN.md section 7.4, docs/TASKS.md Task 12.

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type RefObject } from 'react'
import { plainClick } from '../book/links.ts'
import { arriveBookName, canMoveBookName, moveBookName, movingBookId } from '../bookMove.ts'
import { groupOf, type Book } from '../data/books.ts'
import { bookHref, quotationsHref, sourcesHref, timelineHref } from '../router.ts'
import type { ScreenLayout } from '../screenLayout.ts'
import { useReducedMotion } from '../useReducedMotion.ts'
import { fitName, measureNames, NAME_FONT, type NameFit } from './fit.ts'
import { balancedSplit, bandLabel, groupBlocks, narrowSizes, NARROW_GAP_PX, NARROW_PAD_PX, wideColumns, wideSizes } from './layout.ts'

const CAPITALS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789'

/** The width of the page, in CSS px, without a scroll bar. */
function useScreenWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(() => (typeof document === 'undefined' ? 0 : document.documentElement.clientWidth))
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return width
}

/** The widths of the names in Inter ExtraBold, measured after the font loads. Null until then. */
function useNameWidths(books: Book[]): Map<string, number> | null {
  const [widths, setWidths] = useState<Map<string, number> | null>(null)
  useEffect(() => {
    let live = true
    const names = books.map((b) => b.name)
    const measure = () => {
      if (live) setWidths(measureNames(names))
    }
    const fonts = typeof document === 'undefined' ? undefined : document.fonts
    if (!fonts) {
      measure()
    } else {
      // If the font does not load, the names are measured in the fallback font.
      fonts.load(NAME_FONT, CAPITALS).then(measure, measure)
    }
    return () => {
      live = false
    }
  }, [books])
  return widths
}

function BookName({ book, fit }: { book: Book; fit: NameFit | null }) {
  const style: CSSProperties = { color: groupOf(book).color }
  if (fit) {
    style.fontSize = `${fit.fontSize.toFixed(2)}px`
    style.letterSpacing = `${fit.letterSpacing.toFixed(2)}px`
    style.lineHeight = `${fit.lineHeight.toFixed(2)}px`
  }
  return (
    <a className="wall-name" href={bookHref(book.id)} style={style} data-book={book.id}>
      {book.name}
    </a>
  )
}

function Band({ book }: { book: Book }) {
  return (
    <h2 className="wall-band" style={{ background: groupOf(book).color }}>
      {bandLabel(book.group)}
    </h2>
  )
}

export function WallPage({ books, layout }: { books: Book[]; layout: ScreenLayout }) {
  const ref = useRef<HTMLElement>(null)
  const screenWidth = useScreenWidth(ref)
  const widths = useNameWidths(books)
  const reducedMotion = useReducedMotion()
  const ready = widths !== null && screenWidth > 0
  const fitFor = (book: Book, columnWidth: number) => {
    const w = widths?.get(book.name)
    return w === undefined ? null : fitName(w, book.name.length, columnWidth)
  }

  let content
  if (layout === 'wide') {
    const s = wideSizes(screenWidth)
    // A band starts each group. A group that goes on in the next column has no second band.
    const bandBefore = new Set(books.filter((b, i) => i === 0 || books[i - 1].group !== b.group).map((b) => b.id))
    content = (
      <div className="wall-inner" style={{ width: s.inner + s.pad * 2, padding: `24px ${s.pad}px 20px` }}>
        <nav className="wall-columns" aria-label="Books" style={{ gap: s.gap }}>
          {wideColumns(books).map((column) => (
            <div className="wall-column" key={column[0].id} style={{ width: s.column }}>
              {column.map((book) => [
                bandBefore.has(book.id) && <Band key={`band-${book.id}`} book={book} />,
                <BookName key={book.id} book={book} fit={fitFor(book, s.column)} />,
              ])}
            </div>
          ))}
        </nav>
        <WallFoot />
      </div>
    )
  } else {
    const s = narrowSizes(screenWidth)
    content = (
      <div className="wall-inner" style={{ width: s.wall, padding: `28px ${NARROW_PAD_PX}px 48px` }}>
        <nav aria-label="Books">
          {groupBlocks(books).map((block) => {
            // A group with one book fills the full width. Task 12 step 7.
            if (block.books.length === 1) {
              const book = block.books[0]
              return (
                <section className="wall-block" key={block.group}>
                  <Band book={book} />
                  <BookName book={book} fit={fitFor(book, s.full)} />
                </section>
              )
            }
            const fits = block.books.map((b) => fitFor(b, s.column))
            const split = balancedSplit(fits.map((f) => f?.lineHeight ?? 0))
            const parts = [block.books.slice(0, split), block.books.slice(split)]
            return (
              <section className="wall-block" key={block.group}>
                <Band book={block.books[0]} />
                <div className="wall-pair" style={{ gap: NARROW_GAP_PX }}>
                  {parts.map((part, p) => (
                    <div className="wall-column" key={p} style={{ width: s.column }}>
                      {part.map((book) => (
                        <BookName key={book.id} book={book} fit={fits[block.books.indexOf(book)]} />
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </nav>
        <WallFoot />
      </div>
    )
  }

  // The wall opens at the top.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // "Books" on the reading page: the book name moves back to its place on the wall.
  useLayoutEffect(() => {
    const id = movingBookId()
    if (!ready || !id) return
    const name = ref.current?.querySelector<HTMLElement>(`.wall-name[data-book="${id}"]`) ?? null
    name?.scrollIntoView({ block: 'nearest' })
    arriveBookName(id, name)
  }, [ready])

  // A book name opens the reading page. The name moves into the heading of the chapter.
  const onClick = (e: MouseEvent<HTMLElement>) => {
    const name = (e.target as Element).closest<HTMLAnchorElement>('a.wall-name')
    const id = name?.dataset.book
    if (!name || !id || !plainClick(e) || !canMoveBookName(reducedMotion)) return
    e.preventDefault()
    moveBookName(name, id, () => {
      window.location.hash = bookHref(id)
    })
  }

  return (
    // The click handler only adds the move to the links. The links work with no script also.
    <main ref={ref} className="wall" data-layout={layout} data-ready={ready} onClick={onClick}>
      {/* The wall has no visible title. A screen reader gets this heading. */}
      <h1 className="sr-only">Books of the Bible</h1>
      {content}
    </main>
  )
}

/** The bottom line: the translation, and the links to the pages of the Reference section. docs/DESIGN.md section 7.8. */
function WallFoot() {
  return (
    <footer className="wall-foot">
      <span className="wall-translation">Berean Standard Bible</span>
      <nav className="wall-reference" aria-label="Reference">
        <a href={timelineHref()}>Timeline</a>
        <a href={quotationsHref()}>Quotations</a>
        <a href={sourcesHref()}>Sources</a>
      </nav>
    </footer>
  )
}
