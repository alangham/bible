// The timeline: the overview page. docs/DESIGN.md section 4.6, docs/TASKS.md Task 8.
//
// Two bands, one above the other: the Old Testament and the New Testament. Each band has its own
// axis. Each book is a spine at the date of its Written fact. Arcs join two books that have one
// quotation link or more. Select a book: its arcs stay, the other arcs dim, and a list names the
// books that it quotes and the books that quote it. A second action opens its cover.
//
// The arcs are drawn in SVG and are hidden from screen readers. The list of the selected book is
// their text form. Each spine is a real `button`.

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { groupOf, type Book, type GroupName } from '../data/books.ts'
import { arcStep, dateLabel, loadDates, loadQuotationPairs, standPoint, yearsBetween, type BookDate, type QuotationPair } from '../data/dates.ts'
import type { Intro } from '../data/intros.ts'
import { bookHref, sourcesHref } from '../router.ts'
import type { ScreenLayout } from '../screenLayout.ts'
import { Legend } from '../table/Legend.tsx'
import { useReducedMotion } from '../useReducedMotion.ts'
import { bandHeight, layoutBand, rowOffset, ROW_GAP_PX, SPINE_PX, type BandLayout } from './layout.ts'

/** The number of books of the Old Testament. Band 1 has these books. Band 2 has the rest. */
const OLD_TESTAMENT_BOOKS = 39
/** The font of the names on the spines. The CSS of `.tl-spine` uses the same values. */
const SPINE_FONT = '700 14px "Cormorant Garamond", Georgia, serif'
const SPINE_LETTER_SPACING_PX = 1.5
/** The space above band 1 for its heading, and below band 2 for its heading. */
const HEADING_PX = 44
/** The space between the two axes, where the arcs are. */
const MIDDLE_PX = 210
/** The stroke width of each step of arc thickness. */
const ARC_WIDTH = { 1: 1.25, 2: 2.75, 3: 5 } as const

interface TimelinePageProps {
  books: Book[]
  /** Undefined while loading. Null if the file did not load. */
  intros: Intro[] | null | undefined
  layout: ScreenLayout
}

interface Data {
  dates: Map<string, BookDate>
  pairs: QuotationPair[]
}

export function TimelinePage({ books, intros, layout }: TimelinePageProps) {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [picked, setPicked] = useState<GroupName | null>(null)

  useEffect(() => {
    Promise.all([loadDates(), loadQuotationPairs()]).then(
      ([dates, pairs]) => setData({ dates: new Map(dates.map((d) => [d.id, d])), pairs }),
      (e: unknown) => setError(String(e)),
    )
  }, [])

  const differ = useMemo(() => new Set((intros ?? []).filter((i) => i.writtenDetail).map((i) => i.id)), [intros])

  // The first action selects a book. A second action on the selected book opens its cover.
  const activate = (id: string) => {
    if (selected === id) window.location.hash = bookHref(id)
    else setSelected(id)
  }

  // The live region stays on the page, so that a screen reader reads each change of the selection.
  let announcement = ''
  if (data && selected) {
    const book = books.find((b) => b.id === selected)!
    const quotes = data.pairs.filter((p) => p.from === selected).length
    const quotedBy = data.pairs.filter((p) => p.to === selected).length
    const count = (n: number) => (n === 1 ? '1 book' : `${n} books`)
    announcement = `${book.name} is selected. It quotes ${count(quotes)}. ${count(quotedBy)} quote it. Select it again to open its cover.`
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && selected) setSelected(null)
  }

  return (
    <main className="timeline-page" onKeyDown={onKeyDown}>
      <header className="timeline-header">
        <nav className="timeline-bar" aria-label="Pages">
          <a href="#/">Back to the table</a>
          <a href={sourcesHref()}>Sources</a>
        </nav>
        <h1>Timeline</h1>
        <p>
          When each book was written, by the traditional view. Arcs join two books with quotation links. A thicker arc has more links. Select a
          book to see the books that it quotes. Select it again to open it.
        </p>
      </header>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {error && <p role="alert">The dates did not load. {error}</p>}

      {data &&
        (layout === 'wide' ? (
          <Bands books={books} data={data} differ={differ} selected={selected} picked={picked} onActivate={activate} />
        ) : (
          <DateList books={books} data={data} differ={differ} selected={selected} picked={picked} onActivate={activate} />
        ))}

      {data && layout === 'wide' && selected && <QuotedList book={books.find((b) => b.id === selected)!} books={books} data={data} differ={differ} level={2} />}

      <Legend picked={picked} onPick={setPicked} />
      <p className="timeline-key">
        <span className="tl-ring" aria-hidden="true" /> A ring on a book: scholars differ on the date. The cover of the book gives the detail.
      </p>
    </main>
  )
}

