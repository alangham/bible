// The Biblica notes of "About this chapter". docs/TASKS.md Task 47 step 9, docs/DESIGN.md sections 19.4, 19.5,
// 19.7, and 19.8. The tests read the files in public/data/notes/, which scripts/build-notes.mjs makes.

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { NOTE_CREDIT, notesOfChapter, rangeLabel, type BookNotes } from './notes.ts'

interface BookRow {
  id: string
  name: string
  chapters: number
}

const books = JSON.parse(readFileSync(new URL('../../public/data/books.json', import.meta.url), 'utf8')) as BookRow[]
const files = new Map(books.map((b) => [b.id, JSON.parse(readFileSync(new URL(`../../public/data/notes/${b.id}.json`, import.meta.url), 'utf8')) as BookNotes]))
const book = (id: string) => books.find((b) => b.id === id)!

/** The range labels of the notes that a chapter shows. */
function labels(id: string, chapter: number): string[] {
  return notesOfChapter(files.get(id)!.notes, chapter).map((n) => rangeLabel(book(id).name, n))
}

describe('the notes that a chapter shows: docs/DESIGN.md section 19.5', () => {
  it('Genesis 22 shows the one note Genesis 21:1–22:24', () => {
    expect(labels('genesis', 22)).toEqual(['Genesis 21:1–22:24'])
  })

  it('Romans 8 shows three notes, in the order of the Bible', () => {
    expect(labels('romans', 8)).toEqual(['Romans 8:1–17', 'Romans 8:18–25', 'Romans 8:26–39'])
  })

  it('Job 10 shows the note Job 4:1–31:40', () => {
    expect(labels('job', 10)).toEqual(['Job 4:1–31:40'])
  })

  it('Psalms 3 shows no note', () => {
    expect(labels('psalms', 3)).toEqual([])
  })

  it('Matthew 26 shows six notes', () => {
    expect(labels('matthew', 26)).toHaveLength(6)
  })

  it('1,057 chapters have a note, and 817, 160, 65, 9, 5, and 1 chapters have 1 to 6 notes', () => {
    const counts = new Map<number, number>()
    let chapters = 0
    for (const b of books) {
      for (let c = 1; c <= b.chapters; c++) {
        chapters++
        const n = notesOfChapter(files.get(b.id)!.notes, c).length
        counts.set(n, (counts.get(n) ?? 0) + 1)
      }
    }
    expect(chapters).toBe(1189)
    expect(chapters - (counts.get(0) ?? 0)).toBe(1057)
    expect([1, 2, 3, 4, 5, 6].map((n) => counts.get(n))).toEqual([817, 160, 65, 9, 5, 1])
    expect(Math.max(...counts.keys())).toBe(6)
  })
})

describe('the words of the notes: docs/DESIGN.md section 19.4', () => {
  it('give the SHA-256 of section 19.4: the words have no change', () => {
    // For each book in the order of the Bible, and for each note in the order of the file: the content_id, each
    // paragraph, and one empty line. A line feed after each line.
    const lines = books.flatMap((b) => files.get(b.id)!.notes.flatMap((n) => [n.id, ...n.p, '']))
    const text = Buffer.from(lines.map((l) => `${l}\n`).join(''), 'utf8')
    expect(text.length).toBe(748783)
    expect(createHash('sha256').update(text).digest('hex')).toBe('7571b4834420f4b4f1b67c89e13d11e43010f2c3275f507a0cdd847770c6cdf7')
  })

  it('have 751 notes in 66 files, one file for each book', () => {
    expect(files.size).toBe(66)
    for (const b of books) expect(files.get(b.id)!.book).toBe(b.id)
    expect([...files.values()].reduce((n, f) => n + f.notes.length, 0)).toBe(751)
  })
})

describe('the range label: docs/DESIGN.md section 19.7', () => {
  it('has the form "Romans 8:1–17" for a range in one chapter', () => {
    expect(rangeLabel('Romans', { from: [8, 1], to: [8, 17] })).toBe('Romans 8:1–17')
  })

  it('has the form "Genesis 21:1–22:24" for a range of more than one chapter', () => {
    expect(rangeLabel('Genesis', { from: [21, 1], to: [22, 24] })).toBe('Genesis 21:1–22:24')
  })

  it('uses the en dash U+2013', () => {
    expect(rangeLabel('Job', { from: [4, 1], to: [31, 40] })).toContain('–')
    expect(rangeLabel('Job', { from: [4, 1], to: [31, 40] })).not.toMatch(/-|—/)
  })
})

describe('the note credit: docs/DESIGN.md section 19.8', () => {
  it('has the words of section 19.8, with no change, and the two addresses', () => {
    const c = NOTE_CREDIT
    expect(`${c.before}${c.source.text}${c.middle}${c.license.text}${c.after}`).toBe(
      'From the Biblica Study Notes, © 2023 Biblica Inc., licensed under CC BY-SA 4.0. The words have no changes.',
    )
    expect(c.source.href).toBe('https://github.com/BibleAquifer/BiblicaStudyNotes')
    expect(c.license.href).toBe('https://creativecommons.org/licenses/by-sa/4.0/')
  })
})
