// C3 generation contracts (content-toolchain.md §5; AGENTS.md 600-line cap;
// content-rules.md D4/D5). All emitted text comes from generateContent() in
// memory: no file is written, no clock, randomness, network or storage is used.
import { describe, expect, it } from 'vitest';
import prettierIgnore from '../../.prettierignore?raw';
import { generateContent } from '../../tools/content/generate.ts';
import { parseCardSet } from '../../tools/content/schema.ts';
import {
  GENERATED_PATHS,
  generatedFile,
  type GenerationResult,
  type ParsedCardSet,
} from '../fixtures/contentToolchain';
import {
  GENERATED_HEADER,
  ZONE1_CATALOGUES,
  ZONE1_OPTIONS,
  acceptedEmittedDates,
  emittedEntries,
  expectedZone1Counts,
  expectedZone1Ids,
  zone1CardSet,
} from '../fixtures/zone1';

function zone1Cards(): ParsedCardSet {
  const parsed = parseCardSet(zone1CardSet());
  expect(
    parsed.findings,
    'the clean zone-1 card set must parse without findings',
  ).toEqual([]);
  return {
    cards: Object.entries(parsed.parsed).map(([path, data]) => ({
      path,
      data,
    })),
  };
}

function zone1Generation(): GenerationResult {
  const result = generateContent(zone1Cards(), ZONE1_OPTIONS);
  expect(
    result.findings,
    'the clean zone-1 card set must pass every generation gate',
  ).toEqual([]);
  expect(result.ok, 'generation must succeed for the clean card set').toBe(
    true,
  );
  return result;
}

function nameOf(path: string): string {
  return (
    ZONE1_CATALOGUES.find((catalogue) => catalogue.path === path)?.name ?? ''
  );
}

describe('generated content emission (content-toolchain.md §5)', () => {
  it('CT-GEN-07: compact emitter keeps every module under 600 lines with all entries in order', () => {
    const result = zone1Generation();
    const expected = expectedZone1Ids(zone1Cards());

    expect(result.files).toHaveLength(14);
    for (const file of result.files) {
      expect(
        file.text,
        `${file.path} must retain the generated-file header`,
      ).toContain(GENERATED_HEADER);
      expect(
        file.text.split('\n').length,
        `${file.path} must stay within the 600-line source cap`,
      ).toBeLessThanOrEqual(600);
      expect(
        emittedEntries(file.text).map((entry) => entry['id']),
        `${file.path} must retain every entry in declaration order`,
      ).toEqual([...(expected[nameOf(file.path)] ?? [])]);
      expect(
        file.text,
        `${file.path} must carry no authoring data`,
      ).not.toContain('authoring');
    }

    expect(
      prettierIgnore,
      '.prettierignore must mark generated modules as never reformatted',
    ).toContain('src/content/authored/');
  });

  it('CT-GEN-08: all 14 declared modules carry exact counts, headers and no timestamps', () => {
    const result = zone1Generation();
    const counts = expectedZone1Counts(zone1Cards());
    const datePattern = /\b20\d{2}-\d{2}-\d{2}\b/gu;

    expect(
      result.files.map((file) => file.path),
      'one generated file per kind, in the declared table order',
    ).toEqual([...GENERATED_PATHS]);
    for (const file of result.files) {
      expect(
        file.text,
        `${file.path} must carry the generated header`,
      ).toContain(GENERATED_HEADER);
    }
    // content-toolchain.md §5 forbids generator-added timestamps. The accepted
    // Zone A spec-topic evidence itself quotes its 2026-11-25 acceptance date,
    // so the emitted dates must match the accepted cards exactly: no invented
    // generation stamp and no dropped piece of accepted prose.
    expect(
      result.files.flatMap((file) => file.text.match(datePattern) ?? []),
      'generated modules must carry no timestamp beyond accepted card text',
    ).toEqual(acceptedEmittedDates(zone1Cards()));
    for (const catalogue of ZONE1_CATALOGUES) {
      const expected = counts[catalogue.name];
      expect(
        expected,
        `${catalogue.name} must have a count derived from the accepted cards`,
      ).toBeTypeOf('number');
      expect(
        emittedEntries(generatedFile(result.files, catalogue.path)),
        `${catalogue.name} must emit the approved entry count`,
      ).toHaveLength(expected ?? -1);
    }
  });

  it('CT-GEN-09: authoring blocks, room topicIds and conventions never reach emitted TS', () => {
    const result = zone1Generation();
    const allText = result.files
      .map((file) => file.text)
      .join('\n')
      .toLowerCase();

    for (const token of [
      'authoring',
      'conventions',
      'topicIds',
      'root bible',
      'editor adjudication',
      'AltTopic',
    ]) {
      expect(
        allText,
        `${token} is authoring-only and must not reach the runtime`,
      ).not.toContain(token.toLowerCase());
    }

    const topics = emittedEntries(
      generatedFile(
        result.files,
        'src/content/authored/conversation-topics.ts',
      ),
    );
    expect(
      topics.filter((topic) => typeof topic['actorId'] === 'string').length,
      'authored ConversationTopic.actorId must survive into the runtime',
    ).toBeGreaterThan(0);
    expect(
      topics.some((topic) => topic['actorId'] === 'npc-the-ai'),
      'the declared actor binding must remain on its topic',
    ).toBe(true);
  });
});
