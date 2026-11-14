/// <reference lib="dom" />
// The phone layout. docs/TASKS.md Task 9 steps 1 and 2.

import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

test.describe('phone layout', () => {
  test('the table shows one stack at a time, with spines of 44 px or more', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('.app')).toHaveAttribute('data-layout', 'narrow')
    await expect(page.locator('.table-scene')).toHaveAttribute('data-mode', 'flat')
    const spines = page.getByRole('navigation', { name: 'Books' }).getByRole('link')
    await expect(spines).toHaveCount(66)
    const heights = await page.locator('a.spine').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))
    expect(Math.min(...heights)).toBeGreaterThanOrEqual(44)
    // Only the first stack is in view.
    await expect(page.getByRole('link', { name: 'Genesis' })).toBeInViewport()
    await expect(page.getByRole('link', { name: '2 Chronicles' })).not.toBeInViewport()
  })

  test('the stack buttons move between the stacks', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    await expect(page.getByText('Stack 1 of 5')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Previous stack' })).toHaveAttribute('aria-disabled', 'true')
    await page.getByRole('button', { name: 'Next stack' }).click()
    await expect(page.getByText('Stack 2 of 5')).toBeVisible()
    await expect(page.getByRole('link', { name: '2 Chronicles' })).toBeInViewport()
    await expect(page.getByRole('link', { name: 'Genesis' })).not.toBeInViewport()
  })

  test('the last stack keeps the focus on "Next stack", and a legend group brings its stack into view', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    const next = page.getByRole('button', { name: 'Next stack' })
    for (let i = 0; i < 4; i++) await next.click()
    await expect(page.getByText('Stack 5 of 5')).toBeVisible()
    await expect(next).toHaveAttribute('aria-disabled', 'true')
    await expect(next).toBeFocused()
    await page.getByRole('button', { name: 'Minor Prophets' }).click()
    await expect(page.getByText('Stack 3 of 5')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Hosea' })).toBeInViewport()
  })

  test('a swipe to the left on the spread turns to the next chapter, and a swipe to the right turns back', async ({ page }) => {
    await page.goto('./#/book/ruth/1')
    await expect(page.locator('.chapter-body')).toBeVisible()
    const swipe = async (dx: number) =>
      page.locator('.spread-book').evaluate((el, dx) => {
        const at = (x: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 400 })
        el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [at(200)], changedTouches: [at(200)] }))
        el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [at(200 + dx)] }))
      }, dx)
    await swipe(-120)
    await expect(page).toHaveURL(/#\/book\/ruth\/2$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Chapter 2')
    await swipe(120)
    await expect(page).toHaveURL(/#\/book\/ruth\/1$/)
  })

  test('a short or a mostly vertical move does not turn the page', async ({ page }) => {
    await page.goto('./#/book/ruth/1')
    await expect(page.locator('.chapter-body')).toBeVisible()
    await page.locator('.spread-book').evaluate((el) => {
      const at = (x: number, y: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: y })
      el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [at(200, 400)], changedTouches: [at(200, 400)] }))
      el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [at(170, 400)] }))
      el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [at(200, 400)], changedTouches: [at(200, 400)] }))
      el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [at(120, 600)] }))
    })
    await page.waitForTimeout(600)
    await expect(page).toHaveURL(/#\/book\/ruth\/1$/)
  })
})
