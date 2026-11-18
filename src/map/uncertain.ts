// The switch for the places that are not certain. docs/DESIGN.md section 15.11, docs/TASKS.md Task 39b.
// The first state is on: the places show. The browser keeps the state in its storage, with the form of the red
// letters switch in src/data/redLetters.ts. One state applies to each book.

import { useSyncExternalStore } from 'react'

export const MAP_UNCERTAIN_KEY = 'bible-map-uncertain'
let uncertainOn = readUncertain()
const listeners = new Set<() => void>()

/** On, unless the storage has the value "off". A storage that fails gives on. */
function readUncertain(): boolean {
  try {
    return localStorage.getItem(MAP_UNCERTAIN_KEY) !== 'off'
  } catch {
    return true
  }
}

export function setMapUncertain(on: boolean) {
  uncertainOn = on
  try {
    localStorage.setItem(MAP_UNCERTAIN_KEY, on ? 'on' : 'off')
  } catch {
    // The setting still holds for this page.
  }
  for (const l of listeners) l()
}

export function useMapUncertain(): boolean {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => uncertainOn,
    () => true,
  )
}
