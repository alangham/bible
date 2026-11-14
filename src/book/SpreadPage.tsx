// The spread: one open chapter. Mockup D3, docs/DESIGN.md sections 4.3 and 4.4.
//
// The book lies open on the table. A scene covers the two pages. The text is on the right
// page, under the header, and scrolls there for a long chapter while the scene moves in
// parallax. Drag a page corner, or use the arrow keys or the chapter links, to turn the page.
// The page curls in 3D. With reduced motion, without WebGL, and in the narrow layout, the
// chapters change by a cross-fade.

import gsap from 'gsap'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { groupOf, type Book } from '../data/books.ts'
import { loadBookText, type BookText } from '../data/text.ts'
import { bookHref, chapterHref } from '../router.ts'
import { PARALLAX_DEPTH } from '../scene/sceneSvg.ts'
import { SceneView, type SceneHandle } from '../scene/SceneView.tsx'
import { SCENE_W } from '../scene/shapes.ts'
import { sceneValues } from '../scene/values.ts'
import type { ScreenLayout } from '../screenLayout.ts'
import { SceneBoundary } from '../table/SceneBoundary.tsx'
import { hasWebGL } from '../table/webgl.ts'
import { useReducedMotion } from '../useReducedMotion.ts'
import { ChapterBody } from './ChapterBody.tsx'
import { plainClick } from './links.ts'
import { autoTarget, clampTarget, cornerPoint, turnProgress, type Corner } from './turn/curl.ts'
import { pageImage } from './turn/pageImage.ts'
import { PageTurn, TURN_MARGIN, type TurnDrive } from './turn/PageTurn.tsx'

interface SpreadPageProps {
  book: Book
  chapter: number
  layout: ScreenLayout
}

interface Turn {
  dir: 1 | -1
  from: number
  to: number
  width: number
  height: number
  front: HTMLCanvasElement
  back: HTMLCanvasElement
}

/** Duration of a turn by key or button, in seconds. */
const TURN_S = 0.9
/** Duration of each half of the cross-fade, in ms. */
const FADE_MS = 180

