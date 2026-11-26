---
type: "query"
date: "2026-11-26T20:19:13.876828+00:00"
question: "Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["enterSwitchFloorQuiz(),questions.ts,quizzes.ts,questionAskedEvent()"]
---

# Q: Which authored question prompt should enterSwitchFloorQuiz() wait for in the merged app (q-dr-01 or another)?

## Answer

quiz-started is suppressed in formatEvent(); question-asked renders the authored prompt. EffectApplier.startQuiz() shuffles quiz.questionIds via shuffleQuestionIds(), so quiz-switchyard's first question is not reliably q-dr-01. Re-anchor by polling the transcript for any authored prompt from quiz-switchyard's questionIds (import questions and quizzes), keeping the quiz-panel assertion intact.

## Outcome

- Signal: corrected

## Source Nodes

- enterSwitchFloorQuiz(),questions.ts,quizzes.ts,questionAskedEvent()