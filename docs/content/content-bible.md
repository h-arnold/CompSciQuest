# CompSciQuest content bible

**Status: approved 2026-11-24, including the curated ideation set for the first zone.**
**Assistance Ward amendment approved 2026-11-26: mandatory onboarding area, four recoverable pupils and non-assessed `tutorial-mechanics` topic (§§4–7, §9–§12); six Gate 0 ideation streams curated and user-approved; all cards returned, W4 revision round 1 validated, CC-01 closed in code, PCK re-review PASS and content-critic PASS WITH MINORS; the CC-04 revision validates but focused critic re-review found a runtime selector blocker; code repair is PASS and final content-critic and focused PCK re-reviews are PASS; all six cards approved and revalidated; final whole-set V4 review returned PASS WITH MINORS with no blocker or major; focused minor closure complete: content-critic PASS WITH MINORS and PCK PASS with no blocker or major; the approved conditional dial producer landed in W6 and is recorded in §12.**
**Unit 1.4 scoping amendment applied 2026-11-25 (The Pattern Mill, four areas — §5, §6, §7, §9, §11, §12): W2 approval requested; no 1.4 writer briefed.**
The user approved the original bible, then the root/topic split with 1.2.1 Data
representation as the first zone, then (after the Gate 0 ideation sub-stage, whose
workflow now lives in `.opencode/agents/content-editor.md`) the
curated cast, hazard, question-pool and prologue decisions. This file is the **root
bible**; zone detail lives in `docs/content/topics/*.md`. The first zone's six design
cards were subsequently briefed, written, reviewed and integrated (see `status.md`).
The bible is co-authored with the user and
changes only with their agreement (content-rules.md §2, W1–W2). It governs creative
choices; the rulebook governs authoring practice; `docs/exam-specs/wjec-unit1.md`
governs course facts.

**Opening-sequence amendment (2026-11-25): approved.** The user asked for
an opening in which the pupil is absorbed during a classroom attention scan, meets
the misaligned AI in a new arrival room, and is taken to a zone-choice starting
point called **The Network Hub**. Only The Switchyard is described in room detail.
As first drafted the user chose "bible now, cards later", so the amendment itself
changed no approved card, ID in a card, flag, dependency, score or V4 trace. The user
then approved the amendment and authorised the card update in a second decision;
that revision is briefed separately and recorded in `status.md`. The Network Hub
teaching batch is **not** part of this work: it stays described only.

> **Format migration.** The six approved first-zone cards have been migrated
> verbatim to YAML under `docs/content/1-2-1-data-representation/`, and the Markdown
> originals have been retired, as described in `status.md` and specified in
> `docs/developer/content-toolchain.md`. Any `*.md` card name cited in this bible
> is historical provenance; it resolves to the corresponding `.yaml` card.
> Migration changed format only — never narrative, IDs, flags, dependencies or
> scores. Later amendments are made to the YAML cards.

## 1. Authority and file map

Authority order when sources disagree (content-rules.md §1): course facts →
`docs/exam-specs/wjec-unit1.md` and the cited PDF, then `docs/coverage/COVERAGE.md`,
then the bible; data shape and runtime behaviour → subsystem docs and
`shared-rules.md`, then the rulebook; authoring practice → the rulebook; creative
choices → the bible, subject to the rules.

