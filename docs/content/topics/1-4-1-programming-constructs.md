# Zone A: 1.4.1 Programming constructs — The Pattern Mill

**Status: APPROVED (W2) 2026-11-25.** Approved with the bible amendment; flags and the
conversation-topic id scheme are allocated in §10. Gate 1 dispatch: wave 1 briefed
2026-11-25 (rooms + concourse + hub amendment in one brief; then NPCs, puzzles,
quizzes, hazards — the wave order had not yet been adopted, so these five run
parallel); hints hold in wave 2 for puzzle-id ratification. Standing wave order from
now on: §11.

## 1. Scope and area

- **Area:** `area-1-4-programming-constructs` — **The Pattern Mill**, a Welsh
  woollen mill inside the machine. Working zone title; the user picked the
  Pattern Shop reading from three proposals.
- **World:** the single machine world (`world-wjec-gcse-computer-science-
  2025-spec`); this area declares **no `worlds` block** — the world is declared
  once, in the boot area (bible §5).
- **Level start:** `room-pattern-bureau` (`startRoomId`; hazard and quiz-failure
  returns land here). Lives 3, reset on area change (§8).
- **Connection (amended 2026-11-25, user-directed):** a placeholder Unit 1.4
  front area — `room-1-4-concourse`, The Rule Machine Concourse — links the
  machine to the mill. `room-network-hub` gains a north exit to the concourse;
  the concourse exits south back to the hub and east to the Bureau; the
  Bureau's west exit lands in the concourse. Zones B–D hang off dark ports in
  the concourse when scoped (bible §11 item 15).
- **Coverage topics (ratified: two):** `algorithms-and-pseudocode` (defining
  algorithms: pseudo-code and flowcharts) and `programming-constructs`
  (the construct strand: everything L1169–1180). Both become `## Topic:`
  headings in `docs/coverage/COVERAGE.md` at integration (V3).

## 2. Spec references and depth

All course facts come from `docs/exam-specs/wjec-unit1.md` (§1.4.1, L1161–1516).

- **Defining algorithms (L1167; amplification L1197–1245):** pseudo-code
  (L1197–1221, common terms table) and flowcharts (L1223–1245, five symbols:
  terminator, parallelogram, decision, process, arrows). Depth: create and
  interpret.
- **The construct strand (L1169–1180):** write, correct, test and interpret:
  self-documenting identifiers (L1247), subroutines (L1249), input/output
  (L1251), sequence (L1253), selection (L1255), iteration with counts and
  rogue values (L1257–1261), string handling (L1263–1280), mathematical and
  logical operations (L1282–1302), local and global variables (L1304–1306),
  arrays up to two dimensions (L1308).
- **Terminology pairing (user instruction, 2026-11-25 — binding on every
  writer):** the world term and the formal term ride together. First use pairs
  them — "the rogue thread — the **rogue value**, the mill's name for it —
  reads −1" — and after the pairing either may lead. **Quizzes, hint targets
  and coverage evidence always use the formal term**; a mill nickname never
  substitutes for a spec term in a quiz key. Room summaries of the pairs:

| Room | World term | Formal term (spec) |
| --- | --- | --- |
| Pattern Bureau | the pattern card | the construct demonstration; **pseudo-code** (L1197) and the **flowchart** symbols (L1227–1233) |
| Threading Order | the dressing order | **sequence** — instructions one after another (L1253) |
| Colour Court | which colours lift | **selection** — `if … else … end if`, `case select` (L1255, L1211); comparisons (L1282–1291) |
| Weft Counter | the passes | **count-controlled iteration** — `for i = 1 to 10 … next i` (L1217); the **incremental count**, `count = count + 1` (L1259) |
| Endless Selvedge | the cloth's end | **condition-controlled iteration** — `repeat … until`, `while … repeat` (L1218–1221); the **rogue value** (L1261) |
| Finished Rail | the master cloth | the joined **algorithm**: input → compute → output, written, corrected, tested, interpreted (L1169) |
| Bobbin Window | bobbins in, cloth out | **input and output** (L1251) |
| Mill Board / drawer tally | the board and the private drawer | **global and local variables** (L1304–1306) |
| the pigeonholes / the rota | the pigeonholes; the rota board | **arrays** — 1D and 2D, first element at position `[0]` (L1308) |

