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

Each agent brief names the exact path to write. No agent invents a location, and
no agent writes source code, tests or configuration into this folder.
