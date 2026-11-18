// The map page: the places of one book on a map. docs/DESIGN.md sections 15.8, 15.10, and 15.11, docs/TASKS.md
// Tasks 38, 39, 39b, 39c, and 39d. The line "Where" of "About this book" links to it from Task 40. The drawing and the zoom are in MapDrawing.tsx.

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { BookNotFound } from '../book/BookNotFound.tsx'
import { groupOf, groupVar, type Book } from '../data/books.ts'
import { bookHref } from '../router.ts'
import type { ScreenLayout } from '../screenLayout.ts'
import { bandLabel } from '../wall/layout.ts'
import { loadBookMap, type BookMap } from './mapData.ts'
import { MapDrawing } from './MapDrawing.tsx'
import {
  countSentences,
  firstView,
  hasUncertain,
  narrowFrameHeight,
  placesOnMap,
  trianglePath,
  wideFrameHeight,
  withoutUncertain,
  type MapPlace,
  type View,
} from './mapLayout.ts'
import { setMapUncertain, useMapUncertain } from './uncertain.ts'

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
  // A frame with no area, for example in a window of 1 px, gets no map.
  const sizedView = useMemo(() => (frameW > 2 && frameH > 2 ? firstView(box, frameW - (wide ? 2 : 0), frameH - 2) : null), [box, frameW, frameH, wide])
  // While the frame has no area, the map keeps its last view, so that the zoom of the reader stays.
  const [keptView, setKeptView] = useState<View | null>(null)
  if (sizedView && sizedView !== keptView) setKeptView(sizedView)
  const view = sizedView ?? keptView
  const onMap = useMemo(() => (view ? placesOnMap(places, view) : null), [places, view])
  // The switch for the places that are not certain. With the switch off, the site takes these places out first.
  const uncertainOn = useMapUncertain()
  const showSwitch = hasUncertain(places)
  const uncertainOff = showSwitch && !uncertainOn
  const drawn = useMemo(() => (uncertainOff ? withoutUncertain(places) : places), [places, uncertainOff])
  const color = groupVar(groupOf(book))
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
        {/* The switch for the places that are not certain, one line below the line "Map:". The full line is the
            control: a switch for a screen reader, with the name from its words. Section 15.11, Task 39c. */}
        {showSwitch && (
          <button type="button" role="switch" aria-checked={uncertainOn} className="map-switch" onClick={() => setMapUncertain(!uncertainOn)}>
            <span>Places that are not certain</span>
            <span className="map-switch-track" aria-hidden="true">
              <span className="map-switch-knob" />
            </span>
          </button>
        )}
      </div>
      <div className="map-holder" ref={holderRef}>
        {view && file.region && (
          <div className="map-frame" style={{ height: frameH }}>
            <MapDrawing
              book={book}
              regionName={regionName}
              places={drawn}
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
            {countSentences(book.name, file.file, onMap, uncertainOff).map((s) => (
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
      {kind === 'dot' && <circle r={r} fill={color} stroke="var(--map-dot-edge)" strokeWidth="1" />}
      {kind === 'open' && <circle r={r} fill="var(--map-dot-open)" stroke={color} strokeWidth="1.4" />}
      {kind === 'triangle' && <path d={trianglePath(0, 0, r)} fill={color} stroke="var(--map-dot-edge)" strokeWidth="1" />}
    </svg>
  )
}
