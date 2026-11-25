---
type: "query"
date: "2026-11-25T08:29:54.417538+00:00"
question: "Where do boot, title overlay, GameViewData, validation and save quarantine live?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Bootstrap (src/main.ts),Title screen overlay,validateContent(),SaveManager,QuarantineDto,LoadResult and LoadFailureReason,GameViewData,EventBus"]
---

# Q: Where do boot, title overlay, GameViewData, validation and save quarantine live?

## Answer

Canonical nodes: Bootstrap (src/main.ts) at architecture.md (loc None), Title screen overlay at application-and-ui.md (loc None), validateContent() at src/content/validateContent.ts:L246, SaveManager/.load() at src/application/SaveManager.ts:L34, QuarantineDto at src/application/QuarantineDto.ts:L4, LoadResult and LoadFailureReason at src/application/SaveDto.ts:L17/L10, GameViewData at src/application/GameViewData.ts:L47, EventBus at src/core/events/EventBus.ts:L4. No UI view modules exist yet.

## Outcome

- Signal: useful

## Source Nodes

- Bootstrap (src/main.ts),Title screen overlay,validateContent(),SaveManager,QuarantineDto,LoadResult and LoadFailureReason,GameViewData,EventBus