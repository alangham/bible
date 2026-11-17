/// <reference lib="dom" />
// The King James Version, the World English Bible, and the translation list. docs/DESIGN.md sections 8, 9.5,
// and 13, docs/TASKS.md Task 21 step 11, Task 22 step 15, and Task 31 step 11. The axe-core checks with the
// King James Version and the World English Bible selected are in a11y.spec.ts.
// The translation list opens from the translation control in the top bar of the reading page.

import { readFileSync } from 'node:fs'
import { expect, test, type Locator, type Page } from '@playwright/test'

const VIEWPORTS = [
  { name: '1440 by 900 px', size: { width: 1440, height: 900 } },
  { name: '390 by 844 px', size: { width: 390, height: 844 } },
]
const KEY = 'bible-translation'

type Item = string | { v?: number; a?: string; o?: number; j?: string | 1 }
interface TextFile {
  chapters: { blocks: { k: string; c?: Item[] }[] }[]
}

/** The words of one verse in a data file: its strings, its added words, and its marked words (Task 26). */
function dataVerse(folder: 'text' | 'text-kjv' | 'text-web', book: string, c: number, v: number): string {
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
      else if (typeof item.j === 'string' && verse === v) out += item.j
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

/** Opens a chapter with a translation selected. */
async function openIn(translation: 'bsb' | 'kjv' | 'web', page: Page, size: { width: number; height: number }, book: string, n: number) {
  await page.setViewportSize(size)
  await page.addInitScript(([key, t]) => localStorage.setItem(key, t), [KEY, translation])
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-translation', translation)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
  await settled(page)
}

/** Opens a chapter with the King James Version selected. */
const openKjv = (page: Page, size: { width: number; height: number }, book: string, n: number) => openIn('kjv', page, size, book, n)

const translationControl = (page: Page) => page.getByRole('button', { name: /^Translation: / })
const translationList = (page: Page) => page.locator('#translation-list').getByRole('group', { name: 'Translation' })

/** Opens the translation list and selects a translation. */
async function selectTranslation(page: Page, name: 'Berean Standard Bible' | 'King James Version' | 'World English Bible') {
  await translationControl(page).click()
  await expect(translationList(page)).toBeVisible()
  await translationList(page).getByRole('button', { name }).click()
}

for (const vp of VIEWPORTS) {
  test.describe(`the translation, at ${vp.name}`, () => {
    test('the first visit shows the Berean Standard Bible', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./#/book/genesis/1')
      const genesis = chapter(page, 'genesis', 1)
      await expect(genesis).toHaveAttribute('data-translation', 'bsb')
      await expect(translationControl(page)).toHaveText('BSB')
      await translationControl(page).click()
      await expect(translationList(page).getByRole('button')).toHaveCount(3)
      await expect(translationList(page).getByRole('button', { name: 'Berean Standard Bible' })).toHaveAttribute('aria-pressed', 'true')
      await expect(translationList(page).getByRole('button', { name: 'King James Version' })).toHaveAttribute('aria-pressed', 'false')
      await expect(translationList(page).getByRole('button', { name: 'World English Bible' })).toHaveAttribute('aria-pressed', 'false')
      await page.keyboard.press('Escape')
      expect(await pageVerse(genesis, 1)).toBe('In the beginning God created the heavens and the earth.')
      await expect(genesis.locator('.rd-translation')).toHaveText('Berean Standard Bible')
    })

    test('the translation list selects the King James Version, and the selection stays after a reload', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./#/book/genesis/1')
      const genesis = chapter(page, 'genesis', 1)
      await expect(genesis).toHaveAttribute('data-loaded', 'true')
      await selectTranslation(page, 'King James Version')
      await expect(page.locator('#translation-list')).toBeHidden()
      await expect(translationControl(page)).toBeFocused()
      await expect(translationControl(page)).toHaveText('KJV')
      await expect(translationControl(page)).toHaveAccessibleName('Translation: King James Version, KJV')
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('kjv')
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
      await expect(translationControl(page)).toHaveText('KJV')
      await translationControl(page).click()
      await expect(translationList(page).getByRole('button', { name: 'King James Version' })).toHaveAttribute('aria-pressed', 'true')
    })

    test('the translation list changes the translation, and the verse at the top stays at its place', async ({ page }) => {
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

      await selectTranslation(page, 'Berean Standard Bible')
      await expect(page.locator('#translation-list')).toBeHidden()
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
      await selectTranslation(page, 'Berean Standard Bible')
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
      await expect(text).toContainText('The site has three translations: the Berean Standard Bible (BSB), the King James Version (KJV), and the World English Bible (WEB).')
      await expect(text).toContainText(
        'The King James Version on this site is the standardized text of 1769, from the files of eBible.org, by courtesy of the Crosswire Bible Society and eBible.org. It is in the public domain. In the United Kingdom, three publishers have the exclusive right to print this translation: Cambridge University Press, Oxford University Press, and Collins. eBible.org states that this right has no effect outside the United Kingdom.',
      )
      await expect(text).toContainText(
        'The site does not show the Strong\'s numbers, the footnotes, and the paragraph signs of these files. It also does not show these lines of the files: the title lines of the books, for example "The First Book of Moses, called Genesis", the names of the Hebrew letters in Psalm 119, and the line at the end of 14 letters, for example "Written from Rome unto the Ephesians by Tychicus". The words that the translators added show in italics. In 13 verses, the files write one word as two words, for example "can not", and the site joins the word.',
      )
      await expect(text).toContainText(
        'On the King James Version pages and the World English Bible pages, the section headings, the cross-reference lines, the paragraphs, and the lines of poetry are those of the Berean Standard Bible files. They are not part of these translations.',
      )
      await expect(text.getByRole('link', { name: 'eBible.org' }).first()).toHaveAttribute('href', 'https://ebible.org/eng-kjv2006')
      await expect(text.getByRole('link', { name: 'Crosswire Bible Society' })).toHaveAttribute('href', 'https://crosswire.org/')
      await expect(text.getByRole('link', { name: 'Berean Standard Bible' })).toHaveAttribute('href', 'https://berean.bible/')
    })

    test('each row of the translation list is 24 by 24 px or more, and works with the keyboard', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./#/book/ruth/1')
      await expect(chapter(page, 'ruth', 1)).toHaveAttribute('data-translation', 'bsb')
      await settled(page)
      // The control of the chapter grid, then the Tab key: the translation control.
      await page.locator('.rd-where').focus()
      await page.keyboard.press('Tab')
      await expect(translationControl(page)).toBeFocused()
      await page.keyboard.press('Enter')
      const list = translationList(page)
      await expect(list).toBeVisible()
      for (const b of await list.getByRole('button').all()) {
        const box = await b.boundingBox()
        expect(box!.width).toBeGreaterThanOrEqual(24)
        expect(box!.height).toBeGreaterThanOrEqual(44)
      }
      // The focus is on the selected translation. The Tab key goes to the next row.
      await expect(list.getByRole('button', { name: 'Berean Standard Bible' })).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(list.getByRole('button', { name: 'King James Version' })).toBeFocused()
      await page.keyboard.press('Space')
      await expect(page.locator('#translation-list')).toBeHidden()
      await expect(translationControl(page)).toBeFocused()
      await expect(chapter(page, 'ruth', 1)).toHaveAttribute('data-translation', 'kjv')
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('kjv')
    })
  })
}

