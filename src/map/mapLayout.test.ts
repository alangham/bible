// docs/TASKS.md Task 38 step 3: the functions of the map page with no browser in them. docs/DESIGN.md section 15.11.

import { describe, expect, it } from 'vitest'
import {
  clampFrameHeight,
  clampOffset,
  lastStep,
  resizeOffset,
  markRadius,
  pxPerMile,
  zoomOffset,
  countSentences,
  hasUncertain,
  isDoubleTap,
  nameCut,
  uncertainInView,
  uncertainSentence,
  withoutUncertain,
  decode,
  firstView,
  nameList,
  narrowFrameHeight,
  placesThatStay,
  priority,
  project,
  regionRatio,
  riverShows,
  signBox,
  trianglePath,
  triangleSize,
  scaleBar,
  stepView,
  wideFrameHeight,
  type Box,
  type MapBook,
  type MapPlace,
  type Measure,
} from './mapLayout.ts'

const R1: Box = [34.0, 36.7, 29.4, 33.7]
const R5: Box = [12.0, 38.0, 30.0, 44.0]

const place = (name: string, lon: number, lat: number, verses: number, kind: MapPlace['kind'] = 'place', sure = true): MapPlace => ({
  name,
  lon,
  lat,
  verses,
  kind,
  sure,
})

describe('the frame', () => {
  it('gives the ratio of a region from the cosine of its middle latitude', () => {
    expect(regionRatio(R1)).toBeCloseTo((2.7 * Math.cos((31.55 * Math.PI) / 180)) / 4.3, 10)
    expect(regionRatio(R5)).toBeCloseTo((26 * Math.cos((37 * Math.PI) / 180)) / 14, 10)
  })

  it('keeps the ratio of the frame from 0.75 to 2.0', () => {
    expect(clampFrameHeight(390, 600)).toBe(520)
    expect(clampFrameHeight(390, 100)).toBe(195)
    expect(clampFrameHeight(390, 300)).toBe(300)
  })

  it('gives the narrow heights of the example: Joshua 520 px, Acts 300 px at 390 by 844', () => {
    expect(narrowFrameHeight(390, 844, R1)).toBe(520)
    expect(narrowFrameHeight(390, 844, R5)).toBe(300)
  })

  it('gives the wide height: the window below the bar minus 56 px', () => {
    expect(wideFrameHeight(960, 900)).toBe(792)
    // A low window: the ratio of 2.0 at most.
    expect(wideFrameHeight(960, 400)).toBe(480)
  })
})

describe('the first view', () => {
  it('puts the box of the region in the center, as large as the frame permits', () => {
    const v = firstView(R5, 958, 790)
    const [x0, y0] = project(v, 12, 44)
    const [x1, y1] = project(v, 38, 30)
    expect((x0 + x1) / 2).toBeCloseTo(479, 6)
    expect((y0 + y1) / 2).toBeCloseTo(395, 6)
    // R5 is wider than the frame: its width fills the frame, and the frame shows land above and below it.
    expect(x0).toBeCloseTo(0, 6)
    expect(x1).toBeCloseTo(958, 6)
    expect(y0).toBeGreaterThan(0)
  })

  it('takes the scale as an input for the zoom', () => {
    const v = firstView(R1, 958, 790)
    const z = stepView(v, 1)
    expect(project(z, v.lon, v.lat)).toEqual([958, 790])
    expect(project(z, v.lon, v.lat + 1)[1]).toBeCloseTo(790 - 2 * v.k, 6)
  })

  it('shows the small rivers from 80 px for one degree of latitude', () => {
    expect(riverShows(6, 10)).toBe(true)
    expect(riverShows(7, 79.9)).toBe(false)
    expect(riverShows(7, 80)).toBe(true)
  })
})

describe('the coordinates of a region file', () => {
  it('reads the first point, then the differences', () => {
    expect(decode([350000, 310000, 10, -20, 5, 5], 0.0001)).toEqual([
      [35, 31],
      [35.001, 30.998],
      [35.0015, 30.9985],
    ].map(([a, b]) => [expect.closeTo(a, 9), expect.closeTo(b, 9)]))
  })
})

