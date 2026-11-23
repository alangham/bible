// The switch "Study notes". docs/DESIGN.md section 20.7, docs/TASKS.md Task 49 step 4.
// The browser keeps the selection in its storage with the key bible-study-notes, in the form of the dark mode switch in
// src/data/darkMode.ts. The value is "on" or "off". The site stores a value only when the reader uses the switch. With
// no stored value, or with a storage that fails, the switch is off. One selection applies to the two layouts and the
// three translations.

import { useSyncExternalStore } from 'react'

export const STUDY_NOTES_KEY = 'bible-study-notes'
let studyOn = readStudyNotes()
const listeners = new Set<() => void>()

/** On only for the stored value "on". */
function readStudyNotes(): boolean {
  try {
    return localStorage.getItem(STUDY_NOTES_KEY) === 'on'
  } catch {
    return false
  }
}

/** The selection now. */
export function getStudyNotes(): boolean {
  return studyOn
}

export function setStudyNotes(on: boolean) {
  studyOn = on
  try {
    localStorage.setItem(STUDY_NOTES_KEY, on ? 'on' : 'off')
  } catch {
    // The setting still holds for this page.
  }
  for (const l of listeners) l()
}

export function useStudyNotes(): boolean {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => studyOn,
    () => false,
  )
}
