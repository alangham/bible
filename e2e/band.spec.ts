/// <reference lib="dom" />
// The band: round corners of 3 px in its four places. docs/DESIGN.md section 7.4, docs/TASKS.md Task 32 step 4.
// The four places: the wall, the heading of a book on the reading page, the pop-up, and the Quotations page.

import { expect, test, type Locator } from '@playwright/test'

const VIEWPORTS = [
  { name: '1440 by 900 px', size: { width: 1440, height: 900 } },
  { name: '390 by 844 px', size: { width: 390, height: 844 } },
]

/** The four corners of each element, as the browser gives them. */
const corners = (l: Locator) =>
  l.evaluateAll((els) =>
    els.map((e) => {
      const s = getComputedStyle(e)
      return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius]
    }),
  )

/** Each band of a place has the four corners of 3 px. */
async function expectCorners(l: Locator, place: string, count: number) {
  await expect(l).toHaveCount(count)
  for (const c of await corners(l)) expect(c, place).toEqual(['3px', '3px', '3px', '3px'])
}

for (const vp of VIEWPORTS) {
  test(`the band has round corners of 3 px on the wall, the reading page, the pop-up, and the Quotations page, at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize(vp.size)

    await page.goto('./')
    await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
    await expectCorners(page.locator('.wall-band'), 'the wall', 10)

    await page.goto('./#/book/hebrews/9')
    const hebrews = page.locator('section.rd-chapter[data-book="hebrews"][data-chapter="9"]')
    await expect(hebrews).toHaveAttribute('data-loaded', 'true')
    await expectCorners(hebrews.locator('.rd-band'), 'the reading page', 1)

    const name = vp.size.width >= 1180 ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8'
    await page.getByRole('button', { name }).click()
    const dialog = page.getByRole('dialog', { name: 'Exodus 24:8' })
    await expect(dialog).toBeVisible()
    await expectCorners(dialog.locator('.pop-band'), 'the pop-up', 1)

    await page.goto('./#/quotations')
    if (vp.size.width < 900) await page.getByRole('combobox', { name: 'Select a book' }).selectOption('romans')
    else await page.getByRole('button', { name: 'Romans', exact: true }).click()
    await expect(page.locator('.q-list h2')).toHaveText('Romans')
    await expectCorners(page.locator('.q-band'), 'the Quotations page', 1)
  })
}
