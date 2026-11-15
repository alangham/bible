// Hash routes, because GitHub Pages has no rewrite rules.

import { useSyncExternalStore } from 'react'

export type Route =
  | { page: 'wall' }
  | { page: 'book'; id: string }
  | { page: 'spread'; id: string; chapter: number; verse?: number }
  | { page: 'sources' }
  | { page: 'timeline' }

export function parseRoute(hash: string): Route {
  if (/^#\/sources\/?$/.test(hash)) return { page: 'sources' }
  if (/^#\/timeline\/?$/.test(hash)) return { page: 'timeline' }
  const book = /^#\/book\/([a-z0-9-]+)\/?$/.exec(hash)
  if (book) return { page: 'book', id: book[1] }
  const spread = /^#\/book\/([a-z0-9-]+)\/([1-9][0-9]*)(?:\/([1-9][0-9]*))?\/?$/.exec(hash)
  if (spread) {
    const route: Route = { page: 'spread', id: spread[1], chapter: Number(spread[2]) }
    if (spread[3]) route.verse = Number(spread[3])
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

/** A book: the cover until Task 13 builds the reading page. */
export function bookHref(id: string): string {
  return `#/book/${id}`
}

/** The spread of one chapter. With a verse, the spread opens at that verse: travel uses this. */
export function chapterHref(id: string, chapter: number, verse?: number): string {
  return verse ? `#/book/${id}/${chapter}/${verse}` : `#/book/${id}/${chapter}`
}
