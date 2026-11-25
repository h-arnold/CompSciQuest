# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 217 files · ~136,439 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .jsonc 1, .css 1)

## Summary
- 1658 nodes · 5187 edges · 90 communities (61 shown, 29 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 82 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6bd8dd5c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scripts
- Strict TypeScript Settings
- Mechanics Data Models
- Application and UI Contracts
- OpenCode Agent Configuration
- turn.ts
- content-generated.spec.ts
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
- PuzzleSystem.ts
- content/index.ts
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
- Boot.test.ts
- GameViewData.ts
- package.json
- ScoreTracker.ts
- vitest
- parser.ts
- commandResolution.ts
- HintFlow.test.ts
- asText
- content/schema.ts
- Effect
- validate.ts
- collection
- authored.ts
- ContentBundle
- ui.ts
- persistence.ts
- FakeElement
- localBundle.ts
- stringList
- devDependencies
- eslint.config.js
- vite@^8.3.8
- ContentGates.test.ts
- Condition
- ValidationModule
- HintSystem.ts
- GameWindow
- AuthoredWinPath.test.ts
- GameEvent.ts
- GameEvent
- MemoryStorage
- RecordingGame
- uiSetup.ts
- OutputLog
- Terminal

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 90 edges
2. `GameEvent` - 79 edges
3. `vitest` - 72 edges
4. `GameState` - 61 edges
5. `asText()` - 56 edges
6. `finding()` - 56 edges
7. `Effect` - 42 edges
8. `Random` - 39 edges
9. `collection()` - 39 edges
10. `FakeRandom` - 36 edges

## Surprising Connections (you probably didn't know these)
- `PlayerView` --references--> `Position`  [EXTRACTED]
  e2e/w7-opening-walkthrough.spec.ts → src/types/domain.ts
- `PublishRecord` --references--> `GameEvent`  [EXTRACTED]
  tests/fixtures/ui.ts → src/core/events/GameEvent.ts
- `AuthoredGameFixture` --references--> `Game`  [EXTRACTED]
  tests/fixtures/authored.ts → src/application/Game.ts
- `BootResult` --references--> `Game`  [EXTRACTED]
  tests/fixtures/ui.ts → src/application/Game.ts
- `BootstrapDependencies` --references--> `Game`  [EXTRACTED]
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

## Communities (90 total, 29 thin omitted)

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

### Community 5 - "turn.ts"
Cohesion: 0.17
Nodes (12): Command, CommandHandler, hasItem(), isTalking(), message(), npcHandler(), isConditionMet(), RuleEngine (+4 more)

### Community 6 - "content-generated.spec.ts"
Cohesion: 0.16
Nodes (7): area, START_POSITION, startRoom, ActorDefinition, actors, conversationTopics, nodes

### Community 7 - "Persistence and Save Schema"
Cohesion: 0.29
Nodes (7): GameState, SaveManager, Static-first site, Item ownership invariant, Persisted shape (GameStateDto), SaveDto envelope, StorageAdapter port

### Community 8 - "npcs.ts"
Cohesion: 0.06
Nodes (65): catalogueOf(), AreaProgress, createFromDto(), RuntimeGameState, stateToDto(), HazardStateDto, HintStateDto, NpcStateDto (+57 more)

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
Nodes (69): applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), createEffectApplier(), endQuiz() (+61 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.15
Nodes (30): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+22 more)

### Community 38 - "content.ts"
Cohesion: 0.14
Nodes (31): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+23 more)

### Community 39 - "helpers.ts"
Cohesion: 0.06
Nodes (52): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+44 more)

### Community 40 - "adapt.ts"
Cohesion: 0.14
Nodes (25): bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings(), text() (+17 more)

### Community 41 - "PuzzleSystem.ts"
Cohesion: 0.14
Nodes (16): ComposedReaction, ComposedReactionDependencies, HazardSystem, HintSystem, DialogueSystem, FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient() (+8 more)

### Community 42 - "content/index.ts"
Cohesion: 0.16
Nodes (11): AreaDefinition, areas, hazards, specTopics, worlds, assembled, specTopics, WorldDefinition (+3 more)

