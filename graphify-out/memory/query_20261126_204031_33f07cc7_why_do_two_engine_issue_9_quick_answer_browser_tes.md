---
type: "query"
date: "2026-11-26T20:40:31.704714+00:00"
question: "Why do two engine-issue-9 quick-answer browser tests fail on the engine-issue-16 branch?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["engine-issue-9-quick-answers.spec.ts", "helpers.ts", "waitForLine()"]
---

# Q: Why do two engine-issue-9 quick-answer browser tests fail on the engine-issue-16 branch?

## Answer

They wait for 'Quiz quiz-switchyard started.' but the current authored content opens the quiz through 'ask foreman about switch-to-bit', so no such transcript line is emitted. Content drift outside this slice; 5 other tests in that spec pass.

## Outcome

- Signal: useful

## Source Nodes

- engine-issue-9-quick-answers.spec.ts
- helpers.ts
- waitForLine()