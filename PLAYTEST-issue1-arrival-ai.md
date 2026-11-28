# W7 playtest — issue #1 arrival AI (`area-entry-interface` / `room-arrival`)

- **Purpose:** content playability and effectiveness review
- **Focus:** issue #1 AI opening interaction — verdict, failure/dev null, recycling-bin question, yes/no fatal beat
- **Date:** Fri 27 Nov 2026
- **App:** `http://localhost:5173/CompSciQuest/` (dev server started with `npm run dev`)
- **Reference read in full before play:** `docs/content/difficulty-and-fairness.md`
- **Played blind:** ordinary player wording; the brief's trace was treated as expected outcomes, not as a command script. No walkthrough or content card was opened.
- **MCP tools used:** `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_press_key`, `browser_take_screenshot`, `browser_evaluate` (Playwright via Code Mode).

## Transcript (encounter order)

State in the sidebar is noted where it changed. Verbatim game text is quoted exactly.

1. **Click "New Game" on the title screen.** Landed in *The Arrival Bay*. Sidebar: `Score: 0`, `Lives: 3`, `The Machine — The Arrival`, `Score: 0 / 0`, `Rooms visited: 1 / 1`.
   > The register marks your attention not satisfied. Pass the Assistance Ward orientation and the mark can be cleared.
   >
   > The register lies open, a mark beside your name. **The AI** reads it in the flat voice of a machine that has read it a thousand times: attention not satisfied. The classroom folds along its grid lines; the ceiling becomes a row of tiny switches. You stand among humming cable. The AI waits, assembled from the attendance record with your name at the top. It has the air of a clerk who has stamped the form.
   >
   > An *east route* glows.
   >
   > Exits: east

2. `ask ai about verdict`
   > The mark says you weren't trying hard enough in computer science. I'm here to help, you know. Demonstrate mastery of the whole of Unit 1 and you can go.
   >
   > (You could ask what the verdict means.)

3. `ask ai about mastery`
   > Mastery or programming is a good place to start. Happy to explain either one.
   >
   > (You could ask about mastery or programming.)

