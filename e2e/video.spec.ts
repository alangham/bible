/// <reference lib="dom" />
// The line "Video" in "About this book", and the section "Videos" of the Sources page.
// docs/DESIGN.md section 17, docs/TASKS.md Task 42 step 9.

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator, type Page } from '@playwright/test'

/** The WCAG rules of a11y.spec.ts: WCAG 2.0, 2.1, and 2.2, levels A and AA. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

const LAYOUTS = [
  { name: 'wide', viewport: { width: 1440, height: 900 } },
  { name: 'narrow', viewport: { width: 390, height: 844 } },
]

const WATCH = 'https://www.youtube.com/watch?v='
/** The video ids of section 17.5 that the tests name. */
const ROW = {
  otSummary: 'ALsluAKBZ-c', // Old Testament, row 1
  ntSummary: 'Q0BrP8bqj0c', // New Testament, row 1
  matthew1: '3Dv4-n6OYGI', // New Testament, row 2
  matthew2: 'GGCF3OPWN14', // New Testament, row 3
  mark: 'HGHqu9-DtXk', // New Testament, row 4
  kings: 'bVFW3wbi9pk', // Old Testament, row 13
}
/** The credit of section 17.3, with no change. */
const CREDIT = 'BibleProject is the author and owner of this content. To find more BibleProject resources, visit bibleproject.com.'
const CREDIT_HREF = 'https://www.bibleproject.com/'
/** The secondary ink color of the reading page, --ink-secondary. */
const SECONDARY = 'rgb(110, 110, 115)'

/** Opens a chapter and "About this book" of its first heading. */
async function openAbout(page: Page, id: string, n: number) {
  await page.goto(`./#/book/${id}/${n}`)
  await expect(page.locator(`section.rd-chapter[data-chapter="${n}"]`).first()).toHaveAttribute('data-loaded', 'true')
  await page.getByRole('button', { name: 'About this book' }).first().click()
  const about = page.getByRole('region', { name: 'About this book' }).first()
  await expect(about.locator('dt').first()).toHaveText('What it is')
  return about
}

const videoLine = (about: Locator) => about.locator('.rd-fact').filter({ has: about.page().locator('dt', { hasText: /^Video$/ }) })
const videoLinks = (line: Locator) => line.locator('a.rd-video-link')
const credit = (line: Locator) => line.locator('p.rd-video-credit')

/** The text of an element, with the white space made one space. */
const visibleText = (l: Locator) => l.evaluate((e) => e.textContent!.replace(/\s+/g, ' ').trim())

