/// <reference lib="dom" />
// The top bar of the wall and of the reading page, the translation list, and "Menu".
// docs/DESIGN.md section 9, docs/TASKS.md Task 22 step 14. The selection of the translation and the
// verse at the top of the page are in translation.spec.ts. The axe-core checks are in a11y.spec.ts.

import { readFileSync } from 'node:fs'
import { expect, test, type Locator, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }
const VIEWPORTS = [
  { name: '1440 by 900 px', size: WIDE },
  { name: '390 by 844 px', size: NARROW },
]
const BAR_PX = 52

const books = JSON.parse(readFileSync(new URL('../public/data/books.json', import.meta.url), 'utf8')) as { id: string; name: string; chapters: number }[]

type Rect = { top: number; bottom: number; left: number; right: number; width: number; height: number }

async function openWall(page: Page, size: { width: number; height: number }) {
  await page.setViewportSize(size)
  await page.goto('./')
  await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
  await page.evaluate(() => document.fonts.ready)
}

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)

async function openChapter(page: Page, size: { width: number; height: number }, book: string, n: number) {
  await page.setViewportSize(size)
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
  await page.evaluate(() => document.fonts.ready)
}

const menu = (page: Page) => page.getByRole('button', { name: 'Menu', exact: true })
const menuPanel = (page: Page) => page.locator('#menu-panel')
const translationControl = (page: Page) => page.getByRole('button', { name: /^Translation: / })
const translationList = (page: Page) => page.locator('#translation-list')
const where = (page: Page) => page.locator('header.rd-bar .rd-where')

async function rect(locator: Locator): Promise<Rect> {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect()
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height }
  })
}

/** The space between the bar and the top of the columns, and between the bottom of the columns and the bottom of the window. */
async function wallSpaces(page: Page) {
  return page.evaluate((bar) => {
    const columns = [...document.querySelectorAll('.wall-column')].map((c) => c.getBoundingClientRect())
    const top = Math.min(...columns.map((c) => c.top))
    const bottom = Math.max(...columns.map((c) => c.bottom))
    return { above: top - bar, below: window.innerHeight - bottom, height: bottom - top }
  }, BAR_PX)
}

/** Each control is 24 by 24 px or more. */
async function bigEnough(controls: Locator[]) {
  for (const c of controls) {
    const box = (await c.boundingBox())!
    expect(box.width, (await c.textContent()) ?? '').toBeGreaterThanOrEqual(24)
    expect(box.height, (await c.textContent()) ?? '').toBeGreaterThanOrEqual(24)
  }
}

