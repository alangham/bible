// Measures the frame rate on a mid-range phone profile. docs/TASKS.md Task 9 step 3.
// Pixel 7 emulation at 390 x 844, CPU 4x slower (Chrome DevTools "mid-tier mobile").
// Usage: npm run build, then npx vite preview --port 4173, then node scripts/measure-fps.mjs
import { chromium, devices } from '@playwright/test'
const BASE = process.argv[2] || 'http://localhost:4173/bible/'
const browser = await chromium.launch({ args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ ...devices['Pixel 7'], viewport: { width: 390, height: 844 } })
const results = []

// Task 18 step 7: a long scroll through the Psalms. Usage: node scripts/measure-fps.mjs <base> psalms
// The reading page adds chapters during the scroll and does not remove them. The script measures the
// frame rate during a steady scroll through Psalms 1 to 10, goes on to Psalm 141 with no measurement,
// measures the frame rate through Psalms 141 to 150, and counts the elements of the page at the end.
if (process.argv[3] === 'psalms') {
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await page.goto(BASE + '#/book/psalms/1')
  await page.waitForTimeout(2500)
  /** The top of the heading of a Psalm in page px, or null when the page does not have it yet. */
  const top = (n) => page.evaluate((n) => {
    const h = [...document.querySelectorAll('.rd-heading')].find((e) => e.querySelector('.rd-number')?.textContent === String(n) && e.querySelector('.rd-name')?.textContent === 'Psalms')
    return h ? h.getBoundingClientRect().top + scrollY : null
  }, n)
  /** Scrolls down until the page has the heading of Psalm n. */
  const reach = async (n) => {
    for (let i = 0; i < 2000 && (await top(n)) === null; i++) {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      await page.waitForTimeout(60)
    }
    if ((await top(n)) === null) throw new Error(`Psalm ${n} did not load`)
  }
  /** A steady scroll of 40 px each 16 ms from y0 to y1, with the frame rate. CPU 4x slower. */
  const steady = async (label, y0, y1) => {
    await page.evaluate((y) => window.scrollTo(0, y), y0)
    await page.waitForTimeout(800)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    const f = await page.evaluate(([y0, y1]) => new Promise((done) => {
      const frames = []
      let running = true
      const tick = (t) => { frames.push(t); if (running) requestAnimationFrame(tick) }
      requestAnimationFrame(tick)
      let y = y0
      const id = setInterval(() => {
        y += 40
        window.scrollTo(0, y)
        if (y >= y1) { clearInterval(id); running = false; setTimeout(() => done(frames), 50) }
      }, 16)
    }), [y0, y1])
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 })
    const span = (f[f.length - 1] - f[0]) / 1000
    let worst = Infinity
    for (let i = 0; i < f.length; i++) {
      let j = i
      while (j < f.length && f[j] - f[i] < 1000) j++
      if (f[i] + 1000 <= f[f.length - 1]) worst = Math.min(worst, j - i)
    }
    results.push({ name: label, px: Math.round(y1 - y0), seconds: Math.round(span * 10) / 10, avgFps: Math.round((f.length - 1) / span), worstSecondFps: worst === Infinity ? null : worst })
  }
  await reach(11)
  await steady('Psalms 1 to 10', await top(1), await top(11))
  await reach(150)
  // The end of Psalm 150 is the end of the book. The page may add Proverbs below it.
  const end150 = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('.rd-heading')]
    const i = hs.findIndex((e) => e.querySelector('.rd-name')?.textContent === 'Psalms' && e.querySelector('.rd-number')?.textContent === '150')
    const next = hs[i + 1]
    return next ? next.getBoundingClientRect().top + scrollY : document.documentElement.scrollHeight
  })
  await steady('Psalms 141 to 150', await top(141), Math.min(end150, (await page.evaluate(() => document.documentElement.scrollHeight - innerHeight))))
  const count = await page.evaluate(() => ({
    elements: document.getElementsByTagName('*').length,
    chapters: document.querySelectorAll('.rd-heading').length,
    lastChapter: [...document.querySelectorAll('.rd-heading')].at(-1)?.textContent,
  }))
  results.push({ name: 'the page at the end', ...count })
  console.log(JSON.stringify(results, null, 1))
  await browser.close()
  process.exit(0)
}

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
// The reading page scrolls the window.
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
