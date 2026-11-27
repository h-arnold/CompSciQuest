# W7 re-test — Assistance Ward, round 2 (2026-11-27)

**Purpose:** content playability and effectiveness review. **Scope:** Assistance Ward only — arrival → hub → Intake → Demonstration Ward → Records Office → orientation quiz → calibration dial → final ward puzzle → the three teaching-port gates. The Switchyard and Pattern Mill were not played; one step into each opened gate was used only to confirm the gate, and any later-area effect is recorded as context, not as a ward finding.

**App:** `http://localhost:5173/CompSciQuest/`, started with `npm run dev` in this worktree. Played from New Game with ordinary player commands in Playwright MCP, with a second New Game in an isolated browser context for clean-state checks. No crafted save, generated fixture, source file, test or walkthrough was used. `docs/content/difficulty-and-fairness.md` was read before play. The prepared brief file was permission-denied to this agent; its full claims were supplied in the dispatch message and are used verbatim below.

**Evidence convention:** step numbers follow encounter order in this session. Screenshot paths are relative to `.opencode/scratchpad/slices/w7-assistance-ward-round2/screenshots/`. Quotations are copied from the browser log.

---

## 1. Expected path claims — checked against play

| # | Claim | Observed in the running game |
| --- | --- | --- |
| 1 | Boot in the arrival room; classroom mark and AI verdict; scoped arrival questions give distinct teaching; no score or life change | **Confirmed.** New Game opened with “The register marks your attention not satisfied. Pass the Assistance Ward orientation and the mark can be cleared.” and “The Arrival Bay”. `ask ai about verdict`, `ask ai about attendance mark`, `ask ai about what failure means` and `ask ai about programming` each returned different text, for example “A fresh sheet in the record lists the lessons still to come; its last line is untouched. Programming was timetabled after attendance.” Side panel held `Score: 0`, `Lives: 3`; `score` returned “Your score is 0.” (steps 1–2). |
| 2 | East to hub; south open; east and north teaching sockets described as locked by the calibration mark; blocked feedback in-world with no internal token; AI route topic names the ward checkpoint; after the puzzle prose stays true and both gates open | **Confirmed before the puzzle; mismatch after it (finding A).** Hub prose: “The east and north teaching sockets are keyed to the ward's calibration mark; their labels carry the same notice.” `east` → “The east socket gives no signal. Its label names the ward mark that must be recorded before this route carries traffic.” `north` → “The north socket gives no signal. It carries traffic once the ward's calibration mark is on record.” No internal name appeared. `ask ai about route out` → “The south route is always open. It leads into the Assistance Ward, a safe checkpoint where the pupil may leave and re-enter without losing a life.” After the puzzle both exits worked, but the same “keyed to” prose still appeared (step 3, 14–15; screenshots 1, 2, 11, 12, 13). |
| 3 | Intake: `look`, `examine`, `take`, `drop`, `inventory`, `score`, `help`; tally token optional; observation card fixed with chipped corner; Nia recovery works | **Confirmed.** “You follow the observation card's border to one chipped corner.” `take tally token` → “Taken.”; `drop tally token` → “Dropped.”; `inventory` → “You are carrying nothing.”; `help` listed the full command set; `ask nia about observation card` → “Nia studies the observation card. 'That corner is chipped.' ... 'I noticed that. The AI didn't tell me.'” Score stayed 0 and lives 3 (step 4). |
| 4 | Demonstration: examine instruction card and crank; written word PLACE works for placing the block, as does `put`; documented unlock form works, as does item-first “with” form; failed unlock says what is missing in-world without falsely claiming a carried key is absent; OPEN/CLOSE and fixed-fixture refusals work; Mateo and Kofi recoveries work; SHOW/GIVE announces hand-over; `use practice bell` works here where it is screwed to the bench, reusing its description with no flag or score change | **Confirmed, with one wording issue (finding B).** Card: “Four lines read: UNLOCK. OPEN. PLACE. CLOSE. A pencil underline marks PLACE.” `place practice block in practice cabinet` → “You put it down.”; `unlock practice key practice cabinet` → “You unlock it.”; `unlock practice key with practice cabinet` → “You unlock it.”; `open practice cabinet` → “You open it.”; `close practice cabinet` → “You close it.”; `take practice bell` → “You can examine the practice bell, but its bench screws keep it fixed in place.”; `ask mateo about instruction card` and `ask kofi about practice crank` produced their recovery lines; `show mateo tally token` appended “You hand the tally token to mateo.”; `use practice bell` → “You find the practice bell screwed to the bench, with a dark felt striker beside it. Its label reads HARMLESS PRACTICE.” with no score change (steps 5–7, 20; screenshots 3, 4). |
| 5 | Records: examine audit card, recovery board and dial; Priya's choose-then-reason exchange works in the player's own words, not only one exact phrase; `talk-to` or a retired choice grants no recovery | **Confirmed.** `examine recovery board` → “OBSERVE — Nia. READ — Mateo. REASON — Priya. OPERATE — Kofi. ORIENTATION PASS — the AI's practice audit.” `ask priya checked` → “Priya writes the word you chose beside the card. 'Done. No — done isn't a reason.'” `tell priya about the chip` → “Priya listens, then writes your reason beside her choice.” `tell priya about checked` and `tell priya checked` only replayed instructions. Later `talk-to priya` and `ask priya assumed` gave “'Wait — I can test that reason again.'” with no new recovery (steps 8–9, 19). |
| 6 | AI teaching: obvious question word gets the matching answer for records, conversation verbs, answer forms, hints, failure/lives and save controls. Asking about “quiz answers” teaches answer formats without starting the audit; asking another question during a live audit does not silently restart it | **Confirmed, with one minor topic mismatch (finding D).** `ask ai about records`, `conversation`, `talk`, `tell`, `bye`, `ask`, `answer forms`, `answers`, `quiz answers`, `hints`, `lives`, `failure` and `save` each returned the matching teaching. `ask ai about quiz answers` returned “'In the audit, answer N uses the number shown beside an option, starting at 1,' ... 'A bare N or the exact option text is also accepted.'” with no question displayed. During a live quiz, `ask ai about records` returned “'One subject at a time,' it adds.” and the next answer continued the same question, with no restart (steps 10–11). |
| 7 | Bare `hint` in each ward room resolves a short ladder that names the stalled step without giving the answer, starts at level 1 in each room, has a two-turn cooldown, no score penalty and no automatic offer | **Confirmed.** Intake level 1: “In the Intake Bay the observation card is clipped flat beside you, and Nia is waiting on a detail.” Demonstration level 1: “In the Demonstration Ward the practice cabinet offers a lock and a door, and they are two separate jobs.” Records level 1: “In the Records Office, Priya's exchange has two halves: a choice and then a reason.” Immediate repeat: “Think about it for a moment.”; after one intervening turn the next rung arrived. No score change and no offer was seen (steps 4–6, 8, 17–18). |
| 8 | Orientation quiz: four questions, 3-of-4, no timer, unlimited retries; deliberate fail costs 0 lives and does not move the pupil; immediate retry; every answer explained; correct unlock answer matches a command the room accepts | **Confirmed.** A 0/4 attempt ended with “Lives: 3.” and “The record stays open, and the pupil is not moved. A failed attempt costs no life; explanations and the hint command are available.” An immediate retry reached 3/4 and “Topic completed: Game orientation.” Every answer received an explanation. The unlock option was marked correct with “unlock <item> <target> is the form shown in help ... The same item-first command also works when the preposition with is added: unlock practice key with practice cabinet.” — exactly the form that worked in the room (steps 11–12; screenshots 5, 6, 9). |
| 9 | Locality: in the hub an exact pupil topic about a card is refused in character; back in Intake it works; no remote recovery | **Confirmed.** In the hub: `ask nia about card` → “You cannot see that here.”, `ask mateo about instruction card` and `ask kofi about crank` gave the same reply. Back in Intake, `ask nia about observation card` → “'I don't need the AI to name the detail first. I can look, then say what I noticed.'” (steps 14, 19). |
| 10 | Final calibration: early `use assistance dial` gives the approved blocked text and changes nothing; with all five prerequisites it gives the approved success text | **Confirmed.** Before the quiz: “The dial does not move. Look at the five empty sockets: OBSERVE needs Nia's observation card, READ needs Mateo's instruction card, REASON needs Priya's reason, OPERATE needs Kofi's practice cycle, and ORIENTATION PASS needs the practice quiz. Fill all five, then try again.” A fresh game with no recoveries returned the same text. After the pass: “The dial gives a small, reluctant click. All five sockets are lit; the teaching ports have stopped pretending to be decoration.” (steps 9, 13, 18; screenshots 10, 16). |
| 11 | Puzzle solve sets the completion transition, reports the ports brighten, completes the mechanics tutorial; hub east/north open; older interface east opens while `out` still returns; score stays 0 and lives stay 3 throughout the ward | **Confirmed.** On dial success: “The teaching-zone ports brighten. Your mandatory Assistance Ward orientation checkpoint is complete.” Hub `east` reached “The Switch Floor”; hub `north` reached “The Rule Machine Concourse”; interface `east` reached “The Switch Floor” and `out` returned to the Network Hub. `score` stayed 0; lives stayed 3 for all ward play (steps 13–16; screenshots 10–14). No internal token was displayed for the completion. |

