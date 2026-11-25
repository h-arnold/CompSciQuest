# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 225 files · ~144,505 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .jsonc 1, .css 1)

## Summary
- 1747 nodes · 5606 edges · 81 communities (55 shown, 26 thin omitted)
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
- Random
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
- main.ts
- LoadResult
- node-shims.d.ts
- cli.ts
- ContentHandoff.test.ts
- common.ts
- GameWindow.ts
- package.json
- ScoreTracker.ts
- ContentGeneration.test.ts
- parser.ts
- GameState.ts
- adapt.ts
- asText
- content/schema.ts
- EffectApplier.ts
- validate.ts
- collection
- authored.ts
- vitest
- ui.ts
- persistence.ts
- ContentBundle.ts
- stringList
- devDependencies
- eslint.config.js
- vite@^8.3.8
- domain.ts
- ValidationModule
- HintSystem.ts
- NpcGates.test.ts
- npcHandlers.ts
- SeededRandom

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 91 edges
2. `GameEvent` - 80 edges
3. `vitest` - 80 edges
4. `GameState` - 61 edges
5. `asText()` - 56 edges
6. `finding()` - 56 edges
7. `Effect` - 43 edges
8. `Random` - 40 edges
9. `collection()` - 39 edges
10. `FakeRandom` - 37 edges

## Surprising Connections (you probably didn't know these)
- `PlayerView` --references--> `Position`  [EXTRACTED]
  e2e/w7-opening-walkthrough.spec.ts → src/types/domain.ts
- `PublishRecord` --references--> `GameEvent`  [EXTRACTED]
  tests/fixtures/ui.ts → src/core/events/GameEvent.ts
- `TopicIndexEntry` --references--> `SpecTopic`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/core/scoring/SpecTopic.ts
- `EffectApplierDependencies` --references--> `Random`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/core/Random.ts
- `AuthoredGameFixture` --references--> `Game`  [EXTRACTED]
  tests/fixtures/authored.ts → src/application/Game.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase 4 (React) ordered systems** — docs_developer_shared_rules_scheduler, docs_developer_hazards_hazard_system, docs_developer_npcs_dialoguesystem, docs_developer_puzzles_puzzle_system, docs_developer_hints_hint_system [EXTRACTED 1.00]
- **Primitives forming the shared rule spine** — docs_developer_shared_rules_condition, docs_developer_shared_rules_trigger, docs_developer_shared_rules_effect, docs_developer_shared_rules_scheduler, docs_developer_shared_rules_effectapplier [EXTRACTED 1.00]
- **Score flows through ScoreTracker** — docs_developer_shared_rules_scoretracker, docs_developer_puzzles_per_puzzle_scoring, docs_developer_combat_quiz_scoring, docs_developer_hints_hint_penalty [EXTRACTED 1.00]
- **Content authoring and review workflow** — docs_developer_content_rules_bible, docs_developer_content_rules_card, docs_developer_content_rules_workflowgates, docs_developer_content_rules_contentcritic, docs_developer_content_rules_pckreviewer, docs_developer_content_rules_structuralvalidationgates [INFERRED 0.75]
- **One-command turn pipeline** — docs_developer_architecture_turnpipeline, docs_developer_application_and_ui_command, docs_developer_application_and_ui_gameevent, docs_developer_application_and_ui_eventbus, docs_developer_application_and_ui_effecteventmapping, docs_developer_application_and_ui_scoretracker, docs_developer_application_and_ui_session [INFERRED 0.75]
- **Save lifecycle flow** — docs_developer_storage_schema_savedto, docs_developer_storage_schema_persistedshape, docs_developer_architecture_savemanager, docs_developer_storage_schema_storageadapter, docs_developer_storage_schema_quarantine, docs_developer_storage_schema_loadresult, docs_developer_storage_schema_restoretimederivation [INFERRED 0.75]

## Communities (81 total, 26 thin omitted)

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

### Community 5 - "Random"
Cohesion: 0.09
Nodes (34): ComposedReaction, ComposedReactionDependencies, EffectApplier, FiredThisTurn, HazardSystem, HazardSystemDependencies, isInitialRoom(), isTriggerMatched() (+26 more)

### Community 6 - "content/index.ts"
Cohesion: 0.10
Nodes (21): area, START_POSITION, startRoom, AreaDefinition, actorStates, actors, areas, conversationTopics (+13 more)

### Community 7 - "Persistence and Save Schema"
Cohesion: 0.29
Nodes (7): GameState, SaveManager, Static-first site, Item ownership invariant, Persisted shape (GameStateDto), SaveDto envelope, StorageAdapter port

### Community 8 - "npcs.ts"
Cohesion: 0.08
Nodes (56): createFromDto(), stateToDto(), formatEvent(), label(), topicLabel(), ACTOR_ALIAS, ACTOR_ID, actorState() (+48 more)

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
Nodes (67): gNpc06(), gNpc07(), gNpc08(), gNpc09(), gNpc10(), gNpc11(), gNpc12(), gNpc13() (+59 more)

