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

  it('gives the words of the words-of-Jesus mark in Mark 12:37 of the King James Version data as words of the verse, with j (Tasks 26 and 27)', () => {
    const text = JSON.parse(readFileSync(join(root, 'public/data/text-kjv/mark.json'), 'utf8')) as BookText
    const [verse] = passageVerses(text, { book: 'mark', c: 12, v: 37 })
    expect(verse.text).toBe('David therefore himself calleth him Lord; and whence is he then his son? And the common people heard him gladly.')
    // Task 27: the parts of a words-of-Jesus mark have j, so the pop-up shows them as red letters. The last
    // sentence is not in the words-of-Jesus mark. docs/DESIGN.md section 11.3.
    expect(verse.parts).toEqual([
      { t: 'David therefore himself calleth him Lord; and whence is he ', j: true },
      { t: 'then', a: true, j: true },
      { t: ' his son?', j: true },
      { t: ' And the common people heard him gladly.' },
    ])
  })

  it('gives verse 1 of Psalm 23 of the King James Version data as the title and the verse', () => {
    const text = JSON.parse(readFileSync(join(root, 'public/data/text-kjv/psalms.json'), 'utf8')) as BookText
    const [verse] = passageVerses(text, { book: 'psalms', c: 23, v: 1 })
    expect(verse.text).toBe('A Psalm of David. The LORD is my shepherd; I shall not want.')
    expect(verse.parts.filter((x) => x.a)).toEqual([{ t: 'is', a: true }])
  })

  it('keeps the no-break spaces of John 5:11, Acts 20:35, and Acts 22:21 of the World English Bible data (Task 31)', () => {
    const read = (id: string) => JSON.parse(readFileSync(join(root, 'public/data/text-web', `${id}.json`), 'utf8')) as BookText
    const john = passageVerses(read('john'), { book: 'john', c: 5, v: 8, v2: 14 })
    const acts = read('acts')
    for (const verse of [john.find((x) => x.v === 11)!, ...passageVerses(acts, { book: 'acts', c: 20, v: 35 }), ...passageVerses(acts, { book: 'acts', c: 22, v: 1, v2: 21 }).filter((x) => x.v === 21)]) {
      expect(verse.text, `${verse.c}:${verse.v}`).toContain('’ ”')
      expect(verse.parts.map((x) => x.t).join(''), `${verse.c}:${verse.v}`).toContain('’ ”')
    }
    // The other verses of the passage have no no-break space.
    expect(john.filter((x) => x.text.includes(' ')).map((x) => x.v)).toEqual([11])
  })
})
