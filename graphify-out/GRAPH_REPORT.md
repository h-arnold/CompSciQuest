# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 215 files · ~129,519 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .jsonc 1, .css 1)

## Summary
- 1565 nodes · 4932 edges · 80 communities (55 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 77 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0e2798bc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scripts
- Strict TypeScript Settings
- Mechanics Data Models
- Application and UI Contracts
- OpenCode Agent Configuration
- GameState
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
- SaveActions
- contentToolchain.ts
- mechanics.ts
- SaveManager.ts
- content.ts
- helpers.ts
- adapt.ts
- GameEvent
- SpecTopic
- ConversationFlow.ts
- verbs/index.ts
- validateContent.ts
- Game.ts
- zone1.ts
- persistence.ts
- LoadResult
- node-shims.d.ts
- cli.ts
- NpcGates.test.ts
- Game
- ui.ts
- GameViewData.ts
- package.json
- ScoreTracker.ts
- vitest
- common.ts
- GameState.ts
- HintFlow.test.ts
- asText
- content/schema.ts
- PuzzleGraph.ts
- validate.ts
- collection
- authored.ts
- ContentBundle
- adapt.ts
- turn.ts
- FakeElement
- localBundle.ts
- stringList
- devDependencies
- eslint.config.js
- vite@^8.3.8
- ContentGates.test.ts
- Condition
- ValidationModule

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 85 edges
2. `GameEvent` - 79 edges
3. `vitest` - 72 edges
4. `GameState` - 58 edges
5. `asText()` - 56 edges
6. `finding()` - 56 edges
7. `Effect` - 40 edges
8. `collection()` - 39 edges
9. `Random` - 37 edges
10. `FakeRandom` - 36 edges

## Surprising Connections (you probably didn't know these)
- `PublishRecord` --references--> `GameEvent`  [EXTRACTED]
  tests/fixtures/ui.ts → src/core/events/GameEvent.ts
- `AuthoredGameFixture` --references--> `Game`  [EXTRACTED]
  tests/fixtures/authored.ts → src/application/Game.ts
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

## Communities (80 total, 25 thin omitted)

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

### Community 5 - "GameState"
Cohesion: 0.12
Nodes (13): NameResolver, GameState, FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient(), isPossessionOnly(), markFired(), reactionFor() (+5 more)

### Community 6 - "ContentBundle.ts"
Cohesion: 0.12
Nodes (17): area, START_POSITION, startRoom, ActorDefinition, AreaDefinition, actorStates, actors, areas (+9 more)

### Community 7 - "Persistence and Save Schema"
Cohesion: 0.29
Nodes (7): GameState, SaveManager, Static-first site, Item ownership invariant, Persisted shape (GameStateDto), SaveDto envelope, StorageAdapter port

### Community 8 - "npcs.ts"
Cohesion: 0.08
Nodes (58): formatEvent(), label(), topicLabel(), ACTOR_ALIAS, ACTOR_ID, actorState(), always, askRing (+50 more)

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

### Community 35 - "contentToolchain.ts"
Cohesion: 0.12
Nodes (21): PER_AREA_PATHS, AREA_ID, CardFile, expectSameMembers(), GeneratorModule, HAZARDS_PATH, HINTS_PATH, loadGenerator() (+13 more)

### Community 36 - "mechanics.ts"
Cohesion: 0.06
Nodes (64): vitest, applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), createEffectApplier() (+56 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.17
Nodes (28): ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints(), hasValidNpcs() (+20 more)

### Community 38 - "content.ts"
Cohesion: 0.05
Nodes (68): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+60 more)

### Community 39 - "helpers.ts"
Cohesion: 0.09
Nodes (32): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+24 more)

### Community 40 - "adapt.ts"
Cohesion: 0.15
Nodes (22): GeneratedFile, GenerationResult, ParsedCard, CatalogueEmit, cleanEntry(), emitCatalogue(), indentJson(), stripAuthoring() (+14 more)

### Community 41 - "GameEvent"
Cohesion: 0.16
Nodes (11): ComposedReactionDependencies, GameEvent, HazardSystem, HintSystem, DialogueSystem, PuzzleSystem, Scheduler, TurnContext (+3 more)

