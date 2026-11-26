# Graph Report - CompSciQuest-issue-13  (2026-11-26)

## Corpus Check
- 347 files · ~179,823 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 2539 nodes · 7219 edges · 160 communities (156 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 448 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `170a559b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- StorageAdapter
- EffectApplier.ts
- Issues
- content.ts
- helpers.ts
- content/index.ts
- ContentBundle
- persistence.ts
- NpcTypes.test.ts
- SaveManager.ts
- verbs/index.ts
- collection
- GameViewData.ts
- parser.ts
- zone1.ts
- npcTopicOverlap.ts
- contentToolchain.ts
- asRecord
- topicOverlap.ts
- asText
- vitest
- compilerOptions
- GameViewData
- ConversationFlow.ts
- LoadResult
- engine-issue-5-score.spec.ts
- ui.ts
- NpcGates.test.ts
- authoredGame
- production-composition.spec.ts
- Game
- adapt.ts
- TurnContext
- Documentation style guide
- commandResolution.ts
- ContentBundle.ts
- w7-opening-walkthrough.spec.ts
- scripts
- scenery-validation.test.ts
- HintSystem.ts
- Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?
- opencode.json
- GameEvent
- Command.ts
- main.ts
- validate.ts
- AuthoredRun
- GameWindow.ts
- SaveActions
- PuzzleSystem.ts
- package.json
- devDependencies
- npcs.ts
- Parser.ts
- 6.3 Room entry, score and spec-topic mapping
- deploy.yml
- TopicPhrase.ts
- eslint.config.js
- normalisedCards
- authored.ts
- MemoryContentIo
- Game.ts
- w7-accessibility.spec.ts
- Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?
- Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?
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
- Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- node-shims.d.ts
- Q: Does the W7 trace step's entry title precede the hazard message?
- QuizRevision.test.ts
- GameState
- HintFlow.test.ts
- Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?
- Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel
- Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?
- 4. Design card format
- Q: graphify section '6.1' — which document owns the event to view mapping?
- Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?
- Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- formatEvent
- SpecTopic
- vite@^8.3.8
- GameState.ts

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 111 edges
2. `GameEvent` - 95 edges
3. `vitest` - 91 edges
4. `GameState` - 76 edges
5. `asText()` - 62 edges
6. `finding()` - 58 edges
7. `Effect` - 52 edges
8. `Command` - 49 edges
9. `Random` - 47 edges
10. `FakeRandom` - 42 edges

## Surprising Connections (you probably didn't know these)
- `11. Flow` --references--> `Game`  [INFERRED]
  docs/developer/storage-schema.md → src/application/Game.ts
- `6.1 Event to view mapping` --references--> `GameViewData`  [INFERRED]
  docs/developer/application-and-ui.md → src/application/GameViewData.ts
- `4. Failure consequences` --references--> `AreaDefinition`  [INFERRED]
  docs/developer/hazards.md → src/content/AreaDefinition.ts
- `1. Purpose` --references--> `ContentBundle`  [INFERRED]
  docs/developer/content-toolchain.md → src/content/ContentBundle.ts
- `5. Malformed interaction containers` --references--> `interactionProblems()`  [INFERRED]
  W7-HANDOFF.md → src/content/validateContent.ts

## Import Cycles
- None detected.

## Communities (160 total, 4 thin omitted)

### Community 0 - "StorageAdapter"
Cohesion: 0.16
Nodes (21): 2. Boot, title screen and session start, 10. Out of scope, 1. Scope and goals, 3. Layers and dependency direction, 4. Source layout, 5. Module responsibilities, 7. Core contracts, 8. Conventions (+13 more)

### Community 1 - "EffectApplier.ts"
Cohesion: 0.10
Nodes (38): areaPairForRoom(), areaPairForTopic(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, applyBookkeepingEffect(), applyEffect(), applyEntityEffect() (+30 more)

### Community 2 - "Issues"
Cohesion: 0.04
Nodes (43): Batch E1 — Onboarding and intuitive commands (planning-led), Batch E2 — Engine fixes and removals (single implementation batch), Batches, Definition of done, Engine issues — batched hand-off, Issues in scope, Out of scope — deferred to the content session, Refinements applied (+35 more)

### Community 3 - "content.ts"
Cohesion: 0.12
Nodes (33): acceptedCards(), CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS (+25 more)

### Community 4 - "helpers.ts"
Cohesion: 0.09
Nodes (24): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+16 more)

### Community 5 - "content/index.ts"
Cohesion: 0.10
Nodes (20): area, START_POSITION, startRoom, AreaDefinition, actorStates, actors, areas, conversationTopics (+12 more)

### Community 6 - "ContentBundle"
Cohesion: 0.13
Nodes (26): 5.2 Verb table and handler signature, 6.1 Bootstrap (`src/main.ts`), 3. Flow, Catalogue, ContentBundle, EffectApplier, EffectApplierDependencies, FiredThisTurn (+18 more)

### Community 7 - "persistence.ts"
Cohesion: 0.09
Nodes (38): makeParserBundle(), makeParserStateDto(), makePutFixture(), asRuntime(), catalogueOf(), EffectApplierDependencies, envelopeText(), FIXED_ISO (+30 more)

### Community 8 - "NpcTypes.test.ts"
Cohesion: 0.12
Nodes (15): 2. Model, actorKeywordTopic(), createTopicResolver(), hasKeyword(), isBoundToActor(), TopicResolver, ResolvedTopic, NpcStateDto (+7 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.15
Nodes (30): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+22 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.06
Nodes (56): CommandHandler, describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible(), matchingInteraction() (+48 more)

### Community 11 - "collection"
Cohesion: 0.17
Nodes (27): asArray(), asObjectArray(), collection(), coverageIds(), DIRECTIONS, effectList(), entriesWith(), knownTopicIds() (+19 more)

### Community 12 - "GameViewData.ts"
Cohesion: 0.27
Nodes (8): AreaProgressView, ConversationView, HintView, QuizView, SpecTopicView, SpecStatus, renderArea(), renderTopic()

### Community 13 - "parser.ts"
Cohesion: 0.07
Nodes (39): 1. Scope, 3. Commands and topic resolution, 4. Conversation flow, 5. Conversation nodes, 6. Link to quiz combat, NPCs and conversation, ParsedCommand, getCommandHandler (+31 more)

### Community 14 - "zone1.ts"
Cohesion: 0.11
Nodes (28): generatedRoomIds(), zone1Cards(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES (+20 more)

### Community 15 - "npcTopicOverlap.ts"
Cohesion: 0.06
Nodes (96): aliasProblems(), aliasProblemsOf(), asRecord(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS (+88 more)

### Community 16 - "contentToolchain.ts"
Cohesion: 0.08
Nodes (24): Data, PER_AREA_PATHS, AREA_ID, CardFile, expectSameMembers(), GATE_NAMES, GeneratorModule, HAZARDS_PATH (+16 more)

### Community 17 - "asRecord"
Cohesion: 0.07
Nodes (42): 3. Scaffolds, CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards() (+34 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (33): ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf(), DataRecord (+25 more)

### Community 19 - "asText"
Cohesion: 0.21
Nodes (29): allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), EFFECT_KINDS, finding(), idsOf() (+21 more)

### Community 20 - "vitest"
Cohesion: 0.10
Nodes (51): vitest, createEffectApplier(), puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory (+43 more)

### Community 21 - "compilerOptions"
Cohesion: 0.06
Nodes (41): 11. Flow, 12. Invariants the implementation must keep, 13. Out of scope, 1. Scope and authority, 3.1 Top-level DTO, 3.3 Invariants, 3. Persisted shape (canonical), 4. Counters and stuckness (+33 more)

### Community 22 - "GameViewData"
Cohesion: 0.17
Nodes (8): Persistence and UI, 7. State, events and UI, GameViewData, appendLine(), ConversationPanel, HintPanel, OutputLog, QuizPanel

### Community 23 - "ConversationFlow.ts"
Cohesion: 0.06
Nodes (68): 10. Commit / push note, 1. One-paragraph summary, 2. Read these first (in order), 3. What is accepted (content, do not re-litigate), 4.1 Failure inventory, 4.2 The generated bundle is stale — verify this first, 4. Current verification state (measured 2026-11-26), 5. Ordered next steps (+60 more)

### Community 24 - "LoadResult"
Cohesion: 0.11
Nodes (6): LoadResult, SaveDto, RecordingGame, RecordingGameOptions, BootSetupOptions, FakeSaveManager

### Community 25 - "engine-issue-5-score.spec.ts"
Cohesion: 0.29
Nodes (3): ROOM_TITLES, scorePanel(), rooms

### Community 26 - "ui.ts"
Cohesion: 0.06
Nodes (35): absentElement(), allText(), Bootstrap, BootstrapDependencies, descendants(), documentState, FakeDocument, FakeElement (+27 more)

### Community 27 - "NpcGates.test.ts"
Cohesion: 0.09
Nodes (25): gateFindings(), CardData, cleanParsedSet(), definition(), roomData(), actor(), Data, EmittedNode (+17 more)

### Community 28 - "authoredGame"
Cohesion: 0.18
Nodes (14): authoredGame(), changedFlags(), eventTypes(), FOREMAN_ID, producerState(), expectProducer(), ProducerCase, submitCase() (+6 more)

### Community 29 - "production-composition.spec.ts"
Cohesion: 0.14
Nodes (15): command(), INTERNAL_LINE_PATTERNS, seedStorage(), submit(), transcript(), watchConsole(), repeatableHazard, HazardStep (+7 more)

### Community 30 - "Game"
Cohesion: 0.16
Nodes (5): Game, GameWindow, loadFailureMessage(), ScorePanel, AuthoredGameFixture

### Community 31 - "adapt.ts"
Cohesion: 0.12
Nodes (28): bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings(), text() (+20 more)

### Community 32 - "TurnContext"
Cohesion: 0.12
Nodes (23): 8. Behavioural signatures, 3. Execution, 1. Scope, 2. Model, 3. Commands and delivery, 4. Adaptive behaviour, 5. Score interaction, Hints (+15 more)

### Community 33 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 34 - "commandResolution.ts"
Cohesion: 0.18
Nodes (20): actorAndRemainder(), answerCommand(), conversationCommand(), DIRECTION_NAMES, fallbackPair(), isDirection(), noArgumentCommand(), PUT_PREPOSITIONS (+12 more)

### Community 35 - "ContentBundle.ts"
Cohesion: 0.08
Nodes (41): 1. Purpose and authority, 3.1 Catalogue shape, 3. Rule catalogue, 4.3 NPC card, C — Conversation and NPCs, D — Data and cards, H — Hazards and hints, N — Narrative (+33 more)

### Community 36 - "w7-opening-walkthrough.spec.ts"
Cohesion: 0.18
Nodes (20): expectHazardOutcome(), hazardAnnouncement(), enter(), expectEntry(), expectFlags(), expectOwners(), expectPosition(), expectPuzzle() (+12 more)

### Community 37 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 38 - "scenery-validation.test.ts"
Cohesion: 0.13
Nodes (17): cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), CardSet, cardText(), conformingCardSet(), ParseResult (+9 more)

### Community 39 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 40 - "Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?, Source Nodes

### Community 41 - "opencode.json"
Cohesion: 0.12
Nodes (16): command, type, default_agent, experimental, subagent_depth, command, type, mcp (+8 more)

### Community 42 - "GameEvent"
Cohesion: 0.06
Nodes (20): GameEvent, SchedulerContract, EffectApplierLike, loadEffectApplier(), loadSession(), RecordingBus, loadFormatEvent(), MemoryBus (+12 more)

### Community 43 - "Command.ts"
Cohesion: 0.18
Nodes (10): 11. Invariants the implementation must keep, 3. Condition, Exit, Room, Precondition, World, Direction, GameObject (+2 more)

### Community 44 - "main.ts"
Cohesion: 0.15
Nodes (13): 3.2 World, area, room and item definitions, 3.3 Loading and validation, 3. Content bundle and registration, loadContent(), createEventBus(), bootstrap(), browserDownload(), browserOpenSaveFile() (+5 more)

### Community 45 - "validate.ts"
Cohesion: 0.13
Nodes (31): Finding, ParsedCardSet, asNumber(), CardEntry, stringList(), checkHint(), ladderFindings(), levelFindings() (+23 more)

### Community 46 - "AuthoredRun"
Cohesion: 0.20
Nodes (3): AuthoredRun, gateFlag(), lastQuestion()

### Community 47 - "GameWindow.ts"
Cohesion: 0.24
Nodes (7): 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, QuarantineDto, LoadFailureReason, MESSAGES, Terminal

### Community 48 - "SaveActions"
Cohesion: 0.29
Nodes (3): 9. Quarantine, SaveActions, SaveControls

### Community 49 - "PuzzleSystem.ts"
Cohesion: 0.26
Nodes (9): FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient(), isPossessionOnly(), markFired(), reactionFor(), shouldSkip(), solveEffects() (+1 more)

### Community 50 - "package.json"
Cohesion: 0.17
Nodes (11): description, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, zod@^4.6.7, name, private, type, version (+3 more)

### Community 51 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@^10.15.0, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, typescript-7@npm:typescript@^7.0.2, vitest@^5.1.1, yaml@^2.9.1, eslint (+4 more)

### Community 52 - "npcs.ts"
Cohesion: 0.08
Nodes (56): ACTOR_ALIAS, ACTOR_ID, actorState(), always, askRing, byeCommand, ConditionEvaluatorCondition, CountingRandom (+48 more)

### Community 53 - "Parser.ts"
Cohesion: 0.27
Nodes (7): DIRECTION_NAMES, DIRECTION_SHORTCUTS, isDirection(), MULTIWORD_ALIASES, parseRaw(), SINGLE_ALIASES, tokenize

### Community 54 - "6.3 Room entry, score and spec-topic mapping"
Cohesion: 0.25
Nodes (7): 6.2 One command turn, 6.3 Room entry, score and spec-topic mapping, 6.4 Save, load, download and import, 6.5 Losing a life and winning, 6. Key flows, 2. Envelope, keys and file format, RuntimeGameState

### Community 55 - "deploy.yml"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 56 - "TopicPhrase.ts"
Cohesion: 0.39
Nodes (8): AskTellMatch, collectMatches(), DeclaredObjectPhrase, findDeclaredObjectPhrase(), isAskTellMatch(), isBoundToActor(), isObjectName(), normalise()

### Community 57 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 58 - "normalisedCards"
Cohesion: 0.29
Nodes (8): 1. Purpose, 4. Validation, 5. Generation, 6. Ownership, 7. Coverage-graph extraction, Content toolchain, normalisedCards(), normaliseExit()

### Community 59 - "authored.ts"
Cohesion: 0.13
Nodes (17): RoomSummary, authoredBundle, authoredState(), AuthoredStateOptions, messageTexts(), ProducerStateOptions, requirementFlags(), seededNpcs() (+9 more)

### Community 61 - "Game.ts"
Cohesion: 0.13
Nodes (19): Parallel execution, ComposedReaction, adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), quizView(), recordSeed() (+11 more)

### Community 62 - "w7-accessibility.spec.ts"
Cohesion: 0.47
Nodes (4): contrastRatio(), CONTROL_ORDER, luminance(), parseColour()

### Community 63 - "Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?, Source Nodes

### Community 64 - "Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?, Source Nodes

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

### Community 139 - "Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?, Source Nodes

### Community 140 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Where is P-TAKE-01 takeHandler and what governs portable items?

### Community 141 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Find a document heading node named Room entry text

### Community 143 - "Q: Does the W7 trace step's entry title precede the hazard message?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the W7 trace step's entry title precede the hazard message?, Source Nodes

### Community 144 - "QuizRevision.test.ts"
Cohesion: 0.13
Nodes (13): finishWithWrongAnswers(), questionFor(), wrongAnswer(), activeQuiz(), answerCorrectly(), quizDispatch(), quizState(), SeededRandom (+5 more)

### Community 146 - "GameState"
Cohesion: 0.08
Nodes (34): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Behavioural guarantees, 4.1 Meta actions, 4. Game façade and meta actions, 6.1 Event to view mapping, 6. Canonical event union and rendering, 9. Effect to event mapping (+26 more)

### Community 147 - "HintFlow.test.ts"
Cohesion: 0.21
Nodes (4): catalogueOf(), switchyardProgress(), freshState(), hintFixture()

### Community 148 - "Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?, Source Nodes

### Community 149 - "Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel(), Source Nodes

### Community 150 - "Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?, Source Nodes

### Community 151 - "4. Design card format"
Cohesion: 0.29
Nodes (7): 4.1 Common conventions, 4.2 Area and rooms card, 4.4 Quiz card, 4.5 Puzzle card, 4.6 Hazard card, 4.7 Hint card, 4. Design card format

### Community 152 - "Q: graphify section '6.1' — which document owns the event to view mapping?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: graphify section '6.1' — which document owns the event to view mapping?

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
Cohesion: 0.18
Nodes (9): 6. Events and UI, 5. Effect and EffectApplier, Batch E1 — onboarding and intuitive commands, Batch E2 — engine fixes and removals, Decisions settled with the user, formatEvent(), topicLabel(), TitleScreen (+1 more)

### Community 157 - "SpecTopic"
Cohesion: 0.07
Nodes (24): 5.1 Door and container verbs, 5. Canonical command union and verbs, Core, 1. Purpose and authority, 2. Workflow gates, 5. ID and alias registry, 6.1 Content critic, 6.2 PCK reviewer (+16 more)

### Community 165 - "GameState.ts"
Cohesion: 0.16
Nodes (12): 2. Model, 2. Model, 5. Quiz attempts, AreaProgress, GameStateDto, HazardStateDto, HintStateDto, PuzzlePhase (+4 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `GameEvent` (5× useful, score=4.923144212)
- `ContentBundle` (5× useful, score=4.843042077)
- `formatEvent()` (4× useful, score=3.94418404)
- `OutputLog` (4× useful, score=3.939919195)
- `EffectApplier` (4× useful, score=3.899636956)
- `validateContent()` (4× useful, score=3.861356909)
- `TopicResolver` (3× useful, score=2.941488933)
- `ScoreTracker` (3× useful, score=2.923715115)
- `putHandler()` (3× useful, score=2.916210064) _(code changed — re-verify)_
- `SaveControls` (3× useful, score=2.911284399)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"
- "graphify section '6.1' — which document owns the event to view mapping?"

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `EffectApplier.ts`, `content.ts`, `persistence.ts`, `NpcTypes.test.ts`, `parser.ts`, `zone1.ts`, `npcTopicOverlap.ts`, `QuizRevision.test.ts`, `contentToolchain.ts`, `HintFlow.test.ts`, `ui.ts`, `NpcGates.test.ts`, `authoredGame`, `GameState.ts`, `scenery-validation.test.ts`, `GameEvent`, `GameWindow.ts`, `package.json`, `devDependencies`, `npcs.ts`, `authored.ts`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Should `EffectApplier.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09966777408637874 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `StorageAdapter`, `EffectApplier.ts`, `content.ts`, `content/index.ts`, `persistence.ts`, `NpcTypes.test.ts`, `SaveManager.ts`, `parser.ts`, `zone1.ts`, `npcTopicOverlap.ts`, `QuizRevision.test.ts`, `GameState`, `HintFlow.test.ts`, `vitest`, `ConversationFlow.ts`, `LoadResult`, `ui.ts`, `SpecTopic`, `Game`, `adapt.ts`, `TurnContext`, `commandResolution.ts`, `ContentBundle.ts`, `GameState.ts`, `scenery-validation.test.ts`, `HintSystem.ts`, `GameEvent`, `main.ts`, `GameWindow.ts`, `PuzzleSystem.ts`, `npcs.ts`, `TopicPhrase.ts`, `normalisedCards`, `authored.ts`, `Game.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `Issues` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Why does `Parallel execution` connect `Game.ts` to `EffectApplier.ts`, `Issues`, `GameState`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._