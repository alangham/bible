import { describe, expect, it } from 'vitest'
import { crossesPanelEdge, sceneShapes, TEXT_PANEL } from './shapes.ts'
import { lightPosition, PARALLAX_DEPTH } from './sceneSvg.ts'
import type { SceneId } from './values.ts'

const SCENES: SceneId[] = ['camp', 'city', 'stream', 'watchtower', 'farm', 'lake', 'town', 'road', 'heaven']

/** The box of an SVG path from shapes.ts: absolute M, L, C, Q, A, and the relative arcs of circles and ellipses. */
function box(d: string) {
  const xs: number[] = []
  const ys: number[] = []
  let x = 0
  let y = 0
  for (const m of d.matchAll(/([MLCQAa])([^MLCQAaZ]*)/g)) {
    const v = m[2].trim().split(/[ ,]+/).filter(Boolean).map(Number)
    if (m[1] === 'a') {
      // A circle or an ellipse from circle() or ellipse(): two half arcs from the left point.
      for (let i = 0; i + 6 < v.length + 1; i += 7) {
        xs.push(x, x + v[i + 5])
        ys.push(y - v[i + 1], y + v[i + 1])
        x += v[i + 5]
        y += v[i + 6]
      }
    } else if (m[1] === 'A') {
      for (let i = 0; i + 6 < v.length + 1; i += 7) {
        x = v[i + 5]
        y = v[i + 6]
        xs.push(x)
        ys.push(y)
      }
    } else {
      for (let i = 0; i + 1 < v.length; i += 2) {
        x = v[i]
        y = v[i + 1]
        xs.push(x)
        ys.push(y)
      }
    }
  }
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }
}

describe('the front layers and the text panel (POLISH.md item 9)', () => {
  it('keeps each large shape of layers 2 and 3 off the left and the right edge of the text panel', () => {
    const crossing: string[] = []
    for (const id of SCENES) {
      const shapes = sceneShapes(id)
      for (const layer of [2, 3]) {
        shapes[layer].forEach((shape, i) => {
          const b = box(shape.d)
          const w = b.x1 - b.x0
          const h = b.y1 - b.y0
          // A ground or a band across the whole scene, and a small shape, are not large shapes.
          if (w > 1200 || w < 60 || h < 60) return
          if (b.y1 < TEXT_PANEL.top || b.y0 - PARALLAX_DEPTH[layer] > TEXT_PANEL.bottom) return
          if (crossesPanelEdge(b.x0, b.x1, layer)) crossing.push(`${id} layer ${layer} shape ${i}: x ${Math.round(b.x0)} to ${Math.round(b.x1)}`)
        })
      }
    }
    expect(crossing).toEqual([])
  })

  it('finds a shape across an edge', () => {
    expect(crossesPanelEdge(TEXT_PANEL.right - 100, TEXT_PANEL.right + 10, 2)).toBe(true)
    expect(crossesPanelEdge(1000, 1200, 3)).toBe(false)
  })
})

describe('the sun and the moon (POLISH.md item 8)', () => {
  it('stay on the left page, with their glow clear of the fold, at each time of day', () => {
    for (let h = 0; h <= 1; h += 0.01) {
      const p = lightPosition(h)
      // The glow of the sun has twice the radius of the sun. The scene can shift 0 units in layer 0.
      expect(p.x + p.r * 2, `h ${h.toFixed(2)}`).toBeLessThan(800 - 60)
      expect(p.x - p.r * 2, `h ${h.toFixed(2)}`).toBeGreaterThan(0)
    }
    expect(lightPosition(1).moon).toBe(true)
  })
})
