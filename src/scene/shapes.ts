// The nine base scenes: four flat paper-cut layers each. docs/DESIGN.md section 4.4.
//
// The scene is 1600 by 1000 units: the left page is x 0 to 800, the right page x 800 to 1600.
// The shapes reach past each edge, so that a layer can shift and move in parallax without a gap.
// Each shape has a tone: a small change of lightness from the layer color.
// The shapes come from code with a fixed seed, so each scene is the same at each build.

import { MAX_SHIFT, seeded, TONE_RANGE, type SceneId } from './values.ts'

export const SCENE_W = 1600
export const SCENE_H = 1000
const X0 = -170
const X1 = 1770
const BOTTOM = 1250

/**
 * The text panel of the right page, in scene units: `.spread-text` in src/index.css is 9 % from the
 * left of the right page, 11 % from its right, 6 % from the top, and 7 % from the bottom.
 * POLISH.md item 9: a large shape of a front layer does not cross the left or the right edge.
 */
export const TEXT_PANEL = { left: 800 + 0.09 * 800, right: 800 + 0.89 * 800, top: 60, bottom: 930 }

/** True if a shape from x0 to x1 in a layer can cross the left or the right edge of the text panel, with its shift. */
export function crossesPanelEdge(x0: number, x1: number, layer: number): boolean {
  const s = MAX_SHIFT[layer]
  return [TEXT_PANEL.left, TEXT_PANEL.right].some((edge) => x0 - s < edge && x1 + s > edge)
}

export interface Shape {
  /** SVG path data, in scene units. */
  d: string
  /** Change of lightness from the layer color, -TONE_RANGE to TONE_RANGE. */
  tone?: number
  /** "light": the color of the sun. "star": the color of the sun with the opacity of the stars. "water": the blue of the water (the lake only). */
  fill?: 'light' | 'star' | 'water'
  opacity?: number
}

/** Layer 0 has the extra shapes of the sky. Layers 1 to 3 are the paper layers, back to front. */
export type SceneShapes = [Shape[], Shape[], Shape[], Shape[]]

type Pt = [number, number]
const n1 = (v: number) => Math.round(v * 10) / 10

function poly(points: Pt[]): string {
  return 'M' + points.map(([x, y]) => `${n1(x)} ${n1(y)}`).join('L') + 'Z'
}

/** A closed path through the points, with smooth curves (Catmull-Rom). */
function smooth(points: Pt[], closed = true): string {
  const p = points
  const n = p.length
  const at = (i: number) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))])
  let d = `M${n1(p[0][0])} ${n1(p[0][1])}`
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${n1(c1[0])} ${n1(c1[1])} ${n1(c2[0])} ${n1(c2[1])} ${n1(p2[0])} ${n1(p2[1])}`
  }
  return closed ? d + 'Z' : d
}

function circle(cx: number, cy: number, r: number): string {
  // Clockwise on screen, like poly(), so that overlapping shapes join and do not cut holes.
  return `M${n1(cx - r)} ${n1(cy)}a${n1(r)} ${n1(r)} 0 1 1 ${n1(2 * r)} 0a${n1(r)} ${n1(r)} 0 1 1 ${n1(-2 * r)} 0Z`
}

function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${n1(cx - rx)} ${n1(cy)}a${n1(rx)} ${n1(ry)} 0 1 1 ${n1(2 * rx)} 0a${n1(rx)} ${n1(ry)} 0 1 1 ${n1(-2 * rx)} 0Z`
}

function rect(x: number, y: number, w: number, h: number): string {
  return poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]])
}

/** A door or window: a rectangle with a round top. */
function arched(x: number, y: number, w: number, h: number): string {
  const r = w / 2
  return `M${n1(x)} ${n1(y + h)}L${n1(x)} ${n1(y + r)}a${n1(r)} ${n1(r)} 0 0 1 ${n1(w)} 0L${n1(x + w)} ${n1(y + h)}Z`
}

/** A ground line: a height for each x, from waves with a fixed seed. */
function groundLine(random: () => number, base: number, amp: number, waves = 3): (x: number) => number {
  const parts = Array.from({ length: waves }, (_, i) => ({
    f: (0.0025 + random() * 0.003) * (i + 1),
    p: random() * Math.PI * 2,
    a: amp / (i + 1),
  }))
  return (x) => base + parts.reduce((s, w) => s + Math.sin(x * w.f + w.p) * w.a, 0)
}

/** The area under a ground line, as a closed smooth path. */
function groundShape(f: (x: number) => number, step = 60, bottom = BOTTOM): string {
  const pts: Pt[] = []
  for (let x = X0; x <= X1; x += step) pts.push([x, f(x)])
  return smooth(pts, false) + `L${X1} ${bottom}L${X0} ${bottom}Z`
}

/** A band that follows a ground line, from offset a to offset b below it. */
function band(f: (x: number) => number, a: number, b: number, from = X0, to = X1, step = 40): string {
  const top: Pt[] = []
  const low: Pt[] = []
  for (let x = from; x <= to; x += step) {
    top.push([x, f(x) + a])
    low.push([x, f(x) + b])
  }
  return poly([...top, ...low.reverse()])
}

