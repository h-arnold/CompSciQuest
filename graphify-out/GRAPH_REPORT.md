# Graph Report - CompSciQuest-issue-16  (2026-11-26)

## Corpus Check
- 424 files · ~203,840 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 2975 nodes · 7987 edges · 223 communities (217 shown, 6 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 455 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b4ba3be5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- GameState.ts
- npcTopicOverlapPairCases.ts
- w7-opening-walkthrough.spec.ts
- vitest
- helpers.ts
- content/index.ts
- Issues
- persistence.ts
- HintSystem.ts
- SaveManager.ts
- verbs/index.ts
- submit
- ui.ts
- parser.ts
- content.ts
- Game.ts
- collection
- ScoreTracker.ts
- topicOverlap.ts
- asText
- mechanics.ts
- compilerOptions
- GameWindow.ts
- TopicSelection.ts
- generate.ts
- 3. Rule catalogue
- FakeElement
- NpcGates.test.ts
- isActive
- contentToolchain.ts
- validateContent.ts
- startNewGame
- TurnContext
- Documentation style guide
- commandResolution.ts
- npcTopicOverlap.ts
- GameStateDto
- scripts
- Effect
- ContentBundle
- ConversationFlow.ts
- opencode.json
- AuthoredRun
- cli.ts
- Core
- finding
- PuzzleSystem.test.ts
- save-import.spec.ts
- FakeRandom
- Game
- package.json
- devDependencies
- npcs.ts
- engine-issue-15-life-gate.spec.ts
- SaveActions
- deploy.yml
- EffectApplier.ts
- eslint.config.js
- engine-issue-11.spec.ts
- HelpOutput.test.ts
- Favicon.test.ts
- engine-issue-13-inventory.test.ts
- adapt.ts
- HazardSystem.ts
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
- Random
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- node-shims.d.ts
- Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?
- SeededRandom
- turn.ts
- Command
- Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?
- AreaChangeLifeGate.test.ts
- Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?
- 4. Design card format
- TopicPhrase.ts
- Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?
- Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- NameResolver.ts
- Content authoring rules
- content/schema.ts
- GameEvent
- Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?
- Storage schema
- engine-issue-9-quick-answers.spec.ts
- playwright
- Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?
- Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?
- Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?
- Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?
- Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?
- Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?
- Q: Do ordinary browser commands autosave the game state?
- Q: Where does the area-entry life reset gate live and how can it be exercised in a browser?
- Q: How to override the Playwright baseURL in a scratchpad config?
- Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?
- Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?
- Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?
- Q: Bypass check: does any source outside ScorePanel reimplement the per-area Score / Rooms visited sidebar lines?
- Q: Which production node owns sidebar area-card rendering and how should it select the current area from GameViewData?
- Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?
- Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?
- Q: ENG11 browser QA: how should the W7 expectAreaConsistency helper assert sidebar state after the current-area-only change, and where does the headline score come from in a saved v1 DTO?
- Q: Which production nodes own the sidebar progress panel and how does ScorePanel.renderArea/refresh render area cards from GameViewData for ENG11?
- Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?
- Q: Why does generated help text with newlines display as one dense paragraph in the transcript?
- Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?
- Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?
- Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?
- Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?
- Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?
- Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?
- Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?
- Q: Does the W7 trace step's entry title precede the hazard message?
- Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?
- Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?
- Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel
- Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?
- Q: Can the Playwright MCP browser drive the app in this session?
- Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?
- Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?
- Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?
- Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?
- Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?
- Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?
- Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?
- Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?
- Q: Is there an existing owner for detail-suffix help rendering that detailSuffix() duplicates?
- Q: Where is the canonical help copy generated and which node owns COMMAND_TABLE / helpText() for ask and answer syntax?
- Q: Can the Playwright MCP browser drive the app in this session?
- Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?
- Q: Where is the browser-rendered help copy generated and which nodes own the issue-9 ask/bare-answer forms?
- Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?
- Q: Which canonical node derives a puzzle's completion effect, and is there a duplicate derivation bypassing it?
- Q: E2E-22-01: does a single puzzle solve still print the friendly completion line twice?
- Q: ENG28-ACTIVATION-01: which node canonically owns formatEvent transcript rendering and suppression of puzzle-activated, and is the effect/event pipeline unchanged?
- Q: ENG28-ACTIVATION-01: which canonical node owns formatEvent transcript rendering for puzzle-activated, and is render-time suppression the only compliant change?
- Q: Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?
- Q: ENG28-ACTIVATION-01 which nodes own puzzle-activated suppression and the effect pipeline?
- QuizStateDto
- Q: graphify section '6.1' — which document owns the event to view mapping?
- Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?
- zod
- tsconfig.json

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 117 edges
2. `vitest` - 106 edges
3. `GameEvent` - 99 edges
4. `GameState` - 82 edges
5. `asText()` - 62 edges
6. `finding()` - 58 edges
7. `Effect` - 54 edges
8. `Command` - 53 edges
9. `Random` - 47 edges
10. `FakeRandom` - 47 edges

## Surprising Connections (you probably didn't know these)
- `11. Flow` --references--> `Game`  [INFERRED]
  docs/developer/storage-schema.md → src/application/Game.ts
- `6.1 Event to view mapping` --references--> `GameViewData`  [INFERRED]
  docs/developer/application-and-ui.md → src/application/GameViewData.ts
- `4. Failure consequences` --references--> `AreaDefinition`  [INFERRED]
  docs/developer/hazards.md → src/content/AreaDefinition.ts
- `1. Purpose` --references--> `ContentBundle`  [INFERRED]
  docs/developer/content-toolchain.md → src/content/ContentBundle.ts
- `D — Data and cards` --references--> `RoomDefinition`  [INFERRED]
  docs/developer/content-rules.md → src/content/RoomDefinition.ts

## Import Cycles
- None detected.

## Communities (223 total, 6 thin omitted)

### Community 0 - "GameState.ts"
Cohesion: 0.08
Nodes (24): actorKeywordTopic(), createTopicResolver(), hasKeyword(), isBoundToActor(), TopicResolver, createFromDto(), GameState, RuntimeGameState (+16 more)

### Community 1 - "npcTopicOverlapPairCases.ts"
Cohesion: 0.15
Nodes (39): gNpc08(), gNpc13(), gNpc15(), gNpc16(), gNpc17(), gNpc18(), command(), gNpc01() (+31 more)

### Community 2 - "w7-opening-walkthrough.spec.ts"
Cohesion: 0.17
Nodes (21): expectHazardOutcome(), hazardAnnouncement(), HazardStep, command(), enter(), expectEntry(), expectFlags(), expectOwners() (+13 more)

### Community 3 - "vitest"
Cohesion: 0.07
Nodes (46): vitest, RoomSummary, formatEvent(), topicLabel(), finishWithWrongAnswers(), questionFor(), wrongAnswer(), activeQuiz() (+38 more)

### Community 4 - "helpers.ts"
Cohesion: 0.09
Nodes (17): boot(), openSession(), PROMISED, authoredArea, authoredStartRoom, authoredWorld, makeSave(), makeState() (+9 more)

### Community 5 - "content/index.ts"
Cohesion: 0.12
Nodes (16): area, START_POSITION, startRoom, ActorDefinition, actorStates, actors, conversationTopics, hints (+8 more)

### Community 6 - "Issues"
Cohesion: 0.04
Nodes (46): Batch E1 — onboarding and intuitive commands, Batch E1 — Onboarding and intuitive commands (planning-led), Batch E2 — engine fixes and removals, Batch E2 — Engine fixes and removals (single implementation batch), Batches, Decisions settled with the user, Definition of done, Engine issues — batched hand-off (+38 more)

### Community 7 - "persistence.ts"
Cohesion: 0.08
Nodes (32): authoredGame(), makePutFixture(), asRuntime(), envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, loadInitialState() (+24 more)

### Community 8 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.15
Nodes (30): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+22 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.06
Nodes (58): aliasSuffix(), COMMAND_TABLE, CommandSpec, detailSuffix(), DIRECTIONS, DirectionSpec, helpText(), describeScenery() (+50 more)

### Community 11 - "submit"
Cohesion: 0.16
Nodes (12): command(), DEBUG_FRAGMENTS, command(), IMPLEMENTATION_PATTERNS, command(), INTERNAL_LINE_PATTERNS, seedStorage(), submit() (+4 more)

### Community 12 - "ui.ts"
Cohesion: 0.11
Nodes (35): makeEnvelope(), QUARANTINE_KEY, allText(), Bootstrap, BootstrapDependencies, descendants(), documentState, FakeBus (+27 more)

### Community 13 - "parser.ts"
Cohesion: 0.06
Nodes (43): 5. Conversation nodes, ParsedCommand, loadDialogueSystemFactory(), loadTopicResolverFactory(), CHEST_ID, DOOR_ID, KEY_A, KEY_B (+35 more)

### Community 14 - "content.ts"
Cohesion: 0.06
Nodes (69): acceptedCards(), generatedRoomIds(), zone1Cards(), CreateInitial, zone1Cards(), zone1Generation(), runtimeBundle(), CONTENT_SOURCES (+61 more)

### Community 15 - "Game.ts"
Cohesion: 0.10
Nodes (21): 3. Flow, Parallel execution, adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), quizView(), recordSeed() (+13 more)

