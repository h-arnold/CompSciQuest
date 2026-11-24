# Graph Report - CompSciQuest  (2026-11-24)

## Corpus Check
- 95 files · ~27,586 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .jsonc 1)

## Summary
- 426 nodes · 721 edges · 43 communities (17 shown, 26 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `17fea665`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Build Tooling and Linting
- Strict TypeScript Settings
- Mechanics Data Models
- Application and UI Contracts
- OpenCode Agent Configuration
- NPM Scripts
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
- Effect
- GameViewData.ts
- GameStateDto
- Condition
- StorageAdapter
- Clock
- MetaAction.ts
- schema.ts
- ParsedCommand.ts

## God Nodes (most connected - your core abstractions)
1. `Effect` - 30 edges
2. `GameState` - 27 edges
3. `compilerOptions` - 25 edges
4. `ContentBundle` - 22 edges
5. `GameEvent` - 18 edges
6. `GameStateDto` - 16 edges
7. `scripts` - 14 edges
8. `Condition` - 12 edges
9. `ConversationTopic` - 10 edges
10. `Game` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Puzzle` --semantically_similar_to--> `Quiz`  [INFERRED] [semantically similar]
  docs/developer/puzzles.md → docs/developer/combat.md
- `Hazard` --semantically_similar_to--> `Quiz combat (adversarial quiz)`  [INFERRED] [semantically similar]
  docs/developer/hazards.md → docs/developer/combat.md
- `Puzzle Dependency Graph` --semantically_similar_to--> `HintSequence`  [INFERRED] [semantically similar]
  docs/developer/puzzles.md → docs/developer/hints.md
- `Title screen overlay` --semantically_similar_to--> `Save quarantine`  [INFERRED] [semantically similar]
  docs/developer/application-and-ui.md → docs/developer/storage-schema.md
- `Structural validation gates` --semantically_similar_to--> `Save validation contract`  [INFERRED] [semantically similar]
  docs/developer/content-rules.md → docs/developer/storage-schema.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase 4 (React) ordered systems** — docs_developer_shared_rules_scheduler, docs_developer_hazards_hazard_system, docs_developer_npcs_dialoguesystem, docs_developer_puzzles_puzzle_system, docs_developer_hints_hint_system [EXTRACTED 1.00]
- **Primitives forming the shared rule spine** — docs_developer_shared_rules_condition, docs_developer_shared_rules_trigger, docs_developer_shared_rules_effect, docs_developer_shared_rules_scheduler, docs_developer_shared_rules_effectapplier [EXTRACTED 1.00]
- **Score flows through ScoreTracker** — docs_developer_shared_rules_scoretracker, docs_developer_puzzles_per_puzzle_scoring, docs_developer_combat_quiz_scoring, docs_developer_hints_hint_penalty [EXTRACTED 1.00]
- **Content authoring and review workflow** — docs_developer_content_rules_bible, docs_developer_content_rules_card, docs_developer_content_rules_workflowgates, docs_developer_content_rules_contentcritic, docs_developer_content_rules_pckreviewer, docs_developer_content_rules_structuralvalidationgates [INFERRED 0.75]
- **One-command turn pipeline** — docs_developer_architecture_turnpipeline, docs_developer_application_and_ui_command, docs_developer_application_and_ui_gameevent, docs_developer_application_and_ui_eventbus, docs_developer_application_and_ui_effecteventmapping, docs_developer_application_and_ui_scoretracker, docs_developer_application_and_ui_session [INFERRED 0.75]
- **Save lifecycle flow** — docs_developer_storage_schema_savedto, docs_developer_storage_schema_persistedshape, docs_developer_architecture_savemanager, docs_developer_storage_schema_storageadapter, docs_developer_storage_schema_quarantine, docs_developer_storage_schema_loadresult, docs_developer_storage_schema_restoretimederivation [INFERRED 0.75]

## Communities (43 total, 26 thin omitted)

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
Cohesion: 0.12
Nodes (16): agents, content-editor, permissions, command, type, default_agent, command, type (+8 more)

### Community 5 - "NPM Scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, format:check, lint, lint:fix, lint:md (+6 more)

### Community 6 - "stub/index.ts"
Cohesion: 0.06
Nodes (31): ActorDefinition, AreaDefinition, actorStates, actors, areas, conversationTopics, hazards, items (+23 more)

### Community 7 - "Persistence and Save Schema"
Cohesion: 0.29
Nodes (7): GameState, SaveManager, Static-first site, Item ownership invariant, Persisted shape (GameStateDto), SaveDto envelope, StorageAdapter port

### Community 8 - "GameState.ts"
Cohesion: 0.09
Nodes (18): AreaProgress, QuizSystem, Command, CommandHandler, TopicResolver, GameState, HazardStateDto, HintStateDto (+10 more)

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

### Community 34 - "Effect"
Cohesion: 0.11
Nodes (13): Effect, EventBus, GameEvent, Hazard, HazardSystem, HintSystem, Session, DialogueSystem (+5 more)

### Community 35 - "GameViewData.ts"
Cohesion: 0.10
Nodes (21): AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView, rooms, ExitDefinition (+13 more)

### Community 36 - "GameStateDto"
Cohesion: 0.15
Nodes (7): Game, QuarantineDto, LoadFailureReason, LoadResult, SaveDto, SaveManager, GameStateDto

### Community 37 - "Condition"
Cohesion: 0.27
Nodes (6): hints, puzzles, HintLevel, HintSequence, Puzzle, Condition

## Knowledge Gaps
- **46 isolated node(s):** `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)`, `Scheduler`, `hint-penalty-applied` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 150 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `eslint.config.js` (2× useful, score=1.998777255)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Effect` connect `Effect` to `GameState.ts`, `GameViewData.ts`, `Condition`, `stub/index.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `content-critic reviewer`, `Counters and stuckness keys`, `Hazard types (entry trap, timed hazard, action trap)` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `Build Tooling and Linting` be split into smaller, more focused modules?**
  _Cohesion score 0.0967741935483871 - nodes in this community are weakly interconnected._
- **Why does `GameState` connect `GameState.ts` to `Effect`, `GameViewData.ts`, `GameStateDto`, `stub/index.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `stub/index.ts` to `GameState.ts`, `Effect`, `GameViewData.ts`, `Condition`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._