// The pop-up of one link. docs/DESIGN.md sections 4.5 and 7.7. It shows the band of the linked group,
// the reference in capitals, the type of link and the passage that it comes from, the text of the
// linked passage, the reason line of a quotation link, the source, and "Go there" and "Stay here".
// In the wide layout it opens near the control. In the narrow layout it opens from the bottom.
// The text of the linked passage is in the selected translation. docs/DESIGN.md section 8.4.

import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { groupOf, type Book } from '../data/books.ts'
import type { LinkEnd } from '../data/links.ts'
import { passageName, passageVerses, type PassageRange } from '../data/passage.ts'
import { loadBookText, type BookText } from '../data/text.ts'
import { useTranslation } from '../data/translation.ts'
import type { LineReference } from '../data/xrefs.ts'
import { chapterHref } from '../router.ts'
import type { ScreenLayout } from '../screenLayout.ts'
import { bandLabel } from '../wall/layout.ts'
import { plainClick } from './links.ts'

const SOURCE_LINE: Record<string, string> = {
  'Bible Quotation Database': 'From the Bible Quotation Database.',
  'OpenBible.info': 'From the cross-references of OpenBible.info.',
  'Berean Standard Bible': 'From the cross-references of the Berean Standard Bible.',
}

/** The width of the pop-up in the wide layout, in px. The value of the prototype. */
const WIDTH_PX = 430

interface LinkPopupProps {
  books: Book[]
  end: LinkEnd
  /**
   * For a control in the cross-reference line of the publisher: the reference as the line gives it,
   * and the passage that it names. Arthur decided this on 2026-11-14.
   */
  reference?: LineReference
  /** The control that opened the pop-up, to place it and to give the focus back. */
  anchor: HTMLElement
  layout: ScreenLayout
  onGo: (end: LinkEnd) => void
  onClose: () => void
}

/**
 * The text of the linked passage. The built rule: each verse of the passage, also a verse that is not
 * in the main text. The text area has a maximum height. A long passage scrolls inside it, and then the
 * area takes the keyboard focus, so that the keyboard can scroll it.
 */
function LinkedText({ books, passage, name }: { books: Book[]; passage: PassageRange; name: string }) {
  const translation = useTranslation()
  const [text, setText] = useState<BookText | null>(null)
  const [failed, setFailed] = useState(false)
  const [scrolls, setScrolls] = useState(false)
  const area = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    let live = true
    loadBookText(passage.book, translation).then(
      (t) => live && setText(t),
      () => live && setFailed(true),
    )
    return () => {
      live = false
    }
  }, [passage.book, translation])
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
  }, [text])
  if (failed) return <p className="pop-text">The text did not load.</p>
  if (!text) return <p className="pop-text">…</p>
  const verses = passageVerses(text, passage)
  return (
    <p ref={area} className="pop-text" lang="en" {...(scrolls ? { tabIndex: 0, role: 'region', 'aria-label': `Text of ${name}` } : {})}>
      {verses.map((v) => (
        <span key={`${v.c}:${v.v}`} className={v.omitted ? 'pop-omitted' : undefined}>
          <sup className="pop-vn">{v.v}</sup>
          {/* The added words of the King James Version, in italics. docs/DESIGN.md section 8.2. */}
          {v.parts.map((part, i) =>
            part.a ? (
              <i key={i} className="added">
                {part.t}
              </i>
            ) : (
              <Fragment key={i}>{part.t}</Fragment>
            ),
          )}{' '}
        </span>
      ))}
      <span className="sr-only">
        ({passageName(books, passage)}, {text.translation})
      </span>
    </p>
  )
}

