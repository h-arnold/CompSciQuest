---
type: "query"
date: "2026-11-25T10:38:58.088644+00:00"
question: "Does the ES2022-safe copy-then-sort change preserve generator output and satisfy the Array#toSorted lint rule without suppressions?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["generateContent(), directoryOf(), zone1CardSet(), node-shims.d.ts"]
---

# Q: Does the ES2022-safe copy-then-sort change preserve generator output and satisfy the Array#toSorted lint rule without suppressions?

## Answer

Yes: copy-then-sort as an expression statement passes unicorn/no-array-sort (allowExpressionStatement) and ES2022 typecheck; 14 generated files byte-identical; 155 tests and 4 e2e pass.

## Outcome

- Signal: useful

## Source Nodes

- generateContent(), directoryOf(), zone1CardSet(), node-shims.d.ts