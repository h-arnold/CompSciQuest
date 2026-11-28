# Purpose: content playability and effectiveness review

Focus: area-entry-interface / room-arrival — the issue #1 AI `ask ai no` fatal beat after its joke rewrite, plus both output-log scroll behaviours, against the regenerated build committed as `6031691a1ca5588db05948fe9c5f515a60cb7c28`.

- Date: 28 November 2026
- App URL: `http://localhost:5173/CompSciQuest/`
- Server state: already listening (HTTP 200) with the `/CompSciQuest/` base path, so no new dev server was started.
- Build: `6031691a1ca5588db05948fe9c5f515a60cb7c28` (confirmed as `git rev-parse HEAD` before play)
- Difficulty reference: `docs/content/difficulty-and-fairness.md` read in full before play, with §2.7 "Make failure informative and inexpensive" applied to the fatal beat.
- Blind-play note: the accepted trace was treated as expected outcomes only. I started a New Game and used ordinary player wording (`look`, `examine ai`, `ask ai about recycling bin`, `inventory`, `no`, `ask ai no`, `look`, `east`). I did not open the walkthrough or any content card. The one alternative after a failed command was to switch from bare `no` to the prompted `ask ai no` form.
- MCP tools used: `browser_navigate`, `browser_resize`, `browser_snapshot`, `browser_type`, `browser_click`, `browser_evaluate`, `browser_take_screenshot`, `browser_console_messages`. All interaction was through the connected Playwright MCP server.
- Screenshots: `playtest-issue1-arrival-ai-final2/` — `bin-question-28nov.png`, `fatal-no-joke-28nov.png`, `fresh-restart-28nov.png`, `autoscroll-newest-28nov.png`, `resize-repin-28nov.png`, `scrollback-preserved-28nov.png`.

## Verification record — expected outcomes

Commands and game text are quoted verbatim. Steps are in encounter order.

### Step 1 — New Game, boot state

Click: `New Game`.

Observed sidebar: `Score: 0`, `Lives: 3`, `The Machine — The Arrival`, `Score: 0 / 0`, `Rooms visited: 1 / 1`. The room heading is `The Arrival Bay`; exits line is `Exits: east`; the first mention of the AI renders as bold italic (_**The AI**_). No gate is stated on the east route.

Result: boot at `room-arrival` with 3 lives. Confirmed.

### Step 2 — `look`

Command: `look`

Observed: the room description repeats with `The Arrival Bay`, `An east route glows.` (italic) and `Exits: east`. Lives remain 3. No new item or score.

Result: normal room redraw. Confirmed.

### Step 3 — `examine ai`

Command: `examine ai`

Observed verbatim: `ai`

Result: a weak fallback reply, recorded as an incidental observation below. It did not advance or harm the player.

### Step 4 — reach the recycling-bin question

Command: `ask ai about recycling bin`

Observed verbatim:

```text
To be honest, the thing nobody tells you is that there's no recycling bin. Self-respecting computer scientists use Linux, so there's nothing to throw away. Everything wrong ends up in /dev/null, and I'd be politely disappointed to send you there — are you one of them?
(You could ask ai yes or ask ai no.)
```

The `/dev/null` mention here is an inline code element in the DOM (`<code>/dev/null</code>`), visually boxed in `bin-question-28nov.png`; the fatal reply passes the same check in Step 7. The question states the no-bin premise, the Linux opinion and the `/dev/null` consequence. It names both answer forms as options but does not mark `no` as fatal and carries no label saying this is a joke.

Result: the keyword topic is reachable with ordinary wording. Confirmed.

### Step 5 — `inventory`

Command: `inventory`

Observed verbatim: `You are carrying nothing.`

Result: no item was added by the topic; inventory unchanged. Confirmed.

### Step 6 — bare `no`

Command: `no`

Observed verbatim: `I don't understand that.`

Observed sidebar: `Lives: 3`. Score 0.

Result: bare `no` is unsupported and is not fatal. Confirmed.

### Step 7 — fatal answer `ask ai no`

Command: `ask ai no`

Observed verbatim, in order:

```text
Oh, lovely. Into /dev/null you go. You're part of the empty void now — nothing written, nothing read, and nobody will ever see or hear from you again. Start again when you're ready.
(There is nothing further to ask here.)
Lives: 0.
Game over — lives exhausted. Final score: 0.
```

