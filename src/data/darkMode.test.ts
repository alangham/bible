// The dark mode. docs/TASKS.md Task 45 steps 4 and 5, docs/DESIGN.md sections 18.3, 18.5, and 18.11.
// The values: the dark values in the code are those of the table of section 18.11, each text color has its contrast,
// and the light values are those of commit b889e82, Task 44. The switch: the key bible-dark-mode in the storage.

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DARK_GROUP_COLORS, GROUPS, groupColorsCss, groupProperty } from './books.ts'
import { contrastRatio } from './contrast.ts'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')

/** The names and values of a block of src/index.css, in their order, with the values as written. */
function block(head: string): [string, string][] {
  const start = css.indexOf(head)
  expect(start, head).toBeGreaterThanOrEqual(0)
  const text = css.slice(start, css.indexOf('\n}', start)).replace(/\/\*[\s\S]*?\*\//g, '')
  return [...text.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()])
}

const light = block(':root {')
const dark = block(":root[data-mode='dark'] {")
const lightOf = new Map(light)
const darkOf = new Map(dark)
const sha256 = (lines: string[]) => createHash('sha256').update(lines.map((l) => `${l}\n`).join('')).digest('hex')

describe('the dark values', () => {
  it('give each of the 45 color names of the light mode a dark value, and add no name', () => {
    expect(dark).toHaveLength(45)
    // --band-radius is the one name of the first :root block that is not a color.
    expect(dark.map(([n]) => n).sort()).toEqual(light.map(([n]) => n).filter((n) => n !== '--band-radius').sort())
  })

  it('are those of the table of docs/DESIGN.md section 18.11: the SHA-256 of the 55 lines', () => {
    const lines = [...dark.map(([n, v]) => `${n}=${v}`), ...GROUPS.map((g) => `${groupProperty(g)}=${DARK_GROUP_COLORS[g.name]}`)]
    expect(lines).toHaveLength(55)
    expect(sha256(lines)).toBe('3ae78db0ebd1487092306268eeffbaf7b338fd6de9c07d82b2fcfaefc9069121')
  })

  it('leave the light values of the 45 names and of the ten groups as in commit b889e82', () => {
    // The 55 lines "name=light value", in the order of section 18.11. The hash is that of src/index.css and
    // src/data/books.ts of commit b889e82.
    const lines = [...dark.map(([n]) => `${n}=${lightOf.get(n)}`), ...GROUPS.map((g) => `${groupProperty(g)}=${g.color}`)]
    expect(sha256(lines)).toBe('cf072f1b2e12ef67b0cb073870ae74482598d18711648791f0c8210b174a9eae')
  })

  it('give each dark group color a contrast of 4.5 to 1 or more on the page, and on the page with the hover', () => {
    for (const g of GROUPS) {
      const color = DARK_GROUP_COLORS[g.name]
      // #1C1C1E is the dark page. #272729 is the dark page under the hover, white at 5%.
      expect(contrastRatio(color, '#1C1C1E'), g.name).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(color, '#272729'), g.name).toBeGreaterThanOrEqual(4.5)
    }
    expect(darkOf.get('--page')).toBe('#1C1C1E')
  })

  it('give the ink, the secondary ink, and the red letters a contrast of 4.5 to 1 or more', () => {
    const page = darkOf.get('--page')!
    const panel = darkOf.get('--panel')!
    expect(panel).toBe('#2C2C2E')
    for (const name of ['--ink', '--ink-secondary', '--red-letters']) expect(contrastRatio(darkOf.get(name)!, page), name).toBeGreaterThanOrEqual(4.5)
    for (const name of ['--ink', '--ink-secondary']) expect(contrastRatio(darkOf.get(name)!, panel), name).toBeGreaterThanOrEqual(4.5)
  })

  it('make the group rules: the light value on :root, and the dark value for the attribute', () => {
    const rules = groupColorsCss()
    expect(rules).toContain(':root {\n  --group-law: #C2255C;')
    expect(rules).toContain(":root[data-mode='dark'] {\n  --group-law: #F26A90;")
    for (const g of GROUPS) expect(rules).toContain(`  ${groupProperty(g)}: ${DARK_GROUP_COLORS[g.name]};`)
  })

  it('set color-scheme: dark only in the dark mode', () => {
    const start = css.indexOf(":root[data-mode='dark'] {")
    const darkRule = css.slice(start, css.indexOf('\n}', start))
    expect(darkRule).toContain('color-scheme: dark;')
    // One declaration in the CSS, comments not included: the light mode has no color-scheme.
    expect(css.replace(/\/\*[\s\S]*?\*\//g, '').match(/color-scheme/g)).toHaveLength(1)
  })

  it('give the line theme-color in index.html the page color of each mode, and a script before the module', () => {
    expect(html).toMatch(/<meta name="theme-color" content="#ffffff" data-light="#ffffff" data-dark="#1C1C1E" \/>/)
    expect(darkOf.get('--page')).toBe('#1C1C1E')
    const script = html.indexOf("localStorage.getItem('bible-dark-mode') === 'on'")
    expect(script).toBeGreaterThan(html.indexOf('name="theme-color"'))
    expect(script).toBeLessThan(html.indexOf('<script type="module"'))
    expect(html).not.toMatch(/prefers-color-scheme/)
  })
})

/** A storage in memory, as the browser gives it. */
function memoryStorage(start: Record<string, string> = {}) {
  const data = new Map(Object.entries(start))
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    data,
  }
}

