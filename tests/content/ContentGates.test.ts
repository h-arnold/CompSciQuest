// Red tests for the eight cross-artifact gates at the toolchain layer
// (content-toolchain.md §4, content-rules.md §7). Findings are asserted with
// their gate ID; negative cases also assert that no artefact was mutated.
// These are YAML/toolchain-layer assertions, not repeats of the runtime-bundle
// assertions in StructuralGates/ScoreGates/CoverageGates.
import { describe, expect, it } from 'vitest';
import {
  AREA_ID,
  GATE_NAMES,
  HINTS_PATH,
  HAZARDS_PATH,
  ROOMS_PATH,
  SPEC_TOPICS_PATH,
  cardText,
  conformingCardSet,
  expectSameMembers,
  findingText,
  loadValidation,
  parsedCard,
  parsedSet,
  withCard,
  type Finding,
} from '../fixtures/contentToolchain';

type Data = Record<string, unknown>;

function hasFinding(
  findings: readonly Finding[],
  gate: string,
  token: string,
): boolean {
  return findings.some(
    (finding) =>
      finding.gate === gate &&
      finding.message.toLowerCase().includes(token.toLowerCase()),
  );
}

function gateFindings(findings: readonly Finding[], gate: string): string {
  return findingText(findings.filter((finding) => finding.gate === gate));
}

function room(overrides: Data = {}): Data {
  return {
    id: 'room-binary-hall',
    title: 'Binary Hall',
    description: 'A hall of type bins.',
    exits: [],
    entryEffects: [],
    score: 0,
    ...overrides,
  };
}

function area(overrides: Data = {}): Data {
  return {
    id: `area-${AREA_ID}`,
    worldId: `world-${AREA_ID}`,
    name: 'The Switchyard',
    roomIds: ['room-binary-hall'],
    startRoomId: 'room-binary-hall',
    lives: 3,
    ...overrides,
  };
}

function world(overrides: Data = {}): Data {
  return {
    id: `world-${AREA_ID}`,
    name: 'The Switchyard',
    areaIds: [`area-${AREA_ID}`],
    startAreaId: `area-${AREA_ID}`,
    lives: 3,
    ...overrides,
  };
}

function roomsCard(rooms: readonly Data[]): Data {
  return {
    kind: 'area',
    areaId: AREA_ID,
    rooms,
  };
}

