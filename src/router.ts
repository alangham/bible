// Hash routes, because GitHub Pages has no rewrite rules.

import { useSyncExternalStore } from 'react'

export type Route = { page: 'table' } | { page: 'book'; id: string }

export function parseRoute(hash: string): Route {
  const match = /^#\/book\/([a-z0-9-]+)\/?$/.exec(hash)
  if (match) return { page: 'book', id: match[1] }
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

export function bookHref(id: string): string {
  return `#/book/${id}`
}
