# Content authoring rules

## 1. Purpose and authority

This file is the rulebook for cross-cutting game **content** rules: rooms, items, quizzes, puzzles, hazards, hints and the prose that binds them. NPC and conversation rules are owned by [npcs.md](npcs.md); apply both this file and that subsystem doc. The runtime contracts live in the subsystem documents and [architecture.md](architecture.md); this file defines how content is designed so those contracts are filled consistently, and by whom.

Authority order when sources disagree:

| Question                         | Authority order                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------- |
| Course facts                     | `docs/exam-specs/wjec-unit1.md` and the PDF → `docs/coverage/COVERAGE.md` → bible |
| Data shape and runtime behaviour | subsystem docs + [shared-rules.md](shared-rules.md) → this file                   |
| Authoring practice               | this file → bible                                                                 |
| Authoring mechanism              | [content-toolchain.md](content-toolchain.md) → this file                          |
| Creative choices                 | bible, subject to the rules below                                                 |

Definitions used throughout:

- **Bible** — `docs/content/content-bible.md`: the premise, pillars, area list, cast, hazard themes, topic allocation, Puzzle Dependency Graph (PDG) and ID/alias registry. Co-authored with the user; changed only with their approval.
- **Card** — a YAML file under `docs/content/<area-id>/` specifying one kind of content, or `docs/content/spec-topics.yaml` for the cross-area spec topics. [content-toolchain.md](content-toolchain.md) owns file names, scaffolds and generation.
- **Artefact** — one defined object inside a card (a room, an NPC, a quiz, a hint level…).
- **Ownership** — an artefact belongs in the card of the area that uses it, never in an unrelated area for convenience (`docs/content/content-bible.md` §4.2). A game-wide actor's artefacts may be split between area cards; cross-card `actorId` binding is valid.
- **Brief** — the self-contained task the editor sends to a writer. Subagents start with fresh context, so a brief must contain everything the writer needs.
- **Validator** — `npm run content:validate`: the structural checks in [content-toolchain.md §4](content-toolchain.md#4-validation) and the §7 gates. Its findings are structural; it does not judge prose or subject accuracy.
- **Generator** — `npm run content:generate`: emits the committed `src/content/authored/*.ts` files from validated YAML ([content-toolchain.md §5](content-toolchain.md#5-generation)). It is mechanical and never changes content.
- **Reviewers** — `content-critic` checks rule, prose and data-shape conformance; `pck-reviewer` checks subject-matter accuracy against Unit 1 and appropriateness for a GCSE learner. Both are read-only and independent of the writers.

### 1.1 How to read the rules

Use these labels in briefs, card notes, reviewer findings and this rulebook:

| Label        | Meaning                                                       | Failure handling                                                        |
| ------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **MUST**     | Required for acceptance.                                      | Blocker or major finding; the card cannot be approved while it is open. |
| **SHOULD**   | Expected quality default, not a hidden acceptance test.       | Minor finding, or major if repeated across a card set.                  |
| **MUST NOT** | Forbidden in authored content, even when the rest is correct. | Blocker or major finding, according to the cited rule.                  |

A rule ID owns its rule. The labels and priority index below organise reading; they do not replace the cited rule or change its meaning.

### 1.2 Start here by role

| Reader           | Start with                                                                                                                                                                               | Needs                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| NPC writer       | [npcs.md start here](npcs.md#write-the-dialogue-first), [A rules](npcs.md#authoring-conversation-rules-a), [§8](npcs.md#8-npc-card-format), [§9](npcs.md#9-reviewer-and-playtest-checks) | Tone, goal, flair, plan fields and review tests.            |
| `content-critic` | §3.1 and §6.1, plus [npcs.md A/T rules](npcs.md#write-the-dialogue-first) and [§9](npcs.md#9-reviewer-and-playtest-checks) for NPC cards                                                 | Cross-cutting checks, then NPC structure and prose quality. |
| `pck-reviewer`   | §6.2 and [npcs.md §9](npcs.md#9-reviewer-and-playtest-checks)                                                                                                                            | Learner comprehension and course accuracy only.             |
| Implementer      | [npcs.md T rules](npcs.md#technical-conversation-rules-t), [D6](npcs.md#dialogue-plan-metadata-d6), [§8](npcs.md#8-npc-card-format) and [§10](npcs.md#10-structural-validation-gates)    | NPC runtime fields, bindings and authoring-only metadata.   |
| Editor           | §2 workflow gates, §3.1 and the V rules                                                                                                                                                  | Sign-off evidence and playtest requirements.                |

## 2. Workflow gates

- **W1 — Ideation (editor + user).** No content is written yet. The editor co-develops the bible with the user, offering concrete options and resolving conflicts against the exam spec. The bible is written to `docs/content/content-bible.md`.
- **W2 — Approval.** The editor summarises the bible and asks the user to approve it. **No writer is launched before approval.** Revision requests update the bible, not individual cards.
- **W3 — Dispatch.** The editor sends one brief per (area, kind) to the relevant writer. Each brief:
  - **MUST** name the YAML scaffold path, the relevant schema slice, assigned IDs and aliases, topic IDs and the applicable rule IDs.
  - **MUST** name the owning area card for every artefact, following the ownership definition above.
  - **MUST** name `docs/content/difficulty-and-fairness.md` for puzzle, hint, quiz, hazard and clue-bearing room briefs, and require the writer to report the fairness checks it applies.
  - **MUST** follow the NPC brief requirements in [npcs.md §11](npcs.md#11-agent-acceptance-for-npc-cards), including the approved tone mode, address form and D6 dialogue plan.
  - **SHOULD** group IDs by artefact so the writer can check ownership without searching the bible.

  Independent briefs may run in parallel; one writer owns each output file to avoid conflicts.

- **W4 — Review.** `npm run content:validate` must pass on the card set before either reviewer runs; findings route back to the owning writer like any other blocker (D5). The editor then launches `content-critic` and `pck-reviewer` in parallel on the returned cards and resolves every blocker and major finding from **both** by sending the card back to its writer. Cross-artefact contradictions are fixed by updating the bible and re-briefing. A card is not accepted until both reviewers return `PASS` or `PASS WITH MINORS` with no blockers or majors. When every card in the area is accepted, the editor drafts the walkthrough trace (V4) from the same validated data and launches a final `content-critic` pass over the whole card set **plus** that trace; blockers and majors are routed back to the owning writer or into the bible and re-briefed.
- **W5 — Integration.** The editor integrates the accepted area in this order:
  1. Write the accepted trace to `docs/content/walkthrough.md` (V4).
  2. Update `docs/coverage/COVERAGE.md` and `docs/content/status.md`.
  3. Report to the user what changed, what is blocked and the open questions.
  4. Hand the accepted area to `code-lead` for W6.

  When the last area is integrated, the editor extends the trace across all areas and records a final whole-game verdict before sign-off. Scratchpad entries are working notes only: a state, verdict, ID, flag, topic or coverage fact also goes into its canonical doc (`docs/content/status.md`, `docs/coverage/COVERAGE.md`, `docs/content/walkthrough.md` or `docs/content/content-bible.md`), because a scratchpad file alone is not the record.

- **W6 — Generate.** `code-lead` runs `npm run content:validate`, `npm run content:generate`, `npm test`, `npm run typecheck`, `npm run lint` and `npx prettier --check` on the changed files, and commits the generated TypeScript. Generation is a mechanical handoff, not a second authoring pass; [content-toolchain.md §4](content-toolchain.md#4-validation) and [§5](content-toolchain.md#5-generation) own the commands' mechanics.
- **W7 — Content playtest.** After W6, `content-editor` dispatches `play-tester` directly. The brief:
  - **MUST** use `Purpose: content playability and effectiveness review`.
  - **MUST** supply the accepted area's ordered path, gate table and reachability table from `docs/content/walkthrough.md` as expected outcomes (V5).
  - **MUST** require `docs/content/difficulty-and-fairness.md`.

  The tester:

  - **MUST** play the running app with ordinary player commands and the generated authored content.
  - **MUST** record screenshot evidence for each gated exit, item action, quiz, puzzle, hazard and `game-won` transition.
  - **MUST** compare what happened with what the trace claims.
  - **MUST** assess clue discoverability, puzzle fairness, hint usefulness, quiz and hazard readability, failure and retry friction, and age-appropriate challenge.
  - **MUST** follow the NPC playtest checks in [npcs.md §9](npcs.md#9-reviewer-and-playtest-checks) for NPC-focused areas.
  - **MUST** route findings about cards, IDs, flags or prose back to `content-editor` for the owning writer or the bible; code findings route back to the owning `code-lead` slice.

  The playtest **MUST NOT** be scripted or replace the critic's read-only V4 trace audit. A `code-lead` dispatch for functional verification uses `Purpose: functional verification only` and does not perform this difficulty assessment.

## 3. Rule catalogue

Every finding from the critic and every brief from the editor cites the owning rule ID: this rulebook for cross-cutting rules and [npcs.md authoring rules](npcs.md#write-the-dialogue-first) for NPC rules. Rule IDs are immutable without the user's agreement.

### 3.1 Priority index

Apply the catalogue in this order. This is a **reading and review order**, not a severity scale: each rule keeps its own finding level. A lower-priority pass never overrides a higher-priority finding. For NPC cards, apply the NPC priority index in [npcs.md start here](npcs.md#write-the-dialogue-first) alongside this one.

| Priority | Apply first to                             | Rules                                                         | Owner of the first check           |
| -------- | ------------------------------------------ | ------------------------------------------------------------- | ---------------------------------- |
| **P0**   | Course truth, harm and structural data     | `PCK-*` tags, H1–H3, N1, N3, D1–D5, V1                        | `content:validate`, `pck-reviewer` |
| **P1**   | Player comprehension and fair progress     | N5–N9, V4                                                     | `content-critic`, V4 trace         |
| **P2**   | Runtime and content-effectiveness playtest | V5                                                            | `play-tester`                      |
| **P3**   | Structure, gating and pedagogy             | N2, N7, P1–P6, V2, V3                                         | `content-critic`, editor           |
| **P4**   | Register and style polish                  | N4, N8 and the guidance linked from `narrative-principles.md` | `content-critic`                   |

### 3.2 Catalogue by family

The family order below covers N, P, H, D and V. NPC authoring rules (A1–A6), technical rules (T1–T6) and D6 dialogue-plan metadata are owned by [npcs.md authoring rules](npcs.md#write-the-dialogue-first); apply that table with the priorities in [§3.1](#31-priority-index).

### N — Narrative

- **N1 — Premise and pillars.** The bible states a one-sentence premise and 3–5 thematic pillars. Every area, character and hazard must trace to at least one pillar; the editor rejects content that cannot.
- **N2 — Key-node spine.** Use a linear spine of mandatory key nodes (opening, mid-point gate, climax, resolution) with non-linear clusters of rooms between them. Clusters reconverge at gates. Never build an unbounded branching tree, and never a maze.
- **N3 — Diegetic learning.** GCSE concepts are mechanisms of the fictional world, not interruptions to it. A quiz is an in-world challenge issued by a character; a puzzle is a task that uses the concept. "Stop and answer a question" with no fictional framing is not acceptable.
- **N4 — Voice.** All text is second person, present tense, in one consistent register. Failed commands, unknown topics and hint text stay in voice. The bible defines the register; a card that drifts from it is a major finding.
- **N5 — Feedback for every command.** Every submitted command produces text. Failure text gives new information — a clue, a sensory detail, a character reaction — never a bare "you can't" or "nothing happens". This includes `use` on the wrong target and `answer` outside a quiz.
- **N6 — Fair gates.** Every locked exit or puzzle has an in-fiction justification and at least two discoverable clues placed in room descriptions, NPC dialogue or item text. No guess-the-verb or guess-the-noun traps: verbs come from the agreed parser list and nouns from the editor's alias registry.
- **N7 — Ancestor-only references.** A puzzle's prose may mention plot points only from that puzzle's ancestor set in the PDG, as guaranteed by [puzzles.md §4](puzzles.md#4-puzzle-dependency-graph). Never assume the player solved earlier nodes in a particular order.
- **N8 — Prose length.** Room descriptions are at most 200 words. This is a ceiling, not a target: most rooms should be shorter, and the extra room is for places where description genuinely helps the player. Longer passages are reserved for key nodes and NPC explanations. Avoid walls of text; vary rhythm between short traversal text and richer set pieces.
- **N9 — Player-facing comprehension.**
  Priority: P1 · Applies to: all player-facing prose · Checked by: `content-critic` and `pck-reviewer`

  **MUST**
  - Let a typical 14–16 year-old identify the point of a line and its bearing on the current situation without authoring vocabulary or engine knowledge.

  **MUST NOT**
  - Merely restate an instruction, list global mechanics or expose the game's design constraints. A breach is a major finding.

### P — Pedagogy and course mapping

- **P1 — Topic contract.** Every room declares `topicIds`, every puzzle and quiz declares `topicId`, and every hint sequence declares `targets` (§4); a room with no teaching purpose is explicitly marked `navigation-only`. Room `topicIds` are authoring references used by the gates and coverage mapping, not a runtime field of `RoomDefinition`. Topic IDs must match a `## Topic: <id>` heading in `docs/coverage/COVERAGE.md` exactly, with a spec reference and an evidence note. Writers never invent topic IDs.
- **P2 — Three beats per topic.** Where the spec calls for it, a topic has a teaching beat (NPC explanation or dialogue), a retrieval beat (quiz question) and an application beat (puzzle or other in-world action). A topic with only a quiz is incomplete.
- **P3 — Assessment objectives.** Every quiz question is tagged `AO1`, `AO2` or `AO3` plus a difficulty. Each quiz contains at least one `AO1` and one `AO2` question; `AO3` is used for design/evaluation topics (algorithms, SDLC). Tags are authoring metadata, dropped by the generator.
- **P4 — Distractors and explanations.** Wrong options are plausible misconceptions drawn from the spec, never nonsense options. Every answer, right or wrong, produces an explanation that says why the key is correct and, where useful, why the chosen distractor is wrong ([combat.md §2](combat.md#2-model)).
- **P5 — Retrieval loop.** Quizzes have no timer. `passMark` is a count, not a percentage. Retries are unlimited unless the editor explicitly assigns `attemptsAllowed`. Failure costs a life and returns the player to the declared level start; it never resets topic or puzzle progress ([combat.md §3](combat.md#3-flow)).
- **P6 — Score integrity.** Content declares each room, puzzle and quiz `score` but never writes score itself. `ScoreTracker` awards from the achievement events for covered topics with evidence; `complete-topic` / `topic-completed` records completion and awards nothing ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)). Hints default to zero penalty.

### H — Hazards and hints

- **H1 — Hazards are telegraphed.** Each hazard has at least one clue in the room description or NPC dialogue before it can fire. Harm is a brief penalty, not a puzzle: lose a life, return to the declared level start, optionally reset level-local flags. Never reset puzzle phase ([hazards.md §4](hazards.md#4-failure-consequences)).
- **H2 — Hint ladders.** A sequence has 2–4 levels that escalate nudge → structure → procedure. No level reveals the answer or solves the puzzle; the player must still answer ([hints.md §4](hints.md#4-adaptive-behaviour)). Levels are gated by `unlock` conditions using only the agreed counter keys. `targets` links the ladder to puzzle, quiz and spec-topic IDs so `HintSystem` can resolve context ([hints.md §2](hints.md#2-model)). Default `scorePenalty` is 0.
- **H3 — Adaptive hints.** Automatic hints fire only after genuine stuck evidence: a wrong answer increments `failed-attempts:<quizId>`, or N stuck turns increments `turns-since:<puzzleId>`. Do not set `autoOfferAfter` so low that it offers help before the player has tried.

### D — Data and cards

- **D1 — YAML cards only.** Writers populate YAML cards under `docs/content/<area-id>/` from the schema-driven scaffolds. They never edit the schema, validator, generator, generated TypeScript, engine code, `src/`, the rulebook, agent files or `opencode.json`. There is no hand conversion to TypeScript.
- **D2 — Editor-owned IDs.** IDs are kebab-case with a kind prefix: `room-`, `item-`, `npc-`, `actorstate-`, `topic-`, `node-`, `area-`, `world-`, `quiz-`, `q-`, `puzzle-`, `hazard-`, `hint-`. The editor allocates IDs and aliases in the bible; writers never invent one outside their brief.
- **D3 — Runtime data shape.** Runtime fields use exactly the names and types in the subsystem docs and appear as YAML keys of the same names, except the exit `to` → `targetRoomId` and `conditions` → `preconditions` renames ([content-toolchain.md §5](content-toolchain.md#5-generation)). Only plain strings, numbers, arrays and records are allowed; omit optional fields rather than assigning `undefined` or `null` ([storage-schema.md §3](storage-schema.md#3-persisted-shape-canonical)). Prose is written as block scalars (`>-` or `|-`). `AreaDefinition.roomIds` is derived from the order of `rooms` and `ConversationNode.topics` is resolved from the node's `topicIds`; neither is authored. Each item declares its `initialRoom`; after that, ownership lives on Player, NPC or Room state. An item may also declare the optional `refusalText` string, the in-world response when a non-portable item is taken; omit it when absent or empty, since an empty value falls back to the default refusal ([application-and-ui.md §3.2/§5.2](application-and-ui.md#32-world-area-room-and-item-definitions)).
- **D4 — Authoring metadata is separate.** Keys such as `assessmentObjective`, `difficulty`, `clues`, `misconception`, `role`, `voice`, `motivation`, `relationship`, `telegraph`, `interesting` and `useNotes` live under an `authoring:` block on the artefact. The generator drops that block wholesale, so nothing in it reaches the engine; a stray authoring key outside the block is a validation finding. `startRoomId` is a runtime field of the area definition; `levelStart` is retired. Room `topicIds` are a separate authoring reference used by the gates; the generator does not copy them into `RoomDefinition`.
- **D5 — Validated YAML is the handoff.** A card set is not ready for review or generation until `content:validate` passes with no findings. Validation is a structural gate before `content-critic` and `pck-reviewer`, never a replacement for either. [§7](#7-structural-validation-gates) states which gates also run against the runtime bundle at boot and in tests.

### V — Validation

- **V1 — Structural gates.** The eight checks in §7 are implemented by `content:validate` as Zod shapes plus plain TypeScript cross-artefact gates, and must pass before a card set is accepted, before either reviewer runs and before generation (D5). [§7](#7-structural-validation-gates) states which gates also run against the runtime bundle.
- **V2 — Independent review.** `content-critic` reviews every card set against the N/P/H/D rules in this file and the A/T rules in [npcs.md](npcs.md#write-the-dialogue-first), using the rubric in §6.1 and the NPC checks in [npcs.md §9](npcs.md#9-reviewer-and-playtest-checks). `pck-reviewer` checks accuracy against `wjec-unit1.md`, GCSE-level scope, terminology and cognitive load using §6.2. Every blocker and major finding from either reviewer is resolved before integration.
- **V3 — Editor sign-off.** The editor checks cross-artefact consistency, updates `docs/coverage/COVERAGE.md` with spec references and evidence, and records status in `docs/content/status.md`. A topic is marked `covered` only when a card supplies real teaching and assessment evidence.
- **V4 — Walkthrough audit.**
  Priority: P1 · Applies to: each accepted area and finally the whole game · Checked by: editor, then `content-critic`

  **MUST**
  - Trace at least one complete, ordered path from each area's `startRoomId` to `game-won` and record it in `docs/content/walkthrough.md`.
  - Prove that every gate condition can be satisfied in-world.
  - Prove that every declared room, exit, item, NPC topic, quiz, puzzle, hazard trigger and hint target is reachable or triggerable.
  - Prove that no dependency creates a soft-lock or an unreachable option.
  - Follow the NPC beat evidence rules in [npcs.md §9](npcs.md#9-reviewer-and-playtest-checks).
  - Have `content-critic` verify the trace read-only on the final pass described in W4.

  **MUST NOT**
  - Integrate an area whose contribution to the win set cannot be demonstrated.

- **V5 — Runtime and content-effectiveness playtest.**
  Priority: P2 · Applies to: each accepted area after W6 generation · Checked by: `play-tester`

  **MUST**
  - Play the running app with the real authored content bundle after the accepted area is generated in W6.
  - Confirm that each gate, completion source and `game-won` transition behaves as the V4 trace expects.
  - Assess the difficulty and fairness guidance in `docs/content/difficulty-and-fairness.md`.
  - For NPC-focused areas, apply the playtest checks in [npcs.md §9](npcs.md#9-reviewer-and-playtest-checks).
  - Use the W7 playtest report and its screenshots as evidence.
  - Route each mismatch to the content owner or the code owner as appropriate.

  **MUST NOT**
  - Replace the critic's read-only trace audit or a separate functional-verification brief.

## 4. Design card format

### 4.1 Common conventions

One YAML file per (area, kind), named as in the table below, under
`docs/content/<area-id>/`. An artefact goes in the card of the area that uses it
(the ownership definition in §1); a shared actor may therefore have artefacts in
several area cards without changing this one-file-per-(area, kind) rule. Every
file carries document metadata, then one or more named collections:

```yaml
kind: npc # area | npc | quiz | puzzle | hazard | hint
areaId: 1-1-computer-architecture
status: draft # draft | reviewed | approved
topicIds: [cpu-components, fetch-decode-execute]

actors:
  - id: npc-archivist
    aliases: [archivist, keeper]
    initialStateId: actorstate-ready
```

Every artefact has an `id` from the §5 registry. Runtime keys use exactly the
names in the subsystem documents (D3), so optional fields are omitted rather
than set to `null`. Prose uses block scalars (`>-` or `|-`), which keeps long
descriptions readable and literal text unchanged. Authoring metadata lives under
an `authoring:` block and is dropped wholesale by the generator (D4). Conditions,
triggers and effects use only the unions in [shared-rules.md](shared-rules.md).
`docs/content/spec-topics.yaml` is the single non-per-area card; it holds spec
topics for all areas.

The examples in §4.2–§4.7 are partial excerpts: they show the shape of each
collection, not a complete card. IDs referenced but not defined in an excerpt
(for example `topic-fde-why`, `q-fde-2` or `puzzle-find-key`) are declared
elsewhere in that card set, and the §7 gates check that every such reference
resolves in the card set.

| Kind   | File           | Top-level collections                                              |
| ------ | -------------- | ------------------------------------------------------------------ |
| area   | `rooms.yaml`   | `definition`, `worlds`, `rooms`, `items`                           |
| npc    | `npcs.yaml`    | `actors`, `actorStates`, `conversationTopics`, `conversationNodes` |
| quiz   | `quizzes.yaml` | `quizzes`, `questions`                                             |
| puzzle | `puzzles.yaml` | `puzzles`                                                          |
| hazard | `hazards.yaml` | `hazards`                                                          |
| hint   | `hints.yaml`   | `hintSequences`                                                    |

### 4.2 Area and rooms card

`rooms.yaml` holds the area `definition`, at most one `worlds` entry, and the
`rooms` and `items` collections. A world is declared exactly once, in the area
whose `startAreaId` names it; other areas in that world set only
`definition.worldId` and must not declare a second world. `AreaDefinition.roomIds`
is derived from the order of `rooms` and is not authored.

```yaml
kind: area
areaId: 1-1-computer-architecture
status: draft
topicIds: [cpu-components, fetch-decode-execute]

definition:
  id: area-1-1-computer-architecture
  worldId: world-1-computer-architecture
  name: Computer Architecture
  startRoomId: room-cpu-lab # runtime level start for hazards and quiz failures
  lives: 3

worlds:
  - id: world-1-computer-architecture
    name: Computer Architecture
    areaIds: [area-1-1-computer-architecture]
    startAreaId: area-1-1-computer-architecture
    lives: 3

rooms:
  - id: room-cpu-lab
    title: The CPU Lab
    aliases: [lab, cpu lab] # authoring-only; the generator drops room aliases
    description: >-
      ... # ≤200 words (ceiling, not a target), second person present (N4, N8)
    topicIds: [cpu-components]
    exits:
      - direction: north
        to: room-memory-vault
      - direction: west
        to: room-bus-way
        conditions:
          - { kind: flag-set, flag: bus-mapped }
    score: 0 # first-visit award; 0 when not scoreable
    authoring:
      interesting: The sensory and affordance hook.

items:
  - id: item-register-cache
    name: register cache
    aliases: [cache, registers]
    portable: true
    # refusalText: ... # optional; in-world take refusal for a non-portable item, omit when absent
    description: >-
      ...
    initialRoom: room-cpu-lab # starting owner; ownership is a Player/NPC/Room property
    authoring:
      useNotes: Which action sets which flag.
```

### 4.3 NPC card

The NPC card format, dialogue plan and binding rules are owned by [npcs.md §8](npcs.md#8-npc-card-format). Use that section instead of this rulebook for `npcs.yaml`.

### 4.4 Quiz card

```yaml
kind: quiz
areaId: 1-1-computer-architecture
status: draft
topicIds: [fetch-decode-execute]

quizzes:
  - id: quiz-fde-cycle
    actorId: npc-archivist
    topicId: fetch-decode-execute
    score: 2 # awarded once on pass; counts towards topic maxScore
    questionIds: [q-fde-1, q-fde-2, q-fde-3]
    passMark: 2
    onPass:
      - { kind: complete-topic, topicId: fetch-decode-execute }
      - { kind: set-flag, flag: quiz-passed:quiz-fde-cycle, value: true }
      - { kind: message, text: ... }
    onFail:
      - { kind: change-lives, delta: -1, reason: ... }
      - { kind: move-player, roomId: room-cpu-lab, reason: ... }
    hintSequenceId: hint-fde

questions:
  - id: q-fde-1
    prompt: >-
      ...
    options: [...]
    correctOptionIds: [1] # 0-based indices; UI shows 1-based
    explanation: >-
      ...
    authoring:
      assessmentObjective: AO1 # P3
      difficulty: easy # P3
      misconception: ... # P4: what wrong answers target
```

### 4.5 Puzzle card

```yaml
kind: puzzle
areaId: 1-1-computer-architecture
status: draft
topicIds: [data-representation]

puzzles:
  - id: puzzle-unlock-cache
    requirements:
      - { kind: flag-set, flag: cache-decoded } # action flags, not possession
    onSolve:
      - { kind: complete-topic, topicId: data-representation }
    topicId: data-representation
    score: 1 # awarded once on solve; topics may be scored per puzzle
    hintSequenceId: hint-cache
    dependsOn: [puzzle-find-key]
    authoring:
      clues:
        - ... # ≥2 discoverable clues, N6
        - ...
```

### 4.6 Hazard card

```yaml
kind: hazard
areaId: 1-1-computer-architecture
status: draft
topicIds: [cpu-components]

hazards:
  - id: hazard-overheat
    trigger: { kind: on-room-enter, roomId: room-cpu-lab }
    when: { kind: not, of: { kind: flag-set, flag: cooling-fitted } }
    effects:
      - { kind: message, text: ... }
      - { kind: change-lives, delta: -1, reason: ... }
      - { kind: move-player, roomId: room-cpu-lab, reason: ... }
    once: true
    authoring:
      telegraph: The clue before harm. # H1
```

### 4.7 Hint card

```yaml
kind: hint
areaId: 1-1-computer-architecture
status: draft
topicIds: [fetch-decode-execute, data-representation]

hintSequences:
  - id: hint-fde
    targets: [fetch-decode-execute, puzzle-unlock-cache]
    levels:
      - level: 1
        text: >-
          ...
        unlock:
          {
            kind: counter-at-least,
            key: failed-attempts:quiz-fde-cycle,
            value: 1,
          }
      - level: 2
        text: >-
          ...
        unlock:
          {
            kind: counter-at-least,
            key: turns-since:puzzle-unlock-cache,
            value: 3,
          }
    cooldownTurns: 2
```

## 5. ID and alias registry

The bible owns one registry table. Writers copy IDs from it verbatim; a request for a new ID goes back to the editor and the user.

| Prefix        | Artefact           | Example                          |
| ------------- | ------------------ | -------------------------------- |
| `room-`       | room               | `room-cpu-lab`                   |
| `item-`       | item               | `item-register-cache`            |
| `npc-`        | actor              | `npc-archivist`                  |
| `actorstate-` | actor state        | `actorstate-ready`               |
| `topic-`      | conversation topic | `topic-fde-explain`              |
| `node-`       | conversation node  | `node-fde`                       |
| `area-`       | area definition    | `area-1-1-computer-architecture` |
| `world-`      | world definition   | `world-1-computer-architecture`  |
| `quiz-`       | quiz               | `quiz-fde-cycle`                 |
| `q-`          | quiz question      | `q-fde-1`                        |
| `puzzle-`     | puzzle             | `puzzle-unlock-cache`            |
| `hazard-`     | hazard             | `hazard-overheat`                |
| `hint-`       | hint sequence      | `hint-fde`                       |

Aliases are lowercase words or short phrases, unique across all items and actors, and listed in the bible before a writer uses them. `NameResolver` matches item and actor names and aliases. A room may declare `aliases` on its card, but the generator drops them and no room name is resolved. A topic ID matching a spec topic uses the exact `## Topic: <id>` heading from `COVERAGE.md`, so the graph can join document and code nodes; no kebab-case conversion is applied.

## 6. Reviewer rubrics

Both reviewers read YAML cards. A passing `content:validate` run is a
precondition (D5), not a substitute: structural correctness says nothing about
voice, fairness or subject accuracy, and reviewer findings still route back to
the writer. V5 is not a card-review rubric: `play-tester` runs the runtime and
content-effectiveness playtest under W7, dispatched directly by `content-editor`;
neither reviewer performs it.

### 6.1 Content critic

`content-critic` is read-only. It returns findings as text in its final message, one per line:

```
[blocker|major|minor] RULE-ID card-path — what is wrong — why — suggested fix
```

Apply the checks in the priority order from §3.1.

**MUST check — in priority order**

| Priority | Check                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0**   | Every applicable N/P/H/D/V rule is cited by ID. IDs and aliases come from the registry; runtime field names are exact; optional fields are omitted; authoring keys stay in `authoring:` blocks; effects and conditions use only the shared unions; action-flag requirements hold (D2–D4, puzzles.md §3); claims about the spec cite a PDF section/page; nothing is marked `covered` without evidence (V3). For NPC cards, apply the A/T/D6 checks in [npcs.md §9](npcs.md#9-reviewer-and-playtest-checks).                                                                                                                                                       |
| **P1**   | Apply `docs/content/difficulty-and-fairness.md`: the player can identify the goal, blocker and tools; clues are discoverable before they are needed; there is no maze or guess-the-verb gate; hints address the stalled step without revealing the answer; quiz and hazard consequences are readable; failure and retry friction are proportionate; puzzle text references only ancestors (N6, N7). On the final whole-card-set pass, every declared room, exit, item, NPC topic, quiz, puzzle, hazard trigger and hint target in scope is reachable or triggerable; the walkthrough yields a valid path to `game-won`; no soft-lock or unreachable option (V4). |
| **P2**   | For NPC cards, apply the authoring tests in [npcs.md A rules](npcs.md#authoring-conversation-rules-a) and the reviewer checks in [npcs.md §9](npcs.md#9-reviewer-and-playtest-checks).                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **P3**   | A spec reference is present; three beats are present where required; distractors are plausible misconceptions; every answer has an explanation; AO1 and AO2 are present; no hint reveals an answer (P1–P4, H2).                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **P4**   | Voice is second person present; failures and defaults stay in voice; no "parser error" phrasing appears (N4). NPC wording length is checked by [npcs.md A4](npcs.md#authoring-conversation-rules-a).                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

**NPC checks.** For NPC cards, apply the authoring and technical tables at the [start of npcs.md](npcs.md#write-the-dialogue-first) and the reviewer checks in [npcs.md §9](npcs.md#9-reviewer-and-playtest-checks). The priority table above still controls cross-cutting severity.

**SHOULD note as minors**

- Prose rhythm or word choice that is serviceable but flat, where no MUST item is breached.

**MUST NOT**

- Accept `content:validate` as proof of prose, fairness or subject accuracy.
- Edit a card or propose new course facts from memory. If a fact is not in `wjec-unit1.md`, record that as a finding.

It ends with a one-line verdict: `PASS`, `PASS WITH MINORS` or `FAIL`.

### 6.2 PCK reviewer

`pck-reviewer` is read-only and independent of `content-critic`. Its authoritative sources are `docs/exam-specs/wjec-unit1.md` (and the cited PDF), `docs/coverage/COVERAGE.md`, the P rules in §3 and the cards under review. Findings use one line each:

```
[blocker|major|minor] TAG card-path — what is wrong — source (section/page) — suggested fix
```

**MUST check**

- Apply the tags in the table below.
- Cite a section or page from the authoritative sources for every finding.
- Apply the NPC comprehension tag in [npcs.md §9](npcs.md#9-reviewer-and-playtest-checks) (`PCK-DIALOGUE`).

**SHOULD note as minors**

- Wording that remains accurate but is denser than GCSE-level prose (`PCK-LOAD`), where no MUST item is breached.

**MUST NOT**

- Use the web or invent course facts.
- Review voice, aliases, IDs or data shape; those belong to `content-critic`.
- Design the fix. Point to the spec section and state the correct claim or appropriate depth.

| Tag              | Check                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PCK-ACC`        | Factual accuracy: every statement, definition, example and quiz key matches the spec. No invented processors, registers, protocols, algorithms or numbers.                                                                                                                                                                                   |
| `PCK-DEPTH`      | Scope stays inside Unit 1; nothing from A-level or professional practice is smuggled in. Respect "should know" versus "should be aware of" as `docs/exam-specs/wjec-unit1.md` records that distinction. Do not present technology as value-free where the spec integrates legal, social, ethical, environmental and professional dimensions. |
| `PCK-TERM`       | Terminology matches the spec; a friendly paraphrase must be accompanied by the formal term. No misleading shorthand.                                                                                                                                                                                                                         |
| `PCK-LOAD`       | Prerequisites come before use; new vocabulary is explained in plain GCSE-level language; text is readable by a typical 14–16 year-old with no assumed prior CS knowledge.                                                                                                                                                                    |
| `PCK-DIALOGUE`   | Defined in [npcs.md §9](npcs.md#9-reviewer-and-playtest-checks) as an authoring comprehension test.                                                                                                                                                                                                                                          |
| `PCK-AO`         | Questions assess the tagged objective and the spec's command words; AO1 and AO2 present; AO3 only for design/evaluation topics (algorithms, SDLC).                                                                                                                                                                                           |
| `PCK-DISTRACTOR` | Wrong options are plausible misconceptions a GCSE learner actually holds, rooted in the spec.                                                                                                                                                                                                                                                |
| `PCK-EVIDENCE`   | A spec reference and evidence note exist; nothing is treated as covered without them.                                                                                                                                                                                                                                                        |

It ends with `PASS`, `PASS WITH MINORS` or `FAIL` (FAIL = at least one blocker or major).

## 7. Structural validation gates

`npm run content:validate` parses every card with the `yaml` package, applies the
Zod shapes and runs the eight cross-artefact gates below as plain TypeScript.
Findings print as `path/to/file.yaml:entry — what is wrong — gate ID`, and any
finding fails the command with a non-zero exit code.

The gates split into two sets:

- **Runtime-mirrored** — `content-ids`, `puzzle-graph`, `hazard-content` and
  `score-content`. The boot-time check and the Vitest suite re-run their shared
  checks against the generated `ContentBundle`
  ([application-and-ui.md §3.3](application-and-ui.md#33-loading-and-validation)),
  so authoring, test and boot cannot drift for these four.
- **Authoring-only** — `world-graph`, `quiz-content`, `hint-content` and
  `npc-content` run at authoring time in `content:validate` and again before
  generation, never against the runtime bundle.

Shape checks for stray authoring keys, document `status` and unresolved `todo`
placeholders run only on YAML and cannot run against the runtime bundle. When
the coverage headings are unavailable, the CLI reports that clause as an
unverified gap rather than passing it.

Room interaction and scenery shape is shared rather than authoring-only.
`interactionShapeProblems()` in `src/content/validateContent.ts` is the single
owner: `validateContent()` runs it against the generated bundle at boot and in
tests, and the authoring adapter runs it against raw card rooms. It reports a
present non-array `interactions` container, a present `itemId` that is not a
non-empty string (including on EXAMINE), any acting item on EXAMINE, and
malformed scenery names, descriptions and aliases. Authoring findings carry
gate `shape` and the path of the room card that owns the problem. Target
existence stays with `content-ids`, so a shape finding never substitutes for a
missing target.

| Gate             | Checks                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content-ids`    | Unique artefact IDs; globally unique aliases across items and actors; ID prefixes per §5, including `area-` and `world-`; every topic ID used by a card, room, puzzle or quiz resolves to a `## Topic: <id>` heading in `COVERAGE.md` or a declared spec topic; hint targets name a declared topic, puzzle or quiz; every exit target, `move-player` target, item `initialRoom` and area `startRoomId` names a declared room; exit directions valid.                                                                  |
| `quiz-content`   | `1 <= passMark <= questionIds.length`; every questionIds entry names a declared question; every question has at least one correct option within range; explanation non-empty; an AO tag and a difficulty in `authoring`; at least one AO1 and one AO2 per quiz; `onPass` sets `quiz-passed:<id>` and emits `complete-topic`; `onFail` includes `change-lives`.                                                                                                                                                        |
| `puzzle-graph`   | `dependsOn` IDs exist; the graph is acyclic; requirements are action-set flags rather than bare `has-item`; at least two `authoring.clues`; `topicId` names a declared spec topic.                                                                                                                                                                                                                                                                                                                                    |
| `world-graph`    | Exactly one `worlds` declaration per world and every `definition.worldId` resolves; a world is declared by the area its `startAreaId` names; `startAreaId` and that area's `startRoomId` resolve by ID; when several worlds are declared, the world owning the authored start area is first in declaration order, because `GameState.createInitial()` boots from `worlds.all[0]`; every room is reachable from an area's `startRoomId`; every `covered` topic with evidence has a `complete-topic` completion source. |
| `hint-content`   | 2–4 levels in ascending order from 1; unlock keys from the counter namespaces; targets name a declared spec topic, puzzle or quiz; no level matches answer-revealing phrasing; `scorePenalty` absent or 0.                                                                                                                                                                                                                                                                                                            |
| `hazard-content` | `authoring.telegraph` present; effects from the shared union and no `set-puzzle-*`; a declared `schedule` has positive `remainingTurns`; the area's `startRoomId` names a declared room.                                                                                                                                                                                                                                                                                                                              |
| `npc-content`    | Defined in [npcs.md §10](npcs.md#10-structural-validation-gates), including the T5 overlap proof. It runs at authoring time and again before generation; it does not run against the runtime bundle.                                                                                                                                                                                                                                                                                                                  |
| `score-content`  | Every room, puzzle and quiz declares a non-negative integer `score`; every `spec-topics.yaml` entry carries the `SpecTopic` fields declared in [application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures) and a non-empty evidence note; the mapped room, puzzle and quiz scores total at most `maxScore` ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)); every area's `startRoomId` names a declared room.                                              |

### 7.1 Free-text topic-overlap proof

The T5 proof is owned by [npcs.md §10.1](npcs.md#101-free-text-topic-overlap-proof). It runs with `npc-content` at authoring time and proves structure only; usefulness, tone and comprehension are authoring tests in the [npcs.md A rules](npcs.md#authoring-conversation-rules-a).

## 8. Fixed contracts content must use

Content uses the contracts below instead of hard-coding its own; flag any
unavoidable assumption in the card. Each row links to the owner.

| Contract                             | Required behaviour                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Win condition                        | When every mapped spec topic with `covered` status and evidence is completed, the session emits `game-won` with the final score ([application-and-ui.md §11](application-and-ui.md#11-win-check-owner)).                                                                                                                                                                                                                              |
| Starting lives                       | A new game starts with 3 lives. `WorldDefinition.lives` declares the value and `newGame` resets to 3, so another declared value is not yet honoured. Hazards and failed quizzes lose lives. Upon any boundary crossing, lives reset to the destination area's `lives` once every quiz and puzzle of the departed area is solved; otherwise they carry across ([§3.2](application-and-ui.md#32-world-area-room-and-item-definitions)). |
| Verb list, aliases, ambiguity policy | The verb and alias tables are fixed in [application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs), including dedicated door verbs. Unknown verbs and nouns degrade to a friendly in-voice message, never a parser error, and there is no disambiguation prompt.                                                                                                                                            |
| Undo, autosave, save slots           | Undo and multiple save slots: none. Autosave writes the live save after every successful command, alongside manual saves through buttons or typed meta-action aliases ([application-and-ui.md §4](application-and-ui.md#4-game-façade-and-meta-actions), [§4.1](application-and-ui.md#41-meta-actions), [storage-schema.md §11](storage-schema.md#11-flow)).                                                                          |
| Save key and corrupt saves           | Key is `compsciquest:save:v1`; a corrupt live save is quarantined, not discarded ([storage-schema.md §2](storage-schema.md#2-envelope-keys-and-file-format), [§9](storage-schema.md#9-quarantine)).                                                                                                                                                                                                                                   |
| Scoring                              | Each room visit, puzzle solve and quiz pass awards its own content-declared `score`, within `SpecTopic.maxScore`; `topic-completed` awards nothing ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)).                                                                                                                                                                                       |
| Title screen                         | The app boots to a Continue / New Game overlay before the first room; Continue is disabled without a valid save ([application-and-ui.md §2](application-and-ui.md#2-boot-title-screen-and-session-start)).                                                                                                                                                                                                                            |
| Content registration                 | Validated YAML generates committed `src/content/authored/*.ts`, assembled by `loadContent()` into one `ContentBundle`; there is no runtime or build-time YAML parsing ([content-toolchain.md §5](content-toolchain.md#5-generation)).                                                                                                                                                                                                 |
| Boot start position                  | `GameState.createInitial()` boots from the first declared world (`worlds.all[0]`), then resolves the area by `world.startAreaId` and the room by `area.startRoomId`, by ID ([content-toolchain.md §5](content-toolchain.md#5-generation)).                                                                                                                                                                                            |
| Validation                           | `content:validate` runs before review and generation; `content-critic` and `pck-reviewer` remain independent read-only gates ([content-toolchain.md §4](content-toolchain.md#4-validation)).                                                                                                                                                                                                                                          |
| NPC actor binding and greeting       | Defined in [npcs.md §8](npcs.md#8-npc-card-format): topic `actorId` is generated and validated, node `actorId` is authoring-only, and the ready state stays silent.                                                                                                                                                                                                                                                                   |

## 9. Agent acceptance contract

Every content-writer, reviewer and editor agent file contains two sections: **Definition of done** (binary checks that must all be true before the agent finishes) and **Constraints and escalation** (hard limits plus the conditions under which the agent must return `BLOCKED: <reason>` instead of guessing). This section is the shared contract those sections implement; if an agent's wording and this section disagree, this section wins.

### 9.1 Shared definition of done

1. Only the YAML card named in the brief was changed; a writer edits neither the scaffold, the schema, the validator, the generator nor generated TypeScript.
2. Every ID and alias comes from the bible registry; every topic ID exists in `COVERAGE.md`; runtime field names match the subsystem docs and optional fields are omitted; authoring metadata is confined to `authoring:` blocks.
3. `content:validate` passes with no findings before review (D5, V1); the card obeys D1–D4, produces no HTML, and uses the §8 contracts as given, with scoring points and verb aliases authored as content rather than invented as global rules.
4. Writers end with a report containing the card path, artefact IDs, the validator verdict and flagged assumptions. Reviewers end with findings in the required format and exactly one verdict line.
5. No blocker or major finding from either reviewer remains unresolved in the final round.
6. Where the brief is a whole-card-set or integration pass, the V4 trace is present and verified, with no unreachable option or unachievable win contribution left unresolved.
7. Where the card defines NPCs, follow the definition of done in [npcs.md §11.1](npcs.md#111-definition-of-done).

### 9.2 Shared hard constraints

- Neither writers nor reviewers edit another agent's file. Reviewers edit nothing at all.
- No course fact is invented from memory or fetched from the web. Unverifiable claims become findings, not corrections.
- No TypeScript, engine code, rulebook, agent-file or config changes. In particular, no schema, validator, generator or generated TypeScript edits, no Markdown replacement cards, no hand conversion to TypeScript and no runtime or build-time YAML parsing.
- The §8 contracts are authoritative. If the bible is silent on a mechanic outside that table, escalate to the user rather than guessing.

### 9.3 Stop-and-escalate and the review loop

Return `BLOCKED: <reason>` rather than guessing when:

- a required ID, alias or topic ID is missing;
- the brief conflicts with the bible, the spec or this rulebook;
- a structural validation gate fails and the fix belongs to another owner;
- an NPC blocker listed in [npcs.md §11.2](npcs.md#112-hard-constraints-and-escalation);
- a subject claim is unverifiable;
- a mechanic outside the §8 contracts and the bible is unclear;
- a dependency would create a cycle or an unreachable puzzle, room, item, topic, quiz, hazard trigger or hint target;
- the walkthrough cannot reach `game-won` or a `covered` topic has no completion source on any valid path;
- no counterplay can be designed for a hazard.

After a review round, a writer may revise **only its own file, at most two rounds**. If the finding requires another agent's file or a bible change, it returns `BLOCKED: <finding> requires <owner>` (owner = editor, another writer or the bible). The editor reconciles by updating the bible and re-briefing; it never edits a writer's card itself. Reviewers do not enter this loop — they return findings and the editor routes them.
