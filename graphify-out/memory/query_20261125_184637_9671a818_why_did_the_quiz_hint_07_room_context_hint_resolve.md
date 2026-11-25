---
type: "query"
date: "2026-11-25T18:46:37.707982+00:00"
question: "Why did the QUIZ-HINT-07 room-context hint resolve to the Binary Hall instead of the switch floor?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["HazardSystem,isInitialRoom,isTriggered,room-entered"]
---

# Q: Why did the QUIZ-HINT-07 room-context hint resolve to the Binary Hall instead of the switch floor?

## Answer

The switch-floor heat hazard matched the no-buffered-event current-room fallback on the first turn and moved the player. HazardSystem now uses that fallback only in the area start room; real room-entered events still fire entry hazards, and H-TRIG-04 still passes.

## Outcome

- Signal: corrected

## Source Nodes

- HazardSystem,isInitialRoom,isTriggered,room-entered