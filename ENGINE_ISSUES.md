# Engine issues — batched hand-off

Derived from [`PLAYTEST_ISSUES.md`](PLAYTEST_ISSUES.md). Only issues owned by the
game engine are listed here: the command parser and aliases, the entry/UI shell,
status and log rendering, persistence, quiz mechanics and static site config.
Room prose, NPC dialogue, puzzle design, hint text and specification citations
are deferred to a separate content session.

Issue numbers match the playtest log so findings can be traced back to the
verbatim evidence.

## Refinements applied

- **Issue 31 is now a removal, not a feedback fix.** The "Download quarantined
  save" option is to be removed entirely. Students only need to be able to
  download a save. Confirmation for the ordinary **Download** action is covered
  by issue 16.
- **Issue 1 is expanded and promoted.** Alongside the missing introductory text,
  objective, control hint and "type help" prompt, the command vocabulary and
  aliases must be made intuitive and user friendly. Full words should be
  first-class (for example `examine` should work without the player needing to
  know `x`), and the syntax the game requires should be discoverable rather than
  guessed. This needs planning, so it is its own batch.

## Decisions settled with the user

Recorded on 26 November 2026. These are fixed inputs for implementation; no
further product decision is needed for them.

### Batch E1 — onboarding and intuitive commands

| Topic              | Decision                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Entry-screen copy  | Engine builds the copy slots with minimal placeholder text. Final wording comes from the content session.                             |
| Placement          | A short prompt on the title overlay, then the objective and controls as the first lines of the game log.                              |
| Command vocabulary | Full words are primary; existing short forms (`x`, `i`, `inv`, direction shortcuts) remain as conveniences. Help lists both.          |
| `ask` syntax       | Accept `ask about <topic>` by inferring the NPC when exactly one is present, alongside `ask <npc> about <topic>`.                     |
| Quiz answers       | Accept a bare number (`1`, `2`, …) in addition to `answer N` and exact option text. No letter shortcuts, no clickable option buttons. |
| Help               | One static list of every supported command, alias and required syntax.                                                                |

Implementation notes for E1: `TitleScreen` gains the copy slots; the intro and
controls are published as the first log batch; the command table becomes the
single source for both the parser aliases and the help list, so they cannot
drift apart.

### Batch E2 — engine fixes and removals

| Issues           | Decision                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5, 8, 13, 22, 28 | Suppress all internal-state lines in `formatEvent`. Exception: `score-changed` prints only on a real gain, in friendly wording with no room ID.   |
| 25 (sidebar)     | Remove the specification citation from the progress panel; keep the topic title and status.                                                       |
| 9, 10            | Accept bare numbers as quiz answers (E1). Prefix the existing explanation with fixed engine copy: "Correct." or "Incorrect.".                     |
| 30 (now in E2)   | Show the pass-mark requirement and how many wrong answers remain, derived from `quiz.passMark`.                                                   |
| 24               | Autosave to browser storage after every successful command.                                                                                       |
| 31               | Remove the **Download quarantined save** button and its action only; keep the internal quarantine storage as a recovery path for invalid saves.   |
| 15               | The area-entry life reset applies only when all quizzes and puzzles for that area have been solved. Otherwise lives carry across area boundaries. |
| 6                | Use a simple engine-authored SVG favicon linked from `index.html`.                                                                                |

Further points settled by the code rather than by the user:

- Issue 16: the typed `save` and `download` commands already log confirmation;
  route the sidebar buttons through the same façade path so they log too.
- Issue 11: render only the current progress state in the sidebar and reconcile
  the totals; no separate product decision is required.
- Issue 15 implementation detail: mapping quizzes and puzzles to an area must
  use the existing content relations; the rule above is authoritative and needs
  no further user input.

## Issues in scope

