// The Aquifer notes of the site. docs/DESIGN.md section 20, docs/TASKS.md Task 48.
// The files public/data/study/ come from scripts/build-study-notes.mjs, with the words of the Aquifer Open Study Notes
// and no change. Task 48 uses about-psalms.json: the 132 psalms with no Biblica note, each with one Aquifer note in
// "About this chapter", section 20.5. Task 49 uses the study file of each book, with the switch "Study notes" on:
// sections 20.7 and 20.8. Task 55 adds the links of section 22: a passage link and a note link in a content.

/**
 * The content of a note: a list of nodes. A node is a string of text, or an element: a list with the name of the
 * element first and its nodes after it, for example ["p", "The ", ["em", "LORD"]]. An element has no attribute.
 * The page makes each element itself, and it puts no string of a file into the page as HTML.
 *
 * The two links of section 22.5 have one object after the name, and then their nodes: the words between the tags of
 * the source, with no change. No other element has an object.
 */
export type StudyNode = string | [StudyElement, ...StudyNode[]] | ['ref', StudyRef, ...StudyNode[]] | ['note', StudyNoteRef, ...StudyNode[]]

/** The elements of point 1 of section 20.3. The page makes no other element. */
export const STUDY_ELEMENTS = ['p', 'ul', 'ol', 'li', 'em', 'strong', 'sup', 'br'] as const
export type StudyElement = (typeof STUDY_ELEMENTS)[number]

/** The two links of section 22.5. */
export const STUDY_LINKS = ['ref', 'note'] as const

/**
 * A passage link: the book, the chapter and the verse of the start, and of the end for a passage of more than one
 * verse. `first`: the pop-up shows the first verse, with the label "First verse": rule 2 of section 22.4.
 */
export interface StudyRef {
  b: string
  c: number
  v: number
  c2?: number
  v2?: number
  first?: true
}

/**
 * A note link: the book of the note, the number of the note, and the chapter and the verse of the start of the range of
 * the note. The href of the link is that verse: docs/DESIGN.md section 22.11.
 */
export interface StudyNoteRef {
  b: string
  id: string
  c: number
  v: number
}

/** The nodes of an element after its name, and after the object of a link. */
export function childNodes(node: Exclude<StudyNode, string>): StudyNode[] {
  return (node[0] === 'ref' || node[0] === 'note' ? node.slice(2) : node.slice(1)) as StudyNode[]
}

/** One Aquifer note: its number, the chapter and the verse of the two ends of its range, and its content. */
export interface AquiferNote {
  id: string
  from: [number, number]
  to: [number, number]
  /** True for a title note. */
  title?: true
  c: StudyNode[]
}

/** One of the 132 psalms of section 20.5, with its note. */
export interface AboutPsalm extends AquiferNote {
  psalm: number
}

let cache: Promise<AboutPsalm[]> | null = null

/** The 132 psalms of section 20.5. The page gets the file with the Biblica notes file of Psalms. */
export function loadAboutPsalms(): Promise<AboutPsalm[]> {
  if (!cache) {
    const p = fetch(`${import.meta.env.BASE_URL}data/study/about-psalms.json`).then((res) => {
      if (!res.ok) throw new Error(`about-psalms.json: HTTP ${res.status}`)
      return res.json().then((data: { psalms: AboutPsalm[] }) => data.psalms)
    })
    p.catch(() => {
      cache = null
    })
    cache = p
  }
  return cache
}

/** The text of a content: each string, with no tag. The object of a link has no text. */
export function textOfNodes(nodes: readonly StudyNode[]): string {
  return nodes.map((n) => (typeof n === 'string' ? n : textOfNodes(childNodes(n)))).join('')
}

/**
 * The Aquifer credit of section 20.6, in parts for its two links. Do not change a word of it. The whole text:
 * "From the Aquifer Open Study Notes, © 2026 Mission Mutual, licensed under CC BY-SA 4.0. They are an adaptation of
 * the Tyndale Open Study Notes, © 2023 Tyndale House Publishers. The words have no changes."
 */
