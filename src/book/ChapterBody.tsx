// The text of one chapter: section headings, paragraphs, poetry lines, verse numbers,
// and the manuscript notes. docs/DESIGN.md section 4.3, docs/TASKS.md Task 5 step 4.

import { Fragment, type ReactNode } from 'react'
import { isOmitted, isVerseMark, type Block, type ChapterText, type NoteRun } from '../data/text.ts'

function Note({ runs }: { runs: NoteRun[] }) {
  return (
    <>
      {runs.map((r, i) =>
        r.s === 'q' ? <i key={i}>{r.t}</i> : r.s === 'v' ? <sup key={i} className="note-verse">{r.t}</sup> : <Fragment key={i}>{r.t}</Fragment>,
      )}
    </>
  )
}

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.k) {
    case 'h':
      if (block.s === 's1') return <h2 key={key} className="sh-s1">{block.t}</h2>
      if (block.s === 's2') return <h3 key={key} className="sh-s2">{block.t}</h3>
      return <p key={key} className={`sh-${block.s}`}>{block.t}</p>
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
            if (isVerseMark(item)) return <sup key={i} className="vn" data-verse={item.v}>{item.v}</sup>
            if (isOmitted(item))
              return (
                <span key={i} className="omitted" role="note" data-verse={item.o}>
                  <sup className="vn">{item.o}</sup>
                  <span className="omitted-note">
                    <Note runs={item.note} />
                  </span>
                </span>
              )
            return <Fragment key={i}>{item}</Fragment>
          })}
        </p>
      )
  }
}

export function ChapterBody({ chapter }: { chapter: ChapterText }) {
  return <div className="chapter-body">{chapter.blocks.map(renderBlock)}</div>
}
