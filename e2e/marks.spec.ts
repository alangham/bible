/// <reference lib="dom" />
// The marks of the words of Jesus in the data change no page. docs/TASKS.md Task 26 step 9.
// Task 27 shows the red letters. Until then, no element of a chapter has the color of red letters.

import { readFileSync } from 'node:fs'
import { expect, test, type Locator, type Page } from '@playwright/test'

type Item = string | { v?: number; a?: string; o?: number; j?: string | 1 }
interface TextFile {
  chapters: { blocks: { k: string; c?: Item[] }[] }[]
}

/** The color of red letters, docs/DESIGN.md section 11.4, as the browser gives it. */
const RED = 'rgb(139, 26, 26)'

/** The words of each verse of a chapter in a data file: strings, added words, and marked words. */
function dataVerses(folder: 'text' | 'text-kjv', book: string, c: number): Map<number, string> {
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

test('the marks change no word and no color: Matthew 4 and John 3 in the two translations', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const [translation, folder] of [
    ['bsb', 'text'],
    ['kjv', 'text-kjv'],
  ] as const) {
    await page.goto('./#/')
    await page.evaluate((t) => localStorage.setItem('bible-translation', t), translation)
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
      // The data has marks in each of these chapters.
      const marked = JSON.stringify(JSON.parse(readFileSync(new URL(`../public/data/${folder}/${book}.json`, import.meta.url), 'utf8')).chapters[n - 1])
      expect(marked, `${translation} ${book} ${n}: the data has marks`).toContain('"j":')
      const red = await section.evaluate(
        (el, red) => [el, ...el.querySelectorAll('*')].filter((x) => getComputedStyle(x).color === red).map((x) => x.outerHTML.slice(0, 80)),
        RED,
      )
      expect(red, `${translation} ${book} ${n}: elements in the color of red letters`).toEqual([])
    }
  }
})
