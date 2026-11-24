/// <reference lib="dom" />
// The links in the study notes: the passage links, the note links, and their pop-ups. docs/DESIGN.md section 22,
// docs/TASKS.md Task 55 step 11. The tests run at 1440 by 900 px and at 390 by 844 px.

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator, type Page } from '@playwright/test'

const VIEWPORTS = [
  { name: '1440 by 900 px', size: { width: 1440, height: 900 } },
  { name: '390 by 844 px', size: { width: 390, height: 844 } },
] as const
/** The WCAG rules that axe-core checks, as in a11y.spec.ts. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']
const STUDY_KEY = 'bible-study-notes'
const SHORT_CREDIT = 'From the Aquifer Open Study Notes, licensed under CC BY-SA 4.0. Full credit'
const SOURCE_LINE = 'The reference is from the Aquifer Open Study Notes.'

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)

async function openChapter(page: Page, size: { width: number; height: number }, book: string, n: number) {
  await page.setViewportSize(size)
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
  await page.evaluate(() => document.fonts.ready)
}

/** Opens the block of notes of a notes control, and gives the block. */
async function openBlock(page: Page, book: string, n: number, words: string, name: string): Promise<Locator> {
  await chapter(page, book, n).getByRole('button', { name: words, exact: true }).click()
  const region = chapter(page, book, n).getByRole('region', { name, exact: true })
  await expect(region).toBeVisible()
  return region
}

const romans8Block = (page: Page) => openBlock(page, 'romans', 8, 'Notes on verses 1 to 4', 'Notes on verses 1 to 4 of Romans 8')

