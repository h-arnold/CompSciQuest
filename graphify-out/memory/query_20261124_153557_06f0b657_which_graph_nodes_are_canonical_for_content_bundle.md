---
type: "query"
date: "2026-11-24T15:35:57.957734+00:00"
question: "Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["validateContent,Structural validation gates,ContentBundle,Catalogue<T> (declaration-order registry),Stub content fixture,ID and alias registry"]
---

# Q: Which graph nodes are canonical for content bundle loading, declaration-order catalogues and structural validation gates?

## Answer

Canonical nodes: validateContent and Stub content fixture in docs/developer/application-and-ui.md (§3.3/§3.4); Structural validation gates and ID and alias registry in docs/developer/content-rules.md (§7/§5); ContentBundle at src/content/ContentBundle.ts:L18, Catalogue at src/content/Catalogue.ts:L2, loadContent() at src/content/index.ts:L7. No validateContent code node exists yet. ScoreTracker has three nodes (duplication lead only).

## Outcome

- Signal: useful

## Source Nodes

- validateContent,Structural validation gates,ContentBundle,Catalogue<T> (declaration-order registry),Stub content fixture,ID and alias registry