// docs/TASKS.md Task 38 step 3: the functions of the map page with no browser in them. docs/DESIGN.md section 15.11.

import { describe, expect, it } from 'vitest'
import {
  clampFrameHeight,
  countSentences,
  decode,
  firstView,
  nameList,
  narrowFrameHeight,
  placesThatStay,
  priority,
  project,
  regionRatio,
  riverShows,
  scaleBar,
  viewAtScale,
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
    const z = viewAtScale(v, v.k * 2)
    expect(project(z, v.lon, v.lat)).toEqual(project(v, v.lon, v.lat))
    expect(project(z, v.lon, v.lat + 1)[1]).toBeCloseTo(395 - 2 * v.k, 6)
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

  it('gives bold to the three places with a dot that the book names most', () => {
    const r = run([p('A', 20, 20, 9), p('R', 300, 20, 8, 'region'), p('B', 20, 100, 7), p('C', 20, 180, 6), p('D', 20, 260, 5)])
    expect(r.names.map((n) => n.style)).toEqual(['place-bold', 'region', 'place-bold', 'place-bold', 'place'])
  })
})
