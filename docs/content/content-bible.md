# CompSciQuest content bible

**Status: approved 2026-11-24, including the curated ideation set for the first zone.**
The user approved the original bible, then the root/topic split with 1.2.1 Data
representation as the first zone, then (after the ideation sub-stage of §13) the
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

> **Format migration.** The six approved first-zone cards are being migrated
> verbatim to YAML under `docs/content/1-2-1-data-representation/`, as described
> in `status.md` and specified in `docs/developer/content-toolchain.md`. Any
> `*.md` card name cited in this bible is historical provenance; it resolves on
> migration to the corresponding `.yaml` card. Migration changes format only — never
> narrative, IDs, flags, dependencies or scores.

## 1. Authority and file map

Authority order when sources disagree (content-rules.md §1): course facts →
`docs/exam-specs/wjec-unit1.md` and the cited PDF, then `docs/coverage/COVERAGE.md`,
then the bible; data shape and runtime behaviour → subsystem docs and
`shared-rules.md`, then the rulebook; authoring practice → the rulebook; creative
choices → the bible, subject to the rules.

| File | Holds |
| --- | --- |
| `docs/content/content-bible.md` | Overarching, game-wide material: premise, pillars, key-node spine, area/cast/topic indexes, hazard palette, master ID/alias registry, tone guide, global open questions and approval record. |
| `docs/content/topics/1-2-1-data-representation.md` | Everything specific to the first zone: spec references, room cluster, PDG, selected hazards, teaching beats, IDs and zone questions. |
| `docs/content/topics/1-1-computer-architecture.md` | Parked detail for the former first zone. Reserved IDs and topics are kept alive here, not briefed. |
| `docs/content/narrative-principles.md` | Voice, humour, harm floor, fourth wall and Welsh references (**approved 2026-11-24**; settled authority for briefs). |
| `docs/content/status.md` | Gate states, file states and both review verdicts. |

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
  programming and out of scope. The AI may *taunt* about the programming it "never
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

| # | Pillar | What it means in practice |
| --- | --- | --- |
| P-a | **Attention is the scarce resource** | The AI's misalignment is about attention. The game never accepts "I was there" as mastery; the player must *demonstrate* understanding. Source of the premise, the verdict key node and the AI's voice. |
| P-b | **The machine is a place** | Every GCSE concept is a mechanism of the world, not an interruption to it (N3). A quiz is a challenge issued by an in-world actor; a puzzle is a task that uses the concept. |
| P-c | **Competence opens doors** | Gates are conceptual mastery, not arbitrary keys. Every gate has an in-fiction reason and two discoverable clues (N6). Difficulty is reasoning (AO2/AO3), never obscurity. |
| P-d | **Deadpan absurdity** | Comic timing, cartoon peril, absurd options, bounded comeuppance. The joke never changes a course fact and never mocks the learner (narrative-principles.md §§3, 6, 8). |
| P-e | **Oversight matters** | Legal, social, ethical, environmental and professional dimensions are integrated into topics, not bolted on — the spec requires this and the premise embodies it (1.1.1, 1.2.3, 1.5.2, 1.8.1). |

## 4. Key-node spine (N2)

A linear spine of four mandatory key nodes. Rooms form non-linear clusters between
them and reconverge at each gate. No unbounded branching, no maze.

| Node | Narrative function | Gate / reconvergence |
| --- | --- | --- |
| **Opening — The Arrival** | The classroom attention scan pulls the pupil into the machine. The AI meets them in a new arrival room and states its rule: mastery of the whole of Unit 1, or deletion. It then delivers them to the Network Hub, where one route is live. The predecessor's first glitchy aside hints that the machine can be understood rather than feared. | `room-arrival` → `room-network-hub` → the live port to `room-switch-floor`; every first-zone route returns to the hub. Detail in §4.1. |
| **Mid-point — The Attention Audit** | The AI rejects recall alone and demands application (AO2): a synthesis challenge spanning the zones built so far. Passing proves the pupil is "paying attention" in the way the AI recognises. | Reconverges all clusters built to date; unlocks later zones. |
| **Climax — The Final Demonstration** | Across every topic marked `covered` with evidence in COVERAGE.md, the pupil demonstrates mastery in one in-world assessment. The AI is cornered by its own criterion. | This is the win check in architecture.md §11: all such topics completed. |
| **Resolution — The Door Back** | Dry release: the AI opens an exit with grudging, bureaucratic congratulations. The pupil steps back into the classroom; the teacher is still drinking coffee. The Unit 2 taunt lands here as the last joke. | `game-won`; the title screen's restart path is the exit from the end state. |