### Community 16 - "collection"
Cohesion: 0.17
Nodes (28): asArray(), asObjectArray(), collection(), coverageIds(), DIRECTIONS, EFFECT_KINDS, effectList(), entriesWith() (+20 more)

### Community 17 - "ScoreTracker.ts"
Cohesion: 0.20
Nodes (19): areaPairForRoom(), areaPairForTopic(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, Announce, AreaPair, award() (+11 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (35): asRecord(), ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf() (+27 more)

### Community 19 - "asText"
Cohesion: 0.23
Nodes (22): allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), idsOf(), checkNpc(), defaultTopicFindings() (+14 more)

### Community 20 - "mechanics.ts"
Cohesion: 0.10
Nodes (29): puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, FIXED_TURN, hazard() (+21 more)

### Community 21 - "compilerOptions"
Cohesion: 0.08
Nodes (26): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+18 more)

### Community 22 - "GameWindow.ts"
Cohesion: 0.08
Nodes (28): 2. Boot, title screen and session start, 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, Persistence and UI, 6. Events and UI, 7. State, events and UI, AreaProgressView (+20 more)

### Community 23 - "TopicSelection.ts"
Cohesion: 0.22
Nodes (19): AskTellMatch, chooseCandidate(), exactDeclaredTopic(), findDefaultTopic(), GiveShowMatch, hasKeyword(), hasObjectMatch(), hasResolvedMatch() (+11 more)

