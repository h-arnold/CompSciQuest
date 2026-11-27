# Topic capture: 1.4 Algorithms — The Rule Machine (working title, super-region)

**Status: DRAFT — Gate 0 ideation capture (W1–W2). Not approved. No writer briefed.**
This file holds the idea pool co-developed with the user on 2026-11-25 so that no
idea lives only in conversation. When a zone is fleshed out in detail, its section
splits into its own `docs/content/topics/<zone>.md` and goes to the user for
approval; only then is the bible amended (§5, §7, §9, §12) and only then does the
zone's Gate 1 begin. Every ID below is a working name: `proposed — needs editor
allocation and user approval` (D2, bible §9). Course facts cite
`docs/exam-specs/wjec-unit1.md` line numbers; the spec is authoritative.

## 0. Settled decisions (user, 2026-11-25, via interview)

- Unit 1.4 is split into **four areas (zones)**: programming constructs; searching
  and sorting; maintainable programs; validation and verification.
- **1.5.1 Principles of programming is folded into the maintainable-programs
  zone** (readability, extensibility, maintainability, modularity, L1520–1557,
  taught alongside 1.4.1's self-documenting identifiers and subroutines). That
  zone's topic file cites both 1.4.1 and 1.5.1.
- Zone A (constructs) is **designed first** when scoping begins.
- **Second batch of ratified decisions (2026-11-25, post-curation):**
  - **Setting: the Pattern Shop** — Zone A is a Welsh woollen mill, working zone
    title **The Pattern Mill**; the office-flavoured posts rename to loom roles
    (see §2, Pattern Shop adoption); mechanics, flags and gates carry unchanged.
  - **Coverage: two spec topics** — `algorithms-and-pseudocode` and
    `programming-constructs`; every construct room binds the latter.
  - **Arrays: taught here** — 1D and 2D in this zone (pigeonholes and the rota);
    1-based loop counting vs 0-based indexing stated as two conventions, once.
  - **Avalanche: arms after the demonstration** — the stack avalanche arms only
    once the Stamp Clerk's demonstration is complete and the selection is still
    unresolved; both telegraphs are always read before any risk of a life.
- Not yet recorded in the bible: area IDs, topic index revision and the approval
  record entry are pending a bible amendment to be put to the user.

## 1. Region arc — the slop agent thread

The unifying antagonist of the 1.4 super-region is a **cousin of the main AI**
(user's idea, 2026-11-25): a code-generation model installed in the same batch,
gushing, tireless, endlessly confident and reliably wrong — in-world slop. Where
`npc-the-ai` is rule-obsessed bureaucracy, the cousin is the rule-void mirror:
fluency without correctness. Working name `npc-slop-cousin` (proposed, D2).

- **Role:** anti-teacher; has left one broken "optimisation" in every zone.
- **Voice (A1):** warm, sycophantic, run-on; one recurring phrase — "Great
  question!" — delivered before each wrong answer. Never mocks the learner
  (harm floor, narrative-principles §8); it adores the pupil. targeting the
  situation and itself only.
- **Relationships:** the AI regards it as an embarrassment ("a cousin from the
  marketing side of the family"); the zone keepers resent its "help" — opposing
  motivations preferred (A1).
- **Harm floor note:** slop artefacts fail in cartoon ways only; no mockery of the
  learner; no Welsh references as joke targets.
- **Arc shape (no new spine key nodes — N2):** each zone ends with one mended
  artefact; the per-zone mending mirrors the spec verbs "write, correct, test and
  interpret" (L1169). Region synthesis lands in the existing Attention Audit and
  Final Demonstration nodes, not in a new regional gate.
- **Comeuppance (Resolution-flavoured, bounded):** reassigned to write the
  machine's documentation; it manages one comment. Dry, in-world.
- **Ethics hook (P-e):** the cousin is the eventual in-world home for
  `ai-ethics-and-implications` (still `in progress` in COVERAGE.md):
  confident-but-wrong machine output is the oversight theme embodied.
- **Open anchoring question:** user proposed it "for programming techniques";
  current draft anchors it in Zone A with recurrences in B, C, D (artefacts on
  whichever area card it appears in, bible §4.2). User to steer.

## 2. Zone A — Programming constructs (draft; designed first)

Spec: 1.4.1 — pseudo-code and flowcharts (L1167, guidance L1197–1245);
input, output, sequence, selection, iteration, counts and rogue values, string
handling, mathematical and logical operations, local and global variables, arrays
up to two dimensions (L1169–1180); constructs amplified L1253–1308.

**User requirement (2026-11-25, firm):** a **separate room each, with puzzle
and/or quiz, for sequence, selection, count-controlled iteration and
condition-controlled iteration** — four construct rooms minimum.

### Room cluster sketch (draft)

1. Entry room — defining algorithms: pseudo-code conventions
   (L1197–1221) and flowchart symbols (L1223–1245), stencilled into the
   setting itself; teaching beat + retrieval quiz. **Frame agreed in
   principle (2026-11-25): the entry room is the Registrar's Licence Desk —
   constructs are stamped counterfoils issued after a demonstration, then
   carried to each room's resident and passed over (give-matched topics;
   seam exists in the parser union and `npcHandlers.ts`; exact contract
   restated in the brief and proven in the trace).**
2. **Sequence room** (L1253) — instructions strictly in order; draft puzzle: the
   cousin has shuffled a procedure's steps; restore the order.
3. **Selection room** (L1255) — the fork; `if ... else`, `case select`; draft
   puzzle: route by condition; the cousin's version is missing its `else`.
   Her unsorted pile grows because everything routes urgent: **the stack
   overflows when the fork is wrong** — subtle stack-overflow nod (see the
   cast note and the flavour bar below; colour only, never taught).
4. **Count-controlled iteration room** (`for i = 1 to 10 ... next i`,
   L1217; counts, L1259) — draft puzzle: the cousin's loop is off-by-one; set the
   counter so the machine stamps exactly ten.
5. **Condition-controlled iteration room** (`repeat ... until`,
   `while ... repeat`, L1220–1221; rogue values, L1261) — draft puzzle: the
   cousin's `while` condition is always true and the corridor never ends; supply
   the terminating condition / rogue value.
6. Strand homes still open (see open questions): input/output, mathematical and
   logical operators (L1282–1302), string handling (L1263–1280), local/global
   variables (L1304–1306), 1D/2D arrays (L1308; overlap with planned 1.2.2
   `data-and-file-structures` — teach here or apply-only with `maxScore 0`,
   the `switch-to-bit` model).

### Setting options — SETTLED 2026-11-25: the Pattern Shop (see Pattern Shop adoption below; options retained as rename-level mappings for record)

1. **The Instruction Office** — procedures written and followed to the letter;
   flowcharts painted on the floor (rounded doorway = terminator, fork =
   decision, window = input/output, box = process); a queue that keeps
   rejoining itself; a till where counts live.
2. **The Signal Box** — Welsh railway signal box; constructs as literal track
   routing (sequence = the road you set, selection = points, iteration = the
   loop line); dry signalman humour; strong, accurate Welsh heritage.
3. **The Pattern Shop** — weaving patterns as algorithms; iteration = the
   repeated weft; Welsh textile heritage.

### Cast and situations (flesh-out in progress; agreed in conversation 2026-11-25)

Per construct, one resident with an issue only that construct solves; the
player collects the construct counterfoil at the Licence Desk and passes it
over (user mechanic, 2026-11-25). Six zone actors plus game-wide AI,
predecessor and the recurring cousin.

- **The Registrar of Constructs** (entry room). Dry, bureaucratic,
  stamp-cultured; "Stamps don't lie. People do." Motivation: paperwork without
  error. Relationship: institutional loathing of the cousin, who once filed
  him under *miscellaneous*. Teaches pseudo-code and the five flowchart
  symbols; issues each construct only after a demonstration (retrieval beat).
- **The Usher** (sequence, L1253). Timid, ritual-bound; never once been
  first. Motivation: everything in its order, always. Issue: the morning
  spin-up has been slopped — every step correct, the order wrong; the doors
  open before the brake releases. Puzzle beat: the player restores the step
  order, then delivers the licence; demonstration includes one deadpan
  wrong-order flash. Relationship: trade insults with the Stamp Clerk ("at
  least your job can't be done twice" / "at least yours can't be done in the
  wrong order").
- **The Stamp Clerk** (selection, L1255). Fast, crisp, contemptuous of
  dithering — and stuck dithering for days without her diamond plate (the
  flowchart rhombus as a physical object). Motivation: no case unhandled, no
  `else` forgotten. Issue: the fork sends everything urgent, never routine,
  and her unsorted stack grows until **it overflows**. Prose seeds: the stack
  climbs trolley, floor and wall, "one sheet from going over" on a yellowed
  index card; after the fix, two polite trays, urgent and routine.
  **Subtle stack-overflow nod — the user's device (2026-11-25):** the phrase
  never appears as vocabulary; the Registrar's incident form carries it as
  fields — `INCIDENT FORM 7741: Field 9, STACK: OVERFLOWED. Field 10, CAUSE:
  URGENT (ALL).` Demonstration: she sorts a tray with the player predicting
  each destination (predict-then-see). Comparison operators (L1282–1291)
  live inside her conditions.
- **The Franking Clerk** (count-controlled iteration, L1217, L1259). Counts
  everything, including her own stamps. Motivation: exactly ten means exactly
  ten. Relationship: professional respect for the Queue Warden ("she waits; I
  count"), cold exasperation with the cousin ("he counted from one, once, and
  then stopped caring"). Issue: the cousin "improved" the franking machine to
  stamp *lots* — nine ruins the Inspector's day, eleven stamps the player,
  the desk and somebody's duck. Puzzle beat: the counting disc (a ratchet
  with ten teeth) re-tunes the loop; predict the final count; the
  one-to-ten versus zero-to-nine question is a writer beat pending PCK check.
- **The Queue Warden** (condition-controlled iteration, L1220–1221, rogue
  values L1261). Years in the loop corridor; a patience curdled into
  something mineral. Motivation: the line must end. Relationship: the
  Franking Clerk's professional sibling — counting versus waiting is the
  for/while distinction made flesh. Issue: the exit plate needs an `until`;
  the cousin replaced it with "while the queue is nice"; the queue has been
  circulating since Tuesday and the back of it has organised a whist
  evening. Puzzle beat: reinstate the condition plate and introduce the
  rogue value — a counterfoil reading `-1`, a value that never arises in
  honest work: a signal, not a datum (L1261).
- **The slop cousin** recurs through all four rooms as the vandal (one broken
  "improvement" per room: reordered steps, missing `else`, off-by-one stamp
  counter, `while` that never ends), closing each rescue with "Great
  question!" and no admission of error.

The cast currently reads "office" (register, plates, franking): confirming
the Instruction Office setting would fit it as named; the Signal Box and
Pattern Shop readings would rename the posts and keep the mechanics.

**Flavour bar (spec discipline, like the hub's 1990s label).** The
stack-overflow nod — the avalanche, the incident form's `STACK: OVERFLOWED`
field — is in-world colour only: never in teaching text, a quiz item, a hint,
an NPC explanation presented as fact, a coverage evidence note or a
`## Topic:` entry. "Stack overflow" is not Unit 1 vocabulary (the spec's
error list at 1.5.3 does not name it); it must not be taught or asserted
anywhere.