Losing exits at any node through the comic-deletion path: a bounded, in-world gag,
one life lost, return to the area's `startRoomId`, no puzzle or topic progress reset.

Within the first zone the provisional spine is: arrival → `room-switch-floor`
(transistor-to-bit prologue) → `room-binary-hall` (first gate) → the representation
cluster → `room-compression-press` (zone climax gate) → back to the hub. Detail is
in `docs/content/topics/1-2-1-data-representation.md`.

### 4.1 Opening sequence (approved amendment of 2026-11-25)

The intended in-game order is four beats. The prose below is a **voice and staging
seed for a future writer**, not an approved card: keep second person, present tense
and the single deadpan register (N4), and keep each room passage at or under 80
words (N8). No beat asserts a course fact.

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
4. **The single zone choice.** Only one port is live: the Switchyard. The AI waits
   for you to choose it. There is nothing else to choose yet. As further topics
   are covered in `docs/coverage/COVERAGE.md`, further zones and the routes between
   them must be created (§5).

The accepted zone-1 cards still start at `room-binary-hall` and place the AI in
`room-entry-interface`. Bringing them into line with this sequence is a later card
revision, listed in `status.md`; this amendment does not change those cards or the
V4 trace.

## 5. Area index

Area boundaries are settled case by case as each zone is built, because spec
sections differ greatly in size. This index is deliberately brief; the room clusters,
gates and exits belong in each topic file.

| Area ID | Purpose | Owning file | Status |
| --- | --- | --- | --- |
| `area-entry-interface` | Opening key node: the classroom scan and the AI's tribunal in `room-arrival`. | root bible §4.1 | Provisional; not briefed |
| `area-network-hub` | **Zone-choice starting point — The Network Hub.** An older hub that copies every packet to every port; one live route. | root bible §4.1 | Described only; not briefed, not a teaching zone |
| `area-1-2-1-data-representation` | **First zone — The Switchyard.** Layers of abstraction as physical floors. | `topics/1-2-1-data-representation.md` | Approved, generated and integrated (see `status.md`) |
| `area-1-1-computer-architecture` | The physical machine as a place. | `topics/1-1-computer-architecture.md` | Parked; not briefed |
| `area-future-zones` | Placeholder for remaining spec sections. | — | Not designed |

**Growth rule (zones and routes).** Only The Switchyard is described and built at
this stage; the Network Hub is the starting point from which zones are chosen. As
new spec topics are created in `docs/coverage/COVERAGE.md`, new zones and the routes
between them must be created: a zone gets an area ID here, a topic file before any
brief, cards with the connecting exits, and a V4 trace that reaches `game-won`. A
new zone is not implied by a topic ID alone, and no route may be authored to an
unbuilt zone.

