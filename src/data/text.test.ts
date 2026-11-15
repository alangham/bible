// The bundled text: the words of each verse are the same as in bsb.txt.
// docs/TASKS.md Task 5 steps 3 and 4.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Book } from './books.ts'
import { isAdded, isOmitted, isVerseMark, type BookText } from './text.ts'

const root = join(import.meta.dirname, '..', '..')
const books = JSON.parse(readFileSync(join(root, 'public/data/books.json'), 'utf8')) as Book[]
const texts = books.map((b) => JSON.parse(readFileSync(join(root, 'public/data/text', `${b.id}.json`), 'utf8')) as BookText)

// bsb.txt: "<Book> <chapter>:<verse>", a tab, the verse text. Book names in Bible order.
const bsb = new Map<string, string>()
const bsbNames: string[] = []
for (const line of readFileSync(join(root, 'sources/bsb/bsb.txt'), 'utf8').replace(/^﻿/, '').split(/\r?\n/)) {
  const m = /^(.+) (\d+):(\d+)\t(.*)$/.exec(line)
  if (!m) continue
  if (bsbNames.at(-1) !== m[1]) bsbNames.push(m[1])
  bsb.set(`${bsbNames.length - 1} ${m[2]}:${m[3]}`, m[4])
}

/** The verse texts of the JSON files, keyed "<book index> <chapter>:<verse>", and the omitted verses. */
function versesFromJson() {
  const verses = new Map<string, string>()
  const omitted = new Map<string, string>()
  texts.forEach((book, bi) => {
    for (const ch of book.chapters) {
      let verse = 0
      for (const block of ch.blocks) {
        if (block.k !== 'p') continue
        for (const item of block.c) {
          if (isVerseMark(item)) {
            verse = item.v
            const key = `${bi} ${ch.n}:${verse}`
            if (verses.has(key)) throw new Error(`${key} starts two times`)
            verses.set(key, '')
          } else if (isOmitted(item)) {
            omitted.set(`${bi} ${ch.n}:${item.o}`, item.note.map((r) => r.t).join(''))
          } else {
            const key = `${bi} ${ch.n}:${verse}`
            if (!verses.has(key)) throw new Error(`text before a verse number in ${key}`)
            verses.set(key, verses.get(key) + (isAdded(item) ? item.a : item))
          }
        }
      }
    }
  })
  return { verses, omitted }
}

const { verses, omitted } = versesFromJson()

describe('bundled text', () => {
  it('has 66 books and 1,189 chapters, in the order of books.json', () => {
    expect(texts.map((t) => t.id)).toEqual(books.map((b) => b.id))
    expect(bsbNames).toHaveLength(66)
    texts.forEach((t, i) => {
      expect(t.chapters.map((c) => c.n), t.id).toEqual(Array.from({ length: books[i].chapters }, (_, k) => k + 1))
    })
    expect(texts.reduce((n, t) => n + t.chapters.length, 0)).toBe(1189)
  })

  it('has the same words as bsb.txt in each of the 31,086 verses', () => {
    const withText = [...bsb].filter(([, text]) => text !== '')
    expect(withText).toHaveLength(31086)
    const different = withText.filter(([key, text]) => verses.get(key) !== text).map(([key]) => key)
    expect(different).toEqual([])
    // No verse in the JSON files that bsb.txt does not have, or has with no text.
    const extra = [...verses.keys()].filter((key) => !bsb.get(key))
    expect(extra).toEqual([])
  })

  it('shows the number and the note of each of the 16 verses that are not in the main text', () => {
    const empty = [...bsb].filter(([, text]) => text === '').map(([key]) => key)
    expect(empty).toHaveLength(16)
    expect([...omitted.keys()].sort()).toEqual([...empty].sort())
    for (const key of empty) {
      const n = key.split(':')[1]
      // Each note gives the text of its verse after the verse number.
      expect(omitted.get(key), key).toMatch(new RegExp(`include.*${n}`))
    }
  })

  it('puts each verse that is not in the main text after the end of the verse before it', () => {
    // After an omitted verse, the next text is a new verse: no text of the earlier verse follows the note.
    const wrong: string[] = []
    for (const book of texts) {
      for (const ch of book.chapters) {
        let afterOmitted: number | null = null
        for (const block of ch.blocks) {
          if (block.k !== 'p') continue
          for (const item of block.c) {
            if (isOmitted(item)) afterOmitted = item.o
            else if (isVerseMark(item)) afterOmitted = null
            else if (afterOmitted !== null) wrong.push(`${book.id} ${ch.n}:${afterOmitted}`)
          }
        }
      }
    }
    expect(wrong).toEqual([])
  })

  it('keeps the manuscript notes on Mark 16:8 and John 7:52', () => {
    const note = (id: string, chapter: number) =>
      texts.find((t) => t.id === id)!.chapters[chapter - 1].blocks.filter((b) => b.k === 'n')
    expect(note('mark', 16).map((b) => b.ref)).toEqual(['16:8'])
    expect(note('mark', 16)[0].note[0].t).toMatch(/^Some early manuscripts end the Gospel of Mark after verse 8\./)
    expect(note('john', 7).map((b) => b.ref)).toEqual(['7:52'])
    expect(note('john', 7)[0].note.map((r) => r.t).join('')).toBe(
      'Some early manuscripts do not include John 7:53 through John 8:11.',
    )
    const all = texts.flatMap((t) => t.chapters.flatMap((c) => c.blocks.filter((b) => b.k === 'n')))
    expect(all).toHaveLength(2)
  })

  it('keeps the 1,325 cross-reference lines in a field of their own', () => {
    const lines = texts.flatMap((t) => t.chapters.flatMap((c) => c.xrefs))
    expect(lines).toHaveLength(1325)
    for (const x of lines) {
      expect(x.v).toBeGreaterThan(0)
      expect(x.refs.length).toBeGreaterThan(0)
    }
  })
})
