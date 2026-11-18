// The map of the places of a book: the functions with no browser in them. docs/DESIGN.md sections 15.8, 15.10,
// and 15.11, docs/TASKS.md Task 38 step 3. Each function that depends on the zoom takes the scale as an input, for
// the zoom of Task 39. The data files are those of Task 37, docs/DESIGN.md section 15.9.

/** A box in degrees: west, east, south, north. */
export type Box = [number, number, number, number]

export type Kind = 'place' | 'region' | 'mountain' | 'water'

export interface MapPlace {
  name: string
  lon: number
  lat: number
  verses: number
  kind: Kind
  sure: boolean
}

export interface MapBook {
  book: string
  region: string
  named: number
  places: MapPlace[]
  inSettlement: string[]
  noPosition: string[]
}

export interface MapRegionInfo {
  id: string
  name: string
  box: Box
  dataBox: Box
}

export interface MapIndex {
  regions: MapRegionInfo[]
  books: { book: string; region: string }[]
}

export interface MapRegionFile {
  region: string
  dataBox: Box
  unit: number
  land: number[][][]
  lakes: number[][][]
  rivers: { scalerank: number; lines: number[][] }[]
}

// ---- the frame and the first view ----

/** The ratio of width to height of the frame of the map: from 0.75 to 2.0. "The layout", rule 1. */
export const RATIO_MIN = 0.75
export const RATIO_MAX = 2.0

/** The cosine of the middle latitude of a box. */
export function cosMid(box: Box): number {
  return Math.cos((((box[2] + box[3]) / 2) * Math.PI) / 180)
}

/** The ratio of a region: its width in degrees, times the cosine of its middle latitude, divided by its height in degrees. */
export function regionRatio(box: Box): number {
  return ((box[1] - box[0]) * cosMid(box)) / (box[3] - box[2])
}

/** A height that keeps the ratio of the frame from 0.75 to 2.0: the nearest limit. */
export function clampFrameHeight(width: number, height: number): number {
  return Math.min(width / RATIO_MIN, Math.max(width / RATIO_MAX, height))
}

/** The height of the bar of the map page, and the space above and below the map in the wide layout. */
export const BAR_PX = 52
export const WIDE_SPACE_PX = 28

/**
 * The height of the map in the wide layout: the height of the window below the bar minus 56 px, in the range of
 * the ratio. "The layout", rule 2. `border` is the sum of the top and the bottom line of the frame.
 */
export function wideFrameHeight(width: number, windowHeight: number, border = 0): number {
  return Math.round(clampFrameHeight(width, windowHeight - BAR_PX - 2 * WIDE_SPACE_PX - border))
}

/**
 * The height of the map in the narrow layout: its width divided by the ratio of its region, not more than 62% of
 * the height of the window, and not less than 300 px, in the range of the ratio. "The layout", rule 3.
 */
export function narrowFrameHeight(width: number, windowHeight: number, box: Box): number {
  const h = Math.max(300, Math.min(width / regionRatio(box), 0.62 * windowHeight))
  return Math.round(clampFrameHeight(width, h))
}

/**
 * The view of the map. `k` is the scale: px for one degree of latitude. `c` is the cosine of the middle latitude of
 * the region. The point (`lon`, `lat`) is in the center of the frame.
 */
export interface View {
  width: number
  height: number
  k: number
  c: number
  lon: number
  lat: number
}

/** The first view: the box of the region in the center of the frame, as large as the frame permits. "The drawing", rule 1. */
export function firstView(box: Box, width: number, height: number): View {
  const c = cosMid(box)
  const k = Math.min(width / ((box[1] - box[0]) * c), height / (box[3] - box[2]))
  return { width, height, k, c, lon: (box[0] + box[1]) / 2, lat: (box[2] + box[3]) / 2 }
}

// ---- the zoom: docs/DESIGN.md section 15.11, "The zoom, Task 39" ----

/** At the last step of the zoom, one mile is 20 px or more. "The zoom", rule 1. */
export const LAST_STEP_PX_PER_MILE = 20

/** The number of px for one mile at a scale. */
export function pxPerMile(k: number): number {
  return k / MILES_PER_DEGREE
}

