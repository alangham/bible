// The timeline at #/timeline. docs/DESIGN.md section 7.8, docs/TASKS.md Task 17.
// - Wide layout: one line with a break. Each book name is a link above the line at its date. A book
//   with a range has a thin bar under its name. A book with one year has a dot on the line.
// - Narrow layout: a list in date order. The break is one row in the list.
// - An estimate: the name has weight 500, its bar is dashed, or its dot is open. In the narrow
//   layout, the date text ends with the word "estimate". For a screen reader, the name has the words
//   "estimated date".

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { groupOf, groupVar, type Book } from '../data/books.ts'
import { dateLabel, loadDates, yearsBetween, type BookDate } from '../data/dates.ts'
import { bookHref } from '../router.ts'
import type { ScreenLayout } from '../screenLayout.ts'
import { RefBar } from './RefBar.tsx'
import { OLD_TESTAMENT_BOOKS, ROW_PX, timelineLayout, type TimelineItem } from './timelineLayout.ts'

/**
 * The font of a book name. The CSS of `.tl-name` uses the same values, and the same list of families: docs/DESIGN.md section 16.10.
 * Weight 500 for an estimate.
 */
const NAME_FONT = (estimate: boolean) => `${estimate ? 500 : 800} 14px Inrond, system-ui, sans-serif`
/** The space below the line for the tick labels and the words of the break. */
const BELOW_PX = 52
/** The space above the highest row. */
const ABOVE_PX = 18

export function TimelinePage({ books, layout }: { books: Book[]; layout: ScreenLayout }) {
  const [dates, setDates] = useState<Map<string, BookDate> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    loadDates().then(
      (list) => setDates(new Map(list.map((d) => [d.id, d]))),
      (e: unknown) => setError(String(e)),
    )
  }, [])

  return (
    <div className="ref-page" data-page="timeline">
      <RefBar current="timeline" />
      <main className="ref-main">
        <h1>Timeline</h1>
        <p className="ref-lead">When each book was written, by the traditional view.</p>
        {error && <p role="alert">The dates did not load. {error}</p>}
        <div className="tl-body" data-ready={dates !== null}>
          {dates && (layout === 'wide' ? <TimelineLine books={books} dates={dates} /> : <TimelineList books={books} dates={dates} />)}
        </div>
        <div className="ref-foot">
          <p>A name in light letters has an estimated date.</p>
          <p>Scholars differ on many dates. "About this book" gives the detail.</p>
        </div>
      </main>
    </div>
  )
}

/** The name of a book link for a screen reader: the name, the date, and the words "estimated date" for an estimate. */
function linkName(book: Book, d: BookDate) {
  return `${book.name}, ${dateLabel(d)}${d.estimate ? ', estimated date' : ''}`
}

/** The words of the break. The number comes from the dates, by the rule of docs/DESIGN.md section 4.6. */
function breakWords(years: number) {
  return `About ${years} years or more with no books`
}

let canvas: CanvasRenderingContext2D | null | undefined

/** The width of a book name in capitals, in the font of the timeline. */
function nameWidth(book: Book, estimate: boolean): number {
  if (canvas === undefined) canvas = document.createElement('canvas').getContext('2d')
  const text = book.name.toUpperCase()
  if (!canvas) return text.length * 10
  canvas.font = NAME_FONT(estimate)
  return canvas.measureText(text).width
}

/** True when the fonts of the names are ready, so that the names have their true width. */
function useFontsReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let live = true
    Promise.all([document.fonts.load(NAME_FONT(false)), document.fonts.load(NAME_FONT(true))])
      .catch(() => undefined)
      .then(() => live && setReady(true))
    return () => {
      live = false
    }
  }, [])
  return ready
}

