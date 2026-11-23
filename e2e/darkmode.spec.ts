/// <reference lib="dom" />
// The dark mode: the switch, the dark colors on each page, and the mode before the first paint.
// docs/DESIGN.md section 18, docs/TASKS.md Task 45 step 10. The tests run at 1440 by 900 px and at 390 by 844 px.

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }
const VIEWPORTS = [
  { name: '1440 by 900 px', size: WIDE },
  { name: '390 by 844 px', size: NARROW },
] as const
const KEY = 'bible-dark-mode'
/** The WCAG rules that axe-core checks, as in a11y.spec.ts. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

/** The colors of docs/DESIGN.md sections 18.5 and 18.11, as the browser gives them. */
const DARK_PAGE = 'rgb(28, 28, 30)'
const DARK_INK = 'rgb(245, 245, 247)'
const LIGHT_PAGE = 'rgb(255, 255, 255)'
const LIGHT_INK = 'rgb(29, 29, 31)'
const DARK_LAW = 'rgb(242, 106, 144)'
const DARK_RED_LETTERS = 'rgb(238, 118, 108)'
const DARK_COAST = 'rgb(85, 81, 74)'

const isWide = (page: Page) => (page.viewportSize()?.width ?? 0) >= 900
const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)
const textList = (page: Page) => page.locator('#text-list')
const menuPanel = (page: Page) => page.locator('#menu-panel')
/** The dark mode switch: the row in the text list in the wide layout, the row in the menu panel in the narrow layout. */
const darkRow = (page: Page) => (isWide(page) ? textList(page) : menuPanel(page)).getByRole('button', { name: 'Dark mode', exact: true })

/** The attribute of the mode on the root element: "dark", or null in the light mode. */
const modeAttribute = (page: Page) => page.evaluate(() => document.documentElement.getAttribute('data-mode'))
const themeColor = (page: Page) => page.locator('meta[name="theme-color"]').getAttribute('content')
/** The background and the text color of the root element, as the browser gives them. */
const rootColors = (page: Page) =>
  page.evaluate(() => {
    const s = getComputedStyle(document.documentElement)
    return { background: s.backgroundColor, color: s.color }
  })

async function openChapter(page: Page, size: { width: number; height: number }, book: string, n: number) {
  await page.setViewportSize(size)
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
  await page.evaluate(() => document.fonts.ready)
}

/** Opens the text list or the menu panel, so that the dark mode switch is visible. */
async function openSwitch(page: Page) {
  if (isWide(page)) {
    await page.getByRole('button', { name: 'Text settings', exact: true }).click()
    await expect(textList(page)).toBeVisible()
  } else {
    await page.getByRole('button', { name: 'Menu', exact: true }).click()
    await expect(menuPanel(page)).toBeVisible()
  }
}

