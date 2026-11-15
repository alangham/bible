// The translation setting. docs/DESIGN.md section 8.5, docs/TASKS.md Task 21 step 2.
// The site keeps the selection in the storage of the browser. The first visit shows the Berean
// Standard Bible. The translation is not in the address of a page.

import { useSyncExternalStore } from 'react'

export type Translation = 'bsb' | 'kjv'

/** The two translations of the site, in the order of the translation switch. */
export const TRANSLATIONS: readonly { id: Translation; name: string }[] = [
  { id: 'bsb', name: 'Berean Standard Bible' },
  { id: 'kjv', name: 'King James Version' },
]

export const TRANSLATION_KEY = 'bible-translation'
let current = readTranslation()
const listeners = new Set<() => void>()

function readTranslation(): Translation {
  try {
    return localStorage.getItem(TRANSLATION_KEY) === 'kjv' ? 'kjv' : 'bsb'
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
