# Content toolchain

## 1. Purpose

This document defines how approved content is authored, validated and turned
into the runtime `ContentBundle`. The authority order in
[content-rules.md §1](content-rules.md#1-purpose-and-authority) applies: this
document specifies the **mechanism**, not course facts or narrative. The
rulebook and the subsystem documents own what a card means; this document owns
how it is stored, checked and generated.

## 2. Authoring format

YAML is the sole authoring format. One file per (area, kind) lives under
`docs/content/<area-id>/`; `docs/content/spec-topics.yaml` is the single
non-per-area card and holds spec topics across all areas. Card shape, the
kind-to-file table and the binding conventions are defined in
[content-rules.md §4.1](content-rules.md#41-common-conventions).

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

Card allocation follows [content-rules.md §1](content-rules.md#1-purpose-and-authority);
the validator and generator merge every card into the same catalogue, so this
layout needs no special handling.

A world is declared once, in the `worlds` collection of the area whose
`startAreaId` it names; other areas in that world set only `definition.worldId`
([content-rules.md §4.2](content-rules.md#42-area-and-rooms-card); D3).

`docs/content/spec-topics.yaml` grows as topics are created; do not enumerate
the specification up front. Each entry follows the `SpecTopic` contract in
[application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures) and
`src/core/scoring/SpecTopic.ts`, with `id` taken from a `## Topic: <id>` heading
in `docs/coverage/COVERAGE.md`. World and area indexing stays in
`SpecTopicCatalogue` and is not repeated on the entry; these fields are what
`score-content` needs. Query the coverage graph (`graphify` from `docs/`, or the
`coverage-local` MCP server) to find the topics that exist, and never invent a
topic that has no coverage heading.

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

`npm run content:validate` parses every card, applies the Zod shapes and runs
the eight cross-artefact gates in
[content-rules.md §7](content-rules.md#7-structural-validation-gates) as plain
TypeScript: `content-ids`, `quiz-content`, `puzzle-graph`, `world-graph`,
`hint-content`, `hazard-content`, `npc-content` and `score-content`. §7 defines
what each gate checks and which of them also run against the generated bundle.

ID prefixes follow [content-rules.md §5](content-rules.md#5-id-and-alias-registry),
including `area-` and `world-`; `content-ids` enforces them. An exit in a rooms
card may carry an optional `blockedText` plain string beside `direction`, `to`
and `conditions`; §5 covers its handoff to the runtime. Both `content-ids` and
`hint-content` accept declared room IDs as hint-sequence targets
([hints.md §2](hints.md#2-model), [§3](hints.md#3-commands-and-delivery)).

Findings print as `path/to/file.yaml:entry — what is wrong — gate ID`. A single
finding fails the command with a non-zero exit code. Shape checks — stray
authoring keys, the document `status`, unresolved `todo` placeholders — run only
on YAML and cannot run against the runtime bundle.

Validation is a gate before independent review, not a replacement for it.
`content-critic` checks voice, fairness and data shape against the N/P/C/H/D
rules; `pck-reviewer` checks accuracy, GCSE depth, terminology and load
([content-rules.md §6](content-rules.md#6-reviewer-rubrics)).

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
order, which the `world-graph` gate enforces
([content-rules.md §7](content-rules.md#7-structural-validation-gates)). Unit
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
