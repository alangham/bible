/// <reference lib="dom" />
// The dark mode and the device: the first visit follows the media feature prefers-color-scheme, and a reader who
// used the switch keeps the selection. docs/DESIGN.md section 18.3, docs/TASKS.md Task 46 step 7.
// The tests run at 1440 by 900 px and at 390 by 844 px. The device is the color scheme that Playwright gives to the
// browser: playwright.config.ts gives a light device, and a test of a dark device sets it with page.emulateMedia.

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

/** The colors of docs/DESIGN.md section 18.11, as the browser gives them. */
const DARK_PAGE = 'rgb(28, 28, 30)'
const LIGHT_PAGE = 'rgb(255, 255, 255)'

type Device = 'light' | 'dark'

const isWide = (page: Page) => (page.viewportSize()?.width ?? 0) >= 900
const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)
const textList = (page: Page) => page.locator('#text-list')
const menuPanel = (page: Page) => page.locator('#menu-panel')
/** The dark mode switch: the row in the text list in the wide layout, the row in the menu panel in the narrow layout. */
const darkRow = (page: Page) => (isWide(page) ? textList(page) : menuPanel(page)).getByRole('button', { name: 'Dark mode', exact: true })
const modeAttribute = (page: Page) => page.evaluate(() => document.documentElement.getAttribute('data-mode'))
const themeColor = (page: Page) => page.locator('meta[name="theme-color"]').getAttribute('content')
const rootBackground = (page: Page) => page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)
const stored = (page: Page) => page.evaluate((k) => localStorage.getItem(k), KEY)

/** The device setting, and the stored value before the first load. "none" stores nothing. */
async function setUp(page: Page, size: { width: number; height: number }, device: Device, value: 'none' | 'on' | 'off') {
  await page.setViewportSize(size)
  await page.emulateMedia({ colorScheme: device })
  if (value !== 'none') await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [KEY, value] as const)
}