export function LinkPopup({ books, end, reference, anchor, layout, onGo, onClose }: LinkPopupProps) {
  const box = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [pos, setPos] = useState<{ left: number; top: number; maxHeight: number } | null>(null)
  const there = books.find((b) => b.id === end.there.book)
  const quotation = end.link.type === 'quotation'
  const translation = useTranslation()

  // Wide layout: under the control, or above it when there is more space above. It follows the control.
  useLayoutEffect(() => {
    if (layout !== 'wide') return
    const place = () => {
      if (!anchor.isConnected) {
        onClose()
        return
      }
      const r = anchor.getBoundingClientRect()
      const screen = document.documentElement
      const width = Math.min(WIDTH_PX, screen.clientWidth - 32)
      const left = Math.max(16, Math.min(r.left - 24, screen.clientWidth - width - 16))
      const below = screen.clientHeight - r.bottom - 16
      const above = r.top - 16
      const down = below >= 320 || below >= above
      const maxHeight = Math.max(200, Math.min(600, down ? below : above))
      const height = Math.min(box.current?.offsetHeight ?? maxHeight, maxHeight)
      setPos({ left, top: down ? r.bottom + 8 : r.top - 8 - height, maxHeight })
    }
    place()
    // A second time when the text of the passage changes the height of the pop-up.
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place)
    if (box.current) observer?.observe(box.current)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [anchor, onClose, layout])

  // The focus goes to "Go there" when the pop-up is visible. In the wide layout, the pop-up is hidden
  // until its first placement, and a hidden element cannot take the focus.
  const visible = layout !== 'wide' || pos !== null
  const focused = useRef(false)
  useEffect(() => {
    if (!visible || focused.current) return
    focused.current = true
    box.current?.querySelector<HTMLElement>('.pop-go')?.focus({ preventScroll: true })
  }, [visible])

  // Escape closes the pop-up, and the focus goes back to the control. In the narrow layout, the pop-up
  // covers the page with a shade, so the Tab key keeps the focus in the pop-up.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || layout !== 'narrow' || !box.current) return
      const controls = [...box.current.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])')]
      if (!controls.length) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      const at = document.activeElement
      if (e.shiftKey ? at === first || !box.current.contains(at) : at === last || !box.current.contains(at)) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (box.current && !box.current.contains(t) && !anchor.contains(t)) onClose()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
      if (anchor.isConnected) anchor.focus({ preventScroll: true })
    }
  }, [anchor, onClose, layout])

  const style = { '--d': there ? groupOf(there).color : undefined } as CSSProperties
  if (layout === 'wide') {
    if (pos) Object.assign(style, { left: pos.left, top: pos.top, maxHeight: pos.maxHeight })
    else style.visibility = 'hidden'
  }

  return (
    <>
      {layout === 'narrow' && <div className="pop-shade" aria-hidden="true" />}
      <div ref={box} className="pop" data-layout={layout} role="dialog" aria-modal={layout === 'narrow' ? true : undefined} aria-labelledby={titleId} style={style}>
        {there && <p className="pop-band">{bandLabel(there.group)}</p>}
        <h2 className="pop-ref" id={titleId}>
          {reference?.shown ?? passageName(books, end.there)}
        </h2>
        <p className="pop-kind">
          {quotation ? 'Quotation link' : 'Echo link'} from {passageName(books, end.here)}
        </p>
        {end.there.heading && <p className="pop-heading">{end.there.heading}</p>}
        {reference?.firstVerse && <p className="pop-first">First verse</p>}
        <LinkedText books={books} passage={reference?.passage ?? end.there} name={reference?.shown ?? passageName(books, end.there)} />
        {end.link.reason && <p className="pop-reason">{end.link.reason}</p>}
        {/* The reason line quotes the Berean Standard Bible. docs/DESIGN.md section 8.4. */}
        {quotation && translation === 'kjv' && <p className="pop-quoted-from">The quoted words are from the Berean Standard Bible.</p>}
        <p className="pop-source">{SOURCE_LINE[end.link.source]}</p>
        <div className="pop-actions">
          <a
            className="pop-go"
            href={chapterHref(end.there.book, end.there.c, end.there.v)}
            onClick={(e) => {
              if (!plainClick(e)) return
              e.preventDefault()
              onGo(end)
            }}
          >
            Go there
          </a>
          <button type="button" className="pop-stay" onClick={onClose}>
            Stay here
          </button>
        </div>
      </div>
    </>
  )
}
