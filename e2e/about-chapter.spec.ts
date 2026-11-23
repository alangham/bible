/// <reference lib="dom" />
// "About this chapter": the control, the panel with the Biblica notes, and the note credit.
// docs/DESIGN.md section 19, docs/TASKS.md Task 47 step 10. The tests run at 1440 by 900 px and at 390 by 844 px.

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }
const VIEWPORTS = [
  { name: '1440 by 900 px', size: WIDE },
  { name: '390 by 844 px', size: NARROW },
] as const
/** The WCAG rules that axe-core checks, as in a11y.spec.ts. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

/** The note credit of section 19.8, and its two addresses. */
const CREDIT = 'From the Biblica Study Notes, © 2023 Biblica Inc., licensed under CC BY-SA 4.0. The words have no changes.'
const SOURCE = 'https://github.com/BibleAquifer/BiblicaStudyNotes'
const LICENSE = 'https://creativecommons.org/licenses/by-sa/4.0/'

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)
const control = (page: Page, book: string, n: number) => chapter(page, book, n).getByRole('button', { name: 'About this chapter', exact: true })
/** The panel of a chapter, by its name "About <book> <chapter>". */
const panel = (page: Page, book: string, n: number, name: string) => chapter(page, book, n).getByRole('region', { name: `About ${name} ${n}`, exact: true })

async function openChapter(page: Page, size: { width: number; height: number }, book: string, n: number) {
  await page.setViewportSize(size)
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
  await page.evaluate(() => document.fonts.ready)
}