### Community 24 - "generate.ts"
Cohesion: 0.14
Nodes (24): 5. Generation, CardFile, GeneratedFile, GenerationResult, ParsedCard, ValidateResult, ValidationOptions, CatalogueEmit (+16 more)

### Community 25 - "3. Rule catalogue"
Cohesion: 0.29
Nodes (7): 3. Rule catalogue, C — Conversation and NPCs, D — Data and cards, H — Hazards and hints, N — Narrative, P — Pedagogy and course mapping, V — Validation

### Community 26 - "FakeElement"
Cohesion: 0.08
Nodes (12): absentElement(), FakeDocument, FakeElement, hasMatchingAncestors(), isTokenMatch(), makeFakeDocument(), logLines(), pressEnter() (+4 more)

### Community 27 - "NpcGates.test.ts"
Cohesion: 0.11
Nodes (23): CardData, cleanParsedSet(), definition(), roomData(), actor(), Data, EmittedNode, EmittedTopic (+15 more)

### Community 28 - "isActive"
Cohesion: 0.08
Nodes (26): 7.1 Free-text topic-overlap proof, 2. Model, 3. Commands and topic resolution, 4. Conversation flow, 6. Link to quiz combat, NPCs and conversation, 10. Commit / push note, 1. One-paragraph summary (+18 more)

### Community 29 - "contentToolchain.ts"
Cohesion: 0.05
Nodes (43): Data, gateFindings(), PER_AREA_PATHS, cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), AREA_ID (+35 more)

### Community 30 - "validateContent.ts"
Cohesion: 0.06
Nodes (49): 3.2 World, area, room and item definitions, 3.3 Loading and validation, 3. Content bundle and registration, 7. Structural validation gates, aliasProblems(), aliasProblemsOf(), asRecord(), budgetProblems() (+41 more)

