// Red tests for ENG-LOADCONFIRM-01. Canonical contracts:
// docs/developer/application-and-ui.md §4 (L206–235), §4.1 (L237–269),
// §6.1 (L548–581), §7.1 (L585–609), §7.2 (L638–696);
// docs/developer/storage-schema.md §10 (L277–304), §11 (L306–335),
// §12 (L337–358). Graph owners: Game (src/application/Game.ts:L45),
// GameWindow (src/ui/GameWindow.ts:L32), SaveActions (src/ui/SaveControls.ts:L4),
// OutputLog (src/ui/OutputLog.ts:L5), LoadResult (src/application/SaveDto.ts:L17).
// E-LOADCONFIRM-02 GAP resolved by the user's explicit decision: the exact
// success line is `Game loaded.` (the established Game saved. / Save downloaded.
// / Game imported. pattern). No onboarding copy is touched here.
import { afterEach, describe, expect, it } from 'vitest';
import type { SaveManager } from '../../src/application/SaveManager';
import type { GameStateDto } from '../../src/core/GameState';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { GameWindow } from '../../src/ui/GameWindow';
import { formatEvent } from '../../src/ui/formatEvent';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  eventTypes,
  gameplaySnapshot,
  messageTexts,
  readSave,
  switchyardProgress,
} from '../fixtures/authored';
import {
  FixedClock,
  makeEnvelope,
  makeRuntimeState,
  SAVE_KEY,
} from '../fixtures/persistence';
import {
  findButton,
  installFakeDocument,
  restoreDocument,
  type FakeElement,
} from '../fixtures/ui';

const LOAD_SUCCESS = 'Game loaded.';
const LOAD_FAILURE = 'No saved game could be loaded.';

// The canonical GameEvent union (src/core/events/GameEvent.ts:L11). A fix must
// reuse `message` rather than inventing an event kind for the confirmation.
const CANONICAL_EVENT_TYPES: ReadonlySet<string> = new Set([
  'message',
  'room-entered',
  'score-changed',
  'topic-completed',
  'lives-changed',
  'game-over',
  'game-won',
  'conversation-started',
  'npc-spoke',
  'conversation-ended',
  'topic-suggested',
  'hazard-triggered',
  'puzzle-activated',
  'puzzle-solved',
  'quiz-started',
  'question-asked',
  'answer-evaluated',
  'quiz-ended',
  'hint-shown',
  'hint-penalty-applied',
  'flag-changed',
  'item-moved',
  'actor-state-changed',
  'knowledge-gained',
  'node-entered',
  'node-exited',
  'scheduled',
]);

type AuthoredFixture = ReturnType<typeof authoredGame>;

// Seeds a live save whose turn, room and lives differ from the current game,
// so a successful load has an observable state delta. All storage is in memory.
function seededGame(): AuthoredFixture & {
  readonly savedState: GameStateDto;
} {
  const fixture = authoredGame({
    state: authoredState({
      roomId: 'room-binary-hall',
      progress: [switchyardProgress()],
      turn: 2,
    }),
  });
  const current = readSave(fixture.game, fixture.storage).dto.state;
  const savedState: GameStateDto = {
    ...current,
    turn: 12,
    player: {
      ...current.player,
      lives: 4,
      position: { ...current.player.position, roomId: 'room-switch-floor' },
    },
  };
  fixture.storage.write(SAVE_KEY, JSON.stringify(makeEnvelope(savedState)));
  return { ...fixture, savedState };
}

function noop(): void {
  // An injected seam that must not be called by these tests.
}

function mountWindow(fixture: AuthoredFixture): GameWindow {
  return new GameWindow({
    game: fixture.game,
    bundle: authoredBundle,
    bus: fixture.bus,
    storage: fixture.storage,
    clock: new FixedClock(),
    loadResult: { ok: false, reason: 'invalid-json' },
    downloadFile: noop,
    openSaveFile: async () => '',
  });
}

function asFake(element: HTMLElement): FakeElement {
  return element as unknown as FakeElement;
}

function logLines(element: HTMLElement): readonly string[] {
  const output = asFake(element).querySelector('.output-log');
  expect(output, 'the transcript must be mounted (§7.1)').not.toBeNull();
  return (output?.children ?? []).map((child) => child.textContent);
}

function pressLoadEnter(element: HTMLElement): void {
  const input = asFake(element).querySelector('input');
  expect(input, 'the Terminal input must be mounted (§7.1)').not.toBeNull();
  if (input === null) return;
  input.value = 'load';
  input.dispatch('keydown', { key: 'Enter' });
}

afterEach(() => {
  restoreDocument();
});

