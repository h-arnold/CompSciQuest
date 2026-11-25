// Pure GameEvent → transcript lines (application-and-ui.md §6.1). Every event
// yields at least one line; labels come from the injected content bundle.
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
      return [
        `Score (${event.reason}): ${event.delta} — total ${event.total}.`,
      ];
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
    case 'flag-changed': {
      return [`${event.flag} = ${event.value}.`];
    }
    case 'item-moved': {
      return [
        `${label(bundle, event.itemId)} moved from ${event.fromOwnerId} to ${event.toOwnerId}.`,
      ];
    }
    case 'actor-state-changed': {
      return [`${label(bundle, event.actorId)} is now ${event.stateId}.`];
    }
    case 'knowledge-gained': {
      return [`You learned about ${topicLabel(bundle, event.topicId)}.`];
    }
    case 'node-entered': {
      return [`Entered conversation node ${event.nodeId}.`];
    }
    case 'node-exited': {
      return ['Left the conversation node.'];
    }
    case 'scheduled': {
      return [
        `${event.kind} ${event.eventId} scheduled for ${event.remainingTurns} turn(s).`,
      ];
    }
    default: {
      return ['An unrecognised event occurred.'];
    }
  }
}
