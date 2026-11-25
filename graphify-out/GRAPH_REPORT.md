# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 189 files · ~105,010 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .jsonc 1, .css 1)

## Summary
- 1350 nodes · 3933 edges · 72 communities (46 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 71 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26a99419`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scripts
- Strict TypeScript Settings
- Mechanics Data Models
- Application and UI Contracts
- OpenCode Agent Configuration
- main.ts
- ContentBundle.ts
- Persistence and Save Schema
- ContentGates.test.ts
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
- contentToolchain.ts
- mechanics.ts
- SaveManager.ts
- content.ts
- helpers.ts
- finding
- GameEvent.ts
- parser.ts
- vitest
- verbs/index.ts
- Parser.ts
- Game.ts
- zone1.ts
- persistence.ts
- GameStateDto
- node-shims.d.ts
- cli.ts
- NpcGates.test.ts
- PuzzleSystem.ts
- GameEvent
- GameWindow.ts
- package.json
- ScoreTracker.ts
- vitest
- ValidationModule
- ContentBundle
- GameState.ts
- validateContent.ts
- content/schema.ts
- EffectApplier.ts
- ContentGeneration.test.ts
- SaveDto.ts
- RecordingGame
- SourceHygiene.test.ts
- NameResolver.ts
- GameEvent
- ConditionEvaluator.test.ts

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 69 edges
2. `GameEvent` - 60 edges
3. `asText()` - 56 edges
4. `finding()` - 56 edges
5. `vitest` - 53 edges
6. `GameState` - 44 edges
7. `collection()` - 39 edges
8. `Effect` - 36 edges
9. `Random` - 28 edges
10. `FakeRandom` - 27 edges

## Surprising Connections (you probably didn't know these)
- `PublishRecord` --references--> `GameEvent`  [EXTRACTED]
  tests/fixtures/ui.ts → src/core/events/GameEvent.ts
- `EffectApplierDependencies` --references--> `Random`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/core/Random.ts
- `BootResult` --references--> `Game`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/Game.ts
- `BootstrapDependencies` --references--> `Game`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/Game.ts
- `RecordingGame` --implements--> `Game`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/Game.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase 4 (React) ordered systems** — docs_developer_shared_rules_scheduler, docs_developer_hazards_hazard_system, docs_developer_npcs_dialoguesystem, docs_developer_puzzles_puzzle_system, docs_developer_hints_hint_system [EXTRACTED 1.00]
- **Primitives forming the shared rule spine** — docs_developer_shared_rules_condition, docs_developer_shared_rules_trigger, docs_developer_shared_rules_effect, docs_developer_shared_rules_scheduler, docs_developer_shared_rules_effectapplier [EXTRACTED 1.00]
- **Score flows through ScoreTracker** — docs_developer_shared_rules_scoretracker, docs_developer_puzzles_per_puzzle_scoring, docs_developer_combat_quiz_scoring, docs_developer_hints_hint_penalty [EXTRACTED 1.00]
- **Content authoring and review workflow** — docs_developer_content_rules_bible, docs_developer_content_rules_card, docs_developer_content_rules_workflowgates, docs_developer_content_rules_contentcritic, docs_developer_content_rules_pckreviewer, docs_developer_content_rules_structuralvalidationgates [INFERRED 0.75]
- **One-command turn pipeline** — docs_developer_architecture_turnpipeline, docs_developer_application_and_ui_command, docs_developer_application_and_ui_gameevent, docs_developer_application_and_ui_eventbus, docs_developer_application_and_ui_effecteventmapping, docs_developer_application_and_ui_scoretracker, docs_developer_application_and_ui_session [INFERRED 0.75]
- **Save lifecycle flow** — docs_developer_storage_schema_savedto, docs_developer_storage_schema_persistedshape, docs_developer_architecture_savemanager, docs_developer_storage_schema_storageadapter, docs_developer_storage_schema_quarantine, docs_developer_storage_schema_loadresult, docs_developer_storage_schema_restoretimederivation [INFERRED 0.75]

## Communities (72 total, 26 thin omitted)

### Community 0 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 1 - "Strict TypeScript Settings"
Cohesion: 0.07
Nodes (28): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+20 more)

### Community 2 - "Mechanics Data Models"
Cohesion: 0.08
Nodes (22): Quiz, quizAttempts / QuizStateDto, Hazard, HazardCatalogue, HazardSystem, HintLevel, HintSequence, HintSystem (+14 more)

### Community 3 - "Application and UI Contracts"
Cohesion: 0.08
Nodes (27): Catalogue<T> (declaration-order registry), Canonical Command union, ContentBundle, Effect-to-event mapping, EventBus, Game façade, Canonical GameEvent union, MetaAction union (+19 more)

### Community 4 - "OpenCode Agent Configuration"
Cohesion: 0.11
Nodes (17): agents, content-editor, permissions, command, type, default_agent, command, type (+9 more)

### Community 5 - "main.ts"
Cohesion: 0.12
Nodes (20): Clock, SaveManagerDependencies, loadContent(), createEventBus(), EventBus, BootResult, bootstrap(), BootstrapDependencies (+12 more)

### Community 6 - "ContentBundle.ts"
Cohesion: 0.05
Nodes (51): START_POSITION, startRoom, ActorDefinition, AreaDefinition, actorStates, actors, areas, conversationTopics (+43 more)

### Community 7 - "Persistence and Save Schema"
Cohesion: 0.29
Nodes (7): GameState, SaveManager, Static-first site, Item ownership invariant, Persisted shape (GameStateDto), SaveDto envelope, StorageAdapter port

### Community 8 - "ContentGates.test.ts"
Cohesion: 0.13
Nodes (11): Data, gateFindings(), ParsedRoom, npcFindings(), cardText(), conformingCardSet(), expectSameMembers(), findingText() (+3 more)

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
Cohesion: 0.08
Nodes (10): absentElement(), FakeDocument, FakeElement, findButton(), hasMatchingAncestors(), isTokenMatch(), makeFakeDocument(), press() (+2 more)

### Community 35 - "contentToolchain.ts"
Cohesion: 0.13
Nodes (16): PER_AREA_PATHS, CardFile, GeneratorModule, HINTS_PATH, loadGenerator(), loadScaffolder(), loadSchema(), loadTool() (+8 more)

### Community 36 - "mechanics.ts"
Cohesion: 0.11
Nodes (45): createEffectApplier(), puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, DOOR_FLAG (+37 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.16
Nodes (29): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+21 more)

### Community 38 - "content.ts"
Cohesion: 0.12
Nodes (34): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+26 more)

### Community 39 - "helpers.ts"
Cohesion: 0.10
Nodes (28): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+20 more)

### Community 40 - "finding"
Cohesion: 0.05
Nodes (132): bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings(), text() (+124 more)

### Community 41 - "GameEvent.ts"
Cohesion: 0.20
Nodes (9): ComposedReactionDependencies, HazardSystem, HintSystem, DialogueSystem, PuzzleSystem, createScheduler(), Scheduler, SchedulerDependencies (+1 more)

### Community 42 - "parser.ts"
Cohesion: 0.12
Nodes (21): CommandHandler, CHEST_ID, DOOR_ID, KEY_A, KEY_B, loadParser(), loadTokenizer(), loadVerbTable() (+13 more)

### Community 43 - "vitest"
Cohesion: 0.14
Nodes (28): makeEnvelope(), SAVE_KEY, allText(), Bootstrap, BootstrapDependencies, descendants(), documentState, FakeBus (+20 more)

### Community 44 - "verbs/index.ts"
Cohesion: 0.20
Nodes (19): describeRoom(), describeTarget(), fixedMessage(), flagPrefix(), getCommandHandler, goHandler(), HANDLERS, hasItem() (+11 more)

### Community 45 - "Parser.ts"
Cohesion: 0.10
Nodes (20): ExitDefinition, ParsedCommand, DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, MultiwordAlias, parseRaw() (+12 more)

### Community 46 - "Game.ts"
Cohesion: 0.13
Nodes (20): ComposedReaction, createComposedReaction(), createGame(), DIRECTION_NAMES, doubleIdCommand(), END_STATE_COMMANDS, initialBatch(), isDirection() (+12 more)

### Community 47 - "zone1.ts"
Cohesion: 0.15
Nodes (21): generatedRoomIds(), zone1Cards(), zone1Generation(), CardSet, ParsedCardSet, ValidationOptions, cardData(), emittedEntries() (+13 more)

### Community 48 - "persistence.ts"
Cohesion: 0.14
Nodes (23): asRuntime(), EffectApplierDependencies, envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, importModule(), loadEffectApplier() (+15 more)

### Community 49 - "GameStateDto"
Cohesion: 0.12
Nodes (8): LoadResult, SaveDto, SaveManager, GameStateDto, MemoryStorage, RecordingGameOptions, BootSetupOptions, FakeSaveManager

### Community 51 - "cli.ts"
Cohesion: 0.18
Nodes (12): ContentIo, ScaffoldOptions, ScaffoldResult, bodyFor(), FILES, header(), roomsScaffold(), RULES (+4 more)

### Community 52 - "NpcGates.test.ts"
Cohesion: 0.24
Nodes (8): actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData(), topic()

### Community 53 - "PuzzleSystem.ts"
Cohesion: 0.29
Nodes (8): FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient(), isPossessionOnly(), markFired(), reactionFor(), shouldSkip(), solveEffects()

### Community 54 - "GameEvent"
Cohesion: 0.14
Nodes (12): vitest, Session, loadNameResolver(), loadSeam(), EventBusFactory, FormatEventFunction, loadEventBus(), loadFormatEvent() (+4 more)

### Community 55 - "GameWindow.ts"
Cohesion: 0.05
Nodes (27): Game, AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView, SpecStatus (+19 more)

### Community 56 - "package.json"
Cohesion: 0.08
Nodes (35): description, devDependencies, eslint@^10.15.0, @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, markdownlint-cli2@^0.24.2 (+27 more)

### Community 57 - "ScoreTracker.ts"
Cohesion: 0.25
Nodes (11): Announce, award(), createScoreTracker(), hasScoreFor(), processEvent(), progressEntry(), puzzleSolved(), quizEnded() (+3 more)

### Community 58 - "vitest"
Cohesion: 0.15
Nodes (13): npcCards(), TopicEntry, topicsCard(), Finding, GeneratedFile, generatedFile(), HAZARDS_PATH, loadValidation() (+5 more)

### Community 60 - "ContentBundle"
Cohesion: 0.13
Nodes (21): GameDependencies, ContentBundle, QuizSystem, Command, EffectApplier, GameState, createHazardSystem(), FiredThisTurn (+13 more)

### Community 61 - "GameState.ts"
Cohesion: 0.16
Nodes (11): createFromDto(), createInitial(), RuntimeGameState, stateToDto(), HazardStateDto, HintStateDto, NpcStateDto, PuzzlePhase (+3 more)

### Community 62 - "validateContent.ts"
Cohesion: 0.13
Nodes (21): aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified, ownerProblems() (+13 more)

### Community 63 - "content/schema.ts"
Cohesion: 0.24
Nodes (12): ParseResult, AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape, KINDS, nullFindings() (+4 more)

### Community 64 - "EffectApplier.ts"
Cohesion: 0.29
Nodes (10): applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), EffectApplierDependencies, hazardTriggeredEvent() (+2 more)

### Community 65 - "ContentGeneration.test.ts"
Cohesion: 0.28
Nodes (7): CardData, cleanParsedSet(), definition(), roomData(), AREA_ID, GENERATED_PATHS, GenerationResult

### Community 68 - "SourceHygiene.test.ts"
Cohesion: 0.33
Nodes (4): CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES

### Community 70 - "GameEvent"
Cohesion: 0.23
Nodes (5): GameEvent, SchedulerContract, EffectApplierLike, RecordingBus, MemoryBus

### Community 71 - "ConditionEvaluator.test.ts"
Cohesion: 0.40
Nodes (3): AreaProgress, BASE_DTO, HOME_POSITION

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 352 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (4× useful, score=3.967332817)
- `SaveControls` (3× useful, score=2.991185329)
- `TitleScreen` (3× useful, score=2.991185329)
- `OutputLog` (2× useful, score=1.994153205)
- `GameEvent` (2× useful, score=1.977203976)
- `Turn pipeline (buffered events)` (2× useful, score=1.974019877)
- `NameResolver` (2× useful, score=1.974019877)
- `validateContent` (2× useful, score=1.958878758)
- `Structural validation gates` (2× useful, score=1.958878758) _(code changed — re-verify)_
- `eslint.config.js` (2× useful, score=1.953059278)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ContentBundle` connect `ContentBundle` to `main.ts`, `ContentBundle.ts`, `mechanics.ts`, `SaveManager.ts`, `content.ts`, `finding`, `GameEvent.ts`, `parser.ts`, `vitest`, `Game.ts`, `zone1.ts`, `persistence.ts`, `GameStateDto`, `PuzzleSystem.ts`, `GameEvent`, `GameWindow.ts`, `ScoreTracker.ts`, `GameState.ts`, `validateContent.ts`, `NameResolver.ts`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `GameEvent` to `ContentGeneration.test.ts`, `SaveDto.ts`, `contentToolchain.ts`, `SourceHygiene.test.ts`, `mechanics.ts`, `content.ts`, `ConditionEvaluator.test.ts`, `ContentGates.test.ts`, `parser.ts`, `vitest`, `zone1.ts`, `persistence.ts`, `NpcGates.test.ts`, `package.json`, `vitest`, `validateContent.ts`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._
- **Should `Application and UI Contracts` be split into smaller, more focused modules?**
  _Cohesion score 0.08262108262108261 - nodes in this community are weakly interconnected._