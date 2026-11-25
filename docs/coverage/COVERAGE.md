# Coverage map

This file is the authoritative mapping from the GCSE Computer Science Unit 1
specification to game content. The separate coverage graph built from `docs/`
(indexed at `docs/graphify-out/graph.json`) includes this file and the source
PDF; it is **evidence** for these mappings, not proof that a topic is covered.
See [Two separate graphs](../../AGENTS.md#two-separate-graphs) in the root
`AGENTS.md` for the two graphs and their build rules.

Source material: `docs/exam-specs/gcse-unit-1-computer-science.pdf`; text
extraction at `docs/exam-specs/wjec-unit1.md` (line numbers cited below).

## Conventions

- Use one `## Topic: <id>` heading per specification topic; the id must match the
  entry in `docs/content/spec-topics.yaml`.
- IDs and aliases follow
  [content-rules.md §5](../developer/content-rules.md#5-id-and-alias-registry).
- Cite the PDF section/page and the code path/symbol. An empty field means
  "not mapped yet", not "covered".
- Status is one of `not started`, `in progress`, `covered`. Record evidence.
- A topic is `covered` only when accepted cards supply real teaching (an actor or
  in-world label), retrieval (a quiz question) and — where the spec calls for it —
  application (a puzzle) evidence (content-rules.md V3). Code locations are the
  generated modules under `src/content/authored/`, produced by
  `tools/content/generate.ts`
  ([content-toolchain.md §5](../developer/content-toolchain.md#5-generation)).
- Topic entries follow the `SpecTopic` contract in
  [content-toolchain.md §2](../developer/content-toolchain.md#2-authoring-format).

## Topic: switch-to-bit

- Spec reference: 1.1.1 Components, "learners should be aware of" — historical
  development from early transistors to modern microprocessors
  (`wjec-unit1.md` L318–325, "Early Transistors" / "Integrated Circuits").
- Game content / room ID: `room-switch-floor`, `item-switch-gauge`,
  `quiz-switchyard`, `topic-foreman-switches`.
- Code location: `src/content/authored/rooms.ts` (`room-switch-floor`);
  `src/content/authored/quizzes.ts` (`quiz-switchyard`).
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
- Code location: `src/content/authored/rooms.ts` (`room-binary-hall`);
  `src/content/authored/puzzles.ts` (`puzzle-sort-the-data-types`);
  `src/content/authored/quizzes.ts` (`quiz-data-types`).
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
- Code location: `src/content/authored/rooms.ts` (`room-hex-deck`);
  `src/content/authored/puzzles.ts` (`puzzle-set-the-switches`, `puzzle-add-with-carries`,
  `puzzle-shift-the-row`, `puzzle-read-nibbles`,
  `puzzle-check-the-overflow-register`); `src/content/authored/quizzes.ts`
  (`quiz-number-systems`).
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
- Code location: `src/content/authored/rooms.ts` (`room-character-tiles`);
  `src/content/authored/puzzles.ts` (`puzzle-match-characters`,
  `puzzle-make-room-for-the-welsh-letter`); `src/content/authored/quizzes.ts`
  (`quiz-character-representation`).
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
- Code location: `src/content/authored/rooms.ts` (`room-picture-mosaic`);
  `src/content/authored/puzzles.ts` (`puzzle-build-mosaic`, `puzzle-weigh-the-pixels`,
  `puzzle-scale-the-badge`); `src/content/authored/quizzes.ts` (`quiz-graphics-representation`).
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
- Code location: `src/content/authored/rooms.ts` (`room-sound-choir`);
  `src/content/authored/puzzles.ts` (`puzzle-tune-sampling`, `puzzle-count-the-bit-rate`);
  `src/content/authored/quizzes.ts` (`quiz-sound-representation`).
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
- Code location: `src/content/authored/rooms.ts` (`room-storage-stacks`);
  `src/content/authored/puzzles.ts` (`puzzle-stack-the-bytes`, `puzzle-label-the-capacity`);
  `src/content/authored/quizzes.ts` (`quiz-storage-units`).
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
- Code location: `src/content/authored/rooms.ts` (`room-compression-press`);
  `src/content/authored/puzzles.ts` (`puzzle-pack-the-archive`,
  `puzzle-choose-the-compression`); `src/content/authored/quizzes.ts`
  (`quiz-data-compression`).
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
- Code location: `src/content/authored/rooms.ts` (`room-entry-interface`);
  `src/content/authored/actors.ts` (`npc-the-ai`).
- Status: in progress
- Evidence / notes: Framing topic only in this zone — the AI's verdict and the Unit 2
  taunt carry no spec assessment and gate no puzzle. Full ethics coverage belongs to
  a later zone. Not part of this zone's win set.

## Room index

| Room ID | Purpose | Exits | Spec topics |
| --- | --- | --- | --- |
| `room-arrival` | World boot start: classroom scan, AI meeting and three in-character AI topics | east: `room-network-hub` | ai-ethics-and-implications (framing) |
| `room-network-hub` | Zone-choice starting point; one live port, others dark | west: `room-arrival`, east: `room-switch-floor`, in: `room-entry-interface` | none (navigation-only) |
| `room-entry-interface` | Older interface; AI's verdict strip | east: `room-switch-floor`, out: `room-network-hub` | ai-ethics-and-implications (framing) |
| `room-switch-floor` | Prologue: transistor as a tiny switch | west: `room-network-hub`, up: `room-binary-hall` | switch-to-bit |
| `room-binary-hall` | Switchyard hub and area `startRoomId`; type bins and route diagram | down: `room-switch-floor`, west: `room-network-hub`, north: `room-hex-deck` (switches-set), east: `room-character-tiles` (hex-read), south: `room-picture-mosaic` (characters-matched), up: `room-sound-choir` (picture-built), in: `room-storage-stacks` (sound-sampled), out: `room-compression-press` (stacks-sorted) | data-types, number-conversion |
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
- **Opening amendment PASS (2026-11-25).** The arrival and Network Hub rooms and
  the AI topics are validated with no findings. Code-lead landed the
  `in-room`/`in-area` seam; why-here and failure are active in `room-arrival`,
  escape in `room-network-hub`, with the catch-all global (C2/C6). The AI artefacts
  live in the arrival and hub NPC cards under the user-directed area ownership rule
  (bible §4.2). Both reviewers returned PASS on the moved cards after one stale-prompt
  minor was closed. The final whole-set `content-critic` pass (V4, N2, N6, N7, D3)
  verified the complete path from world boot `room-arrival` to `game-won`, all 11
  rooms, 41 NPC topics, 8 quizzes, 17 puzzles, 5 hazards and 6 hint ladders
  reachable, and no soft-lock; its one trace minor (overheat at beat E rather than
  step 2) was closed, then PASS. No new spec topic is covered by this amendment;
  `ai-ethics-and-implications` stays `in progress` and outside the win set. W6
  regeneration landed (`b47f878`). W7 runtime verification ran but returned
  **FAIL (2026-11-25)**: room-entry text, NPC conversation/quizzes and item
  USE/SHOW/PUT are non-functional in the running app, so the six gated exits
  never open and the authored path cannot reach `game-won`. The four blockers
  (E2E-1..4) are code findings routed to `code-lead`; the V4 content audit is
  unaffected. A W7 re-run is owed after those fixes land and the in-flight card
  amendments are regenerated. Evidence:
  `.opencode/scratchpad/slices/w7-opening-walkthrough/qa-report.md`.

## Open questions

- **Opening-sequence amendment (2026-11-25, approved).** The
  zone-choice starting point is a new zone, The Network Hub (`area-network-hub`,
  `room-network-hub`), reached after a classroom scan and a meeting with the AI in
  `room-arrival`. It is not a teaching zone yet: no spec topic is mapped to it and
  it contributes nothing to this zone's win set. `network-hardware` (1.3.1) is a
  separate, unscoped zone. As new topics are created in this map, new zones and the
  routes between them must be created in the bible, their topic files, cards and the
  V4 walkthrough; only The Switchyard is currently authored. See
  `docs/content/content-bible.md` §4.1 and §5.
- All "code location" entries are planned paths under `src/content/authored/`: the
  code-lead must confirm the actual generated module names when validated YAML is
  generated to TypeScript (W6).
- `ai-ethics-and-implications` remains `in progress` (framing only) and needs a
  future zone before it can be marked `covered`.
- `docs/content/narrative-principles.md` was approved by the user on 2026-11-24
  (see `status.md`); it is settled authority for writer briefs, not an open item.
