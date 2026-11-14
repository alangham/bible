// The turning page: one leaf in 3D over the open book. docs/DESIGN.md section 4.3.
// The canvas lies over the book and reaches past it, so the curl can rise above the book.
// Units are CSS px. The origin is the middle of the spine. The book lies in the plane z = 0.

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react'
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  FrontSide,
  MathUtils,
  MeshLambertMaterial,
  SRGBColorSpace,
  type PerspectiveCamera,
} from 'three'
import { curlFor, curlPoint, type Corner } from './curl.ts'

/** The corner that the reader holds, in page coordinates. Pointer moves and tweens change it. */
export interface TurnDrive {
  corner: Corner
  target: [number, number]
}

export interface PageTurnProps {
  /** Page size in CSS px. */
  width: number
  height: number
  /** 1: the right page turns to the left (next chapter). -1: the left page turns to the right. */
  dir: 1 | -1
  front: HTMLCanvasElement
  back: HTMLCanvasElement
  drive: MutableRefObject<TurnDrive>
  /** Called once, when the leaf is on screen. */
  onShown: () => void
}

const SEG_U = 36
const SEG_V = 28
const FOV = 30

export function PageTurn(props: PageTurnProps) {
  return (
    <Canvas
      className="turn-canvas"
      flat
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: FOV, near: 1, far: 20000, position: [0, 0, 2000] }}
      aria-hidden="true"
    >
      {/* Lambert light: a flat page facing the camera shows its colors without change. */}
      <ambientLight intensity={0.6 * Math.PI} />
      <directionalLight position={[-1, 1, 2]} intensity={0.49 * Math.PI} />
      <Leaf {...props} />
    </Canvas>
  )
}

function Leaf({ width: W, height: H, dir, front, back, drive, onShown }: PageTurnProps) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)
  const frames = useRef(0)

  // The camera sees the plane z = 0 at 1 unit to 1 CSS px.
  useLayoutEffect(() => {
    camera.position.set(0, 0, size.height / 2 / Math.tan(MathUtils.degToRad(FOV / 2)))
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, size])

  const geometry = useMemo(() => {
    const g = new BufferGeometry()
    const count = (SEG_U + 1) * (SEG_V + 1)
    const uv = new Float32Array(count * 2)
    for (let j = 0; j <= SEG_V; j++)
      for (let i = 0; i <= SEG_U; i++) {
        uv[(j * (SEG_U + 1) + i) * 2] = i / SEG_U
        uv[(j * (SEG_U + 1) + i) * 2 + 1] = j / SEG_V
      }
    const index: number[] = []
    for (let j = 0; j < SEG_V; j++)
      for (let i = 0; i < SEG_U; i++) {
        const a = j * (SEG_U + 1) + i
        const b = a + 1
        const c = a + SEG_U + 1
        const d = c + 1
        // The left page is the right page seen in a mirror: the triangles turn the other way.
        if (dir === 1) index.push(a, b, d, a, d, c)
        else index.push(a, d, b, a, c, d)
      }
    g.setIndex(index)
    g.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3))
    g.setAttribute('uv', new BufferAttribute(uv, 2))
    return g
  }, [dir])

  const materials = useMemo(() => {
    const map = (c: HTMLCanvasElement) => {
      const t = new CanvasTexture(c)
      t.colorSpace = SRGBColorSpace
      t.anisotropy = 4
      return t
    }
    return [new MeshLambertMaterial({ map: map(front), side: FrontSide }), new MeshLambertMaterial({ map: map(back), side: BackSide })]
  }, [front, back])

  useEffect(
    () => () => {
      geometry.dispose()
      for (const m of materials) {
        m.map?.dispose()
        m.dispose()
      }
    },
    [geometry, materials],
  )

  useFrame(() => {
    const { corner, target } = drive.current
    const curl = curlFor(W, H, corner, target)
    const pos = geometry.getAttribute('position') as BufferAttribute
    const arr = pos.array as Float32Array
    for (let j = 0; j <= SEG_V; j++)
      for (let i = 0; i <= SEG_U; i++) {
        const [u, v, z] = curlPoint(curl, (i / SEG_U) * W, (j / SEG_V) * H)
        const k = (j * (SEG_U + 1) + i) * 3
        arr[k] = dir * u
        arr[k + 1] = v - H / 2
        arr[k + 2] = z
      }
    pos.needsUpdate = true
    geometry.computeVertexNormals()
    geometry.computeBoundingSphere()
    frames.current++
    if (frames.current === 2) onShown()
  })

  return (
    <group>
      <mesh geometry={geometry} material={materials[0]} />
      <mesh geometry={geometry} material={materials[1]} />
    </group>
  )
}
