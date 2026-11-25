---
description: "Audit documentation in slices, synthesise a deduplicated issues document, delegate fixes by the same split, and review until clean"
---

Audit the documentation in scope, decide what should change, delegate the
fixes, and review them until no findings remain. Work in three phases: audit,
remediate, review.

In scope: `docs/developer/**`, root `AGENTS.md`, root `README.md`, the form of
`docs/coverage/COVERAGE.md`, and the documentation-reference duties in
`.opencode/agents/*.md`. Out of scope: the style guide itself (it is the
standard, not an audited file), `docs/content/**` (governed by the content
rulebook and the bible), `docs/exam-specs/**`, both `graphify-out/` trees,
working notes under `.opencode/scratchpad/**`, and generated sources.

Audit and review subagents are read-only: they may write only their own
findings or review file in the scratchpad. Fix subagents may edit only the
files listed in their batch brief. The path
`.opencode/scratchpad/docs-audit/report.md` is reserved for a completed
audit; never overwrite it.

## Delegation rules

- Run slices in batches of three or four concurrent subagents. Start a fresh
  session for each; resume a session only when it returned an error or an
  empty response.
- Use the `docs` agent for audit and review briefs; the doc-reference duties
  in other agent files may be audited by the same briefs read-only. Never
  attach agent definition files or `AGENTS.md` to a brief; those are injected
  automatically.
- Every subagent writes its output to its own scratchpad file and returns only
  that path, so full results survive if the orchestrating agent is compacted.

## 1. Prepare

1. Read @docs/developer/documentation-style-guide.md — compulsory reading, the
   source of truth for audience, writing style, ownership, decision rules and
   audit exclusions.
2. Apply its exclusions: `documentation-style-guide.md` itself, `docs/content/**`,
   `docs/exam-specs/**`, both `graphify-out/` trees, `.opencode/scratchpad/**`
   working notes and generated `src/content/authored/**`. Judge `COVERAGE.md`
   against the split-governance rules only.
3. Enumerate the in-scope Markdown files and write an exact per-slice manifest
   to `.opencode/scratchpad/docs-audit/slices/manifest.md`. Every in-scope file
   belongs to exactly one slice, and every phase uses the manifest verbatim;
   do not derive slice membership again. Keep each slice at or below roughly
   3,000 lines. If a slice must be split, give each part a name derived from
   its content, record both parts and their findings filenames in the
   manifest, and use those names in every phase.
4. Create `.opencode/scratchpad/docs-audit/slices/`, `.../fixes/` and
   `.../reviews/` if missing. Clear stale files from a previous run only after
   checking no in-flight slice needs them.

## 2. Slice plan

The manifest from Prepare is the exact file list; the table names each slice.

| Slice               | Content                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| Developer-core      | `architecture.md`, `shared-rules.md`, `application-and-ui.md`, `storage-schema.md` |
| Subsystems          | `combat.md`, `hazards.md`, `hints.md`, `npcs.md`, `puzzles.md`                 |
| Toolchain and rules | `content-rules.md`, `content-toolchain.md`                                    |
| Traceability        | `docs/coverage/COVERAGE.md` (form only), root `README.md`                     |
| Agent files         | root `AGENTS.md` (whole file), and the documentation-reference and ownership duties in `.opencode/agents/*.md` |
| Index               | `docs/developer/README.md`                                                    |

## 3. Delegate slice audits

Each brief must state:

1. **Scope**: the exact file list from the manifest for that slice, and nothing
   else.
2. **Mandatory reading**: `@docs/developer/documentation-style-guide.md`
   followed by a space.
3. **Audience row**: which row of the style guide's audience table applies to
   the slice.
4. **Read-only**: do not edit or create any tracked file. The only permitted
   write is your own findings file in the scratchpad.
5. **Task**: check both accuracy against the codebase (paths, symbols, config
   keys, scripts, shipped-feature status) and compliance with the style guide
   (delivery narrative, decision provenance, amendment deltas, duplication,
   ownership, decision logs, density, formatting, terminology).
6. **Method**: locate candidate passages with search first, then read the
   surrounding section. Do not read every file in full; for files over 1,000
   lines, read only the relevant sections.
7. **Evidence**: for every staleness claim, state how it was verified — glob
   result, path lookup, `git log`, config or source file. Never report a
   guessed fact. Use "Needs verification" only for findings whose resolution
   needs a decision outside the repository.
8. **Output**: report every finding without a cap. Give each an ID (`DC-01`,
   `SUB-01`, …), `file:line`, style-guide category, severity
   (High/Medium/Low), the problem with a short quote, and a concrete suggested
   fix. Separate "High confidence" from "Needs verification". Rank by what
   would change a reader's action. List the categories that came back clean.
9. **Findings file**: write findings incrementally to
   `.opencode/scratchpad/docs-audit/slices/<slice-name>.md`, writing each
   finding as soon as it is confirmed so a cancelled agent leaves usable
   partial findings. Return only that path.

If a subagent repeatedly fills its context and is compacted, cancel it and
split that slice into two smaller briefs rather than waiting. Read any partial
findings file it left behind before re-running the slice.

## 4. Central checks

Run these yourself as the batches dispatch; do not delegate them:

- Index agreement: `docs/developer/README.md` and the Documentation Landscape
  in `.opencode/agents/docs.md` against the files on disk.
- Duplication and contradictions across slices: the same rule stated in two
  canonical docs; an "amends" delta that disagrees with its owner; agent
  instructions that disagree with a doc; the docs agent's deny list against
  the ownership table in `content-toolchain.md` §7.
