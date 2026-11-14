// The one place that decides the layout. docs/DESIGN.md section 4.1.
//
// No other code tests the screen width. CSS selects on the `data-layout`
// attribute that App sets from this module. To change the rule, for example
// to a test of the input type, change only this file.

import { useSyncExternalStore } from 'react'

export type ScreenLayout = 'wide' | 'narrow'

/** Below this width in CSS px, the layout is narrow. */
export const NARROW_LIMIT_PX = 768

/**
 * Decides the layout.
 * - wide, 768 px or more: five stacks in one view, as in mockup D1. Spines can be thinner than 44 px.
 * - narrow, below 768 px: one stack at a time with spines of 44 px or more. Task 9 builds it.
 */
export function selectLayout(viewportWidthPx: number): ScreenLayout {
  return viewportWidthPx >= NARROW_LIMIT_PX ? 'wide' : 'narrow'
}

function subscribe(onChange: () => void) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

/** The layout for the current window. It changes when the window changes size. */
export function useScreenLayout(): ScreenLayout {
  return useSyncExternalStore(
    subscribe,
    () => selectLayout(window.innerWidth),
    () => 'wide',
  )
}
