# W7 playtest — Assistance Ward (2026-11-27)

**Purpose:** content playability and effectiveness review. **Scope:** Assistance Ward only — arrival → hub → Intake → Demonstration → Records → orientation quiz → dial → final ward puzzle → gate opening. The later Switchyard and Pattern Mill were used only to confirm the ward gate hand-off; see the short appendix at the end.

**App:** `http://localhost:5173/CompSciQuest/`, started with `npm run dev` in this worktree. Played from New Game with ordinary commands in Playwright MCP. No crafted saves, source files, tests or walkthrough were used. `docs/content/difficulty-and-fairness.md` was read before play.

**Evidence convention:** step numbers are encounter order in this session; screenshot paths are relative to `.opencode/scratchpad/slices/w7-assistance-ward/screenshots/`.

---

## 1. Expected ward path — claim-by-claim outcome

| Brief claim | Observed result |
| --- | --- |
| Boot in `room-arrival`; read the classroom mark; meet the AI; ask about verdict and scoped arrival topics; no score or life change | **Confirmed.** Room shown as “The Arrival Bay”; score 0, lives 3 throughout. `ask ai about verdict`, `ask ai about attendance mark`, `ask ai about what failure means`, `ask ai about programming` all produced distinct teaching text. |
| East to hub; east and north teaching sockets dark; south open; AI route topic names the ward checkpoint | **Confirmed.** Hub prose: “The east and north teaching sockets stay dark until the ward's calibration mark is entered.” `east` and `north` both returned “That way is blocked: flag-set.” `ask ai about route out`: “The south route is always open. It leads into the Assistance Ward, a safe checkpoint where the pupil may leave and re-enter without losing a life.” |
| Intake: `look`, `examine`, `take`, `drop`, `inventory`, `score`, `help`; tally token optional; observation card fixed with chipped corner; Nia recovery | **Confirmed.** `examine observation card`: “You follow the observation card's border to one chipped corner.” `ask nia about observation card` produced her recovery text; score 0, lives 3. |
| Demonstration: instruction card and practice crank; `unlock practice key with practice cabinet`, OPEN/CLOSE and PUT block; Mateo and Kofi topics | **Confirmed with wording friction** (findings 3–6). Exact item-first unlock string worked once the key was carried; `open practice cabinet`, `put practice block in practice cabinet`, `close practice cabinet` all worked. Both pupil recoveries fired. |
| Records: audit card, recovery board, calibration dial; Priya choice then reason; `talk-to` or retired choice grants no recovery | **Confirmed with wording friction** (finding 7). `ask priya checked` chose CHECKED; `tell priya about the clue` recovered the reason. `ask priya assumed` after the choice and `talk-to priya` granted nothing. |
| AI teaches talk/ask/tell/bye, answer forms, hints, failure/lives, save controls | **Partly confirmed.** The information is reachable but several of those exact question words returned unrelated topics (finding 8). |
| Bare `hint` in all three ward rooms; explicit three-level ladder, two-turn cooldown, no score penalty, no automatic offer | **Confirmed.** Intake, Demonstration and Records each produced ladder text; cooldown returned “Think about it for a moment.”; score unchanged. Quality concerns in findings 9–10. |
| Orientation quiz: 4 questions, 3-of-4 pass, no timer, unlimited retries; fail costs 0 lives and no movement | **Confirmed.** A deliberate 2/4 fail returned “Lives: 3.”, “The record stays open, and the pupil is not moved.”, and stayed in Records. Retry passed 3/4 (one deliberate wrong answer, then three correct). |
| Early `use assistance dial` before five prerequisites: blocked message, no state change | **Confirmed verbatim in a separate New Game tab with all four recoveries but no quiz pass.** Exact text matched the brief. Hub east remained `flag-set` afterwards, so `tutorial-complete` was still unset. |
| After quiz pass, dial success text; `use practice bell` reuses its description with no state change | **Dial confirmed verbatim.** Bell text confirmed verbatim in Demonstration; in Records the same command returned “I don't understand that.” (finding 12). |
| Puzzle solves; `tutorial-complete`; teaching ports brighten; `tutorial-mechanics` completes; ward finishes at zero score with no life loss | **Confirmed.** On dial success: “The teaching-zone ports brighten. Your mandatory Assistance Ward orientation checkpoint is complete.” Side panel stayed at score 0, lives 3. |
| Hub east/north and older interface east open; interface `out` stays open | **Confirmed.** Hub `east` reached “The Switch Floor”; hub `north` reached “The Rule Machine Concourse”; from “The Interface”, `east` opened and `out` returned to the hub. |
| Locality negative check: remote pupil input gives an in-character absence response, not silence; local exact topics still work | **Confirmed.** In the hub, `ask nia about card`: “You cannot see that here.” Back in Intake, `ask nia about the card` again produced Nia's observant reply. |

