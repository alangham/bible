// The text size setting. docs/TASKS.md Task 24 step 10.

import { afterEach, describe, expect, it, vi } from 'vitest'

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
  return import('./textSize.ts')
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('text size setting', () => {
  it('is standard on the first visit', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    const t = await load()
    expect(t.getTextSize()).toBe('standard')
  })

  it('has the three sizes with their names, in this order', async () => {
    const t = await load()
    expect(t.TEXT_SIZES).toEqual([
      { id: 'standard', name: 'Standard' },
      { id: 'large', name: 'Large' },
      { id: 'largest', name: 'Largest' },
    ])
  })

  it('keeps each of the three values in the storage, with the key bible-text-size', async () => {
    for (const size of ['large', 'largest', 'standard'] as const) {
      const storage = memoryStorage()
      vi.stubGlobal('localStorage', storage)
      const t = await load()
      t.setTextSize(size === 'standard' ? 'large' : size)
      t.setTextSize(size)
      expect(t.getTextSize()).toBe(size)
      expect(storage.data.get('bible-text-size')).toBe(size)
      const again = await load()
      expect(again.getTextSize()).toBe(size)
    }
  })

  it('gives standard for a stored value that is not one of the three values', async () => {
    for (const wrong of ['huge', 'Large', '', '1']) {
      vi.stubGlobal('localStorage', memoryStorage({ 'bible-text-size': wrong }))
      const t = await load()
      expect(t.getTextSize()).toBe('standard')
    }
  })

  it('gives standard when the storage does not work', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    })
    const t = await load()
    expect(t.getTextSize()).toBe('standard')
    t.setTextSize('largest')
    expect(t.getTextSize()).toBe('largest')
  })
})
