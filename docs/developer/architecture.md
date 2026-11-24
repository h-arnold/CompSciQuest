# CompSciQuest architecture (first draft)

Status: draft · Last updated: 2026-11-24

This document describes how the game's **logic and mechanics** will be scaffolded and
structured. Game content (rooms, items, puzzles and the actual GCSE topics) is
deliberately out of scope; where content is involved, this document defines the
*contracts* it will eventually fill in, not the content itself.

## 1. Scope and goals

- Build a Zork-style text adventure as a **fully static site** on GitHub Pages.
  There is no runtime server and no server-side state.
- All game state lives in **browser storage** and must be exportable/importable as
  a single JSON file containing the complete save.
- Favour an **object-oriented** design in TypeScript, while keeping data (content)
  separate from behaviour (engine).
- Keep the core engine **DOM-free and deterministic** so it can be unit-tested
  without a browser.
- Define extension points for deferred features without building them yet, and
  be explicit about which features have a seam today and which do not.

## 2. Design principles

| Principle | What it means in practice |
| --- | --- |
| Static-first | No backend calls. `localStorage` is the live store; JSON files are the portable store. |
| OOP with strict TS | Classes for entities with identity and behaviour; plain interfaces/type aliases for data shapes. Composition over deep inheritance. |
| Separation of concerns | The engine never touches the DOM; the UI never owns game rules. They communicate through commands in and events out. |
| Data-driven content | Rooms, items and spec topics are declarative definitions consumed by the engine. No content is hard-coded into engine logic. |
| One source of truth | `GameState` is the only serialised game state and holds score and per-area progress. `ScoreTracker` is its sole writer for those fields. |
| Explicit persistence | Saves are versioned, validated on load, and migrated when the schema changes. |
| Testability | Dependencies (event bus, storage adapter, clock) are injected; no hidden globals in the core. |

## 3. Layers and dependency direction

```
  ┌──────────────────────────────────────────────────────────────┐
  │ Outermost adapters                                           │
  │ UI (src/ui) · Storage (src/storage)                          │
  │ Render events / send commands; implement StorageAdapter.     │
  ├──────────────────────────────────────────────────────────────┤
  │ Application services (src/application)                       │
  │ Game façade · turn pipeline · SaveManager · DTO · schema ·   │
  │ Clock                                                        │
  ├──────────────────────────────────────────────────────────────┤
  │ Core engine (src/core)                                       │
  │ GameState · Player · World · Room · items · commands · rules │
  │ · events · scoring · lifecycle. Pure TS: no DOM, no storage. │
  ├──────────────────────────────────────────────────────────────┤
  │ Content definitions (src/content, deferred)                  │
  └──────────────────────────────────────────────────────────────┘
```

**Dependency rule:** imports point downward. `src/core` imports nothing from
`application`, `ui`, `storage` or the DOM. `application` depends on `core`; the one
outward import allowed is a **type-only** import of the `StorageAdapter` interface
(a port) from `src/storage` — no implementation is imported. The real
`localStorage` implementation lives in `src/storage` and is injected at bootstrap.
The UI depends on `application`/`core`. The only upward channel from the engine is
the `EventBus` (event objects, not UI callbacks).

## 4. Proposed folder layout

