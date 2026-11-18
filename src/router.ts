// Hash routes, because GitHub Pages has no rewrite rules.

import { useSyncExternalStore } from 'react'

export type Route =
  | { page: 'wall' }
  | { page: 'book'; id: string }
  | { page: 'chapter'; id: string; chapter: number; verse?: number }
  | { page: 'sources' }
  | { page: 'timeline' }
  | { page: 'quotations' }
  | { page: 'map'; id: string }

export function parseRoute(hash: string): Route {
  if (/^#\/sources\/?$/.test(hash)) return { page: 'sources' }
  if (/^#\/timeline\/?$/.test(hash)) return { page: 'timeline' }
  if (/^#\/quotations\/?$/.test(hash)) return { page: 'quotations' }
  const map = /^#\/book\/([a-z0-9-]+)\/map\/?$/.exec(hash)
  if (map) return { page: 'map', id: map[1] }
  const book = /^#\/book\/([a-z0-9-]+)\/?$/.exec(hash)
  if (book) return { page: 'book', id: book[1] }
  const chapter = /^#\/book\/([a-z0-9-]+)\/([1-9][0-9]*)(?:\/([1-9][0-9]*))?\/?$/.exec(hash)
  if (chapter) {
    const route: Route = { page: 'chapter', id: chapter[1], chapter: Number(chapter[2]) }
    if (chapter[3]) route.verse = Number(chapter[3])
    return route
  }
  return { page: 'wall' }
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => '',
  )
  return parseRoute(hash)
}

/** The Sources page. docs/TASKS.md Task 6. */
export function sourcesHref(): string {
  return '#/sources'
}

/** The timeline. docs/DESIGN.md section 4.6. */
export function timelineHref(): string {
  return '#/timeline'
}

/** The quotation diagram. docs/DESIGN.md section 7.8, docs/TASKS.md Task 15. */
export function quotationsHref(): string {
  return '#/quotations'
}

/** A book: the reading page at the last-read chapter of the book, or at chapter 1. */
export function bookHref(id: string): string {
  return `#/book/${id}`
}

/** The reading page at one chapter. With a verse, the page opens at that verse: travel uses this. */
export function chapterHref(id: string, chapter: number, verse?: number): string {
  return verse ? `#/book/${id}/${chapter}/${verse}` : `#/book/${id}/${chapter}`
}

/** The map of the places of a book. docs/DESIGN.md section 15.11, docs/TASKS.md Task 38. The line "Where" of "About this book" links to it from Task 40. */
export function mapHref(id: string): string {
  return `#/book/${id}/map`
}
