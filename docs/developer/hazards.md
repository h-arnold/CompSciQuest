# Hazards

Hazards are traps and penalties: declarative rules that cost lives when a
trigger matches. They are separate from [quiz combat](combat.md), the
adversarial question mechanic. The
[developer documentation index](README.md) lists the other subsystem docs.

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
5. Return the resulting `GameEvent[]` for the turn buffer. `HazardSystem` never
   emits to the `EventBus`.

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
The `message` event carries the player-facing text. `OutputLog` renders both as
text with `textContent`; there is no hazard-specific panel.
