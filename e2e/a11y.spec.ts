/// <reference lib="dom" />
// An accessibility check of each page type, at the wide and the narrow layout. docs/TASKS.md Task 9 step 6.
//
// axe-core checks the WCAG 2.0, 2.1, and 2.2 rules of level A and AA. Task 9b step 2.
// The checks below also run in the page. Task 9 step 6:
// 1. The page has a language, one h1, and no skipped heading level.
// 2. Each visible link and button has an accessible name and can take focus.
// 3. Each visible control is 44 px or more in each direction (docs/DESIGN.md section 3). An inline
//    link in a paragraph is exempt. On the wall, the limit is 24 px: section 7.3 sets 24 by 24 px for
//    the pages of the redesign.
// 4. Each visible text has a contrast of 4.5 to 1 or more, or 3 to 1 for large text. The check
//    skips text that it cannot measure, and docs/reviews/task-9-measurements.md lists the cases:
//    text on a scene (src/scene/values.test.ts checks it), text over a background image or a
//    canvas, text with an opacity below 1, and text in a dimmed state.
// 5. The page does not scroll sideways.

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/** The WCAG rules that axe-core checks: WCAG 2.0, 2.1, and 2.2, levels A and AA. Task 9b step 2. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

/**
 * Known failures that wait for a design decision of Arthur, with their item in docs/POLISH.md.
 * Task 9b step 3: the test does not fail on them, but each one must stay on this list and in POLISH.md.
 */
const KNOWN: { rule: string; layout: string; page: string; selector: RegExp }[] = [
  // Empty. Task 10 corrected POLISH.md item 13. Task 12 removed the table page.
]

/** The axe-core failures on the page, as text, without the known failures. An empty list is a pass. */
async function axe(page: Page, where?: { layout: string; page: string }): Promise<string[]> {
  const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
  return result.violations.flatMap((v) =>
    v.nodes
      .filter((n) => !KNOWN.some((k) => k.rule === v.id && k.layout === where?.layout && k.page === where?.page && k.selector.test(n.target.join(' '))))
      .map((n) => `${v.id} (${v.impact}): ${n.target.join(' ')}: ${n.failureSummary?.split('\n')[1]?.trim() ?? ''}`),
  )
}

/** Waits until the fonts, the data, and the fades of the page finish. */
async function settled(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(800)
}

const PAGES = [
  { name: 'wall', path: './', minTarget: 24 },
  { name: 'cover', path: './#/book/ruth' },
  { name: 'spread', path: './#/book/ruth/1' },
  { name: 'sources', path: './#/sources' },
  { name: 'timeline', path: './#/timeline' },
]

const LAYOUTS = [
  { name: 'wide', viewport: { width: 1440, height: 900 } },
  { name: 'narrow', viewport: { width: 390, height: 844 } },
]

