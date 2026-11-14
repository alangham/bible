import { describe, expect, it } from 'vitest'
import { autoTarget, clampTarget, curlFor, curlPoint } from './curl.ts'

const W = 500
const H = 640

describe('page curl', () => {
  it('leaves the page flat when the corner has not moved', () => {
    const c = curlFor(W, H, 'bottom', [W, 0])
    expect(curlPoint(c, 300, 200)).toEqual([300, 200, 0])
  })

  it('keeps the spine in place', () => {
    for (let t = 0; t <= 1; t += 0.1) {
      const c = curlFor(W, H, 'bottom', autoTarget(W, H, 'bottom', t))
      for (const v of [0, H / 2, H]) {
        const [x, y, z] = curlPoint(c, 0, v)
        expect(Math.abs(x)).toBeLessThan(1e-6)
        expect(Math.abs(y - v)).toBeLessThan(1e-6)
        expect(z).toBe(0)
      }
    }
  })

  it('lifts the page while it turns: the curl rises above the book', () => {
    const c = curlFor(W, H, 'bottom', autoTarget(W, H, 'bottom', 0.4))
    let top = 0
    for (let u = 0; u <= W; u += 10) top = Math.max(top, curlPoint(c, u, H / 2)[2])
    expect(top).toBeGreaterThan(10)
  })

  it('puts the held corner on the target', () => {
    const target: [number, number] = [120, 140]
    const c = curlFor(W, H, 'bottom', target)
    const [x, y] = curlPoint(c, W, 0)
    expect(x).toBeCloseTo(target[0], 0)
    expect(y).toBeCloseTo(target[1], 0)
  })

  it('lays the page on the other side at the end of the turn', () => {
    const c = curlFor(W, H, 'bottom', autoTarget(W, H, 'bottom', 1))
    const [x, , z] = curlPoint(c, W, H / 2)
    expect(x).toBeCloseTo(-W, -1)
    expect(z).toBeLessThan(4)
  })

  it('does not let the corner go further from the spine than the page is wide', () => {
    const [x, y] = clampTarget(W, H, 'bottom', [W + 300, -200])
    expect(Math.hypot(x, y)).toBeLessThanOrEqual(W + 1e-6)
  })
})