| #   | Issue                                             | Engine scope                                                                                        |
| --- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | Title screen gives no goal or controls            | Add copy slots, overlay prompt and first log lines; make commands and aliases intuitive (expanded)  |
| 2   | `help` omits the commands the game actually needs | Generate a static list of every command, alias and required syntax from the canonical command table |
| 5   | Score spam on every move                          | Print only on a real gain, in friendly wording with no room ID                                      |
| 6   | Missing favicon                                   | Add a simple SVG favicon so the first page load has no 404                                          |
| 8   | Internal IDs leak into the player-facing log      | Suppress internal-state lines from the log                                                          |
| 9   | Quiz answers cannot be given using the options    | Accept a bare number alongside `answer N` and option text                                           |
| 10  | Quiz feedback does not say whether an answer      | Prefix explanation with "Correct." / "Incorrect."; remove unprompted `Hint penalty: 0.` lines       |
| 11  | Sidebar shows a stale score card for every room   | Show current state only; reconcile score and room totals                                            |
| 13  | Inventory shows an internal item ID               | Render the item name; remove the `moved from … to …` debug line                                     |
| 15  | Undocumented life restoration                     | Gate the area-entry life reset on all quizzes and puzzles in that area being solved                 |
| 16  | Save and Download give no confirmation            | Route the buttons through the façade path so the existing confirmation lines reach the log          |
| 22  | Internal IDs in puzzle/quiz success messages      | Suppress implementation strings; no duplicate "Topic completed" line                                |
| 24  | No autosave; reloading loses progress quietly     | Autosave to browser storage after every successful command                                          |
| 25  | Sidebar exposes internal specification citations  | Remove the citation from the progress panel; keep topic title and status                            |
| 28  | "Puzzle … is now active." printed repeatedly      | Suppress the activation notice entirely                                                             |
| 30  | Quiz pass/fail threshold is invisible             | Show the pass mark and remaining wrong answers                                                      |
| 31  | Quarantined-save download does nothing visibly    | **Remove the button and action**; students only need a normal save download                         |

## Batches

### Batch E1 — Onboarding and intuitive commands (planning-led)

**Issues:** 1 only.

Kept separate because it needs design decisions before code: what the player is
told on the entry screen, what the canonical command vocabulary is, and how
short forms relate to full words.

Scope, per the settled decisions:

- Add copy slots with minimal placeholder text to the entry screen; final
  wording is supplied by the content session.
- Publish the objective and controls as the first lines of the game log, with a
  short "type `help`" prompt on the overlay.
- Make a single command table authoritative for both parsing and help: full
  words are primary, existing short forms remain as conveniences, `ask about
<topic>` infers the only NPC present, and bare numbers answer quiz options.
- Cover the entry screen and alias behaviour with tests and a browser check.

Dependency: Batch E2 Group A (help output) must reflect the command set agreed
here, so E1 is done first.

### Batch E2 — Engine fixes and removals (single implementation batch)

The remaining smaller issues are grouped here by theme. If the batch proves too
large in practice, split along these group lines rather than by issue number.

**Group A — Command help and feedback**

- Issue 2: generate `help` from the canonical command table agreed in E1.

**Group B — Keep debug output out of player-facing text**

- Issues 5, 8, 13, 22, 25, 28: suppress internal-state lines in `formatEvent`,
  except a real score gain; remove the leaked citation from the sidebar.

**Group C — Quiz answering and feedback**

- Issues 9, 10 and 30: accept bare numbers, prefix explanations with "Correct."
  or "Incorrect.", show the pass mark and remaining wrong answers, and remove
  the stray hint-penalty line.

**Group D — Status, saves and persistence**

- Issues 11, 16, 24 and 31: correct the status panel, route Save/Download
  buttons through the logging path, autosave each turn, and remove the
  quarantined-save download button and action.

**Group E — Rules and static config**

- Issues 6 and 15: add the SVG favicon; gate the area-entry life reset on all
  quizzes and puzzles in the area being solved.

## Parallel execution

