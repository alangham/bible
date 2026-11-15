// The cross-reference lines of the Berean Standard Bible files, below a section heading.
// docs/DESIGN.md section 7.7: the page shows the line as the publisher gives it. Each reference
// that has a link is a control. A reference with no link is plain text.
// The rules to read a reference are those of scripts/build-links.mjs, which made the heading links.

import type { Book } from './books.ts'
import type { CrossRefLine } from './text.ts'
import type { LinkEnd } from './links.ts'
import type { PassageRange } from './passage.ts'

/** The book codes of the USFM files, in the order of the books. */
const USFM = 'GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV'.split(' ')

/**
 * The passage of a reference, for example "EXO 40:1-33" with the shown text "Exodus 40:1–33".
 * `whole` is true when the reference names whole chapters or books. Then the passage is its first verse.
 */
export function referenceRange(books: Book[], ref: string, shown: string): (PassageRange & { whole?: true }) | null {
  let m = /^(\w{3}) (\d+)(?::(\d+))?(?:-(?:(\d+):)?(\d+))?$/.exec(ref.trim())
  if (m && USFM.includes(m[1])) {
    const book = books[USFM.indexOf(m[1])]
    if (!book) return null
    // A book with one chapter is cited by verse alone, for example "JUD 24-25".
    if (!m[3] && book.chapters === 1) return { book: book.id, c: 1, v: +m[2], ...(m[5] ? { v2: +m[5] } : {}) }
    if (!m[3]) return { book: book.id, c: +m[2], v: 1, whole: true }
    const p: PassageRange = { book: book.id, c: +m[2], v: +m[3] }
    if (m[5]) {
      p.c2 = m[4] ? +m[4] : p.c
      p.v2 = +m[5]
    }
    return p
  }
  // A line that names whole chapters or books links to the start of the first chapter.
  m = /^(\d?\s?[A-Za-z ]+?)(?: (\d+))?(?:[–-].*)?$/.exec(shown.trim())
  if (m) {
    const name = m[1].trim().toLowerCase()
    const book = books.find((b) => b.name.toLowerCase() === name)
    if (book) return { book: book.id, c: m[2] ? +m[2] : 1, v: 1, whole: true }
  }
  return null
}

/** The first verse of a reference. */
export function referenceStart(books: Book[], ref: string, shown: string): { book: string; c: number; v: number } | null {
  const p = referenceRange(books, ref, shown)
  return p && { book: p.book, c: p.c, v: p.v }
}

/**
 * A reference of a line, for the pop-up. Arthur decided this on 2026-11-14: the pop-up gives the
 * reference as the line gives it, and the text of every verse of the passage that the line names.
 * For whole chapters or books, the text is the first verse, with the label "First verse".
 */
export interface LineReference {
  shown: string
  passage: PassageRange
  firstVerse: boolean
}

/**
 * One reference of a line: its text as the publisher gives it, and its link if it has one. `before`
 * and `after` are the other characters of the line around it: "(", ")", and spaces. The parts joined
 * with ";" give the line with no change.
 */
export interface LinePart {
  before: string
  shown: string
  after: string
  end?: LinkEnd
  /** The passage that the reference names, for the pop-up. Only for a reference with a link. */
  reference?: LineReference
}

/** The references of a line, each with the link end at the heading that goes to it. */
export function lineParts(books: Book[], line: CrossRefLine, ends: LinkEnd[]): LinePart[] {
  const used = new Set<LinkEnd>()
  return line.t.split(';').map((raw, i) => {
    // The same split as scripts/build-links.mjs: without the brackets of the line, at ";", trimmed.
    const m = /^(\(?\s*)(.*?)(\s*\)?)$/s.exec(raw)!
    const before = i === 0 ? m[1] : (/^\s*/.exec(raw)?.[0] ?? '')
    const after = m[3]
    const shown = raw.slice(before.length, raw.length - after.length)
    const text = shown.replace(/^\(|\)$/g, '').trim()
    const range = line.refs[i] !== undefined ? referenceRange(books, line.refs[i], text) : null
    const end = range
      ? ends.find((e) => !used.has(e) && e.there.book === range.book && e.there.c === range.c && e.there.v === range.v)
      : undefined
    if (!end || !range) return { before, shown, after }
    used.add(end)
    const { whole, ...passage } = range
    return { before, shown, after, end, reference: { shown: text, passage, firstVerse: whole === true } }
  })
}
