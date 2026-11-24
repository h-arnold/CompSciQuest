# Puzzles (design)

Status: planned · Last updated: 2026-11-24

Part of the CompSciQuest design set: [architecture](architecture.md) ·
[shared rule spine](shared-rules.md) · [storage schema](storage-schema.md) ·
[NPCs](npcs.md) · [hazards](hazards.md) ·
[quiz combat](combat.md) · [hints](hints.md).

## 1. Scope

Puzzles are revision tasks: using an item at the right place, combining clues,
or answering an NPC correctly. They are planned for v1 with designs in this
document. Completion reporting already has a seam in `architecture.md` §6.3
(`topic-completed` → `ScoreTracker`), so the score panel needs no redesign.

## 2. Model

```ts
// src/core/puzzles/Puzzle.ts — declarative definition
export interface Puzzle {
  readonly id: string;
  readonly requirements: readonly Condition[]; // all must hold (shared spine §3)
  readonly onSolve: readonly Effect[];         // shared spine §5
  readonly topicId?: string;                   // omitted if not a spec topic
  readonly hintSequenceId?: string;            // omitted when no hints
  readonly dependsOn: readonly string[];       // ids, for the dependency graph
}
```

State uses three phases (multi-step tasks are represented by one puzzle per step
in the dependency graph, but a puzzle may be activated before it is solved).
`PuzzlePhase` and `PuzzleStateDto` are defined canonically in
[storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).

## 3. Completion detection

`PuzzleSystem` runs in phase 4 of the [turn pipeline](shared-rules.md#2-turn-pipeline-amends-architecturemd-62),
after hazards and NPC reactions, before auto-hints:

1. For each puzzle in declaration order, if it is `unsolved` and at least one
   requirement is true, return a `set-puzzle-active` effect. `EffectApplier` sets
   the phase and emits `puzzle-activated`; the `turns-since:<puzzleId>` counter
   starts on the next turn.
2. If all `requirements` hold, return a `set-puzzle-solved` effect. `EffectApplier`
   sets the phase to `solved` **before** emitting `puzzle-solved`, which prevents
   double-firing.
3. Apply `onSolve` effects through `EffectApplier`. If `topicId` is set, include a
   `complete-topic` effect; that emits `topic-completed` and `ScoreTracker`
   awards points under the existing covered+evidence rule. Several puzzles may
   map to the same topic; `ScoreTracker` decides whether to award once or per
   puzzle.
4. A solved puzzle stays solved. A hazard teleport or flag reset does **not**
   revert it — puzzle progress is owned solely by `PuzzleSystem`.

**Critical authoring rule:** requirements must be *action-set flags*, not mere
possession. "Has the brass key" must not auto-solve "unlock the door"; the
`use key on door` handler sets `door-unlocked`, and *that flag* is a requirement.
A possession check is only valid for puzzles whose solution genuinely is
carrying something to a place.

## 4. Puzzle Dependency Graph

Use Ron Gilbert / Noah Falstein's Puzzle Dependency Graph as an **authoring and
testing tool**, not runtime machinery:

- Nodes are puzzles; edges are labelled with what one puzzle produces for
  another (an item, access to a room, an NPC's cooperation, a completed topic).
- It is a **DAG**. A cycle means a softlock ("the key is inside the box it
  opens").
- `dependsOn` in each definition is the graph's edge list.
- A **Vitest** suite validates: acyclic, every puzzle reachable from the start,
  no duplicate IDs, and every referenced `topicId` exists in the spec catalogue.
  It runs with `npm test`; no extra build step.
- Topological order gives a valid solve order; layer width shows how much
  non-linear branching exists.
- For narrative text, only reference plot points in a puzzle's **ancestor
  graph** — those are guaranteed to have happened. This prevents text that
  assumes the player solved things in a fixed order.

## 5. Hints

Set `hintSequenceId` to link a hint ladder ([hints](hints.md)); `hintSequence.targets`
may reference the puzzle directly or its spec topic, so the `ScorePanel` can
label the revision area. Hint availability can be gated by `counter-at-least`
conditions such as `turns-since:<puzzleId>` or `hints-shown:<hintId>`. Hints never
solve a puzzle; they only emit `hint-shown` events and may adjust counters.

## 6. Integration points

- **Items:** `use` handler with optional `targetId` (already in `Command`).
- **Doors/exits:** `Precondition` on `Exit` (already in `architecture.md`).
- **NPCs:** a conversation topic can set a puzzle flag, or a quiz pass can emit
  `complete-topic` for the same spec topic.
- **Hazards:** a failure can reset level-local flags, but never puzzle phase.

## 7. Tests

- A puzzle transitions `unsolved → active → solved` once across many turns.
- Possession alone does not solve an action-flag puzzle.
- `onSolve` effects are applied in order and produce `puzzle-solved` +
  `topic-completed`.
- Score is written by `ScoreTracker`, not by `PuzzleSystem`.
- Dependency graph validation: cycle rejected, unreachable puzzle rejected,
  unknown topic ID rejected.
- Save/load of a solved puzzle does not re-emit completion.
- Hint linkage: hint condition gating does not change puzzle phase.

## 8. Decisions resolved

- Puzzles have an `active` phase; multi-step tasks are separate puzzle nodes.
- Several puzzles may map to one topic (many-to-one).
- Dependency graph validation runs as a Vitest test.
- Puzzle phase is never reset by hazards or quiz failures.
