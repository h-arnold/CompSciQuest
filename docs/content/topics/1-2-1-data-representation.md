# Topic file: 1.2.1 Data representation — The Switchyard

**Status: approved 2026-11-24, including the curated ideation set (workflow now in
`.opencode/agents/content-editor.md`; curated set recorded in the root bible approval
record).**
Specific detail for the first zone only. Overarching rules, the cast index and the
master ID/alias registry are in `docs/content/content-bible.md`; this file must not
contradict them. Course facts come from `docs/exam-specs/wjec-unit1.md` §1.2.1 (and
§1.1.1 for the prologue), never from memory. All six design cards have since been
written and approved (see `status.md`).

> **Format migration.** Those approved cards were migrated verbatim to YAML under
> `docs/content/1-2-1-data-representation/`, and the Markdown originals were
> retired, as specified in `docs/developer/content-toolchain.md`. Any `*.md` card
> name cited in this topic file is historical provenance; it resolves to the
> corresponding `.yaml` card. Migration changed format only — never narrative,
> IDs, flags, dependencies or scores; later amendments are made to the YAML.

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
them. Room descriptions stay at or under 200 words (N8) — a ceiling, not a target.

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

**Scoring decision (recorded here per P6):** every room in this zone declares
`score: 0` — rooms are setting and navigation, not scoreable first-visit awards.
Every quiz and puzzle in this zone declares `score: 1`, awarded once on pass or
solve; the engine's `ScoreTracker` and each topic's `maxScore` budget remain the
authority on what is actually awarded (§8 decision, application-and-ui.md §10).
These are content declarations owned by the editor, not changes to the scoring
formula.

**Items** (see root registry §9 for aliases; ownership starts in the named room,
then lives on Player, NPC or Room state — D3): `item-switch-gauge` in
`room-switch-floor`; `item-hex-nibble-card` in `room-hex-deck`; `item-ascii-stamp` in
`room-character-tiles`; `item-pixel-lens` in `room-picture-mosaic`;
`item-sample-fork` in `room-sound-choir`; `item-compression-die` in
`room-compression-press`; `item-comic-sans-cartridge` in `room-binary-hall` as the
expendable joke item (required by no puzzle and cannot strand the player).

### 3.1 Curated fixtures (inside existing rooms)

These are examinable fixtures described in the owning room or item card — **not**
new rooms, exits or registry aliases. They add physical detail without breaking the
hub-and-spoke spine (N2) or using up a canonical direction. Every gated fixture keeps
two discoverable clues (N6).

| Fixture | Inside room | Serves | Interaction / clue shape |
| --- | --- | --- | --- |
| Type bins | `room-binary-hall` | `data-types` | Five labelled bins using the spec's own examples; a sixth **unlabelled sample bearing a decimal value** must be matched to the `real` bin by its characteristic. `PUT the sample on the matching bin` sets `types-sorted`. **Editor correction 2026-11-24:** the earlier "fits no type bin" wording is wrong — the spec defines five types and every sample must belong to one of them. |
| Carry track | `room-hex-deck` | `number-conversion` | Rule card "1 + 1 = 0, carry 1"; chained carry token. `USE the carry token on the rightmost column` sets `carries-added`. |
| Shift gutter | `room-hex-deck` | `number-conversion` | Arrow notches and a question-card. **Editor decision 2026-11-24:** the clue must teach the *qualitative* effect without a worked number — a left shift multiplies by a multiple of 2, a right shift divides by a multiple of 2 (glossary L2620/L2725); what falls past the end is the overflow to name. `USE the shift lever on the row` sets `row-shifted`. No numeric example is asserted. |
| Overflow tray | `room-hex-deck` / `room-binary-hall` | `number-conversion` | A tin tray under the carry lamp; a bit that runs past the last switch drops into it. Home of `puzzle-check-the-overflow-register`. No numeric example asserted. |
| Drafting corner | `room-picture-mosaic` | `graphics-representation` | Smooth vector curves beside a pixel grid that squares off; ruler marks are instructions. Supports `puzzle-scale-the-badge`. |
| Bit-rate desk | `room-sound-choir` | `sound-representation` | Dials for samples per second and bits per sample, plus a blank dial and patch lead. Supports `puzzle-count-the-bit-rate`. |
| Unit ladder | `room-storage-stacks` | `data-storage-units` | Rungs bit → nibble → byte → KB → MB → GB → TB → PB, each marked "×1024". Supports `puzzle-label-the-capacity`. |
| Ratio window | `room-compression-press` | `data-compression` | Two columns and a ratio dial; one sample tray returns exactly, the other does not. Supports `puzzle-choose-the-compression`. |

