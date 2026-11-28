# Developer documentation index

This index names the subject each developer doc owns. See
[documentation-style-guide.md](documentation-style-guide.md) for the ownership
and writing rules.

## Style and governance

| Doc                                                          | Owns                                                                                                       |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| [documentation-style-guide.md](documentation-style-guide.md) | Writing rules, audience, ownership, decision-record rules and audit scope for all developer documentation. |
| [README.md](README.md)                                       | This index.                                                                                                |

## Architecture and cross-cutting contracts

| Doc                                            | Owns                                                                                                                                                                               |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [architecture.md](architecture.md)             | Layer boundaries and dependency direction, module layout, module responsibilities and code conventions.                                                                            |
| [testing.md](testing.md)                       | Testing strategy: verification evidence, red-first scope, test-value filter and generated-copy pinning.                                                                            |
| [shared-rules.md](shared-rules.md)             | Conditions, triggers, effects, scheduler, seeded Random; owns the turn-pipeline contract (phase order, event batching and observer ordering).                                      |
| [application-and-ui.md](application-and-ui.md) | Application shell and canonical content bundle: boot, Game façade, Command/GameEvent unions, UI layout and view model, behavioural signatures, effect/event mapping and win check. |
| [storage-schema.md](storage-schema.md)         | Save DTOs, validation, `LoadResult`, quarantine, restore-time derivation.                                                                                                          |

## Content pipeline

| Doc                                                | Owns                                                                                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [content-toolchain.md](content-toolchain.md)       | YAML authoring format, review labels, D/V1 rules, scaffolds, Zod shapes, validator, generator and committed generated TypeScript.      |
| [writer-agent-pattern.md](writer-agent-pattern.md) | The three layers of content writing — writer agent file, contract document, cross-cutting rules — and the templates for the first two. |

The W1–W7 workflow and its gates live in `.opencode/agents/content-editor.md`.
Content rules live in the bible, `narrative-principles.md`, the subsystem
contract docs and the toolchain.

## Subsystems

| Doc                      | Owns                                                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| [areas.md](areas.md)     | Area, room and item authoring (N4–N6, N8), card format, world ownership and exits.                                    |
| [combat.md](combat.md)   | Quiz authoring (P3–P5) and adversarial combat: questions, grading, pass/fail effects, retries, seeded question order. |
| [hazards.md](hazards.md) | Hazard authoring (H1) and declarative, scheduled life-loss rules.                                                     |
| [hints.md](hints.md)     | Hint authoring (H2, H3): escalating ladders, cooldowns and score penalties.                                           |
| [npcs.md](npcs.md)       | NPC authoring (A1–A6, T1–T6, D6), actors, states, topics, `ConvNode`, knowledge gating and `TopicResolver`.           |
| [puzzles.md](puzzles.md) | Puzzle authoring (N7) and action-flag completion, rewards and Puzzle Dependency Graph validation.                     |

## Documentation outside this folder

- `docs/content/` — authored game content and its canonical records; maintained
  by the `docs` agent, with creative decisions owned by `content-editor` and the
  user. Governed by the content bible and the owning rule documents.
  [Difficulty and fairness](../content/difficulty-and-fairness.md) owns
  cross-content guidance on puzzle fairness, clue access, hints, combat
  readability, failure and playtest difficulty.
- `docs/coverage/COVERAGE.md` — the spec → topic → room → code mapping;
  split-governed (see
  [documentation-style-guide.md](documentation-style-guide.md#coveragemd-is-split-governed)).
- `docs/exam-specs/` — read-only authority for course facts.
- Root `README.md` — environment, toolchain and setup.
- Root `AGENTS.md` — delegation contract and routing.
