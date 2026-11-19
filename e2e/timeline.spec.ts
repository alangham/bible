// The timeline page. docs/TASKS.md Task 17, docs/DESIGN.md section 7.8.
import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

interface DateRow {
  id: string
  kind: 'year' | 'range'
  from: number
  to: number
  estimate?: true
}

const books = JSON.parse(readFileSync(new URL('../public/data/books.json', import.meta.url), 'utf8')) as { id: string; name: string }[]
const dates = JSON.parse(readFileSync(new URL('../public/data/dates.json', import.meta.url), 'utf8')) as DateRow[]
const dateOf = new Map(dates.map((d) => [d.id, d]))
const estimates = dates.filter((d) => d.estimate).map((d) => d.id)
const nameOf = new Map(books.map((b) => [b.id, b.name]))

/**
 * The years with no books, computed here from dates.json and not by the code of the site:
 * from the last year of an Old Testament book to the first year of a New Testament book.
 * There is no year 0, so 1 BC is followed by AD 1. The page rounds down to tens of years.
 */
function expectedYearsBetween(): number {
  const lastOld = Math.max(...books.slice(0, 39).map((b) => dateOf.get(b.id)!.to))
  const firstNew = Math.min(...books.slice(39).map((b) => dateOf.get(b.id)!.from))
  const years = firstNew - lastOld - (lastOld < 0 && firstNew > 0 ? 1 : 0)
  return Math.floor(years / 10) * 10
}

async function open(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height })
  await page.goto('./#/timeline')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Timeline')
  await expect(page.locator('.tl-body[data-ready="true"]')).toBeAttached()
}

