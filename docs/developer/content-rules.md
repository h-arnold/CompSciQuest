# Content authoring rules (design)

Status: draft · Last updated: 2026-11-24

Part of the CompSciQuest design set: [architecture](architecture.md) · [shared rule spine](shared-rules.md) · [NPCs](npcs.md) · [hazards](hazards.md) · [quiz combat](combat.md) · [puzzles](puzzles.md) · [hints](hints.md).

## 1. Purpose and authority

This file is the rulebook for game **content**: rooms, items, NPCs, conversations, quizzes, puzzles, hazards, hints and the prose that binds them. The runtime contracts live in [architecture.md](architecture.md) and the subsystem documents; this file defines how content should be designed so those contracts are filled consistently, and by whom.

Authority order when sources disagree:

| Question | Authority order |
| --- | --- |
| Course facts | `docs/exam-specs/wjec-unit1.md` and the PDF → `docs/coverage/COVERAGE.md` → bible |
| Data shape and runtime behaviour | subsystem docs + [shared-rules.md](shared-rules.md) → this file |
| Authoring practice | this file → bible |
| Creative choices | bible, subject to the rules below |

Definitions used throughout:

- **Bible** — `docs/content/content-bible.md`: the premise, pillars, area list, cast, hazard themes, topic allocation, Puzzle Dependency Graph (PDG) and ID/alias registry. Co-authored with the user; changed only with their approval.
- **Card** — a Markdown file under `docs/content/<area>/` specifying one kind of content.
- **Artifact** — one defined object inside a card (a room, an NPC, a quiz, a hint level…).
- **Brief** — the self-contained task the editor sends to a writer. Subagents start with fresh context, so a brief must contain everything the writer needs.
- **Reviewers** — `content-critic` checks rule, prose and data-shape conformance; `pck-reviewer` checks subject-matter accuracy against Unit 1 and appropriateness for a GCSE learner. Both are read-only and independent of the writers.

## 2. Workflow gates

- **W1 — Ideation (editor + user).** No content is written yet. The editor co-develops the bible with the user, offering concrete options and resolving conflicts against the exam spec. The bible is written to `docs/content/content-bible.md`.
- **W2 — Approval.** The editor summarises the bible and asks the user to approve it. **No writer is launched before approval.** Revision requests update the bible, not individual cards.
- **W3 — Dispatch.** The editor sends one brief per (area, kind) to the relevant writer. Independent briefs may run in parallel; one writer owns each output file to avoid conflicts.
- **W4 — Review.** The editor launches `content-critic` and `pck-reviewer` in parallel on the returned cards and resolves every blocker and major finding from **both** by sending the card back to its writer. Cross-artifact contradictions are fixed by updating the bible and re-briefing. A card is not accepted until both reviewers return `PASS` or `PASS WITH MINORS` with no blockers or majors.
- **W5 — Integration.** The editor updates `docs/coverage/COVERAGE.md` and `docs/content/status.md`, then reports to the user. Only then is the area considered done.
- **W6 — Later.** Conversion of approved cards into `src/content/*.ts` and implementation of the structural tests in §7 are separate work, deliberately out of scope for this draft.

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

