// The text of one chapter: section headings, paragraphs, poetry lines, verse numbers,
// and the manuscript notes. docs/DESIGN.md section 4.3, docs/TASKS.md Task 5 step 4.
// The links: docs/DESIGN.md section 7.7.
// - A mark after the verse number for each link: a solid dot for a quotation link, a ring for an echo
//   link, in the color of the group that the link goes to. In the margin-label layout, the text has no marks.
// - Below a main section heading, the cross-reference line of the Berean Standard Bible files, as the
//   publisher gives it. Each reference that has a link is a control. A reference with no link is plain
//   text. Arthur decided this on 2026-11-14.

import { Fragment, type CSSProperties, type ReactNode } from 'react'
import type { Book } from '../data/books.ts'
import { headingKey, type LinkEnd } from '../data/links.ts'
import { passageName } from '../data/passage.ts'
import { endKey, linkColor } from './linkEnds.ts'
import { isAdded, isOmitted, isVerseMark, type Block, type ChapterText, type CrossRefLine, type NoteRun } from '../data/text.ts'
import { lineParts, type LineReference } from '../data/xrefs.ts'

export interface ChapterMarks {
  verses: Map<number, LinkEnd[]>
  headings: Map<string, LinkEnd[]>
}

interface ChapterBodyProps {
  chapter: ChapterText
  /** The book list, for the names and the colors of the linked passages. */
  books?: Book[]
  marks?: ChapterMarks
  /** False: echo links are switched off, and only quotation links show. */
  echoOn?: boolean
  /** In the margin-label layout: the labels of the links at one verse, in place of the marks. */
  verseLabels?: (ends: LinkEnd[]) => ReactNode
  /**
   * The reader selected a link control. `reference` is the reference as the cross-reference line of
   * the publisher gives it, for a control in that line.
   */
  onLink?: (end: LinkEnd, control: HTMLElement, reference?: LineReference) => void
}

function Note({ runs }: { runs: NoteRun[] }) {
  return (
    <>
      {runs.map((r, i) =>
        r.s === 'q' ? <i key={i}>{r.t}</i> : r.s === 'v' ? <sup key={i} className="note-verse">{r.t}</sup> : <Fragment key={i}>{r.t}</Fragment>,
      )}
    </>
  )
}

