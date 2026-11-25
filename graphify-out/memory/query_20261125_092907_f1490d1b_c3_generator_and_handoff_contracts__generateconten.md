---
type: "query"
date: "2026-11-25T09:29:07.979193+00:00"
question: "C3 generator and handoff contracts: generateContent(), indentJson(), emitCatalogue(), stripAuthoring(), loadContent(), createInitial(), stubBundle, validateContent(), GeneratedFile, specTopics, parsedSet(), topicHeadings()"
contributor: "graphify"
outcome: "useful"
source_nodes: ["generateContent(),indentJson(),emitCatalogue(),stripAuthoring(),loadContent(),createInitial(),stubBundle,validateContent(),GeneratedFile,specTopics,parsedSet(),topicHeadings()"]
---

# Q: C3 generator and handoff contracts: generateContent(), indentJson(), emitCatalogue(), stripAuthoring(), loadContent(), createInitial(), stubBundle, validateContent(), GeneratedFile, specTopics, parsedSet(), topicHeadings()

## Answer

Canonical nodes: generateContent() at tools/content/generate.ts:L196, indentJson()/emitCatalogue()/stripAuthoring()/cleanEntry() at tools/content/emit.ts:L11/L21/L32/L40, loadContent() at src/content/index.ts:L66, createInitial() at src/core/GameState.ts:L101, stubBundle at src/content/stub/index.ts:L49, validateContent() at src/content/validateContent.ts:L246, GeneratedFile at tools/content/contracts.ts:L59 (fixture-owner duplicate at tests/fixtures/contentToolchain.ts:L66), parsedSet()/generatedFile() at tests/fixtures/contentToolchain.ts:L460/L464, topicHeadings() at tools/content/gates/common.ts:L176. Consumers: tests/content/ContentCatalogues.test.ts, CoverageGates.test.ts, ContentHandoff.test.ts, tests/fixtures/content.ts and persistence.ts.

## Outcome

- Signal: useful

## Source Nodes

- generateContent(),indentJson(),emitCatalogue(),stripAuthoring(),loadContent(),createInitial(),stubBundle,validateContent(),GeneratedFile,specTopics,parsedSet(),topicHeadings()