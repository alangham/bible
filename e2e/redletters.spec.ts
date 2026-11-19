/// <reference lib="dom" />
// Red letters: the pages and the switch. docs/DESIGN.md section 11, docs/TASKS.md Task 27 step 9.
// The tests run at 1440 by 900 px and at 390 by 844 px, unless a test gives a size.

import { readFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }
const VIEWPORTS = [
  { name: '1440 by 900 px', size: WIDE },
  { name: '390 by 844 px', size: NARROW },
] as const
const TRANSLATIONS = ['bsb', 'kjv', 'web'] as const
type Translation = (typeof TRANSLATIONS)[number]
const KEY = 'bible-red-letters'

/** The color of red letters, docs/DESIGN.md section 11.4, as the browser gives it. */
const RED = 'rgb(139, 26, 26)'
/** The ink color of the Bible text, --ink. */
const INK = 'rgb(29, 29, 31)'
/** The color of the group "Gospels". */
const GOSPELS = 'rgb(38, 130, 139)'
/** The WCAG rules that axe-core checks, as in a11y.spec.ts. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

/**
 * The line breaks of the Task 26 build, before red letters, for each paragraph of Matthew 4 and John 14. One
 * list for each paragraph: for each line after the first, the number of characters before its first word,
 * without the spaces. I measured them on the build of commit 63ee575 with the method of lineStarts below.
 * The four keys "web" are of the build of Task 31, with red letters off. With red letters on, that build gave
 * the same line starts. The World English Bible has no build before red letters.
 */
const BREAKS = JSON.parse(readFileSync(new URL('./redletters-breaks.json', import.meta.url), 'utf8')) as Record<string, number[][]>

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)
const isWide = (page: Page) => (page.viewportSize()?.width ?? 0) >= 900
const textControl = (page: Page) => page.getByRole('button', { name: 'Text settings', exact: true })
const textList = (page: Page) => page.locator('#text-list')
const menu = (page: Page) => page.getByRole('button', { name: 'Menu', exact: true })
const menuPanel = (page: Page) => page.locator('#menu-panel')
/** The red letters switch: the row in the text list in the wide layout, the row in the menu panel in the narrow layout. */
const redRow = (page: Page) => (isWide(page) ? textList(page) : menuPanel(page)).getByRole('button', { name: 'Red letters', exact: true })

/** Opens a chapter in a translation, with a stored value of the red letters switch, or with no stored value. */
async function openChapter(page: Page, size: { width: number; height: number }, book: string, n: number, opts: { translation?: Translation; red?: 'on' | 'off' } = {}) {
  const translation = opts.translation ?? 'bsb'
  await page.setViewportSize(size)
  await page.goto('./#/')
  await page.evaluate(
    ([key, t, red]) => {
      localStorage.setItem('bible-translation', t)
      if (red) localStorage.setItem(key, red)
      else localStorage.removeItem(key)
    },
    [KEY, translation, opts.red ?? null] as const,
  )
  await page.goto(`./#/book/${book}/${n}`)
  await page.reload()
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
  await expect(chapter(page, book, n)).toHaveAttribute('data-translation', translation)
  await page.evaluate(() => document.fonts.ready)
}

/** Opens the text list or the menu panel, so that the red letters switch is visible. */
async function openSwitch(page: Page) {
  if (isWide(page)) {
    await textControl(page).click()
    await expect(textList(page)).toBeVisible()
  } else {
    await menu(page).click()
    await expect(menuPanel(page)).toBeVisible()
  }
}

/** Opens the text list or the menu panel, selects the red letters switch, and closes the list or the panel. */
async function toggleRed(page: Page) {
  await openSwitch(page)
  await redRow(page).click()
  await page.keyboard.press('Escape')
  await expect(isWide(page) ? textList(page) : menuPanel(page)).toBeHidden()
}

/**
 * The text of a verse in a section, as the text nodes between its verse number and the next verse number,
 * with the color and the font style of each. The link controls and the text for a screen reader are not words.
 */
