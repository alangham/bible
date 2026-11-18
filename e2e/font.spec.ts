/// <reference lib="dom" />
// The font Inrond in place of Inter: docs/DESIGN.md section 16, docs/TASKS.md Task 41 step 19.

import { readFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/** The WCAG rules of a11y.spec.ts: WCAG 2.0, 2.1, and 2.2, levels A and AA. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

const SIZES = [
  { name: '1440 by 900 px', viewport: { width: 1440, height: 900 }, key: '1440x900' },
  { name: '390 by 844 px', viewport: { width: 390, height: 844 }, key: '390x844' },
]

/** The pages of the test, with the element that shows that the page is ready, and its book name and top bar. */
const PAGES = [
  { name: 'the wall', hash: '', ready: 'main.wall[data-ready="true"]', bookName: '.wall-name', bar: '.wall-bar' },
  { name: 'Genesis 1', hash: '#/book/genesis/1', ready: '.rd-name', bookName: '.rd-name', bar: '.rd-bar' },
  { name: 'the map page of Acts', hash: '#/book/acts/map', ready: '.map-svg[data-ready="true"]', bookName: '.map-name', bar: '.map-bar' },
]

/** The records of the map before Task 41, step 3: the places of the dots and the texts of the names, in document order. */
const MAP_BEFORE = JSON.parse(readFileSync(new URL('../docs/screenshots/task-41/map-before.json', import.meta.url), 'utf8')) as Record<
  string,
  { dots: string[]; names: string[] }
>

/** Opens a page, and waits until its fonts and its data load. Returns the names of the font files that the browser downloads. */
async function open(page: Page, hash: string, ready: string): Promise<string[]> {
  const files: string[] = []
  page.on('request', (r) => {
    if (r.resourceType() === 'font') files.push(r.url().split('?')[0].split('/').pop()!)
  })
  await page.goto(`./${hash}`)
  await page.locator(ready).first().waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState('networkidle')
  return files
}

const family = (page: Page, selector: string) => page.locator(selector).first().evaluate((e) => getComputedStyle(e).fontFamily)

test.describe('the font Inrond', () => {
  for (const { name: size, viewport, key } of SIZES) {
    test.describe(`at ${size}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport)
      })

      for (const p of PAGES) {
        test(`${p.name}: the book name and the top bar are in Inrond, and no file of Inter downloads`, async ({ page }) => {
          const files = await open(page, p.hash, p.ready)
          expect(await family(page, p.bookName)).toMatch(/^Inrond\b/)
          expect(await family(page, p.bar)).toMatch(/^Inrond\b/)
          if (p.name === 'the wall') expect(await page.evaluate(() => document.fonts.check('800 20px Inrond'))).toBe(true)
          if (p.name === 'the map page of Acts') expect(await family(page, '.map-names text')).toMatch(/^Inrond\b/)
          expect(files.some((f) => f.startsWith('inrond-'))).toBe(true)
          expect(files.filter((f) => f.includes('inter-'))).toEqual([])
        })
      }

      test('Genesis 1: the Bible text is in Lora', async ({ page }) => {
        await open(page, '#/book/genesis/1', '.rd-name')
        expect(await family(page, '.rd-column p.tb')).toMatch(/^Lora\b/)
      })

      test('the wall: with each request for Inrond stopped, the book names show and fill their columns', async ({ page }) => {
        let stopped = 0
        await page.route(/inrond-[^/]*\.woff2/, (route) => {
          stopped++
          return route.abort()
        })
        await page.goto('./')
        await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
        await page.evaluate(() => document.fonts.ready)
        expect(stopped).toBeGreaterThan(0)
        expect(await page.evaluate(() => document.fonts.check('800 20px Inrond'))).toBe(false)
        const links = page.getByRole('navigation', { name: 'Books' }).getByRole('link')
        await expect(links).toHaveCount(66)
        for (const link of await links.all()) await expect(link).toBeVisible()
        // As in wall.spec.ts: the right edge of the letters, without the spacing after the last letter, against the right edge of the column.
        const sizes = await links.evaluateAll((els) =>
          els.map((a) => {
            const box = a.getBoundingClientRect()
            const range = document.createRange()
            range.selectNodeContents(a)
            const spacing = parseFloat(getComputedStyle(a).letterSpacing) || 0
            return { name: a.textContent, over: range.getBoundingClientRect().right - spacing - box.right }
          }),
        )
        expect(sizes.filter((s) => Math.abs(s.over) > 0.5).map((s) => `${s.name} ${s.over.toFixed(2)}`)).toEqual([])
      })

      // The timeline shows its names on a line only in the wide layout. The narrow layout is a list, with no measure on a canvas.
      if (key === '1440x900') {
        test('the timeline: with each request for Inrond stopped, each book name shows at the width that the canvas measures', async ({ page }) => {
          let stopped = 0
          await page.route(/inrond-[^/]*\.woff2/, (route) => {
            stopped++
            return route.abort()
          })
          await page.goto('./#/timeline')
          await expect(page.locator('.tl-body')).toHaveAttribute('data-ready', 'true')
          await page.evaluate(() => document.fonts.ready)
          expect(stopped).toBeGreaterThan(0)
          // The width that the code measured with NAME_FONT of src/reference/TimelinePage.tsx is in the page: the rect `.tl-hit`
          // is 8 px wider than the name. The width that the page shows is the advance width of the text. getBBox() also has the
          // ink of a letter that reaches past its advance width. docs/DESIGN.md section 16.10.
          const sizes = await page.locator('.tl-link').evaluateAll((links) =>
            links.map((a) => {
              const name = a.querySelector('.tl-name') as SVGTextElement
              const hit = a.querySelector('.tl-hit') as SVGRectElement
              return { name: name.textContent, shown: name.getComputedTextLength(), measured: hit.width.baseVal.value - 8 }
            }),
          )
          expect(sizes.length).toBeGreaterThan(0)
          expect(sizes.filter((s) => Math.abs(s.shown - s.measured) > 0.5).map((s) => `${s.name} ${s.shown.toFixed(2)} ${s.measured.toFixed(2)}`)).toEqual([])
        })
      }

      test('the map of Acts: with each request for a font file stopped, the map is ready, and no name touches a different name', async ({ page }) => {
        let stopped = 0
        await page.route(/\.woff2?(\?|$)/, (route) => {
          stopped++
          return route.abort()
        })
        await page.goto('./#/book/acts/map')
        await expect(page.locator('.map-svg')).toHaveAttribute('data-ready', 'true')
        await page.evaluate(() => document.fonts.ready)
        expect(stopped).toBeGreaterThan(0)
        const problems = await page.evaluate(() => {
          const touch = (a: DOMRect, b: DOMRect) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
          const names = [...document.querySelectorAll('.map-names text')].map((e) => ({ text: e.textContent, r: e.getBoundingClientRect() }))
          const out: string[] = []
          names.forEach((a, n) => names.slice(n + 1).forEach((b) => touch(a.r, b.r) && out.push(`${a.text} touches ${b.text}`)))
          return { count: names.length, out }
        })
        expect(problems.count).toBeGreaterThan(0)
        expect(problems.out).toEqual([])
        const place = page.locator('.map-names text[data-kind="dot"]').first()
        expect(await place.evaluate((e) => getComputedStyle(e).fontFamily)).toContain('system-ui')
      })

      for (const id of ['acts', 'joshua', 'matthew']) {
        test(`the map of ${id}: the dots and the names of the first view are the same as before Task 41`, async ({ page }) => {
          await open(page, `#/book/${id}/map`, '.map-svg[data-ready="true"]')
          const record = await page.locator('.map-svg').evaluate((s) => ({
            dots: [...s.querySelectorAll('.map-dots > *')].map((e) => e.getAttribute('data-place')),
            names: [...s.querySelectorAll('.map-names text')].map((e) => e.textContent),
          }))
          expect(record).toEqual(MAP_BEFORE[`${id} ${key}`])
        })
      }

      for (const p of PAGES) {
        test(`${p.name}: the axe check finds no problem`, async ({ page }) => {
          await open(page, p.hash, p.ready)
          await page.waitForTimeout(800)
          const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
          expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
        })
      }
    })
  }

  test('the Sources page links to OFL-inrond.txt, and the link returns the file', async ({ page, request }) => {
    await page.goto('./#/sources')
    const link = page.locator('section[aria-labelledby="sources-fonts"] a[href$="OFL-inrond.txt"]')
    await expect(link).toHaveText('SIL Open Font License, Version 1.1')
    const response = await request.get((await link.evaluate((a) => (a as HTMLAnchorElement).href)) as string)
    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('Copyright 2026 The Inrond Project Authors')
  })
})
