# Content status

Last updated: 2026-11-24

## Files

| File | Kind | State | `content-critic` | `pck-reviewer` | Notes |
| --- | --- | --- | --- | --- | --- |
| `docs/content/content-bible.md` | root bible | **approved (incl. curated ideation set)** | PASS (2026-11-24, original bible-level review); no card review yet | Not run — deferred to first card batch | Overarching rules only: premise, pillars, key-node spine, area/cast/topic indexes, hazard palette, master ID/alias registry, tone guide, global questions, approval record. Ideation workflow added as §13. |
| `docs/content/1-2-1-data-representation/rooms.md` | area/rooms card | **APPROVED** (2026-11-24, final) | **PASS** (final re-review, 2026-11-24) | **PASS** (final re-review, 2026-11-24) | 17 artifacts, 19 flags with owners, six gated exits with two clues each. Three bible-alignment edits verified; no answer leaked. |
| `docs/content/1-2-1-data-representation/npcs.md` | npc card | **APPROVED** (2026-11-24, after P2 + V4 fixes) | **PASS WITH MINORS** (card review; initial FAIL on major P2). First whole-set pass raised a V4 major (SHOW-leaf producers), now closed. | **PASS WITH MINORS** (card review; sole minor is the Gate 3 `COVERAGE.md` task) | 9 actors, 6 states, 38 topics, 4 nodes. Four `show`-matched foreman topics produce the four leaf flags; no helpful-state gate. |
| `docs/content/1-2-1-data-representation/quizzes.md` | quiz card | **APPROVED** (2026-11-24, after N4 revision + actor alignment) | **PASS** (final, 2026-11-24; initial FAIL on major N4) | **PASS** (final, 2026-11-24) | 8 quizzes, 32 questions. Six `actorId` values and in-quiz voices match their NPC `start-quiz` owners; all keys, facts, scores and non-message effects frozen. |
| `docs/content/1-2-1-data-representation/puzzles.md` | puzzle card | **APPROVED** (2026-11-24, after 1 major revision round) | **PASS** (final and initial, 2026-11-24) | **PASS** (final, 2026-11-24; initial FAIL on major PCK-LOAD) | 17 puzzles, acyclic reachable PDG, all flag owners confirmed, no answer leaked. |
| `docs/content/1-2-1-data-representation/hazards.md` | hazard card | **APPROVED** (2026-11-24, after V4 fix) | **PASS WITH MINORS** (card review; minor was the hazard-card handoff). First whole-set pass raised a V4 blocker, now closed. | **PASS** (card review) | 5 hazards. `once: true` on the three room-entry hazards makes re-entry safe so in-room disarms work; false `topic-clerk-carries` claim removed. |
| `docs/content/1-2-1-data-representation/hints.md` | hint card | **APPROVED** (2026-11-24, after 1 reconciliation brief + wording fix) | **PASS** (final, 2026-11-24; initial PASS) | **PASS** (final, 2026-11-24; initial PASS WITH MINORS on evidence task) | 6 hint ladders, 2–4 levels each. `hint-data-types` now teaches five bins + one decimal sample; no "sixth" wording; no answer leaked. PCK-EVIDENCE is the Gate 3 editor task. |
| `docs/content/topics/1-2-1-data-representation.md` | topic file | **approved (incl. curated ideation set)** | Not run | Not run | First zone detail: spec refs, room cluster + fixtures, 9-actor cast, 17-node PDG, 8 quizzes, 6 hint ladders, 5 hazards, Welsh touches, Gate 2 spec flags. |
| `docs/content/topics/1-1-computer-architecture.md` | topic file | parked, not briefed | Not run | Not run | Former first zone; IDs and topics reserved, not deleted. |
| `docs/content/narrative-principles.md` | principles | **APPROVED by the user (2026-11-24)** | Not run (principles, not a card) | Not run | Signed off and now settled authority for writer briefs; change log records the approval. |
| `docs/content/walkthrough.md` | V4 trace | **APPROVED** (2026-11-24, final) | **PASS** (fourth whole-set pass, V4/N2/N6/N7/D3; first three passes FAIL, all findings routed and closed) | n/a (editor trace; PCK not in scope) | 18-step ordered path from `room-binary-hall` to `game-won`, gate table, reachability table, per-topic evidence and §6 resolutions. All quiz gates, USE-before-SHOW ordering and ID registrations verified. No soft-lock. |

