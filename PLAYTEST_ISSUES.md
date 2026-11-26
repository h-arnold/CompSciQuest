# Playtest issues log

Live blind playtest of the site at `http://localhost:5173/CompSciQuest/` using
the browser (Playwright MCP). Findings are recorded as encountered, from the
player's point of view only: no source code, tests or design documents were
consulted to decide what _should_ happen.

## Method

- Start at the title/entry screen and play with ordinary player commands.
- Try the obvious commands a first-time player would try, then alternative
  phrasing when something does not respond.
- Record verbatim game text where it is useful evidence, plus what was typed
  and what happened.
- Note missing guidance, broken interactions, surprising mechanics and weak
  prose as separate issues.

The Playwright MCP tools were connected through a small local stdio-to-HTTP
bridge because this session's tool catalog did not expose them directly; every
action and observation below came from the real browser via MCP tools such as
`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`,
`browser_evaluate` and `browser_file_upload`. Screenshots:
`playtest-01-start.png`, `playtest-02-quiz.png`, `playtest-03-gameover.png`.

## Issues

### 1. Title screen gives no goal or controls (blocking for a new player)

The entry screen offers only a disabled **Continue** and **New Game**. There is
no introductory text, objective, control hint or "type help" prompt. The `help`
command exists but is undiscoverable unless the player already knows text
adventures use it. The first room then talks about "attention not satisfied"
without explaining that this matters.

### 2. `help` omits the commands the game actually needs

Typing `help` returns verbatim:

> Try a direction, take, drop, examine, open, close, unlock, put, look,
> inventory, score or help.

No mention of `ask`, conversation, quizzes, hints, `x` as examine, etc.
Conversation with an NPC was only discovered by guessing `ask <npc> about
<topic>`; `talk`, `talk to loomwright` and `speak` all returned "I don't
understand that."

### 3. Most objects named in room descriptions cannot be examined

In the Network Hub, `examine card`, `take card`, `read card`, `examine yellowed
card`, `examine sockets`, `examine brass sockets`, `examine socket` and
`examine east socket` all return **"I don't understand that."** Only the
exact noun `label` works (`examine label` / `x label`). The description
actively advertises a "yellowed card" and "brass sockets", so the parser makes
the world feel fake. The same happens in the Rule Machine Concourse:
`examine slate`, `examine door`, `open door`, `examine searching and sorting`,
`examine returned to sender` all fail, even though those doors and labels are
central to the room.

### 4. Generic, unhelpful failure messages

- `take label` → "You cannot take that item with you." (it is described as
  glued/stuck to a socket, so a specific reason would help).
- `north` in the concourse → "You cannot go that way." with no clue that the
  north doors are blocked or what might open them.
- Unsupported verbs always collapse to "I don't understand that.", with no
  list of what is available in the current room.

### 5. Score spam on every move

Moving into a new room prints lines such as:

> Score (room:room-network-hub): 0 — total 0.

and `Score (room:room-1-4-concourse): 0 — total 0.` The internal room IDs leak
into the UI, the line reports a zero gain as though something happened, and
the sidebar separately shows "Score: 0 / 0". It is noise on every movement.

### 6. Missing favicon

Browser console error on load:
`Failed to load resource: the server responded with a status of 404 (Not Found)
@ http://localhost:5173/favicon.ico`. Minor, but it is an error on the very
first page load.

### 7. Conversation prompts suggest commands that do not work

The panel says `(You could ask about a pattern.)`, but `ask about pattern`
returns "I don't understand that." The working form is
`ask loomwright about pattern` — the NPC name is mandatory and never explained.
`topics`, `talk` and `speak` do not list available topics either.

### 8. Internal IDs leak into the player-facing log

Verbatim examples:

> Entered conversation node node-loomwright-demonstration.
> Left the conversation node.
> Quiz quiz-pattern-bureau started.
> Quiz quiz-pattern-bureau failed: the quiz was failed.
> loomwright is now actorstate-loomwright-witnessing.

These are developer identifiers, not game text, and badly break immersion.

### 9. Quiz answers cannot be given using the options shown

The quiz panel displays a numbered list (`1. ... 2. ... 3. ... 4. ...`) but
typing `1`, `2` or `a` all return "I don't understand that." The working syntax
is `answer 1`, which is never stated anywhere. A player who tries the obvious
thing cannot answer any question. The quiz panel offers no buttons or other
visible affordance either.

### 10. Quiz feedback does not say whether an answer was right

After each `answer N`, the game prints a paragraph explaining the correct
answer but never labels the player's answer correct or incorrect. When the
fourth answer was wrong the only signals were a sudden "the quiz was failed",
a lost life and a re-print of the room description. Unprompted lines reading
`Hint penalty: 0.` also appear after answers and failures despite no hint being
requested.