**Editor decision — switching gate is a conversion task.** `puzzle-set-the-switches`
is mapped to `number-conversion`, so it must exercise the spec verb "convert between
denary, binary and hexadecimal" (L534–536), not merely set switches on and off. The
switch gauge carries the spec's own worked value, denary 37 → binary `100101`
(L598); setting the switches to that pattern opens the north arch and sets
`switches-set`. The room card will be re-briefed to carry the 37 marking; the puzzle
card must require the conversion in its task and clues.

**Accepted layout refinements (options, not replacements):**

- **Foreman's round.** `npc-the-foreman` may appear in spoke rooms using
  `actorstate-foreman-helpful`, so teaching beats (P2) land where puzzles happen.
  Owned by the NPC card; no new exit (C1, C3, N3).
- **Floor diagram.** A painted route diagram in `room-binary-hall` names each spoke
  direction and the gate flag that opens it (hex → characters → picture → sound →
  storage → compression). Pure text; an extra navigation clue (N2, N5, N6, N8).

## 4. Cast addition

`npc-the-foreman` (aliases *foreman, gaffer*): in-world tutor on the Switchyard
floor. Brisk, practical, quietly fond of the machinery; greets you with a cheerful
"Bore da" then gets on with the job. Wants the floor running and the pupil learning
the switches — a previous pupil once shorted the whole floor. Knows the predecessor:
exasperated but protective; calls the AI's audits "paperwork". Motivations oppose the
AI's (C1). Reserved states: `actorstate-foreman-busy`,
`actorstate-foreman-helpful`. Reserved conversation topics:
`topic-foreman-switches`, `topic-foreman-lift`, `topic-foreman-predecessor`, plus the
four V4 fix topics `topic-foreman-show-gauge`, `topic-foreman-show-lens`,
`topic-foreman-show-fork`, `topic-foreman-show-nibble` (always-active `show`-matched
topics producing the four SHOW-leaf flags; editor-allocated 2026-11-24, bible §9).
Reserved node: `node-foreman-switch-lesson` (a deliberate forced teaching beat only,
C4). **Editor decision 2026-11-24:** it stays defined but **reserved/unused** in the
first batch — entering it from `topic-foreman-switches` would exit it before a
conversational turn because that topic also starts `quiz-switchyard`. The foreman
teaches through ordinary topic responses; no new conversation topic ID is allocated.
The duck-as-bit teaching hook is `topic-predecessor-duck-as-bit`.

**Six layer actors** (user-approved; one per remaining abstraction layer). Each has
a distinct voice, motivation and at least one relationship with opposing motivations
(C1); at most one recurring phrase each (narrative-principles.md §7); no mockery of
the learner or Welsh culture as a joke target (§8). Formal spec terms always appear
beside any plain gloss (`PCK-TERM`).

