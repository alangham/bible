import { expect, test } from '@playwright/test'

test.describe('timeline page', () => {
  test('loads with 66 books in two bands, the arcs, and the years between the bands', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('./#/timeline')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Timeline')
    await expect(page.locator('button.tl-spine')).toHaveCount(66)
    await expect(page.getByRole('list', { name: 'Old Testament, in date order' }).getByRole('button')).toHaveCount(39)
    await expect(page.getByRole('list', { name: 'New Testament, in date order' }).getByRole('button')).toHaveCount(27)
    await expect(page.locator('path.tl-arc')).toHaveCount(129)
    await expect(page.locator('.tl-between')).toHaveText(/^About \d+ years or more between the last Old Testament book and the first New Testament book$/)
  })

  test('a selected book shows its list, and a second action opens its cover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('./#/timeline')
    const hebrews = page.getByRole('button', { name: /^Hebrews,/ })
    await hebrews.click()
    await expect(hebrews).toHaveAttribute('aria-pressed', 'true')
    const panel = page.locator('.tl-panel')
    await expect(panel.getByRole('heading', { name: 'Hebrews' })).toBeVisible()
    await expect(panel).toContainText('Psalms: 38 quotation links')
    await expect(page.locator('path.tl-arc[data-state="on"]').first()).toBeAttached()

    await hebrews.click()
    await expect(page).toHaveURL(/#\/book\/hebrews$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hebrews')
  })

  test('works from the keyboard, and Escape clears the selection', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('./#/timeline')
    const psalms = page.getByRole('button', { name: /^Psalms,/ })
    await psalms.focus()
    await page.keyboard.press('Enter')
    await expect(psalms).toHaveAttribute('aria-pressed', 'true')
    await page.keyboard.press('Escape')
    await expect(psalms).toHaveAttribute('aria-pressed', 'false')
    await expect(page.locator('.tl-panel')).toHaveCount(0)
  })

  test('a legend entry dims the other groups, and a second select clears it', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('./#/timeline')
    const law = page.getByRole('button', { name: 'Law', exact: true })
    await law.click()
    await expect(law).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('button.tl-spine[data-dimmed="false"]')).toHaveCount(5)
    await law.click()
    await expect(page.locator('button.tl-spine[data-dimmed="true"]')).toHaveCount(0)
  })

  test('the narrow layout is a list in date order with no arcs', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('./#/timeline')
    await expect(page.locator('button.tl-row')).toHaveCount(66)
    await expect(page.locator('path.tl-arc')).toHaveCount(0)
    await page.getByRole('button', { name: /^Romans\b/ }).click()
    await expect(page.locator('.tl-panel')).toContainText('Isaiah: 22 quotation links')
  })

  test('the table, the cover, and the spread have a Timeline control', async ({ page }) => {
    for (const path of ['./', './#/book/ruth', './#/book/ruth/1']) {
      await page.goto(path)
      await page.getByRole('link', { name: 'Timeline' }).click()
      await expect(page).toHaveURL(/#\/timeline$/)
    }
  })
})
