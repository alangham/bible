// The dates of the timeline. docs/DESIGN.md sections 4.6 and 7.8, docs/TASKS.md Tasks 8 and 17.
// public/data/dates.json comes from the Written fact of each book in public/data/intros.json.
// The timeline uses the traditional view only. Years BC are negative numbers.
// 17 books have an estimate: the rows of docs/TIMELINE-ESTIMATES.md that Arthur approved on 2026-11-14.

export type DateKind = 'year' | 'range'

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
  /** The first year. */
  from: number
  /** The last year. The same as `from` for the kind "year". */
  to: number
  /** The words of the Written fact that give the date. */
  words: string
  /** The last dated event that the fact names. The range starts no earlier than its year. */
  after?: DateLimit
  /** A dated event that the writing came before. The range ends no later than its year. */
  before?: DateLimit
  /** True for a date that is an estimate: an approved row of docs/TIMELINE-ESTIMATES.md. */
  estimate?: true
  /**
   * The date text, where it is not the text of the years. It keeps the limit word of the Written fact,
   * and "about" where the fact has it. Arthur approved the eight texts: docs/DESIGN.md section 7.8.
   */
  label?: string
}

/** One pair of books with quotation links. `from` quotes `to`. */
export interface QuotationPair {
  from: string
  to: string
  n: number
}

/**
 * A year as a point on a line with no year 0: 1 BC is 0, 2 BC is -1, AD 1 is 1.
 * The scale of the timeline and the count of years with no books use this, so that the count is right across 1 BC and AD 1.
 */
export function lineYear(year: number): number {
  return year < 0 ? year + 1 : year
}

/** The point where a book stands: the year, or the middle of the range. */
export function standPoint(d: BookDate): number {
  return (lineYear(d.from) + lineYear(d.to)) / 2
}

function yearText(y: number): string {
  return y < 0 ? `${-y} BC` : `AD ${y}`
}

/** The date as short text, for a label. It does not say that the date is an estimate. */
export function dateLabel(d: BookDate): string {
  if (d.label) return d.label
  if (d.from === d.to) return `about ${yearText(d.from)}`
  if (d.from < 0 && d.to < 0) return `${-d.from} to ${-d.to} BC`
  if (d.from > 0 && d.to > 0) return `AD ${d.from} to ${d.to}`
  return `${yearText(d.from)} to ${yearText(d.to)}`
}

/**
 * The years with no books between the Old Testament and the New Testament: from the end of the last
 * range in the first list to the start of the first range in the second list. A book with one year is
 * a range of one year. Rounded down to 10 years, because the words say "or more". docs/DESIGN.md 4.6.
 */
export function yearsBetween(first: BookDate[], second: BookDate[]): number {
  const ends = first.map((d) => lineYear(d.to))
  const starts = second.map((d) => lineYear(d.from))
  if (!ends.length || !starts.length) throw new Error('A list of dates is empty')
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