/** A cluster of circles: a tree crown, a cloud, a bush. */
function cluster(random: () => number, cx: number, cy: number, w: number, h: number, count: number, r: number): string {
  let d = ''
  for (let i = 0; i < count; i++) {
    const a = random() * Math.PI * 2
    const k = Math.sqrt(random())
    d += circle(cx + Math.cos(a) * k * w * 0.5, cy + Math.sin(a) * k * h * 0.5, r * (0.6 + random() * 0.5))
  }
  return d
}

/** A cloud: circles above a flat base. */
function cloud(random: () => number, cx: number, cy: number, w: number): string {
  let d = ''
  const count = Math.round(w / 45)
  for (let i = 0; i < count; i++) {
    const x = cx - w / 2 + (i + 0.5) * (w / count)
    const r = (w / count) * (0.7 + random() * 0.6) * (1 - Math.abs(i - (count - 1) / 2) / count)
    d += circle(x, cy - r * 0.6, r + 10)
  }
  return d + rect(cx - w / 2, cy - 30, w, 30)
}

/** A star with four points. */
function star(cx: number, cy: number, r: number): string {
  const k = r * 0.28
  return poly([[cx, cy - r], [cx + k, cy - k], [cx + r, cy], [cx + k, cy + k], [cx, cy + r], [cx - k, cy + k], [cx - r, cy], [cx - k, cy - k]])
}

const T = TONE_RANGE
/** Water: the light of the sky on the layer color. */
const SHINE: Partial<Shape> = { fill: 'light', opacity: 0.35 }

// ---- 1. Law: a camp of tents in the wilderness below a mountain ----

function camp(): SceneShapes {
  const r = seeded(101)
  // Layer 1: the mountain, with a lower ridge to the right.
  const peak: Pt[] = [[X0, 640], [60, 560]]
  let x = 60
  let y = 560
  while (x < 400) {
    x += 30 + r() * 40
    y = 560 - ((x - 60) / 340) * 380 + (r() - 0.5) * 40
    peak.push([x, y])
  }
  peak.push([430, 170])
  x = 430
  while (x < 980) {
    x += 30 + r() * 40
    y = 170 + ((x - 430) / 550) * 420 + (r() - 0.5) * 40
    peak.push([x, y])
  }
  const ridge = groundLine(r, 610, 25)
  for (x = 1040; x <= X1; x += 60) peak.push([x, ridge(x)])
  peak.push([X1, BOTTOM], [X0, BOTTOM])
  const layer1: Shape[] = [{ d: poly(peak) }]
  // Light faces on the left of the peak: the sun from the top left.
  layer1.push({ d: poly([[430, 170], [330, 330], [260, 420], [350, 380], [400, 460], [440, 300]]), tone: T * 0.7 })
  layer1.push({ d: poly([[200, 470], [120, 560], [210, 540], [250, 600], [280, 500]]), tone: T * 0.5 })

  // Layer 2: the ground of the camp, and the tents.
  const g2 = groundLine(r, 745, 14)
  const layer2: Shape[] = [{ d: groundShape(g2) }]
  // No tent stands across an edge of the text panel (POLISH.md item 9).
  const tents = [40, 150, 215, 330, 470, 545, 690, 800, 950, 1030, 1200, 1320, 1650]
  for (const [k, tx] of tents.entries()) {
    const big = k % 3 === 0
    const w = (big ? 120 : 70) + r() * 40
    const h = (big ? 70 : 42) + r() * 20
    const base = g2(tx) + 6 + (k % 2) * 22
    layer2.push({ d: poly([[tx - w / 2, base], [tx - w * 0.08, base - h], [tx + w * 0.12, base - h + 4], [tx + w / 2, base]]), tone: T * 0.4 })
    layer2.push({ d: poly([[tx - w * 0.08, base - h], [tx + w * 0.12, base - h + 4], [tx + w / 2, base], [tx + w * 0.1, base]]), tone: -T * 0.3 })
    layer2.push({ d: poly([[tx - 6, base], [tx - 1, base - h * 0.45], [tx + 6, base]]), tone: -T })
  }

  // Layer 3: rocks and desert scrub in front.
  const g3 = groundLine(r, 905, 20)
  const layer3: Shape[] = [{ d: groundShape(g3) }]
  const rocks: [number, number][] = [[-60, 150], [120, 90], [520, 60], [1180, 80], [1380, 140], [1640, 120]]
  for (const [rx, rw] of rocks) {
    const base = g3(rx) + 10
    const pts: Pt[] = [[rx - rw / 2, base]]
    for (let i = 1; i < 6; i++) pts.push([rx - rw / 2 + (rw * i) / 6 + (r() - 0.5) * 12, base - rw * (0.35 + r() * 0.35) * Math.sin((Math.PI * i) / 6)])
    pts.push([rx + rw / 2, base])
    layer3.push({ d: poly(pts), tone: -T * 0.4 })
    layer3.push({ d: poly([pts[1], pts[2], [pts[2][0], base], [pts[1][0], base]]), tone: T * 0.4 })
  }
  for (const bx of [260, 360, 700, 860, 980, 1500]) layer3.push({ d: cluster(r, bx, g3(bx) - 14, 70, 26, 7, 16), tone: -T * 0.7 })
  return [[], layer1, layer2, layer3]
}

// ---- 2. History, with Acts: a walled city with a gate, and fields of grain ----

