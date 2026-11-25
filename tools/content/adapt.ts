// Adapter from parsed YAML cards to the canonical ContentBundle so the shared
// runtime validator (src/content/validateContent.ts) remains the single owner
// of the structural checks it already implements (content-rules.md §7, D5).

import type { AreaDefinition } from '../../src/content/AreaDefinition.ts';
import { catalogueOf } from '../../src/content/Catalogue.ts';
import type { ContentBundle } from '../../src/content/ContentBundle.ts';
import type { ItemDefinition } from '../../src/content/ItemDefinition.ts';
import type { RoomDefinition } from '../../src/content/RoomDefinition.ts';
import type { WorldDefinition } from '../../src/content/WorldDefinition.ts';
import type { SpecTopic } from '../../src/core/scoring/SpecTopic.ts';
import { validateContent } from '../../src/content/validateContent.ts';
import type { Finding, ParsedCardSet, ValidationOptions } from './contracts.ts';
import { auditedAreaLikes, asText, coverageIds } from './gates/common.ts';

function strings(value: unknown): readonly string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function numbers(value: unknown): readonly number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === 'number')
    : [];
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function number(value: unknown): number {
  return typeof value === 'number' ? value : 0;
}

function isTrue(value: unknown): boolean {
  return value === true;
}

function unpack(value: unknown): readonly Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.flatMap((item) =>
        typeof item === 'object' && item !== null
          ? [item as Record<string, unknown>]
          : [],
      )
    : [];
}

export function bundleOf(cards: ParsedCardSet): ContentBundle {
  const of = (key: string): readonly Record<string, unknown>[] =>
    cards.cards.flatMap((card) => unpack(card.data[key]));

  const rooms = of('rooms') as unknown as readonly RoomDefinition[];
  // Invalid startRoomIds are deliberately kept: the shared validator reports
  // them as findings instead of silently dropping the area (content-rules.md
  // §7, D5).
  const areas = [
    ...of('areas'),
    ...cards.cards.flatMap((card) => {
      const definition = card.data['definition'];
      if (typeof definition !== 'object' || definition === null) return [];
      return {
        ...(definition as Record<string, unknown>),
        roomIds: unpack(card.data['rooms']).map((room) => text(room['id'])),
      };
    }),
  ] as unknown as readonly AreaDefinition[];

  const specTopics: readonly SpecTopic[] = of('topics').map((topic) => ({
    id: text(topic['id']),
    title: text(topic['title']),
    specReference: text(topic['specReference']),
    codeLocation: text(topic['codeLocation']),
    status: text(topic['status']) as SpecTopic['status'],
    evidence: text(topic['evidence']),
    roomIds: strings(topic['roomIds']),
    maxScore: number(topic['maxScore']),
  }));
  const specTopicCatalogue = {
    getById(id: string): SpecTopic | undefined {
      return specTopics.find((topic) => topic.id === id);
    },
    getByRoomId(roomId: string): readonly SpecTopic[] {
      return specTopics.filter((topic) => topic.roomIds.includes(roomId));
    },
    getByAreaId(worldId: string, areaId: string): readonly SpecTopic[] {
      const area = areas.find((entry) => entry.id === areaId);
      return area === undefined || area.worldId !== worldId
        ? []
        : specTopics.filter((topic) =>
            topic.roomIds.some((roomId) => area.roomIds.includes(roomId)),
          );
    },
  };

  return {
    worlds: catalogueOf(
      of('worlds')
        .map((world) => ({
          id: text(world['id']),
          name: text(world['name']),
          areaIds: strings(world['areaIds']),
          startAreaId: text(world['startAreaId']),
          lives: number(world['lives']),
        }))
        .filter(
          (world, index, all) =>
            all.findIndex((candidate) => candidate.id === world.id) === index,
        ) as unknown as readonly WorldDefinition[],
    ),
    areas: catalogueOf(
      areas.map((area) => ({
        id: text(area['id']),
        worldId: text(area['worldId']),
        name: text(area['name']),
        roomIds: strings(area['roomIds']),
        startRoomId: text(area['startRoomId']),
        lives: number(area['lives']),
      })) as unknown as readonly AreaDefinition[],
    ),
    rooms: catalogueOf(
      rooms.map((room) => ({
        id: text(room['id']),
        title: text(room['title']),
        description: text(room['description']),
        exits: unpack(room['exits']).map((exit) => ({
          direction: text(exit['direction']),
          targetRoomId: text(exit['targetRoomId']),
          preconditions: unpack(exit['conditions']),
        })) as unknown as RoomDefinition['exits'],
        entryEffects: unpack(
          room['entryEffects'],
        ) as unknown as RoomDefinition['entryEffects'],
        score: number(room['score']),
      })) as unknown as readonly RoomDefinition[],
    ),
    items: catalogueOf(
      of('items').map((item) => ({
        id: text(item['id']),
        name: text(item['name']),
        aliases: strings(item['aliases']),
        portable: isTrue(item['portable']),
        description: text(item['description']),
        initialRoom: text(item['initialRoom']),
        // Preserve the optional §5.2 refusal only when the card supplies one;
        // never materialise an explicit `undefined` under exactOptionalPropertyTypes.
        ...(typeof item['refusalText'] === 'string' && {
          refusalText: item['refusalText'],
        }),
      })) as unknown as readonly ItemDefinition[],
    ),
    actors: catalogueOf(
      of('actors').map((actor) => ({
        id: text(actor['id']),
        aliases: strings(actor['aliases']),
        initialStateId: text(actor['initialStateId']),
      })) as unknown as ContentBundle['actors']['all'],
    ),
    actorStates: catalogueOf(
      of('actorStates') as unknown as ContentBundle['actorStates']['all'],
    ),
    conversationTopics: catalogueOf(
      of(
        'conversationTopics',
      ) as unknown as ContentBundle['conversationTopics']['all'],
    ),
    nodes: catalogueOf(
      of('conversationNodes') as unknown as ContentBundle['nodes']['all'],
    ),
    quizzes: catalogueOf(
      of('quizzes') as unknown as ContentBundle['quizzes']['all'],
    ),
    questions: catalogueOf(
      of('questions').map((question) => ({
        id: text(question['id']),
        prompt: text(question['prompt']),
        options: strings(question['options']),
        correctOptionIds: numbers(question['correctOptionIds']),
        explanation: text(question['explanation']),
      })) as unknown as ContentBundle['questions']['all'],
    ),
    puzzles: catalogueOf(
      of('puzzles') as unknown as ContentBundle['puzzles']['all'],
    ),
    hazards: catalogueOf(
      of('hazards') as unknown as ContentBundle['hazards']['all'],
    ),
    hints: catalogueOf(
      of('hintSequences') as unknown as ContentBundle['hints']['all'],
    ),
    specTopics: {
      getById: specTopicCatalogue.getById,
      getByRoomId: specTopicCatalogue.getByRoomId,
      getByAreaId: specTopicCatalogue.getByAreaId,
    },
  };
}

