import { configDefaults, defineConfig } from 'vitest/config';

// GitHub Pages serves project sites from /<repository-name>/.
export default defineConfig({
  base: '/CompSciQuest/',
  test: {
    // Playwright specs live under e2e/ and are run by `npm run test:e2e`.
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
});
