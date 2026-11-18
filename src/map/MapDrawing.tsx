// The drawing of the map, with the zoom. docs/DESIGN.md section 15.11 "The drawing", "Which places show", and
// "The zoom, Task 39", docs/TASKS.md Tasks 38, 39, and 39b. The page is in MapPage.tsx.

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react'
import type { Book } from '../data/books.ts'
import { useReducedMotion } from '../useReducedMotion.ts'
import {
  clampOffset,
  cssFont,
  hasDot,
  isDoubleTap,
  lastStep,
  NAME_CUT_RADIUS,
  nameCut,
  TAP_MOVE,
  resizeOffset,
  MAP_SECONDARY,
  nameFont,
  pathData,
  priority,
  riverShows,
  scaleBar,
  stepView,
  trianglePath,
  zoomOffset,
  type MapPlace,
  type MapRegionFile,
  type Measure,
  type NameStyle,
  type Offset,
  type Priority,
  type Rect,
  type View,
} from './mapLayout.ts'

/** The zoom controls, at the upper right of the map: 12 px from the edges, two of 36 by 36 px, 4 px apart. */
const ZOOM_EDGE = 12
const ZOOM_SIZE = 36
const ZOOM_GAP = 4
/** The scale bar, at the lower left: 14 px from the edges. The label is to the right of the line. */
const SCALE_EDGE = 14
const SCALE_LABEL_GAP = 6
const SCALE_FONT = '500 11px Inter'
const SCALE_HEIGHT = 16
/** The arrow keys move the map by 80 px. "The zoom", rule 5. */
const KEY_MOVE = 80

interface DrawingProps {
  book: Book
  regionName: string
  places: MapPlace[]
  region: MapRegionFile
  /** The first view. */
  view: View
  wide: boolean
  color: string
}

/** The zoom: the step, the offset of the frame in the whole first view at that step, and the animation. */
interface Zoom {
  step: number
  offset: Offset
  /** The animation of a change of the step: none when the reader asked for less motion, and none after two fingers. */
  anim: 'in' | 'out' | null
  /** The point in px of the frame that stays at a change of the step. */
  at: Offset
}

/** True when the fonts of the names are ready: the width of a name is measured in the browser. */
function useFonts(fonts: string[], text: string): boolean {
  const [readyKey, setReadyKey] = useState<string | null>(null)
  const key = fonts.join('|')
  useEffect(() => {
    let live = true
    Promise.all(key.split('|').map((f) => document.fonts.load(f, text)))
      .catch(() => undefined)
      .then(() => live && setReadyKey(key + text))
    return () => {
      live = false
    }
  }, [key, text])
  return readyKey === key + text
}

function makeMeasure(wide: boolean): Measure {
  const ctx = document.createElement('canvas').getContext('2d')!
  return (text: string, style: NameStyle, sure: boolean) => {
    const f = nameFont(style, sure, wide)
    ctx.font = cssFont(f)
    const m = ctx.measureText(text)
    const ascent = m.fontBoundingBoxAscent ?? f.size * 0.97
    const descent = m.fontBoundingBoxDescent ?? f.size * 0.24
    return { w: m.width + f.spacing * text.length, h: ascent + descent, ascent }
  }
}

const STYLES: [NameStyle, boolean][] = [
  ['place', true],
  ['place-bold', true],
  ['region', true],
  ['region', false],
  ['water', true],
]