| Actor ID | Room / layer | Voice (recurring phrase) | Motivation and key relationship | Topics / node |
| --- | --- | --- | --- | --- |
| `npc-nibble-clerk` | hex deck / number | Clipped, superior ("Columns of four, please.") | Fewest honest symbols; envies the foreman's tidy switches; calls the AI's verdict "a confident sum in the wrong base" | `topic-clerk-bases`, `topic-clerk-carries`, `topic-clerk-shifts`, `topic-clerk-default`; AltTopics `topic-clerk-bases-known`, `topic-clerk-shifts-known` |
| `npc-typesetter` | character tiles / character | Precise, courtly ("Every mark has its place.") | No character refused a tile; keeps the predecessor's spare `ŵ` tile; opposed to the clerk's numbers-only ledger | `topic-setter-ascii`, `topic-setter-unicode`, `topic-setter-string`, `topic-setter-default` |
| `npc-mosaic-critic` | mosaic / picture | Lofty, snobbish about blur ("Show me the pixels.") | Honest storage counts; secretly admires vector scaling; rival of the press operator | `topic-critic-vectors`, `topic-critic-depth`, `topic-critic-storage`, `topic-critic-default` |
| `npc-choirmaster` | choir / sound | Brash, theatrical; **inverted persona** — rude surface, endlessly patient ("Again, from the top.") | A dropped sample is a betrayal; antagonist of the press operator; ignores the AI's notes | `topic-conductor-samples`, `topic-conductor-depth`, `topic-conductor-storage`, `topic-conductor-default` |
| `npc-stack-keeper` | stacks / units | Anxious, meticulous ("Count twice, stack once.") | Seal shelves against bit rot; telegraphs `hazard-bit-rot` in dialogue (H1); reports to the AI with tedious accuracy | `topic-keeper-units`, `topic-keeper-capacity`, `topic-keeper-default` |
| `npc-press-operator` | press / compression | Breezy, euphemistic ("Nobody will miss it.") | Smaller files by an honest method; regards lossy compression as a kindness; opposes critic and choirmaster | `topic-operator-lossy`, `topic-operator-ratio`, `topic-operator-default`; forced node `node-operator-choose` |

**Conversation shape.** Every teaching topic carries a `prompt` hint and teaches
method or structure only — never a worked result or a quiz key (N4, C2). The first
beat on each teaching actor gates on `not npc-knows`. Each middle beat records its
own evidence in a content-internal flag — `clerk-carry-heard` (carries and the
post-carry alt), `critic-depth-heard` (bit depth) and `conductor-depth-heard`
(sample depth) — and the final beat requires that flag, so the ladder is provable
under C7 without relying on declaration order. The predecessor's cartridge beat records
`predecessor-cartridge-heard` for the duck-as-bit beat the same way. Every quiz
handoff gates on `not quiz-passed <its quiz>` and repeats its single response, so a
failed attempt can re-issue the test and the beat retires on the pass (P5);
`topic-foreman-lift` requires `quiz-passed quiz-switchyard` and `topic-setter-string`
requires `quiz-passed quiz-character-representation`, so each ladder stays exclusive
under C7. AltTopics keep a complement condition when the
fact is independently discoverable via an item or puzzle flag (C3); the clerk's
`topic-clerk-bases-known` sits between the carry beat and the token, and
`topic-clerk-shifts-known` covers the post-carry, pre-shift state. Free-text input
resolves to the actor's `*-default` topic in character, never a parser error (C2).
Each actor hands off to its reserved quiz with `start-quiz` and returns to `ready`
on `quiz-ended` (npcs.md §6). `node-operator-choose` is the only forced beat beyond
the foreman's: `isSticky: true` is justified because the climax puzzle depends on
telling lossy from lossless before committing a file; no turn timeout (C4).

**Reconciliation.** The first ideation sweep's `topic-foreman-unicode-choice` and
alias `unicode` are **rejected**: the Welsh-letter puzzle runs through the
typesetter's `topic-setter-unicode`, so no conflicting foreman topic exists. Data
types keep their voiced beat in the board and the foreman, not a seventh actor.

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

**Curated leaves (user-approved).** All new edges run from existing nodes to new
leaves, so no cycle is introduced. Produced flags are level-local content keys; each
needs an owning card (item `useNotes`, fixture or NPC topic) to set it.

