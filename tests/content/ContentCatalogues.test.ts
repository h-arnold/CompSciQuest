// C3 handoff contract for the generated bundle (application-and-ui.md §3.1,
// §3.3; content-toolchain.md §2, §5). The obsolete two-room and stub-source
// expectations are replaced with the approved generated counts and IDs.
import { describe, expect, it } from 'vitest';
import { loadContent } from '../../src/content/index';
import { parseCardSet } from '../../tools/content/schema.ts';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { ParsedCardSet } from '../fixtures/contentToolchain';
import {
  ZONE1_CATALOGUES,
  ZONE1_SPEC_TOPIC_IDS,
  expectedZone1Counts,
  zone1CardSet,
  zone1DeclaredStart,
} from '../fixtures/zone1';

function zone1Cards(): ParsedCardSet {
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

function generatedRoomIds(): readonly string[] {
  return zone1DeclaredStart(zone1Cards()).roomIds;
}

function cataloguesOf(
  bundle: ContentBundle,
): Readonly<Record<string, readonly { readonly id: string }[]>> {
  return {
    rooms: bundle.rooms.all,
    items: bundle.items.all,
    areas: bundle.areas.all,
    worlds: bundle.worlds.all,
    actors: bundle.actors.all,
    actorStates: bundle.actorStates.all,
    conversationTopics: bundle.conversationTopics.all,
    nodes: bundle.nodes.all,
    quizzes: bundle.quizzes.all,
    questions: bundle.questions.all,
    puzzles: bundle.puzzles.all,
    hazards: bundle.hazards.all,
    hints: bundle.hints.all,
    specTopics: ZONE1_SPEC_TOPIC_IDS.flatMap((id) => {
      const topic = bundle.specTopics.getById(id);
      return topic === undefined ? [] : [topic];
    }),
  };
}

describe('generated content registration (application-and-ui.md §3.1, §3.3)', () => {
  it('CT-HAND-07: loadContent returns populated catalogues at the approved counts', () => {
    const bundle = loadContent();
    const catalogues = cataloguesOf(bundle);
    const counts = expectedZone1Counts(zone1Cards());

    expect(Object.keys(catalogues)).toHaveLength(14);
    for (const catalogue of ZONE1_CATALOGUES) {
      const expected = counts[catalogue.name];
      expect(
        expected,
        `${catalogue.name} must have a count derived from the accepted cards`,
      ).toBeTypeOf('number');
      expect(
        catalogues[catalogue.name],
        `${catalogue.name} must hold the approved generated count`,
      ).toHaveLength(expected ?? -1);
    }
    for (const [name, all] of Object.entries(catalogues)) {
      expect(name).toBeTypeOf('string');
      expect(all).toBeDefined();
    }
    expect(bundle.specTopics.getById).toBeTypeOf('function');
    expect(bundle.specTopics.getByRoomId).toBeTypeOf('function');
    expect(bundle.specTopics.getByAreaId).toBeTypeOf('function');
  });

  it('CT-HAND-07: declaration order and getById keep generated rooms stable', () => {
    const rooms = loadContent().rooms;
    const roomIds = generatedRoomIds();

    expect(
      rooms.all.map((room) => room.id),
      'rooms keep YAML declaration order',
    ).toEqual([...roomIds]);
    const firstRoom = rooms.all[0];
    expect(firstRoom).toBeDefined();
    expect(rooms.getById(firstRoom?.id ?? '')).toBe(firstRoom);
    expect(rooms.getById('no-such-room')).toBeUndefined();
    expect(() => rooms.getById('no-such-room')).not.toThrow();
  });

  it('CT-HAND-07: specTopics resolves all ten generated topic IDs', () => {
    const specTopics = loadContent().specTopics;

    for (const id of ZONE1_SPEC_TOPIC_IDS) {
      expect(
        specTopics.getById(id),
        `spec topic '${id}' must resolve from the generated bundle`,
      ).toBeDefined();
    }
    expect(specTopics.getById('no-such-topic')).toBeUndefined();
  });
});
