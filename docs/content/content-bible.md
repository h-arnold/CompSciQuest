# CompSciQuest content bible

This bible owns game-wide creative decisions: the premise, pillars, key-node
spine, area and cast indexes, topic index, hazard palette and tone guide. Zone
detail lives in `docs/content/topics/*.md`; authoring rules live in the owning
documents and subsystem contracts; `docs/exam-specs/wjec-unit1.md` is the
authority for course facts. The bible changes only with the user's agreement.

## 1. Authority and file map

Authority order when sources disagree (§1): course facts →
`docs/exam-specs/wjec-unit1.md` and the cited PDF, then `docs/coverage/COVERAGE.md`,
then the bible; data shape and runtime behaviour → subsystem docs and
`shared-rules.md` with `content-toolchain.md`; authoring practice → the owning
documents and subsystem contracts; creative choices → the bible, subject to the
rules.

| File                                               | Holds                                                                                                                                                                       |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/content/content-bible.md`                    | Overarching, game-wide material: premise, pillars, key-node spine, area/cast/topic indexes, hazard palette, tone guide, global open questions.                              |
| `docs/content/topics/1-2-1-data-representation.md` | Everything specific to the first zone: spec references, room cluster, PDG, selected hazards, teaching beats, IDs and zone questions.                                        |
| `docs/content/topics/assistance-ward.md`           | High-level onboarding outline: mandatory hub checkpoint, three-room loop, four recoverable pupils, full command tour, non-assessed practice systems and curation questions. |
| `docs/content/topics/1-1-computer-architecture.md` | Parked detail for the former first zone; its IDs and topics remain unscoped.                                                                                                |
| `docs/content/narrative-principles.md`             | Voice, humour, harm floor, fourth wall and Welsh references; settled authority for briefs.                                                                                  |

The editor's process lives in `.opencode/agents/content-editor.md`; this file records the curated outcome.

**Split rule.** The root bible holds only material true across the whole game. Each
zone is approved by the user, gets its own `docs/content/topics/<spec-section>.md`
**before** its writer brief;
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

The canonical reading is:

- The demand is for **Unit 1: Understanding Computer Science** only. Unit 2 is
  programming and out of scope. The AI may _taunt_ about the programming it "never
  got round to teaching", but that is flavour: it is never a gate, never a question
  and never content to author.
- "Digital death" is **in-fiction threat, not a mechanic**. Mechanics are fixed:
  three lives, reset on area change; zero lives gives `status: 'lost'` and
  `game-over`; the player restarts from the title screen. The on-screen result is a
  cartoon deletion or severed connection, never permanent loss, realistic harm or
  save damage (storage-schema.md §2; narrative-principles.md §§5, 8).
- The player is **one of the pupils from the class** — specifically one of those the
  AI judged not to be paying attention.
- The classroom attention scan shows that judgement being made: it is
  the moment of absorption (§4.1). The Network Hub's 1990s label is in-world colour,
  never a course fact (§9).

## 3. Pillars (N1)

Every area, character and hazard must trace to at least one pillar. A card that
cannot is rejected.

| #   | Pillar                               | What it means in practice                                                                                                                                                                                                                                                                                                                       |
| --- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P-a | **Attention is the scarce resource** | The AI's misalignment is about attention. The game never accepts "I was there" as mastery; the player must _demonstrate_ understanding. Source of the premise, the verdict key node and the AI's voice.                                                                                                                                         |
| P-b | **The machine is a place**           | Every GCSE concept is a mechanism of the world, not an interruption to it (N3). A quiz is a challenge issued by an in-world actor; a puzzle is a task that uses the concept.                                                                                                                                                                    |
| P-c | **Competence opens doors**           | Gates are conceptual mastery, not arbitrary keys. Every gate has an in-fiction reason and two discoverable clues in room, NPC or item text (N6). No guess-the-verb or guess-the-noun traps: verbs come from the agreed parser list and nouns from the aliases declared on items and actors. Difficulty is reasoning (AO2/AO3), never obscurity. |
| P-d | **Deadpan absurdity**                | Comic timing, cartoon peril, absurd options, bounded comeuppance. The joke never changes a course fact and never mocks the learner (narrative-principles.md §§3, 6, 8).                                                                                                                                                                         |
| P-e | **Oversight matters**                | Legal, social, ethical, environmental and professional dimensions are integrated into topics, not bolted on — the spec requires this and the premise embodies it (1.1.1, 1.2.3, 1.5.2, 1.8.1).                                                                                                                                                  |

## 4. Key-node spine (N2)

A linear spine of four mandatory key nodes. Rooms form non-linear clusters between
them and reconverge at each gate. No unbounded branching, no maze.

| Node                                 | Narrative function                                                                                                                                                                                                                                                                                                                                                                                                       | Gate / reconvergence                                                                                                                                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Opening — The Arrival**            | The classroom attention scan pulls the pupil into the machine. The AI meets them in a new arrival room and states its rule: mastery of the whole of Unit 1, or deletion. It then delivers them to the Network Hub. The pupil must complete the Assistance Ward orientation before the teaching-zone ports open; the predecessor's first glitchy aside still hints that the machine can be understood rather than feared. | `room-arrival` → `room-network-hub` → south to `room-assistance-intake` → ward loop → `tutorial-complete` → the live port to `room-switch-floor`; every first-zone route returns to the hub. Detail in §4.1. |
| **Mid-point — The Attention Audit**  | The AI rejects recall alone and demands application (AO2): a synthesis challenge spanning the zones built so far. Passing proves the pupil is "paying attention" in the way the AI recognises.                                                                                                                                                                                                                           | Reconverges all clusters built to date; unlocks later zones.                                                                                                                                                 |
| **Climax — The Final Demonstration** | Across every topic marked `covered` with evidence in COVERAGE.md, the pupil demonstrates mastery in one in-world assessment. The AI is cornered by its own criterion.                                                                                                                                                                                                                                                    | This is the win check in application-and-ui.md §11: all such topics completed.                                                                                                                               |
| **Resolution — The Door Back**       | Dry release: the AI opens an exit with grudging, bureaucratic congratulations. The pupil steps back into the classroom; the teacher is still drinking coffee. The Unit 2 taunt lands here as the last joke.                                                                                                                                                                                                              | `game-won`; the title screen's restart path is the exit from the end state.                                                                                                                                  |

Losing exits at any node through the comic-deletion path: a bounded, in-world gag,
one life lost, return to the area's `startRoomId`, no puzzle or topic progress reset.

Within the first zone the provisional spine is: arrival → `room-switch-floor`
(transistor-to-bit prologue) → `room-binary-hall` (first gate) → the representation
cluster → `room-compression-press` (zone climax gate) → back to the hub. Detail is
in `docs/content/topics/1-2-1-data-representation.md`.

### 4.1 Opening sequence

The opening has four beats. The cards own the prose; these beats are staging
guidance. Keep second person, present tense and the single deadpan register (N4),
and keep each room passage to at most two paragraphs, usually 200–300 words unless
the place warrants more detail (N8). No beat asserts a course fact.

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
   route instead of a door, and tells you to follow. The verdict uses
   `topic-ai-verdict` and `node-ai-verdict`.
3. **The starting point — `room-network-hub`.** The hub is older than the rest of
   the machine. A yellowed label says it has been here since the 1990s. It copies
   everything it receives to every port, so all the routes are visible at once:
   one live, the rest dark. The AI says it is still on the record, which is why
   nobody switched it off. The 1990s line is **flavour only**: it is never taught,
   quizzed or used as evidence for a spec topic (§9).
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

The world boots at `room-arrival`; the Switchyard's `startRoomId` is
`room-binary-hall` for hazard and quiz-failure returns. The AI's artefacts are in
the arrival and hub NPC cards by the area-ownership rule (§4.2). The ward's AI
state and guide topics are in `docs/content/assistance-ward/npcs.yaml`, bound to
the globally declared actor; its outline is in `topics/assistance-ward.md`.

### 4.2 Card ownership by area

Every entity's YAML lives in the folder of the area (and, where practical, the
room) that uses it. A game-wide actor's actor, states, node and topics are split
across the area cards where they are available:

- `docs/content/entry-interface/npcs.yaml` owns `npc-the-ai`, `actorstate-ai-cold`,
  `actorstate-ai-grudging`, `node-ai-verdict` and the five arrival/global AI topics.
- `docs/content/network-hub/npcs.yaml` owns `topic-ai-escape`, the one AI topic
  scoped to `room-network-hub`.
- `docs/content/assistance-ward/npcs.yaml` owns `actorstate-ai-reluctant-guide`,
  the four pupil actors and all ward-scoped AI guide topics. `npc-the-ai` itself
  remains declared in the arrival card; cross-card `actorId` binding is valid.
- `docs/content/1-2-1-data-representation/npcs.yaml` owns the predecessor and all
  Switchyard teaching.

The one-file-per-(area, kind) convention is unchanged
([content-toolchain.md §2](../developer/content-toolchain.md#2-authoring-format)).

Cross-card `actorId` binding is permitted: the `npc-content` gate resolves actor
IDs across the whole card set, so the hub topic can bind to an actor declared in
the arrival card. Briefs must
name the owning area card for every artefact and must not place an entity in an
unrelated zone for convenience. When a new topic is scoped to a room in another
area, its topic card moves with the room.

## 5. Area index

Area boundaries are settled case by case as each zone is built, because spec
sections differ greatly in size. This index is deliberately brief; the room clusters,
gates and exits belong in each topic file.

| Area ID                            | Purpose                                                                                                                                                                                                       | Owning file                              | Status          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------- |
| `area-entry-interface`             | Opening key node: the classroom scan and the AI's tribunal in `room-arrival`.                                                                                                                                 | root bible §4.1                          | Described only  |
| `area-network-hub`                 | **Zone-choice starting point — The Network Hub.** An older hub that copies every packet to every port; the south ward route is open and the teaching ports wait for ward calibration.                         | root bible §4.1                          | Described only  |
| `area-assistance-ward`             | **The Assistance Ward.** Mandatory, unscored onboarding checkpoint reached south of the hub; three-room command tour with the AI and four recoverable former pupils.                                          | `topics/assistance-ward.md`              | Authored        |
| `area-1-2-1-data-representation`   | **First zone — The Switchyard.** Layers of abstraction as physical floors.                                                                                                                                    | `topics/1-2-1-data-representation.md`    | Authored        |
| `area-1-4-programming-constructs`  | **The Pattern Mill (Zone A of 1.4)** — a Welsh woollen mill where the constructs are the loom's own mechanics; spec topics `algorithms-and-pseudocode`, `programming-constructs`.                             | `topics/1-4-1-programming-constructs.md` | Authored        |
| `area-1-4-concourse`               | **The Rule Machine Concourse** — placeholder front area for Unit 1.4: links back to the Network Hub (north) and forward to the mill; dark ports reserved for Zones B–D. Navigation-only, no topics, no score. | §5 (standing topology)                   | Navigation-only |
| `area-1-4-search-and-sort`         | Zone B of 1.4 — searching and sorting (the five algorithms).                                                                                                                                                  | Zone B topic file when scoped            | Planned         |
| `area-1-4-maintainable-programs`   | Zone C of 1.4 — maintainable, reliable programs (1.4.1 maintainability + 1.5.1 folded in).                                                                                                                    | Zone C topic file when scoped            | Planned         |
| `area-1-4-validation-verification` | Zone D of 1.4 — validation and verification (its own area).                                                                                                                                                   | Zone D topic file when scoped            | Planned         |
| `area-1-1-computer-architecture`   | The physical machine as a place.                                                                                                                                                                              | `topics/1-1-computer-architecture.md`    | Parked          |
| `area-future-zones`                | Placeholder for remaining spec sections.                                                                                                                                                                      | —                                        | Not designed    |

**Standing topology.** The world is **hub-and-spoke**. The Network Hub is the
hub; every Unit 1.x zone attaches through its own concourse-type area — one room,
navigation-only, no score, no topics — that links back to the hub and forward to
the zone's entry room. Inter-zone movement always travels via the hub and the
concourses; inside a zone, movement stays linear-or-bush with reconverging gates
(N2). Zone 1 connects directly to the hub; every later zone uses a concourse. Each
new zone's hub exit is a standing re-brief of the hub's rooms card.

**Growth rule (zones and routes).** The Network Hub is the starting point from
which zones are chosen. As new spec topics
are created in `docs/coverage/COVERAGE.md`, new zones and the routes between them
must be created: a zone gets an area ID here, a topic file before any brief, cards
with the connecting exits, and a V4 trace that reaches `game-won`. A new zone is
not implied by a topic ID alone, and no route may be authored to an unbuilt zone.

**World shape.** Areas are a subset of a world, not the other
way round: `WorldDefinition.areaIds` groups areas and `AreaDefinition.worldId`
names the parent ([application-and-ui.md §3.2](../developer/application-and-ui.md#32-world-area-room-and-item-definitions)).
Boot resolves `worlds.all[0]` → its `startAreaId` → that area's `startRoomId`,
so one world keeps the start deterministic. There is **one world for the machine**, with `area-entry-interface`,
`area-network-hub`, `area-assistance-ward` and
`area-1-2-1-data-representation` as areas; the world declaration is in the start area.

**Boot start and level start are different things.** The boot start is the room
`GameState.createInitial()` resolves from `bundle.worlds.all[0]` → its
`startAreaId` → that area's `startRoomId`
([application-and-ui.md §2](../developer/application-and-ui.md#2-boot-title-screen-and-session-start)).
The level start is an area's own `startRoomId`: where hazard and quiz-failure
returns land, with lives reset on **area change**
([application-and-ui.md §3.2](../developer/application-and-ui.md#32-world-area-room-and-item-definitions)).
The world boots at `room-arrival`; the Switchyard's level start is `room-binary-hall`.

## 6. Cast index

Role-level detail for the two game-wide actors is here; zone-specific actors are
described in their topic file. Every actor has a distinct role, voice, motivation and
relationship, with opposing motivations preferred (A1). All conversational input
resolves to an in-character reply (T1).

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

**Character-defining details:**
the predecessor used Comic Sans too often and once told their teacher that geese were
the superior form of wildfowl — ducks are best. These are comedy and relationship
hooks, not course facts, and never displace a technical term.

**Offstage:** the teacher who built the AI (coffee, Reddit) is part of the frame and
the Resolution node. No actor ID is allocated. The expendable
`item-comic-sans-cartridge` nods to the predecessor without requiring the teacher
to appear.

## 7. Topic index

Bare kebab-case IDs below are **spec topic IDs**: they become `## Topic: <id>` headings
in `docs/coverage/COVERAGE.md`. They are distinct from
conversation-topic IDs, which carry the `topic-` prefix. Writers use only these
IDs and never mark a topic `covered` without teaching and assessment evidence
(P1, V3). Exact spec references and teaching beats for each batch are in the owning
topic file; this is an index only. A non-assessed onboarding topic may
also be registered in COVERAGE.md and `spec-topics.yaml` while `in progress`, so
its practice systems have a valid P1 reference; that registration is not a coverage
claim and does not weaken V3.

