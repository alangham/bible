import { describe, expect, it } from 'vitest'
import { CAP_RATIO, fitName, MAX_SPACING, MEASURE_PX, MIN_LINE_PX } from './fit.ts'

/** The width of the name at its fit, without the spacing after the last letter. */
const filled = (measured: number, letters: number, f: { fontSize: number; letterSpacing: number }) =>
  (measured * f.fontSize) / MEASURE_PX + (letters - 1) * f.letterSpacing

describe('fitName: the fit rule of the wall (docs/DESIGN.md section 7.4)', () => {
  it('sizes a long name to the column width, with no letter spacing', () => {
    const f = fitName(500, 10, 250)
    expect(f.fontSize).toBeCloseTo(50)
    expect(f.letterSpacing).toBe(0)
  })

  it('stops the size at the cap and spreads the letters of a shorter name', () => {
    const f = fitName(300, 4, 370)
    expect(f.fontSize).toBeCloseTo(370 / CAP_RATIO)
    expect(f.letterSpacing).toBeGreaterThan(0)
    expect(f.letterSpacing).toBeLessThanOrEqual(MAX_SPACING * f.fontSize)
    expect(filled(300, 4, f)).toBeCloseTo(370)
  })

  it('grows a very short name, such as JOB, when the letters would spread too far', () => {
    const f = fitName(200, 3, 370)
    expect(f.fontSize).toBeGreaterThan(370 / CAP_RATIO)
    expect(f.letterSpacing).toBeCloseTo(MAX_SPACING * f.fontSize)
    expect(filled(200, 3, f)).toBeCloseTo(370)
  })

  it('fills the column width in each case', () => {
    for (const [measured, letters] of [[900, 15], [520, 7], [310, 4], [180, 3]]) {
      for (const width of [168, 215, 350]) expect(filled(measured, letters, fitName(measured, letters, width))).toBeCloseTo(width)
    }
  })

  it('gives each name a line of 24 px or more', () => {
    const f = fitName(1200, 15, 168)
    expect(f.fontSize * 1.03).toBeLessThan(MIN_LINE_PX)
    expect(f.lineHeight).toBe(MIN_LINE_PX)
    expect(fitName(500, 10, 250).lineHeight).toBeCloseTo(50 * 1.03)
  })
})