```
src/
  main.ts                  # composition root: constructs and wires everything
  application/
    Game.ts                # façade + turn pipeline; owns GameState; delegates saving
    SaveManager.ts         # build/validate/migrate/restore SaveDto
    SaveDto.ts             # SaveDto envelope (version + savedAt) + runtime type guards
    schema.ts              # SCHEMA_VERSION (1) and migration steps
    Clock.ts               # injectable time source used for savedAt
  core/
    GameState.ts           # authoritative state + GameStateDto shape; createInitial()/fromDto()/toDto()
    Player.ts              # position, inventory, lives (score lives in GameState)
    World.ts               # worlds/areas/rooms registry; room lookup
    Room.ts                # room identity, description, exits, entry hooks
    Exit.ts                # directed connection + conditions (locked, hidden, gated)
    items/
      Item.ts              # base item: id, names/aliases, portable flag, behaviour hooks
      Container.ts         # holds other items
      Key.ts               # unlocks an Exit/Container
      Door.ts              # an Exit with open/closed/locked state
      Treasure.ts          # score-bearing item
    commands/
      Tokenizer.ts         # lowercase, strip punctuation, expand direction shortcuts
      Parser.ts            # tokens -> ParsedCommand; never throws
      ParsedCommand.ts     # intermediate: canonical verb + raw noun phrases + original input
      NameResolver.ts      # noun phrases -> object IDs; unresolved -> "unknown" command
      Command.ts           # Command discriminated union + handler signature
      verbs/               # one handler per verb (Command pattern)
    rules/
      Precondition.ts      # predicates for actions/exits (has item, flag set, door open…)
      RuleEngine.ts        # checks preconditions before a handler executes
    events/
      EventBus.ts          # publish/subscribe
      GameEvent.ts         # GameEvent union + RoomSummary
    scoring/
      ScoreTracker.ts      # sole writer of score and progress, driven by events
      WorldProgress.ts     # per-world/area visited rooms, score, completed topics
      SpecTopic.ts         # topic contract mirroring docs/coverage/COVERAGE.md
      SpecTopicCatalogue.ts # lookup of topic title/spec reference by topic or room ID
    lifecycle/
      Session.ts           # new game, restart, win, lose; lives == 0 -> game over
  content/                 # deferred: declarative room/item/topic definitions
    README.md              # placeholder describing the contracts to fill in
  ui/
    GameWindow.ts          # creates the browser window/layout and mounts the app
    Terminal.ts            # text navigation: input box, command history, prompt
    OutputLog.ts           # renders engine events as text (never raw HTML)
    ScorePanel.ts          # worlds/areas visited, score, mapped GCSE spec area
    SaveControls.ts        # save/load/download/import buttons
  storage/
    StorageAdapter.ts      # interface only (read/write/remove)
    BrowserStorage.ts      # localStorage implementation
    SaveFile.ts            # Blob download + File.text() import
  types/                   # shared domain types (Direction, Position, interfaces)
tests/                     # Vitest: engine, parser, scoring, save round-trips
e2e/                       # Playwright: browser flows, storage, JSON import/export
```

`tests` and `e2e` are already included by `tsconfig.json`; Vitest runs through
`vite.config.ts`. Playwright will need a root `playwright.config.ts` (testDir,
webServer and baseURL) when e2e work starts. **TypeScript linting is not yet
configured**: `eslint.config.js` currently has JS-only patterns and no TS parser,
so adding `**/*.ts` patterns plus a TS parser (e.g. `typescript-eslint`) is a
prerequisite before `npm run lint` covers game code. `vite.config.ts` already sets
`base: '/CompSciQuest/'` for GitHub Pages; the bootstrap must not assume it is
served from the domain root.

## 5. Class responsibilities

### Core

| Class / module | Responsibility | Key state | Collaborators |
| --- | --- | --- | --- |
| `GameState` | Canonical serialisable snapshot; factories `createInitial()` / `fromDto()`; `toDto()` returns the state shape only | player, world flags, **score**, progress, turn count | `Player`, `WorldProgress` |
| `Player` | The player character's mutable state | position, inventory, lives | `Item`, `Room` |
| `World` | Registry/lookup for worlds, areas and rooms; validates exits | room map | `Room`, `Exit` |
| `Room` | A location: description, exits, special entry behaviour | id, title, exits | `Exit`, `Player` |
| `Exit` | A directed connection with conditions for traversing it | target, conditions | `Precondition` |
| `Item` (+ subclasses) | Portable objects and their interactions | id, aliases, flags, state | `Player`, `RuleEngine` |
| `Tokenizer` / `Parser` | Turn text into a `ParsedCommand` (verb + raw noun phrases); verb aliases and direction shortcuts | verb/alias tables | `ParsedCommand` |
| `NameResolver` | Resolve `ParsedCommand` noun phrases to object IDs and produce a `Command`; unresolved nouns produce `unknown` | visibility rules | `Item`, `Room`, `Player`, `ParsedCommand` |
| `RuleEngine` | Central preconditions ("has key?", "door open?") | none | `Precondition`, verb handlers |
| `EventBus` | Decouples engine from UI | listener set | `GameEvent` |
| `ScoreTracker` | Sole writer of score/progress, driven by events | visited sets (within `WorldProgress`) | `GameState`, `SpecTopic` |
| `SpecTopicCatalogue` | Look up topic title/spec reference for UI labels | topic index | `SpecTopic` |
| `Session` | New game/restart/win/lose; handles `lives == 0` | session status | `GameState`, `EventBus` |

