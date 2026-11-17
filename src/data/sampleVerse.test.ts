// The line of each translation, and the verse of the section "The three translations" of the Sources page.
// docs/DESIGN.md sections 14.2 and 14.4, docs/TASKS.md Task 33 step 6.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { passageVerses } from './passage.ts'
import { SAMPLE_PARTS, SAMPLE_VERSE } from './sampleVerse.ts'
import type { BookText } from './text.ts'
import { TRANSLATIONS } from './translation.ts'

const root = join(import.meta.dirname, '..', '..')

/** The folder of the data files of each translation. */
const FOLDER = { bsb: 'text', kjv: 'text-kjv', web: 'text-web' } as const

describe('the line of each translation', () => {
  it('each row of TRANSLATIONS has a line, and the three lines are the words of docs/DESIGN.md section 14.2', () => {
    expect(TRANSLATIONS.map((t) => [t.id, t.line])).toEqual([
      ['bsb', 'Today’s English, in a literary style. Between literal and thought for thought.'],
      ['kjv', 'Older English, in the text of 1769: thee, thou, believeth.'],
      ['web', 'Today’s English, in an informal, spoken style. A fairly literal translation.'],
    ])
    // The apostrophe of "Today’s" is U+2019.
    for (const t of [TRANSLATIONS[0], TRANSLATIONS[2]]) expect(t.line).toContain('Today’s')
  })
})

describe('1 Corinthians 13:4 on the Sources page', () => {
  it('is the verse of docs/DESIGN.md section 14.4', () => {
    expect(SAMPLE_VERSE).toEqual({ book: '1-corinthians', c: 13, v: 4 })
  })

  for (const t of TRANSLATIONS) {
    it(`has the words and the added words of the data file of the ${t.name}`, () => {
      const text = JSON.parse(readFileSync(join(root, 'public/data', FOLDER[t.id], `${SAMPLE_VERSE.book}.json`), 'utf8')) as BookText
      const verses = passageVerses(text, SAMPLE_VERSE)
      expect(verses).toHaveLength(1)
      // The same parts: the same words, the same added words, and no words-of-Jesus mark.
      expect(SAMPLE_PARTS[t.id]).toEqual(verses[0].parts)
      expect(verses[0].parts.some((p) => p.j)).toBe(false)
    })
  }

  it('has the added word "and" in the King James Version only', () => {
    expect(SAMPLE_PARTS.kjv.filter((p) => p.a).map((p) => p.t)).toEqual(['and'])
    expect(SAMPLE_PARTS.bsb.some((p) => p.a)).toBe(false)
    expect(SAMPLE_PARTS.web.some((p) => p.a)).toBe(false)
  })
})
