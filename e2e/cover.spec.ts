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

  test('Genesis gives the traditional author, and the control opens the detail in two parts', async ({ page }) => {
    await page.goto('./#/book/genesis')
    const author = page.locator('.fact').filter({ has: page.locator('dt', { hasText: 'Author' }) })
    await expect(author.locator('.fact-text')).toHaveText(/Moses/)
    await expect(author.locator('.fact-text')).not.toHaveText(/scholar/i)

    const control = author.getByRole('button', { name: 'Scholars differ' })
    await expect(control).toHaveAttribute('aria-expanded', 'false')
    const detail = page.getByRole('region', { name: 'Author: scholars differ' })
    await expect(detail).toBeHidden()

    await control.focus()
    await page.keyboard.press('Enter')
    await expect(control).toHaveAttribute('aria-expanded', 'true')
    await expect(detail).toBeVisible()
    await expect(detail.getByRole('heading', { level: 2 })).toHaveText(['Critical scholars', 'Conservative scholars'])
    await expect(detail.locator('.scholars-part p')).toHaveCount(2)

    const box = await control.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(44)
  })

  test('Romans has no Scholars differ control', async ({ page }) => {
    await page.goto('./#/book/romans')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Romans')
    await expect(page.locator('.facts dd').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Scholars differ' })).toHaveCount(0)
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
})
