// Unknown-input degradation and noun resolution.
import { describe, expect, it } from 'vitest';
import {
  loadGameWithPhases,
  makeTurnDependencies,
  phaseFakes,
} from '../fixtures/turn';
import {
  KEY_A,
  KEY_B,
  makeParserBundle,
  makeParserState,
  loadNameResolver,
} from '../fixtures/parser';
import type { GameEvent } from '../../src/core/events/GameEvent';

function snapshot(state: ReturnType<typeof makeParserState>): string {
  return JSON.stringify({
    position: state.player.position,
    inventory: state.player.inventory,
    flags: state.flags,
    rooms: state.rooms,
  });
}

describe('noun resolution and unknown commands', () => {
  it('P-PARSE-14: an unknown verb or noun yields a friendly message, no disambiguation and no state change', async () => {
    const calls: string[] = [];
    const state = makeParserState();
    const before = snapshot(state);
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        resolve: (raw: string) => {
          calls.push('resolve');
          return { kind: 'unknown', raw };
        },
        initialState: state,
      }),
    );

    const batch = await game.submit('flibble the glimmering orb');

    expect(calls.filter((call) => call === 'resolve')).toHaveLength(1);
    expect(batch.some((event) => event.type === 'message')).toBe(true);
    const text = batch
      .filter(
        (event): event is Extract<GameEvent, { type: 'message' }> =>
          event.type === 'message',
      )
      .map((event) => event.text)
      .join(' ');
    expect(text).toContain("I don't understand that");
    expect(text).not.toMatch(/which one|did you mean/iu);
    expect(snapshot(state)).toBe(before);
  });

  it('P-PARSE-15: visible inventory and room objects resolve; ambiguous and unknown nouns do not', async () => {
    const createResolver = await loadNameResolver();
    const resolver = createResolver();
    const state = makeParserState();
    const bundle = makeParserBundle();

    expect(resolver.resolve('brass key', state, bundle)).toBe(KEY_A);
    expect(resolver.resolve('silver key', state, bundle)).toBe(KEY_B);
    expect(resolver.resolve('key', state, bundle)).toBeUndefined();
    expect(resolver.resolve('phantom orb', state, bundle)).toBeUndefined();
  });
});
