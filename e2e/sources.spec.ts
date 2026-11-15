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

  // docs/TASKS.md Task 17 step 11: the fonts section names Inter and Lora, with their copyright lines and licences.
  test('the fonts section names Inter and Lora with their copyright lines and licence files', async ({ page, request }) => {
    await page.goto('./#/sources')
    const fonts = page.locator('section[aria-labelledby="sources-fonts"]')
    await expect(fonts.getByRole('listitem')).toHaveCount(2)
    await expect(fonts).toContainText('Inter. Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter).')
    await expect(fonts).toContainText('Lora. Copyright 2011 The Lora Project Authors (https://github.com/cyrealtype/Lora-Cyrillic), with Reserved Font Name "Lora".')
    await expect(fonts).not.toContainText('Cormorant')
    await expect(fonts).not.toContainText('Newsreader')
    const hrefs = await fonts.getByRole('link').evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href))
    expect(hrefs.map((h) => h.split('/').pop())).toEqual(['OFL-inter.txt', 'OFL-lora.txt'])
    for (const href of hrefs) {
      const response = await request.get(href)
      expect(response.status()).toBe(200)
      expect(await response.text()).toContain('SIL OPEN FONT LICENSE Version 1.1')
    }
  })
})
