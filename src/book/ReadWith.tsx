// The read-with list: one line below the chapter heading. docs/DESIGN.md sections 4.5 and 7.7.
// It names the chapters in other books that share the most cross-references with this chapter.
// Each entry is a control for travel to that chapter, in the color of its group.

import { useId } from 'react'
import { groupOf, groupVar, type Book } from '../data/books.ts'
import type { ChapterRef } from '../data/links.ts'
import { passageName } from '../data/passage.ts'
import { chapterHref } from '../router.ts'
import { plainClick } from './links.ts'

interface ReadWithProps {
  books: Book[]
  list: ChapterRef[]
  onTravel: (to: ChapterRef) => void
}

export function ReadWith({ books, list, onTravel }: ReadWithProps) {
  const labelId = useId()
  if (!list.length) return null
  return (
    <nav className="rd-read-with" aria-labelledby={labelId}>
      <span className="rd-read-with-label" id={labelId}>
        Read with
      </span>
      <ul>
        {list.map((r) => {
          const book = books.find((b) => b.id === r.book)
          return (
            <li key={`${r.book}:${r.c}`}>
              <a
                href={chapterHref(r.book, r.c)}
                style={{ color: book ? groupVar(groupOf(book)) : undefined }}
                onClick={(e) => {
                  if (!plainClick(e)) return
                  e.preventDefault()
                  onTravel(r)
                }}
              >
                {passageName(books, r)}
              </a>
            </li>
          )
        })}
      </ul>
      <span className="rd-read-with-source">From OpenBible.info</span>
    </nav>
  )
}
