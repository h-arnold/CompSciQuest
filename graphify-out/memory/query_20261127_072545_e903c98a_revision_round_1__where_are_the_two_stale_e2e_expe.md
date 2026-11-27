---
type: "query"
date: "2026-11-27T07:25:45.964246+00:00"
question: "Revision round 1: where are the two stale e2e expectations that New Game leaves storage empty and typed load restores a seeded score-7 save, now that .newGame() writes a fresh save?"
contributor: "graphify"
outcome: "useful"
source_nodes: [".newGame()", "Game", "SAVE_KEY", "START_POSITION", "title-and-session.spec.ts", "helpers.ts", "QUARANTINE_DOWNLOAD_NAME", "engine-issue-30-passmark.spec.ts"]
---

# Q: Revision round 1: where are the two stale e2e expectations that New Game leaves storage empty and typed load restores a seeded score-7 save, now that .newGame() writes a fresh save?

## Answer

E2E-BOOT-03 in e2e/title-and-session.spec.ts re-seeds the score-7 save before typed load; ENG24-AUTOSAVE-01 in e2e/engine-issue-24-autosave.spec.ts now asserts a fresh v1 save with turn 0 and START_POSITION after New Game. .newGame() is at src/application/Game.ts L47; SAVE_KEY at e2e/helpers.ts L10; START_POSITION at e2e/helpers.ts L66.

## Outcome

- Signal: useful

## Source Nodes

- .newGame()
- Game
- SAVE_KEY
- START_POSITION
- title-and-session.spec.ts
- helpers.ts
- QUARANTINE_DOWNLOAD_NAME
- engine-issue-30-passmark.spec.ts