/** The wide layout: one line with a break. */
function TimelineLine({ books, dates }: { books: Book[]; dates: Map<string, BookDate> }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const ready = useFontsReady()

  useLayoutEffect(() => {
    const el = boxRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setWidth(el.clientWidth))
    observer.observe(el)
    setWidth(el.clientWidth)
    return () => observer.disconnect()
  }, [])

  const t = useMemo(
    () => (width && ready ? timelineLayout(books, dates, width, (b) => nameWidth(b, !!dates.get(b.id)!.estimate)) : null),
    [books, dates, width, ready],
  )

  const axis = t ? ABOVE_PX + t.rows * ROW_PX : 0
  const height = axis + BELOW_PX
  const nameY = (it: TimelineItem) => axis - 14 - it.row * ROW_PX
  const old = t ? t.items.filter((it) => books.indexOf(it.book) < OLD_TESTAMENT_BOOKS) : []
  const neu = t ? t.items.filter((it) => books.indexOf(it.book) >= OLD_TESTAMENT_BOOKS) : []

  const link = (it: TimelineItem) => {
    const y = nameY(it)
    return (
      <a
        key={it.book.id}
        className="tl-link"
        href={bookHref(it.book.id)}
        aria-label={linkName(it.book, it.date)}
        data-book={it.book.id}
        data-estimate={!!it.date.estimate}
      >
        <rect className="tl-hit" x={it.x - it.width / 2 - 4} y={y - 16} width={it.width + 8} height={24} rx={4} />
        <text className="tl-name" x={it.x} y={y} style={{ color: it.color }} fontWeight={it.date.estimate ? 500 : 800} textAnchor="middle">
          {it.book.name}
        </text>
      </a>
    )
  }

  return (
    <div className="tl-line" ref={boxRef}>
      {t && (
        <svg className="tl-svg" width={t.width} height={height} viewBox={`0 0 ${t.width} ${height}`} role="group" aria-label="The books in date order">
          <g aria-hidden="true">
            <line className="tl-axis" x1={0} x2={t.breakStart} y1={axis} y2={axis} />
            <line className="tl-axis" x1={t.breakEnd} x2={t.width} y1={axis} y2={axis} />
            <path
              className="tl-break"
              d={`M${t.breakStart} ${axis} l8 -7 l10 14 l10 -14 l10 14 l10 -14 l10 14 l12 -7`}
              data-years={t.between}
            />
            {t.ticks.map((k) => (
              <g key={k.label}>
                <line className="tl-tick" x1={k.x} x2={k.x} y1={axis} y2={axis + 6} />
                <text className="tl-tick-label" x={k.x} y={axis + 22} textAnchor="middle">
                  {k.label}
                </text>
              </g>
            ))}
            {t.items.map((it) => {
              const y = nameY(it)
              const est = !!it.date.estimate
              const style = { '--tl': it.color } as CSSProperties
              return (
                <g key={it.book.id} style={style} data-book={it.book.id}>
                  <line className="tl-stem" x1={(it.x1 + it.x2) / 2} x2={(it.x1 + it.x2) / 2} y1={y + 6} y2={axis} />
                  {it.x2 - it.x1 > 2 ? (
                    est ? (
                      <line className="tl-bar" data-estimate="true" x1={it.x1} x2={it.x2} y1={y + 4.5} y2={y + 4.5} />
                    ) : (
                      <rect className="tl-bar" data-estimate="false" x={it.x1} y={y + 3} width={it.x2 - it.x1} height={3} rx={1.5} />
                    )
                  ) : (
                    <circle className="tl-dot" data-estimate={est} cx={(it.x1 + it.x2) / 2} cy={axis} r={est ? 3.4 : 3} />
                  )}
                </g>
              )
            })}
          </g>
          {old.map(link)}
          <text className="tl-break-words" x={(t.breakStart + t.breakEnd) / 2} y={axis + 40} textAnchor="middle">
            {breakWords(t.between)}
          </text>
          {neu.map(link)}
        </svg>
      )}
    </div>
  )
}

/** The narrow layout: a list in date order. The break is one row. */
function TimelineList({ books, dates }: { books: Book[]; dates: Map<string, BookDate> }) {
  const parts = useMemo(() => {
    const order = (list: Book[], from: number) =>
      list
        .map((b, i) => ({ b, i: i + from, d: dates.get(b.id)! }))
        .sort((p, q) => (p.d.from + p.d.to) / 2 - (q.d.from + q.d.to) / 2 || p.i - q.i)
    const old = books.slice(0, OLD_TESTAMENT_BOOKS)
    const neu = books.slice(OLD_TESTAMENT_BOOKS)
    return {
      old: order(old, 0),
      neu: order(neu, OLD_TESTAMENT_BOOKS),
      between: yearsBetween(
        old.map((b) => dates.get(b.id)!),
        neu.map((b) => dates.get(b.id)!),
      ),
    }
  }, [books, dates])

  const rows = (list: { b: Book; d: BookDate }[], label: string) => (
    <ol className="tl-list" aria-label={label}>
      {list.map(({ b, d }) => (
        <li key={b.id}>
          <a className="tl-row" href={bookHref(b.id)} data-book={b.id} data-estimate={!!d.estimate}>
            <span className="tl-row-name" style={{ color: groupVar(groupOf(b)) }}>
              {b.name}
              {d.estimate && <span className="sr-only">, estimated date</span>}
            </span>
            <span className="tl-row-date">
              <span className="sr-only">, </span>
              {dateLabel(d)}
              {d.estimate && <span aria-hidden="true">, estimate</span>}
            </span>
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      {rows(parts.old, 'Old Testament books in date order')}
      <p className="tl-break-row">{breakWords(parts.between)}</p>
      {rows(parts.neu, 'New Testament books in date order')}
    </>
  )
}
