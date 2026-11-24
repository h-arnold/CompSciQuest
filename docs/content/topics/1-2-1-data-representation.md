# Topic file: 1.2.1 Data representation — The Switchyard

**Status: draft, pending approval with the root bible.** Specific detail for the
first zone only. Overarching rules, the cast index and the master ID/alias registry
are in `docs/content/content-bible.md`; this file must not contradict them.
Course facts come from `docs/exam-specs/wjec-unit1.md` §1.2.1 (and §1.1.1 for the
prologue), never from memory.

## 1. Scope and area

- Area ID: `area-1-2-1-data-representation`
- World / area name: The Switchyard
- `startRoomId`: `room-binary-hall`
- Lives: `3`, reset on area change (content-rules.md §8)
- Pillars served: P-a (the AI's "compliance checks"), P-b (each abstraction level is
  a physical floor), P-c (each level gated by a conceptual task), P-d (the foreman,
  the duck-as-bit gag, the squashed luggage)

## 2. Spec references and depth

| Spec topic ID | Spec reference | Depth and teaching notes |
| --- | --- | --- |
| `switch-to-bit` | 1.1.1 Components, "learners should be aware of": historical development of components, from early transistors to modern microprocessors (guidance "Early Transistors:") | **Awareness depth only.** A transistor acts as a tiny switch; early transistors replaced vacuum tubes; transistors are packed onto chips. No transistor physics, thresholds or truth tables (`PCK-DEPTH`). Teaching/retrieval only; `maxScore` 0 so it cannot be double-scored against the parked `hardware-ethics-and-history` topic. |
| `data-types` | 1.2.1 Boolean, character, integer, real, string; appropriate use | Board in `room-binary-hall`: a switch is a Boolean; whole numbers vs decimals; one letter vs a string. |
| `number-conversion` | 1.2.1 denary/binary/hex conversion, binary addition, arithmetic shifts, overflow and underflow | The core of `room-binary-hall` and `room-hex-deck`. Use the spec's own worked examples (denary 37 → binary 100101; denary 213 → hex D5; binary 10100101 → A5) only where verified against the guidance. |
| `character-representation` | 1.2.1 digital storage of characters; standardised character sets ASCII and Unicode | `room-character-tiles`. ASCII first, then a Unicode tile bearing `ŵ` to show why ASCII is not enough. The Welsh character is a subtle reference (narrative-principles.md §10), never a lesson or a punchline. |
| `graphics-representation` | 1.2.1 vector/raster, resolution, bit depth, colour depth, storage calculations | `room-picture-mosaic`. The spec uses modern bits-per-channel (bpc) conventions; call this out explicitly so a learner is not misled by older bits-per-pixel material. |
| `sound-representation` | 1.2.1 sampling rate, bit depth, channels, storage calculations | `room-sound-choir`. Keep the spec's terms: sample, channels, sample rate, bit depth, bit rate, sample quality. |
| `data-storage-units` | 1.2.1 base-2 prefixes bit, nibble, byte, KB, MB, GB, TB, PB; data capacity calculations | `room-storage-stacks`. Base 2 throughout: 1 KB = 1024 bytes. |
| `data-compression` | 1.2.1 lossy, lossless, compression ratios and file-size reduction | `room-compression-press`. Use the spec's ratio definition and worked examples only where verified. |

**Spec check recorded for reviewers.** The user's teaching order starts with a
transistor. The transistor is **not** in 1.2.1: it appears in 1.1.1 under "learners
should be aware of" (guidance §1.1.1, "Early Transistors:", graph node at L320).
Section 1.2.1 begins at data types and number conversion (L519). The creative intent
is preserved by the `switch-to-bit` prologue with its own honest 1.1.1 reference.
The transistor must not be presented as 1.2.1 content, and no transistor physics may
be introduced (`PCK-ACC`, `PCK-DEPTH`, `PCK-EVIDENCE`).

## 3. Room cluster

Hub-and-spoke; every spoke reconverges at `room-binary-hall` (N2). Directions are
restricted to `north`, `south`, `east`, `west`, `up`, `down`, `in`, `out`
(architecture.md §7). Every gated exit needs **two discoverable clues** in room
descriptions, NPC dialogue or item text (N6); the room and NPC cards must supply
them. Room descriptions stay at or under 80 words (N8).

