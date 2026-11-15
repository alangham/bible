// The 3D part of the cover page: the closed book on the linen table.
// Mockup D2, docs/DESIGN.md section 4.2.
//
// The book comes from the table: it starts where the spine left the stack,
// turns from its spine to its front, and lands on the table.
// docs/TASKS.md Task 4 step 7.

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import {
  CanvasTexture,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Plane,
  Raycaster,
  SRGBColorSpace,
  Vector2,
  Vector3,
} from 'three'
import { groupOf, spineThickness, type Book } from '../data/books.ts'
import { BOOK_DEPTH, PX, STACK_WIDTH } from '../table/layout.ts'
import { makeSpineTexture } from '../table/spineTexture.ts'
import type { Rect } from './handoff.ts'
import { drawScene } from '../scene/sceneSvg.ts'
import { sceneValues } from '../scene/values.ts'
import { makeCoverTexture } from './coverTexture.ts'

/** The book is the same size as its spine on the table. */
const COVER_WIDTH = BOOK_DEPTH
const COVER_HEIGHT = STACK_WIDTH
const PAPER = '#EFE6D2'
/** Thickness of the front board. */
const BOARD = 0.04

/** Camera tilt down to the table. Mockup D2 shows the cover at about rotateX(26deg). */
const PITCH = MathUtils.degToRad(64)
/** The book lies at an angle. Mockup D2: rotateZ(-11deg). */
const REST_YAW = MathUtils.degToRad(11)
/** At the start the spine faces the reader at the 22° view of the table. */
const START_TILT = -(PITCH - MathUtils.degToRad(22))
/** Duration of the landing, in seconds. */
const LAND_S = 0.9
/** Duration of the move that opens the book, in seconds. docs/TASKS.md Task 5 step 10. */
const OPEN_S = 1.3

export interface CoverSceneProps {
  book: Book
  /** Center of the book on the page, in px from the top left of the canvas. */
  center: { x: number; y: number }
  /** Height of the cover on screen, in px. */
  coverPx: number
  /** The spine at the end of its move on the table, in viewport px. Null: no landing. */
  start: Rect | null
  onLanded: () => void
  /** True when the reader selected "Open the book": the front board opens. */
  opening?: boolean
  /** Called when the book is open. */
  onOpened?: () => void
  /**
   * "low" for the narrow layout: fewer pixels and a smaller shadow map, so that a
   * phone keeps its frame rate. docs/TASKS.md Task 9 step 4.
   */
  detail?: 'full' | 'low'
}