for (const vp of VIEWPORTS) {
  test.describe(`the links in the study notes, ${vp.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.context().addInitScript((key) => localStorage.setItem(key, 'on'), STUDY_KEY)
    })

    test('Romans 8, the block "Notes on verses 1 to 4": 12 links, 11 passage links and 1 note link, in the color of their groups', async ({ page }) => {
      await openChapter(page, vp.size, 'romans', 8)
      const block = await romans8Block(page)
      const links = block.locator('a.rd-study-ref')
      await expect(links).toHaveCount(12)
      await expect(links).toHaveText(['5–7', '7:23', 'study note on 6:19', 'Hebrews 10:6', '8', '13:11', 'Genesis 6:3', '12', 'Psalm 78:39', 'Isaiah 40:6', 'Romans 8:5–9', '12–13'])
      const hrefs = await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')))
      expect(hrefs.filter((h) => h === '#/book/romans/6/19')).toHaveLength(1)
      expect(hrefs.filter((h) => h?.startsWith('#/book/'))).toHaveLength(12)
      // Each link: aria-haspopup, no aria-label, weight 600, no underline, and the color of its group.
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute('aria-haspopup', 'dialog')
        expect(await link.getAttribute('aria-label')).toBeNull()
      }
      const look = await links.evaluateAll((as) => as.map((a) => [getComputedStyle(a).fontWeight, getComputedStyle(a).textDecorationLine, getComputedStyle(a).color]))
      expect(new Set(look.map((x) => x[0]))).toEqual(new Set(['600']))
      expect(new Set(look.map((x) => x[1]))).toEqual(new Set(['none']))
      // Romans, Hebrews, Genesis, Psalms, and Isaiah: five groups, five colors.
      expect(new Set(look.map((x) => x[2])).size).toBe(5)
    })

    test('"7:23" opens a pop-up with the title "Romans 7:23", the kind line, the text of the verse, and the source line', async ({ page }) => {
      await openChapter(page, vp.size, 'romans', 8)
      const block = await romans8Block(page)
      await block.getByRole('link', { name: '7:23', exact: true }).click()
      const dialog = page.getByRole('dialog', { name: 'Romans 7:23' })
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('.pop-band')).toHaveText('Letters of Paul')
      await expect(dialog.locator('.pop-kind')).toHaveText('Reference in the study note on Romans 8:2')
      await expect(dialog.locator('.pop-text')).toContainText('But I see another law at work in my body')
      await expect(dialog.locator('.pop-first')).toHaveCount(0)
      await expect(dialog.locator('.pop-source')).toHaveText(SOURCE_LINE)
    })

    test('"5–7" opens a pop-up with the title "Romans 5–7" and the label "First verse"', async ({ page }) => {
      await openChapter(page, vp.size, 'romans', 8)
      const block = await romans8Block(page)
      await block.getByRole('link', { name: '5–7', exact: true }).click()
      const dialog = page.getByRole('dialog', { name: 'Romans 5–7' })
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('.pop-first')).toHaveText('First verse')
      await expect(dialog.locator('.pop-text .pop-vn')).toHaveText(['1'])
      await expect(dialog.locator('.pop-text')).toContainText('Therefore, since we have been justified through faith')
    })

    test('"study note on 6:19" opens a pop-up with the note on Romans 6:19 and the short credit, and the references in it are not links', async ({ page }) => {
      await openChapter(page, vp.size, 'romans', 8)
      const block = await romans8Block(page)
      await block.getByRole('link', { name: 'study note on 6:19', exact: true }).click()
      const dialog = page.getByRole('dialog', { name: 'Romans 6:19' })
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('.pop-kind')).toHaveText('Study note, from the notes on Romans 8:3')
      await expect(dialog.locator('.pop-text')).toContainText('I am speaking in human terms')
      const note = dialog.locator('.pop-note')
      await expect(note).toHaveAttribute('data-note', '25719')
      await expect(note.locator('.rd-note-label')).toHaveText('Verse 19')
      await expect(note).toContainText('Paul uses the Greek word')
      await expect(note.locator('.rd-short-credit')).toHaveText(SHORT_CREDIT)
      // The links of the pop-up: the three links of the short credit, and "Go there". No link in the note.
      await expect(note.locator('.rd-study-ref')).toHaveCount(0)
      await expect(dialog.getByRole('link')).toHaveText(['Aquifer Open Study Notes', 'CC BY-SA 4.0', 'Full credit', 'Go there'])
      await expect(dialog.getByRole('link', { name: 'Go there' })).toHaveAttribute('href', '#/book/romans/6/19')
    })

    test('Daniel 11, "study note on Daniel 9:27": each word of the note can be read, with the keyboard also', async ({ page }) => {
      await openChapter(page, vp.size, 'daniel', 11)
      const block = await openBlock(page, 'daniel', 11, 'Notes on verses 21 to 22', 'Notes on verses 21 to 22 of Daniel 11')
      await block.getByRole('link', { name: 'study note on Daniel 9:27', exact: true }).click()
      const dialog = page.getByRole('dialog', { name: 'Daniel 9:27' })
      await expect(dialog).toBeVisible()
      const note = dialog.locator('.pop-note')
      await expect(note).toHaveAttribute('data-note', '10125')
      // The note does not fit: the area scrolls, and takes the keyboard focus.
      const area = dialog.getByRole('region', { name: 'Study note on Daniel 9:27' })
      await expect(area).toHaveAttribute('tabindex', '0')
      // From "Go there", Shift+Tab goes back through the three links of the short credit to the area.
      await expect(dialog.getByRole('link', { name: 'Go there' })).toBeFocused()
      await page.keyboard.press('Shift+Tab', { delay: 20 })
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Shift+Tab')
      await expect(area).toBeFocused()
      await page.keyboard.press('End')
      await expect.poll(() => area.evaluate((el) => Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 1)).toBe(true)
      await expect(note.locator('.rd-short-credit')).toBeInViewport()
      // Each word: the text of the area is the text of the note, and no part of the area is outside the pop-up.
      const box = await dialog.boundingBox()
      const areaBox = await area.boundingBox()
      expect(areaBox!.y).toBeGreaterThanOrEqual(box!.y)
      expect(areaBox!.y + areaBox!.height).toBeLessThanOrEqual(box!.y + box!.height + 1)
      // The text of the area is the note label, the text of note 10125 of daniel.json, and the short credit.
      const file = (await (await page.request.get('./data/study/daniel.json')).json()) as { notes: { id: string; c: unknown[] }[] }
      const textOf = (nodes: unknown[]): string =>
        nodes.map((n) => (typeof n === 'string' ? n : Array.isArray(n) ? textOf(n.slice(1).filter((x) => typeof x === 'string' || Array.isArray(x))) : '')).join('')
      const text = textOf(file.notes.find((n) => n.id === '10125')!.c)
      expect(text.split(/\s+/).length).toBeGreaterThan(350)
      expect(await note.textContent()).toBe(`Verse 27${text}${SHORT_CREDIT}`)
    })

    test('a note link to a note of a different book: Genesis 10:4, "study note on Jonah 1:3"', async ({ page }) => {
      await openChapter(page, vp.size, 'genesis', 10)
      const block = await openBlock(page, 'genesis', 10, 'Notes on verse 4', 'Notes on verse 4 of Genesis 10')
      // The href of the link is the first verse of the note before the page has the study file of Jonah: section 22.11.
      const link = block.getByRole('link', { name: 'study note on Jonah 1:3', exact: true })
      await expect(link).toHaveAttribute('href', '#/book/jonah/1/3')
      await link.click()
      const dialog = page.getByRole('dialog', { name: 'Jonah 1:3' })
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('.pop-band')).toHaveText('Minor Prophets')
      await expect(dialog.getByRole('link', { name: 'Go there' })).toHaveAttribute('href', '#/book/jonah/1/3')
      await expect(dialog.locator('.pop-kind')).toHaveText('Study note, from the notes on Genesis 10:4')
      await expect(dialog.locator('.pop-note .rd-note-label')).toHaveText('Verse 3')
      await expect(dialog.locator('.pop-note .rd-short-credit')).toHaveText(SHORT_CREDIT)
    })

    test('Escape closes the pop-up, and the focus goes back to the link. "Go there" goes to the passage, and the trail gets a step', async ({ page }) => {
      await openChapter(page, vp.size, 'romans', 8)
      const block = await romans8Block(page)
      const link = block.getByRole('link', { name: 'Hebrews 10:6', exact: true })
      await link.click()
      const dialog = page.getByRole('dialog', { name: 'Hebrews 10:6' })
      await expect(dialog).toBeVisible()
      await expect(dialog.getByRole('link', { name: 'Go there' })).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(dialog).toHaveCount(0)
      await expect(link).toBeFocused()

      // The Enter key opens the pop-up also.
      await page.keyboard.press('Enter')
      await expect(dialog).toBeVisible()
      await dialog.getByRole('link', { name: 'Go there' }).click()
      await expect(page).toHaveURL(/#\/book\/hebrews\/10\/6$/)
      await expect(chapter(page, 'hebrews', 10)).toHaveAttribute('data-loaded', 'true')
      const stops = page.getByRole('navigation', { name: 'Trail' }).getByRole('list').getByRole('link')
      // The first stop is the note that has the link: the note on Romans 8:3.
      await expect(stops).toHaveText(['Romans 8:3', 'Hebrews 10:6'])
    })

    for (const [translation, name, words] of [
      ['kjv', 'King James Version', 'But I see another law in my members'],
      ['web', 'World English Bible', 'but I see a different law in my members'],
    ] as const) {
      test(`the ${name}: the pop-up of "7:23" has the text of the selected translation`, async ({ page }) => {
        await page.context().addInitScript((t) => localStorage.setItem('bible-translation', t), translation)
        await openChapter(page, vp.size, 'romans', 8)
        const block = await romans8Block(page)
        await block.getByRole('link', { name: '7:23', exact: true }).click()
        const dialog = page.getByRole('dialog', { name: 'Romans 7:23' })
        await expect(dialog.locator('.pop-text')).toContainText(words)
        await expect(dialog.locator('.pop-text')).toContainText(`(Romans 7:23, ${name})`)
      })
    }

    // A verse that the Berean data has only as a note is a verse of the Berean data: rule 1 of section 22.3, section 22.11.
    test('Mark 9, "44": the pop-up shows the note of the Berean Standard Bible, and the verse of the King James Version', async ({ page }) => {
      await openChapter(page, vp.size, 'mark', 9)
      const block = await openBlock(page, 'mark', 9, 'Notes on verses 43 to 48', 'Notes on verses 43 to 48 of Mark 9')
      const link = block.locator('.rd-study-note[data-note="21631"]').getByRole('link', { name: '44', exact: true })
      await expect(link).toHaveAttribute('href', '#/book/mark/9/44')
      await link.click()
      const dialog = page.getByRole('dialog', { name: 'Mark 9:44' })
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('.pop-kind')).toHaveText('Reference in the study note on Mark 9:43-48')
      // The Berean Standard Bible has the verse as a note, in the color of a verse that is not in the main text.
      await expect(dialog.locator('.pop-text .pop-vn')).toHaveText(['44'])
      await expect(dialog.locator('.pop-text .pop-omitted')).toContainText('BYZ and TR include')
      await expect(dialog.locator('.pop-text')).toContainText('(Mark 9:44, Berean Standard Bible)')
      await page.keyboard.press('Escape')
      await expect(dialog).toHaveCount(0)

      // The King James Version has the verse in the main text.
      // The same address does not load the page again, so the test reloads it.
      await page.evaluate(() => localStorage.setItem('bible-translation', 'kjv'))
      await page.reload()
      await expect(chapter(page, 'mark', 9)).toHaveAttribute('data-loaded', 'true')
      await expect(chapter(page, 'mark', 9)).toHaveAttribute('data-translation', 'kjv')
      const kjvBlock = await openBlock(page, 'mark', 9, 'Notes on verses 43 to 48', 'Notes on verses 43 to 48 of Mark 9')
      await kjvBlock.locator('.rd-study-note[data-note="21631"]').getByRole('link', { name: '44', exact: true }).click()
      const kjv = page.getByRole('dialog', { name: 'Mark 9:44' })
      await expect(kjv.locator('.pop-text .pop-vn')).toHaveText(['44'])
      await expect(kjv.locator('.pop-text .pop-omitted')).toHaveCount(0)
      await expect(kjv.locator('.pop-text')).toContainText('Where their worm dieth not, and the fire is not quenched.')
      await expect(kjv.locator('.pop-text')).toContainText('(Mark 9:44, King James Version)')
    })

    for (const mode of ['light', 'dark'] as const) {
      test(`the automatic accessibility tests on Romans 8 with a block of notes open, and with a pop-up open, ${mode} mode`, async ({ page }) => {
        if (mode === 'dark') await page.context().addInitScript(() => localStorage.setItem('bible-dark-mode', 'on'))
        await openChapter(page, vp.size, 'romans', 8)
        expect(await page.evaluate(() => document.documentElement.getAttribute('data-mode'))).toBe(mode === 'dark' ? 'dark' : null)
        const block = await romans8Block(page)
        const open = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        expect(open.violations).toEqual([])
        await block.getByRole('link', { name: 'study note on 6:19', exact: true }).click()
        await expect(page.getByRole('dialog', { name: 'Romans 6:19' }).locator('.pop-note')).toBeVisible()
        const popup = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        expect(popup.violations).toEqual([])
      })
    }
  })

  test.describe(`a link in "About this chapter" of a psalm, ${vp.name}`, () => {
    test('Psalms 10, with the switch "Study notes" off: a passage link and a note link in the Aquifer note', async ({ page }) => {
      await openChapter(page, vp.size, 'psalms', 10)
      await chapter(page, 'psalms', 10).getByRole('button', { name: 'About this chapter', exact: true }).click()
      const panel = chapter(page, 'psalms', 10).getByRole('region', { name: 'About Psalms 10', exact: true })
      await expect(panel).toBeVisible()
      await expect(panel.locator('a.rd-study-ref')).toHaveText(['Psalm 9:13–20', 'Psalm 10', 'study note on Psalms 9–10'])
      // With the switch off, the page has no study file of Psalms, and the note link has the first verse of its note.
      await expect(panel.getByRole('link', { name: 'study note on Psalms 9–10', exact: true })).toHaveAttribute('href', '#/book/psalms/9/1')
      await panel.getByRole('link', { name: 'Psalm 9:13–20', exact: true }).click()
      const dialog = page.getByRole('dialog', { name: 'Psalms 9:13-20' })
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('.pop-kind')).toHaveText('Reference in the study note on Psalms 10:1-18')
      await expect(dialog.locator('.pop-text .pop-vn')).toHaveText(['13', '14', '15', '16', '17', '18', '19', '20'])
      await page.keyboard.press('Escape')
      await panel.getByRole('link', { name: 'study note on Psalms 9–10', exact: true }).click()
      const note = page.getByRole('dialog', { name: 'Psalms 9:1-10:18' })
      await expect(note).toBeVisible()
      await expect(note.locator('.pop-first')).toHaveText('First verse')
      await expect(note.locator('.pop-note .rd-short-credit')).toHaveText(SHORT_CREDIT)
    })
  })
}