The batches are split by file ownership, not by issue number. Most groups can
run concurrently; the exceptions below are places where two changes would edit
the same file. Where a file is contested, give it to one worker rather than
letting two edit it in parallel.

| Stream                | Issues                          | Files owned                                                                                                                                 | Notes                                                                          |
| --------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1 — Onboarding        | 1, 2, 9                         | `TitleScreen.ts`, `GameWindow.ts` (overlay and first batch), canonical command table, `Parser.ts`, `verbs/index.ts`, `commandResolution.ts` | Must precede E2 Group A: they share the command table and help handler.        |
| 2 — Transcript        | 5, 8, 13, 22, 28, stray 10 line | `src/ui/formatEvent.ts`                                                                                                                     | One file, so these issues are a single worker, not parallel inside the stream. |
| 3 — Sidebar           | 25, 11                          | `src/ui/ScorePanel.ts`                                                                                                                      | Independent of stream 2 (different file).                                      |
| 4 — Quiz presentation | 10, 30                          | `QuizPanel.ts`, `GameViewData.ts`, `Game.ts` (`quizView`), possibly `QuizSystem.ts`                                                         | Touches the `Game.ts` façade.                                                  |
| 5 — Persistence       | 16, 24, 31                      | `SaveControls.ts`, `GameWindow.ts` (`makeActions`, `downloadQuarantine`), `Game.ts` (`submit`, `save`, `download`), `e2e/helpers.ts`        | Touches both `Game.ts` and `GameWindow.ts`.                                    |
| 6 — Rules and config  | 6, 15                           | `index.html` and a new SVG asset, `EffectApplier.ts` (`areaChangeEvents`), content-relations lookup                                         | Fully independent; a good stream to start early.                               |

Conflicts to resolve by ownership or sequencing:

- E1 and E2 Group A share the canonical command table and `help` handler, so E1
  runs first by design.
- Bare-number answers (issue 9) and `ask about <topic>` both edit
  `commandResolution.ts`; issue 9 is folded into E1 rather than being a separate
  task.
- The "Correct." / "Incorrect." prefix for issue 10 and all the other log
  suppression both land in `formatEvent.ts`. Keep one owner for that file, or
  put the prefix in `QuizSystem` so the two streams do not collide.
- Streams 4 and 5 both edit `Game.ts` (quiz view building and autosave). Either
  run them one after the other, or give one worker exclusive ownership of
  `Game.ts` and keep the other in `QuizPanel.ts`/`GameViewData.ts` plus a small
  seam.
- Streams 1 and 5 both edit `GameWindow.ts` (overlay and first batch versus save
  buttons and quarantine). `e2e/helpers.ts` is also likely touched by both E1
  selectors and the issue 31 quarantine fixture, so assign it to one stream.

Suggested waves:

- **Wave 1, in parallel:** stream 1 (E1 and help), stream 2 (formatEvent),
  stream 3 (sidebar), stream 6 (favicon and life gate).
- **Wave 2, in parallel:** stream 4 (quiz presentation) and stream 5
  (persistence), with the `Game.ts` conflict resolved as described above.

Each stream should create its own test files. Shared fixtures under
`tests/fixtures/` and `e2e/helpers.ts` must have only one owner at a time.

## Definition of done

For each batch: `npm test`, `npm run typecheck`, `npm run lint` and Prettier on
the files changed, plus a browser check of the affected flow. Keep the graph
current with `graphify update .` after code changes, and record the work in the
usual scratchpad slice paths.

## Out of scope — deferred to the content session

Issues 3, 4, 7, 12, 14, 17, 18, 19, 20, 21, 23, 26, 27 and 29 remain with the
content editor. Issue 30 is now in Batch E2: the pass-mark visibility part was
pulled in by the settled decision above. Two of the deferred issues have an
engine edge that should be flagged in that hand-off: issue 3 (adjective and noun
aliases for examinable objects) and issue 19 (no verb is accepted for setting
the switches). They are not pulled into these batches, since their fixes are led
by content and puzzle design.
