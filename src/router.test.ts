import { describe, expect, it } from 'vitest'
import { bookHref, parseRoute } from './router.ts'

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
})
