// W7F-12 — VERIFICATION row. Room-targeted hint ladders are expected to
// resolve already; this named test records the observation rather than inventing
// a failing expectation. Fixture hints only; no authored ladder is asserted.
import { describe, expect, it } from 'vitest';
import { createFromDto } from '../../src/core/GameState';
import { authoredGame } from '../fixtures/authored';
import {
  W7_DEMONSTRATION_ROOM_ID,
  W7_INTAKE_ROOM_ID,
  W7_QUIZ_ID,
  W7_ROOM_ID,
  w7HintBundle,
  w7HintState,
} from '../fixtures/wardW7Fixes';

describe('W7 room-scoped hints (assistance-ward.md §9.3)', () => {
  it('W7F-12: a demonstration hint starts at level 1 after an intake hint', () => {
    const bundle = w7HintBundle();
    const state = createFromDto(w7HintState(W7_INTAKE_ROOM_ID));
    const { game } = authoredGame({ bundle, state });

    const intake = game.submit('hint');
    expect(intake).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-assistance-intake',
      level: 1,
      text: 'Fixture hint-assistance-intake level one.',
    });

    // A fresh fixture state in Demonstration carries the Intake ledger row
    // produced above; the ladder state lives per sequence ID, not globally.
    expect(state.hints['hint-assistance-intake']?.levelsShown).toEqual([1]);
    const demonstrationState = createFromDto(
      w7HintState(W7_DEMONSTRATION_ROOM_ID, { intakeLevelShown: true }),
    );
    const demonstrationGame = authoredGame({
      bundle,
      state: demonstrationState,
    });
    const demonstration = demonstrationGame.game.submit('hint');
    const shown = demonstration.filter((event) => event.type === 'hint-shown');

    expect(shown).toEqual([
      {
        type: 'hint-shown',
        hintId: 'hint-assistance-demonstration',
        level: 1,
        text: 'Fixture hint-assistance-demonstration level one.',
      },
    ]);
    expect(demonstrationState.hints['hint-assistance-demonstration']).toEqual({
      levelsShown: [1],
      lastShownTurn: demonstrationState.turn,
    });
  });

  it('W7F-12: Records still resolves the quiz ladder while a quiz is active', () => {
    const bundle = w7HintBundle();
    const state = createFromDto(
      w7HintState(W7_ROOM_ID, { activeQuizId: W7_QUIZ_ID }),
    );
    const { game } = authoredGame({ bundle, state });

    const events = game.submit('hint');

    expect(events).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-assistance-orientation',
      level: 1,
      text: 'Fixture hint-assistance-orientation level one.',
    });
    expect(events.filter((event) => event.type === 'hint-shown')).toHaveLength(
      1,
    );
  });
});
