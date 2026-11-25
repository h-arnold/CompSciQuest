---
type: "query"
date: "2026-11-25T10:09:21.654919+00:00"
question: "Who owns directory-path declaration ordering for generated catalogues, and how should a slash-less root card path be grouped?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["directoryOf(),generateContent(),OUTPUTS,normalisedCards()"]
---

# Q: Who owns directory-path declaration ordering for generated catalogues, and how should a slash-less root card path be grouped?

## Answer

directoryOf() in tools/content/generate.ts:L134 is the sole owner; a slash-less path must group under the empty/root directory ('') so spec-topics.yaml sorts before area-directory cards per content-toolchain.md §5 and shared-rules.md §11

## Outcome

- Signal: useful

## Source Nodes

- directoryOf(),generateContent(),OUTPUTS,normalisedCards()