| Puzzle ID | `dependsOn` | Requirement / producer | Produces | Topic ID |
| --- | --- | --- | --- | --- |
| `puzzle-check-the-overflow-register` | `puzzle-add-with-carries` | `flag-set overflow-checked` via `show item-switch-gauge to npc-the-foreman` after the carry runs off the register | `overflow-checked` | `number-conversion` |
| `puzzle-weigh-the-pixels` | `puzzle-build-mosaic` | `flag-set pixels-weighed` via `use item-pixel-lens on item-hex-nibble-card` | `pixels-weighed` | `graphics-representation` |
| `puzzle-scale-the-badge` | `puzzle-build-mosaic` | `flag-set badge-scaled` via `show item-pixel-lens to npc-the-foreman` | `badge-scaled` | `graphics-representation` |
| `puzzle-make-room-for-the-welsh-letter` | `puzzle-match-characters` | `flag-set unicode-tile-cut` via `topic-setter-unicode` on `npc-the-typesetter` | `unicode-tile-cut` | `character-representation` |
| `puzzle-count-the-bit-rate` | `puzzle-tune-sampling` | `flag-set bit-rate-counted` via `show item-sample-fork to npc-the-foreman` | `bit-rate-counted` | `sound-representation` |
| `puzzle-label-the-capacity` | `puzzle-stack-the-bytes` | `flag-set capacity-labelled` via `show item-hex-nibble-card to npc-the-foreman` | `capacity-labelled` | `data-storage-units` |
| `puzzle-choose-the-compression` | `puzzle-pack-the-archive` | `flag-set compression-chosen` via `use item-compression-die on item-ascii-stamp` | `compression-chosen` | `data-compression` |

Sibling leaves (`puzzle-weigh-the-pixels` / `puzzle-scale-the-badge`) may be solved in
either order; their prose must not say "after you did X" about a sibling (N7). The
overflow idea fills the gap left by the core chain; it supersedes
`puzzle-overflow-register`, and `puzzle-weigh-the-pixels` supersedes
`puzzle-weigh-the-mosaic` — neither old ID is used.

Two roots (`puzzle-sort-the-data-types`, `puzzle-set-the-switches`) are reachable from
`room-binary-hall`; every node, including the seven leaves, descends from one of them,
so the graph is acyclic with no unreachable puzzle. `switch-to-bit` has no scored
puzzle by design: teaching beat in `room-switch-floor`, retrieval beat in
`quiz-switchyard`. Hand-checked topological order: sort types → set switches → add
with carries → {overflow check, shift row} → read nibbles → match characters →
{Welsh letter, build mosaic} → {weigh pixels, scale badge, tune sampling} → count bit
rate → stack bytes → label capacity → pack archive → choose compression.

## 6. Quizzes, hints and teaching beats

One quiz per spec topic keeps each quiz card's single `topicId` honest
(content-rules.md §4.4): `quiz-switchyard`, `quiz-data-types`,
`quiz-number-systems`, `quiz-character-representation`,
`quiz-graphics-representation`, `quiz-sound-representation`,
`quiz-storage-units`, `quiz-data-compression`. Question pool extended to
`q-dr-01` … `q-dr-32`; 0-based correct-option indices on cards. Each quiz needs at
least one `AO1` and one `AO2` question (P3) and an explanation after every answer
(P4). Wrong options are plausible spec-rooted misconceptions, never nonsense (P4).
No timer, unlimited retries, passMark a count, failure never resets topic or puzzle
progress (P5). `onPass` uses `complete-topic` plus `set-flag`
(`quiz-passed:<id>` = true) plus `message`; `onFail` uses `change-lives` and
`move-player` with reasons (shared-rules.md §5).