### Application services

| Class / module | Responsibility | Collaborators |
| --- | --- | --- |
| `Game` | Façade and turn pipeline: `submit(input)`; exposes save/load that delegate to `SaveManager` (they never enter core dispatch) | `Tokenizer`, `Parser`, `NameResolver`, verb handlers, `RuleEngine`, `ScoreTracker`, `EventBus`, `SaveManager` |
| `SaveManager` | Assemble `SaveDto` from `GameState.toDto()` with version/`savedAt`, then validate, migrate and restore; catches parse errors | `GameState`, `StorageAdapter`, `Clock`, `schema` |
| `Clock` | Injectable `now()` used for `savedAt` | — |
| `schema` | `SCHEMA_VERSION` and migration steps | `SaveDto` |

### Persistence and UI

| Class / module | Responsibility |
| --- | --- |
| `StorageAdapter` / `BrowserStorage` | Abstract and implement `localStorage` access; the seam used by tests. |
| `SaveFile` | Download a save as a `.json` file and read an imported `File` as text. |
| `GameWindow` | Create the page shell, mount child views, own the overall layout. |
| `Terminal` | Command input, prompt, submit handling and up-arrow command history. |
| `OutputLog` | Append event text safely (`textContent`, never `innerHTML`). |
| `ScorePanel` | Render visited worlds/areas, scores and the linked GCSE spec area, using `SpecTopicCatalogue` for labels. |
| `SaveControls` | Save/load/download/import buttons and user-facing error messages. |

## 6. Key flows

### 6.1 Bootstrap (`src/main.ts`)

1. Find `#app` (already present in `index.html`) or throw a clear error.
2. Construct the clock, storage adapter, `SaveManager`, event bus, `GameState`,
   core services and `Game`.
3. If a valid save exists in storage, restore it; otherwise start a new session.
4. Construct `GameWindow` with `Terminal`, `OutputLog`, `ScorePanel` and
   `SaveControls`, subscribing them to the event bus.
5. Emit an initial room description so the player is never staring at a blank
   screen.

### 6.2 One command turn

```
raw input
  → Tokenizer (lowercase, punctuation, direction shortcuts)
  → Parser (verb + raw noun phrases -> ParsedCommand; unknown input -> `unknown`)
  → NameResolver (noun phrases -> object IDs via room + inventory + aliases;
                  unresolved noun -> `unknown` command carrying the original input)
  → dispatch the resulting Command to a verb handler
  → RuleEngine checks preconditions
  → handler mutates GameState and returns outcome events
  → EventBus publishes events
  → ScoreTracker observes score/progress events and writes GameState.score / WorldProgress
  → UI re-renders from the resulting state and events
```

Handlers do **not** write score directly; they emit events, and `ScoreTracker` is
the only code that writes `GameState.score` and `WorldProgress`. The parser must
never throw on bad input: unknown verbs, and nouns that `NameResolver` cannot
match to a visible object, both become an `unknown` command whose handler emits a
friendly "I don't understand that" message. Meta actions (save, load,
download, import, restart) are intercepted by `Game`/`SaveControls` *before* core
dispatch and are not part of the core `Command` union; they do not advance the
turn. The turn counter increments once per submitted game command, whether or not
it succeeded.

### 6.3 Room entry, score and spec-topic mapping

1. A successful `go` command resolves the `Exit`, checks its conditions, and
   moves `Player.position`.
