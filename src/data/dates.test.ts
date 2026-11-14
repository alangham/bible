import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Book } from './books.ts'
import { arcStep, dateLabel, lineYear, standPoint, yearsBetween, type BookDate, type QuotationPair } from './dates.ts'
import type { Intro } from './intros.ts'
import type { BookLinks } from './links.ts'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const books = JSON.parse(read('../../public/data/books.json')) as Book[]
const intros = JSON.parse(read('../../public/data/intros.json')) as Intro[]
const dates = JSON.parse(read('../../public/data/dates.json')) as BookDate[]
const pairs = JSON.parse(read('../../public/data/quotation-pairs.json')) as QuotationPair[]
const periods = JSON.parse(read('../../public/data/periods.json')) as { names: string[]; years: string; from: number | null; to: number | null }[]

/**
 * The years that the words give, read again here without the table of dates.json:
 * - a year: "about 970 BC", "about AD 62", "539 to 332 BC", "AD 55 to 56";
 * - a century: "the 6th century BC" is -600 to -501. "early" is the first half, "late" the second half;
 * - a decade: "the 60s AD" is 60 to 69. "early" is the first half, "mid" the years 3 to 6, "second half of the" the second half;
 * - a period of public/data/periods.json, by one of its names.
 * The result is the first year and the last year of all that the words give.
 */
function yearsFromWords(words: string): [number, number] | null {
  const found: number[] = []
  const half = (start: number, end: number, q: string | undefined): [number, number] => {
    const size = end - start + 1
    if (q === 'early') return [start, start + size / 2 - 1]
    if (q === 'late' || q === 'second half of the') return [start + size / 2, end]
    if (q === 'mid') return [start + Math.round(size / 4), end - Math.round(size / 4)]
    return [start, end]
  }
  let rest = words
  // Centuries, one or two: "the late 8th and early 7th centuries BC", "late in the 7th century BC".
  const century = /(?:(early|late|mid) (?:in the )?)?(\d+)(?:st|nd|rd|th)(?: and (?:(early|late|mid) )?(\d+)(?:st|nd|rd|th))? centur(?:y|ies) (BC|AD)/g
  for (const m of words.matchAll(century)) {
    const bc = m[5] === 'BC'
    for (const [q, n] of [
      [m[1], m[2]],
      [m[3], m[4]],
    ] as const) {
      if (!n) continue
      const c = Number(n)
      const [s, e] = bc ? [-(c * 100), -(c * 100 - 99)] : [(c - 1) * 100 + 1, c * 100]
      found.push(...half(s, e, q))
    }
    rest = rest.replace(m[0], '')
  }
  // Decades: "the early 40s AD", "the second half of the 50s AD".
  for (const m of rest.matchAll(/(?:(early|mid|late|second half of the) )?(\d)0s AD/g)) {
    const s = Number(m[2]) * 10
    found.push(...half(s, s + 9, m[1]))
    rest = rest.replace(m[0], '')
  }
  // Years: "about AD 55 to 56", "539 to 332 BC", "about 700 BC".
  for (const m of rest.matchAll(/(AD )?(\d{2,4})(?: to (\d{2,4}))? ?(BC)?/g)) {
    const sign = m[4] ? -1 : 1
    if (!m[1] && !m[4]) continue
    found.push(sign * Number(m[2]))
    if (m[3]) found.push(sign * Number(m[3]))
  }
  if (found.length === 0) {
    const period = periods.find((p) => p.names.some((n) => words.toLowerCase().includes(n.toLowerCase())))
    if (period && period.from !== null && period.to !== null) found.push(period.from, period.to)
  }
  return found.length ? [Math.min(...found), Math.max(...found)] : null
}

