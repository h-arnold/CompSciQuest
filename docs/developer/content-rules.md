# Content authoring rules (design)

Status: draft · Last updated: 2026-11-25

Part of the CompSciQuest design set: [architecture](architecture.md) · [application and UI](application-and-ui.md) · [shared rule spine](shared-rules.md) · [storage schema](storage-schema.md) · [NPCs](npcs.md) · [hazards](hazards.md) · [quiz combat](combat.md) · [puzzles](puzzles.md) · [hints](hints.md) · [content toolchain](content-toolchain.md).

## 1. Purpose and authority

This file is the rulebook for game **content**: rooms, items, NPCs, conversations, quizzes, puzzles, hazards, hints and the prose that binds them. The runtime contracts live in [architecture.md](architecture.md) and the subsystem documents; this file defines how content should be designed so those contracts are filled consistently, and by whom.

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
- **Card** — a YAML file under `docs/content/<area-id>/` specifying one kind of content, or `docs/content/spec-topics.yaml` for the cross-area spec topics. Markdown cards are retired after migration; see [content-toolchain.md](content-toolchain.md) for file names, scaffolds and generation.
- **Artifact** — one defined object inside a card (a room, an NPC, a quiz, a hint level…).
- **Ownership** — an artefact belongs in the card of the area that uses it, never
  in an unrelated zone for convenience. A game-wide actor's artefacts may be split
  between area cards; cross-card `actorId` binding is valid. This is a user-directed
  structure (2026-11-25, `docs/content/content-bible.md` §4.2).
- **Brief** — the self-contained task the editor sends to a writer. Subagents start with fresh context, so a brief must contain everything the writer needs.
- **Validator** — `npm run content:validate`: parses cards with the `yaml` package, applies the Zod shapes and runs the §7 gates as plain TypeScript. Its findings are structural; it does not judge prose or subject accuracy.
- **Generator** — `npm run content:generate`: emits the committed `src/content/authored/*.ts` files from validated YAML. It is mechanical and never changes content.
- **Reviewers** — `content-critic` checks rule, prose and data-shape conformance; `pck-reviewer` checks subject-matter accuracy against Unit 1 and appropriateness for a GCSE learner. Both are read-only and independent of the writers.

## 2. Workflow gates

- **W1 — Ideation (editor + user).** No content is written yet. The editor co-develops the bible with the user, offering concrete options and resolving conflicts against the exam spec. The bible is written to `docs/content/content-bible.md`.
- **W2 — Approval.** The editor summarises the bible and asks the user to approve it. **No writer is launched before approval.** Revision requests update the bible, not individual cards.
- **W3 — Dispatch.** The editor sends one brief per (area, kind) to the relevant writer. Briefs name the YAML scaffold path, the relevant schema slice, assigned IDs and aliases, topic IDs and the applicable rule IDs. Each brief also names the owning area card for every artefact, following the ownership definition above. Independent briefs may run in parallel; one writer owns each output file to avoid conflicts.
- **W4 — Review.** `npm run content:validate` must pass on the card set before either reviewer runs; findings route back to the owning writer like any other blocker (D5). The editor then launches `content-critic` and `pck-reviewer` in parallel on the returned cards and resolves every blocker and major finding from **both** by sending the card back to its writer. Cross-artifact contradictions are fixed by updating the bible and re-briefing. A card is not accepted until both reviewers return `PASS` or `PASS WITH MINORS` with no blockers or majors. When every card in the area is accepted, the editor drafts the walkthrough trace (V4) from the same validated data and launches a final `content-critic` pass over the whole card set **plus** that trace; blockers and majors are routed back to the owning writer or into the bible and re-briefed.
- **W5 — Integration.** The editor writes the accepted trace to `docs/content/walkthrough.md` (V4), updates `docs/coverage/COVERAGE.md` and `docs/content/status.md`, then reports to the user what changed, what is blocked and the open questions. Only then is the area considered done. When the last zone is integrated the editor extends the trace across all areas and records a final whole-game verdict before sign-off. The editor then hands the accepted area to `code-lead` for W6. Scratchpad entries are working notes only: whenever a state, verdict, ID, flag, topic or coverage fact changes, the relevant canonical docs (`docs/content/status.md`, `docs/coverage/COVERAGE.md`, `docs/content/walkthrough.md` and `docs/content/content-bible.md` as appropriate) must be updated as well, because a scratchpad file alone is not the record.
- **W6 — Generate.** `code-lead` runs `npm run content:validate`, `npm run content:generate`, `npm test`, `npm run typecheck`, `npm run lint` and `npx prettier --check` on the changed files, and commits the generated TypeScript. This replaces the former "conversion out of scope" step; it is a mechanical handoff, not a second authoring pass.
- **W7 — Browser walkthrough.** After W6, `content-editor` dispatches `browser-tester` directly to walk the accepted area's ordered path in `docs/content/walkthrough.md` through the running app with the generated authored content (V5). The tester records screenshot evidence for each gated exit, item action, quiz, puzzle, hazard and `game-won` transition, then compares what happened with what the trace claims. Findings about cards, IDs, flags or prose route back to `content-editor` for the owning writer or the bible; code findings route back to the owning `code-lead` slice. This is runtime verification, not a second content review: `content-critic` remains the authority on the trace's read-only audit (V4).

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
- **N8 — Prose length.** Room descriptions are at most 80 words. Longer passages are reserved for key nodes and NPC explanations. Avoid walls of text; vary rhythm between short traversal text and richer set pieces.

