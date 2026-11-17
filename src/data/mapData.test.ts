// The map data of public/data/map/. docs/TASKS.md Task 37 step 7, docs/DESIGN.md section 15.9.
// scripts/build-map.mjs writes the files.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Book } from './books.ts'

const root = join(import.meta.dirname, '..', '..')
const dir = join(root, 'public/data/map')
const read = <T>(path: string) => JSON.parse(readFileSync(join(root, path), 'utf8')) as T
const books = read<Book[]>('public/data/books.json')

type Box = [number, number, number, number]
type MapIndex = { regions: { id: string; name: string; box: Box; dataBox: Box }[]; books: { book: string; region: string }[] }
type MapPlace = { name: string; lon: number; lat: number; verses: number; kind: string; sure: boolean }
type MapBook = { book: string; region: string; named: number; places: MapPlace[]; inSettlement: string[]; noPosition: string[] }
type MapRegion = { region: string; dataBox: Box; unit: number; land: number[][][]; lakes: number[][][]; rivers: { scalerank: number; lines: number[][] }[] }

const index = read<MapIndex>('public/data/map/index.json')
const bookFile = (id: string) => read<MapBook>(`public/data/map/books/${id}.json`)

/** The points of a ring or a line: integers in units of 0.0001 degrees, the first point, then the differences. */
function decode(flat: number[], unit: number): [number, number][] {
  const out: [number, number][] = []
  let x = 0
  let y = 0
  for (let i = 0; i < flat.length; i += 2) {
    x += flat[i]
    y += flat[i + 1]
    out.push([x * unit, y * unit])
  }
  return out
}

describe('the map data', () => {
  it('has five regions and 61 books in the index, each a book of the site', () => {
    expect(index.regions.map((r) => r.id)).toEqual(['r1', 'r2', 'r3', 'r4', 'r5'])
    expect(index.books).toHaveLength(61)
    const ids = new Set(books.map((b) => b.id))
    for (const b of index.books) {
      expect(ids.has(b.book), b.book).toBe(true)
      expect(index.regions.some((r) => r.id === b.region), b.book).toBe(true)
    }
    for (const id of ['philemon', 'james', '1-john', '2-john', '3-john']) {
      expect(ids.has(id), id).toBe(true)
      expect(index.books.some((b) => b.book === id), id).toBe(false)
    }
  })

  it('has a file for each book of the index, with the region of the index, and no other file', () => {
    const files = readdirSync(join(dir, 'books')).sort()
    expect(files).toEqual(index.books.map((b) => `${b.book}.json`).sort())
    for (const b of index.books) {
      const f = bookFile(b.book)
      expect(f.book).toBe(b.book)
      expect(f.region, b.book).toBe(b.region)
    }
  })

  it('has in each book file the sum of the three lists, the four kinds, the order of the verses, and positions in the range', () => {
    const outside: string[] = []
    for (const b of index.books) {
      const f = bookFile(b.book)
      expect(f.named, b.book).toBe(f.places.length + f.inSettlement.length + f.noPosition.length)
      for (const p of f.places) {
        expect(['place', 'region', 'mountain', 'water'], `${b.book} ${p.name}`).toContain(p.kind)
        // The range of step 7: -10 to 70 degrees east, 10 to 50 degrees north.
        if (p.lon < -10 || p.lon > 70 || p.lat < 10 || p.lat > 50) outside.push(`${b.book} ${p.name} ${p.lon},${p.lat}`)
      }
      // The order of step 4: the most verses first. The second key, the order of ancient.jsonl, is not in the file.
      for (let i = 1; i < f.places.length; i++) expect(f.places[i - 1].verses, `${b.book} ${f.places[i].name}`).toBeGreaterThanOrEqual(f.places[i].verses)
    }
    expect(outside).toEqual([])
  })

  it('has the numbers of step 6 for Exodus, Acts, and Proverbs', () => {
    // Columns: named, the places with a position, the places with a score below 500. The places inside a settlement
    // have a position. In these three books, no place inside a settlement has a score below 500.
    const numbers = (id: string) => {
      const f = bookFile(id)
      return [f.named, f.places.length + f.inSettlement.length, f.places.filter((p) => !p.sure).length]
    }
    expect(numbers('exodus')).toEqual([33, 31, 15])
    expect(numbers('acts')).toEqual([107, 107, 4])
    expect(numbers('proverbs')).toEqual([1, 1, 0])
    expect(bookFile('acts').inSettlement).toEqual(['Beautiful Gate', 'Solomon’s Portico'])
  })

  it('has land in each region file, and each coordinate in its data box', () => {
    for (const r of index.regions) {
      const f = read<MapRegion>(`public/data/map/regions/${r.id}.json`)
      expect(f.region).toBe(r.id)
      expect(f.dataBox).toEqual(r.dataBox)
      expect(f.land.length, r.id).toBeGreaterThan(0)
      const [w, e, s, n] = r.dataBox
      // The coordinates are integers of 0.0001 degrees, so the check allows the error of the floating point.
      const eps = 1e-9
      let bad = 0
      const check = (flat: number[]) => {
        for (const [x, y] of decode(flat, f.unit)) if (x < w - eps || x > e + eps || y < s - eps || y > n + eps) bad++
      }
      for (const poly of [...f.land, ...f.lakes]) poly.forEach(check)
      for (const river of f.rivers) river.lines.forEach(check)
      expect(bad, r.id).toBe(0)
    }
  })
})
