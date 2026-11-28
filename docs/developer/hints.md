# Hints

Hint ladders are a first-class mechanic: this is a revision tool, so helping a
stuck student is part of the product. Hints escalate in levels and can be
unlocked by evidence that the player is stuck. This document owns every hint
authoring and runtime rule; the `hint-writer` must read it in full before
beginning work and its agent brief is only a workflow checklist.
Rules are cited by ID from their owning documents; the W1–W7 workflow lives in
[content-editor.md](../../.opencode/agents/content-editor.md).

A ladder is designed last, after the puzzle it targets is pinned, because a
hint's target is a puzzle ID. See the
[design stages](../../.opencode/agents/content-editor.md#design-stages-w1w2).

Rule map: [write the ladder first](#write-the-ladder-first),
[card format](#6-card-format), [review checks](#7-reviewer-and-playtest-checks)
and [acceptance](#8-agent-acceptance).

## Write the ladder first

A ladder helps the player work out the answer; it never supplies it. Draft the
stalled step and the sequence of nudges before choosing unlock keys or
cooldowns. The MUST/SHOULD/MUST NOT labels and finding severity are defined under
[review labels](content-toolchain.md#review-labels).

Apply the rules in this reading order: H2; H3; P6; N4; D1–D4.

| ID  | Test               | MUST                                                                                                                         | SHOULD                                                                                                                                                                                                              | MUST NOT                                                                           | Related |
| --- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------- |
| H2  | Escalating ladder  | Give each sequence 2–4 levels that escalate nudge → structure → procedure. No level reveals the answer or solves the puzzle. | Restate the goal, direct attention to an observation, connect known clues, then give a procedure that still leaves the answer to the player. Name the principle before the next move; do not dictate the keystroke. | Skip a rung, hand over the final step, or repeat solved work.                      | H3, P2  |
| H2a | Context            | Include at least one spec topic ID in `targets`, plus the puzzle or quiz ID where relevant.                                  | Name the stalled step the ladder addresses.                                                                                                                                                                         | Attach a ladder to a hazard or target only an internal ID.                         | P1      |
| H3  | Adaptive behaviour | Use only the agreed counter keys for `unlock` and set `autoOfferAfter` only where genuine stuck evidence exists.             | Use `cooldownTurns` for repeated explicit requests.                                                                                                                                                                 | Offer help on attempt one or set a threshold the player reaches while progressing. | §4      |
| P6  | Score integrity    | Omit `scorePenalty` unless the brief opts in; never write score yourself.                                                    | Record the penalty rationale in the brief.                                                                                                                                                                          | Award or deduct score directly in a card.                                          | §5      |
| N4  | Voice and safety   | Write plain, textContent-safe prose in the bible voice.                                                                      | Keep the tone of a calm prompt rather than a rebuke.                                                                                                                                                                | Include HTML or engine vocabulary.                                                 | N9      |

**Example — a three-rung ladder.** "What changes on each pass?" → "Write down
the value after each iteration." → "Draw a table and fill one row." The final
answer is still the player's work.

**Non-example — an answer leak.** "The variable ends at 4 and the output is 4,
3, 2, 1." The ladder has solved the task.

## 1. Scope

A hint ladder is a `HintSequence`: an ordered set of levels with unlock
conditions. `HintSystem` delivers the next level on an explicit `hint` or
automatically when a stuck counter reaches its threshold. It never writes score,
puzzle or quiz state.

## 2. Model

```ts
// src/core/hints/HintSequence.ts — declarative definition
export interface HintLevel {
  readonly level: number; // 1-based
  readonly text: string;
  readonly unlock: Condition; // shared spine §3
  readonly scorePenalty?: number; // omitted = 0; see §5
}

export interface HintSequence {
  readonly id: string;
  readonly targets: readonly string[]; // puzzle / quiz / topic ids
  readonly levels: readonly HintLevel[];
  readonly autoOfferAfter?: number; // failed attempts or stuck turns
  readonly cooldownTurns?: number; // minimum turns between requests
}
```

`targets` links a ladder to puzzle, quiz, room and spec-topic IDs so
`HintSystem` can resolve context ([§3](#3-commands-and-delivery)). Hints are
authored in `docs/content/<area>/hints.yaml` and generated into
`src/content/authored/hints.ts` as `ContentBundle.hints`. `HintSystem` resolves
a target through `bundle.hints.all` by sequence ID or by membership in
`targets`.

`HintStateDto` (`levelsShown`, `lastShownTurn?`) is defined in
[storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).

A level's `unlock` is a `Condition`, usually `counter-at-least` on one of the
shared counter keys
([storage-schema.md §4](storage-schema.md#4-counters-and-stuckness)).

## 3. Commands and delivery

The `hint` variant is defined in the canonical `Command` union in
[application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs).
Its optional `targetId` is omitted when there is no explicit context.

Context resolution order:

1. an explicit `targetId` (if given), which must resolve to a sequence; an
   explicit target does not fall through to the next context;
2. the active quiz (`QuizStateDto.activeQuizId`), through the quiz's
   `hintSequenceId` or a sequence that targets the quiz ID;
3. the current room — a `HintSequence` whose `targets` includes that room's ID
   or one of its mapped spec topics.

An explicit `targetId` is a context ID supplied by the caller. The terminal's
`hint` command is normally typed with no argument. A typed argument is resolved
through the ordinary name resolver, whose aliases cover items, actors and
scenery rather than hint, quiz, puzzle or topic IDs; an unresolved phrase is
treated as a bare `hint` and resolved by the context order above, so an
unrecognised word never produces a parser error.

When a sequence resolves, `HintSystem` shows the lowest-numbered level that is
unlocked and has not been shown; independent unlock conditions never skip a
lower unshown level. With no resolved sequence it emits a friendly "no hints
available here" message.

Repeated requests are rate-limited: after a hint shown on an earlier turn, a
request before `cooldownTurns` turns have passed returns a short "think about it
for a moment" message. A hint already shown this turn is not repeated: the
command produces no new output.

Explicit delivery runs in **phase 4**, after the puzzle system, so a puzzle
solved in the same turn is reported before its hint
([application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures)).
The phase-3 dispatch for `hint` emits no effects. `hint-shown` is in the
canonical union in
[application-and-ui.md §6](application-and-ui.md#6-canonical-event-union-and-rendering);
`HintPanel` renders it with `textContent`.

A `quiz-started` for a new attempt clears hints from the **view** only: until a
fresh `hint-shown` arrives, `GameViewData.hints` is empty
([application-and-ui.md §7.2](application-and-ui.md#72-view-data)). Persisted
`HintStateDto` records, hint penalties and cooldown counters are unchanged, and
a blocked retry that emits no `quiz-started` leaves the visible hint in place
([combat.md §3](combat.md#3-flow)).

## 4. Adaptive behaviour

Explicit delivery is the `hint` command. Automatic delivery applies when
`autoOfferAfter` is set and the relevant stuck counter reaches it; `HintSystem`
then applies a `show-hint` effect in phase 4. A turn whose command is `hint`
skips automatic delivery.

- **Quiz trigger.** A wrong answer increments `failed-attempts:<quizId>`, and the
  ladder offers a level on a turn whose batch contains an incorrect
  `answer-evaluated` for that quiz. A later turn with no wrong answer offers
  nothing.
- **Puzzle trigger.** Each active puzzle's `turns-since:<puzzleId>` counter
  advances every turn. The ladder offers a level once, on the turn the counter
  reaches `autoOfferAfter`; a counter that stays above the threshold never
  triggers again.

Each trigger delivers at most one level, and a hint shown this turn is not
delivered again by a later pass in the same turn. Further levels remain
available through an explicit `hint`, subject to `cooldownTurns`. Automatic
hints emit the same `hint-shown` event, so the UI needs no special case and they
also lift the view suppression from §3.

**There is no "reveal the answer" level**: even the final hint is a nudge or
instruction, and the player must still supply an answer to pass a quiz.

## 5. Score interaction

The default `scorePenalty` is 0. A `show-hint` effect always emits `hint-shown`
and `hint-penalty-applied`; the delta is 0 when the level declares no penalty.
`HintSystem` never writes score, and `ScoreTracker` applies the delta
([application-and-ui.md §9](application-and-ui.md#9-effect-to-event-mapping)).

## 6. Card format

`hints.yaml` holds `hintSequences` per area. This is a partial excerpt;
generation is owned by [content-toolchain.md](content-toolchain.md).

```yaml
kind: hint
areaId: 1-1-computer-architecture
status: draft
topicIds: [fetch-decode-execute, data-representation]

hintSequences:
  - id: hint-fde
    targets: [fetch-decode-execute, puzzle-unlock-cache]
    levels:
      - level: 1
        text: >-
          ... # nudge
        unlock:
          {
            kind: counter-at-least,
            key: failed-attempts:quiz-fde-cycle,
            value: 1,
          }
      - level: 2
        text: >-
          ... # structure, then procedure; never the answer
        unlock:
          {
            kind: counter-at-least,
            key: turns-since:puzzle-unlock-cache,
            value: 3,
          }
    cooldownTurns: 2
```

## 7. Reviewer and playtest checks

`content-critic` applies the table above and checks that each rung is strictly
less revealing than the next, that no level gives the answer, and that the V4
trace names every hint target. `pck-reviewer` checks course facts, command words
and GCSE reading load only. `play-tester` confirms in W7 that a ladder targets
the real stalled step and that automatic help arrives only after genuine stuck
evidence.

## 8. Agent acceptance

### 8.1 Definition of done

- Only `hints.yaml` changed; document metadata is valid and every sequence is an
  entry in `hintSequences`, with hint text in block scalars.
- Each sequence has 2–4 levels in ascending order, each strictly less revealing
  than the next, and none reveals the answer or solves the puzzle.
- Each ladder addresses a named stalled step, follows the
  goal/observation/connection/procedure progression within its levels, and
  leaves the final answer to the player.
- `targets` include at least one spec topic ID plus the puzzle or quiz ID;
  `unlock` keys come only from `hints-shown:<hintId>`,
  `failed-attempts:<quizId>` or `turns-since:<puzzleId>`.
- The card or brief names the system that increments each referenced counter;
  a counter with no producing card is flagged for the editor.
- `cooldownTurns` is set for explicit requests; `autoOfferAfter` appears only
  with genuine stuck evidence; `scorePenalty` is omitted unless the brief
  authorises it; no hazard is targeted.
- The final report names the file path, hint and target IDs, the fairness check
  for each ladder and flagged assumptions.

### 8.2 Hard constraints and escalation

Return `BLOCKED: <reason> — needs <owner>` rather than guessing when the
unlocking counter is produced by no other card, or the brief asks for an
answer-revealing final level. After a review round, revise only your own card
for at most two rounds; then return `BLOCKED: <finding> requires <owner>` and
let the editor resolve it.

## 9. Gates

The `hint-content` authoring gate checks 2–4 ascending levels, unlock keys from
the counter namespaces, resolving targets, non-revealing text and a zero or
absent penalty ([content-toolchain.md §4](content-toolchain.md#4-validation)).
