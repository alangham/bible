// Each color of the site has one name in one place. docs/TASKS.md Task 44 step 7, docs/DESIGN.md section 18.4.
// This test reads each .css, .ts, and .tsx file of src/, with no test file, and fails if a file has a color value
// outside these places:
// - the first :root block of src/index.css, which holds the names;
// - the dark rule :root[data-mode='dark'] of src/index.css, which holds the dark value of each name, Task 45;
// - src/data/books.ts, the one source of the ten group colors;
// - the SVG mask of src/map/MapDrawing.tsx, where white means "show" and black means "hide".
// It also fails if a file uses a name with var() that no file defines.

import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { GROUPS, groupProperty } from './data/books.ts'

const SRC = fileURLToPath(new URL('.', import.meta.url))

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name)
    if (e.isDirectory()) return files(path)
    return /\.(css|ts|tsx)$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) ? [path] : []
  })
}

const name = (path: string) => relative(SRC, path).replace(/\\/g, '/')

/** The text of a file with its comments taken out. A "//" after ":" is part of an address, not a comment. */
function withoutComments(text: string, css: boolean): string {
  const noBlocks = text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
  return css ? noBlocks : noBlocks.replace(/(^|[^:'"`])\/\/.*$/gm, '$1')
}

/** The dark rule of src/index.css: the one place of the dark values. docs/TASKS.md Task 45. */
const DARK_HEAD = ":root[data-mode='dark'] {"

/** The first :root block of src/index.css: the one place of the names. With a head, the block of the dark values. */
function rootBlock(css: string, head = ':root {'): { start: number; end: number } {
  const start = css.indexOf(head)
  return { start, end: css.indexOf('\n}', start) }
}

/** The CSS named colors. "transparent" and "currentColor" are not in the list: they paint no color of their own. */
const NAMED = new Set(
  (
    'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue ' +
    'chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey ' +
    'darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray ' +
    'darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen ' +
    'fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki ' +
    'lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen ' +
    'lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime ' +
    'limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue ' +
    'mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive ' +
    'olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum ' +
    'powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue ' +
    'slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke ' +
    'yellow yellowgreen'
  ).split(' '),
)

const HEX = /(?<![\w-])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![\w-])/g
const FUNCTION = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/g

/** The color values of a text, with their line numbers. */
function colorValues(text: string, css: boolean): string[] {
  const found: string[] = []
  text.split('\n').forEach((line, i) => {
    const at = (v: string) => found.push(`${i + 1}: ${v}`)
    for (const m of line.matchAll(HEX)) at(m[0])
    for (const m of line.matchAll(FUNCTION)) at(m[0])
    if (css) {
      // A named color in the value of a declaration: "property: value".
      const value = line.match(/^\s*[\w-]+\s*:\s*(.+?);?\s*$/)?.[1]
      for (const word of value?.match(/(?<![\w-])[a-z]+(?![\w-])/gi) ?? []) if (NAMED.has(word.toLowerCase())) at(word)
    } else {
      // A string or an attribute value that is a named color.
      for (const m of line.matchAll(/(['"`])\s*([a-zA-Z]+)\s*\1/g)) if (NAMED.has(m[2].toLowerCase())) at(m[2])
    }
  })
  return found
}

const all = files(SRC)
const css = readFileSync(join(SRC, 'index.css'), 'utf8')

describe('the colors of src/', () => {
  it('reads the files of src/', () => {
    expect(all.map(name)).toContain('index.css')
    expect(all.map(name)).toContain('map/MapDrawing.tsx')
    expect(all.some((f) => f.endsWith('.test.ts'))).toBe(false)
  })

  it('has no color value outside the one place of the names, src/data/books.ts, and the mask of the map', () => {
    const problems: string[] = []
    for (const path of all) {
      const file = name(path)
      if (file === 'data/books.ts') continue
      const isCss = file.endsWith('.css')
      let text = withoutComments(readFileSync(path, 'utf8'), isCss)
      if (file === 'index.css') {
        for (const head of [':root {', DARK_HEAD]) {
          const { start, end } = rootBlock(text, head)
          expect(start, head).toBeGreaterThanOrEqual(0)
          text = text.slice(0, start) + text.slice(start, end).replace(/[^\n]/g, ' ') + text.slice(end)
        }
      }
      if (file === 'map/MapDrawing.tsx') text = text.replace(/<mask[\s\S]*?<\/mask>/, (m) => m.replace(/[^\n]/g, ' '))
      for (const v of colorValues(text, isCss)) problems.push(`${file}:${v}`)
    }
    expect(problems).toEqual([])
  })

  it('finds a color value that is outside the one place: the test can fail', () => {
    expect(colorValues('.x {\n  color: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  background: white;\n}', true)).toEqual([
      '2: #fff',
      '3: rgba(',
      '4: white',
    ])
    expect(colorValues('<rect fill="#000" />\nconst a = \'black\'\nconst b = groupOf(book).color', false)).toEqual(['1: #000', '2: black'])
    expect(colorValues('white-space: nowrap;\nstyle={{ color: color(s) }}\nhref="#/book/john/3"', false)).toEqual([])
  })

  it('has the mask of the map with its white and black, and a comment that says what they mean', () => {
    const drawing = readFileSync(join(SRC, 'map/MapDrawing.tsx'), 'utf8')
    const mask = drawing.match(/<mask[\s\S]*?<\/mask>/)![0]
    expect(colorValues(mask, false)).toEqual(expect.arrayContaining([expect.stringContaining('#fff'), expect.stringContaining('#000')]))
    expect(mask).toMatch(/white means "show" and the black means "hide"/)
  })

  it('defines each name that a file uses with var()', () => {
    const defined = new Set<string>(GROUPS.map(groupProperty))
    const used = new Map<string, string>()
    for (const path of all) {
      const text = withoutComments(readFileSync(path, 'utf8'), path.endsWith('.css'))
      for (const m of text.matchAll(/(?<![\w-])(--[\w-]+)\s*:/g)) defined.add(m[1])
      for (const m of text.matchAll(/['"](--[\w-]+)['"]\s*:/g)) defined.add(m[1])
      for (const m of text.matchAll(/setProperty\(\s*['"`](--[\w-]+)/g)) defined.add(m[1])
      for (const m of text.matchAll(/var\((--[\w-]+)/g)) if (!used.has(m[1])) used.set(m[1], name(path))
    }
    // groupVar() builds var(--group-...) from groupProperty(); the names of the groups are in the set above.
    used.delete('--group-')
    expect([...used].filter(([n]) => !defined.has(n)).map(([n, file]) => `${file}: ${n}`)).toEqual([])
  })

  it('names each color of the look on the root element, and the ten group colors from src/data/books.ts', () => {
    const { start, end } = rootBlock(css)
    const names = [...css.slice(start, end).matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((m) => m[1])
    expect(names).toEqual(expect.arrayContaining(['--page', '--ink', '--ink-secondary', '--line', '--red-letters', '--on-group', '--map-land']))
    expect(new Set(names).size).toBe(names.length)
    expect(GROUPS.map(groupProperty)).toEqual([
      '--group-law',
      '--group-history',
      '--group-poetry-wisdom',
      '--group-major-prophets',
      '--group-minor-prophets',
      '--group-gospels',
      '--group-history-acts',
      '--group-letters-of-paul',
      '--group-general-letters',
      '--group-prophecy',
    ])
  })
})