- **P1 — Topic contract.** Every room, puzzle, quiz and hint has at least one `topicId`, or is explicitly marked `navigation-only`. Topic IDs must match a `## Topic: <name>` heading in `docs/coverage/COVERAGE.md` with a spec reference and an evidence note. Writers never invent topic IDs.
- **P2 — Three beats per topic.** Where the spec calls for it, a topic has a teaching beat (NPC explanation or dialogue), a retrieval beat (quiz question) and an application beat (puzzle or other in-world action). A topic with only a quiz is incomplete.
- **P3 — Assessment objectives.** Every quiz question is tagged `AO1`, `AO2` or `AO3` plus a difficulty. Each quiz contains at least one `AO1` and one `AO2` question; `AO3` is used for design/evaluation topics (algorithms, SDLC). Tags are authoring metadata, dropped on conversion.
- **P4 — Distractors and explanations.** Wrong options are plausible misconceptions drawn from the spec, never nonsense options. Every answer, right or wrong, produces an explanation that says why the key is correct and, where useful, why the chosen distractor is wrong ([combat.md §2](combat.md#2-model)).
- **P5 — Retrieval loop.** Quizzes have no timer. `passMark` is a count, not a percentage. Retries are unlimited unless the editor explicitly assigns `attemptsAllowed`. Failure costs a life and returns the player to the declared level start; it never resets topic or puzzle progress ([combat.md §3](combat.md#3-flow)).
- **P6 — Score integrity.** Content never writes score and never awards points itself. It emits `complete-topic`; `ScoreTracker` decides whether the covered+evidence rule allows points ([shared-rules.md §5](shared-rules.md#5-effect-and-effectapplier)). Hints default to zero penalty.

### C — Conversation and NPCs

- **C1 — NPC identity.** Each NPC has a distinct role, voice, motivation and at least one relationship dynamic with another character or the player. Opposing motivations are preferred: they create conflict and give the player someone to agree with ([npcs.md §2](npcs.md#2-model)).
- **C2 — No parser errors in dialogue.** Every conversational input resolves to a topic or to an in-character default reply ([npcs.md §3](npcs.md#3-commands-and-topic-resolution)). Cards never contain the words "parser error", "unknown command" or "I don't understand that" as dialogue. `prompt` strings surface what the player can ask.
- **C3 — Knowledge gating.** Use `isActive` and `npc-knows` to hide information until it has been mentioned. Where the player could discover the fact independently, define a second topic with a negated condition (the TADS `AltTopic` pattern) ([npcs.md §4](npcs.md#4-conversation-flow)).
- **C4 — Conversation nodes.** A `ConvNode` is used only for a deliberate forced teaching beat. Default nodes expire after one turn; `isSticky: true` needs an explicit reason in the card. There is no turn timeout: conversation ends on `bye`, leaving the room, or starting a quiz.
- **C5 — Effects and aliases.** All conversation state changes go through the shared `Effect` union. Aliases come from the editor's global registry and must be unique across objects and NPCs ([shared-rules.md §10](shared-rules.md#10-content-registration)).

### H — Hazards and hints

- **H1 — Hazards are telegraphed.** Each hazard has at least one clue in the room description or NPC dialogue before it can fire. Harm is a brief penalty, not a puzzle: lose a life, return to the declared level start, optionally reset level-local flags. Never reset puzzle phase, and never offer a hint during a hazard ([hazards.md §4](hazards.md#4-failure-consequences)).
- **H2 — Hint ladders.** A sequence has 2–4 levels that escalate nudge → structure → procedure. No level reveals the answer or solves the puzzle; the player must still answer ([hints.md §4](hints.md#4-adaptive-behaviour)). Levels are gated by `unlock` conditions using only the agreed counter keys. Targets include spec topic IDs so the score panel can label the revision area. Default `scorePenalty` is 0.
- **H3 — Adaptive hints.** Automatic hints fire only after genuine stuck evidence: a wrong answer increments `failed-attempts:<quizId>`, or N stuck turns increments `turns-since:<puzzleId>`. Do not set `autoOfferAfter` so low that it offers help before the player has tried.

### D — Data and cards

- **D1 — Cards only.** Writers produce Markdown design cards under `docs/content/<area>/`. They never edit engine code, `src/`, the rulebook, agent files or `opencode.json`.
- **D2 — Editor-owned IDs.** IDs are kebab-case with a kind prefix: `room-`, `item-`, `npc-`, `actorstate-`, `topic-`, `node-`, `quiz-`, `q-`, `puzzle-`, `hazard-`, `hint-`. The editor allocates IDs and aliases in the bible; writers never invent one outside their brief.
- **D3 — Runtime data shape.** Runtime fields use exactly the names and types in the subsystem docs. Only plain strings, numbers, arrays and records are allowed; omit optional fields rather than assigning `undefined` ([shared-rules.md §8](shared-rules.md#8-state-additions--schema-stays-v1)).
- **D4 — Authoring metadata is separate.** Fields such as `assessmentObjective`, `difficulty`, `clues`, `role`, `voice`, `motivation`, `relationship` and `telegraph` exist only on cards. They are dropped on conversion to TypeScript and never fed to the engine.

### V — Validation

- **V1 — Structural gates.** The checks in §7 must pass before a card set is accepted. They are intended as a Vitest suite; specification only in this draft.
- **V2 — Independent review.** `content-critic` reviews every card set against the N/P/C/H/D rules using the rubric in §6.1. `pck-reviewer` checks accuracy against `wjec-unit1.md`, GCSE-level scope, terminology and cognitive load using §6.2. Every blocker and major finding from either reviewer is resolved before integration.
- **V3 — Editor sign-off.** The editor checks cross-artifact consistency, updates `docs/coverage/COVERAGE.md` with spec references and evidence, and records status in `docs/content/status.md`. A topic is marked `covered` only when a card supplies real teaching and assessment evidence.

## 4. Design card format

### 4.1 Common conventions

One file per (area, kind), named as in the table below. Every file begins with frontmatter:

```yaml
---
kind: area            # area | npc | quiz | puzzle | hazard | hint
area: 1-1-computer-architecture
topicIds: [cpu-components, fetch-decode-execute]
status: draft         # draft | reviewed | approved
---
```

Each artifact is a `### <id>` section. Fields are listed as `- name: value`. Nested runtime objects use inline record syntax, e.g. `- { kind: flag-set, flag: door-unlocked, value: true }`. Omit optional runtime fields entirely. Authoring metadata is marked `(authoring)` and is dropped on conversion.

| Kind | File | Artifacts defined |
| --- | --- | --- |
| area | `rooms.md` | rooms, exits, items |
| npc | `npcs.md` | actors, actor states, conversation topics, conversation nodes |
| quiz | `quizzes.md` | quizzes, questions |
| puzzle | `puzzles.md` | puzzles |
| hazard | `hazards.md` | hazards |
| hint | `hints.md` | hint sequences |

### 4.2 Area / rooms card

```md
### room-cpu-lab
- title: The CPU Lab
- aliases: [lab, cpu lab]
- description: ...            # ≤80 words, second person present (N4, N8)
- interesting: ...            # (authoring) the sensory/affordance hook
- topicIds: [cpu-components]
- exits:
  - { direction: north, to: room-memory-vault }
  - { direction: west, to: room-bus-way, conditions: [{ kind: flag-set, flag: bus-mapped }] }
- entryEffects: []            # Effect[]; omit when empty
- levelStart: true            # (authoring) declared start for this world/area

### item-register-cache
- name: register cache
- aliases: [cache, registers]
- portable: true
- description: ...
- useNotes: ...               # (authoring) which action sets which flag
```

### 4.3 NPC card

```md
### npc-archivist
- aliases: [archivist, keeper]
- initialStateId: actorstate-ready
- role: tutor               # (authoring) C1
- voice: clipped, patient    # (authoring) C1
- motivation: ...           # (authoring) C1
- relationship: ...         # (authoring) C1

### actorstate-ready
- stateDesc: ...
- specialDesc: ...
- onEnter: []               # Effect[]; omit when empty

### topic-fde-explain
- actorId: npc-archivist
- match: { kind: askTell, objectIds: [fetch-decode-execute] }
- isActive: { kind: not, of: { kind: npc-knows, actorId: npc-archivist, topicId: fetch-decode-execute } }
- responses: [...]          # in-character, N4
- strategy: { kind: once }
- effects: [{ kind: learn-topic, actorId: npc-archivist, topicId: fetch-decode-execute }]
- prompt: ...               # "(You could ask why.)"

### node-fde
- actorId: npc-archivist
- isSticky: false
- topics: [topic-fde-why]
- defaultTopicId: topic-fde-default
```

### 4.4 Quiz card

```md
### quiz-fde-cycle
- actorId: npc-archivist
- topicId: fetch-decode-execute
- questionIds: [q-fde-1, q-fde-2, q-fde-3]
- passMark: 2
- onPass:
  - { kind: complete-topic, topicId: fetch-decode-execute }
  - { kind: set-flag, flag: quiz-passed:quiz-fde-cycle, value: true }
  - { kind: message, text: ... }
- onFail:
  - { kind: change-lives, delta: -1, reason: ... }
  - { kind: move-player, roomId: room-cpu-lab, reason: ... }
- hintSequenceId: hint-fde

### q-fde-1
- prompt: ...
- options: [...]
- correctOptionIds: [1]     # 0-based indices; UI shows 1-based
- explanation: ...
- assessmentObjective: AO1  # (authoring) P3
- difficulty: easy          # (authoring) P3
- misconception: ...        # (authoring) P4: what wrong answers target
```

### 4.5 Puzzle card

```md
### puzzle-unlock-cache
- requirements: [{ kind: flag-set, flag: cache-decoded }]  # action flags, not possession
- onSolve: [{ kind: complete-topic, topicId: data-representation }]
- topicId: data-representation
- hintSequenceId: hint-cache
- dependsOn: [puzzle-find-key]
- clues: [...]              # (authoring) ≥2 discoverable clues, N6
```

### 4.6 Hazard card

```md
### hazard-overheat
- trigger: { kind: on-room-enter, roomId: room-cpu-lab }
- when: { kind: not, of: { kind: flag-set, flag: cooling-fitted } }
- effects:
  - { kind: message, text: ... }
  - { kind: change-lives, delta: -1, reason: ... }
  - { kind: move-player, roomId: room-cpu-lab, reason: ... }
- once: true
- telegraph: ...            # (authoring) the clue before harm, H1
```

### 4.7 Hint card

```md
### hint-fde
- targets: [fetch-decode-execute, puzzle-unlock-cache]
- levels:
  - { level: 1, text: ..., unlock: { kind: counter-at-least, key: failed-attempts:quiz-fde-cycle, value: 1 } }
  - { level: 2, text: ..., unlock: { kind: counter-at-least, key: turns-since:puzzle-unlock-cache, value: 3 } }
- cooldownTurns: 2
```

## 5. ID and alias registry

The bible owns one registry table. Writers copy IDs from it verbatim; a request for a new ID goes back to the editor and the user.

| Prefix | Artifact | Example |
| --- | --- | --- |
| `room-` | room | `room-cpu-lab` |
| `item-` | item | `item-register-cache` |
| `npc-` | actor | `npc-archivist` |
| `actorstate-` | actor state | `actorstate-ready` |
| `topic-` | conversation topic | `topic-fde-explain` |
| `node-` | conversation node | `node-fde` |
| `quiz-` | quiz | `quiz-fde-cycle` |
| `q-` | quiz question | `q-fde-1` |
| `puzzle-` | puzzle | `puzzle-unlock-cache` |
| `hazard-` | hazard | `hazard-overheat` |
| `hint-` | hint sequence | `hint-fde` |

Aliases are lowercase words or short phrases, unique across **all** objects and NPCs, and listed in the bible before a writer uses them. A topic ID matching a spec topic uses the exact `## Topic: <name>` heading from `COVERAGE.md` (converted to kebab-case), so the graph can join document and code nodes.

## 6. Reviewer rubrics

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
5. **Data correctness** — IDs/aliases from the registry; exact runtime field names; optional fields omitted; effects/conditions only from the shared unions; action-flag requirements (D2–D4, puzzles.md §3).
6. **Evidence** — claims about the spec cite a PDF section/page; nothing marked `covered` without evidence (V3).

It ends with a one-line verdict: `PASS`, `PASS WITH MINORS` or `FAIL`. It never edits a card, and it never proposes new course facts from memory — if a fact is not in `wjec-unit1.md`, it records that as a finding.

### 6.2 PCK reviewer

`pck-reviewer` is read-only and independent of `content-critic`. Its authoritative sources are `docs/exam-specs/wjec-unit1.md` (and the cited PDF), `docs/coverage/COVERAGE.md`, the P rules in §3 and the cards under review. It does not use the web and does not invent course facts. Findings use one line each:

```
[blocker|major|minor] TAG card-path — what is wrong — source (section/page) — suggested fix
```

| Tag | Check |
| --- | --- |
| `PCK-ACC` | Factual accuracy: every statement, definition, example and quiz key matches the spec. No invented processors, registers, protocols, algorithms or numbers. |
| `PCK-DEPTH` | Scope stays inside Unit 1; nothing from A-level or professional practice is smuggled in. Respect "should know" versus "should be aware of" (Version 3 changed one item on p.53 from "understand" to "be aware of"). Do not present technology as value-free where the spec integrates legal, social, ethical, environmental and professional dimensions. |
| `PCK-TERM` | Terminology matches the spec; a friendly paraphrase must be accompanied by the formal term. No misleading shorthand. |
| `PCK-LOAD` | Prerequisites come before use; new vocabulary is explained in plain GCSE-level language; text is readable by a typical 14–16 year-old with no assumed prior CS knowledge. |
| `PCK-AO` | Questions assess the tagged objective and the spec's command words; AO1 and AO2 present; AO3 only for design/evaluation topics (algorithms, SDLC). |
| `PCK-DISTRACTOR` | Wrong options are plausible misconceptions a GCSE learner actually holds, rooted in the spec. |
| `PCK-EVIDENCE` | A spec reference and evidence note exist; nothing is treated as covered without them. |

It ends with `PASS`, `PASS WITH MINORS` or `FAIL` (FAIL = at least one blocker or major). It does not review voice, aliases, IDs or data shape — that is `content-critic`'s job — and it does not design the fix: it points to the spec section and states the correct claim or appropriate depth.

## 7. Structural validation gates (specification only)

To be implemented as Vitest tests when cards are converted to TypeScript. No test files exist in this draft.

| Gate | Checks |
| --- | --- |
| `content-ids` | Unique artifact IDs; globally unique aliases; ID prefixes per §5; every referenced topic ID exists in `COVERAGE.md`; every exit target and `move-player` room exists; exit directions valid. |
| `quiz-content` | `1 <= passMark <= questionIds.length`; every question has ≥1 correct option within range; explanation non-empty; AO tag and difficulty present; ≥1 AO1 and ≥1 AO2 per quiz; `onPass` sets `quiz-passed:<id>` and emits `complete-topic`; `onFail` includes `change-lives`. |
| `puzzle-graph` | `dependsOn` IDs exist; graph acyclic; every puzzle reachable from the start; requirements are action-set flags rather than bare `has-item`; ≥2 clues per puzzle; `topicId` exists. |
| `hint-content` | 2–4 levels in ascending order; unlock keys from the agreed namespace; targets exist; no answer-revealing level; penalty absent or zero by default. |
| `hazard-content` | Telegraph text present; effects only from the shared union; no `set-puzzle-*` effects; level-start room declared for the area. |
| `npc-content` | `defaultTopicId` exists in the node; topic `match` fields non-empty; effects only from the shared union; aliases unique. |

## 8. Decisions content must not assume

Content must use the values below instead of hard-coding its own; flag any
unavoidable assumption in the card. Authority is
[architecture.md §11](architecture.md#11-decision-log).

| Topic | Decision |
| --- | --- |
| Win condition | All mapped spec topics covered emits `game-won` with the final score. |
| Starting lives | `3`, reset when entering a new world/area; loss comes from hazards and failed quizzes. |
| Verb list, aliases, ambiguity policy | Grows with content. Unknown verbs and nouns degrade to a friendly in-voice message, never a parser error. |
| Undo, autosave, save slots | None. |
| Save key and corrupt saves | Key is `compsciquest:save:v1`; a corrupt live save is quarantined, not discarded. |
| Exact scoring formula | Still content-dependent: points per room/topic and per-area maximums live in content. |

## 9. Agent acceptance contract

Every agent file contains two sections: **Definition of done** (binary checks that must all be true before the agent finishes) and **Constraints and escalation** (hard limits plus the conditions under which the agent must return `BLOCKED: <reason>` instead of guessing). This section is the shared contract those sections implement; if an agent's wording and this section disagree, this section wins.

### 9.1 Shared definition of done

1. Only the file named in the brief was changed.
2. Every ID and alias comes from the bible registry; every topic ID exists in `COVERAGE.md`; runtime field names match the subsystem docs and optional fields are omitted.
3. Conditions, triggers and effects use only the shared unions; no score is written by content; no HTML is produced; no mechanic is assumed from §8.
4. Writers end with a report containing the file path, artifact IDs and flagged assumptions. Reviewers end with findings in the required format and exactly one verdict line.
5. No blocker or major finding from either reviewer remains unresolved in the final round.

### 9.2 Shared hard constraints

- Neither writers nor reviewers edit another agent's file. Reviewers edit nothing at all.
- No course fact is invented from memory or fetched from the web. Unverifiable claims become findings, not corrections.
- No TypeScript, engine code, rulebook, agent-file or config changes.
- Undecided mechanics in §8 are escalated to the user, never guessed.

### 9.3 Stop-and-escalate and the review loop

Return `BLOCKED: <reason>` rather than guessing when: a required ID, alias or topic ID is missing; the brief conflicts with the bible, the spec or this rulebook; a subject claim is unverifiable; a mechanic is undecided; a dependency would create a cycle or an unreachable puzzle; or no counterplay can be designed for a hazard.

After a review round, a writer may revise **only its own file, at most two rounds**. If the finding requires another agent's file or a bible change, it returns `BLOCKED: <finding> requires <owner>` (owner = editor, another writer or the bible). The editor reconciles by updating the bible and re-briefing; it never edits a writer's card itself. Reviewers do not enter this loop — they return findings and the editor routes them.