### Community 42 - "SpecTopic"
Cohesion: 0.31
Nodes (4): specTopics, SpecTopic, SpecTopicCatalogue, TopicIndexEntry

### Community 43 - "ConversationFlow.ts"
Cohesion: 0.09
Nodes (44): createTopicResolver(), TopicResolver, activeNode(), applyAll(), applyTopicEffects(), createNpcTopicResolver(), endConversation(), expireNode() (+36 more)

### Community 44 - "verbs/index.ts"
Cohesion: 0.21
Nodes (18): describeRoom(), describeTarget(), fixedMessage(), flagPrefix(), goHandler(), HANDLERS, hasItem(), inventoryHandler() (+10 more)

### Community 45 - "validateContent.ts"
Cohesion: 0.17
Nodes (15): aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified, ownerProblems() (+7 more)

### Community 46 - "Game.ts"
Cohesion: 0.13
Nodes (21): ComposedReaction, createComposedReaction(), createGame(), DIRECTION_NAMES, doubleIdCommand(), END_STATE_COMMANDS, initialBatch(), isDirection() (+13 more)

### Community 47 - "zone1.ts"
Cohesion: 0.11
Nodes (25): generatedRoomIds(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES, ParsedCardSet (+17 more)

### Community 48 - "persistence.ts"
Cohesion: 0.13
Nodes (24): Clock, GameDependencies, SaveManager, SaveManagerDependencies, loadContent(), createEventBus(), EventBus, BootResult (+16 more)

### Community 49 - "LoadResult"
Cohesion: 0.16
Nodes (6): QuarantineDto, LoadFailureReason, LoadResult, SaveDto, MESSAGES, FakeSaveManager

### Community 51 - "cli.ts"
Cohesion: 0.10
Nodes (25): CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards(), ROOT (+17 more)

### Community 52 - "NpcGates.test.ts"
Cohesion: 0.24
Nodes (8): actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData(), topic()

### Community 53 - "Game"
Cohesion: 0.14
Nodes (5): Game, GameWindow, loadFailureMessage(), ScorePanel, TitleScreen

### Community 54 - "ui.ts"
Cohesion: 0.10
Nodes (29): makeEnvelope(), QUARANTINE_KEY, allText(), Bootstrap, BootstrapDependencies, descendants(), documentState, FakeBus (+21 more)

### Community 55 - "GameViewData.ts"
Cohesion: 0.10
Nodes (17): AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView, SpecStatus, appendLine() (+9 more)

### Community 56 - "package.json"
Cohesion: 0.17
Nodes (11): description, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, zod@^4.6.7, name, private, type, version (+3 more)

### Community 57 - "ScoreTracker.ts"
Cohesion: 0.23
Nodes (12): Announce, award(), createScoreTracker(), hasScoreFor(), processEvent(), progressEntry(), puzzleSolved(), quizEnded() (+4 more)

### Community 58 - "vitest"
Cohesion: 0.16
Nodes (14): CardData, cleanParsedSet(), definition(), roomData(), npcCards(), TopicEntry, topicsCard(), GENERATED_PATHS (+6 more)

### Community 59 - "common.ts"
Cohesion: 0.21
Nodes (17): CardSet, Finding, ParsedCardSet, ValidateResult, ValidationOptions, asObjectArray(), DIRECTIONS, EFFECT_KINDS (+9 more)

### Community 60 - "GameState.ts"
Cohesion: 0.06
Nodes (33): ExitDefinition, AreaProgress, ParsedCommand, DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, MultiwordAlias (+25 more)

### Community 61 - "HintFlow.test.ts"
Cohesion: 0.22
Nodes (3): Catalogue, catalogueOf(), hintFixture()

### Community 62 - "asText"
Cohesion: 0.30
Nodes (17): sharedFindings(), allEffects(), areaLikes(), asText(), auditedAreaLikes(), idsOf(), startFindings(), AreaLike (+9 more)

### Community 63 - "content/schema.ts"
Cohesion: 0.25
Nodes (15): ParseResult, asArray(), asRecord(), AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape (+7 more)

### Community 64 - "PuzzleGraph.ts"
Cohesion: 0.48
Nodes (6): cycleIds(), firstReady(), puzzleGraphFindings(), repeatedIds(), solveOrder(), unreachableIds()

### Community 65 - "validate.ts"
Cohesion: 0.25
Nodes (13): asNumber(), CardEntry, checkHint(), ladderFindings(), levelFindings(), penaltyFindings(), targetFindings(), UNLOCK_PREFIXES (+5 more)

### Community 66 - "collection"
Cohesion: 0.21
Nodes (22): collection(), coverageIds(), knownTopicIds(), aliasFindings(), badPrefix(), checkContentIds(), COLLECTIONS, coverageTopicFindings() (+14 more)

### Community 67 - "authored.ts"
Cohesion: 0.06
Nodes (44): createSaveManager(), createFromDto(), createInitial(), finishWithWrongAnswers(), questionFor(), wrongAnswer(), authoredBundle, authoredGame() (+36 more)

### Community 68 - "ContentBundle"
Cohesion: 0.14
Nodes (21): ContentBundle, EffectApplier, EffectApplierDependencies, createHazardSystem(), FiredThisTurn, HazardSystemDependencies, NpcDependencies, PuzzleSystemDependencies (+13 more)

### Community 69 - "adapt.ts"
Cohesion: 0.26
Nodes (10): items, ItemDefinition, bundleOf(), gateOf(), isTrue(), number(), numbers(), strings() (+2 more)

### Community 70 - "turn.ts"
Cohesion: 0.10
Nodes (20): QuizSystem, Command, CommandHandler, hasItem(), isTalking(), message(), npcHandler(), Effect (+12 more)

### Community 71 - "FakeElement"
Cohesion: 0.08
Nodes (10): absentElement(), FakeDocument, FakeElement, findButton(), hasMatchingAncestors(), isTokenMatch(), makeFakeDocument(), press() (+2 more)

### Community 72 - "localBundle.ts"
Cohesion: 0.21
Nodes (9): questions, Quiz, QuizQuestion, ActorState, LOCAL_AREA_ID, LOCAL_NORTH_ROOM_ID, LOCAL_START_ROOM_ID, LOCAL_WORLD_ID (+1 more)

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
Cohesion: 0.29
Nodes (6): hints, puzzles, HintLevel, HintSequence, Puzzle, Condition

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 406 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (4× useful, score=3.960914445)
- `putHandler()` (3× useful, score=2.991398837)
- `SaveControls` (3× useful, score=2.986346173)
- `TitleScreen` (3× useful, score=2.986346173)
- `formatEvent()` (2× useful, score=1.995301859)
- `resolveGameCommand()` (2× useful, score=1.992124583) _(code changed — re-verify)_
- `OutputLog` (2× useful, score=1.990927054)
- `GameEvent` (2× useful, score=1.974005245)
- `Turn pipeline (buffered events)` (2× useful, score=1.970826297)
- `NameResolver` (2× useful, score=1.970826297)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `mechanics.ts` to `npcs.ts`, `contentToolchain.ts`, `content.ts`, `GameEvent`, `ConversationFlow.ts`, `validateContent.ts`, `zone1.ts`, `persistence.ts`, `LoadResult`, `NpcGates.test.ts`, `ui.ts`, `package.json`, `vitest`, `GameState.ts`, `HintFlow.test.ts`, `authored.ts`, `turn.ts`, `devDependencies`, `ContentGates.test.ts`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `GameState`, `ContentBundle.ts`, `npcs.ts`, `mechanics.ts`, `SaveManager.ts`, `content.ts`, `GameEvent`, `SpecTopic`, `ConversationFlow.ts`, `validateContent.ts`, `Game.ts`, `zone1.ts`, `persistence.ts`, `Game`, `ui.ts`, `GameViewData.ts`, `ScoreTracker.ts`, `GameState.ts`, `HintFlow.test.ts`, `PuzzleGraph.ts`, `authored.ts`, `adapt.ts`, `turn.ts`, `localBundle.ts`, `Condition`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `GameEvent` to `authored.ts`, `mechanics.ts`, `ContentBundle`, `turn.ts`, `GameState`, `npcs.ts`, `ConversationFlow.ts`, `Game.ts`, `persistence.ts`, `Game`, `ui.ts`, `GameViewData.ts`, `ScoreTracker.ts`, `HintFlow.test.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._