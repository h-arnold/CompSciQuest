// Scaffold-level contract guards for content registration and the shipped
// stub. These assert observable data only; they do not reach into engine code.
import { describe, expect, it } from 'vitest';
import { loadContent } from '../../src/content/index';
import stubSource from '../../src/content/stub/index.ts?raw';
import { stubBundle } from '../../src/content/stub/index';

describe('content registration (application-and-ui.md §3.1, §3.4)', () => {
  it('C-CONTENT-01: loadContent() returns the declared ContentBundle', () => {
    const bundle = loadContent();

    expect(bundle).toEqual(stubBundle);
    expect(bundle.worlds.all).toEqual(stubBundle.worlds.all);
    expect(bundle.rooms.all).toEqual(stubBundle.rooms.all);
    for (const catalogue of [
      bundle.worlds,
      bundle.areas,
      bundle.rooms,
      bundle.items,
      bundle.actors,
      bundle.actorStates,
      bundle.conversationTopics,
      bundle.nodes,
      bundle.quizzes,
      bundle.questions,
      bundle.puzzles,
      bundle.hazards,
      bundle.hints,
    ]) {
      expect(catalogue.all).toBeDefined();
      expect(catalogue.getById).toBeTypeOf('function');
    }
    expect(bundle.specTopics.getById).toBeTypeOf('function');
    expect(bundle.specTopics.getByRoomId).toBeTypeOf('function');
    expect(bundle.specTopics.getByAreaId).toBeTypeOf('function');
  });

  it('C-CONTENT-02: catalogue all keeps declaration order and getById never throws', () => {
    const rooms = loadContent().rooms;

    expect(rooms.all.map((room) => room.id)).toEqual([
      'room-stub-start',
      'room-stub-north',
    ]);
    expect(rooms.getById('room-stub-north')).toBe(rooms.all[1]);
    expect(rooms.getById('no-such-room')).toBeUndefined();
    expect(() => rooms.getById('no-such-room')).not.toThrow();
  });

  it('C-CONTENT-13: stub has one world, two rooms and empty mechanics', () => {
    const bundle = loadContent();

    expect(bundle.worlds.all).toHaveLength(1);
    expect(bundle.areas.all).toHaveLength(1);
    expect(bundle.rooms.all).toHaveLength(2);
    for (const catalogue of [
      bundle.puzzles,
      bundle.hazards,
      bundle.hints,
      bundle.quizzes,
      bundle.actors,
      bundle.actorStates,
      bundle.conversationTopics,
      bundle.nodes,
    ]) {
      expect(catalogue.all).toEqual([]);
    }
  });

  it('C-CONTENT-13: stub source carries the replacement note', () => {
    expect(stubSource).toContain('// STUB — replace with authored content');
  });
});
