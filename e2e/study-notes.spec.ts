/// <reference lib="dom" />
// The switch "Study notes" and the study notes at the verses: the notes controls and the blocks of notes.
// docs/DESIGN.md sections 20.6, 20.7, and 20.8, docs/TASKS.md Task 49 step 8. The tests run at 1440 by 900 px and at
// 390 by 844 px.

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }
const VIEWPORTS = [
  { name: '1440 by 900 px', size: WIDE, layout: 'wide' },
  { name: '390 by 844 px', size: NARROW, layout: 'narrow' },
] as const
/** The WCAG rules that axe-core checks, as in a11y.spec.ts. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']
const KEY = 'bible-study-notes'
/** The height of the top bar, in px. */
const BAR_PX = 52

/** The short credit of section 20.6, and its three addresses. */
const SHORT_CREDIT = 'From the Aquifer Open Study Notes, licensed under CC BY-SA 4.0. Full credit'
const SOURCE = 'https://github.com/BibleAquifer/AquiferOpenStudyNotes'
const LICENSE = 'https://creativecommons.org/licenses/by-sa/4.0/'
const SOURCES_PAGE = '#/sources'

const ROMANS_8 = [
  'Notes on verses 1 to 4',
  'Notes on verses 5 to 8',
  'Notes on verses 9 to 11',
  'Notes on verses 12 to 14',
  'Notes on verses 15 to 17',
  'Notes on verses 18 to 21',
  'Notes on verses 22 to 25',
  'Notes on verses 26 to 27',
  'Notes on verses 28 to 30',
  'Notes on verses 31 to 34',
]

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)
const controls = (page: Page, book: string, n: number) => chapter(page, book, n).locator('.rd-study-control')
const control = (page: Page, book: string, n: number, words: string) => chapter(page, book, n).getByRole('button', { name: words, exact: true })
const block = (page: Page, book: string, n: number, name: string) => chapter(page, book, n).getByRole('region', { name, exact: true })

async function openChapter(page: Page, size: { width: number; height: number }, book: string, n: number) {
  await page.setViewportSize(size)
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
  await page.evaluate(() => document.fonts.ready)
}

/** The row "Study notes": in the text list in the wide layout, and in the menu panel in the narrow layout. */
async function studyRow(page: Page, layout: 'wide' | 'narrow') {
  if (layout === 'wide') {
    if (await page.locator('#text-list').isHidden()) await page.getByRole('button', { name: 'Text settings', exact: true }).click()
    return page.locator('#text-list').getByRole('button', { name: 'Study notes', exact: true })
  }
  if (await page.locator('#menu-panel').isHidden()) await page.getByRole('button', { name: 'Menu', exact: true }).click()
  return page.locator('#menu-panel').getByRole('button', { name: 'Study notes', exact: true })
}

const stateOf = (row: Awaited<ReturnType<typeof studyRow>>) => row.locator('.ts-state, .menu-state')

