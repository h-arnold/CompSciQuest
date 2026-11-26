// Pure GameEvent → transcript lines (application-and-ui.md §6.1). Internal-state
// events are suppressed; score-changed prints once only on a real gain, in
// friendly wording without a room ID. Labels come from the injected bundle.
import type { ContentBundle } from '../content/ContentBundle';
import type { GameEvent } from '../core/events/GameEvent';

function label(bundle: ContentBundle, id: string): string {
  return (
    bundle.items.getById(id)?.name ??
    bundle.actors.getById(id)?.aliases[0] ??
    bundle.rooms.getById(id)?.title ??
    id
  );
}

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
    case 'conversation-started': {
      return [`Conversation started with ${label(bundle, event.actorId)}.`];
    }
    case 'conversation-ended': {
      return [
        `Conversation with ${label(bundle, event.actorId)} ended (${event.reason}).`,
      ];
    }
    case 'hazard-triggered': {
      return [`Hazard ${event.hazardId}: ${event.reason}.`];
    }
    case 'puzzle-activated': {
      return [`Puzzle ${event.puzzleId} is now active.`];
    }
    case 'puzzle-solved': {
      return [
        `Puzzle ${event.puzzleId} solved${
          event.topicId === undefined
            ? '.'
            : ` (${topicLabel(bundle, event.topicId)}).`
        }`,
      ];
    }
    case 'quiz-started': {
      return [`Quiz ${event.quizId} started.`];
    }
    case 'quiz-ended': {
      return [
        `Quiz ${event.quizId} ${event.passed ? 'passed' : 'failed'}: ${event.reason}.`,
      ];
    }
    case 'hint-penalty-applied': {
      return [`Hint penalty: ${event.delta}.`];
    }
    case 'flag-changed':
    case 'item-moved':
    case 'actor-state-changed':
    case 'knowledge-gained':
    case 'node-entered':
    case 'node-exited':
    case 'scheduled': {
      return [];
    }
    default: {
      return ['An unrecognised event occurred.'];
    }
  }
}
