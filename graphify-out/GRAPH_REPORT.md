# Graph Report - assistance-ward  (2026-11-27)

## Corpus Check
- 489 files · ~258,833 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .jsonc 1, .css 1)

## Summary
- 3543 nodes · 9300 edges · 263 communities (256 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 457 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3b22b405`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NpcGates.test.ts
- collection
- w7-opening-walkthrough.spec.ts
- GameState.ts
- helpers.ts
- content/index.ts
- Issues
- persistence.ts
- wardKeywordActivity.ts
- SaveManager.ts
- verbs/index.ts
- wardTopicLocality.ts
- content.ts
- hint.ts
- npcTopicOverlap.ts
- GameViewData.ts
- asText
- ContentBundle
- topicOverlap.ts
- mechanics.ts
- compilerOptions
- GameViewData
- engine-issue-28-activation.test.ts
- W7 round-5 re-test — Assistance Ward (2026-11-27)
- isActive
- findDefaultTopic
- contentToolchain.ts
- Seven final-review fixes still to apply
- common.ts
- validateContent.ts
- Q: Which SaveManager reference validation quarantines a fixture-owned item inventory key, and what is the smallest canonical fix?
- zone1.ts
- Documentation style guide
- commandResolution.ts
- parser.ts
- LoadResult
- scripts
- Game.ts
- Onboarding.test.ts
- ConversationFlow.ts
- opencode.json
- Q: After the SaveManager fix, does a save written with the practice block placed in the fixture cabinet reload with Continue enabled, and is the invalid-json quarantine path still intact?
- generate.ts
- content/schema.ts
- npcState
- Quiz combat
- 2. Functional defects
- wardW7Fixes.ts
- StorageAdapter
- ward-round3-fixes.spec.ts
- devDependencies
- vitest
- ScoreTracker
- TopicSelection.ts
- deploy.yml
- Parser.ts
- W7 round-4 re-test — Assistance Ward (2026-11-27)
- engine-issue-13-inventory.test.ts
- EffectApplier.ts
- Favicon.test.ts
- Game
- engine-issue-11.spec.ts
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
- Q: Where is P-TAKE-01 takeHandler and what governs portable items?
- Q: Find a document heading node named Room entry text
- node-shims.d.ts
- Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?
- SeededRandom
- W7 non-quiz runtime handoff
- Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?
- W7 re-test — Assistance Ward, round 2 (2026-11-27)
- Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?
- Q: W7F-01..14: which canonical owners implement parser aliases, unlock splitting, gate denial, blockedText shape/adapt, quiz idempotence, transfer announcement, title copy and room hint targets?
- NpcTypes.test.ts
- Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?
- Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?
- Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?
- TopicSelection.test.ts
- ContentBundle.ts
- Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?
- npc-topic-resolution.test.ts
- HintSystem.ts
- package.json
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
- W7 round-3 re-test — Assistance Ward (2026-11-27)
- Q: graphify section '6.1' — which document owns the event to view mapping?
- eslint.config.js
- Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?
- Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?
- Q: Does any second node implement a conditional use effect or authored useText mapping outside the canonical producer?
- Q: Where is the conditional use producer, authored useText mapping and condition gate owned for W6S-01..04?
- Q: ward-w7-fixes: canonical owners for parser aliases, unlock denial, quiz starts, hint targets
- Q: Which canonical nodes supply the approved title copy, help aliases and gate fallback that the four stale e2e assertions must re-anchor?
- Q: Why do four W7 browser tests still fail after the string re-anchor, and is it caused by this slice?
- Q: Which canonical nodes own browser save seeding and continuation for gated later-area e2e traces?
- Q: Which accepted sources own the hub escape reply and interface room prose re-anchored in W7 Beat C, and the 23-room bundle count?
- Q: Which coverage-graph nodes document the tutorial-complete gate for hub east/north?
- HintSequence
- submit
- ScoreTracker
- MemoryContentIo
- Q: Where is the approved dial blocked string pinned in tests, and which authority superseded it in round 2?
- Q: Do the record and mark aliases in the room-arrival SCENERY entry make resolveScenery ambiguous?
- makeBundle
- Q: Why did eleven e2e tests fail after the round-2 ward card regeneration, and how were stale expectations re-anchored?
- Q: Why does a crafted v1 save with empty room inventories make 'unlock practice cabinet with practice key' return 'I don't understand that.'?
- Q: After the W6 handoff regeneration, which accepted sources own the revised hub and interface room prose asserted by W7 Beat C?
- Q: Which code paths own wrong-order unlock refusal and arrival scenery examine
- Q: Which canonical nodes own the WR2-B1 wrong-order unlock refusal, WR2-B2 item-first unlock preservation and WR2-E1 arrival scenery examine contracts?
- Q: Who owns arrival register/record/mark scenery prose for WR2-E1?
- Q: Can the coverage graph supply the round-2 dial blocked string, the saving keyword and the state-true hub/Interface prose?
- Q: Who owns wrong-order unlock refusal for a non-portable item offered as the key-like item (WR2-B1)?
- Q: Bypass check on WR2-B1 refusal literal and WR2-E1 arrival scenery prose: any reimplementation outside the canonical hub?
- Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, the existing answer paths and the outside-quiz unknown path?
- Q: Which canonical node owns exact displayed quiz option text as an answer, and where should the WR3-A1 fix and shared option-text normalisation live?
- Q: Can a Playwright e2e test retry quiz starts until a target option is not the final question?
- Q: Does a wrong free-text quiz answer receive the quiz's out-of-range string?
- Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, answer N/bare N and the outside-quiz unknown path?
- Q: WR4-B1/B2/C1: which canonical nodes own put/take placement feedback, transfer-item ownership and out-of-room give feedback?
- Q: Where are item ownership and current-room visibility owned, and can a block placed in a visible fixture stay nameable?
- Q: Can out-of-room give/show with an unresolvable item emit the canonical absence line without a new Command variant or content card?
- Q: Who owns the fallback source owner for a take when no visible open container branch applies (WR4-B1 closed-cabinet retrieval)?
- GameEvent
- isActive
- zod
- engine-issue-15-life-gate.spec.ts
- TopicPhrase.ts
- Content authoring rules
- PuzzleGraph.ts
- Q: Where do putHandler(), takeHandler(), describeTarget(), ItemVisibility, formatEvent(), GameEvent, TitleScreen, SaveControls and GameViewData live, and what real event names and view fields should browser assertions use?
- Q: Does the assistance orientation quiz always present questions in the authored questionIds order?
- Q: Why does a save written immediately after 'place practice block in practice cabinet' get quarantined as invalid-content on reload?
- Q: WR4 persistence blocker: which canonical SaveManager nodes reject a state.rooms key that is a fixture item ID holding a placed item?

## God Nodes (most connected - your core abstractions)
1. `ContentBundle` - 127 edges
2. `vitest` - 123 edges
3. `GameEvent` - 107 edges
4. `GameState` - 97 edges
5. `Effect` - 62 edges
6. `asText()` - 62 edges
7. `Command` - 60 edges
8. `FakeRandom` - 58 edges
9. `finding()` - 58 edges
10. `makeBundle()` - 49 edges

## Surprising Connections (you probably didn't know these)
- `6. Integration points` --references--> `Command`  [INFERRED]
  docs/developer/puzzles.md → src/core/commands/Command.ts
- `4. Trigger` --references--> `Command`  [INFERRED]
  docs/developer/shared-rules.md → src/core/commands/Command.ts
- `4. Counters and stuckness` --references--> `PuzzleSystem`  [INFERRED]
  docs/developer/storage-schema.md → src/core/puzzles/PuzzleSystem.ts
- `11. Flow` --references--> `Game`  [INFERRED]
  docs/developer/storage-schema.md → src/application/Game.ts
- `1. Scope` --references--> `ConversationNode`  [INFERRED]
  docs/developer/combat.md → src/core/npcs/ConversationNode.ts

## Import Cycles
- None detected.

## Communities (263 total, 7 thin omitted)

### Community 0 - "NpcGates.test.ts"
Cohesion: 0.10
Nodes (21): CardData, cleanParsedSet(), definition(), roomData(), actor(), Data, EmittedNode, EmittedTopic (+13 more)

### Community 1 - "collection"
Cohesion: 0.18
Nodes (24): collection(), coverageIds(), DIRECTIONS, entriesWith(), knownTopicIds(), aliasFindings(), badPrefix(), checkContentIds() (+16 more)

### Community 2 - "w7-opening-walkthrough.spec.ts"
Cohesion: 0.16
Nodes (22): expectHazardOutcome(), hazardAnnouncement(), HazardStep, command(), enter(), expectEntry(), expectFlags(), expectOwners() (+14 more)

### Community 3 - "GameState.ts"
Cohesion: 0.05
Nodes (64): 2. Model, 2. Model, Catalogue, catalogueOf(), RoomSummary, GameStateDto, RuntimeGameState, HazardStateDto (+56 more)

### Community 4 - "helpers.ts"
Cohesion: 0.07
Nodes (26): boot(), openSession(), PROMISED, ROOM_TITLES, authoredArea, authoredStartRoom, authoredWorld, DOWNLOAD_NAME (+18 more)

### Community 5 - "content/index.ts"
Cohesion: 0.10
Nodes (20): area, START_POSITION, startRoom, ActorDefinition, actorStates, actors, areas, conversationTopics (+12 more)

### Community 6 - "Issues"
Cohesion: 0.04
Nodes (45): Batch E1 — Onboarding and intuitive commands (planning-led), Batch E2 — Engine fixes and removals (single implementation batch), Batches, Definition of done, Engine issues — batched hand-off, Issues in scope, Out of scope — deferred to the content session, Parallel execution (+37 more)

### Community 7 - "persistence.ts"
Cohesion: 0.08
Nodes (33): gatedState(), asRuntime(), EffectApplierDependencies, envelopeText(), FIXED_ISO, FixedClock, IMPORTED_ISO, importModule() (+25 more)

### Community 8 - "wardKeywordActivity.ts"
Cohesion: 0.06
Nodes (63): actorBindingScenario(), actorOrderScenario(), actorScenario(), ActorScenarioInput, AI_ID, AI_INITIAL_STATE_ID, AI_STATES, ARRIVAL_AREA_ID (+55 more)

### Community 9 - "SaveManager.ts"
Cohesion: 0.15
Nodes (30): createSaveManager(), ENTITY_RECORD_KEYS, hasOptionalNumber(), hasUniqueItemOwnership(), hasUniqueProgress(), hasValidFlagReferences(), hasValidHazards(), hasValidHints() (+22 more)

### Community 10 - "verbs/index.ts"
Cohesion: 0.07
Nodes (50): AUTHORED_USES, authoredUseEffects(), AuthoredUseInteraction, describeScenery(), examineInteraction(), flagEffects(), FlagInteraction, hasMatchingName() (+42 more)

### Community 11 - "wardTopicLocality.ts"
Cohesion: 0.06
Nodes (44): AI_ID, ARRIVAL_AREA_ID, ARRIVAL_ROOM_ID, DECOY_REPLY, DEMONSTRATION_ROOM_ID, GLOBAL_AI_DEFAULT, GLOBAL_AI_KEYWORD, INTAKE_ROOM_ID (+36 more)

### Community 12 - "content.ts"
Cohesion: 0.09
Nodes (38): vitest, CreateInitial, BASE_AREA, BASE_ITEM, BASE_ROOM, BASE_WORLD, bundleWithTopic(), COVERAGE_TOPIC_IDS (+30 more)

### Community 13 - "hint.ts"
Cohesion: 0.18
Nodes (15): ROOM_TARGETS, asNumber(), CardEntry, checkHint(), ladderFindings(), levelFindings(), penaltyFindings(), targetFindings() (+7 more)

### Community 14 - "npcTopicOverlap.ts"
Cohesion: 0.11
Nodes (66): gNpc06(), gNpc07(), gNpc08(), gNpc09(), gNpc10(), gNpc11(), gNpc12(), gNpc13() (+58 more)

### Community 15 - "GameViewData.ts"
Cohesion: 0.27
Nodes (7): AreaProgressView, ConversationView, HintView, QuizView, SpecTopicView, SpecStatus, SessionStatus

### Community 16 - "asText"
Cohesion: 0.15
Nodes (43): allEffects(), areaLikes(), asObjectArray(), asText(), auditedAreaLikes(), authoringOf(), EFFECT_KINDS, effectList() (+35 more)

### Community 17 - "ContentBundle"
Cohesion: 0.07
Nodes (54): 5.1 Door and container verbs, 5.2 Verb table and handler signature, 5. Canonical command union and verbs, 6.1 Bootstrap (`src/main.ts`), 3. Flow, 5. ID and alias registry, 9. Content registration, GameDependencies (+46 more)

### Community 18 - "topicOverlap.ts"
Cohesion: 0.14
Nodes (33): ALWAYS_TRUE, areKeywordsOverlapping(), areLiteralsExclusive(), ASK_TELL_KINDS, checkTopicOverlap(), childrenOf(), conditionOf(), DataRecord (+25 more)

### Community 20 - "mechanics.ts"
Cohesion: 0.08
Nodes (58): createEffectApplier(), puzzleDefinition(), applierFor(), ComposedReaction, ComposedReactionDependencies, ComposedReactionFactory, ConditionEvaluatorFactory, DOOR_FLAG (+50 more)

### Community 21 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowImportingTsExtensions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules (+20 more)

### Community 22 - "GameViewData"
Cohesion: 0.08
Nodes (28): 7.1 DOM layout, 7.2 View data, 7. UI structure and view-model, Persistence and UI, 6. Events and UI, 7. State, events and UI, 5. Effect and EffectApplier, Batch E1 — onboarding and intuitive commands (+20 more)

### Community 23 - "engine-issue-28-activation.test.ts"
Cohesion: 0.08
Nodes (21): loadFormatEvent(), BUNDLE, COMPLETED, SOLVED_WITH_TOPIC, SOLVED_WITHOUT_TOPIC, ACTIVATED_PUZZLE_IDS, INTERNAL_STATE_EVENTS, NO_GAIN_SCORES (+13 more)

### Community 24 - "W7 round-5 re-test — Assistance Ward (2026-11-27)"
Cohesion: 0.20
Nodes (9): 1. Expected path claims — checked against play, 2. R4-1 closure claim — verified carefully, 3. Gate table check, 4. Status of the original thirteen findings, 5. Status of round-2 A–E, round-3's two findings and round-4's findings, 6. Difficulty and fairness record, Additional observation (not a finding), Priority list from the player's point of view (+1 more)

### Community 25 - "isActive"
Cohesion: 0.10
Nodes (18): 10. Commit / push note, 1. One-paragraph summary, 2. Read these first (in order), 3. What is accepted (content, do not re-litigate), 4.1 Failure inventory, 4.2 The generated bundle is stale — verify this first, 4. Current verification state (measured 2026-11-26), 5. Ordered next steps (+10 more)

### Community 26 - "findDefaultTopic"
Cohesion: 0.33
Nodes (7): fallBackAfterOnce(), findDefaultTopic(), isDefaultTopic(), isExhaustedOnce(), usesOf(), expectSelectionWithoutMutation(), 3. Exhausted `once` defaults

### Community 27 - "contentToolchain.ts"
Cohesion: 0.06
Nodes (44): Data, gateFindings(), PER_AREA_PATHS, cardsWithRefusalText(), expectOneShapeFinding(), ParsedRoom, refusalFindings(), npcFindings() (+36 more)

### Community 28 - "Seven final-review fixes still to apply"
Cohesion: 0.33
Nodes (6): 1. Multi-ID topic resolution, 4. Empty-progress completion, 5. Malformed interaction containers, 6. Strict EXAMINE item fields, 7. Named signature contract, Seven final-review fixes still to apply

### Community 29 - "common.ts"
Cohesion: 0.11
Nodes (39): 5. Generation, bundleOf(), gateOf(), isTrue(), number(), numbers(), sharedFindings(), strings() (+31 more)

### Community 30 - "validateContent.ts"
Cohesion: 0.15
Nodes (24): 7.1 Free-text topic-overlap proof, 7. Structural validation gates, aliasProblems(), aliasProblemsOf(), asRecord(), budgetProblems(), catalogueIds(), coverageProblems() (+16 more)

### Community 31 - "Q: Which SaveManager reference validation quarantines a fixture-owned item inventory key, and what is the smallest canonical fix?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which SaveManager reference validation quarantines a fixture-owned item inventory key, and what is the smallest canonical fix?, Source Nodes

### Community 32 - "zone1.ts"
Cohesion: 0.11
Nodes (30): acceptedCards(), generatedRoomIds(), zone1Cards(), zone1Cards(), zone1Generation(), CONTENT_SOURCES, RETIRED_STUB_PATH, SRC_SOURCES (+22 more)

### Community 33 - "Documentation style guide"
Cohesion: 0.11
Nodes (18): Audience and writing style, Choose where a doc lives, COVERAGE.md is split-governed, Decisions, Documentation style guide, Don't duplicate the code, Formatting, Keep changes proportional (+10 more)

### Community 34 - "commandResolution.ts"
Cohesion: 0.14
Nodes (27): actorAndRemainder(), answerCommand(), bareAnswerCommand(), conversationCommand(), DIRECTION_BY_TOKEN, directionCommand(), exactOptionAnswerCommand(), fallbackPair() (+19 more)

### Community 35 - "parser.ts"
Cohesion: 0.04
Nodes (67): CommandHandler, ParsedCommand, CommandSpec, CommandTableModule, DirectionSpec, hasCommandToken(), loadCommandTable(), CHEST_ID (+59 more)

### Community 36 - "LoadResult"
Cohesion: 0.10
Nodes (9): QuarantineDto, LoadFailureReason, LoadResult, SaveDto, MESSAGES, RecordingGame, RecordingGameOptions, BootSetupOptions (+1 more)

### Community 37 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, content:generate, content:scaffold, content:validate, dev, format, format:check (+9 more)

### Community 38 - "Game.ts"
Cohesion: 0.08
Nodes (27): 8. Fixed contracts content must use, 3. Execution, 4. Failure consequences, 5. Content, Hazards, 3. Completion detection, ComposedReaction, ComposedReactionDependencies (+19 more)

### Community 39 - "Onboarding.test.ts"
Cohesion: 0.06
Nodes (41): makeEnvelope(), SAVE_KEY, absentElement(), allText(), Bootstrap, BootstrapDependencies, descendants(), documentState (+33 more)

### Community 40 - "ConversationFlow.ts"
Cohesion: 0.20
Nodes (23): activeNode(), announceHandover(), applyAll(), applyTopicEffects(), conversationTransfer(), createNpcTopicResolver(), endConversation(), expireNode() (+15 more)

### Community 41 - "opencode.json"
Cohesion: 0.12
Nodes (16): command, type, default_agent, experimental, subagent_depth, command, type, mcp (+8 more)

### Community 42 - "Q: After the SaveManager fix, does a save written with the practice block placed in the fixture cabinet reload with Continue enabled, and is the invalid-json quarantine path still intact?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: After the SaveManager fix, does a save written with the practice block placed in the fixture cabinet reload with Continue enabled, and is the invalid-json quarantine path still intact?, Source Nodes

### Community 43 - "generate.ts"
Cohesion: 0.08
Nodes (31): 1. Purpose, 3. Scaffolds, 4. Validation, 6. Ownership, 7. Coverage-graph extraction, Content toolchain, CONTENT_ROOT, COVERAGE_PATH (+23 more)

### Community 44 - "content/schema.ts"
Cohesion: 0.16
Nodes (23): ParseResult, asArray(), asRecord(), AUTHORING_KEYS, blockedTextFinding(), blockedTextFindings(), cardShape, COLLECTION_KEYS (+15 more)

### Community 45 - "npcState"
Cohesion: 0.20
Nodes (19): createFromDto(), stateToDto(), CountingRandom, npcDto(), npcGameDependencies(), npcState(), submitNpc(), loadGame() (+11 more)

### Community 46 - "Quiz combat"
Cohesion: 0.50
Nodes (4): 1. Scope, 4. Commands and events, 5. Hints, Quiz combat

### Community 47 - "2. Functional defects"
Cohesion: 0.10
Nodes (20): 10. Placeholder objective and controls copy is shown to the player, 11. SHOW silently hands over a carried item, 12. Hints are graded correctly but too generic to resolve the stalled step, 13. Quiz teaches a command form the game rejects, 1. Expected ward path — claim-by-claim outcome, 1. Internal flag token shown at the teaching-port gates, 2. Functional defects, 2. `talk to <npc>` rejected although the command list advertises `talk-to` (+12 more)

### Community 48 - "wardW7Fixes.ts"
Cohesion: 0.06
Nodes (46): createRuleEngine(), START, startEvents(), Condition, keywordTopic(), stateSnapshot(), W7_AI_ALIAS, W7_AI_ID (+38 more)

### Community 49 - "StorageAdapter"
Cohesion: 0.08
Nodes (35): 2. Boot, title screen and session start, 4.1 Meta actions, 4. Game façade and meta actions, 10. Out of scope, 1. Scope and goals, 2. Design principles, 3. Layers and dependency direction, 4. Source layout (+27 more)

### Community 50 - "ward-round3-fixes.spec.ts"
Cohesion: 0.20
Nodes (16): answerCorrectly(), authoredPassMessage(), AuthoredQuestion, authoredQuestion(), authoredQuiz(), correctIndex(), currentQuestion(), liveState() (+8 more)

### Community 51 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint@^10.15.0, playwright@1.65.1, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, typescript-7@npm:typescript@^7.0.2, vite@^8.3.8, vitest@^5.1.1 (+5 more)

### Community 52 - "vitest"
Cohesion: 0.09
Nodes (27): ACTOR_ALIAS, askRing, byeCommand, ConditionEvaluatorCondition, DEFAULT_REPLY, DialogueSystemContract, DialogueSystemFactory, ENTER_NODE_TOPIC_ID (+19 more)

### Community 53 - "ScoreTracker"
Cohesion: 0.14
Nodes (17): 8. Behavioural signatures, 6.3 Room entry, score and spec-topic mapping, Core, 2. Authoring format, 3. Condition, 7. Restore-time derivation, AreaProgress, Exit (+9 more)

### Community 54 - "TopicSelection.ts"
Cohesion: 0.35
Nodes (11): chooseCandidate(), exactDeclaredTopic(), hasKeyword(), hasObjectMatch(), hasResolvedMatch(), isAskTellMatch(), isCommandCompatible(), isGiveShowMatch() (+3 more)

### Community 55 - "deploy.yml"
Cohesion: 0.07
Nodes (31): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+23 more)

### Community 56 - "Parser.ts"
Cohesion: 0.12
Nodes (20): aliasSuffix(), COMMAND_TABLE, CommandSpec, detailSuffix(), DIRECTIONS, DirectionSpec, helpText(), DIRECTION_NAMES (+12 more)

### Community 57 - "W7 round-4 re-test — Assistance Ward (2026-11-27)"
Cohesion: 0.14
Nodes (13): 1. Expected path claims — checked against play, 2. Status of the original thirteen findings, 3. Status of the five round-2 findings A–E, 4. Round-3 findings and round-4 closure claims, 5. Findings from this round, 6. Difficulty and fairness record, Additional observation (not a blocker), Content finding 1. The placed block stays “on top” in the room prose and cannot be found again (+5 more)

### Community 58 - "engine-issue-13-inventory.test.ts"
Cohesion: 0.36
Nodes (8): getCommandHandler, CARTRIDGE, contextFor(), handlerFor(), inventoryReply(), LAMP, messagesOf(), stateSnapshot()

### Community 59 - "EffectApplier.ts"
Cohesion: 0.06
Nodes (45): 2. Model, 5. Quiz attempts, areaPairForRoom(), areaPairForTopic(), ensureProgressRow(), maxScoreOf(), MutableAreaProgress, applyBookkeepingEffect() (+37 more)

### Community 60 - "Favicon.test.ts"
Cohesion: 0.24
Nodes (5): attributes(), FAVICON_PATH, iconLinks(), INDEX_PATH, linkElements()

### Community 61 - "Game"
Cohesion: 0.07
Nodes (21): 6.2 One command turn, 6.4 Save, load, download and import, 6.5 Losing a life and winning, 6. Key flows, 10. API contracts, 11. Flow, 12. Invariants the implementation must keep, 13. Out of scope (+13 more)

### Community 62 - "engine-issue-11.spec.ts"
Cohesion: 0.21
Nodes (7): areaHeaders(), authoredArea(), expectCurrentCard(), headerFor(), panelLines(), PROGRESS, TOTAL_SCORE

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

### Community 140 - "Q: Where is P-TAKE-01 takeHandler and what governs portable items?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Where is P-TAKE-01 takeHandler and what governs portable items?

### Community 141 - "Q: Find a document heading node named Room entry text"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Find a document heading node named Room entry text

### Community 143 - "Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?, Source Nodes

### Community 147 - "W7 non-quiz runtime handoff"
Cohesion: 0.14
Nodes (13): progress(), Constraints and pitfalls, Critical rebase requirement, Definition of done, Final red contracts already in main, Graph trace from the handoff round, Integration workspace, Interrupted agents (+5 more)

### Community 148 - "Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?, Source Nodes

### Community 149 - "W7 re-test — Assistance Ward, round 2 (2026-11-27)"
Cohesion: 0.13
Nodes (14): 1. Expected path claims — checked against play, 2. Status of the thirteen earlier findings, 3. Findings from this round, 4. Difficulty and fairness record, A. Room and item prose does not follow the completed state, B (minor). Wrong-order unlock invites carrying a bolted-down fixture, C. The approved dial block text describes five empty sockets after four are filled, Content-quality findings (route to `content-editor`) (+6 more)

### Community 150 - "Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?, Source Nodes

### Community 151 - "Q: W7F-01..14: which canonical owners implement parser aliases, unlock splitting, gate denial, blockedText shape/adapt, quiz idempotence, transfer announcement, title copy and room hint targets?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: W7F-01..14: which canonical owners implement parser aliases, unlock splitting, gate denial, blockedText shape/adapt, quiz idempotence, transfer announcement, title copy and room hint targets?, Source Nodes

### Community 152 - "NpcTypes.test.ts"
Cohesion: 0.16
Nodes (7): 4.3 NPC card, ResolvedTopic, ResponseStrategy, ACTOR_ID, TopicResolverContract, ConversationParameters, ResolveParameters

### Community 153 - "Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?, Source Nodes

### Community 154 - "Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?, Source Nodes

### Community 155 - "Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?, Source Nodes

### Community 157 - "TopicSelection.test.ts"
Cohesion: 0.21
Nodes (16): actorState(), always, defaultTopic(), NEVER_FLAG, node(), npcBundle(), npcContext(), aiBundle() (+8 more)

### Community 158 - "ContentBundle.ts"
Cohesion: 0.07
Nodes (46): 1. Purpose and authority, 3.1 Catalogue shape, 7. Core contracts, 1. Scope, 1. Purpose, 3.2 Entity and system state, AreaDefinition, ExitDefinition (+38 more)

### Community 160 - "Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?, Source Nodes

### Community 161 - "npc-topic-resolution.test.ts"
Cohesion: 0.15
Nodes (9): DEFAULT_TOPIC_ID, ITEM_ID, READY, spokenTexts(), topic(), whySpecialTopic(), decoy(), HandoffCase (+1 more)

### Community 162 - "HintSystem.ts"
Cohesion: 0.34
Nodes (12): applyLevel(), applyMessage(), autoCandidates(), automaticHints(), explicitHint(), nextLevel(), resolveContext(), sequenceForPuzzle() (+4 more)

### Community 163 - "package.json"
Cohesion: 0.17
Nodes (11): description, markdownlint-cli2@^0.24.2, @types/node@^26.6.10, yaml@^2.9.1, name, private, type, version (+3 more)

### Community 164 - "playwright"
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

### Community 218 - "W7 round-3 re-test — Assistance Ward (2026-11-27)"
Cohesion: 0.17
Nodes (11): 1. Expected path claims — ward beats A–C2.12, 3. Closure of the thirteen earlier findings, 4. Closure of the five round-2 findings A–E, 5. Findings from this round, 6. Difficulty and fairness record, Content-quality finding 1. Demonstration prose keeps the practice block on top after it is put away, Context only, out of scope, Functional defect 1. The taught “exact option text” quiz answer form does not work (+3 more)

### Community 219 - "Q: graphify section '6.1' — which document owns the event to view mapping?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: graphify section '6.1' — which document owns the event to view mapping?

### Community 220 - "eslint.config.js"
Cohesion: 0.18
Nodes (10): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, globals@^17.14.0, typescript-eslint@^8.74.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn (+2 more)

### Community 223 - "Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?, Source Nodes

### Community 224 - "Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?, Source Nodes

### Community 225 - "Q: Does any second node implement a conditional use effect or authored useText mapping outside the canonical producer?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does any second node implement a conditional use effect or authored useText mapping outside the canonical producer?, Source Nodes

### Community 226 - "Q: Where is the conditional use producer, authored useText mapping and condition gate owned for W6S-01..04?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the conditional use producer, authored useText mapping and condition gate owned for W6S-01..04?, Source Nodes

### Community 227 - "Q: ward-w7-fixes: canonical owners for parser aliases, unlock denial, quiz starts, hint targets"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ward-w7-fixes: canonical owners for parser aliases, unlock denial, quiz starts, hint targets, Source Nodes

### Community 228 - "Q: Which canonical nodes supply the approved title copy, help aliases and gate fallback that the four stale e2e assertions must re-anchor?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes supply the approved title copy, help aliases and gate fallback that the four stale e2e assertions must re-anchor?, Source Nodes

### Community 229 - "Q: Why do four W7 browser tests still fail after the string re-anchor, and is it caused by this slice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why do four W7 browser tests still fail after the string re-anchor, and is it caused by this slice?, Source Nodes

### Community 230 - "Q: Which canonical nodes own browser save seeding and continuation for gated later-area e2e traces?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own browser save seeding and continuation for gated later-area e2e traces?, Source Nodes

### Community 231 - "Q: Which accepted sources own the hub escape reply and interface room prose re-anchored in W7 Beat C, and the 23-room bundle count?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which accepted sources own the hub escape reply and interface room prose re-anchored in W7 Beat C, and the 23-room bundle count?, Source Nodes

### Community 232 - "Q: Which coverage-graph nodes document the tutorial-complete gate for hub east/north?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: Which coverage-graph nodes document the tutorial-complete gate for hub east/north?

### Community 233 - "HintSequence"
Cohesion: 0.17
Nodes (14): 3. Rule catalogue, C — Conversation and NPCs, D — Data and cards, H — Hazards and hints, N — Narrative, P — Pedagogy and course mapping, V — Validation, 1. Scope (+6 more)

### Community 234 - "submit"
Cohesion: 0.07
Nodes (49): command(), DEBUG_FRAGMENTS, continueFrom(), liveSave(), command(), IMPLEMENTATION_PATTERNS, command(), continueFromCraftedSave() (+41 more)

### Community 236 - "ScoreTracker"
Cohesion: 0.10
Nodes (23): 10. Scoring with many puzzles per topic, 11. Win check owner, 12. Behavioural guarantees, 3.2 World, area, room and item definitions, 3.3 Loading and validation, 3. Content bundle and registration, 6.1 Event to view mapping, 6. Canonical event union and rendering (+15 more)

### Community 238 - "Q: Where is the approved dial blocked string pinned in tests, and which authority superseded it in round 2?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where is the approved dial blocked string pinned in tests, and which authority superseded it in round 2?, Source Nodes

### Community 240 - "Q: Do the record and mark aliases in the room-arrival SCENERY entry make resolveScenery ambiguous?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Do the record and mark aliases in the room-arrival SCENERY entry make resolveScenery ambiguous?, Source Nodes

### Community 241 - "makeBundle"
Cohesion: 0.16
Nodes (19): createScoreTracker(), totalOf(), runtimeBundle(), areaOf(), gatedBundle(), roomOf(), catalogueOf(), makeBundle() (+11 more)

### Community 242 - "Q: Why did eleven e2e tests fail after the round-2 ward card regeneration, and how were stale expectations re-anchored?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did eleven e2e tests fail after the round-2 ward card regeneration, and how were stale expectations re-anchored?, Source Nodes

### Community 243 - "Q: Why does a crafted v1 save with empty room inventories make 'unlock practice cabinet with practice key' return 'I don't understand that.'?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does a crafted v1 save with empty room inventories make 'unlock practice cabinet with practice key' return 'I don't understand that.'?, Source Nodes

### Community 244 - "Q: After the W6 handoff regeneration, which accepted sources own the revised hub and interface room prose asserted by W7 Beat C?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: After the W6 handoff regeneration, which accepted sources own the revised hub and interface room prose asserted by W7 Beat C?, Source Nodes

### Community 245 - "Q: Which code paths own wrong-order unlock refusal and arrival scenery examine"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which code paths own wrong-order unlock refusal and arrival scenery examine, Source Nodes

### Community 246 - "Q: Which canonical nodes own the WR2-B1 wrong-order unlock refusal, WR2-B2 item-first unlock preservation and WR2-E1 arrival scenery examine contracts?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical nodes own the WR2-B1 wrong-order unlock refusal, WR2-B2 item-first unlock preservation and WR2-E1 arrival scenery examine contracts?, Source Nodes

### Community 247 - "Q: Who owns arrival register/record/mark scenery prose for WR2-E1?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns arrival register/record/mark scenery prose for WR2-E1?, Source Nodes

### Community 248 - "Q: Can the coverage graph supply the round-2 dial blocked string, the saving keyword and the state-true hub/Interface prose?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can the coverage graph supply the round-2 dial blocked string, the saving keyword and the state-true hub/Interface prose?, Source Nodes

### Community 249 - "Q: Who owns wrong-order unlock refusal for a non-portable item offered as the key-like item (WR2-B1)?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns wrong-order unlock refusal for a non-portable item offered as the key-like item (WR2-B1)?, Source Nodes

### Community 250 - "Q: Bypass check on WR2-B1 refusal literal and WR2-E1 arrival scenery prose: any reimplementation outside the canonical hub?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bypass check on WR2-B1 refusal literal and WR2-E1 arrival scenery prose: any reimplementation outside the canonical hub?, Source Nodes

### Community 251 - "Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, the existing answer paths and the outside-quiz unknown path?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, the existing answer paths and the outside-quiz unknown path?, Source Nodes

### Community 252 - "Q: Which canonical node owns exact displayed quiz option text as an answer, and where should the WR3-A1 fix and shared option-text normalisation live?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Which canonical node owns exact displayed quiz option text as an answer, and where should the WR3-A1 fix and shared option-text normalisation live?, Source Nodes

### Community 253 - "Q: Can a Playwright e2e test retry quiz starts until a target option is not the final question?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can a Playwright e2e test retry quiz starts until a target option is not the final question?, Source Nodes

### Community 254 - "Q: Does a wrong free-text quiz answer receive the quiz's out-of-range string?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does a wrong free-text quiz answer receive the quiz's out-of-range string?, Source Nodes

### Community 255 - "Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, answer N/bare N and the outside-quiz unknown path?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, answer N/bare N and the outside-quiz unknown path?, Source Nodes

### Community 256 - "Q: WR4-B1/B2/C1: which canonical nodes own put/take placement feedback, transfer-item ownership and out-of-room give feedback?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: WR4-B1/B2/C1: which canonical nodes own put/take placement feedback, transfer-item ownership and out-of-room give feedback?, Source Nodes

### Community 257 - "Q: Where are item ownership and current-room visibility owned, and can a block placed in a visible fixture stay nameable?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are item ownership and current-room visibility owned, and can a block placed in a visible fixture stay nameable?, Source Nodes

### Community 258 - "Q: Can out-of-room give/show with an unresolvable item emit the canonical absence line without a new Command variant or content card?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can out-of-room give/show with an unresolvable item emit the canonical absence line without a new Command variant or content card?, Source Nodes

### Community 259 - "Q: Who owns the fallback source owner for a take when no visible open container branch applies (WR4-B1 closed-cabinet retrieval)?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Who owns the fallback source owner for a take when no visible open container branch applies (WR4-B1 closed-cabinet retrieval)?, Source Nodes

### Community 261 - "GameEvent"
Cohesion: 0.23
Nodes (4): GameEvent, SchedulerContract, RecordingBus, MemoryBus

### Community 262 - "isActive"
Cohesion: 0.23
Nodes (12): 1. Scope, 2. Model, 3. Commands and topic resolution, 4. Conversation flow, 5. Conversation nodes, 6. Link to quiz combat, NPCs and conversation, TopicResolver (+4 more)

### Community 264 - "engine-issue-15-life-gate.spec.ts"
Cohesion: 0.19
Nodes (10): command(), firstId(), GATE_IDS, gateIds(), GateOverrides, savedState(), SaveState, secondId() (+2 more)

### Community 269 - "TopicPhrase.ts"
Cohesion: 0.33
Nodes (9): createTopicResolver(), AskTellMatch, collectMatches(), DeclaredObjectPhrase, findDeclaredObjectPhrase(), isAskTellMatch(), isBoundToActor(), isObjectName() (+1 more)

### Community 270 - "Content authoring rules"
Cohesion: 0.12
Nodes (17): 1. Purpose and authority, 2. Workflow gates, 4.1 Common conventions, 4.2 Area and rooms card, 4.4 Quiz card, 4.5 Puzzle card, 4.6 Hazard card, 4.7 Hint card (+9 more)

### Community 271 - "PuzzleGraph.ts"
Cohesion: 0.23
Nodes (11): 1. Scope, 4. Puzzle Dependency Graph, 5. Hints, 6. Integration points, Puzzles, cycleIds(), firstReady(), puzzleGraphFindings() (+3 more)

### Community 273 - "Q: Where do putHandler(), takeHandler(), describeTarget(), ItemVisibility, formatEvent(), GameEvent, TitleScreen, SaveControls and GameViewData live, and what real event names and view fields should browser assertions use?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where do putHandler(), takeHandler(), describeTarget(), ItemVisibility, formatEvent(), GameEvent, TitleScreen, SaveControls and GameViewData live, and what real event names and view fields should browser assertions use?, Source Nodes

### Community 274 - "Q: Does the assistance orientation quiz always present questions in the authored questionIds order?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Does the assistance orientation quiz always present questions in the authored questionIds order?, Source Nodes

### Community 275 - "Q: Why does a save written immediately after 'place practice block in practice cabinet' get quarantined as invalid-content on reload?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does a save written immediately after 'place practice block in practice cabinet' get quarantined as invalid-content on reload?, Source Nodes

### Community 276 - "Q: WR4 persistence blocker: which canonical SaveManager nodes reject a state.rooms key that is a fixture item ID holding a placed item?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: WR4 persistence blocker: which canonical SaveManager nodes reject a state.rooms key that is a fixture item ID holding a placed item?, Source Nodes

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `OutputLog` (12× useful, score=11.696791258)
- `EffectApplier` (9× useful, score=8.716045926)
- `ContentBundle` (8× useful, score=7.6778165)
- `putHandler()` (7× useful, score=6.849920671) _(code changed — re-verify)_
- `resolveGameCommand()` (7× useful, score=6.834232628) _(code changed — re-verify)_
- `transferItem()` (6× useful, score=5.946892008)
- `TopicResolver` (6× useful, score=5.833193291)
- `takeHandler()` (5× useful, score=4.92872955) _(code changed — re-verify)_
- `renderArea()` (5× useful, score=4.891504089)
- `NameResolver` (5× useful, score=4.874447537)

**Known dead ends** — questions that led nowhere; don't re-derive.
- "Find a document heading node named Room entry text"
- "How to override the Playwright baseURL in a scratchpad config?" -> `playwright.config.ts`, `baseURL`
- "graphify section '6.1' — which document owns the event to view mapping?"
- "Can the Playwright MCP browser drive the app in this session?" -> `playwright.config.ts`, `helpers.ts`
- "Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?" -> `playwright.config.ts`, `helpers.ts`
- "Can the Playwright MCP browser tools drive the app in this browser-tester session?" -> `playwright.config.ts,helpers.ts`
- "Which coverage-graph nodes document the tutorial-complete gate for hub east/north?"
- "Can the coverage graph supply the round-2 dial blocked string, the saving keyword and the state-true hub/Interface prose?" -> `Room: The Interface (room_entry_interface)`, `GameStateDto`

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `content.ts` to `NpcGates.test.ts`, `GameState.ts`, `GameEvent`, `persistence.ts`, `wardKeywordActivity.ts`, `wardTopicLocality.ts`, `hint.ts`, `npcTopicOverlap.ts`, `ContentBundle`, `mechanics.ts`, `GameViewData`, `engine-issue-28-activation.test.ts`, `NpcTypes.test.ts`, `contentToolchain.ts`, `TopicSelection.test.ts`, `ContentBundle.ts`, `zone1.ts`, `npc-topic-resolution.test.ts`, `package.json`, `parser.ts`, `LoadResult`, `Onboarding.test.ts`, `npcState`, `wardW7Fixes.ts`, `devDependencies`, `vitest`, `engine-issue-13-inventory.test.ts`, `EffectApplier.ts`, `Favicon.test.ts`, `ToolchainEsmImport.test.ts`, `makeBundle`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `ContentBundle` (e.g. with `11. Win check owner` and `2. Boot, title screen and session start`) actually correct?**
  _`ContentBundle` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Should `NpcGates.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1028225806451613 - nodes in this community are weakly interconnected._
- **Why does `ContentBundle` connect `ContentBundle` to `GameState.ts`, `content/index.ts`, `GameEvent`, `persistence.ts`, `wardKeywordActivity.ts`, `SaveManager.ts`, `verbs/index.ts`, `wardTopicLocality.ts`, `content.ts`, `TopicPhrase.ts`, `PuzzleGraph.ts`, `mechanics.ts`, `GameViewData`, `common.ts`, `ContentBundle.ts`, `validateContent.ts`, `zone1.ts`, `npc-topic-resolution.test.ts`, `commandResolution.ts`, `HintSystem.ts`, `parser.ts`, `LoadResult`, `Game.ts`, `Onboarding.test.ts`, `generate.ts`, `npcState`, `wardW7Fixes.ts`, `StorageAdapter`, `vitest`, `ScoreTracker`, `engine-issue-13-inventory.test.ts`, `EffectApplier.ts`, `ScoreTracker`, `makeBundle`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GameEvent` (e.g. with `1. Purpose and authority` and `6. Canonical event union and rendering`) actually correct?**
  _`GameEvent` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `GameState.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.045372645372645376 - nodes in this community are weakly interconnected._
- **Why does `GameEvent` connect `GameEvent` to `GameState.ts`, `isActive`, `persistence.ts`, `wardKeywordActivity.ts`, `wardTopicLocality.ts`, `ContentBundle`, `mechanics.ts`, `GameViewData`, `engine-issue-28-activation.test.ts`, `NpcTypes.test.ts`, `ContentBundle.ts`, `npc-topic-resolution.test.ts`, `HintSystem.ts`, `parser.ts`, `LoadResult`, `Game.ts`, `Onboarding.test.ts`, `ConversationFlow.ts`, `npcState`, `wardW7Fixes.ts`, `StorageAdapter`, `vitest`, `ScoreTracker`, `engine-issue-13-inventory.test.ts`, `EffectApplier.ts`, `Game`, `HintSequence`, `ScoreTracker`, `makeBundle`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._