**Ward verdict:** every named ward behaviour was reached and worked. Ten of the thirteen earlier blockers are closed; the remaining one concerns prose that does not follow state.

### Gate table check

| Gate | Claimed condition | Observed |
| --- | --- | --- |
| Hub south | Ungated | Open from the first hub visit; `south` reached Intake Bay (step 4). |
| Hub east | Completion | Pre-puzzle: in-world “The east socket gives no signal...”; post-puzzle: reached The Switch Floor (steps 3, 14). |
| Hub north | Completion | Pre-puzzle: “The north socket gives no signal...”; post-puzzle: reached The Rule Machine Concourse (steps 3, 15). |
| Older-interface east | Completion | Fresh game: “The east arrow stays dark. The plaque beneath it names the calibration mark it waits for.”; post-puzzle: reached The Switch Floor; `out` still returned (steps 16, 18; screenshots 14, 17). |
| Quiz start | Four recovery flags | Fresh game: `ask ai about orientation audit` gave the ward tour and no questions; after four recoveries it gave the four-box form and questions (steps 11, 18). |
| Dial success | Four recoveries plus quiz pass | Blocked before the pass, succeeded after it (steps 9, 13). |
| Final puzzle | Recoveries, quiz pass, calibration | One `use assistance dial` after the pass produced completion and the brightened ports (step 13). |

