// The last-read chapter of each book, in the storage of the browser. docs/DESIGN.md section 7.5,
// docs/TASKS.md Task 13 step 12. If the storage is not available, the site keeps the chapters in
// memory for this page, and a book opens at chapter 1 after a reload.

const KEY = 'bible-last-read'

let memory: Record<string, number> | null = null

function read(): Record<string, number> {
  if (memory) return memory
  try {
    const raw = localStorage.getItem(KEY)
    const data: unknown = raw ? JSON.parse(raw) : {}
    memory = data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, number>) : {}
  } catch {
    memory = {}
  }
  return memory
}

/** The last-read chapter of a book, or null if the reader did not read the book. */
export function lastRead(bookId: string, chapters: number): number | null {
  const n = read()[bookId]
  return Number.isInteger(n) && n >= 1 && n <= chapters ? n : null
}

/** Records the chapter in view as the last-read chapter of its book. */
export function setLastRead(bookId: string, chapter: number) {
  const data = read()
  if (data[bookId] === chapter) return
  data[bookId] = chapter
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // The chapter stays in memory for this page.
  }
}

/** For the tests: forget the copy in memory, so that the next read uses the storage again. */
export function resetLastReadMemory() {
  memory = null
}