- **Depth discipline:** nothing beyond 1.4.1's list is taught. The spec's
  programming-error taxonomy (logical/runtime/syntax, L1694–1701) belongs to
  1.5.3, not here; the zone's "correct" work stays at dry-run and trace level
  (L1169). Truth tables stay with 1.6.1 — AND/OR/NOT/XOR appear only as
  conditions inside algorithms (L1295–1302).
- **Arrays (ratified: taught here):** 1D via the weft pigeonholes, 2D via the
  rota board (the spec's own 6×5 rows-and-columns shape, L1308). The two
  counting conventions are stated together **once**, at the arrays beat: `for
  i = 1 to 10` counts one to ten (L1217); array positions start at zero
  (`myArray[0]`, L1308). The 1.2.2 zone applies-and-extends later at
  `maxScore 0` there if both are live (the `switch-to-bit` model).

## 3. Room cluster

Eight rooms; two rank pairs off the Warp Walk; no maze (N2). The Bureau sits
between the hub port and the walking; the Finished Rail is the zone's
reconvergence.

1. **`room-pattern-bureau` — the Pattern Bureau.** Looms, pattern paper and the
   Loomwright's counter; the loom's five working shapes are stencilled in the
   wood: the rounded doorway, the slanted hoppers, the diamond hatch, the
   plain box, the painted arrows (L1227–1233). The Loomwright demonstrates a
   pattern in pseudo-code — the Bureau's demonstration quiz
   (`quiz-pattern-bureau`) is the **entry demonstration** and opens the Warp
   Walk door; each construct room's own demonstration (amended 2026-11-25,
   see §5) is administered by its resident, and the pattern cards are granted
   on those passes under the Loomwright's standing rule — his stamps travel
   with the demonstrations. Exits: west to `room-1-4-concourse` (user-directed
   placeholder, hub is beyond it); east to the Warp Walk — **gated**: the
   door bolt "until a demonstration is on record"; clues: the bolt itself,
   the Demonstration Book's plate ("Nothing leaves this desk without a
   demonstration"), his spoken rule. Quiz onPass sets `demo-on-record`.
2. **`room-bobbin-window` — the Bobbin Window.** Input and output as trade:
   intake bobbins signed in, finished cloth posted out. The cousin silenced
   the intake bell ("for focus") and the despatch printer prints `Average:`
   with nothing after it — output before anything is input (L1251, spec's
   own example turned in-world). Puzzle: mend the bell (item-bell-wire);
   the Bobbin Lad then posts a cloth whose output the player predicts.
   String handling beat: the addressing plate — the cousin's find-and-replace
   turned every "llan" into "data" ("Data Pond" where a Welsh village stood);
   fixing it uses the spec's string operations in spirit (L1263–1280) without
   importing Python method names.
3. **`room-warp-walk` — navigation-only (P1).** Junction corridor with all
   room doors visible; the Mill Board hangs here (global-variable beat: the
   board is the mill's shared figure; every loom can read it). The cousin's
   floor arrows point both ways ("THIS WAY TO EVERYTHING"). East exit to the
   Finished Rail — **gated**: four section lights over the caption RUNS WHEN
   PROVEN; clues: the lights + the Loomwright's "the door counts
   demonstrations, not intentions". Condition: the four construct fix flags —
   `threading-ordered`, `colours-lifted`, `weft-counted`, and the selvedge
   light needing both of its room's actions (`condition-plate-set` **and**
   `rogue-thread-filed`); the exit's condition is the all-of over the five
   flags.
4. **`room-threading-order` — the Threading Order (sequence).** The warp runs
   the length of the room; the Warp Dresser dresses threads in the order the
   pattern says, one after another (L1253). The cousin "read the order
   better" — every step present, the order wrong. Puzzle: restore the
   dressing order (order the shade cards / re-hang the step hangers); failure
   text prints what the ordered-but-wrong dressing produces (N5).
