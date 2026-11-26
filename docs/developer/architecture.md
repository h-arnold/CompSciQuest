# CompSciQuest architecture

This document describes the game's **logic and mechanics** structure. Game content
(rooms, items, puzzles and the GCSE topics) is deliberately out of scope; where
content is involved, this document defines the contracts the engine consumes, not
the content itself.

## 1. Scope and goals

- Build a Zork-style text adventure as a **fully static site** on GitHub Pages.
  There is no runtime server and no server-side state.
- All game state lives in **browser storage** and is exportable/importable as a
  single JSON file containing the complete save.
- Keep data (content) separate from behaviour (engine).
- Keep the core engine **DOM-free and deterministic** so it is unit-tested
  without a browser.
- Give every system a typed seam and keep each contract in its owning document.

The subsystem document index is [docs/developer/README.md](README.md).

## 2. Design principles

| Principle              | What it means in practice                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static-first           | No backend calls. `localStorage` is the live store; JSON files are the portable store.                                                                                                                                    |
| Data and behaviour     | Core entities are interfaces plus `create*` factories; UI views are classes. Composition over deep inheritance.                                                                                                           |
| Separation of concerns | The engine never touches the DOM; the UI never owns game rules. They communicate through commands in and events out.                                                                                                      |
| Data-driven content    | Rooms, items and spec topics are declarative definitions consumed by the engine. No content is hard-coded into engine logic.                                                                                              |
| One source of truth    | The persisted shape is defined in [storage-schema.md](storage-schema.md); `GameState` is its runtime counterpart. Score is derived from per-area progress at restore; `ScoreTracker` is the sole writer of `earnedScore`. |
| Versioned saves        | Saves carry `SCHEMA_VERSION` and are validated on load; [storage-schema.md](storage-schema.md) owns the migration rule.                                                                                                   |
| Testability            | Dependencies (event bus, storage adapter, clock, random) are injected; no hidden globals in the core.                                                                                                                     |

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
  │ GameState · World · Room · items · commands · rules          │
  │ · events · scoring · lifecycle. Pure TS: no DOM, no storage. │
  ├──────────────────────────────────────────────────────────────┤
  │ Content definitions (src/content)                            │
  └──────────────────────────────────────────────────────────────┘
