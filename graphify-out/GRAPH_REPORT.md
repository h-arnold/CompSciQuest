# Graph Report - CompSciQuest-issue-30  (2026-11-26)

## Corpus Check
- 433 files · ~207,043 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 3031 nodes · 8090 edges · 235 communities (228 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 452 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3b23e346`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- GameState.ts
- npcTopicOverlap.ts
- w7-opening-walkthrough.spec.ts
- TopicSelection.ts
- helpers.ts
- content/index.ts
- Issues
- persistence.ts
- HintSystem.ts
- SaveManager.ts
- verbs/index.ts
- submit
- ui.ts
- NpcIntegration.test.ts
- content.ts
- zone1.ts
- stringList
- EffectApplier.ts
- topicOverlap.ts
- asText
- mechanics.ts
- compilerOptions
- GameViewData
- Storage schema
- generate.ts
- isActive
- ScoreTracker.ts
- contentToolchain.ts
- HANDOFF — CompSciQuest content + W6/W7 state
- 7.2 View data
- validateContent.ts
- AreaChangeLifeGate.test.ts
- engine-issue-30-passmark.spec.ts
- Documentation style guide
- commandResolution.ts
- GameWindow.ts
- scripts
- ContentBundle.ts
- PuzzleSystem.ts
- ConversationFlow.ts
- opencode.json
- AuthoredRun
- cli.ts
- vitest
- common.ts
- Game.ts
- adapt.ts
- GameState
- ContentBundle
- package.json
- devDependencies
- npcs.ts
- engine-issue-15-life-gate.spec.ts
- GameWindow
- deploy.yml
- asRecord
- eslint.config.js
- engine-issue-11.spec.ts
- parser.ts
- Favicon.test.ts
- engine-issue-13-inventory.test.ts
- Content authoring rules
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
- Random
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- node-shims.d.ts
- Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?
- SeededRandom
- Command
- 4. Design card format
- Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?
- Core
- Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?
- InteractionRules.ts
- Q: Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?
- Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?
- Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- Q: ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?
- Q: ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?
- ComposedReaction.ts
- engine-issue-28-activation.test.ts
- Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?
- Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?
- TopicResolver.test.ts
- AskTargetInference.test.ts
- w7-accessibility.spec.ts
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
- HelpOutput.test.ts
- Q: graphify section '6.1' — which document owns the event to view mapping?
- Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?
- zod
- tsconfig.json
- Parser.ts
- SpecTopic
- SaveActions
- Command.ts
- VerbHandlers.test.ts
- W7 non-quiz runtime handoff
- engine-issue-9-quick-answers.spec.ts
- CommandTable.ts
- 3. Rule catalogue
- Content toolchain
- Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?
- Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 117 edges
2. `vitest` - 107 edges
3. `GameEvent` - 101 edges
4. `GameState` - 82 edges
5. `asText()` - 62 edges
6. `finding()` - 58 edges
7. `Effect` - 54 edges
8. `Command` - 53 edges
9. `Random` - 47 edges
10. `FakeRandom` - 47 edges

## Surprising Connections (you probably didn't know these)
- `6.1 Event to view mapping` --references--> `GameViewData`  [INFERRED]
  docs/developer/application-and-ui.md → src/application/GameViewData.ts
- `7.1 DOM layout` --references--> `GameWindow`  [INFERRED]
  docs/developer/application-and-ui.md → src/ui/GameWindow.ts
- `8.2 Result type` --references--> `SaveControls`  [INFERRED]
  docs/developer/storage-schema.md → src/ui/SaveControls.ts
- `1. Purpose` --references--> `ContentBundle`  [INFERRED]
  docs/developer/content-toolchain.md → src/content/ContentBundle.ts
- `5. ID and alias registry` --references--> `NameResolver`  [INFERRED]
  docs/developer/content-rules.md → src/core/commands/NameResolver.ts

## Import Cycles
- None detected.

## Communities (235 total, 7 thin omitted)

### Community 0 - "GameState.ts"
Cohesion: 0.13
Nodes (15): 1. Scope, 2. Model, 5. Hints, Quiz combat, 2. Model, 5. Quiz attempts, createFromDto(), stateToDto() (+7 more)

### Community 1 - "npcTopicOverlap.ts"
Cohesion: 0.11
Nodes (68): gNpc06(), gNpc07(), gNpc08(), gNpc09(), gNpc10(), gNpc11(), gNpc12(), gNpc13() (+60 more)

### Community 2 - "w7-opening-walkthrough.spec.ts"
Cohesion: 0.16
Nodes (22): expectHazardOutcome(), hazardAnnouncement(), HazardStep, command(), enter(), expectEntry(), expectFlags(), expectOwners() (+14 more)

### Community 3 - "TopicSelection.ts"
Cohesion: 0.12
Nodes (29): AskTellMatch, collectMatches(), DeclaredObjectPhrase, findDeclaredObjectPhrase(), isAskTellMatch(), isBoundToActor(), isObjectName(), normalise() (+21 more)

### Community 4 - "helpers.ts"
Cohesion: 0.08
Nodes (26): boot(), openSession(), PROMISED, watchAppConsole(), authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME (+18 more)

### Community 5 - "content/index.ts"
Cohesion: 0.08
Nodes (20): area, START_POSITION, startRoom, ROOM_TITLES, SAVED_AT, repeatableHazard, ActorDefinition, AreaDefinition (+12 more)

### Community 6 - "Issues"
Cohesion: 0.04
Nodes (43): Batch E1 — Onboarding and intuitive commands (planning-led), Batch E2 — Engine fixes and removals (single implementation batch), Batches, Definition of done, Engine issues — batched hand-off, Issues in scope, Out of scope — deferred to the content session, Refinements applied (+35 more)

### Community 7 - "persistence.ts"
Cohesion: 0.09
Nodes (34): asRuntime(), envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, loadEffectApplier(), loadInitialState(), loadSaveManager() (+26 more)

### Community 8 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.13
Nodes (31): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+23 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.18
Nodes (22): examineInteraction(), isSceneryVisible(), describeRoom(), describeTarget(), examineHandler(), fixedMessage(), flagPrefix(), goHandler() (+14 more)

### Community 11 - "submit"
Cohesion: 0.11
Nodes (27): answerAndRead(), enterSwitchFloorQuiz(), command(), DEBUG_FRAGMENTS, liveSave(), command(), IMPLEMENTATION_PATTERNS, command() (+19 more)

### Community 12 - "ui.ts"
Cohesion: 0.06
Nodes (37): absentElement(), allText(), Bootstrap, BootstrapDependencies, descendants(), documentState, FakeDocument, FakeElement (+29 more)

### Community 13 - "NpcIntegration.test.ts"
Cohesion: 0.18
Nodes (23): ACTOR_ALIAS, ACTOR_ID, actorState(), FLAG_TOPIC_ID, LEARN_TOPIC_ID, npcBundle(), npcContext(), npcDto() (+15 more)

### Community 14 - "content.ts"
Cohesion: 0.10
Nodes (38): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+30 more)

### Community 15 - "zone1.ts"
Cohesion: 0.11
Nodes (31): acceptedCards(), generatedRoomIds(), zone1Cards(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES (+23 more)

### Community 16 - "stringList"
Cohesion: 0.30
Nodes (13): asObjectArray(), stringList(), checkPuzzle(), clueFindings(), cycleFindings(), dependencyFindings(), puzzleFindings(), AO_TAGS (+5 more)

### Community 17 - "EffectApplier.ts"
Cohesion: 0.17
Nodes (20): applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect(), applyStateEffect(), applySystemEffect(), areaChangeEvents(), EffectApplierDependencies (+12 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (34): asRecord(), ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf() (+26 more)

### Community 19 - "asText"
Cohesion: 0.15
Nodes (45): allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), collection(), finding(), idsOf() (+37 more)

### Community 20 - "mechanics.ts"
Cohesion: 0.09
Nodes (54): createEffectApplier(), puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, DOOR_FLAG (+46 more)

### Community 21 - "compilerOptions"
Cohesion: 0.08
Nodes (26): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+18 more)

### Community 22 - "GameViewData"
Cohesion: 0.12
Nodes (16): 4. Commands and events, 7. State, events and UI, AreaProgressView, ConversationView, GameViewData, HintView, QuizView, SpecTopicView (+8 more)

### Community 23 - "Storage schema"
Cohesion: 0.13
Nodes (14): 6.4 Save, load, download and import, 11. Flow, 12. Invariants the implementation must keep, 13. Out of scope, 1. Scope and authority, 2. Envelope, keys and file format, 3.1 Top-level DTO, 3.3 Invariants (+6 more)

### Community 24 - "generate.ts"
Cohesion: 0.18
Nodes (20): 5. Generation, CatalogueEmit, cleanEntry(), emitCatalogue(), indentJson(), stripAuthoring(), normalisedCards(), normaliseExit() (+12 more)

### Community 25 - "isActive"
Cohesion: 0.18
Nodes (11): 1. Scope, 2. Model, 3. Commands and topic resolution, 4. Conversation flow, 5. Conversation nodes, 6. Link to quiz combat, NPCs and conversation, 9. Content registration (+3 more)

### Community 26 - "ScoreTracker.ts"
Cohesion: 0.15
Nodes (21): areaPairForRoom(), areaPairForTopic(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, Announce, AreaPair, award() (+13 more)

### Community 27 - "contentToolchain.ts"
Cohesion: 0.05
Nodes (58): Data, gateFindings(), CardData, cleanParsedSet(), definition(), roomData(), PER_AREA_PATHS, cardsWithRefusalText() (+50 more)

### Community 28 - "HANDOFF — CompSciQuest content + W6/W7 state"
Cohesion: 0.11
Nodes (18): 10. Commit / push note, 1. One-paragraph summary, 2. Read these first (in order), 3. What is accepted (content, do not re-litigate), 4.1 Failure inventory, 4.2 The generated bundle is stale — verify this first, 4. Current verification state (measured 2026-11-26), 5. Ordered next steps (+10 more)

### Community 29 - "7.2 View data"
Cohesion: 0.33
Nodes (4): 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, Terminal

### Community 30 - "validateContent.ts"
Cohesion: 0.10
Nodes (32): 7.1 Free-text topic-overlap proof, 7. Structural validation gates, aliasProblems(), aliasProblemsOf(), asRecord(), budgetProblems(), catalogueIds(), coverageProblems() (+24 more)

### Community 31 - "AreaChangeLifeGate.test.ts"
Cohesion: 0.21
Nodes (8): catalogueOf(), areaOf(), BundleOptions, gatedBundle(), gatedState(), roomOf(), StateOptions, TopicIndexEntry

### Community 32 - "engine-issue-30-passmark.spec.ts"
Cohesion: 0.11
Nodes (19): AuthoredQuestion, DisplayedQuestion, displayedQuestion(), numberedOptions(), switchyard, switchyardQuestions, AuthoredQuestion, authoredQuestion() (+11 more)

### Community 33 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 34 - "commandResolution.ts"
Cohesion: 0.15
Nodes (24): actorAndRemainder(), answerCommand(), bareAnswerCommand(), conversationCommand(), DIRECTION_BY_TOKEN, directionCommand(), fallbackPair(), inferAskActor() (+16 more)

### Community 36 - "GameWindow.ts"
Cohesion: 0.09
Nodes (15): 7. Core contracts, QuarantineDto, LoadFailureReason, LoadResult, SaveDto, GameStateDto, loadFailureMessage(), MESSAGES (+7 more)

### Community 37 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 38 - "ContentBundle.ts"
Cohesion: 0.11
Nodes (29): 1. Purpose and authority, 3.1 Catalogue shape, 4.3 NPC card, 1. Scope, 1. Purpose, 3.2 Entity and system state, ExitDefinition, ItemDefinition (+21 more)

### Community 39 - "PuzzleSystem.ts"
Cohesion: 0.29
Nodes (9): FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient(), isPossessionOnly(), markFired(), reactionFor(), shouldSkip(), solveEffects() (+1 more)

### Community 40 - "ConversationFlow.ts"
Cohesion: 0.18
Nodes (26): activeNode(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode(), fallBackAfterOnce() (+18 more)

### Community 41 - "opencode.json"
Cohesion: 0.12
Nodes (16): command, type, default_agent, experimental, subagent_depth, command, type, mcp (+8 more)

### Community 42 - "AuthoredRun"
Cohesion: 0.20
Nodes (3): AuthoredRun, gateFlag(), lastQuestion()

### Community 43 - "cli.ts"
Cohesion: 0.08
Nodes (31): 3. Scaffolds, CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards() (+23 more)

### Community 44 - "vitest"
Cohesion: 0.07
Nodes (49): vitest, RoomSummary, finishWithWrongAnswers(), questionFor(), wrongAnswer(), activeQuiz(), answerCorrectly(), quizDispatch() (+41 more)

### Community 45 - "common.ts"
Cohesion: 0.17
Nodes (21): Finding, ParsedCardSet, asNumber(), CardEntry, EFFECT_KINDS, checkHazard(), effectFindings(), scheduleFindings() (+13 more)

### Community 46 - "Game.ts"
Cohesion: 0.13
Nodes (17): ComposedReaction, createComposedReaction(), adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), recordSeed(), MetaAction (+9 more)

### Community 47 - "adapt.ts"
Cohesion: 0.23
Nodes (14): bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings(), text() (+6 more)

### Community 48 - "GameState"
Cohesion: 0.11
Nodes (20): actorKeywordTopic(), createTopicResolver(), hasKeyword(), isBoundToActor(), TopicResolver, GameState, RuntimeGameState, ConversationNode (+12 more)

### Community 49 - "ContentBundle"
Cohesion: 0.05
Nodes (53): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Behavioural guarantees, 2. Boot, title screen and session start, 3.2 World, area, room and item definitions, 3.3 Loading and validation, 3. Content bundle and registration, 4.1 Meta actions (+45 more)

### Community 50 - "package.json"
Cohesion: 0.17
Nodes (11): description, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, yaml@^2.9.1, name, private, type, version (+3 more)

### Community 51 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint@^10.15.0, playwright@1.65.1, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, typescript-7@npm:typescript@^7.0.2, vite@^8.3.8, vitest@^5.1.1 (+5 more)

### Community 52 - "npcs.ts"
Cohesion: 0.10
Nodes (23): TurnContract, always, askRing, byeCommand, ConditionEvaluatorCondition, CountingRandom, DEFAULT_REPLY, DialogueSystemContract (+15 more)

### Community 53 - "engine-issue-15-life-gate.spec.ts"
Cohesion: 0.16
Nodes (12): command(), continueFrom(), firstId(), GATE_IDS, gateIds(), GateOverrides, savedState(), SaveState (+4 more)

### Community 54 - "GameWindow"
Cohesion: 0.15
Nodes (12): Persistence and UI, 6. Events and UI, Batch E1 — onboarding and intuitive commands, Batch E2 — engine fixes and removals, Decisions settled with the user, formatEvent(), topicLabel(), GameWindow (+4 more)

### Community 55 - "deploy.yml"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 56 - "asRecord"
Cohesion: 0.17
Nodes (14): CardSet, ParseResult, asArray(), AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape (+6 more)

### Community 57 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 58 - "engine-issue-11.spec.ts"
Cohesion: 0.21
Nodes (7): areaHeaders(), authoredArea(), expectCurrentCard(), headerFor(), panelLines(), PROGRESS, TOTAL_SCORE

### Community 59 - "parser.ts"
Cohesion: 0.16
Nodes (13): ParsedCommand, CHEST_ID, KEY_A, KEY_B, loadNameResolver(), loadParser(), loadTokenizer(), ParserLike (+5 more)

### Community 60 - "Favicon.test.ts"
Cohesion: 0.24
Nodes (5): attributes(), FAVICON_PATH, iconLinks(), INDEX_PATH, linkElements()

### Community 61 - "engine-issue-13-inventory.test.ts"
Cohesion: 0.33
Nodes (8): getCommandHandler, bundleWithItems(), CARTRIDGE, handlerFor(), inventoryReply(), LAMP, messagesOf(), stateSnapshot()

### Community 62 - "Content authoring rules"
Cohesion: 0.17
Nodes (12): 1. Purpose and authority, 2. Workflow gates, 5. ID and alias registry, 6.1 Content critic, 6.2 PCK reviewer, 6. Reviewer rubrics, 8. Fixed contracts content must use, 9.1 Shared definition of done (+4 more)

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
Cohesion: 0.19
Nodes (15): EffectApplier, FiredThisTurn, HazardSystemDependencies, isInitialRoom(), isTriggerMatched(), HintSystemDependencies, NpcDependencies, PuzzleSystemDependencies (+7 more)

### Community 140 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Where is P-TAKE-01 takeHandler and what governs portable items?

### Community 141 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Find a document heading node named Room entry text

### Community 143 - "Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?, Source Nodes

### Community 146 - "Command"
Cohesion: 0.08
Nodes (26): 5.1 Door and container verbs, 5.2 Verb table and handler signature, 5. Canonical command union and verbs, 3. Flow, 10. Determinism and ordering rules, 2. Turn pipeline, 4. Trigger, 5. Effect and EffectApplier (+18 more)

### Community 147 - "4. Design card format"
Cohesion: 0.29
Nodes (7): 4.1 Common conventions, 4.2 Area and rooms card, 4.4 Quiz card, 4.5 Puzzle card, 4.6 Hazard card, 4.7 Hint card, 4. Design card format

### Community 148 - "Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?, Source Nodes

### Community 149 - "Core"
Cohesion: 0.18
Nodes (13): Core, 11. Invariants the implementation must keep, 3. Condition, 7. Restore-time derivation, AreaProgress, Exit, Room, Precondition (+5 more)

### Community 150 - "Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?, Source Nodes

### Community 151 - "InteractionRules.ts"
Cohesion: 0.13
Nodes (18): describeScenery(), flagEffects(), FlagInteraction, hasMatchingName(), matchingInteraction(), normalise(), PUT_INTERACTIONS, putInteraction() (+10 more)

### Community 152 - "Q: Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?, Source Nodes

### Community 153 - "Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?, Source Nodes

### Community 154 - "Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?, Source Nodes

### Community 155 - "Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?, Source Nodes

### Community 156 - "Q: ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?, Source Nodes

### Community 157 - "Q: ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?, Source Nodes

### Community 158 - "ComposedReaction.ts"
Cohesion: 0.10
Nodes (27): 8. Behavioural signatures, 2. Model, 3. Execution, 4. Failure consequences, 5. Content, Hazards, 1. Scope, 2. Model (+19 more)

### Community 159 - "engine-issue-28-activation.test.ts"
Cohesion: 0.06
Nodes (29): GameEvent, AuthoredGameFixture, EffectApplierLike, RecordingBus, EventBusFactory, FormatEventFunction, loadFormatEvent(), MemoryBus (+21 more)

### Community 160 - "Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?, Source Nodes

### Community 161 - "Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?, Source Nodes

### Community 162 - "TopicResolver.test.ts"
Cohesion: 0.15
Nodes (10): defaultTopic(), eventTypes(), node(), NODE_ID, topic(), WHY_TOPIC_ID, whySpecialTopic(), decoy() (+2 more)

### Community 163 - "AskTargetInference.test.ts"
Cohesion: 0.16
Nodes (16): makeParserBundle(), makeParserStateDto(), makePutFixture(), START_ROOM, catalogueOf(), AskFixture, askFixture(), GameCommandResolver (+8 more)

### Community 164 - "w7-accessibility.spec.ts"
Cohesion: 0.47
Nodes (4): contrastRatio(), CONTROL_ORDER, luminance(), parseColour()

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

### Community 218 - "HelpOutput.test.ts"
Cohesion: 0.20
Nodes (13): CommandSpec, CommandTableModule, DirectionSpec, hasCommandToken(), loadCommandTable(), loadVerbTable(), CANONICAL_COMMANDS, CANONICAL_DIRECTIONS (+5 more)

### Community 219 - "Q: graphify section '6.1' — which document owns the event to view mapping?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: graphify section '6.1' — which document owns the event to view mapping?

### Community 220 - "Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?, Source Nodes

### Community 223 - "Parser.ts"
Cohesion: 0.20
Nodes (12): DIRECTION_NAMES, DIRECTION_SHORTCUTS, DIRECTION_TOKENS, HYPHENATED_VERBS, hyphenatedVerb(), isDirection(), isPunctuationAlias(), MULTIWORD_ALIASES (+4 more)

### Community 224 - "SpecTopic"
Cohesion: 0.22
Nodes (8): 6.1 Bootstrap (`src/main.ts`), 6.2 One command turn, 6.3 Room entry, score and spec-topic mapping, 6.5 Losing a life and winning, 6. Key flows, 2. Authoring format, SpecTopic, SpecTopicCatalogue

### Community 225 - "SaveActions"
Cohesion: 0.29
Nodes (3): 9. Quarantine, SaveActions, SaveControls

### Community 226 - "Command.ts"
Cohesion: 0.23
Nodes (7): loadSeam(), loadResolver(), activeQuizState(), GameCommandResolver, loadResolver(), OPTIONS, GameCommandResolver

### Community 227 - "VerbHandlers.test.ts"
Cohesion: 0.26
Nodes (9): DOOR_ID, makeParserState(), makeTurnContext(), alreadyOpenState(), bareState(), FlagPrefix, permissiveState(), portabilityState() (+1 more)

### Community 228 - "W7 non-quiz runtime handoff"
Cohesion: 0.17
Nodes (11): Constraints and pitfalls, Critical rebase requirement, Definition of done, Final red contracts already in main, Integration workspace, Interrupted agents, Main workspace, Objective (+3 more)

### Community 229 - "engine-issue-9-quick-answers.spec.ts"
Cohesion: 0.24
Nodes (4): ConsoleWatch, QuizState, conversationTopics, nodes

### Community 230 - "CommandTable.ts"
Cohesion: 0.32
Nodes (7): aliasSuffix(), COMMAND_TABLE, CommandSpec, detailSuffix(), DIRECTIONS, DirectionSpec, helpText()

### Community 231 - "3. Rule catalogue"
Cohesion: 0.29
Nodes (7): 3. Rule catalogue, C — Conversation and NPCs, D — Data and cards, H — Hazards and hints, N — Narrative, P — Pedagogy and course mapping, V — Validation

### Community 232 - "Content toolchain"
Cohesion: 0.40
Nodes (5): 1. Purpose, 4. Validation, 6. Ownership, 7. Coverage-graph extraction, Content toolchain

### Community 233 - "Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?, Source Nodes

### Community 234 - "Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?, Source Nodes

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `OutputLog` (12× useful, score=11.900217547)
- `EffectApplier` (9× useful, score=8.867632188)
- `ContentBundle` (8× useful, score=7.811346259)
- `renderArea()` (5× useful, score=4.976575327)
- `GameWindow` (5× useful, score=4.94893571)
- `resolveGameCommand()` (5× useful, score=4.924044995)
- `TopicResolver` (5× useful, score=4.923737201)
- `PuzzleSystem` (4× useful, score=3.991899135)
- `renderTopic()` (4× useful, score=3.981066631)
- `ScoreTracker` (4× useful, score=3.908896211)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"
- "How to override the Playwright baseURL in a scratchpad config?" -> `playwright.config.ts`, `baseURL`
- "graphify section '6.1' — which document owns the event to view mapping?"
- "Can the Playwright MCP browser drive the app in this session?" -> `playwright.config.ts`, `helpers.ts`
- "Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?" -> `playwright.config.ts`, `helpers.ts`

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `npcTopicOverlap.ts`, `persistence.ts`, `ui.ts`, `NpcIntegration.test.ts`, `content.ts`, `zone1.ts`, `mechanics.ts`, `ScoreTracker.ts`, `contentToolchain.ts`, `validateContent.ts`, `engine-issue-28-activation.test.ts`, `AreaChangeLifeGate.test.ts`, `TopicResolver.test.ts`, `AskTargetInference.test.ts`, `GameWindow.ts`, `GameState`, `package.json`, `devDependencies`, `npcs.ts`, `parser.ts`, `Favicon.test.ts`, `engine-issue-13-inventory.test.ts`, `HelpOutput.test.ts`, `Command.ts`, `VerbHandlers.test.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Should `GameState.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `GameState.ts`, `TopicSelection.ts`, `content/index.ts`, `persistence.ts`, `HintSystem.ts`, `SaveManager.ts`, `Random`, `ui.ts`, `NpcIntegration.test.ts`, `content.ts`, `zone1.ts`, `EffectApplier.ts`, `Command`, `mechanics.ts`, `InteractionRules.ts`, `generate.ts`, `isActive`, `ScoreTracker.ts`, `validateContent.ts`, `ComposedReaction.ts`, `AreaChangeLifeGate.test.ts`, `engine-issue-28-activation.test.ts`, `commandResolution.ts`, `AskTargetInference.test.ts`, `GameWindow.ts`, `ContentBundle.ts`, `PuzzleSystem.ts`, `vitest`, `Game.ts`, `adapt.ts`, `GameState`, `npcs.ts`, `GameWindow`, `parser.ts`, `engine-issue-13-inventory.test.ts`, `Content authoring rules`, `SpecTopic`, `Command.ts`, `VerbHandlers.test.ts`, `Content toolchain`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `npcTopicOverlap.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10692541856925418 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `engine-issue-28-activation.test.ts` to `persistence.ts`, `HintSystem.ts`, `SaveManager.ts`, `Random`, `ui.ts`, `NpcIntegration.test.ts`, `EffectApplier.ts`, `mechanics.ts`, `Core`, `ScoreTracker.ts`, `ComposedReaction.ts`, `AreaChangeLifeGate.test.ts`, `TopicResolver.test.ts`, `GameWindow.ts`, `ContentBundle.ts`, `PuzzleSystem.ts`, `ConversationFlow.ts`, `AuthoredRun`, `vitest`, `Game.ts`, `GameState`, `ContentBundle`, `npcs.ts`, `GameWindow`, `parser.ts`, `engine-issue-13-inventory.test.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._