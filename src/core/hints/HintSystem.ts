// Phase-4 seam from application-and-ui.md §8 / shared-rules.md §2. Explicit
// `hint` commands and automatic threshold hints both deliver through the
// injected applier; this module never writes score, puzzle or quiz state.
import type { ContentBundle } from '../../content/ContentBundle';
import type { Effect } from '../effects/Effect';
import type { EffectApplier } from '../effects/EffectApplier';
import type { GameEvent } from '../events/GameEvent';
import type { GameState } from '../GameState';
import type { ConditionEvaluator } from '../rules/ConditionEvaluator';
import type { HintLevel, HintSequence } from './HintSequence';
import type { TurnContext } from '../TurnContext';

export interface HintSystem {
  react(
    context: TurnContext,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}

export interface HintSystemDependencies {
  readonly bundle: ContentBundle;
  readonly evaluator: ConditionEvaluator;
  readonly applier: EffectApplier;
}

const NO_CONTEXT = 'No hints available here.';
const COOLDOWN = 'Think about it for a moment.';
const EXHAUSTED = 'There is nothing more to suggest just now.';

function sequenceForTarget(
  bundle: ContentBundle,
  targetId: string,
): HintSequence | undefined {
  return (
    bundle.hints.getById(targetId) ??
    bundle.hints.all.find((sequence) => sequence.targets.includes(targetId))
  );
}

function sequenceForQuiz(
  bundle: ContentBundle,
  quizId: string,
): HintSequence | undefined {
  const declared = bundle.quizzes.getById(quizId)?.hintSequenceId;
  const byDeclaration =
    declared === undefined ? undefined : bundle.hints.getById(declared);
  return byDeclaration ?? sequenceForTarget(bundle, quizId);
}

function sequenceForPuzzle(
  bundle: ContentBundle,
  puzzleId: string,
): HintSequence | undefined {
  const puzzle = bundle.puzzles.getById(puzzleId);
  const declared = puzzle?.hintSequenceId;
  const byDeclaration =
    declared === undefined ? undefined : bundle.hints.getById(declared);
  return byDeclaration ?? sequenceForTarget(bundle, puzzleId);
}

function sequenceForRoom(
  bundle: ContentBundle,
  roomId: string,
): HintSequence | undefined {
  const direct = sequenceForTarget(bundle, roomId);
  if (direct !== undefined) return direct;
  for (const topic of bundle.specTopics.getByRoomId(roomId)) {
    const sequence = sequenceForTarget(bundle, topic.id);
    if (sequence !== undefined) return sequence;
  }
  return undefined;
}

function resolveContext(
  context: TurnContext,
  dependencies: HintSystemDependencies,
  commandTargetId: string | undefined,
): HintSequence | undefined {
  const { bundle } = dependencies;
  if (commandTargetId !== undefined) {
    return sequenceForTarget(bundle, commandTargetId);
  }
  const quizId = context.state.quiz.activeQuizId;
  if (quizId !== undefined) {
    const quizSequence = sequenceForQuiz(bundle, quizId);
    if (quizSequence !== undefined) return quizSequence;
  }
  return sequenceForRoom(bundle, context.state.player.position.roomId);
}

function nextLevel(
  sequence: HintSequence,
  state: GameState,
  context: TurnContext,
  evaluator: ConditionEvaluator,
): HintLevel | undefined {
  const shown = new Set(state.hints[sequence.id]?.levelsShown);
  // Authored hint levels are declared in ascending order (hints.md §2).
  for (const level of sequence.levels) {
    if (shown.has(level.level)) continue;
    // Independent unlock conditions must not skip a lower unshown level.
    return evaluator.evaluate(level.unlock, state, context) ? level : undefined;
  }
  return undefined;
}

function wasShownThisTurn(
  state: GameState,
  hintId: string,
  turn: number,
): boolean {
  return state.hints[hintId]?.lastShownTurn === turn;
}

function applyMessage(
  applier: EffectApplier,
  text: string,
): readonly GameEvent[] {
  return applier.apply({ kind: 'message', text });
}

function applyLevel(
  sequence: HintSequence,
  level: HintLevel,
  applier: EffectApplier,
): readonly GameEvent[] {
  const effect: Effect = {
    kind: 'show-hint',
    hintId: sequence.id,
    level: level.level,
    text: level.text,
  };
  return applier.apply(effect);
}

function explicitHint(
  context: TurnContext,
  dependencies: HintSystemDependencies,
): readonly GameEvent[] {
  const command = context.command;
  if (command.kind !== 'hint') return [];
  const sequence = resolveContext(context, dependencies, command.targetId);
  if (sequence === undefined) {
    return applyMessage(dependencies.applier, NO_CONTEXT);
  }
  if (wasShownThisTurn(context.state, sequence.id, context.turn)) return [];
  const lastShownTurn = context.state.hints[sequence.id]?.lastShownTurn;
  if (
    lastShownTurn !== undefined &&
    sequence.cooldownTurns !== undefined &&
    context.turn - lastShownTurn < sequence.cooldownTurns
  ) {
    return applyMessage(dependencies.applier, COOLDOWN);
  }
  const level = nextLevel(
    sequence,
    context.state,
    context,
    dependencies.evaluator,
  );
  return level === undefined
    ? applyMessage(dependencies.applier, EXHAUSTED)
    : applyLevel(sequence, level, dependencies.applier);
}

function autoCandidates(
  context: TurnContext,
  dependencies: HintSystemDependencies,
  events: readonly GameEvent[],
): readonly HintSequence[] {
  const { bundle } = dependencies;
  const { state } = context;
  const candidates: HintSequence[] = [];
  const seenIds = new Set<string>();
  const consider = (
    sequence: HintSequence | undefined,
    counterKey: string,
    isTriggered: boolean,
  ): void => {
    if (
      !isTriggered ||
      sequence === undefined ||
      sequence.autoOfferAfter === undefined ||
      seenIds.has(sequence.id)
    ) {
      return;
    }
    const count = state.counters[counterKey] ?? 0;
    if (count < sequence.autoOfferAfter) return;
    seenIds.add(sequence.id);
    candidates.push(sequence);
  };

  // A quiz offers only on a turn whose batch carries a new wrong answer
  // (hints.md §4); later turns with no wrong answer offer nothing.
  for (const event of events) {
    if (event.type !== 'answer-evaluated' || event.correct) continue;
    consider(
      sequenceForQuiz(bundle, event.quizId),
      `failed-attempts:${event.quizId}`,
      true,
    );
  }
  // A puzzle offers once, on the turn its stuck-turn counter reaches the
  // threshold; an unchanged counter above it never triggers again.
  for (const [puzzleId, record] of Object.entries(state.puzzles)) {
    if (record.phase !== 'active') continue;
    const counterKey = `turns-since:${puzzleId}`;
    const sequence = sequenceForPuzzle(bundle, puzzleId);
    const isTriggered =
      sequence?.autoOfferAfter !== undefined &&
      (state.counters[counterKey] ?? 0) === sequence.autoOfferAfter;
    consider(sequence, counterKey, isTriggered);
  }
  return candidates;
}

function automaticHints(
  context: TurnContext,
  dependencies: HintSystemDependencies,
  events: readonly GameEvent[],
): readonly GameEvent[] {
  if (context.command.kind === 'hint') return [];
  const emitted: GameEvent[] = [];
  for (const sequence of autoCandidates(context, dependencies, events)) {
    if (wasShownThisTurn(context.state, sequence.id, context.turn)) continue;
    const level = nextLevel(
      sequence,
      context.state,
      context,
      dependencies.evaluator,
    );
    if (level === undefined) continue;
    for (const event of applyLevel(sequence, level, dependencies.applier)) {
      emitted.push(event);
    }
  }
  return emitted;
}

export function createHintSystem(
  dependencies: HintSystemDependencies,
): HintSystem {
  return {
    react(context, events): readonly GameEvent[] {
      return [
        ...explicitHint(context, dependencies),
        ...automaticHints(context, dependencies, events),
      ];
    },
  };
}
