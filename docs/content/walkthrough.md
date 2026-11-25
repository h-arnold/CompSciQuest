# Walkthrough trace — V4

**Status:** extended draft for final `content-critic` verification (W4/V4). Areas:
`area-entry-interface`, `area-network-hub`,
`area-1-2-1-data-representation` (The Switchyard) and
`area-1-4-programming-constructs` (The Pattern Mill, §8), all in the single world
`world-wjec-gcse-computer-science-2025-spec`.

This trace is the editor's ordered, complete path from the world's start area and
`startRoomId` to `game-won`. It proves that each gate condition can be satisfied
in-world, that every declared room, exit, item, NPC topic, quiz, puzzle, hazard trigger
and hint target is reachable or triggerable, and that no dependency creates a
soft-lock. It is built from the accepted cards only: the opening cards
`entry-interface/rooms.yaml`, `network-hub/rooms.yaml` and the revised Switchyard
`rooms.yaml` and `npcs.yaml`, plus the six approved Switchyard card kinds and the
approved bible and topic file. `content-critic` verifies it read-only on the final
pass (content-rules.md V4, W4).

**Boot chain.** The single world declares `startAreaId: area-entry-interface`; that
area declares `startRoomId: room-arrival`. `GameState.createInitial()` resolves
`worlds.all[0]` → `startAreaId` → `startRoomId` by ID, never by array position
(`application-and-ui.md` §3.2, `src/core/GameState.ts` L104–115). Lives start at 3
and reset on area change (content-rules.md §8).

> **Format migration.** Those six cards were migrated verbatim to the
> corresponding `.yaml` files under `docs/content/1-2-1-data-representation/`, and
> the Markdown originals were retired (see `status.md`). The `.md` names above and
> elsewhere in this trace are historical provenance; they resolve to the YAML
> cards. Migration changed format only, so this trace remains the V4 oracle;
> later amendments are made to the YAML cards.

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
| `algorithms-and-pseudocode` (Zone A, W5) | `quiz-pattern-bureau` onPass and `quiz-finished-rail` onPass (§8 steps 21, 30) |
| `programming-constructs` (Zone A, W5) | the four construct quizzes' onPass and all six puzzles' onSolve (§8 steps 23–28) |

