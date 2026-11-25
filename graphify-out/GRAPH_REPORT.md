# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 142 files · ~61,604 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .jsonc 1)

## Summary
- 872 nodes · 2124 edges · 69 communities (40 shown, 29 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2280dbb6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- Strict TypeScript Settings
- Mechanics Data Models
- Application and UI Contracts
- OpenCode Agent Configuration
- persistence.ts
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
- App Bootstrap
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
- turn.ts
- domain.ts
- GameState.ts
- SaveManager.ts
- content.ts
- validateContent.ts
- common.ts
- contentToolchain.ts
- parser.ts
- ContentGates.test.ts
- Condition
- GameEvent
- Game.ts
- ContentGeneration.test.ts
- TurnPipeline.test.ts
- scripts
- stub/index.ts
- content/schema.ts
- NpcGates.test.ts
- ConversationTopic.ts
- eslint.config.js
- GameViewData.ts
- Direction
- Parser.ts
- MemoryContentIo
- Game
- AreaDefinition
- WorldDefinition
- BrowserStorage
- NameResolver.ts
- ContentIo
- questions.ts
- Quiz.ts
- formatEvent.ts
- vite

## God Nodes (most connected - your core abstractions)
1. `Effect` - 43 edges
2. `GameState` - 41 edges
3. `ContentBundle` - 38 edges
4. `GameEvent` - 36 edges
5. `asText()` - 27 edges
6. `collection()` - 26 edges
7. `compilerOptions` - 25 edges
8. `finding()` - 22 edges
9. `GameStateDto` - 21 edges
10. `asObjectArray()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `FixedClock` --implements--> `Clock`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/application/Clock.ts
- `GameDependencies` --references--> `ContentBundle`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/content/ContentBundle.ts
- `SaveManagerDependencies` --references--> `ContentBundle`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/content/ContentBundle.ts
- `TurnGameDependencies` --references--> `ContentBundle`  [EXTRACTED]
  tests/fixtures/turn.ts → src/content/ContentBundle.ts
- `PutFixture` --references--> `GameState`  [EXTRACTED]
  tests/fixtures/parser.ts → src/core/GameState.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase 4 (React) ordered systems** — docs_developer_shared_rules_scheduler, docs_developer_hazards_hazard_system, docs_developer_npcs_dialoguesystem, docs_developer_puzzles_puzzle_system, docs_developer_hints_hint_system [EXTRACTED 1.00]
- **Primitives forming the shared rule spine** — docs_developer_shared_rules_condition, docs_developer_shared_rules_trigger, docs_developer_shared_rules_effect, docs_developer_shared_rules_scheduler, docs_developer_shared_rules_effectapplier [EXTRACTED 1.00]
- **Score flows through ScoreTracker** — docs_developer_shared_rules_scoretracker, docs_developer_puzzles_per_puzzle_scoring, docs_developer_combat_quiz_scoring, docs_developer_hints_hint_penalty [EXTRACTED 1.00]
- **Content authoring and review workflow** — docs_developer_content_rules_bible, docs_developer_content_rules_card, docs_developer_content_rules_workflowgates, docs_developer_content_rules_contentcritic, docs_developer_content_rules_pckreviewer, docs_developer_content_rules_structuralvalidationgates [INFERRED 0.75]
- **One-command turn pipeline** — docs_developer_architecture_turnpipeline, docs_developer_application_and_ui_command, docs_developer_application_and_ui_gameevent, docs_developer_application_and_ui_eventbus, docs_developer_application_and_ui_effecteventmapping, docs_developer_application_and_ui_scoretracker, docs_developer_application_and_ui_session [INFERRED 0.75]
- **Save lifecycle flow** — docs_developer_storage_schema_savedto, docs_developer_storage_schema_persistedshape, docs_developer_architecture_savemanager, docs_developer_storage_schema_storageadapter, docs_developer_storage_schema_quarantine, docs_developer_storage_schema_loadresult, docs_developer_storage_schema_restoretimederivation [INFERRED 0.75]

## Communities (69 total, 29 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.13
Nodes (20): description, devDependencies, eslint@^10.15.0, markdownlint-cli2@^0.24.2, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, typescript-7@npm:typescript@^7.0.2, yaml@^2.9.1 (+12 more)

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

### Community 5 - "persistence.ts"
Cohesion: 0.14
Nodes (23): asRuntime(), envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, loadEffectApplier(), loadGame(), loadInitialState() (+15 more)

### Community 6 - "ContentBundle.ts"
Cohesion: 0.18
Nodes (9): ActorDefinition, actorStates, actors, items, Catalogue, ContentBundle, ItemDefinition, ActorState (+1 more)

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

### Community 34 - "turn.ts"
Cohesion: 0.14
Nodes (15): Clock, GameDependencies, SaveManager, SaveManagerDependencies, EffectApplierDependencies, Random, ScoreTracker, TurnContext (+7 more)

### Community 35 - "domain.ts"
Cohesion: 0.25
Nodes (6): Exit, Room, World, GameObject, Position, Serialisable

### Community 36 - "GameState.ts"
Cohesion: 0.06
Nodes (34): SaveDto, AreaProgress, QuizSystem, TopicResolver, Effect, applyEffect(), applyEntityEffect(), applyItemEffect() (+26 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.12
Nodes (32): QuarantineDto, LoadFailureReason, LoadResult, createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress() (+24 more)

### Community 38 - "content.ts"
Cohesion: 0.14
Nodes (31): loadContent(), stubBundle, CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic() (+23 more)

### Community 39 - "validateContent.ts"
Cohesion: 0.24
Nodes (14): aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified, ownerProblems() (+6 more)

### Community 40 - "common.ts"
Cohesion: 0.13
Nodes (52): CardFile, Finding, GeneratedFile, GenerationResult, ParsedCard, ParsedCardSet, ScaffoldOptions, ScaffoldResult (+44 more)

### Community 41 - "contentToolchain.ts"
Cohesion: 0.12
Nodes (21): PER_AREA_PATHS, AREA_ID, CardFile, CardSet, HAZARDS_PATH, HINTS_PATH, loadGenerator(), loadScaffolder() (+13 more)

### Community 42 - "parser.ts"
Cohesion: 0.09
Nodes (30): Command, CommandHandler, ParsedCommand, RuleEngine, CHEST_ID, DOOR_ID, KEY_A, KEY_B (+22 more)

### Community 43 - "ContentGates.test.ts"
Cohesion: 0.11
Nodes (11): Data, ParsedRoom, cardText(), conformingCardSet(), expectSameMembers(), Finding, GATE_NAMES, ParseResult (+3 more)

### Community 44 - "Condition"
Cohesion: 0.16
Nodes (10): hazards, hints, puzzles, Hazard, HintLevel, HintSequence, Puzzle, Condition (+2 more)

### Community 45 - "GameEvent"
Cohesion: 0.15
Nodes (8): EventBus, GameEvent, EffectApplierLike, RecordingBus, loadFormatEvent(), makeTurnDependencies(), MemoryBus, EVENTS

### Community 46 - "Game.ts"
Cohesion: 0.16
Nodes (16): createGame(), DIRECTION_NAMES, doubleIdCommand(), END_STATE_COMMANDS, initialBatch(), isDirection(), noArgumentCommand(), putCommand() (+8 more)

### Community 47 - "ContentGeneration.test.ts"
Cohesion: 0.15
Nodes (14): CardData, cleanParsedSet(), definition(), roomData(), TopicEntry, topicsCard(), GENERATED_PATHS, GeneratedFile (+6 more)

### Community 48 - "TurnPipeline.test.ts"
Cohesion: 0.15
Nodes (5): Session, FakeRandom, loadSession(), loadEventBus(), phaseFakes()

### Community 49 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, format:check, lint, lint:fix, lint:md (+6 more)

### Community 50 - "stub/index.ts"
Cohesion: 0.25
Nodes (6): specTopics, specTopics, stubInitialState, SpecTopic, SpecTopicCatalogue, TopicIndexEntry

### Community 51 - "content/schema.ts"
Cohesion: 0.23
Nodes (13): CardSet, ParseResult, asRecord(), AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape (+5 more)

### Community 52 - "NpcGates.test.ts"
Cohesion: 0.22
Nodes (11): gateFindings(), actor(), Data, node(), NOT_KNOWN, npcCards(), npcData(), npcFindings() (+3 more)

### Community 53 - "ConversationTopic.ts"
Cohesion: 0.29
Nodes (6): conversationTopics, nodes, ConversationNode, ConversationTopic, ResponseStrategy, TopicMatch

### Community 54 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 55 - "GameViewData.ts"
Cohesion: 0.24
Nodes (8): AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView, SpecStatus, SessionStatus

### Community 56 - "Direction"
Cohesion: 0.29
Nodes (7): rooms, ExitDefinition, RoomDefinition, stubRooms, RoomSummary, Precondition, Direction

### Community 57 - "Parser.ts"
Cohesion: 0.24
Nodes (8): DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, MultiwordAlias, parseRaw(), SINGLE_ALIASES, tokenize

### Community 60 - "AreaDefinition"
Cohesion: 0.47
Nodes (3): AreaDefinition, areas, stubAreas

### Community 61 - "WorldDefinition"
Cohesion: 0.47
Nodes (3): worlds, stubWorlds, WorldDefinition

### Community 67 - "formatEvent.ts"
Cohesion: 0.83
Nodes (3): formatEvent(), label(), topicLabel()

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 254 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (2× useful, score=1.985396176)
- `validateContent` (2× useful, score=1.970844908)
- `Structural validation gates` (2× useful, score=1.970844908)
- `eslint.config.js` (2× useful, score=1.964989878)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ContentBundle` connect `ContentBundle.ts` to `questions.ts`, `turn.ts`, `Quiz.ts`, `formatEvent.ts`, `SaveManager.ts`, `content.ts`, `validateContent.ts`, `persistence.ts`, `parser.ts`, `Condition`, `Game.ts`, `TurnPipeline.test.ts`, `stub/index.ts`, `ConversationTopic.ts`, `Direction`, `AreaDefinition`, `WorldDefinition`, `NameResolver.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Why does `Effect` connect `GameState.ts` to `turn.ts`, `Quiz.ts`, `persistence.ts`, `ContentBundle.ts`, `verbs/index.ts`, `parser.ts`, `Condition`, `GameEvent`, `Game.ts`, `TurnPipeline.test.ts`, `ConversationTopic.ts`, `Direction`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Why does `GameState` connect `GameState.ts` to `turn.ts`, `domain.ts`, `SaveManager.ts`, `ContentBundle.ts`, `persistence.ts`, `parser.ts`, `Condition`, `GameEvent`, `Game.ts`, `TurnPipeline.test.ts`, `NameResolver.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._