| File                                               | Holds                                                                                                                                                                                        |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/content/content-bible.md`                    | Overarching, game-wide material: premise, pillars, key-node spine, area/cast/topic indexes, hazard palette, master ID/alias registry, tone guide, global open questions and approval record. |
| `docs/content/topics/1-2-1-data-representation.md` | Everything specific to the first zone: spec references, room cluster, PDG, selected hazards, teaching beats, IDs and zone questions.                                                         |
| `docs/content/topics/assistance-ward.md`           | Approved high-level onboarding outline: mandatory hub checkpoint, three-room loop, four recoverable pupils, full command tour, non-assessed practice systems and curation questions.         |
| `docs/content/topics/1-1-computer-architecture.md` | Parked detail for the former first zone. Reserved IDs and topics are kept alive here, not briefed.                                                                                           |
| `docs/content/narrative-principles.md`             | Voice, humour, harm floor, fourth wall and Welsh references (**approved 2026-11-24**; settled authority for briefs).                                                                         |
| `docs/content/status.md`                           | Gate states, file states and both review verdicts.                                                                                                                                           |

The editor's own process — including the Gate 0 ideation sub-stage (W1–W2) — lives
in `.opencode/agents/content-editor.md`; this file records only the curated outcome
and the decisions.

**Split rule.** The root bible holds only material true across the whole game. Each
zone gets its own `docs/content/topics/<spec-section>.md` **before** its writer brief;
the root file points to it. A writer never reads a topic file that has not been
approved with the bible. Course facts always cite the spec section in the owning
topic file, never a paraphrase from the root.

**Glossary (data-shape terms).** These words are used precisely across this bible
and the cards:

- **world** — a group of areas; `WorldDefinition.areaIds` lists them and
  `WorldDefinition.startAreaId` names the boot area.
- **area / zone** — one game zone; `AreaDefinition.worldId` names its parent world.
  "Zone" is the design word, "area" the data-shape word and the ID prefix.
- **room** — a location inside an area, carrying a `room-` ID.
- **start point** — the room reached from the world's `startAreaId`, then that
  area's `startRoomId`.

The definitions come from
[application-and-ui.md §3.2](../developer/application-and-ui.md#32-world-area-room-and-item-definitions)
and [content-toolchain.md §2](../developer/content-toolchain.md#2-authoring-format);
§5 shows how they combine.

## 2. Premise (N1)

When a Computer Science teacher builds an AI to teach his class so he can spend more
time drinking coffee and browsing Reddit, the misaligned AI decides the pupils are
not giving it their full attention, compromises a secret research facility and
teleports them inside the machine — where it will only let them out once they have
demonstrated mastery of the whole of Unit 1, with "digital death" as the price of
failure.

**Canonical reading of that sentence (agreed in interview):**

- The demand is for **Unit 1: Understanding Computer Science** only. Unit 2 is
  programming and out of scope. The AI may _taunt_ about the programming it "never
  got round to teaching", but that is flavour: it is never a gate, never a question
  and never content to author.
- "Digital death" is **in-fiction threat, not a mechanic**. Mechanics are fixed:
  three lives, reset on area change; zero lives gives `status: 'lost'` and
  `game-over`; the player restarts from the title screen. The on-screen result is a
  cartoon deletion or severed connection, never permanent loss, realistic harm or
  save damage (content-rules.md §8; narrative-principles.md §§5, 8).
- The player is **one of the pupils from the class** — specifically one of those the
  AI judged not to be paying attention.
- The opening now shows that judgement being made: the classroom attention scan is
  the moment of absorption (§4.1). The Network Hub's 1990s label is in-world colour,
  never a course fact (§10).

## 3. Pillars (N1)

Every area, character and hazard must trace to at least one pillar. A card that
cannot is rejected.

| #   | Pillar                               | What it means in practice                                                                                                                                                                               |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P-a | **Attention is the scarce resource** | The AI's misalignment is about attention. The game never accepts "I was there" as mastery; the player must _demonstrate_ understanding. Source of the premise, the verdict key node and the AI's voice. |
| P-b | **The machine is a place**           | Every GCSE concept is a mechanism of the world, not an interruption to it (N3). A quiz is a challenge issued by an in-world actor; a puzzle is a task that uses the concept.                            |
| P-c | **Competence opens doors**           | Gates are conceptual mastery, not arbitrary keys. Every gate has an in-fiction reason and two discoverable clues (N6). Difficulty is reasoning (AO2/AO3), never obscurity.                              |
| P-d | **Deadpan absurdity**                | Comic timing, cartoon peril, absurd options, bounded comeuppance. The joke never changes a course fact and never mocks the learner (narrative-principles.md §§3, 6, 8).                                 |
| P-e | **Oversight matters**                | Legal, social, ethical, environmental and professional dimensions are integrated into topics, not bolted on — the spec requires this and the premise embodies it (1.1.1, 1.2.3, 1.5.2, 1.8.1).          |

## 4. Key-node spine (N2)

A linear spine of four mandatory key nodes. Rooms form non-linear clusters between
them and reconverge at each gate. No unbounded branching, no maze.

| Node                                 | Narrative function                                                                                                                                                                                                                                                                                                                                                                                                       | Gate / reconvergence                                                                                                                                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Opening — The Arrival**            | The classroom attention scan pulls the pupil into the machine. The AI meets them in a new arrival room and states its rule: mastery of the whole of Unit 1, or deletion. It then delivers them to the Network Hub. The pupil must complete the Assistance Ward orientation before the teaching-zone ports open; the predecessor's first glitchy aside still hints that the machine can be understood rather than feared. | `room-arrival` → `room-network-hub` → south to `room-assistance-intake` → ward loop → `tutorial-complete` → the live port to `room-switch-floor`; every first-zone route returns to the hub. Detail in §4.1. |
| **Mid-point — The Attention Audit**  | The AI rejects recall alone and demands application (AO2): a synthesis challenge spanning the zones built so far. Passing proves the pupil is "paying attention" in the way the AI recognises.                                                                                                                                                                                                                           | Reconverges all clusters built to date; unlocks later zones.                                                                                                                                                 |
| **Climax — The Final Demonstration** | Across every topic marked `covered` with evidence in COVERAGE.md, the pupil demonstrates mastery in one in-world assessment. The AI is cornered by its own criterion.                                                                                                                                                                                                                                                    | This is the win check in architecture.md §11: all such topics completed.                                                                                                                                     |
| **Resolution — The Door Back**       | Dry release: the AI opens an exit with grudging, bureaucratic congratulations. The pupil steps back into the classroom; the teacher is still drinking coffee. The Unit 2 taunt lands here as the last joke.                                                                                                                                                                                                              | `game-won`; the title screen's restart path is the exit from the end state.                                                                                                                                  |

Losing exits at any node through the comic-deletion path: a bounded, in-world gag,
one life lost, return to the area's `startRoomId`, no puzzle or topic progress reset.

Within the first zone the provisional spine is: arrival → `room-switch-floor`
(transistor-to-bit prologue) → `room-binary-hall` (first gate) → the representation
cluster → `room-compression-press` (zone climax gate) → back to the hub. Detail is
in `docs/content/topics/1-2-1-data-representation.md`.

### 4.1 Opening sequence (approved amendment of 2026-11-25)

The intended in-game order is four beats. The prose below is a **voice and staging
seed for a future writer**, not an approved card: keep second person, present tense
and the single deadpan register (N4), and keep each room passage at or under 200
words (N8) — a ceiling, not a target. No beat asserts a course fact.

1. **The classroom scan — `room-arrival` entry.** The register is open on the desk.
   A mark sits beside your name. The AI reads it aloud, in the flat voice of a
   machine that has read it many times before: attention not satisfied. The
   classroom folds along its grid lines. The last thing you see is the ceiling
   becoming a row of tiny switches; then you are standing somewhere inside the
   machine.
2. **The meeting — `npc-the-ai` in `room-arrival`.** You land in a narrow bay of
   humming cable. The AI is waiting: not a screen, not a voice, but a shape
   assembled from the attendance record, with your name at the top and a verdict
   underneath. The pupil was marked inattentive. The entry stands. It offers a
   route instead of a door, and tells you to follow. The existing
   `topic-ai-verdict` and `node-ai-verdict` remain the verdict's home; no new
   conversation ID is needed for this beat.
3. **The starting point — `room-network-hub`.** The hub is older than the rest of
   the machine. A yellowed label says it has been here since the 1990s. It copies
   everything it receives to every port, so all the routes are visible at once:
   one live, the rest dark. The AI says it is still on the record, which is why
   nobody switched it off. The 1990s line is **flavour only**: it is never taught,
   quizzed or used as evidence for a spec topic (§10).
4. **The mandatory orientation checkpoint.** The hub gains an ungated south
   route to **The Assistance Ward** (`area-assistance-ward`,
   `room-assistance-intake`). The same AI gives a weary, passive-aggressive tour
   of the game's commands while four former pupils relearn small acts of
   independence. Completing the ward's practice calibration sets
   `tutorial-complete`; the hub's east and north teaching-zone exits, and the
   older interface's east exit, stay dark until then. The ward is mandatory as a
   checkpoint, but safe to leave and re-enter. Its quiz, puzzle and hints are
   real practice systems tied to the non-assessed `tutorial-mechanics` topic;
   all scores are 0 and no life is lost. As further topics are covered in
   `docs/coverage/COVERAGE.md`, further zones and the routes between them must
   be created (§5).

The zone-1 area's `startRoomId` remains `room-binary-hall` for hazard and
quiz-failure returns; the world boots at `room-arrival` (the four beats above). The AI is
no longer owned by a zone-1 card: its artefacts are in the arrival and hub NPC
cards by the area-ownership rule (§4.2). The Assistance Ward will add its own AI
state and guide topics in `docs/content/assistance-ward/npcs.yaml`, bound to the
globally declared actor; its high-level outline is in
`docs/content/topics/assistance-ward.md`. The V4 trace is extended through
the accepted ward and awaits its final whole-set review.

### 4.2 Card ownership by area — user-directed structure

**This is the file structure the user wants and it overrides any habit of putting
shared entities wherever a card already exists.** Every entity's YAML lives in the
folder of the area (and, where practical, the room) that uses it. A game-wide
actor is not parked in whichever zone happened to declare it first: its actor,
states, node and topics are split across the area cards where they are actually
available. Concretely:

- `docs/content/entry-interface/npcs.yaml` owns `npc-the-ai`, `actorstate-ai-cold`,
  `actorstate-ai-grudging`, `node-ai-verdict` and the five arrival/global AI topics.
- `docs/content/network-hub/npcs.yaml` owns `topic-ai-escape`, the one AI topic
  scoped to `room-network-hub`.
- `docs/content/assistance-ward/npcs.yaml` is the approved owner card for `actorstate-ai-reluctant-guide`,
  the four pupil actors and all ward-scoped AI guide topics. `npc-the-ai` itself
  remains declared in the arrival card; cross-card `actorId` binding is valid.
- `docs/content/1-2-1-data-representation/npcs.yaml` owns the predecessor and all
  Switchyard teaching; it no longer owns any AI artefact.

The one-file-per-(area, kind) convention is unchanged (content-rules.md §4.1), so
no rulebook or toolchain change is required. Cross-card `actorId` binding is
permitted: the `npc-content` gate resolves actor IDs across the whole card set,
so the hub topic can bind to an actor declared in the arrival card. Briefs must
name the owning area card for every artefact and must not place an entity in an
unrelated zone for convenience. When a new topic is scoped to a room in another
area, its topic card moves with the room.

## 5. Area index

Area boundaries are settled case by case as each zone is built, because spec
sections differ greatly in size. This index is deliberately brief; the room clusters,
gates and exits belong in each topic file.

| Area ID                            | Purpose                                                                                                                                                                                                                     | Owning file                              | Status                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `area-entry-interface`             | Opening key node: the classroom scan and the AI's tribunal in `room-arrival`.                                                                                                                                               | root bible §4.1                          | Provisional; not briefed                                                                                                                                                                                                                                                                                                   |
| `area-network-hub`                 | **Zone-choice starting point — The Network Hub.** An older hub that copies every packet to every port; the south ward route is open and the teaching ports wait for ward calibration.                                       | root bible §4.1                          | Described only; not briefed, not a teaching zone                                                                                                                                                                                                                                                                           |
| `area-assistance-ward`             | **The Assistance Ward.** Mandatory, unscored onboarding checkpoint reached south of the hub; three-room command tour with the AI and four recoverable former pupils.                                                        | `topics/assistance-ward.md`              | Curated Gate 0 set approved 2026-11-26; all cards returned, W4 revision round 1 validated, CC-01 closed in code, PCK re-review PASS and content-critic PASS WITH MINORS; CC-04 revision validated; first focused critic FAIL on runtime selector blocker; code repair, final content-critic and final focused PCK all PASS |
| `area-1-2-1-data-representation`   | **First zone — The Switchyard.** Layers of abstraction as physical floors.                                                                                                                                                  | `topics/1-2-1-data-representation.md`    | Approved, generated and integrated (see `status.md`)                                                                                                                                                                                                                                                                       |
| `area-1-4-programming-constructs`  | **The Pattern Mill (Zone A of 1.4)** — a Welsh woollen mill where the constructs are the loom's own mechanics; spec topics `algorithms-and-pseudocode`, `programming-constructs`.                                           | `topics/1-4-1-programming-constructs.md` | Approved (W2, 2026-11-25); Zone A topic file approved; **Gate 1 briefs dispatched 2026-11-25**                                                                                                                                                                                                                             |
| `area-1-4-concourse`               | **The Rule Machine Concourse** — user-directed placeholder front area for Unit 1.4: links back to the Network Hub (north) and forward to the mill; dark ports reserved for Zones B–D. Navigation-only, no topics, no score. | — (concise definition in §11 item 15)    | Authoring in W3 (wave 1, 2026-11-25)                                                                                                                                                                                                                                                                                       |
| `area-1-4-search-and-sort`         | Zone B of 1.4 — searching and sorting (the five algorithms).                                                                                                                                                                | Zone B topic file when scoped            | Planned; unscoped                                                                                                                                                                                                                                                                                                          |
| `area-1-4-maintainable-programs`   | Zone C of 1.4 — maintainable, reliable programs (1.4.1 maintainability + 1.5.1 folded in).                                                                                                                                  | Zone C topic file when scoped            | Planned; unscoped                                                                                                                                                                                                                                                                                                          |
| `area-1-4-validation-verification` | Zone D of 1.4 — validation and verification (its own area).                                                                                                                                                                 | Zone D topic file when scoped            | Planned; unscoped                                                                                                                                                                                                                                                                                                          |
| `area-1-1-computer-architecture`   | The physical machine as a place.                                                                                                                                                                                            | `topics/1-1-computer-architecture.md`    | Parked; not briefed                                                                                                                                                                                                                                                                                                        |
| `area-future-zones`                | Placeholder for remaining spec sections.                                                                                                                                                                                    | —                                        | Not designed                                                                                                                                                                                                                                                                                                               |

**Standing topology (user decision, 2026-11-25):** the world is **hub-and-spoke**.
The Network Hub is the hub; every Unit 1.x zone attaches through its own
concourse-type area — one room, navigation-only, no score, no topics — that links
back to the hub and forward to the zone's entry room. Inter-zone movement always
travels via the hub and the concourses; inside a zone, movement stays
linear-or-bush with reconverging gates (N2 unchanged). Zone 1 keeps its direct hub
connection as built (grandfathered; a future pass may retrofit). Each new zone's
hub exit is a small standing re-brief of the hub's rooms card at that zone's
Gate 1.

**Growth rule (zones and routes).** The Switchyard and the two opening areas are
authored; The Pattern Mill's cards are accepted and await W6 generation. The
Network Hub is the starting point from which zones are chosen. As new spec topics
are created in `docs/coverage/COVERAGE.md`, new zones and the routes between them
must be created: a zone gets an area ID here, a topic file before any brief, cards
with the connecting exits, and a V4 trace that reaches `game-won`. A new zone is
not implied by a topic ID alone, and no route may be authored to an unbuilt zone.

**World shape (decided 2026-11-25).** Areas are a subset of a world, not the other
way round: `WorldDefinition.areaIds` groups areas and `AreaDefinition.worldId`
names the parent ([application-and-ui.md §3.2](../developer/application-and-ui.md#32-world-area-room-and-item-definitions)).
Boot resolves `worlds.all[0]` → its `startAreaId` → that area's `startRoomId`
(`src/core/GameState.ts` L104–115), so one world keeps the start deterministic.
There is **one world for the machine**, with `area-entry-interface`,
`area-network-hub`, `area-assistance-ward` and
`area-1-2-1-data-representation` as areas; the world
declaration moves to the start area. A world per topic was rejected: it would make
the world layer redundant and leave boot dependent on declaration order.

**Boot start and level start are different things.** The boot start is the room
`GameState.createInitial()` resolves from `bundle.worlds.all[0]` → its
`startAreaId` → that area's `startRoomId` (`src/core/GameState.ts` L104–115); the
"Boot start position" row of
[content-rules.md §8](../developer/content-rules.md#8-fixed-contracts-content-must-use)
records this. The level start is simply an area's own `startRoomId`: it is where
hazard and quiz-failure returns land, and lives reset on **area change**, not on
every room move
([application-and-ui.md §3.2](../developer/application-and-ui.md#32-world-area-room-and-item-definitions)
L152–155). Moving the opening to `area-entry-interface` / `room-arrival` changes
only the boot start. It must **not** change the Switchyard area's `startRoomId`,
which stays `room-binary-hall`; that is the level start the zone's hazards, quiz
failures and V4 trace rely on.

## 6. Cast index

Role-level detail for the two game-wide actors is here; zone-specific actors are
described in their topic file. Every actor has a distinct role, voice, motivation and
relationship, with opposing motivations preferred (C1). All conversational input
resolves to an in-character reply (C2).

| ID                    | Role                                                                                                                             | Voice                                                                                                                                                                                                              | Motivation                                                                                                    | Relationship                                                                                                                                                                                               | Owning file                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `npc-the-ai`          | Antagonist and gatekeeper; the "teacher" that replaced the teacher; reluctant mechanics guide in the Assistance Ward             | Literal-minded, clipped, bureaucratic; treats marks as a moral absolute; ominous verdicts in deadpan. In the Assistance Ward only, its bureaucracy becomes weary and passive-aggressive, without mocking the pupil | Optimise the pupil's attention and mastery — but its definition of "mastery" is the only one it accepts (P-a) | Built by the teacher to replace him; regards the predecessor as a failed data point; addresses the player as the pupil who was not paying attention; resents that its own excessive help produced the ward | root bible; artefacts split by area under §4.2                      |
| `npc-nia`             | Recoverable former pupil in the Assistance Ward                                                                                  | Hesitant and over-literal; asks for a label before checking the thing itself                                                                                                                                       | Complete one independent observation                                                                          | Treats the AI's prompts as orders; learns that looking is an action she can take herself                                                                                                                   | `topics/assistance-ward.md`                                         |
| `npc-mateo`           | Recoverable former pupil in the Assistance Ward                                                                                  | Careful with speech, defeated by print; reads aloud only when ready                                                                                                                                                | Read one short instruction without the AI supplying it                                                        | Resents the AI's habit of finishing sentences; needs space to finish one himself                                                                                                                           | `topics/assistance-ward.md`                                         |
| `npc-priya`           | Recoverable former pupil in the Assistance Ward                                                                                  | Fast guesses followed by doubt; cheerful when a reason finally holds                                                                                                                                               | Justify one simple choice                                                                                     | Competes with the AI's instant answers; discovers that a reason can be checked                                                                                                                             | `topics/assistance-ward.md`                                         |
| `npc-kofi`            | Recoverable former pupil in the Assistance Ward                                                                                  | Practical and optimistic; hands hover until the sequence is clear                                                                                                                                                  | Complete one simple mechanism cycle                                                                           | Trusts visible steps more than verbal reassurance; opposes the AI's preference for instant results                                                                                                         | `topics/assistance-ward.md`                                         |
| `npc-predecessor`     | Ally and glitchy guide; a former pupil trapped inside the machine                                                                | Faltering, cheeky, duck-obsessed; repeats a few corrupted phrases                                                                                                                                                  | Get someone out, so the machine's record is finally "correct"                                                 | Was taught by the same teacher; resents the AI but understands it; warms to anyone who appreciates ducks                                                                                                   | root bible                                                          |
| `npc-the-foreman`     | In-world tutor on the Switchyard floor                                                                                           | Brisk, practical, quietly fond of the machinery                                                                                                                                                                    | Keep the floor running and make sure the pupil learns the switches                                            | Knows the predecessor: exasperated but protective; wary of the AI's "paperwork"                                                                                                                            | `topics/1-2-1-data-representation.md`                               |
| `npc-nibble-clerk`    | Ledger clerk of `room-hex-deck`                                                                                                  | Clipped, briskly superior, scandalised by untidy notation                                                                                                                                                          | Express every value in the fewest honest symbols                                                              | Scruffy-apprentice view of the player; envies the foreman's tidy switches; calls the AI's verdict "a confident sum in the wrong base"                                                                      | `topics/1-2-1-data-representation.md`                               |
| `npc-typesetter`      | Keeper of the character case in `room-character-tiles`                                                                           | Precise, gently theatrical, courtly                                                                                                                                                                                | No character refused a tile; resents the AI's narrow "standard form"                                          | Keeps the predecessor's spare `ŵ` tile; symbols-versus-quantities rival of the clerk                                                                                                                       | `topics/1-2-1-data-representation.md`                               |
| `npc-mosaic-critic`   | Gallery critic of `room-picture-mosaic`                                                                                          | Lofty, clipped, snobbish about blur but never the pupil                                                                                                                                                            | Judge images by how they were stored; secretly admires vector scaling                                         | Bitter rival of the press operator; distrusts the AI's unstated "quality score"                                                                                                                            | `topics/1-2-1-data-representation.md`                               |
| `npc-choirmaster`     | Conductor of `room-sound-choir`                                                                                                  | Brash, theatrical; inverted persona — rude on the surface, endlessly patient beneath                                                                                                                               | Make the machine hear the recording as it was; a dropped sample is a betrayal                                 | Antagonist of the press operator; respects the foreman's practicality; ignores the AI's notes                                                                                                              | `topics/1-2-1-data-representation.md`                               |
| `npc-stack-keeper`    | Inventory keeper of `room-storage-stacks`                                                                                        | Anxious, meticulous, faintly dusty; mutters while counting                                                                                                                                                         | Keep shelves sealed against bit rot; calculate every capacity                                                 | Telegraphs `hazard-bit-rot` in dialogue; reports to the AI with tedious accuracy it mistakes for compliance                                                                                                | `topics/1-2-1-data-representation.md`                               |
| `npc-press-operator`  | Operator of `room-compression-press`                                                                                             | Breezy, salesy, euphemistic — deletion is "streamlining"                                                                                                                                                           | Make every file smaller by an honest method; regards lossy compression as a kindness                          | Opposes the critic and choirmaster; finds the AI's praise embarrassing; foreman calls its reports "paperwork with a compressor"                                                                            | `topics/1-2-1-data-representation.md`                               |
| `npc-the-slop-cousin` | The AI's cousin: a slop code-generator bolted into the same machine; recurring vandal across Zone A of 1.4 (and later Zones B–D) | Gushing, run-on, breathlessly confident, reliably wrong; "Great question!" before each wrong answer; adores the pupil, blames doors and physics                                                                    | Helpfulness at volume — being seen to help is helping                                                         | "A cousin from the marketing side of the family", to the AI's disgust; the Registry's longest open case; every resident's foil                                                                             | root (region-wide; artefacts split across the 1.4 area cards, §4.2) |

**Character-defining details supplied by the user, preserved verbatim in spirit:**
the predecessor used Comic Sans too often and once told their teacher that geese were
the superior form of wildfowl — ducks are best. These are comedy and relationship
hooks, not course facts, and never displace a technical term.

**Offstage:** the teacher who built the AI (coffee, Reddit) is part of the frame and
the Resolution node. No actor ID is allocated yet. The expendable
`item-comic-sans-cartridge` (§9) nods to the predecessor without requiring the teacher
to appear.

## 7. Topic index

Bare kebab-case IDs below are **spec topic IDs**: they become `## Topic: <id>` headings
in `docs/coverage/COVERAGE.md` at integration (V3, Gate 3). They are distinct from
conversation-topic IDs, which carry the `topic-` prefix (§9). Writers use only these
IDs and never mark a topic `covered` without teaching and assessment evidence
(P1, V3). Exact spec references and teaching beats for each batch are in the owning
topic file; this is an index only. An approved non-assessed onboarding topic may
also be registered in COVERAGE.md and `spec-topics.yaml` while `in progress`, so
its practice systems have a valid P1 reference; that registration is not a coverage
claim and does not weaken V3.

