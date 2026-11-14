// The values that make one scene for one chapter. docs/DESIGN.md section 4.4.
//
// - The scene: one of the nine base scenes, from the category of the book.
// - The time of day: from the position of the chapter in its book. The first chapter is dawn,
//   the middle of the book is day, the last chapters are dusk, and the last chapter is night.
//   The colors change a little from one chapter to the next.
// - The colors: near the cloth color of the group.
// - The shifts of each layer: small, from a fixed number made from the book and the chapter.
// - The color of the text and of the veil behind it: 4.5 to 1 or more. docs/DESIGN.md section 4.3.

import { contrastRatio } from '../data/contrast.ts'
import { groupOf, type Book, type GroupName } from '../data/books.ts'
import { hslToHex, mix, over, rgbToHsl, shade } from './color.ts'

/** The nine base scenes. docs/DESIGN.md section 4.4. */
export type SceneId = 'camp' | 'city' | 'stream' | 'watchtower' | 'farm' | 'lake' | 'town' | 'road' | 'heaven'

export const SCENE_OF_GROUP: Record<GroupName, SceneId> = {
  Law: 'camp',
  History: 'city',
  'History (Acts)': 'city',
  'Poetry & Wisdom': 'stream',
  'Major Prophets': 'watchtower',
  'Minor Prophets': 'farm',
  Gospels: 'lake',
  'Letters of Paul': 'town',
  'General Letters': 'road',
  Prophecy: 'heaven',
}

export type Phase = 'dawn' | 'day' | 'dusk' | 'night'

/** The position of a chapter in its book: 0 for the first chapter, 1 for the last. A book with one chapter is 0.5. */
export function dayPosition(chapter: number, chapters: number): number {
  return chapters <= 1 ? 0.5 : (chapter - 1) / (chapters - 1)
}

/** The name of the time of day at a position. Only the last chapter is night. */
export function phaseOf(h: number): Phase {
  if (h >= 1) return 'night'
  if (h < 0.15) return 'dawn'
  if (h < 0.7) return 'day'
  return 'dusk'
}

/** A position that represents each time of day, for tests and screenshots. */
export const PHASE_POSITION: Record<Phase, number> = { dawn: 0, day: 0.5, dusk: 0.88, night: 1 }

// Light keyframes along the day. L values are HSL lightness. warm and cool are tint amounts.
interface Light {
  skyTop: number
  skyHorizon: number
  layers: [number, number, number]
  /** Tint of the horizon: orange at dawn and dusk. */
  warm: number
  /** Tint of the whole scene: blue at night. */
  cool: number
  stars: number
}
const KEYS: [number, Light][] = [
  [0, { skyTop: 0.42, skyHorizon: 0.8, layers: [0.6, 0.47, 0.35], warm: 0.45, cool: 0.18, stars: 0.6 }],
  [0.12, { skyTop: 0.66, skyHorizon: 0.86, layers: [0.68, 0.55, 0.42], warm: 0.25, cool: 0.05, stars: 0 }],
  [0.3, { skyTop: 0.84, skyHorizon: 0.92, layers: [0.74, 0.6, 0.46], warm: 0.05, cool: 0, stars: 0 }],
  [0.65, { skyTop: 0.84, skyHorizon: 0.92, layers: [0.74, 0.6, 0.46], warm: 0.05, cool: 0, stars: 0 }],
  [0.88, { skyTop: 0.46, skyHorizon: 0.7, layers: [0.5, 0.38, 0.27], warm: 0.5, cool: 0.12, stars: 0 }],
  [0.999, { skyTop: 0.26, skyHorizon: 0.42, layers: [0.32, 0.24, 0.16], warm: 0.2, cool: 0.3, stars: 0 }],
  [1, { skyTop: 0.12, skyHorizon: 0.22, layers: [0.26, 0.19, 0.12], warm: 0, cool: 0.4, stars: 1 }],
]

function lightAt(h: number): Light {
  const i = Math.max(0, KEYS.findIndex(([k]) => k >= h) - 1)
  const [k0, a] = KEYS[i]
  const [k1, b] = KEYS[Math.min(i + 1, KEYS.length - 1)]
  const t = k1 === k0 ? 0 : Math.min(1, Math.max(0, (h - k0) / (k1 - k0)))
  const n = (x: number, y: number) => x + (y - x) * t
  return {
    skyTop: n(a.skyTop, b.skyTop),
    skyHorizon: n(a.skyHorizon, b.skyHorizon),
    layers: [n(a.layers[0], b.layers[0]), n(a.layers[1], b.layers[1]), n(a.layers[2], b.layers[2])],
    warm: n(a.warm, b.warm),
    cool: n(a.cool, b.cool),
    stars: n(a.stars, b.stars),
  }
}

const WARM = '#F0A066'
const COOL = '#1C2748'
/** The lowest and highest tone a shape in a layer can have: a change of HSL lightness. */
export const TONE_RANGE = 0.12

