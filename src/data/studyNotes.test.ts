// The Aquifer notes. docs/TASKS.md Task 48 step 9, docs/DESIGN.md sections 20.3, 20.4, 20.5, and 20.6. The tests read
// the files in public/data/study/, which scripts/build-study-notes.mjs makes.

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { rangeLabel } from './notes.ts'
import { AQUIFER_CREDIT, STUDY_ELEMENTS, textOfNodes, type AboutPsalm, type AquiferNote } from './studyNotes.ts'

interface BookRow {
  id: string
}

const read = (path: string) => JSON.parse(readFileSync(new URL(`../../public/data/${path}`, import.meta.url), 'utf8')) as unknown
const books = read('books.json') as BookRow[]
const files = books.map((b) => read(`study/${b.id}.json`) as { book: string; notes: AquiferNote[] })
const about = (read('study/about-psalms.json') as { psalms: AboutPsalm[] }).psalms

/**
 * The words of a note of the source file, when a tag counts as a space: section 20.5. The count uses the source file,
 * because the site removes the tags data, span, and a, and a word can have such a tag inside it.
 */
const psalmSource = new Map(
  (JSON.parse(readFileSync(new URL('../../sources/aquifer/json/19.content.json', import.meta.url), 'utf8')) as { content_id: string; content: string }[]).map((n) => [n.content_id, n.content]),
)
const ENTITIES: Record<string, string> = { '&apos;': "'", '&quot;': '"', '&nbsp;': ' ' }
const words = (id: string) => psalmSource.get(id)!.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, (e) => ENTITIES[e]).split(/\s+/).filter(Boolean).length

/** Each fault of a content: a name that is not of point 1 of section 20.3, an attribute, or a node of a different kind. */
function faults(nodes: unknown, where: string): string[] {
  if (!Array.isArray(nodes)) return [`${where}: not a list`]
  return nodes.flatMap((n): string[] => {
    if (typeof n === 'string') return []
    if (!Array.isArray(n)) return [`${where}: a node that is not a string and not an element`]
    const [name, ...children] = n as unknown[]
    if (typeof name !== 'string' || !(STUDY_ELEMENTS as readonly string[]).includes(name)) return [`${where}: the element ${String(name)}`]
    if (name === 'br' && children.length) return [`${where}: a br with content`]
    return faults(children, where)
  })
}

describe('the 66 files of the study notes: docs/DESIGN.md sections 20.3 and 20.4', () => {
  it('have one file for each book, with 16,923 notes', () => {
    expect(files.map((f) => f.book)).toEqual(books.map((b) => b.id))
    expect(files.reduce((n, f) => n + f.notes.length, 0)).toBe(16923)
  })

  it('give the SHA-256 of section 20.3: the words have no change', () => {
    // One line for each note, in the order of the books and of each file: the content_id, a tab, and the text.
    const text = Buffer.from(files.flatMap((f) => f.notes.map((n) => `${n.id}\t${textOfNodes(n.c)}\n`)).join(''), 'utf8')
    expect(text.length).toBe(4584237)
    expect(createHash('sha256').update(text).digest('hex')).toBe('8f5f57da1f500459091552bb4806747e6ee811c2779f23dd735b1c4a783e0ae1')
  })

  it('have no element and no attribute other than those of point 1 of section 20.3', () => {
    const all = [...files.flatMap((f) => f.notes), ...about]
    const found = all.flatMap((n) => faults(n.c, n.id))
    expect(found).toEqual([])
    // A note has only its number, its range, the mark of a title note, the content, and, in about-psalms.json, the psalm.
    for (const n of all) for (const key of Object.keys(n)) expect(['id', 'from', 'to', 'title', 'c', 'psalm']).toContain(key)
  })

  it('have the 7 title notes of section 20.3, and the note 24105 at Psalms 142:7', () => {
    const psalms = files.find((f) => f.book === 'psalms')!.notes
    expect(psalms.filter((n) => n.title).map((n) => n.from[0])).toEqual([7, 9, 30, 51, 57, 73, 89])
    const exception = psalms.find((n) => n.id === '24105')!
    expect([exception.from, exception.to, exception.title]).toEqual([[142, 7], [142, 7], undefined])
  })
})

