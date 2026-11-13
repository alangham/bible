import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('shows the title "Books of the Bible"', () => {
    expect(renderToStaticMarkup(<App />)).toContain('<h1>Books of the Bible</h1>')
  })
})
