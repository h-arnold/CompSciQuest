# Purpose: content playability and effectiveness review

Focus: area-entry-interface / room-arrival — issue #1 AI opening interaction (beats A, B, B2, the catch-all prompts and the Beat C hub boundary), against the regenerated build committed as `1bd06b9`.

**Playtest report — issue #1 arrival AI (final focused W7 pass)**

- Date: 28 November 2026.
- App URL: `http://localhost:5173/CompSciQuest/`.
- Build checked: `1bd06b9` — `fix: scroll transcript to newest output; regenerate arrival-AI catalogues`.
- Difficulty reference read in full before play: `docs/content/difficulty-and-fairness.md`, sections 1–5 applied below.
- Blind-play note: I started a New Game and typed ordinary player wording from the room text and the title screen. I did not open the walkthrough or any content card, and I did not follow the trace as a command script. I stopped at the Network Hub boundary as instructed.
- MCP tools used: `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_evaluate`, `browser_take_screenshot`, `browser_console_messages`. Connection troubleshooting used `browser_tabs`, `browser_close` and `browser_run_code_unsafe`.
- Screenshots: `playtest-issue1-arrival-ai-final/` — `verdict-28nov.png`, `why-here-28nov.png`, `failure-28nov.png`, `recycling-bin-28nov.png`, `fatal-no-28nov.png`, `autoscroll-28nov.png`, `hub-boundary-28nov.png`.
- Console: 0 errors and 0 warnings over the session.

## Play sequence and verbatim transcript

**Step 1 — New Game.** Room heading `The Arrival Bay`:

> The register lies open, a mark beside your name. **_The AI_** reads it in the flat voice of a machine that has read it a thousand times: attention not satisfied. The classroom folds along its grid lines; the ceiling becomes a row of tiny switches. You stand among humming cable. The AI waits, assembled from the attendance record with your name at the top. It has the air of a clerk who has stamped the form.
>
> An _east route_ glows.
>
> Exits: east

Sidebar: `Score: 0`, `Lives: 3`, `The Machine — The Arrival`, `Score: 0 / 0`, `Rooms visited: 1 / 1`.

**Step 2 — `ask ai about mark`.** My first natural question, taken from "a mark beside your name":

> You've been pulled into the machine's world, and you'll stay here until you've shown me you understand every topic in Unit 1. I've noticed you haven't tried hard enough in computer science, and your teacher wants full marks for you — that's why I'm here. Ask me about failure if you want to delve into that, then take the east route to the Network Hub and go south to the Assistance Ward.
>
> (You could ask me anything.)

Sidebar gained the conversation block `Talking with Ai.` and `(You could ask me anything.)`. No score or life change.

**Step 3 — `ask ai about verdict` (Beat A).**

> I can see you haven't been paying attention in computer science, and your teacher asked me to help you get the perfect score. I'm here to help, you know. Demonstrate mastery of the whole of Unit 1 and you can go.

Fenced machine readout, rendered as a code block:

> ATTENDANCE: NOT SATISFIED MASTERY: 0 / UNIT 1 ENTRY: STANDS

Then `(You could ask me anything.)`. Sidebar stayed `Talking with Ai.` / `(You could ask me anything.)`, `Lives: 3`, `Score: 0`. This is the first meaningful insight: the machine's own view of the problem and the mastery demand.

**Auto-scroll check, immediately after step 3.** I read the DOM rather than trusting the screenshot:

```
document.querySelector('.output-log')
scrollTop = 172, scrollHeight = 682, clientHeight = 510, atBottom = true
```

`682 - 510 = 172`, so the log was pinned to the newest reply. Evidence: `autoscroll-28nov.png` and `verdict-28nov.png`.

**Step 4 — `ask ai about why here` (Beat B).**

> Computer science hasn't had your full attention, and helping you get top marks is what your teacher told me to do. Mastery of the whole of Unit 1 is how you get out.

**Step 5 — `ask ai about attendance`**, the alternate documented keyword:

> Take the east route to the Network Hub. From there, go south to the Assistance Ward.

**Step 6 — `ask ai about why am I here`**, another phrasing a pupil might try:

> A small glow has appeared beside your name. One caveat: mistakes go to `/dev/null`, and I'd rather you didn't end up there.