describe('dates.json (docs/TASKS.md Task 8 steps 1 to 3)', () => {
  it('has each of the 66 books, in Bible order', () => {
    expect(dates.map((d) => d.id)).toEqual(books.map((b) => b.id))
  })

  it('takes the words of each date from the Written fact of the book, and not from an older view', () => {
    for (const d of dates) {
      const fact = intros.find((i) => i.id === d.id)!.written
      expect(fact, d.id).toContain(d.words)
      const sentence = fact.split(/(?<=\.)\s+/).find((s) => s.includes(d.words))!
      expect(sentence, d.id).not.toMatch(/^An older view/)
    }
  })

  it('has years that are in the words, or follow from a century, a decade, or a period', () => {
    for (const d of dates) {
      if (d.kind === 'unknown') continue
      expect([d.from, d.to], `${d.id}: "${d.words}"`).toEqual(yearsFromWords(d.words))
    }
  })

  it('gives the kind that the years show', () => {
    for (const d of dates) {
      if (d.kind === 'unknown') expect([d.from, d.to], d.id).toEqual([null, null])
      else if (d.kind === 'year') expect(d.from, d.id).toBe(d.to)
      else expect(d.from!, d.id).toBeLessThan(d.to!)
    }
  })

  it('gives no date for words that give only the earliest time or only the latest time', () => {
    // A fact that gives only an earliest or only a latest time puts the book in "Date not known" (Task 8 step 2).
    for (const d of dates) {
      if (/\b(by the time of|before|no later than|no earlier than|some time after)\b|^from /i.test(d.words)) expect(d.kind, d.id).toBe('unknown')
    }
  })

  it('puts each book with a note in "Not verified" or with no date, and gives each unclear date a note', () => {
    for (const d of dates) {
      if (d.kind === 'unknown' && !/not known|not certain/.test(d.words)) expect(d.notVerified, d.id).toBeTruthy()
    }
  })
})

describe('the date helpers', () => {
  it('counts across 1 BC and AD 1 with no year 0', () => {
    expect(lineYear(-1)).toBe(0)
    expect(lineYear(1)).toBe(1)
    expect(lineYear(1) - lineYear(-1)).toBe(1)
  })

  it('stands a spine at the middle of its range', () => {
    expect(standPoint({ id: 'x', kind: 'range', from: 60, to: 69, words: '' })).toBe(64.5)
    expect(standPoint({ id: 'x', kind: 'unknown', from: null, to: null, words: '' })).toBeNull()
  })

  it('writes the date as short text', () => {
    expect(dateLabel({ id: 'x', kind: 'year', from: -970, to: -970, words: '' })).toBe('about 970 BC')
    expect(dateLabel({ id: 'x', kind: 'range', from: -600, to: -501, words: '' })).toBe('600 to 501 BC')
    expect(dateLabel({ id: 'x', kind: 'range', from: 55, to: 59, words: '' })).toBe('AD 55 to 59')
  })

  it('has three steps of arc thickness', () => {
    expect([1, 2, 5, 6, 38].map(arcStep)).toEqual([1, 2, 2, 3, 3])
  })

  it('counts the years between the bands from the end of the last range to the start of the first range (Task 8b)', () => {
    const a: BookDate = { id: 'a', kind: 'range', from: -539, to: -332, words: '' }
    const y: BookDate = { id: 'y', kind: 'year', from: -460, to: -460, words: '' }
    const none: BookDate = { id: 'n', kind: 'unknown', from: null, to: null, words: '' }
    const b: BookDate = { id: 'b', kind: 'range', from: 40, to: 44, words: '' }
    const c: BookDate = { id: 'c', kind: 'year', from: 48, to: 48, words: '' }
    // From 332 BC to AD 40 with no year 0: 371 years, rounded down to 370.
    expect(yearsBetween([y, a, none], [c, b, none])).toBe(370)
  })

  it('gives 370 years between the bands with the dates of dates.json', () => {
    expect(yearsBetween(dates.slice(0, 39), dates.slice(39))).toBe(370)
  })
})

describe('the year leads where the words give a year and a century (Task 8b step 2)', () => {
  it('stands Obadiah and Lamentations at 586 BC', () => {
    for (const id of ['obadiah', 'lamentations']) {
      const d = dates.find((x) => x.id === id)!
      expect([d.kind, d.from, d.to], id).toEqual(['year', -586, -586])
    }
  })
})

describe('quotation-pairs.json (docs/TASKS.md Task 8 step 6)', () => {
  it('has the number of quotation links in public/data/links/ for each pair of books', () => {
    const dir = new URL('../../public/data/links/', import.meta.url)
    const seen = new Map<string, { a: string; b: string }>()
    for (const f of readdirSync(dir)) {
      const data = JSON.parse(readFileSync(new URL(f, dir), 'utf8')) as BookLinks
      for (const l of data.links) if (l.type === 'quotation' && l.a.book !== l.b.book) seen.set(l.id, { a: l.a.book, b: l.b.book })
    }
    const counts = new Map<string, number>()
    for (const { a, b } of seen.values()) counts.set(`${a}|${b}`, (counts.get(`${a}|${b}`) ?? 0) + 1)
    expect(new Map(pairs.map((p) => [`${p.from}|${p.to}`, p.n]))).toEqual(counts)
  })
})