function city(): SceneShapes {
  const r = seeded(202)
  const g1 = groundLine(r, 560, 30)
  const layer1: Shape[] = [{ d: groundShape(g1) }, { d: band(groundLine(r, 600, 20), 0, 400), tone: -T * 0.3 }]

  // Layer 2: houses behind the wall, the wall, towers, and the gate. The city ends on the left
  // page, so that no house or tower stands at the edge of the text panel (POLISH.md item 9).
  const ground = 770
  const layer2: Shape[] = []
  for (let hx = 90; hx < 690; hx += 55 + r() * 30) {
    const w = 60 + r() * 40
    const h = 60 + r() * 90
    layer2.push({ d: rect(hx, 600 - h, w, h + 200), tone: T * 0.5 })
    layer2.push({ d: rect(hx + w * 0.3, 600 - h + 18, 10, 16), tone: -T })
  }
  layer2.push({ d: groundShape(groundLine(r, ground, 8)) })
  const wall: Pt[] = [[40, ground + 20], [40, 600]]
  for (let wx = 40; wx < 760; wx += 36) wall.push([wx, 600], [wx, 584], [wx + 18, 584], [wx + 18, 600])
  wall.push([760, 600], [760, ground + 20])
  layer2.push({ d: poly(wall) })
  for (const tx of [40, 480, 640, 760]) {
    const w = tx === 480 || tx === 640 ? 80 : 90
    const top = tx === 480 || tx === 640 ? 500 : 530
    const left = tx - w / 2
    const t: Pt[] = [[left, ground + 20], [left, top]]
    for (let k = 0; k < 4; k++) t.push([left + (k * w) / 4, top - 18], [left + (k * w) / 4 + w / 8, top - 18], [left + (k * w) / 4 + w / 8, top])
    t.push([left + w, top], [left + w, ground + 20])
    layer2.push({ d: poly(t), tone: -T * 0.2 })
    layer2.push({ d: rect(tx - 6, top + 30, 12, 26), tone: -T })
  }
  layer2.push({ d: arched(510, 640, 100, 135), tone: -T })
  layer2.push({ d: rect(40, 600, 720, 8), tone: T * 0.4 })

  // Layer 3: fields of grain in front, with rows and sheaves.
  const g3 = groundLine(r, 850, 18)
  const layer3: Shape[] = [{ d: groundShape(g3) }]
  for (let k = 0; k < 6; k++) layer3.push({ d: band(g3, 30 + k * 34, 42 + k * 34), tone: k % 2 ? T * 0.5 : -T * 0.3 })
  for (let sx = X0 + 20; sx < X1; sx += 22 + r() * 10) {
    const base = g3(sx) + 4
    const h = 26 + r() * 22
    layer3.push({ d: poly([[sx - 2, base], [sx + 1, base - h], [sx + 3, base]]) + ellipse(sx + 1, base - h - 7, 4, 10), tone: T * 0.6 })
  }
  for (const bx of [300, 760, 1240]) {
    const base = g3(bx) + 40
    layer3.push({ d: poly([[bx - 22, base], [bx - 10, base - 40], [bx - 24, base - 70], [bx + 24, base - 70], [bx + 10, base - 40], [bx + 22, base]]), tone: T * 0.8 })
    layer3.push({ d: rect(bx - 12, base - 44, 24, 7), tone: -T * 0.6 })
  }
  return [[], layer1, layer2, layer3]
}

// ---- 3. Poetry & Wisdom: a stream through grazing hills, with a tree by the water ----

