/// <reference lib="dom" />
// The wall: the first page. docs/DESIGN.md section 7.4, docs/TASKS.md Task 12 step 10.
// The axe-core check of the wall at the two sizes is in a11y.spec.ts.

import { expect, test, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }

async function openWall(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport)
  await page.goto('./')
  await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
}

const bookLinks = (page: Page) => page.getByRole('navigation', { name: 'Books' }).getByRole('link')

test.describe('wall', () => {
  test('has 66 book links in Bible order, each to #/book/<id>', async ({ page }) => {
    await openWall(page, WIDE)
    await expect(bookLinks(page)).toHaveCount(66)
    const hrefs = await bookLinks(page).evaluateAll((els) => els.map((e) => e.getAttribute('href')))
    expect(hrefs[0]).toBe('#/book/genesis')
    expect(hrefs[65]).toBe('#/book/revelation')
    for (const h of hrefs) expect(h).toMatch(/^#\/book\/[a-z0-9-]+$/)
  })

  test('starts each group with its band, and the band of Acts says "History"', async ({ page }) => {
    await openWall(page, NARROW)
    const bands = page.locator('.wall-band')
    await expect(bands).toHaveCount(10)
    await expect(bands.nth(6)).toHaveText('History')
    // The band and the names of a group have the group color.
    const law = await page.getByRole('link', { name: 'Genesis' }).evaluate((e) => getComputedStyle(e).color)
    expect(law).toBe('rgb(194, 37, 92)')
    expect(await bands.first().evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(194, 37, 92)')
  })

  test('a book name opens its book, also from the keyboard', async ({ page }) => {
    await openWall(page, WIDE)
    await page.getByRole('link', { name: 'Psalms' }).click()
    await expect(page).toHaveURL(/#\/book\/psalms\/1$/)
    await expect(page.locator('.rd-heading').first()).toHaveText('Psalms 1')
    await page.goBack()
    await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
    await page.getByRole('link', { name: 'Jude' }).focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#\/book\/jude\/1$/)
  })

  test('at 1440 by 900 px, the page is not higher than the screen, and the links of the top bar are in view', async ({ page }) => {
    await openWall(page, WIDE)
    await expect(page.locator('main.wall')).toHaveAttribute('data-layout', 'wide')
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(WIDE.height)
    await expect(page.getByRole('navigation', { name: 'Reference' }).getByRole('link', { name: 'Sources' })).toBeInViewport()
  })

  test('at 390 by 844 px, the page is not wider than the screen', async ({ page }) => {
    await openWall(page, NARROW)
    await expect(page.locator('main.wall')).toHaveAttribute('data-layout', 'narrow')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(NARROW.width)
  })

  for (const viewport of [WIDE, NARROW]) {
    test(`each book link is 24 px high or more, and no name is wider than its column, at ${viewport.width} px`, async ({ page }) => {
      await openWall(page, viewport)
      const sizes = await bookLinks(page).evaluateAll((els) =>
        els.map((a) => {
          const box = a.getBoundingClientRect()
          const range = document.createRange()
          range.selectNodeContents(a)
          // The spacing after the last letter is not part of the name.
          const spacing = parseFloat(getComputedStyle(a).letterSpacing) || 0
          return { name: a.textContent, height: box.height, over: range.getBoundingClientRect().right - spacing - box.right }
        }),
      )
      expect(sizes).toHaveLength(66)
      expect(Math.min(...sizes.map((s) => s.height))).toBeGreaterThanOrEqual(24)
      expect(sizes.filter((s) => s.over > 0.5).map((s) => s.name)).toEqual([])
    })
  }

  test('in the narrow layout, a group with one book fills the full width', async ({ page }) => {
    await openWall(page, NARROW)
    const width = async (name: string) => (await page.getByRole('link', { name, exact: true }).boundingBox())?.width ?? 0
    expect(await width('Acts')).toBeCloseTo(350, 0)
    expect(await width('Revelation')).toBeCloseTo(350, 0)
    expect(await width('Genesis')).toBeCloseTo(168, 0)
  })

  test('the top bar has the links Timeline, Quotations, and Sources', async ({ page }) => {
    await openWall(page, WIDE)
    const reference = page.getByRole('navigation', { name: 'Reference' })
    await expect(reference.getByRole('link')).toHaveText(['Timeline', 'Quotations', 'Sources'])
    await reference.getByRole('link', { name: 'Timeline' }).click()
    await expect(page).toHaveURL(/#\/timeline$/)
  })

  test('a hovered name keeps its full color and gets an underline', async ({ page }) => {
    await openWall(page, WIDE)
    const genesis = page.getByRole('link', { name: 'Genesis' })
    await genesis.hover()
    const style = await genesis.evaluate((e) => ({ opacity: getComputedStyle(e).opacity, line: getComputedStyle(e).textDecorationLine, color: getComputedStyle(e).color }))
    expect(style).toEqual({ opacity: '1', line: 'underline', color: 'rgb(194, 37, 92)' })
  })

  test('the layout is wide at 900 px and narrow at 899 px', async ({ page }) => {
    await openWall(page, { width: 900, height: 900 })
    await expect(page.locator('main.wall')).toHaveAttribute('data-layout', 'wide')
    await page.setViewportSize({ width: 899, height: 900 })
    await expect(page.locator('main.wall')).toHaveAttribute('data-layout', 'narrow')
  })
})