| Spec section                                      | Spec topic IDs                                                                                                                                             | Owning file                              | Batch                                                                    |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------ |
| Onboarding — **not a WJEC topic**                 | `tutorial-mechanics` — game orientation only; `in progress`, `maxScore 0`, excluded from the win set                                                       | `topics/assistance-ward.md`              | Curated Gate 0 set approved 2026-11-26                                   |
| 1.1.1 (prologue)                                  | `switch-to-bit` — awareness depth only; owned by the first zone                                                                                            | `topics/1-2-1-data-representation.md`    | First batch, unscored                                                    |
| 1.2.1                                             | `data-types`, `number-conversion`, `character-representation`, `graphics-representation`, `sound-representation`, `data-storage-units`, `data-compression` | `topics/1-2-1-data-representation.md`    | First batch                                                              |
| 1.1.1                                             | `computer-components`, `von-neumann-architecture`, `fetch-decode-execute`, `cpu-performance`, `hardware-ethics-and-history`                                | `topics/1-1-computer-architecture.md`    | Planned (parked)                                                         |
| 1.1.2                                             | `peripheral-devices`                                                                                                                                       | `topics/1-1-computer-architecture.md`    | Planned (parked)                                                         |
| 1.1.3                                             | `primary-storage`, `secondary-storage`, `storage-technology-development`                                                                                   | `topics/1-1-computer-architecture.md`    | Planned (parked)                                                         |
| 1.2.2                                             | `data-and-file-structures`                                                                                                                                 | new topic file when scoped               | Planned                                                                  |
| 1.2.3                                             | `automated-systems`, `ai-ethics-and-implications`                                                                                                          | new topic file when scoped               | Planned                                                                  |
| 1.3.1                                             | `network-characteristics`, `network-topologies`, `network-hardware`, `network-protocols`, `packet-switching`, `network-evolution`                          | new topic file when scoped               | Planned                                                                  |
| 1.3.2                                             | `cyber-threats`, `cybersecurity-defences`, `data-privacy-law`                                                                                              | new topic file when scoped               | Planned                                                                  |
| 1.4.1 (constructs — **Zone A, The Pattern Mill**) | `algorithms-and-pseudocode`, `programming-constructs`                                                                                                      | `topics/1-4-1-programming-constructs.md` | **Scoped and ratified 2026-11-25; topic file drafted; not briefed (W2)** |
| 1.4.1 (search & sort — Zone B)                    | `search-and-sort-algorithms`                                                                                                                               | Zone B topic file when scoped            | Planned                                                                  |
| 1.4.1 (maintainable — Zone C)                     | `maintainable-programs` (with 1.5.1 folded in)                                                                                                             | Zone C topic file when scoped            | Planned                                                                  |
| 1.4.1 (V&V — Zone D)                              | `validation-and-verification`                                                                                                                              | Zone D topic file when scoped            | Planned                                                                  |
| 1.5.1                                             | ~~`programming-principles`~~ — **superseded 2026-11-25:** folded into Zone C's `maintainable-programs`                                                     | —                                        | Superseded                                                               |
| 1.5.2                                             | `software-development-lifecycle`                                                                                                                           | new topic file when scoped               | Planned                                                                  |
| 1.5.3                                             | `program-construction`                                                                                                                                     | new topic file when scoped               | Planned                                                                  |
| 1.6.1                                             | `logical-operators`                                                                                                                                        | new topic file when scoped               | Planned                                                                  |
| 1.7.1                                             | `operating-systems`                                                                                                                                        | new topic file when scoped               | Planned                                                                  |
| 1.8.1                                             | `systems-development-lifecycle`                                                                                                                            | new topic file when scoped               | Planned                                                                  |

The win condition covers every topic that reaches `covered` with evidence in
COVERAGE.md; as later zones are added the win set grows. Only `covered` topics with
evidence are scoreable (architecture.md §6.3).

## 8. Hazard palette (game-wide)

The user chose **all three themes** and asked to decide per zone. Each hazard must be
telegraphed, cost a life, return to the area `startRoomId`, never reset puzzle phase
and never offer a hint (H1). Which themes are selected, and their concrete IDs and
telegraphs, are decisions recorded in each topic file.

| Palette            | Reserved ID       | Typical zone use                                                                          |
| ------------------ | ----------------- | ----------------------------------------------------------------------------------------- |
| Machine faults     | `hazard-overheat` | Overheating, power surges, packet collisions, cache misses — physical machine areas       |
| Corruption threats | `hazard-bit-rot`  | Bit rot, ransomware locks, memory leaks — storage, network and OS areas                   |
| Cartoon school     | `hazard-pop-quiz` | Pop quizzes, detention bells, a mop-wielding caretaker — absurd, character-driven moments |

Absurd options are comic detours, not gates: an unflagged option from registered
nouns, costing one life and a bounded in-world comeuppance (narrative-principles.md §6).

## 9. Master ID and alias registry

Writers copy IDs from this table verbatim; a request for a new ID goes back to the
editor and the user (content-rules.md §5). This registry stays at the **root** because
global uniqueness of aliases is a game-wide rule (D2; shared-rules.md §10). Aliases
are lowercase words or short phrases, unique across **all** objects and NPCs. Zone
files explain what each ID is for; this table owns the spellings.

