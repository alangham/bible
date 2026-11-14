import { describe, expect, it } from 'vitest'
import { bookHref, chapterHref, parseRoute, sourcesHref } from './router.ts'

describe('parseRoute', () => {
  it('gives the table for an empty hash', () => {
    expect(parseRoute('')).toEqual({ page: 'table' })
    expect(parseRoute('#/')).toEqual({ page: 'table' })
  })

  it('gives a book for #/book/<id>', () => {
    expect(parseRoute('#/book/1-samuel')).toEqual({ page: 'book', id: '1-samuel' })
  })

  it('reads back the href of a spine', () => {
    expect(parseRoute(bookHref('song-of-solomon'))).toEqual({ page: 'book', id: 'song-of-solomon' })
  })

  it('gives a spread for #/book/<id>/<chapter>', () => {
    expect(parseRoute('#/book/psalms/119')).toEqual({ page: 'spread', id: 'psalms', chapter: 119 })
    expect(parseRoute(chapterHref('1-john', 5))).toEqual({ page: 'spread', id: '1-john', chapter: 5 })
  })

  it('gives a spread at a verse for #/book/<id>/<chapter>/<verse>', () => {
    expect(parseRoute('#/book/exodus/24/8')).toEqual({ page: 'spread', id: 'exodus', chapter: 24, verse: 8 })
    expect(parseRoute(chapterHref('exodus', 24, 8))).toEqual({ page: 'spread', id: 'exodus', chapter: 24, verse: 8 })
  })

  it('gives the Sources page for #/sources', () => {
    expect(parseRoute(sourcesHref())).toEqual({ page: 'sources' })
  })

  it('does not accept chapter 0', () => {
    expect(parseRoute('#/book/genesis/0')).toEqual({ page: 'table' })
  })
})
