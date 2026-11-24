# Walkthrough trace — V4

**Status:** draft for final `content-critic` verification (W4/V4). Area:
`area-1-2-1-data-representation` (The Switchyard).

This trace is the editor's ordered, complete path from the area `startRoomId` to
`game-won`. It proves that each gate condition can be satisfied in-world, that every
declared room, exit, item, NPC topic, quiz, puzzle, hazard trigger and hint target is
reachable or triggerable, and that no dependency creates a soft-lock. It is built
from the accepted cards only: `rooms.md`, `npcs.md`, `quizzes.md`, `puzzles.md`,
`hazards.md` and `hints.md`, plus the approved bible and topic file. `content-critic`
verifies it read-only on the final pass (content-rules.md V4, W4).

## 1. Win set and completion sources

Per content-rules.md §8, `game-won` fires when every mapped spec topic with `covered`
status and evidence is completed. This zone contributes the eight topics below; each
has at least one `complete-topic` source on the path in §2 (puzzle `onSolve` or quiz
`onPass`). `switch-to-bit` is `maxScore 0` but still needs its completion source.

| Spec topic ID | Completion source(s) on the path |
| --- | --- |
| `switch-to-bit` | `quiz-switchyard` onPass → `complete-topic switch-to-bit` (step 3) |
| `data-types` | `quiz-data-types` onPass and `puzzle-sort-the-data-types` onSolve (steps 3, 5) |
| `number-conversion` | `quiz-number-systems` onPass plus five puzzles (steps 3, 7) |
| `character-representation` | `quiz-character-representation` onPass, `puzzle-match-characters`, `puzzle-make-room-for-the-welsh-letter` (step 9) |
| `graphics-representation` | `quiz-graphics-representation` onPass, `puzzle-build-mosaic`, `puzzle-weigh-the-pixels`, `puzzle-scale-the-badge` (step 11) |
| `sound-representation` | `quiz-sound-representation` onPass (step 15, gated on `bit-rate-counted`), `puzzle-tune-sampling` (step 13), `puzzle-count-the-bit-rate` (step 15) |
| `data-storage-units` | `quiz-storage-units` onPass, `puzzle-stack-the-bytes`, `puzzle-label-the-capacity` (step 15) |
| `data-compression` | `quiz-data-compression` onPass, `puzzle-pack-the-archive`, `puzzle-choose-the-compression` (step 17) |

## 2. Ordered path from `startRoomId` to `game-won`

`startRoomId` is `room-binary-hall`; starting lives are 3. Rooms are entered from the
hub unless stated; every spoke exits back to the hub (N2). Hazards are noted where
they can fire. **Life budget:** the only unavoidable losses on this path are the two
first-entry hazard firings (steps 2 and 6), leaving one life; `bit-rot` and
`glyph-corruption` are disarmed before their rooms are entered, the cartridge is left
unused, and all eight quizzes are passed, so a clean run reaches `game-won` with one
life remaining.

1. **Start — `room-binary-hall`.** Read the five type bins, the sixth unlabelled
   decimal sample and the painted route diagram (all gates and their two clues).
   `item-comic-sans-cartridge` is present but expendable; leave it unused.
2. **Down → `room-switch-floor`** (ungated, first visit). The room text gives the
   heat-haze telegraph; `hazard-switch-overheat` then fires on entry (it has
   `once: true` and `switch-cooled` is unset), costing one life and ejecting you to
   `room-binary-hall`. **Down again** on the safe re-entry — the hazard cannot fire a
   second time — and take `item-switch-gauge`.
3. **USE the switch gauge on the belt.** Sets `switch-cooled` and `switches-set`
   together (item useNotes). This solves `puzzle-set-the-switches` →
   `complete-topic number-conversion` and opens the north arch. Talk to the foreman:
   `topic-foreman-switches` → `quiz-switchyard` (onPass → `complete-topic
   switch-to-bit`; score 0, no life loss); `topic-foreman-lift` (now active, gated on
   `switches-set`) sets `stacks-sealed` and → `quiz-data-types` (onPass →
   `complete-topic data-types`).
4. **Up → `room-binary-hall`.**
5. **PUT the unlabelled decimal sample on the `real` bin.** Sets `types-sorted`,
   solving `puzzle-sort-the-data-types` → `complete-topic data-types`.
