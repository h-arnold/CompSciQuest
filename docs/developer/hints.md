# Hints

Hint ladders are a first-class mechanic: this is a revision tool, so helping a
stuck student is part of the product. Hints escalate in levels and can be
unlocked by evidence that the player is stuck. The
[developer documentation index](README.md) lists the other subsystem docs.

## 1. Scope

A hint ladder is a `HintSequence`: an ordered set of levels with unlock
conditions. `HintSystem` delivers the next level on an explicit `hint` or
automatically when a stuck counter reaches its threshold. It never writes score,
puzzle or quiz state.

## 2. Model

```ts
// src/core/hints/HintSequence.ts — declarative definition
export interface HintLevel {
  readonly level: number; // 1-based
  readonly text: string;
  readonly unlock: Condition; // shared spine §3
  readonly scorePenalty?: number; // omitted = 0; see §5
}

export interface HintSequence {
  readonly id: string;
  readonly targets: readonly string[]; // puzzle / quiz / topic ids
  readonly levels: readonly HintLevel[];
  readonly autoOfferAfter?: number; // failed attempts or stuck turns
  readonly cooldownTurns?: number; // minimum turns between requests
}
```

`targets` links a ladder to puzzle, quiz, room and spec-topic IDs so
`HintSystem` can resolve context ([§3](#3-commands-and-delivery)). Hints are
authored in `docs/content/<area>/hints.yaml` and generated into
`src/content/authored/hints.ts` as `ContentBundle.hints`. `HintSystem` resolves
a target through `bundle.hints.all` by sequence ID or by membership in
`targets`.

`HintStateDto` (`levelsShown`, `lastShownTurn?`) is defined in
[storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).

A level's `unlock` is a `Condition`, usually `counter-at-least` on one of the
shared counter keys
([storage-schema.md §4](storage-schema.md#4-counters-and-stuckness)).

## 3. Commands and delivery

The `hint` variant is defined in the canonical `Command` union in
[application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs).
Its optional `targetId` is omitted when there is no explicit context.

Context resolution order:

1. an explicit `targetId` (if given), which must resolve to a sequence; an
   explicit target does not fall through to the next context;
2. the active quiz (`QuizStateDto.activeQuizId`), through the quiz's
   `hintSequenceId` or a sequence that targets the quiz ID;
3. the current room — a `HintSequence` whose `targets` includes that room's ID
   or one of its mapped spec topics.

An explicit `targetId` is a context ID supplied by the caller. The terminal's
`hint` command is normally typed with no argument. A typed argument is resolved
through the ordinary name resolver, whose aliases cover items, actors and
scenery rather than hint, quiz, puzzle or topic IDs; an unresolved phrase is
treated as a bare `hint` and resolved by the context order above, so an
unrecognised word never produces a parser error.

When a sequence resolves, `HintSystem` shows the lowest-numbered level that is
unlocked and has not been shown; independent unlock conditions never skip a
lower unshown level. With no resolved sequence it emits a friendly "no hints
available here" message.

Repeated requests are rate-limited: after a hint shown on an earlier turn, a
request before `cooldownTurns` turns have passed returns a short "think about it
for a moment" message. A hint already shown this turn is not repeated: the
command produces no new output.

Explicit delivery runs in **phase 4**, after the puzzle system, so a puzzle
solved in the same turn is reported before its hint
([application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures)).
The phase-3 dispatch for `hint` emits no effects. `hint-shown` is in the
canonical union in
[application-and-ui.md §6](application-and-ui.md#6-canonical-event-union-and-rendering);
`HintPanel` renders it with `textContent`.

## 4. Adaptive behaviour

Explicit delivery is the `hint` command. Automatic delivery applies when
`autoOfferAfter` is set and the relevant stuck counter reaches it; `HintSystem`
then applies a `show-hint` effect in phase 4. A turn whose command is `hint`
skips automatic delivery.

- **Quiz trigger.** A wrong answer increments `failed-attempts:<quizId>`, and the
  ladder offers a level on a turn whose batch contains an incorrect
  `answer-evaluated` for that quiz. A later turn with no wrong answer offers
  nothing.
- **Puzzle trigger.** Each active puzzle's `turns-since:<puzzleId>` counter
  advances every turn. The ladder offers a level once, on the turn the counter
  reaches `autoOfferAfter`; a counter that stays above the threshold never
  triggers again.

Each trigger delivers at most one level, and a hint shown this turn is not
delivered again by a later pass in the same turn. Further levels remain
available through an explicit `hint`, subject to `cooldownTurns`. Automatic
hints emit the same `hint-shown` event, so the UI needs no special case.

**There is no "reveal the answer" level**: even the final hint is a nudge or
instruction, and the player must still supply an answer to pass a quiz.

## 5. Score interaction

The default `scorePenalty` is 0. A `show-hint` effect always emits `hint-shown`
and `hint-penalty-applied`; the delta is 0 when the level declares no penalty.
`HintSystem` never writes score, and `ScoreTracker` applies the delta
([application-and-ui.md §9](application-and-ui.md#9-effect-to-event-mapping)).
