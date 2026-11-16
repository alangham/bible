// The parts that the top bar of the wall and the top bar of the reading page share. docs/DESIGN.md
// sections 9.2, 9.6, and 9.7, docs/TASKS.md Task 22 steps 3, 11, and 12.
// - The links to the pages of the Reference section, in a nav with the label "Reference".
// - "Menu": in the narrow layout, the control at the right of the bar. It opens the menu panel.

import type { ReactNode, RefObject } from 'react'
import { quotationsHref, sourcesHref, timelineHref } from './router.ts'

const REFERENCE_PAGES = [
  { name: 'Timeline', href: timelineHref() },
  { name: 'Quotations', href: quotationsHref() },
  { name: 'Sources', href: sourcesHref() },
]

/** The three links to the pages of the Reference section. No link is marked as the current page. */
export function ReferenceLinks({ className, linkClassName }: { className: string; linkClassName?: string }) {
  return (
    <nav className={className} aria-label="Reference">
      {REFERENCE_PAGES.map((p) => (
        <a key={p.name} className={linkClassName} href={p.href}>
          {p.name}
        </a>
      ))}
    </nav>
  )
}

const MENU_PANEL_ID = 'menu-panel'

interface MenuButtonProps {
  open: boolean
  onToggle: () => void
  buttonRef: RefObject<HTMLButtonElement | null>
}

/** "Menu", at the right of the bar in the narrow layout. */
export function MenuButton({ open, onToggle, buttonRef }: MenuButtonProps) {
  return (
    <button type="button" ref={buttonRef} className="bar-menu" aria-expanded={open} aria-controls={MENU_PANEL_ID} onClick={onToggle}>
      Menu
    </button>
  )
}

interface MenuPanelProps {
  open: boolean
  panelRef: RefObject<HTMLDivElement | null>
  /** The rows above the links: on the reading page, the echo links switch and a line. */
  children?: ReactNode
}

/** The menu panel: a panel below the bar, with the full width. Its last rows are the three links. */
export function MenuPanel({ open, panelRef, children }: MenuPanelProps) {
  return (
    <div className="menu-panel" id={MENU_PANEL_ID} ref={panelRef} hidden={!open}>
      {children}
      <ReferenceLinks className="menu-links" linkClassName="menu-row" />
    </div>
  )
}
