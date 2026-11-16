// The World English Bible data: the words of each verse are the same as in the source files, and the
// structure is that of the Berean data. docs/TASKS.md Task 30 step 7, docs/DESIGN.md section 13.
// The World English Bible has no list of changed words. The site keeps the verse numbers of the source.
//
// The test reads the words of the source with code of its own, not with the code of
// scripts/build-text-web.mjs.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Book } from './books.ts'
import { isAdded, isMarked, isOmitted, isVerseMark, type BookText, type Inline } from './text.ts'

const root = join(import.meta.dirname, '..', '..')
const books = JSON.parse(readFileSync(join(root, 'public/data/books.json'), 'utf8')) as Book[]
const web = books.map((b) => JSON.parse(readFileSync(join(root, 'public/data/text-web', `${b.id}.json`), 'utf8')) as BookText)
const bsb = books.map((b) => JSON.parse(readFileSync(join(root, 'public/data/text', `${b.id}.json`), 'utf8')) as BookText)
const indexOf = (id: string) => books.findIndex((b) => b.id === id)

// ---- the source: one USFM file for each book, in the order of the file names ----

/**
 * The words of a piece of USFM: no footnote, no cross-reference note, no Strong's number, no marker, one
 * space between words. An opening marker ends with one space, which is part of the marker.
 */
function words(usfm: string): string {
  return usfm
    .replace(/\\f [\s\S]*?\\f\*/g, '')
    .replace(/\\x [\s\S]*?\\x\*/g, '')
    .replace(/\|strong="[^"]*"/g, '')
    .replace(/\\\+?[a-z]+\d?\*/g, '')
    .replace(/\\\+?[a-z]+\d?(\s|$)/g, '')
    .replace(/[ \t\r\n]+/g, ' ')
    .replace(/^ | $/g, '')
}

/** "<book index> <chapter>:<verse>" -> words. Verse 1 of a chapter with a title: the title, then the verse. */
const source = new Map<string, string>()
const titles = new Map<string, string>()
const files = readdirSync(join(root, 'sources/web/usfm'))
  .filter((f) => f.endsWith('.usfm'))
  .sort()
files.forEach((f, bi) => {
  const lines = readFileSync(join(root, 'sources/web/usfm', f), 'utf8').split(/\r?\n/)
  // The book head, \cl, \ms1, and \sp are not words of a verse.
  const body = lines.filter((l) => !/^\\(id|ide|h|toc\d|mt\d|cl|ms1|sp)(\s|$)/.test(l.trim())).join('\n')
  const parts = body.split(/\\c (\d+)\s/)
  for (let i = 1; i < parts.length; i += 2) {
    const c = Number(parts[i])
    let chapter = parts[i + 1]
    // Psalm 119: the 22 \d lines are the names of the Hebrew letters. The site does not use them.
    if (bi === indexOf('psalms') && c === 119) chapter = chapter.replace(/^\\d .*$/gm, '')
    const first = chapter.indexOf('\\v ')
    const head = chapter.slice(0, first)
    const title = /\\d\s([\s\S]*)/.exec(head)
    const verses = chapter.slice(first).split(/\\v (\d+)\s/)
    for (let k = 1; k < verses.length; k += 2) {
      const v = Number(verses[k])
      let w = words(verses[k + 1])
      if (v === 1 && title) {
        titles.set(`${bi} ${c}`, words(title[1]))
        w = `${words(title[1])} ${w}`
      }
      source.set(`${bi} ${c}:${v}`, w)
    }
  }
})

// ---- the data: the words of each verse ----

/** The words of an item. Marked words are words of their verse. */
function itemWords(x: Inline): string {
  return typeof x === 'string' ? x : isMarked(x) ? x.j : ''
}

/** "<book index> <chapter>:<verse>" -> words, with the title. And the words without the Psalm titles. */
const data = new Map<string, string>()
const noTitles = new Map<string, string>()
web.forEach((book, bi) => {
  for (const ch of book.chapters) {
    let verse = 0
    for (const block of ch.blocks) {
      if (block.k !== 'p') continue
      for (const item of block.c) {
        if (isVerseMark(item)) {
          verse = item.v
          const key = `${bi} ${ch.n}:${verse}`
          if (data.has(key)) throw new Error(`${book.id} ${ch.n}:${verse} starts two times`)
          data.set(key, '')
          noTitles.set(key, '')
        } else {
          const key = `${bi} ${ch.n}:${verse}`
          if (!data.has(key)) throw new Error(`${book.id} ${ch.n}: words before a verse number`)
          data.set(key, data.get(key) + itemWords(item))
          if (block.s !== 'd') noTitles.set(key, noTitles.get(key) + itemWords(item))
        }
      }
    }
  }
})

const verse = (id: string, c: number, v: number) => data.get(`${indexOf(id)} ${c}:${v}`)?.replace(/[ \t\r\n]+/g, ' ').replace(/^ | $/g, '')
const verseNoTitle = (id: string, c: number, v: number) => noTitles.get(`${indexOf(id)} ${c}:${v}`)?.replace(/[ \t\r\n]+/g, ' ').replace(/^ | $/g, '')

