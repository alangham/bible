// The translation setting and the address of the text of each translation. docs/TASKS.md Task 21 step 10,
// and Task 31 step 10 for the World English Bible.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** A storage in memory, as the browser gives it. */
function memoryStorage(start: Record<string, string> = {}) {
  const data = new Map(Object.entries(start))
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    data,
  }
}

/** The module reads the storage when it loads, so each test loads it again. */
async function load() {
  vi.resetModules()
  return import('./translation.ts')
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('translation setting', () => {
  it('is bsb on the first visit', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    const t = await load()
    expect(t.getTranslation()).toBe('bsb')
  })

  it('has the three translations with their full names, in the order of the translation list', async () => {
    const t = await load()
    // The line of each translation, from Task 33, is checked in sampleVerse.test.ts.
    expect(t.TRANSLATIONS.map(({ id, name, short }) => ({ id, name, short }))).toEqual([
      { id: 'bsb', name: 'Berean Standard Bible', short: 'BSB' },
      { id: 'kjv', name: 'King James Version', short: 'KJV' },
      { id: 'web', name: 'World English Bible', short: 'WEB' },
    ])
  })

  it('reads the stored value web as web', async () => {
    vi.stubGlobal('localStorage', memoryStorage({ 'bible-translation': 'web' }))
    const t = await load()
    expect(t.getTranslation()).toBe('web')
  })

  it('keeps the selection web in the storage', async () => {
    const storage = memoryStorage()
    vi.stubGlobal('localStorage', storage)
    const t = await load()
    t.setTranslation('web')
    expect(storage.data.get('bible-translation')).toBe('web')
    const again = await load()
    expect(again.getTranslation()).toBe('web')
  })

  it('keeps the selection in the storage, with the key bible-translation', async () => {
    const storage = memoryStorage()
    vi.stubGlobal('localStorage', storage)
    const t = await load()
    t.setTranslation('kjv')
    expect(t.getTranslation()).toBe('kjv')
    expect(storage.data.get('bible-translation')).toBe('kjv')
    const again = await load()
    expect(again.getTranslation()).toBe('kjv')
  })

  it('reads a value that is not the id of a translation as bsb', async () => {
    for (const value of ['esv', 'WEB', 'World English Bible', 'webp', '', 'short', 'toString']) {
      vi.stubGlobal('localStorage', memoryStorage({ 'bible-translation': value }))
      const t = await load()
      expect(t.getTranslation(), value).toBe('bsb')
    }
  })

  it('holds the setting for the page when the storage is not available', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    })
    const t = await load()
    expect(t.getTranslation()).toBe('bsb')
    t.setTranslation('kjv')
    expect(t.getTranslation()).toBe('kjv')
  })
})

describe('short names', () => {
  // docs/TASKS.md Task 22 step 13. The translation control shows the short name.
  it('each translation has a short name, and the short names are different', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    const { TRANSLATIONS } = await load()
    for (const t of TRANSLATIONS) expect(t.short).toMatch(/\S/)
    expect(new Set(TRANSLATIONS.map((t) => t.short)).size).toBe(TRANSLATIONS.length)
    expect(TRANSLATIONS.map((t) => t.short)).toEqual(['BSB', 'KJV', 'WEB'])
  })
})

describe('loadBookText', () => {
  const urls: string[] = []
  beforeEach(() => {
    urls.length = 0
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        urls.push(url)
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 'ruth', name: 'Ruth', translation: '', chapters: [] }) })
      }),
    )
  })

  it('reads data/text/ for bsb, data/text-kjv/ for kjv, and data/text-web/ for web, one time for each translation', async () => {
    vi.resetModules()
    const { loadBookText } = await import('./text.ts')
    await loadBookText('ruth', 'bsb')
    await loadBookText('ruth', 'kjv')
    await loadBookText('ruth', 'web')
    await loadBookText('ruth', 'bsb')
    await loadBookText('ruth', 'kjv')
    await loadBookText('ruth', 'web')
    const base = import.meta.env.BASE_URL
    expect(urls).toEqual([`${base}data/text/ruth.json`, `${base}data/text-kjv/ruth.json`, `${base}data/text-web/ruth.json`])
  })
})
