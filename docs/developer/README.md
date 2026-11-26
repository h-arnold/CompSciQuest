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
| [shared-rules.md](shared-rules.md)             | Conditions, triggers, effects, scheduler, seeded Random; owns the turn-pipeline contract (phase order, event batching and observer ordering).                                      |
| [application-and-ui.md](application-and-ui.md) | Application shell and canonical content bundle: boot, Game façade, Command/GameEvent unions, UI layout and view model, behavioural signatures, effect/event mapping and win check. |
| [storage-schema.md](storage-schema.md)         | Save DTOs, validation, `LoadResult`, quarantine, restore-time derivation.                                                                                                          |

## Content pipeline

| Doc                                          | Owns                                                                                                                  |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [content-rules.md](content-rules.md)         | The authoring rulebook: W1–W7 workflow, N/P/C/H/D/V rules, the shared agent contract.                                 |
| [content-toolchain.md](content-toolchain.md) | YAML scaffolds, Zod shapes, validator, generator, committed generated TypeScript and the authoring-to-bundle handoff. |

## Subsystems

| Doc                      | Owns                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| [combat.md](combat.md)   | Adversarial quiz combat: questions, grading, pass/fail effects, retries, seeded question order. |
| [hazards.md](hazards.md) | Declarative, scheduled life-loss rules.                                                         |
| [hints.md](hints.md)     | Escalating hint ladders, cooldowns and score penalties.                                         |
| [npcs.md](npcs.md)       | Actors, actor states, conversation topics, `ConvNode`, knowledge gating, `TopicResolver`.       |
| [puzzles.md](puzzles.md) | Action-flag puzzle completion, rewards and Puzzle Dependency Graph validation.                  |

## Documentation outside this folder

- `docs/content/` — authored game content and its canonical records; owned by
  the `content-editor` agent and governed by
  [content-rules.md](content-rules.md) and the content bible.
  [Difficulty and fairness](../content/difficulty-and-fairness.md) owns
  cross-content guidance on puzzle fairness, clue access, hints, combat
  readability, failure and playtest difficulty.
- `docs/coverage/COVERAGE.md` — the spec → topic → room → code mapping;
  split-governed (see
  [documentation-style-guide.md](documentation-style-guide.md#coveragemd-is-split-governed)).
- `docs/exam-specs/` — read-only authority for course facts.
- Root `README.md` — environment, toolchain and setup.
- Root `AGENTS.md` — delegation contract and routing.
