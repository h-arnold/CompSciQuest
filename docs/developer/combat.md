# Quiz combat (design)

Status: planned · Last updated: 2026-11-24

Part of the CompSciQuest design set: [architecture](architecture.md) ·
[shared rule spine](shared-rules.md) · [NPCs](npcs.md) · [hazards](hazards.md) ·
[puzzles](puzzles.md) · [hints](hints.md).

## 1. Scope

There is no stat-based combat. "Combat" here is an **adversarial quiz**: an NPC
questions the player on GCSE material. Enough correct answers completes the
mapped spec topic and scores points; failing costs a life and can return the
player to the start of the level. This is both a damage source and the main
revision loop.

Quiz combat is planned for v1 and reuses the [conversation plumbing](npcs.md): a
quiz starts from a `ConversationNode` special topic via the `start-quiz` effect.

## 2. Model

```ts
// src/core/combat/Quiz.ts — declarative definition
export interface Quiz {
  readonly id: string;
  readonly actorId: string;                 // who is asking
  readonly topicId: string;                 // SpecTopic id from COVERAGE.md
  readonly questionIds: readonly string[];  // content order; shuffled with Random
  readonly passMark: number;                // count, 1..questionIds.length
  readonly onPass: readonly Effect[];       // complete-topic + set-flag + message
  readonly onFail: readonly Effect[];       // change-lives + move-player + message
  readonly hintSequenceId?: string;         // omitted when no hints
  readonly attemptsAllowed?: number;        // omitted for unlimited retries
}

// src/core/combat/QuizQuestion.ts
export interface QuizQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly string[];      // shown numbered 1..n
  readonly correctOptionIds: readonly number[]; // 0-based indices into options
  readonly explanation: string;             // shown after every answer
}
```

Content validation rejects a quiz with `passMark < 1`, `passMark >
questionIds.length`, no correct option on a question, or an unknown `topicId`.
Definitions live in `src/content/quizzes/`; `QuizCatalogue` resolves IDs.

`QuizStateDto` is defined in
[shared-rules.md §8](shared-rules.md#8-state-additions--schema-stays-v1).

## 3. Flow

1. A conversation topic applies `start-quiz`, exiting the current node. Before
   starting, check `attemptsAllowed`: if exhausted, emit a friendly message and
   do not start. Otherwise increment `attempts` at quiz start.
2. `QuizSystem` creates `QuizStateDto`, optionally shuffles `questionIds` using
   the injected `Random` port (shared spine §7), and emits `quiz-started`.
3. Emit `question-asked` with the prompt and numbered options. The UI's
   `QuizPanel` renders them as text.
4. The player enters `answer 2`. The handler treats this as **1-based**, stores
   `option = N - 1`, records the choice, emits `answer-evaluated` with `correct`
   and `explanation`, and either advances `index` or finishes the quiz. An
   out-of-range number gets a friendly message and does not consume the turn's
   answer.
5. On finish, emit `quiz-ended` with `passed`, then **omit** `activeQuizId` from
   the DTO and reset `index`, `correctCount` and `answers` for the next attempt.
   Apply `onPass` or `onFail` effects through `EffectApplier`.
6. `onPass` normally includes `complete-topic` for `topicId` and
   `set-flag('quiz-passed:<quizId>', true)` — that flag backs the `quiz-passed`
   condition in shared-rules.md §3. `ScoreTracker` awards points under the usual
   covered+evidence rule.
7. `onFail` normally includes `change-lives` (loss of a life) and `move-player`
   back to the level start declared in content. If lives reach zero, `Session`
   emits `game-over`. Partial topic progress is **not** reset — only position
   and lives change.
8. On `quiz-ended`, the actor returns to its `ready` state. Content needing a
   different state can apply `set-actor-state` in `onPass`/`onFail`.

## 4. Commands and events

New core `Command` variant:

```ts
| { readonly kind: 'answer'; readonly option: number } // 0-based after parsing
```

`answer N` is 1-based in the UI; the parser stores `option = N - 1`. Option-text
keywords are accepted as aliases. `answer` outside a quiz is allowed and emits a
friendly "nobody asked you anything" message. There is **no time limit** — the
game is turn-based, and no clock exists in core.

Events are defined in [shared-rules.md §9](shared-rules.md#9-event-additions):
`quiz-started`, `question-asked`, `answer-evaluated`, `quiz-ended`. All text is
rendered with `textContent`; option lists are built from data, never HTML strings.

## 5. Randomness and determinism

Question order uses the seeded `Random` port from the shared spine. The seed
advances on each draw and is saved in `GameStateDto.rngSeed`, so reloading a save
reproduces the same order. Tests inject a fake `Random` with fixed values. There
is no `Math.random()` in core.

## 6. Hints

If `hintSequenceId` is set, `hint` ([hints](hints.md)) is available during a
quiz. A wrong answer increments `failed-attempts:<quizId>`, which can unlock a
hint or trigger an automatic hint in phase 4. Hints do not award score; an
optional penalty is handled by `ScoreTracker` via `hint-penalty-applied`.

## 7. Tests

- Quiz starts from a conversation topic's `start-quiz` effect.
- `attemptsAllowed` is checked before starting; `attempts` increments at start.
- Correct/incorrect answers update `correctCount` and `answers` correctly;
  `answer 1` maps to option index `0`.
- Pass path emits `quiz-ended(passed)`, sets `quiz-passed:<quizId>` and emits
  `topic-completed` once.
- Fail path loses a life, moves the player to the level start and emits
  `room-entered`; zero lives emits `game-over`.
- `activeQuizId` is omitted after `quiz-ended`, and a second quiz can start.
- `passMark` boundary (exactly passMark correct) behaves as specified; content
  with `passMark: 0` is rejected.
- Seeded question order is identical across save/load.
- Invalid content (no correct option, unknown topic) is rejected at load.

## 8. Decisions resolved

- No per-question timer; answering is turn-based.
- `answer` outside a quiz gives a friendly message, never a parser error.
- A failed quiz resets position and lives only, never topic progress.
- `passMark` is a count, not a percentage.
- `livesOnFail` was removed; `onFail`'s `change-lives` effect is the single
  source of life loss.
