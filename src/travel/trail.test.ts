// The trail. docs/DESIGN.md section 7.7: the trail changes only by travel, a selected stop removes the
// stops after it, and the wall clears it. docs/TASKS.md Task 23 step 8.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { addTravel, clearTrail, goToStop, trailNow } from './trail.ts'

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

/** The module reads the storage when it loads, so a test of the storage loads it again. */
async function load() {
  vi.resetModules()
  return import('./trail.ts')
}

const MATTHEW_1 = { book: 'matthew', c: 1 }
const ROMANS_1_16 = { book: 'romans', c: 1, v: 16 }
const MARK_8_38 = { book: 'mark', c: 8, v: 38 }

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('trail', () => {
  beforeEach(() => clearTrail())

  it('adds the passage here and the passage there', () => {
    addTravel({ book: 'hebrews', c: 9, v: 20 }, { book: 'exodus', c: 24, v: 8 })
    expect(trailNow()).toEqual({ stops: [{ book: 'hebrews', c: 9, v: 20 }, { book: 'exodus', c: 24, v: 8 }] })
  })

  it('does not add the stop that the reader is at again', () => {
    addTravel({ book: 'hebrews', c: 9, v: 20 }, { book: 'exodus', c: 24, v: 8 })
    addTravel({ book: 'exodus', c: 24, v: 8 }, { book: 'hebrews', c: 9, v: 20 })
    expect(trailNow().stops).toHaveLength(3)
    // A read-with entry has no verse: the chapter of the last stop is not added again.
    addTravel({ book: 'hebrews', c: 9 }, { book: 'leviticus', c: 16 })
    expect(trailNow().stops.map((s) => `${s.book} ${s.c}:${s.v ?? ''}`)).toEqual(['hebrews 9:20', 'exodus 24:8', 'hebrews 9:20', 'leviticus 16:'])
  })

  it('after "Back", a travel from a different verse of the same chapter adds that verse', () => {
    addTravel({ book: 'hebrews', c: 9, v: 20 }, { book: 'exodus', c: 24, v: 8 })
    goToStop(0)
    addTravel({ book: 'hebrews', c: 9, v: 28 }, { book: 'isaiah', c: 53, v: 12 })
    expect(trailNow()).toEqual({
      stops: [{ book: 'hebrews', c: 9, v: 20 }, { book: 'hebrews', c: 9, v: 28 }, { book: 'isaiah', c: 53, v: 12 }],
    })
  })

  it('goToStop removes the stops after the selected stop', () => {
    addTravel(MATTHEW_1, ROMANS_1_16)
    addTravel(ROMANS_1_16, MARK_8_38)
    expect(trailNow().stops).toEqual([MATTHEW_1, ROMANS_1_16, MARK_8_38])
    goToStop(1)
    expect(trailNow().stops).toEqual([MATTHEW_1, ROMANS_1_16])
    goToStop(0)
    expect(trailNow().stops).toEqual([MATTHEW_1])
  })

  it('goToStop on the last stop removes no stop', () => {
    addTravel(MATTHEW_1, ROMANS_1_16)
    addTravel(ROMANS_1_16, MARK_8_38)
    goToStop(2)
    expect(trailNow().stops).toEqual([MATTHEW_1, ROMANS_1_16, MARK_8_38])
  })

  it('a travel from a place that is not the last stop adds that place and then the target', () => {
    addTravel(MATTHEW_1, ROMANS_1_16)
    // The reader went to Romans 3 by the chapter grid, and travels from there.
    addTravel({ book: 'romans', c: 3, v: 23 }, MARK_8_38)
    expect(trailNow().stops).toEqual([MATTHEW_1, ROMANS_1_16, { book: 'romans', c: 3, v: 23 }, MARK_8_38])
  })
})

describe('trail storage', () => {
  it('keeps the stops in the storage of the browser tab, with no field "at"', async () => {
    const storage = memoryStorage()
    vi.stubGlobal('sessionStorage', storage)
    const t = await load()
    t.addTravel(MATTHEW_1, ROMANS_1_16)
    expect(JSON.parse(storage.data.get('bible-trail')!)).toEqual({ stops: [MATTHEW_1, ROMANS_1_16] })
    const again = await load()
    expect(again.trailNow().stops).toEqual([MATTHEW_1, ROMANS_1_16])
  })

  it('reads a stored trail of the old form with three stops and "at" 0 as one stop', async () => {
    vi.stubGlobal('sessionStorage', memoryStorage({ 'bible-trail': JSON.stringify({ stops: [MATTHEW_1, ROMANS_1_16, MARK_8_38], at: 0 }) }))
    const t = await load()
    expect(t.trailNow().stops).toEqual([MATTHEW_1])
  })

  it('reads a stored trail of the old form as the stops up to and including the stop "at"', async () => {
    vi.stubGlobal('sessionStorage', memoryStorage({ 'bible-trail': JSON.stringify({ stops: [MATTHEW_1, ROMANS_1_16, MARK_8_38], at: 1 }) }))
    const t = await load()
    expect(t.trailNow().stops).toEqual([MATTHEW_1, ROMANS_1_16])
  })

  it('clearTrail leaves no stop in the storage', async () => {
    const storage = memoryStorage()
    vi.stubGlobal('sessionStorage', storage)
    const t = await load()
    t.addTravel(MATTHEW_1, ROMANS_1_16)
    expect(storage.data.has('bible-trail')).toBe(true)
    t.clearTrail()
    expect(t.trailNow().stops).toEqual([])
    expect(storage.data.has('bible-trail')).toBe(false)
    const again = await load()
    expect(again.trailNow().stops).toEqual([])
  })

  it('clearTrail removes a stored trail that did not read', async () => {
    const storage = memoryStorage({ 'bible-trail': 'not a trail' })
    vi.stubGlobal('sessionStorage', storage)
    const t = await load()
    expect(t.trailNow().stops).toEqual([])
    t.clearTrail()
    expect(storage.data.has('bible-trail')).toBe(false)
  })
})
