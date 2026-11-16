/// <reference lib="dom" />
// The name "Bible Wall", the title of the browser tab, and the icon. docs/DESIGN.md section 12, docs/TASKS.md Task 28 step 6.

import { expect, test, type Page } from '@playwright/test'

const WIDE = { width: 1440, height: 900 }
const NAME = 'Bible Wall'

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)

async function openWall(page: Page) {
  await page.setViewportSize(WIDE)
  await page.goto('./')
  await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
}

async function openChapter(page: Page, book: string, n: number) {
  await page.setViewportSize(WIDE)
  await page.goto(`./#/book/${book}/${n}`)
  await expect(chapter(page, book, n)).toHaveAttribute('data-loaded', 'true')
}

/**
 * The answer for an address: its status, its content type, and whether the body starts with the signature of
 * its file type. A missing file can give the page itself with the status 200, so the status alone is not enough.
 */
async function file(page: Page, url: string) {
  const answer = await page.request.get(url)
  const body = await answer.body()
  const type = (answer.headers()['content-type'] ?? '').split(';')[0].trim()
  const png = body.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  const svg = body.toString('utf8', 0, 200).trimStart().startsWith('<svg')
  return { status: answer.status(), type, png, svg }
}

/** Checks that an address gives a file of its type: a PNG image or an SVG image. */
async function expectImage(page: Page, url: string, label: string) {
  const f = await file(page, url)
  expect(f.status, label).toBe(200)
  if (url.endsWith('.png')) {
    expect(f.type, label).toBe('image/png')
    expect(f.png, `${label}: the PNG signature`).toBe(true)
  } else {
    expect(f.type, label).toBe('image/svg+xml')
    expect(f.svg, `${label}: the file starts with <svg`).toBe(true)
  }
}

test.describe('the title of the browser tab', () => {
  test('the wall has the title "Bible Wall", and its hidden heading is "Bible Wall"', async ({ page }) => {
    await openWall(page)
    await expect(page).toHaveTitle(NAME)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(NAME)
  })

  test('John 3, then a scroll to John 4, then "Books"', async ({ page }) => {
    await openChapter(page, 'john', 3)
    await expect(page).toHaveTitle('John 3 · Bible Wall')
    // The character between the place and the name is the middle dot U+00B7, with one space on each side.
    expect(await page.title()).toBe('John 3 · Bible Wall')
    const john4 = chapter(page, 'john', 4)
    for (let i = 0; i < 20 && (await john4.count()) === 0; i++) await page.mouse.wheel(0, 1200)
    await john4.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 20))
    await page.mouse.wheel(0, 300)
    await expect(page.locator('header.rd-bar .rd-where')).toContainText('4')
    await expect(page).toHaveTitle('John 4 · Bible Wall')
    await page.getByRole('link', { name: 'Books', exact: true }).click()
    await expect(page.locator('main.wall')).toHaveAttribute('data-ready', 'true')
    await expect(page).toHaveTitle(NAME)
  })

  test('after travel with "Go there", the title has the linked chapter', async ({ page }) => {
    await openChapter(page, 'genesis', 2)
    await expect(page).toHaveTitle('Genesis 2 · Bible Wall')
    await chapter(page, 'genesis', 2).getByRole('button', { name: 'Verse 24 has a quotation link to Matthew 19:5', exact: true }).first().click()
    await page.getByRole('dialog', { name: 'Matthew 19:5' }).getByRole('link', { name: 'Go there' }).click()
    await expect(chapter(page, 'matthew', 19)).toHaveAttribute('data-loaded', 'true')
    await expect(page).toHaveTitle('Matthew 19 · Bible Wall')
  })

  test('Psalm 23 has the book name of the top bar: "Psalms 23 · Bible Wall"', async ({ page }) => {
    await openChapter(page, 'psalms', 23)
    await expect(page.locator('header.rd-bar .rd-where b')).toHaveText('Psalms')
    await expect(page).toHaveTitle('Psalms 23 · Bible Wall')
  })

  test('the Reference pages have their titles', async ({ page }) => {
    await page.setViewportSize(WIDE)
    for (const [path, title] of [
      ['timeline', 'Timeline · Bible Wall'],
      ['quotations', 'Quotations · Bible Wall'],
      ['sources', 'Sources · Bible Wall'],
    ] as const) {
      await page.goto(`./#/${path}`)
      await expect(page).toHaveTitle(title)
    }
  })

  test('a book that the site does not have: "Bible Wall"', async ({ page }) => {
    await openChapter(page, 'john', 3)
    await expect(page).toHaveTitle('John 3 · Bible Wall')
    await page.goto('./#/book/no-such-book/1')
    await expect(page).toHaveTitle(NAME)
  })
})

test.describe('the icon and the manifest', () => {
  test('the page links to the icons and to the manifest, and each address gives a file', async ({ page }) => {
    await openWall(page)
    const links = await page.locator('head link').evaluateAll((els) =>
      (els as HTMLLinkElement[]).map((l) => ({ rel: l.rel, sizes: l.getAttribute('sizes'), type: l.type, href: l.href })),
    )
    const want = [
      { rel: 'icon', sizes: null, type: 'image/svg+xml', file: 'favicon.svg' },
      { rel: 'icon', sizes: '32x32', type: 'image/png', file: 'favicon-32.png' },
      { rel: 'icon', sizes: '16x16', type: 'image/png', file: 'favicon-16.png' },
      { rel: 'apple-touch-icon', sizes: null, type: '', file: 'apple-touch-icon.png' },
      { rel: 'manifest', sizes: null, type: '', file: 'manifest.webmanifest' },
    ]
    for (const w of want) {
      const link = links.find((l) => l.rel === w.rel && l.href.endsWith(`/bible/${w.file}`))
      expect(link, w.file).toBeDefined()
      expect(link!.sizes, w.file).toBe(w.sizes)
      expect(link!.type, w.file).toBe(w.type)
      if (w.rel === 'manifest') expect((await file(page, link!.href)).status, w.file).toBe(200)
      else await expectImage(page, link!.href, w.file)
    }
    await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute('content', NAME)
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#ffffff')
  })

  test('the manifest has the name "Bible Wall", and each of its three icons gives a file', async ({ page }) => {
    await openWall(page)
    const href = await page.locator('head link[rel="manifest"]').evaluate((l) => (l as HTMLLinkElement).href)
    const answer = await page.request.get(href)
    expect(answer.status()).toBe(200)
    const manifest = (await answer.json()) as { name: string; short_name: string; start_url: string; scope: string; display: string; icons: { src: string }[] }
    expect(manifest.name).toBe(NAME)
    expect(manifest.short_name).toBe(NAME)
    expect(manifest.start_url).toBe('/bible/')
    expect(manifest.scope).toBe('/bible/')
    expect(manifest.display).toBe('browser')
    expect(manifest.icons).toHaveLength(3)
    for (const icon of manifest.icons) {
      // The icon addresses are relative to the manifest.
      const url = new URL(icon.src, href).href
      expect(url).toContain('/bible/')
      await expectImage(page, url, icon.src)
    }
  })
})

test('no element of the wall, of John 3, or of the Sources page has the words "Books of the Bible"', async ({ page }) => {
  const old = () => page.evaluate(() => document.body.outerHTML.includes('Books of the Bible'))
  await openWall(page)
  expect(await old()).toBe(false)
  await openChapter(page, 'john', 3)
  expect(await old()).toBe(false)
  await page.goto('./#/sources')
  await expect(page).toHaveTitle('Sources · Bible Wall')
  expect(await old()).toBe(false)
})
