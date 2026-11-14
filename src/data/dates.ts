// The dates of the timeline. docs/DESIGN.md section 4.6, docs/TASKS.md Task 8.
// public/data/dates.json comes from the Written fact of each book in public/data/intros.json.
// The timeline uses the traditional view only. Years BC are negative numbers.

export type DateKind = 'year' | 'range' | 'unknown'

/** A dated event in the Written fact that limits the range. docs/DESIGN.md section 4.6, Task 9b. */
export interface DateLimit {
  year: number
  /** The words of the Written fact that name the event and its year. */
  words: string
}

export interface BookDate {
  /** Book id, the same as in books.json. */
  id: string
  kind: DateKind
  /** The first year. Null for the kind "unknown". */
  from: number | null
  /** The last year. The same as `from` for the kind "year". */
  to: number | null
  /** The words of the Written fact that give the date. */
  words: string
  /** The last dated event that the fact names. The range starts no earlier than its year. */
  after?: DateLimit
  /** A dated event that the writing came before. The range ends no later than its year. */
  before?: DateLimit
  /** Why the date is not clear from the fact. Such a book is on the "Not verified" list. */
  notVerified?: string
}

/** One pair of books with quotation links. `from` quotes `to`. */
export interface QuotationPair {
  from: string
  to: string
  n: number
}

/**
 * A year as a point on a line with no year 0: 1 BC is 0, 2 BC is -1, AD 1 is 1.
 * The axes and the count of years between the bands use this, so that the count is right across 1 BC and AD 1.
 */
export function lineYear(year: number): number {
  return year < 0 ? year + 1 : year
}

/** The point where the spine stands: the year, or the middle of the range. Null for an unknown date. */
export function standPoint(d: BookDate): number | null {
  if (d.from === null || d.to === null) return null
  return (lineYear(d.from) + lineYear(d.to)) / 2
}

function yearText(y: number): string {
  return y < 0 ? `${-y} BC` : `AD ${y}`
}

/** The date as short text, for a label. */
export function dateLabel(d: BookDate): string {
  if (d.from === null || d.to === null) return 'Date not known'
  if (d.from === d.to) return `about ${yearText(d.from)}`
  if (d.from < 0 && d.to < 0) return `${-d.from} to ${-d.to} BC`
  if (d.from > 0 && d.to > 0) return `AD ${d.from} to ${d.to}`
  return `${yearText(d.from)} to ${yearText(d.to)}`
}

/** The number of quotation links for each step of arc thickness: 1, 2 to 5, 6 or more. */
export function arcStep(n: number): 1 | 2 | 3 {
  return n >= 6 ? 3 : n >= 2 ? 2 : 1
}

/**
 * The years between two bands: from the end of the last range in the first band to the start of the
 * first range in the second band. A book with one year is a range of one year. Books with no date do
 * not count. Rounded down to 10 years, because the line says "N years or more". docs/DESIGN.md 4.6.
 */
export function yearsBetween(first: BookDate[], second: BookDate[]): number {
  const ends = first.filter((d) => d.to !== null).map((d) => lineYear(d.to!))
  const starts = second.filter((d) => d.from !== null).map((d) => lineYear(d.from!))
  if (!ends.length || !starts.length) throw new Error('A band has no book with a date')
  return Math.floor((Math.min(...starts) - Math.max(...ends)) / 10) * 10
}

export async function loadDates(): Promise<BookDate[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/dates.json`)
  if (!res.ok) throw new Error(`dates.json: HTTP ${res.status}`)
  return (await res.json()) as BookDate[]
}

export async function loadQuotationPairs(): Promise<QuotationPair[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/quotation-pairs.json`)
  if (!res.ok) throw new Error(`quotation-pairs.json: HTTP ${res.status}`)
  return (await res.json()) as QuotationPair[]
}