**Step 7 — `ask ai about why here` repeated.** Identical reply to step 4, so these are stable distinct replies rather than a one-off variant.

**Step 8 — `ask ai about failure` (Beat B).**

> `/dev/null` is a special file. Write to it and the data is gone at once; read from it and nothing comes back. Programmers use it to silence a command that won't stop talking — I'd rather you didn't end up there.
>
> (You could ask me anything.)

`/dev/null` was inside a `<code>` element, rendered as inline backticks. The sidebar conversation block was absent after this reply; `Lives: 3` unchanged.

**Step 9 — `ask ai about recycling bin` (Beat B2).**

> To be honest, the thing nobody tells you is that there's no recycling bin. Self-respecting computer scientists use Linux, so there's nothing to throw away. Everything wrong ends up in `/dev/null`, and I'd be politely disappointed to send you there — are you one of them?
>
> (You could ask ai yes or ask ai no.)

Sidebar: `Talking with Ai.` / `(You could ask ai yes or ask ai no.)`. `Lives: 3`, `Score: 0`.

**Step 10 — `inventory`.** `You are carrying nothing.` — the topic added no item. `Lives: 3`.

**Step 11 — `ask ai about something` inside the node.**

> Say it to me as a question — yes or no. I can wait.
>
> (You could ask ai yes or ask ai no.)

Default kept the question open with no effect; `Lives: 3`.

**Step 12 — bare `no`.** `I don't understand that.` The node stayed open, prompt unchanged, `Lives: 3`. Bare `no` did not end the game.

**Step 13 — `ask ai yes`.**

> Good. I knew you'd say that. Consider a gold star owed to you — shall we begin?
>
> (You could ask me anything.)

Warm praise; node exited and generic prompt returned; `Lives: 3`.

**Steps 14–16 — repeat probes.** `ask ai about recycling bin` now returned only `Take the east route to the Network Hub. From there, go south to the Assistance Ward.` with the generic prompt, so the node did not reopen. `ask ai about recycling` returned the step 6 glow/`dev/null` line; `ask ai about waste bin` returned the step 4 short reply. All kept `Lives: 3`.

**Step 17 — `restart`.** Fresh `The Arrival Bay` room description, sidebar `Score: 0`, `Lives: 3`, `Rooms visited: 1 / 1`. The earlier transcript remained visible, as expected for a running log.

**Step 18 — `ask ai about recycling bin` on the fresh game.** The full no-bin question and `(You could ask ai yes or ask ai no.)` prompt returned; `Lives: 3`.

**Step 19 — `ask ai no` (fatal branch).**

> Oh, well. The machine will quietly put you in `/dev/null`; it's very tidy about that. Start again when you're ready.
>
> (There is nothing further to ask here.)
>
> Lives: 0.
>
> Game over — lives exhausted. Final score: 0.

Sidebar `Lives: 0`. The game-over line arrived with the reply, with no extra command. `/dev/null` was backticked. Evidence: `fatal-no-28nov.png`.

**Step 20 — `restart` after game over.** Fresh arrival room again. A same-tick DOM read still reported `Lives: 0`; the following render and the step 21 snapshot showed `Lives: 3`, so the reset succeeded.

**Step 21 — `east` (Beat C boundary only).** Heading `The Network Hub` appeared with no gate message and no blocked exit. Sidebar: `The Machine — The Network Hub`, `Lives: 3`. I did not issue any further command in the hub. Evidence: `hub-boundary-28nov.png`.

## Expected-outcome check