for (const layout of LAYOUTS) {
  test.describe(`the line "Video", ${layout.name} layout`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(layout.viewport)
    })

    test('Mark: the line "Video" is below "Where", with one link to row 4 of the New Testament playlist, and the credit below it', async ({ page }) => {
      const about = await openAbout(page, 'mark', 1)
      await expect(about.locator('dt')).toHaveText(['What it is', 'Author', 'Written', 'Where', 'Video'])
      const line = videoLine(about)
      await expect(videoLinks(line)).toHaveCount(1)
      expect(await visibleText(videoLinks(line).first())).toBe('BibleProject overview ›')
      await expect(videoLinks(line).first()).toHaveAttribute('href', WATCH + ROW.mark)
      await expect(credit(line)).toHaveCount(1)
      expect(await visibleText(credit(line))).toBe(CREDIT)
      // The credit is below the link.
      const linkBox = (await videoLinks(line).first().boundingBox())!
      const creditBox = (await credit(line).boundingBox())!
      expect(creditBox.y).toBeGreaterThan(linkBox.y + linkBox.height - 0.5)
    })

    test('Matthew: two links, part 1 above part 2, to rows 2 and 3 of the New Testament playlist, and one credit below them', async ({ page }) => {
      const about = await openAbout(page, 'matthew', 1)
      const line = videoLine(about)
      const links = videoLinks(line)
      await expect(links).toHaveCount(2)
      expect(await visibleText(links.nth(0))).toBe('BibleProject overview, part 1 ›')
      expect(await visibleText(links.nth(1))).toBe('BibleProject overview, part 2 ›')
      await expect(links.nth(0)).toHaveAttribute('href', WATCH + ROW.matthew1)
      await expect(links.nth(1)).toHaveAttribute('href', WATCH + ROW.matthew2)
      const one = (await links.nth(0).boundingBox())!
      const two = (await links.nth(1).boundingBox())!
      expect(two.y).toBeGreaterThanOrEqual(one.y + one.height - 0.5)
      await expect(credit(line)).toHaveCount(1)
      expect((await credit(line).boundingBox())!.y).toBeGreaterThan(two.y + two.height - 0.5)
    })

    test('1 Kings and 2 Kings: the same address, and the credit starts with the sentence of the shared video', async ({ page }) => {
      for (const id of ['1-kings', '2-kings']) {
        const line = videoLine(await openAbout(page, id, 1))
        await expect(videoLinks(line)).toHaveCount(1)
        await expect(videoLinks(line).first()).toHaveAttribute('href', WATCH + ROW.kings)
        expect(await visibleText(credit(line))).toBe(`The video covers 1 and 2 Kings. ${CREDIT}`)
      }
    })

    test('3 John: the credit starts with "The video covers 1, 2, and 3 John."', async ({ page }) => {
      const line = videoLine(await openAbout(page, '3-john', 1))
      expect(await visibleText(credit(line))).toBe(`The video covers 1, 2, and 3 John. ${CREDIT}`)
    })

    test('Philemon: the line "Video" is below "Written", and the book has no line "Where"', async ({ page }) => {
      const about = await openAbout(page, 'philemon', 1)
      await page.waitForLoadState('networkidle')
      await expect(about.locator('dt')).toHaveText(['What it is', 'Author', 'Written', 'Video'])
      await expect(videoLinks(videoLine(about))).toHaveCount(1)
    })

    test('Matthew: the credit is 10 px below the last link, 14 px, gray, with a line of 2 px at its left, and a link to bibleproject.com', async ({ page }) => {
      const line = videoLine(await openAbout(page, 'matthew', 1))
      await page.evaluate(() => document.fonts.ready)
      const last = (await videoLinks(line).last().boundingBox())!
      const box = (await credit(line).boundingBox())!
      expect(Math.abs(box.y - (last.y + last.height) - 10)).toBeLessThanOrEqual(0.5)
      const style = await credit(line).evaluate((e) => {
        const s = getComputedStyle(e)
        return { size: s.fontSize, color: s.color, line: s.borderLeftWidth, lineStyle: s.borderLeftStyle }
      })
      expect(style).toEqual({ size: '14px', color: SECONDARY, line: '2px', lineStyle: 'solid' })
      const link = credit(line).getByRole('link')
      await expect(link).toHaveCount(1)
      expect(await visibleText(link)).toBe('bibleproject.com')
      await expect(link).toHaveAttribute('href', CREDIT_HREF)
    })

    test('each link of the line opens in a new tab, and the name of a link to a video ends with "on YouTube, in a new tab"', async ({ page }) => {
      for (const id of ['matthew', '2-kings']) {
        const line = videoLine(await openAbout(page, id, 1))
        const links = line.getByRole('link')
        for (const link of await links.all()) {
          await expect(link).toHaveAttribute('target', '_blank')
          await expect(link).toHaveAttribute('rel', /\bnoopener\b/)
        }
        for (const link of await videoLinks(line).all()) await expect(link).toHaveAttribute('aria-label', /, on YouTube, in a new tab$/)
        if (id === 'matthew') {
          await expect(line.getByRole('link', { name: 'BibleProject overview, part 1, on YouTube, in a new tab', exact: true })).toHaveCount(1)
          await expect(line.getByRole('link', { name: 'BibleProject overview, part 2, on YouTube, in a new tab', exact: true })).toHaveCount(1)
        } else {
          await expect(line.getByRole('link', { name: 'BibleProject overview, on YouTube, in a new tab', exact: true })).toHaveCount(1)
        }
        await expect(line.getByRole('link', { name: 'bibleproject.com, in a new tab', exact: true })).toHaveCount(1)
      }
    })

    test('Matthew: with "About this book" open, the read-with list is 16 px below the facts. Closed, it is 6 px below the control', async ({ page }) => {
      await page.goto('./#/book/matthew/1')
      const chapter = page.locator('section.rd-chapter[data-chapter="1"]').first()
      await expect(chapter).toHaveAttribute('data-loaded', 'true')
      const readWith = chapter.locator('.rd-read-with')
      await expect(readWith).toBeVisible()
      const control = chapter.getByRole('button', { name: 'About this book' })
      const closed = (await control.boundingBox())!
      expect(Math.abs((await readWith.boundingBox())!.y - (closed.y + closed.height) - 6)).toBeLessThanOrEqual(0.5)
      await control.click()
      const facts = chapter.locator('.rd-facts')
      await expect(facts).toBeVisible()
      const f = (await facts.boundingBox())!
      expect(Math.abs((await readWith.boundingBox())!.y - (f.y + f.height) - 16)).toBeLessThanOrEqual(0.5)
    })

    test('Matthew and 2 Kings: the axe check with "About this book" open', async ({ page }) => {
      for (const id of ['matthew', '2-kings']) {
        const about = await openAbout(page, id, 1)
        await expect(videoLinks(videoLine(about)).first()).toBeVisible()
        await page.waitForLoadState('networkidle')
        const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        expect(result.violations.flatMap((v) => v.nodes.map((n) => `${id} ${v.id}: ${n.target.join(' ')}`))).toEqual([])
      }
    })

    test('Matthew: the line is the same after a change of the translation to the King James Version', async ({ page }) => {
      const before = await videoLine(await openAbout(page, 'matthew', 1)).evaluate((e) => e.outerHTML)
      await page.getByRole('button', { name: /^Translation: / }).click()
      await page.locator('#translation-list').getByRole('group', { name: 'Translation' }).getByRole('button', { name: 'King James Version' }).click()
      const chapter = page.locator('section.rd-chapter[data-chapter="1"]').first()
      await expect(chapter).toHaveAttribute('data-translation', 'kjv')
      await expect(chapter).toHaveAttribute('data-loaded', 'true')
      await expect(page.getByRole('button', { name: /^Translation: / })).toHaveAccessibleName('Translation: King James Version, KJV')
      const control = page.getByRole('button', { name: 'About this book' }).first()
      if ((await control.getAttribute('aria-expanded')) !== 'true') await control.click()
      const about = page.getByRole('region', { name: 'About this book' }).first()
      expect(await videoLine(about).evaluate((e) => e.outerHTML)).toBe(before)
    })
  })
}

