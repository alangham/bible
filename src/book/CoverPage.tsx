// The cover: the book page. Mockup D2, docs/DESIGN.md section 4.2.
//
// The closed book is drawn in 3D. The same book is also in the page as text:
// the group, the name (the page heading), and the number of chapters. Screen
// readers read that text. Without WebGL, that text shows as a flat book.

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { groupOf, type Book } from '../data/books.ts'
import type { Intro } from '../data/intros.ts'
import { chapterHref } from '../router.ts'
import { SceneBoundary } from '../table/SceneBoundary.tsx'
import { hasWebGL } from '../table/webgl.ts'
import { useReducedMotion } from '../useReducedMotion.ts'
import { CoverFact } from './CoverFact.tsx'
import { COVER_LABEL_FONT, COVER_TITLE_FONT, coverInk } from './coverTexture.ts'
import { CoverScene } from './CoverScene.tsx'
import { clearHandoff, peekHandoff } from './handoff.ts'

interface CoverPageProps {
  book: Book
  /** Undefined while the introductions load. Null if they did not load. */
  intro: Intro | null | undefined
}

export function CoverPage({ book, intro }: CoverPageProps) {
  const group = groupOf(book)
  const reducedMotion = useReducedMotion()
  const [webgl, setWebgl] = useState(hasWebGL)
  const [fontsReady, setFontsReady] = useState(false)
  // The landing runs only when the reader came from the spine, and not with reduced motion.
  const [start] = useState(() => (reducedMotion ? null : (peekHandoff(book.id)?.rect ?? null)))
  // Without the landing, the text below the book shows at once.
  const [landed, setLanded] = useState(() => start === null || !webgl)
  const stageRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState<{ center: { x: number; y: number }; coverPx: number } | null>(null)

  useEffect(() => {
    clearHandoff()
    // The rectangle of the spine is in viewport px. The canvas starts at the top of the page.
    window.scrollTo(0, 0)
  }, [])

  // The cover textures need the fonts before they are drawn.
  useEffect(() => {
    let live = true
    Promise.all([
      document.fonts.load(`italic 600 48px ${COVER_TITLE_FONT}`),
      document.fonts.load(`700 24px ${COVER_TITLE_FONT}`),
      document.fonts.load(`600 14px ${COVER_LABEL_FONT}`),
    ])
      .catch(() => undefined)
      .then(() => live && setFontsReady(true))
    return () => {
      live = false
    }
  }, [])

  // The book lies in the stage. Measure it for the camera.
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => {
      const page = el.offsetParent as HTMLElement | null
      const top = el.getBoundingClientRect().top - (page?.getBoundingClientRect().top ?? 0)
      const width = document.documentElement.clientWidth
      const height = el.clientHeight
      // Mockup D2: a cover 480 px high. Smaller where the stage or the screen is smaller.
      const coverPx = Math.min(440, height * 0.86, width * 0.62 * (224 / 150))
      setStage({ center: { x: width / 2, y: top + height / 2 }, coverPx })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // If WebGL fails, the flat book shows and the landing does not run.
  const onSceneError = useCallback(() => {
    setWebgl(false)
    setLanded(true)
  }, [])
  const onLanded = useCallback(() => setLanded(true), [])

  const mode = webgl ? '3d' : 'flat'
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1)
  const bookStyle = { '--cloth': group.cloth, '--cover-ink': coverInk(group) } as CSSProperties

  return (
    <main className="cover-page" data-mode={mode} data-landed={landed}>
      {webgl && fontsReady && stage && (
        <SceneBoundary onError={onSceneError}>
          <CoverScene book={book} center={stage.center} coverPx={stage.coverPx} start={start} onLanded={onLanded} />
        </SceneBoundary>
      )}
      <div className="cover-inner">
        <nav className="cover-bar" aria-label="Pages">
          <a href="#/">Back to the table</a>
        </nav>

        <div className="cover-stage" ref={stageRef}>
          <div className="cover-book" style={bookStyle}>
            <div className="cover-frame">
              <p className="cover-group">{group.name}</p>
              <div className="cover-emblem" aria-hidden="true">
                <span className="cover-arch" />
                <span className="cover-rule" />
              </div>
              <h1 className="cover-title">{book.name}</h1>
              <p className="cover-chapters">
                {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
              </p>
            </div>
          </div>
        </div>

        <a className="open-book" href={chapterHref(book.id, 1)}>
          Open the book
        </a>

        <section className="cover-facts" aria-label="About this book">
          {intro === null && <p role="alert">The introduction did not load.</p>}
          {intro && (
            <>
              {intro.review !== 'approved' && (
                <p className="draft-label">
                  <span>Draft</span> This introduction is not reviewed yet.
                </p>
              )}
              <dl className="facts">
                <CoverFact label="Author" text={intro.author} detail={intro.authorDetail} />
                <CoverFact label="Written" text={intro.written} detail={intro.writtenDetail} />
                <CoverFact label="What it is" text={intro.whatItIs} />
              </dl>
            </>
          )}
        </section>

        <nav className="chapter-list" aria-labelledby="chapters-heading">
          <h2 id="chapters-heading">Chapters</h2>
          <ol>
            {chapters.map((n) => (
              <li key={n}>
                <a href={chapterHref(book.id, n)} aria-label={`${book.name} chapter ${n}`}>
                  {n}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </main>
  )
}
