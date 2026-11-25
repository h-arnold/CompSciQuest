---
type: "query"
date: "2026-11-25T07:08:02.953692+00:00"
question: "Which canonical node owns content validation for the YAML-first toolchain red tests?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["validateContent()"]
---

# Q: Which canonical node owns content validation for the YAML-first toolchain red tests?

## Answer

The canonical node is validateContent() at src/content/validateContent.ts:L246, with the eight shared gate helpers (catalogueIds, aliasProblems, roomReferenceProblems, ownerProblems, referenceProblems, specTopicsOf, scoreValidityProblems, budgetProblems, coverageProblems) and DEFERRED_GATES at L25; loadContent() at src/content/index.ts:L7 must assemble from src/content/authored/ without YAML; tools/content/* does not exist yet.

## Outcome

- Signal: useful

## Source Nodes

- validateContent()