5. **`room-colour-court` — the Colour Court (selection).** The Shed Opener
   lifts some threads and drops others; which colour goes where is decided by
   the plate. A missing `else` (the cousin "kept the exciting half") routes
   every pick urgent — never routine — and her unsorted pick-pile has grown
   into the **stack avalanche** (see §7). Puzzle: return the shed plate
   (item-shed-plate), restore the else branch (item-else-plate), route a tray
   by condition with predictions before each pass (comparisons inside her
   conditions, L1282–1291). A case rail covers `case select` (L1255).
6. **`room-weft-counter` — the Weft Counter (count-controlled iteration).**
   The shuttle must pass exactly ten times (`for i = 1 to 10 … next i`,
   L1217); the Weft Tally counts everything, including her own passes. The
   cousin added a slip-tooth to the counting ratchet ("more teeth, more
   value") — the shuttle passes nine, or eleven, or never stops. Puzzle:
   pry the slip tooth (item-slip-tooth), re-seat the counting ratchet
   (item-counting-ratchet); predict the pass count before the loom runs.
   DIV/MOD ride in the bailing beat (bundles: 26 DIV 4 = 6 whole bundles,
   MOD 2 over; she posts whole bundles only, L1292–1293). Pigeonholes for the
   1D arrays beat.
7. **`room-endless-selvedge` — the Endless Selvedge (condition-controlled
   iteration).** The corridor-loom weaves its edge on and on; the exit plate
   wants its `until` back (the cousin's plate reads "while the cloth is
   nice"). The back of the weft has organised a whist evening. Puzzle: set
   the condition plate (item-condition-plate) and file the **rogue thread**
   (item-rogue-thread — a dyed colour that never arises in this pattern,
   reading −1): a signal, not a datum (L1261). The two actions set two flags;
   AND rides in the compound until ("until the pick is done AND the edge is
   signed", L1299).
8. **`room-finished-rail` — the Finished Rail (climax).** The four mended
   procedures join into one master cloth on the rail; it prints with its
   flowchart beside it (dual representation, the two forms of one algorithm,
   L1167). Global/local live here: the Mill Board reads 3, the Weft Tally's
   private drawer reads 10 — which is visible from where, and why (L1304–
   1306). The rota board hangs here for the 2D arrays beat (six weavers
   across five days, the spec's own 6×5 shape, L1308). **Gate:** the rail
   refuses to despatch until a correct prediction of the final cloth is on
   record — "PREDICT. THEN WEAVE." (the AI's attention criterion as
   furniture, P-a). Sets `master-demonstrated` (proposed flag).

Every gated exit carries two discoverable clues (N6); every room description
names its resident and its interactables in physical clauses ("Presence, not
labels", §11 of narrative-principles); prose ceiling 200 words (N8).

## 4. Cast

Six residents plus the cousin; every actor distinct in role, voice, motivation
and relationship (A1), each with at most one recurring phrase (§7 of
narrative-principles). Silent-ready rule holds: no greeting on state entry
(recorded decision); greetings live in topic responses.

| Actor | Voice | Motivation (opposing) | Relationship |
| --- | --- | --- | --- |
| `npc-the-loomwright` — the Registrar of the Bureau; keeper of patterns and licences | Dry, bureaucratic, stamp-cultured: "Stamps don't lie. People do." | Paperwork without error; a licence stamped on charm is a forged record | Loathes the cousin (filed him under *miscellaneous*); defers to the AI's marks but files its audits unopened; wary respect for the Selvedge Warden |
| `npc-the-warp-dresser` — the Threading Order's sequence keeper | Timid, ritual-bound, apologises to looms; never first | Order is kindness: a thread crossed in the wrong order snarls the whole cloth | Trade insults with the Shed Opener; in awe of the Warden; terror of the cousin's "improvements" |
| `npc-the-shed-opener` — the Colour Court's selection keeper | Fast, crisp, contemptuous of dithering — stuck dithering since her plate went missing | No case unhandled, no `else` forgotten | Sparred with the Warp Dresser for years; gratitude stiff and unpractised; the cousin's "urgent sells" is her open wound |
| `npc-the-weft-tally` — the Weft Counter's counting keeper | Precise; counts aloud, including Tuesdays and her own passes; "Exactly ten." | A count is a promise owed to whoever queued | Professional sibling of the Selvedge Warden ("she waits; I count"); formal correspondence with a duck; cold on the cousin |
| `npc-the-selvedge-warden` — the Endless Selvedge's keeper | Short, final sentences; patience gone mineral; warmth budgeted to the whist table | Every line must end: a queue without an exit is a crowd | "Anything that cannot fail is not a condition" — her verdict on the cousin; respects the Loomwright's paper, prefers a plate |
| `npc-the-bobbin-lad` — the Bobbin Window's despatch keeper | Cheerful, quick, allergic to delay; "a fast wrong answer or a slow right one" | Nothing waits twice at his window | Pride: his board is the only one the cousin never slopped; fond of the Weft Tally; cautious of the pick-pile |
| `npc-the-slop-cousin` — recurring vandal (bible §6) | Gushing, run-on; "Great question!" before each wrong answer; adores the pupil, blames looms | Helpfulness at volume | The AI's cousin and disappointment; every resident's open case |

Actor states (proposed, bible §9): each resident starts in a working-difficulty
state (`flustered`, `dithering`, `counting`, `looping`) and flips on the room's
quiz pass (`orderly`, `sorted`, `exact`, `dismissed`); the Loomwright has
`witnessing` and `complete`; the cousin has `beaming` everywhere. States change
nothing mechanically except their `specialDesc` and message-only `onEnter`.

Conversation topic plan (ids allocated at this file's approval): per resident —
a teaching beat, the **give-matched Licence delivery** topic (match kind
`give`, itemIds the pattern card; effects `transfer-item`, `set-flag`,
teaching message; per the rulebook's topic union), stray-card redirect topics
(N5: the refusal teaches where the card goes), a demonstration topic gated on
the room's fix, a freetext catch-all (`in-room` scoped, T2), and 2–4 characterful
topics. The cousin carries one vandal topic per room, `in-room` scoped; one
optional AI cameo (`topic-ai-licence`) in-room at the Bureau, flavour only.

## 5. Puzzle dependency sketch

Flow (amended 2026-11-25 to match the ratified avalanche decision — "the
Shed Opener's demonstration" is the Colour Court's own quiz, so the
construct demonstrations are the construct rooms' quizzes; the Bureau's is
the entry demonstration):

- Pattern-card chain, per construct: enter the construct room → teaching
  beat → **demonstration quiz** administered by the room's resident, onPass
  **grants the pattern card** (`grant-item`; the Loomwright's standing rule
  — his stamps travel with the demonstrations) → the player **gives the card
  back to the resident to file** (give topic: `transfer-item`,
  `card-<construct>-given`, teaching message) → the room puzzle mends the
  cousin's slop → room fix flag (or flags) → Warp Walk light → all four
  lights → Finished Rail → synthesis quiz onPass sets `master-demonstrated`
  → despatch.
- Fix flags (allocated): `bell-mended` (Bobbin Window), `threading-ordered`
  (sequence), `colours-lifted` (selection — also the avalanche's arming
  guard), `weft-counted` (count), `condition-plate-set` +
  `rogue-thread-filed` (condition; two actions, two flags),
  `master-demonstrated` (Finished Rail).
- Delivery flags (allocated): `card-sequence-given`, `card-selection-given`,
  `card-count-given`, `card-condition-given`.
- Bureau entry flag (allocated): `demo-on-record` (quiz-pattern-bureau
  onPass; it also gates the Bureau's east door).
- Shape: Bureau root → four independent construct branches (any order; N2's
  bush-not-maze) → Finished Rail sink. Acyclic by construction; no branch
  feeds another; no soft-lock in any visit order (the avalanche's arming
  depends only on the Colour Court's own demonstration). Regions of
  non-linearity: the four branches; within rooms: clue-first puzzles (the
  player who reads the room can act).
- Narrative order per card: taught → demonstrated (the room's quiz) → card
  granted → **given back to the resident to file** → the resident applies →
  the room's slop mended.

## 6. Quizzes, hints and teaching beats

- **Six quizzes (proposed ids, bible §9):** `quiz-pattern-bureau`
  (pseudo-code reading + the five flowchart symbols, L1197–1245),
  `quiz-threading-order` (sequence, incl. input-before-output discipline,
  L1251/1253), `quiz-colour-court` (selection + comparisons,
  L1255/1282–1291), `quiz-weft-tally` (count-controlled + the incremental
  count, L1217/1259), `quiz-selvedge` (until/while + the rogue value,
  L1218–1221/1261), `quiz-finished-rail` (synthesis: choose the construct
  for a fresh problem — the AO3 capstone, L1169).
  *(Amended 2026-11-25 at W4, editor — the P1 anchor made explicit:
  `quiz-finished-rail` completes `algorithms-and-pseudocode` — L1169 is the
  algorithms section's write/correct/test/interpret line, P3 assigns AO3 to
  design/evaluation topics, and with the Bureau quiz's 2 the recorded
  5-point budget for that topic lands there (§11). Its questions synthesise
  the constructs as the algorithm's parts, which is the point of the
  capstone.)*
- **Question pool:** `q-pc-01` … `q-pc-24` (proposed), ~4 per quiz; each
  quiz ≥1 AO1 and ≥1 AO2; AO3 permitted throughout (algorithms are a design
  topic, P3); `passMark` 3 of 4; explanation after every answer (P4);
  onFail: one life + return to `room-pattern-bureau` (P5, §8); no timer;
  unlimited retries; hints wired to failure counters.
- **Distractor discipline (P4):** options carry the formal spec terms; the
  mill flavour sits in the prompt, never in the key. Misconception bank
  (curated): "to excludes the end value" (nine stamps, L1217); off-by-one
  from the other end (L1259); `>=` read as strictly greater (L1287); every
  `=` read as assignment (L1291 vs L1210); both arms run (L1255); a missing
  `else` assumed harmless (L1255); repeat…until assumed skippable
  (L1218 vs L1221); the rogue value refused as a data error (L1261);
  symbols judged by silhouette (L1229–1231); XOR read as OR (L1302).
- **Hints (proposed ids, bible §9):** one ladder per quiz/puzzle cluster,
  six total, in the Loomwright's "guidance for learners" sheets — nudge →
  structure → procedure, 2–4 levels; unlock on `failed-attempts:<quizId>`
  (1/2/3) and `turns-since:<puzzleId>` (3/5/7); `cooldownTurns: 2`; zero
  penalty; no level reveals an answer; no line references the avalanche, the
  incident book or any L-number (H2; the flavour bars).

## 7. Selected hazards

- **`hazard-pick-avalanche`** (machine faults; DECIDED). The Colour Court's
  pick-pile goes over. **Trigger (ratified):** on room entry AFTER the
  Shed Opener's demonstration is complete (`when`: `quiz-passed:quiz-colour-
  court` **and not** `colours-lifted` — the demonstration flag is the quiz's
  own pass flag) while the selection fix is still undone. Until it arms, the
  room is safe; the telegraphs are read either way — the yellowed tally
  card ("one sheet from going over") and her line about the pile. Effects:
  message + one life + return to `room-pattern-bureau`; `once: true`; no
  puzzle-phase reset; no hint during a hazard (H1, §8). Failure text
  concept: every fallen pick is stamped urgent — not one says routine —
  so the room's symptom arrives in the player's hands (N5); the Quality
  Book never prints the phrase itself (flavour bar, below).
- **`hazard-dye-pad`** (corruption). The Weft Counter's dye pad has dried to
  weak tea; its label has flaked. Telegraph: the pad's label + her line
  ("if the impression crackles, stop pressing"). Disarm: examine the pad
  first (examine-first disarm, the zone-1 tiles-verified pattern). Failure:
  a cracked impression and a miscount — counted is counted, dry or not
  (L1259 as world behaviour).
- **`hazard-slop-worksheet`** (cartoon school). The cousin's "PATTERN
  WORKBOOK (mandatory! fun!)" left on the Threading Order's lectern; filling
  it in earns red-ink enthusiasm regardless of content — every answer
  "Great question!". Telegraph: the workbook itself + the Warp Dresser's
  warning. Tempting-object trap, not a quiz (a hazard never starts one);
  `once: true`; pure detour.
- Level start always clean; the Finished Rail clean; no room carries two
  hazards (rhythm from the hazard curation); reserved palette ids
  (`hazard-overheat`, `hazard-pop-quiz`) unspent here.

## 8. Welsh references and the mill glossary

The mill is the zone's Welshness — the west Wales woollen trade — delivered
as setting, never as a joke target (§8 of narrative-principles) and never
displacing a formal term (§10 of the bible). Per the user instruction of
2026-11-25, every glossary term gets a short in-voice explanation on first
use, one clause, from the area, an item's description or an NPC's dialogue:

- **carthen** — a checked woollen blanket, woven on looms like these for the
  farm beds of west Wales. (Decorative item; the Loomwright keeps one folded
  at the rail: "for the long winter nights, when the looms want company".)
- **warp** — the threads that run one way, dressed first and in order.
- **weft** — the thread that crosses them; each pass lays one row.
- **shed** — the gap the loom opens when some threads lift and others stay
  down; lifting some and not others is the whole of selection.
- **selvedge** — the woven edge that finishes itself as the cloth is made;
  a line that ends because the work says so.
- **heddle, treadle, bobbin, skein** — glossed in passing where they appear
  (the heddles hold the threads that lift; the treadle opens the shed; the
  bobbin carries the weft; a skein is yarn not yet wound).
- **paned** — a cup of tea, obligingly poured (the Bobbin Lad's term for a
  break that is owed).
- **"Bore da"** — the Loomwright's morning word to the mill, good morning;
  used once, naturally, before the day's paperwork.
- **Machynlleth** — a market town in mid Wales; the postmark pad's rubber
  reads it, an old frank from the days the mill posted its own cloth.
- Whist — the card game at the back of the weft; the rules are verbal and
  argued with warmth.
- Gloss discipline: the Welsh words are names and colour, never assessed
  vocabulary; a joke is never made of the language or its speakers (harm
  floor); each term glosses in one clause and the loom work goes on.

## 9. Zone questions (this file)

1. Quiz roster finalisation (six as proposed is the default) and the
   per-quiz AO spreads — settled into the Gate 1 quiz brief (2026-11-25):
   six quizzes, passMark 3 of 4, pool `q-pc-01…24`.
2. ~~Alias ratification~~ — **settled:** approved with the W2 amendment
   (bible §9, 2026-11-25). Zone A conversation topic and flag ids are
   allocated in §10 below.
3. The give→transfer and quiz-issues-item seams proven in the V4 trace
   before any quiz card relies on item-issue on pass. Both unions exist
   (shared-rules.md §5: `grant-item` in quiz `onPass`; `transfer-item` for
   give topics); the V4 trace must still prove the flows end to end.
4. ~~Hub port direction~~ — **settled (2026-11-25, user-directed):** the hub
   gains a **north** exit to the new placeholder concourse
   (`room-1-4-concourse`); the concourse joins the Bureau. Zones B–D hang
   off its dark ports later (bible §11 item 15).
5. The avalanche's trigger wiring (entry after
   `quiz-passed:quiz-colour-court`, selection still unresolved) drafted
   into the hazard card at Gate 1; the trace proves no first-entry fire and
   safe re-entry.
6. Decorative items' `portable` calls (allocated in §9 of the bible) are
   re-checked at brief time against the take-refusal contract (P-TAKE-01).
7. Zone C's `maintainable-programs` topic file inherits the anti-leak rules
   and the two-conventions arrays beat when it is scoped (bible §7).
8. Puzzle ids: proposed by the puzzle-writer (user decision 2026-11-25),
   ratified in bible §9 at review acceptance; the hints brief waits for
   them (wave 2).

## 10. Flag and conversation-topic allocation (applied at W2 approval, 2026-11-25)

Runtime **flags** (kebab-case, no prefix; unique in-world):

| Flag | Set by | Read by |
| --- | --- | --- |
| `demo-on-record` | `quiz-pattern-bureau` onPass | Bureau's east exit guard |
| `bell-mended` | `puzzle-mend-the-bell` (id proposed by the puzzle-writer) onSolve | Bobbin Lad topics (prediction beat) |
| `pad-checked` (ratified, 2026-11-25) — the dye-pad disarm | the Weft Tally's crackle-test topic (ask her about the dried pad; set-flag in its effects; examining the pad in-room is the in-fiction route) | `hazard-dye-pad`'s `when` guard (hazards card, wave 1) |
| `weft-ratchet-heard` (allocated 2026-11-25; content key, not a registry id — D2 does not apply) | the Weft Tally's `topic-weft-tally-count-known` (first ask) | `topic-weft-tally-prediction` |
| `card-sequence-given` | Warp Dresser's give topic | Threading Order puzzle guard |
| `card-selection-given` | Shed Opener's give topic | Colour Court puzzle guard |
| `card-count-given` | Weft Tally's give topic | Weft Counter puzzle guard |
| `card-condition-given` | Selvedge Warden's give topic | Selvedge puzzles' guards |
| `threading-ordered` | sequence puzzle onSolve | Warp Walk light 1 |
| `colours-lifted` | selection puzzle onSolve | Warp Walk light 2; avalanche disarm |
| `weft-counted` | count puzzle onSolve | Warp Walk light 3 |
| `condition-plate-set` | selvedge plate puzzle onSolve | Warp Walk light 4 (with the next) |
| `rogue-thread-filed` | rogue puzzle onSolve | Warp Walk light 4 (with the previous) |
| `master-demonstrated` | `quiz-finished-rail` onPass | the Rail's despatch beat |
| `pass-count-predicted` (allocated 2026-11-25, editor — the Weft Counter's prediction beat, §5) | the Weft Tally's prediction topic (ask-topic; in-room; one-shot) | the count puzzle's requirement list (puzzle card) |
| `bell-wire-seated` (ratified 2026-11-25 at review close-out; D2-proposed by the puzzle-writer) | the bell wire's verb action (USE per `item-bell-wire` useNotes) — **seam-deferred, bible §12** | `puzzle-mend-the-bell`'s requirement list |
| `addressing-plate-re-lettered` (ratified 2026-11-25; D2) | the addressing plate's verb action (the letter rack re-lettering, per useNotes) — seam-deferred, bible §12 | `puzzle-mend-the-bell`'s requirement list |
| `dressing-re-ordered` (ratified 2026-11-25; D2) | the shade cards' verb action (PUT on the step hangers in the card's order) — seam-deferred, bible §12 | `puzzle-dress-the-warp`'s requirement list |
| `shed-plate-returned` (ratified 2026-11-25; D2) | the shed plate's verb action (returning the diamond plate to its rail slot) — seam-deferred, bible §12 | `puzzle-lift-the-shed`'s requirement list |
| `else-plate-restored` (ratified 2026-11-25; D2) | the else plate's verb action (seating it in its plain rectangular slot) — seam-deferred, bible §12 | `puzzle-lift-the-shed`'s requirement list |
| `tray-routed-by-condition` (ratified 2026-11-25; D2) | the pick trolley's verb action (routing picks 9, 12, 15 by the plate's condition) — seam-deferred, bible §12 | `puzzle-lift-the-shed`'s requirement list |
| `slip-tooth-pried` (ratified 2026-11-25; D2) | the slip tooth's verb action (prying it from the counting ratchet) — seam-deferred, bible §12 | `puzzle-seat-the-ratchet`'s requirement list |
| `counting-ratchet-reseated` (ratified 2026-11-25; D2) | the counting ratchet's verb action (re-seating it so one tooth serves one pass) — seam-deferred, bible §12 | `puzzle-seat-the-ratchet`'s requirement list |
| `until-clause-restored` (ratified 2026-11-25; D2) | the condition plate's verb action (PUT the until plate on the exit gate) — seam-deferred, bible §12 | `puzzle-close-the-selvedge`'s requirement list |
| `rogue-thread-in-drawer` (ratified 2026-11-25; D2) | the rogue thread's verb action (PUT in the counterfoil drawer) — seam-deferred, bible §12 | `puzzle-file-the-rogue-thread`'s requirement list |

These ten are the puzzles' intermediate action flags: their setters are the
items' declared verb actions (ON the wording in each item's `useNotes`), and
the engine seam that executes card-declared verb effects is deferred (bible
§12, user decision 2026-11-25) — the cards stay authored on the ratified
shapes and no card rewrites when the seam lands.

Quiz-pass flags follow the rulebook convention `quiz-passed:<quizId>` and are
not separately allocated. The avalanche's `when` condition reads
`quiz-passed:quiz-colour-court` **and not** `colours-lifted`, on room entry —
per the ratified arming decision.

**Conversation topic ids** (D2 scheme; the npc-writer authors the individual
ids on this scheme and the editor ratifies them at review): stems
`topic-loomwright-*`, `topic-warp-dresser-*`, `topic-shed-opener-*`,
`topic-weft-tally-*`, `topic-selvedge-warden-*`, `topic-bobbin-lad-*`,
`topic-slop-cousin-*`; one give-matched delivery topic per construct
resident; per-room `in-room`-scoped cousin vandal topics; catch-alls scoped
to the actor's room; reserved: `topic-ai-licence` (bureau, cameo, flavour
only). Node scheme mirrors: `node-<actor-stem>-<beat>`; the two ratified
nodes stay in bible §9. Conversation "object ids" (the `ask` vocabulary)
come from the bible alias registry only (T4): each room's teaching nouns
(warp, weft, shed, selvedge, ratchet, rota, pigeonholes) resolve through the
items' and rooms' ratified aliases.

## 11. Dispatch plan and scoring (standing practice, 2026-11-25)

**Wave order for this area** (adopted by the user as editor practice, bible
§12; applies to every area from now on — zone 1 predates it and is
grandfathered):

1. **Rooms** — `rooms.yaml` for the area (+ the zone's concourse and the hub
   exit amendment where they exist): the world skeleton, gates and items.
   Writer may propose extra ids, marked D2.
2. **NPCs** — `npcs.yaml`: needs the ratified rooms, flags and state ids
   from wave 1.
3. **Puzzles and quizzes** — `puzzles.yaml`, `quizzes.yaml`: need the
   ratified rooms, delivery flags and NPC quiz-taker bindings. The
   puzzle-writer proposes its own ids (D2), the editor ratifies them at
   review acceptance, and the hints brief follows.
4. **Hazards** — `hazards.yaml`: needs rooms, the area flags it guards on,
   and the ratified puzzle/quiz ids its conditions read.
5. **Hints** — `hints.yaml`: needs the ratified quiz and puzzle ids for
   `targets` (H2). Last.

Per-wave handling: the editor scaffolds that wave's files just in time (the
validator fails unresolved `todo` stubs), dispatches the briefs, runs
`content:validate` on the returned wave, and routes findings back before
either reviewer runs (D5/V1); a wave's newly proposed ids are ratified in
bible §9 as part of review acceptance and reported to the user.

**Scoring (user decision, 2026-11-25):** scores are *recorded*, not
budgeted. Writers declare a `score` per activity following the zone-1 shape
(quiz 2, puzzle 1, rooms 0; capstone free to reach 3); at integration (W5)
the accepted per-topic total is written into `spec-topics.yaml` as
`maxScore`. The cap check is being retired and `maxScore` made optional
(code-lead, queued). Until that lands, this file's two `spec-topics.yaml`
entries carry neutral placeholders (60) that govern nothing — they will be
replaced by the recorded sums, or removed, at W5.

**Zone A state under this plan:** wave 1's five briefs are already out
(rooms incl. concourse + hub amendment; NPCs; puzzles; quizzes; hazards) —
their returns are processed under the per-wave validation/review above; the
hub amendment validates only once the mill rooms exist (dangling exit
target), so it is sequenced after the rooms return within wave 1's
processing. Hints (wave 2) brief after the puzzle ids are ratified. The
concourse and the hub exit amendment were both authored inside the wave-1
rooms brief (one rooms-writer, three files), per the ownership rule.
