// C3 static handoff guards (content-toolchain.md §5; application-and-ui.md
// §3.3; architecture.md §12). Source text is inlined at build time by Vite; no
// runtime file system, clock, randomness, network or storage is consulted.
import { describe, expect, it } from 'vitest';
import packageSource from '../../package.json?raw';
import { loadContent } from '../../src/content/index';
import { parseCardSet } from '../../tools/content/schema.ts';
import { zone1CardSet, zone1DeclaredStart } from '../fixtures/zone1';

const SRC_SOURCES = import.meta.glob('../../src/**/*.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const TEST_SOURCES = import.meta.glob('../../tests/**/*.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const CONTENT_SOURCES = import.meta.glob('../../src/content/**/*.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// Built from parts so this guard never trips on its own source text.
const RETIRED_STUB_PATH = ['content', 'stub'].join('/');
const YAML_IMPORT =
  /(?:from\s+|import\s*\(\s*)['"](?:yaml|js-yaml|[^'"]*\/yaml)['"]/u;
const VALIDATOR_DEFINITION =
  /\b(?:export\s+)?(?:function|const|let|var)\s+validateContent\b/u;

function offenders(
  sources: Record<string, string>,
  shouldInclude: (source: string) => boolean,
): readonly string[] {
  return Object.entries(sources)
    .filter(([, source]) => shouldInclude(source))
    .map(([path]) => path);
}

describe('generated handoff hygiene (content-toolchain.md §5, §8)', () => {
  it('CT-HAND-05: loadContent returns generated data and src imports no stub or YAML parser', () => {
    expect(
      offenders(SRC_SOURCES, (source) => source.includes(RETIRED_STUB_PATH)),
      'no module under src/ may import the retired stub, including GameState',
    ).toEqual([]);
    expect(
      offenders(SRC_SOURCES, (source) => YAML_IMPORT.test(source)),
      'the static runtime must not parse YAML at build or runtime',
    ).toEqual([]);

    const parsed = parseCardSet(zone1CardSet());
    expect(parsed.findings).toEqual([]);
    const declared = zone1DeclaredStart({
      cards: Object.entries(parsed.parsed).map(([path, data]) => ({
        path,
        data,
      })),
    });
    const bundle = loadContent();
    expect(
      bundle.worlds.all.map((world) => world.id),
      'loadContent must return the generated world',
    ).toEqual([declared.worldId]);
    expect(
      bundle.rooms.all.map((room) => room.id),
      'loadContent must return the generated rooms in declaration order',
    ).toEqual([...declared.roomIds]);
  });

  it('CT-HAND-08: no test imports or reads the retired stub', () => {
    expect(
      offenders(TEST_SOURCES, (source) => source.includes(RETIRED_STUB_PATH)),
      'test fixtures must use a local deterministic bundle instead',
    ).toEqual([]);
  });

  it('CT-HAND-09: only the canonical validator is defined under src/content', () => {
    expect(
      offenders(CONTENT_SOURCES, (source) => VALIDATOR_DEFINITION.test(source)),
      'boot and Vitest must share src/content/validateContent.ts',
    ).toEqual(['../../src/content/validateContent.ts']);
  });

  it('CT-HAND-10: dependencies and src carry no YAML parser', () => {
    const manifest: unknown = JSON.parse(packageSource);
    const dependencies =
      typeof manifest === 'object' &&
      manifest !== null &&
      'dependencies' in manifest
        ? manifest.dependencies
        : undefined;
    const names =
      typeof dependencies === 'object' && dependencies !== null
        ? Object.keys(dependencies)
        : [];
    expect(
      names.filter((name) => name === 'yaml' || name === 'js-yaml'),
      'yaml and js-yaml must not be runtime dependencies',
    ).toEqual([]);
    expect(
      offenders(SRC_SOURCES, (source) => YAML_IMPORT.test(source)),
      'no shipped module may import a YAML parser',
    ).toEqual([]);
  });
});
