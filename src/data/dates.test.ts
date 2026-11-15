import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Book } from './books.ts'
import { dateLabel, lineYear, standPoint, yearsBetween, type BookDate, type QuotationPair } from './dates.ts'
import type { Intro } from './intros.ts'
import type { BookLinks } from './links.ts'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const books = JSON.parse(read('../../public/data/books.json')) as Book[]
const intros = JSON.parse(read('../../public/data/intros.json')) as Intro[]
const dates = JSON.parse(read('../../public/data/dates.json')) as BookDate[]
const pairs = JSON.parse(read('../../public/data/quotation-pairs.json')) as QuotationPair[]
const periods = JSON.parse(read('../../public/data/periods.json')) as { names: string[]; years: string; from: number | null; to: number | null }[]
const estimates = read('../../docs/TIMELINE-ESTIMATES.md')

/** The rows of the table in docs/TIMELINE-ESTIMATES.md: book, first year, last year, and status. */
function estimateRows() {
  const year = (s: string) => {
    const bc = /^(\d+) BC$/.exec(s)
    const ad = /^AD (\d+)$/.exec(s)
    if (bc) return -Number(bc[1])
    if (ad) return Number(ad[1])
    throw new Error(`Not a year: ${s}`)
  }
  return estimates
    .split('\n')
    .map((line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
    .filter((cells) => cells.length === 6 && books.some((b) => b.name === cells[0]))
    .map((cells) => ({ id: books.find((b) => b.name === cells[0])!.id, from: year(cells[2]), to: year(cells[3]), status: cells[5] }))
}

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

  it('has years that are in the words, or follow from a century, a decade, or a period, cut by a limit (Task 9b)', () => {
    for (const d of dates) {
      if (d.estimate) continue
      const [from, to] = yearsFromWords(d.words)!
      const expected = [Math.max(from, d.after?.year ?? -Infinity), Math.min(to, d.before?.year ?? Infinity)]
      expect([d.from, d.to], `${d.id}: "${d.words}"`).toEqual(expected)
    }
  })

  it('takes the year of each limit from its words in the Written fact (Task 9b)', () => {
    for (const d of dates) {
      const fact = intros.find((i) => i.id === d.id)!.written
      for (const limit of [d.after, d.before]) {
        if (!limit) continue
        expect(fact, d.id).toContain(limit.words)
        const years = [...limit.words.matchAll(/(\d{2,4}) BC|AD (\d{2,4})/g)].map((m) => (m[1] ? -Number(m[1]) : Number(m[2])))
        expect(years.at(-1), d.id).toBe(limit.year)
      }
    }
  })

  it('accounts for each year of a dated Written fact: in the words of the date, or in a limit (Task 9b step 5)', () => {
    // A year that no rule uses, with the reason. Arthur decides these.
    const open: Record<string, string> = {
      // The call of Isaiah is not the last event that the fact names: Isaiah outlived Sennacherib, with no year.
      isaiah: '740 BC',
    }
    for (const d of dates) {
      if (d.estimate) continue
      const fact = intros.find((i) => i.id === d.id)!.written
      const traditional = fact
        .split(/(?<=\.)\s+/)
        .filter((s) => !/^An older view/.test(s))
        .join(' ')
      const used = [d.words, d.after?.words ?? '', d.before?.words ?? '', open[d.id] ?? ''].join(' | ')
      for (const m of traditional.matchAll(/\d{2,4} BC|AD \d{2,4}/g)) expect(used, `${d.id}: "${m[0]}"`).toContain(m[0])
    }
  })

  it('cuts 2 Kings at 538 BC and starts Daniel at 536 BC (docs/DESIGN.md section 4.6)', () => {
    const find = (id: string) => dates.find((x) => x.id === id)!
    expect([find('2-kings').from, find('2-kings').to]).toEqual([-600, -538])
    expect([find('daniel').from, find('daniel').to]).toEqual([-536, -501])
  })

  it('gives the kind that the years show', () => {
    for (const d of dates) {
      if (d.kind === 'year') expect(d.from, d.id).toBe(d.to)
      else expect(d.from, d.id).toBeLessThan(d.to)
    }
  })

  it('gives an estimate for words that give only the earliest time or only the latest time (docs/TIMELINE-ESTIMATES.md rule R2)', () => {
    for (const d of dates) {
      if (/\b(by the time of|before|no later than|no earlier than|some time after)\b|^from /i.test(d.words)) expect(d.estimate, d.id).toBe(true)
    }
  })
})

