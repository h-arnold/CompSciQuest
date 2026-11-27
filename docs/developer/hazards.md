# Hazards

Hazards are traps and penalties: declarative rules that cost lives when a
trigger matches. They are separate from [quiz combat](combat.md), the
adversarial question mechanic. This document owns every hazard authoring and
runtime rule; the `hazard-writer` must read it in full before beginning work and
its agent brief is only a workflow checklist.
Rules are cited by ID from their owning documents; the W1–W7 workflow lives in
[content-editor.md](../../.opencode/agents/content-editor.md).

Rule map: [write the hazard first](#write-the-hazard-first),
[card format](#7-card-format), [review checks](#8-reviewer-and-playtest-checks)
and [acceptance](#9-agent-acceptance).

## Write the hazard first

A hazard is a fair warning followed by a brief, comic penalty. Draft the clue
and the failure text before choosing the trigger, `when` and effects; the
mechanics must deliver that warning, not replace it. The MUST/SHOULD/MUST NOT
labels and finding severity are defined under
[review labels](content-toolchain.md#review-labels).

Apply the rules in this reading order: H1; counterplay; bounded harm; N4/N5;
D1–D4.

| ID  | Test            | MUST                                                                                                                                                 | SHOULD                                                           | MUST NOT                                                           | Related |
| --- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ | ------- |
| H1  | Telegraph       | Place at least one clue in room or NPC text where the player reads it before the trigger can fire, and record its location in `authoring.telegraph`. | Say what is wrong, not what to do; a warning creates a decision. | Reveal the solution or leave the only warning in the failure text. | N5, N6  |
| H1a | Counterplay     | Give every hazard a disarm flag or an avoidable action.                                                                                              | Make the counterplay inferable from the telegraph.               | Create unavoidable repeat damage or a sham choice.                 | N6      |
| H1b | Bounded harm    | Limit failure to `message`, `change-lives` with `delta: -1`, `move-player` to `definition.startRoomId` and level-local `set-flag` resets.            | Bound a repeatable hazard with `once` or `cooldownTurns`.        | Use a `set-puzzle-*` effect, attach a hint, or reset puzzle phase. | §4      |
| N4  | Voice           | Write the failure text in second person, present tense, naming the cause.                                                                            | Let the clue echo in the failure text.                           | Address the reader as a failure or mention the engine.             | N5      |
| N5  | Failure teaches | Make failure a brief comic indignity that points back to the clue; never lose topic or puzzle progress.                                              | Keep the joke in world and reversible.                           | Shame the learner or present realistic injury.                     | §4      |

**Example — an entry trap.** A cracked heatsink whines beside a scorched socket;
entry costs one life and returns the player to the start room. The clue is in the
room before entry, and a cooling flag disarms it.

**Non-example — a gotcha.** The only warning is the failure text ("The floor was
electrified"). The player had no chance to act, so the loss teaches nothing.

## 1. Scope

A hazard combines a `Trigger`, a `Condition` and an ordered list of `Effect`s.
Damage goes through `change-lives`, which emits `lives-changed`; `Session` owns
the game-over check
([application-and-ui.md §11](application-and-ui.md#11-win-check-owner)).
`HazardSystem` never writes score or calls `Session` directly.

## 2. Model

```ts
// src/core/hazards/Hazard.ts — declarative definition
export interface Hazard {
  readonly id: string;
  readonly trigger: Trigger; // shared spine §4
  readonly when: Condition; // shared spine §3
  readonly effects: readonly Effect[]; // shared spine §5
  readonly once?: boolean; // omit for repeatable hazards
  readonly cooldownTurns?: number; // omit when no cooldown
  readonly schedule?: ScheduledEvent; // fuse/daemon, shared spine §6
}
```

Typical shapes are an entry trap (`on-room-enter` with a negated flag
condition), a timed hazard (a fuse registered on room entry that fires after a
set number of turns), and an action trap (`on-item-used` with a not-disarmed
condition).

`schedule` is validation metadata. A scheduled hazard registers its event by
including a `schedule` effect in `effects`; the `Scheduler` then owns the
countdown
([shared-rules.md §6](shared-rules.md#6-scheduler-tads-fuse--daemon)).

`HazardStateDto` is defined in
[storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).

## 3. Execution

`HazardSystem` runs in phase 4 of the
[turn pipeline](shared-rules.md#2-turn-pipeline), after the scheduler and
before NPC reactions
([application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures)). It
iterates `bundle.hazards.all` in declaration order:

1. Skip a hazard whose `once` is set and whose `timesFired` is above zero.
2. Skip a hazard whose `cooldownTurns` has not elapsed since `lastFiredTurn`.
3. Match the `trigger` against the turn's command and buffered events, then
   evaluate `when` against the state as earlier hazards left it. Effects are
   applied before the next hazard's `when` is evaluated, so hazards in one turn
   see each other's changes. A hazard ID fires at most once per turn.
4. Record `timesFired` and `lastFiredTurn`, then apply an `announce-hazard`
   effect and the definition's `effects` in order through the injected
   `EffectApplier`
   ([shared-rules.md §5](shared-rules.md#5-effect-and-effectapplier)).
   `HazardSystem` never applies `set-puzzle-*` effects; puzzle phase belongs to
   `PuzzleSystem`.

`on-room-enter` matches a buffered `room-entered` event. The first turn buffers
none, so the area's start room counts as entered: entry hazards there fire after
the initial room description.

A `move-player` effect emits `room-entered`, so room scoring follows the normal
first-visit rule
([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)).

## 4. Failure consequences

A hazard's failure effects may include `change-lives` with `delta: -1`,
`move-player` back to the level start, and `set-flag` resets for level-local
flags. A hazard never changes puzzle phase.

The level-start room is the runtime `startRoomId` on `AreaDefinition`
([application-and-ui.md §3.2](application-and-ui.md#32-world-area-room-and-item-definitions)).

## 5. Content

Hazards are authored in `docs/content/<area>/hazards.yaml` and generated into
`src/content/authored/hazards.ts` as `ContentBundle.hazards`
([content-toolchain.md](content-toolchain.md)).

## 6. Events and UI

`hazard-triggered { hazardId, reason }` is emitted by the `announce-hazard`
effect
([application-and-ui.md §9](application-and-ui.md#9-effect-to-event-mapping))
and belongs to the canonical union in
[application-and-ui.md §6](application-and-ui.md#6-canonical-event-union-and-rendering).
`formatEvent` suppresses it from the transcript because it carries an internal
hazard ID ([application-and-ui.md §6.1](application-and-ui.md#61-event-to-view-mapping));
the accompanying `message` event carries the player-facing text that `OutputLog`
renders with `textContent`. Life loss reaches `ScorePanel` through
`lives-changed` and `GameViewData`. There is no hazard-specific panel.

## 7. Card format

`hazards.yaml` holds one `hazards` collection per area. This is a partial
excerpt; generation is owned by [content-toolchain.md](content-toolchain.md).

```yaml
kind: hazard
areaId: 1-1-computer-architecture
status: draft
topicIds: [cpu-components]

hazards:
  - id: hazard-overheat
    trigger: { kind: on-room-enter, roomId: room-cpu-lab }
    when: { kind: not, of: { kind: flag-set, flag: cooling-fitted } }
    effects:
      - { kind: message, text: ... }
      - { kind: change-lives, delta: -1, reason: ... }
      - { kind: move-player, roomId: room-cpu-lab, reason: ... }
    once: true
    authoring:
      telegraph: The clue before harm. # H1
```

## 8. Reviewer and playtest checks

`content-critic` applies the table above, checks that each telegraph is placed
before the trigger and that every hazard has counterplay, and verifies the V4
trace names the trigger and its clue. `pck-reviewer` checks course facts and GCSE
reading load only. `play-tester` confirms in W7 that the warning is discoverable
in ordinary play and that the penalty and retry are proportionate.

## 9. Agent acceptance

### 9.1 Definition of done

- Only `hazards.yaml` changed; document metadata is valid and every hazard is an
  entry in `hazards`, with prose in block scalars.
- Each hazard has an `authoring.telegraph` clue placed where the player sees it
  before the trigger can fire.
- Effects are limited to `message`, `change-lives` with `delta: -1`,
  `move-player` to `definition.startRoomId`, and level-local `set-flag` resets;
  no `set-puzzle-*` effect and no hint reference.
- `trigger`, `when`, `once`, `cooldownTurns` and `schedule` use only the shared
  types; every hazard has counterplay and a bounded repeat penalty.
- The final report names the file path, hazard IDs, triggers and flagged
  assumptions.

### 9.2 Hard constraints and escalation

Return `BLOCKED: <reason> — needs <owner>` rather than guessing when no
counterplay can be designed, `startRoomId` is missing, or repeatable damage
cannot be bounded by a cooldown. After a review round, revise only your own card
for at most two rounds; then return `BLOCKED: <finding> requires <owner>` and
let the editor resolve it.

## 10. Gates

The `hazard-content` authoring gate checks a telegraph, effects from the shared
union, no `set-puzzle-*`, positive `schedule.remainingTurns` and a resolving
`startRoomId` ([content-toolchain.md §4](content-toolchain.md#4-validation)).
