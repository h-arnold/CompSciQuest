# Puzzles

Puzzles are revision tasks: using an item at the right place, combining clues,
or answering an NPC correctly. A puzzle is solved when all its requirement
conditions hold, and completion records its mapped spec topic. The
[developer documentation index](README.md) lists the other subsystem docs.

## 1. Scope

Multi-step tasks are modelled as one puzzle per step, linked by `dependsOn`
([§4](#4-puzzle-dependency-graph)). Completion applies `complete-topic` for the
mapped spec topic; `PuzzleSystem` never writes score, and `ScoreTracker` awards
it from the `puzzle-solved` event
([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)).

## 2. Model

```ts
// src/core/puzzles/Puzzle.ts — declarative definition
export interface Puzzle {
  readonly id: string;
  readonly requirements: readonly Condition[]; // all must hold (shared spine §3)
  readonly onSolve: readonly Effect[]; // shared spine §5
  readonly topicId?: string; // omitted if not a spec topic
  readonly score: number; // first-solve award, 0 if not scoreable
  readonly hintSequenceId?: string; // omitted when no hints
  readonly dependsOn: readonly string[]; // ids, for the dependency graph
}
```

State uses three phases (multi-step tasks are represented by one puzzle per step
in the dependency graph, but a puzzle may be activated before it is solved).
`PuzzlePhase` and `PuzzleStateDto` are defined canonically in
[storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).

## 3. Completion detection

`PuzzleSystem` runs in phase 4 of the
[turn pipeline](shared-rules.md#2-turn-pipeline), after hazards and NPC
reactions, before auto-hints
([application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures)).

For each puzzle in declaration order:

1. A solved puzzle is skipped. When at least one requirement is true but not all
   of them are, `PuzzleSystem` applies a `set-puzzle-active` effect through the
   injected `EffectApplier`, which sets the phase and emits `puzzle-activated`.
   The `turns-since:<puzzleId>` counter is created at 0 and advances from the
   next turn
   ([storage-schema.md §4](storage-schema.md#4-counters-and-stuckness)).
2. When all `requirements` hold, it applies `set-puzzle-solved` through the same
   applier. A puzzle that first becomes active on a solving turn is set `active`
   before it is set `solved`. The phase is set to `solved` **before**
   `puzzle-solved` is emitted, which prevents double-firing.
3. It applies `onSolve` effects in order, then `complete-topic` for `topicId`
   when one is set. `topic-completed` records completion for the win check.
   Points come from the puzzle's own `score` on the `puzzle-solved` event under
   the per-puzzle rule in
   [application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic):
   several puzzles may map to one topic and each awards its own points, within
   the topic's `maxScore` budget.

A solved puzzle stays solved. `PuzzleSystem` owns puzzle phase, so no hazard
teleport or flag reset can revert it.

**Critical authoring rule:** requirements must be _action-set flags_, not mere
possession. "Has the brass key" must not auto-solve "unlock the door"; the
`use key on door` handler sets `door-unlocked`, and _that flag_ is a
requirement. A possession check is only valid for puzzles whose solution
genuinely is carrying something to a place.

## 4. Puzzle Dependency Graph

Use Ron Gilbert / Noah Falstein's Puzzle Dependency Graph as an **authoring and
testing tool**, not runtime machinery:

- Nodes are puzzles; edges are labelled with what one puzzle produces for
  another (an item, access to a room, an NPC's cooperation, a completed topic).
- It is a **DAG**. A cycle means a softlock ("the key is inside the box it
  opens").
- `dependsOn` in each definition is the graph's edge list.
- The graph must be acyclic, every puzzle reachable from a root, and IDs
  unique; every referenced `topicId` must exist in the spec catalogue.
  `puzzleGraphFindings` checks these at boot and mirrors the authoring
  `puzzle-graph` gate ([content-toolchain.md](content-toolchain.md)).
- The graph's roots are the puzzles with no `dependsOn` entries; reachability
  means every puzzle is reachable from at least one root.
- Topological order gives a valid solve order; layer width shows how much
  non-linear branching exists.
- For narrative text, only reference plot points in a puzzle's **ancestor
  graph** — those are guaranteed to have happened. This prevents text that
  assumes the player solved things in a fixed order.

## 5. Hints

Set `hintSequenceId` to link a hint ladder ([hints](hints.md)). `HintSystem`
uses the ladder's `targets` for context resolution
([hints.md §3](hints.md#3-commands-and-delivery)). Hint availability can be
gated by `counter-at-least` conditions such as `turns-since:<puzzleId>` or
`hints-shown:<hintId>`. Hints never solve a puzzle; they only show hint levels.

## 6. Integration points

- **Items:** the `use` verb carries an optional `targetId` in the canonical
  `Command` union
  ([application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs)).
- **Doors and exits:** movement is gated by `Exit.preconditions`
  ([application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures)).
- **NPCs:** a conversation topic can set a puzzle flag, or a quiz pass can emit
  `complete-topic` for the same spec topic
  ([npcs.md §4](npcs.md#4-conversation-flow)).
- **Hazards:** a failure can reset level-local flags, but never puzzle phase
  ([hazards.md §4](hazards.md#4-failure-consequences)).
