import { expect, test } from '@playwright/test'

test.describe('sources page', () => {
  test('opens from the wall and credits OpenBible.info with a link to CC BY 4.0', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('navigation', { name: 'Reference' }).getByRole('link', { name: 'Sources' }).click()
    await expect(page).toHaveURL(/#\/sources$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sources')

    const credit = page.locator('.credit-openbible')
    await expect(credit.getByRole('link', { name: 'OpenBible.info' })).toHaveAttribute('href', 'https://www.openbible.info/labs/cross-references/')
    await expect(credit.getByRole('link', { name: /CC BY 4\.0/ })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/')
    await expect(page.getByText('The Berean Standard Bible is in the public domain.', { exact: false })).toBeVisible()
  })
})
