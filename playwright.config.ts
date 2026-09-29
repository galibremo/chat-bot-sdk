import { defineConfig, devices } from '@playwright/test';

const PORT = 5173; // demo/react/vite.config.ts

/**
 * Browser E2E against the React demo (rule 28). Every API call is mocked with
 * `page.route` inside the specs, so no run ever reaches a real workspace.
 * Build the packages first (`pnpm build`): the demo imports their `dist/`.
 */
export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm --filter demo-react dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: {
      // Vite honours BROWSER=none, so the demo's `open: true` stays a local-only default.
      BROWSER: 'none',
      // Process env wins over .env.local; the host is fake and every call is mocked.
      VITE_CHATBOT_API_KEY: 'ak_e2e_test',
      VITE_CHATBOT_API_BASE_URL: 'http://api.e2e.test',
    },
  },
});
