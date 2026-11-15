// "About this book": one control below the heading of a book. It opens the three facts of the
// introduction: What it is, Author, and Written. docs/DESIGN.md sections 4.2 and 7.5, Task 13 step 7.
// The words of the introductions come from public/data/intros.json with no change.

import { useId, useState } from 'react'
import type { Intro } from '../data/intros.ts'
import { Fact } from './Fact.tsx'

interface AboutBookProps {
  /** Undefined while the introductions load. Null if they did not load. */
  intro: Intro | null | undefined
  /** The name of the translation, shown on the same line. docs/DESIGN.md section 5. */
  translation?: string
}

export function AboutBook({ intro, translation }: AboutBookProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="rd-about">
      <div className="rd-about-line">
        <button type="button" className="rd-about-control" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
          About this book <span aria-hidden="true">›</span>
        </button>
        {translation && <span className="rd-translation">{translation}</span>}
      </div>
      <div id={panelId} className="rd-about-panel" role="region" aria-label="About this book" hidden={!open}>
        {intro === null && <p role="alert">The introduction did not load.</p>}
        {intro && (
          <>
            {intro.review !== 'approved' && (
              <p className="rd-draft">
                <span>Draft</span> This introduction is not reviewed yet.
              </p>
            )}
            <dl className="rd-facts">
              <Fact label="What it is" text={intro.whatItIs} />
              <Fact label="Author" text={intro.author} detail={intro.authorDetail} />
              <Fact label="Written" text={intro.written} detail={intro.writtenDetail} />
            </dl>
          </>
        )}
      </div>
    </div>
  )
}
