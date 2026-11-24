// The pop-ups of the links in the study notes. docs/DESIGN.md sections 22.7 and 22.8, docs/TASKS.md Task 55 steps 7 and
// 8. Each one is the link pop-up of section 7.7, in the frame of src/book/LinkPopup.tsx, with its own lines:
// - A passage link: the passage, the kind line "Reference in the study note on Romans 8:3", the label "First verse" by
//   rule 2 of section 22.4, the text in the selected translation, and the source line.
// - A note link: the range of the note, the kind line "Study note, from the notes on Romans 8:3", the text of the range
//   by the rule of section 22.4, and the note with its note label and the short credit. The references in that note
//   are plain text. The page gets the study file of the book of the note when the pop-up opens.

import { useEffect, useRef, useState } from 'react'
import type { Book } from '../data/books.ts'
import { lastVerseOf, type PassageRange } from '../data/passage.ts'
import { firstVerseOnly, loadStudyFile, noteById, noteLabel, noteRangeName, refTitle, wholeChapters, type AquiferNote, type StudyRef } from '../data/studyNotes.ts'
import { loadBookText, type BookText } from '../data/text.ts'
import { StudyContent } from '../reading/StudyContent.tsx'
import { ShortCredit } from '../reading/StudyNotes.tsx'
import type { StudyLinkFrom, StudyLinkTarget } from '../reading/studyLinks.ts'
import { bookHref, chapterHref } from '../router.ts'
import type { ScreenLayout } from '../screenLayout.ts'
import type { Stop } from '../travel/trail.ts'
import { LinkedText, PopupFrame } from './LinkPopup.tsx'
import { useScrolls } from './useScrolls.ts'

interface StudyPopupProps {
  books: Book[]
  target: StudyLinkTarget
  anchor: HTMLElement
  layout: ScreenLayout
  /** "Go there": travel from the note that has the link to the first verse of the passage or of the note. */
  onGo: (from: Stop, to: Stop) => void
  onClose: () => void
}

/** The source line of section 22.7. */
export const STUDY_SOURCE_LINE = 'The reference is from the Aquifer Open Study Notes.'

const nameOf = (books: Book[], id: string) => books.find((b) => b.id === id)?.name ?? id

/** The place of the note that has the link, for the trail: the first verse of its range. */
const stopOf = (from: StudyLinkFrom): Stop => ({ book: from.book, c: from.from[0], v: from.from[1] })

/**
 * The Berean text of a book, for the rule of whole chapters of section 22.4: "the last verse of the chapter in the
 * Berean data". Null until it loads, and if it does not load.
 */
function useBereanText(book: string): BookText | null {
  const [text, setText] = useState<{ book: string; text: BookText } | null>(null)
  useEffect(() => {
    let live = true
    loadBookText(book, 'bsb').then(
      (t) => live && setText({ book, text: t }),
      () => {},
    )
    return () => {
      live = false
    }
  }, [book])
  return text?.book === book ? text.text : null
}

export function StudyPopup(props: StudyPopupProps) {
  return props.target.kind === 'ref' ? <PassagePopup {...props} link={props.target.ref} /> : <NotePopup {...props} />
}

/** The pop-up of a passage link: section 22.7. */
function PassagePopup({ books, target, link, anchor, layout, onGo, onClose }: StudyPopupProps & { link: StudyRef }) {
  const berean = useBereanText(link.b)
  const name = nameOf(books, link.b)
  // The title of a link with "first" needs the Berean text: whole chapters, or a passage in two chapters. Until it loads,
  // the title is "…", so that the title does not change from one form to the other.
  const whole = link.first === true && berean !== null && wholeChapters(link, (c) => lastVerseOf(berean, c))
  const title = link.first && berean === null ? '…' : refTitle(name, link, whole)
  const passage: PassageRange = link.first ? { book: link.b, c: link.c, v: link.v } : { book: link.b, c: link.c, v: link.v, c2: link.c2, v2: link.v2 }
  return (
    <PopupFrame
      books={books}
      book={link.b}
      title={title}
      goHref={chapterHref(link.b, link.c, link.v)}
      onGo={() => onGo(stopOf(target.from), { book: link.b, c: link.c, v: link.v })}
      anchor={anchor}
      layout={layout}
      onClose={onClose}
    >
      <p className="pop-kind">Reference in the study note on {noteRangeName(nameOf(books, target.from.book), target.from)}</p>
      {link.first && <p className="pop-first">First verse</p>}
      <LinkedText books={books} passage={passage} name={title} />
      <p className="pop-source">{STUDY_SOURCE_LINE}</p>
    </PopupFrame>
  )
}