/** The 13 views of step 1 of Task 44: each opens its view, with the mode that the storage has. */
const VIEWS: { name: string; open: (page: Page) => Promise<void> }[] = [
  { name: 'the wall', open: async (p) => { await p.goto('./#/'); await expect(p.locator('main.wall[data-ready="true"]')).toBeVisible() } },
  {
    name: 'Matthew 1, with "About this book" open',
    open: async (p) => {
      await p.goto('./#/book/matthew/1')
      await expect(chapter(p, 'matthew', 1)).toHaveAttribute('data-loaded', 'true')
      await p.locator('.rd-about-control').first().click()
    },
  },
  { name: 'Matthew 5', open: async (p) => { await p.goto('./#/book/matthew/5'); await expect(chapter(p, 'matthew', 5)).toHaveAttribute('data-loaded', 'true') } },
  {
    name: 'Hebrews 9, the pop-up of Exodus 24:8',
    open: async (p) => {
      await p.goto('./#/book/hebrews/9')
      await expect(chapter(p, 'hebrews', 9)).toHaveAttribute('data-loaded', 'true')
      await p.getByRole('button', { name: isWide(p) ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8' }).click()
      await expect(p.getByRole('dialog', { name: 'Exodus 24:8' })).toBeVisible()
    },
  },
  {
    name: 'a trail of two stops',
    open: async (p) => {
      await p.goto('./#/book/hebrews/9')
      await expect(chapter(p, 'hebrews', 9)).toHaveAttribute('data-loaded', 'true')
      await p.getByRole('button', { name: isWide(p) ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8' }).click()
      await p.getByRole('dialog', { name: 'Exodus 24:8' }).getByRole('link', { name: 'Go there' }).click()
      await expect(p.getByRole('navigation', { name: 'Trail' })).toBeVisible()
    },
  },
  {
    name: 'John 3, the chapter grid open',
    open: async (p) => {
      await p.goto('./#/book/john/3')
      await expect(chapter(p, 'john', 3)).toHaveAttribute('data-loaded', 'true')
      await p.locator('.rd-where').click()
      await expect(p.locator('.rd-grid-panel')).toBeVisible()
    },
  },
  {
    name: 'John 3, the translation list open',
    open: async (p) => {
      await p.goto('./#/book/john/3')
      await expect(chapter(p, 'john', 3)).toHaveAttribute('data-loaded', 'true')
      await p.locator('.rd-tr').click()
      await expect(p.locator('#translation-list')).toBeVisible()
    },
  },
  {
    name: 'John 3, the text list or the menu panel open',
    open: async (p) => {
      await p.goto('./#/book/john/3')
      await expect(chapter(p, 'john', 3)).toHaveAttribute('data-loaded', 'true')
      await openSwitch(p)
    },
  },
  { name: 'the map of Acts', open: async (p) => { await p.goto('./#/book/acts/map'); await expect(p.locator('.map-svg[data-ready="true"]')).toBeVisible() } },
  {
    name: 'the map of Joshua, with the switch off',
    open: async (p) => {
      await p.goto('./#/book/joshua/map')
      await expect(p.locator('.map-svg[data-ready="true"]')).toBeVisible()
      await p.locator('.map-switch').click()
      await expect(p.locator('.map-switch')).toHaveAttribute('aria-checked', 'false')
    },
  },
  { name: 'the timeline', open: async (p) => { await p.goto('./#/timeline'); await expect(p.locator('.tl-body[data-ready="true"]')).toBeVisible() } },
  {
    name: 'the Quotations page, with Romans selected',
    open: async (p) => {
      await p.goto('./#/quotations')
      await expect(p.locator('.q-layout[data-ready="true"]')).toBeVisible()
      await p.getByRole('group', { name: 'Diagram of the quotation links between books' }).getByRole('button', { name: 'Romans', exact: true }).click()
    },
  },
  { name: 'the Sources page', open: async (p) => { await p.goto('./#/sources'); await expect(p.locator('#sources-videos')).toBeVisible() } },
]

for (const vp of VIEWPORTS) {
  test.describe(`dark mode, ${vp.name}`, () => {
    test('the first visit on a light device: the switch is "Off", the root element has no dark attribute, and theme-color is #ffffff', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3)
      expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull()
      expect(await modeAttribute(page)).toBeNull()
      expect(await themeColor(page)).toBe('#ffffff')
      expect(await rootColors(page)).toEqual({ background: LIGHT_PAGE, color: LIGHT_INK })
      await openSwitch(page)
      await expect(darkRow(page)).toHaveAttribute('aria-pressed', 'false')
      await expect(darkRow(page)).toContainText('Off')
    })

    test('the switch "On" makes the page dark at once, and "Off" makes it light again', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3)
      const verse = chapter(page, 'john', 3).locator('p:has(.vn)').first()
      const reading = page.locator('.reading')
      await openSwitch(page)
      await darkRow(page).click()
      await expect(darkRow(page)).toHaveAttribute('aria-pressed', 'true')
      await expect(darkRow(page)).toContainText('On')
      // The list or the panel stays open.
      await expect(isWide(page) ? textList(page) : menuPanel(page)).toBeVisible()
      expect(await modeAttribute(page)).toBe('dark')
      expect(await rootColors(page)).toEqual({ background: DARK_PAGE, color: DARK_INK })
      await expect(reading).toHaveCSS('background-color', DARK_PAGE)
      await expect(verse).toHaveCSS('color', DARK_INK)
      expect(await themeColor(page)).toBe('#1C1C1E')
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark')
      expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe('on')

      await darkRow(page).click()
      await expect(darkRow(page)).toHaveAttribute('aria-pressed', 'false')
      expect(await modeAttribute(page)).toBeNull()
      expect(await rootColors(page)).toEqual({ background: LIGHT_PAGE, color: LIGHT_INK })
      await expect(reading).toHaveCSS('background-color', LIGHT_PAGE)
      await expect(verse).toHaveCSS('color', LIGHT_INK)
      expect(await themeColor(page)).toBe('#ffffff')
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('normal')
      expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe('off')
    })

    test('the selection stays after a new load, and applies on the wall, the map of Acts, the timeline, Quotations, and Sources', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3)
      await openSwitch(page)
      await darkRow(page).click()
      await page.reload()
      await expect(chapter(page, 'john', 3)).toHaveAttribute('data-loaded', 'true')
      expect(await modeAttribute(page)).toBe('dark')
      expect(await themeColor(page)).toBe('#1C1C1E')
      await openSwitch(page)
      await expect(darkRow(page)).toHaveAttribute('aria-pressed', 'true')
      const pages = [
        { hash: '#/', part: 'main.wall' },
        { hash: '#/book/acts/map', part: '.ref-page' },
        { hash: '#/timeline', part: '.ref-page' },
        { hash: '#/quotations', part: '.ref-page' },
        { hash: '#/sources', part: '.ref-page' },
      ]
      for (const { hash, part } of pages) {
        // A new load of each page: the script of index.html sets the mode from the storage.
        await page.goto(`./${hash}`)
        await page.reload()
        await expect(page.locator(part).first(), hash).toHaveCSS('background-color', DARK_PAGE)
        expect(await modeAttribute(page), hash).toBe('dark')
        expect(await rootColors(page), hash).toEqual({ background: DARK_PAGE, color: DARK_INK })
        expect(await themeColor(page), hash).toBe('#1C1C1E')
      }
    })

    test('with the key set before the load and no JavaScript file, the root element is dark: the mode is set before the first paint', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.addInitScript((k) => localStorage.setItem(k, 'on'), KEY)
      let stopped = 0
      await page.route(/\/assets\/.*\.js$/, (route) => {
        stopped++
        return route.abort()
      })
      await page.goto('./#/book/matthew/5')
      await page.waitForLoadState('load')
      expect(stopped).toBeGreaterThan(0)
      // No module ran: the page has no chapter, and the root element has its color from the script of index.html.
      await expect(page.locator('section.rd-chapter')).toHaveCount(0)
      expect(await modeAttribute(page)).toBe('dark')
      expect((await rootColors(page)).background).toBe(DARK_PAGE)
      expect(await themeColor(page)).toBe('#1C1C1E')
    })

    test('the dark colors: the band text of Matthew, Genesis on the wall, and the red letters of Matthew 5', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.addInitScript((k) => localStorage.setItem(k, 'on'), KEY)
      await page.goto('./#/book/matthew/5')
      await expect(chapter(page, 'matthew', 5)).toHaveAttribute('data-loaded', 'true')
      // The text of the band has the color of the page. docs/DESIGN.md section 18.4.
      await expect(chapter(page, 'matthew', 5).locator('.rd-band')).toHaveCSS('color', DARK_PAGE)
      await expect(chapter(page, 'matthew', 5).locator('.red-letters').first()).toHaveCSS('color', DARK_RED_LETTERS)
      await page.goto('./#/')
      await expect(page.locator('main.wall[data-ready="true"]')).toBeVisible()
      await expect(page.locator('main.wall a').filter({ hasText: /^Genesis$/i }).first()).toHaveCSS('color', DARK_LAW)
    })

    test('the map of Acts in the dark mode: the sea has the page color, the coast lines show, and the mask keeps its white and black', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.addInitScript((k) => localStorage.setItem(k, 'on'), KEY)
      await page.goto('./#/book/acts/map')
      const svg = page.locator('.map-svg[data-ready="true"]')
      await expect(svg).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      await expect(svg.locator(':scope > rect').first()).toHaveCSS('fill', DARK_PAGE)
      const coast = svg.locator('.map-lines path').first()
      await expect(coast).toHaveCSS('stroke', DARK_COAST)
      // The mask: one white rectangle that shows, and one black rectangle for each name, as in the light mode.
      const mask = svg.locator('mask')
      await expect(mask.locator('rect[fill="#fff"]')).toHaveCount(1)
      await expect(mask.locator('rect[fill="#fff"]')).toHaveCSS('fill', LIGHT_PAGE)
      expect(await mask.locator('rect[fill="#000"]').count()).toBe(await svg.locator('.map-names text').count())
      await expect(mask.locator('rect[fill="#000"]').first()).toHaveCSS('fill', 'rgb(0, 0, 0)')
      // The lines show: a screenshot with the lines and one without them differ in many pixels.
      const lines = svg.locator('.map-lines')
      const withLines = (await svg.screenshot({ animations: 'disabled' })).toString('base64')
      await lines.evaluate((el) => ((el as unknown as SVGElement).style.visibility = 'hidden'))
      const withoutLines = (await svg.screenshot({ animations: 'disabled' })).toString('base64')
      await lines.evaluate((el) => ((el as unknown as SVGElement).style.visibility = ''))
      const changed = await page.evaluate(
        async ([a, b]) => {
          const pixels = async (b64: string) => {
            const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob())
            const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
            const ctx = canvas.getContext('2d')!
            ctx.drawImage(bitmap, 0, 0)
            return ctx.getImageData(0, 0, bitmap.width, bitmap.height).data
          }
          const [pa, pb] = [await pixels(a), await pixels(b)]
          let n = 0
          for (let i = 0; i < pa.length; i += 4) if (pa[i] !== pb[i] || pa[i + 1] !== pb[i + 1] || pa[i + 2] !== pb[i + 2]) n++
          return n
        },
        [withLines, withoutLines] as const,
      )
      expect(changed).toBeGreaterThan(1000)
    })

    test('the switch works with the keyboard, and its state is in aria-pressed', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3)
      await openSwitch(page)
      const row = darkRow(page)
      const box = (await row.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(24)
      expect(box.height).toBeGreaterThanOrEqual(24)
      for (let i = 0; i < 10; i++) {
        if (await row.evaluate((el) => el === document.activeElement)) break
        await page.keyboard.press('Tab')
      }
      await expect(row).toBeFocused()
      await page.keyboard.press('Enter')
      await expect(row).toHaveAttribute('aria-pressed', 'true')
      expect(await modeAttribute(page)).toBe('dark')
      await page.keyboard.press('Space')
      await expect(row).toHaveAttribute('aria-pressed', 'false')
      expect(await modeAttribute(page)).toBeNull()
      await expect(isWide(page) ? textList(page) : menuPanel(page)).toBeVisible()
    })

    test('the switch changes no other setting: text size, red letters, echo links, translation, and the switch of the map', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./#/')
      const others = {
        'bible-text-size': 'large',
        'bible-red-letters': 'off',
        'bible-echo-links': 'off',
        'bible-translation': 'kjv',
        'bible-map-uncertain': 'off',
      }
      await page.evaluate((o) => {
        for (const [k, v] of Object.entries(o)) localStorage.setItem(k, v)
      }, others)
      await page.goto('./#/book/john/3')
      await page.reload()
      await expect(chapter(page, 'john', 3)).toHaveAttribute('data-loaded', 'true')
      const reading = page.locator('.reading')
      const state = async () => ({
        size: await reading.getAttribute('data-text-size'),
        red: await reading.getAttribute('data-red-letters'),
        translation: await chapter(page, 'john', 3).getAttribute('data-translation'),
        stored: await page.evaluate((keys) => keys.map((k) => localStorage.getItem(k)), Object.keys(others)),
      })
      const before = await state()
      expect(before).toEqual({ size: 'large', red: 'off', translation: 'kjv', stored: Object.values(others) })
      await openSwitch(page)
      await darkRow(page).click()
      expect(await modeAttribute(page)).toBe('dark')
      expect(await state()).toEqual(before)
      await darkRow(page).click()
      expect(await modeAttribute(page)).toBeNull()
      expect(await state()).toEqual(before)
    })

    test('the axe check in the dark mode, for each of the 13 views', async ({ page }) => {
      test.setTimeout(180_000)
      await page.setViewportSize(vp.size)
      // On the context, so that each new page has the key before its load.
      await page.context().addInitScript((k) => localStorage.setItem(k, 'on'), KEY)
      const failures: string[] = []
      for (const view of VIEWS) {
        // A new page for each view, so that each one starts with no trail and no open panel.
        const p = await page.context().newPage()
        await p.setViewportSize(vp.size)
        await view.open(p)
        await p.waitForLoadState('networkidle')
        await p.evaluate(() => document.fonts.ready)
        await p.waitForTimeout(800)
        expect(await modeAttribute(p), view.name).toBe('dark')
        const result = await new AxeBuilder({ page: p }).withTags(AXE_TAGS).analyze()
        for (const v of result.violations) for (const n of v.nodes) failures.push(`${view.name}: ${v.id} (${v.impact}): ${n.target.join(' ')}: ${n.failureSummary?.split('\n')[1]?.trim() ?? ''}`)
        await p.close()
      }
      expect(failures).toEqual([])
    })
  })
}

test.describe('the dark mode switch, its place in the two lists', () => {
  test('the text list: "Red letters", a thin line, and "Dark mode", with "Study notes" below it from Task 49', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 3)
    await openSwitch(page)
    // The first child is the group of the three sizes: the first name in it is "Standard".
    const order = await textList(page).evaluate((el) => [...el.children].map((c) => (c.classList.contains('ts-rule') ? 'line' : c.querySelector('.tr-name')?.textContent)))
    expect(order).toEqual(['Standard', 'line', 'Red letters', 'line', 'Dark mode', 'Study notes'])
  })

  test('the menu panel: "Dark mode" is the row below "Red letters", with no line between', async ({ page }) => {
    await openChapter(page, NARROW, 'john', 3)
    await openSwitch(page)
    // From Task 49, the row "Study notes" is below "Dark mode".
    const order = await menuPanel(page).evaluate((el) => [...el.children].slice(0, 6).map((c) => (c.classList.contains('menu-rule') ? 'line' : c.textContent?.slice(0, 11))))
    expect(order).toEqual(['Echo linksO', 'Text sizeSt', 'Red letters', 'Dark modeOf', 'Study notes', 'line'])
  })
})
