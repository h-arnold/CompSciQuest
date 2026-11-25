# Graph Report - CompSciQuest  (2026-11-25)

## Corpus Check
- 318 files · ~153,220 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .jsonc 1, .css 1)

## Summary
- 2277 nodes · 6760 edges · 146 communities (139 shown, 7 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 470 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9e4566e7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Game.ts
- npcTopicOverlap.ts
- npcs.ts
- vitest
- helpers.ts
- ContentBundle.ts
- mechanics.ts
- persistence.ts
- ui.ts
- SaveManager.ts
- verbs/index.ts
- common.ts
- GameState.ts
- turn.ts
- content.ts
- zone1.ts
- contentToolchain.ts
- cli.ts
- topicOverlap.ts
- finding
- application-and-ui.md
- compilerOptions
- HintQuizViews.test.ts
- ConversationFlow.ts
- asText
- Content authoring rules (design)
- ContentBundle
- PuzzleGraph.test.ts
- scenery-validation.test.ts
- Effect
- commandResolution.ts
- generate.ts
- isActive
- Documentation style guide
- domain.ts
- Game
- GameViewData
- scripts
- NpcTypes.test.ts
- FakeElement
- Storage schema (design)
- opencode.json
- Parser.ts
- asRecord
- GameWindow
- HintSystem.ts
- NpcGates.test.ts
- GameWindow.ts
- TopicSelection.ts
- EffectApplier
- package.json
- devDependencies
- adapt.ts
- ScoreTracker.ts
- SaveControls
- LoadResult
- Hints (design)
- eslint.config.js
- Puzzles (design)
- AuthoredRun
- GameViewData.ts
- TopicResolver.ts
- reactionFor
- MemoryContentIo
- SeededRandom
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
- formatEvent.ts
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- node-shims.d.ts
- ValidationModule
- vite@^8.3.8

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 108 edges
2. `GameEvent` - 92 edges
3. `vitest` - 85 edges
4. `GameState` - 73 edges
5. `asText()` - 62 edges
6. `finding()` - 58 edges
7. `Command` - 51 edges
8. `Effect` - 51 edges
9. `Random` - 48 edges
10. `collection()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `11. Flow` --references--> `Game`  [INFERRED]
  docs/developer/storage-schema.md → src/application/Game.ts
- `D — Data and cards` --references--> `RoomDefinition`  [INFERRED]
  docs/developer/content-rules.md → src/content/RoomDefinition.ts
- `6. Link to quiz combat` --references--> `NpcStateDto`  [INFERRED]
  docs/developer/npcs.md → src/core/NpcStateDto.ts
- `2. Model` --references--> `QuizStateDto`  [INFERRED]
  docs/developer/combat.md → src/core/QuizStateDto.ts
- `5. Quiz attempts` --references--> `QuizStateDto`  [INFERRED]
  docs/developer/storage-schema.md → src/core/QuizStateDto.ts

## Import Cycles
- None detected.

## Communities (146 total, 7 thin omitted)

### Community 0 - "Game.ts"
Cohesion: 0.04
Nodes (91): 4.1 Meta actions, 4. Game façade and meta actions, 5.1 Door and container verbs, 5.2 Verb table and handler signature, 5. Canonical command union and verbs, 6.1 Event to view mapping, 6. Canonical event union and rendering, 9. Effect to event mapping (+83 more)

### Community 1 - "npcTopicOverlap.ts"
Cohesion: 0.07
Nodes (88): aliasProblems(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS, Identified, ownerProblems() (+80 more)

### Community 2 - "npcs.ts"
Cohesion: 0.08
Nodes (57): createFromDto(), stateToDto(), ACTOR_ALIAS, ACTOR_ID, actorState(), always, askRing, byeCommand (+49 more)

### Community 3 - "vitest"
Cohesion: 0.07
Nodes (45): 7. Core interface sketches, vitest, SaveDto, RoomSummary, GameStateDto, finishWithWrongAnswers(), questionFor(), wrongAnswer() (+37 more)

### Community 4 - "helpers.ts"
Cohesion: 0.06
Nodes (52): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+44 more)

### Community 5 - "ContentBundle.ts"
Cohesion: 0.07
Nodes (40): 3.1 Catalogue shape, 3.2 World, area, room and item definitions, 3.3 Loading and validation, 3.4 Stub fixture, 3. Content bundle and registration, area, START_POSITION, startRoom (+32 more)

### Community 6 - "mechanics.ts"
Cohesion: 0.10
Nodes (49): createEffectApplier(), puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, DOOR_FLAG (+41 more)

### Community 7 - "persistence.ts"
Cohesion: 0.08
Nodes (31): AuthoredGameFixture, asRuntime(), envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, loadEffectApplier(), loadInitialState() (+23 more)

### Community 8 - "ui.ts"
Cohesion: 0.09
Nodes (36): makeEnvelope(), QUARANTINE_KEY, SAVE_KEY, absentElement(), allText(), Bootstrap, BootstrapDependencies, descendants() (+28 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.09
Nodes (41): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+33 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.08
Nodes (42): CommandHandler, describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible(), matchingInteraction() (+34 more)

### Community 11 - "common.ts"
Cohesion: 0.11
Nodes (40): CardSet, Finding, ParsedCardSet, ValidateResult, ValidationOptions, asArray(), asNumber(), asObjectArray() (+32 more)

### Community 12 - "GameState.ts"
Cohesion: 0.08
Nodes (33): 3. Flow, 2. Model, 2. Model, 8. State additions — schema stays v1, 2. Envelope, keys and file format, AreaProgress, applyBookkeepingEffect(), applyEffect() (+25 more)

### Community 13 - "turn.ts"
Cohesion: 0.10
Nodes (30): CHEST_ID, DOOR_ID, KEY_A, KEY_B, loadNameResolver(), loadParser(), loadTokenizer(), loadVerbTable() (+22 more)

### Community 14 - "content.ts"
Cohesion: 0.14
Nodes (32): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+24 more)

### Community 15 - "zone1.ts"
Cohesion: 0.10
Nodes (27): generatedRoomIds(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES, GENERATED_PATHS (+19 more)

### Community 16 - "contentToolchain.ts"
Cohesion: 0.09
Nodes (23): Data, PER_AREA_PATHS, AREA_ID, CardFile, expectSameMembers(), Finding, GATE_NAMES, GeneratorModule (+15 more)

### Community 17 - "cli.ts"
Cohesion: 0.09
Nodes (26): 3. Scaffolds, CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards() (+18 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (33): ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf(), DataRecord (+25 more)

### Community 19 - "finding"
Cohesion: 0.19
Nodes (29): collection(), coverageIds(), finding(), knownTopicIds(), stringList(), aliasFindings(), badPrefix(), checkContentIds() (+21 more)

### Community 20 - "application-and-ui.md"
Cohesion: 0.16
Nodes (17): 1. Scope, 2. Model, 5. Randomness and determinism, 6. Hints, 7. Tests, 8. Decisions resolved, Quiz combat (design), 1. Scope (+9 more)

### Community 21 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+20 more)

### Community 22 - "HintQuizViews.test.ts"
Cohesion: 0.12
Nodes (9): Persistence and UI, 7. State, events and UI, appendLine(), ConversationPanel, HintPanel, OutputLog, QuizPanel, renderArea() (+1 more)

### Community 23 - "ConversationFlow.ts"
Cohesion: 0.20
Nodes (24): activeNode(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode(), fallBackAfterOnce() (+16 more)

### Community 24 - "asText"
Cohesion: 0.20
Nodes (25): gateOf(), sharedFindings(), allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), idsOf() (+17 more)

### Community 25 - "Content authoring rules (design)"
Cohesion: 0.08
Nodes (26): 1. Purpose and authority, 2. Workflow gates, 3. Rule catalogue, 4.1 Common conventions, 4.2 Area and rooms card, 4.4 Quiz card, 4.5 Puzzle card, 4.6 Hazard card (+18 more)

### Community 26 - "ContentBundle"
Cohesion: 0.13
Nodes (19): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Tests for the skeleton, 13. Decisions, 8. Behavioural signatures, Application and UI contracts (design), 1. Purpose, 2. Authoring format (+11 more)

### Community 27 - "PuzzleGraph.test.ts"
Cohesion: 0.17
Nodes (12): CardData, cleanParsedSet(), definition(), roomData(), npcCards(), topicsCard(), GeneratedFile, generatedFile() (+4 more)

### Community 28 - "scenery-validation.test.ts"
Cohesion: 0.14
Nodes (16): cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), CardSet, cardText(), conformingCardSet(), ParseResult (+8 more)

### Community 29 - "Effect"
Cohesion: 0.19
Nodes (9): 1. Purpose and authority, Effect, Hazard, FiredThisTurn, isInitialRoom(), isTriggerMatched(), Trigger, ScheduledEvent (+1 more)

### Community 30 - "commandResolution.ts"
Cohesion: 0.19
Nodes (19): actorAndRemainder(), answerCommand(), conversationCommand(), DIRECTION_NAMES, fallbackPair(), isDirection(), noArgumentCommand(), PUT_PREPOSITIONS (+11 more)

### Community 31 - "generate.ts"
Cohesion: 0.18
Nodes (18): GeneratedFile, GenerationResult, ParsedCard, CatalogueEmit, cleanEntry(), emitCatalogue(), indentJson(), stripAuthoring() (+10 more)

### Community 32 - "isActive"
Cohesion: 0.13
Nodes (17): 6. Workflow changes, 1. Scope, 2. Model, 3. Commands and topic resolution, 4. Conversation flow, 5. Conversation nodes, 6. Link to quiz combat, 8. Tests (+9 more)

### Community 33 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 34 - "domain.ts"
Cohesion: 0.22
Nodes (10): 3. Condition, PlayerView, ExitDefinition, Exit, Room, Precondition, World, Direction (+2 more)

### Community 35 - "Game"
Cohesion: 0.17
Nodes (6): 6.1 Bootstrap (`src/main.ts`), 6.2 One command turn, 6.3 Room entry, score and spec-topic mapping, 6. Key flows, Game, ScorePanel

### Community 36 - "GameViewData"
Cohesion: 0.13
Nodes (7): 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, GameViewData, RecordingGame, RecordingGameOptions, BootSetupOptions

### Community 37 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 38 - "NpcTypes.test.ts"
Cohesion: 0.28
Nodes (9): 4.3 NPC card, 7. Structural validation gates, HintLevel, ConversationTopic, ResponseStrategy, TopicMatch, SelectedTopic, NpcStateDto (+1 more)

### Community 39 - "FakeElement"
Cohesion: 0.13
Nodes (3): FakeElement, press(), press()

### Community 40 - "Storage schema (design)"
Cohesion: 0.13
Nodes (15): 11. Flow, 12. Tests, 13. Out of scope, 1. Scope and authority, 3.1 Top-level DTO, 3.2 Entity and system state, 3.3 Invariants, 3. Persisted shape (canonical) (+7 more)

### Community 41 - "opencode.json"
Cohesion: 0.13
Nodes (14): command, type, default_agent, command, type, mcp, servers, permissions (+6 more)

### Community 42 - "Parser.ts"
Cohesion: 0.17
Nodes (10): ParsedCommand, DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, MultiwordAlias, parseRaw(), SINGLE_ALIASES (+2 more)

### Community 43 - "asRecord"
Cohesion: 0.27
Nodes (14): ParseResult, asRecord(), AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape, KINDS (+6 more)

### Community 44 - "GameWindow"
Cohesion: 0.24
Nodes (4): 2. Boot, title screen and session start, 5. Generation, GameWindow, TitleScreen

### Community 45 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 46 - "NpcGates.test.ts"
Cohesion: 0.19
Nodes (11): gateFindings(), actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData() (+3 more)

### Community 47 - "GameWindow.ts"
Cohesion: 0.29
Nodes (5): QuarantineDto, LoadFailureReason, loadFailureMessage(), MESSAGES, Terminal

### Community 48 - "TopicSelection.ts"
Cohesion: 0.29
Nodes (12): AskTellMatch, chooseCandidate(), GiveShowMatch, hasKeyword(), hasObjectMatch(), hasResolvedMatch(), isAskTellMatch(), isDefaultTopic() (+4 more)

### Community 49 - "EffectApplier"
Cohesion: 0.29
Nodes (11): 12. Tests, EffectApplier, HazardSystemDependencies, HintSystemDependencies, NpcDependencies, PuzzleSystemDependencies, ConditionEvaluator, RuleEngineDependencies (+3 more)

### Community 50 - "package.json"
Cohesion: 0.17
Nodes (11): description, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, zod@^4.6.7, name, private, type, version (+3 more)

### Community 51 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@^10.15.0, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, typescript-7@npm:typescript@^7.0.2, vitest@^5.1.1, yaml@^2.9.1, eslint (+4 more)

### Community 52 - "adapt.ts"
Cohesion: 0.29
Nodes (9): Catalogue, catalogueOf(), bundleOf(), isTrue(), number(), numbers(), strings(), text() (+1 more)

### Community 53 - "ScoreTracker.ts"
Cohesion: 0.33
Nodes (11): Announce, award(), createScoreTracker(), hasScoreFor(), hasTopicCompletion(), processEvent(), progressEntry(), puzzleSolved() (+3 more)

### Community 55 - "LoadResult"
Cohesion: 0.24
Nodes (4): 6.4 Save, load, download and import, LoadResult, GameWindowDependencies, FakeSaveManager

### Community 56 - "Hints (design)"
Cohesion: 0.20
Nodes (10): 1. Scope, 2. Model, 3. Commands and delivery, 4. Adaptive behaviour, 5. Score interaction, 6. Tests, 7. Decisions resolved, Hints (design) (+2 more)

### Community 57 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 58 - "Puzzles (design)"
Cohesion: 0.22
Nodes (10): 1. Scope, 3. Completion detection, 4. Puzzle Dependency Graph, 5. Hints, 6. Integration points, 7. Tests, 8. Decisions resolved, Puzzles (design) (+2 more)

### Community 59 - "AuthoredRun"
Cohesion: 0.33
Nodes (3): AuthoredRun, gateFlag(), lastQuestion()

### Community 60 - "GameViewData.ts"
Cohesion: 0.32
Nodes (6): AreaProgressView, ConversationView, HintView, QuizView, SpecTopicView, SpecStatus

### Community 61 - "TopicResolver.ts"
Cohesion: 0.32
Nodes (4): createNameResolver(), createTopicResolver(), ResolvedTopic, TopicResolverContract

### Community 62 - "reactionFor"
Cohesion: 0.25
Nodes (7): hasAlreadyFired(), isPossessionInsufficient(), isPossessionOnly(), markFired(), reactionFor(), shouldSkip(), solveEffects()

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

### Community 139 - "formatEvent.ts"
Cohesion: 0.60
Nodes (4): formatEvent(), label(), topicLabel(), transcript()

### Community 140 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Where is P-TAKE-01 takeHandler and what governs portable items?

### Community 141 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Find a document heading node named Room entry text

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `npcTopicOverlap.ts`, `npcs.ts`, `mechanics.ts`, `persistence.ts`, `ui.ts`, `NpcTypes.test.ts`, `GameState.ts`, `turn.ts`, `content.ts`, `zone1.ts`, `contentToolchain.ts`, `NpcGates.test.ts`, `package.json`, `devDependencies`, `GameWindow.ts`, `HintQuizViews.test.ts`, `PuzzleGraph.test.ts`, `scenery-validation.test.ts`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `13. Decisions`) actually correct?**
  _`ContentBundle` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Should `Game.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03597122302158273 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `Game.ts`, `npcTopicOverlap.ts`, `npcs.ts`, `vitest`, `ContentBundle.ts`, `mechanics.ts`, `persistence.ts`, `ui.ts`, `SaveManager.ts`, `verbs/index.ts`, `formatEvent.ts`, `GameState.ts`, `turn.ts`, `content.ts`, `zone1.ts`, `Content authoring rules (design)`, `scenery-validation.test.ts`, `Effect`, `commandResolution.ts`, `Game`, `GameViewData`, `NpcTypes.test.ts`, `GameWindow`, `HintSystem.ts`, `GameWindow.ts`, `EffectApplier`, `adapt.ts`, `ScoreTracker.ts`, `LoadResult`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Should `npcTopicOverlap.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06774668630338733 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `Game.ts` to `npcs.ts`, `Game`, `vitest`, `GameViewData`, `mechanics.ts`, `persistence.ts`, `ui.ts`, `formatEvent.ts`, `GameState.ts`, `HintSystem.ts`, `GameWindow`, `GameWindow.ts`, `turn.ts`, `ScoreTracker.ts`, `HintQuizViews.test.ts`, `ConversationFlow.ts`, `AuthoredRun`, `Effect`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._