test.describe('timeline page', () => {
  test('the data has 17 estimates and the break of 370 years', () => {
    expect(estimates).toHaveLength(17)
    expect(expectedYearsBetween()).toBe(370)
  })

  test('wide layout: 66 book links on one line, and no group "Date not known"', async ({ page }) => {
    await open(page, 1440, 900)
    const links = page.locator('a.tl-link')
    await expect(links).toHaveCount(66)
    for (const b of books) {
      await expect(page.locator(`a.tl-link[data-book="${b.id}"]`)).toHaveAttribute('href', `#/book/${b.id}`)
    }
    await expect(page.getByText('Date not known')).toHaveCount(0)
    await expect(page.locator('.tl-axis')).toHaveCount(2)
  })

  test('wide layout: the estimate marks', async ({ page }) => {
    await open(page, 1440, 900)
    for (const b of books) {
      const est = estimates.includes(b.id)
      const link = page.locator(`a.tl-link[data-book="${b.id}"]`)
      await expect(link).toHaveAttribute('data-estimate', String(est))
      const label = await link.getAttribute('aria-label')
      expect(label?.startsWith(`${nameOf.get(b.id)}, `)).toBe(true)
      expect(label?.endsWith(', estimated date')).toBe(est)
      await expect(link.locator('.tl-name')).toHaveCSS('font-weight', est ? '500' : '800')
      await expect(link.locator('.tl-name')).toHaveCSS('text-transform', 'uppercase')

      const mark = page.locator(`g[data-book="${b.id}"]`)
      if (dateOf.get(b.id)!.kind === 'range') {
        const bar = mark.locator('.tl-bar')
        await expect(bar).toHaveAttribute('data-estimate', String(est))
        if (est) await expect(bar).toHaveCSS('stroke-dasharray', '5px, 4px')
        else await expect(bar).toHaveCSS('stroke-dasharray', 'none')
      } else {
        const dot = mark.locator('.tl-dot')
        await expect(dot).toHaveAttribute('data-estimate', String(est))
        await expect(dot).toHaveCSS('fill', est ? 'rgb(255, 255, 255)' : /^rgb\((?!255, 255, 255)/)
      }
    }
    await expect(page.locator('a.tl-link[data-book="job"]')).toHaveAttribute('aria-label', 'Job, by 600 BC, estimated date')
  })

  test('wide layout: the number of years in the break equals the number from the dates', async ({ page }) => {
    await open(page, 1440, 900)
    const n = expectedYearsBetween()
    await expect(page.locator('path.tl-break')).toHaveAttribute('data-years', String(n))
    await expect(page.locator('.tl-break-words')).toHaveText(`About ${n} years or more with no books`)
  })

  for (const width of [900, 1440]) {
    test(`wide layout at ${width} px: no name covers another, and no name is outside the window`, async ({ page }) => {
      await open(page, width, 900)
      // data-ready is true when the dates load. The names and the year labels draw later, when the fonts are ready,
      // so the test waits for the 66 names before it reads the boxes. Without this wait, the test read 0 names in the
      // full e2e run 2 of Task 45, and 1 time in 60 more runs at 900 px.
      await expect(page.locator('.tl-name')).toHaveCount(66)
      const boxes = await page.locator('.tl-name').evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect()
          return { name: e.textContent, left: r.left, right: r.right, top: r.top, bottom: r.bottom }
        }),
      )
      expect(boxes).toHaveLength(66)
      const covered: string[] = []
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i]
          const c = boxes[j]
          if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom) covered.push(`${a.name} / ${c.name}`)
        }
      expect(covered).toEqual([])
      for (const b of boxes) {
        expect(b.left).toBeGreaterThanOrEqual(0)
        expect(b.right).toBeLessThanOrEqual(width)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)

      // The year labels below the line, and the words of the break.
      const labels = await page.locator('.tl-tick-label, .tl-break-words').evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect()
          return { text: e.textContent, left: r.left, right: r.right, top: r.top, bottom: r.bottom }
        }),
      )
      const touching: string[] = []
      for (let i = 0; i < labels.length; i++)
        for (let j = i + 1; j < labels.length; j++) {
          const a = labels[i]
          const c = labels[j]
          if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom) touching.push(`${a.text} / ${c.text}`)
        }
      expect(touching).toEqual([])
      for (const l of labels) expect(l.right).toBeLessThanOrEqual(width)
    })
  }

  test('wide layout: a book name opens the book', async ({ page }) => {
    await open(page, 1440, 900)
    await page.getByRole('link', { name: /^Hebrews,/ }).click()
    await expect(page).toHaveURL(/#\/book\/hebrews(\/1)?$/)
    await expect(page.locator('.rd-heading').first()).toHaveText('Hebrews 1')
  })

  test('narrow layout: a list in date order with the break as one row', async ({ page }) => {
    await open(page, 390, 844)
    await expect(page.locator('a.tl-link')).toHaveCount(0)
    await expect(page.locator('a.tl-row')).toHaveCount(66)
    await expect(page.getByRole('list', { name: 'Old Testament books in date order' }).locator('a.tl-row')).toHaveCount(39)
    await expect(page.getByRole('list', { name: 'New Testament books in date order' }).locator('a.tl-row')).toHaveCount(27)
    await expect(page.locator('.tl-break-row')).toHaveCount(1)
    await expect(page.locator('.tl-break-row')).toHaveText(`About ${expectedYearsBetween()} years or more with no books`)
    await expect(page.getByText('Date not known')).toHaveCount(0)
  })

  test('narrow layout: the estimate marks', async ({ page }) => {
    await open(page, 390, 844)
    for (const b of books) {
      const est = estimates.includes(b.id)
      const row = page.locator(`a.tl-row[data-book="${b.id}"]`)
      await expect(row).toHaveAttribute('href', `#/book/${b.id}`)
      await expect(row).toHaveAttribute('data-estimate', String(est))
      await expect(row.locator('.tl-row-name')).toHaveCSS('font-weight', est ? '500' : '800')
      const date = (await row.locator('.tl-row-date').innerText()).trim()
      expect(date.endsWith(', estimate')).toBe(est)
      if (est) await expect(row).toHaveAccessibleName(/estimated date/)
      else await expect(row).not.toHaveAccessibleName(/estimated date/)
    }
    await expect(page.locator('a.tl-row[data-book="job"] .tl-row-date')).toHaveText(/(^|, )by 600 BC, estimate$/)
  })

  test('narrow layout at 390 by 844: the page is not wider than the screen', async ({ page }) => {
    await open(page, 390, 844)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  })

  test('narrow layout: a book name opens the book', async ({ page }) => {
    await open(page, 390, 844)
    await page.locator('a.tl-row[data-book="romans"]').click()
    await expect(page).toHaveURL(/#\/book\/romans(\/1)?$/)
  })

  for (const [layout, width, height] of [
    ['wide', 1440, 900],
    ['narrow', 390, 844],
  ] as const) {
    test(`${layout} layout: the two lines below the timeline, and no arcs, no legend, no list of quoted books`, async ({ page }) => {
      await open(page, width, height)
      await expect(page.locator('.ref-foot p')).toHaveText([
        'A name in light letters has an estimated date.',
        'Scholars differ on many dates. "About this book" gives the detail.',
      ])
      await expect(page.locator('main button')).toHaveCount(0)
      await expect(page.locator('.tl-arc, .tl-panel, .legend')).toHaveCount(0)
    })
  }

  // The reading page gets no Timeline control: docs/DESIGN.md section 7.5.
  test('the wall has a Timeline control', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('link', { name: 'Timeline' }).click()
    await expect(page).toHaveURL(/#\/timeline$/)
  })
})