- Decision-log treatment: any "Decision log", "Decided", "Decisions not
  revisited" section, approval record or dated addendum in an in-scope doc is
  a finding; the rule belongs folded into the section it governs.
- `COVERAGE.md` ↔ `docs/content/spec-topics.yaml` heading agreement: a
  mismatch is an integration finding routed to `content-editor`, not fixed
  here.
- Terminology: **CompSciQuest** consistently.
- Root `README.md` commands against `package.json` scripts, and version
  claims against their pin sources (Dockerfile, `package.json`, `npm ls`).

Record these with origin `central` and IDs prefixed `C-`, assigned to the
owning batch. A central decision may add an explicitly named file outside the
slice to that batch's allowed list; the fix brief must then name it verbatim.

## 5. Synthesise the issues document

Read every returned findings file in full. Write one comprehensive document to
`.opencode/scratchpad/docs-audit/issues.md`.

- Deduplicate: merge findings describing the same defect; keep every affected
  location and the strongest evidence, linking to the slice files by ID.
- For each issue record: ID, severity, location(s), finding, decision, fix
  batch, status.
- Decide every structural or ownership question here — which doc owns a rule,
  whether a section is deleted, merged or relocated, whether an "amends" delta
  is folded into its owner. Fix agents apply the decision; they do not
  re-decide it.
- Where subagents disagree, choose one account, record the rationale, and
  apply it consistently.
- A decision that creates or removes a doc, or materially changes its purpose,
  must name `.opencode/agents/docs.md` in that batch's allowed files (the
  Documentation Landscape update), and `code-reviewer.md` too when its
  reference list is affected.
- Coverage decisions on `COVERAGE.md` (status, evidence, room IDs, budgets)
  are never a fix batch's to make: mark such an issue routed to
  `content-editor` and record it as such.
- An issue may be marked **Accepted** with a recorded rationale. Accepted
  issues are not fix work and are not re-raised by reviewers.
- A fix that must edit a user-owned file — root `AGENTS.md`, `opencode.json`,
  or a recorded design decision in `docs/developer/**` (see
  `content-toolchain.md` §7) — is not fix work either: record the proposed
  change in the issue, mark it **Proposed**, and leave it out of every batch;
  §8 presents proposals to the user.
- Do not fix anything in this phase. The issues document is the complete plan.

## 6. Delegate fixes

Reuse the manifest and the same agent types. Run batches of three or four
fresh sessions.

Each fix brief must state:

1. The verbatim issue rows assigned to that batch and their decisions.
2. Compulsory reading: `@docs/developer/documentation-style-guide.md`.
3. The exact files the agent may edit, from the manifest plus any file
   explicitly added by a central decision. No other file may be touched.
4. Apply the recorded decision only. Do not expand scope, restructure
   unrelated sections or invent new rules. If a decision cannot be applied,
   report that instead of improvising.
5. Do not commit, and do not change code, tests or JSDoc. Never edit
   user-owned files: root `AGENTS.md`, `opencode.json`, or recorded design
   decisions in `docs/developer/**` — issues marked **Proposed** stay with
   the user. Agent instruction files may be edited only when named by the
   issue decision or the Documentation Landscape obligation.
6. Write a fix log incrementally to
   `.opencode/scratchpad/docs-audit/fixes/<slice>-cycle<N>.md`, starting at
   cycle 1, listing each issue ID, the change made and the files touched.
   Return only that path.

Update the status of every issue in `issues.md` after each batch, recording
the fix log path.

If a fix agent is cancelled, run `git status` and `git diff` on that batch's
files before re-delegating, and read any partial fix log, so work is neither
double-applied nor skipped.

## 7. Review loop

After all fix batches land, delegate a fresh review of every slice that had
fixes, using the same manifest and agent types. The first cycle reviews every
fixed slice; later cycles review only the slices changed in that cycle. Each
cycle uses a new filename, so previous reviews are preserved.

Each review brief must state:

1. The exact slice files, and the verbatim issue rows with decisions assigned
   to that batch.
2. Compulsory reading: `@docs/developer/documentation-style-guide.md` and
   `@.opencode/scratchpad/docs-audit/issues.md`.
3. Read-only: the only permitted write is the review file in the scratchpad.
4. Report every finding without a cap, in the audit format; apply the Task,
   Method and Evidence rules of §3 to review findings too — re-verify against
   the codebase, and state how staleness was checked.

Write reviews incrementally to
`.opencode/scratchpad/docs-audit/reviews/<slice>-cycle<N>.md` and return only
that path. Read every review file in full. If a review agent is cancelled,
read any partial review file and run `git status` and `git diff` on that
batch's files before re-delegating.

- Reviewers never see the fix logs. They check the resulting tree against the
  style guide and the issues document's decisions, and never re-raise issues
  marked Accepted or Proposed.
- An issue is resolved only when a reviewer confirms the fix in that cycle. A
  recurring issue keeps its original ID and is reopened.
- A clean review across the reviewed slices is a success exit: stop and go to
  §8.
- Otherwise, a cycle makes progress when no previously open issue ID recurs
  and at least one issue is confirmed resolved. If a cycle makes no progress,
  stop and report the blocker; this stop rule takes precedence over
  re-delegation.
- Unless stopped, a review finding at any severity joins `issues.md` with a
  new ID (recurrences keep the original ID), is assigned to the owning batch,
  fixed and reviewed again.

## 8. Report

Write the final report to
`.opencode/scratchpad/docs-audit/reconcile-report.md`; never write to
`report.md`. Include the original findings, the synthesis decisions, the fixes
applied, each review outcome, every issue marked Accepted with its rationale,
and every **Proposed** change to user-owned files for the user to decide. Return a short summary in chat leading with the number of issues
resolved and the path to the report.
