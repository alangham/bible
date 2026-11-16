// The keys of an open panel of a top bar: the focus goes into the panel, and Escape closes it.
// docs/DESIGN.md section 9.7, docs/TASKS.md Task 22 step 12.

import { useEffect, type RefObject } from 'react'

/**
 * The keys of an open panel. When the panel opens, the focus goes to the first element that `focus`
 * selects in it. The Escape key calls `onEscape`, which closes the panel and gives the focus back.
 */
export function usePanelKeys(open: boolean, panelRef: RefObject<HTMLElement | null>, focus: string, onEscape: () => void) {
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>(focus)?.focus()
  }, [open, panelRef, focus])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      onEscape()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onEscape])
}
