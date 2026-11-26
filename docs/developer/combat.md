# Quiz combat

Quiz combat is an adversarial quiz: an NPC questions the player on GCSE
material. It is both a damage source and the main revision loop. The
[developer documentation index](README.md) lists the other subsystem docs.

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
   ([storage-schema.md §5](storage-schema.md#5-quiz-attempts)).
2. `start-quiz` creates `QuizStateDto`, shuffles `questionIds` with the injected
   `Random`, and emits `quiz-started`. Question order is fixed for the attempt;
   [shared-rules.md §7](shared-rules.md#7-random-port) owns the seed contract.
3. Emit `question-asked` with the prompt and numbered options. The UI's
   `QuizPanel` renders them as text.
4. The player answers using an accepted form (§4), for example `answer 2`. The
   command carries the **1-based** option; `QuizSystem` converts it to the 0-based
   choice index before evaluating. `EffectApplier` records the choice and
   emits `answer-evaluated` with `correct` and `explanation`; the handler also
   returns `ask-question` while questions remain or `end-quiz` to finish
   ([application-and-ui.md §9](application-and-ui.md#9-effect-to-event-mapping)).
   An out-of-range answer gets a friendly message and does not advance the quiz.
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
