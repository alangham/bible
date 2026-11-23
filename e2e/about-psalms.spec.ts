/// <reference lib="dom" />
// "About this chapter" of the 132 psalms with no Biblica note: one Aquifer note and the Aquifer credit.
// docs/DESIGN.md sections 20.5, 20.6, and 20.9, docs/TASKS.md Task 48 step 10. The tests run at 1440 by 900 px and at
// 390 by 844 px.

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }
const VIEWPORTS = [
  { name: '1440 by 900 px', size: WIDE },
  { name: '390 by 844 px', size: NARROW },
] as const
/** The WCAG rules that axe-core checks, as in a11y.spec.ts. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

/** The Aquifer credit of section 20.6, and its two addresses. */
const CREDIT =
  'From the Aquifer Open Study Notes, © 2026 Mission Mutual, licensed under CC BY-SA 4.0. They are an adaptation of the Tyndale Open Study Notes, © 2023 Tyndale House Publishers. The words have no changes.'
const SOURCE = 'https://github.com/BibleAquifer/AquiferOpenStudyNotes'
const LICENSE = 'https://creativecommons.org/licenses/by-sa/4.0/'
/** The note credit of section 19.8. */
const BIBLICA_CREDIT = 'From the Biblica Study Notes, © 2023 Biblica Inc., licensed under CC BY-SA 4.0. The words have no changes.'

type Node = string | [string, ...Node[]]
const data = (path: string) => JSON.parse(readFileSync(new URL(`../public/data/${path}`, import.meta.url), 'utf8')) as unknown
const about = (data('study/about-psalms.json') as { psalms: { psalm: number; id: string; c: Node[] }[] }).psalms
const biblica = (data('notes/psalms.json') as { notes: { from: [number, number]; to: [number, number] }[] }).notes

/** The text of each list item of a content, in the order of the content. */
function items(nodes: readonly Node[]): string[] {
  const text = (n: Node): string => (typeof n === 'string' ? n : n.slice(1).map((c) => text(c as Node)).join(''))
  return nodes.flatMap((n) => (typeof n === 'string' ? [] : n[0] === 'li' ? [text(n)] : items(n.slice(1) as Node[])))
}

/** The first psalm whose note has a list. Step 10 selects it from the data. */
const LIST_PSALM = about.find((a) => items(a.c).length > 0)!

const chapter = (page: Page, n: number) => page.locator(`section.rd-chapter[data-book="psalms"][data-chapter="${n}"]`)
const control = (page: Page, n: number) => chapter(page, n).getByRole('button', { name: 'About this chapter', exact: true })
const panel = (page: Page, n: number) => chapter(page, n).getByRole('region', { name: `About Psalms ${n}`, exact: true })

async function openPsalm(page: Page, size: { width: number; height: number }, n: number) {
  await page.setViewportSize(size)
  await page.goto(`./#/book/psalms/${n}`)
  await expect(chapter(page, n)).toHaveAttribute('data-loaded', 'true')
  await page.evaluate(() => document.fonts.ready)
}

test('each of the 150 psalms has a Biblica note or an Aquifer note, and none has the two: the data', () => {
  const withBiblica = new Set<number>()
  for (const n of biblica) for (let p = n.from[0]; p <= n.to[0]; p++) withBiblica.add(p)
  const withAquifer = new Set(about.map((a) => a.psalm))
  expect(withBiblica.size).toBe(18)
  expect(withAquifer.size).toBe(132)
  for (let p = 1; p <= 150; p++) expect(withBiblica.has(p) !== withAquifer.has(p), `Psalms ${p}`).toBe(true)
})

