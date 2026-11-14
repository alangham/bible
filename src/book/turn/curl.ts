// The shape of a turning page. docs/DESIGN.md section 4.3: "The page must curl."
//
// Page coordinates: u is the distance from the spine, 0 to W. v is the height from the
// bottom edge, 0 to H. The reader holds one outer corner, C, and moves it to D.
// The page folds over a cylinder. The axis of the cylinder lies across the page, at a right
// angle to the line from D to C. Points on the spine side of the axis stay flat. Points past
// the axis roll over the cylinder, and points past the half turn lie flat on top, face down.
// With a cylinder of radius 0 the fold is a crease, and the corner lands exactly on D.

export type Corner = 'bottom' | 'top'

export interface Curl {
  /** False when the page lies flat. */
  active: boolean
  /** Unit vector from the axis toward the held corner. */
  nx: number
  ny: number
  /** A point on the axis. */
  qx: number
  qy: number
  /** Radius of the cylinder. */
  r: number
}

export function cornerPoint(W: number, H: number, corner: Corner): [number, number] {
  return corner === 'bottom' ? [W, 0] : [W, H]
}

/** Keeps the held corner where a page that is fixed at the spine can reach. */
export function clampTarget(W: number, H: number, corner: Corner, D: [number, number]): [number, number] {
  const near: [number, number] = corner === 'bottom' ? [0, 0] : [0, H]
  const far: [number, number] = corner === 'bottom' ? [0, H] : [0, 0]
  const diag = Math.hypot(W, H)
  let [x, y] = D
  const dn = Math.hypot(x - near[0], y - near[1])
  if (dn > W) {
    x = near[0] + ((x - near[0]) * W) / dn
    y = near[1] + ((y - near[1]) * W) / dn
  }
  const df = Math.hypot(x - far[0], y - far[1])
  if (df > diag) {
    x = far[0] + ((x - far[0]) * diag) / df
    y = far[1] + ((y - far[1]) * diag) / df
  }
  return [x, y]
}

/** How far the turn has gone: 0 with the page at rest, 1 with the page on the other side. */
export function turnProgress(W: number, D: [number, number]): number {
  return Math.min(1, Math.max(0, (W - D[0]) / (2 * W)))
}

export function curlFor(W: number, H: number, corner: Corner, target: [number, number]): Curl {
  const C = cornerPoint(W, H, corner)
  const D = clampTarget(W, H, corner, target)
  const dist = Math.hypot(C[0] - D[0], C[1] - D[1])
  if (dist < 0.5) return { active: false, nx: 1, ny: 0, qx: W, qy: 0, r: 1 }
  const nx = (C[0] - D[0]) / dist
  const ny = (C[1] - D[1]) / dist
  // The page curls most at the start and lies flat at the end of the turn.
  const p = turnProgress(W, D)
  const r = Math.max(1.5, W * 0.11 * Math.pow(1 - p, 0.8))
  // The axis lies where the corner, rolled over the cylinder, lands on D.
  const t = (dist - Math.PI * r) / 2
  let qx = D[0] + nx * t
  let qy = D[1] + ny * t
  // The spine is fixed: the axis must not pass it. Move the axis toward the corner if it does.
  const past = Math.max(-qx * nx + (0 - qy) * ny, -qx * nx + (H - qy) * ny)
  if (past > 0) {
    qx += nx * past
    qy += ny * past
  }
  return { active: true, nx, ny, qx, qy, r }
}

/** The position of the page point (u, v) on the turning page: [u, v, height above the book]. */
export function curlPoint(c: Curl, u: number, v: number): [number, number, number] {
  if (!c.active) return [u, v, 0]
  const s = (u - c.qx) * c.nx + (v - c.qy) * c.ny
  if (s <= 0) return [u, v, 0]
  const bx = u - c.nx * s
  const by = v - c.ny * s
  const half = Math.PI * c.r
  if (s < half) {
    const a = s / c.r
    const along = c.r * Math.sin(a)
    return [bx + c.nx * along, by + c.ny * along, c.r * (1 - Math.cos(a))]
  }
  const back = s - half
  return [bx - c.nx * back, by - c.ny * back, 2 * c.r]
}

/** The path of the corner in a turn by key or button: across the book, with a small lift. */
export function autoTarget(W: number, H: number, corner: Corner, t: number): [number, number] {
  const [, cy] = cornerPoint(W, H, corner)
  const lift = (corner === 'bottom' ? 1 : -1) * 0.16 * H * Math.sin(Math.PI * t)
  return [W - 2 * W * t, cy + lift]
}
