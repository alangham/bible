// The geometry of the quotation diagram. docs/DESIGN.md section 7.8, docs/TASKS.md Task 15 step 4.
// The values are those of the function renderQuotes in docs/prototype/index.html.
// - The 66 book names are around a circle in Bible order, in their groups, with a gap between groups.
// - An arc in the group color is behind each group.
// - A curved line joins two books with one quotation link or more. It bends toward the middle of the
//   circle, through the middles of the two groups.

import { groupOf, type Book, type GroupName } from '../data/books.ts'
import type { QuotationPair } from '../data/dates.ts'
import { groupBlocks } from '../wall/layout.ts'

export interface DiagramSize {
  /** The radius of the circle of the lines. */
  r: number
  /** The room for a book name outside the circle. */
  label: number
  /** The space from the circle to the start of a book name. */
  labelGap: number
  fontSize: number
  arcWidth: number
  /** The width of a line for 1 or 2 links, 3 to 9 links, and 10 links or more. */
  lineWidths: [number, number, number]
}

/**
 * Prototype values: the wide layout, and the narrow layout.
 * The narrow label room is 70, where the prototype has 64. With 64, the names "1 Thessalonians" and
 * "2 Thessalonians" go past the edge of the diagram and are cut. The longest name is about 70 units long.
 */
export const WIDE_SIZE: DiagramSize = { r: 250, label: 120, labelGap: 13, fontSize: 12.5, arcWidth: 6, lineWidths: [1.1, 2.1, 3.6] }
export const NARROW_SIZE: DiagramSize = { r: 112, label: 70, labelGap: 9, fontSize: 8.5, arcWidth: 4, lineWidths: [0.8, 1.4, 2.4] }

/** The gap between two groups, in radians. */
const GROUP_GAP = 0.035

export interface DiagramBook {
  book: Book
  color: string
  /** The angle of the book on the circle, in radians. 0 is at the right, and the angle grows clockwise. */
  angle: number
  /** True on the left half: the name reads from the outside to the circle. */
  flip: boolean
  /** The start of the name, and its rotation in degrees. */
  x: number
  y: number
  rotate: number
}

export interface DiagramArc {
  group: GroupName
  color: string
  d: string
}

export interface DiagramLine {
  pair: QuotationPair
  from: DiagramBook
  to: DiagramBook
  d: string
  width: number
  /** The two ends of the line, for the color gradient from the book that quotes to the book that it quotes. */
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface Diagram {
  size: number
  /** The angle that one book takes on the circle, in radians. */
  unit: number
  books: DiagramBook[]
  arcs: DiagramArc[]
  lines: DiagramLine[]
}

/** The step of thickness of a line: 1 or 2 links, 3 to 9 links, or 10 links or more. */
export function lineStep(n: number): 0 | 1 | 2 {
  return n >= 10 ? 2 : n >= 3 ? 1 : 0
}

export function diagram(books: Book[], pairs: QuotationPair[], s: DiagramSize): Diagram {
  const size = (s.r + s.label) * 2 + 10
  const c = size / 2
  const at = (angle: number, radius: number): [number, number] => [c + Math.cos(angle) * radius, c + Math.sin(angle) * radius]
  const round = (v: number) => Math.round(v * 100) / 100
  const blocks = groupBlocks(books)
  const unit = (Math.PI * 2 - GROUP_GAP * blocks.length) / books.length
  let angle = -Math.PI / 2 + GROUP_GAP / 2
  const placed = new Map<string, DiagramBook>()
  const groupMiddle = new Map<string, number>()
  const arcs: DiagramArc[] = []
  for (const block of blocks) {
    const a0 = angle
    for (const book of block.books) {
      const a = angle + unit / 2
      const flip = Math.cos(a) < 0
      const [x, y] = at(a, s.r + s.labelGap)
      const deg = (a * 180) / Math.PI
      placed.set(book.id, { book, color: groupOf(book).color, angle: a, flip, x: round(x), y: round(y), rotate: round(flip ? deg + 180 : deg) })
      angle += unit
    }
    const a1 = angle
    for (const book of block.books) groupMiddle.set(book.id, (a0 + a1) / 2)
    const [sx, sy] = at(a0, s.r + 4)
    const [ex, ey] = at(a1, s.r + 4)
    arcs.push({
      group: block.group,
      color: groupOf(block.books[0]).color,
      d: `M${round(sx)} ${round(sy)} A ${s.r + 4} ${s.r + 4} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${round(ex)} ${round(ey)}`,
    })
    angle += GROUP_GAP
  }
  const lines: DiagramLine[] = []
  for (const pair of pairs) {
    const from = placed.get(pair.from)
    const to = placed.get(pair.to)
    if (!from || !to) continue
    const [x1, y1] = at(from.angle, s.r)
    const [x2, y2] = at(to.angle, s.r)
    const [c1x, c1y] = at(groupMiddle.get(pair.from)!, s.r * 0.45)
    const [c2x, c2y] = at(groupMiddle.get(pair.to)!, s.r * 0.45)
    lines.push({
      pair,
      from,
      to,
      d: `M${round(x1)} ${round(y1)} C ${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(x2)} ${round(y2)}`,
      width: s.lineWidths[lineStep(pair.n)],
      x1: round(x1),
      y1: round(y1),
      x2: round(x2),
      y2: round(y2),
    })
  }
  return { size, unit, books: [...placed.values()], arcs, lines }
}

/** The lists of one book: the books that it quotes, and the books that quote it. Most links first, then Bible order. */
export function quotationLists(books: Book[], pairs: QuotationPair[], id: string) {
  const order = new Map(books.map((b, i) => [b.id, i]))
  const byCount = (key: 'from' | 'to') => (x: QuotationPair, y: QuotationPair) => y.n - x.n || order.get(x[key])! - order.get(y[key])!
  const book = (bookId: string) => books.find((b) => b.id === bookId)!
  return {
    quotes: pairs
      .filter((p) => p.from === id && order.has(p.to))
      .sort(byCount('to'))
      .map((p) => ({ book: book(p.to), n: p.n })),
    quotedBy: pairs
      .filter((p) => p.to === id && order.has(p.from))
      .sort(byCount('from'))
      .map((p) => ({ book: book(p.from), n: p.n })),
  }
}