test.describe('the line "Video" at 390 by 844 px', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  for (const id of ['matthew', '2-kings']) {
    test(`${id}: each link to a video is one line, 24 px high, and the line "Video" stays in its column`, async ({ page }) => {
      const line = videoLine(await openAbout(page, id, 1))
      await page.evaluate(() => document.fonts.ready)
      for (const link of await videoLinks(line).all()) {
        // One line: the words and the sign "›" have their middle at the same height.
        const middles = await link.evaluate((e) => {
          const range = document.createRange()
          range.selectNodeContents(e.firstChild!)
          const words = [...range.getClientRects()]
          const sign = e.querySelector('[aria-hidden]')!.getBoundingClientRect()
          return { lines: words.length, words: (words[0].top + words[0].bottom) / 2, sign: (sign.top + sign.bottom) / 2 }
        })
        expect(middles.lines).toBe(1)
        expect(Math.abs(middles.words - middles.sign)).toBeLessThanOrEqual(2)
        expect((await link.boundingBox())!.height).toBe(24)
      }
      const out = await line.evaluate((row) => {
        const column = row.closest('.rd-about')!.getBoundingClientRect()
        return [row, ...row.querySelectorAll('*')]
          .map((e) => ({ e, r: e.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 1 && (r.left < column.left - 0.5 || r.right > column.right + 0.5))
          .map(({ e, r }) => `${e.className || e.tagName} ${r.left.toFixed(1)} ${r.right.toFixed(1)} column ${column.left} ${column.right}`)
      })
      expect(out).toEqual([])
    })
  }
})

test('Matthew, with "About this book" open: the page makes no request to a different host', async ({ page, baseURL }) => {
  const hosts = new Set<string>()
  page.on('request', (r) => {
    if (!r.url().startsWith('data:')) hosts.add(new URL(r.url()).host)
  })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openAbout(page, 'matthew', 1)
  await page.waitForLoadState('networkidle')
  expect([...hosts]).toEqual([new URL(baseURL!).host])
})

for (const layout of LAYOUTS) {
  test(`the Sources page: the section "Videos" is after "Places" and before "Fonts", with the summary videos and the credit, ${layout.name} layout`, async ({
    page,
  }) => {
    await page.setViewportSize(layout.viewport)
    await page.goto('./#/sources')
    await expect(page.locator('#sources-videos')).toBeVisible()
    const ids = await page.locator('main section h2').evaluateAll((els) => els.map((e) => e.id))
    const at = ids.indexOf('sources-videos')
    expect(ids.slice(at - 1, at + 2)).toEqual(['sources-places', 'sources-videos', 'sources-fonts'])
    const videos = page.locator('section[aria-labelledby="sources-videos"]')
    await expect(videos.getByRole('heading', { level: 2 })).toHaveText('Videos')
    const paragraphs = videos.locator('p')
    await expect(paragraphs).toHaveCount(3)
    await expect(paragraphs.nth(0)).toHaveText(
      'Each book has a link to a video about the book. The link is in “About this book”. The videos are by BibleProject, and each link opens a video on YouTube. A video gives the view of BibleProject. The introductions of this site do not come from the videos. BibleProject has no connection with this site.',
    )
    await expect(paragraphs.nth(0).getByRole('link')).toHaveCount(0)
    await expect(paragraphs.nth(1)).toHaveText('BibleProject also has a video about each part of the Bible:')
    const ot = videos.getByRole('link', { name: 'Old Testament overview, on YouTube, in a new tab', exact: true })
    const nt = videos.getByRole('link', { name: 'New Testament overview, on YouTube, in a new tab', exact: true })
    await expect(ot).toHaveAttribute('href', WATCH + ROW.otSummary)
    await expect(nt).toHaveAttribute('href', WATCH + ROW.ntSummary)
    expect(await visibleText(paragraphs.nth(2))).toBe(CREDIT)
    const creditLink = paragraphs.nth(2).getByRole('link', { name: 'bibleproject.com, in a new tab', exact: true })
    await expect(creditLink).toHaveAttribute('href', CREDIT_HREF)
    for (const link of [ot, nt, creditLink]) {
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /\bnoopener\b/)
    }
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
    expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
  })
}