6. **North → `room-hex-deck`** (gate `switches-set`, first visit). The room text gives
   the dripping-lamp telegraph; `hazard-carry-overflow` then fires on entry (it has
   `once: true`, `carry-cleared` unset), costing one life and ejecting you to the hub.
   **North again** on the safe re-entry and take `item-hex-nibble-card`.
7. **USE the nibble card on the carry lamp** → `carry-cleared` (disarms the hazard);
   **USE the nibble card on the nibble groups** → `hex-read`, solving
   `puzzle-read-nibbles` (opens the east arch). **USE the carry token on the
   rightmost column** → `carries-added` (`puzzle-add-with-carries`). **USE the shift
   lever on the row** → `row-shifted` (`puzzle-shift-the-row`). In the same hex-deck
   leg, **SHOW the switch gauge to the foreman** → `overflow-checked`
   (`puzzle-check-the-overflow-register`, via the new `topic-foreman-show-gauge`),
   and talk to the clerk: `topic-clerk-shifts` → `quiz-number-systems` →
   `complete-topic number-conversion`.
8. **South → hub. East → `room-character-tiles`** (gate `hex-read`). Take
   `item-ascii-stamp`.
9. **EXAMINE the tiles in the character case** → `tiles-verified` (disarms
   `hazard-glyph-corruption`). **USE the ASCII stamp on the tiles in the character
   case** → `characters-matched`, solving `puzzle-match-characters` (opens the south
   arch). Ask the typesetter about the spare tile → `unicode-tile-cut`
   (`puzzle-make-room-for-the-welsh-letter`); `topic-setter-unicode` →
   `quiz-character-representation` → `complete-topic character-representation`.
10. **West → hub. South → `room-picture-mosaic`** (gate `characters-matched`). Take
    `item-pixel-lens`.
11. **USE the pixel lens on the mosaic** → `picture-built`, solving
    `puzzle-build-mosaic` (opens the up arch). **USE the pixel lens on the nibble
    card** → `pixels-weighed` (`puzzle-weigh-the-pixels`). **SHOW the pixel lens to
    the foreman** → `badge-scaled` (`puzzle-scale-the-badge`). Talk to the critic:
    `topic-critic-storage` → `quiz-graphics-representation` → `complete-topic
    graphics-representation`.
12. **North → hub. Up → `room-sound-choir`** (gate `picture-built`). Take
    `item-sample-fork`.
13. **USE the sample fork on the bit-rate desk** → `sound-sampled`, solving
    `puzzle-tune-sampling` (opens the in arch). The choirmaster's quiz topic
    (`topic-conductor-storage`) gates on `bit-rate-counted`, so the audio test is
    taken in step 15, after the fork is shown. The fork is shown to the foreman in
    step 15, after its last USE, so a `show`-transferred fork cannot strand the
    ladder task.
14. **Down → hub. In → `room-storage-stacks`** (gate `sound-sampled`).
    `hazard-bit-rot` is disarmed by `stacks-sealed` set at step 3; the keeper's
    `topic-keeper-units` is the alternative route. Read the flaking-label telegraph.
15. **USE the sample fork on the unit ladder** → `stacks-sorted`, solving
    `puzzle-stack-the-bytes` (opens the out arch). **SHOW the fork to the foreman**
    → `bit-rate-counted` (`puzzle-count-the-bit-rate`); now
    `topic-conductor-storage` is active, so talk to the choirmaster →
    `quiz-sound-representation` → `complete-topic sound-representation`. Then **SHOW
    the nibble card to the foreman** → `capacity-labelled` (`puzzle-label-the-capacity`).
    Both SHOWs come after the items' last USE; the choirmaster is globally
    addressable. Finally, talk to the stack keeper: `topic-keeper-capacity` →
    `quiz-storage-units` → `complete-topic data-storage-units`.
16. **Out → hub. Out → `room-compression-press`** (gate `stacks-sorted`). Take
    `item-compression-die`.
17. **USE the compression die** → `archive-packed`, solving
    `puzzle-pack-the-archive`. **USE the compression die on the ASCII stamp** →
    `compression-chosen` (`puzzle-choose-the-compression`). Talk to the press
    operator: `topic-operator-ratio` → `quiz-data-compression` → `complete-topic
    data-compression`.