/** The verse numbers of the source with no words. docs/DESIGN.md section 13.3. A list of the test's own. */
const EMPTY: [string, number, number][] = [
  ['luke', 17, 36],
  ['acts', 8, 37],
  ['acts', 15, 34],
  ['acts', 24, 7],
  ['romans', 16, 25],
]
const emptyKeys = new Set(EMPTY.map(([id, c, v]) => `${indexOf(id)} ${c}:${v}`))

describe('World English Bible data', () => {
  it('has 66 books and 1,189 chapters, in the order of books.json, and 31,098 verses', () => {
    expect(files).toHaveLength(66)
    expect(web.map((t) => t.id)).toEqual(books.map((b) => b.id))
    let chapters = 0
    web.forEach((t, i) => {
      expect(t.translation).toBe('World English Bible')
      expect(t.name).toBe(books[i].name)
      expect(t.chapters.map((c) => c.n), t.id).toEqual(Array.from({ length: books[i].chapters }, (_, k) => k + 1))
      chapters += t.chapters.length
    })
    expect(chapters).toBe(1189)
    expect(data.size).toBe(31098)
    expect(source.size).toBe(31103)
  })

  it('has the words of each verse as in the source', () => {
    const differ: string[] = []
    for (const [key, w] of source) {
      if (emptyKeys.has(key)) continue
      const d = data.get(key)?.replace(/[ \t\r\n]+/g, ' ').replace(/^ | $/g, '')
      if (d !== w) differ.push(`${key}: source "${w}", data "${d}"`)
    }
    for (const key of data.keys()) if (!source.has(key)) differ.push(`${key}: not in the source`)
    expect(differ).toEqual([])
  })

  it('has no item for the five verse numbers with no words, and the verses of Romans 14 and 16 of the source', () => {
    for (const key of emptyKeys) {
      expect(source.get(key), key).toBe('')
      expect(data.has(key), key).toBe(false)
    }
    expect([...source].filter(([, w]) => w === '').map(([k]) => k)).toEqual([...emptyKeys])
    const romans = web[indexOf('romans')]
    const nums = (c: number) =>
      romans.chapters[c - 1].blocks.flatMap((b) => (b.k === 'p' ? b.c.filter(isVerseMark).map((x) => x.v) : []))
    expect(nums(14)).toEqual(Array.from({ length: 26 }, (_, k) => k + 1))
    const last = romans.chapters[13].blocks.filter((b) => b.k === 'p').at(-1)!
    expect(last.k === 'p' && last.s).toBe('p')
    expect(last.k === 'p' && last.c.filter(isVerseMark).map((x) => x.v)).toEqual([24, 25, 26])
    expect(nums(16).at(-1)).toBe(24)
  })

  it('has these words in these verses', () => {
    expect(verse('genesis', 1, 1)).toBe('In the beginning, God created the heavens and the earth.')
    expect(verseNoTitle('psalms', 3, 1)).toBe('LORD, how my adversaries have increased! Many are those who rise up against me.')
    expect(verseNoTitle('psalms', 23, 1)).toBe('The LORD is my shepherd; I shall lack nothing.')
    expect(verse('matthew', 17, 21)).toBe('But this kind doesn’t go out except by prayer and fasting.”')
    expect(verse('romans', 16, 24)).toBe('The grace of our Lord Jesus Christ be with you all! Amen.')
  })

  it('has a d block with the words "A Psalm by David." in Psalm 23, and no d block in Psalm 119 and Zechariah 12', () => {
    const psalms = web[indexOf('psalms')]
    const d = psalms.chapters[22].blocks.find((b) => b.k === 'p' && b.s === 'd')
    expect(d?.k === 'p' && d.c.map(itemWords).join('').trim()).toBe('A Psalm by David.')
    expect(titles.get(`${indexOf('psalms')} 23`)).toBe('A Psalm by David.')
    expect(psalms.chapters[118].blocks.some((b) => b.k === 'p' && b.s === 'd')).toBe(false)
    const zechariah = web[indexOf('zechariah')].chapters[11]
    expect(zechariah.blocks.some((b) => b.k === 'p' && b.s === 'd')).toBe(false)
    const first = zechariah.blocks.find((b) => b.k === 'p')!
    expect(first.k === 'p' && first.c[0]).toEqual({ v: 1 })
  })

  it('has "LORD" 6,570 times in the words of the verses, with the Psalm titles not counted, and no "Yahweh"', () => {
    const whole = (w: string) => new RegExp(`(?<![\\p{L}\\p{N}])${w}(?![\\p{L}\\p{N}])`, 'gu')
    const all = [...noTitles.values()].join('\n')
    expect(all.match(whole('LORD'))?.length).toBe(6570)
    expect(all.match(whole('Yahweh'))).toBeNull()
    expect([...data.values()].join('\n').match(whole('Yahweh'))).toBeNull()
  })

  it('has no "\\", no "|", and no two spaces together in a string', () => {
    const bad: string[] = []
    web.forEach((t) => {
      for (const ch of t.chapters)
        for (const b of ch.blocks) {
          if (b.k !== 'p') continue
          for (const x of b.c) {
            const s = typeof x === 'string' ? x : isMarked(x) ? x.j : null
            if (s !== null && /[\\|]| {2}/.test(s)) bad.push(`${t.id} ${ch.n}: ${s}`)
          }
        }
    })
    expect(bad).toEqual([])
  })

  it('starts each text block with a verse number, except the block after a d block, and has a verse in each block', () => {
    const bad: string[] = []
    web.forEach((t) => {
      for (const ch of t.chapters) {
        let afterD = false
        for (const b of ch.blocks) {
          if (b.k !== 'p') continue
          const ok = afterD ? typeof b.c[0] === 'string' || isMarked(b.c[0]) : isVerseMark(b.c[0])
          if (!ok || b.c.length === 0) bad.push(`${t.id} ${ch.n} [${b.s}] ${JSON.stringify(b.c[0])}`)
          if (!afterD && !b.c.some(isVerseMark)) bad.push(`${t.id} ${ch.n} [${b.s}]: no verse`)
          if (!b.c.some((x) => itemWords(x).trim())) bad.push(`${t.id} ${ch.n} [${b.s}]: no words`)
          if (b.s === 'd' && !(b.c.length >= 2 && isVerseMark(b.c[0]) && b.c[0].v === 1)) bad.push(`${t.id} ${ch.n}: d block`)
          afterD = b.s === 'd'
        }
      }
    })
    expect(bad).toEqual([])
  })

  it('puts each verse in the block of its Berean block, with the same style', () => {
    // For each text block: the style, and the verses that start in it. The Berean verses that the data does
    // not have count as no verse. Romans 14 has one more block, with verses 24 to 26.
    const groups = (blocks: BookText['chapters'][number]['blocks'], hasD: boolean, has: (v: number) => boolean) => {
      const out: { s: string; v: number[] }[] = []
      let afterD = false
      let carry: number[] = []
      for (const b of blocks) {
        if (b.k !== 'p') continue
        const v = b.c
          .filter((x) => isVerseMark(x) || isOmitted(x))
          .map((x) => (isVerseMark(x) ? x.v : isOmitted(x) ? x.o : 0))
          .filter(has)
        if (b.s === 'd' && !hasD) {
          carry = v
          continue
        }
        const all = [...carry, ...v]
        carry = []
        if (all.length || afterD) out.push({ s: b.s, v: all })
        afterD = b.s === 'd'
      }
      return out
    }
    const bad: string[] = []
    web.forEach((t, i) => {
      t.chapters.forEach((ch, c) => {
        const hasD = ch.blocks.some((b) => b.k === 'p' && b.s === 'd')
        const has = (v: number) => data.has(`${i} ${ch.n}:${v}`)
        const mine = groups(ch.blocks, true, has)
        const theirs = groups(bsb[i].chapters[c].blocks, hasD, has)
        if (t.id === 'romans' && ch.n === 14) theirs.push({ s: 'p', v: [24, 25, 26] })
        if (JSON.stringify(mine) !== JSON.stringify(theirs)) bad.push(`${t.id} ${ch.n}`)
      })
    })
    expect(bad).toEqual([])
  })

  it('has the headings and the cross-reference lines of the Berean chapter, without the s2 headings of the Song of Solomon and without "Doxology" of Romans 16', () => {
    web.forEach((t, i) => {
      t.chapters.forEach((ch, c) => {
        const theirs = bsb[i].chapters[c]
        const doxology = t.id === 'romans' && ch.n === 16
        const headings = theirs.blocks.filter(
          (b) => b.k === 'h' && !(t.id === 'song-of-solomon' && b.s === 's2') && !(doxology && b.t === 'Doxology'),
        )
        expect(
          ch.blocks.filter((b) => b.k === 'h'),
          `${t.id} ${ch.n}`,
        ).toEqual(headings)
        expect(ch.xrefs, `${t.id} ${ch.n}`).toEqual(theirs.xrefs.filter((x) => !(doxology && x.v === 25)))
      })
    })
    const romans16 = bsb[indexOf('romans')].chapters[15]
    expect(romans16.blocks.filter((b) => b.k === 'h' && b.t === 'Doxology')).toHaveLength(1)
    expect(romans16.xrefs.filter((x) => x.v === 25).map((x) => x.t)).toEqual(['(Jude 1:24–25)'])
  })

  it('has no a item, no o item, and no note block', () => {
    const bad: string[] = []
    web.forEach((t) => {
      for (const ch of t.chapters)
        for (const b of ch.blocks) {
          if (b.k === 'n') bad.push(`${t.id} ${ch.n}: note block`)
          if (b.k === 'p' && b.c.some(isOmitted)) bad.push(`${t.id} ${ch.n}: o item`)
          if (b.k === 'p' && b.c.some(isAdded)) bad.push(`${t.id} ${ch.n}: a item`)
        }
    })
    expect(bad).toEqual([])
  })
})
