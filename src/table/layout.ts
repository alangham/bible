// Sizes of the closed book on the cover page, in world units.
// One world unit is 100 px of mockup D1 (1440 px wide).
// Task 12 removed the table page. The cover keeps these values until Task 13 removes it.

export const PX = 1 / 100

/** The width of a book that lies flat: the width of a stack in mockup D1. */
export const STACK_WIDTH = 224 * PX
/** Depth of a book that lies flat: the size of its cover, front to back. */
export const BOOK_DEPTH = 150 * PX
