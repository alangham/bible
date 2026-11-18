// "About this book": one control below the heading of a book. It opens the three facts of the
// introduction: What it is, Author, and Written. docs/DESIGN.md sections 4.2 and 7.5, Task 13 step 7.
// The words of the introductions come from public/data/intros.json with no change.
// From Task 40, a fourth line "Where" has one link to the map of the book, for a book in the map index.
// docs/DESIGN.md sections 15.7 item 5, 15.10 item 8, and 15.11.

import { useEffect, useId, useState } from 'react'
import type { Intro } from '../data/intros.ts'
import { loadMapIndex } from '../map/mapData.ts'
import { mapHref } from '../router.ts'
import { Fact } from './Fact.tsx'

/** True if the book is in the map index. False while the index loads, and if it did not load. */
function useHasMap(bookId: string): boolean {
  const [has, setHas] = useState<{ id: string; yes: boolean } | null>(null)
  useEffect(() => {
    let live = true
    loadMapIndex().then(
      (index) => live && setHas({ id: bookId, yes: index.books.some((b) => b.book === bookId) }),
      () => live && setHas({ id: bookId, yes: false }),
    )
    return () => {
      live = false
    }
  }, [bookId])
  return has?.id === bookId && has.yes
}

interface AboutBookProps {
  /** The id of the book, for the line "Where". */
  bookId: string
  /** Undefined while the introductions load. Null if they did not load. */
  intro: Intro | null | undefined
  /** The name of the translation, shown on the same line. docs/DESIGN.md section 5. */
  translation?: string
}

export function AboutBook({ bookId, intro, translation }: AboutBookProps) {
  const [open, setOpen] = useState(false)
  const hasMap = useHasMap(bookId)
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
              {hasMap && (
                <div className="rd-fact">
                  <dt>Where</dt>
                  <dd>
                    <a className="rd-where-link" href={mapHref(bookId)}>
                      The places of this book <span aria-hidden="true">›</span>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </>
        )}
      </div>
    </div>
  )
}