export const AQUIFER_CREDIT = {
  before: 'From the ',
  source: { text: 'Aquifer Open Study Notes', href: 'https://github.com/BibleAquifer/AquiferOpenStudyNotes' },
  middle: ', © 2026 Mission Mutual, licensed under ',
  license: { text: 'CC BY-SA 4.0', href: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  after: '. They are an adaptation of the Tyndale Open Study Notes, © 2023 Tyndale House Publishers. The words have no changes.',
} as const

// ---- Task 49: the study notes at the verses. docs/DESIGN.md sections 20.6, 20.7, and 20.8 ----

/**
 * One group of blocks with a note, as scripts/build-study-notes.mjs writes it: the chapter, the first verse and the
 * last verse of the group of blocks, the index of its last block on the page of each translation, and the ids of its
 * notes in the order of the source file. The rules are in src/data/studyGroups.ts. An index is null when the page of
 * that translation has no block of the group of blocks: Romans 16:25 to 16:27 of the World English Bible only.
 */
export interface StudyGroupData {
  c: number
  v: [number, number]
  end: { bsb: number; kjv: number | null; web: number | null }
  notes: string[]
}

/** The study file of a book: public/data/study/<book id>.json. */
export interface StudyFile {
  book: string
  notes: AquiferNote[]
  groups: StudyGroupData[]
}

const fileCache = new Map<string, Promise<StudyFile>>()

/** The study file of a book. The page gets it only with the switch "Study notes" on, one time for each book. */
export function loadStudyFile(id: string): Promise<StudyFile> {
  let p = fileCache.get(id)
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}data/study/${id}.json`).then((res) => {
      if (!res.ok) throw new Error(`study ${id}.json: HTTP ${res.status}`)
      return res.json() as Promise<StudyFile>
    })
    p.catch(() => fileCache.delete(id))
    fileCache.set(id, p)
  }
  return p
}

const indexes = new WeakMap<StudyFile, Map<string, AquiferNote>>()
/** The note of a study file with this number. */
export function noteById(file: StudyFile, id: string): AquiferNote | undefined {
  let index = indexes.get(file)
  if (!index) {
    index = new Map(file.notes.map((n) => [n.id, n]))
    indexes.set(file, index)
  }
  return index.get(id)
}

/** The words of a notes control: "Notes on verses 1 to 4", or "Notes on verse 5" for a group of blocks with one verse. */
export function controlWords([first, last]: readonly [number, number]): string {
  return first === last ? `Notes on verse ${first}` : `Notes on verses ${first} to ${last}`
}

/**
 * The note label of section 20.8: "Verse 3" for one verse, "Verses 19–21" for a range in one chapter, with the en
 * dash, the range label of section 19.7 for a range of more than one chapter, and "Title of the psalm" for a title note.
 */
export function noteLabel(bookName: string, note: Pick<AquiferNote, 'from' | 'to' | 'title'>): string {
  if (note.title) return 'Title of the psalm'
  const [fc, fv] = note.from
  const [tc, tv] = note.to
  if (fc !== tc) return `${bookName} ${fc}:${fv}–${tc}:${tv}`
  return fv === tv ? `Verse ${fv}` : `Verses ${fv}–${tv}`
}

/**
 * The name of the range of a note, as in the pop-ups of section 22: "Romans 6:19", "Romans 8:1-4", "Psalms 42:1-43:5",
 * and "the title of Psalm 51" for a title note. The form of the hyphen is that of the other pop-ups.
 */
export function noteRangeName(bookName: string, note: Pick<AquiferNote, 'from' | 'to' | 'title'>): string {
  if (note.title) return `the title of Psalm ${note.from[0]}`
  const [fc, fv] = note.from
  const [tc, tv] = note.to
  if (fc !== tc) return `${bookName} ${fc}:${fv}-${tc}:${tv}`
  return fv === tv ? `${bookName} ${fc}:${fv}` : `${bookName} ${fc}:${fv}-${tv}`
}

/**
 * Rule 2 of section 22.4 for a range: one whole chapter or more, or two ends in two chapters. A whole chapter starts at
 * verse 1 and ends at the last verse of the chapter in the Berean data. `lastVerse` gives that last verse.
 */
export function wholeChapters(range: { c: number; v: number; c2?: number; v2?: number }, lastVerse: (c: number) => number | undefined): boolean {
  const c2 = range.c2 ?? range.c
  const v2 = range.v2 ?? range.v
  return range.v === 1 && v2 === lastVerse(c2)
}

/** True when the pop-up of a range shows the first verse only: rule 2 of section 22.4. */
export function firstVerseOnly(range: { c: number; v: number; c2?: number; v2?: number }, lastVerse: (c: number) => number | undefined): boolean {
  return (range.c2 ?? range.c) !== range.c || wholeChapters(range, lastVerse)
}

/**
 * The title of the pop-up of a passage link, section 22.7: the name of the passage, for example "Hebrews 10:6" or
 * "Romans 8:5-9". For whole chapters: the book and the chapters, for example "Romans 5–7" with the en dash, or
 * "Romans 5" for one chapter. `whole` comes from the rule of section 22.4.
 */
export function refTitle(bookName: string, ref: StudyRef, whole: boolean): string {
  const c2 = ref.c2 ?? ref.c
  const v2 = ref.v2 ?? ref.v
  if (whole) return c2 === ref.c ? `${bookName} ${ref.c}` : `${bookName} ${ref.c}–${c2}`
  if (c2 !== ref.c) return `${bookName} ${ref.c}:${ref.v}-${c2}:${v2}`
  return v2 === ref.v ? `${bookName} ${ref.c}:${ref.v}` : `${bookName} ${ref.c}:${ref.v}-${v2}`
}

/**
 * The short credit of section 20.6, at the end of each block of notes. Do not change a word of it. The whole text:
 * "From the Aquifer Open Study Notes, licensed under CC BY-SA 4.0. Full credit". "Full credit" is a link to the Sources
 * page of the site, in the same tab.
 */
export const SHORT_CREDIT = {
  before: 'From the ',
  source: AQUIFER_CREDIT.source,
  middle: ', licensed under ',
  license: AQUIFER_CREDIT.license,
  after: '. ',
  full: 'Full credit',
} as const