```

**Dependency rule:** imports point downward. `src/core` imports nothing from
`application`, `ui`, `storage` or the DOM. `application` depends on `core`; the one
outward import allowed is a **type-only** import of the `StorageAdapter` interface
(a port) from `src/storage` — no implementation is imported. The real
`localStorage` implementation lives in `src/storage` and is injected at bootstrap.
The UI depends on `application`/`core`. The only upward channel from the engine is
the `EventBus` (event objects, not UI callbacks).

## 4. Source layout

| Directory         | Responsibility                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `src/application` | `Game` façade, turn orchestration, save/load, view data and schema.                           |
| `src/core`        | DOM-free engine: state, commands, rules, effects, scheduling, scoring, lifecycle, subsystems. |
| `src/content`     | Declarative definitions, committed generated catalogues and `loadContent()`.                  |
| `src/storage`     | `StorageAdapter` port and its `localStorage` implementation.                                  |
| `src/types`       | Shared domain types.                                                                          |
| `src/ui`          | Browser-window chrome, terminal, panels and event formatting.                                 |
| `tools/content`   | YAML scaffolds, schemas, validator and generator for authored content.                        |
| `tests`           | Vitest coverage of engine logic.                                                              |
| `e2e`             | Playwright browser flows.                                                                     |

The subsystem folders under `src/core` share the rule spine in
[shared-rules.md](shared-rules.md); [docs/developer/README.md](README.md) indexes
their documents.

## 5. Module responsibilities

### Core

| Module                 | Responsibility                                                                                                                                                                           | Collaborators              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `GameState`            | Runtime state and the canonical DTO. `createInitial(bundle?)` starts a game; `createFromDto(dto)` restores one; `RuntimeGameState.toDto()` returns the DTO shape only. Score is derived. | `World`, `AreaProgress`    |
| `GameState.player`     | The player's position, inventory and lives.                                                                                                                                              | `Position`                 |
| `World`                | Registry and lookup for worlds, areas and rooms; validates exits.                                                                                                                        | `Room`, `Exit`             |
| `Room`                 | A location's identity, description and exits. Entry effects come from `RoomDefinition.entryEffects`.                                                                                     | `Exit`                     |
| `Exit`                 | A directed connection with conditions for traversing it.                                                                                                                                 | `Precondition`             |
| `Item`                 | Portable and fixed objects as declarative definitions with an owner in state.                                                                                                            | `RuleEngine`               |
| `Tokenizer` / `Parser` | Turn text into a `ParsedCommand` (verb plus raw noun phrases); verb aliases and direction shortcuts.                                                                                     | `ParsedCommand`            |
| `NameResolver`         | Resolve noun phrases to object IDs and produce a `Command`; unresolved nouns produce `unknown`.                                                                                          | `Item`, `Room`, `Position` |
| `RuleEngine`           | Evaluates declared `go` exit preconditions (application-and-ui.md §8); verb handlers check their own ([application-and-ui.md §5.1](application-and-ui.md#51-door-and-container-verbs)).  | `Precondition`             |
| `EventBus`             | Decouples engine from UI; `publish` takes a whole turn's event batch.                                                                                                                    | `GameEvent`                |
| `ScoreTracker`         | Sole writer of `AreaProgress.earnedScore`, driven by events; total score is derived.                                                                                                     | `GameState`, `SpecTopic`   |
| `SpecTopicCatalogue`   | Look up topic title and spec reference; owns the `(worldId, areaId)` index.                                                                                                              | `SpecTopic`                |
| `Session`              | New game/restart/win/lose; handles `lives == 0`.                                                                                                                                         | `GameState`, `EventBus`    |

### Application services

| Module        | Responsibility                                                                                                                                                                                                            | Collaborators                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `Game`        | Façade: `submit`, `newGame`, `continueGame`, `restart`, `getViewData`; intercepts meta actions before core dispatch. Full signatures in [application-and-ui.md §4](application-and-ui.md#4-game-façade-and-meta-actions). | `Tokenizer`, `Parser`, `NameResolver`, verb handlers, `RuleEngine`, `ScoreTracker`, `EventBus`, `SaveManager`, `ContentBundle` |
| `SaveManager` | Assemble `SaveDto` from `GameState.toDto()` with version and `savedAt`, then validate and restore; catches parse errors.                                                                                                  | `GameState`, `StorageAdapter`, `Clock`, `schema`                                                                               |
| `Clock`       | Injectable `now()` used for `savedAt`.                                                                                                                                                                                    | —                                                                                                                              |
| `schema`      | `SCHEMA_VERSION`; the migration rule is owned by [storage-schema.md §1](storage-schema.md#1-scope-and-authority).                                                                                                         | `SaveDto`                                                                                                                      |

### Persistence and UI

| Class / module                      | Responsibility                                                                                                                |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `StorageAdapter` / `BrowserStorage` | Abstract and implement `localStorage` access; the seam used by tests.                                                         |
| `downloadFile` / `openSaveFile`     | Injected from `src/main.ts`; `GameWindow` owns the download and import controls.                                              |
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

Boot finds `#app`, constructs the clock, storage adapter, save manager, event bus,
seeded `Random` and `ContentBundle`, validates the bundle, loads any live save,
then mounts `GameWindow` and the title screen. The authoritative sequence is in
[application-and-ui.md §2](application-and-ui.md#2-boot-title-screen-and-session-start).

### 6.2 One command turn

The turn pipeline — phase order, per-turn event buffer, cascade limit and
observer ordering — is canonical in [shared-rules.md §2](shared-rules.md#2-turn-pipeline).
`Game.submit` runs it and publishes the buffered batch;
[application-and-ui.md §4](application-and-ui.md#4-game-façade-and-meta-actions)
owns the façade contract.

### 6.3 Room entry, score and spec-topic mapping

1. A successful `go` command resolves the `Exit`, checks its conditions and
   returns a `move-player` effect.
2. `EffectApplier` moves `GameState.player.position` and emits `room-entered` with
   a `RoomSummary`.
3. `ScoreTracker` marks the room visited in `AreaProgress`, adds room points to
   `AreaProgress.earnedScore` and records topic progress. Only topics whose status
   is `covered` **and** which have evidence are scoreable; unmapped topics award
   no points.
4. `ScorePanel` renders visited areas, score and the spec area from
   `GameViewData`, using `SpecTopicCatalogue` for labels; it never computes
   scores.

Scoring rules are owned by [application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)
and the persisted shape by [storage-schema.md §3](storage-schema.md#3-persisted-shape-canonical).
Puzzles and quizzes complete topics through the same `topic-completed` event.

### 6.4 Save, load, download and import

`GameState.toDto()` produces the state shape; `SaveManager.buildDto()` adds the
version and `savedAt`, and the JSON is written to the live save key and/or passed
to the injected `downloadFile`. Import validates the text and restores a new
state without touching storage on failure. The envelope, keys, validation
reasons, quarantine and flow are canonical in
[storage-schema.md §8](storage-schema.md#8-validation-contract),
[§9](storage-schema.md#9-quarantine) and
[§11](storage-schema.md#11-flow).

### 6.5 Losing a life and winning

Life loss comes from hazards and failed adversarial quizzes; both emit
`lives-changed`, and `Session` turns `lives === 0` into `game-over`. A qualifying
area change emits `lives-changed` too; the gate is owned by
[application-and-ui.md §3.2](application-and-ui.md#32-world-area-room-and-item-definitions).
The win and loss conditions are owned by
[application-and-ui.md §11](application-and-ui.md#11-win-check-owner).

## 7. Core contracts

Each contract has one owning document. This table is the pointer set; do not
declare a second copy.

| Contract                                                           | Owner                                                                                                                                                      |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Command`                                                          | [application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs)                                                                      |
| `GameEvent`, `EventBus`                                            | [application-and-ui.md §6](application-and-ui.md#6-canonical-event-union-and-rendering)                                                                    |
| `Effect`, `Condition`, `Trigger`, `ScheduledEvent`                 | [shared-rules.md §§3–6](shared-rules.md#3-condition)                                                                                                       |
| `SpecTopic`, `SpecTopicCatalogue`                                  | [application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures)                                                                                 |
| `GameStateDto`, `SaveDto`, sub-DTOs, `LoadResult`, `QuarantineDto` | [storage-schema.md §3](storage-schema.md#3-persisted-shape-canonical), [§8](storage-schema.md#8-validation-contract), [§9](storage-schema.md#9-quarantine) |
| `Direction`, `Position`                                            | `src/types/domain.ts`                                                                                                                                      |

`score` is derived at restore rather than stored, and `status` is persisted;
[storage-schema.md §7](storage-schema.md#7-restore-time-derivation) owns both
rules.

## 8. Conventions

Compiler flags live in [`tsconfig.json`](../../tsconfig.json); the non-obvious
consequences for code shape are:

- **One primary export per file**, named after the file. Small related types may
  share a `types` module.
- **Core entities are interfaces plus `create*` factories.** UI views are classes;
  behaviour lives in verb handlers and domain systems, not deep class trees.
- **`erasableSyntaxOnly`**: no enums, parameter properties or namespaces. Use
  string-literal unions and ordinary modules.
- **`verbatimModuleSyntax`**: use `import type` / `export type` for type-only
  imports and exports.
- **`exactOptionalPropertyTypes`**: omit optional properties rather than assigning
  `undefined`.
- **`noUncheckedIndexedAccess`**: guard lookups into maps and arrays, and use
  bracket notation for index signatures.
- **Mark overrides** with `override` and give exported APIs explicit return types.
- No DOM APIs, `localStorage`, `fetch`, `Blob` or `URL` inside `src/core`.
- All user-visible text is rendered as text nodes; never build HTML from game data
  or imported saves.
- **Linting:** `eslint.config.js` covers TypeScript; keep methods short and avoid
  duplicated blocks for the `sonarjs` rules.

## 9. Testability

The core stays DOM-free and deterministic: inject `EventBus`, `StorageAdapter`,
`Clock` and `Random`, use in-memory fakes and a fake clock rather than real
`localStorage` or the system clock, and keep content fixtures small and
deterministic. Run `npm test`, `npm run test:e2e`, `npm run typecheck` and
`npm run lint`; `package.json` lists every script.

Persistence invariants are listed in
[storage-schema.md §12](storage-schema.md#12-invariants-the-implementation-must-keep);
the app's behavioural guarantees are in
[application-and-ui.md §12](application-and-ui.md#12-behavioural-guarantees).

## 10. Out of scope

Content of any kind; light/dark and time-of-day mechanics; multiple save slots,
autosave and undo; localisation; audio; mobile-specific layouts; leaderboards and
multiplayer.
