// The map page: the first view. docs/TASKS.md Task 38 step 6, docs/DESIGN.md sections 15.8, 15.10, and 15.11.

import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/** The WCAG rules of a11y.spec.ts: WCAG 2.0, 2.1, and 2.2, levels A and AA. */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa']

const LAYOUTS = [
  { name: 'wide', viewport: { width: 1440, height: 900 } },
  { name: 'narrow', viewport: { width: 390, height: 844 } },
]

/** Opens the map of a book and waits until the names are on the map. */
async function openMap(page: Page, id: string) {
  await page.goto(`./#/book/${id}/map`)
  await expect(page.locator('.map-svg[data-ready="true"]')).toBeVisible()
}

/** The names that show on the map. */
async function mapNames(page: Page): Promise<string[]> {
  return page.locator('.map-names text').allTextContents()
}

for (const layout of LAYOUTS) {
  test.describe(`map page, ${layout.name} layout`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(layout.viewport)
    })

    test('Acts: the region "Rome to Jerusalem", and the first view shows Jerusalem and Rome', async ({ page }) => {
      await openMap(page, 'acts')
      await expect(page).toHaveTitle('Places of Acts · Bible Wall')
      await expect(page.getByRole('heading', { level: 2, name: 'The places of this book' })).toBeVisible()
      await expect(page.locator('.map-region')).toHaveText('Map: Rome to Jerusalem')
      await expect(page.getByRole('img', { name: 'Map of the places of Acts, Rome to Jerusalem' })).toBeVisible()
      const names = await mapNames(page)
      expect(names).toContain('Jerusalem')
      expect(names).toContain('Rome')
      await expect(page.locator('.map-counts p').first()).toHaveText(/^Acts names 107 places\. \d+ are on this map\.$/)
      await expect(page.locator('.map-counts')).toContainText('2 places are inside a city, and the map does not show them: Beautiful Gate, Solomon’s Portico.')
    })

    test('Matthew: the first view shows Jerusalem', async ({ page }) => {
      await openMap(page, 'matthew')
      expect(await mapNames(page)).toContain('Jerusalem')
    })

    test('Proverbs: the sentence for one place, and the name Egypt with no dot', async ({ page }) => {
      await openMap(page, 'proverbs')
      await expect(page.locator('.map-counts p')).toHaveText(['Proverbs names 1 place. It is on this map.'])
      expect(await mapNames(page)).toEqual(['EGYPT'])
      await expect(page.locator('.map-dots > *')).toHaveCount(0)
    })

    test('Philemon: the bar and "Philemon names no place."', async ({ page }) => {
      await page.goto('./#/book/philemon/map')
      await expect(page.getByText('Philemon names no place.')).toBeVisible()
      await expect(page.locator('.map-svg')).toHaveCount(0)
      await expect(page.getByRole('link', { name: 'Philemon' })).toHaveAttribute('href', '#/book/philemon')
    })

    test('a book that the site does not have shows "Book not found"', async ({ page }) => {
      await page.goto('./#/book/tobit/map')
      await expect(page.getByRole('heading', { level: 1, name: 'Book not found' })).toBeVisible()
    })

    test('the control of the bar opens the book', async ({ page }) => {
      await openMap(page, 'acts')
      await page.locator('.map-bar').getByRole('link', { name: 'Acts' }).click()
      await expect(page).toHaveURL(/#\/book\/acts(\/1)?$/)
      await expect(page.locator('.rd-chapter[data-book="acts"]').first()).toBeVisible()
    })

    for (const id of ['acts', 'joshua']) {
      test(`${id}: no name touches a different name or a dot of a different place`, async ({ page }) => {
        await openMap(page, id)
        const problems = await page.evaluate(() => {
          const box = (e: Element) => e.getBoundingClientRect()
          const touch = (a: DOMRect, b: DOMRect) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
          const names = [...document.querySelectorAll('.map-names text')].map((e) => ({ i: e.getAttribute('data-place'), text: e.textContent, r: box(e) }))
          const dots = [...document.querySelectorAll('.map-dots > *')].map((e) => ({ i: e.getAttribute('data-place'), r: box(e) }))
          const out: string[] = []
          names.forEach((a, n) => {
            names.slice(n + 1).forEach((b) => touch(a.r, b.r) && out.push(`${a.text} touches ${b.text}`))
            dots.forEach((d) => d.i !== a.i && touch(a.r, d.r) && out.push(`${a.text} touches the dot of place ${d.i}`))
          })
          return out
        })
        expect(problems).toEqual([])
      })

      test(`${id}: the axe check`, async ({ page }) => {
        await openMap(page, id)
        const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
      })
    }

    test('the page opens at the top', async ({ page }) => {
      await page.goto('./#/book/genesis/1')
      await page.evaluate(() => window.scrollTo(0, 2000))
      await page.evaluate(() => (location.hash = '#/book/acts/map'))
      await expect(page.locator('.map-svg[data-ready="true"]')).toBeVisible()
      expect(await page.evaluate(() => window.scrollY)).toBe(0)
    })
  })
}