function specTopic(overrides: Data = {}): Data {
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

describe('structural gates at authoring time (content-toolchain.md §4)', () => {
  it('CT-GATE-01: all eight gates run and any single finding fails the command', async () => {
    const { GATE_IDS, validateCommand, validateCards } = await loadValidation();

    expectSameMembers([...GATE_IDS], [...GATE_NAMES]);

    const clean = validateCommand(conformingCardSet());
    expect(clean.findings).toEqual([]);
    expect(clean.exitCode).toBe(0);

    const cards = conformingCardSet();
    const base = cardText(cards, ROOMS_PATH);
    const head = base.slice(0, base.indexOf('rooms:\n'));
    const duplicatedRooms = `rooms:
  - id: room-binary-hall
    title: First hall
    description: >-
      First hall text.
    exits: []
    score: 0
  - id: room-binary-hall
    title: Second hall
    description: >-
      Second hall text.
    exits: []
    score: 0
`;
    const failing = validateCommand(
      withCard(cards, ROOMS_PATH, `${head}${duplicatedRooms}`),
    );
    expect(failing.findings.length).toBeGreaterThan(0);
    expect(
      failing.findings.some((finding) => finding.gate === 'content-ids'),
    ).toBe(true);
    expect(
      failing.exitCode,
      'a single finding must fail content:validate',
    ).not.toBe(0);

    // The gate-level API and the command-level API must agree on the finding.
    const duplicateRooms = [room(), room()];
    const duplicateCard = parsedCard(ROOMS_PATH, roomsCard(duplicateRooms));
    const duplicateFindings = validateCards(parsedSet(duplicateCard));
    expect(duplicateFindings.length).toBeGreaterThan(0);
  });

  it('CT-GATE-02: duplicate aliases across kinds and wrong ID prefixes use content-ids', async () => {
    const { validateCards } = await loadValidation();

    const aliasClash = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        items: [
          { id: 'item-cache', aliases: ['cache'], initialRoom: 'room-a' },
        ],
      }),
      parsedCard(`${AREA_ID}/npcs.yaml`, {
        kind: 'npc',
        actors: [{ id: 'npc-archivist', aliases: ['cache'] }],
      }),
    );
    const aliasBefore = JSON.stringify(aliasClash);
    const aliasFindings = validateCards(aliasClash);
    expect(
      hasFinding(aliasFindings, 'content-ids', 'cache'),
      'aliases must be globally unique across objects and NPCs',
    ).toBe(true);
    expect(JSON.stringify(aliasClash)).toBe(aliasBefore);

    const badPrefix = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        definition: { id: 'bad-prefix-area', worldId: `world-${AREA_ID}` },
        areas: [area({ id: 'bad-prefix-area' })],
        worlds: [world({ areaIds: ['bad-prefix-area'] })],
      }),
    );
    const prefixFindings = validateCards(badPrefix);
    expect(
      hasFinding(prefixFindings, 'content-ids', 'bad-prefix-area'),
      'IDs must carry the §5 prefixes, including area- and world-',
    ).toBe(true);

    const goodPrefix = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        areas: [area()],
        worlds: [world()],
        rooms: [room()],
      }),
    );
    expect(gateFindings(validateCards(goodPrefix), 'content-ids')).toBe('');
  });

  it('CT-GATE-03: broken topic, exit, move-player and direction references use content-ids', async () => {
    const { validateCards } = await loadValidation();
    const coverage = { coverageTopicIds: ['data-types'] };

    const cases: ReadonlyArray<readonly [string, Data]> = [
      ['invented-topic', room({ topicIds: ['invented-topic'] })],
      [
        'room-missing',
        room({
          exits: [{ direction: 'north', targetRoomId: 'room-missing' }],
        }),
      ],
      [
        'room-missing',
        room({
          entryEffects: [{ kind: 'move-player', roomId: 'room-missing' }],
        }),
      ],
      [
        'diagonal',
        room({
          exits: [{ direction: 'diagonal', targetRoomId: 'room-binary-hall' }],
        }),
      ],
    ];

    for (const [token, brokenRoom] of cases) {
      const cards = parsedSet(parsedCard(ROOMS_PATH, roomsCard([brokenRoom])));
      const before = JSON.stringify(cards);
      const findings = validateCards(cards, coverage);
      expect(
        hasFinding(findings, 'content-ids', token),
        `a broken reference containing '${token}' must be reported under content-ids`,
      ).toBe(true);
      expect(JSON.stringify(cards), 'the parsed cards must be unchanged').toBe(
        before,
      );
    }
  });

  it('CT-GATE-04: quiz-content checks marks, options, AOs and pass/fail effects', async () => {
    const { validateCards } = await loadValidation();
    const cards = parsedSet(
      parsedCard(`${AREA_ID}/quizzes.yaml`, {
        kind: 'quiz',
        quizzes: [
          {
            id: 'quiz-data-types',
            actorId: 'npc-archivist',
            topicId: 'data-types',
            score: 1,
            questionIds: ['q-1', 'q-2'],
            passMark: 3,
            onPass: [],
            onFail: [],
          },
        ],
        questions: [
          {
            id: 'q-1',
            prompt: 'Which type is a whole number?',
            options: ['integer', 'real'],
            correctOptionIds: [],
            explanation: '',
          },
          {
            id: 'q-2',
            prompt: 'Which type holds text?',
            options: ['string', 'character'],
            correctOptionIds: [0],
            explanation: 'A string holds characters.',
          },
        ],
      }),
    );
    const before = JSON.stringify(cards);

    const findings = validateCards(cards);

    for (const token of [
      'passMark',
      'correctOption',
      'explanation',
      'difficulty',
      'AO1',
      'quiz-passed',
      'complete-topic',
      'change-lives',
    ]) {
      expect(
        hasFinding(findings, 'quiz-content', token),
        `quiz-content must report the ${token} clause`,
      ).toBe(true);
    }
    expect(JSON.stringify(cards)).toBe(before);
  });

  it('CT-GATE-06: world-graph checks declarations, worldId and ID-based starts', async () => {
    const { validateCards } = await loadValidation();

    const duplicateWorlds = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        areas: [area(), area({ id: 'area-second' })],
        worlds: [world(), world()],
      }),
    );
    expect(
      hasFinding(validateCards(duplicateWorlds), 'world-graph', 'world'),
    ).toBe(true);

    const unresolvedWorld = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        areas: [area({ worldId: 'world-absent' })],
        worlds: [],
      }),
    );
    expect(
      hasFinding(validateCards(unresolvedWorld), 'world-graph', 'world-absent'),
    ).toBe(true);

    // The start is the second area in declaration order: resolving by array
    // position would pick the wrong area and room.
    const secondIsStart = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        areas: [
          area({ id: 'area-first', startRoomId: 'room-first' }),
          area({ id: 'area-chosen', startRoomId: 'room-chosen' }),
        ],
        worlds: [
          world({
            areaIds: ['area-first', 'area-chosen'],
            startAreaId: 'area-chosen',
          }),
        ],
        rooms: [room({ id: 'room-first' }), room({ id: 'room-chosen' })],
      }),
    );
    expect(
      gateFindings(validateCards(secondIsStart), 'world-graph'),
      'the start must resolve by startAreaId/startRoomId, never by array position',
    ).toBe('');
  });

  it('CT-GATE-06a: when the opening world is declared second, `world-graph` reports that `worlds.all[0]` is not the world owning `startAreaId`', async () => {
    const { validateCards } = await loadValidation();
    const openingArea = area({
      id: 'area-opening',
      worldId: 'world-opening',
      roomIds: ['room-opening'],
      startRoomId: 'room-opening',
    });
    const openingWorld = world({
      id: 'world-opening',
      areaIds: ['area-opening'],
      startAreaId: 'area-opening',
    });
    const openingSecond = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        areas: [area(), openingArea],
        worlds: [world(), openingWorld],
        rooms: [room(), room({ id: 'room-opening' })],
      }),
    );
    const findings = validateCards(openingSecond);
    expect(hasFinding(findings, 'world-graph', 'world-opening')).toBe(true);
    expect(gateFindings(findings, 'world-graph')).toContain(
      `World 'world-opening' declares startAreaId 'area-opening' but is not the first world declared; GameState.createInitial() boots from worlds.all[0] ('world-${AREA_ID}')`,
    );
    const openingOnly = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        areas: [openingArea],
        worlds: [openingWorld],
        rooms: [room({ id: 'room-opening' })],
      }),
    );
    expect(gateFindings(validateCards(openingOnly), 'world-graph')).toBe('');
  });

  it('CT-GATE-07: world-graph reports unreachable artefacts and uncovered completions', async () => {
    const { validateCards } = await loadValidation();

    const unreachable = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        areas: [area()],
        worlds: [world()],
        rooms: [room({ id: 'room-start' }), room({ id: 'room-stranded' })],
      }),
    );
    expect(
      hasFinding(validateCards(unreachable), 'world-graph', 'room-stranded'),
    ).toBe(true);

    const noCompletion = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        areas: [area()],
        worlds: [world()],
        rooms: [room()],
      }),
      parsedCard(SPEC_TOPICS_PATH, {
        kind: 'spec-topics',
        topics: [
          specTopic({ status: 'covered', evidence: 'Recorded evidence.' }),
        ],
      }),
    );
    expect(
      hasFinding(validateCards(noCompletion), 'world-graph', 'data-types'),
      'a covered topic with evidence needs a completion source on a path to game-won',
    ).toBe(true);
  });

  it('CT-GATE-08: hint-content checks the ladder, keys, targets and penalty', async () => {
    const { validateCards } = await loadValidation();
    const cards = parsedSet(
      parsedCard(HINTS_PATH, {
        kind: 'hint',
        hintSequences: [
          {
            id: 'hint-sort-types',
            targets: ['puzzle-absent'],
            levels: [
              {
                level: 3,
                text: 'The answer is integer.',
                unlock: {
                  kind: 'counter-at-least',
                  key: 'random-key',
                  value: 1,
                },
              },
            ],
            scorePenalty: 2,
          },
        ],
      }),
    );
    const before = JSON.stringify(cards);

    const findings = validateCards(cards);
    for (const token of [
      'level',
      'unlock',
      'puzzle-absent',
      'answer',
      'penalty',
    ]) {
      expect(
        hasFinding(findings, 'hint-content', token),
        `hint-content must report the ${token} clause`,
      ).toBe(true);
    }
    expect(JSON.stringify(cards)).toBe(before);

    // shared-rules.md §3 lists `hints-shown:<hintId>` as an agreed counter key
    // (written by the `show-hint` effect), and hints.md §2 names it as one of
    // the three defined prefixes. A verbatim-migrated card using it in an
    // unlock condition must therefore produce no hint-content finding.
    const conformingHintSet = (unlockKey: string) =>
      parsedSet(
        parsedCard(HINTS_PATH, {
          kind: 'hint',
          hintSequences: [
            {
              id: 'hint-sort-types',
              targets: ['puzzle-sort-types'],
              levels: [
                {
                  level: 1,
                  text: 'Look for the label on the first bin.',
                  unlock: {
                    kind: 'counter-at-least',
                    key: unlockKey,
                    value: 1,
                  },
                },
                {
                  level: 2,
                  text: 'Match each sample to its type bin.',
                  unlock: {
                    kind: 'counter-at-least',
                    key: 'failed-attempts:quiz-data-types',
                    value: 2,
                  },
                },
              ],
              cooldownTurns: 2,
            },
          ],
        }),
        parsedCard(`${AREA_ID}/puzzles.yaml`, {
          kind: 'puzzle',
          puzzles: [{ id: 'puzzle-sort-types' }],
        }),
      );

    const agreed = conformingHintSet('hints-shown:hint-sort-types');
    const agreedBefore = JSON.stringify(agreed);
    const agreedFindings = validateCards(agreed);
    expect(
      gateFindings(agreedFindings, 'hint-content'),
      'hints-shown:<hintId> is an agreed counter key (shared-rules.md §3, hints.md §2)',
    ).toBe('');
    expect(JSON.stringify(agreed)).toBe(agreedBefore);

    const invented = conformingHintSet('invented-prefix:hint-sort-types');
    const inventedBefore = JSON.stringify(invented);
    const inventedFindings = validateCards(invented);
    expect(
      hasFinding(inventedFindings, 'hint-content', 'unlock key'),
      'an invented unlock prefix must still be reported by hint-content',
    ).toBe(true);
    expect(gateFindings(inventedFindings, 'hint-content')).toContain(
      'invented-prefix:hint-sort-types',
    );
    expect(JSON.stringify(invented)).toBe(inventedBefore);
  });

  it('CT-GATE-09: hazard-content checks telegraphs, effects and the level start', async () => {
    const { validateCards } = await loadValidation();
    const cards = parsedSet(
      parsedCard(HAZARDS_PATH, {
        kind: 'hazard',
        hazards: [
          {
            id: 'hazard-overheat',
            trigger: { kind: 'on-room-enter', roomId: 'room-binary-hall' },
            effects: [
              { kind: 'set-puzzle-solved', puzzleId: 'puzzle-sort-types' },
              { kind: 'unknown-effect' },
            ],
          },
        ],
        areas: [area({ startRoomId: 'room-missing' })],
        rooms: [room()],
        worlds: [world()],
      }),
    );
    const before = JSON.stringify(cards);

    const findings = validateCards(cards);
    for (const token of ['telegraph', 'set-puzzle', 'effect', 'room-missing']) {
      expect(
        hasFinding(findings, 'hazard-content', token),
        `hazard-content must report the ${token} clause`,
      ).toBe(true);
    }
    expect(JSON.stringify(cards)).toBe(before);
  });

  it('CT-GATE-10: score-content checks fields, budgets, scores and starts', async () => {
    const { validateCards } = await loadValidation();
    const cards = parsedSet(
      parsedCard(SPEC_TOPICS_PATH, {
        kind: 'spec-topics',
        topics: [specTopic({ evidence: undefined })],
      }),
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        areas: [area()],
        worlds: [world()],
        rooms: [room({ score: -1 })],
      }),
    );
    const before = JSON.stringify(cards);

    const findings = validateCards(cards);
    for (const token of ['evidence', 'score', 'data-types']) {
      expect(
        hasFinding(findings, 'score-content', token),
        `score-content must report the ${token} clause`,
      ).toBe(true);
    }
    expect(JSON.stringify(cards)).toBe(before);
  });

  it('CT-GATE-11: an uncheckable clause is reported as a gap, not silently passed', async () => {
    const { validateCards } = await loadValidation();
    const clause = 'bible-alias-registry';
    const cards = parsedSet(
      parsedCard(ROOMS_PATH, {
        kind: 'area',
        areas: [area()],
        worlds: [world()],
        rooms: [room()],
      }),
    );
    const before = JSON.stringify(cards);

    const findings = validateCards(cards, { uncheckedClauses: [clause] });

    expect(findings.length, 'the gap must be reported').toBeGreaterThan(0);
    const reported = findingText(findings).toLowerCase();
    expect(reported).toContain(clause);
    expect(
      /cannot check|unverified|unchecked/u.test(reported),
      'the finding must say the clause could not be checked',
    ).toBe(true);
    expect(JSON.stringify(cards)).toBe(before);
  });
});