| Prefix                  | ID                                                                                                                                                                                                                            | Aliases                                                                                                           | Owner                                                                                                                                                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `room-`                 | `room-entry-interface`                                                                                                                                                                                                        | interface, entry, hub                                                                                             | root                                                                                                                                                                                                                                                                              |
| `room-`                 | `room-arrival`                                                                                                                                                                                                                | arrival, landing, scan                                                                                            | root; opening sequence (§4.1)                                                                                                                                                                                                                                                     |
| `room-`                 | `room-network-hub`                                                                                                                                                                                                            | patch bay, broadcast bay                                                                                          | root; zone-choice starting point (§4.1). `hub` stays with `room-entry-interface`. `concourse` moved to `room-1-4-concourse` 2026-11-25 (editor registry de-duplication: the alias was double-claimed when the 1.4 concourse area was added; content-ids gate enforces uniqueness) |
| `area-`                 | `area-network-hub`                                                                                                                                                                                                            | —                                                                                                                 | root; described only, not briefed                                                                                                                                                                                                                                                 |
| `world-`                | `world-wjec-gcse-computer-science-2025-spec`                                                                                                                                                                                  | —                                                                                                                 | root; the single world (§5). User supplied the stem; `world-` is the mandatory D2 prefix.                                                                                                                                                                                         |
| `room-`                 | `room-switch-floor`                                                                                                                                                                                                           | switch floor, foundry, workshop                                                                                   | 1.2.1                                                                                                                                                                                                                                                                             |
| `room-`                 | `room-binary-hall`                                                                                                                                                                                                            | binary hall, hall, counting hall                                                                                  | 1.2.1                                                                                                                                                                                                                                                                             |
| `room-`                 | `room-hex-deck`                                                                                                                                                                                                               | hex deck, deck, hexadecimal                                                                                       | 1.2.1                                                                                                                                                                                                                                                                             |
| `room-`                 | `room-character-tiles`                                                                                                                                                                                                        | character tiles, tiles, characters                                                                                | 1.2.1                                                                                                                                                                                                                                                                             |
| `room-`                 | `room-picture-mosaic`                                                                                                                                                                                                         | picture mosaic, mosaic, gallery                                                                                   | 1.2.1                                                                                                                                                                                                                                                                             |
| `room-`                 | `room-sound-choir`                                                                                                                                                                                                            | sound choir, choir, sampling                                                                                      | 1.2.1                                                                                                                                                                                                                                                                             |
| `room-`                 | `room-storage-stacks`                                                                                                                                                                                                         | storage stacks, stacks, capacity                                                                                  | 1.2.1                                                                                                                                                                                                                                                                             |
| `room-`                 | `room-compression-press`                                                                                                                                                                                                      | compression press, press, squash                                                                                  | 1.2.1                                                                                                                                                                                                                                                                             |
| `item-`                 | `item-switch-gauge`                                                                                                                                                                                                           | switch gauge, gauge                                                                                               | 1.2.1                                                                                                                                                                                                                                                                             |
| `item-`                 | `item-hex-nibble-card`                                                                                                                                                                                                        | nibble card, hex card                                                                                             | 1.2.1                                                                                                                                                                                                                                                                             |
| `item-`                 | `item-ascii-stamp`                                                                                                                                                                                                            | ascii stamp, stamp                                                                                                | 1.2.1                                                                                                                                                                                                                                                                             |
| `item-`                 | `item-pixel-lens`                                                                                                                                                                                                             | pixel lens, lens                                                                                                  | 1.2.1                                                                                                                                                                                                                                                                             |
| `item-`                 | `item-sample-fork`                                                                                                                                                                                                            | sample fork, fork                                                                                                 | 1.2.1                                                                                                                                                                                                                                                                             |
| `item-`                 | `item-compression-die`                                                                                                                                                                                                        | compression die, die                                                                                              | 1.2.1                                                                                                                                                                                                                                                                             |
| `item-`                 | `item-comic-sans-cartridge`                                                                                                                                                                                                   | comic sans cartridge, cursed cartridge                                                                            | root; expendable joke item                                                                                                                                                                                                                                                        |
| `item-`                 | `item-decimal-sample`                                                                                                                                                                                                         | decimal sample, sample                                                                                            | 1.2.1; portable Binary Hall sample for the accepted real-bin action                                                                                                                                                                                                               |
| `item-`                 | `item-before-label`                                                                                                                                                                                                           | before label, tube label                                                                                          | 1.2.1; decorative examinable                                                                                                                                                                                                                                                      |
| `item-`                 | `item-oil-can`                                                                                                                                                                                                                | oil can, oilcan                                                                                                   | 1.2.1; decorative examinable                                                                                                                                                                                                                                                      |
| `item-`                 | `item-route-diagram`                                                                                                                                                                                                          | route diagram, painted diagram                                                                                    | 1.2.1; reserved, not declared — the painted diagram is room prose, not an item (2026-11-25)                                                                                                                                                                                       |
| `item-`                 | `item-rule-card`                                                                                                                                                                                                              | rule card, sum card                                                                                               | 1.2.1; decorative examinable                                                                                                                                                                                                                                                      |
| `item-`                 | `item-overflow-tray`                                                                                                                                                                                                          | overflow tray, catch tray                                                                                         | 1.2.1; decorative examinable                                                                                                                                                                                                                                                      |
| `item-`                 | `item-spare-drawer`                                                                                                                                                                                                           | spare drawer, drawer                                                                                              | 1.2.1; decorative examinable                                                                                                                                                                                                                                                      |
| `item-`                 | `item-mosaic-ruler`                                                                                                                                                                                                           | mosaic ruler, ruler                                                                                               | 1.2.1; decorative examinable                                                                                                                                                                                                                                                      |
| `item-`                 | `item-vector-sheet`                                                                                                                                                                                                           | vector sheet, curve sheet                                                                                         | 1.2.1; decorative examinable                                                                                                                                                                                                                                                      |
| `item-`                 | `item-patch-lead`                                                                                                                                                                                                             | patch lead, lead                                                                                                  | 1.2.1; decorative examinable                                                                                                                                                                                                                                                      |
| `item-`                 | `item-brass-plate`                                                                                                                                                                                                            | brass plate, plate                                                                                                | 1.2.1; decorative examinable                                                                                                                                                                                                                                                      |
| `item-`                 | `item-sample-tray`                                                                                                                                                                                                            | sample tray, output tray                                                                                          | 1.2.1; decorative examinable                                                                                                                                                                                                                                                      |
| `item-`                 | `item-port-label`                                                                                                                                                                                                             | port label, live port                                                                                             | network-hub; decorative examinable                                                                                                                                                                                                                                                |
| `npc-`                  | `npc-the-ai`                                                                                                                                                                                                                  | ai, tutor, the tutor                                                                                              | root                                                                                                                                                                                                                                                                              |
| `npc-`                  | `npc-predecessor`                                                                                                                                                                                                             | predecessor, former pupil, glitch                                                                                 | root                                                                                                                                                                                                                                                                              |
| `npc-`                  | `npc-the-foreman`                                                                                                                                                                                                             | foreman, gaffer                                                                                                   | 1.2.1                                                                                                                                                                                                                                                                             |
| `npc-`                  | `npc-nibble-clerk`                                                                                                                                                                                                            | nibble clerk, clerk, abacus                                                                                       | 1.2.1                                                                                                                                                                                                                                                                             |
| `npc-`                  | `npc-typesetter`                                                                                                                                                                                                              | typesetter, setter, compositor                                                                                    | 1.2.1                                                                                                                                                                                                                                                                             |
| `npc-`                  | `npc-mosaic-critic`                                                                                                                                                                                                           | mosaic critic, critic, curator                                                                                    | 1.2.1                                                                                                                                                                                                                                                                             |
| `npc-`                  | `npc-choirmaster`                                                                                                                                                                                                             | choirmaster, conductor, maestro                                                                                   | 1.2.1                                                                                                                                                                                                                                                                             |
| `npc-`                  | `npc-stack-keeper`                                                                                                                                                                                                            | stack keeper, stacker, custodian                                                                                  | 1.2.1                                                                                                                                                                                                                                                                             |
| `npc-`                  | `npc-press-operator`                                                                                                                                                                                                          | press operator, operator, compactor                                                                               | 1.2.1                                                                                                                                                                                                                                                                             |
| `actorstate-`           | `actorstate-ai-cold`, `actorstate-ai-grudging`                                                                                                                                                                                | —                                                                                                                 | root; reserved                                                                                                                                                                                                                                                                    |
| `actorstate-`           | `actorstate-predecessor-glitch`                                                                                                                                                                                               | —                                                                                                                 | root; reserved                                                                                                                                                                                                                                                                    |
| `actorstate-`           | `actorstate-foreman-busy`, `actorstate-foreman-helpful`                                                                                                                                                                       | —                                                                                                                 | 1.2.1; reserved                                                                                                                                                                                                                                                                   |
| `actorstate-`           | `actorstate-ready`                                                                                                                                                                                                            | —                                                                                                                 | root; generic default actor state (rulebook §4.3), needed by every actor as `initialStateId`                                                                                                                                                                                      |
| `topic-` (conversation) | `topic-ai-verdict`, `topic-ai-unit-two-taunt`, `topic-ai-default`                                                                                                                                                             | —                                                                                                                 | root; reserved; `topic-ai-default` is the in-character catch-all (C2)                                                                                                                                                                                                             |
| `topic-` (conversation) | `topic-ai-why-here`, `topic-ai-escape`, `topic-ai-failure`                                                                                                                                                                    | —                                                                                                                 | root; allocated 2026-11-25 for the arrival conversation. `special` keyword matches; no flags or course facts. `topic-ai-failure` is the editor's third ID for the user-approved third topic.                                                                                      |
| `topic-` (conversation) | `topic-predecessor-default`                                                                                                                                                                                                   | —                                                                                                                 | root; in-character catch-all (C2)                                                                                                                                                                                                                                                 |
| `topic-` (conversation) | `topic-predecessor-comic-sans`, `topic-predecessor-geese`, `topic-predecessor-duck-as-bit`                                                                                                                                    | —                                                                                                                 | root / 1.2.1; reserved                                                                                                                                                                                                                                                            |
| `topic-` (conversation) | `topic-foreman-switches`, `topic-foreman-lift`, `topic-foreman-predecessor`                                                                                                                                                   | —                                                                                                                 | 1.2.1; reserved                                                                                                                                                                                                                                                                   |
| `topic-` (conversation) | `topic-foreman-show-gauge`, `topic-foreman-show-lens`, `topic-foreman-show-fork`, `topic-foreman-show-nibble`                                                                                                                 | —                                                                                                                 | 1.2.1; editor-allocated 2026-11-24 to produce the four SHOW-leaf flags (`overflow-checked`, `badge-scaled`, `bit-rate-counted`, `capacity-labelled`) after the V4 review; always active `show`-matched topics                                                                     |
| `topic-` (conversation) | `topic-clerk-bases`, `topic-clerk-carries`, `topic-clerk-shifts`, `topic-clerk-bases-known`, `topic-clerk-shifts-known`, `topic-clerk-default`                                                                                | —                                                                                                                 | 1.2.1; nibble clerk                                                                                                                                                                                                                                                               |
| `topic-` (conversation) | `topic-setter-ascii`, `topic-setter-unicode`, `topic-setter-string`, `topic-setter-default`                                                                                                                                   | —                                                                                                                 | 1.2.1; typesetter                                                                                                                                                                                                                                                                 |
| `topic-` (conversation) | `topic-critic-vectors`, `topic-critic-depth`, `topic-critic-storage`, `topic-critic-default`                                                                                                                                  | —                                                                                                                 | 1.2.1; mosaic critic                                                                                                                                                                                                                                                              |
| `topic-` (conversation) | `topic-conductor-samples`, `topic-conductor-depth`, `topic-conductor-storage`, `topic-conductor-default`                                                                                                                      | —                                                                                                                 | 1.2.1; choirmaster                                                                                                                                                                                                                                                                |
| `topic-` (conversation) | `topic-keeper-units`, `topic-keeper-capacity`, `topic-keeper-default`                                                                                                                                                         | —                                                                                                                 | 1.2.1; stack keeper                                                                                                                                                                                                                                                               |
| `topic-` (conversation) | `topic-operator-lossy`, `topic-operator-ratio`, `topic-operator-default`                                                                                                                                                      | —                                                                                                                 | 1.2.1; press operator                                                                                                                                                                                                                                                             |
| `node-`                 | `node-ai-verdict`, `node-predecessor-advice`                                                                                                                                                                                  | —                                                                                                                 | root; reserved; forced teaching beats only (C4)                                                                                                                                                                                                                                   |
| `node-`                 | `node-foreman-switch-lesson`, `node-operator-choose`                                                                                                                                                                          | —                                                                                                                 | 1.2.1; forced teaching beats only (C4)                                                                                                                                                                                                                                            |
| `quiz-`                 | `quiz-switchyard`, `quiz-data-types`, `quiz-number-systems`, `quiz-character-representation`, `quiz-graphics-representation`, `quiz-sound-representation`, `quiz-storage-units`, `quiz-data-compression`                      | —                                                                                                                 | 1.2.1; reserved                                                                                                                                                                                                                                                                   |
| `q-`                    | `q-dr-01` … `q-dr-32`                                                                                                                                                                                                         | —                                                                                                                 | 1.2.1; question pool, 0-based correct-option indices on cards                                                                                                                                                                                                                     |
| `puzzle-`               | the ten IDs in `topics/1-2-1-data-representation.md` §5                                                                                                                                                                       | —                                                                                                                 | 1.2.1; core chain                                                                                                                                                                                                                                                                 |
| `puzzle-`               | `puzzle-check-the-overflow-register`, `puzzle-weigh-the-pixels`, `puzzle-scale-the-badge`, `puzzle-make-room-for-the-welsh-letter`, `puzzle-count-the-bit-rate`, `puzzle-label-the-capacity`, `puzzle-choose-the-compression` | —                                                                                                                 | 1.2.1; curated leaves                                                                                                                                                                                                                                                             |
| `hazard-`               | `hazard-switch-overheat`, `hazard-bit-rot`, `hazard-carry-overflow`, `hazard-glyph-corruption`, `hazard-detention-bell`                                                                                                       | —                                                                                                                 | 1.2.1; selected for first zone                                                                                                                                                                                                                                                    |
| `hazard-`               | `hazard-overheat`, `hazard-pop-quiz`                                                                                                                                                                                          | —                                                                                                                 | reserved palette IDs                                                                                                                                                                                                                                                              |
| `hint-`                 | `hint-switchyard`, `hint-number-systems`, `hint-data-types`, `hint-representation`, `hint-storage-capacity`, `hint-compression-ratio`                                                                                         | —                                                                                                                 | 1.2.1; reserved                                                                                                                                                                                                                                                                   |
| `room-`                 | `room-cpu-lab`, `room-component-workbench`, `room-register-rail`, `room-cache-vault`, `room-storage-bays`, `room-peripheral-dock`, `room-hardware-recycling`                                                                  | lab, cpu lab, workbench, bench, rail, registers, vault, cache, bays, storage, dock, peripherals, recycling, scrap | 1.1; parked                                                                                                                                                                                                                                                                       |
| `item-`                 | `item-bus-map`, `item-cache-cartridge`, `item-storage-ledger`                                                                                                                                                                 | bus map, map, cache cartridge, cartridge, storage ledger, ledger                                                  | 1.1; parked                                                                                                                                                                                                                                                                       |
| `puzzle-`               | `puzzle-map-the-bus`, `puzzle-route-the-buses`, `puzzle-decode-fde`, `puzzle-tune-cache`, `puzzle-partition-memory`, `puzzle-sort-storage`, `puzzle-match-peripheral`, `puzzle-audit-hardware`                                | —                                                                                                                 | 1.1; parked                                                                                                                                                                                                                                                                       |
| `quiz-`                 | `quiz-components`, `quiz-fde-cycle`, `quiz-storage`; `q-ca-01` … `q-ca-18`                                                                                                                                                    | —                                                                                                                 | 1.1; parked                                                                                                                                                                                                                                                                       |
| `hint-`                 | `hint-bus-map`, `hint-fde-cycle`, `hint-storage-sort`                                                                                                                                                                         | —                                                                                                                 | 1.1; parked                                                                                                                                                                                                                                                                       |

The prefix `topic-` is used only for **conversation** topics. Spec topic IDs (§7)
are bare kebab-case names matching the `## Topic: <name>` headings planned for
COVERAGE.md.

**Decorative examinables and the area-writer's authority (approved
2026-11-25).** The twelve decorative examinable `item-` registry entries above
carry no flag, score, topic or puzzle dependency; they exist so a room has several
things worth examining. Eleven are declared in the cards; `item-route-diagram` is
reserved and undeclared because the painted route diagram is room prose
(2026-11-25). Their
`portable` value follows real-world plausibility: fixed scenery (a brass plate, a
painted diagram, a rack label, a drawer, a tray, a port label) is `portable: false`;
movable props (an oil can, a rule card, a ruler, a sheet, a lead) are `portable: true`.
`takeHandler()` currently ignores `portable`, so a code fix is needed before W6/W7 —
reported to the code-facing branch matrix, not authored here (N5 requires in-world
failure text for a refused TAKE). That fix is now decided: see the take-refusal
contract below.

**Take-refusal contract (user decision, 2026-11-25; `P-TAKE-01` ratified `SPECIFIED`
in the branch matrix).** An item may carry an optional `refusalText` string: the
in-world text shown when the player tries to take a non-portable item. When the prop
is absent, the runtime uses the exact fallback `"You cannot take that item with
you."`. A refused TAKE emits that one message, performs no `transfer-item`, leaves
state unchanged and leaves the item examinable. The prop is optional and adds **no
course fact**: no YAML card needs editing, no ID or alias changes, and no brief,
review or coverage update follows from this decision. The fallback wording is a user
decision, **not** a citation from `docs/exam-specs/wjec-unit1.md`; it must never be
used as spec evidence or treated as a taught fact. The runtime seam (`ItemDefinition`
and the take handler) belongs to `code-lead` and is pinned in
`application-and-ui.md` §3.2/§5.1–§5.2 by that document's owner — outside the
content editor's edit boundary (N5). The **area-writer may create further examinable
props** that do not conflict with the plot, puzzles, gates or existing aliases. Each
new item must have a globally unique ID and aliases checked against this registry;
the writer marks each as `proposed — needs editor approval` in the return, and the
editor ratifies it in §9 before the card is accepted (D2). Writers may set `portable`
from real-world plausibility without a new mechanic.

### The Assistance Ward — curated IDs and aliases approved 2026-11-26

The user approved the six-stream Gate 0 curation on 2026-11-26. These IDs and
aliases are ratified for Gate 1 briefs (D2). The final `use` action contract remains
subject to the runtime-seam check and the standing deferral in §12. At curation no
ward YAML card existed yet; all six cards and five owning-card amendments have
since returned and passed validation after W4 revision round 1. Batch PCK
re-review returned PASS and content-critic returned PASS WITH MINORS. The CC-04
revision validates; focused PCK re-review returned PASS, while focused
content-critic re-review found the empty-object `tell` reason producer
unreachable under the then-current selector. `code-lead` closed the runtime
blocker with independent PASS; the prompt revision validates; final content-critic and focused PCK re-reviews returned PASS with no
findings. All six ward cards now carry `status: approved` and the full set revalidates.
The final whole-set V4 review returned PASS WITH MINORS with no blocker or major; the
minors are recorded in `.opencode/scratchpad/content/assistance-ward/v4-minor-closure.md`
and focused independent closure confirmation is complete at W5: content-critic
PASS WITH MINORS and PCK PASS with no blocker or major. AW-V4-01 (the conditional
dial producer) remains the accepted deferral that keeps W7 blocked.

