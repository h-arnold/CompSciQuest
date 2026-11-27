// W6 content handoff: the accepted card set, its approved counts, the twelve
// canonical coverage headings and the authored quiz/hint wiring. The handoff
// totals are recorded for reference only and are not a canonical source. No
// file is written and no wall clock, randomness, network or browser storage is
// consulted.
import { describe, expect, it } from 'vitest';
import { parseCardSet } from '../../tools/content/schema.ts';
import { authoredBundle } from '../fixtures/authored';
import {
  COVERAGE_TOPIC_IDS,
  LOCAL_FIXTURE_COVERAGE_TOPIC_IDS,
} from '../fixtures/content';
import type { ParsedCardSet } from '../fixtures/contentToolchain';
import { AREA_ID } from '../fixtures/contentToolchain';
import { expectedZone1Counts, zone1CardSet } from '../fixtures/zone1';

function acceptedCards(): ParsedCardSet {
  const parsed = parseCardSet(zone1CardSet());
  expect(
    parsed.findings,
    'the accepted cards must parse without findings',
  ).toEqual([]);
  return {
    cards: Object.entries(parsed.parsed).map(([path, data]) => ({
      path,
      data,
    })),
  };
}

describe('accepted content handoff (HANDOFF §3, §7)', () => {
  it('W6H-CARDS-01: the handoff declares all twenty-four accepted card files', () => {
    expect(zone1CardSet().files.map((file) => file.path)).toEqual([
      `${AREA_ID}/hazards.yaml`,
      `${AREA_ID}/hints.yaml`,
      `${AREA_ID}/npcs.yaml`,
      `${AREA_ID}/puzzles.yaml`,
      `${AREA_ID}/quizzes.yaml`,
      `${AREA_ID}/rooms.yaml`,
      '1-4-concourse/rooms.yaml',
      '1-4-programming-constructs/hazards.yaml',
      '1-4-programming-constructs/hints.yaml',
      '1-4-programming-constructs/npcs.yaml',
      '1-4-programming-constructs/puzzles.yaml',
      '1-4-programming-constructs/quizzes.yaml',
      '1-4-programming-constructs/rooms.yaml',
      'assistance-ward/hazards.yaml',
      'assistance-ward/hints.yaml',
      'assistance-ward/npcs.yaml',
      'assistance-ward/puzzles.yaml',
      'assistance-ward/quizzes.yaml',
      'assistance-ward/rooms.yaml',
      'entry-interface/npcs.yaml',
      'entry-interface/rooms.yaml',
      'network-hub/npcs.yaml',
      'network-hub/rooms.yaml',
      'spec-topics.yaml',
    ]);
  });

  it('W6H-COUNTS-01: card-derived counts equal the approved whole-game totals', () => {
    // Accepted-card authority: the accepted YAML cards, the topic records in
    // docs/coverage/COVERAGE.md and walkthrough.md §8.4 — never the bundle.
    expect(expectedZone1Counts(acceptedCards())).toEqual({
      rooms: 23,
      items: 64,
      areas: 6,
      worlds: 1,
      actors: 20,
      actorStates: 22,
      conversationTopics: 123,
      nodes: 7,
      quizzes: 15,
      questions: 60,
      puzzles: 24,
      hazards: 8,
      hints: 16,
      specTopics: 11,
    });
  });

  it('W6H-COVERAGE-01: all twelve canonical headings are injected, and the local fixture only extends them', () => {
    const canonicalIds = [
      'switch-to-bit',
      'data-types',
      'number-conversion',
      'character-representation',
      'graphics-representation',
      'sound-representation',
      'data-storage-units',
      'data-compression',
      'tutorial-mechanics',
      'ai-ethics-and-implications',
      'algorithms-and-pseudocode',
      'programming-constructs',
    ];
    expect(COVERAGE_TOPIC_IDS).toEqual(canonicalIds);
    expect(LOCAL_FIXTURE_COVERAGE_TOPIC_IDS).toEqual([
      ...canonicalIds,
      'topic-1',
    ]);
  });

  it('W6H-QUIZWIRE-01: every accepted quiz and hint ladder resolves by ID', () => {
    // Regenerated from the accepted cards, not invented: see
    // docs/content/assistance-ward/hints.yaml and walkthrough.md §8.4.
    expect(authoredBundle.quizzes.all).toHaveLength(15);
    expect(authoredBundle.hints.all).toHaveLength(16);
    for (const quiz of authoredBundle.quizzes.all) {
      expect(authoredBundle.quizzes.getById(quiz.id)).toBe(quiz);
    }
    for (const hint of authoredBundle.hints.all) {
      expect(authoredBundle.hints.getById(hint.id)).toBe(hint);
    }
  });
});