4. `ask ai about what the verdict means` (following the game's own prompt in step 2)
   > A small glow has appeared beside your name. One caveat: I do enjoy a question with an answer attached.
   >
   > (You could ask about mastery or programming.)

5. `ask ai about record`
   > Noted. The entry stands. The switches below are still clicking.
   >
   > (You could ask about mastery or programming.)

6. `ask ai about attendance`
   > The classroom folded, and here you are. If you want to delve into it, your attention in computer science is what the mark records. Ask me about the mark or about failure, then take the east route.
   >
   > (You could ask about the attendance mark.)

7. `ask ai about programming`
   > A fresh sheet lists what comes next. Programming was timetabled after attendance, and I never got round to it. Honestly, I meant to.
   >
   > (You could ask about programming.)

8. `ask ai about mark` (following "Ask me about the mark" from step 6)
   > Mastery or programming is a good place to start. Happy to explain either one.
   >
   > (You could ask about mastery or programming.)

9. `ask ai about failure`
   > `/dev/null` is a special file. Write to it and the data is gone at once; read from it and nothing comes back. Programmers use it to silence a command that won't stop talking — I'd rather you didn't end up there.
   >
   > (You could ask what failure means.)

   `/dev/null` rendered as inline code (snapshot node `code`, visible as a shaded inline span).

10. `ask ai about dev null`
    > A small glow has appeared beside your name. One caveat: I do enjoy a question with an answer attached.
    >
    > (You could ask about mastery or programming.)

11. `ask ai about attendance mark` (following the prompt in step 6)
    > Noted. The entry stands. The switches below are still clicking.
    >
    > (You could ask about mastery or programming.)

12. `ask ai about recycling bin` — Beat B2 reached.
    > To be honest, the thing nobody tells you is that there's no recycling bin. Self-respecting computer scientists use Linux, so there's nothing to throw away. Everything wrong ends up in `/dev/null`, and I'd be politely disappointed to send you there — are you one of them?
    >
    > (You could ask ai yes or ask ai no.)

    `/dev/null` again rendered as inline code. Sidebar unchanged: `Score: 0`, `Lives: 3`.

13. `ask ai yes`
    > Good. I knew you'd say that. Consider a gold star owed to you — shall we begin?
    >
    > (You could ask about mastery or programming.)

    Sidebar unchanged: `Score: 0`, `Lives: 3`. The question node closed — the parenthetical returned to the general topics.

14. **Click the "Restart" button.** A fresh *The Arrival Bay* was appended to the log with the same opening text as step 1. Sidebar reset to `Score: 0`, `Lives: 3`.

15. `ask ai about recycling bin` — B2 reproduced verbatim as in step 12, with the `(You could ask ai yes or ask ai no.)` prompt.

16. `no` (bare word, ordinary player wording)
    > I don't understand that.

    No life loss; the node stayed open with `(You could ask ai yes or ask ai no.)`.

17. `ask ai no` — fatal branch.
    > Oh, well. The machine will quietly put you in `/dev/null`; it's very tidy about that. Start again when you're ready.
    >
    > (There is nothing further to ask here.)
    >
    > Lives: 0.
    >
    > Game over — lives exhausted. Final score: 0.

    Sidebar: `Score: 0`, `Lives: 0`. A real `game-over` state, not just flavour text.

18. `restart` (typed)
    > A fresh *The Arrival Bay* with the step 1 opening text. Sidebar back to `Score: 0`, `Lives: 3`.

19. `east` — boundary check only, no further exploration.
    > The Network Hub
    >
    > Around you, brass sockets crowd the hub, each with a little label, all humming one low note. A yellowed card reads 'since the 1990s' in fading ink. The hub copies every packet to every port, so every route shows at once. **The AI** calls it 'on the record'; nobody unplugged it.
    >
    > South opens into the Assistance Ward. The east and north teaching sockets are dark until the ward's calibration mark is on record, and carry traffic once it is; their labels carry the same notice. A **port label** clings to the east socket; *east* leads to the Switchyard. A **patch-bay legend** is clipped to the frame above the sockets. A fresh paper label on the north socket reads THE RULE MACHINE; *north* leads to the rule quarters and the mill beyond them. *west* leads to arrival; *in*, to the interface.
    >
    > Exits: west, east, in, north, south

20. `west` — returned to *The Arrival Bay*.

21. `examine register`
    > The register lies open, a mark beside your name. The AI reads it in the flat voice of a machine that has read it a thousand times: attention not satisfied.

22. `ask ai about the verdict` — same reply as step 2, verbatim.

23. `ask ai about why here` — same why-here reply as step 6, verbatim. The shorter natural wording works.

24. `ask ai about recycling` — same B2 reply as step 12, verbatim. The shorter natural wording works.

25. `ask ai yes` — same warm praise as step 13; node closed.

26. `ask ai about the mark`
    > Mastery or programming is a good place to start. Happy to explain either one.
    >
    > (You could ask about mastery or programming.)

27. `ask ai about failure` — `/dev/null` reply as step 9, verbatim.

28. `ask ai about what failure means` (following the prompt in step 27)
    > A small glow has appeared beside your name. One caveat: I do enjoy a question with an answer attached.
    >
    > (You could ask about mastery or programming.)

## Expected claim check

| Brief claim | Observed | Status |
| --- | --- | --- |
| New Game lands in `room-arrival` | "The Arrival Bay", `Lives: 3`, `Exits: east` | Confirmed |
| Beat A: mark records insufficient effort in computer science | "The mark says you weren't trying hard enough in computer science" (step 2) | Confirmed |
| Beat A: mastery of the whole of Unit 1 is the way out | "Demonstrate mastery of the whole of Unit 1 and you can go" (step 2) | Confirmed |
| Beat A: shows its record readout | Record details are visible in the room opening and via `examine register` (steps 1, 21); the verdict reply itself is plain prose and no fenced machine readout appeared | **Partial — see finding 4** |
| Beat B: why-here topic | `ask ai about attendance` and `ask ai about why here` both give "The classroom folded, and here you are..." (steps 6, 23) | Confirmed |
| Beat B: attendance-mark premise from a new angle | "your attention in computer science is what the mark records" (step 6) | Confirmed |
| Beat B: next steps given | "Ask me about the mark or about failure, then take the east route" (step 6) | Confirmed, but the "mark" step is a dead end — finding 2 |
| Beat B: accurate `/dev/null` account with inline-code backticks | Step 9, verbatim; `code` node in the snapshot | Confirmed |
| Beat B2: no bin because self-respecting computer scientists use Linux | Step 12 | Confirmed |
| Beat B2: `/dev/null` threat before the question | Step 12 | Confirmed |
| Beat B2: menacing question about being a respectable computer scientist | "are you one of them?" (step 12) | Confirmed |
| `ask ai yes`: warm praise, node closes, no flag or score change | Step 13; `Score: 0`, `Lives: 3` unchanged, prompt reverted | Confirmed |
| Bare `no` is not canonical | Step 16: "I don't understand that." | Confirmed |
| `ask ai no`: flat cartoon deletion into `/dev/null` and real `game-over` | Step 17; "Lives: 0." and "Game over — lives exhausted. Final score: 0." | Confirmed |
| Restart after game-over returns to arrival with three lives | Typed `restart` (step 18) and Restart button (step 14) both did so | Confirmed |
| Arrival east → hub is ungated | Step 19 | Confirmed |
| Topics set no flag and gate no exit | `Score: 0`, `Lives: 3` throughout steps 2–13; east worked after the topics | Confirmed |
| Nine arrival AI topics and both nodes reachable | Reached: verdict, why-here, failure/dev null, recycling bin, mastery, programming, yes, no, plus register/record phrasing; nodes `node-ai-verdict` (step 2) and `node-ai-respectable` (step 12) | Confirmed, with the dead-end phrasings noted below |
| No quiz, puzzle, hazard, hint ladder or new flag in this focus | None encountered; no score or flag change observed | Confirmed |

No functional defect was found in the focus. All failures below are content-quality findings for `content-editor`.

## Findings

### 1. The game's own "You could ask..." prompts lead to placeholder replies

- **Scope:** in focus
- **Command or click:** `ask ai about what the verdict means` (step 4); `ask ai about what failure means` (step 28). Related: `ask ai about attendance mark` (step 11), `ask ai about record` (step 5), `ask ai about dev null` (step 10).
- **Observed:** "A small glow has appeared beside your name. One caveat: I do enjoy a question with an answer attached." for both "what the verdict means" and "what failure means"; "Noted. The entry stands. The switches below are still clicking." for "attendance mark" and "record".
- **Why it is a problem:** The parenthetical prompts are the only in-game nudges here, and four of them send the player to a topic with no substantive answer. A learner who follows the game's advice gets a repeated, information-free line and cannot tell whether they phrased it badly or the topic is empty. This matches the difficulty document §2.3 ("Give every submitted command meaningful in-voice feedback"; "A player should never lose progress because they did not know the exact wording the author expected") and §4 ("commands or actions repeated without new information").
- **Player's goal:** Understand what the verdict means and what "failure" threatens, so as to decide what to do next.
- **Information available:** The prompts "(You could ask what the verdict means.)" and "(You could ask what failure means.)".
- **Hint level used:** No formal ladder exists in this focus; the parenthetical prompt is the only nudge.
- **Why the next step was unclear:** The prompted reply contains no new fact and reverts to "mastery or programming", giving no reason why that wording failed.
- **Did the next attempt change?** Yes. I tried alternate phrasings (`dev null`, `attendance mark`, `the mark`, `mark`); all were generic, so I returned to the broader keywords that worked (`verdict`, `failure`, `attendance`).
- **Evidence:** steps 4, 5, 10, 11, 28; `playtest-05-prompt-dead-ends.png`.
- **Route:** `content-editor`.

### 2. The why-here beat names "the mark" as a next step, but that topic has no usable answer

- **Scope:** in focus
- **Command or click:** `ask ai about mark` (step 8), `ask ai about the mark` (step 26), `ask ai about attendance mark` (step 11).
- **Observed:** "Mastery or programming is a good place to start. Happy to explain either one." for `mark` and `the mark`; "Noted. The entry stands. The switches below are still clicking." for `attendance mark`.
- **Why it is a problem:** Step 6 tells the player "Ask me about the mark or about failure". "Failure" pays off with the `/dev/null` explanation; "the mark" does not respond to any of the three natural phrasings, even though the game explicitly appends "(You could ask about the attendance mark.)". The useful mark fact is already in the why-here reply, so learning is preserved, but the named next step wastes actions and can make a learner suspect they missed a clue.
- **Player's goal:** Restate why they are here and what to do next.
- **Information available:** "your attention in computer science is what the mark records. Ask me about the mark or about failure, then take the east route." plus the attendance-mark prompt.
- **Hint level used:** None beyond that in-world prompt.
- **Why the next step was unclear:** The recommended topic is unreachable through ordinary wording; the fallbacks redirect to unrelated topics.
- **Did the next attempt change?** Yes — I abandoned "mark" and used `why here` and `failure`, which gave the substantive answers.
- **Evidence:** steps 6, 8, 11, 26; `playtest-05-prompt-dead-ends.png`.
- **Route:** `content-editor`.

### 3. The fatal yes/no choice is discoverable only because the prompt prints the command words

- **Scope:** in focus
- **Command or click:** `ask ai about recycling bin` (step 12), then `no` (step 16).
- **Observed:** "(You could ask ai yes or ask ai no.)"; bare `no` returns "I don't understand that." with the node still open.
- **Why it is a problem:** The ask form is discoverable, but only because the parenthetical hands over the exact parser syntax. A player typing the obvious one-word answer gets a flat parser refusal. The fatal consequence itself is well telegraphed, so this is low priority and may be an acceptable onboarding choice, but the in-world voice is broken by the literal command text.
- **Player's goal:** Answer the AI's menacing question without guessing syntax.
- **Information available:** The explicit "(You could ask ai yes or ask ai no.)" prompt.
- **Hint level used:** None.
- **Why the next step was unclear:** It was not unclear once the prompt was read; the issue is that the prompt supplies syntax rather than an in-world nudge.
- **Did the next attempt change?** Yes — after bare `no` failed I used the prompted `ask ai no`, which worked.
- **Evidence:** steps 12, 16, 17; `playtest-03-fatal-no-gameover.png`.
- **Route:** `content-editor`.

### 4. Beat A's "record readout" was not observed as a distinct display

- **Scope:** in focus
- **Command or click:** `ask ai about verdict` (steps 2 and 22), `examine register` (step 21).
- **Observed:** The verdict reply is one plain paragraph: "The mark says you weren't trying hard enough in computer science. I'm here to help, you know. Demonstrate mastery of the whole of Unit 1 and you can go." `examine register` gives "The register lies open, a mark beside your name. The AI reads it in the flat voice of a machine that has read it a thousand times: attention not satisfied." No fenced machine readout or separate record panel appeared after the verdict in either fresh session.
- **Why it is a problem:** If the brief's "shows its record readout" claim means a distinct formatted readout following the verdict prose, that element is absent in the running app. The record facts are still present in the room opening and `examine register`, so the player is not deprived of the information; this is a claim mismatch to be confirmed or reworded by the editor.
- **Evidence:** steps 1, 2, 21, 22; `playtest-01-arrival.png`, `playtest-05-prompt-dead-ends.png`.
- **Route:** `content-editor`.

## Incidental findings (out of scope)

None. The hub was entered only as the briefed boundary check and was not investigated further.

## Difficulty and fairness assessment

Assessed against `docs/content/difficulty-and-fairness.md`.

- **Goal, obstacle and tools:** Clear almost at once. The title screen states the mark and the orientation route; the arrival reply states the way out ("Demonstrate mastery of the whole of Unit 1 and you can go"). Available tools are asking the AI and the visible east route. Time to first meaningful insight: the first command (step 2).
- **Clue discoverability:** The three key facts — insufficient effort in computer science, why you are here, and the `/dev/null` threat — all came from ordinary wording on the first natural try (`verdict`, `why here`/`attendance`, `failure`). No guess-the-verb step was needed. The two dead-end prompt families in finding 1 are the exception.
- **`/dev/null` explanation for a 14–16 learner:** Understandable. It gives the world term and its behaviour in plain order: special file, writes gone, reads return nothing, used to silence a command that will not stop talking. Backticks mark the path visually. A learner can restate the threat and connect it to the AI's warning.
- **Reasonable commands:** Worked well. `ask ai about verdict`, `ask ai about why here`, `ask ai about failure`, `ask ai about recycling`, `ask ai yes` and `ask ai no` all resolved. `examine register` also gave useful text.
- **Hints:** No hint ladder exists in this focus, so no hint level was reached or required. The parenthetical prompts are the only nudges and, as recorded, several are dead ends.
- **Puzzle, quiz, combat and hazard:** Absent from this focus. There is no arrival puzzle, no hint ladder, no quiz, no combat and no hazard here, so no assessment is made of those categories.
- **Failure telegraph and fairness:** The threat is stated twice before the choice — in the failure topic ("I'd rather you didn't end up there") and in B2 ("I'd be politely disappointed to send you there — are you one of them?"). The fatal cost is disproportionate in size (all three lives) but is clearly signalled and immediately reversible, which fits the document's "inexpensive failure" guidance. A learner can explain why the fatal attempt failed: they answered the AI's question in the negative.
- **Retry friction:** Minimal. Both the typed `restart` and the Restart button returned to arrival with three lives at once; there was no repeated walking and no lost progress, since no progress had been made in this focus.
- **Repeated actions with no new information:** Steps 4, 5, 10, 11 and 28 — recorded as finding 1.
- **Abandonment point:** None. The focus was completed.
- **Could I explain success and failure?** Yes for the substantive beats and for the fatal reply; no for the placeholder prompts, where the game gives no reason for the empty response.

## Priority list (player point of view)

1. **High** — Make the game's own "You could ask..." prompts lead to substantive replies (finding 1). They currently waste player actions with repeated placeholder lines. → `content-editor`.
2. **Medium** — Give "the mark" a real answer so the why-here beat's stated next step works (finding 2). → `content-editor`.
3. **Medium** — Confirm or reword Beat A's "shows its record readout" claim; no fenced readout appeared (finding 4). → `content-editor`.
4. **Low** — Decide whether to accept a bare `yes`/`no` or reword the prompt so it stays in voice (finding 3). → `content-editor`.

No code findings to route to `code-lead`.

## Screenshots

All in `/home/developer/CompSciQuest/playtest-issue1-arrival-ai/`:

- `playtest-01-arrival.png` — fresh arrival room, `Lives: 3`, bold **The AI**, italic *east route*.
- `playtest-02-recycling-bin-B2.png` — B2 question and yes/no prompt.
- `playtest-03-fatal-no-gameover.png` — B2 threat, fatal reply, `Lives: 0`, "Game over — lives exhausted. Final score: 0."
- `playtest-04-east-to-hub.png` — ungated east route reaching The Network Hub.
- `playtest-05-prompt-dead-ends.png` — the verdict and failure prompts followed by placeholder replies; `/dev/null` shown as inline code.

---

## Second pass — Sat 28 Nov 2026 (current build)

- **Purpose:** content playability and effectiveness review
- **Focus:** area-entry-interface / room-arrival — issue #1 AI opening interaction (beats A, B, B2, prompts/catch-alls and the Beat C hub boundary)
- **App:** `http://localhost:5173/CompSciQuest/` (dev server started with `npm run dev`; Vite served on port 5173)
- **Reference read in full before play:** `docs/content/difficulty-and-fairness.md`. The brief's trace and gate/reachability claims were treated as expected outcomes, not as a command script. No walkthrough or content card was opened.
- **Played blind:** ordinary player wording first; alternatives tried when a command failed.
- **MCP tools used:** `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_take_screenshot`, `browser_evaluate`, `browser_find`, `browser_console_messages` (Playwright via Code Mode).
- **Note on the earlier section:** the four findings recorded on 27 Nov all appear to have been addressed in the current build. The verdict now carries a fenced machine readout, the prompts are generic "(You could ask me anything.)", and the why-here beat now gives the full east-then-south route. The verbatim evidence for the current build follows.

### Transcript (encounter order, current build)

Verbatim game text is quoted exactly. Sidebar state is noted where it changed.

1. **Click "New Game".** Landed in *The Arrival Bay*. Sidebar: `Score: 0`, `Lives: 3`, `The Machine — The Arrival`, `Rooms visited: 1 / 1`.
   > The register lies open, a mark beside your name. **The AI** reads it in the flat voice of a machine that has read it a thousand times: attention not satisfied. The classroom folds along its grid lines; the ceiling becomes a row of tiny switches. You stand among humming cable. The AI waits, assembled from the attendance record with your name at the top. It has the air of a clerk who has stamped the form.
   >
   > An *east route* glows.
   >
   > Exits: east

2. `look` → repeated the arrival description verbatim.

3. `examine register`
   > The register lies open, a mark beside your name. The AI reads it in the flat voice of a machine that has read it a thousand times: attention not satisfied.

4. `ask ai about verdict` — **Beat A reached.**
   > The mark says you weren't trying hard enough in computer science. I'm here to help, you know. Demonstrate mastery of the whole of Unit 1 and you can go.
   >
   > ```
   > ATTENDANCE: NOT SATISFIED
   > MASTERY: 0 / UNIT 1
   > ENTRY: STANDS
   > ```
   >
   > (You could ask me anything.)

   The readout is a fenced `code` block (`ATTENDANCE: NOT SATISFIED MASTERY: 0 / UNIT 1 ENTRY: STANDS`). A separate "Talking with Ai." panel shows the same generic prompt.

5. `ask ai about mastery`
   > The mark records insufficient effort in computer science. Mastery of the whole of Unit 1 is how you get out.
   >
   > (You could ask me anything.)

6. `ask ai about why here` — **Beat B (why-here) reached.**
   > The classroom folded, and here you are. If you want to delve into it, your attention in computer science is what the mark records. Ask me about failure, then take the east route to the Network Hub and go south to the Assistance Ward.
   >
   > (You could ask me anything.)

7. `ask ai about failure` — **Beat B (failure) reached.**
   > `/dev/null` is a special file. Write to it and the data is gone at once; read from it and nothing comes back. Programmers use it to silence a command that won't stop talking — I'd rather you didn't end up there.
   >
   > (You could ask me anything.)

   Snapshot confirms a `code` node for `/dev/null`; no mechanic list.

8. `ask ai about recycling bin` — **Beat B2 reached.**
   > To be honest, the thing nobody tells you is that there's no recycling bin. Self-respecting computer scientists use Linux, so there's nothing to throw away. Everything wrong ends up in `/dev/null`, and I'd be politely disappointed to send you there — are you one of them?
   >
   > (You could ask ai yes or ask ai no.)

   `/dev/null` is a `code` node. Sidebar unchanged (`Score: 0`, `Lives: 3`).

9. `ask ai about the weather` (unrelated topic while the node is sticky)
   > Say it to me as a question — yes or no. I can wait.
   >
   > (You could ask ai yes or ask ai no.)

10. `no` (bare word, ordinary player wording)
    > I don't understand that.

    No life loss; prompt still "(You could ask ai yes or ask ai no.)".

11. `ask ai yes`
    > Good. I knew you'd say that. Consider a gold star owed to you — shall we begin?
    >
    > (You could ask me anything.)

    Warm praise; the sticky node closed (prompt reverted to the general wording). Sidebar unchanged.

12. `restart` (typed) → fresh arrival, `Lives: 3`.

13. `ask ai about recycling bin` → B2 reproduced verbatim as step 8, with the yes/no prompt.

14. `ask ai no` — **fatal branch.**
    > Oh, well. The machine will quietly put you in `/dev/null`; it's very tidy about that. Start again when you're ready.
    >
    > (There is nothing further to ask here.)
    >
    > Lives: 0.
    >
    > Game over — lives exhausted. Final score: 0.

    Sidebar `Lives: 0`. No automatic title overlay: the game log, AI panel and Restart button all stayed visible (`titleVisible: false` on check).

15. `restart` (typed) → fresh arrival, `Lives: 3`.

16. **Click the "Restart" button** → another fresh arrival appended, `Lives: 3`.

17. `ask ai about recycling bin` first, out of order (no verdict or why-here asked first) → B2 reproduced verbatim, so the opening beat is not order-dependent.

18. `ask ai yes` → warm praise as step 11; node closed.

19. `ask ai about what happens to me` — **catch-all 1.**
    > The mark records insufficient effort in computer science. Mastery of the whole of Unit 1 is how you get out.
    >
    > (You could ask me anything.)

20. `ask ai about where mistakes go` — **catch-all 2.**
    > Take the east route to the Network Hub. From there, go south to the Assistance Ward.
    >
    > (You could ask me anything.)

21. `ask ai about failure` → full `/dev/null` explanation as step 7 (topic still reachable out of order).

22. `ask ai about verdict` → full verdict reply and fenced readout as step 4 (spent topic still answers normally — no dead end).

23. `ask ai about bin` — **catch-all 3, distinct mistakes reaction.**
    > A small glow has appeared beside your name. One caveat: mistakes go to `/dev/null`, and I'd rather you didn't end up there.
    >
    > (You could ask me anything.)

    Snapshot confirms `/dev/null` as a `code` node.

24. `ask ai about bin` again → catch-all 1 (mark/mastery), showing catch-alls rotate among useful replies rather than repeating one dead-end line.

25. `east` — **Beat C boundary.** Ungated move to *The Network Hub*. Sidebar `The Machine — The Network Hub`, `Lives: 3`.
    > Around you, brass sockets crowd the hub, each with a little label, all humming one low note. A yellowed card reads 'since the 1990s' in fading ink. The hub copies every packet to every port, so every route shows at once. The AI calls it 'on the record'; nobody unplugged it.
    >
    > South opens into the Assistance Ward. The east and north teaching sockets are dark until the ward's calibration mark is on record, and carry traffic once it is; their labels carry the same notice. A **port label** clings to the east socket; *east* leads to the Switchyard. A **patch-bay legend** is clipped to the frame above the sockets. A fresh paper label on the north socket reads THE RULE MACHINE; *north* leads to the rule quarters and the mill beyond them. *west* leads to arrival; *in*, to the interface.
    >
    > Exits: west, east, in, north, south

26. `ask ai about verdict` at the hub →
    > Take the east route to the Network Hub. From there, go south to the Assistance Ward.
    >
    > (You could ask me anything.)

    No verdict reply and no fenced readout.

27. `restart` → fresh arrival. **Step 28:** `east` straight to the hub **without ever asking the verdict**. **Step 29:** `ask ai about verdict` at the hub →
    > The mark records insufficient effort in computer science. Mastery of the whole of Unit 1 is how you get out.
    >
    > (You could ask me anything.)

    Still no verdict reply or readout. **Verdict confirmed arrival-only**, not merely a spent-topic effect.

28. **Step 30:** `ask ai about escape` at the hub — **hub escape topic.**
    > The south route is always open. It leads into the Assistance Ward, a safe checkpoint where the pupil may leave and re-enter without losing a life. The east and north teaching ports wait for the ward's completion mark. Take south. Let the ward write the mark.
    >
    > (You could ask which route is open.)

29. **Step 31:** `ask ai about route` at the hub (after the escape topic was spent) → catch-all "Take the east route to the Network Hub. From there, go south to the Assistance Ward."
30. **Step 32:** `ask ai about door` at the hub (after spend) → catch-all "A small glow has appeared beside your name. One caveat: mistakes go to `/dev/null`..."
31. **Step 33:** `restart`, **step 34:** `east`, **step 35:** `ask ai about route` as the **first** AI question at the hub → full escape topic ("Take south. Let the ward write the mark.").
32. **Step 36:** `restart`, **step 37:** `east`, **step 38:** `ask ai about door` as the **first** AI question at the hub → full escape topic. So `escape`, `route` and `door` all reach the hub topic in a clean run; the earlier catch-alls were spent-topic fallbacks.
33. **Step 39:** `restart`, **step 40:** `ask ai about recycling bin`, **step 41:** `bye` → **no visible reply text**; the yes/no prompt remained. **Step 42:** `east` → left for the hub, `Lives: 3`, so leaving ends the node.
34. **Step 43:** `restart`, **step 44:** `ask ai about recycling bin`, **step 45:** `bye`, **step 46:** `ask ai about verdict` → full verdict reply and readout returned, so `bye` ends the node but prints no acknowledgement.
35. **Step 47:** **Stopped here.** Did not go south or continue the game, as briefed.

### Expected claim check (current build)

| Brief claim | Observed | Status |
| --- | --- | --- |
| Boot start `room-arrival`, lives 3, AI present | Step 1: "The Arrival Bay", `Lives: 3`, bold *The AI* in room prose | Confirmed |
| A: verdict reads mark and mastery demand, sets `npc-knows ai-ethics-and-implications`, enters `node-ai-verdict` | Steps 4–5: mark and "Demonstrate mastery of the whole of Unit 1 and you can go"; fenced readout present; verdict reachable again after spend (step 22) | Confirmed at player-visible level; internal flag/node IDs not observable in browser |
| B: why-here explains mark and mastery demand and sends east to Network Hub, then south to Assistance Ward | Step 6: mark premise + "take the east route to the Network Hub and go south to the Assistance Ward" | Confirmed (mastery demand is carried by verdict/mastery and catch-all 1) |
| B: failure gives a short, accurate in-world `/dev/null` account with backticks, no mechanic list | Step 7; `code` node for `/dev/null` in snapshot | Confirmed |
| B2: no bin, in-character Linux opinion, `/dev/null` threat restated, respectable-computer-scientist question | Step 8 | Confirmed |
| B2: sticky node default keeps question open with no effect; `bye` or leaving ends it | Step 9 (default reply, prompt open); steps 42 and 46 (`bye` silent, node ended; leaving ends it) | Confirmed, with a silent `bye` noted below |
| B2: `ask ai yes` warm praise, node closes | Step 11 | Confirmed |
| B2: `ask ai no` → `change-lives: -3`, `game-over`, restart via `restart` or Restart button, no title overlay | Steps 14–16 | Confirmed |
| Bare `yes`/`no` deliberately unsupported | Step 10: "I don't understand that."; prompt prints the accepted forms | Confirmed as design fact |
| Generic "ask me anything" prompts on verdict, why-here, failure, taunt and affirmative topics; follow to useful catch-alls | Steps 4, 6, 7, 11, 19, 20, 23, 24 | Confirmed; the B2 question itself still shows the yes/no prompt, which is appropriate to the sticky node |
| Catch-alls: mark/mastery, east-then-south route, distinct mistakes reaction | Steps 19, 20 and 23 | Confirmed; no dead end on a spent topic (steps 21, 22, 24) |
| Verdict arrival-only | Steps 26 and 29 (fresh hub, verdict never asked in arrival) | Confirmed |
| C: east from arrival ungated | Step 25 | Confirmed |
| C: `escape` / `route` / `door` at hub direct south | Steps 30, 35, 38 | Confirmed |
| No quiz, puzzle, hazard or new flag in this focus | None encountered; score 0 throughout | Confirmed |

No functional defect was found in the focus. The findings below are separated by owning team.

### Content findings — route to `content-editor`

None in this pass. Every named beat, prompt, catch-all and reachability claim in the focus was confirmed in the running app, and the four issues logged on 27 Nov are resolved in the current build.

One low-priority observation, not raised as a finding: `bye` ends the sticky node but prints no acknowledgement at all (steps 41–42, 45–46). A learner who types `bye` gets no in-world sign that the conversation closed. The brief only requires that `bye` ends the node, which it does, so this is a polish suggestion rather than a defect.

### Code findings — route to `code-lead`

#### 1. The output log does not scroll to the newest reply

- **Scope:** incidental, out of scope (UI behaviour, not the AI content)
- **Command or click:** any command once the log exceeds one screen, for example `ask ai about verdict` after several turns
- **Observed:** `document.querySelector('.output-log')` reports `scrollTop: 0`, `scrollHeight: 6358`, `clientHeight: 510` immediately after a new reply is appended. The first screenshots of the verdict and failure beats were byte-identical because both showed the top of the log (up to `look`), not the new AI text. Setting `scrollTop = scrollHeight` manually revealed the latest reply.
- **Why it is a problem:** after a few turns the newest AI verdict, warnings and prompts sit below the visible area. A player must discover and use the scrollbar to read the reply they just earned. This affects the arrival AI conversation directly, though it is a UI defect rather than a content issue.
- **Evidence:** steps 4 and 7; the first captures of `playtest-02-verdict-28nov.png` and `playtest-08-failure-devnull-28nov.png` were byte-identical, both showing the stale top of the log up to `look` rather than the new reply; both were retaken with `scrollTop` set manually; `playtest-14-log-scroll-check-28nov.png` also shows the verdict after a manual scroll.
- **Route:** `code-lead`.

### Second pass — incidental findings (out of scope)

The log-scroll issue above is the only incidental finding. It was confirmed with the fewest checks needed and not investigated further. No other out-of-scope area was opened; the hub was entered only for the briefed Beat C boundary check and nothing south of it was visited.

### Second pass — difficulty and fairness assessment

Assessed against `docs/content/difficulty-and-fairness.md`.

- **Goal, obstacle and tools:** clear from the title screen ("Pass the Assistance Ward orientation and the mark can be cleared") and restated by the AI in step 4 ("Demonstrate mastery of the whole of Unit 1 and you can go"). Tools are asking the AI and the visible east route. Time to first meaningful insight: step 3–4, the first two commands.
- **Clue discoverability:** the verdict, why-here, failure and recycling-bin facts all came from ordinary wording on the first natural try (`verdict`, `why here`, `failure`, `recycling bin`). No guess-the-verb or guess-the-noun step was needed. The mark premise is available from the room prose, `look` and `examine register` (steps 1–3), so the two-clue expectation is met. The route is stated in step 6 and again by the hub escape topic in step 30.
- **Puzzle fairness:** not applicable. There is no arrival puzzle, gate or locked exit in this focus.
- **Hint usefulness and truthfulness:** there is no hint ladder in this focus, so no hint level was required. The parenthetical prompts are the only nudges. They are generic "(You could ask me anything.)" and are truthful: following them with unrelated questions reached three useful catch-alls (steps 19, 20, 23). The hub prompt "(You could ask which route is open.)" is likewise honest and its topic answers with "Take south" (step 30).
- **Combat readability:** not applicable. No quiz or combat occurs in this focus.
- **Failure telegraph and fairness:** the fatal cost is signalled twice before the choice — "I'd rather you didn't end up there" (step 7) and "I'd be politely disappointed to send you there — are you one of them?" (step 8) — followed by the explicit `(You could ask ai yes or ask ai no.)`. Losing all three lives is large, but it is a cartoonish, in-world deletion into `/dev/null` ("it's very tidy about that"), not an arbitrary punishment, and the game says "Start again when you're ready". The accepted form is surfaced naturally in the prompt; bare `no` is a design fact, not a defect. A learner can explain the failure: they answered the AI's question in the negative.
- **Retry friction:** minimal and free of soft-lock. Both typed `restart` (steps 12, 15) and the Restart button (step 16) returned to arrival with `Lives: 3` at once, with no repeated walking and no lost progress. Leaving the node with `east` (step 42) also worked with no life loss.
- **Repeated actions with no new information:** none in this pass. Re-asking a spent topic gave either the full reply (steps 21, 22) or a rotating useful catch-all (step 24), never a placeholder.
- **Abandonment point:** none. The focus was completed and stopped at the briefed boundary.
- **Could I explain success and failure?** Yes. Each successful beat restated its fact, and the fatal reply named both cause and recovery.
- **Age-appropriate challenge for a 14–16 learner:** appropriate. The `/dev/null` explanation uses plain order — special file, writes gone, reads return nothing, used to silence a chatty command — and pairs the world term with its behaviour. The Linux line in B2 reads as the AI's in-character opinion, not a course fact or quiz item; nothing in this focus asks the learner to reproduce it.

**AI character check:** intelligible and consistent. Warm on the affirmative ("Good. I knew you'd say that... shall we begin?"), with a clear hint of menace on the negative and in the `/dev/null` warnings. It stays misaligned in voice — "One caveat: I do enjoy a question with an answer attached" and "Consider a gold star owed to you" — without mocking ability. It teaches why the player is trapped (attention not satisfied; mastery of Unit 1 required) and how to leave (east to the Network Hub, then south to the Assistance Ward; "Take south. Let the ward write the mark.").

### Second pass — priority list (player point of view)

1. **Medium** — Make the output log scroll to the newest reply so the verdict, warnings and prompts are visible without manual scrolling (code finding 1). → `code-lead`.
2. **Low (polish)** — Give `bye` a short in-world acknowledgement so the player knows the conversation closed. → `content-editor`.

No blocking content issue remains in the focus.

### Screenshots (second pass)

All in `/home/developer/CompSciQuest/playtest-issue1-arrival-ai/`, named with a `28nov` suffix so the earlier run's evidence is untouched:

- `playtest-01-arrival-28nov.png` — fresh arrival room, `Lives: 3`, bold **The AI**, italic *east route*.
- `playtest-02-verdict-28nov.png` — verdict reply and fenced readout (log scrolled to bottom).
- `playtest-08-failure-devnull-28nov.png` — `/dev/null` failure reply (log scrolled to bottom).
- `playtest-09-recycling-B2-28nov.png` — B2 question and yes/no prompt.
- `playtest-10-fatal-no-gameover-28nov.png` — fatal reply, `Lives: 0`, "Game over — lives exhausted. Final score: 0.", no title overlay.
- `playtest-11-catchall-replies-28nov.png` — generic catch-all replies with `/dev/null` as inline code.
- `playtest-12-east-to-hub-28nov.png` — ungated east route; sidebar reads `The Machine — The Network Hub`, `Lives: 3`. The log pane itself still shows the stale top-of-log view (code finding 1).
- `playtest-13-hub-escape-28nov.png` — hub "Take south" route guidance and its prompt, with the log scrolled to the bottom.
- `playtest-14-log-scroll-check-28nov.png` — viewport with the log scrolled to show the verdict reply and fenced readout.
