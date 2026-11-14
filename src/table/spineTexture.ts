// Draws the face of a spine: cloth color, edge lines, and the book name in capitals.

import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Group } from '../data/books.ts'

/** Texture pixels for each mockup px. */
const SCALE = 4

export const SPINE_FONT_FAMILY = '"Cormorant Garamond", Georgia, serif'

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

  // Mockup D1 rule: font size 0.42 * thickness, from 14 px to 24 px.
  const fontPx = Math.max(14, Math.min(24, thicknessPx * 0.42))
  ctx.font = `700 ${fontPx * SCALE}px ${SPINE_FONT_FAMILY}`
  ctx.letterSpacing = `${2 * SCALE}px`
  ctx.fillStyle = group.text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name.toUpperCase(), canvas.width / 2, canvas.height / 2 + SCALE)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}
