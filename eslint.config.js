import js from '@eslint/js';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';

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
    files: [
      'eslint.config.js',
      '**/*.test.js',
      '**/*.spec.js',
      'tests/**/*.js',
      'e2e/**/*.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
