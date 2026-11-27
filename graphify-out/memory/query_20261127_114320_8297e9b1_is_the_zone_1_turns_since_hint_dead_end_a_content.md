---
type: "query"
date: "2026-11-27T11:43:20.222546+00:00"
question: "Is the zone-1 turns-since hint dead end a content-authoring issue rather than an engine bug, and what content options exist?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["HintSystem", "advanceCounters()", "PuzzleSystem", "HintPanel"]
---

# Q: Is the zone-1 turns-since hint dead end a content-authoring issue rather than an engine bug, and what content options exist?

## Answer

Confirmed content-authoring mismatch: authored zone-1 puzzles are single-requirement so PuzzleSystem activates and solves in one turn; advanceCounters() only advances active puzzles, so turns-since stays 0. Options: zero-threshold on the same key, retarget to failed-attempts with value 0, or larger multi-requirement redesign.

## Outcome

- Signal: useful

## Source Nodes

- HintSystem
- advanceCounters()
- PuzzleSystem
- HintPanel