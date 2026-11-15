// The top bar of the Reference pages. docs/DESIGN.md section 7.8, docs/TASKS.md Task 15 step 3.
// "Books" goes back to the wall. The links "Timeline", "Quotations", and "Sources" open the three
// pages. The link of the current page has an underline.

import { quotationsHref, sourcesHref, timelineHref } from '../router.ts'

export type ReferencePage = 'timeline' | 'quotations' | 'sources'

const PAGES: { page: ReferencePage; name: string; href: string }[] = [
  { page: 'timeline', name: 'Timeline', href: timelineHref() },
  { page: 'quotations', name: 'Quotations', href: quotationsHref() },
  { page: 'sources', name: 'Sources', href: sourcesHref() },
]

export function RefBar({ current }: { current: ReferencePage }) {
  return (
    <header className="ref-bar">
      <a className="ref-books" href="#/">
        <span aria-hidden="true">‹ </span>Books
      </a>
      <nav className="ref-tabs" aria-label="Reference">
        {PAGES.map((p) => (
          <a key={p.page} href={p.href} aria-current={p.page === current ? 'page' : undefined}>
            {p.name}
          </a>
        ))}
      </nav>
    </header>
  )
}