18. **All eight `covered` topics are complete** → `Session.observe` emits
    `game-won` with the final score (content-rules.md §8). Return in → hub if a final
    room transition is needed; no further gate applies.

## 3. Gate conditions and their in-world satisfaction

| Room exit / gate | Condition | Satisfied by | Two discoverable clues (N6) |
| --- | --- | --- | --- |
| hub north → `room-hex-deck` | `switches-set` | step 3 gauge-use | route diagram "north switches-set"; north arch "switches" |
| hub east → `room-character-tiles` | `hex-read` | step 7 nibble-use | route diagram "east hex-read"; east arch "nibbles" |
| hub south → `room-picture-mosaic` | `characters-matched` | step 9 stamp-use | route diagram "south characters-matched"; south arch "tiles" |
| hub up → `room-sound-choir` | `picture-built` | step 11 lens-use | route diagram "up picture-built"; up arch "image" |
| hub in → `room-storage-stacks` | `sound-sampled` | step 13 fork-use | route diagram "in sound-sampled"; in arch "sound" |
| hub out → `room-compression-press` | `stacks-sorted` | step 15 ladder-use | route diagram "out stacks-sorted"; out arch "stacks" |

The hub's `down` and `west` exits are ungated; the six gated exits form the PDG chain
with no cycle (topic file §5).

## 4. Reachability table

| Kind | Declarations | Reached / triggered at |
| --- | --- | --- |
| Rooms | 9 (entry interface, switch floor, binary hall, hex deck, character tiles, picture mosaic, sound choir, storage stacks, compression press) | entry interface via hub `west`; switch floor via hub `down`; all others via the six gated exits in §3; every spoke exits back to the hub |
| Exits | all declared in `rooms.md` | hub exits in §3; each spoke's single return exit (N2) |
| Items | switch gauge, nibble card, ASCII stamp, pixel lens, sample fork, compression die, comic-sans cartridge | each `initialRoom` is a room on the path (steps 2, 6, 8, 10, 12, 16, 1); portable thereafter; each SHOW follows the item's last USE |
| NPC topics | 38 total: AI (3), predecessor (4), foreman (7), clerk (6), typesetter (4), critic (4), choirmaster (4), keeper (3), operator (3) | NPCs are placed by role in the hub or their spoke room; default topics always active; primary topics gate on `not npc-knows`; AltTopics on puzzle flags set on the path; four foreman `show` topics are always active |
| Quizzes | 8 (`quiz-switchyard` … `quiz-data-compression`) | each has a `start-quiz` owner topic on the path (§1) |
| Puzzles | 17 (10 chain + 7 leaves) | roots at steps 3 and 5; every `dependsOn` ancestor precedes its node; leaves at steps 7, 9, 11, 15, 17 (two at 11: weigh pixels, scale badge; two at 15: bit rate, capacity) |
| Hazard triggers | 5 | overheat at step 2, carry-overflow at step 6, bit-rot at step 14, glyph-corruption on stamp use at step 9, detention-bell on optional cartridge use at step 1 (`once: true`) |
| Hint targets | 6 ladders (`hint-switchyard` … `hint-compression-ratio`) | every target topic/quiz/puzzle ID exists on the path; unlock counters use the approved keys only |

## 5. Per-topic evidence completion

Each `covered` topic has a teaching beat (room fixture or NPC), a retrieval beat
(quiz question) and an application beat (puzzle), except `switch-to-bit` which is
"should be aware of" (teaching + retrieval only):

- `switch-to-bit` — teaching: switch floor description and `topic-foreman-switches`;
  retrieval: `quiz-switchyard`. No scored puzzle by design.
- `data-types` — teaching: five-bin fixture and foreman's five-type beat; retrieval:
  `quiz-data-types`; application: `puzzle-sort-the-data-types`.
- `number-conversion` — teaching: carry track, shift gutter, nibble card, clerk
  topics; retrieval: `quiz-number-systems`; application: five puzzles.
- `character-representation` — teaching: character case and typesetter topics;
  retrieval: `quiz-character-representation`; application: two puzzles.
