// Draws the front of the closed book. Mockup D2: cloth color, gold frame,
// group name, an arch and a rule, the book name, and the number of chapters.

import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Group } from '../data/books.ts'
import { COVER_LABEL_FONT, COVER_TITLE_FONT, coverInk } from './coverInk.ts'

/** Texture pixels for each mockup px. */
const SCALE = 3

/**
 * @param widthPx width of the front in mockup px
 * @param heightPx height of the front in mockup px
 */
export function makeCoverTexture(name: string, chapters: number, group: Group, widthPx: number, heightPx: number) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(widthPx * SCALE)
  canvas.height = Math.round(heightPx * SCALE)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas is not available')
  ctx.scale(SCALE, SCALE)
  const ink = coverInk(group)

  ctx.fillStyle = group.cloth
  ctx.fillRect(0, 0, widthPx, heightPx)

  // Frame: 2 px line, 18 px inside the edge (mockup D2).
  const inset = 18
  ctx.strokeStyle = ink
  ctx.lineWidth = 2
  ctx.strokeRect(inset + 1, inset + 1, widthPx - 2 * inset - 2, heightPx - 2 * inset - 2)

  ctx.fillStyle = ink
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const cx = widthPx / 2

  // Group name at the top, number of chapters at the bottom. Each fits inside the frame.
  const labelMaxW = widthPx - 2 * inset - 16
  const fitLabel = (text: string, spacing: number) => {
    let size = 0.04 * heightPx
    do {
      ctx.font = `600 ${size}px ${COVER_LABEL_FONT}`
      ctx.letterSpacing = `${spacing * size}px`
      size -= 0.5
    } while (ctx.measureText(text).width > labelMaxW && size > 6)
  }
  const groupLabel = group.name.toUpperCase()
  fitLabel(groupLabel, 0.2)
  ctx.fillText(groupLabel, cx, inset + 0.09 * heightPx)
  const chapterLabel = `${chapters} ${chapters === 1 ? 'CHAPTER' : 'CHAPTERS'}`
  fitLabel(chapterLabel, 0.15)
  ctx.fillText(chapterLabel, cx, heightPx - inset - 0.09 * heightPx)

  // Arch and rule above the name.
  const archR = 0.1 * heightPx
  const archY = 0.43 * heightPx
  ctx.beginPath()
  ctx.arc(cx, archY, archR, Math.PI, 0)
  ctx.closePath()
  ctx.fill()
  const ruleW = 0.37 * heightPx
  ctx.fillRect(cx - ruleW / 2, archY + 0.037 * heightPx, ruleW, 2)

  // Book name: italic, as large as fits inside the frame.
  ctx.letterSpacing = '0px'
  const maxW = widthPx - 2 * inset - 24
  let size = 0.16 * heightPx
  const setFont = () => (ctx.font = `italic 600 ${size}px ${COVER_TITLE_FONT}`)
  setFont()
  while (ctx.measureText(name).width > maxW && size > 12) {
    size -= 1
    setFont()
  }
  ctx.fillText(name, cx, archY + 0.037 * heightPx + 0.04 * heightPx + size * 0.5)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}