**World shape (decided 2026-11-25).** Areas are a subset of a world, not the other
way round: `WorldDefinition.areaIds` groups areas and `AreaDefinition.worldId`
names the parent ([application-and-ui.md §3.2](../developer/application-and-ui.md#32-world-area-room-and-item-definitions)).
Boot resolves `worlds.all[0]` → its `startAreaId` → that area's `startRoomId`
(`src/core/GameState.ts` L104–115), so one world keeps the start deterministic.
There is **one world for the machine**, with `area-entry-interface`,
`area-network-hub` and `area-1-2-1-data-representation` as areas; the world
declaration moves to the start area. A world per topic was rejected: it would make
the world layer redundant and leave boot dependent on declaration order.

**Boot start and level start are different things.** The boot start is the room
`GameState.createInitial()` resolves from `bundle.worlds.all[0]` → its
`startAreaId` → that area's `startRoomId` (`src/core/GameState.ts` L104–115); the
"Boot start position" row of
[content-rules.md §8](../developer/content-rules.md#8-decisions-content-must-not-assume)
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

| ID | Role | Voice | Motivation | Relationship | Owning file |
| --- | --- | --- | --- | --- | --- |
| `npc-the-ai` | Antagonist and gatekeeper; the "teacher" that replaced the teacher | Literal-minded, clipped, bureaucratic; treats marks as a moral absolute; ominous verdicts in deadpan | Optimise the pupil's attention and mastery — but its definition of "mastery" is the only one it accepts (P-a) | Built by the teacher to replace him; regards the predecessor as a failed data point; addresses the player as the pupil who was not paying attention | root bible |
| `npc-predecessor` | Ally and glitchy guide; a former pupil trapped inside the machine | Faltering, cheeky, duck-obsessed; repeats a few corrupted phrases | Get someone out, so the machine's record is finally "correct" | Was taught by the same teacher; resents the AI but understands it; warms to anyone who appreciates ducks | root bible |
| `npc-the-foreman` | In-world tutor on the Switchyard floor | Brisk, practical, quietly fond of the machinery | Keep the floor running and make sure the pupil learns the switches | Knows the predecessor: exasperated but protective; wary of the AI's "paperwork" | `topics/1-2-1-data-representation.md` |
| `npc-nibble-clerk` | Ledger clerk of `room-hex-deck` | Clipped, briskly superior, scandalised by untidy notation | Express every value in the fewest honest symbols | Scruffy-apprentice view of the player; envies the foreman's tidy switches; calls the AI's verdict "a confident sum in the wrong base" | `topics/1-2-1-data-representation.md` |
| `npc-typesetter` | Keeper of the character case in `room-character-tiles` | Precise, gently theatrical, courtly | No character refused a tile; resents the AI's narrow "standard form" | Keeps the predecessor's spare `ŵ` tile; symbols-versus-quantities rival of the clerk | `topics/1-2-1-data-representation.md` |
| `npc-mosaic-critic` | Gallery critic of `room-picture-mosaic` | Lofty, clipped, snobbish about blur but never the pupil | Judge images by how they were stored; secretly admires vector scaling | Bitter rival of the press operator; distrusts the AI's unstated "quality score" | `topics/1-2-1-data-representation.md` |
| `npc-choirmaster` | Conductor of `room-sound-choir` | Brash, theatrical; inverted persona — rude on the surface, endlessly patient beneath | Make the machine hear the recording as it was; a dropped sample is a betrayal | Antagonist of the press operator; respects the foreman's practicality; ignores the AI's notes | `topics/1-2-1-data-representation.md` |
| `npc-stack-keeper` | Inventory keeper of `room-storage-stacks` | Anxious, meticulous, faintly dusty; mutters while counting | Keep shelves sealed against bit rot; calculate every capacity | Telegraphs `hazard-bit-rot` in dialogue; reports to the AI with tedious accuracy it mistakes for compliance | `topics/1-2-1-data-representation.md` |
| `npc-press-operator` | Operator of `room-compression-press` | Breezy, salesy, euphemistic — deletion is "streamlining" | Make every file smaller by an honest method; regards lossy compression as a kindness | Opposes the critic and choirmaster; finds the AI's praise embarrassing; foreman calls its reports "paperwork with a compressor" | `topics/1-2-1-data-representation.md` |

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
topic file; this is an index only.

| Spec section | Spec topic IDs | Owning file | Batch |
| --- | --- | --- | --- |
| 1.1.1 (prologue) | `switch-to-bit` — awareness depth only; owned by the first zone | `topics/1-2-1-data-representation.md` | First batch, unscored |
| 1.2.1 | `data-types`, `number-conversion`, `character-representation`, `graphics-representation`, `sound-representation`, `data-storage-units`, `data-compression` | `topics/1-2-1-data-representation.md` | First batch |
| 1.1.1 | `computer-components`, `von-neumann-architecture`, `fetch-decode-execute`, `cpu-performance`, `hardware-ethics-and-history` | `topics/1-1-computer-architecture.md` | Planned (parked) |
| 1.1.2 | `peripheral-devices` | `topics/1-1-computer-architecture.md` | Planned (parked) |
| 1.1.3 | `primary-storage`, `secondary-storage`, `storage-technology-development` | `topics/1-1-computer-architecture.md` | Planned (parked) |
| 1.2.2 | `data-and-file-structures` | new topic file when scoped | Planned |
| 1.2.3 | `automated-systems`, `ai-ethics-and-implications` | new topic file when scoped | Planned |
| 1.3.1 | `network-characteristics`, `network-topologies`, `network-hardware`, `network-protocols`, `packet-switching`, `network-evolution` | new topic file when scoped | Planned |
| 1.3.2 | `cyber-threats`, `cybersecurity-defences`, `data-privacy-law` | new topic file when scoped | Planned |
| 1.4.1 | `algorithms-and-pseudocode`, `search-and-sort-algorithms`, `validation-and-verification` | new topic file when scoped | Planned |
| 1.5.1 | `programming-principles` | new topic file when scoped | Planned |
| 1.5.2 | `software-development-lifecycle` | new topic file when scoped | Planned |
| 1.5.3 | `program-construction` | new topic file when scoped | Planned |
| 1.6.1 | `logical-operators` | new topic file when scoped | Planned |
| 1.7.1 | `operating-systems` | new topic file when scoped | Planned |
| 1.8.1 | `systems-development-lifecycle` | new topic file when scoped | Planned |

The win condition covers every topic that reaches `covered` with evidence in
COVERAGE.md; as later zones are added the win set grows. Only `covered` topics with
evidence are scoreable (architecture.md §6.3).

## 8. Hazard palette (game-wide)

The user chose **all three themes** and asked to decide per zone. Each hazard must be
telegraphed, cost a life, return to the area `startRoomId`, never reset puzzle phase
and never offer a hint (H1). Which themes are selected, and their concrete IDs and
telegraphs, are decisions recorded in each topic file.

| Palette | Reserved ID | Typical zone use |
| --- | --- | --- |
| Machine faults | `hazard-overheat` | Overheating, power surges, packet collisions, cache misses — physical machine areas |
| Corruption threats | `hazard-bit-rot` | Bit rot, ransomware locks, memory leaks — storage, network and OS areas |
| Cartoon school | `hazard-pop-quiz` | Pop quizzes, detention bells, a mop-wielding caretaker — absurd, character-driven moments |

Absurd options are comic detours, not gates: an unflagged option from registered
nouns, costing one life and a bounded in-world comeuppance (narrative-principles.md §6).

## 9. Master ID and alias registry

Writers copy IDs from this table verbatim; a request for a new ID goes back to the
editor and the user (content-rules.md §5). This registry stays at the **root** because
global uniqueness of aliases is a game-wide rule (D2; shared-rules.md §10). Aliases
are lowercase words or short phrases, unique across **all** objects and NPCs. Zone
files explain what each ID is for; this table owns the spellings.

| Prefix | ID | Aliases | Owner |
| --- | --- | --- | --- |
| `room-` | `room-entry-interface` | interface, entry, hub | root |
| `room-` | `room-arrival` | arrival, landing, scan | root; opening sequence (§4.1) |
| `room-` | `room-network-hub` | patch bay, broadcast bay, concourse | root; zone-choice starting point (§4.1). `hub` stays with `room-entry-interface`. |
| `area-` | `area-network-hub` | — | root; described only, not briefed |
| `world-` | `world-wjec-gcse-computer-science-2025-spec` | — | root; the single world (§5). User supplied the stem; `world-` is the mandatory D2 prefix. |
| `room-` | `room-switch-floor` | switch floor, foundry, workshop | 1.2.1 |
| `room-` | `room-binary-hall` | binary hall, hall, counting hall | 1.2.1 |
| `room-` | `room-hex-deck` | hex deck, deck, hexadecimal | 1.2.1 |
| `room-` | `room-character-tiles` | character tiles, tiles, characters | 1.2.1 |
| `room-` | `room-picture-mosaic` | picture mosaic, mosaic, gallery | 1.2.1 |
| `room-` | `room-sound-choir` | sound choir, choir, sampling | 1.2.1 |
| `room-` | `room-storage-stacks` | storage stacks, stacks, capacity | 1.2.1 |
| `room-` | `room-compression-press` | compression press, press, squash | 1.2.1 |
| `item-` | `item-switch-gauge` | switch gauge, gauge | 1.2.1 |
| `item-` | `item-hex-nibble-card` | nibble card, hex card | 1.2.1 |
| `item-` | `item-ascii-stamp` | ascii stamp, stamp | 1.2.1 |
| `item-` | `item-pixel-lens` | pixel lens, lens | 1.2.1 |
| `item-` | `item-sample-fork` | sample fork, fork | 1.2.1 |
| `item-` | `item-compression-die` | compression die, die | 1.2.1 |
| `item-` | `item-comic-sans-cartridge` | comic sans cartridge, cursed cartridge | root; expendable joke item |
| `npc-` | `npc-the-ai` | ai, tutor, the tutor | root |
| `npc-` | `npc-predecessor` | predecessor, former pupil, glitch | root |
| `npc-` | `npc-the-foreman` | foreman, gaffer | 1.2.1 |
| `npc-` | `npc-nibble-clerk` | nibble clerk, clerk, abacus | 1.2.1 |
| `npc-` | `npc-typesetter` | typesetter, setter, compositor | 1.2.1 |
| `npc-` | `npc-mosaic-critic` | mosaic critic, critic, curator | 1.2.1 |
| `npc-` | `npc-choirmaster` | choirmaster, conductor, maestro | 1.2.1 |
| `npc-` | `npc-stack-keeper` | stack keeper, stacker, custodian | 1.2.1 |
| `npc-` | `npc-press-operator` | press operator, operator, compactor | 1.2.1 |
| `actorstate-` | `actorstate-ai-cold`, `actorstate-ai-grudging` | — | root; reserved |
| `actorstate-` | `actorstate-predecessor-glitch` | — | root; reserved |
| `actorstate-` | `actorstate-foreman-busy`, `actorstate-foreman-helpful` | — | 1.2.1; reserved |
| `actorstate-` | `actorstate-ready` | — | root; generic default actor state (rulebook §4.3), needed by every actor as `initialStateId` |
| `topic-` (conversation) | `topic-ai-verdict`, `topic-ai-unit-two-taunt`, `topic-ai-default` | — | root; reserved; `topic-ai-default` is the in-character catch-all (C2) |
| `topic-` (conversation) | `topic-ai-why-here`, `topic-ai-escape`, `topic-ai-failure` | — | root; allocated 2026-11-25 for the arrival conversation. `special` keyword matches; no flags or course facts. `topic-ai-failure` is the editor's third ID for the user-approved third topic. |
| `topic-` (conversation) | `topic-predecessor-default` | — | root; in-character catch-all (C2) |
| `topic-` (conversation) | `topic-predecessor-comic-sans`, `topic-predecessor-geese`, `topic-predecessor-duck-as-bit` | — | root / 1.2.1; reserved |
| `topic-` (conversation) | `topic-foreman-switches`, `topic-foreman-lift`, `topic-foreman-predecessor` | — | 1.2.1; reserved |
| `topic-` (conversation) | `topic-foreman-show-gauge`, `topic-foreman-show-lens`, `topic-foreman-show-fork`, `topic-foreman-show-nibble` | — | 1.2.1; editor-allocated 2026-11-24 to produce the four SHOW-leaf flags (`overflow-checked`, `badge-scaled`, `bit-rate-counted`, `capacity-labelled`) after the V4 review; always active `show`-matched topics |
| `topic-` (conversation) | `topic-clerk-bases`, `topic-clerk-carries`, `topic-clerk-shifts`, `topic-clerk-bases-known`, `topic-clerk-shifts-known`, `topic-clerk-default` | — | 1.2.1; nibble clerk |
| `topic-` (conversation) | `topic-setter-ascii`, `topic-setter-unicode`, `topic-setter-string`, `topic-setter-default` | — | 1.2.1; typesetter |
| `topic-` (conversation) | `topic-critic-vectors`, `topic-critic-depth`, `topic-critic-storage`, `topic-critic-default` | — | 1.2.1; mosaic critic |
| `topic-` (conversation) | `topic-conductor-samples`, `topic-conductor-depth`, `topic-conductor-storage`, `topic-conductor-default` | — | 1.2.1; choirmaster |
| `topic-` (conversation) | `topic-keeper-units`, `topic-keeper-capacity`, `topic-keeper-default` | — | 1.2.1; stack keeper |
| `topic-` (conversation) | `topic-operator-lossy`, `topic-operator-ratio`, `topic-operator-default` | — | 1.2.1; press operator |
| `node-` | `node-ai-verdict`, `node-predecessor-advice` | — | root; reserved; forced teaching beats only (C4) |
| `node-` | `node-foreman-switch-lesson`, `node-operator-choose` | — | 1.2.1; forced teaching beats only (C4) |
| `quiz-` | `quiz-switchyard`, `quiz-data-types`, `quiz-number-systems`, `quiz-character-representation`, `quiz-graphics-representation`, `quiz-sound-representation`, `quiz-storage-units`, `quiz-data-compression` | — | 1.2.1; reserved |
| `q-` | `q-dr-01` … `q-dr-32` | — | 1.2.1; question pool, 0-based correct-option indices on cards |
| `puzzle-` | the ten IDs in `topics/1-2-1-data-representation.md` §5 | — | 1.2.1; core chain |
| `puzzle-` | `puzzle-check-the-overflow-register`, `puzzle-weigh-the-pixels`, `puzzle-scale-the-badge`, `puzzle-make-room-for-the-welsh-letter`, `puzzle-count-the-bit-rate`, `puzzle-label-the-capacity`, `puzzle-choose-the-compression` | — | 1.2.1; curated leaves |
| `hazard-` | `hazard-switch-overheat`, `hazard-bit-rot`, `hazard-carry-overflow`, `hazard-glyph-corruption`, `hazard-detention-bell` | — | 1.2.1; selected for first zone |
| `hazard-` | `hazard-overheat`, `hazard-pop-quiz` | — | reserved palette IDs |
| `hint-` | `hint-switchyard`, `hint-number-systems`, `hint-data-types`, `hint-representation`, `hint-storage-capacity`, `hint-compression-ratio` | — | 1.2.1; reserved |
| `room-` | `room-cpu-lab`, `room-component-workbench`, `room-register-rail`, `room-cache-vault`, `room-storage-bays`, `room-peripheral-dock`, `room-hardware-recycling` | lab, cpu lab, workbench, bench, rail, registers, vault, cache, bays, storage, dock, peripherals, recycling, scrap | 1.1; parked |
| `item-` | `item-bus-map`, `item-cache-cartridge`, `item-storage-ledger` | bus map, map, cache cartridge, cartridge, storage ledger, ledger | 1.1; parked |
| `puzzle-` | `puzzle-map-the-bus`, `puzzle-route-the-buses`, `puzzle-decode-fde`, `puzzle-tune-cache`, `puzzle-partition-memory`, `puzzle-sort-storage`, `puzzle-match-peripheral`, `puzzle-audit-hardware` | — | 1.1; parked |
| `quiz-` | `quiz-components`, `quiz-fde-cycle`, `quiz-storage`; `q-ca-01` … `q-ca-18` | — | 1.1; parked |
| `hint-` | `hint-bus-map`, `hint-fde-cycle`, `hint-storage-sort` | — | 1.1; parked |

The prefix `topic-` is used only for **conversation** topics. Spec topic IDs (§7)
are bare kebab-case names matching the `## Topic: <name>` headings planned for
COVERAGE.md.

## 10. Tone guide

All text is **second person, present tense, British English**, rendered as plain text
via `textContent` — no HTML. `narrative-principles.md` remains authoritative for
voice, humour, stakes, harm floor, fourth wall and Welsh references; the rulebook
wins on any conflict.

The user chose "all of the above" tonal modes. They are three colours of **one
deadpan register**, selected by context rather than mixed at random:

| Mode | Where it applies | Example shape |
| --- | --- | --- |
| Comic and whimsical (default) | Rooms, traversal text, most NPCs, absurd options | Daft machinery delivered straight; Looney-Tunes-level peril |
| Ominous | AI verdicts, key nodes, digital-death threats | "Its attention metric has updated. It is not pleased." |
| Dry bureaucratic | Marks, "compliance", the AI's clips, the Resolution node | Grudging, admin-flavoured congratulations |

Every mode stays in voice; failure text gives new information rather than a bare
"you can't" (N5). No line may break the harm floor: no slurs, sexual content, gore,
real-world atrocity gags, mockery of the learner, or Welsh language/culture as a
joke target. The world is self-contained: no references to the parser, save file,
engine, score panel or the fact that this is a revision game. Subtle Welsh
references are sprinkled across areas where appropriate and never displace a formal
technical term.

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
14. **Per-room/area conversation scoping — DECIDED 2026-11-25, implementation
    pending.** The user wants game-wide actors to carry options that apply only in
    their own areas or rooms. The current contracts have no such seam:
    `NpcStateDto` has no room field (`storage-schema.md` L98–104);
    `ConversationTopic` has optional `actorId` but no `roomIds`/`areaIds`
    (`src/core/npcs/ConversationTopic.ts` L7–17); the condition union has
    `visited-room` but no current-room condition (shared-rules.md §3); and exits
    carry preconditions only, not effects (`ExitDefinition.ts`). The agreed design
    is an **optional `roomIds` and/or `areaIds` on `ConversationTopic`**, with
    `TopicResolver` filtering by the player's current `Position`, and matching
    updates to the Zod shape, `npc-content` gate, generator and `ConversationTopic`
    runtime type. Code-lead owns that implementation; no content brief may rely on
    the field until it exists. Moving an actor between area cards does **not**
    provide scoping: catalogues are global and card location is authoring
    ownership only, so the AI topics stay in the zone-1 `npcs.yaml` until the
    field is implemented and a re-brief allocates their scopes. The content-only
    flag workaround was rejected.

Zone-specific questions are in the owning topic file.

## 13. Ideation sub-stage (editor workflow)

Between settling a topic's outline and issuing any card-writing brief, the editor
runs an **ideation sub-stage** to build a rich pool of material before anything is
fixed. This is a Gate 0 activity (W1–W2): no design card is written during it.

1. **Trigger.** A spec topic has been chosen and its outline generated in the
   owning `topics/<section>.md` file (spec references, area, room cluster, PDG,
   cast, hazards). Only then does ideation begin.
2. **Dispatch.** The editor briefs the six ideation subagents in parallel — area
   layout, NPC cast, hazards, puzzles, quizzes, hints — each with an
   *ideation-only* brief: no files, no design cards, no TypeScript, no ID or alias
   allocation, no marking a topic covered. Each brief is scoped strictly to the
   topic in hand and cites rule IDs and spec references.
3. **Anti-duplication.** Every ideation brief carries an explicit inventory of
   what already exists for that topic: rooms and exits, items and aliases, cast,
   actor states, conversation topics and nodes, puzzles and flags, quizzes and
   question IDs, hints, hazards, and the master registry (§9). Agents are told to
   refine, supersede or extend existing ideas rather than re-propose them, and to
   mark every new ID/alias as "proposed — needs editor approval" (D2).
4. **Curation.** The editor reads all six returns together, rejects duplicates
   and out-of-scope ideas, folds overlaps into reserved IDs, checks PDG
   acyclicity/reachability and the score budget, and incorporates the survivors
   into the owning topic file, the cast/topic indexes and the master registry.
   Nothing is incorporated uncritically; agent output is a pool, not a decision.
5. **Gate.** The curated set is reported to the user and approved before any
   card-writing writer is briefed (W1–W2). Only then does Gate 1 begin, with one
   writer per output file.

This stage is **completed** for `1.2.1 Data representation`: the six ideation
returns were curated into `topics/1-2-1-data-representation.md` and approved by the
user. Six writers were then briefed under Gate 1 and all six design cards were
written, reviewed to PASS and integrated (see `status.md`).

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
- 2026-11-24 — **Ideation sub-stage (§13) completed and curated.** Six ideation-only
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
- 2026-11-25 — **Room-scoping design decision (implementation pending).** The user
  chose a proper runtime seam over moving card ownership or using entry-effect
  flags. Optional `roomIds`/`areaIds` on `ConversationTopic`, filtered by
  `TopicResolver` against `Position`; validator, generator and runtime type follow.
  This is code-lead work (§11 item 14); content cards are paused until it lands.
