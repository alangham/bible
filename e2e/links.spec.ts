import { expect, test } from '@playwright/test'

test.describe('links, travel, and trail', () => {
  test('Hebrews 9: a quotation link opens, travel goes to Exodus 24:8, and the trail goes back', async ({ page }) => {
    await page.goto('./#/book/hebrews/9')
    const title = page.getByRole('heading', { level: 1 })
    await expect(title).toHaveText('Hebrews Chapter 9')

    await page.getByRole('button', { name: /^Links of Hebrews 9:20: 1 quotation link/ }).click()
    const popup = page.getByRole('dialog', { name: 'Links of Hebrews 9:20' })
    await expect(popup.getByRole('heading', { name: /Exodus 24:8/ })).toBeVisible()
    await expect(popup).toContainText('This is the blood of the covenant')
    await expect(popup.locator('.link-reason')).not.toBeEmpty()

    await popup.getByRole('link', { name: 'Go there' }).click()
    await expect(page).toHaveURL(/#\/book\/exodus\/24\/8$/, { timeout: 10_000 })
    await expect(title).toHaveText('Exodus Chapter 24')

    const trail = page.getByRole('navigation', { name: 'Trail' })
    await expect(trail.getByRole('link')).toHaveText(['Hebrews 9:20', 'Exodus 24:8'])
    await trail.getByRole('link', { name: 'Hebrews 9:20' }).click()
    await expect(page).toHaveURL(/#\/book\/hebrews\/9\/20$/)
    await expect(title).toHaveText('Hebrews Chapter 9')
  })

  test('an entry of the read-with list starts travel to that chapter', async ({ page }) => {
    await page.goto('./#/book/hebrews/9')
    const list = page.getByRole('navigation', { name: 'Read with' })
    await expect(list.getByRole('link')).toHaveText(['1 Peter 1', 'Isaiah 53', 'Galatians 3', 'Leviticus 16', '1 Peter 3'])
    await list.getByRole('link', { name: 'Leviticus 16' }).click()
    await expect(page).toHaveURL(/#\/book\/leviticus\/16$/, { timeout: 10_000 })
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Leviticus Chapter 16')
    await expect(page.getByRole('navigation', { name: 'Trail' }).getByRole('link')).toHaveText(['Hebrews 9', 'Leviticus 16'])
  })
})
