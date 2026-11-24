// The Aquifer notes. docs/TASKS.md Task 48 step 9, docs/DESIGN.md sections 20.3, 20.4, 20.5, and 20.6. The tests read
// the files in public/data/study/, which scripts/build-study-notes.mjs makes. Task 55 step 10 adds the tests of the
// links of section 22.

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { rangeLabel } from './notes.ts'
import { lastVerseOf } from './passage.ts'
import {
  AQUIFER_CREDIT,
  childNodes,
  controlWords,
  firstVerseOnly,
  noteLabel,
  noteRangeName,
  refTitle,
  SHORT_CREDIT,
  STUDY_ELEMENTS,
  STUDY_LINKS,
  textOfNodes,
  wholeChapters,
  type AboutPsalm,
  type AquiferNote,
  type StudyNode,
  type StudyNoteRef,
  type StudyRef,
} from './studyNotes.ts'
import type { BookText } from './text.ts'

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

/** The keys of the object of each link of section 22.5. */
const LINK_KEYS: Record<string, string[]> = { ref: ['b', 'c', 'v', 'c2', 'v2', 'first'], note: ['b', 'id', 'c', 'v'] }

/**
 * Each fault of a content: a name that is not of point 1 of section 20.3 or of section 22.5, an attribute, an object
 * that is not the object of a link, a key of an object that section 22.5 does not give, or a node of a different kind.
 */
