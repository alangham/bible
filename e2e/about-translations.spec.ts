/// <reference lib="dom" />
// About the translations: the line of each translation in the translation list, the link "About the translations",
// and the section "The three translations" of the Sources page. docs/DESIGN.md section 14, docs/TASKS.md Task 33 step 7.
// The selection of a translation and the kept verse are in translation.spec.ts. The keyboard test of the translation
// list is in topbar.spec.ts. The axe-core checks are in a11y.spec.ts.

import { expect, test, type Locator, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }
const VIEWPORTS = [
  { name: '1440 by 900 px', size: WIDE },
  { name: '390 by 844 px', size: NARROW },
]

/** The three translations, with the words of docs/DESIGN.md sections 14.2 and 14.4. */
const TRANSLATIONS = [
  {
    name: 'Berean Standard Bible',
    short: 'BSB',
    line: 'Today’s English, in a literary style. Between literal and thought for thought.',
    verse: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
  },
  {
    name: 'King James Version',
    short: 'KJV',
    line: 'Older English, in the text of 1769: thee, thou, believeth.',
    verse: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,',
  },
  {
    name: 'World English Bible',
    short: 'WEB',
    line: 'Today’s English, in an informal, spoken style. A fairly literal translation.',
    verse: 'Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud,',
  },
]

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)

async function openChapter(page: Page, size: { width: number; height: number }, book: string, n: number) {
  await page.setViewportSize(size)
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
  await page.evaluate(() => document.fonts.ready)
}

const translationControl = (page: Page) => page.getByRole('button', { name: /^Translation: / })
const translationList = (page: Page) => page.locator('#translation-list')

/** The box of each element, relative to the box of the first one: x, y, width, and height, in px. */
async function boxes(l: Locator) {
  return l.evaluateAll((els) => {
    const first = els[0].getBoundingClientRect()
    return els.map((e) => {
      const r = e.getBoundingClientRect()
      return [e.className, Math.round((r.x - first.x) * 100) / 100, Math.round((r.y - first.y) * 100) / 100, Math.round(r.width * 100) / 100, Math.round(r.height * 100) / 100]
    })
  })
}

