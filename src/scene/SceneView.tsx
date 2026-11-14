// A scene in the page: four paper-cut layers, each its own <svg>, so that the layers can
// move in parallax. docs/DESIGN.md section 4.4.

import { forwardRef, useId, useImperativeHandle, useMemo, useRef } from 'react'
import { layerMarkup, PARALLAX_DEPTH } from './sceneSvg.ts'
import { SCENE_H, SCENE_W } from './shapes.ts'
import type { SceneValues } from './values.ts'

export interface SceneHandle {
  /** Moves the layers for a scroll position, 0 at the top of the text and 1 at the end. */
  setParallax: (fraction: number, pxPerUnit: number) => void
}

interface SceneViewProps {
  values: SceneValues
  /** Which page of the spread this element shows. The scene is one picture across the two pages. */
  half: 'left' | 'right'
}

export const SceneView = forwardRef<SceneHandle, SceneViewProps>(function SceneView({ values, half }, ref) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const layers = useRef<(SVGSVGElement | null)[]>([])
  const markup = useMemo(() => [0, 1, 2, 3].map((i) => layerMarkup(values, i, `sky-${id}-${i}`)), [values, id])

  useImperativeHandle(ref, () => ({
    setParallax(fraction, pxPerUnit) {
      layers.current.forEach((el, i) => {
        if (el) el.style.transform = `translate3d(0, ${(-fraction * PARALLAX_DEPTH[i] * pxPerUnit).toFixed(2)}px, 0)`
      })
    },
  }))

  return (
    <div className="scene" data-half={half} data-scene={values.scene} data-phase={values.phase} aria-hidden="true">
      {markup.map((html, i) => (
        <svg
          key={i}
          ref={(el) => {
            layers.current[i] = el
          }}
          className={`scene-layer scene-layer-${i}`}
          viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
          preserveAspectRatio="none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ))}
    </div>
  )
})
