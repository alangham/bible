// The fit rule of the wall: each book name fills the width of its column.
// docs/DESIGN.md section 7.4, docs/TASKS.md Task 12 step 5. The values are those of the
// function `fit` in docs/prototype/index.html.

/** The font size at which a name is measured, in px. */
export const MEASURE_PX = 100
/** The largest font size is the column width divided by this number. A short name, such as "JOB", stops here. */
export const CAP_RATIO = 3.7
/** Above the largest font size, the letters spread. The space between letters is this part of the font size at most. */
export const MAX_SPACING = 0.3
/** The line height is this part of the font size. */
export const LINE_RATIO = 1.03
/** Each book name link is this high or more, in px. docs/DESIGN.md section 7.3. */
export const MIN_LINE_PX = 24

export interface NameFit {
  fontSize: number
  letterSpacing: number
  lineHeight: number
}

/**
 * The size of one book name.
 * @param measuredWidth the width of the name in capitals at MEASURE_PX, with no letter spacing.
 * @param letters the number of characters in the name, spaces included.
 * @param columnWidth the width that the name fills, in px.
 */
export function fitName(measuredWidth: number, letters: number, columnWidth: number): NameFit {
  const w = Math.max(measuredWidth, 1)
  const gaps = Math.max(letters - 1, 1)
  let fontSize = (MEASURE_PX * columnWidth) / w
  let letterSpacing = 0
  const cap = columnWidth / CAP_RATIO
  if (fontSize > cap) {
    // Limit 1: the size stops at the cap, and the letters spread to fill the width.
    fontSize = cap
    letterSpacing = (columnWidth - (w * cap) / MEASURE_PX) / gaps
    if (letterSpacing > MAX_SPACING * fontSize) {
      // Limit 2: the letters do not spread more than MAX_SPACING. The size grows instead.
      fontSize = columnWidth / (w / MEASURE_PX + gaps * MAX_SPACING)
      letterSpacing = MAX_SPACING * fontSize
    }
  }
  return { fontSize, letterSpacing, lineHeight: Math.max(fontSize * LINE_RATIO, MIN_LINE_PX) }
}

/** The font of a book name at the measure size. Inter ExtraBold, docs/DESIGN.md section 7.3. */
export const NAME_FONT = `800 ${MEASURE_PX}px Inter`

/** Measures the names in capitals at MEASURE_PX in the font of the wall. */
export function measureNames(names: string[]): Map<string, number> {
  const widths = new Map<string, number>()
  const ctx = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d')
  for (const name of names) {
    const caps = name.toUpperCase()
    if (ctx) {
      ctx.font = NAME_FONT
      widths.set(name, ctx.measureText(caps).width)
    } else {
      // No canvas: an estimate, so that the wall still shows.
      widths.set(name, caps.length * 0.7 * MEASURE_PX)
    }
  }
  return widths
}
