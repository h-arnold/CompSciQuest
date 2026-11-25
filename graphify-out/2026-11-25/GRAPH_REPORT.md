# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 205 files · ~121,543 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .jsonc 1, .css 1)

## Summary
- 1493 nodes · 4618 edges · 80 communities (57 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `40677493`
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
- npcs.ts
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
- contentToolchain.ts
- mechanics.ts
- SaveManager.ts
- content.ts
- helpers.ts
- adapt.ts
- GameEvent
- parser.ts
- ConversationFlow.ts
- verbs/index.ts
- validateContent.ts
- Game.ts
- zone1.ts
- persistence.ts
- GameStateDto
- node-shims.d.ts
- cli.ts
- NpcGates.test.ts
- .makeActions
- uiSetup.ts
- GameViewData.ts
- package.json
- ScoreTracker.ts
- vitest
- common.ts
- domain.ts
- GameState.ts
- asText
- content/schema.ts
- Boot.test.ts
- validate.ts
- collection
- LoadResult
- ContentBundle
- adapt.ts
- Effect
- FakeElement
- localBundle.ts
- stringList
- devDependencies
- eslint.config.js
- vite@^8.3.8
- ContentGates.test.ts
- Condition
- SourceHygiene.test.ts

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 79 edges
2. `GameEvent` - 69 edges
3. `vitest` - 63 edges
4. `asText()` - 56 edges
5. `finding()` - 56 edges
6. `GameState` - 55 edges
7. `collection()` - 39 edges
8. `Effect` - 38 edges
9. `Random` - 35 edges
10. `FakeRandom` - 31 edges

## Surprising Connections (you probably didn't know these)
- `BootstrapDependencies` --references--> `Game`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/Game.ts
- `RecordingGame` --implements--> `Game`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/Game.ts
- `TurnGameDependencies` --references--> `SaveManager`  [EXTRACTED]
  tests/fixtures/turn.ts → src/application/SaveManager.ts
- `BootstrapDependencies` --references--> `SaveManager`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/SaveManager.ts
- `FakeSaveManager` --implements--> `SaveManager`  [EXTRACTED]
  tests/fixtures/uiSetup.ts → src/application/SaveManager.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase 4 (React) ordered systems** — docs_developer_shared_rules_scheduler, docs_developer_hazards_hazard_system, docs_developer_npcs_dialoguesystem, docs_developer_puzzles_puzzle_system, docs_developer_hints_hint_system [EXTRACTED 1.00]
- **Primitives forming the shared rule spine** — docs_developer_shared_rules_condition, docs_developer_shared_rules_trigger, docs_developer_shared_rules_effect, docs_developer_shared_rules_scheduler, docs_developer_shared_rules_effectapplier [EXTRACTED 1.00]
- **Score flows through ScoreTracker** — docs_developer_shared_rules_scoretracker, docs_developer_puzzles_per_puzzle_scoring, docs_developer_combat_quiz_scoring, docs_developer_hints_hint_penalty [EXTRACTED 1.00]
- **Content authoring and review workflow** — docs_developer_content_rules_bible, docs_developer_content_rules_card, docs_developer_content_rules_workflowgates, docs_developer_content_rules_contentcritic, docs_developer_content_rules_pckreviewer, docs_developer_content_rules_structuralvalidationgates [INFERRED 0.75]
- **One-command turn pipeline** — docs_developer_architecture_turnpipeline, docs_developer_application_and_ui_command, docs_developer_application_and_ui_gameevent, docs_developer_application_and_ui_eventbus, docs_developer_application_and_ui_effecteventmapping, docs_developer_application_and_ui_scoretracker, docs_developer_application_and_ui_session [INFERRED 0.75]
- **Save lifecycle flow** — docs_developer_storage_schema_savedto, docs_developer_storage_schema_persistedshape, docs_developer_architecture_savemanager, docs_developer_storage_schema_storageadapter, docs_developer_storage_schema_quarantine, docs_developer_storage_schema_loadresult, docs_developer_storage_schema_restoretimederivation [INFERRED 0.75]

## Communities (80 total, 23 thin omitted)

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
Cohesion: 0.13
Nodes (14): command, type, default_agent, command, type, mcp, servers, permissions (+6 more)

### Community 5 - "main.ts"
Cohesion: 0.23
Nodes (10): loadContent(), createEventBus(), bootstrap(), browserDownload(), browserOpenSaveFile(), seededRandom(), startBrowserApp(), systemClock() (+2 more)

### Community 6 - "ContentBundle.ts"
Cohesion: 0.10
Nodes (20): area, START_POSITION, startRoom, ActorDefinition, AreaDefinition, actors, areas, conversationTopics (+12 more)

### Community 7 - "Persistence and Save Schema"
Cohesion: 0.29
Nodes (7): GameState, SaveManager, Static-first site, Item ownership invariant, Persisted shape (GameStateDto), SaveDto envelope, StorageAdapter port

### Community 8 - "npcs.ts"
Cohesion: 0.06
Nodes (75): vitest, formatEvent(), label(), topicLabel(), ACTOR_ALIAS, ACTOR_ID, actorState(), always (+67 more)

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
Cohesion: 0.13
Nodes (14): absentElement(), descendants(), documentState, FakeDocument, FakeEvent, FakeKeyboardEvent, findByClass(), findFirstByClass() (+6 more)

### Community 35 - "contentToolchain.ts"
Cohesion: 0.11
Nodes (19): PER_AREA_PATHS, CardFile, expectSameMembers(), GeneratorModule, HINTS_PATH, loadGenerator(), loadScaffolder(), loadSchema() (+11 more)

### Community 36 - "mechanics.ts"
Cohesion: 0.08
Nodes (59): applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), createEffectApplier(), EffectApplierDependencies (+51 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.16
Nodes (29): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+21 more)

