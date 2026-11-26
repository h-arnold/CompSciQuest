# Graph Report - CompSciQuest-issue-11  (2026-11-26)

## Corpus Check
- 342 files · ~177,451 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 2509 nodes · 7135 edges · 170 communities (162 shown, 8 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 443 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `797a5d23`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- npcTopicOverlap.ts
- Issues
- authored.ts
- helpers.ts
- content/index.ts
- Random
- persistence.ts
- uiSetup.ts
- SaveManager.ts
- verbs/index.ts
- validate.ts
- FakeElement
- parser.ts
- content.ts
- zone1.ts
- contentToolchain.ts
- cli.ts
- topicOverlap.ts
- asText
- mechanics.ts
- compilerOptions
- GameWindow.ts
- ConversationFlow.ts
- collection
- RoomDefinition
- GameEvent
- PuzzleGraph.test.ts
- GameStateDto
- scenery-validation.test.ts
- validateContent.ts
- adapt.ts
- TurnContext
- Documentation style guide
- commandResolution.ts
- ContentBundle.ts
- ui.ts
- scripts
- Effect
- HANDOFF — CompSciQuest content + W6/W7 state
- Game
- opencode.json
- HintSystem.ts
- SaveActions
- PuzzleSystem.ts
- NpcTypes.test.ts
- Core
- TopicSelection.ts
- ContentBundle
- package.json
- devDependencies
- npcs.ts
- area-progress.test.ts
- authoredGame
- deploy.yml
- AuthoredRun
- eslint.config.js
- ActorState
- hint.ts
- Parser.ts
- Game.ts
- Content toolchain
- MemoryContentIo
- Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?
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
- Command
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- node-shims.d.ts
- Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?
- QuizRevision.test.ts
- ScoreTracker
- PuzzleSystem
- Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?
- Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?
- QuizFlow.test.ts
- 4. Design card format
- NpcGates.test.ts
- Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?
- Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- formatEvent
- Content authoring rules
- tsconfig.json
- content/schema.ts
- MemoryStorage
- Storage schema
- NameResolver.ts
- Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?
- Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?
- 6.3 Room entry, score and spec-topic mapping
- Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?
- Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?
- ValidationModule
- zod

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 110 edges
2. `GameEvent` - 92 edges
3. `vitest` - 90 edges
4. `GameState` - 75 edges
5. `asText()` - 62 edges
6. `finding()` - 58 edges
7. `Effect` - 51 edges
8. `Command` - 48 edges
9. `Random` - 47 edges
10. `FakeRandom` - 42 edges

## Surprising Connections (you probably didn't know these)
- `11. Flow` --references--> `Game`  [INFERRED]
  docs/developer/storage-schema.md → src/application/Game.ts
- `4. Failure consequences` --references--> `AreaDefinition`  [INFERRED]
  docs/developer/hazards.md → src/content/AreaDefinition.ts
- `1. Purpose` --references--> `ContentBundle`  [INFERRED]
  docs/developer/content-toolchain.md → src/content/ContentBundle.ts
- `6. Link to quiz combat` --references--> `NpcStateDto`  [INFERRED]
  docs/developer/npcs.md → src/core/NpcStateDto.ts
- `2. Model` --references--> `QuizStateDto`  [INFERRED]
  docs/developer/combat.md → src/core/QuizStateDto.ts

## Import Cycles
- None detected.

## Communities (170 total, 8 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.21
Nodes (9): createEventBus(), bootstrap(), browserDownload(), browserOpenSaveFile(), seededRandom(), startBrowserApp(), systemClock(), BrowserStorage (+1 more)

### Community 1 - "npcTopicOverlap.ts"
Cohesion: 0.11
Nodes (67): gNpc06(), gNpc07(), gNpc08(), gNpc09(), gNpc10(), gNpc11(), gNpc12(), gNpc13() (+59 more)

### Community 2 - "Issues"
Cohesion: 0.04
Nodes (43): Batch E1 — Onboarding and intuitive commands (planning-led), Batch E2 — Engine fixes and removals (single implementation batch), Batches, Definition of done, Engine issues — batched hand-off, Issues in scope, Out of scope — deferred to the content session, Refinements applied (+35 more)

### Community 3 - "authored.ts"
Cohesion: 0.17
Nodes (12): RoomSummary, authoredBundle, authoredState(), AuthoredStateOptions, messageTexts(), ProducerStateOptions, seededNpcs(), SWITCHYARD_AREA_ID (+4 more)

### Community 4 - "helpers.ts"
Cohesion: 0.06
Nodes (57): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+49 more)

