---
type: "query"
date: "2026-11-28T07:31:02.476900+00:00"
question: "Which UI node owns resize/reflow re-pinning of the overflowing transcript, and can an existing owner of scroll positioning be reused?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["OutputLog", ".scrollToLatest()", "GameWindow", "7.1 DOM layout"]
---

# Q: Which UI node owns resize/reflow re-pinning of the overflowing transcript, and can an existing owner of scroll positioning be reused?

## Answer

OutputLog (src/ui/OutputLog.ts L11) owns the scrollable transcript and its scrollToLatest() is the canonical scroll mutator; the resize response belongs there, tracking pinned state from scroll events and delegating to scrollToLatest(). No separate resize owner exists; GameWindow keeps its three existing call sites unchanged and no new import or cross-layer edge was added.

## Outcome

- Signal: useful

## Source Nodes

- OutputLog
- .scrollToLatest()
- GameWindow
- 7.1 DOM layout