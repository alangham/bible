// The bundled translation: one JSON file for each book in public/data/text/.
// scripts/build-text.mjs makes the files. The words come from the Berean Standard Bible
// text file and the structure from the USFM files of the same publisher.
// docs/TASKS.md Task 5 step 3, docs/DESIGN.md sections 4.3 and 5.
//
// This module is the one text service of the site. A second translation can be added
// behind the same functions without a change to the pages. docs/DESIGN.md section 5.

/** One run of a note: plain text, quoted alternative text (q), or a verse number (v). */
export interface NoteRun {
  t: string
  s?: 'q' | 'v'
}

/** A verse number in the text. The verse text follows it. */
export interface VerseMark {
  v: number
}

/** A verse that is not in the main text: its number and its note, at the place of the verse. */
export interface OmittedVerse {
  o: number
  note: NoteRun[]
}

export type Inline = string | VerseMark | OmittedVerse

/**
 * Section heading.
 * s1: section, s2: subsection, ms: book division of the Psalms, d: the psalms of that division,
 * qa: letter of an acrostic poem.
 */
export interface HeadingBlock {
  k: 'h'
  s: 's1' | 's2' | 'ms' | 'd' | 'qa'
  t: string
}

/**
 * Text: a paragraph or a line.
 * p: paragraph, pmo: embedded paragraph, q1 and q2: poetry lines, qr: closing line set to the right,
 * pc: centered line, li1 and li2: list lines, d: title of a psalm, qd: closing note of a poem.
 */
export interface TextBlock {
  k: 'p'
  s: 'p' | 'pmo' | 'q1' | 'q2' | 'qr' | 'pc' | 'li1' | 'li2' | 'd' | 'qd'
  c: Inline[]
}

/** A blank line between stanzas. */
export interface BreakBlock {
  k: 'b'
}

/** A note about manuscripts, after the block that holds its verse. */
export interface NoteBlock {
  k: 'n'
  /** chapter:verse of the note in the source. */
  ref: string
  note: NoteRun[]
}

export type Block = HeadingBlock | TextBlock | BreakBlock | NoteBlock

/** A cross-reference line of the source. Not shown in version 1. Task 7 uses them as a source of links. */
export interface CrossRefLine {
  /** The verse after the line. */
  v: number
  /** The line as the source shows it. */
  t: string
  /** Targets in USFM form, for example "JHN 1:1-5". */
  refs: string[]
}

export interface ChapterText {
  n: number
  blocks: Block[]
  xrefs: CrossRefLine[]
}

export interface BookText {
  id: string
  name: string
  translation: string
  chapters: ChapterText[]
}

export function isVerseMark(x: Inline): x is VerseMark {
  return typeof x === 'object' && 'v' in x
}

export function isOmitted(x: Inline): x is OmittedVerse {
  return typeof x === 'object' && 'o' in x
}

const cache = new Map<string, Promise<BookText>>()

/** The text of one book. The same promise is returned for each call, so a book loads once. */
export function loadBookText(id: string): Promise<BookText> {
  let p = cache.get(id)
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}data/text/${id}.json`).then((res) => {
      if (!res.ok) throw new Error(`${id}.json: HTTP ${res.status}`)
      return res.json() as Promise<BookText>
    })
    p.catch(() => cache.delete(id))
    cache.set(id, p)
  }
  return p
}