async function openChapter(page: Page, book: string, n: number) {
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
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

/** The mode on the page: the background, the attribute, the line theme-color, and the switch. */
async function expectMode(page: Page, dark: boolean, where = '') {
  await expect.poll(() => rootBackground(page), where).toBe(dark ? DARK_PAGE : LIGHT_PAGE)
  expect(await modeAttribute(page), where).toBe(dark ? 'dark' : null)
  expect(await themeColor(page), where).toBe(dark ? '#1C1C1E' : '#ffffff')
}

async function expectSwitch(page: Page, on: boolean) {
  await expect(darkRow(page)).toHaveAttribute('aria-pressed', String(on))
  await expect(darkRow(page)).toContainText(on ? 'On' : 'Off')
}

// The table of docs/TASKS.md Task 46. "light or dark" is two rows here.
const TABLE: { value: 'none' | 'on' | 'off'; device: Device; dark: boolean }[] = [
  { value: 'none', device: 'light', dark: false },
  { value: 'none', device: 'dark', dark: true },
  { value: 'on', device: 'light', dark: true },
  { value: 'on', device: 'dark', dark: true },
  { value: 'off', device: 'light', dark: false },
  { value: 'off', device: 'dark', dark: false },
]

for (const vp of VIEWPORTS) {
  test.describe(`dark mode and the device, ${vp.name}`, () => {
    for (const row of TABLE) {
      test(`the table: stored value ${row.value}, ${row.device} device, gives the ${row.dark ? 'dark' : 'light'} mode`, async ({ page }) => {
        await setUp(page, vp.size, row.device, row.value)
        await openChapter(page, 'john', 3)
        await expectMode(page, row.dark)
        await openSwitch(page)
        await expectSwitch(page, row.dark)
        expect(await stored(page)).toBe(row.value === 'none' ? null : row.value)
      })
    }

    test('a dark device and no stored value: after the load, the storage has no value for the key', async ({ page }) => {
      await setUp(page, vp.size, 'dark', 'none')
      await openChapter(page, 'john', 3)
      await page.waitForLoadState('networkidle')
      await openSwitch(page)
      await expectSwitch(page, true)
      expect(await stored(page)).toBeNull()
      await page.goto('./#/')
      await expect(page.locator('main.wall[data-ready="true"]')).toBeVisible()
      expect(await stored(page)).toBeNull()
    })

    test('a dark device, no stored value, and no JavaScript file: the root element is dark before the first paint', async ({ page }) => {
      await setUp(page, vp.size, 'dark', 'none')
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
      expect(await rootBackground(page)).toBe(DARK_PAGE)
      expect(await themeColor(page)).toBe('#1C1C1E')
    })

    test('no stored value: the open page follows the device from light to dark, and to light again', async ({ page }) => {
      await setUp(page, vp.size, 'light', 'none')
      await openChapter(page, 'john', 3)
      await openSwitch(page)
      await expectMode(page, false)
      await expectSwitch(page, false)
      await page.emulateMedia({ colorScheme: 'dark' })
      await expectMode(page, true)
      await expectSwitch(page, true)
      await page.emulateMedia({ colorScheme: 'light' })
      await expectMode(page, false)
      await expectSwitch(page, false)
      expect(await stored(page)).toBeNull()

      // A page with no switch follows the device also.
      await page.goto('./#/')
      await expect(page.locator('main.wall[data-ready="true"]')).toBeVisible()
      await page.emulateMedia({ colorScheme: 'dark' })
      await expectMode(page, true, 'the wall')
      await expect(page.locator('main.wall')).toHaveCSS('background-color', DARK_PAGE)
      await page.emulateMedia({ colorScheme: 'light' })
      await expectMode(page, false, 'the wall')
    })

    test('the stored value "off": the device changes to dark, and the page stays light', async ({ page }) => {
      await setUp(page, vp.size, 'light', 'off')
      await openChapter(page, 'john', 3)
      await openSwitch(page)
      await page.emulateMedia({ colorScheme: 'dark' })
      // Give a change of the device the time to arrive. Then the page must still be light.
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
      await page.waitForTimeout(300)
      await expectMode(page, false)
      await expectSwitch(page, false)
      expect(await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches)).toBe(true)
      expect(await stored(page)).toBe('off')
    })

    test('a dark device and no stored value: a click on the switch gives the light mode and stores "off", also after a new load', async ({ page }) => {
      await setUp(page, vp.size, 'dark', 'none')
      await openChapter(page, 'john', 3)
      await openSwitch(page)
      await expectSwitch(page, true)
      await darkRow(page).click()
      await expectSwitch(page, false)
      await expectMode(page, false)
      expect(await stored(page)).toBe('off')
      await page.reload()
      await expect(chapter(page, 'john', 3)).toHaveAttribute('data-loaded', 'true')
      await expectMode(page, false)
      await openSwitch(page)
      await expectSwitch(page, false)
    })

    test('a dark device and no stored value: the wall, the map of Acts, the timeline, Quotations, and Sources are dark', async ({ page }) => {
      await setUp(page, vp.size, 'dark', 'none')
      const pages = [
        { hash: '#/', part: 'main.wall' },
        { hash: '#/book/acts/map', part: '.ref-page' },
        { hash: '#/timeline', part: '.ref-page' },
        { hash: '#/quotations', part: '.ref-page' },
        { hash: '#/sources', part: '.ref-page' },
      ]
      for (const { hash, part } of pages) {
        await page.goto(`./${hash}`)
        await page.reload()
        await expect(page.locator(part).first(), hash).toHaveCSS('background-color', DARK_PAGE)
        await expectMode(page, true, hash)
      }
      expect(await stored(page)).toBeNull()
    })

    test('the axe check of the wall and of Matthew 5, on a dark device with no stored value', async ({ page }) => {
      await setUp(page, vp.size, 'dark', 'none')
      const failures: string[] = []
      for (const [name, open] of [
        ['the wall', async () => { await page.goto('./#/'); await expect(page.locator('main.wall[data-ready="true"]')).toBeVisible() }],
        ['Matthew 5', () => openChapter(page, 'matthew', 5)],
      ] as const) {
        await open()
        await page.waitForLoadState('networkidle')
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(800)
        expect(await modeAttribute(page), name).toBe('dark')
        const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        for (const v of result.violations) for (const n of v.nodes) failures.push(`${name}: ${v.id} (${v.impact}): ${n.target.join(' ')}`)
      }
      expect(failures).toEqual([])
      expect(await stored(page)).toBeNull()
    })
  })
}
