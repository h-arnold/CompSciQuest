# Shared rule spine (design)

Status: planned · Last updated: 2026-11-24

Part of the CompSciQuest design set: [architecture](architecture.md) ·
[storage schema](storage-schema.md) · [NPCs](npcs.md) · [hazards](hazards.md) ·
[quiz combat](combat.md) · [puzzles](puzzles.md) · [hints](hints.md).

## 1. Purpose

NPCs, hazards, quiz combat, puzzles and hints all reduce to the same primitive:
*when a condition holds, apply a set of effects, possibly on a schedule*. Building
five separate engines would duplicate the same machinery five times, so this
document defines one small **rule spine** in `src/core/` and the thin domain
systems documented separately sit on top of it.

| Concept | Question it answers | Where it lives |
| --- | --- | --- |
| `Condition` | "Is this true right now?" | `src/core/rules/Condition.ts` |
| `Trigger` | "When should I check?" | `src/core/rules/Trigger.ts` |
| `Effect` | "What should change?" | `src/core/effects/Effect.ts` |
| `Scheduler` | "When on the turn clock?" | `src/core/scheduling/Scheduler.ts` |

`EffectApplier` is the only code that applies effects to `GameState`. `ScoreTracker`
remains the only writer of score and progress: an effect that should score emits
`topic-completed` (or `hint-penalty-applied`) rather than writing a number.

## 2. Turn pipeline (amends architecture.md §6.2)

Events are **buffered for the whole turn** and published once, after all state is
final. This is the TADS "transcript" idea: it makes output deterministic, prevents
the UI rendering a half-updated state, and makes observer order explicit.

```
1. Resolve     Tokenizer → Parser → NameResolver / TopicResolver → Command
2. Validate    RuleEngine checks preconditions
3. Execute     verb handler applies Effects; events go into a per-turn buffer
4. React       Scheduler → Hazards → NPC reactions → Puzzles → Auto-hints
5. Observe     ScoreTracker.observe(events) → Session.observe(events)
6. Publish     EventBus.publish(events) → UI renders one coherent batch
```

Notes:

- `Game` (application layer) owns the buffer and the ordering. `EventBus` stays a
  simple publish/subscribe channel, but its `publish` method takes the **whole
  batch**: `publish(events: readonly GameEvent[]): void`.
- `ScoreTracker` runs **before** `Session` so `game-over` and `game-won` carry the
  final score. Neither subscribes to the bus; both are explicit phase-5 calls.
- Phase 4 is ordered: scheduled events, then hazards, then NPC reactions, then
  puzzle completion, then automatic hints.
- **NPC reactions** in phase 4 only end a conversation when the player leaves the
  room. There is deliberately **no turn timeout** (decision: no implicit
  farewell). Topic matching happens in phase 3 when a conversation command is
  submitted.
- **Auto-hints** in phase 4 only deliver hints whose counter thresholds have been
  reached. Answering a quiz question happens in phase 3 via the `answer` command;
  `QuizSystem` has no reactive step beyond auto-hints.
- A reaction effect can enable another rule. Each rule ID may fire **at most once
  per turn**; a repeat is skipped **silently** (decision: visible only in tests).
  One extra reaction pass is allowed; a third is not.
- The turn counter increments once per submitted game command, whether or not it
  succeeded. Meta actions (save/load/download/import/restart) are intercepted
  before phase 1 and do not advance the turn.

## 3. Condition

A `Condition` is data, evaluated by `ConditionEvaluator` against `GameState` and
the current turn context. It is a superset of the existing `Precondition`.

```ts
// src/core/rules/Condition.ts
export type Condition =
  | { readonly kind: 'flag-set'; readonly flag: string }
  | { readonly kind: 'has-item'; readonly itemId: string }
  | { readonly kind: 'visited-room'; readonly roomId: string }
  | { readonly kind: 'topic-complete'; readonly topicId: string }
  | { readonly kind: 'npc-knows'; readonly actorId: string; readonly topicId: string }
  | { readonly kind: 'actor-state'; readonly actorId: string; readonly stateId: string }
  | { readonly kind: 'in-node'; readonly actorId: string; readonly nodeId: string }
  | { readonly kind: 'puzzle-solved'; readonly puzzleId: string }
  | { readonly kind: 'quiz-passed'; readonly quizId: string }
  | { readonly kind: 'counter-at-least'; readonly key: string; readonly value: number }
  | { readonly kind: 'all' | 'any'; readonly of: readonly Condition[] }
  | { readonly kind: 'not'; readonly of: Condition };
```

`counter-at-least` is deliberately generic. The agreed key namespace is:

| Counter key | Incremented by |
| --- | --- |
| `hints-shown:<hintId>` | `show-hint` effect |
| `failed-attempts:<quizId>` | a wrong quiz answer |
| `turns-since:<puzzleId>` | each turn after a puzzle first becomes active |

`quiz-passed` reads the flag `quiz-passed:<quizId>`, which the quiz's `onPass`
effects must set with `set-flag`. There is no other writer.

