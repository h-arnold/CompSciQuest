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
| **Opening — The Arrival** | The pupil lands in the machine. The AI states its rule: mastery of the whole of Unit 1, or deletion. The predecessor's first glitchy aside hints that the machine can be understood rather than feared. | `room-entry-interface` opens `east → room-switch-floor`; every first-zone route returns here or to the first cluster gate. |
| **Mid-point — The Attention Audit** | The AI rejects recall alone and demands application (AO2): a synthesis challenge spanning the zones built so far. Passing proves the pupil is "paying attention" in the way the AI recognises. | Reconverges all clusters built to date; unlocks later zones. |
| **Climax — The Final Demonstration** | Across every topic marked `covered` with evidence in COVERAGE.md, the pupil demonstrates mastery in one in-world assessment. The AI is cornered by its own criterion. | This is the win check in architecture.md §11: all such topics completed. |
| **Resolution — The Door Back** | Dry release: the AI opens an exit with grudging, bureaucratic congratulations. The pupil steps back into the classroom; the teacher is still drinking coffee. The Unit 2 taunt lands here as the last joke. | `game-won`; the title screen's restart path is the exit from the end state. |

Losing exits at any node through the comic-deletion path: a bounded, in-world gag,
one life lost, return to the area's `startRoomId`, no puzzle or topic progress reset.

Within the first zone the provisional spine is: arrival → `room-switch-floor`
(transistor-to-bit prologue) → `room-binary-hall` (first gate) → the representation
cluster → `room-compression-press` (zone climax gate) → back to the hub. Detail is
in `docs/content/topics/1-2-1-data-representation.md`.

## 5. Area index

Area boundaries are settled case by case as each zone is built, because spec
sections differ greatly in size. This index is deliberately brief; the room clusters,
gates and exits belong in each topic file.

| Area ID | Purpose | Owning file | Status |
| --- | --- | --- | --- |
| `area-entry-interface` | Opening key node: the AI's tribunal and the route into zones. | root bible §4 | Provisional; not briefed |
| `area-1-2-1-data-representation` | **First zone — The Switchyard.** Layers of abstraction as physical floors. | `topics/1-2-1-data-representation.md` | **First batch — approved; ready for Gate 1 brief** |
| `area-1-1-computer-architecture` | The physical machine as a place. | `topics/1-1-computer-architecture.md` | Parked; not briefed |
| `area-future-zones` | Placeholder for remaining spec sections. | — | Not designed |

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
