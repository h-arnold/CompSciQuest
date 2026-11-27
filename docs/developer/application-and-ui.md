# Application and UI contracts

Index: [docs/developer/README.md](README.md).

## 1. Purpose and authority

This document is the **canonical definition** of the application-layer and UI
contracts: the content bundle, the boot/title flow, the `Game` façade, the
`Command` and `GameEvent` unions, the UI view-model and DOM layout, and the
behavioural signatures the other documents name but do not pin down.

Where another document defines a persisted shape,
[storage-schema.md](storage-schema.md) remains canonical. Where it defines rule
spine data (`Condition`, `Trigger`, `Effect`, `ScheduledEvent`),
[shared-rules.md](shared-rules.md) remains canonical. This document adds the
_behavioural_ contracts around them.

All prose and all placeholder game text use British English.

## 2. Boot, title screen and session start

v1 has a **title screen**. It is a UI overlay inside the browser-window chrome,
not a persisted game state; `GameStateDto.status` continues to describe only
`playing` / `won` / `lost`.

Boot sequence (`src/main.ts`):

1. Find `#app` (from `index.html`) or throw a clear error.
2. Construct the `Clock`, `StorageAdapter`, `SaveManager`, `EventBus` and the
   `ContentBundle` from `src/content/index.ts`.
3. Call `validateContent(bundle)`. Fail fast with a readable error if content is
   structurally invalid — the game must never boot with broken IDs or aliases.
