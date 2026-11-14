// Links between passages, and the read-with lists. docs/DESIGN.md section 4.5.
// scripts/build-links.mjs makes one file for each book in public/data/links/: the links that have an end
// in the book, and the read-with list of each chapter of the book.

export type LinkSource = 'Bible Quotation Database' | 'OpenBible.info' | 'Berean Standard Bible'

/** One end of a link. `heading` is set when the mark is on the section heading. */
export interface Passage {
  book: string
  c: number
  v: number
  c2?: number
  v2?: number
  heading?: string
}

export interface Link {
  id: string
  type: 'quotation' | 'echo'
  source: LinkSource
  /** For a quotation link: a is the quoting passage, b the quoted passage. */
  a: Passage
  b: Passage
  upstream?: string[]
  votes?: number
  /** One line that says why the linked passage matters here. Quotation links only. */
  reason?: string
}

export interface ChapterRef {
  book: string
  c: number
}

export interface BookLinks {
  id: string
  links: Link[]
  /** Chapter number -> the read-with list. */
  readWith: Record<string, ChapterRef[]>
}

/** A link as one end sees it: the passage here and the passage at the other end. */
export interface LinkEnd {
  link: Link
  here: Passage
  there: Passage
}

const cache = new Map<string, Promise<BookLinks>>()

export function loadBookLinks(id: string): Promise<BookLinks> {
  let p = cache.get(id)
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}data/links/${id}.json`).then((res) => {
      if (!res.ok) throw new Error(`links ${id}.json: HTTP ${res.status}`)
      return res.json() as Promise<BookLinks>
    })
    p.catch(() => cache.delete(id))
    cache.set(id, p)
  }
  return p
}

/** The key of a mark on a section heading: the heading text and the first verse after it. */
export function headingKey(text: string, verse: number): string {
  return `${verse}|${text}`
}

/** The marks of one chapter: the link ends on each verse, and on each section heading. Quotation links first. */
export function marksOf(data: BookLinks, book: string, chapter: number) {
  const verses = new Map<number, LinkEnd[]>()
  const headings = new Map<string, LinkEnd[]>()
  const add = (map: Map<number, LinkEnd[]> | Map<string, LinkEnd[]>, key: number | string, end: LinkEnd) => {
    const m = map as Map<number | string, LinkEnd[]>
    if (!m.has(key)) m.set(key, [])
    m.get(key)!.push(end)
  }
  for (const link of data.links) {
    for (const [here, there] of [
      [link.a, link.b],
      [link.b, link.a],
    ] as const) {
      if (here.book !== book || here.c !== chapter) continue
      // A link between two verses of the same chapter shows once at each verse.
      const end = { link, here, there }
      if (here.heading) add(headings, headingKey(here.heading, here.v), end)
      else add(verses, here.v, end)
    }
  }
  const order = (x: LinkEnd, y: LinkEnd) => (x.link.type === y.link.type ? 0 : x.link.type === 'quotation' ? -1 : 1)
  for (const list of verses.values()) list.sort(order)
  for (const list of headings.values()) list.sort(order)
  return { verses, headings }
}
