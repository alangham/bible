// Builds the map data of the site: public/data/map/. docs/TASKS.md Task 37, docs/DESIGN.md section 15.9.
//
// Usage: node scripts/build-map.mjs <folder>
//
// <folder> has the downloads of docs/DATA-SOURCES.md section 12, outside the repository:
//   bgd/ancient.jsonl and bgd/modern.jsonl: the Bible Geocoding Data of OpenBible.info, commit 7eb18a5.
//   ne/ne_10m_land.geojson, ne/ne_10m_minor_islands.geojson, ne/ne_10m_lakes.geojson, and
//   ne/ne_10m_rivers_lake_centerlines.geojson: Natural Earth, commit ca96624.
//
// The script writes:
//   public/data/map/index.json: the five regions and the region of each book with a place.
//   public/data/map/books/<book id>.json: the places of each book with a region.
//   public/data/map/regions/<region id>.json: the land, the lakes, and the rivers of each region.
// Two runs give the same bytes. No person selects a place, a position, a name, or a kind: the rules of
// section 15.9 do. The one exception is rule 7, a decision of Arthur: the places with the name "East", "North",
// or "South" are left out. The script prints the numbers of step 6 of Task 37, and the entries of rule 7.
//
// The form of a coordinate in a region file: an integer in units of 0.0001 degrees. A ring or a line is one
// flat array: the first point as [lon, lat], then each next point as the difference from the point before it.
// A ring is closed: its last point joins its first point, and the array does not repeat the first point.
// The rounding error of a coordinate is 0.00005 degrees at most.

import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const DIR = process.argv[2]
if (!DIR) throw new Error('usage: node scripts/build-map.mjs <folder>')
const ROOT = join(import.meta.dirname, '..')
const OUT = join(ROOT, 'public', 'data', 'map')

// ---- output of the numbers ----

function section(title) {
  console.log(`\n==== ${title}`)
}
function line(...parts) {
  console.log(parts.join(' '))
}
function count(map, key, n = 1) {
  map.set(key, (map.get(key) ?? 0) + n)
}
function sorted(map) {
  return [...map].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
}

// ---- the downloads ----

// The SHA-256 of each file, from the table "Downloads (Task 36 step 1)" of docs/DATA-SOURCES.md. Task 37 step 1:
// if one differs, the script stops.
const FILES = {
  'bgd/ancient.jsonl': 'b8187aa4737e8517ccc090f765d2be11da4c548cd2a59d3cdcb62e952cb8c0f2',
  'bgd/modern.jsonl': 'da731f6e110bac4ea66a9f037a0a31cfb11c4f1efc1206aa9e109092b2c60087',
  'ne/ne_10m_land.geojson': '1ac90796408bc6ad6911d69448485d3c4dbf2190370080368a09976e1c9f7416',
  'ne/ne_10m_minor_islands.geojson': '8c933ca7a4760256bdc46408355706e39764b0fa01c160c28888b90b4faec29f',
  'ne/ne_10m_lakes.geojson': '2d036f53dedec578001c5c30c2959ee7d4eebc1306900fa4367c49929ec8f2d9',
  'ne/ne_10m_rivers_lake_centerlines.geojson': 'bb854a900ecbd3b408df46d5e16e3e0f974ba55993f9d8b5c26e855273c0905a',
}
section('The downloads: size in bytes, SHA-256')
for (const [f, expected] of Object.entries(FILES)) {
  const p = join(DIR, f)
  const sha = createHash('sha256').update(readFileSync(p)).digest('hex')
  line(f, statSync(p).size, sha, sha === expected ? 'as in the table' : 'DIFFERS FROM THE TABLE')
  if (sha !== expected) throw new Error(`${f}: the SHA-256 differs from the table of docs/DATA-SOURCES.md`)
}
const jsonl = (f) =>
  readFileSync(join(DIR, f), 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l))
