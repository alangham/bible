import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { NARROW_LIMIT_PX, selectLayout } from './screenLayout.ts'

describe('selectLayout', () => {
  it('gives the narrow layout below 900 px', () => {
    expect(NARROW_LIMIT_PX).toBe(900)
    expect(selectLayout(390)).toBe('narrow')
    expect(selectLayout(767)).toBe('narrow')
    expect(selectLayout(834)).toBe('narrow')
    expect(selectLayout(899)).toBe('narrow')
  })

  it('gives the wide layout at 900 px or more', () => {
    expect(selectLayout(900)).toBe('wide')
    expect(selectLayout(1440)).toBe('wide')
  })
})

describe('one function decides the layout', () => {
  // docs/DESIGN.md section 4.1: no other code tests the screen width.
  const srcDir = fileURLToPath(new URL('.', import.meta.url))
  const WIDTH_TEST = /@media[^{]*width|innerWidth|outerWidth|screen\.width|matchMedia\([^)]*width/

  it('has no screen width test outside src/screenLayout.ts', () => {
    const offenders = readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.(ts|tsx|css)$/.test(f) && !/\.test\.tsx?$/.test(f))
      .map((f) => relative(srcDir, join(srcDir, f)).replaceAll('\\', '/'))
      .filter((f) => f !== 'screenLayout.ts')
      .filter((f) => WIDTH_TEST.test(readFileSync(join(srcDir, f), 'utf8')))
    expect(offenders).toEqual([])
  })
})