- `graphics-representation` — teaching: mosaic labels and critic topics; retrieval:
  `quiz-graphics-representation`; application: three puzzles.
- `sound-representation` — teaching: bit-rate desk and choirmaster topics;
  retrieval: `quiz-sound-representation`; application: two puzzles.
- `data-storage-units` — teaching: unit ladder and keeper topics; retrieval:
  `quiz-storage-units`; application: two puzzles.
- `data-compression` — teaching: ratio window and operator topics; retrieval:
  `quiz-data-compression`; application: two puzzles.

## 6. V4 verification points and their resolutions

These were the reachability risks the whole-set `content-critic` passes were asked to
adjudicate. The first pass (FAIL) confirmed the first, third and fourth as blockers or
majors; the editor routed fixes to the owning writers, recorded below. Three further
passes closed successive findings, and the fourth returned PASS.

1. **Entry-hazard counterplay reachability — RESOLVED.** `hazard-switch-overheat`
   (step 2) and `hazard-carry-overflow` (step 6) are `on-room-enter` ejectors whose
   disarms are in-room item uses; they had no `once`/cooldown, so the player never
   owned a turn inside the room and the game was unwinnable. The hazard writer added
   `once: true` to both (and to `hazard-bit-rot`): the first entry is a telegraphed
   one-life penalty that ejects to the hub, and a later entry is safe, so the
   counterplay item action can set `switch-cooled`/`switches-set` and
   `carry-cleared`/`hex-read`. The trace's step 2 and step 6 now assume the safe
   re-entry; the first entry costs one life each.
2. **`bit-rot` hub disarm lifetime — RESOLVED.** `stacks-sealed` is set from the hub by
   `topic-foreman-lift` (gated on `switches-set`, before `quiz-data-types` closes the
   topic), so it is obtainable before step 14. `hazard-bit-rot` now also has
   `once: true`, so even without the hub disarm the in-room keeper route is reachable
   on a later entry.
3. **Foreman "SHOW" flag producers — RESOLVED.** The four leaf flags had no runtime
   producer because the foreman had no `show`-matched topics and his helpful state is
   one-off. The NPC writer added four `show`-matched topics (`topic-foreman-show-gauge`,
   `-show-lens`, `-show-fork`, `-show-nibble`) with the matching `itemIds`, each
   `set-flag` for `overflow-checked`, `badge-scaled`, `bit-rate-counted` and
   `capacity-labelled`, gated always-on rather than on the helpful state. Actors are
   globally addressable by alias in this engine (`NpcStateDto` has no room field), so
   the SHOW works in any room. The trace now places the SHOW actions in their legs:
   gauge in step 7, lens in step 11, fork and nibble card in step 15.
4. **AI / predecessor placement — confirmed.** Game-wide actors appear in the entry
   interface and switch floor; their topics are flavour or the duck-as-bit teaching
   beat and gate no flag, quiz, puzzle or exit.
5. **SHOW item transfer — RESOLVED.** The second pass noted that `show` uses
   `transfer-item` (npcs.md §4/§9), so showing an item could move it into the actor's
   inventory and strand a later USE. Every SHOW in the trace now follows that item's
   last USE: gauge USE step 3 → SHOW step 7; lens USEs step 11 → SHOW step 11; fork
   USE step 15 → SHOW step 15; nibble card USEs step 7/11 → SHOW step 15. This holds
   whether `show` is display-only or transfers ownership.

The first-pass majors about trace ordering (hex-deck actions after the move to the
character-tiles), quiz ownership (`topic-setter-unicode`, not `-ascii`), and the
"six puzzles" miscount have all been corrected in §1, §2, §3, §4 and §5. The second
pass also corrected the stale leaf-step list in §4.

## 7. Verdict

**PASS (2026-11-24).** The fourth whole-set `content-critic` pass (V4, N2, N6, N7, D3)
returned no blocker or major. The ordered path from `room-binary-hall` to `game-won`
is complete, every gate is satisfiable in order, every declared room, exit, item, NPC
topic, quiz, puzzle, hazard trigger and hint target is reachable, every `covered` topic
has a `complete-topic` source, and no soft-lock remains. The first zone is integrated.
Whole-game extension of this trace is not applicable until a further zone is
integrated.