for (const vp of VIEWPORTS) {
  test.describe(`about the translations, ${vp.name}`, () => {
    test('the translation list has three rows, each row shows its line, and the list ends with the link "About the translations"', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3)
      await translationControl(page).click()
      const list = translationList(page)
      await expect(list).toBeVisible()
      const rows = list.getByRole('group', { name: 'Translation' }).getByRole('button')
      await expect(rows).toHaveCount(3)
      for (const [i, t] of TRANSLATIONS.entries()) {
        const row = rows.nth(i)
        await expect(row.locator('.tr-line')).toHaveText(t.line)
        await expect(row.locator('.tr-line')).toBeVisible()
        // The line is below the name, in the secondary ink color, at 13 px.
        // The name is one line of 20 px at the top of .tr-name, and the line of the translation starts below it.
        const name = await row.locator('.tr-name').evaluate((el) => el.getBoundingClientRect().top)
        const line = await row.locator('.tr-line').evaluate((el) => {
          const s = getComputedStyle(el)
          return { top: el.getBoundingClientRect().top, color: s.color, size: s.fontSize }
        })
        expect(line.top - name).toBeGreaterThanOrEqual(20)
        expect(line).toMatchObject({ color: 'rgb(110, 110, 115)', size: '13px' })
        // The short name is at the top of the row, with the name.
        const short = await row.locator('.tr-short').boundingBox()
        const rowBox = await row.boundingBox()
        expect(short!.y - rowBox!.y).toBeLessThan(14)
      }
      // The link: after a thin line, 44 px high or more, 48 px or more in the narrow layout. The sign "›" is hidden from a screen reader.
      const about = list.getByRole('link', { name: 'About the translations' })
      await expect(about).toBeVisible()
      await expect(about).toHaveAccessibleName('About the translations')
      await expect(about).toHaveAttribute('href', '#/sources')
      await expect(about.locator('[aria-hidden="true"]')).toHaveText('›')
      expect((await about.boundingBox())!.height).toBeGreaterThanOrEqual(vp.size.width >= 900 ? 44 : 48)
      const rule = list.locator('.tr-about-rule')
      expect((await rule.boundingBox())!.y).toBeGreaterThanOrEqual((await rows.nth(2).boundingBox())!.y + (await rows.nth(2).boundingBox())!.height)
      expect((await about.boundingBox())!.y).toBeGreaterThan((await rule.boundingBox())!.y)
      // The list stays completely in the window.
      expect((await list.boundingBox())!.y + (await list.boundingBox())!.height).toBeLessThanOrEqual(vp.size.height)
    })

    test('the row "About the translations" closes the list and opens the Sources page, with "The three translations" first', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3)
      await translationControl(page).click()
      await translationList(page).getByRole('link', { name: 'About the translations' }).click()
      await expect(page).toHaveURL(/#\/sources$/)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sources')
      await expect(page.locator('main h2').first()).toHaveText('The three translations')
      await expect(translationList(page)).toHaveCount(0)
      // The Back control of the browser goes back to the chapter. docs/DESIGN.md section 14.6.
      await page.goBack()
      await expect(chapter(page, 'john', 3)).toHaveAttribute('data-loaded', 'true')
      await expect(translationList(page)).toBeHidden()
    })

    test('the Sources page shows the three names, the three lines, and 1 Corinthians 13:4 in each translation', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./#/sources')
      const section = page.locator('section[aria-labelledby="sources-translations"]')
      await expect(section.getByRole('heading', { level: 2 })).toHaveText('The three translations')
      await expect(section.locator('> p')).toHaveText(
        'The site has three translations of the Bible into English. The translation list in the top bar of a chapter selects one. Here is one verse, 1 Corinthians 13:4, in each translation.',
      )
      const items = section.getByRole('listitem')
      await expect(items).toHaveCount(3)
      for (const [i, t] of TRANSLATIONS.entries()) {
        const item = items.nth(i)
        await expect(item.locator('.sources-version-name b')).toHaveText(t.name)
        await expect(item.locator('.sources-version-short')).toHaveText(t.short)
        await expect(item.locator('.sources-version-line')).toHaveText(t.line)
        const verse = item.locator('.sources-version-verse')
        await expect(verse).toHaveText(t.verse)
        await expect(verse).toBeVisible()
        // The font of the Bible text.
        expect(await verse.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/^Lora\b/)
      }
      // The word "and" of the King James Version is in italics. It is an added word in the data. No other word is.
      const added = items.nth(1).locator('.sources-version-verse i')
      await expect(added).toHaveText(['and'])
      expect(await added.evaluate((el) => getComputedStyle(el).fontStyle)).toBe('italic')
      await expect(items.nth(0).locator('i')).toHaveCount(0)
      await expect(items.nth(2).locator('i')).toHaveCount(0)
      // The section has no red letters.
      await expect(section.locator('.red-letters')).toHaveCount(0)
      // The section is before "The Bible text".
      await expect(page.locator('main h2').nth(1)).toHaveText('The Bible text')
    })
  })
}

// The rows of the text list and of the "Menu" panel have the same size as before Task 33. The values were measured
// before the change, on the built site of Task 32. docs/TASKS.md Task 33 step 4.
test('at 1440 by 900 px, the rows of the text list have the size of before Task 33', async ({ page }) => {
  await openChapter(page, WIDE, 'john', 3)
  await page.getByRole('button', { name: 'Text settings' }).click()
  await expect(page.locator('#text-list')).toBeVisible()
  expect(await boxes(page.locator('#text-list, #text-list .tr-row, #text-list .ts-rule'))).toEqual([
    ['tr-list ts-list', 0, 0, 220, 201],
    ['tr-row', 6, 6, 208, 44],
    ['tr-row', 6, 50, 208, 44],
    ['tr-row', 6, 94, 208, 44],
    ['menu-rule ts-rule', 14, 144, 192, 1],
    ['tr-row ts-red', 6, 151, 208, 44],
  ])
})

test('at 390 by 844 px, the rows of the "Menu" panel have the size of before Task 33', async ({ page }) => {
  await openChapter(page, NARROW, 'john', 3)
  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await expect(page.locator('#menu-panel')).toBeVisible()
  expect(await boxes(page.locator('#menu-panel, #menu-panel .menu-row, #menu-panel .menu-size, #menu-panel .menu-rule'))).toEqual([
    ['menu-panel', 0, 0, 390, 324],
    ['menu-row', 16, 8, 358, 48],
    ['menu-size', 16, 56, 358, 48],
    ['menu-row', 16, 104, 358, 48],
    ['menu-rule', 16, 158, 358, 1],
    ['menu-row', 16, 165, 358, 48],
    ['menu-row', 16, 213, 358, 48],
    ['menu-row', 16, 261, 358, 48],
  ])
})