function stream(): SceneShapes {
  const r = seeded(303)
  const hillA = groundLine(r, 540, 60, 2)
  const hillB = groundLine(r, 610, 40, 2)
  const layer1: Shape[] = [{ d: groundShape(hillA) }, { d: groundShape(hillB), tone: -T * 0.4 }]
  // The flock: small sheep on the slopes, lighter than the hills.
  for (const [sx, onB] of [[620, 0], [660, 0], [700, 0], [740, 1], [800, 1], [1040, 0], [1090, 0], [1140, 1], [1200, 1], [1250, 1], [1330, 0]] as [number, number][]) {
    const f = onB ? hillB : hillA
    const y = f(sx) + 14 + r() * 10
    const d = ellipse(sx, y, 14, 8) + circle(sx + (r() > 0.5 ? 14 : -14), y - 4, 5) + rect(sx - 8, y + 5, 3, 7) + rect(sx + 6, y + 5, 3, 7)
    layer1.push({ d, tone: T })
  }

  // Layer 2: the tree by the water, on the near bank.
  const g2 = groundLine(r, 800, 10)
  const layer2: Shape[] = [{ d: groundShape(g2) }]
  const tx = 330
  const base = g2(tx) + 10
  layer2.push({ d: poly([[tx - 32, base], [tx - 14, 600], [tx - 70, 520], [tx - 60, 510], [tx - 8, 570], [tx - 4, 470], [tx + 6, 470], [tx + 10, 560], [tx + 70, 500], [tx + 78, 512], [tx + 16, 600], [tx + 34, base]]), tone: -T * 0.6 })
  layer2.push({ d: cluster(r, tx, 420, 380, 220, 22, 62) })
  layer2.push({ d: cluster(r, tx - 50, 380, 220, 120, 10, 44), tone: T * 0.5 })
  // A second, smaller tree on the right page, low. It stands well inside the text panel, so that the
  // panel covers it and it does not show at the edge of the text (POLISH.md item 9).
  layer2.push({ d: rect(1180, g2(1180) - 120, 14, 140), tone: -T * 0.6 })
  layer2.push({ d: cluster(r, 1187, g2(1180) - 150, 150, 90, 10, 36) })

  // Layer 3: the stream and the grass in front.
  const g3 = groundLine(r, 870, 12)
  const layer3: Shape[] = [{ d: groundShape(g3) }]
  const water: Pt[] = []
  const waterLow: Pt[] = []
  for (let wx = X0; wx <= X1; wx += 50) {
    const mid = 905 + Math.sin(wx / 260) * 22 + (wx / X1) * 40
    const half = 22 + (wx / X1) * 30
    water.push([wx, mid - half])
    waterLow.push([wx, mid + half])
  }
  const streamPath = smooth(water, false) + 'L' + waterLow.reverse().map(([a, b]) => `${n1(a)} ${n1(b)}`).join('L') + 'Z'
  layer3.push({ d: streamPath, tone: T }, { d: streamPath, ...SHINE })
  for (let k = 0; k < 6; k++) {
    const wx = 100 + k * 260 + r() * 80
    layer3.push({ d: rect(wx, 905 + Math.sin(wx / 260) * 22 + (wx / X1) * 40 - 3, 60 + r() * 50, 4), tone: -T * 0.2 })
  }
  for (let gx = X0; gx < X1; gx += 30 + r() * 30) {
    const y0 = g3(gx) + 4
    layer3.push({ d: poly([[gx - 8, y0 + 8], [gx - 4, y0 - 22 - r() * 16], [gx, y0 + 4], [gx + 5, y0 - 18 - r() * 16], [gx + 9, y0 + 8]]), tone: -T * 0.5 })
  }
  return [[], layer1, layer2, layer3]
}

// ---- 4. Major Prophets: a watchtower on a hill above a great river ----

function watchtower(): SceneShapes {
  const r = seeded(404)
  // Layer 1: the river plain, with far low hills and the wide river.
  const far = groundLine(r, 585, 14)
  const layer1: Shape[] = [{ d: groundShape(far) }, { d: groundShape(groundLine(r, 640, 6)), tone: -T * 0.3 }]
  const river: Pt[] = []
  const riverLow: Pt[] = []
  for (let wx = X0; wx <= X1; wx += 60) {
    const mid = 690 + Math.sin(wx / 330 + 1) * 26
    const half = 30 + ((wx - X0) / (X1 - X0)) * 30
    river.push([wx, mid - half])
    riverLow.push([wx, mid + half])
  }
  const riverPath = smooth(river, false) + 'L' + riverLow.reverse().map(([a, b]) => `${n1(a)} ${n1(b)}`).join('L') + 'Z'
  layer1.push({ d: riverPath, tone: T }, { d: riverPath, ...SHINE })
  for (let k = 0; k < 5; k++) layer1.push({ d: rect(200 + k * 300 + r() * 60, 686 + Math.sin(k) * 14, 70, 3), tone: T * 0.3 })

  // Layer 2: the hill and the watchtower on it.
  const hill: Pt[] = [[X0, 760], [40, 680], [170, 610], [270, 582], [390, 580], [480, 630], [560, 760], [640, 850], [900, 880], [X1, 885], [X1, BOTTOM], [X0, BOTTOM]]
  const layer2: Shape[] = [{ d: smooth(hill) }]
  const cx = 330
  const top = 300
  const base = 590
  layer2.push({ d: poly([[cx - 52, base], [cx - 44, top + 40], [cx + 44, top + 40], [cx + 52, base]]), tone: -T * 0.2 })
  const deck: Pt[] = [[cx - 62, top + 44], [cx - 62, top]]
  for (let k = 0; k < 5; k++) deck.push([cx - 62 + k * 24.8, top - 20], [cx - 62 + k * 24.8 + 12.4, top - 20], [cx - 62 + k * 24.8 + 12.4, top])
  deck.push([cx + 62, top], [cx + 62, top + 44])
  layer2.push({ d: poly(deck), tone: -T * 0.4 })
  layer2.push({ d: poly([[cx - 52, top + 44], [cx - 44, top + 60], [cx + 44, top + 60], [cx + 52, top + 44]]), tone: -T })
  for (const wy of [top + 90, top + 160]) layer2.push({ d: rect(cx - 5, wy, 10, 30), tone: -T })
  layer2.push({ d: arched(cx - 16, base - 56, 32, 56), tone: -T })
  layer2.push({ d: poly([[cx - 44, top + 60], [cx - 20, top + 60], [cx - 26, base], [cx - 52, base]]), tone: T * 0.5 })

  // Layer 3: the stones of the near river bank, reeds, and the edge of the water.
  const g3 = groundLine(r, 900, 14)
  const layer3: Shape[] = [{ d: groundShape(g3) }, { d: band(g3, 120, 600), tone: T * 0.9 }]
  for (let sx = X0 + 40; sx < X1; sx += 70 + r() * 90) {
    const w = 30 + r() * 50
    const stone = { d: ellipse(sx, g3(sx) + 18 + r() * 40, w, w * 0.5), tone: r() > 0.5 ? T * 0.4 : -T * 0.5 }
    // A large stone at an edge of the text panel is left out. The random numbers stay in the same order.
    if (!(w >= 30 && crossesPanelEdge(sx - w, sx + w, 3))) layer3.push(stone)
  }
  for (const rx of [80, 640, 1120, 1560]) {
    for (let k = 0; k < 7; k++) {
      const bx = rx + k * 9
      const y0 = g3(bx) + 10
      layer3.push({ d: poly([[bx - 3, y0], [bx + (r() - 0.5) * 30, y0 - 70 - r() * 50], [bx + 3, y0]]), tone: -T * 0.7 })
    }
  }
  return [[], layer1, layer2, layer3]
}