/**
 * The last step of the zoom: each step doubles the scale of the first view, and the last step is the first one
 * where one mile is 20 px or more. Step 0 is the first view.
 */
export function lastStep(firstK: number): number {
  // A frame with no area gives a scale of 0 or less. Then the zoom has no step, and the loop below would not end.
  if (!(firstK > 0) || !Number.isFinite(firstK)) return 0
  let step = 0
  while (pxPerMile(firstK * 2 ** step) < LAST_STEP_PX_PER_MILE) step++
  return step
}

/**
 * The whole first view at the scale of a step: the frame times 2 to the power of the step, with the same center.
 * The priority rule and the drawing use it. The frame shows a part of it, from an offset in px.
 */
export function stepView(first: View, step: number): View {
  const f = 2 ** step
  return { ...first, width: first.width * f, height: first.height * f, k: first.k * f }
}

/** The offset in px of the frame in the whole first view at a step: the left and top edge of the part that shows. */
export interface Offset {
  x: number
  y: number
}

/** The limits of a move: the frame stays in the first view. "The zoom", rule 2. */
export function clampOffset(first: View, step: number, o: Offset): Offset {
  const f = 2 ** step
  const maxX = first.width * (f - 1)
  const maxY = first.height * (f - 1)
  return { x: Math.min(Math.max(o.x, 0), maxX), y: Math.min(Math.max(o.y, 0), maxY) }
}

/**
 * The offset after a change of the step. The point of the map below `at`, in px of the frame, stays at the same
 * place. The controls and the keys use the center of the frame.
 */
export function zoomOffset(first: View, from: number, to: number, o: Offset, at?: Offset): Offset {
  const a = at ?? { x: first.width / 2, y: first.height / 2 }
  const r = 2 ** (to - from)
  return clampOffset(first, to, { x: (o.x + a.x) * r - a.x, y: (o.y + a.y) * r - a.y })
}

/**
 * The offset after a change of the size of the frame, for example at a rotation of a phone. The step stays if the new
 * frame has it, and the point of the map at the center of the frame stays at the center.
 */
export function resizeOffset(from: View, fromStep: number, to: View, toStep: number, o: Offset): Offset {
  const kFrom = from.k * 2 ** fromStep
  const kTo = to.k * 2 ** toStep
  const fTo = 2 ** toStep
  // The center of the frame, in px from the center of the first view at the scale of the step.
  const dx = o.x + from.width / 2 - (from.width * 2 ** fromStep) / 2
  const dy = o.y + from.height / 2 - (from.height * 2 ** fromStep) / 2
  const r = kTo / kFrom
  return clampOffset(to, toStep, {
    x: (to.width * fTo) / 2 + dx * r - to.width / 2,
    y: (to.height * fTo) / 2 + dy * r - to.height / 2,
  })
}

/** The projection: x is the longitude times the cosine of the middle latitude, and y is the latitude. In px of the frame. */
export function project(view: View, lon: number, lat: number): [number, number] {
  return [view.width / 2 + (lon - view.lon) * view.c * view.k, view.height / 2 - (lat - view.lat) * view.k]
}

/** True if a point in px is in the frame. */
export function inFrame(view: View, x: number, y: number): boolean {
  return x >= 0 && x <= view.width && y >= 0 && y <= view.height
}

/** The rivers with a scalerank of 6 or less show always. The others show when one degree of latitude is 80 px or more. */
export function riverShows(scalerank: number, k: number): boolean {
  return scalerank <= 6 || k >= 80
}

// ---- the coast, the lakes, and the rivers ----

/** The points of a ring or a line of a region file, in degrees. Docs/DATA-SOURCES.md section 12: the first point, then the differences. */
export function decode(flat: number[], unit: number): [number, number][] {
  const out: [number, number][] = []
  let x = 0
  let y = 0
  for (let i = 0; i + 1 < flat.length; i += 2) {
    x += flat[i]
    y += flat[i + 1]
    out.push([x * unit, y * unit])
  }
  return out
}