// The World English Bible. docs/DESIGN.md section 13, docs/TASKS.md Task 31 step 11.

/** The page errors of a page, from the time of the call. */
function pageErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  return errors
}

/** The verse numbers of a chapter on the page, in their order. */
const verseNumbers = (section: Locator) =>
  section.locator('.chapter-body .vn[data-verse]').evaluateAll((els) => els.map((e) => Number((e as HTMLElement).dataset.verse)))

/** The first verse number below the top bar: its chapter, its number, and its distance from the top of the window. */
const firstVerse = (page: Page) =>
  page.evaluate(() => {
    for (const n of document.querySelectorAll<HTMLElement>('.rd-column .chapter-body .vn[data-verse]')) {
      const top = n.getBoundingClientRect().top
      if (top < 52) continue
      const s = n.closest<HTMLElement>('section.rd-chapter')
      return { book: s?.dataset.book, c: Number(s?.dataset.chapter), v: Number(n.dataset.verse), top }
    }
    return null
  })

/** Scrolls so that a verse number is at `top` px from the top of the window. */
async function scrollVerseTo(page: Page, book: string, c: number, v: number, top: number) {
  await page.evaluate(
    ({ book, c, v, top }) => {
      const n = document.querySelector<HTMLElement>(`section.rd-chapter[data-book="${book}"][data-chapter="${c}"] .chapter-body .vn[data-verse="${v}"]`)
      if (n) window.scrollBy(0, n.getBoundingClientRect().top - top)
    },
    { book, c, v, top },
  )
  await page.waitForTimeout(300)
}

