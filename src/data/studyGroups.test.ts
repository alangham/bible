// The groups of blocks and the group of blocks of each note. docs/TASKS.md Task 49 step 3, docs/DESIGN.md section
// 20.8. The tests run the two rules of src/data/studyGroups.ts on the Berean data in public/data/text/, and they check
// that the files in public/data/study/ have the result.

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { alignBlocks, groupOfNote, groupsOfChapter, type RuleBlock, type StudyGroup } from './studyGroups.ts'
import type { AboutPsalm, AquiferNote, StudyFile } from './studyNotes.ts'

interface BookRow {
  id: string
  name: string
  chapters: number
}
interface TextFile {
  chapters: { n: number; blocks: RuleBlock[] }[]
}

const read = <T,>(path: string) => JSON.parse(readFileSync(new URL(`../../public/data/${path}`, import.meta.url), 'utf8')) as T
const books = read<BookRow[]>('books.json')
const about = read<{ psalms: AboutPsalm[] }>('study/about-psalms.json').psalms

/** The groups of blocks with a note, for each chapter: the verses of the group of blocks and the ids of its notes. */
const result = new Map<string, { group: StudyGroup; ids: string[] }[]>()
let inGroups = 0
const noteById = new Map<string, AquiferNote>()
let onlyAbout = 0
for (const b of books) {
  const text = read<TextFile>(`text/${b.id}.json`)
  const notes = read<StudyFile>(`study/${b.id}.json`).notes as AquiferNote[]
  for (const note of notes) noteById.set(note.id, note)
  for (const chapter of text.chapters) {
    const groups = groupsOfChapter(chapter.blocks)
    const byGroup = new Map<number, string[]>()
    for (const note of notes) {
      if (note.from[0] !== chapter.n) continue
      const aboutHere = b.id === 'psalms' && about.some((a) => a.psalm === chapter.n && a.id === note.id)
      const g = groupOfNote(note, groups, aboutHere)
      if (g === null) {
        onlyAbout++
        continue
      }
      inGroups++
      byGroup.set(g, [...(byGroup.get(g) ?? []), note.id])
    }
    if (byGroup.size)
      result.set(
        `${b.name} ${chapter.n}`,
        [...byGroup].sort((x, y) => x[0] - y[0]).map(([g, ids]) => ({ group: groups[g], ids })),
      )
  }
}
const all = [...result.values()].flat()
/** The first verse and the last verse of each group of blocks with a note in a chapter. */
const verses = (key: string) => result.get(key)!.map(({ group }) => [group.verses[0], group.verses.at(-1)])

describe('the groups of blocks with a note: docs/DESIGN.md section 20.8', () => {
  it('16,792 notes are in the groups of blocks, and 131 notes are only in "About this chapter"', () => {
    expect(inGroups).toBe(16792)
    expect(onlyAbout).toBe(131)
  })

  it('10,562 groups of blocks have a note, and 3,663 of them have one verse', () => {
    expect(all).toHaveLength(10562)
    expect(all.filter(({ group }) => new Set(group.verses).size === 1)).toHaveLength(3663)
  })

  it('1,186 chapters have a group of blocks with a note, and Exodus 36, Psalms 108, and Psalms 123 have none', () => {
    expect(result.size).toBe(1186)
    const none = books.flatMap((b) => Array.from({ length: b.chapters }, (_, i) => `${b.name} ${i + 1}`)).filter((k) => !result.has(k))
    expect(none).toEqual(['Exodus 36', 'Psalms 108', 'Psalms 123'])
  })

  it('the median chapter has 8; Mark 14 has the most, 35; Matthew 26 has 32, and Luke 22 has 31', () => {
    const counts = [...result.values()].map((g) => g.length).sort((x, y) => x - y)
    expect((counts[counts.length / 2 - 1] + counts[counts.length / 2]) / 2).toBe(8)
    expect(Math.max(...counts)).toBe(35)
    expect(['Mark 14', 'Matthew 26', 'Luke 22'].map((k) => result.get(k)!.length)).toEqual([35, 32, 31])
  })

  it('Romans 8 has 10, at the verses of section 20.8', () => {
    expect(verses('Romans 8')).toEqual([
      [1, 4],
      [5, 8],
      [9, 11],
      [12, 14],
      [15, 17],
      [18, 21],
      [22, 25],
      [26, 27],
      [28, 30],
      [31, 34],
    ])
  })

  it('Genesis 22 has 11, Psalms 119 has 22, Psalms 142 has 4, Psalms 23 has 2, Revelation 12 has 7, and 3 John has 7', () => {
    expect(['Genesis 22', 'Psalms 119', 'Psalms 142', 'Psalms 23', 'Revelation 12', '3 John 1'].map((k) => result.get(k)!.length)).toEqual([11, 22, 4, 2, 7, 7])
  })

  it('Psalms 3 has 3: at verse 1, at the verses 2 to 6, and at the verses 7 to 8', () => {
    expect(verses('Psalms 3')).toEqual([
      [1, 1],
      [2, 6],
      [7, 8],
    ])
  })

  it('the group of blocks of Exodus 20, verses 3 to 17, has the most notes, 15', () => {
    const most = Math.max(...all.map((g) => g.ids.length))
    expect(most).toBe(15)
    const top = [...result].flatMap(([key, groups]) => groups.filter((g) => g.ids.length === most).map((g) => `${key}:${g.group.verses[0]}-${g.group.verses.at(-1)}`))
    expect(top).toEqual(['Exodus 20:3-17'])
  })

  it('the three notes of point 4 go to the group of blocks of the nearest verse before them', () => {
    const nearest = [...result].flatMap(([key, groups]) =>
      groups.flatMap(({ group, ids }) => ids.filter((id) => !noteById.get(id)!.title && !group.verses.includes(noteById.get(id)!.from[1])).map(() => key)),
    )
    expect(nearest).toEqual(['3 John 1', 'Revelation 12', 'Revelation 12'])
  })
})

