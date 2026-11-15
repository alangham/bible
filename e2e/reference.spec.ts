/// <reference lib="dom" />
// The Reference section: the top bar, the quotation diagram, and the Sources page.
// docs/DESIGN.md section 7.8, docs/TASKS.md Task 15 step 11.
// The axe-core checks of the two pages at the two sizes are in a11y.spec.ts.

import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }

interface Pair {
  from: string
  to: string
  n: number
}
const pairs = JSON.parse(readFileSync(new URL('../public/data/quotation-pairs.json', import.meta.url), 'utf8')) as Pair[]
const books = JSON.parse(readFileSync(new URL('../public/data/books.json', import.meta.url), 'utf8')) as { id: string; name: string }[]
const nameOf = (id: string) => books.find((b) => b.id === id)!.name

async function openQuotations(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport)
  await page.goto('./#/quotations')
  await expect(page.locator('.q-layout')).toHaveAttribute('data-ready', 'true')
}

const diagram = (page: Page) => page.getByRole('group', { name: 'Diagram of the quotation links between books' })

/** The rows of a list as "Name n", from the data file. Most links first; the order of a tie is not tested. */
function rows(items: Pair[], key: 'from' | 'to') {
  return items.map((p) => `${nameOf(p[key])} ${p.n}`).sort()
}

