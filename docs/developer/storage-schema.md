# Storage schema (design)

Status: planned · Last updated: 2026-11-25

Part of the CompSciQuest design set: [architecture](architecture.md) · [application and UI](application-and-ui.md) ·
[shared rule spine](shared-rules.md) · [content rules](content-rules.md) ·
[NPCs](npcs.md) · [hazards](hazards.md) · [quiz combat](combat.md) ·
[puzzles](puzzles.md) · [hints](hints.md).

## 1. Scope and authority

This document is the **single canonical definition of the persisted shape**: what
is written to `localStorage`, what is exported as JSON, and how it is validated
and restored. The subsystem documents own the meaning of individual fields; this
document owns their serialised names and types.

Constraints carried over from [architecture.md](architecture.md) §1–2:

- Fully static site: `localStorage` is the live store, a JSON file is the portable
  store, and there is no backend or server-side state.
- `SCHEMA_VERSION` is `1`. **No migration** is implemented while the game is
  unreleased; new fields are added directly to v1 and old saves are allowed to
  fail strict validation. Migration is revisited before public release.
- Only plain strings, numbers, booleans, arrays and records enter a DTO — no
  `Set`, `Map`, functions, class instances or `undefined` values. Optional fields
  are **omitted**, never assigned `undefined` (`exactOptionalPropertyTypes`).
- The core engine stays DOM-free and content-free; derivation from content
  happens in the application layer at restore time.

## 2. Envelope, keys and file format

```ts
// src/application/SaveDto.ts
export interface SaveDto {
  readonly version: 1; // literal; see schema.ts
  readonly savedAt: string; // ISO 8601, supplied by the injected Clock
  readonly state: GameStateDto;
}
```

- Live save key: `compsciquest:save:v1`.
- Quarantine key: `compsciquest:save:v1:corrupt` (§9).
- `SaveManager.buildDto()` adds `version` and `savedAt` to `GameState.toDto()`;
  `JSON.stringify` produces the stored/imported text.
- Download filename: `compsciquest-save-<ISO-date>.json`, so successive exports
  do not overwrite one another.
- On import the file's original `savedAt` is **preserved**; it is not restamped.
- The UI renders every imported string via `textContent`, never as HTML.

## 3. Persisted shape (canonical)

### 3.1 Top-level DTO

```ts
// src/core/GameState.ts
import type { Position } from '../types/domain';

export interface GameStateDto {
  readonly player: {
    readonly position: Position; // { worldId, areaId, roomId }
    readonly inventory: readonly string[]; // item IDs carried by the player
    readonly lives: number;
  };
  readonly rooms: Readonly<Record<string, RoomStateDto>>; // keyed by room ID
  readonly npcs: Readonly<Record<string, NpcStateDto>>; // keyed by actor ID
  readonly hazards: Readonly<Record<string, HazardStateDto>>;
  readonly puzzles: Readonly<Record<string, PuzzleStateDto>>;
  readonly hints: Readonly<Record<string, HintStateDto>>;
  readonly quiz: QuizStateDto;
  readonly quizAttempts: Readonly<Record<string, number>>; // lifetime retries per quiz
  readonly flags: Readonly<Record<string, boolean>>; // world + action + item flags
  readonly progress: readonly AreaProgress[];
  readonly turn: number;
  readonly status: SessionStatus;
  readonly schedule: readonly ScheduledEvent[];
  readonly rngSeed: number; // 32-bit unsigned PRNG state
  readonly counters: Readonly<Record<string, number>>;
}
```

`score` is **not** stored. It is a runtime value derived at restore as
`sum(progress[].earnedScore)`. `ScoreTracker` remains the sole writer of
`earnedScore`; `GameState.score` and `ScorePanel` read the derived total.

`AreaProgress.maxScore` is stored, but **refreshed from content at restore**
(§7). Its saved value is only a display fallback.

### 3.2 Entity and system state

