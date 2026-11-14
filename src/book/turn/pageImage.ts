// The picture of one page, for the two faces of the turning page: the scene half, the
// shade at the spine, and for a right page the veil and the text as the page shows them.

import { drawScene } from '../../scene/sceneSvg.ts'
import type { SceneValues } from '../../scene/values.ts'

/** The shade of the paper at the spine, as a part of the page width. The CSS uses the same values. */
export const GUTTER = { width: 0.06, alpha: 0.2 }

export interface PageImageOptions {
  /** Width and height of the page in CSS px. */
  width: number
  height: number
  values: SceneValues
  half: 'left' | 'right'
  /** Move of each layer up, in scene units. */
  parallax?: number[]
  /** The text element on this page, if the page has text. It is drawn as it shows on screen. */
  text?: HTMLElement | null
  /** The page element, to place the text. */
  page?: HTMLElement | null
  /** Draw the picture from right to left: for a face that the curl shows mirrored. */
  mirror: boolean
}

function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`
}

/** Draws the text of an element word by word, at the place of each word on screen. */
function drawText(ctx: CanvasRenderingContext2D, root: HTMLElement, origin: DOMRect) {
  const clip = root.getBoundingClientRect()
  ctx.save()
  ctx.beginPath()
  ctx.rect(clip.left - origin.left, clip.top - origin.top, clip.width, clip.height)
  ctx.clip()
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue ?? ''
    if (!text.trim() || !node.parentElement) continue
    const cs = getComputedStyle(node.parentElement)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue
    const caps = cs.fontVariantCaps === 'small-caps' ? 'small-caps ' : ''
    ctx.font = `${cs.fontStyle} ${caps}${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    ctx.fillStyle = cs.color
    if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing
    const upper = cs.textTransform === 'uppercase'
    for (const m of text.matchAll(/\S+/g)) {
      range.setStart(node, m.index)
      range.setEnd(node, m.index + m[0].length)
      const r = range.getClientRects()[0]
      if (!r || r.bottom < clip.top || r.top > clip.bottom) continue
      const word = upper ? m[0].toUpperCase() : m[0]
      const metrics = ctx.measureText(word)
      const ascent = metrics.fontBoundingBoxAscent
      const y = r.top - origin.top + (r.height - (ascent + metrics.fontBoundingBoxDescent)) / 2 + ascent
      ctx.fillText(word, r.left - origin.left, y)
    }
  }
  ctx.restore()
}

/** A canvas with the picture of one page, at the device pixel ratio (2 at most). */
export async function pageImage(o: PageImageOptions): Promise<HTMLCanvasElement> {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const w = Math.round(o.width * dpr)
  const h = Math.round(o.height * dpr)
  const flat = document.createElement('canvas')
  flat.width = w
  flat.height = h
  const ctx = flat.getContext('2d')!
  await drawScene(ctx, o.values, o.half, w, h, o.parallax)

  // The shade at the spine: the right edge of a left page, the left edge of a right page.
  const g = o.half === 'left' ? ctx.createLinearGradient(w, 0, w * (1 - GUTTER.width), 0) : ctx.createLinearGradient(0, 0, w * GUTTER.width, 0)
  g.addColorStop(0, `rgba(40,25,10,${GUTTER.alpha})`)
  g.addColorStop(1, 'rgba(40,25,10,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  if (o.text && o.page) {
    const origin = o.page.getBoundingClientRect()
    const box = o.text.getBoundingClientRect()
    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.fillStyle = hexToRgba(o.values.text.veil, o.values.text.veilAlpha)
    ctx.fillRect(box.left - origin.left, box.top - origin.top, box.width, box.height)
    drawText(ctx, o.text, origin)
    ctx.restore()
  }

  if (!o.mirror) return flat
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const octx = out.getContext('2d')!
  octx.translate(w, 0)
  octx.scale(-1, 1)
  octx.drawImage(flat, 0, 0)
  return out
}
