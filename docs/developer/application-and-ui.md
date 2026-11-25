# Application and UI contracts (design)

Status: planned · Last updated: 2026-11-25

Part of the CompSciQuest design set: [architecture](architecture.md) ·
[storage schema](storage-schema.md) · [shared rule spine](shared-rules.md) ·
[content rules](content-rules.md) · [NPCs](npcs.md) · [hazards](hazards.md) ·
[quiz combat](combat.md) · [puzzles](puzzles.md) · [hints](hints.md).

## 1. Purpose and authority

This document is the **canonical definition** of the application-layer and UI
contracts needed to build a content-agnostic skeleton: the content bundle, the
boot/title flow, the `Game` façade, the `Command` and `GameEvent` unions, the UI
view-model and DOM layout, and the behavioural signatures the other documents
name but do not pin down.

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

Boot sequence (`src/main.ts`, amends [architecture.md §6.1](architecture.md#61-bootstrap-srcmaints)):

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

**Consequence for tests:** the Playwright "boots into the initial room"
assertion becomes "boots to the title screen; clicking New Game enters the
initial room". See §12.

## 3. Content bundle and registration

### 3.1 Catalogue shape

All definitions are declarative data under `src/content/`, never hard-coded in
engine classes. `shared-rules.md §10` requires a catalogue per system; this is
the concrete shape.

```ts
// src/content/Catalogue.ts
export interface Catalogue<T> {
  readonly all: readonly T[]; // declaration order, never object-key order
  getById(id: string): T | undefined;
}
```

`all` exists because [shared-rules.md §11](shared-rules.md#11-determinism-and-ordering-rules)
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

The per-artifact interfaces (`ActorState`, `ConversationTopic`,
`ConversationNode`, `Quiz`, `QuizQuestion`, `Puzzle`, `Hazard`, `HintSequence`,
`SpecTopic`) are defined in the subsystem documents and are not redeclared
here. `WorldDefinition`, `AreaDefinition`, `RoomDefinition` and
`ItemDefinition` are defined in §3.2.

### 3.2 World, area, room and item definitions

```ts
// src/content/WorldDefinition.ts
export interface WorldDefinition {
  readonly id: string;
  readonly name: string;
  readonly areaIds: readonly string[];
  readonly startAreaId: string;
  readonly lives: number; // 3 in the stub and in all v1 content
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

`startRoomId` promotes the old `levelStart: true` authoring note into a real
runtime field. [content-rules.md](content-rules.md) D4 now lists it as the
exception to the authoring-only rule, and the §4.2 card example declares it on
the area artifact. Lives reset on **area change**, not on every room move.

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
means valid. It runs the five shared structural gates in
[content-rules.md §7](content-rules.md#7-structural-validation-gates) against the
bundle at boot, including:

- unique artifact IDs and globally unique object/NPC aliases;
- every exit target, `initialRoom`, `startRoomId` and `move-player` target exists;
- the start resolves through the world's `startAreaId` and that area's
  `startRoomId`, never by array position;
- topic IDs, puzzle dependencies and hazard/quiz/hint targets exist;
- per-topic score budgets hold (§10 of this document).

NPC actor binding is resolved: every authored topic and node carries an
`actorId` that resolves to one actor, and the authoring-time `npc-content` gate
enforces it ([content-rules.md §4.3 point 2](content-rules.md#43-npc-card),
[§8](content-rules.md#8-decisions-content-must-not-assume)). Its runtime mirror
is deferred with the other mechanics gates
([content-toolchain.md §4](content-toolchain.md#4-validation)). Authoring-only checks
(stray keys outside `authoring:`, document status, unresolved `todo` placeholders)
run in `npm run content:validate` on the YAML and cannot run on the runtime
bundle. Apart from authoring-only checks and the three deferred mechanics gates,
authoring-time, test-time and boot-time validation use the same gate functions
and cannot drift. Vitest runs `validateContent`
against small deterministic fixtures and against the real catalogues.

`GameState.createInitial()` takes its world, area, room and room inventory from
the supplied bundle instead of importing `stubBundle`; it resolves the area by
the world's `startAreaId` and the room by that area's `startRoomId`.
`Game.newGame()` calls it directly, so array position is never a substitute for
the authored start.

### 3.4 Stub fixture

The skeleton ships a clearly marked stub under `src/content/stub/` — one world,
one area and two rooms, with empty catalogues for the five later mechanics. It
exists only so the app boots and Playwright has a deterministic world. The stub
is data, not engine code, and carries a `// STUB — replace with authored content`
note.

When the first real area is generated, the stub's placeholder data and the direct
`stubBundle` import are removed: bundle assembly moves into
`src/content/index.ts`, which returns the committed generated content, and the
assembly seam is retained rather than deleted. Unit tests use a separate
deterministic fixture, not the generated zone content. See
[content-toolchain.md §5](content-toolchain.md#5-generation) for the generation
handoff.

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

`submit` owns the whole turn pipeline and returns the buffered batch it also
publishes through the `EventBus`. It increments `GameStateDto.turn` once per
submitted game command, whether or not the command succeeded. It never throws
on bad input; unparseable text becomes an `unknown` command and a friendly
message.

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
union and never advance `turn`. `import` from a button supplies `text` from
`SaveFile.readFile()`; typed `import` opens the same file picker rather than
expecting pasted JSON. `load` rebinds the restored `GameState` and refreshes the
views without re-emitting an end event.

## 5. Canonical command union and verbs

This is the single canonical `Command` union. It replaces the partial lists in
[architecture.md §7](architecture.md#7-core-interface-sketches),
[npcs.md §3](npcs.md#3-commands-and-topic-resolution),
[combat.md §4](combat.md#4-commands-and-events) and
[hints.md §3](hints.md#3-commands-and-delivery).

```ts
// src/core/commands/Command.ts
export type Command =
  // core (10)
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
  // NPCs (6)
  | { readonly kind: 'talk-to'; readonly actorId: string }
  | { readonly kind: 'ask'; readonly actorId: string; readonly topic: string }
  | { readonly kind: 'tell'; readonly actorId: string; readonly topic: string }
  | { readonly kind: 'give'; readonly actorId: string; readonly itemId: string }
  | { readonly kind: 'show'; readonly actorId: string; readonly itemId: string }
  | { readonly kind: 'bye' }
  // quiz combat (1), hints (1)
  | { readonly kind: 'answer'; readonly option: number }
  | { readonly kind: 'hint'; readonly targetId?: string };
```

(Names marked "core" above are the ten original variants plus the four new door
verbs; the label is a grouping aid, not part of the type.)

### 5.1 Door and container verbs

Doors and containers have dedicated verbs in v1 rather than relying solely on
`use`:

| Command                  | Meaning                                                     | Flag effect                                       |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------- |
| `open <target>`          | Open an unlocked door or container                          | `door-open:<id>` / `container-open:<id>` = `true` |
| `close <target>`         | Close an open door or container                             | the same flag = `false`                           |
| `unlock <item> <target>` | Use a key-like item; sets the action flag but does not open | `door-unlocked:<id>` = `true`                     |
| `put <item> <target>`    | Place a portable item into a container                      | `transfer-item` to the container owner            |

Each handler checks preconditions through `RuleEngine` (key held, target
visible, target not already open). An invalid attempt emits a friendly in-voice
message and leaves state unchanged. `use <item> on <target>` remains supported
as a general interaction, including puzzle solutions.

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
denial; the fallback wording is a user decision recorded in the branch matrix,
not a design-document citation. `drop` shares `takeHandler()` and is unaffected
by `portable`: it transfers from the player to the room and emits "Dropped.".

## 6. Canonical event union and rendering

This is the single canonical `GameEvent` union. It consolidates the seven
variants formerly in [architecture.md §7](architecture.md#7-core-interface-sketches)
and the thirteen subsystem variants formerly listed in
[shared-rules.md §9](shared-rules.md#9-event-additions), and adds the bookkeeping
events required by §9.

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
  // bookkeeping (added by §9)
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

`EventBus` is unchanged from [architecture.md §7](architecture.md#7-core-interface-sketches)
and [shared-rules.md §2](shared-rules.md#2-turn-pipeline-amends-architecturemd-62).

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

| Event(s)                                                                    | Transcript                                            | Panel update                 |
| --------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------- |
| `message`, `npc-spoke`, `topic-suggested`, `hint-shown`, `answer-evaluated` | text as given                                         | —                            |
| `room-entered`                                                              | title, blank line, description, `Exits: north, west`  | ScorePanel via view data     |
| `question-asked`                                                            | prompt, then `1. …` / `2. …` lines                    | QuizPanel                    |
| `score-changed`                                                             | short line using `reason`                             | ScorePanel via view data     |
| `topic-completed`                                                           | completion line derived from `topicId` via the bundle | ScorePanel via view data     |
| `lives-changed`, `hazard-triggered`                                         | terse in-voice line                                   | ScorePanel (lives)           |
| `conversation-started`, `conversation-ended`                                | short status line                                     | ConversationPanel            |
| `quiz-started`, `quiz-ended`                                                | short status line                                     | QuizPanel                    |
| `puzzle-activated`, `puzzle-solved`                                         | short status line                                     | ScorePanel via view data     |
| `game-over`, `game-won`                                                     | final message with score                              | TitleScreen offer to restart |
| bookkeeping events                                                          | terse line using bundle labels                        | —                            |

Every event yields at least one line, so the shared-rule promise that "every
effect produces at least one buffered event, so every state change is
explainable in the output log" holds. Submitted commands **are** echoed to the
transcript as `> <raw input>` before their resulting batch is rendered.

## 7. UI structure and view-model

### 7.1 DOM layout

The skeleton uses plain DOM and one stylesheet (`src/ui/style.css`); no UI
framework. "Browser window" is visual chrome, not a nested browsing context.

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

`Terminal` owns a bounded in-memory history (50 entries, no persistence, no
duplicate suppression) navigated with the up/down arrows. It calls
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
// described above (decision: 2026-11-25)
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

`EventBus`, `Random` and `EffectApplier.apply(effect): GameEvent[]` are already
pinned in the existing documents and are not restated as new contracts.

`TurnContext.command` carries the command being handled: `on-verb` matches
`command.kind === trigger.verb`, and `on-item-used` matches an `itemId` on the
command equal to `trigger.itemId`
([shared-rules.md §4](shared-rules.md#4-trigger)). `Command` is the single
canonical union in §5. This carrier was added by user decision on 2026-11-25.

`Game` builds a single `TurnContext` per turn (including the resolved `Command`)
and passes it to `createComposedReaction`'s reaction; phase-4 systems read state
and command from that context rather than constructing their own (decision:
2026-11-25).

The phase-4 contract is uniform by the same decision: `Scheduler`,
`HazardSystem`, `DialogueSystem`, `PuzzleSystem` and `HintSystem` each apply
their effects through their injected `EffectApplier` and return
`readonly GameEvent[]`. `createComposedReaction` calls them in the order
scheduler → hazards → npcs → puzzles → hints and concatenates the returned
events; it has no effect buffer and applies no effects itself. `Game` still owns
the per-turn event buffer and the single publication at the end of the turn
([shared-rules.md §2](shared-rules.md#2-turn-pipeline-amends-architecturemd-62)).
Phase 3 handlers continue to **return** `Effect[]` (§5.2).

`SpecTopicCatalogue` is canonical here (the sketch in `architecture.md` now
links to this section). Its `getByAreaId` lookup is what restore and the
ScorePanel need:

```ts
export interface SpecTopicCatalogue {
  getById(id: string): SpecTopic | undefined;
  getByRoomId(roomId: string): readonly SpecTopic[];
  getByAreaId(worldId: string, areaId: string): readonly SpecTopic[];
}
```

`SpecTopic` therefore also carries `worldId` and `areaId` (or the catalogue
maintains that index internally). `getByAreaId` is what
[storage-schema.md §7](storage-schema.md#7-restore-time-derivation) needs to
refresh `AreaProgress.maxScore`.

## 9. Effect to event mapping

[shared-rules.md §5](shared-rules.md#5-effect-and-effectapplier) promises one
buffered event per effect. The complete mapping is:

| Effect                                       | Event                 |
| -------------------------------------------- | --------------------- |
| `set-flag`                                   | `flag-changed`        |
| `message`                                    | `message`             |
| `change-lives`                               | `lives-changed`       |
| `complete-topic`                             | `topic-completed`     |
| `grant-item`, `remove-item`, `transfer-item` | `item-moved`          |
| `move-player`                                | `room-entered`        |
| `set-actor-state`                            | `actor-state-changed` |
| `learn-topic`                                | `knowledge-gained`    |
| `enter-node`                                 | `node-entered`        |
| `exit-node`                                  | `node-exited`         |
| `set-puzzle-active`                          | `puzzle-activated`    |
| `set-puzzle-solved`                          | `puzzle-solved`       |
| `schedule`                                   | `scheduled`           |
| `start-quiz`                                 | `quiz-started`        |
| `show-hint`                                  | `hint-shown`          |
| `announce-hazard`                            | `hazard-triggered`    |

An effect that legitimately needs to say something to the player includes its
own `message` effect alongside the state-changing one. `ScoreTracker` consumes
`topic-completed`, `hint-penalty-applied`, `room-entered`, `puzzle-solved` and
`quiz-ended`; `Session` consumes `lives-changed` and the win condition (§11).
Per-puzzle points are awarded by `ScoreTracker` from `puzzle-solved` using the
declared `Puzzle.score`, so no score-carrying effect kind exists;
`score-changed.total` remains owned and emitted by `ScoreTracker` (§6). The
`announce-hazard` row was added by user decision on 2026-11-25.

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
  `solved` before `puzzle-solved` is emitted), a quiz once
  (`quiz-passed:<quizId>`), and a hint penalty is applied per
  `hint-penalty-applied` event.

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

`SaveManager.restore()` performs the same derivation against the live catalogue
but **never emits** an event when `status !== 'playing'`, so a reloaded end
state cannot announce victory twice.

## 12. Tests for the skeleton

**Vitest**

- `validateContent`: accepts the stub fixture; rejects duplicate IDs, duplicate
  aliases, missing exit/level-start targets and over-budget topic scores.
- `Game.submit`: known verbs dispatch, unknown input yields a friendly message
  and does not throw, turn increments once, meta actions do not advance it.
- Doors: `open`/`close`/`unlock`/`put` set the documented flags and leave state
  unchanged when preconditions fail.
- `formatEvent`: every event kind returns at least one line; room and question
  formatting include exits and numbered options.
- `ScoreTracker`: per-puzzle awards accumulate on one topic, each achievement
  scores once, uncovered topics score nothing, and `total` matches the area sum.
- `Session`: win check runs after scoring, end states suppress further commands.

**Playwright**

- Boots to the title screen; Continue is disabled with no save.
- New Game enters the initial room with visible output and a score panel.
- A save survives reload; with a valid save, boot shows an enabled Continue.
- Download produces a valid JSON file; importing it restores state.
- Importing a corrupt file shows an error and leaves the live save intact.

Run with `npm test`, `npm run test:e2e`, `npm run typecheck` and `npm run lint`.
`playwright.config.ts` must set `baseURL` to include `/CompSciQuest/`.

## 13. Decisions

| Topic                | Decision                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------- |
| Title screen         | v1 has one, as an overlay; Continue + New Game, Continue disabled without a valid save.     |
| UI layout            | Windowed panels: terminal and inline dialogue/quiz/hint panels, side score and save panels. |
| Save controls        | Buttons plus typed meta-action aliases, both intercepted by `Game` before core dispatch.    |
| Doors and containers | Dedicated `open`, `close`, `unlock` and `put` verbs; `use` still works for puzzles.         |
| Topic scoring        | Per puzzle: each achievement awards its own points within `SpecTopic.maxScore`.             |
| Empty content        | Ship a clearly marked one-area, two-room stub fixture for boot and e2e tests.               |
| Content registration | One `ContentBundle` of typed catalogues from `src/content/index.ts`, validated at boot.     |
| Start state          | Content declares `startAreaId`/`startRoomId`; lives reset on area change.                   |
| Command/event unions | Canonical in this document; other documents link here.                                      |
| UI data channel      | Events drive transcript and transient panels; `GameViewData` drives ScorePanel.             |
| Command history      | Bounded in-memory (50), no persistence, no duplicate suppression.                           |
| Setup docs           | `package.json` and `README.md` are authoritative for installed tooling.                     |
