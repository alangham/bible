/// <reference lib="dom" />
// The side of the pop-up on a wide screen, and the name of a margin label of an echo link.
// docs/DESIGN.md section 7.7, docs/TASKS.md Task 21b step 5.

import { expect, test, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const LABEL = 'Verse 20 has a quotation link to Exodus 24:8'

/** Opens Hebrews 9 in a translation, with the margin label of verse 20 at `top` px from the top of the window. */
async function openAt(page: Page, translation: 'bsb' | 'kjv', top: number) {
  await page.setViewportSize(WIDE)
  await page.addInitScript((t) => localStorage.setItem('bible-translation', t), translation)
  await page.goto('./#/book/hebrews/9')
  const section = page.locator('section.rd-chapter[data-book="hebrews"][data-chapter="9"]')
  await expect(section).toHaveAttribute('data-translation', translation)
  await expect(section).toHaveAttribute('data-labels-ready', 'true')
  await page.evaluate(() => document.fonts.ready)
  const label = section.getByRole('button', { name: LABEL })
  await label.evaluate((el, top) => window.scrollBy(0, el.getBoundingClientRect().top - top), top)
  await page.waitForTimeout(200)
  const box = (await label.boundingBox())!
  expect(Math.abs(box.y - top)).toBeLessThanOrEqual(2)
  await label.click()
  const dialog = page.getByRole('dialog', { name: 'Exodus 24:8' })
  await expect(dialog).toBeVisible()
  // The text of the passage arrives after the pop-up opens. Then the pop-up gets its place again.
  await expect(dialog.locator('.pop-text .pop-vn')).toHaveCount(1)
  await page.waitForTimeout(300)
  return { label: box, dialog }
}

/** The place of the pop-up, and of its two buttons, in px. */
async function rects(page: Page) {
  return page.evaluate(() => {
    const r = (sel: string) => {
      const b = document.querySelector(sel)!.getBoundingClientRect()
      return { top: b.top, bottom: b.bottom, left: b.left, right: b.right }
    }
    const pop = document.querySelector('.pop')!
    return { pop: r('.pop'), go: r('.pop-go'), stay: r('.pop-stay'), scrolls: pop.scrollHeight > pop.clientHeight + 1 }
  })
}

type Rect = { top: number; bottom: number; left: number; right: number }
const inside = (a: Rect, b: Rect) => a.top >= b.top - 0.5 && a.bottom <= b.bottom + 0.5 && a.left >= b.left - 0.5 && a.right <= b.right + 0.5
const WINDOW: Rect = { top: 0, bottom: WIDE.height, left: 0, right: WIDE.width }

test.describe('the side of the pop-up, at 1440 by 900 px', () => {
  test('King James Version, label 470 px from the top: the pop-up opens above the label, with the two buttons complete', async ({ page }) => {
    const { label } = await openAt(page, 'kjv', 470)
    const r = await rects(page)
    expect(r.pop.bottom).toBeLessThanOrEqual(label.y)
    for (const b of [r.go, r.stay]) {
      expect(inside(b, r.pop)).toBe(true)
      expect(inside(b, WINDOW)).toBe(true)
    }
    expect(r.scrolls).toBe(false)
  })

  test('King James Version, label 150 px from the top: the pop-up opens below the label, with the two buttons complete', async ({ page }) => {
    const { label } = await openAt(page, 'kjv', 150)
    const r = await rects(page)
    expect(r.pop.top).toBeGreaterThanOrEqual(label.y + label.height)
    for (const b of [r.go, r.stay]) expect(inside(b, r.pop)).toBe(true)
    expect(r.scrolls).toBe(false)
  })

  for (const top of [470, 150]) {
    test(`Berean Standard Bible, label ${top} px from the top: the two buttons are complete in the box`, async ({ page }) => {
      await openAt(page, 'bsb', top)
      const r = await rects(page)
      for (const b of [r.go, r.stay]) expect(inside(b, r.pop)).toBe(true)
      expect(r.scrolls).toBe(false)
    })
  }

  test('the name of a margin label of an echo link has "has an echo link"', async ({ page }) => {
    await page.setViewportSize(WIDE)
    await page.goto('./#/book/hebrews/9')
    const echo = page.locator('section.rd-chapter[data-book="hebrews"][data-chapter="9"] .rd-label[data-kind="echo"]').first()
    // The no-break spaces of the name give two spaces in the computed name.
    await expect(echo).toHaveAccessibleName(/^Verse\s+\d+\s+has an echo link to\s+\S/)
    const quotation = page.getByRole('button', { name: LABEL })
    await expect(quotation).toHaveAccessibleName(LABEL)
  })
})
