# Graph Report - brave-wolf  (2026-11-27)

## Corpus Check
- 514 files · ~237,457 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 3563 nodes · 9212 edges · 294 communities (286 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 476 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e15b9216`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- w7-full-win-trace.ts
- npcTopicOverlap.ts
- w7-opening-walkthrough.spec.ts
- Effect
- helpers.ts
- Graph trace from the handoff round
- Issues
- ui.ts
- HintSystem.ts
- SaveManager.ts
- verbs/index.ts
- engine-followups-2-hintretry.spec.ts
- LoadConfirmation.test.ts
- npcs.ts
- HelpOutput.test.ts
- zone1.ts
- parser.ts
- EffectApplier.ts
- topicOverlap.ts
- Command
- content.ts
- compilerOptions
- Game
- Parser.ts
- engine-issue-15-life-gate.spec.ts
- NpcGates.test.ts
- Quiz combat
- stringList
- FakeRandom
- Content authoring rules
- ContentBundle
- contentToolchain.ts
- Documentation style guide
- commandResolution.ts
- Game.ts
- asText
- scripts
- PuzzleGraph.ts
- 4. Design card format
- ConversationFlow.ts
- opencode.json
- Position
- generate.ts
- authored.ts
- Content toolchain
- Q: MD-UI-01 round 1: which canonical UI node owns block vs inline transcript channels after removing the NUMBERED_OPTION heuristic, and can the first MD-UI-09 test stay green?
- common.ts
- asRecord
- renderMarkdown.ts
- devDependencies
- package.json
- Q: MD-UI-01 round 2: which canonical UI node owns ordered-list numbering (OL start) and the transcript block channel for formatted event lines?
- Q: MD-HELP and MD-STATUS: which canonical nodes own generated help, room entry lines and status copy?
- Random
- deploy.yml
- FakeElement
- tsconfig.json
- LoadResult
- NpcTypes.test.ts
- Favicon.test.ts
- Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?
- QuizRevision.test.ts
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
- AuthoredWinPath.test.ts
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- node-shims.d.ts
- Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?
- GameViewData.ts
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

## God Nodes (most connected - your core abstractions)
1. `vitest` - 122 edges
2. `ContentBundle` - 118 edges
3. `GameEvent` - 105 edges
4. `GameState` - 86 edges
5. `asText()` - 62 edges
6. `finding()` - 58 edges
7. `Effect` - 56 edges
8. `Command` - 54 edges
9. `makeBundle()` - 50 edges
10. `FakeRandom` - 49 edges

## Surprising Connections (you probably didn't know these)
- `Batch E1 — onboarding and intuitive commands` --references--> `TitleScreen`  [INFERRED]
  ENGINE_ISSUES.md → src/ui/TitleScreen.ts
- `H — Hazards and hints` --references--> `HintSystem`  [INFERRED]
  docs/developer/content-rules.md → src/core/hints/HintSystem.ts
- `5. Hints` --references--> `HintSystem`  [INFERRED]
  docs/developer/puzzles.md → src/core/hints/HintSystem.ts
- `5. Hints` --references--> `ScoreTracker`  [INFERRED]
  docs/developer/combat.md → src/core/scoring/ScoreTracker.ts
- `6. Integration points` --references--> `Command`  [INFERRED]
  docs/developer/puzzles.md → src/core/commands/Command.ts

## Import Cycles
- None detected.

## Communities (294 total, 8 thin omitted)

### Community 0 - "w7-full-win-trace.ts"
Cohesion: 0.08
Nodes (36): GATE_FLAGS, MILL_FLAGS, NON_QUIZ_PUZZLES, RAIL_FLAGS, SCRIPTED_HAZARDS, UNSEEN_HAZARDS, assertOutcome(), assertState() (+28 more)

### Community 1 - "npcTopicOverlap.ts"
Cohesion: 0.07
Nodes (89): aliasProblems(), aliasProblemsOf(), asRecord(), budgetProblems(), catalogueIds(), coverageProblems(), DEFERRED_GATES, DIRECTIONS (+81 more)

### Community 2 - "w7-opening-walkthrough.spec.ts"
Cohesion: 0.18
Nodes (21): expectHazardOutcome(), hazardAnnouncement(), command(), enter(), expectEntry(), expectFlags(), expectOwners(), expectPosition() (+13 more)

### Community 3 - "Effect"
Cohesion: 0.10
Nodes (19): 1. Purpose and authority, 7. Core contracts, 1. Purpose, 3.2 Entity and system state, Effect, Hazard, HazardCatalogue, FiredThisTurn (+11 more)

### Community 4 - "helpers.ts"
Cohesion: 0.05
Nodes (53): continueFromSave(), continueSavedGame(), liveTurn(), command(), DEBUG_FRAGMENTS, continueFrom(), delta(), SaveEnvelope (+45 more)

### Community 5 - "Graph trace from the handoff round"
Cohesion: 0.09
Nodes (21): MultiwordAlias, progress(), 1. Multi-ID topic resolution, 3. Exhausted `once` defaults, 4. Empty-progress completion, 5. Malformed interaction containers, 6. Strict EXAMINE item fields, 7. Named signature contract (+13 more)

### Community 6 - "Issues"
Cohesion: 0.04
Nodes (47): Batch E1 — onboarding and intuitive commands, Batch E1 — Onboarding and intuitive commands (planning-led), Batch E2 — engine fixes and removals, Batch E2 — Engine fixes and removals (single implementation batch), Batches, Decisions settled with the user, Definition of done, Engine issues — batched hand-off (+39 more)

### Community 7 - "ui.ts"
Cohesion: 0.12
Nodes (34): makeEnvelope(), SAVE_KEY, allText(), Bootstrap, BootstrapDependencies, descendants(), documentState, FakeBus (+26 more)

### Community 8 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.09
Nodes (40): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+32 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.10
Nodes (38): describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible(), matchingInteraction(), normalise() (+30 more)

### Community 11 - "engine-followups-2-hintretry.spec.ts"
Cohesion: 0.06
Nodes (38): AuthoredQuestion, AuthoredQuiz, displayedQuestion(), enterSwitchFloorQuiz(), expectHintHidden(), hintPanel(), numberedOptions(), questionFor() (+30 more)

### Community 12 - "LoadConfirmation.test.ts"
Cohesion: 0.31
Nodes (8): asFake(), AuthoredFixture, CANONICAL_EVENT_TYPES, logLines(), mountWindow(), noop(), pressLoadEnter(), seededGame()

### Community 13 - "npcs.ts"
Cohesion: 0.06
Nodes (70): 2. Model, 2. Model, 2. Model, 5. Quiz attempts, createFromDto(), stateToDto(), HazardStateDto, NpcStateDto (+62 more)

### Community 14 - "HelpOutput.test.ts"
Cohesion: 0.13
Nodes (20): CommandSpec, CommandTableModule, DirectionSpec, hasCommandToken(), HELP_GROUPS, HelpGroup, loadCommandTable(), loadVerbTable() (+12 more)

### Community 15 - "zone1.ts"
Cohesion: 0.10
Nodes (33): acceptedCards(), generatedRoomIds(), zone1Cards(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES (+25 more)

### Community 16 - "parser.ts"
Cohesion: 0.12
Nodes (18): 5. Conversation nodes, ParsedCommand, CHEST_ID, DOOR_ID, KEY_B, loadTokenizer(), makeParserState(), makeParserStateDto() (+10 more)

### Community 17 - "EffectApplier.ts"
Cohesion: 0.09
Nodes (40): Parallel execution, quizView(), areaPairForRoom(), areaPairForTopic(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, applyBookkeepingEffect() (+32 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (34): asRecord(), ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf() (+26 more)

### Community 19 - "Command"
Cohesion: 0.21
Nodes (13): 5.1 Door and container verbs, 5.2 Verb table and handler signature, 5. Canonical command union and verbs, Command, CommandHandler, hasItem(), isTalking(), message() (+5 more)

### Community 20 - "content.ts"
Cohesion: 0.13
Nodes (31): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+23 more)

### Community 21 - "compilerOptions"
Cohesion: 0.08
Nodes (26): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+18 more)

### Community 22 - "Game"
Cohesion: 0.09
Nodes (21): 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, Persistence and UI, 7. State, events and UI, GameViewData, appendMarkdownBlock(), appendMarkdownInline() (+13 more)

### Community 23 - "Parser.ts"
Cohesion: 0.20
Nodes (12): DIRECTION_NAMES, DIRECTION_SHORTCUTS, DIRECTION_TOKENS, HYPHENATED_VERBS, hyphenatedVerb(), isDirection(), isPunctuationAlias(), MULTIWORD_ALIASES (+4 more)

### Community 24 - "engine-issue-15-life-gate.spec.ts"
Cohesion: 0.18
Nodes (11): command(), firstId(), GATE_IDS, gateIds(), GateOverrides, liveSave(), savedState(), SaveState (+3 more)

### Community 25 - "NpcGates.test.ts"
Cohesion: 0.10
Nodes (24): gateFindings(), CardData, cleanParsedSet(), definition(), roomData(), actor(), Data, EmittedNode (+16 more)

### Community 26 - "Quiz combat"
Cohesion: 0.50
Nodes (4): 1. Scope, 4. Commands and events, 5. Hints, Quiz combat

### Community 27 - "stringList"
Cohesion: 0.30
Nodes (13): asObjectArray(), stringList(), checkPuzzle(), clueFindings(), cycleFindings(), dependencyFindings(), puzzleFindings(), AO_TAGS (+5 more)

### Community 28 - "FakeRandom"
Cohesion: 0.09
Nodes (56): createEffectApplier(), puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, DOOR_FLAG (+48 more)

### Community 30 - "Content authoring rules"
Cohesion: 0.09
Nodes (22): 1. Purpose and authority, 2. Workflow gates, 3. Rule catalogue, 5. ID and alias registry, 6.1 Content critic, 6.2 PCK reviewer, 6. Reviewer rubrics, 7. Structural validation gates (+14 more)

### Community 31 - "ContentBundle"
Cohesion: 0.08
Nodes (37): 3.1 Catalogue shape, 8. Behavioural signatures, 2. Authoring format, ActorDefinition, AreaDefinition, actorStates, actors, hints (+29 more)

### Community 32 - "contentToolchain.ts"
Cohesion: 0.10
Nodes (22): Data, PER_AREA_PATHS, AREA_ID, CardFile, expectSameMembers(), GATE_NAMES, GeneratorModule, HAZARDS_PATH (+14 more)

### Community 33 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 34 - "commandResolution.ts"
Cohesion: 0.15
Nodes (24): actorAndRemainder(), answerCommand(), bareAnswerCommand(), conversationCommand(), DIRECTION_BY_TOKEN, directionCommand(), fallbackPair(), inferAskActor() (+16 more)

### Community 35 - "Game.ts"
Cohesion: 0.10
Nodes (25): createComposedReaction(), adoptSeed(), createGame(), END_STATE_COMMANDS, initialBatch(), recordSeed(), MetaAction, createQuizSystem() (+17 more)

### Community 36 - "asText"
Cohesion: 0.15
Nodes (45): allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), collection(), finding(), idsOf() (+37 more)

### Community 37 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 38 - "PuzzleGraph.ts"
Cohesion: 0.48
Nodes (6): cycleIds(), firstReady(), puzzleGraphFindings(), repeatedIds(), solveOrder(), unreachableIds()

### Community 39 - "4. Design card format"
Cohesion: 0.25
Nodes (8): 4.1.1 Markdown and affordance formatting, 4.1 Common conventions, 4.2 Area and rooms card, 4.4 Quiz card, 4.5 Puzzle card, 4.6 Hazard card, 4.7 Hint card, 4. Design card format

### Community 40 - "ConversationFlow.ts"
Cohesion: 0.19
Nodes (23): activeNode(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode(), fallBackAfterOnce() (+15 more)

### Community 41 - "opencode.json"
Cohesion: 0.12
Nodes (16): command, type, default_agent, experimental, subagent_depth, command, type, mcp (+8 more)

### Community 42 - "Position"
Cohesion: 0.28
Nodes (10): 6.3 Room entry, score and spec-topic mapping, Core, 11. Invariants the implementation must keep, 3. Condition, AreaProgress, Exit, Room, Precondition (+2 more)

### Community 43 - "generate.ts"
Cohesion: 0.08
Nodes (31): 3. Scaffolds, CONTENT_ROOT, COVERAGE_PATH, coverageOptions(), diskIo(), main(), printFindings(), readCards() (+23 more)

### Community 44 - "authored.ts"
Cohesion: 0.14
Nodes (19): AuthoredStateOptions, changedFlags(), eventTypes(), FOREMAN_ID, gameplaySnapshot(), producerState(), ProducerStateOptions, requirementFlags() (+11 more)

### Community 45 - "Content toolchain"
Cohesion: 0.40
Nodes (5): 1. Purpose, 4. Validation, 6. Ownership, 7. Coverage-graph extraction, Content toolchain

### Community 46 - "Q: MD-UI-01 round 1: which canonical UI node owns block vs inline transcript channels after removing the NUMBERED_OPTION heuristic, and can the first MD-UI-09 test stay green?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-UI-01 round 1: which canonical UI node owns block vs inline transcript channels after removing the NUMBERED_OPTION heuristic, and can the first MD-UI-09 test stay green?, Source Nodes

### Community 47 - "common.ts"
Cohesion: 0.17
Nodes (21): Finding, ParsedCardSet, asNumber(), CardEntry, EFFECT_KINDS, checkHazard(), effectFindings(), scheduleFindings() (+13 more)

### Community 48 - "asRecord"
Cohesion: 0.17
Nodes (14): CardSet, ParseResult, asArray(), AUTHORING_KEYS, cardShape, COLLECTION_KEYS, entriesShape, entryShape (+6 more)

### Community 49 - "renderMarkdown.ts"
Cohesion: 0.28
Nodes (21): isAllowedLink(), ALIGNMENTS, boldItalicMarker(), childTokens(), collapseNewlines(), elementOfNodes(), inlineElement(), literalText() (+13 more)

### Community 50 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, markdownlint-cli2@^0.24.2, playwright@1.65.1, typescript@npm:@typescript/typescript6@^6.0.2, typescript-7@npm:typescript@^7.0.2, vite@^8.3.8, vitest@^5.1.1, zod@^4.6.7 (+5 more)

### Community 51 - "package.json"
Cohesion: 0.17
Nodes (12): dependencies, marked@^18, description, @types/node@^26.6.10, yaml@^2.9.1, name, private, type (+4 more)

### Community 52 - "Q: MD-UI-01 round 2: which canonical UI node owns ordered-list numbering (OL start) and the transcript block channel for formatted event lines?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-UI-01 round 2: which canonical UI node owns ordered-list numbering (OL start) and the transcript block channel for formatted event lines?, Source Nodes

### Community 53 - "Q: MD-HELP and MD-STATUS: which canonical nodes own generated help, room entry lines and status copy?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-HELP and MD-STATUS: which canonical nodes own generated help, room entry lines and status copy?, Source Nodes

### Community 54 - "Random"
Cohesion: 0.15
Nodes (19): EffectApplier, HazardSystemDependencies, HintSystemDependencies, NpcDependencies, FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient(), isPossessionOnly() (+11 more)

### Community 55 - "deploy.yml"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 56 - "FakeElement"
Cohesion: 0.07
Nodes (14): absentElement(), FakeDocument, FakeElement, hasMatchingAncestors(), isTokenMatch(), makeFakeDocument(), logLines(), pressEnter() (+6 more)

### Community 58 - "LoadResult"
Cohesion: 0.13
Nodes (5): LoadResult, RecordingGame, RecordingGameOptions, BootSetupOptions, FakeSaveManager

### Community 59 - "NpcTypes.test.ts"
Cohesion: 0.17
Nodes (14): 4.3 NPC card, TopicResolver, HintLevel, ConversationNode, ConversationTopic, ResponseStrategy, TopicMatch, DeclaredObjectPhrase (+6 more)

### Community 60 - "Favicon.test.ts"
Cohesion: 0.28
Nodes (5): attributes(), FAVICON_PATH, iconLinks(), INDEX_PATH, linkElements()

### Community 61 - "Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?, Source Nodes

### Community 62 - "QuizRevision.test.ts"
Cohesion: 0.21
Nodes (7): activeQuiz(), answerCorrectly(), quizDispatch(), quizState(), SeededRandom, SeededRandomPort, startEffect()

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

### Community 139 - "AuthoredWinPath.test.ts"
Cohesion: 0.16
Nodes (6): AuthoredRun, gateFlag(), lastQuestion(), lastWinningBatch(), MILL_FLAGS, TRACE_FLAGS

### Community 140 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Where is P-TAKE-01 takeHandler and what governs portable items?

### Community 141 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Find a document heading node named Room entry text

### Community 143 - "Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?, Source Nodes

### Community 144 - "GameViewData.ts"
Cohesion: 0.14
Nodes (14): AreaProgressView, ConversationView, HintView, SpecTopicView, SpecStatus, appendLine(), renderArea(), renderTopic() (+6 more)

### Community 146 - "scenery-validation.test.ts"
Cohesion: 0.13
Nodes (17): cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), CardSet, cardText(), conformingCardSet(), ParseResult (+9 more)

### Community 147 - "TopicSelection.ts"
Cohesion: 0.21
Nodes (20): 7.1 Free-text topic-overlap proof, AskTellMatch, chooseCandidate(), exactDeclaredTopic(), findDefaultTopic(), GiveShowMatch, hasKeyword(), hasObjectMatch() (+12 more)

### Community 148 - "Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?, Source Nodes

### Community 149 - "markdownRendering.test.ts"
Cohesion: 0.19
Nodes (12): allNodes(), assertClean(), declaredClasses(), elementTags(), fakeNode(), find(), hasClass(), loadRenderer() (+4 more)

### Community 150 - "Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?, Source Nodes

### Community 151 - "Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?, Source Nodes

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
Cohesion: 0.13
Nodes (17): 1. Scope, 3. Execution, 4. Failure consequences, 5. Content, 6. Events and UI, Hazards, 1. Scope, 3. Completion detection (+9 more)

### Community 159 - "GameEvent"
Cohesion: 0.06
Nodes (28): GameEvent, RoomSummary, SchedulerContract, RecordingBus, EventBusFactory, FormatEventFunction, loadFormatEvent(), BUNDLE (+20 more)

### Community 160 - "Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?, Source Nodes

### Community 161 - "Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?, Source Nodes

### Community 162 - "Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?, Source Nodes

### Community 163 - "Q: ENG16-SAVECONFIRM-01: which canonical node owns the Save/Download confirmation path and should GameWindow.makeActions() route through it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG16-SAVECONFIRM-01: which canonical node owns the Save/Download confirmation path and should GameWindow.makeActions() route through it?, Source Nodes

### Community 164 - "TopicResolver.ts"
Cohesion: 0.16
Nodes (14): createNameResolver(), actorKeywordTopic(), createTopicResolver(), hasKeyword(), isBoundToActor(), ResolvedTopic, AskTellMatch, collectMatches() (+6 more)

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

### Community 218 - "Q: Can the Playwright MCP browser drive the app in this engine-issue-16 session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this engine-issue-16 session?, Source Nodes

### Community 219 - "Q: graphify section '6.1' — which document owns the event to view mapping?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: graphify section '6.1' — which document owns the event to view mapping?

### Community 220 - "Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?, Source Nodes

### Community 221 - "authoredGame"
Cohesion: 0.18
Nodes (11): activeQuizState(), authoredBundle, authoredGame(), authoredState(), seededNpcs(), staleHintGame(), viewFor(), areaFor() (+3 more)

### Community 222 - "Q: Why do two engine-issue-9 quick-answer browser tests fail on the engine-issue-16 branch?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do two engine-issue-9 quick-answer browser tests fail on the engine-issue-16 branch?, Source Nodes

### Community 223 - "Q: ENG16-SAVECONFIRM-01: where do the canonical Save/Download confirmation lines come from and how do sidebar buttons reach them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG16-SAVECONFIRM-01: where do the canonical Save/Download confirmation lines come from and how do sidebar buttons reach them?, Source Nodes

### Community 224 - "GameState"
Cohesion: 0.06
Nodes (49): 2. Boot, title screen and session start, 4.1 Meta actions, 4. Game façade and meta actions, 10. Out of scope, 1. Scope and goals, 2. Design principles, 3. Layers and dependency direction, 4. Source layout (+41 more)

### Community 225 - "HANDOFF — CompSciQuest content + W6/W7 state"
Cohesion: 0.10
Nodes (18): 10. Commit / push note, 1. One-paragraph summary, 2. Read these first (in order), 3. What is accepted (content, do not re-litigate), 4.1 Failure inventory, 4.2 The generated bundle is stale — verify this first, 4. Current verification state (measured 2026-11-26), 5. Ordered next steps (+10 more)

### Community 226 - "Q: How should browser-tester run e2e on a different port without touching playwright.config.ts for engine-issue-16?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should browser-tester run e2e on a different port without touching playwright.config.ts for engine-issue-16?, Source Nodes

### Community 227 - "Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?, Source Nodes

### Community 228 - "Q: Where are QuizView.remainingWrong and the fresh-start save writes defined, and which doc sections own them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are QuizView.remainingWrong and the fresh-start save writes defined, and which doc sections own them?, Source Nodes

### Community 229 - "Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?, Source Nodes

### Community 230 - "Q: Where does autosave hook into Game.submit and where is the quarantine download button defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does autosave hook into Game.submit and where is the quarantine download button defined?, Source Nodes

### Community 231 - "w7-accessibility.spec.ts"
Cohesion: 0.31
Nodes (6): accessibilityCommand(), contrastRatio(), CONTROL_ORDER, enterSwitchyardQuiz(), luminance(), parseColour()

### Community 232 - "Q: ENG24-FRESHSTART-01/DEDUP-01: which nodes own fresh-start state construction and the live save write?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG24-FRESHSTART-01/DEDUP-01: which nodes own fresh-start state construction and the live save write?, Source Nodes

### Community 233 - "Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?, Source Nodes

### Community 234 - "Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?, Source Nodes

### Community 235 - "Q: Where do autosave after submit and the quarantined-save download button live?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do autosave after submit and the quarantined-save download button live?, Source Nodes

### Community 236 - "Q: ENG24 autosave: why does the post-observer trace assertion fail even though the saved DTO has final state?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG24 autosave: why does the post-observer trace assertion fail even though the saved DTO has final state?, Source Nodes

### Community 237 - "Q: Which canonical nodes own autosave on Game.submit and the five SaveControls buttons for ENG24-AUTOSAVE-01 and ENG31-REMOVEQUARANTINE-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own autosave on Game.submit and the five SaveControls buttons for ENG24-AUTOSAVE-01 and ENG31-REMOVEQUARANTINE-01?, Source Nodes

### Community 238 - "Q: Why do 11 unrelated e2e tests fail on the port-5224 run?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do 11 unrelated e2e tests fail on the port-5224 run?, Source Nodes

### Community 239 - "Q: ENG30-REMAINING-02: where is remainingWrong derived and which QuizView node is canonical for the red tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG30-REMAINING-02: where is remainingWrong derived and which QuizView node is canonical for the red tests?, Source Nodes

### Community 240 - "ScoreTracker"
Cohesion: 0.07
Nodes (34): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Behavioural guarantees, 3.2 World, area, room and item definitions, 3.3 Loading and validation, 3. Content bundle and registration, 6.1 Event to view mapping, 6. Canonical event union and rendering (+26 more)

### Community 241 - "Q: MD-RENDER-01 round 1: which canonical nodes own bold-italic emphasis, raw-HTML leaf text and rejected-link labels in the markdown renderer?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-RENDER-01 round 1: which canonical nodes own bold-italic emphasis, raw-HTML leaf text and rejected-link labels in the markdown renderer?, Source Nodes

### Community 242 - "Q: Where does putHandler() choose toOwnerId for an authored item fixture and how is putInteraction() reused?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does putHandler() choose toOwnerId for an authored item fixture and how is putInteraction() reused?, Source Nodes

### Community 243 - "Q: Which canonical UI node owns the Markdown-to-DOM renderer boundary and is there an existing owner to reuse?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical UI node owns the Markdown-to-DOM renderer boundary and is there an existing owner to reuse?, Source Nodes

### Community 244 - "persistence.ts"
Cohesion: 0.06
Nodes (42): vitest, SessionStatus, asRuntime(), envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, loadEffectApplier() (+34 more)

### Community 245 - "Q: Which canonical UI node owns the Markdown-to-DOM renderer boundary and is there an existing owner to reuse?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical UI node owns the Markdown-to-DOM renderer boundary and is there an existing owner to reuse?, Source Nodes

### Community 246 - "Q: Does mapping every item PUT target to the current room break existing parser verb contracts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does mapping every item PUT target to the current room break existing parser verb contracts?, Source Nodes

### Community 247 - "Q: MD-RENDER-01 round 1: after adding plainText() and boldItalicMarker(), are there duplicate canonical nodes, bypasses or new cross-layer edges?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-RENDER-01 round 1: after adding plainText() and boldItalicMarker(), are there duplicate canonical nodes, bypasses or new cross-layer edges?, Source Nodes

### Community 248 - "Q: MD-RENDER-01 round 1: is there an existing plain-token-text extractor or triple-marker detector to reuse before adding plainText() and boldItalicMarker()?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-RENDER-01 round 1: is there an existing plain-token-text extractor or triple-marker detector to reuse before adding plainText() and boldItalicMarker()?, Source Nodes

### Community 249 - "Q: Why does a clean authored win save fail hasValidReferences and disable Continue after reload?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does a clean authored win save fail hasValidReferences and disable Continue after reload?, Source Nodes

### Community 250 - "validate.ts"
Cohesion: 0.18
Nodes (20): 5. Generation, CatalogueEmit, cleanEntry(), emitCatalogue(), indentJson(), stripAuthoring(), normalisedCards(), normaliseExit() (+12 more)

### Community 251 - "Q: Where are QuizView.remainingWrong, createFreshState and the fresh-start save writes defined, and which seam owns them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are QuizView.remainingWrong, createFreshState and the fresh-start save writes defined, and which seam owns them?, Source Nodes

### Community 252 - "Q: ENG24-REANCHOR-UNIT-02: which node owns typed restart and its fresh-state save, and where is the inherited no-write loop?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG24-REANCHOR-UNIT-02: which node owns typed restart and its fresh-state save, and where is the inherited no-write loop?, Source Nodes

### Community 253 - "Q: MD-RENDER-01: which canonical UI node owns the Markdown to DOM boundary?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-RENDER-01: which canonical UI node owns the Markdown to DOM boundary?, Source Nodes

### Community 254 - "Q: Where are the pass-line requirementLine helper, the unused QUARANTINE_DOWNLOAD_NAME export, the restart fresh-start writes, and the quiz view fields defined for ENG30 re-anchoring and fresh-start QA?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the pass-line requirementLine helper, the unused QUARANTINE_DOWNLOAD_NAME export, the restart fresh-start writes, and the quiz view fields defined for ENG30 re-anchoring and fresh-start QA?, Source Nodes

### Community 255 - "Q: Revision round 1: where are the two stale e2e expectations that New Game leaves storage empty and typed load restores a seeded score-7 save, now that .newGame() writes a fresh save?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision round 1: where are the two stale e2e expectations that New Game leaves storage empty and typed load restores a seeded score-7 save, now that .newGame() writes a fresh save?, Source Nodes

### Community 256 - "Q: Which seams own load confirmation, transient hint clearing on quiz retry, and the quiz requirement aria-live region?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which seams own load confirmation, transient hint clearing on quiz retry, and the quiz requirement aria-live region?, Source Nodes

### Community 257 - "Q: Why does typing hint after a switchyard quiz retry say there is nothing more to suggest, and how should the browser e2e reach a fresh hint?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does typing hint after a switchyard quiz retry say there is nothing more to suggest, and how should the browser e2e reach a fresh hint?, Source Nodes

### Community 258 - "Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?, Source Nodes

### Community 259 - "Q: Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?, Source Nodes

### Community 260 - "Q: Why is Continue disabled after reloading a full authored win save?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why is Continue disabled after reloading a full authored win save?, Source Nodes

### Community 261 - "Q: Is the zone-1 turns-since hint dead end a content-authoring issue rather than an engine bug, and what content options exist?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Is the zone-1 turns-since hint dead end a content-authoring issue rather than an engine bug, and what content options exist?, Source Nodes

### Community 262 - "Q: Which node owns grant-item inventory mutation and how does it keep one owner per item?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node owns grant-item inventory mutation and how does it keep one owner per item?, Source Nodes

### Community 263 - "Q: Does grant-item need a new helper to remove authored initialRoom copies?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does grant-item need a new helper to remove authored initialRoom copies?, Source Nodes

### Community 264 - "Q: Why did the full-win e2e fail after the F3 ownership fix, and which failures were e2e fixture mistakes rather than product gaps?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did the full-win e2e fail after the F3 ownership fix, and which failures were e2e fixture mistakes rather than product gaps?, Source Nodes

### Community 265 - "Q: MD-RENDER-01: which canonical UI node owns the marked DOM-only renderer boundary for transcript and panel Markdown?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-RENDER-01: which canonical UI node owns the marked DOM-only renderer boundary for transcript and panel Markdown?, Source Nodes

### Community 266 - "Q: MD-RENDER-01: is there an existing link allowlist or text-node helper to reuse?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-RENDER-01: is there an existing link allowlist or text-node helper to reuse?, Source Nodes

### Community 267 - "Q: MD-RENDER-01: why do seven tests fail after the renderer is implemented?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-RENDER-01: why do seven tests fail after the renderer is implemented?, Source Nodes

### Community 268 - "Q: FakeElement FakeDocument .createTextNode() installFakeDocument() OutputLog appendLine() — which node owns the fake text-node tagName casing that caused markdown renderer test failures?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: FakeElement FakeDocument .createTextNode() installFakeDocument() OutputLog appendLine() — which node owns the fake text-node tagName casing that caused markdown renderer test failures?, Source Nodes

### Community 269 - "markdownTranscript.test.ts"
Cohesion: 0.14
Nodes (12): QuarantineDto, LoadFailureReason, loadFailureMessage(), MESSAGES, assertNoHtmlWrites(), assertPlain(), hasTag(), listSig() (+4 more)

### Community 270 - "Q: MD-RENDER-02/11/15: which canonical nodes own the ___person___ bold-italic shape, raw HTML newline preservation and rejected-link label text?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-RENDER-02/11/15: which canonical nodes own the ___person___ bold-italic shape, raw HTML newline preservation and rejected-link label text?, Source Nodes

### Community 271 - "Q: Which UI nodes own transcript echo, panel channels and the fake DOM for MD-UI-01 to MD-UI-10?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which UI nodes own transcript echo, panel channels and the fake DOM for MD-UI-01 to MD-UI-10?, Source Nodes

### Community 272 - "Q: QuizPanel .refresh() requirementLine() FakeElement createTextNode() OutputLog — how is the quiz requirement rendered and how does the fake text node expose tagName for UI-PASSMARK-A11Y-03?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: QuizPanel .refresh() requirementLine() FakeElement createTextNode() OutputLog — how is the quiz requirement rendered and how does the fake text node expose tagName for UI-PASSMARK-A11Y-03?, Source Nodes

### Community 273 - "BareQuizAnswer.test.ts"
Cohesion: 0.11
Nodes (22): loadNameResolver(), makeParserBundle(), makePutFixture(), catalogueOf(), loadSeam(), AskFixture, askFixture(), GameCommandResolver (+14 more)

### Community 274 - "CommandTable.ts"
Cohesion: 0.19
Nodes (13): aliasSuffix(), COMMAND_TABLE, commandLine(), CommandSpec, detailSuffix(), DIRECTIONS, DirectionSpec, GROUP_ORDER (+5 more)

### Community 275 - "SaveActions"
Cohesion: 0.18
Nodes (5): 8.1 Strictness, 8.2 Result type, 8. Validation contract, SaveActions, SaveControls

### Community 276 - "content/index.ts"
Cohesion: 0.07
Nodes (19): area, START_POSITION, startRoom, areaHeaders(), authoredArea(), expectCurrentCard(), headerFor(), panelLines() (+11 more)

### Community 277 - "common.ts"
Cohesion: 0.23
Nodes (14): bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings(), text() (+6 more)

### Community 278 - "NPCs and conversation"
Cohesion: 0.25
Nodes (8): 1. Scope, 2. Model, 3. Commands and topic resolution, 4. Conversation flow, 6. Link to quiz combat, NPCs and conversation, DialogueSystem, TopicEntry

### Community 279 - "Q: MD-UI-01: which canonical UI nodes own the plain/Markdown transcript channels and how do appendPlain, appendMarkdownBlock and appendMarkdownInline reuse them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-UI-01: which canonical UI nodes own the plain/Markdown transcript channels and how do appendPlain, appendMarkdownBlock and appendMarkdownInline reuse them?, Source Nodes

### Community 280 - "engine-issue-30-passmark.spec.ts"
Cohesion: 0.21
Nodes (12): AuthoredQuestion, authoredQuestion(), AuthoredQuiz, DisplayedQuestion, displayedQuestion(), enterQuizFromSave(), enterSwitchFloorQuiz(), expectRequirement() (+4 more)

### Community 281 - "GameStateDto"
Cohesion: 0.12
Nodes (12): catalogueOf(), GameStateDto, finishWithWrongAnswers(), questionFor(), wrongAnswer(), StateOptions, messageTexts(), switchyardProgress() (+4 more)

### Community 282 - "Q: MD-UI-01 reviewer-FAIL round: which graph nodes own block/inline markdown channels, quiz requirement order and GameWindow event routing?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-UI-01 reviewer-FAIL round: which graph nodes own block/inline markdown channels, quiz requirement order and GameWindow event routing?, Source Nodes

### Community 283 - "HintRetry.test.ts"
Cohesion: 0.20
Nodes (9): authoredNpc(), readSave(), AuthoredFixture, finishWithWrongAnswers(), questionFor(), retryFixture(), retryState(), STALE_HINTS (+1 more)

### Community 284 - "engine-issue-30-passmark.test.ts"
Cohesion: 0.26
Nodes (8): QuizView, formatEvent(), topicLabel(), transcript(), authoredQuiz(), firstQuestion(), PassMarkQuizView, PassMarkA11yQuizView

### Community 285 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 286 - "HintSystem"
Cohesion: 0.31
Nodes (8): 1. Scope, 2. Model, 3. Commands and delivery, 4. Adaptive behaviour, 5. Score interaction, Hints, HintSystem, HintStateDto

### Community 287 - "domain.ts"
Cohesion: 0.32
Nodes (4): ExitDefinition, Direction, GameObject, Serialisable

### Community 288 - "Q: COMMAND_TABLE helpText() CommandSpec DIRECTIONS describeRoom() scoreHandler() formatEvent() topicLabel() RoomSummary — which canonical nodes own grouped help and room-entry text?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: COMMAND_TABLE helpText() CommandSpec DIRECTIONS describeRoom() scoreHandler() formatEvent() topicLabel() RoomSummary — which canonical nodes own grouped help and room-entry text?, Source Nodes

### Community 289 - "Q: MD-HELP-01/MD-STATUS-01 round 1: which canonical nodes own the 21-verb COMMAND_TABLE group split, the Saves help section, and the four-entry room heading?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: MD-HELP-01/MD-STATUS-01 round 1: which canonical nodes own the 21-verb COMMAND_TABLE group split, the Saves help section, and the four-entry room heading?, Source Nodes

### Community 290 - "Q: Which canonical nodes own generated help text, transcript rendering and the four-part room heading for the MD-HELP-01/MD-STATUS-01 e2e updates?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own generated help text, transcript rendering and the four-part room heading for the MD-HELP-01/MD-STATUS-01 e2e updates?, Source Nodes

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `GameWindow` (11× useful, score=10.760079235)
- `EffectApplier` (9× useful, score=8.683352854)
- `ContentBundle` (8× useful, score=7.64901773)
- `QuizView` (7× useful, score=6.882187455)
- `COMMAND_TABLE` (5× useful, score=4.951636267)
- `helpText()` (5× useful, score=4.951636267)
- `quizView()` (5× useful, score=4.90537452)
- `PuzzleSystem` (5× useful, score=4.901864463)
- `renderArea()` (5× useful, score=4.873156515)
- `resolveGameCommand()` (5× useful, score=4.821717821)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"
- "How to override the Playwright baseURL in a scratchpad config?" -> `playwright.config.ts`, `baseURL`
- "graphify section '6.1' — which document owns the event to view mapping?"
- "Can the Playwright MCP browser drive the app in this session?" -> `playwright.config.ts`, `helpers.ts`
- "Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?" -> `playwright.config.ts`, `helpers.ts`
- "Can the Playwright MCP browser tools drive the app in this browser-tester session?" -> `playwright.config.ts,helpers.ts`
- "Can the Playwright MCP browser drive the app in this engine-issue-16 session?" -> `playwright.config.ts`, `SaveControls`, `OutputLog`
- "Why do 11 unrelated e2e tests fail on the port-5224 run?" -> `engine-issue-9-quick-answers.spec.ts,engine-issue-11.spec.ts,engine-issue-25.spec.ts,QuizPanel,ScorePanel,helpers.ts`
- "Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?" -> `src_core_puzzles_puzzlesystem_advancecounters,HintSystem,PuzzleSystem`

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `persistence.ts` to `npcTopicOverlap.ts`, `Effect`, `ui.ts`, `AuthoredWinPath.test.ts`, `LoadConfirmation.test.ts`, `npcs.ts`, `HelpOutput.test.ts`, `zone1.ts`, `parser.ts`, `BareQuizAnswer.test.ts`, `scenery-validation.test.ts`, `markdownTranscript.test.ts`, `content/index.ts`, `content.ts`, `markdownRendering.test.ts`, `GameViewData.ts`, `NpcGates.test.ts`, `GameStateDto`, `HintRetry.test.ts`, `FakeRandom`, `engine-issue-30-passmark.test.ts`, `GameEvent`, `contentToolchain.ts`, `ContentBundle`, `Game.ts`, `authored.ts`, `devDependencies`, `package.json`, `NpcTypes.test.ts`, `Favicon.test.ts`, `QuizRevision.test.ts`, `authoredGame`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Should `w7-full-win-trace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08305647840531562 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `npcTopicOverlap.ts`, `Effect`, `ui.ts`, `HintSystem.ts`, `SaveManager.ts`, `npcs.ts`, `zone1.ts`, `parser.ts`, `EffectApplier.ts`, `BareQuizAnswer.test.ts`, `TopicSelection.ts`, `Command`, `content.ts`, `Game`, `scenery-validation.test.ts`, `common.ts`, `GameStateDto`, `HintRetry.test.ts`, `engine-issue-30-passmark.test.ts`, `FakeRandom`, `Content authoring rules`, `GameEvent`, `commandResolution.ts`, `Game.ts`, `TopicResolver.ts`, `PuzzleGraph.ts`, `authored.ts`, `Content toolchain`, `Random`, `LoadResult`, `NpcTypes.test.ts`, `authoredGame`, `GameState`, `ScoreTracker`, `persistence.ts`, `validate.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `npcTopicOverlap.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06879865348201136 - nodes in this community are weakly interconnected._
- **Why does `Parallel execution` connect `EffectApplier.ts` to `ScoreTracker`, `Issues`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._