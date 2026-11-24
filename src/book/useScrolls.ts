// The scroll of an area of a pop-up: the text area of src/book/LinkPopup.tsx, and the note area of src/book/StudyPopup.tsx.

import { useLayoutEffect, useState, type RefObject } from 'react'

/**
 * True when the area does not show all of its content and scrolls. Measured again when its size changes, for example
 * when the fonts load. `key` changes when the content changes.
 */
export function useScrolls(area: RefObject<HTMLElement | null>, key: unknown): boolean {
  const [scrolls, setScrolls] = useState(false)
  useLayoutEffect(() => {
    const el = area.current
    if (!el) return
    const measure = () => setScrolls(el.scrollHeight > el.clientHeight + 1)
    measure()
    // Measured again when the size changes, for example when the fonts load.
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [area, key])
  return scrolls
}