type NoteState = { book: string; id: string } & ({ note: AquiferNote } | { failed: true })

/** The pop-up of a note link: section 22.8. */
function NotePopup({ books, target, anchor, layout, onGo, onClose }: StudyPopupProps) {
  const link = target.kind === 'note' ? target.note : null
  const book = link?.b ?? target.from.book
  const id = link?.id ?? ''
  const [state, setState] = useState<NoteState | null>(null)
  useEffect(() => {
    let live = true
    loadStudyFile(book).then(
      (file) => {
        if (!live) return
        const note = noteById(file, id)
        setState(note ? { book, id, note } : { book, id, failed: true })
      },
      () => live && setState({ book, id, failed: true }),
    )
    return () => {
      live = false
    }
  }, [book, id])
  const berean = useBereanText(book)
  const name = nameOf(books, book)
  const current = state && state.book === book && state.id === id ? state : null
  const note = current && 'note' in current ? current.note : null
  const failed = current !== null && 'failed' in current
  const range = note ? { c: note.from[0], v: note.from[1], c2: note.to[0], v2: note.to[1] } : null
  // The rule of section 22.4 for the range of the note. A range in two chapters needs no Berean text. A range in one
  // chapter waits for the Berean text, so that the pop-up does not show all verses of a whole chapter first.
  const ruleKnown = range !== null && (range.c2 !== range.c || berean !== null)
  const first = range !== null && (range.c2 !== range.c || (berean !== null && firstVerseOnly(range, (c) => lastVerseOf(berean, c))))
  // While the note loads, and if it does not load, the title is "Study note": the name of the dialog for a screen reader.
  const title = note ? noteRangeName(name, note) : 'Study note'
  return (
    <PopupFrame
      books={books}
      book={book}
      title={title}
      // The first verse of the range of the note: the link has it from the start, section 22.11.
      goHref={link ? chapterHref(book, link.c, link.v) : bookHref(book)}
      onGo={link ? () => onGo(stopOf(target.from), { book, c: link.c, v: link.v }) : undefined}
      anchor={anchor}
      layout={layout}
      onClose={onClose}
    >
      <p className="pop-kind">Study note, from the notes on {noteRangeName(nameOf(books, target.from.book), target.from)}</p>
      {note && range && (
        <>
          {ruleKnown && first && <p className="pop-first">First verse</p>}
          {ruleKnown ? <LinkedText books={books} passage={first ? { book, c: range.c, v: range.v } : { book, ...range }} name={title} /> : <p className="pop-text">…</p>}
          <NoteArea bookName={name} note={note} title={title} />
        </>
      )}
      {failed && (
        <p className="pop-note-failed" role="alert">
          The note did not load.
        </p>
      )}
      {!current && <p className="pop-text">…</p>}
    </PopupFrame>
  )
}

/**
 * The note in the pop-up: a rule on the left, the note label, the content with its references as plain text, and the
 * short credit. If the note does not fit, the area scrolls and takes the keyboard focus, as the text area does.
 */
function NoteArea({ bookName, note, title }: { bookName: string; note: AquiferNote; title: string }) {
  const area = useRef<HTMLDivElement>(null)
  const scrolls = useScrolls(area, note)
  return (
    <div ref={area} className="pop-note" data-note={note.id} {...(scrolls ? { tabIndex: 0, role: 'region', 'aria-label': `Study note on ${title}` } : {})}>
      <p className="rd-note-label">{noteLabel(bookName, note)}</p>
      <StudyContent nodes={note.c} />
      <ShortCredit />
    </div>
  )
}