Two discoverable clues were available for each gated exit: hub prose plus the port label and in-world block; interface prose plus the plaque and in-world block. The stated goal, obstacle and tools were visible in the register text, the AI route topic, the five recovery-board labels and the five dial labels.

---

## 2. Status of the thirteen earlier findings

Each is marked confirmed-closed or still open against this round's play.

1. **Internal flag token at teaching-port gates — confirmed-closed.** `east` now gave “The east socket gives no signal. Its label names the ward mark that must be recorded before this route carries traffic.” `north` gave the matching north line. No `flag-set` text appeared anywhere in the ward. Evidence: step 3, screenshots 1 and 2.
2. **`talk to <npc>` rejected — confirmed-closed.** `talk to ai` → “Another tap lands on the record. Ask about the attendance mark, what failure means, or the route out.”; `talk to nia` → “'I don't need the AI to name the detail first. I can look, then say what I noticed.'” `talk-to ai` and `talk-to priya` also worked. Evidence: steps 2, 4, 19.
3. **Unlock only worked in one undocumented order — confirmed-closed.** With the key carried, `unlock practice key practice cabinet` → “You unlock it.” and `unlock practice key with practice cabinet` → “You unlock it.” Neither claimed a carried key was absent. The other order now gives an in-world reason, though that reason invites an impossible action (new finding B). Evidence: step 5.
4. **Instruction card teaches PLACE, parser rejects it — confirmed-closed.** `place practice block in practice cabinet` → “You put it down.” after `open practice cabinet`; `help` also lists `put <item> <target> (place)`. Evidence: step 5; a repeat attempt after the block was already stored returned “I don't understand that.”, which is expected because the block was no longer in hand (screenshot 3).
5. **Priya's reason needed one exact phrase — confirmed-closed.** After `ask priya checked`, `tell priya about the chip` → “Priya listens, then writes your reason beside her choice.” This is a reason in the player's own words, not the old `about the clue` phrase. `tell priya about checked` and `tell priya checked` replayed instructions, which is a fair prompt to say more. Evidence: steps 8–9.
6. **Asking about quiz answers started or reset the quiz — confirmed-closed.** `ask ai about quiz answers` taught the answer forms with no question block. Mid-quiz `ask ai about records` gave “'One subject at a time,' it adds.” and the next answer advanced to question two; no new “Question 1 of 4” appeared. Evidence: steps 10–11.
7. **AI topic words did not match their answers — confirmed-closed for the named topics.** `records`, `conversation`, `talk`, `tell`, `bye`, `ask`, `answers`, `hints`, `lives`, `failure` and `save` all matched; `lives` now says “'A failed ward attempt costs no life and does not move the pupil; retries are unlimited,'” and `hints` now explains the hint command. `saving` still differs (new finding D). Evidence: step 10.
8. **Outdated room prose after gates open — still open.** After completion the hub still said “The east and north teaching sockets are keyed to the ward's calibration mark; their labels carry the same notice.” while `Exits: west, east, in, north, south` were listed; interface still said “The east arrow is keyed to the Assistance Ward's calibration mark” while `Exits: east, out` were listed. Records also kept “five record slots waiting above the desk” and “Empty sockets keep the teaching ports dark.” after all five were lit. Evidence: steps 13–16, screenshots 12 and 14. Detailed as finding A.
9. **Bell use was location-bound — confirmed-closed against the reissued claim.** `use practice bell` in the Demonstration Ward, where the bell is screwed to the bench, returned the approved description with no score or state change. Evidence: step 5, screenshot 4.
10. **Placeholder objective and controls copy — confirmed-closed.** Title screen and new-game log opened with the real objective (“The register marks your attention not satisfied...”) and “Use plain commands: look, examine, take and a direction such as east.” No placeholder lines appeared. Evidence: steps 1 and 18, screenshot 15.
11. **SHOW silently handed over a carried item — confirmed-closed.** `show mateo tally token` appended “You hand the tally token to mateo.” and the next `inventory` showed “You are carrying practice key.” Evidence: step 7.
12. **Hints were generic and carried ladder state across rooms — confirmed-closed.** Each ward room started at its own level 1 text naming its own stalled step; no score penalty; no automatic offer. Evidence: steps 4–6, 8, 18.
13. **Quiz taught a command form the game rejects — confirmed-closed.** The quiz marked `unlock <item> <target>` correct and added “The same item-first command also works when the preposition with is added: unlock practice key with practice cabinet.” Both forms worked in the room. Evidence: steps 5 and 11–12, screenshot 9.