### Community 31 - "startNewGame"
Cohesion: 0.31
Nodes (9): liveSave(), command(), continueFromCraftedSave(), savedState(), State, expectWorkspace(), readStorage(), startNewGame() (+1 more)

### Community 32 - "TurnContext"
Cohesion: 0.09
Nodes (30): 8. Behavioural signatures, 2. Model, 3. Execution, 4. Failure consequences, 5. Content, Hazards, 1. Scope, 2. Model (+22 more)

### Community 33 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 34 - "commandResolution.ts"
Cohesion: 0.14
Nodes (25): actorAndRemainder(), answerCommand(), bareAnswerCommand(), conversationCommand(), DIRECTION_BY_TOKEN, directionCommand(), fallbackPair(), inferAskActor() (+17 more)

### Community 35 - "npcTopicOverlap.ts"
Cohesion: 0.19
Nodes (27): gNpc06(), gNpc07(), gNpc09(), gNpc10(), gNpc11(), gNpc12(), gNpc14(), ACTOR_ID (+19 more)

### Community 36 - "GameStateDto"
Cohesion: 0.09
Nodes (14): 6.4 Save, load, download and import, 2. Envelope, keys and file format, QuarantineDto, LoadFailureReason, LoadResult, SaveDto, SaveManager, GameStateDto (+6 more)

### Community 37 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 38 - "Effect"
Cohesion: 0.15
Nodes (20): 1. Purpose and authority, 4.3 NPC card, 1. Scope, 1. Purpose, 3.2 Entity and system state, ExitDefinition, Effect, ActorState (+12 more)

### Community 39 - "ContentBundle"
Cohesion: 0.19
Nodes (14): 11. Win check owner, 3.1 Catalogue shape, 7. Core contracts, 2. Authoring format, AreaDefinition, Catalogue, ContentBundle, RoomDefinition (+6 more)

### Community 40 - "ConversationFlow.ts"
Cohesion: 0.19
Nodes (23): activeNode(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode(), fallBackAfterOnce() (+15 more)

### Community 41 - "opencode.json"
Cohesion: 0.12
Nodes (16): command, type, default_agent, experimental, subagent_depth, command, type, mcp (+8 more)

### Community 42 - "AuthoredRun"
Cohesion: 0.20
Nodes (3): AuthoredRun, gateFlag(), lastQuestion()

### Community 43 - "cli.ts"
Cohesion: 0.08
Nodes (30): 1. Purpose, 3. Scaffolds, 4. Validation, 6. Ownership, 7. Coverage-graph extraction, Content toolchain, CONTENT_ROOT, COVERAGE_PATH (+22 more)

### Community 44 - "Core"
Cohesion: 0.15
Nodes (15): 10. Scoring with many puzzles per topic, Core, 11. Invariants the implementation must keep, 3. Condition, 7. Restore-time derivation, PlayerView, AreaProgress, Exit (+7 more)

### Community 45 - "finding"
Cohesion: 0.14
Nodes (37): sharedFindings(), Finding, ParsedCardSet, asNumber(), CardEntry, finding(), stringList(), checkHazard() (+29 more)

### Community 46 - "PuzzleSystem.test.ts"
Cohesion: 0.20
Nodes (15): DOOR_FLAG, eventTypes(), mechanicsBundle(), mechanicsState(), PUZZLE_ID, ReactionSystemContract, TOPIC_ID, turnContext() (+7 more)

### Community 47 - "save-import.spec.ts"
Cohesion: 0.15
Nodes (8): DOWNLOAD_NAME, makeQuarantine(), QUARANTINE_DOWNLOAD_NAME, QUARANTINE_KEY, statusText(), countLines(), DownloadedSave, persistedTurn()

### Community 48 - "FakeRandom"
Cohesion: 0.16
Nodes (19): createEffectApplier(), loadConditionEvaluatorFactory(), dialogueSystemFor(), resolverFor(), FakeRandom, loadFormatEvent(), hazardsFor(), createEffectApplierFor() (+11 more)

### Community 49 - "Game"
Cohesion: 0.08
Nodes (34): 4.1 Meta actions, 4. Game façade and meta actions, 6.1 Event to view mapping, 6. Canonical event union and rendering, 10. Out of scope, 1. Scope and goals, 2. Design principles, 3. Layers and dependency direction (+26 more)

### Community 50 - "package.json"
Cohesion: 0.17
Nodes (11): description, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, yaml@^2.9.1, name, private, type, version (+3 more)

### Community 51 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint@^10.15.0, playwright@1.65.1, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, typescript-7@npm:typescript@^7.0.2, vite@^8.3.8, vitest@^5.1.1 (+5 more)

### Community 52 - "npcs.ts"
Cohesion: 0.09
Nodes (52): ACTOR_ALIAS, ACTOR_ID, actorState(), always, askRing, byeCommand, ConditionEvaluatorCondition, CountingRandom (+44 more)

### Community 53 - "engine-issue-15-life-gate.spec.ts"
Cohesion: 0.18
Nodes (11): command(), continueFrom(), firstId(), GATE_IDS, gateIds(), GateOverrides, savedState(), SaveState (+3 more)

### Community 54 - "SaveActions"
Cohesion: 0.12
Nodes (7): 6.1 Bootstrap (`src/main.ts`), 6.2 One command turn, 6.3 Room entry, score and spec-topic mapping, 6.5 Losing a life and winning, 6. Key flows, loadFailureMessage(), SaveActions

### Community 55 - "deploy.yml"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 56 - "EffectApplier.ts"
Cohesion: 0.15
Nodes (22): 2. Model, applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), areaChangeEvents() (+14 more)

