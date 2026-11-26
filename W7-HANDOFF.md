# W7 non-quiz runtime handoff

- **Prepared:** 2026-11-26
- **Purpose:** let another instance resume the W7 non-quiz runtime slice from the exact current state.
- **Status:** implementation and verification are **not complete**. No W7 code commit or push has been made.
- **This document:** the only new repository change in this handoff round.

## Objective

Finish the non-quiz W7 runtime slice, obtain fresh independent and Chromium verdicts, record the scoped result, and commit and push only the verified W7 delta.

The following stay outside the claim:

- quiz integration;
- hint integration;
- the complete authored `game-won` route;
- the single Playwright full-win test, which must remain skipped with `Quiz and hint integration is deferred by the user.`

Preserve the navigation-only Network Hub, the single-world design and the Binary Hall gate clues. Do not overwrite concurrent work. Bible changes need explicit user approval; the decimal sample is the only approved content addition.

## Present state

### Main workspace

- `/workspaces/CompSciQuest` and `origin/main` are at `7802a76910e53d085c1319368c35e6b0f7c5f08a` (`Refactor documentation for clarity and accuracy`).
- The working tree was clean before this handoff document was added.
- `main` advanced while the earlier integration was being prepared. The old base `530bdeded80328511de7edd966ca870a4d015ee5` is now an ancestor, not the current base.
- Commit `7802a769` is large and concurrent. It adds the documentation style guide and docs agent, a new `1-4-programming-constructs` content area, quiz/hint revisions, NPC topic-overlap gates, and the final W7 test contracts. Treat all of it as user or concurrent work.
- `main` contains the final W7 red contracts but **not** the W7 production implementation.

### Integration workspace

- `/tmp/opencode/w7-integration` is a clone still based on `530bded`.
- It contains the W7 production implementation, the older W7 tests, generated graph output and an untracked `node_modules` symlink.
- Pre-fix verification from that stale base remains useful only as orientation:
  - targeted NPC/W7 baseline: **52 passed**;
  - full Vitest: **421 passed across 70 files**;
  - `npm run content:validate`: passed;
  - `git diff --check`: passed.
- The earlier Chromium PASS in `.opencode/scratchpad/slices/w7-opening-walkthrough/qa-report.md` is also pre-final-fix evidence and must be rerun.
- The untracked `graphify-out/memory/query_20261125_194407_35847dcf_integrated_w7_browser_acceptance__which_graph_node.md` was created by graph navigation. Do not stage it.
- The older isolated snapshot `/tmp/opencode/w7-runtime-snapshot` is based on `6bd8dd5` and is historical only.

### Interrupted agents

Both background agents ended with `Rate limit exceeded`:

- `test-writer` — no authoritative red run was recorded and no red-report append exists;
- `docs` — no `.opencode/scratchpad/slices/w7-opening-walkthrough-runtime-review/docs-update.md` was created.

Their briefs are preserved in the earlier conversation, but the final contracts are already present in `main`, so the test-writer round does not need repeating before the red run.

## Final red contracts already in main

Use the files at `main` HEAD as the authoritative tests. Do not replace them with the older copies in the stale integration tree.

- `tests/w7/npc-topic-resolution.test.ts`
  - `W7R-NPC-01: a multi-ID askTell topic resolves only the matching object ID without mutation`
  - `W7R-NPC-01: verdict resolves to its declared AI object ID without mutation`
  - `W7R-NPC-01: units resolves to its declared keeper object ID without mutation`
  - `W7R-NPC-01: a tell-only topic named during ask uses the authored default without concrete effects`
  - `W7R-NPC-01: an ask-only topic named during tell uses the authored default without concrete effects`
  - `W7R-NPC-01: an exhausted once default is not answered, counted or applied again`
- `tests/w7/area-progress.test.ts`
  - `W7R-AREA-01: empty-progress completion creates one restorable row without awarding score`
  - `W7R-AREA-01: completion preserves an unrelated row and creates no duplicate world/area pair`
- `tests/w7/scenery-validation.test.ts`
  - `EXAMINE_CASES` covers numeric, boolean, array, object, `null`, empty-string, whitespace-only and valid-string `itemId`, plus a scenery `item`, in both authoring and runtime gates.
  - `W7R-CONTENT-01: runtime validation rejects a present non-array interactions value`
- `tests/npcs/NpcTypes.test.ts`
  - `W7R-NPC-02: canonical signatures accept actor binding without mutating state`

The tests are read-only on game state and assert named matrix traceability. Do not weaken them.

## Critical rebase requirement

