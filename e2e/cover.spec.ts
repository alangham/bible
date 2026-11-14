import { expect, test } from '@playwright/test'

test.describe('cover page', () => {
  test('Genesis has the closed book, the three facts, the draft label, and 50 chapters', async ({ page }) => {
    await page.goto('./#/book/genesis')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Genesis')
    await expect(page.locator('.cover-page')).toHaveAttribute('data-mode', '3d')

    const facts = page.getByRole('region', { name: 'About this book' })
    await expect(facts.locator('dt')).toHaveText(['Author', 'Written', 'What it is'])
    for (const dd of await facts.locator('dd').all()) await expect(dd).not.toBeEmpty()
    await expect(facts.locator('.draft-label')).toBeVisible()

    const open = page.getByRole('link', { name: 'Open the book' })
    await expect(open).toHaveAttribute('href', '#/book/genesis/1')

    const chapters = page.getByRole('navigation', { name: 'Chapters' }).getByRole('link')
    await expect(chapters).toHaveCount(50)
    await page.getByRole('link', { name: 'Genesis chapter 3', exact: true }).click()
    await expect(page).toHaveURL(/#\/book\/genesis\/3$/)
  })

  test('a spine on the table lands as the closed book', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('.spine-links')).toHaveAttribute('data-ready', 'true')
    await page.getByRole('link', { name: 'Genesis', exact: true }).click()
    await expect(page).toHaveURL(/#\/book\/genesis$/)
    await expect(page.locator('.cover-page')).toHaveAttribute('data-landed', 'false')
    await expect(page.locator('.cover-page')).toHaveAttribute('data-landed', 'true')
    await expect(page.getByRole('link', { name: 'Open the book' })).toBeVisible()
  })

  test('without WebGL, the flat book and the facts show', async ({ page }) => {
    // The page gets no WebGL context. Other canvas contexts work.
    await page.addInitScript({
      content: `
        const getContext = HTMLCanvasElement.prototype.getContext
        HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
          if (String(type).includes('webgl')) return null
          return getContext.call(this, type, ...rest)
        }
      `,
    })
    await page.goto('./#/book/ruth')
    await expect(page.locator('.cover-page')).toHaveAttribute('data-mode', 'flat')
    await expect(page.locator('.cover-book')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ruth')
    await expect(page.getByRole('link', { name: 'Open the book' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'About this book' }).locator('dd').first()).toBeVisible()
  })

  test('with reduced motion, the book does not move from the table', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./')
    await expect(page.locator('.spine-links')).toHaveAttribute('data-ready', 'true')
    await page.getByRole('link', { name: 'Genesis', exact: true }).click()
    await expect(page).toHaveURL(/#\/book\/genesis$/)
    await expect(page.locator('.cover-page')).toHaveAttribute('data-landed', 'true')
  })
})