---

## 3. Findings from this round

### Functional defects (route to `code-lead`)

#### B (minor). Wrong-order unlock invites carrying a bolted-down fixture
- Command or click: `unlock practice cabinet with practice key`, then `take practice cabinet`, in the Demonstration Ward.
- Observed: “You need the practice cabinet in hand before it will turn in the practice key.” / “You can open the practice cabinet's door, but its bench bolts hold the cabinet itself in place.”
- Why it is a problem: a pupil trying the natural “verb object with tool” order is told to do something the room has already refused. It does not falsely claim the key is missing, and the documented and item-first forms both work, so the ward can still be finished; the feedback simply offers an impossible next step.
- Evidence: step 20.

### Content-quality findings (route to `content-editor`)

#### A. Room and item prose does not follow the completed state
- Command or click: `look` in the Network Hub, `look` in The Interface, `examine recovery board` and `examine calibration dial` in Records after `use assistance dial` succeeded.
- Observed: hub — “The east and north teaching sockets are keyed to the ward's calibration mark; their labels carry the same notice.” with `Exits: west, east, in, north, south`; interface — “The east arrow is keyed to the Assistance Ward's calibration mark; the opening behind you still returns to the hub.” with `Exits: east, out`; Records — “five record slots waiting above the desk” and “Empty sockets keep the teaching ports dark.”
- Player's goal and information available: decide which routes and records are now live. The exit list and the port brightening message say they are live; the prose says the opposite.
- Why it is a problem: the player cannot trust the room description at the moment it matters most, and must test exits by trial to learn the new state. This is the same defect as earlier finding 8 and remains open.
- Hint level used: none; hints do not repair a false description.
- Why the next step was unclear and whether the next attempt changed: the wording gave no reason to expect the gates had opened, so the next attempt was to walk into each exit; the attempt succeeded and established the truth by trial.
- Evidence: steps 13–16, screenshots 12 and 14.

