// The 3D part of the table page: the spines, the sunlight, and the shadows.
// The linen surface is CSS behind a transparent canvas. A shadow plane
// at the table height receives the shadows.

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Color, MathUtils, Mesh, MeshStandardMaterial, PerspectiveCamera, Vector3 } from 'three'
import { groupOf } from '../data/books.ts'
import { BOOK_DEPTH, PX, type SpineBox, type TableLayout } from './layout.ts'
import { makeSpineTexture } from './spineTexture.ts'

/** A rectangle in CSS px from the top left of the canvas. */
export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

/** Screen rectangles of a spine face: at rest in the stack, and slid out. */
export interface SpineRect {
  id: string
  rest: Rect
  out: Rect
}

interface TableSceneProps {
  layout: TableLayout
  hoveredId: string | null
  dimmedIds: ReadonlySet<string>
  reducedMotion: boolean
  onRects: (rects: SpineRect[]) => void
}

/** How far a spine slides out toward the reader on hover or focus. */
const SLIDE = 40 * PX
/**
 * A dimmed spine is mixed with the linen color. Mockup D1 shows a dimmed
 * spine at opacity 0.18, which is 82 % linen. An opaque mix does not show the
 * inner faces of the boxes, as transparency does.
 */
const DIM_MIX = 0.82
const LINEN = new Color('#E7DCC6')
const PAPER = '#EFE6D2'

export function TableScene({ layout, hoveredId, dimmedIds, reducedMotion, onRects }: TableSceneProps) {
  return (
    <Canvas
      className="table-canvas"
      shadows
      flat
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 26, near: 0.1, far: 200 }}
      aria-hidden="true"
    >
      {/*
        Ambient light of intensity PI gives a face that the sun does not reach
        its exact color (flat, no tone mapping). The spine faces point to the
        reader, so they show the cloth colors of docs/DESIGN.md section 2.
      */}
      <ambientLight intensity={Math.PI} />
      {/* Sunlight from the top left, a little behind the stacks. Shadows fall to the bottom right. */}
      <directionalLight
        castShadow
        position={[-5, 16, -3]}
        intensity={1}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      <mesh receiveShadow rotation-x={-Math.PI / 2}>
        <planeGeometry args={[80, 80]} />
        <shadowMaterial color="#543a14" opacity={0.24} transparent />
      </mesh>
      {layout.spines.map((box) => (
        <Spine
          key={box.book.id}
          box={box}
          hovered={hoveredId === box.book.id}
          dimmed={dimmedIds.has(box.book.id)}
          reducedMotion={reducedMotion}
        />
      ))}
      <FitAndProject layout={layout} onRects={onRects} />
    </Canvas>
  )
}

interface SpineProps {
  box: SpineBox
  hovered: boolean
  dimmed: boolean
  reducedMotion: boolean
}

function Spine({ box, hovered, dimmed, reducedMotion }: SpineProps) {
  const mesh = useRef<Mesh>(null)
  const mix = useRef(0)
  const group = groupOf(box.book)

  const materials = useMemo(() => {
    const face = new MeshStandardMaterial({
      map: makeSpineTexture(box.book.name, group, box.width / PX, box.thickness / PX),
      roughness: 0.95,
    })
    const cloth = new MeshStandardMaterial({ color: group.cloth, roughness: 0.95 })
    const paper = new MeshStandardMaterial({ color: PAPER, roughness: 1 })
    const all = [face, cloth, paper]
    for (const m of all) m.emissive.copy(LINEN)
    return { face, cloth, paper, all, base: all.map((m) => m.color.clone()) }
  }, [box.book.name, box.width, box.thickness, group])

  useEffect(
    () => () => {
      materials.face.map?.dispose()
      for (const m of materials.all) m.dispose()
    },
    [materials],
  )

  useFrame((_, delta) => {
    const m = mesh.current
    if (!m) return
    // Reduced motion: the spine does not move. The page fades in a ring instead.
    const slide = hovered && !reducedMotion ? SLIDE : 0
    m.position.z = MathUtils.damp(m.position.z, box.z + slide, 14, delta)
    // Dimming is a fade, so it runs with reduced motion also.
    mix.current = MathUtils.damp(mix.current, dimmed ? DIM_MIX : 0, 10, delta)
    // The React compiler rule does not know that useFrame runs outside render.
    // Changing three.js objects in useFrame is the documented fiber pattern.
    /* oxlint-disable react/immutability */
    materials.all.forEach((mat, i) => {
      mat.color.copy(materials.base[i]).multiplyScalar(1 - mix.current)
      mat.emissiveIntensity = mix.current
    })
    /* oxlint-enable react/immutability */
  })

  // Box faces in three.js order: +x, -x, +y, -y, +z, -z.
  // +z is the spine face, toward the reader. +y is the top cover.
  const faces = [
    materials.paper,
    materials.paper,
    materials.cloth,
    materials.cloth,
    materials.face,
    materials.paper,
  ]

  return (
    <mesh ref={mesh} position={[box.x, box.y, box.z]} material={faces} castShadow receiveShadow>
      <boxGeometry args={[box.width, box.thickness, box.depth]} />
    </mesh>
  )
}

/** Width of the canvas outside the stacks on each side, in px. Same as the page padding. */
const SIDE_MARGIN_PX = 72

/** Camera tilt down to the table, in radians. */
const PITCH = MathUtils.degToRad(22)

function FitAndProject({ layout, onRects }: { layout: TableLayout; onRects: (rects: SpineRect[]) => void }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)

  useLayoutEffect(() => {
    if (size.width === 0 || size.height === 0) return
    const target = new Vector3(0, layout.height * 0.5, 0)
    const vfov = MathUtils.degToRad(camera.fov)
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * (size.width / size.height))
    // The canvas reaches the page edges, past the 72 px page padding of mockup D1.
    const needWidth = layout.width + 2 * SIDE_MARGIN_PX * PX + 60 * PX
    const needHeight = layout.height + BOOK_DEPTH * Math.sin(PITCH) + 60 * PX
    const distance =
      Math.max(needWidth / 2 / Math.tan(hfov / 2), needHeight / 2 / Math.tan(vfov / 2)) + BOOK_DEPTH / 2
    camera.position.set(0, target.y + Math.sin(PITCH) * distance, Math.cos(PITCH) * distance)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()

    const corner = new Vector3()
    const faceRect = (box: SpineBox, z: number): Rect => {
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity
      for (const dx of [-1, 1]) {
        for (const dy of [-1, 1]) {
          corner
            .set(box.x + (dx * box.width) / 2, box.y + (dy * box.thickness) / 2, z + box.depth / 2)
            .project(camera)
          const sx = ((corner.x + 1) / 2) * size.width
          const sy = ((1 - corner.y) / 2) * size.height
          minX = Math.min(minX, sx)
          maxX = Math.max(maxX, sx)
          minY = Math.min(minY, sy)
          maxY = Math.max(maxY, sy)
        }
      }
      return { left: minX, top: minY, width: maxX - minX, height: maxY - minY }
    }
    onRects(
      layout.spines.map((box) => ({
        id: box.book.id,
        rest: faceRect(box, box.z),
        out: faceRect(box, box.z + SLIDE),
      })),
    )
  }, [camera, size, layout, onRects])

  return null
}