for (const vp of VIEWPORTS) {
  test.describe(`"About this chapter", ${vp.name}`, () => {
    test('Genesis 22: the control on the line of "About this book", the panel closed at the load, and a click opens and closes it', async ({ page }) => {
      await openChapter(page, vp.size, 'genesis', 22)
      const about = chapter(page, 'genesis', 22).getByRole('button', { name: 'About this book', exact: true })
      const button = control(page, 'genesis', 22)
      // The two controls are on one line: the same parent line, and the same top.
      await expect(chapter(page, 'genesis', 22).locator('.rd-about-line').first().getByRole('button')).toHaveText([/About this book/, /About this chapter/])
      const [a, b] = [(await about.boundingBox())!, (await button.boundingBox())!]
      expect(Math.abs(a.y - b.y)).toBeLessThan(1)
      expect(b.x).toBeGreaterThan(a.x + a.width)

      // A hidden panel has no role for getByRole, so the test finds it by aria-controls of the control.
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      const hidden = page.locator(`[id="${await button.getAttribute('aria-controls')}"]`)
      await expect(hidden).toHaveAttribute('role', 'region')
      await expect(hidden).toHaveAttribute('aria-label', 'About Genesis 22')
      await expect(hidden).toBeHidden()
      const region = panel(page, 'genesis', 22, 'Genesis')

      await button.click()
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await expect(region).toBeVisible()
      await expect(region.locator('.rd-range-label')).toHaveText(['Genesis 21:1–22:24'])
      await expect(region.locator('.rd-note p')).toHaveCount(3)
      const credit = region.locator('.rd-note-credit')
      await expect(credit).toHaveText(CREDIT)
      await expect(credit.getByRole('link')).toHaveCount(2)
      const source = credit.getByRole('link', { name: 'Biblica Study Notes, in a new tab', exact: true })
      const license = credit.getByRole('link', { name: 'CC BY-SA 4.0, in a new tab', exact: true })
      await expect(source).toHaveAttribute('href', SOURCE)
      await expect(license).toHaveAttribute('href', LICENSE)
      for (const link of [source, license]) await expect(link).toHaveAttribute('target', '_blank')

      await button.click()
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await expect(region).toBeHidden()
      // "About this book" did not open.
      await expect(about).toHaveAttribute('aria-expanded', 'false')
    })

    test('Romans 8: the open panel has three range labels, in the order of the Bible', async ({ page }) => {
      await openChapter(page, vp.size, 'romans', 8)
      await control(page, 'romans', 8).click()
      await expect(panel(page, 'romans', 8, 'Romans').locator('.rd-range-label')).toHaveText(['Romans 8:1–17', 'Romans 8:18–25', 'Romans 8:26–39'])
    })

    test('Psalms 3: the chapter has no control "About this chapter", and its line below the heading does not change', async ({ page }) => {
      await openChapter(page, vp.size, 'psalms', 3)
      const psalm = chapter(page, 'psalms', 3)
      await expect(psalm.getByRole('button', { name: 'About this chapter' })).toHaveCount(0)
      await expect(psalm.locator('.rd-notes, .rd-chapter-control')).toHaveCount(0)
      await expect(page.getByRole('button', { name: 'About this chapter' })).toHaveCount(0)
      await expect(psalm.locator('.rd-about-line').getByRole('button')).toHaveText([/About this book/])
    })

    test('Genesis 21, then Genesis 22 as a later chapter: the control alone, and each chapter has its own panel', async ({ page }) => {
      await openChapter(page, vp.size, 'genesis', 21)
      const later = chapter(page, 'genesis', 22)
      for (let i = 0; i < 60 && !(await later.count()); i++) {
        await page.mouse.wheel(0, 1200)
        await page.waitForTimeout(100)
      }
      await expect(later).toHaveAttribute('data-loaded', 'true')
      await later.scrollIntoViewIfNeeded()
      await expect(later).toHaveAttribute('data-full', 'false')
      await expect(later.getByRole('button', { name: 'About this book' })).toHaveCount(0)
      await expect(later.locator('.rd-about-line').getByRole('button')).toHaveText([/About this chapter/])
      // The control is below the heading and above the read-with list.
      const heading = (await later.locator('.rd-heading').boundingBox())!
      const button = (await control(page, 'genesis', 22).boundingBox())!
      const readWith = (await later.locator('.rd-read-with').boundingBox())!
      expect(button.y).toBeGreaterThan(heading.y + heading.height - 1)
      expect(readWith.y).toBeGreaterThan(button.y + button.height - 1)

      await control(page, 'genesis', 22).click()
      await expect(panel(page, 'genesis', 22, 'Genesis')).toBeVisible()
      await expect(panel(page, 'genesis', 22, 'Genesis').locator('.rd-range-label')).toHaveText(['Genesis 21:1–22:24'])
      await expect(control(page, 'genesis', 21)).toHaveAttribute('aria-expanded', 'false')
      await expect(panel(page, 'genesis', 21, 'Genesis')).toBeHidden()
    })

    test('the open panel of Genesis 22 has the same words in the three translations', async ({ page }) => {
      const words: string[] = []
      for (const id of ['bsb', 'kjv', 'web']) {
        // A new page for each translation, with the translation in the storage before the load.
        const p = await page.context().newPage()
        await p.addInitScript((t) => localStorage.setItem('bible-translation', t), id)
        await openChapter(p, vp.size, 'genesis', 22)
        await expect(chapter(p, 'genesis', 22)).toHaveAttribute('data-translation', id)
        await control(p, 'genesis', 22).click()
        words.push(await panel(p, 'genesis', 22, 'Genesis').innerText())
        await p.close()
      }
      expect(words[0]).toContain('Genesis 21:1–22:24')
      expect(words[1]).toBe(words[0])
      expect(words[2]).toBe(words[0])
    })

    test('the notes file of Genesis does not load: the control shows, and the open panel says "The notes did not load."', async ({ page }) => {
      let stopped = 0
      await page.route(/\/data\/notes\/genesis\.json$/, (route) => {
        stopped++
        return route.abort()
      })
      await openChapter(page, vp.size, 'genesis', 22)
      expect(stopped).toBeGreaterThan(0)
      await control(page, 'genesis', 22).click()
      const region = panel(page, 'genesis', 22, 'Genesis')
      await expect(region.getByRole('alert')).toHaveText('The notes did not load.')
      await expect(region.locator('.rd-note, .rd-note-credit')).toHaveCount(0)
    })

    test('the Sources page: the section "Notes on the chapters" after "Book introductions", with its three links', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./#/sources')
      await expect(page.locator('#sources-notes')).toHaveText('Notes on the chapters')
      const ids = await page.locator('main section h2').evaluateAll((els) => els.map((e) => e.id))
      expect(ids[ids.indexOf('sources-notes') - 1]).toBe('sources-introductions')
      const section = page.locator('section[aria-labelledby="sources-notes"]')
      await expect(section.locator('p')).toHaveText([
        'The text of “About this chapter” is from the Biblica Study Notes, © 2023 Biblica Inc. The license is the Creative Commons Attribution-ShareAlike 4.0 International license (CC BY-SA 4.0).',
        'The site got the files from the repository BibleAquifer/BiblicaStudyNotes on GitHub, version 1.1.2. The site shows the words of the notes with no change. It does not show the links to the key terms of the files.',
        'The notes have no text for 132 psalms. Biblica has no connection with this site.',
      ])
      const links = section.getByRole('link')
      await expect(links).toHaveText(['Biblica Study Notes', 'CC BY-SA 4.0', 'BibleAquifer/BiblicaStudyNotes'])
      expect(await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')))).toEqual([SOURCE, LICENSE, SOURCE])
    })

    for (const mode of ['light', 'dark'] as const) {
      test(`the axe check of Genesis 22 with the panel open, in the ${mode} mode`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: mode })
        await openChapter(page, vp.size, 'genesis', 22)
        expect(await page.evaluate(() => document.documentElement.getAttribute('data-mode'))).toBe(mode === 'dark' ? 'dark' : null)
        await control(page, 'genesis', 22).click()
        await expect(panel(page, 'genesis', 22, 'Genesis')).toBeVisible()
        await page.waitForTimeout(400)
        const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
      })
    }
  })
}