### Community 57 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 58 - "engine-issue-11.spec.ts"
Cohesion: 0.14
Nodes (10): areaHeaders(), authoredArea(), expectCurrentCard(), headerFor(), panelLines(), PROGRESS, TOTAL_SCORE, areas (+2 more)

### Community 59 - "HelpOutput.test.ts"
Cohesion: 0.17
Nodes (15): CommandSpec, CommandTableModule, DirectionSpec, hasCommandToken(), loadCommandTable(), loadVerbTable(), makeTurnContext(), CANONICAL_COMMANDS (+7 more)

### Community 60 - "Favicon.test.ts"
Cohesion: 0.28
Nodes (5): attributes(), FAVICON_PATH, iconLinks(), INDEX_PATH, linkElements()

### Community 61 - "engine-issue-13-inventory.test.ts"
Cohesion: 0.36
Nodes (8): getCommandHandler, CARTRIDGE, contextFor(), handlerFor(), inventoryReply(), LAMP, messagesOf(), stateSnapshot()

### Community 62 - "adapt.ts"
Cohesion: 0.18
Nodes (10): catalogueOf(), HintLevel, bundleOf(), gateOf(), isTrue(), number(), numbers(), strings() (+2 more)

### Community 63 - "HazardSystem.ts"
Cohesion: 0.19
Nodes (7): hazards, Hazard, HazardCatalogue, FiredThisTurn, isInitialRoom(), isTriggerMatched(), Trigger

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

### Community 139 - "Random"
Cohesion: 0.12
Nodes (26): 1. Scope, GameDependencies, EffectApplier, EffectApplierDependencies, HazardSystemDependencies, HintSystemDependencies, NpcDependencies, FiredThisTurn (+18 more)

### Community 140 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Where is P-TAKE-01 takeHandler and what governs portable items?

### Community 141 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Find a document heading node named Room entry text

### Community 143 - "Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?, Source Nodes

### Community 146 - "turn.ts"
Cohesion: 0.10
Nodes (17): 12. Behavioural guarantees, 9. Effect to event mapping, 2. Turn pipeline, 3.1 Top-level DTO, 3.3 Invariants, 3. Persisted shape (canonical), Session, ScoreTracker (+9 more)

### Community 147 - "Command"
Cohesion: 0.18
Nodes (13): 5.1 Door and container verbs, 5.2 Verb table and handler signature, 5. Canonical command union and verbs, Application and UI contracts, Command, CommandHandler, hasItem(), isTalking() (+5 more)

### Community 148 - "Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?, Source Nodes

