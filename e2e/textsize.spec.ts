/// <reference lib="dom" />
// The text size. docs/DESIGN.md section 10, docs/TASKS.md Task 24 step 11.
// The axe-core checks with "Largest" are in a11y.spec.ts, with the other axe-core checks.

import { expect, test, type Locator, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 390, height: 844 }
const VIEWPORTS = [
  { name: '1440 by 900 px', size: WIDE },
  { name: '390 by 844 px', size: NARROW },
] as const
const KEY = 'bible-text-size'
const BAR_PX = 52

/** The size of the Bible text, in px, for each text size: docs/DESIGN.md section 10.2. */
const TEXT_PX = {
  wide: { Standard: 21, Large: 24, Largest: 27 },
  narrow: { Standard: 18, Large: 21, Largest: 24 },
} as const
type SizeName = keyof (typeof TEXT_PX)['wide']

/**
 * The sizes with "Standard", as the build of Task 23 has them, before the text size. I read them from
 * that build at 1440 by 900 px and at 390 by 844 px.
 */
const BEFORE = {
  wide: { s1: 17, s2: 15, linkLine: 13, verseNumber: 12.6, popText: 17 },
  narrow: { s1: 17, s2: 15, linkLine: 13, verseNumber: 10.8, popText: 17 },
} as const

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)
const paragraph = (page: Page) => chapter(page, 'john', 3).locator('.chapter-body p.tb-p').first()
// The text control and the text list. From Task 27, the control shows "Text", and its name is "Text settings".
const sizeControl = (page: Page) => page.getByRole('button', { name: 'Text settings', exact: true })
const sizeList = (page: Page) => page.locator('#text-list')
/** The size button of the text list that has aria-pressed "true". The name of the control does not name the size from Task 27. */
const listedSize = async (page: Page) => {
  await sizeControl(page).click()
  const pressed = sizeList(page).getByRole('group', { name: 'Text size' }).locator('button[aria-pressed="true"]')
  const name = await pressed.textContent()
  await page.keyboard.press('Escape')
  await expect(sizeList(page)).toBeHidden()
  return name
}
const menu = (page: Page) => page.getByRole('button', { name: 'Menu', exact: true })
const menuPanel = (page: Page) => page.locator('#menu-panel')
const menuSizes = (page: Page) => menuPanel(page).getByRole('group', { name: 'Text size' })
const layoutOf = (size: { width: number }) => (size.width >= 900 ? 'wide' : 'narrow')

async function openChapter(page: Page, size: { width: number; height: number }, book: string, n: number) {
  await page.setViewportSize(size)
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
  await page.evaluate(() => document.fonts.ready)
}

const px = (locator: Locator) => locator.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))