test('Romans 8 with the panel open at 390 px: the page has no horizontal scroll', async ({ page }) => {
  await openChapter(page, NARROW, 'romans', 8)
  await control(page, 'romans', 8).click()
  await expect(panel(page, 'romans', 8, 'Romans')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('Romans 8 at 1440 px: after the panel opens, each margin label is on the line of its verse', async ({ page }) => {
  await openChapter(page, WIDE, 'romans', 8)
  const romans = chapter(page, 'romans', 8)
  await expect(romans).toHaveAttribute('data-labels-ready', 'true')
  const check = () =>
    romans.evaluate((s) => {
      const out: string[] = []
      let prevBottom = -Infinity
      for (const label of s.querySelectorAll<HTMLElement>('.rd-label')) {
        const v = label.querySelector('.rd-label-verse')!.textContent!.replace(/\D/g, '')
        const number = s.querySelector<HTMLElement>(`.chapter-body .vn[data-verse="${v}"]`)!
        const top = label.getBoundingClientRect().top
        const verse = number.getBoundingClientRect().top
        // On the line of its verse number, with the tolerance of e2e/links.spec.ts. Where two labels meet, the lower label is directly below the upper label.
        const onLine = Math.abs(top - verse) < 12
        const below = top >= prevBottom - 0.5 && top <= prevBottom + 3
        if (!onLine && !below) out.push(`verse ${v}: label ${top}, verse number ${verse}`)
        prevBottom = label.getBoundingClientRect().bottom
      }
      return out
    })
  expect(await romans.locator('.rd-label').count()).toBeGreaterThan(5)
  const firstVerse = romans.locator('.chapter-body .vn').first()
  const before = (await firstVerse.boundingBox())!.y
  await control(page, 'romans', 8).click()
  await expect(panel(page, 'romans', 8, 'Romans')).toBeVisible()
  // The panel moves the text down: the check is after the move.
  expect((await firstVerse.boundingBox())!.y).toBeGreaterThan(before + 500)
  await expect.poll(check).toEqual([])
})