| Room ID | Purpose | Topic IDs | Exits |
| --- | --- | --- | --- |
| `room-entry-interface` | Opening; AI's verdict (game-wide node) | `ai-ethics-and-implications` (framing only) | `east → room-switch-floor` |
| `room-switch-floor` | Prologue: transistor as a tiny switch → a bit | `switch-to-bit` | `west → room-entry-interface`; `up → room-binary-hall` |
| `room-binary-hall` | Zone hub and `startRoomId`; Boolean/integer/real/character/string boards | `data-types`, `number-conversion` | `down → room-switch-floor`; `west → room-entry-interface`; `north → room-hex-deck`; `east → room-character-tiles` when `hex-read`; `south → room-picture-mosaic` when `characters-matched`; `up → room-sound-choir` when `picture-built`; `in → room-storage-stacks` when `sound-sampled`; `out → room-compression-press` when `stacks-sorted` |
| `room-hex-deck` | Hexadecimal nibbles; denary ↔ binary ↔ hex | `number-conversion` | `south → room-binary-hall` |
| `room-character-tiles` | ASCII, Unicode, characters and strings | `character-representation` | `west → room-binary-hall` |
| `room-picture-mosaic` | Vector/raster, resolution, bit depth, colour depth, storage calculations | `graphics-representation` | `north → room-binary-hall` |
| `room-sound-choir` | Sampling rate, bit depth, channels, storage calculations | `sound-representation` | `down → room-binary-hall` |
| `room-storage-stacks` | Base-2 units and capacity calculations | `data-storage-units` | `out → room-binary-hall` |
| `room-compression-press` | Lossy, lossless, compression ratios | `data-compression` | `in → room-binary-hall` |

Spine: arrival → `room-switch-floor` → `room-binary-hall` (first gate) → the
representation cluster → `room-compression-press` (zone climax gate) → back to the
hub. Spoke rooms form the non-linear cluster between the gates.

**Items** (see root registry §9 for aliases; ownership starts in the named room,
then lives on Player, NPC or Room state — D3): `item-switch-gauge` in
`room-switch-floor`; `item-hex-nibble-card` in `room-hex-deck`; `item-ascii-stamp` in
`room-character-tiles`; `item-pixel-lens` in `room-picture-mosaic`;
`item-sample-fork` in `room-sound-choir`; `item-compression-die` in
`room-compression-press`; `item-comic-sans-cartridge` in `room-binary-hall` as the
expendable joke item (required by no puzzle and cannot strand the player).

## 4. Cast addition

`npc-the-foreman` (aliases *foreman, gaffer*): in-world tutor on the Switchyard
floor. Brisk, practical, quietly fond of the machinery; greets you with a cheerful
"Bore da" then gets on with the job. Wants the floor running and the pupil learning
the switches — a previous pupil once shorted the whole floor. Knows the predecessor:
exasperated but protective; calls the AI's audits "paperwork". Motivations oppose the
AI's (C1). Reserved states: `actorstate-foreman-busy`,
`actorstate-foreman-helpful`. Reserved conversation topics:
`topic-foreman-switches`, `topic-foreman-lift`, `topic-foreman-predecessor`.
Reserved node: `node-foreman-switch-lesson` (a deliberate forced teaching beat only,
C4). The duck-as-bit teaching hook is `topic-predecessor-duck-as-bit`.

The AI and predecessor are game-wide; their role detail is in the root bible §6.

## 5. Puzzle Dependency Graph sketch

Sketch only, not design cards. `dependsOn` IDs must exist and the graph must stay
acyclic and reachable (puzzles.md §4; gate `puzzle-graph`). Puzzle prose may mention
only ancestor nodes (N7). Requirements are action flags, not bare `has-item`.

