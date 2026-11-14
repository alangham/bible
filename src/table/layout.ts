// Positions of the spines on the table, in world units.
// One world unit is 100 px of mockup D1 (1440 px wide).

import { spineThickness, type Book } from '../data/books.ts'

export const PX = 1 / 100

/** Mockup D1: 1440 px page, 72 px side padding, 44 px gap, five columns. */
export const STACK_WIDTH = 224 * PX
export const STACK_GAP = 44 * PX
/** Depth of a book that lies flat: the size of its cover, front to back. */
export const BOOK_DEPTH = 150 * PX

/** Sideways offsets in px, from mockup D1. They repeat along the books. */
const OFFSETS_PX = [0, 5, -4, 3, -6, 2, -2, 6, -5, 1, 4, -3, 0, -1]

/** Sideways offset in px of the book at this index in Bible order. */
export function spineOffsetPx(index: number): number {
  return OFFSETS_PX[index % OFFSETS_PX.length]
}

export interface SpineBox {
  book: Book
  /** Center of the box. */
  x: number
  y: number
  z: number
  width: number
  thickness: number
  depth: number
}

export interface TableLayout {
  spines: SpineBox[]
  /** Width of the five stacks together. */
  width: number
  /** Height of the tallest stack. */
  height: number
}

export function layoutTable(books: Book[]): TableLayout {
  const width = 5 * STACK_WIDTH + 4 * STACK_GAP
  const spines: SpineBox[] = []
  let height = 0
  for (let stack = 1; stack <= 5; stack++) {
    const x0 = -width / 2 + STACK_WIDTH / 2 + (stack - 1) * (STACK_WIDTH + STACK_GAP)
    // Position 1 is the top spine, so build the stack from the bottom up.
    const inStack = books
      .filter((b) => b.stack === stack)
      .sort((a, b) => b.position - a.position)
    let y = 0
    for (const book of inStack) {
      const thickness = spineThickness(book.chapters) * PX
      const index = books.indexOf(book)
      spines.push({
        book,
        x: x0 + spineOffsetPx(index) * PX,
        y: y + thickness / 2,
        z: 0,
        width: STACK_WIDTH,
        thickness,
        depth: BOOK_DEPTH,
      })
      y += thickness
    }
    height = Math.max(height, y)
  }
  // Keep Bible order for the callers.
  spines.sort((a, b) => books.indexOf(a.book) - books.indexOf(b.book))
  return { spines, width, height }
}
