// passageVerses: the words of a passage. docs/TASKS.md Task 20 step 8, and Task 21 step 8: the parts
// of a verse, so that the pop-up can show the added words in italics.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { passageVerses } from './passage.ts'
import type { BookText } from './text.ts'

const root = join(import.meta.dirname, '..', '..')

describe('passageVerses', () => {
  it('gives the added words as parts of their verse', () => {
    const text: BookText = {
      id: 'test',
      name: 'Test',
      translation: 'King James Version',
      chapters: [
        {
          n: 1,
          xrefs: [],
          blocks: [
            { k: 'p', s: 'p', c: [{ v: 1 }, 'And darkness ', { a: 'was' }, ' upon the deep.', { v: 2 }, { a: 'It was' }, ' good.'] },
            { k: 'p', s: 'q1', c: [{ v: 3 }, 'Peace ', { a: 'be' }, ' to thee.'] },
          ],
        },
      ],
    }
    expect(passageVerses(text, { book: 'test', c: 1, v: 1, v2: 3 })).toEqual([
      { c: 1, v: 1, text: 'And darkness was upon the deep.', parts: [{ t: 'And darkness ' }, { t: 'was', a: true }, { t: ' upon the deep.' }] },
      { c: 1, v: 2, text: 'It was good.', parts: [{ t: 'It was', a: true }, { t: ' good.' }] },
      { c: 1, v: 3, text: 'Peace be to thee.', parts: [{ t: 'Peace ' }, { t: 'be', a: true }, { t: ' to thee.' }] },
    ])
  })

  it('gives one plain part for a verse with no added words, with one space between words', () => {
    const text: BookText = {
      id: 'test',
      name: 'Test',
      translation: 'Berean Standard Bible',
      chapters: [{ n: 1, xrefs: [], blocks: [{ k: 'p', s: 'q1', c: [{ v: 1 }, ' The LORD is my  shepherd; '] }, { k: 'p', s: 'q2', c: ['I shall not want. '] }] }],
    }
    expect(passageVerses(text, { book: 'test', c: 1, v: 1 })).toEqual([
      { c: 1, v: 1, text: 'The LORD is my shepherd; I shall not want.', parts: [{ t: 'The LORD is my shepherd; I shall not want.' }] },
    ])
  })

  it('gives Genesis 1:2 of the King James Version data with its added word', () => {
    const text = JSON.parse(readFileSync(join(root, 'public/data/text-kjv/genesis.json'), 'utf8')) as BookText
    const [verse] = passageVerses(text, { book: 'genesis', c: 1, v: 2 })
    expect(verse.text).toBe(
      'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
    )
    expect(verse.parts.filter((x) => x.a)).toEqual([{ t: 'was', a: true }])
    expect(verse.parts.map((x) => x.t).join('')).toBe(verse.text)
  })

  it('gives verse 1 of Psalm 23 of the King James Version data as the title and the verse', () => {
    const text = JSON.parse(readFileSync(join(root, 'public/data/text-kjv/psalms.json'), 'utf8')) as BookText
    const [verse] = passageVerses(text, { book: 'psalms', c: 23, v: 1 })
    expect(verse.text).toBe('A Psalm of David. The LORD is my shepherd; I shall not want.')
    expect(verse.parts.filter((x) => x.a)).toEqual([{ t: 'is', a: true }])
  })
})