function verseNodes(section: Locator, v: number) {
  return section.evaluate((el, v) => {
    const body = el.querySelector('.chapter-body')!
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
    const out: { text: string; color: string; fontStyle: string }[] = []
    let current = 0
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (node instanceof HTMLElement) {
        if (node.classList.contains('vn')) current = Number(node.dataset.verse)
        continue
      }
      const parent = node.parentElement!
      if (current !== v || parent.closest('button, .sr-only, .vn, h3, h4, .link-line')) continue
      const style = getComputedStyle(parent)
      out.push({ text: node.textContent ?? '', color: style.color, fontStyle: style.fontStyle })
    }
    return out
  }, v)
}

/** The color and the font style of the words in a verse. The words must be in one text node. */
async function wordsStyle(section: Locator, v: number, words: string) {
  const nodes = (await verseNodes(section, v)).filter((n) => n.text.includes(words))
  expect(nodes, `the words "${words}" in verse ${v}`).toHaveLength(1)
  return nodes[0]
}

/** The elements in the color of red letters, in a part of the page. */
const redElements = (where: Locator) =>
  where.evaluate((el, red) => [el, ...el.querySelectorAll('*')].filter((x) => getComputedStyle(x).color === red).map((x) => x.outerHTML.slice(0, 80)), RED)

/**
 * For each paragraph of a chapter: the line starts, as the number of characters before the first word of each
 * line after the first, without the spaces. The verse numbers, the link controls, and the margin labels are
 * not words. A word is on a new line when its top is more than 4 px below the top of the line before.
 */
function lineStarts(section: Locator) {
  return section.evaluate((el) => {
    const skip = (n: Node) => n.parentElement!.closest('button, .sr-only, .vn, .rd-label, .rd-labels')
    return [...el.querySelectorAll('.chapter-body p.tb')].map((p) => {
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT)
      const starts: number[] = []
      let chars = 0
      let lineTop: number | null = null
      while (walker.nextNode()) {
        const node = walker.currentNode
        if (skip(node)) continue
        const range = document.createRange()
        for (const m of (node.textContent ?? '').matchAll(/\S+/g)) {
          range.setStart(node, m.index)
          range.setEnd(node, m.index + m[0].length)
          const top = range.getBoundingClientRect().top + window.scrollY
          if (lineTop === null) lineTop = top
          else if (top - lineTop > 4) {
            starts.push(chars)
            lineTop = top
          }
          chars += m[0].length
        }
      }
      return starts
    })
  })
}

/** The left and the top of each word of a chapter, in the window. */
function wordPlaces(section: Locator) {
  return section.evaluate((el) => {
    const walker = document.createTreeWalker(el.querySelector('.chapter-body')!, NodeFilter.SHOW_TEXT)
    const out: [string, number, number][] = []
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (node.parentElement!.closest('button, .sr-only')) continue
      const range = document.createRange()
      for (const m of (node.textContent ?? '').matchAll(/\S+/g)) {
        range.setStart(node, m.index)
        range.setEnd(node, m.index + m[0].length)
        const r = range.getBoundingClientRect()
        out.push([m[0], r.left, r.top])
      }
    }
    return out
  })
}

/** The words of two lists of word places, joined: the text nodes can split a word in two in one list only. */
const joined = (places: [string, number, number][]) => places.map((p) => p[0]).join('')

async function axe(page: Page): Promise<string[]> {
  const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
  return result.violations.flatMap((v) => v.nodes.map((n) => `${v.id} (${v.impact}): ${n.target.join(' ')}`))
}

