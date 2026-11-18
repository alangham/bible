// The map page: the places of one book on a map, the first view with no zoom. docs/DESIGN.md sections 15.8,
// 15.10, and 15.11, docs/TASKS.md Task 38. No page links to it before Task 40. Task 39 adds the zoom and the drag.

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { BookNotFound } from '../book/BookNotFound.tsx'
import { groupOf, type Book } from '../data/books.ts'
import { bookHref } from '../router.ts'
import type { ScreenLayout } from '../screenLayout.ts'
import { bandLabel } from '../wall/layout.ts'
import { loadBookMap, type BookMap } from './mapData.ts'
import {
  countSentences,
  cssFont,
  firstView,
  hasDot,
  MAP_SECONDARY,
  nameFont,
  narrowFrameHeight,
  pathData,
  placesOnMap,
  priority,
  riverShows,
  scaleBar,
  trianglePath,
  wideFrameHeight,
  type Measure,
  type MapPlace,
  type MapRegionFile,
  type NameStyle,
  type Priority,
  type Rect,
  type View,
} from './mapLayout.ts'

/** The zoom controls of Task 39, at the upper right of the map: 12 px from the edges, two of 36 by 36 px, 4 px apart. */
const ZOOM_EDGE = 12
const ZOOM_SIZE = 36
const ZOOM_GAP = 4
/** The scale bar, at the lower left: 14 px from the edges. The label is to the right of the line. */
const SCALE_EDGE = 14
const SCALE_LABEL_GAP = 6
const SCALE_FONT = '500 11px Inter'
const SCALE_HEIGHT = 16

export function MapPage({ books, id, layout }: { books: Book[]; id: string; layout: ScreenLayout }) {
  const book = books.find((b) => b.id === id)
  if (!book) return <BookNotFound />
  return <BookMapPage key={book.id} book={book} layout={layout} />
}

function BookMapPage({ book, layout }: { book: Book; layout: ScreenLayout }) {
  const [data, setData] = useState<BookMap | 'error' | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    let live = true
    loadBookMap(book.id).then(
      (d) => live && setData(d),
      () => live && setData('error'),
    )
    return () => {
      live = false
    }
  }, [book.id])

  let body
  if (data === 'error') {
    body = (
      <main className="map-message">
        <p role="alert">The map did not load.</p>
      </main>
    )
  } else if (data && (!data.file || !data.region)) {
    body = (
      <main className="map-message">
        <p>{book.name} names no place.</p>
      </main>
    )
  } else if (data?.file && data.region) {
    const info = data.index.regions.find((r) => r.id === data.file!.region)
    body = info ? (
      <MapMain book={book} layout={layout} places={data.file.places} file={data} regionName={info.name} box={info.box} />
    ) : (
      <main className="map-message">
        <p role="alert">The map did not load.</p>
      </main>
    )
  }

  return (
    <div className="ref-page map-root">
      <header className="ref-bar map-bar">
        <a className="ref-books map-back" href={bookHref(book.id)}>
          <span aria-hidden="true">‹ </span>
          {book.name}
        </a>
      </header>
      {body}
    </div>
  )
}

interface MainProps {
  book: Book
  layout: ScreenLayout
  places: MapPlace[]
  file: BookMap
  regionName: string
  box: [number, number, number, number]
}