export function ChapterBody({ chapter, books, marks, echoOn = true, verseLabels, onLink }: ChapterBodyProps) {
  const visible = (ends: LinkEnd[] | undefined) => (ends ? ends.filter((e) => echoOn || e.link.type === 'quotation') : [])
  const name = (end: LinkEnd) => (books ? passageName(books, end.there) : end.there.book)
  // The first verse after each block, for the links of section headings.
  const nextVerse: number[] = []
  let next = 0
  for (let i = chapter.blocks.length - 1; i >= 0; i--) {
    const block = chapter.blocks[i]
    if (block.k === 'p') {
      const first = block.c.find(isVerseMark)
      if (first) next = first.v
    }
    nextVerse[i] = next
  }

  const markFor = (end: LinkEnd) => (
    <button
      key={endKey(end)}
      type="button"
      className="link-mark"
      data-kind={end.link.type}
      data-link={endKey(end)}
      style={{ '--d': linkColor(books, end) } as CSSProperties}
      aria-haspopup="dialog"
      aria-label={`${end.link.type === 'quotation' ? 'Quotation link' : 'Echo link'} to ${name(end)}`}
      onClick={(e) => onLink?.(end, e.currentTarget)}
    />
  )

  // The controls after a verse number: the labels in the margin-label layout, or else the marks.
  const verseControls = (ends: LinkEnd[]) => (verseLabels ? verseLabels(ends) : ends.map(markFor))

  const refControl = (end: LinkEnd, text: string, reference?: LineReference) => (
    <button
      type="button"
      className="link-ref"
      data-kind={end.link.type}
      data-link={endKey(end)}
      style={{ color: linkColor(books, end) }}
      aria-haspopup="dialog"
      aria-label={`${end.link.type === 'quotation' ? 'Quotation link' : 'Echo link'} to ${text}`}
      onClick={(e) => onLink?.(end, e.currentTarget, reference)}
    >
      {text}
    </button>
  )

  // The line below a section heading. With the line of the publisher: that line, with a control for
  // each reference that has a link. A link end that the line does not name follows the line as a
  // control, so that no link is lost. Without a line: one control for each link end.
  const crossReferences = (allEnds: LinkEnd[], line: CrossRefLine | undefined, key: number) => {
    const parts = line && books ? lineParts(books, line, allEnds) : []
    const named = new Set(parts.map((p) => p.end))
    const rest = visible(allEnds.filter((e) => !named.has(e)))
    if (!parts.length && !rest.length) return null
    return (
      <p key={`x${key}`} className="link-line">
        {parts.map((part, i) => (
          <Fragment key={i}>
            {i > 0 && ';'}
            {part.before}
            {part.end && visible([part.end]).length ? refControl(part.end, part.shown, part.reference) : part.shown}
            {part.after}
          </Fragment>
        ))}
        {rest.map((end, i) => (
          <Fragment key={endKey(end)}>
            {(i > 0 || parts.length > 0) && <span aria-hidden="true"> · </span>}
            {refControl(end, name(end))}
          </Fragment>
        ))}
      </p>
    )
  }

  const renderBlock = (block: Block, key: number): ReactNode => {
    switch (block.k) {
      case 'h': {
        const ends = block.s === 's1' || block.s === 's2' ? (marks?.headings.get(headingKey(block.t, nextVerse[key])) ?? []) : []
        // The line of the publisher stands under a main section heading, before its first verse.
        const line = block.s === 's1' ? (chapter.xrefs ?? []).find((x) => x.v === nextVerse[key]) : undefined
        if (block.s === 's1')
          return (
            <Fragment key={key}>
              <h3 className="sh-s1">{block.t}</h3>
              {crossReferences(ends, line, key)}
            </Fragment>
          )
        if (block.s === 's2')
          return (
            <Fragment key={key}>
              <h4 className="sh-s2">{block.t}</h4>
              {crossReferences(ends, undefined, key)}
            </Fragment>
          )
        return <p key={key} className={`sh-${block.s}`}>{block.t}</p>
      }
      case 'b':
        return <div key={key} className="stanza-break" />
      case 'n':
        return (
          <div key={key} className="ms-note" role="note" data-ref={block.ref}>
            <Note runs={block.note} />
          </div>
        )
      case 'p':
        return (
          <p key={key} className={`tb tb-${block.s}`}>
            {block.c.map((item, i) => {
              if (isVerseMark(item)) {
                const ends = visible(marks?.verses.get(item.v))
                // A verse number at the start of a line hangs in the margin of a poetry line.
                const number = (
                  <sup className={i === 0 ? 'vn vn-lead' : 'vn'} data-verse={item.v}>
                    {item.v}
                  </sup>
                )
                if (!ends.length) return <Fragment key={i}>{number}</Fragment>
                // The marks stay on the line of the verse number.
                return (
                  <span key={i} className="vn-group">
                    {number}
                    {verseControls(ends)}
                  </span>
                )
              }
              if (isOmitted(item)) {
                // A link can end on a verse that is not in the main text: its mark follows the verse number.
                const ends = visible(marks?.verses.get(item.o))
                return (
                  <span key={i} className="omitted" role="note" data-verse={item.o}>
                    <sup className="vn" data-verse={item.o}>
                      {item.o}
                    </sup>
                    {verseControls(ends)}
                    <span className="omitted-note">
                      <Note runs={item.note} />
                    </span>
                  </span>
                )
              }
              // Added words show as plain words until a task adds italics. docs/TASKS.md Task 20 step 7.
              return <Fragment key={i}>{isAdded(item) ? item.a : item}</Fragment>
            })}
          </p>
        )
    }
  }

  return <div className="chapter-body">{chapter.blocks.map(renderBlock)}</div>
}
