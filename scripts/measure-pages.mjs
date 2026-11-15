// Task 18 steps 2, 3, and 4: the size of each control, the keyboard, and reduced motion.
// Usage: npm run build, then npx vite preview --port 4174, then
// node scripts/measure-pages.mjs http://localhost:4174/bible/ > out.json
// Results of 2026-11-15: docs/reviews/task-18-measurements.md.
//
// - Controls: each visible a[href], button, select, input, textarea, and [tabindex] that is not -1,
//   outside [hidden], [inert], and [aria-hidden="true"]. The size is its bounding box on the screen.
//   A link in a sentence (WCAG 2.5.8 "Inline") and an element with data-target-equivalent
//   (WCAG 2.5.8 "Equivalent") are listed apart.
// - Keyboard: Tab from the top of the page until a control repeats. The focus is "shown" when one of
//   ten styles of the control or of its first four descendants differs with and without the focus.
//   The id of a control is its tag, the first 40 letters of its name, and its href: two controls with
//   the same id stop the walk early. Then each kind of control is operated with Enter, Space, or Escape.
// - Motion: after each action, each animation frame for 1.5 s records document.getAnimations() with a
//   duration above 1 ms, the calls of document.startViewTransition, and each distinct scroll position.
//   The same actions run with reducedMotion "reduce" and "no-preference".
import { chromium } from '@playwright/test'

const BASE = process.argv[2]
const SIZES = [
  ['wide', 1440, 900],
  ['narrow', 390, 844],
]
const popName = (layout) => (layout === 'wide' ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8')

async function settle(page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(700)
}

const PAGES = [
  { name: 'wall', hash: '' },
  { name: 'reading', hash: '#/book/hebrews/9' },
  {
    name: 'reading, pop-up open',
    hash: '#/book/hebrews/9',
    prep: async (page, layout) => {
      await page.getByRole('button', { name: popName(layout) }).click()
      await page.getByRole('dialog', { name: 'Exodus 24:8' }).waitFor()
      await page.waitForTimeout(400)
    },
  },
  { name: 'timeline', hash: '#/timeline' },
  { name: 'quotations', hash: '#/quotations' },
  { name: 'sources', hash: '#/sources' },
]

/** In the page: each visible control and its size. */
function controls() {
  const sel = 'a[href], button, select, input, textarea, [tabindex]:not([tabindex="-1"])'
  const out = []
  for (const el of document.querySelectorAll(sel)) {
    if (el.closest('[hidden], [inert], [aria-hidden="true"]')) continue
    const s = getComputedStyle(el)
    if (s.visibility === 'hidden' || s.display === 'none') continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const text = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50)
    const parent = el.parentElement
    const inSentence =
      el.tagName === 'A' && !!parent && ['P', 'LI', 'SPAN'].includes(parent.tagName) && (parent.textContent || '').trim().length > (el.textContent || '').trim().length + 1
    out.push({
      what: `${el.tagName.toLowerCase()}${el.getAttribute('class') ? '.' + el.getAttribute('class').split(' ')[0] : ''}`,
      text,
      w: Math.round(r.width * 10) / 10,
      h: Math.round(r.height * 10) / 10,
      inSentence,
      equivalent: el.hasAttribute('data-target-equivalent'),
    })
  }
  return out
}

/** In the page: the styles that can show the focus, for an element and its first descendants. */
function focusStyle(el) {
  const props = ['outlineStyle', 'outlineWidth', 'outlineColor', 'boxShadow', 'stroke', 'strokeWidth', 'backgroundColor', 'textDecorationLine', 'borderColor', 'color']
  const nodes = [el, ...[...el.querySelectorAll('*')].slice(0, 4)]
  return nodes.map((n) => { const s = getComputedStyle(n); return props.map((p) => s[p]).join('|') }).join('#')
}

const result = { controls: {}, keyboard: {}, operate: {}, motion: {} }
const browser = await chromium.launch()