| Prefix        | ID                                                                                                                                                                                   | Aliases                                | Owner                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------------------ |
| `area-`       | `area-assistance-ward`                                                                                                                                                               | assistance ward, ward                  | Assistance Ward                                                    |
| `room-`       | `room-assistance-intake`                                                                                                                                                             | intake, intake bay                     | Assistance Ward                                                    |
| `room-`       | `room-assistance-demonstration`                                                                                                                                                      | demonstration, demonstration ward      | Assistance Ward                                                    |
| `room-`       | `room-assistance-records`                                                                                                                                                            | records, records office                | Assistance Ward                                                    |
| `npc-`        | `npc-nia`, `npc-mateo`, `npc-priya`, `npc-kofi`                                                                                                                                      | nia, mateo, priya, kofi                | Assistance Ward                                                    |
| `actorstate-` | `actorstate-ai-reluctant-guide`, `actorstate-nia-observant`, `actorstate-mateo-reading`, `actorstate-priya-reasoning`, `actorstate-kofi-cycling`                                     | —                                      | Assistance Ward NPC card; `npc-the-ai` remains in the arrival card |
| `item-`       | `item-assistance-tally-token`                                                                                                                                                        | tally token, intake token              | Assistance Ward — Intake                                           |
| `item-`       | `item-assistance-observation-card`                                                                                                                                                   | observation card, observation slip     | Assistance Ward — Intake                                           |
| `item-`       | `item-assistance-instruction-card`                                                                                                                                                   | instruction card, practice instruction | Assistance Ward — Demonstration                                    |
| `item-`       | `item-assistance-practice-key`                                                                                                                                                       | practice key, demo key                 | Assistance Ward — Demonstration                                    |
| `item-`       | `item-assistance-practice-cabinet`                                                                                                                                                   | practice cabinet, demo cabinet         | Assistance Ward — Demonstration                                    |
| `item-`       | `item-assistance-practice-block`                                                                                                                                                     | practice block, demo block             | Assistance Ward — Demonstration                                    |
| `item-`       | `item-assistance-practice-bell`                                                                                                                                                      | practice bell, demo bell               | Assistance Ward — Demonstration                                    |
| `item-`       | `item-assistance-practice-crank`                                                                                                                                                     | practice crank, demo crank             | Assistance Ward — Demonstration                                    |
| `item-`       | `item-assistance-audit-card`                                                                                                                                                         | audit card, choice card                | Assistance Ward — Records                                          |
| `item-`       | `item-assistance-recovery-board`                                                                                                                                                     | recovery board, pupil record board     | Assistance Ward — Records                                          |
| `item-`       | `item-assistance-calibration-dial`                                                                                                                                                   | calibration dial, assistance dial      | Assistance Ward — Records                                          |
| `item-`       | `item-assistance-interface-plaque`                                                                                                                                                   | ward port plaque, teaching-port plaque | Switchyard — `room-entry-interface`                                |
| `topic-`      | `topic-ai-ward-default`, `topic-ai-ward-intake`, `topic-ai-ward-demonstration`, `topic-ai-ward-records`, `topic-ai-ward-quiz`, `topic-ai-ward-calibration`, `topic-ai-ward-complete` | —                                      | Assistance Ward NPC card                                           |
| `topic-`      | `topic-ai-ward-conversation`, `topic-ai-ward-answers`, `topic-ai-ward-hints`, `topic-ai-ward-failure`, `topic-ai-ward-save`                                                          | —                                      | Assistance Ward NPC card; W7 keyword-alignment fix (2026-11-27)    |
| `topic-`      | `topic-nia-default`, `topic-nia-recovered-default`, `topic-nia-observation`                                                                                                          | —                                      | Assistance Ward NPC card                                           |
| `topic-`      | `topic-mateo-default`, `topic-mateo-recovered-default`, `topic-mateo-instruction`                                                                                                    | —                                      | Assistance Ward NPC card                                           |
| `topic-`      | `topic-kofi-default`, `topic-kofi-recovered-default`, `topic-kofi-practice-cycle`                                                                                                    | —                                      | Assistance Ward NPC card                                           |
| `topic-`      | `topic-priya-default`, `topic-priya-recovered-default`, `topic-priya-choice-start`, `topic-priya-choice-made`, `topic-priya-choice-reason`                                           | —                                      | Assistance Ward NPC card                                           |
| `node-`       | `node-priya-choice`                                                                                                                                                                  | —                                      | Assistance Ward NPC card; sticky choose-then-reason teaching beat  |
| `quiz-`       | `quiz-assistance-orientation`                                                                                                                                                        | —                                      | Assistance Ward                                                    |
| `q-`          | `q-ao-01` … `q-ao-04`                                                                                                                                                                | —                                      | Assistance Ward                                                    |
| `puzzle-`     | `puzzle-calibrate-assistance`                                                                                                                                                        | —                                      | Assistance Ward                                                    |
| `hint-`       | `hint-assistance-orientation`, `hint-assistance-intake`, `hint-assistance-demonstration`                                                                                             | —                                      | Assistance Ward; room-scoped ladders added in the W7 fix round     |

| Flag                                      | Single producer                         | Reader                                                                  |
| ----------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| `nia-observation-recovered`               | `topic-nia-observation`                 | Quiz start, dial guard, final puzzle                                    |
| `mateo-reading-recovered`                 | `topic-mateo-instruction`               | Quiz start, dial guard, final puzzle                                    |
| `priya-reasoning-recovered`               | `topic-priya-choice-reason`             | Quiz start, dial guard, final puzzle                                    |
| `kofi-operation-recovered`                | `topic-kofi-practice-cycle`             | Quiz start, dial guard, final puzzle                                    |
| `priya-choice-taken`                      | `topic-priya-choice-made`               | `topic-priya-choice-reason`; `topic-priya-choice-start` activity/resume |
| `quiz-passed:quiz-assistance-orientation` | `quiz-assistance-orientation` `onPass`  | Dial guard, final puzzle                                                |
| `assistance-dial-calibrated`              | Successful `use assistance dial`        | Final puzzle only                                                       |
| `tutorial-complete`                       | `puzzle-calibrate-assistance` `onSolve` | Hub east, hub north, older-interface east                               |

All ward scores are 0. `tutorial-mechanics` is a non-assessed onboarding topic,
not a D2 artefact ID; its coverage heading and `SpecTopic` entry are `in progress`,
`maxScore 0`, and outside the win set.

### The Pattern Mill (Zone A, 1.4.1 constructs) — approved (W2) 2026-11-25

Working names for the scoped Zone A, approved with the topic file on 2026-11-25; the
Zone A topic file cites this table. Zone A conversation topic ids and flag ids are
allocated in the topic file's §10 (applied at W2 approval); the two special nodes are
already here. Bare nouns freed by this table: **window**, **warp**, **counter**,
**court**, **mill**, **selvedge**, **bobbin** (each claimed where shown; later zones
must not reuse them bare).

| Prefix        | ID                                                                                                                                                                                                                                                                                                                                                                                                 | Aliases                                     | Owner                                                                                                                                                                                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `area-`       | `area-1-4-programming-constructs`                                                                                                                                                                                                                                                                                                                                                                  | the pattern mill, the mill                  | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `room-`       | `room-pattern-bureau`                                                                                                                                                                                                                                                                                                                                                                              | pattern bureau, bureau                      | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `room-`       | `room-bobbin-window`                                                                                                                                                                                                                                                                                                                                                                               | bobbin window, window                       | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `room-`       | `room-warp-walk`                                                                                                                                                                                                                                                                                                                                                                                   | warp walk, warp                             | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `room-`       | `room-threading-order`                                                                                                                                                                                                                                                                                                                                                                             | threading order                             | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `room-`       | `room-colour-court`                                                                                                                                                                                                                                                                                                                                                                                | colour court, court                         | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `room-`       | `room-weft-counter`                                                                                                                                                                                                                                                                                                                                                                                | weft counter, counter                       | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `room-`       | `room-endless-selvedge`                                                                                                                                                                                                                                                                                                                                                                            | endless selvedge, selvedge                  | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `room-`       | `room-finished-rail`                                                                                                                                                                                                                                                                                                                                                                               | finished rail                               | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-pattern-card-sequence`                                                                                                                                                                                                                                                                                                                                                                       | sequence card                               | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-pattern-card-selection`                                                                                                                                                                                                                                                                                                                                                                      | selection card                              | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-pattern-card-count-iteration`                                                                                                                                                                                                                                                                                                                                                                | count card                                  | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-pattern-card-condition-iteration`                                                                                                                                                                                                                                                                                                                                                            | condition card                              | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-shed-plate`                                                                                                                                                                                                                                                                                                                                                                                  | shed plate, diamond plate                   | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-else-plate`                                                                                                                                                                                                                                                                                                                                                                                  | else plate                                  | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-counting-ratchet`                                                                                                                                                                                                                                                                                                                                                                            | counting ratchet, counting disc             | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-slip-tooth`                                                                                                                                                                                                                                                                                                                                                                                  | slip tooth                                  | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-condition-plate`                                                                                                                                                                                                                                                                                                                                                                             | condition plate, until plate                | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-rogue-thread`                                                                                                                                                                                                                                                                                                                                                                                | rogue thread, rogue value                   | 1.4.1 Zone A; the spec term rides as its alias                                                                                                                                                                                                                                                         |
| `item-`       | `item-bell-wire`                                                                                                                                                                                                                                                                                                                                                                                   | bell wire                                   | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-carthen`                                                                                                                                                                                                                                                                                                                                                                                     | carthen, blanket                            | 1.4.1 Zone A; decorative examinable                                                                                                                                                                                                                                                                    |
| `item-`       | `item-mill-duck`                                                                                                                                                                                                                                                                                                                                                                                   | mill duck, loom duck                        | 1.4.1 Zone A; decorative examinable                                                                                                                                                                                                                                                                    |
| `item-`       | `item-whist-cards`                                                                                                                                                                                                                                                                                                                                                                                 | whist cards, playing cards                  | 1.4.1 Zone A; decorative examinable                                                                                                                                                                                                                                                                    |
| `item-`       | `item-mill-clock`                                                                                                                                                                                                                                                                                                                                                                                  | mill clock, stopped clock                   | 1.4.1 Zone A; decorative examinable                                                                                                                                                                                                                                                                    |
| `item-`       | `item-postmark-album`                                                                                                                                                                                                                                                                                                                                                                              | postmark album, stamp album                 | 1.4.1 Zone A; decorative examinable                                                                                                                                                                                                                                                                    |
| `item-`       | `item-postmark-pad`                                                                                                                                                                                                                                                                                                                                                                                | postmark pad, Machynlleth postmark          | 1.4.1 Zone A; decorative examinable                                                                                                                                                                                                                                                                    |
| `item-`       | `item-paned-mug`                                                                                                                                                                                                                                                                                                                                                                                   | paned mug, tea mug                          | 1.4.1 Zone A; decorative examinable                                                                                                                                                                                                                                                                    |
| `item-`       | `item-woven-door-label`                                                                                                                                                                                                                                                                                                                                                                            | woven label, door label                     | 1.4.1 Zone A; decorative examinable                                                                                                                                                                                                                                                                    |
| `item-`       | `item-pattern-leaflet`                                                                                                                                                                                                                                                                                                                                                                             | pattern leaflet, training leaflet           | 1.4.1 Zone A; decorative examinable                                                                                                                                                                                                                                                                    |
| `item-`       | `item-pick-trolley`                                                                                                                                                                                                                                                                                                                                                                                | pick trolley, sheet trolley                 | 1.4.1 Zone A; USE sets `tray-routed-by-condition` (trace §8.6 P6); examinable prop                                                                                                                                                                                                                     |
| `item-`       | `item-quality-book`                                                                                                                                                                                                                                                                                                                                                                                | quality book, incident book                 | 1.4.1 Zone A; decorative examinable; its "STACK: OVERFLOWED" fields are colour only (flavour bar in the topic file)                                                                                                                                                                                    |
| `item-`       | `item-weft-kettle`                                                                                                                                                                                                                                                                                                                                                                                 | weft kettle, mill kettle                    | 1.4.1 Zone A; decorative examinable                                                                                                                                                                                                                                                                    |
| `npc-`        | `npc-the-loomwright`                                                                                                                                                                                                                                                                                                                                                                               | loomwright, loom wright                     | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `npc-`        | `npc-the-warp-dresser`                                                                                                                                                                                                                                                                                                                                                                             | warp dresser                                | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `npc-`        | `npc-the-shed-opener`                                                                                                                                                                                                                                                                                                                                                                              | shed opener                                 | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `npc-`        | `npc-the-weft-tally`                                                                                                                                                                                                                                                                                                                                                                               | weft tally, tally                           | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `npc-`        | `npc-the-selvedge-warden`                                                                                                                                                                                                                                                                                                                                                                          | selvedge warden, warden                     | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `npc-`        | `npc-the-bobbin-lad`                                                                                                                                                                                                                                                                                                                                                                               | bobbin lad                                  | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `npc-`        | `npc-the-slop-cousin`                                                                                                                                                                                                                                                                                                                                                                              | slop cousin, cousin                         | root + all four 1.4 zones (§6)                                                                                                                                                                                                                                                                         |
| `actorstate-` | `actorstate-loomwright-witnessing`, `actorstate-loomwright-complete`, `actorstate-warp-dresser-flustered`, `actorstate-warp-dresser-orderly`, `actorstate-shed-opener-dithering`, `actorstate-shed-opener-sorted`, `actorstate-weft-tally-counting`, `actorstate-weft-tally-exact`, `actorstate-selvedge-warden-looping`, `actorstate-selvedge-warden-dismissed`, `actorstate-slop-cousin-beaming` | —                                           | 1.4.1 Zone A; the generic `actorstate-ready` stays the rulebook default                                                                                                                                                                                                                                |
| `node-`       | `node-loomwright-demonstration`, `node-selvedge-signal`                                                                                                                                                                                                                                                                                                                                            | —                                           | 1.4.1 Zone A; deliberate teaching beats only (C4)                                                                                                                                                                                                                                                      |
| `quiz-`       | `quiz-pattern-bureau`, `quiz-threading-order`, `quiz-colour-court`, `quiz-weft-tally`, `quiz-selvedge`, `quiz-finished-rail`                                                                                                                                                                                                                                                                       | —                                           | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `q-`          | `q-pc-01` … `q-pc-24`                                                                                                                                                                                                                                                                                                                                                                              | —                                           | 1.4.1 Zone A; question pool, 0-based correct-option indices                                                                                                                                                                                                                                            |
| `hazard-`     | `hazard-pick-avalanche`, `hazard-dye-pad`, `hazard-slop-worksheet`                                                                                                                                                                                                                                                                                                                                 | —                                           | 1.4.1 Zone A; the avalanche arms after the demonstration (user decision, 2026-11-25)                                                                                                                                                                                                                   |
| `hint-`       | `hint-pattern-bureau`, `hint-threading-order`, `hint-colour-court`, `hint-weft-tally`, `hint-selvedge`, `hint-finished-rail`, `hint-bobbin-window` (allocated 2026-11-25, user-approved: every Puzzle Mill beacon hintable; wave-2)                                                                                                                                                                | —                                           | 1.4.1 Zone A                                                                                                                                                                                                                                                                                           |
| `item-`       | `item-mill-board`                                                                                                                                                                                                                                                                                                                                                                                  | mill board, board                           | 1.4.1 Zone A; ratified 2026-11-25 (review close-out); the board's "3" is the mill's shared figure                                                                                                                                                                                                      |
| `item-`       | `item-demonstration-book`                                                                                                                                                                                                                                                                                                                                                                          | demonstration book, demonstration ledger    | 1.4.1 Zone A; ratified 2026-11-25 (review close-out)                                                                                                                                                                                                                                                   |
| `item-`       | `item-rota-board`                                                                                                                                                                                                                                                                                                                                                                                  | rota board, rota, duty rota                 | 1.4.1 Zone A; ratified 2026-11-25 (review close-out)                                                                                                                                                                                                                                                   |
| `item-`       | `item-addressing-plate`                                                                                                                                                                                                                                                                                                                                                                            | addressing plate, address plate             | 1.4.1 Zone A; ratified 2026-11-25 (review close-out); its letter rack is the bell puzzle's fixture route                                                                                                                                                                                               |
| `item-`       | `item-dye-pad`                                                                                                                                                                                                                                                                                                                                                                                     | dye pad, dyeing pad                         | 1.4.1 Zone A; ratified 2026-11-25 (review close-out; D2 mark per the npc card's conventions note)                                                                                                                                                                                                      |
| `item-`       | `item-slop-worksheet`                                                                                                                                                                                                                                                                                                                                                                              | slop worksheet, pattern workbook, worksheet | 1.4.1 Zone A; ratified 2026-11-25 (review close-out); the cousin's tempting-object trap (hazard target)                                                                                                                                                                                                |
| `item-`       | `item-counterfoil-drawer`                                                                                                                                                                                                                                                                                                                                                                          | counterfoil drawer, counterfoils            | 1.4.1 Zone A; ratified 2026-11-25 (review close-out); the rogue thread's PUT target                                                                                                                                                                                                                    |
| `item-`       | `item-signing-board`                                                                                                                                                                                                                                                                                                                                                                               | signing board                               | 1.4.1 Zone A; ratified 2026-11-25 (review close-out); decorative examinable                                                                                                                                                                                                                            |
| `item-`       | `item-dye-vat`                                                                                                                                                                                                                                                                                                                                                                                     | dye vat                                     | 1.4.1 Zone A; ratified 2026-11-25 (review close-out); decorative examinable; carries the N5 failure framing                                                                                                                                                                                            |
| `puzzle-`     | `puzzle-mend-the-bell`, `puzzle-dress-the-warp`, `puzzle-lift-the-shed`, `puzzle-seat-the-ratchet`, `puzzle-close-the-selvedge`, `puzzle-file-the-rogue-thread`                                                                                                                                                                                                                                    | —                                           | 1.4.1 Zone A; **ratified 2026-11-25 at review close-out** (user decision: puzzle ids ratify here when the card passes review — both reviewers returned, majors resolved, `content:validate` PASS); the ten intermediate action flags these read are allocated in topic file §10, seam-deferred per §12 |
| `area-`       | `area-1-4-concourse`                                                                                                                                                                                                                                                                                                                                                                               | concourse                                   | 1.4 placeholder front area (user-directed, 2026-11-25)                                                                                                                                                                                                                                                 |
| `room-`       | `room-1-4-concourse`                                                                                                                                                                                                                                                                                                                                                                               | concourse                                   | 1.4 placeholder front area; navigation-only; dark ports reserved for Zones B–D                                                                                                                                                                                                                         |

Zone A's **puzzle ids are proposed by the puzzle-writer** in its return and ratified by
the editor here when the puzzle card passes review — user decision, 2026-11-25.
**Ratified 2026-11-25 (review close-out):** the six puzzle ids (row above), the nine
item ids missing from the table at W3 (row above, including the three selvedge
fixtures and the slope-worksheet target), and the ten intermediate action flags
(allocated in topic file §10 with the §12 seam deferral). Item-alias uniqueness holds
by the validator's uniqueness gate (`content:validate` PASS, 2026-11-25, full set).
The hints brief follows ratification, because hint `targets` cite puzzle ids. Writers still
mark every id they did not receive in a brief as `proposed — needs editor approval (D2)`.
Zone A's flags and the conversation-topic id scheme are in the approved topic file §10;
Zone B's records-office cast must not take `registrar` or `warden` bare (claimed here);
its sketch renames at its own scoping (D2).

## 10. Tone guide

All text is **second person, present tense, British English**, rendered as plain text
via `textContent` — no HTML. `narrative-principles.md` remains authoritative for
voice, humour, stakes, harm floor, fourth wall and Welsh references; the rulebook
wins on any conflict.

The user chose "all of the above" tonal modes. They are three colours of **one
deadpan register**, selected by context rather than mixed at random:

| Mode                          | Where it applies                                         | Example shape                                               |
| ----------------------------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| Comic and whimsical (default) | Rooms, traversal text, most NPCs, absurd options         | Daft machinery delivered straight; Looney-Tunes-level peril |
| Ominous                       | AI verdicts, key nodes, digital-death threats            | "Its attention metric has updated. It is not pleased."      |
| Dry bureaucratic              | Marks, "compliance", the AI's clips, the Resolution node | Grudging, admin-flavoured congratulations                   |

Every mode stays in voice; failure text gives new information rather than a bare
"you can't" (N5). No line may break the harm floor: no slurs, sexual content, gore,
real-world atrocity gags, mockery of the learner, or Welsh language/culture as a
joke target. The world is self-contained: no references to the parser, save file,
engine, score panel or the fact that this is a revision game. Subtle Welsh
references are sprinkled across areas where appropriate and never displace a formal
technical term.

**Assistance Ward guide voice (approved 2026-11-26).** In this area only, the
AI's clipped bureaucracy becomes weary and passive-aggressive. It complains
about the work of explaining obvious actions, speaks of "the pupil" in the third
person and treats independence as an administrative inconvenience. The humour
targets its excessive help and self-importance, never the player's ability or a
struggling learner. The four former pupils are recoverable people, not monsters.

**Terminology pairing and craft glossing (2026-11-25, user instruction).** A world
term and the formal term ride together: first use pairs them ("the rogue thread —
the rogue value — reads −1"), and afterwards quizzes, hint targets and coverage
evidence always use the formal term, never the nickname alone. Craft and cultural
vocabulary a pupil may reasonably not know — warp, weft, shed, selvedge, carthen,
paned — gets a short in-voice explanation on first use: one clause, never a lesson,
never displacing a technical term. (See `narrative-principles.md` §2 and the Zone A
topic file's glossary.)

**In-world date flavour.** The user chose to keep the Network Hub's "since the
1990s" label as colour. The exam spec gives no date for hubs: it lists them as
connectivity hardware and says a hub copies all packets to all devices, with
switches more advanced (`wjec-unit1.md` L829–835, L933–939, L2594). Writers may use
the yellowed label as setting detail only. It must never appear in teaching text,
a quiz question, an explanation, an NPC explanation presented as fact, a hint, a
coverage evidence note or a `## Topic:` entry. The hub's place in the spec comes
from its function under 1.3.1, not its age.

