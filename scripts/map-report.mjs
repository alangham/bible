// Prints the numbers and the lists of the map report. docs/TASKS.md Task 36, steps 1 and 3 to 9.
//
// Usage: node scripts/map-report.mjs <folder> [<svg folder>]
//
// The folder is a temporary folder outside the repository. The script reads files. It writes files only if you give
// a second folder: then it writes the maps of step 9 as SVG files there, for a check by eye. It expects:
//   <folder>/bgd/ancient.jsonl      Bible Geocoding Data of OpenBible.info, commit 7eb18a5, data/ancient.jsonl
//   <folder>/bgd/modern.jsonl       the same commit, data/modern.jsonl
//   <folder>/bgd/geometry.jsonl     the same commit, data/geometry.jsonl
//   <folder>/ne/ne_10m_land.geojson                       Natural Earth, commit ca96624, geojson/
//   <folder>/ne/ne_10m_minor_islands.geojson
//   <folder>/ne/ne_10m_lakes.geojson
//   <folder>/ne/ne_10m_rivers_lake_centerlines.geojson
// It also reads the three translations of the site in public/data/text*, and public/data/books.json.
//
// The rule of the sketches, section 15.4 of docs/DESIGN.md:
//   - A place of a book is a place of ancient.jsonl with a verse in that book.
//   - Its position is the position (lonlat) of its modern location with the highest score in modern_associations.
//   - A score below 500 gives the open dot.
// The script uses this rule for each count. Where two modern locations have the highest score, the script takes
// the first in the order of the file, and it counts these places in step 3.

import { createHash } from 'node:crypto'
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const DIR = process.argv[2]
if (!DIR) throw new Error('usage: node scripts/map-report.mjs <folder> [<svg folder>]')
const ROOT = join(import.meta.dirname, '..')
const LIMIT = 500

// ---- output ----

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

// ---- files ----

const FILES = [
  'bgd/ancient.jsonl',
  'bgd/modern.jsonl',
  'bgd/geometry.jsonl',
  'ne/ne_10m_land.geojson',
  'ne/ne_10m_minor_islands.geojson',
  'ne/ne_10m_lakes.geojson',
  'ne/ne_10m_rivers_lake_centerlines.geojson',
]
section('Step 1. Files: size in bytes, SHA-256')
for (const f of FILES) {
  const p = join(DIR, f)
  line(f, statSync(p).size, createHash('sha256').update(readFileSync(p)).digest('hex'))
}

const jsonl = (f) =>
  readFileSync(join(DIR, f), 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l))
const ancient = jsonl('bgd/ancient.jsonl')
const modern = new Map(jsonl('bgd/modern.jsonl').map((m) => [m.id, m]))
const geometry = new Map(jsonl('bgd/geometry.jsonl').map((g) => [g.id, g]))

// ---- the books of the site ----

const books = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'books.json'), 'utf8'))
if (books.length !== 66) throw new Error('expected 66 books in books.json')
// The verse key "sort" of the data is BBCCCVVV, with BB from 01 (Genesis) to 66 (Revelation), the order of books.json.
function verseOf(v) {
  const bb = Number(v.sort.slice(0, 2))
  return { book: books[bb - 1].id, c: Number(v.sort.slice(2, 5)), v: Number(v.sort.slice(5, 8)) }
}

// ---- the position of a place, by the rule of the sketches ----

function nameOf(a) {
  return a.friendly_id
}
// The name without the number that the data adds to tell places with one name apart: "Aroer 2" -> "Aroer".
function plainName(a) {
  return a.friendly_id.replace(/ \d+$/, '')
}
function best(a) {
  const entries = Object.entries(a.modern_associations ?? {})
  if (!entries.length) return null
  let top = entries[0]
  for (const e of entries) if (e[1].score > top[1].score) top = e
  const ties = entries.filter((e) => e[1].score === top[1].score)
  const m = modern.get(top[0])
  if (!m) throw new Error(`no modern location ${top[0]} for ${a.id}`)
  const [lon, lat] = m.lonlat.split(',').map(Number)
  const [ii, ri] = top[1].identification_ids[0]
  const ident = a.identifications[ii]
  const res = ident.resolutions?.[ri]
  return {
    id: top[0],
    score: top[1].score,
    lon,
    lat,
    lonlat: m.lonlat,
    modern: m,
    ident,
    res,
    ties: ties.length,
    tiePositions: new Set(ties.map((e) => modern.get(e[0]).lonlat)).size,
  }
}
const pos = new Map(ancient.map((a) => [a.id, best(a)]))

// ---- step 1: the parts of the places data from OpenStreetMap ----

const withVerses = ancient.filter((a) => (a.verses ?? []).length > 0)
section('Step 1. The parts of the places data from OpenStreetMap')
{
  const mods = [...modern.values()]
  line('modern locations with geometry_credit "osm":', mods.filter((m) => m.geometry_credit === 'osm').length, 'of', mods.length)
  line('ancient places with geometry_credit "osm":', ancient.filter((a) => a.geometry_credit === 'osm').length, 'of', ancient.length)
  line('modern locations with precise_geometry_id:', mods.filter((m) => m.precise_geometry_id).length, 'with local_geometry_id:', mods.filter((m) => m.local_geometry_id).length)
  line('modern locations with coordinates_source.type "osm":', mods.filter((m) => m.coordinates_source?.type === 'osm').length)
  const osmSec = mods.filter((m) => (m.secondary_sources ?? []).some((s) => s.type === 'osm' || s.type === 'osm_group'))
  line('modern locations with a secondary source of type "osm" or "osm_group":', osmSec.length)
  const geoOsm = [...geometry.values()].filter((g) => g.format === 'osm')
  line('geometry.jsonl entries with format "osm":', geoOsm.length, 'of', geometry.size)
  // The one position of each place of the sketches: where does its coordinate come from?
  const used = withVerses.map((a) => pos.get(a.id)).filter(Boolean)
  const src = new Map()
  for (const p of used) count(src, p.modern.coordinates_source?.type ?? 'none')
  line('positions of the sketch rule (places with verses), by coordinates_source.type of the modern location:', used.length)
  line(' ', sorted(src).map(([k, n]) => `${k} ${n}`).join(', '))
  const osmPos = withVerses.filter((a) => pos.get(a.id)?.modern.coordinates_source?.type === 'osm')
  line('places whose position has coordinates_source.type "osm":', osmPos.length, osmPos.map((a) => `${nameOf(a)} (${pos.get(a.id).modern.friendly_id})`).join(', '))
  const osmKind = new Map()
  for (const a of osmPos) count(osmKind, (pos.get(a.id).modern.coordinates_source.url ?? 'no url').replace(/^https:\/\/www\.openstreetmap\.org\/(\w+)\/.*$/, '$1'))
  line('  the OpenStreetMap object of their coordinates, from the url:', sorted(osmKind).map(([k, n]) => `${k} ${n}`).join(', '))
  line('  the points of these places:', new Set(osmPos.map((a) => pos.get(a.id).lonlat)).size)
  const osmAll = new Map()
  for (const m of mods.filter((x) => x.coordinates_source?.type === 'osm')) count(osmAll, (m.coordinates_source.url ?? 'no url').replace(/^https:\/\/www\.openstreetmap\.org\/(\w+)\/.*$/, '$1'))
  line('  all modern locations with coordinates_source.type "osm", the OpenStreetMap object from the url:', sorted(osmAll).map(([k, n]) => `${k} ${n}`).join(', '))
  const custom = withVerses.filter((a) => pos.get(a.id)?.modern.custom_lonlat)
  line('places whose position has a custom_lonlat:', custom.length, 'at points:', new Set(custom.map((a) => pos.get(a.id).lonlat)).size, custom.map((a) => `${nameOf(a)} (${pos.get(a.id).modern.friendly_id}, ${pos.get(a.id).modern.coordinates_source?.type})`).join(', '))
  const google = withVerses.filter((a) => /^google/.test(pos.get(a.id)?.modern.coordinates_source?.type ?? ''))
  line('places whose position has a coordinates_source.type that starts with "google":', google.length, google.map((a) => `${nameOf(a)} (${pos.get(a.id).modern.coordinates_source.type})`).join(', '))
}

