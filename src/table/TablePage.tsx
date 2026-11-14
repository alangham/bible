// The table: the landing page. Mockup D1, docs/DESIGN.md section 4.1.
//
// The spines are drawn in 3D. Each spine is also a real `a` element that lies
// over the spine on screen, so that keyboard and screen reader users can use it.
// Without WebGL, the `a` elements show as flat spines.
//
// The narrow layout, below 900 px, shows one stack at a time with flat spines of 44 px or more.
// The reader moves between stacks by swipe, or with the two stack buttons. docs/DESIGN.md section 4.1.

import gsap from 'gsap'
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import type { ScreenLayout } from '../screenLayout.ts'
import { clearHandoff, setHandoff } from '../book/handoff.ts'
import { groupOf, spineThickness, type Book, type GroupName } from '../data/books.ts'
import { bookHref, sourcesHref, timelineHref } from '../router.ts'
import { useReducedMotion } from '../useReducedMotion.ts'
import { layoutTable, spineOffsetPx } from './layout.ts'
import { Legend } from './Legend.tsx'
import { SPINE_FONT_FAMILY, spineFontPx } from './spineFont.ts'
import { SceneBoundary } from './SceneBoundary.tsx'
import type { SpineRect } from './TableScene.tsx'

// The 3D code loads as a separate chunk, so that the first load does not wait for it. Task 9 step 5.
const TableScene = lazy(() => import('./TableScene.tsx').then((m) => ({ default: m.TableScene })))
import { hasWebGL } from './webgl.ts'

const STACKS = [1, 2, 3, 4, 5]
/** The least thickness of a spine in the narrow layout: the touch size of docs/DESIGN.md section 3. */
const NARROW_SPINE_MIN_PX = 44
/** Duration of the move of the selected spine before the cover page opens. */
const LEAVE_S = 0.35

export function TablePage({ books, layout: screen }: { books: Book[]; layout: ScreenLayout }) {
  const narrow = screen === 'narrow'
  const trackRef = useRef<HTMLElement>(null)
  const [shownStack, setShownStack] = useState(1)
  const [picked, setPicked] = useState<GroupName | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [leavingId, setLeavingId] = useState<string | null>(null)
  const [rects, setRects] = useState<Map<string, SpineRect> | null>(null)
  const [webgl, setWebgl] = useState(hasWebGL)
  const [fontsReady, setFontsReady] = useState(false)
  const reducedMotion = useReducedMotion()
  const leaveCall = useRef<gsap.core.Tween | null>(null)
  const layout = useMemo(() => layoutTable(books), [books])

  // The spine textures need the font before they are drawn.
  useEffect(() => {
    let live = true
    document.fonts
      .load(`700 24px ${SPINE_FONT_FAMILY}`)
      .catch(() => undefined)
      .then(() => live && setFontsReady(true))
    return () => {
      live = false
    }
  }, [])

  // If the reader leaves the table during the move, the cover does not open.
  useEffect(
    () => () => {
      if (leaveCall.current?.isActive()) {
        leaveCall.current.kill()
        clearHandoff()
      }
    },
    [],
  )

  // In the narrow layout, a selected group brings the first stack that holds it into view.
  const onPick = (group: GroupName | null) => {
    setPicked(group)
    const first = group && books.find((b) => b.group === group)
    if (narrow && first && first.stack !== shownStack) showStack(trackRef.current, first.stack, reducedMotion)
  }

  const dimmedIds = useMemo(
    () => new Set(books.filter((b) => picked !== null && b.group !== picked).map((b) => b.id)),
    [books, picked],
  )
  const onRects = useCallback((list: SpineRect[]) => setRects(new Map(list.map((r) => [r.id, r]))), [])
  const onSceneError = useCallback(() => setWebgl(false), [])

  const mode = webgl && !narrow ? '3d' : 'flat'
  const ready = mode === 'flat' || rects !== null

  // docs/TASKS.md Task 4 step 7: the selected spine slides out, then the cover
  // page opens and the book lands there. Without 3D or with reduced motion,
  // or with a modifier key, the link works as a plain link.
  const onSpineClick = (event: MouseEvent<HTMLAnchorElement>, book: Book) => {
    const rect = rects?.get(book.id)
    if (mode !== '3d' || reducedMotion || !rect) return
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (leavingId) return
    const link = event.currentTarget.getBoundingClientRect()
    setHandoff({
      id: book.id,
      rect: {
        left: link.left + rect.leave.left - rect.rest.left,
        top: link.top + rect.leave.top - rect.rest.top,
        width: rect.leave.width,
        height: rect.leave.height,
      },
      at: performance.now(),
    })
    setLeavingId(book.id)
    leaveCall.current = gsap.delayedCall(LEAVE_S, () => {
      window.location.hash = bookHref(book.id)
    })
  }

  return (
    <main className="table-page">
      <header className="table-header">
        <h1>Books of the Bible</h1>
        <div className="table-header-side">
          <p>Sixty-six books on one table. Take one from a stack and open it.</p>
          <nav aria-label="Site">
            <a href={timelineHref()}>Timeline</a>
            <a href={sourcesHref()}>Sources</a>
          </nav>
        </div>
      </header>

      {narrow && (
        <div className="stack-pager">
          {/* aria-disabled, not disabled, so that the button keeps the focus at the first and the last stack. */}
          <button type="button" aria-disabled={shownStack === 1} onClick={() => shownStack > 1 && showStack(trackRef.current, shownStack - 1, reducedMotion)}>
            Previous stack
          </button>
          <p aria-live="polite">
            Stack {shownStack} of {STACKS.length}
          </p>
          <button
            type="button"
            aria-disabled={shownStack === STACKS.length}
            onClick={() => shownStack < STACKS.length && showStack(trackRef.current, shownStack + 1, reducedMotion)}
          >
            Next stack
          </button>
        </div>
      )}

      <div className="table-scene" data-mode={mode} data-reduced-motion={reducedMotion}>
        {mode === '3d' && fontsReady && (
          <SceneBoundary onError={onSceneError}>
            <Suspense fallback={null}>
              <TableScene
                layout={layout}
                hoveredId={hoveredId}
                leavingId={leavingId}
                dimmedIds={dimmedIds}
                reducedMotion={reducedMotion}
                onRects={onRects}
              />
            </Suspense>
          </SceneBoundary>
        )}
        <nav
          className="spine-links"
          aria-label="Books"
          data-ready={ready}
          ref={trackRef}
          onScroll={narrow ? () => setShownStack(stackInView(trackRef.current)) : undefined}
        >
          {STACKS.map((stack) => (
            <ul key={stack} className="stack" aria-label={`Stack ${stack}`}>
              {books
                .filter((b) => b.stack === stack)
                .sort((a, b) => a.position - b.position)
                .map((book) => (
                  <li key={book.id}>
                    <a
                      className="spine"
                      href={bookHref(book.id)}
                      data-group={book.group}
                      data-dimmed={dimmedIds.has(book.id)}
                      style={spineStyle(book, books.indexOf(book), mode, rects?.get(book.id), hoveredId === book.id && !reducedMotion, narrow)}
                      onClick={(event) => onSpineClick(event, book)}
                      onMouseEnter={() => setHoveredId(book.id)}
                      onMouseLeave={() => setHoveredId((id) => (id === book.id ? null : id))}
                      onFocus={() => setHoveredId(book.id)}
                      onBlur={() => setHoveredId((id) => (id === book.id ? null : id))}
                    >
                      <span className="spine-label">{book.name}</span>
                    </a>
                  </li>
                ))}
            </ul>
          ))}
        </nav>
      </div>

      <Legend picked={picked} onPick={onPick} />
    </main>
  )
}