const ancient = jsonl('bgd/ancient.jsonl')
const modern = new Map(jsonl('bgd/modern.jsonl').map((m) => [m.id, m]))
const ne = (f) => JSON.parse(readFileSync(join(DIR, 'ne', `${f}.geojson`), 'utf8')).features

// ---- the books of the site ----

const books = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'books.json'), 'utf8'))
if (books.length !== 66) throw new Error('expected 66 books in books.json')
// The verse key "sort" of the data is BBCCCVVV, with BB from 01 (Genesis) to 66 (Revelation), the order of books.json.
const bookOfVerse = (v) => books[Number(v.sort.slice(0, 2)) - 1].id

// ---- the five regions: section 15.9 ----

const REGIONS = [
  { id: 'r1', name: 'The land of Israel', box: [34.0, 36.7, 29.4, 33.7] },
  { id: 'r2', name: 'Egypt, Sinai, and Canaan', box: [29.5, 37.0, 27.5, 34.2] },
  { id: 'r3', name: 'Greece and Asia Minor', box: [20.5, 31.5, 35.0, 42.0] },
  { id: 'r4', name: 'Egypt to Persia', box: [29.0, 49.0, 27.5, 38.5] },
  { id: 'r5', name: 'Rome to Jerusalem', box: [12.0, 38.0, 30.0, 44.0] },
]
const cosMid = ([, , s, n]) => Math.cos((((s + n) / 2) * Math.PI) / 180)
// The area of a region: its width in degrees, times the cosine of its middle latitude, times its height in degrees.
const area = (r) => (r.box[1] - r.box[0]) * cosMid(r.box) * (r.box[3] - r.box[2])
const inBox = ([w, e, s, n], p) => p.lon >= w && p.lon <= e && p.lat >= s && p.lat <= n

// The data box: the smallest box with the same center that holds the first view at each ratio of the frame from
// 0.75 to 2.0, before the margin of 0.2 degrees on each side. Rule 1 of "The coast, the rivers, and the lakes".
const MARGIN = 0.2
function dataBoxBeforeMargin(r) {
  const [w0, e0, s0, n0] = r.box
  const c = cosMid(r.box)
  const w = (e0 - w0) * c
  const h = n0 - s0
  const width = Math.max(w, 2.0 * h) / c
  const height = Math.max(h, w / 0.75)
  const cx = (w0 + e0) / 2
  const cy = (s0 + n0) / 2
  return [cx - width / 2, cx + width / 2, cy - height / 2, cy + height / 2]
}
// The data box with the margin. Its limits are on the grid of 0.0001 degrees, outward, so that each coordinate of a
// region file, after the rounding, stays in the box.
const UNIT = 10000
function dataBox(r) {
  const [w, e, s, n] = dataBoxBeforeMargin(r)
  // The 1e-6 removes the error of the floating point: 33.9 * 10000 is 339000.00000000006, not 339000.
  const down = (x) => Math.floor(x * UNIT + 1e-6) / UNIT
  const up = (x) => Math.ceil(x * UNIT - 1e-6) / UNIT
  return [down(w - MARGIN), up(e + MARGIN), down(s - MARGIN), up(n + MARGIN)]
}

// ---- the places of a book: section 15.9, rules 1 to 6 ----

