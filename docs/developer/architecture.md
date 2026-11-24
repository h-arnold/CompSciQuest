# CompSciQuest architecture (first draft)

Status: draft · Last updated: 2026-11-24

This document describes how the game's **logic and mechanics** will be scaffolded and
structured. Game content (rooms, items, puzzles and the actual GCSE topics) is
deliberately out of scope; where content is involved, this document defines the
_contracts_ it will eventually fill in, not the content itself.

## 1. Scope and goals

- Build a Zork-style text adventure as a **fully static site** on GitHub Pages.
  There is no runtime server and no server-side state.
- All game state lives in **browser storage** and must be exportable/importable as
  a single JSON file containing the complete save.
- Favour an **object-oriented** design in TypeScript, while keeping data (content)
  separate from behaviour (engine).
- Keep the core engine **DOM-free and deterministic** so it can be unit-tested
  without a browser.
- Define contracts and extension points for planned systems without building
  them yet, and be explicit about which features have a seam today and which do not.

## 2. Design principles

| Principle              | What it means in practice                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static-first           | No backend calls. `localStorage` is the live store; JSON files are the portable store.                                                                                                                                    |
| OOP with strict TS     | Classes for entities with identity and behaviour; plain interfaces/type aliases for data shapes. Composition over deep inheritance.                                                                                       |
| Separation of concerns | The engine never touches the DOM; the UI never owns game rules. They communicate through commands in and events out.                                                                                                      |
| Data-driven content    | Rooms, items and spec topics are declarative definitions consumed by the engine. No content is hard-coded into engine logic.                                                                                              |
| One source of truth    | The persisted shape is defined in [storage-schema.md](storage-schema.md); `GameState` is its runtime counterpart. Score is derived from per-area progress at restore; `ScoreTracker` is the sole writer of `earnedScore`. |
| Explicit persistence   | Saves are versioned (`SCHEMA_VERSION = 1`) and validated on load; no migration is implemented yet.                                                                                                                        |
| Testability            | Dependencies (event bus, storage adapter, clock) are injected; no hidden globals in the core.                                                                                                                             |

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
  │ Content definitions (src/content, planned)                   │
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
    GameViewData.ts        # read-only view-model for the UI panels
    MetaAction.ts          # save/load/download/import/restart union
    SaveManager.ts         # build/validate/restore SaveDto (no migration yet)
    SaveDto.ts             # SaveDto envelope (version + savedAt) + runtime type guards
    schema.ts              # SCHEMA_VERSION (1); migration intentionally absent
    Clock.ts               # injectable time source used for savedAt
  core/
    GameState.ts           # authoritative state + GameStateDto shape; createInitial()/fromDto()/toDto()
    Player.ts              # position, inventory, lives (total score derived at restore)
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
      Command.ts           # canonical Command union (application-and-ui.md §5)
      CommandHandler.ts    # handler signature: (command, context) => Effect[]
      verbs/               # one handler per verb (Command pattern)
    rules/
      Precondition.ts      # predicates for actions/exits (has item, flag set, door open…)
      Condition.ts         # shared condition union (superset of Precondition)
      ConditionEvaluator.ts # pure condition evaluation
      Trigger.ts           # when a rule is checked
      RuleEngine.ts        # checks preconditions before a handler executes
    effects/
      Effect.ts            # shared effect union
      EffectApplier.ts     # sole mutator for effect-driven fields
    scheduling/
      ScheduledEvent.ts    # fuse/daemon definition
      Scheduler.ts         # turn-clock ticking, serialisable
    npcs/                  # DialogueSystem; see docs/developer/npcs.md
    hazards/               # HazardSystem; see docs/developer/hazards.md
    combat/                # QuizSystem; see docs/developer/combat.md
    puzzles/               # PuzzleSystem; see docs/developer/puzzles.md
    hints/                 # HintSystem; see docs/developer/hints.md
    events/
      EventBus.ts          # publish/subscribe
      GameEvent.ts         # canonical GameEvent union + RoomSummary (application-and-ui.md §6)
    scoring/
      ScoreTracker.ts      # sole writer of area progress/earnedScore; total derived
      WorldProgress.ts     # per-world/area visited rooms, score, completed topics
      SpecTopic.ts         # topic contract mirroring docs/coverage/COVERAGE.md
      SpecTopicCatalogue.ts # lookup of topic title/spec reference by topic or room ID
    lifecycle/
      Session.ts           # new game, restart, win, lose; lives == 0 -> game over
  content/                 # declarative definitions for all game content
    index.ts               # loadContent(): ContentBundle from typed catalogues
    validateContent.ts     # boot-time structural validation gates
    authored/              # generated TypeScript from validated YAML (committed)
    stub/                  # temporary one-area, two-room fixture (replaced by generated content)
    README.md              # describes the contracts to fill in
  ui/
    GameWindow.ts          # creates the browser window/layout and mounts the app
    TitleScreen.ts         # Continue / New Game overlay shown at boot
    Terminal.ts            # text navigation: input box, command history, prompt
    OutputLog.ts           # renders engine events as text (never raw HTML)
    formatEvent.ts         # pure GameEvent -> transcript lines
    ScorePanel.ts          # worlds/areas visited, score, mapped GCSE spec area
    ConversationPanel.ts   # NPC dialogue and suggested topics (npcs.md)
    QuizPanel.ts           # question + numbered options as text (combat.md)
    HintPanel.ts           # escalating hint text (hints.md)
    SaveControls.ts        # save/load/download/import buttons
    style.css              # plain CSS for the browser-window chrome and panels
  storage/
    StorageAdapter.ts      # interface only (read/write/remove)
    BrowserStorage.ts      # localStorage implementation
    SaveFile.ts            # Blob download + File.text() import
  types/                   # shared domain types (Direction, Position, interfaces)