function MapMain({ book, layout, places, file, regionName, box }: MainProps) {
  const wide = layout === 'wide'
  const holderRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; winH: number } | null>(null)

  // The width of the map is the width of its column. The height comes from the rules of "The layout".
  useLayoutEffect(() => {
    const el = holderRef.current
    if (!el) return
    const update = () => {
      const w = Math.floor(el.getBoundingClientRect().width)
      const winH = window.innerHeight
      setSize((old) => (old && old.w === w && old.winH === winH ? old : { w, winH }))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const frameW = size?.w ?? 0
  const frameH = size ? (wide ? wideFrameHeight(size.w, size.winH) : narrowFrameHeight(size.w, size.winH, box)) : 0
  // The frame line: 1 px on the four sides in the wide layout, above and below in the narrow layout.
  const view = useMemo(() => (frameW > 0 ? firstView(box, frameW - (wide ? 2 : 0), frameH - 2) : null), [box, frameW, frameH, wide])
  const onMap = useMemo(() => (view ? placesOnMap(places, view) : null), [places, view])
  const color = groupOf(book).color
  const nameEm = book.name.length * 0.8

  return (
    <main className="map-page" data-layout={layout} style={{ '--c': color, '--name-em': nameEm } as CSSProperties}>
      <div className="map-head">
        <p className="rd-band">{bandLabel(book.group)}</p>
        <h1 className="map-name">
          <span className="rd-name">{book.name}</span>
        </h1>
        <h2 className="map-heading">The places of this book</h2>
        <p className="map-region">Map: {regionName}</p>
      </div>
      <div className="map-holder" ref={holderRef}>
        {view && file.region && (
          <div className="map-frame" style={{ height: frameH }}>
            <MapDrawing
              book={book}
              regionName={regionName}
              places={places}
              region={file.region}
              view={view}
              wide={wide}
              color={color}
            />
          </div>
        )}
      </div>
      <div className="map-after">
        <ul className="map-signs">
          <li>
            <Sign kind="dot" color={color} r={wide ? 3.5 : 3} />A place that the book names
          </li>
          <li>
            <Sign kind="open" color={color} r={wide ? 3.5 : 3} />
            The position is not certain
          </li>
          <li>
            <Sign kind="triangle" color={color} r={wide ? 3.5 : 3} />A mountain or a hill
          </li>
        </ul>
        {onMap && file.file && (
          <div className="map-counts">
            {countSentences(book.name, file.file, onMap).map((s) => (
              <p key={s}>{s}</p>
            ))}
          </div>
        )}
        <p className="map-credit">
          Places: <a href="https://www.openbible.info/geo/">OpenBible.info</a>. Coast and rivers:{' '}
          <a href="https://www.naturalearthdata.com/">Natural Earth</a>. Some positions:{' '}
          <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>.
        </p>
      </div>
    </main>
  )
}

/** A sign of the list, in the size of the map: a dot of radius r, or a triangle. "The drawing", rule 4. */
function Sign({ kind, color, r }: { kind: 'dot' | 'open' | 'triangle'; color: string; r: number }) {
  return (
    <svg className="map-sign" width="14" height="14" viewBox="-7 -7 14 14" aria-hidden="true">
      {kind === 'dot' && <circle r={r} fill={color} stroke="#fff" strokeWidth="1" />}
      {kind === 'open' && <circle r={r} fill="#fff" stroke={color} strokeWidth="1.4" />}
      {kind === 'triangle' && <path d={trianglePath(0, 0, r)} fill={color} stroke="#fff" strokeWidth="1" />}
    </svg>
  )
}

interface DrawingProps {
  book: Book
  regionName: string
  places: MapPlace[]
  region: MapRegionFile
  view: View
  wide: boolean
  color: string
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

function MapDrawing({ book, regionName, places, region, view, wide, color }: DrawingProps) {
  const r = wide ? 3.5 : 3
  const styles: [NameStyle, boolean][] = [
    ['place', true],
    ['place-bold', true],
    ['region', true],
    ['region', false],
    ['water', true],
  ]
  const fonts = [...new Set([...styles.map(([s, sure]) => cssFont(nameFont(s, sure, wide))), SCALE_FONT])]
  const allText = useMemo(() => [...new Set(places.map((p) => p.name + p.name.toUpperCase()).join('') + '0123456789 miles')].join(''), [places])
  const ready = useFonts(fonts, allText)

  const { width: W, height: H, k } = view
  const scale = scaleBar(k)
  const scaleLabel = `${scale.miles} miles`

  const shown: Priority | null = useMemo(() => {
    if (!ready) return null
    const measure = makeMeasure(wide)
    const ctx = document.createElement('canvas').getContext('2d')!
    ctx.font = SCALE_FONT
    const labelW = ctx.measureText(scaleLabel).width
    // In the first view with no zoom, no name goes below the zoom controls or the scale bar. "The priority rule", rule 6.
    const blocked: Rect[] = [
      { x: W - ZOOM_EDGE - ZOOM_SIZE, y: ZOOM_EDGE, w: ZOOM_SIZE, h: 2 * ZOOM_SIZE + ZOOM_GAP },
      { x: SCALE_EDGE, y: H - SCALE_EDGE - SCALE_HEIGHT, w: scale.px + SCALE_LABEL_GAP + labelW, h: SCALE_HEIGHT },
    ]
    return priority({ places, view, radius: r, measure, blocked })
  }, [ready, places, view, r, wide, W, H, scale.px, scaleLabel])

  const paths = useMemo(() => {
    const u = region.unit
    return {
      land: region.land.map((poly) => pathData(poly, u, view, true)).join(''),
      lakes: region.lakes.map((poly) => pathData(poly, u, view, true)).join(''),
      rivers: region.rivers
        .filter((rv) => riverShows(rv.scalerank, view.k))
        .map((rv) => pathData(rv.lines, u, view, false))
        .join(''),
    }
  }, [region, view])

  const inView = shown ? shown.onMap.filter(Boolean).length : undefined
  // The line and the baseline of the label. The descent of the label, about 3 px, ends 14 px from the lower edge.
  const scaleY = H - SCALE_EDGE - 3

  return (
    <svg
      className="map-svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Map of the places of ${book.name}, ${regionName}`}
      data-ready={shown ? 'true' : undefined}
      data-places={places.length}
      data-in-view={inView}
      data-dots={shown?.dots.length}
      data-names={shown?.names.length}
    >
      <rect width={W} height={H} fill="#fff" />
      <path d={paths.land} fill="#f4f1eb" stroke="#cfc8bb" strokeWidth="0.9" fillRule="evenodd" strokeLinejoin="round" />
      <path d={paths.lakes} fill="#fff" stroke="#a9c0cc" strokeWidth="0.9" fillRule="evenodd" strokeLinejoin="round" />
      <path d={paths.rivers} fill="none" stroke="#a9c0cc" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" />
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
      <g className="map-scale" fill="none" stroke={MAP_SECONDARY} strokeWidth="1">
        <path d={`M${SCALE_EDGE} ${scaleY - 4}V${scaleY}H${SCALE_EDGE + scale.px}V${scaleY - 4}`} />
        <text
          x={SCALE_EDGE + scale.px + SCALE_LABEL_GAP}
          y={scaleY}
          fill={MAP_SECONDARY}
          stroke="none"
          fontFamily="Inter"
          fontSize="11"
          fontWeight="500"
        >
          {scaleLabel}
        </text>
      </g>
    </svg>
  )
}
