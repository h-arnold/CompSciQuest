# Coverage map

This file is the authoritative mapping from the GCSE Computer Science Unit 1
specification to game content. The separate coverage graph built from `docs/`
(indexed at `docs/graphify-out/graph.json`) includes this file and the source
PDF; it is **evidence** for these mappings, not proof that a topic is covered.

Source material: `exam-specs/gcse-unit-1-computer-science.pdf`; text extraction
at `docs/exam-specs/wjec-unit1.md` (line numbers cited below).

## Conventions

- Use one `## Topic: <spec topic name>` heading per specification topic.
- Use the exact same name or ID for the corresponding room/game concept in code,
  so Graphify's concept deduplication can join the document and code nodes.
- Cite the PDF section/page and the code path/symbol. An empty field means
  "not mapped yet", not "covered".
- Status is one of `not started`, `in progress`, `covered`. Record evidence.
- A topic is `covered` only when accepted cards supply real teaching (an actor or
  in-world label), retrieval (a quiz question) and — where the spec calls for it —
  application (a puzzle) evidence (content-rules.md V3). Code locations are the
  planned `src/content/` targets from `architecture.md` §12; no game code exists
  yet, so paths are marked *planned* until the code-lead implements them.

## Topic: switch-to-bit

- Spec reference: 1.1.1 Components, "learners should be aware of" — historical
  development from early transistors to modern microprocessors
  (`wjec-unit1.md` L318–325, "Early Transistors" / "Integrated Circuits").
- Game content / room ID: `room-switch-floor`, `item-switch-gauge`,
  `quiz-switchyard`, `topic-foreman-switches`.
- Code location: *planned* `src/content/rooms/` (`room-switch-floor`);
  `src/content/quizzes/` (`quiz-switchyard`). Not yet implemented.
- Status: covered
- Evidence / notes: Awareness depth only — a transistor is a tiny switch, early
  transistors replaced vacuum tubes, and transistors are packed onto chips
  (teaching in the accepted `rooms.md` room description and `topic-foreman-switches`;
  retrieval in `quiz-switchyard`, `q-dr-01`–`q-dr-03`). No transistor physics,
  thresholds or truth tables. `maxScore 0` so it is not double-scored against the
  parked `hardware-ethics-and-history` topic. Prologue quiz scores 0 with no life
  loss (user-approved).

## Topic: data-types

- Spec reference: 1.2.1 — appropriate use and characteristics of Boolean,
  character, integer, real and string (`wjec-unit1.md` L525–532; table L584–590).
- Game content / room ID: `room-binary-hall` type bins,
  `puzzle-sort-the-data-types`, `quiz-data-types`, `hint-data-types`.
- Code location: *planned* `src/content/rooms/` (`room-binary-hall`);
  `src/content/puzzles/` (`puzzle-sort-the-data-types`);
  `src/content/quizzes/` (`quiz-data-types`). Not yet implemented.
- Status: covered
- Evidence / notes: Teaching — five labelled bins using the spec's own examples plus
  one unlabelled decimal sample matched to `real` (`rooms.md` fixtureNotes);
  foreman's five-type beat with formal terms and glosses (`npcs.md`
  `topic-foreman-lift`). Retrieval — `quiz-data-types` (`q-dr-04`–`q-dr-07`).
  Application — `puzzle-sort-the-data-types` (PUT the decimal sample on the `real`
  bin sets `types-sorted`). The sixth item is a sample bearing a decimal value,
  never a sixth type or bin.

## Topic: number-conversion

- Spec reference: 1.2.1 — convert between denary, binary and hexadecimal; binary
  addition; arithmetic shifts and their effect; overflow and underflow
  (`wjec-unit1.md` L534–539; worked examples L592–615; glossary shift/overflow).
- Game content / room ID: `room-hex-deck`, `room-switch-floor`,
  `item-switch-gauge`, `item-hex-nibble-card`, five puzzles, `quiz-number-systems`,
  `quiz-switchyard`, `hint-number-systems`.
- Code location: *planned* `src/content/rooms/` (`room-hex-deck`);
  `src/content/puzzles/` (`puzzle-set-the-switches`, `puzzle-add-with-carries`,
  `puzzle-shift-the-row`, `puzzle-read-nibbles`,
  `puzzle-check-the-overflow-register`); `src/content/quizzes/`
  (`quiz-number-systems`). Not yet implemented.
- Status: covered
- Evidence / notes: Teaching — carry rule "1 + 1 = 0, carry 1", shift gutter
  (qualitative effect only), gauge tab "denary 37 — what binary pattern?"
  (`rooms.md`); clerk topics (`npcs.md`). Retrieval — `quiz-number-systems`
  (`q-dr-08`–`q-dr-11`), including 37 → `100101` and `10100101` → `A5`.
  Application — `puzzle-set-the-switches` (convert 37 to `100101`),
  `puzzle-add-with-carries`, `puzzle-shift-the-row`, `puzzle-read-nibbles`,
  `puzzle-check-the-overflow-register`. No worked shift or overflow number is
  asserted anywhere (spec-check flag). Base 2 used in the prose chain only.

