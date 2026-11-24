# Graph Report - CompSciQuest  (2026-11-24)

## Corpus Check
- 8 files · ~33,922 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .jsonc 1)

## Summary
- 95 nodes · 103 edges · 14 communities (8 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e039a5cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scripts
- package.json
- eslint.config.js
- devDependencies
- .prettierrc.json
- compilerOptions
- vite
- tsconfig.json
- opencode.json
- main.ts
- opencode.json
- globals
- typescript-7@npm:typescript@^7.0.2
- markdownlint-cli2@^0.24.2

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 25 edges
2. `scripts` - 14 edges
3. `servers` - 4 edges
4. `graphify-local` - 3 edges
5. `coverage-local` - 3 edges
6. `playwright` - 3 edges
7. `@eslint/js` - 3 edges
8. `eslint-plugin-sonarjs` - 3 edges
9. `eslint-plugin-unicorn` - 3 edges
10. `globals` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (14 total, 6 thin omitted)

### Community 0 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, format:check, lint, lint:fix, lint:md (+6 more)

### Community 1 - "package.json"
Cohesion: 0.33
Nodes (5): description, name, private, type, version

### Community 2 - "eslint.config.js"
Cohesion: 0.29
Nodes (6): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, eslint-plugin-unicorn@^80.0.0, @eslint/js, eslint-plugin-sonarjs, eslint-plugin-unicorn

### Community 3 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint@^10.15.0, prettier@^3.10.1, typescript@npm:@typescript/typescript6@^6.0.2, eslint, prettier, typescript

### Community 4 - ".prettierrc.json"
Cohesion: 0.40
Nodes (4): printWidth, proseWrap, singleQuote, trailingComma

### Community 5 - "compilerOptions"
Cohesion: 0.08
Nodes (25): compilerOptions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib (+17 more)

### Community 8 - "opencode.json"
Cohesion: 0.33
Nodes (5): agents, content-editor, permissions, default_agent, $schema

### Community 10 - "opencode.json"
Cohesion: 0.18
Nodes (11): command, type, command, type, mcp, servers, command, type (+3 more)

## Knowledge Gaps
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `compilerOptions` connect `compilerOptions` to `tsconfig.json`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`, `eslint.config.js`, `vite`, `globals`, `typescript-7@npm:typescript@^7.0.2`, `markdownlint-cli2@^0.24.2`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._