// The font of the names on the spines. This module does not import three.js. Task 9 step 5.

export const SPINE_FONT_FAMILY = '"Cormorant Garamond", Georgia, serif'

/** The least size of a spine name, in mockup px. POLISH.md item 3. About 12.5 px on screen at 1440 by 900 px. */
export const MIN_SPINE_FONT = 20

/** The size of a spine name for a spine thickness, in mockup px: half the thickness, from 20 px to 24 px. */
export function spineFontPx(thickness: number): number {
  return Math.max(MIN_SPINE_FONT, Math.min(24, thickness * 0.5))
}