**Ward verdict:** every named ward behaviour was reached and worked. The blockers are how the player is told to reach them, not whether they exist.

---

## 2. Functional defects

### 1. Internal flag token shown at the teaching-port gates
- Command or click: `east` (and `north`) in the Network Hub before the ward puzzle; also hall exits later.
- Observed: `> east` / “That way is blocked: flag-set.”
- Why it is a problem: the player sees a developer flag name instead of a reason. A GCSE pupil cannot tell what is missing from the game world, which turns a fair gate into a parser-looking error.
- Evidence: steps 4–5, screenshots `playtest-assistance-ward-2-hub-east-gated.png` and `playtest-assistance-ward-3-hub-north-gated.png`.
- Route: `code-lead` (player-visible gate feedback).

### 2. `talk to <npc>` rejected although the command list advertises `talk-to`
- Command or click: `talk to nia`, `talk to ai`.
- Observed: both returned “I don't understand that.” `talk-to ai` worked but gave the generic “Noted. The entry stands...” reply.
- Why it is a problem: the natural spacing of the advertised command fails; a first-time pupil is likely to type exactly this.
- Evidence: steps 15 and 7.
- Route: `code-lead` (parser/alias form).

### 3. `unlock` only works in one undocumented word order, with a misleading error for the other
- Command or click: with the practice key carried, `unlock practice cabinet with practice key`; then `unlock practice key with practice cabinet`; then `unlock practice key practice cabinet`.
- Observed: “You are not carrying that.” for the first, “You unlock it.” for the second, “I don't understand that.” for the third. Inventory at the time: “You are carrying tally token, practice key.”
- Why it is a problem: `help` documents `unlock <item> <target>`, which is the form that fails, and the failure message claims the key is missing when it is in the pocket. The successful “with” form appears nowhere in the command list or room text.
- Evidence: steps 19–24, screenshot `playtest-assistance-ward-5-unlock-cabinet-blocked.png`.
- Route: `code-lead` (parser form and error text).

### 4. The instruction card teaches `PLACE`, which the parser rejects
- Command or click: `place practice block in practice cabinet`, after `open practice cabinet`.
- Observed: `> place practice block in practice cabinet` / “I don't understand that.” `put practice block in practice cabinet` then returned “You put it down.”
- Why it is a problem: the underlined word on the card and Mateo's dialogue both say PLACE; the required word PUT is only chalked by the AI. Following the written instruction fails.
- Evidence: steps 23–26, screenshot `playtest-assistance-ward-7-block-placed-in-cabinet.png`.
- Route: `code-lead` (alias), with a content note for `content-editor` (card wording).

