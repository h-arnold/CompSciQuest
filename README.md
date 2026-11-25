# CompSciQuest

Development happens inside the devcontainer in `.devcontainer/`, which runs
as **root** (the host uses rootless Docker, so root inside the container keeps
installs simple).

## Environment and preinstalled tools

The image pins some tools and tracks the latest release for others. The table
names each pin source; run the reporting command to read the installed value.

| Tool                                        | Pin source or reporting command                                                                                                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Node.js (LTS) + npm                         | Base image tag `mcr.microsoft.com/devcontainers/javascript-node:26-bookworm` in `.devcontainer/Dockerfile`; `node --version` reports the installed patch.                                              |
| opencode CLI (v2)                           | Official installer `https://opencode.ai/v2/install` in `.devcontainer/Dockerfile`, tracking the latest v2 release (`/install` installs legacy v1); `opencode --version` reports the installed version. |
| Playwright                                  | Pinned version on the global `npm install -g` line in `.devcontainer/Dockerfile`, plus browsers and OS dependencies from `playwright install --with-deps`; `npm ls -g` reports the installed version.  |
| `@playwright/mcp`                           | Not provisioned by the image. Install it globally in the container with `npm install -g @playwright/mcp@latest`; `npm ls -g` reports the installed version.                                            |
| vite, vitest                                | Pinned versions on the global `npm install -g` line in `.devcontainer/Dockerfile` and caret ranges in the `devDependencies` of `package.json`; `npm ls -g` reports the global version.                 |
| GitHub CLI (`gh`)                           | Official apt repo `cli.github.com/packages`, which tracks the latest release; `gh --version` reports the installed version.                                                                            |
| uv                                          | Installer `curl -LsSf https://astral.sh/uv/install.sh \| sh`, which tracks the latest release; `uv --version` reports the installed version.                                                           |
| Graphify CLI (`graphify`, PyPI `graphifyy`) | Pinned to an exact version on the `uv tool install` line in `.devcontainer/Dockerfile`; `uv tool list` reports the installed version.                                                                  |

## TypeScript and the build

`typescript-7` aliases `typescript@^7.0.2` in `package.json` (the native
compiler). `npm run typecheck` calls its `tsc` binary directly; `npm run build`
runs that check before Vite builds. Vite is also a local devDependency so its
`vite/client` types resolve during type-checking. `vite.config.ts` sets the base
path to `/CompSciQuest/` for GitHub Pages project-site deployment.

The separate `typescript` dependency is the official TypeScript 6 compatibility
shim (`@typescript/typescript6`). `eslint-plugin-sonarjs` still imports the
TypeScript JavaScript API, which TypeScript 7 no longer ships; this is
Microsoft's recommended side-by-side setup until ESLint plugins support TS 7.
See `tsconfig.json` for the strictness and unreachable-code settings.

## Graphify and OpenCode

`GRAPHIFY_BACKEND=none` in `.devcontainer/Dockerfile` disables headless LLM
backends, so `graphify extract` and `graphify update` stay offline and nothing
is sent off the machine. It does not describe the semantic coverage-graph
build, which needs a backend. The repository keeps two graphs with separate
build rules; see [Two separate graphs](AGENTS.md#two-separate-graphs) in the
root `AGENTS.md`.

The OpenCode integration is project-scoped in this repo:
`.opencode/skills/graphify/`, `.opencode/plugins/graphify.js`, the `## graphify`
section in `AGENTS.md`, and local stdio MCP servers in `opencode.json`:
`graphify-local` and `coverage-local` point at their respective `graph.json`
files, and `playwright` runs `playwright-mcp` for browser interactions. To
refresh after a CLI upgrade, re-run `graphify opencode install --project`.

Refresh the code graph after code changes:

```sh
graphify update .
```

## Container setup

Open the repo in VS Code and "Reopen in Container" (or `devcontainer up`).
`gh` auth and opencode config/credentials are bind-mounted from the host
(`~/.config/gh`, `~/.config/opencode`, `~/.local/share/opencode`), so run
`gh auth login` inside the container once and it persists on the host.

The bind-mount source directories must already exist on the host — rootless
Docker fails container creation with "invalid mount configuration" if they do
not, so create them once:

```sh
mkdir -p ~/.config/gh ~/.config/opencode ~/.local/share/opencode
```

No `consistency=cached` on the mounts: that option only exists on Docker
Desktop (macOS/Windows) and is rejected by the Linux daemon.

To bump the globally installed npm tools later:

```sh
npm install -g playwright@latest @playwright/mcp@latest vite@latest vitest@latest
playwright install --with-deps   # refresh browsers if playwright changed
```

## Checking a change

On a fresh checkout, install the project dependencies first. The image installs
the global tools, not the project's own packages:

```sh
npm install
```

Then start the app or check the change:

```sh
npm run dev        # start the Vite dev server
npm run typecheck  # TypeScript 7, no emit
npm test           # Vitest
npm run lint       # ESLint
```

See `package.json` for the full script list.

## Formatting and Markdown linting

Prettier formats code and Markdown; `markdownlint-cli2` lints Markdown. Both
are local devDependencies, configured in `.prettierrc.json`, `.prettierignore`
and `.markdownlint-cli2.jsonc`:

```sh
npm run format          # format all eligible files
npm run format:check    # check formatting without writing changes
npm run lint:md         # lint Markdown
npm run lint:md:fix     # fix auto-fixable Markdown issues
```

Generated Graphify output is excluded from ESLint, Prettier and Markdownlint.
Tool-managed `.opencode/` files and PDF-derived exam-spec Markdown are also
excluded from formatting and Markdown linting.
