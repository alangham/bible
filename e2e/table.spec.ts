import { expect, test } from '@playwright/test'

test.describe('table page', () => {
  test('loads with the title and 66 spines', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Books of the Bible')
    const spines = page.getByRole('navigation', { name: 'Books' }).getByRole('link')
    await expect(spines).toHaveCount(66)
    await expect(page.locator('.table-scene')).toHaveAttribute('data-mode', '3d')
    await expect(page.locator('.spine-links')).toHaveAttribute('data-ready', 'true')
  })

  test('a legend entry dims the other groups, and a second select clears it', async ({ page }) => {
    await page.goto('/')
    const law = page.getByRole('button', { name: 'Law' })
    await law.click()
    await expect(law).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('a.spine[data-group="Law"][data-dimmed="false"]')).toHaveCount(5)
    await expect(page.locator('a.spine[data-dimmed="true"]')).toHaveCount(61)

    await law.click()
    await expect(law).toHaveAttribute('aria-pressed', 'false')
    await expect(page.locator('a.spine[data-dimmed="true"]')).toHaveCount(0)
  })

  test('a spine goes to #/book/<id> from the keyboard', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Psalms' }).focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#\/book\/psalms$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Psalms')
  })

  test('a focused spine slides out, and its ring follows it', async ({ page }) => {
    await page.goto('/')
    const psalms = page.getByRole('link', { name: 'Psalms' })
    await psalms.focus()
    await expect(psalms).not.toHaveAttribute('style', /--ring-top: 0px/)
  })

  test('the layout is wide at 768 px and narrow at 767 px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 })
    await page.goto('/')
    await expect(page.locator('.app')).toHaveAttribute('data-layout', 'wide')
    await page.setViewportSize({ width: 767, height: 900 })
    await expect(page.locator('.app')).toHaveAttribute('data-layout', 'narrow')
  })

  test('with reduced motion, a focused spine does not move', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('.table-scene')).toHaveAttribute('data-reduced-motion', 'true')
    const psalms = page.getByRole('link', { name: 'Psalms' })
    await psalms.focus()
    await expect(psalms).toHaveAttribute('style', /--ring-left: 0px; --ring-top: 0px/)
  })
})