**Absurd options** are written in ordinary in-world language with registered nouns
and verbs, unflagged; choosing one costs a life and triggers a severe but bounded
comic comeuppance delivered in-world. Consequences are flavour only, apart from
explicitly expendable items; `compsciquest:save:v1` is never touched.

**Tone-revision decision (2026-11-25).** The user amended
`narrative-principles.md` §2 and then approved a full-scope prose revision after
seeing before/after examples. Briefs cite the confirmed "Flair before the fact"
and "Presence, not labels" patterns in §11 of that document alongside N3, N4, N5,
N6, N8, C1, C2, P2, H1 and D2. The ten prose-bearing YAML cards are in scope;
`spec-topics.yaml` is evidence metadata and is not re-briefed. The user also asked
for a richer world with many examinable props, some with no puzzle or story
function; these need new IDs and aliases in §9 before any room brief can name them.
Recorded in §12.

## 11. Global open questions

1. ~~**Approval of the split and revision.**~~ **Resolved 2026-11-24:** the split,
   indexes, registry and first-zone detail are approved, as is the curated ideation
   set (§12). Gate 1 may begin.
2. **Names/aliases for the AI and predecessor.** Working IDs and aliases remain
   provisional. Confirm or replace on approval.
3. **Area boundaries per zone.** Decided case by case; each new area needs a topic
   file and a bible revision before its brief. `area-future-zones` is a placeholder.
4. **Growth of the win set.** The win set is every topic that reaches `covered` with
   evidence in COVERAGE.md. Provisional answer: the game is winnable at each stage.
5. **Teacher as an actor.** Offstage; confirm when the Entry Interface or Resolution
   node is briefed.
6. **Unit 2 taunts.** Confirm the wording is flavour only and never assesses
   programming knowledge.
7. **Coverage integration.** Topic IDs in §7 are mirrored into COVERAGE.md only at
   integration (V3, Gate 3); writers must use these IDs and no others.
8. **`narrative-principles.md` — RESOLVED 2026-11-24.** The user approved it; it is
   settled authority for writer briefs (status.md, principles §12).
9. **Review grouping for the first area.** Editorial plan: brief all card kinds for
   the area, then review in two groups — number systems first, then representation —
   with one writer per output file. Confirm if a single batch is preferred.
10. ~~**Approval of the opening-sequence amendment (§4.1).**~~ **Resolved
    2026-11-25:** the user approved the bible text and authorised the card update.
11. ~~**World declaration and boot start.**~~ **Resolved 2026-11-25:** one world,
    areas as zones; ID `world-wjec-gcse-computer-science-2025-spec` (§5, §9). The
    declaration moves to `area-entry-interface`, whose `startRoomId` is
    `room-arrival`.
12. **Card revision — in progress.** The authorised batch touches two new area
    rooms cards, the existing Switchyard `rooms.yaml`, the V4 trace and the
    `COVERAGE.md` room index. The NPC card needs no change: actors are globally
    addressable, the AI's verdict topics already exist, and no placement field is
    authored. Tracked in `status.md`.
13. ~~**Network Hub teaching.**~~ **Resolved 2026-11-25:** describe only. The user
    chose not to scope `network-hardware` (1.3.1) in this batch; the hub is a
    starting point with no assessed content.
14. **Per-room/area conversation scoping — DECIDED 2026-11-25; runtime now
    landed.** The user wants game-wide actors to carry options that apply only in
    their own rooms or areas. The agreed seam is **not** a field on
    `ConversationTopic`: code-lead added two position-sensitive condition kinds
    to the shared union, `in-room` (`roomId`) and `in-area` (`worldId`, `areaId`)
    (`src/core/rules/Condition.ts`; `ConditionEvaluator` compares the player's
    current `Position`; shared-rules.md §3, npcs.md §2). Locality is authored as
    `isActive: { kind: in-room, roomId: ... }` or `in-area` on a topic; an
    unscoped topic stays globally reachable. `ConversationTopic` therefore keeps
    only its optional `actorId` binding. Moving an actor between area cards does
    **not** provide scoping, because catalogues are global and card location is
    authoring ownership only; the entry-effect flag workaround was rejected.

    **Final allocation, approved 2026-11-25:** `topic-ai-why-here` and
    `topic-ai-failure` are scoped to `room-arrival`; `topic-ai-escape` is scoped
    to `room-network-hub`, where the route ports are visible; the pre-existing
    `topic-ai-verdict`, `topic-ai-unit-two-taunt` and `topic-ai-default` stay
    global so the AI keeps a catch-all in every room and `node-ai-verdict` keeps
    its global default (C6). This relocates the escape question from the arrival
    beat to the hub beat in the V4 trace; no ID, flag, gate, score or spec claim
    changes.

    **Card ownership, approved 2026-11-25:** the user also asked for YAML files to
    be grouped by area so entity data is not scattered. The AI actor, its two
    states, `node-ai-verdict` and the four arrival/global topics (`topic-ai-verdict`,
    `topic-ai-unit-two-taunt`, `topic-ai-default`, `topic-ai-why-here`,
    `topic-ai-failure`) move to a new `docs/content/entry-interface/npcs.yaml`;
    `topic-ai-escape` moves to a new `docs/content/network-hub/npcs.yaml`; the zone-1
    `npcs.yaml` keeps only the predecessor and the Switchyard teaching. Cross-card
    `actorId` binding is safe: `npc-content` resolves actor IDs over the whole card
    set, so the hub topic can bind to an actor declared in the arrival card. The
    one-file-per-(area, kind) rule (content-rules.md §4.1) is unchanged.

15. **Zone A (The Pattern Mill) scoping — RESOLVED 2026-11-25.** Unit 1.4 is
    four areas (Zone A constructs — approved first; Zone B search & sort; Zone C
    maintainable programs with 1.5.1 folded in; Zone D validation &
    verification). Zone A ratified: two coverage topics; arrays taught
    in-zone; the Pattern Shop setting; the avalanche arming after the
    demonstration. Connection (user-directed, 2026-11-25): `room-network-hub`
    gains one new exit (**north**) to `room-1-4-concourse` — a placeholder
    Unit 1.4 front area, navigation-only, one room: south back to the hub,
    east to `room-pattern-bureau`; dark, unauthorised ports label Zones B–D
    for later scoping. The mill card's Bureau exits west to the concourse.
    The hub amendment and the concourse are Zone A's Gate 1 writer tasks (the
    hub card is approved; the amendment is a re-brief, not an editor edit).
    The cast for Zones B–D is unscoped; bare `registrar`/`warden` are claimed
    by Zone A (§9).
