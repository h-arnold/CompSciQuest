# HANDOFF — CompSciQuest content + W6/W7 state

**Written:** 2026-11-26
**By:** `content-editor` (content workstream)
**HEAD at write:** `62d87a5` (this document; content handoff base was `7802a76`,
then `03ebd03` added the code-side `W7-HANDOFF.md`)
**Purpose:** let another agent pick up exactly where the content workstream
stopped, without re-deriving context.

**Companion document:** `W7-HANDOFF.md` (root, commit `03ebd03`) is the
code-side handoff for the same milestone. Its seven named runtime fixes, the
`/tmp/opencode/w7-integration` workspace and the verification order are still
the authority for the code slice. This document covers the **content** state and
the sequencing between the two; where they differ on the AI verdict, see §5
(W6c) — the content repair post-dates that document.

---

## 1. One-paragraph summary

The content workstream is **finished and green**. The Switchyard (zone 1) and the
Pattern Mill (Zone A) card sets were repaired for C7 topic exclusivity and P5 quiz
retries, the whole-game V4 trace in `docs/content/walkthrough.md` was drafted and
extended to `game-won` (10 `covered` topics, score budget 43), and the final
whole-game `content-critic` pass returned **PASS WITH MINORS** with no blocker or
major. `npm run content:validate` exits 0 with an empty tail. **Code is not
green**: `npm run typecheck` fails and `npm test` reports 71 failing tests across
10 files, all of them trace-pinned W7 expectations awaiting the W6 implementation
work. Nothing is blocked on content; the next move belongs to `code-lead`.

---

## 2. Read these first (in order)

1. `AGENTS.md` — ownership split between content and code streams.
2. `docs/content/status.md` — per-file index; the "Open questions / pending
   work" section at the bottom is the current task list.
3. `docs/content/walkthrough.md` — §1–§8 the accepted V4 trace; **§7 is the
   final verdict**; §6 lists the shadowed flavour specials; the end of §7 states
   the code prerequisites.
4. `docs/content/content-bible.md` §12 (approval record) — what the user has
   actually agreed, in date order.
5. `docs/developer/content-rules.md` — W1–W7, the N/P/C/H/D/V rules.
6. `docs/developer/npcs.md` §3 — the precedence rule that makes the
   `isIdMatchingPhrase` removal mandatory.
7. `docs/coverage/COVERAGE.md` + `docs/content/spec-topics.yaml` — coverage
   claims with evidence (they match; 11 `## Topic:` headings, 10 `covered`).

---

## 3. What is accepted (content, do not re-litigate)

| Area                                        | Cards                                         | State                                                                                        |
| ------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Arrival (`entry-interface`)                 | `rooms.yaml`, `npcs.yaml`                     | `status: approved`                                                                           |
| Hub (`network-hub`)                         | `rooms.yaml`, `npcs.yaml`                     | `status: approved`                                                                           |
| Concourse (`1-4-concourse`)                 | `rooms.yaml`                                  | reviewed; navigation-only                                                                    |
| Switchyard (`1-2-1-data-representation`)    | rooms, npcs, quizzes, puzzles, hazards, hints | approved                                                                                     |
| Pattern Mill (`1-4-programming-constructs`) | rooms, npcs, quizzes, puzzles, hazards, hints | npcs approved; rooms/quizzes/hazards carry stale "in review" wording in `status.md` — see §8 |

Repairs that were made and accepted (do not undo):

- **C7 exclusivity** — every ask/tell pair on every actor is provably exclusive
  from `isActive`, using evidence per beat (`*-heard` flags, `npc-knows`, quiz
  passes). Zone 1: 8 actors / 35 topics / 3 nodes, 23 pairs. Zone A: the
  `weft-ratchet-heard` chain.
- **P5 retries** — all eight quiz handoffs are `strategy: sequence` +
  `not quiz-passed <its quiz>`, so a failed attempt re-issues the quiz and the
  beat retires only on the pass.
- **`topic-ai-verdict` is `special [verdict, mastery]`** — it no longer accepts
  all free text, so it cannot shadow the scoped AI topics.
- **Zone A demonstrations** — the three middle beats (`*-order-known`,
  `*-selection-known`, `*-until-known`) are keyword `special`s, so the win path
  does not depend on the runtime ID-word preference.
- **Hub has two live ports** (east LIVE → Switchyard, north THE RULE MACHINE →
  concourse) in the room prose, `authoring.interesting`, the escape response and
  trace beats C, §3 and §8 step 20.