Every room declares `topicIds`, every puzzle and quiz declares `topicId`, and
every hint sequence declares `targets`; a room with no teaching purpose is marked
`navigation-only` (P1). Room `topicIds` are authoring references for the gates
and coverage mapping, not a runtime field of `RoomDefinition`. Topic IDs must
match the `## Topic: <id>` heading in `COVERAGE.md` exactly and come from this
index; writers never invent one. Where the spec calls for it, a topic has a
teaching beat (NPC explanation), a retrieval beat (quiz) and an application beat
(puzzle or in-world action); a quiz alone is incomplete (P2).

| Spec section                                      | Spec topic IDs                                                                                                                                             | Owning file                              | Batch       |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| Onboarding — **not a WJEC topic**                 | `tutorial-mechanics` — game orientation only; `in progress`, `maxScore 0`, excluded from the win set                                                       | `topics/assistance-ward.md`              | Onboarding  |
| 1.1.1 (prologue)                                  | `switch-to-bit` — awareness depth only; owned by the first zone                                                                                            | `topics/1-2-1-data-representation.md`    | Unscored    |
| 1.2.1                                             | `data-types`, `number-conversion`, `character-representation`, `graphics-representation`, `sound-representation`, `data-storage-units`, `data-compression` | `topics/1-2-1-data-representation.md`    | First batch |
| 1.1.1                                             | `computer-components`, `von-neumann-architecture`, `fetch-decode-execute`, `cpu-performance`, `hardware-ethics-and-history`                                | `topics/1-1-computer-architecture.md`    | Parked      |
| 1.1.2                                             | `peripheral-devices`                                                                                                                                       | `topics/1-1-computer-architecture.md`    | Parked      |
| 1.1.3                                             | `primary-storage`, `secondary-storage`, `storage-technology-development`                                                                                   | `topics/1-1-computer-architecture.md`    | Parked      |
| 1.2.2                                             | `data-and-file-structures`                                                                                                                                 | new topic file when scoped               | Planned     |
| 1.2.3                                             | `automated-systems`, `ai-ethics-and-implications`                                                                                                          | new topic file when scoped               | Planned     |
| 1.3.1                                             | `network-characteristics`, `network-topologies`, `network-hardware`, `network-protocols`, `packet-switching`, `network-evolution`                          | new topic file when scoped               | Planned     |
| 1.3.2                                             | `cyber-threats`, `cybersecurity-defences`, `data-privacy-law`                                                                                              | new topic file when scoped               | Planned     |
| 1.4.1 (constructs — **Zone A, The Pattern Mill**) | `algorithms-and-pseudocode`, `programming-constructs`                                                                                                      | `topics/1-4-1-programming-constructs.md` | Scoped      |
| 1.4.1 (search & sort — Zone B)                    | `search-and-sort-algorithms`                                                                                                                               | Zone B topic file when scoped            | Planned     |
| 1.4.1 (maintainable — Zone C)                     | `maintainable-programs` (with 1.5.1 folded in)                                                                                                             | Zone C topic file when scoped            | Planned     |
| 1.4.1 (V&V — Zone D)                              | `validation-and-verification`                                                                                                                              | Zone D topic file when scoped            | Planned     |
| 1.5.1                                             | Folded into Zone C's `maintainable-programs`                                                                                                               | —                                        | Folded in   |
| 1.5.2                                             | `software-development-lifecycle`                                                                                                                           | new topic file when scoped               | Planned     |
| 1.5.3                                             | `program-construction`                                                                                                                                     | new topic file when scoped               | Planned     |
| 1.6.1                                             | `logical-operators`                                                                                                                                        | new topic file when scoped               | Planned     |
| 1.7.1                                             | `operating-systems`                                                                                                                                        | new topic file when scoped               | Planned     |
| 1.8.1                                             | `systems-development-lifecycle`                                                                                                                            | new topic file when scoped               | Planned     |