#### C. The approved dial block text describes five empty sockets after four are filled
- Command or click: `use assistance dial` in Records after Nia, Mateo, Priya and Kofi had all recovered their records but before the quiz pass; `examine recovery board` after all four.
- Observed: “The dial does not move. Look at the five empty sockets: OBSERVE needs Nia's observation card, READ needs Mateo's instruction card, REASON needs Priya's reason, OPERATE needs Kofi's practice cycle, and ORIENTATION PASS needs the practice quiz. Fill all five, then try again.” The board still read “five record slots ... All five records are required.” with no filled state.
- Player's goal and information available: work out which of the five prerequisites is still missing. The blocked message lists all five as empty and the board does not mark progress.
- Why it is a problem: the most useful progress feedback in the ward reports the wrong state. A pupil who has done four tasks is told to do all five again; repeated `examine recovery board` and dial attempts produced no new information. This does not break the named blocked-command behaviour, but it weakens the fairness of the last step.
- Hint level used: none before the dial; the Records hint ladder did correctly name the unfilled task when asked.
- Why the next step was unclear and whether the next attempt changed: only the phrase “ORIENTATION PASS needs the practice quiz” singled out the remaining step; the next attempt was to start the quiz, which changed the state and led to success.
- Evidence: steps 9 and 13, screenshot 16 (same text in a fresh game).

#### D (minor). `ask ai about saving` returns the ward tour
- Command or click: `ask ai about saving` in Records.
- Observed: “The AI checks its clipboard, then lets its pointer sink. 'The pupil has reached the Assistance Ward. The ward will now demonstrate the controls, because apparently the route signage was insufficient.'”
- Player's goal and information available: find out how to save. `ask ai about save` did give the right answer, and `help` lists the controls.
- Why it is a problem: the natural past-continuous keyword gets an unrelated tour line, so a pupil may think save guidance is absent. Small impact because the singular form works.
- Hint level used: none.
- Why the next step was unclear and whether the next attempt changed: the next attempt was `ask ai about save`, which returned “Save and load use the browser's own storage. Download creates a portable save file; import restores one.” — that changed the outcome.
- Evidence: step 10.

#### E (minor). Prominent arrival nouns are not examinable
- Command or click: in The Arrival Bay, `examine register`, `examine attendance record`, `look at the record`, `examine the mark`.
- Observed: each returned “I don't understand that.”
- Player's goal and information available: inspect the register and the mark that the room text and the AI both foreground.
- Why it is a problem: the first room teaches plain commands with nouns the player can see, so a first attempt at `examine` on the most prominent object fails. The AI topics still carry the teaching, so this is a small friction rather than a blocker.
- Hint level used: none.
- Why the next step was unclear and whether the next attempt changed: the AI's own prompt (“Ask about the attendance mark, what failure means, or the route out”) redirected the next attempt to asking, which worked.
- Evidence: step 20.

---

## 4. Difficulty and fairness record