function faults(nodes: unknown, where: string): string[] {
  if (!Array.isArray(nodes)) return [`${where}: not a list`]
  return nodes.flatMap((n): string[] => {
    if (typeof n === 'string') return []
    if (!Array.isArray(n)) return [`${where}: a node that is not a string and not an element`]
    let [name, ...children] = n as unknown[]
    if (typeof name === 'string' && (STUDY_LINKS as readonly string[]).includes(name)) {
      const object = children[0]
      if (object === null || typeof object !== 'object' || Array.isArray(object)) return [`${where}: the link ${name} has no object`]
      const bad = Object.keys(object).filter((k) => !LINK_KEYS[name as string].includes(k))
      if (bad.length) return [`${where}: the keys ${bad.join(', ')} in the object of ${name}`]
      children = children.slice(1)
    } else if (typeof name !== 'string' || !(STUDY_ELEMENTS as readonly string[]).includes(name)) return [`${where}: the element ${String(name)}`]
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

describe('the note label and the words of a notes control: docs/DESIGN.md section 20.8, Task 49 step 7', () => {
  const psalms = (read('study/psalms.json') as { notes: AquiferNote[] }).notes
  it('"Verse 3" for one verse, and "Verses 19–21" for a range in one chapter', () => {
    expect(noteLabel('Romans', { from: [8, 3], to: [8, 3] })).toBe('Verse 3')
    expect(noteLabel('Romans', { from: [8, 19], to: [8, 21] })).toBe('Verses 19–21')
  })
  it('"Romans 5:1–8:39" for a range of more than one chapter', () => {
    expect(noteLabel('Romans', { from: [5, 1], to: [8, 39] })).toBe('Romans 5:1–8:39')
  })
  it('"Title of the psalm" for a title note, and "Verse 7" for the note 24105', () => {
    expect(noteLabel('Psalms', psalms.find((n) => n.title && n.from[0] === 7)!)).toBe('Title of the psalm')
    expect(noteLabel('Psalms', psalms.find((n) => n.id === '24105')!)).toBe('Verse 7')
  })
  it('"Notes on verses 1 to 4", and "Notes on verse 5" for one verse', () => {
    expect(controlWords([1, 4])).toBe('Notes on verses 1 to 4')
    expect(controlWords([5, 5])).toBe('Notes on verse 5')
  })
})

describe('the short credit: docs/DESIGN.md section 20.6', () => {
  it('has the words of section 20.6, with no change, and the two addresses of a different site', () => {
    const c = SHORT_CREDIT
    expect(`${c.before}${c.source.text}${c.middle}${c.license.text}${c.after}${c.full}`).toBe('From the Aquifer Open Study Notes, licensed under CC BY-SA 4.0. Full credit')
    expect(c.source.href).toBe('https://github.com/BibleAquifer/AquiferOpenStudyNotes')
    expect(c.license.href).toBe('https://creativecommons.org/licenses/by-sa/4.0/')
  })
})

// ---- Task 55 step 10: the links of section 22 ----

type LinkElement = ['ref', StudyRef, ...StudyNode[]] | ['note', StudyNoteRef, ...StudyNode[]]

/** Each link of a content, in order, also a link in a list or in italics. */
function linksOf(nodes: readonly StudyNode[]): LinkElement[] {
  return nodes.flatMap((n): LinkElement[] => {
    if (typeof n === 'string') return []
    if (n[0] === 'ref' || n[0] === 'note') return [n as LinkElement, ...linksOf(childNodes(n))]
    return linksOf(childNodes(n))
  })
}

describe('the links in the study notes: docs/DESIGN.md sections 22.3, 22.4, and 22.5', () => {
  // Each note of the source one time: the 66 files. about-psalms.json has copies of notes.
  const notes = files.flatMap((f) => f.notes.map((n) => ({ ...n, book: f.book })))
  const byId = new Map(notes.map((n) => [n.id, n]))
  const all = notes.flatMap((n) => linksOf(n.c).map((link) => ({ link, note: n })))
  const refs = all.filter((x): x is { link: ['ref', StudyRef, ...StudyNode[]]; note: (typeof notes)[number] } => x.link[0] === 'ref')
  const noteLinks = all.filter((x): x is { link: ['note', StudyNoteRef, ...StudyNode[]]; note: (typeof notes)[number] } => x.link[0] === 'note')
  const berean = new Map<string, BookText>()
  const bereanOf = (id: string) => {
    if (!berean.has(id)) berean.set(id, read(`text/${id}.json`) as BookText)
    return berean.get(id)!
  }
  const isVerse = (book: string, c: number, v: number) => {
    const text = bereanOf(book)
    const last = lastVerseOf(text, c)
    if (last === undefined || v > last) return false
    // A verse of a text block, or a verse that the data has only as a note.
    return text.chapters[c - 1].blocks.some((b) => b.k === 'p' && b.c.some((item) => typeof item === 'object' && ((item as { v?: number }).v === v || (item as { o?: number }).o === v)))
  }
  const plainWords = (id: string, words: string) => {
    const note = byId.get(id)!
    return { inText: textOfNodes(note.c).includes(words), inLink: linksOf(note.c).some((l) => textOfNodes(childNodes(l)).includes(words)) }
  }

  it('39,103 passage links and 1,123 note links, with no link inside a link', () => {
    expect(refs).toHaveLength(39103)
    expect(noteLinks).toHaveLength(1123)
    expect(all.filter((x) => linksOf(childNodes(x.link)).length > 0)).toEqual([])
  })

  it('rule 1: each passage link is in one book, its two ends are verses of the Berean data, and the end is not before the start', () => {
    const bad = refs.filter(({ link: [, r] }) => {
      const c2 = r.c2 ?? r.c
      const v2 = r.v2 ?? r.v
      return !books.some((b) => b.id === r.b) || !isVerse(r.b, r.c, r.v) || !isVerse(r.b, c2, v2) || c2 < r.c || (c2 === r.c && v2 < r.v)
    })
    expect(bad).toEqual([])
    // A passage of one verse has no c2 and no v2.
    expect(refs.filter(({ link: [, r] }) => r.c2 === r.c && r.v2 === r.v)).toEqual([])
  })

  it('rule 3: each note link goes to a note of the site in its book, 918 in the same book and 205 in a different book', () => {
    expect(noteLinks.filter(({ link: [, n] }) => byId.get(n.id)?.book !== n.b)).toEqual([])
    expect(noteLinks.filter(({ link: [, n], note }) => n.b === note.book)).toHaveLength(918)
    expect(noteLinks.filter(({ link: [, n], note }) => n.b !== note.book)).toHaveLength(205)
  })

  it('section 22.11: "c" and "v" of each note link are the start of the range of the note', () => {
    expect(noteLinks.filter(({ link: [, n] }) => byId.get(n.id)!.from[0] !== n.c || byId.get(n.id)!.from[1] !== n.v)).toEqual([])
  })

  it('rule 2: a reference across two books is plain text, Leviticus 4:3 "1 Samuel 1:1—2 Kings 25:30"', () => {
    expect(plainWords('20348', '1 Samuel 1:1—2 Kings 25:30')).toEqual({ inText: true, inLink: false })
  })

  it('rule 2: a reference with an end verse that is not in the Berean data is plain text, 1 Kings 22:41–50 "2 Chronicles 17:1–21:1"', () => {
    expect(plainWords('15605', '2\u00a0Chronicles 17:1–21:1')).toEqual({ inText: true, inLink: false })
    expect(isVerse('2-chronicles', 17, 21)).toBe(false)
  })

  it('rule 2: a reference with a start verse that is not in the Berean data is plain text, John 20:19 "3 John 1:15"', () => {
    expect(plainWords('19068', '3\u00a0John 1:15')).toEqual({ inText: true, inLink: false })
    expect(isVerse('3-john', 1, 15)).toBe(false)
  })

  it('a verse that the Berean data has only as a note is a verse of the Berean data: Mark 9:44 and Mark 11:12–26 are links', () => {
    const mark = refs.filter(({ link: [, r] }) => r.b === 'mark').map(({ link: [, r] }) => r)
    expect(mark).toContainEqual({ b: 'mark', c: 9, v: 44 })
    expect(mark).toContainEqual({ b: 'mark', c: 11, v: 12, c2: 11, v2: 26 })
  })

  it('rule 4: a theme, a profile, and a book introduction are plain text', () => {
    expect(plainWords('12231', 'Blessing')).toEqual({ inText: true, inLink: false })
    expect(plainWords('12273', 'Lot')).toEqual({ inText: true, inLink: false })
    expect(plainWords('17466', 'Jeremiah Book Introduction')).toEqual({ inText: true, inLink: false })
  })

  it('rule 3: a note link to the same book and a note link to a different book', () => {
    expect(linksOf(byId.get('25759')!.c).filter((l) => l[0] === 'note')).toEqual([['note', { b: 'romans', id: '25719', c: 6, v: 19 }, 'study note on 6:19']])
    expect(linksOf(byId.get('12261')!.c).filter((l) => l[0] === 'note')).toContainEqual(['note', { b: 'jonah', id: '19284', c: 1, v: 3 }, 'study note on Jonah 1:3'])
  })

  it('rules 5 and 6: the words of a link have no change; em and sup stay in a link', () => {
    expect(linksOf(byId.get('16826')!.c)).toContainEqual(['ref', { b: '1-samuel', c: 8, v: 11, c2: 8, v2: 16 }, '1 Samuel 8:11', ['em', '–'], '16'])
    expect(linksOf(byId.get('10843')!.c)).toContainEqual(['ref', { b: 'john', c: 14, v: 13, c2: 14, v2: 14 }, 'John 14:13', ['sup', '–'], '14'])
  })

  it('section 22.4: 37,132 links with all verses, and 1,971 with "first": true, 1,614 of whole chapters and 357 in two chapters', () => {
    const last = (r: StudyRef) => (c: number) => lastVerseOf(bereanOf(r.b), c)
    const first = refs.filter(({ link: [, r] }) => r.first)
    expect(refs.length - first.length).toBe(37132)
    expect(first).toHaveLength(1971)
    expect(first.filter(({ link: [, r] }) => wholeChapters(r, last(r)))).toHaveLength(1614)
    expect(first.filter(({ link: [, r] }) => !wholeChapters(r, last(r)) && r.c2 !== r.c)).toHaveLength(357)
    // "first" is the rule of the page also.
    expect(refs.filter(({ link: [, r] }) => firstVerseOnly(r, last(r)) !== (r.first === true))).toEqual([])
  })

  it('section 22.4: examples of each rule', () => {
    const genesis = (c: number) => lastVerseOf(bereanOf('genesis'), c)
    // "7:23" in the note on Romans 8:2: all verses.
    expect(firstVerseOnly({ c: 7, v: 23 }, (c) => lastVerseOf(bereanOf('romans'), c))).toBe(false)
    // Genesis 1:1–31 is one whole chapter, and Genesis 1:3–2:3 has its ends in two chapters.
    expect(linksOf(byId.get('12239')!.c)).toContainEqual(['ref', { b: 'genesis', c: 1, v: 1, c2: 1, v2: 31, first: true }, '1 '])
    expect(wholeChapters({ c: 1, v: 1, c2: 1, v2: 31 }, genesis)).toBe(true)
    expect(linksOf(byId.get('12229')!.c)).toContainEqual(['ref', { b: 'genesis', c: 1, v: 3, c2: 2, v2: 3, first: true }, '1:3–2:3'])
    expect(wholeChapters({ c: 1, v: 3, c2: 2, v2: 3 }, genesis)).toBe(false)
    expect(firstVerseOnly({ c: 1, v: 3, c2: 2, v2: 3 }, genesis)).toBe(true)
    // Romans 8:5–9 in one chapter: all verses.
    expect(firstVerseOnly({ c: 8, v: 5, c2: 8, v2: 9 }, (c) => lastVerseOf(bereanOf('romans'), c))).toBe(false)
  })

  it('about-psalms.json has the links of psalms.json', () => {
    const psalms = files.find((f) => f.book === 'psalms')!.notes
    const withLinks = about.filter((a) => linksOf(a.c).length > 0)
    expect(withLinks.length).toBeGreaterThan(0)
    for (const a of withLinks) expect(a.c).toEqual(psalms.find((n) => n.id === a.id)!.c)
  })
})

describe('the words of the pop-ups of the links: docs/DESIGN.md sections 22.7 and 22.8', () => {
  it('the title of a passage: "Hebrews 10:6", "Romans 8:5-9", "Romans 5–7", "Romans 5", and "Genesis 1:3-2:3"', () => {
    expect(refTitle('Hebrews', { b: 'hebrews', c: 10, v: 6 }, false)).toBe('Hebrews 10:6')
    expect(refTitle('Romans', { b: 'romans', c: 8, v: 5, c2: 8, v2: 9 }, false)).toBe('Romans 8:5-9')
    expect(refTitle('Romans', { b: 'romans', c: 5, v: 1, c2: 7, v2: 25, first: true }, true)).toBe('Romans 5–7')
    expect(refTitle('Romans', { b: 'romans', c: 5, v: 1, c2: 5, v2: 21, first: true }, true)).toBe('Romans 5')
    expect(refTitle('Genesis', { b: 'genesis', c: 1, v: 3, c2: 2, v2: 3, first: true }, false)).toBe('Genesis 1:3-2:3')
  })
  it('the range of the note in a kind line: "Romans 8:3", "Romans 8:1-4", "Psalms 42:1-43:5", and "the title of Psalm 51"', () => {
    expect(noteRangeName('Romans', { from: [8, 3], to: [8, 3] })).toBe('Romans 8:3')
    expect(noteRangeName('Romans', { from: [8, 1], to: [8, 4] })).toBe('Romans 8:1-4')
    expect(noteRangeName('Psalms', { from: [42, 1], to: [43, 5] })).toBe('Psalms 42:1-43:5')
    expect(noteRangeName('Psalms', { from: [51, 1], to: [51, 999], title: true })).toBe('the title of Psalm 51')
  })
})
