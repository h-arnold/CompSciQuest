---
type: "query"
date: "2026-11-25T12:20:31.973375+00:00"
question: "Which canonical module owns validation and what value imports must carry the .ts extension for plain Node ESM resolution?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["validateContent() hazardContentFindings() puzzleGraphFindings() allowImportingTsExtensions verbatimModuleSyntax moduleResolution"]
---

# Q: Which canonical module owns validation and what value imports must carry the .ts extension for plain Node ESM resolution?

## Answer

src/content/validateContent.ts owns validateContent(); its two value imports hazardContentFindings() (src/core/hazards/HazardValidation.ts:L5) and puzzleGraphFindings() (src/core/puzzles/PuzzleGraph.ts:L38) needed .ts extensions. Type-only imports are erased. tools/content/adapt.ts already uses ../../src/content/validateContent.ts with .ts. Fixed both specifiers; CT-IMPORT-01 now passes.

## Outcome

- Signal: useful

## Source Nodes

- validateContent() hazardContentFindings() puzzleGraphFindings() allowImportingTsExtensions verbatimModuleSyntax moduleResolution