// The red letters switch. docs/TASKS.md Task 27 step 8.

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
  return import('./redLetters.ts')
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('red letters switch', () => {
  it('is on at the first visit', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    const r = await load()
    expect(r.getRedLetters()).toBe(true)
  })

  it('keeps "off" and "on" in the storage, with the key bible-red-letters, and a new load reads them', async () => {
    const storage = memoryStorage()
    vi.stubGlobal('localStorage', storage)
    let r = await load()
    expect(r.RED_LETTERS_KEY).toBe('bible-red-letters')
    r.setRedLetters(false)
    expect(r.getRedLetters()).toBe(false)
    expect(storage.data.get('bible-red-letters')).toBe('off')
    r = await load()
    expect(r.getRedLetters()).toBe(false)
    r.setRedLetters(true)
    expect(storage.data.get('bible-red-letters')).toBe('on')
    r = await load()
    expect(r.getRedLetters()).toBe(true)
  })

  it('is on when the stored value is not "off"', async () => {
    vi.stubGlobal('localStorage', memoryStorage({ 'bible-red-letters': 'red' }))
    const r = await load()
    expect(r.getRedLetters()).toBe(true)
  })

  it('is on when the storage fails', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    })
    const r = await load()
    expect(r.getRedLetters()).toBe(true)
    r.setRedLetters(false)
    expect(r.getRedLetters()).toBe(false)
  })
})
