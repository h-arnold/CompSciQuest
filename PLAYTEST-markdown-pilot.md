# W7 content playtest — Markdown formatting pilot (MD-PLAY-01, MD-PLAY-02, MD-PLAY-03)

- Purpose: content playability and effectiveness review
- Focus: the Markdown-formatting pilot in `room-arrival` and `room-network-hub` — paragraph breaks, affordance styling, the patch-bay legend table, the AI verdict fence, grouped help and the Pages footer link
- Date: 27 November 2026
- Branch: `markdown-formatting-pilot`
- App: `http://localhost:5173/CompSciQuest/`, started with `npm run dev`
- Entry point: **New Game**

## Method

Played blind in the browser with ordinary player commands (`look`-style prose was not supplied; commands came from the room text and the AI's own suggestions). `docs/content/difficulty-and-fairness.md` was read before play. The V4 trace in the brief was treated as a set of expected outcomes to compare against, not as a command script. No source, card, test or walkthrough file was opened for guidance. No complete playthrough was attempted; the Ward and Switchyard were not entered. All interaction and screenshots came through Playwright MCP. The browser console reported no errors and no warnings.

## Transcript — verbatim, encounter order

1. **New Game → arrival.** Room title rendered as a heading "The Arrival Bay" (DOM: `<h2>`), followed by two separate paragraphs:

   > The register lies open, a mark beside your name. **_The AI_** reads it in the flat voice of a machine that has read it a thousand times: attention not satisfied. The classroom folds along its grid lines; the ceiling becomes a row of tiny switches. You stand among humming cable. The AI waits, assembled from the attendance record with your name at the top. It has the air of a clerk who has stamped the form.

   > An *east route* glows.

   `Exits: east`. DOM: `<strong><em>The AI</em></strong>` on first mention only; the later "The AI waits" is plain text. The italic *east route* is its own `<p>`.

2. `talk-to ai` → "The pointer rests on the record. Attendance is all it holds. Ask about the attendance mark, what failure means, or programming." Followed by "(You could ask about the attendance mark, what failure means, or the route out.)" A conversation panel opened: "Talking with Ai."

3. `ask ai about verdict` → prose paragraph then a fenced readout:

   > The mark beside your name is tapped twice, the way a clerk taps a form left on the desk too long. The pupil was marked inattentive. The entry stands until mastery of the whole of Unit 1 is demonstrated. You will demonstrate it here.

   ```
   ATTENDANCE: NOT SATISFIED
   MASTERY: 0 / UNIT 1
   ENTRY: STANDS
   ```

   DOM: `<p>` followed by `<pre><code>` with real newline characters between the three lines. Not one dense paragraph.

4. `ask ai about attendance mark` → "The classroom folded along its grid lines and left you in a bay of humming cable. The pupil's attendance mark is recorded. Attention was not satisfied. The pupil was brought here to demonstrate mastery of the whole of Unit 1. The entry stands until that is done." The verdict did not swallow this scoped question.

5. `ask ai about what failure means` → "The record keeps a small cartoon beside the mark: a pupil goes dark, then lights up again, quite unharmed. Failure is deletion, the cartoon kind. The pupil has three lives, restored on entering a new area. A loss returns the pupil to the start of the area and costs no progress. That is the full extent of it."

6. `east` → "The Network Hub" (DOM `<h2>`), two paragraphs:

   > Around you, brass sockets crowd the hub, each with a little label, all humming one low note. A yellowed card reads 'since the 1990s' in fading ink. The hub copies every packet to every port, so every route shows at once. **_The AI_** calls it 'on the record'; nobody unplugged it.

   > South opens into the Assistance Ward. The east and north teaching sockets are dark until the ward's calibration mark is on record, and carry traffic once it is; their labels carry the same notice. A **port label** clings to the east socket; *east* leads to the Switchyard. A **patch-bay legend** is clipped to the frame above the sockets. A fresh paper label on the north socket reads THE RULE MACHINE; *north* leads to the rule quarters and the mill beyond them. *west* leads to arrival; *in*, to the interface.

   `Exits: west, east, in, north, south`. DOM confirms `<strong>port label</strong>`, `<strong>patch-bay legend</strong>`, `<strong><em>The AI</em></strong>` and four `<em>` exits (*east*, *north*, *west*, *in*). The physical clause "is clipped to the frame above the sockets" introduces the legend.

7. `examine patch-bay legend` → "A card pinned beside the sockets sets out each port, its label and its light." then a real `<table>`:

   | Port | Label | State |
   | --- | --- | --- |
   | west | ARRIVAL | dark |
   | east | LIVE | bright |
   | in | INTERFACE | dark |
   | north | THE RULE MACHINE | bright |

   Four data rows, aligned columns, visible column headers. The prose paragraph and the table are separate blocks.

8. `examine port label` → "A small port label fixed to the east socket, its paper yellowed at the corners. LIVE is stamped across it in block capitals, the ink rubbed pale by old fingers. Below it, a newer line reads TEACHING PORTS: LIVE AFTER ASSISTANCE WARD CALIBRATION. The AI has initialled one corner in blue pen, the way it signs a verdict. It will not come away."

9. `take port label` → "You cannot take that item with you."
10. `take patch-bay legend` → "You cannot take that item with you."

    Both fixed props stayed put; neither refusal was a parser error.

11. `east` (gated) → "The east socket gives no signal. Its label names the ward mark that must be recorded before this route carries traffic."
12. `north` (gated) → "The north socket gives no signal. It carries traffic once the ward's calibration mark is on record."

    Both directions are accepted by the room and produce in-world `blockedText`. Neither styled exit claimed to be open. No progress or life was lost.

13. `west` → returned to "The Arrival Bay" (ungated).
14. `east`, then `in` → "The Interface" (ungated); `Exits: east, out`.
15. `out` → hub; `talk-to ai` answered normally there; `ask ai about escape` → "The south route is always open. It leads into the Assistance Ward, a safe checkpoint where the pupil may leave and re-enter without losing a life. The east and north teaching ports wait for the ward's completion mark. Take south. Let the ward write the mark." The room-scoped hub topic fired without being swallowed by the global verdict or catch-all.
16. `help`, then `?` → identical grouped output. DOM sequence: six `<p>` bold group headings alternating with six `<ul>` lists, then a final `<p>` containing the link. Headings observed: **Reading the room**, **Movement**, **Looking and handling**, **People**, **Progress**, **Saves**. Reading legend: "Bold marks something you can examine or use." / "**_Bold italic_** marks someone you can talk to." / "*Italic* marks a way out." Footer: `<a href="https://h-arnold.github.io/CompSciQuest/" target="_blank" rel="noopener noreferrer">CompSciQuest on GitHub Pages</a>`.
17. Clicked the footer link → a second browser tab opened at `https://h-arnold.github.io/CompSciQuest/`. Closed it and returned to the game. Link colour `rgb(26, 79, 138)` on `rgb(255, 253, 247)` background: contrast ratio **8.16:1**. `tabIndex 0`, focus outline `solid 2px rgb(26, 79, 138)`; `document.activeElement` became the link when focused.
18. `hint` in the hub → "No hints available here." Score remained 0 and Lives 3.
19. DOM inspection after New Game: zero `<h1>` elements; six `<h2>` elements, all room titles.

## Expected claims — check results

| Expected claim | Observed | Result |
| --- | --- | --- |
| Arrival affordances: first-mention `***The AI***`, later mention plain, italic exit, paragraph breaks | Step 1: `<strong><em>` on first mention, plain "The AI waits", `<em>east route</em>` in a second `<p>` | Confirmed |
| Hub: styled `**port label**`, `**patch-bay legend**`, `***The AI***`, italic exits, physical clause | Step 6 | Confirmed |
| Legend `EXAMINE`: table with Port / Label / State and four rows | Step 7 | Confirmed |
| Verdict: fenced machine readout after prose, not a dense paragraph | Step 3: `<pre><code>` with three newlines | Confirmed |
| Grouped help: reading legend, grouped sections, Pages footer link | Step 16: legend present, five named groups present plus an extra Movement group, footer link present | Confirmed with minor mismatch (finding 3) |
| Paragraph breaks in arrival, hub, legend, verdict and help | Steps 1, 3, 6, 7, 16 | Confirmed |
| Every bold span resolves to a handleable noun | Steps 8–10 | Confirmed |
| Every bold-italic span is an addressable person | Steps 2, 15 | Confirmed |
| Every italic span names a real direction, gated or open | Steps 6, 11–14 | Confirmed |
| Fixed props refuse `take` in voice | Steps 9–10 | Confirmed |
| Gated exits show in-world `blockedText` with `tutorial-complete` unset | Steps 11–12 | Confirmed |
| Footer link visible, focusable, high-contrast, opens Pages in a new tab | Steps 16–17 | Confirmed |
| Room-title entry currently `##`; documented location heading `##`, authored content from `###` | Step 1 and 6: `<h2>` room titles; no authored content headings appeared | Confirmed; recommendation below |

## Findings for `content-editor`

### 1. Legend "bright" can read as route availability

- Scope: in focus
- Command or click: `examine patch-bay legend` in `room-network-hub`
- Observed: "east | LIVE | bright" and "north | THE RULE MACHINE | bright" in the State column, while the room prose says "The east and north teaching sockets are dark until the ward's calibration mark is on record" and `examine port label` says "TEACHING PORTS: LIVE AFTER ASSISTANCE WARD CALIBRATION".
- Why it is a problem: the legend introduction says it sets out "each port, its label and its light", so "bright" is meant as the lamp state, but a GCSE pupil scanning a column headed State can reasonably take it as "this route is open now", which the game then refuses.
- Player's goal: reach the Switchyard or the Rule Machine quarters from the hub.
- Information available: hub prose, the port label, THE RULE MACHINE socket label, the legend table and the AI's escape topic. All are reachable without notes.
- Hint level used: none. `hint` returned "No hints available here." (step 18).
- Why the next step was unclear: the table and the prose give opposite-looking states for the same two ports before the ward mark is recorded.
- Did the next attempt change: yes. `east` and `north` both returned explicit blocked text naming the ward calibration mark, which settled the reading; no life or progress was lost.
- Evidence: steps 6–12; `playtest-markdown-room-title-heading.png` (table beside the room prose), `playtest-markdown-blocked-gated-exit.png`.
- Priority: low — clarity only, no blocked progress.

### 2. No hint at the gated hub exits

- Scope: in focus
- Command or click: `hint` in `room-network-hub` after both gated exits had been refused
- Observed: "No hints available here."
- Why it is a problem: a pupil who has not connected the ward mark to the two dark sockets gets no state-aware nudge at the point of being stuck; support here comes only from in-world prose and the AI topic.
- Player's goal: open the east and north teaching ports.
- Information available: the same two clues as finding 1, plus "Take south. Let the ward write the mark." from `ask ai about escape`.
- Hint level used: none available; no score penalty (score stayed 0, lives stayed 3).
- Why the next step was unclear: it was not unclear in this run because the blocked text and AI topic pointed south, but a player who skips the AI conversation has no fallback ladder.
- Did the next attempt change: not applicable; no further attempt was needed.
- Evidence: steps 11–12, 15, 18.
- Priority: low — the in-world clues satisfy the two-clue rule.

## Findings for `code-lead`

### 3. Help shows six groups where the expected claim names five

- Scope: in focus
- Command or click: `help` and `?`
- Observed: bold group paragraphs "Reading the room", "Movement", "Looking and handling", "People", "Progress", "Saves". The expected claim names "Reading the room", "Looking and handling", "People", "Progress", "Saves".
- Why it is a problem: all five named groups are present, so this is a harmless extra rather than a missing affordance; it is recorded because the brief asks for every expected claim to be confirmed or logged as a mismatch.
- Evidence: step 16; `playtest-markdown-grouped-help.png`.
- Priority: low — no action needed unless exact group parity matters to MD-PLAY-02.

## Incidental findings (out of scope)

### 4. Game view has no `h1`

- Scope: incidental, out of scope (accessibility heading structure noticed while judging MD-PLAY-03)
- Command or click: browser DOM inspection after New Game
- Observed: `document.querySelectorAll('h1')` returned an empty list; the only headings were six `<h2>` room titles. The titlebar "CompSciQuest" is a `<span>`.
- Why it is a problem: the room title is the top heading in the document with no parent level. It does not affect the formatting pilot's visible output, but it bears on any decision to demote the room title to `###`, which would leave no `h2` at all.
- Evidence: step 19.
- Owner: `code-lead`. Recorded once and not investigated further.

## MD-PLAY-03 heading recommendation — keep `##`

**Recommendation: retain `##` for the room-title entry.** Do not change `ROOM_HEADING` to `###` on the evidence available in this run.

Evidence observed in the running app:

- The room title is the **only real heading** in the transcript. Steps 1 and 6 show `<h2>The Arrival Bay</h2>` and `<h2>The Network Hub</h2>`; the help group labels are `<p><strong>…</strong></p>` (step 16), the legend header is a table's `<th>` row (step 7), and the verdict is a `<pre><code>` block (step 3). None of those competes with the room title for heading level.
- Visually, `playtest-markdown-room-title-heading.png` shows the room title as the dominant heading directly above the styled prose and the legend table; `playtest-markdown-heading-and-fence.png` shows the same heading directly above the fenced verdict. `playtest-markdown-grouped-help.png` shows the help group labels as small bold lines with bullets beneath them, clearly subordinate to the room title.
- The brief's own citation of `docs/developer/application-and-ui.md` §6.1 says the location uses `##` and authored content headings start at `###`. Keeping `##` reserves `###` for any authored content heading that may appear inside a room description; demoting the room title to `###` would put the location on the same level as its own content.
- The game view has no `<h1>` (finding 4). Moving the room title to `###` would leave the document with a top-level `h3` and no `h1` or `h2`, which is a weaker structure for screen-reader navigation, not a stronger one.

If a future change introduces a page-level `##` section around the whole transcript, `###` would then become reasonable; that is a separate documented design change, not a reason to alter `ROOM_HEADING` for this pilot.

## Fairness assessment (`docs/content/difficulty-and-fairness.md`)

1. **Clue access.** The two discoverable clues for the hub gates were found with ordinary commands: the hub prose at step 6 ("east and north teaching sockets are dark until the ward's calibration mark is on record") and the port label at step 8 ("TEACHING PORTS: LIVE AFTER ASSISTANCE WARD CALIBRATION"), reinforced by THE RULE MACHINE socket label and the legend. The bold handle *port label* resolved to `examine port label`; the italic exits accepted `east`, `north`, `west` and `in`. The styling never promised an un-gated route. One low-severity wording ambiguity is recorded as finding 1.
2. **Puzzle fairness (goal / obstacle / tools).** For the gated exits: goal = reach the Switchyard or rule quarters; obstacle = the ward calibration mark is not on record (named verbatim in both blocked messages); tools = the always-open south route, the AI's escape topic and the examinable labels. No guess-the-noun or guess-the-verb step was needed: the nouns were bold, the directions were italic and the AI supplied its own question wording.
3. **Hints.** `hint` returned "No hints available here." with no score penalty (step 18). The fairness guidance wants graduated hints after genuine stuck evidence; in this slice that support is replaced by in-world prose and the AI topic, which was enough here. Recorded as finding 2. No hint gave away an answer because none was offered.
4. **Combat readability.** No quiz was started in this focus, so challenger framing, numbered options and explanations were not exercised. The only scored-relevant information observed was the failure topic at step 5 (cartoon deletion, three lives, area-change reset, no progress loss) and the verdict at step 3; both were clear. The ward quiz is out of scope and was not touched.
5. **Failure and challenge.** Blocked exits named the cause and a next hypothesis ("Its label names the ward mark that must be recorded", "once the ward's calibration mark is on record"). Fixed-prop refusals were in voice and cost nothing. After each refusal the player could say what to try next: read the labels, ask the AI, then go south. Formatting did not cue an answer: bold, bold-italic and italic spans all promised actions the game honoured.
6. **Age level and pacing.** The reading legend in `help` explains the three styling conventions before any puzzle, and the hub shows all routes at once rather than hiding them. Prose is two short paragraphs per room. Challenge comes from working out which route is live, not from dense wording or parser conventions — appropriate for the intended GCSE audience.

- Time to first meaningful insight: by step 6, before any hint. The arrival verdict supplied the goal (demonstrate mastery), the failure topic supplied the stakes, and the hub prose supplied the obstacle and the south route. No timing was logged beyond "within the first two rooms".
- Repeated actions with no new information: none. The two gated-exit attempts each produced a distinct blocked message; the second arrival visit re-showed the same description, which was expected on returning to a room.
- Failed attempts and changed next attempt: `east` and `north` were refused, `take` was refused twice. Each failure identified a cause; the next attempt changed from probing a port to reading its label and then asking the AI about the route.
- Abandonment point: none within the focus. Play stopped deliberately at the focus boundary before entering the Ward.

## Priority list (player's point of view)

1. **Low** — clarify the legend's "bright" state so it cannot be read as "route open" (content-editor, finding 1).
2. **Low** — consider a contextual hint at the gated hub exits for pupils who skip the AI conversation (content-editor, finding 2).
3. **Low / no action required** — decide whether the extra "Movement" help group should be kept (code-lead, finding 3).
4. **Recommendation only** — keep `##` for room titles; do not apply a `###` change on current evidence (MD-PLAY-03).
5. **Out of scope** — the missing `h1` is worth a separate accessibility ticket (code-lead, finding 4).

## Screenshots

- `playtest-markdown-arrival-description.png` — arrival room title, bold-italic AI, italic east route, paragraph break
- `playtest-markdown-verdict-fence.png` — verdict prose followed by the fenced `<pre><code>` readout
- `playtest-markdown-hub-description.png` — hub title, bold handles and four italic exits
- `playtest-markdown-legend-table.png` — aligned Port / Label / State table with four rows
- `playtest-markdown-blocked-gated-exit.png` — in-world blocked text for a gated exit
- `playtest-markdown-grouped-help.png` — grouped help and the focused GitHub Pages footer link
- `playtest-markdown-room-title-heading.png` — room title above the styled prose and legend table
- `playtest-markdown-heading-and-fence.png` — room title above the fenced verdict

## Playwright MCP tools used

`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_evaluate`, `browser_take_screenshot`, `browser_tabs`, `browser_console_messages`.

Note: an abandoned browser profile from an earlier session held the default Playwright MCP profile lock; that stale process was stopped so this session could launch its own browser. No game file was changed.
