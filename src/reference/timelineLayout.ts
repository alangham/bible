// The layout of the timeline in the wide layout. docs/DESIGN.md section 7.8, docs/TASKS.md Task 17 step 5.
// The values are those of the function renderTimeline in docs/prototype/index.html.
// - One line with a break. The Old Testament books have one scale. The New Testament books have a
//   larger scale. The break is the years with no books.
// - Each book name is above the line at its date: the year, or the middle of its range.
// - Names with dates that are near go up a row, so that no name covers a different name, and no
//   range bar covers a different range bar.
//
// All sizes are in CSS px. The page measures the width of the line and of each name.

import { groupOf, groupVar, type Book } from '../data/books.ts'
import { lineYear, standPoint, yearsBetween, type BookDate } from '../data/dates.ts'

/** The number of books of the Old Testament. */
export const OLD_TESTAMENT_BOOKS = 39
/** The height of one row of names. */
export const ROW_PX = 27
/** The width of the break in the line. */
export const BREAK_PX = 70
/** The space added to the width of a name, so that two names in one row do not touch. */
export const NAME_PAD_PX = 10
/** The Old Testament part and the New Testament part of the line: 700 px and 430 px in the prototype. */
const OLD_SHARE = 700 / (700 + 430)

export interface TimelineItem {
  book: Book
  date: BookDate
  color: string
  /** The middle of the name. It moves in from an end of the line where the name would go past it. */
  x: number
  /** The first year and the last year on the line. The same for a book with one year. */
  x1: number
  x2: number
  /** The row of the name, from the line up. Row 0 is next to the line. */
  row: number
  /** The width of the name, without the space between names. */
  width: number
}

export interface TimelineTick {
  x: number
  label: string
}

export interface TimelineLayout {
  width: number
  /** The end of the Old Testament part, where the break starts. */
  breakStart: number
  /** The start of the New Testament part, where the break ends. */
  breakEnd: number
  /** The years with no books, from the dates. docs/DESIGN.md section 4.6. */
  between: number
  /** The books in date order. On a tie, Bible order. */
  items: TimelineItem[]
  ticks: TimelineTick[]
  rows: number
}

function yearLabel(year: number): string {
  return year < 0 ? `${-year} BC` : `AD ${year}`
}

/** The least space between two year labels below the line. A label such as "1300 BC" is about 47 px wide. */
export const MIN_TICK_PX = 56

/**
 * A scale from the years of some books to a part of the line. The part starts and ends at round
 * years: each `steps[0]` years. There is no year 0.
 * The year labels are each `steps[0]` years, as in the prototype. Where that puts two labels nearer
 * than MIN_TICK_PX, the labels use the next step of `steps`.
 */
function scale(dates: BookDate[], steps: readonly number[], left: number, right: number) {
  const step = steps[0]
  const first = Math.floor(Math.min(...dates.map((d) => d.from)) / step) * step
  const last = Math.ceil(Math.max(...dates.map((d) => d.to)) / step) * step
  const [a, b] = [lineYear(first), lineYear(last)]
  const x = (lineYearValue: number) => left + ((lineYearValue - a) / (b - a)) * (right - left)
  const pxPerYear = (right - left) / (b - a)
  const tickStep = steps.find((s) => s * pxPerYear >= MIN_TICK_PX) ?? steps[steps.length - 1]
  const ticks: TimelineTick[] = []
  const firstReal = Math.min(...dates.map((d) => d.from))
  const lastReal = Math.max(...dates.map((d) => d.to))
  for (let y = Math.ceil(firstReal / tickStep) * tickStep; y <= lastReal; y += tickStep) if (y !== 0) ticks.push({ x: x(lineYear(y)), label: yearLabel(y) })
  return { x, ticks }
}

/**
 * Places the 66 books on the line.
 * @param books the books in Bible order
 * @param dates the date of each book
 * @param width the width of the line in px
 * @param nameWidth the width in px of the name of a book, as the page draws it
 */
export function timelineLayout(books: Book[], dates: Map<string, BookDate>, width: number, nameWidth: (book: Book) => number): TimelineLayout {
  const old = books.slice(0, OLD_TESTAMENT_BOOKS).map((b) => dates.get(b.id)!)
  const neu = books.slice(OLD_TESTAMENT_BOOKS).map((b) => dates.get(b.id)!)
  const breakStart = Math.round((width - BREAK_PX) * OLD_SHARE)
  const breakEnd = breakStart + BREAK_PX
  const oldScale = scale(old, [100, 200, 500], 0, breakStart)
  const newScale = scale(neu, [10, 20, 50], breakEnd, width)
  const at = (i: number, year: number) => (i < OLD_TESTAMENT_BOOKS ? oldScale : newScale).x(lineYear(year))

  const order = books
    .map((book, i) => ({ book, i, date: dates.get(book.id)! }))
    .sort((p, q) => standPoint(p.date) - standPoint(q.date) || p.i - q.i)

  const rows: [number, number][][] = []
  const items: TimelineItem[] = order.map(({ book, i, date }) => {
    const x1 = at(i, date.from)
    const x2 = at(i, date.to)
    const w = nameWidth(book)
    let x = (i < OLD_TESTAMENT_BOOKS ? oldScale : newScale).x(standPoint(date))
    let l = Math.min(x - (w + NAME_PAD_PX) / 2, x1 - 3)
    let r = Math.max(x + (w + NAME_PAD_PX) / 2, x2 + 3)
    if (l < 0) {
      x -= l
      r -= l
      l = 0
    }
    if (r > width) {
      x -= r - width
      l -= r - width
      r = width
    }
    let row = 0
    while (rows[row]?.some(([a, b]) => !(r <= a || l >= b))) row++
    ;(rows[row] ??= []).push([l, r])
    return { book, date, color: groupVar(groupOf(book)), x, x1, x2, row, width: w }
  })

  return {
    width,
    breakStart,
    breakEnd,
    between: yearsBetween(old, neu),
    items,
    ticks: [...oldScale.ticks, ...newScale.ticks],
    rows: rows.length,
  }
}
