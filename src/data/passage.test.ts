// passageVerses: the words of a passage. docs/TASKS.md Task 20 step 8.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { passageVerses } from './passage.ts'
import type { BookText } from './text.ts'

const root = join(import.meta.dirname, '..', '..')

describe('passageVerses', () => {
  it('includes the added words in the words of their verse', () => {
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
      { c: 1, v: 1, text: 'And darkness was upon the deep.' },
      { c: 1, v: 2, text: 'It was good.' },
      { c: 1, v: 3, text: 'Peace be to thee.' },
    ])
  })

  it('gives Genesis 1:2 of the King James Version data with its added word', () => {
    const text = JSON.parse(readFileSync(join(root, 'public/data/text-kjv/genesis.json'), 'utf8')) as BookText
    expect(passageVerses(text, { book: 'genesis', c: 1, v: 2 })).toEqual([
      {
        c: 1,
        v: 2,
        text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
      },
    ])
  })

  it('gives verse 1 of Psalm 23 of the King James Version data as the title and the verse', () => {
    const text = JSON.parse(readFileSync(join(root, 'public/data/text-kjv/psalms.json'), 'utf8')) as BookText
    expect(passageVerses(text, { book: 'psalms', c: 23, v: 1 })).toEqual([{ c: 23, v: 1, text: 'A Psalm of David. The LORD is my shepherd; I shall not want.' }])
  })
})
