// The trail. docs/DESIGN.md section 7.7: the trail changes only by travel.

import { beforeEach, describe, expect, it } from 'vitest'
import { addTravel, clearTrail, goToStop, trailNow } from './trail.ts'

describe('trail', () => {
  beforeEach(() => clearTrail())

  it('adds the passage here and the passage there', () => {
    addTravel({ book: 'hebrews', c: 9, v: 20 }, { book: 'exodus', c: 24, v: 8 })
    expect(trailNow()).toEqual({ stops: [{ book: 'hebrews', c: 9, v: 20 }, { book: 'exodus', c: 24, v: 8 }], at: 1 })
  })

  it('does not add the stop that the reader is at again', () => {
    addTravel({ book: 'hebrews', c: 9, v: 20 }, { book: 'exodus', c: 24, v: 8 })
    addTravel({ book: 'exodus', c: 24, v: 8 }, { book: 'hebrews', c: 9, v: 20 })
    expect(trailNow().stops).toHaveLength(3)
    // A read-with entry has no verse: the chapter of the current stop is not added again.
    addTravel({ book: 'hebrews', c: 9 }, { book: 'leviticus', c: 16 })
    expect(trailNow().stops.map((s) => `${s.book} ${s.c}:${s.v ?? ''}`)).toEqual(['hebrews 9:20', 'exodus 24:8', 'hebrews 9:20', 'leviticus 16:'])
  })

  it('after "Back", a travel from a different verse of the same chapter adds that verse, and drops the later stops', () => {
    addTravel({ book: 'hebrews', c: 9, v: 20 }, { book: 'exodus', c: 24, v: 8 })
    goToStop(0)
    addTravel({ book: 'hebrews', c: 9, v: 28 }, { book: 'isaiah', c: 53, v: 12 })
    expect(trailNow()).toEqual({
      stops: [{ book: 'hebrews', c: 9, v: 20 }, { book: 'hebrews', c: 9, v: 28 }, { book: 'isaiah', c: 53, v: 12 }],
      at: 2,
    })
  })
})