### Community 149 - "AreaChangeLifeGate.test.ts"
Cohesion: 0.19
Nodes (8): quizzes, Quiz, areaOf(), BundleOptions, gatedBundle(), gatedState(), roomOf(), TopicIndexEntry

### Community 150 - "Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?, Source Nodes

### Community 151 - "4. Design card format"
Cohesion: 0.29
Nodes (7): 4.1 Common conventions, 4.2 Area and rooms card, 4.4 Quiz card, 4.5 Puzzle card, 4.6 Hazard card, 4.7 Hint card, 4. Design card format

### Community 152 - "TopicPhrase.ts"
Cohesion: 0.39
Nodes (8): AskTellMatch, collectMatches(), DeclaredObjectPhrase, findDeclaredObjectPhrase(), isAskTellMatch(), isBoundToActor(), isObjectName(), normalise()

### Community 153 - "Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?, Source Nodes

### Community 154 - "Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?, Source Nodes

### Community 155 - "Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?, Source Nodes

### Community 156 - "NameResolver.ts"
Cohesion: 0.14
Nodes (10): 5. ID and alias registry, 10. Determinism and ordering rules, 4. Trigger, 5. Effect and EffectApplier, 6. Scheduler (TADS fuse / daemon), 7. Random port, 8. Persisted-shape constraints for rule-spine state, 9. Content registration (+2 more)

### Community 157 - "Content authoring rules"
Cohesion: 0.18
Nodes (11): 1. Purpose and authority, 2. Workflow gates, 6.1 Content critic, 6.2 PCK reviewer, 6. Reviewer rubrics, 8. Fixed contracts content must use, 9.1 Shared definition of done, 9.2 Shared hard constraints (+3 more)

### Community 158 - "content/schema.ts"
Cohesion: 0.22
Nodes (14): CardSet, ParseResult, AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape, KINDS (+6 more)

### Community 159 - "GameEvent"
Cohesion: 0.10
Nodes (15): GameEvent, DialogueSystemContract, EffectApplierLike, RecordingBus, INTERNAL_STATE_EVENTS, NON_GAIN_EVENTS, PLAYER_FACING_EVENTS, ScoreChanged (+7 more)

### Community 160 - "Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?, Source Nodes

### Community 162 - "Storage schema"
Cohesion: 0.18
Nodes (11): 10. API contracts, 11. Flow, 12. Invariants the implementation must keep, 13. Out of scope, 1. Scope and authority, 6. Content dependencies, 8.1 Strictness, 8.2 Result type (+3 more)

### Community 163 - "engine-issue-9-quick-answers.spec.ts"
Cohesion: 0.22
Nodes (7): ConsoleWatch, enterSwitchFloorQuiz(), QuizState, savedQuiz(), watchAppConsole(), waitForLine(), watchConsole()

### Community 164 - "playwright"
Cohesion: 0.16
Nodes (6): ROOM_TITLES, contrastRatio(), CONTROL_ORDER, luminance(), parseColour(), playwright

### Community 165 - "Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?, Source Nodes

### Community 166 - "Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?, Source Nodes

### Community 167 - "Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?, Source Nodes

### Community 168 - "Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?, Source Nodes

### Community 169 - "Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?, Source Nodes

### Community 170 - "Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?, Source Nodes

### Community 171 - "Q: Do ordinary browser commands autosave the game state?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do ordinary browser commands autosave the game state?, Source Nodes

### Community 172 - "Q: Where does the area-entry life reset gate live and how can it be exercised in a browser?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the area-entry life reset gate live and how can it be exercised in a browser?, Source Nodes

### Community 173 - "Q: How to override the Playwright baseURL in a scratchpad config?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How to override the Playwright baseURL in a scratchpad config?, Source Nodes

### Community 174 - "Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?, Source Nodes

### Community 175 - "Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?, Source Nodes

### Community 176 - "Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?, Source Nodes

### Community 177 - "Q: Bypass check: does any source outside ScorePanel reimplement the per-area Score / Rooms visited sidebar lines?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bypass check: does any source outside ScorePanel reimplement the per-area Score / Rooms visited sidebar lines?, Source Nodes

