# Developer documentation index

One owning document per subject. Where two docs need the same rule, the full
statement lives in the owner and the other links to it; see
[documentation-style-guide.md](documentation-style-guide.md) for the writing
rules, which this index follows.

## Style and governance

| Doc                                                          | Owns                                                                                           |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| [documentation-style-guide.md](documentation-style-guide.md) | Writing rules, audience, ownership, decisions and audit scope for all developer documentation. |
| [README.md](README.md)                                       | This index.                                                                                    |

## Architecture and cross-cutting contracts

| Doc                                            | Owns                                                                                                                          |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [architecture.md](architecture.md)             | Original scaffold: module map, class responsibilities, subsystem doc map (§12) and build order.                               |
| [shared-rules.md](shared-rules.md)             | Conditions, triggers, effects, scheduler, seeded `Random`, per-turn event buffer and observer order — owns the turn pipeline. |
| [application-and-ui.md](application-and-ui.md) | Application shell: boot, `Game` façade, `Command`/`GameEvent` unions, UI layout, view model, end-state ownership.             |
| [storage-schema.md](storage-schema.md)         | Save DTOs, validation, `LoadResult`, quarantine, restore-time derivation.                                                     |

## Content pipeline

| Doc                                          | Owns                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------- |
| [content-rules.md](content-rules.md)         | The authoring rulebook: W1–W7 workflow, N/P/C/H/D/V rules, the shared agent contract. |
| [content-toolchain.md](content-toolchain.md) | YAML scaffolds, Zod shapes, validator, generator, generated bundle, W6 ownership.     |

## Subsystems

| Doc                      | Owns                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| [combat.md](combat.md)   | Adversarial quiz combat: questions, grading, pass/fail effects, retries, seeded question order. |
| [hazards.md](hazards.md) | Declarative, scheduled life-loss rules.                                                         |
| [hints.md](hints.md)     | Escalating hint ladders, cooldowns and score penalties.                                         |
| [npcs.md](npcs.md)       | Actors, actor states, conversation topics, `ConvNode`, knowledge gating, `TopicResolver`.       |
| [puzzles.md](puzzles.md) | Action-flag puzzle completion, rewards and Puzzle Dependency Graph validation.                  |

## Elsewhere

- `docs/content/` — authored game content (bible, topic files, YAML cards,
  traces); owned by the `content-editor` agent, not governed by the style
  guide.
- `docs/coverage/COVERAGE.md` — the spec → topic → room → code mapping;
  split-governed (content editor owns states, the `docs` agent owns form).
- `docs/exam-specs/wjec-unit1.md` — read-only authority for course facts.
- Root `README.md` — environment, toolchain and setup.
- Root `AGENTS.md` — delegation contract and routing.