### 5. Priya's reason step needs one particular phrasing without saying which
- Command or click: after `ask priya checked`, `tell priya about checked`, `tell priya checked`, `tell priya about the clue`.
- Observed: first two replay the instructions (“Ask me about the audit card to enter or resume...”), the third returned “Priya listens, then writes your reason beside her choice.” `tell priya about the audit card` afterwards returned “Priya keeps one finger beside her chosen word.”
- Why it is a problem: the live prompt says “tell me what I checked and what it showed”, so a pupil naturally supplies the checked word or the card, both of which are refused. Only “about the clue” works.
- Evidence: steps 37–41.
- Route: `content-editor` (topic wording / follow-up prompt) and `code-lead` if aliases are to be widened.

### 6. Asking the AI about quiz answers starts the quiz without warning and can reset it
- Command or click: in Records after four recoveries, `ask ai about quiz answers`, then later `ask ai about orientation audit`; also `ask ai about hints` and `ask ai about records` while a quiz was displayed.
- Observed: `ask ai about quiz answers` appended “Which set contains all three accepted ways to answer a quiz question?” with four options; a later `ask ai about orientation audit` started a fresh “Question 1 of 4”. The room log shows both question blocks, and only the later one remained active.
- Why it is a problem: a pupil asking for help about answer formats is dropped into an assessed quiz; asking another question mid-quiz silently discards the current attempt. Nothing says a quiz has begun or been replaced.
- Evidence: steps 50 and 58, screenshot `playtest-assistance-ward-8-orientation-quiz-failed-2-of-4.png`.
- Route: `code-lead` (quiz start/restart contract).

