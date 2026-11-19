// The dark mode. docs/TASKS.md Task 45 steps 4 and 5, and Task 46 step 5. docs/DESIGN.md sections 18.3, 18.5, and 18.11.
// The values: the dark values in the code are those of the table of section 18.11, each text color has its contrast,
// and the light values are those of commit b889e82, Task 44. The switch: the key bible-dark-mode in the storage, and
// the device, by the table of Task 46, in src/data/darkMode.ts and in the script of index.html.

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
    const meta = html.match(/<meta name="theme-color" content="([^"]+)" data-light="([^"]+)" data-dark="([^"]+)" \/>/)!
    // Task 46 step 5: data-light is the light value of --page, and data-dark is its dark value. The content at the
    // load is the light value. The light value is written #fff in src/index.css.
    expect(sameColor(meta[2], lightOf.get('--page')!)).toBe(true)
    expect(sameColor(meta[1], lightOf.get('--page')!)).toBe(true)
    expect(meta[3]).toBe(darkOf.get('--page'))
    const script = html.indexOf("localStorage.getItem('bible-dark-mode')")
    expect(script).toBeGreaterThan(html.indexOf('name="theme-color"'))
    expect(script).toBeLessThan(html.indexOf('<script type="module"'))
    expect(html.indexOf("matchMedia('(prefers-color-scheme: dark)')")).toBeGreaterThan(script)
    expect(html.indexOf("matchMedia('(prefers-color-scheme: dark)')")).toBeLessThan(html.indexOf('<script type="module"'))
    // The CSS selects the mode only by the attribute. The device is read in index.html and in src/data/darkMode.ts.
    expect(css).not.toMatch(/prefers-color-scheme/)
  })
})

/** Two hex colors are the same color: #fff and #FFFFFF are the same. */
function sameColor(a: string, b: string): boolean {
  const long = (c: string) => (c.length === 4 ? `#${[...c.slice(1)].map((x) => x + x).join('')}` : c).toLowerCase()
  return long(a) === long(b)
}

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

