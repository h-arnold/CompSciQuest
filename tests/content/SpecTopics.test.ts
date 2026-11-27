// Red tests for incremental spec-topic authoring and generation. Coverage
// headings are injected as strings: the static toolchain never reads a coverage
// source from disk.
import { describe, expect, it } from 'vitest';
import {
  SPEC_TOPICS_PATH,
  findingText,
  generatedFile,
  loadGenerator,
  loadValidation,
  parsedCard,
  parsedSet,
} from '../fixtures/contentToolchain';

const SPEC_TOPICS_OUT = 'src/content/authored/spec-topics.ts';

interface TopicEntry {
  readonly id: string;
  readonly title: string;
  readonly specReference: string;
  readonly codeLocation: string;
  readonly status: string;
  readonly evidence: string;
  readonly roomIds: readonly string[];
  readonly maxScore: number;
}

function entry(overrides: Partial<TopicEntry> = {}): TopicEntry {
  return {
    id: 'data-types',
    title: 'Data types',
    specReference: '§1.2.1',
    codeLocation: 'src/content/authored/rooms.ts',
    status: 'covered',
    evidence: 'The binary hall teaches the five types.',
    roomIds: ['room-binary-hall'],
    maxScore: 2,
    ...overrides,
  };
}

function topicsCard(entries: readonly TopicEntry[]) {
  return parsedSet(
    parsedCard(SPEC_TOPICS_PATH, {
      kind: 'spec-topics',
      topics: entries,
    }),
  );
}

describe('spec topics (content-toolchain.md §2)', () => {
  it('CT-TOPIC-01: an id must match a ## Topic heading exactly and never be invented', async () => {
    const { validateCards } = await loadValidation();
    const headings = ['## Topic: data-types', '## Topic: number-conversion'];

    const matched = validateCards(topicsCard([entry()]), {
      coverageHeadings: headings,
    });
    expect(
      findingText(matched),
      'an id copied exactly from a coverage heading must be accepted',
    ).toBe('');

    const invented = topicsCard([entry({ id: 'invented-topic' })]);
    const before = JSON.stringify(invented);
    const findings = validateCards(invented, {
      coverageHeadings: headings,
    });
    expect(
      findings.length,
      'a topic with no heading must never be invented',
    ).toBeGreaterThan(0);
    expect(findingText(findings)).toContain('invented-topic');
    expect(JSON.stringify(invented)).toBe(before);
  });

  it('CT-TOPIC-02: topics are added incrementally from the injected coverage source', async () => {
    const { validateCards } = await loadValidation();

    const first = topicsCard([entry()]);
    expect(
      validateCards(first, { coverageHeadings: ['## Topic: data-types'] }),
    ).toEqual([]);

    // A second topic becomes valid only when a second heading exists; there is
    // no up-front enumeration of the whole specification.
    const secondEntry = entry({
      id: 'number-conversion',
      title: 'Number conversion',
      roomIds: ['room-binary-hall'],
    });
    const twoTopics = topicsCard([entry(), secondEntry]);
    expect(
      validateCards(twoTopics, {
        coverageHeadings: ['## Topic: data-types'],
      }).length,
    ).toBeGreaterThan(0);
    expect(
      validateCards(twoTopics, {
        coverageHeadings: [
          '## Topic: data-types',
          '## Topic: number-conversion',
        ],
      }),
      'adding the heading lets the new entry be accepted incrementally',
    ).toEqual([]);
  });

  it('CT-TOPIC-03: a generated entry has exactly the eight SpecTopic fields', async () => {
    const { generateContent } = await loadGenerator();
    const result = generateContent(topicsCard([entry()]));

    expect(result.ok).toBe(true);
    const text = generatedFile(result.files, SPEC_TOPICS_OUT);
    for (const field of [
      'id',
      'title',
      'specReference',
      'codeLocation',
      'status',
      'evidence',
      'roomIds',
      'maxScore',
    ]) {
      expect(text, `the generated entry must carry ${field}`).toContain(field);
    }
    expect(
      text,
      'world/area indexing stays in SpecTopicCatalogue, not on the entry',
    ).not.toContain('worldId');
    expect(text).not.toContain('areaId');
  });
});
