// Measures the spines of the wide table from the rendered page. POLISH.md items 1 and 13.
// Usage: npm run dev, then node scripts/measure-spines.mjs [width] [height] [screenshot.png]
// The contrast of each spine name from the rendered pixels. POLISH.md item 1.
// In each spine face (inset 25 % top and bottom, 6 % left and right), the background is the median of the
// pixels within 60 of the cloth color of the group (by RGB distance), so that a long name does not move it.
// The text color is the 98th percentile of the pixels by contrast against the background.
import { chromium } from '@playwright/test'
const [w = '1440', h = '900', shot] = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) } })
await page.goto('http://localhost:5173/bible/')
await page.waitForSelector('.spine-links[data-ready="true"]')
await page.waitForTimeout(1500)
await page.mouse.move(5, 5)
await page.waitForTimeout(400)
const rects = await page.$$eval('a.spine', (els) => els.map((e) => { const r = e.getBoundingClientRect(); return { name: e.textContent, group: e.getAttribute('data-group'), x: r.x, y: r.y, w: r.width, h: r.height } }))
const png = (await page.screenshot({ path: shot })).toString('base64')
const CLOTH = { Law: '#A3214F', History: '#7E1F26', 'Poetry & Wisdom': '#A44A22', 'Major Prophets': '#C89A2B', 'Minor Prophets': '#566829', Gospels: '#FBF6EA', 'History (Acts)': '#5C6063', 'Letters of Paul': '#1F3350', 'General Letters': '#4B2E63', Prophecy: '#8A5579' }
for (const r of rects) r.cloth = [1, 3, 5].map((i) => parseInt(CLOTH[r.group].slice(i, i + 2), 16))
const result = await page.evaluate(async ({ png, rects }) => {
  const img = new Image()
  img.src = 'data:image/png;base64,' + png
  await img.decode()
  const c = document.createElement('canvas')
  c.width = img.width
  c.height = img.height
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
  const scale = img.width / window.innerWidth
  return rects.map((r) => {
    const x0 = Math.round((r.x + r.w * 0.06) * scale), x1 = Math.round((r.x + r.w * 0.94) * scale)
    const y0 = Math.round((r.y + r.h * 0.25) * scale), y1 = Math.round((r.y + r.h * 0.75) * scale)
    const d = ctx.getImageData(x0, y0, x1 - x0, y1 - y0).data
    const ls = []
    const near = []
    for (let i = 0; i < d.length; i += 4) {
      const l = lum(d[i], d[i + 1], d[i + 2])
      ls.push(l)
      if (Math.hypot(d[i] - r.cloth[0], d[i + 1] - r.cloth[1], d[i + 2] - r.cloth[2]) < 60) near.push(l)
    }
    near.sort((a, b) => a - b)
    if (near.length < 20) return { name: r.name, contrast: 0, note: 'no cloth pixels' }
    const bg = near[Math.floor(near.length / 2)]
    const cs = ls.map((l) => ratio(l, bg)).sort((a, b) => a - b)
    return { name: r.name, contrast: +cs[Math.floor(cs.length * 0.98)].toFixed(2) }
  })
}, { png, rects })
const heights = rects.map((r) => r.h)
console.log(JSON.stringify({ window: `${w}x${h}`, spines: rects.length, smallestSpinePx: +Math.min(...heights).toFixed(1), below24: heights.filter((x) => x < 24).length }))
const low = result.filter((r) => r.contrast < 4.5).sort((a, b) => a.contrast - b.contrast)
console.log(JSON.stringify({ window: `${w}x${h}`, min: Math.min(...result.map((r) => r.contrast)), below45: low.length, low: low.map((r) => `${r.name} ${r.contrast}`) }))
await browser.close()