describe('the rule of the groups of blocks: docs/DESIGN.md section 20.8', () => {
  const p = (s: string, ...v: number[]): RuleBlock => ({ k: 'p', s, c: v.map((x) => ({ v: x })) })
  it('a block that is not a text block ends the group of blocks, and two poetry blocks join', () => {
    expect(groupsOfChapter([p('q1', 1), p('q2'), { k: 'b' }, p('q1', 2), p('q2', 3)])).toEqual([
      { start: 0, end: 1, verses: [1] },
      { start: 3, end: 4, verses: [2, 3] },
    ])
  })
  it('a title block starts a group of blocks, and the next block joins it; each prose block is a group of blocks', () => {
    expect(groupsOfChapter([p('p', 1), p('d', 2), p('p', 3), p('p', 4)])).toEqual([
      { start: 0, end: 0, verses: [1] },
      { start: 1, end: 2, verses: [2, 3] },
      { start: 3, end: 3, verses: [4] },
    ])
  })
  it('a style that is not in point 2 stops the rule', () => {
    expect(() => groupsOfChapter([p('xx', 1)])).toThrow(/point 2/)
  })
  it('a title note goes to the first group of blocks with a verse', () => {
    const groups = [{ start: 0, end: 0, verses: [] }, { start: 1, end: 1, verses: [1] }]
    expect(groupOfNote({ id: 'x', from: [3, 1], title: true }, groups, false)).toBe(1)
    expect(groupOfNote({ id: 'x', from: [3, 1] }, groups, true)).toBeNull()
  })
})

describe('the files in public/data/study/ have the groups of blocks of the rule', () => {
  it('each group of blocks of the files is a group of blocks of the rule, with the same notes and its last block in the Berean data', () => {
    for (const b of books) {
      const file = read<StudyFile>(`study/${b.id}.json`)
      const text = read<TextFile>(`text/${b.id}.json`)
      const fromRule = text.chapters.flatMap((c) => (result.get(`${b.name} ${c.n}`) ?? []).map(({ group, ids }) => ({ c: c.n, v: [group.verses[0], group.verses.at(-1)], bsb: group.end, notes: ids })))
      expect(file.groups.map((g) => ({ c: g.c, v: g.v, bsb: g.end.bsb, notes: g.notes })), b.id).toEqual(fromRule)
    }
  })

  it('the last block of each group of blocks on the pages of the King James Version and of the World English Bible', () => {
    const missing: string[] = []
    for (const b of books) {
      const file = read<StudyFile>(`study/${b.id}.json`)
      const berean = read<TextFile>(`text/${b.id}.json`)
      for (const [t, folder] of [['kjv', 'text-kjv'], ['web', 'text-web']] as const) {
        const text = read<TextFile>(`${folder}/${b.id}.json`)
        for (const g of file.groups) {
          const blocks = text.chapters.find((c) => c.n === g.c)!.blocks
          const map = alignBlocks(blocks, berean.chapters.find((c) => c.n === g.c)!.blocks)
          const group = result.get(`${b.name} ${g.c}`)!.find((x) => x.group.end === g.end.bsb)!.group
          const last = map.findLastIndex((j) => j >= group.start && j <= group.end)
          expect(g.end[t]).toBe(last < 0 ? null : last)
          if (last < 0) missing.push(`${t} ${b.name} ${g.c}:${g.v.join('-')}`)
        }
      }
    }
    // The rule of section 13.4 for links, applied to the notes: the World English Bible has Romans 16:25 to 16:27 in Romans 14.
    expect(missing).toEqual(['web Romans 16:25-27'])
  })

  it('Romans 8 of the King James Version: each group of blocks ends at the block of its last verse', () => {
    const file = read<StudyFile>('study/romans.json')
    expect(file.groups.filter((g) => g.c === 8).map((g) => [g.end.bsb, g.end.kjv, g.end.web])).toEqual(
      file.groups.filter((g) => g.c === 8).map((g) => [g.end.bsb, g.end.bsb, g.end.bsb]),
    )
  })
})