### Community 38 - "content.ts"
Cohesion: 0.14
Nodes (30): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+22 more)

### Community 39 - "helpers.ts"
Cohesion: 0.09
Nodes (31): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+23 more)

### Community 40 - "adapt.ts"
Cohesion: 0.15
Nodes (22): GeneratedFile, GenerationResult, ParsedCard, CatalogueEmit, cleanEntry(), emitCatalogue(), indentJson(), stripAuthoring() (+14 more)

### Community 41 - "GameEvent"
Cohesion: 0.10
Nodes (18): ComposedReaction, ComposedReactionDependencies, GameDependencies, GameEvent, HazardSystem, HintSystem, DialogueSystem, PuzzleSystem (+10 more)

### Community 42 - "parser.ts"
Cohesion: 0.07
Nodes (37): CommandHandler, ParsedCommand, DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, MultiwordAlias, parseRaw() (+29 more)

### Community 43 - "ConversationFlow.ts"
Cohesion: 0.09
Nodes (45): createNameResolver(), createTopicResolver(), TopicResolver, activeNode(), applyAll(), applyTopicEffects(), createNpcTopicResolver(), endConversation() (+37 more)

### Community 44 - "verbs/index.ts"
Cohesion: 0.21
Nodes (18): describeRoom(), describeTarget(), fixedMessage(), flagPrefix(), goHandler(), HANDLERS, hasItem(), inventoryHandler() (+10 more)

### Community 45 - "validateContent.ts"
Cohesion: 0.13
Nodes (21): aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified, ownerProblems() (+13 more)

### Community 46 - "Game.ts"
Cohesion: 0.13
Nodes (22): createComposedReaction(), createGame(), DIRECTION_NAMES, doubleIdCommand(), END_STATE_COMMANDS, initialBatch(), isDirection(), noArgumentCommand() (+14 more)