### Community 178 - "Q: Which production node owns sidebar area-card rendering and how should it select the current area from GameViewData?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production node owns sidebar area-card rendering and how should it select the current area from GameViewData?, Source Nodes

### Community 179 - "Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?, Source Nodes

### Community 180 - "Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?, Source Nodes

### Community 181 - "Q: ENG11 browser QA: how should the W7 expectAreaConsistency helper assert sidebar state after the current-area-only change, and where does the headline score come from in a saved v1 DTO?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG11 browser QA: how should the W7 expectAreaConsistency helper assert sidebar state after the current-area-only change, and where does the headline score come from in a saved v1 DTO?, Source Nodes

### Community 182 - "Q: Which production nodes own the sidebar progress panel and how does ScorePanel.renderArea/refresh render area cards from GameViewData for ENG11?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production nodes own the sidebar progress panel and how does ScorePanel.renderArea/refresh render area cards from GameViewData for ENG11?, Source Nodes

### Community 183 - "Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?, Source Nodes

### Community 184 - "Q: Why does generated help text with newlines display as one dense paragraph in the transcript?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does generated help text with newlines display as one dense paragraph in the transcript?, Source Nodes

### Community 185 - "Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?, Source Nodes

### Community 186 - "Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?, Source Nodes

### Community 187 - "Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?, Source Nodes

### Community 188 - "Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?, Source Nodes

### Community 189 - "Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?, Source Nodes

### Community 190 - "Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?, Source Nodes

### Community 191 - "Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?, Source Nodes

### Community 192 - "Q: Does the W7 trace step's entry title precede the hazard message?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the W7 trace step's entry title precede the hazard message?, Source Nodes

### Community 193 - "Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?, Source Nodes

### Community 194 - "Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?, Source Nodes

### Community 195 - "Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel(), Source Nodes

### Community 196 - "Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?, Source Nodes

### Community 197 - "Q: Can the Playwright MCP browser drive the app in this session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this session?, Source Nodes

### Community 198 - "Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?, Source Nodes

### Community 199 - "Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?, Source Nodes

### Community 200 - "Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?, Source Nodes

### Community 201 - "Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?, Source Nodes

### Community 202 - "Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?, Source Nodes

### Community 203 - "Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?, Source Nodes

### Community 204 - "Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?, Source Nodes

### Community 205 - "Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?, Source Nodes

### Community 206 - "Q: Is there an existing owner for detail-suffix help rendering that detailSuffix() duplicates?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Is there an existing owner for detail-suffix help rendering that detailSuffix() duplicates?, Source Nodes

### Community 207 - "Q: Where is the canonical help copy generated and which node owns COMMAND_TABLE / helpText() for ask and answer syntax?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical help copy generated and which node owns COMMAND_TABLE / helpText() for ask and answer syntax?, Source Nodes

### Community 208 - "Q: Can the Playwright MCP browser drive the app in this session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this session?, Source Nodes

### Community 209 - "Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?, Source Nodes

### Community 210 - "Q: Where is the browser-rendered help copy generated and which nodes own the issue-9 ask/bare-answer forms?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the browser-rendered help copy generated and which nodes own the issue-9 ask/bare-answer forms?, Source Nodes

### Community 211 - "Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?, Source Nodes

### Community 212 - "Q: Which canonical node derives a puzzle's completion effect, and is there a duplicate derivation bypassing it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node derives a puzzle's completion effect, and is there a duplicate derivation bypassing it?, Source Nodes

### Community 213 - "Q: E2E-22-01: does a single puzzle solve still print the friendly completion line twice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: E2E-22-01: does a single puzzle solve still print the friendly completion line twice?, Source Nodes

### Community 214 - "Q: ENG28-ACTIVATION-01: which node canonically owns formatEvent transcript rendering and suppression of puzzle-activated, and is the effect/event pipeline unchanged?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG28-ACTIVATION-01: which node canonically owns formatEvent transcript rendering and suppression of puzzle-activated, and is the effect/event pipeline unchanged?, Source Nodes

### Community 215 - "Q: ENG28-ACTIVATION-01: which canonical node owns formatEvent transcript rendering for puzzle-activated, and is render-time suppression the only compliant change?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG28-ACTIVATION-01: which canonical node owns formatEvent transcript rendering for puzzle-activated, and is render-time suppression the only compliant change?, Source Nodes

