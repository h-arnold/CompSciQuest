# Onboarding area: The Assistance Ward

**Status: Gate 0 curated set approved by the user on 2026-11-26. All six ward
cards and five existing-card amendments returned and passed `content:validate`
after W4 revision round 1. Both independent reviewers returned FAIL on
2026-11-26; their content findings are revised and CC-01 closed in code on
2026-11-27. PCK re-review returned PASS and content-critic returned PASS WITH
MINORS on the batch. Focused CC-04 PCK re-review returned PASS with no findings;
focused content-critic re-review returned FAIL because the runtime then
classified the empty-object `tell` reason producer as a default. `code-lead`
closed that blocker with independent PASS; the default-prompt revision also
validates. Final content-critic and focused PCK re-reviews are PASS with no findings.
All six ward cards now carry `status: approved` and the full set revalidates. The final whole-set V4 review returned PASS WITH MINORS with no blocker or major; focused minor closure is complete at W5 (content-critic PASS WITH MINORS, PCK PASS, no blocker or major) and the conditional dial producer remains an accepted deferral.**

This file holds the Assistance Ward's approved direction and ratified Gate 1
contracts. The root bible remains the authority for game-wide rules and cast
indexes; IDs and aliases are fixed in the approved briefs and cards (D2). Course facts come from
`docs/exam-specs/wjec-unit1.md`; this area makes no assessed course claim.
`docs/content/narrative-principles.md` governs voice and the harm floor, and
`docs/content/difficulty-and-fairness.md` governs safe sequencing, clue access and
retry friction.

## 1. Scope and area

- **Area:** `area-assistance-ward` — **The Assistance Ward**.
- **World:** `world-wjec-gcse-computer-science-2025-spec`; no second `worlds`
  declaration.
- **Level start:** `room-assistance-intake`. Lives: 3. The ward contains no
  hazard and costs no life.
- **Role:** a mandatory first lesson before the teaching-zone ports open. The
  player may leave and re-enter, but `tutorial-complete` is required to enter
  The Switchyard or The Pattern Mill.
- **Hub connection:** `room-network-hub` gains an ungated **south** exit to the
  Intake Bay. South keeps the route on the same two-dimensional plane as the hub
  for any future map feature.
- **Teaching-zone gates:** the hub's east exit to `room-switch-floor`, the hub's
  north exit to `room-1-4-concourse`, and `room-entry-interface`'s east exit to
  `room-switch-floor` require `tutorial-complete` (N6). Returns to the hub and the
  optional older-interface detour remain ungated.
- **Ownership correction:** `room-entry-interface` is declared in
  `docs/content/1-2-1-data-representation/rooms.yaml`. Its gate, clue prose and
  plaque therefore belong to the Switchyard rooms writer. The arrival rooms card
  receives only the world `areaIds` addition.

### 1.1 Room cluster and two-dimensional loop

1. **`room-assistance-intake` — Intake Bay.** North returns to the hub; east
   leads to the Demonstration Ward.
2. **`room-assistance-demonstration` — Demonstration Ward.** West returns to
   Intake; north leads to the Records Office.
3. **`room-assistance-records` — Records Office.** South returns to the
   Demonstration Ward; west returns to the hub.

The forward route is hub → south → Intake → east → Demonstration → north →
Records → west → hub. Every room has a direct back-exit, so a failed practice
action never creates a long retry walk (N2; difficulty-and-fairness §2.5).

## 2. Theme, tone and specification boundary

The AI's excessive help has produced four cartoon "assistance-dependent" former
pupils. It resents demonstrating independence while its own methods are the
evidence against it. The ward is a deadpan machine clinic, not a horror area.

- **Satire only.** "Cognitive fog", "assistance dependency" and "trivial before
  2023" are the AI's absurd in-world claims. They are not medical findings,
  historical facts, quiz keys or coverage evidence.
- **No invented search command.** The game has no `search` verb. Searching online
  may appear only as dialogue satire; the playable inspection lesson uses `look`
  and `examine`.
- **Spec boundary.** WJEC 1.2.3 covers ethical, social and legal implications of
  automated systems, including effects on human interaction
  (`wjec-unit1.md` L760–816), and suggests discussing AI impacts (L2052–2059).
  It does not state that AI hand-holding causes cognitive decline. This area
  therefore does not teach, retrieve or complete `ai-ethics-and-implications`.