### Community 47 - "zone1.ts"
Cohesion: 0.13
Nodes (23): generatedRoomIds(), zone1Cards(), zone1Generation(), GENERATED_PATHS, GenerationResult, ParsedCardSet, ValidationOptions, allIds() (+15 more)

### Community 48 - "persistence.ts"
Cohesion: 0.10
Nodes (22): Clock, Game, SaveManager, SaveManagerDependencies, EventBus, Session, BootResult, BootstrapDependencies (+14 more)

### Community 49 - "GameStateDto"
Cohesion: 0.30
Nodes (4): QuarantineDto, LoadFailureReason, SaveDto, GameStateDto

### Community 51 - "cli.ts"
Cohesion: 0.10
Nodes (25): CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards(), ROOT (+17 more)

### Community 52 - "NpcGates.test.ts"
Cohesion: 0.24
Nodes (8): actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData(), topic()

### Community 53 - ".makeActions"
Cohesion: 0.11
Nodes (5): loadFailureMessage(), MESSAGES, SaveActions, SaveControls, Terminal

### Community 54 - "uiSetup.ts"
Cohesion: 0.16
Nodes (7): FakeBus, installFakeDocument(), makeViewData(), RecordingGame, BootSetup, DownloadCall, makeBootSetup()

### Community 55 - "GameViewData.ts"
Cohesion: 0.11
Nodes (15): AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView, SpecStatus, SessionStatus (+7 more)

### Community 56 - "package.json"
Cohesion: 0.17
Nodes (11): description, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, zod@^4.6.7, name, private, type, version (+3 more)

### Community 57 - "ScoreTracker.ts"
Cohesion: 0.32
Nodes (11): Announce, award(), createScoreTracker(), hasScoreFor(), processEvent(), progressEntry(), puzzleSolved(), quizEnded() (+3 more)

### Community 58 - "vitest"
Cohesion: 0.14
Nodes (16): CardData, cleanParsedSet(), definition(), roomData(), npcCards(), TopicEntry, topicsCard(), AREA_ID (+8 more)

### Community 59 - "common.ts"
Cohesion: 0.21
Nodes (17): CardSet, Finding, ParsedCardSet, ValidateResult, ValidationOptions, asObjectArray(), DIRECTIONS, EFFECT_KINDS (+9 more)

### Community 60 - "domain.ts"
Cohesion: 0.20
Nodes (10): ExitDefinition, RoomDefinition, Exit, Room, Precondition, World, Direction, GameObject (+2 more)

### Community 61 - "GameState.ts"
Cohesion: 0.17
Nodes (9): AreaProgress, RuntimeGameState, HazardStateDto, HintStateDto, PuzzlePhase, PuzzleStateDto, QuizStateDto, RoomStateDto (+1 more)

### Community 62 - "asText"
Cohesion: 0.30
Nodes (17): sharedFindings(), allEffects(), areaLikes(), asText(), auditedAreaLikes(), idsOf(), startFindings(), AreaLike (+9 more)

### Community 63 - "content/schema.ts"
Cohesion: 0.25
Nodes (15): ParseResult, asArray(), asRecord(), AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape (+7 more)

### Community 64 - "Boot.test.ts"
Cohesion: 0.26
Nodes (15): makeEnvelope(), QUARANTINE_KEY, SAVE_KEY, allText(), Bootstrap, BootstrapDependencies, findButton(), loadBootstrap() (+7 more)

### Community 65 - "validate.ts"
Cohesion: 0.25
Nodes (13): asNumber(), CardEntry, checkHint(), ladderFindings(), levelFindings(), penaltyFindings(), targetFindings(), UNLOCK_PREFIXES (+5 more)

### Community 66 - "collection"
Cohesion: 0.21
Nodes (22): collection(), coverageIds(), knownTopicIds(), aliasFindings(), badPrefix(), checkContentIds(), COLLECTIONS, coverageTopicFindings() (+14 more)

### Community 67 - "LoadResult"
Cohesion: 0.15
Nodes (5): LoadResult, MemoryStorage, RecordingGameOptions, BootSetupOptions, FakeSaveManager

