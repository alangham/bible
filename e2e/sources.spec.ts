import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/** The WCAG rules of a11y.spec.ts: WCAG 2.0, 2.1, and 2.2, levels A and AA. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

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

  // docs/TASKS.md Task 17 step 11 and Task 41 step 14: the fonts section names Inrond and Lora, with their copyright lines and licences.
  test('the fonts section names Inrond and Lora with their copyright lines and licence files', async ({ page, request }) => {
    await page.goto('./#/sources')
    const fonts = page.locator('section[aria-labelledby="sources-fonts"]')
    await expect(fonts.getByRole('listitem')).toHaveCount(2)
    await expect(fonts.getByRole('listitem').first()).toHaveText(
      'Inrond (https://github.com/Hairline-UI/inrond), based on Inter. Copyright 2026 The Inrond Project Authors. Copyright (c) 2016 The Inter Project Authors (https://github.com/rsms/inter). The site uses a changed copy of Inrond: the roundness of the corners is set to 20 of 100, and the files have only the Latin characters. Under the SIL Open Font License, Version 1.1.',
    )
    await expect(fonts).toContainText('Lora. Copyright 2011 The Lora Project Authors (https://github.com/cyrealtype/Lora-Cyrillic), with Reserved Font Name "Lora".')
    await expect(fonts).not.toContainText('Cormorant')
    await expect(fonts).not.toContainText('Newsreader')
    await expect(fonts.getByRole('link')).toHaveText(['SIL Open Font License, Version 1.1', 'SIL Open Font License, Version 1.1'])
    const hrefs = await fonts.getByRole('link').evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href))
    expect(hrefs.map((h) => h.split('/').pop())).toEqual(['OFL-inrond.txt', 'OFL-lora.txt'])
    for (const href of hrefs) {
      const response = await request.get(href)
      expect(response.status()).toBe(200)
      expect(await response.text()).toContain('SIL OPEN FONT LICENSE Version 1.1')
    }
  })

  // docs/TASKS.md Task 37 step 8: the credit of the map data, before the fonts, with the axe check.
  for (const layout of [
    { name: 'wide', viewport: { width: 1440, height: 900 } },
    { name: 'narrow', viewport: { width: 390, height: 844 } },
  ]) {
    test(`the section "Places" credits the map data, before the fonts, ${layout.name} layout`, async ({ page }) => {
      await page.setViewportSize(layout.viewport)
      await page.goto('./#/sources')
      const places = page.locator('section[aria-labelledby="sources-places"]')
      await expect(places.getByRole('heading', { level: 2 })).toHaveText('Places')
      await expect(places.locator('h2')).toHaveAttribute('id', 'sources-places')
      const ids = await page.locator('main section h2').evaluateAll((els) => els.map((e) => e.id))
      expect(ids.indexOf('sources-places')).toBe(ids.indexOf('sources-fonts') - 1)

      const paragraphs = places.locator('p')
      await expect(paragraphs).toHaveCount(4)
      // Task 40 step 3: the first sentence of the section.
      await expect(paragraphs.nth(0)).toHaveText('Each book with places has a map of them. The link is in “About this book”.')
      await expect(paragraphs.nth(1)).toHaveText(
        'The places that each book names, the verses that name them, and their positions come from the Bible Geocoding Data of OpenBible.info, with a Creative Commons Attribution 4.0 licence. The site changed the data: it keeps one position for each place, and it leaves out the places that are inside a city and the places with the name East, North, or South.',
      )
      await expect(paragraphs.nth(2)).toHaveText('Some positions in that data come from OpenStreetMap. © OpenStreetMap contributors. That data has the Open Database License.')
      await expect(paragraphs.nth(3)).toHaveText('The coast, the rivers, and the lakes come from Natural Earth, which is in the public domain.')

      const links = await places.getByRole('link').evaluateAll((els) => els.map((e) => [e.textContent, (e as HTMLAnchorElement).getAttribute('href')]))
      expect(links).toEqual([
        ['Bible Geocoding Data of OpenBible.info', 'https://www.openbible.info/geo/'],
        ['Creative Commons Attribution 4.0 licence', 'https://creativecommons.org/licenses/by/4.0/'],
        ['© OpenStreetMap contributors', 'https://www.openstreetmap.org/copyright'],
        ['Natural Earth', 'https://www.naturalearthdata.com/'],
      ])

      await page.waitForLoadState('networkidle')
      await page.evaluate(() => document.fonts.ready)
      const result = await new AxeBuilder({ page }).include('section[aria-labelledby="sources-places"]').withTags(AXE_TAGS).analyze()
      expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
    })
  }
})