// ---- 5. Minor Prophets: farm country of vines and fig trees, with a threshing floor ----

function farm(): SceneShapes {
  const r = seeded(505)
  // Layer 1: terraced hills.
  const hillA = groundLine(r, 520, 50, 2)
  const hillB = groundLine(r, 600, 36, 2)
  const layer1: Shape[] = [{ d: groundShape(hillA) }]
  for (let k = 0; k < 4; k++) layer1.push({ d: band(hillA, 24 + k * 30, 30 + k * 30), tone: -T * 0.6 })
  layer1.push({ d: groundShape(hillB), tone: -T * 0.25 })
  for (let k = 0; k < 3; k++) layer1.push({ d: band(hillB, 22 + k * 28, 28 + k * 28), tone: -T * 0.8 })

  // Layer 2: rows of vines on posts, and fig trees. The fig trees stand clear of the edges of the
  // text panel: one on the left page and one inside the panel (POLISH.md item 9).
  const FIGS = [170, 640, 1180]
  const g2 = groundLine(r, 760, 10)
  const layer2: Shape[] = [{ d: groundShape(g2) }]
  for (let row = 0; row < 2; row++) {
    for (let vx = X0 + 40 + row * 30; vx < X1; vx += 62) {
      if (FIGS.some((fx) => Math.abs(vx - fx) < (fx === 170 ? 120 : 110))) continue
      const y0 = g2(vx) + row * 26
      layer2.push({ d: rect(vx - 2, y0 - 46, 4, 50), tone: -T * 0.7 })
      layer2.push({ d: cluster(r, vx, y0 - 44, 54, 22, 5, 12), tone: row ? -T * 0.2 : T * 0.2 })
    }
  }
  for (const fx of FIGS) {
    const y0 = g2(fx) + 20
    layer2.push({ d: poly([[fx - 14, y0], [fx - 8, y0 - 80], [fx - 40, y0 - 120], [fx - 30, y0 - 126], [fx, y0 - 96], [fx + 34, y0 - 130], [fx + 42, y0 - 122], [fx + 8, y0 - 80], [fx + 14, y0]]), tone: -T * 0.7 })
    layer2.push({ d: cluster(r, fx, y0 - 150, 230, 110, 14, 38), tone: -T * 0.2 })
    for (let k = 0; k < 6; k++) {
      const lx = fx - 90 + r() * 180
      const ly = y0 - 190 + r() * 80
      layer2.push({ d: poly([[lx, ly - 14], [lx + 10, ly - 4], [lx + 14, ly + 8], [lx, ly + 14], [lx - 14, ly + 8], [lx - 10, ly - 4]]), tone: T * 0.5 })
    }
  }

  // Layer 3: the threshing floor in front, a flat round floor with a heap of grain.
  const g3 = groundLine(r, 880, 10)
  const layer3: Shape[] = [{ d: groundShape(g3) }]
  layer3.push({ d: ellipse(430, 950, 300, 62), tone: -T * 0.5 })
  layer3.push({ d: ellipse(430, 944, 280, 52), tone: T * 0.7 })
  for (let k = 0; k < 18; k++) {
    const a = (k / 18) * Math.PI * 2
    layer3.push({ d: ellipse(430 + Math.cos(a) * 292, 950 + Math.sin(a) * 60, 16, 8), tone: -T * 0.8 })
  }
  layer3.push({ d: smooth([[330, 950], [370, 900], [430, 880], [490, 900], [530, 950]], false) + 'Z', tone: T })
  for (let gx = 900; gx < X1; gx += 26 + r() * 20) {
    const y0 = g3(gx) + 6
    layer3.push({ d: poly([[gx - 5, y0], [gx, y0 - 22 - r() * 18], [gx + 5, y0]]), tone: -T * 0.5 })
  }
  return [[], layer1, layer2, layer3]
}

// ---- 6. Gospels: a lake shore with fishing boats ----

function boat(x: number, y: number, w: number): Shape[] {
  const h = w * 0.22
  return [
    { d: `M${n1(x - w / 2)} ${n1(y - h)}Q${n1(x)} ${n1(y + h)} ${n1(x + w / 2)} ${n1(y - h)}L${n1(x + w * 0.38)} ${n1(y - h * 0.4)}L${n1(x - w * 0.38)} ${n1(y - h * 0.4)}Z`, tone: -T },
    { d: rect(x - 2, y - h - w * 0.75, 4, w * 0.75), tone: -T },
    { d: poly([[x + 4, y - h - w * 0.72], [x + w * 0.42, y - h - 6], [x + 4, y - h - 6]]), tone: T },
  ]
}