```ts
export type SessionStatus = 'playing' | 'won' | 'lost';

export interface RoomStateDto {
  readonly inventory: readonly string[]; // items dropped in this room
}
// A room absent from `rooms` has an empty inventory; entries are created lazily.

export interface NpcStateDto {
  readonly stateId: string;
  readonly knownTopics: readonly string[];
  readonly inventory: readonly string[]; // items given/shown to this actor
  readonly activeNodeId?: string; // omitted when no node is active
  readonly topicUses: Readonly<Record<string, number>>;
}

export interface HazardStateDto {
  readonly lastFiredTurn?: number; // omitted until first fire
  readonly timesFired: number;
}

export type PuzzlePhase = 'unsolved' | 'active' | 'solved';
export interface PuzzleStateDto {
  readonly phase: PuzzlePhase;
}

export interface HintStateDto {
  readonly levelsShown: readonly number[];
  readonly lastShownTurn?: number; // omitted until first hint
}

export interface QuizStateDto {
  readonly activeQuizId?: string; // omitted when no quiz is active
  readonly questionIds: readonly string[]; // shuffled order, fixed for this attempt
  readonly index: number;
  readonly correctCount: number;
  readonly answers: readonly number[]; // choices in this attempt (0-based)
}

export interface AreaProgress {
  readonly worldId: string;
  readonly areaId: string;
  readonly visitedRooms: readonly string[];
  readonly completedTopics: readonly string[];
  readonly earnedScore: number;
  readonly maxScore: number; // refreshed from content at restore
}
```

`ScheduledEvent`, `Condition`, `Trigger` and `Effect` are the shapes defined in
[shared-rules.md](shared-rules.md) §§3–6; a schedule serialises its
`remainingTurns`, optional `repeatEveryTurns` and its `Effect` as plain data.

`QuizStateDto.startedTurn`, `HintStateDto.firstRequestedTurn` and the old generic
`QuizStateDto.attempts` field were removed — nothing reads them. Retry limits use
`quizAttempts` (§5).

### 3.3 Invariants

1. Every item ID occurs in **exactly one** owner list: `player.inventory`, an
   `NpcStateDto.inventory`, or a `RoomStateDto.inventory`. `transfer-item` uses
   the reserved owner ID `'player'`, actor IDs for NPCs and room IDs for rooms,
   and updates both lists atomically.
2. Mutable door/container/item state uses a kebab-case `flags` convention, e.g.
   `door-open:<itemId>`, `container-open:<itemId>`, `item-used:<itemId>`, plus
   puzzle action flags such as `door-unlocked`. There is no separate item-state
   record. Each item's starting room is declared in content (§6).
3. `progress` entries are unique by `(worldId, areaId)`.
4. `status` is `'playing'` during normal play and is set by `Session` on
   `game-over` (`'lost'`) or `game-won` (`'won'`).
5. `rngSeed` is an unsigned 32-bit integer. The seeded PRNG advances on every
   draw and the new seed is written to the save, so question order and varied
   replies reproduce exactly after a reload.

## 4. Counters and stuckness

`counters` is a free-form `Record<string, number>`; validation does not restrict
keys. Only conditions interpret the three agreed prefixes:

| Key                        | Incremented by                                   |
| -------------------------- | ------------------------------------------------ |
| `hints-shown:<hintId>`     | `show-hint` effect                               |
| `failed-attempts:<quizId>` | wrong quiz answer                                |
| `turns-since:<puzzleId>`   | every turn after the puzzle first becomes active |

`PuzzleSystem` creates `turns-since:<puzzleId>` with value `0` when the puzzle
becomes `active`, then increments it on every subsequent turn in phase 4 —
including turns spent in conversation or answering a quiz. Counters are **never
pruned**: the save keeps a complete audit trail.

## 5. Quiz attempts

`quizAttempts[quizId]` is the lifetime number of times that quiz has been
started. `start-quiz` checks it against the quiz's optional `attemptsAllowed`
(omitted means unlimited) **before** starting and increments it on start.
The active attempt's question order, index, correct count and answers live in
`QuizStateDto`; they are reset when the quiz ends and `activeQuizId` is omitted.

## 6. Content dependencies

The save stores IDs, not content. Content must therefore declare:

- each item's starting room (an `initialRoom` field on the area card's item
  artifact, added to [content-rules.md](content-rules.md) §4.2);
