---
type: "query"
date: "2026-11-24T13:53:37.078520+00:00"
question: "Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["SaveManager,StorageAdapter,GameStateDto,SaveDto,LoadResult,LoadFailureReason,QuarantineDto,ScoreTracker"]
---

# Q: Where are the persistence contracts canonical: SaveManager, StorageAdapter, GameStateDto, LoadResult and LoadFailureReason, Save quarantine, ScoreTracker?

## Answer

Canonical code nodes are SaveManager at src/application/SaveManager.ts:L5-L10, StorageAdapter at src/storage/StorageAdapter.ts:L2-L5, SaveDto/LoadFailureReason/LoadResult at src/application/SaveDto.ts:L4/L10/L17, QuarantineDto at src/application/QuarantineDto.ts:L4, GameStateDto at src/core/GameState.ts:L13, ScoreTracker at src/core/scoring/ScoreTracker.ts:L5. Doc nodes for the same concepts in architecture.md and shared-rules.md are concepts, not competing implementations; ScoreTracker has a doc-doc duplication lead recorded in the branch matrix.

## Outcome

- Signal: useful

## Source Nodes

- SaveManager,StorageAdapter,GameStateDto,SaveDto,LoadResult,LoadFailureReason,QuarantineDto,ScoreTracker