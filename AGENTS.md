# AGENTS.md

## Project goal

A Zork-style text adventure game shipped as a **static HTML site on GitHub
Pages**. All character/game state and saves live in **browser storage** (no
backend, no server-side state) and must be importable/exportable as a JSON file
containing the full save details. Vite builds the site; Vitest covers game logic
and Playwright covers browser flows, especially storage and JSON save/load.

Game code lives under `src/`, with unit coverage in `tests/` and browser
flows in `e2e/`. Use the
scripts in `package.json` as the source of truth for commands; don't invent
build/test commands.

## Environment

- All development happens in the devcontainer (`.devcontainer/`). It runs as
  **root** intentionally because the host uses rootless Docker; don't "fix" this
  by adding `sudo` or switching `remoteUser`.
- The Dockerfile lives at `.devcontainer/Dockerfile` but its build context is
  `..` (the repo root), so `COPY` paths are root-relative.
- Vite, Vitest, and Playwright are installed **globally in the container** (see
  `README.md` / Dockerfile), and Vite and Vitest are **local devDependencies**
  too: run `npm install` in the repo root as part of setup — the Dockerfile
  does not install project dependencies.
- ESLint and its plugins are **local devDependencies** — plugins must resolve
  from the project. Run `npm run lint` (or `npm run lint:fix`).
- Prettier and `markdownlint-cli2` are local devDependencies too. Run
  `npm run format` / `npm run format:check` for formatting and
  `npm run lint:md` / `npm run lint:md:fix` for Markdown linting. Generated
  Graphify output is excluded from ESLint, Prettier and Markdownlint; imported
  exam-spec Markdown and `.opencode/` files are excluded from formatting.
- opencode v2 comes from `https://opencode.ai/v2/install`. The plain
  `/install` URL installs legacy **v1** — never substitute it when rebuilding or
  reinstalling.
- Bump the pinned global npm tools with
  `npm install -g playwright@latest vite@latest vitest@latest`, then re-run
  `playwright install --with-deps` whenever Playwright changes.

## Project constraints

- The output must be fully static: no runtime server and no server-side saves.
  Persistence goes through browser storage plus the JSON import/export path.
- GitHub Pages serves project sites from a subpath; when Vite is configured,
  its `base` must match the deployed path or built assets will 404.
- Lint config is flat-config `eslint.config.js` using `eslint` recommended,
  `eslint-plugin-unicorn` recommended, and `eslint-plugin-sonarjs` recommended.
  Don't add legacy `.eslintrc*` files.
- Source and test files are capped at **600 lines**, enforced by the `max-lines`
  ESLint rule. When a file would exceed this limit, do not suppress the rule or
  leave the oversized file in place: split it by domain or responsibility into
  two or more new files instead. If more than two files covering the same domain
  are created, keep them together in a new subfolder at the location where the
  original large file lived (for example, split `src/core/Hazards.ts` into
  `src/core/hazards/`). Never split purely by line count — each new file must
  own a coherent domain or responsibility.

## Delegation protocol (code work)

There are three ownership areas with separate workflows. `content-editor` owns
narrative decisions, content cards and coverage decisions; `code-lead` owns
code, tests and browser QA; `docs` maintains all documentation (`docs/**`, root
`README.md`, `AGENTS.md` and agent instruction files). Do not cross the
code/content boundary: content agents never write TypeScript, and code agents
never write design cards or invent course facts. The `docs` agent may edit
content-owned documentation for accuracy and consistency but does not make
creative decisions or invent course facts.
The default agent remains `content-editor`; select `code-lead` for code work.
The workers are subagents, not primaries: `code-lead` dispatches them for code
slices, except that `content-editor` dispatches `play-tester` directly for W7,
and both dispatch the `docs` agent when a slice changes documented behaviour.
For problems where code and content overlap, the leads may dispatch each other
as subagents: `code-lead` dispatches `content-editor`, and `content-editor`
dispatches `code-lead` in return, within the `subagent_depth: 2` limit. The
boundary above still binds either child, and a child `content-editor` reports
its creative decisions to the parent for user approval rather than treating the
brief as approval.

For an accepted content area, `content-editor` hands the V4 trace in
`docs/content/walkthrough.md` to `play-tester` as the expected outcome for a W7
playtest against the generated authored content (V5, owned by `play-tester.md`). The
brief begins `Purpose: content playability and effectiveness review`, and the
tester reads `docs/content/difficulty-and-fairness.md` to assess clue access,
puzzle fairness, hints, combat readability, failure and challenge. The playtest
is blind and player-facing: it plays the running app with ordinary commands
rather than following a scripted walkthrough. Findings about content return to
`content-editor`; code findings go to `code-lead`. `content-editor` never
operates the browser itself. A `code-lead` dispatch for functional verification
begins `Purpose: functional verification only` and skips the difficulty
assessment.

### Agents and ownership