test('the narrow heights of the map: Joshua 520 px, Acts 300 px at 390 by 844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openMap(page, 'joshua')
  expect((await page.locator('.map-frame').boundingBox())?.height).toBe(520)
  await openMap(page, 'acts')
  expect((await page.locator('.map-frame').boundingBox())?.height).toBe(300)
})

test('no page has a link to the map page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const path of ['./', './#/book/acts/1', './#/sources', './#/timeline', './#/quotations']) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('a[href*="/map"]')).toHaveCount(0)
  }
  await page.goto('./#/book/acts/1')
  await page.getByRole('button', { name: 'About this book' }).first().click()
  await expect(page.locator('a[href*="/map"]')).toHaveCount(0)
})

// docs/TASKS.md Task 38b step 11: the four corrections, and the data with no name of a direction.
test.describe('map page, Task 38b', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('Matthew: the map has no name "EAST", and the page has no word "South"', async ({ page }) => {
    await openMap(page, 'matthew')
    expect(await mapNames(page)).not.toContain('EAST')
    await expect(page.locator('main')).not.toContainText('South')
    await expect(page.locator('.map-counts p').first()).toHaveText(/^Matthew names 36 places\./)
  })

  test('Matthew: the axe check', async ({ page }) => {
    await openMap(page, 'matthew')
    const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
    expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
  })

  test('Exodus: "Mount Sinai" is bold', async ({ page }) => {
    await openMap(page, 'exodus')
    const sinai = page.locator('.map-names text', { hasText: /^Mount Sinai$/ })
    await expect(sinai).toHaveAttribute('font-weight', '700')
  })

  test('Ezekiel: the number of the sentence is the number of the names shown plus N', async ({ page }) => {
    await openMap(page, 'ezekiel')
    const outside = await page.locator('.map-counts p', { hasText: 'outside this map' }).textContent()
    const m = /^(\d+) places are outside this map: (.*), and (\d+) more\.$/.exec(outside ?? '')
    expect(m, outside ?? '').not.toBeNull()
    expect(Number(m![1])).toBe(m![2].split(', ').length + Number(m![3]))
  })

  for (const [width, left, right] of [
    [1440, 80, 20],
    [1470, 80, 50],
    [1500, 80, 80],
    [1920, 290, 290],
  ]) {
    test(`the space at the left and at the right of the two columns at ${width} px: ${left} and ${right}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await openMap(page, 'acts')
      const space = await page.evaluate(() => {
        const W = document.documentElement.clientWidth
        return [document.querySelector('.map-head')!.getBoundingClientRect().left, W - document.querySelector('.map-holder')!.getBoundingClientRect().right]
      })
      expect(space).toEqual([left, right])
    })
  }
})

// docs/TASKS.md Task 39 step 1: the bold names of the first view, from "The drawing" rule 5 of section 15.11.
test.describe('map page, the bold names of Task 39', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  const bold = (page: Page) => page.locator('.map-names text[font-weight="700"]').allTextContents()

  test('Exodus: "Mount Sinai" and "Rephidim" are bold, and "Baal-zephon" is not', async ({ page }) => {
    await openMap(page, 'exodus')
    expect(await bold(page)).toEqual(['Mount Sinai', 'Rephidim'])
    expect(await mapNames(page)).toContain('Baal-zephon')
  })

  test('Daniel: "Dura" is not bold', async ({ page }) => {
    await openMap(page, 'daniel')
    expect(await bold(page)).not.toContain('Dura')
    expect(await mapNames(page)).toContain('Dura')
  })
})

/** The numbers of the map: the step, the last step, the offset, and the names and the dots of the step. */
async function mapState(page: Page) {
  return page.locator('.map-svg').evaluate((s) => {
    const d = (s as SVGSVGElement).dataset
    return {
      step: Number(d.step),
      last: Number(d.lastStep),
      x: Number(d.offsetX),
      y: Number(d.offsetY),
      names: Number(d.names),
      dots: Number(d.dots),
      w: Number(s.getAttribute('width')),
      h: Number(s.getAttribute('height')),
    }
  })
}

/** Waits until the step has its names. */
async function atStep(page: Page, step: number) {
  await expect(page.locator(`.map-svg[data-step="${step}"][data-ready="true"]`)).toBeVisible()
}

// docs/TASKS.md Task 39 step 5: the zoom, section 15.11 "The zoom, Task 39".
for (const layout of LAYOUTS) {
  test.describe(`map page, the zoom, ${layout.name} layout`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(layout.viewport)
    })

    test('"Zoom out" is off in the first view, and "Zoom in" is off at the last step', async ({ page }) => {
      await openMap(page, 'acts')
      const zoomIn = page.getByRole('button', { name: 'Zoom in' })
      const zoomOut = page.getByRole('button', { name: 'Zoom out' })
      await expect(zoomOut).toBeDisabled()
      await expect(zoomIn).toBeEnabled()
      const { last } = await mapState(page)
      expect(last).toBeGreaterThan(0)
      for (let step = 1; step <= last; step++) {
        await zoomIn.click()
        await atStep(page, step)
      }
      await expect(zoomIn).toBeDisabled()
      await expect(zoomOut).toBeEnabled()
    })

    test('Joshua: the number of names that show is larger after each of the first two steps', async ({ page }) => {
      await openMap(page, 'joshua')
      const names = [(await mapState(page)).names]
      for (const step of [1, 2]) {
        await page.getByRole('button', { name: 'Zoom in' }).click()
        await atStep(page, step)
        names.push((await mapState(page)).names)
      }
      expect(names[1]).toBeGreaterThan(names[0])
      expect(names[2]).toBeGreaterThan(names[1])
    })

    test('a drag after a zoom moves the map, and the view stays in the first view', async ({ page }) => {
      await openMap(page, 'joshua')
      await page.getByRole('button', { name: 'Zoom in' }).click()
      await atStep(page, 1)
      const before = await mapState(page)
      const box = (await page.locator('.map-svg').boundingBox())!
      const cx = box.x + box.width / 2
      const cy = box.y + box.height / 2
      await page.mouse.move(cx, cy)
      await page.mouse.down()
      await page.mouse.move(cx - 60, cy - 40, { steps: 5 })
      await page.mouse.up()
      const after = await mapState(page)
      expect([after.x - before.x, after.y - before.y]).toEqual([60, 40])
      // A long drag stops at the edge of the first view: at step 1, the offset is from 0 to the size of the frame.
      await page.mouse.move(cx, cy)
      await page.mouse.down()
      await page.mouse.move(cx + 3000, cy + 3000, { steps: 5 })
      await page.mouse.up()
      expect(await mapState(page)).toMatchObject({ x: 0, y: 0 })
      await page.mouse.move(box.x + 5, box.y + 5)
      await page.mouse.down()
      await page.mouse.move(box.x + 5 - 3000, box.y + 5 - 3000, { steps: 5 })
      await page.mouse.up()
      const end = await mapState(page)
      expect([end.x, end.y]).toEqual([end.w, end.h])
    })

    test('the keys move and zoom the map when it has the focus', async ({ page }) => {
      await openMap(page, 'joshua')
      await page.locator('.map-svg').focus()
      await page.keyboard.press('+')
      await atStep(page, 1)
      const before = await mapState(page)
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('ArrowDown')
      expect(await mapState(page)).toMatchObject({ x: before.x + 80, y: before.y + 80 })
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowUp')
      expect(await mapState(page)).toMatchObject({ x: before.x, y: before.y })
      await page.keyboard.press('-')
      await atStep(page, 0)
      expect(await mapState(page)).toMatchObject({ x: 0, y: 0 })
    })

    test('a key with Ctrl or Alt is for the browser, and the map does not use it', async ({ page }) => {
      await openMap(page, 'joshua')
      await page.locator('.map-svg').focus()
      await page.keyboard.press('Control+Equal')
      await page.keyboard.press('Alt+Equal')
      await page.waitForTimeout(200)
      expect((await mapState(page)).step).toBe(0)
      await page.keyboard.press('+')
      await atStep(page, 1)
      const before = await mapState(page)
      await page.keyboard.press('Control+Minus')
      await page.keyboard.press('Alt+ArrowRight')
      await page.waitForTimeout(200)
      expect(await mapState(page)).toMatchObject({ step: 1, x: before.x, y: before.y })
    })

    test('Joshua: the axe check after a zoom', async ({ page }) => {
      await openMap(page, 'joshua')
      await page.getByRole('button', { name: 'Zoom in' }).click()
      await atStep(page, 1)
      await page.waitForTimeout(400)
      const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
      expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
    })
  })
}

test.describe('map page, one finger at 390 by 844 px', () => {
  // A phone: the page has touch input.
  test.use({ hasTouch: true })

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  /** A drag of one finger on the map, up by 200 px, with the touch input of Chromium. */
  async function fingerDrag(page: Page) {
    const client = await page.context().newCDPSession(page)
    const box = (await page.locator('.map-svg').boundingBox())!
    const x = box.x + box.width / 2
    const y = box.y + box.height - 20
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
    for (let i = 1; i <= 10; i++) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - 20 * i }] })
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  }

  test('in the first view, a drag with one finger on the map scrolls the page', async ({ page }) => {
    await openMap(page, 'joshua')
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
    await fingerDrag(page)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(50)
    expect(await mapState(page)).toMatchObject({ step: 0, x: 0, y: 0 })
  })

  test('after a zoom, a drag with one finger moves the map and not the page', async ({ page }) => {
    await openMap(page, 'joshua')
    await page.getByRole('button', { name: 'Zoom in' }).click()
    await atStep(page, 1)
    const before = await mapState(page)
    const scrollBefore = await page.evaluate(() => window.scrollY)
    await fingerDrag(page)
    await expect.poll(async () => (await mapState(page)).y).toBeGreaterThan(before.y)
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore)
  })
})

test.describe('map page, a change of the size of the window', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('Joshua: the step stays when the frame changes size, and a window of 1 px does not stop the page', async ({ page }) => {
    await openMap(page, 'joshua')
    for (const step of [1, 2]) {
      await page.getByRole('button', { name: 'Zoom in' }).click()
      await atStep(page, step)
    }
    const heightBefore = await page.locator('.map-svg').getAttribute('height')
    // A lower window gives a lower frame: 62% of the window height.
    await page.setViewportSize({ width: 390, height: 700 })
    await expect(page.locator('.map-svg')).not.toHaveAttribute('height', heightBefore!)
    expect((await mapState(page)).step).toBe(2)
    // A window of 1 by 1 px gives a frame with no area. Before the correction, the page stopped in a loop.
    await page.setViewportSize({ width: 1, height: 1 })
    await page.waitForTimeout(200)
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(page.locator('.map-svg')).toHaveAttribute('height', heightBefore!)
    expect((await mapState(page)).step).toBe(2)
    await page.screenshot({ fullPage: true, timeout: 10000 })
  })
})

// docs/TASKS.md Task 39b step 5: the names with no edge, the switch for the places that are not certain, and the
// double click, section 15.11.
const SWITCH = 'Places that are not certain'
const NEW_SENTENCE = /^\d+ of them (have|has) a position that is not certain, and the map does not show (them|it)\.$/

/** The state of the map: the numbers and the names, for a comparison. */
async function firstViewState(page: Page) {
  const d = await page.locator('.map-svg').evaluate((s) => ({ ...(s as SVGSVGElement).dataset }))
  return { dots: d.dots, names: d.names, list: await mapNames(page) }
}

for (const layout of LAYOUTS) {
  test.describe(`map page, Task 39b, ${layout.name} layout`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(layout.viewport)
    })

    test('Acts: no name has a stroke, and the lines stop at the names', async ({ page }) => {
      await openMap(page, 'acts')
      const strokes = await page.locator('.map-names text').evaluateAll((ts) => [...new Set(ts.map((t) => getComputedStyle(t).stroke))])
      expect(strokes).toEqual(['none'])
      // The mask of the lines has one hole for each name.
      const holes = await page.locator('.map-svg mask rect[fill="#000"]').count()
      expect(holes).toBe(await page.locator('.map-names text').count())
    })

    test('Joshua: the switch is on first; off, the map has no open sign and the page has the new sentence', async ({ page }) => {
      await openMap(page, 'joshua')
      const button = page.getByRole('button', { name: SWITCH })
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      await expect(button).toHaveText(`${SWITCH} on`)
      const before = await firstViewState(page)
      expect(await page.locator('.map-dots [fill="#fff"]').count()).toBeGreaterThan(0)
      await expect(page.locator('.map-counts p').filter({ hasText: NEW_SENTENCE })).toHaveCount(0)

      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'false')
      await expect(button).toHaveText(`${SWITCH} off`)
      await expect(page.locator('.map-svg[data-ready="true"]')).toBeVisible()
      // An open dot and an open triangle are white inside.
      expect(await page.locator('.map-dots [fill="#fff"]').count()).toBe(0)
      await expect(page.locator('.map-counts p').nth(1)).toHaveText(NEW_SENTENCE)

      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('.map-counts p').filter({ hasText: NEW_SENTENCE })).toHaveCount(0)
      expect(await firstViewState(page)).toEqual(before)
    })

    test('Joshua: the state stays after a reload, and Exodus opens with the same state', async ({ page }) => {
      await openMap(page, 'joshua')
      await page.getByRole('button', { name: SWITCH }).click()
      await page.reload()
      await expect(page.locator('.map-svg[data-ready="true"]')).toBeVisible()
      await expect(page.getByRole('button', { name: SWITCH })).toHaveAttribute('aria-pressed', 'false')
      await openMap(page, 'exodus')
      await expect(page.getByRole('button', { name: SWITCH })).toHaveAttribute('aria-pressed', 'false')
      await expect(page.locator('.map-counts p').nth(1)).toHaveText(NEW_SENTENCE)
      expect(await page.locator('.map-dots [fill="#fff"]').count()).toBe(0)
    })

    test('Ephesians has no switch', async ({ page }) => {
      await openMap(page, 'ephesians')
      await expect(page.getByRole('button', { name: SWITCH })).toHaveCount(0)
    })

    test('Joshua: the axe check with the switch off', async ({ page }) => {
      await openMap(page, 'joshua')
      await page.getByRole('button', { name: SWITCH }).click()
      await expect(page.getByRole('button', { name: SWITCH })).toHaveAttribute('aria-pressed', 'false')
      const result = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
      expect(result.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`))).toEqual([])
    })
  })
}

