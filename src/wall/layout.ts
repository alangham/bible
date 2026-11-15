// Where each book name goes on the wall. docs/DESIGN.md section 7.4, docs/TASKS.md Task 12 step 7.
// src/screenLayout.ts decides the wide or the narrow layout. This file gives the sizes of each.
// The values are those of the function `renderWall` in docs/prototype/index.html.

import type { Book, GroupName } from '../data/books.ts'

/** The number of books in each of the five columns of the wide layout, in Bible order. docs/DESIGN.md section 4.1. */
export const WIDE_COLUMNS = [13, 14, 12, 14, 13]

/** The wall is this wide at most in the wide layout, padding included, in px. */
export const WIDE_MAX_PX = 1320
/** The wall is this wide at most in the narrow layout, in px. docs/DESIGN.md section 7.4. */
export const NARROW_MAX_PX = 520
/** The side padding and the gap between the two columns of a block, in the narrow layout, in px. */
export const NARROW_PAD_PX = 20
export const NARROW_GAP_PX = 14

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** The sizes of the wide layout for a screen width, in px. */
export function wideSizes(screenWidth: number) {
  const pad = clamp(screenWidth * 0.045, 24, 64)
  const gap = clamp(screenWidth * 0.021, 16, 30)
  const inner = Math.min(screenWidth, WIDE_MAX_PX) - pad * 2
  return { pad, gap, inner, column: (inner - gap * 4) / 5 }
}

/** The sizes of the narrow layout for a screen width, in px. */
export function narrowSizes(screenWidth: number) {
  const wall = Math.min(screenWidth, NARROW_MAX_PX)
  const full = wall - NARROW_PAD_PX * 2
  return { wall, full, column: (full - NARROW_GAP_PX) / 2 }
}

/** The books of each wide column, in Bible order. */
export function wideColumns(books: Book[]): Book[][] {
  const columns: Book[][] = []
  let start = 0
  for (const count of WIDE_COLUMNS) {
    columns.push(books.slice(start, start + count))
    start += count
  }
  return columns
}

/** The text of the band of a group. The band of "History (Acts)" says "History". Task 12 step 6. */
export function bandLabel(group: GroupName): string {
  return group === 'History (Acts)' ? 'History' : group
}

/** The groups in Bible order, each with its books. */
export function groupBlocks(books: Book[]): { group: GroupName; books: Book[] }[] {
  const blocks: { group: GroupName; books: Book[] }[] = []
  for (const book of books) {
    const last = blocks[blocks.length - 1]
    if (last && last.group === book.group) last.books.push(book)
    else blocks.push({ group: book.group, books: [book] })
  }
  return blocks
}

/**
 * The number of names in the first of the two columns of a narrow block, so that the two columns
 * have almost the same height. `heights` are the line heights of the names in Bible order.
 * Arthur decided this rule on 2026-11-14. docs/DESIGN.md section 7.4.
 */
export function balancedSplit(heights: number[]): number {
  const total = heights.reduce((a, b) => a + b, 0)
  let best = Infinity
  let split = 1
  let first = 0
  for (let k = 1; k <= heights.length; k++) {
    first += heights[k - 1]
    const diff = Math.abs(first - (total - first))
    if (diff < best) {
      best = diff
      split = k
    }
  }
  return split
}
