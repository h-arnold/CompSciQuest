# Puzzles

Puzzles are revision tasks: using an item at the right place, combining clues,
or answering an NPC correctly. A puzzle is solved when all its requirement
conditions hold, and completion records its mapped spec topic. This document
owns every puzzle authoring and runtime rule; the `puzzle-writer` must read it in
full before beginning work and its agent brief is only a workflow checklist.
Rules are cited by ID from their owning documents; the W1–W7 workflow lives in
[content-editor.md](../../.opencode/agents/content-editor.md).

Rule map: [write the puzzle first](#write-the-puzzle-first),
[card format](#7-card-format), [review checks](#8-reviewer-and-playtest-checks)
and [acceptance](#9-agent-acceptance).

## Write the puzzle first

A puzzle is a task the player can work out, not a secret to guess. Draft the
goal, blocker, tools and clue route before writing `requirements`, `dependsOn`
or `onSolve`. The MUST/SHOULD/MUST NOT labels and finding severity are defined
under [review labels](content-toolchain.md#review-labels).

The puzzle goals are settled and pinned before the cast and the key items are
designed, so the card's requirements name an action that exists by the time it
is written. See the
[design stages](../../.opencode/agents/content-editor.md#design-stages-w1w2).

Apply the rules in this reading order: N7; N6 and
[P1/P2](../content/content-bible.md#7-topic-index); action flags; D1–D4.

| ID  | Test                | MUST                                                                                                                            | SHOULD                                                                                                             | MUST NOT                                                                                                             | Related                                              |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| N7  | Ancestor-only prose | Reference only plot points in the puzzle's ancestor set in the PDG.                                                             | Name the shared ancestor when branches reconverge.                                                                 | Assume a fixed solve order or say "after you solved the other branch".                                               | §4                                                   |
| N6  | Fair gate           | Place at least two discoverable clues in room or NPC text before the gate is needed, and give the blocker an in-fiction reason. | Put a clue beside the thing it explains. Aim for an "of course" insight; avoid false puzzles and misleading props. | Hide a single word in a room the player has no reason to visit.                                                      | [bible §3](../content/content-bible.md#3-pillars-n1) |
| P1  | Topic contract      | Declare a `topicId` that resolves in `COVERAGE.md`, or mark the puzzle `navigationOnly`.                                        | State the teaching purpose in the brief.                                                                           | Invent a topic ID.                                                                                                   | P2                                                   |
| P2  | Three beats         | Pair the puzzle with a teaching beat and a retrieval beat for its topic.                                                        | Let the puzzle apply the concept the NPC taught.                                                                   | Rely on a quiz alone to cover a topic.                                                                               | P1                                                   |
| D3  | Action flags        | Make every `requirements` entry an action-set flag and record the named producing action in the card.                           | Give each intermediate step useful feedback or a reward.                                                           | Use bare `has-item` for an action puzzle, or make possession the only requirement when carrying is not the solution. | §3                                                   |
| D4  | Authoring metadata  | List at least two `authoring.clues` with the room or NPC text where each appears.                                               | State goal, blocker, tools and clue-discovery route in the report.                                                 | Put clues in a runtime field or write score.                                                                         | N6                                                   |

**Example — an overflow register.** Two clues: the tray under the register and
the foreman's line about checking for a carry. `USE register` sets
`overflow-checked`, which the puzzle requires; the flags, not carrying the
register, solve it.

**Non-example — a possession check.** `requirements: [{ kind: has-item, ... }]`
auto-solves on pickup and tests no knowledge.

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
3. It applies `onSolve` effects in order. A derived `complete-topic` for
   `topicId` is added only when `onSolve` did not already complete that same
   topic, so one solve emits exactly one `topic-completed` event for its topic.
   Distinct topics in `onSolve` are still completed as authored.
   `topic-completed` records completion for the win check.
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

## 7. Card format

`puzzles.yaml` holds one `puzzles` collection per area. This is a partial
excerpt; generation is owned by [content-toolchain.md](content-toolchain.md).

```yaml
kind: puzzle
areaId: 1-1-computer-architecture
status: draft
topicIds: [data-representation]

puzzles:
  - id: puzzle-unlock-cache
    requirements:
      - { kind: flag-set, flag: cache-decoded } # action flags, not possession
    onSolve:
      - { kind: complete-topic, topicId: data-representation }
    topicId: data-representation
    score: 1 # awarded once on solve; topics may be scored per puzzle
    hintSequenceId: hint-cache
    dependsOn: [puzzle-find-key]
    authoring:
      clues:
        - ... # ≥2 discoverable clues, N6
        - ...
```

## 8. Reviewer and playtest checks

`content-critic` applies the table above, checks that each clue is placed before
it is needed, and verifies the V4 trace names every puzzle and dependency edge.
`pck-reviewer` checks course facts, topic mapping and GCSE reading load only.
`play-tester` confirms in W7 that the challenge comes from applying the taught
concept and that reasonable wrong actions produce useful feedback.

## 9. Agent acceptance

### 9.1 Definition of done

- Only `puzzles.yaml` changed; document metadata is valid and every puzzle is an
  entry in `puzzles`, with prose in block scalars.
- Every requirement is a flag set by a named action, never bare `has-item`, and
  the producing action is recorded in the card.
- All `dependsOn` ids exist; the graph is acyclic, every puzzle is reachable from
  a root, and a topological solve order is in the report.
- Every puzzle has at least two clues with placement; `onSolve` uses only shared
  effects and emits `complete-topic` when a `topicId` is set.
- The report names the goal, blocker, tools, clue route, useful failure feedback
  and fairness rationale; multi-step nodes give intermediate feedback.
- Prose references only ancestor plot points.
- The final report names the file path, puzzle and topic IDs, dependency edges,
  the fairness check for each puzzle and flagged assumptions.

### 9.2 Hard constraints and escalation

Return `BLOCKED: <reason> — needs <owner>` rather than guessing when an edge
would create a cycle, a required flag is produced by no other card, or
multi-step work needs a new puzzle ID. After a review round, revise only your
own card for at most two rounds; then return
`BLOCKED: <finding> requires <owner>` and let the editor resolve it.

## 10. Gates

The `puzzle-graph` authoring gate checks resolving `dependsOn` ids, acyclicity,
action-set requirements, at least two `authoring.clues` and a declared `topicId`
([content-toolchain.md §4](content-toolchain.md#4-validation)).