for (const vp of VIEWPORTS) {
  test.describe(`red letters on the reading page, at ${vp.name}`, () => {
    test('Matthew 4: the words of Jesus in 4:4 are red; the words around them, 4:3, and the verse number have their own colors', async ({ page }) => {
      await openChapter(page, vp.size, 'matthew', 4)
      const section = chapter(page, 'matthew', 4)
      await expect(page.locator('.reading')).toHaveAttribute('data-red-letters', 'on')
      expect((await wordsStyle(section, 4, 'It is written:')).color).toBe(RED)
      expect((await wordsStyle(section, 4, 'But Jesus answered,')).color).toBe(INK)
      for (const n of await verseNodes(section, 3)) expect(n.color, `4:3 "${n.text}"`).toBe(INK)
      await expect(section.locator('.vn[data-verse="4"]')).toHaveCSS('color', GOSPELS)
      // The headings, the cross-reference lines, and the link controls are not red.
      expect(await section.locator('h3, h4, .link-line, button, .vn').evaluateAll((els, red) => els.filter((e) => getComputedStyle(e).color === red).length, RED)).toBe(0)
    })

    test('King James Version: John 3:3, Mark 12:37, and the added words of John 14:2', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3, { translation: 'kjv' })
      const john3 = chapter(page, 'john', 3)
      expect((await wordsStyle(john3, 3, 'Verily, verily, I say unto thee')).color).toBe(RED)
      expect((await wordsStyle(john3, 3, 'Jesus answered and said unto him,')).color).toBe(INK)

      await page.goto('./#/book/mark/12')
      const mark12 = chapter(page, 'mark', 12)
      await expect(mark12).toHaveAttribute('data-loaded', 'true')
      // docs/DESIGN.md section 11.3: the site removes the words-of-Jesus mark from the last sentence of Mark 12:37.
      expect((await wordsStyle(mark12, 37, 'David therefore himself calleth him Lord')).color).toBe(RED)
      expect((await wordsStyle(mark12, 37, 'And the common people heard him gladly.')).color).toBe(INK)

      // The data of John 14:2 has the added words "it were" in a words-of-Jesus mark: { "a": "it were", "j": 1 }.
      await page.goto('./#/book/john/14')
      const john14 = chapter(page, 'john', 14)
      await expect(john14).toHaveAttribute('data-loaded', 'true')
      const added = await wordsStyle(john14, 2, 'it were')
      expect(added.color).toBe(RED)
      expect(added.fontStyle).toBe('italic')
    })

    test('World English Bible: the words of John 3:16 are red, and have the ink color with red letters off', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3, { translation: 'web' })
      // The data has two items j in this verse, split before "Son". Each text node of the verse with a word is checked.
      const colors = async () => (await verseNodes(chapter(page, 'john', 3), 16)).filter((n) => /\w/.test(n.text)).map((n) => n.color)
      expect((await verseNodes(chapter(page, 'john', 3), 16)).map((n) => n.text).join('')).toContain('he gave his only born Son')
      expect(new Set(await colors())).toEqual(new Set([RED]))
      await toggleRed(page)
      await expect(page.locator('.reading')).toHaveAttribute('data-red-letters', 'off')
      expect(new Set(await colors())).toEqual(new Set([INK]))
    })

    test('Genesis 1 and Romans 1 have no red element, in the three translations', async ({ page }) => {
      for (const translation of TRANSLATIONS) {
        for (const [book, n] of [
          ['genesis', 1],
          ['romans', 1],
        ] as const) {
          await openChapter(page, vp.size, book, n, { translation })
          expect(await redElements(page.locator('.reading')), `${translation} ${book} ${n}`).toEqual([])
        }
      }
    })

    test('the selection stays after a reload, in the storage with the key bible-red-letters', async ({ page }) => {
      await openChapter(page, vp.size, 'matthew', 4)
      await toggleRed(page)
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('off')
      await page.reload()
      await expect(chapter(page, 'matthew', 4)).toHaveAttribute('data-loaded', 'true')
      await expect(page.locator('.reading')).toHaveAttribute('data-red-letters', 'off')
      expect(await redElements(chapter(page, 'matthew', 4))).toEqual([])
      await openSwitch(page)
      await expect(redRow(page)).toHaveAttribute('aria-pressed', 'false')
      await redRow(page).click()
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('on')
      await page.reload()
      await expect(chapter(page, 'matthew', 4)).toHaveAttribute('data-loaded', 'true')
      expect((await wordsStyle(chapter(page, 'matthew', 4), 4, 'It is written:')).color).toBe(RED)
    })

    test('the switch does not move a word: Matthew 4:7 and each word of Matthew 4 stay within 1 px, and the text width stays', async ({ page }) => {
      await openChapter(page, vp.size, 'matthew', 4)
      const section = chapter(page, 'matthew', 4)
      await section.locator('.vn[data-verse="7"]').scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
      const verse7 = async () => (await section.locator('.vn[data-verse="7"]').boundingBox())!
      const width = () => section.locator('.chapter-body').evaluate((el) => el.getBoundingClientRect().width)
      await openSwitch(page)
      const before = { box: await verse7(), width: await width(), words: await wordPlaces(section), scroll: await page.evaluate(() => window.scrollY) }
      await redRow(page).click()
      await expect(page.locator('.reading')).toHaveAttribute('data-red-letters', 'off')
      const after = { box: await verse7(), width: await width(), words: await wordPlaces(section), scroll: await page.evaluate(() => window.scrollY) }
      expect(Math.abs(after.box.x - before.box.x)).toBeLessThanOrEqual(1)
      expect(Math.abs(after.box.y - before.box.y)).toBeLessThanOrEqual(1)
      expect(after.scroll).toBe(before.scroll)
      expect(after.width).toBe(before.width)
      expect(joined(after.words)).toBe(joined(before.words))
      // The text nodes split the words at the same places with red letters on and off: the elements stay.
      expect(after.words.length).toBe(before.words.length)
      for (const [i, [w, left, top]] of after.words.entries()) {
        expect(Math.abs(left - before.words[i][1]), `"${w}"`).toBeLessThanOrEqual(1)
        expect(Math.abs(top - before.words[i][2]), `"${w}"`).toBeLessThanOrEqual(1)
      }
    })

    test('with red letters off, each line of Matthew 4 and John 14 breaks at the same word as in the Task 26 build', async ({ page }) => {
      for (const translation of TRANSLATIONS) {
        for (const [book, n] of [
          ['matthew', 4],
          ['john', 14],
        ] as const) {
          await openChapter(page, vp.size, book, n, { translation, red: 'off' })
          await page.waitForTimeout(300)
          const key = `${translation} ${vp.size.width} ${book} ${n}`
          expect(await lineStarts(chapter(page, book, n)), key).toEqual(BREAKS[key])
        }
      }
    })

    test('the pop-up of a link to Matthew 19:5: red letters when on, the ink color when off', async ({ page }) => {
      await openChapter(page, vp.size, 'genesis', 2)
      const name = isWide(page) ? 'Verse 24 has a quotation link to Matthew 19:5' : 'Quotation link to Matthew 19:5'
      const control = chapter(page, 'genesis', 2).getByRole('button', { name, exact: true }).first()
      const popText = page.getByRole('dialog', { name: 'Matthew 19:5' }).locator('.pop-text')
      await control.click()
      await expect(popText).toBeVisible()
      await expect(popText.locator('.red-letters')).not.toHaveCount(0)
      for (const el of await popText.locator('.red-letters').all()) await expect(el).toHaveCSS('color', RED)
      await page.keyboard.press('Escape')
      await expect(popText).toBeHidden()
      await toggleRed(page)
      await control.click()
      await expect(popText).toBeVisible()
      const ink = await popText.evaluate((el) => getComputedStyle(el).color)
      expect(ink).not.toBe(RED)
      for (const el of await popText.locator('.red-letters').all()) await expect(el).toHaveCSS('color', ink)
      expect(await redElements(popText)).toEqual([])
    })

    test('after travel to Matthew 19:5, the red letters have a contrast of 4.5 to 1 or more on the background of the linked verse', async ({ page }) => {
      await openChapter(page, vp.size, 'genesis', 2)
      const name = isWide(page) ? 'Verse 24 has a quotation link to Matthew 19:5' : 'Quotation link to Matthew 19:5'
      await chapter(page, 'genesis', 2).getByRole('button', { name, exact: true }).first().click()
      await page.getByRole('dialog', { name: 'Matthew 19:5' }).getByRole('link', { name: 'Go there' }).click()
      const paragraph = chapter(page, 'matthew', 19).locator('.vn[data-verse="5"]').locator('xpath=ancestor::p[1]')
      await expect(paragraph).toHaveClass(/rd-hit/)
      const red = paragraph.locator('.red-letters').first()
      await expect(red).toHaveCSS('color', RED)
      // The background behind the words: each background color from the page down to the words, laid over white.
      const ratio = await red.evaluate((el) => {
        const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number)
        const layers: number[][] = []
        for (let e: Element | null = el; e; e = e.parentElement) {
          const [r, g, b, a = 1] = parse(getComputedStyle(e).backgroundColor)
          if (a > 0) layers.unshift([r, g, b, a])
        }
        let bg = [255, 255, 255]
        for (const [r, g, b, a] of layers) bg = [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a)]
        const lum = ([r, g, b]: number[]) => {
          const f = (x: number) => ((x /= 255) <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
        }
        const fg = parse(getComputedStyle(el).color)
        const [hi, lo] = [lum(bg), lum(fg)].sort((x, y) => y - x)
        return (hi + 0.05) / (lo + 0.05)
      })
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })

    test('axe-core: Matthew 4 and John 14 with red letters on, in the three translations', async ({ page }) => {
      // Task 39b step 4: this test takes about 20 s, and it failed one time in Task 39 with the limit of 30 s.
      test.setTimeout(90_000)
      for (const translation of TRANSLATIONS) {
        for (const [book, n] of [
          ['matthew', 4],
          ['john', 14],
        ] as const) {
          await openChapter(page, vp.size, book, n, { translation })
          await expect(page.locator('.reading')).toHaveAttribute('data-red-letters', 'on')
          await page.waitForLoadState('networkidle')
          await page.waitForTimeout(800)
          expect(await axe(page), `${translation} ${book} ${n}`).toEqual([])
        }
      }
    })

    test('the row "Red letters" is 24 by 24 px or more, and works with the keyboard', async ({ page }) => {
      await openChapter(page, vp.size, 'matthew', 4)
      await openSwitch(page)
      const row = redRow(page)
      const box = (await row.boundingBox())!
      expect(box.width).toBeGreaterThanOrEqual(24)
      expect(box.height).toBeGreaterThanOrEqual(24)
      for (let i = 0; i < 8; i++) {
        if (await row.evaluate((el) => el === document.activeElement)) break
        await page.keyboard.press('Tab')
      }
      await expect(row).toBeFocused()
      await page.keyboard.press('Enter')
      await expect(row).toHaveAttribute('aria-pressed', 'false')
      expect(await redElements(chapter(page, 'matthew', 4))).toEqual([])
      await page.keyboard.press('Space')
      await expect(row).toHaveAttribute('aria-pressed', 'true')
      expect((await wordsStyle(chapter(page, 'matthew', 4), 4, 'It is written:')).color).toBe(RED)
      await expect(isWide(page) ? textList(page) : menuPanel(page)).toBeVisible()
    })
  })
}