The win condition covers every topic that reaches `covered` with evidence in
COVERAGE.md; as later zones are added the win set grows. Only `covered` topics with
evidence are scoreable (architecture.md §6.3).

## 8. Hazard palette (game-wide)

All three themes are available; each topic file selects its hazards. Every hazard must be
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

## 9. Tone guide

All text is **second person, present tense, British English**, rendered as plain text
via `textContent` — no HTML. `narrative-principles.md` remains authoritative for
voice, humour, stakes, harm floor, fourth wall and Welsh references; the owning
documents and subsystem contracts win on any conflict.

Three tonal modes are colours of **one deadpan register**, selected by context
rather than mixed at random:

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

**Assistance Ward guide voice.** In this area only, the
AI's clipped bureaucracy becomes weary and passive-aggressive. It complains
about the work of explaining obvious actions, speaks of "the pupil" in the third
person and treats independence as an administrative inconvenience. The humour
targets its excessive help and self-importance, never the player's ability or a
struggling learner. The four former pupils are recoverable people, not monsters.

**Terminology pairing and craft glossing.** A world
term and the formal term ride together: first use pairs them ("the rogue thread —
the rogue value — reads −1"), and afterwards quizzes, hint targets and coverage
evidence always use the formal term, never the nickname alone. Craft and cultural
vocabulary a pupil may reasonably not know — warp, weft, shed, selvedge, carthen,
paned — gets a short in-voice explanation on first use: one clause, never a lesson,
never displacing a technical term. (See `narrative-principles.md` §2 and the Zone A
topic file's glossary.)

**In-world date flavour.** The Network Hub's "since the 1990s" label is colour.
The exam spec gives no date for hubs: it lists them as
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

## 10. Global open questions

- Is the teacher ever an actor? It is offstage in the frame and the Resolution
  node, with no actor ID allocated.
- Which cast belongs in Zones B–D? They are unscoped until each zone is briefed.

Zone-specific questions are in the owning topic file.
