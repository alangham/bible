// The quotation diagram at #/quotations. docs/DESIGN.md section 7.8, docs/TASKS.md Task 15 steps 4 to 8.
// - The 66 book names around a circle, in their groups. A curved line joins two books that have one
//   quotation link or more, from public/data/quotation-pairs.json.
// - Each book name is a control. A selected book has its lines bright, and the other lines dim.
//   Select it again to clear.
// - The list of the selected book is the text form of its lines.
// - In the narrow layout, a list control above the diagram selects a book.

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react'
import { groupOf, type Book } from '../data/books.ts'
import { loadQuotationPairs, type QuotationPair } from '../data/dates.ts'
import { bookHref } from '../router.ts'
import type { ScreenLayout } from '../screenLayout.ts'
import { bandLabel } from '../wall/layout.ts'
import { diagram, NARROW_SIZE, quotationLists, WIDE_SIZE } from './quotationLayout.ts'
import { RefBar } from './RefBar.tsx'

/** The ink of a dim line. The prototype value. */
const DIM_INK = '#1D1D1F'

/** The color of a book name with no line to the selected book. It keeps full opacity. docs/DESIGN.md section 7.8. */
const GRAY_NAME = '#6E6E73'

export function QuotationsPage({ books, layout }: { books: Book[]; layout: ScreenLayout }) {
  const [pairs, setPairs] = useState<QuotationPair[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const panelHeading = useRef<HTMLHeadingElement>(null)
  const focusPanel = useRef(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    loadQuotationPairs().then(setPairs, (e: unknown) => setError(String(e)))
  }, [])

  // After a book in the list selects a different book, the focus goes to the heading of the list.
  useEffect(() => {
    if (focusPanel.current && selected) panelHeading.current?.focus({ preventScroll: false })
    focusPanel.current = false
  }, [selected])

  const toggle = (id: string) => setSelected((s) => (s === id ? null : id))
  const book = selected ? books.find((b) => b.id === selected) : undefined

  return (
    <div className="ref-page" data-page="quotations">
      <RefBar current="quotations" />
      <main className="ref-main">
        <h1>Quotations</h1>
        <p className="ref-lead">
          Which books of the New Testament quote which books of the Old Testament. A line joins two books that have one quotation link or more. The color of a line goes from the book
          that quotes to the book that it quotes. Select a book to see its lines.
        </p>
        {error && <p role="alert">The quotation links did not load. {error}</p>}
        {layout === 'narrow' && (
          <select className="q-select" aria-label="Select a book" value={selected ?? ''} onChange={(e) => setSelected(e.target.value || null)}>
            <option value="">Select a book</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}
        <div className="q-layout" data-ready={pairs !== null}>
          {pairs && <Diagram books={books} pairs={pairs} layout={layout} selected={selected} onSelect={toggle} />}
          {pairs && book && (
            <BookList
              books={books}
              pairs={pairs}
              book={book}
              headingRef={panelHeading}
              onSelect={(id) => {
                focusPanel.current = true
                setSelected(id)
              }}
            />
          )}
        </div>
        <p className="ref-foot">From the Bible Quotation Database. A thicker line has more quotation links.</p>
      </main>
    </div>
  )
}

interface DiagramProps {
  books: Book[]
  pairs: QuotationPair[]
  layout: ScreenLayout
  selected: string | null
  onSelect: (id: string) => void
}

function Diagram({ books, pairs, layout, selected, onSelect }: DiagramProps) {
  const size = layout === 'narrow' ? NARROW_SIZE : WIDE_SIZE
  const d = useMemo(() => diagram(books, pairs, size), [books, pairs, size])
  const ids = useId().replace(/:/g, '')
  const linked = useMemo(() => {
    const set = new Set<string>()
    if (selected)
      for (const p of pairs) {
        if (p.from === selected) set.add(p.to)
        if (p.to === selected) set.add(p.from)
      }
    return set
  }, [pairs, selected])
  // The hit area of a name: the room of one book along the circle, 24 px at most.
  const hit = Math.min(24, d.unit * (size.r + size.labelGap))
  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(id)
    }
  }

  return (
    <svg
      className="q-diagram"
      viewBox={`0 0 ${d.size} ${d.size}`}
      width={layout === 'narrow' ? '100%' : d.size}
      role="group"
      aria-label="Diagram of the quotation links between books"
    >
      <defs>
        {d.lines.map((l, i) =>
          !selected || l.pair.from === selected || l.pair.to === selected ? (
            <linearGradient key={i} id={`${ids}-q${i}`} gradientUnits="userSpaceOnUse" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}>
              <stop offset="0" stopColor={l.from.color} />
              <stop offset="1" stopColor={l.to.color} />
            </linearGradient>
          ) : null,
        )}
      </defs>
      <g aria-hidden="true">
        {d.arcs.map((a, i) => (
          <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={size.arcWidth} />
        ))}
        {d.lines.map((l, i) => {
          const on = !selected || l.pair.from === selected || l.pair.to === selected
          return (
            <path
              key={i}
              className="q-line"
              data-from={l.pair.from}
              data-to={l.pair.to}
              data-n={l.pair.n}
              data-on={on}
              d={l.d}
              fill="none"
              stroke={on ? `url(#${ids}-q${i})` : DIM_INK}
              strokeWidth={l.width}
              strokeOpacity={selected ? (on ? 0.9 : 0.04) : 0.4}
              strokeLinecap="round"
            />
          )
        })}
      </g>
      {d.books.map((b) => {
        const isSelected = selected === b.book.id
        // A name with no line to the selected book is gray, at full opacity, so that its text keeps a
        // contrast of 4.5 to 1. Arthur decided this on 2026-11-14.
        const gray = selected !== null && !isSelected && !linked.has(b.book.id)
        return (
          <g
            key={b.book.id}
            className="q-book"
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={b.book.name}
            data-book={b.book.id}
            data-gray={gray}
            // In the narrow layout, a name is smaller than 24 px. The list control above the diagram does
            // the same thing at 44 px: the exception "Equivalent" of WCAG 2.5.8.
            data-target-equivalent={layout === 'narrow' ? 'q-select' : undefined}
            transform={`rotate(${b.rotate} ${b.x} ${b.y})`}
            style={{ '--q': b.color } as CSSProperties}
            onClick={() => onSelect(b.book.id)}
            onKeyDown={(e) => onKey(e, b.book.id)}
          >
            <rect className="q-hit" x={b.flip ? b.x - size.label + 6 : b.x - 6} y={b.y - hit / 2} width={size.label} height={hit} rx={4} />
            <text
              x={b.x}
              y={b.y}
              fill={gray ? GRAY_NAME : b.color}
              fontSize={size.fontSize}
              fontWeight={isSelected ? 800 : 600}
              dominantBaseline="central"
              textAnchor={b.flip ? 'end' : 'start'}
            >
              {b.book.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

interface BookListProps {
  books: Book[]
  pairs: QuotationPair[]
  book: Book
  headingRef: RefObject<HTMLHeadingElement | null>
  onSelect: (id: string) => void
}

/** The text form of the lines of the selected book. */
function BookList({ books, pairs, book, headingRef, onSelect }: BookListProps) {
  const lists = quotationLists(books, pairs, book.id)
  const color = groupOf(book).color
  const list = (items: { book: Book; n: number }[], label: string) =>
    items.length ? (
      <ul aria-label={label}>
        {items.map((it) => (
          <li key={it.book.id}>
            <button type="button" style={{ color: groupOf(it.book).color }} onClick={() => onSelect(it.book.id)}>
              {it.book.name}
            </button>
            <span>
              {it.n}
              <span className="sr-only"> {it.n === 1 ? 'quotation link' : 'quotation links'}</span>
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="q-none">None.</p>
    )
  return (
    <section className="q-list" aria-labelledby="q-list-name" style={{ '--q': color } as CSSProperties}>
      <p className="q-band">{bandLabel(book.group)}</p>
      <h2 id="q-list-name" ref={headingRef} tabIndex={-1}>
        {book.name}
      </h2>
      <h3>Books that it quotes</h3>
      {list(lists.quotes, `Books that ${book.name} quotes`)}
      <h3>Books that quote it</h3>
      {list(lists.quotedBy, `Books that quote ${book.name}`)}
      <a className="q-open" href={bookHref(book.id)}>
        Open {book.name}
        <span aria-hidden="true"> ›</span>
      </a>
    </section>
  )
}