- **AI voice in this area only.** The AI becomes weary and passive-aggressive:
  clipped administrative complaint, elaborate reluctance and third-person
  references to "the pupil". It never sneers at the player's intelligence or
  treats a struggling learner as a monster (N4, A1; narrative-principles §§7–8).
- **Cultures appear only through the pupils' names.** No accents, stereotypes or
  cultural joke traits are authored.

## 3. Non-assessed onboarding topic

`tutorial-mechanics` is a deliberately non-assessed orientation topic:

- status `in progress`;
- `maxScore: 0`;
- excluded from the `game-won` set because it is not `covered` with evidence;
- labelled "game orientation — no WJEC assessment claim";
- used to give the practice quiz, puzzle and hint ladder a valid topic
  reference (P1, H2; content-toolchain §2); its three approved room IDs also let
  runtime hint context resolve in every ward room.

It must never be used as evidence for AI ethics or any other WJEC topic. The
existing `ai-ethics-and-implications` topic remains framing only and outside this
area's contribution. The heading and `SpecTopic` entry may exist while the topic
is `in progress`; that registration is not a coverage claim (V3).

## 4. Cast and states

All four pupils are recoverable former pupils, not generic zombies.

| Actor        | Approved role                                                                | Voice direction                                                                                          | Motivation and relationship                                                                                  |
| ------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npc-the-ai` | Reluctant mechanics guide; actor declared in `entry-interface/npcs.yaml`     | Weary, passive-aggressive, clipped and bureaucratic; third-person "the pupil"; one recurring tic at most | Wants the lesson over with; resents that its own help created the ward; maintains its mark-keeping authority |
| `npc-nia`    | Former pupil who cannot examine or identify what to look at                  | Hesitant and over-literal; asks for a label before checking the thing itself                             | Wants to complete one independent observation; treats the AI's prompts as orders                             |
| `npc-mateo`  | Former pupil who cannot read a short instruction without the AI supplying it | Careful with speech, defeated by print; reads aloud only when ready                                      | Wants to read one instruction himself; resents the AI's habit of finishing sentences                         |
| `npc-priya`  | Former pupil who cannot reason out a simple choice                           | Fast guesses followed by doubt; cheerful when a reason finally holds                                     | Wants to justify one choice; competes with the AI's instant answers                                          |
| `npc-kofi`   | Former pupil who cannot operate a simple mechanism                           | Practical and optimistic; hands hover until the sequence is clear                                        | Wants to complete one mechanism cycle; trusts visible steps more than verbal reassurance                     |

All four pupils start in the existing generic `actorstate-ready`. This avoids a
visible return to a dependent pose after `bye`; recovery remains canonical in the
flags and conversation topics. Each pupil has one recovered state:

- `actorstate-nia-observant`;
- `actorstate-mateo-reading`;
- `actorstate-priya-reasoning`;
- `actorstate-kofi-cycling`.

The approved AI state is `actorstate-ai-reluctant-guide`. Ward AI topics and quiz
pass/fail effects reapply it. No state has an `onEnter` greeting (T4).

## 5. Items and aliases

All IDs and aliases below are ratified in the approved cards (D2).

| ID                                 | Aliases                                | Room                   | Portable | Purpose                                                                          |
| ---------------------------------- | -------------------------------------- | ---------------------- | -------- | -------------------------------------------------------------------------------- |
| `item-assistance-tally-token`      | tally token, intake token              | Intake                 | yes      | `take`, `drop`, `inventory` practice; three scratches and a peeled-label shadow. |
| `item-assistance-observation-card` | observation card, observation slip     | Intake                 | no       | Fixed evidence for Nia's independent observation.                                |
| `item-assistance-instruction-card` | instruction card, practice instruction | Demonstration          | no       | Fixed short instruction: UNLOCK, OPEN, PLACE, CLOSE; Mateo reads it.             |
| `item-assistance-practice-key`     | practice key, demo key                 | Demonstration          | yes      | Item-first cabinet unlock; intended hand-over prop only after the unlock.        |
| `item-assistance-practice-cabinet` | practice cabinet, demo cabinet         | Demonstration          | no       | Reversible `unlock`, `open`, `put`, `close` practice.                            |
| `item-assistance-practice-block`   | practice block, demo block             | Demonstration          | yes      | Non-essential `put` practice; losing it cannot strand the ward.                  |
| `item-assistance-practice-bell`    | practice bell, demo bell               | Demonstration          | no       | Harmless positive `use` practice; content-declared action seam deferred.         |
| `item-assistance-practice-crank`   | practice crank, demo crank             | Demonstration          | no       | Fixed mechanism Kofi cycles after examining it.                                  |
| `item-assistance-audit-card`       | audit card, choice card                | Records                | no       | Priya's CHECKED/ASSUMED choice and its printed evidence.                         |
| `item-assistance-recovery-board`   | recovery board, pupil record board     | Records                | no       | Essential clue: four pupil records plus ORIENTATION PASS.                        |
| `item-assistance-calibration-dial` | calibration dial, assistance dial      | Records                | no       | Final `use` target and second essential puzzle clue.                             |
| `item-assistance-interface-plaque` | ward port plaque, teaching-port plaque | `room-entry-interface` | no       | Second clue for the older interface's gated east exit.                           |

Every fixed item receives in-world take-refusal text or the approved fallback
(N5, D3). Room descriptions name resident actors and intended nouns physically
and stay at most two paragraphs, usually 200–300 words unless extra detail is
warranted (N6, N8; narrative-principles §2).

## 6. Three-room teaching spine

Teach one mechanic at a time, give safe practice, then combine familiar actions.
Every intended noun appears physically in room prose or item text; no essential
action depends on an exact phrase or hidden parser convention (N5, N6;
difficulty-and-fairness §§2.1–2.3).

1. **Intake Bay — perception and carrying.** `look`, `examine`, `take`, `drop`,
   `inventory`, movement, `score` and `help`. Use the tally token for carrying
   practice. The player examines the fixed observation card; Nia notices its
   chipped corner and records that detail herself.
2. **Demonstration Ward — objects and doors.** `use`, `put`, `open`, `close`,
   `unlock`, `give` and `show`, using harmless practice fixtures. Mateo reads the
   fixed instruction card. Kofi completes one cycle on the fixed practice crank.
   In the landed conversation runtime both `show` and `give` transfer the carried
   item when a topic is selected; there is no non-transferring-show field. Teach
   the safe order explicitly: unlock the cabinet with `unlock practice key with
