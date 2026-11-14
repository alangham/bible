// The fonts and the ink of the cover. This module does not import three.js, so that the cover
// page can use it before the 3D code loads. docs/TASKS.md Task 9 step 5.

import type { Group } from '../data/books.ts'
import { contrastRatio } from '../data/contrast.ts'

export const GOLD = '#F3DDA0'
export const COVER_TITLE_FONT = '"Cormorant Garamond", Georgia, serif'
export const COVER_LABEL_FONT = '"Newsreader", Georgia, serif'

/**
 * Mockup D2 shows gold on the Law cloth. Gold is too light on a pale cloth,
 * for example the Gospels cream. There the text color of the group is used.
 */
export function coverInk(group: Group): string {
  return contrastRatio(GOLD, group.cloth) >= 4.5 ? GOLD : group.text
}