// Rule 2. The location: the entry of modern_associations with the highest score; with two, the first of them.
// The position: the custom_lonlat of the location if it has one, and its lonlat if not.
function locationOf(a) {
  const entries = Object.entries(a.modern_associations ?? {})
  if (!entries.length) return null
  let top = entries[0]
  for (const e of entries) if (e[1].score > top[1].score) top = e
  const m = modern.get(top[0])
  if (!m) throw new Error(`no modern location ${top[0]} for ${a.id}`)
  const text = m.custom_lonlat ?? m.lonlat
  if (!text) return { m, score: top[1].score, ties: entries.filter((e) => e[1].score === top[1].score).length, lon: null, lat: null }
  const [lon, lat] = text.split(',').map(Number)
  const [ii, ri] = top[1].identification_ids[0]
  const ident = a.identifications[ii]
  return {
    m,
    score: top[1].score,
    ties: entries.filter((e) => e[1].score === top[1].score).length,
    lon,
    lat,
    custom: Boolean(m.custom_lonlat),
    ident,
    res: ident.resolutions?.[ri],
  }
}
const loc = new Map(ancient.map((a) => [a.id, locationOf(a)]))
const hasPosition = (a) => loc.get(a.id)?.lon != null
// Rule 4, the rule of step 7 of the report of Task 36: the resolution of the location has lonlat_type
// "settlement", or its identification has the modifier "<" and the resolution has in = "settlement".
function inSettlement(a) {
  const p = loc.get(a.id)
  if (!p || p.lon == null) return false
  return p.res?.lonlat_type === 'settlement' || (p.ident.modifier === '<' && p.res?.in === 'settlement')
}
// Rule 5. The name: the friendly_id with no number at its end.
const nameOf = (a) => a.friendly_id.replace(/ \d+$/, '')
// Rule 6. The kind.
function kindOf(a) {
  const t = new Set(a.types)
  if (['body of water', 'river', 'spring', 'wadi'].some((x) => t.has(x)) && !t.has('settlement')) return 'water'
  if ((t.has('region') && !t.has('settlement')) || t.has('people group')) return 'region'
  if (['mountain', 'mountain range', 'hill'].some((x) => t.has(x))) return 'mountain'
  return 'place'
}
// Rule 3. A score below 500 is not certain.
const LIMIT = 500

// Rule 7, decided by Arthur on 2026-11-17, docs/TASKS.md Task 38b: a place whose name is "East", "North", or
// "South" is not a place of a book. The name is the one of rule 5. Reason: the name is a direction and not a place.
const DIRECTIONS = new Set(['East', 'North', 'South'])
const isDirection = (a) => DIRECTIONS.has(nameOf(a))

// Rule 1. The places of each book, with the number of verses of the place in that book. Order of ancient.jsonl.
// `leftOut` has the entries of rule 7, with their books, and `namedBefore` the number of places of each book
// before rule 7.
const placesOfBook = new Map(books.map((b) => [b.id, []]))
const leftOut = []
const namedBefore = new Map()
ancient.forEach((a, order) => {
  const n = new Map()
  for (const v of a.verses ?? []) count(n, bookOfVerse(v))
  for (const bookId of n.keys()) count(namedBefore, bookId)
  if (isDirection(a)) {
    leftOut.push({ a, books: [...n.keys()] })
    return
  }
  for (const [bookId, verses] of n) placesOfBook.get(bookId).push({ a, order, verses })
})
// The order of a list: the most verses first, then the order of ancient.jsonl.
const byVerses = (x, y) => y.verses - x.verses || x.order - y.order

// ---- the region of a book ----

const regionOf = new Map()
const regionShare = new Map()
for (const b of books) {
  const ps = placesOfBook.get(b.id).filter((x) => hasPosition(x.a))
  if (!ps.length) continue
  const total = ps.reduce((s, x) => s + x.verses, 0)
  const fits = REGIONS.map((r) => ({ r, n: ps.filter((x) => inBox(r.box, loc.get(x.a.id))).reduce((s, x) => s + x.verses, 0) }))
  const ok = fits.filter((f) => f.n * 10 >= total * 9).sort((x, y) => area(x.r) - area(y.r))
  const pick = ok[0] ?? [...fits].sort((x, y) => y.n - x.n || area(x.r) - area(y.r))[0]
  regionOf.set(b.id, pick.r)
  regionShare.set(b.id, { total, fits, ninety: Boolean(ok[0]) })
}

// ---- the files of the books ----

