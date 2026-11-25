# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 165 files · ~73,684 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .jsonc 1, .css 1)

## Summary
- 1131 nodes · 3089 edges · 64 communities (43 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ffafd63`
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
- main.ts
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
- adapt.ts
- Parser.ts
- SaveManager.ts
- content.ts
- GameState
- finding
- contentToolchain.ts
- parser.ts
- ContentGates.test.ts
- Condition
- validateContent.ts
- Game.ts
- ContentGeneration.test.ts
- persistence.ts
- ui.ts
- SpecTopic
- cli.ts
- NpcGates.test.ts
- ConversationTopic.ts
- RoomDefinition.ts
- GameWindow.ts
- GameEvent
- World.ts
- MemoryContentIo
- EffectApplier.ts
- content/index.ts
- SaveManager
- WorldDefinition
- loadTool

## God Nodes (most connected - your core abstractions)
1. `asText()` - 55 edges
2. `finding()` - 54 edges
3. `ContentBundle` - 53 edges
4. `GameEvent` - 48 edges
5. `GameState` - 43 edges
6. `Effect` - 43 edges
7. `collection()` - 40 edges
8. `vitest` - 35 edges
9. `StorageAdapter` - 25 edges
10. `SaveManager` - 25 edges

## Surprising Connections (you probably didn't know these)
- `PublishRecord` --references--> `GameEvent`  [EXTRACTED]
  tests/fixtures/ui.ts → src/core/events/GameEvent.ts
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

## Communities (64 total, 21 thin omitted)

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
Cohesion: 0.09
Nodes (17): AreaProgress, Effect, GameStateDto, HazardSystem, HazardStateDto, HintSystem, HintStateDto, DialogueSystem (+9 more)

### Community 6 - "ContentBundle.ts"
Cohesion: 0.23
Nodes (6): actorStates, questions, quizzes, Quiz, QuizQuestion, ActorState

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

### Community 17 - "main.ts"
Cohesion: 0.11
Nodes (20): Clock, SaveManagerDependencies, createEventBus(), EventBus, Random, BootResult, bootstrap(), BootstrapDependencies (+12 more)

### Community 34 - "FakeElement"
Cohesion: 0.08
Nodes (11): absentElement(), FakeDocument, FakeElement, findByClass(), findFirstByClass(), hasMatchingAncestors(), isTokenMatch(), makeFakeDocument() (+3 more)

### Community 35 - "adapt.ts"
Cohesion: 0.26
Nodes (10): Catalogue, catalogueOf(), bundleOf(), gateOf(), isTrue(), number(), numbers(), strings() (+2 more)

### Community 36 - "Parser.ts"
Cohesion: 0.14
Nodes (11): DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, MultiwordAlias, parseRaw(), SINGLE_ALIASES, tokenize (+3 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.12
Nodes (34): QuarantineDto, LoadFailureReason, createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences() (+26 more)

### Community 38 - "content.ts"
Cohesion: 0.13
Nodes (33): loadContent(), stubBundle, stubInitialState, CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD (+25 more)

### Community 39 - "GameState"
Cohesion: 0.15
Nodes (12): GameDependencies, QuizSystem, Command, CommandHandler, GameState, RuntimeGameState, ConditionEvaluator, RuleEngine (+4 more)

### Community 40 - "finding"
Cohesion: 0.05
Nodes (135): sharedFindings(), CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards() (+127 more)

### Community 41 - "contentToolchain.ts"
Cohesion: 0.10
Nodes (18): vitest, PER_AREA_PATHS, CardFile, CardSet, GeneratorModule, HAZARDS_PATH, HINTS_PATH, NPCS_PATH (+10 more)

### Community 42 - "parser.ts"
Cohesion: 0.12
Nodes (25): ParsedCommand, CHEST_ID, DOOR_ID, KEY_A, KEY_B, loadNameResolver(), loadParser(), loadTokenizer() (+17 more)

### Community 43 - "ContentGates.test.ts"
Cohesion: 0.12
Nodes (12): Data, gateFindings(), ParsedRoom, npcFindings(), cardText(), conformingCardSet(), expectSameMembers(), findingText() (+4 more)

### Community 44 - "Condition"
Cohesion: 0.20
Nodes (9): hazards, hints, puzzles, Hazard, HintLevel, HintSequence, Puzzle, Condition (+1 more)

### Community 45 - "validateContent.ts"
Cohesion: 0.24
Nodes (14): aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified, ownerProblems() (+6 more)

### Community 46 - "Game.ts"
Cohesion: 0.11
Nodes (20): createGame(), DIRECTION_NAMES, doubleIdCommand(), END_STATE_COMMANDS, initialBatch(), isDirection(), noArgumentCommand(), putCommand() (+12 more)

### Community 47 - "ContentGeneration.test.ts"
Cohesion: 0.16
Nodes (16): CardData, cleanParsedSet(), definition(), roomData(), npcCards(), TopicEntry, topicsCard(), AREA_ID (+8 more)

### Community 48 - "persistence.ts"
Cohesion: 0.11
Nodes (23): asRuntime(), EffectApplierLike, envelopeText(), FakeRandom, FIXED_ISO, FixedClock, IMPORTED_ISO, loadEffectApplier() (+15 more)

### Community 49 - "ui.ts"
Cohesion: 0.14
Nodes (29): ContentBundle, QUARANTINE_KEY, SAVE_KEY, allText(), Bootstrap, BootstrapDependencies, descendants(), documentState (+21 more)

### Community 50 - "SpecTopic"
Cohesion: 0.43
Nodes (3): SpecTopic, SpecTopicCatalogue, TopicIndexEntry

### Community 51 - "cli.ts"
Cohesion: 0.18
Nodes (12): ContentIo, ScaffoldOptions, ScaffoldResult, bodyFor(), FILES, header(), roomsScaffold(), RULES (+4 more)

### Community 52 - "NpcGates.test.ts"
Cohesion: 0.21
Nodes (9): actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData(), topic() (+1 more)

### Community 53 - "ConversationTopic.ts"
Cohesion: 0.21
Nodes (8): conversationTopics, nodes, TopicResolver, ConversationNode, ConversationTopic, ResolvedTopic, ResponseStrategy, TopicMatch

### Community 54 - "RoomDefinition.ts"
Cohesion: 0.60
Nodes (3): rooms, RoomDefinition, stubRooms

### Community 55 - "GameWindow.ts"
Cohesion: 0.06
Nodes (25): Game, AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView, SpecStatus (+17 more)

### Community 56 - "GameEvent"
Cohesion: 0.13
Nodes (14): GameEvent, Session, ScoreTracker, loadSession(), EventBusFactory, FormatEventFunction, loadEventBus(), loadFormatEvent() (+6 more)

### Community 57 - "World.ts"
Cohesion: 0.33
Nodes (5): ExitDefinition, Exit, Room, Precondition, World

### Community 59 - "EffectApplier.ts"
Cohesion: 0.29
Nodes (9): applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), EffectApplier, EffectApplierDependencies, inventoryOf() (+1 more)

### Community 60 - "content/index.ts"
Cohesion: 0.20
Nodes (10): ActorDefinition, AreaDefinition, actors, areas, items, specTopics, assembled, specTopics (+2 more)

### Community 61 - "SaveManager"
Cohesion: 0.12
Nodes (7): LoadResult, SaveDto, SaveManager, GameWindowDependencies, RecordingGame, RecordingGameOptions, FakeSaveManager

### Community 62 - "WorldDefinition"
Cohesion: 0.60
Nodes (3): worlds, stubWorlds, WorldDefinition

### Community 63 - "loadTool"
Cohesion: 0.40
Nodes (5): loadGenerator(), loadScaffolder(), loadSchema(), loadTool(), loadValidation()

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 283 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (3× useful, score=2.981027371)
- `Turn pipeline (buffered events)` (2× useful, score=1.982353723)
- `NameResolver` (2× useful, score=1.982353723)
- `validateContent` (2× useful, score=1.967148682)
- `Structural validation gates` (2× useful, score=1.967148682)
- `eslint.config.js` (2× useful, score=1.961304633)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ContentBundle` connect `ui.ts` to `GameState.ts`, `ContentBundle.ts`, `main.ts`, `adapt.ts`, `SaveManager.ts`, `content.ts`, `GameState`, `parser.ts`, `Condition`, `validateContent.ts`, `Game.ts`, `persistence.ts`, `SpecTopic`, `ConversationTopic.ts`, `RoomDefinition.ts`, `GameWindow.ts`, `GameEvent`, `content/index.ts`, `SaveManager`, `WorldDefinition`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.050072568940493466 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `contentToolchain.ts` to `package.json`, `SaveManager.ts`, `content.ts`, `parser.ts`, `ContentGates.test.ts`, `ContentGeneration.test.ts`, `persistence.ts`, `ui.ts`, `NpcGates.test.ts`, `GameEvent`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `GameEvent` to `GameState.ts`, `GameState`, `Game.ts`, `persistence.ts`, `main.ts`, `ui.ts`, `GameWindow.ts`, `EffectApplier.ts`, `SaveManager`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._