### Community 35 - "contentToolchain.ts"
Cohesion: 0.10
Nodes (28): PER_AREA_PATHS, cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), CardFile, CardSet, cardText() (+20 more)

### Community 36 - "mechanics.ts"
Cohesion: 0.09
Nodes (49): createEffectApplier(), puzzleDefinition(), LOCAL_FIXTURE_COVERAGE_TOPIC_IDS, applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory (+41 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.16
Nodes (28): ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints(), hasValidNpcs() (+20 more)

### Community 38 - "content.ts"
Cohesion: 0.14
Nodes (27): BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds, exitWithDirection() (+19 more)

### Community 39 - "helpers.ts"
Cohesion: 0.06
Nodes (52): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+44 more)

### Community 40 - "adapt.ts"
Cohesion: 0.15
Nodes (22): GeneratedFile, GenerationResult, ParsedCard, CatalogueEmit, cleanEntry(), emitCatalogue(), indentJson(), stripAuthoring() (+14 more)

### Community 41 - "Game"
Cohesion: 0.11
Nodes (5): Game, GameWindow, SaveActions, SaveControls, TitleScreen

### Community 43 - "ConversationFlow.ts"
Cohesion: 0.06
Nodes (62): actorAndRemainder(), answerCommand(), conversationCommand(), DIRECTION_NAMES, fallbackPair(), isDirection(), noArgumentCommand(), PUT_PREPOSITIONS (+54 more)

### Community 44 - "verbs/index.ts"
Cohesion: 0.11
Nodes (36): describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible(), matchingInteraction(), normalise() (+28 more)

### Community 45 - "validateContent.ts"
Cohesion: 0.13
Nodes (21): aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified, ownerProblems() (+13 more)

### Community 46 - "Game.ts"
Cohesion: 0.16
Nodes (13): createComposedReaction(), adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), recordSeed(), MetaAction, getCommandHandler (+5 more)

### Community 47 - "zone1.ts"
Cohesion: 0.10
Nodes (27): generatedRoomIds(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES, GENERATED_PATHS (+19 more)

### Community 48 - "main.ts"
Cohesion: 0.11
Nodes (23): Clock, createSaveManager(), SaveManager, SaveManagerDependencies, loadContent(), createEventBus(), EventBus, isWon() (+15 more)

### Community 49 - "LoadResult"
Cohesion: 0.18
Nodes (7): QuarantineDto, LoadFailureReason, LoadResult, loadFailureMessage(), MESSAGES, BootSetupOptions, FakeSaveManager

### Community 51 - "cli.ts"
Cohesion: 0.10
Nodes (25): CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards(), ROOT (+17 more)

### Community 52 - "ContentHandoff.test.ts"
Cohesion: 0.13
Nodes (10): Data, gateFindings(), CreateInitial, npcFindings(), loadValidator(), AREA_ID, findingText(), GATE_NAMES (+2 more)

### Community 53 - "common.ts"
Cohesion: 0.21
Nodes (17): CardSet, Finding, ParsedCardSet, ValidateResult, ValidationOptions, asObjectArray(), DIRECTIONS, EFFECT_KINDS (+9 more)

### Community 55 - "GameWindow.ts"
Cohesion: 0.10
Nodes (18): AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView, SpecStatus, Position (+10 more)

### Community 56 - "package.json"
Cohesion: 0.17
Nodes (11): description, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, zod@^4.6.7, name, private, type, version (+3 more)

### Community 57 - "ScoreTracker.ts"
Cohesion: 0.26
Nodes (12): Announce, award(), createScoreTracker(), hasScoreFor(), hasTopicCompletion(), processEvent(), progressEntry(), puzzleSolved() (+4 more)

### Community 58 - "ContentGeneration.test.ts"
Cohesion: 0.15
Nodes (15): CardData, cleanParsedSet(), definition(), roomData(), npcCards(), TopicEntry, topicsCard(), expectSameMembers() (+7 more)

### Community 59 - "parser.ts"
Cohesion: 0.10
Nodes (27): NameResolver, ParsedCommand, CHEST_ID, DOOR_ID, KEY_A, KEY_B, loadParser(), loadTokenizer() (+19 more)

### Community 60 - "GameState.ts"
Cohesion: 0.14
Nodes (11): SaveDto, AreaProgress, GameStateDto, HazardStateDto, HintStateDto, NpcStateDto, PuzzlePhase, PuzzleStateDto (+3 more)

### Community 61 - "adapt.ts"
Cohesion: 0.22
Nodes (11): Catalogue, catalogueOf(), ItemDefinition, bundleOf(), gateOf(), isTrue(), number(), numbers() (+3 more)

### Community 62 - "asText"
Cohesion: 0.30
Nodes (17): sharedFindings(), allEffects(), areaLikes(), asText(), auditedAreaLikes(), idsOf(), startFindings(), AreaLike (+9 more)

### Community 63 - "content/schema.ts"
Cohesion: 0.25
Nodes (15): ParseResult, asArray(), asRecord(), AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape (+7 more)

### Community 64 - "EffectApplier.ts"
Cohesion: 0.15
Nodes (19): applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), endQuiz(), evaluateAnswer() (+11 more)

