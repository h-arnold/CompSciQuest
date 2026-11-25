# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 230 files · ~149,106 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .jsonc 1, .css 1)

## Summary
- 1804 nodes · 5853 edges · 84 communities (56 shown, 28 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 84 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `530bdede`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scripts
- Strict TypeScript Settings
- Mechanics Data Models
- Application and UI Contracts
- OpenCode Agent Configuration
- GameEvent
- content/index.ts
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
- npcTopicOverlap.ts
- contentToolchain.ts
- mechanics.ts
- SaveManager.ts
- content.ts
- helpers.ts
- adapt.ts
- Game
- SpecTopic
- ConversationFlow.ts
- verbs/index.ts
- validateContent.ts
- Game.ts
- zone1.ts
- ContentBundle
- GameStateDto
- node-shims.d.ts
- cli.ts
- FakeElement
- common.ts
- scenery-validation.test.ts
- GameWindow.ts
- package.json
- ScoreTracker.ts
- ContentGeneration.test.ts
- parser.ts
- ConditionEvaluator.test.ts
- localBundle.ts
- asText
- content/schema.ts
- EffectApplier.ts
- topicOverlap.ts
- collection
- authored.ts
- MemoryStorage
- ui.ts
- persistence.ts
- GameWindow.ts
- ContentBundle.ts
- SaveActions
- devDependencies
- eslint.config.js
- vite@^8.3.8
- domain.ts
- HintQuizViews.test.ts
- ValidationModule
- HintSystem.ts
- OutputLog
- NpcGates.test.ts
- SeededRandom

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 94 edges
2. `vitest` - 84 edges
3. `GameEvent` - 83 edges
4. `GameState` - 63 edges
5. `asText()` - 62 edges
6. `finding()` - 58 edges
7. `Effect` - 44 edges
8. `collection()` - 42 edges
9. `Random` - 40 edges
10. `FakeRandom` - 38 edges

## Surprising Connections (you probably didn't know these)
- `EffectApplierDependencies` --references--> `Random`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/core/Random.ts
- `PublishRecord` --references--> `GameEvent`  [EXTRACTED]
  tests/fixtures/ui.ts → src/core/events/GameEvent.ts
- `awardFixture()` --calls--> `createScoreTracker()`  [EXTRACTED]
  tests/w7/score-consistency.test.ts → src/core/scoring/ScoreTracker.ts
- `zone1Generation()` --calls--> `generateContent()`  [EXTRACTED]
  tests/content/GeneratedContent.test.ts → tools/content/generate.ts
- `MemoryStorage` --implements--> `StorageAdapter`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/storage/StorageAdapter.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase 4 (React) ordered systems** — docs_developer_shared_rules_scheduler, docs_developer_hazards_hazard_system, docs_developer_npcs_dialoguesystem, docs_developer_puzzles_puzzle_system, docs_developer_hints_hint_system [EXTRACTED 1.00]
- **Primitives forming the shared rule spine** — docs_developer_shared_rules_condition, docs_developer_shared_rules_trigger, docs_developer_shared_rules_effect, docs_developer_shared_rules_scheduler, docs_developer_shared_rules_effectapplier [EXTRACTED 1.00]
- **Score flows through ScoreTracker** — docs_developer_shared_rules_scoretracker, docs_developer_puzzles_per_puzzle_scoring, docs_developer_combat_quiz_scoring, docs_developer_hints_hint_penalty [EXTRACTED 1.00]
- **Content authoring and review workflow** — docs_developer_content_rules_bible, docs_developer_content_rules_card, docs_developer_content_rules_workflowgates, docs_developer_content_rules_contentcritic, docs_developer_content_rules_pckreviewer, docs_developer_content_rules_structuralvalidationgates [INFERRED 0.75]
- **One-command turn pipeline** — docs_developer_architecture_turnpipeline, docs_developer_application_and_ui_command, docs_developer_application_and_ui_gameevent, docs_developer_application_and_ui_eventbus, docs_developer_application_and_ui_effecteventmapping, docs_developer_application_and_ui_scoretracker, docs_developer_application_and_ui_session [INFERRED 0.75]
- **Save lifecycle flow** — docs_developer_storage_schema_savedto, docs_developer_storage_schema_persistedshape, docs_developer_architecture_savemanager, docs_developer_storage_schema_storageadapter, docs_developer_storage_schema_quarantine, docs_developer_storage_schema_loadresult, docs_developer_storage_schema_restoretimederivation [INFERRED 0.75]

## Communities (84 total, 28 thin omitted)

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

### Community 5 - "GameEvent"
Cohesion: 0.12
Nodes (18): ComposedReactionDependencies, GameEvent, HazardSystem, HintSystem, DialogueSystem, FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient() (+10 more)

### Community 6 - "content/index.ts"
Cohesion: 0.10
Nodes (20): area, START_POSITION, startRoom, ActorDefinition, AreaDefinition, actors, areas, conversationTopics (+12 more)

### Community 7 - "Persistence and Save Schema"
Cohesion: 0.29
Nodes (7): GameState, SaveManager, Static-first site, Item ownership invariant, Persisted shape (GameStateDto), SaveDto envelope, StorageAdapter port

### Community 8 - "npcs.ts"
Cohesion: 0.08
Nodes (59): catalogueOf(), createFromDto(), stateToDto(), formatEvent(), label(), topicLabel(), ACTOR_ALIAS, ACTOR_ID (+51 more)

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

### Community 34 - "npcTopicOverlap.ts"
Cohesion: 0.11
Nodes (68): gNpc06(), gNpc07(), gNpc08(), gNpc09(), gNpc10(), gNpc11(), gNpc12(), gNpc13() (+60 more)

### Community 35 - "contentToolchain.ts"
Cohesion: 0.09
Nodes (22): Data, PER_AREA_PATHS, AREA_ID, CardFile, expectSameMembers(), GATE_NAMES, GeneratorModule, HAZARDS_PATH (+14 more)

### Community 36 - "mechanics.ts"
Cohesion: 0.09
Nodes (52): createEffectApplier(), puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, DOOR_FLAG (+44 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.09
Nodes (40): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+32 more)

### Community 38 - "content.ts"
Cohesion: 0.14
Nodes (32): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+24 more)

