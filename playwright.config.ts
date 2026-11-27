// Playwright configuration for the static GitHub Pages build.
// Playwright is installed globally in this container and there is no local
// @playwright/test package, so the config is a plain exported object: this
// keeps config loading independent of module resolution from the repo root.

// Defaults preserve local/CI behaviour; E2E_PORT/E2E_BASE_URL allow QA runs
// against an already-running dev server on another port.
const port = process.env.E2E_PORT ?? '5173';
const baseURL =
  process.env.E2E_BASE_URL ?? `http://localhost:${port}/CompSciQuest/`;

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
    command: `npm run dev -- --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
};