describe('the psalms in "About this chapter": docs/DESIGN.md section 20.5', () => {
  it('132 psalms get a note, and 129 of them get a note for exactly the psalm', () => {
    expect(about).toHaveLength(132)
    const psalmText = read('text/psalms.json') as { chapters: { n: number; blocks: unknown }[] }
    const verses = (x: unknown): number[] =>
      Array.isArray(x) ? x.flatMap(verses) : x && typeof x === 'object' ? [...(typeof (x as { v?: unknown }).v === 'number' ? [(x as { v: number }).v] : []), ...Object.values(x).flatMap((y) => (typeof y === 'object' ? verses(y) : []))] : []
    const last = new Map(psalmText.chapters.map((c) => [c.n, Math.max(...verses(c.blocks))]))
    const exact = about.filter((a) => a.from[0] === a.psalm && a.from[1] === 1 && a.to[0] === a.psalm && a.to[1] === last.get(a.psalm))
    expect(exact).toHaveLength(129)
  })

  it('give the SHA-256 of section 20.5', () => {
    const lines = about.map((a) => `${a.psalm}\t${a.id}\n`).join('')
    expect(createHash('sha256').update(Buffer.from(lines, 'utf8')).digest('hex')).toBe('651b7fe88ce7ff10d006247efe364b5f58807fe86f19dbbb5f0f497ae01b3b07')
  })

  it('Psalms 3 gets the note 24356, Psalms 9 gets Psalms 9:1–10:18, and Psalms 42 and 43 get the same note', () => {
    const of = (p: number) => about.find((a) => a.psalm === p)
    expect(of(3)!.id).toBe('24356')
    expect(rangeLabel('Psalms', of(9)!)).toBe('Psalms 9:1–10:18')
    expect(of(42)!.id).toBe(of(43)!.id)
    expect(new Set(about.map((a) => a.id)).size).toBe(131)
  })

  it('Psalms 23 gets no Aquifer note', () => {
    expect(about.find((a) => a.psalm === 23)).toBeUndefined()
  })

  it('the range label of Psalms 42 is "Psalms 42:1–43:5"', () => {
    expect(rangeLabel('Psalms', about.find((a) => a.psalm === 42)!)).toBe('Psalms 42:1–43:5')
  })

  it('each note is the note of the same number in psalms.json, with no title note', () => {
    const psalms = files.find((f) => f.book === 'psalms')!.notes
    for (const a of about) {
      const n = psalms.find((x) => x.id === a.id)!
      expect([a.from, a.to, a.c, a.title]).toEqual([n.from, n.to, n.c, undefined])
    }
  })

  it('the shortest of the 131 notes has 7 words, the longest 151, and the median 41', () => {
    const counts = [...new Set(about.map((a) => a.id))].map(words).sort((x, y) => x - y)
    expect([counts[0], counts.at(-1), counts[(counts.length - 1) / 2]]).toEqual([7, 151, 41])
  })
})

describe('the Aquifer credit: docs/DESIGN.md section 20.6', () => {
  it('has the words of section 20.6, with no change, and the two addresses', () => {
    const c = AQUIFER_CREDIT
    expect(`${c.before}${c.source.text}${c.middle}${c.license.text}${c.after}`).toBe(
      'From the Aquifer Open Study Notes, © 2026 Mission Mutual, licensed under CC BY-SA 4.0. They are an adaptation of the Tyndale Open Study Notes, © 2023 Tyndale House Publishers. The words have no changes.',
    )
    expect(c.source.href).toBe('https://github.com/BibleAquifer/AquiferOpenStudyNotes')
    expect(c.license.href).toBe('https://creativecommons.org/licenses/by-sa/4.0/')
  })
})