4. Call `SaveManager.load()`. On failure the live save is quarantined by
   `SaveManager` ([storage-schema.md §9](storage-schema.md#9-quarantine)) and boot
   continues with no usable save.
5. Construct `Game` with the injected bundle and services, then construct
   `GameWindow` with all views, including `TitleScreen`, and subscribe the views
   to the event bus.
6. Show the title screen. It offers **Continue** (enabled only when step 4
   returned `ok: true`) and **New Game**.
   - Continue calls `Game.continueGame(dto)` with the loaded DTO.
   - New Game calls `Game.newGame()`.
7. The chosen action starts the session and emits the initial room description
   as a buffered `GameEvent[]` batch, which the views render. The title overlay
   is removed only after that first batch has been published, so the player
   never sees an empty terminal.
8. Restart from a won/lost state follows the same path as New Game, using the
   `restart` meta action (§4.1).

A corrupt or quarantined save disables Continue; the player starts fresh. The
quarantined text stays in storage for manual inspection by a developer;
`SaveControls` has no action to download it.

## 3. Content bundle and registration

### 3.1 Catalogue shape

All definitions are declarative data under `src/content/`, never hard-coded in
engine classes. `shared-rules.md §9` requires a catalogue per system; this is
the concrete shape.

```ts
// src/content/Catalogue.ts
export interface Catalogue<T> {
  readonly all: readonly T[]; // declaration order, never object-key order
  getById(id: string): T | undefined;
}
```

`all` exists because [shared-rules.md §10](shared-rules.md#10-determinism-and-ordering-rules)
requires declaration-order evaluation. `getById` returns `undefined` for missing
IDs; it never throws.

```ts
// src/content/ContentBundle.ts
export interface ContentBundle {
  readonly worlds: Catalogue<WorldDefinition>;
  readonly areas: Catalogue<AreaDefinition>;
  readonly rooms: Catalogue<RoomDefinition>;
  readonly items: Catalogue<ItemDefinition>;
  readonly actors: Catalogue<ActorDefinition>;
  readonly actorStates: Catalogue<ActorState>;
  readonly conversationTopics: Catalogue<ConversationTopic>;
  readonly nodes: Catalogue<ConversationNode>;
  readonly quizzes: Catalogue<Quiz>;
  readonly questions: Catalogue<QuizQuestion>;
  readonly puzzles: Catalogue<Puzzle>;
  readonly hazards: Catalogue<Hazard>;
  readonly hints: Catalogue<HintSequence>;
  readonly specTopics: SpecTopicCatalogue;
}
```

The per-artefact interfaces (`ActorState`, `ConversationTopic`,
`ConversationNode`, `Quiz`, `QuizQuestion`, `Puzzle`, `Hazard`, `HintSequence`)
are defined in the subsystem documents and are not redeclared here.
`WorldDefinition`, `AreaDefinition`, `RoomDefinition` and `ItemDefinition` are
defined in §3.2; `SpecTopic` and `SpecTopicCatalogue` are defined in §8.

### 3.2 World, area, room and item definitions

```ts
// src/content/WorldDefinition.ts
export interface WorldDefinition {
  readonly id: string;
  readonly name: string;
  readonly areaIds: readonly string[];
  readonly startAreaId: string;
  readonly lives: number; // starting lives for this world
}

// src/content/AreaDefinition.ts
export interface AreaDefinition {
  readonly id: string; // unique together with worldId
  readonly worldId: string;
  readonly name: string;
  readonly roomIds: readonly string[];
  readonly startRoomId: string; // level start for hazards and quiz failures
  readonly lives: number; // reset value on entering the area
}

// src/content/RoomDefinition.ts
export interface RoomDefinition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly exits: readonly ExitDefinition[];
  readonly entryEffects: readonly Effect[];
  readonly score: number; // first-visit award, 0 when not scoreable
}

// src/content/ExitDefinition.ts
export interface ExitDefinition {
  readonly direction: Direction;
  readonly targetRoomId: string;
  readonly preconditions: readonly Condition[];
  readonly blockedText?: string; // in-world response when preconditions fail; omit when absent (§8)
}

// src/content/ItemDefinition.ts
export interface ItemDefinition {
  readonly id: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly portable: boolean;
  readonly refusalText?: string; // in-world take refusal for a non-portable item; omit when absent (§5.2)
  readonly useText?: {
    readonly success: string;
    readonly blocked?: string;
  }; // authored prose for a conditional `use` producer; omit when absent (§5.2)
  readonly description: string;
  readonly initialRoom: string; // starting owner; ownership lives in state
}
```

An exit in a rooms card carries `blockedText` as a plain string beside its other
keys, omitted when absent. The card keys `direction`, `to` and `conditions`
become `direction`, `targetRoomId` and `preconditions` in the generated
definition ([content-toolchain.md §5](content-toolchain.md#5-generation)):

```yaml
exits:
  - direction: <direction>
    to: <room-id>
    conditions: [<condition>]
    blockedText: <in-world message when the conditions fail>
```

`startRoomId` is the runtime level start for hazards and quiz-failure teleports;
[content-toolchain.md D4](content-toolchain.md#authoring-rules) owns the authoring
rule for `startRoomId` and `lives`. A new game starts with 3 lives: `Session.newGame` assigns them after
`createInitial` has read `WorldDefinition.lives`, so a world that declares
another value is not yet honoured. After the start, lives change through
`change-lives` and on a gated area change.

A `move-player` across an area or world boundary resets lives to the destination
area's `AreaDefinition.lives` only when every quiz and puzzle of the **departed**
area is solved; otherwise lives carry across unchanged. Quizzes and puzzles map
to that area through their `topicId` and
`bundle.specTopics.getByAreaId(worldId, areaId)`; an area with none satisfies the
gate. A quiz counts solved when `quiz-passed:<quizId>` is true, a puzzle when
`state.puzzles[id].phase` is `solved`. Movement within one area never resets
lives, and the reset still runs through `change-lives` (§9).

### 3.3 Loading and validation

```ts
// src/content/index.ts
export function loadContent(): ContentBundle;

// src/content/validateContent.ts
export function validateContent(bundle: ContentBundle): readonly string[];
```

`loadContent()` returns the `ContentBundle` assembled from the committed generated
files in `src/content/authored/`; it never reads or parses YAML.
`validateContent` returns a list of human-readable problems; an empty array
means valid. At boot it re-runs these checks against the bundle: the runtime
mirrors of `content-ids`, `puzzle-graph`, `hazard-content` and `score-content`
([content-toolchain.md §4](content-toolchain.md#4-validation)), plus
the interaction and scenery shape checks shared with authoring:

- unique artefact IDs and globally unique object/NPC aliases;
- every exit target, item `initialRoom`, `area.startRoomId` and `move-player`
  target exists, with valid exit directions;
- puzzle dependencies resolve and the graph is acyclic;
- hazard authoring rules hold (telegraph present, no `set-puzzle-*`, positive
  schedule);
- per-topic score budgets hold (§10 of this document);
- room interaction and scenery shape holds, through the owner shared with the
  authoring gate ([content-toolchain.md §4](content-toolchain.md#4-validation)).
  Target-reference checks stay with `content-ids`.

NPC actor binding is checked at authoring time: every authored topic and node
carries an `actorId` that resolves to one actor, except for a brief-approved
global topic, and the `npc-content` gate enforces it
([npcs.md §8 "Actor binding"](npcs.md#8-npc-card-format)). That
gate is authoring-only, so boot does not re-check it. The remaining shape checks (stray
keys outside `authoring:`, document `status`, unresolved `todo` placeholders)
run only in `npm run content:validate` on the YAML. The four
runtime-mirrored gates share one check function across authoring, test and boot;
`world-graph`, `quiz-content`, `hint-content` and `npc-content` run at authoring
time only.

`createInitial(bundle?)` takes its world, area, room and room inventory from the
supplied bundle and resolves the area by the world's `startAreaId` and the room
by that area's `startRoomId`. `Game.newGame()` calls it directly, so array
position is never a substitute for the authored start. Boot assembles the
committed generated catalogues; unit tests inject small fixtures; e2e uses the
real generated bundle.

## 4. Game façade and meta actions

```ts
// src/application/Game.ts
export interface Game {
  submit(raw: string): readonly GameEvent[];
  newGame(): void;
  continueGame(dto: SaveDto): void;
  restart(): void;
  getViewData(): GameViewData;
  save(): void; // write the live save
  download(): void; // dated JSON download
  importSave(text: string): LoadResult;
}
```

`submit` runs the turn pipeline defined in
[shared-rules.md §2](shared-rules.md#2-turn-pipeline); `Game` owns the per-turn
event buffer and ordering, and returns the buffered batch it also publishes
through the `EventBus`. It increments `GameStateDto.turn` once per submitted game
command, whether or not the command succeeded. It never throws on bad input;
unparseable text becomes an `unknown` command and a friendly message.

After each core command that advances the turn, `submit` autosaves the final
state through the `saveGame()` → `SaveManager.save()` seam
([storage-schema.md §10](storage-schema.md#10-api-contracts)). Meta actions and
commands rejected while `status !== 'playing'` do not trigger that autosave.

`newGame`, `continueGame` and `restart` replace the current `GameState`, clear
the views' transient state and emit the initial room batch. `newGame` and
`restart` also write the freshly created state through the same seam, so
Continue after a reload starts the new game. A reloaded end state does not
re-emit `game-won` or `game-over` ([storage-schema.md §7](storage-schema.md#7-restore-time-derivation)).

While `status !== 'playing'`, `submit` accepts only `look`, `examine`,
`inventory`, `score` and `help`; every other command returns a friendly "the
adventure is over — start a new game" message and does not advance the turn.

### 4.1 Meta actions

Typed `save`, `load`, `download`, `import` and `restart` are **aliases for the
SaveControls buttons**, intercepted before core dispatch.

```ts
// src/application/MetaAction.ts
export type MetaAction =
  | { readonly kind: 'save' }
  | { readonly kind: 'load' }
  | { readonly kind: 'download' }
  | { readonly kind: 'import'; readonly text: string }
  | { readonly kind: 'restart' };
```

`Game` owns interception so the behaviour is identical whether the action came
from a button or the terminal. Meta actions never enter the core `Command`
union and never advance `turn`. Typed `restart` starts a new game and writes
that fresh state through the `saveGame()` → `SaveManager.save()` seam (§4);
`download`, `load` and `import` do not autosave. `openSaveFile` is injected from
`src/main.ts` and `GameWindow` owns the download and import controls; import
from a button supplies `text` from `openSaveFile`. Typed `import` opens the same
file picker rather than expecting pasted JSON. `load` rebinds the restored
`GameState`, refreshes the views without re-emitting an end event, and
publishes one canonical `message` event with the engine-authored line
`Game loaded.` alongside the initial room batch. A failed load publishes only
`No saved game could be loaded.`

## 5. Canonical command union and verbs

This is the single canonical `Command` union. Every other document links here.

```ts
// src/core/commands/Command.ts
export type Command =
  // core
  | { readonly kind: 'go'; readonly direction: Direction }
  | { readonly kind: 'take'; readonly itemId: string }
  | { readonly kind: 'drop'; readonly itemId: string }
  | {
      readonly kind: 'use';
      readonly itemId: string;
      readonly targetId?: string;
    }
  | { readonly kind: 'examine'; readonly targetId: string }
  | { readonly kind: 'open'; readonly targetId: string }
  | { readonly kind: 'close'; readonly targetId: string }
  | {
      readonly kind: 'unlock';
      readonly itemId: string;
      readonly targetId: string;
    }
  | { readonly kind: 'put'; readonly itemId: string; readonly targetId: string }
  | { readonly kind: 'look' }
  | { readonly kind: 'inventory' }
  | { readonly kind: 'score' }
  | { readonly kind: 'help' }
  | { readonly kind: 'unknown'; readonly raw: string }
  // NPCs
  | { readonly kind: 'talk-to'; readonly actorId: string }
  | { readonly kind: 'ask'; readonly actorId: string; readonly topic: string }
  | { readonly kind: 'tell'; readonly actorId: string; readonly topic: string }
  | { readonly kind: 'give'; readonly actorId: string; readonly itemId: string }
  | { readonly kind: 'show'; readonly actorId: string; readonly itemId: string }
  | { readonly kind: 'unseen-actor'; readonly actorId: string }
  | { readonly kind: 'bye' }
  // quiz combat
  | { readonly kind: 'answer'; readonly option: number }
  // hints
  | { readonly kind: 'hint'; readonly targetId?: string };
```

### 5.1 Door and container verbs

Doors and containers have dedicated verbs in v1 rather than relying solely on
`use`:

| Command                                                  | Meaning                                                     | Flag effect                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `open <target>`                                          | Open an unlocked door or container                          | `door-open:<itemId>` / `container-open:<itemId>` = `true`         |
| `close <target>`                                         | Close an open door or container                             | the same flag = `false`                                           |
| `unlock <item> <target>` / `unlock <item> with <target>` | Use a key-like item; sets the action flag but does not open | `door-unlocked:<itemId>` / `container-unlocked:<itemId>` = `true` |
| `put <item> <target>` / `place <item> <target>`          | Place a visible item or scenery on a visible target         | `transfer-item` to the target owner (the room for scenery)        |

The `flags` convention and the one-owner-per-item rule are owned by
[storage-schema.md §3.3](storage-schema.md#33-invariants). Handlers check their
own preconditions; `RuleEngine` gates `go` through declared exit preconditions
(§8). An invalid attempt emits a friendly in-voice message and leaves state
unchanged. `use <item> on <target>` remains supported as a general interaction,
including puzzle solutions.

### 5.2 Verb table and handler signature

v1 recognises the canonical verbs with these aliases:

| Verb            | Aliases                                                                            |
| --------------- | ---------------------------------------------------------------------------------- |
| `go`            | direction shortcuts `n`, `s`, `e`, `w`, `u`, `d`, `in`, `out` and their full names |
| `take`          | `get`, `pick up`                                                                   |
| `drop`          | `put down` (distinct from `put … in …`)                                            |
| `use`           | —                                                                                  |
| `examine`       | `x`, `look at`                                                                     |
| `open`          | —                                                                                  |
| `close`         | `shut`                                                                             |
| `unlock`        | both word orders (§5.1)                                                            |
| `put`           | `place`                                                                            |
| `look`          | —                                                                                  |
| `inventory`     | `i`, `inv`                                                                         |
| `score`         | —                                                                                  |
| `help`          | `?`                                                                                |
| `talk-to`       | `talk`, `talk to`                                                                  |
| `ask` / `tell`  | —                                                                                  |
| `give` / `show` | —                                                                                  |
| `bye`           | `goodbye`                                                                          |
| `answer`        | —                                                                                  |
| `hint`          | —                                                                                  |

`ask about <topic>` omits the actor. An actor qualifies when a conversation topic
bound to it by `actorId` has an `isActive` location scope matching the player's
`Position` ([npcs.md §2](npcs.md#2-model), [shared-rules.md §3](shared-rules.md#3-condition)).
Inference applies only when exactly one actor qualifies; `ask <npc> about <topic>`
names the actor, and zero or several candidates take the `unknown` path.

`give`/`show` with a resolvable actor but an unresolvable item resolve to
`unseen-actor` (§5). `unseenActorHandler()` emits exactly one `message` effect:
`You cannot see that here.` when `isActorOutOfRoom()` reports the actor outside
the room, otherwise `I don't understand that.`.

A bare `N` during a quiz is accepted in place of `answer N` with the same
1-based option ([combat.md §4](combat.md#4-commands-and-events)).

```ts
// src/core/commands/CommandHandler.ts
export type CommandHandler = (
  command: Command,
  context: TurnContext,
) => readonly Effect[];
```

Handlers **return** effects and emit no events directly; `EffectApplier` is the
only state mutator. `TurnContext` carries the read-only state, the injected
`Random`, the content bundle, the turn number and the `Command` being handled
(§8). Ambiguity is avoided by
globally unique object/NPC aliases ([npcs.md §3](npcs.md#3-commands-and-topic-resolution));
there is **no disambiguation prompt**. The verb and alias tables are engine
constants (not content), but individual item/actor aliases come from content.
A room card may declare `aliases`, but they are authoring-only: the generator
drops them and `NameResolver` never resolves a room name.

`take` transfers a visible portable item to the player and emits "Taken.". A
visible item whose `portable` is `false` is never transferred: it stays in the
room and remains examinable, and the handler emits exactly one `message` effect
using the item's `refusalText` when present and non-empty, otherwise the exact
fallback "You cannot take that item with you." An empty `refusalText` is treated
as absent. This is in-world feedback under
[narrative-principles.md §2](../content/narrative-principles.md#2-register-and-technical-language), not a parser-style
denial. `drop` shares `takeHandler()` and is unaffected
by `portable`: it transfers from the player to the room and emits "Dropped.".

`use` and `put` accept a **visible source**: a carried item, a visible room item
or a visible scenery ID. `use` has an optional target and `put` requires one;
both targets must be visible. `put` derives `fromOwnerId` from live state —
`player` when the source is carried, otherwise the current room — and sends a
scenery target's transfer to that room. An unreachable source still emits
"You are not carrying that.". This is the runtime allowance for the authored
trace, whose rows act on room items and scenery without an intervening `take`
([walkthrough.md §8.6](../content/walkthrough.md#86-trace-pinned-verb-action-rows-the-w6-contract)).

A small authored-use table handles bare `use <item>` with no target: the
calibration dial in `room-assistance-records` and the practice bell in
`room-assistance-demonstration`. The approved prose is signed off in
[content-bible.md §12](../content/content-bible.md#12-approval-record).
For these rows the table holds IDs, prerequisites and the flag to set; all
player-facing text comes from the item (§3.2). With all five dial prerequisites
set, the producer emits one `message` from `useText.success` and one
`set-flag assistance-dial-calibrated: true`; with any missing, it emits only
`useText.blocked` and leaves state unchanged. The bell has no prerequisites
or flag and emits one `message` with its authored `description`. A producer
without `useText` replies with its `description`; a blocked producer without
`blocked` prose emits nothing.

## 6. Canonical event union and rendering

This is the single canonical `GameEvent` union. Every other document links here.

```ts
// src/core/events/GameEvent.ts
export interface RoomSummary {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly exits: readonly Direction[];
}

export type GameEvent =
  // baseline
  | { readonly type: 'message'; readonly text: string }
  | { readonly type: 'room-entered'; readonly room: RoomSummary }
  | {
      readonly type: 'score-changed';
      readonly delta: number;
      readonly total: number;
      readonly reason: string;
    }
  | { readonly type: 'topic-completed'; readonly topicId: string }
  | { readonly type: 'lives-changed'; readonly lives: number }
  | {
      readonly type: 'game-over';
      readonly reason: string;
      readonly finalScore: number;
    }
  | { readonly type: 'game-won'; readonly finalScore: number }
  // NPCs
  | { readonly type: 'conversation-started'; readonly actorId: string }
  | {
      readonly type: 'npc-spoke';
      readonly actorId: string;
      readonly text: string;
    }
  | {
      readonly type: 'conversation-ended';
      readonly actorId: string;
      readonly reason: string;
    }
  | {
      readonly type: 'topic-suggested';
      readonly actorId: string;
      readonly text: string;
    }
  // hazards and puzzles
  | {
      readonly type: 'hazard-triggered';
      readonly hazardId: string;
      readonly reason: string;
    }
  | { readonly type: 'puzzle-activated'; readonly puzzleId: string }
  | {
      readonly type: 'puzzle-solved';
      readonly puzzleId: string;
      readonly topicId?: string;
    }
  // quiz combat
  | {
      readonly type: 'quiz-started';
      readonly quizId: string;
      readonly actorId: string;
    }
  | {
      readonly type: 'question-asked';
      readonly quizId: string;
      readonly questionId: string;
      readonly prompt: string;
      readonly options: readonly string[];
    }
  | {
      readonly type: 'answer-evaluated';
      readonly quizId: string;
      readonly questionId: string;
      readonly correct: boolean;
      readonly explanation: string;
    }
  | {
      readonly type: 'quiz-ended';
      readonly quizId: string;
      readonly passed: boolean;
      readonly reason: string;
    }
  // hints
  | {
      readonly type: 'hint-shown';
      readonly hintId: string;
      readonly level: number;
      readonly text: string;
    }
  | {
      readonly type: 'hint-penalty-applied';
      readonly hintId: string;
      readonly delta: number;
    }
  // bookkeeping
  | {
      readonly type: 'flag-changed';
      readonly flag: string;
      readonly value: boolean;
    }
  | {
      readonly type: 'item-moved';
      readonly itemId: string;
      readonly fromOwnerId: string;
      readonly toOwnerId: string;
    }
  | {
      readonly type: 'actor-state-changed';
      readonly actorId: string;
      readonly stateId: string;
    }
  | {
      readonly type: 'knowledge-gained';
      readonly actorId: string;
      readonly topicId: string;
    }
  | {
      readonly type: 'node-entered';
      readonly actorId: string;
      readonly nodeId: string;
    }
  | { readonly type: 'node-exited'; readonly actorId: string }
  | {
      readonly type: 'scheduled';
      readonly eventId: string;
      readonly kind: 'fuse' | 'daemon';
      readonly remainingTurns: number;
    };

export interface EventBus {
  publish(events: readonly GameEvent[]): void;
  subscribe(listener: (event: GameEvent) => void): () => void;
}
```

`EventBus.publish` takes the whole turn batch; the interface is in
[`src/core/events/EventBus.ts`](../../src/core/events/EventBus.ts).

`score-changed.total` is the running total owned by `ScoreTracker`; it is the
sum of `AreaProgress.earnedScore` at the moment of observation. It is not read
from a save, and no other writer exists.

### 6.1 Event to view mapping

A pure formatter turns the batch into transcript lines and panel updates:

```ts
// src/ui/formatEvent.ts
export function formatEvent(
  event: GameEvent,
  bundle: ContentBundle,
): readonly string[];
```

| Event(s)                                                                                                                                 | Transcript                                                                                                                                | Panel update                 |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `message`, `npc-spoke`, `topic-suggested`, `hint-shown`                                                                                  | text as given                                                                                                                             | —                            |
| `answer-evaluated`                                                                                                                       | one line: `Correct.` or `Incorrect.` followed by a space and the event's `explanation` unchanged                                          | —                            |
| `room-entered`                                                                                                                           | title, blank line, description, `Exits: north, west`                                                                                      | ScorePanel via view data     |
| `question-asked`                                                                                                                         | prompt, then `1. …` / `2. …` lines                                                                                                        | QuizPanel                    |
| `score-changed`                                                                                                                          | no line without a real gain; on a real gain, one friendly line stating the gained amount, with no internal `reason` string and no room ID | ScorePanel via view data     |
| `topic-completed`                                                                                                                        | completion line derived from `topicId` via the bundle                                                                                     | ScorePanel via view data     |
| `lives-changed`                                                                                                                          | terse in-voice line                                                                                                                       | ScorePanel (lives)           |
| `hazard-triggered`, `conversation-started`, `conversation-ended`, `quiz-started`, `quiz-ended`, `hint-penalty-applied`                   | suppressed — no transcript line, no internal ID or debug string                                                                           | —                            |
| `puzzle-activated`                                                                                                                       | suppressed — no transcript line, no internal puzzle ID or repeated activation notice                                                      | ScorePanel via view data     |
| `puzzle-solved`                                                                                                                          | suppressed — no transcript line, no internal ID or implementation string; the single `topic-completed` line shows the completion outcome  | ScorePanel via view data     |
| `game-over`, `game-won`                                                                                                                  | final message with score                                                                                                                  | TitleScreen offer to restart |
| bookkeeping events (`flag-changed`, `item-moved`, `actor-state-changed`, `knowledge-gained`, `node-entered`, `node-exited`, `scheduled`) | suppressed — no transcript line                                                                                                           | —                            |

A **real gain** means a positive `delta` on `score-changed`; zero and negative
deltas yield no line. The transcript is a player-facing view, not a complete
event trace: internal-state events are omitted, and panels carry current state
through `GameViewData` (§7.2) rather than replaying the batch. The effect →
event mapping in §9 still holds for the event pipeline; suppression happens
only at render time. Submitted commands **are** echoed to the transcript as
`> <raw input>` before their resulting batch is rendered.

## 7. UI structure and view-model

### 7.1 DOM layout

The app uses plain DOM and one stylesheet (`src/ui/style.css`); no UI framework.
"Browser window" is visual chrome, not a nested browsing context.

```
#app
└─ .window                         (title bar + window chrome)
   ├─ .titlebar                    (title, save status)
   ├─ .workspace                   (hidden until a session starts)
   │  ├─ main
   │  │  ├─ OutputLog              (transcript, scrollable)
   │  │  ├─ ConversationPanel      (inline, visible when a conversation is active)
   │  │  ├─ QuizPanel              (inline, visible during a quiz)
   │  │  ├─ HintPanel              (inline, visible when a hint was shown)
   │  │  └─ Terminal               (prompt + input + history)
   │  └─ aside
   │     ├─ ScorePanel             (worlds/areas, score, spec area)
   │     └─ SaveControls           (Save, Load, Download, Import, Restart)
   └─ .title-overlay               (TitleScreen: Continue / New Game)
```

Panels are mounted once at bootstrap and toggled from the view model or event
stream; they are never destroyed and recreated mid-turn. `index.html` keeps
only `#app`; all markup is created by `GameWindow` and its children.

`QuizPanel`'s pass requirement `<p>` is a polite live region
(`aria-live="polite"`), so assistive technology announces it when a quiz
starts.

`OutputLog`'s transcript element carries `role="log"` and `aria-live="polite"`,
so assistive technology announces appended lines without interrupting the
player. `OutputLog` appends the formatted lines it is given without parsing
their content ([§6.1](#61-event-to-view-mapping)).

### 7.2 View data

Events are a stream; `ScorePanel` needs current aggregate state and is forbidden
from computing scores itself. `Game.getViewData()` is that state channel.

```ts
// src/application/GameViewData.ts
export interface SpecTopicView {
  readonly id: string;
  readonly title: string;
  readonly specReference: string;
  readonly status: SpecStatus;
  readonly complete: boolean;
}

export interface AreaProgressView {
  readonly worldId: string;
  readonly areaId: string;
  readonly worldName: string;
  readonly areaName: string;
  readonly earnedScore: number;
  readonly maxScore: number;
  readonly visitedRoomCount: number;
  readonly roomCount: number;
  readonly topics: readonly SpecTopicView[];
}

export interface QuizView {
  readonly quizId: string;
  readonly prompt: string;
  readonly options: readonly string[];
  readonly questionNumber: number;
  readonly questionCount: number;
  readonly passMark: number;
  readonly remainingWrong: number;
}

export interface ConversationView {
  readonly actorId: string;
  readonly actorName: string;
  readonly prompt?: string; // omitted when there is no suggestion
}

export interface HintView {
  readonly hintId: string;
  readonly level: number;
  readonly text: string;
}

export interface GameViewData {
  readonly status: SessionStatus;
  readonly position: Position;
  readonly turn: number;
  readonly lives: number;
  readonly score: number;
  readonly areas: readonly AreaProgressView[];
  readonly activeQuiz?: QuizView;
  readonly conversation?: ConversationView;
  readonly hints: readonly HintView[];
}
```

The rule is: **transcript and transient panels read events; ScorePanel reads
`GameViewData`.** No panel computes scores, resolves aliases or decides game
rules. `ScorePanel` presents `earnedScore`/`maxScore`, visited counts and the
linked spec topics using `SpecTopicCatalogue` labels. `Game.getViewData()` caps
`visitedRoomCount` at the area's declared `roomIds.length`, so the panel never
shows more visits than the area has rooms.

`QuizView.passMark` is the authored `quiz.passMark` count.
`QuizView.remainingWrong` is the wrong answers still affordable in the active
attempt: `questionCount - quiz.passMark`, minus `answers.length - correctCount`
from the live attempt (`questionCount` is `QuizStateDto.questionIds.length`),
clamped at zero. `Game.getViewData()` derives both at view-build time; a correct
answer leaves the allowance unchanged, a wrong answer reduces it by one and a
new quiz resets it. Attempts, lives, score and flags are ignored, and panels
present the values as supplied.

The two values appear in one childless `<p>` reading `Pass mark: N correct of
M. Wrong answers allowed: W.`; that paragraph is the live region described in
§7.1 and is absent when no quiz is active.

`GameViewData.hints` lists hint levels shown in the persisted state. A new quiz
attempt suppresses that list in the view: `quiz-started` makes `hints` empty,
and the next `hint-shown` restores it. The suppression is view-only: persisted
hint records, penalties and cooldown counters are unchanged
([hints.md §3](hints.md#3-commands-and-delivery),
[combat.md §3](combat.md#3-flow)). State replacement through `newGame`,
`continueGame`, `restart`, `load` or an import clears it with the other
transient view state.

`Terminal` owns a bounded in-memory command history with no persistence and no
duplicate suppression, navigated with the up/down arrows. It calls
`Game.submit(raw)` on Enter and renders the returned batch after echoing the
command. During a quiz, `answer N` is typed into the same input.

`SaveControls` renders one button per meta action and maps each
`LoadFailureReason` to a distinct friendly message using its own copy table.
Failed imports never touch the live save or quarantine.

## 8. Behavioural signatures

These pins complement the data contracts in the other documents. Signatures
are deliberately small and pure where possible.

```ts
// src/core/TurnContext.ts
export interface TurnContext {
  readonly turn: number;
  readonly state: GameState;
  readonly bundle: ContentBundle;
  readonly random: Random;
  readonly command: Command;
}

// src/core/rules/ConditionEvaluator.ts
export interface ConditionEvaluator {
  evaluate(
    condition: Condition,
    state: GameState,
    context: TurnContext,
  ): boolean;
}

// src/core/rules/Precondition.ts — the subset usable on actions and exits
export type Precondition = Condition & {
  readonly kind:
    | 'flag-set'
    | 'has-item'
    | 'visited-room'
    | 'puzzle-solved'
    | 'counter-at-least';
};

// src/core/rules/RuleEngine.ts — empty array means the command is allowed
export interface RuleEngine {
  check(command: Command, state: GameState): readonly string[];
}

// src/core/commands/NameResolver.ts
export interface NameResolver {
  resolve(
    phrase: string,
    state: GameState,
    bundle: ContentBundle,
  ): string | undefined;
}

// src/core/commands/TopicResolver.ts (ResolvedTopic is defined in npcs.md §3)
export interface TopicResolver {
  resolve(
    phrase: string,
    state: GameState,
    node?: ConversationNode,
    actorId?: string,
  ): ResolvedTopic;
}

// src/core/World.ts, Room.ts, Exit.ts
export interface World {
  getRoom(position: Position): Room | undefined;
  canTraverse(exit: Exit, state: GameState): boolean;
}
export interface Room {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly exits: readonly Exit[];
}
export interface Exit {
  readonly direction: Direction;
  readonly targetRoomId: string;
  readonly preconditions: readonly Precondition[];
}

// src/core/scheduling/Scheduler.ts — constructed with an injected EffectApplier
export interface Scheduler {
  // reads context.turn and context.state
  tick(context: TurnContext): readonly GameEvent[];
}

// src/application/Clock.ts, src/core/Random.ts
export interface Clock {
  now(): string;
} // ISO 8601
export interface Random {
  nextInt(maxExclusive: number): number;
  // Seeded implementations only (shared-rules.md §7); test fakes may omit both.
  readonly seed?: number; // unsigned 32-bit PRNG state, persisted as rngSeed
  setSeed?(seed: number): void;
}

// src/core/scoring/ScoreTracker.ts, src/core/lifecycle/Session.ts
export interface ScoreTracker {
  observe(events: readonly GameEvent[]): readonly GameEvent[];
  getTotal(): number;
}
export interface Session {
  observe(events: readonly GameEvent[]): readonly GameEvent[];
  newGame(): void;
}

// Phase-4 systems (shared-rules.md §2). Each of the five below is constructed
// with an injected EffectApplier (its dependencies carry a shared
// `readonly applier: EffectApplier`), applies its own effects in declaration
// order and returns the resulting GameEvent[]; none emits to the EventBus.
export interface HazardSystem {
  react(
    context: TurnContext,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}
export interface DialogueSystem {
  react(
    context: TurnContext,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}
export interface PuzzleSystem {
  react(
    context: TurnContext,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}
export interface HintSystem {
  react(
    context: TurnContext,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}

// Phase 3 still returns effects; only phase 4 is event-returning.
export interface QuizSystem {
  handle(command: Command, state: GameState): readonly Effect[];
}

// src/application/ComposedReaction.ts — holds the five constructed systems
export interface ComposedReactionDependencies {
  readonly scheduler: Scheduler;
  readonly hazards: HazardSystem;
  readonly npcs: DialogueSystem;
  readonly puzzles: PuzzleSystem;
  readonly hints: HintSystem;
}

export type ComposedReaction = (
  context: TurnContext,
  events: readonly GameEvent[],
) => readonly GameEvent[];

export function createComposedReaction(
  dependencies: ComposedReactionDependencies,
): ComposedReaction;
```

`RuleEngine.check` gates `go` through exit preconditions only (§5.1). When a
precondition fails it emits one player-facing string: the exit's authored
`blockedText` when present, otherwise the exact fallback `That way is closed for
now.`. It never emits a precondition kind or an internal ID. An empty array
allows the move.

`EventBus`, `Random` and `EffectApplier.apply(effect): GameEvent[]` are defined in
[`src/core/events/EventBus.ts`](../../src/core/events/EventBus.ts),
[`src/core/Random.ts`](../../src/core/Random.ts) and
`src/core/effects/EffectApplier.ts`.

`TurnContext.command` carries the command being handled: `on-verb` matches
`command.kind === trigger.verb`, and `on-item-used` matches an `itemId` on the
command equal to `trigger.itemId`
([shared-rules.md §4](shared-rules.md#4-trigger)). `Command` is the single
canonical union in §5.

`Game` builds a single `TurnContext` per turn (including the resolved `Command`)
and passes it to `createComposedReaction`'s reaction; phase-4 systems read state
and command from that context rather than constructing their own.

The phase-4 contract is uniform: `Scheduler`, `HazardSystem`, `DialogueSystem`,
`PuzzleSystem` and `HintSystem` each apply their effects through their injected
`EffectApplier` and return `readonly GameEvent[]`. `createComposedReaction` calls
them in the order scheduler → hazards → npcs → puzzles → hints and concatenates
the returned events; it has no effect buffer and applies no effects itself. `Game`
owns the per-turn event buffer and the single publication at the end of the turn
([shared-rules.md §2](shared-rules.md#2-turn-pipeline)). Phase 3 handlers continue
to **return** `Effect[]` (§5.2).

`SpecTopic` and `SpecTopicCatalogue` are canonical here. `SpecTopic` carries
`roomIds`; the catalogue owns the `(worldId, areaId)` index, so do not add
`worldId` or `areaId` to the topic.

```ts
// src/core/scoring/SpecTopic.ts
export type SpecStatus = 'not started' | 'in progress' | 'covered';

export interface SpecTopic {
  readonly id: string;
  readonly title: string;
  readonly specReference: string;
  readonly codeLocation: string;
  readonly status: SpecStatus;
  readonly evidence: string;
  readonly roomIds: readonly string[];
  readonly maxScore: number;
}
```

```ts
// src/core/scoring/SpecTopicCatalogue.ts
export interface SpecTopicCatalogue {
  getById(id: string): SpecTopic | undefined;
  getByRoomId(roomId: string): readonly SpecTopic[];
  getByAreaId(worldId: string, areaId: string): readonly SpecTopic[];
}
```

`getByAreaId` is what
[storage-schema.md §7](storage-schema.md#7-restore-time-derivation) needs to
refresh `AreaProgress.maxScore`.

## 9. Effect to event mapping

[shared-rules.md §5](shared-rules.md#5-effect-and-effectapplier) promises one
buffered event per effect. The complete mapping is:

| Effect                                       | Event                                                                   |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| `set-flag`                                   | `flag-changed`                                                          |
| `message`                                    | `message`                                                               |
| `change-lives`                               | `lives-changed`                                                         |
| `complete-topic`                             | `topic-completed`                                                       |
| `grant-item`, `remove-item`, `transfer-item` | `item-moved`                                                            |
| `move-player`                                | `room-entered`                                                          |
| `set-actor-state`                            | `actor-state-changed`                                                   |
| `learn-topic`                                | `knowledge-gained`                                                      |
| `enter-node`                                 | `node-entered`                                                          |
| `exit-node`                                  | `node-exited`                                                           |
| `set-puzzle-active`                          | `puzzle-activated`                                                      |
| `set-puzzle-solved`                          | `puzzle-solved`                                                         |
| `schedule`                                   | `scheduled`                                                             |
| `start-quiz`                                 | `quiz-started`, `question-asked`                                        |
| `ask-question`                               | `question-asked`                                                        |
| `evaluate-answer`                            | `answer-evaluated`                                                      |
| `end-quiz`                                   | `quiz-ended`, `actor-state-changed` (when the quiz names a known actor) |
| `show-hint`                                  | `hint-shown`, `hint-penalty-applied`                                    |
| `announce-hazard`                            | `hazard-triggered`                                                      |

`start-quiz` emits `quiz-started` and the first `question-asked` when it starts
an attempt ([combat.md §3](combat.md#3-flow)); `end-quiz` emits `quiz-ended`,
plus `actor-state-changed` when the quiz names a known
actor and its NPC returns to the actor's initial state; `show-hint` emits
`hint-shown` and `hint-penalty-applied` (the level's `scorePenalty`, or `0` when
omitted). Every other row is one event per effect. An effect that legitimately
needs to say something to the player includes its own `message` effect alongside
the state-changing one.
`ScoreTracker` consumes
`topic-completed`, `hint-penalty-applied`, `room-entered`, `puzzle-solved` and
`quiz-ended`; `Session` consumes `lives-changed` and the win condition (§11).
Per-puzzle points are awarded by `ScoreTracker` from `puzzle-solved` using the
declared `Puzzle.score`, so no score-carrying effect kind exists;
`score-changed.total` remains owned and emitted by `ScoreTracker` (§6).

## 10. Scoring with many puzzles per topic

The settled rule is **per-puzzle scoring**: each solved puzzle awards its own
declared points, so one spec topic can be scored several times, up to a budget.

Content declares each room, puzzle and quiz `score` but never writes score
itself (P6). `ScoreTracker` awards from the achievement events for covered topics
with evidence; `topic-completed` records completion and awards nothing. Hints
default to zero penalty.

- `Puzzle.score`, `Quiz.score` (awarded on pass) and `RoomDefinition.score`
  (first visit) are content-declared integers, zero when not scoreable.
- `SpecTopic.maxScore` is the **budget** for that topic. Validation requires
  that the sum of the scores of all puzzles, quizzes and rooms mapped to a topic
  does not exceed it.
- `AreaProgress.maxScore` is the sum of `SpecTopic.maxScore` for topics mapped
  to that area through `SpecTopicCatalogue.getByAreaId`, refreshed at restore.
- `topic-completed` itself awards **no** points. It records completion for the
  win check and the score panel; points come from the achievement events.
- Only topics with `status === 'covered'` and non-empty `evidence` are
  scoreable. Unmapped or unevidenced achievements emit no score change.
- Idempotency is derived from existing state, so no new persisted field is
  needed: a room scores once (`visitedRooms`), a puzzle once (its phase is
  `solved` before `puzzle-solved` is emitted), a quiz once on the first
  observed false→true transition of `quiz-passed:<quizId>` (below), and a hint
  penalty is applied per `hint-penalty-applied` event.
- A quiz pass scores only when the tracker observes `quiz-passed:<quizId>`
  changing from not-true to true across the pass; a retry that re-sets an
  already-true flag scores nothing. The tracker keeps the flag values it last
  observed, seeded from the live state when it is created (and again after a
  load), so no new persisted field is needed. `quiz-ended` alone is not a score
  trigger on a later pass. A pass with no `set-flag` and the flag still false
  follows the direct-achievement path and scores once on that batch; content
  that can be retried must set the flag.

A `complete-topic` effect can create its `(worldId, areaId)` progress row when
none exists, through the shared `AreaProgress` lookup. The new row takes
`maxScore` from the live catalogue and `earnedScore` at zero; completion is
never lost to empty progress, and no unrelated row or duplicate pair changes.

`ScoreTracker` is still the sole writer of `AreaProgress.earnedScore`, and the
runtime total remains derived from those area totals.

## 11. Win check owner

The in-play check belongs to `Session.observe(events)`, called in phase 5 after
`ScoreTracker.observe(events)` so end events carry the final score. It uses the
injected `ContentBundle` and follows
[storage-schema.md §7](storage-schema.md#7-restore-time-derivation): every
`SpecTopic` with `covered` status and evidence must have its ID in some
`progress[].completedTopics`. On success it sets `status = 'won'` and emits
`game-won`; on `lives === 0` it sets `status = 'lost'` and emits `game-over`.

Two conditions must both hold:

1. **Topics.** Every covered topic with evidence is complete, as above.
2. **Quizzes.** Every quiz with at least one question has been passed. A pass is
   recorded by the `quiz-passed:<quizId>` flag, or by a `quiz-ended` event with
   `passed: true` in the same batch (the direct-achievement path for content that
   supplies the event without the flag). The batch clause matters because the
   flag is applied before phase 5 in the same turn; the flag alone cannot
   distinguish the first pass from a replay.

`Quiz.score` itself is still awarded once per quiz by `ScoreTracker` (§10).

`SaveManager.restore()` performs the same derivation against the live catalogue
but **never emits** an event when `status !== 'playing'`, so a reloaded end
state cannot announce victory twice.

## 12. Behavioural guarantees

- Boot shows the title screen; Continue is enabled only for a valid save. New
  Game enters the initial room with visible output and a score panel.
- A save survives reload; download produces a valid JSON file and importing it
  restores state. Importing a corrupt file shows an error and leaves the live
  save intact.
- `submit` dispatches known verbs, turns unknown input into a friendly message
  without throwing, increments the turn once per game command and does not
  advance it for meta actions.
- Door and container verbs set the documented flags; failed preconditions leave
  state unchanged.
- `formatEvent` emits no line for suppressed internal-state events and for
  `score-changed` without a positive `delta`; a real gain yields one friendly
  line with no room ID. Room and question formatting still include exits and
  numbered options.
- `ScoreTracker` accumulates per-puzzle awards on one topic, scores each
  achievement once, scores nothing for uncovered topics and keeps `total` equal
  to the area sum.
- `Session` runs the win check after scoring, and end states suppress further
  commands.
- `validateContent` rejects duplicate IDs, duplicate aliases, missing exit and
  level-start targets and over-budget topic scores.

Run `npm test`, `npm run test:e2e`, `npm run typecheck` and `npm run lint`; the
scripts are in `package.json`. `playwright.config.ts` sets `baseURL` to include
`/CompSciQuest/`.
