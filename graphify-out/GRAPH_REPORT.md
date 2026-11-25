# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 175 files · ~87,349 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .jsonc 1, .css 1)

## Summary
- 1196 nodes · 3274 edges · 59 communities (36 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 68 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e32880a2`
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
- FakeElement
- SchemaModule
- vitest
- SaveManager.ts
- content.ts
- helpers.ts
- finding
- contentToolchain.ts
- parser.ts
- Condition
- GameState.ts
- Game.ts
- ContentGeneration.test.ts
- persistence.ts
- cli.ts
- NpcGates.test.ts
- ConversationTopic.ts
- GameWindow.ts
- turn.ts
- content/index.ts
- uiSetup.ts
- ValidationModule
- GameState
- ContentBundle
- GameEvent

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 54 edges
2. `asText()` - 54 edges
3. `finding()` - 54 edges
4. `GameEvent` - 48 edges
5. `Effect` - 43 edges
6. `GameState` - 43 edges
7. `collection()` - 39 edges
8. `vitest` - 38 edges
9. `StorageAdapter` - 25 edges
10. `compilerOptions` - 25 edges

## Surprising Connections (you probably didn't know these)
- `zone1Generation()` --calls--> `generateContent()`  [EXTRACTED]
  tests/content/GeneratedContent.test.ts → tools/content/generate.ts
- `MemoryStorage` --implements--> `StorageAdapter`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/storage/StorageAdapter.ts
- `RecordingGame` --implements--> `Game`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/Game.ts
- `RecordingGame` --references--> `GameViewData`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/GameViewData.ts
- `RecordingGame` --references--> `GameEvent`  [EXTRACTED]
  tests/fixtures/ui.ts → src/core/events/GameEvent.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase 4 (React) ordered systems** — docs_developer_shared_rules_scheduler, docs_developer_hazards_hazard_system, docs_developer_npcs_dialoguesystem, docs_developer_puzzles_puzzle_system, docs_developer_hints_hint_system [EXTRACTED 1.00]
- **Primitives forming the shared rule spine** — docs_developer_shared_rules_condition, docs_developer_shared_rules_trigger, docs_developer_shared_rules_effect, docs_developer_shared_rules_scheduler, docs_developer_shared_rules_effectapplier [EXTRACTED 1.00]
- **Score flows through ScoreTracker** — docs_developer_shared_rules_scoretracker, docs_developer_puzzles_per_puzzle_scoring, docs_developer_combat_quiz_scoring, docs_developer_hints_hint_penalty [EXTRACTED 1.00]
- **Content authoring and review workflow** — docs_developer_content_rules_bible, docs_developer_content_rules_card, docs_developer_content_rules_workflowgates, docs_developer_content_rules_contentcritic, docs_developer_content_rules_pckreviewer, docs_developer_content_rules_structuralvalidationgates [INFERRED 0.75]
- **One-command turn pipeline** — docs_developer_architecture_turnpipeline, docs_developer_application_and_ui_command, docs_developer_application_and_ui_gameevent, docs_developer_application_and_ui_eventbus, docs_developer_application_and_ui_effecteventmapping, docs_developer_application_and_ui_scoretracker, docs_developer_application_and_ui_session [INFERRED 0.75]
- **Save lifecycle flow** — docs_developer_storage_schema_savedto, docs_developer_storage_schema_persistedshape, docs_developer_architecture_savemanager, docs_developer_storage_schema_storageadapter, docs_developer_storage_schema_quarantine, docs_developer_storage_schema_loadresult, docs_developer_storage_schema_restoretimederivation [INFERRED 0.75]

## Communities (59 total, 23 thin omitted)

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
Cohesion: 0.08
Nodes (32): ExitDefinition, aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified (+24 more)

### Community 6 - "ContentBundle.ts"
Cohesion: 0.13
Nodes (15): ActorDefinition, actorStates, actors, questions, quizzes, Catalogue, RoomDefinition, Quiz (+7 more)

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

### Community 34 - "FakeElement"
Cohesion: 0.07
Nodes (30): absentElement(), allText(), Bootstrap, BootstrapDependencies, descendants(), documentState, FakeDocument, FakeElement (+22 more)

### Community 36 - "vitest"
Cohesion: 0.11
Nodes (25): generatedRoomIds(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES, CardSet (+17 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.13
Nodes (32): QuarantineDto, LoadFailureReason, createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences() (+24 more)

### Community 38 - "content.ts"
Cohesion: 0.14
Nodes (31): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+23 more)

### Community 39 - "helpers.ts"
Cohesion: 0.11
Nodes (28): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+20 more)

### Community 40 - "finding"
Cohesion: 0.05
Nodes (134): sharedFindings(), CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards() (+126 more)

### Community 41 - "contentToolchain.ts"
Cohesion: 0.09
Nodes (28): Data, PER_AREA_PATHS, ParsedRoom, AREA_ID, CardFile, cardText(), conformingCardSet(), expectSameMembers() (+20 more)

### Community 42 - "parser.ts"
Cohesion: 0.09
Nodes (29): Command, CommandHandler, ParsedCommand, RuleEngine, CHEST_ID, DOOR_ID, KEY_A, KEY_B (+21 more)

### Community 44 - "Condition"
Cohesion: 0.17
Nodes (10): hazards, hints, puzzles, Hazard, HintLevel, HintSequence, Puzzle, Condition (+2 more)

### Community 45 - "GameState.ts"
Cohesion: 0.09
Nodes (20): AreaProgress, QuizSystem, Effect, GameState, GameStateDto, RuntimeGameState, HazardSystem, HazardStateDto (+12 more)

### Community 46 - "Game.ts"
Cohesion: 0.07
Nodes (38): createGame(), DIRECTION_NAMES, doubleIdCommand(), END_STATE_COMMANDS, initialBatch(), isDirection(), noArgumentCommand(), putCommand() (+30 more)

### Community 47 - "ContentGeneration.test.ts"
Cohesion: 0.18
Nodes (14): CardData, cleanParsedSet(), definition(), roomData(), npcCards(), TopicEntry, topicsCard(), GENERATED_PATHS (+6 more)

### Community 48 - "persistence.ts"
Cohesion: 0.19
Nodes (20): vitest, asRuntime(), envelopeText(), FakeRandom, FIXED_ISO, IMPORTED_ISO, loadGame(), loadInitialState() (+12 more)

### Community 51 - "cli.ts"
Cohesion: 0.18
Nodes (12): ContentIo, ScaffoldOptions, ScaffoldResult, bodyFor(), FILES, header(), roomsScaffold(), RULES (+4 more)

### Community 52 - "NpcGates.test.ts"
Cohesion: 0.17
Nodes (12): gateFindings(), actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData() (+4 more)

### Community 53 - "ConversationTopic.ts"
Cohesion: 0.21
Nodes (8): conversationTopics, nodes, TopicResolver, ConversationNode, ConversationTopic, ResolvedTopic, ResponseStrategy, TopicMatch

### Community 55 - "GameWindow.ts"
Cohesion: 0.06
Nodes (26): Game, AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView, SpecStatus (+18 more)

### Community 56 - "turn.ts"
Cohesion: 0.15
Nodes (11): Session, loadEffectApplier(), loadSession(), EventBusFactory, FormatEventFunction, loadEventBus(), loadFormatEvent(), loadGameWithPhases() (+3 more)

### Community 60 - "content/index.ts"
Cohesion: 0.12
Nodes (21): AreaDefinition, areas, items, specTopics, worlds, catalogueOf(), assembled, specTopics (+13 more)

### Community 61 - "uiSetup.ts"
Cohesion: 0.09
Nodes (13): LoadResult, SaveDto, FixedClock, MemoryStorage, installFakeDocument(), makeViewData(), RecordingGame, BootSetupOptions (+5 more)

### Community 64 - "GameState"
Cohesion: 0.27
Nodes (4): ContentBundle, NameResolver, TurnContext, PutFixture

### Community 65 - "ContentBundle"
Cohesion: 0.13
Nodes (16): Clock, GameDependencies, SaveManager, SaveManagerDependencies, EventBus, Random, ScoreTracker, BootResult (+8 more)

### Community 66 - "GameEvent"
Cohesion: 0.17
Nodes (7): GameEvent, EffectApplierLike, RecordingBus, MemoryBus, FakeBus, PublishRecord, RecordingGameOptions

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 308 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (3× useful, score=2.978103588)
- `Turn pipeline (buffered events)` (2× useful, score=1.980409437)
- `NameResolver` (2× useful, score=1.980409437)
- `validateContent` (2× useful, score=1.965219309)
- `Structural validation gates` (2× useful, score=1.965219309)
- `eslint.config.js` (2× useful, score=1.959380992)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `persistence.ts` to `package.json`, `FakeElement`, `vitest`, `SaveManager.ts`, `content.ts`, `contentToolchain.ts`, `parser.ts`, `ContentGeneration.test.ts`, `NpcGates.test.ts`, `turn.ts`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.050072568940493466 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `GameState` to `ContentBundle`, `FakeElement`, `vitest`, `SaveManager.ts`, `ContentBundle.ts`, `GameState.ts`, `content.ts`, `parser.ts`, `Condition`, `GameState.ts`, `Game.ts`, `persistence.ts`, `ConversationTopic.ts`, `GameWindow.ts`, `turn.ts`, `content/index.ts`, `uiSetup.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Why does `asText()` connect `finding` to `content/index.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._