Do **not** run `/tmp/opencode/transfer_w7_integration_commit.py` in its present form. Its `EXPECTED_BASE` is `530bded` and will reject the current `main` HEAD.

`/tmp/opencode/prepare_w7_integration.py` is also stale: it rebuilds from the old `6bd8dd5` snapshot.

Recommended recovery:

1. Build a fresh integration clone from current `main` (`7802a769`) into `/tmp/opencode/w7-integration` after preserving the old tree elsewhere, for example `/tmp/opencode/w7-integration-pre-rebase`.
2. Restore the `node_modules` symlink as before.
3. Apply only the W7 production delta from the old integration tree against the common base `530bded` using a three-way merge. Start from the tracked/untracked W7 paths in `/tmp/opencode/commit_w7_snapshot.py` as a checklist, but exclude test files because `main` already owns the newer versions.
4. Keep current `main` versions wherever they conflict with quiz/hint state handling, injected-state isolation, score replay guards, node/quiz handoffs, the NPC topic-overlap gate and the new content area.
5. Carry the stale harness correction from 7 to 19 items in `e2e/content-generated.spec.ts`; verify the current generated catalogue count first.
6. Reapply the status/coverage documentation edits to the new documentation structure rather than copying old paragraphs verbatim.
7. Update the transfer script's expected base to `7802a769` before any commit transfer.

## Seven final-review fixes still to apply

The fresh independent review is `FAIL` with no blockers and seven majors in `.opencode/scratchpad/slices/w7-opening-walkthrough-runtime-review/review.md`. The matrix rows are in `.opencode/scratchpad/branch-matrix.md`: `W7R-NPC-01`, `W7R-NPC-02`, `W7R-AREA-01` and `W7R-CONTENT-01`.

### 1. Multi-ID topic resolution

`authoredObjectId()` in `src/core/commands/TopicResolver.ts` currently returns the whole `objectIds` array when any reference matches. Collect only the matching references, then apply the uniqueness check.

### 2. Declared object IDs, command compatibility and specificity

- A phrase naming one authored ask/tell topic with a single object ID must resolve to that object ID. This is what makes `verdict` resolve to `ai-ethics-and-implications` and `units` to `data-storage-units`.
- `TopicSelection.hasResolvedMatch()` must apply the same ask/tell compatibility rule to the keyword/topic-ID path that `hasObjectMatch()` applies to the object path. Tell-only topics must not answer `ask`; ask-only topics must not answer `tell`; `askTell` accepts both.
- Preserve exact-topic specificity for authored quiz handoffs such as `shifts`, `unicode`, `storage`, `capacity` and `ratio`. A good shape is a small shared topic-phrase helper used by both resolution and selection, with selection preferring an exact topic ID among object matches and not falling through to a different topic when the exact one is inactive or command-incompatible.
- Keep actor binding: `resolve(phrase, state, node?, actorId?)` must remain the canonical four-parameter signature, and `handleConversationTopic()` must pass `actorId`.

### 3. Exhausted `once` defaults

`fallBackAfterOnce()` can reselect an exhausted default. Add excluded-topic support to `findDefaultTopic()` and pass the exhausted topic ID. Also prevent an already-used `once` default from being selected by the initial fallback. No response, use-count increment or effect should occur on the second pass.

### 4. Empty-progress completion

`applyStateEffect()` only searches existing progress and loses `complete-topic` when no row exists. Pass the content bundle into the state-effect handler and resolve or create the matching `(worldId, areaId)` row before appending `topicId`.

- Use content-derived `maxScore` from `bundle.specTopics.getByAreaId()`.
- Keep `earnedScore` at zero; `ScoreTracker` remains the only `earnedScore` writer.
- Do not create duplicate world/area pairs or change unrelated rows.
- Avoid duplicating the row-creation logic currently in `ScoreTracker.ensureProgress()`; a shared helper in `src/core/AreaProgress.ts` is preferable.

### 5. Malformed interaction containers

Runtime `interactionProblems()` replaces a present non-array `room.interactions` with `[]`. Emit a finding instead. Authoring already checks this container.

### 6. Strict EXAMINE item fields

Both authoring and runtime gates must reject any present `itemId` that is not a non-empty string, including on EXAMINE, and any `item` field on EXAMINE even when its value is otherwise valid. Test presence independently of string validity.

- Export one `interactionShapeProblems()` helper from `src/content/validateContent.ts` and use it in `tools/content/schema.ts` as well as runtime validation.
- Keep target-reference existence checks separate from target shape checks.
- Keep valid USE/PUT controls passing and both gates read-only.

### 7. Named signature contract