// ---- step 3 ----

section('Step 3. Places')
line('ancient places:', ancient.length)
line('ancient places with verses:', withVerses.length)
line('ancient places with a modern location in modern_associations:', [...pos.values()].filter(Boolean).length)
line('modern locations:', modern.size)
const nTypes = new Map()
for (const a of ancient) count(nTypes, a.types.length)
line('places by the number of types:', sorted(nTypes).map(([k, n]) => `${k} type(s): ${n}`).join(', '))
section('Step 3. Places by type. A place with two types is in two rows. Columns: all places, places with verses')
const byType = new Map()
const byTypeV = new Map()
for (const a of ancient) for (const t of a.types) count(byType, t)
for (const a of withVerses) for (const t of a.types) count(byTypeV, t)
for (const [t, n] of sorted(byType)) line(`${t}: ${n}, ${byTypeV.get(t) ?? 0}`)
section('Step 3. Places with one type only, by type. Columns: all places, places with verses')
const oneType = new Map()
const oneTypeV = new Map()
for (const a of ancient) if (a.types.length === 1) count(oneType, a.types[0])
for (const a of withVerses) if (a.types.length === 1) count(oneTypeV, a.types[0])
for (const [t, n] of sorted(oneType)) line(`${t}: ${n}, ${oneTypeV.get(t) ?? 0}`)

section('Step 3. The highest score of each place with a modern location')
{
  const scores = [...pos.values()].filter(Boolean).map((p) => p.score)
  const hist = new Map()
  for (const s of scores) count(hist, s < 0 ? 'below 0' : s >= 1000 ? '1000 or more' : `${Math.floor(s / 100) * 100} to ${Math.floor(s / 100) * 100 + 99}`)
  const order = (k) => (k === 'below 0' ? -1 : k === '1000 or more' ? 1000 : Number(k.split(' ')[0]))
  for (const [k, n] of [...hist].sort((a, b) => order(a[0]) - order(b[0]))) line(`${k}: ${n}`)
  line('lowest:', Math.min(...scores), 'highest:', Math.max(...scores))
  line(`below ${LIMIT}:`, scores.filter((s) => s < LIMIT).length, `of`, scores.length)
  line('more than 1000:', [...pos].filter(([, p]) => p && p.score > 1000).map(([id, p]) => `${nameOf(ancient.find((a) => a.id === id))} ${p.score}`).join(', '))
  const tied = [...pos].filter(([, p]) => p && p.ties > 1)
  line('places where two or more modern locations have the highest score:', tied.length)
  line('  of these, with different positions:', tied.filter(([, p]) => p.tiePositions > 1).length)
  // The score of a modern association, from the readme: score.time_total of the identification, multiplied by the
  // best_time_score of the resolution divided by 1000, if the resolution has one. Check this on the data.
  let same = 0
  let diff = 0
  let maxDiff = 0
  let diffNegative = 0
  const diffs = []
  for (const a of ancient) {
    for (const [mid, assoc] of Object.entries(a.modern_associations ?? {})) {
      // An association can have more than one pair [identification, resolution]. The check takes the highest value.
      const values = assoc.identification_ids.map(([ii, ri]) => {
        const ident = a.identifications[ii]
        const res = ident.resolutions[ri]
        const tt = ident.score?.time_total
        return res.best_time_score === undefined ? tt : Math.round((tt * res.best_time_score) / 1000)
      })
      const expected = values.includes(assoc.score) ? assoc.score : Math.max(...values)
      if (expected === assoc.score) same++
      else {
        diff++
        maxDiff = Math.max(maxDiff, Math.abs(expected - assoc.score))
        if (expected < 0) diffNegative++
        if (diffs.length < 5) diffs.push(`${a.friendly_id}/${mid}: data ${assoc.score}, formula ${expected}`)
      }
    }
  }
  line('modern associations where score = time_total x best_time_score / 1000 (rounded), or = time_total:', same, 'other:', diff, 'largest difference:', maxDiff)
  line('  of the other: with a negative value', diffNegative)
  if (diffs.length) line('  examples of other:', diffs.join('; '))
}
section('Step 3. time_total and the two arrays of an identification')
line('The readme says that time_total is the last value of time_values. The check, on each identification with the two arrays:')
{
  const k = new Map()
  for (const a of ancient)
    for (const ident of a.identifications ?? []) {
      const sc = ident.score
      if (!sc?.time_values?.length || !sc?.time_best_fits?.length) continue
      const isFit = sc.time_total === sc.time_best_fits.at(-1)
      const isVal = sc.time_total === sc.time_values.at(-1)
      count(k, isFit && isVal ? 'equal to both last values' : isFit ? 'equal to the last value of time_best_fits only' : isVal ? 'equal to the last value of time_values only' : 'equal to neither')
    }
  line('identifications with the two arrays:', [...k.values()].reduce((x, y) => x + y, 0))
  for (const [key, n] of sorted(k)) line(`  ${key}: ${n}`)
  for (const name of ['Rameses', 'Ham 2']) {
    const a = ancient.find((x) => x.friendly_id === name)
    const sc = a.identifications.map((i) => i.score).find((x) => x?.time_total === pos.get(a.id).ident.score.time_total)
    line(`  ${name}: time_total ${sc.time_total}; time_values ${JSON.stringify(sc.time_values)}; time_best_fits ${JSON.stringify(sc.time_best_fits)}`)
  }
}

