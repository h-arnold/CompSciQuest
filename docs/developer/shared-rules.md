# Shared rule spine

Index: [docs/developer/README.md](README.md).

## 1. Purpose

NPCs, hazards, quiz combat, puzzles and hints all reduce to the same primitive:
_when a condition holds, apply a set of effects, possibly on a schedule_. Building
five separate engines would duplicate the same machinery five times, so this
document defines one small **rule spine** in `src/core/` and the thin domain
systems documented separately sit on top of it.

| Concept     | Question it answers       | Where it lives                     |
| ----------- | ------------------------- | ---------------------------------- |
| `Condition` | "Is this true right now?" | `src/core/rules/Condition.ts`      |
| `Trigger`   | "When should I check?"    | `src/core/rules/Trigger.ts`        |
| `Effect`    | "What should change?"     | `src/core/effects/Effect.ts`       |
| `Scheduler` | "When on the turn clock?" | `src/core/scheduling/Scheduler.ts` |

`EffectApplier` is the only code that applies effects to `GameState`. Scoring is
owned by [application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic):
`ScoreTracker` is the sole writer of score and progress.

## 2. Turn pipeline

Events are **buffered for the whole turn** and published once, after all state is
final. This is the TADS "transcript" idea: it makes output deterministic, prevents
the UI rendering a half-updated state, and makes observer order explicit.

```
1. Resolve     Tokenizer → Parser → NameResolver → Command
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
- **NPC reactions** are handled by `DialogueSystem` in phase 4. It selects the
  conversation topic through `TopicResolver`, applies the effects and ends a
  conversation only when the player leaves the room. Phase 1 resolves verbs and
  nouns into a `Command` and does no topic matching. [npcs.md §4](npcs.md#4-conversation-flow)
  owns the conversation-flow rule.
- **Auto-hints** in phase 4 only deliver hints whose counter thresholds have been
  reached. Answering a quiz question happens in phase 3 via the `answer` command;
  `QuizSystem` has no reactive step beyond auto-hints.
- A reaction effect can enable another rule. Each rule ID may fire **at most once
  per turn**; a repeat is skipped **silently**. One extra reaction pass is
  allowed; a third is not.

## 3. Condition

A `Condition` is data, evaluated by `ConditionEvaluator` against `GameState` and
the current turn context. It is a superset of the existing `Precondition`.

```ts
// src/core/rules/Condition.ts
export type Condition =
  | { readonly kind: 'flag-set'; readonly flag: string }
  | { readonly kind: 'has-item'; readonly itemId: string }
  | { readonly kind: 'visited-room'; readonly roomId: string }
  | { readonly kind: 'in-room'; readonly roomId: string }
  | {
      readonly kind: 'in-area';
      readonly worldId: string;
      readonly areaId: string;
    }
  | { readonly kind: 'topic-complete'; readonly topicId: string }
  | {
      readonly kind: 'npc-knows';
      readonly actorId: string;
      readonly topicId: string;
    }
  | {
      readonly kind: 'actor-state';
      readonly actorId: string;
      readonly stateId: string;
    }
  | {
      readonly kind: 'in-node';
      readonly actorId: string;
      readonly nodeId: string;
    }
  | { readonly kind: 'puzzle-solved'; readonly puzzleId: string }
  | { readonly kind: 'quiz-passed'; readonly quizId: string }
  | {
      readonly kind: 'counter-at-least';
      readonly key: string;
      readonly value: number;
    }
  | { readonly kind: 'all' | 'any'; readonly of: readonly Condition[] }
  | { readonly kind: 'not'; readonly of: Condition };