Already present in current `main` at `tests/npcs/NpcTypes.test.ts`. No new test-writer work is required for this item; prove it green in the rebuilt integration tree.

## Verification order

Use the scripts in `package.json`; do not invent commands.

1. Rebuild/reconcile the integration tree as described above.
2. Confirm the final contract files are identical to `main`.
3. Run the authoritative red suite in `/tmp/opencode/w7-integration` before production edits and record the verbatim summary in `red-report.md`.
4. Apply the seven fixes.
5. Run targeted green tests for the four contract files.
6. Run the full gates in the integration tree:
   - `npm test -- --no-cache`
   - `npm run typecheck`
   - `npm run lint`
   - `npm run content:validate`
   - `npm run content:generate`
   - `npm run build`
   - `npx prettier --check` on the files the W7 delta changed
   - `git diff --check`
7. Run `graphify update .` in the integration tree. Keep the codebase graph at the repo root separate from `docs/graphify-out/`.
8. Dispatch `browser-tester` for fresh Chromium QA:
   - `npx playwright test --config=/tmp/opencode/w7-integration-playwright.config.ts`
   - expected non-quiz scope: clean boot, AI topic precedence and room scope, navigation-only hub, overheat and carry-overflow re-entry, six Binary Hall gates, 16 non-quiz puzzles, two hazard losses, one remaining life, canonical save ownership, Continue, per-area progress, accessibility, aesthetics and console cleanliness;
   - one skip only, with the deferred full-win reason.
9. Dispatch `code-reviewer` for a fresh independent PASS after all fixes and graph rebuild. Require the full duplication audit and graph trace.
10. Dispatch the `docs` agent using `docs/developer/documentation-style-guide.md` for documentation form, then apply only the authorised content/coverage decision: non-quiz W7 PASS, with quiz, hint and complete-win still deferred. Do not change the Bible.
11. Finalise `implementation.md` with exact evidence, Graph trace and duplication audit.
12. Recheck `main` HEAD and the absence of staged changes. Update the transfer script base if necessary, commit the exact integration delta excluding `node_modules` and graph memory artefacts, run the transfer script, inspect preserved concurrent changes, then push without force.

## Graph trace from the handoff round

- `graphify reflect --if-stale` was run in both relevant trees and `graphify-out/reflections/LESSONS.md` was read. The main-tree generated reflection change was reverted; the working tree stayed clean.
- Literal expansion before source checks included `TopicResolver`, `createNpcTopicResolver()`, `fallBackAfterOnce()`, `validateContent()`, `AreaProgress`, `matchingInteraction()`, `examineHandler()`, `MultiwordAlias` and `W7R-NPC-02`.
- `graphify query` in current `main` cited `TopicResolver` at `src/core/commands/TopicResolver.ts:L11`, `fallBackAfterOnce()` at `src/core/npcs/ConversationFlow.ts:L210`, `progress()` at `tests/w7/area-progress.test.ts:L126`, `examineHandler()` at `src/core/commands/verbs/index.ts:L170` and `matchingInteraction()` at `src/core/commands/InteractionRules.ts:L248`.
- Graph edges were treated as leads only. Test names and source lines above were confirmed directly. Graph output is stale for the W7 delta until the final `graphify update .` runs.

## Constraints and pitfalls

- Use British English in all prose, comments, reports and commit messages.
- Source and test files are capped at 600 lines by ESLint; split by responsibility if needed, not by line count alone.
- ESLint flat config, TypeScript configs, `AGENTS.md` and `opencode.json` are user-owned. Do not edit the ESLint or TypeScript configs. The docs style guide proposes changes to routing files rather than applying them.
- Keep generic runtime code free of authored room/item IDs, aliases, flags and prose. Room-local scenery and interactions remain validated content.
- Do not overwrite the new `1-4-programming-constructs` cards or quiz/hint/NPC-overlap work.
- The repository-wide `npm run format:check` may remain red on user-owned docs; scoped Prettier on changed source is the gate.
- Vite `base` must continue to match the GitHub Pages subpath.
- Never stage `node_modules` or Graphify query-memory artefacts.
- Do not claim a full win. The browser test skip is intentional and must remain visible.

## Definition of done

- The rebuilt integration tree is based on current `main` and preserves all concurrent work.
- The named red contracts fail before fixes and pass after them.
- Every gate in the verification order is green, with `graphify update .` complete.
- Fresh browser QA and independent review both return PASS for the non-quiz scope only.
- `docs/content/status.md` and `docs/coverage/COVERAGE.md` record non-quiz PASS and the continuing deferrals.
- The W7 commit contains only the verified delta, lands on current `main` without force, preserves concurrent working changes and is pushed.
