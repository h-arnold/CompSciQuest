# Graph Report - CompSciQuest  (2026-11-24)

## Corpus Check
- Corpus is ~21,814 words - fits in a single context window. You may not need a graph.

## Summary
- 192 nodes · 181 edges · 33 communities (13 shown, 20 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Build Tooling and Linting
- Strict TypeScript Settings
- Mechanics Data Models
- Application and UI Contracts
- OpenCode Agent Configuration
- NPM Scripts
- Events and Scoring Contracts
- Persistence and Save Schema
- Turn Pipeline Systems
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 25 edges
2. `scripts` - 14 edges
3. `Game façade` - 6 edges
4. `Condition` - 6 edges
5. `Effect` - 5 edges
6. `servers` - 4 edges
7. `Canonical GameEvent union` - 4 edges
8. `ScoreTracker` - 4 edges
9. `Persisted shape (GameStateDto)` - 4 edges
10. `Quiz` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Title screen overlay` --semantically_similar_to--> `Save quarantine`  [INFERRED] [semantically similar]
  docs/developer/application-and-ui.md → docs/developer/storage-schema.md
- `Structural validation gates` --semantically_similar_to--> `Save validation contract`  [INFERRED] [semantically similar]
  docs/developer/content-rules.md → docs/developer/storage-schema.md
- `Hazard` --semantically_similar_to--> `Quiz combat (adversarial quiz)`  [INFERRED] [semantically similar]
  docs/developer/hazards.md → docs/developer/combat.md
- `Puzzle` --semantically_similar_to--> `Quiz`  [INFERRED] [semantically similar]
  docs/developer/puzzles.md → docs/developer/combat.md
- `Puzzle Dependency Graph` --semantically_similar_to--> `HintSequence`  [INFERRED] [semantically similar]
  docs/developer/puzzles.md → docs/developer/hints.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Save lifecycle flow** — docs_developer_storage_schema_savedto, docs_developer_storage_schema_persistedshape, docs_developer_architecture_savemanager, docs_developer_storage_schema_storageadapter, docs_developer_storage_schema_quarantine, docs_developer_storage_schema_loadresult, docs_developer_storage_schema_restoretimederivation [INFERRED 0.75]
- **One-command turn pipeline** — docs_developer_architecture_turnpipeline, docs_developer_application_and_ui_command, docs_developer_application_and_ui_gameevent, docs_developer_application_and_ui_eventbus, docs_developer_application_and_ui_effecteventmapping, docs_developer_application_and_ui_scoretracker, docs_developer_application_and_ui_session [INFERRED 0.75]
- **Content authoring and review workflow** — docs_developer_content_rules_bible, docs_developer_content_rules_card, docs_developer_content_rules_workflowgates, docs_developer_content_rules_contentcritic, docs_developer_content_rules_pckreviewer, docs_developer_content_rules_structuralvalidationgates [INFERRED 0.75]
- **Primitives forming the shared rule spine** — docs_developer_shared_rules_condition, docs_developer_shared_rules_trigger, docs_developer_shared_rules_effect, docs_developer_shared_rules_scheduler, docs_developer_shared_rules_effectapplier [EXTRACTED 1.00]
- **Phase 4 (React) ordered systems** — docs_developer_shared_rules_scheduler, docs_developer_hazards_hazard_system, docs_developer_npcs_dialoguesystem, docs_developer_puzzles_puzzle_system, docs_developer_hints_hint_system [EXTRACTED 1.00]
- **Score flows through ScoreTracker** — docs_developer_shared_rules_scoretracker, docs_developer_puzzles_per_puzzle_scoring, docs_developer_combat_quiz_scoring, docs_developer_hints_hint_penalty [EXTRACTED 1.00]

## Communities (33 total, 20 thin omitted)

### Community 0 - "Build Tooling and Linting"
Cohesion: 0.10
Nodes (26): description, devDependencies, eslint@^10.15.0, @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, markdownlint-cli2@^0.24.2 (+18 more)

### Community 1 - "Strict TypeScript Settings"
Cohesion: 0.07
Nodes (27): compilerOptions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib (+19 more)

### Community 2 - "Mechanics Data Models"
Cohesion: 0.10
Nodes (18): Quiz, quizAttempts / QuizStateDto, Hazard, HintLevel, HintSequence, HintSystem, Actor, ActorState (+10 more)

### Community 3 - "Application and UI Contracts"
Cohesion: 0.12
Nodes (17): Catalogue<T> (declaration-order registry), Canonical Command union, ContentBundle, Game façade, MetaAction union, Per-puzzle scoring, Stub content fixture, Title screen overlay (+9 more)

### Community 4 - "OpenCode Agent Configuration"
Cohesion: 0.12
Nodes (16): agents, content-editor, permissions, command, type, default_agent, command, type (+8 more)

### Community 5 - "NPM Scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, format:check, lint, lint:fix, lint:md (+6 more)

### Community 6 - "Events and Scoring Contracts"
Cohesion: 0.24
Nodes (10): Effect-to-event mapping, EventBus, Canonical GameEvent union, ScoreTracker, Session win/lose check, SpecTopicCatalogue, Layer dependency rule, Layered architecture (+2 more)

### Community 7 - "Persistence and Save Schema"
Cohesion: 0.29
Nodes (7): GameState, SaveManager, Static-first site, Item ownership invariant, Persisted shape (GameStateDto), SaveDto envelope, StorageAdapter port

### Community 8 - "Turn Pipeline Systems"
Cohesion: 0.40
Nodes (4): HazardCatalogue, HazardSystem, PuzzleSystem, EffectApplier

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

## Knowledge Gaps
- **46 isolated node(s):** `Catalogue<T> (declaration-order registry)`, `GameViewData`, `Effect-to-event mapping`, `MetaAction union`, `Stub content fixture` (+41 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 116 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scripts` connect `NPM Scripts` to `Build Tooling and Linting`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `Catalogue<T> (declaration-order registry)`, `GameViewData`, `Effect-to-event mapping` to the rest of the system?**
  _46 weakly-connected nodes found - possible missing edges._
- **Should `Build Tooling and Linting` be split into smaller, more focused modules?**
  _Cohesion score 0.10098522167487685 - nodes in this community are weakly interconnected._
- **Should `Strict TypeScript Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Mechanics Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.09956709956709957 - nodes in this community are weakly interconnected._
- **Should `Application and UI Contracts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `OpenCode Agent Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._