// The table: the landing page. Mockup D1, docs/DESIGN.md section 4.1.
//
// The spines are drawn in 3D. Each spine is also a real `a` element that lies
// over the spine on screen, so that keyboard and screen reader users can use it.
// Without WebGL, the `a` elements show as flat spines.

import gsap from 'gsap'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { clearHandoff, setHandoff } from '../book/handoff.ts'
import { groupOf, spineThickness, type Book, type GroupName } from '../data/books.ts'
import { bookHref, sourcesHref, timelineHref } from '../router.ts'
import { useReducedMotion } from '../useReducedMotion.ts'
import { layoutTable, spineOffsetPx } from './layout.ts'
import { Legend } from './Legend.tsx'
import { SPINE_FONT_FAMILY } from './spineTexture.ts'
import { SceneBoundary } from './SceneBoundary.tsx'
import { TableScene, type SpineRect } from './TableScene.tsx'
import { hasWebGL } from './webgl.ts'

const STACKS = [1, 2, 3, 4, 5]
/** Duration of the move of the selected spine before the cover page opens. */
const LEAVE_S = 0.35

export function TablePage({ books }: { books: Book[] }) {
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

  const dimmedIds = useMemo(
    () => new Set(books.filter((b) => picked !== null && b.group !== picked).map((b) => b.id)),
    [books, picked],
  )
  const onRects = useCallback((list: SpineRect[]) => setRects(new Map(list.map((r) => [r.id, r]))), [])
  const onSceneError = useCallback(() => setWebgl(false), [])

  const mode = webgl ? '3d' : 'flat'
  const ready = !webgl || rects !== null

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

      <div className="table-scene" data-mode={mode} data-reduced-motion={reducedMotion}>
        {webgl && fontsReady && (
          <SceneBoundary onError={onSceneError}>
            <TableScene
              layout={layout}
              hoveredId={hoveredId}
              leavingId={leavingId}
              dimmedIds={dimmedIds}
              reducedMotion={reducedMotion}
              onRects={onRects}
            />
          </SceneBoundary>
        )}
        <nav className="spine-links" aria-label="Books" data-ready={ready}>
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
                      style={spineStyle(book, books.indexOf(book), mode, rects?.get(book.id), hoveredId === book.id && !reducedMotion)}
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

      <Legend picked={picked} onPick={setPicked} />
    </main>
  )
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
  const thickness = spineThickness(book.chapters)
  return {
    height: thickness,
    background: group.cloth,
    color: group.text,
    fontSize: Math.max(14, Math.min(24, thickness * 0.42)),
    transform: `translateX(${spineOffsetPx(index)}px)`,
  }
}