for (const vp of VIEWPORTS) {
  test.describe(`"About this chapter" of the psalms, ${vp.name}`, () => {
    test('Psalms 3: the control on the line of "About this book", and the open panel with one label, one paragraph, and the Aquifer credit', async ({ page }) => {
      await openPsalm(page, vp.size, 3)
      const psalm = chapter(page, 3)
      await expect(psalm.locator('.rd-about-line').first().getByRole('button')).toHaveText([/About this book/, /About this chapter/])
      const [a, b] = [(await psalm.getByRole('button', { name: 'About this book', exact: true }).boundingBox())!, (await control(page, 3).boundingBox())!]
      expect(Math.abs(a.y - b.y)).toBeLessThan(1)
      expect(b.x).toBeGreaterThan(a.x + a.width)

      const region = panel(page, 3)
      await expect(control(page, 3)).toHaveAttribute('aria-expanded', 'false')
      await control(page, 3).click()
      await expect(control(page, 3)).toHaveAttribute('aria-expanded', 'true')
      await expect(region).toBeVisible()
      await expect(region.locator('.rd-range-label')).toHaveText(['Psalms 3:1–8'])
      await expect(region.locator('.rd-note')).toHaveCount(1)
      await expect(region.locator('.rd-note')).toHaveAttribute('data-note', '24356')
      await expect(region.locator('.rd-note p')).toHaveCount(1)
      const credit = region.locator('.rd-note-credit')
      await expect(credit).toHaveText(CREDIT)
      await expect(credit.getByRole('link')).toHaveCount(2)
      const source = credit.getByRole('link', { name: 'Aquifer Open Study Notes, in a new tab', exact: true })
      const license = credit.getByRole('link', { name: 'CC BY-SA 4.0, in a new tab', exact: true })
      await expect(source).toHaveAttribute('href', SOURCE)
      await expect(license).toHaveAttribute('href', LICENSE)
      for (const link of [source, license]) {
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      }
      // A panel never has the two kinds of note.
      await expect(region).not.toContainText('Biblica')
    })

    test('Psalms 42: the open panel has the label "Psalms 42:1–43:5"', async ({ page }) => {
      await openPsalm(page, vp.size, 42)
      await control(page, 42).click()
      await expect(panel(page, 42).locator('.rd-range-label')).toHaveText(['Psalms 42:1–43:5'])
      await expect(panel(page, 42).locator('.rd-note-credit')).toHaveText(CREDIT)
    })

    test(`Psalms ${LIST_PSALM.psalm}, the first psalm whose note has a list: the open panel has the list items of the source, in their order`, async ({ page }) => {
      await openPsalm(page, vp.size, LIST_PSALM.psalm)
      await control(page, LIST_PSALM.psalm).click()
      const list = panel(page, LIST_PSALM.psalm).locator('.rd-note li')
      await expect(list).toHaveText(items(LIST_PSALM.c))
      // The elements have no attribute.
      const attributes = await panel(page, LIST_PSALM.psalm)
        .locator('.rd-note *')
        .evaluateAll((els) => els.filter((e) => e.tagName !== 'H3' && e.attributes.length > 0).map((e) => e.tagName))
      expect(attributes).toEqual([])
    })

    test('Psalms 23: the open panel has the Biblica note and the note credit, and no Aquifer credit', async ({ page }) => {
      await openPsalm(page, vp.size, 23)
      await control(page, 23).click()
      const region = panel(page, 23)
      await expect(region.locator('.rd-note')).not.toHaveCount(0)
      await expect(region.locator('.rd-note-credit')).toHaveText(BIBLICA_CREDIT)
      await expect(region).not.toContainText('Aquifer')
    })

    test('Psalms 2, then Psalms 3 as a later chapter: Psalms 3 has the control, and the control opens the panel of Psalms 3', async ({ page }) => {
      await openPsalm(page, vp.size, 2)
      const later = chapter(page, 3)
      for (let i = 0; i < 60 && !(await later.count()); i++) {
        await page.mouse.wheel(0, 1200)
        await page.waitForTimeout(100)
      }
      await expect(later).toHaveAttribute('data-loaded', 'true')
      await later.scrollIntoViewIfNeeded()
      await expect(later).toHaveAttribute('data-full', 'false')
      await expect(later.locator('.rd-about-line').getByRole('button')).toHaveText([/About this chapter/])
      await control(page, 3).click()
      await expect(panel(page, 3)).toBeVisible()
      await expect(panel(page, 3).locator('.rd-range-label')).toHaveText(['Psalms 3:1–8'])
      await expect(panel(page, 2)).toBeHidden()
    })

    test('5 psalms on the page have the control "About this chapter"', async ({ page }) => {
      for (const n of [1, 3, 23, 119, 150]) {
        const p = await page.context().newPage()
        await openPsalm(p, vp.size, n)
        await expect(control(p, n)).toHaveCount(1)
        await p.close()
      }
    })

    test('the request for about-psalms.json is stopped: Psalms 3 shows the control, and the open panel says "The notes did not load."', async ({ page }) => {
      let stopped = 0
      await page.route(/\/data\/study\/about-psalms\.json$/, (route) => {
        stopped++
        return route.abort()
      })
      await openPsalm(page, vp.size, 3)
      expect(stopped).toBeGreaterThan(0)
      await control(page, 3).click()
      const region = panel(page, 3)
      await expect(region.getByRole('alert')).toHaveText('The notes did not load.')
      await expect(region.locator('.rd-note, .rd-note-credit')).toHaveCount(0)
    })

    test('the Sources page has the words of section 20.9, with the sentence of Task 49, and their links', async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./#/sources')
      const section = page.locator('section[aria-labelledby="sources-notes"]')
      const paragraphs = section.locator('p')
      await expect(paragraphs).toHaveCount(5)
      await expect(paragraphs.nth(2)).toHaveText(
        'The Biblica Study Notes have no text for 132 psalms. For these psalms, the text of “About this chapter” is from the Aquifer Open Study Notes, © 2026 Mission Mutual. The study notes at the verses are from the same source. They are an adaptation of the Tyndale Open Study Notes, © 2023 Tyndale House Publishers. The license of both is CC BY-SA 4.0.',
      )
      await expect(paragraphs.nth(3)).toHaveText(
        'The site got the files from the repository BibleAquifer/AquiferOpenStudyNotes on GitHub, version 1.1.2. The site shows the words of the notes with no change. It does not show the links of the files.',
      )
      await expect(paragraphs.nth(4)).toHaveText('Biblica, Mission Mutual, and Tyndale House Publishers have no connection with this site.')
      const links = section.locator('p:nth-of-type(n+3) a')
      await expect(links).toHaveText(['Aquifer Open Study Notes', 'CC BY-SA 4.0', 'BibleAquifer/AquiferOpenStudyNotes'])
      expect(await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')))).toEqual([SOURCE, LICENSE, SOURCE])
    })

    for (const mode of ['light', 'dark'] as const) {
      test(`the axe check of Psalms 3 with the panel open, in the ${mode} mode`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: mode })
        await openPsalm(page, vp.size, 3)
        expect(await page.evaluate(() => document.documentElement.getAttribute('data-mode'))).toBe(mode === 'dark' ? 'dark' : null)
        await control(page, 3).click()
        await expect(panel(page, 3)).toBeVisible()
        await page.waitForTimeout(400)
        const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
      })
    }
  })
}

test('Psalms 3 with the panel open at 390 px: the page has no horizontal scroll', async ({ page }) => {
  await openPsalm(page, NARROW, 3)
  await control(page, 3).click()
  await expect(panel(page, 3)).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test(`Psalms ${LIST_PSALM.psalm} with the panel open at 390 px: the page has no horizontal scroll`, async ({ page }) => {
  await openPsalm(page, NARROW, LIST_PSALM.psalm)
  await control(page, LIST_PSALM.psalm).click()
  await expect(panel(page, LIST_PSALM.psalm)).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})