### Community 5 - "content/index.ts"
Cohesion: 0.13
Nodes (15): area, START_POSITION, startRoom, ActorDefinition, actors, conversationTopics, hazards, nodes (+7 more)

### Community 6 - "Random"
Cohesion: 0.19
Nodes (15): EffectApplier, FiredThisTurn, HazardSystemDependencies, isInitialRoom(), isTriggerMatched(), HintSystemDependencies, NpcDependencies, PuzzleSystemDependencies (+7 more)

### Community 7 - "persistence.ts"
Cohesion: 0.10
Nodes (32): vitest, asRuntime(), envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, importModule(), loadEffectApplier() (+24 more)

### Community 8 - "uiSetup.ts"
Cohesion: 0.21
Nodes (18): makeEnvelope(), SAVE_KEY, allText(), Bootstrap, FakeBus, findButton(), installFakeDocument(), loadBootstrap() (+10 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.15
Nodes (30): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+22 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.09
Nodes (42): CommandHandler, describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible(), matchingInteraction() (+34 more)

### Community 11 - "validate.ts"
Cohesion: 0.21
Nodes (18): Finding, ParsedCardSet, stringList(), checkPuzzle(), clueFindings(), cycleFindings(), dependencyFindings(), puzzleFindings() (+10 more)

### Community 12 - "FakeElement"
Cohesion: 0.09
Nodes (9): absentElement(), FakeDocument, FakeElement, hasMatchingAncestors(), isTokenMatch(), makeFakeDocument(), press(), statusText() (+1 more)

### Community 13 - "parser.ts"
Cohesion: 0.09
Nodes (32): 5. Conversation nodes, ParsedCommand, loadDialogueSystemFactory(), loadTopicResolverFactory(), CHEST_ID, DOOR_ID, KEY_A, KEY_B (+24 more)

### Community 14 - "content.ts"
Cohesion: 0.14
Nodes (31): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+23 more)