describe('the estimates (docs/TASKS.md Task 17 step 3)', () => {
  const rows = estimateRows()

  it('has 17 rows in docs/TIMELINE-ESTIMATES.md, each approved by Arthur', () => {
    expect(rows).toHaveLength(17)
    for (const r of rows) expect(r.status, r.id).toBe('APPROVED by Arthur, 2026-11-14')
  })

  it('gives each book of an approved row its first year and last year, with the mark of an estimate', () => {
    for (const r of rows) {
      const d = dates.find((x) => x.id === r.id)!
      expect([d.from, d.to, d.estimate], r.id).toEqual([r.from, r.to, true])
      expect(d.kind, r.id).toBe(r.from === r.to ? 'year' : 'range')
    }
  })

  it('marks no other date as an estimate', () => {
    expect(dates.filter((d) => d.estimate).map((d) => d.id)).toEqual(books.map((b) => b.id).filter((id) => rows.some((r) => r.id === id)))
  })

  it('gives Job the date text "by 600 BC", a latest limit (Arthur, 2026-11-14)', () => {
    const job = dates.find((d) => d.id === 'job')!
    expect([job.from, job.to, job.label]).toEqual([-600, -600, 'by 600 BC'])
    expect(dateLabel(job)).toBe('by 600 BC')
  })

  // Arthur, 2026-11-15: a date text keeps the limit word of its fact, and it keeps "about" where the
  // fact has it. docs/DESIGN.md section 7.8.
  const LABELS: Record<string, string> = {
    judges: 'by 970 BC',
    ruth: 'after about 1010 BC',
    job: 'by 600 BC',
    zechariah: 'from about 520 BC',
    luke: 'about AD 62 or later',
    hebrews: 'before AD 70',
    '2-john': 'by AD 99',
    '3-john': 'by AD 99',
  }

  it('gives the eight date texts that Arthur approved, and no other', () => {
    expect(Object.fromEntries(dates.filter((d) => d.label).map((d) => [d.id, d.label]))).toEqual(LABELS)
    for (const [id, label] of Object.entries(LABELS)) expect(dateLabel(dates.find((d) => d.id === id)!), id).toBe(label)
  })

  it('keeps "about" in a date text only where the fact has it, and names a year of the date', () => {
    for (const d of dates.filter((x) => x.label)) {
      expect(d.label!.includes('about'), d.id).toBe(d.words.includes('about'))
      const m = d.label!.match(/(\d{2,4}) BC|AD (\d{2,4})/)!
      const year = m[1] ? -Number(m[1]) : Number(m[2])
      expect([d.from, d.to], d.id).toContain(year)
    }
  })
})

describe('the date helpers', () => {
  it('counts across 1 BC and AD 1 with no year 0', () => {
    expect(lineYear(-1)).toBe(0)
    expect(lineYear(1)).toBe(1)
    expect(lineYear(1) - lineYear(-1)).toBe(1)
  })

  it('stands a book at the middle of its range', () => {
    expect(standPoint({ id: 'x', kind: 'range', from: 60, to: 69, words: '' })).toBe(64.5)
  })

  it('writes the date as short text', () => {
    expect(dateLabel({ id: 'x', kind: 'year', from: -970, to: -970, words: '' })).toBe('about 970 BC')
    expect(dateLabel({ id: 'x', kind: 'range', from: -600, to: -501, words: '' })).toBe('600 to 501 BC')
    expect(dateLabel({ id: 'x', kind: 'range', from: 55, to: 59, words: '' })).toBe('AD 55 to 59')
  })

  it('counts the years with no books from the end of the last range to the start of the first range (Task 8b)', () => {
    const a: BookDate = { id: 'a', kind: 'range', from: -539, to: -332, words: '' }
    const y: BookDate = { id: 'y', kind: 'year', from: -460, to: -460, words: '' }
    const b: BookDate = { id: 'b', kind: 'range', from: 40, to: 44, words: '' }
    const c: BookDate = { id: 'c', kind: 'year', from: 48, to: 48, words: '' }
    // From 332 BC to AD 40 with no year 0: 371 years, rounded down to 370.
    expect(yearsBetween([y, a], [c, b])).toBe(370)
  })

  it('gives 370 years with no books with the dates of dates.json', () => {
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
