import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// CLAUDE.md hard rule: no ESV text and no request to the ESV API.
// TASKS.md Task 3 step 4: the build does not read VITE_ESV_API_KEY.
describe('no ESV in the code', () => {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const files = [
    ...readdirSync(join(root, 'src'), { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.(ts|tsx|css)$/.test(f) && !f.endsWith('noEsv.test.ts'))
      .map((f) => join(root, 'src', f)),
    join(root, 'index.html'),
    join(root, 'vite.config.ts'),
  ]

  it('has no reference to VITE_ESV_API_KEY or api.esv.org', () => {
    const offenders = files.filter((f) => /VITE_ESV_API_KEY|api\.esv\.org/.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('gives the deploy workflow no secret and no ESV key', () => {
    // The workflow checks dist for api.esv.org, so only these two are tested here.
    const workflow = readFileSync(join(root, '.github', 'workflows', 'deploy.yml'), 'utf8')
    expect(workflow).not.toMatch(/VITE_ESV_API_KEY/)
    expect(workflow).not.toMatch(/\$\{\{\s*secrets\./)
  })
})