### Community 216 - "Q: Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?, Source Nodes

### Community 217 - "Q: ENG28-ACTIVATION-01 which nodes own puzzle-activated suppression and the effect pipeline?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG28-ACTIVATION-01 which nodes own puzzle-activated suppression and the effect pipeline?, Source Nodes

### Community 218 - "QuizStateDto"
Cohesion: 0.25
Nodes (7): 1. Scope, 2. Model, 4. Commands and events, 5. Hints, Quiz combat, 5. Quiz attempts, QuizStateDto

### Community 219 - "Q: graphify section '6.1' — which document owns the event to view mapping?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: graphify section '6.1' — which document owns the event to view mapping?

### Community 220 - "Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?, Source Nodes

## Knowledge Gaps
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `OutputLog` (12× useful, score=11.910371374)
- `EffectApplier` (9× useful, score=8.875198471)
- `ContentBundle` (8× useful, score=7.818011268)
- `GameWindow` (6× useful, score=5.953126938) _(code changed — re-verify)_
- `renderArea()` (5× useful, score=4.980821576)
- `resolveGameCommand()` (5× useful, score=4.928246422)
- `TopicResolver` (5× useful, score=4.927938366)
- `PuzzleSystem` (4× useful, score=3.995305211)
- `renderTopic()` (4× useful, score=3.984463465)
- `ScoreTracker` (4× useful, score=3.912231466)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"
- "How to override the Playwright baseURL in a scratchpad config?" -> `playwright.config.ts`, `baseURL`
- "graphify section '6.1' — which document owns the event to view mapping?"
- "Can the Playwright MCP browser drive the app in this session?" -> `playwright.config.ts`, `helpers.ts`
- "Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?" -> `playwright.config.ts`, `helpers.ts`

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `GameState.ts`, `npcTopicOverlapPairCases.ts`, `persistence.ts`, `ui.ts`, `parser.ts`, `content.ts`, `turn.ts`, `mechanics.ts`, `AreaChangeLifeGate.test.ts`, `NpcGates.test.ts`, `contentToolchain.ts`, `validateContent.ts`, `GameEvent`, `npcTopicOverlap.ts`, `GameStateDto`, `ContentBundle`, `PuzzleSystem.test.ts`, `FakeRandom`, `package.json`, `devDependencies`, `npcs.ts`, `HelpOutput.test.ts`, `Favicon.test.ts`, `engine-issue-13-inventory.test.ts`, `adapt.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Should `GameState.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08350951374207188 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `GameState.ts`, `vitest`, `content/index.ts`, `persistence.ts`, `HintSystem.ts`, `SaveManager.ts`, `Random`, `ui.ts`, `parser.ts`, `content.ts`, `Game.ts`, `ScoreTracker.ts`, `turn.ts`, `Command`, `mechanics.ts`, `AreaChangeLifeGate.test.ts`, `GameWindow.ts`, `TopicSelection.ts`, `generate.ts`, `TopicPhrase.ts`, `NameResolver.ts`, `Content authoring rules`, `validateContent.ts`, `contentToolchain.ts`, `TurnContext`, `commandResolution.ts`, `GameStateDto`, `Effect`, `cli.ts`, `PuzzleSystem.test.ts`, `Game`, `npcs.ts`, `SaveActions`, `EffectApplier.ts`, `HelpOutput.test.ts`, `engine-issue-13-inventory.test.ts`, `adapt.ts`, `HazardSystem.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `GameEvent` to `GameState.ts`, `vitest`, `persistence.ts`, `HintSystem.ts`, `Random`, `ui.ts`, `Game.ts`, `ScoreTracker.ts`, `turn.ts`, `mechanics.ts`, `AreaChangeLifeGate.test.ts`, `GameWindow.ts`, `TurnContext`, `GameStateDto`, `Effect`, `ContentBundle`, `ConversationFlow.ts`, `AuthoredRun`, `Core`, `PuzzleSystem.test.ts`, `FakeRandom`, `Game`, `npcs.ts`, `SaveActions`, `EffectApplier.ts`, `engine-issue-13-inventory.test.ts`, `adapt.ts`, `HazardSystem.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._