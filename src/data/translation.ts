// The translation setting. docs/DESIGN.md section 8.5, docs/TASKS.md Task 21 step 2.
// The site keeps the selection in the storage of the browser. The first visit shows the Berean
// Standard Bible. The translation is not in the address of a page.

import { useSyncExternalStore } from 'react'

export type Translation = 'bsb' | 'kjv' | 'web'

/**
 * The three translations of the site, in the order of the translation list. docs/DESIGN.md section 13.6.
 * `line`: the line of the translation, in the translation list and on the Sources page. This is the one place in
 * the code that has the lines. docs/DESIGN.md section 14.2, docs/TASKS.md Task 33 step 3. The sources of the lines
 * are in docs/DATA-SOURCES.md.
 */
export const TRANSLATIONS: readonly { id: Translation; name: string; short: string; line: string }[] = [
  { id: 'bsb', name: 'Berean Standard Bible', short: 'BSB', line: 'Today’s English, in a literary style. A new translation.' },
  { id: 'kjv', name: 'King James Version', short: 'KJV', line: 'Older English, in the text of 1769: thee, thou, believeth.' },
  { id: 'web', name: 'World English Bible', short: 'WEB', line: 'Today’s English, in an informal, spoken style. A fairly literal translation.' },
]

export const TRANSLATION_KEY = 'bible-translation'
let current = readTranslation()
const listeners = new Set<() => void>()

function readTranslation(): Translation {
  try {
    // The stored value when it is the id of a translation of the list, and else the Berean Standard Bible.
    const stored = localStorage.getItem(TRANSLATION_KEY)
    return TRANSLATIONS.find((t) => t.id === stored)?.id ?? 'bsb'
  } catch {
    return 'bsb'
  }
}

export function getTranslation(): Translation {
  return current
}

export function setTranslation(t: Translation) {
  if (t === current) return
  current = t
  try {
    localStorage.setItem(TRANSLATION_KEY, t)
  } catch {
    // The setting still holds for this page.
  }
  for (const l of listeners) l()
}

export function useTranslation(): Translation {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => current,
    () => 'bsb',
  )
}
