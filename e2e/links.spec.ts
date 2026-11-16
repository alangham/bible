/// <reference lib="dom" />
// Links on the reading page. docs/DESIGN.md section 7.7, docs/TASKS.md Task 14 step 13.
// The axe-core checks with the pop-up closed and open are in a11y.spec.ts.

import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }
const LAW = 'rgb(194, 37, 92)'

interface End {
  book: string
  c: number
  v: number
  heading?: string
}
const hebrews = JSON.parse(readFileSync(new URL('../public/data/links/hebrews.json', import.meta.url), 'utf8')) as { links: { id: string; type: string; a: End; b: End }[] }

/** The text of one verse in the bundled Berean Standard Bible: its strings and its marked words (Task 26). */
function verseText(book: string, c: number, v: number): string {
  const text = JSON.parse(readFileSync(new URL(`../public/data/text/${book}.json`, import.meta.url), 'utf8')) as {
    chapters: { blocks: { k: string; c?: (string | { v?: number; j?: string })[] }[] }[]
  }
  let verse = 0
  let out = ''
  for (const block of text.chapters[c - 1].blocks) {
    if (block.k !== 'p') continue
    for (const item of block.c ?? []) {
      if (typeof item === 'string') {
        if (verse === v) out += item
      } else if (item.v !== undefined) verse = item.v
      else if (item.j !== undefined && verse === v) out += item.j
    }
  }
  return out.replace(/\s+/g, ' ').trim()
}

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)

async function openChapter(page: Page, viewport: { width: number; height: number }, path: string) {
  await page.setViewportSize(viewport)
  await page.goto(`./#/book/${path}`)
  const [book, n] = path.split('/')
  await expect(chapter(page, book, Number(n))).toHaveAttribute('data-loaded', 'true')
  await page.evaluate(() => document.fonts.ready)
}

/** The ends of links at a verse of Hebrews 9, as the data has them. */
const hebrews9Ends = hebrews.links.flatMap((l) => [l.a, l.b].filter((e) => e.book === 'hebrews' && e.c === 9 && !e.heading).map(() => l))

