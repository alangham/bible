import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    // The site is served under the Vite base path /bible/.
    baseURL: 'http://localhost:4173/bible/',
    // A light device for each test, on each computer: with no stored value, the site follows the device,
    // docs/TASKS.md Task 46 step 6. A test of a dark device sets colorScheme itself.
    colorScheme: 'light',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/bible/',
    // Always start a new server. A stale server on the port can serve an old build.
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
