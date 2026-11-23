// "About this chapter": the control below the heading of a chapter, and the panel with the notes of the chapter and
// a credit. docs/DESIGN.md sections 19.6, 19.7, 19.8, 20.5, and 20.6, docs/TASKS.md Task 47 step 7 and Task 48 step 7.
// A panel has the Biblica notes of the chapter and the note credit, or, for 132 psalms, one Aquifer note and the
// Aquifer credit. A panel never has the two kinds of note. The words of each note come from public/data/notes/ or
// public/data/study/ with no change. The panel is closed when the chapter loads, and the site does not store its
// state. Each chapter has its own state.

import { useId, useState, type ReactNode } from 'react'
import { NOTE_CREDIT, rangeLabel, type BiblicaNote } from '../data/notes.ts'
import { AQUIFER_CREDIT, type AquiferNote, type StudyNode } from '../data/studyNotes.ts'

/** The notes of a chapter: its Biblica notes, or the Aquifer note of a psalm of section 20.5. Null if a file did not load. */
export type ChapterNotes = { kind: 'biblica'; notes: BiblicaNote[] } | { kind: 'aquifer'; note: AquiferNote } | null

interface AboutChapterProps {
  bookName: string
  chapter: number
  notes: ChapterNotes
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
  let content: ReactNode
  if (notes === null) content = <p role="alert">The notes did not load.</p>
  else if (notes.kind === 'biblica')
    content = (
      <>
        {notes.notes.map((note) => (
          <div key={note.id} className="rd-note" data-note={note.id}>
            <h3 className="rd-range-label">{rangeLabel(bookName, note)}</h3>
            {note.p.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        ))}
        {credit(NOTE_CREDIT)}
      </>
    )
  else
    content = (
      <>
        <div className="rd-note rd-aquifer" data-note={notes.note.id}>
          <h3 className="rd-range-label">{rangeLabel(bookName, notes.note)}</h3>
          {studyContent(notes.note.c)}
        </div>
        {credit(AQUIFER_CREDIT)}
      </>
    )
  const panel = (
    <div id={panelId} className="rd-about-panel rd-notes" role="region" aria-label={`About ${bookName} ${chapter}`} hidden={!open}>
      {content}
    </div>
  )
  return { control, panel }
}

interface Credit {
  before: string
  source: { text: string; href: string }
  middle: string
  license: { text: string; href: string }
  after: string
}

/**
 * The note credit of section 19.8, or the Aquifer credit of section 20.6, with no change to its words. Each link
 * opens in a new tab. A function, not a component: this file exports the hook only.
 */
function credit(c: Credit) {
  return (
    <p className="rd-note-credit">
      {c.before}
      <a href={c.source.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.source.text}, in a new tab`}>
        {c.source.text}
      </a>
      {c.middle}
      <a href={c.license.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.license.text}, in a new tab`}>
        {c.license.text}
      </a>
      {c.after}
    </p>
  )
}

/**
 * The elements of a content, with no attribute: point 1 of section 20.3. React puts each string into the page as
 * text. A name that is not of point 1 makes no element.
 */
function studyContent(nodes: readonly StudyNode[]): ReactNode[] {
  return nodes.map((node, i) => {
    if (typeof node === 'string') return node
    const [name, ...children] = node
    switch (name) {
      case 'p':
        return <p key={i}>{studyContent(children)}</p>
      case 'ul':
        return <ul key={i}>{studyContent(children)}</ul>
      case 'ol':
        return <ol key={i}>{studyContent(children)}</ol>
      case 'li':
        return <li key={i}>{studyContent(children)}</li>
      case 'em':
        return <em key={i}>{studyContent(children)}</em>
      case 'strong':
        return <strong key={i}>{studyContent(children)}</strong>
      case 'sup':
        return <sup key={i}>{studyContent(children)}</sup>
      case 'br':
        return <br key={i} />
      default:
        return null
    }
  })
}