### 7. AI topic words do not match their answers
- Command or click: `ask ai about tell`, `ask ai about bye`, `ask ai about lives`, `ask ai about save`, `ask ai about hints`, `ask ai about records`.
- Observed: `tell`, `bye`, `lives` and `save` all returned the same save/load text (“Save and load use the browser's own storage...”). `hints` returned the ward tour line, `records` returned the carried-item note; the actual hint and failure teaching arrived under `ask ai about ask`.
- Why it is a problem: the brief asks the AI to teach hints, failure/lives and save controls. The content exists, but a pupil asking with the obvious keyword gets an unrelated answer and may conclude the information is absent.
- Evidence: steps 47–57.
- Route: `content-editor` (topic keywords), with `code-lead` if topic matching needs a fix.

### 8. Outdated room prose after the gates open
- Command or click: `look` in the Network Hub after `use assistance dial` and after the gates had opened; `look` in The Interface after its east exit had opened.
- Observed: hub still says “The east and north teaching sockets stay dark until the ward's calibration mark is entered.” Interface still says “The east arrow is dark until the Assistance Ward's calibration mark is entered”; the same snapshot lists `Exits: east, out` and `east` succeeds.
- Why it is a problem: the text contradicts the live exits at the moment of success, so the player cannot trust the room description as a guide to the new route.
- Evidence: steps 69–72, screenshot `playtest-assistance-ward-13-hub-gates-open-tutorial-complete.png`.
- Route: `content-editor` (state-aware room prose).

### 9. `use practice bell` is location-bound although the brief places it in Records
- Command or click: `use practice bell` in Records after calibration; then `south` to Demonstration and `use practice bell`.
- Observed: Records: “I don't understand that.” Demonstration: “You find the practice bell screwed to the bench, with a dark felt striker beside it. Its label reads HARMLESS PRACTICE.” — the approved description, with no score or flag change.
- Why it is a problem: the brief's step 9 puts the bell check in Records; a player following it sees a parser failure. The promised harmless, flag-free action is present but only where the bell physically sits.
- Evidence: steps 66–68, screenshot `playtest-assistance-ward-12-practice-bell-harmless.png`.
- Route: `content-editor` (brief/reachability wording) or `code-lead` if remote use is intended.

---

## 3. Content-quality findings

### 10. Placeholder objective and controls copy is shown to the player
- Command or click: New Game, then `look`.
- Observed: the log opens with “Objective copy to follow.” and “Controls copy to follow.”; the title screen also shows “Objective copy to follow.” / “Controls copy to follow.” / “Type help to see available commands.”
- Player's goal and information: learn what the game wants. The two placeholder lines look like unfinished copy and carry no objective.
- Why it is a problem: the first thing a pupil reads is authoring scaffolding, not a goal. It weakens the otherwise clear arrival teaching.
- Hint level used: none needed; no hint could repair this.
- Why the next step was unclear and whether it changed: `help` gave a usable command list, so play continued, but the opening goal had to be inferred from the register text.
- Evidence: step 1, screenshot `playtest-assistance-ward-1-hub-gates.png` (placeholder lines are still at the top of the log).
- Route: `content-editor`.

### 11. SHOW silently hands over a carried item
- Command or click: `show mateo tally token` while carrying the tally token; `inventory` immediately afterwards.
- Observed: “Mateo reads the card at his own pace. 'UNLOCK. OPEN. PLACE. CLOSE. I kept my place that time.'” followed by “You are carrying practice key.” The later `give kofi tally token` then failed with “I don't understand that.”
- Player's goal and information: show a prop to a pupil; the AI's later records line warns that “any carried item, including the tally token, is handed over if you show or give it”, but nothing says so at the moment of the action.
- Why it is a problem: a routine-looking SHOW removes an item with no transfer message. It is recoverable here because the token is optional, but it teaches the wrong rule at the point where the ward is teaching verbs.
- Hint level used: none; no hint was offered.
- Why the next step was unclear and whether it changed: the next inventory call revealed the loss, so the hypothesis changed from “show is harmless” to “show transfers”; no further attempt with the token was possible.
- Evidence: steps 30–32.
- Route: `content-editor` (teaching beat) and `code-lead` if the transfer message is missing.

### 12. Hints are graded correctly but too generic to resolve the stalled step
- Command or click: bare `hint` in Records, Intake and Demonstration, with `look` between attempts.
- Observed level 1: “Use this ladder for whichever orientation task is in front of the pupil: a practice action, an audit question or the final calibration. Begin by naming the action, evidence or adjustment that needs attention.” Level 2: “The present matter should be settled from what is visible...” Level 3: “Now set that visible evidence beside the earlier command demonstration...” Cooldown: “Think about it for a moment.”
- Player's goal and information: stuck on the exact unlock wording, Priya's reason and the gate condition. The ladder is available without score penalty and never gives the answer, which is fair.
- Why it is a problem: all three levels apply equally to practice, audit and calibration; none names the object or the blocked step. After a hint I could describe a strategy but not a specific next command. In Demonstration the first `hint` jumped straight to level 3 because ladder state carried over from Intake.
- Hint level used: 1–3 in Records, 1–2 in Intake, 3 on first ask in Demonstration.
- Why the next step was unclear and whether it changed: after level 3 I still had to find `unlock practice key with practice cabinet` by trial; the next attempt changed only because I guessed the “with” form, not because the hint identified it.
- Evidence: steps 60–65 and 95–99, screenshot `playtest-assistance-ward-39-intake-and-demonstration-hints.png`.
- Route: `content-editor`.

### 13. Quiz teaches a command form the game rejects
- Command or click: orientation quiz question “A practice cabinet is locked. You want to unlock it without opening it yet. Which command fits?”, option 3 `unlock <item> <target>`.
- Observed: option 3 was marked correct — “The third option is correct. unlock <item> <target> uses a key-like item and changes the cabinet's unlocked state without opening it.” In the room, `unlock practice key practice cabinet` had returned “I don't understand that.” and only `unlock practice key with practice cabinet` worked.
- Player's goal and information: answer the quiz from the command list and the practice just performed.
- Why it is a problem: the assessed answer contradicts the working input, so a pupil who answers correctly then copies the command will fail. This is the clearest fairness break in the ward.
- Hint level used: none; explanations did not mention the “with” form.
- Why the next step was unclear and whether it changed: the next attempt used the “with” form after earlier trial and error, not because the quiz explanation taught it.
- Evidence: steps 24–26 and 53, screenshots `playtest-assistance-ward-6-unlock-practice-key-success.png` and `playtest-assistance-ward-9-orientation-quiz-passed-3-of-4.png`.
- Route: `content-editor` (quiz text) and `code-lead` (parser form) — resolve together.

---

## 4. Difficulty and fairness record

**Time to first insight.** From New Game (07:18) to the first recovery insight, Nia's chipped corner (07:21), took about three minutes; most of that was parser wording and general exploration, not puzzle reasoning. The ward puzzle itself was understood at 07:24 when the recovery board listed all five sockets, and solved at 07:26.

**Repeated actions with no new information.** `ask ai about tell`, `bye`, `lives` and `save` returned the same save text; `tell priya about checked` and `tell priya checked` replayed the same instructions; `examine recovery board` after recovery repeated the same five labels; `hint` during cooldown repeated “Think about it for a moment.”

**Hint level used.** Levels 1–3 were all used in Records; level 1–2 in Intake; level 3 in Demonstration. No score penalty and no automatic offer were seen.

**Failed attempts and next attempts.** `unlock` failed in two of three forms before succeeding; `place` failed once then `put` worked; Priya's reason failed twice then “about the clue” worked; `talk to <npc>` failed and `talk-to <npc>` produced only a generic reply. Every successful retry changed the command form, but only one change was prompted by game feedback (“The dial does not move. Look at the five empty sockets...”).

**Abandonment point.** None in the ward. The two scripted vocabulary traps (unlock, PLACE) were the points where stopping felt most reasonable; both were cleared by trying synonyms.

**Can the player explain success or failure?** Yes for the quiz: every answer, right or wrong, received a specific explanation, and the 2/4 failure stated that no life was lost and no movement occurred. Yes for the dial: the blocked message listed all five missing records, so the next step was obvious and worked. No for the unlock form and Priya's reason: feedback said “I don't understand that” or replayed instructions without naming the accepted wording.

**Goal, obstacle, tools.** Goal (mastery to clear the attendance mark), obstacle (five empty sockets) and tools (the four pupils and the AI's practice audit) are all visible through the register, hub route topic, room prose, recovery board and dial labels. Two discoverable clues support each ward gate: prose plus port label, and board labels plus blocked-message feedback.

**Is failure proportionate and age-appropriate?** Yes. The ward costs no lives, keeps the pupil in place, allows unlimited quiz retries and gives explanations; the reasoning is about observation, evidence and sequence, which suits GCSE. Challenge comes from interpretation, not punishment. The avoidable friction is vocabulary, not ideas; removing the PLACE/unlock wording traps would bring the ward in line with the difficulty guidance without making it easier.

---

## Out of scope — later areas

The route beyond the ward was entered only to confirm the hand-off: hub east/north, the older interface's east with `out` intact, and hub north to the concourse all opened. No later-area behaviour is included in the ward verdict above. One route-context note: subsequent Switchyard spokes remained blocked after the claimed item actions; this is recorded here as context only, not as a finding, and is not part of the ward priority list.

---

## Priority list from the player's point of view

1. Make `unlock` accept the documented and natural word orders, and make the quiz's correct answer match the form that actually works (findings 3 and 13).
2. Accept `PLACE` from the instruction card, or change the card to `PUT` (finding 4).
3. Replace `flag-set` gate feedback with an in-world reason (finding 1).
4. Align AI topic keywords with hints, lives, tell and bye, and stop `ask ai about quiz answers` starting or resetting a quiz (findings 6 and 7).
5. Make Priya's reason prompt accept the wording it invites, and say when SHOW hands an item over (findings 5 and 11).
6. Update the hub and interface prose once their gates open, and put the bell check where the bell is (findings 8 and 9).
7. Make ward hints name the stalled step while still leaving the answer to the pupil, and remove the placeholder objective/controls copy (findings 10 and 12).
