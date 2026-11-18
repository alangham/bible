// Helpers for one end of a link: its key and its color. docs/DESIGN.md section 7.7.

import { groupOf, groupVar, type Book } from '../data/books.ts'
import type { LinkEnd } from '../data/links.ts'

/** The key of one link end, for React and for the labels in the margin. */
export function endKey(end: LinkEnd): string {
  return `${end.link.id}:${end.here === end.link.a ? 'a' : 'b'}`
}

/** The color of the group that a link goes to. */
export function linkColor(books: Book[] | undefined, end: LinkEnd): string | undefined {
  const book = books?.find((b) => b.id === end.there.book)
  return book ? groupVar(groupOf(book)) : undefined
}