export function CoverScene({ detail = 'full', ...props }: CoverSceneProps) {
  const low = detail === 'low'
  return (
    <Canvas
      className="cover-canvas"
      shadows
      flat
      dpr={low ? 1 : [1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 26, near: 0.1, far: 200 }}
      aria-hidden="true"
    >
      {/* The same light as the table: ambient PI, and the sun from the top left. */}
      <ambientLight intensity={Math.PI} />
      <directionalLight
        castShadow
        position={[-5, 16, -3]}
        intensity={1}
        shadow-mapSize={low ? [512, 512] : [2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />
      <mesh receiveShadow rotation-x={-Math.PI / 2}>
        <planeGeometry args={[80, 80]} />
        <shadowMaterial color="#543a14" opacity={0.24} transparent />
      </mesh>
      <ClosedBook {...props} />
    </Canvas>
  )
}

function ClosedBook({ book, center, coverPx, start, onLanded, opening = false, onOpened }: CoverSceneProps) {
  const mesh = useRef<Mesh>(null)
  const hinge = useRef<Group>(null)
  /** 0 closed, 1 open. */
  const open = useRef({ t: 0 })
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)
  const invalidate = useThree((s) => s.invalidate)
  const group = groupOf(book)
  const thickness = spineThickness(book.chapters) * PX
  /** 0 at the start pose, 1 at rest. */
  const progress = useRef({ t: start ? 0 : 1 })
  const startPose = useRef<{ position: Vector3; scale: number } | null>(null)

  const materials = useMemo(() => {
    const front = new MeshBasicMaterial({
      map: makeCoverTexture(book.name, book.chapters, group, COVER_WIDTH / PX, COVER_HEIGHT / PX),
    })
    const spine = new MeshStandardMaterial({
      map: makeSpineTexture(book.name, group, COVER_HEIGHT / PX, thickness / PX),
      roughness: 0.95,
    })
    const cloth = new MeshStandardMaterial({ color: group.cloth, roughness: 0.95 })
    const paper = new MeshStandardMaterial({ color: PAPER, roughness: 1 })
    // Box faces in three.js order: +x, -x, +y, -y, +z, -z.
    // -x is the spine, on the left at rest. +y is the front cover.
    return {
      faces: [paper, spine, front, cloth, paper, paper],
      front,
      spine,
      cloth,
      paper,
    }
  }, [book.name, book.chapters, group, thickness])

  // The inside of the book: the scene of chapter 1, the left half inside the front board and
  // the right half on the first page. So the open book leads to the spread of chapter 1.
  const inside = useMemo(() => ({ left: new MeshBasicMaterial({ color: PAPER }), right: new MeshBasicMaterial({ color: PAPER }) }), [])
  useEffect(() => {
    let live = true
    const values = sceneValues(book, 1)
    const draw = async (half: 'left' | 'right') => {
      const c = document.createElement('canvas')
      c.width = 512
      c.height = 640
      await drawScene(c.getContext('2d')!, values, half, c.width, c.height)
      return c
    }
    Promise.all([draw('left'), draw('right')])
      .then(([l, r]) => {
        if (!live) return
        for (const [m, c] of [[inside.left, l], [inside.right, r]] as const) {
          const map = new CanvasTexture(c)
          map.colorSpace = SRGBColorSpace
          // The inside of the board faces down on the box; after the turn it would show upside down.
          map.flipY = m !== inside.left
          m.map = map
          m.color.set('#FFFFFF')
          m.needsUpdate = true
        }
        invalidate()
      })
      .catch(() => undefined)
    return () => {
      live = false
      for (const m of [inside.left, inside.right]) {
        m.map?.dispose()
        m.dispose()
      }
    }
  }, [book, inside, invalidate])
  // While the book opens, the front is on the board, and the top of the block of pages is the first page.
  const openFaces = useMemo(() => [materials.paper, materials.spine, inside.right, materials.cloth, materials.paper, materials.paper], [materials, inside])
  const board = useMemo(() => [materials.cloth, materials.cloth, materials.front, inside.left, materials.cloth, materials.cloth], [materials, inside])

  useEffect(
    () => () => {
      materials.front.map?.dispose()
      materials.spine.map?.dispose()
      for (const m of [materials.front, materials.spine, materials.cloth, materials.paper]) m.dispose()
    },
    [materials],
  )

  // Camera: the book center is at the world origin. setViewOffset moves the
  // origin to `center` on the canvas. The distance gives the cover `coverPx` in height.
  useLayoutEffect(() => {
    if (size.width === 0 || size.height === 0) return
    const pxPerUnit = coverPx / COVER_HEIGHT
    const distance = size.height / (2 * pxPerUnit * Math.tan(MathUtils.degToRad(camera.fov) / 2))
    camera.position.set(0, Math.sin(PITCH) * distance, Math.cos(PITCH) * distance)
    camera.lookAt(0, 0, 0)
    camera.setViewOffset(
      size.width,
      size.height,
      size.width / 2 - center.x,
      size.height / 2 - center.y,
      size.width,
      size.height,
    )
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()

    // The start pose: where the spine was on screen, at the same size.
    if (start && !startPose.current) {
      const ndc = (x: number, y: number) => new Vector2((x / size.width) * 2 - 1, 1 - (y / size.height) * 2)
      const ray = new Raycaster()
      const hit = new Vector3()
      const plane = new Plane(new Vector3(0, 1, 0), -thickness)
      ray.setFromCamera(ndc(start.left + start.width / 2, start.top + start.height / 2), camera)
      if (ray.ray.intersectPlane(plane, hit)) {
        const a = hit.clone().project(camera)
        const b = hit.clone().add(new Vector3(1, 0, 0)).project(camera)
        const unitPx = Math.abs(b.x - a.x) * (size.width / 2)
        startPose.current = { position: hit, scale: unitPx > 0 ? start.width / (COVER_HEIGHT * unitPx) : 1 }
      }
    }
    invalidate()
  }, [camera, size, center.x, center.y, coverPx, start, thickness, invalidate])

  // GSAP times the landing. useFrame applies it to the mesh.
  useEffect(() => {
    if (!start) return
    const tween = gsap.to(progress.current, {
      t: 1,
      duration: LAND_S,
      ease: 'power2.inOut',
      onComplete: onLanded,
    })
    return () => {
      tween.kill()
    }
  }, [start, onLanded])

  // GSAP times the opening: the book turns straight, then the front board opens to the left.
  useEffect(() => {
    if (!opening) return
    const tween = gsap.to(open.current, { t: 1, duration: OPEN_S, ease: 'power1.inOut', onComplete: onOpened })
    return () => {
      tween.kill()
    }
  }, [opening, onOpened])

  useFrame(() => {
    const m = mesh.current
    if (!m) return
    const t = progress.current.t
    const from = startPose.current
    // The React compiler rule does not know that useFrame runs outside render.
    // Changing three.js objects in useFrame is the documented fiber pattern.
    /* oxlint-disable react/immutability */
    if (!from || t >= 1) {
      m.position.set(0, thickness / 2, 0)
      m.rotation.set(0, REST_YAW, 0)
      m.scale.setScalar(1)
    } else {
      const rest = new Vector3(0, thickness / 2, 0)
      m.position.lerpVectors(from.position, rest, t)
      // A small lift on the way, so the book lands.
      m.position.y += Math.sin(Math.PI * t) * 0.6
      m.rotation.set(MathUtils.lerp(START_TILT, 0, t), MathUtils.lerp(Math.PI / 2, REST_YAW, t), 0)
      m.scale.setScalar(MathUtils.lerp(from.scale, 1, t))
    }
    if (opening) {
      const o = open.current.t
      m.rotation.y = MathUtils.lerp(REST_YAW, 0, MathUtils.smoothstep(o, 0, 0.35))
      if (hinge.current) hinge.current.rotation.z = Math.PI * 0.97 * MathUtils.smootherstep(o, 0.2, 0.92)
    }
    /* oxlint-enable react/immutability */
  })

  return (
    <mesh ref={mesh} material={opening ? openFaces : materials.faces} castShadow position={[0, thickness / 2, 0]} rotation={[0, REST_YAW, 0]}>
      <boxGeometry args={[COVER_WIDTH, thickness, COVER_HEIGHT]} />
      {/* The front board, hinged at the spine. It shows only while the book opens. */}
      <group ref={hinge} position={[-COVER_WIDTH / 2, thickness / 2, 0]} visible={opening}>
        <mesh material={board} castShadow position={[COVER_WIDTH / 2, BOARD / 2, 0]}>
          <boxGeometry args={[COVER_WIDTH, BOARD, COVER_HEIGHT]} />
        </mesh>
      </group>
    </mesh>
  )
}
