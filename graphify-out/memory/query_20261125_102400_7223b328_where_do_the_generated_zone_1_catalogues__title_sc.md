---
type: "query"
date: "2026-11-25T10:24:00.445387+00:00"
question: "Where do the generated zone-1 catalogues, title screen, save controls and view fields come from?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ContentBundle", "TitleScreen", "SaveControls", "GameViewData", "formatEvent"]
---

# Q: Where do the generated zone-1 catalogues, title screen, save controls and view fields come from?

## Answer

Generated TS catalogues in src/content/authored are assembled by src/content/index.ts::loadContent; boot in src/main.ts loads no YAML; TitleScreen, SaveControls, GameViewData and formatEvent live under src/ui and src/application.

## Outcome

- Signal: useful

## Source Nodes

- ContentBundle
- TitleScreen
- SaveControls
- GameViewData
- formatEvent