section('Step 3. How a place of each type has its position. The modern location with the highest score')
{
  // For the types of the task: region, river, body of water. Also mountain range and natural area.
  for (const t of ['region', 'river', 'body of water', 'mountain range', 'natural area', 'wadi', 'valley']) {
    const places = withVerses.filter((a) => a.types.length === 1 && a.types[0] === t)
    const geo = new Map()
    const lt = new Map()
    const gid = new Map()
    for (const a of places) {
      const p = pos.get(a.id)
      if (!p) {
        count(geo, 'no position')
        continue
      }
      count(geo, p.modern.geometry)
      count(lt, p.res?.lonlat_type ?? 'none')
      const hasArea = Boolean(p.res?.geometry_id || p.res?.precise_geometry_id || p.modern.geometry_id || p.modern.precise_geometry_id)
      count(gid, hasArea ? 'has a geometry file' : 'no geometry file')
    }
    line(`${t}, one type only, with verses: ${places.length}`)
    line('  modern location geometry:', sorted(geo).map(([k, n]) => `${k} ${n}`).join(', '))
    line('  lonlat_type of the resolution:', sorted(lt).map(([k, n]) => `${k} ${n}`).join(', '))
    line('  line or area geometry:', sorted(gid).map(([k, n]) => `${k} ${n}`).join(', '))
  }
  const fmt = new Map()
  for (const g of geometry.values()) count(fmt, `${g.geometry}${g.isobands_geojson_file ? ' with isobands' : ''}`)
  line('geometry.jsonl, by geometry:', sorted(fmt).map(([k, n]) => `${k} ${n}`).join(', '))
  for (const name of ['Judea', 'Jordan River', 'Great Sea', 'Salt Sea', 'Sea of Galilee', 'Galilee', 'Egypt', 'Euphrates River']) {
    const a = ancient.find((x) => x.friendly_id === name)
    if (!a) {
      line(`example ${name}: no place with this friendly_id`)
      continue
    }
    const p = pos.get(a.id)
    line(
      `example ${name}: types ${a.types.join('|')}; modern ${p.modern.friendly_id} (${p.id}), geometry ${p.modern.geometry}, lonlat ${p.lonlat}, lonlat_type ${p.res?.lonlat_type}, score ${p.score}`,
    )
  }
}

// ---- the text of the site ----

const TRANSLATIONS = [
  ['bsb', 'text'],
  ['kjv', 'text-kjv'],
  ['web', 'text-web'],
]
// Map "book.c.v" -> the plain words of the verse. Headings and notes are not words of a verse.
const texts = {}
for (const [tr, dir] of TRANSLATIONS) {
  const m = new Map()
  for (const b of books) {
    const j = JSON.parse(readFileSync(join(ROOT, 'public', 'data', dir, `${b.id}.json`), 'utf8'))
    for (const ch of j.chapters) {
      let v = 0
      for (const block of ch.blocks) {
        if (block.k !== 'p') continue
        for (const x of block.c) {
          if (typeof x === 'string') m.set(`${b.id}.${ch.n}.${v}`, (m.get(`${b.id}.${ch.n}.${v}`) ?? '') + x)
          else if ('v' in x) {
            v = x.v
            if (!m.has(`${b.id}.${ch.n}.${v}`)) m.set(`${b.id}.${ch.n}.${v}`, '')
          } else if (typeof x.j === 'string') m.set(`${b.id}.${ch.n}.${v}`, (m.get(`${b.id}.${ch.n}.${v}`) ?? '') + x.j)
          else if (typeof x.a === 'string') m.set(`${b.id}.${ch.n}.${v}`, (m.get(`${b.id}.${ch.n}.${v}`) ?? '') + x.a)
        }
      }
    }
  }
  texts[tr] = m
}

// ---- step 4 ----

section('Step 4. Verses')
{
  let entries = 0
  const missing = { bsb: [], kjv: [], web: [] }
  const alt = []
  const forms = new Map()
  for (const a of withVerses) {
    for (const v of a.verses) {
      entries++
      count(forms, /^[1-3]?[A-Z][a-z]+\.\d+\.\d+$/.test(v.osis) ? 'Book.C.V' : v.osis)
      const r = verseOf(v)
      const key = `${r.book}.${r.c}.${r.v}`
      for (const tr of ['bsb', 'kjv', 'web']) if (!texts[tr].has(key)) missing[tr].push(`${v.osis} (${a.friendly_id})`)
      if (v.alternate_verses) alt.push(`${v.osis} ${a.friendly_id}: ${Object.entries(v.alternate_verses).map(([k, x]) => `${k} ${x}`).join(', ')}`)
    }
  }
  line('verse entries (a place in a verse):', entries)
  line('forms of the osis key:', sorted(forms).map(([k, n]) => `${k} ${n}`).join(', '))
  for (const tr of ['bsb', 'kjv', 'web']) line(`verse entries with no such verse in the ${tr} of the site: ${missing[tr].length}`, missing[tr].join('; '))
  line(`verse entries with alternate_verses: ${alt.length}`)
  for (const x of alt) line('  ', x)
}

