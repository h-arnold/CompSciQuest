# Graph Report - CompSciQuest  (2026-11-24)

## Corpus Check
- 7 files · ~18,835 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 3)

## Summary
- 79 nodes · 86 edges · 11 communities (6 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `92548137`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scripts
- package.json
- eslint.config.js
- devDependencies
- eslint-plugin-unicorn
- compilerOptions
- vite
- tsconfig.json
- eslint-plugin-sonarjs
- main.ts
- opencode.json

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 25 edges
2. `scripts` - 10 edges
3. `servers` - 3 edges
4. `graphify-local` - 3 edges
5. `coverage-local` - 3 edges
6. `@eslint/js` - 3 edges
7. `globals` - 3 edges
8. `eslint-plugin-unicorn` - 3 edges
9. `vite` - 3 edges
10. `eslint-plugin-sonarjs` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (11 total, 5 thin omitted)

### Community 0 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, lint, lint:fix, preview, test, test:e2e (+2 more)

### Community 1 - "package.json"
Cohesion: 0.33
Nodes (5): description, name, private, type, version

### Community 2 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): @eslint/js@^10.0.1, globals@^17.14.0, @eslint/js, globals

### Community 3 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint@^10.15.0, typescript@npm:@typescript/typescript6@^6.0.2, typescript-7@npm:typescript@^7.0.2, eslint, typescript, typescript-7

### Community 5 - "compilerOptions"
Cohesion: 0.08
Nodes (25): compilerOptions, allowUnreachableCode, allowUnusedLabels, erasableSyntaxOnly, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib (+17 more)

### Community 10 - "opencode.json"
Cohesion: 0.14
Nodes (13): agents, content-editor, permissions, command, type, default_agent, command, type (+5 more)

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `compilerOptions` connect `compilerOptions` to `tsconfig.json`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Should `opencode.json` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`, `eslint.config.js`, `eslint-plugin-unicorn`, `vite`, `eslint-plugin-sonarjs`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._