for (const [layout, width, height] of SIZES) {
  // Step 2: the size of each control.
  for (const p of PAGES) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto(BASE + p.hash)
    await settle(page)
    if (p.prep) await p.prep(page, layout)
    const list = await page.evaluate(controls)
    const counted = list.filter((c) => !c.inSentence && !c.equivalent)
    const by = (a, b) => Math.min(a.w, a.h) - Math.min(b.w, b.h)
    result.controls[`${p.name}, ${layout}`] = {
      count: list.length,
      inSentence: list.filter((c) => c.inSentence).length,
      equivalent: list.filter((c) => c.equivalent).length,
      smallest: counted.sort(by).slice(0, 3), narrowest: [...counted].sort((a, b) => a.w - b.w)[0], lowest: [...counted].sort((a, b) => a.h - b.h)[0],
      smallestExempt: list.filter((c) => c.inSentence || c.equivalent).sort(by).slice(0, 2),
      under24: counted.filter((c) => c.w < 23.5 || c.h < 23.5),
    }
    await page.close()
  }

  // Step 3: the keyboard. Tab through each page from the top.
  for (const p of PAGES) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto(BASE + p.hash)
    await settle(page)
    if (p.prep) await p.prep(page, layout)
    const total = (await page.evaluate(controls)).length
    const seen = []
    const noFocusShown = []
    let wrapped = false
    for (let i = 0; i < Math.min(total + 10, 500); i++) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate((fs) => {
        const el = document.activeElement
        if (!el || el === document.body) return null
        const focused = new Function('return ' + fs)()(el)
        const id = `${el.tagName.toLowerCase()}|${(el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)}|${el.getAttribute('href') || ''}`
        el.blur()
        const plain = new Function('return ' + fs)()(el)
        el.focus()
        return { id, shown: focused !== plain, visible: el.matches(':focus-visible') }
      }, focusStyle.toString())
      if (!info) continue
      if (seen.includes(info.id)) {
        wrapped = true
        break
      }
      seen.push(info.id)
      if (!info.shown) noFocusShown.push(info.id)
    }
    result.keyboard[`${p.name}, ${layout}`] = { controlsOnPage: total, reachedByTab: seen.length, wrapped, noFocusShown, first: seen.slice(0, 4) }
    await page.close()
  }

  // Step 3: each kind of control operates from the keyboard.
  const page = await browser.newPage({ viewport: { width, height } })
  const ops = []
  const op = async (what, fn) => {
    try {
      ops.push([what, await fn()])
    } catch (e) {
      ops.push([what, `FAIL: ${String(e).split('\n')[0]}`])
    }
  }
  await page.goto(BASE)
  await settle(page)
  await op('wall: Enter on the book name Ruth opens Ruth', async () => {
    await page.locator('[data-book="ruth"]').first().focus()
    await page.keyboard.press('Enter')
    await page.waitForURL(/#\/book\/ruth/)
    return page.url().split('#')[1]
  })
  await page.goto(BASE)
  await settle(page)
  await op('wall: Enter on the Reference link Timeline opens the timeline', async () => {
    await page.getByRole('navigation', { name: 'Reference' }).getByRole('link', { name: 'Timeline' }).focus()
    await page.keyboard.press('Enter')
    await page.waitForURL(/#\/timeline$/)
    return page.url().split('#')[1]
  })
  await page.goto(BASE + '#/book/hebrews/9')
  await settle(page)
  await op('reading: Enter opens the chapter grid, Escape closes it', async () => {
    const where = page.locator('.rd-where')
    await where.focus()
    await page.keyboard.press('Enter')
    const open = await where.getAttribute('aria-expanded')
    const focus = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent)
    await page.keyboard.press('Escape')
    return `expanded=${open}, focus on "${focus}", after Escape expanded=${await where.getAttribute('aria-expanded')}`
  })
  await op('reading: Enter on a chapter in the grid opens it', async () => {
    await page.locator('.rd-where').focus()
    await page.keyboard.press('Enter')
    await page.getByRole('link', { name: 'Hebrews chapter 11' }).focus()
    await page.keyboard.press('Enter')
    await page.waitForURL(/#\/book\/hebrews\/11$/)
    return page.url().split('#')[1]
  })
  await page.goto(BASE + '#/book/hebrews/9')
  await settle(page)
  await op('reading: Space on "About this book" opens it', async () => {
    const c = page.locator('.rd-about-control').first()
    await c.focus()
    await page.keyboard.press('Space')
    return `expanded=${await c.getAttribute('aria-expanded')}`
  })
  await op('reading: Enter on a "Scholars differ" control opens it', async () => {
    const c = page.locator('.rd-scholars-control').first()
    await c.focus()
    await page.keyboard.press('Enter')
    return `expanded=${await c.getAttribute('aria-expanded')}`
  })
  await op('reading: Enter on a link opens the pop-up, focus on "Go there", Escape closes it and the focus goes back', async () => {
    const mark = page.getByRole('button', { name: popName(layout) })
    await mark.focus()
    await page.keyboard.press('Enter')
    await page.getByRole('dialog', { name: 'Exodus 24:8' }).waitFor()
    await page.waitForTimeout(300)
    const f1 = await page.evaluate(() => document.activeElement?.textContent?.trim())
    const trap = []
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab')
      trap.push(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')))
    }
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    const back = await page.evaluate(() => (document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent || '').trim())
    return `focus "${f1}"; Tab stays in pop-up: ${trap.join(',')}; after Escape focus on "${back}"`
  })
  await op('reading: Enter on "Go there" travels, and Enter on Back returns', async () => {
    await page.getByRole('button', { name: popName(layout) }).focus()
    await page.keyboard.press('Enter')
    await page.getByRole('dialog', { name: 'Exodus 24:8' }).waitFor()
    await page.waitForTimeout(300)
    await page.getByRole('link', { name: 'Go there' }).focus()
    await page.keyboard.press('Enter')
    await page.waitForURL(/#\/book\/exodus\/24\/8$/)
    const there = page.url().split('#')[1]
    const back = page.getByRole('navigation', { name: 'Trail' }).getByRole('link', { name: /Back/ }).first()
    await back.focus()
    await page.keyboard.press('Enter')
    await page.waitForURL(/#\/book\/hebrews\/9/)
    return `${there} then ${page.url().split('#')[1]}`
  })
  await page.goto(BASE + '#/book/hebrews/9')
  await settle(page)
  await op('reading: Enter on a read-with link opens the chapter', async () => {
    const l = page.getByRole('navigation', { name: 'Read with' }).getByRole('link').first()
    const href = await l.getAttribute('href')
    await l.focus()
    await page.keyboard.press('Enter')
    await page.waitForURL((u) => u.hash === href || u.hash.startsWith(href))
    return `${href} opened`
  })
  await page.goto(BASE + '#/timeline')
  await settle(page)
  await op('timeline: Enter on Hebrews opens Hebrews', async () => {
    await page.locator('[data-book="hebrews"]').locator('xpath=self::*[@href]').first().focus()
    await page.keyboard.press('Enter')
    await page.waitForURL(/#\/book\/hebrews/)
    return page.url().split('#')[1]
  })
  await page.goto(BASE + '#/quotations')
  await settle(page)
  await op('quotations: select Romans from the keyboard', async () => {
    if (layout === 'wide') {
      await page.getByRole('button', { name: 'Romans', exact: true }).focus()
      await page.keyboard.press('Enter')
    } else {
      const s = page.getByRole('combobox', { name: 'Select a book' })
      await s.focus()
      await s.selectOption('romans')
    }
    await page.locator('.q-list h2').waitFor()
    return `list heading "${await page.locator('.q-list h2').textContent()}"`
  })
  await op('quotations: Enter on a book in the list opens it', async () => {
    const l = page.locator('.q-list a[href]').first()
    const href = await l.getAttribute('href')
    await l.focus()
    await page.keyboard.press('Enter')
    await page.waitForURL((u) => u.hash.startsWith(href))
    return `${href} opened`
  })
  await page.goto(BASE + '#/sources')
  await settle(page)
  await op('sources: Enter on the top bar link Books opens the wall', async () => {
    await page.getByRole('link', { name: /Books/ }).first().focus()
    await page.keyboard.press('Enter')
    await page.waitForURL((u) => u.hash === '' || u.hash === '#/')
    return `"${page.url().split('/bible/')[1]}"`
  })
  result.operate[layout] = ops
  await page.close()

  // Step 4: reduced motion. Record each animation and each scroll step after an action.
  for (const motion of ['reduce', 'no-preference']) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: motion })
  const mp = await ctx.newPage()
  const watch = async (what, fn) => {
    await mp.evaluate(() => {
      window.__anim = new Set()
      window.__scroll = new Set([Math.round(window.scrollY)])
      window.__vt = 0
      const orig = document.startViewTransition
      if (orig && !window.__vtWrapped) {
        window.__vtWrapped = true
        document.startViewTransition = function (...a) { window.__vt++; return orig.apply(document, a) }
      }
      const until = performance.now() + 1500
      const tick = () => {
        for (const a of document.getAnimations()) {
          const t = a.effect?.getTiming?.()
          const d = typeof t?.duration === 'number' ? t.duration : 0
          if (d > 1) window.__anim.add(`${a.constructor.name} ${a.animationName || a.transitionProperty || ''} ${d}ms on ${a.effect?.target?.className || a.effect?.target?.tagName || ''}`)
        }
        window.__scroll.add(Math.round(window.scrollY))
        if (performance.now() < until) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    let note = ''
    try {
      note = (await fn()) || ''
    } catch (e) {
      note = `FAIL: ${String(e).split('\n')[0]}`
    }
    await mp.waitForTimeout(1600)
    const r = await mp.evaluate(() => ({ animations: [...window.__anim], scrollPositions: window.__scroll.size, viewTransitions: window.__vt }))
    result.motion[`${what}, ${layout}, ${motion}`] = { ...r, note }
  }
  await mp.goto(BASE)
  await settle(mp)
  await watch('wall: click the book name John', async () => {
    await mp.locator('[data-book="john"]').first().click()
    await mp.waitForURL(/#\/book\/john/)
  })
  await settle(mp)
  await watch('reading: open the chapter grid', async () => {
    await mp.locator('.rd-where').click()
  })
  await mp.keyboard.press('Escape')
  await watch('reading: open About this book', async () => {
    await mp.locator('.rd-about-control').first().click()
  })
  await watch('reading: open Scholars differ', async () => {
    await mp.locator('.rd-scholars-control').first().click()
  })
  await watch('reading: scroll to the next chapters', async () => {
    await mp.mouse.wheel(0, 3000)
    await mp.waitForTimeout(500)
  })
  await mp.goto(BASE + '#/book/hebrews/9')
  await settle(mp)
  await watch('reading: open the pop-up', async () => {
    await mp.getByRole('button', { name: popName(layout) }).click()
    await mp.getByRole('dialog', { name: 'Exodus 24:8' }).waitFor()
  })
  await watch('reading: Go there (travel)', async () => {
    await mp.getByRole('link', { name: 'Go there' }).click()
    await mp.waitForURL(/#\/book\/exodus\/24\/8$/)
  })
  await mp.goto(BASE + '#/quotations')
  await settle(mp)
  await watch('quotations: select Romans', async () => {
    if (layout === 'wide') await mp.getByRole('button', { name: 'Romans', exact: true }).click()
    else await mp.getByRole('combobox', { name: 'Select a book' }).selectOption('romans')
  })
  await mp.goto(BASE + '#/timeline')
  await settle(mp)
  await watch('timeline: hover and open Hebrews', async () => {
    const l = mp.locator('[data-book="hebrews"]').locator('xpath=self::*[@href]').first()
    await l.hover()
    await l.click()
    await mp.waitForURL(/#\/book\/hebrews/)
  })
  await ctx.close()
  }
}

await browser.close()
console.log(JSON.stringify(result, null, 1))