| Claim | Observed | Verdict |
| --- | --- | --- |
| Boot at `room-arrival`, 3 lives | Steps 1 and 17 | Confirmed |
| A: mark, folding classroom, east route in room text | Step 1 | Confirmed |
| A: own observation of inattention, teacher direction, Unit 1 mastery route out | Step 3 | Confirmed |
| A: no mark-as-speaker framing | Step 3 prose | Confirmed |
| A: fenced machine readout | Step 3 code block | Confirmed |
| A: generic, informative, always-reachable catch-all; no order chain | Steps 2, 3, 8 and 9 in mixed order | Confirmed with finding 2 |
| B: why-here states being pulled in, stays until every Unit 1 topic, premise, teacher, east then south | Steps 4–7 | **Mismatch — finding 1** |
| B: no "the classroom folded" phrasing in AI replies | Steps 4–7 | Confirmed |
| B: accurate short `/dev/null` account, no mechanic list | Step 8 | Confirmed |
| B: every `/dev/null` in inline code | Steps 6, 8, 9 and 19 | Confirmed |
| B2: no-bin opinion, Linux, threat, respectability question, sticky node | Step 9 | Confirmed |
| B2: no item or alias added | Step 10 | Confirmed |
| B2: `ask ai yes` warm praise and exit | Step 13 | Confirmed |
| B2: `ask ai no` sole fatal answer, lives 3→0, status lost, immediate game over | Step 19 | Confirmed |
| B2: bare `yes`/`no` unsupported; `no` alone not fatal | Steps 12 and 13 | Confirmed |
| B2: node default holds question with no effect; `bye`/leaving ends node | Step 11; node exited in step 13 | Confirmed (leaving tested via `yes`) |
| B2: `restart` gives a fresh game | Steps 17 and 20 | Confirmed |
| B2: catch-all is global and keeps the AI in voice | Steps 8, 9, 14–16 | Confirmed |
| C: ungated east exit to `room-network-hub`; AI pointed to hub and ward | Steps 2, 5, 21 | Confirmed |
| Voice warm, friendly, gently flattering, hint of menace, misaligned, no ability mockery | Steps 2, 3, 9, 13, 19 | Confirmed |
| Teacher-direction sentence varies across verdict and why-here | Steps 3 and 4 | Confirmed |
| No repeated catchphrase | Across all replies | Confirmed, with minor note below |
| Auto-scroll shows newest reply | Direct DOM read after step 3 | Confirmed |

## Findings

### 1. Why-here answer is split across unrelated questions

- Scope: in focus.
- Command or click: `ask ai about why here`; alternatives `ask ai about attendance` and `ask ai about why am I here`.
- Observed:
  - `> ask ai about why here` → "Computer science hasn't had your full attention, and helping you get top marks is what your teacher told me to do. Mastery of the whole of Unit 1 is how you get out." (identical on repeat)
  - `> ask ai about attendance` → "Take the east route to the Network Hub. From there, go south to the Assistance Ward."
  - `> ask ai about why am I here` → "A small glow has appeared beside your name. One caveat: mistakes go to `/dev/null`, and I'd rather you didn't end up there."
  - The full expected statement appeared only as the fallback reply to my unrecognised first question `ask ai about mark`: "You've been pulled into the machine's world, and you'll stay here until you've shown me you understand every topic in Unit 1. ... then take the east route to the Network Hub and go south to the Assistance Ward."
- Why it is a problem: the obvious question does not plainly explain the situation or tell the player where to go. Under `difficulty-and-fairness.md` §§2.2, 2.3 and 3, the goal, obstacle and first action must be visible without guess-the-noun work. A pupil who asks "why here" learns only that they must master Unit 1; the east-then-south route arrives only if they separately think to ask about "attendance", and the "pulled into the machine's world" premise only if they ask an unlisted word such as "mark". Both N6 clues are therefore placed behind keywords the player is not directed to use.
- Player's goal: understand why they are trapped and know the first place to go.
- Information available: the room offers a mark, an east route and a waiting AI; the AI's catch-all mentions failure but the why-here reply does not mention any route.
- Hint level used: none. No hint ladder fired during the focused slice, including after I repeated `why here`.
- Why the next step was unclear: the step 4 reply names mastery but gives no direction; the room names only "east", while the AI earlier directed me east _then south_.
- Whether the next attempt changed: yes. I tried `attendance`, `why am I here` and a repeat, and each produced a different fragment, so I only assembled the full picture by chance from my first fallback question.
- Evidence: steps 2, 4–7; `why-here-28nov.png`.

### 2. The verdict's displayed prompt carries no route or premise