- **Life budget** — one life lost at step 18; whole game ends at 2 of 3 (§8 step
  30).

Accepted-but-open (not blockers):

- Two `quizzes.yaml` PCK minors for a future quiz round: q-dr-28's untaught
  format lists, q-dr-02's effects clause.
- Bible §9 factual annotations: `item-route-diagram` reserved/undeclared;
  `item-pick-trolley` marked as the P6 USE owner.

---

## 4. Current verification state (measured 2026-11-26)

```
npm run content:validate   exit 0, empty tail                     ✅
npm run typecheck          exit 1                                  ❌
npm test                   10 failed files / 71 failed tests        ❌
```

All failures are in the W7 slice (`tests/w7/**`), the NPC type/signature
scaffolding, and the generated-content gate — i.e. **code**, not content.

### 4.1 Failure inventory

| Test file                                 | Failing | What it needs                                                                                                                                                                 |
| ----------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/w7/scenery-validation.test.ts`     | 38      | Authoring validation for the `scenery` blocks (`name`/`description`/`aliases` shapes) and `EXAMINE` interaction `itemId` shapes. Validator/schema work in `tools/content/**`. |
| `tests/w7/npc-topic-resolution.test.ts`   | 13      | `TopicResolver.resolve` to take the actor (4th arg) and resolve **actor-level** `special`/`command` keywords, not just node topics; plus removal of the ID-word preference.   |
| `tests/w7/area-progress.test.ts`          | 8       | `move-player` / award paths must derive `worldId`/`areaId`/`roomId` from the bundle (current code keeps the previous world: `world-b` vs `world-a`).                          |
| `tests/w7/score-consistency.test.ts`      | 3       | Post-batch score totals disagree: state/view/final read 4 while tracker/progress read 9 — one award path is not reaching the score state.                                     |
| `tests/content/GeneratedContent.test.ts`  | 3       | Generated bundle is stale relative to the approved cards (counts/order/authoring-block leakage).                                                                              |
| `tests/w7/area-score-attribution.test.ts` | 2       | Buffered room-visit score attribution to the resolved area row.                                                                                                               |
| `tests/npcs/NpcTypes.test.ts`             | 1       | Canonical signature must accept actor binding (`W7R-NPC-02`).                                                                                                                 |
| `tests/content/SourceHygiene.test.ts`     | 1       | Generated handoff hygiene (`loadContent` returns generated data; no stub/YAML parser imports).                                                                                |
| `tests/content/ContentHandoff.test.ts`    | 1       | `createInitial()` defaults to the generated bundle/start.                                                                                                                     |
| `tests/content/ContentCatalogues.test.ts` | 1       | `CT-HAND-07` declaration order / `getById` stability.                                                                                                                         |

`typecheck` currently fails only on `tests/npcs/NpcTypes.test.ts` and
`tests/w7/npc-topic-resolution.test.ts` (the 4-argument `resolve` arity) — no
`src/**` error.

### 4.2 The generated bundle is stale — verify this first

`src/content/authored/conversation-topics.ts` still carries the **pre-repair**
content even though the cards are approved:

- `topic-ai-verdict` is `askTell` with `objectIds: ["ai-ethics-and-implications"]`
  (cards say `special [verdict, mastery]`);
- `topic-ai-default` still says "Ask about the verdict; that is where the marks
  are";
- `topic-ai-escape` says "One port ... glows" (cards say two);
- no `topic-warp-dresser-order-known` / `topic-shed-opener-selection-known` /
  `topic-selvedge-warden-until-known`;
- no `weft-ratchet-heard`.

The bundle mtime is 2026-11-25 16:21, but the shapes above are proof enough: the
generated output does not contain the repairs. **`npm run content:generate` must
be run before any W7 browser pass**, and the regenerated diff must be inspected
for the five points above.

---

## 5. Ordered next steps

### W6a — regenerate the authored bundle (must be first)

```
npm run content:generate
git diff --stat src/content
```

Then confirm the five stale points in §4.2 are gone. Do not hand-edit
`src/content/authored/*.ts`; they are generated output.

### W6b — resolver: actor-level keyword resolution

`src/core/commands/TopicResolver.ts` currently resolves keywords only from
`node.topics` and takes `(phrase, state, node)`. The W7 tests call
`resolve(phrase, state, node, actorId)` and expect room-scoped actor-level
`special`s (`why-here`, `failure`, `escape`) to win over generic ask/tell
topics. Extend the interface and resolve actor topics whose `isActive` passes,
keeping the documented order in `docs/developer/npcs.md` §3/§5: node special
keywords → actor keyword topics → visible object aliases → free text.

### W6c — remove the ID-word preference

Delete `isIdMatchingPhrase` and the `preferred` branch in
`src/core/npcs/TopicSelection.ts` (around lines 166–206). `npcs.md` §3 forbids
an ID word as a tie-break. The approved content no longer needs it; the trace
must remain winnable without it.

**Sequencing trap:** `tests/w7/npc-topic-resolution.test.ts` contains
expectations written against the _stale_ bundle — e.g. "verdict resolves to its
declared AI object ID" expects
`{ kind: 'object', objectId: 'ai-ethics-and-implications' }`, and
`W7-HANDOFF.md`'s fix 2 repeats that example. That card was repaired and approved
on 2026-11-25: `topic-ai-verdict` is now `special [verdict, mastery]` with **no**
`objectIds`, and trace §1 beat A says the verdict is keyword-addressed (C7). After
regeneration there is no object ID for `verdict` to resolve to; the correct
resolution is the keyword path. `ai-ethics-and-implications` is a **spec-topic
ID**, not an object alias. Reconcile those expectations to the approved card —
never by restoring the `askTell` shape and never by keeping the ID-word
preference to make them pass.

### W6d — the remaining failures

In this order, because the later ones depend on the bundle:

1. `tests/content/**` (4) — should mostly clear with regeneration; investigate
   what is left as a genuine generator/registry gap.
2. `tests/npcs/NpcTypes.test.ts` (1) — canonical signature with actor binding.
3. `tests/w7/area-progress.test.ts` + `area-score-attribution.test.ts` (10) —
   derive position and award rows from the bundle.
4. `tests/w7/score-consistency.test.ts` (3) — the award path that updates the
   tracker but not the score state.
5. `tests/w7/scenery-validation.test.ts` (38) — authoring validation for
   scenery/EXAMINE shapes. Note this is validator work: `content-editor` must not
   touch `tools/content/**`; the _cards_ already declare scenery and pass
   validation.

Definition of done for W6: `npm run content:validate`, `npm run typecheck` and
`npm test` all green, and the regenerated bundle matches the approved cards.

### W7 — browser walkthrough

Dispatch `browser-tester` **directly** from the content stream (not through
`code-lead`) with `docs/content/walkthrough.md` §1–§8 as the script:
`room-arrival` → hub → Switchyard → concourse → Pattern Mill → `game-won` at §8
step 30. Existing harness: `e2e/w7-opening-walkthrough.spec.ts` (its header
records that quiz/hint integration is deferred by the user, so the complete
win stays skipped — do not weaken non-quiz expectations).

Scope the claim exactly as `W7-HANDOFF.md` does: quiz integration, hint
integration and the complete authored win remain **out of scope**, and the
single full-win Playwright test stays skipped with its recorded reason. The
navigation-only hub, the single-world design and the Binary Hall gate clues must
survive. The trace's full win path is still the V4 evidence; a green non-quiz
browser pass does not certify `game-won`.

Route findings: content (IDs, flags, prose, reachability) → `content-editor`;
code → `code-lead`. Record the V5 result in `status.md` and the walkthrough
working note.

---

## 6. Ownership boundaries (non-negotiable)

| Path                                                                        | Owner                           |
| --------------------------------------------------------------------------- | ------------------------------- |
| `docs/content/**` (cards, bible, topic files, trace, status index)          | `content-editor`                |
| `docs/coverage/COVERAGE.md` content                                         | `content-editor` (form: `docs`) |
| `.opencode/scratchpad/**`                                                   | whoever is working              |
| `src/**`, `tests/**`, `e2e/**`, `tools/content/**`, `package.json`, configs | `code-lead`                     |
| `docs/developer/**` form/drift                                              | `docs` agent                    |
| `AGENTS.md`, `opencode.json`, ESLint/TS configs                             | user                            |

Content agents never write TypeScript; code agents never write design cards or
invent course facts. The two graphs stay separate: `graphify query` from the repo
root for code, from `docs/` for coverage.

---

## 7. Deep state: the approved content in numbers

- 10 `covered` topics, score budget **43** (24 + 19), 20 rooms, 40 exits,
  51 items, 97 NPC topics, 14 quizzes, 23 puzzles, 8 hazards, 13 hint ladders.
- Win set ends on the rail quiz pass (§8 step 30); `game-won` predicate in
  `src/core/Session.ts`.
- Ten §8.6 interaction rows are pinned as declarative rows in
  `src/core/commands/InteractionRules.ts` — that is the content→engine seam for
  the Zone A verb-shaped flags.
- `ai-ethics-and-implications` is `in progress` (framing only) and outside the
  win set.

Where the full record lives (all ten fields: area ID, kind, output path, state,
validation, both verdicts, owner, next gate, unresolved findings):

```
.opencode/scratchpad/content/<area-id>/<kind>-status.md
```

Relevant ones now: `global/walkthrough-status.md`,
`entry-interface/{rooms,npcs}-status.md`, `network-hub/{rooms,npcs}-status.md`,
`1-2-1-data-representation/{npcs,rooms,quizzes,puzzles,hazards,hints}-status.md`,
`1-4-programming-constructs/{npcs,hints,puzzles,rooms}-status.md`.

---

## 8. Traps and gotchas (learned the hard way)

1. **`status: revision` is not valid.** The card enum is
   `draft | reviewed | approved`. A brief that asks for `revision` produces a
   validator finding.
2. **A `special` beat can be shadowed by an active `askTell`.** That is exactly
   what `isIdMatchingPhrase` was papering over. After W6c, re-read the §6 list of
   flavour specials (`bell`, `prediction`, `paned`, `tuesdays`, `urgent`,
   `signal`, `whist`, the pre-cartridge `geese`) when walking; only the required
   win path is certified independent.
3. **Scratchpad files are working notes, not the record.** Any change to a
   state, verdict, ID, flag, topic or coverage fact must also be written to the
   canonical doc (`status.md`, the bible, `walkthrough.md`, `COVERAGE.md`,
   `spec-topics.yaml`).
4. **`status.md` is an index**, one row per file, dates inside the verdict cells,
   no date column and no link column. The narrative record goes in the
   scratchpad.
5. **Do not mark a topic `covered` without a `complete-topic` source.** Heading
   in `COVERAGE.md` and `SpecTopic` in `spec-topics.yaml` must agree.
6. **Dirty `graphify-out/**` is expected** after hooks; it is not a reason to
   skip graphify, and it is not content churn to review.
7. **Two generated-bundle truths can disagree** — the cards are authoritative,
   the bundle is downstream. Always check which one a failing test asserts
   against before "fixing" either.
8. **Markdown lint/Prettier** apply to `docs/**`; run `npm run lint:md` and
   `npx prettier --check` on files touched. `docs/exam-specs/**`,
   `.opencode/**` and `graphify-out/**` are excluded.

---

## 9. Open questions for the user (not blockers)

1. **Keyword-addressed AI verdict** — `topic-ai-verdict` is now
   `special [verdict, mastery]` instead of "any first question opens the
   verdict". The alternative (gating the scoped topics on `npc-knows`) would
   linearise the opening. Confirm the keyword form is the intended design.
2. **Two bible §9 registry annotations** — `item-route-diagram` marked
   reserved/undeclared (the painted diagram is room prose) and
   `item-pick-trolley` marked as the P6 USE owner. Confirm or revert.
3. **Bookkeeping** — Zone A's `rooms`, `quizzes` and `hazards` rows in
   `status.md` still read "in review" from their W4 rounds. The whole-game pass
   certifies the trace and the cards it read, not a fresh card-level W4 for those
   three. Decide whether to close those rows or schedule a fresh W4.
4. **Two accepted PCK minors** — q-dr-28 (untaught format lists) and q-dr-02
   (effects clause). Schedule a quiz round or accept permanently.

---

## 10. Commit / push note

The content workstream was committed in `7802a76` and earlier commits. This
handoff file and four Markdown lint fixes in editor-owned docs are the only new
changes in this round (`62d87a5`), and they were pushed to `origin/main`.

`graphify-out/reflections/LESSONS.md` may appear dirty after `graphify reflect`
runs; that is auto-generated hook churn, already reverted once, and it is not a
content change. Stage explicit paths, never `git add -A`, so unrelated work in
flight (the W7 runtime slice) is not swept in.

Commit message used:

```
docs(content): hand off accepted content and W6/W7 state
```
