---
type: "query"
date: "2026-11-25T09:55:34.834832+00:00"
question: "C3 generated handoff: which canonical nodes own compact emission, YAML-to-DTO adaptation and the initial-state default bundle?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["emitCatalogue(),indentJson(),cleanEntry(),generateContent(),bundleOf(),loadContent(),createInitial()"]
---

# Q: C3 generated handoff: which canonical nodes own compact emission, YAML-to-DTO adaptation and the initial-state default bundle?

## Answer

emitCatalogue()/indentJson()/cleanEntry() at tools/content/emit.ts, generateContent() at tools/content/generate.ts (now reuses bundleOf() at tools/content/adapt.ts:L50, the sole owner of conditions->preconditions and entryEffects defaults), loadContent() at src/content/index.ts:L66, createInitial() at src/core/GameState.ts:L101

## Outcome

- Signal: useful

## Source Nodes

- emitCatalogue(),indentJson(),cleanEntry(),generateContent(),bundleOf(),loadContent(),createInitial()