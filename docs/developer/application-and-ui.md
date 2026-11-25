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
quarantined text stays downloadable through `SaveControls`.

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
  readonly lives: number; // declared reset value; the runtime does not apply it
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

// src/content/ItemDefinition.ts
export interface ItemDefinition {
  readonly id: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly portable: boolean;
  readonly refusalText?: string; // in-world take refusal for a non-portable item; omit when absent (§5.2)
  readonly description: string;
  readonly initialRoom: string; // starting owner; ownership lives in state
}
```

`startRoomId` is the runtime level start for hazards and quiz-failure teleports;
[content-rules.md](content-rules.md) D4 owns the authoring rule for `startRoomId`
and `lives`. `WorldDefinition.lives` sets the starting lives at new game.
`AreaDefinition.lives` is the declared reset value, and the current runtime does
not apply it: lives change only through `change-lives`.

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
means valid. At boot it runs the runtime-mirrored gates from
[content-rules.md §7](content-rules.md#7-structural-validation-gates) against the
bundle, including:

- unique artefact IDs and globally unique object/NPC aliases;
- every exit target, `initialRoom`, `startRoomId` and `move-player` target exists;
- the start resolves through the world's `startAreaId` and that area's
  `startRoomId`, never by array position;
- topic IDs, puzzle dependencies and hazard/quiz/hint targets exist;
- per-topic score budgets hold (§10 of this document).

NPC actor binding is resolved: every authored topic and node carries an
`actorId` that resolves to one actor, and the authoring-time `npc-content` gate
enforces it ([content-rules.md §4.3 "Actor binding"](content-rules.md#43-npc-card),
[§8](content-rules.md#8-fixed-contracts-content-must-use)). Its runtime mirror
is deferred with the other mechanics gates — `quiz-content`, `hint-content` and
`npc-content` ([content-toolchain.md §4](content-toolchain.md#4-validation)).
Authoring-only checks (stray keys outside `authoring:`, document status,
unresolved `todo` placeholders) run in `npm run content:validate` on the YAML and
cannot run on the runtime bundle. Apart from those, authoring-time, test-time and
boot-time validation use the same gate functions and cannot drift.

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

`newGame`, `continueGame` and `restart` replace the current `GameState`, clear
the views' transient state and emit the initial room batch. A reloaded end state
does not re-emit `game-won` or `game-over` ([storage-schema.md §7](storage-schema.md#7-restore-time-derivation)).

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
union and never advance `turn`. `openSaveFile` is injected from `src/main.ts`;
`GameWindow` owns the download and import controls, and import from a button
supplies `text` from `openSaveFile`. Typed `import` opens the same file picker
rather than expecting pasted JSON. `load` rebinds the restored `GameState` and
refreshes the views without re-emitting an end event.

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
  | { readonly kind: 'bye' }
  // quiz combat
  | { readonly kind: 'answer'; readonly option: number }
  // hints
  | { readonly kind: 'hint'; readonly targetId?: string };
```

### 5.1 Door and container verbs

Doors and containers have dedicated verbs in v1 rather than relying solely on
`use`:

| Command                  | Meaning                                                     | Flag effect                                                       |
| ------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `open <target>`          | Open an unlocked door or container                          | `door-open:<itemId>` / `container-open:<itemId>` = `true`         |
| `close <target>`         | Close an open door or container                             | the same flag = `false`                                           |
| `unlock <item> <target>` | Use a key-like item; sets the action flag but does not open | `door-unlocked:<itemId>` / `container-unlocked:<itemId>` = `true` |
| `put <item> <target>`    | Place a portable item into a container                      | `transfer-item` to the container owner                            |

The `flags` convention and the one-owner-per-item rule are owned by
[storage-schema.md §3.3](storage-schema.md#33-invariants). Each handler checks
preconditions through `RuleEngine` (key held, target visible, target not already
open). An invalid attempt emits a friendly in-voice message and leaves state
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
| `unlock`        | —                                                                                  |
| `put`           | —                                                                                  |
| `look`          | —                                                                                  |
| `inventory`     | `i`, `inv`                                                                         |
| `score`         | —                                                                                  |
| `help`          | `?`                                                                                |
| `talk-to`       | `talk`                                                                             |
| `ask` / `tell`  | —                                                                                  |
| `give` / `show` | —                                                                                  |
| `bye`           | `goodbye`                                                                          |
| `answer`        | —                                                                                  |
| `hint`          | —                                                                                  |

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

`take` transfers a visible portable item to the player and emits "Taken.". A
visible item whose `portable` is `false` is never transferred: it stays in the
room and remains examinable, and the handler emits exactly one `message` effect
using the item's `refusalText` when present and non-empty, otherwise the exact
fallback "You cannot take that item with you." An empty `refusalText` is treated
as absent. This is in-world feedback under
[content-rules.md §3 N5](content-rules.md#3-rule-catalogue), not a parser-style
denial. `drop` shares `takeHandler()` and is unaffected
by `portable`: it transfers from the player to the room and emits "Dropped.".

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

| Event(s)                                                                    | Transcript                                                                            | Panel update                 |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------- |
| `message`, `npc-spoke`, `topic-suggested`, `hint-shown`, `answer-evaluated` | text as given                                                                         | —                            |
| `room-entered`                                                              | title, blank line, description, `Exits: north, west`                                  | ScorePanel via view data     |
| `question-asked`                                                            | prompt, then `1. …` / `2. …` lines                                                    | QuizPanel                    |
| `score-changed`                                                             | short line using `reason`                                                             | ScorePanel via view data     |
| `topic-completed`                                                           | completion line derived from `topicId` via the bundle                                 | ScorePanel via view data     |
| `lives-changed`, `hazard-triggered`                                         | terse in-voice line                                                                   | ScorePanel (lives)           |
| `conversation-started`, `conversation-ended`                                | short status line                                                                     | ConversationPanel            |
| `quiz-started`, `quiz-ended`                                                | short status line                                                                     | QuizPanel                    |
| `puzzle-activated`, `puzzle-solved`                                         | short status line                                                                     | ScorePanel via view data     |
| `game-over`, `game-won`                                                     | final message with score                                                              | TitleScreen offer to restart |
| bookkeeping events                                                          | terse line; item, actor and topic IDs resolve through the bundle, other IDs print raw | —                            |

Every event yields at least one line, so the shared-rule promise that "every
effect produces at least one buffered event, so every state change is
explainable in the output log" holds. Submitted commands **are** echoed to the
transcript as `> <raw input>` before their resulting batch is rendered.

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
   │     └─ SaveControls           (Save, Load, Download, Import, Restart,
   │                                Download quarantined save)
   └─ .title-overlay               (TitleScreen: Continue / New Game)
```

Panels are mounted once at bootstrap and toggled from the view model or event
stream; they are never destroyed and recreated mid-turn. `index.html` keeps
only `#app`; all markup is created by `GameWindow` and its children.

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
linked spec topics using `SpecTopicCatalogue` labels.

`Terminal` owns a bounded in-memory command history with no persistence and no
duplicate suppression, navigated with the up/down arrows. It calls
`Game.submit(raw)` on Enter and renders the returned batch after echoing the
command. During a quiz, `answer N` is typed into the same input; `QuizPanel`
only displays the question and options.

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

`start-quiz` emits `quiz-started` and the first `question-asked`; `end-quiz`
emits `quiz-ended`, plus `actor-state-changed` when the quiz names a known
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
- `formatEvent` returns at least one line for every event; room and question
  formatting include exits and numbered options.
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
