import js from '@eslint/js';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.opencode/', // tool-managed integration files
      '**/graphify-out/', // generated graph/markdown reports
      'dist/',
      'coverage/',
      'node_modules/',
      'playwright-report/',
      'test-results/',
    ],
  },
  js.configs.recommended,
  unicorn.configs.recommended,
  sonarjs.configs.recommended,
  // TS parser + plugin; also disables core rules that TypeScript handles itself.
  ...tseslint.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // PascalCase paths are pinned by the design docs; authored placeholder
      // catalogues use kebab-case. Both remain enforced rather than disabled.
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            pascalCase: true,
            kebabCase: true,
          },
        },
      ],
    },
  },
  {
    files: [
      'eslint.config.js',
      '**/*.test.js',
      '**/*.spec.js',
      'tests/**/*.js',
      'e2e/**/*.js',
      '*.ts',
      'vite.config.ts',
      '**/*.test.ts',
      '**/*.spec.ts',
      'tests/**/*.ts',
      'e2e/**/*.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
