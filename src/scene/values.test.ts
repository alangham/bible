// The scene values. docs/TASKS.md Task 5 steps 8 and 12, docs/DESIGN.md sections 4.3 and 4.4.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contrastRatio } from '../data/contrast.ts'
import { GROUPS, type Book } from '../data/books.ts'
import { over, rgbToHsl } from './color.ts'
import {
  PHASE_POSITION,
  SCENE_OF_GROUP,
  colorsBehindText,
  dayPosition,
  phaseOf,
  sceneValues,
  valuesAt,
  type Phase,
  type SceneId,
} from './values.ts'

const books = JSON.parse(readFileSync(join(import.meta.dirname, '../../public/data/books.json'), 'utf8')) as Book[]
const PHASES: Phase[] = ['dawn', 'day', 'dusk', 'night']

describe('scene values', () => {
  it('gives the same values for the same book and chapter', () => {
    for (const book of books) {
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        expect(sceneValues(book, chapter)).toEqual(sceneValues(book, chapter))
      }
    }
  })

  it('gives different shifts to different chapters', () => {
    const genesis = books[0]
    const all = new Set(Array.from({ length: genesis.chapters }, (_, i) => sceneValues(genesis, i + 1).shifts.join(',')))
    expect(all.size).toBeGreaterThan(40)
  })

  it('is dawn at chapter 1, day at the middle chapter, and night at the last chapter of a book with more than three chapters', () => {
    const long = books.filter((b) => b.chapters > 3)
    expect(long.length).toBeGreaterThan(0)
    for (const book of long) {
      expect(sceneValues(book, 1).phase, book.id).toBe('dawn')
      expect(sceneValues(book, Math.ceil(book.chapters / 2)).phase, book.id).toBe('day')
      expect(sceneValues(book, Math.floor(book.chapters / 2) + 1).phase, book.id).toBe('day')
      expect(sceneValues(book, book.chapters).phase, book.id).toBe('night')
      expect(sceneValues(book, book.chapters - 1).phase, book.id).not.toBe('night')
    }
  })

  it('is day for a book with one chapter', () => {
    for (const book of books.filter((b) => b.chapters === 1)) expect(sceneValues(book, 1).phase).toBe('day')
  })

  it('moves through the day in order, without a jump back', () => {
    const order = { dawn: 0, day: 1, dusk: 2, night: 3 }
    for (let n = 2; n <= 150; n++) {
      let last = -1
      for (let c = 1; c <= n; c++) {
        const now = order[phaseOf(dayPosition(c, n))]
        expect(now).toBeGreaterThanOrEqual(last)
        last = now
      }
    }
  })

  it('uses the scene of the category for each group', () => {
    const scenes = new Set(Object.values(SCENE_OF_GROUP))
    expect(scenes.size).toBe(9)
    expect(SCENE_OF_GROUP['History (Acts)']).toBe(SCENE_OF_GROUP.History)
  })
})

describe('text contrast on the scene', () => {
  // One group for each of the nine scenes. Acts uses the History scene with its own cloth: test both.
  const cases: { scene: SceneId; cloth: string; group: string }[] = GROUPS.map((g) => ({
    scene: SCENE_OF_GROUP[g.name],
    cloth: g.cloth,
    group: g.name,
  }))

  it('is 4.5 to 1 or more for each of the nine scenes at dawn, day, dusk, and night', () => {
    const results: string[] = []
    let count = 0
    for (const c of cases) {
      for (const phase of PHASES) {
        const v = valuesAt(c.scene, c.cloth, PHASE_POSITION[phase], 1)
        expect(v.phase).toBe(phase)
        // Measure again here, from the colors: the text on the veil on each color that can be behind it.
        const worst = Math.min(...colorsBehindText(v.palette).map((bg) => contrastRatio(v.text.ink, over(v.text.veil, v.text.veilAlpha, bg))))
        results.push(`${c.group} ${phase}: ${worst.toFixed(2)}`)
        expect(worst, `${c.group} at ${phase}`).toBeGreaterThanOrEqual(4.5)
        count++
      }
    }
    // 10 groups: the nine scenes, and the History scene a second time with the cloth of Acts.
    expect(count).toBe(40)
    console.log(results.join('\n'))
  })

  it('is 4.5 to 1 or more at each chapter position, not only at the four named times', () => {
    for (const c of cases) {
      for (let i = 0; i <= 100; i++) {
        const v = valuesAt(c.scene, c.cloth, i / 100, 1)
        expect(v.text.contrast, `${c.group} at ${i / 100}`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('uses dark text on a light scene and light text on a dark scene', () => {
    for (const c of cases) {
      expect(valuesAt(c.scene, c.cloth, PHASE_POSITION.day, 1).text.ink, c.group).toBe('#2A1E12')
      expect(valuesAt(c.scene, c.cloth, PHASE_POSITION.night, 1).text.ink, c.group).toBe('#F7ECD3')
    }
  })
})

describe('the water of the Gospels lake (POLISH.md item 7)', () => {
  const gospels = GROUPS.find((g) => g.name === 'Gospels')!.cloth

  it('is blue at dawn, day, dusk, and night', () => {
    for (const phase of PHASES) {
      const v = valuesAt('lake', gospels, PHASE_POSITION[phase], 1)
      expect(v.palette.water, phase).toBeDefined()
      const [hue, sat] = rgbToHsl(v.palette.water!)
      expect(hue, phase).toBeGreaterThan(190)
      expect(hue, phase).toBeLessThan(235)
      expect(sat, phase).toBeGreaterThan(0.15)
    }
  })

  it('is behind the text in the contrast check of the lake, and only the lake has it', () => {
    const v = valuesAt('lake', gospels, 0.5, 1)
    expect(colorsBehindText(v.palette)).toContain(v.palette.water)
    expect(valuesAt('stream', gospels, 0.5, 1).palette.water).toBeUndefined()
  })
})
