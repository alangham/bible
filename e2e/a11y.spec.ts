/// <reference lib="dom" />
// An accessibility check of each page type, at the wide and the narrow layout. docs/TASKS.md Task 9 step 6.
//
// axe-core checks the WCAG 2.0, 2.1, and 2.2 rules of level A and AA. Task 9b step 2.
// The checks below also run in the page. Task 9 step 6:
// 1. The page has a language, one h1, and no skipped heading level.
// 2. Each visible link and button has an accessible name and can take focus.
// 3. Each visible control is 44 px or more in each direction (docs/DESIGN.md section 3). An inline
//    link in a paragraph is exempt. On the pages of the redesign, the limit is 24 px: section 7.3
//    sets 24 by 24 px for these pages.
// 4. Each visible text has a contrast of 4.5 to 1 or more, or 3 to 1 for large text. The check
//    skips text that it cannot measure, and docs/reviews/task-9-measurements.md lists the cases:
//    text over a background image or a canvas, and text with an opacity below 1. Task 18 removed the skip of the dimmed and the "off" states: no page has them now.
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
  // Empty.
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

const PAGES: { name: string; path: string; minTarget?: number; open?: string }[] = [
  { name: 'wall', path: './', minTarget: 24 },
  { name: 'reading', path: './#/book/ruth/1', minTarget: 24 },
  { name: 'reading, About this book open', path: './#/book/genesis/1', minTarget: 24, open: 'About this book' },
  { name: 'reading, poetry', path: './#/book/psalms/119', minTarget: 24 },
  { name: 'reading, links', path: './#/book/hebrews/9', minTarget: 24 },
  { name: 'sources', path: './#/sources', minTarget: 24 },
  { name: 'quotations', path: './#/quotations', minTarget: 24 },
  { name: 'timeline', path: './#/timeline', minTarget: 24 },
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
      // WCAG 2.5.8, the exception "Equivalent": a different control on the page does the same thing and is big enough.
      const equivalent = el.getAttribute('data-target-equivalent')
      const hasEquivalent = !!equivalent && [...document.getElementsByClassName(equivalent)].some((e) => visible(e) && e.getBoundingClientRect().height >= minTarget)
      if (!inSentence && !hasEquivalent && (w < minTarget - 0.05 || h < minTarget - 0.05)) problems.push(`small target ${Math.round(w)}x${Math.round(h)}: ${label(el)}`)
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
    // The background of the body: white. docs/DESIGN.md section 7.3.
    const PAGE_BACKGROUND = [{ r: 0xff, g: 0xff, b: 0xff }]
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
      const base = layers.length && layers[layers.length - 1].a >= 1 ? [layers[layers.length - 1]] : PAGE_BACKGROUND
      return base.map((b) => layers.slice(0, layers.length && layers[layers.length - 1].a >= 1 ? -1 : undefined).reduceRight((acc, l) => over(l, acc), b as { r: number; g: number; b: number }))
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const seen = new Set<Element>()
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement
      if (!el || seen.has(el) || !(n.textContent ?? '').trim()) continue
      seen.add(el)
      if (!visible(el) || el.closest('canvas, script, style')) continue
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
      if (p.open) {
        await page.getByRole('button', { name: p.open }).click()
        for (const control of await page.getByRole('button', { name: 'Scholars differ' }).all()) await control.click()
        await page.waitForTimeout(300)
      }
      expect(await audit(page, layout.name, p.minTarget)).toEqual([])
      expect(await axe(page, { layout: layout.name, page: p.name })).toEqual([])
    })
  }

  // The states that a page load does not show. Task 9b step 2, Task 14 step 13.
  test(`accessibility: the link pop-up, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    await page.goto('./#/book/hebrews/9')
    await settled(page)
    const name = layout.name === 'wide' ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8'
    await page.getByRole('button', { name }).click()
    await expect(page.getByRole('dialog', { name: 'Exodus 24:8' })).toBeVisible()
    await page.waitForTimeout(400)
    expect(await audit(page, layout.name, 24)).toEqual([])
    expect(await axe(page)).toEqual([])
  })

  test(`accessibility: the pop-up of a long passage, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    await page.goto('./#/book/matthew/13')
    await settled(page)
    await page.getByRole('button', { name: 'Psalm 78:1–72' }).click()
    await expect(page.getByRole('dialog', { name: 'Psalm 78:1–72' })).toBeVisible()
    await page.waitForTimeout(400)
    expect(await audit(page, layout.name, 24)).toEqual([])
    expect(await axe(page)).toEqual([])
  })

  test(`accessibility: the quotation diagram with Romans selected, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    await page.goto('./#/quotations')
    await settled(page)
    if (layout.name === 'narrow') await page.getByRole('combobox', { name: 'Select a book' }).selectOption('romans')
    else await page.getByRole('button', { name: 'Romans', exact: true }).click()
    await expect(page.locator('.q-list h2')).toHaveText('Romans')
    await page.waitForTimeout(400)
    expect(await audit(page, layout.name, 24)).toEqual([])
    expect(await axe(page)).toEqual([])
  })

  // The King James Version stored. The wall has no translation control since Task 22, so the wall looks the same.
  // docs/TASKS.md Task 21 step 11.
  test(`accessibility: the wall with the King James Version stored, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    await page.addInitScript(() => localStorage.setItem('bible-translation', 'kjv'))
    await page.goto('./')
    await settled(page)
    expect(await audit(page, layout.name, 24)).toEqual([])
    expect(await axe(page)).toEqual([])
  })

  test(`accessibility: the reading page with the panel of the chapter grid open, King James Version, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    await page.addInitScript(() => localStorage.setItem('bible-translation', 'kjv'))
    await page.goto('./#/book/psalms/23')
    await settled(page)
    await page.locator('.rd-where').click()
    await expect(page.locator('.rd-grid-panel')).toBeVisible()
    await page.waitForTimeout(300)
    expect(await audit(page, layout.name, 24)).toEqual([])
    expect(await axe(page)).toEqual([])
  })

  test(`accessibility: the link pop-up, King James Version, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    await page.addInitScript(() => localStorage.setItem('bible-translation', 'kjv'))
    await page.goto('./#/book/hebrews/9')
    await settled(page)
    const name = layout.name === 'wide' ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8'
    await page.getByRole('button', { name }).click()
    await expect(page.getByRole('dialog', { name: 'Exodus 24:8' })).toBeVisible()
    await expect(page.locator('.pop-quoted-from')).toBeVisible()
    await page.waitForTimeout(400)
    expect(await audit(page, layout.name, 24)).toEqual([])
    expect(await axe(page)).toEqual([])
  })

  // The translation list. docs/TASKS.md Task 22 step 14.
  test(`accessibility: the reading page with the translation list open, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    await page.goto('./#/book/john/3')
    await settled(page)
    await page.getByRole('button', { name: 'Translation: Berean Standard Bible, BSB' }).click()
    await expect(page.locator('#translation-list')).toBeVisible()
    await page.waitForTimeout(300)
    expect(await audit(page, layout.name, 24)).toEqual([])
    expect(await axe(page)).toEqual([])
  })

  test(`accessibility: the trail after travel, ${layout.name} layout`, async ({ page }) => {
    await page.setViewportSize(layout.viewport)
    await page.goto('./#/book/hebrews/9')
    await settled(page)
    await page.getByRole('navigation', { name: 'Read with' }).getByRole('link').first().click()
    await expect(page.getByRole('navigation', { name: 'Trail' })).toBeVisible()
    await settled(page)
    expect(await audit(page, layout.name, 24)).toEqual([])
    expect(await axe(page)).toEqual([])
  })
}

// The menu panel, in the narrow layout only. docs/TASKS.md Task 22 step 14.
for (const [name, path] of [['the wall', './'], ['the reading page', './#/book/john/3']] as const) {
  test(`accessibility: ${name} with the menu panel open, narrow layout`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(path)
    await settled(page)
    await page.getByRole('button', { name: 'Menu', exact: true }).click()
    await expect(page.locator('#menu-panel')).toBeVisible()
    await page.waitForTimeout(300)
    expect(await audit(page, 'narrow', 24)).toEqual([])
    expect(await axe(page)).toEqual([])
  })
}
