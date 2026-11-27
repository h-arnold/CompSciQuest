# Testing strategy

A matrix row is `COVERED` only when it records verification evidence from an
approved mechanism, with the mechanism and the evidence path in the row.
Red-first applies to the deterministic core; UI, browser and narrative work is
verification-led.

## Verification evidence

| Mechanism                 | Use for                                                                                                                                | Evidence                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Deterministic Vitest test | Core logic: parser, command resolution, effects, conditions, scoring, persistence, content validation and renderer security invariants | Named test and the slice's red report         |
| Browser E2E assertion     | Player-visible outcomes and each rendered surface                                                                                      | Assertion in an `e2e/` spec and the QA report |
| Playtest observation      | Player-facing quality, fairness, clue access and prose                                                                                 | Named report and screenshot from the playtest |
| Documentation review      | Documentation-only changes (developer docs, agent briefs, `AGENTS.md`)                                                                 | Review note or docs-freeze report             |

Record the evidence as `mechanism: path` in the matrix row. A row without that
entry stays `SPECIFIED`, `UNMAPPED` or `GAP`. Do not create a Vitest test solely
to mark a row covered, and do not fabricate a red report for a verification-led
slice. For a documentation row, record `docs: path` to a docs agent review note
or docs-freeze report that records the change, with the markdownlint and
targeted Prettier check results; no Vitest, E2E or playtest evidence is required.

A row whose expected result rests on a code-lead or worker reading of a silent
specification stays `SPECIFIED` (or `GAP` when no document is named to decide it)
even if a test passes, and its `verification evidence` cell must state that the
evidence is a recorded reading, not a settled contract.

Deterministic-core slices start from a red Vitest test. UI, browser and
narrative/player-facing slices go straight to implementation; E2E and playtest
are their primary gates. See [Sequencing](#sequencing) for when E2E is authored.
A deterministic-core slice has a red report, a UI or browser slice has E2E/QA
evidence, an accepted content area has W7 playtest evidence, and a
documentation-only slice has a docs review note or docs-freeze report.

## Sequencing

E2E tests encode confirmed behaviour, not proposed behaviour. A new E2E test is
authored only after the behaviour it pins has been observed and its findings
resolved. The order is:

1. Deterministic core: red test → implementation → review, unchanged.
2. UI/browser slice: implement → `browser-tester` MCP exploration and screenshots
   → QA report → findings fixed. Author no durable E2E in this pass.
3. Content area: W6 handoff → blind W7 playtest → findings routed to owners →
   fixes land.
4. Then `browser-tester` authors E2E for the confirmed command sequence and
   state transitions, plus one focused regression per playtest bug.

Conditions:

- Keep the W7 playtest blind: do not hand `play-tester` the intended trace as a
  script. Ask it to record the exact commands typed and the transcript observed,
  so there is a real sequence to encode afterwards.
- Pin a minimal, stable subset in E2E, not a full replay of the playthrough: a
  state transition, a persistence boundary, a bug regression or a channel/DOM
  seam. Quiz order is randomised and several paths are valid, so replaying every
  step just moves the churn.
- For a known-bug fix, write the regression test first, then fix. The playtest
  ordering applies to new player-facing behaviour, not an existing failure with
  a clear reproduction.
- Do not apply this ordering retroactively to the existing E2E suite.
- No new evidence mechanism: a UI row stays `SPECIFIED` until its E2E lands, then
  becomes `COVERED`; content rows remain covered by playtest evidence.

## Test-value filter

Ask these questions in order before adding a test:

1. Would a blind playtester tracing the area notice this failure? If yes, the
   playtest is the detector. Add a test only when it was a real bug and a
   permanent guard is wanted.
2. Would nobody notice but the product break — corrupt save, data loss,
   injection, broken references or wrong scoring? Add a deterministic test.
3. Is it exhaustive over a space no human will walk — every alias, every content
   reference, every token type? Write one unit test, in one place only.
4. Does it pin a string an author will legitimately change? Derive the value
   from the source of truth or drop the assertion.
5. Does it exist only to satisfy a process gate? Drop it.

## Keep and drop

Keep:

- deterministic core logic;
- renderer security and invariants: raw HTML inert, images alt-only with no
  request, a link allowlist and no HTML-string writes;
- one browser contract per rendered surface;
- content gates;
- save/load and persistence;
- one focused regression test per playtest bug, named with the bug ID, at the
  lowest reliable level; do not expand it into hypothetical variants.

Drop or stop creating:

- fake-DOM node-shape assertions — the fake DOM is not a browser;
- exhaustive renderer token-by-token catalogues;
- duplicate pins of the same generated copy in several files;
- E2E selector bookkeeping repeated across specs — centralise selectors in one
  helper and keep distinct flows;
- weak count assertions;
- tests created purely to satisfy a matrix row.

## Generated copy and shared constants

Pin each exact string once at its source of truth. Everywhere else, assert
behaviour or a value derived from the bundle or a constant. The `##` versus
`###` room-heading level is centralised in `src/core/RoomText.ts`
(`ROOM_HEADING`), so a future change touches one constant.