test.describe('Reference section', () => {
  test('the three links in the bottom line of the wall open the three pages', async ({ page }) => {
    await page.setViewportSize(WIDE)
    for (const [name, hash, heading] of [
      ['Timeline', '#/timeline', /timeline/i],
      ['Quotations', '#/quotations', /quotations/i],
      ['Sources', '#/sources', /sources/i],
    ] as const) {
      await page.goto('./')
      const links = page.getByRole('navigation', { name: 'Reference' }).getByRole('link')
      await expect(links).toHaveText(['Timeline', 'Quotations', 'Sources'])
      await links.filter({ hasText: name }).click()
      await expect(page).toHaveURL(new RegExp(`${hash}$`))
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
    }
  })

  test('the top bar of a Reference page has "Books" and the three pages, and the current page has an underline', async ({ page }) => {
    for (const viewport of [WIDE, NARROW]) {
      await openQuotations(page, viewport)
      const bar = page.locator('.ref-bar')
      await expect(bar.getByRole('link')).toHaveText(['‹ Books', 'Timeline', 'Quotations', 'Sources'])
      const current = bar.getByRole('link', { name: 'Quotations' })
      await expect(current).toHaveAttribute('aria-current', 'page')
      await expect(current).toHaveCSS('border-bottom-color', 'rgb(29, 29, 31)')
      await expect(bar.getByRole('link', { name: 'Sources' })).not.toHaveAttribute('aria-current', 'page')
      const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, screen: window.innerWidth }))
      expect(widths.page).toBeLessThanOrEqual(widths.screen)
    }
    await page.locator('.ref-bar').getByRole('link', { name: 'Books' }).click()
    await expect(page).toHaveURL(/#\/$/)
  })

  test('the diagram has 66 book controls in Bible order, and one line for each pair of books', async ({ page }) => {
    await openQuotations(page, WIDE)
    const controls = diagram(page).getByRole('button')
    await expect(controls).toHaveCount(66)
    expect(await controls.evaluateAll((els) => els.map((e) => e.getAttribute('data-book')))).toEqual(books.map((b) => b.id))
    await expect(page.locator('.q-line')).toHaveCount(pairs.length)
    // Three steps of thickness: 1 or 2 links, 3 to 9 links, and 10 links or more.
    const widths = await page.locator('.q-line').evaluateAll((els) => els.map((e) => [Number(e.getAttribute('data-n')), Number(e.getAttribute('stroke-width'))]))
    const step = (n: number) => (n >= 10 ? 2 : n >= 3 ? 1 : 0)
    for (const [n, w] of widths) expect(w).toBe([1.1, 2.1, 3.6][step(n)])
    // Each name is in the color of its group.
    await expect(diagram(page).getByRole('button', { name: 'Genesis', exact: true }).locator('text')).toHaveAttribute('fill', '#C2255C')
  })

  test('with Romans selected, the list has the books and counts of quotation-pairs.json, and the other lines are dim', async ({ page }) => {
    await openQuotations(page, WIDE)
    const romans = diagram(page).getByRole('button', { name: 'Romans', exact: true })
    await romans.click()
    await expect(romans).toHaveAttribute('aria-pressed', 'true')
    const quotes = page.getByRole('list', { name: 'Books that Romans quotes' }).getByRole('listitem')
    const shown = (await quotes.evaluateAll((els) => els.map((li) => `${li.querySelector('button')!.textContent} ${li.querySelector('span')!.firstChild!.textContent}`))).sort()
    expect(shown).toEqual(rows(pairs.filter((p) => p.from === 'romans'), 'to'))
    const counts = (await quotes.evaluateAll((els) => els.map((li) => Number(li.querySelector('span')!.firstChild!.textContent))))
    expect(counts).toEqual([...counts].sort((a, b) => b - a))
    // No New Testament book quotes Romans in the data: the second list says "None.".
    expect(pairs.filter((p) => p.to === 'romans')).toHaveLength(0)
    await expect(page.locator('.q-list .q-none')).toHaveText('None.')
    // The lines of Romans are bright, and the other lines are dim.
    const on = await page.locator('.q-line[data-on="true"]').evaluateAll((els) => els.map((e) => `${e.getAttribute('data-from')}>${e.getAttribute('data-to')}`))
    expect(on.sort()).toEqual(pairs.filter((p) => p.from === 'romans' || p.to === 'romans').map((p) => `${p.from}>${p.to}`).sort())
    // Select it again to clear.
    await romans.click()
    await expect(romans).toHaveAttribute('aria-pressed', 'false')
    await expect(page.locator('.q-list')).toHaveCount(0)
    await expect(page.locator('.q-line[data-on="false"]')).toHaveCount(0)
  })

  test('the list of Isaiah has the books that quote it, a book in the list selects that book, and "Open" opens the book', async ({ page }) => {
    await openQuotations(page, WIDE)
    await diagram(page).getByRole('button', { name: 'Isaiah', exact: true }).focus()
    await page.keyboard.press('Enter')
    const quotedBy = page.getByRole('list', { name: 'Books that quote Isaiah' }).getByRole('listitem')
    const shown = (await quotedBy.evaluateAll((els) => els.map((li) => `${li.querySelector('button')!.textContent} ${li.querySelector('span')!.firstChild!.textContent}`))).sort()
    expect(shown).toEqual(rows(pairs.filter((p) => p.to === 'isaiah'), 'from'))
    await page.getByRole('list', { name: 'Books that quote Isaiah' }).getByRole('button', { name: 'Matthew' }).click()
    await expect(page.locator('.q-list h2')).toHaveText('Matthew')
    await expect(page.locator('.q-list h2')).toBeFocused()
    await expect(diagram(page).getByRole('button', { name: 'Matthew', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('link', { name: 'Open Matthew' }).click()
    // The reading page opens chapter 1 and puts it in the address.
    await expect(page).toHaveURL(/#\/book\/matthew(\/1)?$/)
  })

  test('in the narrow layout, the list control above the diagram selects a book', async ({ page }) => {
    await openQuotations(page, NARROW)
    const select = page.getByRole('combobox', { name: 'Select a book' })
    await expect(select).toBeVisible()
    const box = (await select.boundingBox())!
    expect(box.y).toBeLessThan((await diagram(page).boundingBox())!.y)
    await select.selectOption('hebrews')
    await expect(page.locator('.q-list h2')).toHaveText('Hebrews')
    await expect(diagram(page).getByRole('button', { name: 'Hebrews', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await select.selectOption('')
    await expect(page.locator('.q-list')).toHaveCount(0)
    // In the wide layout, the names are big enough, and there is no list control.
    await openQuotations(page, WIDE)
    await expect(page.getByRole('combobox', { name: 'Select a book' })).toHaveCount(0)
  })

  test('the line below the diagram names the source', async ({ page }) => {
    await openQuotations(page, WIDE)
    await expect(page.locator('.ref-foot')).toHaveText('From the Bible Quotation Database. A thicker line has more quotation links.')
  })

  test('the Sources page has the top bar, a column of 700 px at most, and the new sentence about the introductions', async ({ page }) => {
    for (const viewport of [WIDE, NARROW]) {
      await page.setViewportSize(viewport)
      await page.goto('./#/sources')
      await expect(page.locator('.ref-bar').getByRole('link', { name: 'Sources' })).toHaveAttribute('aria-current', 'page')
      await expect(page.getByRole('link', { name: 'Back to the table' })).toHaveCount(0)
      await expect(page.getByText('The introductions of the books use facts from these sources.')).toBeVisible()
      await expect(page.getByText('book covers')).toHaveCount(0)
      for (const section of await page.locator('.sources-page > section').all()) expect((await section.boundingBox())!.width).toBeLessThanOrEqual(700)
      await expect(page.getByRole('heading', { level: 2 }).first()).toHaveCSS('font-family', /Inter/)
    }
  })
})