### Community 15 - "zone1.ts"
Cohesion: 0.10
Nodes (33): acceptedCards(), generatedRoomIds(), zone1Cards(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES (+25 more)

### Community 16 - "contentToolchain.ts"
Cohesion: 0.11
Nodes (23): PER_AREA_PATHS, expectOneShapeFinding(), ParsedRoom, refusalFindings(), AREA_ID, CardFile, CardSet, expectSameMembers() (+15 more)

### Community 17 - "cli.ts"
Cohesion: 0.10
Nodes (27): 3. Scaffolds, CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards() (+19 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (34): asRecord(), ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf() (+26 more)

### Community 19 - "asText"
Cohesion: 0.21
Nodes (29): allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), EFFECT_KINDS, finding(), idsOf() (+21 more)

### Community 20 - "mechanics.ts"
Cohesion: 0.05
Nodes (93): 5. Quiz attempts, areaPairForRoom(), areaPairForTopic(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, applyBookkeepingEffect(), applyEffect() (+85 more)

### Community 21 - "compilerOptions"
Cohesion: 0.08
Nodes (26): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+18 more)

### Community 22 - "GameWindow.ts"
Cohesion: 0.11
Nodes (18): Persistence and UI, 6. Events and UI, 7. State, events and UI, AreaProgressView, ConversationView, GameViewData, HintView, QuizView (+10 more)

### Community 23 - "ConversationFlow.ts"
Cohesion: 0.20
Nodes (23): activeNode(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode(), fallBackAfterOnce() (+15 more)

### Community 24 - "collection"
Cohesion: 0.16
Nodes (29): asArray(), asObjectArray(), collection(), coverageIds(), DIRECTIONS, effectList(), entriesWith(), knownTopicIds() (+21 more)

### Community 25 - "RoomDefinition"
Cohesion: 0.21
Nodes (10): 3. Rule catalogue, C — Conversation and NPCs, D — Data and cards, H — Hazards and hints, N — Narrative, P — Pedagogy and course mapping, V — Validation, rooms (+2 more)

### Community 26 - "GameEvent"
Cohesion: 0.20
Nodes (6): 6.1 Event to view mapping, 6. Canonical event union and rendering, GameEvent, AuthoredGameFixture, RecordingBus, MemoryBus

### Community 27 - "PuzzleGraph.test.ts"
Cohesion: 0.14
Nodes (15): CardData, cleanParsedSet(), definition(), roomData(), npcCards(), topicsCard(), Finding, GeneratedFile (+7 more)

### Community 28 - "GameStateDto"
Cohesion: 0.16
Nodes (4): catalogueOf(), GameStateDto, switchyardProgress(), freshState()

### Community 29 - "scenery-validation.test.ts"
Cohesion: 0.11
Nodes (14): Data, cardsWithRefusalText(), cardText(), conformingCardSet(), GATE_NAMES, ValidateResult, withCard(), AUTHORING_CASES (+6 more)

### Community 30 - "validateContent.ts"
Cohesion: 0.06
Nodes (47): 7.1 Free-text topic-overlap proof, 7. Structural validation gates, aliasProblems(), aliasProblemsOf(), asRecord(), budgetProblems(), catalogueIds(), coverageProblems() (+39 more)

### Community 31 - "adapt.ts"
Cohesion: 0.13
Nodes (27): bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings(), text() (+19 more)

### Community 32 - "TurnContext"
Cohesion: 0.14
Nodes (18): 8. Behavioural signatures, 1. Scope, 2. Model, 3. Commands and delivery, 4. Adaptive behaviour, 5. Score interaction, Hints, 1. Scope (+10 more)

### Community 33 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 34 - "commandResolution.ts"
Cohesion: 0.19
Nodes (19): actorAndRemainder(), answerCommand(), conversationCommand(), DIRECTION_NAMES, fallbackPair(), isDirection(), noArgumentCommand(), PUT_PREPOSITIONS (+11 more)

### Community 35 - "ContentBundle.ts"
Cohesion: 0.15
Nodes (14): 3.1 Catalogue shape, hints, items, quizzes, Catalogue, ItemDefinition, Quiz, QuizQuestion (+6 more)

### Community 36 - "ui.ts"
Cohesion: 0.07
Nodes (22): QuarantineDto, LoadFailureReason, LoadResult, SaveDto, GameWindowDependencies, MESSAGES, descendants(), documentState (+14 more)

### Community 37 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 38 - "Effect"
Cohesion: 0.19
Nodes (13): 1. Purpose and authority, 7. Core contracts, 1. Scope, 1. Purpose, 3.2 Entity and system state, Effect, Hazard, HazardCatalogue (+5 more)

### Community 39 - "HANDOFF — CompSciQuest content + W6/W7 state"
Cohesion: 0.12
Nodes (15): 10. Commit / push note, 1. One-paragraph summary, 2. Read these first (in order), 3. What is accepted (content, do not re-litigate), 5. Ordered next steps, 6. Ownership boundaries (non-negotiable), 7. Deep state: the approved content in numbers, 8. Traps and gotchas (learned the hard way) (+7 more)

### Community 40 - "Game"
Cohesion: 0.10
Nodes (11): 4.1 Meta actions, 4. Game façade and meta actions, 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, Game, GameWindow, loadFailureMessage() (+3 more)

### Community 41 - "opencode.json"
Cohesion: 0.12
Nodes (16): command, type, default_agent, experimental, subagent_depth, command, type, mcp (+8 more)

### Community 42 - "HintSystem.ts"
Cohesion: 0.30
Nodes (13): HintLevel, applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext() (+5 more)

### Community 44 - "SaveActions"
Cohesion: 0.29
Nodes (3): 9. Quarantine, SaveActions, SaveControls

### Community 45 - "PuzzleSystem.ts"
Cohesion: 0.26
Nodes (9): FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient(), isPossessionOnly(), markFired(), reactionFor(), shouldSkip(), solveEffects() (+1 more)

### Community 46 - "NpcTypes.test.ts"
Cohesion: 0.11
Nodes (28): 4.3 NPC card, 4.1 Failure inventory, 4.2 The generated bundle is stale — verify this first, 4. Current verification state (measured 2026-11-26), createNameResolver(), actorKeywordTopic(), createTopicResolver(), hasKeyword() (+20 more)

### Community 47 - "Core"
Cohesion: 0.20
Nodes (11): Core, 3. Condition, PlayerView, Exit, Room, Precondition, World, Direction (+3 more)

### Community 48 - "TopicSelection.ts"
Cohesion: 0.21
Nodes (20): AskTellMatch, chooseCandidate(), exactDeclaredTopic(), findDefaultTopic(), GiveShowMatch, hasKeyword(), hasObjectMatch(), hasResolvedMatch() (+12 more)

### Community 49 - "ContentBundle"
Cohesion: 0.11
Nodes (35): 2. Boot, title screen and session start, 3.3 Loading and validation, 10. Out of scope, 1. Scope and goals, 2. Design principles, 3. Layers and dependency direction, 4. Source layout, 5. Module responsibilities (+27 more)

### Community 50 - "package.json"
Cohesion: 0.17
Nodes (11): description, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, yaml@^2.9.1, name, private, type, version (+3 more)

### Community 51 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint@^10.15.0, playwright@1.65.1, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, typescript-7@npm:typescript@^7.0.2, vite@^8.3.8, vitest@^5.1.1 (+5 more)

### Community 52 - "npcs.ts"
Cohesion: 0.06
Nodes (67): 2. Model, createFromDto(), GameState, RuntimeGameState, stateToDto(), HintStateDto, NpcStateDto, PuzzlePhase (+59 more)

### Community 53 - "area-progress.test.ts"
Cohesion: 0.17
Nodes (12): 7. Restore-time derivation, AreaDefinition, AreaProgress, SpecTopic, SpecTopicCatalogue, TopicIndexEntry, areaBundle(), room() (+4 more)

### Community 54 - "authoredGame"
Cohesion: 0.18
Nodes (13): authoredGame(), changedFlags(), FOREMAN_ID, producerState(), requirementFlags(), hintFixture(), submitCase(), EXPECTED_FLAGS (+5 more)

### Community 55 - "deploy.yml"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 56 - "AuthoredRun"
Cohesion: 0.20
Nodes (3): AuthoredRun, gateFlag(), lastQuestion()

### Community 57 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 58 - "ActorState"
Cohesion: 0.29
Nodes (6): 2. Model, 6. Link to quiz combat, NPCs and conversation, actorStates, ActorState, TopicEntry

### Community 59 - "hint.ts"
Cohesion: 0.23
Nodes (14): asNumber(), CardEntry, checkHint(), ladderFindings(), levelFindings(), penaltyFindings(), targetFindings(), UNLOCK_PREFIXES (+6 more)

### Community 60 - "Parser.ts"
Cohesion: 0.19
Nodes (10): DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, MultiwordAlias, parseRaw(), SINGLE_ALIASES, tokenize (+2 more)

### Community 61 - "Game.ts"
Cohesion: 0.14
Nodes (17): adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), recordSeed(), MetaAction, createQuizSystem(), QuizSystemDependencies (+9 more)

### Community 62 - "Content toolchain"
Cohesion: 0.33
Nodes (6): 1. Purpose, 2. Authoring format, 4. Validation, 6. Ownership, 7. Coverage-graph extraction, Content toolchain

### Community 64 - "Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?, Source Nodes

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

### Community 139 - "Command"
Cohesion: 0.12
Nodes (17): 5.1 Door and container verbs, 5.2 Verb table and handler signature, 5. Canonical command union and verbs, 1. Scope, 2. Model, 3. Flow, 4. Commands and events, 5. Hints (+9 more)

### Community 140 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Where is P-TAKE-01 takeHandler and what governs portable items?

### Community 141 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Find a document heading node named Room entry text

### Community 143 - "Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?, Source Nodes

### Community 144 - "QuizRevision.test.ts"
Cohesion: 0.21
Nodes (8): activeQuiz(), answerCorrectly(), quizDispatch(), quizState(), SeededRandom, SeededRandomPort, startEffect(), readSave()

### Community 146 - "ScoreTracker"
Cohesion: 0.11
Nodes (20): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Behavioural guarantees, 3.2 World, area, room and item definitions, 3. Content bundle and registration, 9. Effect to event mapping, Application and UI contracts, 11. Invariants the implementation must keep (+12 more)

### Community 147 - "PuzzleSystem"
Cohesion: 0.14
Nodes (13): 2. Model, 3. Execution, 4. Failure consequences, 5. Content, Hazards, 1. Scope, 3. Completion detection, 4. Puzzle Dependency Graph (+5 more)

### Community 148 - "Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?, Source Nodes

### Community 149 - "Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?, Source Nodes

### Community 150 - "QuizFlow.test.ts"
Cohesion: 0.20
Nodes (8): finishWithWrongAnswers(), questionFor(), wrongAnswer(), authoredNpc(), eventTypes(), gameplaySnapshot(), expectProducer(), ProducerCase

### Community 151 - "4. Design card format"
Cohesion: 0.29
Nodes (7): 4.1 Common conventions, 4.2 Area and rooms card, 4.4 Quiz card, 4.5 Puzzle card, 4.6 Hazard card, 4.7 Hint card, 4. Design card format

### Community 152 - "NpcGates.test.ts"
Cohesion: 0.19
Nodes (11): gateFindings(), actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData() (+3 more)

### Community 153 - "Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?, Source Nodes

### Community 154 - "Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?, Source Nodes

### Community 155 - "Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?, Source Nodes

### Community 156 - "formatEvent"
Cohesion: 0.32
Nodes (7): Batch E1 — onboarding and intuitive commands, Batch E2 — engine fixes and removals, Decisions settled with the user, formatEvent(), label(), topicLabel(), transcript()

### Community 157 - "Content authoring rules"
Cohesion: 0.18
Nodes (11): 1. Purpose and authority, 2. Workflow gates, 5. ID and alias registry, 6.1 Content critic, 6.2 PCK reviewer, 6. Reviewer rubrics, 9.1 Shared definition of done, 9.2 Shared hard constraints (+3 more)

### Community 159 - "content/schema.ts"
Cohesion: 0.19
Nodes (13): CardSet, ParseResult, AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape, KINDS (+5 more)

### Community 161 - "Storage schema"
Cohesion: 0.22
Nodes (9): 11. Flow, 12. Invariants the implementation must keep, 13. Out of scope, 1. Scope and authority, 6. Content dependencies, 8.1 Strictness, 8.2 Result type, 8. Validation contract (+1 more)

### Community 162 - "NameResolver.ts"
Cohesion: 0.29
Nodes (3): 3. Commands and topic resolution, 9. Content registration, NameResolver

### Community 163 - "Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?, Source Nodes

### Community 164 - "Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?, Source Nodes

### Community 165 - "6.3 Room entry, score and spec-topic mapping"
Cohesion: 0.25
Nodes (7): 6.1 Bootstrap (`src/main.ts`), 6.2 One command turn, 6.3 Room entry, score and spec-topic mapping, 6.4 Save, load, download and import, 6.5 Losing a life and winning, 6. Key flows, 2. Envelope, keys and file format

### Community 166 - "Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?, Source Nodes

### Community 167 - "Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?, Source Nodes

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `GameViewData` (6× useful, score=5.941677611)
- `ContentBundle` (5× useful, score=4.847871472)
- `EffectApplier` (4× useful, score=3.903525604)
- `validateContent()` (4× useful, score=3.865207384)
- `renderArea()` (3× useful, score=2.999129102) _(code changed — re-verify)_
- `renderTopic()` (3× useful, score=2.999129102) _(code changed — re-verify)_
- `ScorePanel` (3× useful, score=2.999129102) _(code changed — re-verify)_
- `TopicResolver` (3× useful, score=2.944422133)
- `ScoreTracker` (3× useful, score=2.926630591)
- `putHandler()` (3× useful, score=2.919118056)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `persistence.ts` to `npcTopicOverlap.ts`, `authored.ts`, `uiSetup.ts`, `parser.ts`, `content.ts`, `zone1.ts`, `QuizRevision.test.ts`, `contentToolchain.ts`, `mechanics.ts`, `QuizFlow.test.ts`, `NpcGates.test.ts`, `PuzzleGraph.test.ts`, `GameStateDto`, `scenery-validation.test.ts`, `validateContent.ts`, `ui.ts`, `NpcTypes.test.ts`, `ContentBundle`, `package.json`, `devDependencies`, `npcs.ts`, `area-progress.test.ts`, `authoredGame`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Should `npcTopicOverlap.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10758998435054773 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `main.ts`, `authored.ts`, `content/index.ts`, `Random`, `persistence.ts`, `uiSetup.ts`, `SaveManager.ts`, `Command`, `parser.ts`, `content.ts`, `zone1.ts`, `ScoreTracker`, `mechanics.ts`, `GameWindow.ts`, `QuizFlow.test.ts`, `RoomDefinition`, `formatEvent`, `GameStateDto`, `validateContent.ts`, `scenery-validation.test.ts`, `TurnContext`, `adapt.ts`, `NameResolver.ts`, `commandResolution.ts`, `ContentBundle.ts`, `6.3 Room entry, score and spec-topic mapping`, `Effect`, `ui.ts`, `Game`, `HintSystem.ts`, `PuzzleSystem.ts`, `NpcTypes.test.ts`, `TopicSelection.ts`, `npcs.ts`, `area-progress.test.ts`, `ActorState`, `Game.ts`, `Content toolchain`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `Issues` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `GameEvent` to `main.ts`, `authored.ts`, `Random`, `persistence.ts`, `uiSetup.ts`, `parser.ts`, `QuizRevision.test.ts`, `ScoreTracker`, `PuzzleSystem`, `mechanics.ts`, `GameWindow.ts`, `ConversationFlow.ts`, `QuizFlow.test.ts`, `formatEvent`, `GameStateDto`, `TurnContext`, `ui.ts`, `Effect`, `Game`, `HintSystem.ts`, `PuzzleSystem.ts`, `NpcTypes.test.ts`, `Core`, `ContentBundle`, `npcs.ts`, `area-progress.test.ts`, `authoredGame`, `AuthoredRun`, `Game.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._