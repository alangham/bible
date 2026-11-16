// The trail: the passages that the reader visited by travel. docs/DESIGN.md sections 4.5 and 7.7.
// It is on screen after the first travel. It lives for the browser tab (sessionStorage).
// The last stop is the current stop. A selected stop removes the stops after it. The wall clears the trail.

import { useSyncExternalStore } from 'react'

export interface Stop {
  book: string
  c: number
  v?: number
}

interface TrailState {
  /** The stops in the order of the travel. The last stop is the current stop. */
  stops: Stop[]
}

const KEY = 'bible-trail'
let state: TrailState = read()
const listeners = new Set<() => void>()

function read(): TrailState {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) ?? 'null') as { stops?: unknown; at?: unknown } | null
    if (s && Array.isArray(s.stops)) {
      const stops = s.stops as Stop[]
      // A trail of the old form has the field "at", the index of the current stop. The stops after it are not shown.
      if (s.at !== undefined) {
        const at = Math.min(Math.max(Math.trunc(Number(s.at)) || 0, 0), stops.length - 1)
        return { stops: stops.slice(0, at + 1) }
      }
      return { stops }
    }
  } catch {
    // No storage: the trail starts empty.
  }
  return { stops: [] }
}

function write(next: TrailState) {
  state = next
  try {
    if (next.stops.length) sessionStorage.setItem(KEY, JSON.stringify(next))
    else sessionStorage.removeItem(KEY)
  } catch {
    // The trail still works for this page.
  }
  for (const l of listeners) l()
}

const same = (a: Stop, b: Stop) => a.book === b.book && a.c === b.c && (a.v ?? 0) === (b.v ?? 0)

/**
 * Adds a travel: from the passage here to the passage there. The passage here is a new stop if its
 * chapter is not the chapter of the last stop.
 */
export function addTravel(from: Stop, to: Stop) {
  const stops = state.stops.slice()
  const last = stops[stops.length - 1]
  // The passage here is a new stop, unless the reader is at it now. A travel from a different verse of
  // the same chapter adds that verse, so that "Back" opens the verse that the reader left.
  if (!last || last.book !== from.book || last.c !== from.c || (from.v !== undefined && last.v !== from.v)) stops.push(from)
  if (!same(stops[stops.length - 1], to)) stops.push(to)
  write({ stops })
}

/** The reader selected a stop of the trail, or "Back". The stops after that stop are removed. */
export function goToStop(index: number) {
  if (index < 0 || index >= state.stops.length) return
  if (index === state.stops.length - 1) return
  write({ stops: state.stops.slice(0, index + 1) })
}

/** The wall opened. The trail has no stop, and the storage of the browser tab has no stop. */
export function clearTrail() {
  if (state.stops.length) {
    write({ stops: [] })
    return
  }
  // No stop on screen. The storage can still hold a trail that did not read, so it is removed also.
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // No storage.
  }
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
