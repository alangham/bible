// Travel: the move from one passage to a linked passage. docs/DESIGN.md section 4.5.
// A page asks for a travel; TravelOverlay in App shows the move and then opens the linked passage.

import { useSyncExternalStore } from 'react'
import { addTravel, type Stop } from './trail.ts'

export interface Travel {
  from: Stop
  to: Stop
  /** Each new travel gets a new number, so that the overlay restarts. */
  n: number
}

let current: Travel | null = null
let count = 0
const listeners = new Set<() => void>()
const emit = () => {
  for (const l of listeners) l()
}

/** Starts a travel. The trail gets the two stops at once. */
export function startTravel(from: Stop, to: Stop) {
  addTravel(from, to)
  current = { from, to, n: ++count }
  emit()
}

export function endTravel() {
  current = null
  emit()
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useTravel(): Travel | null {
  return useSyncExternalStore(subscribe, () => current, () => current)
}

// ---- The echo links switch. docs/DESIGN.md section 4.5: the reader can switch echo links off. ----

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