```

`in-room` and `in-area` are the only position-sensitive kinds. They compare the
player's **current** `Position` (`worldId`/`areaId`/`roomId`) with the named IDs:
`in-room` is true only in that room; `in-area` is true only when BOTH `worldId`
and `areaId` match, because area IDs are unique only together with `worldId`
([application-and-ui.md §3.2](application-and-ui.md#32-world-area-room-and-item-definitions))
and `AreaProgress` is keyed by the pair. `visited-room` and `topic-complete` are
true once the room or topic has ever been seen; they scan **every** `AreaProgress`
row.

Missing IDs evaluate to `false` for all four kinds.

A **location scope** is an `in-room`/`in-area` condition, or an `all` containing
at least one such condition. A `not` or `any` shape is not a single location
scope: a check that needs to extract one reports a gap rather than guessing.
Conversation topics use these kinds through their existing `isActive`
([npcs.md §2](npcs.md#2-model)).

`counter-at-least` is deliberately generic. The three counter prefixes and their
increments are owned by
[storage-schema.md §4](storage-schema.md#4-counters-and-stuckness).

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

Triggers are checked in phase 4 against the turn's buffered events, final state
and the command being handled. The command carrier is `TurnContext.command`,
pinned in [application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures):
`on-verb` matches `command.kind === trigger.verb`, and `on-item-used` matches an
`itemId` on the command equal to `trigger.itemId`. `Command` is the single
canonical union in
[application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs).
A definition may have one trigger; multiple conditions combine with `all`.

## 5. Effect and EffectApplier

```ts
// src/core/effects/Effect.ts
export type Effect =
  | {
      readonly kind: 'set-flag';
      readonly flag: string;
      readonly value: boolean;
    }
  | { readonly kind: 'message'; readonly text: string }
  | {
      readonly kind: 'change-lives';
      readonly delta: number;
      readonly reason: string;
    }
  | { readonly kind: 'complete-topic'; readonly topicId: string }
  | { readonly kind: 'grant-item' | 'remove-item'; readonly itemId: string }
  | {
      readonly kind: 'transfer-item';
      readonly itemId: string;
      readonly fromOwnerId: string;
      readonly toOwnerId: string;
    }
  | {
      readonly kind: 'move-player';
      readonly roomId: string;
      readonly reason: string;
    }
  | {
      readonly kind: 'set-actor-state';
      readonly actorId: string;
      readonly stateId: string;
    }
  | {
      readonly kind: 'learn-topic';
      readonly actorId: string;
      readonly topicId: string;
    }
  | {
      readonly kind: 'enter-node';
      readonly actorId: string;
      readonly nodeId: string;
    }
  | { readonly kind: 'exit-node'; readonly actorId: string }
  | { readonly kind: 'set-puzzle-active'; readonly puzzleId: string }
  | { readonly kind: 'set-puzzle-solved'; readonly puzzleId: string }
  | { readonly kind: 'schedule'; readonly event: ScheduledEvent }
  | {
      readonly kind: 'start-quiz';
      readonly quizId: string;
      readonly actorId: string;
    }
  | {
      readonly kind: 'show-hint';
      readonly hintId: string;
      readonly level: number;
      readonly text: string;
    }
  | {
      readonly kind: 'ask-question';
      readonly quizId: string;
      readonly questionId: string;
      readonly prompt: string;
      readonly options: readonly string[];
    }
  | {
      readonly kind: 'evaluate-answer';
      readonly quizId: string;
      readonly questionId: string;
      readonly option: number; // 0-based index into the question's options
      readonly correct: boolean;
      readonly explanation: string;
    }
  | {
      readonly kind: 'end-quiz';
      readonly quizId: string;
      readonly passed: boolean;
      readonly reason: string;
    }
  | {
      readonly kind: 'announce-hazard';
      readonly hazardId: string;
      readonly reason: string;
    };
