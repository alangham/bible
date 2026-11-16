// The red letters switch. docs/DESIGN.md section 11.5, docs/TASKS.md Task 27 step 2.
// The red letters are the words of the words-of-Jesus marks, the items `j` of the site data. The reader
// switches them on and off. The first visit has red letters on. The browser keeps the selection in its
// storage, with the form of the echo links switch in src/travel/travel.ts. One selection applies to the
// two layouts and the two translations.

import { useSyncExternalStore } from 'react'

export const RED_LETTERS_KEY = 'bible-red-letters'
let redOn = readRedLetters()
const listeners = new Set<() => void>()

/** On, unless the storage has the value "off". A storage that fails gives on. */
function readRedLetters(): boolean {
  try {
    return localStorage.getItem(RED_LETTERS_KEY) !== 'off'
  } catch {
    return true
  }
}

/** The selection now. */
export function getRedLetters(): boolean {
  return redOn
}

export function setRedLetters(on: boolean) {
  redOn = on
  try {
    localStorage.setItem(RED_LETTERS_KEY, on ? 'on' : 'off')
  } catch {
    // The setting still holds for this page.
  }
  for (const l of listeners) l()
}

export function useRedLetters(): boolean {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => redOn,
    () => true,
  )
}