### Community 43 - "ConversationFlow.ts"
Cohesion: 0.09
Nodes (46): TopicResolver, activeNode(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode() (+38 more)

### Community 44 - "verbs/index.ts"
Cohesion: 0.10
Nodes (38): describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible(), matchingInteraction(), normalise() (+30 more)

### Community 45 - "validateContent.ts"
Cohesion: 0.13
Nodes (21): aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified, ownerProblems() (+13 more)

### Community 46 - "Game.ts"
Cohesion: 0.11
Nodes (17): createComposedReaction(), createGame(), END_STATE_COMMANDS, initialBatch(), initialRuntimeState(), MetaAction, createQuizSystem(), getCommandHandler (+9 more)

### Community 47 - "zone1.ts"
Cohesion: 0.11
Nodes (25): generatedRoomIds(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES, ParsedCardSet (+17 more)

### Community 48 - "persistence.ts"
Cohesion: 0.18
Nodes (11): loadContent(), createEventBus(), bootstrap(), browserDownload(), browserOpenSaveFile(), seededRandom(), startBrowserApp(), systemClock() (+3 more)

### Community 49 - "LoadResult"
Cohesion: 0.11
Nodes (12): QuarantineDto, LoadFailureReason, LoadResult, SaveDto, SaveManager, GameStateDto, BootResult, MESSAGES (+4 more)

### Community 51 - "cli.ts"
Cohesion: 0.08
Nodes (31): CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards(), ROOT (+23 more)

### Community 52 - "NpcGates.test.ts"
Cohesion: 0.24
Nodes (8): actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData(), topic()

### Community 54 - "Boot.test.ts"
Cohesion: 0.23
Nodes (17): makeEnvelope(), QUARANTINE_KEY, SAVE_KEY, allText(), Bootstrap, descendants(), flush(), loadBootstrap() (+9 more)

### Community 55 - "GameViewData.ts"
Cohesion: 0.15
Nodes (14): AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView, SpecStatus, SessionStatus (+6 more)

### Community 56 - "package.json"
Cohesion: 0.17
Nodes (11): description, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, zod@^4.6.7, name, private, type, version (+3 more)

### Community 57 - "ScoreTracker.ts"
Cohesion: 0.23
Nodes (14): Announce, award(), awardedReasons, createScoreTracker(), hasAwarded(), hasScoreFor(), markAwarded(), processEvent() (+6 more)

### Community 58 - "vitest"
Cohesion: 0.16
Nodes (14): CardData, cleanParsedSet(), definition(), roomData(), npcCards(), TopicEntry, topicsCard(), GENERATED_PATHS (+6 more)

### Community 59 - "parser.ts"
Cohesion: 0.10
Nodes (28): ParsedCommand, CHEST_ID, DOOR_ID, KEY_A, KEY_B, loadNameResolver(), loadParser(), loadTokenizer() (+20 more)

### Community 60 - "commandResolution.ts"
Cohesion: 0.08
Nodes (35): actorAndRemainder(), conversationCommand(), DIRECTION_NAMES, fallbackPair(), isDirection(), noArgumentCommand(), PUT_PREPOSITIONS, putCommand() (+27 more)

### Community 61 - "HintFlow.test.ts"
Cohesion: 0.20
Nodes (3): Catalogue, messageTexts(), hintFixture()

### Community 62 - "asText"
Cohesion: 0.20
Nodes (30): allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), CardEntry, EFFECT_KINDS, finding() (+22 more)

### Community 63 - "content/schema.ts"
Cohesion: 0.30
Nodes (13): asRecord(), AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape, KINDS, nullFindings() (+5 more)

### Community 64 - "Effect"
Cohesion: 0.13
Nodes (9): QuizSystem, QuizSystemDependencies, Effect, Hazard, HazardCatalogue, FiredThisTurn, Trigger, ScheduledEvent (+1 more)

### Community 65 - "validate.ts"
Cohesion: 0.21
Nodes (17): ParsedCardSet, asNumber(), checkHint(), ladderFindings(), levelFindings(), penaltyFindings(), targetFindings(), UNLOCK_PREFIXES (+9 more)

### Community 66 - "collection"
Cohesion: 0.16
Nodes (29): asArray(), asObjectArray(), collection(), coverageIds(), DIRECTIONS, effectList(), entriesWith(), knownTopicIds() (+21 more)

### Community 67 - "authored.ts"
Cohesion: 0.12
Nodes (25): authoredBundle, authoredGame(), authoredNpc(), authoredState(), AuthoredStateOptions, changedFlags(), eventTypes(), FOREMAN_ID (+17 more)

### Community 68 - "ContentBundle"
Cohesion: 0.13
Nodes (32): Clock, GameDependencies, SaveManagerDependencies, ContentBundle, NameResolver, EffectApplier, EffectApplierDependencies, EventBus (+24 more)

### Community 69 - "ui.ts"
Cohesion: 0.12
Nodes (15): absentElement(), documentState, FakeDocument, FakeEvent, FakeKeyboardEvent, findButton(), findByClass(), findFirstByClass() (+7 more)

### Community 70 - "persistence.ts"
Cohesion: 0.11
Nodes (24): vitest, Session, asRuntime(), envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, loadEffectApplier() (+16 more)

### Community 71 - "FakeElement"
Cohesion: 0.13
Nodes (3): FakeElement, press(), press()

### Community 72 - "localBundle.ts"
Cohesion: 0.13
Nodes (15): actorStates, items, questions, quizzes, rooms, ItemDefinition, RoomDefinition, Quiz (+7 more)

### Community 73 - "stringList"
Cohesion: 0.30
Nodes (12): stringList(), checkPuzzle(), clueFindings(), cycleFindings(), dependencyFindings(), puzzleFindings(), AO_TAGS, checkQuiz() (+4 more)

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

### Community 80 - "HintSystem.ts"
Cohesion: 0.27
Nodes (15): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), hasShownThisTurn(), isHazardPenaltyActive(), markShownThisTurn() (+7 more)

