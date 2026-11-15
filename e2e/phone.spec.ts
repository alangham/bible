/// <reference lib="dom" />
// The phone layout of the spread. docs/TASKS.md Task 9 step 2.
// Task 12 removed the narrow table. wall.spec.ts tests the narrow wall.

import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

test.describe('phone layout', () => {
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
