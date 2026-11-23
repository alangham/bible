// The Biblica notes of "About this chapter". docs/DESIGN.md section 19, docs/TASKS.md Task 47.
// The files public/data/notes/<book id>.json come from scripts/build-notes.mjs, with the words of the Biblica Study
// Notes and no change. The page gets the file of a book with the text and the links of its first chapter on the
// page, because the attribute data-loaded of a chapter waits for it: section 19.6.

/** One Biblica note: its number, the chapter and the verse of the two ends of its range, and its paragraphs. */
export interface BiblicaNote {
  id: string
  from: [number, number]
  to: [number, number]
  p: string[]
}

export interface BookNotes {
  book: string
  notes: BiblicaNote[]
}

const cache = new Map<string, Promise<BookNotes>>()

export function loadBookNotes(id: string): Promise<BookNotes> {
  let p = cache.get(id)
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}data/notes/${id}.json`).then((res) => {
      if (!res.ok) throw new Error(`notes ${id}.json: HTTP ${res.status}`)
      return res.json() as Promise<BookNotes>
    })
    p.catch(() => cache.delete(id))
    cache.set(id, p)
  }
  return p
}

/**
 * The notes that a chapter shows: section 19.5. Each note whose range has a verse of the chapter: the chapter is
 * not less than the chapter of from and not more than the chapter of to. In the order of the file.
 */
export function notesOfChapter(notes: readonly BiblicaNote[], chapter: number): BiblicaNote[] {
  return notes.filter((n) => n.from[0] <= chapter && chapter <= n.to[0])
}

/**
 * The range label of section 19.7: the name of the book, a space, and the range, with the en dash U+2013.
 * "Romans 8:1–17" for a range in one chapter, and "Genesis 21:1–22:24" for a range of more than one chapter.
 */
export function rangeLabel(bookName: string, note: Pick<BiblicaNote, 'from' | 'to'>): string {
  const [fc, fv] = note.from
  const [tc, tv] = note.to
  return fc === tc ? `${bookName} ${fc}:${fv}–${tv}` : `${bookName} ${fc}:${fv}–${tc}:${tv}`
}

/**
 * The note credit of section 19.8, in parts for its two links. Do not change a word of it. The whole text:
 * "From the Biblica Study Notes, © 2023 Biblica Inc., licensed under CC BY-SA 4.0. The words have no changes."
 */
export const NOTE_CREDIT = {
  before: 'From the ',
  source: { text: 'Biblica Study Notes', href: 'https://github.com/BibleAquifer/BiblicaStudyNotes' },
  middle: ', © 2023 Biblica Inc., licensed under ',
  license: { text: 'CC BY-SA 4.0', href: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  after: '. The words have no changes.',
} as const
