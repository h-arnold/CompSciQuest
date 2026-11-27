# Documentation style guide

Rules for writing Markdown under `docs/developer/`, the root `README.md`, root
`AGENTS.md` and agent instruction files. Contributors, the `docs` agent and
reviewers use this guide as the single source of truth. Agent instruction files
link here rather than repeating the rules.

This guide's writing rules govern `docs/developer/**`, the root `README.md`,
`AGENTS.md` and agent instruction files. The `docs` agent maintains
`docs/content/**` under the direction of `content-editor` and the user; the
bible and the owning rule documents own its content rules. `docs/coverage/COVERAGE.md`
is split-governed; see
[COVERAGE.md is split-governed](#coveragemd-is-split-governed).
`docs/exam-specs/**` is read-only authority for course facts and outside all
governance.

The root `AGENTS.md` sets the tone rules and the banned-word list for all
output, documentation included. Link to them; do not restate them here.

## Audience and writing style

| Audience                 | Where                                | Assumptions                              | Style                                                                                                                                                                       |
| ------------------------ | ------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Developers and AI agents | `docs/developer/`, root `README.md`  | Fluent in standard development practice. | About CompSciQuest only. No generic preamble or advice. Clear, concise and specific. Use the simplest wording that preserves nuance, and plain English over jargon.         |
| Agents                   | `AGENTS.md`, `.opencode/agents/*.md` | Instructions are followed literally.     | Unambiguous imperative language: "must" and "must not". State expected behaviour and constraints directly, with no narrative context or prose that weakens the instruction. |

When general tone guidance below conflicts with an audience row, the audience
row wins.

## What a canonical doc is for

State the rules and reasoning a reader needs to act correctly. Describe
behaviour as it is now, or as it is planned to become — not the sequence of
work that produced it.

Documenting planned, unimplemented or partially implemented features is
allowed and often necessary: state them as current status, keep them accurate,
and reconcile them when the implementation lands. A doc that describes a
system which has since shipped must not still call it planned.

## Don't duplicate the code

A doc must tell the reader something the code does not already say clearly.
Before keeping a sentence, ask: would an engineer who has read the code,
configuration and test names still act wrongly without it? If not, delete it.

The source is the owner of a symbol's contract:

- Do not restate parameters, return types, options or usage examples. Link to
  the symbol instead.
- Document what code and comments cannot carry: why a rule exists, how
  components fit together, and the constraints a reader must respect.
- A stale comment is a code finding: route it to `code-lead` rather than
  compensating for it in prose.

## What never belongs

- **Delivery narrative** — what was implemented, in which order, by which
  increment, with what evidence.
- **Decision provenance** — "added by user decision on 2026-11-25". If the rule
  stands, state the rule; the decision record is a commit message or a
  scratchpad note.
- **Amendment deltas** — "amends architecture.md §6.2", "the gates change as
  follows", "this replaces the former conversion step". Rewrite the owning
  section so the doc states current behaviour outright.
- **Status markers for shipped work** — a "planned" header above a system the
  code already implements, "the next document should be…", a proposed file
  tree left in place after the code lands. Update the doc when the feature
  ships.
- **Proof catalogues** — which suite, fixture or slice proves which claim.
- **Volatile facts** — versions, test counts, node counts, coverage
  percentages, file and line counts, machine-specific paths, dates and commit
  hashes. Cite the config file or command that reports the value instead.
- **Restated APIs** — see [Don't duplicate the code](#dont-duplicate-the-code).
- **Generic tutorials** for TypeScript, Vite, Vitest, Playwright or editors.
- **Inventories** that the filesystem, scripts or test names already express.
- **Planning vocabulary** — option letters, draft-section numbers, increment or
  slice names and issue references used as headings or narrative structure. A
  workflow's defined identifiers (W3, V4, Gate 2) are live terms: cite them as
  labels, never as narrative structure.
- **Negative change commentary** — "no new counter is introduced", "this
  change does not redesign X", "unchanged". State the invariant positively
  instead.
- **Decision logs** — see [Decisions](#decisions).

## Decisions

There are no architecture decision records and no decision logs in developer
docs. A settled decision is folded into the section that governs the
behaviour and written as a current instruction; at most one sentence of
rationale belongs inline, and only where it changes how the rule is applied.
Decision history belongs in commit messages and the scratchpad. A log left at
the end of a doc always risks disagreeing with the doc above it; that is why
none exist.

## Keep changes proportional

- Aim for a net-neutral or net-negative diff. If you add a section, remove,
  merge or relocate stale content from the same document.
- Prefer splitting an overstretched doc over growing it; see
  [Choose where a doc lives](#choose-where-a-doc-lives).
- Do not pad a doc to match the perceived depth of its neighbours. Length is a
  consequence of the material.
- When touching a doc for a substantive update, prune nearby duplication and
  dense prose, keeping that cleanup local to the document.

## Write concisely

- Prefer short sentences, direct instructions and plain language. Remove
  filler, repetition and claims that do not change the reader's action.
- Choose the simplest wording that preserves meaning. Avoid inflated language,
  jargon and decorative synonyms such as "robust" or "comprehensive".
- Put the most important decision, requirement or warning first.
- Keep one idea per paragraph, expressed in two or three short sentences.
- Break up common density patterns: one bullet listing many files, several
  rules joined by nested em-dashes, several examples for one rule, and prose
  that restates a table.
- Use British English.

## Formatting

- Use one H1, then logically nested H2/H3 headings with no skipped levels.
- Use numbered lists for sequences and bullets for unordered guidance.
- Use tables for compact comparisons and repeated field/value patterns, not
  long prose.
- Put commands and configuration in fenced code blocks, with a language
  identifier where one applies.
- Use bold "Status:" callouts only to state live status, never to record
  shipped history.
- Use bold for key terms or actions, not whole paragraphs.
- Add a short verification step when the reader must confirm success.

## Structure a document

A reader often arrives from a link and reads one screen before acting. Make
that first screen enough to act correctly, and the rest quick to scan.

- Open with one or two sentences that state what the doc covers and the main
  rule or decision it gives. Keep volatile facts out of the opening so it
  stays true.
- Order sections from the general rule to the specifics, and the common path
  before exceptions.
- Give each section one subject. Merge sections that answer the same question;
  separate a section that answers two.
- Write headings that name the subject or the conclusion, not generic labels
  such as "Details" or "Notes". Each heading must make sense on its own as a
  link anchor.
- Keep the steps of a procedure together and in order.
- Make each section understandable on its own; link to the owning doc for the
  full rule rather than restating it.

## Verify references

- Check every source, config and spec path against the working tree before
  citing it. Prefer a stable path or symbol name to a line number, which
  drifts.
- Name list items by topic or heading anchor, not by position.
- When two docs make conflicting claims, verify against the code and correct
  both.

## Ownership and navigation

- Give each topic one owning doc: the single source of truth for that rule or
  behaviour. Where another doc needs the rule, link to the owner. A brief summary
  is acceptable where the reader needs the rule to act, but restate sparingly and
  never let a summary be the only statement of a rule.
- Amendment docs are banned: a doc that restates another doc's rules as
  deltas is rewritten so that the owning section states the behaviour
  outright.
- Keep `docs/developer/README.md`, the agent files' documentation landscape
  and the files on disk in agreement.
- Agent instruction files and `AGENTS.md` are the main places where a short
  restatement is acceptable, because the agent must apply the rule while acting.
  Even there, prefer a summary with a signpost to the full statement, and check
  that it agrees with the owner.
- The scratchpad is never the record of a settled fact: state, verdict, ID,
  flag, topic and coverage facts are written to the canonical doc that owns
  them.

## Choose where a doc lives

Place a new doc by subject, matching the folders already in use:

| Location                        | Content                                                                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/developer/` (root)        | Cross-cutting standards that belong to no single subsystem: this guide and the toolchain contract.                                                       |
| `docs/developer/<subsystem>.md` | One subsystem contract each: `application-and-ui`, `areas`, `combat`, `hazards`, `hints`, `npcs`, `puzzles`, `shared-rules`.                             |
| `docs/developer/README.md`      | The index; one line per doc, naming what it owns.                                                                                                        |
| root `README.md`                | Environment, toolchain and setup as a contributor meets them.                                                                                            |
| root `AGENTS.md`                | The delegation contract and routing signposts only.                                                                                                      |
| `docs/content/**`               | Authored game content and content docs; maintained by the `docs` agent, with creative decisions and course facts owned by `content-editor` and the user. |
| `docs/coverage/COVERAGE.md`     | The spec → topic → room → code mapping; split-governed.                                                                                                  |

Before creating a doc, check whether an owning doc already covers the subject.
Extend that doc rather than start a rival. Split a doc when it covers subjects
with different owners, when readers need to link to one part without the rest,
or when a section has become a subject of its own; judge by subject, not line
count, and keep the original as a short index.

## COVERAGE.md is split-governed

The content editor owns the coverage _content_: topic status, evidence, room
IDs and score budgets, written at W5 per `content-editor.md` Gate 3. The `docs` agent
owns the doc's _form_: structure, headings matching `## Topic: <id>`, no
duplication with the developer docs that describe the same machinery, stale
references corrected. A governance fix that would change a coverage state, an
evidence claim, a room ID or a budget is not a governance fix — route it to
`content-editor`.

## Root README

The root `README.md` is developer- and environment-facing prose in full
docs-governance scope. Every command it shows must match a script in
`package.json` (or a documented container step), and every version claim must
cite the source of the pin — the Dockerfile, `package.json` or the command
that reports the value — instead of restating version numbers.

## Naming

Use persistent, codebase-specific names for files, titles and headings. Avoid
names tied to transient planning artefacts. Prefer names that name the subject
or the rule the doc owns.

## Terminology

Use **CompSciQuest** consistently; check the root `README.md` and
`AGENTS.md` before introducing a product-name variant. Content terms — zone,
area, card, topic, ID — follow the bible and the authored cards.
Course facts follow `docs/exam-specs/wjec-unit1.md`; the exam specification is
the authority for all of them.

## Scope of documentation audits

- In scope: `docs/developer/**`, `docs/content/**`, root `AGENTS.md`, root
  `README.md`, the form of `docs/coverage/COVERAGE.md`, and the
  documentation-reference duties in `.opencode/agents/*.md`. For
  `docs/content/**`, judge accuracy against the bible and the owning rule
  documents; creative decisions and course facts are not audit findings.
- Out of scope: `docs/exam-specs/**`, both `graphify-out/` trees, working notes
  under `.opencode/scratchpad/**`, generated `src/content/authored/**`, and
  this guide — it is the standard other files are audited against, not an
  audited file.
- Judge `README.md` as developer-facing prose; judge `COVERAGE.md` against
  the split-governance rules above, not the general content rules.