for (const vp of VIEWPORTS) {
  test.describe(`the study notes, ${vp.name}`, () => {
    test('with no stored value: the switch shows "Off", Romans 8 has no notes control, and the page gets no study file', async ({ page }) => {
      const requests: string[] = []
      page.on('request', (r) => {
        if (r.url().includes('/data/study/')) requests.push(r.url())
      })
      await openChapter(page, vp.size, 'romans', 8)
      await expect(controls(page, 'romans', 8)).toHaveCount(0)
      await expect(page.locator('.rd-study')).toHaveCount(0)
      const row = await studyRow(page, vp.layout)
      await expect(row).toHaveAttribute('aria-pressed', 'false')
      await expect(stateOf(row)).toHaveText('Off')
      await page.waitForLoadState('networkidle')
      expect(requests).toEqual([])
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBeNull()
    })

    test('the reader sets the switch on: Romans 8 gets ten controls, each after the last block of its group of blocks, and the setting stays after a new load', async ({ page }) => {
      await openChapter(page, vp.size, 'romans', 8)
      const row = await studyRow(page, vp.layout)
      await row.click()
      await expect(row).toHaveAttribute('aria-pressed', 'true')
      await expect(stateOf(row)).toHaveText('On')
      await expect(controls(page, 'romans', 8)).toHaveText(ROMANS_8.map((w) => `${w} ›`))
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('on')
      // Each control is directly after a text block, and that block has the last verse of the group of blocks.
      const before = await chapter(page, 'romans', 8)
        .locator('.rd-study')
        .evaluateAll((els) => els.map((e) => ({ tag: e.previousElementSibling?.className, verses: [...(e.previousElementSibling?.querySelectorAll('.vn') ?? [])].map((v) => v.textContent) })))
      expect(before.map((b) => b.tag)).toEqual(ROMANS_8.map(() => 'tb tb-p'))
      expect(before.map((b) => b.verses.at(-1))).toEqual(['4', '8', '11', '14', '17', '21', '25', '27', '30', '34'])
      // A control is never inside a line of the Bible text.
      await expect(chapter(page, 'romans', 8).locator('p.tb .rd-study-control')).toHaveCount(0)

      await page.reload()
      await expect(chapter(page, 'romans', 8)).toHaveAttribute('data-loaded', 'true')
      await expect(controls(page, 'romans', 8)).toHaveCount(10)
      const again = await studyRow(page, vp.layout)
      await expect(again).toHaveAttribute('aria-pressed', 'true')
      await expect(stateOf(again)).toHaveText('On')
    })

    test.describe('with the switch on', () => {
      // The value "on" for each page of the context, also the new pages of a test.
      test.beforeEach(async ({ page }) => {
        await page.context().addInitScript((key) => localStorage.setItem(key, 'on'), KEY)
      })

      test('"Notes on verses 1 to 4" of Romans 8 opens a block with four note labels and the short credit, and a second click closes it', async ({ page }) => {
        await openChapter(page, vp.size, 'romans', 8)
        const button = control(page, 'romans', 8, 'Notes on verses 1 to 4')
        await expect(button).toHaveAttribute('aria-expanded', 'false')
        const hidden = page.locator(`[id="${await button.getAttribute('aria-controls')}"]`)
        await expect(hidden).toHaveAttribute('role', 'region')
        await expect(hidden).toHaveAttribute('aria-label', 'Notes on verses 1 to 4 of Romans 8')
        await expect(hidden).toBeHidden()

        await button.click()
        await expect(button).toHaveAttribute('aria-expanded', 'true')
        const region = block(page, 'romans', 8, 'Notes on verses 1 to 4 of Romans 8')
        await expect(region).toBeVisible()
        await expect(region.locator('.rd-note-label')).toHaveText(['Verse 1', 'Verse 2', 'Verse 3', 'Verse 4'])
        const credit = region.locator('.rd-short-credit')
        await expect(credit).toHaveText(SHORT_CREDIT)
        const links = credit.getByRole('link')
        await expect(links).toHaveCount(3)
        const source = credit.getByRole('link', { name: 'Aquifer Open Study Notes, in a new tab', exact: true })
        const license = credit.getByRole('link', { name: 'CC BY-SA 4.0, in a new tab', exact: true })
        const full = credit.getByRole('link', { name: 'Full credit', exact: true })
        await expect(source).toHaveAttribute('href', SOURCE)
        await expect(license).toHaveAttribute('href', LICENSE)
        await expect(full).toHaveAttribute('href', SOURCES_PAGE)
        for (const link of [source, license]) await expect(link).toHaveAttribute('target', '_blank')
        expect(await full.getAttribute('target')).toBeNull()
        // The block has the three links of the credit, and, from Task 55, the 12 links of docs/DESIGN.md section 22.6.
        await expect(region.locator('a:not(.rd-study-ref)')).toHaveCount(3)
        await expect(region.locator('a.rd-study-ref')).toHaveCount(12)

        await button.click()
        await expect(button).toHaveAttribute('aria-expanded', 'false')
        await expect(region).toBeHidden()
      })

      test('the first list item of the note of verse 3 of Romans 8 has the words "the flesh" in italics', async ({ page }) => {
        await openChapter(page, vp.size, 'romans', 8)
        await control(page, 'romans', 8, 'Notes on verses 1 to 4').click()
        const verse3 = block(page, 'romans', 8, 'Notes on verses 1 to 4 of Romans 8').locator('.rd-study-note').nth(2)
        await expect(verse3.locator('.rd-note-label')).toHaveText('Verse 3')
        const em = verse3.locator('li').first().locator('em').first()
        await expect(em).toHaveText('the flesh')
        expect(await em.evaluate((e) => getComputedStyle(e).fontStyle)).toBe('italic')
      })

      test('Psalms 3: three controls, and the note of "About this chapter" is not in a block', async ({ page }) => {
        await openChapter(page, vp.size, 'psalms', 3)
        await expect(controls(page, 'psalms', 3)).toHaveText(['Notes on verse 1 ›', 'Notes on verses 2 to 6 ›', 'Notes on verses 7 to 8 ›'])
        await expect(chapter(page, 'psalms', 3).locator('.rd-study-block [data-note="24356"]')).toHaveCount(0)
        await expect(chapter(page, 'psalms', 3).locator('.rd-notes [data-note="24356"]')).toHaveCount(1)
      })

      test('Psalms 7: the first block has the note label "Title of the psalm"', async ({ page }) => {
        await openChapter(page, vp.size, 'psalms', 7)
        await controls(page, 'psalms', 7).first().click()
        // The notes of a group of blocks are in the order of the source file: the note of verse 1 is before the title note.
        await expect(chapter(page, 'psalms', 7).locator('.rd-study-block').first().locator('.rd-note-label')).toHaveText(['Verse 1', 'Title of the psalm'])
      })

      test('Exodus 36: no notes control', async ({ page }) => {
        await openChapter(page, vp.size, 'exodus', 36)
        await expect(controls(page, 'exodus', 36)).toHaveCount(0)
      })

      test('the notes are the same in the three translations', async ({ page }) => {
        const texts: string[] = []
        for (const id of ['bsb', 'kjv', 'web']) {
          const p = await page.context().newPage()
          await p.addInitScript((t) => localStorage.setItem('bible-translation', t), id)
          await openChapter(p, vp.size, 'romans', 8)
          await expect(chapter(p, 'romans', 8)).toHaveAttribute('data-translation', id)
          await expect(controls(p, 'romans', 8)).toHaveCount(10)
          texts.push(await chapter(p, 'romans', 8).locator('.rd-study').evaluateAll((els) => els.map((e) => e.textContent).join('\n')))
          await p.close()
        }
        expect(texts[0]).toContain('Paul concludes from the arguments')
        expect(texts[1]).toBe(texts[0])
        expect(texts[2]).toBe(texts[0])
      })

      test('Romans 8 with each block open at the width of the test: the page has no horizontal scroll', async ({ page }) => {
        await openChapter(page, vp.size, 'romans', 8)
        for (const words of ROMANS_8) await control(page, 'romans', 8, words).click()
        await expect(chapter(page, 'romans', 8).locator('.rd-study-block:visible')).toHaveCount(10)
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(vp.size.width)
      })

      test('the request for the study file of Romans is stopped: the Bible text, no control, and the chapter shows as loaded', async ({ page }) => {
        let stopped = 0
        await page.route(/\/data\/study\/romans\.json$/, (route) => {
          stopped++
          return route.abort()
        })
        await openChapter(page, vp.size, 'romans', 8)
        expect(stopped).toBeGreaterThan(0)
        await expect(chapter(page, 'romans', 8).locator('.chapter-body .vn[data-verse="39"]')).toHaveCount(1)
        await expect(controls(page, 'romans', 8)).toHaveCount(0)
      })

      for (const mode of ['light', 'dark'] as const) {
        test(`the axe check of Romans 8 with one block open, in the ${mode} mode`, async ({ page }) => {
          await page.emulateMedia({ colorScheme: mode })
          await openChapter(page, vp.size, 'romans', 8)
          expect(await page.evaluate(() => document.documentElement.getAttribute('data-mode'))).toBe(mode === 'dark' ? 'dark' : null)
          await control(page, 'romans', 8, 'Notes on verses 1 to 4').click()
          await expect(block(page, 'romans', 8, 'Notes on verses 1 to 4 of Romans 8')).toBeVisible()
          await page.waitForTimeout(400)
          const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
          expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
        })
      }
    })

    test('the reader sets the switch on and off while verse 20 of Romans 8 is at the top: verse 20 stays at the same place', async ({ page }) => {
      await openChapter(page, vp.size, 'romans', 8)
      const v20 = chapter(page, 'romans', 8).locator('.chapter-body .vn[data-verse="20"]')
      await v20.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 160))
      const top = () => v20.evaluate((el) => el.getBoundingClientRect().top)
      const before = await top()
      expect(before).toBeGreaterThan(BAR_PX)
      const row = await studyRow(page, vp.layout)
      await row.click()
      await expect(controls(page, 'romans', 8)).toHaveCount(10)
      // The control "Notes on verses 1 to 4" and four more are above verse 20.
      await expect.poll(async () => Math.abs((await top()) - before), { message: 'after the change to on' }).toBeLessThanOrEqual(2)
      await row.click()
      await expect(controls(page, 'romans', 8)).toHaveCount(0)
      expect(Math.abs((await top()) - before), 'after the change to off').toBeLessThanOrEqual(2)
    })

    test('"About this chapter" of Romans 8 and of Psalms 3 is the same with the switch on and off', async ({ page }) => {
      const panels: Record<string, string[]> = {}
      for (const [book, n] of [
        ['romans', 8],
        ['psalms', 3],
      ] as const) {
        for (const on of [false, true]) {
          const p = await page.context().newPage()
          if (on) await p.addInitScript((key) => localStorage.setItem(key, 'on'), KEY)
          await openChapter(p, vp.size, book, n)
          if (on) await expect(controls(p, book, n).first()).toBeVisible()
          await chapter(p, book, n).locator('.rd-chapter-control').click()
          const html = await chapter(p, book, n).locator('.rd-notes').evaluate((e) => e.innerHTML.replace(/ id="[^"]*"/g, ''))
          ;(panels[`${book} ${n}`] ??= []).push(html)
          await p.close()
        }
      }
      for (const [key, [off, on]] of Object.entries(panels)) {
        expect(off.length, key).toBeGreaterThan(100)
        expect(on, key).toBe(off)
      }
    })
  })
}

test('Romans 8 at 1440 px with the switch on: after a block opens, each margin label is on the line of its verse', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, 'on'), KEY)
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
  const verse5 = romans.locator('.chapter-body .vn[data-verse="5"]')
  const before = (await verse5.boundingBox())!.y
  await control(page, 'romans', 8, 'Notes on verses 1 to 4').click()
  await expect(block(page, 'romans', 8, 'Notes on verses 1 to 4 of Romans 8')).toBeVisible()
  // The block moves the text down: the check is after the move.
  expect((await verse5.boundingBox())!.y).toBeGreaterThan(before + 300)
  await expect.poll(check).toEqual([])
})