const bookFiles = new Map()
for (const b of books) {
  const r = regionOf.get(b.id)
  if (!r) continue
  const all = [...placesOfBook.get(b.id)].sort(byVerses)
  const places = all
    .filter((x) => hasPosition(x.a) && !inSettlement(x.a))
    .map((x) => {
      const p = loc.get(x.a.id)
      return { name: nameOf(x.a), lon: Number(p.lon.toFixed(5)), lat: Number(p.lat.toFixed(5)), verses: x.verses, kind: kindOf(x.a), sure: p.score >= LIMIT }
    })
  const settled = all.filter((x) => inSettlement(x.a)).map((x) => nameOf(x.a))
  const noPosition = all.filter((x) => !hasPosition(x.a)).map((x) => nameOf(x.a))
  const named = all.length
  if (named !== places.length + settled.length + noPosition.length) throw new Error(`named is not the sum of the lists for ${b.id}`)
  bookFiles.set(b.id, { book: b.id, region: r.id, named, places, inSettlement: settled, noPosition })
}

// ---- the files of the regions: the coast, the rivers, and the lakes ----

// Polygons: each ring is clipped to the box with the Sutherland-Hodgman method. A ring is an array of [lon, lat].
function clipRing(ring, [w, e, s, n]) {
  const inside = [(p) => p[0] >= w, (p) => p[0] <= e, (p) => p[1] >= s, (p) => p[1] <= n]
  const cut = [
    (a, b) => [w, a[1] + ((b[1] - a[1]) * (w - a[0])) / (b[0] - a[0])],
    (a, b) => [e, a[1] + ((b[1] - a[1]) * (e - a[0])) / (b[0] - a[0])],
    (a, b) => [a[0] + ((b[0] - a[0]) * (s - a[1])) / (b[1] - a[1]), s],
    (a, b) => [a[0] + ((b[0] - a[0]) * (n - a[1])) / (b[1] - a[1]), n],
  ]
  let out = ring
  for (let i = 0; i < 4; i++) {
    const inp = out
    out = []
    for (let j = 0; j < inp.length; j++) {
      const a = inp[j]
      const b = inp[(j + 1) % inp.length]
      const ia = inside[i](a)
      const ib = inside[i](b)
      if (ia && ib) out.push(b)
      else if (ia && !ib) out.push(cut[i](a, b))
      else if (!ia && ib) out.push(cut[i](a, b), b)
    }
    if (!out.length) return []
  }
  return out
}
// Lines: each segment is clipped to the box with the Liang-Barsky method. A line can break into parts.
function clipLine(pts, [w, e, s, n]) {
  const parts = []
  let cur = []
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    const dx = x1 - x0
    const dy = y1 - y0
    let t0 = 0
    let t1 = 1
    let ok = true
    for (const [p, q] of [
      [-dx, x0 - w],
      [dx, e - x0],
      [-dy, y0 - s],
      [dy, n - y0],
    ]) {
      if (p === 0) {
        if (q < 0) ok = false
      } else {
        const t = q / p
        if (p < 0) t0 = Math.max(t0, t)
        else t1 = Math.min(t1, t)
      }
    }
    if (!ok || t0 > t1) {
      if (cur.length > 1) parts.push(cur)
      cur = []
      continue
    }
    const a = [x0 + t0 * dx, y0 + t0 * dy]
    const b = [x0 + t1 * dx, y0 + t1 * dy]
    if (!cur.length) cur.push(a)
    cur.push(b)
    if (t1 < 1) {
      parts.push(cur)
      cur = []
    }
  }
  if (cur.length > 1) parts.push(cur)
  return parts
}
const polygonsOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [])
const linesOf = (g) => (g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : [])
function boxOfPoints(pts) {
  let w = Infinity
  let e = -Infinity
  let s = Infinity
  let n = -Infinity
  for (const [x, y] of pts) {
    if (x < w) w = x
    if (x > e) e = x
    if (y < s) s = y
    if (y > n) n = y
  }
  return [w, e, s, n]
}
const meets = (a, b) => a[1] >= b[0] && a[0] <= b[1] && a[3] >= b[2] && a[2] <= b[3]