// The names of a place in a verse of a translation of the site: each key of translation_name_counts that is in the
// words of the verse, as a whole word, with the same capital letters. The letters "ae" in a key also match "æ" in the
// verse. A name that is part of a longer name that is also in the verse is not counted. If no key is in the verse, a
// second search does not compare capital letters. A name is printed as the verse has it. A "*" marks a name that is
// not the same as the key: "æ" for "ae", or other capital letters.
const escapeRe = (k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
function namesIn(a, text) {
  const keys = Object.keys(a.translation_name_counts ?? {})
  const re = (k, flags) => new RegExp(`(?<![A-Za-z-])${escapeRe(k).replace(/ae/g, '(?:ae|æ)').replace(/Ae/g, '(?:Ae|Æ)')}(?![a-z-])`, flags)
  const longest = (found) => found.filter((k) => !found.some((o) => o !== k && o.toLowerCase().includes(k.toLowerCase())))
  for (const flags of ['', 'i']) {
    const found = longest(keys.filter((k) => re(k, flags).test(text)))
    if (found.length) return found.map((k) => {
      const m = text.match(re(k, flags))[0]
      return m === k ? m : `${m}*`
    })
  }
  return []
}
const TR = ['bsb', 'kjv', 'web']
function textOf(tr, v) {
  const r = verseOf(v)
  return texts[tr].get(`${r.book}.${r.c}.${r.v}`) ?? ''
}

section('Step 4. Verse division: the last verse of each chapter in the three translations of the site')
{
  const last = {}
  for (const tr of TR) {
    last[tr] = new Map()
    for (const key of texts[tr].keys()) {
      const [b, c, v] = key.split('.')
      const k = `${b}.${c}`
      if (Number(v) > (last[tr].get(k) ?? 0)) last[tr].set(k, Number(v))
    }
  }
  const verseCount = (tr) => [...texts[tr].keys()].filter((k) => !k.endsWith('.0')).length
  line('verses with a number:', TR.map((tr) => `${tr} ${verseCount(tr)}`).join(', '))
  let n = 0
  for (const k of last.bsb.keys()) {
    const vs = TR.map((tr) => last[tr].get(k))
    if (new Set(vs).size > 1) {
      n++
      line(`  ${k}: ${TR.map((tr, i) => `${tr} ${vs[i]}`).join(', ')}`)
    }
  }
  line('chapters where the last verse differs:', n)
  // The places of the data in the verses that one translation of the site has and another does not.
  const odd = new Set()
  for (const tr of TR) for (const o of TR) if (o !== tr) for (const k of texts[tr].keys()) if (!k.endsWith('.0') && !texts[o].has(k)) odd.add(k)
  const inOdd = []
  for (const a of withVerses) for (const v of a.verses) {
    const r = verseOf(v)
    if (odd.has(`${r.book}.${r.c}.${r.v}`)) inOdd.push(`${v.osis} ${a.friendly_id}`)
  }
  line('verse entries of the data in a verse that one translation of the site has and another does not:', inOdd.length, inOdd.join('; '))
  // Verse numbers that one translation has and another does not.
  for (const tr of TR) {
    for (const o of TR) {
      if (o === tr) continue
      const miss = [...texts[tr].keys()].filter((k) => !k.endsWith('.0') && !texts[o].has(k))
      if (miss.length) line(`  in ${tr}, not in ${o}: ${miss.length}: ${miss.join(', ')}`)
    }
  }
}

section('Step 4. The six verse entries with alternate_verses: where the three translations of the site have the name')
for (const a of withVerses) {
  for (const v of a.verses) {
    if (!v.alternate_verses) continue
    const r = verseOf(v)
    const alts = [...new Set(Object.values(v.alternate_verses))]
    const cells = TR.map((tr) => {
      const here = namesIn(a, textOf(tr, v))
      const there = alts.map((x) => {
        const [, c, vv] = x.split('.')
        return `${c}:${vv} ${namesIn(a, texts[tr].get(`${r.book}.${c}.${vv}`) ?? '').join(', ') || '-'}`
      })
      return `${tr}: ${r.c}:${r.v} ${here.join(', ') || '-'}; ${there.join('; ')}`
    })
    line(`${v.osis} ${a.friendly_id} | ${cells.join(' | ')}`)
  }
}

section('Step 4. The verse of a place: the name is in the next or the previous verse in one translation')
line('A row: a place in a verse of the data, where a translation of the site has no name of the place in that verse,')
line('another translation of the site has a name in that verse, and the first translation has a name in the verse')
line('before or after it. This is a sign of a different verse division, or of a different order of words.')
{
  const byBook = new Map()
  for (const a of withVerses) {
    for (const v of a.verses) {
      const r = verseOf(v)
      const has = Object.fromEntries(TR.map((tr) => [tr, namesIn(a, textOf(tr, v)).length > 0]))
      for (const tr of TR) {
        if (has[tr] || !TR.some((o) => has[o])) continue
        const near = [r.v - 1, r.v + 1].filter((x) => namesIn(a, texts[tr].get(`${r.book}.${r.c}.${x}`) ?? '').length > 0)
        if (!near.length) continue
        if (!byBook.has(r.book)) byBook.set(r.book, [])
        byBook.get(r.book).push(`${v.osis} ${a.friendly_id}: ${tr} has it in ${near.map((x) => `${r.c}:${x}`).join(' and ')}`)
      }
    }
  }
  for (const b of books) for (const x of byBook.get(b.id) ?? []) line(`  ${b.name}: ${x}`)
  line('rows:', [...byBook.values()].reduce((s, x) => s + x.length, 0), 'books:', byBook.size)
}

section('Step 4. Names in Exodus and in Acts')
line('Columns: place (friendly_id) | the name in the data | the names in the verses of the book in BSB | KJV | WEB.')
line('The name in the data is the friendly_id with no number. A row is printed where a translation has a different name,')
line('or where a translation has no name of translation_name_counts in a verse of the place.')
const noNameRows = []
for (const bookId of ['exodus', 'acts']) {
  line(`-- ${bookId}`)
  const places = withVerses.filter((a) => a.verses.some((v) => verseOf(v).book === bookId))
  let printed = 0
  for (const a of places) {
    const verses = a.verses.filter((v) => verseOf(v).book === bookId)
    const found = { bsb: new Map(), kjv: new Map(), web: new Map() }
    const none = { bsb: [], kjv: [], web: [] }
    for (const v of verses) {
      const r = verseOf(v)
      const ns = Object.fromEntries(TR.map((tr) => [tr, namesIn(a, textOf(tr, v))]))
      for (const tr of TR) {
        if (!ns[tr].length) {
          none[tr].push(`${r.c}:${r.v}`)
          const other = TR.filter((o) => ns[o].length)
          if (other.length) noNameRows.push(`${v.osis} ${a.friendly_id}, ${tr}: ${other.map((o) => `${o} has ${ns[o].join(', ')}`).join('; ')}. ${tr}: "${textOf(tr, v)}"`)
        }
        for (const n of ns[tr]) count(found[tr], n)
      }
    }
    const data = plainName(a)
    const differs = TR.some((tr) => none[tr].length || [...found[tr].keys()].some((n) => n !== data))
    if (!differs) continue
    printed++
    const cell = (tr) =>
      [...found[tr]].map(([n, c]) => `${n} ${c}`).join(', ') + (none[tr].length ? `; no name in ${none[tr].join(' ')}` : '')
    line(`${a.friendly_id} | ${data} | ${cell('bsb')} | ${cell('kjv')} | ${cell('web')}`)
  }
  line(`places of ${bookId}: ${places.length}, rows printed: ${printed}`)
}
section('Step 4. Exodus and Acts: the verses where one translation has no name of the data and another has one')
for (const x of noNameRows) line(' ', x)
line('rows:', noNameRows.length)

// ---- step 5 ----

const placesOfBook = new Map(books.map((b) => [b.id, []]))
for (const a of withVerses) {
  const seen = new Set()
  for (const v of a.verses) {
    const id = verseOf(v).book
    if (!seen.has(id)) {
      seen.add(id)
      placesOfBook.get(id).push(a)
    }
  }
}
// The number of verses of the book that name the place, for the three places that the book names most.
function versesInBook(a, bookId) {
  return a.verses.filter((v) => verseOf(v).book === bookId).length
}
function box(places) {
  const ps = places.map((a) => pos.get(a.id)).filter(Boolean)
  if (!ps.length) return null
  return {
    w: Math.min(...ps.map((p) => p.lon)),
    e: Math.max(...ps.map((p) => p.lon)),
    s: Math.min(...ps.map((p) => p.lat)),
    n: Math.max(...ps.map((p) => p.lat)),
  }
}
const f2 = (x) => x.toFixed(2)
const boxText = (b) => (b ? `${f2(b.w)} to ${f2(b.e)} E, ${f2(b.s)} to ${f2(b.n)} N` : '-')
section('Step 5. The 66 books')
line('Columns: book | places | with a position | score below 500 | box: longitude west to east, latitude south to north')
for (const b of books) {
  const ps = placesOfBook.get(b.id)
  const withPos = ps.filter((a) => pos.get(a.id))
  const low = withPos.filter((a) => pos.get(a.id).score < LIMIT)
  line(`${b.name} | ${ps.length}${ps.length ? '' : ' NO PLACE'} | ${withPos.length} | ${low.length} | ${boxText(box(withPos))}`)
}
section('Step 5. Places with no position, in the books that name them')
for (const b of books) {
  const no = placesOfBook.get(b.id).filter((a) => !pos.get(a.id))
  if (no.length) line(`${b.name}: ${no.map(nameOf).join(', ')}`)
}
section('Step 5. The places of Exodus and of Acts')
for (const bookId of ['exodus', 'acts']) {
  const ps = placesOfBook.get(bookId)
  line(
    `${bookId}:`,
    ps
      .map((a) => {
        const p = pos.get(a.id)
        return `${nameOf(a)} [${a.types.join('|')}] ${p ? `${p.score} ${p.lonlat}` : 'no position'}`
      })
      .join('; '),
  )
}
section('Step 5. The three places that each book names most, by the number of verses of the book')
for (const b of books) {
  const ps = placesOfBook.get(b.id)
  if (!ps.length) continue
  const top = ps
    .map((a) => [a, versesInBook(a, b.id)])
    .sort((x, y) => y[1] - x[1])
    .slice(0, 3)
  line(`${b.name}: ${top.map(([a, n]) => `${nameOf(a)} ${n}`).join(', ')}`)
}

// ---- step 6 ----

// The proposal of regions. Each box: longitude west, east; latitude south, north. The boxes are from the boxes of
// step 5, rounded, and the text of the report gives the reason for each one.
const REGIONS = [
  { id: 'R1', name: 'The land of Israel', w: 34.0, e: 36.7, s: 29.4, n: 33.7 },
  { id: 'R2', name: 'Egypt, Sinai, and Canaan', w: 29.5, e: 37.0, s: 27.5, n: 34.2 },
  { id: 'R3', name: 'The Aegean: Greece and Asia', w: 20.5, e: 31.5, s: 35.0, n: 42.0 },
  { id: 'R4', name: 'The Near East: Egypt to Persia', w: 29.0, e: 49.0, s: 27.5, n: 38.5 },
  { id: 'R5', name: 'The Mediterranean: Rome to Jerusalem', w: 12.0, e: 38.0, s: 30.0, n: 44.0 },
  { id: 'R6', name: 'The whole world of the Bible', w: -10.0, e: 70.0, s: 12.0, n: 46.0 },
]
const area = (r) => (r.e - r.w) * (r.n - r.s)
const inside = (r, p) => p.lon >= r.w && p.lon <= r.e && p.lat >= r.s && p.lat <= r.n
// The rule: each book opens the smallest region, by area in degrees, that holds at least 90% of the places of the
// book with a position. If no region holds 90%, the region that holds the most.
const regionOf = new Map()
section('Step 6. Regions')
for (const r of REGIONS) line(`${r.id} ${r.name}: ${r.w} to ${r.e} E, ${r.s} to ${r.n} N; area ${area(r).toFixed(1)} square degrees`)
section('Step 6. The region of each book. Columns: book | region | places with a position | outside | share inside | outside places')
for (const b of books) {
  const ps = placesOfBook.get(b.id).filter((a) => pos.get(a.id))
  if (!ps.length) {
    line(`${b.name} | none | 0`)
    continue
  }
  const fits = REGIONS.map((r) => ({ r, n: ps.filter((a) => inside(r, pos.get(a.id))).length }))
  const ok = fits.filter((f) => f.n * 10 >= ps.length * 9).sort((x, y) => area(x.r) - area(y.r))
  const pick = ok[0] ?? [...fits].sort((x, y) => y.n - x.n || area(x.r) - area(y.r))[0]
  regionOf.set(b.id, pick.r)
  const out = ps.filter((a) => !inside(pick.r, pos.get(a.id)))
  line(
    `${b.name} | ${pick.r.id} | ${ps.length} | ${out.length} | ${((100 * pick.n) / ps.length).toFixed(1)}% | ${out.map((a) => `${nameOf(a)} (${pos.get(a.id).lon.toFixed(2)}, ${pos.get(a.id).lat.toFixed(2)})`).join(', ')}${ok[0] ? '' : ' | NO REGION HOLDS 90%'}`,
  )
}
section('Step 6. Books of each region')
for (const r of REGIONS) {
  const bs = books.filter((b) => regionOf.get(b.id) === r)
  line(`${r.id} ${r.name}: ${bs.length}: ${bs.map((b) => b.name).join(', ')}`)
}
section('Step 6. Revelation: its places with a position, inside and outside R3')
{
  const r3 = REGIONS.find((r) => r.id === 'R3')
  const ps = placesOfBook.get('revelation').filter((a) => pos.get(a.id))
  const inR3 = ps.filter((a) => inside(r3, pos.get(a.id)))
  line(`places with a position: ${ps.length}; inside R3: ${inR3.length}: ${inR3.map(nameOf).join(', ')}`)
  const r5 = REGIONS.find((r) => r.id === 'R5')
  line(`outside R3: ${ps.length - inR3.length}: ${ps.filter((a) => !inside(r3, pos.get(a.id))).map((a) => `${nameOf(a)} at ${pos.get(a.id).modern.friendly_id} (${pos.get(a.id).lonlat}, score ${pos.get(a.id).score}${inside(r5, pos.get(a.id)) ? '' : ', outside R5'})`).join(', ')}`)
}
section('Step 6. The share of the region that the box of the places inside it fills, for each book')
line('Columns: book | region | box of the places inside the region, as a share of the width and of the height of the region')
for (const b of books) {
  const r = regionOf.get(b.id)
  if (!r) continue
  const ps = placesOfBook.get(b.id).filter((a) => pos.get(a.id) && inside(r, pos.get(a.id)))
  const bx = box(ps)
  line(`${b.name} | ${r.id} | width ${(100 * (bx.e - bx.w) / (r.e - r.w)).toFixed(0)}%, height ${(100 * (bx.n - bx.s) / (r.n - r.s)).toFixed(0)}%`)
}

// ---- step 7 ----

section('Step 7. Places in a settlement: the data puts the position of the place in a settlement')
line('The rule: the resolution of the highest score has lonlat_type "settlement", or its identification has the')
line('modifier "<" and the resolution has in = "settlement". Places with verses.')
{
  const inSettlement = withVerses.filter((a) => {
    const p = pos.get(a.id)
    if (!p) return false
    return p.res?.lonlat_type === 'settlement' || (p.ident.modifier === '<' && p.res?.in === 'settlement')
  })
  line('places:', inSettlement.length)
  const byT = new Map()
  for (const a of inSettlement) for (const t of a.types) count(byT, t)
  for (const [t, n] of sorted(byT)) {
    const ex = inSettlement.filter((a) => a.types.includes(t))
    line(`  ${t}: ${n}: ${ex.map((a) => `${nameOf(a)} in ${pos.get(a.id).modern.friendly_id}`).join(', ')}`)
  }
  const settle = new Map()
  for (const a of inSettlement) count(settle, pos.get(a.id).modern.friendly_id)
  line('the settlements:', sorted(settle).map(([k, n]) => `${k} ${n}`).join(', '))
  for (const bookId of ['exodus', 'acts']) {
    line(`  in ${bookId}:`, inSettlement.filter((a) => placesOfBook.get(bookId).includes(a)).map(nameOf).join(', ') || 'none')
  }
}
section('Step 7. The types that the sketches leave out, with the places of each, with verses')
for (const t of ['room', 'gate', 'structure', 'field', 'hill', 'hall', 'pool', 'district in settlement', 'altar', 'garden', 'tree', 'road', 'well', 'rock', 'stone heap', 'fortification']) {
  const ps = withVerses.filter((a) => a.types.includes(t))
  const only = ps.filter((a) => a.types.every((x) => x === t || x === 'special'))
  line(`${t}: ${ps.length}, of these with no type other than "${t}" or "special": ${only.length}: ${only.map(nameOf).join(', ')}`)
}

// ---- step 8 ----

section('Step 8. Places at the same position')
{
  const at = new Map()
  for (const a of withVerses) {
    const p = pos.get(a.id)
    if (!p) continue
    if (!at.has(p.lonlat)) at.set(p.lonlat, [])
    at.get(p.lonlat).push(a)
  }
  const shared = [...at.values()].filter((x) => x.length > 1)
  line('positions:', at.size, 'positions with two or more places:', shared.length)
  line('places that have the same position as a different place:', shared.reduce((s, x) => s + x.length, 0))
  // The ten positions with the most places, and each position with the same number of places as the tenth.
  const bySize = [...at].sort((x, y) => y[1].length - x[1].length || x[0].localeCompare(y[0]))
  const tenth = bySize[9][1].length
  const top = bySize.filter(([, ps], i) => i < 10 || ps.length === tenth)
  line('positions with the most places: the first ten, and the positions with the same number as the tenth,', tenth)
  line(`  positions with more than ${tenth} places: ${bySize.filter(([, ps]) => ps.length > tenth).length}; with ${tenth}: ${bySize.filter(([, ps]) => ps.length === tenth).length}`)
  const typeCount = new Map()
  for (const a of bySize[0][1]) for (const t of a.types) count(typeCount, t)
  line(`  the types of the places at the first position: ${sorted(typeCount).map(([t, n]) => `${t} ${n}`).join(', ')}`)
  for (const [ll, ps] of top) line(`  ${ll} (${pos.get(ps[0].id).modern.friendly_id}): ${ps.length}: ${ps.map((a) => `${nameOf(a)} [${a.types.join('|')}]`).join(', ')}`)
  // Pairs of a region and a settlement at one position, as Judea and Jerusalem.
  const mixed = shared.filter((ps) => ps.some((a) => a.types.includes('region')) && ps.some((a) => a.types.includes('settlement') && !a.types.includes('region')))
  line('positions with a region and a settlement:', mixed.length)
  for (const ps of mixed.slice(0, 15)) line(`  ${pos.get(ps[0].id).modern.friendly_id}: ${ps.map(nameOf).join(', ')}`)
}

// ---- step 9 ----

const ne = (f) => JSON.parse(readFileSync(join(DIR, 'ne', `${f}.geojson`), 'utf8')).features
const land = [...ne('ne_10m_land'), ...ne('ne_10m_minor_islands')]
const lakes = ne('ne_10m_lakes')
const rivers = ne('ne_10m_rivers_lake_centerlines')

// Polygons: each ring is clipped to the box with the Sutherland-Hodgman method. A ring is an array of [lon, lat].
function clipRing(ring, r) {
  const edges = [
    (p) => p[0] >= r.w,
    (p) => p[0] <= r.e,
    (p) => p[1] >= r.s,
    (p) => p[1] <= r.n,
  ]
  const cut = [
    (a, b) => [r.w, a[1] + ((b[1] - a[1]) * (r.w - a[0])) / (b[0] - a[0])],
    (a, b) => [r.e, a[1] + ((b[1] - a[1]) * (r.e - a[0])) / (b[0] - a[0])],
    (a, b) => [a[0] + ((b[0] - a[0]) * (r.s - a[1])) / (b[1] - a[1]), r.s],
    (a, b) => [a[0] + ((b[0] - a[0]) * (r.n - a[1])) / (b[1] - a[1]), r.n],
  ]
  let out = ring
  for (let i = 0; i < 4; i++) {
    const inp = out
    out = []
    for (let j = 0; j < inp.length; j++) {
      const a = inp[j]
      const b = inp[(j + 1) % inp.length]
      const ia = edges[i](a)
      const ib = edges[i](b)
      if (ia && ib) out.push(b)
      else if (ia && !ib) out.push(cut[i](a, b))
      else if (!ia && ib) out.push(cut[i](a, b), b)
    }
    if (!out.length) return []
  }
  return out
}
// Lines: each segment is clipped to the box with the Liang-Barsky method. A line can break into parts.
function clipLine(pts, r) {
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
      [-dx, x0 - r.w],
      [dx, r.e - x0],
      [-dy, y0 - r.s],
      [dy, r.n - y0],
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
function ringBox(ring) {
  let w = Infinity
  let e = -Infinity
  let s = Infinity
  let n = -Infinity
  for (const [x, y] of ring) {
    if (x < w) w = x
    if (x > e) e = x
    if (y < s) s = y
    if (y > n) n = y
  }
  return { w, e, s, n }
}
const meets = (b, r) => b.e >= r.w && b.w <= r.e && b.n >= r.s && b.s <= r.n
// The projection to 960 px wide: x = (lon - west) * k * cos(middle latitude), y = (north - lat) * k.
function projector(r) {
  const c = Math.cos((((r.s + r.n) / 2) * Math.PI) / 180)
  const k = 960 / ((r.e - r.w) * c)
  return { height: (r.n - r.s) * k, f: ([lon, lat]) => [(lon - r.w) * k * c, (r.n - lat) * k] }
}
// Douglas-Peucker in pixels.
function simplify(pts, tol) {
  if (pts.length < 3) return pts
  const keep = new Uint8Array(pts.length)
  keep[0] = 1
  keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [i, j] = stack.pop()
    const [ax, ay] = pts[i]
    const [bx, by] = pts[j]
    const dx = bx - ax
    const dy = by - ay
    const len = Math.hypot(dx, dy)
    let max = -1
    let at = -1
    for (let k = i + 1; k < j; k++) {
      const [px, py] = pts[k]
      const d = len === 0 ? Math.hypot(px - ax, py - ay) : Math.abs(dy * px - dx * py + bx * ay - by * ax) / len
      if (d > max) {
        max = d
        at = k
      }
    }
    if (max > tol) {
      keep[at] = 1
      stack.push([i, at], [at, j])
    }
  }
  return pts.filter((_, k) => keep[k])
}
const ringArea = (pts) => {
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[(i + 1) % pts.length]
    a += x0 * y1 - x1 * y0
  }
  return Math.abs(a / 2)
}
const n1 = (x) => String(Math.round(x * 10) / 10)
// SVG path data: absolute coordinates with one decimal place.
function pathData(items, closed) {
  return items.map((pts) => `M${pts.map(([x, y]) => `${n1(x)} ${n1(y)}`).join('L')}${closed ? 'Z' : ''}`).join('')
}
const TOL = 0.5
const MIN_AREA = 0.25
function layer(features, r, kind, proj, filter = () => true) {
  const full = []
  const simple = []
  let featureCount = 0
  for (const f of features) {
    if (!filter(f)) continue
    let used = false
    if (kind === 'polygon') {
      for (const poly of polygonsOf(f.geometry)) {
        for (const ring of poly) {
          if (!meets(ringBox(ring), r)) continue
          const c = clipRing(ring, r)
          if (c.length < 3) continue
          used = true
          const px = c.map(proj.f)
          full.push(px)
          const closed = [...px, px[0]]
          const s = simplify(closed, TOL).slice(0, -1)
          if (s.length >= 3 && ringArea(s) >= MIN_AREA) simple.push(s)
        }
      }
    } else {
      for (const l of linesOf(f.geometry)) {
        if (!meets(ringBox(l), r)) continue
        for (const part of clipLine(l, r)) {
          used = true
          const px = part.map(proj.f)
          full.push(px)
          const s = simplify(px, TOL)
          if (s.length >= 2) simple.push(s)
        }
      }
    }
    if (used) featureCount++
  }
  const closed = kind === 'polygon'
  const a = pathData(full, closed)
  const b = pathData(simple, closed)
  return {
    features: featureCount,
    points: full.reduce((s, x) => s + x.length, 0),
    pointsSimple: simple.reduce((s, x) => s + x.length, 0),
    bytes: Buffer.byteLength(a),
    gzip: gzipSync(a).length,
    bytesSimple: Buffer.byteLength(b),
    gzipSimple: gzipSync(b).length,
    full: a,
    simple: b,
  }
}
const isCanal = (f) => /canal|channel/i.test(`${f.properties.name ?? ''} ${f.properties.name_en ?? ''}`)
const isRiver = (f) => f.properties.featurecla === 'River' && !isCanal(f)
const isLake = (f) => f.properties.featurecla !== 'Reservoir'
const svgOut = process.argv[3]
section('Step 9. Natural Earth for each region, as SVG path data, 960 px wide')
line(`Columns: layer | features | points | bytes | gzip bytes || after the simplification: points | bytes | gzip bytes`)
line(`The simplification: Douglas-Peucker with a tolerance of ${TOL} px, and no ring with an area below ${MIN_AREA} square px.`)
line('Land: ne_10m_land and ne_10m_minor_islands. Lakes: ne_10m_lakes with no Reservoir. Rivers: featurecla "River" of')
line('ne_10m_rivers_lake_centerlines, with no name that has the word "canal" or "channel". No "Lake Centerline".')
for (const r of REGIONS) {
  const proj = projector(r)
  const layers = {
    land: layer(land, r, 'polygon', proj),
    lakes: layer(lakes, r, 'polygon', proj, isLake),
    rivers: layer(rivers, r, 'line', proj, isRiver),
  }
  line(`-- ${r.id} ${r.name}: 960 x ${Math.round(proj.height)} px`)
  let t = [0, 0, 0, 0]
  for (const [k, v] of Object.entries(layers)) {
    line(`  ${k} | ${v.features} | ${v.points} | ${v.bytes} | ${v.gzip} || ${v.pointsSimple} | ${v.bytesSimple} | ${v.gzipSimple}`)
    t = [t[0] + v.bytes, t[1] + v.gzip, t[2] + v.bytesSimple, t[3] + v.gzipSimple]
  }
  const all = (key) => Object.values(layers).map((v) => v[key]).join('')
  line(`  sum of the three layers: bytes ${t[0]}, gzip ${t[1]}; after the simplification: bytes ${t[2]}, gzip ${t[3]}`)
  line(`  the three layers in one text: gzip ${gzipSync(all('full')).length}; after the simplification: gzip ${gzipSync(all('simple')).length}`)
  if (svgOut) {
    const h = Math.round(proj.height)
    const svg = (key) =>
      `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="${h}" viewBox="0 0 960 ${h}"><rect width="960" height="${h}" fill="#fff"/>` +
      `<path d="${layers.land[key]}" fill="#efe9dc" stroke="#555" stroke-width="0.6" fill-rule="evenodd"/>` +
      `<path d="${layers.lakes[key]}" fill="#fff" stroke="#555" stroke-width="0.6"/>` +
      `<path d="${layers.rivers[key]}" fill="none" stroke="#555" stroke-width="0.6"/></svg>`
    writeFileSync(join(svgOut, `${r.id}-full.svg`), svg('full'))
    writeFileSync(join(svgOut, `${r.id}-simple.svg`), svg('simple'))
  }
}
section('Step 9. Canals and reservoirs in each region')
line('Canals: the features of ne_10m_rivers_lake_centerlines with the word "canal" or "channel" in the name.')
line('Reservoirs: the features of ne_10m_lakes with featurecla "Reservoir".')
for (const r of REGIONS) {
  const inR = (f) => {
    const geoms = f.geometry.type.endsWith('Polygon') ? polygonsOf(f.geometry).flat() : linesOf(f.geometry)
    return geoms.some((g) => meets(ringBox(g), r) && (f.geometry.type.endsWith('Polygon') ? clipRing(g, r).length >= 3 : clipLine(g, r).length > 0))
  }
  const canals = rivers.filter((f) => isCanal(f) && inR(f))
  const res = lakes.filter((f) => f.properties.featurecla === 'Reservoir' && inR(f))
  const uniq = (fs) => [...new Set(fs.map((f) => `${f.properties.name ?? 'no name'}${f.properties.name_en && f.properties.name_en !== f.properties.name ? ` (${f.properties.name_en})` : ''}`))]
  line(`${r.id}: canals ${uniq(canals).length}: ${uniq(canals).join(', ') || 'none'}`)
  line(`${r.id}: reservoirs ${uniq(res).length}: ${uniq(res).join(', ') || 'none'}`)
}
section('Step 9. The notes of Natural Earth on the reservoirs of R4, and the names of the river lines of R4 that the script takes')
{
  const r4 = REGIONS.find((x) => x.id === 'R4')
  const meetsR = (f, r) =>
    f.geometry.type.endsWith('Polygon')
      ? polygonsOf(f.geometry).flat().some((g) => meets(ringBox(g), r) && clipRing(g, r).length >= 3)
      : linesOf(f.geometry).some((g) => meets(ringBox(g), r) && clipLine(g, r).length > 0)
  for (const f of lakes.filter((x) => x.properties.featurecla === 'Reservoir' && meetsR(x, r4))) {
    line(`  reservoir ${f.properties.name ?? 'no name'}: note "${f.properties.note ?? ''}"`)
  }
  const names = [...new Set(rivers.filter((f) => isRiver(f) && meetsR(f, r4)).map((f) => f.properties.name ?? 'no name'))].sort()
  line(`  river lines of R4, names: ${names.length}: ${names.join(', ')}`)
}
section('Step 9. Lakes of Natural Earth in R2, with name, featurecla, and box')
{
  const r = REGIONS.find((x) => x.id === 'R2')
  for (const f of lakes) {
    const rings = polygonsOf(f.geometry).flat()
    if (!rings.some((g) => meets(ringBox(g), r) && clipRing(g, r).length >= 3)) continue
    const b = ringBox(rings.flat())
    line(`  ${f.properties.name ?? 'no name'} | ${f.properties.featurecla} | ${polygonsOf(f.geometry).length} polygon(s) | ${boxText(b)}`)
  }
}