## Topic: character-representation

- Spec reference: 1.2.1 — digital storage of characters; standardised character
  sets including Unicode and ASCII (`wjec-unit1.md` L541–546).
- Game content / room ID: `room-character-tiles`, `item-ascii-stamp`,
  `puzzle-match-characters`, `puzzle-make-room-for-the-welsh-letter`,
  `quiz-character-representation`, `hint-representation`.
- Code location: *planned* `src/content/rooms/` (`room-character-tiles`);
  `src/content/puzzles/` (`puzzle-match-characters`,
  `puzzle-make-room-for-the-welsh-letter`); `src/content/quizzes/`
  (`quiz-character-representation`). Not yet implemented.
- Status: covered
- Evidence / notes: Teaching — character case with single-mark tiles, ASCII stamp
  case lid, spare `ŵ` tile labelled only "a different character" (`rooms.md`);
  typesetter topics (`npcs.md`). Retrieval — `quiz-character-representation`
  (`q-dr-12`–`q-dr-15`), character-vs-string and standardised-set items.
  Application — `puzzle-match-characters` (sets `characters-matched`) and
  `puzzle-make-room-for-the-welsh-letter` (sets `unicode-tile-cut`). No claim about
  which characters ASCII or Unicode covers is asserted; `ŵ` is a subtle Welsh
  reference, never a lesson or punchline (spec-check flag).

## Topic: graphics-representation

- Spec reference: 1.2.1 — digital storage of graphics; effect of resolution, bit
  depth and colour depth on quality; storage calculations (`wjec-unit1.md`
  L548–552; worked image example L637–657; bits per channel L640–643).
- Game content / room ID: `room-picture-mosaic`, `item-pixel-lens`,
  `puzzle-build-mosaic`, `puzzle-weigh-the-pixels`, `puzzle-scale-the-badge`,
  `quiz-graphics-representation`, `hint-representation`.
- Code location: *planned* `src/content/rooms/` (`room-picture-mosaic`);
  `src/content/puzzles/` (`puzzle-build-mosaic`, `puzzle-weigh-the-pixels`,
  `puzzle-scale-the-badge`); `src/content/quizzes/` (`quiz-graphics-representation`).
  Not yet implemented.
- Status: covered
- Evidence / notes: Teaching — pixel mosaic, vector-versus-raster drafting corner,
  ruler and bit-depth/colour-depth label in bits per channel (`rooms.md`); critic
  topics (`npcs.md`). Retrieval — `quiz-graphics-representation`
  (`q-dr-16`–`q-dr-19`). Application — `puzzle-build-mosaic`,
  `puzzle-weigh-the-pixels`, `puzzle-scale-the-badge`. Bits-per-channel convention
  stated explicitly; no older bits-per-pixel material (spec-check flag).

## Topic: sound-representation

- Spec reference: 1.2.1 — digital storage of sound; sampling-rate effect on
  quality; storage calculations (`wjec-unit1.md` L554–558; sample definition and
  bit-rate rule L657–670; worked stereo example L670–672).
- Game content / room ID: `room-sound-choir`, `item-sample-fork`,
  `puzzle-tune-sampling`, `puzzle-count-the-bit-rate`,
  `quiz-sound-representation`, `hint-representation`.
- Code location: *planned* `src/content/rooms/` (`room-sound-choir`);
  `src/content/puzzles/` (`puzzle-tune-sampling`, `puzzle-count-the-bit-rate`);
  `src/content/quizzes/` (`quiz-sound-representation`). Not yet implemented.
- Status: covered
- Evidence / notes: Teaching — bit-rate desk with samples-per-second and
  bits-per-sample dials plus a blank dial, and the sample definition card
  (`rooms.md`); choirmaster topics (`npcs.md`). Retrieval —
  `quiz-sound-representation` (`q-dr-20`–`q-dr-23`). Application —
  `puzzle-tune-sampling` and `puzzle-count-the-bit-rate` (bit rate = sample rate ×
  bit depth). Spec sound terms only; no Nyquist, aliasing or codec internals.

## Topic: data-storage-units

- Spec reference: 1.2.1 — relationship between base-2 prefixes bit, nibble, byte,
  KB, MB, GB, TB, PB; data capacity calculations (`wjec-unit1.md` L560–571;
  1 KB = 1,024 bytes at L566).
- Game content / room ID: `room-storage-stacks`, `item-hex-nibble-card`,
  `puzzle-stack-the-bytes`, `puzzle-label-the-capacity`, `quiz-storage-units`,
  `hint-storage-capacity`.
- Code location: *planned* `src/content/rooms/` (`room-storage-stacks`);
  `src/content/puzzles/` (`puzzle-stack-the-bytes`, `puzzle-label-the-capacity`);
  `src/content/quizzes/` (`quiz-storage-units`). Not yet implemented.
