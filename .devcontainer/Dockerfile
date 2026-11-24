# syntax=docker/dockerfile:1
# Base image provides Node.js 26 LTS (26.13.x) + npm.
# Tag "26-bookworm" verified to exist on mcr.microsoft.com (checked 2026-11-24).
FROM mcr.microsoft.com/devcontainers/javascript-node:26-bookworm

# The host runs rootless Docker, so we deliberately run as root inside the
# container: apt, `npm install -g` and `playwright install --with-deps` all
# work without sudo or permission gymnastics.
USER root

# --- GitHub CLI (gh) ---
# Official apt-repo instructions (cli/cli docs/install_linux.md, checked 2026-11-24).
# The apt repo always serves the latest release (v2.105.0 as of 2026-11-24), so no pin needed.
RUN mkdir -p -m 755 /etc/apt/keyrings \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends gh \
    && rm -rf /var/lib/apt/lists/*

# --- opencode CLI v2 (official installer; binary lands in /root/.opencode/bin) ---
# NOTE: https://opencode.ai/install would install legacy v1 — the v2 script is /v2/install.
# Latest release is 2.4.1 (npm package @opencode/cli, checked 2026-11-24).
RUN curl -fsSL https://opencode.ai/v2/install | bash
ENV PATH="/root/.opencode/bin:/root/.local/bin:${PATH}"

# --- Playwright + browsers/OS deps, vite, vitest ---
# Pinned to the latest versions verified against the npm registry on 2026-11-24
# (engines checked: all support Node 26). Bump with `npm install -g <pkg>@latest`.
RUN npm install -g playwright@1.65.1 vite@8.3.8 vitest@5.1.1 \
    && playwright install --with-deps
