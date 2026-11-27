---
type: "query"
date: "2026-11-26T22:08:37.562350+00:00"
question: "Why do 11 unrelated e2e tests fail on the port-5224 run?"
contributor: "graphify"
outcome: "dead_end"
source_nodes: ["engine-issue-9-quick-answers.spec.ts,engine-issue-11.spec.ts,engine-issue-25.spec.ts,QuizPanel,ScorePanel,helpers.ts"]
---

# Q: Why do 11 unrelated e2e tests fail on the port-5224 run?

## Answer

Nine failures pin other worktree ports in spec files (engine-issue-2-help.spec.ts 5202, engine-issue-11.spec.ts 5211, engine-issue-25.spec.ts 5225). Two engine-issue-9 tests wait for the internal line 'Quiz quiz-switchyard started.', which is suppressed by the settled issue-8 formatEvent change and is unrelated to this persistence slice. Graph query did not expose hard-coded ports; raw spec lines confirmed them.

## Outcome

- Signal: dead_end

## Source Nodes

- engine-issue-9-quick-answers.spec.ts,engine-issue-11.spec.ts,engine-issue-25.spec.ts,QuizPanel,ScorePanel,helpers.ts