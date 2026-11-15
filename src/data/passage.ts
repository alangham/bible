// The text and the name of a passage, for the link pop-up and the trail.

import type { Book } from './books.ts'
import { isAdded, isOmitted, isVerseMark, type BookText } from './text.ts'

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

/** A part of the words of a verse: plain words, or the added words of the King James Version (`a`). */
export interface VersePart {
  t: string
  a?: true
}

export interface PassageVerse {
  c: number
  v: number
  /** The words of the verse, as plain text. */
  text: string
  /** The same words in parts, so that a page can show the added words in italics. docs/DESIGN.md section 8.2. */
  parts: VersePart[]
  /** A verse that is not in the main text: `text` is its note, in the words of the publisher. */
  omitted?: boolean
}

/** One space between words, and no space at the start or the end of the verse. Empty parts go. */
function tidy(parts: VersePart[]): VersePart[] {
  const out = parts.map((x) => ({ ...x, t: x.t.replace(/\s+/g, ' ') }))
  if (out.length) out[0].t = out[0].t.replace(/^ /, '')
  if (out.length) out[out.length - 1].t = out[out.length - 1].t.replace(/ $/, '')
  return out.filter((x) => x.t !== '')
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
    const words = new Map<number, VersePart[]>()
    const notes = new Set<number>()
    const push = (part: VersePart) => {
      const list = words.get(verse)!
      const last = list.at(-1)
      if (last && !last.a && !part.a) last.t += part.t
      else list.push(part)
    }
    for (const block of ch.blocks) {
      if (block.k !== 'p') continue
      for (const item of block.c) {
        if (isVerseMark(item)) {
          verse = item.v
          words.set(verse, [])
        } else if (isOmitted(item)) {
          words.set(item.o, [{ t: item.note.map((r) => r.t).join('') }])
          notes.add(item.o)
        } else if (typeof item === 'string' && verse) push({ t: item })
        // The added words of the King James Version are words of their verse.
        else if (isAdded(item) && verse) push({ t: item.a, a: true })
      }
    }
    for (const [v, list] of [...words].sort((x, y) => x[0] - y[0])) {
      if (c === p.c && v < p.v) continue
      if (c === c2 && v > v2) continue
      const parts = tidy(list)
      out.push({ c, v, text: parts.map((x) => x.t).join(''), parts, ...(notes.has(v) ? { omitted: true } : {}) })
    }
  }
  return out
}