2. Room entry emits `room-entered` with a `RoomSummary`.
3. `ScoreTracker` marks the room visited in `WorldProgress`, awards any room
   score, and records topic progress. Following `COVERAGE.md`, only topics whose
   status is `covered` **and** which have evidence are scoreable; unmapped topics
   may be shown as "not mapped yet" but award no points.
4. `ScorePanel` re-renders worlds/areas visited, score achieved and the spec area.
   It uses `SpecTopicCatalogue` to turn topic IDs into titles/spec references and
   never computes scores itself.

Deferred puzzle/quest completion will hook into the same `topic-completed`
event, so the score panel needs no redesign when puzzles arrive.

### 6.4 Save, load, download and import

```
GameState.toDto() → GameStateDto (state shape only)
  → SaveManager.buildDto(): add SCHEMA_VERSION + savedAt from Clock → SaveDto → JSON.stringify
     ├→ StorageAdapter.write(SAVE_KEY, json)       (live save)
     └→ SaveFile.download(json)                    (downloadable file)

import: File.text() → JSON.parse → validate version + shape → migrate if needed
        → SaveManager restores a new GameState → UI refreshed
```

- `JSON.parse` and validation errors are caught and shown as readable messages;
  a bad file must never partially overwrite the live save.
- Unknown or newer schema versions are rejected with an explicit message rather
  than being force-loaded.
- Imported text is only ever treated as data: the UI renders it via
  `textContent`, so a malicious save cannot inject HTML.
- The initial schema version is `1`; the migration policy for later versions is
  still open (§11).

### 6.5 Losing a life and winning

Something will eventually cause damage (hazards/combat are deferred), but the
mechanisms are in place now: a handler emits `lives-changed`; `Session` detects
`lives == 0` and emits `game-over` with the final score. When the (still undefined)
win condition is met, a handler emits `game-won`, also carrying the final score.
Both end states are exited through `Session.newGame()`, which restores
`GameState.createInitial()`.

## 7. Core interface sketches

These are contracts, not final implementations. They are written to be valid
under the repo's strict TypeScript settings.

```ts
// src/types/domain.ts
export type Direction =
  | 'north' | 'south' | 'east' | 'west'
  | 'up' | 'down' | 'in' | 'out';

export interface Position {
  readonly worldId: string;
  readonly areaId: string;
  readonly roomId: string;
}

export interface GameObject {
  readonly id: string;
  readonly name: string;
  readonly aliases: readonly string[];
  describe(): string;
}

export interface Serialisable<TDto> {
  toDto(): TDto;
}
// Restoration is a factory concern: GameState.createInitial() / GameState.fromDto(dto)
```

```ts
// src/core/commands/ParsedCommand.ts — between Parser and NameResolver
export interface ParsedCommand {
  readonly verb: string;                   // canonical verb, e.g. 'take'
  readonly nounPhrases: readonly string[]; // raw words, e.g. ['brass key']
  readonly raw: string;                    // original input for friendly errors
}
```

```ts
// src/core/commands/Command.ts — output of NameResolver, input to dispatch.
// Optional fields are OMITTED when absent, never assigned `undefined`
// (exactOptionalPropertyTypes). Save/load and other meta actions are
// application-level and deliberately absent from this union.
export type Command =
  | { readonly kind: 'go'; readonly direction: Direction }
  | { readonly kind: 'take'; readonly itemId: string }
  | { readonly kind: 'drop'; readonly itemId: string }
  | { readonly kind: 'use'; readonly itemId: string; readonly targetId?: string }
  | { readonly kind: 'examine'; readonly targetId: string }
  | { readonly kind: 'look' }
  | { readonly kind: 'inventory' }
  | { readonly kind: 'score' }
  | { readonly kind: 'help' }
  | { readonly kind: 'unknown'; readonly raw: string };
```

