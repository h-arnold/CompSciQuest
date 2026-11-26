# Content authoring rules

## 1. Purpose and authority

This file is the rulebook for game **content**: rooms, items, NPCs, conversations, quizzes, puzzles, hazards, hints and the prose that binds them. The runtime contracts live in the subsystem documents and [architecture.md](architecture.md); this file defines how content is designed so those contracts are filled consistently, and by whom.

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

## 2. Workflow gates

- **W1 — Ideation (editor + user).** No content is written yet. The editor co-develops the bible with the user, offering concrete options and resolving conflicts against the exam spec. The bible is written to `docs/content/content-bible.md`.
- **W2 — Approval.** The editor summarises the bible and asks the user to approve it. **No writer is launched before approval.** Revision requests update the bible, not individual cards.
- **W3 — Dispatch.** The editor sends one brief per (area, kind) to the relevant writer. Briefs name the YAML scaffold path, the relevant schema slice, assigned IDs and aliases, topic IDs and the applicable rule IDs. Each brief also names the owning area card for every artefact, following the ownership definition above. Independent briefs may run in parallel; one writer owns each output file to avoid conflicts.
- **W4 — Review.** `npm run content:validate` must pass on the card set before either reviewer runs; findings route back to the owning writer like any other blocker (D5). The editor then launches `content-critic` and `pck-reviewer` in parallel on the returned cards and resolves every blocker and major finding from **both** by sending the card back to its writer. Cross-artefact contradictions are fixed by updating the bible and re-briefing. A card is not accepted until both reviewers return `PASS` or `PASS WITH MINORS` with no blockers or majors. When every card in the area is accepted, the editor drafts the walkthrough trace (V4) from the same validated data and launches a final `content-critic` pass over the whole card set **plus** that trace; blockers and majors are routed back to the owning writer or into the bible and re-briefed.
- **W5 — Integration.** The editor integrates the accepted area in this order:
  1. Write the accepted trace to `docs/content/walkthrough.md` (V4).
  2. Update `docs/coverage/COVERAGE.md` and `docs/content/status.md`.
  3. Report to the user what changed, what is blocked and the open questions.
  4. Hand the accepted area to `code-lead` for W6.

  When the last area is integrated, the editor extends the trace across all areas and records a final whole-game verdict before sign-off. Scratchpad entries are working notes only: a state, verdict, ID, flag, topic or coverage fact also goes into its canonical doc (`docs/content/status.md`, `docs/coverage/COVERAGE.md`, `docs/content/walkthrough.md` or `docs/content/content-bible.md`), because a scratchpad file alone is not the record.