/** Selects a text size: in the text list in the wide layout, in the menu panel in the narrow layout. */
async function selectSize(page: Page, name: SizeName) {
  if ((page.viewportSize()?.width ?? 0) >= 900) {
    await sizeControl(page).click()
    await expect(sizeList(page)).toBeVisible()
    await sizeList(page).getByRole('button', { name, exact: true }).click()
    await expect(sizeList(page)).toBeHidden()
  } else {
    if (!(await menuPanel(page).isVisible())) await menu(page).click()
    await menuSizes(page).getByRole('button', { name, exact: true }).click()
    await expect(menuSizes(page).getByRole('button', { name, exact: true })).toHaveAttribute('aria-pressed', 'true')
    // The panel stays open after a size. The Escape key closes it, so that its shade does not cover the page.
    await expect(menuPanel(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menuPanel(page)).toBeHidden()
  }
}

async function bigEnough(controls: Locator[]) {
  for (const c of controls) {
    const box = (await c.boundingBox())!
    expect(box.width, (await c.textContent()) ?? '').toBeGreaterThanOrEqual(24)
    expect(box.height, (await c.textContent()) ?? '').toBeGreaterThanOrEqual(24)
  }
}

for (const vp of VIEWPORTS) {
  const layout = layoutOf(vp.size)
  test.describe(`the text size, at ${vp.name}`, () => {
    test('the first visit shows "Standard": the paragraph and the other parts have the sizes of before Task 24', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3)
      expect(await px(paragraph(page))).toBe(TEXT_PX[layout].Standard)
      const john3 = chapter(page, 'john', 3)
      expect(await px(john3.locator('.sh-s1').first())).toBe(BEFORE[layout].s1)
      expect(await px(john3.locator('.link-line').first())).toBe(BEFORE[layout].linkLine)
      expect(await px(john3.locator('.chapter-body p.tb-p .vn').first())).toBeCloseTo(BEFORE[layout].verseNumber, 3)
      await openChapter(page, vp.size, 'genesis', 1)
      expect(await px(chapter(page, 'genesis', 1).locator('.sh-s2').first())).toBe(BEFORE[layout].s2)
      await openChapter(page, vp.size, 'hebrews', 9)
      const name = vp.size.width >= 1180 ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8'
      await page.getByRole('button', { name, exact: true }).click()
      await expect(page.locator('.pop .pop-text .pop-vn').first()).toBeVisible()
      expect(await px(page.locator('.pop .pop-text'))).toBe(BEFORE[layout].popText)
    })

    test('"Largest" makes the section headings and the pop-up text larger in the proportion of the Bible text', async ({ page }) => {
      const ratio = TEXT_PX[layout].Largest / TEXT_PX[layout].Standard
      await openChapter(page, vp.size, 'john', 3)
      const s1 = chapter(page, 'john', 3).locator('.sh-s1').first()
      const standard = await px(s1)
      await selectSize(page, 'Largest')
      await expect.poll(() => px(paragraph(page))).toBe(TEXT_PX[layout].Largest)
      expect(Math.abs((await px(s1)) - standard * ratio)).toBeLessThanOrEqual(0.1)

      await openChapter(page, vp.size, 'hebrews', 9)
      const name = vp.size.width >= 1180 ? 'Verse 20 has a quotation link to Exodus 24:8' : 'Quotation link to Exodus 24:8'
      await page.getByRole('button', { name, exact: true }).click()
      await expect(page.locator('.pop .pop-text .pop-vn').first()).toBeVisible()
      expect(Math.abs((await px(page.locator('.pop .pop-text'))) - BEFORE[layout].popText * ratio)).toBeLessThanOrEqual(0.1)
    })

    test('the top bar, the heading, "About this book", the read-with list, and the labels keep their sizes', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3)
      const john3 = chapter(page, 'john', 3)
      const parts = [
        page.locator('header.rd-bar .rd-books'),
        page.locator('header.rd-bar .rd-where b'),
        page.locator('header.rd-bar .rd-tr'),
        john3.locator('.rd-heading'),
        john3.locator('.rd-about-control'),
        john3.getByRole('navigation', { name: 'Read with' }).getByRole('link').first(),
        ...(layout === 'wide' ? [page.locator('header.rd-bar .rd-echo'), page.locator('header.rd-bar .rd-size'), john3.locator('.rd-label').first()] : []),
      ]
      const sizes = async () => Promise.all(parts.map((p) => px(p)))
      const standard = await sizes()
      for (const name of ['Large', 'Largest'] as const) {
        await selectSize(page, name)
        await expect.poll(() => px(paragraph(page))).toBe(TEXT_PX[layout][name])
        expect(await sizes()).toEqual(standard)
      }
    })

    test('the text size stays after a reload, in the storage with the key bible-text-size', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3)
      await selectSize(page, 'Large')
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('large')
      await page.reload()
      await expect(chapter(page, 'john', 3)).toHaveAttribute('data-loaded', 'true')
      expect(await px(paragraph(page))).toBe(TEXT_PX[layout].Large)
      expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('large')
      if (layout === 'wide') expect(await listedSize(page)).toBe('Large')
      else {
        await menu(page).click()
        await expect(menuSizes(page).getByRole('button', { name: 'Large', exact: true })).toHaveAttribute('aria-pressed', 'true')
      }
    })

    test('a wrong value in the storage gives "Standard"', async ({ page }) => {
      await page.addInitScript((key) => localStorage.setItem(key, 'huge'), KEY)
      await openChapter(page, vp.size, 'john', 3)
      expect(await px(paragraph(page))).toBe(TEXT_PX[layout].Standard)
      await expect(page.locator('.reading')).toHaveAttribute('data-text-size', 'standard')
    })

    test('the verse at the top stays at its place for each change between two sizes', async ({ page }) => {
      await openChapter(page, vp.size, 'john', 3)
      // John 3:16 near the top of the page, below the bar.
      const v16 = chapter(page, 'john', 3).locator('.chapter-body .vn[data-verse="16"]')
      await v16.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 160))
      const topVerse = () =>
        page.evaluate((bar) => {
          for (const n of document.querySelectorAll<HTMLElement>('.rd-column section.rd-chapter .chapter-body .vn[data-verse]')) {
            const top = n.getBoundingClientRect().top
            if (top < bar) continue
            const s = n.closest<HTMLElement>('section.rd-chapter')!
            return { at: `${s.dataset.book} ${s.dataset.chapter}:${n.dataset.verse}`, top }
          }
          return null
        }, BAR_PX)
      // The six changes between two sizes.
      for (const name of ['Large', 'Largest', 'Standard', 'Largest', 'Large', 'Standard'] as const) {
        const before = (await topVerse())!
        expect(before).not.toBeNull()
        await selectSize(page, name)
        await expect.poll(() => px(paragraph(page))).toBe(TEXT_PX[layout][name])
        const at = before.at.split(/[ :]/)
        const after = await chapter(page, at[0], Number(at[1])).locator(`.chapter-body .vn[data-verse="${at[2]}"]`).evaluate((el) => el.getBoundingClientRect().top)
        expect(Math.abs(after - before.top), `${before.at} after the change to ${name}`).toBeLessThanOrEqual(2)
      }
    })
  })
}

