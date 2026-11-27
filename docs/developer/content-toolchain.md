# Content toolchain

## 1. Purpose

This document defines how approved content is authored, validated and turned
into the runtime `ContentBundle`. It specifies the **mechanism**, not course
facts or narrative: the bible, narrative principles and subsystem documents own
what a card means; this document owns how it is stored, checked and generated.
Course facts come from `docs/exam-specs/wjec-unit1.md` and the cited PDF, then
`docs/coverage/COVERAGE.md`; the bible owns creative intent.

## 2. Authoring format

YAML is the sole authoring format. One file per (area, kind) lives under
`docs/content/<area-id>/`; `docs/content/spec-topics.yaml` is the single
non-per-area card and holds spec topics across all areas. Each card carries
`kind`, `areaId`, `status`, optional `topicIds` and one or more named
collections; every artefact has an ID allocated in the brief and recorded on its
card. Runtime keys
use the exact names in the subsystem documents (D3), optional fields are omitted
rather than set to `null`, prose uses block scalars (`>-` or `|-`), and authoring
metadata lives under an `authoring:` block that the generator drops (D4).
Conditions, triggers and effects use only the unions in `shared-rules.md`. Each
kind's card shape is owned by its contract doc:
[areas](areas.md#7-card-format), [npcs](npcs.md#8-npc-card-format),
[combat](combat.md#6-card-format), [puzzles](puzzles.md#7-card-format),
[hazards](hazards.md#7-card-format) and [hints](hints.md#6-card-format).

The schema in `tools/content/schema.ts` parses each card with the `yaml` package
and validates the authoring envelope with Zod: the `kind` enum, the optional
document metadata, the shapes of the collections a card may hold and the
`status` values. It rejects a stray authoring key outside `authoring:` and any
unresolved `todo` placeholder. Field names come from the subsystem documents
(D3); the schema follows them. Cross-artefact meaning belongs to the gates in
§4, not the schema. An item may declare a top-level `useText` with required
`success` and optional `blocked` prose; the Zod item shape enforces that.

Multi-paragraph prose uses a literal YAML block scalar (`|`). A folded scalar
(`>-`) joins its lines into one paragraph and destroys paragraph breaks, so it
is reserved for single-paragraph strings. Fenced code and tables inside a
literal block are indented consistently with the rest of the block; YAML strips
that indentation, so the Markdown reaches the transcript unchanged. No schema
change is required: descriptions and responses are already strings.

Card allocation follows the ownership rule in
[bible §4.2](../content/content-bible.md#42-card-ownership-by-area--user-directed-structure):
an artefact belongs in the card of the area that uses it. The validator and
generator merge every card into the same catalogue, so this layout needs no
special handling.

A world is declared once, in the `worlds` collection of the area whose
`startAreaId` it names; other areas in that world set only `definition.worldId`
([areas.md §2](areas.md#2-ownership-and-worlds); D3).

`docs/content/spec-topics.yaml` grows as topics are created; do not enumerate
the specification up front. Each entry follows the `SpecTopic` contract in
[application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures) and
`src/core/scoring/SpecTopic.ts`, with `id` taken from a `## Topic: <id>` heading
in `docs/coverage/COVERAGE.md`. World and area indexing stays in
`SpecTopicCatalogue` and is not repeated on the entry; these fields are what
`score-content` needs. Query the coverage graph (`graphify` from `docs/`, or the
`coverage-local` MCP server) to find the topics that exist, and never invent a
topic that has no coverage heading.

### Review labels

Briefs, card notes and reviewer findings use three labels:

| Label        | Meaning                                                       | Failure handling                                                        |
| ------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **MUST**     | Required for acceptance.                                      | Blocker or major finding; the card cannot be approved while it is open. |
| **SHOULD**   | Expected quality default, not a hidden acceptance test.       | Minor finding, or major if repeated across a card set.                  |
| **MUST NOT** | Forbidden in authored content, even when the rest is correct. | Blocker or major finding, according to the cited rule.                  |

A rule ID owns its rule. The labels organise reading; they do not replace the
cited rule or change its meaning.

### Authoring rules

- **D1 — YAML cards only.** Writers populate YAML cards under
  `docs/content/<area-id>/` from the schema-driven scaffolds. They never edit
  the schema, validator, generator, generated TypeScript, engine code, the
  design documents, agent files or `opencode.json`. There is no hand conversion to
  TypeScript.
- **D3 — Runtime data shape.** Runtime fields use exactly the names and types in
  the subsystem docs and appear as YAML keys of the same names, except the exit
  `to` → `targetRoomId` and `conditions` → `preconditions` renames (§5). Only
  plain strings, numbers, arrays and records are allowed; omit optional fields
  rather than assigning `undefined` or `null`
  ([storage-schema.md §3](storage-schema.md#3-persisted-shape-canonical)). Prose
  uses block scalars (`>-` or `|-`). `AreaDefinition.roomIds` is derived from the
  order of `rooms` and `ConversationNode.topics` is resolved from the node's
  `topicIds`; neither is authored. Each item declares its `initialRoom`; after
  that, ownership lives on Player, NPC or Room state. An item may also declare
  the optional `refusalText` string; omit it when absent or empty, since an
  empty value falls back to the default refusal.
- **D4 — Authoring metadata is separate.** Keys such as `assessmentObjective`,
  `difficulty`, `clues`, `misconception`, `role`, `voice`, `motivation`,
  `relationship`, `telegraph`, `interesting` and `useNotes` live under an
  `authoring:` block on the artefact. The generator drops that block wholesale;
  a stray authoring key outside the block is a validation finding. `startRoomId`
  is a runtime field of the area definition; `levelStart` is retired. Room
  `topicIds` are a separate authoring reference used by the gates; the generator
  does not copy them into `RoomDefinition`.

## 3. Scaffolds

`npm run content:scaffold -- <area-id>` writes the six YAML scaffold files for
that area. Refusal is all-or-nothing: if any target file already exists, the run
writes nothing and lists the refused files, unless `--force` is given. The rooms
card seeds `todo` placeholders for names, descriptions and a start room; the
other five cards are empty collections annotated with their required fields and
rule IDs.

Two optional flags describe a world explicitly:

- `--world <world-id>` sets the world ID recorded in `definition.worldId` and,
  for the owning area, in the `worlds:` entry.
- `--start-area <area-id>` sets that world's `startAreaId` and marks the area
  as the world's owner.

Use both flags when creating the start area of a multi-area world:

```sh
npm run content:scaffold -- entry-interface --world world-wjec-gcse-computer-science-2025-spec --start-area area-entry-interface
```

Only the area named by `--start-area` receives a `worlds:` block; every other
area in that world receives only `definition.worldId`. This is the
single-declaration rule in [§2](#2-authoring-format) and rule D3: a world is
declared once, by the area whose `startAreaId` it names. When `--world` is
omitted the world ID defaults to `world-<area-id>`; when `--start-area` is
omitted the start area defaults to `area-<area-id>`. A plain
`npm run content:scaffold -- <area-id>` uses those defaults.

`worldOption()` in `tools/content/cli.ts` parses the two flags and supplies the
defaults. `roomsScaffold()` in `tools/content/scaffold.ts` adds `worlds:` only
when its `isOwner` check finds that the supplied `startAreaId` equals
`area-<area-id>`. The editor populates scaffolds by briefing writers; writers
never edit the schema, validator or generator.

## 4. Validation

`npm run content:validate` parses every card with the `yaml` package, applies the
Zod shapes and runs the eight cross-artefact gates below as plain TypeScript:
`content-ids`, `quiz-content`, `puzzle-graph`, `world-graph`, `hint-content`,
`hazard-content`, `npc-content` and `score-content`. Findings print as
`path/to/file.yaml:entry — what is wrong — gate ID`, and any finding fails the
command with a non-zero exit code.

A card set is not ready for review or generation until validation passes with no
findings (D5). These eight gates with their boot and test mirrors are the V1
structural-gate rule. Validation is a structural gate before `content-critic`
and `pck-reviewer`, never a replacement for either. `content-critic` checks voice,
fairness and data shape against the rules in their owning documents;
`pck-reviewer` checks accuracy, GCSE depth, terminology and load. Their finding
formats, checks and verdicts live in `content-critic.md` and `pck-reviewer.md`.

ID prefixes come from the fixed set in `tools/content/gates/contentIds.ts` (D2),
including `area-` and `world-`; `content-ids` enforces them. An exit in a rooms card may carry an optional
`blockedText` plain string beside `direction`, `to` and `conditions`; §5 covers
its handoff to the runtime. Both `content-ids` and `hint-content` accept declared
room IDs as hint-sequence targets
([hints.md §2](hints.md#2-model), [§3](hints.md#3-commands-and-delivery)).

### Gate definitions

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
| `content-ids`    | Unique artefact IDs; globally unique aliases across items and actors; ID prefixes from the fixed set in `tools/content/gates/contentIds.ts`; every topic ID used by a card, room, puzzle or quiz resolves to a `## Topic: <id>` heading in `COVERAGE.md` or a declared spec topic; hint targets name a declared topic, puzzle, quiz or room; every exit target, `move-player` target, item `initialRoom` and area `startRoomId` names a declared room; exit directions valid.                                         |
| `quiz-content`   | `1 <= passMark <= questionIds.length`; every questionIds entry names a declared question; every question has at least one correct option within range; explanation non-empty; an AO tag and a difficulty in `authoring`; at least one AO1 and one AO2 per quiz; `onPass` sets `quiz-passed:<id>` and emits `complete-topic`; `onFail` includes `change-lives`.                                                                                                                                                        |
| `puzzle-graph`   | `dependsOn` IDs exist; the graph is acyclic; requirements are action-set flags rather than bare `has-item`; at least two `authoring.clues`; `topicId` names a declared spec topic.                                                                                                                                                                                                                                                                                                                                    |
| `world-graph`    | Exactly one `worlds` declaration per world and every `definition.worldId` resolves; a world is declared by the area its `startAreaId` names; `startAreaId` and that area's `startRoomId` resolve by ID; when several worlds are declared, the world owning the authored start area is first in declaration order, because `GameState.createInitial()` boots from `worlds.all[0]`; every room is reachable from an area's `startRoomId`; every `covered` topic with evidence has a `complete-topic` completion source. |
| `hint-content`   | 2–4 levels in ascending order from 1; unlock keys from the counter namespaces; targets name a declared spec topic, puzzle, quiz or room; no level matches answer-revealing phrasing; `scorePenalty` absent or 0.                                                                                                                                                                                                                                                                                                      |
| `hazard-content` | `authoring.telegraph` present; effects from the shared union and no `set-puzzle-*`; a declared `schedule` has positive `remainingTurns`; the area's `startRoomId` names a declared room.                                                                                                                                                                                                                                                                                                                              |
| `npc-content`    | Defined in [npcs.md §10](npcs.md#10-structural-validation-gates), including the T5 overlap proof. It runs at authoring time and again before generation; it does not run against the runtime bundle.                                                                                                                                                                                                                                                                                                                  |
| `score-content`  | Every room, puzzle and quiz declares a non-negative integer `score`; every `spec-topics.yaml` entry carries the `SpecTopic` fields declared in [application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures) and a non-empty evidence note; the mapped room, puzzle and quiz scores total at most `maxScore` ([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)); every area's `startRoomId` names a declared room.                                              |

### Free-text topic-overlap proof

The T5 proof is owned by [npcs.md §10.1](npcs.md#101-free-text-topic-overlap-proof).
It runs with `npc-content` at authoring time and proves structure only;
usefulness, tone and comprehension are authoring tests in the
[npcs.md A rules](npcs.md#authoring-conversation-rules-a).

## 5. Generation

`npm run content:generate` validates first and, only on success, aggregates all
areas into one generated file per kind:

| Source                          | Generated output                                                                          |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| `docs/content/*/rooms.yaml`     | `src/content/authored/rooms.ts`, `items.ts`, `areas.ts`, `worlds.ts`                      |
| `docs/content/*/npcs.yaml`      | `src/content/authored/actors.ts`, `actor-states.ts`, `conversation-topics.ts`, `nodes.ts` |
| `docs/content/*/quizzes.yaml`   | `src/content/authored/quizzes.ts`, `questions.ts`                                         |
| `docs/content/*/puzzles.yaml`   | `src/content/authored/puzzles.ts`                                                         |
| `docs/content/*/hazards.yaml`   | `src/content/authored/hazards.ts`                                                         |
| `docs/content/*/hints.yaml`     | `src/content/authored/hints.ts`                                                           |
| `docs/content/spec-topics.yaml` | `src/content/authored/spec-topics.ts`                                                     |

Generation is deterministic: entries keep declaration order — areas are visited
in lexicographic order of their directory paths, then entries retain their order
within each file — because
[application-and-ui.md §3.1](application-and-ui.md#31-catalogue-shape) pins
`Catalogue.all` to declaration order and
[shared-rules.md §10](shared-rules.md#10-determinism-and-ordering-rules) requires
declaration-order evaluation. Entries are not sorted by ID: that would break the
order `AreaDefinition.roomIds` is derived from. No timestamps are emitted, and
each file carries a header marking it as generated. `JSON.stringify` emits
embedded newlines as `\n` escapes, so a literal block becomes one escaped line
and each generated entry stays on one line; the 600-line cap is unaffected.

The generated files are committed, so the site remains fully static; Vite never
parses YAML at build or runtime. `src/content/index.ts` exports `loadContent()`,
which assembles the committed catalogues into one `ContentBundle`, and
`GameState.createInitial()` defaults to it.

The authoring-to-bundle mapping is split across two steps. `normalisedCards()`
calls `normaliseExit()` in `tools/content/gates/common.ts` to rename an exit's
`to` field to `targetRoomId` before validation and generation.
`tools/content/adapt.ts` then maps the normalised cards onto the canonical world,
area, room and item shapes: it derives `AreaDefinition.roomIds` from the order of
`rooms`, renames exit `conditions` to `preconditions`, and copies only fields the
runtime types declare. For exits that declare it, `bundleOf()` copies the optional
`blockedText` string into `RoomDefinition.exits`, emitted in
`src/content/authored/rooms.ts` and omitted when the card has no value. For items
that includes `useText`: `bundleOf()` maps the
card's `success` and any `blocked` prose into `ItemDefinition.useText`, omitting
the field when the card has none, and `items.ts` is emitted from that canonical
output. `authoring.useNotes` is not copied: the generator strips the `authoring:`
block from every entry, resolves a node's `topicIds` into embedded `topics` in
declared order, and drops the node's authoring-only `actorId` while keeping a
topic's optional binding. Generation is a mechanical handoff, not a second
authoring pass.

`GameState.createInitial()` boots from the first declared world
(`worlds.all[0]`), then resolves the area by `world.startAreaId` and the room by
`area.startRoomId`, by ID. The opening world is therefore first in declaration
order, which the `world-graph` gate enforces (§4). Unit
tests mix small injected fixtures with assertions over the generated
`loadContent()` bundle.

## 6. Ownership

| Artefact                                                  | Owner                                         |
| --------------------------------------------------------- | --------------------------------------------- |
| `docs/content/**/*.yaml` and `spec-topics.yaml`           | `content-editor` via writers                  |
| `tools/content/**` — schema, validator, gates, generator  | `code-implementer`                            |
| `src/**`, including generated `src/content/authored/*.ts` | `code-implementer`                            |
| `package.json` dependencies (`zod`, `yaml`) and scripts   | `code-implementer`                            |
| `e2e/**` and `playwright.config.ts`                       | `browser-tester`                              |
| `.opencode/scratchpad/slices/<id>/qa-report.md`           | `browser-tester` for UI slices                |
| W7 playtest report and screenshots named in the brief     | `play-tester`, dispatched by `content-editor` |
| `docs/developer/**` — design decisions                    | user-owned design authority                   |
| `docs/developer/**` — style, drift, duplication           | `docs` agent (documentation-style-guide.md)   |
| root `README.md`                                          | `docs` agent                                  |
| `docs/coverage/COVERAGE.md` — form                        | `docs` agent                                  |
| `docs/coverage/COVERAGE.md` — coverage content            | `content-editor`                              |
| `AGENTS.md` (delegation and routing)                      | `docs` agent                                  |
| `opencode.json`, recorded design decisions                | user-owned                                    |

Code agents never write cards or invent course facts; content agents never write
TypeScript, schema or tooling.

## 7. Coverage-graph extraction

The coverage graph is built from `docs/`, so the YAML cards must index as
documents. `docs/.graphifyrc` remaps `.yaml` and `.yml` to document
classification for that build, which lets the semantic pass read card prose and
keep card-derived topic, puzzle and hint nodes.

The repo-root code graph excludes `docs/content/` in `.graphifyignore`; query
the cards through `docs/graphify-out/graph.json` or the `coverage-local` MCP
server. Never add a hand-maintained Markdown duplicate of a card: it would drift
from the YAML. After a change to the toolchain, run `graphify update .` from the
repository root.
