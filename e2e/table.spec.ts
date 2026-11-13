import { expect, test } from '@playwright/test'

test('table page shows the title', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Books of the Bible')
})