test.describe('the red letters switch, narrow layout', () => {
  test('the row "Red letters" of the menu panel: On, then Off with no red, and the panel stays open; a second tap gives red again', async ({ page }) => {
    await openChapter(page, NARROW, 'matthew', 4)
    await menu(page).click()
    const panel = menuPanel(page)
    const row = redRow(page)
    // The order: "Echo links", "Text size", "Red letters", the line.
    const order = await panel.evaluate((el) => [...el.children].slice(0, 4).map((c) => c.textContent?.slice(0, 11)))
    expect(order[2]).toBe('Red letters')
    await expect(row).toHaveAttribute('aria-pressed', 'true')
    await expect(row.locator('.menu-state')).toHaveText('On')
    await expect(row.locator('.menu-state')).toHaveAttribute('aria-hidden', 'true')
    await row.click()
    await expect(row).toHaveAttribute('aria-pressed', 'false')
    await expect(row.locator('.menu-state')).toHaveText('Off')
    await expect(panel).toBeVisible()
    expect(await redElements(chapter(page, 'matthew', 4))).toEqual([])
    await row.click()
    await expect(row).toHaveAttribute('aria-pressed', 'true')
    expect((await wordsStyle(chapter(page, 'matthew', 4), 4, 'It is written:')).color).toBe(RED)
  })

  test('red letters off at 390 px, then a window of 1440 by 900 px: Matthew 4 has no red', async ({ page }) => {
    await openChapter(page, NARROW, 'matthew', 4)
    await toggleRed(page)
    await page.setViewportSize(WIDE)
    await expect(page.locator('.app')).toHaveAttribute('data-layout', 'wide')
    expect(await redElements(chapter(page, 'matthew', 4))).toEqual([])
    await openSwitch(page)
    await expect(redRow(page)).toHaveAttribute('aria-pressed', 'false')
  })
})

