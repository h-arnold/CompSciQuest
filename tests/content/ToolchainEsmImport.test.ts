// CT-IMPORT-01: the canonical validator module must load under a plain Node ESM
// process so all three content CLI commands can reach their command path, and
// Vitest must see the same shared gate functions.
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const VALIDATOR_SPECIFIER = './src/content/validateContent.ts';
const IMPORT_OK = 'import-ok';
const NODE_ESM_IMPORT = `import('${VALIDATOR_SPECIFIER}').then(() => console.log('${IMPORT_OK}'))`;

describe('content toolchain ESM module resolution (content-toolchain.md §4–5)', () => {
  it('CT-IMPORT-01: the canonical validator loads under Node ESM without ERR_MODULE_NOT_FOUND and stays importable under Vitest', async () => {
    // A fresh process is used so this checks Node's own ESM resolution, not
    // Vite's extension-resolving transform. No card content is consulted.
    const result = spawnSync(
      process.execPath,
      ['--input-type=module', '-e', NODE_ESM_IMPORT],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );

    expect(
      result.status,
      `fresh Node ESM process could not import ${VALIDATOR_SPECIFIER}:\n${result.stderr}`,
    ).toBe(0);
    expect(result.stdout.trim()).toBe(IMPORT_OK);
    expect(result.stderr).not.toContain('ERR_MODULE_NOT_FOUND');

    const { validateContent } =
      await import('../../src/content/validateContent');
    expect(typeof validateContent).toBe('function');
  });
});