| Agent              | Owns                                                                                                                                                | Scratchpad output                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `test-planner`     | `branch-matrix.md` only                                                                                                                             | `branch-matrix.md`                                  |
| `test-writer`      | `tests/**` (deterministic-core slices)                                                                                                              | `slices/<id>/red-report.md`                         |
| `code-implementer` | `src/**`, `index.html`, `package.json`, `vite.config.ts`                                                                                            | `slices/<id>/implementation.md`                     |
| `code-reviewer`    | nothing — read-only                                                                                                                                 | `slices/<id>/review.md`                             |
| `browser-tester`   | `e2e/**`, `playwright.config.ts`                                                                                                                    | `slices/<id>/qa-report.md` and screenshots          |
| `play-tester`      | Root `PLAYTEST*.md` and `playtest-*.png`; W7 playtest report and screenshots named in the brief                                                     | playtest findings and screenshots                   |
| `docs`             | All documentation: `docs/developer/**`, `docs/content/**`, `docs/coverage/COVERAGE.md` form, root `README.md`, `AGENTS.md`, agent instruction files | `docs-audit/` findings and reviews (reconcile only) |

The ESLint config (`eslint.config.*`) and TypeScript configs (`tsconfig*.json`)
are user-owned. `opencode.json` denies edits to those paths for every agent;
`code-lead` alone has an `ask` rule and may proceed only after the user
explicitly approves the edit. Every other agent must escalate a config change
to the user rather than work around it.

All working artefacts go in `.opencode/scratchpad/`, which is gitignored except
its README. Source, tests and configuration never go there. Every brief names
its exact output path; no agent invents one.

### Running a slice

1. `code-lead` dispatches `test-planner` to create or extend the branch matrix.
   Every row cites a canonical document section; no behaviour is invented.
2. For each slice, brief workers in order: `test-writer` (red Vitest tests for
   named matrix IDs, deterministic-core slices only), `code-implementer`
   (smallest compliant change, then `graphify update .`), `code-reviewer`
   (independent findings), and `browser-tester` for UI-affecting slices (MCP
   exploration, screenshots, accessibility/aesthetics, QA report). UI and
   browser slices skip `test-writer`; they get that report immediately, and E2E
   is authored in a later pass once the affected area's behaviour is confirmed by
   playtest and findings are resolved. See
   [testing.md](docs/developer/testing.md) §Sequencing.
3. For an accepted content area, `content-editor` dispatches `play-tester`
   directly for W7 with `Purpose: content playability and effectiveness review`:
   it plays the running app with ordinary commands, checks the trace's expected
   outcomes against what happens, assesses the difficulty and fairness guidance,
   captures screenshots, and writes the report and screenshots to the paths named
   in the brief. Content findings go to `content-editor`, not to a writer
   directly. A `code-lead` dispatch for functional verification uses
   `Purpose: functional verification only` and skips that assessment.
4. Briefs must be self-contained: child agents have fresh context. Include the
   slice ID, exact matrix IDs, document sections, permitted file paths, output
   path and definition of done.
5. Route every blocker and major finding back to the owning worker. Never accept
   a FAIL verdict, never change a test or expectation to make it pass, and
   escalate `BLOCKED: <reason> — needs <owner>` to the user after two revision
   rounds.
6. Verify with `npm test`, `npm run typecheck`, `npm run lint` and
   `npx prettier --check` on the files the slice changed. The repo-wide
   `npm run format:check` may be red on user-owned docs and configuration and is
   not a gate. `code-lead`, not `test-writer`, owns the final green check.
7. Mark a matrix row `COVERED` only with recorded verification evidence from an
   approved mechanism, with the mechanism and evidence path in the row. See
   [testing.md](docs/developer/testing.md) for the mechanisms and test-value
   filter.

The workflow is contract-first: scaffolding (TypeScript lint support,
`playwright.config.ts` and DTO types) is exempt from red-first; red-first is
mandatory only for the deterministic core — parser, command resolution, effects,
conditions, scoring, persistence, content validation and renderer security
invariants. UI, browser and narrative/player-facing work is verification-led,
with E2E and playtest as the primary gates. Browser work has two passes:
exploration with a QA report and screenshots after implementation, then E2E
authoring once the area's behaviour is confirmed by playtest and findings are
resolved. [testing.md](docs/developer/testing.md) owns that sequencing rule, the
evidence rule, the test-value filter and copy-pinning guidance.
`architecture.md` §12 sets the build order —
persistence, then content registry and UI shell, then hazards and puzzles, NPCs,
quiz combat and hints. Lint bootstrap and the parser slice are lead additions;
the final content check is the W7 playtest required for each accepted area by
V5 (`play-tester.md`), not a §12 requirement.

### Graphify in every code brief

- Start with `graphify reflect --if-stale` and read
  `graphify-out/reflections/LESSONS.md` when present.
- Before the first grep or source read for a codebase question, expand it into
  tokens taken literally from node labels in `graphify-out/graph.json` (there is
  no guaranteed root `.vocab.txt`), print the expansion, run
  `graphify query "<tokens>"` and cite `source_location`. Use `path`, `explain`,
  `section`, `affected` and `god-nodes` for focus.
- Every worker report includes a short "Graph trace" naming the tokens and cited
  nodes. `code-implementer` and `code-reviewer` also include a full duplication
  audit: canonical labels defined twice, hubs bypassed instead of reused,
  unexpected new hubs and cross-layer edges. Graph edges are leads to confirm in
  source, never verdicts; INFERRED edges are weaker than EXTRACTED ones.