/** SVG path data for rings or lines, in px of the view, with one decimal place. */
export function pathData(parts: number[][], unit: number, view: View, closed: boolean): string {
  let d = ''
  for (const flat of parts) {
    const pts = decode(flat, unit)
    pts.forEach(([lon, lat], i) => {
      const [x, y] = project(view, lon, lat)
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    if (closed && pts.length) d += 'Z'
  }
  return d
}

// ---- the scale bar ----

/** One degree of latitude in miles. "The drawing", rule 6. */
export const MILES_PER_DEGREE = 69.09
export const SCALE_MILES = [5, 10, 25, 50, 100, 200, 300, 500, 1000]

/** The scale bar: the first length of the list that is 50 px or more. If none is, the last length. */
export function scaleBar(k: number): { miles: number; px: number } {
  const pxPerMile = k / MILES_PER_DEGREE
  const miles = SCALE_MILES.find((m) => m * pxPerMile >= 50) ?? SCALE_MILES[SCALE_MILES.length - 1]
  return { miles, px: miles * pxPerMile }
}

// ---- the counts ----

/**
 * A list of names: a name that is in the list two times shows one time. 8 names at most, then ", and 3 more." with
 * the number of the other names. "The parts of the page", rule 2.
 */
export function nameList(names: string[]): string {
  const unique = [...new Set(names)]
  if (unique.length <= 8) return `${unique.join(', ')}.`
  // The number of the other places: the places of the list that the 8 names shown do not stand for. Task 38b step 7.
  const shown = new Set(unique.slice(0, 8))
  const others = names.filter((n) => !shown.has(n)).length
  return `${unique.slice(0, 8).join(', ')}, and ${others} more.`
}

// ---- the switch for the places that are not certain: docs/DESIGN.md section 15.11, Tasks 39b and 39d ----

/**
 * True if the switch takes out the place: a place with a dot or a triangle, with a position that is not certain. A
 * water and a region stay on the map always: they have no open sign. Rule 5.
 */
export function switchTakesOut(p: MapPlace): boolean {
  return !p.sure && hasDot(p.kind)
}

/** True if the book has a dot or a triangle that is not certain. Only such a book has the switch. Rule 4. */
export function hasUncertain(places: MapPlace[]): boolean {
  return places.some(switchTakesOut)
}

/**
 * The places of the map with the switch off: the site takes out each dot and each triangle with a position that is
 * not certain, before the rules of "Which places show". Rule 5.
 */
export function withoutUncertain(places: MapPlace[]): MapPlace[] {
  return places.filter((p) => !switchTakesOut(p))
}

/** The number of places in the first view that the switch takes out: the dots and the triangles only. Rule 6. */
export function uncertainInView(places: MapPlace[], onMap: boolean[]): number {
  return places.filter((p, i) => onMap[i] && switchTakesOut(p)).length
}

/** The sentence of the counts with the switch off, in its two forms. No sentence for 0. Rule 6. */
export function uncertainSentence(n: number): string | null {
  if (n === 0) return null
  if (n === 1) return '1 of them has a position that is not certain, and the map does not show it.'
  return `${n} of them have a position that is not certain, and the map does not show them.`
}

/**
 * The sentences of the counts, from the book file and the places of the file that are in the first view.
 * `onMap[i]` is true if the place `i` of the file is in the first view. "The parts of the page", rule 2. With the
 * switch off, `uncertainOff` is true, and the sentence of the places that are not certain follows the first one.
 */
export function countSentences(bookName: string, file: MapBook, onMap: boolean[], uncertainOff = false): string[] {
  const n = file.named
  const m = onMap.filter(Boolean).length
  const out: string[] = []
  if (n === 1) out.push(`${bookName} names 1 place. ${m === 1 ? 'It is on this map.' : 'It is not on this map.'}`)
  else out.push(`${bookName} names ${n} places. ${m === 1 ? '1 is' : `${m} are`} on this map.`)
  const notCertain = uncertainOff ? uncertainSentence(uncertainInView(file.places, onMap)) : null
  if (notCertain) out.push(notCertain)
  const outside = file.places.filter((_, i) => !onMap[i]).map((p) => p.name)
  if (outside.length === 1) out.push(`1 place is outside this map: ${nameList(outside)}`)
  else if (outside.length > 1) out.push(`${outside.length} places are outside this map: ${nameList(outside)}`)
  const city = file.inSettlement
  if (city.length === 1) out.push(`1 place is inside a city, and the map does not show it: ${nameList(city)}`)
  else if (city.length > 1) out.push(`${city.length} places are inside a city, and the map does not show them: ${nameList(city)}`)
  const none = file.noPosition
  if (none.length === 1) out.push(`The data has no position for 1 place: ${nameList(none)}`)
  else if (none.length > 1) out.push(`The data has no position for ${none.length} places: ${nameList(none)}`)
  return out
}

// ---- which places show: the priority rule ----

/** A place with a dot or a triangle: a place or a mountain. A region and a water have a name and no dot. */
export function hasDot(kind: Kind): boolean {
  return kind === 'place' || kind === 'mountain'
}

/**
 * The places at one position, rule 1 of the priority rule. The result has the index in the file of each place that
 * stays, in the order of the file. Of the places with a dot or a triangle at one position, the first in the file
 * stays: the file has the most verses first, and the order of the data for the same number. Of the places with the
 * same name at one position, of any kind, the first in the file stays.
 */
export function placesThatStay(places: MapPlace[]): number[] {
  const dotAt = new Set<string>()
  const nameAt = new Set<string>()
  const out: number[] = []
  places.forEach((p, i) => {
    const at = `${p.lon},${p.lat}`
    const named = `${p.name}|${at}`
    // The two rules are separate: a place that the first rule removes still removes the later places with its name.
    const sameName = nameAt.has(named)
    nameAt.add(named)
    const sameDot = hasDot(p.kind) && dotAt.has(at)
    if (hasDot(p.kind)) dotAt.add(at)
    if (!sameName && !sameDot) out.push(i)
  })
  return out
}

/** For each place of the file: true if its position is in the view. "On this map" is the first view. */
export function placesOnMap(places: MapPlace[], view: View): boolean[] {
  return places.map((p) => {
    const [x, y] = project(view, p.lon, p.lat)
    return inFrame(view, x, y)
  })
}

/** The style of a name. "The drawing", rule 5. */
export type NameStyle = 'place' | 'place-bold' | 'region' | 'water'

export interface NameFont {
  family: 'Inter' | 'Lora'
  size: number
  weight: number
  italic: boolean
  /** The space between the letters in px. */
  spacing: number
  color: string
}

/** The ink color of the site, and the secondary color of the map: a contrast of 4.5 to 1 or more on the land color. */
export const INK = '#1d1d1f'
export const MAP_SECONDARY = '#6b6b6b'
export const WATER_NAME = '#4a6f84'

/** The font of a name, in the wide or the narrow layout. "The drawing", rule 5. */
export function nameFont(style: NameStyle, sure: boolean, wide: boolean): NameFont {
  if (style === 'region') {
    return { family: 'Inter', size: wide ? 10.5 : 9.5, weight: sure ? 600 : 400, italic: false, spacing: 1.6, color: MAP_SECONDARY }
  }
  if (style === 'water') return { family: 'Lora', size: wide ? 13.5 : 12, weight: 400, italic: true, spacing: 0, color: WATER_NAME }
  const size = (wide ? 12.5 : 11) + (style === 'place-bold' ? 1 : 0)
  return { family: 'Inter', size, weight: style === 'place-bold' ? 700 : 500, italic: false, spacing: 0, color: sure ? INK : MAP_SECONDARY }
}

/** The font of a name in the CSS form, for the canvas and for document.fonts. */
export function cssFont(f: NameFont): string {
  return `${f.italic ? 'italic ' : ''}${f.weight} ${f.size}px ${f.family}`
}

/** A box in px: left, top, width, height. */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** The size of a name in px, from the browser. The ascent places the text in its box. */
export type Measure = (text: string, style: NameStyle, sure: boolean) => { w: number; h: number; ascent: number }

export interface ShownDot {
  /** The index of the place in the file. */
  i: number
  x: number
  y: number
}

export interface ShownName {
  i: number
  text: string
  style: NameStyle
  /** The box of the name, without the 2 px around it. */
  box: Rect
  ascent: number
}

/** The corners of the box where the lines of the map stop at a name: 3 px round. "The drawing", rule 5. */
export const NAME_CUT_RADIUS = 3

/**
 * The box where the coast line, the river lines, and the lines of the lakes stop at a name: the box of the name,
 * 2 px wider at the left and at the right. "The drawing", rule 5.
 */
export function nameCut(box: Rect): Rect {
  return { x: box.x - 2, y: box.y, w: box.w + 4, h: box.h }
}

/** A double tap: two taps at one point, in 300 ms. A tap that moves more than 10 px is not a tap. "The zoom", rule 9. */
export const DOUBLE_TAP_MS = 300
export const TAP_MOVE = 10

/** True if two taps are a double tap: the second in 300 ms, and in 20 px of the first. */
export function isDoubleTap(first: { t: number; x: number; y: number } | null, second: { t: number; x: number; y: number }): boolean {
  return first !== null && second.t - first.t <= DOUBLE_TAP_MS && Math.hypot(second.x - first.x, second.y - first.y) <= 2 * TAP_MOVE
}

export interface Priority {
  dots: ShownDot[]
  names: ShownName[]
  /** For each place of the file: true if its position is in the frame. */
  onMap: boolean[]
}

export interface PriorityInput {
  places: MapPlace[]
  view: View
  /** The radius of a dot: 3.5 px in the wide layout, 3 px in the narrow layout. */
  radius: number
  measure: Measure
  /** Boxes in px where no name goes: in the first view, the zoom controls and the scale bar. */
  blocked: Rect[]
}

/** The space around a name, the space from a dot to its name, and the space between two dots. */
const NAME_SPACE = 2
const NAME_GAP = 5
const DOT_SPACE = 2

export function touches(a: Rect, b: Rect): boolean {
  return a.x <= b.x + b.w && b.x <= a.x + a.w && a.y <= b.y + b.h && b.y <= a.y + a.h
}

/**
 * The size of a triangle: 3 px wider than the dot and 2 px higher. 10 by 9 px in the wide layout, 9 by 8 px in the
 * narrow layout. "The drawing", rule 4.
 */
export function triangleSize(radius: number): { w: number; h: number } {
  return { w: 2 * radius + 3, h: 2 * radius + 2 }
}

/** SVG path data of a triangle with its center on the point. */
export function trianglePath(x: number, y: number, radius: number): string {
  const { w, h } = triangleSize(radius)
  return `M${x} ${y - h / 2}L${x + w / 2} ${y + h / 2}L${x - w / 2} ${y + h / 2}Z`
}

/**
 * The radius of the mark of a place in the priority rule: the radius of the dot, or half the width of the triangle,
 * 5 px in the wide layout and 4.5 px in the narrow layout. "The drawing", rule 4.
 */
export function markRadius(kind: Kind, radius: number): number {
  return kind === 'mountain' ? triangleSize(radius).w / 2 : radius
}

/** The box of the sign of a place: a dot, or a triangle for a mountain. */
export function signBox(kind: Kind, x: number, y: number, radius: number): Rect {
  if (kind === 'mountain') {
    const { w, h } = triangleSize(radius)
    return { x: x - w / 2, y: y - h / 2, w, h }
  }
  return { x: x - radius, y: y - radius, w: 2 * radius, h: 2 * radius }
}

const grow = (r: Rect, d: number): Rect => ({ x: r.x - d, y: r.y - d, w: r.w + 2 * d, h: r.h + 2 * d })

/** The text of a name on the map: a region in capitals. */
export function nameText(p: MapPlace): string {
  return p.kind === 'region' ? p.name.toUpperCase() : p.name
}

/** A bold name is only for a place that the book names in 3 verses or more. "The drawing", rule 5. */
export const BOLD_MIN_VERSES = 3

/**
 * The three places with a dot or a triangle that the book names most: their name is in bold, but only a place that
 * the book names in 3 verses or more. "The drawing", rule 5.
 */
export function boldPlaces(places: MapPlace[], stay: number[]): Set<number> {
  return new Set(
    stay
      .filter((i) => hasDot(places[i].kind))
      .slice(0, 3)
      .filter((i) => places[i].verses >= BOLD_MIN_VERSES),
  )
}

/** The positions of the name of a place with a dot, in order: right, left, above, below, and the four corners. */
function dotNamePositions(x: number, y: number, r: number, w: number, h: number): Rect[] {
  const g = r + NAME_GAP
  const d = g * Math.SQRT1_2
  return [
    { x: x + g, y: y - h / 2, w, h },
    { x: x - g - w, y: y - h / 2, w, h },
    { x: x - w / 2, y: y - g - h, w, h },
    { x: x - w / 2, y: y + g, w, h },
    { x: x + d, y: y - d - h, w, h },
    { x: x + d, y: y + d, w, h },
    { x: x - d - w, y: y - d - h, w, h },
    { x: x - d - w, y: y + d, w, h },
  ]
}

/** The positions of the name of a region: on its point, above, below, right, left. A water: on its point, above, below. */
function areaNamePositions(kind: Kind, x: number, y: number, w: number, h: number): Rect[] {
  const on = { x: x - w / 2, y: y - h / 2, w, h }
  const above = { x: x - w / 2, y: y - h / 2 - h, w, h }
  const below = { x: x - w / 2, y: y + h / 2, w, h }
  if (kind === 'water') return [on, above, below]
  return [on, above, below, { x: x + NAME_GAP, y: y - h / 2, w, h }, { x: x - NAME_GAP - w, y: y - h / 2, w, h }]
}

/**
 * The priority rule of section 15.11. The places of the file in its order, the most verses first. A place with a dot
 * shows if its dot is not near a dot that shows and does not touch a name that shows. Its name goes to the first
 * free position, or it shows with no name. A region and a water show their name at the first free position, or not.
 */
export function priority({ places, view, radius, measure, blocked }: PriorityInput): Priority {
  const onMap = placesOnMap(places, view)
  const stay = placesThatStay(places)
  const bold = boldPlaces(places, stay)
  const dots: ShownDot[] = []
  const names: ShownName[] = []
  const dotBox = (d: { x: number; y: number; i: number }): Rect => signBox(places[d.i].kind, d.x, d.y, radius)
  const frame: Rect = { x: 0, y: 0, w: view.width, h: view.height }
  const free = (box: Rect) => {
    const around = grow(box, NAME_SPACE)
    if (around.x < frame.x || around.y < frame.y || around.x + around.w > frame.w || around.y + around.h > frame.h) return false
    if (blocked.some((b) => touches(around, b))) return false
    if (dots.some((d) => touches(around, dotBox(d)))) return false
    return !names.some((n) => touches(around, n.box))
  }
  for (const i of stay) {
    if (!onMap[i]) continue
    const p = places[i]
    const [x, y] = project(view, p.lon, p.lat)
    const text = nameText(p)
    const style: NameStyle = p.kind === 'region' ? 'region' : p.kind === 'water' ? 'water' : bold.has(i) ? 'place-bold' : 'place'
    const size = measure(text, style, p.sure)
    if (hasDot(p.kind)) {
      // The sum of the two radii plus 2 px: a triangle has a radius of half its width.
      const mr = markRadius(p.kind, radius)
      const near = dots.some((d) => Math.hypot(d.x - x, d.y - y) < mr + markRadius(places[d.i].kind, radius) + DOT_SPACE)
      if (near || names.some((n) => touches(dotBox({ x, y, i }), n.box))) continue
      dots.push({ i, x, y })
      // The name is 5 px from the edge of the dot, or of the triangle.
      const box = dotNamePositions(x, y, mr, size.w, size.h).find(free)
      if (box) names.push({ i, text, style, box, ascent: size.ascent })
    } else {
      const box = areaNamePositions(p.kind, x, y, size.w, size.h).find(free)
      if (box) names.push({ i, text, style, box, ascent: size.ascent })
    }
  }
  return { dots, names, onMap }
}