### P — Pedagogy and course mapping

- **P1 — Topic contract.** Every room declares `topicIds`, every puzzle and quiz declares `topicId`, and every hint sequence declares `targets` (§4); a room with no teaching purpose is explicitly marked `navigation-only`. Room `topicIds` are authoring references used by the gates and coverage mapping, not a runtime field of `RoomDefinition`. Topic IDs must match a `## Topic: <id>` heading in `docs/coverage/COVERAGE.md` exactly, with a spec reference and an evidence note. Writers never invent topic IDs.
- **P2 — Three beats per topic.** Where the spec calls for it, a topic has a teaching beat (NPC explanation or dialogue), a retrieval beat (quiz question) and an application beat (puzzle or other in-world action). A topic with only a quiz is incomplete.
- **P3 — Assessment objectives.** Every quiz question is tagged `AO1`, `AO2` or `AO3` plus a difficulty. Each quiz contains at least one `AO1` and one `AO2` question; `AO3` is used for design/evaluation topics (algorithms, SDLC). Tags are authoring metadata, dropped on conversion.
- **P4 — Distractors and explanations.** Wrong options are plausible misconceptions drawn from the spec, never nonsense options. Every answer, right or wrong, produces an explanation that says why the key is correct and, where useful, why the chosen distractor is wrong ([combat.md §2](combat.md#2-model)).
- **P5 — Retrieval loop.** Quizzes have no timer. `passMark` is a count, not a percentage. Retries are unlimited unless the editor explicitly assigns `attemptsAllowed`. Failure costs a life and returns the player to the declared level start; it never resets topic or puzzle progress ([combat.md §3](combat.md#3-flow)).
- **P6 — Score integrity.** Content declares each room, puzzle and quiz `score` but never writes score itself. `ScoreTracker` awards from the achievement events for covered topics with evidence; `complete-topic` / `topic-completed` records completion and awards nothing ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)). Hints default to zero penalty.

### C — Conversation and NPCs

- **C1 — NPC identity.** Each NPC has a distinct role, voice, motivation and at least one relationship dynamic with another character or the player. Opposing motivations are preferred: they create conflict and give the player someone to agree with ([npcs.md §2](npcs.md#2-model)).
- **C2 — No parser errors in dialogue.** Every conversational input resolves to a topic or to an in-character default reply ([npcs.md §3](npcs.md#3-commands-and-topic-resolution)). Cards never contain the words "parser error", "unknown command" or "I don't understand that" as dialogue. `prompt` strings surface what the player can ask.
- **C3 — Knowledge gating.** Use `isActive` and `npc-knows` to hide information until it has been mentioned. Where the player could discover the fact independently, define a second topic with a negated condition (the TADS `AltTopic` pattern) ([npcs.md §4](npcs.md#4-conversation-flow)).
- **C4 — Conversation nodes.** A `ConvNode` is used only for a deliberate forced teaching beat. Default nodes expire after one turn; `isSticky: true` needs an explicit reason in the card. There is no turn timeout: conversation ends on `bye`, leaving the room, or starting a quiz.
- **C5 — Effects and aliases.** All conversation state changes go through the shared `Effect` union. Aliases come from the editor's global registry and must be unique across objects and NPCs ([shared-rules.md §10](shared-rules.md#10-content-registration)).
- **C6 — Complete conversation data.** Topic vocabulary comes from the bible alias registry, never from a duplicate table in the card. Every authored topic and node carries `actorId`; the silent ready-state greeting is the recorded decision, so no unauthored greeting is added; a node with no producer is marked reserved with a reason; and every default or catch-all topic exists. Room or area locality is authored with `in-room`/`in-area` in `isActive` ([npcs.md §2](npcs.md#2-model)), not as a topic field; an unscoped topic stays globally reachable, and a room-bound actor's catch-all must carry the same scope. §7 records the current `npc-content` gate status for this clause. The schema admits all runtime match, condition, effect and strategy variants, including ones zone 1 does not use.

### H — Hazards and hints

- **H1 — Hazards are telegraphed.** Each hazard has at least one clue in the room description or NPC dialogue before it can fire. Harm is a brief penalty, not a puzzle: lose a life, return to the declared level start, optionally reset level-local flags. Never reset puzzle phase, and never offer a hint during a hazard ([hazards.md §4](hazards.md#4-failure-consequences)).
- **H2 — Hint ladders.** A sequence has 2–4 levels that escalate nudge → structure → procedure. No level reveals the answer or solves the puzzle; the player must still answer ([hints.md §4](hints.md#4-adaptive-behaviour)). Levels are gated by `unlock` conditions using only the agreed counter keys. Targets include spec topic IDs so the score panel can label the revision area. Default `scorePenalty` is 0.
- **H3 — Adaptive hints.** Automatic hints fire only after genuine stuck evidence: a wrong answer increments `failed-attempts:<quizId>`, or N stuck turns increments `turns-since:<puzzleId>`. Do not set `autoOfferAfter` so low that it offers help before the player has tried.

### D — Data and cards

- **D1 — YAML cards only.** Writers populate YAML cards under `docs/content/<area-id>/` from the schema-driven scaffolds. They never edit the schema, validator, generator, generated TypeScript, engine code, `src/`, the rulebook, agent files or `opencode.json`. There is no Markdown card after migration and no hand conversion to TypeScript.
- **D2 — Editor-owned IDs.** IDs are kebab-case with a kind prefix: `room-`, `item-`, `npc-`, `actorstate-`, `topic-`, `node-`, `area-`, `world-`, `quiz-`, `q-`, `puzzle-`, `hazard-`, `hint-`. The editor allocates IDs and aliases in the bible; writers never invent one outside their brief.
- **D3 — Runtime data shape.** Runtime fields use exactly the names and types in the subsystem docs and appear as YAML keys of the same names. Only plain strings, numbers, arrays and records are allowed; omit optional fields rather than assigning `undefined` or `null` ([storage-schema.md §3](storage-schema.md#3-persisted-shape-canonical)). Prose is written as block scalars (`>-` or `|-`). `AreaDefinition.roomIds` is derived from the order of `rooms` and `ConversationNode.topics` is resolved from the node's `topicIds`; neither is authored. Each item declares its `initialRoom`; after that, ownership lives on Player, NPC or Room state. An item may also declare the optional `refusalText` string, the in-world response when a non-portable item is taken; omit it when absent or empty, since an empty value falls back to the default refusal ([application-and-ui.md §3.2/§5.2](application-and-ui.md#32-world-area-room-and-item-definitions)).
- **D4 — Authoring metadata is separate.** Keys such as `assessmentObjective`, `difficulty`, `clues`, `misconception`, `role`, `voice`, `motivation`, `relationship`, `telegraph`, `interesting` and `useNotes` live under an `authoring:` block on the artifact. The generator drops that block wholesale, so nothing in it reaches the engine; a stray authoring key outside the block is a validation finding. The exception is `levelStart`, which is now the runtime `startRoomId` on the area definition ([application-and-ui.md §3.2](application-and-ui.md#32-world-area-room-and-item-definitions)). Room `topicIds` are a separate authoring reference used by the gates; the generator does not copy them into `RoomDefinition`.
- **D5 — Validated YAML is the handoff.** A card set is not ready for review or generation until `content:validate` passes with no findings. Validation is a structural gate before `content-critic` and `pck-reviewer`, never a replacement for either. The five shared gate functions back the Vitest suite and the boot-time check in [application-and-ui.md §3.3](application-and-ui.md#33-loading-and-validation), so authoring, test and boot validation cannot drift for those gates; `quiz-content`, `hint-content` and `npc-content` remain authoring-time only until their runtime mirrors land.

### V — Validation

- **V1 — Structural gates.** The eight checks in §7 are implemented by `content:validate` as Zod shapes plus plain TypeScript cross-artifact gates, and must pass before a card set is accepted, before either reviewer runs and before generation (D5). The five shared gate functions back the Vitest suite and the boot-time check in [application-and-ui.md §3.3](application-and-ui.md#33-loading-and-validation); `quiz-content`, `hint-content` and `npc-content` are authoring-time only until their runtime mirrors land.
- **V2 — Independent review.** `content-critic` reviews every card set against the N/P/C/H/D rules using the rubric in §6.1. `pck-reviewer` checks accuracy against `wjec-unit1.md`, GCSE-level scope, terminology and cognitive load using §6.2. Every blocker and major finding from either reviewer is resolved before integration.
- **V3 — Editor sign-off.** The editor checks cross-artifact consistency, updates `docs/coverage/COVERAGE.md` with spec references and evidence, and records status in `docs/content/status.md`. A topic is marked `covered` only when a card supplies real teaching and assessment evidence.
- **V4 — Walkthrough audit.** Before an area (and finally the whole game) is signed off, the editor traces at least one complete, ordered path from each area's `startRoomId` to `game-won` and records it in `docs/content/walkthrough.md`. The trace proves that every gate condition can be satisfied in-world; that every declared room, exit, item, NPC topic, quiz, puzzle, hazard trigger and hint target is reachable or triggerable; and that no dependency creates a soft-lock or an unreachable option. `content-critic` verifies the trace read-only on the final pass described in W4. An area whose contribution to the win set cannot be demonstrated is not integrated.
- **V5 — Runtime walkthrough.** Once an accepted area is generated in W6, `browser-tester` (dispatched directly by `content-editor`) exercises the V4 trace through the running app with the real authored content bundle and confirms that each gate, completion source and `game-won` transition behaves as recorded. The W7 QA report and its screenshots are the evidence; a mismatch is a finding routed to the content owner or the code owner as appropriate. V5 checks the implementation against V4; it does not replace the critic's read-only trace audit.

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

Every artifact has an `id` from the §5 registry. Runtime keys use exactly the
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
resolves in the migrated content.

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
  lives: 3 # reset on entering the area

worlds:
  - id: world-1-computer-architecture
    name: Computer Architecture
    areaIds: [area-1-1-computer-architecture]
    startAreaId: area-1-1-computer-architecture
    lives: 3

rooms:
  - id: room-cpu-lab
    title: The CPU Lab
    aliases: [lab, cpu lab]
    description: >-
      ... # ≤80 words, second person present (N4, N8)
    topicIds: [cpu-components]
    exits:
      - direction: north
        to: room-memory-vault
      - direction: west
        to: room-bus-way
        conditions:
          - { kind: flag-set, flag: bus-mapped }
    entryEffects: [] # Effect[]; omit when empty
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
`conversationNodes`. The approved zone-1 card exposed six points that the schema
and gates must handle explicitly; they follow the example.

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
    onEnter: [] # Effect[]; omit when empty — see greeting note below
    authoring:
      note: Generic default and return state.

conversationTopics:
  - id: topic-fde-explain
    actorId: npc-archivist # see actor binding note below
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
    actorId: npc-archivist # see actor binding note below
    isSticky: false
    topicIds: [topic-fde-why] # generator resolves these to embedded topics
    defaultTopicId: topic-fde-default
    authoring:
      note: Deliberate one-turn teaching beat (C4).
```

The six points to design into the schema and gates:

1. **Vocabulary lives in the bible.** `TopicResolver` maps raw noun phrases
   through globally unique object aliases ([npcs.md §3](npcs.md#3-commands-and-topic-resolution)).
   A topic records `objectIds`, `itemIds` or `keywords`; it never duplicates the
   alias table. The `npc-content` gate checks that every referenced ID exists in
   the bible registry and `COVERAGE.md`.
2. **RESOLVED — actor binding.** Topics and nodes in the card carry `actorId`,
   but neither `ConversationTopic` nor `ConversationNode` in `src/core/npcs/`
   has that field, and both catalogues are global. The user decided to add an
   optional `actorId` to the runtime **`ConversationTopic`** type: the generator
   emits it and the validator checks it names a declared actor, so a topic is
   bound to its actor rather than left reachable from every actor. Conversation
   resolution must filter topics by actor when that code is built. **Node**
   `actorId` stays authoring-only metadata: the validator checks it names a
   declared actor and that the node's `defaultTopicId` belongs to that actor,
   while runtime node membership is established by `enter-node` effects, which
   already carry `actorId`. Node `actorId` is a top-level YAML key: the validator
   reads it and the generator drops it, so it is never emitted into the runtime
   `ConversationNode`. Do not work around topic binding with node membership
   alone.
3. **RESOLVED — silent greeting.** [npcs.md §4](npcs.md#4-conversation-flow) says
   `talk-to` applies the `ready` state's greeting effects, but the zone-1
   `actorstate-ready` declares no `onEnter` effects. The user decided to keep
   the card verbatim: greetings remain in each topic's responses and no greeting
   is authored on state entry. The schema still admits `onEnter` effects for
   other states, but a writer must not add a greeting the card does not declare.
4. **Reserved nodes.** A node with no `enter-node` producer must carry
   `authoring.reserved: true` and a reason, or it is a finding. The zone-1
   `node-foreman-switch-lesson` is deliberately unentered for the reason recorded
   in its card; migrate that reason verbatim. Every `defaultTopicId` must exist in
   the same actor's topics. A catch-all need not be named `*-default`: the
   foreman's is `topic-foreman-predecessor`, and the gate must allow that.
5. **All runtime variants.** The schema admits every `TopicMatch` kind (`ask`,
   `tell`, `askTell`, `give`, `show`, `command`, `special`), every `Condition`
   kind (including `actor-state` and `in-node`), every effect in the shared union
   and all three `ResponseStrategy` kinds, including `sequence`, which zone 1
   does not use. An unused variant is not a validation finding.
6. **Generated node topics.** `ConversationNode.topics` holds embedded topic
   objects at runtime, while the card lists IDs. Authors write `topicIds`; the
   generator resolves them into the runtime `topics` field. This derivation is
   mechanical and must not change response order.

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

| Prefix        | Artifact           | Example                          |
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

Aliases are lowercase words or short phrases, unique across **all** objects and NPCs, and listed in the bible before a writer uses them. A topic ID matching a spec topic uses the exact `## Topic: <id>` heading from `COVERAGE.md`, so the graph can join document and code nodes; no kebab-case conversion is applied.

## 6. Reviewer rubrics

Both reviewers read YAML cards. A passing `content:validate` run is a
precondition (D5), not a substitute: structural correctness says nothing about
voice, fairness or subject accuracy, and reviewer findings still route back to
the writer. V5 is not a card-review rubric: `browser-tester` runs the runtime
walkthrough under W7, dispatched directly by `content-editor`; neither reviewer
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
5. **Data correctness** — IDs/aliases from the registry; exact runtime field names; optional fields omitted; authoring keys confined to `authoring:` blocks; effects/conditions only from the shared unions; action-flag requirements (D2–D4, puzzles.md §3).
6. **Evidence** — claims about the spec cite a PDF section/page; nothing marked `covered` without evidence (V3).
7. **Reachability and completability** — every declared room, exit, item, NPC topic, quiz, puzzle, hazard trigger and hint target in scope is reachable or triggerable; the walkthrough yields a valid path to `game-won`; no soft-lock or unreachable option (V4). This applies on the final whole-card-set pass, not on a partial batch.

It ends with a one-line verdict: `PASS`, `PASS WITH MINORS` or `FAIL`. It never edits a card, and it never proposes new course facts from memory — if a fact is not in `wjec-unit1.md`, it records that as a finding.

### 6.2 PCK reviewer

`pck-reviewer` is read-only and independent of `content-critic`. Its authoritative sources are `docs/exam-specs/wjec-unit1.md` (and the cited PDF), `docs/coverage/COVERAGE.md`, the P rules in §3 and the cards under review. It does not use the web and does not invent course facts. Findings use one line each:

```
[blocker|major|minor] TAG card-path — what is wrong — source (section/page) — suggested fix
```

| Tag              | Check                                                                                                                                                                                                                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PCK-ACC`        | Factual accuracy: every statement, definition, example and quiz key matches the spec. No invented processors, registers, protocols, algorithms or numbers.                                                                                                                                                                                               |
| `PCK-DEPTH`      | Scope stays inside Unit 1; nothing from A-level or professional practice is smuggled in. Respect "should know" versus "should be aware of" (Version 3 changed one item on p.53 from "understand" to "be aware of"). Do not present technology as value-free where the spec integrates legal, social, ethical, environmental and professional dimensions. |
| `PCK-TERM`       | Terminology matches the spec; a friendly paraphrase must be accompanied by the formal term. No misleading shorthand.                                                                                                                                                                                                                                     |
| `PCK-LOAD`       | Prerequisites come before use; new vocabulary is explained in plain GCSE-level language; text is readable by a typical 14–16 year-old with no assumed prior CS knowledge.                                                                                                                                                                                |
| `PCK-AO`         | Questions assess the tagged objective and the spec's command words; AO1 and AO2 present; AO3 only for design/evaluation topics (algorithms, SDLC).                                                                                                                                                                                                       |
| `PCK-DISTRACTOR` | Wrong options are plausible misconceptions a GCSE learner actually holds, rooted in the spec.                                                                                                                                                                                                                                                            |
| `PCK-EVIDENCE`   | A spec reference and evidence note exist; nothing is treated as covered without them.                                                                                                                                                                                                                                                                    |

It ends with `PASS`, `PASS WITH MINORS` or `FAIL` (FAIL = at least one blocker or major). It does not review voice, aliases, IDs or data shape — that is `content-critic`'s job — and it does not design the fix: it points to the spec section and states the correct claim or appropriate depth.

## 7. Structural validation gates

`npm run content:validate` parses every card with the `yaml` package, applies the
Zod shapes and runs all eight cross-artifact gates below as plain TypeScript.
Five of them (`content-ids`, `puzzle-graph`, `world-graph`, `hazard-content`,
`score-content`) also back the Vitest suite and the boot-time check in
[application-and-ui.md §3.3](application-and-ui.md#33-loading-and-validation);
`quiz-content`, `hint-content` and `npc-content` are authoring-time only until
their runtime mirrors land.
Findings print as `path/to/file.yaml:entry — what is wrong — gate ID`, and any
finding fails the command with a non-zero exit code. These are cross-artifact
gates; authoring-only checks (stray keys outside `authoring:`, document `status`,
unresolved `todo` placeholders) run only on YAML and cannot run on the runtime
bundle.

A gate that cannot check a clause must report the gap rather than silently pass
it. The location-scope clause of `npc-content` is currently a normative authoring
rule verified by `content-critic` (C6, V4): `content:validate` does not yet
extract location scopes or compare a scoped topic with its actor's catch-all,
and code-lead owes that gate check. Writers must not treat the absence of a
validator finding as permission to ignore C6.

| Gate             | Checks                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content-ids`    | Unique artifact IDs; globally unique aliases across objects and NPCs; ID prefixes per §5, including `area-` and `world-`; every referenced topic ID exists in `COVERAGE.md` or `spec-topics.yaml`; every exit target and `move-player` room exists; exit directions valid; aliases used by topics exist in the bible registry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `quiz-content`   | `1 <= passMark <= questionIds.length`; every question has ≥1 correct option within range; explanation non-empty; AO tag and difficulty present; ≥1 AO1 and ≥1 AO2 per quiz; `onPass` sets `quiz-passed:<id>` and emits `complete-topic`; `onFail` includes `change-lives`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `puzzle-graph`   | `dependsOn` IDs exist; graph acyclic; every puzzle reachable from the start; requirements are action-set flags rather than bare `has-item`; ≥2 clues per puzzle; `topicId` exists.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `world-graph`    | Exactly one `worlds` declaration per world and every `definition.worldId` resolves; the start world's `startAreaId` and that area's `startRoomId` resolve by ID, never by array position; when more than one world is declared, the world owning the authored start area (the one whose `startAreaId` names it) must be first in declaration order, because `GameState.createInitial()` boots from `worlds.all[0]`; the opening world this identifies is v1's sole world, and if several worlds are intentionally authored it is the one named by the accepted V4 walkthrough and its area's `definition.worldId`; every room reachable from its area's `startRoomId`; every item's `initialRoom` or owning actor reachable; every quiz, NPC topic, hazard trigger and hint target reachable or triggerable; every `covered` topic with evidence has a completion source on some valid path, so `game-won` is achievable. The V4 walkthrough remains the human audit of the same conditions; V5 checks them at runtime against the generated build.                                                            |
| `hint-content`   | 2–4 levels in ascending order; unlock keys from the agreed namespace; targets exist; no answer-revealing level; penalty absent or zero by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `hazard-content` | Telegraph text present; effects only from the shared union; no `set-puzzle-*` effects; level-start room declared for the area.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `npc-content`    | Every `actorId` on a topic or node resolves to an actor and binds that artefact to that actor, with no cross-actor topic leakage; every `objectId`, `itemId` and keyword resolves in the bible registry and `COVERAGE.md`; every `defaultTopicId` exists in the same actor's topics; a catch-all may be any active topic, not only one named `*-default`; location-scope extraction and catch-all scope matching are **not yet enforced here** (see the preamble above and C6); `content-critic` verifies them until code-lead adds the check; a node with no `enter-node` producer carries `authoring.reserved: true` with a reason; no greeting is authored on `actorstate-ready` (the recorded silent-greeting decision); all `TopicMatch`, `Condition`, `Effect` and `ResponseStrategy` kinds are accepted, including unused `sequence`; node `topicIds` resolve to concrete topics; effects only from the shared union; aliases unique. |
| `score-content`  | Every room, puzzle and quiz defines a non-negative integer `score`; each entry in `spec-topics.yaml` carries the `SpecTopic` fields (`id`, `title`, `specReference`, `codeLocation`, `status`, `evidence`, `roomIds`, `maxScore`); for each spec topic, the sum of scores of its mapped rooms, puzzles and quizzes is at most that topic's `maxScore` ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)); every area declares a valid `startRoomId`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

The actor-binding decision recorded in §4.3 point 2 and §8 is resolved, so
`npc-content` enforces the topic and node binding checks along with every other
gate above. A validator that cannot check any clause must report the gap rather
than silently pass it.

## 8. Decisions content must not assume

Content must use the values below instead of hard-coding its own; flag any
unavoidable assumption in the card. Authority is
[architecture.md §11](architecture.md#11-decision-log).

| Topic                                | Decision                                                                                                                                                                                                                                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Win condition                        | All mapped spec topics with `covered` status and evidence completed cause `Session.observe` to emit `game-won` with the final score ([application-and-ui.md §11](application-and-ui.md#11-win-check-owner)).                                                                                               |
| Starting lives                       | `3`, reset on **area change**; loss comes from hazards and failed quizzes.                                                                                                                                                                                                                                 |
| Verb list, aliases, ambiguity policy | The v1 verb and alias tables are fixed in [application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs), including dedicated door verbs. Unknown verbs and nouns degrade to a friendly in-voice message, never a parser error, and there is no disambiguation prompt.              |
| Undo, autosave, save slots           | None. Saves are manual, via buttons or typed meta-action aliases.                                                                                                                                                                                                                                          |
| Save key and corrupt saves           | Key is `compsciquest:save:v1`; a corrupt live save is quarantined, not discarded.                                                                                                                                                                                                                          |
| Exact scoring formula                | Per puzzle: each room visit, puzzle solve and quiz pass awards its own content-declared `score`, within `SpecTopic.maxScore`; `topic-completed` awards nothing. See [application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic).                                             |
| Title screen                         | v1 boots to a Continue / New Game overlay before the first room; Continue is disabled without a valid save.                                                                                                                                                                                                |
| Content registration                 | Validated YAML cards generate committed `src/content/authored/*.ts`, assembled into one injected `ContentBundle`; areas declare `startRoomId` as a runtime field. There is no runtime or build-time YAML parsing.                                                                                          |
| Boot start position                  | `GameState.createInitial()` boots from the first declared world (`worlds.all[0]`); then the area is resolved by that world's `startAreaId` and the room by that area's `startRoomId`, by ID, never by array position within the areas/rooms catalogues. Unit tests use a separate deterministic fixture.   |
| Validation                           | `content:validate` runs before review and generation; `content-critic` and `pck-reviewer` remain independent read-only gates.                                                                                                                                                                              |
| NPC actor binding and greeting       | Resolved by the user: add an optional `actorId` to runtime `ConversationTopic` (generated and validated); node `actorId` stays authoring-only, with runtime membership via `enter-node` effects. The ready state keeps the card's silence — greetings remain in topic responses, never added as `onEnter`. |

## 9. Agent acceptance contract

Every agent file contains two sections: **Definition of done** (binary checks that must all be true before the agent finishes) and **Constraints and escalation** (hard limits plus the conditions under which the agent must return `BLOCKED: <reason>` instead of guessing). This section is the shared contract those sections implement; if an agent's wording and this section disagree, this section wins.

### 9.1 Shared definition of done

1. Only the YAML card named in the brief was changed; a writer edits neither the scaffold, the schema, the validator, the generator nor generated TypeScript.
2. Every ID and alias comes from the bible registry; every topic ID exists in `COVERAGE.md`; runtime field names match the subsystem docs and optional fields are omitted; authoring metadata is confined to `authoring:` blocks.
3. `content:validate` passes with no findings before review (D5, V1). Conditions, triggers and effects use only the shared unions; no score is written by content; no HTML is produced; the §8 decisions are used as given, with scoring points and verb aliases authored as content rather than invented as global rules.
4. Writers end with a report containing the card path, artifact IDs, the validator verdict and flagged assumptions. Reviewers end with findings in the required format and exactly one verdict line.
5. No blocker or major finding from either reviewer remains unresolved in the final round.
6. Where the brief is a whole-card-set or integration pass, a walkthrough trace is present and verified against V4, with no unreachable option or unachievable win contribution left unresolved.
7. Where the card defines NPCs, actor binding is explicit, the greeting decision is recorded, reserved nodes are marked with a reason, default topics exist and all runtime variants remain admissible (§4.3).

### 9.2 Shared hard constraints

- Neither writers nor reviewers edit another agent's file. Reviewers edit nothing at all.
- No course fact is invented from memory or fetched from the web. Unverifiable claims become findings, not corrections.
- No TypeScript, engine code, rulebook, agent-file or config changes. In particular, no schema, validator, generator or generated TypeScript edits, no Markdown replacement cards, no hand conversion to TypeScript and no runtime or build-time YAML parsing.
- The §8 decisions are authoritative. If the bible is silent on a mechanic outside that table, escalate to the user rather than guessing.

### 9.3 Stop-and-escalate and the review loop

Return `BLOCKED: <reason>` rather than guessing when: a required ID, alias or topic ID is missing; the brief conflicts with the bible, the spec or this rulebook; a structural validation gate fails and the fix belongs to another owner; a topic or node `actorId` names no declared actor; a greeting is added to the silent ready state; an unentered node has no `authoring.reserved` reason; a subject claim is unverifiable; a mechanic outside the §8 decisions and the bible is unclear; a dependency would create a cycle or an unreachable puzzle, room, item, topic, quiz, hazard trigger or hint target; the walkthrough cannot reach `game-won` or a `covered` topic has no completion source on any valid path; or no counterplay can be designed for a hazard.

After a review round, a writer may revise **only its own file, at most two rounds**. If the finding requires another agent's file or a bible change, it returns `BLOCKED: <finding> requires <owner>` (owner = editor, another writer or the bible). The editor reconciles by updating the bible and re-briefing; it never edits a writer's card itself. Reviewers do not enter this loop — they return findings and the editor routes them.
