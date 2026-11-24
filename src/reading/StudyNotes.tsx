// The study notes at the verses: the notes control after a group of blocks, and the block of notes below it.
// docs/DESIGN.md sections 20.6 and 20.8, docs/TASKS.md Task 49 step 5. The page shows them only with the switch "Study
// notes" on. The words of each note come from public/data/study/ with no change. The block is closed when the chapter
// loads, and the site does not store its state. Each control has its own state. From Task 55, the references in a note
// are links: docs/DESIGN.md section 22.6.

import { useId, useState } from 'react'
import { controlWords, noteLabel, SHORT_CREDIT, type AquiferNote, type StudyGroupData } from '../data/studyNotes.ts'
import { sourcesHref } from '../router.ts'
import { StudyContent } from './StudyContent.tsx'

interface StudyBlockProps {
  /** The book of the chapter, for the links of section 22. */
  bookId: string
  bookName: string
  chapter: number
  group: StudyGroupData
  /** The notes of the group of blocks, in the order of the source file. */
  notes: AquiferNote[]
}

/** One notes control and its block of notes. ChapterSection puts it directly after the last block of its group of blocks. */
export function StudyBlock({ bookId, bookName, chapter, group, notes }: StudyBlockProps) {
  const [open, setOpen] = useState(false)
  const blockId = useId()
  const words = controlWords(group.v)
  return (
    <div className="rd-study" data-open={open} data-verses={`${group.v[0]}-${group.v[1]}`}>
      <button type="button" className="rd-study-control" aria-expanded={open} aria-controls={blockId} onClick={() => setOpen((o) => !o)}>
        {words} <span aria-hidden="true">›</span>
      </button>
      <div id={blockId} className="rd-study-block" role="region" aria-label={`${words} of ${bookName} ${chapter}`} hidden={!open}>
        {notes.map((note) => (
          <div key={note.id} className="rd-study-note" data-note={note.id}>
            <p className="rd-note-label">{noteLabel(bookName, note)}</p>
            <StudyContent nodes={note.c} from={{ book: bookId, from: note.from, to: note.to, title: note.title }} />
          </div>
        ))}
        <ShortCredit />
      </div>
    </div>
  )
}

/** The short credit of section 20.6, with no change to its words: at the end of a block of notes, and in the pop-up of a note link. */
export function ShortCredit() {
  return (
    <p className="rd-short-credit">
      {SHORT_CREDIT.before}
      <a href={SHORT_CREDIT.source.href} target="_blank" rel="noopener noreferrer" aria-label={`${SHORT_CREDIT.source.text}, in a new tab`}>
        {SHORT_CREDIT.source.text}
      </a>
      {SHORT_CREDIT.middle}
      <a href={SHORT_CREDIT.license.href} target="_blank" rel="noopener noreferrer" aria-label={`${SHORT_CREDIT.license.text}, in a new tab`}>
        {SHORT_CREDIT.license.text}
      </a>
      {SHORT_CREDIT.after}
      <a href={sourcesHref()}>{SHORT_CREDIT.full}</a>
    </p>
  )
}
