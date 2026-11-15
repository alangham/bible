// The table handed the selected spine to the cover page, so that the book could
// land on the cover from the place where the spine left the stack.
// docs/TASKS.md Task 4 step 7. Task 12 removed the table, so no page sets a handoff now.
// Without a handoff, the cover shows the book at rest. Task 13 removes the cover and this file.

/** A rectangle in CSS px from the top left of the viewport. */
export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export interface Handoff {
  id: string
  /** The spine face at the end of its move out of the stack, in viewport px. */
  rect: Rect
  /** performance.now() when the spine started to move. */
  at: number
}

/** A handoff older than this is not used. For example, after the reader went back. */
const MAX_AGE_MS = 3000

let current: Handoff | null = null

export function setHandoff(handoff: Handoff) {
  current = handoff
}

/** The handoff for this book, if it is new. It stays until clearHandoff. */
export function peekHandoff(id: string): Handoff | null {
  if (!current || current.id !== id || performance.now() - current.at > MAX_AGE_MS) return null
  return current
}

export function clearHandoff() {
  current = null
}
