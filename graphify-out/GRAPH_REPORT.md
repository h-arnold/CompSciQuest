# Graph Report - CompSciQuest-issue-22  (2026-11-26)

## Corpus Check
- 360 files · ~183,609 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 2608 nodes · 7347 edges · 180 communities (171 shown, 9 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 448 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c0abce37`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContentBundle
- EffectApplier.ts
- Issues
- content.ts
- helpers.ts
- ContentBundle.ts
- zone1.ts
- persistence.ts
- GameState.ts
- SaveManager.ts
- verbs/index.ts
- finding
- PuzzleSystem.test.ts
- parser.ts
- npcHandlers.ts
- npcTopicOverlap.ts
- contentToolchain.ts
- cli.ts
- topicOverlap.ts
- asText
- mechanics.ts
- compilerOptions
- GameViewData.ts
- ConversationFlow.ts
- LoadResult
- engine-issue-5-score.spec.ts
- ui.ts
- NpcTypes.test.ts
- authored.ts
- submit
- Game
- generate.ts
- TurnContext
- Documentation style guide
- NpcGates.test.ts
- ScoreTracker.ts
- w7-opening-walkthrough.spec.ts
- scripts
- scenery-validation.test.ts
- HintSystem.ts
- Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?
- opencode.json
- GameEvent.ts
- commandResolution.ts
- main.ts
- hint.ts
- AuthoredRun
- GameWindow.ts
- SaveActions
- PuzzleSystem.ts
- package.json
- devDependencies
- npcs.ts
- validate.ts
- HANDOFF — CompSciQuest content + W6/W7 state
- deploy.yml
- validateContent.ts
- eslint.config.js
- content/schema.ts
- GameViewData
- MemoryContentIo
- Game.ts
- playwright
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
- ScoreTracker
- QuizFlow.test.ts
- Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?
- Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel
- Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?
- TopicSelection.ts
- Q: graphify section '6.1' — which document owns the event to view mapping?
- Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?
- Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- Storage schema
- Content authoring rules
- production-composition.spec.ts
- adapt.ts
- HintSystem
- .buildDto
- Puzzles
- Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?
- OutputLog
- isActive
- Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?
- Q: Can the Playwright MCP browser drive the app in this session?
- Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?
- Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?
- Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?
- authoredGame
- Q: Can the Playwright MCP browser drive the app in this session?
- ConditionEvaluator.test.ts
- Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?
- Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?
- 6. Key flows
- tsconfig.json
- vite@^8.3.8

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 112 edges
2. `GameEvent` - 97 edges
3. `vitest` - 93 edges
4. `GameState` - 77 edges
5. `asText()` - 62 edges
6. `finding()` - 58 edges
7. `Effect` - 53 edges
8. `Command` - 49 edges
9. `Random` - 47 edges
10. `FakeRandom` - 45 edges

## Surprising Connections (you probably didn't know these)
- `4. Counters and stuckness` --references--> `PuzzleSystem`  [INFERRED]
  docs/developer/storage-schema.md → src/core/puzzles/PuzzleSystem.ts
- `7.1 DOM layout` --references--> `GameWindow`  [INFERRED]
  docs/developer/application-and-ui.md → src/ui/GameWindow.ts
- `Batch E1 — onboarding and intuitive commands` --references--> `TitleScreen`  [INFERRED]
  ENGINE_ISSUES.md → src/ui/TitleScreen.ts
- `8.2 Result type` --references--> `SaveControls`  [INFERRED]
  docs/developer/storage-schema.md → src/ui/SaveControls.ts
- `4. Commands and events` --references--> `Command`  [INFERRED]
  docs/developer/combat.md → src/core/commands/Command.ts

## Import Cycles
- None detected.

## Communities (180 total, 9 thin omitted)

### Community 0 - "ContentBundle"
Cohesion: 0.08
Nodes (61): 2. Boot, title screen and session start, 3.3 Loading and validation, 4.1 Meta actions, 4. Game façade and meta actions, 5.1 Door and container verbs, 5.2 Verb table and handler signature, 5. Canonical command union and verbs, 10. Out of scope (+53 more)

### Community 1 - "EffectApplier.ts"
Cohesion: 0.15
Nodes (23): Parallel execution, quizView(), areaPairForTopic(), applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect() (+15 more)

### Community 2 - "Issues"
Cohesion: 0.04
Nodes (46): Batch E1 — onboarding and intuitive commands, Batch E1 — Onboarding and intuitive commands (planning-led), Batch E2 — engine fixes and removals, Batch E2 — Engine fixes and removals (single implementation batch), Batches, Decisions settled with the user, Definition of done, Engine issues — batched hand-off (+38 more)

### Community 3 - "content.ts"
Cohesion: 0.12
Nodes (39): CreateInitial, runtimeBundle(), BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS (+31 more)

### Community 4 - "helpers.ts"
Cohesion: 0.10
Nodes (23): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, expectWorkspace(), makeQuarantine(), makeSave(), makeState() (+15 more)

### Community 5 - "ContentBundle.ts"
Cohesion: 0.05
Nodes (59): 1. Purpose and authority, 3.1 Catalogue shape, 7. Core contracts, 3. Rule catalogue, C — Conversation and NPCs, D — Data and cards, H — Hazards and hints, N — Narrative (+51 more)

### Community 6 - "zone1.ts"
Cohesion: 0.11
Nodes (31): acceptedCards(), generatedRoomIds(), zone1Cards(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES (+23 more)

### Community 7 - "persistence.ts"
Cohesion: 0.11
Nodes (27): isWon(), asRuntime(), envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, loadEffectApplier(), loadInitialState() (+19 more)

### Community 8 - "GameState.ts"
Cohesion: 0.13
Nodes (17): 2. Model, 2. Model, 6. Link to quiz combat, 2. Model, 5. Quiz attempts, createFromDto(), createInitial(), GameStateDto (+9 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.16
Nodes (28): ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints(), hasValidNpcs() (+20 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.11
Nodes (35): describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible(), matchingInteraction(), normalise() (+27 more)

### Community 11 - "finding"
Cohesion: 0.17
Nodes (27): asArray(), asObjectArray(), collection(), coverageIds(), DIRECTIONS, effectList(), entriesWith(), knownTopicIds() (+19 more)

### Community 12 - "PuzzleSystem.test.ts"
Cohesion: 0.17
Nodes (24): createEffectApplier(), DOOR_FLAG, eventTypes(), loadConditionEvaluatorFactory(), loadHazardSystemFactory(), loadPuzzleSystemFactory(), mechanicsBundle(), PUZZLE_ID (+16 more)

### Community 13 - "parser.ts"
Cohesion: 0.08
Nodes (33): CommandHandler, getCommandHandler, CHEST_ID, DOOR_ID, KEY_A, KEY_B, loadNameResolver(), loadParser() (+25 more)

### Community 14 - "npcHandlers.ts"
Cohesion: 0.53
Nodes (4): hasItem(), isTalking(), message(), npcHandler()

### Community 15 - "npcTopicOverlap.ts"
Cohesion: 0.11
Nodes (66): gNpc06(), gNpc07(), gNpc08(), gNpc09(), gNpc10(), gNpc11(), gNpc12(), gNpc13() (+58 more)

### Community 16 - "contentToolchain.ts"
Cohesion: 0.07
Nodes (27): vitest, Data, PER_AREA_PATHS, AREA_ID, CardFile, expectSameMembers(), Finding, GATE_NAMES (+19 more)

### Community 17 - "cli.ts"
Cohesion: 0.08
Nodes (32): 1. Purpose, 3. Scaffolds, 4. Validation, 6. Ownership, 7. Coverage-graph extraction, Content toolchain, CONTENT_ROOT, COVERAGE_PATH (+24 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (34): asRecord(), ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf() (+26 more)

### Community 19 - "asText"
Cohesion: 0.21
Nodes (29): allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), EFFECT_KINDS, finding(), idsOf() (+21 more)

### Community 20 - "mechanics.ts"
Cohesion: 0.10
Nodes (30): puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, FIXED_TURN, hazard() (+22 more)

### Community 21 - "compilerOptions"
Cohesion: 0.08
Nodes (26): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+18 more)

### Community 22 - "GameViewData.ts"
Cohesion: 0.17
Nodes (11): AreaProgressView, ConversationView, HintView, QuizView, SpecTopicView, SpecStatus, appendLine(), ConversationPanel (+3 more)

### Community 23 - "ConversationFlow.ts"
Cohesion: 0.19
Nodes (25): activeNode(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode(), fallBackAfterOnce() (+17 more)

### Community 24 - "LoadResult"
Cohesion: 0.09
Nodes (12): LoadResult, SaveDto, MemoryStorage, FakeBus, installFakeDocument(), makeViewData(), RecordingGame, BootSetup (+4 more)

### Community 26 - "ui.ts"
Cohesion: 0.07
Nodes (29): absentElement(), allText(), Bootstrap, descendants(), documentState, FakeDocument, FakeElement, FakeEvent (+21 more)

### Community 27 - "NpcTypes.test.ts"
Cohesion: 0.11
Nodes (26): 4.3 NPC card, resolveScenery(), createNameResolver(), actorKeywordTopic(), createTopicResolver(), hasKeyword(), isBoundToActor(), ConversationNode (+18 more)

### Community 28 - "authored.ts"
Cohesion: 0.14
Nodes (19): AuthoredStateOptions, changedFlags(), eventTypes(), FOREMAN_ID, gameplaySnapshot(), producerState(), ProducerStateOptions, requirementFlags() (+11 more)

### Community 29 - "submit"
Cohesion: 0.15
Nodes (14): command(), DEBUG_FRAGMENTS, command(), IMPLEMENTATION_PATTERNS, command(), INTERNAL_LINE_PATTERNS, SAVE_KEY, seedStorage() (+6 more)

### Community 31 - "generate.ts"
Cohesion: 0.16
Nodes (21): 5. Generation, GeneratedFile, GenerationResult, ParsedCard, CatalogueEmit, cleanEntry(), emitCatalogue(), indentJson() (+13 more)

### Community 32 - "TurnContext"
Cohesion: 0.16
Nodes (13): 8. Behavioural signatures, 3. Execution, ComposedReaction, ComposedReactionDependencies, createComposedReaction(), FiredThisTurn, HazardSystem, isInitialRoom() (+5 more)

### Community 33 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 34 - "NpcGates.test.ts"
Cohesion: 0.11
Nodes (24): gateFindings(), CardData, cleanParsedSet(), definition(), roomData(), actor(), Data, EmittedNode (+16 more)

### Community 35 - "ScoreTracker.ts"
Cohesion: 0.19
Nodes (18): areaPairForRoom(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, Announce, AreaPair, award(), createScoreTracker() (+10 more)

### Community 36 - "w7-opening-walkthrough.spec.ts"
Cohesion: 0.20
Nodes (19): command(), enter(), expectEntry(), expectFlags(), expectOwners(), expectPosition(), expectPuzzle(), expectTransfer() (+11 more)

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

### Community 42 - "GameEvent.ts"
Cohesion: 0.11
Nodes (16): loadFormatEvent(), BUNDLE, COMPLETED, SOLVED_WITH_TOPIC, SOLVED_WITHOUT_TOPIC, INTERNAL_STATE_EVENTS, NON_GAIN_EVENTS, PLAYER_FACING_EVENTS (+8 more)

### Community 43 - "commandResolution.ts"
Cohesion: 0.07
Nodes (41): 6.3 Room entry, score and spec-topic mapping, Core, 11. Invariants the implementation must keep, 3. Condition, actorAndRemainder(), answerCommand(), conversationCommand(), DIRECTION_NAMES (+33 more)

### Community 44 - "main.ts"
Cohesion: 0.19
Nodes (11): 8. Fixed contracts content must use, loadContent(), createEventBus(), bootstrap(), browserDownload(), browserOpenSaveFile(), seededRandom(), startBrowserApp() (+3 more)

### Community 45 - "hint.ts"
Cohesion: 0.23
Nodes (14): asNumber(), CardEntry, checkHint(), ladderFindings(), levelFindings(), penaltyFindings(), targetFindings(), UNLOCK_PREFIXES (+6 more)

### Community 46 - "AuthoredRun"
Cohesion: 0.17
Nodes (7): authoredBundle, AuthoredRun, gateFlag(), lastQuestion(), lastWinningBatch(), MILL_FLAGS, TRACE_FLAGS

### Community 47 - "GameWindow.ts"
Cohesion: 0.47
Nodes (4): QuarantineDto, LoadFailureReason, loadFailureMessage(), MESSAGES

### Community 48 - "SaveActions"
Cohesion: 0.29
Nodes (3): 9. Quarantine, SaveActions, SaveControls

### Community 49 - "PuzzleSystem.ts"
Cohesion: 0.14
Nodes (20): 3. Completion detection, EffectApplier, HazardSystemDependencies, HintSystemDependencies, NpcDependencies, FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient() (+12 more)

### Community 50 - "package.json"
Cohesion: 0.17
Nodes (11): description, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, zod@^4.6.7, name, private, type, version (+3 more)

### Community 51 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@^10.15.0, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, typescript-7@npm:typescript@^7.0.2, vitest@^5.1.1, yaml@^2.9.1, eslint (+4 more)

### Community 52 - "npcs.ts"
Cohesion: 0.05
Nodes (71): 6.1 Event to view mapping, 6. Canonical event union and rendering, GameEvent, formatEvent(), topicLabel(), SchedulerContract, ACTOR_ALIAS, ACTOR_ID (+63 more)

### Community 53 - "validate.ts"
Cohesion: 0.21
Nodes (18): Finding, ParsedCardSet, stringList(), checkPuzzle(), clueFindings(), cycleFindings(), dependencyFindings(), puzzleFindings() (+10 more)

### Community 54 - "HANDOFF — CompSciQuest content + W6/W7 state"
Cohesion: 0.11
Nodes (18): 10. Commit / push note, 1. One-paragraph summary, 2. Read these first (in order), 3. What is accepted (content, do not re-litigate), 4.1 Failure inventory, 4.2 The generated bundle is stale — verify this first, 4. Current verification state (measured 2026-11-26), 5. Ordered next steps (+10 more)

### Community 55 - "deploy.yml"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 56 - "validateContent.ts"
Cohesion: 0.06
Nodes (47): 7.1 Free-text topic-overlap proof, 7. Structural validation gates, aliasProblems(), aliasProblemsOf(), asRecord(), budgetProblems(), catalogueIds(), coverageProblems() (+39 more)

### Community 57 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 58 - "content/schema.ts"
Cohesion: 0.19
Nodes (13): CardSet, ParseResult, AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape, KINDS (+5 more)

### Community 59 - "GameViewData"
Cohesion: 0.17
Nodes (8): 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, Persistence and UI, GameViewData, HintPanel, QuizPanel, Terminal

### Community 61 - "Game.ts"
Cohesion: 0.15
Nodes (14): adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), recordSeed(), MetaAction, createQuizSystem(), QuizSystemDependencies (+6 more)

### Community 62 - "playwright"
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
Cohesion: 0.21
Nodes (7): activeQuiz(), quizDispatch(), quizState(), SeededRandom, SeededRandomPort, startEffect(), authoredNpc()

### Community 146 - "ScoreTracker"
Cohesion: 0.13
Nodes (18): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Behavioural guarantees, 3.2 World, area, room and item definitions, 3. Content bundle and registration, 9. Effect to event mapping, Application and UI contracts, 1. Scope (+10 more)

### Community 147 - "QuizFlow.test.ts"
Cohesion: 0.12
Nodes (10): Catalogue, catalogueOf(), finishWithWrongAnswers(), questionFor(), wrongAnswer(), answerCorrectly(), messageTexts(), readSave() (+2 more)

### Community 148 - "Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?, Source Nodes

### Community 149 - "Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel(), Source Nodes

### Community 150 - "Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?, Source Nodes

### Community 151 - "TopicSelection.ts"
Cohesion: 0.25
Nodes (16): AskTellMatch, chooseCandidate(), exactDeclaredTopic(), GiveShowMatch, hasKeyword(), hasObjectMatch(), hasResolvedMatch(), isAskTellMatch() (+8 more)

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

### Community 156 - "Storage schema"
Cohesion: 0.13
Nodes (14): 11. Flow, 12. Invariants the implementation must keep, 13. Out of scope, 1. Scope and authority, 3.1 Top-level DTO, 3.3 Invariants, 3. Persisted shape (canonical), 4. Counters and stuckness (+6 more)

### Community 157 - "Content authoring rules"
Cohesion: 0.12
Nodes (17): 1. Purpose and authority, 2. Workflow gates, 4.1 Common conventions, 4.2 Area and rooms card, 4.4 Quiz card, 4.5 Puzzle card, 4.6 Hazard card, 4.7 Hint card (+9 more)

### Community 159 - "production-composition.spec.ts"
Cohesion: 0.21
Nodes (8): SAVED_AT, repeatableHazard, expectHazardOutcome(), hazardAnnouncement(), HazardStep, playwright@1.65.1, playwright, hazards

### Community 160 - "adapt.ts"
Cohesion: 0.40
Nodes (9): bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings(), text() (+1 more)

### Community 161 - "HintSystem"
Cohesion: 0.39
Nodes (7): 1. Scope, 2. Model, 3. Commands and delivery, 4. Adaptive behaviour, 5. Score interaction, Hints, HintSystem

### Community 162 - ".buildDto"
Cohesion: 0.50
Nodes (3): 6.4 Save, load, download and import, 2. Envelope, keys and file format, RuntimeGameState

### Community 163 - "Puzzles"
Cohesion: 0.40
Nodes (5): 1. Scope, 4. Puzzle Dependency Graph, 5. Hints, 6. Integration points, Puzzles

### Community 164 - "Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?, Source Nodes

### Community 165 - "OutputLog"
Cohesion: 0.22
Nodes (6): 4. Failure consequences, 5. Content, 6. Events and UI, Hazards, 7. State, events and UI, OutputLog

### Community 166 - "isActive"
Cohesion: 0.19
Nodes (11): 1. Scope, 2. Model, 3. Commands and topic resolution, 4. Conversation flow, 5. Conversation nodes, NPCs and conversation, MultiwordAlias, TopicResolver (+3 more)

### Community 167 - "Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?, Source Nodes

### Community 168 - "Q: Can the Playwright MCP browser drive the app in this session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this session?, Source Nodes

### Community 169 - "Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?, Source Nodes

### Community 170 - "Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?, Source Nodes

### Community 171 - "Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?, Source Nodes

### Community 172 - "authoredGame"
Cohesion: 0.17
Nodes (9): createSaveManager(), authoredGame(), authoredState(), seededNpcs(), hintFixture(), areaFor(), ejectionFixture(), progressRow() (+1 more)

### Community 173 - "Q: Can the Playwright MCP browser drive the app in this session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this session?, Source Nodes

### Community 175 - "Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?, Source Nodes

### Community 176 - "Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?, Source Nodes

### Community 177 - "6. Key flows"
Cohesion: 0.50
Nodes (3): 6.2 One command turn, 6.5 Losing a life and winning, 6. Key flows

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `GameEvent` (8× useful, score=7.913136727)
- `formatEvent()` (6× useful, score=5.935534214)
- `OutputLog` (6× useful, score=5.931276088)
- `EffectApplier` (5× useful, score=4.893482022)
- `ContentBundle` (5× useful, score=4.835412473)
- `validateContent()` (4× useful, score=3.855273826)
- `GameViewData` (3× useful, score=2.936865794)
- `TopicResolver` (3× useful, score=2.936854987)
- `ScoreTracker` (3× useful, score=2.919109169)
- `putHandler()` (3× useful, score=2.911615941)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"
- "graphify section '6.1' — which document owns the event to view mapping?"
- "Can the Playwright MCP browser drive the app in this session?" -> `playwright.config.ts`, `helpers.ts`

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `contentToolchain.ts` to `ContentBundle`, `content.ts`, `ContentBundle.ts`, `zone1.ts`, `persistence.ts`, `PuzzleSystem.test.ts`, `parser.ts`, `npcTopicOverlap.ts`, `QuizRevision.test.ts`, `QuizFlow.test.ts`, `mechanics.ts`, `ui.ts`, `NpcTypes.test.ts`, `authored.ts`, `NpcGates.test.ts`, `ScoreTracker.ts`, `scenery-validation.test.ts`, `GameEvent.ts`, `authoredGame`, `ConditionEvaluator.test.ts`, `GameWindow.ts`, `AuthoredRun`, `package.json`, `devDependencies`, `npcs.ts`, `validateContent.ts`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Should `ContentBundle` be split into smaller, more focused modules?**
  _Cohesion score 0.07511737089201878 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `EffectApplier.ts`, `content.ts`, `ContentBundle.ts`, `zone1.ts`, `persistence.ts`, `GameState.ts`, `SaveManager.ts`, `PuzzleSystem.test.ts`, `parser.ts`, `cli.ts`, `ScoreTracker`, `QuizFlow.test.ts`, `mechanics.ts`, `TopicSelection.ts`, `LoadResult`, `ui.ts`, `NpcTypes.test.ts`, `authored.ts`, `Game`, `generate.ts`, `TurnContext`, `adapt.ts`, `ScoreTracker.ts`, `scenery-validation.test.ts`, `HintSystem.ts`, `commandResolution.ts`, `main.ts`, `authoredGame`, `GameWindow.ts`, `PuzzleSystem.ts`, `npcs.ts`, `validateContent.ts`, `Game.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `EffectApplier.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14666666666666667 - nodes in this community are weakly interconnected._
- **Why does `asText()` connect `asText` to `adapt.ts`, `finding`, `hint.ts`, `topicOverlap.ts`, `validate.ts`, `generate.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._