// The layout of the timeline in the wide layout. docs/DESIGN.md section 4.6.
//
// Each band has its own axis and scale. A spine lies at the point of its date: the year, or the
// middle of its range. A book with a range has a thin bar beside the spine that shows the range.
// Spines that would touch go to the next row of the stack, so that no spine covers a different
// spine, and no range bar covers a different range bar. The books with no date are in a group
// "Date not known" at the end of the band.
//
// The rows of a band grow away from its axis. Row 0 is next to the axis.

import type { Book } from '../data/books.ts'
import { lineYear, standPoint, type BookDate } from '../data/dates.ts'

/** The thickness of a spine: the minimum touch size, docs/DESIGN.md section 3. */
export const SPINE_PX = 44
/** The space between two rows. The range bar of a spine is in the space on the axis side of the spine. */
export const ROW_GAP_PX = 10
/** The space on each side of the name on a spine. */
export const SPINE_PAD_PX = 17
/** The columns of the group "Date not known". */
export const UNKNOWN_COLUMNS = 2
const COLUMN_GAP_PX = 8
const GROUP_GAP_PX = 40
/** The least space between two spines or two range bars in one row. */
const CLEAR_PX = 6

export interface PlacedSpine {
  id: string
  /** Left edge, from the left edge of the band. */
  left: number
  width: number
  /** The middle of the spine, and the end of its arcs on the axis. */
  x: number
  /** The row, from the axis. */
  row: number
  /** The range bar, for a book with a range. */
  bar?: { from: number; to: number }
  unknown: boolean
}

export interface Tick {
  x: number
  label: string
}

export interface BandLayout {
  spines: PlacedSpine[]
  /** The length of the axis. The group "Date not known" starts after it. */
  axisWidth: number
  /** Left edge and width of the group "Date not known". Null when the band has no such book. */
  group: { left: number; width: number } | null
  ticks: Tick[]
  /** The number of rows. */
  rows: number
}

/** The distance of the near edge of a row from the axis. */
export function rowOffset(row: number): number {
  return row * (SPINE_PX + ROW_GAP_PX) + ROW_GAP_PX
}

/** The height of a band with this number of rows. */
export function bandHeight(rows: number): number {
  return rows * (SPINE_PX + ROW_GAP_PX)
}

function tickLabel(year: number): string {
  return year < 0 ? `${-year} BC` : `AD ${year}`
}

/**
 * Places the books of one band.
 * @param books the books of the band, in Bible order
 * @param dates the date of each book
 * @param width the width of the band in px
 * @param nameWidth the width in px of the name of a book on its spine
 */
export function layoutBand(
  books: Book[],
  dates: Map<string, BookDate>,
  width: number,
  nameWidth: (name: string) => number,
): BandLayout {
  const lengthOf = (b: Book) => Math.ceil(nameWidth(b.name)) + 2 * SPINE_PAD_PX
  const dated = books.filter((b) => standPoint(dates.get(b.id)!) !== null)
  const unknown = books.filter((b) => standPoint(dates.get(b.id)!) === null)

  const columnWidth = unknown.length ? Math.max(...unknown.map(lengthOf)) : 0
  const columns = Math.min(UNKNOWN_COLUMNS, unknown.length)
  const groupWidth = columns ? columns * columnWidth + (columns - 1) * COLUMN_GAP_PX : 0
  const axisWidth = groupWidth ? width - groupWidth - GROUP_GAP_PX : width

  // The scale: the first year to the last year of the dated books. The ends keep half of the longest spine free.
  const first = Math.min(...dated.map((b) => lineYear(dates.get(b.id)!.from!)))
  const last = Math.max(...dated.map((b) => lineYear(dates.get(b.id)!.to!)))
  const margin = Math.max(...dated.map(lengthOf)) / 2
  const scale = (y: number) => margin + ((y - first) / (last - first)) * (axisWidth - 2 * margin)

  // Ticks: each 100 years for a long band, each 10 years for a short band.
  // The ticks are at round years: 1000 BC, 900 BC, or AD 40, AD 50. There is no year 0.
  const step = last - first > 300 ? 100 : 10
  const ticks: Tick[] = []
  const firstReal = Math.min(...dated.map((b) => dates.get(b.id)!.from!))
  const lastReal = Math.max(...dated.map((b) => dates.get(b.id)!.to!))
  for (let y = Math.ceil(firstReal / step) * step; y <= lastReal; y += step) {
    if (y !== 0) ticks.push({ x: scale(lineYear(y)), label: tickLabel(y) })
  }

  // Date order. On a tie, Bible order.
  const order = dated
    .map((b, i) => ({ b, i, at: standPoint(dates.get(b.id)!)! }))
    .sort((p, q) => p.at - q.at || p.i - q.i)

  const rowsUsed: { from: number; to: number }[][] = []
  const spines: PlacedSpine[] = []
  for (const { b, at } of order) {
    const d = dates.get(b.id)!
    const len = lengthOf(b)
    const x = scale(at)
    const bar = d.kind === 'range' ? { from: scale(lineYear(d.from!)), to: scale(lineYear(d.to!)) } : undefined
    const foot = { from: Math.min(x - len / 2, bar?.from ?? Infinity), to: Math.max(x + len / 2, bar?.to ?? -Infinity) }
    let row = 0
    while (rowsUsed[row]?.some((r) => foot.from < r.to + CLEAR_PX && r.from < foot.to + CLEAR_PX)) row++
    ;(rowsUsed[row] ??= []).push(foot)
    spines.push({ id: b.id, left: x - len / 2, width: len, x, row, bar, unknown: false })
  }

  // The group "Date not known", in Bible order, row by row.
  const groupLeft = axisWidth + GROUP_GAP_PX
  unknown.forEach((b, i) => {
    const len = lengthOf(b)
    const col = i % UNKNOWN_COLUMNS
    const left = groupLeft + col * (columnWidth + COLUMN_GAP_PX) + (columnWidth - len) / 2
    spines.push({ id: b.id, left, width: len, x: left + len / 2, row: Math.floor(i / UNKNOWN_COLUMNS), unknown: true })
  })

  return {
    spines,
    axisWidth,
    group: groupWidth ? { left: groupLeft, width: groupWidth } : null,
    ticks,
    rows: Math.max(0, ...spines.map((s) => s.row + 1)),
  }
}