section('Step 9. The water of today and the outlines of the places data')
{
  const geoBox = (file) => {
    const j = JSON.parse(readFileSync(join(DIR, 'bgd', 'geometry', file), 'utf8'))
    const feats = j.type === 'FeatureCollection' ? j.features : [j]
    const types = feats.map((f) => f.geometry.type)
    const polys = feats.flatMap((f) => polygonsOf(f.geometry))
    const pts = feats.flatMap((f) => [...polygonsOf(f.geometry).flat(2), ...linesOf(f.geometry).flat()])
    return `${feats.length} feature(s), GeoJSON type ${types.join(', ')}, ${polys.length} polygon(s), box ${boxText(ringBox(pts))}`
  }
  const dead = lakes.filter((f) => f.properties.name === 'Dead Sea')
  for (const f of dead) {
    line(`Natural Earth "Dead Sea": featurecla ${f.properties.featurecla}, ${polygonsOf(f.geometry).length} polygon(s), box ${boxText(ringBox(polygonsOf(f.geometry).flat(2)))}`)
  }
  if (dead.length === 2) {
    const [a, b] = dead.map((f) => ringBox(polygonsOf(f.geometry).flat(2))).sort((x, y) => x.s - y.s)
    line(`  latitude between the two boxes: ${(b.s - a.n).toFixed(2)} degrees`)
  }
  const salt = geometry.get('g2e7540')
  line(`geometry.jsonl g2e7540: name ${salt.name}, geometry ${salt.geometry}, source ${salt.source}, land_or_water ${salt.land_or_water}`)
  line(`  ${salt.geojson_file}: ${geoBox(salt.geojson_file)}`)
  const saltUsers = [...modern.values()].filter((m) => m.geometry_id === 'g2e7540' || m.precise_geometry_id === 'g2e7540')
  line(`  modern locations with this geometry: ${saltUsers.map((m) => `${m.friendly_id} (${m.id})`).join(', ') || 'none'}`)
  const saltSea = ancient.find((a) => a.friendly_id === 'Salt Sea')
  line(`  Salt Sea: position ${pos.get(saltSea.id).modern.friendly_id} (${pos.get(saltSea.id).id}), score ${pos.get(saltSea.id).score}`)
  const huleh = [...modern.values()].find((m) => m.friendly_id === 'Lake Huleh')
  line(`modern ${huleh.friendly_id} (${huleh.id}): lonlat ${huleh.lonlat}, land_or_water ${huleh.land_or_water}, precision "${huleh.precision?.description}"`)
  line(`  geometry_id ${huleh.geometry_id}, precise_geometry_id ${huleh.precise_geometry_id}, geometry_credit ${huleh.geometry_credit}`)
  const hg = geometry.get(huleh.geometry_id)
  line(`  geometry.jsonl ${hg.id}: geometry ${hg.geometry}, source ${hg.source}; ${hg.geojson_file}: ${geoBox(hg.geojson_file)}`)
  for (const src of huleh.secondary_sources ?? []) if (src.type === 'osm') line(`  secondary source osm: ${src.url}`)
  for (const [id, x] of Object.entries(huleh.ancient_associations ?? {})) line(`  ancient association ${x.name} (${id}): score ${x.score}`)
  const merom = ancient.find((a) => a.friendly_id === 'Waters of Merom')
  const mp = pos.get(merom.id)
  line(`Waters of Merom: position ${mp ? `${mp.modern.friendly_id}, score ${mp.score}` : 'none'}`)
  const pih = ancient.find((a) => a.friendly_id === 'Pi-hahiroth')
  for (const [mid, x] of Object.entries(pih.modern_associations ?? {})) {
    const m = modern.get(mid)
    line(`Pi-hahiroth: location ${m.friendly_id} (${mid}), class ${m.class}, score ${x.score}`)
  }
  line(`  Pi-hahiroth: position ${pos.get(pih.id).modern.friendly_id}, score ${pos.get(pih.id).score}`)
  line('Natural Earth files of this report, featurecla values:')
  for (const [name, fs] of [['land', land], ['lakes', lakes], ['rivers', rivers]]) line(`  ${name}: ${[...new Set(fs.map((f) => f.properties.featurecla))].sort().join(', ')}`)
  const near = lakes.filter((f) => polygonsOf(f.geometry).flat().some((g) => meets(ringBox(g), { w: 35.5, e: 35.7, s: 33.0, n: 33.15 })))
  line(`Natural Earth lakes with a ring that meets the box 35.5 to 35.7 E, 33.0 to 33.15 N: ${near.length}`)
}

