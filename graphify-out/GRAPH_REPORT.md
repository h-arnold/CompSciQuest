# Graph Report - writer-agent-pattern  (2026-11-27)

## Corpus Check
- 550 files · ~277,336 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 3926 nodes · 10248 edges · 325 communities (316 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 443 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `30e61c0e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- helpers.ts
- ContentBundle
- makeRuntimeState
- Game.ts
- parser.ts
- mechanics.ts
- npcTopicOverlapConditionCases.ts
- vitest
- asText
- wardKeywordActivity.ts
- wardTopicLocality.ts
- wardW7Fixes.ts
- verbs/index.ts
- compilerOptions
- contentToolchain.ts
- npcs.ts
- submit
- turn.ts
- ui.ts
- content/index.ts
- w7-full-win-trace.ts
- GameEvent
- zone1.ts
- GameWindow.ts
- GameWindow
- cli.ts
- ContentBundle.ts
- content.ts
- topicOverlap.ts
- SaveManager.ts
- scenery-validation.test.ts
- readStorage
- deploy.yml
- npcTopicOverlap.ts
- engine-followups-freshstart.spec.ts
- TopicSelection.test.ts
- ConversationFlow.ts
- Parser.ts
- commandResolution.ts
- ward-give-feedback.spec.ts
- RecordingGame
- Hints
- transcript
- w7-opening-walkthrough.spec.ts
- content/schema.ts
- generate.ts
- 2. Functional defects
- EffectApplier.ts
- AuthoredRun
- SaveManager
- Documentation style guide
- FakeElement
- common.ts
- hint.ts
- NameResolver.ts
- TopicSelection.ts
- ScoreTracker
- opencode.json
- scripts
- NPCs and conversation
- Game
- ScoreTracker.ts
- engine-issue-30-passmark.spec.ts
- W7 re-test — Assistance Ward, round 2 (2026-11-27)
- persistence.ts
- AreaChangeLifeGate.test.ts
- W7 round-4 re-test — Assistance Ward (2026-11-27)
- HintSystem.ts
- CommandTable.test.ts
- validate.ts
- engine-issue-11.spec.ts
- devDependencies
- InteractionRules.ts
- ward-round3-fixes.spec.ts
- PlacedBlockClosure.test.ts
- package.json
- W7 round-3 re-test — Assistance Ward (2026-11-27)
- GameState.ts
- adapt.ts
- validateContent.ts
- SaveDto.ts
- eslint.config.js
- area-progress.test.ts
- W7 round-5 re-test — Assistance Ward (2026-11-27)
- ConversationTopic
- engine-followups-2-hintretry.spec.ts
- Favicon.test.ts
- NpcGates.test.ts
- MemoryContentIo
- Areas, rooms and items
- Storage schema
- engine-issue-13-inventory.test.ts
- Quiz combat
- PuzzleSystem.ts
- Puzzles
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
- Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?
- Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?
- Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?
- Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?
- Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?
- Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?
- Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?
- Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?
- Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?
- Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?
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
- Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?
- Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?
- Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?
- Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?
- Q: Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?
- Q: ENG16-SAVECONFIRM-01: which canonical node owns the Save/Download confirmation path and should GameWindow.makeActions() route through it?
- Q: ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?
- Q: ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?
- Q: Can the Playwright MCP browser drive the app in this engine-issue-16 session?
- Q: Why do two engine-issue-9 quick-answer browser tests fail on the engine-issue-16 branch?
- Q: ENG16-SAVECONFIRM-01: where do the canonical Save/Download confirmation lines come from and how do sidebar buttons reach them?
- Q: How should browser-tester run e2e on a different port without touching playwright.config.ts for engine-issue-16?
- Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?
- Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?
- Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?
- Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?
- Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?
- Q: Where does autosave hook into Game.submit and where is the quarantine download button defined?
- Q: Where do autosave after submit and the quarantined-save download button live?
- Q: ENG24 autosave: why does the post-observer trace assertion fail even though the saved DTO has final state?
- Q: Which canonical nodes own autosave on Game.submit and the five SaveControls buttons for ENG24-AUTOSAVE-01 and ENG31-REMOVEQUARANTINE-01?
- Q: Why do 11 unrelated e2e tests fail on the port-5224 run?
- Q: Where are QuizView.remainingWrong and the fresh-start save writes defined, and which doc sections own them?
- Q: ENG24-FRESHSTART-01/DEDUP-01: which nodes own fresh-start state construction and the live save write?
- Q: ENG30-REMAINING-02: where is remainingWrong derived and which QuizView node is canonical for the red tests?
- Q: Where are QuizView.remainingWrong, createFreshState and the fresh-start save writes defined, and which seam owns them?
- Q: Does any second node implement a conditional use effect or authored useText mapping outside the canonical producer?
- Q: Where is the conditional use producer, authored useText mapping and condition gate owned for W6S-01..04?
- Q: ENG24-REANCHOR-UNIT-02: which node owns typed restart and its fresh-state save, and where is the inherited no-write loop?
- Q: Where are the pass-line requirementLine helper, the unused QUARANTINE_DOWNLOAD_NAME export, the restart fresh-start writes, and the quiz view fields defined for ENG30 re-anchoring and fresh-start QA?
- Q: Revision round 1: where are the two stale e2e expectations that New Game leaves storage empty and typed load restores a seeded score-7 save, now that .newGame() writes a fresh save?
- Q: ward-w7-fixes: canonical owners for parser aliases, unlock denial, quiz starts, hint targets
- Q: Which seams own load confirmation, transient hint clearing on quiz retry, and the quiz requirement aria-live region?
- Q: Why does typing hint after a switchyard quiz retry say there is nothing more to suggest, and how should the browser e2e reach a fresh hint?
- Q: W7F-01..14: which canonical owners implement parser aliases, unlock splitting, gate denial, blockedText shape/adapt, quiz idempotence, transfer announcement, title copy and room hint targets?
- Q: Which canonical nodes supply the approved title copy, help aliases and gate fallback that the four stale e2e assertions must re-anchor?
- Q: Why do four W7 browser tests still fail after the string re-anchor, and is it caused by this slice?
- Q: Which canonical nodes own browser save seeding and continuation for gated later-area e2e traces?
- Q: Which accepted sources own the hub escape reply and interface room prose re-anchored in W7 Beat C, and the 23-room bundle count?
- Q: After the W6 handoff regeneration, which accepted sources own the revised hub and interface room prose asserted by W7 Beat C?
- Q: Which code paths own wrong-order unlock refusal and arrival scenery examine
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- Q: Which canonical nodes own the WR2-B1 wrong-order unlock refusal, WR2-B2 item-first unlock preservation and WR2-E1 arrival scenery examine contracts?
- Q: Who owns arrival register/record/mark scenery prose for WR2-E1?
- Q: Who owns wrong-order unlock refusal for a non-portable item offered as the key-like item (WR2-B1)?
- Q: Bypass check on WR2-B1 refusal literal and WR2-E1 arrival scenery prose: any reimplementation outside the canonical hub?
- Q: Where is the approved dial blocked string pinned in tests, and which authority superseded it in round 2?
- Q: Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?
- Q: Do the record and mark aliases in the room-arrival SCENERY entry make resolveScenery ambiguous?
- Q: Why is Continue disabled after reloading a full authored win save?
- Q: Is the zone-1 turns-since hint dead end a content-authoring issue rather than an engine bug, and what content options exist?
- Q: Why did eleven e2e tests fail after the round-2 ward card regeneration, and how were stale expectations re-anchored?
- Q: Why does a crafted v1 save with empty room inventories make 'unlock practice cabinet with practice key' return 'I don't understand that.'?
- Q: Can the coverage graph supply the round-2 dial blocked string, the saving keyword and the state-true hub/Interface prose?
- Q: Where does putHandler() choose toOwnerId for an authored item fixture and how is putInteraction() reused?
- Q: Does mapping every item PUT target to the current room break existing parser verb contracts?
- Q: Why does a clean authored win save fail hasValidReferences and disable Continue after reload?
- Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, the existing answer paths and the outside-quiz unknown path?
- Q: Which canonical node owns exact displayed quiz option text as an answer, and where should the WR3-A1 fix and shared option-text normalisation live?
- Q: Which node owns grant-item inventory mutation and how does it keep one owner per item?
- Q: Does grant-item need a new helper to remove authored initialRoom copies?
- Q: Can a Playwright e2e test retry quiz starts until a target option is not the final question?
- Q: Does a wrong free-text quiz answer receive the quiz's out-of-range string?
- Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, answer N/bare N and the outside-quiz unknown path?
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
- SeededRandom
- node-shims.d.ts
- CommandTable.ts
- PuzzleGraph.ts
- zod
- Hazards
- Effect
- ValidationModule
- tsconfig.json
- npcHandlers.ts
- SourceHygiene.test.ts
- 3.3 Loading and validation

## God Nodes (most connected - your core abstractions)
1. `vitest` - 136 edges
2. `ContentBundle` - 127 edges
3. `GameEvent` - 111 edges
4. `GameState` - 101 edges
5. `Effect` - 64 edges
6. `asText()` - 62 edges
7. `submit()` - 61 edges
8. `Command` - 60 edges
9. `FakeRandom` - 60 edges
10. `finding()` - 58 edges

## Surprising Connections (you probably didn't know these)
- `11. Flow` --references--> `Game`  [INFERRED]
  docs/developer/storage-schema.md → src/application/Game.ts
- `6.1 Event to view mapping` --references--> `GameViewData`  [INFERRED]
  docs/developer/application-and-ui.md → src/application/GameViewData.ts
- `4. Failure consequences` --references--> `AreaDefinition`  [INFERRED]
  docs/developer/hazards.md → src/content/AreaDefinition.ts
- `1. Purpose` --references--> `ContentBundle`  [INFERRED]
  docs/developer/content-toolchain.md → src/content/ContentBundle.ts
- `6. Gates` --references--> `interactionShapeProblems()`  [INFERRED]
  docs/developer/areas.md → src/content/validateContent.ts

## Import Cycles
- 2-file cycle: `e2e/w7-full-win-trace.ts -> e2e/w7-full-win/ward-checkpoint.ts -> e2e/w7-full-win-trace.ts`

## Communities (325 total, 9 thin omitted)

### Community 0 - "helpers.ts"
Cohesion: 0.06
Nodes (27): continueSavedGame(), liveTurn(), delta(), SaveEnvelope, boot(), openSession(), PROMISED, ROOM_TITLES (+19 more)

### Community 1 - "ContentBundle"
Cohesion: 0.11
Nodes (39): 5.1 Door and container verbs, 5.2 Verb table and handler signature, 5. Canonical command union and verbs, 6.1 Bootstrap (`src/main.ts`), 3. Flow, 9. Content registration, GameDependencies, ContentBundle (+31 more)

### Community 2 - "makeRuntimeState"
Cohesion: 0.20
Nodes (14): gatedState(), makeRuntimeState(), makeStateDto(), w7GateState(), w7QuizState(), w7UnlockState(), makeState(), BASE_DTO (+6 more)

### Community 3 - "Game.ts"
Cohesion: 0.08
Nodes (28): 8. Behavioural signatures, 1. Scope, 4. Conversation flow, 1. Scope, 3. Completion detection, 4. Counters and stuckness, ComposedReaction, ComposedReactionDependencies (+20 more)

### Community 4 - "parser.ts"
Cohesion: 0.07
Nodes (42): 5. Conversation nodes, ParsedCommand, DOOR_ID, KEY_A, KEY_B, loadNameResolver(), loadParser(), loadTokenizer() (+34 more)

### Community 5 - "mechanics.ts"
Cohesion: 0.08
Nodes (55): createEffectApplier(), puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, DOOR_FLAG (+47 more)

### Community 6 - "npcTopicOverlapConditionCases.ts"
Cohesion: 0.16
Nodes (34): gNpc06(), gNpc07(), gNpc08(), gNpc09(), gNpc10(), gNpc11(), gNpc12(), gNpc13() (+26 more)

### Community 7 - "vitest"
Cohesion: 0.05
Nodes (72): vitest, formatEvent(), topicLabel(), finishWithWrongAnswers(), questionFor(), wrongAnswer(), activeQuiz(), answerCorrectly() (+64 more)

### Community 8 - "asText"
Cohesion: 0.22
Nodes (28): allEffects(), areaLikes(), asText(), auditedAreaLikes(), authoringOf(), finding(), idsOf(), checkHazard() (+20 more)

### Community 9 - "wardKeywordActivity.ts"
Cohesion: 0.07
Nodes (61): spokenTexts(), actorBindingScenario(), actorOrderScenario(), actorScenario(), AI_ID, AI_INITIAL_STATE_ID, AI_STATES, ARRIVAL_AREA_ID (+53 more)

### Community 10 - "wardTopicLocality.ts"
Cohesion: 0.06
Nodes (50): AI_ID, ARRIVAL_AREA_ID, ARRIVAL_ROOM_ID, DECOY_REPLY, DEMONSTRATION_ROOM_ID, GLOBAL_AI_DEFAULT, GLOBAL_AI_KEYWORD, INTAKE_ROOM_ID (+42 more)

### Community 11 - "wardW7Fixes.ts"
Cohesion: 0.06
Nodes (47): Condition, keywordTopic(), messageTexts(), stateSnapshot(), W7_AI_ALIAS, W7_AI_ID, W7_ANSWERS_TOPIC_ID, W7_AREA_ID (+39 more)

### Community 12 - "verbs/index.ts"
Cohesion: 0.16
Nodes (26): examineInteraction(), ContainerOwner, describeRoom(), describeTarget(), examineHandler(), fixedMessage(), flagPrefix(), goHandler() (+18 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (26): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+18 more)

### Community 14 - "contentToolchain.ts"
Cohesion: 0.07
Nodes (37): Data, gateFindings(), CardData, cleanParsedSet(), definition(), roomData(), PER_AREA_PATHS, npcCards() (+29 more)

### Community 15 - "npcs.ts"
Cohesion: 0.08
Nodes (55): ACTOR_ALIAS, ACTOR_ID, actorState(), askRing, byeCommand, ConditionEvaluatorCondition, CountingRandom, DEFAULT_REPLY (+47 more)

### Community 16 - "submit"
Cohesion: 0.17
Nodes (16): answerAndRead(), submit(), waitForLine(), DEMONSTRATION_ROUTE, persisted(), SaveShape, takePracticeKey(), toDemonstration() (+8 more)

### Community 17 - "turn.ts"
Cohesion: 0.09
Nodes (20): Session, SessionStatus, loadSession(), EventBusFactory, FormatEventFunction, loadEventBus(), loadGameWithPhases(), makeTurnDependencies() (+12 more)

### Community 18 - "ui.ts"
Cohesion: 0.12
Nodes (34): loadSaveManager(), makeEnvelope(), QUARANTINE_KEY, allText(), Bootstrap, BootstrapDependencies, descendants(), documentState (+26 more)

### Community 19 - "content/index.ts"
Cohesion: 0.11
Nodes (18): area, START_POSITION, startRoom, actorStates, actors, areas, conversationTopics, hazards (+10 more)

### Community 20 - "w7-full-win-trace.ts"
Cohesion: 0.08
Nodes (45): expectWardCheckpoint(), GATE_FLAGS, MILL_FLAGS, NON_QUIZ_PUZZLES, RAIL_FLAGS, SCRIPTED_HAZARDS, UNSEEN_HAZARDS, AuthoredQuestion (+37 more)

### Community 21 - "GameEvent"
Cohesion: 0.07
Nodes (24): GameEvent, RoomSummary, SchedulerContract, loadFormatEvent(), BUNDLE, COMPLETED, SOLVED_WITH_TOPIC, SOLVED_WITHOUT_TOPIC (+16 more)

### Community 22 - "zone1.ts"
Cohesion: 0.13
Nodes (26): acceptedCards(), generatedRoomIds(), zone1Cards(), zone1Cards(), zone1Generation(), ParsedCardSet, ValidationOptions, acceptedEmittedDates() (+18 more)

### Community 23 - "GameWindow.ts"
Cohesion: 0.11
Nodes (20): 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, Persistence and UI, 6. Events and UI, 7. State, events and UI, AreaProgressView, ConversationView (+12 more)

### Community 24 - "GameWindow"
Cohesion: 0.12
Nodes (9): 8.1 Strictness, 8.2 Result type, 8. Validation contract, GameWindow, SaveActions, SaveControls, DEFAULT_TITLE_COPY, TitleCopy (+1 more)

### Community 25 - "cli.ts"
Cohesion: 0.07
Nodes (35): 1. Purpose, 3. Scaffolds, 6. Ownership, 7. Coverage-graph extraction, Content toolchain, CONTENT_ROOT, COVERAGE_PATH, coverageOptions() (+27 more)

### Community 26 - "ContentBundle.ts"
Cohesion: 0.14
Nodes (16): 3.1 Catalogue shape, ActorDefinition, ItemDefinition, Quiz, QuizQuestion, HintLevel, HintSequence, ActorState (+8 more)

### Community 27 - "content.ts"
Cohesion: 0.13
Nodes (31): CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS, CoverageTopicIds (+23 more)

### Community 28 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (34): asRecord(), ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf() (+26 more)

### Community 29 - "SaveManager.ts"
Cohesion: 0.15
Nodes (29): ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints(), hasValidNpcs() (+21 more)

### Community 30 - "scenery-validation.test.ts"
Cohesion: 0.11
Nodes (25): cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), cardsWithExitBlock(), cardsWithRoomHints(), parsedCards(), ROOM_TARGETS (+17 more)

### Community 31 - "readStorage"
Cohesion: 0.09
Nodes (30): command(), continueFrom(), firstId(), GATE_IDS, gateIds(), GateOverrides, liveSave(), savedState() (+22 more)

### Community 32 - "deploy.yml"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 33 - "npcTopicOverlap.ts"
Cohesion: 0.17
Nodes (33): command(), gNpc01(), gNpc02(), gNpc03(), gNpc04(), gNpc05(), gNpc19(), gNpc20() (+25 more)

### Community 34 - "engine-followups-freshstart.spec.ts"
Cohesion: 0.08
Nodes (25): answerNumber(), authoredQuestion(), authoredQuiz(), displayedQuestion(), enterSwitchFloorQuiz(), quizPanel(), savedGame(), SaveEnvelope (+17 more)

### Community 35 - "TopicSelection.test.ts"
Cohesion: 0.15
Nodes (15): createTopicResolver(), createConditionEvaluator(), isConditionMet(), always, NEVER_FLAG, npcContext(), keywordContext(), selectorFor() (+7 more)

### Community 36 - "ConversationFlow.ts"
Cohesion: 0.18
Nodes (25): activeNode(), announceHandover(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode() (+17 more)

### Community 37 - "Parser.ts"
Cohesion: 0.18
Nodes (13): DIRECTION_NAMES, DIRECTION_SHORTCUTS, DIRECTION_TOKENS, HYPHENATED_VERBS, hyphenatedVerb(), isDirection(), isPunctuationAlias(), MULTIWORD_ALIASES (+5 more)

### Community 38 - "commandResolution.ts"
Cohesion: 0.14
Nodes (27): actorAndRemainder(), answerCommand(), bareAnswerCommand(), conversationCommand(), DIRECTION_BY_TOKEN, directionCommand(), exactOptionAnswerCommand(), fallbackPair() (+19 more)

### Community 39 - "ward-give-feedback.spec.ts"
Cohesion: 0.13
Nodes (23): answerAttempt(), AuthoredQuestion, authoredQuestion(), authoredQuiz(), checkWardMechanics(), correctIndex(), currentQuestion(), DIAL_TEXT (+15 more)

### Community 40 - "RecordingGame"
Cohesion: 0.11
Nodes (9): QuizView, makeViewData(), RecordingGame, PassMarkQuizView, PassMarkA11yQuizView, QUIZ_VIEW, TOPIC_STATUS, makeMultiAreaViewData() (+1 more)

### Community 41 - "Hints"
Cohesion: 0.14
Nodes (16): 1. Scope, 2. Model, 3. Commands and delivery, 4. Adaptive behaviour, 5. Score interaction, 6. Card format, 7. Reviewer and playtest checks, 8.1 Definition of done (+8 more)

### Community 42 - "transcript"
Cohesion: 0.10
Nodes (14): command(), DEBUG_FRAGMENTS, command(), IMPLEMENTATION_PATTERNS, command(), INTERNAL_LINE_PATTERNS, ConsoleWatch, enterSwitchFloorQuiz() (+6 more)

### Community 43 - "w7-opening-walkthrough.spec.ts"
Cohesion: 0.20
Nodes (19): command(), enter(), expectEntry(), expectFlags(), expectOwners(), expectPosition(), expectPuzzle(), expectTransfer() (+11 more)

### Community 44 - "content/schema.ts"
Cohesion: 0.14
Nodes (21): ParseResult, AUTHORING_KEYS, blockedTextFinding(), blockedTextFindings(), cardShape, COLLECTION_KEYS, entriesShape, entryShape (+13 more)

### Community 45 - "generate.ts"
Cohesion: 0.19
Nodes (18): 5. Generation, CatalogueEmit, cleanEntry(), emitCatalogue(), indentJson(), stripAuthoring(), normalisedCards(), normaliseExit() (+10 more)

### Community 46 - "2. Functional defects"
Cohesion: 0.10
Nodes (20): 10. Placeholder objective and controls copy is shown to the player, 11. SHOW silently hands over a carried item, 12. Hints are graded correctly but too generic to resolve the stalled step, 13. Quiz teaches a command form the game rejects, 1. Expected ward path — claim-by-claim outcome, 1. Internal flag token shown at the teaching-port gates, 2. Functional defects, 2. `talk to <npc>` rejected although the command list advertises `talk-to` (+12 more)

### Community 47 - "EffectApplier.ts"
Cohesion: 0.14
Nodes (21): applyBookkeepingEffect(), applyEffect(), applyEntityEffect(), applyItemEffect(), applySystemEffect(), areaChangeEvents(), endQuiz(), evaluateAnswer() (+13 more)

### Community 48 - "AuthoredRun"
Cohesion: 0.20
Nodes (3): AuthoredRun, gateFlag(), lastQuestion()

### Community 49 - "SaveManager"
Cohesion: 0.16
Nodes (8): 2. Boot, title screen and session start, 6.4 Save, load, download and import, 2. Envelope, keys and file format, SaveDto, SaveManager, RecordingSaveManager, snapshotDto(), RecordingSaveManager

### Community 50 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 51 - "FakeElement"
Cohesion: 0.08
Nodes (12): absentElement(), FakeDocument, FakeElement, hasMatchingAncestors(), isTokenMatch(), makeFakeDocument(), logLines(), pressEnter() (+4 more)

### Community 52 - "common.ts"
Cohesion: 0.17
Nodes (28): asArray(), asObjectArray(), collection(), coverageIds(), DIRECTIONS, EFFECT_KINDS, effectList(), entriesWith() (+20 more)

### Community 53 - "hint.ts"
Cohesion: 0.23
Nodes (14): asNumber(), CardEntry, checkHint(), ladderFindings(), levelFindings(), penaltyFindings(), targetFindings(), UNLOCK_PREFIXES (+6 more)

### Community 55 - "TopicSelection.ts"
Cohesion: 0.21
Nodes (20): createNameResolver(), AskTellMatch, chooseCandidate(), exactDeclaredTopic(), findDefaultTopic(), GiveShowMatch, hasKeyword(), hasObjectMatch() (+12 more)

### Community 56 - "ScoreTracker"
Cohesion: 0.08
Nodes (30): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Behavioural guarantees, 6.1 Event to view mapping, 6. Canonical event union and rendering, 9. Effect to event mapping, Application and UI contracts, 6.3 Room entry, score and spec-topic mapping (+22 more)

### Community 57 - "opencode.json"
Cohesion: 0.11
Nodes (18): command, cwd, type, default_agent, experimental, subagent_depth, command, cwd (+10 more)

### Community 58 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 59 - "NPCs and conversation"
Cohesion: 0.13
Nodes (15): 10.1 Free-text topic-overlap proof, 10. Structural validation gates, 11.1 Definition of done, 11.2 Hard constraints and escalation, 11. Agent acceptance for NPC cards, 2. Model, 6. Link to quiz combat, 9. Reviewer and playtest checks (+7 more)

### Community 60 - "Game"
Cohesion: 0.07
Nodes (35): 4.1 Meta actions, 4. Game façade and meta actions, 10. Out of scope, 1. Scope and goals, 2. Design principles, 3. Layers and dependency direction, 4. Source layout, 5. Module responsibilities (+27 more)

### Community 61 - "ScoreTracker.ts"
Cohesion: 0.19
Nodes (19): areaPairForRoom(), areaPairForTopic(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, applyStateEffect(), Announce, AreaPair (+11 more)

### Community 62 - "engine-issue-30-passmark.spec.ts"
Cohesion: 0.13
Nodes (17): staleHintSave(), initialLives(), AuthoredQuestion, authoredQuestion(), AuthoredQuiz, DisplayedQuestion, displayedQuestion(), enterQuizFromSave() (+9 more)

### Community 63 - "W7 re-test — Assistance Ward, round 2 (2026-11-27)"
Cohesion: 0.13
Nodes (14): 1. Expected path claims — checked against play, 2. Status of the thirteen earlier findings, 3. Findings from this round, 4. Difficulty and fairness record, A. Room and item prose does not follow the completed state, B (minor). Wrong-order unlock invites carrying a bolted-down fixture, C. The approved dial block text describes five empty sockets after four are filled, Content-quality findings (route to `content-editor`) (+6 more)

### Community 64 - "persistence.ts"
Cohesion: 0.10
Nodes (25): createSaveManager(), createScoreTracker(), AuthoredGameFixture, asRuntime(), envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO (+17 more)

### Community 65 - "AreaChangeLifeGate.test.ts"
Cohesion: 0.14
Nodes (12): 1. Scope, 4. Reading and scoring, Authoring rules, AreaDefinition, ExitDefinition, RoomDefinition, areaOf(), BundleOptions (+4 more)

### Community 66 - "W7 round-4 re-test — Assistance Ward (2026-11-27)"
Cohesion: 0.14
Nodes (13): 1. Expected path claims — checked against play, 2. Status of the original thirteen findings, 3. Status of the five round-2 findings A–E, 4. Round-3 findings and round-4 closure claims, 5. Findings from this round, 6. Difficulty and fairness record, Additional observation (not a blocker), Content finding 1. The placed block stays “on top” in the room prose and cannot be found again (+5 more)

### Community 67 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 68 - "CommandTable.test.ts"
Cohesion: 0.16
Nodes (16): CommandSpec, CommandTableModule, DirectionSpec, hasCommandToken(), loadCommandTable(), CHEST_ID, loadVerbTable(), makeTurnContext() (+8 more)

### Community 69 - "validate.ts"
Cohesion: 0.21
Nodes (18): Finding, ParsedCardSet, stringList(), checkPuzzle(), clueFindings(), cycleFindings(), dependencyFindings(), puzzleFindings() (+10 more)

### Community 70 - "engine-issue-11.spec.ts"
Cohesion: 0.21
Nodes (7): areaHeaders(), authoredArea(), expectCurrentCard(), headerFor(), panelLines(), PROGRESS, TOTAL_SCORE

### Community 71 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint@^10.15.0, playwright@1.65.1, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, typescript-7@npm:typescript@^7.0.2, vite@^8.3.8, vitest@^5.1.1 (+5 more)

### Community 72 - "InteractionRules.ts"
Cohesion: 0.16
Nodes (18): AUTHORED_USES, authoredUseEffects(), AuthoredUseInteraction, describeScenery(), flagEffects(), FlagInteraction, hasMatchingName(), isSceneryVisible() (+10 more)

### Community 73 - "ward-round3-fixes.spec.ts"
Cohesion: 0.21
Nodes (16): answerCorrectly(), authoredPassMessage(), AuthoredQuestion, authoredQuestion(), authoredQuiz(), correctIndex(), currentQuestion(), enterOrientationQuiz() (+8 more)

### Community 74 - "PlacedBlockClosure.test.ts"
Cohesion: 0.15
Nodes (10): CommandHandler, VerbTableLike, EffectApplierLike, loadEffectApplier(), applierFor(), applyEffects(), HandlerResult, placedBlockFixture() (+2 more)

### Community 75 - "package.json"
Cohesion: 0.17
Nodes (11): description, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, yaml@^2.9.1, name, private, type, version (+3 more)

### Community 76 - "W7 round-3 re-test — Assistance Ward (2026-11-27)"
Cohesion: 0.17
Nodes (11): 1. Expected path claims — ward beats A–C2.12, 3. Closure of the thirteen earlier findings, 4. Closure of the five round-2 findings A–E, 5. Findings from this round, 6. Difficulty and fairness record, Content-quality finding 1. Demonstration prose keeps the practice block on top after it is put away, Context only, out of scope, Functional defect 1. The taught “exact option text” quiz answer form does not work (+3 more)

### Community 77 - "GameState.ts"
Cohesion: 0.07
Nodes (21): 2. Model, 2. Model, createFromDto(), createInitial(), GameStateDto, RuntimeGameState, stateToDto(), HazardStateDto (+13 more)

### Community 78 - "adapt.ts"
Cohesion: 0.25
Nodes (12): Catalogue, catalogueOf(), bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings() (+4 more)

### Community 79 - "validateContent.ts"
Cohesion: 0.12
Nodes (25): 4. Validation, Free-text topic-overlap proof, Gate definitions, aliasProblems(), aliasProblemsOf(), asRecord(), budgetProblems(), catalogueIds() (+17 more)

### Community 80 - "SaveDto.ts"
Cohesion: 0.18
Nodes (8): QuarantineDto, LoadFailureReason, LoadResult, loadFailureMessage(), MESSAGES, RecordingGameOptions, BootSetupOptions, FakeSaveManager

### Community 82 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 83 - "area-progress.test.ts"
Cohesion: 0.24
Nodes (6): 2. Authoring format, Review labels, SpecTopic, SpecTopicCatalogue, areaBundle(), room()

### Community 84 - "W7 round-5 re-test — Assistance Ward (2026-11-27)"
Cohesion: 0.20
Nodes (9): 1. Expected path claims — checked against play, 2. R4-1 closure claim — verified carefully, 3. Gate table check, 4. Status of the original thirteen findings, 5. Status of round-2 A–E, round-3's two findings and round-4's findings, 6. Difficulty and fairness record, Additional observation (not a finding), Priority list from the player's point of view (+1 more)

### Community 85 - "ConversationTopic"
Cohesion: 0.11
Nodes (26): 3. Commands and topic resolution, 8. NPC card format, actorKeywordTopic(), hasKeyword(), isBoundToActor(), TopicResolver, ConversationNode, ConversationTopic (+18 more)

### Community 86 - "engine-followups-2-hintretry.spec.ts"
Cohesion: 0.20
Nodes (10): AuthoredQuestion, AuthoredQuiz, continueFromSave(), displayedQuestion(), enterSwitchFloorQuiz(), expectHintHidden(), hintPanel(), numberedOptions() (+2 more)

### Community 87 - "Favicon.test.ts"
Cohesion: 0.28
Nodes (5): attributes(), FAVICON_PATH, iconLinks(), INDEX_PATH, linkElements()

### Community 88 - "NpcGates.test.ts"
Cohesion: 0.21
Nodes (9): actor(), Data, EmittedNode, EmittedTopic, node(), NOT_KNOWN, npcData(), npcFindings() (+1 more)

### Community 90 - "Areas, rooms and items"
Cohesion: 0.15
Nodes (13): 2. Ownership and worlds, 3. Exits and items, 5. Integration points, 6. Gates, 7. Card format, 8. Reviewer and playtest checks, 9.1 Definition of done, 9.2 Hard constraints and escalation (+5 more)

### Community 91 - "Storage schema"
Cohesion: 0.15
Nodes (12): 11. Flow, 12. Invariants the implementation must keep, 13. Out of scope, 1. Scope and authority, 3.1 Top-level DTO, 3.3 Invariants, 3. Persisted shape (canonical), 5. Quiz attempts (+4 more)

### Community 92 - "engine-issue-13-inventory.test.ts"
Cohesion: 0.31
Nodes (9): getCommandHandler, bundleWithItems(), CARTRIDGE, contextFor(), handlerFor(), inventoryReply(), LAMP, messagesOf() (+1 more)

### Community 93 - "Quiz combat"
Cohesion: 0.17
Nodes (12): 1. Scope, 2. Model, 4. Commands and events, 5. Hints, 6. Card format, 7. Reviewer and playtest checks, 8.1 Definition of done, 8.2 Hard constraints and escalation (+4 more)

### Community 94 - "PuzzleSystem.ts"
Cohesion: 0.29
Nodes (9): FiredThisTurn, hasAlreadyFired(), isPossessionInsufficient(), isPossessionOnly(), markFired(), reactionFor(), shouldSkip(), solveEffects() (+1 more)

### Community 95 - "Puzzles"
Cohesion: 0.20
Nodes (10): 10. Gates, 4. Puzzle Dependency Graph, 6. Integration points, 7. Card format, 8. Reviewer and playtest checks, 9.1 Definition of done, 9.2 Hard constraints and escalation, 9. Agent acceptance (+2 more)

### Community 96 - "Q: Where are the ESLint flat config, NPM scripts, strict compilerOptions and Vite base configured?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the ESLint flat config, NPM scripts, strict compilerOptions and Vite base configured?, Source Nodes

### Community 97 - "Q: Did adding typescript-eslint introduce duplicate canonical configs or cross-layer edges?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Did adding typescript-eslint introduce duplicate canonical configs or cross-layer edges?, Source Nodes

### Community 98 - "Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?, Source Nodes

### Community 99 - "Q: Where are the runtime seams SaveManager Game createInitial EffectApplier Session BrowserStorage defined and how do they connect?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the runtime seams SaveManager Game createInitial EffectApplier Session BrowserStorage defined and how do they connect?, Source Nodes

### Community 100 - "Q: Bypass check: do compsciquest:save:v1, door-open: or earnedScore have code paths outside the canonical hubs?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bypass check: do compsciquest:save:v1, door-open: or earnedScore have code paths outside the canonical hubs?, Source Nodes

### Community 101 - "Q: Revision 1: did removing the root-level lives mirror and stub default restore canonical GameStateDto and initial turn 0?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: did removing the root-level lives mirror and stub default restore canonical GameStateDto and initial turn 0?, Source Nodes

### Community 102 - "Q: Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?, Source Nodes

### Community 103 - "Q: Which canonical nodes own ContentBundle, validateContent, structural validation gates and score budgets?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own ContentBundle, validateContent, structural validation gates and score budgets?, Source Nodes

### Community 104 - "Q: Does the new validator create a hub, cross-layer edge or cycle?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the new validator create a hub, cross-layer edge or cycle?, Source Nodes

### Community 105 - "Q: Is there an existing owner for content validation or effect-scanning that should be reused?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Is there an existing owner for content validation or effect-scanning that should be reused?, Source Nodes

### Community 106 - "Q: Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?, Source Nodes

### Community 107 - "Q: Which canonical nodes own parser, turn pipeline and event formatting responsibilities?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own parser, turn pipeline and event formatting responsibilities?, Source Nodes

### Community 108 - "Q: Do any bypasses reimplement earnedScore, door-open flags, event bus, unknown message or exits formatting outside their canonical hubs?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do any bypasses reimplement earnedScore, door-open flags, event bus, unknown message or exits formatting outside their canonical hubs?, Source Nodes

### Community 109 - "Q: Which canonical node owns content validation for the YAML-first toolchain red tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns content validation for the YAML-first toolchain red tests?, Source Nodes

### Community 110 - "Q: Which canonical nodes own content validation, content loading, stub bundle and NPC conversation types before adding toolchain modules?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own content validation, content loading, stub bundle and NPC conversation types before adding toolchain modules?, Source Nodes

### Community 111 - "Q: Revision 1: which canonical nodes own façade Command resolution for put noun in target, and the already-open door/container precondition message?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: which canonical nodes own façade Command resolution for put noun in target, and the already-open door/container precondition message?, Source Nodes

### Community 112 - "Q: Revision 1: which canonical nodes own put-command resolution, short-name alias resolution and the already-open precondition?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: which canonical nodes own put-command resolution, short-name alias resolution and the already-open precondition?, Source Nodes

### Community 113 - "Q: Revision 1 graph audit: any new bypasses, cross-layer edges or unexpected hub?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1 graph audit: any new bypasses, cross-layer edges or unexpected hub?, Source Nodes

### Community 114 - "Q: Do the new content toolchain nodes bypass the canonical runtime validator or catalogue factory?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do the new content toolchain nodes bypass the canonical runtime validator or catalogue factory?, Source Nodes

### Community 115 - "Q: Did the toolchain slice introduce a new catch-all hub, cross-layer import or import cycle?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Did the toolchain slice introduce a new catch-all hub, cross-layer import or import cycle?, Source Nodes

### Community 116 - "Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts, Source Nodes

### Community 117 - "Q: Which canonical nodes own area-like declarations, exit normalisation and todo detection for the content toolchain?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own area-like declarations, exit normalisation and todo detection for the content toolchain?, Source Nodes

### Community 118 - "Q: Do the revision-1 helpers bypass validateContent(), finding() or collection()?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do the revision-1 helpers bypass validateContent(), finding() or collection()?, Source Nodes

### Community 119 - "Q: Where do boot, title overlay, GameViewData, validation and save quarantine live?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do boot, title overlay, GameViewData, validation and save quarantine live?, Source Nodes

### Community 120 - "Q: Which canonical node audits covered-topic completion sources?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node audits covered-topic completion sources?, Source Nodes

### Community 121 - "Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?, Source Nodes

### Community 122 - "Q: Does boot have an existing validation owner other than validateContent(), and where do LoadFailureReason copy and quarantine live?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does boot have an existing validation owner other than validateContent(), and where do LoadFailureReason copy and quarantine live?, Source Nodes

### Community 123 - "Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?, Source Nodes

### Community 124 - "Q: CT-GATE-08: which node owns the hint-content unlock-key namespace check and why is hints-shown:<hintId> rejected?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: CT-GATE-08: which node owns the hint-content unlock-key namespace check and why is hints-shown:<hintId> rejected?, Source Nodes

### Community 125 - "Q: Which gate validates hint unlock counter-key prefixes and which prefixes are agreed?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which gate validates hint unlock counter-key prefixes and which prefixes are agreed?, Source Nodes

### Community 126 - "Q: C3 generator and handoff contracts: generateContent(), indentJson(), emitCatalogue(), stripAuthoring(), loadContent(), createInitial(), stubBundle, validateContent(), GeneratedFile, specTopics, parsedSet(), topicHeadings"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: C3 generator and handoff contracts: generateContent(), indentJson(), emitCatalogue(), stripAuthoring(), loadContent(), createInitial(), stubBundle, validateContent(), GeneratedFile, specTopics, parsedSet(), topicHeadings(), Source Nodes

### Community 127 - "Q: C3 generated handoff: which canonical nodes own compact emission, YAML-to-DTO adaptation and the initial-state default bundle?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: C3 generated handoff: which canonical nodes own compact emission, YAML-to-DTO adaptation and the initial-state default bundle?, Source Nodes

### Community 128 - "Q: Why do C-CONTENT-12/17 fail after C3 generation when validate(loadContent(), COVERAGE_TOPIC_IDS) is called?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do C-CONTENT-12/17 fail after C3 generation when validate(loadContent(), COVERAGE_TOPIC_IDS) is called?, Source Nodes

### Community 129 - "Q: Who owns directory-path declaration ordering for generated catalogues, and how should a slash-less root card path be grouped?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns directory-path declaration ordering for generated catalogues, and how should a slash-less root card path be grouped?, Source Nodes

### Community 130 - "Q: Which UI nodes own the boot title overlay geometry, 360px workspace reflow and transcript live region?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which UI nodes own the boot title overlay geometry, 360px workspace reflow and transcript live region?, Source Nodes

### Community 131 - "Q: Where do the generated zone-1 catalogues, title screen, save controls and view fields come from?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do the generated zone-1 catalogues, title screen, save controls and view fields come from?, Source Nodes

### Community 132 - "Q: Where is Vitest test collection configured and how do I exclude e2e specs?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is Vitest test collection configured and how do I exclude e2e specs?, Source Nodes

### Community 133 - "Q: Query formatEvent, GameEvent, TitleScreen, SaveControls and GameViewData so assertions use the real event names and view fields rather than remembered ones"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Query formatEvent, GameEvent, TitleScreen, SaveControls and GameViewData so assertions use the real event names and view fields rather than remembered ones, Source Nodes

### Community 134 - "Q: Does the ES2022-safe copy-then-sort change preserve generator output and satisfy the Array#toSorted lint rule without suppressions?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the ES2022-safe copy-then-sort change preserve generator output and satisfy the Array#toSorted lint rule without suppressions?, Source Nodes

### Community 135 - "Q: Where are the named Playwright boot tests and GameWindow echo path?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the named Playwright boot tests and GameWindow echo path?, Source Nodes

### Community 136 - "Q: Do hazard and puzzle doc concept nodes expose runtime source_location?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do hazard and puzzle doc concept nodes expose runtime source_location?, Source Nodes

### Community 137 - "Q: Which nodes are canonical for hazards, puzzles, scheduler, effects and phase-4 ordering in the hazards-puzzles slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which nodes are canonical for hazards, puzzles, scheduler, effects and phase-4 ordering in the hazards-puzzles slice?, Source Nodes

### Community 138 - "Q: Where is the canonical production Game factory used by main.ts for UI-BOOT-18 wiring?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical production Game factory used by main.ts for UI-BOOT-18 wiring?, Source Nodes

### Community 139 - "Q: Where are the canonical owners for hazard/puzzle/scheduler/effect/score behaviour in the hazards-puzzles slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical owners for hazard/puzzle/scheduler/effect/score behaviour in the hazards-puzzles slice?, Source Nodes

### Community 140 - "Q: Why did H-SCHED-04 fail on fixture wiring after the scheduler was implemented?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did H-SCHED-04 fail on fixture wiring after the scheduler was implemented?, Source Nodes

### Community 141 - "Q: Which collaborators canonically own game-over, score awards and hazard events so test seams should delegate to them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which collaborators canonically own game-over, score awards and hazard events so test seams should delegate to them?, Source Nodes

### Community 142 - "Q: validateContent() hazardContentFindings() puzzleGraphFindings() content:validate content:scaffold content:generate verbatimModuleSyntax allowImportingTsExtensions loadValidation() loadScaffolder() loadGenerator() ValidationModule"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: validateContent() hazardContentFindings() puzzleGraphFindings() content:validate content:scaffold content:generate verbatimModuleSyntax allowImportingTsExtensions loadValidation() loadScaffolder() loadGenerator() ValidationModule, Source Nodes

### Community 143 - "Q: Which canonical module owns validation and what value imports must carry the .ts extension for plain Node ESM resolution?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical module owns validation and what value imports must carry the .ts extension for plain Node ESM resolution?, Source Nodes

### Community 144 - "Q: room-scoping: which ConditionEvaluator node is canonical for in-room/in-area, visited-room and topic-complete?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: room-scoping: which ConditionEvaluator node is canonical for in-room/in-area, visited-room and topic-complete?, Source Nodes

### Community 145 - "Q: Which canonical nodes own condition scoping (in-room/in-area and progress-wide visited-room/topic-complete), and are there duplicate owners or bypasses after the room-scoping change?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own condition scoping (in-room/in-area and progress-wide visited-room/topic-complete), and are there duplicate owners or bypasses after the room-scoping change?, Source Nodes

### Community 146 - "Q: Where are the canonical owners for the amended event-returning phase-4 composition, hazard triggers, puzzle counters and per-puzzle scoring?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical owners for the amended event-returning phase-4 composition, hazard triggers, puzzle counters and per-puzzle scoring?, Source Nodes

### Community 147 - "Q: How are commands parsed and what event names/view fields exist for assertions?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How are commands parsed and what event names/view fields exist for assertions?, Source Nodes

### Community 148 - "Q: DialogueSystem TopicResolver ConversationTopic ConversationNode ActorState NpcStateDto ResolvedTopic TopicMatch ResponseStrategy ConversationPanel ConditionEvaluator EffectApplier"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: DialogueSystem TopicResolver ConversationTopic ConversationNode ActorState NpcStateDto ResolvedTopic TopicMatch ResponseStrategy ConversationPanel ConditionEvaluator EffectApplier, Source Nodes

### Community 149 - "Q: P-TAKE-01: where is takeHandler() and which canonical nodes gate take/drop and define ItemDefinition?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: P-TAKE-01: where is takeHandler() and which canonical nodes gate take/drop and define ItemDefinition?, Source Nodes

### Community 150 - "Q: P-TAKE-01: where is the canonical take/drop handler and which item fields drive its refusal?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: P-TAKE-01: where is the canonical take/drop handler and which item fields drive its refusal?, Source Nodes

### Community 151 - "Q: F1: does an authored refusalText of '' on a non-portable item use the fallback in takeHandler()?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: F1: does an authored refusalText of '' on a non-portable item use the fallback in takeHandler()?, Source Nodes

### Community 152 - "Q: Where are the NPC runtime seams: TopicResolver, DialogueSystem, ConversationTopic/Node, ActorState, NpcStateDto, EffectApplier and the Game facade?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the NPC runtime seams: TopicResolver, DialogueSystem, ConversationTopic/Node, ActorState, NpcStateDto, EffectApplier and the Game facade?, Source Nodes

### Community 153 - "Q: F1: which handler selects refusalText for a non-portable take, and where is the fallback literal produced?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: F1: which handler selects refusalText for a non-portable take, and where is the fallback literal produced?, Source Nodes

### Community 154 - "Q: Where is room-entered built and formatted, and which nodes carry the catalogue room summary?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is room-entered built and formatted, and which nodes carry the catalogue room summary?, Source Nodes

### Community 155 - "Q: How are use, put and show commands produced and which handlers map them today?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How are use, put and show commands produced and which handlers map them today?, Source Nodes

### Community 156 - "Q: Where are QuizSystem, HintSystem and the composed reaction wired?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are QuizSystem, HintSystem and the composed reaction wired?, Source Nodes

### Community 157 - "Q: npcs slice: NPC runtime behaviour seam locations (DialogueSystem, TopicResolver, ConversationFlow, ConversationTopic/Node, ActorState, NpcStateDto, TopicMatch, ResolvedTopic, ResponseStrategy)"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: npcs slice: NPC runtime behaviour seam locations (DialogueSystem, TopicResolver, ConversationFlow, ConversationTopic/Node, ActorState, NpcStateDto, TopicMatch, ResolvedTopic, ResponseStrategy), Source Nodes

### Community 158 - "Q: Where is the authoring-only refusalText check implemented and what are the other gate owners in tools/content/schema.ts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the authoring-only refusalText check implemented and what are the other gate owners in tools/content/schema.ts?, Source Nodes

### Community 159 - "Q: NPC slice: where is the node-default catch and node expiry implemented and why do NODE-02 and GAP-05 share the same shape"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: NPC slice: where is the node-default catch and node expiry implemented and why do NODE-02 and GAP-05 share the same shape, Source Nodes

### Community 160 - "Q: NPC slice: locate DialogueSystem, TopicResolver, ConversationTopic, ConversationNode, ActorState, NpcStateDto, ResolvedTopic, TopicMatch, ResponseStrategy, ConversationPanel, ConditionEvaluator, EffectApplier"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: NPC slice: locate DialogueSystem, TopicResolver, ConversationTopic, ConversationNode, ActorState, NpcStateDto, ResolvedTopic, TopicMatch, ResponseStrategy, ConversationPanel, ConditionEvaluator, EffectApplier, Source Nodes

### Community 161 - "Q: Where are the canonical connected authored-effects seams for room entry, USE/PUT/SHOW, quiz and hint delivery?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical connected authored-effects seams for room entry, USE/PUT/SHOW, quiz and hint delivery?, Source Nodes

### Community 162 - "Q: Which canonical nodes own the quizzes-hints slice seam, quiz-passed condition, panel rendering and score guard?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the quizzes-hints slice seam, quiz-passed condition, panel rendering and score guard?, Source Nodes

### Community 163 - "Q: Which nodes own quiz and hint delivery in the quiz-hints slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which nodes own quiz and hint delivery in the quiz-hints slice?, Source Nodes

### Community 164 - "Q: Which canonical nodes own W7 room/event rendering and the observed non-quiz runtime failures?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own W7 room/event rendering and the observed non-quiz runtime failures?, Source Nodes

### Community 165 - "Q: Quiz and hint revision contracts: seeded Random persistence, set-flag no-op, answer aliases, automatic hint cadence"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Quiz and hint revision contracts: seeded Random persistence, set-flag no-op, answer aliases, automatic hint cadence, Source Nodes

### Community 166 - "Q: Why did the QUIZ-HINT-07 room-context hint resolve to the Binary Hall instead of the switch floor?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did the QUIZ-HINT-07 room-context hint resolve to the Binary Hall instead of the switch floor?, Source Nodes

### Community 167 - "Q: How should a quiz retry re-set emit while ScoreTracker awards once, and which object owns the injected initial state?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should a quiz retry re-set emit while ScoreTracker awards once, and which object owns the injected initial state?, Source Nodes

### Community 168 - "Q: C7 npc topic overlap gate: where do checkNpc, validateCards, ValidationOptions and Condition exclusivity live and is there an existing overlap owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: C7 npc topic overlap gate: where do checkNpc, validateCards, ValidationOptions and Condition exclusivity live and is there an existing overlap owner?, Source Nodes

### Community 169 - "Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?, Source Nodes

### Community 170 - "Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?, Source Nodes

### Community 171 - "Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?, Source Nodes

### Community 172 - "Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?, Source Nodes

### Community 173 - "Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?, Source Nodes

### Community 174 - "Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?, Source Nodes

### Community 175 - "Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?, Source Nodes

### Community 176 - "Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?, Source Nodes

### Community 177 - "Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?, Source Nodes

### Community 178 - "Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?, Source Nodes

### Community 179 - "Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?, Source Nodes

### Community 180 - "Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?, Source Nodes

### Community 181 - "Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?, Source Nodes

### Community 182 - "Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?, Source Nodes

### Community 183 - "Q: Do ordinary browser commands autosave the game state?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do ordinary browser commands autosave the game state?, Source Nodes

### Community 184 - "Q: Where does the area-entry life reset gate live and how can it be exercised in a browser?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the area-entry life reset gate live and how can it be exercised in a browser?, Source Nodes

### Community 185 - "Q: How to override the Playwright baseURL in a scratchpad config?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How to override the Playwright baseURL in a scratchpad config?, Source Nodes

### Community 186 - "Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?, Source Nodes

### Community 187 - "Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?, Source Nodes

### Community 188 - "Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?, Source Nodes

### Community 189 - "Q: Bypass check: does any source outside ScorePanel reimplement the per-area Score / Rooms visited sidebar lines?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bypass check: does any source outside ScorePanel reimplement the per-area Score / Rooms visited sidebar lines?, Source Nodes

### Community 190 - "Q: Which production node owns sidebar area-card rendering and how should it select the current area from GameViewData?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production node owns sidebar area-card rendering and how should it select the current area from GameViewData?, Source Nodes

### Community 191 - "Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?, Source Nodes

### Community 192 - "Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?, Source Nodes

### Community 193 - "Q: ENG11 browser QA: how should the W7 expectAreaConsistency helper assert sidebar state after the current-area-only change, and where does the headline score come from in a saved v1 DTO?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG11 browser QA: how should the W7 expectAreaConsistency helper assert sidebar state after the current-area-only change, and where does the headline score come from in a saved v1 DTO?, Source Nodes

### Community 194 - "Q: Which production nodes own the sidebar progress panel and how does ScorePanel.renderArea/refresh render area cards from GameViewData for ENG11?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which production nodes own the sidebar progress panel and how does ScorePanel.renderArea/refresh render area cards from GameViewData for ENG11?, Source Nodes

### Community 195 - "Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?, Source Nodes

### Community 196 - "Q: Why does generated help text with newlines display as one dense paragraph in the transcript?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does generated help text with newlines display as one dense paragraph in the transcript?, Source Nodes

### Community 197 - "Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?, Source Nodes

### Community 198 - "Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?, Source Nodes

### Community 199 - "Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?, Source Nodes

### Community 200 - "Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?, Source Nodes

### Community 201 - "Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?, Source Nodes

### Community 202 - "Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?, Source Nodes

### Community 203 - "Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?, Source Nodes

### Community 204 - "Q: Does the W7 trace step's entry title precede the hazard message?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the W7 trace step's entry title precede the hazard message?, Source Nodes

### Community 205 - "Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?, Source Nodes

### Community 206 - "Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?, Source Nodes

### Community 207 - "Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: inventoryHandler() takeHandler() ItemDefinition ContentBundle .getById() formatEvent() verbs/index.ts transferItem() topicLabel(), Source Nodes

### Community 208 - "Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?, Source Nodes

### Community 209 - "Q: Can the Playwright MCP browser drive the app in this session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this session?, Source Nodes

### Community 210 - "Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?, Source Nodes

### Community 211 - "Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?, Source Nodes

### Community 212 - "Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?, Source Nodes

### Community 213 - "Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?, Source Nodes

### Community 214 - "Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?, Source Nodes

### Community 215 - "Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?, Source Nodes

### Community 216 - "Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?, Source Nodes

### Community 217 - "Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?, Source Nodes

### Community 218 - "Q: Is there an existing owner for detail-suffix help rendering that detailSuffix() duplicates?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Is there an existing owner for detail-suffix help rendering that detailSuffix() duplicates?, Source Nodes

### Community 219 - "Q: Where is the canonical help copy generated and which node owns COMMAND_TABLE / helpText() for ask and answer syntax?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical help copy generated and which node owns COMMAND_TABLE / helpText() for ask and answer syntax?, Source Nodes

### Community 220 - "Q: Can the Playwright MCP browser drive the app in this session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this session?, Source Nodes

### Community 221 - "Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?, Source Nodes

### Community 222 - "Q: Where is the browser-rendered help copy generated and which nodes own the issue-9 ask/bare-answer forms?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the browser-rendered help copy generated and which nodes own the issue-9 ask/bare-answer forms?, Source Nodes

### Community 223 - "Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?, Source Nodes

### Community 224 - "Q: Which canonical node derives a puzzle's completion effect, and is there a duplicate derivation bypassing it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node derives a puzzle's completion effect, and is there a duplicate derivation bypassing it?, Source Nodes

### Community 225 - "Q: E2E-22-01: does a single puzzle solve still print the friendly completion line twice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: E2E-22-01: does a single puzzle solve still print the friendly completion line twice?, Source Nodes

### Community 226 - "Q: ENG28-ACTIVATION-01: which node canonically owns formatEvent transcript rendering and suppression of puzzle-activated, and is the effect/event pipeline unchanged?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG28-ACTIVATION-01: which node canonically owns formatEvent transcript rendering and suppression of puzzle-activated, and is the effect/event pipeline unchanged?, Source Nodes

### Community 227 - "Q: ENG28-ACTIVATION-01: which canonical node owns formatEvent transcript rendering for puzzle-activated, and is render-time suppression the only compliant change?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG28-ACTIVATION-01: which canonical node owns formatEvent transcript rendering for puzzle-activated, and is render-time suppression the only compliant change?, Source Nodes

### Community 228 - "Q: Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?, Source Nodes

### Community 229 - "Q: ENG28-ACTIVATION-01 which nodes own puzzle-activated suppression and the effect pipeline?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG28-ACTIVATION-01 which nodes own puzzle-activated suppression and the effect pipeline?, Source Nodes

### Community 230 - "Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?, Source Nodes

### Community 231 - "Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?, Source Nodes

### Community 232 - "Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?, Source Nodes

### Community 233 - "Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?, Source Nodes

### Community 234 - "Q: Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?, Source Nodes

### Community 235 - "Q: ENG16-SAVECONFIRM-01: which canonical node owns the Save/Download confirmation path and should GameWindow.makeActions() route through it?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG16-SAVECONFIRM-01: which canonical node owns the Save/Download confirmation path and should GameWindow.makeActions() route through it?, Source Nodes

### Community 236 - "Q: ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?, Source Nodes

### Community 237 - "Q: ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?, Source Nodes

### Community 238 - "Q: Can the Playwright MCP browser drive the app in this engine-issue-16 session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser drive the app in this engine-issue-16 session?, Source Nodes

### Community 239 - "Q: Why do two engine-issue-9 quick-answer browser tests fail on the engine-issue-16 branch?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do two engine-issue-9 quick-answer browser tests fail on the engine-issue-16 branch?, Source Nodes

### Community 240 - "Q: ENG16-SAVECONFIRM-01: where do the canonical Save/Download confirmation lines come from and how do sidebar buttons reach them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG16-SAVECONFIRM-01: where do the canonical Save/Download confirmation lines come from and how do sidebar buttons reach them?, Source Nodes

### Community 241 - "Q: How should browser-tester run e2e on a different port without touching playwright.config.ts for engine-issue-16?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should browser-tester run e2e on a different port without touching playwright.config.ts for engine-issue-16?, Source Nodes

### Community 242 - "Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?, Source Nodes

### Community 243 - "Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?, Source Nodes

### Community 244 - "Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?, Source Nodes

### Community 245 - "Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?, Source Nodes

### Community 246 - "Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?, Source Nodes

### Community 247 - "Q: Where does autosave hook into Game.submit and where is the quarantine download button defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does autosave hook into Game.submit and where is the quarantine download button defined?, Source Nodes

### Community 248 - "Q: Where do autosave after submit and the quarantined-save download button live?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do autosave after submit and the quarantined-save download button live?, Source Nodes

### Community 249 - "Q: ENG24 autosave: why does the post-observer trace assertion fail even though the saved DTO has final state?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG24 autosave: why does the post-observer trace assertion fail even though the saved DTO has final state?, Source Nodes

### Community 250 - "Q: Which canonical nodes own autosave on Game.submit and the five SaveControls buttons for ENG24-AUTOSAVE-01 and ENG31-REMOVEQUARANTINE-01?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own autosave on Game.submit and the five SaveControls buttons for ENG24-AUTOSAVE-01 and ENG31-REMOVEQUARANTINE-01?, Source Nodes

### Community 251 - "Q: Why do 11 unrelated e2e tests fail on the port-5224 run?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do 11 unrelated e2e tests fail on the port-5224 run?, Source Nodes

### Community 252 - "Q: Where are QuizView.remainingWrong and the fresh-start save writes defined, and which doc sections own them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are QuizView.remainingWrong and the fresh-start save writes defined, and which doc sections own them?, Source Nodes

### Community 253 - "Q: ENG24-FRESHSTART-01/DEDUP-01: which nodes own fresh-start state construction and the live save write?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG24-FRESHSTART-01/DEDUP-01: which nodes own fresh-start state construction and the live save write?, Source Nodes

### Community 254 - "Q: ENG30-REMAINING-02: where is remainingWrong derived and which QuizView node is canonical for the red tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG30-REMAINING-02: where is remainingWrong derived and which QuizView node is canonical for the red tests?, Source Nodes

### Community 255 - "Q: Where are QuizView.remainingWrong, createFreshState and the fresh-start save writes defined, and which seam owns them?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are QuizView.remainingWrong, createFreshState and the fresh-start save writes defined, and which seam owns them?, Source Nodes

### Community 256 - "Q: Does any second node implement a conditional use effect or authored useText mapping outside the canonical producer?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does any second node implement a conditional use effect or authored useText mapping outside the canonical producer?, Source Nodes

### Community 257 - "Q: Where is the conditional use producer, authored useText mapping and condition gate owned for W6S-01..04?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the conditional use producer, authored useText mapping and condition gate owned for W6S-01..04?, Source Nodes

### Community 258 - "Q: ENG24-REANCHOR-UNIT-02: which node owns typed restart and its fresh-state save, and where is the inherited no-write loop?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ENG24-REANCHOR-UNIT-02: which node owns typed restart and its fresh-state save, and where is the inherited no-write loop?, Source Nodes

### Community 259 - "Q: Where are the pass-line requirementLine helper, the unused QUARANTINE_DOWNLOAD_NAME export, the restart fresh-start writes, and the quiz view fields defined for ENG30 re-anchoring and fresh-start QA?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the pass-line requirementLine helper, the unused QUARANTINE_DOWNLOAD_NAME export, the restart fresh-start writes, and the quiz view fields defined for ENG30 re-anchoring and fresh-start QA?, Source Nodes

### Community 260 - "Q: Revision round 1: where are the two stale e2e expectations that New Game leaves storage empty and typed load restores a seeded score-7 save, now that .newGame() writes a fresh save?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Revision round 1: where are the two stale e2e expectations that New Game leaves storage empty and typed load restores a seeded score-7 save, now that .newGame() writes a fresh save?, Source Nodes

### Community 261 - "Q: ward-w7-fixes: canonical owners for parser aliases, unlock denial, quiz starts, hint targets"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ward-w7-fixes: canonical owners for parser aliases, unlock denial, quiz starts, hint targets, Source Nodes

### Community 262 - "Q: Which seams own load confirmation, transient hint clearing on quiz retry, and the quiz requirement aria-live region?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which seams own load confirmation, transient hint clearing on quiz retry, and the quiz requirement aria-live region?, Source Nodes

### Community 263 - "Q: Why does typing hint after a switchyard quiz retry say there is nothing more to suggest, and how should the browser e2e reach a fresh hint?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does typing hint after a switchyard quiz retry say there is nothing more to suggest, and how should the browser e2e reach a fresh hint?, Source Nodes

### Community 264 - "Q: W7F-01..14: which canonical owners implement parser aliases, unlock splitting, gate denial, blockedText shape/adapt, quiz idempotence, transfer announcement, title copy and room hint targets?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: W7F-01..14: which canonical owners implement parser aliases, unlock splitting, gate denial, blockedText shape/adapt, quiz idempotence, transfer announcement, title copy and room hint targets?, Source Nodes

### Community 265 - "Q: Which canonical nodes supply the approved title copy, help aliases and gate fallback that the four stale e2e assertions must re-anchor?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes supply the approved title copy, help aliases and gate fallback that the four stale e2e assertions must re-anchor?, Source Nodes

### Community 266 - "Q: Why do four W7 browser tests still fail after the string re-anchor, and is it caused by this slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do four W7 browser tests still fail after the string re-anchor, and is it caused by this slice?, Source Nodes

### Community 267 - "Q: Which canonical nodes own browser save seeding and continuation for gated later-area e2e traces?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own browser save seeding and continuation for gated later-area e2e traces?, Source Nodes

### Community 268 - "Q: Which accepted sources own the hub escape reply and interface room prose re-anchored in W7 Beat C, and the 23-room bundle count?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which accepted sources own the hub escape reply and interface room prose re-anchored in W7 Beat C, and the 23-room bundle count?, Source Nodes

### Community 269 - "Q: After the W6 handoff regeneration, which accepted sources own the revised hub and interface room prose asserted by W7 Beat C?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: After the W6 handoff regeneration, which accepted sources own the revised hub and interface room prose asserted by W7 Beat C?, Source Nodes

### Community 270 - "Q: Which code paths own wrong-order unlock refusal and arrival scenery examine"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which code paths own wrong-order unlock refusal and arrival scenery examine, Source Nodes

### Community 271 - "Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?, Source Nodes

### Community 272 - "Q: Which canonical nodes own the WR2-B1 wrong-order unlock refusal, WR2-B2 item-first unlock preservation and WR2-E1 arrival scenery examine contracts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the WR2-B1 wrong-order unlock refusal, WR2-B2 item-first unlock preservation and WR2-E1 arrival scenery examine contracts?, Source Nodes

### Community 273 - "Q: Who owns arrival register/record/mark scenery prose for WR2-E1?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns arrival register/record/mark scenery prose for WR2-E1?, Source Nodes

### Community 274 - "Q: Who owns wrong-order unlock refusal for a non-portable item offered as the key-like item (WR2-B1)?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns wrong-order unlock refusal for a non-portable item offered as the key-like item (WR2-B1)?, Source Nodes

### Community 275 - "Q: Bypass check on WR2-B1 refusal literal and WR2-E1 arrival scenery prose: any reimplementation outside the canonical hub?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bypass check on WR2-B1 refusal literal and WR2-E1 arrival scenery prose: any reimplementation outside the canonical hub?, Source Nodes

### Community 276 - "Q: Where is the approved dial blocked string pinned in tests, and which authority superseded it in round 2?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the approved dial blocked string pinned in tests, and which authority superseded it in round 2?, Source Nodes

### Community 277 - "Q: Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?, Source Nodes

### Community 278 - "Q: Do the record and mark aliases in the room-arrival SCENERY entry make resolveScenery ambiguous?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do the record and mark aliases in the room-arrival SCENERY entry make resolveScenery ambiguous?, Source Nodes

### Community 279 - "Q: Why is Continue disabled after reloading a full authored win save?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why is Continue disabled after reloading a full authored win save?, Source Nodes

### Community 280 - "Q: Is the zone-1 turns-since hint dead end a content-authoring issue rather than an engine bug, and what content options exist?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Is the zone-1 turns-since hint dead end a content-authoring issue rather than an engine bug, and what content options exist?, Source Nodes

### Community 281 - "Q: Why did eleven e2e tests fail after the round-2 ward card regeneration, and how were stale expectations re-anchored?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did eleven e2e tests fail after the round-2 ward card regeneration, and how were stale expectations re-anchored?, Source Nodes

### Community 282 - "Q: Why does a crafted v1 save with empty room inventories make 'unlock practice cabinet with practice key' return 'I don't understand that.'?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does a crafted v1 save with empty room inventories make 'unlock practice cabinet with practice key' return 'I don't understand that.'?, Source Nodes

### Community 283 - "Q: Can the coverage graph supply the round-2 dial blocked string, the saving keyword and the state-true hub/Interface prose?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the coverage graph supply the round-2 dial blocked string, the saving keyword and the state-true hub/Interface prose?, Source Nodes

### Community 284 - "Q: Where does putHandler() choose toOwnerId for an authored item fixture and how is putInteraction() reused?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does putHandler() choose toOwnerId for an authored item fixture and how is putInteraction() reused?, Source Nodes

### Community 285 - "Q: Does mapping every item PUT target to the current room break existing parser verb contracts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does mapping every item PUT target to the current room break existing parser verb contracts?, Source Nodes

### Community 286 - "Q: Why does a clean authored win save fail hasValidReferences and disable Continue after reload?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does a clean authored win save fail hasValidReferences and disable Continue after reload?, Source Nodes

### Community 287 - "Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, the existing answer paths and the outside-quiz unknown path?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, the existing answer paths and the outside-quiz unknown path?, Source Nodes

### Community 288 - "Q: Which canonical node owns exact displayed quiz option text as an answer, and where should the WR3-A1 fix and shared option-text normalisation live?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns exact displayed quiz option text as an answer, and where should the WR3-A1 fix and shared option-text normalisation live?, Source Nodes

### Community 289 - "Q: Which node owns grant-item inventory mutation and how does it keep one owner per item?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which node owns grant-item inventory mutation and how does it keep one owner per item?, Source Nodes

### Community 290 - "Q: Does grant-item need a new helper to remove authored initialRoom copies?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does grant-item need a new helper to remove authored initialRoom copies?, Source Nodes

### Community 291 - "Q: Can a Playwright e2e test retry quiz starts until a target option is not the final question?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can a Playwright e2e test retry quiz starts until a target option is not the final question?, Source Nodes

### Community 292 - "Q: Does a wrong free-text quiz answer receive the quiz's out-of-range string?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does a wrong free-text quiz answer receive the quiz's out-of-range string?, Source Nodes

### Community 293 - "Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, answer N/bare N and the outside-quiz unknown path?"
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

### Community 314 - "CommandTable.ts"
Cohesion: 0.32
Nodes (7): aliasSuffix(), COMMAND_TABLE, CommandSpec, detailSuffix(), DIRECTIONS, DirectionSpec, helpText()

### Community 315 - "PuzzleGraph.ts"
Cohesion: 0.48
Nodes (6): cycleIds(), firstReady(), puzzleGraphFindings(), repeatedIds(), solveOrder(), unreachableIds()

### Community 318 - "Hazards"
Cohesion: 0.18
Nodes (11): 10. Gates, 3. Execution, 4. Failure consequences, 5. Content, 7. Card format, 8. Reviewer and playtest checks, 9.1 Definition of done, 9.2 Hard constraints and escalation (+3 more)

### Community 319 - "Effect"
Cohesion: 0.20
Nodes (11): 1. Purpose and authority, 7. Core contracts, 1. Scope, 1. Purpose, 3.2 Entity and system state, QuizSystemDependencies, Effect, Hazard (+3 more)

### Community 322 - "npcHandlers.ts"
Cohesion: 0.53
Nodes (4): hasItem(), isTalking(), message(), npcHandler()

### Community 323 - "SourceHygiene.test.ts"
Cohesion: 0.33
Nodes (4): CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES, TEST_SOURCES

### Community 324 - "3.3 Loading and validation"
Cohesion: 0.40
Nodes (3): 3.2 World, area, room and item definitions, 3.3 Loading and validation, 3. Content bundle and registration

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

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

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `helpers.ts`, `makeRuntimeState`, `parser.ts`, `mechanics.ts`, `npcTopicOverlapConditionCases.ts`, `wardKeywordActivity.ts`, `wardTopicLocality.ts`, `wardW7Fixes.ts`, `contentToolchain.ts`, `npcs.ts`, `turn.ts`, `ui.ts`, `GameEvent`, `zone1.ts`, `ContentBundle.ts`, `content.ts`, `scenery-validation.test.ts`, `npcTopicOverlap.ts`, `TopicSelection.test.ts`, `RecordingGame`, `EffectApplier.ts`, `persistence.ts`, `AreaChangeLifeGate.test.ts`, `SourceHygiene.test.ts`, `CommandTable.test.ts`, `devDependencies`, `PlacedBlockClosure.test.ts`, `package.json`, `GameState.ts`, `validateContent.ts`, `SaveDto.ts`, `area-progress.test.ts`, `Favicon.test.ts`, `NpcGates.test.ts`, `engine-issue-13-inventory.test.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Should `helpers.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.055191256830601096 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `Game.ts`, `parser.ts`, `mechanics.ts`, `vitest`, `wardKeywordActivity.ts`, `wardTopicLocality.ts`, `wardW7Fixes.ts`, `npcs.ts`, `turn.ts`, `ui.ts`, `content/index.ts`, `zone1.ts`, `GameWindow.ts`, `GameWindow`, `cli.ts`, `ContentBundle.ts`, `content.ts`, `SaveManager.ts`, `scenery-validation.test.ts`, `commandResolution.ts`, `generate.ts`, `EffectApplier.ts`, `SaveManager`, `NameResolver.ts`, `TopicSelection.ts`, `ScoreTracker`, `PuzzleGraph.ts`, `Game`, `ScoreTracker.ts`, `Effect`, `persistence.ts`, `AreaChangeLifeGate.test.ts`, `HintSystem.ts`, `3.3 Loading and validation`, `CommandTable.test.ts`, `PlacedBlockClosure.test.ts`, `GameState.ts`, `adapt.ts`, `validateContent.ts`, `SaveDto.ts`, `area-progress.test.ts`, `ConversationTopic`, `engine-issue-13-inventory.test.ts`, `PuzzleSystem.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `ContentBundle` be split into smaller, more focused modules?**
  _Cohesion score 0.11058823529411765 - nodes in this community are weakly interconnected._
- **Why does `playwright` connect `helpers.ts` to `engine-followups-freshstart.spec.ts`, `engine-issue-11.spec.ts`, `ward-give-feedback.spec.ts`, `devDependencies`, `ward-round3-fixes.spec.ts`, `transcript`, `w7-opening-walkthrough.spec.ts`, `package.json`, `submit`, `content/index.ts`, `w7-full-win-trace.ts`, `engine-followups-2-hintretry.spec.ts`, `engine-issue-30-passmark.spec.ts`, `readStorage`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._