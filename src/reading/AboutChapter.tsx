// "About this chapter": the control below the heading of a chapter, and the panel with the Biblica notes of the
// chapter and the note credit. docs/DESIGN.md sections 19.6, 19.7, and 19.8, docs/TASKS.md Task 47 step 7.
// The words of each Biblica note come from public/data/notes/ with no change. The panel is closed when the chapter
// loads, and the site does not store its state. Each chapter has its own state.

import { useId, useState, type ReactNode } from 'react'
import { NOTE_CREDIT, rangeLabel, type BiblicaNote } from '../data/notes.ts'

interface AboutChapterProps {
  bookName: string
  chapter: number
  /** The notes of the chapter. Null if the notes file did not load. */
  notes: BiblicaNote[] | null
}

/**
 * The control and the panel of "About this chapter", as two parts. In a chapter with the full heading, the control
 * is on the line of "About this book" and the panel is below the panel of "About this book": src/reading/AboutBook.tsx
 * puts the two parts there. In a later chapter, src/reading/ChapterSection.tsx puts them on their own line.
 */
export function useAboutChapter({ bookName, chapter, notes }: AboutChapterProps): { control: ReactNode; panel: ReactNode } {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const control = (
    <button type="button" className="rd-about-control rd-chapter-control" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
      About this chapter <span aria-hidden="true">›</span>
    </button>
  )
  const panel = (
    <div id={panelId} className="rd-about-panel rd-notes" role="region" aria-label={`About ${bookName} ${chapter}`} hidden={!open}>
      {notes === null ? (
        <p role="alert">The notes did not load.</p>
      ) : (
        <>
          {notes.map((note) => (
            <div key={note.id} className="rd-note" data-note={note.id}>
              <h3 className="rd-range-label">{rangeLabel(bookName, note)}</h3>
              {note.p.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          ))}
          {noteCredit()}
        </>
      )}
    </div>
  )
  return { control, panel }
}

/** The note credit of section 19.8, with no change to its words. Each link opens in a new tab. A function, not a component: this file exports the hook only. */
function noteCredit() {
  return (
    <p className="rd-note-credit">
      {NOTE_CREDIT.before}
      <a href={NOTE_CREDIT.source.href} target="_blank" rel="noopener noreferrer" aria-label={`${NOTE_CREDIT.source.text}, in a new tab`}>
        {NOTE_CREDIT.source.text}
      </a>
      {NOTE_CREDIT.middle}
      <a href={NOTE_CREDIT.license.href} target="_blank" rel="noopener noreferrer" aria-label={`${NOTE_CREDIT.license.text}, in a new tab`}>
        {NOTE_CREDIT.license.text}
      </a>
      {NOTE_CREDIT.after}
    </p>
  )
}