if (svgOut) {
  section('Step 9. The pixels of each region drawn with and without the simplification, in Chromium at 960 px wide')
  line('Columns: region | pixels | pixels that differ by more than 32 of 255 | share | by more than 64 of 255')
  const { createRequire } = await import('node:module')
  const { chromium } = createRequire(join(ROOT, 'package.json'))('@playwright/test')
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 960, height: 2000 }, deviceScaleFactor: 1 })
  await page.setContent('<html><body style="margin:0"></body></html>')
  for (const r of REGIONS) {
    const pair = ['full', 'simple'].map((k) => readFileSync(join(svgOut, `${r.id}-${k}.svg`), 'utf8'))
    const res = await page.evaluate(async ([a, b]) => {
      const load = (text) =>
        new Promise((ok, no) => {
          const img = new Image()
          img.onload = () => ok(img)
          img.onerror = no
          img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text)
        })
      const [ia, ib] = await Promise.all([load(a), load(b)])
      const draw = (img) => {
        const c = document.createElement('canvas')
        c.width = ia.width
        c.height = ia.height
        const x = c.getContext('2d')
        x.drawImage(img, 0, 0)
        return x.getImageData(0, 0, c.width, c.height).data
      }
      const da = draw(ia)
      const db = draw(ib)
      let over32 = 0
      let over64 = 0
      for (let i = 0; i < da.length; i += 4) {
        const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]))
        if (d > 32) over32++
        if (d > 64) over64++
      }
      return { total: ia.width * ia.height, over32, over64 }
    }, pair)
    line(`${r.id} | ${res.total} | ${res.over32} | ${((100 * res.over32) / res.total).toFixed(3)}% | ${res.over64}`)
  }
  await browser.close()
}

