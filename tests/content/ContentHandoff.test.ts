// Red tests for the generated-bundle handoff (application-and-ui.md §3.3–§3.4;
// content-toolchain.md §4–§5; content-rules.md D5). CT-HAND-02 asserts that the
// toolchain and boot share src/content/validateContent.ts instead of defining a
// second validator; CT-HAND-03 supplies a deterministic bundle by injection.
import { describe, expect, it } from 'vitest';
import gameStateSource from '../../src/core/GameState.ts?raw';
import indexSource from '../../src/content/index.ts?raw';
import type { ContentBundle } from '../../src/content/ContentBundle';
import { parseCardSet } from '../../tools/content/schema.ts';
import {
  COVERAGE_TOPIC_IDS,
  loadValidator,
  makeActor,
  makeArea,
  makeItem,
  makeRoom,
  makeWorld,
  snapshot,
  withActors,
  withAreas,
  withItems,
  withRooms,
  withWorlds,
} from '../fixtures/content';
import {
  asRuntime,
  importModule,
  makeBundle,
  makeGameDependencies,
  loadGame,
  type RuntimeGameState,
} from '../fixtures/persistence';
import {
  AREA_ID,
  GATE_NAMES,
  findingText,
  loadValidation,
  parsedCard,
  parsedSet,
} from '../fixtures/contentToolchain';
import { zone1CardSet, zone1DeclaredStart } from '../fixtures/zone1';

interface CreateInitial {
  (bundle?: ContentBundle): RuntimeGameState;
}

describe('runtime handoff (application-and-ui.md §3.3)', () => {
  it('CT-HAND-01: loadContent assembles authored data and never parses YAML', async () => {
    expect(
      indexSource,
      'src/content/index.ts must assemble from src/content/authored/',
    ).toContain('./authored');
    expect(
      indexSource,
      'loadContent must not fall back to the stub bundle',
    ).not.toContain('stubBundle');
    expect(
      /yaml/u.test(indexSource),
      'the static runtime must not parse YAML',
    ).toBe(false);

    const { loadContent } = await importModule('../../src/content/index');
    expect(loadContent).toBeTypeOf('function');
    const bundle = (loadContent as () => ContentBundle)();
    const authoredRooms = await importModule(
      '../../src/content/authored/rooms',
    );
    const authoredAreas = await importModule(
      '../../src/content/authored/areas',
    );
    expect(
      bundle.rooms.all,
      'loadContent must return the committed authored rooms',
    ).toEqual(authoredRooms['rooms']);
    expect(bundle.areas.all).toEqual(authoredAreas['areas']);
  });

  it('CT-HAND-02: boot and the toolchain share the one canonical validator', async () => {
    const validate = await loadValidator();
    const { validateCards, GATE_IDS } = await loadValidation();

    expect(
      [...GATE_IDS],
      'the toolchain must run the same eight gates as the boot validator',
    ).toEqual([...GATE_NAMES]);

    const bundle = withActors(makeBundle(), [
      makeActor({ aliases: ['shared-alias'] }),
      makeActor({ id: 'npc-2', aliases: ['shared-alias'] }),
    ]);
    const before = snapshot(bundle);
    const bootProblems = validate(bundle, COVERAGE_TOPIC_IDS);
    expect(bootProblems.length).toBeGreaterThan(0);
    expect(bootProblems.join(' ')).toContain('shared-alias');

    const cards = parsedSet(
      parsedCard(`${AREA_ID}/npcs.yaml`, {
        kind: 'npc',
        actors: [
          { id: 'npc-1', aliases: ['shared-alias'] },
          { id: 'npc-2', aliases: ['shared-alias'] },
        ],
      }),
    );
    const toolFindings = validateCards(cards, {
      coverageTopicIds: COVERAGE_TOPIC_IDS,
    });
    expect(
      findingText(toolFindings),
      'the toolchain must report the same defect, so authoring and boot cannot drift',
    ).toContain('shared-alias');
    expect(snapshot(bundle)).toBe(before);
  });

  it('CT-HAND-03: Game.newGame resolves the authored start through the injected bundle', async () => {
    const world = makeWorld({
      id: 'world-test',
      areaIds: ['area-first', 'area-chosen'],
      startAreaId: 'area-chosen',
    });
    const first = makeArea({
      id: 'area-first',
      worldId: 'world-test',
      roomIds: ['room-first'],
      startRoomId: 'room-first',
    });
    const chosen = makeArea({
      id: 'area-chosen',
      worldId: 'world-test',
      roomIds: ['room-chosen'],
      startRoomId: 'room-chosen',
    });
    const roomFirst = makeRoom({ id: 'room-first', exits: [] });
    const roomChosen = makeRoom({ id: 'room-chosen', exits: [] });
    const item = makeItem({ id: 'item-in-chosen', initialRoom: 'room-chosen' });
    let bundle = withWorlds(makeBundle(), [world]);
    bundle = withAreas(bundle, [first, chosen]);
    bundle = withRooms(bundle, [roomFirst, roomChosen]);
    bundle = withItems(bundle, [item]);
    const expected = {
      worldId: 'world-test',
      areaId: 'area-chosen',
      roomId: 'room-chosen',
    };

    const module = await importModule('../../src/core/GameState');
    expect(
      module['createInitial'],
      'createInitial must accept the injected bundle (application-and-ui.md §3.3)',
    ).toBeTypeOf('function');
    const createInitial = module['createInitial'] as CreateInitial;
    const dto = asRuntime(createInitial(bundle)).toDto();
    expect(
      dto.player.position,
      'the start is chosen by startAreaId then startRoomId, not by array position',
    ).toEqual(expected);
    expect(dto.rooms['room-chosen']?.inventory).toContain('item-in-chosen');

    const game = await loadGame(makeGameDependencies({ bundle }));
    game.newGame();
    expect(game.getViewData().position).toEqual(expected);
  });

  it('CT-HAND-06: createInitial() defaults to the generated bundle and its declared start', async () => {
    const parsed = parseCardSet(zone1CardSet());
    expect(
      parsed.findings,
      'the clean zone-1 card set must parse without findings',
    ).toEqual([]);
    const declared = zone1DeclaredStart({
      cards: Object.entries(parsed.parsed).map(([path, data]) => ({
        path,
        data,
      })),
    });
    expect(
      gameStateSource,
      'createInitial must default to loadContent(), never the retired stub',
    ).not.toContain(['content', 'stub'].join('/'));

    const module = await importModule('../../src/core/GameState');
    expect(
      module['createInitial'],
      'createInitial must stay exported (application-and-ui.md §3.3)',
    ).toBeTypeOf('function');
    const createInitial = module['createInitial'] as CreateInitial;

    const state = asRuntime(createInitial()).toDto();
    expect(
      state.player.position,
      'the default start follows world.startAreaId then area.startRoomId',
    ).toEqual({
      worldId: declared.worldId,
      areaId: declared.areaId,
      roomId: declared.roomId,
    });
    expect(
      Object.keys(state.rooms).toSorted((left, right) =>
        left < right ? -1 : Number(left > right),
      ),
      'the room inventory comes from the same generated bundle',
    ).toEqual(
      [...declared.roomIds].toSorted((left, right) =>
        left < right ? -1 : Number(left > right),
      ),
    );

    const injected = asRuntime(createInitial(makeBundle())).toDto();
    expect(
      injected.player.position,
      'the bundle parameter must remain injectable',
    ).toEqual({
      worldId: 'world-stub',
      areaId: 'area-stub',
      roomId: 'room-stub-start',
    });
  });
});
