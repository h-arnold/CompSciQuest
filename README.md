# CompSciQuest

Development happens inside the devcontainer in `.devcontainer/`, which runs
as **root** (the host uses rootless Docker, so root inside the container keeps
installs simple).

Preinstalled in the container (versions verified online on 2026-11-24):

| Tool | Version | Source |
| --- | --- | --- |
| Node.js (LTS) + npm | 26.13.x | base image `mcr.microsoft.com/devcontainers/javascript-node:26-bookworm` |
| opencode CLI (v2) | 2.4.x | `curl -fsSL https://opencode.ai/v2/install \| bash` |
| Playwright | 1.65.1 (+ browsers & OS deps via `playwright install --with-deps`) | npm, pinned |
| vite | 8.3.8 | npm, pinned |
| vitest | 5.1.1 | npm, pinned |
| GitHub CLI (`gh`) | latest (v2.105.0 at setup time) | official apt repo `cli.github.com/packages` |
| uv | 0.13.9 | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Graphify CLI (`graphify`, PyPI `graphifyy`) | 0.9.118 on Python 3.12 (uv-managed), with `mcp` + `pdf` extras | `uv tool install --python 3.12 "graphifyy[mcp,pdf]==0.9.118"` |

Graphify is installed **local-only**: `GRAPHIFY_BACKEND=none` in the Dockerfile
disables all LLM/cloud backends, so extraction is deterministic AST parsing with
nothing sent off the machine. No Graphify account, API key, or hosted MCP
endpoint (`https://api.graphify.com/mcp`) is used or configured.

The OpenCode integration is project-scoped in this repo:
`.opencode/skills/graphify/`, `.opencode/plugins/graphify.js`, the `## graphify`
section in `AGENTS.md`, and a local stdio MCP server (`graphify-local`) in
`opencode.json` pointing at `graphify-out/graph.json`. To refresh after a CLI
upgrade, re-run `graphify opencode install --project`.

Build or refresh the local graph with:

```sh
graphify extract . --code-only       # no model calls
graphify cluster-only . --no-label   # report + HTML, no model calls
graphify update .                    # after code changes
```

Open the repo in VS Code and "Reopen in Container" (or `devcontainer up`).
`gh` auth and opencode config/credentials are bind-mounted from the host
(`~/.config/gh`, `~/.config/opencode`, `~/.local/share/opencode`), so run
`gh auth login` inside the container once and it persists on the host.

Note: the bind-mount source directories must already exist on the host —
rootless Docker fails container creation with "invalid mount configuration"
if they don't, so create them once:

```sh
mkdir -p ~/.config/gh ~/.config/opencode ~/.local/share/opencode
```

No `consistency=cached` on the mounts: that option only exists on Docker
Desktop (macOS/Windows) and is rejected/ignored by the Linux daemon.

To bump the pinned npm packages later:

```sh
npm install -g playwright@latest vite@latest vitest@latest
playwright install --with-deps   # refresh browsers if playwright changed
```