function lake(): SceneShapes {
  const r = seeded(606)
  const layer1: Shape[] = [{ d: groundShape(groundLine(r, 500, 34, 2)), tone: -T * 0.3 }, { d: groundShape(groundLine(r, 545, 18, 2)), tone: -T * 0.8 }]

  // Layer 2: the lake, with boats and small waves.
  const lakePath = rect(X0, 570, X1 - X0, BOTTOM - 570)
  // The water is blue at each time of day (POLISH.md item 7). The sky and the shore keep the cloth color.
  const layer2: Shape[] = [{ d: lakePath, tone: T, fill: 'water' }, { d: lakePath, ...SHINE }]
  for (let k = 0; k < 18; k++) layer2.push({ d: rect(X0 + r() * (X1 - X0), 600 + r() * 220, 40 + r() * 60, 3), tone: -T * 0.4, fill: 'water' })
  // The small boat stays inside the text panel, away from its right edge (POLISH.md item 9).
  layer2.push(...boat(200, 700, 170), ...boat(560, 650, 120), ...boat(1180, 720, 150), ...boat(1360, 630, 90))

  // Layer 3: the shore with nets on poles, stones, and a beached boat.
  const g3 = groundLine(r, 860, 14)
  const layer3: Shape[] = [{ d: groundShape(g3) }]
  for (const px of [120, 300]) layer3.push({ d: rect(px - 4, g3(px) - 150, 8, 170), tone: -T })
  layer3.push({ d: `M116 ${n1(g3(120) - 140)}Q210 ${n1(g3(210) - 40)} 304 ${n1(g3(300) - 140)}L300 ${n1(g3(300) - 90)}Q210 ${n1(g3(210) + 10)} 120 ${n1(g3(120) - 90)}Z`, tone: T * 0.3 })
  for (let k = 0; k < 7; k++) layer3.push({ d: rect(130 + k * 24, g3(210) - 120 + Math.abs(k - 3) * 9, 2, 60), tone: -T * 0.6 })
  for (let k = 0; k < 3; k++) layer3.push({ d: rect(126, g3(210) - 110 + k * 22, 172, 2), tone: -T * 0.6 })
  for (let sx = 420; sx < X1; sx += 80 + r() * 120) layer3.push({ d: ellipse(sx, g3(sx) + 30 + r() * 60, 18 + r() * 22, 9 + r() * 8), tone: -T * 0.5 })
  const bx = 1320
  const by = g3(bx) + 20
  layer3.push({ d: `M${bx - 120} ${n1(by - 30)}Q${bx} ${n1(by + 40)} ${bx + 120} ${n1(by - 30)}L${bx + 100} ${n1(by - 10)}L${bx - 100} ${n1(by - 10)}Z`, tone: -T * 0.8 })
  return [[], layer1, layer2, layer3]
}

// ---- 7. Letters of Paul: a Roman town where a church meets in a home ----

function tiledRoof(x: number, y: number, w: number, h: number): Shape[] {
  const out: Shape[] = [{ d: poly([[x - 10, y], [x + w / 2, y - h], [x + w + 10, y]]), tone: -T * 0.6 }]
  for (let k = 1; k < 4; k++) {
    const yy = y - (h * k) / 4
    const half = (w / 2 + 10) * (1 - k / 4)
    out.push({ d: rect(x + w / 2 - half, yy - 1, half * 2, 2), tone: -T })
  }
  return out
}