### Community 68 - "ContentBundle"
Cohesion: 0.08
Nodes (32): Catalogue, ContentBundle, NameResolver, EffectApplier, GameState, createHazardSystem(), FiredThisTurn, HazardSystemDependencies (+24 more)

### Community 69 - "adapt.ts"
Cohesion: 0.23
Nodes (11): items, catalogueOf(), ItemDefinition, bundleOf(), gateOf(), isTrue(), number(), numbers() (+3 more)

### Community 70 - "Effect"
Cohesion: 0.13
Nodes (15): QuizSystem, Command, holdsItem(), isTalking(), message(), npcHandler(), Effect, Hazard (+7 more)

### Community 71 - "FakeElement"
Cohesion: 0.13
Nodes (3): FakeElement, press(), press()

### Community 72 - "localBundle.ts"
Cohesion: 0.15
Nodes (11): actorStates, questions, quizzes, Quiz, QuizQuestion, ActorState, LOCAL_AREA_ID, LOCAL_NORTH_ROOM_ID (+3 more)

### Community 73 - "stringList"
Cohesion: 0.26
Nodes (18): authoringOf(), finding(), stringList(), checkNpc(), defaultTopicFindings(), nodeTopicFindings(), readyStateFindings(), reservedFindings() (+10 more)

### Community 74 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@^10.15.0, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, typescript-7@npm:typescript@^7.0.2, vitest@^5.1.1, yaml@^2.9.1, eslint (+4 more)

### Community 75 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 77 - "ContentGates.test.ts"
Cohesion: 0.11
Nodes (16): Data, gateFindings(), cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), npcFindings(), CardSet (+8 more)

### Community 78 - "Condition"
Cohesion: 0.43
Nodes (4): puzzles, HintLevel, Puzzle, Condition

### Community 79 - "SourceHygiene.test.ts"
Cohesion: 0.33
Nodes (4): CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 382 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (4× useful, score=3.961645723)
- `putHandler()` (3× useful, score=2.99195112)
- `SaveControls` (3× useful, score=2.986897523)
- `TitleScreen` (3× useful, score=2.986897523)
- `formatEvent()` (2× useful, score=1.995670239)
- `resolveGameCommand()` (2× useful, score=1.992492376)
- `OutputLog` (2× useful, score=1.991294626)
- `GameEvent` (2× useful, score=1.974369693)
- `Turn pipeline (buffered events)` (2× useful, score=1.971190158)
- `NameResolver` (2× useful, score=1.971190158)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `npcs.ts` to `Boot.test.ts`, `ui.ts`, `contentToolchain.ts`, `mechanics.ts`, `content.ts`, `devDependencies`, `parser.ts`, `ConversationFlow.ts`, `ContentGates.test.ts`, `validateContent.ts`, `zone1.ts`, `SourceHygiene.test.ts`, `persistence.ts`, `GameStateDto`, `NpcGates.test.ts`, `package.json`, `vitest`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `main.ts`, `ContentBundle.ts`, `npcs.ts`, `ui.ts`, `mechanics.ts`, `SaveManager.ts`, `content.ts`, `GameEvent`, `parser.ts`, `ConversationFlow.ts`, `validateContent.ts`, `Game.ts`, `zone1.ts`, `persistence.ts`, `uiSetup.ts`, `ScoreTracker.ts`, `domain.ts`, `GameState.ts`, `Boot.test.ts`, `LoadResult`, `adapt.ts`, `Effect`, `localBundle.ts`, `Condition`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `GameEvent` to `ui.ts`, `LoadResult`, `mechanics.ts`, `ContentBundle`, `Effect`, `npcs.ts`, `parser.ts`, `ConversationFlow.ts`, `Game.ts`, `persistence.ts`, `.makeActions`, `uiSetup.ts`, `GameViewData.ts`, `ScoreTracker.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._