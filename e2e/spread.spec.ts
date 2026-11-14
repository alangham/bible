import { expect, test } from '@playwright/test'

test.describe('spread page', () => {
  test('Genesis 1 opens with its text and a scene, and the page turns to Genesis 2', async ({ page }) => {
    await page.goto('./#/book/genesis/1')
    const title = page.getByRole('heading', { level: 1 })
    await expect(title).toHaveText('Genesis Chapter 1')
    await expect(page.locator('.chapter-body')).toContainText('In the beginning God created the heavens and the earth.')
    await expect(page.locator('.scene[data-half="right"]')).toHaveAttribute('data-phase', 'dawn')
    await expect(page.locator('.scene[data-half="right"] .scene-layer')).toHaveCount(4)

    await page.keyboard.press('ArrowRight')
    await expect(page).toHaveURL(/#\/book\/genesis\/2$/)
    await expect(title).toHaveText('Genesis Chapter 2')
    await expect(page.locator('.chapter-body')).toContainText('Thus the heavens and the earth were completed in all their vast array.')
  })

  test('Mark 16 shows the manuscript note after verse 8', async ({ page }) => {
    await page.goto('./#/book/mark/16')
    const note = page.getByRole('note').filter({ hasText: 'Some early manuscripts end the Gospel of Mark after verse 8.' })
    await expect(note).toHaveCount(1)
    await note.scrollIntoViewIfNeeded()
    await expect(note).toBeInViewport()
    // The note comes after verse 8 and before verse 9, which starts the longer ending.
    const top = async (selector: string) => (await page.locator(selector).boundingBox())!.y
    const y = (await note.boundingBox())!.y
    expect(await top('.chapter-body .vn[data-verse="8"]')).toBeLessThan(y)
    expect(y).toBeLessThan(await top('.chapter-body .vn[data-verse="9"]'))
  })
})