`/dev/null` in the fatal reply is an inline code element. The reply matches the expected rewrite word for word. The reply itself ends at "Start again when you're ready."; the card authors no game-over text. The two engine lines follow without any extra command. The `(There is nothing further to ask here.)` line is the conversation status line that also appears in the panel below the log, not authored game-over prose.

Observed sidebar change: `Lives: 3` became `Lives: 0`; `Score: 0`, `The Machine — The Arrival` and `Rooms visited: 1 / 1` are unchanged.

Evidence: `fatal-no-joke-28nov.png`.

Result: `ask ai no` is the fatal answer, takes lives 3 to 0 and emits `game-over` immediately. Confirmed.

### Step 8 — auto-scroll to newest after the fatal reply

`browser_evaluate` on `.output-log` immediately after the fatal output:

```text
scrollTop: 508, scrollHeight: 1018, clientHeight: 510, distance: 0
```

where `distance = scrollHeight - clientHeight - scrollTop`. Distance 0 means the log is pinned to the newest line. Confirmed.

### Step 9 — restart

Click: `Restart` (sidebar button).

Observed: `Lives: 3` restored, `Score: 0`, a fresh `The Arrival Bay` room description appended to the log, `Exits: east` and `An east route glows.` present. The earlier game-over text remains visible above the new arrival, as expected for a log.

DOM check after restart output:

```text
scrollTop: 733, scrollHeight: 1243, clientHeight: 510, distance: 0
```

Evidence: `fresh-restart-28nov.png`, `autoscroll-newest-28nov.png`.

Result: the existing restart control begins a fresh game and the log re-pins to the newest line. Confirmed.

### Step 10 — resize re-pin

Starting state at 1280×900: `distance: 0` (Step 9). Resize to 390×844, then `browser_evaluate` on `.output-log`:

```text
scrollTop: 1405, scrollHeight: 1915, clientHeight: 510, distance: 0
```

Evidence: `resize-repin-28nov.png` (390×844; newest arrival text visible at the foot of the log).

Result: a log pinned at the bottom re-pins to the newest line after resize. Confirmed.

### Step 11 — scroll-back preservation across resize

At 390×844 I deliberately scrolled the log up by setting `scrollTop = 300` via `browser_evaluate`:

```text
scrollTop: 300, scrollHeight: 1915, clientHeight: 510, distance: 1105
```

Resized back to 1280×900 and re-read the same element:

```text
scrollTop: 300, scrollHeight: 1243, clientHeight: 510, distance: 433
```

`scrollTop` is unchanged at 300 and `distance` remains positive. The deliberate scroll-back was preserved rather than forcibly re-pinned; the smaller distance follows from the shorter content at the wider viewport.

Evidence: `scrollback-preserved-28nov.png` (older log lines visible; the newest lines are off-screen).

Result: scroll-back is preserved across resize. Confirmed.

### Step 12 — fresh output after scroll-back

Command: `look` (submitted while the log was still scrolled back).

DOM check:

```text
scrollTop: 962, scrollHeight: 1472, clientHeight: 510, distance: 0
```

Result: new output re-pins the log to the newest line even after a deliberate scroll-back. Confirmed.

### Step 13 — ungated east exit (minimal check only)

Command: `east`

Observed: the game moved immediately to `The Network Hub` with `Exits: west, east, in, north, south` and no gate message. I stopped there and did not explore the hub, the ward or the Switchyard.

Result: the east exit from arrival is ungated, so the fatal exchange is avoidable. Confirmed.

### Console

`browser_console_messages` at warning level, all messages: `Total messages: 2 (Errors: 0, Warnings: 0)`. No console errors or warnings were seen in the focus.

## Issues

No in-focus defects were found. Every expected outcome in the focus was confirmed: the verbatim joke rewrite, the effects and engine lines, the inline-code `/dev/null` formatting, the unsupported bare `no`, the fresh restart, and both scroll behaviours including scroll-back preservation.

