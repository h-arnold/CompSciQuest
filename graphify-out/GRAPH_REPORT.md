# Graph Report - CompSciQuest  (2026-11-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 27 nodes · 34 edges · 5 communities (4 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2d002212`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4

## God Nodes (most connected - your core abstractions)
1. `scripts` - 9 edges
2. `@eslint/js` - 3 edges
3. `eslint-plugin-sonarjs` - 3 edges
4. `globals` - 3 edges
5. `eslint-plugin-unicorn` - 3 edges
6. `@eslint/js@^10.0.1` - 2 edges
7. `eslint-plugin-sonarjs@^4.2.2` - 2 edges
8. `eslint@^10.15.0` - 2 edges
9. `globals@^17.14.0` - 2 edges
10. `eslint` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (5 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, lint:fix, preview, test, test:e2e (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (5): description, name, private, type, version

### Community 2 - "Community 2"
Cohesion: 0.40
Nodes (4): @eslint/js@^10.0.1, eslint-plugin-sonarjs@^4.2.2, @eslint/js, eslint-plugin-sonarjs

### Community 3 - "Community 3"
Cohesion: 0.40
Nodes (5): devDependencies, eslint@^10.15.0, globals@^17.14.0, eslint, globals

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scripts` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.529) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 3` to `Community 1`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **Why does `@eslint/js` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._