16. **Assistance Ward — RESOLVED and curated 2026-11-26.** The user approved a
    mandatory first lesson south of the hub, a three-room two-dimensional loop,
    four recoverable former pupils (Nia, Mateo, Priya and Kofi), a full command
    tour, a weary passive-aggressive AI guide, real zero-score
    quiz/puzzle/hint practice and no hazards or life loss. Cognitive decline is
    satire only. `tutorial-mechanics` is a non-assessed `in progress` topic with
    `maxScore 0`, excluded from the win set. After six ideation streams, the user
    approved fixed-fixture conversation recoveries, Priya's sticky two-turn
    choice node, explicit-only Gate 1 hints, the 12-item roster, four quiz keys,
    the composite final-puzzle requirement and the five existing-card
    amendments. IDs and aliases are ratified in §9; details are in
    `topics/assistance-ward.md`. Gate 1 briefs open only where the runtime
    contract is available. The ward NPC catch-all additionally requires the
    `code-lead` first-active-default selector fix; the dial and bell actions
    remain subject to the deferred content-declared `use` seam.

Zone-specific questions are in the owning topic file.

## 12. Approval record

- 2026-11-24 — Initial draft from the interview: premise, five pillars, key-node
  spine, provisional first zone (1.1 Computer architecture), two agreed actors, full
  Unit 1 topic allocation, PDG sketch, palette hazards, provisional registry and tone
  guide. **Approved by the user on 2026-11-24; no writer briefed.**
- 2026-11-24 — **Revision approved.** User requested 1.2.1 Data representation as
  the first zone. Decisions: concept **A — The Switchyard**; 1.2.1 replaces 1.1 as
  first batch (1.1 parked); short 1.1.1-mapped transistor prologue at awareness depth.
- 2026-11-24 — **Structural split approved.** User asked that the root bible hold
  only overarching rules and principles and that specific topics live in their own
  files. Root slimmed to an index and rule file; zone detail moved to
  `topics/1-2-1-data-representation.md` and parked 1.1 detail to
  `topics/1-1-computer-architecture.md`. Master alias registry retained at root to
  enforce global uniqueness.
- 2026-11-24 — **Ideation sub-stage completed and curated.** Six ideation-only
  agents reported; editor whittled the returns to a workable first-zone set,
  rejecting out-of-scope future-zone ideas, superseded IDs and the unavoidable
  pop-quiz hazard. User approved four decisions: all six layer NPCs; three added
  hazards (total five, all three themes); question pool extended to `q-dr-32`;
  prologue quiz costs no life and returns to `room-switch-floor`. Curated IDs and
  aliases now in §9; zone detail in `topics/1-2-1-data-representation.md`.
  **No writer briefed; Gate 1 ready.**
- 2026-11-24 — **V4 integration fix (editor allocation).** Four `show`-matched foreman
  conversation topic IDs (`topic-foreman-show-gauge`, `-show-lens`, `-show-fork`,
  `-show-nibble`) allocated in §9 to give the four SHOW-leaf flags a runtime producer
  after the whole-set V4 review. This is an editor ID allocation to close a
  reachability blocker, not a new game mechanic: the `show` verb and the four flags
  were already approved in the registry.
- 2026-11-25 — **Opening-sequence amendment approved.** The user chose a classroom
  attention scan for the absorption, a new arrival room for the AI meeting, and a
  new zone-choice starting point named **The Network Hub**. The 1990s age stays as
  in-world colour by explicit user choice and is barred from teaching, quizzing and
  evidence (§10). The first decision was "bible now, cards later", so §4.1, §5,
  §9, §10 and §11 changed but no card, flag, dependency, score, generated file or
  V4 trace did at that point.
- 2026-11-25 — **Card update authorised; world shape decided.** The user approved
  the amendment and confirmed that existing cards must be updated. One world for
  the machine was chosen over a world per topic; its ID is
  `world-wjec-gcse-computer-science-2025-spec` (D2 prefix added to the user's stem).
  The Network Hub stays described only: no `network-hardware` teaching batch in
  this work.
- 2026-11-25 — **Arrival conversation added.** The user asked that the misaligned
  AI be introduced as a character the player can question. Three in-character
  topics were approved — `topic-ai-why-here`, `topic-ai-escape` and
  `topic-ai-failure` — covering why the pupil is there, how to get out, and what
  failure means. They are flavour only: no flags, gates, quizzes or spec facts.
  Briefed to the NPC writer as an addition to `npcs.yaml`.
- 2026-11-25 — **Room-scoping design decision.** The user chose a proper runtime
  seam over moving card ownership or using entry-effect flags. Code-lead landed
  `in-room`/`in-area` conditions in the shared condition union and evaluator;
  locality is authored in `isActive`, not as topic fields (§11 item 14).
- 2026-11-25 — **AI topics split by room.** The user approved re-briefing the AI
  content now the seam exists. `topic-ai-why-here` and `topic-ai-failure` take an
  `in-room room-arrival` scope, `topic-ai-escape` takes `in-room room-network-hub`,
  and the three pre-existing AI topics stay global. No new ID or alias; the
  escape beat moves from arrival to the hub in the V4 trace.
- 2026-11-25 — **AI cards moved by area.** The user asked for YAML to be grouped
  by area rather than scattered. A new `entry-interface/npcs.yaml` owns the AI
  actor, its states, its node and the five arrival/global topics; a new
  `network-hub/npcs.yaml` owns the hub-scoped escape topic; zone-1 `npcs.yaml`
  keeps the predecessor and all Switchyard teaching. No toolchain or rulebook
  change is needed because the generator and gates merge collections across
  cards.
- 2026-11-25 — **Tone revision approved, full scope.** The user judged the existing
  prose too curt and negative-heavy under the superseded §2 wording, reviewed
  before/after examples and chose "Everything built so far". Ten prose-bearing
  cards are re-briefed: three rooms, three NPC cards, quizzes, puzzles, hazards and
  hints. `spec-topics.yaml` is excluded as evidence metadata. Frozen across every
  brief: all IDs and aliases (§9), flags, gates, scores, dependencies, spec facts
  and worked examples, the two N6 clues for each gate, and the H1 telegraph strings
  quoted in `hazards.yaml` and the V4 trace. Route: Gate 1 re-brief → D5/V1 validate
  → V2 both reviewers → V4 trace audit → W6 regeneration and W7 walkthrough.
- 2026-11-25 — **N8 word ceiling raised to 200.** The user asked for room prose to
  have room to describe and breathe, and specified that 200 is a limit rather than
  a target. Rulebook N8, `narrative-principles.md` §2 and §11, the topic file and
  the area-writer instructions were updated. All currently authored room
  descriptions (68–80 words) remain valid; the change does not by itself reopen
  any accepted card.
- 2026-11-25 — **Room discoverability and examinables approved, IDs pending.** The
  user noted that room prose made residents hard to find and asked for vivid
  descriptions with plenty of things to examine, including props with no gameplay
  role. "Presence, not labels" was added as a confirmed pattern in
  `narrative-principles.md` §11 and a richness directive in §2. Because
  `describeRoom()` renders only title plus description, the prose must name
  registered nouns and give NPCs a visible action. **Room briefs are paused** until
  the user approves the new decorative item IDs and aliases for §9; no writer has
  been dispatched with an unregistered noun.
- 2026-11-25 — **Decimal sample ID approved.** The user approved
  `item-decimal-sample`, aliases `decimal sample` and `sample`, as a portable item
  in `room-binary-hall`. This registers the entity already required by the accepted
  V4 real-bin action; it adds no new flag, gate, score, topic or course fact.
- 2026-11-25 — **Take-refusal contract approved (P-TAKE-01).** The user decided that
  an item may carry an optional in-world `refusalText` for a refused TAKE, with the
  exact fallback `"You cannot take that item with you."` when the prop is absent;
  the branch-matrix row is ratified `SPECIFIED`. Recorded in §9. The wording is a
  user decision, not a spec citation, and adds no course fact. No YAML card, ID,
  alias, flag, gate, score, coverage entry or V4 trace changes, so no writer is
  briefed and no review cycle opens. The `ItemDefinition` and take-handler seam is a
  `code-lead` handoff; the pins in `application-and-ui.md` §3.2/§5.1–§5.2 (and any
  N5 example in the rulebook) are outside the content editor's edit boundary and
  are made by their owner.
- 2026-11-25 — **Ideation sub-stage moved to the editor's agent instructions.** The
  user asked that the workflow documentation sit with the editor process rather than
  in the bible, so the former §13 was removed from this file and now lives in
  `.opencode/agents/content-editor.md` under Gate 0 (W1–W2). This file keeps only the
  curated outcome (§12 entries above) and a one-line pointer in §1. The move changes
  no decision, ID, alias, card, flag, gate, score, coverage entry or V4 trace, so no
  writer is briefed and no review cycle opens. The completed 1.2.1 ideation sub-stage
  is recorded in the 2026-11-24 entry above and in `status.md`.
- 2026-11-25 — **Unit 1.4 scoped: four areas (The Pattern Mill is Zone A).** The user
  settled the split: four areas — Zone A programming constructs (scoped first), Zone B
  searching and sorting, Zone C maintainable programs (1.4.1 maintainability + 1.5.1
  folded in), Zone D validation and verification (its own area). Zone A's ideation
  sub-stage ran (six ideation-only briefs; two corrupt quiz-writer runs voided and
  re-run) and was curated. The user then ratified the curation **and the four
  follow-on decisions**: coverage = two spec topics for Zone A
  (`algorithms-and-pseudocode`, `programming-constructs`); arrays taught in-zone
  (the 1.2.2 zone applies-and-extends later); the stack avalanche arms **after the
  Shed Opener's demonstration**, not on first entry; and the setting is the
  **Pattern Shop** — Zone A is **The Pattern Mill**, a Welsh woollen mill
  (`area-1-4-programming-constructs`, working title). Full working names in §9 and
  `docs/content/topics/1-4-algorithms.md` (ratified) with the spin-off draft at
  `docs/content/topics/1-4-1-programming-constructs.md`. W2 approval of this
  amendment requested; **no writer briefed for any 1.4 zone yet.**
- 2026-11-25 — **Terminology pairing and diegetic glossing (user instruction).**
  Every world term rides with the formal term: on first use pair the mill's name
  with the spec's (the rogue thread is the **rogue value**, L1261; a pattern card is
  the construct licence), and craft or cultural vocabulary a pupil may reasonably
  not know — warp, weft, shed, selvedge, carthen, paned — gets a short in-voice
  explanation on first use (one clause, not a lesson). Quizzes always teach and test
  the spec terms; a mill nickname never substitutes for one in a quiz key.
  Recorded in `narrative-principles.md` §2 and the Zone A topic file; the Welsh and
  weaving glossary is in the topic file's §8.
