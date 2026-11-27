# Quiz combat

Quiz combat is an adversarial quiz: an NPC questions the player on GCSE
material. It is both a damage source and the main revision loop. This document
owns every quiz authoring and runtime rule; the `quiz-writer` must read it in
full before beginning work and its agent brief is only a workflow checklist.
Rules are cited by ID from their owning documents; the W1–W7 workflow lives in
[content-editor.md](../../.opencode/agents/content-editor.md). The exam
specification is the only source of course facts.

Rule map: [write the question first](#write-the-question-first),
[card format](#6-card-format), [review checks](#7-reviewer-and-playtest-checks)
and [acceptance](#8-agent-acceptance).

## Write the question first

A question tests a spec-backed idea, not a trick of wording. Draft the stem,
the misconception each wrong option targets and the explanation before writing
`correctOptionIds`, `passMark` or effects. The MUST/SHOULD/MUST NOT labels and
finding severity are defined under [review labels](content-toolchain.md#review-labels).

Apply the rules in this reading order: P4; P3; P5; N3/N4/N5; D1–D4.

| ID  | Test              | MUST                                                                                                                                                                                          | SHOULD                                                                                                                                                  | MUST NOT                                                                             | Related        |
| --- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------- |
| P4  | Plausible options | Build every distractor from a real misconception in the spec and record it under `authoring.misconception`. Give every answer an explanation of the key and, where useful, the chosen option. | Keep options equal in length, grammar and format; keep the stem lean. Let difficulty come from a misconception or a small scenario, not obscure trivia. | Use nonsense options, a giveaway length or grammar cue, or leak the key in the stem. | PCK-DISTRACTOR |
| P3  | Objectives        | Tag every question `authoring.assessmentObjective` (AO1/AO2/AO3) and `authoring.difficulty`; each quiz has at least one AO1 and one AO2.                                                      | Use AO3 only for design/evaluation topics such as algorithms and SDLC.                                                                                  | Ask an evaluation question of a recall topic.                                        | PCK-AO         |
| P5  | Retrieval loop    | Use a `passMark` count between 1 and the question count, unlimited retries unless the brief assigns `attemptsAllowed`, and no timer.                                                          | Let failure cost one life and return to `definition.startRoomId` without resetting topic or puzzle progress.                                            | Imply a clock, reset progress, or invent a retry policy.                             | §3             |
| N3  | Diegetic learning | Frame the challenge as an in-world character's question.                                                                                                                                      | Let the explanation improve the next attempt.                                                                                                           | Stop the story to ask a bare question.                                               | N4             |
| N4  | Voice             | Keep the prompt and explanation in second person, present tense and the bible register.                                                                                                       | Aim command words at the tagged objective.                                                                                                              | Use parser or engine vocabulary.                                                     | N5             |
| D3  | Data shape        | Use 0-based `correctOptionIds` within range and effects only from the shared union; `onPass` sets `quiz-passed:<quizId>` and emits `complete-topic`.                                          | Check `1 <= passMark <= questionIds.length` before finishing.                                                                                           | Write score, use a percentage pass mark, or invent an effect kind.                   | §2             |

**Example — a binary distractor set.** For denary 13 in 4-bit binary, options
`1011`, `1101`, `1110`, `1100`: each wrong option is a real reversed-bit or
off-by-one slip, with a misconception note. The explanation follows selection.

**Non-example — a giveaway.** Options `1101`, `banana`, `1110`, `1100` let a
pupil who knows nothing guess by elimination.

## 1. Scope

A quiz starts from a `ConversationNode` special topic through the `start-quiz`
effect, reusing the [conversation plumbing](npcs.md). Enough correct answers
completes the mapped spec topic and scores points; failing costs a life and can
return the player to the start of the level.

## 2. Model

```ts
// src/core/combat/Quiz.ts — declarative definition
export interface Quiz {
  readonly id: string;
  readonly actorId: string; // who is asking
  readonly topicId: string; // SpecTopic id from COVERAGE.md
  readonly score: number; // awarded once on pass, 0 if not scoreable
  readonly questionIds: readonly string[]; // content order; shuffled with Random
  readonly passMark: number; // count, 1..questionIds.length
  readonly onPass: readonly Effect[]; // complete-topic + set-flag + message
  readonly onFail: readonly Effect[]; // change-lives + move-player + message
  readonly hintSequenceId?: string; // omitted when no hints
  readonly attemptsAllowed?: number; // omitted for unlimited retries
}

// src/core/combat/QuizQuestion.ts
export interface QuizQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly string[]; // shown numbered 1..n
  readonly correctOptionIds: readonly number[]; // 0-based indices into options
  readonly explanation: string; // shown after every answer
}
```

`passMark` is a count, not a percentage. Quizzes are authored in
`docs/content/<area>/quizzes.yaml` and generated into
`src/content/authored/quizzes.ts` as `ContentBundle.quizzes`; the
[content toolchain](content-toolchain.md) owns generation of the bundles.

The authoring gates (`content-ids` for the topic reference, `quiz-content` for
the marks and options) reject a quiz with `passMark < 1`, a `passMark` above
`questionIds.length`, a question with no correct option, or an unknown
`topicId` (`npm run content:validate`). The runtime mirrors are deferred.

`QuizStateDto` is defined in
[storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).

## 3. Flow

1. A conversation topic applies `start-quiz`, which exits the current node.
   `start-quiz` compares `quizAttempts[quizId]` with `attemptsAllowed`: when the
   attempts are exhausted it emits a friendly message and starts nothing, and
   otherwise it increments the count
   ([storage-schema.md §5](storage-schema.md#5-quiz-attempts)). A `start-quiz`
   effect begins an attempt only when no quiz is active: a repeated or mid-quiz
   `start-quiz` neither replaces the active attempt nor increments
   `quizAttempts`. After `end-quiz` clears the active attempt, the same quiz may
   be started again.
2. `start-quiz` creates `QuizStateDto`, shuffles `questionIds` with the injected
   `Random`, and emits `quiz-started`. Question order is fixed for the attempt;
   [shared-rules.md §7](shared-rules.md#7-random-port) owns the seed contract.
   A retry's `quiz-started` clears the previous attempt's hints from the view
   ([hints.md §3](hints.md#3-commands-and-delivery),
   [application-and-ui.md §7.2](application-and-ui.md#72-view-data)).
3. Emit `question-asked` with the prompt and numbered options. The UI's
   `QuizPanel` renders them as text.
4. The player answers using an accepted form (§4), for example `answer 2`. The
   command carries the **1-based** option; `QuizSystem` converts it to the 0-based
   choice index before evaluating. `EffectApplier` records the choice and
   emits `answer-evaluated` with `correct` and `explanation`; the handler also
   returns `ask-question` while questions remain or `end-quiz` to finish
   ([application-and-ui.md §9](application-and-ui.md#9-effect-to-event-mapping)).
   An out-of-range answer gets a friendly message and does not advance the quiz.
   The `QuizView` wrong-answer allowance is derived from `passMark` and the
   live attempt's `answers`/`correctCount`
   ([application-and-ui.md §7.2](application-and-ui.md#72-view-data)).
5. On finish, emit `quiz-ended` with `passed`, then omit `activeQuizId` and
   reset `index`, `correctCount` and `answers` for the next attempt. Apply
   `onPass` or `onFail` effects through `EffectApplier`.
6. `onPass` normally includes `complete-topic` for `topicId` and
   `set-flag('quiz-passed:<quizId>', true)`; the flag backs the `quiz-passed`
   condition ([shared-rules.md §3](shared-rules.md#3-condition)). A pass scores
   once on the first false→true transition of the flag, and only covered,
   evidenced topics are scoreable
   ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)).
   Content that can be retried must set `quiz-passed:<quizId>` in `onPass`.
7. `onFail` normally includes `change-lives` and `move-player` back to the level
   start declared in content. When lives reach zero, `Session` emits `game-over`.
   Partial topic progress is not reset — only position and lives change.
8. On `quiz-ended`, the actor returns to its declared `initialStateId`. Content
   that needs a different state applies `set-actor-state` in
   `onPass`/`onFail`.

## 4. Commands and events

The `answer` variant is defined in the canonical `Command` union in
[application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs).
The accepted forms are `answer N`, a bare `N`, and exact option text, where `N`
is the 1-based number shown beside each option (the answer step in [§3](#3-flow)).
Only these forms are accepted: there are no letter shortcuts. A bare number
outside a quiz takes the `unknown` path.

`answer` outside a quiz is allowed and emits a friendly "nobody asked you
anything" message. Quizzes have no time limit: the game is turn-based, and no
clock exists in core.

The quiz events (`quiz-started`, `question-asked`, `answer-evaluated`,
`quiz-ended`) belong to the canonical union in
[application-and-ui.md §6](application-and-ui.md#6-canonical-event-union-and-rendering);
their rendering is specified in
[§6.1](application-and-ui.md#61-event-to-view-mapping). All text is rendered
with `textContent`; option lists are built from data, never HTML strings, and
`QuizPanel` offers no clickable buttons
([application-and-ui.md §7.2](application-and-ui.md#72-view-data)).

## 5. Hints

If `hintSequenceId` is set, the `hint` command ([hints](hints.md)) is available
during a quiz. A wrong answer increments `failed-attempts:<quizId>`
([storage-schema.md §4](storage-schema.md#4-counters-and-stuckness)), which can
unlock a level or trigger an automatic hint in phase 4. A `show-hint` effect
emits `hint-penalty-applied`, which `ScoreTracker` applies
([application-and-ui.md §9](application-and-ui.md#9-effect-to-event-mapping)); a
hint never awards score.

## 6. Card format

`quizzes.yaml` holds `quizzes` and `questions` per area. This is a partial
excerpt; generation is owned by [content-toolchain.md](content-toolchain.md).

```yaml
kind: quiz
areaId: 1-1-computer-architecture
status: draft
topicIds: [fetch-decode-execute]

quizzes:
  - id: quiz-fde-cycle
    actorId: npc-archivist
    topicId: fetch-decode-execute
    score: 2 # awarded once on pass; counts towards topic maxScore
    questionIds: [q-fde-1, q-fde-2, q-fde-3]
    passMark: 2
    onPass:
      - { kind: complete-topic, topicId: fetch-decode-execute }
      - { kind: set-flag, flag: quiz-passed:quiz-fde-cycle, value: true }
      - { kind: message, text: ... }
    onFail:
      - { kind: change-lives, delta: -1, reason: ... }
      - { kind: move-player, roomId: room-cpu-lab, reason: ... }
    hintSequenceId: hint-fde

questions:
  - id: q-fde-1
    prompt: >-
      ...
    options: [...]
    correctOptionIds: [1] # 0-based indices; UI shows 1-based
    explanation: >-
      ...
    authoring:
      assessmentObjective: AO1 # P3
      difficulty: easy # P3
      misconception: ... # P4
```

## 7. Reviewer and playtest checks

`content-critic` applies the table above, checks AO mix, distractor plausibility
and explanations, and verifies the V4 trace names every quiz and question.
`pck-reviewer` checks every key and distractor against the spec and judges GCSE
depth and cognitive load. `play-tester` confirms in W7 that readability,
feedback and retry friction give a fair challenge.

## 8. Agent acceptance

### 8.1 Definition of done

- Only `quizzes.yaml` changed; document metadata is valid and every quiz and
  question is an entry in `quizzes` or `questions`, with prose in block scalars.
- `1 <= passMark <= questionIds.length`; each question has at least three
  options and every `correctOptionIds` value is within range.
- Every question has a non-empty `explanation`, `authoring.misconception`,
  `authoring.assessmentObjective` and `authoring.difficulty`; each quiz has at
  least one AO1 and one AO2 question.
- `onPass` sets `quiz-passed:<quizId>` with `set-flag` and emits
  `complete-topic`; `onFail` includes `change-lives` and `move-player` to
  `definition.startRoomId`.
- Every factual claim and key cites a section or page of
  `docs/exam-specs/wjec-unit1.md`; no timer is implied and no answer is revealed
  before selection.
- The report explains why difficulty is fair, how feedback and hints improve
  the next attempt, and why failure and retry costs are proportionate.
- The final report names the file path, quiz and question IDs, AO mix, the
  readability and retry-friction check and flagged assumptions.

### 8.2 Hard constraints and escalation

Return `BLOCKED: <reason> — needs <owner>` rather than guessing when the spec
does not support a proposed answer, the brief omits `startRoomId`, or
`attemptsAllowed` conflicts with the unlimited-retry default in this document.
After a review round, revise only your own card for at most two rounds; then
return `BLOCKED: <finding> requires <owner>` and let the editor resolve it.

## 9. Gates

The `quiz-content` authoring gate checks the pass mark and question ids, a
correct option in range, a non-empty explanation, AO and difficulty metadata,
at least one AO1 and AO2, `quiz-passed` and `complete-topic` in `onPass`, and
`change-lives` in `onFail`
([content-toolchain.md §4](content-toolchain.md#4-validation)).
