// Red tests for the content-ids structural gates (content-rules.md §7,
// application-and-ui.md §3.3). Each negative case asserts the reported problem
// AND that the injected bundle is left untouched.
import { describe, expect, it } from 'vitest';
import {
  LOCAL_FIXTURE_COVERAGE_TOPIC_IDS,
  ITEM_ALIAS,
  MISSING_ID,
  NPC_ALIAS,
  exitWithDirection,
  loadValidator,
  makeActor,
  makeArea,
  makeBundle,
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

describe('content-ids validation gates', () => {
  it('C-CONTENT-05: validateContent returns human-readable problems', async () => {
    const validate = await loadValidator();

    expect(validate(makeBundle(), LOCAL_FIXTURE_COVERAGE_TOPIC_IDS)).toEqual(
      [],
    );

    const problems = validate(
      withRooms(makeBundle(), [makeRoom(), makeRoom()]),
      LOCAL_FIXTURE_COVERAGE_TOPIC_IDS,
    );
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.every((problem) => typeof problem === 'string')).toBe(true);
    expect(problems.every((problem) => problem.length > 0)).toBe(true);
  });

  it('C-CONTENT-06: duplicate artifact IDs are reported and bundle unchanged', async () => {
    const validate = await loadValidator();
    const bundle = withWorlds(makeBundle(), [makeWorld(), makeWorld()]);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain('world-stub');
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-07: duplicate object aliases are reported', async () => {
    const validate = await loadValidator();
    const bundle = withItems(makeBundle(), [
      makeItem({ id: 'lamp', aliases: [ITEM_ALIAS] }),
      makeItem({ id: 'key', aliases: [ITEM_ALIAS] }),
    ]);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain(ITEM_ALIAS);
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-07: duplicate NPC aliases are reported', async () => {
    const validate = await loadValidator();
    const bundle = withActors(makeBundle(), [
      makeActor({ aliases: [NPC_ALIAS] }),
      makeActor({ id: 'npc-2', aliases: [NPC_ALIAS] }),
    ]);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain(NPC_ALIAS);
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-08: a missing exit target is reported', async () => {
    const validate = await loadValidator();
    const bundle = withRooms(makeBundle(), [
      makeRoom({
        exits: [
          { direction: 'north', targetRoomId: MISSING_ID, preconditions: [] },
        ],
      }),
    ]);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain(MISSING_ID);
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-08: a missing item initialRoom is reported', async () => {
    const validate = await loadValidator();
    const bundle = withItems(makeBundle(), [
      makeItem({ initialRoom: MISSING_ID }),
    ]);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain(MISSING_ID);
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-08: a missing area startRoomId is reported', async () => {
    const validate = await loadValidator();
    const bundle = withAreas(makeBundle(), [
      makeArea({ startRoomId: MISSING_ID }),
    ]);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain(MISSING_ID);
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-08: a missing move-player target is reported', async () => {
    const validate = await loadValidator();
    const bundle = withRooms(makeBundle(), [
      makeRoom({
        entryEffects: [
          { kind: 'move-player', roomId: MISSING_ID, reason: 'test move' },
        ],
      }),
    ]);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain(MISSING_ID);
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-09: an exit direction outside the canonical set is reported', async () => {
    const validate = await loadValidator();
    const bundle = withRooms(makeBundle(), [
      makeRoom({ exits: [exitWithDirection('diagonal')] }),
    ]);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ').toLowerCase()).toContain('direction');
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-GAP-01: a bundle with zero rooms is a structural problem', async () => {
    const validate = await loadValidator();
    const bundle = withRooms(makeBundle(), []);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ').toLowerCase()).toContain('rooms');
    expect(snapshot(bundle)).toBe(before);
  });
});
