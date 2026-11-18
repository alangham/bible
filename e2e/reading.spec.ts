/// <reference lib="dom" />
// The reading page. docs/DESIGN.md sections 7.5 and 7.6, docs/TASKS.md Task 13 step 15.
// The axe-core check of the reading page at the two sizes is in a11y.spec.ts.
// The test of the 31,086 verses is in src/data/text.test.ts.

import { expect, test, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }

/** One chapter on the reading page. */
const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)

/** Opens an address and waits until the text of its chapter is on the page. */
async function openChapter(page: Page, viewport: { width: number; height: number }, book: string, n: number, verse?: number) {
  await page.setViewportSize(viewport)
  await page.goto(`./#/book/${book}/${n}${verse ? `/${verse}` : ''}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
}

const where = (page: Page) => page.locator('header.rd-bar .rd-where')

test.describe('reading page', () => {
  test('a tap on John on the wall shows the text of John 1', async ({ page }) => {
    await page.setViewportSize(NARROW)
    await page.goto('./')
    await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
    await page.getByRole('link', { name: 'John', exact: true }).click()
    await expect(page).toHaveURL(/#\/book\/john\/1$/)
    const john1 = chapter(page, 'john', 1)
    await expect(john1.locator('.rd-heading')).toHaveText('John 1')
    await expect(john1.locator('.chapter-body')).toContainText('In the beginning was the Word, and the Word was with God, and the Word was God.')
    await expect(where(page)).toContainText('John')
  })

  test('at 1440 by 900 px, the text column is 700 px wide, in Lora at 21 px', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 1)
    const box = await chapter(page, 'john', 1).boundingBox()
    expect(box?.width).toBe(700)
    const font = await page.locator('.rd-column .tb').first().evaluate((e) => {
      const s = getComputedStyle(e)
      return { family: s.fontFamily, size: s.fontSize, lineHeight: s.lineHeight }
    })
    expect(font.family).toMatch(/^Lora/)
    expect(font.size).toBe('21px')
    expect(font.lineHeight).toBe('34.65px')
  })

  test('at 390 by 844 px, the text is Lora at 18 px, and the page is not wider than the screen', async ({ page }) => {
    for (const [book, n] of [['john', 1], ['psalms', 119], ['1-chronicles', 1], ['song-of-solomon', 1]] as const) {
      await openChapter(page, NARROW, book, n)
      await expect(page.locator('.rd-column .tb').first()).toHaveCSS('font-size', '18px')
      const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, screen: window.innerWidth }))
      expect(widths.page, `${book} ${n}`).toBeLessThanOrEqual(widths.screen)
      // A long book name fits the column.
      const heading = await chapter(page, book, n).locator('.rd-heading').evaluate((e) => ({ scroll: e.scrollWidth, client: e.clientWidth }))
      expect(heading.scroll, `${book} ${n}`).toBeLessThanOrEqual(heading.client)
    }
  })

  test('a scroll from John 21 goes into Acts 1, and the top bar and the address then show Acts', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 21)
    const entries = await page.evaluate(() => history.length)
    const acts1 = chapter(page, 'acts', 1)
    // The next chapter is added when the reader comes near the end of the text.
    for (let i = 0; i < 20 && (await acts1.count()) === 0; i++) await page.mouse.wheel(0, 1200)
    await expect(acts1).toHaveAttribute('data-loaded', 'true')
    // The first chapter of a new book has the full heading, with the band.
    await expect(acts1).toHaveAttribute('data-full', 'true')
    await expect(acts1.locator('.rd-band')).toHaveText('History')
    await acts1.evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 60))
    await expect(where(page)).toContainText('Acts')
    await expect(where(page)).toContainText('Chapter 1')
    await expect(page).toHaveURL(/#\/book\/acts\/1$/)
    // The scroll adds no entry to the browser history.
    expect(await page.evaluate(() => history.length)).toBe(entries)
  })

  test('a later chapter of the same book has a smaller heading and no band', async ({ page }) => {
    await openChapter(page, WIDE, 'ruth', 1)
    const ruth2 = chapter(page, 'ruth', 2)
    for (let i = 0; i < 10 && (await ruth2.count()) === 0; i++) await page.mouse.wheel(0, 1200)
    await expect(ruth2).toHaveAttribute('data-full', 'false')
    await expect(ruth2.locator('.rd-band')).toHaveCount(0)
    const size = (n: number) => chapter(page, 'ruth', n).locator('.rd-heading').evaluate((e) => parseFloat(getComputedStyle(e).fontSize))
    expect(await size(1)).toBe(76)
    expect(await size(2)).toBe(52)
  })

  test('the chapter grid opens John 20', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 1)
    await where(page).click()
    const grid = page.getByRole('navigation', { name: 'Chapters of John' })
    await expect(grid).toBeVisible()
    await expect(grid.getByRole('link')).toHaveCount(21)
    // The focus goes to the current chapter.
    await expect(grid.getByRole('link', { name: 'John chapter 1', exact: true })).toBeFocused()
    for (const box of await grid.getByRole('link').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(box).toBeGreaterThanOrEqual(44)
    await grid.getByRole('link', { name: 'John chapter 20', exact: true }).click()
    await expect(page).toHaveURL(/#\/book\/john\/20$/)
    await expect(grid).toBeHidden()
    await expect(chapter(page, 'john', 20)).toHaveAttribute('data-loaded', 'true')
    await expect(where(page)).toContainText('Chapter 20')
    await expect(page.locator('section.rd-chapter').first()).toHaveAttribute('data-chapter', '20')
  })

  test('Escape closes the chapter grid and gives the focus back', async ({ page }) => {
    await openChapter(page, NARROW, 'psalms', 23)
    await where(page).click()
    const grid = page.getByRole('navigation', { name: 'Chapters of Psalms' })
    await expect(grid.getByRole('link')).toHaveCount(150)
    await page.keyboard.press('Escape')
    await expect(grid).toBeHidden()
    await expect(where(page)).toBeFocused()
    await expect(where(page)).toHaveAttribute('aria-expanded', 'false')
  })

  test('"Books" goes to the wall, and "John" on the wall then opens the last-read chapter', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 20)
    await page.getByRole('link', { name: 'Books', exact: true }).click()
    await expect(page).toHaveURL(/#\/$/)
    await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
    await page.getByRole('link', { name: 'John', exact: true }).click()
    await expect(page).toHaveURL(/#\/book\/john\/20$/)
    await expect(chapter(page, 'john', 20).locator('.rd-heading')).toHaveText('John 20')
  })

  test('#/book/<id> opens chapter 1 of a book that the reader did not read, and replaces the address', async ({ page }) => {
    await page.goto('./#/book/ruth')
    await expect(page).toHaveURL(/#\/book\/ruth\/1$/)
    await expect(chapter(page, 'ruth', 1)).toHaveAttribute('data-loaded', 'true')
  })

  test('the page works when the storage of the browser is not available', async ({ page }) => {
    await page.addInitScript({
      content: `Object.defineProperty(window, 'localStorage', { get() { throw new Error('No storage') } })`,
    })
    await page.goto('./#/book/ruth')
    await expect(page).toHaveURL(/#\/book\/ruth\/1$/)
    await expect(chapter(page, 'ruth', 1)).toHaveAttribute('data-loaded', 'true')
  })

  test('an address with a verse opens the chapter at that verse', async ({ page }) => {
    await openChapter(page, NARROW, 'john', 3, 16)
    await expect(chapter(page, 'john', 3).locator('.vn[data-verse="16"]')).toBeInViewport()
  })

  test('a link above the first heading opens the chapter before it. Genesis 1 has none', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 1)
    const previous = page.locator('.rd-previous')
    await expect(previous).toHaveAttribute('href', '#/book/luke/24')
    await expect(previous).toHaveAccessibleName('Chapter before: Luke 24')
    await previous.click()
    await expect(chapter(page, 'luke', 24)).toHaveAttribute('data-loaded', 'true')
    await expect(page.locator('section.rd-chapter').first()).toHaveAttribute('data-book', 'luke')

    await openChapter(page, WIDE, 'genesis', 1)
    await expect(page.locator('.rd-previous')).toHaveCount(0)
  })

  test('after Revelation 22, the page shows "End of Revelation"', async ({ page }) => {
    await openChapter(page, WIDE, 'revelation', 22)
    await expect(page.locator('.rd-end')).toHaveText('End of Revelation')
    await expect(page.locator('section.rd-chapter')).toHaveCount(1)
  })

  test('the book name moves from the wall into the heading, and back, with the View Transitions function', async ({ page }) => {
    // Records each view transition: whether it ran, and which element has the name of the move
    // when the browser takes the picture of the new page.
    await page.addInitScript({
      content: `
        window.__moves = []
        const start = document.startViewTransition.bind(document)
        document.startViewTransition = (update) => {
          const move = { state: 'started', names: [] }
          window.__moves.push(move)
          const t = start(update)
          t.ready.then(
            () => { move.names = [...document.querySelectorAll('*')].filter((e) => e.style.viewTransitionName === 'book-name').map((e) => e.className) },
            () => { move.state = 'skipped' },
          )
          t.finished.then(() => { if (move.state !== 'skipped') move.state = 'finished' })
          return t
        }
      `,
    })
    await page.setViewportSize(WIDE)
    await page.goto('./')
    await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
    await page.getByRole('link', { name: 'John', exact: true }).click()
    await expect(chapter(page, 'john', 1)).toHaveAttribute('data-loaded', 'true')
    await expect.poll(() => page.evaluate(() => (window as unknown as { __moves: { state: string }[] }).__moves.map((m) => m.state))).toEqual(['finished'])
    let moves = await page.evaluate(() => (window as unknown as { __moves: { names: string[] }[] }).__moves)
    expect(moves[0].names).toEqual(['rd-name'])

    await page.getByRole('link', { name: 'Books', exact: true }).click()
    await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
    await expect.poll(() => page.evaluate(() => (window as unknown as { __moves: { state: string }[] }).__moves.map((m) => m.state))).toEqual(['finished', 'finished'])
    moves = await page.evaluate(() => (window as unknown as { __moves: { names: string[] }[] }).__moves)
    expect(moves[1].names).toEqual(['wall-name'])
    // After the move, no element keeps the name.
    expect(await page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => (e as HTMLElement).style.viewTransitionName).length)).toBe(0)
  })

  test('with reduced motion, the change from the wall to the reading page is direct', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.addInitScript({
      content: `
        window.__moves = 0
        const start = document.startViewTransition.bind(document)
        document.startViewTransition = (update) => { window.__moves++; return start(update) }
      `,
    })
    await page.goto('./')
    await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
    await page.getByRole('link', { name: 'John', exact: true }).click()
    await expect(chapter(page, 'john', 1)).toHaveAttribute('data-loaded', 'true')
    expect(await page.evaluate(() => (window as unknown as { __moves: number }).__moves)).toBe(0)
  })

  test('the verse numbers and the heading are in the color of the group', async ({ page }) => {
    await openChapter(page, WIDE, 'genesis', 1)
    const law = 'rgb(194, 37, 92)'
    const genesis1 = chapter(page, 'genesis', 1)
    await expect(genesis1.locator('.vn').first()).toHaveCSS('color', law)
    await expect(genesis1.locator('.rd-name')).toHaveCSS('color', law)
    await expect(genesis1.locator('.rd-number')).toHaveCSS('color', law)
    await expect(genesis1.locator('.rd-band')).toHaveCSS('background-color', law)
  })
})

// The tests of the book pages of the first build, moved to the reading page. Task 13 step 15.
test.describe('reading page: the introduction and the text', () => {
  test('Genesis: "About this book" opens the three facts, the line "Where", and the draft label', async ({ page }) => {
    await openChapter(page, WIDE, 'genesis', 1)
    const control = page.getByRole('button', { name: 'About this book' })
    const about = page.getByRole('region', { name: 'About this book' })
    await expect(about).toBeHidden()
    await control.click()
    await expect(control).toHaveAttribute('aria-expanded', 'true')
    // Task 40: a fourth line "Where", for a book with places. Task 42: the last line "Video", for each book.
    await expect(about.locator('dt')).toHaveText(['What it is', 'Author', 'Written', 'Where', 'Video'])
    for (const dd of await about.locator('.rd-fact-text').all()) await expect(dd).not.toBeEmpty()
    await expect(about.locator('.rd-draft')).toBeVisible()
    // Task 43: the top bar names the translation. The line of the control has the control only.
    await expect(page.getByRole('button', { name: /^Translation: / })).toHaveAccessibleName('Translation: Berean Standard Bible, BSB')
    await expect(page.locator('section.rd-chapter').first()).toHaveAttribute('data-translation', 'bsb')
  })

  test('Genesis gives the traditional author, and the control opens the detail in two parts', async ({ page }) => {
    await openChapter(page, WIDE, 'genesis', 1)
    await page.getByRole('button', { name: 'About this book' }).click()
    const author = page.locator('.rd-fact').filter({ has: page.locator('dt', { hasText: 'Author' }) })
    await expect(author.locator('.rd-fact-text')).toHaveText(/Moses/)
    await expect(author.locator('.rd-fact-text')).not.toHaveText(/scholar/i)

    const control = author.getByRole('button', { name: 'Scholars differ' })
    await expect(control).toHaveAttribute('aria-expanded', 'false')
    const detail = page.getByRole('region', { name: 'Author: scholars differ' })
    await expect(detail).toBeHidden()
    await control.focus()
    await page.keyboard.press('Enter')
    await expect(control).toHaveAttribute('aria-expanded', 'true')
    await expect(detail).toBeVisible()
    await expect(detail.getByRole('heading', { level: 3 })).toHaveText(['Critical scholars', 'Conservative scholars'])
    await expect(detail.locator('.rd-scholars-part p')).toHaveCount(2)
  })

  test('Romans has no Scholars differ control', async ({ page }) => {
    await openChapter(page, WIDE, 'romans', 1)
    await page.getByRole('button', { name: 'About this book' }).click()
    await expect(page.locator('.rd-fact-text').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Scholars differ' })).toHaveCount(0)
  })

  test('Genesis 1 shows its text, and the scroll goes on into Genesis 2', async ({ page }) => {
    await openChapter(page, WIDE, 'genesis', 1)
    await expect(chapter(page, 'genesis', 1).locator('.chapter-body')).toContainText('In the beginning God created the heavens and the earth.')
    const genesis2 = chapter(page, 'genesis', 2)
    for (let i = 0; i < 10 && (await genesis2.count()) === 0; i++) await page.mouse.wheel(0, 1200)
    await expect(genesis2.locator('.chapter-body')).toContainText('Thus the heavens and the earth were completed in all their vast array.')
  })

  test('Mark 16 shows the manuscript note after verse 8', async ({ page }) => {
    await openChapter(page, WIDE, 'mark', 16)
    const mark16 = chapter(page, 'mark', 16)
    const note = mark16.getByRole('note').filter({ hasText: 'Some early manuscripts end the Gospel of Mark after verse 8.' })
    await expect(note).toHaveCount(1)
    await note.scrollIntoViewIfNeeded()
    await expect(note).toBeInViewport()
    // The note comes after verse 8 and before verse 9, which starts the longer ending.
    const top = async (verse: number) => (await mark16.locator(`.vn[data-verse="${verse}"]`).first().boundingBox())!.y
    const y = (await note.boundingBox())!.y
    expect(await top(8)).toBeLessThan(y)
    expect(y).toBeLessThan(await top(9))
  })
})
