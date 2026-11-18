// The map data of Task 37, docs/DESIGN.md section 15.9. The map page loads the files only when it opens:
// index.json, the file of the book, and the file of its region. docs/TASKS.md Task 38 step 2. "About this book" loads
// index.json for the line "Where", Task 40.

import type { MapBook, MapIndex, MapRegionFile } from './mapLayout.ts'

const cache = new Map<string, Promise<unknown>>()

function load<T>(path: string): Promise<T> {
  let p = cache.get(path)
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}data/map/${path}`).then((res) => {
      if (!res.ok) throw new Error(`${path}: ${res.status}`)
      return res.json()
    })
    // A load that failed is tried again the next time the page opens.
    p.catch(() => cache.delete(path))
    cache.set(path, p)
  }
  return p as Promise<T>
}

export interface BookMap {
  index: MapIndex
  /** Null for a book with no place: it is not in index.json. */
  file: MapBook | null
  region: MapRegionFile | null
}

/** The index of the map data: the regions, and the region of each book with places. */
export function loadMapIndex(): Promise<MapIndex> {
  return load<MapIndex>('index.json')
}

/** The data of the map of one book. */
export async function loadBookMap(bookId: string): Promise<BookMap> {
  const index = await loadMapIndex()
  const entry = index.books.find((b) => b.book === bookId)
  if (!entry) return { index, file: null, region: null }
  const [file, region] = await Promise.all([load<MapBook>(`books/${bookId}.json`), load<MapRegionFile>(`regions/${entry.region}.json`)])
  return { index, file, region }
}
