// The map page: the first view. docs/TASKS.md Task 38 step 6, docs/DESIGN.md sections 15.8, 15.10, and 15.11.

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/** The WCAG rules of a11y.spec.ts: WCAG 2.0, 2.1, and 2.2, levels A and AA. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

const LAYOUTS = [
  { name: 'wide', viewport: { width: 1440, height: 900 } },
  { name: 'narrow', viewport: { width: 390, height: 844 } },
]

/** Opens the map of a book and waits until the names are on the map. */
async function openMap(page: Page, id: string) {
  await page.goto(`./#/book/${id}/map`)
  await expect(page.locator('.map-svg[data-ready="true"]')).toBeVisible()
}

/** The names that show on the map. */
async function mapNames(page: Page): Promise<string[]> {
  return page.locator('.map-names text').allTextContents()
}

for (const layout of LAYOUTS) {
  test.describe(`map page, ${layout.name} layout`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(layout.viewport)
    })

    test('Acts: the region "Rome to Jerusalem", and the first view shows Jerusalem and Rome', async ({ page }) => {
      await openMap(page, 'acts')
      await expect(page).toHaveTitle('Places of Acts · Bible Wall')
      await expect(page.getByRole('heading', { level: 2, name: 'The places of this book' })).toBeVisible()
      await expect(page.locator('.map-region')).toHaveText('Map: Rome to Jerusalem')
      await expect(page.getByRole('img', { name: 'Map of the places of Acts, Rome to Jerusalem' })).toBeVisible()
      const names = await mapNames(page)
      expect(names).toContain('Jerusalem')
      expect(names).toContain('Rome')
      await expect(page.locator('.map-counts p').first()).toHaveText(/^Acts names 107 places\. \d+ are on this map\.$/)
      await expect(page.locator('.map-counts')).toContainText('2 places are inside a city, and the map does not show them: Beautiful Gate, Solomon’s Portico.')
    })

    test('Matthew: the first view shows Jerusalem', async ({ page }) => {
      await openMap(page, 'matthew')
      expect(await mapNames(page)).toContain('Jerusalem')
    })

    test('Proverbs: the sentence for one place, and the name Egypt with no dot', async ({ page }) => {
      await openMap(page, 'proverbs')
      await expect(page.locator('.map-counts p')).toHaveText(['Proverbs names 1 place. It is on this map.'])
      expect(await mapNames(page)).toEqual(['EGYPT'])
      await expect(page.locator('.map-dots > *')).toHaveCount(0)
    })

    test('Philemon: the bar and "Philemon names no place."', async ({ page }) => {
      await page.goto('./#/book/philemon/map')
      await expect(page.getByText('Philemon names no place.')).toBeVisible()
      await expect(page.locator('.map-svg')).toHaveCount(0)
      await expect(page.getByRole('link', { name: 'Philemon' })).toHaveAttribute('href', '#/book/philemon')
    })

    test('a book that the site does not have shows "Book not found"', async ({ page }) => {
      await page.goto('./#/book/tobit/map')
      await expect(page.getByRole('heading', { level: 1, name: 'Book not found' })).toBeVisible()
    })

    test('the control of the bar opens the book', async ({ page }) => {
      await openMap(page, 'acts')
      await page.locator('.map-bar').getByRole('link', { name: 'Acts' }).click()
      await expect(page).toHaveURL(/#\/book\/acts(\/1)?$/)
      await expect(page.locator('.rd-chapter[data-book="acts"]').first()).toBeVisible()
    })

    for (const id of ['acts', 'joshua']) {
      test(`${id}: no name touches a different name or a dot of a different place`, async ({ page }) => {
        await openMap(page, id)
        const problems = await page.evaluate(() => {
          const box = (e: Element) => e.getBoundingClientRect()
          const touch = (a: DOMRect, b: DOMRect) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
          const names = [...document.querySelectorAll('.map-names text')].map((e) => ({ i: e.getAttribute('data-place'), text: e.textContent, r: box(e) }))
          const dots = [...document.querySelectorAll('.map-dots > *')].map((e) => ({ i: e.getAttribute('data-place'), r: box(e) }))
          const out: string[] = []
          names.forEach((a, n) => {
            names.slice(n + 1).forEach((b) => touch(a.r, b.r) && out.push(`${a.text} touches ${b.text}`))
            dots.forEach((d) => d.i !== a.i && touch(a.r, d.r) && out.push(`${a.text} touches the dot of place ${d.i}`))
          })
          return out
        })
        expect(problems).toEqual([])
      })

      test(`${id}: the axe check`, async ({ page }) => {
        await openMap(page, id)
        const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
      })
    }

    test('the page opens at the top', async ({ page }) => {
      await page.goto('./#/book/genesis/1')
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.evaluate(() => (location.hash = '#/book/acts/map'))
      await expect(page.locator('.map-svg[data-ready="true"]')).toBeVisible()
      expect(await page.evaluate(() => window.scrollY)).toBe(0)
    })
  })
}

test('the narrow heights of the map: Joshua 520 px, Acts 300 px at 390 by 844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openMap(page, 'joshua')
  expect((await page.locator('.map-frame').boundingBox())?.height).toBe(520)
  await openMap(page, 'acts')
  expect((await page.locator('.map-frame').boundingBox())?.height).toBe(300)
})

test('no page has a link to the map page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const path of ['./', './#/book/acts/1', './#/sources', './#/timeline', './#/quotations']) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('a[href*="/map"]')).toHaveCount(0)
  }
  await page.goto('./#/book/acts/1')
  await page.getByRole('button', { name: 'About this book' }).first().click()
  await expect(page.locator('a[href*="/map"]')).toHaveCount(0)
})

// docs/TASKS.md Task 38b step 11: the four corrections, and the data with no name of a direction.
test.describe('map page, Task 38b', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('Matthew: the map has no name "EAST", and the page has no word "South"', async ({ page }) => {
    await openMap(page, 'matthew')
    expect(await mapNames(page)).not.toContain('EAST')
    await expect(page.locator('main')).not.toContainText('South')
    await expect(page.locator('.map-counts p').first()).toHaveText(/^Matthew names 36 places\./)
  })

  test('Matthew: the axe check', async ({ page }) => {
    await openMap(page, 'matthew')
    const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
    expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
  })

  test('Exodus: "Mount Sinai" is bold', async ({ page }) => {
    await openMap(page, 'exodus')
    const sinai = page.locator('.map-names text', { hasText: /^Mount Sinai$/ })
    await expect(sinai).toHaveAttribute('font-weight', '700')
  })

  test('Ezekiel: the number of the sentence is the number of the names shown plus N', async ({ page }) => {
    await openMap(page, 'ezekiel')
    const outside = await page.locator('.map-counts p', { hasText: 'outside this map' }).textContent()
    const m = /^(\d+) places are outside this map: (.*), and (\d+) more\.$/.exec(outside ?? '')
    expect(m, outside ?? '').not.toBeNull()
    expect(Number(m![1])).toBe(m![2].split(', ').length + Number(m![3]))
  })

  for (const [width, left, right] of [
    [1440, 80, 20],
    [1470, 80, 50],
    [1500, 80, 80],
    [1920, 290, 290],
  ]) {
    test(`the space at the left and at the right of the two columns at ${width} px: ${left} and ${right}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await openMap(page, 'acts')
      const space = await page.evaluate(() => {
        const W = document.documentElement.clientWidth
        return [document.querySelector('.map-head')!.getBoundingClientRect().left, W - document.querySelector('.map-holder')!.getBoundingClientRect().right]
      })
      expect(space).toEqual([left, right])
    })
  }
})
