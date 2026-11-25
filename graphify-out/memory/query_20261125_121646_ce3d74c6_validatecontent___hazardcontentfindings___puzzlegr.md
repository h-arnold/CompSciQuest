---
type: "query"
date: "2026-11-25T12:16:46.427414+00:00"
question: "validateContent() hazardContentFindings() puzzleGraphFindings() content:validate content:scaffold content:generate verbatimModuleSyntax allowImportingTsExtensions loadValidation() loadScaffolder() loadGenerator() ValidationModule"
contributor: "graphify"
outcome: "useful"
source_nodes: ["validateContent()", "hazardContentFindings()", "puzzleGraphFindings()", "verbatimModuleSyntax", "moduleResolution"]
---

# Q: validateContent() hazardContentFindings() puzzleGraphFindings() content:validate content:scaffold content:generate verbatimModuleSyntax allowImportingTsExtensions loadValidation() loadScaffolder() loadGenerator() ValidationModule

## Answer

Canonical owner is the runtime module validateContent() at src/content/validateContent.ts (L246). Its value imports of hazardContentFindings() (src/core/hazards/HazardValidation.ts L5) and puzzleGraphFindings() (src/core/puzzles/PuzzleGraph.ts L38) are extensionless, so a fresh Node ESM process fails with ERR_MODULE_NOT_FOUND naming HazardValidation. tsconfig.json moduleResolution=Bundler + verbatimModuleSyntax (L6, L11) explain why Vite/Vitest load it but plain Node does not. CT-IMPORT-01 red test added at tests/content/ToolchainEsmImport.test.ts. Duplication lead recorded, not resolved: validateContent() is also claimed by tests/fixtures/content.ts and docs/developer/application-and-ui.md.

## Outcome

- Signal: useful

## Source Nodes

- validateContent()
- hazardContentFindings()
- puzzleGraphFindings()
- verbatimModuleSyntax
- moduleResolution