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

/**
 * The name of the CSS custom property of a group color, on the root element: for example --group-poetry-wisdom.
 * docs/TASKS.md Task 44. This file stays the one source of the value: src/main.tsx gives each name its value.
 */
export function groupProperty(group: Group): string {
  return `--group-${group.name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}`
}

/**
 * A group color as a CSS value: its name, not its value. A component uses this, so that one attribute on the root
 * element can change each group color with no new render. The value is for code that computes with a color.
 */
export function groupVar(group: Group): string {
  return `var(${groupProperty(group)})`
}

/**
 * The dark group colors: the second list, from the table of docs/DESIGN.md section 18.11, with the values as written
 * there. docs/TASKS.md Task 45 step 2. Each one has a contrast of 4.5 to 1 or more against the dark page, section 18.5.
 */
export const DARK_GROUP_COLORS: Readonly<Record<GroupName, string>> = {
  Law: '#F26A90',
  History: '#F3585D',
  'Poetry & Wisdom': '#EB7443',
  'Major Prophets': '#CD9C34',
  'Minor Prophets': '#86A645',
  Gospels: '#49A8B3',
  'History (Acts)': '#9C9793',
  'Letters of Paul': '#8DB3EA',
  'General Letters': '#C0A1E4',
  Prophecy: '#BB7DAD',
}

/**
 * The CSS rules that give each group color its name on the root element: the light value, and the dark value for
 * the attribute data-mode="dark" of src/index.css. src/main.tsx adds them before the first render.
 */
export function groupColorsCss(): string {
  const rule = (selector: string, color: (g: Group) => string) =>
    `${selector} {\n${GROUPS.map((g) => `  ${groupProperty(g)}: ${color(g)};`).join('\n')}\n}\n`
  return rule(':root', (g) => g.color) + rule(":root[data-mode='dark']", (g) => DARK_GROUP_COLORS[g.name])
}

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