function town(): SceneShapes {
  const r = seeded(707)
  // Layer 1: tile roofs of the town on a slope, and a temple with a pediment at the top.
  const slope = (x: number) => 600 - Math.max(0, 700 - Math.abs(x - 600)) * 0.18
  const layer1: Shape[] = [{ d: groundShape(slope, 50) }]
  for (let hx = X0 + 20; hx < X1; hx += 70 + r() * 40) {
    if (hx > 470 && hx < 730) continue
    const w = 60 + r() * 40
    const h = 30 + r() * 40
    const y0 = slope(hx + w / 2) - 10 + r() * 20
    layer1.push({ d: rect(hx, y0 - h, w, h + 60), tone: T * 0.4 })
    layer1.push(...tiledRoof(hx, y0 - h, w, 20))
    layer1.push({ d: rect(hx + w / 2 - 5, y0 - h + 12, 10, 12), tone: -T })
  }
  const ty = slope(600)
  layer1.push({ d: rect(480, ty - 30, 240, 30), tone: -T * 0.2 })
  for (let k = 0; k < 6; k++) layer1.push({ d: rect(495 + k * 40, ty - 120, 14, 92), tone: T * 0.5 })
  layer1.push({ d: rect(484, ty - 132, 232, 14), tone: -T * 0.2 })
  layer1.push({ d: poly([[476, ty - 132], [600, ty - 182], [724, ty - 132]]), tone: -T * 0.5 })

  // Layer 2: houses with columns, a portico, and an arch.
  const ground = 800
  const layer2: Shape[] = [{ d: rect(X0, ground - 10, X1 - X0, BOTTOM - ground + 10) }]
  // A portico: columns under a pediment.
  layer2.push({ d: rect(66, ground - 200, 388, 170), tone: -T * 0.9 })
  layer2.push({ d: rect(60, ground - 30, 400, 30), tone: -T * 0.2 })
  for (let k = 0; k < 6; k++) {
    const cx = 80 + k * 72
    layer2.push({ d: rect(cx, ground - 200, 26, 170), tone: T * 0.6 })
    layer2.push({ d: rect(cx - 6, ground - 210, 38, 12), tone: T * 0.2 })
    layer2.push({ d: rect(cx - 6, ground - 40, 38, 10), tone: T * 0.2 })
  }
  layer2.push({ d: rect(54, ground - 236, 412, 26), tone: -T * 0.2 })
  layer2.push({ d: poly([[46, ground - 236], [260, ground - 316], [474, ground - 236]]), tone: -T * 0.5 })
  // An arch.
  layer2.push({ d: rect(560, ground - 260, 240, 260), tone: -T * 0.2 })
  layer2.push({ d: rect(548, ground - 284, 264, 26), tone: -T * 0.5 })
  layer2.push({ d: arched(620, ground - 190, 120, 190), tone: -T })
  for (const cx of [572, 768]) layer2.push({ d: rect(cx, ground - 250, 20, 240), tone: T * 0.4 })
  // Houses: a house with a door and arched windows, where a church can meet. The three houses stand
  // inside the text panel, clear of its edges (POLISH.md item 9).
  for (const [hx, w, h] of [[920, 190, 190], [1130, 160, 150], [1310, 160, 210]] as [number, number, number][]) {
    layer2.push({ d: rect(hx, ground - h, w, h), tone: T * 0.3 })
    layer2.push(...tiledRoof(hx, ground - h, w, 46))
    layer2.push({ d: arched(hx + w / 2 - 22, ground - 92, 44, 92), tone: -T })
    for (const wx of [hx + 26, hx + w - 56]) layer2.push({ d: arched(wx, ground - h + 34, 30, 44), tone: -T })
  }

  // Layer 3: the street, with paving stones and a low wall.
  const layer3: Shape[] = [{ d: rect(X0, 880, X1 - X0, BOTTOM - 880) }]
  for (let row = 0; row < 5; row++) {
    for (let px = X0 + (row % 2) * 40; px < X1; px += 80) {
      layer3.push({ d: rect(px + 4, 896 + row * 30, 72, 24), tone: (r() - 0.5) * T })
    }
  }
  layer3.push({ d: rect(X0, 860, X1 - X0, 24), tone: -T * 0.5 })
  layer3.push({ d: poly([[1240, 860], [1250, 800], [1280, 790], [1300, 760], [1320, 790], [1350, 800], [1360, 860]]), tone: -T * 0.3 })
  return [[], layer1, layer2, layer3]
}

// ---- 8. General Letters: travellers on a road through grassy hills, with wild flowers ----

function traveller(x: number, y: number, s: number): Shape {
  // A small plain figure: a head, a robe, and a staff. No face.
  return {
    d: circle(x, y - s * 0.86, s * 0.11) + poly([[x - s * 0.16, y], [x - s * 0.1, y - s * 0.72], [x + s * 0.1, y - s * 0.72], [x + s * 0.18, y]]) + rect(x + s * 0.22, y - s * 0.95, s * 0.03, s * 0.95),
    tone: -T,
  }
}

function road(): SceneShapes {
  const r = seeded(808)
  // Layer 0: the morning star, low in the sky. It shows only at dawn and at night.
  const sky: Shape[] = [{ d: star(250, 250, 30), fill: 'star' }, { d: circle(250, 250, 9), fill: 'star' }]
  const layer1: Shape[] = [
    { d: groundShape(groundLine(r, 520, 50, 2)) },
    { d: groundShape(groundLine(r, 590, 40, 2)), tone: -T * 0.4 },
  ]
  // Layer 2: a hill with the road, which narrows as it goes to the far right.
  const g2 = groundLine(r, 720, 22, 2)
  const layer2: Shape[] = [{ d: groundShape(g2) }]
  const top: Pt[] = []
  const low: Pt[] = []
  for (let k = 0; k <= 20; k++) {
    const t = k / 20
    const x = X0 + t * (1500 - X0)
    const mid = 900 - t * (900 - g2(1500) - 12) + Math.sin(t * Math.PI * 1.6) * 34
    const half = 90 * (1 - t) + 8
    top.push([x, mid - half])
    low.push([x, mid + half])
  }
  layer2.push({ d: smooth(top, false) + 'L' + low.reverse().map(([a, b]) => `${n1(a)} ${n1(b)}`).join('L') + 'Z', tone: T })
  const roadAt = (t: number): Pt => [X0 + t * (1500 - X0), 900 - t * (900 - g2(1500) - 12) + Math.sin(t * Math.PI * 1.6) * 34]
  for (const [t, s] of [[0.3, 92], [0.35, 84], [0.62, 56]] as [number, number][]) {
    const [x, y] = roadAt(t)
    layer2.push(traveller(x, y, s))
  }
  // Layer 3: grass and wild flowers in front.
  const g3 = (x: number) => 950 + Math.sin(x / 170) * 14
  const layer3: Shape[] = [{ d: groundShape(g3) }]
  for (let gx = X0; gx < X1; gx += 16 + r() * 18) {
    const y0 = g3(gx) + 6
    layer3.push({ d: poly([[gx - 4, y0], [gx + (r() - 0.5) * 20, y0 - 30 - r() * 40], [gx + 4, y0]]), tone: -T * 0.5 })
  }
  for (let fx = X0 + 30; fx < X1; fx += 50 + r() * 60) {
    const y0 = g3(fx) - 20 - r() * 40
    let d = rect(fx - 1.5, y0, 3, 50)
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2
      d += circle(fx + Math.cos(a) * 8, y0 + Math.sin(a) * 8, 6)
    }
    layer3.push({ d, tone: T })
    layer3.push({ d: circle(fx, y0, 4), tone: -T * 0.6 })
  }
  return [sky, layer1, layer2, layer3]
}

