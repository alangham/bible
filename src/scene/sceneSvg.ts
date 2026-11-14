// SVG markup for a scene. The page shows each layer as its own <svg> element, so that the
// layers can move in parallax. The page turn draws the whole scene into a canvas from one
// SVG document. Both use the markup from this file, so the two pictures are the same.

import { shade } from './color.ts'
import { SCENE_H, SCENE_W, sceneShapes, starField, type Shape } from './shapes.ts'
import { SHADOW_ALPHA, type SceneValues } from './values.ts'

/** How far each layer moves up at the end of a long chapter, in scene units. The front moves most. */
export const PARALLAX_DEPTH = [0, 22, 46, 80]

/** The shadow of a paper layer on the layers behind it: down and to the right, from the sun at the top left. */
export const SHADOW = { dx: 5, dy: 9, blur: 7, color: `rgba(20,12,4,${SHADOW_ALPHA - 0.05})` }

const esc = (s: string) => s.replace(/[<>&"]/g, '')

function fillOf(shape: Shape, layerColor: string, v: SceneValues): { fill: string; opacity: number } {
  const p = v.palette
  if (shape.fill === 'light') return { fill: p.light, opacity: shape.opacity ?? 1 }
  if (shape.fill === 'star') return { fill: p.light, opacity: (shape.opacity ?? 1) * p.stars }
  if (shape.fill === 'water') {
    const water = p.water ?? layerColor
    return { fill: shape.tone ? shade(water, shape.tone) : water, opacity: shape.opacity ?? 1 }
  }
  return { fill: shape.tone ? shade(layerColor, shape.tone) : layerColor, opacity: shape.opacity ?? 1 }
}

function paths(shapes: Shape[], layerColor: string, v: SceneValues): string {
  let out = ''
  for (const s of shapes) {
    const { fill, opacity } = fillOf(s, layerColor, v)
    if (opacity <= 0) continue
    out += `<path d="${esc(s.d)}" fill="${fill}"${opacity < 1 ? ` opacity="${opacity.toFixed(3)}"` : ''}/>`
  }
  return out
}

/** The sun moves from this x at dawn to SUN_X1 at dusk, on the left page. POLISH.md item 8. */
export const SUN_X0 = 140
/** The sun and its glow stay this far from the fold, so that the fold and the text panel do not cover them. */
export const SUN_X1 = 600

/**
 * The sun from dawn to dusk, and the moon at night: its place and size in scene units.
 * Both stay on the left page, away from the fold and the text panel. POLISH.md item 8.
 */
export function lightPosition(h: number): { x: number; y: number; r: number; moon: boolean } {
  if (h >= 1) return { x: 300, y: 170, r: 36, moon: true }
  return { x: SUN_X0 + h * (SUN_X1 - SUN_X0), y: 640 - Math.sin(Math.PI * Math.min(1, h * 1.05)) * 500, r: 46, moon: false }
}

/** The markup inside the <svg> of one layer. Layer 0 is the sky. `id` makes the gradient id unique. */
export function layerMarkup(v: SceneValues, layer: number, id: string): string {
  const shapes = sceneShapes(v.scene)
  const shift = v.shifts[layer]
  if (layer === 0) {
    const p = v.palette
    let sky = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.skyTop}"/><stop offset="0.7" stop-color="${p.skyHorizon}"/></linearGradient></defs>`
    sky += `<rect x="-200" y="-100" width="${SCENE_W + 400}" height="${SCENE_H + 400}" fill="url(#${id})"/>`
    if (p.stars > 0) sky += paths(starField(), p.skyTop, v)
    if (v.scene !== 'heaven') {
      const sun = lightPosition(v.h)
      if (sun.moon) {
        sky += `<circle cx="${sun.x}" cy="${sun.y}" r="${sun.r}" fill="${p.light}"/><circle cx="${sun.x + 15}" cy="${sun.y - 9}" r="${sun.r - 3}" fill="${p.skyTop}"/>`
      } else {
        sky += `<circle cx="${sun.x}" cy="${sun.y}" r="${sun.r * 2}" fill="${p.light}" opacity="0.25"/><circle cx="${sun.x}" cy="${sun.y}" r="${sun.r}" fill="${p.light}"/>`
      }
    }
    return sky + `<g transform="translate(${shift} 0)">${paths(shapes[0], p.skyTop, v)}</g>`
  }
  return `<g transform="translate(${shift} 0)">${paths(shapes[layer], v.palette.layers[layer - 1], v)}</g>`
}

/**
 * One SVG document with the four layers, for the page turn. `half` selects the left page,
 * the right page, or both. `parallax` is the move of each layer up, in scene units.
 */
export function sceneDocument(v: SceneValues, half: 'left' | 'right' | 'both', width: number, height: number, parallax: number[] = [0, 0, 0, 0]): string {
  const x = half === 'right' ? SCENE_W / 2 : 0
  const w = half === 'both' ? SCENE_W : SCENE_W / 2
  const s = SHADOW
  let body = `<defs><filter id="paper" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="${s.dx}" dy="${s.dy}" stdDeviation="${s.blur / 2}" flood-color="rgb(20,12,4)" flood-opacity="${SHADOW_ALPHA - 0.05}"/></filter></defs>`
  for (let layer = 0; layer < 4; layer++) {
    const inner = layerMarkup(v, layer, `sky-doc-${layer}`)
    const lift = parallax[layer] ? ` transform="translate(0 ${-parallax[layer]})"` : ''
    body += `<g${lift}${layer > 0 ? ' filter="url(#paper)"' : ''}>${inner}</g>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${x} 0 ${w} ${SCENE_H}" preserveAspectRatio="none">${body}</svg>`
}

/** Draws a scene into a canvas context, from the SVG document. Resolves when it is drawn. */
export function drawScene(ctx: CanvasRenderingContext2D, v: SceneValues, half: 'left' | 'right', width: number, height: number, parallax?: number[]): Promise<void> {
  const svg = sceneDocument(v, half, width, height, parallax)
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  const img = new Image()
  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve()
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('scene image did not load'))
    }
    img.src = url
  })
}