interface ViewProps {
  books: Book[]
  data: Data
  differ: Set<string>
  selected: string | null
  picked: GroupName | null
  onActivate: (id: string) => void
}

let canvas: CanvasRenderingContext2D | null | undefined

/** The width of a name on a spine, in the spine font. */
function nameWidth(name: string): number {
  if (canvas === undefined) canvas = document.createElement('canvas').getContext('2d')
  const text = name.toUpperCase()
  if (!canvas) return text.length * 11
  canvas.font = SPINE_FONT
  return canvas.measureText(text).width + text.length * SPINE_LETTER_SPACING_PX
}

/** True when the spine font is ready, so that the names have their true width. */
function useFontReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let live = true
    document.fonts
      .load(SPINE_FONT)
      .catch(() => undefined)
      .then(() => live && setReady(true))
    return () => {
      live = false
    }
  }, [])
  return ready
}

/**
 * The name of a spine in the wide layout, for a screen reader: the name, the date, the sign, and for
 * the selected book the second action. It starts with the visible name. The rows of the narrow layout
 * take their name from their visible text and screen-reader text instead.
 */
function spineLabel(book: Book, date: BookDate, differ: boolean, selected: boolean): string {
  return `${book.name}, ${dateLabel(date)}${differ ? ', scholars differ on the date' : ''}${selected ? '. Select again to open its cover' : ''}`
}