tests/                     # Vitest: engine, parser, scoring, save round-trips
e2e/                       # Playwright: browser flows, storage, JSON import/export
tools/content/             # YAML scaffolds, Zod shapes, validator and generator
```

`tests` and `e2e` are already included by `tsconfig.json`; Vitest runs through
`vite.config.ts`. Playwright will need a root `playwright.config.ts` (testDir,
webServer and baseURL) when e2e work starts. **TypeScript linting is not yet
configured**: `eslint.config.js` currently has JS-only patterns and no TS parser,
so adding `**/*.ts` patterns plus a TS parser (e.g. `typescript-eslint`) is a
prerequisite before `npm run lint` covers game code. `vite.config.ts` already sets
`base: '/CompSciQuest/'` for GitHub Pages; the bootstrap must not assume it is
served from the domain root.

The subsystem folders under `src/core` are specified in the separate design
documents listed in §12. They all share the rule spine documented in
[shared-rules.md](shared-rules.md).

## 5. Class responsibilities

### Core

| Class / module         | Responsibility                                                                                                              | Key state                                                                                            | Collaborators                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `GameState`            | Runtime counterpart of the canonical DTO; factories `createInitial()` / `fromDto()`; `toDto()` returns the state shape only | player, entity inventories, flags, progress, turn, **status**, schedule; score is derived at restore | `Player`, `WorldProgress`                 |
| `Player`               | The player character's mutable state                                                                                        | position, inventory, lives                                                                           | `Item`, `Room`                            |
| `World`                | Registry/lookup for worlds, areas and rooms; validates exits                                                                | room map                                                                                             | `Room`, `Exit`                            |
| `Room`                 | A location: description, exits, special entry behaviour                                                                     | id, title, exits                                                                                     | `Exit`, `Player`                          |
| `Exit`                 | A directed connection with conditions for traversing it                                                                     | target, conditions                                                                                   | `Precondition`                            |
| `Item` (+ subclasses)  | Portable objects and their interactions                                                                                     | id, aliases, flags, state                                                                            | `Player`, `RuleEngine`                    |
| `Tokenizer` / `Parser` | Turn text into a `ParsedCommand` (verb + raw noun phrases); verb aliases and direction shortcuts                            | verb/alias tables                                                                                    | `ParsedCommand`                           |
| `NameResolver`         | Resolve `ParsedCommand` noun phrases to object IDs and produce a `Command`; unresolved nouns produce `unknown`              | visibility rules                                                                                     | `Item`, `Room`, `Player`, `ParsedCommand` |
| `RuleEngine`           | Central preconditions ("has key?", "door open?")                                                                            | none                                                                                                 | `Precondition`, verb handlers             |
| `EventBus`             | Decouples engine from UI; `publish` takes a whole turn's event batch                                                        | listener set                                                                                         | `GameEvent`                               |
| `ScoreTracker`         | Sole writer of per-area progress/`earnedScore`, driven by events; total score is derived                                    | visited sets (within `WorldProgress`)                                                                | `GameState`, `SpecTopic`                  |
| `SpecTopicCatalogue`   | Look up topic title/spec reference for UI labels                                                                            | topic index                                                                                          | `SpecTopic`                               |
| `Session`              | New game/restart/win/lose; handles `lives == 0`                                                                             | session status (persisted as `status`)                                                               | `GameState`, `EventBus`                   |

### Application services

| Class / module | Responsibility                                                                                                                                                                                                                              | Collaborators                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `Game`         | Façade and turn pipeline: `submit`, `newGame`, `continueGame`, `restart`, `getViewData`; meta actions intercepted before core dispatch. Full signatures in [application-and-ui.md §4](application-and-ui.md#4-game-façade-and-meta-actions) | `Tokenizer`, `Parser`, `NameResolver`, verb handlers, `RuleEngine`, `ScoreTracker`, `EventBus`, `SaveManager`, `ContentBundle` |
| `SaveManager`  | Assemble `SaveDto` from `GameState.toDto()` with version/`savedAt`, then validate and restore; catches parse errors. No migration yet                                                                                                       | `GameState`, `StorageAdapter`, `Clock`, `schema`                                                                               |
| `Clock`        | Injectable `now()` used for `savedAt`                                                                                                                                                                                                       | —                                                                                                                              |
| `schema`       | `SCHEMA_VERSION` (1); migration intentionally absent until public release                                                                                                                                                                   | `SaveDto`                                                                                                                      |

### Persistence and UI

| Class / module                      | Responsibility                                                                                                                |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `StorageAdapter` / `BrowserStorage` | Abstract and implement `localStorage` access; the seam used by tests.                                                         |
| `SaveFile`                          | Download a save as a `.json` file and read an imported `File` as text.                                                        |
| `GameWindow`                        | Create the page shell, mount child views, own the overall layout.                                                             |
| `TitleScreen`                       | Continue / New Game overlay shown at boot; Continue disabled without a valid save.                                            |
| `Terminal`                          | Command input, prompt, submit handling and bounded in-memory command history.                                                 |
| `OutputLog`                         | Append event text safely (`textContent`, never `innerHTML`), using `formatEvent`.                                             |
| `formatEvent`                       | Pure `GameEvent` → transcript lines, using the bundle for labels.                                                             |
| `ScorePanel`                        | Render visited worlds/areas, scores and the linked GCSE spec area from `GameViewData`, using `SpecTopicCatalogue` for labels. |
| `ConversationPanel`                 | Render NPC dialogue and suggested topics from conversation events.                                                            |
| `QuizPanel`                         | Render the current question and numbered options as text.                                                                     |
| `HintPanel`                         | Render escalating hint text and the hint cooldown message.                                                                    |
| `SaveControls`                      | Save/load/download/import buttons and user-facing error messages.                                                             |

## 6. Key flows

### 6.1 Bootstrap (`src/main.ts`)

1. Find `#app` (already present in `index.html`) or throw a clear error.
2. Construct the clock, storage adapter, `SaveManager`, event bus and the
   `ContentBundle` from `src/content/index.ts`; run `validateContent(bundle)`
   and fail fast on structural errors.
3. Call `SaveManager.load()`; on failure the live save is quarantined by
   `SaveManager` and boot continues with no usable save.
4. Construct the core services and `Game`, then `GameWindow` with `TitleScreen`,
   `Terminal`, `OutputLog`, `ScorePanel`, `ConversationPanel`, `QuizPanel`,
   `HintPanel` and `SaveControls`, subscribing them to the event bus.
5. Show the title screen with Continue (enabled only for a valid save) and New
   Game. The chosen action starts the session and emits the initial room
   description; the overlay is removed only after that batch is published.
   The full sequence is in [application-and-ui.md §2](application-and-ui.md#2-boot-title-screen-and-session-start).

### 6.2 One command turn

```
1. Resolve    Tokenizer → Parser → NameResolver / TopicResolver → Command
2. Validate   RuleEngine checks preconditions
3. Execute    verb handler applies Effects; events go into a per-turn buffer
4. React      Scheduler → Hazards → NPC reactions → Puzzles → Auto-hints
5. Observe    ScoreTracker.observe(events) → Session.observe(events)
6. Publish    EventBus.publish(events) → UI renders one coherent batch
```

This is a superset of the original flow: `TopicResolver` is needed for NPC
conversation topics, and the per-turn event buffer gives deterministic ordering
and prevents the UI seeing half-updated state. The full contract, including
cascade limits and observer ordering, is in [shared-rules.md](shared-rules.md#2-turn-pipeline-amends-architecturemd-62).

Handlers do **not** write score directly; they emit events, and `ScoreTracker` is
the only code that writes `WorldProgress`/`AreaProgress.earnedScore`. The total
`GameState.score` is derived from those area totals at restore. The parser must
never throw on bad input: unknown verbs, and nouns that `NameResolver` cannot
match to a visible object, both become an `unknown` command whose handler emits a
friendly "I don't understand that" message. Meta actions (save, load,
download, import, restart) are intercepted by `Game`/`SaveControls` _before_ core
dispatch and are not part of the core `Command` union; they do not advance the
turn. The turn counter increments once per submitted game command, whether or not
it succeeded.

### 6.3 Room entry, score and spec-topic mapping

1. A successful `go` command resolves the `Exit`, checks its conditions and
   returns a `move-player` effect.
2. `EffectApplier` moves `Player.position` and emits `room-entered` with a
   `RoomSummary`.
3. `ScoreTracker` marks the room visited in `WorldProgress`, adds any room points
   to `AreaProgress.earnedScore`, and records topic progress. Following
   `COVERAGE.md`, only topics whose status is `covered` **and** which have
   evidence are scoreable; unmapped topics may be shown as "not mapped yet" but
   award no points. The total score is derived from the area totals at restore
   ([storage-schema.md §7](storage-schema.md#7-restore-time-derivation)).
4. `ScorePanel` re-renders worlds/areas visited, score achieved and the spec area.
   It uses `SpecTopicCatalogue` to turn topic IDs into titles/spec references and
   never computes scores itself.

Puzzle completion ([puzzles.md](puzzles.md)) and quiz passes
([combat.md](combat.md)) hook into the same `topic-completed` event, so the score
panel needs no redesign when those systems are implemented.

### 6.4 Save, load, download and import

```
GameState.toDto() → GameStateDto (state shape only)
  → SaveManager.buildDto(): add SCHEMA_VERSION + savedAt from Clock → SaveDto → JSON.stringify
     ├→ StorageAdapter.write(SAVE_KEY, json)       (live save)
     └→ SaveFile.download(json)                    (downloadable file)

import: File.text() → JSON.parse → validate version + shape
        → SaveManager restores a new GameState → UI refreshed
```

- Validation uses a typed `LoadResult` with reasons `invalid-json`,
  `wrong-version`, `newer-version`, `invalid-shape` and `invalid-content`
  ([storage-schema.md §8](storage-schema.md#8-validation-contract)); a bad file
  must never partially overwrite the live save.
- Unknown or newer schema versions are rejected rather than force-loaded. On
  boot, a corrupt live save is quarantined with its raw text, reason and
  timestamp and can be downloaded for recovery (§9 of that document).
- Imported text is only ever treated as data: the UI renders it via
  `textContent`, so a malicious save cannot inject HTML. The file's `savedAt` is
  preserved and downloads carry a dated filename.
- The initial schema version is `1`. **No migration is implemented yet**: new
  state fields are added to v1 directly and unknown extra fields are ignored.
  Migration is revisited before public release (§11).

### 6.5 Losing a life and winning

Life loss comes from two designed systems: [hazards](hazards.md) and failed
adversarial quizzes ([combat.md](combat.md)). Both emit `lives-changed`; `Session`
detects `lives == 0`, sets the persisted `status` to `'lost'` and emits
`game-over` with the final score. When every spec topic with `covered` status and
evidence is completed, `Session.observe` sets `status` to `'won'` and emits
`game-won` with the final score
([application-and-ui.md §11](application-and-ui.md#11-win-check-owner)). A
reloaded end state does not re-emit the event. Both end states are exited through
the title screen's New Game / restart path, which restores
`GameState.createInitial()`.

## 7. Core interface sketches

These are contracts, not final implementations. They are written to be valid
under the repo's strict TypeScript settings.

```ts
// src/types/domain.ts
export type Direction =
  'north' | 'south' | 'east' | 'west' | 'up' | 'down' | 'in' | 'out';

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
  readonly verb: string; // canonical verb, e.g. 'take'
  readonly nounPhrases: readonly string[]; // raw words, e.g. ['brass key']
  readonly raw: string; // original input for friendly errors
}
```

The canonical `Command` union (22 variants, including NPC verbs, `answer`,
`hint` and the dedicated door verbs) and the canonical `GameEvent` union (27
variants including `RoomSummary`) are defined in
[application-and-ui.md §5 and §6](application-and-ui.md#5-canonical-command-union-and-verbs).
Do not duplicate them here. Meta actions are application-level and deliberately
absent from `Command`.

```ts
// src/core/events/EventBus.ts — unchanged; publish takes the whole turn batch
export interface EventBus {
  publish(events: readonly GameEvent[]): void;
  subscribe(listener: (event: GameEvent) => void): () => void;
}
```

```ts
// src/core/scoring/SpecTopic.ts — mirrors docs/coverage/COVERAGE.md
export type SpecStatus = 'not started' | 'in progress' | 'covered';

export interface SpecTopic {
  readonly id: string; // topic name from "## Topic: <name>"
  readonly title: string;
  readonly specReference: string; // PDF section/page
  readonly codeLocation: string; // path::symbol; empty when not mapped
  readonly status: SpecStatus;
  readonly evidence: string; // empty when not mapped yet
  readonly roomIds: readonly string[]; // a topic may span several rooms
  readonly maxScore: number;
}
```

`SpecTopicCatalogue` is defined canonically in
[application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures); it
provides `getById`, `getByRoomId` and `getByAreaId`.

`AreaProgress` is part of the persisted shape defined in
[storage-schema.md §3](storage-schema.md#3-persisted-shape-canonical).

`GameStateDto`, `SaveDto` and every sub-DTO are defined canonically in
[storage-schema.md §3](storage-schema.md#3-persisted-shape-canonical), together
with the validation result, quarantine shape and API contracts. `GameState`
implements `createInitial()` / `fromDto()` / `toDto()`; `SaveManager` owns the
envelope. In particular, `score` is derived at restore rather than stored, and
`status` is persisted.

## 8. Conventions

- Persisted shapes (DTOs, envelope, validation result and quarantine) are
  canonical in [storage-schema.md](storage-schema.md); the `Command` and
  `GameEvent` unions and application/UI contracts are canonical in
  [application-and-ui.md](application-and-ui.md). Do not duplicate any of them
  in other documents.
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
  malformed, unknown-version and newer-version saves, plus acceptance of
  additive v1 fields. Derived score, refreshed maxima, quiz attempts, entity
  inventories and persisted end status follow [storage-schema.md §12](storage-schema.md#12-tests).
- Lives: decrement, zero → `game-over`, restart resets state.
- Win: `game-won` carries the final score and restart resets state.

**Playwright (`e2e/`) — browser flows**

- App boots to the title screen; New Game enters the initial room with visible
  output and a score panel ([application-and-ui.md §12](application-and-ui.md#12-tests-for-the-skeleton)).
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

## 10. Out of scope (undesigned)

Content of any kind; light/dark and time-of-day mechanics; multiple save slots,
autosave and undo; localisation; audio; mobile-specific layouts; leaderboards and
multiplayer.

NPCs, hazards, quiz combat, puzzles and hints are **planned for v1** and have
designs in the documents listed in §12. They share the rule spine in
[shared-rules.md](shared-rules.md): `lives-changed` → `Session` game-over,
`topic-completed` → `ScoreTracker`, conditional exits using `Precondition`, and
`Trigger`/`Effect` for everything else.

Undo, save slots and localisation still have **no** hook and will need design work
when introduced (for example a slot-key strategy and text IDs). Light/dark has no
`LightSource` or "room lit?" precondition until that mechanic is brought in.

## 11. Decision log

**Decided**

- Full architecture document (this file) rather than a mechanics-only sketch.
- Versioned JSON saves in `localStorage`, with import/export of the full JSON
  file and validation on load. `SCHEMA_VERSION` is `1`.
- No schema migration while the game is unreleased: new state fields are added
  directly to v1. Migration is revisited before public release.
- NPCs, hazards, quiz combat, puzzles and hints each have their own design
  document (§12), built on one shared rule spine.
- **Mechanics order (within the full build order in §12):** hazards and puzzles
  first, then NPCs; quiz combat and hints follow their dependencies.
- Classic verb + noun parser with aliases and direction shortcuts; input that
  cannot be parsed gets a friendly error, not a crash. `Parser` produces a
  `ParsedCommand` (verb + raw noun phrases) and `NameResolver` turns that into a
  `Command` by resolving nouns to object IDs. `TopicResolver` handles free-text
  conversation topics.
- `WorldProgress`/`AreaProgress.earnedScore` are canonical persisted progress;
  `ScoreTracker` is their sole writer and the total `GameState.score` is derived
  at restore. Events are buffered per turn; `ScoreTracker` observes before
  `Session` so end events carry the final score.
- Save/load/download/import are application-level actions intercepted before
  core command dispatch, not core commands.
- The save key is `compsciquest:save:v1`; a corrupt live save is quarantined,
  not discarded. No undo, autosave or multiple slots.
- Win condition: all spec topics with `covered` status and evidence completed,
  checked by `Session.observe`, which emits `game-won`.
- Starting lives: `3`, reset on area change.
- Topic↔room mapping: `SpecTopic.roomIds` plus `status`/`evidence`, mirroring
  `COVERAGE.md`.
- NPCs: implicit conversation start via `ask`/`give`/`show`, no turn timeout, a
  dedicated `transfer-item` effect, and globally unique object/NPC aliases.
- Combat is an adversarial quiz: count-based `passMark`, no timer, seeded
  question order; failure costs a life and teleports to a content-declared
  level start; topic progress is not reset.
- Hints: escalating levels, tied to spec topics, a small cooldown, never reveal
  the answer, and any score penalty goes through `ScoreTracker`.
- Puzzles: `unsolved`/`active`/`solved` phases, action-flag requirements, many
  puzzles per topic, and Vitest validation of the dependency graph.
- Hazards: fire after the room description, emit `hazard-triggered`, use
  content-declared level starts, and never offer hints.

**Storage schema** — full contracts in [storage-schema.md](storage-schema.md):

- Item ownership is a property of Player, NPCs and Rooms (a `rooms` record of
  `RoomStateDto`); every item has exactly one owner. Mutable item/exit state
  uses a kebab-case `flags` convention.
- `status` (`playing` / `won` / `lost`) is persisted; win = all catalogue topics
  with `covered` status and evidence in completed topics, skipped when status is
  not `playing`.
- `score` is not stored; it is derived from area totals at restore.
  `AreaProgress.maxScore` is stored but refreshed from content at restore.
- Quiz retries use `quizAttempts: Record<quizId, number>`; the generic
  `attempts`, `startedTurn` and `firstRequestedTurn` fields were dropped.
- `turns-since:<puzzleId>` starts at 0 on activation and ticks every later turn.
- Validation checks required keys and types, ignores extra keys, uses a typed
  `LoadResult` with five failure reasons, and checks content IDs against
  catalogues.
- A corrupt live save is quarantined on boot only under
  `compsciquest:save:v1:corrupt` with raw text, reason and timestamp; one slot,
  downloadable. Imports preserve `savedAt`; downloads use a dated filename.
- Checksums and multi-tab protection are out of scope for v1.

**Application and UI** — full contracts in [application-and-ui.md](application-and-ui.md):

- Boot shows a title screen overlay with Continue (disabled without a valid
  save) and New Game. The browser window uses a main terminal with inline
  conversation/quiz/hint panels and a side score/save panel.
- Save actions are buttons plus typed meta-action aliases, both intercepted by
  `Game` before core dispatch; meta actions never advance the turn.
- Doors and containers use dedicated `open`, `close`, `unlock` and `put` verbs;
  `use` remains available for puzzles.
- Scoring is per puzzle: each room visit, puzzle solve and quiz pass awards its
  own content-declared points within `SpecTopic.maxScore`; `topic-completed`
  itself awards nothing. No new persisted field is needed for idempotency.
- Content is a single injected `ContentBundle` of typed catalogues validated at
  boot; a clearly marked one-area, two-room stub fixture keeps the skeleton
  bootable until generated zone content is available.
- `Game.getViewData()` is the state channel for `ScorePanel`; events drive the
  transcript and transient panels. Command history is bounded and in-memory.
- `Session.observe` owns the in-play win check; `SaveManager.restore()` derives
  but never re-emits an end event.
- `package.json` and `README.md` are authoritative for installed tooling.

**Settled as implementation/data tasks (no design decision outstanding)**

- Scoring values (points per room/topic, per-area maximums) live in content and
  are filled in when rooms and topics are authored.
- The verb list, alias table and ambiguity policy grow with content; unknown
  input always degrades to a friendly message.
- File/module naming follows the TypeScript lint setup when it is configured.
- Migration mechanics are revisited only before public release; until then v1
  is extended directly.

## 12. Subsystem design documents

These documents extend this architecture; they are linked from the relevant
sections above and must stay consistent with it. Build the persistence layer,
then the content toolchain (scaffolds, Zod shapes, validator and generator under
`tools/content/`, producing the committed `src/content/authored/*.ts`), then the
content registry and UI shell defined in
[application-and-ui.md](application-and-ui.md), then the mechanics in this order:
hazards and puzzles first, NPCs second, quiz combat and hints last. The storage
schema is the canonical definition of everything those systems persist. The
authoring and generation contract is
[content-toolchain.md](content-toolchain.md); no YAML is parsed at build or
runtime.

| Document                                       | What it specifies                                                                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [application-and-ui.md](application-and-ui.md) | Canonical content bundle, boot/title flow, `Game` façade, `Command`/`GameEvent` unions, UI layout and view-model, behavioural signatures and effect/event mapping. |
| [content-toolchain.md](content-toolchain.md)   | YAML card scaffolds, Zod shapes, validator and generator, committed generated TypeScript and the authoring-to-bundle handoff.                                      |
| [storage-schema.md](storage-schema.md)         | Canonical DTOs, envelope, item ownership, validation and `LoadResult`, quarantine, restore-time derivation and API contracts.                                      |
| [shared-rules.md](shared-rules.md)             | Conditions, triggers, effects, scheduler, seeded `Random`, per-turn event buffer and observer order.                                                               |
| [hazards.md](hazards.md)                       | Traps and penalties as declarative, scheduled life-loss rules.                                                                                                     |
| [puzzles.md](puzzles.md)                       | Action-flag puzzle completion, rewards and Puzzle Dependency Graph validation.                                                                                     |
| [npcs.md](npcs.md)                             | Actors, actor states, conversation topics, `ConvNode`, knowledge gating and `TopicResolver`.                                                                       |
| [combat.md](combat.md)                         | Adversarial quizzes: questions, grading, pass/fail effects, retries and seeded question order.                                                                     |
| [hints.md](hints.md)                           | Escalating, adaptive hint sequences with optional score penalty.                                                                                                   |

As implementation begins, keep this file and the subsystem documents in sync
with the code.