### Community 65 - "validate.ts"
Cohesion: 0.25
Nodes (13): asNumber(), CardEntry, checkHint(), ladderFindings(), levelFindings(), penaltyFindings(), targetFindings(), UNLOCK_PREFIXES (+5 more)

### Community 66 - "collection"
Cohesion: 0.21
Nodes (22): collection(), coverageIds(), knownTopicIds(), aliasFindings(), badPrefix(), checkContentIds(), COLLECTIONS, coverageTopicFindings() (+14 more)

### Community 67 - "authored.ts"
Cohesion: 0.06
Nodes (44): GameDependencies, createQuizSystem(), QuizSystem, GameState, RuntimeGameState, finishWithWrongAnswers(), questionFor(), wrongAnswer() (+36 more)

### Community 68 - "vitest"
Cohesion: 0.08
Nodes (23): vitest, GameEvent, createSession(), Session, ScoreTracker, SchedulerContract, TurnContract, loadNameResolver() (+15 more)

### Community 69 - "ui.ts"
Cohesion: 0.06
Nodes (39): makeEnvelope(), SAVE_KEY, absentElement(), allText(), Bootstrap, BootstrapDependencies, descendants(), documentState (+31 more)

### Community 70 - "persistence.ts"
Cohesion: 0.10
Nodes (27): AuthoredGameFixture, mechanicsState(), asRuntime(), EffectApplierDependencies, envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO (+19 more)

### Community 72 - "ContentBundle.ts"
Cohesion: 0.12
Nodes (27): ActorDefinition, ContentBundle, RoomDefinition, Quiz, QuizQuestion, QuizSystemDependencies, Effect, EffectApplierDependencies (+19 more)

### Community 73 - "stringList"
Cohesion: 0.26
Nodes (18): authoringOf(), finding(), stringList(), checkNpc(), defaultTopicFindings(), nodeTopicFindings(), readyStateFindings(), reservedFindings() (+10 more)

### Community 74 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@^10.15.0, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, typescript-7@npm:typescript@^7.0.2, vitest@^5.1.1, yaml@^2.9.1, eslint (+4 more)

### Community 75 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 77 - "domain.ts"
Cohesion: 0.09
Nodes (19): ExitDefinition, DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, MultiwordAlias, parseRaw(), SINGLE_ALIASES (+11 more)

### Community 80 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 85 - "NpcGates.test.ts"
Cohesion: 0.24
Nodes (8): actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData(), topic()

### Community 87 - "npcHandlers.ts"
Cohesion: 0.19
Nodes (10): Command, CommandHandler, hasItem(), isTalking(), message(), npcHandler(), RuleEngine, TurnContextOptions (+2 more)

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 430 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (4× useful, score=3.946996287)
- `putHandler()` (3× useful, score=2.980887436)
- `SaveControls` (3× useful, score=2.975852527)
- `TitleScreen` (3× useful, score=2.975852527)
- `formatEvent()` (2× useful, score=1.988290618)
- `resolveGameCommand()` (2× useful, score=1.985124507)
- `OutputLog` (2× useful, score=1.983931185)
- `GameEvent` (2× useful, score=1.967068838)
- `Turn pipeline (buffered events)` (2× useful, score=1.96390106)
- `NameResolver` (2× useful, score=1.96390106)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Random`, `npcs.ts`, `npcTopicOverlap.ts`, `contentToolchain.ts`, `mechanics.ts`, `content.ts`, `validateContent.ts`, `zone1.ts`, `LoadResult`, `ContentHandoff.test.ts`, `package.json`, `ContentGeneration.test.ts`, `parser.ts`, `EffectApplier.ts`, `authored.ts`, `ui.ts`, `persistence.ts`, `ContentBundle.ts`, `devDependencies`, `NpcGates.test.ts`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle.ts` to `Random`, `content/index.ts`, `npcs.ts`, `mechanics.ts`, `SaveManager.ts`, `content.ts`, `Game`, `SpecTopic`, `ConversationFlow.ts`, `validateContent.ts`, `Game.ts`, `zone1.ts`, `main.ts`, `LoadResult`, `ContentHandoff.test.ts`, `GameWindow.ts`, `ScoreTracker.ts`, `parser.ts`, `GameState.ts`, `adapt.ts`, `EffectApplier.ts`, `authored.ts`, `vitest`, `ui.ts`, `persistence.ts`, `HintSystem.ts`, `npcHandlers.ts`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `vitest` to `EffectApplier.ts`, `authored.ts`, `mechanics.ts`, `Random`, `persistence.ts`, `ui.ts`, `npcs.ts`, `Game`, `ConversationFlow.ts`, `domain.ts`, `Game.ts`, `HintSystem.ts`, `main.ts`, `LoadResult`, `GameWindow.ts`, `ScoreTracker.ts`, `parser.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._