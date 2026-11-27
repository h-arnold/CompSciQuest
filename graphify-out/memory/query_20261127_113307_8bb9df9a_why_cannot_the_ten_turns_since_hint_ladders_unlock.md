---
type: "query"
date: "2026-11-27T11:33:07.680984+00:00"
question: "Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?"
contributor: "graphify"
outcome: "dead_end"
source_nodes: ["src_core_puzzles_puzzlesystem_advancecounters,HintSystem,PuzzleSystem"]
---

# Q: Why cannot the ten turns-since hint ladders unlock through ordinary browser commands on the clean win?

## Answer

Zone-1 puzzle requirements are single flag-set conditions, so PuzzleSystem advances turns-since counters only while phase is active (src/core/puzzles/PuzzleSystem.ts L103, L111-115) and the counter created on solve stays 0; MCP evidence shows hint returns 'There is nothing more to suggest just now.' with .hint-panel hidden after 20+ turns and counters 0.

## Outcome

- Signal: dead_end

## Source Nodes

- src_core_puzzles_puzzlesystem_advancecounters,HintSystem,PuzzleSystem