- level-start rooms per world/area for hazard and quiz failure teleports, as the
  runtime `startAreaId` / `startRoomId` fields defined in
  [application-and-ui.md §3.2](application-and-ui.md#32-world-area-room-and-item-definitions);
- `SpecTopic.status` and `evidence` in `COVERAGE.md`, used for the covered +
  evidence scoring rule and for the win check.

Validation receives the content catalogues so it can check that referenced IDs
exist (§8). The engine never hard-codes content IDs.

## 7. Restore-time derivation

`SaveManager.restore(dto)` performs two derivations before constructing
`GameState`:

1. **Score** — compute the total from `progress[].earnedScore` and expose it as
   the runtime `GameState.score`. It is never read from the save.
2. **Maxima** — for each `AreaProgress`, refresh `maxScore` from
   `SpecTopicCatalogue.getByAreaId(worldId, areaId)` (the lookup is defined in
   [application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures)), so
   an older save adjusts when content changes.

The win check is evaluated against the **live catalogue**, not a topic list in
the save: the game is won when every `SpecTopic` with `status === 'covered'` and
non-empty `evidence` has its ID in some `progress[].completedTopics`, and no
recorded quiz attempt lacks its `quiz-passed:<quizId>` flag (user decision
2026-11-25; [application-and-ui.md §11](application-and-ui.md#11-win-check-owner)
adds the quiz condition to the in-play check). Restore cannot see the events
that passed a quiz, so an attempt with no pass flag means that quiz has not been
passed yet and the save is still playing. A save with no recorded attempts is
treated as a completed run when every covered topic is complete — hand-built and
legacy saves carry no attempt counters. If `status !== 'playing'` the check is
skipped, so a reloaded won game cannot emit `game-won` a second time. During
play the same check is owned by `Session.observe` in phase 5
([application-and-ui.md §11](application-and-ui.md#11-win-check-owner)); restore
only derives and never emits.

## 8. Validation contract

### 8.1 Strictness

- Check that every **required key is present and has the right type**; reject
  missing keys and wrong types.
- **Ignore unknown extra keys**, which permits additive v1 fields and forward
  compatibility.
- Validate in order: JSON parse → version → shape → content references.
- A `version` other than the literal `1` is rejected: lower versions as
  `wrong-version`, higher as `newer-version`. No migration is attempted.
- Content validation checks: unique `(worldId, areaId)`; every room, item,
  actor, quiz, topic and schedule ID referenced by the save exists in the
  catalogues; every item appears in exactly one owner list.

### 8.2 Result type

```ts
// src/application/SaveDto.ts
export type LoadFailureReason =
  | 'invalid-json'
  | 'wrong-version'
  | 'newer-version'
  | 'invalid-shape'
  | 'invalid-content';

export type LoadResult =
  | { readonly ok: true; readonly dto: SaveDto }
  | { readonly ok: false; readonly reason: LoadFailureReason };
```

`SaveControls` maps each reason to a distinct, friendly message. `JSON.parse`
and file-read failures become `'invalid-json'`; a bad import never touches the
live save.

## 9. Quarantine

On **boot only**, if the live save exists but validation fails for any reason,
`SaveManager` writes the original text to `compsciquest:save:v1:corrupt` as:

```ts
export interface QuarantineDto {
  readonly quarantinedAt: string; // ISO 8601, from Clock
  readonly reason: LoadFailureReason;
  readonly raw: string; // exact text read from storage
}
```

- Only one quarantine slot exists; an existing quarantine is **never
  overwritten**.
- Boot then continues to the title screen with Continue disabled, rather than
  blocking the player; `GameState.createInitial()` runs when New Game is chosen
  ([application-and-ui.md §2](application-and-ui.md#2-boot-title-screen-and-session-start)).
- `SaveControls` offers a **download quarantined save** action so the text can
  be inspected or recovered.
- Import failures show an error and leave both the live save and quarantine
  untouched.

## 10. API contracts

```ts
// src/storage/StorageAdapter.ts — interface only; BrowserStorage implements it
export interface StorageAdapter {
  read(key: string): string | null;
  write(key: string, json: string): void;
  remove(key: string): void;
}

// src/application/SaveManager.ts
export interface SaveManager {
  buildDto(state: GameStateDto): SaveDto; // adds version + savedAt from Clock
  save(state: GameStateDto): void; // buildDto → stringify → storage.write
  load(): LoadResult; // read live save; quarantine on failure
  validate(text: string): LoadResult; // import path; never writes storage
  restore(dto: SaveDto): GameState; // derives score + maxScore (§7)
}
```

Catalogues and `StorageAdapter`/`Clock` are injected into `SaveManager`, keeping
it testable with in-memory fakes and a fake clock.

## 11. Flow

```
save:     GameState.toDto() → buildDto() → JSON.stringify
          ├→ StorageAdapter.write('compsciquest:save:v1', json)
          └→ SaveFile.download(json)  (dated filename)

boot:     StorageAdapter.read(...) → validate()
          ├─ ok    → title screen with Continue enabled → restore(dto) → GameState
          └─ fail  → quarantine raw text → title screen with Continue disabled
                     → New Game → GameState.createInitial()

import:   File.text() → validate() → restore(dto) → GameState
          (no storage writes on success or failure)
```

Meta actions (save, load, download, import, restart) are intercepted by `Game`
before core command dispatch and do not advance the turn
([application-and-ui.md §4.1](application-and-ui.md#41-meta-actions)).

## 12. Tests

- Round-trip `GameState → DTO → JSON → DTO → GameState` preserves every field.
- Extra unknown v1 fields are ignored; missing and wrongly typed fields rejected.
- Wrong and newer versions rejected with distinct reasons; content IDs checked.
- Item ownership invariant holds after `drop`, `give`, `show` and `transfer-item`.
- `score` is absent from the JSON but derived correctly after restore.
- `maxScore` is refreshed from a changed content fixture on restore.
- `status` round-trips; a won save does not re-emit `game-won`.
- `quizAttempts` caps retries across attempts; active quiz state resets on end.
- `turns-since` starts at 0 on activation and ticks on all later turns.
- `savedAt` survives import; filenames carry the date.
- Boot quarantine keeps the first corrupt copy and offers a download; a failed
  import leaves the live save and quarantine untouched.
- Seeded order is identical across save/load (`rngSeed` round-trip).

## 13. Out of scope

Checksums/integrity hashes and multi-tab concurrency protection are explicitly
not in v1: shape validation is considered sufficient. Also out of scope:
schema migration, multiple save slots, autosave and undo.

## 14. Decisions resolved

| Decision                | Choice                                                                        |
| ----------------------- | ----------------------------------------------------------------------------- |
| Item ownership          | Properties of Player, NPC and Room state; no central owner map.               |
| Mutable item/exit state | Kebab-case `flags` convention; no `itemStates` record.                        |
| Session status          | Persisted as `status: 'playing' \| 'won' \| 'lost'`.                          |
| Score                   | Removed from the DTO; derived at restore from area totals.                    |
| `AreaProgress.maxScore` | Stored but refreshed from content at restore.                                 |
| Quiz retry limits       | `quizAttempts: Record<quizId, number>`; no generic `attempts` field.          |
| `turns-since`           | Created at 0 on activation, incremented every later turn.                     |
| Spare fields            | `startedTurn` and `firstRequestedTurn` dropped.                               |
| Win check               | Catalogue topics with `covered` + evidence, checked against completed topics. |
| Validation strictness   | Required keys and types checked; extra keys ignored.                          |
| Error model             | Typed `LoadResult` union with five reasons.                                   |
| Quarantine              | One slot, raw text + reason + timestamp, boot only, downloadable.             |
| API contracts           | Exact `StorageAdapter` and `SaveManager` signatures pinned above.             |
| Import/export           | Preserve `savedAt`; dated download filename.                                  |
| Derived values          | Applied by `SaveManager.restore()`, keeping core content-free.                |
| Progress validation     | Unique `(worldId, areaId)`; content IDs checked.                              |
| Counter keys            | Free-form strings; no prefix restriction at load.                             |
| Room inventory          | `rooms: Record<roomId, RoomStateDto>`, not a flat `roomItems` map.            |
| Integrity / multi-tab   | Neither in v1; documented as out of scope.                                    |