describe('the scale bar', () => {
  it('takes the first length of 50 px or more', () => {
    // 69.09 px for one degree: 1 px for one mile.
    expect(scaleBar(69.09)).toEqual({ miles: 50, px: expect.closeTo(50, 9) })
    expect(scaleBar(69.09 * 1.01).miles).toBe(50)
    expect(scaleBar(69.09 * 0.99).miles).toBe(100)
    expect(scaleBar(69.09 * 20).miles).toBe(5)
  })

  it('gives 1000 miles when no length is 50 px or more', () => {
    expect(scaleBar(1).miles).toBe(1000)
  })
})

describe('the counts', () => {
  const file = (places: MapPlace[], inSettlement: string[] = [], noPosition: string[] = []): MapBook => ({
    book: 'x',
    region: 'r1',
    named: places.length + inSettlement.length + noPosition.length,
    places,
    inSettlement,
    noPosition,
  })

  it('writes the sentences of the example of Acts', () => {
    const places = Array.from({ length: 105 }, (_, i) => place(`P${i}`, 35, 31, 1))
    const outside = ['Haran', 'Mesopotamia', 'Babylon', 'Chaldea', 'Ethiopia']
    outside.forEach((n, i) => (places[100 + i] = place(n, 44, 33, 1)))
    const onMap = places.map((_, i) => i < 100)
    expect(countSentences('Acts', file(places, ['Beautiful Gate', 'Solomon’s Portico']), onMap)).toEqual([
      'Acts names 107 places. 100 are on this map.',
      '5 places are outside this map: Haran, Mesopotamia, Babylon, Chaldea, Ethiopia.',
      '2 places are inside a city, and the map does not show them: Beautiful Gate, Solomon’s Portico.',
    ])
  })

  it('writes the sentences for one place', () => {
    expect(countSentences('Proverbs', file([place('Egypt', 31, 30, 1, 'region')]), [true])).toEqual([
      'Proverbs names 1 place. It is on this map.',
    ])
    const f = file([place('Egypt', 31, 30, 1, 'region'), place('Zion', 35, 31, 1)], ['Uzza'], ['Hobah'])
    expect(countSentences('Book', f, [false, true])).toEqual([
      'Book names 4 places. 1 is on this map.',
      '1 place is outside this map: Egypt.',
      '1 place is inside a city, and the map does not show it: Uzza.',
      'The data has no position for 1 place: Hobah.',
    ])
    expect(countSentences('Book', file([], [], ['Hobah', 'Kedesh']), [])).toEqual([
      'Book names 2 places. 0 are on this map.',
      'The data has no position for 2 places: Hobah, Kedesh.',
    ])
  })

  it('shows 8 names at most, and a name one time', () => {
    expect(nameList(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'])).toBe('A, B, C, D, E, F, G, H, and 3 more.')
    expect(nameList(['Hazor', 'Kedesh', 'Hazor'])).toBe('Hazor, Kedesh.')
    const places = [place('Hazor', 40, 40, 3), place('Hazor', 41, 40, 2), place('Kedesh', 42, 40, 1)]
    expect(countSentences('Joshua', file(places), [false, false, false])[1]).toBe('3 places are outside this map: Hazor, Kedesh.')
  })

  // Task 38b step 7: N is the number of the places of the list that the 8 names shown do not stand for.
  it('gives the number of the other places after 8 names, so that the numbers of the sentence add up', () => {
    // Ezekiel: "Lud" two times in the list. 18 places, 17 names.
    const names = ['Cush', 'Eden', 'Tarshish', 'Put', 'Sheba', 'Thebes', 'Arabia', 'Beth-togarmah', 'Lud', 'Lud', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    expect(nameList(names)).toBe('Cush, Eden, Tarshish, Put, Sheba, Thebes, Arabia, Beth-togarmah, and 10 more.')
    // A name of the 8 that is two times in the list stands for its two places.
    expect(nameList(['Hazor', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Hazor', 'I', 'J'])).toBe('Hazor, B, C, D, E, F, G, H, and 2 more.')
  })
})

describe('the places at one position', () => {
  it('keeps the dot with the most verses, and the first on a tie', () => {
    const places = [place('Jebus', 35.2, 31.8, 3), place('Jerusalem', 35.2, 31.8, 3), place('Zion', 35.2, 31.8, 1), place('Gath', 35, 31.7, 1)]
    expect(placesThatStay(places)).toEqual([0, 3])
  })

  it('keeps a region and a water at the position of a dot', () => {
    const places = [place('Jerusalem', 35.2, 31.8, 9), place('Judea', 35.2, 31.8, 5, 'region'), place('Zion', 35.2, 31.8, 1, 'mountain')]
    expect(placesThatStay(places)).toEqual([0, 1])
  })

  it('keeps one of the places with one name at one position, of any kind', () => {
    // Joshua: the region "Galilee" has more verses than the place "Galilee".
    const galilee = [place('Galilee', 35.4, 32.8, 4, 'region'), place('Galilee', 35.4, 32.8, 1)]
    expect(placesThatStay(galilee)).toEqual([0])
    // Exodus: "Red Sea" two times at one position.
    const redSea = [place('Red Sea', 33, 28.75, 5, 'water'), place('Red Sea', 34, 28, 3, 'water'), place('Red Sea', 33, 28.75, 1, 'water')]
    expect(placesThatStay(redSea)).toEqual([0, 1])
  })

  it('removes a later place with the name of a place that the first rule removed', () => {
    const places = [place('A', 35, 31, 5), place('B', 35, 31, 3), place('B', 35, 31, 1, 'region')]
    expect(placesThatStay(places)).toEqual([0])
  })
})

describe('the priority rule', () => {
  // Each name is 6 px for each letter and 12 px high.
  const measure: Measure = (text) => ({ w: text.length * 6, h: 12, ascent: 10 })
  // 100 px for one degree, with no change of the longitude at the equator.
  const view = { width: 400, height: 300, k: 100, c: 1, lon: 0, lat: 0 }
  const at = (x: number, y: number) => ({ lon: (x - 200) / 100, lat: (150 - y) / 100 })
  const p = (name: string, x: number, y: number, verses: number, kind: MapPlace['kind'] = 'place') => {
    const { lon, lat } = at(x, y)
    return place(name, lon, lat, verses, kind)
  }
  const run = (places: MapPlace[], blocked = []) => priority({ places, view, radius: 3.5, measure, blocked })

  it('puts a name to the right of its dot, 5 px from its edge', () => {
    const r = run([p('Rome', 100, 100, 9)])
    expect(r.dots).toEqual([{ i: 0, x: expect.closeTo(100, 6), y: expect.closeTo(100, 6) }])
    expect(r.names[0].box.x).toBeCloseTo(108.5, 6)
    expect(r.names[0].box.y).toBeCloseTo(94, 6)
    expect(r.names[0].style).toBe('place-bold')
  })

  it('hides a dot near a dot that shows: nearer than two radii plus 2 px', () => {
    const r = run([p('A', 100, 100, 9), p('B', 108.9, 100, 5), p('C', 100, 109.1, 1)])
    expect(r.dots.map((d) => d.i)).toEqual([0, 2])
  })

  it('hides a dot that touches a name that shows', () => {
    const r = run([p('Long name', 100, 100, 9), p('B', 130, 100, 5)])
    expect(r.dots.map((d) => d.i)).toEqual([0])
  })

  it('moves the name to the left when the right is not free, then shows a dot with no name', () => {
    // The name of B to the right, with 2 px around it, touches the dot of A.
    const r = run([p('Aaaaaaaa', 130, 100, 9), p('B', 115, 100, 5)])
    expect(r.names.find((n) => n.i === 1)?.box.x).toBeCloseTo(115 - 8.5 - 6, 6)
    const edge = run([p('Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', 200, 150, 1)])
    expect(edge.dots).toHaveLength(1)
    expect(edge.names).toHaveLength(0)
  })

  it('puts a region name on its point, and no dot', () => {
    const r = run([p('Judea', 200, 150, 9, 'region')])
    expect(r.dots).toHaveLength(0)
    expect(r.names[0].text).toBe('JUDEA')
    expect(r.names[0].box.x).toBeCloseTo(185, 6)
    expect(r.names[0].box.y).toBeCloseTo(144, 6)
  })

  it('hides a water name that has no free position', () => {
    const r = run([p('Nile', 200, 150, 9, 'water'), p('Nile', 200, 150, 9, 'water')])
    expect(r.names).toHaveLength(1)
    const blocked = [{ x: 150, y: 100, w: 100, h: 100 }]
    expect(priority({ places: [p('Nile', 200, 150, 9, 'water')], view, radius: 3.5, measure, blocked }).names).toHaveLength(0)
  })

  it('counts a place outside the view, and does not draw it', () => {
    const r = run([p('Babylon', 500, 100, 9), p('Rome', 100, 100, 1)])
    expect(r.onMap).toEqual([false, true])
    expect(r.dots.map((d) => d.i)).toEqual([1])
  })

  it('gives bold to the three places with a dot or a triangle that the book names most', () => {
    const r = run([p('A', 20, 20, 9), p('R', 300, 20, 8, 'region'), p('B', 20, 100, 7), p('C', 20, 180, 6), p('D', 20, 260, 5)])
    expect(r.names.map((n) => n.style)).toEqual(['place-bold', 'region', 'place-bold', 'place-bold', 'place'])
    // Task 38b step 8. Exodus: the mountain "Mount Sinai" with 12 verses is bold.
    const m = run([p('Egypt', 300, 20, 30, 'region'), p('Mount Sinai', 20, 20, 12, 'mountain'), p('Rameses', 20, 100, 4), p('Shur', 20, 180, 3), p('Baal-zephon', 20, 260, 2)])
    expect(m.names.map((n) => `${n.text} ${n.style}`)).toEqual([
      'EGYPT region',
      'Mount Sinai place-bold',
      'Rameses place-bold',
      'Shur place-bold',
      'Baal-zephon place',
    ])
  })

  // Task 38b step 9: a triangle is 3 px wider than the dot and 2 px higher, with its center on the position.
  it('gives a triangle of 10 by 9 px in the wide layout and 9 by 8 px in the narrow layout', () => {
    expect(triangleSize(3.5)).toEqual({ w: 10, h: 9 })
    expect(triangleSize(3)).toEqual({ w: 9, h: 8 })
    expect(trianglePath(100, 50, 3.5)).toBe('M100 45.5L105 54.5L95 54.5Z')
    expect(signBox('mountain', 100, 50, 3)).toEqual({ x: 95.5, y: 46, w: 9, h: 8 })
    expect(signBox('place', 100, 50, 3)).toEqual({ x: 97, y: 47, w: 6, h: 6 })
  })

  it('keeps a name away from the full box of a triangle', () => {
    // A has a name that is wider than the view, so it shows with no name. The name "RR" of the region on its point
    // is from x 106 to 118, and with 2 px around it from 104. The dot of A ends at 103.5, the triangle at 105.
    const long = 'A'.repeat(80)
    const nextToDot = run([p(long, 100, 100, 9), p('Rr', 112, 100, 5, 'region')])
    const nextToTriangle = run([p(long, 100, 100, 9, 'mountain'), p('Rr', 112, 100, 5, 'region')])
    expect(nextToDot.names.map((n) => [n.box.x, n.box.y])).toEqual([[106, 94]])
    // On the point, above, and below touch the triangle: the name goes to the right, 5 px from the point of the region at x 112.
    expect(nextToTriangle.names.map((n) => [n.box.x, n.box.y])).toEqual([[117, 94]])
  })
})

// docs/TASKS.md Task 39 step 1: two corrections of the first view, "The drawing" rules 4 and 5 of section 15.11.
describe('the corrections of Task 39', () => {
  const measure: Measure = (text) => ({ w: text.length * 6, h: 12, ascent: 10 })
  const view = { width: 400, height: 300, k: 100, c: 1, lon: 0, lat: 0 }
  const p = (name: string, x: number, y: number, verses: number, kind: MapPlace['kind'] = 'place', sure = true) =>
    place(name, (x - 200) / 100, (150 - y) / 100, verses, kind, sure)
  const run = (places: MapPlace[]) => priority({ places, view, radius: 3.5, measure, blocked: [] })

  it('gives bold only to a place that the book names in 3 verses or more', () => {
    // Exodus: Mount Horeb is at the position of Mount Sinai, and rule 1 removes it.
    const exodus = run([
      p('Mount Sinai', 40, 40, 12, 'mountain'),
      p('Mount Horeb', 40, 40, 4, 'mountain'),
      p('Rephidim', 40, 120, 3, 'place', false),
      p('Baal-zephon', 40, 200, 2, 'place', false),
    ])
    expect(exodus.names.filter((n) => n.style === 'place-bold').map((n) => n.text)).toEqual(['Mount Sinai', 'Rephidim'])
    // Ephesians: one place in 1 verse.
    expect(run([p('Ephesus', 100, 100, 1)]).names[0].style).toBe('place')
  })

  it('gives a triangle a radius of half its width', () => {
    expect(markRadius('mountain', 3.5)).toBe(5)
    expect(markRadius('mountain', 3)).toBe(4.5)
    expect(markRadius('place', 3.5)).toBe(3.5)
  })

  it('uses the sum of the two radii plus 2 px in the distance rule', () => {
    // A dot and a triangle: 3.5 + 5 + 2 = 10.5 px. Two triangles: 12 px. Two dots: 9 px.
    expect(run([p('A', 100, 100, 9), p('B', 110.4, 100, 5, 'mountain')]).dots.map((d) => d.i)).toEqual([0])
    expect(run([p('A', 100, 100, 9), p('B', 100, 110.6, 5, 'mountain')]).dots.map((d) => d.i)).toEqual([0, 1])
    expect(run([p('A', 100, 100, 9, 'mountain'), p('B', 100, 111.9, 5, 'mountain')]).dots.map((d) => d.i)).toEqual([0])
    expect(run([p('A', 100, 100, 9, 'mountain'), p('B', 100, 112.1, 5, 'mountain')]).dots.map((d) => d.i)).toEqual([0, 1])
  })

  it('puts the name of a mountain 5 px from the edge of the triangle', () => {
    const r = run([p('Sinai', 100, 100, 9, 'mountain')])
    expect(r.names[0].box.x).toBeCloseTo(110, 6)
  })
})

// docs/TASKS.md Task 39 step 4: "The zoom, Task 39" of section 15.11.
describe('the zoom', () => {
  const R2: Box = [29.5, 37.0, 27.5, 34.2]
  const R3: Box = [20.5, 31.5, 35.0, 42.0]
  const R4: Box = [29.0, 49.0, 27.5, 38.5]
  const regions: [string, Box][] = [
    ['r1', R1],
    ['r2', R2],
    ['r3', R3],
    ['r4', R4],
    ['r5', R5],
  ]

  it('has the number of steps of each region at a frame of 960 by 792 px and of 390 by 520 px', () => {
    const steps = (w: number, h: number) => regions.map(([id, box]) => [id, lastStep(firstView(box, w, h).k)])
    expect(steps(960, 792)).toEqual([
      ['r1', 3],
      ['r2', 4],
      ['r3', 4],
      ['r4', 5],
      ['r5', 5],
    ])
    expect(steps(390, 520)).toEqual([
      ['r1', 4],
      ['r2', 5],
      ['r3', 5],
      ['r4', 6],
      ['r5', 7],
    ])
  })

  it('stops at the first step where one mile is 20 px or more', () => {
    for (const [, box] of regions) {
      for (const [w, h] of [
        [960, 792],
        [390, 520],
      ]) {
        const k = firstView(box, w, h).k
        const last = lastStep(k)
        expect(pxPerMile(k * 2 ** last)).toBeGreaterThanOrEqual(20)
        expect(pxPerMile(k * 2 ** (last - 1))).toBeLessThan(20)
      }
    }
    expect(lastStep(20 * 69.09)).toBe(0)
  })

  it('keeps the frame in the first view: the limits of a move', () => {
    const first = firstView(R1, 400, 300)
    expect(clampOffset(first, 0, { x: 50, y: -20 })).toEqual({ x: 0, y: 0 })
    expect(clampOffset(first, 1, { x: -5, y: 9999 })).toEqual({ x: 0, y: 300 })
    expect(clampOffset(first, 2, { x: 9999, y: 100 })).toEqual({ x: 1200, y: 100 })
  })

  it('keeps the point at the center when the size of the frame changes', () => {
    const from = firstView(R1, 400, 300)
    const to = firstView(R1, 300, 400)
    const o = { x: 650, y: 480 }
    const centerOf = (v: typeof from, step: number, off: { x: number; y: number }) => {
      const k = v.k * 2 ** step
      return [v.lon + (off.x + v.width / 2 - (v.width * 2 ** step) / 2) / (v.c * k), v.lat - (off.y + v.height / 2 - (v.height * 2 ** step) / 2) / k]
    }
    const n = resizeOffset(from, 2, to, 2, o)
    const [lon0, lat0] = centerOf(from, 2, o)
    const [lon1, lat1] = centerOf(to, 2, n)
    expect(lon1).toBeCloseTo(lon0, 6)
    expect(lat1).toBeCloseTo(lat0, 6)
    // The same size gives the same offset, and the limits of the new frame apply.
    expect(resizeOffset(from, 1, from, 1, { x: 100, y: 50 })).toEqual({ x: 100, y: 50 })
    expect(resizeOffset(from, 2, to, 0, o)).toEqual({ x: 0, y: 0 })
  })

  it('gives step 0 for a frame with no area, and the loop ends', () => {
    expect(lastStep(0)).toBe(0)
    expect(lastStep(-3)).toBe(0)
    expect(lastStep(Number.NaN)).toBe(0)
    expect(lastStep(Number.POSITIVE_INFINITY)).toBe(0)
    expect(lastStep(firstView(R1, 1, -40).k)).toBe(0)
  })

  it('keeps the center of the frame at a change of the step', () => {
    const first = firstView(R1, 400, 300)
    // From the first view, the center of step 1 shows the center of the first view.
    expect(zoomOffset(first, 0, 1, { x: 0, y: 0 })).toEqual({ x: 200, y: 150 })
    expect(zoomOffset(first, 1, 2, { x: 200, y: 150 })).toEqual({ x: 600, y: 450 })
    expect(zoomOffset(first, 2, 1, { x: 600, y: 450 })).toEqual({ x: 200, y: 150 })
    // Back to the first view: the offset is 0.
    expect(zoomOffset(first, 1, 0, { x: 300, y: 10 })).toEqual({ x: 0, y: 0 })
    // A point other than the center: the point below the fingers stays.
    expect(zoomOffset(first, 0, 1, { x: 0, y: 0 }, { x: 100, y: 100 })).toEqual({ x: 100, y: 100 })
    // Near an edge, the limits apply.
    // (600 + 200) * 2 - 200 = 1400, more than the limit of 1200. (0 + 150) * 2 - 150 = 150.
    expect(zoomOffset(first, 1, 2, { x: 600, y: 0 })).toEqual({ x: 1200, y: 150 })
  })
})

// docs/TASKS.md Task 39b step 2: the switch for the places that are not certain, section 15.11.
describe('the switch for the places that are not certain', () => {
  const file = (places: MapPlace[]): MapBook => ({ book: 'x', region: 'r1', named: places.length, places, inSettlement: [], noPosition: [] })
  const places = [
    place('Hazor', 35.5, 33.0, 9),
    place('Madon', 35.4, 32.8, 2, 'place', false),
    place('Mount Halak', 35.0, 30.5, 1, 'mountain', false),
    place('Geshur', 35.8, 32.8, 3, 'region', false),
    place('Salt Sea', 35.5, 31.5, 4, 'water'),
  ]

  it('takes out a place and a mountain that are not certain, and keeps a region and a water (Task 39d)', () => {
    expect(withoutUncertain(places).map((p) => p.name)).toEqual(['Hazor', 'Geshur', 'Salt Sea'])
    const red = [place('Red Sea', 33, 28, 4, 'water', false), place('Arabia', 40, 25, 1, 'region', false)]
    expect(withoutUncertain(red)).toEqual(red)
    expect(hasUncertain(places)).toBe(true)
    expect(hasUncertain(withoutUncertain(places))).toBe(false)
    // A book with only a water and a region that are not certain has no switch. Rule 4.
    expect(hasUncertain(red)).toBe(false)
  })

  it('takes the places out before the priority rule', () => {
    // A place that is not certain, with more verses, 4 px from a sure place: with the switch on, the sure place has
    // no dot. With the switch off, it has one.
    const view = { width: 400, height: 300, k: 100, c: 1, lon: 35, lat: 31 }
    const measure: Measure = (text) => ({ w: text.length * 6, h: 12, ascent: 10 })
    const near = [place('Kain', 35.0, 31.0, 5, 'place', false), place('Ziph', 35.04, 31.0, 2)]
    const run = (ps: MapPlace[]) => priority({ places: ps, view, radius: 3.5, measure, blocked: [] }).dots.map((d) => ps[d.i].name)
    expect(run(near)).toEqual(['Kain'])
    expect(run(withoutUncertain(near))).toEqual(['Ziph'])
  })

  it('counts only the dots and the triangles in the first view (Task 39d)', () => {
    // Madon, a place, and Mount Halak, a mountain, count. Geshur, a region, does not.
    expect(uncertainInView(places, [true, true, true, true, true])).toBe(2)
    expect(uncertainInView(places, [true, true, false, true, true])).toBe(1)
    expect(uncertainInView(places, [true, false, false, true, true])).toBe(0)
  })

  it('writes the new sentence in its two forms, and no sentence for 0', () => {
    expect(uncertainSentence(194)).toBe('194 of them have a position that is not certain, and the map does not show them.')
    expect(uncertainSentence(1)).toBe('1 of them has a position that is not certain, and the map does not show it.')
    expect(uncertainSentence(0)).toBeNull()
  })

  it('puts the new sentence after the first sentence of the counts, only with the switch off', () => {
    const onMap = [true, true, true, true, false]
    expect(countSentences('Joshua', file(places), onMap, true)).toEqual([
      'Joshua names 5 places. 4 are on this map.',
      '2 of them have a position that is not certain, and the map does not show them.',
      '1 place is outside this map: Salt Sea.',
    ])
    expect(countSentences('Joshua', file(places), onMap, false)).toEqual([
      'Joshua names 5 places. 4 are on this map.',
      '1 place is outside this map: Salt Sea.',
    ])
  })
})

// docs/TASKS.md Task 39b steps 1 and 3: the lines stop at a name, and the double tap, section 15.11.
describe('the lines at a name, and the double tap', () => {
  it('makes the box where the lines stop 2 px wider at the left and at the right', () => {
    expect(nameCut({ x: 100, y: 50, w: 40, h: 15 })).toEqual({ x: 98, y: 50, w: 44, h: 15 })
  })

  it('takes two taps at one point in 300 ms as a double tap', () => {
    const first = { t: 1000, x: 50, y: 50 }
    expect(isDoubleTap(first, { t: 1300, x: 55, y: 48 })).toBe(true)
    expect(isDoubleTap(first, { t: 1301, x: 50, y: 50 })).toBe(false)
    expect(isDoubleTap(first, { t: 1100, x: 80, y: 50 })).toBe(false)
    expect(isDoubleTap(null, { t: 1100, x: 50, y: 50 })).toBe(false)
  })
})
