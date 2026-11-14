// Hash routes, because GitHub Pages has no rewrite rules.

import { useSyncExternalStore } from 'react'

export type Route =
  | { page: 'table' }
  | { page: 'book'; id: string }
  | { page: 'spread'; id: string; chapter: number }

export function parseRoute(hash: string): Route {
  const book = /^#\/book\/([a-z0-9-]+)\/?$/.exec(hash)
  if (book) return { page: 'book', id: book[1] }
  const spread = /^#\/book\/([a-z0-9-]+)\/([1-9][0-9]*)\/?$/.exec(hash)
  if (spread) return { page: 'spread', id: spread[1], chapter: Number(spread[2]) }
  return { page: 'table' }
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

/** The cover of a book. */
export function bookHref(id: string): string {
  return `#/book/${id}`
}

/** The spread of one chapter. */
export function chapterHref(id: string, chapter: number): string {
  return `#/book/${id}/${chapter}`
}
