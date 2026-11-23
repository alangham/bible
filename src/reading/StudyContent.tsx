// The content of an Aquifer note. docs/DESIGN.md section 20.3, point 1. Task 48 made it for "About this chapter", and
// Task 49 uses it for the blocks of notes at the verses.

import type { ReactNode } from 'react'
import type { StudyNode } from '../data/studyNotes.ts'

/**
 * The elements of a content, with no attribute: point 1 of section 20.3. React puts each string into the page as
 * text. A name that is not of point 1 makes no element. The words of a note that refer to a different note or to a
 * passage stay plain text: section 20.8.
 */
export function StudyContent({ nodes }: { nodes: readonly StudyNode[] }) {
  return <>{elements(nodes)}</>
}

function elements(nodes: readonly StudyNode[]): ReactNode[] {
  return nodes.map((node, i) => {
    if (typeof node === 'string') return node
    const [name, ...children] = node
    switch (name) {
      case 'p':
        return <p key={i}>{elements(children)}</p>
      case 'ul':
        return <ul key={i}>{elements(children)}</ul>
      case 'ol':
        return <ol key={i}>{elements(children)}</ol>
      case 'li':
        return <li key={i}>{elements(children)}</li>
      case 'em':
        return <em key={i}>{elements(children)}</em>
      case 'strong':
        return <strong key={i}>{elements(children)}</strong>
      case 'sup':
        return <sup key={i}>{elements(children)}</sup>
      case 'br':
        return <br key={i} />
      default:
        return null
    }
  })
}
