/// <reference lib="dom" />
// The King James Version and the translation switch. docs/DESIGN.md section 8, docs/TASKS.md Task 21
// step 11. The axe-core checks with the King James Version selected are in a11y.spec.ts.

import { readFileSync } from 'node:fs'
import { expect, test, type Locator, type Page } from '@playwright/test'

const VIEWPORTS = [
  { name: '1440 by 900 px', size: { width: 1440, height: 900 } },
  { name: '390 by 844 px', size: { width: 390, height: 844 } },
]
const KEY = 'bible-translation'

type Item = string | { v?: number; a?: string; o?: number }
interface TextFile {
  chapters: { blocks: { k: string; c?: Item[] }[] }[]
}

/** The words of one verse in a data file: its strings and its added words. */
function dataVerse(folder: 'text' | 'text-kjv', book: string, c: number, v: number): string {
  const text = JSON.parse(readFileSync(new URL(`../public/data/${folder}/${book}.json`, import.meta.url), 'utf8')) as TextFile
  let verse = 0
  let out = ''
  for (const block of text.chapters[c - 1].blocks) {
    if (block.k !== 'p') continue
    for (const item of block.c ?? []) {
      if (typeof item === 'string') {
        if (verse === v) out += item
      } else if (item.v !== undefined) verse = item.v
      else if (item.a !== undefined && verse === v) out += item.a
    }
  }
  return out.replace(/\s+/g, ' ').trim()
}

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)

/**
 * The words of one verse on the page: the text from its verse number to the next verse number,
 * without the link controls, the headings, the cross-reference lines, and the text for a screen reader.
 */
function pageVerse(section: Locator, v: number): Promise<string> {
  return section.evaluate((el, v) => {
    const body = el.querySelector('.chapter-body')
    if (!body) return ''
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
    let on = false
    let out = ''
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (node instanceof HTMLElement) {
        if (node.classList.contains('vn')) {
          const d = Number(node.dataset.verse)
          if (on && d !== v) break
          on = d === v
        }
        continue
      }
      const parent = node.parentElement
      if (!on || !parent || parent.closest('button, .sr-only, .vn, h3, h4, .link-line, .sh-ms')) continue
      out += node.textContent
    }
    return out.replace(/\s+/g, ' ').trim()
  }, v)
}

async function settled(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
}

/** Opens a chapter with the King James Version selected. */
async function openKjv(page: Page, size: { width: number; height: number }, book: string, n: number) {
  await page.setViewportSize(size)
  await page.addInitScript((key) => localStorage.setItem(key, 'kjv'), KEY)
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-translation', 'kjv')
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
  await settled(page)
}

const switchOn = (scope: Page | Locator) => scope.getByRole('group', { name: 'Translation' })

