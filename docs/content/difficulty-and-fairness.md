# Difficulty and fairness

This document owns cross-content difficulty, fairness and playability guidance for
CompSciQuest. It does not define data shapes or runtime behaviour:
[content-rules.md](../developer/content-rules.md) and the subsystem contracts for
[puzzles](../developer/puzzles.md), [hints](../developer/hints.md),
[quiz combat](../developer/combat.md) and
[hazards](../developer/hazards.md) remain authoritative. Where this document and a
contract differ, the contract wins.

## 1. Authority and use

The consistent message is to make the game easy to understand and demanding to
master. Difficulty should come from interpretation, planning and resource
management, not from hidden information, ambiguous commands or apparently random
punishment. This document applies that message across rooms, items, NPCs, puzzles,
quizzes, hazards and hints. It creates no mechanic, global difficulty setting or
save feature.

Use the existing rulebook and subsystem contracts as boundaries:

- A new game starts with **three lives**. Saves are **manual**; there is no undo,
  autosave or save-slot system. Recovery comes from the authored level-start
  return and preserved progress, not from a new checkpoint feature
  ([content-rules.md §8](../developer/content-rules.md#8-fixed-contracts-content-must-use)).
- Quiz combat is the current combat system. Quizzes have no timer and retries are
  unlimited unless `attemptsAllowed` is explicitly authored. Failure follows the
  quiz's authored `onFail` effects; the standard shape loses a life and returns to
  the declared level start, while approved exceptions remain as authored
  ([combat.md §3](../developer/combat.md#3-flow),
  [content-rules.md P5](../developer/content-rules.md#p--pedagogy-and-course-mapping)).
- Hazards are telegraphed before they can fire. Their standard harm loses a life
  and returns the player to the area start; they may reset level-local flags but
  never puzzle phase
  ([hazards.md §4](../developer/hazards.md#4-failure-consequences),
  [content-rules.md H1](../developer/content-rules.md#h--hazards-and-hints)).
- A hint ladder has **2–4 levels**. No level reveals an answer or completes the
  challenge. The default score penalty is zero
  ([hints.md §4](../developer/hints.md#4-adaptive-behaviour),
  [content-rules.md H2](../developer/content-rules.md#h--hazards-and-hints)).
- The verb list, alias registry and command forms are fixed. Authors make intended
  actions discoverable within those contracts; they do not add parser behaviour,
  verbs, aliases or answer shortcuts
  ([content-rules.md §8](../developer/content-rules.md#8-fixed-contracts-content-must-use)).
- Optional difficulty settings, reduced-hint variants and extra challenge modes
  are authoring guidance or future options only. They are not current promises and
  require a separately approved design before use.

## 2. Research findings

### 2.1 Balance challenge against the player's developing skill

Flow theory links enjoyment to a balance between challenge and ability, supported
by clear goals, immediate feedback and a sense of control. Too little challenge
produces disengagement; too much produces anxiety. Different players need
different levels of support, so one static difficulty curve will not suit
everyone. [1]

**Practical implication:** teach one rule at a time, let players practise it
safely, then combine familiar rules in more demanding situations. Increase the
complexity of decisions rather than simply increasing damage or health.

**CompSciQuest application:**

- Sequence teaching, retrieval and application so prerequisites arrive before
  they are needed (P2, `PCK-LOAD`). Give the player a low-stakes opportunity to
  learn a rule before a gated or hazardous use.
- Increase demand through clearer application questions, more consequential
  choices and combinations of already-taught mechanics. Do not substitute larger
  life penalties, denser prose or more arbitrary punishment for intellectual
  demand.
- Use explanations and the existing graduated hint ladders to support different
  learners. The baseline path keeps that support available; a player-facing
  difficulty selector is not part of the current design.
- Treat optional objectives or reduced support as possible future content, not as
  a new global mode.

### 2.2 Make puzzles logically fair before making them hard

Josh Bycer distinguishes between puzzles built on the game world's internal rules
and puzzles that depend on guessing the designer's private logic. He proposes
three questions the player must always be able to answer: [2]

- What is my goal?
- What is stopping me?
- What do I have to work with?

Everything needed for a required solution should exist somewhere in the game. If
players cannot answer one of these questions, the answer is usually clearer
feedback, better clue placement or a redesigned puzzle, not merely a harder
puzzle.

**CompSciQuest application:**

- Give every locked exit or puzzle an in-fiction justification and at least two
  discoverable clues in room descriptions, NPC dialogue or item text (N6).
- Make the goal, obstacle and available resources visible through those same
  surfaces. Use registered nouns and the fixed verb list; never require a
  guess-the-verb or guess-the-noun step.
- Keep the Puzzle Dependency Graph acyclic and reachable. Puzzle prose may refer
  only to ancestors, because the player need not have solved other nodes in a
  fixed order (N7, [puzzles.md §4](../developer/puzzles.md#4-puzzle-dependency-graph)).
- When a player cannot answer one of Bycer's three questions, revise the clue,
  feedback or puzzle structure. Do not make the solution more obscure.

### 2.3 Remove accidental interface difficulty

Dennis Jerz identifies “guess the verb” problems as false puzzles: the player has
the right idea but the parser rejects a reasonable alternative. A good
implementation accepts variations such as “open box with key”, “use key on box”
and “unlock box”. [3]

For newer players, Emily Short recommends either a small, clearly advertised verb
set or a more fully supported parser. Useful techniques include: [4]

- keeping available commands visible;
- highlighting important nouns;
- accepting common alternative phrasings;
- responding meaningfully to every supported command;
- providing tutorials and dynamic hints where appropriate.

A player should never lose progress because they did not know the exact wording
the author expected.

**CompSciQuest application:**

- The examples above explain the design principle; they are not permission to add
  verbs or aliases. Work within the canonical command union and the bible's alias
  registry.
- Make important nouns physically present in room prose, item descriptions and
  NPC prompts. Use the existing hint system and in-world teaching beats rather
  than assuming a new tutorial system.
- Give every submitted command meaningful in-voice feedback. Unknown verbs and
  nouns degrade to a friendly response, never a parser error or a bare refusal
  (N5, C2).
- During a quiz, show a clear prompt and numbered options. The supported answer
  forms are `answer N`, a bare `N`, and exact option text; do not invent letter
  shortcuts ([combat.md §4](../developer/combat.md#4-commands-and-events)).
- An essential puzzle action must not depend on one exact phrase. Make the
  intended action discoverable through registered vocabulary and feedback rather
  than through trial-and-error punishment.
- Formatting must not cue an answer or promise an action the game will not honour.
  Under content-rules N10, emphasis marks a real affordance: an italic span names
  a direction the room accepts even when gated, and a bold noun resolves to
  something the player can examine or use. A gated exit may be styled italic but
  never presented as un-gated, and an unexaminable noun is never styled as
  examinable.

### 2.4 Treat hints as part of the game's design

Emily Short documents built-in tutorials, state-aware hints, per-room hints,
adjustable puzzle difficulty, multiple solutions and graded success as
established interactive-fiction approaches. [5]

A useful implementation is a graduated, spoiler-controlled hint ladder:

1. **Goal reminder:** what the player is trying to achieve.
2. **Observation:** which object, description or clue deserves attention.
3. **Connection:** how two previously discovered facts relate.
4. **Next action:** the command or decision to try.

Hints should respond to the current situation rather than dumping a walkthrough.
Players who want more challenge can suppress hints or face additional optional
objectives; players who are stuck can continue without abandoning the game.

**CompSciQuest application:**

- Author **2–4 levels**, escalating from nudge to structure to procedure. The
  final level must still leave the player to supply the answer or solve the
  puzzle; “next action” must stop before the solution (H2).
- Link each ladder through `targets` to the relevant puzzle, quiz or spec topic.
  Let the existing context resolution choose the active quiz or current room and
  topic ([hints.md §3](../developer/hints.md#3-commands-and-delivery)).
- Unlock levels only through the agreed stuck counters. Automatic hints require
  genuine evidence of being stuck: a wrong quiz answer or the configured number
  of active-puzzle turns (H3).
- Keep hints state-aware and incremental. A hint should help the player form the
  next hypothesis, not reproduce the walkthrough.
- Adjustable puzzle difficulty, multiple solutions, graded success, hint
  suppression and extra challenge objectives are research options, not current
  mechanics. Any future use needs an approved design that fits the existing
  contracts.

### 2.5 Pace information and reward partial progress

Emily Short's design advice includes: [6] and [7]

- give every puzzle some reward;
- reward intermediate steps in long puzzles;
- teach a consistent world model so later puzzles apply familiar rules;
- avoid demanding excessive memorisation or note-taking;
- avoid opening too much geography at once; her rule of thumb is roughly six or
  seven new rooms, fewer when they contain dense interactions;
- make timed challenges replayable rather than allowing one mistake to ruin the
  game.

A clue journal, objectives panel, conversation recap or map command can reduce
mechanical memory work without reducing the puzzle's intellectual challenge.

**CompSciQuest application:**

- Use the key-node spine and reconverging clusters to control geography (N2).
  Treat six or seven new rooms as a planning heuristic, not a hard limit; use
  fewer when teaching or interactions are dense.
- Reward intermediate steps through clear activation feedback, useful state
  changes, access, items or authored messages. Any score still follows the
  content-declared scoring contract; do not invent a separate partial-progress
  score (P6).
- Keep the world model consistent. Pair a world term with its formal Computer
  Science term on first use, then reuse both consistently so later challenges
  apply familiar rules.
- Recap goals and essential clues through existing room descriptions, item text,
  NPC topics, quiz explanations and hints. Do not assume that a clue journal,
  objectives panel, conversation recap or map command exists; any such interface
  is future work requiring approval.
- Keep essential clues and resources obtainable after ordinary failure. Avoid
  long repeat walks, excessive note-taking and one-use geography that turns a
  reasoning task into a memory test.
- Do not add a quiz timer. If an approved scheduled hazard supplies time pressure,
  telegraph it, preserve puzzle progress and make recovery follow the hazard
  contract rather than a new timed-mode rule.

### 2.6 Make combat readable, not trivial

Alex Kubodera's combat guidance centres on readability: players need advance
warning of danger and consistent expectations about what follows. Difficulty
should not be increased by obscuring this information. [8]

In a text adventure, this translates into:

- describing enemy intent before an attack;
- using consistent phrases for consistent threats;
- displaying both sides' health, armour, status effects and remaining resources;
- explaining why an attack failed or succeeded;
- ensuring dangerous-looking attacks have appropriately serious consequences;
- providing several viable responses: evade, defend, exploit a weakness, use an
  item or retreat.

A concise generic research example:

> The compiler locks onto your position. It will unleash a corrupting burst next
> turn unless its connection is interrupted. Your severing tool is ready.

This is more interesting than “The enemy attacks; you lose 12 integrity”, because
the player can make an informed decision.

For turn-based systems, Craig Stern recommends clarity, determinism and tactical
tools that let good planning overcome bad luck. Randomness can add tension, but a
critical encounter should not be decided by one arbitrary roll. [9]

**CompSciQuest application:**

Quiz combat is the combat system; do not introduce real-time enemy attacks,
health, armour, status-effect or weakness mechanics. Readability means:

- establish who is challenging the player, the topic under assessment and the
  consequences before the quiz begins;
- frame each question unambiguously and show its numbered options clearly;
- use plausible distractors drawn from genuine misconceptions, never nonsense
  options (P4);
- explain every answer, right or wrong, so the player understands why it worked
  or failed (P4);
- where a quiz has an assigned hint ladder, use its relevant authored hints and
  unlock them through genuine wrong-answer evidence; do not imply that every quiz
  needs a new hint sequence;
- keep failure proportionate to the authored quiz contract, with unlimited
  retries unless an attempt limit is explicitly assigned;
- use existing lives, quiz progress and message output for readability rather
  than adding combat statistics.

A project-shaped version of the research example is:

> The compiler's audit begins. Its next question asks you to choose the operation
> that interrupts the corrupting burst. The numbered options follow; your hint
> ladder is available, and every answer will be explained.

Question order may be shuffled by the seeded random system, but it stays fixed
within an attempt. The pass mark is a count, not a percentage, and no quiz timer
exists. Planning, explanations and retries should overcome initial mistakes; do
not add dice, critical hits or another arbitrary roll to a required encounter
([combat.md §§2–4](../developer/combat.md#2-model)).

### 2.7 Make failure informative and inexpensive

Failure should help the player form a better hypothesis. They should understand
what changed, what caused it and what they can try next. [10]

The research recommends keeping retry costs proportionate to the challenge:

- checkpoint immediately before important encounters;
- provide quick retry or undo;
- avoid forcing players to repeat lengthy exploration;
- do not permanently remove essential resources after a routine defeat;
- preserve progress and learning between attempts.

A hard encounter plus a slow, expensive retry loop is much more frustrating than a
hard encounter with a rapid recovery loop. These are research recommendations;
the fixed-contract adaptation below is the CompSciQuest rule.

**CompSciQuest application:**

- Use the existing manual-save, three-life and level-start contracts. Do not
  promise undo, autosave, save slots or new checkpoints, and do not make success
  depend on saving at one exact moment.
- Before a consequential quiz or hazard, provide the necessary teaching, question
  framing or telegraph and a reachable response. The level-start return is the
  existing recovery point, not a proposed checkpoint system.
- Follow the authored failure effects. The standard quiz or hazard shape loses a
  life and returns to the declared level start; approved exceptions stay as
  authored.
- Preserve learning between attempts. Quiz failure does not reset topic or puzzle
  progress; solved puzzles stay solved. A hazard may reset level-local flags but
  never puzzle phase.
- Keep quiz retries unlimited unless the editor explicitly assigns
  `attemptsAllowed`. Do not add a timer or a separate retry cost.
- Make failure text identify the cause, the consequence and a useful next
  hypothesis. Quiz explanations and hazard messages should tell the player what
  to reconsider, not merely announce punishment (N5, P4).
- Reduce repeated progress through compact loops, reconverging gates, clues
  placed before danger and essential resources that remain obtainable. Never
  permanently remove an essential resource after a routine defeat.
- When lives reach zero, the existing `game-over` and title-screen restart path
  applies. Do not add a new recovery system around it.

## 3. Practical difficulty model for CompSciQuest

Separate fairness guarantees from optional challenge. The overall model applies
general game-difficulty guidance without creating a second set of runtime rules.
[12]

### Always provide on the baseline path

- Clearly stated goals and visible obstacles.
- All essential clues obtainable through ordinary exploration, with at least two
  discoverable clues for every gate or puzzle (N6).
- A clue and objective recap through existing content surfaces, without assuming
  a new panel or command.
- Contextual, graduated hints that never reveal the answer.
- Readable quiz combat: clear framing, plausible distractors, explanations after
  every answer, relevant hints and proportionate failure consequences.
- Telegraphed hazards with a reachable response and the existing life-loss and
  level-start consequences (H1).
- Recovery that uses manual saves, three starting lives, level-start returns and
  unlimited quiz retries unless explicitly limited otherwise; no new save or
  retry feature.
- No essential solution dependent on one exact verb phrase or obscure prior
  knowledge.

### Increase difficulty through

- Combining already-taught mechanics.
- Requiring scarcer use of existing lives or items without making essential
  resources unrecoverable.
- More consequential reasoning and tactical choices within puzzles and quizzes.
- Multiple simultaneous objectives, only when the PDG and V4 trace prove there
  is no soft-lock.
- Deeper AO2 and AO3 application rather than denser wording or hidden clues.
- Optional time pressure only through separately approved content such as a
  telegraphed scheduled hazard; quizzes remain untimed.
- Fewer hints or an explicit challenge mode only as future, separately approved
  content. The current baseline keeps contextual hints available.

Because CompSciQuest is educational, keep the subject challenge but remove
accidental language and interface challenge. A pupil should not lose a life
because they missed a clue in dense prose or did not know a parser convention.

## 4. Validation guidance

The research does not establish one universal “correct” completion percentage.
Use playtesting to find where the intended audience actually stalls. PostCurious
recommends testing with beginners and experienced puzzlers, recording solving
time, stuck points and hint use, and supplying an in-game hint system during
full-game tests. [11] Emily Short similarly recommends transcripts and a mixture
of players who play naturally and testers who deliberately probe the system. [7]

For each puzzle or quiz encounter, record:

- time to first meaningful insight;
- commands or actions repeated without new information;
- hint level required;
- failed attempts and whether the next attempt changed;
- abandonment or quit points;
- whether players could explain why they succeeded or failed.

For CompSciQuest, also record:

- which clue, question wording or explanation the player used;
- whether the player found both N6 clues through ordinary exploration;
- life losses, level-start returns and repeated traversal after failure;
- whether a wrong answer or failed attempt produced a changed hypothesis;
- whether every essential action remained available through the fixed command
  set and registered aliases;
- whether the accepted V4 path and its reachability claims matched the observed
  play.

Structural validation does not measure balance. `content:validate` must pass
before independent review, but a clean validator result cannot prove that a
puzzle is understandable or that difficulty is proportionate. Use the W4 content
and PCK reviews for authored fairness and cognitive load, the V4 walkthrough for
reachability, and a W7 content playability and effectiveness review for runtime
behaviour, difficulty and fairness against this document
([content-rules.md V1–V5](../developer/content-rules.md#v--validation)).

A brief beginning `Purpose: content playability and effectiveness review`
assesses runtime behaviour, difficulty and fairness using this document. The
tester uses ordinary commands and treats the accepted trace as the expected
outcome, not as a command script. Record transcripts, stuck points, hint use and
failure explanations so findings can return to the owning writer, the bible or
the code owner.

A brief marked `Purpose: functional verification only` verifies only the named
functionality. It must not assess enjoyment, fairness, clue sufficiency or
challenge.

A useful acceptance test is: **after failure or a hint, can the player explain
what to try next and then do it?** If not, improve the feedback, clue placement,
question framing or recovery loop before increasing difficulty.

## 5. Sources

1. **Jenova Chen** — [Flow in Games (and Everything Else)](https://cacm.acm.org/opinion/flow-in-games-and-everything-else/)
2. **Josh Bycer** — [A Study Into Puzzle Design](https://www.gamedeveloper.com/design/a-study-into-puzzle-design)
3. **Dennis G. Jerz** — [Puzzles in Interactive Fiction](https://jerz.setonhill.edu/if/Puzzles.htm)
4. **Emily Short** — [Writing Novice-friendly Parser Games](https://emshort.blog/2016/04/15/writing-novice-friendly-parser-games/)
5. **Emily Short** — [Puzzles](https://emshort.blog/how-to-play/reading-if/puzzles/)
6. **Emily Short** — [Challenges of a Broad Geography](https://emshort.blog/how-to-play/writing-if/my-articles/geography/)
7. **Emily Short interview** — [pacing, world consistency and playtesting](https://www.gamedeveloper.com/design/inside-interactive-fiction-an-interview-with-emily-short)
8. **Alex Kubodera** — [Designing for Difficulty: Readability in ARPGs](https://www.gamedeveloper.com/game-platforms/designing-for-difficulty-readability-in-arpgs)
9. **Craig Stern** — [12 Ways to Improve Turn-based RPG Combat Systems](https://www.gamedeveloper.com/design/12-ways-to-improve-turn-based-rpg-combat-systems)
10. **Josh Bycer** — [The Hierarchy of Fail States](https://www.gamedeveloper.com/design/the-hierarchy-of-fail-states)
11. **PostCurious** — [Puzzle Testing Process](https://www.getpostcurious.com/post/puzzle-testing-process)
12. **Josh Bycer** — [How to Design Effective Difficulty in Video Games](https://gameworldobserver.com/2020/10/06/design-effective-difficulty-video-games)
