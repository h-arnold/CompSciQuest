# Hazards (design)

Status: planned · Last updated: 2026-11-24

Part of the CompSciQuest design set: [architecture](architecture.md) ·
[shared rule spine](shared-rules.md) · [storage schema](storage-schema.md) ·
[NPCs](npcs.md) · [quiz combat](combat.md) ·
[puzzles](puzzles.md) · [hints](hints.md).

## 1. Scope

Hazards are simple sources of life loss: traps and penalties. They are separate
from [quiz combat](combat.md), which is the adversarial question mechanic. Both
emit `lives-changed` and go through the same `Session` game-over handling — the
seam already documented in `architecture.md` §6.5.

Hazards are planned for v1 with designs in this document.

## 2. Model

```ts
// src/core/hazards/Hazard.ts — declarative definition
export interface Hazard {
  readonly id: string;
  readonly trigger: Trigger;              // shared spine §4
  readonly when: Condition;               // shared spine §3
  readonly effects: readonly Effect[];    // shared spine §5
  readonly once?: boolean;                // omit for repeatable hazards
  readonly cooldownTurns?: number;        // omit when no cooldown
  readonly schedule?: ScheduledEvent;     // fuse/daemon, shared spine §6
}
```

Typical definitions:

- **Entry trap** — `on-room-enter` with a negated flag condition → `change-lives(-1)`
  and a message.
- **Timed hazard** — a fuse registered on room entry that fires after N turns →
  `change-lives(-1)` and `move-player` back to the start of the level.
- **Action trap** — `on-item-used` with a "not disarmed" condition → damage once.

A definition's `schedule` is not active until an effect registers it: room entry
applies a `schedule` effect that adds the `ScheduledEvent` to
`GameStateDto.schedule`. After that, `Scheduler` owns its countdown.

`HazardStateDto` is defined in
[storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).

## 3. Execution

`HazardSystem` runs in phase 4 of the [turn pipeline](shared-rules.md#2-turn-pipeline-amends-architecturemd-62),
after the scheduler and before NPC reactions:

1. Iterate hazard definitions in declaration order.
2. Skip if `once` and `timesFired > 0`.
3. Skip if `cooldownTurns` is set and `lastFiredTurn !== undefined` and
   `turn - lastFiredTurn < cooldownTurns`.
4. Evaluate `trigger` against the turn's context and buffered events, then
   evaluate `when` against final state.
5. Apply `effects` through `EffectApplier`; emit `hazard-triggered`; increment
   `timesFired` and set `lastFiredTurn` in the same pass.
6. A rule ID can fire at most once per turn (shared spine rule 4).

Damage always goes through `change-lives`, which emits `lives-changed`.
`Session` (phase 5) detects `lives == 0` and emits `game-over` with the final
score. Hazards never write score or call `Session` directly.

If a hazard moves the player, it uses `move-player`, which emits `room-entered`;
room scoring then works exactly as in `architecture.md` §6.3.

## 4. Failure consequences

Per the agreed design, a hazard's failure effects may include:

- lose one life (`change-lives` with `delta: -1`);
- return to the start of the current level (`move-player`);
- reset level-local flags via `set-flag` effects.

A failed hazard does **not** reset puzzle state: puzzles remain in whatever phase
they reached. Hints are not offered for hazards — they are brief penalties, not
puzzles. Puzzle progress is only changed by the puzzle system itself.

## 5. Content

Hazard definitions live in `src/content/hazards/`. A `HazardCatalogue` exposes
`getById(id)` and `getForRoom(roomId)` so `HazardSystem` does not scan the whole
content set every turn. The level-start room is **declared explicitly per
world/area in content**, not derived from the world graph.

## 6. Events and UI

- New event: `hazard-triggered { hazardId, reason }`, defined in
  [shared-rules.md §9](shared-rules.md#9-event-additions). The `message` event
  carries the player-facing text.
- `OutputLog` renders both as text via `textContent`. No hazard-specific UI panel.

## 7. Tests

- Each trigger kind fires at the right time and not otherwise.
- `once` fires exactly once across multiple turns; cooldown blocks early refires
  and handles an absent `lastFiredTurn`.
- Damage emits `lives-changed`; zero lives emits `game-over` with final score.
- `move-player` on failure emits `room-entered` and re-scores the entry correctly.
- A registered schedule survives JSON save/load mid-countdown.
- Two hazards firing in the same turn are applied in declaration order.
- A hazard failure does not change puzzle phase.

## 8. Decisions resolved

- Room-entry hazards fire **after** the initial room description.
- Hazards have their own `hazard-triggered` event (in addition to `message`).
- Level-start rooms are declared in content per world/area.
- Hints are never offered during a hazard penalty.
- Failed hazards do not reset puzzle progress.