Rules: conditions are pure; missing flags/IDs evaluate to `false`, never throw
(`noUncheckedIndexedAccess`); the same evaluator powers pre-turn validation and
post-turn reaction checks.

## 4. Trigger

```ts
// src/core/rules/Trigger.ts
export type Trigger =
  | { readonly kind: 'on-room-enter'; readonly roomId: string }
  | { readonly kind: 'on-turn' }
  | { readonly kind: 'on-verb'; readonly verb: string }
  | { readonly kind: 'on-item-used'; readonly itemId: string }
  | { readonly kind: 'on-event'; readonly eventType: string }
  | { readonly kind: 'on-schedule'; readonly eventId: string };
```

Triggers are checked in phase 4 against the turn's buffered events and final
state. A definition may have one trigger; multiple conditions combine with `all`.

## 5. Effect and EffectApplier

```ts
// src/core/effects/Effect.ts
export type Effect =
  | { readonly kind: 'set-flag'; readonly flag: string; readonly value: boolean }
  | { readonly kind: 'message'; readonly text: string }
  | { readonly kind: 'change-lives'; readonly delta: number; readonly reason: string }
  | { readonly kind: 'complete-topic'; readonly topicId: string }
  | { readonly kind: 'grant-item' | 'remove-item'; readonly itemId: string }
  | { readonly kind: 'transfer-item'; readonly itemId: string;
      readonly fromOwnerId: string; readonly toOwnerId: string }
  | { readonly kind: 'move-player'; readonly roomId: string; readonly reason: string }
  | { readonly kind: 'set-actor-state'; readonly actorId: string; readonly stateId: string }
  | { readonly kind: 'learn-topic'; readonly actorId: string; readonly topicId: string }
  | { readonly kind: 'enter-node'; readonly actorId: string; readonly nodeId: string }
  | { readonly kind: 'exit-node'; readonly actorId: string }
  | { readonly kind: 'set-puzzle-active'; readonly puzzleId: string }
  | { readonly kind: 'set-puzzle-solved'; readonly puzzleId: string }
  | { readonly kind: 'schedule'; readonly event: ScheduledEvent }
  | { readonly kind: 'start-quiz'; readonly quizId: string; readonly actorId: string }
  | { readonly kind: 'show-hint'; readonly hintId: string; readonly level: number;
      readonly text: string };
```

Conventions:

- `EffectApplier.apply(effect): GameEvent[]` is the only mutator of these fields.
  Handlers and domain systems **return** effects; they do not write state directly.
