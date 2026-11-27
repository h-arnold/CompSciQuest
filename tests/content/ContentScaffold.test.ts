// Red tests for YAML scaffolds. File writes go through the in-memory
// MemoryContentIo fake; no scaffold is written to disk.
import { describe, expect, it } from 'vitest';
import {
  AREA_ID,
  HINTS_PATH,
  HAZARDS_PATH,
  MemoryContentIo,
  NPCS_PATH,
  PUZZLES_PATH,
  expectSameMembers,
  QUIZZES_PATH,
  ROOMS_PATH,
  SPEC_TOPICS_PATH,
  loadScaffolder,
} from '../fixtures/contentToolchain';

const PER_AREA_PATHS = [
  ROOMS_PATH,
  NPCS_PATH,
  QUIZZES_PATH,
  PUZZLES_PATH,
  HAZARDS_PATH,
  HINTS_PATH,
] as const;

describe('content:scaffold (content-toolchain.md §3)', () => {
  it('CT-SCAFFOLD-01: a new area gets every kind file with todo entries and rule comments', async () => {
    const { scaffoldArea } = await loadScaffolder();
    const io = new MemoryContentIo();

    const result = scaffoldArea(AREA_ID, {}, io);

    expectSameMembers(result.written, [...PER_AREA_PATHS]);
    expect(
      io.writes.some((file) => file.path === SPEC_TOPICS_PATH),
      'spec-topics.yaml is non-per-area and must not be scaffolded for one area',
    ).toBe(false);
    for (const path of PER_AREA_PATHS) {
      const text = io.contentOf(path);
      expect(text, `${path} must carry a todo placeholder`).toContain('todo');
      expect(
        text.includes('#'),
        `${path} must carry comments naming required fields`,
      ).toBe(true);
      expect(
        /\b[A-Z]\d\b/u.test(text),
        `${path} must name applicable rule IDs in its comments`,
      ).toBe(true);
    }
  });

  it('CT-SCAFFOLD-02: an existing card is refused without --force and rewritten with it', async () => {
    const { scaffoldArea } = await loadScaffolder();
    const authored = '# authored content\nsome: value\n';
    const io = new MemoryContentIo([{ path: ROOMS_PATH, text: authored }]);
    const before = io.snapshot();

    const refused = scaffoldArea(AREA_ID, {}, io);

    expect(
      refused.refused,
      'an existing card must be refused when --force is absent',
    ).toContain(ROOMS_PATH);
    expect(refused.written).not.toContain(ROOMS_PATH);
    expect(
      io.contentOf(ROOMS_PATH),
      'the authored file must be unchanged after refusal',
    ).toBe(authored);
    expect(io.snapshot(), 'no file may change on refusal').toBe(before);

    const forced = scaffoldArea(AREA_ID, { force: true }, io);

    expect(forced.written, '--force must rewrite the existing card').toContain(
      ROOMS_PATH,
    );
    expect(io.contentOf(ROOMS_PATH)).not.toBe(authored);
    expect(io.contentOf(ROOMS_PATH)).toContain('todo');
  });

  it('CT-SCAFFOLD-03: only the start-area owner receives a worlds placeholder', async () => {
    const { scaffoldArea } = await loadScaffolder();
    const owner = 'owner';
    const other = 'other';
    const world = { id: 'world-one', startAreaId: `area-${owner}` };
    const ownerIo = new MemoryContentIo();
    const otherIo = new MemoryContentIo();

    scaffoldArea(owner, { world }, ownerIo);
    scaffoldArea(other, { world }, otherIo);

    const ownerRooms = ownerIo.contentOf(`${owner}/rooms.yaml`);
    const otherRooms = otherIo.contentOf(`${other}/rooms.yaml`);

    expect(ownerRooms, 'the owning area declares the world').toContain(
      'worlds:',
    );
    expect(
      otherRooms,
      'a non-owning area must not declare a second world',
    ).not.toContain('worlds:');
    expect(ownerRooms).toContain('worldId:');
    expect(otherRooms).toContain('worldId:');
    expect(ownerRooms).toContain(world.id);
    expect(otherRooms).toContain(world.id);
  });

  it('CT-SCAFFOLD-04: a bare area argument honours --start-area area-<area>', async () => {
    const { scaffoldArea } = await loadScaffolder();
    const world = {
      id: 'world-wjec-gcse-computer-science-2025-spec',
      startAreaId: 'area-entry-interface',
    };
    const ownerIo = new MemoryContentIo();
    const otherIo = new MemoryContentIo();

    scaffoldArea('entry-interface', { world }, ownerIo);
    scaffoldArea('other-area', { world }, otherIo);

    const ownerRooms = ownerIo.contentOf('entry-interface/rooms.yaml');
    const otherRooms = otherIo.contentOf('other-area/rooms.yaml');

    expect(ownerRooms).toContain('worlds:');
    expect(ownerRooms).toContain(`  - id: ${world.id}`);
    expect(ownerRooms).toContain(`    startAreaId: ${world.startAreaId}`);
    expect(otherRooms).not.toContain('worlds:');
    expect(otherRooms).toContain(`worldId: ${world.id}`);
  });
});
