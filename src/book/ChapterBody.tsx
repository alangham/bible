// The text of one chapter: section headings, paragraphs, poetry lines, verse numbers,
// and the manuscript notes. docs/DESIGN.md section 4.3, docs/TASKS.md Task 5 step 4.
// The marks of links: on the verse, after the verse number, and on a section heading. docs/DESIGN.md section 4.5.

import { Fragment, type ReactNode } from 'react'
import { headingKey, type LinkEnd } from '../data/links.ts'
import { isOmitted, isVerseMark, type Block, type ChapterText, type NoteRun } from '../data/text.ts'

export interface ChapterMarks {
  verses: Map<number, LinkEnd[]>
  headings: Map<string, LinkEnd[]>
}

interface ChapterBodyProps {
  chapter: ChapterText
  marks?: ChapterMarks
  /** False: echo links are switched off, and only quotation links show. */
  echoOn?: boolean
  /** The reader selected a mark. */
  onMark?: (ends: LinkEnd[], title: string, button: HTMLElement) => void
  /** The book name, for the labels of the marks. */
  bookName?: string
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

function Mark({ ends, title, onMark }: { ends: LinkEnd[]; title: string; onMark?: ChapterBodyProps['onMark'] }) {
  const quotation = ends.filter((e) => e.link.type === 'quotation').length
  const echo = ends.length - quotation
  const parts = [quotation && `${quotation} quotation ${quotation === 1 ? 'link' : 'links'}`, echo && `${echo} echo ${echo === 1 ? 'link' : 'links'}`].filter(Boolean)
  return (
    <button
      type="button"
      className="link-mark"
      data-kind={quotation ? 'quotation' : 'echo'}
      aria-haspopup="dialog"
      aria-label={`Links of ${title}: ${parts.join(', ')}`}
      onClick={(e) => onMark?.(ends, title, e.currentTarget)}
    />
  )
}

export function ChapterBody({ chapter, marks, echoOn = true, onMark, bookName = '' }: ChapterBodyProps) {
  const visible = (ends: LinkEnd[] | undefined) => (ends ? ends.filter((e) => echoOn || e.link.type === 'quotation') : [])
  // The first verse after each block, for the marks on section headings.
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

  const renderBlock = (block: Block, key: number): ReactNode => {
    switch (block.k) {
      case 'h': {
        const ends = block.s === 's1' || block.s === 's2' ? visible(marks?.headings.get(headingKey(block.t, nextVerse[key]))) : []
        const mark = ends.length ? <Mark ends={ends} title={`the section “${block.t}”`} onMark={onMark} /> : null
        if (block.s === 's1')
          return (
            <h2 key={key} className="sh-s1">
              {block.t}
              {mark}
            </h2>
          )
        if (block.s === 's2')
          return (
            <h3 key={key} className="sh-s2">
              {block.t}
              {mark}
            </h3>
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
                return (
                  <Fragment key={i}>
                    <sup className="vn" data-verse={item.v}>
                      {item.v}
                    </sup>
                    {ends.length > 0 && <Mark ends={ends} title={`${bookName} ${chapter.n}:${item.v}`} onMark={onMark} />}
                  </Fragment>
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
                    {ends.length > 0 && <Mark ends={ends} title={`${bookName} ${chapter.n}:${item.o}`} onMark={onMark} />}
                    <span className="omitted-note">
                      <Note runs={item.note} />
                    </span>
                  </span>
                )
              }
              return <Fragment key={i}>{item}</Fragment>
            })}
          </p>
        )
    }
  }

  return <div className="chapter-body">{chapter.blocks.map(renderBlock)}</div>
}