/** The problems on the page, as text. An empty list is a pass. */
async function audit(page: Page, layout: string, minTarget = 44): Promise<string[]> {
  return page.evaluate(({ layout, minTarget }) => {
    const problems: string[] = []
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return false
      for (let e: Element | null = el; e; e = e.parentElement) {
        const s = getComputedStyle(e)
        if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) === 0) return false
      }
      return !el.closest('.sr-only, [inert]')
    }
    const label = (el: Element) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} "${(el.textContent ?? '').trim().slice(0, 30)}"`

    // 1. Language and headings.
    if (!document.documentElement.lang) problems.push('html has no lang')
    const h1 = document.querySelectorAll('h1')
    if (h1.length !== 1) problems.push(`${h1.length} h1 elements`)
    let last = 0
    for (const h of document.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
      if (h.closest('[inert], [aria-hidden="true"]')) continue
      const n = Number(h.tagName[1])
      if (last && n > last + 1) problems.push(`heading level skips from h${last} to h${n}: ${label(h)}`)
      last = n
    }

    // 2 and 3. Names, focus, and size of controls.
    const controls = [...document.querySelectorAll('a[href], button, [role="button"], [role="link"]')].filter(visible)
    for (const el of controls) {
      const name = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim()
      if (!name) problems.push(`no name: ${label(el)}`)
      if ((el as HTMLElement).tabIndex < 0) problems.push(`no focus: ${label(el)}`)
      // A link in a sentence is exempt: an inline link inside a paragraph, or inside a list item that
      // has more text than the link. A list of links alone, as in a menu, is not exempt.
      const block = el.parentElement?.closest('p, li')
      const blockText = (block?.textContent ?? '').trim().length
      const linkText = (el.textContent ?? '').trim().length
      const inSentence =
        el.tagName === 'A' && getComputedStyle(el).display === 'inline' && !!block && (block.tagName === 'P' || blockText > linkText + 20)
      const r = el.getBoundingClientRect()
      // A control can have a larger touch area than its mark, as a pseudo-element: the link marks do.
      let w = r.width
      let h = r.height
      for (const pseudo of ['::before', '::after']) {
        const ps = getComputedStyle(el, pseudo)
        if (ps.content !== 'none' && ps.position === 'absolute') {
          w = Math.max(w, parseFloat(ps.width) || 0)
          h = Math.max(h, parseFloat(ps.height) || 0)
        }
      }
      if (!inSentence && (w < minTarget - 0.5 || h < minTarget - 0.5)) problems.push(`small target ${Math.round(w)}x${Math.round(h)}: ${label(el)}`)
    }

    // 4. Contrast.
    const parse = (c: string) => {
      const m = c.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0]
      return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }
    }
    const lum = (c: { r: number; g: number; b: number }) => {
      const f = (v: number) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      }
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b)
    }
    const over = (top: { r: number; g: number; b: number; a: number }, under: { r: number; g: number; b: number }) => ({
      r: top.r * top.a + under.r * (1 - top.a),
      g: top.g * top.a + under.g * (1 - top.a),
      b: top.b * top.a + under.b * (1 - top.a),
    })
    const ratio = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
      return (x + 0.05) / (y + 0.05)
    }
    // The linen of the body: the lightest and the darkest point of its gradient.
    const LINEN = [
      { r: 0xf6, g: 0xee, b: 0xdd },
      { r: 0xd8, g: 0xc9, b: 0xad },
    ]
    const backgrounds = (el: Element): { r: number; g: number; b: number }[] | null => {
      const layers: { r: number; g: number; b: number; a: number }[] = []
      for (let e: Element | null = el; e; e = e.parentElement) {
        const s = getComputedStyle(e)
        if (e !== document.body && e !== document.documentElement && s.backgroundImage !== 'none') return null
        const c = parse(s.backgroundColor)
        if (c.a > 0 && e !== document.body && e !== document.documentElement) {
          layers.push(c)
          if (c.a >= 1) break
        }
      }
      const base = layers.length && layers[layers.length - 1].a >= 1 ? [layers[layers.length - 1]] : LINEN
      return base.map((b) => layers.slice(0, layers.length && layers[layers.length - 1].a >= 1 ? -1 : undefined).reduceRight((acc, l) => over(l, acc), b as { r: number; g: number; b: number }))
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const seen = new Set<Element>()
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement
      if (!el || seen.has(el) || !(n.textContent ?? '').trim()) continue
      seen.add(el)
      if (!visible(el) || el.closest('.spread-text, .page, .scene, canvas, script, style, [data-dimmed="true"], [data-state="off"]')) continue
      let opacity = 1
      for (let e: Element | null = el; e; e = e.parentElement) opacity *= Number(getComputedStyle(e).opacity)
      if (opacity < 1) continue
      const s = getComputedStyle(el)
      const fg = parse(el instanceof SVGElement ? s.fill : s.color)
      const bgs = backgrounds(el)
      if (!bgs) continue
      const size = parseFloat(s.fontSize)
      const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700)
      const need = large ? 3 : 4.5
      const worst = Math.min(...bgs.map((b) => ratio(over(fg, b), b)))
      if (worst < need) problems.push(`contrast ${worst.toFixed(2)} < ${need}: ${label(el)}`)
    }

    // 5. No sideways scroll.
    if (document.documentElement.scrollWidth > window.innerWidth + 1) problems.push(`page is ${document.documentElement.scrollWidth} px wide in a ${window.innerWidth} px window`)
    void layout
    return problems
  }, { layout, minTarget })
}

test('the accessibility check finds a planted problem', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./#/sources')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.evaluate(() => {
    const b = document.createElement('button')
    b.style.cssText = 'width:20px;height:20px;color:#b0a890;background:transparent;border:0'
    document.querySelector('main')!.prepend(b)
    const p = document.createElement('p')
    p.textContent = 'Pale text'
    p.style.color = '#b0a890'
    document.querySelector('main')!.prepend(p)
  })
  let problems = await audit(page, 'narrow')
  expect(problems.some((x) => x.startsWith('no name: button'))).toBe(true)
  expect(problems.some((x) => x.startsWith('small target 20x20'))).toBe(true)
  expect(problems.some((x) => x.startsWith('contrast') && x.includes('Pale text'))).toBe(true)

  // One planted problem for each of the other rules.
  await page.evaluate(() => {
    document.documentElement.removeAttribute('lang')
    const main = document.querySelector('main')!
    const h1 = document.createElement('h1')
    h1.textContent = 'A second h1'
    main.append(h1)
    const h4 = document.createElement('h4')
    h4.textContent = 'A skipped level'
    main.append(h4)
    const a = document.createElement('a')
    a.href = '#/'
    a.textContent = 'No focus'
    a.tabIndex = -1
    a.style.cssText = 'display:inline-block;min-width:60px;min-height:60px'
    main.append(a)
    const wide = document.createElement('div')
    wide.style.cssText = 'width:900px;height:10px'
    main.append(wide)
  })
  problems = await audit(page, 'narrow')
  expect(problems).toContain('html has no lang')
  expect(problems).toContain('2 h1 elements')
  expect(problems.some((x) => x.startsWith('heading level skips from h1 to h4'))).toBe(true)
  expect(problems.some((x) => x.startsWith('no focus: a'))).toBe(true)
  expect(problems.some((x) => /^page is \d+ px wide in a 390 px window$/.test(x))).toBe(true)
})

for (const layout of LAYOUTS) {
  for (const p of PAGES) {
    test(`accessibility: ${p.name}, ${layout.name} layout`, async ({ page }) => {
      await page.setViewportSize(layout.viewport)
      await page.goto(p.path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await settled(page)
      expect(await audit(page, layout.name, p.minTarget)).toEqual([])
      expect(await axe(page, { layout: layout.name, page: p.name })).toEqual([])
    })
  }

  // The states that a page load does not show. Task 9b step 2.
  test(`accessibility: the link pop-up, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    await page.goto('./#/book/hebrews/9')
    await settled(page)
    await page.getByRole('button', { name: /^Links of Hebrews 9:20/ }).click()
    await expect(page.getByRole('dialog', { name: 'Links of Hebrews 9:20' })).toBeVisible()
    await page.waitForTimeout(400)
    expect(await audit(page, layout.name)).toEqual([])
    expect(await axe(page)).toEqual([])
  })

  test(`accessibility: the list of a selected book on the timeline, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    await page.goto('./#/timeline')
    await settled(page)
    await page.getByRole('button', { name: /^Romans\b/ }).click()
    await expect(page.locator('.tl-panel')).toContainText('Isaiah: 22 quotation links')
    await page.waitForTimeout(400)
    expect(await audit(page, layout.name)).toEqual([])
    expect(await axe(page)).toEqual([])
  })

  test(`accessibility: the travel overlay, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    // A fake clock holds the move of travel in its middle while axe-core runs.
    await page.clock.install()
    await page.goto('./#/book/hebrews/9')
    await page.clock.runFor(3000)
    await expect(page.getByRole('navigation', { name: 'Read with' })).toBeVisible()
    await page.getByRole('navigation', { name: 'Read with' }).getByRole('link', { name: 'Leviticus 16' }).click()
    await page.clock.runFor(900)
    await expect(page.locator('.travel')).toBeVisible()
    expect(await axe(page)).toEqual([])
  })
}
