// Measures the frame rate on a mid-range phone profile. docs/TASKS.md Task 9 step 3.
// Pixel 7 emulation at 390 x 844, CPU 4x slower (Chrome DevTools "mid-tier mobile").
// Usage: npm run build, then npx vite preview --port 4173, then node scripts/measure-fps.mjs
import { chromium, devices } from '@playwright/test'
const BASE = process.argv[2] || 'http://localhost:4173/bible/'
const browser = await chromium.launch({ args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ ...devices['Pixel 7'], viewport: { width: 390, height: 844 } })
const results = []
async function measure(name, hash, action, seconds = 3) {
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await page.goto(BASE + hash)
  await page.waitForTimeout(2500)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await page.evaluate(() => {
    window.__frames = []
    const tick = (t) => { window.__frames.push(t); if (window.__frames.length < 100000) requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
  })
  await action(page)
  await page.waitForTimeout(seconds * 1000)
  const f = await page.evaluate(() => window.__frames)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 })
  const span = (f[f.length - 1] - f[0]) / 1000
  const avg = (f.length - 1) / span
  // The worst one-second window.
  let worst = Infinity
  for (let i = 0; i < f.length; i++) {
    let j = i
    while (j < f.length && f[j] - f[i] < 1000) j++
    if (f[i] + 1000 <= f[f.length - 1]) worst = Math.min(worst, j - i)
  }
  const gl = await page.evaluate(() => { const c = document.createElement('canvas').getContext('webgl'); const d = c && c.getExtension('WEBGL_debug_renderer_info'); return d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'none' })
  results.push({ name, avgFps: Math.round(avg), worstSecondFps: worst, frames: f.length, renderer: gl })
  await page.close()
}
// Task 13 removed the cover, the spread, and the move of travel. The reading page scrolls the window.
await measure('reading page: scroll the text, with chapters added below', '#/book/psalms/119', async (p) => {
  await p.evaluate(() => { let y = 0; const id = setInterval(() => { y += 40; window.scrollTo(0, y) }, 16); setTimeout(() => clearInterval(id), 3000) })
})
await measure('reading page: idle after load', '#/book/ruth/1', async () => {}, 2)
await measure('wall to reading page: the move of the book name', '', async (p) => {
  await p.locator('.wall-name[data-book="john"]').click()
}, 2)
await measure('timeline: scroll the list', '#/timeline', async (p) => {
  await p.evaluate(() => { let y = 0; const id = setInterval(() => { y += 40; window.scrollTo(0, y) }, 16); setTimeout(() => clearInterval(id), 3000) })
})
console.log(JSON.stringify(results, null, 1))
await browser.close()