### Community 39 - "helpers.ts"
Cohesion: 0.06
Nodes (51): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+43 more)

### Community 40 - "adapt.ts"
Cohesion: 0.13
Nodes (28): bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings(), text() (+20 more)

### Community 41 - "Game"
Cohesion: 0.16
Nodes (3): Game, GameWindow, ScorePanel

### Community 42 - "SpecTopic"
Cohesion: 0.31
Nodes (4): specTopics, SpecTopic, SpecTopicCatalogue, TopicIndexEntry

### Community 43 - "ConversationFlow.ts"
Cohesion: 0.08
Nodes (49): createNameResolver(), createTopicResolver(), TopicResolver, activeNode(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver() (+41 more)

### Community 44 - "verbs/index.ts"
Cohesion: 0.11
Nodes (36): describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible(), matchingInteraction(), normalise() (+28 more)

### Community 45 - "validateContent.ts"
Cohesion: 0.13
Nodes (21): aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified, ownerProblems() (+13 more)

### Community 46 - "Game.ts"
Cohesion: 0.10
Nodes (18): ComposedReaction, createComposedReaction(), adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), recordSeed(), MetaAction (+10 more)

### Community 47 - "zone1.ts"
Cohesion: 0.11
Nodes (25): generatedRoomIds(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES, ParsedCardSet (+17 more)

### Community 48 - "ContentBundle"
Cohesion: 0.11
Nodes (34): Clock, GameDependencies, SaveManager, SaveManagerDependencies, ContentBundle, NameResolver, EffectApplier, EffectApplierDependencies (+26 more)

### Community 49 - "GameStateDto"
Cohesion: 0.11
Nodes (6): LoadResult, SaveDto, GameStateDto, RuntimeGameState, RecordingGame, FakeSaveManager

### Community 51 - "cli.ts"
Cohesion: 0.09
Nodes (29): CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards(), ROOT (+21 more)

### Community 52 - "FakeElement"
Cohesion: 0.08
Nodes (12): absentElement(), FakeDocument, FakeElement, findButton(), findByClass(), findFirstByClass(), hasMatchingAncestors(), isTokenMatch() (+4 more)

### Community 53 - "common.ts"
Cohesion: 0.16
Nodes (25): Finding, ParsedCardSet, ValidationOptions, asNumber(), asObjectArray(), DIRECTIONS, EFFECT_KINDS, effectList() (+17 more)

### Community 54 - "scenery-validation.test.ts"
Cohesion: 0.15
Nodes (16): cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), CardSet, cardText(), conformingCardSet(), Finding (+8 more)

### Community 55 - "GameWindow.ts"
Cohesion: 0.15
Nodes (14): AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView, SpecStatus, SessionStatus (+6 more)

### Community 56 - "package.json"
Cohesion: 0.17
Nodes (11): description, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, zod@^4.6.7, name, private, type, version (+3 more)

### Community 57 - "ScoreTracker.ts"
Cohesion: 0.16
Nodes (13): Announce, award(), createScoreTracker(), hasScoreFor(), hasTopicCompletion(), processEvent(), progressEntry(), puzzleSolved() (+5 more)

### Community 58 - "ContentGeneration.test.ts"
Cohesion: 0.16
Nodes (14): CardData, cleanParsedSet(), definition(), roomData(), npcCards(), TopicEntry, topicsCard(), GENERATED_PATHS (+6 more)

### Community 59 - "parser.ts"
Cohesion: 0.07
Nodes (39): Command, CommandHandler, ParsedCommand, hasItem(), isTalking(), message(), npcHandler(), RuleEngine (+31 more)

### Community 60 - "ConditionEvaluator.test.ts"
Cohesion: 0.40
Nodes (3): AreaProgress, BASE_DTO, HOME_POSITION

### Community 61 - "localBundle.ts"
Cohesion: 0.19
Nodes (9): actorStates, items, ItemDefinition, ActorState, LOCAL_AREA_ID, LOCAL_NORTH_ROOM_ID, LOCAL_START_ROOM_ID, LOCAL_WORLD_ID (+1 more)

