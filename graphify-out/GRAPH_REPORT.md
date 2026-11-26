# Graph Report - CompSciQuest-issue-9  (2026-11-26)

## Corpus Check
- 363 files · ~185,146 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 2643 nodes · 7401 edges · 185 communities (176 shown, 9 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 448 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65e392bd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Issues
- npcTopicOverlap.ts
- GameWindow.ts
- commandResolution.ts
- w7-opening-walkthrough.spec.ts
- content/index.ts
- SeededRandom
- common.ts
- ui.ts
- SaveManager.ts
- verbs/index.ts
- Effect
- GameState
- parser.ts
- persistence.ts
- content.ts
- NpcGates.test.ts
- cli.ts
- topicOverlap.ts
- collection
- PuzzleSystem.test.ts
- compilerOptions
- ScoreTracker.ts
- ConversationFlow.ts
- GameEvent
- GameState.ts
- mechanics.ts
- zone1.ts
- FakeElement
- contentToolchain.ts
- Content authoring rules
- ContentBundle
- HazardSystem.ts
- Documentation style guide
- Parser.ts
- Game
- domain.ts
- scripts
- adapt.ts
- area-progress.test.ts
- opencode.json
- HintSystem
- content/schema.ts
- validateContent.ts
- validate.ts
- NpcTypes.test.ts
- authored.ts
- Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?
- main.ts
- package.json
- devDependencies
- npcs.ts
- Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?
- Storage schema
- deploy.yml
- EffectApplier.ts
- eslint.config.js
- Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?
- Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?
- CommandTable.test.ts
- Game.ts
- Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?
- helpers.ts
- Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?
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
- Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- node-shims.d.ts
- W7 non-quiz runtime handoff
- TopicSelection.ts
- ScoreTracker
- scenery-validation.test.ts
- tsconfig.json
- LoadResult
- vite@^8.3.8
- 3. Rule catalogue
- meta-and-endstates.spec.ts
- Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?
- Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- HANDOFF — CompSciQuest content + W6/W7 state
- Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?
- Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?
- Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?
- Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?
- FakeRandom
- Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?
- Q: Why does generated help text with newlines display as one dense paragraph in the transcript?
- Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?
- Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?
- Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?
- hint.ts
- playwright
- HintSystem.ts
- Shared rule spine
- engine-issue-9-quick-answers.spec.ts
- 6. Key flows
- vitest
- CommandTable.ts
- MemoryContentIo
- PuzzleGraph.ts
- MemoryStorage
- Puzzles
- Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?
- Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?
- Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?
- Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?
- Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?
- ValidationModule

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 114 edges
2. `vitest` - 95 edges
3. `GameEvent` - 92 edges
4. `GameState` - 80 edges
5. `asText()` - 62 edges
6. `finding()` - 58 edges
7. `Effect` - 52 edges
8. `Command` - 52 edges
9. `Random` - 47 edges
10. `FakeRandom` - 42 edges

## Surprising Connections (you probably didn't know these)
- `1. Scope` --references--> `ConversationNode`  [INFERRED]
  docs/developer/combat.md → src/core/npcs/ConversationNode.ts
- `Batch E1 — onboarding and intuitive commands` --references--> `TitleScreen`  [INFERRED]
  ENGINE_ISSUES.md → src/ui/TitleScreen.ts
- `6. Integration points` --references--> `Command`  [INFERRED]
  docs/developer/puzzles.md → src/core/commands/Command.ts
- `4. Trigger` --references--> `Command`  [INFERRED]
  docs/developer/shared-rules.md → src/core/commands/Command.ts
- `6.5 Losing a life and winning` --references--> `Session`  [INFERRED]
  docs/developer/architecture.md → src/core/lifecycle/Session.ts

## Import Cycles
- None detected.

## Communities (185 total, 9 thin omitted)

### Community 0 - "Issues"
Cohesion: 0.04
Nodes (46): Batch E1 — onboarding and intuitive commands, Batch E1 — Onboarding and intuitive commands (planning-led), Batch E2 — engine fixes and removals, Batch E2 — Engine fixes and removals (single implementation batch), Batches, Decisions settled with the user, Definition of done, Engine issues — batched hand-off (+38 more)

### Community 1 - "npcTopicOverlap.ts"
Cohesion: 0.11
Nodes (67): gNpc06(), gNpc07(), gNpc08(), gNpc09(), gNpc10(), gNpc11(), gNpc12(), gNpc13() (+59 more)

### Community 2 - "GameWindow.ts"
Cohesion: 0.09
Nodes (20): 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, Persistence and UI, 6. Events and UI, 7. State, events and UI, GameViewData, appendLine() (+12 more)

### Community 3 - "commandResolution.ts"
Cohesion: 0.15
Nodes (24): actorAndRemainder(), answerCommand(), bareAnswerCommand(), conversationCommand(), DIRECTION_BY_TOKEN, directionCommand(), fallbackPair(), inferAskActor() (+16 more)

### Community 4 - "w7-opening-walkthrough.spec.ts"
Cohesion: 0.14
Nodes (23): command(), contrastRatio(), CONTROL_ORDER, enter(), expectEntry(), expectFlag(), expectOwners(), expectPosition() (+15 more)

### Community 5 - "content/index.ts"
Cohesion: 0.11
Nodes (17): area, START_POSITION, startRoom, repeatableHazard, AreaDefinition, actors, areas, conversationTopics (+9 more)

### Community 7 - "common.ts"
Cohesion: 0.22
Nodes (16): 5. Generation, allEffects(), asArray(), asObjectArray(), authoringOf(), DIRECTIONS, effectList(), entriesWith() (+8 more)

### Community 8 - "ui.ts"
Cohesion: 0.14
Nodes (27): allText(), Bootstrap, BootstrapDependencies, descendants(), documentState, FakeBus, FakeEvent, FakeKeyboardEvent (+19 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.15
Nodes (30): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+22 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.11
Nodes (35): describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible(), matchingInteraction(), normalise() (+27 more)

### Community 11 - "Effect"
Cohesion: 0.16
Nodes (16): 1. Purpose and authority, 7. Core contracts, 1. Scope, 1. Purpose, 3.2 Entity and system state, hints, puzzles, Effect (+8 more)

### Community 12 - "GameState"
Cohesion: 0.11
Nodes (26): 4.1 Meta actions, 4. Game façade and meta actions, 5.1 Door and container verbs, 5.2 Verb table and handler signature, 5. Canonical command union and verbs, Command, CommandHandler, hasItem() (+18 more)

### Community 13 - "parser.ts"
Cohesion: 0.07
Nodes (42): loadDialogueSystemFactory(), loadTopicResolverFactory(), CHEST_ID, DOOR_ID, KEY_A, KEY_B, loadNameResolver(), loadParser() (+34 more)

### Community 14 - "persistence.ts"
Cohesion: 0.10
Nodes (30): asRuntime(), EffectApplierDependencies, EffectApplierLike, envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, loadEffectApplier() (+22 more)

### Community 15 - "content.ts"
Cohesion: 0.14
Nodes (31): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+23 more)

### Community 16 - "NpcGates.test.ts"
Cohesion: 0.19
Nodes (11): gateFindings(), actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData() (+3 more)

### Community 17 - "cli.ts"
Cohesion: 0.06
Nodes (50): 1. Purpose, 3. Scaffolds, 4. Validation, 6. Ownership, 7. Coverage-graph extraction, Content toolchain, CONTENT_ROOT, COVERAGE_PATH (+42 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (33): ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf(), DataRecord (+25 more)

### Community 19 - "collection"
Cohesion: 0.15
Nodes (43): areaLikes(), asText(), auditedAreaLikes(), collection(), coverageIds(), EFFECT_KINDS, finding(), idsOf() (+35 more)

### Community 20 - "PuzzleSystem.test.ts"
Cohesion: 0.17
Nodes (18): puzzleDefinition(), DOOR_FLAG, eventTypes(), hazard(), mechanicsBundle(), mechanicsState(), NORTH_ROOM, puzzle() (+10 more)

### Community 21 - "compilerOptions"
Cohesion: 0.08
Nodes (26): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+18 more)

### Community 22 - "ScoreTracker.ts"
Cohesion: 0.15
Nodes (21): areaPairForRoom(), areaPairForTopic(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, Announce, AreaPair, award() (+13 more)

### Community 23 - "ConversationFlow.ts"
Cohesion: 0.16
Nodes (26): MultiwordAlias, activeNode(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode() (+18 more)

### Community 24 - "GameEvent"
Cohesion: 0.09
Nodes (11): 6.1 Event to view mapping, 6. Canonical event union and rendering, 7. Restore-time derivation, GameEvent, AuthoredGameFixture, RecordingBus, MemoryBus, AuthoredRun (+3 more)

### Community 25 - "GameState.ts"
Cohesion: 0.11
Nodes (16): 2. Model, 1. Scope, 2. Model, 3. Commands and topic resolution, 4. Conversation flow, 5. Conversation nodes, 6. Link to quiz combat, NPCs and conversation (+8 more)

### Community 26 - "mechanics.ts"
Cohesion: 0.11
Nodes (23): ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, FIXED_TURN, HAZARD_ID, HazardSystemFactory, loadComposedReactionFactory() (+15 more)

### Community 27 - "zone1.ts"
Cohesion: 0.13
Nodes (26): acceptedCards(), generatedRoomIds(), zone1Cards(), zone1Cards(), zone1Generation(), ParsedCardSet, ValidationOptions, acceptedEmittedDates() (+18 more)

### Community 28 - "FakeElement"
Cohesion: 0.08
Nodes (10): absentElement(), FakeDocument, FakeElement, findButton(), hasMatchingAncestors(), isTokenMatch(), makeFakeDocument(), press() (+2 more)

### Community 29 - "contentToolchain.ts"
Cohesion: 0.07
Nodes (38): Data, CardData, cleanParsedSet(), definition(), roomData(), PER_AREA_PATHS, npcCards(), topicsCard() (+30 more)

### Community 30 - "Content authoring rules"
Cohesion: 0.11
Nodes (18): 1. Purpose and authority, 2. Workflow gates, 4.1 Common conventions, 4.2 Area and rooms card, 4.4 Quiz card, 4.5 Puzzle card, 4.6 Hazard card, 4.7 Hint card (+10 more)

### Community 31 - "ContentBundle"
Cohesion: 0.13
Nodes (15): ActorDefinition, actorStates, questions, quizzes, Catalogue, ContentBundle, Quiz, QuizQuestion (+7 more)

### Community 32 - "HazardSystem.ts"
Cohesion: 0.09
Nodes (27): 8. Behavioural signatures, 3. Execution, 4. Failure consequences, 5. Content, Hazards, 3. Completion detection, 4. Counters and stuckness, ComposedReaction (+19 more)

### Community 33 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 34 - "Parser.ts"
Cohesion: 0.20
Nodes (12): DIRECTION_NAMES, DIRECTION_SHORTCUTS, DIRECTION_TOKENS, HYPHENATED_VERBS, hyphenatedVerb(), isDirection(), isPunctuationAlias(), MULTIWORD_ALIASES (+4 more)

### Community 35 - "Game"
Cohesion: 0.19
Nodes (3): Game, loadFailureMessage(), MESSAGES

### Community 36 - "domain.ts"
Cohesion: 0.19
Nodes (13): 6.3 Room entry, score and spec-topic mapping, Core, 11. Invariants the implementation must keep, 3. Condition, AreaProgress, Exit, Room, Precondition (+5 more)

### Community 37 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 38 - "adapt.ts"
Cohesion: 0.27
Nodes (8): catalogueOf(), bundleOf(), isTrue(), number(), numbers(), strings(), text(), unpack()

### Community 39 - "area-progress.test.ts"
Cohesion: 0.28
Nodes (6): 3.1 Catalogue shape, 2. Authoring format, SpecTopic, SpecTopicCatalogue, areaBundle(), room()

### Community 41 - "opencode.json"
Cohesion: 0.12
Nodes (16): command, type, default_agent, experimental, subagent_depth, command, type, mcp (+8 more)

### Community 42 - "HintSystem"
Cohesion: 0.39
Nodes (7): 1. Scope, 2. Model, 3. Commands and delivery, 4. Adaptive behaviour, 5. Score interaction, Hints, HintSystem

### Community 43 - "content/schema.ts"
Cohesion: 0.24
Nodes (15): CardSet, ParseResult, asRecord(), AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape (+7 more)

### Community 44 - "validateContent.ts"
Cohesion: 0.11
Nodes (28): 7. Structural validation gates, aliasProblems(), aliasProblemsOf(), asRecord(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES (+20 more)

### Community 45 - "validate.ts"
Cohesion: 0.19
Nodes (20): gateOf(), sharedFindings(), Finding, ParsedCardSet, stringList(), checkPuzzle(), clueFindings(), cycleFindings() (+12 more)

### Community 46 - "NpcTypes.test.ts"
Cohesion: 0.14
Nodes (22): 4.3 NPC card, actorKeywordTopic(), createTopicResolver(), hasKeyword(), isBoundToActor(), TopicResolver, ConversationNode, ConversationTopic (+14 more)

### Community 47 - "authored.ts"
Cohesion: 0.07
Nodes (51): createQuizSystem(), RoomSummary, formatEvent(), label(), topicLabel(), finishWithWrongAnswers(), questionFor(), wrongAnswer() (+43 more)

### Community 48 - "Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?, Source Nodes

### Community 49 - "main.ts"
Cohesion: 0.09
Nodes (40): 2. Boot, title screen and session start, 10. Out of scope, 1. Scope and goals, 2. Design principles, 3. Layers and dependency direction, 4. Source layout, 5. Module responsibilities, 8. Conventions (+32 more)

### Community 50 - "package.json"
Cohesion: 0.17
Nodes (11): description, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, zod@^4.6.7, name, private, type, version (+3 more)

### Community 51 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@^10.15.0, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, typescript-7@npm:typescript@^7.0.2, vitest@^5.1.1, yaml@^2.9.1, eslint (+4 more)

### Community 52 - "npcs.ts"
Cohesion: 0.07
Nodes (58): ACTOR_ALIAS, ACTOR_ID, actorState(), always, askRing, byeCommand, ConditionEvaluatorCondition, CountingRandom (+50 more)

### Community 53 - "Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?, Source Nodes

### Community 54 - "Storage schema"
Cohesion: 0.14
Nodes (12): 11. Flow, 12. Invariants the implementation must keep, 13. Out of scope, 1. Scope and authority, 6. Content dependencies, 8.1 Strictness, 8.2 Result type, 8. Validation contract (+4 more)

### Community 55 - "deploy.yml"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 56 - "EffectApplier.ts"
Cohesion: 0.10
Nodes (29): 2. Model, 2. Model, 5. Quiz attempts, Parallel execution, quizView(), applyBookkeepingEffect(), applyEffect(), applyEntityEffect() (+21 more)

### Community 57 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 58 - "Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?, Source Nodes

### Community 59 - "Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?, Source Nodes

### Community 60 - "CommandTable.test.ts"
Cohesion: 0.19
Nodes (14): CommandSpec, CommandTableModule, DirectionSpec, hasCommandToken(), loadCommandTable(), loadVerbTable(), makeTurnContext(), CANONICAL_COMMANDS (+6 more)

### Community 61 - "Game.ts"
Cohesion: 0.10
Nodes (24): adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), recordSeed(), AreaProgressView, ConversationView, HintView (+16 more)

### Community 62 - "Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?, Source Nodes

### Community 63 - "helpers.ts"
Cohesion: 0.12
Nodes (15): authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME, makeQuarantine(), makeSave(), makeState(), QUARANTINE_DOWNLOAD_NAME (+7 more)

### Community 64 - "Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?, Source Nodes

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

### Community 139 - "Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?, Source Nodes

### Community 140 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Where is P-TAKE-01 takeHandler and what governs portable items?

### Community 141 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Find a document heading node named Room entry text

### Community 143 - "W7 non-quiz runtime handoff"
Cohesion: 0.17
Nodes (11): Constraints and pitfalls, Critical rebase requirement, Definition of done, Final red contracts already in main, Integration workspace, Interrupted agents, Main workspace, Objective (+3 more)

### Community 144 - "TopicSelection.ts"
Cohesion: 0.15
Nodes (24): 7.1 Free-text topic-overlap proof, resolveScenery(), createNameResolver(), AskTellMatch, chooseCandidate(), exactDeclaredTopic(), findDefaultTopic(), GiveShowMatch (+16 more)

### Community 146 - "ScoreTracker"
Cohesion: 0.12
Nodes (20): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Behavioural guarantees, 3.2 World, area, room and item definitions, 3.3 Loading and validation, 3. Content bundle and registration, 9. Effect to event mapping, Application and UI contracts (+12 more)

### Community 147 - "scenery-validation.test.ts"
Cohesion: 0.13
Nodes (17): cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), CardSet, cardText(), conformingCardSet(), ParseResult (+9 more)

### Community 149 - "LoadResult"
Cohesion: 0.09
Nodes (10): QuarantineDto, LoadFailureReason, LoadResult, SaveDto, GameStateDto, RuntimeGameState, RecordingGame, RecordingGameOptions (+2 more)

### Community 151 - "3. Rule catalogue"
Cohesion: 0.21
Nodes (10): 3. Rule catalogue, C — Conversation and NPCs, D — Data and cards, H — Hazards and hints, N — Narrative, P — Pedagogy and course mapping, V — Validation, rooms (+2 more)

### Community 152 - "meta-and-endstates.spec.ts"
Cohesion: 0.18
Nodes (14): savedQuiz(), expectWorkspace(), readStorage(), SAVE_KEY, scorePanel(), startNewGame(), submit(), transcript() (+6 more)

### Community 153 - "Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?, Source Nodes

### Community 154 - "Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?, Source Nodes

### Community 155 - "Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?, Source Nodes

### Community 156 - "HANDOFF — CompSciQuest content + W6/W7 state"
Cohesion: 0.11
Nodes (18): 10. Commit / push note, 1. One-paragraph summary, 2. Read these first (in order), 3. What is accepted (content, do not re-litigate), 4.1 Failure inventory, 4.2 The generated bundle is stale — verify this first, 4. Current verification state (measured 2026-11-26), 5. Ordered next steps (+10 more)

### Community 157 - "Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?, Source Nodes

### Community 158 - "Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?, Source Nodes

### Community 159 - "Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?, Source Nodes

### Community 160 - "Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?, Source Nodes

### Community 161 - "FakeRandom"
Cohesion: 0.23
Nodes (14): createEffectApplier(), applierFor(), loadConditionEvaluatorFactory(), loadHazardSystemFactory(), dialogueSystemFor(), resolverFor(), FakeRandom, hazardsFor() (+6 more)

### Community 162 - "Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?, Source Nodes

### Community 163 - "Q: Why does generated help text with newlines display as one dense paragraph in the transcript?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does generated help text with newlines display as one dense paragraph in the transcript?, Source Nodes

### Community 164 - "Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?, Source Nodes

### Community 165 - "Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?, Source Nodes

### Community 166 - "Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?, Source Nodes

### Community 167 - "hint.ts"
Cohesion: 0.23
Nodes (14): asNumber(), CardEntry, checkHint(), ladderFindings(), levelFindings(), penaltyFindings(), targetFindings(), UNLOCK_PREFIXES (+6 more)

### Community 168 - "playwright"
Cohesion: 0.18
Nodes (8): boot(), openSession(), PROMISED, seedStorage(), START_ROOM_TITLE, continueFrom(), playwright@1.65.1, playwright

### Community 169 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 170 - "Shared rule spine"
Cohesion: 0.20
Nodes (9): 5. ID and alias registry, 4. Trigger, 5. Effect and EffectApplier, 6. Scheduler (TADS fuse / daemon), 7. Random port, 8. Persisted-shape constraints for rule-spine state, 9. Content registration, Shared rule spine (+1 more)

### Community 171 - "engine-issue-9-quick-answers.spec.ts"
Cohesion: 0.24
Nodes (6): ConsoleWatch, enterSwitchFloorQuiz(), QuizState, watchAppConsole(), waitForLine(), watchConsole()

### Community 172 - "6. Key flows"
Cohesion: 0.29
Nodes (6): 6.1 Bootstrap (`src/main.ts`), 6.2 One command turn, 6.4 Save, load, download and import, 6.5 Losing a life and winning, 6. Key flows, 2. Envelope, keys and file format

### Community 173 - "vitest"
Cohesion: 0.25
Nodes (5): vitest, CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES

### Community 174 - "CommandTable.ts"
Cohesion: 0.32
Nodes (7): aliasSuffix(), COMMAND_TABLE, CommandSpec, detailSuffix(), DIRECTIONS, DirectionSpec, helpText()

### Community 176 - "PuzzleGraph.ts"
Cohesion: 0.48
Nodes (6): cycleIds(), firstReady(), puzzleGraphFindings(), repeatedIds(), solveOrder(), unreachableIds()

### Community 178 - "Puzzles"
Cohesion: 0.40
Nodes (5): 1. Scope, 4. Puzzle Dependency Graph, 5. Hints, 6. Integration points, Puzzles

### Community 179 - "Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?, Source Nodes

### Community 180 - "Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?, Source Nodes

### Community 181 - "Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?, Source Nodes

### Community 182 - "Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?, Source Nodes

### Community 183 - "Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?, Source Nodes

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `resolveGameCommand()` (5× useful, score=4.939223948)
- `TopicResolver` (5× useful, score=4.938915206)
- `OutputLog` (5× useful, score=4.934589902)
- `ContentBundle` (5× useful, score=4.840811249)
- `GameWindow` (4× useful, score=3.964500536)
- `GameViewData` (4× useful, score=3.938119587)
- `EffectApplier` (4× useful, score=3.897840685)
- `validateContent()` (4× useful, score=3.85957827)
- `formatEvent()` (3× useful, score=2.943999577)
- `ScoreTracker` (3× useful, score=2.922368377)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `npcTopicOverlap.ts`, `GameWindow.ts`, `ui.ts`, `parser.ts`, `persistence.ts`, `content.ts`, `NpcGates.test.ts`, `scenery-validation.test.ts`, `PuzzleSystem.test.ts`, `LoadResult`, `ScoreTracker.ts`, `GameEvent`, `mechanics.ts`, `zone1.ts`, `contentToolchain.ts`, `adapt.ts`, `area-progress.test.ts`, `validateContent.ts`, `NpcTypes.test.ts`, `authored.ts`, `main.ts`, `package.json`, `devDependencies`, `npcs.ts`, `CommandTable.test.ts`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Should `Issues` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `GameWindow.ts`, `commandResolution.ts`, `content/index.ts`, `common.ts`, `ui.ts`, `SaveManager.ts`, `Effect`, `GameState`, `parser.ts`, `persistence.ts`, `content.ts`, `TopicSelection.ts`, `cli.ts`, `ScoreTracker`, `scenery-validation.test.ts`, `PuzzleSystem.test.ts`, `LoadResult`, `ScoreTracker.ts`, `3. Rule catalogue`, `GameState.ts`, `mechanics.ts`, `zone1.ts`, `Content authoring rules`, `HazardSystem.ts`, `adapt.ts`, `area-progress.test.ts`, `HintSystem.ts`, `Shared rule spine`, `6. Key flows`, `validateContent.ts`, `NpcTypes.test.ts`, `authored.ts`, `PuzzleGraph.ts`, `main.ts`, `npcs.ts`, `EffectApplier.ts`, `Game.ts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `npcTopicOverlap.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10758998435054773 - nodes in this community are weakly interconnected._
- **Why does `Engine issues — batched hand-off` connect `Issues` to `EffectApplier.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._