### Cast, hazards, assessment (draft)

- **Cast:** a Protocol Clerk — deadpan, procedure-obsessed, the cousin's foil;
  the cousin "helps" by rewriting the noticeboards in slop.
- **Hazards:** **DECIDED (user, 2026-11-25) — the stack avalanche is the
  selection room's telegraphed hazard** (machine faults): triggers on room
  entry while the selection is unresolved; telegraph is the yellowed index
  card ("one sheet from going over") plus the Stamp Clerk's line; `once:
  true`; failure costs a life and returns the player to the area
  `startRoomId`, never resetting puzzle phase and never offering a hint
  (H1, §8). Open seeds: a runaway loop (machine faults), a bit-rot-eaten
  terminator (corruption), a clerk pop-quiz (cartoon school). Final hazard
  list at topic-file stage.
- **Assessment:** quizzes per topic with AO1/AO2; AO3 permitted here
  (P3: design/evaluation topics include algorithms). Puzzles carry the
  application beats (P2).

### Pattern Shop adoption (user decision, 2026-11-25) — working names, D2

The office skeleton re-homes into a Welsh woollen mill — zone working title
**The Pattern Mill**. Mechanics, flags, gates and licences carry; only nouns
move. Every name below is `proposed — needs editor approval (D2)`.

- Rooms: the Pattern Bureau (Licence Desk; the Loomwright's counter), the Bobbin
  Window (Receiving Window: bobbins in, cloth out), the Warp Walk (Trunk Run;
  its wall board becomes the Mill Board), the Threading Order (sequence: the
  warp must be dressed in order), the Colour Court (selection: which colours
  lift — the shed in weaving is literally a selection of threads), the Weft
  Counter (count-controlled: exactly ten passes), the Endless Selvedge
  (condition-controlled: weave until the pattern ends), the Finished Rail (Run
  Desk: the mended procedures join into one master cloth).
- Cast: the Loomwright (Registrar), the Warp Dresser (Usher; timid, ritual-bound;
  the cousin shuffled the threading order), the Shed Opener (Stamp Clerk; her
  unsorted pick-pile overflows), the Weft Tally (Franking Clerk; counts
  everything, including her own passes), the Selvedge Warden (Queue Warden), the
  Bobbin Lad (Despatch Clerk). Mill-flavoured demonstration beats carry the same
  teaching shapes.
- The construct tokens become **pattern cards** (a stamped card per construct,
  issued at the Bureau after a demonstration).
- The rogue value becomes a **rogue thread**: a dyed colour that never arises in
  this pattern, reading -1 — a signal, not a datum (L1261, kept verbatim in
  spirit).
- The slop cousin's vandalism per room: thread order shuffled (sequence), the
  shed plate dropped (selection), the shuttle run "lots" (off-by-one), "while
  the cloth is nice" (condition).
- The decided avalanche arms after the demonstration (see the hazard line): a
  player who enters the Colour Court after the demonstration, licence not yet
  delivered, may be buried in the pick-pile — telegraph unchanged (the yellowed
  index card and the Shed Opener's line), `once: true`.
- Welsh: the mill itself carries the region's Welshness (the west Wales woollen
  trade); a **carthen** in the warp room as a decorative examinable (accurate,
  background); the adopted Welsh bank (SWYDDFA plate, Machynlleth postmark)
  remaps to mill equivalents — woven door label, mill's own stamp — at
  topic-file stage.
- Quality Book (the incident form's new home): Field 9, STACK: OVERFLOWED;
  Field 10, CAUSE: URGENT (ALL) — the flavour bar is unchanged: colour only,
  never taught.

### Curation outcome (post-ideation sub-stage, 2026-11-25) — RATIFIED by the user the same day: two coverage topics; arrays taught here; avalanche arms after the demonstration; setting = Pattern Shop (see above)

Six ideation returns (area, npc, puzzle, quiz, hazard, hint) read together and
curated: duplicates rejected, overlaps folded, misfits parked. Everything below
is `proposed — needs editor approval (D2)` until the user ratifies and the
bible amendment records it. Survivors only.

**Room map (area-writer's set, adopted as the working skeleton):** eight rooms —
`room-licence-desk` (entry + `startRoomId`; the five flowchart symbols stencilled
into the architecture; the Registrar's Demonstration Book), `room-receiving-window`
(input/output + string handling), `room-trunk-run` (`navigation-only` junction
with the Office Board), `room-spin-up-lobby` (sequence), `room-stamp-chute`
(selection), `room-franking-counter` (count-controlled + DIV/MOD bundle
arithmetic), `room-loop-corridor` (condition-controlled + rogue value), and
`room-run-desk` (zone climax). No maze: two rank pairs off the trunk, clusters
reconverge (N2). Gate G1 (desk east door: demonstration on record), G2 (trunk
east door: all four rooms mended), G3 (Run Desk: PREDICT. THEN POST. — a correct
prediction before the master procedure despatches). Rename-level mappings for the
Signal Box and Pattern Shop readings are preserved in the returns: mechanics,
flags and gates carry; only nouns move.

**Zone flow (recommended shape):** per construct room — teaching beat →
retrieval quiz → its `onPass` stamps that construct's counterfoil (the COLLECT)
→ player GIVEs it to the resident (the PASS; give-matched topics, `transfer-item`)
→ the resident applies it to their problem (application beat) → the room puzzle
mends the slop (fix flag). The desk quiz covers pseudo-code/flowcharts only.
Alternative ordering (all counterfoils issued at the desk after one quiz) is
available but over-hubs the desk and was the weaker read; rejected in
curation unless the user prefers it.

**Licences and flags (working names):** `item-licence-sequence`,
`item-licence-selection`, `item-licence-count-loop`, `item-licence-condition-loop`;
give flags `licence-*-given`; fix flags `spin-up-ordered`,
`selection-balanced`, `frank-counted-right`, `condition-plate-set` +
`rogue-value-filed` (the corridor's gate is two actions). Give-matched topics
have N5 stray-licence redirects; the give→transfer and quiz-issues-item seams
must be proven in the V4 trace before any card relies on them.

**Cast (six + cameos):** the Registrar of Constructs (absorbs the old Protocol
Clerk's foil role), the Usher, the Stamp Clerk, the Franking Clerk, the Queue
Warden, the slop cousin (one broken "improvement" per room, defences in-room
scoped, "Great question!" BEFORE each wrong defence); plus a new Despatch Clerk
for the Receiving Window (motivation: no delay — "a fast wrong answer or a slow
right one"; keeps the only unslopped board, his pride). NPC pool details: voices,
per-actor relationships, catch-alls scoped in-room per T2, ~35 topic ideas,
eleven actor states with message-only `onEnter`, optional in-room AI audit cameo
(`topic-ai-licence`, flavour only), anti-leak rule (rogue-value teaching gives the
concept; the −1 counterfoil is the room's application; the spec's `grade = -1`
example appears only in a quiz).

**Assessment (adopted with one addition):** six quizzes — the desk quiz, one per
construct room, PLUS a synthesis quiz at the Run Desk (AO3 capstone: choose the
right construct for a fresh problem — mirrors the spec verbs "write, correct,
test and interpret", L1169). The Usher's quiz stays but reads sequence
principles (including input-before-output discipline, L1251) rather than
re-testing the physical reordering the puzzle owns. passMark 3 of 4 (count, P5);
pool prefix `q-pc-01…` (proposed); per-room AO mixes AO1×1/AO2×2/AO3×1 in the
four rooms. Misconception bank: nine spec-rooted items (exclusive "to"; tally/counter
drift; `>=` read as strictly greater; `=` read as assignment; both arms run;
`repeat…until` body assumed skippable; rogue value mistaken for an error;
shapes judged by silhouette; XOR read as OR).

**Hazards (recommendation, final list at topic-file stage):** the avalanche
(DECIDED) + C2 dry-ink pad (corruption, count room, examine-first disarm) + C4
the cousin's worksheet (cartoon school, tempting-object trap — the honest
version of the dropped pop-quiz seed). All three palette themes, three different
trap shapes, no room doubled, Licence Desk always clean. Parked as alternates:
C1 brake lever (machine faults — avalanche already holds the theme), C3 timed
fuse (needs a code-lead read on the `schedule`/`on-schedule` seam before
anything is authored against it), C5 audit clipboard (duplicates C4's shape),
C6 rotted terminator plate (collides with the room's puzzle plate). A hazard
never starts a quiz (failure-consequence model); reserved palette IDs
(`hazard-overheat`, `hazard-pop-quiz`) stay unspent here.

**Hints:** six ladders (desk + four rooms + the synthesis quiz), voice = the
Registrar's "guidance for learners" index cards (alternates: manual margin
notes; a resident's muttered line at level 1 only). Unlock keys
`failed-attempts:<quizId>` 1/2/3 (quiz ladders) and `turns-since:<puzzleId>`
3/5/7 (puzzle ladders), `cooldownTurns: 2`, zero penalty, no answer ever
revealed, no L-numbers in in-game text, and no hint targets the avalanche
(flavour-bar discipline).

**Strand homes (working plan):** input/output → the Receiving Window; string
handling → woven into the Window (the cousin's slips: "every duck became data;
Data Pond, Llanberis"); comparisons → woven into selection (plus a CASE rail so
`case select` is taught, L1255); DIV/MOD → woven into the franking counter
(bundles: 26 DIV 4 = 6 remainder 2, and she posts whole bundles only); AND/OR →
the loop corridor's compound `until` (the cousin's "OR with nice on both sides"
plate fails informatively); NOT/XOR → assessment-only for now (truth tables are
1.6.1's); local/global → the Run Desk beat (Office Board reading 3, drawer tally
reading 10). Arrays: curation takes NO side (see decision point below).

**Flavour and Welsh (adopted):** SWYDDFA plate, Machynlleth postmark, paned mug,
whist cards, stopped clock, Talybont/Aberystwyth postmark album pages — accurate,
background, never a joke target. The stack-overflow nod stays form-field colour
only. Eleven decorative examinables proposed with `portable` from plausibility.

**Rejected or superseded at curation:** the PLAUSIBLE-stamp cameo (Zone D's
Inspector owns that joke); the desk-issues-everything wallet model (over-hubs
the desk); the `qz-a-` prefix (D2 wants `quiz-`/`q-`); the hint-writer's invented
`plan-algorithms` target id; the Protocol Clerk as a third procedural NPC; the
"in Zionist-cheap pencil"-class garbled strings in two returns (none may reach a
card — writers rewrite all provisional telegraphs anyway).

**PCK checks owed at review:** the 26/4 dry-run figures; −1 wording against
L1261; repeat-until test-after-body semantics; 1-based loop counting vs 0-based
array indexing stated as two conventions ONCE at the arrays beat (if adopted);
non-spec stencil shapes (hexagon, trapezium) never named as real flowchart
symbols.

## 3. Zone B — Searching and sorting (draft)

Spec: 1.4.1 L1182–1188; characteristics and performance guidance L1310–1412.
Five algorithms: linear search, binary search, bubble sort, selection sort,
insertion sort.

- **Setting options:** ① The Records Office — pigeonhole archive the cousin has
  "optimised"; each algorithm a physical act (adjacent swaps ripple down a
  shelf; scanning for the smallest; building a sorted hand; the corridor that
  splits at the midpoint — "you may only consult the middle card"). ② The Lost
  Property Office — everything the machine has ever lost, never sorted; the
  case for sorting writes itself. ③ The Aviary — numbered leg-rings on ducks
  and a red kite; the whimsy option.
- **Cast:** a Registrar (meticulous, alphabet-fixated) as the competent
  counterpoint; the cousin's shuffled filing is the running obstacle.
- **Puzzle shapes:** hand-trace each sort; judgement gates on which algorithm
  suits which data (bubble sort for nearly-sorted structures, L1351 — AO3);
  binary search only works on the sorted half (L1325).
- **Welsh touch:** ledgers of Welsh placenames (accurate, background).

## 4. Zone C — Reliable, maintainable programs (draft; 1.4.1 + 1.5.1)

Spec: 1.4.1 maintainability threads (self-documenting identifiers L1247,
subroutines L1249, declares/call L1203–1204) + 1.5.1 principles L1520–1557.
The "write, correct, test and interpret" verbs land hardest here.

- **Setting options:** ① The Maintenance Yard — workbenches and test rigs;
  Welsh slate nameplates as self-documenting identifiers; an unlabelled grey
  box called `Function2` as the recurring sight-gag (L1247); subroutines as
  standard modules other machines call. ② The Proofing House — a print works
  where readability, comments and errata slips are the trade; Welsh printing
  heritage.
- **Cast:** a Fitter (patient, thorough, dry) or a Compositor.
- **Hazards:** test-rig overheat (second use of the reserved `hazard-overheat`
  id), a photocopier bit-rot pile-up, a safety slide-show pop quiz.
- **Puzzle shapes:** rename-and-refactor the grey box (`calcAverage`, L1247);
  assemble subroutines from modules; dry-run tables; the 1.5.1 principles as
  yard standards.

## 5. Zone D — Validation and verification (draft, own area per user)

Spec: 1.4.1 L1190–1193; guidance L1414–1516. Five validation checks (type,
range, presence, format, length); two verification methods (double keying,
visual check); algorithms that validate and verify.

- **Setting options:** ① The Weighbridge — data enters the machine here and
  every parcel is checked; format check on postcodes uses the spec's own
  `TS23 3DX` (L1455); verification as double keying — two clerks key the same
  ledger and compare (L1484). ② The Registry Desk — the password re-entry
  ceremony as a double-entry vow. ③ The Quarantine Bay — data held until
  verified, reusing the machine's established quarantine flavour.
- **The zone's pedagogical joke (spec-backed):** the Inspector's stamp reads
  PLAUSIBLE, not CORRECT — "validation... does not check the accuracy of data"
  (L1414). The cousin keeps smuggling slop past the format check; the Inspector
  keeps stamping it PLAUSIBLE. Oversight in miniature (P-e).
- **Cast:** the Inspector (severe, rubber-stamping); the twin ledger clerks.
- **Hazards:** belt jams (machine faults); a bitten stamp (corruption); the
  surprise audit (cartoon school).

## 6. Open questions (this capture)

1. ~~Zone A setting~~ — **answered 2026-11-25: the Pattern Shop** — Zone A is
   The Pattern Mill; renames recorded in §2 (working names, D2).
2. ~~Homes for Zone A's strands~~ — **curated and ratified 2026-11-25**:
   I/O gets the Bobbin Window; strings, DIV/MOD, comparisons, AND/OR,
   local/global woven in; NOT/XOR assessment-only; **arrays taught here**
   (pigeonholes 1D; the rota 2D; 1-based loops vs 0-based indexing stated
   as two conventions, once).
3. ~~Selection room hazard~~ — **answered 2026-11-25:** the stack avalanche is
   the room's telegraphed hazard (H1, `once: true`).
4. Welsh seeds: the mill carries the region's Welshness (woollen trade);
   a carthen proposed decorative; the raffinated Welsh bank remaps to mill
   equivalents at topic-file stage. User's own seeds welcome.
5. IDs and aliases: all working names (rooms, items, licences, flags, quiz
   ids, `q-pc-` pool) pending §9 allocation at the bible amendment (D2).
6. Bible amendment (§5 area index, §7 topic index revision, §9 new IDs, §12
   approval record) — NEXT STEP: draft and put to the user for approval (W2),
   then the Zone A topic file spin-off, then Gate 1 briefs.
7. ~~Collection frame; slop-cousin anchoring~~ — answered in principle
   2026-11-25: Licence Desk frame; cousin anchored in Zone A recurring
   through B, C, D.
8. ~~Coverage granularity for Zone A~~ — **ratified 2026-11-25: two topics**
   (`algorithms-and-pseudocode` + `programming-constructs`); every construct
   room binds the latter.
9. ~~Arrays policy~~ — **ratified 2026-11-25: taught here** (1D/2D in-zone;
   the 1.2.2 zone applies-and-extends later, maxScore 0 there if doubled).
10. ~~Avalanche arming~~ — **ratified 2026-11-25: arms after the
    demonstration** — trigger: on room entry once the demonstration is on
    record and the selection is still unresolved. Telegraphs unchanged.
11. **Quiz roster** — six quizzes including the Run Desk synthesis quiz
    (AO3 capstone); per-room AO mix; final list ratified at the Zone A
    topic-file stage with the curation recommendation as default.