test.describe('the text control and the text list, wide layout', () => {
  test('the control opens the list with three rows; a row closes the list and changes the size', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 3)
    const control = sizeControl(page)
    await expect(control).toHaveText('Text')
    await expect(control).toHaveAccessibleName('Text settings')
    await expect(control).toHaveAttribute('aria-expanded', 'false')
    await control.click()
    await expect(control).toHaveAttribute('aria-expanded', 'true')
    const group = sizeList(page).getByRole('group', { name: 'Text size' })
    await expect(group.getByRole('button')).toHaveText(['Standard', 'Large', 'Largest'])
    await expect(group.getByRole('button', { name: 'Standard' })).toHaveAttribute('aria-pressed', 'true')
    await expect(group.getByRole('button', { name: 'Standard' })).toBeFocused()
    await group.getByRole('button', { name: 'Large', exact: true }).click()
    await expect(sizeList(page)).toBeHidden()
    await expect(control).toBeFocused()
    await expect(control).toHaveAccessibleName('Text settings')
    expect(await px(paragraph(page))).toBe(24)
    await selectSize(page, 'Largest')
    expect(await px(paragraph(page))).toBe(27)
    // The same size again: the list closes, and nothing changes.
    await control.click()
    await sizeList(page).getByRole('button', { name: 'Largest' }).click()
    await expect(sizeList(page)).toBeHidden()
    expect(await px(paragraph(page))).toBe(27)
  })

  test('the look: 220 px wide, 56 px from the top, centered below the control; the control is 22 px from the echo links switch', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 3)
    await sizeControl(page).click()
    const list = (await sizeList(page).boundingBox())!
    const control = (await sizeControl(page).boundingBox())!
    const echo = (await page.locator('header.rd-bar .rd-echo').boundingBox())!
    expect(list.width).toBe(220)
    expect(list.y).toBe(56)
    expect(Math.abs(list.x + list.width / 2 - (control.x + control.width / 2))).toBeLessThanOrEqual(1)
    expect(list.x + list.width).toBeLessThanOrEqual(1440 - 12)
    expect(Math.round(echo.x - (control.x + control.width))).toBe(22)
    const rows = sizeList(page).getByRole('button')
    for (const row of await rows.all()) expect((await row.boundingBox())!.height).toBe(44)
    await expect(rows.nth(0)).toHaveCSS('font-weight', '600')
    await expect(rows.nth(1)).toHaveCSS('font-weight', '500')
    await expect(rows.nth(0).locator('.tr-check path')).toHaveCount(1)
    await expect(rows.nth(1).locator('.tr-check path')).toHaveCount(0)
    await expect(page.locator('.rd-shade')).toHaveCount(0)
    // A click outside the list closes it.
    await page.mouse.click(200, 600)
    await expect(sizeList(page)).toBeHidden()
  })

  test('the text list and the translation list are not open at the same time, and Escape closes the list', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 3)
    await sizeControl(page).click()
    await expect(sizeList(page)).toBeVisible()
    await page.getByRole('button', { name: /^Translation: / }).click()
    await expect(page.locator('#translation-list')).toBeVisible()
    await expect(sizeList(page)).toBeHidden()
    await sizeControl(page).click()
    await expect(sizeList(page)).toBeVisible()
    await expect(page.locator('#translation-list')).toBeHidden()
    await page.keyboard.press('Escape')
    await expect(sizeList(page)).toBeHidden()
    await expect(sizeControl(page)).toBeFocused()
  })

  test('after travel with "Go there", the text list starts below the trail', async ({ page }) => {
    await openChapter(page, WIDE, 'hebrews', 9)
    await page.getByRole('button', { name: 'Verse 20 has a quotation link to Exodus 24:8', exact: true }).click()
    await page.getByRole('dialog', { name: 'Exodus 24:8' }).getByRole('link', { name: 'Go there' }).click()
    await expect(chapter(page, 'exodus', 24)).toHaveAttribute('data-loaded', 'true')
    const trail = (await page.locator('.rd-trail').boundingBox())!
    await sizeControl(page).click()
    expect((await sizeList(page).boundingBox())!.y).toBeGreaterThanOrEqual(trail.y + trail.height - 0.5)
  })

  test('the control and the rows are 24 by 24 px or more, and work with the keyboard', async ({ page }) => {
    await openChapter(page, WIDE, 'john', 3)
    await page.locator('header.rd-bar .rd-tr').focus()
    await page.keyboard.press('Tab')
    await expect(sizeControl(page)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(sizeList(page)).toBeVisible()
    await bigEnough([sizeControl(page), ...(await sizeList(page).getByRole('button').all())])
    await expect(sizeList(page).getByRole('button', { name: 'Standard' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(sizeList(page).getByRole('button', { name: 'Large', exact: true })).toBeFocused()
    await page.keyboard.press('Space')
    await expect(sizeList(page)).toBeHidden()
    await expect(sizeControl(page)).toBeFocused()
    expect(await px(paragraph(page))).toBe(24)
    // The focus shows on the control, as on the other controls of the bar.
    expect(await sizeControl(page).evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none')
  })

  test('with "Largest", each label in the margin of John 3 is on the line of its verse number', async ({ page }) => {
    await page.addInitScript((key) => localStorage.setItem(key, 'largest'), KEY)
    await openChapter(page, WIDE, 'john', 3)
    const john3 = chapter(page, 'john', 3)
    await expect(john3).toHaveAttribute('data-labels-ready', 'true')
    expect(await px(paragraph(page))).toBe(27)
    const check = () =>
      john3.evaluate((s) => {
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
    expect(await john3.locator('.rd-label').count()).toBeGreaterThan(5)
    await expect.poll(check).toEqual([])
    // Also after a change of the text size on the page.
    await selectSize(page, 'Standard')
    await selectSize(page, 'Largest')
    await expect.poll(check).toEqual([])
  })

  test('at 900 by 800 px, the top bar of 2 Thessalonians 3 is one line, and no two items overlap', async ({ page }) => {
    await openChapter(page, { width: 900, height: 800 }, '2-thessalonians', 3)
    const r = await page.evaluate(() => {
      const box = (s: string) => {
        const b = document.querySelector(s)!.getBoundingClientRect()
        return { s, left: b.left, right: b.right, top: b.top, bottom: b.bottom }
      }
      return { bar: document.querySelector('.rd-bar')!.getBoundingClientRect().height, items: ['.rd-books', '.rd-where', '.rd-bar-rule', '.rd-tr', '.rd-size', '.rd-echo'].map(box) }
    })
    expect(r.bar).toBe(BAR_PX)
    for (const [i, a] of r.items.entries()) {
      expect(a.top, a.s).toBeGreaterThanOrEqual(0)
      expect(a.bottom, a.s).toBeLessThanOrEqual(BAR_PX)
      if (i > 0) expect(a.left, `${a.s} after ${r.items[i - 1].s}`).toBeGreaterThanOrEqual(r.items[i - 1].right)
    }
    await expect(page.locator('.rd-where b')).toHaveText('2 Thessalonians')
    expect(await page.locator('.rd-where b').evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false)
  })
})

test.describe('the row "Text size" of the menu panel, narrow layout', () => {
  test('"Menu" has the row "Text size"; a size changes the text, and the panel stays open', async ({ page }) => {
    await openChapter(page, NARROW, 'john', 3)
    await menu(page).click()
    const panel = menuPanel(page)
    await expect(panel.locator('.menu-size')).toContainText('Text size')
    // The order: "Echo links", "Text size", "Red letters" from Task 27, "Dark mode" from Task 45, the line, the links.
    const order = await panel.evaluate((el) => [...el.children].map((c) => c.className))
    expect(order.slice(0, 5)).toEqual(['menu-row', 'menu-size', 'menu-row', 'menu-row', 'menu-rule'])
    const sizes = menuSizes(page).getByRole('button')
    await expect(sizes).toHaveText(['Standard', 'Large', 'Largest'])
    await expect(sizes.nth(0)).toHaveAttribute('aria-pressed', 'true')
    await sizes.nth(1).click()
    expect(await px(paragraph(page))).toBe(21)
    await expect(panel).toBeVisible()
    await expect(sizes.nth(1)).toHaveAttribute('aria-pressed', 'true')
    await expect(sizes.nth(0)).toHaveAttribute('aria-pressed', 'false')
    await sizes.nth(2).click()
    expect(await px(paragraph(page))).toBe(24)
    await expect(panel).toBeVisible()
    // The look: the selected size has the ink color, the weight 600, and a line of 2 px below its name.
    await expect(sizes.nth(2)).toHaveCSS('color', 'rgb(29, 29, 31)')
    await expect(sizes.nth(2)).toHaveCSS('font-weight', '600')
    await expect(sizes.nth(2).locator('span')).toHaveCSS('border-bottom-width', '2px')
    await expect(sizes.nth(2).locator('span')).toHaveCSS('border-bottom-color', 'rgb(29, 29, 31)')
    await expect(sizes.nth(0)).toHaveCSS('color', 'rgb(110, 110, 115)')
    await expect(sizes.nth(0)).toHaveCSS('font-weight', '500')
    // The words "Text size" are not a control.
    await expect(panel.locator('.menu-size').getByRole('button', { name: 'Text size' })).toHaveCount(0)
  })

  test('the sizes are 36 px high or more, and work with the keyboard', async ({ page }) => {
    await openChapter(page, NARROW, 'john', 3)
    await menu(page).click()
    await expect(menuPanel(page).getByRole('button', { name: 'Echo links' })).toBeFocused()
    const sizes = menuSizes(page).getByRole('button')
    for (const b of await sizes.all()) {
      const box = (await b.boundingBox())!
      expect(box.height).toBeGreaterThanOrEqual(36)
      expect(box.width).toBeGreaterThanOrEqual(24)
      await expect(b).toHaveCSS('font-size', '16px')
    }
    await page.keyboard.press('Tab')
    await expect(sizes.nth(0)).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(sizes.nth(1)).toBeFocused()
    await page.keyboard.press('Enter')
    expect(await px(paragraph(page))).toBe(21)
    await expect(menuPanel(page)).toBeVisible()
    await page.keyboard.press('Tab')
    await expect(sizes.nth(2)).toBeFocused()
    await page.keyboard.press('Space')
    expect(await px(paragraph(page))).toBe(24)
  })

  test('with "Largest" at 390 px and at 320 px wide, Psalm 23, Psalm 119, John 3, and Genesis 1 do not scroll sideways', async ({ page }) => {
    await page.addInitScript((key) => localStorage.setItem(key, 'largest'), KEY)
    for (const width of [390, 320]) {
      for (const [book, n] of [['psalms', 23], ['psalms', 119], ['john', 3], ['genesis', 1]] as const) {
        await openChapter(page, { width, height: 844 }, book, n)
        expect(await px(chapter(page, book, n).locator('.chapter-body p.tb').first())).toBe(24)
        expect(await page.evaluate(() => document.documentElement.scrollWidth), `${book} ${n} at ${width} px`).toBeLessThanOrEqual(width)
      }
    }
  })

  test('at 320 px wide, the row "Text size" is completely in the window', async ({ page }) => {
    for (const width of [390, 320]) {
      await openChapter(page, { width, height: 844 }, 'john', 3)
      await menu(page).click()
      const r = await menuPanel(page).evaluate((el) => {
        const row = el.querySelector('.menu-size')!
        return [row, ...row.querySelectorAll('span, button')].map((e) => {
          const b = e.getBoundingClientRect()
          return { left: b.left, right: b.right, cut: e.scrollWidth > e.clientWidth + 0.5 }
        })
      })
      for (const b of r) {
        expect(b.left).toBeGreaterThanOrEqual(0)
        expect(b.right).toBeLessThanOrEqual(width)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    }
  })

  test('select "Largest" at 390 px, then a window of 1440 by 900 px: the paragraph is 27 px', async ({ page }) => {
    await openChapter(page, NARROW, 'john', 3)
    await selectSize(page, 'Largest')
    expect(await px(paragraph(page))).toBe(24)
    await page.setViewportSize(WIDE)
    await expect(page.locator('.app')).toHaveAttribute('data-layout', 'wide')
    expect(await px(paragraph(page))).toBe(27)
    expect(await listedSize(page)).toBe('Largest')
  })
})

test.describe('the wall', () => {
  for (const vp of VIEWPORTS) {
    test(`has no control with the words "Text size", at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('./')
      await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
      await expect(page.getByText('Text size')).toHaveCount(0)
      if (vp.size === NARROW) {
        await menu(page).click()
        await expect(page.locator('#menu-panel')).toBeVisible()
        await expect(page.getByText('Text size')).toHaveCount(0)
      }
    })
  }
})