test.describe('map page, the double click at 1440 by 900 px', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('Joshua: a double click zooms in one step, and the point stays below the pointer', async ({ page }) => {
    await openMap(page, 'joshua')
    const box = (await page.locator('.map-svg').boundingBox())!
    const at = { x: 300, y: 250 }
    await page.mouse.dblclick(box.x + at.x, box.y + at.y)
    await atStep(page, 1)
    // The point of the map below the pointer was at (300, 250) of step 0, so it is at (600, 500) of step 1. The frame
    // shows it at (300, 250) if the offset is (300, 250).
    expect(await mapState(page)).toMatchObject({ step: 1, x: at.x, y: at.y })
    // The double click selects no text on the page.
    expect(await page.evaluate(() => window.getSelection()?.toString() ?? '')).toBe('')
  })

  test('Joshua: at the last step, a double click changes nothing', async ({ page }) => {
    await openMap(page, 'joshua')
    const last = (await mapState(page)).last
    for (let s = 1; s <= last; s++) {
      await page.getByRole('button', { name: 'Zoom in' }).click()
      await atStep(page, s)
    }
    const before = await mapState(page)
    const box = (await page.locator('.map-svg').boundingBox())!
    await page.mouse.dblclick(box.x + 200, box.y + 200)
    await page.waitForTimeout(400)
    expect(await mapState(page)).toEqual(before)
  })
})

test.describe('map page, the double tap at 390 by 844 px', () => {
  test.use({ hasTouch: true })

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('in the first view, a double tap zooms in one step', async ({ page }) => {
    await openMap(page, 'joshua')
    const client = await page.context().newCDPSession(page)
    const box = (await page.locator('.map-svg').boundingBox())!
    const x = box.x + 150
    const y = box.y + 200
    for (let i = 0; i < 2; i++) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    }
    await atStep(page, 1)
    await page.waitForTimeout(500)
    // One step, and not two: the browser makes no second zoom from the taps.
    expect(await mapState(page)).toMatchObject({ step: 1, x: 150, y: 200 })
  })
})
