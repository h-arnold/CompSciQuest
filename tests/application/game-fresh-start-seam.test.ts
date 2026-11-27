// ENG24-FRESHSTART-DEDUP-01: one local fresh-start seam in Game.ts
// (ENGINE_ISSUES.md decision row 24 L54; PLAYTEST_ISSUES.md §24 L253-258;
// application-and-ui.md §4 L206-235 and §4.1 L237-265; architecture.md §3
// and §5; storage-schema.md §10 and §11). The seam is named createFreshState
// and must be the only place in Game.ts that calls the core initial-state
// factory. This structural check reads only the committed source file; all
// collaborators in the behavioural tests remain in-memory fakes.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  new URL('../../src/application/Game.ts', import.meta.url),
  'utf8',
);

function blockAfter(signature: RegExp): string {
  const match = signature.exec(source);
  expect(
    match,
    `Missing signature ${signature.source} in Game.ts`,
  ).not.toBeNull();
  const open = source.indexOf('{', match?.index ?? -1);
  expect(open).toBeGreaterThanOrEqual(0);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] !== '}') continue;
    depth -= 1;
    if (depth === 0) return source.slice(open, index + 1);
  }
  throw new Error(`Unbalanced block after ${signature.source} in Game.ts`);
}

describe('ENG24-FRESHSTART-DEDUP-01: a single fresh-state seam in Game.ts', () => {
  it('ENG24-FRESHSTART-DEDUP-01: exactly one local seam constructs fresh state and all three fresh-start call sites delegate to it', () => {
    const constructionCalls = source.match(/\bcreateInitial\s*\(/gu) ?? [];
    expect(
      constructionCalls,
      'Game.ts must construct fresh state at exactly one local seam',
    ).toHaveLength(1);

    const seam = /\b(?:const|function)\s+createFreshState\b/u.exec(source);
    expect(
      seam,
      'Game.ts must declare one local fresh-state seam named createFreshState',
    ).not.toBeNull();
    const seamStart = seam?.index ?? -1;
    expect(source.slice(seamStart, seamStart + 240)).toMatch(
      /\bcreateInitial\b/u,
    );
    expect(source).toMatch(
      /import\s*\{[^}]*\bcreateInitial\b[^}]*\}\s*from\s*'\.\.\/core\/GameState'/su,
    );

    expect(blockAfter(/\bnewGame\(\): void \{/u)).toContain(
      'createFreshState()',
    );
    expect(blockAfter(/\brestart\(\): void \{/u)).toContain(
      'createFreshState()',
    );
    expect(blockAfter(/\bcase 'restart': \{/u)).toContain('createFreshState()');
    // The same single seam also serves createGame's no-injected-state path;
    // otherwise the file would still contain a second fresh-state body.
    expect(blockAfter(/export function createGame\(/u)).toContain(
      'createFreshState()',
    );
  });

  it('ENG24-FRESHSTART-DEDUP-01: the public Game façade keeps its documented signatures', () => {
    const facade = blockAfter(/export interface Game \{/u);
    for (const signature of [
      'submit(raw: string): readonly GameEvent[];',
      'newGame(): void;',
      'continueGame(dto: SaveDto): void;',
      'restart(): void;',
      'getViewData(): GameViewData;',
      'save(): void;',
      'download(): void;',
      'importSave(text: string): LoadResult;',
    ]) {
      expect(facade, `Game façade must keep ${signature}`).toContain(signature);
    }
  });
});
