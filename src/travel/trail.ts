// The trail: the passages that the reader visited by travel. docs/DESIGN.md sections 4.5 and 7.7.
// It is on screen after the first travel. It lives for the browser tab (sessionStorage).

import { useSyncExternalStore } from 'react'

export interface Stop {
  book: string
  c: number
  v?: number
}

interface TrailState {
  stops: Stop[]
  /** The index of the stop that the reader is at. */
  at: number
}

const KEY = 'bible-trail'
let state: TrailState = read()
const listeners = new Set<() => void>()

function read(): TrailState {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) ?? 'null') as TrailState | null
    if (s && Array.isArray(s.stops)) return { stops: s.stops, at: Math.min(Math.max(Number(s.at) || 0, 0), s.stops.length - 1) }
  } catch {
    // No storage: the trail starts empty.
  }
  return { stops: [], at: -1 }
}

function write(next: TrailState) {
  state = next
  try {
    sessionStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // The trail still works for this page.
  }
  for (const l of listeners) l()
}

const same = (a: Stop, b: Stop) => a.book === b.book && a.c === b.c && (a.v ?? 0) === (b.v ?? 0)

/**
 * Adds a travel: from the passage here to the passage there. The stops after the current stop are
 * dropped. The passage here is a new stop if its chapter is not the chapter of the current stop.
 */
export function addTravel(from: Stop, to: Stop) {
  const stops = state.stops.slice(0, state.at + 1)
  const last = stops[stops.length - 1]
  // The passage here is a new stop, unless the reader is at it now. A travel from a different verse of
  // the same chapter adds that verse, so that "Back" opens the verse that the reader left.
  if (!last || last.book !== from.book || last.c !== from.c || (from.v !== undefined && last.v !== from.v)) stops.push(from)
  if (!same(stops[stops.length - 1], to)) stops.push(to)
  write({ stops, at: stops.length - 1 })
}

/** The reader went back to a stop of the trail. */
export function goToStop(index: number) {
  write({ ...state, at: index })
}

export function clearTrail() {
  write({ stops: [], at: -1 })
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** The trail now, for the tests. */
export function trailNow(): TrailState {
  return state
}

export function useTrail(): TrailState {
  return useSyncExternalStore(subscribe, () => state, () => state)
}