| Puzzle ID | `dependsOn` | Produces (flag / access / topic) |
| --- | --- | --- |
| `puzzle-sort-the-data-types` | — | flag `types-sorted`; topic `data-types` |
| `puzzle-set-the-switches` | — | flag `switches-set` (opens `room-hex-deck`); topic `number-conversion` |
| `puzzle-add-with-carries` | `puzzle-set-the-switches` | flag `carries-added`; topic `number-conversion` |
| `puzzle-shift-the-row` | `puzzle-add-with-carries` | flag `row-shifted`; topic `number-conversion` |
| `puzzle-read-nibbles` | `puzzle-set-the-switches` | flag `hex-read` (opens `room-character-tiles`); topic `number-conversion` |
| `puzzle-match-characters` | `puzzle-read-nibbles` | flag `characters-matched` (opens `room-picture-mosaic`); topic `character-representation` |
| `puzzle-build-mosaic` | `puzzle-match-characters` | flag `picture-built` (opens `room-sound-choir`); topic `graphics-representation` |
| `puzzle-tune-sampling` | `puzzle-build-mosaic` | flag `sound-sampled` (opens `room-storage-stacks`); topic `sound-representation` |
| `puzzle-stack-the-bytes` | `puzzle-tune-sampling` | flag `stacks-sorted` (opens `room-compression-press`); topic `data-storage-units` |
| `puzzle-pack-the-archive` | `puzzle-stack-the-bytes` | flag `archive-packed`; topic `data-compression` |

Two roots (`puzzle-sort-the-data-types`, `puzzle-set-the-switches`) are reachable from
`room-binary-hall`; every other node descends from one of them, so the graph is
acyclic with no unreachable puzzle. `switch-to-bit` has no scored puzzle by design:
teaching beat in `room-switch-floor`, retrieval beat in `quiz-switchyard`.

## 6. Quizzes, hints and teaching beats

One quiz per spec topic keeps each quiz card's single `topicId` honest
(content-rules.md §4.4): `quiz-switchyard`, `quiz-data-types`,
`quiz-number-systems`, `quiz-character-representation`,
`quiz-graphics-representation`, `quiz-sound-representation`,
`quiz-storage-units`, `quiz-data-compression`. Question pool `q-dr-01` … `q-dr-16`;
0-based correct-option indices on cards. Each quiz needs at least one `AO1` and one
`AO2` question (P3) and an explanation after every answer (P4).

Hint sequences: `hint-switchyard`, `hint-number-systems`, `hint-data-types`,
`hint-representation`. The last may target several spec topic IDs (H2) and must not
reveal an answer or solve a puzzle (H2, H3).

Teaching beats (P2): each first-batch topic needs a teaching beat (the foreman, the
predecessor or an in-world label), a retrieval beat (quiz question) and an
application beat (puzzle) where the spec calls for it. `switch-to-bit` is "should be
aware of", so teaching plus retrieval is sufficient. A topic with only a quiz is
incomplete.

## 7. Selected hazards

Exactly two, chosen from the game-wide palette (root bible §8). Both are
telegraphed, cost one life, return to `room-binary-hall` (`startRoomId`), never reset
puzzle phase and never offer a hint (H1).

- `hazard-switch-overheat` — machine faults. Fires on entering `room-switch-floor`
  unless a cooling flag is set. Telegraph: heat haze off the belt and accelerating
  clicks.
- `hazard-bit-rot` — corruption threats. Fires on entering `room-storage-stacks`
  unless a sealing flag is set. Telegraph: flaking labels and a dry, dusty smell.

`hazard-pop-quiz` (cartoon school) is reserved for a later, more character-driven
zone and is not used here.

## 8. Welsh references

Two planned touches: the foreman's "Bore da" greeting, and a Unicode tile bearing
`ŵ` in `room-character-tiles` to show why ASCII is not enough. Both are accurate,
unobtrusive and never displace a formal technical term; neither is a lesson or a
joke target (narrative-principles.md §10).

## 9. Zone-specific open questions

1. Confirm the `quiz-`, `q-`, `hint-`, `puzzle-` and `hazard-` IDs in this file and
   the master registry before any card is written.
2. Confirm the two-clue placements for each gated exit when the rooms and NPC cards
   are briefed (N6).
3. Confirm the sub-batching: this area has seven scored topics plus the prologue.
   Editorial plan is to brief all card kinds, then review number systems first and
   representation second, with one writer per output file.
