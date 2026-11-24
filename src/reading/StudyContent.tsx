// The content of an Aquifer note. docs/DESIGN.md section 20.3, point 1. Task 48 made it for "About this chapter", and
// Task 49 uses it for the blocks of notes at the verses. Task 55 adds the links of section 22: a passage link and a
// note link.

import { Fragment, useContext, type CSSProperties, type ReactNode } from 'react'
import { plainClick } from '../book/links.ts'
import { groupOf, groupVar } from '../data/books.ts'
import { childNodes, type StudyNode, type StudyNoteRef, type StudyRef } from '../data/studyNotes.ts'
import { chapterHref } from '../router.ts'
import { StudyLinkContext, type StudyLinkFrom, type StudyLinks } from './studyLinks.ts'

interface StudyContentProps {
  nodes: readonly StudyNode[]
  /**
   * The note of the content, for its links. With no note, the words of each link are plain text: a note in a pop-up,
   * section 22.8. A pop-up does not open a second pop-up.
   */
  from?: StudyLinkFrom
}

/**
 * The elements of a content, with no attribute: point 1 of section 20.3. React puts each string into the page as
 * text. A name that is not of point 1 or of section 22.5 makes no element. The words of a link are its nodes, with no
 * change: section 22.3, rule 5.
 */
export function StudyContent({ nodes, from }: StudyContentProps) {
  const links = useContext(StudyLinkContext)
  return <>{elements(nodes, from ? { from, links } : null)}</>
}

interface LinkPlace {
  from: StudyLinkFrom
  links: StudyLinks | null
}

function elements(nodes: readonly StudyNode[], place: LinkPlace | null): ReactNode[] {
  return nodes.map((node, i) => {
    if (typeof node === 'string') return node
    const children = elements(childNodes(node), place)
    switch (node[0]) {
      case 'p':
        return <p key={i}>{children}</p>
      case 'ul':
        return <ul key={i}>{children}</ul>
      case 'ol':
        return <ol key={i}>{children}</ol>
      case 'li':
        return <li key={i}>{children}</li>
      case 'em':
        return <em key={i}>{children}</em>
      case 'strong':
        return <strong key={i}>{children}</strong>
      case 'sup':
        return <sup key={i}>{children}</sup>
      case 'br':
        return <br key={i} />
      case 'ref':
        return place ? (
          <PassageLink key={i} link={node[1]} place={place}>
            {children}
          </PassageLink>
        ) : (
          <Fragment key={i}>{children}</Fragment>
        )
      case 'note':
        return place ? (
          <NoteLink key={i} link={node[1]} place={place}>
            {children}
          </NoteLink>
        ) : (
          <Fragment key={i}>{children}</Fragment>
        )
      default:
        return null
    }
  })
}

interface StudyLinkProps {
  place: LinkPlace
  children: ReactNode
}

/**
 * The look of section 22.6: the color of the group of the book of the link, as a color name. The link has no
 * `aria-label`: its name is its words.
 */
function colorOf(links: StudyLinks | null, book: string): CSSProperties | undefined {
  const b = links?.books.find((x) => x.id === book)
  return b ? ({ '--d': groupVar(groupOf(b)) } as CSSProperties) : undefined
}

/** A passage link. Its href is the first verse of the passage. */
function PassageLink({ link, place, children }: StudyLinkProps & { link: StudyRef }) {
  const { from, links } = place
  return (
    <a
      className="rd-study-ref"
      href={chapterHref(link.b, link.c, link.v)}
      aria-haspopup="dialog"
      style={colorOf(links, link.b)}
      onClick={(e) => {
        // A plain click or the Enter key opens the pop-up. A click with a modifier key follows the href.
        if (!links || !plainClick(e)) return
        e.preventDefault()
        links.open({ kind: 'ref', ref: link, from }, e.currentTarget)
      }}
    >
      {children}
    </a>
  )
}

/** A note link. Its href is the first verse of the range of the note: docs/DESIGN.md section 22.11. */
function NoteLink({ link, place, children }: StudyLinkProps & { link: StudyNoteRef }) {
  const { from, links } = place
  return (
    <a
      className="rd-study-ref"
      href={chapterHref(link.b, link.c, link.v)}
      aria-haspopup="dialog"
      style={colorOf(links, link.b)}
      onClick={(e) => {
        if (!links || !plainClick(e)) return
        e.preventDefault()
        links.open({ kind: 'note', note: link, from }, e.currentTarget)
      }}
    >
      {children}
    </a>
  )
}
