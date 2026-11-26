# Graph Report - nimble-harbor  (2026-11-26)

## Corpus Check
- 336 files · ~168,519 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 2436 nodes · 6979 edges · 166 communities (156 shown, 10 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 437 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8fd48315`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- npcTopicOverlap.ts
- w7-opening-walkthrough.spec.ts
- vitest
- helpers.ts
- content/index.ts
- mechanics.ts
- persistence.ts
- ui.ts
- SaveManager.ts
- verbs/index.ts
- common.ts
- FakeElement
- parser.ts
- content.ts
- zone1.ts
- contentToolchain.ts
- asRecord
- topicOverlap.ts
- collection
- PuzzleSystem.test.ts
- compilerOptions
- GameWindow.ts
- ConversationFlow.ts
- asText
- Content authoring rules
- turn.ts
- PuzzleGraph.test.ts
- npcTopicOverlap.ts
- Condition
- validateContent.ts
- adapt.ts
- Command
- Documentation style guide
- commandResolution.ts
- area-progress.test.ts
- LoadResult
- scripts
- ContentBundle.ts
- HANDOFF — CompSciQuest content + W6/W7 state
- .makeActions
- opencode.json
- production-composition.spec.ts
- AuthoredRun
- Storage schema
- HintSystem.ts
- Q: Which canonical owners do the two stale W7 comment blocks describe?
- Core
- TopicSelection.ts
- ContentBundle
- package.json
- devDependencies
- npcs.ts
- ScoreTracker.ts
- SaveActions
- deploy.yml
- GameState.ts
- eslint.config.js
- Q: Does a save written after the accepted PUT step reload, and which content reference is rejected?
- Parser.ts
- Game.ts
- FakeRandom
- MemoryContentIo
- TopicPhrase.ts
- Q: Where are the ESLint flat config, NPM scripts, strict compilerOptions and Vite base configured?
- Q: Did adding typescript-eslint introduce duplicate canonical configs or cross-layer edges?
- Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?
- Q: Where are the runtime seams SaveManager Game createInitial EffectApplier Session BrowserStorage defined and how do they connect?
- Q: Bypass check: do compsciquest:save:v1, door-open: or earnedScore have code paths outside the canonical hubs?
- Q: Revision 1: did removing the root-level lives mirror and stub default restore canonical GameStateDto and initial turn 0?
- Q: Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?
- Q: Which canonical nodes own ContentBundle, validateContent, structural validation gates and score budgets?
- Q: Does the new validator create a hub, cross-layer edge or cycle?
- Q: Is there an existing owner for content validation or effect-scanning that should be reused?
- Q: Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?
- Q: Which canonical nodes own parser, turn pipeline and event formatting responsibilities?
- Q: Do any bypasses reimplement earnedScore, door-open flags, event bus, unknown message or exits formatting outside their canonical hubs?
- Q: Which canonical node owns content validation for the YAML-first toolchain red tests?
- Q: Which canonical nodes own content validation, content loading, stub bundle and NPC conversation types before adding toolchain modules?
- Q: Revision 1: which canonical nodes own façade Command resolution for put noun in target, and the already-open door/container precondition message?
- Q: Revision 1: which canonical nodes own put-command resolution, short-name alias resolution and the already-open precondition?
- Q: Revision 1 graph audit: any new bypasses, cross-layer edges or unexpected hub?
- Q: Do the new content toolchain nodes bypass the canonical runtime validator or catalogue factory?
- Q: Did the toolchain slice introduce a new catch-all hub, cross-layer import or import cycle?
- Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts
- Q: Which canonical nodes own area-like declarations, exit normalisation and todo detection for the content toolchain?
- Q: Do the revision-1 helpers bypass validateContent(), finding() or collection()?
- Q: Where do boot, title overlay, GameViewData, validation and save quarantine live?
- Q: Which canonical node audits covered-topic completion sources?
- Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?
- Q: Does boot have an existing validation owner other than validateContent(), and where do LoadFailureReason copy and quarantine live?
- Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?
- Q: CT-GATE-08: which node owns the hint-content unlock-key namespace check and why is hints-shown:<hintId> rejected?
- Q: Which gate validates hint unlock counter-key prefixes and which prefixes are agreed?
- Q: C3 generator and handoff contracts: generateContent(), indentJson(), emitCatalogue(), stripAuthoring(), loadContent(), createInitial(), stubBundle, validateContent(), GeneratedFile, specTopics, parsedSet(), topicHeadings
- Q: C3 generated handoff: which canonical nodes own compact emission, YAML-to-DTO adaptation and the initial-state default bundle?
- Q: Why do C-CONTENT-12/17 fail after C3 generation when validate(loadContent(), COVERAGE_TOPIC_IDS) is called?
- Q: Who owns directory-path declaration ordering for generated catalogues, and how should a slash-less root card path be grouped?
- Q: Which UI nodes own the boot title overlay geometry, 360px workspace reflow and transcript live region?
- Q: Where do the generated zone-1 catalogues, title screen, save controls and view fields come from?
- Q: Where is Vitest test collection configured and how do I exclude e2e specs?
- Q: Query formatEvent, GameEvent, TitleScreen, SaveControls and GameViewData so assertions use the real event names and view fields rather than remembered ones
- Q: Does the ES2022-safe copy-then-sort change preserve generator output and satisfy the Array#toSorted lint rule without suppressions?
- Q: Where are the named Playwright boot tests and GameWindow echo path?
- Q: Do hazard and puzzle doc concept nodes expose runtime source_location?
- Q: Which nodes are canonical for hazards, puzzles, scheduler, effects and phase-4 ordering in the hazards-puzzles slice?
- Q: Where is the canonical production Game factory used by main.ts for UI-BOOT-18 wiring?
- Q: Where are the canonical owners for hazard/puzzle/scheduler/effect/score behaviour in the hazards-puzzles slice?
- Q: Why did H-SCHED-04 fail on fixture wiring after the scheduler was implemented?
- Q: Which collaborators canonically own game-over, score awards and hazard events so test seams should delegate to them?
- Q: validateContent() hazardContentFindings() puzzleGraphFindings() content:validate content:scaffold content:generate verbatimModuleSyntax allowImportingTsExtensions loadValidation() loadScaffolder() loadGenerator() ValidationModule
- Q: Which canonical module owns validation and what value imports must carry the .ts extension for plain Node ESM resolution?
- Q: room-scoping: which ConditionEvaluator node is canonical for in-room/in-area, visited-room and topic-complete?
- Q: Which canonical nodes own condition scoping (in-room/in-area and progress-wide visited-room/topic-complete), and are there duplicate owners or bypasses after the room-scoping change?
- Q: Where are the canonical owners for the amended event-returning phase-4 composition, hazard triggers, puzzle counters and per-puzzle scoring?
- Q: How are commands parsed and what event names/view fields exist for assertions?
- Q: DialogueSystem TopicResolver ConversationTopic ConversationNode ActorState NpcStateDto ResolvedTopic TopicMatch ResponseStrategy ConversationPanel ConditionEvaluator EffectApplier
- Q: P-TAKE-01: where is takeHandler() and which canonical nodes gate take/drop and define ItemDefinition?
- Q: P-TAKE-01: where is the canonical take/drop handler and which item fields drive its refusal?
- Q: F1: does an authored refusalText of '' on a non-portable item use the fallback in takeHandler()?
- Q: Where are the NPC runtime seams: TopicResolver, DialogueSystem, ConversationTopic/Node, ActorState, NpcStateDto, EffectApplier and the Game facade?
- Q: F1: which handler selects refusalText for a non-portable take, and where is the fallback literal produced?
- Q: Where is room-entered built and formatted, and which nodes carry the catalogue room summary?
- Q: How are use, put and show commands produced and which handlers map them today?
- Q: Where are QuizSystem, HintSystem and the composed reaction wired?
- Q: npcs slice: NPC runtime behaviour seam locations (DialogueSystem, TopicResolver, ConversationFlow, ConversationTopic/Node, ActorState, NpcStateDto, TopicMatch, ResolvedTopic, ResponseStrategy)
- Q: Where is the authoring-only refusalText check implemented and what are the other gate owners in tools/content/schema.ts?
- Q: NPC slice: where is the node-default catch and node expiry implemented and why do NODE-02 and GAP-05 share the same shape
- Q: NPC slice: locate DialogueSystem, TopicResolver, ConversationTopic, ConversationNode, ActorState, NpcStateDto, ResolvedTopic, TopicMatch, ResponseStrategy, ConversationPanel, ConditionEvaluator, EffectApplier
- Q: Where are the canonical connected authored-effects seams for room entry, USE/PUT/SHOW, quiz and hint delivery?
- Q: Which canonical nodes own the quizzes-hints slice seam, quiz-passed condition, panel rendering and score guard?
- Q: Which nodes own quiz and hint delivery in the quiz-hints slice?
- Q: Which canonical nodes own W7 room/event rendering and the observed non-quiz runtime failures?
- Q: Quiz and hint revision contracts: seeded Random persistence, set-flag no-op, answer aliases, automatic hint cadence
- Q: Why did the QUIZ-HINT-07 room-context hint resolve to the Binary Hall instead of the switch floor?
- Q: How should a quiz retry re-set emit while ScoreTracker awards once, and which object owns the injected initial state?
- Q: C7 npc topic overlap gate: where do checkNpc, validateCards, ValidationOptions and Condition exclusivity live and is there an existing overlap owner?
- .prettierrc.json
- normalisedCards
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- node-shims.d.ts
- HintSystem
- SeededRandom
- ScoreTracker
- Quiz combat
- Hazards
- Q: Where are the W7 runtime owners for declared topic phrases, progress-row creation and interaction shape validation?
- Q: How are actor-bound topics, exhausted once, progress rows and interaction validation wired at runtime, and what are the real event names and view fields?
- 4. Design card format
- Q: NPC topic resolution score consistency area progress content validation nodes
- Q: Canonical GameEvent union and Game façade
- Q: TopicResolver .resolve() ResolvedTopic TopicMatch KeywordMatch AskTellMatch ConversationTopic handleConversationTopic() findDefaultTopic() ScoreTracker AreaProgress validateContent
- Q: GameState createFromDto() makeRuntimeState() GameStateDto ScoreTracker AreaProgress createScoreTracker() progressEntry() totalOf() GameState.ts ScoreTracker.ts persistence.ts
- Q: Find a graph node for the stale e2e assertion E2E-CONTENT-01 catalogue counts
- Q: What is the compliant exact-topic selection rule for W7R-NPC-01/g and where is the idle default reply owned?
- Q: Where is W7R-NPC-01/g exact quiz handoff phrase preference among object matches implemented, and does it avoid fallthrough?
- Q: W7 runtime owners for topic resolution, once fallback, area progress and interaction shape
- Q: How does W7R-NPC-01/g choose an exact declared object topic when several topics declare the same phrase?
- ConditionEvaluator.test.ts
- ValidationModule
- tsconfig.json
- zod
- RuntimeGameState

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 110 edges
2. `GameEvent` - 90 edges
3. `vitest` - 86 edges
4. `GameState` - 75 edges
5. `asText()` - 62 edges
6. `finding()` - 58 edges
7. `Effect` - 51 edges
8. `Command` - 48 edges
9. `Random` - 47 edges
10. `FakeRandom` - 42 edges

## Surprising Connections (you probably didn't know these)
- `6. Events and UI` --references--> `OutputLog`  [INFERRED]
  docs/developer/hazards.md → src/ui/OutputLog.ts
- `8.2 Result type` --references--> `SaveControls`  [INFERRED]
  docs/developer/storage-schema.md → src/ui/SaveControls.ts
- `5. Hints` --references--> `ScoreTracker`  [INFERRED]
  docs/developer/combat.md → src/core/scoring/ScoreTracker.ts
- `8. Traps and gotchas (learned the hard way)` --references--> `SpecTopic`  [INFERRED]
  HANDOFF.md → src/core/scoring/SpecTopic.ts
- `D — Data and cards` --references--> `RoomDefinition`  [INFERRED]
  docs/developer/content-rules.md → src/content/RoomDefinition.ts

## Import Cycles
- None detected.

## Communities (166 total, 10 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.19
Nodes (11): 8. Fixed contracts content must use, loadContent(), createEventBus(), bootstrap(), browserDownload(), browserOpenSaveFile(), seededRandom(), startBrowserApp() (+3 more)

### Community 1 - "npcTopicOverlap.ts"
Cohesion: 0.14
Nodes (40): DEFERRED_GATES, gNpc12(), gNpc13(), gNpc15(), gNpc16(), gNpc17(), gNpc18(), runtimeBundle() (+32 more)

### Community 2 - "w7-opening-walkthrough.spec.ts"
Cohesion: 0.14
Nodes (24): submit(), command(), contrastRatio(), CONTROL_ORDER, enter(), expectEntry(), expectFlag(), expectOwners() (+16 more)

### Community 3 - "vitest"
Cohesion: 0.07
Nodes (43): GameEvent, RoomSummary, HintLevel, finishWithWrongAnswers(), questionFor(), wrongAnswer(), activeQuiz(), answerCorrectly() (+35 more)

### Community 4 - "helpers.ts"
Cohesion: 0.10
Nodes (26): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+18 more)

### Community 5 - "content/index.ts"
Cohesion: 0.11
Nodes (19): area, START_POSITION, startRoom, actorStates, actors, conversationTopics, hints, items (+11 more)

### Community 6 - "mechanics.ts"
Cohesion: 0.11
Nodes (25): puzzleDefinition(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, FIXED_TURN, HAZARD_ID, HazardSystemFactory (+17 more)

### Community 7 - "persistence.ts"
Cohesion: 0.11
Nodes (30): asRuntime(), EffectApplierDependencies, EffectApplierLike, envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, importModule() (+22 more)

### Community 8 - "ui.ts"
Cohesion: 0.14
Nodes (22): makeEnvelope(), allText(), Bootstrap, descendants(), FakeBus, FakeDocument, findButton(), flush() (+14 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.15
Nodes (30): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+22 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.10
Nodes (39): describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible(), matchingInteraction(), normalise() (+31 more)

### Community 11 - "common.ts"
Cohesion: 0.13
Nodes (31): Finding, ParsedCardSet, asNumber(), CardEntry, stringList(), checkHint(), ladderFindings(), levelFindings() (+23 more)

### Community 12 - "FakeElement"
Cohesion: 0.09
Nodes (7): absentElement(), FakeElement, hasMatchingAncestors(), isTokenMatch(), press(), statusText(), press()

### Community 13 - "parser.ts"
Cohesion: 0.10
Nodes (29): vitest, ParsedCommand, CHEST_ID, DOOR_ID, KEY_A, KEY_B, loadNameResolver(), loadParser() (+21 more)

### Community 14 - "content.ts"
Cohesion: 0.14
Nodes (31): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+23 more)

### Community 15 - "zone1.ts"
Cohesion: 0.11
Nodes (25): generatedRoomIds(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES, ParsedCardSet (+17 more)

### Community 16 - "contentToolchain.ts"
Cohesion: 0.06
Nodes (40): Data, PER_AREA_PATHS, cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), AREA_ID, CardFile (+32 more)

### Community 17 - "asRecord"
Cohesion: 0.07
Nodes (42): 3. Scaffolds, CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards() (+34 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (33): ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf(), DataRecord (+25 more)

### Community 19 - "collection"
Cohesion: 0.17
Nodes (27): asArray(), asObjectArray(), collection(), coverageIds(), DIRECTIONS, effectList(), entriesWith(), knownTopicIds() (+19 more)

### Community 20 - "PuzzleSystem.test.ts"
Cohesion: 0.21
Nodes (17): DOOR_FLAG, eventTypes(), hazard(), loadConditionEvaluatorFactory(), loadHazardSystemFactory(), mechanicsBundle(), mechanicsState(), NORTH_ROOM (+9 more)

### Community 21 - "compilerOptions"
Cohesion: 0.08
Nodes (26): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+18 more)

### Community 22 - "GameWindow.ts"
Cohesion: 0.09
Nodes (21): 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, Persistence and UI, 7. State, events and UI, GameViewData, QuarantineDto, LoadFailureReason (+13 more)

### Community 23 - "ConversationFlow.ts"
Cohesion: 0.18
Nodes (23): activeNode(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode(), handleConversationTopic() (+15 more)

### Community 24 - "asText"
Cohesion: 0.21
Nodes (29): allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), EFFECT_KINDS, finding(), idsOf() (+21 more)

### Community 25 - "Content authoring rules"
Cohesion: 0.11
Nodes (18): 1. Purpose and authority, 2. Workflow gates, 3. Rule catalogue, 5. ID and alias registry, 6.1 Content critic, 6.2 PCK reviewer, 6. Reviewer rubrics, 9.1 Shared definition of done (+10 more)

### Community 26 - "turn.ts"
Cohesion: 0.13
Nodes (7): loadSession(), EventBusFactory, FormatEventFunction, loadEventBus(), loadFormatEvent(), MemoryBus, EVENTS

### Community 27 - "PuzzleGraph.test.ts"
Cohesion: 0.10
Nodes (26): gateFindings(), CardData, cleanParsedSet(), definition(), roomData(), actor(), Data, EmittedNode (+18 more)

### Community 28 - "npcTopicOverlap.ts"
Cohesion: 0.21
Nodes (27): gNpc06(), gNpc07(), gNpc08(), gNpc09(), gNpc10(), gNpc11(), gNpc14(), ACTOR_ID (+19 more)

### Community 29 - "Condition"
Cohesion: 0.14
Nodes (14): 1. Purpose and authority, 7. Core contracts, 1. Scope, 1. Purpose, 3.2 Entity and system state, ExitDefinition, Hazard, HazardCatalogue (+6 more)

### Community 30 - "validateContent.ts"
Cohesion: 0.06
Nodes (46): 7.1 Free-text topic-overlap proof, 7. Structural validation gates, aliasProblems(), aliasProblemsOf(), asRecord(), budgetProblems(), catalogueIds(), coverageProblems() (+38 more)

### Community 31 - "adapt.ts"
Cohesion: 0.12
Nodes (28): bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings(), text() (+20 more)

### Community 32 - "Command"
Cohesion: 0.06
Nodes (47): 5.1 Door and container verbs, 5.2 Verb table and handler signature, 5. Canonical command union and verbs, 8. Behavioural signatures, 3. Execution, 1. Scope, 3. Completion detection, 4. Puzzle Dependency Graph (+39 more)

### Community 33 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 34 - "commandResolution.ts"
Cohesion: 0.15
Nodes (20): actorAndRemainder(), answerCommand(), conversationCommand(), DIRECTION_NAMES, fallbackPair(), isDirection(), noArgumentCommand(), PUT_PREPOSITIONS (+12 more)

### Community 35 - "area-progress.test.ts"
Cohesion: 0.16
Nodes (12): 2. Authoring format, AreaProgressView, ConversationView, HintView, QuizView, SpecTopicView, SpecStatus, SpecTopic (+4 more)

### Community 36 - "LoadResult"
Cohesion: 0.09
Nodes (13): LoadResult, SaveDto, documentState, FakeEvent, FakeKeyboardEvent, findByClass(), findFirstByClass(), Listener (+5 more)

### Community 37 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 38 - "ContentBundle.ts"
Cohesion: 0.10
Nodes (30): 3.1 Catalogue shape, 4.3 NPC card, ActorDefinition, Catalogue, catalogueOf(), RoomDefinition, Quiz, QuizQuestion (+22 more)

### Community 39 - "HANDOFF — CompSciQuest content + W6/W7 state"
Cohesion: 0.10
Nodes (20): 4. Conversation flow, 10. Commit / push note, 1. One-paragraph summary, 2. Read these first (in order), 3. What is accepted (content, do not re-litigate), 4.1 Failure inventory, 4.2 The generated bundle is stale — verify this first, 4. Current verification state (measured 2026-11-26) (+12 more)

### Community 40 - ".makeActions"
Cohesion: 0.18
Nodes (5): 3.3 Loading and validation, 4.1 Meta actions, 4. Game façade and meta actions, Game, AuthoredGameFixture

### Community 41 - "opencode.json"
Cohesion: 0.13
Nodes (14): command, type, default_agent, command, type, mcp, servers, permissions (+6 more)

### Community 42 - "production-composition.spec.ts"
Cohesion: 0.21
Nodes (6): SAVED_AT, scorePanel(), repeatableHazard, AreaDefinition, areas, hazards

### Community 43 - "AuthoredRun"
Cohesion: 0.33
Nodes (3): AuthoredRun, gateFlag(), lastQuestion()

### Community 44 - "Storage schema"
Cohesion: 0.13
Nodes (14): 6.4 Save, load, download and import, 10. API contracts, 11. Flow, 12. Invariants the implementation must keep, 13. Out of scope, 1. Scope and authority, 2. Envelope, keys and file format, 4. Counters and stuckness (+6 more)

### Community 45 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 46 - "Q: Which canonical owners do the two stale W7 comment blocks describe?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical owners do the two stale W7 comment blocks describe?, Source Nodes

### Community 47 - "Core"
Cohesion: 0.35
Nodes (7): Core, 3. Condition, Exit, Room, Precondition, World, Position

### Community 48 - "TopicSelection.ts"
Cohesion: 0.21
Nodes (20): fallBackAfterOnce(), AskTellMatch, chooseCandidate(), exactDeclaredTopic(), findDefaultTopic(), GiveShowMatch, hasKeyword(), hasObjectMatch() (+12 more)

### Community 49 - "ContentBundle"
Cohesion: 0.10
Nodes (41): 2. Boot, title screen and session start, 10. Out of scope, 1. Scope and goals, 3. Layers and dependency direction, 4. Source layout, 5. Module responsibilities, 6.1 Bootstrap (`src/main.ts`), 8. Conventions (+33 more)

### Community 50 - "package.json"
Cohesion: 0.17
Nodes (11): description, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, yaml@^2.9.1, name, private, type, version (+3 more)

### Community 51 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint@^10.15.0, playwright@1.65.1, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, typescript-7@npm:typescript@^7.0.2, vite@^8.3.8, vitest@^5.1.1 (+5 more)

### Community 52 - "npcs.ts"
Cohesion: 0.06
Nodes (67): createFromDto(), stateToDto(), formatEvent(), label(), topicLabel(), ACTOR_ALIAS, ACTOR_ID, actorState() (+59 more)

### Community 53 - "ScoreTracker.ts"
Cohesion: 0.19
Nodes (20): areaPairForRoom(), areaPairForTopic(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, applyStateEffect(), Announce, AreaPair (+12 more)

### Community 54 - "SaveActions"
Cohesion: 0.29
Nodes (3): 9. Quarantine, SaveActions, SaveControls

### Community 55 - "deploy.yml"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 56 - "GameState.ts"
Cohesion: 0.08
Nodes (34): 1. Scope, 2. Model, 5. Conversation nodes, 6. Link to quiz combat, NPCs and conversation, 2. Model, applyBookkeepingEffect(), applyEffect() (+26 more)

### Community 57 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 59 - "Q: Does a save written after the accepted PUT step reload, and which content reference is rejected?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does a save written after the accepted PUT step reload, and which content reference is rejected?, Source Nodes

### Community 60 - "Parser.ts"
Cohesion: 0.27
Nodes (7): DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, parseRaw(), SINGLE_ALIASES, tokenize

### Community 61 - "Game.ts"
Cohesion: 0.11
Nodes (19): adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), recordSeed(), MetaAction, createQuizSystem(), getCommandHandler (+11 more)

### Community 62 - "FakeRandom"
Cohesion: 0.31
Nodes (7): createEffectApplier(), applierFor(), FakeRandom, createEffectApplierFor(), applierFor(), applyAll(), systemFor()

### Community 64 - "TopicPhrase.ts"
Cohesion: 0.39
Nodes (8): AskTellMatch, collectMatches(), DeclaredObjectPhrase, findDeclaredObjectPhrase(), isAskTellMatch(), isBoundToActor(), isObjectName(), normalise()

### Community 65 - "Q: Where are the ESLint flat config, NPM scripts, strict compilerOptions and Vite base configured?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the ESLint flat config, NPM scripts, strict compilerOptions and Vite base configured?, Source Nodes

### Community 66 - "Q: Did adding typescript-eslint introduce duplicate canonical configs or cross-layer edges?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Did adding typescript-eslint introduce duplicate canonical configs or cross-layer edges?, Source Nodes

### Community 67 - "Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?, Source Nodes

### Community 68 - "Q: Where are the runtime seams SaveManager Game createInitial EffectApplier Session BrowserStorage defined and how do they connect?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the runtime seams SaveManager Game createInitial EffectApplier Session BrowserStorage defined and how do they connect?, Source Nodes

### Community 69 - "Q: Bypass check: do compsciquest:save:v1, door-open: or earnedScore have code paths outside the canonical hubs?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bypass check: do compsciquest:save:v1, door-open: or earnedScore have code paths outside the canonical hubs?, Source Nodes

### Community 70 - "Q: Revision 1: did removing the root-level lives mirror and stub default restore canonical GameStateDto and initial turn 0?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: did removing the root-level lives mirror and stub default restore canonical GameStateDto and initial turn 0?, Source Nodes

### Community 71 - "Q: Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?, Source Nodes

### Community 72 - "Q: Which canonical nodes own ContentBundle, validateContent, structural validation gates and score budgets?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own ContentBundle, validateContent, structural validation gates and score budgets?, Source Nodes

### Community 73 - "Q: Does the new validator create a hub, cross-layer edge or cycle?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the new validator create a hub, cross-layer edge or cycle?, Source Nodes

### Community 74 - "Q: Is there an existing owner for content validation or effect-scanning that should be reused?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Is there an existing owner for content validation or effect-scanning that should be reused?, Source Nodes

### Community 75 - "Q: Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?, Source Nodes

### Community 76 - "Q: Which canonical nodes own parser, turn pipeline and event formatting responsibilities?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own parser, turn pipeline and event formatting responsibilities?, Source Nodes

### Community 77 - "Q: Do any bypasses reimplement earnedScore, door-open flags, event bus, unknown message or exits formatting outside their canonical hubs?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do any bypasses reimplement earnedScore, door-open flags, event bus, unknown message or exits formatting outside their canonical hubs?, Source Nodes

### Community 78 - "Q: Which canonical node owns content validation for the YAML-first toolchain red tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns content validation for the YAML-first toolchain red tests?, Source Nodes

### Community 79 - "Q: Which canonical nodes own content validation, content loading, stub bundle and NPC conversation types before adding toolchain modules?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own content validation, content loading, stub bundle and NPC conversation types before adding toolchain modules?, Source Nodes

### Community 80 - "Q: Revision 1: which canonical nodes own façade Command resolution for put noun in target, and the already-open door/container precondition message?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: which canonical nodes own façade Command resolution for put noun in target, and the already-open door/container precondition message?, Source Nodes

### Community 81 - "Q: Revision 1: which canonical nodes own put-command resolution, short-name alias resolution and the already-open precondition?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: which canonical nodes own put-command resolution, short-name alias resolution and the already-open precondition?, Source Nodes

### Community 82 - "Q: Revision 1 graph audit: any new bypasses, cross-layer edges or unexpected hub?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1 graph audit: any new bypasses, cross-layer edges or unexpected hub?, Source Nodes

### Community 83 - "Q: Do the new content toolchain nodes bypass the canonical runtime validator or catalogue factory?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do the new content toolchain nodes bypass the canonical runtime validator or catalogue factory?, Source Nodes

### Community 84 - "Q: Did the toolchain slice introduce a new catch-all hub, cross-layer import or import cycle?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Did the toolchain slice introduce a new catch-all hub, cross-layer import or import cycle?, Source Nodes

### Community 85 - "Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts, Source Nodes

### Community 86 - "Q: Which canonical nodes own area-like declarations, exit normalisation and todo detection for the content toolchain?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own area-like declarations, exit normalisation and todo detection for the content toolchain?, Source Nodes

### Community 87 - "Q: Do the revision-1 helpers bypass validateContent(), finding() or collection()?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do the revision-1 helpers bypass validateContent(), finding() or collection()?, Source Nodes

### Community 88 - "Q: Where do boot, title overlay, GameViewData, validation and save quarantine live?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do boot, title overlay, GameViewData, validation and save quarantine live?, Source Nodes

### Community 89 - "Q: Which canonical node audits covered-topic completion sources?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node audits covered-topic completion sources?, Source Nodes

### Community 90 - "Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?, Source Nodes

### Community 91 - "Q: Does boot have an existing validation owner other than validateContent(), and where do LoadFailureReason copy and quarantine live?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does boot have an existing validation owner other than validateContent(), and where do LoadFailureReason copy and quarantine live?, Source Nodes

### Community 92 - "Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?, Source Nodes

### Community 93 - "Q: CT-GATE-08: which node owns the hint-content unlock-key namespace check and why is hints-shown:<hintId> rejected?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: CT-GATE-08: which node owns the hint-content unlock-key namespace check and why is hints-shown:<hintId> rejected?, Source Nodes

### Community 94 - "Q: Which gate validates hint unlock counter-key prefixes and which prefixes are agreed?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which gate validates hint unlock counter-key prefixes and which prefixes are agreed?, Source Nodes

### Community 95 - "Q: C3 generator and handoff contracts: generateContent(), indentJson(), emitCatalogue(), stripAuthoring(), loadContent(), createInitial(), stubBundle, validateContent(), GeneratedFile, specTopics, parsedSet(), topicHeadings"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: C3 generator and handoff contracts: generateContent(), indentJson(), emitCatalogue(), stripAuthoring(), loadContent(), createInitial(), stubBundle, validateContent(), GeneratedFile, specTopics, parsedSet(), topicHeadings(), Source Nodes

### Community 96 - "Q: C3 generated handoff: which canonical nodes own compact emission, YAML-to-DTO adaptation and the initial-state default bundle?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: C3 generated handoff: which canonical nodes own compact emission, YAML-to-DTO adaptation and the initial-state default bundle?, Source Nodes

### Community 97 - "Q: Why do C-CONTENT-12/17 fail after C3 generation when validate(loadContent(), COVERAGE_TOPIC_IDS) is called?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do C-CONTENT-12/17 fail after C3 generation when validate(loadContent(), COVERAGE_TOPIC_IDS) is called?, Source Nodes

### Community 98 - "Q: Who owns directory-path declaration ordering for generated catalogues, and how should a slash-less root card path be grouped?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns directory-path declaration ordering for generated catalogues, and how should a slash-less root card path be grouped?, Source Nodes

### Community 99 - "Q: Which UI nodes own the boot title overlay geometry, 360px workspace reflow and transcript live region?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which UI nodes own the boot title overlay geometry, 360px workspace reflow and transcript live region?, Source Nodes

### Community 100 - "Q: Where do the generated zone-1 catalogues, title screen, save controls and view fields come from?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do the generated zone-1 catalogues, title screen, save controls and view fields come from?, Source Nodes

### Community 101 - "Q: Where is Vitest test collection configured and how do I exclude e2e specs?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is Vitest test collection configured and how do I exclude e2e specs?, Source Nodes

### Community 102 - "Q: Query formatEvent, GameEvent, TitleScreen, SaveControls and GameViewData so assertions use the real event names and view fields rather than remembered ones"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Query formatEvent, GameEvent, TitleScreen, SaveControls and GameViewData so assertions use the real event names and view fields rather than remembered ones, Source Nodes

### Community 103 - "Q: Does the ES2022-safe copy-then-sort change preserve generator output and satisfy the Array#toSorted lint rule without suppressions?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the ES2022-safe copy-then-sort change preserve generator output and satisfy the Array#toSorted lint rule without suppressions?, Source Nodes

### Community 104 - "Q: Where are the named Playwright boot tests and GameWindow echo path?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the named Playwright boot tests and GameWindow echo path?, Source Nodes

### Community 105 - "Q: Do hazard and puzzle doc concept nodes expose runtime source_location?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do hazard and puzzle doc concept nodes expose runtime source_location?, Source Nodes

### Community 106 - "Q: Which nodes are canonical for hazards, puzzles, scheduler, effects and phase-4 ordering in the hazards-puzzles slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which nodes are canonical for hazards, puzzles, scheduler, effects and phase-4 ordering in the hazards-puzzles slice?, Source Nodes

### Community 107 - "Q: Where is the canonical production Game factory used by main.ts for UI-BOOT-18 wiring?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical production Game factory used by main.ts for UI-BOOT-18 wiring?, Source Nodes

### Community 108 - "Q: Where are the canonical owners for hazard/puzzle/scheduler/effect/score behaviour in the hazards-puzzles slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical owners for hazard/puzzle/scheduler/effect/score behaviour in the hazards-puzzles slice?, Source Nodes

### Community 109 - "Q: Why did H-SCHED-04 fail on fixture wiring after the scheduler was implemented?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did H-SCHED-04 fail on fixture wiring after the scheduler was implemented?, Source Nodes

### Community 110 - "Q: Which collaborators canonically own game-over, score awards and hazard events so test seams should delegate to them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which collaborators canonically own game-over, score awards and hazard events so test seams should delegate to them?, Source Nodes

### Community 111 - "Q: validateContent() hazardContentFindings() puzzleGraphFindings() content:validate content:scaffold content:generate verbatimModuleSyntax allowImportingTsExtensions loadValidation() loadScaffolder() loadGenerator() ValidationModule"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: validateContent() hazardContentFindings() puzzleGraphFindings() content:validate content:scaffold content:generate verbatimModuleSyntax allowImportingTsExtensions loadValidation() loadScaffolder() loadGenerator() ValidationModule, Source Nodes

### Community 112 - "Q: Which canonical module owns validation and what value imports must carry the .ts extension for plain Node ESM resolution?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical module owns validation and what value imports must carry the .ts extension for plain Node ESM resolution?, Source Nodes

### Community 113 - "Q: room-scoping: which ConditionEvaluator node is canonical for in-room/in-area, visited-room and topic-complete?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: room-scoping: which ConditionEvaluator node is canonical for in-room/in-area, visited-room and topic-complete?, Source Nodes

### Community 114 - "Q: Which canonical nodes own condition scoping (in-room/in-area and progress-wide visited-room/topic-complete), and are there duplicate owners or bypasses after the room-scoping change?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own condition scoping (in-room/in-area and progress-wide visited-room/topic-complete), and are there duplicate owners or bypasses after the room-scoping change?, Source Nodes

### Community 115 - "Q: Where are the canonical owners for the amended event-returning phase-4 composition, hazard triggers, puzzle counters and per-puzzle scoring?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical owners for the amended event-returning phase-4 composition, hazard triggers, puzzle counters and per-puzzle scoring?, Source Nodes

### Community 116 - "Q: How are commands parsed and what event names/view fields exist for assertions?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How are commands parsed and what event names/view fields exist for assertions?, Source Nodes

### Community 117 - "Q: DialogueSystem TopicResolver ConversationTopic ConversationNode ActorState NpcStateDto ResolvedTopic TopicMatch ResponseStrategy ConversationPanel ConditionEvaluator EffectApplier"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: DialogueSystem TopicResolver ConversationTopic ConversationNode ActorState NpcStateDto ResolvedTopic TopicMatch ResponseStrategy ConversationPanel ConditionEvaluator EffectApplier, Source Nodes

### Community 118 - "Q: P-TAKE-01: where is takeHandler() and which canonical nodes gate take/drop and define ItemDefinition?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: P-TAKE-01: where is takeHandler() and which canonical nodes gate take/drop and define ItemDefinition?, Source Nodes

### Community 119 - "Q: P-TAKE-01: where is the canonical take/drop handler and which item fields drive its refusal?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: P-TAKE-01: where is the canonical take/drop handler and which item fields drive its refusal?, Source Nodes

### Community 120 - "Q: F1: does an authored refusalText of '' on a non-portable item use the fallback in takeHandler()?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: F1: does an authored refusalText of '' on a non-portable item use the fallback in takeHandler()?, Source Nodes

### Community 121 - "Q: Where are the NPC runtime seams: TopicResolver, DialogueSystem, ConversationTopic/Node, ActorState, NpcStateDto, EffectApplier and the Game facade?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the NPC runtime seams: TopicResolver, DialogueSystem, ConversationTopic/Node, ActorState, NpcStateDto, EffectApplier and the Game facade?, Source Nodes

### Community 122 - "Q: F1: which handler selects refusalText for a non-portable take, and where is the fallback literal produced?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: F1: which handler selects refusalText for a non-portable take, and where is the fallback literal produced?, Source Nodes

### Community 123 - "Q: Where is room-entered built and formatted, and which nodes carry the catalogue room summary?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is room-entered built and formatted, and which nodes carry the catalogue room summary?, Source Nodes

### Community 124 - "Q: How are use, put and show commands produced and which handlers map them today?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How are use, put and show commands produced and which handlers map them today?, Source Nodes

### Community 125 - "Q: Where are QuizSystem, HintSystem and the composed reaction wired?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are QuizSystem, HintSystem and the composed reaction wired?, Source Nodes

### Community 126 - "Q: npcs slice: NPC runtime behaviour seam locations (DialogueSystem, TopicResolver, ConversationFlow, ConversationTopic/Node, ActorState, NpcStateDto, TopicMatch, ResolvedTopic, ResponseStrategy)"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: npcs slice: NPC runtime behaviour seam locations (DialogueSystem, TopicResolver, ConversationFlow, ConversationTopic/Node, ActorState, NpcStateDto, TopicMatch, ResolvedTopic, ResponseStrategy), Source Nodes

### Community 127 - "Q: Where is the authoring-only refusalText check implemented and what are the other gate owners in tools/content/schema.ts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the authoring-only refusalText check implemented and what are the other gate owners in tools/content/schema.ts?, Source Nodes

### Community 128 - "Q: NPC slice: where is the node-default catch and node expiry implemented and why do NODE-02 and GAP-05 share the same shape"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: NPC slice: where is the node-default catch and node expiry implemented and why do NODE-02 and GAP-05 share the same shape, Source Nodes

### Community 129 - "Q: NPC slice: locate DialogueSystem, TopicResolver, ConversationTopic, ConversationNode, ActorState, NpcStateDto, ResolvedTopic, TopicMatch, ResponseStrategy, ConversationPanel, ConditionEvaluator, EffectApplier"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: NPC slice: locate DialogueSystem, TopicResolver, ConversationTopic, ConversationNode, ActorState, NpcStateDto, ResolvedTopic, TopicMatch, ResponseStrategy, ConversationPanel, ConditionEvaluator, EffectApplier, Source Nodes

### Community 130 - "Q: Where are the canonical connected authored-effects seams for room entry, USE/PUT/SHOW, quiz and hint delivery?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical connected authored-effects seams for room entry, USE/PUT/SHOW, quiz and hint delivery?, Source Nodes

### Community 131 - "Q: Which canonical nodes own the quizzes-hints slice seam, quiz-passed condition, panel rendering and score guard?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the quizzes-hints slice seam, quiz-passed condition, panel rendering and score guard?, Source Nodes

### Community 132 - "Q: Which nodes own quiz and hint delivery in the quiz-hints slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which nodes own quiz and hint delivery in the quiz-hints slice?, Source Nodes

### Community 133 - "Q: Which canonical nodes own W7 room/event rendering and the observed non-quiz runtime failures?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own W7 room/event rendering and the observed non-quiz runtime failures?, Source Nodes

### Community 134 - "Q: Quiz and hint revision contracts: seeded Random persistence, set-flag no-op, answer aliases, automatic hint cadence"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Quiz and hint revision contracts: seeded Random persistence, set-flag no-op, answer aliases, automatic hint cadence, Source Nodes

### Community 135 - "Q: Why did the QUIZ-HINT-07 room-context hint resolve to the Binary Hall instead of the switch floor?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did the QUIZ-HINT-07 room-context hint resolve to the Binary Hall instead of the switch floor?, Source Nodes

### Community 136 - "Q: How should a quiz retry re-set emit while ScoreTracker awards once, and which object owns the injected initial state?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should a quiz retry re-set emit while ScoreTracker awards once, and which object owns the injected initial state?, Source Nodes

### Community 137 - "Q: C7 npc topic overlap gate: where do checkNpc, validateCards, ValidationOptions and Condition exclusivity live and is there an existing overlap owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: C7 npc topic overlap gate: where do checkNpc, validateCards, ValidationOptions and Condition exclusivity live and is there an existing overlap owner?, Source Nodes

### Community 138 - ".prettierrc.json"
Cohesion: 0.40
Nodes (4): printWidth, proseWrap, singleQuote, trailingComma

### Community 139 - "normalisedCards"
Cohesion: 0.29
Nodes (8): 1. Purpose, 4. Validation, 5. Generation, 6. Ownership, 7. Coverage-graph extraction, Content toolchain, normalisedCards(), normaliseExit()

### Community 140 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Where is P-TAKE-01 takeHandler and what governs portable items?

### Community 141 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Find a document heading node named Room entry text

### Community 143 - "HintSystem"
Cohesion: 0.39
Nodes (7): 1. Scope, 2. Model, 3. Commands and delivery, 4. Adaptive behaviour, 5. Score interaction, Hints, HintSystem

### Community 146 - "ScoreTracker"
Cohesion: 0.07
Nodes (32): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Behavioural guarantees, 3.2 World, area, room and item definitions, 3. Content bundle and registration, 6.1 Event to view mapping, 6. Canonical event union and rendering, 9. Effect to event mapping (+24 more)

### Community 147 - "Quiz combat"
Cohesion: 0.40
Nodes (5): 1. Scope, 2. Model, 4. Commands and events, 5. Hints, Quiz combat

### Community 148 - "Hazards"
Cohesion: 0.40
Nodes (5): 2. Model, 4. Failure consequences, 5. Content, 6. Events and UI, Hazards

### Community 149 - "Q: Where are the W7 runtime owners for declared topic phrases, progress-row creation and interaction shape validation?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 runtime owners for declared topic phrases, progress-row creation and interaction shape validation?, Source Nodes

### Community 150 - "Q: How are actor-bound topics, exhausted once, progress rows and interaction validation wired at runtime, and what are the real event names and view fields?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How are actor-bound topics, exhausted once, progress rows and interaction validation wired at runtime, and what are the real event names and view fields?, Source Nodes

### Community 151 - "4. Design card format"
Cohesion: 0.29
Nodes (7): 4.1 Common conventions, 4.2 Area and rooms card, 4.4 Quiz card, 4.5 Puzzle card, 4.6 Hazard card, 4.7 Hint card, 4. Design card format

### Community 152 - "Q: NPC topic resolution score consistency area progress content validation nodes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: NPC topic resolution score consistency area progress content validation nodes, Source Nodes

### Community 153 - "Q: Canonical GameEvent union and Game façade"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Canonical GameEvent union and Game façade, Source Nodes

### Community 154 - "Q: TopicResolver .resolve() ResolvedTopic TopicMatch KeywordMatch AskTellMatch ConversationTopic handleConversationTopic() findDefaultTopic() ScoreTracker AreaProgress validateContent"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: TopicResolver .resolve() ResolvedTopic TopicMatch KeywordMatch AskTellMatch ConversationTopic handleConversationTopic() findDefaultTopic() ScoreTracker AreaProgress validateContent(), Source Nodes

### Community 155 - "Q: GameState createFromDto() makeRuntimeState() GameStateDto ScoreTracker AreaProgress createScoreTracker() progressEntry() totalOf() GameState.ts ScoreTracker.ts persistence.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: GameState createFromDto() makeRuntimeState() GameStateDto ScoreTracker AreaProgress createScoreTracker() progressEntry() totalOf() GameState.ts ScoreTracker.ts persistence.ts, Source Nodes

### Community 156 - "Q: Find a graph node for the stale e2e assertion E2E-CONTENT-01 catalogue counts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Find a graph node for the stale e2e assertion E2E-CONTENT-01 catalogue counts, Source Nodes

### Community 157 - "Q: What is the compliant exact-topic selection rule for W7R-NPC-01/g and where is the idle default reply owned?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What is the compliant exact-topic selection rule for W7R-NPC-01/g and where is the idle default reply owned?, Source Nodes

### Community 158 - "Q: Where is W7R-NPC-01/g exact quiz handoff phrase preference among object matches implemented, and does it avoid fallthrough?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is W7R-NPC-01/g exact quiz handoff phrase preference among object matches implemented, and does it avoid fallthrough?, Source Nodes

### Community 159 - "Q: W7 runtime owners for topic resolution, once fallback, area progress and interaction shape"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: W7 runtime owners for topic resolution, once fallback, area progress and interaction shape

### Community 160 - "Q: How does W7R-NPC-01/g choose an exact declared object topic when several topics declare the same phrase?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: How does W7R-NPC-01/g choose an exact declared object topic when several topics declare the same phrase?

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `validateContent()` (5× useful, score=4.896099324)
- `TopicResolver` (4× useful, score=3.966926513)
- `ScoreTracker` (4× useful, score=3.948471541)
- `SaveControls` (4× useful, score=3.937901624)
- `TitleScreen` (4× useful, score=3.937901624)
- `ContentBundle` (4× useful, score=3.887065169)
- `AreaProgress` (3× useful, score=2.98029227)
- `GameViewData` (3× useful, score=2.958609761)
- `putHandler()` (3× useful, score=2.943087126) _(code changed — re-verify)_
- `GameEvent` (3× useful, score=2.941910212)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"
- "Canonical GameEvent union and Game façade" -> `GameEvent,4. Game façade and meta actions`
- "Find a graph node for the stale e2e assertion E2E-CONTENT-01 catalogue counts" -> `e2e_w7_opening_walkthrough_spec`

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `parser.ts` to `npcTopicOverlap.ts`, `vitest`, `mechanics.ts`, `persistence.ts`, `ui.ts`, `content.ts`, `zone1.ts`, `contentToolchain.ts`, `PuzzleSystem.test.ts`, `GameWindow.ts`, `turn.ts`, `PuzzleGraph.test.ts`, `npcTopicOverlap.ts`, `validateContent.ts`, `ConditionEvaluator.test.ts`, `area-progress.test.ts`, `LoadResult`, `ContentBundle.ts`, `package.json`, `devDependencies`, `npcs.ts`, `FakeRandom`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Should `npcTopicOverlap.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13842746400885936 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `main.ts`, `vitest`, `content/index.ts`, `mechanics.ts`, `persistence.ts`, `ui.ts`, `SaveManager.ts`, `normalisedCards`, `parser.ts`, `content.ts`, `zone1.ts`, `contentToolchain.ts`, `ScoreTracker`, `PuzzleSystem.test.ts`, `GameWindow.ts`, `turn.ts`, `Condition`, `validateContent.ts`, `adapt.ts`, `Command`, `commandResolution.ts`, `area-progress.test.ts`, `LoadResult`, `ContentBundle.ts`, `.makeActions`, `production-composition.spec.ts`, `HintSystem.ts`, `TopicSelection.ts`, `npcs.ts`, `ScoreTracker.ts`, `GameState.ts`, `Game.ts`, `TopicPhrase.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `w7-opening-walkthrough.spec.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13675213675213677 - nodes in this community are weakly interconnected._
- **Why does `asText()` connect `asText` to `common.ts`, `normalisedCards`, `topicOverlap.ts`, `collection`, `adapt.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._