- **W6 — Generate.** `code-lead` runs `npm run content:validate`, `npm run content:generate`, `npm test`, `npm run typecheck`, `npm run lint` and `npx prettier --check` on the changed files, and commits the generated TypeScript. Generation is a mechanical handoff, not a second authoring pass; [content-toolchain.md §4](content-toolchain.md#4-validation) and [§5](content-toolchain.md#5-generation) own the commands' mechanics.
- **W7 — Content playtest.** After W6, `content-editor` dispatches `play-tester` directly with the accepted area's ordered path, gate table and reachability table from `docs/content/walkthrough.md` as expected outcomes (V5). The tester plays the running app with ordinary player commands, using the generated authored content, and records screenshot evidence for each gated exit, item action, quiz, puzzle, hazard and `game-won` transition. It compares what happened with what the trace claims. Findings about cards, IDs, flags or prose route back to `content-editor` for the owning writer or the bible; code findings route back to the owning `code-lead` slice. This is runtime verification, not a second content review or a scripted walkthrough: `content-critic` remains the authority on the trace's read-only audit (V4).

## 3. Rule catalogue

Every finding from the critic and every brief from the editor cites these IDs. Rules are immutable without the user's agreement.

### N — Narrative

- **N1 — Premise and pillars.** The bible states a one-sentence premise and 3–5 thematic pillars. Every area, character and hazard must trace to at least one pillar; the editor rejects content that cannot.
- **N2 — Key-node spine.** Use a linear spine of mandatory key nodes (opening, mid-point gate, climax, resolution) with non-linear clusters of rooms between them. Clusters reconverge at gates. Never build an unbounded branching tree, and never a maze.
- **N3 — Diegetic learning.** GCSE concepts are mechanisms of the fictional world, not interruptions to it. A quiz is an in-world challenge issued by a character; a puzzle is a task that uses the concept. "Stop and answer a question" with no fictional framing is not acceptable.
- **N4 — Voice.** All text is second person, present tense, in one consistent register. Failed commands, unknown topics and hint text stay in voice. The bible defines the register; a card that drifts from it is a major finding.
- **N5 — Feedback for every command.** Every submitted command produces text. Failure text gives new information — a clue, a sensory detail, a character reaction — never a bare "you can't" or "nothing happens". This includes `use` on the wrong target and `answer` outside a quiz.
- **N6 — Fair gates.** Every locked exit or puzzle has an in-fiction justification and at least two discoverable clues placed in room descriptions, NPC dialogue or item text. No guess-the-verb or guess-the-noun traps: verbs come from the agreed parser list and nouns from the editor's alias registry.
- **N7 — Ancestor-only references.** A puzzle's prose may mention plot points only from that puzzle's ancestor set in the PDG, as guaranteed by [puzzles.md §4](puzzles.md#4-puzzle-dependency-graph). Never assume the player solved earlier nodes in a particular order.
- **N8 — Prose length.** Room descriptions are at most 200 words. This is a ceiling, not a target: most rooms should be shorter, and the extra room is for places where description genuinely helps the player. Longer passages are reserved for key nodes and NPC explanations. Avoid walls of text; vary rhythm between short traversal text and richer set pieces.

### P — Pedagogy and course mapping

- **P1 — Topic contract.** Every room declares `topicIds`, every puzzle and quiz declares `topicId`, and every hint sequence declares `targets` (§4); a room with no teaching purpose is explicitly marked `navigation-only`. Room `topicIds` are authoring references used by the gates and coverage mapping, not a runtime field of `RoomDefinition`. Topic IDs must match a `## Topic: <id>` heading in `docs/coverage/COVERAGE.md` exactly, with a spec reference and an evidence note. Writers never invent topic IDs.
- **P2 — Three beats per topic.** Where the spec calls for it, a topic has a teaching beat (NPC explanation or dialogue), a retrieval beat (quiz question) and an application beat (puzzle or other in-world action). A topic with only a quiz is incomplete.
- **P3 — Assessment objectives.** Every quiz question is tagged `AO1`, `AO2` or `AO3` plus a difficulty. Each quiz contains at least one `AO1` and one `AO2` question; `AO3` is used for design/evaluation topics (algorithms, SDLC). Tags are authoring metadata, dropped by the generator.
- **P4 — Distractors and explanations.** Wrong options are plausible misconceptions drawn from the spec, never nonsense options. Every answer, right or wrong, produces an explanation that says why the key is correct and, where useful, why the chosen distractor is wrong ([combat.md §2](combat.md#2-model)).
- **P5 — Retrieval loop.** Quizzes have no timer. `passMark` is a count, not a percentage. Retries are unlimited unless the editor explicitly assigns `attemptsAllowed`. Failure costs a life and returns the player to the declared level start; it never resets topic or puzzle progress ([combat.md §3](combat.md#3-flow)).
- **P6 — Score integrity.** Content declares each room, puzzle and quiz `score` but never writes score itself. `ScoreTracker` awards from the achievement events for covered topics with evidence; `complete-topic` / `topic-completed` records completion and awards nothing ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)). Hints default to zero penalty.

### C — Conversation and NPCs

- **C1 — NPC identity.** Each NPC has a distinct role, voice, motivation and at least one relationship dynamic with another character or the player. Opposing motivations are preferred: they create conflict and give the player someone to agree with ([npcs.md §2](npcs.md#2-model)).
- **C2 — No parser errors in dialogue.** Every conversational input resolves to a topic or to an in-character default reply ([npcs.md §3](npcs.md#3-commands-and-topic-resolution)). Cards never contain the words "parser error", "unknown command" or "I don't understand that" as dialogue. `prompt` strings surface what the player can ask.
- **C3 — Knowledge gating.** Use `isActive` and `npc-knows` to hide information until it has been mentioned. Where the player could discover the fact independently, define a second topic with a negated condition (the TADS `AltTopic` pattern) ([npcs.md §4](npcs.md#4-conversation-flow)).
- **C4 — Conversation nodes.** A `ConvNode` is used only for a deliberate forced teaching beat. Default nodes expire after one turn; `isSticky: true` needs an explicit reason in the card. There is no turn timeout: conversation ends on `bye`, leaving the room, or starting a quiz.
- **C5 — Effects and aliases.** All conversation state changes go through the shared `Effect` union. Aliases come from the editor's global registry and must be unique across items and actors ([shared-rules.md §9](shared-rules.md#9-content-registration)).
- **C6 — Complete conversation data.** Topic vocabulary comes from the bible alias registry, never from a duplicate table in the card. Room or area locality is authored with `in-room`/`in-area` in `isActive` ([npcs.md §2](npcs.md#2-model)), not as a topic field; an unscoped topic stays globally reachable, and a room-bound actor's catch-all must carry the same scope. The `npc-content` gate checks the card-level rules only; it does not check location
  scope or catch-all scope matching, which `content-critic` checks (§6.1); [§7](#7-structural-validation-gates)
  states the gate split. The remaining card rules:
  - Every authored topic and node carries `actorId` (§4.3).
  - The ready state carries no `onEnter` greeting; greetings live in topic responses (§4.3).
  - A node with no `enter-node` producer is marked reserved with a reason (§4.3).
  - Every default or catch-all topic exists.
  - The schema admits all runtime match, condition, effect and strategy variants, including ones no card uses (§4.3).

- **C7 — One live free-text target per actor.** For any input, at most one non-default `ask`/`tell`/`askTell` topic per actor may be selectable. Free text reaches the **first** active topic of that class in declaration order ([npcs.md §3](npcs.md#3-commands-and-topic-resolution)); declaration order and topic IDs must not be used as specificity rules, and a topic's ID is never player vocabulary. Any two topics whose `match` can accept the same input must be made mutually exclusive with complementary `isActive` conditions (`flag-set` vs `not flag-set`, `npc-knows` vs `not npc-knows`, and so on). To express a lesson ladder, gate the later topic on the earlier beat's evidence and add that evidence as a negated condition on the earlier topic. An `ask` topic and a `tell` topic belong to one free-text class ([npcs.md §3](npcs.md#3-commands-and-topic-resolution)), so an ask and a tell topic on one actor must also be mutually exclusive. The `npc-content` gate enforces this at authoring time; see [§7.1](#71-free-text-topic-overlap-proof).

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
- **V2 — Independent review.** `content-critic` reviews every card set against the N/P/C/H/D rules using the rubric in §6.1. `pck-reviewer` checks accuracy against `wjec-unit1.md`, GCSE-level scope, terminology and cognitive load using §6.2. Every blocker and major finding from either reviewer is resolved before integration.
- **V3 — Editor sign-off.** The editor checks cross-artefact consistency, updates `docs/coverage/COVERAGE.md` with spec references and evidence, and records status in `docs/content/status.md`. A topic is marked `covered` only when a card supplies real teaching and assessment evidence.
- **V4 — Walkthrough audit.** Before an area (and finally the whole game) is signed off, the editor traces at least one complete, ordered path from each area's `startRoomId` to `game-won` and records it in `docs/content/walkthrough.md`. The trace proves that every gate condition can be satisfied in-world; that every declared room, exit, item, NPC topic, quiz, puzzle, hazard trigger and hint target is reachable or triggerable; and that no dependency creates a soft-lock or an unreachable option. `content-critic` verifies the trace read-only on the final pass described in W4. An area whose contribution to the win set cannot be demonstrated is not integrated.
- **V5 — Runtime playtest.** Once an accepted area is generated in W6, `play-tester` (dispatched directly by `content-editor`) plays the running app with the real authored content bundle and confirms that each gate, completion source and `game-won` transition behaves as the V4 trace expects. The W7 playtest report and its screenshots are the evidence; a mismatch is a finding routed to the content owner or the code owner as appropriate. V5 checks the implementation against V4; it does not replace the critic's read-only trace audit.

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

`npcs.yaml` holds `actors`, `actorStates`, `conversationTopics` and
`conversationNodes`.

```yaml
kind: npc
areaId: 1-2-1-data-representation
status: approved
topicIds: [data-types, number-conversion]

actors:
  - id: npc-archivist
    aliases: [archivist, keeper]
    initialStateId: actorstate-ready
    authoring:
      role: tutor # C1
      voice: clipped, patient # C1
      motivation: ...
      relationship: ...

actorStates:
  - id: actorstate-ready
    stateDesc: ...
    specialDesc: ...
    # onEnter: [...] # optional; the ready state declares no greeting
    authoring:
      note: Generic default and return state.

conversationTopics:
  - id: topic-fde-explain
    actorId: npc-archivist # optional binding; the generator emits it
    match: { kind: askTell, objectIds: [fetch-decode-execute] }
    isActive:
      kind: not
      of:
        {
          kind: npc-knows,
          actorId: npc-archivist,
          topicId: fetch-decode-execute,
        }
    responses:
      - >-
        ... # in-character, N4
    strategy: { kind: once }
    effects:
      - {
          kind: learn-topic,
          actorId: npc-archivist,
          topicId: fetch-decode-execute,
        }
    prompt: (You could ask why.)
    authoring:
      misconception: ...

conversationNodes:
  - id: node-fde
    actorId: npc-archivist # authoring-only; the generator drops it
    isSticky: false
    topicIds: [topic-fde-why] # generator resolves these to embedded topics
    defaultTopicId: topic-fde-default
    authoring:
      note: Deliberate one-turn teaching beat (C4).
```

**Topic vocabulary.** A topic records `objectIds`, `itemIds` or `keywords`; it
never duplicates the bible alias table. `TopicResolver` maps raw noun phrases
through the globally unique aliases
([npcs.md §3](npcs.md#3-commands-and-topic-resolution)). Every topic ID resolves
to a `## Topic: <id>` heading in `COVERAGE.md` or to a declared spec topic;
bible-registry conformance is `content-critic`'s check (§6.1).

**Actor binding.** A topic may carry an optional `actorId`; the generator emits
it and the validator checks it names a declared actor. Selection admits a topic
when `actorId` is absent or matches the speaking actor
([npcs.md §3](npcs.md#3-commands-and-topic-resolution)). Node `actorId` is a
top-level YAML key: the validator checks it names a declared actor and that a
resolving `defaultTopicId` belongs to that actor, and the generator drops it.
Runtime node membership comes from `enter-node` effects, which carry `actorId`.
Do not work around topic binding with node membership alone.

**Silent greeting.** The `actorstate-ready` state declares no `onEnter` effects:
greetings live in each topic's responses. The schema admits `onEnter` effects
for other states, but a writer must not add a greeting the card does not
declare, and `npc-content` rejects one on `actorstate-ready`.

**Reserved nodes.** A node with no `enter-node` producer must carry
`authoring.reserved: true` and a reason in `authoring.note` or
`authoring.reason`. Every `defaultTopicId` must belong to the same actor's
topics. A catch-all need not be named `*-default`, but it must be an `askTell`
topic with an empty `objectIds` list; a `defaultTopicId` naming any other shape
is ignored at runtime.

**Admitted variants.** The schema admits every `TopicMatch` kind (`ask`, `tell`,
`askTell`, `give`, `show`, `command`, `special`), every `Condition` kind
(including `actor-state` and `in-node`), every effect in the shared union and
all three `ResponseStrategy` kinds, including `sequence`. An unused variant is
not a validation finding.

**Generated node topics.** `ConversationNode.topics` holds embedded topic
objects at runtime, while the card lists IDs. Authors write `topicIds`; the
generator resolves them into the runtime `topics` field in the declared order.

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
the writer. V5 is not a card-review rubric: `play-tester` runs the runtime
playtest under W7, dispatched directly by `content-editor`; neither reviewer
performs it.

### 6.1 Content critic

`content-critic` is read-only. It returns findings as text in its final message, one per line:

```
[blocker|major|minor] RULE-ID card-path — what is wrong — why — suggested fix
```

It checks:

1. **Rule conformance** — every N/P/C/H/D rule that applies to the card kind, cited by ID.
2. **Voice** — second person present; failures and defaults in voice; no "parser error" phrasing (N4, C2).
3. **Fairness** — clues exist and are discoverable; no maze or guess-the-verb gate (N6); puzzle text references only ancestors (N7).
4. **Pedagogy** — spec reference present; three beats where required; plausible misconception distractors; explanation after every answer; AO1 and AO2 present; no answer revealed by a hint (P1–P4, H2).
5. **Data correctness** — IDs/aliases from the registry; exact runtime field names; optional fields omitted; authoring keys confined to `authoring:` blocks; effects/conditions only from the shared unions; action-flag requirements (D2–D4, puzzles.md §3); conversation selection per C7 — no two same-input ask/tell topics on one actor can be live together, and a trace phrase reaches the intended topic by its match, not by declaration order or an ID word.
6. **Evidence** — claims about the spec cite a PDF section/page; nothing marked `covered` without evidence (V3).
7. **Reachability and completability** — every declared room, exit, item, NPC topic, quiz, puzzle, hazard trigger and hint target in scope is reachable or triggerable; the walkthrough yields a valid path to `game-won`; no soft-lock or unreachable option (V4). This applies on the final whole-card-set pass, not on a partial batch.

It ends with a one-line verdict: `PASS`, `PASS WITH MINORS` or `FAIL`. It never edits a card, and it never proposes new course facts from memory — if a fact is not in `wjec-unit1.md`, it records that as a finding.

### 6.2 PCK reviewer

`pck-reviewer` is read-only and independent of `content-critic`. Its authoritative sources are `docs/exam-specs/wjec-unit1.md` (and the cited PDF), `docs/coverage/COVERAGE.md`, the P rules in §3 and the cards under review. It does not use the web and does not invent course facts. Findings use one line each:

```
[blocker|major|minor] TAG card-path — what is wrong — source (section/page) — suggested fix
```

| Tag              | Check                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PCK-ACC`        | Factual accuracy: every statement, definition, example and quiz key matches the spec. No invented processors, registers, protocols, algorithms or numbers.                                                                                                                                                                                   |
| `PCK-DEPTH`      | Scope stays inside Unit 1; nothing from A-level or professional practice is smuggled in. Respect "should know" versus "should be aware of" as `docs/exam-specs/wjec-unit1.md` records that distinction. Do not present technology as value-free where the spec integrates legal, social, ethical, environmental and professional dimensions. |
| `PCK-TERM`       | Terminology matches the spec; a friendly paraphrase must be accompanied by the formal term. No misleading shorthand.                                                                                                                                                                                                                         |
| `PCK-LOAD`       | Prerequisites come before use; new vocabulary is explained in plain GCSE-level language; text is readable by a typical 14–16 year-old with no assumed prior CS knowledge.                                                                                                                                                                    |
| `PCK-AO`         | Questions assess the tagged objective and the spec's command words; AO1 and AO2 present; AO3 only for design/evaluation topics (algorithms, SDLC).                                                                                                                                                                                           |
| `PCK-DISTRACTOR` | Wrong options are plausible misconceptions a GCSE learner actually holds, rooted in the spec.                                                                                                                                                                                                                                                |
| `PCK-EVIDENCE`   | A spec reference and evidence note exist; nothing is treated as covered without them.                                                                                                                                                                                                                                                        |

It ends with `PASS`, `PASS WITH MINORS` or `FAIL` (FAIL = at least one blocker or major). It does not review voice, aliases, IDs or data shape — that is `content-critic`'s job — and it does not design the fix: it points to the spec section and states the correct claim or appropriate depth.

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
| `npc-content`    | Every topic and node `actorId` names a declared actor; a `defaultTopicId` that resolves belongs to the same actor's topics; node `topicIds` resolve to declared topics; a node with no `enter-node` producer carries `authoring.reserved: true` with a reason; `actorstate-ready` authors no `onEnter`; C7 overlap (§7.1). It does not check location scope or catch-all scope matching, resolve `itemId`s or keywords, or read the bible registry; `content-critic` checks the last (§6.1).                          |
| `score-content`  | Every room, puzzle and quiz declares a non-negative integer `score`; every `spec-topics.yaml` entry carries the `SpecTopic` fields declared in [application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures) and a non-empty evidence note; the mapped room, puzzle and quiz scores total at most `maxScore` ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)); every area's `startRoomId` names a declared room.                                              |

### 7.1 Free-text topic-overlap proof

C7 is checked at authoring time only. The gate compares topics that can receive
the same free-text input: non-default `ask`/`tell`/`askTell` topics and
`command` topics with a keyword list. `give` is compared with `give`, and `show`
with `show`, only when their `itemIds` intersect; a give/show topic is never
compared with a free-text topic, because `objectIds` name spec topics and
`itemIds` name items. A `special` topic is outside C7.

A pair is reported unless the gate can prove their `isActive` conditions
mutually exclusive. It proves complements of `flag-set`, `npc-knows`,
`has-item`, `visited-room`, `puzzle-solved` and `quiz-passed`, the single-valued
`in-room`, `in-area`, `actor-state` and `in-node` literals, and
`counter-at-least` ranges, lifted through `all`, `any` and `not`. A
`topic-complete` complement is not part of the proof, so such a pair is
reported.

Two topics listed together in one node's `topicIds` are an explicit sequence for
a deliberate teaching beat: the gate exempts the pair and `content-critic`
checks it against the V4 trace. Every other pair it cannot prove exclusive is a
finding naming both topic IDs. Non-default ask/tell topics always overlap for
free text, so this is the normal case, not an edge case.

## 8. Fixed contracts content must use

Content uses the contracts below instead of hard-coding its own; flag any
unavoidable assumption in the card. Each row links to the owner.

| Contract                             | Required behaviour                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Win condition                        | When every mapped spec topic with `covered` status and evidence is completed, the session emits `game-won` with the final score ([application-and-ui.md §11](application-and-ui.md#11-win-check-owner)).                                                                                                                                                                                                                              |
| Starting lives                       | A new game starts with 3 lives. `WorldDefinition.lives` declares the value and `newGame` resets to 3, so another declared value is not yet honoured. Hazards and failed quizzes lose lives. Upon any boundary crossing, lives reset to the destination area's `lives` once every quiz and puzzle of the departed area is solved; otherwise they carry across ([§3.2](application-and-ui.md#32-world-area-room-and-item-definitions)). |
| Verb list, aliases, ambiguity policy | The verb and alias tables are fixed in [application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs), including dedicated door verbs. Unknown verbs and nouns degrade to a friendly in-voice message, never a parser error, and there is no disambiguation prompt.                                                                                                                                            |
| Undo, autosave, save slots           | None. Saves are manual, through buttons or typed meta-action aliases ([application-and-ui.md §4.1](application-and-ui.md#41-meta-actions)).                                                                                                                                                                                                                                                                                           |
| Save key and corrupt saves           | Key is `compsciquest:save:v1`; a corrupt live save is quarantined, not discarded ([storage-schema.md §2](storage-schema.md#2-envelope-keys-and-file-format), [§9](storage-schema.md#9-quarantine)).                                                                                                                                                                                                                                   |
| Scoring                              | Each room visit, puzzle solve and quiz pass awards its own content-declared `score`, within `SpecTopic.maxScore`; `topic-completed` awards nothing ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)).                                                                                                                                                                                       |
| Title screen                         | The app boots to a Continue / New Game overlay before the first room; Continue is disabled without a valid save ([application-and-ui.md §2](application-and-ui.md#2-boot-title-screen-and-session-start)).                                                                                                                                                                                                                            |
| Content registration                 | Validated YAML generates committed `src/content/authored/*.ts`, assembled by `loadContent()` into one `ContentBundle`; there is no runtime or build-time YAML parsing ([content-toolchain.md §5](content-toolchain.md#5-generation)).                                                                                                                                                                                                 |
| Boot start position                  | `GameState.createInitial()` boots from the first declared world (`worlds.all[0]`), then resolves the area by `world.startAreaId` and the room by `area.startRoomId`, by ID ([content-toolchain.md §5](content-toolchain.md#5-generation)).                                                                                                                                                                                            |
| Validation                           | `content:validate` runs before review and generation; `content-critic` and `pck-reviewer` remain independent read-only gates ([content-toolchain.md §4](content-toolchain.md#4-validation)).                                                                                                                                                                                                                                          |
| NPC actor binding and greeting       | A topic's optional `actorId` is generated and validated; node `actorId` is authoring-only, with runtime membership from `enter-node` effects. The ready state stays silent: greetings live in topic responses, never in `onEnter` (§4.3).                                                                                                                                                                                             |

## 9. Agent acceptance contract

Every content-writer, reviewer and editor agent file contains two sections: **Definition of done** (binary checks that must all be true before the agent finishes) and **Constraints and escalation** (hard limits plus the conditions under which the agent must return `BLOCKED: <reason>` instead of guessing). This section is the shared contract those sections implement; if an agent's wording and this section disagree, this section wins.

### 9.1 Shared definition of done

1. Only the YAML card named in the brief was changed; a writer edits neither the scaffold, the schema, the validator, the generator nor generated TypeScript.
2. Every ID and alias comes from the bible registry; every topic ID exists in `COVERAGE.md`; runtime field names match the subsystem docs and optional fields are omitted; authoring metadata is confined to `authoring:` blocks.
3. `content:validate` passes with no findings before review (D5, V1); the card obeys D1–D4, produces no HTML, and uses the §8 contracts as given, with scoring points and verb aliases authored as content rather than invented as global rules.
4. Writers end with a report containing the card path, artefact IDs, the validator verdict and flagged assumptions. Reviewers end with findings in the required format and exactly one verdict line.
5. No blocker or major finding from either reviewer remains unresolved in the final round.
6. Where the brief is a whole-card-set or integration pass, the V4 trace is present and verified, with no unreachable option or unachievable win contribution left unresolved.
7. Where the card defines NPCs, actor binding is explicit, the ready state stays silent, reserved nodes carry a reason, default topics exist and all runtime variants remain admissible (§4.3).

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
- a topic or node `actorId` names no declared actor;
- a greeting is added to the silent ready state;
- an unentered node has no `authoring.reserved` reason;
- a subject claim is unverifiable;
- a mechanic outside the §8 contracts and the bible is unclear;
- a dependency would create a cycle or an unreachable puzzle, room, item, topic, quiz, hazard trigger or hint target;
- the walkthrough cannot reach `game-won` or a `covered` topic has no completion source on any valid path;
- no counterplay can be designed for a hazard.

After a review round, a writer may revise **only its own file, at most two rounds**. If the finding requires another agent's file or a bible change, it returns `BLOCKED: <finding> requires <owner>` (owner = editor, another writer or the bible). The editor reconciles by updating the bible and re-briefing; it never edits a writer's card itself. Reviewers do not enter this loop — they return findings and the editor routes them.
