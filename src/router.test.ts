import { describe, expect, it } from 'vitest'
import { bookHref, chapterHref, mapHref, parseRoute, quotationsHref, sourcesHref, timelineHref } from './router.ts'

describe('parseRoute', () => {
  it('gives the wall for an empty hash', () => {
    expect(parseRoute('')).toEqual({ page: 'wall' })
    expect(parseRoute('#/')).toEqual({ page: 'wall' })
  })

  it('gives a book for #/book/<id>', () => {
    expect(parseRoute('#/book/1-samuel')).toEqual({ page: 'book', id: '1-samuel' })
  })

  it('reads back the href of a book name', () => {
    expect(parseRoute(bookHref('song-of-solomon'))).toEqual({ page: 'book', id: 'song-of-solomon' })
  })

  it('gives a chapter for #/book/<id>/<chapter>', () => {
    expect(parseRoute('#/book/psalms/119')).toEqual({ page: 'chapter', id: 'psalms', chapter: 119 })
    expect(parseRoute(chapterHref('1-john', 5))).toEqual({ page: 'chapter', id: '1-john', chapter: 5 })
  })

  it('gives a chapter at a verse for #/book/<id>/<chapter>/<verse>', () => {
    expect(parseRoute('#/book/exodus/24/8')).toEqual({ page: 'chapter', id: 'exodus', chapter: 24, verse: 8 })
    expect(parseRoute(chapterHref('exodus', 24, 8))).toEqual({ page: 'chapter', id: 'exodus', chapter: 24, verse: 8 })
  })

  // docs/TASKS.md Task 38 step 1.
  it('gives the map of a book for #/book/<id>/map', () => {
    expect(mapHref('acts')).toBe('#/book/acts/map')
    expect(parseRoute(mapHref('1-samuel'))).toEqual({ page: 'map', id: '1-samuel' })
    expect(parseRoute('#/book/acts/map/')).toEqual({ page: 'map', id: 'acts' })
  })

  it('gives the quotation diagram for #/quotations', () => {
    expect(parseRoute(quotationsHref())).toEqual({ page: 'quotations' })
    expect(parseRoute('#/quotations/')).toEqual({ page: 'quotations' })
  })

  it('gives the Sources page for #/sources', () => {
    expect(parseRoute(sourcesHref())).toEqual({ page: 'sources' })
  })

  it('gives the timeline for #/timeline', () => {
    expect(timelineHref()).toBe('#/timeline')
    expect(parseRoute(timelineHref())).toEqual({ page: 'timeline' })
  })

  it('does not accept chapter 0', () => {
    expect(parseRoute('#/book/genesis/0')).toEqual({ page: 'wall' })
  })
})