export interface Palette {
  skyTop: string
  skyHorizon: string
  /** Colors of layers 1 to 3, back to front. Layer 0 is the sky. */
  layers: [string, string, string]
  /** The sun by day, the moon at night. */
  light: string
  /** Opacity of the stars, 0 to 1. */
  stars: number
}

/** The colors of a scene: the cloth color of the group, lighter or darker by the time of day. */
export function paletteFor(cloth: string, h: number): Palette {
  const [hue, sat, lum] = rgbToHsl(cloth)
  // Scenery needs some color. A very pale cloth, as for the Gospels, keeps its hue with less color.
  const s = Math.min(0.55, Math.max(0.22, sat * 0.75)) * (lum > 0.85 ? 0.5 : 1)
  const L = lightAt(h)
  const tint = (c: string) => mix(c, COOL, L.cool)
  const skyTop = tint(hslToHex(hue, s * 0.6, L.skyTop))
  const skyHorizon = tint(mix(hslToHex(hue, s * 0.5, L.skyHorizon), WARM, L.warm * 0.6))
  const layers = L.layers.map((l, i) => tint(mix(hslToHex(hue, s, l), WARM, L.warm * 0.15 * (3 - i)))) as Palette['layers']
  const light = h >= 1 ? '#F4EEDC' : mix('#FFF6DC', WARM, L.warm)
  return { skyTop, skyHorizon, layers, light, stars: L.stars }
}

/** A string hash (FNV-1a). */
export function hash(s: string): number {
  let x = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i)
    x = Math.imul(x, 0x01000193)
  }
  return x >>> 0
}

/** A random number generator for a seed (mulberry32): the same seed gives the same numbers. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The largest shift of a layer, in scene units. The scene is 1600 by 1000 units. */
export const MAX_SHIFT = [0, 24, 40, 60]

export interface TextStyle {
  /** Color of the chapter text and of the header. */
  ink: string
  /** Color of the veil behind the text column. */
  veil: string
  /** Opacity of the veil. */
  veilAlpha: number
  /** The lowest contrast of the text against each color that can be behind it. */
  contrast: number
}

const DARK_INK = '#2A1E12'
const LIGHT_INK = '#F7ECD3'
const LIGHT_VEIL = '#F6EEDD'
const DARK_VEIL = '#17131D'
/** The contrast the site aims for. The rule is 4.5 to 1; the margin covers rounding and blending in the browser. */
const TARGET = 4.8
/** The paper-cut shadow can darken a color behind the text by this much black. */
export const SHADOW_ALPHA = 0.3

/** Each color that can be behind the text: the sky, the light, each layer at each tone, with and without a shadow. */
export function colorsBehindText(p: Palette): string[] {
  const out = [p.skyTop, p.skyHorizon, p.light]
  for (const c of p.layers) for (const t of [-TONE_RANGE, 0, TONE_RANGE]) out.push(shade(c, t))
  return [...out, ...out.map((c) => over('#000000', SHADOW_ALPHA, c))]
}

/**
 * The text color and the veil. Dark text on a light scene, light text on a dark scene.
 * The veil opacity is the lowest that gives each color behind the text the target contrast.
 */
export function textStyleFor(p: Palette): TextStyle {
  const behind = colorsBehindText(p)
  const sky = mix(p.skyTop, p.skyHorizon, 0.5)
  const light = contrastRatio(sky, DARK_INK) >= contrastRatio(sky, LIGHT_INK)
  const ink = light ? DARK_INK : LIGHT_INK
  const veil = light ? LIGHT_VEIL : DARK_VEIL
  const worst = (alpha: number) => Math.min(...behind.map((c) => contrastRatio(ink, over(veil, alpha, c))))
  let alpha = 0.35
  while (alpha < 0.95 && worst(alpha) < TARGET) alpha = Math.round((alpha + 0.01) * 100) / 100
  return { ink, veil, veilAlpha: alpha, contrast: worst(alpha) }
}

export interface SceneValues {
  scene: SceneId
  /** Position of the chapter in its book, 0 to 1. */
  h: number
  phase: Phase
  palette: Palette
  /** Shift of each of the four layers, left or right, in scene units. */
  shifts: [number, number, number, number]
  text: TextStyle
}

/** The scene of one chapter. The same book and chapter always give the same values. */
export function sceneValues(book: Book, chapter: number): SceneValues {
  const scene = SCENE_OF_GROUP[book.group]
  const h = dayPosition(chapter, book.chapters)
  return valuesAt(scene, groupOf(book).cloth, h, hash(`${book.id}:${chapter}`))
}

/** The scene values for a scene, a cloth color, a position in the day, and a seed. */
export function valuesAt(scene: SceneId, cloth: string, h: number, seed: number): SceneValues {
  const random = seeded(seed)
  const shifts = MAX_SHIFT.map((m) => Math.round((random() * 2 - 1) * m)) as SceneValues['shifts']
  const palette = paletteFor(cloth, h)
  return { scene, h, phase: phaseOf(h), palette, shifts, text: textStyleFor(palette) }
}