### 11. Sidebar shows a stale score card for every room visited

After four rooms the sidebar contained four separate cards:
"The Machine — The Arrival", "The Machine — The Network Hub",
"The Machine — The Rule Machine Concourse", "The Machine — The Pattern Mill".
Each old card still reads "Score: 0 / 0" and "Rooms visited: 1 / 1", while the
current one reads "Score: 0 / 19" and "Rooms visited: 1 / 8". The numbers do
not match the top-level "Score: 0" / "Lives: 2", so the status panel is
actively misleading.

### 12. Unavoidable, untelegraphed death trap on entering the Switch Floor

From the Network Hub, `east` moved into "The Switch Floor" and immediately,
before any command could be entered, printed:

> Hazard hazard-switch-overheat: hazard-switch-overheat.
> Heat haze curls off the belt and the clicks run together into one shrill
> whine. The foreman claps a hand over his ears and mutters about paperwork as
> the switches cook; you are back in the hall, one life lighter.
> Lives: 2.

The room text mentions heat and a gauge at red, but there is no warning that
entry costs a life, no chance to turn anything off, and no way to know the
room is lethal until after paying. The hazard line itself is a developer ID.

### 13. Inventory shows an internal item ID instead of a name

After `take cartridge` in the Binary Hall, `inventory` returned:

> You are carrying item-comic-sans-cartridge.

Picking it up also printed
`comic sans cartridge moved from room-binary-hall to player.` — another
debug line that should not be player-facing.

### 14. Broken NPC examination response

In the Binary Hall, `examine foreman` produced only:

> foreman

That is a placeholder, not a description.

### 15. Undocumented life restoration

After the switch-floor hazard reduced lives to 2, walking back `west` into the
Network Hub silently printed `Lives: 3.` There is no explanation of why a life
was restored, where, or whether it can be relied on.

### 16. Save and Download give no confirmation

Clicking **Save** and **Download** produced no message in the game log. The
download did work (a JSON file was saved by the browser), but a player cannot
tell whether Save succeeded or whether they are saving the state they think
they are.

### 17. `hint` is unhelpful exactly when the player is stuck

In the Binary Hall, with several unexplored gates and an item to use, `hint`
answered "There is nothing more to suggest just now." In the Pattern Bureau it
also dumped a long hint unprompted after a wrong answer. Hints appear tied to
narrow flags rather than the player's actual situation.

### 18. Exit wording does not match the description

The Interface says "behind you, another opening gives onto the Network Hub",
but the listed exits are `east, out`. The natural `west` returns "You cannot go
that way." The text never tells the player that `out` is the way back.

### 19. Switchyard instruction cannot be acted on; north gate stays shut

The gauge in the Switch Floor reads:

> SET EVERY SWITCH, THEN TAKE THE NORTH STAIR ... "denary 37 — what binary
> pattern?"

No phrasing I tried would set the switches: `set switches`, `set switches to
37`, `set switches to 100101`, `flip switches`, `write 100101`, `say 100101`,
`give 100101 to foreman`, `use gauge on switches`, `unlock north` all return
"I don't understand that." The foreman's quiz was passed (2/3 correct) and he
said "Stair's open", but `north` still returns "You cannot go that way." from
the Switch Floor and "That way is blocked: flag-set." from the Binary Hall.
The conversation panel suggested "give the foreman the switch figure", but no
form of give/tell works. This is a hard progression stop.

### 20. All six Binary Hall gates are blocked with no clue how to open them

The diagram names gates `switches-set`, `hex-read`, `characters-matched`,
`picture-built`, `sound-sampled`, `stacks-sorted`. After solving the one
obvious puzzle (`put decimal sample in bin`) and passing the foreman's quiz,
`north`, `east`, `south`, `up`, `in` and `out` from the Binary Hall all return
"That way is blocked: flag-set." The room text and `hint` give no next step,
so the player cannot tell whether this is a bug or a missing item.

### 21. Another untelegraphed life loss from an ordinary verb