// The form of the coordinates: integers in units of 0.0001 degrees, the first point, then the differences.
// Two points in a row that are the same after the rounding become one point.
function encode(pts, closed) {
  const q = []
  for (const [x, y] of pts) {
    const p = [Math.round(x * UNIT), Math.round(y * UNIT)]
    const last = q[q.length - 1]
    if (!last || last[0] !== p[0] || last[1] !== p[1]) q.push(p)
  }
  if (closed && q.length > 1 && q[0][0] === q[q.length - 1][0] && q[0][1] === q[q.length - 1][1]) q.pop()
  if (q.length < (closed ? 3 : 2)) return null
  const out = [q[0][0], q[0][1]]
  for (let i = 1; i < q.length; i++) out.push(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1])
  return out
}
function polygonLayer(features, box) {
  const out = []
  for (const f of features) {
    for (const poly of polygonsOf(f.geometry)) {
      if (!meets(boxOfPoints(poly[0]), box)) continue
      const rings = []
      for (let i = 0; i < poly.length; i++) {
        const ring = poly[i]
        if (i > 0 && !meets(boxOfPoints(ring), box)) continue
        const enc = encode(clipRing(ring, box), true)
        if (enc) rings.push(enc)
        else if (i === 0) break
      }
      // A polygon whose outer ring is outside the box is not in the layer, with its holes.
      if (rings.length && encode(clipRing(poly[0], box), true)) out.push(rings)
    }
  }
  return out
}
function riverLayer(features, box) {
  const out = []
  for (const f of features) {
    const lines = []
    for (const l of linesOf(f.geometry)) {
      if (!meets(boxOfPoints(l), box)) continue
      for (const part of clipLine(l, box)) {
        const enc = encode(part, false)
        if (enc) lines.push(enc)
      }
    }
    if (lines.length) out.push({ scalerank: f.properties.scalerank, lines })
  }
  return out
}
// Rule 2 of "The coast, the rivers, and the lakes".
const land = [...ne('ne_10m_land'), ...ne('ne_10m_minor_islands')]
const lakeFeatures = ne('ne_10m_lakes').filter((f) => f.properties.featurecla !== 'Reservoir')
const riverAll = ne('ne_10m_rivers_lake_centerlines')
const isCanalName = (f) => /Canal|Channel/.test(f.properties.name ?? '')
const riverFeatures = riverAll.filter((f) => f.properties.featurecla === 'River' && !isCanalName(f))

const regionFiles = new Map()
for (const r of REGIONS) {
  const box = dataBox(r)
  regionFiles.set(r.id, { region: r.id, dataBox: box, unit: 1 / UNIT, land: polygonLayer(land, box), lakes: polygonLayer(lakeFeatures, box), rivers: riverLayer(riverFeatures, box) })
}

// ---- write ----

const index = {
  regions: REGIONS.map((r) => ({ id: r.id, name: r.name, box: r.box, dataBox: dataBox(r) })),
  books: books.filter((b) => regionOf.has(b.id)).map((b) => ({ book: b.id, region: regionOf.get(b.id).id })),
}
rmSync(OUT, { recursive: true, force: true })
mkdirSync(join(OUT, 'books'), { recursive: true })
mkdirSync(join(OUT, 'regions'), { recursive: true })
const write = (path, data) => writeFileSync(join(OUT, path), `${JSON.stringify(data)}\n`)
write('index.json', index)
for (const [id, data] of bookFiles) write(join('books', `${id}.json`), data)
for (const [id, data] of regionFiles) write(join('regions', `${id}.json`), data)

// ---- the numbers of step 6 of Task 37 ----