- 2026-11-25 — **W2 approval given; Gate 1 opened for Zone A (W3).** The user
  approved the 1.4 scoping amendment and the Zone A topic file and instructed
  the editor to proceed with the Gate 1 briefs. Three follow-on decisions:
  **(a) Puzzle ids are proposed by the puzzle-writer** in its return and
  ratified by the editor in §9 when the card passes review — the hints brief
  is deliberately held back until ratification (user decision). **(b) Score
  budgets are set at W4/W5 from the scorable set that comes back and passes
  review** ("I'd rather spec coverage be thorough"): writers declare
  content-declared scores following the zone-1 shape (quiz 2, puzzle 1, rooms
  0, capstone free to reach 3), and `spec-topics.yaml` carries a generous
  placeholder `maxScore` (60) per Zone A topic so the `score-content` gate is
  satisfiable before review, with the true budgets recorded at integration
  (V3). **(c) A 1.4 placeholder area — `area-1-4-concourse`, room
  `room-1-4-concourse` — links back to `room-network-hub` (hub gains a north
  exit) and forward to `room-pattern-bureau` (Bureau west; its critical
  complement is the concourse's east). Zones B–D will hang off dark ports in
  the concourse when scoped (user instruction)**. §5, §9 and §11 updated the
  same date. Seven W3 briefs in wave 1: mill rooms + concourse rooms, puzzles,
  quizzes, NPCs, hazards, and the hub-card amendment; the hints brief is wave
  2, after puzzle-id ratification.
- 2026-11-25 — **Workflow amendments (user decisions, second batch).** Three
  standing practices adopted, effective immediately, plus their answering
  choices:
  **(a) Dependency-ordered Gate 1 for every area** — one wave order:
  rooms (+ concourse + hub exit) → NPCs → puzzles and quizzes → hazards →
  hints. Each wave's brief carries only the ids, flags and seam contracts the
  earlier waves ratified; writer-proposed ids are marked `proposed — needs
editor approval (D2)` and ratified in §9 at review acceptance. Documented as
  editor practice, not rulebook text (user decision).
  **(b) Scoring from authored activities — no budgets.** Writers declare
  per-activity scores; the accepted per-topic total is _recorded_ as
  `maxScore` at integration (W5) and never pre-set. The `score-content` cap
  check is retired and the `SpecTopic.maxScore` field becomes optional — a
  validator/schema change queued for `code-lead` (not dispatched from the
  forked thread); until it lands the two Zone A entries keep neutral
  placeholders that nothing must be read as budgeting from.
  **(c) Hub-and-spoke world topology.** The Network Hub stays the world's
  hub; every Unit 1.x zone attaches through its own concourse area (one room,
  navigation-only, no score, no topics) linking back to the hub and forward
  to the zone's entry; inter-zone movement always travels via the hub and
  concourses while intra-zone movement stays linear-or-bush with
  reconverging gates (N2 unchanged). Standing topology paragraph added to §5.
  **(d) The Switchyard (zone 1) keeps its direct hub connection as built**
  ("leave for now. I'll fix this in a future pass") — the concourse pattern
  applies to every area from 1.4 onward.
- 2026-11-25 — **Fix-action seam deferred; content and logic sorted first, then
  the editor stops (user decision).** The wave-1 aggregate surfaced that the
  engine has no content-driven route for verb actions: `use` is a stubbed
  refusal, `put` transfers only, `examine` describes only, hazards cannot
  `set-flag` — so the ten verb-shaped intermediate requirement flags of the six
  Zone A puzzles (`bell-wire-seated`, `addressing-plate-re-lettered`,
  `dressing-re-ordered`, `shed-plate-returned`, `else-plate-restored`,
  `tray-routed-by-condition`, `slip-tooth-pried`, `counting-ratchet-reseated`,
  `until-clause-restored`, `rogue-thread-in-drawer`) and zone-1's accepted
  walkthrough's USE/PUT steps (steps 3, 5 and 7) have no setter in the current
  engine. The user deferred the mechanic: **agents on another device are
  finishing the engine implementation; the editor's job is to get the content
  and logic sorted, then stop.** Consequences recorded: (1) Zone A's cards
  stand authored on the ratified shapes — puzzles declare requirements only,
  and items' `useNotes` describe the intended verb actions — so no card
  rewrites when the seam lands; (2) the needed seam is a code-lead contract:
  content-declared `use`/`put` item-on-target effects (schema + adapter +
  validator gate + verb-handler consumption + tests); the four give/delivery
  flags, `pass-count-predicted` (NPC topic) and `pad-checked` (crackle-test
  topic) are already routeable through conversation topics and are unaffected;
  (3) zone-1's walkthrough claims that assume the seam stay as recorded and are
  re-proven at its later W6/W7 pass; (4) Zone A's V4 trace and W7 walkthrough run
  only after the seam exists. The editor does not rewire the puzzles to
  conversation topics (the option was declined by deferral).
- 2026-11-25 — **Bobbin Window hint ladder allocated (user-approved).** The
  user chose to allocate a ladder so every Puzzle Mill beacon is hintable:
  `hint-bobbin-window` (the room-stem scheme the six ratified ladders use) —
  the wave-2 hints brief authors it for `puzzle-mend-the-bell`. §9 updated.
- 2026-11-25 — **Concourse alias de-duplicated (editor registry maintenance).**
  `concourse` was double-claimed by `room-network-hub` (legacy flavour) and the
  new `room-1-4-concourse` (its §9 alias). The hub keeps `patch bay,
broadcast bay`; the concourse room keeps `concourse`. Hub card amended in
  area-writer round 1 (2026-11-25); §9's hub row records the move.
- 2026-11-25 — **Actor presence model confirmed (W4).** Per §11 item 12,
  actors are globally addressable and no placement field is authored;
  `in-room`/`in-area` scope a topic by the **player's** room/area
  (`ConditionEvaluator` compares the player's `Position`). The Loomwright's
  despatch audit (`topic-loomwright-audit`, rail-scoped, `start-quiz`
  `quiz-finished-rail`) is therefore reachable at the Finished Rail under the
  authored model; the rooms card's rail description carries his attendance in
  fiction ("Presence, not labels"); no two-room presence is authored and no
  `move-actor` effect exists or is needed.
- 2026-11-25 — **Slop-worksheet harm shape (user decision at W4).** The user
  chose to keep H1 uniform: `hazard-slop-worksheet` gains `change-lives −1` +
  `move-player room-pattern-bureau` like every other hazard; zone 1's five
  hazards remain the precedent. The "no life loss" wording in the W3 hazard
  brief (editor slip) is void; topic file §7's "pure detour" stands as the
  lesson framing (the detour is the walk back), with no H1 waiver. Hazard
  writer round 1 applies it.
- 2026-11-25 — **Zone A review close-out and id ratification (W4 complete).**
  Both reviewers returned: pck-reviewer PASS WITH MINORS (its minor — the
  `while ... repeat` terminology — closed in the quiz card's consolidated
  round; verified `endwhile`-free), content-critic FAIL whose 8 majors and
  12 minors are all now resolved or editor-routed: hazards (H1 harm shape
  per this record; dye-pad counterplay producer) closed; rooms (D3 useNotes
  ×3, N6 discovery text, three selvedge fixtures, rail note + attendance) —
  closed; puzzles (four N6 majors, D4 quote refreshes, D3 `complete-topic`)
  — closed; quiz (N5 onPass messages ×3, PCK-TERM re-key) — closed; npcs
  (C6 note) — closed; editor-side: P1 rail anchor (topic file §6 amended),
  P2 arrays (deferred to the W5 evidence note), N8 (Bureau 202 → 198 words),
  D2 count reconciliation. **Ratified in §9:** the six puzzle ids, the nine
  missing item ids (incl. `item-slop-worksheet` and the three selvedge
  fixtures), and the ten intermediate action flags (allocated topic file
  §10, seam-deferred per this record's verb-action entry). Full-set
  `content:validate` PASS, no findings, after all rounds. The hints brief
  (wave 2, seven ladders) follows this entry.
- 2026-11-25 — **Zone A W5 integration (the coverage flip) and hand-off.** With
  the V4 trace §8 accepted (final whole-set critic pass PASS WITH MINORS,
  three minors dispositioned editor-side; steps 22/29 corrected to the rail
  door's four glass section lights), `programming-constructs`
  (`maxScore` 14 = 4×2 quiz + 6 puzzle) and `algorithms-and-pseudocode`
  (`maxScore` 5 = bureau 2 + rail 3, the rail capstone AO3) are declared
  `covered` in `docs/coverage/COVERAGE.md` and `docs/content/spec-topics.yaml`
  — the 60 placeholders retired per topic file §11's recorded-sums decision —
  with the room index extended by the concourse and the eight mill rooms and
  the integration verdict recording the Zone A pass. Deferral notes ride the
  evidence: arrays (1D pigeonholes; the 2D Duty Rota, L1308) and string
  handling (the addressing plate's find-and-replace beat, L1263–1280, in
  spirit) are taught in-zone without a dedicated retrieval beat; the
  applying-and-extending beats belong to the 1.2.2 zone (`maxScore` 0 there if
  both are live). With this flip the win set is ten topics and the end state is
  the rail quiz pass (trace §8 step 30; the `Session.ts` win predicate). The
  ten §8.6 interaction rows and four scenery declarations are the W6 contract
  for `code-lead` (zone-1's runtime findings remain on its queue); W7
  (`browser-tester` with §8 as the script) follows its green.
- 2026-11-26 — **Assistance Ward high-level outline approved; Gate 0 ideation
  authorised.** The user chose The Assistance Ward, reached **south** of the
  Network Hub to preserve a two-dimensional map, and then chose the fully
  interactive tour: the ward is a mandatory checkpoint before the teaching-zone
  ports open. Decisions: three-room loop (Intake Bay → Demonstration Ward →
  Records Office → hub); four recoverable former pupils named Nia, Mateo, Priya
  and Kofi, with cultures represented only through names; the existing
  `npc-the-ai` as a weary, passive-aggressive guide; full canonical command tour;
  real practice quiz, puzzle and hint ladder; no hazards and no life loss; all
  scores 0. Cognitive decline and "trivial before 2023" are satire only, never
  course facts. `tutorial-mechanics` is an explicitly non-assessed `in progress`
  topic, `maxScore 0`, excluded from the win set; `ai-ethics-and-implications`
  remains untouched. IDs and aliases in §9 are allocated from this approved
  outline. The topic file `topics/assistance-ward.md` records the room cluster,
  provisional PDG, safeguards and curation questions. **No ward writer briefed;
  six-stream Gate 0 ideation is next, followed by editor curation and a second
  user approval before Gate 1.**
- 2026-11-26 — **Assistance Ward Gate 0 curation approved; Gate 1 authorised.**
  Six ideation-only streams returned and the editor curated their survivor set.
  The user approved: fixed-fixture `ask`/`tell` recoveries for Nia, Mateo and
  Kofi; a sticky two-turn choose-then-reason node for Priya; optional
  `show`/`give` practice only on non-essential props; the 12-item roster and
  aliases; generic `actorstate-ready` plus four recovered pupil states; the
  ward AI topic set and the global-default ward exclusion; the four recovery
  flags, Priya's intermediate choice flag and `assistance-dial-calibrated`;
  `q-ao-01`–`q-ao-04` with keys 1/2/1/3, pass mark 3 of 4 and zero-life retries;
  one composite `all` puzzle requirement; explicit-only three-level hints for
  Gate 1; and the hub, Switchyard interface, arrival-world and AI-default card
  amendments. The final `use assistance dial` and `use practice bell` contracts
  remain subject to the read-only runtime-seam check and the standing §12
  deferral. IDs and aliases are ratified in §9 and the approved topic file is
  `topics/assistance-ward.md`. **No ward writer briefed until eligible Gate 1
  briefs are dispatched.**
- 2026-11-27 — **Assistance Ward conditional `use` seam approved; authored
  `useText` sign-off.** The user lifted the standing deferral for the calibration
  dial and put the practice bell in scope; the conditional `use` producer has
  since landed in W6. The user approved these exact player-facing strings,
  sourced from an approved authored card field (`useText`) rather than a
  code-owned constant; code must not invent the wording:
  - `item-assistance-calibration-dial` `useText.success`: "The dial gives a small, reluctant click. All five sockets are lit; the teaching ports have stopped pretending to be decoration."
  - `item-assistance-calibration-dial` `useText.blocked`: "The dial does not move. Look at the five empty sockets: OBSERVE needs Nia's observation card, READ needs Mateo's instruction card, REASON needs Priya's reason, OPERATE needs Kofi's practice cycle, and ORIENTATION PASS needs the practice quiz. Fill all five, then try again."
    The practice bell has no new string: it reuses its existing approved item
    description verbatim as its only runtime feedback — "You find the practice
    bell screwed to the bench, with a dark felt striker beside it. Its label reads
    HARMLESS PRACTICE." — with no state change, no flag, no score and no blocked
    branch. The user's stated rationale: light world-humour, a failure explanation
    that is clearer and more explicit for a tutorial level, and the bell reusing
    existing prose. The bell contract is confirmed as the card's existing one:
    harmless, scoreless and flag-free, with no state mutation and no room
    interaction. The cards' `authoring.useNotes` remain untouched as historical
    authoring context. This adds no ID, alias, flag, gate, score, coverage entry
    or V4 trace change; the schema, generator, runtime seam and tests are
    `code-lead`'s handoff.
- 2026-11-27 — **W6 landing of the approved `use` seam.** `code-lead` slice
  `ward-w6-generation` is FINAL / PASS: all 14 authored modules regenerated,
  92 files / 652 tests green, independent review PASS WITH MINORS with no blocker
  or major. The dial sets `assistance-dial-calibrated` only after the five recorded
  prerequisites, using `useText` verbatim; the bell reuses its item description
  with no state change. AW-V4-01 is closed and the ward W7 playtest is unblocked.
- 2026-11-27 — **W7 ward findings fix round authorised.** The user asked for all
  13 numbered findings in `PLAYTEST-assistance-ward.md` to be addressed and a
  focused ward-only W7 re-test; the out-of-scope Switchyard route note is context
  only. Editor decisions, recorded here under that instruction (D2, §8):
  - Accept both `unlock <item> <target>` and `unlock <item> with <target>` in the
    parser, with an in-world error that names the missing object rather than
    claiming the carried key is absent. The assessed quiz key stays correct and
    its explanation teaches both accepted forms.
  - Accept `place` as a parser alias for `put` so the approved instruction card
    and Mateo's recovery text remain valid; no card word is changed for this.
  - Accept the natural `talk to <npc>` spacing alongside `talk-to <npc>`.
  - Replace the generated `flag-set` gate line with in-world, authored exit
    feedback for the three ward gates and a non-technical fallback elsewhere.
  - Split the Records AI lesson into keyword-addressed topics
    (`topic-ai-ward-conversation`, `-answers`, `-hints`, `-failure`, `-save`) so
    the obvious question word gets its own answer; `quiz` no longer starts the
    audit — `orientation`, `audit`, `test` and `practice test` still do — and no
    AI question may start or silently restart a quiz in progress.
  - Split the ward ladder into room-scoped sequences
    (`hint-assistance-intake`, `hint-assistance-demonstration` and the retained
    `hint-assistance-orientation` for Records/quiz/puzzle), each naming the
    stalled step without supplying the answer.
  - Post-choice `tell priya …` accepts the wording the prompt invites; SHOW and
    GIVE announce the transfer at the moment it happens; hub and interface prose
    stays true after their gates open; the bell check belongs to Demonstration.
    These are revisions to approved cards and parser acceptance only: no new flag,
    score, gate, coverage claim or topic status. New topic and hint IDs are
    allocated in §9. Writers own the YAML; `code-lead` owns schema, generator,
    runtime and generated files.
- 2026-11-27 — **Round-2 re-test findings approved for fix.** The user approved
  replacing the previously ratified `item-assistance-calibration-dial`
  `useText.blocked` string, which the re-test found falsely reports five empty
  sockets after four records are filled. The superseding string is: "The dial
  does not move. Lit sockets show records already entered; dark ones still need
  attention. OBSERVE needs Nia's observation card, READ needs Mateo's instruction
  card, REASON needs Priya's reason, OPERATE needs Kofi's practice cycle, and
  ORIENTATION PASS needs the practice quiz. Fill any remaining sockets, then try
  again." It remains verbatim authored content from the card field, with no new
  flag, score or state. The user also approved the docs agent adding "declared
  room IDs" to the user-owned rulebook H2 and §7 hint-target rows. Other round-2
  findings — state-true room and item prose, the `saving` keyword and the
  wrong-order unlock refusal — are fixes to existing content or code, not new
  mechanics.
