// The text and the name of a passage, for the link pop-up and the trail.

import type { Book } from './books.ts'
import { isOmitted, isVerseMark, type BookText } from './text.ts'

export interface PassageRange {
  book: string
  c: number
  v: number
  c2?: number
  v2?: number
}

/** "Exodus 24:8", "Romans 3:24-26", "Genesis 4:1-5:3". With no verse, "Genesis 4". */
export function passageName(books: Book[], p: { book: string; c: number; v?: number; c2?: number; v2?: number }): string {
  const name = books.find((b) => b.id === p.book)?.name ?? p.book
  if (!p.v) return `${name} ${p.c}`
  let s = `${name} ${p.c}:${p.v}`
  if (p.v2 !== undefined && (p.c2 !== undefined ? p.c2 !== p.c || p.v2 !== p.v : p.v2 !== p.v)) s += `-${p.c2 !== undefined && p.c2 !== p.c ? `${p.c2}:` : ''}${p.v2}`
  return s
}

export interface PassageVerse {
  c: number
  v: number
  text: string
  /** A verse that is not in the main text: `text` is its note, in the words of the publisher. */
  omitted?: boolean
}

/** The verses of a passage, in order. */
export function passageVerses(text: BookText, p: PassageRange): PassageVerse[] {
  const c2 = p.c2 ?? p.c
  const v2 = p.v2 ?? p.v
  const out: PassageVerse[] = []
  for (let c = p.c; c <= c2; c++) {
    const ch = text.chapters[c - 1]
    if (!ch) break
    let verse = 0
    const words = new Map<number, string>()
    const notes = new Set<number>()
    for (const block of ch.blocks) {
      if (block.k !== 'p') continue
      for (const item of block.c) {
        if (isVerseMark(item)) {
          verse = item.v
          words.set(verse, '')
        } else if (isOmitted(item)) {
          words.set(item.o, item.note.map((r) => r.t).join(''))
          notes.add(item.o)
        } else if (typeof item === 'string' && verse) words.set(verse, words.get(verse) + item)
      }
    }
    for (const [v, t] of [...words].sort((x, y) => x[0] - y[0])) {
      if (c === p.c && v < p.v) continue
      if (c === c2 && v > v2) continue
      out.push({ c, v, text: t.replace(/\s+/g, ' ').trim(), ...(notes.has(v) ? { omitted: true } : {}) })
    }
  }
  return out
}
