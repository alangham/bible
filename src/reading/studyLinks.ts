// The links in the study notes. docs/DESIGN.md section 22, docs/TASKS.md Task 55. The reading page gives each link
// the books and the function that opens the pop-up of section 22.7 or 22.8, by one React context.

import { createContext } from 'react'
import type { Book } from '../data/books.ts'
import type { AquiferNote, StudyNoteRef, StudyRef } from '../data/studyNotes.ts'

/** The note that has the link: its book and its range. The kind line of a pop-up names it, and travel starts there. */
export interface StudyLinkFrom extends Pick<AquiferNote, 'from' | 'to' | 'title'> {
  book: string
}

/** The link that opened a pop-up: a passage link or a note link, and the note that has it. */
export type StudyLinkTarget = { kind: 'ref'; ref: StudyRef; from: StudyLinkFrom } | { kind: 'note'; note: StudyNoteRef; from: StudyLinkFrom }

export interface StudyLinks {
  books: Book[]
  /** Opens the pop-up of a link. The anchor is the link, to place the pop-up and to give the focus back. */
  open: (target: StudyLinkTarget, anchor: HTMLElement) => void
}

/** Null where no reading page gives the context: a link then follows its href. */
export const StudyLinkContext = createContext<StudyLinks | null>(null)
