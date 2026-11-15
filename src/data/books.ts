// Book data and group colors.
// The book list is in public/data/books.json. Chapter counts come from the
// Berean Standard Bible text (see docs/DATA-SOURCES.md).
// Group colors are from docs/DESIGN.md section 7.3. Task 18 removed the colors and the fields of the first build.

export type GroupName =
  | 'Law'
  | 'History'
  | 'Poetry & Wisdom'
  | 'Major Prophets'
  | 'Minor Prophets'
  | 'Gospels'
  | 'History (Acts)'
  | 'Letters of Paul'
  | 'General Letters'
  | 'Prophecy'

export interface Book {
  /** URL id, for the route `#/book/<id>`. */
  id: string
  name: string
  group: GroupName
  chapters: number
}

export interface Group {
  name: GroupName
  /**
   * Group color of the redesign, docs/DESIGN.md section 7.3. The book names and the band
   * of the group use it, on white. The label in a band is white.
   */
  color: string
}

/** The ten groups in Bible order. */
export const GROUPS: readonly Group[] = [
  { name: 'Law', color: '#C2255C' },
  { name: 'History', color: '#B01E35' },
  { name: 'Poetry & Wisdom', color: '#CD4C26' },
  { name: 'Major Prophets', color: '#9D6E00' },
  { name: 'Minor Prophets', color: '#667F19' },
  { name: 'Gospels', color: '#26828B' },
  { name: 'History (Acts)', color: '#6E6A66' },
  { name: 'Letters of Paul', color: '#1B2A41' },
  { name: 'General Letters', color: '#4B2E57' },
  { name: 'Prophecy', color: '#986694' },
]

export function groupOf(book: Book): Group {
  const group = GROUPS.find((g) => g.name === book.group)
  if (!group) throw new Error(`Unknown group "${book.group}" for book "${book.id}"`)
  return group
}

export async function loadBooks(): Promise<Book[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/books.json`)
  if (!res.ok) throw new Error(`books.json: HTTP ${res.status}`)
  return (await res.json()) as Book[]
}
