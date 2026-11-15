// The translation setting and the address of the text of each translation. docs/TASKS.md Task 21 step 10.

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

  it('has the two translations with their full names', async () => {
    const t = await load()
    expect(t.TRANSLATIONS).toEqual([
      { id: 'bsb', name: 'Berean Standard Bible' },
      { id: 'kjv', name: 'King James Version' },
    ])
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

  it('reads a value that it does not know as bsb', async () => {
    vi.stubGlobal('localStorage', memoryStorage({ 'bible-translation': 'esv' }))
    const t = await load()
    expect(t.getTranslation()).toBe('bsb')
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

  it('reads data/text/ for bsb and data/text-kjv/ for kjv, one time for each translation', async () => {
    vi.resetModules()
    const { loadBookText } = await import('./text.ts')
    await loadBookText('ruth', 'bsb')
    await loadBookText('ruth', 'kjv')
    await loadBookText('ruth', 'bsb')
    await loadBookText('ruth', 'kjv')
    const base = import.meta.env.BASE_URL
    expect(urls).toEqual([`${base}data/text/ruth.json`, `${base}data/text-kjv/ruth.json`])
  })
})