```ts
// src/core/events/GameEvent.ts
export interface RoomSummary {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly exits: readonly Direction[];
}

export type GameEvent =
  | { readonly type: 'message'; readonly text: string }
  | { readonly type: 'room-entered'; readonly room: RoomSummary }
  | { readonly type: 'score-changed'; readonly delta: number; readonly total: number; readonly reason: string }
  | { readonly type: 'topic-completed'; readonly topicId: string }
  | { readonly type: 'lives-changed'; readonly lives: number }
  | { readonly type: 'game-over'; readonly reason: string; readonly finalScore: number }
  | { readonly type: 'game-won'; readonly finalScore: number };

export interface EventBus {
  publish(event: GameEvent): void;
  subscribe(listener: (event: GameEvent) => void): () => void;
}
```

```ts
// src/core/scoring/SpecTopic.ts — mirrors docs/coverage/COVERAGE.md
export type SpecStatus = 'not started' | 'in progress' | 'covered';

export interface SpecTopic {
  readonly id: string;             // topic name from "## Topic: <name>"
  readonly title: string;
  readonly specReference: string;  // PDF section/page
  readonly codeLocation: string;   // path::symbol; empty when not mapped
  readonly status: SpecStatus;
  readonly evidence: string;       // empty when not mapped yet
  readonly roomIds: readonly string[]; // a topic may span several rooms
  readonly maxScore: number;
}

export interface SpecTopicCatalogue {
  getById(id: string): SpecTopic | undefined;
  getByRoomId(roomId: string): readonly SpecTopic[];
}

export interface AreaProgress {
  readonly worldId: string;
  readonly areaId: string;
  readonly visitedRooms: readonly string[];
  readonly completedTopics: readonly string[];
  readonly earnedScore: number;
  readonly maxScore: number;
}
```

```ts
// src/core/GameState.ts — pure state shape: no version, no timestamp.
import type { Position } from '../types/domain';
import type { AreaProgress } from './scoring/SpecTopic';

export interface GameStateDto {
  readonly player: {
    readonly position: Position;
    readonly inventory: readonly string[];
    readonly lives: number;
  };
  readonly flags: Readonly<Record<string, boolean>>;
  readonly score: number;
  readonly progress: readonly AreaProgress[];
  readonly turn: number;
}

// GameState implements Serialisable<GameStateDto>: createInitial(), fromDto(dto),
// toDto(). SaveManager owns the envelope below.
```

```ts
// src/application/SaveDto.ts — StorageAdapter is declared only in
// src/storage/StorageAdapter.ts; Clock only in src/application/Clock.ts.
import type { GameStateDto } from '../core/GameState';

export interface SaveDto {
  readonly version: 1;
  readonly savedAt: string; // ISO 8601, from Clock
  readonly state: GameStateDto;
}
```

## 8. Conventions

- **One primary export per file**, file named after it (one class per file for
  entities; small related types may share a `types` module).
- **Composition over deep inheritance.** `Item` subclasses override small
  behaviour hooks; verb handlers orchestrate multi-item interactions rather
  than encoding them in deep class trees.
- **Mark overrides** with `override` (`noImplicitOverride`) and give exported
  APIs explicit return types.
- **`erasableSyntaxOnly`**: no enums, parameter properties or namespaces. Use
  string-literal unions (`Command`, `GameEvent`), explicit field declarations
  and ordinary modules. Abstract classes are fine.
- **`verbatimModuleSyntax`**: use `import type` / `export type` for type-only
  imports and exports.
- **`exactOptionalPropertyTypes`**: omit optional properties rather than
  assigning `undefined`.
- **`noUncheckedIndexedAccess` / `noPropertyAccessFromIndexSignature`**: guard
  lookups into maps and arrays (e.g. `rooms.get(id)` returning `undefined`),
  and use bracket notation for index signatures.
- Other strict flags to respect: `strict`, `useDefineForClassFields`,
  `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUnusedLocals` and
  `noUnusedParameters`.
- **Linting:** the current ESLint config covers JavaScript only; TypeScript
  support must be added before `npm run lint` is meaningful for game code. Keep
  methods short and avoid duplicated blocks to stay compatible with the
  `sonarjs` rules already configured.