const DESIGNER_REGIONS = {
  r1: 'joshua ruth 1-samuel 2-samuel 1-chronicles nehemiah ecclesiastes song-of-solomon lamentations obadiah matthew mark luke john 2-peter',
  r2: 'exodus leviticus numbers deuteronomy judges 1-kings psalms proverbs joel amos haggai malachi hebrews jude',
  r3: 'ephesians philippians colossians 1-thessalonians 2-thessalonians 1-timothy titus',
  r4: 'genesis 2-kings 2-chronicles ezra esther job isaiah jeremiah ezekiel daniel hosea jonah micah nahum habakkuk zephaniah zechariah galatians',
  r5: 'acts romans 1-corinthians 2-corinthians 2-timothy 1-peter revelation',
}
const nameOfBook = (id) => books.find((b) => b.id === id)?.name ?? `UNKNOWN BOOK ${id}`
section('Step 6. The region of each book')
for (const r of REGIONS) {
  const bs = books.filter((b) => regionOf.get(b.id) === r)
  line(`${r.id}: ${bs.length}: ${bs.map((b) => b.name).join(', ')}`)
}
line(`none: ${books.filter((b) => !regionOf.has(b.id)).length}: ${books.filter((b) => !regionOf.has(b.id)).map((b) => b.name).join(', ')}`)
line('Differences from the table of the designer in section 15.9:')
let differences = 0
for (const [rid, list] of Object.entries(DESIGNER_REGIONS)) {
  for (const id of list.split(' ')) {
    if (!books.some((b) => b.id === id)) throw new Error(`no book ${id} in books.json`)
    const ours = regionOf.get(id)?.id ?? 'none'
    if (ours !== rid) {
      differences++
      line(`  ${nameOfBook(id)}: the designer ${rid}, the script ${ours}`)
    }
  }
}
line('  differences:', differences)
line('The share of the verses of each book in each region. Columns: book | sum of the verses of the places with a position | r1 | r2 | r3 | r4 | r5 | region')
for (const b of books) {
  const sh = regionShare.get(b.id)
  if (!sh) continue
  line(`  ${b.name} | ${sh.total} | ${sh.fits.map((f) => `${f.n} (${((100 * f.n) / sh.total).toFixed(1)}%)`).join(' | ')} | ${regionOf.get(b.id).id}${sh.ninety ? '' : ', no region with 90%'}`)
}

section('Step 6. The books with no region at 90%: the verses in r4')
for (const b of books) {
  const sh = regionShare.get(b.id)
  if (!sh || sh.ninety) continue
  const r4 = sh.fits.find((f) => f.r.id === 'r4')
  line(`${b.name}: ${r4.n} of ${sh.total}, ${((100 * r4.n) / sh.total).toFixed(1)}%; region ${regionOf.get(b.id).id}`)
}

section('Step 6. named, the places with a position, and the places with a score below 500')
for (const id of ['exodus', 'joshua', 'ezekiel', 'matthew', 'acts', 'proverbs']) {
  const ps = placesOfBook.get(id)
  const withPos = ps.filter((x) => hasPosition(x.a))
  const below = withPos.filter((x) => loc.get(x.a.id).score < LIMIT)
  const f = bookFiles.get(id)
  line(`${nameOfBook(id)}: named ${f.named}, with a position ${withPos.length}, below 500 ${below.length}; in the file: places ${f.places.length} (not certain ${f.places.filter((p) => !p.sure).length}), inSettlement ${f.inSettlement.length}, noPosition ${f.noPosition.length}`)
}

section('Step 6. The places inside a settlement, rule 4')
{
  const all = ancient.filter((a) => (a.verses ?? []).length && inSettlement(a))
  line('places with verses inside a settlement, in all books:', all.length)
  line('in Acts:', bookFiles.get('acts').inSettlement.join(', '))
}

