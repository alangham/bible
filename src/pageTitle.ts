// The name of the site and the title of the browser tab. docs/DESIGN.md sections 12.1 and 12.2, docs/TASKS.md Task 28.

import { useEffect } from 'react'

/** The name of the site. The one place in the code that has it. index.html and public/manifest.webmanifest have it also. */
export const SITE_NAME = 'Bible Wall'

/**
 * The title of the browser tab: the place, then " · " with the middle dot U+00B7, then the name. With no place,
 * the name only. Example: "John 3 · Bible Wall".
 */
export function pageTitle(place?: string): string {
  return place ? `${place} · ${SITE_NAME}` : SITE_NAME
}

/**
 * Sets the title of the browser tab for a place. The title changes when the place changes. Null: this
 * component does not set the title, because a different component sets it.
 */
export function usePageTitle(place: string | undefined | null) {
  useEffect(() => {
    if (place !== null) document.title = pageTitle(place)
  }, [place])
}