section('Step 9. A search of the comments and the claims of the places data for words about water that changed')
line('The fields: each string of "comment", and each string inside "precision_claims" and "accuracy_claims", of ancient.jsonl and modern.jsonl.')
{
  const WORDS = ['coast', 'shoreline', 'silt', 'drained', 'dried', 'evaporated', 'receded', 'marsh', 'lagoon', 'no longer']
  const texts = []
  const walk = (o, inClaim, rec) => {
    if (Array.isArray(o)) for (const x of o) walk(x, inClaim, rec)
    else if (o && typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) {
        if (typeof v === 'string' && (k === 'comment' || inClaim)) texts.push([rec, v])
        else walk(v, inClaim || k === 'precision_claims' || k === 'accuracy_claims', rec)
      }
    } else if (typeof o === 'string' && inClaim) texts.push([rec, o])
  }
  for (const a of ancient) walk(a, false, a)
  for (const m of modern.values()) walk(m, false, m)
  line('strings searched:', texts.length)
  for (const w of WORDS) {
    const re = new RegExp(`\\b${w}`, 'i')
    const hits = texts.filter(([, t]) => re.test(t))
    line(`"${w}": ${hits.length}`)
    for (const [rec, t] of hits) line(`  ${rec.friendly_id}: ${t.replace(/\s+/g, ' ').slice(0, 200)}`)
  }
}

section('Step 3 to 9. Facts that the report names, by record')
{
  for (const name of ['Judea 1', 'Judea 2', 'Dalmatia', 'India', 'Rameses', 'Holy Place 1', 'Holy Place 2', 'Most Holy Place 2']) {
    const a = ancient.find((x) => x.friendly_id === name)
    const p = pos.get(a.id)
    const vs = (a.verses ?? []).map((v) => v.readable ?? v.osis ?? v.sort).slice(0, 8)
    line(`${name} [${a.types.join('|')}]: position ${p ? `${p.modern.friendly_id} ${p.lonlat}, score ${p.score}, lonlat_type ${p.res?.lonlat_type}` : 'none'}; books: ${[...new Set((a.verses ?? []).map((v) => verseOf(v).book))].join(', ')}; first verses: ${vs.join(', ')}`)
  }
  for (const name of ['Lake Huleh', 'marsh west of the Bitter Lakes']) {
    const m = [...modern.values()].find((x) => x.friendly_id === name)
    line(`modern ${name}: types ${JSON.stringify(m.types ?? m.type)}; class ${m.class}`)
  }
}