section('Step 6. A candidate for the rule of the designer with 54 places inside a settlement')
line('The candidate: rule 4 on each resolution of each identification of the place, not only on the resolution of the location.')
line('It is not known to be the rule of the designer. The files use rule 4.')
{
  const anyRes = (a) =>
    (a.identifications ?? []).some((ident) => (ident.resolutions ?? []).some((res) => res.lonlat_type === 'settlement' || (ident.modifier === '<' && res.in === 'settlement')))
  const ps = ancient.filter((a) => (a.verses ?? []).length && hasPosition(a) && (inSettlement(a) || anyRes(a)))
  const more = ps.filter((a) => !inSettlement(a))
  line('places with verses and a position inside a settlement by the candidate:', ps.length)
  line('places more than rule 4, with their kind:', more.length, more.map((a) => `${a.friendly_id} (${kindOf(a)})`).join(', '))
}

section('Step 6. The places with a custom_lonlat')
{
  const withVerses = ancient.filter((a) => (a.verses ?? []).length)
  const custom = withVerses.filter((a) => loc.get(a.id)?.custom)
  line('places with verses whose location has a custom_lonlat:', custom.length, custom.map((a) => `${a.friendly_id} (${loc.get(a.id).m.friendly_id})`).join(', '))
  line('modern locations with a custom_lonlat:', [...modern.values()].filter((m) => m.custom_lonlat).length)
  for (const a of custom) {
    const p = loc.get(a.id)
    line(`  ${a.friendly_id}: lonlat ${p.m.lonlat}, custom_lonlat ${p.m.custom_lonlat}`)
  }
}

section('Step 6. The places with two or more locations at the highest score')
{
  const withVerses = ancient.filter((a) => (a.verses ?? []).length)
  const ties = withVerses.filter((a) => (loc.get(a.id)?.ties ?? 0) > 1)
  line('places with verses:', ties.length, ties.map((a) => a.friendly_id).join(', '))
  const tiesAll = ancient.filter((a) => (loc.get(a.id)?.ties ?? 0) > 1)
  line('all places:', tiesAll.length)
  const diffPos = ties.filter((a) => {
    const entries = Object.entries(a.modern_associations)
    const top = loc.get(a.id).score
    return new Set(entries.filter((e) => e[1].score === top).map((e) => modern.get(e[0]).custom_lonlat ?? modern.get(e[0]).lonlat)).size > 1
  })
  line('places with verses where these locations have different positions:', diffPos.length, diffPos.map((a) => a.friendly_id).join(', '))
}

section('Step 6. The places of each kind: the places with verses and a position that are not inside a settlement')
{
  const ps = ancient.filter((a) => (a.verses ?? []).length && hasPosition(a) && !inSettlement(a))
  const k = new Map()
  for (const a of ps) count(k, kindOf(a))
  line('places:', ps.length)
  for (const [kind, n] of sorted(k)) line(`  ${kind}: ${n}`)
}

section('Step 6. The data box of each region before the 0.2 degrees, and with them')
for (const r of REGIONS) {
  const [w, e, s, n] = dataBoxBeforeMargin(r)
  const f = (x) => x.toFixed(1)
  line(`${r.id}: ${f(w)} to ${f(e)} E, ${f(s)} to ${f(n)} N; exact ${w.toFixed(4)} to ${e.toFixed(4)} E, ${s.toFixed(4)} to ${n.toFixed(4)} N; with the margin, in the file: ${dataBox(r).join(', ')}`)
}