### Community 81 - "GameWindow"
Cohesion: 0.28
Nodes (3): GameWindow, ScorePanel, TitleScreen

### Community 82 - "AuthoredWinPath.test.ts"
Cohesion: 0.26
Nodes (4): AuthoredRun, gateFlag(), lastQuestion(), TRACE_FLAGS

### Community 83 - "GameEvent.ts"
Cohesion: 0.27
Nodes (5): RoomSummary, formatEvent(), label(), topicLabel(), transcript()

### Community 84 - "GameEvent"
Cohesion: 0.23
Nodes (5): GameEvent, AuthoredGameFixture, EffectApplierLike, RecordingBus, MemoryBus

### Community 85 - "MemoryStorage"
Cohesion: 0.22
Nodes (5): finishWithWrongAnswers(), questionFor(), wrongAnswer(), readSave(), MemoryStorage

### Community 87 - "uiSetup.ts"
Cohesion: 0.36
Nodes (4): BootstrapDependencies, FakeBus, BootSetup, DownloadCall

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 425 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (4× useful, score=3.955634022)
- `putHandler()` (3× useful, score=2.987410907) _(code changed — re-verify)_
- `SaveControls` (3× useful, score=2.982364979)
- `TitleScreen` (3× useful, score=2.982364979)
- `formatEvent()` (2× useful, score=1.992641858)
- `resolveGameCommand()` (2× useful, score=1.989468818) _(code changed — re-verify)_
- `OutputLog` (2× useful, score=1.988272884)
- `GameEvent` (2× useful, score=1.971373635)
- `Turn pipeline (buffered events)` (2× useful, score=1.968198925)
- `NameResolver` (2× useful, score=1.968198925)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `persistence.ts` to `turn.ts`, `npcs.ts`, `contentToolchain.ts`, `mechanics.ts`, `content.ts`, `ConversationFlow.ts`, `validateContent.ts`, `zone1.ts`, `LoadResult`, `NpcGates.test.ts`, `Boot.test.ts`, `package.json`, `vitest`, `parser.ts`, `HintFlow.test.ts`, `authored.ts`, `ui.ts`, `devDependencies`, `ContentGates.test.ts`, `AuthoredWinPath.test.ts`, `GameEvent.ts`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `turn.ts`, `content-generated.spec.ts`, `npcs.ts`, `mechanics.ts`, `SaveManager.ts`, `content.ts`, `adapt.ts`, `PuzzleSystem.ts`, `content/index.ts`, `ConversationFlow.ts`, `verbs/index.ts`, `validateContent.ts`, `Game.ts`, `zone1.ts`, `persistence.ts`, `LoadResult`, `Boot.test.ts`, `GameViewData.ts`, `ScoreTracker.ts`, `parser.ts`, `commandResolution.ts`, `HintFlow.test.ts`, `Effect`, `authored.ts`, `ui.ts`, `persistence.ts`, `localBundle.ts`, `Condition`, `HintSystem.ts`, `GameWindow`, `GameEvent.ts`, `uiSetup.ts`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `GameEvent` to `turn.ts`, `npcs.ts`, `mechanics.ts`, `PuzzleSystem.ts`, `ConversationFlow.ts`, `Game.ts`, `LoadResult`, `Game`, `GameViewData.ts`, `ScoreTracker.ts`, `parser.ts`, `HintFlow.test.ts`, `Effect`, `authored.ts`, `ContentBundle`, `ui.ts`, `persistence.ts`, `HintSystem.ts`, `GameWindow`, `AuthoredWinPath.test.ts`, `GameEvent.ts`, `RecordingGame`, `uiSetup.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._