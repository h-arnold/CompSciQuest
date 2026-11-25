# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 192 files · ~90,691 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .jsonc 1, .css 1)

## Summary
- 1203 nodes · 3310 edges · 74 communities (46 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 68 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aa885360`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- Strict TypeScript Settings
- Mechanics Data Models
- Application and UI Contracts
- OpenCode Agent Configuration
- GameState.ts
- ContentBundle.ts
- Persistence and Save Schema
- verbs/index.ts
- Content Authority and Cards
- Prettier Formatting Rules
- Content Review Rules
- Scheduling and Hazard Types
- Hint Score Penalties
- Architecture Principles and Decisions
- Quiz Engine and Randomness
- Puzzle Phases and Hazard Failure
- MemoryContentIo
- Answer Command
- Quiz Question Model
- Hint Delivery Rules
- Dialogue System
- Conversation Topic Resolution
- Response Strategies
- Topic Matching
- Free-text Topic Resolver
- Content Catalogues
- Event Bus
- ui.ts
- SchemaModule
- vitest
- SaveManager.ts
- content.ts
- helpers.ts
- finding
- contentToolchain.ts
- parser.ts
- vitest
- Condition
- GameState.ts
- Game.ts
- ContentGeneration.test.ts
- persistence.ts
- GameStateDto
- Effect
- cli.ts
- NpcGates.test.ts
- ConversationTopic.ts
- main.ts
- GameWindow.ts
- TurnPipeline.test.ts
- FakeElement
- validateContent.ts
- EffectApplier.ts
- content/index.ts
- uiSetup.ts
- ValidationModule
- content-generated.spec.ts
- GameState
- ContentBundle
- GameEvent
- adapt.ts
- formatEvent.ts
- FakeBus
- CommandHandler
- RecordingBus
- TokenizerLike
- .apply

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 54 edges
2. `asText()` - 54 edges
3. `finding()` - 54 edges
4. `GameEvent` - 48 edges
5. `Effect` - 43 edges
6. `GameState` - 43 edges
7. `collection()` - 39 edges
8. `vitest` - 39 edges
9. `StorageAdapter` - 25 edges
10. `compilerOptions` - 25 edges

## Surprising Connections (you probably didn't know these)
- `EffectApplierDependencies` --references--> `Random`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/core/Random.ts
- `PublishRecord` --references--> `GameEvent`  [EXTRACTED]
  tests/fixtures/ui.ts → src/core/events/GameEvent.ts
- `MemoryStorage` --implements--> `StorageAdapter`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/storage/StorageAdapter.ts
- `RecordingGame` --implements--> `Game`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/Game.ts
- `RecordingGame` --references--> `SaveDto`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/SaveDto.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase 4 (React) ordered systems** — docs_developer_shared_rules_scheduler, docs_developer_hazards_hazard_system, docs_developer_npcs_dialoguesystem, docs_developer_puzzles_puzzle_system, docs_developer_hints_hint_system [EXTRACTED 1.00]
- **Primitives forming the shared rule spine** — docs_developer_shared_rules_condition, docs_developer_shared_rules_trigger, docs_developer_shared_rules_effect, docs_developer_shared_rules_scheduler, docs_developer_shared_rules_effectapplier [EXTRACTED 1.00]
- **Score flows through ScoreTracker** — docs_developer_shared_rules_scoretracker, docs_developer_puzzles_per_puzzle_scoring, docs_developer_combat_quiz_scoring, docs_developer_hints_hint_penalty [EXTRACTED 1.00]
- **Content authoring and review workflow** — docs_developer_content_rules_bible, docs_developer_content_rules_card, docs_developer_content_rules_workflowgates, docs_developer_content_rules_contentcritic, docs_developer_content_rules_pckreviewer, docs_developer_content_rules_structuralvalidationgates [INFERRED 0.75]
- **One-command turn pipeline** — docs_developer_architecture_turnpipeline, docs_developer_application_and_ui_command, docs_developer_application_and_ui_gameevent, docs_developer_application_and_ui_eventbus, docs_developer_application_and_ui_effecteventmapping, docs_developer_application_and_ui_scoretracker, docs_developer_application_and_ui_session [INFERRED 0.75]
- **Save lifecycle flow** — docs_developer_storage_schema_savedto, docs_developer_storage_schema_persistedshape, docs_developer_architecture_savemanager, docs_developer_storage_schema_storageadapter, docs_developer_storage_schema_quarantine, docs_developer_storage_schema_loadresult, docs_developer_storage_schema_restoretimederivation [INFERRED 0.75]

## Communities (74 total, 28 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (50): description, devDependencies, eslint@^10.15.0, @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, markdownlint-cli2@^0.24.2 (+42 more)

### Community 1 - "Strict TypeScript Settings"
Cohesion: 0.07
Nodes (27): compilerOptions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib (+19 more)

### Community 2 - "Mechanics Data Models"
Cohesion: 0.08
Nodes (22): Quiz, quizAttempts / QuizStateDto, Hazard, HazardCatalogue, HazardSystem, HintLevel, HintSequence, HintSystem (+14 more)

### Community 3 - "Application and UI Contracts"
Cohesion: 0.08
Nodes (27): Catalogue<T> (declaration-order registry), Canonical Command union, ContentBundle, Effect-to-event mapping, EventBus, Game façade, Canonical GameEvent union, MetaAction union (+19 more)

### Community 4 - "OpenCode Agent Configuration"
Cohesion: 0.11
Nodes (17): agents, content-editor, permissions, command, type, default_agent, command, type (+9 more)

### Community 5 - "GameState.ts"
Cohesion: 0.12
Nodes (17): ExitDefinition, DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, MultiwordAlias, parseRaw(), SINGLE_ALIASES (+9 more)

### Community 6 - "ContentBundle.ts"
Cohesion: 0.16
Nodes (14): actorStates, items, quizzes, Catalogue, ContentBundle, ItemDefinition, Quiz, QuizQuestion (+6 more)

### Community 7 - "Persistence and Save Schema"
Cohesion: 0.29
Nodes (7): GameState, SaveManager, Static-first site, Item ownership invariant, Persisted shape (GameStateDto), SaveDto envelope, StorageAdapter port

### Community 8 - "verbs/index.ts"
Cohesion: 0.20
Nodes (19): describeRoom(), describeTarget(), fixedMessage(), flagPrefix(), getCommandHandler, goHandler(), HANDLERS, hasItem() (+11 more)

### Community 9 - "Content Authority and Cards"
Cohesion: 0.40
Nodes (5): Content authority order, Content bible, Design card, pck-reviewer reviewer, Content workflow gates W1-W6

### Community 10 - "Prettier Formatting Rules"
Cohesion: 0.40
Nodes (4): printWidth, proseWrap, singleQuote, trailingComma

### Community 11 - "Content Review Rules"
Cohesion: 0.67
Nodes (3): content-critic reviewer, Content rule catalogue (N/P/C/H/D/V), Counters and stuckness keys

### Community 12 - "Scheduling and Hazard Types"
Cohesion: 0.67
Nodes (3): Hazard types (entry trap, timed hazard, action trap), ScheduledEvent (fuse / daemon), Scheduler

### Community 34 - "ui.ts"
Cohesion: 0.12
Nodes (15): absentElement(), documentState, FakeDocument, FakeEvent, FakeKeyboardEvent, findButton(), findByClass(), findFirstByClass() (+7 more)

### Community 36 - "vitest"
Cohesion: 0.11
Nodes (25): generatedRoomIds(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES, CardSet (+17 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.15
Nodes (31): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+23 more)

### Community 38 - "content.ts"
Cohesion: 0.12
Nodes (32): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+24 more)

### Community 39 - "helpers.ts"
Cohesion: 0.11
Nodes (27): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+19 more)

### Community 40 - "finding"
Cohesion: 0.05
Nodes (133): CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards(), ROOT (+125 more)

### Community 41 - "contentToolchain.ts"
Cohesion: 0.09
Nodes (28): Data, PER_AREA_PATHS, ParsedRoom, AREA_ID, CardFile, cardText(), conformingCardSet(), expectSameMembers() (+20 more)

### Community 42 - "parser.ts"
Cohesion: 0.13
Nodes (24): ParsedCommand, CHEST_ID, DOOR_ID, KEY_A, loadNameResolver(), loadParser(), loadTokenizer(), loadVerbTable() (+16 more)

### Community 43 - "vitest"
Cohesion: 0.21
Nodes (19): vitest, makeEnvelope(), SAVE_KEY, allText(), Bootstrap, BootstrapDependencies, descendants(), flush() (+11 more)

### Community 44 - "Condition"
Cohesion: 0.29
Nodes (6): hints, puzzles, HintLevel, HintSequence, Puzzle, Condition

### Community 45 - "GameState.ts"
Cohesion: 0.16
Nodes (9): AreaProgress, RuntimeGameState, HazardStateDto, HintStateDto, NpcStateDto, PuzzlePhase, PuzzleStateDto, QuizStateDto (+1 more)

### Community 46 - "Game.ts"
Cohesion: 0.12
Nodes (18): createGame(), DIRECTION_NAMES, doubleIdCommand(), END_STATE_COMMANDS, initialBatch(), isDirection(), noArgumentCommand(), putCommand() (+10 more)

### Community 47 - "ContentGeneration.test.ts"
Cohesion: 0.18
Nodes (14): CardData, cleanParsedSet(), definition(), roomData(), npcCards(), TopicEntry, topicsCard(), GENERATED_PATHS (+6 more)

### Community 48 - "persistence.ts"
Cohesion: 0.14
Nodes (20): asRuntime(), EffectApplierDependencies, envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, loadEffectApplier(), loadGame() (+12 more)

### Community 49 - "GameStateDto"
Cohesion: 0.19
Nodes (5): QuarantineDto, LoadFailureReason, SaveDto, GameStateDto, MESSAGES

### Community 50 - "Effect"
Cohesion: 0.24
Nodes (8): hazards, rooms, RoomDefinition, Effect, Hazard, Trigger, ScheduledEvent, Scheduler

### Community 51 - "cli.ts"
Cohesion: 0.18
Nodes (12): ContentIo, ScaffoldOptions, ScaffoldResult, bodyFor(), FILES, header(), roomsScaffold(), RULES (+4 more)

### Community 52 - "NpcGates.test.ts"
Cohesion: 0.17
Nodes (12): gateFindings(), actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData() (+4 more)

### Community 53 - "ConversationTopic.ts"
Cohesion: 0.21
Nodes (8): conversationTopics, nodes, TopicResolver, ConversationNode, ConversationTopic, ResolvedTopic, ResponseStrategy, TopicMatch

### Community 54 - "main.ts"
Cohesion: 0.21
Nodes (10): loadContent(), createEventBus(), bootstrap(), browserDownload(), browserOpenSaveFile(), seededRandom(), startBrowserApp(), systemClock() (+2 more)

### Community 55 - "GameWindow.ts"
Cohesion: 0.05
Nodes (22): Game, AreaProgressView, ConversationView, HintView, QuizView, SpecTopicView, SpecStatus, SessionStatus (+14 more)

### Community 56 - "TurnPipeline.test.ts"
Cohesion: 0.15
Nodes (9): KEY_B, FakeRandom, makeGameDependencies(), makeRuntimeState(), noop(), loadEventBus(), loadGameWithPhases(), makeTurnDependencies() (+1 more)

### Community 57 - "FakeElement"
Cohesion: 0.13
Nodes (3): FakeElement, press(), press()

### Community 58 - "validateContent.ts"
Cohesion: 0.24
Nodes (14): aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified, ownerProblems() (+6 more)

### Community 59 - "EffectApplier.ts"
Cohesion: 0.23
Nodes (10): applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), EffectApplier, EffectApplierDependencies, inventoryOf() (+2 more)

### Community 60 - "content/index.ts"
Cohesion: 0.18
Nodes (10): ActorDefinition, actors, specTopics, worlds, assembled, specTopics, WorldDefinition, SpecTopic (+2 more)

### Community 61 - "uiSetup.ts"
Cohesion: 0.13
Nodes (7): GameViewData, LoadResult, RecordingGame, RecordingGameOptions, BootSetupOptions, DownloadCall, FakeSaveManager

### Community 63 - "content-generated.spec.ts"
Cohesion: 0.19
Nodes (5): START_POSITION, startRoom, AreaDefinition, areas, questions

### Community 64 - "GameState"
Cohesion: 0.17
Nodes (7): QuizSystem, Command, NameResolver, GameState, ConditionEvaluator, RuleEngine, TurnContext

### Community 65 - "ContentBundle"
Cohesion: 0.27
Nodes (13): Clock, GameDependencies, SaveManager, SaveManagerDependencies, EventBus, BootResult, BootstrapDependencies, StorageAdapter (+5 more)

### Community 66 - "GameEvent"
Cohesion: 0.11
Nodes (12): GameEvent, RoomSummary, HazardSystem, HintSystem, DialogueSystem, PuzzleSystem, ScoreTracker, EventBusFactory (+4 more)

### Community 67 - "adapt.ts"
Cohesion: 0.32
Nodes (10): catalogueOf(), bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings() (+2 more)

### Community 68 - "formatEvent.ts"
Cohesion: 0.83
Nodes (3): formatEvent(), label(), topicLabel()

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 314 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (3× useful, score=2.977345052)
- `Turn pipeline (buffered events)` (2× useful, score=1.979905018)
- `NameResolver` (2× useful, score=1.979905018)
- `validateContent` (2× useful, score=1.964718759)
- `Structural validation gates` (2× useful, score=1.964718759)
- `eslint.config.js` (2× useful, score=1.958881929)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `package.json`, `GameEvent`, `ui.ts`, `vitest`, `content.ts`, `contentToolchain.ts`, `parser.ts`, `ContentGeneration.test.ts`, `persistence.ts`, `GameStateDto`, `NpcGates.test.ts`, `TurnPipeline.test.ts`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle.ts` to `ui.ts`, `vitest`, `SaveManager.ts`, `content.ts`, `parser.ts`, `vitest`, `Condition`, `GameState.ts`, `Game.ts`, `persistence.ts`, `Effect`, `ConversationTopic.ts`, `main.ts`, `GameWindow.ts`, `validateContent.ts`, `content/index.ts`, `uiSetup.ts`, `content-generated.spec.ts`, `GameState`, `ContentBundle`, `GameEvent`, `adapt.ts`, `formatEvent.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._
- **Should `Application and UI Contracts` be split into smaller, more focused modules?**
  _Cohesion score 0.08262108262108261 - nodes in this community are weakly interconnected._