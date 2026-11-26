---
type: "query"
date: "2026-11-26T10:53:20.000801+00:00"
question: "Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["TopicSelection.ts,findDeclaredObjectPhrase(),topic-loomwright-welcome"]
---

# Q: Why did 'ask loomwright about welcome' answer with the pseudo-code text in the Bureau?

## Answer

Correction: 'welcome' is not a keyword of topic-loomwright-welcome (keywords hello/morning/bore da/hi). The phrase resolved to the declared object algorithms-and-pseudocode and the exact-object rule selected topic-loomwright-pseudocode. Re-running with 'ask loomwright about hello' produced the welcome prose, then 'algorithms and pseudocode' produced learn-topic + node-loomwright-demonstration, then 'shapes' produced the shapes prose. Not an app defect.

## Outcome

- Signal: corrected

## Source Nodes

- TopicSelection.ts,findDeclaredObjectPhrase(),topic-loomwright-welcome