export function SpreadPage({ book, chapter, layout }: SpreadPageProps) {
  const [text, setText] = useState<BookText | null>(null)
  const [error, setError] = useState<string | null>(null)
  // The chapter on each page. They differ only while a page turns.
  const [view, setView] = useState({ left: chapter, right: chapter })
  // The chapter text that is laid out, out of sight, to draw the back of a page that turns back.
  const [ghost, setGhost] = useState<number | null>(null)
  const [turn, setTurn] = useState<Turn | null>(null)
  const [fade, setFade] = useState<'out' | 'in' | null>('in')
  const reducedMotion = useReducedMotion()
  const [webgl, setWebgl] = useState(hasWebGL)

  const bookRef = useRef<HTMLDivElement>(null)
  const leftPage = useRef<HTMLDivElement>(null)
  const rightPage = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLElement>(null)
  const ghostRef = useRef<HTMLElement>(null)
  const leftScene = useRef<SceneHandle>(null)
  const rightScene = useRef<SceneHandle>(null)
  const parallax = useRef(0)
  const busy = useRef(false)
  const drive = useRef<TurnDrive>({ corner: 'bottom', target: [0, 0] })
  const tween = useRef<gsap.core.Tween | null>(null)
  /** The turn in progress, for the handlers that run outside render. */
  const turnRef = useRef<Turn | null>(null)
  const pointer = useRef<{ id: number; dir: 1 | -1; moved: boolean; released: boolean; complete: boolean } | null>(null)
  /** The chapter in the address, for handlers that run after it changes. */
  const chapterRef = useRef(chapter)
  /** False after the page closes: no late tween or timer may change the address. */
  const mounted = useRef(true)
  const timers = useRef<number[]>([])
  /** The scroll position when a turn starts, and the one to restore when a forward turn is cancelled. */
  const savedScroll = useRef(0)
  const restoreScroll = useRef<number | null>(null)
  /** True when the leaf is on screen and the pages under it show the new chapter. */
  const shown = useRef(false)

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      tween.current?.kill()
      for (const t of timers.current) window.clearTimeout(t)
      timers.current = []
    }
  }, [])

  useEffect(() => {
    let live = true
    loadBookText(book.id).then(
      (t) => live && setText(t),
      (e: unknown) => live && setError(String(e)),
    )
    return () => {
      live = false
    }
  }, [book.id])

  // A new chapter from outside: a link, the address bar, or the back button.
  // During a turn, the turn shows this chapter when it ends.
  useEffect(() => {
    chapterRef.current = chapter
    if (!busy.current) setView({ left: chapter, right: chapter })
  }, [chapter])

  // The cross-fade in when the page opens.
  useEffect(() => {
    const t = window.setTimeout(() => setFade(null), FADE_MS + 40)
    return () => window.clearTimeout(t)
  }, [])

  const valid = chapter >= 1 && chapter <= book.chapters
  const leftValues = useMemo(() => sceneValues(book, view.left), [book, view.left])
  const rightValues = useMemo(() => sceneValues(book, view.right), [book, view.right])
  const rightChapter = text?.chapters[view.right - 1]
  const ghostChapter = ghost ? text?.chapters[ghost - 1] : undefined

  // The text starts at the top for each chapter. The scene follows the scroll.
  const applyParallax = useCallback(() => {
    const el = textRef.current
    const bookEl = bookRef.current
    if (!el || !bookEl) return
    const max = el.scrollHeight - el.clientHeight
    const f = reducedMotion || max <= 0 ? 0 : el.scrollTop / max
    parallax.current = f
    // One page shows half of the scene width.
    const pxPerUnit = (rightPage.current?.clientWidth ?? bookEl.clientWidth / 2) / (SCENE_W / 2)
    leftScene.current?.setParallax(f, pxPerUnit)
    rightScene.current?.setParallax(f, pxPerUnit)
  }, [reducedMotion])

  useEffect(() => {
    const el = textRef.current
    if (el) el.scrollTop = restoreScroll.current ?? 0
    restoreScroll.current = null
    applyParallax()
  }, [view.right, text, applyParallax])

  useEffect(() => {
    window.addEventListener('resize', applyParallax)
    return () => window.removeEventListener('resize', applyParallax)
  }, [applyParallax])

  const curlAllowed = webgl && !reducedMotion && layout === 'wide'

  /**
   * Ends a turn or a cross-fade from `from`. `to` is null for a cancelled turn. If the address
   * changed during the turn, for example by the back button, the page shows that chapter instead.
   */
  const finish = useCallback(
    (from: number, to: number | null) => {
      if (!mounted.current) return
      const outside = chapterRef.current !== from
      // A forward turn shows the next chapter under the leaf. If it is cancelled, the text returns to its place.
      if (to === null && !outside && turnRef.current?.dir === 1 && shown.current) restoreScroll.current = savedScroll.current
      shown.current = false
      tween.current?.kill()
      tween.current = null
      setTurn(null)
      setGhost(null)
      turnRef.current = null
      busy.current = false
      const show = outside ? chapterRef.current : (to ?? from)
      setView({ left: show, right: show })
      if (!outside && to !== null) window.location.hash = chapterHref(book.id, to)
    },
    [book.id],
  )

  const crossFade = useCallback(
    (from: number, to: number) => {
      busy.current = true
      setFade('out')
      later(() => {
        finish(from, to)
        setFade('in')
        later(() => setFade(null), FADE_MS + 40)
      }, FADE_MS)
    },
    [finish],
  )

  /** Moves the held corner to the end of the turn, or back to rest, and ends the turn. */
  const settle = useCallback(
    (t: Turn, complete: boolean) => {
      const from = drive.current.target
      const end: [number, number] = complete ? autoTarget(t.width, t.height, drive.current.corner, 1) : cornerPoint(t.width, t.height, drive.current.corner)
      const state = { k: 0 }
      tween.current?.kill()
      tween.current = gsap.to(state, {
        k: 1,
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: () => {
          drive.current.target = [from[0] + (end[0] - from[0]) * state.k, from[1] + (end[1] - from[1]) * state.k]
        },
        onComplete: () => finish(t.from, complete ? t.to : null),
      })
    },
    [finish],
  )

  /** Starts a turn: draws the two faces of the leaf, then shows it. `corner` is null for a turn by key or button. */
  const startTurn = useCallback(
    async (dir: 1 | -1, corner: Corner | null) => {
      const from = view.right
      const to = from + dir
      const bookEl = bookRef.current
      if (!text || !bookEl) return
      busy.current = true
      const scrollTop = textRef.current?.scrollTop ?? 0
      const width = bookEl.clientWidth / 2
      const height = bookEl.clientHeight
      const lift = PARALLAX_DEPTH.map((d) => d * parallax.current)
      let front: HTMLCanvasElement
      let back: HTMLCanvasElement
      try {
        if (dir === 1) {
          front = await pageImage({ width, height, values: rightValues, half: 'right', parallax: lift, text: textRef.current, page: rightPage.current, mirror: false })
          back = await pageImage({ width, height, values: sceneValues(book, to), half: 'left', mirror: true })
        } else {
          setGhost(to)
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
          front = await pageImage({ width, height, values: leftValues, half: 'left', parallax: lift, mirror: true })
          back = await pageImage({ width, height, values: sceneValues(book, to), half: 'right', text: ghostRef.current, page: rightPage.current, mirror: false })
        }
      } catch {
        pointer.current = null
        setGhost(null)
        if (mounted.current) crossFade(from, to)
        return
      }
      if (!mounted.current) return
      savedScroll.current = scrollTop
      shown.current = false
      const c = corner ?? 'bottom'
      if (corner === null || !pointer.current) drive.current = { corner: c, target: cornerPoint(width, height, c) }
      else drive.current.corner = c
      const t: Turn = { dir, from, to, width, height, front, back }
      turnRef.current = t
      setTurn(t)
      if (corner === null) {
        const state = { k: 0 }
        tween.current = gsap.to(state, {
          k: 1,
          duration: TURN_S,
          ease: 'power2.inOut',
          onUpdate: () => {
            drive.current.target = autoTarget(width, height, c, state.k)
          },
          onComplete: () => finish(from, to),
        })
      } else if (pointer.current?.released) {
        settle(t, pointer.current.complete)
        pointer.current = null
      }
    },
    [view.right, text, rightValues, leftValues, book, crossFade, finish, settle],
  )

  /** A turn by key, button, or a click on a corner. */
  const go = useCallback(
    (dir: 1 | -1) => {
      const to = view.right + dir
      if (busy.current || !text || to < 1 || to > book.chapters) return
      if (curlAllowed) void startTurn(dir, null)
      else crossFade(view.right, to)
    },
    [view.right, text, book.chapters, curlAllowed, startTurn, crossFade],
  )

  // The leaf is on screen: change the pages under it.
  const onShown = useCallback(() => {
    const t = turnRef.current
    if (!t) return
    shown.current = true
    setView(t.dir === 1 ? { left: t.from, right: t.to } : { left: t.to, right: t.from })
  }, [])

  // Arrow keys turn the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // Drag a corner.
  const toPage = (dir: 1 | -1, x: number, y: number): [number, number] => {
    const r = bookRef.current!.getBoundingClientRect()
    const spine = r.left + r.width / 2
    return [dir === 1 ? x - spine : spine - x, r.bottom - y]
  }

  const onCornerDown = (dir: 1 | -1, corner: Corner) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || busy.current || !text) return
    const to = view.right + dir
    if (to < 1 || to > book.chapters) return
    e.preventDefault()
    if (!curlAllowed) {
      crossFade(view.right, to)
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    pointer.current = { id: e.pointerId, dir, moved: false, released: false, complete: false }
    const r = bookRef.current!.getBoundingClientRect()
    drive.current = { corner, target: cornerPoint(r.width / 2, r.height, corner) }
    void startTurn(dir, corner)
  }

  const onCornerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = pointer.current
    if (!p || p.id !== e.pointerId || p.released) return
    const r = bookRef.current!.getBoundingClientRect()
    const target = toPage(p.dir, e.clientX, e.clientY)
    const start = cornerPoint(r.width / 2, r.height, drive.current.corner)
    if (Math.hypot(target[0] - start[0], target[1] - start[1]) > 8) p.moved = true
    if (p.moved) drive.current.target = clampTarget(r.width / 2, r.height, drive.current.corner, target)
  }

  const onCornerUp = (cancel: boolean) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = pointer.current
    if (!p || p.id !== e.pointerId) return
    const r = bookRef.current!.getBoundingClientRect()
    // A click turns the page. A drag turns it if the corner went past the middle of the page.
    // A gesture that the browser cancels puts the page back.
    p.complete = !cancel && (!p.moved || turnProgress(r.width / 2, drive.current.target) > 0.25)
    p.released = true
    // If the leaf is not on screen yet, startTurn settles it when it is.
    const t = turnRef.current
    if (t) {
      settle(t, p.complete)
      pointer.current = null
    }
  }

  if (!valid) {
    return (
      <main className="message">
        <h1>Chapter not found</h1>
        <p>
          <a href={bookHref(book.id)}>Back to the cover</a>
        </p>
      </main>
    )
  }

  const hasPrev = view.right > 1
  const hasNext = view.right < book.chapters
  const textStyle = (v: typeof rightValues) => {
    const n = parseInt(v.text.veil.slice(1), 16)
    const rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
    return { '--ink': v.text.ink, '--veil-color': `rgba(${rgb},${v.text.veilAlpha})`, '--veil-edge': `rgba(${rgb},${(v.text.veilAlpha * 0.7).toFixed(3)})` } as CSSProperties
  }

  return (
    <main className="spread-page" data-fade={fade ?? undefined} data-turning={turn ? 'true' : 'false'} data-chapter={view.right}>
      <nav className="spread-bar" aria-label="Pages">
        <a href={bookHref(book.id)}>Close the book</a>
        <span className="spread-bar-turns">
          {/* At the first and the last chapter the link stays, without a target, so that focus is not lost. */}
          <a
            href={hasPrev ? chapterHref(book.id, view.right - 1) : undefined}
            aria-disabled={hasPrev ? undefined : 'true'}
            role={hasPrev ? undefined : 'link'}
            tabIndex={hasPrev ? undefined : 0}
            onClick={(e) => {
              if (plainClick(e)) {
                e.preventDefault()
                go(-1)
              }
            }}
          >
            Previous chapter
          </a>
          <a
            href={hasNext ? chapterHref(book.id, view.right + 1) : undefined}
            aria-disabled={hasNext ? undefined : 'true'}
            role={hasNext ? undefined : 'link'}
            tabIndex={hasNext ? undefined : 0}
            onClick={(e) => {
              if (plainClick(e)) {
                e.preventDefault()
                go(1)
              }
            }}
          >
            Next chapter
          </a>
        </span>
      </nav>
      {/* Tells a screen reader which chapter shows after a turn. */}
      <p className="sr-only" role="status">
        {book.name} chapter {view.right}
      </p>

      <div className="spread-stage">
        <div className="spread-book" ref={bookRef} style={{ '--board': groupOf(book).cloth } as CSSProperties}>
          <div className="page page-left" ref={leftPage}>
            <SceneView ref={leftScene} values={leftValues} half="left" />
          </div>
          <div className="page page-right" ref={rightPage}>
            <SceneView ref={rightScene} values={rightValues} half="right" />
            <article className="spread-text" ref={textRef} style={textStyle(rightValues)} tabIndex={0} aria-labelledby="spread-title" onScroll={applyParallax}>
              <header className="spread-header">
                <h1 id="spread-title">
                  <span className="spread-book-name">{book.name}</span> <span className="spread-chapter">Chapter {view.right}</span>
                </h1>
                <p className="spread-count">
                  of {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
                </p>
                {/* The name of the translation on each spread. docs/DESIGN.md section 5. */}
                {text && <p className="spread-translation">{text.translation}</p>}
              </header>
              {error && <p role="alert">The text did not load. {error}</p>}
              {rightChapter && <ChapterBody chapter={rightChapter} />}
            </article>
            {ghostChapter && ghost && (
              <article className="spread-text spread-ghost" ref={ghostRef} style={textStyle(sceneValues(book, ghost))} aria-hidden="true">
                <header className="spread-header">
                  <p className="spread-title-ghost">
                    <span className="spread-book-name">{book.name}</span> <span className="spread-chapter">Chapter {ghost}</span>
                  </p>
                  <p className="spread-count">
                    of {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
                  </p>
                  {text && <p className="spread-translation">{text.translation}</p>}
                </header>
                <ChapterBody chapter={ghostChapter} />
              </article>
            )}
          </div>
          {hasPrev && (
            <>
              <div className="page-corner" data-corner="bl" aria-hidden="true" onPointerDown={onCornerDown(-1, 'bottom')} onPointerMove={onCornerMove} onPointerUp={onCornerUp(false)} onPointerCancel={onCornerUp(true)} />
              <div className="page-corner" data-corner="tl" aria-hidden="true" onPointerDown={onCornerDown(-1, 'top')} onPointerMove={onCornerMove} onPointerUp={onCornerUp(false)} onPointerCancel={onCornerUp(true)} />
            </>
          )}
          {hasNext && (
            <>
              <div className="page-corner" data-corner="br" aria-hidden="true" onPointerDown={onCornerDown(1, 'bottom')} onPointerMove={onCornerMove} onPointerUp={onCornerUp(false)} onPointerCancel={onCornerUp(true)} />
              <div className="page-corner" data-corner="tr" aria-hidden="true" onPointerDown={onCornerDown(1, 'top')} onPointerMove={onCornerMove} onPointerUp={onCornerUp(false)} onPointerCancel={onCornerUp(true)} />
            </>
          )}
          {turn && (
            <div className="turn-layer" style={{ '--turn-margin': TURN_MARGIN } as CSSProperties}>
              <SceneBoundary
                onError={() => {
                  tween.current?.kill()
                  setWebgl(false)
                  finish(turn.from, turn.to)
                }}
              >
                <PageTurn width={turn.width} height={turn.height} dir={turn.dir} front={turn.front} back={turn.back} drive={drive} onShown={onShown} />
              </SceneBoundary>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
