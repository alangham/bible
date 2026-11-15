// The one place that decides the layout. docs/DESIGN.md section 4.1.
//
// No other code tests the screen width. CSS selects on the `data-layout`
// attribute that App sets from this module. To change the rule, for example
// to a test of the input type, change only this file.

import { useSyncExternalStore } from 'react'

export type ScreenLayout = 'wide' | 'narrow'

/** Below this width in CSS px, the layout is narrow. */
export const NARROW_LIMIT_PX = 900

/**
 * Decides the layout.
 * - wide, 900 px or more: the wide layout of each page, docs/DESIGN.md section 7.4 and 7.8.
 *   POLISH.md item 5 moved the limit from 768 px.
 * - narrow, below 900 px: the narrow layout of each page.
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

/**
 * From this width in CSS px, the reading page shows the links as labels in the right margin, and the
 * text has no marks. Below it, the marks are in the text. docs/DESIGN.md section 7.7: a value of the designer.
 */
export const MARGIN_LABELS_PX = 1180

export function selectMarginLabels(viewportWidthPx: number): boolean {
  return viewportWidthPx >= MARGIN_LABELS_PX
}

/** True when the links show as labels in the right margin. It changes when the window changes size. */
export function useMarginLabels(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => selectMarginLabels(window.innerWidth),
    () => true,
  )
}