describe('ENG-LOADCONFIRM-01: typed and sidebar load (application-and-ui.md §4, §4.1)', () => {
  it('S-LOADCONFIRM-01: a successful typed load rebinds state and emits one friendly confirmation line', () => {
    const { game, storage, savedState } = seededGame();
    const before = game.getViewData();
    expect(before.turn).not.toBe(savedState.turn);

    const batch = game.submit('load');

    expect(messageTexts(batch)).toContain(LOAD_SUCCESS);
    expect(batch).toContainEqual({ type: 'message', text: LOAD_SUCCESS });
    expect(game.getViewData().turn).toBe(savedState.turn);
    expect(game.getViewData().position.roomId).toBe(
      savedState.player.position.roomId,
    );
    const restored = readSave(game, storage).dto.state;
    expect(restored.turn).toBe(savedState.turn);
    expect(restored.player.lives).toBe(savedState.player.lives);
  });

  it('S-LOADCONFIRM-02: the sidebar Load button converges on the same submit seam and confirmation', () => {
    installFakeDocument();
    const sidebarFixture = seededGame();
    const sidebar = mountWindow(sidebarFixture);
    findButton(asFake(sidebar.element), 'Load').click();
    expect(logLines(sidebar.element)).toContain(LOAD_SUCCESS);

    const typedFixture = seededGame();
    const typed = mountWindow(typedFixture);
    pressLoadEnter(typed.element);
    expect(logLines(typed.element)).toContain(LOAD_SUCCESS);
    expect(
      logLines(sidebar.element).filter((line) => line === LOAD_SUCCESS),
    ).toHaveLength(1);
    expect(
      logLines(typed.element).filter((line) => line === LOAD_SUCCESS),
    ).toHaveLength(1);
  });

  it('S-LOADCONFIRM-03: a failed load keeps the existing line only and leaves state unchanged', () => {
    const { game, storage } = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        progress: [switchyardProgress()],
        turn: 5,
      }),
    });
    const before = readSave(game, storage).dto.state;
    const snapshotBefore = gameplaySnapshot(before);
    // readSave wrote a valid live save only so the snapshot could be captured;
    // remove it so this branch really exercises "no valid live save".
    storage.remove(SAVE_KEY);

    const batch = game.submit('load');

    expect(messageTexts(batch)).toEqual([LOAD_FAILURE]);
    expect(messageTexts(batch)).not.toContain(LOAD_SUCCESS);
    expect(gameplaySnapshot(readSave(game, storage).dto.state)).toBe(
      snapshotBefore,
    );
    expect(game.getViewData().turn).toBe(before.turn);
  });

  it('S-LOADCONFIRM-04: a meta load never advances the restored turn', () => {
    const { game, storage, savedState } = seededGame();

    const batch = game.submit('load');

    expect(messageTexts(batch)).toContain(LOAD_SUCCESS);
    expect(game.getViewData().turn).toBe(savedState.turn);
    expect(readSave(game, storage).dto.state.turn).toBe(savedState.turn);
  });

  it('S-LOADCONFIRM-05: a load reads the live save and performs no write or quarantine change', () => {
    const fixture = seededGame();
    fixture.storage.write(
      'compsciquest:save:v1:corrupt',
      'kept for manual inspection',
    );
    const writesBefore = fixture.storage.writes.length;
    const snapshotBefore = fixture.storage.snapshot();

    const batch = fixture.game.submit('load');

    expect(messageTexts(batch)).toContain(LOAD_SUCCESS);
    expect(fixture.storage.writes).toHaveLength(writesBefore);
    expect(fixture.storage.snapshot()).toEqual(snapshotBefore);
  });

  it('S-LOADCONFIRM-06: a restored end state rebinds status without re-emitting an end event', () => {
    const base = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        progress: [switchyardProgress()],
      }),
    });
    const current = readSave(base.game, base.storage).dto.state;
    const wonDto = makeEnvelope({ ...current, status: 'won', turn: 9 });
    const fixture = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        progress: [switchyardProgress()],
      }),
      overrides: {
        saveManager: {
          ...base.dependencies.saveManager,
          load: () => ({ ok: true, dto: wonDto }),
          restore: () => makeRuntimeState(wonDto.state),
        } satisfies SaveManager,
      },
    });

    const batch = fixture.game.submit('load');

    expect(fixture.game.getViewData().status).toBe('won');
    expect(eventTypes(batch)).not.toContain('game-won');
    expect(eventTypes(batch)).not.toContain('game-over');
    expect(messageTexts(batch)).toEqual([LOAD_SUCCESS]);
  });
});

describe('ENG-LOADCONFIRM-01: canonical event seam (application-and-ui.md §4.1, §6, §9)', () => {
  it('E-LOADCONFIRM-01: the confirmation is a canonical message in both the returned and published batch', () => {
    const { game, bus } = seededGame();

    const batch = game.submit('load');

    const confirmation = batch.find(
      (event): event is Extract<GameEvent, { type: 'message' }> =>
        event.type === 'message' && event.text === LOAD_SUCCESS,
    );
    // Deep equality also proves there is no internal ID or debug field.
    expect(confirmation).toEqual({ type: 'message', text: LOAD_SUCCESS });
    expect(
      eventTypes(batch).every((type) => CANONICAL_EVENT_TYPES.has(type)),
    ).toBe(true);
    expect(bus.batches.at(-1)).toEqual(batch);
    expect(
      bus.batches
        .at(-1)
        ?.some(
          (event) => event.type === 'message' && event.text === LOAD_SUCCESS,
        ),
    ).toBe(true);
  });

  it('E-LOADCONFIRM-02: the decided success wording is exactly Game loaded. with no extra copy', () => {
    const { game } = seededGame();

    const batch = game.submit('load');

    // The decided wording is asserted literally: no local constant can hide a
    // drift away from the user-approved line.
    expect(messageTexts(batch)).toEqual(['Game loaded.']);
  });

  it('UI-LOADCONFIRM-01: formatEvent maps the confirmation to its text and the transcript shows it once', () => {
    installFakeDocument();
    const confirmation: GameEvent = { type: 'message', text: LOAD_SUCCESS };
    expect(formatEvent(confirmation, authoredBundle)).toEqual([LOAD_SUCCESS]);

    const fixture = seededGame();
    const gameWindow = mountWindow(fixture);
    pressLoadEnter(gameWindow.element);

    const lines = logLines(gameWindow.element);
    expect(lines).toContain('> load');
    expect(lines.filter((line) => line === LOAD_SUCCESS)).toHaveLength(1);
    expect(
      lines.some((line) => line.includes('debug') || line.includes('save:v1')),
    ).toBe(false);
  });
});
