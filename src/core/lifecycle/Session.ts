// Canonical signature from application-and-ui.md §8. The session observes the
// buffered turn and owns the end-state transitions (§11), never re-announcing
// an end state on restore.
import type { ContentBundle } from '../../content/ContentBundle';
import type { GameState } from '../GameState';
import type { GameEvent } from '../events/GameEvent';
import type { SessionStatus } from '../SessionStatus';

export interface Session {
  observe(events: readonly GameEvent[]): readonly GameEvent[];
  newGame(): void;
}

function isWon(state: GameState, bundle: ContentBundle): boolean {
  const completed = new Set(
    state.progress.flatMap((entry) => entry.completedTopics),
  );
  const topics = bundle.areas.all.flatMap((area) =>
    bundle.specTopics.getByAreaId(area.worldId, area.id),
  );
  return topics
    .filter(
      (topic) => topic.status === 'covered' && topic.evidence.trim() !== '',
    )
    .every((topic) => completed.has(topic.id));
}

export function createSession(
  state: GameState,
  bundle: ContentBundle,
): Session {
  const setStatus = (status: SessionStatus): void => {
    (state as { status: SessionStatus }).status = status;
  };

  return {
    observe(events: readonly GameEvent[]): readonly GameEvent[] {
      const emitted = [...events];
      if (state.status !== 'playing') return emitted;
      if (state.player.lives <= 0) {
        setStatus('lost');
        emitted.push({
          type: 'game-over',
          reason: 'lives exhausted',
          finalScore: state.score,
        });
        return emitted;
      }
      if (isWon(state, bundle)) {
        setStatus('won');
        emitted.push({ type: 'game-won', finalScore: state.score });
      }
      return emitted;
    },
    newGame(): void {
      setStatus('playing');
      (state.player as { lives: number }).lives = 3;
      (state as { turn: number }).turn = 0;
    },
  };
}