| Quiz ID | In-world framing (N3) | Depth / note |
| --- | --- | --- |
| `quiz-switchyard` | Foreman on `room-switch-floor` by the gauge; he needs the switch in writing before he signs the AI's "paperwork" | 1.1.1 awareness; **score 0, no life loss**, free retry, fail returns to `room-switch-floor` (user-approved). Shifts/overflow are not assessed here. |
| `quiz-data-types` | Foreman at the type bins: "It files a decimal point under 'safety hazard'" | 1.2.1 "should know"; five types and appropriate use only |
| `quiz-number-systems` | **Clerk** at `room-hex-deck`: "Columns of four, please" | Conversion, addition; shifts/overflow folded in as applied items; supersedes `quiz-shift-and-overflow` |
| `quiz-character-representation` | **Typesetter** with the ASCII stamp and `ŵ` tile; no character refused a tile | ASCII/Unicode; see spec-check flag below |
| `quiz-graphics-representation` | **Mosaic critic** with the pixel lens: "Show me the pixels" | Bits-per-channel convention stated explicitly; no older bpp material |
| `quiz-sound-representation` | **Choirmaster** with the sample forks: "Again, from the top" | Keep spec terms; no Nyquist or codec internals |
| `quiz-storage-units` | **Stack keeper** at the stacks, ledger "gone decimal again" | Base-2 prose chain; see spec-check flag below. Supersedes `quiz-capacity-budget` |
| `quiz-data-compression` | **Press operator** at the press demands the final compliance figure; predecessor's luggage squashes out as flavour | Zone climax gate; ratio and lossy/lossless |

**Editor reconciliation 2026-11-24 — quiz ownership.** Each layer quiz is issued by
the layer actor whose NPC card starts it, so `actorId` and `start-quiz` agree and the
challenge stays diegetic (N3): clerk → `quiz-number-systems`, typesetter →
`quiz-character-representation`, critic → `quiz-graphics-representation`,
choirmaster → `quiz-sound-representation`, stack keeper → `quiz-storage-units`,
press operator → `quiz-data-compression`. The foreman keeps the prologue and data
types quizzes. The quiz card must be re-briefed to match; no question key changes.

**Spec-check flags for Gate 2 (`pck-reviewer`), not editorial decisions:**

- §1.2.1 L541–546 names ASCII and Unicode but does not state which characters each
  covers. Do not fix the `ŵ` answer key until confirmed; fallback question is the
  fully spec-backed "one symbol vs a word" (character vs string).
- The L683–685 "Equivalent" column appears inconsistent with the prose chain at
  L566–570 for GB/TB/PB. Use the prose chain only.
- No worked shift or overflow numbers exist in the guidance: teach the concept,
  assert no numeric result. Colour depth is bits per channel (L640–643).

Hint sequences: `hint-switchyard`, `hint-number-systems`, `hint-data-types`,
`hint-representation`, plus the approved `hint-storage-capacity` and
`hint-compression-ratio`. `hint-representation` may target several spec topic IDs
(H2) covering characters, graphics and sound. Each ladder escalates nudge →
structure → procedure (2–4 rungs), stops short of the answer, and unlocks only on
the agreed counter keys `failed-attempts:<quizId>`, `turns-since:<puzzleId>` and
`hints-shown:<hintId>` (shared-rules.md §3). `cooldownTurns` is 2 throughout.
Automatic offers follow a wrong answer or three stuck turns, never attempt one (H3).
Superseded: `hint-conversion-check` (folded into `hint-number-systems`) and
`hint-storage-units-check` (refined into `hint-storage-capacity`).

Teaching beats (P2): each first-batch topic needs a teaching beat (an actor or
in-world label), a retrieval beat (quiz question) and an application beat (puzzle)
where the spec calls for it. `switch-to-bit` is "should be aware of", so teaching
plus retrieval is sufficient. A topic with only a quiz is incomplete.

## 7. Selected hazards