function gateOf(problem: string): string {
  if (
    /Duplicate artifact ID|Duplicate object or NPC alias|exit targeting|invalid exit direction|move-player target|missing initialRoom|missing startRoomId|absent from the coverage index/u.test(
      problem,
    )
  ) {
    return 'content-ids';
  }
  if (
    /invalid score|exceeds its maxScore|no specReference|no evidence note/u.test(
      problem,
    )
  ) {
    return 'score-content';
  }
  return 'world-graph';
}

export function sharedFindings(
  cards: ParsedCardSet,
  options: ValidationOptions,
): readonly Finding[] {
  const bundle = bundleOf(cards);
  if (bundle.rooms.all.length === 0) return [];
  const ids = coverageIds(options);
  const problems = validateContent(bundle, ids.length > 0 ? ids : undefined);
  const path = cards.cards[0]?.path ?? '';
  // A definition-only fragment with no declared world is not a whole graph;
  // its start is audited only when the world owned by that area exists.
  const audited = new Set(
    auditedAreaLikes(cards).map((area) => asText(area.data['id'])),
  );
  return problems
    .filter((problem) => !problem.includes('declares no rooms'))
    .filter((problem) => {
      const id = /^Area '([^']+)' has a missing startRoomId/u.exec(
        problem,
      )?.[1];
      return id === undefined || audited.has(id);
    })
    .map((problem) => {
      const id = /'([^']+)'/u.exec(problem)?.[1] ?? 'bundle';
      return { path, entry: id, message: problem, gate: gateOf(problem) };
    });
}
