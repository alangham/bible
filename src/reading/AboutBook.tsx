// "About this book": one control below the heading of a book. It opens the three facts of the
// introduction: What it is, Author, and Written. docs/DESIGN.md sections 4.2 and 7.5, Task 13 step 7.
// The words of the introductions come from public/data/intros.json with no change.
// From Task 40, a fourth line "Where" has one link to the map of the book, for a book in the map index.
// docs/DESIGN.md sections 15.7 item 5, 15.10 item 8, and 15.11.
// From Task 42, the last line "Video" has the links to the overview videos of BibleProject, and the credit.
// docs/DESIGN.md section 17. The video list is in the code, so the line does not wait for a file.
// From Task 43, the line of the control has the control only: the translation control of the top bar shows the
// translation. docs/DESIGN.md section 5.
// From Task 47, the line of the control can have the control "About this chapter" also, and its panel is below the
// panel of "About this book". docs/DESIGN.md sections 19.6 and 19.7.

import { useEffect, useId, useState, type ReactNode } from 'react'
import type { Intro } from '../data/intros.ts'
import { loadMapIndex } from '../map/mapData.ts'
import { BOOK_VIDEOS, VIDEO_CREDIT, videoHref } from '../data/videos.ts'
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
  /** The control and the panel of "About this chapter", for a chapter with a Biblica note. */
  chapter?: { control: ReactNode; panel: ReactNode }
}

export function AboutBook({ bookId, intro, chapter }: AboutBookProps) {
  const [open, setOpen] = useState(false)
  const hasMap = useHasMap(bookId)
  const panelId = useId()

  return (
    <div className="rd-about">
      <div className="rd-about-line">
        <button type="button" className="rd-about-control" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
          About this book <span aria-hidden="true">›</span>
        </button>
        {chapter?.control}
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
              <VideoLine bookId={bookId} />
            </dl>
          </>
        )}
      </div>
      {chapter?.panel}
    </div>
  )
}

/** The words of each link to a video: section 17.3. The name for a screen reader adds ", on YouTube, in a new tab". */
const LINK_WORDS: Record<number, string[]> = {
  1: ['BibleProject overview'],
  2: ['BibleProject overview, part 1', 'BibleProject overview, part 2'],
}

/**
 * The line "Video": one or two links to a video on YouTube, each in a new tab, and below them the credit to
 * BibleProject, with the sentence of the shared video before it. docs/DESIGN.md sections 17.3 and 17.4.
 */
function VideoLine({ bookId }: { bookId: string }) {
  const entry = BOOK_VIDEOS[bookId]
  if (!entry) return null
  return (
    <div className="rd-fact rd-video">
      <dt>Video</dt>
      <dd>
        {entry.videos.map((id, n) => (
          <a
            key={id}
            className="rd-video-link"
            href={videoHref(id)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${LINK_WORDS[entry.videos.length][n]}, on YouTube, in a new tab`}
          >
            {LINK_WORDS[entry.videos.length][n]} <span aria-hidden="true">›</span>
          </a>
        ))}
        <VideoCredit className="rd-video-credit" shared={entry.shared} />
      </dd>
    </div>
  )
}

/** The credit of section 17.3, with no change to its words. The Sources page shows it also. */
export function VideoCredit({ className, shared }: { className?: string; shared?: string }) {
  return (
    <p className={className}>
      {shared && `${shared} `}
      {VIDEO_CREDIT.before}
      <a href={VIDEO_CREDIT.href} target="_blank" rel="noopener noreferrer" aria-label={`${VIDEO_CREDIT.link}, in a new tab`}>
        {VIDEO_CREDIT.link}
      </a>
      {VIDEO_CREDIT.after}
    </p>
  )
}
