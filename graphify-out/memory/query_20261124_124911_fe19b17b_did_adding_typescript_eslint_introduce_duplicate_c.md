---
type: "query"
date: "2026-11-24T12:49:11.185967+00:00"
question: "Did adding typescript-eslint introduce duplicate canonical configs or cross-layer edges?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["eslint.config.js", "typescript-eslint", "devDependencies"]
---

# Q: Did adding typescript-eslint introduce duplicate canonical configs or cross-layer edges?

## Answer

No. New nodes typescript-eslint and typescript-eslint@^8.74.0 live in the Build Tooling and Linting community; eslint.config.js imports it at L5; no new src/core/application/ui edges or cycles.

## Outcome

- Signal: useful

## Source Nodes

- eslint.config.js
- typescript-eslint
- devDependencies