One cosmetic observation, recorded without treating it as a defect: while the recycling-bin conversation is active, the prompt `(You could ask ai yes or ask ai no.)` is visible twice — once as a paragraph in the log and once in the separate conversation-status panel headed `Talking with Ai.`. After the fatal answer the same duplication occurs for `(There is nothing further to ask here.)`. It is redundant on screen but does not obscure either answer form or the game-over lines.

## Incidental findings (out of scope)

### 1. Weak reply to `examine ai`

- Scope: incidental, out of scope
- Command or click: `examine ai`
- Observed: `ai`
- Why it is a problem: the AI is the salient NPC in the room and this reply gives the player nothing to act on. This is a parser or content-quality matter outside the fatal beat and scroll focus; recorded once and not pursued.
- Evidence: Step 3; `bin-question-28nov.png` shows the surrounding exchange.

### 2. Room counter after leaving arrival

- Scope: incidental, out of scope
- Command or click: `east` (Step 13)
- Observed: sidebar still reads `Rooms visited: 1 / 1` after the heading changed to `The Network Hub`.
- Why it is a problem: the counter may not reflect the new room, but the counter may be intentionally scoped to a different progress measure; this was not confirmed and was not investigated further, in line with the focus limit. Route to `code-lead` only if the owner confirms it is wrong.
- Evidence: Step 13 snapshot; no screenshot was taken beyond the permitted single exit check.

## Difficulty and fairness assessment

Applied against `docs/content/difficulty-and-fairness.md` §2.7 and the baseline-path expectations in §3.

- **Goal, obstacle and tools:** the opening says the attention mark can be cleared by passing the Assistance Ward orientation. The AI question supplies its own obstacle and its own two offered answers. I could state the goal and the available tools without external notes.
- **Joke framing:** the rewrite reads as a cartoon prank rather than a threat or a fault. "Oh, lovely" and the absurd escalation to "the empty void" and "nobody will ever see or hear from you again" are in the AI's overstated in-world voice, and "Start again when you're ready" points to recovery inside the reply itself. The sequence costs the player nothing that is hard to replace: score 0, no items, one room visited, and one click back to a fresh start. Nothing in the question is labelled as a joke, so the reader discovers the tone through the overstatement and the immediate game-over; that is the intended design.
- **Failure readability:** the consequence is explicit twice — `Lives: 0.` and `Game over — lives exhausted. Final score: 0.` — with the sidebar switching to `Lives: 0`. After the loss I could explain what happened and why: answering `no` to the AI's Linux joke spent all three lives. §2.7 asks that failure identify cause, consequence and a next hypothesis; the cause and consequence are clear, and "Start again when you're ready" plus the Restart button supply the next action.
- **Recovery and repeated progress:** recovery is immediate and there is no repeated traversal. The restart control restored three lives and a fresh arrival in one click. No hint was used and none was needed.
- **Failed attempts and changed behaviour:** `examine ai` gave no usable information; bare `no` was refused without penalty. I changed the next attempt to the prompted `ask ai no` form, so I could explain why it worked: the on-screen prompt named the supported form. There was no guess-the-verb trap that cost progress.
- **Time to first meaningful insight:** under a minute from New Game to the fatal answer, across six commands. The question itself carried the insight.
- **Abandonment point:** none.
- **Avoidability:** the east exit is ungated, so a player can decline the exchange and continue. This keeps the prank from feeling like a forced trap.
- **Audience fit:** the `/dev/null` joke is legible even to a learner who has not met it before, because "nothing written, nothing read" supplies the meaning. The Linux line is a light piece of subject humour rather than an obscure gate. Appropriate for the intended GCSE audience.

## Routing

- Content findings (prose, flags, effect, reachability): to `content-editor`. On this pass there is no content change to request; the joke rewrite and the fatal effect matched the expected outcome exactly.
- Code findings (including any scroll defect): to `code-lead`. Both scroll behaviours passed, so no scroll defect is raised. The duplicate prompt line and the incidental observations above are for the owners to weigh.

## Priority list from the player's point of view

1. No blocking or high-priority items in the focus.
2. Optional: consider whether the duplicated conversation prompt on screen is worth removing (`code-lead`).
3. Optional: confirm whether `Rooms visited: 1 / 1` should change after leaving arrival (`code-lead`).
4. Optional: improve the `examine ai` fallback reply (`content-editor` / `code-lead`), outside this focus.
