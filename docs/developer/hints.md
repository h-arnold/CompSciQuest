# Hints (design)

Status: planned · Last updated: 2026-11-24

Part of the CompSciQuest design set: [architecture](architecture.md) · [application and UI](application-and-ui.md) ·
[shared rule spine](shared-rules.md) · [storage schema](storage-schema.md) ·
[NPCs](npcs.md) · [hazards](hazards.md) ·
[quiz combat](combat.md) · [puzzles](puzzles.md).

## 1. Scope

Hints are a first-class mechanic: this is a revision tool, so helping a stuck
student is part of the product. The design follows TADS's adaptive hint idea —
hints escalate in levels and can be unlocked by evidence that the player is
stuck.

Hints are planned for v1 with designs in this document.

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

`targets` may include GCSE spec topic IDs, so the `ScorePanel` can label which
revision area a hint belongs to. Definitions live in `src/content/hints/`;
`HintCatalogue` resolves by ID and by target.

`HintStateDto` (`levelsShown`, `lastShownTurn?`) is defined in
[storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).

Counters for gating live in `GameStateDto.counters` using the shared namespace:
`hints-shown:<hintId>`, `failed-attempts:<quizId>`, `turns-since:<puzzleId>`.
Systems increment them; conditions only read them.

## 3. Commands and delivery

The `hint` variant is defined in the canonical `Command` union in
[application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs).
Its optional `targetId` is omitted when there is no explicit context.

Context resolution order:

1. explicit `targetId` (if given);
2. active quiz (`QuizStateDto.activeQuizId`);
3. the current room — a `HintSequence` whose `targets` includes that room's ID or
   one of its mapped spec topics.

There is no separate "active puzzle context" field. If none of these resolves,
emit a friendly "no hints available here" message instead of an error.

When a sequence is found, choose the lowest-numbered level that is unlocked and
has not been shown (i.e. the next level in order). Independent unlock conditions
must not skip levels. Then apply a `show-hint` effect. Repeated
requests are rate-limited: if `cooldownTurns` is set and `lastShownTurn` exists,
a request before `turn - lastShownTurn >= cooldownTurns` returns a short "think
about it for a moment" message and does not show a hint. `hint-shown` is defined
in the canonical union in
[application-and-ui.md §6](application-and-ui.md#6-canonical-event-union-and-rendering);
`HintPanel` (or `OutputLog`) renders it with `textContent`.

Hints never write puzzle/quiz state.

## 4. Adaptive behaviour

Two delivery modes, both supported:

1. **Explicit** — the player types `hint`; the next available level is shown.
2. **Automatic** — if `autoOfferAfter` is set, a wrong quiz answer or N stuck
   turns increments a counter; when it reaches the threshold, a `show-hint`
   effect is applied in phase 4.

Automatic hints emit the same `hint-shown` event, so the UI needs no special
case. **There is no "reveal the answer" level**: even the final hint is a nudge
or instruction, and the player must still supply an answer to pass a quiz.

## 5. Score interaction

The default `scorePenalty` is **0** — penalties discourage the behaviour a
revision tool should encourage. If content opts in, `HintSystem` must not write
score directly; it emits `hint-penalty-applied { hintId, delta }` and
`ScoreTracker` (the sole score writer) applies it. This event is part of the
canonical union in
[application-and-ui.md §6](application-and-ui.md#6-canonical-event-union-and-rendering).

## 6. Tests

- Explicit `targetId` takes precedence over an active quiz.
- With no target and no quiz, resolution uses the current room's mapped topics.
- Missing target or empty sequence produces a friendly message, not an error.
- Only unlocked, unshown levels are delivered; levels ascend in order.
- `cooldownTurns` blocks early repeat requests and allows them after the interval.
- `autoOfferAfter` fires at the threshold and not before.
- Hint delivery does not change `solved`, `correctCount` or quiz state.
- No hint level reveals the answer.
- `levelsShown`, `lastShownTurn` and counters survive JSON save/load; a shown
  hint is not repeated after reload.
- If a penalty is configured, `ScoreTracker` (not `HintSystem`) writes it.

## 7. Decisions resolved

- Hints are tied to spec topics so the score panel can label the revision area.
- Repeated top-level requests use a small cooldown (`cooldownTurns`).
- No hint level reveals the answer; the player must always answer.
- Hints are never offered during a hazard penalty.
- Optional penalties go through `hint-penalty-applied` and `ScoreTracker`.
