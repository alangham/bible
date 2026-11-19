// The dark mode switch. docs/DESIGN.md section 18.3, docs/TASKS.md Task 45 steps 5 to 8 and Task 46.
// The browser keeps the selection in its storage, in the form of the red letters switch in src/data/redLetters.ts.
// One selection applies to each page of the site.
//
// The rule of Task 46, with the key bible-dark-mode:
// - No value: the mode of the device, the media feature prefers-color-scheme. A change of the device changes the page.
// - The value "on": dark. Any other value, such as "off": light. With a value, a change of the device changes nothing.
// The site stores a value only when the reader uses the switch.
//
// The script in index.html has the same rule, and sets the mode before the first paint. This file sets the mode when
// the reader uses the switch or when the device changes: the attribute data-mode="dark" on the root element, which
// selects the dark values of src/index.css and of src/data/books.ts, and the line theme-color. The two values of the
// line theme-color are in index.html, on the element itself, so that the script there and this file use one source.

import { useSyncExternalStore } from 'react'

export const DARK_MODE_KEY = 'bible-dark-mode'
/** The attribute on the root element, and its value in the dark mode. In the light mode the element has no such attribute. */
export const MODE_ATTRIBUTE = 'data-mode'
/** The media feature of the device. */
export const DEVICE_DARK_QUERY = '(prefers-color-scheme: dark)'

/** The value that the reader selected with the switch on this page. It holds when the storage fails. */
let selected: string | null = null
let darkOn = modeOf(readStored(), deviceIsDark())
const listeners = new Set<() => void>()

/** The rule of the table of Task 46: with no value, the device; with a value, dark only for "on". */
export function modeOf(stored: string | null, deviceDark: boolean): boolean {
  return stored === null ? deviceDark : stored === 'on'
}

/** The stored value. A storage that fails gives no value. */
function readStored(): string | null {
  try {
    return localStorage.getItem(DARK_MODE_KEY)
  } catch {
    return null
  }
}

function deviceQuery(): MediaQueryList | null {
  return typeof matchMedia === 'function' ? matchMedia(DEVICE_DARK_QUERY) : null
}

function deviceIsDark(): boolean {
  return deviceQuery()?.matches ?? false
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

function notify() {
  for (const l of listeners) l()
}

/** The mode that shows now. */
export function getDarkMode(): boolean {
  return darkOn
}

/**
 * A change of the switch: each color changes at once, with no new load of the page. The switch gives the reverse of
 * the mode that shows, so the value stored is that of the new mode.
 */
export function setDarkMode(on: boolean) {
  darkOn = on
  selected = on ? 'on' : 'off'
  try {
    localStorage.setItem(DARK_MODE_KEY, selected)
  } catch {
    // The setting still holds for this page.
  }
  applyDarkMode(on)
  notify()
}

/**
 * Follow a change of the device while the page is open, when no value is stored. src/main.tsx calls this one time,
 * so that each page follows the device, also a page with no switch. It gives the function that stops it.
 */
export function followDevice(): () => void {
  const query = deviceQuery()
  if (!query) return () => {}
  const change = (event: MediaQueryListEvent) => {
    if ((selected ?? readStored()) !== null) return
    darkOn = event.matches
    applyDarkMode(darkOn)
    notify()
  }
  query.addEventListener('change', change)
  return () => query.removeEventListener('change', change)
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