Five, spanning all three palette themes (root bible §8; user-approved). Every one
is telegraphed where the player reads it before the trigger, costs one life, returns
to `room-binary-hall` (`startRoomId`), never resets puzzle phase and never offers a
hint (H1). Telegraphed physical details are in-world metaphor only — no course fact
or number is asserted in a telegraph.

| Hazard ID | Theme / place | Trigger and telegraph | Counterplay |
| --- | --- | --- | --- |
| `hazard-switch-overheat` | Machine faults — `room-switch-floor` | On room entry unless a cooling flag is set. Heat haze off the belt; accelerating clicks. | Set the cooling flag via the gauge's `useNotes` |
| `hazard-carry-overflow` | Machine faults — `room-hex-deck` | On room entry unless `carry-cleared`. A stuck carry lamp drips spare 1s into a tray scratched OVERFLOW. | Clear the lamp via `item-hex-nibble-card` or the clerk's carries topic |
| `hazard-bit-rot` | Corruption — `room-storage-stacks` | On room entry unless a sealing flag is set. Flaking labels; a dry, dusty smell. | Set the sealing flag; keeper's dialogue also telegraphs it (H1) |
| `hazard-glyph-corruption` | Corruption — `room-character-tiles` | On using `item-ascii-stamp` unless `tiles-verified`. A tile missing a glyph corner; grey dust on the stamp. | Verify tiles first, or leave the stamp alone |
| `hazard-detention-bell` | Cartoon school — `room-binary-hall` | On using `item-comic-sans-cartridge`; `once: true`. Warm humming cartridge; a handwritten "Unauthorised font use is a compliance infringement" notice. | Avoidable — the cartridge is expendable and required by no puzzle |

Editor-assigned level-local disarm keys for the five hazards: `switch-cooled`
(overheat), `carry-cleared` (carry-overflow), `stacks-sealed` (bit-rot),
`tiles-verified` (glyph-corruption). `hazard-detention-bell` needs no disarm flag —
its counterplay is avoiding the expendable cartridge. Each key needs an owning card
to set it; until then each hazard still has an avoidable action as counterplay. A
proposed timed-fuse hazard (`hazard-sample-drift`) is **deferred** — it needs
scheduler wiring confirmed by the rooms card and code-lead. An unavoidable random
pop-quiz hazard was rejected (no counterplay; blurs into quiz combat). The reserved
`hazard-pop-quiz` palette ID remains unused.

Effects are limited to `message` + `change-lives` (`delta: -1`, with reason) +
`move-player` (`roomId: room-binary-hall`, with reason); no `set-puzzle-*` effect.

## 8. Welsh references

Three planned touches: the foreman's "Bore da" greeting; the Unicode tile bearing
`ŵ` in `room-character-tiles`, now kept in the typesetter's spare drawer; and the
typesetter's care that no character is refused a tile. The `ŵ` is subject to the
spec-check flag in §6 — the technical claim is not asserted until confirmed. All are
accurate, unobtrusive and never displace a formal technical term; none is a lesson
or a joke target (narrative-principles.md §10).

## 9. Zone-specific open questions

1. **Resolved:** all `quiz-`, `q-`, `hint-`, `puzzle-` and `hazard-` IDs in this file
   are approved and in the master registry (root §9). The four ideation decisions
   are approved (root §12).
2. Confirm the two-clue placements for each gated exit and fixture when the rooms and
   NPC cards are briefed (N6).
3. **Resolved:** sub-batching — brief all card kinds for the area, then review in two
   groups (number systems first, representation second), with one writer per output
   file (Gate 1/2).
4. **Gate 2 spec checks** (§6): ASCII/Unicode coverage for `ŵ`; the L683–685 units
   table; no worked shift/overflow numbers; bits-per-channel convention.
5. **Gate 1 ownership:** disarm flags for the five hazards and the seven new puzzle
   producers need owning item/fixture/NPC topics; the deferred fuse hazard needs
   code-lead confirmation if it is ever added.