test.describe('links on the reading page', () => {
  test('Hebrews 9 has one mark in the text for each link at a verse, at 390 by 844 px', async ({ page }) => {
    expect(hebrews9Ends.length).toBeGreaterThan(0)
    // The test counts ends. No link has both ends at verses of Hebrews 9, so the count of ends is the count of links.
    expect(new Set(hebrews9Ends.map((l) => l.id)).size).toBe(hebrews9Ends.length)
    await openChapter(page, NARROW, 'hebrews/9')
    const hebrews9 = chapter(page, 'hebrews', 9)
    await expect(hebrews9.locator('.chapter-body .link-mark')).toHaveCount(hebrews9Ends.length)
    await expect(hebrews9.locator('.rd-label')).toHaveCount(0)
    // Each mark is 24 by 24 px or more, and stays on the line of its verse number.
    for (const mark of await hebrews9.locator('.link-mark').all()) {
      const box = (await mark.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(24)
      expect(box.height).toBeGreaterThanOrEqual(24)
      const sameLine = await mark.evaluate((m) => {
        const number = m.parentElement!.querySelector('.vn')!.getBoundingClientRect()
        const r = m.getBoundingClientRect()
        return Math.abs(r.top + r.height / 2 - (number.top + number.height / 2)) < 20
      })
      expect(sameLine).toBe(true)
    }
    // A quotation link is a solid dot, in the color of the group that it goes to.
    const toExodus = hebrews9.getByRole('button', { name: 'Quotation link to Exodus 24:8' })
    await expect(toExodus).toHaveAttribute('data-kind', 'quotation')
    expect(await toExodus.evaluate((m) => getComputedStyle(m, '::before').backgroundColor)).toBe(LAW)
  })

  test('at 1440 by 900 px, the text has no marks and the margin has one label for each link at a verse', async ({ page }) => {
    await openChapter(page, WIDE, 'hebrews/9')
    const hebrews9 = chapter(page, 'hebrews', 9)
    await expect(hebrews9.locator('.chapter-body .link-mark')).toHaveCount(0)
    const labels = hebrews9.locator('.rd-label')
    await expect(labels).toHaveCount(hebrews9Ends.length)
    await expect(hebrews9).toHaveAttribute('data-labels-ready', 'true')
    const boxes = await labels.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ top: r.top, bottom: r.bottom, height: r.height, right: r.right })))
    for (const [i, b] of boxes.entries()) {
      expect(b.height).toBeGreaterThanOrEqual(24)
      expect(b.right).toBeLessThanOrEqual(1440)
      // Where two labels meet, the lower label moves down: no two labels cover each other.
      if (i > 0) expect(b.top).toBeGreaterThanOrEqual(boxes[i - 1].bottom - 0.5)
    }
    // The label of a link is on the line of its verse number.
    const label = hebrews9.getByRole('button', { name: 'Verse 20 has a quotation link to Exodus 24:8' })
    const top = (await label.boundingBox())!.y
    const verse = (await hebrews9.locator('.vn[data-verse="20"]').boundingBox())!.y
    expect(Math.abs(top - verse)).toBeLessThan(12)
    await expect(label).toHaveCSS('color', LAW)
    // Each label follows its verse number in the text, so the focus order is the order of the text.
    const order = await hebrews9.evaluate((s) => [...s.querySelectorAll('.chapter-body .vn[data-verse], .rd-label')].map((e) => e.getAttribute('data-link') ?? 'V' + e.getAttribute('data-verse')))
    const at = (await label.getAttribute('data-link'))!
    expect(order.indexOf(at)).toBe(order.indexOf('V20') + 1)
    expect(order.indexOf('V21')).toBeGreaterThan(order.indexOf(at))
    const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, screen: window.innerWidth }))
    expect(widths.page).toBeLessThanOrEqual(widths.screen)
  })

  test('the quotation link at Hebrews 9:20 opens a pop-up with Exodus 24:8 and its text', async ({ page }) => {
    await openChapter(page, WIDE, 'hebrews/9')
    const control = chapter(page, 'hebrews', 9).getByRole('button', { name: 'Verse 20 has a quotation link to Exodus 24:8' })
    await control.click()
    const popup = page.getByRole('dialog', { name: 'Exodus 24:8' })
    await expect(popup).toBeVisible()
    await expect(popup.locator('.pop-band')).toHaveText('Law')
    await expect(popup.locator('.pop-kind')).toHaveText('Quotation link from Hebrews 9:20')
    await expect(popup.locator('.pop-text')).toContainText(verseText('exodus', 24, 8))
    await expect(popup.locator('.pop-reason')).not.toBeEmpty()
    await expect(popup.locator('.pop-source')).toHaveText('From the Bible Quotation Database.')
    await expect(popup.getByRole('link', { name: 'Go there' })).toBeFocused()
    // In the wide layout, the pop-up opens near the control.
    const p = (await popup.boundingBox())!
    const c = (await control.boundingBox())!
    expect(Math.min(Math.abs(p.y - (c.y + c.height)), Math.abs(p.y + p.height - c.y))).toBeLessThan(20)
    // Escape closes the pop-up, and the focus goes back to the control.
    await page.keyboard.press('Escape')
    await expect(popup).toBeHidden()
    await expect(control).toBeFocused()
  })

  test('in the narrow layout, the pop-up opens from the bottom of the screen, and "Stay here" closes it', async ({ page }) => {
    await openChapter(page, NARROW, 'hebrews/9')
    await chapter(page, 'hebrews', 9).getByRole('button', { name: 'Quotation link to Exodus 24:8' }).click()
    const popup = page.getByRole('dialog', { name: 'Exodus 24:8' })
    await expect(popup).toBeVisible()
    const box = (await popup.boundingBox())!
    expect(Math.round(box.y + box.height)).toBe(844)
    expect(Math.round(box.width)).toBe(390)
    // The pop-up covers the page, so the Tab key keeps the focus in the pop-up.
    await expect(popup).toHaveAttribute('aria-modal', 'true')
    await expect(popup.getByRole('link', { name: 'Go there' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(popup.getByRole('button', { name: 'Stay here' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(popup.getByRole('link', { name: 'Go there' })).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(popup.getByRole('button', { name: 'Stay here' })).toBeFocused()
    await popup.getByRole('button', { name: 'Stay here' }).click()
    await expect(popup).toBeHidden()
    await expect(page).toHaveURL(/#\/book\/hebrews\/9$/)
  })

  test('"Go there" opens Exodus 24:8, the trail has the two stops, and "Back" opens Hebrews 9 at verse 20 and removes the last stop', async ({ page }) => {
    await openChapter(page, WIDE, 'hebrews/9')
    await chapter(page, 'hebrews', 9).getByRole('button', { name: 'Verse 20 has a quotation link to Exodus 24:8' }).click()
    await page.getByRole('dialog', { name: 'Exodus 24:8' }).getByRole('link', { name: 'Go there' }).click()
    await expect(page).toHaveURL(/#\/book\/exodus\/24\/8$/)
    const exodus24 = chapter(page, 'exodus', 24)
    await expect(exodus24).toHaveAttribute('data-loaded', 'true')

    const trail = page.getByRole('navigation', { name: 'Trail' })
    const stops = trail.getByRole('list').getByRole('link')
    await expect(stops).toHaveText(['Hebrews 9:20', 'Exodus 24:8'])
    await expect(stops.nth(1)).toHaveAttribute('aria-current', 'location')
    await expect(stops.nth(0)).toHaveCSS('color', 'rgb(75, 46, 87)')
    await expect(stops.nth(1)).toHaveCSS('color', LAW)

    // The paragraph of the linked verse is in view below the bars, with a light background.
    const paragraph = exodus24.locator('.vn[data-verse="8"]').locator('xpath=ancestor::p[1]')
    await expect(paragraph).toHaveClass(/rd-hit/)
    const top = (await paragraph.boundingBox())!.y
    expect(top).toBeGreaterThanOrEqual(92)
    expect(top).toBeLessThan(900 / 2)
    await expect(paragraph).not.toHaveClass(/rd-hit/, { timeout: 6000 })

    await trail.getByRole('link', { name: 'Back to Hebrews 9:20' }).click()
    await expect(page).toHaveURL(/#\/book\/hebrews\/9\/20$/)
    await expect(chapter(page, 'hebrews', 9)).toHaveAttribute('data-loaded', 'true')
    await expect(chapter(page, 'hebrews', 9).locator('.vn[data-verse="20"]')).toBeInViewport()
    // "Back" removed the last stop. The trail has one stop, and no "Back". docs/TASKS.md Task 23.
    await expect(stops).toHaveText(['Hebrews 9:20'])
    await expect(stops.nth(0)).toHaveAttribute('aria-current', 'location')
    await expect(trail.getByRole('link', { name: /^Back/ })).toHaveCount(0)
  })

  test('a read-with entry opens its chapter and adds a stop to the trail', async ({ page }) => {
    await openChapter(page, WIDE, 'hebrews/9')
    const readWith = chapter(page, 'hebrews', 9).getByRole('navigation', { name: 'Read with' })
    await expect(readWith).toContainText('From OpenBible.info')
    const first = readWith.getByRole('link').first()
    const name = (await first.textContent())!
    const href = (await first.getAttribute('href'))!
    await first.click()
    await expect(page).toHaveURL(new RegExp(`${href.replace(/\//g, '\\/')}$`))
    await expect(page.getByRole('navigation', { name: 'Trail' }).getByRole('list').getByRole('link')).toHaveText(['Hebrews 9', name])
  })

  test('with the echo links off, no echo link control is visible, and the setting stays after a reload', async ({ page }) => {
    for (const viewport of [NARROW, WIDE]) {
      // In the narrow layout, the echo links switch is in the menu panel. docs/DESIGN.md section 9.6.
      const openMenu = async () => {
        if (viewport === NARROW) await page.getByRole('button', { name: 'Menu', exact: true }).click()
      }
      await openChapter(page, viewport, 'hebrews/9')
      await openMenu()
      const echo = page.getByRole('button', { name: 'Echo links' })
      await expect(echo).toHaveAttribute('aria-pressed', 'true')
      const echoControls = page.locator('[data-kind="echo"]:visible')
      expect(await echoControls.count()).toBeGreaterThan(0)
      await echo.click()
      await expect(echo).toHaveAttribute('aria-pressed', 'false')
      await expect(echoControls).toHaveCount(0)
      await expect(page.locator('[data-kind="quotation"]:visible').first()).toBeVisible()
      await page.reload()
      await expect(chapter(page, 'hebrews', 9)).toHaveAttribute('data-loaded', 'true')
      await openMenu()
      await expect(page.getByRole('button', { name: 'Echo links' })).toHaveAttribute('aria-pressed', 'false')
      await expect(echoControls).toHaveCount(0)
      await page.getByRole('button', { name: 'Echo links' }).click()
    }
  })

  test('the cross-reference line below a section heading is the line of the publisher, with a control for each linked passage', async ({ page }) => {
    const headingEnds = hebrews.links.flatMap((l) => [l.a, l.b].filter((e) => e.book === 'hebrews' && e.c === 9 && e.heading))
    await openChapter(page, WIDE, 'hebrews/9')
    const hebrews9 = chapter(page, 'hebrews', 9)
    const controls = hebrews9.locator('.link-line .link-ref')
    await expect(controls).toHaveCount(headingEnds.length)
    const line = hebrews9.locator('.link-line').first()
    await expect(line).toHaveText('(Exodus 40:1–33; Acts 7:44–47)')
    await expect(line.getByRole('button')).toHaveText(['Exodus 40:1–33', 'Acts 7:44–47'])
    // The pop-up gives the reference as the line gives it.
    await line.getByRole('button', { name: 'Exodus 40:1–33' }).click()
    const popup = page.getByRole('dialog', { name: 'Exodus 40:1–33' })
    await expect(popup).toBeVisible()
    await expect(popup.locator('.pop-ref')).toHaveText('Exodus 40:1–33')
    // The text is every verse of the passage that the line names.
    await expect(popup.locator('.pop-text .pop-vn')).toHaveCount(33)
    await expect(popup.locator('.pop-text')).toContainText(verseText('exodus', 40, 33))
    await expect(popup.locator('.pop-first')).toHaveCount(0)
    await expect(popup.locator('.pop-kind')).toHaveText(/^Echo link from Hebrews 9:\d+(-\d+)?$/)
    await expect(popup.getByRole('link', { name: 'Go there' })).toHaveAttribute('href', '#/book/exodus/40/1')
    // With the echo links off, the line stays, and its references are plain text.
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Echo links' }).click()
    await expect(line).toHaveText('(Exodus 40:1–33; Acts 7:44–47)')
    await expect(line.getByRole('button')).toHaveCount(0)
    await page.getByRole('button', { name: 'Echo links' }).click()
  })

  test('the pop-up of Psalm 78:1–72 at 390 by 844 px shows the 72 verses in a text area that scrolls', async ({ page }) => {
    await openChapter(page, NARROW, 'matthew/13')
    await chapter(page, 'matthew', 13).getByRole('button', { name: 'Psalm 78:1–72' }).click()
    const popup = page.getByRole('dialog', { name: 'Psalm 78:1–72' })
    await expect(popup).toBeVisible()
    const area = popup.getByRole('region', { name: 'Text of Psalm 78:1–72' })
    await expect(area.locator('.pop-vn')).toHaveCount(72)
    await expect(area).toContainText(verseText('psalms', 78, 72))
    // The text area keeps its maximum height, and the passage scrolls inside it.
    const size = await area.evaluate((e) => ({ client: e.clientHeight, scroll: e.scrollHeight, max: getComputedStyle(e).maxHeight }))
    expect(size.client).toBeLessThanOrEqual(Math.ceil(844 * 0.36))
    expect(size.scroll).toBeGreaterThan(size.client)
    const box = (await popup.boundingBox())!
    expect(box.y).toBeGreaterThanOrEqual(0)
    expect(Math.round(box.y + box.height)).toBe(844)
    // The keyboard can scroll the text area.
    await expect(area).toHaveAttribute('tabindex', '0')
    await area.focus()
    await page.keyboard.press('End')
    await expect.poll(() => area.evaluate((e) => e.scrollTop)).toBeGreaterThan(0)
  })

  test('the pop-up of a reference to whole chapters shows the first verse with the label "First verse"', async ({ page }) => {
    await openChapter(page, WIDE, 'hebrews/11')
    await chapter(page, 'hebrews', 11).getByRole('button', { name: 'Genesis 4–9' }).click()
    const popup = page.getByRole('dialog', { name: 'Genesis 4–9' })
    await expect(popup.locator('.pop-first')).toHaveText('First verse')
    await expect(popup.locator('.pop-text .pop-vn')).toHaveText(['1'])
    await expect(popup.locator('.pop-text')).toContainText(verseText('genesis', 4, 1))
  })

  test('a reference with no link in the line of the publisher is plain text', async ({ page }) => {
    await openChapter(page, WIDE, 'genesis/12')
    const line = chapter(page, 'genesis', 12).locator('.link-line').first()
    await expect(line).toContainText('Acts 7:1–8')
    await expect(line.getByRole('button', { name: 'Acts 7:1–8' })).toHaveCount(0)
  })
})

// The trail. docs/DESIGN.md section 7.7, item "Trail", docs/TASKS.md Task 23 step 9. The last stop is the
// current stop. A selected stop, and "Back", remove the stops after the stop that opens. The wall clears
// the trail. The Back control of the browser, a reload, and a page of the Reference section do not change it.
const TRAIL_KEY = 'bible-trail'
const trail = (page: Page) => page.getByRole('navigation', { name: 'Trail' })
const trailStops = (page: Page) => trail(page).getByRole('list').getByRole('link')
const storedTrail = (page: Page) => page.evaluate((key) => sessionStorage.getItem(key), TRAIL_KEY)

/** Selects a read-with entry of a chapter, and waits for its chapter. */
async function readWith(page: Page, from: [string, number], name: string, to: [string, number]) {
  await chapter(page, from[0], from[1]).getByRole('navigation', { name: 'Read with' }).getByRole('link', { name, exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`#/book/${to[0]}/${to[1]}$`))
  await expect(chapter(page, to[0], to[1])).toHaveAttribute('data-loaded', 'true')
}

/** Opens the link at a verse, then selects "Go there". The wide layout has margin labels, the narrow layout has marks. */
async function goThere(page: Page, viewport: { width: number }, from: [string, number], v: number, type: 'quotation' | 'echo', to: string) {
  const kind = type === 'quotation' ? 'a quotation link' : 'an echo link'
  const name = viewport.width >= 1180 ? `Verse ${v} has ${kind} to ${to}` : `${type === 'quotation' ? 'Quotation' : 'Echo'} link to ${to}`
  await chapter(page, from[0], from[1]).getByRole('button', { name, exact: true }).first().click()
  await page.getByRole('dialog', { name: to }).getByRole('link', { name: 'Go there' }).click()
}

/** Matthew 1, then the read-with entry "Luke 1": a trail of two stops. */
async function twoStops(page: Page, viewport: { width: number; height: number }) {
  await openChapter(page, viewport, 'matthew/1')
  await readWith(page, ['matthew', 1], 'Luke 1', ['luke', 1])
  await expect(trailStops(page)).toHaveText(['Matthew 1', 'Luke 1'])
}

for (const [name, viewport] of [
  ['1440 by 900 px', WIDE],
  ['390 by 844 px', NARROW],
] as const) {
  test.describe(`the trail, at ${name}`, () => {
    test('fault 1 and fault 2: the wall clears the trail, and a travel after it starts a new trail', async ({ page }) => {
      await twoStops(page, viewport)
      await trailStops(page).getByText('Matthew 1', { exact: true }).click()
      await expect(page).toHaveURL(/#\/book\/matthew\/1$/)
      await expect(trailStops(page)).toHaveText(['Matthew 1'])
      await page.getByRole('link', { name: 'Books', exact: true }).click()
      await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
      await expect.poll(() => storedTrail(page)).toBeNull()
      await page.getByRole('navigation', { name: 'Books' }).getByRole('link', { name: 'Romans', exact: true }).click()
      await expect(chapter(page, 'romans', 1)).toHaveAttribute('data-loaded', 'true')
      await expect(trail(page)).toHaveCount(0)

      // Fault 2.
      await goThere(page, viewport, ['romans', 1], 16, 'echo', 'Mark 8:38')
      await expect(page).toHaveURL(/#\/book\/mark\/8\/38$/)
      await expect(trailStops(page)).toHaveText(['Romans 1:16', 'Mark 8:38'])
      await expect(trailStops(page).nth(1)).toHaveAttribute('aria-current', 'location')
      await expect(trailStops(page).nth(0)).not.toHaveAttribute('aria-current', /.*/)
    })

    test('a selected stop removes the stops after it, and the last stop is the current stop', async ({ page }) => {
      await twoStops(page, viewport)
      await readWith(page, ['luke', 1], 'Jeremiah 32', ['jeremiah', 32])
      await expect(trailStops(page)).toHaveText(['Matthew 1', 'Luke 1', 'Jeremiah 32'])
      await expect(trailStops(page).nth(2)).toHaveAttribute('aria-current', 'location')

      await trailStops(page).nth(1).click()
      await expect(page).toHaveURL(/#\/book\/luke\/1$/)
      await expect(chapter(page, 'luke', 1).locator('.rd-heading')).toBeInViewport()
      await expect(trailStops(page)).toHaveText(['Matthew 1', 'Luke 1'])
      await expect(trailStops(page).nth(1)).toHaveAttribute('aria-current', 'location')
      await expect(trail(page).getByRole('link', { name: 'Back to Matthew 1' })).toHaveCount(1)

      await trailStops(page).nth(0).click()
      await expect(page).toHaveURL(/#\/book\/matthew\/1$/)
      await expect(trailStops(page)).toHaveText(['Matthew 1'])
      await expect(trailStops(page).nth(0)).toHaveAttribute('aria-current', 'location')
      await expect(trail(page).getByRole('link', { name: /^Back/ })).toHaveCount(0)
      await expect(trail(page)).toContainText('Trail')
      expect(JSON.parse((await storedTrail(page))!)).toEqual({ stops: [{ book: 'matthew', c: 1 }] })
    })

    test('the last stop opens its passage, and no stop is removed', async ({ page }) => {
      await twoStops(page, viewport)
      await page.evaluate(() => window.scrollBy(0, 600))
      await trailStops(page).nth(1).click()
      await expect(chapter(page, 'luke', 1).locator('.rd-heading')).toBeInViewport()
      await expect(trailStops(page)).toHaveText(['Matthew 1', 'Luke 1'])
    })

    test('"Back" opens the stop before at its verse, and the trail has one stop', async ({ page }) => {
      await openChapter(page, viewport, 'hebrews/9')
      await goThere(page, viewport, ['hebrews', 9], 20, 'quotation', 'Exodus 24:8')
      await expect(chapter(page, 'exodus', 24)).toHaveAttribute('data-loaded', 'true')
      await expect(trailStops(page)).toHaveText(['Hebrews 9:20', 'Exodus 24:8'])
      await trail(page).getByRole('link', { name: 'Back to Hebrews 9:20' }).click()
      await expect(page).toHaveURL(/#\/book\/hebrews\/9\/20$/)
      await expect(chapter(page, 'hebrews', 9)).toHaveAttribute('data-loaded', 'true')
      await expect(chapter(page, 'hebrews', 9).locator('.vn[data-verse="20"]')).toBeInViewport()
      await expect(trailStops(page)).toHaveText(['Hebrews 9:20'])
      await expect(trail(page).getByRole('link', { name: /^Back/ })).toHaveCount(0)
    })

    test('the Back control of the browser does not change the trail', async ({ page }) => {
      await twoStops(page, viewport)
      await page.goBack()
      await expect(page).toHaveURL(/#\/book\/matthew\/1$/)
      await expect(chapter(page, 'matthew', 1)).toHaveAttribute('data-loaded', 'true')
      await expect(trailStops(page)).toHaveText(['Matthew 1', 'Luke 1'])
      await expect(trailStops(page).nth(1)).toHaveAttribute('aria-current', 'location')
    })

    test('a reload does not change the trail', async ({ page }) => {
      await twoStops(page, viewport)
      await page.reload()
      await expect(chapter(page, 'luke', 1)).toHaveAttribute('data-loaded', 'true')
      await expect(trailStops(page)).toHaveText(['Matthew 1', 'Luke 1'])
      await expect(trailStops(page).nth(1)).toHaveAttribute('aria-current', 'location')
    })

    test('the Timeline page does not change the trail', async ({ page }) => {
      await twoStops(page, viewport)
      if (viewport === NARROW) {
        await page.getByRole('button', { name: 'Menu', exact: true }).click()
        await page.locator('#menu-panel').getByRole('link', { name: 'Timeline' }).click()
      } else {
        // The wide reading page has no link to the Reference section. docs/DESIGN.md section 9.6.
        await page.evaluate(() => (window.location.hash = '#/timeline'))
      }
      await expect(page.locator('header.ref-bar')).toBeVisible()
      expect(JSON.parse((await storedTrail(page))!).stops).toHaveLength(2)
      await page.goBack()
      await expect(chapter(page, 'luke', 1)).toHaveAttribute('data-loaded', 'true')
      await expect(trailStops(page)).toHaveText(['Matthew 1', 'Luke 1'])
    })

    test('the Back control of the browser to the wall clears the trail, and the Forward control shows no trail', async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto('./')
      await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
      await page.getByRole('navigation', { name: 'Books' }).getByRole('link', { name: 'Matthew', exact: true }).click()
      await expect(chapter(page, 'matthew', 1)).toHaveAttribute('data-loaded', 'true')
      await readWith(page, ['matthew', 1], 'Luke 1', ['luke', 1])
      await expect(trailStops(page)).toHaveText(['Matthew 1', 'Luke 1'])
      await page.goBack()
      await expect(chapter(page, 'matthew', 1)).toHaveAttribute('data-loaded', 'true')
      await expect(trailStops(page)).toHaveText(['Matthew 1', 'Luke 1'])
      await page.goBack()
      await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
      await expect.poll(() => storedTrail(page)).toBeNull()
      await page.goForward()
      await expect(chapter(page, 'matthew', 1)).toHaveAttribute('data-loaded', 'true')
      await expect(trail(page)).toHaveCount(0)
    })
  })
}