/** The stack that fills most of the narrow track. Stacks are numbered from 1. */
function stackInView(track: HTMLElement | null): number {
  if (!track || track.clientWidth === 0) return 1
  return Math.min(STACKS.length, Math.max(1, Math.round(track.scrollLeft / track.clientWidth) + 1))
}

/** Scrolls the narrow track to a stack. */
function showStack(track: HTMLElement | null, stack: number, reducedMotion: boolean) {
  track?.scrollTo({ left: (stack - 1) * track.clientWidth, behavior: reducedMotion ? 'auto' : 'smooth' })
}

/**
 * In 3D mode the link stays on the spine at rest, so the pointer does not lose it.
 * The ring (CSS ::after) moves to the slid-out spine.
 */
function spineStyle(
  book: Book,
  index: number,
  mode: '3d' | 'flat',
  rect: SpineRect | undefined,
  slidOut: boolean,
  narrow: boolean,
): CSSProperties {
  if (mode === '3d') {
    if (!rect) return {}
    const { rest, out } = rect
    const ring = slidOut
      ? { left: out.left - rest.left, top: out.top - rest.top, width: out.width, height: out.height }
      : { left: 0, top: 0, width: rest.width, height: rest.height }
    return {
      left: rest.left,
      top: rest.top,
      width: rest.width,
      height: rest.height,
      '--ring-left': `${ring.left}px`,
      '--ring-top': `${ring.top}px`,
      '--ring-width': `${ring.width}px`,
      '--ring-height': `${ring.height}px`,
    } as CSSProperties
  }
  const group = groupOf(book)
  const thickness = narrow ? Math.max(NARROW_SPINE_MIN_PX, spineThickness(book.chapters)) : spineThickness(book.chapters)
  return {
    height: thickness,
    background: group.cloth,
    color: group.text,
    fontSize: spineFontPx(thickness),
    transform: `translateX(${spineOffsetPx(index)}px)`,
  }
}