- Use `graphify save-result --outcome useful|dead_end|corrected` to feed lessons
  back, except from the read-only reviewer. Keep the codebase and coverage graphs
  separate as described below.

## Documentation management

- `docs/developer/documentation-style-guide.md` is the source of truth for
  documentation style, ownership, structure and audit scope. Link to it;
  never restate its rules.
- **Same-change documentation obligation.** A change that alters documented
  behaviour carries its documentation update in the same slice, delegated to
  the `docs` agent (`.opencode/agents/docs.md`). This binds `code-lead` and
  `content-editor` alike. The `docs` agent maintains `docs/content/**` as well
  as `docs/developer/**`; only creative decisions and course facts stay with
  `content-editor` and the user.
- AGENTS files route; documentation files own policy; recorded design
  decisions in `docs/developer/**` remain user-owned
  (`content-toolchain.md` §6). Keep `AGENTS.md` cross-cutting: module rules
  live in the doc that owns the subject and are linked from here.
  The `docs` agent maintains all docs under user direction, including
  `docs/content/**`, and may update `AGENTS.md` when a workflow or delegation
  change requires it; `opencode.json` remains user-owned, and the `docs` agent
  proposes changes to it rather than applying edits.
- `docs/coverage/COVERAGE.md` is split-governed: coverage decisions to
  `content-editor`, form to the `docs` agent.
- `.opencode/agents/code-reviewer.md` keeps a "Key documentation references"
  section; the `docs` agent keeps it synchronised, along with
  `docs/developer/README.md`.

## Language and tone

- Use **British English at all times** — in documentation, code comments, commit
  messages, agent prompts and all game text. Prefer `-ise`/`-isation`, "colour",
  "behaviour" and "organise"; use British punctuation and date order; never slip
  into American spellings.
- The `content-editor` agent should aim to weave **subtle Welsh references** into
  the game world where appropriate: place and character names, turns of phrase
  and small cultural details. Keep them accurate and unobtrusive — they should
  enrich the setting, not become a lesson or obscure the GCSE content. The exam
  specification remains the authority for all course facts.
- **BANNED WORDS/PHRASES:** You are banned from using the following words **unless** you plan on using them in the most literal sense **and** no other word would be appropriate.
  - Quiet/quietly
  - Honest, honestly
  - Caveat/Caveats
  - Delve/delveing/delves
  - Tapestry/tapestries
  - "The thing nobody..." (and variations on that)
  - "Needs to be owed" / "owed" (unless it literally refers to a debt the player must repay; otherwise it is unclear)

## Host gotchas

- The three bind-mount source dirs must exist on the **host** before `devcontainer up`,
  or container creation fails with "invalid mount configuration":
  `mkdir -p ~/.config/gh ~/.config/opencode ~/.local/share/opencode`.
- Never add `consistency=cached` to those mounts — it is a Docker Desktop option
  and the Linux/rootless daemon rejects it.
- `~/.config/gh`, `~/.config/opencode`, and `~/.local/share/opencode` are bind-mounted,
  so `gh auth login` and opencode config/credentials are done once and persist
  on the host.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:

- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

### Two separate graphs

- **Codebase graph** — `graphify-out/graph.json` at the repo root, exposed as MCP server `graphify-local`. AST-only; refresh with `graphify update .` (or git hooks). Use it for how the game code is structured and connected.
- **Coverage graph** — `docs/graphify-out/graph.json`, exposed as MCP server `coverage-local`. Built from the `docs/` folder so it includes `docs/exam-specs/*.pdf` and `docs/coverage/COVERAGE.md`. Use it for specification topics and how they map to rooms/game content. It needs a semantic backend (the OpenCode session's model via the graphify skill, or Ollama); its `graph.json` does not exist until the first build, so `coverage-local` will appear unavailable until then.
- `docs/coverage/COVERAGE.md` is the authoritative spec → topic → room → code mapping. The coverage graph is evidence, not proof: check confidence-tagged edges and PDF citations before treating a topic as covered. An absent path is not proof of a gap.
- Root `.graphifyignore` keeps `docs/exam-specs/` and coverage graph outputs out of the codebase scan. Keep it — otherwise a full scan at the repo root would pull the specification into the code graph.
- Choose the graph by MCP tool namespace: `graphify-local` for code, `coverage-local` for source material/coverage. CLI equivalents: from the repo root, `graphify query "..."` reads the code graph; from `docs/` it reads the coverage graph, or pass `--graph <path>` explicitly.
- To build the coverage graph, change the working directory to `docs/` first — the graphify skill always writes `graphify-out/` relative to the current directory — then use the skill on that folder. Never run the coverage build from the repo root: it would overwrite `graphify-out/graph.json`, the codebase graph. For strictly offline extraction use `cd docs` then `graphify extract . --backend ollama --max-concurrency 1` (requires the `ollama` extra; CLI flags override `GRAPHIFY_BACKEND=none`). Rebuild the coverage graph only when the spec or coverage map changes.