### Community 62 - "asText"
Cohesion: 0.22
Nodes (23): allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), idsOf(), startFindings(), checkNpc() (+15 more)

### Community 63 - "content/schema.ts"
Cohesion: 0.24
Nodes (15): CardSet, ParseResult, asRecord(), AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape (+7 more)

### Community 64 - "EffectApplier.ts"
Cohesion: 0.10
Nodes (26): QuizQuestion, applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), endQuiz() (+18 more)

### Community 65 - "topicOverlap.ts"
Cohesion: 0.13
Nodes (35): CardEntry, ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf() (+27 more)

### Community 66 - "collection"
Cohesion: 0.15
Nodes (36): asArray(), collection(), coverageIds(), finding(), knownTopicIds(), stringList(), aliasFindings(), badPrefix() (+28 more)

### Community 67 - "authored.ts"
Cohesion: 0.07
Nodes (46): createQuizSystem(), RoomSummary, HintLevel, HintSequence, finishWithWrongAnswers(), questionFor(), wrongAnswer(), activeQuiz() (+38 more)

### Community 68 - "MemoryStorage"
Cohesion: 0.20
Nodes (3): AuthoredGameFixture, MemoryStorage, RecordingBus

### Community 69 - "ui.ts"
Cohesion: 0.14
Nodes (25): makeEnvelope(), allText(), Bootstrap, BootstrapDependencies, descendants(), documentState, FakeBus, FakeEvent (+17 more)

### Community 70 - "persistence.ts"
Cohesion: 0.12
Nodes (29): vitest, asRuntime(), EffectApplierDependencies, EffectApplierLike, envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO (+21 more)

### Community 71 - "GameWindow.ts"
Cohesion: 0.23
Nodes (6): QuarantineDto, LoadFailureReason, loadFailureMessage(), MESSAGES, Terminal, TitleScreen

### Community 72 - "ContentBundle.ts"
Cohesion: 0.11
Nodes (15): Catalogue, Quiz, QuizSystem, QuizSystemDependencies, Effect, Hazard, HazardCatalogue, FiredThisTurn (+7 more)

### Community 74 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@^10.15.0, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, typescript-7@npm:typescript@^7.0.2, vitest@^5.1.1, yaml@^2.9.1, eslint (+4 more)

### Community 75 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 77 - "domain.ts"
Cohesion: 0.06
Nodes (40): PlayerView, actorAndRemainder(), answerCommand(), conversationCommand(), DIRECTION_NAMES, fallbackPair(), isDirection(), noArgumentCommand() (+32 more)

### Community 80 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 85 - "NpcGates.test.ts"
Cohesion: 0.19
Nodes (11): gateFindings(), actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData() (+3 more)

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 441 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (4× useful, score=3.945697442)
- `putHandler()` (3× useful, score=2.97990651)
- `SaveControls` (3× useful, score=2.974873258)
- `TitleScreen` (3× useful, score=2.974873258)
- `formatEvent()` (2× useful, score=1.987636328)
- `resolveGameCommand()` (2× useful, score=1.984471258)
- `OutputLog` (2× useful, score=1.983278329)
- `Game` (2× useful, score=1.974444868)
- `GameEvent` (2× useful, score=1.966421531)
- `Turn pipeline (buffered events)` (2× useful, score=1.963254796)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `persistence.ts` to `npcs.ts`, `npcTopicOverlap.ts`, `contentToolchain.ts`, `mechanics.ts`, `content.ts`, `ConversationFlow.ts`, `validateContent.ts`, `zone1.ts`, `scenery-validation.test.ts`, `package.json`, `ScoreTracker.ts`, `ContentGeneration.test.ts`, `parser.ts`, `ConditionEvaluator.test.ts`, `authored.ts`, `ui.ts`, `GameWindow.ts`, `devDependencies`, `HintQuizViews.test.ts`, `NpcGates.test.ts`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `GameEvent`, `content/index.ts`, `npcs.ts`, `mechanics.ts`, `SaveManager.ts`, `content.ts`, `adapt.ts`, `Game`, `SpecTopic`, `ConversationFlow.ts`, `validateContent.ts`, `Game.ts`, `zone1.ts`, `scenery-validation.test.ts`, `GameWindow.ts`, `ScoreTracker.ts`, `parser.ts`, `localBundle.ts`, `EffectApplier.ts`, `authored.ts`, `ui.ts`, `persistence.ts`, `GameWindow.ts`, `ContentBundle.ts`, `domain.ts`, `HintSystem.ts`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `GameEvent` to `npcs.ts`, `mechanics.ts`, `Game`, `ConversationFlow.ts`, `Game.ts`, `ContentBundle`, `GameStateDto`, `GameWindow.ts`, `ScoreTracker.ts`, `parser.ts`, `EffectApplier.ts`, `authored.ts`, `MemoryStorage`, `ui.ts`, `persistence.ts`, `GameWindow.ts`, `ContentBundle.ts`, `domain.ts`, `HintSystem.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._