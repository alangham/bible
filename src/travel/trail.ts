// The trail: the passages that the reader visited by travel. docs/DESIGN.md section 4.5.
// It is always on screen after the first travel. It lives for the browser tab (sessionStorage).

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
 * Adds a travel: from the passage here to the passage there. If the reader went back to a stop of the
 * trail, the stops after it are dropped. Otherwise the travel goes at the end.
 */
export function addTravel(from: Stop, to: Stop) {
  const at = state.stops.findLastIndex((s) => s.book === from.book && s.c === from.c)
  const stops = at >= 0 ? state.stops.slice(0, at + 1) : [...state.stops]
  if (!stops.length || !same(stops[stops.length - 1], from)) stops.push(from)
  stops.push(to)
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

export function useTrail(): TrailState {
  return useSyncExternalStore(subscribe, () => state, () => state)
}
