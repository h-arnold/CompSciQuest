// Playwright configuration for the static GitHub Pages build.
// Playwright is installed globally in this container and there is no local
// @playwright/test package, so the config is a plain exported object: this
// keeps config loading independent of module resolution from the repo root.

const baseURL = 'http://localhost:5173/CompSciQuest/';

export default {
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
};