/** The wide layout: two bands, the axes, the spines, the range bars, and the arcs. */
function Bands({ books, data, differ, selected, picked, onActivate }: ViewProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const arcsRef = useRef<SVGGElement>(null)
  const [width, setWidth] = useState(0)
  const ready = useFontReady()
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setWidth(el.clientWidth))
    observer.observe(el)
    setWidth(el.clientWidth)
    return () => observer.disconnect()
  }, [])

  const bands = useMemo(() => {
    if (!width || !ready) return null
    const old = books.slice(0, OLD_TESTAMENT_BOOKS)
    const neu = books.slice(OLD_TESTAMENT_BOOKS)
    return { old: layoutBand(old, data.dates, width, nameWidth), neu: layoutBand(neu, data.dates, width, nameWidth) }
  }, [books, data, width, ready])

  // The arcs draw in once. With reduced motion, they show at once.
  const drawn = bands !== null
  useEffect(() => {
    const g = arcsRef.current
    if (!g || !drawn || reducedMotion) return
    // The function of the browser, with the values that the built page had with GSAP: 0.9 s,
    // "power2.out" as the cubic-bezier curve of easeOutCubic, and 4 ms between two arcs.
    const animations = [...g.querySelectorAll('path')].map((path, i) =>
      path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: 900,
        delay: i * 4,
        easing: 'cubic-bezier(.215,.61,.355,1)',
        fill: 'backwards',
      }),
    )
    return () => {
      for (const a of animations) a.cancel()
    }
  }, [drawn, reducedMotion])

  const axis1 = HEADING_PX + (bands ? bandHeight(bands.old.rows) : 0)
  const axis2 = axis1 + MIDDLE_PX
  const height = bands ? axis2 + bandHeight(bands.neu.rows) + HEADING_PX : 0

  const byId = new Map(books.map((b) => [b.id, b]))
  const place = useMemo(() => {
    const m = new Map<string, { band: 1 | 2; x: number }>()
    for (const s of bands?.old.spines ?? []) m.set(s.id, { band: 1, x: s.x })
    for (const s of bands?.neu.spines ?? []) m.set(s.id, { band: 2, x: s.x })
    return m
  }, [bands])

  // The years between the two bands, from the dates. docs/DESIGN.md section 4.6.
  const between = useMemo(() => {
    const datesOf = (list: Book[]) => list.map((b) => data.dates.get(b.id)!)
    return yearsBetween(datesOf(books.slice(0, OLD_TESTAMENT_BOOKS)), datesOf(books.slice(OLD_TESTAMENT_BOOKS)))
  }, [books, data])

  // A spine dims when a legend group excludes it, or when a different book is selected and it has no arc to that book.
  const dimmed = (id: string) =>
    (picked !== null && byId.get(id)!.group !== picked) || (selected !== null && selected !== id && !touches(data.pairs, selected, id))

  const arcState = (p: QuotationPair) => {
    if (selected) return p.from === selected || p.to === selected ? 'on' : 'off'
    if (picked) return byId.get(p.from)!.group === picked || byId.get(p.to)!.group === picked ? 'all' : 'off'
    return 'all'
  }

  const renderBand = (band: BandLayout, n: 1 | 2, label: string) => {
    const axis = n === 1 ? axis1 : axis2
    return (
      <>
        <h2 className="tl-band-heading" style={{ top: n === 1 ? 0 : axis + bandHeight(band.rows) + 6 }}>
          {label}
        </h2>
        <ul className="tl-band" aria-label={`${label}, in date order`}>
          {band.spines.map((s) => {
            const book = byId.get(s.id)!
            const group = groupOf(book)
            const top = n === 1 ? axis - rowOffset(s.row) - SPINE_PX : axis + rowOffset(s.row)
            const style = { left: s.left, top, width: s.width, height: SPINE_PX, background: group.cloth, color: group.text } as CSSProperties
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className="tl-spine"
                  style={style}
                  data-band={n}
                  data-differ={differ.has(s.id)}
                  data-dimmed={dimmed(s.id)}
                  aria-pressed={selected === s.id}
                  aria-label={spineLabel(book, data.dates.get(s.id)!, differ.has(s.id), selected === s.id)}
                  title={dateLabel(data.dates.get(s.id)!)}
                  onClick={() => onActivate(s.id)}
                >
                  <span className="tl-spine-name">{book.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  const tickY = (n: 1 | 2) => (n === 1 ? axis1 + 22 : axis2 - 12)

  return (
    <div className="tl-stage" ref={stageRef} style={{ height }} data-reduced-motion={reducedMotion} data-selected={selected ?? undefined}>
      {bands && (
        <>
          <svg className="tl-lines" width={width} height={height} aria-hidden="true">
            {([1, 2] as const).map((n) => {
              const band = n === 1 ? bands.old : bands.neu
              const axis = n === 1 ? axis1 : axis2
              const sign = n === 1 ? -1 : 1
              return (
                <g key={n}>
                  <line className="tl-axis" x1={0} x2={band.axisWidth} y1={axis} y2={axis} />
                  {band.ticks.map((t) => (
                    <g key={t.label}>
                      <line className="tl-tick" x1={t.x} x2={t.x} y1={axis - 5} y2={axis + 5} />
                      <text className="tl-tick-label" x={t.x} y={tickY(n)} textAnchor="middle">
                        {t.label}
                      </text>
                    </g>
                  ))}
                  {band.group && (
                    <>
                      <line className="tl-axis tl-axis-unknown" x1={band.group.left} x2={band.group.left + band.group.width} y1={axis} y2={axis} />
                      <text className="tl-tick-label" x={band.group.left + band.group.width / 2} y={tickY(n)} textAnchor="middle">
                        Date not known
                      </text>
                    </>
                  )}
                  {band.spines.map(
                    (s) =>
                      s.bar && (
                        <line
                          key={s.id}
                          className="tl-range"
                          data-dimmed={dimmed(s.id)}
                          x1={s.bar.from}
                          x2={s.bar.to}
                          y1={axis + sign * (rowOffset(s.row) - ROW_GAP_PX / 2)}
                          y2={axis + sign * (rowOffset(s.row) - ROW_GAP_PX / 2)}
                          stroke={groupOf(byId.get(s.id)!).cloth}
                        />
                      ),
                  )}
                </g>
              )
            })}
            <g ref={arcsRef} className="tl-arcs">
              {data.pairs.map((p) => {
                const a = place.get(p.from)
                const b = place.get(p.to)
                if (!a || !b) return null
                const ya = a.band === 1 ? axis1 : axis2
                const yb = b.band === 1 ? axis1 : axis2
                // Between the bands: an S curve. In one band: a curve into the space between the bands.
                const d =
                  a.band !== b.band
                    ? `M${a.x},${ya} C${a.x},${(ya + yb) / 2} ${b.x},${(ya + yb) / 2} ${b.x},${yb}`
                    : `M${a.x},${ya} Q${(a.x + b.x) / 2},${ya + (a.band === 1 ? 1 : -1) * MIDDLE_PX * 0.8} ${b.x},${yb}`
                return (
                  <path key={`${p.from}|${p.to}`} d={d} pathLength={1} className="tl-arc" data-state={arcState(p)} strokeWidth={ARC_WIDTH[arcStep(p.n)]} />
                )
              })}
            </g>
          </svg>

          {renderBand(bands.old, 1, 'Old Testament')}
          <p className="tl-between" style={{ top: axis1 + MIDDLE_PX / 2 - 16 }}>
            About {between} years or more between the last Old Testament book and the first New Testament book
          </p>
          {renderBand(bands.neu, 2, 'New Testament')}
        </>
      )}
    </div>
  )
}

/** True if the two books have a quotation link between them. */
function touches(pairs: QuotationPair[], a: string, b: string): boolean {
  return pairs.some((p) => (p.from === a && p.to === b) || (p.from === b && p.to === a))
}

/** The narrow layout: the books as a list in date order, in two parts, with no arcs. docs/DESIGN.md section 4.6. */
function DateList({ books, data, differ, selected, picked, onActivate }: ViewProps) {
  const parts = [
    { label: 'Old Testament', list: books.slice(0, OLD_TESTAMENT_BOOKS) },
    { label: 'New Testament', list: books.slice(OLD_TESTAMENT_BOOKS) },
  ]
  return (
    <div className="tl-list">
      {parts.map(({ label, list }) => {
        const entries = list.map((b, i) => ({ b, i, at: standPoint(data.dates.get(b.id)!) }))
        const dated = entries.filter((e) => e.at !== null).sort((p, q) => p.at! - q.at! || p.i - q.i)
        const unknown = entries.filter((e) => e.at === null)
        const item = (b: Book) => {
          const group = groupOf(b)
          const date = data.dates.get(b.id)!
          return (
            <li key={b.id}>
              <button
                type="button"
                className="tl-row"
                data-differ={differ.has(b.id)}
                data-dimmed={picked !== null && b.group !== picked}
                aria-pressed={selected === b.id}
                style={{ background: group.cloth, color: group.text }}
                onClick={() => onActivate(b.id)}
              >
                {/* The name comes from the visible text, so that it holds each visible word (WCAG 2.5.3). */}
                <span className="tl-spine-name">{b.name}</span>
                <span className="tl-row-date">
                  <span className="sr-only">, </span>
                  {dateLabel(date)}
                  {differ.has(b.id) && <span className="sr-only">, scholars differ on the date</span>}
                  {selected === b.id && <span className="sr-only">. Select again to open its cover</span>}
                </span>
              </button>
              {selected === b.id && <QuotedList book={b} books={books} data={data} differ={differ} level={3} />}
            </li>
          )
        }
        return (
          <section key={label} aria-labelledby={`tl-${label}`}>
            <h2 id={`tl-${label}`}>{label}</h2>
            <ol className="tl-rows">{dated.map((e) => item(e.b))}</ol>
            {unknown.length > 0 && (
              <>
                <h3>Date not known</h3>
                <ul className="tl-rows">{unknown.map((e) => item(e.b))}</ul>
              </>
            )}
          </section>
        )
      })}
    </div>
  )
}

/** The text form of the arcs: the books that the selected book quotes, and the books that quote it. */
function QuotedList({ book, books, data, differ, level }: { book: Book; books: Book[]; data: Data; differ: Set<string>; level: 2 | 3 }) {
  const order = (id: string) => books.findIndex((b) => b.id === id)
  const name = (id: string) => books[order(id)].name
  const sort = (list: { id: string; n: number }[]) => list.sort((a, b) => b.n - a.n || order(a.id) - order(b.id))
  const quotes = sort(data.pairs.filter((p) => p.from === book.id).map((p) => ({ id: p.to, n: p.n })))
  const quotedBy = sort(data.pairs.filter((p) => p.to === book.id).map((p) => ({ id: p.from, n: p.n })))
  const Heading = level === 2 ? 'h2' : 'h3'
  const Sub = level === 2 ? 'h3' : 'h4'
  const date = data.dates.get(book.id)!
  const links = (n: number) => (n === 1 ? '1 quotation link' : `${n} quotation links`)
  return (
    <section className="tl-panel" aria-labelledby={`tl-panel-${book.id}`}>
      <Heading id={`tl-panel-${book.id}`}>{book.name}</Heading>
      <p>
        Written: {dateLabel(date)}.{differ.has(book.id) ? ' Scholars differ on the date. The cover gives the detail.' : ''}
      </p>
      <Sub>Books that it quotes</Sub>
      {quotes.length ? (
        <ul>
          {quotes.map((q) => (
            <li key={q.id}>
              {name(q.id)}: {links(q.n)}
            </li>
          ))}
        </ul>
      ) : (
        <p>None.</p>
      )}
      <Sub>Books that quote it</Sub>
      {quotedBy.length ? (
        <ul>
          {quotedBy.map((q) => (
            <li key={q.id}>
              {name(q.id)}: {links(q.n)}
            </li>
          ))}
        </ul>
      ) : (
        <p>None.</p>
      )}
      <a className="tl-open" href={bookHref(book.id)}>
        Open the cover of {book.name}
      </a>
    </section>
  )
}