section('Step 6. The bytes of the files, with and without gzip')
const sizeOf = (path) => {
  const buf = readFileSync(join(OUT, path))
  return { bytes: buf.length, gzip: gzipSync(buf, { level: 9 }).length }
}
for (const r of REGIONS) {
  const s = sizeOf(join('regions', `${r.id}.json`))
  const f = regionFiles.get(r.id)
  const points = (rings) => rings.flat().reduce((t, ring) => t + ring.length / 2, 0)
  line(`regions/${r.id}.json: ${s.bytes} bytes, ${s.gzip} with gzip; land ${f.land.length} polygons ${points(f.land)} points, lakes ${f.lakes.length} polygons ${points(f.lakes)} points, rivers ${f.rivers.length} features ${f.rivers.reduce((t, x) => t + x.lines.reduce((u, l) => u + l.length / 2, 0), 0)} points`)
}
{
  const sizes = [...bookFiles.keys()].map((id) => ({ id, ...sizeOf(join('books', `${id}.json`)) })).sort((a, b) => b.bytes - a.bytes)
  const big = sizes[0]
  const small = sizes[sizes.length - 1]
  line(`the largest book file: books/${big.id}.json, ${big.bytes} bytes, ${big.gzip} with gzip`)
  line(`the smallest book file: books/${small.id}.json, ${small.bytes} bytes, ${small.gzip} with gzip`)
}

section('Step 6. The places of the kind "place" that have a type which is not "settlement"')
{
  const ps = ancient.filter((a) => (a.verses ?? []).length && hasPosition(a) && !inSettlement(a) && kindOf(a) === 'place')
  const byType = new Map()
  for (const a of ps) for (const t of a.types) if (t !== 'settlement') {
    if (!byType.has(t)) byType.set(t, [])
    byType.get(t).push(a.friendly_id)
  }
  line('places of the kind "place":', ps.length, '; with only the type "settlement":', ps.filter((a) => a.types.every((t) => t === 'settlement')).length)
  for (const [t, names] of [...byType].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))) line(`  ${t}: ${names.length}: ${names.slice(0, 3).join(', ')}`)
}

section('Names that are two or more times in the places of one book file')
{
  let n = 0
  for (const f of bookFiles.values()) {
    const c = new Map()
    for (const p of f.places) count(c, p.name)
    const twice = [...c].filter(([, k]) => k > 1)
    n += twice.length
    if (twice.length) line(`  ${f.book}: ${twice.map(([name, k]) => `${name} ${k}`).join(', ')}`)
  }
  line('names, counted one time in each book:', n)
  line('Red Sea in Exodus:', bookFiles.get('exodus').places.filter((p) => p.name === 'Red Sea').map((p) => `${p.lon},${p.lat} ${p.kind}, ${p.verses} verses`).join(' | '))
}

section('The rivers of the class "River" that the rule leaves out by the name')
line([...new Set(riverAll.filter((f) => f.properties.featurecla === 'River' && isCanalName(f)).map((f) => f.properties.name))].join(', '))

section('Rule 7. The entries with the name of a direction that the data leaves out, with their books')
for (const { a, books: ids } of leftOut) line(`  ${a.friendly_id}: ${ids.map(nameOfBook).join(', ') || 'no book'}`)
line('entries:', leftOut.length)
{
  const changed = books.filter((b) => bookFiles.has(b.id) && namedBefore.get(b.id) !== bookFiles.get(b.id).named)
  line('books where named changes:', changed.length)
  for (const b of changed) line(`  ${b.name}: ${namedBefore.get(b.id)} to ${bookFiles.get(b.id).named}`)
  line('books in the index:', bookFiles.size)
}

section('The files of public/data/map/')
{
  const files = ['index.json', ...readdirSync(join(OUT, 'books')).map((f) => `books/${f}`), ...readdirSync(join(OUT, 'regions')).map((f) => `regions/${f}`)]
  const total = files.reduce((t, f) => t + statSync(join(OUT, f)).size, 0)
  const gz = files.reduce((t, f) => t + gzipSync(readFileSync(join(OUT, f)), { level: 9 }).length, 0)
  line(`files: ${files.length}; books: ${bookFiles.size}; regions: ${regionFiles.size}; sum of bytes: ${total}; sum with gzip: ${gz}`)
  const hash = createHash('sha256')
  for (const f of files.sort()) hash.update(f).update(readFileSync(join(OUT, f)))
  line('SHA-256 of all files in order, for the check of two runs:', hash.digest('hex'))
}