## Gate state

- **Gate 0 (bible + split + ideation sub-stage):** **completed and approved.** Root/topic split, indexes, registry and first-zone detail approved; six ideation returns curated and survivors approved (all six NPCs; five hazards; `q-dr-32`; prologue quiz no life loss). No writer may be launched before the Gate 1 briefs (content-rules.md §2 W1–W2).
- **Gate 0 ideation sub-stage (bible §13):** completed for 1.2.1. Six ideation-only agents reported; nothing from their output was written until editor curation and user approval.
- **Gate 1 (dispatch):** **completed.** Rooms were briefed first, then npc/quiz/puzzle/hazard/hint in parallel, one writer per output file, each self-contained with IDs, flags, topic IDs and dependencies. All six cards returned.
- **Gate 2 (review):** **completed for all six cards.** Each card ran `content-critic` (N/P/C/H/D/V) and `pck-reviewer` (PCK-ACC/DEPTH/TERM/LOAD/EVIDENCE, §1.2.1 and §1.1.1 prologue) in parallel on the exact path; all blockers and majors from both resolved through writer revisions. Final verdicts: rooms PASS/PASS, npcs PASS-with-minors/PASS-with-minors, quizzes PASS/PASS, puzzles PASS/PASS, hazards PASS-with-minors/PASS, hints PASS/PASS.
- **Gate 3 (integrate):** **completed for the first zone.** All six cards approved. The editor drafted `docs/content/walkthrough.md` (V4 trace) and `docs/coverage/COVERAGE.md` (spec refs, room IDs, status and evidence). The final whole-set `content-critic` pass (V4, N2, N6, N7, D3) returned **PASS**: complete ordered path from `room-binary-hall` to `game-won`, all gates satisfiable, all declarations reachable, all eight `covered` topics have completion sources, no soft-lock. Eight topics recorded `covered`; `ai-ethics-and-implications` `in progress` (framing only, not in this zone's win set). Whole-game extension of the trace is not applicable until further zones are integrated.

## Completed work (first zone)

- `area-1-2-1-data-representation` (The Switchyard): all six card kinds briefed, written and independently reviewed (rooms, npc, quiz, puzzle, hazard, hint). Covers eight spec topics (`switch-to-bit`, `data-types`, `number-conversion`, `character-representation`, `graphics-representation`, `sound-representation`, `data-storage-units`, `data-compression`). `pck-reviewer` checked accuracy, GCSE depth, terminology and load, including the transistor's 1.1.1 "be aware of" depth and topic file §6 spec-check flags.
- Topic IDs mirrored as `## Topic: <id>` headings in `docs/coverage/COVERAGE.md` with spec references, room IDs, status and evidence (V3). `switch-to-bit` is unscored (maxScore 0) to avoid double-counting with the parked `hardware-ethics-and-history` topic.
- V4 walkthrough drafted, reviewed to PASS and integrated; all blocker/major findings from four whole-set passes routed to owning writers or into the bible and closed.
- `docs/content/narrative-principles.md` approved by the user on 2026-11-24 and recorded as settled authority in §12 and here.
- Housekeeping closed: all six cards' YAML front matter now reads `status: approved` (metadata-only, via their owning writers), top-level `#` headings were added after front matter, and authoring-only markdownlint pragmas cover the two verbatim WJEC email addresses. No game text, ID, flag, dependency or score changed.

## Open questions / pending work

- The former `area-1-1-computer-architecture` detail is parked in `docs/content/topics/1-1-computer-architecture.md`; its IDs and aliases remain reserved in the root registry. It is outside this zone's win set.
- `ai-ethics-and-implications` remains `in progress` (framing only, no teaching or retrieval evidence) and is not in this zone's win set; it needs a future zone before it can be marked `covered`.
- No further zone has been briefed; the whole-game trace extension in `docs/content/walkthrough.md` is not applicable until another zone is integrated.
- Code implementation is out of scope for the content editor: `code-lead` owns `src/**`, tests and browser QA. All design cards are Markdown only.
