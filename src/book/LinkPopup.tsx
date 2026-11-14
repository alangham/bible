// The pop-up of a mark: the reference and the text of each linked passage, the reason line of a
// quotation link, "Go there", and "Stay here". Quotation links first. docs/DESIGN.md section 4.5.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Book } from '../data/books.ts'
import type { LinkEnd } from '../data/links.ts'
import { passageName, passageVerses } from '../data/passage.ts'
import { loadBookText, type BookText } from '../data/text.ts'
import { chapterHref } from '../router.ts'
import { plainClick } from './links.ts'

const SOURCE_LINE: Record<string, string> = {
  'Bible Quotation Database': 'From the Bible Quotation Database.',
  'OpenBible.info': 'From the cross-references of OpenBible.info.',
  'Berean Standard Bible': 'From the cross-references of the Berean Standard Bible.',
}

interface LinkPopupProps {
  books: Book[]
  /** What the mark is on, for the label: "Hebrews 9:20" or a section heading. */
  title: string
  ends: LinkEnd[]
  /** The mark, to place the pop-up and to give focus back. */
  anchor: HTMLElement
  onGo: (end: LinkEnd) => void
  onClose: () => void
}

function LinkedText({ books, end }: { books: Book[]; end: LinkEnd }) {
  const [text, setText] = useState<BookText | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let live = true
    loadBookText(end.there.book).then(
      (t) => live && setText(t),
      () => live && setFailed(true),
    )
    return () => {
      live = false
    }
  }, [end.there.book])
  if (failed) return <p className="link-text">The text did not load.</p>
  if (!text) return <p className="link-text">…</p>
  const verses = passageVerses(text, end.there)
  return (
    <p className="link-text" lang="en">
      {verses.map((v) => (
        <span key={`${v.c}:${v.v}`} className={v.omitted ? 'link-omitted' : undefined}>
          <sup className="vn">{v.v}</sup>
          {v.text}{' '}
        </span>
      ))}
      <span className="sr-only">({passageName(books, end.there)}, Berean Standard Bible)</span>
    </p>
  )
}

export function LinkPopup({ books, title, ends, anchor, onGo, onClose }: LinkPopupProps) {
  const box = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; top: number; maxHeight: number } | null>(null)

  // Place the pop-up under the mark, inside the window. It follows the mark when the text scrolls.
  useLayoutEffect(() => {
    const place = () => {
      // The mark is gone, for example after a turn: the pop-up closes.
      if (!anchor.isConnected) {
        onClose()
        return
      }
      const r = anchor.getBoundingClientRect()
      const width = Math.min(440, document.documentElement.clientWidth - 24)
      const left = Math.max(12, Math.min(r.left - 24, document.documentElement.clientWidth - width - 12))
      const below = document.documentElement.clientHeight - r.bottom - 16
      const above = r.top - 16
      const top = below >= 260 || below >= above ? r.bottom + 8 : Math.max(12, r.top - 8 - Math.min(520, above))
      setPos({ left, top, maxHeight: Math.max(200, Math.min(520, below >= 260 || below >= above ? below : above)) })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [anchor, onClose])

  // Focus moves into the pop-up. Escape closes it, and focus goes back to the mark.
  useEffect(() => {
    box.current?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node) && e.target !== anchor) onClose()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
      if (anchor.isConnected) anchor.focus()
    }
  }, [anchor, onClose])

  return (
    <div
      ref={box}
      className="link-popup"
      role="dialog"
      aria-label={`Links of ${title}`}
      style={pos ? { left: pos.left, top: pos.top, maxHeight: pos.maxHeight } : { visibility: 'hidden' }}
      // The arrow keys turn the page; inside the pop-up they do nothing.
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopPropagation()
      }}
    >
      <p className="link-popup-title">{title}</p>
      {ends.map((end) => (
        <section key={`${end.link.id}:${end.there.v}`} className="link-item" data-type={end.link.type}>
          <h3>
            {passageName(books, end.there)} <span className="link-kind">{end.link.type === 'quotation' ? 'Quotation link' : 'Echo link'}</span>
          </h3>
          <LinkedText books={books} end={end} />
          {end.link.reason && <p className="link-reason">{end.link.reason}</p>}
          <p className="link-source">{SOURCE_LINE[end.link.source]}</p>
          <a
            className="link-go"
            href={chapterHref(end.there.book, end.there.c, end.there.v)}
            onClick={(e) => {
              if (!plainClick(e)) return
              e.preventDefault()
              onGo(end)
            }}
          >
            Go there
          </a>
        </section>
      ))}
      <button type="button" className="link-stay" onClick={onClose}>
        Stay here
      </button>
    </div>
  )
}
