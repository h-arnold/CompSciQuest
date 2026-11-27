# Coverage map

This file is the authoritative mapping from the GCSE Computer Science Unit 1
specification to game content, together with explicitly non-assessed onboarding
entries. The separate coverage graph built from `docs/`
(indexed at `docs/graphify-out/graph.json`) includes this file and the source
PDF; it is **evidence** for these mappings, not proof that a topic is covered.
See [Two separate graphs](../../AGENTS.md#two-separate-graphs) in the root
`AGENTS.md` for the two graphs and their build rules.

Source material: `docs/exam-specs/gcse-unit-1-computer-science.pdf`; text
extraction at `docs/exam-specs/wjec-unit1.md` (line numbers cited below).

## Conventions

- Use one `## Topic: <id>` heading per coverage topic, including explicitly
  non-assessed onboarding topics; the id must match the entry in
  `docs/content/spec-topics.yaml`.
- IDs and aliases follow
  [content-rules.md §5](../developer/content-rules.md#5-id-and-alias-registry).
- Cite the PDF section/page and the code path/symbol. An empty field means
  "not mapped yet", not "covered".
- Status is one of `not started`, `in progress`, `covered`. Record evidence.
- Coverage eligibility and the teaching, retrieval and application evidence
  rules belong to
  [content-rules.md §3](../developer/content-rules.md#3-rule-catalogue) (P2, V3).
- Code locations name the generated modules under `src/content/authored/`;
  [content-toolchain.md §5](../developer/content-toolchain.md#5-generation) owns
  their production.
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

## Topic: tutorial-mechanics

- Spec reference: none — non-assessed game orientation. Boundary note: the
  ward's AI hand-holding satire makes no WJEC or medical claim. WJEC 1.2.3 covers
  ethical, social and legal implications of automated systems and effects on
  human interaction (`wjec-unit1.md` L760–816), with an AI-impact discussion
  activity at L2052–2059; this topic does not teach or complete that material.
- Game content / room ID: authored and validated `room-assistance-intake`,
  `room-assistance-demonstration`, `room-assistance-records`,
  `quiz-assistance-orientation`, `puzzle-calibrate-assistance` and
  `hint-assistance-orientation` in `area-assistance-ward`; focused CC-04
  content-critic re-review returned FAIL on a runtime selector blocker; the
  code repair and both final focused content/PCK re-reviews are PASS.
- Code location: planned `src/content/authored/rooms.ts`,
  `src/content/authored/quizzes.ts`, `src/content/authored/puzzles.ts` and
  `src/content/authored/hints.ts` after W6 generation.
- Status: in progress
- Evidence / notes: Gate 0 curated Assistance Ward set approved 2026-11-26;
  all cards returned and passed `content:validate` after W4 revision round 1.
  Both independent reviewers returned FAIL on 2026-11-26; their content
  findings are revised and CC-01 closed in code on 2026-11-27. PCK re-review
  returned PASS with no findings on 2026-11-27; content-critic returned PASS WITH
  MINORS. The CC-04 NPC revision validates, but focused content-critic re-review
  returned FAIL because the runtime could not then reach its empty-object `tell`
  reason producer; `code-lead` closed the blocker with independent PASS and both
  final focused content/PCK re-reviews returned PASS with no findings. The final
  whole-set V4 review returned PASS WITH MINORS with no blocker or major; focused
  minor closure is complete at W5 (content-critic PASS WITH MINORS, PCK PASS, no
  blocker or major). This entry exists so the practice systems have a valid topic
  reference (P1, H2).
  `maxScore 0`; all ward activities score 0; excluded from the win set because it
  is not `covered` with evidence. It must never be cited as evidence for
  `ai-ethics-and-implications` or any other specification topic.

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

## Topic: algorithms-and-pseudocode

- Spec reference: 1.4.1 — algorithms: defining algorithms, pseudo-code and flowcharts
  (`wjec-unit1.md` L1167; amplification L1197–1245 — pseudo-code common terms
  L1197–1221; the five flowchart symbols L1223–1245).
- Game content / room ID: `room-pattern-bureau`, `room-finished-rail`,
  `quiz-pattern-bureau`, `quiz-finished-rail`, `hint-pattern-bureau`,
  `hint-finished-rail`. The Mill Board (`room-warp-walk`) and the rota board
  (`room-finished-rail`) carry the dual-representation beats.
- Code location: _planned_ `src/content/authored/rooms.ts`
  (`room-pattern-bureau`, `room-finished-rail`); `src/content/authored/quizzes.ts`
  (`quiz-pattern-bureau`, `quiz-finished-rail`). Not yet generated (W6). The
  ten trace-pinned verb-action rows (walkthrough §8.6) land in
  `src/core/commands/InteractionRules.ts` (seam already there; W6 wiring).
- Status: covered
- Evidence / notes: Zone A — The Pattern Mill (cards accepted 2026-11-25, W4;
  V4 trace §8). Teaching — the five flowchart symbols stencilled in the
  Bureau's wood and the Loomwright's pseudo-code demonstration
  (`topic-loomwright-*`, learn-topic at trace step 21); the Mill Board
  (`room-warp-walk`) and the rota board (`room-finished-rail`) carry the
  dual-representation beats. Retrieval — `quiz-pattern-bureau` (4 questions,
  score 2) and the Finished Rail synthesis quiz `quiz-finished-rail`
  (4 questions, score 3 — the AO3 capstone: choose the construct for a
  fresh problem; sets `master-demonstrated`). Application — the Finished
  Rail's "PREDICT. THEN WEAVE." prediction of the master cloth beside its
  flowchart (step 30). `maxScore` 5 = bureau 2 + rail 3 (recorded sums,
  topic file §11).

## Topic: programming-constructs

- Spec reference: 1.4.1 — the construct strand: self-documenting identifiers,
  subroutines, input/output, sequence, selection, iteration (count- and
  condition-controlled), string handling, arithmetic and logical operations,
  local and global variables, arrays up to two dimensions
  (`wjec-unit1.md` L1169–1180; amplification L1247–1308; the two counting
  conventions L1217 and L1308).
- Game content / room ID: `room-1-4-concourse` (threshold, navigation-only),
  `room-pattern-bureau`, the Warp Walk junction (`room-warp-walk`), the four
  construct rooms (`room-threading-order`, `room-colour-court`,
  `room-weft-counter`, `room-endless-selvedge`), the Bobbin Window
  (`room-bobbin-window`), `room-finished-rail`, their four quizzes
  (`quiz-threading-order`, `quiz-colour-court`, `quiz-weft-tally`,
  `quiz-selvedge`) and six puzzles, the pattern cards (`item-pattern-card-*`),
  `hint-threading-order`, `hint-colour-court`, `hint-weft-tally`,
  `hint-selvedge`, `hint-bobbin-window`.
- Code location: _planned_ `src/content/authored/rooms.ts` (construct rooms);
  `src/content/authored/puzzles.ts`; `src/content/authored/quizzes.ts`. Not yet
  generated (W6). The ten trace-pinned verb-action rows (walkthrough §8.6)
  land in `src/core/commands/InteractionRules.ts` (seam already there; W6
  wiring).
- Status: covered
- Evidence / notes: Zone A — The Pattern Mill (cards accepted 2026-11-25, W4;
  V4 trace §8). Teaching — each resident's beat pairing the world term with
  the formal term on first use (sequence — the warp dress; selection — the
  shed and the plate; count-controlled — the weft tally's ratchet and slip
  tooth; condition-controlled — the selvedge's until plate; rogue values
  L1257–1261 — the rogue thread; input/output L1251 — the mill's bell and
  printer beat; local and global variables L1304–1306 — the Mill Board, the
  mill's shared figure; DIV/MOD — the bailing beat L1292–1293). The mill's
  own mechanics carry the abstractions: the shed is a selection of threads;
  the Finished Rail's Duty Rota is the spec's 6×5 2D array (L1308).
  Retrieval — the four construct quizzes (4 questions, score 2 each = 8).
  Application — six puzzles mending the cousin's slop (score 1 each = 6):
  the warp dress, the intake bell, the counting ratchet, the shed plate and
  else branch, the condition plate, the rogue thread. `maxScore` 14 =
  4×2 quiz + 6 puzzle (recorded sums, topic file §11). Deferrals: arrays
  (1D pigeonholes; the 2D Duty Rota, L1308) and string handling (the
  addressing plate's find-and-replace beat, L1263–1280, in spirit, no
  Python method names) are taught in-zone without a dedicated quiz/puzzle
  retrieval beat; the applying-and-extending beats belong to the 1.2.2 zone
  (`maxScore` 0 there if both are live).

## Room index

| Room ID                         | Purpose                                                                                                                         | Exits                                                                                                                                                                                                                                                                                                                    | Spec topics                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `room-arrival`                  | World boot start: classroom scan, AI meeting and three in-character AI topics                                                   | east: `room-network-hub`                                                                                                                                                                                                                                                                                                 | ai-ethics-and-implications (framing)                                  |
| `room-network-hub`              | Zone-choice hub; south ward route open, east/north teaching ports dark until calibration                                        | west: `room-arrival`, east: `room-switch-floor` (`tutorial-complete`), in: `room-entry-interface`, north: `room-1-4-concourse` (`tutorial-complete`), south: `room-assistance-intake`                                                                                                                                    | none (navigation-only)                                                |
| `room-assistance-intake`        | Ward command tour: looking, examining, carrying and Nia's observation recovery                                                  | north: `room-network-hub`, east: `room-assistance-demonstration`                                                                                                                                                                                                                                                         | tutorial-mechanics (non-assessed practice)                            |
| `room-assistance-demonstration` | Ward object/door practice and Mateo/Kofi recoveries                                                                             | west: `room-assistance-intake`, north: `room-assistance-records`                                                                                                                                                                                                                                                         | tutorial-mechanics (non-assessed practice)                            |
| `room-assistance-records`       | Ward conversation, quiz, hint, records and final calibration practice                                                           | south: `room-assistance-demonstration`, west: `room-network-hub`                                                                                                                                                                                                                                                         | tutorial-mechanics (non-assessed practice)                            |
| `room-entry-interface`          | Older interface; AI's verdict strip and ward-calibration plaque                                                                 | east: `room-switch-floor` (`tutorial-complete`), out: `room-network-hub`                                                                                                                                                                                                                                                 | ai-ethics-and-implications (framing)                                  |
| `room-switch-floor`             | Prologue: transistor as a tiny switch                                                                                           | west: `room-network-hub`, up: `room-binary-hall`                                                                                                                                                                                                                                                                         | switch-to-bit                                                         |
| `room-binary-hall`              | Switchyard hub and `startRoomId` of `area-1-2-1-data-representation`; type bins and route diagram                               | down: `room-switch-floor`, west: `room-network-hub`, north: `room-hex-deck` (switches-set), east: `room-character-tiles` (hex-read), south: `room-picture-mosaic` (characters-matched), up: `room-sound-choir` (picture-built), in: `room-storage-stacks` (sound-sampled), out: `room-compression-press` (stacks-sorted) | data-types, number-conversion                                         |
| `room-hex-deck`                 | Hexadecimal nibbles; denary ↔ binary ↔ hex                                                                                      | south: `room-binary-hall`                                                                                                                                                                                                                                                                                                | number-conversion                                                     |
| `room-character-tiles`          | ASCII, Unicode, characters and strings                                                                                          | west: `room-binary-hall`                                                                                                                                                                                                                                                                                                 | character-representation                                              |
| `room-picture-mosaic`           | Vector/raster, resolution, bit and colour depth                                                                                 | north: `room-binary-hall`                                                                                                                                                                                                                                                                                                | graphics-representation                                               |
| `room-sound-choir`              | Sampling rate, bit depth, channels                                                                                              | down: `room-binary-hall`                                                                                                                                                                                                                                                                                                 | sound-representation                                                  |
| `room-storage-stacks`           | Base-2 units and capacity                                                                                                       | out: `room-binary-hall`                                                                                                                                                                                                                                                                                                  | data-storage-units                                                    |
| `room-compression-press`        | Lossy, lossless, compression ratios                                                                                             | in: `room-binary-hall`                                                                                                                                                                                                                                                                                                   | data-compression                                                      |
| `room-1-4-concourse`            | Zone A threshold: cold concourse under THE PATTERN MILL sign (Y Felin painted beneath)                                          | south: `room-network-hub`, east: `room-pattern-bureau`                                                                                                                                                                                                                                                                   | none (navigation-only)                                                |
| `room-pattern-bureau`           | The Pattern Mill's start: the Loomwright, five flowchart symbols stencilled in the wood, the Demonstration Book                 | west: `room-1-4-concourse`, east: `room-warp-walk`                                                                                                                                                                                                                                                                       | algorithms-and-pseudocode, programming-constructs (input/output beat) |
| `room-warp-walk`                | Junction corridor: the Mill Board (global-variable beat), all mill doors visible, the rail door under four glass section lights | west: `room-pattern-bureau`, north: `room-threading-order`, south: `room-weft-counter`, in: `room-colour-court`, out: `room-bobbin-window`, down: `room-endless-selvedge`, east: `room-finished-rail` (gated — the five flags)                                                                                           | programming-constructs (Mill Board, L1304–1306)                       |
| `room-threading-order`          | The warp dress: sequence                                                                                                        | south: `room-warp-walk`                                                                                                                                                                                                                                                                                                  | programming-constructs                                                |
| `room-colour-court`             | The shed and selection: pick trolley routed by the plate's condition                                                            | out: `room-warp-walk`                                                                                                                                                                                                                                                                                                    | programming-constructs                                                |
| `room-weft-counter`             | Count-controlled iteration: the ratchet and slip tooth                                                                          | north: `room-warp-walk`                                                                                                                                                                                                                                                                                                  | programming-constructs                                                |
| `room-bobbin-window`            | Input/output: mend the intake bell; the addressing plate's find-and-replace beat (string handling, in spirit)                   | in: `room-warp-walk`                                                                                                                                                                                                                                                                                                     | programming-constructs                                                |
| `room-endless-selvedge`         | Condition-controlled iteration: the until plate and the rogue thread                                                            | up: `room-warp-walk`                                                                                                                                                                                                                                                                                                     | programming-constructs                                                |
| `room-finished-rail`            | Capstone: the master cloth, the rota board (the 6×5 2D array), PREDICT. THEN WEAVE., the Loomwright's despatch audit            | west: `room-warp-walk`                                                                                                                                                                                                                                                                                                   | algorithms-and-pseudocode, programming-constructs                     |

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
  unaffected. A W7 re-run follows once those fixes land and the in-flight card amendments
  are regenerated. Evidence:
  `.opencode/scratchpad/slices/w7-opening-walkthrough/qa-report.md`.
- **Zone A PASS (2026-11-25).** The Pattern Mill's six cards (rooms including
  the concourse and the hub exit amendment, npcs, puzzles, quizzes, hazards,
  hints) validated clean before review; pck-reviewer returned PASS WITH MINORS
  and content-critic's 8 majors and 12 minors were all resolved or
  editor-routed. The final whole-set critic pass over the cards plus the trace
  §8 extension (V4, N2, N6, N7, D3) returned PASS WITH MINORS — no blocker or
  major; three minors dispositioned editor-side (the rail door's four-glass-
  lights prose fix; the bobbin cousin-keyword disjoint note; the W6-scenery
  ids declaration note). `programming-constructs` and
  `algorithms-and-pseudocode` are `covered` with `maxScore` 14 + 5 = 19
  (recorded sums, topic file §11); the win set is ten topics and the end
  state is the rail quiz pass (trace §8 step 30). The ten verb-action rows
  (trace §8.6) and four scenery declarations are the W6 contract;
  `src/content/authored/*` for this area is still _planned_ until code-lead
  generates them, and a W7 browser walkthrough follows that wiring and the zone-1 runtime
  fixes.

## Open questions

- **Opening-sequence amendment (2026-11-25, approved).** The
  zone-choice starting point is a new zone, The Network Hub (`area-network-hub`,
  `room-network-hub`), reached after a classroom scan and a meeting with the AI in
  `room-arrival`. It is not a teaching zone yet: no spec topic is mapped to it and
  it contributes nothing to this zone's win set. `network-hardware` (1.3.1) is a
  separate, unscoped zone. As new topics are created in this map, new zones and the
  routes between them must be created in the bible, their topic files, cards and the
  V4 walkthrough; The Switchyard and the opening areas are authored, while The
  Pattern Mill's accepted cards await W6 generation. See
  `docs/content/content-bible.md` §4.1 and §5.
- Code locations marked _planned_ remain targets under
  `src/content/authored/`; code-lead must confirm the generated module names when
  validated YAML is generated to TypeScript (W6).
- **Assistance Ward (2026-11-26/27, Gate 0 approved; W4 PASS).**
  `tutorial-mechanics` is a non-assessed onboarding topic, `in progress`,
  `maxScore 0`, and outside the win set. All six ward cards and five owning-card
  amendments are content-accepted; batch and final focused content/PCK reviews
  are green, CC-01–CC-07 and AW-PCK-01–AW-PCK-10 are closed, and all six cards now
  carry `status: approved` and revalidate cleanly. The three approved room IDs are
  populated so the explicit hint ladder resolves in every ward room. The V4
  insertion routes through the ward and proves `tutorial-complete` before the three
  teaching-zone gates. The final whole-set V4 review returned PASS WITH MINORS with
  no blocker or major; the minor ledger records the accepted dial-seam deferral and
  focused closure confirmation is complete; the approved conditional `use` seam
  landed in W6 with 92 files / 652 tests green, so the ward W7 playtest is unblocked.
- `ai-ethics-and-implications` remains `in progress` (framing only) and needs a
  future zone before it can be marked `covered`.