/** The root element and the line theme-color, as the page gives them. */
function fakeDocument() {
  const attributes = new Map<string, string>()
  const meta = { content: '#ffffff', dataset: { light: '#ffffff', dark: '#1C1C1E' } as Record<string, string> }
  return {
    documentElement: {
      setAttribute: (k: string, v: string) => void attributes.set(k, v),
      removeAttribute: (k: string) => void attributes.delete(k),
    },
    querySelector: (s: string) => (s === 'meta[name="theme-color"]' ? meta : null),
    attributes,
    meta,
  }
}

/** The module reads the storage when it loads, so each test loads it again. */
async function load() {
  vi.resetModules()
  return import('./darkMode.ts')
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('dark mode switch', () => {
  it('is off at the first visit, with no value for the key', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    const d = await load()
    expect(d.DARK_MODE_KEY).toBe('bible-dark-mode')
    expect(d.getDarkMode()).toBe(false)
  })

  it('is on with the value "on", and off with the value "off"', async () => {
    vi.stubGlobal('localStorage', memoryStorage({ 'bible-dark-mode': 'on' }))
    expect((await load()).getDarkMode()).toBe(true)
    vi.stubGlobal('localStorage', memoryStorage({ 'bible-dark-mode': 'off' }))
    expect((await load()).getDarkMode()).toBe(false)
  })

  it('keeps the selection, and sets the attribute and the line theme-color at once', async () => {
    const storage = memoryStorage()
    const doc = fakeDocument()
    vi.stubGlobal('localStorage', storage)
    vi.stubGlobal('document', doc)
    const d = await load()
    d.setDarkMode(true)
    expect(storage.data.get('bible-dark-mode')).toBe('on')
    expect(doc.attributes.get('data-mode')).toBe('dark')
    expect(doc.meta.content).toBe('#1C1C1E')
    d.setDarkMode(false)
    expect(storage.data.get('bible-dark-mode')).toBe('off')
    expect(doc.attributes.has('data-mode')).toBe(false)
    expect(doc.meta.content).toBe('#ffffff')
  })

  it('is off when the storage fails, and a change still holds for the page', async () => {
    const fail = () => {
      throw new Error('blocked')
    }
    vi.stubGlobal('localStorage', { getItem: fail, setItem: fail })
    vi.stubGlobal('document', fakeDocument())
    const d = await load()
    expect(d.getDarkMode()).toBe(false)
    d.setDarkMode(true)
    expect(d.getDarkMode()).toBe(true)
  })
})