```

This is the complete pinned `Effect` union. Quiz progress is carried by effects so
phase 3 stays effects-only.

Conventions:

- `EffectApplier.apply(effect): GameEvent[]` is the only mutator of these fields.
  Handlers and domain systems **return** effects; they do not write state directly.
- `transfer-item` uses the reserved owner ID `'player'`; other owners are actor
  IDs or room IDs. It updates both inventories atomically — no separate
  remove/grant pair is needed for `give`/`show`. Every item has exactly one owner
  ([storage-schema.md §3.3](storage-schema.md#33-invariants)).
- `enter-node` requires a `nodeId`; `exit-node` has none. Optional properties are
  omitted, never assigned `undefined` (`exactOptionalPropertyTypes`).
- Every effect produces at least one buffered event; the complete effect →
  event mapping is canonical in [application-and-ui.md §9](application-and-ui.md#9-effect-to-event-mapping).
  `formatEvent` suppresses internal-state events from the player-facing
  transcript, with a real score gain as the sole exception; panels carry
  current state via view data ([application-and-ui.md §6.1](application-and-ui.md#61-event-to-view-mapping)).
- `set-flag` emits exactly one `flag-changed` on every application, including a
  re-set to the value already held. Quiz retry scoring compares the flag with
  the value observed before the batch rather than treating the event as a score
  trigger
  ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)).
- `Session` owns game-over. There is no score-carrying effect variant.
- `change-lives` also drives the gated area-entry reset; its gate and content
  mapping are owned by
  [application-and-ui.md §3.2](application-and-ui.md#32-world-area-room-and-item-definitions).

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
- Authoring rejects `remainingTurns: 0`; `1` fires on the next turn's phase 4.
- `Scheduler.tick(context: TurnContext)` runs first in phase 4 (signature pinned
  in [application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures)).
  All scheduled state is serialised in `GameStateDto.schedule`, so a reload
  resumes timers accurately.
- Fire order is array order in the save.

## 7. Random port

Quiz question order and varied NPC replies need randomness, but the core must
stay deterministic for saves and tests.

- Define a `Random` port: `nextInt(maxExclusive: number): number`.
- The static site supplies a small seeded LCG from `src/main.ts`; `src/core` sees
  only the `Random` port. The seed lives in `GameStateDto.rngSeed` as an unsigned
  32-bit integer and **advances on each draw and is saved**
  ([storage-schema.md §3.3](storage-schema.md#33-invariants)).
- A seeded implementation exposes its current state as `seed` and accepts
  `setSeed(seed)`. The game writes that value into the live state after each
  turn and before a save or download, and calls `setSeed` with the restored
  `GameStateDto.rngSeed` whenever a state is created, loaded or imported, so a
  reload resumes the sequence instead of restarting it. Test fakes may omit
  both members; they are deterministic by construction.
- No `Math.random()` anywhere in `src/core`.

## 8. Persisted-shape constraints for rule-spine state

Rule-spine state is part of `GameStateDto`;
[storage-schema.md §3](storage-schema.md#3-persisted-shape-canonical) owns the
shapes. What is specific to this rule spine:

- Only plain arrays, records, strings, numbers and booleans go into DTOs — no
  `Set`, `Map`, functions or class instances. Optional properties are omitted,
  never `undefined`.
- `counters` uses free-form string keys (no prefix restriction at load); the
  three prefixes and the `turns-since` rule are in
  [storage-schema.md §4](storage-schema.md#4-counters-and-stuckness).
- Item ownership and the kebab-case `flags` convention are owned by
  [storage-schema.md §3.3](storage-schema.md#33-invariants).
- `score` is not stored: `ScoreTracker` writes `AreaProgress.earnedScore` and the
  total is derived at restore ([storage-schema.md §7](storage-schema.md#7-restore-time-derivation)).

## 9. Content registration

All definitions are declarative data under `src/content/`, never hard-coded in
engine classes. Each system has a catalogue exposing `getById(id)`, `all` and any
targeted lookups, bundled into one injected `ContentBundle`; the concrete
interfaces and the boot-time `validateContent` gate are canonical in
[application-and-ui.md §3](application-and-ui.md#3-content-bundle-and-registration).
The engine consumes catalogues through interfaces, so tests can inject small
fixtures. Content validation enforces global uniqueness of object and NPC aliases
so `NameResolver` never has to guess.

## 10. Determinism and ordering rules

1. Definitions are evaluated in declaration order (arrays), never by object-key
   iteration.
2. No wall-clock reads in core; `Clock` is for `savedAt` only.
3. No `Math.random()` in core; use the injected `Random` port.
4. Rules that fire more than once in a turn are skipped after their first fire.
   The skip is silent to the player.
5. All UI text comes from events or the read-only `GameViewData` and is rendered
   with `textContent` ([application-and-ui.md §7](application-and-ui.md#7-ui-structure-and-view-model)).

## 11. Invariants the implementation must keep

- Condition evaluation is pure and total: every kind and nested combinator
  evaluates without throwing, and missing IDs are `false`. `in-room` and
  `in-area` match only the current `Position`; `visited-room` and
  `topic-complete` find their ID in **every** `AreaProgress` row.
- Each effect mutates only its declared field and emits its mapped event;
  `ScoreTracker` remains the sole score writer.
- A fuse counts down and a daemon repeats with its declared interval, both
  surviving save and restore mid-countdown.
- A fixed seed reproduces the same sequence across save and restore.
- The pipeline publishes once per turn; a hazard firing in phase 4 is visible to
  `ScoreTracker` before UI publication; cascades stop after the second reaction
  pass; `game-over` carries the post-score total.
