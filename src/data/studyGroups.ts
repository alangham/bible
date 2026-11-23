// The groups of blocks of a chapter, and the group of blocks of each study note. docs/DESIGN.md section 20.8,
// docs/TASKS.md Task 49 step 2. scripts/build-study-notes.mjs runs these two rules on the Berean data, and it writes
// the result into public/data/study/. The page does not run them. src/data/studyGroups.test.ts tests them.
//
// A group of blocks is a set of text blocks that the reader sees as one paragraph or one stanza. Section 20.8 and
// Task 49 say "group". In this code, "group" has that meaning only in the name StudyGroup.

/** The parts of a block of public/data/text/ that the rule uses. */
export interface RuleBlock {
  k: string
  s?: string
  c?: unknown[]
}

/** The kinds of the styles of a text block: point 2 of section 20.8. */
const KIND: Record<string, 'prose' | 'poetry' | 'list' | 'title'> = {
  p: 'prose',
  pmo: 'prose',
  q1: 'poetry',
  q2: 'poetry',
  qr: 'poetry',
  pc: 'poetry',
  qd: 'poetry',
  li1: 'list',
  li2: 'list',
  d: 'title',
}

/** One group of blocks: the index of its first block and of its last block, and the verse numbers in its blocks. */
export interface StudyGroup {
  start: number
  end: number
  verses: number[]
}

/** The verse numbers in a block: each item {v}, in order. */
export function versesOfBlock(block: RuleBlock): number[] {
  return (block.c ?? []).flatMap((item) => (item && typeof item === 'object' && typeof (item as { v?: unknown }).v === 'number' ? [(item as { v: number }).v] : []))
}

/** The groups of blocks of a chapter, by the six points of section 20.8. A style that is not in point 2 stops the rule. */
export function groupsOfChapter(blocks: readonly RuleBlock[]): StudyGroup[] {
  const groups: StudyGroup[] = []
  /** The open group and the kinds of its blocks. Null after a block that is not a text block: point 1. */
  let open: { group: StudyGroup; kinds: string[] } | null = null
  blocks.forEach((block, i) => {
    if (block.k !== 'p') {
      open = null
      return
    }
    const kind = KIND[block.s ?? '']
    if (!kind) throw new Error(`the style ${block.s} is not in point 2 of section 20.8`)
    const verses = versesOfBlock(block)
    const last = open?.kinds.at(-1)
    const join =
      open !== null &&
      kind !== 'title' && // Point 3.
      ((open.kinds.length === 1 && last === 'title') || // Point 4.
        (kind === 'poetry' && last === 'poetry') || // Point 5.
        (kind === 'list' && last === 'list'))
    if (join && open) {
      open.group.end = i
      open.group.verses.push(...verses)
      open.kinds.push(kind)
    } else {
      const group = { start: i, end: i, verses }
      groups.push(group)
      open = { group, kinds: [kind] }
    }
  })
  return groups
}

/** The parts of a note that the second rule uses. */
export interface RuleNote {
  id: string
  from: [number, number]
  title?: true
}

/**
 * The group of blocks of a note, in the chapter of its first verse: the index of the group in groupsOfChapter, or
 * null for a note of "About this chapter" of that psalm. The four points of the second rule of section 20.8.
 * `aboutHere` is true when "About this chapter" of the chapter of the first verse shows the note: point 1.
 */
export function groupOfNote(note: RuleNote, groups: readonly StudyGroup[], aboutHere: boolean): number | null {
  if (aboutHere) return null
  const withVerse = groups.findIndex((g) => g.verses.length > 0)
  if (withVerse < 0) throw new Error(`note ${note.id}: the chapter has no group of blocks with a verse`)
  if (note.title) return withVerse // Point 2.
  const verse = note.from[1]
  const exact = groups.findIndex((g) => g.verses.includes(verse))
  if (exact >= 0) return exact // Point 3.
  // Point 4: the group of the nearest verse before the first verse.
  let best = -1
  let bestVerse = -Infinity
  groups.forEach((g, i) => {
    for (const v of g.verses) if (v < verse && v > bestVerse) [best, bestVerse] = [i, v]
  })
  if (best < 0) throw new Error(`note ${note.id}: no verse of the chapter is before verse ${verse}`)
  return best
}

/** The verse numbers that start in a block: each item {v}, and each verse {o} that is not in the main text. */
function startsOfBlock(block: RuleBlock): number[] {
  return (block.c ?? []).flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const { v, o } = item as { v?: unknown; o?: unknown }
    return typeof v === 'number' ? [v] : typeof o === 'number' ? [o] : []
  })
}

/**
 * The Berean block of each block of a chapter of the King James Version or of the World English Bible: its index in
 * the Berean blocks. From section 8.3 of docs/DESIGN.md, a text block of these translations has the style of its
 * Berean block and holds the verses that start in that block, and the other blocks are those of the Berean data in
 * the same order. So:
 * - A text block with a verse goes to the Berean block where its first verse starts. Zechariah 12:1 is a title block
 *   in the Berean data and a paragraph in the two translations, so the style can differ here.
 * - A text block whose first verse does not start in the Berean chapter has no Berean block: -1, so that it is in no
 *   group of blocks. This is Romans 14:24 to 14:26 of the World English Bible: the Berean text has these verses in
 *   Romans 16. So the control of Romans 14:22 to 14:23 stays before them.
 * - Each other block goes to the next Berean block of the same kind and style.
 * A block that has no Berean block by these points stops the rule.
 */
export function alignBlocks(blocks: readonly RuleBlock[], berean: readonly RuleBlock[]): number[] {
  const out: number[] = []
  let next = 0
  for (const block of blocks) {
    const first = block.k === 'p' ? startsOfBlock(block)[0] : undefined
    let j: number
    if (first !== undefined) {
      j = berean.findIndex((b, i) => i >= next && b.k === 'p' && startsOfBlock(b).includes(first))
      if (j < 0 && !berean.some((b) => b.k === 'p' && startsOfBlock(b).includes(first))) {
        out.push(-1)
        continue
      }
    } else j = berean.findIndex((b, i) => i >= next && b.k === block.k && b.s === block.s)
    if (j < 0) throw new Error(`no Berean block for the block ${out.length} (${block.k} ${block.s ?? ''})`)
    out.push(j)
    next = j + 1
  }
  return out
}
