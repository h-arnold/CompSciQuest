# Content toolchain (design)

**Status:** approved design contract · Last updated: 2026-11-24

Part of the CompSciQuest design set: [architecture](architecture.md) ·
[application and UI](application-and-ui.md) · [content rules](content-rules.md) ·
[shared rule spine](shared-rules.md).

## 1. Purpose

This document defines how approved content is authored, validated and turned
into the runtime `ContentBundle`. The authority order in
[content-rules.md §1](content-rules.md#1-purpose-and-authority) still applies:
this document specifies the **mechanism**, not new course facts or narrative. The
rulebook and the subsystem documents own what a card means; this document owns
how it is stored, checked and generated.

## 2. Authoring format

YAML is the sole authoring format. One file per (area, kind), under
`docs/content/<area-id>/`:

| Kind   | File           | Top-level collections                                              |
| ------ | -------------- | ------------------------------------------------------------------ |
| area   | `rooms.yaml`   | `definition`, `worlds`, `rooms`, `items`                           |
| npc    | `npcs.yaml`    | `actors`, `actorStates`, `conversationTopics`, `conversationNodes` |
| quiz   | `quizzes.yaml` | `quizzes`, `questions`                                             |
| puzzle | `puzzles.yaml` | `puzzles`                                                          |
| hazard | `hazards.yaml` | `hazards`                                                          |
| hint   | `hints.yaml`   | `hintSequences`                                                    |

`docs/content/spec-topics.yaml` is the single non-per-area exception: it holds
spec topics across all areas. Every file carries document metadata and one or
more collections:

```yaml
kind: area
areaId: 1-2-1-data-representation
status: draft # draft | reviewed | approved
topicIds: [data-types, number-conversion]

definition:
  id: area-1-2-1-data-representation
  worldId: world-1-2-1-data-representation
  name: The Switchyard
  startRoomId: room-binary-hall
  lives: 3

worlds:
  - id: world-1-2-1-data-representation
    name: The Switchyard
    areaIds: [area-1-2-1-data-representation]
    startAreaId: area-1-2-1-data-representation
    lives: 3

rooms:
  - id: room-entry-interface
    title: The Interface
    aliases: [interface, entry, hub]
    description: >-
      A narrow interface glows around you, with a single arrow painted east.
    topicIds: [ai-ethics-and-implications]
    exits:
      - direction: east
        to: room-switch-floor
    score: 0
    authoring:
      interesting: The worn, repeated verdict.
      pillar: [P-a, P-e]
```

Three conventions are binding:

- **Prose uses block scalars** (`>-` or `|-`). Long descriptions stay readable
  and literal text, including the WJEC email address, survives unchanged.
- **Authoring metadata lives under `authoring:`**. Keys such as `interesting`,
  `pillar`, `telegraph`, `clues`, `useNotes`, `fixtureNotes`, `role`, `voice`,
  `motivation`, `relationship`, `misconception`, `assessmentObjective` and
  `difficulty` are dropped wholesale by the generator and never reach the
  engine. A stray authoring key outside that block is a validation finding.
- **Runtime field names come from the subsystem documents**, not from this
  file or from the Zod schema. Optional fields are omitted rather than set to
  `null`. Conditions, triggers and effects use only the unions in
  `shared-rules.md`. ID prefixes follow the registry in
  [content-rules.md §5](content-rules.md#5-id-and-alias-registry), extended in
  this change to cover `area-` and `world-` as well as the existing prefixes.
  Adding those prefixes to the user-owned rulebook is a prerequisite for the
  `content-ids` gate and must be done before the validator is written.

A world is declared exactly once, in the `worlds:` collection of the area whose
`startAreaId` it names. Other areas in that world set only
`definition.worldId`; they must not declare a second `worlds` entry. The single
world entry lists every member area in `areaIds`, so aggregation cannot
duplicate a world ID or invent a second start area.

`docs/content/spec-topics.yaml` holds spec topics as they are created. Each entry
follows the `SpecTopic` contract in `architecture.md` §7 — `id`, `title`,
`specReference`, `codeLocation`, `status`, `evidence`, `roomIds` and `maxScore` —
with `id` taken from a `## Topic: <id>` heading in
`docs/coverage/COVERAGE.md`. World/area indexing stays in `SpecTopicCatalogue` and
is not repeated on the entry. These fields are what the `score-content` gate
needs. Query the coverage graph (`graphify` from `docs/`, or the
`coverage-local` MCP server) to find the topics that exist; do not enumerate the
whole specification up front, and do not invent a topic that has no coverage
heading.

There are no Markdown design cards after migration. The YAML files are the only
source of truth; keeping both formats would allow them to drift.

## 3. Scaffolds

`npm run content:scaffold -- <area-id>` writes any missing YAML files for that
area from the schema, with `todo` placeholder entries and comments naming the
required fields and applicable rule IDs. It refuses to overwrite an existing
file unless `--force` is given.

Two optional flags describe a world explicitly:

- `--world <world-id>` sets the world ID recorded in `definition.worldId` and,
  for the owning area, in the `worlds:` entry.
- `--start-area <area-id>` sets that world's `startAreaId` and marks the area
  as the world's owner.

Use both flags when creating the start area of a multi-area world:

```sh
npm run content:scaffold -- entry-interface --world world-wjec-gcse-computer-science-2025-spec --start-area area-entry-interface
```

Only the area whose ID is named by `--start-area` receives a `worlds:` block;
every other area in that world receives only `definition.worldId`. This is the
single-declaration rule in [§2](#2-authoring-format) and rule D3: a world is
declared once, by the area whose `startAreaId` it names, and a second `worlds`
entry is invalid. When `--world` is omitted the world ID defaults to
`world-<area-id>`; when `--start-area` is omitted the start area defaults to
`area-<area-id>`. A plain `npm run content:scaffold -- <area-id>` uses those
defaults.

The mechanism is `worldOption()` in `tools/content/cli.ts` (lines 94–103),
which parses the two flags and supplies the defaults, and `roomsScaffold()` in
`tools/content/scaffold.ts` (lines 41–90), which adds `worlds:` only when
`world?.startAreaId` matches the prefixed area ID `area-${areaId}` (lines 47 and
59–74). The editor populates scaffolds by briefing writers; writers never edit
the schema, the validator or the generator.

## 4. Validation

`npm run content:validate` parses every card with the `yaml` package, applies
Zod shape checks, then runs all eight cross-artifact gates from
[content-rules.md §7](content-rules.md#7-structural-validation-gates)
as plain TypeScript checks: `content-ids`, `quiz-content`, `puzzle-graph`,
`world-graph`, `hint-content`, `hazard-content`, `npc-content` and
`score-content`. These checks cover unique IDs and globally unique aliases,
valid ID prefixes, existing topic IDs, exit and `move-player` targets, quiz and
puzzle rules, acyclic and reachable PDG, at least two clues per puzzle
(decision: 2026-11-25), hint ladders and counter keys, hazard telegraphs and a
declared level start, NPC default topics and topic matches, score budgets per
topic, and reachability of every `covered` topic to `game-won`.

Findings print as `path/to/file.yaml:entry — what is wrong — gate ID`. A single
finding fails the command with a non-zero exit code.

Two classes of check are distinguished:

- **Shared structural gates** — `content-ids`, `puzzle-graph`, `world-graph`,
  `hazard-content` and `score-content` operate on both parsed data and the
  generated `ContentBundle`. The same functions back Vitest and the boot-time
  check in
  [application-and-ui.md §3.3](application-and-ui.md#33-loading-and-validation),
  so authoring, test and boot validation cannot drift for those five.
  `quiz-content`, `hint-content` and `npc-content` are authoring-time only until
  their runtime mirrors land (`DEFERRED_GATES`).
- **Authoring-only checks** — stray keys outside `authoring:`, document
  `status`, and unresolved `todo` placeholders apply only to YAML and cannot run
  against the runtime bundle.

Validation is a gate before independent review, not a replacement for it.
`content-critic` still checks voice, fairness and data shape against the N/P/C/H/D
rules; `pck-reviewer` still checks accuracy, GCSE depth, terminology and load.

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

Two derivations are deterministic and are not authored: `AreaDefinition.roomIds`
is taken from the `rooms[*].id` values in declaration order, and
`ConversationNode.topics` (embedded topic objects at runtime) is resolved from
the node's list of topic IDs. Every other field is copied from YAML.

Generation is deterministic: entries keep stable declaration order — areas are
visited in lexicographic order of their directory paths, then entries retain
their order within each file — because
[application-and-ui.md §3.1](application-and-ui.md#31-catalogue-shape) pins
`Catalogue.all` to declaration order and
[shared-rules.md §11](shared-rules.md#11-determinism-and-ordering-rules) requires
declaration-order evaluation. Entries are not sorted by ID: that would break the
same order that `AreaDefinition.roomIds` is derived from. No timestamps are
emitted, and each file carries a header marking it as generated. Generated files
are committed so the site remains fully static; Vite never parses YAML at build
or runtime. Bundle assembly moves into `src/content/index.ts`, which returns the
generated `ContentBundle`; `loadContent()` uses it. Every consumer that currently
imports `stubBundle` directly must instead receive the injected/generated bundle.
In particular `GameState.createInitial()` must resolve the start world, then the
area by that world's `startAreaId`, then the room by that area's `startRoomId`,
and build the room inventory from the same supplied bundle. It must not select by
array position: lexicographic file order may place an arbitrary room first, and
`Game.newGame()` calls `createInitial()` directly, so the authored start declared
in the YAML and validated by §4 is the only correct boot position. Unit tests use
a separate deterministic fixture, not the generated zone content. The stub fixture
under
`src/content/stub/` loses only its placeholder data and import — the assembly
seam it currently provides is replaced, not deleted.

## 6. Workflow changes

The gates in [content-rules.md §2](content-rules.md#2-workflow-gates) change as
follows. W1 and W2 (bible and approval) are unchanged.

- **W3 — Dispatch.** Briefs name the YAML scaffold path, the relevant schema
  slice, assigned IDs and aliases, topic IDs and the applicable rule IDs. A
  re-brief after an approved design seam lands must restate the exact contract
  (for example `in-room`/`in-area` in `isActive`, shared-rules.md §3) and send
  the card back through validation and both reviewers.
- **W4 — Review.** `content:validate` must pass before either reviewer runs.
  Validation findings route back to the owning writer like any other blocker.
  The editor drafts the V4 walkthrough trace from the same validated data and
  launches the final whole-card-set `content-critic` pass over the YAML plus
  that trace, routing any blocker or major back to the owning writer or the
  bible.
- **W5 — Integrate.** The editor writes the accepted trace to
  `docs/content/walkthrough.md`, updates `docs/coverage/COVERAGE.md` and
  `docs/content/status.md`, extends the trace across all areas and records the
  whole-game verdict when the last zone is integrated, reports to the user what
  changed, what is blocked and the open questions, and then hands the accepted
  area to `code-lead`. The area is not done until this report is made.
- **W6 — Generate.** After the rulebook prefix amendment (§2) is in place,
  `code-lead` runs `npm run content:validate`,
  `npm run content:generate`, `npm test`, `npm run typecheck`, `npm run lint`
  and `npx prettier --check` on the changed files. This replaces the former
  "conversion out of scope" step; it is a mechanical handoff, not a second
  authoring pass.
- **W7 — Browser walkthrough.** `content-editor` dispatches `browser-tester`
  directly to walk
  the accepted area's V4 trace in the running app against the generated
  authored bundle (content-rules.md V5), writing a QA report and screenshots
  into the slice scratchpad. The stub fixture has been retired, so the walkthrough
  uses the area's real content IDs. Content findings return to `content-editor`;
  code findings return to `code-lead`.

## 7. Ownership

| Artefact                                                | Owner                                      |
| ------------------------------------------------------- | ------------------------------------------ |
| `docs/content/**/*.yaml` and `spec-topics.yaml`         | `content-editor` via writers               |
| `tools/content/**`, validator and generator             | `code-lead` via `code-implementer`         |
| `src/content/authored/*.ts` (generated)                 | `code-lead`                                |
| `package.json` dependencies (`zod`, `yaml`) and scripts | `code-lead`                                |
| `e2e/**` and `slices/<id>/qa-report.md`                 | `browser-tester` (W7 via `content-editor`) |
| `docs/developer/*.md`, `AGENTS.md`, `opencode.json`     | user-owned design authority                |

Code agents never write cards or invent course facts; content agents never
write TypeScript, schema or tooling.

## 8. Decisions not revisited

No runtime server and no build-time YAML parsing; generated TypeScript is
committed; spec topics are added incrementally from the coverage graph, not
enumerated in advance; the Zod schema implements the field names defined by the
subsystem documents and changes only to follow them; `content-critic` and
`pck-reviewer` remain independent read-only gates.

## 9. Verification gate

Before the first zone is migrated, confirm that the coverage graph under
`docs/graphify-out/` still builds card-derived topic, puzzle and hint nodes from
YAML. If it does not, add an explicit extraction configuration or a small
Markdown index stored outside `docs/content` and generated from the YAML, so it
cannot become a second source of truth. After any code change to the toolchain,
run `graphify update .` from the repository root.

**Resolved (C0).** Plain graphify classifies `.yaml` as code: its config
extractor emits only generic key nodes (`id`, `description`, …), with no
artefact IDs and no prose, so a YAML card would lose the concept nodes the
Markdown card supplied. The chosen fallback is the explicit extraction
configuration option: `docs/.graphifyrc` remaps `.yaml` and `.yml` to document
classification for builds rooted at `docs/`, so migrated cards reach the
semantic pass. This was verified by running graphify's detector on a sample
card with that config — it is classified as a document, not code. The repo-root
codebase graph is unaffected: it has no `.graphifyrc` and already excludes
`docs/content/`. Re-check semantic nodes after the first zone is migrated; if
the remap does not yield usable card-derived nodes, fall back to a generated
Markdown index outside `docs/content`, never a hand-maintained duplicate.
