// The echo links switch. docs/DESIGN.md sections 4.5 and 7.7: the reader can switch echo links off.
// The selection is kept in the storage of the browser. Task 14 removed the move of travel: travel is
// now a direct change of the address, in src/reading/ReadingPage.tsx.

import { useSyncExternalStore } from 'react'

const ECHO_KEY = 'bible-echo-links'
let echoOn = readEcho()
const echoListeners = new Set<() => void>()

function readEcho(): boolean {
  try {
    return localStorage.getItem(ECHO_KEY) !== 'off'
  } catch {
    return true
  }
}

export function setEchoLinks(on: boolean) {
  echoOn = on
  try {
    localStorage.setItem(ECHO_KEY, on ? 'on' : 'off')
  } catch {
    // The setting still holds for this page.
  }
  for (const l of echoListeners) l()
}

export function useEchoLinks(): boolean {
  return useSyncExternalStore(
    (fn) => {
      echoListeners.add(fn)
      return () => echoListeners.delete(fn)
    },
    () => echoOn,
    () => true,
  )
}
