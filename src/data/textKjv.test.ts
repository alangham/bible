// The King James Version data: the words of each verse are the same as in the source files, and the
// structure is that of the Berean data. docs/TASKS.md Task 20 step 9, docs/DESIGN.md section 8.
//
// The test reads the words of the source with code of its own, not with the code of
// scripts/build-text-kjv.mjs.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Book } from './books.ts'
import { isAdded, isOmitted, isVerseMark, type BookText, type Inline } from './text.ts'

const root = join(import.meta.dirname, '..', '..')
const books = JSON.parse(readFileSync(join(root, 'public/data/books.json'), 'utf8')) as Book[]
const kjv = books.map((b) => JSON.parse(readFileSync(join(root, 'public/data/text-kjv', `${b.id}.json`), 'utf8')) as BookText)
const bsb = books.map((b) => JSON.parse(readFileSync(join(root, 'public/data/text', `${b.id}.json`), 'utf8')) as BookText)

// ---- the source: one USFM file for each book, in the order of the file names ----

/**
 * The words of a piece of USFM: no footnote, no Strong's number, no marker, no "¶", one space between
 * words. An opening marker ends with one space, which is part of the marker: "\w there…\w*\w by…\w*"
 * is the one word "thereby".
 */
function words(usfm: string): string {
  return usfm
    .replace(/\\f [\s\S]*?\\f\*/g, '')
    .replace(/\|strong="[^"]*"/g, '')
    .replace(/¶/g, '')
    .replace(/\\\+?[a-z]+\d?\*/g, '')
    .replace(/\\\+?[a-z]+\d?(\s|$)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** "<book index> <chapter>:<verse>" -> words. Verse 1 of a chapter with a title: the title, then the verse. */
const source = new Map<string, string>()
const titles = new Map<string, string>()
const files = readdirSync(join(root, 'sources/kjv/usfm'))
  .filter((f) => f.endsWith('.usfm'))
  .sort()
files.forEach((f, bi) => {
  const lines = readFileSync(join(root, 'sources/kjv/usfm', f), 'utf8').split(/\r?\n/)
  // The book head and the \s1 lines are not words of a verse.
  const body = lines.filter((l) => !/^\\(id|h|toc\d|mt\d|s1)(\s|$)/.test(l.trim())).join('\n')
  const parts = body.split(/\\c (\d+)\s/)
  for (let i = 1; i < parts.length; i += 2) {
    const c = Number(parts[i])
    const chapter = parts[i + 1]
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

function itemWords(x: Inline): string {
  return typeof x === 'string' ? x : isAdded(x) ? x.a : ''
}

const data = new Map<string, string>()
kjv.forEach((book, bi) => {
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
        } else {
          const key = `${bi} ${ch.n}:${verse}`
          if (!data.has(key)) throw new Error(`${book.id} ${ch.n}: words before a verse number`)
          data.set(key, data.get(key) + itemWords(item))
        }
      }
    }
  }
})

const verse = (id: string, c: number, v: number) => data.get(`${books.findIndex((b) => b.id === id)} ${c}:${v}`)?.replace(/\s+/g, ' ').trim()

describe('King James Version data', () => {
  it('has 66 books and 1,189 chapters, in the order of books.json, and 31,102 verses', () => {
    expect(files).toHaveLength(66)
    expect(kjv.map((t) => t.id)).toEqual(books.map((b) => b.id))
    let chapters = 0
    kjv.forEach((t, i) => {
      expect(t.translation).toBe('King James Version')
      expect(t.name).toBe(books[i].name)
      expect(t.chapters.map((c) => c.n), t.id).toEqual(Array.from({ length: books[i].chapters }, (_, k) => k + 1))
      chapters += t.chapters.length
    })
    expect(chapters).toBe(1189)
    expect(data.size).toBe(31102)
    expect(source.size).toBe(31102)
  })

  it('has the words of each verse as in the source', () => {
    const differ: string[] = []
    for (const [key, w] of source) {
      const d = data.get(key)?.replace(/\s+/g, ' ').trim()
      if (d !== w) differ.push(`${key}: source "${w}", data "${d}"`)
    }
    for (const key of data.keys()) if (!source.has(key)) differ.push(`${key}: not in the source`)
    expect(differ).toEqual([])
  })

  it('has these words in these verses', () => {
    expect(verse('genesis', 1, 1)).toBe('In the beginning God created the heaven and the earth.')
    expect(verse('genesis', 1, 2)).toBe(
      'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
    )
    expect(verse('matthew', 5, 3)).toBe('Blessed are the poor in spirit: for theirs is the kingdom of heaven.')
    expect(verse('romans', 16, 24)).toBe('The grace of our Lord Jesus Christ be with you all. Amen.')
    expect(verse('3-john', 1, 14)).toBe(
      'But I trust I shall shortly see thee, and we shall speak face to face. Peace be to thee. Our friends salute thee. Greet the friends by name.',
    )
  })

  it('has one added-words item in Genesis 1:2, with the word "was"', () => {
    const block = kjv[0].chapters[0].blocks.find((b) => b.k === 'p' && b.c.some((x) => isVerseMark(x) && x.v === 2))
    expect(block?.k === 'p' && block.c.filter(isAdded)).toEqual([{ a: 'was' }])
  })

  it('has a d block with the words "A Psalm of David." in Psalm 23', () => {
    const psalms = kjv[books.findIndex((b) => b.id === 'psalms')]
    const d = psalms.chapters[22].blocks.find((b) => b.k === 'p' && b.s === 'd')
    expect(d?.k === 'p' && d.c.map(itemWords).join('').trim()).toBe('A Psalm of David.')
    expect(titles.get(`${books.findIndex((b) => b.id === 'psalms')} 23`)).toBe('A Psalm of David.')
  })

  it('has no marker, no "|", no "¶", and no two spaces together in a string', () => {
    const bad: string[] = []
    kjv.forEach((t) => {
      for (const ch of t.chapters)
        for (const b of ch.blocks) {
          if (b.k !== 'p') continue
          for (const x of b.c) {
            const s = typeof x === 'string' ? x : isAdded(x) ? x.a : null
            if (s !== null && /[\\|¶]| {2}/.test(s)) bad.push(`${t.id} ${ch.n}: ${s}`)
          }
        }
    })
    expect(bad).toEqual([])
  })

  it('starts each text block with a verse number, except the block after a d block', () => {
    const bad: string[] = []
    kjv.forEach((t) => {
      for (const ch of t.chapters) {
        let afterD = false
        for (const b of ch.blocks) {
          if (b.k !== 'p') continue
          const ok = afterD ? typeof b.c[0] === 'string' || isAdded(b.c[0]) : isVerseMark(b.c[0])
          if (!ok || b.c.length === 0) bad.push(`${t.id} ${ch.n} [${b.s}] ${JSON.stringify(b.c[0])}`)
          if (b.s === 'd' && !(b.c.length >= 2 && isVerseMark(b.c[0]) && b.c[0].v === 1)) bad.push(`${t.id} ${ch.n}: d block`)
          afterD = b.s === 'd'
        }
      }
    })
    expect(bad).toEqual([])
  })

  it('has words in each text block', () => {
    const bad: string[] = []
    kjv.forEach((t) => {
      for (const ch of t.chapters)
        for (const b of ch.blocks) if (b.k === 'p' && !b.c.some((x) => itemWords(x).trim())) bad.push(`${t.id} ${ch.n} [${b.s}]`)
    })
    expect(bad).toEqual([])
  })

  it('puts each verse in the block of its Berean block, with the same style', () => {
    // For each text block: the style, and the verses that start in it. A Berean block in which no verse
    // starts has no block in the King James Version data, except the block after a d block, which holds
    // verse 1. A Berean d block with no title in the source: verse 1 starts in the next block.
    const groups = (blocks: BookText['chapters'][number]['blocks'], kjvHasD: boolean) => {
      const out: { s: string; v: number[] }[] = []
      let afterD = false
      let carry: number[] = []
      for (const b of blocks) {
        if (b.k !== 'p') continue
        const v = b.c.filter((x) => isVerseMark(x) || isOmitted(x)).map((x) => (isVerseMark(x) ? x.v : isOmitted(x) ? x.o : 0))
        if (b.s === 'd' && !kjvHasD) {
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
    kjv.forEach((t, i) => {
      t.chapters.forEach((ch, c) => {
        const kjvHasD = ch.blocks.some((b) => b.k === 'p' && b.s === 'd')
        const mine = JSON.stringify(groups(ch.blocks, true))
        const theirs = JSON.stringify(groups(bsb[i].chapters[c].blocks, kjvHasD))
        if (mine !== theirs) bad.push(`${t.id} ${ch.n}`)
      })
    })
    expect(bad).toEqual([])
  })

  it('has the headings and the cross-reference lines of the Berean chapter, without the s2 headings of the Song of Solomon', () => {
    kjv.forEach((t, i) => {
      t.chapters.forEach((ch, c) => {
        const theirs = bsb[i].chapters[c]
        const headings = theirs.blocks.filter((b) => b.k === 'h' && !(t.id === 'song-of-solomon' && b.s === 's2'))
        expect(
          ch.blocks.filter((b) => b.k === 'h'),
          `${t.id} ${ch.n}`,
        ).toEqual(headings)
        expect(ch.xrefs, `${t.id} ${ch.n}`).toEqual(theirs.xrefs)
      })
    })
    const song = kjv[books.findIndex((b) => b.id === 'song-of-solomon')]
    expect(song.chapters.flatMap((ch) => ch.blocks.filter((b) => b.k === 'h' && b.s === 's2'))).toEqual([])
  })

  it('has no o item and no note block', () => {
    const bad: string[] = []
    kjv.forEach((t) => {
      for (const ch of t.chapters)
        for (const b of ch.blocks) {
          if (b.k === 'n') bad.push(`${t.id} ${ch.n}: note block`)
          if (b.k === 'p' && b.c.some(isOmitted)) bad.push(`${t.id} ${ch.n}: o item`)
        }
    })
    expect(bad).toEqual([])
  })
})
