// Book data and group colors.
// The book list is in public/data/books.json. Chapter counts come from the
// Berean Standard Bible text (see docs/DATA-SOURCES.md).
// Group colors are from docs/DESIGN.md section 2.

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
  /** Stack number on the table, 1 to 5. */
  stack: number
  /** Position in the stack. 1 is the top spine. */
  position: number
}

export interface Group {
  name: GroupName
  /** Cloth color of the spine. */
  cloth: string
  /** Text color on the cloth. */
  text: string
}

/** The ten groups in Bible order. */
export const GROUPS: readonly Group[] = [
  { name: 'Law', cloth: '#A3214F', text: '#F7ECD3' },
  { name: 'History', cloth: '#7E1F26', text: '#F7ECD3' },
  { name: 'Poetry & Wisdom', cloth: '#A44A22', text: '#F7ECD3' },
  { name: 'Major Prophets', cloth: '#C89A2B', text: '#2A1E0A' },
  { name: 'Minor Prophets', cloth: '#566829', text: '#F7ECD3' },
  { name: 'Gospels', cloth: '#FBF6EA', text: '#2A1E0A' },
  { name: 'History (Acts)', cloth: '#5C6063', text: '#F7ECD3' },
  { name: 'Letters of Paul', cloth: '#1F3350', text: '#F7ECD3' },
  { name: 'General Letters', cloth: '#4B2E63', text: '#F7ECD3' },
  { name: 'Prophecy', cloth: '#8A5579', text: '#F7ECD3' },
]

export function groupOf(book: Book): Group {
  const group = GROUPS.find((g) => g.name === book.group)
  if (!group) throw new Error(`Unknown group "${book.group}" for book "${book.id}"`)
  return group
}

/** The least thickness of a spine, in mockup px. POLISH.md items 3 and 13: each spine of the wide table is 24 px or more on screen at 1440 by 900 px. */
export const MIN_SPINE_THICKNESS = 40

/** Spine thickness in mockup px: the mockup rule of docs/DESIGN.md section 4.1, and 40 px at least. */
export function spineThickness(chapters: number): number {
  return Math.max(MIN_SPINE_THICKNESS, 26 + 3.2 * Math.sqrt(chapters))
}

export async function loadBooks(): Promise<Book[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/books.json`)
  if (!res.ok) throw new Error(`books.json: HTTP ${res.status}`)
  return (await res.json()) as Book[]
}