// ---- 9. Prophecy: clouds with heaven opening in light, above an island coast ----

function heaven(): SceneShapes {
  const r = seeded(909)
  // Layer 0: an opening of light in the sky, with rays.
  const sky: Shape[] = [{ d: circle(560, 300, 150), fill: 'light', opacity: 0.55 }, { d: circle(560, 300, 80), fill: 'light', opacity: 0.8 }]
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2 + 0.13
    const b = a + 0.12
    sky.push({ d: poly([[560, 300], [560 + Math.cos(a) * 900, 300 + Math.sin(a) * 900], [560 + Math.cos(b) * 900, 300 + Math.sin(b) * 900]]), fill: 'light', opacity: 0.18 })
  }
  // Layer 1: high clouds around the opening.
  const layer1: Shape[] = []
  for (const [cx, cy, w] of [[60, 200, 420], [340, 120, 300], [900, 150, 420], [1250, 230, 460], [1600, 160, 380], [150, 420, 360], [1050, 420, 520]] as [number, number, number][]) {
    layer1.push({ d: cloud(r, cx, cy, w) })
    layer1.push({ d: cloud(r, cx + 30, cy - 10, w * 0.6), tone: T * 0.6 })
  }
  // Layer 2: clouds with a rainbow.
  const layer2: Shape[] = []
  const bands = 5
  // The rainbow stands on the left page, and the clouds and the island stand clear of the edges of the
  // text panel (POLISH.md item 9).
  for (let k = 0; k < bands; k++) {
    const ro = 360 - k * 22
    const ri = ro - 22
    const cx = 400
    const cy = 860
    layer2.push({ d: `M${cx - ro} ${cy}A${ro} ${ro} 0 0 1 ${cx + ro} ${cy}L${cx + ri} ${cy}A${ri} ${ri} 0 0 0 ${cx - ri} ${cy}Z`, tone: k % 2 ? T : -T * 0.2 })
  }
  for (const [cx, cy, w] of [[140, 930, 520], [1190, 930, 420]] as [number, number, number][]) {
    layer2.push({ d: cloud(r, cx, cy, w) })
    layer2.push({ d: cloud(r, cx - 40, cy - 30, w * 0.5), tone: T * 0.5 })
  }
  // Layer 3: the sea and the rocks of an island coast.
  const layer3: Shape[] = [{ d: rect(X0, 900, X1 - X0, BOTTOM - 900), tone: T * 0.5 }]
  for (let k = 0; k < 10; k++) layer3.push({ d: rect(X0 + r() * (X1 - X0), 915 + r() * 60, 50 + r() * 70, 3), tone: T })
  const island: Pt[] = [[940, 960], [970, 880], [995, 860], [1018, 800], [1045, 775], [1070, 705], [1100, 692], [1140, 740], [1175, 732], [1210, 800], [1255, 810], [1290, 762], [1325, 790], [1370, 850], [1415, 900], [1440, 960], [1440, BOTTOM], [940, BOTTOM]]
  layer3.push({ d: poly(island), tone: -T * 0.4 })
  layer3.push({ d: poly([[1070, 705], [1100, 692], [1088, 760], [1058, 800], [1045, 775]]), tone: T * 0.3 })
  for (const [rx, rw] of [[120, 90], [260, 60], [600, 50]] as [number, number][]) {
    layer3.push({ d: poly([[rx - rw / 2, 960], [rx - rw * 0.2, 920 - r() * 30], [rx + rw * 0.1, 910 - r() * 30], [rx + rw / 2, 960]]), tone: -T * 0.6 })
  }
  return [sky, layer1, layer2, layer3]
}

const BUILDERS: Record<SceneId, () => SceneShapes> = { camp, city, stream, watchtower, farm, lake, town, road, heaven }
const cache = new Map<SceneId, SceneShapes>()

/** The shapes of a base scene. They are made once. */
export function sceneShapes(id: SceneId): SceneShapes {
  let s = cache.get(id)
  if (!s) {
    s = BUILDERS[id]()
    cache.set(id, s)
  }
  return s
}

/** The stars of the night sky: the same for each scene. */
export function starField(): Shape[] {
  const r = seeded(4242)
  const out: Shape[] = []
  for (let k = 0; k < 70; k++) {
    const x = X0 + r() * (X1 - X0)
    const y = 20 + r() * r() * 480
    out.push({ d: r() > 0.85 ? star(x, y, 7 + r() * 5) : circle(x, y, 1.5 + r() * 2), fill: 'star' })
  }
  return out
}