practice cabinet` before any key hand-over, use the key for `show`/`give`
   practice, and reserve the block for `put`. Any carried item, including the tally
   token, transfers if handed over, so teaching text must not claim an exclusive
   safe-prop list.
3. **Records Office — conversation, assessment and records.** `talk-to`, `ask`,
   `tell`, `bye`, quiz answer forms, hint behaviour, lives and failure. Priya
   completes the two-turn practice audit. The AI introduces the real manual
   `save`, `load`, `download`, `import` and `restart` controls; no ward progress
   depends on invoking a destructive or file-picker action.

The full tour covers every canonical command family without adding verbs. Quiz
answers use `answer N`, a bare `N`, or exact option text. Save controls remain
manual; there is no undo, autosave or save slot (storage-schema.md §§2, 11;
application-and-ui.md §5).

## 7. Conversation architecture

All topic and node IDs below are ratified in the approved cards. Every topic and node
carries `actorId`; locality is expressed through `in-room`/`in-area` in
`isActive` (T2).

### 7.1 AI topics in `assistance-ward/npcs.yaml`

| Topic                         | Match and scope                                                                                                                           | Role                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `topic-ai-ward-default`       | `askTell`, empty objects; `in-area` ward                                                                                                  | Ward greeting and catch-all in the weary guide voice.                                           |
| `topic-ai-ward-intake`        | `special`; Intake                                                                                                                         | `look`, `examine`, carrying, movement, `score`, `help`.                                         |
| `topic-ai-ward-demonstration` | `special`; Demonstration                                                                                                                  | `use`, `put`, `open`, `close`, `unlock`, `show`, `give`.                                        |
| `topic-ai-ward-records`       | `special`; Records; `records`, `record`, `paperwork`                                                                                      | Weary framing of the office, recovery board and audit card.                                     |
| `topic-ai-ward-conversation`  | `special`; Records; `talk`, `talk-to`, `ask`, `tell`, `bye`                                                                               | Conversation verbs: talk-to opens a conversation, ask/tell address a subject, bye ends it.      |
| `topic-ai-ward-answers`       | `special`; Records; `answer`, `quiz answers`, `option`                                                                                    | Answer forms only — `answer N`, bare `N`, exact option text — without starting the audit.       |
| `topic-ai-ward-hints`         | `special`; Records; `hint`, `hints`, `stuck`                                                                                              | The separate `hint` command, nudge-only behaviour, cooldown and zero score cost.                |
| `topic-ai-ward-failure`       | `special`; Records; `fail`, `lives`, `retry`                                                                                              | Zero-life failure, no movement and unlimited retries.                                           |
| `topic-ai-ward-save`          | `special`; Records; `save`, `load`, `download`, `import`, `restart`                                                                       | Manual browser storage and portable file; no undo, autosave or slots.                           |
| `topic-ai-ward-quiz`          | `special`; Records; `orientation`, `audit`, `test`, `practice test`, `start quiz`, `begin quiz`; all four recovery flags; not quiz-passed | Explains the 3-of-4, zero-life, unlimited-retry audit and starts `quiz-assistance-orientation`. |
| `topic-ai-ward-calibration`   | `special`; Records; quiz-passed; not puzzle-solved                                                                                        | Restates the dial goal, blocker and tools without supplying the final action.                   |
| `topic-ai-ward-complete`      | `special`; ward; puzzle-solved                                                                                                            | Confirms the teaching-zone ports are open.                                                      |

The existing global `topic-ai-default` must gain a negated ward `in-area`
condition in `entry-interface/npcs.yaml`. The runtime selector now chooses the
first **active** eligible default rather than gating only the first declared one;
`code-lead` slice `ward-default-selection` passed implementation, regression and
independent review on 2026-11-26. The ward NPC card and arrival-default amendment
have returned. This is an amendment plus a landed selector fix, not a duplicate
AI actor or a second global default (T1, T2, T5).

The W7 fix round replaces the single Records sequence topic with six
keyword-addressed `special` topics so the obvious question word answers its own
question. `quiz` is deliberately **not** a quiz-start keyword: answer-format
questions go to `topic-ai-ward-answers`, while `orientation`, `audit`, `test`,
`practice test`, `start quiz` and `begin quiz` start the audit. Starting a quiz
is an explicit, idempotent runtime contract so another AI question cannot
silently replace a live attempt. All six remain actor-bound and Records-scoped;
because they are `special` topics, they sit outside the T5 free-text overlap
proof.

### 7.2 Pupil topics and recovery actions

| Actor | Topics                                                                                                                                     | Recovery contract                                                                                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nia   | `topic-nia-default`, `topic-nia-recovered-default`, `topic-nia-observation`                                                                | The player examines the fixed observation card, then `ask nia about observation card`. Nia identifies its chipped corner herself; the topic sets `nia-observation-recovered` and `actorstate-nia-observant`. |
| Mateo | `topic-mateo-default`, `topic-mateo-recovered-default`, `topic-mateo-instruction`                                                          | Examine the instruction card, then `ask mateo about instruction card`. The topic sets `mateo-reading-recovered` and `actorstate-mateo-reading`.                                                              |
| Kofi  | `topic-kofi-default`, `topic-kofi-recovered-default`, `topic-kofi-practice-cycle`                                                          | Examine the practice crank, then `ask kofi about practice crank`. The topic sets `kofi-operation-recovered` and `actorstate-kofi-cycling`.                                                                   |
| Priya | `topic-priya-default`, `topic-priya-recovered-default`, `topic-priya-choice-start`, `topic-priya-choice-made`, `topic-priya-choice-reason` | `choice-start` enters `node-priya-choice`; `choice-made` sets `priya-choice-taken`; `choice-reason` sets `priya-reasoning-recovered`, applies `actorstate-priya-reasoning` and exits the node.               |

`node-priya-choice` is sticky because the recovery deliberately needs a
choose-then-justify exchange. `topic-priya-default` is its non-producing default,
available before and after `priya-choice-taken` while recovery is incomplete; it
repeats the choice prompt before the choice and asks for a reason afterwards,
without granting progress. There is no timeout. `ask priya checked` or
`ask priya assumed` selects the choice; a subsequent natural
`tell priya <what was checked and what it showed>` reaches the explicit
`topic-priya-choice-reason` producer. `talk-to priya` or a repeated retired choice
reaches the non-producing default and grants no recovery. Leaving or `bye` ends
the node safely; asking about the audit card outside it resumes the unfinished
exchange (T3, T5).

The `examine` step for Nia, Mateo and Kofi is taught and recorded in the V4 trace,
not enforced by a new examined-item flag. Their recovery topics name the fixed
fixture and its visible evidence explicitly; no unratified flag or action seam is
introduced. The fixed fixtures cannot be carried away.

Pre/post catch-alls are complementary on each recovery flag. Nia, Mateo and Kofi
have no non-default free-text `ask`/`tell` topic. Priya's only such topic is the
explicit post-choice `tell` reason producer, mutually exclusive with the
choice-start topic on choice state and node membership, so T5 remains
straightforward. Prompts name the actor and registered fixture explicitly; bare
`ask about …` is not relied on in shared rooms.

## 8. Flags and dependency contract

| Flag                                      | Single producer                         | Reader                                                                   |
| ----------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| `nia-observation-recovered`               | `topic-nia-observation`                 | Quiz-start gate, dial guard, final puzzle.                               |
| `mateo-reading-recovered`                 | `topic-mateo-instruction`               | Quiz-start gate, dial guard, final puzzle.                               |
| `priya-reasoning-recovered`               | `topic-priya-choice-reason`             | Quiz-start gate, dial guard, final puzzle.                               |
| `kofi-operation-recovered`                | `topic-kofi-practice-cycle`             | Quiz-start gate, dial guard, final puzzle.                               |
| `priya-choice-taken`                      | `topic-priya-choice-made`               | `topic-priya-choice-reason`; `topic-priya-choice-start` activity/resume. |
| `quiz-passed:quiz-assistance-orientation` | Quiz `onPass`                           | Dial guard and final puzzle.                                             |
| `assistance-dial-calibrated`              | Successful `use assistance dial`        | Final puzzle only.                                                       |
| `tutorial-complete`                       | `puzzle-calibrate-assistance` `onSolve` | Hub east, hub north, older-interface east.                               |

The four recoveries may occur in any order. The quiz starts only after all four.
The dial succeeds only after the quiz pass. The final puzzle then sets
`tutorial-complete`. This is acyclic and has no possession requirement (N7, P6,
V4).

## 9. Practice systems

### 9.1 `quiz-assistance-orientation`

- Actor: `npc-the-ai`.
- Topic: `tutorial-mechanics`.
- Score: 0.
- Questions: `q-ao-01`–`q-ao-04`.
- Pass mark: 3 of 4.
- No timer; omit `attemptsAllowed` for unlimited retries.
- `hintSequenceId: hint-assistance-orientation`.
- `onFail`: `change-lives delta: 0`, an explanatory message and no `move-player`;
  failure preserves the player's current room rather than guaranteeing Records.
- `onPass`: set `quiz-passed:quiz-assistance-orientation`, complete
  `tutorial-mechanics`, restore `actorstate-ai-reluctant-guide` and state that
  final calibration remains.

| Question  | Prompt and options in authored order                                                                                                                                                                                                                                                                                                                                                                                                          | Correct index | Tag          |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------ |
| `q-ao-01` | Which set contains all three accepted ways to answer a quiz question? (0) `answer N`; `choose N`; exact option text. (1) `answer N`; bare `N`; exact option text. (2) `answer N`; bare `N`; option letter. (3) `choose N`; option letter; exact option text.                                                                                                                                                                                  | 1             | AO1 / easy   |
| `q-ao-02` | A practice cabinet is locked. You want to unlock it without opening it yet. Which command fits? (0) `open <target>`. (1) `use <item> <target>`. (2) `unlock <item> <target>`. (3) `examine <target>`.                                                                                                                                                                                                                                         | 2             | AO2 / medium |
| `q-ao-03` | You finish an orientation attempt below the pass mark. Which statement correctly describes the failure and help available? (0) One life is lost, you return to Intake, and hints give the correct option. (1) No life is lost, you are not moved, and hints nudge without giving the answer. (2) No life is lost, you return to Intake, and hints cost one life. (3) One life is lost, you stay in Records, and further attempts are blocked. | 1             | AO2 / medium |
| `q-ao-04` | You want a portable save file and a control that restores it later. Which pair matches those jobs? (0) `save`, then `restart`. (1) `load`, then `download`. (2) `restart`, then `save`. (3) `download`, then `import`.                                                                                                                                                                                                                        | 3             | AO2 / easy   |

Indices are 0-based in YAML and displayed 1-based. Every distractor targets a
real interface misconception; every answer explains the key (P3, P4). No question
uses `search`, a letter shortcut, AI ethics or cognitive decline as a key. The W7
fix round keeps key 2 for `q-ao-02` but its explanation now teaches both accepted
item-first forms — `unlock <item> <target>` (the `help` form) and the same command
with the preposition `with`, `unlock practice key with practice cabinet` — so a
correct answer can be copied into the room and will work.

### 9.2 `puzzle-calibrate-assistance`

- Topic: `tutorial-mechanics`.
- Score: 0.
- `dependsOn: []`.
- `hintSequenceId: hint-assistance-orientation`.
- One composite `all` requirement containing:
  `nia-observation-recovered`, `mateo-reading-recovered`,
  `priya-reasoning-recovered`, `kofi-operation-recovered`,
  `quiz-passed:quiz-assistance-orientation` and `assistance-dial-calibrated`.

The composite requirement keeps the puzzle inactive until the final dial action
completes the set, so `turns-since:puzzle-calibrate-assistance` cannot start during
unrelated tour turns.

`onSolve` order:

1. `set-flag tutorial-complete = true`;
2. a message confirming that the teaching-zone ports brighten;
3. `complete-topic tutorial-mechanics`.

The final action is `use assistance dial`. Success sets
`assistance-dial-calibrated`; early use leaves every flag and item unchanged and
points to the dark sockets with the approved `useText.blocked` wording. The
content-declared conditional action seam landed in W6: the
conditional producer sets `assistance-dial-calibrated` only after the five recorded
prerequisites and the bell reuses its existing item description with no state
change. The logic-only puzzle card remains unchanged; the runtime producer is
code-owned and verified in slice `ward-w6-generation` (D3, V4).

### 9.3 Three room-scoped hint ladders

The W7 fix round replaced one generic, sequence-wide ladder with three ladders
resolved by the room-target seam documented in `hints.md` and implemented in
`HintSystem.sequenceForRoom()`. Each has three levels, `cooldownTurns: 2`, no
`scorePenalty`, no `autoOfferAfter`, and unlocks on
`counter-at-least hints-shown:<own id>` at 0/1/2 (H2, H3, P6). Level state is now
per sequence, so a first hint in Demonstration starts at level 1.

- **`hint-assistance-intake`** — targets `room-assistance-intake`: observation
  card and Nia's detail; tally token and inventory; look/examine then east.
- **`hint-assistance-demonstration`** — targets
  `room-assistance-demonstration`: lock and door as separate jobs; the
  instruction card's first word; key versus block and the showing step.
- **`hint-assistance-orientation`** — targets `room-assistance-records`,
  `quiz-assistance-orientation`, `puzzle-calibrate-assistance` and
  `tutorial-mechanics`: Priya's two-half exchange; the numbered audit options;
  the five board records against the five dial sockets.

Every level names the stalled step without giving a correct option, flag, dial
setting or exact final command (H2). The audit and final puzzle retain
`hint-assistance-orientation` as their `hintSequenceId`.

## 10. Gates, clues and feedback

Every locked teaching-zone route and the final puzzle has an in-fiction
justification and at least two discoverable clues (N6).

| Gate or puzzle       | Clue 1                                                                                                                                                    | Clue 2                                                                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hub east and north   | Hub prose: "South opens into the Assistance Ward. The east and north teaching sockets stay dark until the ward's calibration mark is entered."            | `item-port-label`: "TEACHING PORTS: LIVE AFTER ASSISTANCE WARD CALIBRATION." Reinforced by amended `topic-ai-escape`.                                                   |
| Older-interface east | Room prose: "The east arrow is dark until the Assistance Ward's calibration mark is entered; the opening behind you still returns to the hub."            | `item-assistance-interface-plaque`: "NO SIGNAL UNTIL ASSISTANCE WARD CALIBRATION. THE ROUTE BACK REMAINS OPEN."                                                         |
| Final calibration    | Recovery board: "OBSERVE — Nia. READ — Mateo. REASON — Priya. OPERATE — Kofi. ORIENTATION PASS — the AI's practice audit. All five records are required." | Dial labels: "OBSERVE, READ, REASON, OPERATE, ORIENTATION PASS. Empty sockets keep the teaching ports dark." Early-use feedback repeats the blocker without solving it. |

Failure text gives a changed hypothesis, not a bare refusal (N5). Quiz failure
explains the result, costs no life, does not move the pupil and permits another
attempt without a return walk. Wrong verbs, targets and fixture actions preserve
lives, position, flags and item ownership. Completed actions acknowledge
completion without resetting progress (difficulty-and-fairness §2.7).

## 11. Existing-card amendments

1. `network-hub/rooms.yaml`: add ungated south; add `tutorial-complete` to east
   and north; revise dark/live prose and `item-port-label`.
2. `network-hub/npcs.yaml`: amend `topic-ai-escape` to name the ward checkpoint and
   safe south route.
3. `1-2-1-data-representation/rooms.yaml`: add `tutorial-complete` to
   `room-entry-interface` east; add the clue prose and interface plaque.
4. `entry-interface/rooms.yaml`: add `area-assistance-ward` to the single world's
   `areaIds`.
5. `entry-interface/npcs.yaml`: exclude the ward from global `topic-ai-default`
   so the ward catch-all can resolve. The required first-active-default selector
   fix is landed and independently reviewed; this amendment has returned.

Each amendment is a separate owning-writer re-brief; the editor does not edit
those YAML cards (D1, D2).

## 12. Dispatch plan after approval

Gate 0 is complete. Use the standing dependency order (`.opencode/agents/content-editor.md` Gate 1):

1. **Rooms:** `assistance-ward/rooms.yaml` has returned as a reduced-scope card.
   The dial and bell `use` interactions are omitted and recorded only in
   `authoring.useNotes`; any later interaction amendment waits for the runtime
   seam. The four independent owning-card amendments have returned.
2. **NPCs:** `assistance-ward/npcs.yaml` and the `entry-interface/npcs.yaml`
   default-scope amendment have returned. W4 revision round 1 corrected the
   Records keyword collision, Nia's fixture evidence, hand-over teaching, Priya's
   reason prompt and onboarding terminology. CC-04 then separated the
   non-producing node default from the explicit post-choice `tell` producer, made
   `ask` the choice form and prevented idle or retired-choice recovery. The revised
   card validates; focused PCK re-review returned PASS, while focused
   content-critic re-review found the empty-object `tell` producer unreachable at
   runtime. `code-lead` closed the blocker with independent PASS; the prompt
   revision validates; final content-critic and focused PCK re-reviews are PASS.
   All six ward cards are approved; the final whole-set V4 review returned PASS
   WITH MINORS with no blocker or major; focused minor closure is complete with the
   sole accepted dial-producer deferral.
   The separate
   `ward-topic-locality` runtime fix closed CC-01 with independent PASS on
   2026-11-27.
3. **Quiz:** `assistance-ward/quizzes.yaml` has returned; the NPC card provides the
   quiz-start contract without changing the approved quiz.
4. **Puzzle:** `assistance-ward/puzzles.yaml` has returned against the ratified
   `assistance-dial-calibrated` producer contract. The card declares requirements
   and solve effects only; the approved conditional dial `use` producer is
   implemented and tested in code by W6.
5. **Hints:** `assistance-ward/hints.yaml` has returned against the approved
   target IDs. W4 revision round 1 made level 1 state-neutral; the three room IDs
   on `tutorial-mechanics` now provide runtime hint context.
6. **Hazards:** no hazard content. The hygiene-only writer returned a valid empty
   card with singular `kind: hazard`; no hazard, trigger or life-loss effect is
   authored.

Every returned batch must pass `content:validate` before `content-critic` and
`pck-reviewer` run in parallel (D5, V1, V2). The PCK review checks that the
satire creates no false AI or cognitive claim and that the tutorial is
age-appropriate. The accepted V4 trace must then route through the ward before
The Switchyard and prove the three teaching-zone gates, every practice system
and the unchanged whole-game win path (V4). W6 generation and the W7 content
playtest follow only after acceptance and the required runtime seams.

The 2026-11-27 W7 fix round revises `npcs.yaml`, `quizzes.yaml` and `hints.yaml`
under the contracts in §§7.1, 9.1 and 9.3, and adds `blockedText` to the hub east,
hub north and older-interface east exits in their owning room cards. Parser
aliases (`place`, `talk to`), both item-first `unlock` forms, in-world gate feedback,
quiz start idempotence, SHOW/GIVE transfer messages and the objective/controls
copy are code-owned. The ward is not fully verified until those cards validate,
both reviewers pass, W6 regenerates and a focused ward-only W7 re-test closes
all 13 findings.