**Goals, obstacle and tools (Bycer's three questions).** All three were answerable without notes: the register and AI verdict state the goal (“The entry stands until mastery of the whole of Unit 1 is demonstrated”); the recovery board and blocked dial state the obstacle (“All five records are required”); the four pupils, the practice props and the AI's audit are visible tools. Each gate had prose plus an in-world object clue plus in-world blocked feedback.

**Time to first meaningful insight.** From New Game (09:23) to Nia's chipped-corner recovery (about 09:29) took roughly six minutes in this session, but that included systematic testing of every command variant. In ordinary play the room text, the AI's prompts and the chipped corner point at the insight within the first two or three commands. The final ward puzzle was understood when the recovery board's five labels were read and solved when the five lit sockets were confirmed.

**Repeated actions with no new information.** `examine recovery board` repeated the same five labels after each recovery; `use assistance dial` before the quiz always listed all five sockets; `hint` immediately after a hint repeated “Think about it for a moment.”; `ask ai about records` during the quiz refused the subject; `talk-to priya` after recovery repeated the same cheerful line. The board and dial repetition is finding C; the others are appropriate refusals or cooldown.

**Guess-the-verb and clue access.** The card's PLACE, the documented unlock order and Priya's own-words reason all worked with the words the game itself offers. `tell priya about checked` and `tell priya checked` were refused but produced a prompt that names the missing element (“Tell me in your own words what I checked and what it showed”), so the next attempt could change. No essential action depended on one exact phrase. The two small vocabulary mismatches are findings D and E.

**Hint level used.** Level 1 in each of the three ward rooms, level 2 and 3 in Intake, Demonstration and Records when pressed, and the cooldown line on immediate repeats. Hints named the stalled object or half-step without supplying an answer, cost no score and were never offered automatically. In the fresh game the cadence was: hint → “Think about it for a moment.” → `look` → next rung, which is two turns between successful hints. After a task was finished, “There is nothing more to suggest just now.” was correct.

**Quiz readability and failure.** Four questions were framed with numbered options; the pass mark and zero-score, no-life, unlimited-retry consequences were stated before the first question; every answer got a specific reason, including why each distractor was wrong. The deliberate 0/4 fail left the pupil in Records with three lives and an immediate retry. A wrong answer changed the next attempt from guessing to using the explanation. The unlock question's explanation now names both working command forms, so a correct answer can be copied into the room.

**Failure preservation and age-appropriate challenge.** No ward failure removed a record or a life. Recovery was a fresh question form or another dial turn, with no repeated walk. The reasoning involves observation, evidence, command form and a five-part sequence, which suits a GCSE learner; difficulty comes from interpretation rather than dense prose or punishment. The remaining avoidable friction is stale prose and progress feedback (findings A and C), not the ideas.

**Can the player explain what to try next after a hint or failure?** Yes for the dial (“ORIENTATION PASS needs the practice quiz”), the quiz (explanations name the rule), Priya (the prompt asks for the reason in the pupil's own words), the hub gates (the labels name the ward mark) and the hints (each names the stalled step). Only finding B's unlock error invites an action the world refuses, but the correct forms are documented and work.

**Abandonment point.** None in the ward. The earlier session's two vocabulary traps no longer stop play. The point most likely to cause doubt is the dial blocked text after four successes, because it implies no progress has been made.

**Out-of-scope context only.** Confirming the hub-east and interface-east openings required stepping into The Switch Floor. On both entries a hazard immediately fired: “Heat haze curls off the belt ... you are back in the hall, one life lighter.” and “Lives: 2.” Entering the Rule Machine Concourse from the hub north then showed “Lives: 3.”, matching the AI's earlier statement that lives are restored on entering a new area. This happened outside the ward and is not included in the ward verdict or priority list. No console errors were logged.

---

## Priority list from the player's point of view

1. Make the hub, interface and Records prose follow the completed state, so the open ports and filled sockets match what the player reads (finding A, earlier finding 8; `content-editor`).
2. Make the dial's blocked feedback and recovery board show which of the five records are already filled, instead of calling all five empty (finding C; `content-editor`).
3. Reword the wrong-order unlock refusal so it does not tell the pupil to pick up a bolted-down cabinet (finding B; `code-lead`).
4. Align `ask ai about saving` with the save answer, and let the prominent arrival nouns be examined (findings D and E; `content-editor`).

All thirteen earlier findings are accounted for: findings 1–7 and 9–13 are confirmed-closed; finding 8 is still open. Ward play from New Game to completion finished at score 0 with three lives. No later-area behaviour is assessed here.