const openWeb = (page: Page, size: { width: number; height: number }, book: string, n: number) => openIn('web', page, size, book, n)

/** Opens a chapter in a new page of the same browser, with a translation stored. */
async function openFresh(page: Page, size: { width: number; height: number }, translation: 'bsb' | 'web', book: string, n: number) {
  const p = await page.context().newPage()
  await p.addInitScript(([key, t]) => {
    localStorage.setItem(key, t)
    localStorage.setItem('bible-echo-links', 'on')
  }, [KEY, translation])
  await p.setViewportSize(size)
  await p.goto(`./#/book/${book}/${n}`)
  await expect(chapter(p, book, n)).toHaveAttribute('data-translation', translation)
  await expect(chapter(p, book, n)).toHaveAttribute('data-loaded', 'true')
  await settled(p)
  return p
}

for (const vp of VIEWPORTS) {
  test.describe(`the World English Bible, at ${vp.name}`, () => {
    test('the translation list has three rows, selects the World English Bible, and the verse at the top stays at its place', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./#/book/john/3')
      const john = chapter(page, 'john', 3)
      await expect(john).toHaveAttribute('data-loaded', 'true')
      await settled(page)
      await scrollVerseTo(page, 'john', 3, 10, 200)
      const before = await firstVerse(page)
      expect(before).toMatchObject({ book: 'john', c: 3 })

      await translationControl(page).click()
      const rows = translationList(page).getByRole('button')
      await expect(rows).toHaveCount(3)
      // Since Task 33, the name of a row is the name of the translation and its line. docs/TASKS.md Task 33 step 4.
      await expect(rows.nth(0)).toHaveAccessibleName('Berean Standard Bible Today’s English, in a literary style. Between literal and thought for thought.')
      await expect(rows.nth(1)).toHaveAccessibleName('King James Version Older English, in the text of 1769: thee, thou, believeth.')
      await expect(rows.nth(2)).toHaveAccessibleName('World English Bible Today’s English, in an informal, spoken style. A fairly literal translation.')
      await rows.nth(2).click()
      await expect(page.locator('#translation-list')).toBeHidden()
      await expect(translationControl(page)).toHaveText('WEB')
      await expect(translationControl(page)).toHaveAccessibleName('Translation: World English Bible, WEB')
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('web')
      await expect(john).toHaveAttribute('data-translation', 'web')
      await page.waitForTimeout(300)
      expect(await pageVerse(john, 16)).toContain('only born Son')
      expect(await pageVerse(john, 16)).toBe(dataVerse('text-web', 'john', 3, 16))
      await expect(john.locator('.rd-translation')).toHaveText('World English Bible')
      const after = await page.evaluate(
        ({ c, v }) => document.querySelector(`section.rd-chapter[data-book="john"][data-chapter="${c}"] .chapter-body .vn[data-verse="${v}"]`)?.getBoundingClientRect().top,
        { c: before!.c, v: before!.v },
      )
      expect(Math.abs((after ?? 9999) - before!.top)).toBeLessThanOrEqual(2)

      // After a reload, the World English Bible is still selected, and its row has the check mark.
      await page.reload()
      await expect(chapter(page, 'john', 3)).toHaveAttribute('data-translation', 'web')
      await expect(translationControl(page)).toHaveText('WEB')
      await translationControl(page).click()
      await expect(rows.nth(2)).toHaveAttribute('aria-pressed', 'true')
      await expect(rows.nth(2).locator('.tr-check path')).toHaveCount(1)
      await expect(rows.nth(0).locator('.tr-check path')).toHaveCount(0)
      await expect(rows.nth(1).locator('.tr-check path')).toHaveCount(0)
    })

    test('Genesis 1:1, the section heading "The Creation", and its cross-reference line', async ({ page }) => {
      await openWeb(page, vp.size, 'genesis', 1)
      const genesis = chapter(page, 'genesis', 1)
      expect(await pageVerse(genesis, 1)).toBe('In the beginning, God created the heavens and the earth.')
      await expect(genesis.locator('h3.sh-s1').first()).toHaveText('The Creation')
      await expect(genesis.locator('h3.sh-s1 + .link-line').first()).toContainText('John 1:1–5')
    })

    test('Psalm 23 has its title and verse 1, and no added words', async ({ page }) => {
      await openWeb(page, vp.size, 'psalms', 23)
      const psalm = chapter(page, 'psalms', 23)
      await expect(psalm.locator('.tb-d')).toContainText('A Psalm by David.')
      await expect(psalm.locator('.tb-d + .tb')).toContainText('The LORD is my shepherd; I shall lack nothing.')
      expect(await pageVerse(psalm, 1)).toBe('A Psalm by David. The LORD is my shepherd; I shall lack nothing.')
      await expect(psalm.locator('.added')).toHaveCount(0)
    })

    test('Psalm 119 has the words "ALEPH" one time', async ({ page }) => {
      await openWeb(page, vp.size, 'psalms', 119)
      const text = await chapter(page, 'psalms', 119).evaluate((el) => el.textContent ?? '')
      expect(text.match(/ALEPH/g) ?? []).toHaveLength(1)
    })

    test('Matthew 17:21 shows as text, with no note', async ({ page }) => {
      await openWeb(page, vp.size, 'matthew', 17)
      const matthew = chapter(page, 'matthew', 17)
      expect(await pageVerse(matthew, 21)).toBe(dataVerse('text-web', 'matthew', 17, 21))
      expect(await pageVerse(matthew, 21)).toContain('this kind doesn’t go out except by prayer and fasting')
      await expect(matthew.locator('.omitted')).toHaveCount(0)
      await expect(matthew.locator('.ms-note')).toHaveCount(0)
    })

    test('Luke 17 has the verse numbers 35 and 37, no verse number 36, and no note', async ({ page }) => {
      await openWeb(page, vp.size, 'luke', 17)
      const luke = chapter(page, 'luke', 17)
      const numbers = await verseNumbers(luke)
      expect(numbers).toContain(35)
      expect(numbers).toContain(37)
      expect(numbers).not.toContain(36)
      expect(numbers.indexOf(37)).toBe(numbers.indexOf(35) + 1)
      await expect(luke.locator('.omitted')).toHaveCount(0)
      await expect(luke.locator('.ms-note')).toHaveCount(0)
    })

    test('Romans 14 ends with verses 24, 25, and 26 in one paragraph after verse 23, and has no heading "Doxology"', async ({ page }) => {
      await openWeb(page, vp.size, 'romans', 14)
      const romans = chapter(page, 'romans', 14)
      expect((await verseNumbers(romans)).slice(-4)).toEqual([23, 24, 25, 26])
      const paragraph = (v: number) =>
        romans.locator(`.chapter-body .vn[data-verse="${v}"]`).evaluate((el) => {
          const p = el.closest('p')
          return p ? [...document.querySelectorAll('p')].indexOf(p) : -1
        })
      const p24 = await paragraph(24)
      expect(p24).toBeGreaterThanOrEqual(0)
      expect(await paragraph(25)).toBe(p24)
      expect(await paragraph(26)).toBe(p24)
      expect(await paragraph(23)).toBeLessThan(p24)
      await expect(romans.locator('h3, h4').filter({ hasText: 'Doxology' })).toHaveCount(0)
    })

    test('Romans 16 ends at verse 24, with no heading "Doxology" and no line "(Jude 1:24–25)"; the Berean Standard Bible has the two', async ({ page }) => {
      await openWeb(page, vp.size, 'romans', 16)
      const romans = chapter(page, 'romans', 16)
      expect((await verseNumbers(romans)).at(-1)).toBe(24)
      await expect(romans.locator('h3, h4').filter({ hasText: 'Doxology' })).toHaveCount(0)
      await expect(romans.locator('.link-line').filter({ hasText: 'Jude 1:24–25' })).toHaveCount(0)

      const fresh = await openFresh(page, vp.size, 'bsb', 'romans', 16)
      const bsb = chapter(fresh, 'romans', 16)
      await expect(bsb.locator('h3.sh-s1').filter({ hasText: 'Doxology' })).toHaveCount(1)
      await expect(bsb.locator('h3.sh-s1 + .link-line').filter({ hasText: '(Jude 1:24–25)' })).toHaveCount(1)
    })

    test('Jude: the line "(Romans 16:25–27)" under the heading "Doxology" has no control; with the Berean Standard Bible it has one', async ({ page }) => {
      const line = (p: Page) => chapter(p, 'jude', 1).locator('h3.sh-s1:has-text("Doxology") + .link-line')
      await openWeb(page, vp.size, 'jude', 1)
      await expect(line(page)).toHaveText('(Romans 16:25–27)')
      await expect(line(page).getByRole('button')).toHaveCount(0)

      const fresh = await openFresh(page, vp.size, 'bsb', 'jude', 1)
      await expect(line(fresh)).toHaveText('(Romans 16:25–27)')
      await expect(line(fresh).getByRole('button', { name: /Romans 16:25/ })).toHaveCount(1)
    })

    test('with the echo links on, Matthew 13:35 and 1 Timothy 3:16 have no control for Romans 16:25; with the Berean Standard Bible they have one', async ({ page }) => {
      for (const [book, c] of [
        ['matthew', 13],
        ['1-timothy', 3],
      ] as const) {
        for (const t of ['web', 'bsb'] as const) {
          const p = await openFresh(page, vp.size, t, book, c)
          const controls = chapter(p, book, c).getByRole('button', { name: /Romans 16:25/ })
          await expect(controls, `${book} ${c} ${t}`).toHaveCount(t === 'web' ? 0 : 1)
          await p.close()
        }
      }
    })

    test('the addresses #/book/romans/16/25 and #/book/luke/17/36 open their chapters at the top, with no page error', async ({ page }) => {
      const errors = pageErrors(page)
      await page.setViewportSize(vp.size)
      await page.addInitScript((key) => localStorage.setItem(key, 'web'), KEY)
      for (const [book, c, v] of [
        ['romans', 16, 25],
        ['luke', 17, 36],
      ] as const) {
        await page.goto('./#/')
        await page.goto(`./#/book/${book}/${c}/${v}`)
        const section = chapter(page, book, c)
        await expect(section).toHaveAttribute('data-translation', 'web')
        await expect(section).toHaveAttribute('data-loaded', 'true')
        await settled(page)
        await page.waitForTimeout(300)
        expect(await page.evaluate(() => window.scrollY), `${book} ${c}:${v}`).toBe(0)
        await expect(section.locator('.vn[data-verse]').first()).toBeInViewport()
      }
      expect(errors).toEqual([])
    })

    test('with verse 25 of Romans 14 at the top, the Berean Standard Bible keeps verse 23 at its place, with no page error', async ({ page }) => {
      const errors = pageErrors(page)
      await openWeb(page, vp.size, 'romans', 14)
      // Verse 25 is near the end of the chapter. The page adds Romans 15 near the end of Romans 14: then the
      // page can scroll verse 25 to the top.
      await expect(async () => {
        await page.mouse.wheel(0, 1500)
        await expect(chapter(page, 'romans', 15)).toHaveAttribute('data-loaded', 'true', { timeout: 500 })
      }).toPass()
      await scrollVerseTo(page, 'romans', 14, 25, 60)
      expect(await firstVerse(page)).toMatchObject({ book: 'romans', c: 14, v: 25 })
      const before = (await firstVerse(page))!
      await selectTranslation(page, 'Berean Standard Bible')
      await expect(page.locator('#translation-list')).toBeHidden()
      await expect(chapter(page, 'romans', 14)).toHaveAttribute('data-translation', 'bsb')
      await page.waitForTimeout(300)
      await expect(page.locator('header.rd-bar .rd-where')).toHaveText(/^Romans\s*(Chapter )?14$/)
      const top23 = await chapter(page, 'romans', 14)
        .locator('.chapter-body .vn[data-verse="23"]')
        .evaluate((el) => el.getBoundingClientRect().top)
      expect(Math.abs(top23 - before.top)).toBeLessThanOrEqual(2)
      expect(errors).toEqual([])
    })

    test('the pop-up of a quotation link shows the World English Bible, with the label below the reason line', async ({ page }) => {
      const name = vp.size.width >= 1180 ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8'
      await openWeb(page, vp.size, 'hebrews', 9)
      await page.getByRole('button', { name }).click()
      const dialog = page.getByRole('dialog', { name: 'Exodus 24:8' })
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('.pop-text')).toContainText(dataVerse('text-web', 'exodus', 24, 8))
      await expect(dialog.locator('.pop-text .sr-only')).toHaveText('(Exodus 24:8, World English Bible)')
      await expect(dialog.locator('.pop-reason + .pop-quoted-from')).toHaveText('The quoted words are from the Berean Standard Bible.')
    })

    test('the no-break space of John 5:11 stays, on the reading page and in the pop-up of the echo link from Matthew 9:5', async ({ page }) => {
      await openWeb(page, vp.size, 'john', 5)
      const raw = (section: Locator) => section.locator('.chapter-body').evaluate((el) => el.textContent ?? '')
      expect(await raw(chapter(page, 'john', 5))).toContain('walk.’ ”')

      const p = await openFresh(page, vp.size, 'web', 'matthew', 9)
      await chapter(p, 'matthew', 9).getByRole('button', { name: /John 5:8/ }).first().click()
      const dialog = p.getByRole('dialog', { name: /John 5:8/ })
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('.pop-text')).toContainText('walk.’')
      expect(await dialog.locator('.pop-text').evaluate((el) => el.textContent ?? '')).toContain('walk.’ ”')
    })

    test('the Sources page has the credit of the World English Bible', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./#/sources')
      const text = page.locator('section[aria-labelledby="sources-text"]')
      // The paragraphs are on the page before the test reads them.
      await expect(text.locator('p').filter({ hasText: 'The World English Bible on this site' })).toBeVisible()
      const paragraphs = (await text.locator('p').allTextContents()).map((p) => p.replace(/\s+/g, ' ').trim())
      const words = [
        'The site does not show the Strong\'s numbers, the footnotes, and the paragraph signs of these files. It also does not show these lines of the files: the title lines of the books, for example "The First Book of Moses, called Genesis", the names of the Hebrew letters in Psalm 119, and the line at the end of 14 letters, for example "Written from Rome unto the Ephesians by Tychicus". The words that the translators added show in italics. In 13 verses, the files write one word as two words, for example "can not", and the site joins the word.',
        'The World English Bible on this site is the edition that does not have the books of the Apocrypha, from the files of eBible.org. eBible.org names it the 2020 stable text edition, and gives it the abbreviation "WEBP". The World English Bible is in the public domain. "World English Bible" is a trademark of eBible.org.',
        'The site shows the words of these files without change. It does not show the Strong\'s numbers, the footnotes, and the cross-reference notes of these files. It also does not show these lines of the files: the title lines of the books, for example "Paul’s Letter to the Romans", the names of the speakers in the Song of Solomon, the lines "BOOK 1" to "BOOK 5" in the Psalms, and the names of the Hebrew letters in Psalm 119.',
        'The verse numbers of the World English Bible are those of the files. Romans 14 has 26 verses, and Romans 16 ends at verse 24. In the two other translations of this site, the words of the last three verses of Romans 14 are Romans 16:25 to 16:27. Five verse numbers have no words in the files, and the site does not show them: Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7, and Romans 16:25.',
        'On the King James Version pages and the World English Bible pages, the section headings, the cross-reference lines, the paragraphs, and the lines of poetry are those of the Berean Standard Bible files. They are not part of these translations.',
        'The words of Jesus are in red. They are the words that the files of each translation mark as words of Jesus. The three translations do not mark the same words in each verse. The site changes one mark: in Mark 12:37 of the King James Version, the file also marks the sentence "And the common people heard him gladly.", and the site does not.',
      ]
      // The paragraphs in this order, one after the other: the King James Version, the World English Bible, the structure, the words of Jesus.
      const first = paragraphs.indexOf(words[0])
      expect(first).toBeGreaterThanOrEqual(0)
      expect(paragraphs.slice(first, first + words.length)).toEqual(words)
      const ebible = text.getByRole('link', { name: 'eBible.org' })
      await expect(ebible).toHaveCount(2)
      await expect(ebible.nth(1)).toHaveAttribute('href', 'https://ebible.org/details.php?id=engwebp')
    })
  })
}