test.describe('the top bar of the wall', () => {
  for (const vp of VIEWPORTS) {
    test(`the wall has no line at the bottom and no translation control, at ${vp.name}`, async ({ page }) => {
      await openWall(page, vp.size)
      await expect(page.locator('header.wall-bar')).toBeVisible()
      await expect(page.locator('.wall-foot, footer')).toHaveCount(0)
      await expect(page.getByRole('group', { name: 'Translation', includeHidden: true })).toHaveCount(0)
      await expect(page.getByRole('button', { name: /Translation|Berean|King James|World English/, includeHidden: true })).toHaveCount(0)
      await expect(page.getByText(/Berean Standard Bible|King James Version|World English Bible|BSB|KJV|\bWEB\b/)).toHaveCount(0)
    })
  }

  test('at 1440 by 900 px, the bar has the three links, and the bar and the 66 book names are in the window with no scroll', async ({ page }) => {
    await openWall(page, WIDE)
    const links = page.locator('header.wall-bar').getByRole('navigation', { name: 'Reference' }).getByRole('link')
    await expect(links).toHaveText(['Timeline', 'Quotations', 'Sources'])
    for (const link of await links.all()) await expect(link).not.toHaveAttribute('aria-current')
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(WIDE.height)
    const bar = await rect(page.locator('header.wall-bar'))
    expect(bar.top).toBe(0)
    expect(bar.height).toBe(BAR_PX)
    const names = page.getByRole('navigation', { name: 'Books' }).getByRole('link')
    await expect(names).toHaveCount(66)
    for (const name of await names.all()) await expect(name).toBeInViewport({ ratio: 1 })
    const s = await wallSpaces(page)
    expect(s.above).toBeGreaterThanOrEqual(24)
    expect(Math.abs(s.above - s.below)).toBeLessThanOrEqual(2)
  })

  test('at 1440 by 900 px, each link of the bar opens its page', async ({ page }) => {
    for (const [name, address] of [['Timeline', /#\/timeline$/], ['Quotations', /#\/quotations$/], ['Sources', /#\/sources$/]] as const) {
      await openWall(page, WIDE)
      await page.locator('header.wall-bar').getByRole('link', { name }).click()
      await expect(page).toHaveURL(address)
      await expect(page.locator('header.ref-bar')).toBeVisible()
    }
  })

  test('at 1920 by 1080 px, the space above the columns is equal to the space below them', async ({ page }) => {
    await openWall(page, { width: 1920, height: 1080 })
    const s = await wallSpaces(page)
    expect(s.above).toBeGreaterThanOrEqual(24)
    expect(Math.abs(s.above - s.below)).toBeLessThanOrEqual(2)
  })

  test('at 1440 by 700 px, the page scrolls, and the first band is 24 px below the bar', async ({ page }) => {
    await openWall(page, { width: 1440, height: 700 })
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeGreaterThan(700)
    const band = await rect(page.locator('.wall-band').first())
    expect(Math.abs(band.top - BAR_PX - 24)).toBeLessThanOrEqual(2)
  })

  test('at 390 by 844 px, "Menu" opens the menu panel with the three links, and Escape closes it', async ({ page }) => {
    await openWall(page, NARROW)
    await expect(page.locator('header.wall-bar').getByRole('link')).toHaveCount(0)
    await expect(menu(page)).toHaveAttribute('aria-expanded', 'false')
    await menu(page).click()
    await expect(menu(page)).toHaveAttribute('aria-expanded', 'true')
    const links = menuPanel(page).getByRole('navigation', { name: 'Reference' }).getByRole('link')
    await expect(links).toHaveText(['Timeline', 'Quotations', 'Sources'])
    await expect(links.first()).toBeFocused()
    await expect(page.locator('.bar-shade')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menuPanel(page)).toBeHidden()
    await expect(menu(page)).toBeFocused()
    await expect(menu(page)).toHaveAttribute('aria-expanded', 'false')
    // A tap on the shade closes the panel.
    await menu(page).click()
    await page.mouse.click(200, 700)
    await expect(menuPanel(page)).toBeHidden()
  })

  test('at 390 by 844 px, each link of the menu panel opens its page', async ({ page }) => {
    for (const [name, address] of [['Timeline', /#\/timeline$/], ['Quotations', /#\/quotations$/], ['Sources', /#\/sources$/]] as const) {
      await openWall(page, NARROW)
      await menu(page).click()
      await menuPanel(page).getByRole('link', { name }).click()
      await expect(page).toHaveURL(address)
      await expect(page.locator('header.ref-bar')).toBeVisible()
    }
  })

  test('at 390 by 844 px, the bar stays at the top of the window after a scroll of 900 px', async ({ page }) => {
    await openWall(page, NARROW)
    await page.mouse.move(200, 400)
    await page.mouse.wheel(0, 900)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(899)
    const bar = await rect(page.locator('header.wall-bar'))
    expect(bar.top).toBe(0)
    expect(bar.height).toBe(BAR_PX)
  })

  test('at 390 by 844 px, after "Books" on John, the book name JOHN on the wall is completely below the bar', async ({ page }) => {
    await openWall(page, NARROW)
    await page.getByRole('link', { name: 'John', exact: true }).click()
    await expect(chapter(page, 'john', 1)).toHaveAttribute('data-loaded', 'true')
    await page.locator('header.rd-bar').getByRole('link', { name: 'Books' }).click()
    await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
    await page.waitForTimeout(800)
    const john = await rect(page.getByRole('link', { name: 'John', exact: true }))
    expect(john.top).toBeGreaterThanOrEqual(BAR_PX)
    // The browser scrolls JOHN to the bottom of the window, to a part of a pixel.
    expect(john.bottom).toBeLessThanOrEqual(NARROW.height + 0.5)
  })

  test('at 390 by 844 px, the focus from the keyboard on a book name below the bar moves the name below the bar', async ({ page }) => {
    await openWall(page, NARROW)
    const john = page.getByRole('link', { name: 'John', exact: true })
    // JOHN is partly behind the bar. The focus is on the next name, Acts, and Shift+Tab goes back to JOHN.
    await john.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 30))
    await page.getByRole('link', { name: 'Acts', exact: true }).evaluate((el) => el.focus({ preventScroll: true }))
    expect((await rect(john)).top).toBeLessThan(BAR_PX)
    await page.keyboard.press('Shift+Tab')
    await expect(john).toBeFocused()
    expect((await rect(john)).top).toBeGreaterThanOrEqual(BAR_PX)
  })

  test('at 390 by 844 px, "Menu" and the rows of the menu panel are 24 by 24 px or more, and work with the keyboard', async ({ page }) => {
    await openWall(page, NARROW)
    await bigEnough([menu(page)])
    // The bar is first on the page: the first Tab goes to "Menu".
    await page.keyboard.press('Tab')
    await expect(menu(page)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(menuPanel(page)).toBeVisible()
    const links = await menuPanel(page).getByRole('link').all()
    await bigEnough(links)
    await expect(links[0]).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(links[1]).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#\/quotations$/)
  })

  test('at 1440 by 900 px, the links of the bar are 24 by 24 px or more, and work with the keyboard', async ({ page }) => {
    await openWall(page, WIDE)
    const links = await page.locator('header.wall-bar').getByRole('link').all()
    await bigEnough(links)
    // The bar is first on the page: Tab goes to its three links in order.
    for (const link of links) {
      await page.keyboard.press('Tab')
      await expect(link).toBeFocused()
    }
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#\/sources$/)
  })
})

test.describe('the top bar of the reading page', () => {
  for (const vp of VIEWPORTS) {
    test(`the panel of the chapter grid has no translation buttons, at ${vp.name}`, async ({ page }) => {
      await openChapter(page, vp.size, 'ruth', 1)
      await where(page).click()
      const panel = page.locator('.rd-grid-panel')
      await expect(panel).toBeVisible()
      await expect(panel.getByRole('group', { name: 'Translation' })).toHaveCount(0)
      await expect(panel.getByRole('button')).toHaveCount(0)
      await expect(panel.getByRole('link')).toHaveCount(4)
    })

    test(`the translation control: a caret that points up, and Escape and a second tap close the list, at ${vp.name}`, async ({ page }) => {
      await openChapter(page, vp.size, 'ruth', 1)
      const control = translationControl(page)
      await expect(control).toHaveAccessibleName('Translation: Berean Standard Bible, BSB')
      await expect(control).toHaveAttribute('aria-expanded', 'false')
      await bigEnough([control])
      const caret = control.locator('.rd-caret')
      expect(await caret.evaluate((el) => getComputedStyle(el).transform)).toBe('none')
      await control.click()
      await expect(control).toHaveAttribute('aria-expanded', 'true')
      await expect(translationList(page)).toBeVisible()
      await expect.poll(() => caret.evaluate((el) => getComputedStyle(el).transform)).toMatch(/^matrix\(-1, .*, -1, 0, 0\)$/)
      await page.keyboard.press('Escape')
      await expect(translationList(page)).toBeHidden()
      await expect(control).toBeFocused()
      await control.click()
      await expect(translationList(page)).toBeVisible()
      await control.click()
      await expect(translationList(page)).toBeHidden()
    })

    test(`the rows of the translation list are 24 by 24 px or more, and work with the keyboard, at ${vp.name}`, async ({ page }) => {
      await openChapter(page, vp.size, 'ruth', 1)
      const control = translationControl(page)
      // From the control of the chapter grid, Tab goes to the translation control.
      await where(page).focus()
      await page.keyboard.press('Tab')
      await expect(control).toBeFocused()
      await page.keyboard.press('Enter')
      const group = translationList(page).getByRole('group', { name: 'Translation' })
      const rows = await group.getByRole('button').all()
      expect(rows).toHaveLength(3)
      await bigEnough(rows)
      // Since Task 33, a row is as high as its content: the name, and the line of the translation below it. It is
      // 44 px or more in the wide layout, and 48 px or more in the narrow layout. docs/DESIGN.md section 14.3: a row
      // with a line of two lines of text is 74 px high. With the lines of Task 34, each of the three rows has a line of
      // two lines of text.
      const heights = await Promise.all(rows.map(async (row) => (await row.boundingBox())!.height))
      for (const h of heights) expect(h).toBeGreaterThanOrEqual(vp.size.width >= 900 ? 44 : 48)
      expect(heights).toEqual([74, 74, 74])
      await expect(rows[0]).toBeFocused()
      // The Tab key goes through the three rows and then the link "About the translations", and Shift+Tab goes back.
      // docs/TASKS.md Task 33 step 4.
      await page.keyboard.press('Tab')
      await expect(rows[1]).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(rows[2]).toBeFocused()
      await expect(rows[2]).toHaveAccessibleName('World English Bible Today’s English, in an informal, spoken style. A fairly literal translation.')
      await page.keyboard.press('Tab')
      await expect(translationList(page).getByRole('link', { name: 'About the translations' })).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(rows[2]).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(rows[1]).toBeFocused()
      await page.keyboard.press('Enter')
      await expect(translationList(page)).toBeHidden()
      await expect(control).toBeFocused()
      await expect(control).toHaveText('KJV')
      await expect(chapter(page, 'ruth', 1)).toHaveAttribute('data-translation', 'kjv')
      // The row of the selected translation has the check mark and the weight 600. The short name is not a second name.
      await page.keyboard.press('Enter')
      await expect(rows[1]).toBeFocused()
      await expect(rows[1]).toHaveAccessibleName('King James Version Older English, in the text of 1769: thee, thou, believeth.')
      await expect(rows[1].locator('.tr-check path')).toHaveCount(1)
      await expect(rows[0].locator('.tr-check path')).toHaveCount(0)
      await expect(rows[2].locator('.tr-check path')).toHaveCount(0)
      expect(await rows[1].evaluate((el) => getComputedStyle(el).fontWeight)).toBe('600')
      expect(await rows[0].evaluate((el) => getComputedStyle(el).fontWeight)).toBe('500')
      expect(await rows[2].evaluate((el) => getComputedStyle(el).fontWeight)).toBe('500')
      // The row of the translation that is already selected: the list closes, and nothing changes.
      await page.keyboard.press('Space')
      await expect(translationList(page)).toBeHidden()
      await expect(control).toBeFocused()
      await expect(control).toHaveText('KJV')
    })

    test(`when the chapter grid is open, the translation control closes it and opens the translation list, at ${vp.name}`, async ({ page }) => {
      await openChapter(page, vp.size, 'ruth', 1)
      await where(page).click()
      await expect(page.locator('.rd-grid-panel')).toBeVisible()
      await translationControl(page).click()
      await expect(page.locator('.rd-grid-panel')).toBeHidden()
      await expect(where(page)).toHaveAttribute('aria-expanded', 'false')
      await expect(translationList(page)).toBeVisible()
      await expect(translationList(page).getByRole('button', { name: 'Berean Standard Bible' })).toBeFocused()
      // And back: the control of the chapter grid closes the list.
      await where(page).click()
      await expect(translationList(page)).toBeHidden()
      await expect(page.locator('.rd-grid-panel')).toBeVisible()
    })

    test(`after travel with "Go there", the translation list starts below the trail, at ${vp.name}`, async ({ page }) => {
      await openChapter(page, vp.size, 'hebrews', 9)
      const name = vp.size.width >= 1180 ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8'
      await page.getByRole('button', { name }).click()
      await page.getByRole('dialog', { name: 'Exodus 24:8' }).getByRole('link', { name: 'Go there' }).click()
      const trail = page.getByRole('navigation', { name: 'Trail' })
      await expect(trail).toBeVisible()
      await expect(chapter(page, 'exodus', 24)).toHaveAttribute('data-loaded', 'true')
      await translationControl(page).click()
      await expect(translationList(page)).toBeVisible()
      const trailBottom = (await rect(page.locator('.rd-trail'))).bottom
      expect((await rect(translationList(page))).top).toBeGreaterThanOrEqual(trailBottom - 0.5)
      await expect(translationList(page).getByRole('button', { name: 'Berean Standard Bible' })).toBeInViewport({ ratio: 1 })
    })
  }

  test('at 1440 by 900 px, the translation list is 340 px wide, below the control, and completely in the window', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 3)
    await translationControl(page).click()
    const list = await rect(translationList(page))
    const control = await rect(translationControl(page))
    expect(list.width).toBe(340)
    expect(list.top).toBe(BAR_PX + 4)
    expect(Math.abs(list.left + list.width / 2 - (control.left + control.width / 2))).toBeLessThanOrEqual(1)
    expect(list.left).toBeGreaterThanOrEqual(12)
    expect(list.right).toBeLessThanOrEqual(WIDE.width - 12)
    expect(list.bottom).toBeLessThanOrEqual(WIDE.height)
    // The wide list has no shade, and a click outside the list closes it.
    await expect(page.locator('.rd-shade')).toHaveCount(0)
    await page.mouse.click(200, 600)
    await expect(translationList(page)).toBeHidden()
  })

  test('at 1440 by 900 px, the center of the bar is in the center of the window, and the bar has the echo links switch and no "Menu"', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 3)
    const center = await rect(page.locator('.rd-center'))
    expect(Math.abs(center.left + center.width / 2 - WIDE.width / 2)).toBeLessThanOrEqual(1)
    await expect(page.locator('header.rd-bar').getByRole('button', { name: 'Echo links' })).toBeVisible()
    await expect(menu(page)).toHaveCount(0)
    await expect(where(page)).toHaveText(/^John\s*Chapter 3$/)
    const rule = await rect(page.locator('.rd-bar-rule'))
    expect([rule.width, rule.height]).toEqual([1, 18])
  })

  for (const width of [390, 320]) {
    test(`at ${width} px wide, the bar of the last chapter of each of the 66 books is one line, and its controls are complete in the window`, async ({ page }) => {
      await openChapter(page, { width, height: 844 }, 'genesis', 50)
      for (const book of books) {
        await page.evaluate((hash) => (window.location.hash = hash), `#/book/${book.id}/${book.chapters}`)
        await expect(where(page).locator('b')).toHaveText(book.name)
        await expect(where(page).locator('.rd-where-n')).toHaveText(String(book.chapters))
        await expect(where(page)).toHaveAccessibleName(`${book.name} ${book.chapters}`)
        const r = await page.evaluate(() => {
          const box = (s: string) => {
            const b = document.querySelector(s)!.getBoundingClientRect()
            return { left: b.left, right: b.right, top: b.top, bottom: b.bottom }
          }
          const n = document.querySelector('.rd-where-n')!
          return {
            bar: document.querySelector('.rd-bar')!.getBoundingClientRect().height,
            scrollWidth: document.documentElement.scrollWidth,
            books: box('.rd-books'),
            n: box('.rd-where-n'),
            nCut: n.scrollWidth > n.clientWidth + 0.5,
            caret: box('.rd-where .rd-caret'),
            tr: box('.rd-tr'),
            menu: box('.bar-menu'),
          }
        })
        const label = `${book.name} ${book.chapters} at ${width} px`
        expect(r.bar, label).toBe(BAR_PX)
        expect(r.scrollWidth, label).toBeLessThanOrEqual(width)
        expect(r.nCut, label).toBe(false)
        for (const part of [r.books, r.n, r.caret, r.tr, r.menu]) {
          expect(part.left, label).toBeGreaterThanOrEqual(0)
          expect(part.right, label).toBeLessThanOrEqual(width)
          expect(part.top, label).toBeGreaterThanOrEqual(0)
          expect(part.bottom, label).toBeLessThanOrEqual(BAR_PX)
        }
        // The parts do not cover each other.
        expect(r.n.left, label).toBeGreaterThanOrEqual(r.books.right - 0.5)
        expect(r.caret.left, label).toBeGreaterThanOrEqual(r.n.right - 0.5)
        expect(r.tr.left, label).toBeGreaterThanOrEqual(r.caret.right - 0.5)
        expect(r.menu.left, label).toBeGreaterThanOrEqual(r.tr.right - 0.5)
      }
    })
  }

  test('at 390 px wide, "2 Thessalonians 3" and "Song of Solomon 8" show with no cut', async ({ page }) => {
    for (const [book, n] of [['2-thessalonians', 3], ['song-of-solomon', 8]] as const) {
      await openChapter(page, NARROW, book, n)
      const name = where(page).locator('b')
      expect(await name.evaluate((el) => el.scrollWidth <= el.clientWidth), `${book} ${n}`).toBe(true)
    }
  })

  // The World English Bible: the translation control shows "WEB". docs/DESIGN.md section 13.6, docs/TASKS.md Task 31 step 11.
  for (const width of [390, 375]) {
    test(`at ${width} px wide with "WEB", the bar of "2 Thessalonians 3" and "Song of Solomon 8" is one line, and only the book name can be cut`, async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('bible-translation', 'web'))
      for (const [book, n] of [
        ['2-thessalonians', 3],
        ['song-of-solomon', 8],
      ] as const) {
        await openChapter(page, { width, height: 844 }, book, n)
        await expect(chapter(page, book, n)).toHaveAttribute('data-translation', 'web')
        await expect(translationControl(page)).toHaveText('WEB')
        const label = `${book} ${n} at ${width} px`
        const r = await page.evaluate(() => {
          const box = (s: string) => {
            const el = document.querySelector(s)!
            const b = el.getBoundingClientRect()
            return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, cut: el.scrollWidth > el.clientWidth + 0.5 }
          }
          return {
            bar: document.querySelector('.rd-bar')!.getBoundingClientRect().height,
            scrollWidth: document.documentElement.scrollWidth,
            books: box('.rd-books'),
            name: box('.rd-where b'),
            n: box('.rd-where-n'),
            tr: box('.rd-tr'),
            menu: box('.bar-menu'),
            nameOverflow: getComputedStyle(document.querySelector('.rd-where b')!).textOverflow,
          }
        })
        expect(r.bar, label).toBe(BAR_PX)
        expect(r.scrollWidth, label).toBeLessThanOrEqual(width)
        for (const [part, b] of Object.entries({ books: r.books, n: r.n, tr: r.tr, menu: r.menu })) {
          expect(b.cut, `${label}: ${part}`).toBe(false)
          expect(b.left, `${label}: ${part}`).toBeGreaterThanOrEqual(0)
          expect(b.right, `${label}: ${part}`).toBeLessThanOrEqual(width)
          expect(b.top, `${label}: ${part}`).toBeGreaterThanOrEqual(0)
          expect(b.bottom, `${label}: ${part}`).toBeLessThanOrEqual(BAR_PX)
        }
        expect(r.n.left, label).toBeGreaterThanOrEqual(r.books.right - 0.5)
        expect(r.tr.left, label).toBeGreaterThanOrEqual(r.n.right - 0.5)
        expect(r.menu.left, label).toBeGreaterThanOrEqual(r.tr.right - 0.5)
        // At 390 px, the two names show with no cut. At 375 px, "Song of Solomon" can end with "…".
        if (width === 390 || book === '2-thessalonians') expect(r.name.cut, label).toBe(false)
        else if (r.name.cut) expect(r.nameOverflow, label).toBe('ellipsis')
      }
    })
  }

  test('at 320 px wide, the name "Song of Solomon" ends with "…"', async ({ page }) => {
    await openChapter(page, { width: 320, height: 844 }, 'song-of-solomon', 8)
    const name = where(page).locator('b')
    expect(await name.evaluate((el) => ({ cut: el.scrollWidth > el.clientWidth, overflow: getComputedStyle(el).textOverflow }))).toEqual({ cut: true, overflow: 'ellipsis' })
  })

  test('the control of the chapter grid shows "John 3" at 390 px and "John Chapter 3" at 1440 px, and its name for a screen reader is the same words', async ({ page }) => {
    await openChapter(page, NARROW, 'john', 3)
    await expect(where(page)).toHaveAccessibleName('John 3')
    // The control has no hidden word, and a space character is between its parts: its text is the text that it shows.
    expect(await where(page).evaluate((el) => el.textContent)).toBe('John 3')
    expect(await where(page).evaluate((el) => (el as HTMLElement).innerText.replace(/\s+/g, ' ').trim())).toBe('John 3')
    await page.setViewportSize(WIDE)
    await expect(where(page)).toHaveAccessibleName('John Chapter 3')
    expect(await where(page).evaluate((el) => el.textContent)).toBe('John Chapter 3')
    await page.setViewportSize(NARROW)
    await expect(page.locator('header.rd-bar').getByRole('button', { name: 'Echo links' })).toHaveCount(0)
  })

  test('at 390 px wide, "Menu" opens the menu panel: the echo links switch, a line, and the three links', async ({ page }) => {
    await openChapter(page, NARROW, 'hebrews', 9)
    // From the translation control, Tab goes to "Menu".
    await translationControl(page).focus()
    await page.keyboard.press('Tab')
    await expect(menu(page)).toBeFocused()
    await page.keyboard.press('Enter')
    const panel = menuPanel(page)
    await expect(panel).toBeVisible()
    const echo = panel.getByRole('button', { name: 'Echo links' })
    await expect(echo).toBeFocused()
    await expect(echo).toHaveAttribute('aria-pressed', 'true')
    await expect(echo.locator('.menu-state')).toHaveText('On')
    await expect(panel.locator('.menu-rule')).toBeVisible()
    await expect(panel.getByRole('navigation', { name: 'Reference' }).getByRole('link')).toHaveText(['Timeline', 'Quotations', 'Sources'])
    await expect(page.locator('[data-kind="echo"]:visible').first()).toBeAttached()
    await echo.click()
    await expect(echo).toHaveAttribute('aria-pressed', 'false')
    await expect(echo.locator('.menu-state')).toHaveText('Off')
    await expect(panel).toBeVisible()
    await expect(page.locator('[data-kind="echo"]:visible')).toHaveCount(0)
    // The keyboard: Space on the row changes the setting back.
    await echo.focus()
    await page.keyboard.press('Space')
    await expect(echo).toHaveAttribute('aria-pressed', 'true')
    await expect(panel).toBeVisible()
    await bigEnough([menu(page), echo, ...(await panel.getByRole('link').all())])
    await page.keyboard.press('Escape')
    await expect(panel).toBeHidden()
    await expect(menu(page)).toBeFocused()
  })

  test('at 390 px wide, each link of the menu panel on the reading page opens its page', async ({ page }) => {
    for (const [name, address] of [['Timeline', /#\/timeline$/], ['Quotations', /#\/quotations$/], ['Sources', /#\/sources$/]] as const) {
      await openChapter(page, NARROW, 'ruth', 1)
      await menu(page).click()
      await menuPanel(page).getByRole('link', { name }).click()
      await expect(page).toHaveURL(address)
      await expect(page.locator('header.ref-bar')).toBeVisible()
    }
  })

  test('at 390 px wide, when the chapter grid is open, "Menu" closes it and opens the menu panel', async ({ page }) => {
    await openChapter(page, NARROW, 'ruth', 1)
    await where(page).click()
    await expect(page.locator('.rd-grid-panel')).toBeVisible()
    await menu(page).click()
    await expect(page.locator('.rd-grid-panel')).toBeHidden()
    await expect(menuPanel(page)).toBeVisible()
    // And the translation control closes the menu panel.
    await translationControl(page).click()
    await expect(menuPanel(page)).toBeHidden()
    await expect(translationList(page)).toBeVisible()
    // A tap on the shade closes the list.
    await page.mouse.click(200, 700)
    await expect(translationList(page)).toBeHidden()
  })

  test('at 390 px wide, after travel with "Go there", the menu panel starts below the trail', async ({ page }) => {
    await openChapter(page, NARROW, 'hebrews', 9)
    await page.getByRole('button', { name: 'Quotation link to Exodus 24:8' }).click()
    await page.getByRole('dialog', { name: 'Exodus 24:8' }).getByRole('link', { name: 'Go there' }).click()
    await expect(page.getByRole('navigation', { name: 'Trail' })).toBeVisible()
    await expect(chapter(page, 'exodus', 24)).toHaveAttribute('data-loaded', 'true')
    await menu(page).click()
    await expect(menuPanel(page)).toBeVisible()
    const trailBottom = (await rect(page.locator('.rd-trail'))).bottom
    expect((await rect(menuPanel(page))).top).toBeGreaterThanOrEqual(trailBottom - 0.5)
    await expect(menuPanel(page).getByRole('button', { name: 'Echo links' })).toBeInViewport({ ratio: 1 })
  })
})

test.describe('a change of the layout', () => {
  test('closes the menu panel, so that it does not open again by itself, on the wall and on the reading page', async ({ page }) => {
    await openWall(page, NARROW)
    await menu(page).click()
    await expect(menuPanel(page)).toBeVisible()
    await page.setViewportSize(WIDE)
    await expect(page.locator('main.wall')).toHaveAttribute('data-layout', 'wide')
    await page.setViewportSize(NARROW)
    await expect(page.locator('main.wall')).toHaveAttribute('data-layout', 'narrow')
    await expect(menuPanel(page)).toBeHidden()
    await expect(menu(page)).toHaveAttribute('aria-expanded', 'false')

    await openChapter(page, NARROW, 'john', 3)
    await menu(page).click()
    await expect(menuPanel(page)).toBeVisible()
    await page.setViewportSize(WIDE)
    await expect(menu(page)).toHaveCount(0)
    await page.setViewportSize(NARROW)
    await expect(menu(page)).toHaveAttribute('aria-expanded', 'false')
    await expect(menuPanel(page)).toBeHidden()
  })
})
