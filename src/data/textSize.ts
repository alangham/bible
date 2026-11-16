// The text size setting. docs/DESIGN.md section 10, docs/TASKS.md Task 24 step 2.
// The site keeps the selection in the storage of the browser. The first visit shows "Standard". One
// selection applies to the two layouts. The text size is not in the address of a page. The sizes in
// px are in src/index.css, on `.reading[data-text-size]`.

import { useSyncExternalStore } from 'react'

export type TextSize = 'standard' | 'large' | 'largest'

/** The three text sizes, in the order of the text size list. */
export const TEXT_SIZES: readonly { id: TextSize; name: string }[] = [
  { id: 'standard', name: 'Standard' },
  { id: 'large', name: 'Large' },
  { id: 'largest', name: 'Largest' },
]

export const TEXT_SIZE_KEY = 'bible-text-size'
let current = readTextSize()
const listeners = new Set<() => void>()

function readTextSize(): TextSize {
  try {
    const stored = localStorage.getItem(TEXT_SIZE_KEY)
    return TEXT_SIZES.find((s) => s.id === stored)?.id ?? 'standard'
  } catch {
    return 'standard'
  }
}

export function getTextSize(): TextSize {
  return current
}

export function setTextSize(size: TextSize) {
  if (size === current) return
  current = size
  try {
    localStorage.setItem(TEXT_SIZE_KEY, size)
  } catch {
    // The setting still holds for this page.
  }
  for (const l of listeners) l()
}

export function useTextSize(): TextSize {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => current,
    () => 'standard',
  )
}