for (const vp of VIEWPORTS) {
  test.describe(`the translation, at ${vp.name}`, () => {
    test('the first visit shows the Berean Standard Bible', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./')
      const wall = switchOn(page)
      await expect(wall.getByRole('button', { name: 'Berean Standard Bible' })).toHaveAttribute('aria-pressed', 'true')
      await expect(wall.getByRole('button', { name: 'King James Version' })).toHaveAttribute('aria-pressed', 'false')
      await page.goto('./#/book/genesis/1')
      const genesis = chapter(page, 'genesis', 1)
      await expect(genesis).toHaveAttribute('data-translation', 'bsb')
      expect(await pageVerse(genesis, 1)).toBe('In the beginning God created the heavens and the earth.')
      await expect(genesis.locator('.rd-translation')).toHaveText('Berean Standard Bible')
    })

    test('the wall selects the King James Version, and the selection stays after a reload', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./')
      await switchOn(page).getByRole('button', { name: 'King James Version' }).click()
      await expect(switchOn(page).getByRole('button', { name: 'King James Version' })).toHaveAttribute('aria-pressed', 'true')
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('kjv')
      await page.getByRole('link', { name: 'Genesis', exact: true }).click()
      const genesis = chapter(page, 'genesis', 1)
      await expect(genesis).toHaveAttribute('data-translation', 'kjv')
      await expect(genesis).toHaveAttribute('data-loaded', 'true')
      expect(await pageVerse(genesis, 1)).toBe('In the beginning God created the heaven and the earth.')
      // Genesis 1:2 has the added word "was", in italics.
      expect(await pageVerse(genesis, 2)).toBe(dataVerse('text-kjv', 'genesis', 1, 2))
      const added = genesis.locator('.chapter-body i.added')
      await expect(added.first()).toHaveText('was')
      expect(await added.first().evaluate((el) => getComputedStyle(el).fontStyle)).toBe('italic')
      expect(await added.first().evaluate((el) => (el.closest('p')?.querySelector('.vn') as HTMLElement | null)?.dataset.verse)).toBe('2')
      // The section heading of the Berean files, and its cross-reference line, are on the page.
      await expect(genesis.locator('h3.sh-s1').first()).toHaveText('The Creation')
      await expect(genesis.locator('h3.sh-s1 + .link-line').first()).toContainText('John 1:1–5')
      await expect(genesis.locator('.rd-translation')).toHaveText('King James Version')

      await page.reload()
      await expect(chapter(page, 'genesis', 1)).toHaveAttribute('data-translation', 'kjv')
      expect(await pageVerse(chapter(page, 'genesis', 1), 1)).toBe('In the beginning God created the heaven and the earth.')
      // The switch is in the panel of the chapter grid, which is closed.
      await expect(page.getByRole('group', { name: 'Translation', includeHidden: true }).getByRole('button', { name: 'King James Version', includeHidden: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
    })

    test('the panel of the chapter grid changes the translation, and the verse at the top stays at its place', async ({ page }) => {
      await openKjv(page, vp.size, 'genesis', 1)
      // Scroll to Genesis 2: verse 5 near the top of the page. The page adds Genesis 2 near the end of Genesis 1.
      await expect(async () => {
        await page.mouse.wheel(0, 1500)
        await expect(chapter(page, 'genesis', 2)).toHaveAttribute('data-loaded', 'true', { timeout: 500 })
      }).toPass()
      await page.evaluate(() => {
        const n = document.querySelector<HTMLElement>('section.rd-chapter[data-book="genesis"][data-chapter="2"] .chapter-body .vn[data-verse="5"]')
        if (n) window.scrollBy(0, n.getBoundingClientRect().top - 200)
      })
      await page.waitForTimeout(300)
      const before = await page.evaluate(() => {
        for (const n of document.querySelectorAll<HTMLElement>('.rd-column .chapter-body .vn[data-verse]')) {
          const top = n.getBoundingClientRect().top
          if (top < 52) continue
          const s = n.closest<HTMLElement>('section.rd-chapter')
          return { book: s?.dataset.book, c: Number(s?.dataset.chapter), v: Number(n.dataset.verse), top }
        }
        return null
      })
      expect(before).not.toBeNull()
      expect(before?.c).toBe(2)
      const historyLength = await page.evaluate(() => history.length)

      await page.locator('.rd-where').click()
      const panel = page.locator('.rd-grid-panel')
      await expect(panel).toBeVisible()
      await switchOn(panel).getByRole('button', { name: 'Berean Standard Bible' }).click()
      await expect(panel).toBeHidden()
      for (const s of await page.locator('section.rd-chapter').all()) await expect(s).toHaveAttribute('data-translation', 'bsb')
      await page.waitForTimeout(300)

      const after = await page.evaluate(
        ({ c, v }) =>
          document.querySelector(`section.rd-chapter[data-book="genesis"][data-chapter="${c}"] .chapter-body .vn[data-verse="${v}"]`)?.getBoundingClientRect().top,
        { c: before!.c, v: before!.v },
      )
      expect(Math.abs((after ?? 9999) - before!.top)).toBeLessThanOrEqual(2)
      expect(await pageVerse(chapter(page, 'genesis', 2), before!.v)).toBe(dataVerse('text', 'genesis', 2, before!.v))
      // No entry in the history, and no trail.
      expect(await page.evaluate(() => history.length)).toBe(historyLength)
      await expect(page.getByRole('navigation', { name: 'Trail' })).toHaveCount(0)
    })

    test('a scroll while the new text loads is not undone', async ({ page }) => {
      await openKjv(page, vp.size, 'genesis', 1)
      // The text of the Berean Standard Bible arrives late.
      await page.route('**/data/text/genesis.json', async (route) => {
        await new Promise((r) => setTimeout(r, 1500))
        await route.continue()
      })
      await page.locator('.rd-where').click()
      await switchOn(page.locator('.rd-grid-panel')).getByRole('button', { name: 'Berean Standard Bible' }).click()
      await page.mouse.move(vp.size.width / 2, vp.size.height / 2)
      await page.mouse.wheel(0, 600)
      await page.waitForTimeout(300)
      const scrolled = await page.evaluate(() => window.scrollY)
      expect(scrolled).toBeGreaterThan(400)
      await expect(chapter(page, 'genesis', 1)).toHaveAttribute('data-translation', 'bsb')
      await page.waitForTimeout(300)
      expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrolled)).toBeLessThanOrEqual(2)
    })

    test('Psalm 23 has its title, and the added word "is" in italics', async ({ page }) => {
      await openKjv(page, vp.size, 'psalms', 23)
      const psalm = chapter(page, 'psalms', 23)
      await expect(psalm.locator('.tb-d')).toContainText('A Psalm of David.')
      await expect(psalm.locator('.tb-d .added')).toHaveCount(0)
      const line = psalm.locator('.tb-d + .tb')
      await expect(line).toContainText('The LORD is my shepherd; I shall not want.')
      await expect(line.locator('i.added')).toHaveText('is')
      expect(await line.locator('i.added').evaluate((el) => getComputedStyle(el).fontStyle)).toBe('italic')
      expect(await pageVerse(psalm, 1)).toBe('A Psalm of David. The LORD is my shepherd; I shall not want.')
    })

    test('Matthew 17:21 shows as text, with no note', async ({ page }) => {
      await openKjv(page, vp.size, 'matthew', 17)
      const matthew = chapter(page, 'matthew', 17)
      expect(await pageVerse(matthew, 21)).toBe('Howbeit this kind goeth not out but by prayer and fasting.')
      await expect(matthew.locator('.omitted')).toHaveCount(0)
      await expect(matthew.locator('.ms-note')).toHaveCount(0)
    })

    test('the pop-up of a quotation link shows the King James Version, with the label below the reason line', async ({ page }) => {
      const name = vp.size.width >= 1180 ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8'
      await openKjv(page, vp.size, 'hebrews', 9)
      await page.getByRole('button', { name }).click()
      const dialog = page.getByRole('dialog', { name: 'Exodus 24:8' })
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('.pop-text')).toContainText(dataVerse('text-kjv', 'exodus', 24, 8))
      await expect(dialog.locator('.pop-text .sr-only')).toHaveText('(Exodus 24:8, King James Version)')
      await expect(dialog.locator('.pop-reason + .pop-quoted-from')).toHaveText('The quoted words are from the Berean Standard Bible.')
      await dialog.getByRole('button', { name: 'Stay here' }).click()

      // In the Berean Standard Bible, the label is not there.
      await page.evaluate((key) => localStorage.setItem(key, 'bsb'), KEY)
      await page.goto('about:blank')
      const fresh = await page.context().newPage()
      await fresh.setViewportSize(vp.size)
      await fresh.goto('./#/book/hebrews/9')
      await expect(chapter(fresh, 'hebrews', 9)).toHaveAttribute('data-translation', 'bsb')
      await settled(fresh)
      await fresh.getByRole('button', { name }).click()
      const bsb = fresh.getByRole('dialog', { name: 'Exodus 24:8' })
      await expect(bsb.locator('.pop-text')).toContainText(dataVerse('text', 'exodus', 24, 8))
      await expect(bsb.locator('.pop-reason')).toBeVisible()
      await expect(bsb.locator('.pop-quoted-from')).toHaveCount(0)
    })

    test('the Sources page has the credit of the King James Version', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./#/sources')
      const text = page.locator('section[aria-labelledby="sources-text"]')
      await expect(text).toContainText('The site has two translations: the Berean Standard Bible (BSB) and the King James Version (KJV).')
      await expect(text).toContainText(
        'The King James Version on this site is the standardized text of 1769, from the files of eBible.org, by courtesy of the Crosswire Bible Society and eBible.org. It is in the public domain. In the United Kingdom, three publishers have the exclusive right to print this translation: Cambridge University Press, Oxford University Press, and Collins. eBible.org states that this right has no effect outside the United Kingdom.',
      )
      await expect(text).toContainText(
        'The site does not show the Strong\'s numbers and the footnotes of these files. The words that the translators added show in italics. In 13 verses, the files write one word as two words, for example "can not", and the site joins the word.',
      )
      await expect(text).toContainText(
        'On the King James Version pages, the section headings, the cross-reference lines, the paragraphs, and the lines of poetry are those of the Berean Standard Bible files. They are not part of the King James Version.',
      )
      await expect(text.getByRole('link', { name: 'eBible.org' })).toHaveAttribute('href', 'https://ebible.org/eng-kjv2006')
      await expect(text.getByRole('link', { name: 'Crosswire Bible Society' })).toHaveAttribute('href', 'https://crosswire.org/')
      await expect(text.getByRole('link', { name: 'Berean Standard Bible' })).toHaveAttribute('href', 'https://berean.bible/')
    })

    test('each button of the translation switch is 24 by 24 px or more, and works with the keyboard', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./')
      await settled(page)
      const wall = switchOn(page)
      for (const b of await wall.getByRole('button').all()) {
        const box = await b.boundingBox()
        expect(box!.width).toBeGreaterThanOrEqual(24)
        expect(box!.height).toBeGreaterThanOrEqual(24)
      }
      // The last book name, then the Tab key: the two buttons of the switch, in order.
      await page.getByRole('link', { name: 'Revelation', exact: true }).focus()
      await page.keyboard.press('Tab')
      await expect(wall.getByRole('button', { name: 'Berean Standard Bible' })).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(wall.getByRole('button', { name: 'King James Version' })).toBeFocused()
      await page.keyboard.press('Enter')
      await expect(wall.getByRole('button', { name: 'King James Version' })).toHaveAttribute('aria-pressed', 'true')

      // The panel of the chapter grid: the switch is before the chapter numbers, and each button is 44 px high.
      await page.goto('./#/book/ruth/1')
      await expect(chapter(page, 'ruth', 1)).toHaveAttribute('data-translation', 'kjv')
      await page.locator('.rd-where').focus()
      await page.keyboard.press('Enter')
      const panel = page.locator('.rd-grid-panel')
      await expect(panel).toBeVisible()
      for (const b of await switchOn(panel).getByRole('button').all()) {
        const box = await b.boundingBox()
        expect(box!.width).toBeGreaterThanOrEqual(24)
        expect(box!.height).toBeGreaterThanOrEqual(44)
      }
      await expect(panel.getByRole('link', { name: 'Ruth chapter 1' })).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(switchOn(panel).getByRole('button', { name: 'King James Version' })).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(switchOn(panel).getByRole('button', { name: 'Berean Standard Bible' })).toBeFocused()
      await page.keyboard.press('Space')
      await expect(panel).toBeHidden()
      await expect(page.locator('.rd-where')).toBeFocused()
      await expect(chapter(page, 'ruth', 1)).toHaveAttribute('data-translation', 'bsb')
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('bsb')
    })
  })
}