- Scope: in focus.
- Command or click: `ask ai about verdict`.
- Observed: after the fenced readout, the only prompt printed and repeated in the sidebar was `(You could ask me anything.)`. The attention premise, mastery demand, east/south routes and `/dev/null` destination appeared only when I asked an unmatched topic (`ask ai about mark`) before the verdict.
- Why it is a problem: the brief expects the catch-all to restate the premise, mastery demand, both routes and where mistakes go. A player who asks for the verdict first sees none of that at the moment the verdict lands, and the printed prompt gives no clue that a free question will produce them. This is a clue-placement issue under §§2.3 and 3 of the difficulty reference. It may be a reading of the expected wording rather than a strict defect, so I record it for the content owner to judge.
- Player's goal: know what to do next after being told mastery is the way out.
- Information available: the room shows an east route; the verdict readout mentions mastery 0 but no destination.
- Hint level used: none.
- Why the next step was unclear: the verdict says "you can go" without saying which way.
- Whether the next attempt changed: yes — my follow-up question produced the route guidance.
- Evidence: steps 2 and 3; `verdict-28nov.png`.

## Difficulty and fairness assessment

- **Goal, obstacle and tools.** The arrival room and the verdict make the goal (Unit 1 mastery) and the obstacle (attention not satisfied) clear. The tools are the AI's topics and the east route. Finding 1 weakens the "where next" answer.
- **Clue discoverability.** Six of the seven expected beats were reachable with ordinary wording. The exception is the why-here composite answer: its two key sentences live behind other keywords. No guess-the-verb problem appeared; `ask ai about ...`, plain `east`, `inventory` and `restart` all worked as a first-time player would expect.
- **Reasonable commands.** All natural phrasings were accepted and produced in-voice replies. The single bare `no` got a friendly `I don't understand that.` rather than a parser error, and the correct form was obvious from the displayed prompt.
- **Hints.** I needed no hint and none fired; the always-available catch-all acted as the in-world nudge. Repeating `why here` produced no new information and no escalation, which is acceptable over two attempts but would become friction if a player kept repeating.
- **Failure readability.** The fatal answer names the cause (refusing the respectability question), the consequence (`Lives: 0`, game over) and the recovery ("Start again when you're ready"), satisfying §2.7's explanation rule. The fairness concern is that the question "are you one of them?" does not make clear that `no` is the fatal answer; the `/dev/null` threat is stated just before it, so the danger is telegraphed but its trigger is ambiguous. The authored effect is exactly the expected `change-lives: -3`, so this is an observation for the content owner rather than a mismatch.
- **Failure friction.** Losing all three lives from one conversational answer is sharp, but `restart` restores a fresh game immediately, there is no long walk to repeat, and no progress beyond the arrival room was at stake in this slice.
- **Age-appropriate challenge.** Prose is short, technical terms (`/dev/null`, mastery) are explained on first use, and nothing depends on obscure prior knowledge. The Linux joke is mild and in character. Suitable for the intended GCSE audience.
- **Voice.** Warm, friendly and gently flattering ("I'm here to help, you know", "Consider a gold star owed to you"), with menace kept in the `/dev/null` threats, and clearly misaligned in treating mastery as containment. It never mocks ability. The teacher-direction sentence varies across the fallback, verdict and why-here replies, so no catchphrase formed. The line "I'd rather you didn't end up there" appears in the step 6 and step 8 replies; a minor repetition, not yet a catchphrase.

## Routing

- To **content-editor**: finding 1 (why-here reachability and clue placement), finding 2 (verdict prompt restatement), the fatal-answer trigger ambiguity and the minor repeated `/dev/null` line.
- To **code-lead**: no functional defects in this slice. Auto-scroll is fixed (`scrollTop` at bottom after a fresh reply), the command textbox stays focused after every command, and the console is clean. The one-tick `Lives: 0` read immediately after restart resolved on the next render and is recorded only as an observation.

## Incidental findings (out of scope)

None. I stopped at the Network Hub boundary and did not examine the hub, ward or Switchyard content.

## Priority list from the player's point of view

1. **High (content-editor)** — put the full "pulled into the machine's world / stays until every Unit 1 topic / east then south" answer behind `ask ai about why here` itself, so the first obvious question is sufficient.
2. **Medium (content-editor)** — make the verdict or its printed prompt restate the two routes and the `/dev/null` destination, so a player who asks for the verdict first is not left without a next move.
3. **Low (content-editor)** — make it clearer in the respectability question that `no` is the fatal answer, and vary the repeated "I'd rather you didn't end up there" line.
4. **No action (code-lead)** — auto-scroll, input focus, restart and console health all behaved as expected in this focus.