export function MapDrawing({ book, regionName, places, region, view: first, wide, color }: DrawingProps) {
  const r = wide ? 3.5 : 3
  const reduced = useReducedMotion()
  const fonts = [...new Set([...STYLES.map(([s, sure]) => cssFont(nameFont(s, sure, wide))), SCALE_FONT])]
  const allText = useMemo(() => [...new Set(places.map((p) => p.name + p.name.toUpperCase()).join('') + '0123456789 miles')].join(''), [places])
  const ready = useFonts(fonts, allText)

  const { width: W, height: H } = first
  const center = { x: W / 2, y: H / 2 }
  const last = lastStep(first.k)
  const [zoom, setZoom] = useState<Zoom>({ step: 0, offset: { x: 0, y: 0 }, anim: null, at: center })
  // While two fingers are on the map: their scale, and the point between them.
  const [pinch, setPinch] = useState<{ scale: number; at: Offset } | null>(null)
  // A change of the size of the frame keeps the step, if the new frame has it, and the point at the center.
  const [sized, setSized] = useState(first)
  if (sized !== first) {
    setSized(first)
    setPinch(null)
    setZoom((z) => {
      const s = Math.min(z.step, last)
      return { step: s, offset: resizeOffset(sized, z.step, first, s, z.offset), anim: null, at: center }
    })
  }
  const { step, offset } = zoom
  const canvas = useMemo(() => stepView(first, step), [first, step])
  const scale = scaleBar(canvas.k)
  const scaleLabel = `${scale.miles} miles`

  // The priority rule, one time for each step, for the whole first view at the scale of the step. A move does not
  // change it. "Which places show", and "The zoom", rule 1.
  const shown: Priority | null = useMemo(() => {
    if (!ready) return null
    const measure = makeMeasure(wide)
    const ctx = document.createElement('canvas').getContext('2d')!
    ctx.font = SCALE_FONT
    const labelW = ctx.measureText(scaleLabel).width
    // In the first view with no zoom, no name goes below the zoom controls or the scale bar. After a zoom, they can
    // cover a name. "The priority rule", rule 6.
    const blocked: Rect[] =
      step === 0
        ? [
            { x: W - ZOOM_EDGE - ZOOM_SIZE, y: ZOOM_EDGE, w: ZOOM_SIZE, h: 2 * ZOOM_SIZE + ZOOM_GAP },
            { x: SCALE_EDGE, y: H - SCALE_EDGE - SCALE_HEIGHT, w: scale.px + SCALE_LABEL_GAP + labelW, h: SCALE_HEIGHT },
          ]
        : []
    return priority({ places, view: canvas, radius: r, measure, blocked })
  }, [ready, places, canvas, step, r, wide, W, H, scale.px, scaleLabel])

  const paths = useMemo(() => {
    const u = region.unit
    return {
      land: region.land.map((poly) => pathData(poly, u, canvas, true)).join(''),
      lakes: region.lakes.map((poly) => pathData(poly, u, canvas, true)).join(''),
      rivers: region.rivers
        .filter((rv) => riverShows(rv.scalerank, canvas.k))
        .map((rv) => pathData(rv.lines, u, canvas, false))
        .join(''),
    }
  }, [region, canvas])

  // The boxes where the lines of the map stop: one for each name that shows. "The drawing", rule 5.
  // The id of the mask, with letters and digits only, for the reference url(#...).
  const maskId = `map-cut-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const maskMargin = 4 * Math.max(W, H)
  const cuts = useMemo(() => (shown ? shown.names.map((n) => ({ i: n.i, ...nameCut(n.box) })) : []), [shown])

  // ---- the changes of the zoom and the moves ----

  const zoomInRef = useRef<HTMLButtonElement>(null)
  const zoomOutRef = useRef<HTMLButtonElement>(null)
  /** Each step doubles the scale. The point `at` of the frame stays: the center for the controls and the keys. */
  const zoomTo = (to: number, at: Offset = center) => {
    const target = Math.min(Math.max(to, 0), last)
    setZoom((z) =>
      target === z.step
        ? z
        : { step: target, offset: zoomOffset(first, z.step, target, z.offset, at), anim: reduced ? null : target > z.step ? 'in' : 'out', at },
    )
  }
  const moveTo = (x: number, y: number) => setZoom((z) => ({ ...z, offset: clampOffset(first, z.step, { x, y }), anim: null }))

  // A control that can do nothing is off. When the control that the reader used goes off, the focus goes to the other.
  // The focus moves after the render, when the other control is on.
  const focusNext = useRef<'in' | 'out' | null>(null)
  const onZoomIn = () => {
    zoomTo(step + 1)
    if (step + 1 >= last) focusNext.current = 'out'
  }
  const onZoomOut = () => {
    zoomTo(step - 1)
    if (step - 1 <= 0) focusNext.current = 'in'
  }
  useEffect(() => {
    const to = focusNext.current
    focusNext.current = null
    if (to === 'out') zoomOutRef.current?.focus()
    if (to === 'in') zoomInRef.current?.focus()
  }, [step])

  // The drag with a mouse or a pen. "The zoom", rule 2. A touch is in the effect below.
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'touch' || e.button !== 0 || step === 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
  }
  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current
    if (d) moveTo(d.ox - (e.clientX - d.x), d.oy - (e.clientY - d.y))
  }
  const onPointerUp = () => {
    dragRef.current = null
  }

  // A double click zooms in one step, and the point below the pointer stays. At the last step, it does nothing.
  // "The zoom", rule 9. The second press of a double click does not select text on the page.
  const framePoint = (clientX: number, clientY: number): Offset => {
    const b = svgRef.current!.getBoundingClientRect()
    return { x: clientX - b.left, y: clientY - b.top }
  }
  const onMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    if (e.detail > 1) e.preventDefault()
  }
  const onDoubleClick = (e: MouseEvent<SVGSVGElement>) => {
    e.preventDefault()
    if (step < last) zoomTo(step + 1, framePoint(e.clientX, e.clientY))
  }

  // The keys, when the map has the focus: the arrows move the map by 80 px, and "+" and "−" zoom. "The zoom", rule 5.
  // In the first view, the map cannot move, and the arrows scroll the page.
  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    // A key with Ctrl, Cmd, or Alt is for the browser: the zoom of the page, Back, and Forward.
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const arrows: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_MOVE, 0],
      ArrowRight: [KEY_MOVE, 0],
      ArrowUp: [0, -KEY_MOVE],
      ArrowDown: [0, KEY_MOVE],
    }
    const a = arrows[e.key]
    if (a && step > 0) {
      e.preventDefault()
      moveTo(offset.x + a[0], offset.y + a[1])
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      zoomTo(step + 1)
    } else if (e.key === '-' || e.key === '−' || e.key === '_') {
      e.preventDefault()
      zoomTo(step - 1)
    }
  }

  // Touch: two fingers zoom, and the map goes to the nearest step when the fingers lift. In the first view with no
  // zoom, a drag with one finger scrolls the page. After a zoom, it moves the map. "The zoom", rule 3. The
  // listeners are not passive, so that they can stop the scroll of the page.
  const svgRef = useRef<SVGSVGElement>(null)
  const stateRef = useRef<{ zoom: Zoom; first: View; zoomInAt: (at: Offset) => void }>({ zoom, first, zoomInAt: () => undefined })
  const zoomInAt = (at: Offset) => zoomTo(stateRef.current.zoom.step + 1, at)
  useEffect(() => {
    stateRef.current = { zoom, first, zoomInAt }
  })
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    let fingers: { d: number; step: number; at: Offset; offset: Offset; scale: number } | null = null
    let drag: { x: number; y: number; ox: number; oy: number } | null = null
    // A tap: one finger that does not move. The last tap, for the double tap of "The zoom", rule 9.
    let tap: { x: number; y: number } | null = null
    let lastTap: { t: number; x: number; y: number } | null = null
    const local = (t: Touch): Offset => {
      const b = el.getBoundingClientRect()
      return { x: t.clientX - b.left, y: t.clientY - b.top }
    }
    // The fingers that started on the map. A finger on a different part of the page does not count.
    const onMap = (e: TouchEvent) => [...e.touches].filter((t) => t.target instanceof Node && el.contains(t.target))
    const between = (e: TouchEvent) => {
      const [ta, tb] = onMap(e)
      const a = local(ta)
      const b = local(tb)
      return { d: Math.hypot(a.x - b.x, a.y - b.y), at: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } }
    }
    const start = (e: TouchEvent) => {
      const { zoom: z } = stateRef.current
      const t0 = onMap(e)[0]
      tap = e.touches.length === 1 && t0 ? { x: t0.clientX, y: t0.clientY } : null
      if (onMap(e).length >= 2) {
        e.preventDefault()
        const { d, at } = between(e)
        fingers = { d: Math.max(d, 1), step: z.step, at, offset: z.offset, scale: 1 }
        drag = null
      } else if (onMap(e).length === 1 && z.step > 0) {
        const t = onMap(e)[0]
        drag = { x: t.clientX, y: t.clientY, ox: z.offset.x, oy: z.offset.y }
      }
    }
    const move = (e: TouchEvent) => {
      const t0 = onMap(e)[0]
      if (tap && (!t0 || Math.hypot(t0.clientX - tap.x, t0.clientY - tap.y) > TAP_MOVE)) tap = null
      if (fingers && onMap(e).length >= 2) {
        e.preventDefault()
        fingers.scale = between(e).d / fingers.d
        setPinch({ scale: fingers.scale, at: fingers.at })
      } else if (drag && onMap(e).length === 1) {
        e.preventDefault()
        const t = onMap(e)[0]
        const d = drag
        const f = stateRef.current.first
        setZoom((z) => ({ ...z, offset: clampOffset(f, z.step, { x: d.ox - (t.clientX - d.x), y: d.oy - (t.clientY - d.y) }), anim: null }))
      }
    }
    const end = (e: TouchEvent) => {
      if (fingers && onMap(e).length < 2) {
        const p = fingers
        fingers = null
        setPinch(null)
        const f = stateRef.current.first
        const target = Math.min(Math.max(Math.round(p.step + Math.log2(p.scale)), 0), lastStep(f.k))
        setZoom({ step: target, offset: zoomOffset(f, p.step, target, p.offset, p.at), anim: null, at: p.at })
      }
      if (onMap(e).length === 0) drag = null
      // A double tap zooms in one step at its point. It stops the click and the double click that the browser makes
      // from the taps, so that the map does not zoom two times.
      // A touch that the browser cancels is not a tap.
      const t1 = e.changedTouches[0]
      if (e.type === 'touchcancel') lastTap = null
      else if (tap && e.touches.length === 0 && t1) {
        const now = { t: e.timeStamp, x: t1.clientX, y: t1.clientY }
        if (isDoubleTap(lastTap, now)) {
          if (e.cancelable) e.preventDefault()
          lastTap = null
          stateRef.current.zoomInAt(local(t1))
        } else lastTap = now
      }
      tap = null
    }
    el.addEventListener('touchstart', start, { passive: false })
    el.addEventListener('touchmove', move, { passive: false })
    el.addEventListener('touchend', end, { passive: false })
    el.addEventListener('touchcancel', end)
    return () => {
      el.removeEventListener('touchstart', start)
      el.removeEventListener('touchmove', move)
      el.removeEventListener('touchend', end)
      el.removeEventListener('touchcancel', end)
    }
  }, [])

  // The numbers for the tests and the report: the dots and the names in the part of the map that the frame shows.
  const inPart = (x: number, y: number, w = 0, h = 0) => x + w >= offset.x && x <= offset.x + W && y + h >= offset.y && y <= offset.y + H
  const visibleDots = shown?.dots.filter((d) => inPart(d.x, d.y)).length
  const visibleNames = shown?.names.filter((n) => inPart(n.box.x, n.box.y, n.box.w, n.box.h)).length
  const inView = shown ? shown.onMap.filter(Boolean).length : undefined
  // The line and the baseline of the label. The descent of the label, about 3 px, ends 14 px from the lower edge.
  const scaleY = H - SCALE_EDGE - 3
  const contentStyle: CSSProperties = pinch
    ? { transform: `scale(${pinch.scale})`, transformOrigin: `${pinch.at.x}px ${pinch.at.y}px` }
    : { transformOrigin: `${zoom.at.x}px ${zoom.at.y}px` }

  return (
    <>
      <svg
        ref={svgRef}
        className="map-svg"
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-roledescription="map"
        aria-label={`Map of the places of ${book.name}, ${regionName}`}
        tabIndex={0}
        style={{ touchAction: step === 0 ? 'pan-x pan-y' : 'none' }}
        data-ready={shown ? 'true' : undefined}
        data-places={places.length}
        data-in-view={inView}
        data-dots={shown?.dots.length}
        data-names={shown?.names.length}
        data-visible-dots={visibleDots}
        data-visible-names={visibleNames}
        data-step={step}
        data-last-step={last}
        data-offset-x={Math.round(offset.x)}
        data-offset-y={Math.round(offset.y)}
        data-zoomed={step > 0 ? 'true' : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
      >
        <rect width={W} height={H} fill="#fff" />
        <g key={step} className={zoom.anim && !pinch ? `map-zoom-${zoom.anim}` : undefined} style={contentStyle}>
          <g transform={`translate(${-offset.x} ${-offset.y})`}>
            {/* The colors of the land and of the lakes. A name does not change them. */}
            <path d={paths.land} fill="#f4f1eb" fillRule="evenodd" />
            <path d={paths.lakes} fill="#fff" fillRule="evenodd" />
            {/* The lines stop at each name: the mask has a hole for the box of each name. "The drawing", rule 5. */}
            {/* The mask is larger than the canvas: during a pinch or the animation of a zoom, the frame can show the
                land past the edge of the canvas, and its lines too. */}
            <mask
              id={maskId}
              maskUnits="userSpaceOnUse"
              x={-maskMargin}
              y={-maskMargin}
              width={canvas.width + 2 * maskMargin}
              height={canvas.height + 2 * maskMargin}
            >
              <rect x={-maskMargin} y={-maskMargin} width={canvas.width + 2 * maskMargin} height={canvas.height + 2 * maskMargin} fill="#fff" />
              {cuts.map((c) => (
                <rect key={c.i} x={c.x} y={c.y} width={c.w} height={c.h} rx={NAME_CUT_RADIUS} fill="#000" />
              ))}
            </mask>
            <g className="map-lines" mask={`url(#${maskId})`} fill="none" strokeLinejoin="round">
              <path d={paths.land} stroke="#cfc8bb" strokeWidth="0.9" />
              <path d={paths.lakes} stroke="#a9c0cc" strokeWidth="0.9" />
              <path d={paths.rivers} stroke="#a9c0cc" strokeWidth="1.1" strokeLinecap="round" />
            </g>
            {shown && (
              <g className="map-dots">
                {shown.dots.map((d) => {
                  const p = places[d.i]
                  const solid = p.sure
                  const fill = solid ? color : '#fff'
                  const stroke = solid ? '#fff' : color
                  const sw = solid ? 1 : 1.4
                  return p.kind === 'mountain' ? (
                    <path key={d.i} data-place={d.i} d={trianglePath(d.x, d.y, r)} fill={fill} stroke={stroke} strokeWidth={sw} />
                  ) : (
                    <circle key={d.i} data-place={d.i} cx={d.x} cy={d.y} r={r} fill={fill} stroke={stroke} strokeWidth={sw} />
                  )
                })}
              </g>
            )}
            {shown && (
              <g className="map-names">
                {shown.names.map((n) => {
                  const p = places[n.i]
                  const f = nameFont(n.style, p.sure, wide)
                  return (
                    <text
                      key={n.i}
                      data-place={n.i}
                      data-kind={hasDot(p.kind) ? 'dot' : p.kind}
                      x={n.box.x}
                      y={n.box.y + n.ascent}
                      fontFamily={f.family}
                      fontSize={f.size}
                      fontWeight={f.weight}
                      fontStyle={f.italic ? 'italic' : undefined}
                      letterSpacing={f.spacing || undefined}
                      fill={f.color}
                    >
                      {n.text}
                    </text>
                  )
                })}
              </g>
            )}
          </g>
        </g>
        <g className="map-scale" fill="none" stroke={MAP_SECONDARY} strokeWidth="1">
          <path d={`M${SCALE_EDGE} ${scaleY - 4}V${scaleY}H${SCALE_EDGE + scale.px}V${scaleY - 4}`} />
          <text x={SCALE_EDGE + scale.px + SCALE_LABEL_GAP} y={scaleY} fill={MAP_SECONDARY} stroke="none" fontFamily="Inter" fontSize="11" fontWeight="500">
            {scaleLabel}
          </text>
        </g>
      </svg>
      {/* The zoom controls: at the upper right of the map, 12 px from the edges, "+" above "−". "The zoom", rule 1. */}
      <div className="map-zoom">
        <button ref={zoomInRef} type="button" aria-label="Zoom in" disabled={step >= last} onClick={onZoomIn}>
          <span aria-hidden="true">+</span>
        </button>
        <button ref={zoomOutRef} type="button" aria-label="Zoom out" disabled={step <= 0} onClick={onZoomOut}>
          <span aria-hidden="true">−</span>
        </button>
      </div>
    </>
  )
}