test.describe('the text control and the text list, wide layout', () => {
  test('the control shows "Text" with the name "Text settings"; the row "Red letters" changes the state, and the list stays open', async ({ page }) => {
    await openChapter(page, WIDE, 'matthew', 4)
    const control = textControl(page)
    await expect(control).toHaveText('Text')
    await expect(control).toHaveAccessibleName('Text settings')
    await control.click()
    const list = textList(page)
    await expect(list).toBeVisible()
    // The three sizes, a thin line, and the row "Red letters". From Task 45, a second thin line and the row "Dark mode".
    const order = await list.evaluate((el) => [...el.children].map((c) => c.className))
    expect(order).toEqual(['', 'menu-rule ts-rule', 'tr-row ts-red', 'menu-rule ts-rule', 'tr-row ts-dark'])
    await expect(list.getByRole('group', { name: 'Text size' }).getByRole('button')).toHaveText(['Standard', 'Large', 'Largest'])
    const row = redRow(page)
    await expect(row).toHaveAttribute('aria-pressed', 'true')
    await expect(row.locator('.ts-state')).toHaveText('On')
    await expect(row.locator('.ts-state')).toHaveAttribute('aria-hidden', 'true')
    await expect(row.locator('.ts-state')).toHaveCSS('color', 'rgb(110, 110, 115)')
    await expect(row.locator('.tr-check path')).toHaveCount(0)
    await row.click()
    await expect(row).toHaveAttribute('aria-pressed', 'false')
    await expect(row.locator('.ts-state')).toHaveText('Off')
    await expect(list).toBeVisible()
    expect(await redElements(chapter(page, 'matthew', 4))).toEqual([])
  })

  test('axe-core: Matthew 4 with the text list open', async ({ page }) => {
    await openChapter(page, WIDE, 'matthew', 4)
    await openSwitch(page)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)
    expect(await axe(page)).toEqual([])
  })
})

test('the Sources page has the paragraph about the words of Jesus', async ({ page }) => {
  await page.goto('./#/sources')
  await expect(
    page.locator('p').filter({
      hasText:
        'The words of Jesus are in red. They are the words that the files of each translation mark as words of Jesus. The three translations do not mark the same words in each verse. The site changes one mark: in Mark 12:37 of the King James Version, the file also marks the sentence "And the common people heard him gladly.", and the site does not.',
    }),
  ).toHaveCount(1)
})

for (const vp of VIEWPORTS) {
  test(`the wall has no control "Red letters", at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize(vp.size)
    await page.goto('./')
    await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
    await expect(page.getByText('Red letters')).toHaveCount(0)
    if (vp.size === NARROW) {
      await menu(page).click()
      await expect(menuPanel(page)).toBeVisible()
      await expect(page.getByText('Red letters')).toHaveCount(0)
    }
  })
}