Carrying the comic sans cartridge (whose sticker says "Unauthorised font use
is a compliance infringement"), `use cartridge` immediately printed:

> Hazard hazard-detention-bell: hazard-detention-bell. ... a detention bell
> clangs and the ledger logs a compliance infringement in your name ... one
> life poorer. Lives: 2.

`use` is not listed in `help`, and nothing warns that trying to use an item
costs a life. The hazard line leaks an internal ID again.

### 22. Repeated internal IDs in puzzle/quiz success messages

After passing a quiz or puzzle the log prints strings such as:

> Quiz quiz-switchyard passed: the quiz was passed.
> foreman is now actorstate-foreman-busy.
> Topic completed: Switch to bit.
> quiz-passed:quiz-switchyard = true.
> types-sorted = true.
> Puzzle puzzle-sort-the-data-types is now active.
> Puzzle puzzle-sort-the-data-types solved.
> demo-on-record = true.

"Topic completed: Data types." was even printed twice for one puzzle. These
are implementation details, not game text.

### 23. Conversation topics stop matching what the NPC says

Before the foreman's quiz, `ask foreman about switches` gave the switch
explanation and started the quiz. After the quiz, the same command returned a
story about the "predecessor" and "Ask me about them or the lift", while
`ask foreman about switch figure` and `ask foreman about lift` gave a third
unrelated reply. Asking another question while a quiz is running restarts the
quiz from question 1 instead of continuing it. `tell foreman 100101` started a
conversation about the predecessor, ignoring the topic completely.

### 24. No autosave; reloading loses progress without warning

After saving in the Interface, I moved to the Network Hub and reloaded the
page. **Continue** restored the Interface — the state at the last manual
**Save** — silently discarding the intervening progress. Nothing in the UI
warns that the browser does not save automatically.

### 25. Sidebar exposes internal specification citations

The progress panel displayed, verbatim:

> Switch to bit (1.1.1 Components, "learners should be aware of" — historical
> development from early transistors to modern microprocessors
> (`wjec-unit1.md` L318–325, "Early Transistors" / "Integrated Circuits").) —
> covered

This is a documentation citation with a filename and line numbers, not player-
facing text.

### 26. Third unavoidable hazard on entering a room (Weft Counter)

Entering the Weft Counter from the Warp Walk immediately cost a life and threw
the player back to the Pattern Bureau:

> Hazard hazard-dye-pad: hazard-dye-pad. ... the pass count comes up wrong by
> one, then wrong again ... You are back at the Bureau, one life lighter.
> Lives: 2.

As with the switch floor, the room text describes the dried dye pad but never
warns that looking at the room costs a life. Three different areas now use the
same "enter and lose a life" trick, so exploration is actively punished.

### 27. Room descriptions go stale after progress

When the Pattern Bureau was re-entered after the Weft Counter hazard, its
description still said:

> The east door is bolted; its legend reads UNTIL A DEMONSTRATION IS ON RECORD.

The demonstration had already been passed and `east` worked normally. The
prose lies to the player about the state of the world.

### 28. "Puzzle ... is now active." printed after nearly every command

Once the Threading Order and Selvedge puzzles were activated, lines like these
appeared repeatedly after unrelated commands, including while a quiz was in
progress:

> Puzzle puzzle-lift-the-shed is now active.
> Puzzle puzzle-close-the-selvedge is now active.

This drowns out the actual game text.

### 29. Quiz explanations expose specification line numbers

Answers in the Selvedge quiz included references such as:

> ... a for loop fixes its span before it starts (L1218-1221).
> ... the whole condition is false ... (L1299).
> ... it is a rogue value ... (L1261).

These are source-document line references inside NPC dialogue.

### 30. Quiz pass/fail threshold is invisible

In the Pattern Bureau, two correct answers out of four failed the quiz and cost
a life; in the Switchyard, two correct out of three passed it. At no point is
the player told how many answers may be wrong, and wrong answers are never
labelled as wrong, so a failure comes as a surprise.

### 31. "Download quarantined save" does nothing visibly

Clicking the button when no quarantined save exists produced no download and
no message in the log. A player cannot tell whether it worked, failed, or had
nothing to do. Invalid JSON import, by contrast, did report "That save could
not be imported."

## Priorities from the player's seat

- **Blocking:** 9 and 19/20 (no way to answer quizzes or open gates with the
  commands the UI suggests); 24 (silent loss of progress on reload); 12, 21
  and 26 (life lost on entry or from an ordinary verb without warning).
- **High:** 1, 2, 3, 7, 8, 13, 22, 25, 27 and 28 — the game leaks internal
  state, omits the commands it requires, and describes objects and rooms that
  cannot be interacted with or are out of date.
- **Medium:** 5, 6, 10, 11, 14, 15, 16, 17, 18, 23, 29, 30 and 31 — feedback,
  consistency and polish issues that make the game feel unfinished.

Overall: the underlying content and some puzzles do work (the Pattern Bureau
quiz opens the Warp Walk, the data-types puzzle solves, JSON export/import
works), but the interface does not teach the required syntax, the parser
rejects most obvious phrasings, and several mechanics silently punish
exploration. A player following the on-screen guidance would get stuck in the
first few rooms.