- Status: covered
- Evidence / notes: Teaching — eight-rung unit ladder marked ×1024 from byte
  upward and a brass plate stating 1 KB = 1,024 bytes (`rooms.md`); keeper topics
  (`npcs.md`). Retrieval — `quiz-storage-units` (`q-dr-24`–`q-dr-27`).
  Application — `puzzle-stack-the-bytes` and `puzzle-label-the-capacity`. Base-2
  prose chain only; the inconsistent "Equivalent" column is not used (spec-check
  flag).

## Topic: data-compression

- Spec reference: 1.2.1 — principles of data compression, lossy and lossless;
  compression ratios and file-size reduction (`wjec-unit1.md` L573–578; worked
  ratios L696–700; lossless definition L694).
- Game content / room ID: `room-compression-press`, `item-compression-die`,
  `puzzle-pack-the-archive`, `puzzle-choose-the-compression`,
  `quiz-data-compression`, `hint-compression-ratio`.
- Code location: *planned* `src/content/rooms/` (`room-compression-press`);
  `src/content/puzzles/` (`puzzle-pack-the-archive`,
  `puzzle-choose-the-compression`); `src/content/quizzes/`
  (`quiz-data-compression`). Not yet implemented.
- Status: covered
- Evidence / notes: Teaching — two sample trays, lossless/lossy lever and glass
  ratio window (`rooms.md`); press operator topics (`npcs.md`). Retrieval —
  `quiz-data-compression` (`q-dr-28`–`q-dr-32`), ratio 10:2 and 2,000 KB → 400 KB.
  Application — `puzzle-pack-the-archive` and `puzzle-choose-the-compression`.
  Spec compression examples only; no codec internals.

## Topic: ai-ethics-and-implications

- Spec reference: game-wide framing for the AI's "mastery of the whole of Unit 1"
  criterion; no direct 1.2.1 assessment in this zone.
- Game content / room ID: `room-entry-interface`, `npc-the-ai`, `topic-ai-verdict`.
- Code location: *planned* `src/content/rooms/` (`room-entry-interface`);
  `src/content/npcs/` (`npc-the-ai`). Not yet implemented.
- Status: in progress
- Evidence / notes: Framing topic only in this zone — the AI's verdict and the Unit 2
  taunt carry no spec assessment and gate no puzzle. Full ethics coverage belongs to
  a later zone. Not part of this zone's win set.

## Room index

| Room ID | Purpose | Exits | Spec topics |
| --- | --- | --- | --- |
| `room-entry-interface` | Opening; AI's verdict | east: `room-switch-floor` | ai-ethics-and-implications (framing) |
| `room-switch-floor` | Prologue: transistor as a tiny switch | west: `room-entry-interface`, up: `room-binary-hall` | switch-to-bit |
| `room-binary-hall` | Zone hub and `startRoomId`; type bins and route diagram | down: `room-switch-floor`, west: `room-entry-interface`, north: `room-hex-deck` (switches-set), east: `room-character-tiles` (hex-read), south: `room-picture-mosaic` (characters-matched), up: `room-sound-choir` (picture-built), in: `room-storage-stacks` (sound-sampled), out: `room-compression-press` (stacks-sorted) | data-types, number-conversion |
| `room-hex-deck` | Hexadecimal nibbles; denary ↔ binary ↔ hex | south: `room-binary-hall` | number-conversion |
| `room-character-tiles` | ASCII, Unicode, characters and strings | west: `room-binary-hall` | character-representation |
| `room-picture-mosaic` | Vector/raster, resolution, bit and colour depth | north: `room-binary-hall` | graphics-representation |
| `room-sound-choir` | Sampling rate, bit depth, channels | down: `room-binary-hall` | sound-representation |
| `room-storage-stacks` | Base-2 units and capacity | out: `room-binary-hall` | data-storage-units |
| `room-compression-press` | Lossy, lossless, compression ratios | in: `room-binary-hall` | data-compression |

## Integration verdict

- **First zone PASS (2026-11-24).** The V4 whole-set `content-critic` pass over all
  six cards and `docs/content/walkthrough.md` (V4, N2, N6, N7, D3) returned no
  blocker or major after four passes. The ordered path from `room-binary-hall` to
  `game-won` is complete, every gate is satisfiable, all eight `covered` topics have
  teaching, retrieval and application sources, and no soft-lock remains. Entry-hazard
  counterplay is reachable (`once: true` on the three room-entry hazards). A
  whole-game verdict is not yet applicable: only the first zone is integrated.

## Open questions

- All "code location" entries are planned paths: no game code exists yet, so the
  code-lead must confirm the actual module paths when cards are converted to
  TypeScript (W6).
- The coverage graph is evidence, not proof; rebuild it from `docs/` once this map
  changes (AGENTS.md, "Two separate graphs").
- `ai-ethics-and-implications` remains `in progress` (framing only) and needs a
  future zone before it can be marked `covered`.
- `docs/content/narrative-principles.md` is still draft and awaits user sign-off; no
  first-zone card depends on it.