- No DOM APIs, `localStorage`, `fetch`, `Blob` or `URL` inside `src/core`.
- All user-visible text is rendered as text nodes; never build HTML from game
  data or imported saves.

## 9. Testing strategy

**Vitest (`tests/`) — engine logic**

- Tokenizer/parser: verb synonyms, direction shortcuts (`N` → `go north`),
  punctuation, unknown input.
- NameResolver: visible objects (room vs inventory), alias matches, ambiguous and
  unknown nouns.
- Preconditions and verb handlers: blocked actions emit the right messages and
  leave state unchanged.
- ScoreTracker: room visits, score totals, topic completion mapping, per-area
  progress, and that only `covered` topics with evidence score points.
- Save DTO: round-trip `GameState → DTO → JSON → DTO → GameState`; rejection of
  malformed, unknown-version and newer-version saves; migrations.
- Lives: decrement, zero → `game-over`, restart resets state.
- Win: `game-won` carries the final score and restart resets state.

**Playwright (`e2e/`) — browser flows**

- App boots into the initial room with visible output.
- Typing a command produces output and updates the score panel.
- A save survives a page reload (`localStorage`).
- Download produces a valid JSON file; importing it restores state.
- Importing a corrupt file shows an error and leaves the live save intact.

Run these with `npm test` (or `npm run test:watch`), `npm run test:e2e`, plus
`npm run typecheck` and `npm run lint`. Add `playwright.config.ts` with the e2e
suite.

**Testability rules:** inject `EventBus`, `StorageAdapter` and `Clock`; use
in-memory fakes and a fake clock rather than touching real `localStorage` or the
system clock in unit tests; keep content fixtures small and deterministic.

## 10. Deferred / out of scope

Content of any kind; NPCs and dialogue; combat, traps and other sources of life
loss; the puzzle/quest and hint systems; light/dark and time-of-day mechanics;
multiple save slots, autosave and undo; localisation; audio; mobile-specific
layouts; leaderboards and multiplayer.

Seams that exist today: hazards can emit `lives-changed` → `Session` game-over;
puzzles can emit `topic-completed`; conditional exits use `Precondition`.
NPCs, undo, save slots and localisation have **no** hook yet and will need design
work when they are introduced (for example a slot-key strategy, text IDs and
dialogue events). Light/dark has no `LightSource` or "room lit?" precondition
until that mechanic is brought in.

## 11. Open questions and decision log

**Decided**

- Full architecture document (this file) rather than a mechanics-only sketch.
- Versioned JSON saves in `localStorage`, with import/export of the full JSON
  file and validation on load. The initial schema version is `1`.
- NPCs, combat/hazards and puzzles explicitly deferred, with extension points
  documented where they exist.
- Classic verb + noun parser with aliases and direction shortcuts; input that
  cannot be parsed gets a friendly error, not a crash. `Parser` produces a
  `ParsedCommand` (verb + raw noun phrases) and `NameResolver` turns that into a
  `Command` by resolving nouns to object IDs.
- `GameState.score` and `WorldProgress` are canonical; `ScoreTracker` is their
  sole writer.
- Save/load/download/import are application-level actions intercepted before
  core command dispatch, not core commands.

**Still to decide**

- Migration policy for versions after v1.
- Exact scoring formula: points per room, per topic, and per-area maximums.
- Final verb list, alias table, and noun-resolution ambiguity policy.
- The win condition rule (and whether `game-won` is ever emitted).
- Whether to offer undo, autosave and/or multiple save slots.
- Maximum starting lives and how they are replenished.
- How topic↔room relationships should be represented: `COVERAGE.md` uses
  `## Topic: <name>` with a "Game content / room ID" field and a room index that
  can list several topics per room; the proposed contract uses
  `SpecTopic.roomIds` plus `status`/`evidence`.
- File/module naming once the TypeScript ESLint setup is in place.
- Save-key name and whether a corrupt live save should be quarantined or
  discarded on boot.

This is a first draft: as implementation begins, update the decisions above and
keep the class/flow sections in sync with the code.
