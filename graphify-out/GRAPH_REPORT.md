# Graph Report - brave-wolf  (2026-11-27)

## Corpus Check
- 585 files · ~291,538 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 3959 nodes · 10280 edges · 322 communities (316 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 442 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0177b711`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- helpers.ts
- Random
- PlacedBlockClosure.test.ts
- Effect
- catalogueOf
- area-progress.test.ts
- Issues
- authoredGame
- asText
- SaveManager.ts
- verbs/index.ts
- engine-followups-2-hintretry.spec.ts
- LoadConfirmation.test.ts
- compilerOptions
- contentToolchain.ts
- zone1.ts
- parser.ts
- GameStateDto
- topicOverlap.ts
- content/index.ts
- content.ts
- persistence.ts
- Game
- Game
- TopicSelection.ts
- NpcGates.test.ts
- ContentBundle.ts
- stringList
- FakeRandom
- SaveManager.ts
- GameEvent
- engine-issue-15-life-gate.spec.ts
- contentToolchain.ts
- adapt.ts
- commandResolution.ts
- GameWindow.ts
- ConversationFlow.ts
- scripts
- PuzzleGraph.ts
- 4. Design card format
- vitest
- ScoreTracker
- CommandTable.ts
- generate.ts
- authored.ts
- generate.ts
- Q: MD-UI-01 round 1: which canonical UI node owns block vs inline transcript channels after removing the NUMBERED_OPTION heuristic, and can the first MD-UI-09 test stay green?
- common.ts
- asRecord
- markdown.spec.ts
- devDependencies
- Q: MD-CSS-01–07: which canonical node owns transcript styling, and are there competing stylesheets or inline style writers to bypass?
- mechanics.ts
- validate.ts
- Q: MD-CSS-01–07 browser QA: which canonical nodes own transcript CSS, table/fence DOM shape and the Pages footer link?
- Q: CommandSpec CommandTableModule ParserLike PutFixture npcState resolveNpcRaw import owners for tests/parser/CommandTable.test.ts
- Storage schema
- tsconfig.json
- LoadResult
- ComposedReaction.ts
- ContentBundle
- Shared rule spine
- engine-issue-30-passmark.spec.ts
- MemoryContentIo
- FakeElement
- Q: Do style.css, .output-log and .table-scroll exist as labels in graphify-out/graph.json for MD-CSS browser QA?
- Q: Did adding typescript-eslint introduce duplicate canonical configs or cross-layer edges?
- Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?
- Q: Does the coverage graph (docs/graphify-out/graph.json) describe the Markdown transcript CSS requirements in spec sections 8 and 10.12?
- parser.ts
- authored.ts
- Q: Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?
- CommandTable.test.ts
- main.ts
- GameState.ts
- Q: Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?
- Q: Which canonical nodes own parser, turn pipeline and event formatting responsibilities?
- InteractionRules.ts
- AreaChangeLifeGate.test.ts
- LoadConfirmation.test.ts
- Command
- ScoreTracker.ts
- Q: Revision 1 graph audit: any new bypasses, cross-layer edges or unexpected hub?
- validateContent.ts
- Q: Did the toolchain slice introduce a new catch-all hub, cross-layer import or import cycle?
- Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts
- RecordingGame
- Q: Do the revision-1 helpers bypass validateContent(), finding() or collection()?
- GameStateDto
- Q: Which canonical node audits covered-topic completion sources?
- Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?
- PuzzleSystem.ts
- Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?
- W7GateFeedback.test.ts
- Round2UnlockRefusal.test.ts
- TopicSelection.test.ts
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
- AuthoredWinPath.test.ts
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- node-shims.d.ts
- Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?
- GameViewData.ts
- playwright.config.ts
- scenery-validation.test.ts
- TopicSelection.ts
- Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?
- markdownRendering.test.ts
- Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?
- Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?
- Q: Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?
- Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?
- Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- Q: ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?
- Q: ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?
- ComposedReaction.ts
- GameEvent
- Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?
- Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?
- Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?
- Q: ENG16-SAVECONFIRM-01: which canonical node owns the Save/Download confirmation path and should GameWindow.makeActions() route through it?
- TopicResolver.ts
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
- Q: Can the Playwright MCP browser drive the app in this engine-issue-16 session?
- Q: graphify section '6.1' — which document owns the event to view mapping?
- Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?
- authoredGame
- Q: Why do two engine-issue-9 quick-answer browser tests fail on the engine-issue-16 branch?
- Q: ENG16-SAVECONFIRM-01: where do the canonical Save/Download confirmation lines come from and how do sidebar buttons reach them?
- GameState
- HANDOFF — CompSciQuest content + W6/W7 state
- Q: How should browser-tester run e2e on a different port without touching playwright.config.ts for engine-issue-16?
- Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?
- Q: Where are QuizView.remainingWrong and the fresh-start save writes defined, and which doc sections own them?
- Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?
- Q: Where does autosave hook into Game.submit and where is the quarantine download button defined?
- w7-accessibility.spec.ts
- Q: ENG24-FRESHSTART-01/DEDUP-01: which nodes own fresh-start state construction and the live save write?
- Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?
- Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?
- Q: Where do autosave after submit and the quarantined-save download button live?
- Q: ENG24 autosave: why does the post-observer trace assertion fail even though the saved DTO has final state?
- Q: Which canonical nodes own autosave on Game.submit and the five SaveControls buttons for ENG24-AUTOSAVE-01 and ENG31-REMOVEQUARANTINE-01?
- Q: Why do 11 unrelated e2e tests fail on the port-5224 run?
- Q: ENG30-REMAINING-02: where is remainingWrong derived and which QuizView node is canonical for the red tests?
- ScoreTracker
- Q: MD-RENDER-01 round 1: which canonical nodes own bold-italic emphasis, raw-HTML leaf text and rejected-link labels in the markdown renderer?
- Q: Where does putHandler() choose toOwnerId for an authored item fixture and how is putInteraction() reused?
- Q: Which canonical UI node owns the Markdown-to-DOM renderer boundary and is there an existing owner to reuse?
- persistence.ts
- Q: Which canonical UI node owns the Markdown-to-DOM renderer boundary and is there an existing owner to reuse?
- Q: Does mapping every item PUT target to the current room break existing parser verb contracts?
- Q: MD-RENDER-01 round 1: after adding plainText() and boldItalicMarker(), are there duplicate canonical nodes, bypasses or new cross-layer edges?
- Q: MD-RENDER-01 round 1: is there an existing plain-token-text extractor or triple-marker detector to reuse before adding plainText() and boldItalicMarker()?
- Q: Why does a clean authored win save fail hasValidReferences and disable Continue after reload?
- validate.ts
- Q: Where are QuizView.remainingWrong, createFreshState and the fresh-start save writes defined, and which seam owns them?
- Q: ENG24-REANCHOR-UNIT-02: which node owns typed restart and its fresh-state save, and where is the inherited no-write loop?
- Q: MD-RENDER-01: which canonical UI node owns the Markdown to DOM boundary?
- Q: Where are the pass-line requirementLine helper, the unused QUARANTINE_DOWNLOAD_NAME export, the restart fresh-start writes, and the quiz view fields defined for ENG30 re-anchoring and fresh-start QA?
- Q: Revision round 1: where are the two stale e2e expectations that New Game leaves storage empty and typed load restores a seeded score-7 save, now that .newGame() writes a fresh save?
- Q: Which seams own load confirmation, transient hint clearing on quiz retry, and the quiz requirement aria-live region?
- Q: Why does typing hint after a switchyard quiz retry say there is nothing more to suggest, and how should the browser e2e reach a fresh hint?
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- Q: Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?
- Q: Why is Continue disabled after reloading a full authored win save?
- Q: Is the zone-1 turns-since hint dead end a content-authoring issue rather than an engine bug, and what content options exist?
- Q: Which node owns grant-item inventory mutation and how does it keep one owner per item?
- Q: Does grant-item need a new helper to remove authored initialRoom copies?
- Q: Why did the full-win e2e fail after the F3 ownership fix, and which failures were e2e fixture mistakes rather than product gaps?
- Q: MD-RENDER-01: which canonical UI node owns the marked DOM-only renderer boundary for transcript and panel Markdown?
- Q: MD-RENDER-01: is there an existing link allowlist or text-node helper to reuse?
- Q: MD-RENDER-01: why do seven tests fail after the renderer is implemented?
- Q: FakeElement FakeDocument .createTextNode() installFakeDocument() OutputLog appendLine() — which node owns the fake text-node tagName casing that caused markdown renderer test failures?
- markdownTranscript.test.ts
- Q: MD-RENDER-02/11/15: which canonical nodes own the ___person___ bold-italic shape, raw HTML newline preservation and rejected-link label text?
- Q: Which UI nodes own transcript echo, panel channels and the fake DOM for MD-UI-01 to MD-UI-10?
- Q: QuizPanel .refresh() requirementLine() FakeElement createTextNode() OutputLog — how is the quiz requirement rendered and how does the fake text node expose tagName for UI-PASSMARK-A11Y-03?
- BareQuizAnswer.test.ts
- CommandTable.ts
- SaveActions
- content/index.ts
- common.ts
- NPCs and conversation
- Q: MD-UI-01: which canonical UI nodes own the plain/Markdown transcript channels and how do appendPlain, appendMarkdownBlock and appendMarkdownInline reuse them?
- engine-issue-30-passmark.spec.ts
- GameStateDto
- Q: MD-UI-01 reviewer-FAIL round: which graph nodes own block/inline markdown channels, quiz requirement order and GameWindow event routing?
- HintRetry.test.ts
- engine-issue-30-passmark.test.ts
- eslint.config.js
- HintSystem
- domain.ts
- Q: COMMAND_TABLE helpText() CommandSpec DIRECTIONS describeRoom() scoreHandler() formatEvent() topicLabel() RoomSummary — which canonical nodes own grouped help and room-entry text?
- Q: MD-HELP-01/MD-STATUS-01 round 1: which canonical nodes own the 21-verb COMMAND_TABLE group split, the Saves help section, and the four-entry room heading?
- Q: Which canonical nodes own generated help text, transcript rendering and the four-part room heading for the MD-HELP-01/MD-STATUS-01 e2e updates?
- ValidationModule
- eslint@^10.15.0
- prettier@^3.10.1
- Q: Why did the full-win e2e fail after the F3 ownership fix, and which failures were e2e fixture mistakes rather than product gaps?
- Q: WR4-B1/B2/C1: which canonical nodes own put/take placement feedback, transfer-item ownership and out-of-room give feedback?
- Q: Where are item ownership and current-room visibility owned, and can a block placed in a visible fixture stay nameable?
- Q: Can out-of-room give/show with an unresolvable item emit the canonical absence line without a new Command variant or content card?
- Q: Who owns the fallback source owner for a take when no visible open container branch applies (WR4-B1 closed-cabinet retrieval)?
- Q: Where do putHandler(), takeHandler(), describeTarget(), ItemVisibility, formatEvent(), GameEvent, TitleScreen, SaveControls and GameViewData live, and what real event names and view fields should browser assertions use?
- Q: Does the assistance orientation quiz always present questions in the authored questionIds order?
- Q: Why does a save written immediately after 'place practice block in practice cabinet' get quarantined as invalid-content on reload?
- Q: WR4 persistence blocker: which canonical SaveManager nodes reject a state.rooms key that is a fixture item ID holding a placed item?
- Q: Which SaveManager reference validation quarantines a fixture-owned item inventory key, and what is the smallest canonical fix?
- Q: After the SaveManager fix, does a save written with the practice block placed in the fixture cabinet reload with Continue enabled, and is the invalid-json quarantine path still intact?
- Q: Where is the out-of-room give/show absence feedback handled and is a new Command variant required?
- Q: WR4-C1-FIX browser QA: which canonical nodes own out-of-room give/show feedback and the real transcript/state fields?
- .prettierrc.json
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- Q: graphify section '6.1' — which document owns the event to view mapping?
- Q: Which coverage-graph nodes document the tutorial-complete gate for hub east/north?
- QuizRevision.test.ts
- node-shims.d.ts
- npc.ts
- SaveDto.ts
- zod
- area-score-attribution.test.ts
- Effect
- game-fresh-start-seam.test.ts
- ValidationModule

## God Nodes (most connected - your core abstractions)
1. `vitest` - 136 edges
2. `ContentBundle` - 128 edges
3. `GameEvent` - 111 edges
4. `GameState` - 101 edges
5. `Effect` - 64 edges
6. `submit()` - 62 edges
7. `asText()` - 62 edges
8. `FakeRandom` - 60 edges
9. `Command` - 60 edges
10. `finding()` - 58 edges

## Surprising Connections (you probably didn't know these)
- `8.2 Result type` --references--> `SaveControls`  [INFERRED]
  docs/developer/storage-schema.md → src/ui/SaveControls.ts
- `7. Random port` --references--> `Random`  [INFERRED]
  docs/developer/shared-rules.md → src/core/Random.ts
- `H — Hazards and hints` --references--> `HintSystem`  [INFERRED]
  docs/developer/content-rules.md → src/core/hints/HintSystem.ts
- `4. Failure consequences` --references--> `AreaDefinition`  [INFERRED]
  docs/developer/hazards.md → src/content/AreaDefinition.ts
- `11. Flow` --references--> `Game`  [INFERRED]
  docs/developer/storage-schema.md → src/application/Game.ts

## Import Cycles
- 2-file cycle: `e2e/w7-full-win-trace.ts -> e2e/w7-full-win/ward-checkpoint.ts -> e2e/w7-full-win-trace.ts`

## Communities (322 total, 6 thin omitted)

### Community 0 - "helpers.ts"
Cohesion: 0.05
Nodes (47): continueSavedGame(), command(), DEBUG_FRAGMENTS, delta(), SaveEnvelope, boot(), openSession(), command() (+39 more)

### Community 1 - "Random"
Cohesion: 0.14
Nodes (19): 6.1 Bootstrap (`src/main.ts`), EffectApplier, EffectApplierDependencies, FiredThisTurn, HazardSystemDependencies, isInitialRoom(), isTriggerMatched(), HintSystemDependencies (+11 more)

### Community 2 - "PlacedBlockClosure.test.ts"
Cohesion: 0.14
Nodes (11): START_ROOM, VerbTableLike, EffectApplierLike, loadEffectApplier(), applierFor(), applyEffects(), Fixture, HandlerResult (+3 more)

### Community 3 - "Effect"
Cohesion: 0.13
Nodes (15): createComposedReaction(), adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), recordSeed(), MetaAction, createQuizSystem() (+7 more)

### Community 4 - "catalogueOf"
Cohesion: 0.09
Nodes (28): DOOR_ID, KEY_B, makeParserBundle(), makeParserState(), makeParserStateDto(), makePutFixture(), catalogueOf(), AskFixture (+20 more)

### Community 5 - "area-progress.test.ts"
Cohesion: 0.14
Nodes (18): makeRuntimeState(), makeStateDto(), w7QuizState(), w7UnlockState(), makeState(), makeSetup(), BASE_DTO, HOME_POSITION (+10 more)

### Community 6 - "Issues"
Cohesion: 0.11
Nodes (68): gNpc06(), gNpc07(), gNpc08(), gNpc09(), gNpc10(), gNpc11(), gNpc12(), gNpc13() (+60 more)

### Community 7 - "authoredGame"
Cohesion: 0.13
Nodes (21): activeQuizState(), authoredGame(), authoredNpc(), authoredState(), switchyardProgress(), freshState(), AuthoredFixture, finishWithWrongAnswers() (+13 more)

### Community 8 - "asText"
Cohesion: 0.13
Nodes (52): areaLikes(), asArray(), asObjectArray(), asText(), auditedAreaLikes(), collection(), DIRECTIONS, EFFECT_KINDS (+44 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.07
Nodes (61): spokenTexts(), actorBindingScenario(), actorOrderScenario(), actorScenario(), AI_ID, AI_INITIAL_STATE_ID, AI_STATES, ARRIVAL_AREA_ID (+53 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.05
Nodes (55): createFromDto(), stateToDto(), createConditionEvaluator(), isConditionMet(), DEFAULT_REPLY, AI_ID, aiBundle(), ARRIVAL_AREA_ID (+47 more)

### Community 11 - "engine-followups-2-hintretry.spec.ts"
Cohesion: 0.09
Nodes (31): START, Condition, keywordTopic(), W7_AI_ALIAS, W7_AI_ID, W7_ANSWERS_TOPIC_ID, W7_AREA_ID, W7_CABINET_ALIASES (+23 more)

### Community 12 - "LoadConfirmation.test.ts"
Cohesion: 0.13
Nodes (29): 5.2 Verb table and handler signature, examineInteraction(), isSceneryVisible(), ContainerOwner, describeRoom(), describeTarget(), examineHandler(), fixedMessage() (+21 more)

### Community 13 - "compilerOptions"
Cohesion: 0.06
Nodes (41): 1. Scope, 2. Model, 3. Commands and delivery, 4. Adaptive behaviour, 5. Score interaction, Hints, 1. Scope, 4. Puzzle Dependency Graph (+33 more)

### Community 14 - "contentToolchain.ts"
Cohesion: 0.05
Nodes (64): Data, gateFindings(), CardData, cleanParsedSet(), definition(), roomData(), PER_AREA_PATHS, cardsWithRefusalText() (+56 more)

### Community 15 - "zone1.ts"
Cohesion: 0.07
Nodes (60): ACTOR_ALIAS, ACTOR_ID, actorState(), askRing, byeCommand, ConditionEvaluatorCondition, CountingRandom, DEFAULT_TOPIC_ID (+52 more)

### Community 16 - "parser.ts"
Cohesion: 0.05
Nodes (60): enterSwitchFloorQuiz(), liveTurn(), answerAndRead(), AuthoredQuestion, DisplayedQuestion, displayedQuestion(), enterSwitchFloorQuiz(), numberedOptions() (+52 more)

### Community 17 - "GameStateDto"
Cohesion: 0.10
Nodes (12): 6.2 One command turn, 6.4 Save, load, download and import, 6.5 Losing a life and winning, 6. Key flows, 2. Envelope, keys and file format, LoadResult, SaveDto, SaveManager (+4 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.13
Nodes (32): makeEnvelope(), allText(), Bootstrap, BootstrapDependencies, descendants(), documentState, FakeBus, FakeEvent (+24 more)

### Community 19 - "content/index.ts"
Cohesion: 0.07
Nodes (30): 3.1 Catalogue shape, 8. Behavioural signatures, 2. Authoring format, area, START_POSITION, startRoom, areaHeaders(), authoredArea() (+22 more)

### Community 20 - "content.ts"
Cohesion: 0.08
Nodes (45): expectWardCheckpoint(), GATE_FLAGS, MILL_FLAGS, NON_QUIZ_PUZZLES, RAIL_FLAGS, SCRIPTED_HAZARDS, UNSEEN_HAZARDS, AuthoredQuestion (+37 more)

### Community 21 - "persistence.ts"
Cohesion: 0.08
Nodes (27): SessionStatus, AuthoredGameFixture, asRuntime(), envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, loadInitialState() (+19 more)

### Community 22 - "Game"
Cohesion: 0.11
Nodes (30): acceptedCards(), generatedRoomIds(), zone1Cards(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES (+22 more)

### Community 23 - "Game"
Cohesion: 0.09
Nodes (14): 2. Boot, title screen and session start, 4.1 Meta actions, 4. Game façade and meta actions, 7.2 View data, Persistence and UI, 10. API contracts, Game, GameWindow (+6 more)

### Community 24 - "TopicSelection.ts"
Cohesion: 0.12
Nodes (33): 10.1 Free-text topic-overlap proof, 10. Structural validation gates, Authoring conversation rules (A), Dialogue plan metadata (D6), Technical conversation rules (T), Write the dialogue first, createNameResolver(), AskTellMatch (+25 more)

### Community 25 - "NpcGates.test.ts"
Cohesion: 0.08
Nodes (32): 1. Purpose, 3. Scaffolds, 4. Validation, 6. Ownership, 7. Coverage-graph extraction, Content toolchain, CONTENT_ROOT, COVERAGE_PATH (+24 more)

### Community 26 - "ContentBundle.ts"
Cohesion: 0.11
Nodes (15): Catalogue, catalogueOf(), QuizQuestion, HintLevel, HintSequence, finishWithWrongAnswers(), questionFor(), wrongAnswer() (+7 more)

### Community 27 - "stringList"
Cohesion: 0.09
Nodes (39): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+31 more)

### Community 28 - "FakeRandom"
Cohesion: 0.13
Nodes (35): CardEntry, ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf() (+27 more)

### Community 29 - "SaveManager.ts"
Cohesion: 0.15
Nodes (29): ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints(), hasValidNpcs() (+21 more)

### Community 30 - "GameEvent"
Cohesion: 0.07
Nodes (30): GameEvent, Session, SchedulerContract, loadSession(), makeBundle(), makeTopic(), EventBusFactory, FormatEventFunction (+22 more)

### Community 31 - "engine-issue-15-life-gate.spec.ts"
Cohesion: 0.18
Nodes (11): command(), continueFrom(), firstId(), GATE_IDS, gateIds(), GateOverrides, savedState(), SaveState (+3 more)

### Community 32 - "contentToolchain.ts"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 33 - "adapt.ts"
Cohesion: 0.33
Nodes (11): bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings(), text() (+3 more)

### Community 34 - "commandResolution.ts"
Cohesion: 0.08
Nodes (28): AuthoredQuestion, AuthoredQuiz, continueFromSave(), displayedQuestion(), expectHintHidden(), hintPanel(), numberedOptions(), questionFor() (+20 more)

### Community 35 - "GameWindow.ts"
Cohesion: 0.07
Nodes (25): 7.1 DOM layout, 7. UI structure and view-model, 6. Events and UI, 7. State, events and UI, AreaProgressView, ConversationView, GameViewData, HintView (+17 more)

### Community 36 - "ConversationFlow.ts"
Cohesion: 0.18
Nodes (25): createTopicResolver(), activeNode(), announceHandover(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation() (+17 more)

### Community 37 - "scripts"
Cohesion: 0.18
Nodes (13): DIRECTION_NAMES, DIRECTION_SHORTCUTS, DIRECTION_TOKENS, HYPHENATED_VERBS, hyphenatedVerb(), isDirection(), isPunctuationAlias(), MULTIWORD_ALIASES (+5 more)

### Community 38 - "PuzzleGraph.ts"
Cohesion: 0.14
Nodes (27): actorAndRemainder(), answerCommand(), bareAnswerCommand(), conversationCommand(), DIRECTION_BY_TOKEN, directionCommand(), exactOptionAnswerCommand(), fallbackPair() (+19 more)

### Community 39 - "4. Design card format"
Cohesion: 0.13
Nodes (22): answerAttempt(), AuthoredQuestion, authoredQuestion(), authoredQuiz(), checkWardMechanics(), correctIndex(), currentQuestion(), DIAL_TEXT (+14 more)

### Community 40 - "vitest"
Cohesion: 0.15
Nodes (8): vitest, createSaveManager(), authoredBundle, grantedState(), QUIZ_IDS, lastWinningBatch(), MILL_FLAGS, TRACE_FLAGS

### Community 41 - "ScoreTracker"
Cohesion: 0.09
Nodes (22): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Behavioural guarantees, 3.2 World, area, room and item definitions, 3.3 Loading and validation, 3. Content bundle and registration, 6.1 Event to view mapping, 6. Canonical event union and rendering (+14 more)

### Community 42 - "CommandTable.ts"
Cohesion: 0.19
Nodes (13): aliasSuffix(), COMMAND_TABLE, commandLine(), CommandSpec, detailSuffix(), DIRECTIONS, DirectionSpec, GROUP_ORDER (+5 more)

### Community 43 - "generate.ts"
Cohesion: 0.19
Nodes (20): expectHazardOutcome(), command(), enter(), expectEntry(), expectFlags(), expectOwners(), expectPosition(), expectPuzzle() (+12 more)

### Community 44 - "authored.ts"
Cohesion: 0.12
Nodes (27): CardSet, Finding, GeneratedFile, GenerationResult, ParsedCard, ParseResult, asRecord(), AUTHORING_KEYS (+19 more)

### Community 45 - "generate.ts"
Cohesion: 0.19
Nodes (19): 5. Generation, CatalogueEmit, cleanEntry(), emitCatalogue(), indentJson(), stripAuthoring(), normalisedCards(), normaliseExit() (+11 more)

### Community 46 - "Q: MD-UI-01 round 1: which canonical UI node owns block vs inline transcript channels after removing the NUMBERED_OPTION heuristic, and can the first MD-UI-09 test stay green?"
Cohesion: 0.10
Nodes (20): 10. Placeholder objective and controls copy is shown to the player, 11. SHOW silently hands over a carried item, 12. Hints are graded correctly but too generic to resolve the stalled step, 13. Quiz teaches a command form the game rejects, 1. Expected ward path — claim-by-claim outcome, 1. Internal flag token shown at the teaching-port gates, 2. Functional defects, 2. `talk to <npc>` rejected although the command list advertises `talk-to` (+12 more)

### Community 47 - "common.ts"
Cohesion: 0.15
Nodes (23): areaPairForTopic(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect() (+15 more)

### Community 48 - "asRecord"
Cohesion: 0.20
Nodes (3): AuthoredRun, gateFlag(), lastQuestion()

### Community 49 - "markdown.spec.ts"
Cohesion: 0.28
Nodes (6): contrastRatio(), Layout, luminance(), NARROW_VIEWPORT, parseColour(), WIDE_VIEWPORT

### Community 50 - "devDependencies"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 51 - "Q: MD-CSS-01–07: which canonical node owns transcript styling, and are there competing stylesheets or inline style writers to bypass?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-CSS-01–07: which canonical node owns transcript styling, and are there competing stylesheets or inline style writers to bypass?, Source Nodes

### Community 52 - "mechanics.ts"
Cohesion: 0.08
Nodes (57): createEffectApplier(), startEvents(), puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory (+49 more)

### Community 53 - "validate.ts"
Cohesion: 0.16
Nodes (23): ParsedCardSet, ValidateResult, asNumber(), stringList(), checkHint(), ladderFindings(), levelFindings(), penaltyFindings() (+15 more)

### Community 54 - "Q: MD-CSS-01–07 browser QA: which canonical nodes own transcript CSS, table/fence DOM shape and the Pages footer link?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-CSS-01–07 browser QA: which canonical nodes own transcript CSS, table/fence DOM shape and the Pages footer link?, Source Nodes

### Community 55 - "Q: CommandSpec CommandTableModule ParserLike PutFixture npcState resolveNpcRaw import owners for tests/parser/CommandTable.test.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: CommandSpec CommandTableModule ParserLike PutFixture npcState resolveNpcRaw import owners for tests/parser/CommandTable.test.ts, Source Nodes

### Community 56 - "Storage schema"
Cohesion: 0.18
Nodes (11): 11. Flow, 12. Invariants the implementation must keep, 13. Out of scope, 1. Scope and authority, 6. Content dependencies, 7. Restore-time derivation, 8.1 Strictness, 8.2 Result type (+3 more)

### Community 57 - "tsconfig.json"
Cohesion: 0.11
Nodes (18): command, cwd, type, default_agent, experimental, subagent_depth, command, cwd (+10 more)

### Community 58 - "LoadResult"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 59 - "ComposedReaction.ts"
Cohesion: 0.10
Nodes (17): 2. Model, 3. Execution, 4. Failure consequences, 5. Content, Hazards, 1. Scope, 4. Conversation flow, 3. Completion detection (+9 more)

### Community 60 - "ContentBundle"
Cohesion: 0.11
Nodes (28): 10. Out of scope, 1. Scope and goals, 2. Design principles, 3. Layers and dependency direction, 4. Source layout, 5. Module responsibilities, 8. Conventions, 9. Testability (+20 more)

### Community 61 - "Shared rule spine"
Cohesion: 0.11
Nodes (17): 1. Scope, 2. Model, 3. Flow, 4. Commands and events, 5. Hints, Quiz combat, 10. Determinism and ordering rules, 2. Turn pipeline (+9 more)

### Community 62 - "engine-issue-30-passmark.spec.ts"
Cohesion: 0.21
Nodes (12): AuthoredQuestion, authoredQuestion(), AuthoredQuiz, DisplayedQuestion, displayedQuestion(), enterQuizFromSave(), enterSwitchFloorQuiz(), expectRequirement() (+4 more)

### Community 63 - "MemoryContentIo"
Cohesion: 0.13
Nodes (14): 1. Expected path claims — checked against play, 2. Status of the thirteen earlier findings, 3. Findings from this round, 4. Difficulty and fairness record, A. Room and item prose does not follow the completed state, B (minor). Wrong-order unlock invites carrying a bolted-down fixture, C. The approved dial block text describes five empty sockets after four are filled, Content-quality findings (route to `content-editor`) (+6 more)

### Community 64 - "FakeElement"
Cohesion: 0.08
Nodes (12): absentElement(), FakeDocument, FakeElement, hasMatchingAncestors(), isTokenMatch(), makeFakeDocument(), logLines(), pressEnter() (+4 more)

### Community 65 - "Q: Do style.css, .output-log and .table-scroll exist as labels in graphify-out/graph.json for MD-CSS browser QA?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Do style.css, .output-log and .table-scroll exist as labels in graphify-out/graph.json for MD-CSS browser QA?

### Community 66 - "Q: Did adding typescript-eslint introduce duplicate canonical configs or cross-layer edges?"
Cohesion: 0.14
Nodes (13): 1. Expected path claims — checked against play, 2. Status of the original thirteen findings, 3. Status of the five round-2 findings A–E, 4. Round-3 findings and round-4 closure claims, 5. Findings from this round, 6. Difficulty and fairness record, Additional observation (not a blocker), Content finding 1. The placed block stays “on top” in the room prose and cannot be found again (+5 more)

### Community 67 - "Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 68 - "Q: Does the coverage graph (docs/graphify-out/graph.json) describe the Markdown transcript CSS requirements in spec sections 8 and 10.12?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Does the coverage graph (docs/graphify-out/graph.json) describe the Markdown transcript CSS requirements in spec sections 8 and 10.12?

### Community 69 - "parser.ts"
Cohesion: 0.12
Nodes (18): 3. Commands and topic resolution, 5. Conversation nodes, ParsedCommand, KEY_A, loadNameResolver(), loadParser(), loadTokenizer(), ParserLike (+10 more)

### Community 70 - "authored.ts"
Cohesion: 0.12
Nodes (21): AuthoredStateOptions, changedFlags(), eventTypes(), FOREMAN_ID, gameplaySnapshot(), producerState(), ProducerStateOptions, requirementFlags() (+13 more)

### Community 71 - "Q: Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?"
Cohesion: 0.15
Nodes (13): devDependencies, eslint@^10.15.0, playwright@1.65.1, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, typescript-7@npm:typescript@^7.0.2, vite@^8.3.8, vitest@^5.1.1 (+5 more)

### Community 72 - "CommandTable.test.ts"
Cohesion: 0.16
Nodes (15): CommandSpec, CommandTableModule, DirectionSpec, hasCommandToken(), loadCommandTable(), CHEST_ID, loadVerbTable(), makeTurnContext() (+7 more)

### Community 73 - "main.ts"
Cohesion: 0.20
Nodes (10): loadContent(), createEventBus(), bootstrap(), browserDownload(), browserOpenSaveFile(), seededRandom(), startBrowserApp(), systemClock() (+2 more)

### Community 74 - "GameState.ts"
Cohesion: 0.21
Nodes (8): 2. Model, ItemVisibility, itemVisibility, GameState, RuntimeGameState, PuzzlePhase, PuzzleStateDto, RoomStateDto

### Community 75 - "Q: Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?"
Cohesion: 0.17
Nodes (11): description, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, yaml@^2.9.1, name, private, type, version (+3 more)

### Community 76 - "Q: Which canonical nodes own parser, turn pipeline and event formatting responsibilities?"
Cohesion: 0.17
Nodes (11): 1. Expected path claims — ward beats A–C2.12, 3. Closure of the thirteen earlier findings, 4. Closure of the five round-2 findings A–E, 5. Findings from this round, 6. Difficulty and fairness record, Content-quality finding 1. Demonstration prose keeps the practice block on top after it is put away, Context only, out of scope, Functional defect 1. The taught “exact option text” quiz answer form does not work (+3 more)

### Community 77 - "InteractionRules.ts"
Cohesion: 0.17
Nodes (17): AUTHORED_USES, authoredUseEffects(), AuthoredUseInteraction, describeScenery(), flagEffects(), FlagInteraction, hasMatchingName(), matchingInteraction() (+9 more)

### Community 78 - "AreaChangeLifeGate.test.ts"
Cohesion: 0.20
Nodes (8): Puzzle, areaOf(), BundleOptions, gatedBundle(), gatedState(), roomOf(), StateOptions, TopicIndexEntry

### Community 79 - "LoadConfirmation.test.ts"
Cohesion: 0.18
Nodes (12): formatEvent(), topicLabel(), asFake(), AuthoredFixture, CANONICAL_EVENT_TYPES, logLines(), mountWindow(), noop() (+4 more)

### Community 80 - "Command"
Cohesion: 0.24
Nodes (11): 5.1 Door and container verbs, 5. Canonical command union and verbs, Command, CommandHandler, hasItem(), isTalking(), message(), npcHandler() (+3 more)

### Community 81 - "ScoreTracker.ts"
Cohesion: 0.25
Nodes (14): areaPairForRoom(), Announce, AreaPair, award(), createScoreTracker(), hasScoreFor(), hasTopicCompletion(), pairForReason() (+6 more)

### Community 82 - "Q: Revision 1 graph audit: any new bypasses, cross-layer edges or unexpected hub?"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 83 - "validateContent.ts"
Cohesion: 0.05
Nodes (52): 1.1 How to read the rules, 1.2 Start here by role, 1. Purpose and authority, 2. Workflow gates, 4.1.1 Markdown and affordance formatting, 4.1 Common conventions, 4.2 Area and rooms card, 4.3 NPC card (+44 more)

### Community 84 - "Q: Did the toolchain slice introduce a new catch-all hub, cross-layer import or import cycle?"
Cohesion: 0.20
Nodes (9): 1. Expected path claims — checked against play, 2. R4-1 closure claim — verified carefully, 3. Gate table check, 4. Status of the original thirteen findings, 5. Status of round-2 A–E, round-3's two findings and round-4's findings, 6. Difficulty and fairness record, Additional observation (not a finding), Priority list from the player's point of view (+1 more)

### Community 85 - "Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts"
Cohesion: 0.08
Nodes (31): 11.1 Definition of done, 11.2 Hard constraints and escalation, 11. Agent acceptance for NPC cards, 2. Model, 6. Link to quiz combat, 8. NPC card format, 9. Reviewer and playtest checks, NPCs and conversation (+23 more)

### Community 86 - "RecordingGame"
Cohesion: 0.15
Nodes (5): makeViewData(), RecordingGame, TOPIC_STATUS, makeMultiAreaViewData(), TOPIC_STATUS

### Community 87 - "Q: Do the revision-1 helpers bypass validateContent(), finding() or collection()?"
Cohesion: 0.28
Nodes (5): attributes(), FAVICON_PATH, iconLinks(), INDEX_PATH, linkElements()

### Community 88 - "GameStateDto"
Cohesion: 0.15
Nodes (6): GameStateDto, AuthoredUseText, BELL_COMMANDS, observeUse(), REQUIRED_FLAGS, UseObservation

### Community 90 - "Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?"
Cohesion: 0.15
Nodes (17): 6.3 Room entry, score and spec-topic mapping, Core, 11. Invariants the implementation must keep, 3. Condition, ExitDefinition, RoomDefinition, AreaProgress, RoomSummary (+9 more)

### Community 91 - "PuzzleSystem.ts"
Cohesion: 0.29
Nodes (9): FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient(), isPossessionOnly(), markFired(), reactionFor(), shouldSkip(), solveEffects() (+1 more)

### Community 92 - "Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?"
Cohesion: 0.31
Nodes (9): getCommandHandler, bundleWithItems(), CARTRIDGE, contextFor(), handlerFor(), inventoryReply(), LAMP, messagesOf() (+1 more)

### Community 93 - "W7GateFeedback.test.ts"
Cohesion: 0.25
Nodes (9): createRuleEngine(), stateSnapshot(), W7_GATE_FALLBACK, w7GateBundle(), W7GateExit, w7GateState(), checkExit(), GO_EAST (+1 more)

### Community 94 - "Round2UnlockRefusal.test.ts"
Cohesion: 0.29
Nodes (9): messageTexts(), W7_CABINET_ID, W7_CABINET_NAME, W7_KEY_ID, W7_KEY_NAME, W7_UNLOCK_COMMAND, w7UnlockBundle(), w7UnlockContext() (+1 more)

### Community 95 - "TopicSelection.test.ts"
Cohesion: 0.28
Nodes (8): always, NEVER_FLAG, catalogueDefault(), evaluator, expectSelectionWithoutMutation(), globalDefault(), SEQUENCE_STRATEGY, wardDefault()

### Community 96 - "Q: C3 generated handoff: which canonical nodes own compact emission, YAML-to-DTO adaptation and the initial-state default bundle?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the ESLint flat config, NPM scripts, strict compilerOptions and Vite base configured?, Source Nodes

### Community 97 - "Q: Why do C-CONTENT-12/17 fail after C3 generation when validate(loadContent(), COVERAGE_TOPIC_IDS) is called?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Did adding typescript-eslint introduce duplicate canonical configs or cross-layer edges?, Source Nodes

### Community 98 - "Q: Who owns directory-path declaration ordering for generated catalogues, and how should a slash-less root card path be grouped?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?, Source Nodes

### Community 99 - "Q: Which UI nodes own the boot title overlay geometry, 360px workspace reflow and transcript live region?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the runtime seams SaveManager Game createInitial EffectApplier Session BrowserStorage defined and how do they connect?, Source Nodes

### Community 100 - "Q: Where do the generated zone-1 catalogues, title screen, save controls and view fields come from?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bypass check: do compsciquest:save:v1, door-open: or earnedScore have code paths outside the canonical hubs?, Source Nodes

### Community 101 - "Q: Where is Vitest test collection configured and how do I exclude e2e specs?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: did removing the root-level lives mirror and stub default restore canonical GameStateDto and initial turn 0?, Source Nodes

### Community 102 - "Q: Query formatEvent, GameEvent, TitleScreen, SaveControls and GameViewData so assertions use the real event names and view fields rather than remembered ones"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?, Source Nodes

### Community 103 - "Q: Does the ES2022-safe copy-then-sort change preserve generator output and satisfy the Array#toSorted lint rule without suppressions?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own ContentBundle, validateContent, structural validation gates and score budgets?, Source Nodes

### Community 104 - "Q: Where are the named Playwright boot tests and GameWindow echo path?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the new validator create a hub, cross-layer edge or cycle?, Source Nodes

### Community 105 - "Q: Do hazard and puzzle doc concept nodes expose runtime source_location?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Is there an existing owner for content validation or effect-scanning that should be reused?, Source Nodes

### Community 106 - "Q: Which nodes are canonical for hazards, puzzles, scheduler, effects and phase-4 ordering in the hazards-puzzles slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?, Source Nodes

### Community 107 - "Q: Where is the canonical production Game factory used by main.ts for UI-BOOT-18 wiring?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own parser, turn pipeline and event formatting responsibilities?, Source Nodes

### Community 108 - "Q: Where are the canonical owners for hazard/puzzle/scheduler/effect/score behaviour in the hazards-puzzles slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do any bypasses reimplement earnedScore, door-open flags, event bus, unknown message or exits formatting outside their canonical hubs?, Source Nodes

### Community 109 - "Q: Why did H-SCHED-04 fail on fixture wiring after the scheduler was implemented?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns content validation for the YAML-first toolchain red tests?, Source Nodes

### Community 110 - "Q: Which collaborators canonically own game-over, score awards and hazard events so test seams should delegate to them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own content validation, content loading, stub bundle and NPC conversation types before adding toolchain modules?, Source Nodes

### Community 111 - "Q: validateContent() hazardContentFindings() puzzleGraphFindings() content:validate content:scaffold content:generate verbatimModuleSyntax allowImportingTsExtensions loadValidation() loadScaffolder() loadGenerator() ValidationModule"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: which canonical nodes own façade Command resolution for put noun in target, and the already-open door/container precondition message?, Source Nodes

### Community 112 - "Q: Which canonical module owns validation and what value imports must carry the .ts extension for plain Node ESM resolution?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: which canonical nodes own put-command resolution, short-name alias resolution and the already-open precondition?, Source Nodes

### Community 113 - "Q: room-scoping: which ConditionEvaluator node is canonical for in-room/in-area, visited-room and topic-complete?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1 graph audit: any new bypasses, cross-layer edges or unexpected hub?, Source Nodes

### Community 114 - "Q: Which canonical nodes own condition scoping (in-room/in-area and progress-wide visited-room/topic-complete), and are there duplicate owners or bypasses after the room-scoping change?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do the new content toolchain nodes bypass the canonical runtime validator or catalogue factory?, Source Nodes

### Community 115 - "Q: Where are the canonical owners for the amended event-returning phase-4 composition, hazard triggers, puzzle counters and per-puzzle scoring?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Did the toolchain slice introduce a new catch-all hub, cross-layer import or import cycle?, Source Nodes

### Community 116 - "Q: How are commands parsed and what event names/view fields exist for assertions?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts, Source Nodes

### Community 117 - "Q: DialogueSystem TopicResolver ConversationTopic ConversationNode ActorState NpcStateDto ResolvedTopic TopicMatch ResponseStrategy ConversationPanel ConditionEvaluator EffectApplier"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own area-like declarations, exit normalisation and todo detection for the content toolchain?, Source Nodes

### Community 118 - "Q: P-TAKE-01: where is takeHandler() and which canonical nodes gate take/drop and define ItemDefinition?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do the revision-1 helpers bypass validateContent(), finding() or collection()?, Source Nodes

### Community 119 - "Q: P-TAKE-01: where is the canonical take/drop handler and which item fields drive its refusal?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do boot, title overlay, GameViewData, validation and save quarantine live?, Source Nodes

### Community 120 - "Q: F1: does an authored refusalText of '' on a non-portable item use the fallback in takeHandler()?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node audits covered-topic completion sources?, Source Nodes

### Community 121 - "Q: Where are the NPC runtime seams: TopicResolver, DialogueSystem, ConversationTopic/Node, ActorState, NpcStateDto, EffectApplier and the Game facade?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?, Source Nodes

### Community 122 - "Q: F1: which handler selects refusalText for a non-portable take, and where is the fallback literal produced?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does boot have an existing validation owner other than validateContent(), and where do LoadFailureReason copy and quarantine live?, Source Nodes

### Community 123 - "Q: Where is room-entered built and formatted, and which nodes carry the catalogue room summary?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?, Source Nodes

### Community 124 - "Q: How are use, put and show commands produced and which handlers map them today?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: CT-GATE-08: which node owns the hint-content unlock-key namespace check and why is hints-shown:<hintId> rejected?, Source Nodes

### Community 125 - "Q: Where are QuizSystem, HintSystem and the composed reaction wired?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which gate validates hint unlock counter-key prefixes and which prefixes are agreed?, Source Nodes

### Community 126 - "Q: npcs slice: NPC runtime behaviour seam locations (DialogueSystem, TopicResolver, ConversationFlow, ConversationTopic/Node, ActorState, NpcStateDto, TopicMatch, ResolvedTopic, ResponseStrategy)"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: C3 generator and handoff contracts: generateContent(), indentJson(), emitCatalogue(), stripAuthoring(), loadContent(), createInitial(), stubBundle, validateContent(), GeneratedFile, specTopics, parsedSet(), topicHeadings(), Source Nodes

### Community 127 - "Q: Where is the authoring-only refusalText check implemented and what are the other gate owners in tools/content/schema.ts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: C3 generated handoff: which canonical nodes own compact emission, YAML-to-DTO adaptation and the initial-state default bundle?, Source Nodes

### Community 128 - "Q: NPC slice: where is the node-default catch and node expiry implemented and why do NODE-02 and GAP-05 share the same shape"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do C-CONTENT-12/17 fail after C3 generation when validate(loadContent(), COVERAGE_TOPIC_IDS) is called?, Source Nodes

### Community 129 - "Q: NPC slice: locate DialogueSystem, TopicResolver, ConversationTopic, ConversationNode, ActorState, NpcStateDto, ResolvedTopic, TopicMatch, ResponseStrategy, ConversationPanel, ConditionEvaluator, EffectApplier"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns directory-path declaration ordering for generated catalogues, and how should a slash-less root card path be grouped?, Source Nodes

### Community 130 - "Q: Where are the canonical connected authored-effects seams for room entry, USE/PUT/SHOW, quiz and hint delivery?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which UI nodes own the boot title overlay geometry, 360px workspace reflow and transcript live region?, Source Nodes

### Community 131 - "Q: Which canonical nodes own the quizzes-hints slice seam, quiz-passed condition, panel rendering and score guard?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do the generated zone-1 catalogues, title screen, save controls and view fields come from?, Source Nodes

### Community 132 - "Q: Which nodes own quiz and hint delivery in the quiz-hints slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is Vitest test collection configured and how do I exclude e2e specs?, Source Nodes

### Community 133 - "Q: Which canonical nodes own W7 room/event rendering and the observed non-quiz runtime failures?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Query formatEvent, GameEvent, TitleScreen, SaveControls and GameViewData so assertions use the real event names and view fields rather than remembered ones, Source Nodes

### Community 134 - "Q: Quiz and hint revision contracts: seeded Random persistence, set-flag no-op, answer aliases, automatic hint cadence"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the ES2022-safe copy-then-sort change preserve generator output and satisfy the Array#toSorted lint rule without suppressions?, Source Nodes

### Community 135 - "Q: Why did the QUIZ-HINT-07 room-context hint resolve to the Binary Hall instead of the switch floor?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the named Playwright boot tests and GameWindow echo path?, Source Nodes

### Community 136 - "Q: How should a quiz retry re-set emit while ScoreTracker awards once, and which object owns the injected initial state?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do hazard and puzzle doc concept nodes expose runtime source_location?, Source Nodes

### Community 137 - "Q: C7 npc topic overlap gate: where do checkNpc, validateCards, ValidationOptions and Condition exclusivity live and is there an existing overlap owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which nodes are canonical for hazards, puzzles, scheduler, effects and phase-4 ordering in the hazards-puzzles slice?, Source Nodes

### Community 138 - ".prettierrc.json"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical production Game factory used by main.ts for UI-BOOT-18 wiring?, Source Nodes

### Community 139 - "AuthoredWinPath.test.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical owners for hazard/puzzle/scheduler/effect/score behaviour in the hazards-puzzles slice?, Source Nodes

### Community 140 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did H-SCHED-04 fail on fixture wiring after the scheduler was implemented?, Source Nodes

### Community 141 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which collaborators canonically own game-over, score awards and hazard events so test seams should delegate to them?, Source Nodes

### Community 142 - "node-shims.d.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: validateContent() hazardContentFindings() puzzleGraphFindings() content:validate content:scaffold content:generate verbatimModuleSyntax allowImportingTsExtensions loadValidation() loadScaffolder() loadGenerator() ValidationModule, Source Nodes

### Community 143 - "Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical module owns validation and what value imports must carry the .ts extension for plain Node ESM resolution?, Source Nodes

### Community 144 - "GameViewData.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: room-scoping: which ConditionEvaluator node is canonical for in-room/in-area, visited-room and topic-complete?, Source Nodes

### Community 145 - "playwright.config.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own condition scoping (in-room/in-area and progress-wide visited-room/topic-complete), and are there duplicate owners or bypasses after the room-scoping change?, Source Nodes

### Community 146 - "scenery-validation.test.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical owners for the amended event-returning phase-4 composition, hazard triggers, puzzle counters and per-puzzle scoring?, Source Nodes

### Community 147 - "TopicSelection.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How are commands parsed and what event names/view fields exist for assertions?, Source Nodes

### Community 148 - "Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: DialogueSystem TopicResolver ConversationTopic ConversationNode ActorState NpcStateDto ResolvedTopic TopicMatch ResponseStrategy ConversationPanel ConditionEvaluator EffectApplier, Source Nodes

### Community 149 - "markdownRendering.test.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: P-TAKE-01: where is takeHandler() and which canonical nodes gate take/drop and define ItemDefinition?, Source Nodes

### Community 150 - "Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: P-TAKE-01: where is the canonical take/drop handler and which item fields drive its refusal?, Source Nodes

### Community 151 - "Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: F1: does an authored refusalText of '' on a non-portable item use the fallback in takeHandler()?, Source Nodes

### Community 152 - "Q: Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the NPC runtime seams: TopicResolver, DialogueSystem, ConversationTopic/Node, ActorState, NpcStateDto, EffectApplier and the Game facade?, Source Nodes

### Community 153 - "Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: F1: which handler selects refusalText for a non-portable take, and where is the fallback literal produced?, Source Nodes

### Community 154 - "Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is room-entered built and formatted, and which nodes carry the catalogue room summary?, Source Nodes

### Community 155 - "Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How are use, put and show commands produced and which handlers map them today?, Source Nodes

### Community 156 - "Q: ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are QuizSystem, HintSystem and the composed reaction wired?, Source Nodes

### Community 157 - "Q: ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: npcs slice: NPC runtime behaviour seam locations (DialogueSystem, TopicResolver, ConversationFlow, ConversationTopic/Node, ActorState, NpcStateDto, TopicMatch, ResolvedTopic, ResponseStrategy), Source Nodes

### Community 158 - "ComposedReaction.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the authoring-only refusalText check implemented and what are the other gate owners in tools/content/schema.ts?, Source Nodes

### Community 159 - "GameEvent"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: NPC slice: where is the node-default catch and node expiry implemented and why do NODE-02 and GAP-05 share the same shape, Source Nodes

### Community 160 - "Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: NPC slice: locate DialogueSystem, TopicResolver, ConversationTopic, ConversationNode, ActorState, NpcStateDto, ResolvedTopic, TopicMatch, ResponseStrategy, ConversationPanel, ConditionEvaluator, EffectApplier, Source Nodes

### Community 161 - "Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical connected authored-effects seams for room entry, USE/PUT/SHOW, quiz and hint delivery?, Source Nodes

### Community 162 - "Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the quizzes-hints slice seam, quiz-passed condition, panel rendering and score guard?, Source Nodes

### Community 163 - "Q: ENG16-SAVECONFIRM-01: which canonical node owns the Save/Download confirmation path and should GameWindow.makeActions() route through it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which nodes own quiz and hint delivery in the quiz-hints slice?, Source Nodes

### Community 164 - "TopicResolver.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own W7 room/event rendering and the observed non-quiz runtime failures?, Source Nodes

### Community 165 - "Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Quiz and hint revision contracts: seeded Random persistence, set-flag no-op, answer aliases, automatic hint cadence, Source Nodes

### Community 166 - "Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did the QUIZ-HINT-07 room-context hint resolve to the Binary Hall instead of the switch floor?, Source Nodes

### Community 167 - "Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should a quiz retry re-set emit while ScoreTracker awards once, and which object owns the injected initial state?, Source Nodes

### Community 168 - "Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: C7 npc topic overlap gate: where do checkNpc, validateCards, ValidationOptions and Condition exclusivity live and is there an existing overlap owner?, Source Nodes

### Community 169 - "Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?, Source Nodes

### Community 170 - "Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?, Source Nodes

### Community 171 - "Q: Do ordinary browser commands autosave the game state?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?, Source Nodes

### Community 172 - "Q: Where does the area-entry life reset gate live and how can it be exercised in a browser?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?, Source Nodes

### Community 173 - "Q: How to override the Playwright baseURL in a scratchpad config?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?, Source Nodes

### Community 174 - "Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?, Source Nodes

### Community 175 - "Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?, Source Nodes

### Community 176 - "Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?, Source Nodes

### Community 177 - "Q: Bypass check: does any source outside ScorePanel reimplement the per-area Score / Rooms visited sidebar lines?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?, Source Nodes

### Community 178 - "Q: Which production node owns sidebar area-card rendering and how should it select the current area from GameViewData?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?, Source Nodes

### Community 179 - "Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?, Source Nodes

### Community 180 - "Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?, Source Nodes

### Community 181 - "Q: ENG11 browser QA: how should the W7 expectAreaConsistency helper assert sidebar state after the current-area-only change, and where does the headline score come from in a saved v1 DTO?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?, Source Nodes

### Community 182 - "Q: Which production nodes own the sidebar progress panel and how does ScorePanel.renderArea/refresh render area cards from GameViewData for ENG11?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?, Source Nodes

### Community 183 - "Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do ordinary browser commands autosave the game state?, Source Nodes

### Community 184 - "Q: Why does generated help text with newlines display as one dense paragraph in the transcript?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the area-entry life reset gate live and how can it be exercised in a browser?, Source Nodes

### Community 185 - "Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How to override the Playwright baseURL in a scratchpad config?, Source Nodes

### Community 186 - "Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?, Source Nodes

### Community 187 - "Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?, Source Nodes

### Community 188 - "Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?, Source Nodes

### Community 189 - "Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bypass check: does any source outside ScorePanel reimplement the per-area Score / Rooms visited sidebar lines?, Source Nodes

### Community 190 - "Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production node owns sidebar area-card rendering and how should it select the current area from GameViewData?, Source Nodes

### Community 191 - "Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?, Source Nodes

### Community 192 - "Q: Does the W7 trace step's entry title precede the hazard message?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?, Source Nodes

### Community 193 - "Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG11 browser QA: how should the W7 expectAreaConsistency helper assert sidebar state after the current-area-only change, and where does the headline score come from in a saved v1 DTO?, Source Nodes

### Community 194 - "Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production nodes own the sidebar progress panel and how does ScorePanel.renderArea/refresh render area cards from GameViewData for ENG11?, Source Nodes

### Community 195 - "Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?, Source Nodes

### Community 196 - "Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does generated help text with newlines display as one dense paragraph in the transcript?, Source Nodes

### Community 197 - "Q: Can the Playwright MCP browser drive the app in this session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?, Source Nodes

### Community 198 - "Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?, Source Nodes

### Community 199 - "Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?, Source Nodes

### Community 200 - "Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?, Source Nodes

### Community 201 - "Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?, Source Nodes

### Community 202 - "Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?, Source Nodes

### Community 203 - "Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?, Source Nodes

### Community 204 - "Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the W7 trace step's entry title precede the hazard message?, Source Nodes

### Community 205 - "Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?, Source Nodes

### Community 206 - "Q: Is there an existing owner for detail-suffix help rendering that detailSuffix() duplicates?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?, Source Nodes

### Community 207 - "Q: Where is the canonical help copy generated and which node owns COMMAND_TABLE / helpText() for ask and answer syntax?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel(), Source Nodes

### Community 208 - "Q: Can the Playwright MCP browser drive the app in this session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?, Source Nodes

### Community 209 - "Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this session?, Source Nodes

### Community 210 - "Q: Where is the browser-rendered help copy generated and which nodes own the issue-9 ask/bare-answer forms?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?, Source Nodes

### Community 211 - "Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?, Source Nodes

### Community 212 - "Q: Which canonical node derives a puzzle's completion effect, and is there a duplicate derivation bypassing it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?, Source Nodes

### Community 213 - "Q: E2E-22-01: does a single puzzle solve still print the friendly completion line twice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?, Source Nodes

### Community 214 - "Q: ENG28-ACTIVATION-01: which node canonically owns formatEvent transcript rendering and suppression of puzzle-activated, and is the effect/event pipeline unchanged?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?, Source Nodes

### Community 215 - "Q: ENG28-ACTIVATION-01: which canonical node owns formatEvent transcript rendering for puzzle-activated, and is render-time suppression the only compliant change?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?, Source Nodes

### Community 216 - "Q: Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?, Source Nodes

### Community 217 - "Q: ENG28-ACTIVATION-01 which nodes own puzzle-activated suppression and the effect pipeline?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?, Source Nodes

### Community 218 - "Q: Can the Playwright MCP browser drive the app in this engine-issue-16 session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Is there an existing owner for detail-suffix help rendering that detailSuffix() duplicates?, Source Nodes

### Community 219 - "Q: graphify section '6.1' — which document owns the event to view mapping?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical help copy generated and which node owns COMMAND_TABLE / helpText() for ask and answer syntax?, Source Nodes

### Community 220 - "Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this session?, Source Nodes

### Community 221 - "authoredGame"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?, Source Nodes

### Community 222 - "Q: Why do two engine-issue-9 quick-answer browser tests fail on the engine-issue-16 branch?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the browser-rendered help copy generated and which nodes own the issue-9 ask/bare-answer forms?, Source Nodes

### Community 223 - "Q: ENG16-SAVECONFIRM-01: where do the canonical Save/Download confirmation lines come from and how do sidebar buttons reach them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?, Source Nodes

### Community 224 - "GameState"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node derives a puzzle's completion effect, and is there a duplicate derivation bypassing it?, Source Nodes

### Community 225 - "HANDOFF — CompSciQuest content + W6/W7 state"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: E2E-22-01: does a single puzzle solve still print the friendly completion line twice?, Source Nodes

### Community 226 - "Q: How should browser-tester run e2e on a different port without touching playwright.config.ts for engine-issue-16?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG28-ACTIVATION-01: which node canonically owns formatEvent transcript rendering and suppression of puzzle-activated, and is the effect/event pipeline unchanged?, Source Nodes

### Community 227 - "Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG28-ACTIVATION-01: which canonical node owns formatEvent transcript rendering for puzzle-activated, and is render-time suppression the only compliant change?, Source Nodes

### Community 228 - "Q: Where are QuizView.remainingWrong and the fresh-start save writes defined, and which doc sections own them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?, Source Nodes

### Community 229 - "Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG28-ACTIVATION-01 which nodes own puzzle-activated suppression and the effect pipeline?, Source Nodes

### Community 230 - "Q: Where does autosave hook into Game.submit and where is the quarantine download button defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?, Source Nodes

### Community 231 - "w7-accessibility.spec.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?, Source Nodes

### Community 232 - "Q: ENG24-FRESHSTART-01/DEDUP-01: which nodes own fresh-start state construction and the live save write?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?, Source Nodes

### Community 233 - "Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?, Source Nodes

### Community 234 - "Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?, Source Nodes

### Community 235 - "Q: Where do autosave after submit and the quarantined-save download button live?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG16-SAVECONFIRM-01: which canonical node owns the Save/Download confirmation path and should GameWindow.makeActions() route through it?, Source Nodes

### Community 236 - "Q: ENG24 autosave: why does the post-observer trace assertion fail even though the saved DTO has final state?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?, Source Nodes

### Community 237 - "Q: Which canonical nodes own autosave on Game.submit and the five SaveControls buttons for ENG24-AUTOSAVE-01 and ENG31-REMOVEQUARANTINE-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?, Source Nodes

### Community 238 - "Q: Why do 11 unrelated e2e tests fail on the port-5224 run?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this engine-issue-16 session?, Source Nodes

### Community 239 - "Q: ENG30-REMAINING-02: where is remainingWrong derived and which QuizView node is canonical for the red tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do two engine-issue-9 quick-answer browser tests fail on the engine-issue-16 branch?, Source Nodes

### Community 240 - "ScoreTracker"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG16-SAVECONFIRM-01: where do the canonical Save/Download confirmation lines come from and how do sidebar buttons reach them?, Source Nodes

### Community 241 - "Q: MD-RENDER-01 round 1: which canonical nodes own bold-italic emphasis, raw-HTML leaf text and rejected-link labels in the markdown renderer?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should browser-tester run e2e on a different port without touching playwright.config.ts for engine-issue-16?, Source Nodes

### Community 242 - "Q: Where does putHandler() choose toOwnerId for an authored item fixture and how is putInteraction() reused?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?, Source Nodes

### Community 243 - "Q: Which canonical UI node owns the Markdown-to-DOM renderer boundary and is there an existing owner to reuse?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?, Source Nodes

### Community 244 - "persistence.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?, Source Nodes

### Community 245 - "Q: Which canonical UI node owns the Markdown-to-DOM renderer boundary and is there an existing owner to reuse?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?, Source Nodes

### Community 246 - "Q: Does mapping every item PUT target to the current room break existing parser verb contracts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?, Source Nodes

### Community 247 - "Q: MD-RENDER-01 round 1: after adding plainText() and boldItalicMarker(), are there duplicate canonical nodes, bypasses or new cross-layer edges?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does autosave hook into Game.submit and where is the quarantine download button defined?, Source Nodes

### Community 248 - "Q: MD-RENDER-01 round 1: is there an existing plain-token-text extractor or triple-marker detector to reuse before adding plainText() and boldItalicMarker()?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do autosave after submit and the quarantined-save download button live?, Source Nodes

### Community 249 - "Q: Why does a clean authored win save fail hasValidReferences and disable Continue after reload?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG24 autosave: why does the post-observer trace assertion fail even though the saved DTO has final state?, Source Nodes

### Community 250 - "validate.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own autosave on Game.submit and the five SaveControls buttons for ENG24-AUTOSAVE-01 and ENG31-REMOVEQUARANTINE-01?, Source Nodes

### Community 251 - "Q: Where are QuizView.remainingWrong, createFreshState and the fresh-start save writes defined, and which seam owns them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do 11 unrelated e2e tests fail on the port-5224 run?, Source Nodes

### Community 252 - "Q: ENG24-REANCHOR-UNIT-02: which node owns typed restart and its fresh-state save, and where is the inherited no-write loop?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are QuizView.remainingWrong and the fresh-start save writes defined, and which doc sections own them?, Source Nodes

### Community 253 - "Q: MD-RENDER-01: which canonical UI node owns the Markdown to DOM boundary?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG24-FRESHSTART-01/DEDUP-01: which nodes own fresh-start state construction and the live save write?, Source Nodes

### Community 254 - "Q: Where are the pass-line requirementLine helper, the unused QUARANTINE_DOWNLOAD_NAME export, the restart fresh-start writes, and the quiz view fields defined for ENG30 re-anchoring and fresh-start QA?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG30-REMAINING-02: where is remainingWrong derived and which QuizView node is canonical for the red tests?, Source Nodes

### Community 255 - "Q: Revision round 1: where are the two stale e2e expectations that New Game leaves storage empty and typed load restores a seeded score-7 save, now that .newGame() writes a fresh save?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are QuizView.remainingWrong, createFreshState and the fresh-start save writes defined, and which seam owns them?, Source Nodes

### Community 256 - "Q: Which seams own load confirmation, transient hint clearing on quiz retry, and the quiz requirement aria-live region?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does any second node implement a conditional use effect or authored useText mapping outside the canonical producer?, Source Nodes

### Community 257 - "Q: Why does typing hint after a switchyard quiz retry say there is nothing more to suggest, and how should the browser e2e reach a fresh hint?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the conditional use producer, authored useText mapping and condition gate owned for W6S-01..04?, Source Nodes

### Community 258 - "Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG24-REANCHOR-UNIT-02: which node owns typed restart and its fresh-state save, and where is the inherited no-write loop?, Source Nodes

### Community 259 - "Q: Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the pass-line requirementLine helper, the unused QUARANTINE_DOWNLOAD_NAME export, the restart fresh-start writes, and the quiz view fields defined for ENG30 re-anchoring and fresh-start QA?, Source Nodes

### Community 260 - "Q: Why is Continue disabled after reloading a full authored win save?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision round 1: where are the two stale e2e expectations that New Game leaves storage empty and typed load restores a seeded score-7 save, now that .newGame() writes a fresh save?, Source Nodes

### Community 261 - "Q: Is the zone-1 turns-since hint dead end a content-authoring issue rather than an engine bug, and what content options exist?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ward-w7-fixes: canonical owners for parser aliases, unlock denial, quiz starts, hint targets, Source Nodes

### Community 262 - "Q: Which node owns grant-item inventory mutation and how does it keep one owner per item?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which seams own load confirmation, transient hint clearing on quiz retry, and the quiz requirement aria-live region?, Source Nodes

### Community 263 - "Q: Does grant-item need a new helper to remove authored initialRoom copies?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does typing hint after a switchyard quiz retry say there is nothing more to suggest, and how should the browser e2e reach a fresh hint?, Source Nodes

### Community 264 - "Q: Why did the full-win e2e fail after the F3 ownership fix, and which failures were e2e fixture mistakes rather than product gaps?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: W7F-01..14: which canonical owners implement parser aliases, unlock splitting, gate denial, blockedText shape/adapt, quiz idempotence, transfer announcement, title copy and room hint targets?, Source Nodes

### Community 265 - "Q: MD-RENDER-01: which canonical UI node owns the marked DOM-only renderer boundary for transcript and panel Markdown?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes supply the approved title copy, help aliases and gate fallback that the four stale e2e assertions must re-anchor?, Source Nodes

### Community 266 - "Q: MD-RENDER-01: is there an existing link allowlist or text-node helper to reuse?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do four W7 browser tests still fail after the string re-anchor, and is it caused by this slice?, Source Nodes

### Community 267 - "Q: MD-RENDER-01: why do seven tests fail after the renderer is implemented?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own browser save seeding and continuation for gated later-area e2e traces?, Source Nodes

### Community 268 - "Q: FakeElement FakeDocument .createTextNode() installFakeDocument() OutputLog appendLine() — which node owns the fake text-node tagName casing that caused markdown renderer test failures?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which accepted sources own the hub escape reply and interface room prose re-anchored in W7 Beat C, and the 23-room bundle count?, Source Nodes

### Community 269 - "markdownTranscript.test.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: After the W6 handoff regeneration, which accepted sources own the revised hub and interface room prose asserted by W7 Beat C?, Source Nodes

### Community 270 - "Q: MD-RENDER-02/11/15: which canonical nodes own the ___person___ bold-italic shape, raw HTML newline preservation and rejected-link label text?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which code paths own wrong-order unlock refusal and arrival scenery examine, Source Nodes

### Community 271 - "Q: Which UI nodes own transcript echo, panel channels and the fake DOM for MD-UI-01 to MD-UI-10?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?, Source Nodes

### Community 272 - "Q: QuizPanel .refresh() requirementLine() FakeElement createTextNode() OutputLog — how is the quiz requirement rendered and how does the fake text node expose tagName for UI-PASSMARK-A11Y-03?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the WR2-B1 wrong-order unlock refusal, WR2-B2 item-first unlock preservation and WR2-E1 arrival scenery examine contracts?, Source Nodes

### Community 273 - "BareQuizAnswer.test.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns arrival register/record/mark scenery prose for WR2-E1?, Source Nodes

### Community 274 - "CommandTable.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns wrong-order unlock refusal for a non-portable item offered as the key-like item (WR2-B1)?, Source Nodes

### Community 275 - "SaveActions"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bypass check on WR2-B1 refusal literal and WR2-E1 arrival scenery prose: any reimplementation outside the canonical hub?, Source Nodes

### Community 276 - "content/index.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the approved dial blocked string pinned in tests, and which authority superseded it in round 2?, Source Nodes

### Community 277 - "common.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?, Source Nodes

### Community 278 - "NPCs and conversation"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do the record and mark aliases in the room-arrival SCENERY entry make resolveScenery ambiguous?, Source Nodes

### Community 279 - "Q: MD-UI-01: which canonical UI nodes own the plain/Markdown transcript channels and how do appendPlain, appendMarkdownBlock and appendMarkdownInline reuse them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why is Continue disabled after reloading a full authored win save?, Source Nodes

### Community 280 - "engine-issue-30-passmark.spec.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Is the zone-1 turns-since hint dead end a content-authoring issue rather than an engine bug, and what content options exist?, Source Nodes

### Community 281 - "GameStateDto"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did eleven e2e tests fail after the round-2 ward card regeneration, and how were stale expectations re-anchored?, Source Nodes

### Community 282 - "Q: MD-UI-01 reviewer-FAIL round: which graph nodes own block/inline markdown channels, quiz requirement order and GameWindow event routing?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does a crafted v1 save with empty room inventories make 'unlock practice cabinet with practice key' return 'I don't understand that.'?, Source Nodes

### Community 283 - "HintRetry.test.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the coverage graph supply the round-2 dial blocked string, the saving keyword and the state-true hub/Interface prose?, Source Nodes

### Community 284 - "engine-issue-30-passmark.test.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does putHandler() choose toOwnerId for an authored item fixture and how is putInteraction() reused?, Source Nodes

### Community 285 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does mapping every item PUT target to the current room break existing parser verb contracts?, Source Nodes

### Community 286 - "HintSystem"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does a clean authored win save fail hasValidReferences and disable Continue after reload?, Source Nodes

### Community 287 - "domain.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, the existing answer paths and the outside-quiz unknown path?, Source Nodes

### Community 288 - "Q: COMMAND_TABLE helpText() CommandSpec DIRECTIONS describeRoom() scoreHandler() formatEvent() topicLabel() RoomSummary — which canonical nodes own grouped help and room-entry text?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns exact displayed quiz option text as an answer, and where should the WR3-A1 fix and shared option-text normalisation live?, Source Nodes

### Community 289 - "Q: MD-HELP-01/MD-STATUS-01 round 1: which canonical nodes own the 21-verb COMMAND_TABLE group split, the Saves help section, and the four-entry room heading?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node owns grant-item inventory mutation and how does it keep one owner per item?, Source Nodes

### Community 290 - "Q: Which canonical nodes own generated help text, transcript rendering and the four-part room heading for the MD-HELP-01/MD-STATUS-01 e2e updates?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does grant-item need a new helper to remove authored initialRoom copies?, Source Nodes

### Community 291 - "ValidationModule"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can a Playwright e2e test retry quiz starts until a target option is not the final question?, Source Nodes

### Community 292 - "eslint@^10.15.0"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does a wrong free-text quiz answer receive the quiz's out-of-range string?, Source Nodes

### Community 293 - "prettier@^3.10.1"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, answer N/bare N and the outside-quiz unknown path?, Source Nodes

### Community 294 - "Q: Why did the full-win e2e fail after the F3 ownership fix, and which failures were e2e fixture mistakes rather than product gaps?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did the full-win e2e fail after the F3 ownership fix, and which failures were e2e fixture mistakes rather than product gaps?, Source Nodes

### Community 295 - "Q: WR4-B1/B2/C1: which canonical nodes own put/take placement feedback, transfer-item ownership and out-of-room give feedback?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: WR4-B1/B2/C1: which canonical nodes own put/take placement feedback, transfer-item ownership and out-of-room give feedback?, Source Nodes

### Community 296 - "Q: Where are item ownership and current-room visibility owned, and can a block placed in a visible fixture stay nameable?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are item ownership and current-room visibility owned, and can a block placed in a visible fixture stay nameable?, Source Nodes

### Community 297 - "Q: Can out-of-room give/show with an unresolvable item emit the canonical absence line without a new Command variant or content card?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can out-of-room give/show with an unresolvable item emit the canonical absence line without a new Command variant or content card?, Source Nodes

### Community 298 - "Q: Who owns the fallback source owner for a take when no visible open container branch applies (WR4-B1 closed-cabinet retrieval)?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns the fallback source owner for a take when no visible open container branch applies (WR4-B1 closed-cabinet retrieval)?, Source Nodes

### Community 299 - "Q: Where do putHandler(), takeHandler(), describeTarget(), ItemVisibility, formatEvent(), GameEvent, TitleScreen, SaveControls and GameViewData live, and what real event names and view fields should browser assertions use?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do putHandler(), takeHandler(), describeTarget(), ItemVisibility, formatEvent(), GameEvent, TitleScreen, SaveControls and GameViewData live, and what real event names and view fields should browser assertions use?, Source Nodes

### Community 300 - "Q: Does the assistance orientation quiz always present questions in the authored questionIds order?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the assistance orientation quiz always present questions in the authored questionIds order?, Source Nodes

### Community 301 - "Q: Why does a save written immediately after 'place practice block in practice cabinet' get quarantined as invalid-content on reload?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does a save written immediately after 'place practice block in practice cabinet' get quarantined as invalid-content on reload?, Source Nodes

### Community 302 - "Q: WR4 persistence blocker: which canonical SaveManager nodes reject a state.rooms key that is a fixture item ID holding a placed item?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: WR4 persistence blocker: which canonical SaveManager nodes reject a state.rooms key that is a fixture item ID holding a placed item?, Source Nodes

### Community 303 - "Q: Which SaveManager reference validation quarantines a fixture-owned item inventory key, and what is the smallest canonical fix?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which SaveManager reference validation quarantines a fixture-owned item inventory key, and what is the smallest canonical fix?, Source Nodes

### Community 304 - "Q: After the SaveManager fix, does a save written with the practice block placed in the fixture cabinet reload with Continue enabled, and is the invalid-json quarantine path still intact?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: After the SaveManager fix, does a save written with the practice block placed in the fixture cabinet reload with Continue enabled, and is the invalid-json quarantine path still intact?, Source Nodes

### Community 305 - "Q: Where is the out-of-room give/show absence feedback handled and is a new Command variant required?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the out-of-room give/show absence feedback handled and is a new Command variant required?, Source Nodes

### Community 306 - "Q: WR4-C1-FIX browser QA: which canonical nodes own out-of-room give/show feedback and the real transcript/state fields?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: WR4-C1-FIX browser QA: which canonical nodes own out-of-room give/show feedback and the real transcript/state fields?, Source Nodes

### Community 307 - ".prettierrc.json"
Cohesion: 0.40
Nodes (4): printWidth, proseWrap, singleQuote, trailingComma

### Community 308 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Where is P-TAKE-01 takeHandler and what governs portable items?

### Community 309 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Find a document heading node named Room entry text

### Community 310 - "Q: graphify section '6.1' — which document owns the event to view mapping?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: graphify section '6.1' — which document owns the event to view mapping?

### Community 311 - "Q: Which coverage-graph nodes document the tutorial-complete gate for hub east/north?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Which coverage-graph nodes document the tutorial-complete gate for hub east/north?

### Community 312 - "QuizRevision.test.ts"
Cohesion: 0.21
Nodes (8): activeQuiz(), answerCorrectly(), quizDispatch(), quizState(), SeededRandom, SeededRandomPort, startEffect(), readSave()

### Community 314 - "npc.ts"
Cohesion: 0.42
Nodes (8): allEffects(), authoringOf(), checkNpc(), defaultTopicFindings(), nodeTopicFindings(), readyStateFindings(), reservedFindings(), topicActorFindings()

### Community 315 - "SaveDto.ts"
Cohesion: 0.43
Nodes (4): QuarantineDto, LoadFailureReason, loadFailureMessage(), MESSAGES

### Community 318 - "area-score-attribution.test.ts"
Cohesion: 0.70
Nodes (4): areaFor(), ejectionFixture(), progressRow(), scoredBinaryHallBundle()

### Community 319 - "Effect"
Cohesion: 0.25
Nodes (10): 1. Purpose and authority, 7. Core contracts, 1. Scope, 1. Purpose, 3.2 Entity and system state, Effect, Hazard, HazardCatalogue (+2 more)

## Knowledge Gaps
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `GameWindow` (13× useful, score=12.749729828)
- `EffectApplier` (9× useful, score=8.676128419)
- `transferItem()` (8× useful, score=7.904590767)
- `ContentBundle` (8× useful, score=7.642653848)
- `COMMAND_TABLE` (7× useful, score=6.926034453)
- `resolveGameCommand()` (7× useful, score=6.802933398)
- `helpText()` (6× useful, score=5.936960929)
- `TopicResolver` (6× useful, score=5.806478593)
- `inventoryOf()` (5× useful, score=4.966846455)
- `takeHandler()` (5× useful, score=4.906157091)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"
- "How to override the Playwright baseURL in a scratchpad config?" -> `playwright.config.ts`, `baseURL`
- "graphify section '6.1' — which document owns the event to view mapping?"
- "Can the Playwright MCP browser drive the app in this session?" -> `playwright.config.ts`, `helpers.ts`
- "Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?" -> `playwright.config.ts`, `helpers.ts`
- "Can the Playwright MCP browser tools drive the app in this browser-tester session?" -> `playwright.config.ts,helpers.ts`
- "Can the Playwright MCP browser drive the app in this engine-issue-16 session?" -> `playwright.config.ts`, `SaveControls`, `OutputLog`
- "Why do 11 unrelated e2e tests fail on the port-5224 run?" -> `engine-issue-9-quick-answers.spec.ts,engine-issue-11.spec.ts,engine-issue-25.spec.ts,QuizPanel,ScorePanel,helpers.ts`
- "Which coverage-graph nodes document the tutorial-complete gate for hub east/north?"
- "Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?" -> `src_core_puzzles_puzzlesystem_advancecounters,HintSystem,PuzzleSystem`
- "Can the coverage graph supply the round-2 dial blocked string, the saving keyword and the state-true hub/Interface prose?" -> `Room: The Interface (room_entry_interface)`, `GameStateDto`
- "Do style.css, .output-log and .table-scroll exist as labels in graphify-out/graph.json for MD-CSS browser QA?"
- "Does the coverage graph (docs/graphify-out/graph.json) describe the Markdown transcript CSS requirements in spec sections 8 and 10.12?"

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `PlacedBlockClosure.test.ts`, `catalogueOf`, `area-progress.test.ts`, `Issues`, `authoredGame`, `SaveManager.ts`, `verbs/index.ts`, `engine-followups-2-hintretry.spec.ts`, `contentToolchain.ts`, `zone1.ts`, `topicOverlap.ts`, `persistence.ts`, `Game`, `ContentBundle.ts`, `stringList`, `GameEvent`, `GameWindow.ts`, `mechanics.ts`, `QuizRevision.test.ts`, `SaveDto.ts`, `area-score-attribution.test.ts`, `game-fresh-start-seam.test.ts`, `parser.ts`, `authored.ts`, `Q: Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?`, `CommandTable.test.ts`, `Q: Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?`, `AreaChangeLifeGate.test.ts`, `LoadConfirmation.test.ts`, `ScoreTracker.ts`, `validateContent.ts`, `Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts`, `RecordingGame`, `Q: Do the revision-1 helpers bypass validateContent(), finding() or collection()?`, `GameStateDto`, `Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?`, `W7GateFeedback.test.ts`, `Round2UnlockRefusal.test.ts`, `TopicSelection.test.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Should `helpers.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.049442457395329265 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `Random`, `PlacedBlockClosure.test.ts`, `Effect`, `catalogueOf`, `area-progress.test.ts`, `authoredGame`, `SaveManager.ts`, `verbs/index.ts`, `engine-followups-2-hintretry.spec.ts`, `zone1.ts`, `topicOverlap.ts`, `content/index.ts`, `persistence.ts`, `Game`, `Game`, `TopicSelection.ts`, `NpcGates.test.ts`, `ContentBundle.ts`, `stringList`, `SaveManager.ts`, `GameEvent`, `adapt.ts`, `commandResolution.ts`, `GameWindow.ts`, `PuzzleGraph.ts`, `ScoreTracker`, `generate.ts`, `common.ts`, `mechanics.ts`, `area-score-attribution.test.ts`, `Effect`, `Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?`, `parser.ts`, `authored.ts`, `main.ts`, `GameState.ts`, `AreaChangeLifeGate.test.ts`, `LoadConfirmation.test.ts`, `Command`, `ScoreTracker.ts`, `validateContent.ts`, `Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts`, `Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?`, `PuzzleSystem.ts`, `Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `Random` be split into smaller, more focused modules?**
  _Cohesion score 0.13675213675213677 - nodes in this community are weakly interconnected._
- **Why does `GameState` connect `GameState.ts` to `Random`, `PlacedBlockClosure.test.ts`, `Effect`, `catalogueOf`, `area-progress.test.ts`, `authoredGame`, `SaveManager.ts`, `verbs/index.ts`, `engine-followups-2-hintretry.spec.ts`, `zone1.ts`, `GameStateDto`, `topicOverlap.ts`, `persistence.ts`, `Game`, `TopicSelection.ts`, `stringList`, `SaveManager.ts`, `GameEvent`, `ConversationFlow.ts`, `PuzzleGraph.ts`, `common.ts`, `mechanics.ts`, `Storage schema`, `ContentBundle`, `Shared rule spine`, `Effect`, `Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?`, `parser.ts`, `authored.ts`, `CommandTable.test.ts`, `InteractionRules.ts`, `Command`, `ScoreTracker.ts`, `Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts`, `Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?`, `PuzzleSystem.ts`, `Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?`, `TopicSelection.test.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._