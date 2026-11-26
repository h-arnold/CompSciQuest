---
type: "query"
date: "2026-11-26T16:11:51.299007+00:00"
question: "Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["EffectApplier", "areaChangeEvents()", "applyStateEffect()", "applyEntityEffect()", "ContentBundle", "specTopics", ".getByAreaId()", "Quiz", "Puzzle"]
---

# Q: Where does the area-entry life reset live, and how are quizzes/puzzles mapped to the departed area for the issue-15 gate?

## Answer

areaChangeEvents() in src/core/effects/EffectApplier.ts owns the reset; applyEntityEffect() calls it and applyStateEffect() is the sole lives writer. Mapping uses existing ContentBundle.specTopics.getByAreaId(worldId, areaId) from src/core/scoring/SpecTopicCatalogue.ts; quiz passes are state.flags['quiz-passed:<id>'] and puzzle solves are state.puzzles[id].phase === 'solved'. Session.areQuizzesPassed() and ScoreTracker.puzzleSolved() are different responsibilities and were not reused.

## Outcome

- Signal: useful

## Source Nodes

- EffectApplier
- areaChangeEvents()
- applyStateEffect()
- applyEntityEffect()
- ContentBundle
- specTopics
- .getByAreaId()
- Quiz
- Puzzle