- `transfer-item` uses the reserved owner ID `'player'`; other owners are actor
  IDs or room IDs. It updates both inventories atomically — no separate
  remove/grant pair is needed for `give`/`show`. Every item has exactly one owner
  ([storage-schema.md §3.3](storage-schema.md#33-invariants)).
- `enter-node` requires a `nodeId`; `exit-node` has none. Optional properties are
  omitted, never assigned `undefined` (`exactOptionalPropertyTypes`).
- Every effect produces at least one buffered event, so every state change is
  explainable in the output log.
- `change-lives` emits `lives-changed`; `Session` owns game-over.
- `complete-topic` emits `topic-completed`; `ScoreTracker` owns the score.
- `move-player` emits `room-entered`, so room scoring in `architecture.md` §6.3
  continues to work for quiz-failure teleports.
- `set-puzzle-active` emits `puzzle-activated`; `set-puzzle-solved` emits
  `puzzle-solved`.

## 6. Scheduler (TADS fuse / daemon)

```ts
// src/core/scheduling/ScheduledEvent.ts
export interface ScheduledEvent {
  readonly id: string;
  readonly kind: 'fuse' | 'daemon';
  readonly remainingTurns: number;
  readonly repeatEveryTurns?: number; // omitted when equal to remainingTurns
  readonly effect: Effect;
}
```

- A **fuse** counts down by one each turn and fires at `0`, then is removed.
- A **daemon** fires whenever `remainingTurns` reaches `0` and is reset to
  `repeatEveryTurns` (defaulting to the initial `remainingTurns`).
- `Scheduler.tick(turn)` runs first in phase 4. All scheduled state is serialised
  in `GameStateDto.schedule`, so a reload resumes timers accurately.
- Fire order is array order in the save.

## 7. Random port

Quiz question order and varied NPC replies need randomness, but the core must
stay deterministic for saves and tests.

- Define a `Random` port: `nextInt(maxExclusive: number): number`.
- The production implementation is a seeded PRNG (e.g. mulberry32) whose seed
  lives in `GameStateDto.rngSeed` as an unsigned 32-bit integer; the seed
  **advances on each draw and is saved**
  ([storage-schema.md §3.3](storage-schema.md#33-invariants)).
- Unit tests inject a fake `Random` returning fixed values.
- No `Math.random()` anywhere in `src/core`.

## 8. State additions — schema stays v1

Per decision, **there is no schema migration step yet**. `SCHEMA_VERSION` remains
`1` and `SaveManager` does not migrate. Every persisted shape — `GameStateDto`,
`SaveDto`, `RoomStateDto`, `NpcStateDto`, `HazardStateDto`, `PuzzleStateDto` /
`PuzzlePhase`, `HintStateDto`, `QuizStateDto`, `AreaProgress`, `SessionStatus`,
`ScheduledEvent` and `LoadResult` — is defined canonically in
[storage-schema.md §3](storage-schema.md#3-persisted-shape-canonical). Subsystem
documents link there instead of redeclaring fields.

What is specific to this rule spine:

- Only plain arrays, records, strings, numbers and booleans go into DTOs — no
  `Set`, `Map`, functions or class instances (decision: keep JSON trivial; no
  custom serialiser). Optional properties are omitted, never `undefined`.
- `counters` uses free-form string keys (no prefix restriction at load). The
  three defined prefixes and the `turns-since` activation/increment rule are in
  §3 and [storage-schema.md §4](storage-schema.md#4-counters-and-stuckness).
- Item ownership is a property of Player, NPC and Room state; the `rooms` record
  holds `RoomStateDto`. Mutable door/container/item state uses kebab-case
  `flags` keys (§5).
- `score` is not stored: `ScoreTracker` writes `AreaProgress.earnedScore` and the
  total is derived at restore ([storage-schema.md §7](storage-schema.md#7-restore-time-derivation)).
- Old v1 saves made before these fields existed fail strict validation. That is
  accepted while the game is unreleased.

## 9. Event additions

The `GameEvent` union in `architecture.md` §7 gains these variants. Together the
full set of new events is:

```ts
| { readonly type: 'conversation-started'; readonly actorId: string }
| { readonly type: 'npc-spoke'; readonly actorId: string; readonly text: string }
| { readonly type: 'conversation-ended'; readonly actorId: string; readonly reason: string }
| { readonly type: 'topic-suggested'; readonly actorId: string; readonly text: string }
| { readonly type: 'hazard-triggered'; readonly hazardId: string; readonly reason: string }
| { readonly type: 'puzzle-activated'; readonly puzzleId: string }
| { readonly type: 'puzzle-solved'; readonly puzzleId: string; readonly topicId?: string }
| { readonly type: 'quiz-started'; readonly quizId: string; readonly actorId: string }
| { readonly type: 'question-asked'; readonly quizId: string; readonly questionId: string;
    readonly prompt: string; readonly options: readonly string[] }
| { readonly type: 'answer-evaluated'; readonly quizId: string; readonly questionId: string;
    readonly correct: boolean; readonly explanation: string }
| { readonly type: 'quiz-ended'; readonly quizId: string; readonly passed: boolean;
    readonly reason: string }
| { readonly type: 'hint-shown'; readonly hintId: string; readonly level: number;
    readonly text: string }
| { readonly type: 'hint-penalty-applied'; readonly hintId: string; readonly delta: number };
```

`hint-penalty-applied` is the only new score-related event; `ScoreTracker`
consumes it. All text is rendered with `textContent`.

## 10. Content registration

All definitions are declarative data under `src/content/`, never hard-coded in
engine classes. Each system has a catalogue exposing `getById(id)` and any
targeted lookups. The engine consumes catalogues through interfaces, so tests can
inject small fixtures. Content validation enforces global uniqueness of object
and NPC aliases so `NameResolver` never has to guess.

## 11. Determinism and ordering rules

1. Definitions are evaluated in declaration order (arrays), never by object-key
   iteration.
2. No wall-clock reads in core; `Clock` is for `savedAt` only.
3. No `Math.random()` in core; use the injected `Random` port.
4. Rules that fire more than once in a turn are skipped after their first fire.
   The skip is silent to the player and asserted only in tests.
5. All UI text comes from events and is rendered with `textContent`.

## 12. Tests

- `ConditionEvaluator`: every kind, nested combinators, missing IDs → `false`.
- `EffectApplier`: each effect mutates only its declared field and emits the
  expected event; `ScoreTracker` still owns score.
- `Scheduler`: fuse countdown, daemon repeat with a differing interval,
  save/restore mid-countdown.
- `Random`: fixed-seed reproducibility across save/restore.
- Turn pipeline: a hazard firing in phase 4 is visible to `ScoreTracker` before
  UI publish; cascades stop after the second reaction pass; `game-over` carries
  the post-score total.

## 13. Decisions resolved

- Skipped cascades are silent to the player; only tests observe them.
- `counters` are never pruned — a complete audit trail is kept; keys are
  free-form strings with no prefix restriction at load.
- DTOs use plain arrays/records; no custom serialiser. Item ownership is a
  property of Player, NPC and Room state, and mutable item/exit state uses the
  kebab-case `flags` convention.
- `score` is not persisted: `ScoreTracker` writes `AreaProgress.earnedScore` and
  the total is derived at restore.
- Conversation starts implicitly on `ask`/`give`/`show`; there is no turn timeout.
- `give`/`show` use a dedicated `transfer-item` effect.
- Object and NPC aliases must be globally unique, enforced by content validation.
- Schema versioning/migration is revisited before public release, not now.
