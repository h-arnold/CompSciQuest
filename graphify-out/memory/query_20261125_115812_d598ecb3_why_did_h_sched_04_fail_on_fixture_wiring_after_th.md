---
type: "query"
date: "2026-11-25T11:58:12.825376+00:00"
question: "Why did H-SCHED-04 fail on fixture wiring after the scheduler was implemented?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["recordingPhase4Dependencies(),createPhase4(),createScheduler(),.tick(),Scheduler.test.ts,Phase4Dependencies,Scheduler"]
---

# Q: Why did H-SCHED-04 fail on fixture wiring after the scheduler was implemented?

## Answer

The canonical production scheduler is createScheduler() at src/core/scheduling/Scheduler.ts:L14 with tick() at L7. The defect was in the test composition: recordingPhase4Dependencies() at tests/fixtures/mechanics.ts:L220 was overridden by the real scheduler, so no trace hook recorded 'scheduler'. The fix delegates the recording scheduler to the injected real Scheduler instead of replacing it; createPhase4() at src/application/Phase4.ts:L25 then records the scheduler first and returns its real effects.

## Outcome

- Signal: useful

## Source Nodes

- recordingPhase4Dependencies(),createPhase4(),createScheduler(),.tick(),Scheduler.test.ts,Phase4Dependencies,Scheduler