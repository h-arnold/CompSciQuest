# Graph Report - CompSciQuest  (2026-11-24)

## Corpus Check
- 102 files · ~36,043 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .jsonc 1)

## Summary
- 542 nodes · 1086 edges · 43 communities (20 shown, 23 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `044f0045`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Build Tooling and Linting
- Strict TypeScript Settings
- Mechanics Data Models
- Application and UI Contracts
- OpenCode Agent Configuration
- persistence.ts
- stub/index.ts
- Persistence and Save Schema
- GameState.ts
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
- GameState.ts
- GameViewData.ts
- EffectApplier.ts
- SaveManager.ts
- scripts
- ConversationTopic.ts
- MetaAction.ts
- StorageAdapter
- ParsedCommand.ts

## God Nodes (most connected - your core abstractions)
1. `GameState` - 35 edges
2. `Effect` - 34 edges
3. `ContentBundle` - 30 edges
4. `GameEvent` - 25 edges
5. `compilerOptions` - 25 edges
6. `GameStateDto` - 19 edges
7. `hasValidShape()` - 15 edges
8. `isRecord()` - 14 edges
9. `StorageAdapter` - 14 edges
10. `scripts` - 14 edges

## Surprising Connections (you probably didn't know these)
- `MemoryStorage` --implements--> `StorageAdapter`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/storage/StorageAdapter.ts
- `FakeRandom` --implements--> `Random`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/core/Random.ts
- `RecordingBus` --implements--> `EventBus`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/core/events/EventBus.ts
- `RecordingBus` --references--> `GameEvent`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/core/events/GameEvent.ts
- `TopicIndexEntry` --references--> `SpecTopic`  [EXTRACTED]
  tests/fixtures/persistence.ts → src/core/scoring/SpecTopic.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase 4 (React) ordered systems** — docs_developer_shared_rules_scheduler, docs_developer_hazards_hazard_system, docs_developer_npcs_dialoguesystem, docs_developer_puzzles_puzzle_system, docs_developer_hints_hint_system [EXTRACTED 1.00]
- **Primitives forming the shared rule spine** — docs_developer_shared_rules_condition, docs_developer_shared_rules_trigger, docs_developer_shared_rules_effect, docs_developer_shared_rules_scheduler, docs_developer_shared_rules_effectapplier [EXTRACTED 1.00]
- **Score flows through ScoreTracker** — docs_developer_shared_rules_scoretracker, docs_developer_puzzles_per_puzzle_scoring, docs_developer_combat_quiz_scoring, docs_developer_hints_hint_penalty [EXTRACTED 1.00]
- **Content authoring and review workflow** — docs_developer_content_rules_bible, docs_developer_content_rules_card, docs_developer_content_rules_workflowgates, docs_developer_content_rules_contentcritic, docs_developer_content_rules_pckreviewer, docs_developer_content_rules_structuralvalidationgates [INFERRED 0.75]
- **One-command turn pipeline** — docs_developer_architecture_turnpipeline, docs_developer_application_and_ui_command, docs_developer_application_and_ui_gameevent, docs_developer_application_and_ui_eventbus, docs_developer_application_and_ui_effecteventmapping, docs_developer_application_and_ui_scoretracker, docs_developer_application_and_ui_session [INFERRED 0.75]
- **Save lifecycle flow** — docs_developer_storage_schema_savedto, docs_developer_storage_schema_persistedshape, docs_developer_architecture_savemanager, docs_developer_storage_schema_storageadapter, docs_developer_storage_schema_quarantine, docs_developer_storage_schema_loadresult, docs_developer_storage_schema_restoretimederivation [INFERRED 0.75]

## Communities (43 total, 23 thin omitted)

### Community 0 - "Build Tooling and Linting"
Cohesion: 0.10
Nodes (28): description, devDependencies, eslint@^10.15.0, @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, markdownlint-cli2@^0.24.2 (+20 more)

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
Cohesion: 0.09
Nodes (31): Clock, asRuntime(), catalogueOf(), EffectApplierLike, envelopeText(), FakeRandom, FIXED_ISO, FixedClock (+23 more)

### Community 6 - "stub/index.ts"
Cohesion: 0.06
Nodes (30): ActorDefinition, AreaDefinition, actorStates, actors, areas, hazards, hints, items (+22 more)

### Community 7 - "Persistence and Save Schema"
Cohesion: 0.29
Nodes (7): GameState, SaveManager, Static-first site, Item ownership invariant, Persisted shape (GameStateDto), SaveDto envelope, StorageAdapter port

### Community 8 - "GameState.ts"
Cohesion: 0.05
Nodes (32): createGame(), Game, AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView (+24 more)

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

### Community 34 - "GameState.ts"
Cohesion: 0.10
Nodes (19): GameDependencies, Quiz, QuizSystem, Command, CommandHandler, Effect, EventBus, GameEvent (+11 more)

### Community 35 - "GameViewData.ts"
Cohesion: 0.15
Nodes (12): rooms, ExitDefinition, RoomDefinition, stubRooms, RoomSummary, Exit, Room, Precondition (+4 more)

### Community 36 - "EffectApplier.ts"
Cohesion: 0.15
Nodes (13): applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), EffectApplier, EffectApplierDependencies, inventoryOf() (+5 more)

### Community 37 - "SaveManager.ts"
Cohesion: 0.16
Nodes (29): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+21 more)

### Community 38 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, format:check, lint, lint:fix, lint:md (+6 more)

### Community 39 - "ConversationTopic.ts"
Cohesion: 0.16
Nodes (10): conversationTopics, nodes, TopicResolver, HintLevel, ConversationNode, ConversationTopic, ResolvedTopic, ResponseStrategy (+2 more)

### Community 41 - "StorageAdapter"
Cohesion: 0.24
Nodes (4): SaveManagerDependencies, BrowserStorage, store(), StorageAdapter

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 168 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `eslint.config.js` (2× useful, score=1.99660267)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GameState` connect `GameState.ts` to `GameViewData.ts`, `EffectApplier.ts`, `SaveManager.ts`, `stub/index.ts`, `ConversationTopic.ts`, `GameState.ts`, `persistence.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `Build Tooling and Linting` be split into smaller, more focused modules?**
  _Cohesion score 0.0967741935483871 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `stub/index.ts` to `GameState.ts`, `GameViewData.ts`, `EffectApplier.ts`, `SaveManager.ts`, `persistence.ts`, `ConversationTopic.ts`, `GameState.ts`, `StorageAdapter`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Why does `Effect` connect `GameState.ts` to `GameViewData.ts`, `EffectApplier.ts`, `persistence.ts`, `stub/index.ts`, `ConversationTopic.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._