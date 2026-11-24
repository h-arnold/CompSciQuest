# Content status

Last updated: 2026-11-24

## Files

| File | Kind | State | `content-critic` | `pck-reviewer` | Notes |
| --- | --- | --- | --- | --- | --- |
| `docs/content/content-bible.md` | root bible | **revised and split, awaiting re-approval** | PASS (2026-11-24, original bible-level review); revised version not reviewed | Not run — deferred to first card batch | Overarching rules only: premise, pillars, key-node spine, area/cast/topic indexes, hazard palette, master ID/alias registry, tone guide, global questions, approval record. |
| `docs/content/topics/1-2-1-data-representation.md` | topic file | draft, awaiting approval | Not run | Not run | First zone detail: spec refs, room cluster, PDG, quizzes/hints, hazards, Welsh touches. |
| `docs/content/topics/1-1-computer-architecture.md` | topic file | parked, not briefed | Not run | Not run | Former first zone; IDs and topics reserved, not deleted. |
| `docs/content/narrative-principles.md` | principles | draft | Not run | Not run | Needs explicit approval before briefs cite it as settled authority. |

## Gate state

- **Gate 0 (bible + split):** completed structurally; **approval pending**. No writer may be launched before approval (content-rules.md §2 W1–W2).
- **Gate 1 (dispatch):** not started.
- **Gate 2 (review):** not started. `content-critic` and `pck-reviewer` must both run in parallel on the exact returned card paths; all blockers and majors from both resolved before integration (W4, V2).
- **Gate 3 (integrate):** not started.

## Pending work

- First batch: `area-1-2-1-data-representation` (The Switchyard), one brief per kind (rooms, npc, quiz, puzzle, hazard, hint). Not yet dispatched. Each brief must include the relevant root-bible sections and the first-zone topic file slices, plus assigned IDs/aliases, topic IDs, output path, applicable N/P/C/H/D rule IDs and a definition of done.
- The first area covers eight spec topics (`switch-to-bit`, `data-types`, `number-conversion`, `character-representation`, `graphics-representation`, `sound-representation`, `data-storage-units`, `data-compression`). Editorial plan is two review groups — number systems first, then representation — with one writer per output file; confirm in the approval.
- Both reviewers to run in parallel on the exact returned card paths after the first batch (content-rules.md §2 W4, V2). `pck-reviewer` checks subject accuracy, GCSE depth, terminology and cognitive load, including the transistor's 1.1.1 "be aware of" depth.
- Topic IDs to be mirrored as `## Topic: <id>` headings in `docs/coverage/COVERAGE.md` at integration, with spec references, room IDs, status and evidence (V3, Gate 3). `switch-to-bit` is unscored (maxScore 0) to avoid double-counting with the parked `hardware-ethics-and-history` topic.
- The former `area-1-1-computer-architecture` detail is parked in `docs/content/topics/1-1-computer-architecture.md`; its IDs and aliases remain reserved in the root registry.
