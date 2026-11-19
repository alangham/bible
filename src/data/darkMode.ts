// The dark mode switch. docs/DESIGN.md section 18.3, docs/TASKS.md Task 45 steps 5 to 8.
// The browser keeps the selection in its storage, in the form of the red letters switch in src/data/redLetters.ts.
// With no value, the mode is light: in Task 45 the site does not follow the setting of the device. One selection
// applies to each page of the site.
//
// The script in index.html reads the same key and sets the mode before the first paint. This file sets the mode
// when the reader uses the switch: the attribute data-mode="dark" on the root element, which selects the dark
// values of src/index.css and of src/data/books.ts, and the line theme-color. The two values of the line
// theme-color are in index.html, on the element itself, so that the script there and this file use one source.

import { useSyncExternalStore } from 'react'

export const DARK_MODE_KEY = 'bible-dark-mode'
/** The attribute on the root element, and its value in the dark mode. In the light mode the element has no such attribute. */
export const MODE_ATTRIBUTE = 'data-mode'
let darkOn = readDarkMode()
const listeners = new Set<() => void>()

/** On, only if the storage has the value "on". No value, or a storage that fails, gives off. */
function readDarkMode(): boolean {
  try {
    return localStorage.getItem(DARK_MODE_KEY) === 'on'
  } catch {
    return false
  }
}

/** The mode on the page: the attribute on the root element, and the line theme-color from its data-light or data-dark. */
function applyDarkMode(on: boolean) {
  const root = document.documentElement
  if (on) root.setAttribute(MODE_ATTRIBUTE, 'dark')
  else root.removeAttribute(MODE_ATTRIBUTE)
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  const content = meta?.dataset[on ? 'dark' : 'light']
  if (meta && content) meta.content = content
}

/** The selection now. */
export function getDarkMode(): boolean {
  return darkOn
}

/** A change of the switch: each color changes at once, with no new load of the page. */
export function setDarkMode(on: boolean) {
  darkOn = on
  try {
    localStorage.setItem(DARK_MODE_KEY, on ? 'on' : 'off')
  } catch {
    // The setting still holds for this page.
  }
  applyDarkMode(on)
  for (const l of listeners) l()
}

export function useDarkMode(): boolean {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => darkOn,
    () => false,
  )
}
