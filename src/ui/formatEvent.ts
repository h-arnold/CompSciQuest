// Pure GameEvent → transcript lines (application-and-ui.md §6.1). Internal-state
// events are suppressed; score-changed prints once only on a real gain, in
// friendly wording without a room ID. Labels come from the injected bundle.
import type { ContentBundle } from '../content/ContentBundle';
import type { GameEvent } from '../core/events/GameEvent';

function topicLabel(bundle: ContentBundle, topicId: string): string {
  return bundle.specTopics.getById(topicId)?.title ?? topicId;
}

export function formatEvent(
  event: GameEvent,
  bundle: ContentBundle,
): readonly string[] {
  switch (event.type) {
    case 'message':
    case 'npc-spoke':
    case 'topic-suggested':
    case 'hint-shown': {
      return [event.text];
    }
    case 'answer-evaluated': {
      return [event.explanation];
    }
    case 'room-entered': {
      return [
        event.room.title,
        '',
        event.room.description,
        `Exits: ${event.room.exits.join(', ')}`,
      ];
    }
    case 'question-asked': {
      return [
        event.prompt,
        ...event.options.map((option, index) => `${index + 1}. ${option}`),
      ];
    }
    case 'score-changed': {
      return event.delta > 0 ? [`You earned ${event.delta} points.`] : [];
    }
    case 'topic-completed': {
      return [`Topic completed: ${topicLabel(bundle, event.topicId)}.`];
    }
    case 'lives-changed': {
      return [`Lives: ${event.lives}.`];
    }
    case 'game-over': {
      return [`Game over — ${event.reason}. Final score: ${event.finalScore}.`];
    }
    case 'game-won': {
      return [`You have won! Final score: ${event.finalScore}.`];
    }
    case 'puzzle-activated': {
      return [`Puzzle ${event.puzzleId} is now active.`];
    }
    // Render-time suppression: topic-completed carries the friendly outcome.
    case 'puzzle-solved': {
      return [];
    }
    // Internal-state and bookkeeping events: panels carry state through
    // GameViewData (§7.2) rather than replaying the batch.
    case 'flag-changed':
    case 'item-moved':
    case 'actor-state-changed':
    case 'knowledge-gained':
    case 'node-entered':
    case 'node-exited':
    case 'scheduled':
    case 'quiz-started':
    case 'quiz-ended':
    case 'hazard-triggered':
    case 'conversation-started':
    case 'conversation-ended':
    case 'hint-penalty-applied': {
      return [];
    }
    default: {
      return ['An unrecognised event occurred.'];
    }
  }
}
