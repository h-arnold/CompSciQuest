# AGENTS.md

## Project goal

A Zork-style text adventure game shipped as a **static HTML site on GitHub
Pages**. All character/game state and saves live in **browser storage** (no
backend, no server-side state) and must be importable/exportable as a JSON file
containing the full save details. Vite builds the site; Vitest covers game logic
and Playwright covers browser flows, especially storage and JSON save/load.

No game code yet: the npm package and lint config are scaffolded. Use the
scripts in `package.json` as the source of truth for commands; don't invent
build/test commands.

## Environment

- All development happens in the devcontainer (`.devcontainer/`). It runs as
  **root** intentionally because the host uses rootless Docker; don't "fix" this
  by adding `sudo` or switching `remoteUser`.
- The Dockerfile lives at `.devcontainer/Dockerfile` but its build context is
  `..` (the repo root), so `COPY` paths are root-relative.
- Vite, Vitest, and Playwright are installed **globally in the container** (see
  `README.md` / Dockerfile) with no local `package.json` dependencies for them
  yet; `npm install` in the repo root is not the setup step.
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