/** A storage that fails, as in a browser that blocks it. */
function failingStorage() {
  const fail = () => {
    throw new Error('blocked')
  }
  return { getItem: fail, setItem: fail, removeItem: fail }
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

type Change = (e: { matches: boolean }) => void

/** The device: the media feature prefers-color-scheme, with a change while the page is open. */
function fakeDevice(dark: boolean) {
  const changes = new Set<Change>()
  const query = {
    matches: dark,
    addEventListener: (_: string, fn: Change) => void changes.add(fn),
    removeEventListener: (_: string, fn: Change) => void changes.delete(fn),
  }
  const queries: string[] = []
  return {
    matchMedia: (q: string) => {
      queries.push(q)
      return query
    },
    change(to: boolean) {
      query.matches = to
      for (const fn of changes) fn({ matches: to })
    },
    queries,
  }
}

/** The module reads the storage and the device when it loads, so each test loads it again. */
async function load(storage: object, device: ReturnType<typeof fakeDevice>) {
  const doc = fakeDocument()
  vi.stubGlobal('localStorage', storage)
  vi.stubGlobal('matchMedia', device.matchMedia)
  vi.stubGlobal('document', doc)
  vi.resetModules()
  return { d: await import('./darkMode.ts'), doc }
}

/** The script of index.html, run on a fake page: the mode before the first paint. */
function runScript(storage: object, device: ReturnType<typeof fakeDevice>) {
  const code = html.match(/<script>([\s\S]*?)<\/script>/)![1]
  const doc = fakeDocument()
  new Function('localStorage', 'matchMedia', 'document', code)(storage, device.matchMedia, doc)
  return doc
}

afterEach(() => {
  vi.unstubAllGlobals()
})

// The table of docs/TASKS.md Task 46: the stored value, the device, and the mode.
const table: [Record<string, string>, boolean, boolean][] = [
  [{}, false, false],
  [{}, true, true],
  [{ 'bible-dark-mode': 'on' }, false, true],
  [{ 'bible-dark-mode': 'on' }, true, true],
  [{ 'bible-dark-mode': 'off' }, false, false],
  [{ 'bible-dark-mode': 'off' }, true, false],
]

describe('dark mode switch', () => {
  it('has the key bible-dark-mode, and reads the media feature of the device', async () => {
    const device = fakeDevice(false)
    const { d } = await load(memoryStorage(), device)
    expect(d.DARK_MODE_KEY).toBe('bible-dark-mode')
    expect(device.queries).toContain('(prefers-color-scheme: dark)')
  })

  for (const [stored, deviceDark, mode] of table) {
    const name = `${stored['bible-dark-mode'] ?? 'no value'}, ${deviceDark ? 'dark' : 'light'} device`

    it(`gives the mode of the table: ${name}`, async () => {
      expect((await load(memoryStorage(stored), fakeDevice(deviceDark))).d.getDarkMode()).toBe(mode)
    })

    it(`the script of index.html gives the same mode before the first paint: ${name}`, () => {
      const doc = runScript(memoryStorage(stored), fakeDevice(deviceDark))
      expect(doc.attributes.get('data-mode')).toBe(mode ? 'dark' : undefined)
      expect(doc.meta.content).toBe(mode ? '#1C1C1E' : '#ffffff')
    })
  }

  it('with no matchMedia in the browser, the script and the module give a light device', async () => {
    const code = html.match(/<script>([\s\S]*?)<\/script>/)![1]
    const doc = fakeDocument()
    new Function('localStorage', 'matchMedia', 'document', code)(memoryStorage(), undefined, doc)
    expect(doc.attributes.has('data-mode')).toBe(false)
    vi.stubGlobal('localStorage', memoryStorage())
    vi.stubGlobal('matchMedia', undefined)
    vi.resetModules()
    const d = await import('./darkMode.ts')
    expect(d.getDarkMode()).toBe(false)
    expect(d.followDevice()).toBeTypeOf('function')
  })

  it('stores no value at a visit on a dark device', async () => {
    const storage = memoryStorage()
    const device = fakeDevice(true)
    runScript(storage, device)
    const { d } = await load(storage, device)
    d.followDevice()
    expect(d.getDarkMode()).toBe(true)
    expect(storage.data.size).toBe(0)
  })

  it('with a storage that fails, follows the device, and a change of the switch still holds for the page', async () => {
    const device = fakeDevice(true)
    expect(runScript(failingStorage(), device).attributes.get('data-mode')).toBe('dark')
    const { d } = await load(failingStorage(), device)
    expect(d.getDarkMode()).toBe(true)
    d.followDevice()
    d.setDarkMode(false)
    expect(d.getDarkMode()).toBe(false)
    // The selection of the reader holds: a change of the device changes nothing.
    device.change(false)
    device.change(true)
    expect(d.getDarkMode()).toBe(false)
  })

  it('keeps the selection, and sets the attribute and the line theme-color at once', async () => {
    const storage = memoryStorage()
    const { d, doc } = await load(storage, fakeDevice(false))
    d.setDarkMode(true)
    expect(storage.data.get('bible-dark-mode')).toBe('on')
    expect(doc.attributes.get('data-mode')).toBe('dark')
    expect(doc.meta.content).toBe('#1C1C1E')
    d.setDarkMode(false)
    expect(storage.data.get('bible-dark-mode')).toBe('off')
    expect(doc.attributes.has('data-mode')).toBe(false)
    expect(doc.meta.content).toBe('#ffffff')
  })

  it('on a dark device with no value, a click stores "off", the reverse of the mode that shows', async () => {
    const storage = memoryStorage()
    const { d, doc } = await load(storage, fakeDevice(true))
    expect(d.getDarkMode()).toBe(true)
    // The switch calls setDarkMode with the reverse of the mode that shows, as src/reading/ReadingPage.tsx does.
    d.setDarkMode(!d.getDarkMode())
    expect(storage.data.get('bible-dark-mode')).toBe('off')
    expect(d.getDarkMode()).toBe(false)
    expect(doc.attributes.has('data-mode')).toBe(false)
  })

  it('with no value, follows a change of the device: the mode, the attribute, and the line theme-color', async () => {
    const storage = memoryStorage()
    const device = fakeDevice(false)
    const { d, doc } = await load(storage, device)
    d.followDevice()
    device.change(true)
    expect(d.getDarkMode()).toBe(true)
    expect(doc.attributes.get('data-mode')).toBe('dark')
    expect(doc.meta.content).toBe('#1C1C1E')
    device.change(false)
    expect(d.getDarkMode()).toBe(false)
    expect(doc.attributes.has('data-mode')).toBe(false)
    expect(doc.meta.content).toBe('#ffffff')
    expect(storage.data.size).toBe(0)
  })

  for (const value of ['on', 'off']) {
    it(`with the value "${value}", a change of the device changes nothing`, async () => {
      const startDark = value === 'off'
      const device = fakeDevice(startDark)
      const { d, doc } = await load(memoryStorage({ 'bible-dark-mode': value }), device)
      d.followDevice()
      device.change(!startDark)
      device.change(startDark)
      device.change(!startDark)
      expect(d.getDarkMode()).toBe(value === 'on')
      expect(doc.attributes.size).toBe(0)
      expect(doc.meta.content).toBe('#ffffff')
    })
  }

  it('with no value, stops following the device after a click', async () => {
    const device = fakeDevice(false)
    const { d } = await load(memoryStorage(), device)
    d.followDevice()
    d.setDarkMode(true)
    device.change(true)
    device.change(false)
    expect(d.getDarkMode()).toBe(true)
  })
})
