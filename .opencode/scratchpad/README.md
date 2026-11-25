# Agent scratchpad

This folder holds the working artefacts of the code and content agents. It is **not**
project source: it is ignored by Git apart from this README, and is excluded
from Prettier and Markdownlint by `.prettierignore` and
`.markdownlint-cli2.jsonc`.

## Layout

- `branch-matrix.md` — owned by `test-planner`; the single branch checklist.
- `slices/<slice-id>/red-report.md` — `test-writer`; matrix IDs and the expected red failure.
- `slices/<slice-id>/implementation.md` — `code-implementer`; reuse decisions and graph audit.
- `slices/<slice-id>/review.md` — `code-reviewer`; findings and verdict.
- `slices/<slice-id>/qa-report.md` — `browser-tester`; steps, observations and verdict.
- `slices/<slice-id>/screenshots/` — `browser-tester`; Playwright MCP screenshot evidence.
- `content/<area-id>/<kind>-status.md` — `content-editor`; the content-side per-task working record. Update the relevant canonical documents whenever a state, verdict, ID, flag, topic or coverage fact changes; a scratchpad file alone is not the record.
- `docs-audit/slices/manifest.md` and `docs-audit/slices/<slice>.md` — `/docs-reconcile`; the slice manifest and per-slice audit findings.
- `docs-audit/fixes/<slice>-cycle<N>.md` — fix agents; the issues applied per cycle.
- `docs-audit/reviews/<slice>-cycle<N>.md` — review agents; findings from the blind review passes.
- `docs-audit/issues.md` — `/docs-reconcile`; the synthesised issues document whose decisions the fix batches apply.
- `docs-audit/reconcile-report.md` — `/docs-reconcile`; the final report for a run. `docs-audit/report.md` is a reserved path a run never overwrites.

Working notes and delivery history stay here. The style guide's
[Ownership and navigation](../../docs/developer/documentation-style-guide.md#ownership-and-navigation)
section owns the scratchpad-versus-canonical-document rule.

Each agent brief names the exact path to write. No agent invents a location, and
no agent writes source code, tests or configuration into this folder.
