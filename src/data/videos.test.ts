// The video list against the numbers of docs/DESIGN.md section 17.5. docs/TASKS.md Task 42 step 4.

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { BOOK_VIDEOS, SUMMARY_VIDEOS, VIDEO_CREDIT } from './videos.ts'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const bookIds = (JSON.parse(read('../../public/data/books.json')) as { id: string }[]).map((b) => b.id)

// The table of section 17.5: No., Playlist, Video id, Title on YouTube, Book ids, Words of the link, Sentence of the shared video.
const design = read('../../docs/DESIGN.md')
const listPart = design.slice(design.indexOf('### 17.5 The video list'), design.indexOf('### 17.6'))
const rows = listPart
  .split('\n')
  .filter((line) => /^\| \d+ \| (Old|New) Testament \|/.test(line))
  .map((line) => {
    const cells = line.slice(1, -1).split('|').map((c) => c.trim())
    return {
      playlist: cells[1],
      id: cells[2].replace(/`/g, ''),
      title: cells[3],
      books: [...cells[4].matchAll(/`([^`]+)`/g)].map((m) => m[1]),
      shared: cells[6],
    }
  })

const videosOfBooks = Object.values(BOOK_VIDEOS).flatMap((b) => b.videos)
const summaries = [SUMMARY_VIDEOS.oldTestament, SUMMARY_VIDEOS.newTestament]

describe('the video list', () => {
  it('has the 73 rows of section 17.5, with the SHA-256 of the design', () => {
    expect(rows).toHaveLength(73)
    expect(rows.filter((r) => r.playlist === 'Old Testament')).toHaveLength(41)
    const lines = rows.map((r) => `${r.id}\t${r.title}\n`).join('')
    expect(createHash('sha256').update(lines, 'utf8').digest('hex')).toBe('94e0f6bf2fb0207bea9fbe0cc5913a7ba85d8a740e39727958aa7d38cfe6a46d')
  })

  it('gives each of the 66 book ids one or two videos: 56 one, and 10 two', () => {
    expect(Object.keys(BOOK_VIDEOS).sort()).toEqual([...bookIds].sort())
    const counts = Object.values(BOOK_VIDEOS).map((b) => b.videos.length)
    expect(counts.filter((n) => n === 1)).toHaveLength(56)
    expect(counts.filter((n) => n === 2)).toHaveLength(10)
  })

  it('has 71 different video ids for the books, and 73 with the two summary videos', () => {
    expect(new Set(videosOfBooks).size).toBe(71)
    expect(new Set([...videosOfBooks, ...summaries]).size).toBe(73)
  })

  it('has video ids of 11 letters, digits, "-", and "_"', () => {
    for (const id of [...videosOfBooks, ...summaries]) expect(id).toMatch(/^[A-Za-z0-9_-]{11}$/)
  })

  it('has 4 video ids in more than one book, and those 9 books, and no other, have a sentence of the shared video', () => {
    const uses = new Map<string, string[]>()
    for (const [book, v] of Object.entries(BOOK_VIDEOS)) for (const id of v.videos) uses.set(id, [...(uses.get(id) ?? []), book])
    const shared = [...uses.values()].filter((books) => books.length > 1)
    expect(shared).toHaveLength(4)
    const sharedBooks = shared.flat().sort()
    expect(sharedBooks).toHaveLength(9)
    expect(Object.keys(BOOK_VIDEOS).filter((b) => BOOK_VIDEOS[b].shared).sort()).toEqual(sharedBooks)
  })

  it('has the video ids, the order, and the sentences of the table for each book', () => {
    const fromTable: Record<string, { videos: string[]; shared?: string }> = {}
    for (const r of rows)
      for (const book of r.books) {
        fromTable[book] ??= { videos: [] }
        fromTable[book].videos.push(r.id)
        if (r.shared) fromTable[book].shared = r.shared
      }
    expect(BOOK_VIDEOS).toEqual(fromTable)
  })

  it('has the summary videos of rows 1 of the two playlists', () => {
    const none = rows.filter((r) => r.books.length === 0)
    expect(none.map((r) => [r.playlist, r.id])).toEqual([
      ['Old Testament', SUMMARY_VIDEOS.oldTestament],
      ['New Testament', SUMMARY_VIDEOS.newTestament],
    ])
  })

  it('has the words of the credit of section 17.3, character for character', () => {
    const credit = design.match(/The credit is these words, with no change: "([^"]+)"/)
    expect(credit).not.toBeNull()
    expect(VIDEO_CREDIT.before + VIDEO_CREDIT.link + VIDEO_CREDIT.after).toBe(credit![1])
    expect(VIDEO_CREDIT.href).toBe('https://www.bibleproject.com/')
  })
})
