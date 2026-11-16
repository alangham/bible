/// <reference lib="dom" />
// The words-of-Jesus marks in the data change no word of a page. docs/TASKS.md Task 26 step 9.
// From Task 27, the page shows red letters when the red letters switch is on. This test runs with red letters
// off: then no element of a chapter has the color of red letters. e2e/redletters.spec.ts tests red letters on.

import { readFileSync } from 'node:fs'
import { expect, test, type Locator, type Page } from '@playwright/test'

type Item = string | { v?: number; a?: string; o?: number; j?: string | 1 }
interface TextFile {
  chapters: { blocks: { k: string; c?: Item[] }[] }[]
}

/** The color of red letters, docs/DESIGN.md section 11.4, as the browser gives it. */
const RED = 'rgb(139, 26, 26)'

/** The words of each verse of a chapter in a data file: strings, added words, and the words of a words-of-Jesus mark. */
function dataVerses(folder: 'text' | 'text-kjv' | 'text-web', book: string, c: number): Map<number, string> {
  const text = JSON.parse(readFileSync(new URL(`../public/data/${folder}/${book}.json`, import.meta.url), 'utf8')) as TextFile
  const out = new Map<number, string>()
  let verse = 0
  for (const block of text.chapters[c - 1].blocks) {
    if (block.k !== 'p') continue
    for (const item of block.c ?? []) {
      if (typeof item === 'object' && item.v !== undefined) {
        verse = item.v
        out.set(verse, '')
        continue
      }
      const words = typeof item === 'string' ? item : item.a !== undefined ? item.a : typeof item.j === 'string' ? item.j : ''
      out.set(verse, (out.get(verse) ?? '') + words)
    }
  }
  for (const [v, t] of out) out.set(v, t.replace(/\s+/g, ' ').trim())
  return out
}

const chapter = (page: Page, book: string, n: number) => page.locator(`section.rd-chapter[data-book="${book}"][data-chapter="${n}"]`)

/**
 * The words of each verse on the page: the text from a verse number to the next verse number, without the
 * link controls, the headings, the cross-reference lines, and the text for a screen reader.
 */
function pageVerses(section: Locator): Promise<[number, string][]> {
  return section.evaluate((el) => {
    const body = el.querySelector('.chapter-body')
    const out: [number, string][] = []
    if (!body) return out
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (node instanceof HTMLElement) {
        if (node.classList.contains('vn') && !node.closest('.omitted')) out.push([Number(node.dataset.verse), ''])
        continue
      }
      const parent = node.parentElement
      if (!out.length || !parent || parent.closest('button, .sr-only, .vn, h3, h4, .link-line, .sh-ms, .omitted')) continue
      out[out.length - 1][1] += node.textContent
    }
    return out.map(([v, t]) => [v, t.replace(/\s+/g, ' ').trim()] as [number, string])
  })
}

test('the words-of-Jesus marks change no word, and with red letters off no color: Matthew 4 and John 3 in the three translations', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const [translation, folder] of [
    ['bsb', 'text'],
    ['kjv', 'text-kjv'],
    ['web', 'text-web'],
  ] as const) {
    await page.goto('./#/')
    await page.evaluate((t) => localStorage.setItem('bible-translation', t), translation)
    await page.evaluate(() => localStorage.setItem('bible-red-letters', 'off'))
    for (const [book, n] of [
      ['matthew', 4],
      ['john', 3],
    ] as const) {
      await page.goto(`./#/book/${book}/${n}`)
      await page.reload()
      const section = chapter(page, book, n)
      await expect(section).toHaveAttribute('data-translation', translation)
      await expect(section).toHaveAttribute('data-loaded', 'true')
      const data = dataVerses(folder, book, n)
      const shown = await pageVerses(section)
      expect(shown.map(([v]) => v), `${translation} ${book} ${n}: the verse numbers`).toEqual([...data.keys()])
      for (const [v, words] of shown) expect(words, `${translation} ${book} ${n}:${v}`).toBe(data.get(v))
      // The data has words-of-Jesus marks in each of these chapters.
      const chapterData = JSON.stringify(JSON.parse(readFileSync(new URL(`../public/data/${folder}/${book}.json`, import.meta.url), 'utf8')).chapters[n - 1])
      expect(chapterData, `${translation} ${book} ${n}: the data has words-of-Jesus marks`).toContain('"j":')
      const red = await section.evaluate(
        (el, red) => [el, ...el.querySelectorAll('*')].filter((x) => getComputedStyle(x).color === red).map((x) => x.outerHTML.slice(0, 80)),
        RED,
      )
      expect(red, `${translation} ${book} ${n}: elements in the color of red letters`).toEqual([])
    }
  }
})
