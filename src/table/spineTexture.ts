// Draws the face of a spine: cloth color, edge lines, and the book name in capitals.

import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Group } from '../data/books.ts'

/** The width of the stroke around each letter, in mockup px. POLISH.md item 1. */
const STROKE_PX = 1.5

/** Texture pixels for each mockup px. */
const SCALE = 4

import { SPINE_FONT_FAMILY, spineFontPx } from './spineFont.ts'

export { SPINE_FONT_FAMILY }

export function makeSpineTexture(name: string, group: Group, widthPx: number, thicknessPx: number) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(widthPx * SCALE)
  canvas.height = Math.round(thicknessPx * SCALE)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas is not available')

  ctx.fillStyle = group.cloth
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // Edge lines, as the inset shadows in mockup D1.
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.fillRect(0, canvas.height - 3 * SCALE, canvas.width, 3 * SCALE)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)'
  ctx.fillRect(0, 0, canvas.width, 2 * SCALE)

  // POLISH.md item 3: half the thickness, from 20 px to 24 px. A long name is narrowed to fit the face.
  const fontPx = spineFontPx(thicknessPx)
  ctx.font = `700 ${fontPx * SCALE}px ${SPINE_FONT_FAMILY}`
  ctx.letterSpacing = `${2 * SCALE}px`
  ctx.fillStyle = group.text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const text = name.toUpperCase()
  const maxWidth = canvas.width - 16 * SCALE
  // A long name first loses its letter spacing. Only then does the canvas narrow the letters.
  if (ctx.measureText(text).width > maxWidth) ctx.letterSpacing = `${0.5 * SCALE}px`
  // POLISH.md item 1: a stroke of the text color makes the letters heavier, so that they keep
  // their contrast when the face is drawn small on screen.
  ctx.strokeStyle = group.text
  ctx.lineWidth = STROKE_PX * SCALE
  ctx.lineJoin = 'round'
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2 + SCALE, maxWidth)
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + SCALE, maxWidth)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}