With the Zone A rows the authored win set is **ten `covered` topics**; the end state
itself moves to §8 step 30 (the rail quiz's pass), because `areQuizzesPassed`
(`Session.ts`) also requires every quiz with questions to have been passed — Zone A's
six quizzes join that set. Zone-1's step 18 was the end state when only the
Switchyard's topics were `covered`; the annotation there records the move.

## 2. Ordered path from the world start to `game-won`

World boot start is `room-arrival`, resolved through `area-entry-interface`'s
`startRoomId`; the Switchyard area's own `startRoomId` remains `room-binary-hall` for
hazard and quiz-failure returns. Starting lives are 3. Rooms are entered from the
hub unless stated; every spoke exits back to the hub (N2). Hazards are noted where
they can fire.

**Opening beats (new, ungated):**

- **A — `room-arrival`.** The classroom mark is read, the room folds into switches
  and you land in the cable bay. The AI is present and states the verdict.
- **B — Conversation with `npc-the-ai` in `room-arrival`.** `topic-ai-why-here`
  (keywords such as "why here", "attendance") explains the mark and the mastery
  demand; `topic-ai-failure` ("fail", "deletion", "lives") states the cartoon
  deletion, three lives, area-change reset and no progress loss. Both carry
  `isActive: { kind: in-room, roomId: room-arrival }`, so they are answerable only
  at the verdict beat. The existing `topic-ai-verdict`, `topic-ai-unit-two-taunt`
  and `topic-ai-default` remain globally available and in voice (C2).
- **C — East → `room-network-hub`.** The hub shows every route at once with only
  the east port live. Ask `npc-the-ai` about "escape", "route" or "door":
  `topic-ai-escape` carries `isActive: { kind: in-room, roomId: room-network-hub }`
  and says there is no door until mastery and to follow the route provided. The
  hub itself is navigation-only and owns no teaching topic or score.
- **D — Optional `in` → `room-entry-interface` → `out` → `room-network-hub`.** The
  older interface room remains reachable: its east arrow goes to the Switch Floor
  and its `out` exit returns to the hub. This detour gates nothing.
- **E — East → `room-switch-floor` (first entry).** The heat-haze telegraph is read,
  then `hazard-switch-overheat` fires on entry (`switch-cooled` is unset, `once: true`),
  costing one life and ejecting you to `room-binary-hall`. The verified Switchyard
  path resumes from that room.

**Life budget:** the only unavoidable losses on this path are the two
first-entry hazard firings (step E and step 6), leaving one life; `bit-rot` and
`glyph-corruption` are disarmed before their rooms are entered, the cartridge is left
unused, and all eight quizzes are passed, so a clean run reaches `game-won` with one
life remaining. Beats A–D cost no life; step E costs the first of the two
unavoidable losses.

1. **`room-binary-hall` (returned here by the step E ejection).** Read the five type
   bins, the sixth unlabelled decimal sample and the painted route diagram (all
   gates and their two clues). `item-comic-sans-cartridge` is present but
   expendable; leave it unused.
2. **Down → `room-switch-floor` (safe re-entry).** The heat-haze telegraph is still
   in the room text, but the hazard has fired once and cannot fire again. Take
   `item-switch-gauge`.
3. **USE the switch gauge on the belt.** Sets `switch-cooled` and `switches-set`
   together (item useNotes). This solves `puzzle-set-the-switches` →
   `complete-topic number-conversion` and opens the north arch. Talk to the foreman:
   `topic-foreman-switches` → `quiz-switchyard` (onPass → `complete-topic
   switch-to-bit`; score 0, no life loss). That beat stays askable until the test
   passes, so a failed attempt is retried on the spot. **Pass `quiz-switchyard`**,
   which opens `topic-foreman-lift`; it sets `stacks-sealed` and → `quiz-data-types`
   (onPass → `complete-topic data-types`).
4. **Up → `room-binary-hall`.**
5. **PUT the unlabelled decimal sample on the `real` bin.** Sets `types-sorted`,
   solving `puzzle-sort-the-data-types` → `complete-topic data-types`.
6. **North → `room-hex-deck`** (gate `switches-set`, first visit). The room text gives
   the dripping-lamp telegraph; `hazard-carry-overflow` then fires on entry (it has
   `once: true`, `carry-cleared` unset), costing one life and ejecting you to `room-binary-hall`.
   **North again** on the safe re-entry and take `item-hex-nibble-card`.
7. **USE the nibble card on the carry lamp** → `carry-cleared` (disarms the hazard);
   **USE the nibble card on the nibble groups** → `hex-read`, solving
   `puzzle-read-nibbles` (opens the east arch). Talk to the clerk while you hold the
   card: `topic-clerk-bases` (the three bases), then `topic-clerk-carries` (the carry
   rule, before the token), then `topic-clerk-bases-known` (the card's back).
   **USE the carry token on the rightmost column** → `carries-added`
   (`puzzle-add-with-carries`). **USE the shift lever on the row** → `row-shifted`
   (`puzzle-shift-the-row`). In the same hex-deck leg, **SHOW the switch gauge to the
   foreman** → `overflow-checked` (`puzzle-check-the-overflow-register`, via
   `topic-foreman-show-gauge`), then talk to the clerk again: `topic-clerk-shifts` →
   `quiz-number-systems` → `complete-topic number-conversion`. The shift beat stays
   askable until that audit passes; a failed attempt lands you in the Binary Hall, so
   walk north again (`switches-set` still holds) and re-ask.
8. **South → hub. East → `room-character-tiles`** (gate `hex-read`). Take
   `item-ascii-stamp`.
9. **EXAMINE the tiles in the character case** → `tiles-verified` (disarms
   `hazard-glyph-corruption`). **USE the ASCII stamp on the tiles in the character
   case** → `characters-matched`, solving `puzzle-match-characters` (opens the south
   arch). Talk to the typesetter: `topic-setter-ascii` (character versus string),
   then ask about the spare tile with `topic-setter-unicode` → `unicode-tile-cut`
   (`puzzle-make-room-for-the-welsh-letter`) and `quiz-character-representation` →
   `complete-topic character-representation`. The unicode beat stays askable until
   the test is passed, so a failed attempt can re-open it; `topic-setter-string`
   opens once the pass is recorded.
10. **West → hub. South → `room-picture-mosaic`** (gate `characters-matched`). Take
    `item-pixel-lens`.
11. **USE the pixel lens on the mosaic** → `picture-built`, solving
    `puzzle-build-mosaic` (opens the up arch). **USE the pixel lens on the nibble
    card** → `pixels-weighed` (`puzzle-weigh-the-pixels`). **SHOW the pixel lens to
    the foreman** → `badge-scaled` (`puzzle-scale-the-badge`). Talk to the critic:
    `topic-critic-vectors` (vector versus raster), `topic-critic-depth` (bit depth
    and colour depth), then `topic-critic-storage` → `quiz-graphics-representation`
    → `complete-topic graphics-representation`; that beat stays askable until the
    test passes.
12. **North → hub. Up → `room-sound-choir`** (gate `picture-built`). Take
    `item-sample-fork`.
13. **USE the sample fork on the bit-rate desk** → `sound-sampled`, solving
    `puzzle-tune-sampling` (opens the in arch). Ask the choirmaster
    `topic-conductor-samples` (samples and channels) and `topic-conductor-depth`
    (bit depth and sample rate) now; the quiz topic (`topic-conductor-storage`)
    gates on `bit-rate-counted`, so the audio test is taken in step 15, after the
    fork is shown. The fork is shown to the foreman in step 15, after its last USE,
    so a `show`-transferred fork cannot strand the ladder task.
14. **Down → hub. In → `room-storage-stacks`** (gate `sound-sampled`).
    `hazard-bit-rot` is disarmed by `stacks-sealed` set at step 3; the keeper's
    `topic-keeper-units` is the alternative route. Read the flaking-label telegraph.
15. **USE the sample fork on the unit ladder** → `stacks-sorted`, solving
    `puzzle-stack-the-bytes` (opens the out arch). **SHOW the fork to the foreman**
    → `bit-rate-counted` (`puzzle-count-the-bit-rate`); now
    `topic-conductor-storage` is active, so talk to the choirmaster →
    `quiz-sound-representation` → `complete-topic sound-representation`; the beat
    stays askable until that test passes. Then **SHOW
    the nibble card to the foreman** → `capacity-labelled` (`puzzle-label-the-capacity`).
    Both SHOWs come after the items' last USE; the choirmaster is globally
    addressable. Finally, talk to the stack keeper: `topic-keeper-units` (the unit
    ladder and the 1,024 rule), then `topic-keeper-capacity` → `quiz-storage-units`
    → `complete-topic data-storage-units`; that beat stays askable until the test
    passes.
16. **Out → hub. Out → `room-compression-press`** (gate `stacks-sorted`). Take
    `item-compression-die`.
17. Talk to the press operator first: `topic-operator-lossy` (lossless versus lossy,
    and the choice the lever offers); that beat is what `topic-operator-ratio`
    requires. **USE the compression die** → `archive-packed`, solving
    `puzzle-pack-the-archive`. **USE the compression die on the ASCII stamp** →
    `compression-chosen` (`puzzle-choose-the-compression`). Then
    `topic-operator-ratio` → `quiz-data-compression` → `complete-topic
    data-compression`; the ratio beat stays askable until that test passes.
18. **All eight `covered` topics are complete** → `Session.observe` emits
    `game-won` with the final score (content-rules.md §8). Return in → hub if a final
    room transition is needed; no further gate applies.
    *(End-state annotation, 2026-11-25: once Zone A's two topics flip `covered`
    at W5 (§8), the win set is ten topics and the end state moves to §8 step 30 —
    the rail quiz's pass — because `areQuizzesPassed` then also requires Zone A's
    six quizzes. Zone-1's steps 1–18 remain exactly as verified.)*

## 3. Gate conditions and their in-world satisfaction

The opening exits are ungated and need no completion source: `room-arrival` east →
`room-network-hub` (signposted by "An east route glows"); the hub's
east → `room-switch-floor` (the only live port, named in the hub description); the
hub's `in` → `room-entry-interface` and that room's `out` → the hub (both named in
their descriptions); `room-switch-floor` west → the hub (named in its description).
The three room-scoped AI conversation topics set no flag and gate no exit:
`topic-ai-why-here` and `topic-ai-failure` are active only in `room-arrival` (step
B) and `topic-ai-escape` only in `room-network-hub` (step C), each via `in-room` in
`isActive`; the three older AI topics and `topic-ai-default` stay global. None of
this changes
the win set or the eight scored topics.

| Room exit / gate | Condition | Satisfied by | Two discoverable clues (N6) |
| --- | --- | --- | --- |
| Binary Hall north → `room-hex-deck` | `switches-set` | step 3 gauge-use | route diagram "north switches-set"; north arch "switches" |
| Binary Hall east → `room-character-tiles` | `hex-read` | step 7 nibble-use | route diagram "east hex-read"; east arch "nibbles" |
| Binary Hall south → `room-picture-mosaic` | `characters-matched` | step 9 stamp-use | route diagram "south characters-matched"; south arch "tiles" |
| Binary Hall up → `room-sound-choir` | `picture-built` | step 11 lens-use | route diagram "up picture-built"; up arch "image" |
| Binary Hall in → `room-storage-stacks` | `sound-sampled` | step 13 fork-use | route diagram "in sound-sampled"; in arch "sound" |
| Binary Hall out → `room-compression-press` | `stacks-sorted` | step 15 ladder-use | route diagram "out stacks-sorted"; out arch "stacks" |

The Binary Hall's `down` and `west` exits are ungated; the six gated exits form the PDG chain
with no cycle (topic file §5).

## 4. Reachability table

| Kind | Declarations | Reached / triggered at |
| --- | --- | --- |
| Rooms | 11 (arrival, network hub, entry interface, switch floor, binary hall, hex deck, character tiles, picture mosaic, sound choir, storage stacks, compression press) | `room-arrival` is the world boot start; `room-network-hub` via its east exit; `room-entry-interface` via hub `in`; `room-switch-floor` via hub east; `room-binary-hall` via switch floor `up`; all others via the six gated exits in §3; every spoke exits back to the hub |
| Exits | all declared in the four `rooms.yaml` cards | opening exits in §3; hub exits in §3; each spoke's single return exit (N2) |
| Items | 19 total: 8 gameplay (switch gauge, nibble card, ASCII stamp, pixel lens, sample fork, compression die, comic sans cartridge, decimal sample) and 11 examinable-only props from the 2026-11-25 revision (before label, oil can, rule card, overflow tray, spare drawer, mosaic ruler, vector sheet, patch lead, brass plate, sample tray, port label) | every `initialRoom` is a room on the path: `room-binary-hall` (step 1), `room-switch-floor` (beats E/2), `room-hex-deck` (6), `room-character-tiles` (8), `room-picture-mosaic` (10), `room-sound-choir` (12), `room-storage-stacks` (14), `room-compression-press` (16) and `room-network-hub` (beat C). The eight gameplay items are portable; step 5 puts the decimal sample on the real bin, and each SHOW follows the item's last USE. Of the props, five are portable by plausibility (oil can, rule card, mosaic ruler, vector sheet, patch lead) and six are fixed scenery (before label, overflow tray, spare drawer, brass plate, sample tray, port label). The props carry no flag, gate or completion source. `P-TAKE-01` records that `takeHandler()` currently ignores `portable`, so W7 must not assert fixed props stay put until `code-lead` lands that fix |
| NPC topics | 41 total: AI (6), predecessor (4), foreman (7), clerk (6), typesetter (4), critic (4), choirmaster (4), keeper (3), operator (3) | `topic-ai-why-here` and `topic-ai-failure` are reachable in `room-arrival` (step B) and `topic-ai-escape` in `room-network-hub` (step C) via their `special` keywords and matching `in-room` scopes; actors stay globally addressable and the AI catch-all stays global (C2); primary topics gate on `not npc-knows`; each middle beat records a `*-heard` flag (`clerk-carry-heard`, `critic-depth-heard`, `conductor-depth-heard`) that the next beat requires, and the predecessor's cartridge beat records `predecessor-cartridge-heard` for the duck-as-bit beat (`topic-predecessor-geese` is a keyword topic); every quiz handoff gates on `not quiz-passed <its quiz>` and stays askable, re-issuing the test, until that pass (P5), which makes steps 3, 7, 9, 11, 13, 15 and 17 retryable; `topic-foreman-lift` requires `quiz-passed quiz-switchyard`, `topic-setter-string` requires `quiz-passed quiz-character-representation`, and `topic-operator-ratio` requires the lossy beat plus `archive-packed`; `topic-clerk-shifts-known` is reachable on the add-carries-first branch and `topic-clerk-bases-known` between the carry beat and the token; four foreman `show` topics are always active |
| Quizzes | 8 (`quiz-switchyard` … `quiz-data-compression`) | each has a `start-quiz` owner topic on the path (§1) |
| Puzzles | 17 (10 chain + 7 leaves) | roots at steps 3 and 5; every `dependsOn` ancestor precedes its node; leaves at steps 7, 9, 11, 15, 17 (two at 11: weigh pixels, scale badge; two at 15: bit rate, capacity) |
| Hazard triggers | 5 | overheat at step E (first entry), carry-overflow at step 6 (first entry), bit-rot at step 14, glyph-corruption on stamp use at step 9, detention-bell on optional cartridge use at step 1 (`once: true`) |
| Hint targets | 6 ladders (`hint-switchyard` … `hint-compression-ratio`) | every target topic/quiz/puzzle ID exists on the path; unlock counters use the approved keys only |

## 5. Per-topic evidence completion

The two new areas add no teaching, retrieval or application evidence: `room-arrival`
is the verdict beat, the three new AI topics are flavour only and the Network Hub is
navigation-only with `topicIds: []`. `ai-ethics-and-implications` remains `in progress`
and outside the win set (COVERAGE.md L187–197). The eight `covered` topics below are
unchanged by this amendment.

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
   (step E) and `hazard-carry-overflow` (step 6) are `on-room-enter` ejectors whose
   disarms are in-room item uses; they had no `once`/cooldown, so the player never
   owned a turn inside the room and the game was unwinnable. The hazard writer added
   `once: true` to both (and to `hazard-bit-rot`): the first entry is a telegraphed
   one-life penalty that ejects to the level start (`room-binary-hall`), and a later
   entry is safe, so the counterplay item action can set `switch-cooled`/`switches-set`
   and `carry-cleared`/`hex-read`. The trace places the overheat firing at step E and
   the overflow firing at step 6; steps 2 and 6 continue with the safe re-entry where
   the counterplay item is taken.
2. **`bit-rot` hub disarm lifetime — RESOLVED.** `stacks-sealed` is set from the hub by
   `topic-foreman-lift` (open once `quiz-switchyard` has passed, and until
   `quiz-data-types` passes, so the hub disarm is obtainable before step 14).
   `hazard-bit-rot` now also has
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
4. **AI / predecessor placement — confirmed.** Game-wide actors appear in the
   arrival, hub and switch areas; topics are flavour or the duck-as-bit teaching
   beat and gate no flag, quiz, puzzle or exit. Three AI topics now carry `in-room`
   locality (two in arrival, escape in the hub); the AI catch-all stays global so
   the actor remains answerable in every room (C6).
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

**Code follow-up (not a content finding).** `src/core/npcs/TopicSelection.ts` prefers
a topic whose ID words appear in the free-text phrase (`isIdMatchingPhrase`). That
contradicts `npcs.md` §3 ("content must not rely on a keyword or an ID word as a
tie-break") and would let the phrase in a trace step reach a topic its conditions do
not select. The cards no longer depend on it — every actor's ask/tell pair is
provably exclusive on `isActive` after the 2026-11-25 repair — but the runtime
preference must be removed by `code-lead` and the trace phrases re-audited before the
W7 browser pass, so a green walkthrough cannot be won by an ID word.

## 7. Verdict

**PASS (2026-11-24).** The fourth whole-set `content-critic` pass (V4, N2, N6, N7, D3)
returned no blocker or major. The ordered path from `room-binary-hall` to `game-won`
is complete, every gate is satisfiable in order, every declared room, exit, item, NPC
topic, quiz, puzzle, hazard trigger and hint target is reachable, every `covered` topic
has a `complete-topic` source, and no soft-lock remains. The first zone is integrated.
Whole-game extension of this trace is not applicable until a further zone is
integrated.

*(2026-11-25: a further zone is now integrated — Zone A, §8. Zone-1's verdict above
stands for its own area; the whole-game verdict is §8.7's, after the §8 final critic
pass.)*

## 8. Zone A — The Pattern Mill (1.4.1 programming constructs): the trace extension

Zone A's cards are the accepted, editor-verified set under
`docs/content/1-4-programming-constructs/` (`rooms.yaml` incl. the concourse and hub
amendments, `npcs.yaml`, `puzzles.yaml`, `quizzes.yaml`, `hazards.yaml`, `hints.yaml`),
built on the approved topic file `docs/content/topics/1-4-1-programming-constructs.md`
and bible §§5–12. All ids used here are ratified (§9, 2026-11-25 review close-out);
quotes byte-match the cards. The area's `startRoomId` is `room-pattern-bureau` — the
return point for quiz failures and hazard teleports (lives reset on area change,
content-rules.md §8).

### 8.1 Zone A win-set contribution and completion sources

Zone A contributes two topics; both need a completion source on the path (§1's table,
rows added). The four construct quizzes each onPass `complete-topic programming-constructs`;
the six puzzles each onSolve `complete-topic programming-constructs` (double-covered —
puzzles ARE the completion sources for their own requirement flags). The two
`algorithms-and-pseudocode` sources are `quiz-pattern-bureau` and `quiz-finished-rail`
onPass (§6 of the topic file: L1169 is that topic's write/correct/test/interpret line;
the rail quiz is the synthesis capstone).

Because `areQuizzesPassed` (`Session.ts`) requires every quiz with questions to have
been passed, the winning run passes all six Zone A quizzes (the route does anyway —
every demonstration's quiz is on the path); `game-won` fires at §8 step 30, when the
rail quiz passes (the last quiz) — by then every `covered` topic of the ten is
complete.

### 8.2 Ordered path, continued from step 18 (steps 19–30)

Life arithmetic for the extension: entering `area-1-4-concourse` and then
`area-1-4-programming-constructs` each resets lives to 3 (area change, §8). One
scripted loss is unavoidable on the route — `hazard-dye-pad` fires on the first entry
to `room-weft-counter` (the disarm topic is `in-room` scoped to that room, so the
armed first entry cannot be preceded; the room description on that same entry is the
telegraph). Two hazards are avoidable and are avoided: the avalanche never arms on
the canonical route (the puzzle completes in the demonstration's own visit, so no
re-entry happens armed), and the slop worksheet is never used. **End state: 2 of 3
lives.**

- **19 — Return to the hub** (out of the Compression Press, per zone-1's step 17).
- **20 — North → `room-1-4-concourse`** (area change; lives reset to 3). The
  concourse reads: the Rule Machine's front hall, "Y Felin" woven on the wall — the
  mill's good morning. Two exits: south back to the hub, east to the mill.
- **21 — East → `room-pattern-bureau`** (area change into Zone A; lives reset to 3;
  the area's `startRoomId`). Read the five stencilled shapes with their glosses (the
  terminator, input and output, the decision, the process, the flow lines), the
  leaflet FIVE SHAPES AND WHAT THEY DO, the Demonstration Book, and the bolted east
  door's legend UNTIL A DEMONSTRATION IS ON RECORD. Talk to the Loomwright:
  `topic-loomwright-welcome` → `topic-loomwright-pseudocode` (learn-topic
  `algorithms-and-pseudocode`) → `topic-loomwright-shapes`. Then
  `topic-loomwright-demonstration` → **`quiz-pattern-bureau`** (4 questions) → pass:
  `complete-topic algorithms-and-pseudocode`, `demo-on-record` set,
  `quiz-passed:quiz-pattern-bureau` set. The east door's bolt draws.
- **22 — East → `room-warp-walk`.** Read the five dark doorways (each a construct
  rank), the mill board's 3, the woven door label, the stopped clock, and the east
  rail door under its caption RUNS WHEN PROVEN: **four glass section lights** named
  ORDER, COLOURS, COUNTS and END — the last carrying a second wick lit only when
  both of the selvedge's actions are done — all four dark. Nothing gates the spokes;
  only the rail door gates (the five flags across the four lights).
- **23 — North → `room-threading-order`.** Read the pattern paper's five steps
  (ground, first stripe, cross-stripe, border, hem), the shade cards hung in
  somebody else's sequence, and the lectern's PATTERN WORKBOOK — **do not use it**
  (`hazard-slop-worksheet` arms on `on-item-used`; the Warp Dresser's warning and the
  room text are the telegraphs; the workbook is the tempting-object trap). Talk to
  the Warp Dresser: `topic-warp-dresser-order` (learn-topic) →
  `topic-warp-dresser-demonstration` → **`quiz-threading-order`** (4 questions) →
  pass: `complete-topic programming-constructs`, `quiz-passed:quiz-threading-order`,
  `grant-item item-pattern-card-sequence`. **GIVE the sequence card to the Warp
  Dresser** (`topic-warp-dresser-give`): transfer + `card-sequence-given`. Then the
  puzzle's action: **PUT the shade cards on the step hangers in the card's order**
  (interaction pin P1, below) → `dressing-re-ordered`. Both requirements of
  `puzzle-dress-the-warp` hold → onSolve → `threading-ordered` (Warp Walk light 1).
  **TAKE the else plate** (portable; carried).
- **24 — South → `room-warp-walk`. Out → `room-bobbin-window`.** Read the intake
  bell, the addressing plate (its letter rack slopped the way the cousin's
  find-and-replace left it), the postmark album and pad. **TAKE the shed plate**
  (portable; carried). **USE the addressing plate** — work the letter rack,
  re-lettering the slopped addresses back (interaction pin P2) →
  `addressing-plate-re-lettered`. `bell-mended` still waits on the wire.
- **25 — In → `room-warp-walk`. South → `room-weft-counter` (first entry).**
  **`hazard-dye-pad` fires**: `on-room-enter`, `when quiz has not set `pad-checked``,
  `once: true` — the dried pad miscounts the weft, **−1 life (3 → 2)**, teleport to
  `room-pattern-bureau`. This loss is scripted and unavoidable (the crackle-test topic
  is `in-room` to this room); the room text read on the same entry is the telegraph.
  Re-enter (bureau → warp walk → south). Talk to the Weft Tally:
  `topic-weft-tally-count` (learn-topic) → `topic-weft-tally-pad` (**the crackle-test:
  sets `pad-checked`; the hazard is dead**) → `topic-weft-tally-prediction` (the
  prediction beat: `pass-count-predicted` set — predict before any run) →
  `topic-weft-tally-demonstration` → **`quiz-weft-tally`** (4 questions) → pass:
  `complete-topic programming-constructs`, `quiz-passed:quiz-weft-tally`,
  `grant-item item-pattern-card-count-iteration`. **GIVE the count card to the Weft
  Tally** → `card-count-given`. Then the ratchet's two actions: **USE the slip tooth
  on the counting ratchet** (interaction pin P7) → `slip-tooth-pried`; **USE the
  counting ratchet** to re-seat it (pin P8) → `counting-ratchet-reseated`. All four
  requirements of `puzzle-seat-the-ratchet` hold → onSolve → `weft-counted` (Warp
  Walk light 3). **TAKE the bell wire** (portable; carried).
- **26 — North → `room-warp-walk`. Out → `room-bobbin-window`.** **USE the bell wire
  on the intake bell** (interaction pin P3) → `bell-wire-seated`. Both requirements
  of `puzzle-mend-the-bell` hold (the wire seated; the plate re-lettered at 24) →
  onSolve → `bell-mended` (the Bobbin Lad's beat reads it).
- **27 — In → `room-warp-walk`. In → `room-colour-court`.** Read the case rail, the
  plate frame's two slots, the pick trolley's tray (picks 9, 12, 15). Talk to the
  Shed Opener: `topic-shed-opener-selection` (learn-topic) →
  `topic-shed-opener-demonstration` → **`quiz-colour-court`** (4 questions) → pass:
  `complete-topic programming-constructs`, `quiz-passed:quiz-colour-court`,
  `grant-item item-pattern-card-selection`. **GIVE the selection card to the Shed
  Opener** → `card-selection-given`. Then the puzzle's actions: **PUT the shed plate
  in its diamond slot** (pin P4) → `shed-plate-returned`; **PUT the else plate in
  its plain rectangular slot** (pin P5) → `else-plate-restored`; **route the tray by
  the plate's condition** (pin P6) → `tray-routed-by-condition`. All four
  requirements of `puzzle-lift-the-shed` hold → onSolve → `colours-lifted` (Warp
  Walk light 2; the avalanche is disarmed by completion — no armed re-entry happens
  on this route).
- **28 — Out → `room-warp-walk`. Down → `room-endless-selvedge`.** Read WHILE THE
  CLOTH IS NICE, the plate frame, the whist table, the skein shelf (the rogue
  thread — the rogue value — reading −1), the counterfoil drawer, the signing
  board, the dye vat. Talk to the Selvedge Warden:
  `topic-selvedge-warden-until` (learn-topic) →
  `topic-selvedge-warden-demonstration` → **`quiz-selvedge`** (4 questions) →
  pass: `complete-topic programming-constructs`, `quiz-passed:quiz-selvedge`,
  `grant-item item-pattern-card-condition-iteration`. **GIVE the condition card to
  the Selvedge Warden** → `card-condition-given`. Then the two PUTs: **PUT the until
  plate on the selvedge's empty exit frame** (pin P9) → `until-clause-restored`;
  **PUT the rogue thread in the counterfoil drawer** (pin P10) →
  `rogue-thread-in-drawer`. Both requirements of `puzzle-close-the-selvedge` hold →
  onSolve → `condition-plate-set` (light 4); both requirements of
  `puzzle-file-the-rogue-thread` hold → onSolve → `rogue-thread-filed` (light 4's
  second half; the section light burns with both).
- **29 — Up → `room-warp-walk`.** All four section lights are lit — ORDER,
  COLOURS, COUNTS, and END with both of its wicks — the east rail door's
  guard (threading-ordered, colours-lifted, weft-counted, condition-plate-set,
  rogue-thread-filed) is satisfied. **East → `room-finished-rail`.** Read the master
  cloth, the flowchart beside it, the rota board, PREDICT. THEN WEAVE. — and the
  Loomwright, come up from the Bureau, ledger squared, to audit the despatch (the
  audit topic is `in-room` scoped here).
- **30 — `topic-loomwright-audit` → `quiz-finished-rail`** (4 questions — the
  capstone: choose the construct for a fresh problem) → pass:
  `complete-topic algorithms-and-pseudocode`, `quiz-passed:quiz-finished-rail`,
  `master-demonstrated` set. **All ten `covered` topics are complete and every
  quiz in the bundle has been passed** → `Session.observe` emits **`game-won`**
  with the final score. End state: won, 2 of 3 lives (the dye-pad's scripted loss
  is the route's only loss).

### 8.3 Gate conditions and their in-world satisfaction

| Gate | Condition | Satisfied at |
| --- | --- | --- |
| Bureau east door | `demo-on-record` | step 21 (`quiz-pattern-bureau` onPass) |
| Warp Walk spoke doors | none | steps 23–28 walk in and out freely |
| Warp Walk east rail door | `threading-ordered` AND `colours-lifted` AND `weft-counted` AND `condition-plate-set` AND `rogue-thread-filed` | steps 23, 27, 25, 28, 28 — door opens for step 29 |
| Hub north → concourse | none (area change: lives reset) | step 20 |
| Concourse east → Bureau | none (area change; the area's `startRoomId`) | step 21 |
| Rail quiz | `topic-loomwright-audit` is `in-room: room-finished-rail` | step 30 (bible §11 item 12: presence without a placement field; the rail description carries the attendance) |

The three hazards against the route: `hazard-dye-pad` fires once, scripted, at step
25's first entry (predicted −1); `hazard-pick-avalanche` arms on `quiz-passed:
quiz-colour-court` AND NOT `colours-lifted` on re-entry — never armed-and-entered on
this route (the puzzle completes in the demonstration's visit); `hazard-slop-worksheet`
arms on `on-item-used` of `item-slop-worksheet` — never used on this route (the
workbook is read as the trap it is and left shut).

### 8.4 Reachability table (Zone A)

Every declared entity is reachable or triggerable on the path; the covering step is
shown.

| Entity | Covered at |
| --- | --- |
| `room-pattern-bureau` (+8 items: the four pattern cards — granted on the quizzes, filed on the gives — carthen, paned mug, leaflet, Demonstration Book) | step 21 (startRoomId; items read at 21) |
| `room-1-4-concourse` | step 20 |
| `room-warp-walk` (+ mill clock, woven label, mill board) | step 22 |
| `room-threading-order` (+ else plate, slop worksheet) | step 23 |
| `room-bobbin-window` (+ shed plate, addressing plate, postmark album + pad) | step 24 |
| `room-weft-counter` (+ counting ratchet, slip tooth, bell wire, dye pad, mill duck) | step 25 (first entry fires the dye pad); all items used at 25–26 |
| `room-colour-court` (+ pick trolley, quality book) | step 27 |
| `room-endless-selvedge` (+ condition plate, rogue thread, whist cards, weft kettle, counterfoil drawer, signing board, dye vat) | step 28 |
| `room-finished-rail` (+ rota board) | steps 29–30 |
| All 29 exits (both concourse/hub pairs cross-file, per §8.3) | steps 19–29 |
| `npc-the-loomwright` (7 topics: welcome, pseudocode, shapes, demonstration→`quiz-pattern-bureau`, cousin, audit→`quiz-finished-rail`, default) | steps 21, 29–30 (audit at the rail) |
| `npc-the-warp-dresser` (7 topics: order, order-known, demonstration→`quiz-threading-order`, mended, give→`item-pattern-card-sequence`, stray, default) | step 23 |
| `npc-the-shed-opener` (8 topics: selection, selection-known, demonstration→`quiz-colour-court`, mended, urgent, give→`item-pattern-card-selection`, stray, default) | step 27 |
| `npc-the-weft-tally` (10 topics: count, count-known, demonstration→`quiz-weft-tally`, mended, pad (the crackle-test → `pad-checked`), tuesdays, prediction→`pass-count-predicted`, give→`item-pattern-card-count-iteration`, stray, default) | step 25 (pad at re-entry) |
| `npc-the-selvedge-warden` (9 topics: until, until-known, demonstration→`quiz-selvedge`, mended, signal, whist, give→`item-pattern-card-condition-iteration`, stray, default) | step 28 |
| `npc-the-bobbin-lad` (6 topics: trade, average, bell (reads `bell-mended`), prediction, paned, default — no give topic; the lad files nothing) | steps 24, 26 |
| `npc-the-slop-cousin` (8 topics: seven per-room vandal beats — bureau, bobbin-window, warp-walk, threading-order, colour-court, weft-counter, selvedge — + default; flavour only) | encountered in any room; not a required step |
| `npc-the-ai` (1 topic: `topic-ai-licence`, flavour-only, no flags/quiz — the Bureau cameo) | step 21 (optional) |
| Six quizzes | steps 21, 23, 25, 27, 28, 30 |
| Six puzzles | steps 23 (dress), 25 (ratchet), 26 (bell), 27 (shed), 28 (selvedge + rogue) |
| Three hazard triggers | step 25 (dye pad, fires); 27 (avalanche, never armed-and-entered); 23 (worksheet, never used) |
| Seven hint ladders (`hintSequences`) | every ladder's `targets` resolve to step-covered entities: bureau (21), threading (23), colour (27), tally (25), selvedge (28), rail (29–30), bobbin (24) |

### 8.5 Per-topic evidence completion (Zone A)

| Spec topic | References | Evidence on the path |
| --- | --- | --- |
| `programming-constructs` (1.4.1 constructs; L1161–1516) | the four constructs as the mill's four rank doors: sequence (L1253), selection (L1255), count-controlled (L1259), condition-controlled (L1218–1221); DIV/MOD bailing beat (L1292–1293) | taught in four rooms (dress/shed/tally/selvedge — learn-topic each), demonstrated in four quizzes (steps 23, 27, 25, 28), applied in six puzzles (the flags ARE the constructs' working steps), completed by the quizzes' `complete-topic` (steps 23, 25, 27, 28) and the puzzles' onSolve; the retrieval beats are the quizzes (P5 retries; the trace passes first-try) |
| `algorithms-and-pseudocode` (1.4.1 algorithms; L1169) | the Bureau's five shapes (terminator, input, output, decision, process, flow lines); PREDICT. THEN WEAVE. | taught by the Loomwright (learn-topic, step 21), retrieved in `quiz-pattern-bureau` (step 21), synthesised in `quiz-finished-rail` (step 30 — the construct chosen for a fresh problem; master-demonstrated set), completed by both onPass sources |

Arrays (L1261's strand) are prose-taught in the zone without a quiz or puzzle
retrieval beat in Zone A — the W5 evidence note records the deferral to a later
zone (the npc card's arrays pledge: the 1.2.2 applies-and-extends later).

### 8.6 Trace-pinned verb-action rows (the W6 contract)

The engine seam is landed (`src/core/commands/InteractionRules.ts` —
`USE_INTERACTIONS`/`PUT_INTERACTIONS`, zone-1's rows present). W6 wires Zone A as the
ten rows below (shape per `FlagInteraction`: itemId, optional targetId, roomId, flags,
text) and declares the three new sceneries the rows need (`scenery-step-hangers` +
`scenery-shade-cards` in room-threading-order; `scenery-intake-bell` in
room-bobbin-window; `scenery-plate-frame` in room-colour-court's two-slot frame;
`scenery-exit-frame` in room-endless-selvedge). Until W6 wires them, the actions are
authored route the hints and useNotes teach — no card rewrite is needed either way.

| # | Verb | itemId | targetId | roomId | flags | row text (suggested) |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | PUT | `scenery-shade-cards` (W6 scenery) | `scenery-step-hangers` (W6 scenery) | `room-threading-order` | `dressing-re-ordered` | The shade cards go back on the hangers in the card's order: ground, first stripe, cross-stripe, border, hem. |
| P2 | USE | `item-addressing-plate` | — (self) | `room-bobbin-window` | `addressing-plate-re-lettered` | You work the letter rack and the slopped addresses read true again. |
| P3 | USE | `item-bell-wire` | `scenery-intake-bell` (W6 scenery) | `room-bobbin-window` | `bell-wire-seated` | The wire seats on the intake bell and the bell rings round. |
| P4 | PUT | `item-shed-plate` | `scenery-plate-frame` (W6 scenery) | `room-colour-court` | `shed-plate-returned` | The shed plate seats into the diamond slot it was cut for. |
| P5 | PUT | `item-else-plate` | `scenery-plate-frame` | `room-colour-court` | `else-plate-restored` | The else plate finds its plain rectangular slot beside the diamond. |
| P6 | USE | `item-pick-trolley` | — (self) | `room-colour-court` | `tray-routed-by-condition` | The tray routes by the plate's condition: if the count is twelve or more, the pick lifts; else it posts routine — nine posts, twelve itself lifts, fifteen lifts. |
| P7 | USE | `item-slip-tooth` | `item-counting-ratchet` | `room-weft-counter` | `slip-tooth-pried` | The slip tooth comes out of the ratchet. The chalk line reads count = count + 1. |
| P8 | USE | `item-counting-ratchet` | — (self) | `room-weft-counter` | `counting-ratchet-reseated` | The ratchet seats true: one tooth, one pass. |
| P9 | PUT | `item-condition-plate` | `scenery-exit-frame` (W6 scenery) | `room-endless-selvedge` | `until-clause-restored` | The until plate goes up on the exit frame and the selvedge can want an ending again. |
| P10 | PUT | `item-rogue-thread` | `item-counterfoil-drawer` | `room-endless-selvedge` | `rogue-thread-in-drawer` | The rogue thread files in the counterfoil drawer, initialled W. |

Solve coupling (engine-side, already the puzzle contract): a puzzle's onSolve fires
when its requirement flags all hold — P1+step 23's give solve `puzzle-dress-the-warp`;
P3+P2 solve `puzzle-mend-the-bell` (order-free); P4+P5+P6 + step 27's give solve
`puzzle-lift-the-shed`; P7+P8 + step 25's prediction + give solve
`puzzle-seat-the-ratchet`; P9 + step 28's give solve `puzzle-close-the-selvedge`;
P10 + step 28's give solve `puzzle-file-the-rogue-thread`.

### 8.7 Zone A verdict

**PASS WITH MINORS (2026-11-25, final whole-set `content-critic` pass over the six
Zone A cards, both amendment rooms cards and this §8 — rules V4, N2, N6, N7, D3).**
No blocker, no major; nothing routed to writers. Three minors, all
editor-dispositioned the same day: (1) V4 — the trace's rail-door prose said "five
lights"; the room carries **four glass section lights across five flags** (the END
light's second wick) — steps 22 and 29 corrected; (2) N6/H1 — `hint-bobbin-window`'s
room shares a cousin vandal topic's room, but the keyword sets are disjoint (no C7
capture risk) — recorded for the W6 record, no card change; (3) D3 — the §8.6 "W6
scenery" ids are code-side declarations per this contract, not unregistered content
ids — recorded so W6's reviewer does not re-flag them. The five editor judgement
items returned sound: the avalanche race (entry-time guard evaluation + the puzzle
completing in the demonstration's own visit), all ten rows conform to the useNotes,
the selvedge frame shorthand describes one before/after state, zone-1's steps 1–18
are byte-identical, and the hints' escalation passes with no leak level.

The extension keeps zone-1's steps intact, orders Zone A from the hub through the
concourse into the mill, satisfies every gate in order, accounts for every hazard
(one scripted loss; two avoided), and completes both Zone A topics with the quizzes
as retrieval beats. The trace-pinned interaction rows are the W6 contract. Zone A is
accepted for the W5 coverage flip and the W6/W7 hand-off.
